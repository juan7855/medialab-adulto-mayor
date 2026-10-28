import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  date,
  time,
  real,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";

// Una persona mayor real. Cada una tiene su propia clave de 4 dígitos y sus
// propios datos: nada de lo de abajo se comparte entre pacientes.
//
// El pin es único en toda la tabla porque hoy el único dato que identifica
// a quién pertenece una sesión es el pin mismo (no hay usuario+clave, sólo
// clave). Con pocas decenas de pacientes en un despliegue familiar esto
// sobra; si esto crece a un SaaS con miles de usuarios, el login debería
// dejar de depender sólo del pin (por ejemplo, vinculando el dispositivo al
// paciente una vez, desde un enlace que genera el cuidador).
// Las columnas de abajo de created_at no las agregó este repo: las agregó
// la plataforma del cuidador directo en Supabase (mismo proyecto, ver
// INTEGRACION-CUIDADOR.md). Están aquí para que schema.ts deje de estar
// desactualizado frente a la base real — si difiere, un `drizzle-kit push`
// desde este repo puede intentar borrarlas.
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  pin: text("pin").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  relation: text("relation").notNull().default("Familiar"),
  gender: text("gender").notNull().default("F"),
  age: integer("age").notNull().default(0),
  birthDate: text("birth_date").notNull().default(""),
  bloodType: text("blood_type"),
  heightCm: real("height_cm"),
  weightKg: real("weight_kg"),
  avatarFrom: text("avatar_from").notNull().default("#2F80ED"),
  avatarTo: text("avatar_to").notNull().default("#56CCF2"),
  phone: text("phone"),
  insurance: text("insurance"),
  address: text("address"),
  emergencyContact: jsonb("emergency_contact"),
});

// Signos vitales diarios, uno por paciente y día (igual patrón que
// dailyNotes). Lo agregó la plataforma del cuidador; se documenta aquí por
// la misma razón que las columnas nuevas de patients.
//
// La unicidad (patient_id, date) y el ON DELETE CASCADE ya existen en la
// base real como `vitals_patient_date_uq` y `daily_vitals_patient_id_fkey`,
// pero se crearon a mano (no con drizzle-kit) así que no se declaran acá:
// declararlos hace que `db:push` los vea como "nuevos" y proponga tocar una
// tabla que no es de este repo. Quedan documentados en el comentario, no en
// el schema.
export const dailyVitals = pgTable("daily_vitals", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  date: date("date").notNull(), // único junto con patientId, ver arriba
  heartRate: integer("heart_rate"),
  systolic: integer("systolic"),
  diastolic: integer("diastolic"),
  steps: integer("steps"),
  sleepHours: real("sleep_hours"),
  oxygen: integer("oxygen"),
  weightKg: real("weight_kg"),
  mood: text("mood"),
});

// Puntajes de los juegos de Mente Activa. Igual que dailyVitals: lo agregó
// la plataforma del cuidador, con su propio ON DELETE CASCADE ya en la base
// real (no declarado acá por la misma razón).
export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  game: text("game").notNull(),
  score: integer("score").notNull(),
  detail: text("detail"),
  playedAt: timestamp("played_at").defaultNow(),
});

// Medications table. Igual que patients: las columnas desde activeSubstance
// las agregó la plataforma del cuidador directo en la base.
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  name: text("name").notNull(),
  dose: text("dose").notNull(),
  time: text("time").notNull(),
  imageEmoji: text("image_emoji").notNull().default("💊"),
  color: text("color").notNull().default("#4A90D9"),
  createdAt: timestamp("created_at").defaultNow(),
  activeSubstance: text("active_substance"),
  form: text("form").notNull().default("Tableta"),
  period: text("period").notNull().default("Mañana"),
  withFood: boolean("with_food").notNull().default(false),
  stock: real("stock").notNull().default(0),
  stockUnit: text("stock_unit").notNull().default("tabletas"),
  lowStockAt: real("low_stock_at").notNull().default(5),
  instructions: text("instructions"),
  tone: text("tone").notNull().default("blue"),
  active: boolean("active").notNull().default(true),
});

