import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsPostgresqlDb?: NodePgDatabase;
};

function createPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const isLocal =
    databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1");

  return new Pool({
    connectionString: databaseUrl,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    // Serverless: many short-lived instances, each with its own pool.
    // Keep it small so we don't exhaust Supabase's pooler connection budget.
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });
}

function getPool(): Pool {
  const existing = globalForDb.__arenaNextJsPostgresqlPool;
  if (existing) return existing;

  const pool = createPool();
  globalForDb.__arenaNextJsPostgresqlPool = pool;
  return pool;
}

function getDb(): NodePgDatabase {
  const existing = globalForDb.__arenaNextJsPostgresqlDb;
  if (existing) return existing;

  const instance = drizzle(getPool());
  globalForDb.__arenaNextJsPostgresqlDb = instance;
  return instance;
}

// Lazy: the connection is only opened on the first query, so importing this
// module during `next build` never requires DATABASE_URL to be present.
function forward<T extends object>(resolve: () => T): T {
  return new Proxy({} as T, {
    get: (_target, prop) => {
      const instance = resolve();
      const value = Reflect.get(instance, prop);
      // Bind methods to the real instance so internal `this` access works.
      return typeof value === "function" ? value.bind(instance) : value;
    },
  });
}

export const pool = forward(getPool);
export const db = forward(getDb);
