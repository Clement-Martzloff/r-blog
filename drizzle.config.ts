import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

export default defineConfig({
  schema: "./infrastructure/persistence/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  out: "./infrastructure/persistence/drizzle/migrations",
  verbose: true,
  strict: true,
});
