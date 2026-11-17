import "./load-env";
import { db } from "./index";
import { routines, routineExercises, exercises, patients } from "./schema";
import { eq, and, like } from "drizzle-orm";

/**
 * Siembra el catálogo global de las 5 Rutinas ilustradas (ver
 * recursos/Rutinas_con_avatares.docx) y enlaza las filas de `exercises` que
 * ya tenían "Rutina N · ..." en el nombre (Álvaro y Marta) con su rutina
 * real, más un ejercicio de Rutina 3 (Movilidad) como calentamiento y otro
 * como cierre.
 *
 * Los videoUrl quedan en null acá; src/db/subir-videos-rutinas.ts los
 * completa después de subir los clips a Supabase Storage.
 *
 * Idempotente: si una rutina ya existe (por `number`) no la duplica.
 *
 * Uso: npx tsx src/db/seed-rutinas.ts
 */

interface EjercicioSemilla {
  name: string;
  variant?: string;
  objective: string;
  steps: string[];
}

const RUTINAS: { number: number; name: string; ejercicios: EjercicioSemilla[] }[] = [
  {
    number: 1,
    name: "Equilibrio y Estabilidad al Caminar",
    ejercicios: [
      {
        name: "Elevación plantar bipedestal",
        variant: "Elevación de talones",
        objective: "Fortalecer la pantorrilla para mejorar la estabilidad del tobillo.",
        steps: [
          "Ubícate detrás de una silla firme con los tenis puestos.",
          "Toma aire y sube lentamente a la punta de los pies.",
          "Mantén 2 segundos arriba y baja con control (6 repeticiones).",
        ],
      },
      {
        name: "Abducción de cadera en bipedestación",
        variant: "Elevación lateral de pierna",
        objective: "Activar el glúteo medio para evitar la caída de la pelvis al marchar.",
        steps: [
          "Sosteniéndote de una silla con una mano, lleva la pierna contraria hacia el lado de manera suave.",
          "Regresa al centro con control (5 veces por cada pierna).",
        ],
      },
      {
        name: "Estación unipodal en línea o postura en Tándem",
        variant: "Equilibrio Dinámico",
        objective: "Reducir la base de sustentación para estimular el sistema vestibular.",
        steps: [
          "Coloca un pie justo delante del otro en línea recta.",
          "Mantén la postura respirando con calma durante 5 a 10 segundos y cambia de pie.",
        ],
      },
      {
        name: "Caminata en línea recta talón-punta",
        variant: "Tandem Walking",
        objective: "Mejorar el equilibrio dinámico en desplazamientos estrechos.",
        steps: [
          "Da pasos hacia adelante asegurando que el talón toque la punta del pie contrario.",
          "Avanza de forma muy pausada y controlada (4 a 6 pasos).",
        ],
      },
      {
        name: "Círculos de tobillo en bipedestación",
        variant: "Ankle Circular Mobility",
        objective: "Movilizar las articulaciones de los pies para adaptarse mejor al terreno.",
        steps: [
          "Apoya la punta de un pie elevando levemente el talón y dibuja círculos con el tobillo.",
          "Haz 5 giros hacia la derecha y 5 hacia la izquierda por cada pie.",
        ],
      },
      {
        name: "Desplazamiento lateral de peso",
        variant: "Weight Shifting",
        objective: "Facilitar la transferencia de carga corporal previa a la marcha.",
        steps: [
          "De pie frente al respaldo de una silla, separa los pies a la distancia de los hombros.",
          "Desplaza todo el peso hacia la pierna derecha sintiendo la carga, mantén 3 segundos y alterna hacia la izquierda (8 repeticiones en total).",
        ],
      },
    ],
  },
  {
    number: 2,
    name: "Fuerza Funcional para Extremidades e Independencia",
    ejercicios: [
      {
        name: "Flexión de hombro y codo con resistencia funcional",
        variant: "Tracción escapular",
        objective: "Preservar la fuerza en el tren superior para transporte de cargas.",
        steps: [
          "Sentado con la espalda recta, estira los brazos al frente con las manos abiertas.",
          "Cierra suavemente en puño y dobla los codos hacia el pecho (8 repeticiones).",
        ],
      },
      {
        name: "Test y ejercicio de sedestación a bipedestación",
        variant: "Sit-to-Stand",
        objective: "Entrenar la potencia de transferencia para levantarse sin ayuda.",
        steps: [
          "Sentado en una silla firme, inclina el tronco al frente desde las caderas.",
          "Empuja con las piernas contra el suelo hasta pararte y vuelve a sentarte controlando la bajada (5 a 8 repeticiones).",
        ],
      },
      {
        name: "Extensión de rodilla en sedestación",
        variant: "Fortalecimiento de cuádriceps",
        objective: "Dar mayor soporte a la rodilla al dar cada paso.",
        steps: [
          "Sentado con la espalda recta, extiende una pierna hacia el frente hasta dejarla paralela al suelo.",
          "Sostén 2 segundos arriba y baja con control (6 a 8 repeticiones por pierna).",
        ],
      },
      {
        name: "Flexión dorsal de tobillo",
        variant: "Prevención de tropiezos",
        objective: "Evitar que la punta del pie arrastre al caminar.",
        steps: [
          "Con los talones fijos en el suelo, eleva lo más alto posible las puntas de ambos pies.",
          "Mantén 2 segundos y baja con suavidad (10 repeticiones).",
        ],
      },
      {
        name: "Extensión de codo con resistencia simulada / Press de brazos",
        objective: "Fortalecer pectorales y tríceps para empujar o alzar objetos.",
        steps: [
          "Sentado con los codos doblados a la altura del pecho y palmas hacia abajo, empuja los brazos hacia el frente.",
          "Regresa despacio a la posición inicial (8 a 10 repeticiones).",
        ],
      },
      {
        name: "Tracción de codos hacia atrás en sedestación",
        variant: "Seated Row Simulation",
        objective: "Fortalecer la espalda alta para mejorar la postura y evitar encorvamientos.",
        steps: [
          "Con los brazos estirados al frente, dobla los codos y llévalos firmemente hacia atrás sacando el pecho.",
          "Regresa al frente con control (8 repeticiones).",
        ],
      },
    ],
  },
  {
    number: 3,
    name: "Movilidad, Flexibilidad y Coordinación",
    ejercicios: [
      {
        name: "Movilidad articular activa de columna cervical y cintura escapular",
        objective: "Reducir la rigidez articular en cuello y hombros.",
        steps: [
          "Haz círculos amplios con los hombros hacia atrás (5 veces).",
          "Gira la cabeza despacio hacia la derecha y hacia la izquierda (4 giros por lado).",
        ],
      },
      {
        name: "Entrenamiento de tarea dual motora y cognitiva",
        variant: "Doble Tarea",
        objective: "Estimular la función ejecutiva combinando movimiento y agilidad mental.",
        steps: [
          "Marcha suavemente en el sitio.",
          "Al mismo tiempo, nombra en voz alta frutas o cuenta hacia atrás desde el 20 por 2 minutos.",
        ],
      },
      {
        name: "Inclinación lateral de tronco en sedestación",
        variant: "Trunk Lateral Flexion",
        objective: "Mejorar la flexibilidad de la columna para giros laterales.",
        steps: [
          "Sentado en el borde de la silla, desliza lentamente la mano derecha hacia el suelo por el costado.",
          "Vuelve al centro y haz lo mismo hacia el lado izquierdo (4 inclinaciones por lado).",
        ],
      },
      {
        name: "Flexión y extensión de muñecas y dedos",
        variant: "Wrist and Finger Mobility",
        objective: "Mantener la fuerza de agarre y agilidad en las manos para tareas cotidianas.",
        steps: [
          "Abre bien las manos extendiendo los dedos y ciérralas en puño suavemente (8 veces).",
          "Con los puños cerrados, haz círculos hacia adentro y hacia afuera con las muñecas (5 círculos por dirección).",
        ],
      },
      {
        name: "Rotación de tronco en sedestación",
        variant: "Seated Trunk Rotation",
        objective: "Facilitar giros del cuerpo al mirar hacia los lados.",
        steps: [
          "Con los brazos cruzados sobre el pecho, gira suavemente el tronco hacia la derecha sin mover las caderas.",
          "Vuelve al centro y gira hacia la izquierda (5 giros pausados por lado).",
        ],
      },
      {
        name: "Movilidad y respiración diafragmática profunda",
        objective: "Favorecer la oxigenación celular y relajar la musculatura tras la actividad física.",
        steps: [
          "Toma aire profundamente por la nariz mientras subes los brazos lateralmente.",
          "Baja los brazos exhalando de manera prolongada por la boca (5 ciclos completos).",
        ],
      },
    ],
  },
  {
    number: 4,
    name: "Estabilidad Avanzada y Tren Inferior Funcional",
    ejercicios: [
      {
        name: "Extensiones de rodilla con resistencia simulada",
        variant: "Seated Knee Extensions",
        objective: "Fortalecer cuádriceps para dar soporte a la rótula.",
        steps: [
          "Sentado con la espalda recta, extiende lentamente una pierna al frente hasta que quede paralela al suelo.",
          "Mantén 2 segundos y baja con control (8 repeticiones por pierna).",
        ],
      },
      {
        name: "Desplazamiento lateral de peso con control postural",
        objective: "Afianzar el control corporal en transferencias laterales.",
        steps: [
          "De pie frente a una silla de apoyo, transfiere el peso de una pierna a otra con suavidad.",
          "Mantén el torso erguido en todo momento (8 repeticiones).",
        ],
      },
      {
        name: "Estación unipodal con apoyo leve",
        variant: "Single-Leg Stance",
        objective: "Retar el equilibrio estático de forma segura.",
        steps: [
          "De pie junto a una pared, apoya solo la yema de los dedos de una mano.",
          "Eleva ligeramente un pie del suelo manteniendo la postura por 5 a 10 segundos y cambia de pierna (4 veces por lado).",
        ],
      },
      {
        name: "Extensión de cadera hacia atrás en bipedestación",
        variant: "Hip Extension",
        objective: "Fortalecer glúteos y zona lumbar baja para mantener la postura erguida.",
        steps: [
          "Detrás de una silla, eleva suavemente hacia atrás la pierna derecha estirada sin arquear la espalda.",
          "Mantén 2 segundos y regresa al centro (5 a 6 repeticiones por pierna).",
        ],
      },
      {
        name: "Flexión de rodilla en bipedestación",
        variant: "Standing Knee Flexion",
        objective: "Fortalecer la parte posterior del muslo para mejorar la fluidez de la marcha.",
        steps: [
          "Detrás de una silla, dobla lentamente una rodilla llevando el talón hacia atrás con suavidad.",
          "Baja el pie de forma lenta y alterna con la otra pierna (6 repeticiones por pierna).",
        ],
      },
      {
        name: "Giros corporales controlados",
        variant: "Controlled Body Turns",
        objective: "Prevenir pérdidas de equilibrio al cambiar de dirección en espacios cotidianos.",
        steps: [
          "Da un giro completo y lento hacia la derecha en 4 pequeños pasos circulares.",
          "Detente y haz el giro hacia el lado izquierdo de la misma forma pausada (2 giros completos por cada dirección).",
        ],
      },
    ],
  },
  {
    number: 5,
    name: "Integración Neuromuscular y Coordinación",
    ejercicios: [
      {
        name: "Elevación combinada de brazos y piernas en sedestación",
        variant: "Cross-Pattern",
        objective: "Mejorar la coordinación cruzada simulando el patrón natural al caminar.",
        steps: [
          "Sentado con la espalda recta, eleva al mismo tiempo la rodilla derecha y estira el brazo izquierdo al frente.",
          "Regresa y alterna (10 repeticiones en total, 5 por lado).",
        ],
      },
      {
        name: "Caminata en línea recta con conteo en voz alta",
        variant: "Doble Tarea Avanzada",
        objective: "Entrenar la estabilidad dinámica mientras se procesa información cognitiva.",
        steps: [
          "Camina en línea recta talón-punta de forma controlada.",
          "Mientras avanzas, di en voz alta los meses del año o nombres de animales.",
        ],
      },
      {
        name: "Movilidad articular combinada de hombros y cuello",
        objective: "Disminuir tensiones acumuladas en la parte superior del tronco.",
        steps: [
          "Haz círculos con los hombros hacia adelante y hacia atrás.",
          "Inclina suavemente la cabeza de un lado a otro con extrema precaución (5 repeticiones).",
        ],
      },
      {
        name: "Abducción de cadera en sedestación",
        variant: "Control de cadera sentado",
        objective: "Movilizar y fortalecer los abductores de cadera desde una posición cómoda.",
        steps: [
          "Sentado con los pies juntos, abre lentamente las rodillas hacia los lados manteniendo la planta de los pies apoyada.",
          "Cierra las rodillas de forma controlada (8 repeticiones).",
        ],
      },
      {
        name: "Estiramiento y apertura de pecho en sedestación",
        objective: "Contrarrestar la postura encorvada y mejorar la capacidad respiratoria.",
        steps: [
          "Entrelaza las manos detrás de la espalda (o apóyate en el respaldo) y abre el pecho llevando los hombros hacia atrás.",
          "Respira hondo, mantén 3 segundos y relaja (5 repeticiones).",
        ],
      },
      {
        name: "Marcha suave estática con braceo consciente",
        objective: "Estimular el ritmo cardiovascular ligero y la simulación del patrón de marcha.",
        steps: [
          "De pie con apoyo o sentados, realiza una marcha suave en el sitio elevando poco los pies y acompañando con un braceo natural y alterno.",
          "Mantén el ejercicio durante 1 minuto y medio respirando con control.",
        ],
      },
    ],
  },
];

