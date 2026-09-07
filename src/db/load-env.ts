import { config } from "dotenv";

// Next.js loads .env.local automatically, but standalone scripts (drizzle-kit,
// the seed script) do not. Mirror Next's precedence: .env.local wins over .env.
config({ path: [".env.local", ".env"], quiet: true });
