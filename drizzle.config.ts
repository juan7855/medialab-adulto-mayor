import "./src/db/load-env";
import { defineConfig } from "drizzle-kit";

// Migrations run DDL, which the Supabase transaction pooler (port 6543) does
// not fully support. Use DIRECT_URL (session pooler, port 5432) when present.
const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error("DIRECT_URL or DATABASE_URL is required");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url,
    ssl: url.includes("localhost") ? false : { rejectUnauthorized: false },
  },
});
