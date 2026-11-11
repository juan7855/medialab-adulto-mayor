import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  patients,
  medications,
  medicationLogs,
  meals,
  mealLogs,
  waterLogs,
  exerciseLogs,
  routineActivities,
  routineLogs,
  dailyNotes,
} from "@/db/schema";
import {
  enviarTelegram,
  escaparHtml,
  fechaEnPalabras,
  fechaHoyBogota,
  telegramConfigurado,
} from "@/lib/telegram";

/**
 * Informe diario por Telegram: un mensaje por paciente con lo que hizo hoy.
 *
 * Lo dispara el cron de Vercel (ver vercel.json) a las 23:00 UTC = 6:00 p. m.
 * en Colombia: suficientemente tarde para que el día esté casi completo, y
 * aún el mismo día del calendario allá. Por eso la hora no es medianoche:
 * a las 00:00 UTC en Bogotá son las 7 p. m. del día *anterior*, y el informe
 * saldría con la fecha equivocada.
 *
 * Vercel manda `Authorization: Bearer $CRON_SECRET` automáticamente cuando
 * esa variable existe en el proyecto. Sin ese chequeo la ruta quedaría
 * abierta: cualquiera que adivine la URL podría disparar el informe de
 * todos los pacientes a su antojo (no vería el contenido, pero lo haría
 * llegar al chat a cualquier hora).
 */

// El informe lee la base en cada ejecución; nada que cachear.
export const dynamic = "force-dynamic";

/** Agrupa filas por paciente, para no hacer una consulta por persona. */
function porPaciente<T extends { patientId: number }>(filas: T[]): Map<number, T[]> {
  const mapa = new Map<number, T[]>();
  for (const fila of filas) {
    const lista = mapa.get(fila.patientId);
    if (lista) lista.push(fila);
    else mapa.set(fila.patientId, [fila]);
  }
  return mapa;
}

