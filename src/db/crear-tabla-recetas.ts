import "./load-env";
import { Client } from "pg";

/**
 * Crea recipes con SQL directo, mismo motivo que food_groups,
 * community_post_images y survey_responses: un `drizzle-kit push` desde
 * este repo puede intentar tocar columnas que la plataforma del cuidador
 * agregó a mano en Supabase (ver schema.ts).
 *
 * Idempotente: correrlo dos veces no hace nada la segunda.
 *
 * Uso: npx tsx src/db/crear-tabla-recetas.ts
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
      create table if not exists recipes (
        id          serial primary key,
        patient_id  integer not null references patients(id),
        name        text not null,
        emoji       text not null default '🍽️',
        accent      text not null default 'orange',
        time        text not null default '',
        difficulty  text not null default 'Fácil',
        servings    text not null default '',
        ingredients text[] not null,
        steps       text[] not null,
        tip         text,
        created_at  timestamp default now()
      );
    `);
    console.log("✅ recipes lista");
  } finally {
    await cliente.end();
  }
}

crear().catch((error) => {
  console.error(error);
  process.exit(1);
});
