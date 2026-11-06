import "./load-env";
import { Client } from "pg";

/**
 * Crea community_post_images con SQL directo, igual que survey_responses: un
 * `drizzle-kit push` desde este repo puede intentar tocar columnas que la
 * plataforma del cuidador agregó a mano en Supabase (ver schema.ts), así que
 * para una tabla nueva es más seguro esto.
 *
 * Idempotente: correrlo dos veces no hace nada la segunda.
 *
 * Uso: npx tsx src/db/crear-tabla-fotos.ts
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
      create table if not exists community_post_images (
        id         serial primary key,
        post_id    integer not null unique references community_posts(id),
        mime       text not null,
        data       text not null,
        width      integer not null,
        height     integer not null,
        created_at timestamp default now()
      );
    `);
    console.log("✅ community_post_images lista");
  } finally {
    await cliente.end();
  }
}

crear().catch((error) => {
  console.error(error);
  process.exit(1);
});
