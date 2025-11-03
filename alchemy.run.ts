import alchemy from "alchemy";
import { D1Database, KVNamespace, ReactRouter } from "alchemy/cloudflare";
import { config } from "dotenv";

// Select different config file based on environment variable
const envFile = process.env.ALCHEMY_ENV === "production" ? ".env" : ".env.local";
try {
  config({ path: envFile });
  console.log(`Loaded environment config file: ${envFile}`);
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.warn(`Unable to load environment config file ${envFile}:`, errorMessage);
  // If the specified file doesn't exist, try loading the default .env file
  if (envFile !== ".env") {
    try {
      config({ path: ".env" });
      console.log("Loaded default environment config file: .env");
    } catch (defaultError) {
      const defaultErrorMessage = defaultError instanceof Error ? defaultError.message : String(defaultError);
      console.warn("Unable to load default environment config file .env:", defaultErrorMessage);
    }
  }
}

const app = await alchemy("trading");
const db = await D1Database("web-db", {
  migrationsDir: "./drizzle/migrations",
});
const sessionKV = await KVNamespace("web-session-kv", {
  title: "web-session-kv",
});

export const worker = await ReactRouter("website", {
  bindings: {
    DB: db,
    SESSION_KV: sessionKV,
    SESSION_EXPIRY: process.env.SESSION_EXPIRY || "604800", // Default 7 days (604800 seconds)
    VALUE_FROM_CLOUDFLARE: alchemy.secret(process.env.ALCHEMY_PASSWORD),

    ADMIN_AUTH_HEADER: alchemy.secret(
      process.env.ADMIN_AUTH_HEADER || ""
    ),
    ADMIN_AUTH_SECRET: alchemy.secret(
      process.env.ADMIN_AUTH_SECRET || ""
    ),

    INITIAL_ACCOUNT_BALANCE: process.env.INITIAL_ACCOUNT_BALANCE || "10000",
  },
});

console.log({
  url: worker.url,
});

await app.finalize();