// Medication intake log
export const medicationLogs = pgTable("medication_logs", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  medicationId: integer("medication_id")
    .notNull()
    .references(() => medications.id),
  date: date("date").notNull(),
  taken: boolean("taken").notNull().default(false),
  takenAt: timestamp("taken_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Water intake log
export const waterLogs = pgTable("water_logs", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  date: date("date").notNull(),
  glasses: integer("glasses").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Meal intake log. meals ahora es una tabla propia (ver más abajo, junto al
// resto del contenido personalizado); esto sólo guarda cuál se marcó y cuándo.
export const mealLogs = pgTable("meal_logs", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  mealId: integer("meal_id")
    .notNull()
    .references(() => meals.id),
  date: date("date").notNull(),
  eaten: boolean("eaten").notNull().default(false),
  eatenAt: timestamp("eaten_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Routine activities. icon lo agregó la plataforma del cuidador.
export const routineActivities = pgTable("routine_activities", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  title: text("title").notNull(),
  description: text("description"),
  timeOfDay: text("time_of_day").notNull(), // morning, afternoon, evening
  scheduledTime: text("scheduled_time"),
  emoji: text("emoji").notNull().default("📌"),
  isRecurring: boolean("is_recurring").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  icon: text("icon").notNull().default("Sun"),
});

// Routine completion log
export const routineLogs = pgTable("routine_logs", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  activityId: integer("activity_id")
    .notNull()
    .references(() => routineActivities.id),
  date: date("date").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cómo se encuentra la persona cada día, escrito con sus palabras al entrar.
export const dailyNotes = pgTable("daily_notes", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  date: date("date").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Exercise completions. exerciseId/minutes los agregó la plataforma del
// cuidador; exerciseId ya tiene su propio ON DELETE CASCADE en la base real
// (mismo caso que dailyVitals: no declarado acá, ver esa tabla).
export const exerciseLogs = pgTable("exercise_logs", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  exerciseName: text("exercise_name").notNull(),
  date: date("date").notNull(),
  durationSeconds: integer("duration_seconds"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  exerciseId: integer("exercise_id"),
  minutes: integer("minutes").notNull().default(0),
});

// ---------------------------------------------------------------------------
// Historia clínica y contenido personalizado.
//
// Hasta aquí, patients sólo guardaba identidad (nombre y clave). Lo de abajo
// es lo que permite que la app se organice según lo que esa persona
// necesita: condiciones y restricciones por un lado, y un catálogo propio de
// ejercicios / comida / actividades mentales por otro — en vez del mismo
// contenido fijo para todos los pacientes, que es como empezó esta app.
// ---------------------------------------------------------------------------

// Perfil clínico, uno por paciente. Nadie en esta app lo edita todavía (eso
// es trabajo de la interfaz del cuidador); existe para que esa interfaz
// tenga dónde escribir, y en el futuro el catálogo de abajo pueda filtrarse
// o sugerirse según esto.
export const clinicalProfiles = pgTable("clinical_profiles", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().unique().references(() => patients.id),
  conditions: text("conditions").array(), // ["diabetes tipo 2", "artritis en rodillas"]
  dietRestrictions: text("diet_restrictions").array(), // ["bajo en sodio", "sin azúcar"]
  allergies: text("allergies").array(),
  mobilityNotes: text("mobility_notes"), // libre: "usa bastón", "evitar ejercicios de pie"
  doctorName: text("doctor_name"),
  doctorPhone: text("doctor_phone"),
  notes: text("notes"), // libre, para lo que no encaje arriba
  updatedAt: timestamp("updated_at").defaultNow(),
  // Desde acá, columnas que agregó la plataforma del cuidador.
  chronicMeds: text("chronic_meds").array().notNull().default([]),
  doctors: jsonb("doctors"),
  labs: jsonb("labs"),
  goals: jsonb("goals"),
});

// Catálogo de ejercicios de ESTE paciente (antes era un array fijo en
// código, igual para todos). El emoji es la clave que el cliente traduce a
// un icono de línea — mismo patrón que routineActivities.emoji.
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  name: text("name").notNull(),
  level: text("level").notNull(), // "Ligero" | "Moderado"
  emoji: text("emoji").notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
  description: text("description").notNull(),
  steps: text("steps").array().notNull(),
  tip: text("tip").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  // Desde acá, columnas que agregó la plataforma del cuidador.
  dayOfWeek: integer("day_of_week").notNull().default(0),
  durationMin: integer("duration_min").notNull().default(20),
  calories: integer("calories").notNull().default(100),
  intensity: text("intensity").notNull().default("Suave"),
  icon: text("icon").notNull().default("Footprints"),
  items: jsonb("items"),
});

// Catálogo de actividades de Mente Activa de este paciente. Sin
// durationSeconds real: esta sección no lleva cronómetro.
export const cognitiveActivities = pgTable("cognitive_activities", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  name: text("name").notNull(),
  level: text("level").notNull(), // "Fácil" | "Reto"
  emoji: text("emoji").notNull(),
  durationLabel: text("duration_label").notNull(), // "5 min", sólo texto
  description: text("description").notNull(),
  steps: text("steps").array().notNull(),
  tip: text("tip").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Menú de este paciente: desayuno/almuerzo/cena con su propio contenido.
// slug identifica el tipo de comida de forma estable dentro del paciente
// (útil si en el futuro se agregan meriendas u otras franjas).
export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  slug: text("slug").notNull(), // "desayuno" | "almuerzo" | "cena"
  name: text("name").notNull(),
  article: text("article").notNull(), // "el desayuno" — para preguntas tipo "¿ya tomaste X?"
  time: text("time").notNull(),
  emoji: text("emoji").notNull(),
  accent: text("accent").notNull(), // color de la tarjeta: ver src/lib/theme.ts
  items: text("items").array().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  // Desde acá, columnas que agregó la plataforma del cuidador.
  slot: text("slot").notNull().default("Comida"),
  foods: text("foods").notNull().default(""),
  calories: integer("calories").notNull().default(0),
  protein: real("protein").notNull().default(0),
  carbs: real("carbs").notNull().default(0),
  fat: real("fat").notNull().default(0),
  tone: text("tone").notNull().default("emerald"),
});

// ---------------------------------------------------------------------------
// Comunidad: foro y mensajes directos entre pacientes.
//
// Hasta acá, patients era una isla — nada se compartía entre pacientes
// (ver el comentario al inicio de este archivo). Esto es lo primero que
// rompe esa regla a propósito: un paciente puede ver contenido de otro,
// siempre que ambos estén en community_members. Por eso el vínculo
// cuidador↔paciente (que tampoco existía) se crea aquí también: es la base
// de "quién administra la comunidad" y "quién puede entrar".
//
// Primera versión: solo texto. Fotos y notas de voz quedan para después
// (ver el plan) — no hay columna photo_url en ningún lado todavía.
// ---------------------------------------------------------------------------

// Un cuidador. El login real (Supabase Auth) vive en la app del cuidador;
// esta fila es sólo la identidad con la que aparece acá (por ejemplo, quién
// resolvió un reporte).
export const caregivers = pgTable("caregivers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Qué cuidador ve/administra a qué paciente. Muchos a muchos: un paciente
// puede tener más de un cuidador (ej. dos hijos), y un cuidador puede
// administrar varios pacientes.
export const patientCaregivers = pgTable(
  "patient_caregivers",
  {
    id: serial("id").primaryKey(),
    patientId: integer("patient_id").notNull().references(() => patients.id),
    caregiverId: integer("caregiver_id").notNull().references(() => caregivers.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [unique("patient_caregivers_pair_uq").on(table.patientId, table.caregiverId)],
);

// Lista blanca de la comunidad: estar acá es lo que significa "el cuidador
// me registró en el foro y los DM". Una sola comunidad compartida por
// ahora (sin community_id) — coincide con el despliegue familiar/pequeño
// para el que está pensada esta app.
export const communityMembers = pgTable("community_members", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().unique().references(() => patients.id),
  addedByCaregiverId: integer("added_by_caregiver_id").references(() => caregivers.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// El foro general.
export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  // true cuando un cuidador resuelve un reporte ocultando el post. No se
  // borra: sigue existiendo para quien necesite revisarlo después.
  hidden: boolean("hidden").notNull().default(false),
});

export const communityComments = pgTable("community_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => communityPosts.id),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  hidden: boolean("hidden").notNull().default(false),
});

// Una conversación de DM entre dos pacientes. El par se normaliza en la
// aplicación (id menor primero) para que nunca existan dos filas para la
// misma pareja.
export const communityConversations = pgTable(
  "community_conversations",
  {
    id: serial("id").primaryKey(),
    patientAId: integer("patient_a_id").notNull().references(() => patients.id),
    patientBId: integer("patient_b_id").notNull().references(() => patients.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [unique("community_conversations_pair_uq").on(table.patientAId, table.patientBId)],
);

export const communityMessages = pgTable("community_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => communityConversations.id),
  senderPatientId: integer("sender_patient_id").notNull().references(() => patients.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at"),
});

// Un reporte sobre un post, comentario o mensaje. target_type + target_id
// en vez de una FK por tipo: son tres tablas distintas y esto evita
// triplicar la tabla de reportes por algo que un cuidador sólo necesita
// leer, no unir en SQL.
export const communityReports = pgTable("community_reports", {
  id: serial("id").primaryKey(),
  reporterPatientId: integer("reporter_patient_id").notNull().references(() => patients.id),
  targetType: text("target_type").notNull(), // "post" | "comment" | "message"
  targetId: integer("target_id").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
  resolved: boolean("resolved").notNull().default(false),
  resolvedByCaregiverId: integer("resolved_by_caregiver_id").references(() => caregivers.id),
  resolvedAt: timestamp("resolved_at"),
});

// Si A bloqueó a B, un DM entre ambos no se entrega en ninguna dirección
// (la ruta comprueba las dos filas posibles, no sólo bloqueador→bloqueado).
export const communityBlocks = pgTable(
  "community_blocks",
  {
    id: serial("id").primaryKey(),
    blockerPatientId: integer("blocker_patient_id").notNull().references(() => patients.id),
    blockedPatientId: integer("blocked_patient_id").notNull().references(() => patients.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [unique("community_blocks_pair_uq").on(table.blockerPatientId, table.blockedPatientId)],
);

// Encuesta de bienestar obligatoria: se responde una sola vez, tras la
// primera clave. Las columnas document_type, document_number y full_name
// ya no se piden (el nombre vive en patients) y quedaron opcionales en la
// base, sólo para conservar lo que ya se había guardado. patient_id es único: una respuesta por paciente. Las
// preguntas son escalas 0–10 (ver src/lib/encuesta.ts). La tabla se creó con
// SQL directo (no con drizzle-kit push, que podría tocar columnas del cuidador);
// extra_note y sleep_quality también se agregaron con ALTER TABLE a mano.
export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().unique().references(() => patients.id),
  lifeSatisfaction: integer("life_satisfaction").notNull(),
  dailyWorthwhile: integer("daily_worthwhile").notNull(),
  happyYesterday: integer("happy_yesterday").notNull(),
  anxiousYesterday: integer("anxious_yesterday").notNull(),
  sadYesterday: integer("sad_yesterday").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  // Pantalla siguiente a la encuesta (/conversemos): opcionales, en palabras
  // de la persona. sleep_quality es una de OPCIONES_SUENO (src/lib/encuesta.ts).
  extraNote: text("extra_note"),
  sleepQuality: text("sleep_quality"),
});
