#!/usr/bin/env node
/**
 * Apply pending migration batches directly to Postgres.
 *
 * Set DATABASE_URL from Supabase Dashboard → Project Settings → Database → URI
 * (use "Session pooler" or direct connection; URL-encode special chars in password)
 *
 *   export DATABASE_URL='postgresql://postgres.qbcqoixhrvhnuwphefvw:PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres'
 *   node scripts/apply-migration-batches-pg.cjs
 */
const fs = require("node:fs");
const path = require("node:path");

const BATCH_DIR = "/tmp/aipify-migration-batches-5";
const MANIFEST = path.join(BATCH_DIR, "manifest.json");
const STATE_FILE = path.join(__dirname, "..", ".supabase-batch-state.json");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is required.");
    process.exit(1);
  }

  let pg;
  try {
    pg = require("pg");
  } catch {
    console.error("Installing pg...");
    require("node:child_process").execSync("npm install pg --no-save", {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
    });
    pg = require("pg");
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  let state = { completed: [] };
  try {
    state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    /* fresh */
  }

  await client.connect();
  console.log(`Applying ${manifest.length} batches (${manifest.reduce((n, b) => n + b.count, 0)} migrations)...`);

  for (const batch of manifest) {
    if (state.completed.includes(batch.file)) {
      console.log(`skip ${batch.file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(BATCH_DIR, batch.file), "utf8");
    process.stdout.write(`${batch.file} (${batch.count} migrations, ${Math.round(batch.bytes / 1024)}KB)... `);

    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("COMMIT");
      state.completed.push(batch.file);
      fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
      console.log("ok");
    } catch (error) {
      await client.query("ROLLBACK");
      console.log("FAILED");
      console.error(error.message);
      process.exit(1);
    }
  }

  const { rows } = await client.query(
    "SELECT COUNT(*)::int AS total FROM supabase_migrations.schema_migrations"
  );
  console.log(`Done. Remote migration records: ${rows[0].total}`);
  await client.end();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
