import "./load-env";
import { db } from "./index";
import { medications, routineActivities } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed medications
  const existingMeds = await db.select().from(medications).limit(1);
  if (existingMeds.length === 0) {
    await db.insert(medications).values([
      {
        name: "Metformina",
        dose: "500mg – 1 pastilla",
        time: "08:00 AM",
        imageEmoji: "💊",
        color: "#4186F6",
      },
      {
        name: "Atorvastatina",
        dose: "20mg – 1 pastilla",
        time: "08:00 AM",
        imageEmoji: "🔵",
        color: "#C162CE",
      },
      {
        name: "Losartán",
        dose: "50mg – 1 pastilla",
        time: "12:00 PM",
        imageEmoji: "🟡",
        color: "#7ECF6D",
      },
      {
        name: "Omeprazol",
        dose: "20mg – 1 pastilla",
        time: "07:30 AM",
        imageEmoji: "💉",
        color: "#70CAE6",
      },
    ]);
    console.log("✅ Medications seeded");
  } else {
    console.log("⏭ Medications already exist");
  }

  // Seed routine activities
  const existingActivities = await db.select().from(routineActivities).limit(1);
  if (existingActivities.length === 0) {
    await db.insert(routineActivities).values([
      {
        title: "Tomar medicamentos",
        description: "Pastillas de la mañana con agua",
        timeOfDay: "morning",
        scheduledTime: "08:00",
        emoji: "💊",
        isRecurring: true,
      },
      {
        title: "Desayuno saludable",
        description: "Avena o huevo con fruta",
        timeOfDay: "morning",
        scheduledTime: "08:30",
        emoji: "🍳",
        isRecurring: true,
      },
      {
        title: "Caminata matutina",
        description: "15 minutos al aire libre",
        timeOfDay: "morning",
        scheduledTime: "09:30",
        emoji: "🚶",
        isRecurring: true,
      },
      {
        title: "Ejercicios de estiramiento",
        description: "10 minutos sentado",
        timeOfDay: "morning",
        scheduledTime: "10:00",
        emoji: "🧘",
        isRecurring: true,
      },
      {
        title: "Almuerzo",
        description: "Comida balanceada con verduras",
        timeOfDay: "afternoon",
        scheduledTime: "12:30",
        emoji: "🍲",
        isRecurring: true,
      },
      {
        title: "Pastilla del mediodía",
        description: "Losartán 50mg",
        timeOfDay: "afternoon",
        scheduledTime: "12:00",
        emoji: "💊",
        isRecurring: true,
      },
      {
        title: "Siesta",
        description: "Descanso de 30 minutos",
        timeOfDay: "afternoon",
        scheduledTime: "14:00",
        emoji: "😴",
        isRecurring: true,
      },
      {
        title: "Llamar a familiar",
        description: "Hablar con hijo/a o familiar",
        timeOfDay: "afternoon",
        scheduledTime: "16:00",
        emoji: "📞",
        isRecurring: true,
      },
      {
        title: "Cena ligera",
        description: "Ensalada o sopa",
        timeOfDay: "evening",
        scheduledTime: "19:00",
        emoji: "🥗",
        isRecurring: true,
      },
      {
        title: "Lectura o TV",
        description: "Actividad de relajación",
        timeOfDay: "evening",
        scheduledTime: "20:00",
        emoji: "📺",
        isRecurring: true,
      },
      {
        title: "Preparar para dormir",
        description: "Higiene y descanso",
        timeOfDay: "evening",
        scheduledTime: "21:30",
        emoji: "🛏",
        isRecurring: true,
      },
    ]);
    console.log("✅ Routine activities seeded");
  } else {
    console.log("⏭ Routine activities already exist");
  }

  console.log("🌱 Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
