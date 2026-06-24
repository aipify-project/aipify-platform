#!/usr/bin/env node
/**
 * OAA Intent Hotfix — manual runtime gate against live APP (local dev or production).
 * Proves Companion + APP panel flows with authenticated sessions. No secrets logged.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { buildSupabaseAuthCookieHeader } from "./lib/companion-e2e-auth.mjs";

const repoRoot = process.cwd();
const BASE_URL = (process.env.APP_LIVE_E2E_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const TEST_TAG = `oaa-intent-gate-${Date.now()}`;
const RAW_KEY_PATTERNS = [
  /No Authority Message/i,
  /Why Needed/i,
  /Provider Context/i,
  /approver_should_grant_directly/i,
  /customerApp\./,
  /scope_key/i,
  /permission_key/i,
];

const evidence = [];

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
    for (const [k, v] of Object.entries(parseEnvFile(path.join(repoRoot, file)))) {
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

function requireEnv(name) {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

function resolveServiceRoleKey() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) return process.env.SUPABASE_SERVICE_ROLE_KEY.trim();
  const ref = new URL(requireEnv("NEXT_PUBLIC_SUPABASE_URL")).hostname.split(".")[0];
  const raw = execSync(`npx supabase projects api-keys --project-ref ${ref} -o json`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const parsed = JSON.parse(raw);
  const entries = Array.isArray(parsed) ? parsed : parsed.keys ?? [];
  const key = entries.find((e) => e.name === "service_role")?.api_key;
  if (!key?.trim()) throw new Error("service_role unavailable");
  process.env.SUPABASE_SERVICE_ROLE_KEY = key.trim();
  return key.trim();
}

async function authAsEmail(admin, anon, email) {
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkError || !linkData?.properties?.hashed_token) {
    throw new Error(linkError?.message ?? "magiclink failed");
  }
  const { data, error } = await anon.auth.verifyOtp({
    type: "email",
    token_hash: linkData.properties.hashed_token,
  });
  if (error || !data.session) throw new Error(error?.message ?? "otp failed");
  return data.session;
}

function excerpt(text, max = 220) {
  const n = String(text ?? "").replace(/\s+/g, " ").trim();
  return n.length <= max ? n : `${n.slice(0, max)}…`;
}

function parseUrlParams(href) {
  try {
    const url = new URL(href, BASE_URL);
    return Object.fromEntries(url.searchParams.entries());
  } catch {
    return {};
  }
}

function hasRawKeys(text) {
  return RAW_KEY_PATTERNS.some((pattern) => pattern.test(String(text ?? "")));
}

function recordEvidence(entry) {
  evidence.push(entry);
  const status = entry.pass ? "PASS" : "FAIL";
  console.log(`\n${status} — ${entry.id}`);
  console.log(JSON.stringify(entry, null, 2));
}

async function submitCompanion(session, question, locale = "no", conversationId = randomUUID()) {
  const clientMessageId = `${TEST_TAG}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const body = {
    conversation_id: conversationId,
    idempotency_key: `${conversationId}:${clientMessageId}`,
    question,
    attachment_ids: [],
    active_artifact_id: null,
    attachment_summaries: [],
    locale,
    pathname: "/app/command-center",
    platform_active_modules: null,
    title: question.slice(0, 120),
    companion_active: true,
    timezone: "Europe/Oslo",
  };
  const res = await fetch(`${BASE_URL}/api/aipify/companion/chat/enqueue`, {
    method: "POST",
    headers: {
      Cookie: buildSupabaseAuthCookieHeader(session),
      "Content-Type": "application/json",
      "x-timezone": "Europe/Oslo",
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  const userMessageId = json.user_message_id;
  let assistant = null;
  if (userMessageId) {
    const deadline = Date.now() + 45000;
    while (Date.now() < deadline) {
      const stateRes = await fetch(
        `${BASE_URL}/api/aipify/companion/chat/state?conversation_id=${encodeURIComponent(conversationId)}`,
        { headers: { Cookie: buildSupabaseAuthCookieHeader(session) } },
      );
      const state = await stateRes.json().catch(() => ({}));
      const messages = state.messages ?? [];
      const match = messages.find(
        (m) =>
          m.role === "assistant" &&
          m.payload &&
          typeof m.payload === "object" &&
          m.payload.response_to_message_id === userMessageId,
      );
      if (match) {
        assistant = {
          content: match.content,
          payload: match.payload,
          sourceId: match.payload?.sourceId ?? null,
          ctas: match.payload?.ctas ?? [],
        };
        break;
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  return {
    conversationId,
    userMessageId,
    execution: json.execution,
    route: json.route,
    assistant,
    enqueue: json,
  };
}

async function fetchPanelPage(session, locale, panelHref) {
  const res = await fetch(`${BASE_URL}${panelHref.startsWith("/") ? panelHref : `/${panelHref}`}`, {
    headers: {
      Cookie: buildSupabaseAuthCookieHeader(session),
      "Accept-Language": locale === "en" ? "en" : "no",
    },
    redirect: "follow",
  });
  return { status: res.status, html: await res.text() };
}

async function fetchPanelApi(session) {
  const res = await fetch(`${BASE_URL}/api/app/organization-access/requests?status=pending`, {
    headers: { Cookie: buildSupabaseAuthCookieHeader(session) },
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

async function createEphemeralStaff(admin, orgId, companyId) {
  const email = `oaa-intent-staff-${randomUUID().slice(0, 8)}@aipify-gate.invalid`;
  const { data: authUser, error: authErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { oaa_intent_gate: true },
  });
  if (authErr || !authUser.user) throw new Error(authErr?.message ?? "staff create failed");
  const { data: appUser } = await admin
    .from("users")
    .select("id, company_id")
    .eq("auth_user_id", authUser.user.id)
    .maybeSingle();
  if (!appUser?.id) throw new Error("app user missing");
  await admin
    .from("users")
    .update({ company_id: companyId, role: "read_only" })
    .eq("id", appUser.id);
  const ins = await admin.from("organization_users").insert({
    organization_id: orgId,
    user_id: appUser.id,
    role: "viewer",
    status: "active",
    joined_at: new Date().toISOString(),
  });
  if (ins.error) throw new Error(`organization_users insert failed: ${ins.error.message}`);
  await admin.from("organization_user_permissions").upsert(
    {
      organization_id: orgId,
      user_id: appUser.id,
      permission_key: "customer_community.view",
      granted: true,
    },
    { onConflict: "organization_id,user_id,permission_key" },
  );
  return { email, authUserId: authUser.user.id, appUserId: appUser.id };
}

async function cleanup(admin, staff, requestIds, grantIds) {
  if (grantIds.length) {
    await admin.from("organization_provider_access_grants").delete().in("id", grantIds);
  }
  if (requestIds.length) {
    await admin.from("organization_provider_access_audit_logs").delete().in("request_id", requestIds);
    await admin.from("organization_provider_access_requests").delete().in("id", requestIds);
  }
  if (staff) {
    await admin.from("organization_user_permissions").delete().eq("user_id", staff.appUserId);
    await admin.from("organization_users").delete().eq("user_id", staff.appUserId);
    await admin.from("users").delete().eq("id", staff.appUserId);
    await admin.auth.admin.deleteUser(staff.authUserId);
  }
}

function analyzeCompanionTurn(turn, expectations) {
  const text = `${turn.assistant?.content ?? ""} ${turn.assistant?.payload?.explanation ?? ""}`;
  const ctas = turn.assistant?.payload?.ctas ?? turn.assistant?.ctas ?? [];
  const primaryHref = ctas[0]?.href ?? null;
  const params = primaryHref ? parseUrlParams(primaryHref) : {};
  const labels = ctas.map((c) => c.label).filter(Boolean);
  const checks = {
    hasAnswer: Boolean(turn.assistant?.content),
    noRawKeys: !hasRawKeys(text) && !labels.some((l) => hasRawKeys(l)),
    sourceId: turn.assistant?.sourceId ?? turn.assistant?.payload?.sourceId ?? null,
    ownership_type: params.ownership_type ?? null,
    provider: params.provider ?? null,
    capability: params.capability ?? null,
    intent: params.intent ?? null,
    user_message_id: params.user_message_id ?? turn.userMessageId ?? null,
    panelUrl: primaryHref,
    labels,
    ...expectations,
  };
  const pass =
    checks.hasAnswer &&
    checks.noRawKeys &&
    (expectations.passPredicate ? expectations.passPredicate(checks, turn, text, ctas) : true);
  return { pass, checks, text, ctas };
}

async function main() {
  loadEnv();
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const ownerEmail = requireEnv("APP_LIVE_E2E_EMAIL").toLowerCase();
  const orgSlug = requireEnv("OAA_GATE_ORG_SLUG");
  const serviceKey = resolveServiceRoleKey();

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const anon = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: orgRow } = await admin.from("organizations").select("id").eq("slug", orgSlug).maybeSingle();
  if (!orgRow?.id) throw new Error("org not found");
  const orgId = orgRow.id;
  const { data: customerRow } = await admin.from("customers").select("company_id").eq("id", orgId).maybeSingle();
  const companyId = customerRow?.company_id;

  const requestIds = [];
  const grantIds = [];
  let staff = null;

  try {
    staff = await createEphemeralStaff(admin, orgId, companyId);
    const ownerSession = await authAsEmail(admin, anon, ownerEmail);
    await new Promise((r) => setTimeout(r, 1500));
    const staffSession = await authAsEmail(admin, anon, staff.email);

    const ownerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${ownerSession.access_token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const staffClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${staffSession.access_token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: ownerAppUser } = await admin
      .from("users")
      .select("id")
      .eq("email", ownerEmail)
      .maybeSingle();
    if (ownerAppUser?.id) {
      const { data: existingGrants } = await admin
        .from("organization_provider_access_grants")
        .select("id, granted_from_request_id")
        .eq("organization_id", orgId)
        .eq("user_id", ownerAppUser.id)
        .eq("provider_key", "organization_member_count")
        .eq("active", true);
      for (const grant of existingGrants ?? []) {
        await ownerClient.rpc("revoke_organization_provider_access_grant", { p_grant_id: grant.id });
        if (grant.granted_from_request_id) {
          await admin
            .from("organization_provider_access_requests")
            .delete()
            .eq("id", grant.granted_from_request_id);
        }
      }
    }

    // Health check — APP must be reachable
    const health = await fetch(`${BASE_URL}/api/health`).catch(() => null);
    if (!health?.ok) {
      const root = await fetch(BASE_URL).catch(() => null);
      if (!root?.ok) throw new Error(`APP not reachable at ${BASE_URL}`);
    }

    // 1 — Personal integration (owner)
    const t1 = await submitCompanion(ownerSession, "Kan du styre Spotify for meg?", "no");
    const r1 = analyzeCompanionTurn(t1, {
      passPredicate: (c, _t, text, ctas) =>
        c.ownership_type === "user_owned_account" &&
        c.provider !== "organization_member_count" &&
        c.provider !== "community_member_directory" &&
        !/member_count|medlemstall/i.test(c.capability ?? "") &&
        c.intent === "connect" &&
        ctas.some((a) => /koble til konto|connect account/i.test(a.label ?? "")) &&
        ctas.some((a) => /avbryt|cancel/i.test(a.label ?? "")) &&
        !/Send forespørsel|submit request/i.test(text) &&
        !/spotify/i.test(c.sourceId ?? ""),
    });
    recordEvidence({
      id: "1_personal_integration_owner",
      pass: r1.pass,
      answer: excerpt(r1.text),
      route: t1.route,
      execution: t1.execution,
      ownership_type: r1.checks.ownership_type,
      provider: r1.checks.provider,
      capability: r1.checks.capability,
      user_message_id: r1.checks.user_message_id,
      panelUrl: r1.checks.panelUrl,
      sourceId: r1.checks.sourceId,
      labels: r1.checks.labels,
    });

    // 2 — Organization access owner (member count) — companion answer only (grant later)
    const t2 = await submitCompanion(ownerSession, "Hvor mange medlemmer har vi?", "no");
    const r2 = analyzeCompanionTurn(t2, {
      passPredicate: (c, _t, text, ctas) =>
        c.ownership_type === "organization_owned_resource" &&
        (c.provider === "organization_member_count" || c.capability === "member.count.read") &&
        !/spotify|personal_streaming|user_owned/i.test(c.panelUrl ?? "") &&
        c.intent === "approve" &&
        ctas.some((a) => /godkjenn tilgang|approve access/i.test(a.label ?? "")) &&
        !/Send forespørsel|submit request/i.test(text),
    });
    recordEvidence({
      id: "2_org_access_owner_member_count",
      pass: r2.pass,
      answer: excerpt(r2.text),
      route: t2.route,
      execution: t2.execution,
      ownership_type: r2.checks.ownership_type,
      provider: r2.checks.provider,
      capability: r2.checks.capability,
      user_message_id: r2.checks.user_message_id,
      panelUrl: r2.checks.panelUrl,
      sourceId: r2.checks.sourceId,
      labels: r2.checks.labels,
    });

    // 4 — Stale intent sequence (same conversation, before owner grant)
    const staleConv = randomUUID();
    const staleSteps = [];
    for (const question of [
      "Kan du styre Spotify for meg?",
      "Hvor mange medlemmer har vi?",
      "Kan du koble til musikkontoen min?",
    ]) {
      const turn = await submitCompanion(ownerSession, question, "no", staleConv);
      const params = parseUrlParams(turn.assistant?.payload?.ctas?.[0]?.href ?? "");
      staleSteps.push({
        question,
        ownership_type: params.ownership_type ?? null,
        provider: params.provider ?? null,
        capability: params.capability ?? null,
        user_message_id: params.user_message_id ?? turn.userMessageId,
        panelUrl: turn.assistant?.payload?.ctas?.[0]?.href ?? null,
        sourceId: turn.assistant?.payload?.sourceId ?? null,
      });
    }
    const urls = staleSteps.map((s) => s.panelUrl).filter(Boolean);
    const uniqueUrls = new Set(urls);
    const stalePass =
      staleSteps[0]?.ownership_type === "user_owned_account" &&
      staleSteps[1]?.ownership_type === "organization_owned_resource" &&
      staleSteps[2]?.ownership_type === "user_owned_account" &&
      staleSteps[0]?.user_message_id !== staleSteps[1]?.user_message_id &&
      staleSteps[1]?.user_message_id !== staleSteps[2]?.user_message_id &&
      uniqueUrls.size === urls.length &&
      !staleSteps[0]?.panelUrl?.includes("organization_member_count") &&
      !staleSteps[1]?.panelUrl?.includes("personal_streaming") &&
      !staleSteps[1]?.panelUrl?.includes("spotify");
    recordEvidence({ id: "4_stale_intent_isolation", pass: stalePass, steps: staleSteps });

    // 3 — Employee flow (before owner direct grant)
    const t3 = await submitCompanion(staffSession, "Hvor mange medlemmer har vi?", "no");
    const r3 = analyzeCompanionTurn(t3, {
      passPredicate: (c, _t, text, ctas) =>
        c.ownership_type === "organization_owned_resource" &&
        c.intent === "create" &&
        ctas.some((a) => /send forespørsel|submit request/i.test(a.label ?? "")) &&
        ctas.some((a) => /avbryt|cancel/i.test(a.label ?? "")) &&
        !/godkjenn tilgang|approve access/i.test(text),
    });

    let staffRequestId = null;
    if (r3.checks.panelUrl) {
      const params = parseUrlParams(r3.checks.panelUrl);
      const createRes = await fetch(`${BASE_URL}/api/app/organization-access/requests`, {
        method: "POST",
        headers: {
          Cookie: buildSupabaseAuthCookieHeader(staffSession),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider_key: params.provider ?? "organization_member_count",
          capability_key: params.capability ?? "member.search",
          scope_keys: ["organization.members.count.read"],
          context_payload: {
            access_intent: "create",
            ownership_type: "organization_owned_resource",
            user_message_id: params.user_message_id ?? t3.userMessageId,
            organization_id: orgId,
          },
          idempotency_key: `gate-create:${params.user_message_id ?? t3.userMessageId}`,
        }),
      });
      const created = await createRes.json().catch(() => ({}));
      staffRequestId = created?.request?.id ?? null;
      if (staffRequestId) requestIds.push(staffRequestId);

      const ctx = created?.request?.context_payload ?? {};
      recordEvidence({
        id: "3_employee_request_flow",
        pass:
          r3.pass &&
          createRes.ok &&
          ctx.user_message_id === (params.user_message_id ?? t3.userMessageId) &&
          ctx.ownership_type === "organization_owned_resource",
        answer: excerpt(r3.text),
        route: t3.route,
        execution: t3.execution,
        ownership_type: r3.checks.ownership_type,
        provider: r3.checks.provider ?? created?.request?.provider_key,
        capability: r3.checks.capability ?? created?.request?.capability_key,
        user_message_id: params.user_message_id ?? t3.userMessageId,
        panelUrl: r3.checks.panelUrl,
        request_id: staffRequestId,
        labels: r3.checks.labels,
        create_error: created?.error ?? null,
      });

      const panel = await fetchPanelApi(ownerSession);
      const found = (panel.json.requests ?? []).find((r) => r.id === staffRequestId);
      recordEvidence({
        id: "3b_owner_sees_employee_request",
        pass: Boolean(found) && found.status === "pending",
        panel_can_review: panel.json.can_review === true,
        request_id: staffRequestId,
      });

      const staffApprove = await staffClient.rpc("approve_organization_provider_access_request", {
        p_request_id: staffRequestId,
      });
      recordEvidence({
        id: "3c_employee_cannot_approve",
        pass: Boolean(staffApprove.error?.message?.includes("approval_forbidden")),
        detail: staffApprove.error?.message ?? "unexpected approve success",
      });
    } else {
      recordEvidence({
        id: "3_employee_request_flow",
        pass: false,
        error: "missing panel URL",
        enqueue: t3.enqueue,
        assistant_sourceId: t3.assistant?.payload?.sourceId ?? t3.assistant?.sourceId ?? null,
        assistant_excerpt: excerpt(t3.assistant?.content ?? ""),
      });
    }

    // 2b — Owner direct grant without pending request (clear staff pending first)
    if (r2.checks.panelUrl) {
      const params = parseUrlParams(r2.checks.panelUrl);
      if (staffRequestId) {
        await admin
          .from("organization_provider_access_requests")
          .delete()
          .eq("id", staffRequestId);
        requestIds.splice(requestIds.indexOf(staffRequestId), 1);
        staffRequestId = null;
      }
      const { count: pendingBefore } = await admin
        .from("organization_provider_access_requests")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .eq("provider_key", params.provider ?? "organization_member_count")
        .eq("status", "pending");
      const grantRes = await fetch(`${BASE_URL}/api/app/organization-access/grant-direct`, {
        method: "POST",
        headers: {
          Cookie: buildSupabaseAuthCookieHeader(ownerSession),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider_key: params.provider ?? "organization_member_count",
          capability_key: params.capability ?? "member.search",
          scope_keys: ["organization.members.count.read"],
          context_payload: {
            access_intent: "approve",
            ownership_type: "organization_owned_resource",
            user_message_id: params.user_message_id ?? t2.userMessageId,
          },
          idempotency_key: `gate-direct-owner:${params.user_message_id ?? t2.userMessageId}`,
        }),
      });
      const directGrantResult = await grantRes.json().catch(() => ({}));
      if (directGrantResult?.request?.id) requestIds.push(directGrantResult.request.id);
      if (directGrantResult?.grant?.id) grantIds.push(directGrantResult.grant.id);

      const { data: audits } = await admin
        .from("organization_provider_access_audit_logs")
        .select("event_type")
        .eq("request_id", directGrantResult?.request?.id ?? "00000000-0000-0000-0000-000000000000");
      recordEvidence({
        id: "2b_owner_direct_grant_no_pending",
        pass:
          grantRes.ok &&
          directGrantResult?.grant?.active === true &&
          (pendingBefore ?? 0) === 0 &&
          (audits ?? []).some((a) => a.event_type === "request_created") &&
          (audits ?? []).some((a) => a.event_type === "request_approved"),
        grant_id: directGrantResult?.grant?.id ?? null,
        request_id: directGrantResult?.request?.id ?? null,
        pending_before: pendingBefore ?? 0,
        audit_events: (audits ?? []).map((a) => a.event_type),
        error: directGrantResult?.error ?? null,
      });
    } else {
      recordEvidence({
        id: "2b_owner_direct_grant_no_pending",
        pass: false,
        error: "missing panel URL from companion",
      });
    }

    // 5 — APP panel NO + EN
    const panelPath =
      r2.checks.panelUrl?.replace(BASE_URL, "") ??
      "/app/settings/organization-access?intent=approve&provider=organization_member_count&ownership_type=organization_owned_resource";
    for (const locale of ["no", "en"]) {
      const page = await fetchPanelPage(ownerSession, locale, panelPath);
      recordEvidence({
        id: `5_panel_${locale}`,
        pass: page.status === 200 && !hasRawKeys(page.html),
        status: page.status,
        locale,
        sample: excerpt(page.html.replace(/<[^>]+>/g, " "), 300),
      });
    }

    // Static checks
    const corePaths = [
      "lib/core/authorization-target",
      "lib/core/organization-access-approval",
      "lib/companion-runtime/authorization-target-routing.ts",
      "lib/companion-runtime/organization-access-gate.ts",
    ];
    let unonightHits = 0;
    for (const rel of corePaths) {
      const abs = path.join(repoRoot, rel);
      if (!fs.existsSync(abs)) continue;
      const files = fs.statSync(abs).isDirectory()
        ? fs.readdirSync(abs).map((f) => path.join(abs, f))
        : [abs];
      for (const file of files) {
        if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;
        const src = fs.readFileSync(file, "utf8");
        if (/\bunonight\b/i.test(src)) unonightHits += 1;
      }
    }
    recordEvidence({ id: "6_core_no_unonight", pass: unonightHits === 0, hits: unonightHits });

    execSync(
      "npx --yes tsx lib/core/organization-access-approval/access-intent-binding.test.ts && npx --yes tsx lib/core/authorization-target/authorization-target.test.ts && npx --yes tsx lib/core/organization-access-approval/organization-access-approval.test.ts && npx --yes tsx lib/companion-runtime/organization-capability-resolution.test.ts",
      { cwd: repoRoot, stdio: "pipe", encoding: "utf8" },
    );
    recordEvidence({ id: "7_unit_tests", pass: true });

    execSync("npm run typecheck", {
      cwd: repoRoot,
      stdio: "pipe",
      encoding: "utf8",
      env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=8192" },
    });
    recordEvidence({ id: "8_typecheck", pass: true });
  } finally {
    await cleanup(admin, staff, requestIds, grantIds);
  }

  const failed = evidence.filter((e) => !e.pass);
  const summary = {
    base: BASE_URL,
    org: orgSlug,
    total: evidence.length,
    passed: evidence.length - failed.length,
    failed: failed.length,
    failed_ids: failed.map((f) => f.id),
  };

  console.log("\n========== OAA INTENT HOTFIX RUNTIME GATE ==========");
  console.log(JSON.stringify(summary, null, 2));

  if (failed.length) {
    console.error("\nMANUAL PASS: BLOCKED — fix failures above before commit.");
    process.exit(1);
  }
  console.log("\nMANUAL PASS: READY FOR HUMAN SIGN-OFF (automated gate green).");
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
