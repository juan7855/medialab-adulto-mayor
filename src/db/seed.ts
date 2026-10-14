import "./load-env";
import { db } from "./index";
import { patients, medications, routineActivities, exercises, cognitiveActivities, meals } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Crea (o encuentra) un paciente y le siembra medicamentos, rutina,
 * ejercicios, actividades de Mente Activa y menú de ejemplo — todo lo que
 * antes era contenido fijo en el código, ahora propio de cada paciente.
 * Cada bloque se siembra sólo si el paciente todavía no tiene nada ahí, así
 * que correrlo de nuevo sobre un paciente existente sólo rellena lo que le
 * falte (por ejemplo, a los pacientes creados antes de que existiera el
 * catálogo de ejercicios).
 *
 * Uso: npx tsx src/db/seed.ts "Nombre del paciente" 1234
 */
async function seed() {
  const [nombre, pin] = process.argv.slice(2);

  if (!nombre || !pin) {
    console.error('Uso: npx tsx src/db/seed.ts "Nombre del paciente" 1234');
    process.exit(1);
  }

  if (!/^\d{4}$/.test(pin)) {
    console.error("La clave debe tener exactamente 4 dígitos.");
    process.exit(1);
  }

  console.log(`🌱 Sembrando datos para "${nombre}"...`);

  let [paciente] = await db.select().from(patients).where(eq(patients.pin, pin)).limit(1);

  if (!paciente) {
    [paciente] = await db.insert(patients).values({ name: nombre, pin }).returning();
    console.log(`✅ Paciente creado: ${paciente.name} (id ${paciente.id}, clave ${pin})`);
  } else {
    console.log(`⏭ Ya existe un paciente con esa clave: ${paciente.name} (id ${paciente.id})`);
  }

  const patientId = paciente.id;

  // Medicamentos
  const existingMeds = await db
    .select()
    .from(medications)
    .where(eq(medications.patientId, patientId))
    .limit(1);

  if (existingMeds.length === 0) {
    await db.insert(medications).values([
      {
        patientId,
        name: "Metformina",
        dose: "500mg – 1 pastilla",
        time: "08:00 AM",
        imageEmoji: "💊",
        color: "#4186F6",
      },
      {
        patientId,
        name: "Atorvastatina",
        dose: "20mg – 1 pastilla",
        time: "08:00 AM",
        imageEmoji: "🔵",
        color: "#C162CE",
      },
      {
        patientId,
        name: "Losartán",
        dose: "50mg – 1 pastilla",
        time: "12:00 PM",
        imageEmoji: "🟡",
        color: "#7ECF6D",
      },
      {
        patientId,
        name: "Omeprazol",
        dose: "20mg – 1 pastilla",
        time: "07:30 AM",
        imageEmoji: "💉",
        color: "#70CAE6",
      },
    ]);
    console.log("✅ Medicamentos sembrados");
  } else {
    console.log("⏭ Este paciente ya tiene medicamentos");
  }

  // Rutina
  const existingActivities = await db
    .select()
    .from(routineActivities)
    .where(eq(routineActivities.patientId, patientId))
    .limit(1);

  if (existingActivities.length === 0) {
    await db.insert(routineActivities).values([
      {
        patientId,
        title: "Tomar medicamentos",
        description: "Pastillas de la mañana con agua",
        timeOfDay: "morning",
        scheduledTime: "08:00",
        emoji: "💊",
        isRecurring: true,
      },
      {
        patientId,
        title: "Desayuno saludable",
        description: "Avena o huevo con fruta",
        timeOfDay: "morning",
        scheduledTime: "08:30",
        emoji: "🍳",
        isRecurring: true,
      },
      {
        patientId,
        title: "Caminata matutina",
        description: "15 minutos al aire libre",
        timeOfDay: "morning",
        scheduledTime: "09:30",
        emoji: "🚶",
        isRecurring: true,
      },
      {
        patientId,
        title: "Ejercicios de estiramiento",
        description: "10 minutos sentado",
        timeOfDay: "morning",
        scheduledTime: "10:00",
        emoji: "🧘",
        isRecurring: true,
      },
      {
        patientId,
        title: "Almuerzo",
        description: "Comida balanceada con verduras",
        timeOfDay: "afternoon",
        scheduledTime: "12:30",
        emoji: "🍲",
        isRecurring: true,
      },
      {
        patientId,
        title: "Pastilla del mediodía",
        description: "Losartán 50mg",
        timeOfDay: "afternoon",
        scheduledTime: "12:00",
        emoji: "💊",
        isRecurring: true,
      },
      {
        patientId,
        title: "Siesta",
        description: "Descanso de 30 minutos",
        timeOfDay: "afternoon",
        scheduledTime: "14:00",
        emoji: "😴",
        isRecurring: true,
      },
      {
        patientId,
        title: "Llamar a familiar",
        description: "Hablar con hijo/a o familiar",
        timeOfDay: "afternoon",
        scheduledTime: "16:00",
        emoji: "📞",
        isRecurring: true,
      },
      {
        patientId,
        title: "Cena ligera",
        description: "Ensalada o sopa",
        timeOfDay: "evening",
        scheduledTime: "19:00",
        emoji: "🥗",
        isRecurring: true,
      },
      {
        patientId,
        title: "Lectura o TV",
        description: "Actividad de relajación",
        timeOfDay: "evening",
        scheduledTime: "20:00",
        emoji: "📺",
        isRecurring: true,
      },
      {
        patientId,
        title: "Preparar para dormir",
        description: "Higiene y descanso",
        timeOfDay: "evening",
        scheduledTime: "21:30",
        emoji: "🛏",
        isRecurring: true,
      },
    ]);
    console.log("✅ Rutina sembrada");
  } else {
    console.log("⏭ Este paciente ya tiene rutina");
  }

  // Ejercicios
  const existingExercises = await db
    .select()
    .from(exercises)
    .where(eq(exercises.patientId, patientId))
    .limit(1);

  if (existingExercises.length === 0) {
    await db.insert(exercises).values([
      {
        patientId,
        name: "Caminata Suave",
        level: "Ligero",
        emoji: "🚶",
        durationSeconds: 900,
        description: "Caminata pausada para activar el cuerpo",
        steps: [
          "Póngase ropa cómoda y zapatos antideslizantes",
          "Comience caminando despacio durante 2 minutos",
          "Mantenga la espalda recta y los brazos relajados",
          "Camine a paso normal durante 10 minutos",
          "Termine con 3 minutos de caminata muy lenta",
        ],
        tip: "Si siente dolor, deténgase y descanse.",
      },
      {
        patientId,
        name: "Estiramiento",
        level: "Ligero",
        emoji: "🧘",
        durationSeconds: 600,
        description: "Ejercicios de flexibilidad sentado",
        steps: [
          "Siéntese en una silla firme con los pies en el suelo",
          "Gire el cuello lentamente de lado a lado (5 veces)",
          "Levante los brazos sobre la cabeza y baja lentamente (8 veces)",
          "Estire las piernas hacia adelante una a una (5 veces)",
          "Respire profundo 5 veces para terminar",
        ],
        tip: "Haga cada movimiento sin prisa y sin dolor.",
      },
      {
        patientId,
        name: "Equilibrio",
        level: "Moderado",
        emoji: "⚖️",
        durationSeconds: 720,
        description: "Ejercicios para mejorar el equilibrio",
        steps: [
          "Párese junto a una silla o pared para apoyo",
          "Levante un pie del suelo por 10 segundos",
          "Repita con el otro pie (5 veces cada uno)",
          "Camine talón-punta en línea recta (10 pasos)",
          "Descanse sentado 2 minutos",
        ],
        tip: "Tenga siempre algo cerca para apoyarse.",
      },
      {
        patientId,
        name: "Fuerza Suave",
        level: "Moderado",
        emoji: "💪",
        durationSeconds: 900,
        description: "Ejercicios de fuerza sin pesas",
        steps: [
          "Siéntese y levántese de la silla sin usar los brazos (8 veces)",
          "Apriete y suelte los puños durante 30 segundos",
          "Levante los talones del suelo parado (10 veces)",
          "Haga pequeños círculos con los hombros (5 cada dirección)",
          "Termine con respiración profunda",
        ],
        tip: "Descanse 1 minuto entre cada ejercicio.",
      },
    ]);
    console.log("✅ Ejercicios sembrados");
  } else {
    console.log("⏭ Este paciente ya tiene ejercicios");
  }

  // Mente activa
  const existingCognitive = await db
    .select()
    .from(cognitiveActivities)
    .where(eq(cognitiveActivities.patientId, patientId))
    .limit(1);

  if (existingCognitive.length === 0) {
    await db.insert(cognitiveActivities).values([
      {
        patientId,
        name: "Memoria de palabras",
        level: "Fácil",
        emoji: "🧠",
        durationLabel: "5 min",
        description: "Recuerde una lista corta de palabras",
        steps: [
          "Busque papel y lápiz, y siéntese con tranquilidad",
          "Escriba 8 palabras cualquiera: pan, silla, río, reloj...",
          "Léalas en voz alta dos veces, sin prisa",
          "Tape la hoja y espere un minuto mirando por la ventana",
          "Escriba todas las que recuerde y luego compare",
        ],
        tip: "No importa cuántas recuerde hoy. Lo que ayuda es repetirlo cada día.",
      },
      {
        patientId,
        name: "Cuentas del día",
        level: "Fácil",
        emoji: "🧮",
        durationLabel: "5 min",
        description: "Cálculo mental con cosas de casa",
        steps: [
          "Piense en el precio de tres cosas que compra seguido",
          "Súmelas de cabeza, sin papel",
          "Ahora calcule cuánto sería si comprara dos de cada una",
          "Reste ese total de 100",
          "Compruebe el resultado con una calculadora",
        ],
        tip: "Si le cuesta, use números más pequeños. La idea es pensar, no acertar.",
      },
      {
        patientId,
        name: "Nombra categorías",
        level: "Reto",
        emoji: "🗂️",
        durationLabel: "6 min",
        description: "Fluidez: cuántos nombres se le ocurren",
        steps: [
          "Elija una categoría: frutas, animales, ciudades, oficios",
          "Diga en voz alta todos los que se le ocurran, sin parar",
          "Cuente cuántos dijo antes de quedarte en blanco",
          "Cambie de categoría y repita",
          "Anote su mejor número para compararlo mañana",
        ],
        tip: "Decirlos en voz alta ayuda más que pensarlos en silencio.",
      },
      {
        patientId,
        name: "Recuerdos guiados",
        level: "Fácil",
        emoji: "📔",
        durationLabel: "8 min",
        description: "Traer a la memoria momentos vividos",
        steps: [
          "Elija una época: su juventud, su primer trabajo, su barrio",
          "Recuerde un día concreto de esa época",
          "Piense en los detalles: quién estaba, qué olía, qué sonaba",
          "Cuéntelo a alguien, o dígalo en voz alta",
          "Termine nombrando tres cosas buenas de ese recuerdo",
        ],
        tip: "Compartirlo con un familiar hace el ejercicio mucho más valioso.",
      },
      {
        patientId,
        name: "Cuenta hacia atrás",
        level: "Reto",
        emoji: "🔢",
        durationLabel: "4 min",
        description: "Atención sostenida con números",
        steps: [
          "Siéntese cómodo y respire hondo dos veces",
          "Cuente desde 100 hacia atrás de 3 en 3: 100, 97, 94...",
          "Si se pierde, vuelva al último número seguro y siga",
          "Llegue hasta donde pueda sin apurarte",
          "Descanse un minuto y hágalo una segunda vez",
        ],
        tip: "Perderse es parte del ejercicio. Retomar es lo que entrena la atención.",
      },
    ]);
    console.log("✅ Mente activa sembrada");
  } else {
    console.log("⏭ Este paciente ya tiene actividades de Mente Activa");
  }

  // Menú
  const existingMeals = await db
    .select()
    .from(meals)
    .where(eq(meals.patientId, patientId))
    .limit(1);

  if (existingMeals.length === 0) {
    await db.insert(meals).values([
      {
        patientId,
        slug: "desayuno",
        name: "Desayuno",
        article: "el desayuno",
        time: "7:00 – 8:00",
        emoji: "🥐",
        accent: "yellow",
        items: ["Avena con fruta", "Té o leche", "Pan integral"],
      },
      {
        patientId,
        slug: "almuerzo",
        name: "Almuerzo",
        article: "el almuerzo",
        time: "12:00 – 13:00",
        emoji: "🍲",
        accent: "orange",
        items: ["Sopa de verduras", "Pollo al vapor", "Ensalada verde", "Arroz integral"],
      },
      {
        patientId,
        slug: "cena",
        name: "Cena",
        article: "la cena",
        time: "18:00 – 19:00",
        emoji: "🥗",
        accent: "green",
        items: ["Ensalada con atún", "Pan integral", "Fruta de temporada"],
      },
    ]);
    console.log("✅ Menú sembrado");
  } else {
    console.log("⏭ Este paciente ya tiene menú");
  }

  console.log("🌱 Listo.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
