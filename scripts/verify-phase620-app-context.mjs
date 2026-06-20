#!/usr/bin/env node
/**
 * Phase 620 P1 — verify Unonight pilot IDs, lifetime subscription, and APP context RPCs.
 * Usage: node scripts/verify-phase620-app-context.mjs
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const PROJECT_REF = "qbcqoixhrvhnuwphefvw";

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

const UNONIGHT = {
  authUserId: "0644bb1a-155a-4668-bef2-0046257fbe2e",
  publicUserId: "0f1ea9dd-09c4-48af-b890-834fa87c6e06",
  companyId: "7126b75f-0cd9-4727-ab89-e7970df9a163",
  organizationId: "32d748eb-9a66-4174-a416-18a813610d3e",
};

function getManagementToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) {
    return process.env.SUPABASE_ACCESS_TOKEN.trim();
  }
  const tokenPath = path.join(os.homedir(), ".supabase", "access-token");
  if (fs.existsSync(tokenPath)) {
    return fs.readFileSync(tokenPath, "utf8").trim();
  }
  try {
    return execSync('security find-generic-password -s "Supabase CLI" -w 2>/dev/null', {
      encoding: "utf8",
      timeout: 5000,
    }).trim();
  } catch {
    return null;
  }
}

async function execSql(query) {
  const token = getManagementToken();
  if (!token) return null;
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text);
  }
  const parsed = JSON.parse(text);
  return Array.isArray(parsed) ? parsed : parsed?.result ?? parsed;
}

function ok(label, pass, detail = "") {
  const icon = pass ? "✓" : "✗";
  console.log(`${icon} ${label}${detail ? `: ${detail}` : ""}`);
  return pass;
}

function isLifetimePlan(planName, planKey, orgSubStatus) {
  const name = String(planName ?? "").toLowerCase();
  const key = String(planKey ?? "").toLowerCase();
  if (name.includes("lifetime")) return true;
  if (key === "lifetime") return true;
  return false;
}

function isInternalPilotBypass(planKey, orgSubStatus, planName) {
  const key = String(planKey ?? "").toLowerCase();
  const status = String(orgSubStatus ?? "").toLowerCase();
  const name = String(planName ?? "").toLowerCase();
  return key === "internal" && (status === "internal" || name.includes("internal"));
}

async function verifyLifetimeViaSql() {
  const rows = await execSql(`
    select
      os.plan_key as org_plan_key,
      os.status as org_sub_status,
      os.expires_at as org_expires_at,
      s.plan_key as sub_plan_key,
      s.plan_name,
      s.status as sub_status,
      s.current_period_end,
      s.license_service_status,
      als.app_license_status,
      als.renewal_date
    from public.organization_subscriptions os
    left join public.subscriptions s on s.customer_id = os.organization_id
    left join public.organization_app_license_state als on als.organization_id = os.organization_id
    where os.organization_id = '${UNONIGHT.organizationId}'
    limit 1;
  `);

  if (!rows?.length) {
    return ok("lifetime subscription row", false, "organization_subscriptions missing");
  }

  const row = rows[0];
  let allPass = true;

  allPass =
    ok(
      "not internal pilot bypass",
      !isInternalPilotBypass(row.org_plan_key, row.org_sub_status, row.plan_name),
      `org=${row.org_plan_key}/${row.org_sub_status} plan=${row.plan_name ?? "null"}`
    ) && allPass;

  allPass =
    ok(
      "lifetime subscription type",
      isLifetimePlan(row.plan_name, row.org_plan_key, row.org_sub_status),
      `plan_name=${row.plan_name ?? "null"} plan_key=${row.org_plan_key ?? "null"}`
    ) && allPass;

  allPass =
    ok("subscription status active", String(row.sub_status ?? "").toLowerCase() === "active", row.sub_status) &&
    allPass;

  allPass =
    ok(
      "license service active",
      String(row.license_service_status ?? "").toLowerCase() === "active",
      row.license_service_status
    ) && allPass;

  allPass =
    ok(
      "app license active",
      String(row.app_license_status ?? "").toLowerCase() === "active",
      row.app_license_status
    ) && allPass;

  allPass =
    ok("renewal not required", row.renewal_date == null, row.renewal_date ?? "set") && allPass;

  allPass =
    ok(
      "no org subscription expiration",
      row.org_expires_at == null,
      row.org_expires_at ?? "expires set"
    ) && allPass;

  const hardcoded = await execSql(`
    select count(*)::int as count
    from public.organization_user_permissions oup
    join public.users u on u.id = oup.user_id
    join auth.users au on au.id = u.auth_user_id
    where oup.organization_id = '${UNONIGHT.organizationId}'
      and lower(au.email) = lower('admin@unonight.com');
  `);
  allPass =
    ok(
      "no admin@unonight.com user permission bypass",
      Number(hardcoded?.[0]?.count ?? 0) === 0,
      `${hardcoded?.[0]?.count ?? "?"} direct grants`
    ) && allPass;

  return allPass;
}

async function main() {
  console.log("Phase 620 — APP organization context verification\n");

  let allPass = true;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasServiceKey = Boolean(url && serviceKey);

  if (!hasServiceKey) {
    console.log("Note: SUPABASE_SERVICE_ROLE_KEY not in env — using Management API SQL checks.\n");
  }

  allPass = (await verifyLifetimeViaSql()) && allPass;

  if (!hasServiceKey) {
    console.log("");
    if (allPass) {
      console.log("All Phase 620 SQL checks passed.");
      process.exit(0);
    }
    console.error("Some checks failed — review Unonight subscription and seed data.");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userRow, error: userErr } = await supabase
    .from("users")
    .select("id, auth_user_id, company_id, role")
    .eq("id", UNONIGHT.publicUserId)
    .maybeSingle();
  allPass =
    ok("public.users row exists", !userErr && !!userRow, userErr?.message ?? userRow?.id) && allPass;
  if (userRow) {
    allPass =
      ok("users.auth_user_id matches", userRow.auth_user_id === UNONIGHT.authUserId) && allPass;
    allPass = ok("users.company_id matches", userRow.company_id === UNONIGHT.companyId) && allPass;
  }

  const { data: customerRow } = await supabase
    .from("customers")
    .select("id, company_id")
    .eq("company_id", UNONIGHT.companyId)
    .maybeSingle();
  allPass =
    ok(
      "customers.id matches organizationId",
      customerRow?.id === UNONIGHT.organizationId,
      customerRow?.id ?? "missing"
    ) && allPass;

  const { data: membership } = await supabase
    .from("organization_users")
    .select("id, role, status")
    .eq("organization_id", UNONIGHT.organizationId)
    .eq("user_id", UNONIGHT.publicUserId)
    .maybeSingle();
  allPass =
    ok(
      "organization_users active membership",
      membership?.status === "active",
      membership ? `${membership.role}/${membership.status}` : "missing"
    ) && allPass;

  const { data: notifPerm } = await supabase
    .from("organization_role_permissions")
    .select("permission_key")
    .eq("organization_id", UNONIGHT.organizationId)
    .eq("role", "owner")
    .eq("permission_key", "notifications.view")
    .maybeSingle();
  allPass = ok("owner has notifications.view", !!notifPerm) && allPass;

  const { data: ctx, error: ctxErr } = await supabase.rpc("get_app_organization_context");
  if (ctxErr) {
    allPass = ok("get_app_organization_context RPC", false, ctxErr.message) && allPass;
  } else {
    const state = ctx?.state ?? ctx?.access_state;
    allPass =
      ok(
        "get_app_organization_context callable",
        true,
        `state=${state} org=${ctx?.organization_id ?? "null"}`
      ) && allPass;
    if (ctx?.organization_id) {
      allPass =
        ok(
          "RPC organization_id matches Unonight",
          ctx.organization_id === UNONIGHT.organizationId,
          ctx.organization_id
        ) && allPass;
    }
  }

  const { data: syncResult, error: syncErr } = await supabase.rpc("sync_app_organization_access", {
    p_organization_id: UNONIGHT.organizationId,
  });
  allPass =
    ok(
      "sync_app_organization_access",
      !syncErr,
      syncErr?.message ?? (syncResult === null ? "ok" : String(syncResult))
    ) && allPass;

  console.log("");
  if (allPass) {
    console.log("All Phase 620 context checks passed.");
    process.exit(0);
  }
  console.error("Some checks failed — review migration and Unonight seed data.");
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
