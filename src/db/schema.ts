import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  date,
  time,
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
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  pin: text("pin").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medications table
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  name: text("name").notNull(),
  dose: text("dose").notNull(),
  time: text("time").notNull(),
  imageEmoji: text("image_emoji").notNull().default("💊"),
  color: text("color").notNull().default("#4A90D9"),
  createdAt: timestamp("created_at").defaultNow(),
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

// Routine activities
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

// Exercise completions
export const exerciseLogs = pgTable("exercise_logs", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  exerciseName: text("exercise_name").notNull(),
  date: date("date").notNull(),
  durationSeconds: integer("duration_seconds"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
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
});
