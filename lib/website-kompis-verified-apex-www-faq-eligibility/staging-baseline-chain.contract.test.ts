/**
 * Local Docker proof: Staging-only WK FAQ visitor baseline → 325 → 382 → fixtures → 396.
 * Never talks to Staging/Production.
 *
 *   npx --yes tsx lib/website-kompis-verified-apex-www-faq-eligibility/staging-baseline-chain.contract.test.ts
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WEBSITE_KOMPIS_VERIFIED_APEX_WWW_FAQ_ELIGIBILITY_MIGRATION_SHA256 } from "./contract";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const container = `aipify-wk-staging-baseline-${Date.now()}`;

const PATHS = {
  baseline: "supabase/staging/wk_faq_visitor_baseline_v1.sql",
  fixtures: "supabase/staging/wk_faq_visitor_synthetic_fixtures_v1.sql",
  m325: "supabase/migrations/20261932500000_widen_website_kompis_faq_retrieval.sql",
  m382: "supabase/migrations/20261938200000_website_kompis_visitor_faq_install_isolation_v1.sql",
  m396: "supabase/migrations/20261939600000_website_kompis_verified_apex_www_faq_eligibility_v1.sql",
} as const;

const INSTALL_A = "11111111-1111-4111-8111-111111111111";
const APEX = "site-a.example";
const WWW = "www.site-a.example";

function sha256File(rel: string): string {
  return createHash("sha256").update(fs.readFileSync(path.join(root, rel))).digest("hex");
}

function dockerAvailable(): boolean {
  return spawnSync("docker", ["info"], { stdio: "ignore" }).status === 0;
}

function sql(query: string): string {
  const out = execFileSync(
    "docker",
    [
      "exec",
      "-i",
      container,
      "psql",
      "-U",
      "postgres",
      "-d",
      "wkfaq",
      "-v",
      "ON_ERROR_STOP=1",
      "-tA",
      "-c",
      query,
    ],
    { encoding: "utf8" },
  ).trim();
  return out.split("\n").map((l) => l.trim()).filter(Boolean).at(-1) ?? "";
}

function applySqlFile(rel: string): void {
  const body = fs.readFileSync(path.join(root, rel), "utf8");
  execFileSync(
    "docker",
    ["exec", "-i", container, "psql", "-U", "postgres", "-d", "wkfaq", "-v", "ON_ERROR_STOP=1"],
    { input: body, encoding: "utf8" },
  );
}

function cleanup(): void {
  spawnSync("docker", ["rm", "-f", container], { stdio: "ignore" });
}

function boot(): void {
  spawnSync("docker", ["rm", "-f", container], { stdio: "ignore" });
  execFileSync(
    "docker",
    [
      "run",
      "-d",
      "--name",
      container,
      "-e",
      "POSTGRES_PASSWORD=postgres",
      "-e",
      "POSTGRES_DB=wkfaq",
      "postgres:16-alpine",
    ],
    { stdio: "ignore" },
  );
  for (let i = 0; i < 40; i += 1) {
    if (
      spawnSync(
        "docker",
        ["exec", container, "pg_isready", "-U", "postgres", "-d", "wkfaq"],
        { stdio: "ignore" },
      ).status === 0
    ) {
      spawnSync("sleep", ["2"], { stdio: "ignore" });
      return;
    }
    spawnSync("sleep", ["1"], { stdio: "ignore" });
  }
  throw new Error("Postgres not ready");
}

function searchTitles(domain: string, query: string): string[] {
  const out = execFileSync(
    "docker",
    [
      "exec",
      "-i",
      container,
      "psql",
      "-U",
      "postgres",
      "-d",
      "wkfaq",
      "-v",
      "ON_ERROR_STOP=1",
      "-tA",
      "-c",
      `select title from public.search_tenant_public_visitor_knowledge(
        '${INSTALL_A}'::uuid, '${domain}', 'no', '${query}', null, 10
      ) order by title;`,
    ],
    { encoding: "utf8" },
  )
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return out;
}

function fnMd5(): string {
  return sql(
    `select md5(pg_get_functiondef('public.search_tenant_public_visitor_knowledge(uuid,text,text,text,text,integer)'::regprocedure));`,
  );
}

function main(): void {
  const hashes = Object.fromEntries(
    Object.entries(PATHS).map(([k, rel]) => [k, sha256File(rel)]),
  ) as Record<keyof typeof PATHS, string>;

  assert.equal(hashes.m396, WEBSITE_KOMPIS_VERIFIED_APEX_WWW_FAQ_ELIGIBILITY_MIGRATION_SHA256);
  assert.doesNotMatch(fs.readFileSync(path.join(root, PATHS.baseline), "utf8"), /unonight/i);
  assert.doesNotMatch(fs.readFileSync(path.join(root, PATHS.fixtures), "utf8"), /unonight/i);
  assert.match(fs.readFileSync(path.join(root, PATHS.fixtures), "utf8"), /\.example/);

  console.log(JSON.stringify({ phase: "static", hashes }, null, 2));

  if (!dockerAvailable()) {
    console.log("staging-baseline-chain.contract.test.ts: Docker NOT RUN");
    return;
  }

  const matrix: Array<{ case: string; status: "PASS" | "FAIL"; detail?: string }> = [];
  const check = (name: string, fn: () => void) => {
    try {
      fn();
      matrix.push({ case: name, status: "PASS" });
    } catch (e) {
      matrix.push({
        case: name,
        status: "FAIL",
        detail: e instanceof Error ? e.message : String(e),
      });
    }
  };

  let before396 = "";
  let after396 = "";

  try {
    boot();
    applySqlFile(PATHS.baseline);
    applySqlFile(PATHS.baseline); // idempotence
    check("baseline_idempotent_ledger", () => {
      assert.equal(
        sql(`select count(*)::text from supabase_migrations.schema_migrations where version='staging_wk_faq_visitor_baseline_v1'`),
        "1",
      );
    });

    applySqlFile(PATHS.m325);
    applySqlFile(PATHS.m382);
    check("pre396_objects", () => {
      assert.equal(
        sql(`select (to_regprocedure('public.search_tenant_public_visitor_knowledge(uuid,text,text,text,text,integer)') is not null)::text`),
        "true",
      );
      assert.equal(
        sql(`select (to_regprocedure('public._wpkf_count_active_verified_installs(uuid)') is not null)::text`),
        "true",
      );
    });

    applySqlFile(PATHS.fixtures);
    before396 = fnMd5();

    check("pre396_www_misses_apex", () => {
      assert.ok(!searchTitles(WWW, "email").includes("strong email faq"));
    });

    applySqlFile(PATHS.m396);
    after396 = fnMd5();
    assert.notEqual(before396, after396);

    // ledger markers for production migrations (manual insert as Staging would record)
    sql(`
      insert into supabase_migrations.schema_migrations(version) values
        ('20261932500000'),('20261938200000'),('20261939600000')
      on conflict do nothing;
    `);

    check("www_to_apex", () => {
      assert.ok(searchTitles(WWW, "email").includes("strong email faq"));
    });
    check("apex_to_www", () => {
      assert.ok(searchTitles(APEX, "www stored").includes("www stored faq"));
    });
    check("cross_tenant_negative", () => {
      assert.ok(!searchTitles(WWW, "foreign tenant").includes("foreign tenant email faq"));
    });
    check("unverified_negative", () => {
      sql(`update public.customer_domains set verification_status='pending' where domain='${WWW}'`);
      assert.deepEqual(searchTitles(WWW, "email"), []);
      sql(`update public.customer_domains set verification_status='verified' where domain='${WWW}'`);
    });
    check("inactive_pair_negative", () => {
      sql(`update public.customer_domains set status='disabled' where domain='${APEX}'`);
      assert.ok(!searchTitles(WWW, "email").includes("strong email faq"));
      sql(`update public.customer_domains set status='active' where domain='${APEX}'`);
    });
    check("ledger_has_396", () => {
      assert.equal(
        sql(`select count(*)::text from supabase_migrations.schema_migrations where version='20261939600000'`),
        "1",
      );
    });
    check("no_production_customer_names", () => {
      assert.equal(
        sql(`select count(*)::text from public.customer_domains where domain ilike '%unonight%'`),
        "0",
      );
    });
  } finally {
    cleanup();
  }

  const failed = matrix.filter((m) => m.status === "FAIL");
  console.log(
    JSON.stringify(
      { functionMd5Before396: before396, functionMd5After396: after396, matrix, docker: "RAN" },
      null,
      2,
    ),
  );
  if (failed.length) {
    throw new Error(`FAIL: ${failed.map((f) => f.case).join(", ")}`);
  }
  console.log("staging-baseline-chain.contract.test.ts: all assertions passed");
}

main();