export async function GET(req: NextRequest) {
  const secreto = process.env.CRON_SECRET;

  if (!secreto) {
    console.error("[informe] falta CRON_SECRET");
    return NextResponse.json({ error: "No configurado" }, { status: 500 });
  }

  // El header es lo que manda Vercel. El parámetro ?secret= existe para
  // poder probarlo a mano desde el navegador; queda en los logs de acceso,
  // así que para uso real vale el header.
  const autorizado =
    req.headers.get("authorization") === `Bearer ${secreto}` ||
    req.nextUrl.searchParams.get("secret") === secreto;

  if (!autorizado) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!telegramConfigurado()) {
    return NextResponse.json({ error: "Telegram no configurado" }, { status: 500 });
  }

  try {
    // ?date=YYYY-MM-DD para reenviar el informe de otro día (pruebas).
    const fecha = req.nextUrl.searchParams.get("date") ?? fechaHoyBogota();

    // Diez consultas en total, no diez por paciente: se trae todo lo del
    // día de una vez y se agrupa en memoria. Con decenas de pacientes esto
    // es un puñado de filas.
    const [
      personas,
      medicamentos,
      logsMedicamentos,
      comidas,
      logsComidas,
      logsAgua,
      logsEjercicio,
      actividades,
      logsRutina,
      notas,
    ] = await Promise.all([
      db.select({ id: patients.id, name: patients.name }).from(patients),
      db
        .select({
          id: medications.id,
          patientId: medications.patientId,
          name: medications.name,
          time: medications.time,
        })
        .from(medications)
        .where(eq(medications.active, true)),
      db
        .select({
          patientId: medicationLogs.patientId,
          medicationId: medicationLogs.medicationId,
          taken: medicationLogs.taken,
        })
        .from(medicationLogs)
        .where(eq(medicationLogs.date, fecha)),
      db.select({ id: meals.id, patientId: meals.patientId, name: meals.name }).from(meals),
      db
        .select({ patientId: mealLogs.patientId, mealId: mealLogs.mealId, eaten: mealLogs.eaten })
        .from(mealLogs)
        .where(eq(mealLogs.date, fecha)),
      db
        .select({ patientId: waterLogs.patientId, glasses: waterLogs.glasses })
        .from(waterLogs)
        .where(eq(waterLogs.date, fecha)),
      db
        .select({
          patientId: exerciseLogs.patientId,
          minutes: exerciseLogs.minutes,
          durationSeconds: exerciseLogs.durationSeconds,
          completed: exerciseLogs.completed,
        })
        .from(exerciseLogs)
        .where(eq(exerciseLogs.date, fecha)),
      db
        .select({ id: routineActivities.id, patientId: routineActivities.patientId })
        .from(routineActivities),
      db
        .select({
          patientId: routineLogs.patientId,
          activityId: routineLogs.activityId,
          completed: routineLogs.completed,
        })
        .from(routineLogs)
        .where(eq(routineLogs.date, fecha)),
      db
        .select({ patientId: dailyNotes.patientId, note: dailyNotes.note })
        .from(dailyNotes)
        .where(eq(dailyNotes.date, fecha)),
    ]);

    const medsPor = porPaciente(medicamentos);
    const logsMedsPor = porPaciente(logsMedicamentos);
    const comidasPor = porPaciente(comidas);
    const logsComidasPor = porPaciente(logsComidas);
    const aguaPor = porPaciente(logsAgua);
    const ejercicioPor = porPaciente(logsEjercicio);
    const actividadesPor = porPaciente(actividades);
    const logsRutinaPor = porPaciente(logsRutina);
    const notasPor = porPaciente(notas);

    const dia = fechaEnPalabras(fecha);
    let enviados = 0;

    for (const persona of personas) {
      const lineas: string[] = [`<b>Informe de ${escaparHtml(persona.name)}</b>`, dia, ""];

      // Medicamentos: cuántos de los programados se marcaron, y cuáles no.
      const meds = medsPor.get(persona.id) ?? [];
      if (meds.length > 0) {
        const tomados = new Set(
          (logsMedsPor.get(persona.id) ?? []).filter((l) => l.taken).map((l) => l.medicationId),
        );
        const faltan = meds.filter((m) => !tomados.has(m.id));
        lineas.push(`💊 Medicamentos: ${tomados.size} de ${meds.length}`);
        if (faltan.length > 0) {
          lineas.push(
            `   Sin marcar: ${faltan
              .map((m) => `${escaparHtml(m.name)} (${escaparHtml(m.time)})`)
              .join(", ")}`,
          );
        }
      }

      // Comidas.
      const susComidas = comidasPor.get(persona.id) ?? [];
      if (susComidas.length > 0) {
        const comio = new Set(
          (logsComidasPor.get(persona.id) ?? []).filter((l) => l.eaten).map((l) => l.mealId),
        );
        const faltan = susComidas.filter((c) => !comio.has(c.id));
        lineas.push(`🍽 Comidas: ${comio.size} de ${susComidas.length}`);
        if (faltan.length > 0) {
          lineas.push(`   Sin marcar: ${faltan.map((c) => escaparHtml(c.name)).join(", ")}`);
        }
      }

      // Agua: puede haber más de una fila por día si se registró por partes.
      const vasos = (aguaPor.get(persona.id) ?? []).reduce((suma, f) => suma + f.glasses, 0);
      lineas.push(`💧 Agua: ${vasos} ${vasos === 1 ? "vaso" : "vasos"}`);

      // Ejercicio: `minutes` lo escribe la app del cuidador, `durationSeconds`
      // es lo que mide esta app. Se usa lo que haya.
      const ejercicios = (ejercicioPor.get(persona.id) ?? []).filter((e) => e.completed);
      const minutos = ejercicios.reduce(
        (suma, e) => suma + (e.minutes || Math.round((e.durationSeconds ?? 0) / 60)),
        0,
      );
      lineas.push(
        ejercicios.length === 0
          ? "🏃 Ejercicio: nada registrado"
          : `🏃 Ejercicio: ${ejercicios.length} ${
              ejercicios.length === 1 ? "actividad" : "actividades"
            }${minutos > 0 ? `, ${minutos} min` : ""}`,
      );

      // Rutina.
      const susActividades = actividadesPor.get(persona.id) ?? [];
      if (susActividades.length > 0) {
        const hechas = new Set(
          (logsRutinaPor.get(persona.id) ?? []).filter((l) => l.completed).map((l) => l.activityId),
        );
        lineas.push(`📋 Rutina: ${hechas.size} de ${susActividades.length}`);
      }

      // Cómo dijo que se sentía al entrar. Lo más valioso del informe, y lo
      // único con palabras suyas: va al final para que cierre el mensaje.
      const nota = notasPor.get(persona.id)?.[0]?.note;
      if (nota) {
        lineas.push("", `📝 «${escaparHtml(nota.slice(0, 400))}»`);
      }

      if (await enviarTelegram(lineas.join("\n"))) enviados += 1;
    }

    return NextResponse.json({ ok: true, fecha, pacientes: personas.length, enviados });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
