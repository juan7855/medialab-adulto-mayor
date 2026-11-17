import "./load-env";
import { Client } from "pg";

/**
 * Crea food_groups y food_group_logs con SQL directo, igual que
 * community_post_images y survey_responses: un `drizzle-kit push` desde este
 * repo puede intentar tocar columnas que la plataforma del cuidador agregó a
 * mano en Supabase (ver schema.ts), así que para tablas nuevas es más
 * seguro esto.
 *
 * Idempotente: correrlo dos veces no hace nada la segunda.
 *
 * Uso: npx tsx src/db/crear-tabla-grupos-alimentos.ts
 */
async function crear() {
  // Session pooler: el de transacciones no lleva bien el DDL.
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Falta DIRECT_URL (o DATABASE_URL)");

  const cliente = new Client({
    connectionString,
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
  });
  await cliente.connect();

  try {
    await cliente.query(`
      create table if not exists food_groups (
        id          serial primary key,
        patient_id  integer not null references patients(id),
        name        text not null,
        emoji       text not null,
        description text not null,
        accent      text not null default 'orange',
        sort_order  integer not null default 0,
        created_at  timestamp default now()
      );
    `);
    await cliente.query(`
      create table if not exists food_group_logs (
        id            serial primary key,
        patient_id    integer not null references patients(id),
        food_group_id integer not null references food_groups(id),
        date          date not null,
        eaten         boolean not null default false,
        eaten_at      timestamp,
        created_at    timestamp default now()
      );
    `);
    console.log("✅ food_groups y food_group_logs listas");
  } finally {
    await cliente.end();
  }
}

crear().catch((error) => {
  console.error(error);
  process.exit(1);
});
