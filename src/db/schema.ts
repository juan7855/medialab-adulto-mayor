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

// Medications table
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
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
  date: date("date").notNull(),
  glasses: integer("glasses").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Routine activities
export const routineActivities = pgTable("routine_activities", {
  id: serial("id").primaryKey(),
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
  activityId: integer("activity_id")
    .notNull()
    .references(() => routineActivities.id),
  date: date("date").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Exercise completions
export const exerciseLogs = pgTable("exercise_logs", {
  id: serial("id").primaryKey(),
  exerciseName: text("exercise_name").notNull(),
  date: date("date").notNull(),
  durationSeconds: integer("duration_seconds"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
