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

// Meal intake log.
// Las comidas del día (desayuno, almuerzo, cena) son contenido fijo definido
// en la app, no filas de la base; aquí sólo se guarda cuál se marcó y cuándo.
export const mealLogs = pgTable("meal_logs", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  mealId: text("meal_id").notNull(),
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
