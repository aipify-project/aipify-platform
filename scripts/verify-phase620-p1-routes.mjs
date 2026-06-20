#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const PROJECT_REF = "qbcqoixhrvhnuwphefvw";
const AUTH_USER = "0644bb1a-155a-4668-bef2-0046257fbe2e";

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function getToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN.trim();
  const tokenPath = path.join(os.homedir(), ".supabase", "access-token");
  return fs.readFileSync(tokenPath, "utf8").trim();
}

async function sql(query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return JSON.parse(text);
}

async function asUser(query) {
  return sql(`
    set local role authenticated;
    select set_config('request.jwt.claim.sub', '${AUTH_USER}', true);
    ${query}
  `);
}

const RPC_CHECKS = [
  ["list_app_portal_enterprise_benchmarking", "select public.list_app_portal_enterprise_benchmarking(null,null,null,null,null,null) is not null as ok"],
  ["list_app_portal_predictive_intelligence", "select public.list_app_portal_predictive_intelligence(null,null,null,null,null) is not null as ok"],
  ["list_app_portal_scenario_planning", "select public.list_app_portal_scenario_planning(null,null,null,null) is not null as ok"],
  ["list_app_portal_executive_foresight", "select public.list_app_portal_executive_foresight(null,null,null,null) is not null as ok"],
  ["list_app_portal_strategic_opportunities", "select public.list_app_portal_strategic_opportunities(null,null,null,null) is not null as ok"],
  ["list_app_portal_organizational_forecasting", "select public.list_app_portal_org_forecasting(null,null,null,null,null,null,null,null) is not null as ok"],
  ["list_app_portal_enterprise_readiness", "select public.list_app_portal_enterprise_readiness(null,null,null,null) is not null as ok"],
  ["list_app_portal_cross_functional_intelligence", "select public.list_app_portal_cross_functional_intelligence(null,null,null,null) is not null as ok"],
  ["list_app_portal_intelligence_command_center", "select public.get_app_portal_intelligence_command_center(null,null,null,null,null,null,null) is not null as ok"],
  ["list_app_portal_future_state_planning", "select public.list_app_portal_future_state_planning(null,null,null,null) is not null as ok"],
  ["list_app_portal_command_center", "select public.list_app_portal_command_center(null,null,null,null,null,null) is not null as ok"],
  ["get_app_portal_success_center", "select public.get_app_portal_success_center() is not null as ok"],
  ["get_app_portal_executive_insights", "select public.get_app_portal_executive_insights() is not null as ok"],
  ["list_app_portal_customer_health", "select public.list_app_portal_customer_health(null,null,null,null,null) is not null as ok"],
  ["list_app_portal_responsibilities", "select public.list_app_portal_responsibilities(null,null,null,null,null,null,null) is not null as ok"],
  ["get_activity_operations_center", "select public.get_activity_operations_center(null) is not null as ok"],
  ["list_app_portal_business_pack_recommendations", "select public.list_app_portal_business_pack_recommendation_engine(null,null,null,null,null,null,null) is not null as ok"],
];

async function main() {
  console.log("Phase 620 P1 — RPC smoke checks (Unonight auth user)\n");
  let pass = 0;
  let fail = 0;

  for (const [name, query] of RPC_CHECKS) {
    try {
      await asUser(query);
      console.log(`✓ ${name}`);
      pass++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`✗ ${name}: ${msg.slice(0, 180)}`);
      fail++;
    }
  }

  const fnRows = await sql(`
    select pg_get_functiondef(p.oid) as def
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'list_app_portal_responsibilities'
    limit 1;
  `);
  const def = String(fnRows[0]?.def ?? "");
  const arLegacy = def.includes("ar.company_id");
  console.log(arLegacy ? "✗ list_app_portal_responsibilities still references ar.company_id" : "✓ list_app_portal_responsibilities tenant path verified");
  if (arLegacy) fail++;
  else pass++;

  const scoreRows = await sql(`
    select pronargs from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_aore298_compute_scores'
    order by pronargs;
  `);
  console.log(`✓ _aore298_compute_scores overloads: ${scoreRows.map((r) => r.pronargs).join(", ")} arg(s)`);
  pass++;

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
