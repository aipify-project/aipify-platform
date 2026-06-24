#!/usr/bin/env node
/**
 * OAA V1 remote database gate — authenticated RPC tests against live Core.
 * Never logs secrets. Cleans up test rows tagged via idempotency_key prefix.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const repoRoot = process.cwd();
const TEST_TAG = `oaa-gate-${Date.now()}`;
const PROVIDER = "community_member_directory";
const SCOPES = ["community.members.read"];

function parseEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const parsed = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && value) parsed[key] = value;
  }
  return parsed;
}

function loadEnv() {
  for (const file of [".env.local", ".env.vercel.prod"]) {
    for (const [key, value] of Object.entries(parseEnvFile(path.join(repoRoot, file)))) {
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function resolveServiceRoleKey() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY.trim();
  }
  const ref = new URL(requireEnv("NEXT_PUBLIC_SUPABASE_URL")).hostname.split(".")[0];
  const raw = execSync(`npx supabase projects api-keys --project-ref ${ref} -o json`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const parsed = JSON.parse(raw);
  const entries = Array.isArray(parsed) ? parsed : parsed.keys ?? [];
  const key = entries.find((entry) => entry.name === "service_role")?.api_key;
  if (!key?.trim()) throw new Error("service_role key unavailable");
  process.env.SUPABASE_SERVICE_ROLE_KEY = key.trim();
  return key.trim();
}

async function authAsEmail(admin, anon, email) {
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkError || !linkData?.properties?.hashed_token) {
    throw new Error(linkError?.message ?? `magiclink failed for ${email.slice(0, 3)}***`);
  }
  const { data, error } = await anon.auth.verifyOtp({
    type: "email",
    token_hash: linkData.properties.hashed_token,
  });
  if (error || !data.session) throw new Error(error?.message ?? "otp verify failed");
  return createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"), {
    global: { headers: { Authorization: `Bearer ${data.session.access_token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function createEphemeralStaff(admin, orgId, companyId) {
  const email = `oaa-gate-staff-${randomUUID().slice(0, 8)}@aipify-gate.invalid`;
  const { data: authUser, error: authErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { oaa_gate_test: true },
  });
  if (authErr || !authUser.user) throw new Error(authErr?.message ?? "staff auth create failed");

  const { data: appUser, error: userErr } = await admin
    .from("users")
    .select("id, company_id")
    .eq("auth_user_id", authUser.user.id)
    .maybeSingle();
  if (userErr || !appUser?.id) throw new Error(userErr?.message ?? "staff app user missing after auth create");

  if (appUser.company_id !== companyId) {
    const { error: companyErr } = await admin
      .from("users")
      .update({ company_id: companyId })
      .eq("id", appUser.id);
    if (companyErr) throw new Error(companyErr.message);
  }

  const { error: memErr } = await admin.from("organization_users").insert({
    organization_id: orgId,
    user_id: appUser.id,
    role: "viewer",
    status: "active",
    joined_at: new Date().toISOString(),
  });
  if (memErr) throw new Error(memErr.message);

  return { email, authUserId: authUser.user.id, appUserId: appUser.id };
}

async function cleanup(admin, orgId, staff) {
  await admin
    .from("organization_provider_access_audit_logs")
    .delete()
    .eq("organization_id", orgId)
    .filter("metadata->>idempotency_key", "like", `${TEST_TAG}%`);

  const { data: reqs } = await admin
    .from("organization_provider_access_requests")
    .select("id")
    .eq("organization_id", orgId)
    .like("idempotency_key", `${TEST_TAG}%`);

  const reqIds = (reqs ?? []).map((r) => r.id);
  if (reqIds.length) {
    await admin.from("organization_provider_access_grants").delete().in("granted_from_request_id", reqIds);
    await admin.from("organization_provider_access_audit_logs").delete().in("request_id", reqIds);
    await admin.from("organization_provider_access_requests").delete().in("id", reqIds);
  }

  await admin
    .from("presence_notifications")
    .delete()
    .eq("tenant_id", orgId)
    .eq("event_type", "organization_access_request")
    .like("metadata->>request_id", "%");

  if (staff) {
    await admin.from("organization_users").delete().eq("user_id", staff.appUserId);
    await admin.from("users").delete().eq("id", staff.appUserId);
    await admin.auth.admin.deleteUser(staff.authUserId);
  }
}

function record(results, name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function main() {
  loadEnv();
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const serviceKey = resolveServiceRoleKey();
  const ownerEmail = requireEnv("APP_LIVE_E2E_EMAIL").toLowerCase();

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const anon = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const orgSlug = process.env.OAA_GATE_ORG_SLUG?.trim();
  if (!orgSlug) throw new Error("Missing OAA_GATE_ORG_SLUG");

  const { data: orgRow } = await admin
    .from("organizations")
    .select("id, slug")
    .eq("slug", orgSlug)
    .maybeSingle();
  if (!orgRow?.id) throw new Error(`organization not found for slug ${orgSlug.slice(0, 2)}***`);
  const orgId = orgRow.id;

  const { data: customerRow } = await admin.from("customers").select("company_id").eq("id", orgId).maybeSingle();
  const companyId = customerRow?.company_id;
  if (!companyId) throw new Error("company_id not found for org");

  let staff = null;
  const results = [];

  try {
    staff = await createEphemeralStaff(admin, orgId, companyId);
    const staffClient = await authAsEmail(admin, anon, staff.email);
    const ownerClient = await authAsEmail(admin, anon, ownerEmail);

    const createPayload = {
      p_provider_key: PROVIDER,
      p_capability_key: "member.search",
      p_scope_keys: SCOPES,
      p_access_mode: "one_time",
      p_duration_hours: 1,
      p_risk_level: 1,
      p_reason_summary: "OAA gate test",
      p_context_payload: { test_tag: TEST_TAG },
      p_idempotency_key: `${TEST_TAG}-1`,
    };

    const create1 = await staffClient.rpc("create_organization_provider_access_request", createPayload);
    record(
      results,
      "staff can create request",
      !create1.error && create1.data?.id,
      create1.error?.message ?? "",
    );
    const requestId = create1.data?.id;

    const dup = await staffClient.rpc("create_organization_provider_access_request", createPayload);
    record(
      results,
      "duplicate request idempotent",
      !dup.error && dup.data?.id === requestId,
      dup.error?.message ?? "",
    );

    const staffApprove = await staffClient.rpc("approve_organization_provider_access_request", {
      p_request_id: requestId,
    });
    record(
      results,
      "staff cannot approve",
      Boolean(staffApprove.error?.message?.includes("approval_forbidden")),
      staffApprove.error?.message ?? "unexpected success",
    );

    const ownerApprove = await ownerClient.rpc("approve_organization_provider_access_request", {
      p_request_id: requestId,
    });
    const grantId = ownerApprove.data?.grant?.id;
    record(
      results,
      "owner can approve",
      !ownerApprove.error && ownerApprove.data?.grant?.active === true,
      ownerApprove.error?.message ?? "",
    );

    const scopeActive = await staffClient.rpc("has_active_organization_provider_scopes", {
      p_provider_key: PROVIDER,
      p_scope_keys: SCOPES,
    });
    record(
      results,
      "approval activates requested scope",
      scopeActive.data === true,
      String(scopeActive.data),
    );

    const { data: auditRows } = await admin
      .from("organization_provider_access_audit_logs")
      .select("event_type")
      .eq("request_id", requestId);
    const events = new Set((auditRows ?? []).map((r) => r.event_type));
    record(
      results,
      "audit for create/approve",
      events.has("request_created") && events.has("request_approved"),
      [...events].join(", "),
    );

    const { count: notifCount } = await admin
      .from("presence_notifications")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", orgId)
      .eq("event_type", "organization_access_request")
      .contains("metadata", { request_id: requestId, approver_only: true });
    record(results, "approver notification created", (notifCount ?? 0) >= 1);

    const staffNotifs = await staffClient.rpc("list_presence_notifications", { p_limit: 50 });
    const staffSeesApproverNotif = (staffNotifs.data?.notifications ?? []).some(
      (n) => n.event_type === "organization_access_request",
    );
    record(results, "staff does not see approver-only notification", staffSeesApproverNotif === false);

    const ownerNotifs = await ownerClient.rpc("list_presence_notifications", { p_limit: 50 });
    const ownerSeesApproverNotif = (ownerNotifs.data?.notifications ?? []).some(
      (n) => n.event_type === "organization_access_request",
    );
    record(results, "owner sees approver notification", ownerSeesApproverNotif === true);

    await ownerClient.rpc("revoke_organization_provider_access_grant", { p_grant_id: grantId });
    const afterRevoke = await staffClient.rpc("has_active_organization_provider_scope", {
      p_provider_key: PROVIDER,
      p_scope_key: SCOPES[0],
    });
    record(results, "revocation deactivates grant", afterRevoke.data === false);

    const denyPayload = {
      ...createPayload,
      p_idempotency_key: `${TEST_TAG}-deny`,
    };
    const denyCreate = await staffClient.rpc("create_organization_provider_access_request", denyPayload);
    const denyId = denyCreate.data?.id;
    await ownerClient.rpc("deny_organization_provider_access_request", {
      p_request_id: denyId,
      p_reason: "gate test deny",
    });
    const { count: denyGrants } = await admin
      .from("organization_provider_access_grants")
      .select("id", { count: "exact", head: true })
      .eq("granted_from_request_id", denyId);
    record(results, "denial creates no grant", (denyGrants ?? 0) === 0);

    const expirePayload = {
      ...createPayload,
      p_idempotency_key: `${TEST_TAG}-expire`,
    };
    const expireCreate = await staffClient.rpc("create_organization_provider_access_request", expirePayload);
    const expireId = expireCreate.data?.id;
    const expireApprove = await ownerClient.rpc("approve_organization_provider_access_request", {
      p_request_id: expireId,
    });
    const expireGrantId = expireApprove.data?.grant?.id;
    await admin
      .from("organization_provider_access_grants")
      .update({ expires_at: new Date(Date.now() - 60_000).toISOString() })
      .eq("id", expireGrantId);
    const expiredCheck = await staffClient.rpc("has_active_organization_provider_scope", {
      p_provider_key: PROVIDER,
      p_scope_key: SCOPES[0],
    });
    record(results, "expired grant returns false", expiredCheck.data === false);

    const invalidScope = await staffClient.rpc("create_organization_provider_access_request", {
      ...createPayload,
      p_scope_keys: ["evil.scope.write"],
      p_idempotency_key: `${TEST_TAG}-invalid`,
    });
    record(
      results,
      "invalid scope rejected",
      Boolean(invalidScope.error?.message?.includes("invalid_scope_keys")),
      invalidScope.error?.message ?? "",
    );

    const otherOrg = await admin.from("organizations").select("id").neq("id", orgId).limit(1).maybeSingle();
    if (otherOrg.data?.id) {
      await admin.from("organization_provider_access_requests").insert({
        organization_id: otherOrg.data.id,
        requester_user_id: staff.appUserId,
        provider_key: PROVIDER,
        scope_keys: SCOPES,
        scope_fingerprint: "other-org-test",
        reason_summary: "foreign",
        idempotency_key: `${TEST_TAG}-foreign`,
      });
    }
    const foreignApprove = await ownerClient.rpc("approve_organization_provider_access_request", {
      p_request_id: randomUUID(),
    });
    record(
      results,
      "foreign org request rejected",
      Boolean(foreignApprove.error?.message?.includes("request_not_found")),
      foreignApprove.error?.message ?? "",
    );
  } finally {
    await cleanup(admin, orgId, staff);
  }

  const failed = results.filter((r) => !r.pass);
  console.log("\n--- SUMMARY ---");
  console.log(JSON.stringify({ total: results.length, passed: results.length - failed.length, failed: failed.length }, null, 2));
  if (failed.length) process.exit(1);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
