import "./load-env";
import { Client } from "pg";

/** Comprobación de sólo lectura: ¿existe community_post_images y con qué
 *  columnas? Útil tras crear la tabla a mano en el editor de Supabase. */
async function ver() {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Falta DIRECT_URL (o DATABASE_URL)");

  const cliente = new Client({
    connectionString,
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
  });
  await cliente.connect();
  try {
    const { rows } = await cliente.query(
      `select column_name, data_type, is_nullable
         from information_schema.columns
        where table_name = 'community_post_images'
        order by ordinal_position`,
    );
    if (rows.length === 0) {
      console.log("❌ No existe community_post_images");
    } else {
      console.table(rows);
    }
  } finally {
    await cliente.end();
  }
}

ver().catch((error) => {
  console.error(error);
  process.exit(1);
});
