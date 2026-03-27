import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js"; // Note: Use .js extension if Node runs with ESM, but we are using TS with express/tsx based on bun running. But wait, `type: module` and `tsx` normally means we don't need `.js`. Actually, for tsx or bun, omitting or keeping `.js` is safe depending on module resolution. Since Bun handles it natively, we can omit it or keep it. Let's omit or use `.js` carefully. Wait, bun supports `.ts` or extensionless out of the box. Let's use extensionless or .js as per standard ES Modules in Drizzle docs. Actually, better use extensionless as standard TS does and Bun supports.
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in environment variables");
}

const pool = new pg.Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
