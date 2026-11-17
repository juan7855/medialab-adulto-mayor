import "./load-env";
import { Client } from "pg";

/**
 * Crea routines y routine_exercises con SQL directo (mismo motivo que
 * food_groups: un `drizzle-kit push` desde este repo puede tocar columnas
 * que la plataforma del cuidador agregó a mano en Supabase), y agrega a
 * `exercises` las columnas que la enlazan con la rutina del día.
 *
 * Idempotente: correrlo dos veces no hace nada la segunda.
 *
 * Uso: npx tsx src/db/crear-tabla-rutinas.ts
 */
async function crear() {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Falta DIRECT_URL (o DATABASE_URL)");

  const cliente = new Client({
    connectionString,
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
  });
  await cliente.connect();

  try {
    await cliente.query(`
      create table if not exists routines (
        id         serial primary key,
        number     integer not null unique,
        name       text not null,
        created_at timestamp default now()
      );
    `);
    await cliente.query(`
      create table if not exists routine_exercises (
        id           serial primary key,
        routine_id   integer not null references routines(id),
        order_index  integer not null,
        name         text not null,
        variant      text,
        objective    text not null,
        steps        text[] not null,
        video_url    text,
        created_at   timestamp default now()
      );
    `);
    await cliente.query(`
      alter table exercises
        add column if not exists routine_id integer references routines(id),
        add column if not exists warmup_exercise_id integer references routine_exercises(id),
        add column if not exists cooldown_exercise_id integer references routine_exercises(id);
    `);
    console.log("✅ routines, routine_exercises y columnas de exercises listas");
  } finally {
    await cliente.end();
  }
}

crear().catch((error) => {
  console.error(error);
  process.exit(1);
});
