import { config } from "dotenv";
config({ path: ".env.local" }); // carga DATABASE_URL

import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida");
  const sql = neon(url);
  const rows = await sql`select now() as now, current_user as user, version() as version`;
  console.log("✅ Conexión OK");
  console.table(rows as any);
}

main().catch((e) => {
  console.error("❌ Error de conexión:", e);
  process.exit(1);
});