async function main() {
  const rutinaIdPorNumero = new Map<number, number>();

  for (const rutina of RUTINAS) {
    const [existente] = await db.select().from(routines).where(eq(routines.number, rutina.number));
    let routineId = existente?.id;

    if (!routineId) {
      const [creada] = await db
        .insert(routines)
        .values({ number: rutina.number, name: rutina.name })
        .returning();
      routineId = creada.id;
      console.log(`+ Rutina ${rutina.number} · ${rutina.name}`);
    }
    rutinaIdPorNumero.set(rutina.number, routineId);

    const yaTiene = await db.select().from(routineExercises).where(eq(routineExercises.routineId, routineId));
    if (yaTiene.length > 0) continue;

    for (let i = 0; i < rutina.ejercicios.length; i++) {
      const ej = rutina.ejercicios[i];
      await db.insert(routineExercises).values({
        routineId,
        orderIndex: i + 1,
        name: ej.name,
        variant: ej.variant ?? null,
        objective: ej.objective,
        steps: ej.steps,
      });
    }
    console.log(`  6 ejercicios sembrados para Rutina ${rutina.number}`);
  }

  // Enlaza las filas de `exercises` que ya traían "Rutina N · ..." en el
  // nombre (sembradas al convertir a Álvaro y Marta) con la rutina real, y
  // les pone calentamiento/cierre con dos ejercicios de Rutina 3.
  const rutina3Id = rutinaIdPorNumero.get(3)!;
  const ejerciciosR3 = await db
    .select()
    .from(routineExercises)
    .where(eq(routineExercises.routineId, rutina3Id))
    .orderBy(routineExercises.orderIndex);
  const calentamiento = ejerciciosR3[0]; // Movilidad de cuello y hombros
  const cierre = ejerciciosR3[ejerciciosR3.length - 1]; // Respiración diafragmática

  const todosLosPacientes = await db.select().from(patients);
  for (const paciente of todosLosPacientes) {
    const filas = await db
      .select()
      .from(exercises)
      .where(and(eq(exercises.patientId, paciente.id), like(exercises.name, "Rutina %")));

    for (const fila of filas) {
      const match = fila.name.match(/Rutina\s+(\d+)/);
      if (!match) continue;
      const numero = Number(match[1]);
      const routineId = rutinaIdPorNumero.get(numero);
      if (!routineId) continue;

      await db
        .update(exercises)
        .set({
          routineId,
          warmupExerciseId: numero === 3 ? null : calentamiento.id,
          cooldownExerciseId: numero === 3 ? null : cierre.id,
        })
        .where(eq(exercises.id, fila.id));

      console.log(`  ${paciente.name}: "${fila.name}" -> Rutina ${numero}`);
    }
  }

  console.log("✅ Listo");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
