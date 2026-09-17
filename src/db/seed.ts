import "./load-env";
import { db } from "./index";
import { patients, medications, routineActivities } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Crea (o encuentra) un paciente y le siembra medicamentos y rutina de
 * ejemplo, si todavía no tiene ninguno.
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

  console.log("🌱 Listo.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
