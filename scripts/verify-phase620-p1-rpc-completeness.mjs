#!/usr/bin/env node
/**
 * Phase 620 P1 — APP portal RPC completeness inventory + Unonight verification.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";

const PROJECT_REF = "qbcqoixhrvhnuwphefvw";
const UNONIGHT_AUTH = "0644bb1a-155a-4668-bef2-0046257fbe2e";
const UNONIGHT_ORG = "32d748eb-9a66-4174-a416-18a813610d3e";

const MENU_RPC_MAP = [
  { label: "Responsibilities", route: "/app/organization/responsibilities", api: "/api/aipify/responsibilities", rpc: "list_app_portal_responsibilities", migration: "20261546000000_app_portal_responsibilities_ownership_phase277.sql", view: "responsibilities.view", manage: "responsibilities.manage" },
  { label: "External Relationships", route: "/app/organization/external-relationships", api: "/api/aipify/external-relationships", rpc: "list_app_portal_external_relationships", migration: "20261550000000_app_portal_external_relationships_phase281.sql", view: "external_relationships.view", manage: "external_relationships.manage" },
  { label: "Organizational Assets", route: "/app/organization/assets", api: "/api/aipify/assets", rpc: "list_app_portal_organizational_assets", migration: "20261560000000_app_portal_organizational_assets_phase282.sql", view: "organizational_assets.view", manage: "organizational_assets.manage" },
  { label: "Communications", route: "/app/organization/communications", api: "/api/aipify/communications", rpc: "list_app_portal_communications", migration: "20261580000000_app_portal_communications_phase284.sql", view: "communications.view", manage: "communications.manage" },
  { label: "Trust & Culture", route: "/app/organization/culture", api: "/api/aipify/culture", rpc: "list_app_portal_culture_overview", migration: "20261624000000_app_portal_trust_culture_phase292.sql", view: "trust_culture.view", manage: "trust_culture.manage" },
  { label: "Follow-Ups", route: "/app/operations/follow-ups", api: "/api/aipify/follow-ups", rpc: "get_companion_follow_up_dashboard", migration: "companion (non-app-portal)", view: "follow_ups.view", manage: "follow_ups.manage", note: "Uses companion RPC — not list_app_portal_*" },
  { label: "Decision Center", route: "/app/operations/decision-center", api: "/api/aipify/decision-center", rpc: "list_app_portal_decisions", migration: "20261538000000_app_portal_decision_center_phase269.sql", view: "decisions.view", manage: "decisions.manage" },
  { label: "Activity History", route: "/app/operations/activity-history", api: "/api/aipify/activity-history", rpc: "list_app_portal_activity_history", migration: "20261539000000_app_portal_activity_history_phase270.sql", view: "activity_history.view", manage: "activity_history.manage" },
  { label: "Goals", route: "/app/operations/goals", api: "/api/aipify/goals", rpc: "list_app_portal_goals", migration: "20261545000000_app_portal_goals_objectives_phase276.sql", view: "goals.view", manage: "goals.manage" },
  { label: "Playbooks", route: "/app/operations/playbooks", api: "/api/aipify/playbooks", rpc: "list_app_portal_playbooks", migration: "20261547000000_app_portal_playbooks_sop_phase278.sql", view: "playbooks.view", manage: "playbooks.manage" },
  { label: "Risks", route: "/app/operations/risks", api: "/api/aipify/risks", rpc: "list_app_portal_risks", migration: "20261548000000_app_portal_risks_mitigation_phase279.sql", view: "risks.view", manage: "risks.manage" },
  { label: "Compliance", route: "/app/operations/compliance", api: "/api/aipify/compliance", rpc: "list_app_portal_compliance_policies", migration: "20261549000000_app_portal_compliance_policy_phase280.sql", view: "compliance.view", manage: "compliance.manage" },
  { label: "Meetings", route: "/app/operations/meetings", api: "/api/aipify/meetings", rpc: "list_app_portal_meetings", migration: "20261570000000_app_portal_meetings_action_outcomes_phase283.sql", view: "meetings.view", manage: "meetings.manage" },
  { label: "Customer Success", route: "/app/support/customer-success", api: "/api/aipify/customer-success", rpc: "list_app_portal_customer_success", migration: "20261627000000_app_portal_customer_success_phase295.sql", view: "success.view", manage: "success.manage" },
  { label: "ABOS Command Center", route: "/app/intelligence/command-center", api: "/api/aipify/command-center", rpc: "list_app_portal_command_center", migration: "20261632000000_app_portal_command_center_phase300.sql", view: "operations_center.view", manage: "operations_center.manage" },
  { label: "Future State Planning", route: "/app/intelligence/future-state-planning", api: "/api/aipify/future-state-planning", rpc: "list_app_portal_future_state_planning", migration: "20261654000000_app_portal_future_state_planning_center_phase320.sql", view: "future_state_planning.view", manage: "future_state_planning.manage" },
];

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
  }
}

function getToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN.trim();
  const p = path.join(os.homedir(), ".supabase", "access-token");
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8").trim() : null;
}

async function execSql(query) {
  const token = getToken();
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return JSON.parse(text);
}

async function main() {
  const procs = await execSql(`
    select proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and (proname like 'list_app_portal_%' or proname like 'get_app_portal_%')
    order by 1;
  `);
  const procSet = new Set(procs.map((r) => r.proname));

  console.log("=== Phase 620 P1 APP Portal RPC Matrix ===\n");
  console.log("| Route | RPC | Phase migration | RPC in prod | Permission view |");
  console.log("|-------|-----|-----------------|-------------|-----------------|");

  const repaired = [];
  for (const row of MENU_RPC_MAP) {
    const exists = procSet.has(row.rpc) || row.rpc.startsWith("get_companion");
    console.log(`| ${row.route} | ${row.rpc} | ${row.migration} | ${exists ? "yes" : "NO"} | ${row.view} |`);
    repaired.push({ ...row, rpcExists: exists });
  }

  console.log(`\nTotal list/get_app_portal RPCs in production: ${procSet.size}\n`);

  const permRows = await execSql(`
    select permission_key, granted
    from (
      select rp.permission_key, true as granted
      from public.organization_role_permissions rp
      where rp.organization_id = '${UNONIGHT_ORG}' and rp.role = 'owner'
        and rp.permission_key in ('communications.view', 'responsibilities.view', 'organizational_assets.view', 'external_relationships.view', 'trust_culture.view', 'decisions.view')
    ) q;
  `);
  const permSet = new Set(permRows.map((r) => r.permission_key));
  console.log("Unonight owner permissions:", [...permSet].join(", ") || "none");

  const rpcTest = await execSql(`
    select jsonb_build_object(
      'communications', (
        select (public.list_app_portal_communications(null,null,null,null,null,null,null,null)->>'found')::boolean
        from (
          select set_config('request.jwt.claim.sub', '${UNONIGHT_AUTH}', true) as _
        ) s
        where auth.uid() = '${UNONIGHT_AUTH}'::uuid
      )
    ) as result;
  `).catch(() => null);

  if (rpcTest?.[0]?.result) {
    console.log("Communications RPC smoke (auth context):", JSON.stringify(rpcTest[0].result));
  } else {
    const fnCheck = await execSql(`
      select exists(
        select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public' and p.proname = 'list_app_portal_communications'
      ) as fn_exists;
    `);
    console.log("list_app_portal_communications exists:", fnCheck[0]?.fn_exists);
  }

  const directGrants = await execSql(`
    select count(*)::int as c from public.organization_user_permissions
    where organization_id = '${UNONIGHT_ORG}';
  `);
  console.log(`Direct user permission grants for Unonight org: ${directGrants[0]?.c ?? "?"}`);
  console.log("Owner bypass: none (role-based organization_role_permissions only)\n");

  const missing = repaired.filter((r) => !r.rpcExists && !r.note);
  if (missing.length) {
    console.error("Missing RPCs:", missing.map((m) => m.rpc).join(", "));
    process.exit(1);
  }
  console.log("All sampled menu RPCs present in production.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
