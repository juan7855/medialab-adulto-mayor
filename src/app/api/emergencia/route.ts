import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";
import { enviarTelegram, escaparHtml, horaEnPalabras } from "@/lib/telegram";

/**
 * Avisa por Telegram que alguien pidió ayuda desde la pantalla de
 * Emergencia. La llama el cliente (ver LlamadaAvisada.tsx) justo antes de
 * que el teléfono abra la marcación.
 *
 * No guarda nada en la base: no hay tabla para esto y crearla implicaría un
 * `drizzle-kit push` sobre una base compartida con la app del cuidador (ver
 * INTEGRACION-CUIDADOR.md). Si más adelante hace falta historial de
 * emergencias, esa tabla se acuerda primero con esa app.
 */

type Aviso = {
  tipo: "123" | "contacto";
  contacto?: string;
  rol?: string;
};

export async function POST(req: NextRequest) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = (await req.json()) as Aviso;
    if (body?.tipo !== "123" && body?.tipo !== "contacto") {
      return NextResponse.json({ error: "Tipo no válido" }, { status: 400 });
    }

    const fila = await db
      .select({ name: patients.name })
      .from(patients)
      .where(eq(patients.id, patientId))
      .limit(1);

    const nombre = escaparHtml(fila[0]?.name ?? "Un paciente");
    const hora = horaEnPalabras();

    const linea =
      body.tipo === "123"
        ? `🚨 <b>${nombre} pulsó Llamar al 123</b>`
        : `🚨 <b>${nombre} está llamando a ${escaparHtml(
            // El cliente manda un nombre de la lista de contactos; se corta
            // por si alguien pega cualquier cosa en el cuerpo a mano.
            (body.contacto ?? "un contacto").slice(0, 60),
          )}</b>${body.rol ? ` (${escaparHtml(body.rol.slice(0, 40))})` : ""}`;

    await enviarTelegram(
      `${linea}\n\n` +
        `Desde la pantalla de Emergencia, a las ${hora}.\n` +
        `Conviene llamarle para saber cómo está.`,
    );

    // ok: true incluso si Telegram falló. El cliente no hace nada con la
    // respuesta — lo único que importa es que la marcación no se demore.
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
