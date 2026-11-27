import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import {
  TEMPLATE_LIFECYCLE_SQL_CANDIDATE_PATH,
  TEMPLATE_LIFECYCLE_SQL_CANDIDATE_SHA256,
  TEMPLATE_DRAFT_PERSISTED,
  TEMPLATE_DELETE_PERSISTED,
} from "./template-lifecycle";
import {
  PLATFORM_SUPPORT_CENTER_SQL_CANDIDATE_APPLIED,
  PLATFORM_SUPPORT_CENTER_SQL_CANDIDATE_PATH,
  PLATFORM_SUPPORT_CENTER_SQL_CANDIDATE_SHA256,
  PLATFORM_SUPPORT_CENTER_SQL_TABLES,
} from "./sql-candidate-contract";
import {
  SUPPORT_EMAIL_SEND_CONFIGURED,
  listSupportChannelActivations,
} from "./channel-status";
import { getSupportCenterGateState } from "./gates";
import {
  listSupportReplyStarterTemplates,
  SUPPORT_TEMPLATE_PERSIST_CONFIGURED,
} from "./reply-templates";
import {
  createDefaultSupportSignature,
  officialSignatureDisplayName,
  renderSupportSignatureHtml,
  renderSupportSignatureText,
  SUPPORT_SIGNATURE_LOGO_URL,
  SUPPORT_SIGNATURE_PERSIST_CONFIGURED,
} from "./signature";
import {
  bodyLooksLikeItIncludesSignature,
  renderSupportTemplateBody,
} from "./template-render";
import { parseSupportCenterTab, SUPPORT_TEMPLATE_VARIABLES } from "./types";
import {
  attachSupportSignatureToDraft,
  draftHasSupportSignature,
  stripSupportSignatureFromDraft,
  SUPPORT_SIGNATURE_MARKER,
} from "./signature";
import {
  __resetSupportSignatureStoreForTests,
  getStoredSupportSignature,
  resetSupportSignature,
  saveSupportSignature,
} from "./signature-store";
import {
  computeSupportKpis,
  filterTicketsForTab,
  nextStatusOptions,
  normalizeSupportTimeline,
  resolveTicketDescription,
  ticketFromDetailItem,
} from "./ticket-view";
import {
  SUPPORT_STATUS_TRANSITIONS,
  canTransitionSupportStatus,
  sendPublicSupportReply,
} from "./write-ops";
import {
  SUPPORT_SEND_PUBLIC_REPLY_APPLIED,
  SUPPORT_SEND_PUBLIC_REPLY_SQL_PATH,
  SUPPORT_SEND_PUBLIC_REPLY_SQL_SHA256,
  SUPPORT_APP_VISIBLE_MESSAGES_SQL_PATH,
  SUPPORT_APP_VISIBLE_MESSAGES_SQL_SHA256,
} from "./send-public-reply-contract";
import {
  SUPPORT_EMAIL_DELIVERY_LIVE,
  SUPPORT_EMAIL_TEMPLATE_KEYS,
  getSupportEmailNotifyGateState,
} from "./email-notify-contract";
import { SUPPORT_ALL_CHANNELS_INTAKE_SQL_SHA256 } from "@/lib/support-intake/sql-candidate";
import type { PlatformSupportTicketsListItem } from "@/lib/platform-portal/support-tickets-read-adapter";
import { readFileSync as readLocale } from "node:fs";

assert.equal(parseSupportCenterTab(null), "all");
assert.equal(parseSupportCenterTab("templates"), "templates");
assert.equal(parseSupportCenterTab("nope"), "all");

const gates = getSupportCenterGateState();
assert.equal(gates.ticketsLive, false);
assert.equal(gates.emailSendConfigured, false);
assert.equal(gates.signaturePersistConfigured, false);
assert.equal(gates.templatePersistConfigured, false);
assert.equal(gates.uiWired, true);
assert.equal(SUPPORT_EMAIL_SEND_CONFIGURED, false);
assert.equal(SUPPORT_SIGNATURE_PERSIST_CONFIGURED, false);
assert.equal(SUPPORT_TEMPLATE_PERSIST_CONFIGURED, false);

const channels = listSupportChannelActivations();
assert.equal(channels.length, 5);
assert.equal(channels.find((c) => c.id === "web")?.status, "staging_only");
assert.equal(channels.find((c) => c.id === "app")?.status, "incoming_live");
assert.equal(channels.find((c) => c.id === "partner")?.status, "staging_only");
assert.equal(channels.find((c) => c.id === "kompis")?.status, "not_activated");

const templates = listSupportReplyStarterTemplates();
assert.equal(templates.length, 10);
assert.ok(templates.every((t) => t.locale === "no" && t.starter === true));
assert.ok(templates.every((t) => t.body.includes("{{agent_name}}")));
assert.deepEqual(
  [...SUPPORT_TEMPLATE_VARIABLES],
  ["customer_name", "ticket_number", "product_name", "agent_name"],
);

const okRender = renderSupportTemplateBody(
  "Hei {{customer_name}} — sak {{ticket_number}}",
  { customer_name: "Ada <b>Lovelace</b>", ticket_number: "ABC123" },
);
assert.equal(okRender.ok, true);
if (okRender.ok) {
  assert.equal(okRender.text, "Hei Ada &lt;b&gt;Lovelace&lt;/b&gt; — sak ABC123");
}

const badVar = renderSupportTemplateBody("Hi {{evil}}", {});
assert.equal(badVar.ok, false);
if (!badVar.ok) assert.equal(badVar.error, "unknown_placeholder");

const scriptReject = renderSupportTemplateBody("Hi {{customer_name}}", {
  customer_name: "<script>alert(1)</script>",
});
assert.equal(scriptReject.ok, false);

assert.equal(bodyLooksLikeItIncludesSignature("Med vennlig hilsen\nAda"), true);
assert.equal(bodyLooksLikeItIncludesSignature("Bare tekst"), false);

const sig = createDefaultSupportSignature({ agentName: "Kari Nordmann" });
assert.equal(sig.companyName, "Aipify Group AS");
assert.equal(sig.logoUrl, SUPPORT_SIGNATURE_LOGO_URL);
assert.match(sig.supportEmail, /@aipify\.ai$/);
const html = renderSupportSignatureHtml(sig);
assert.match(html, /aipify-logo-light\.png/);
assert.match(html, /alt="Aipify"/);
assert.doesNotMatch(html, /<script/i);
const text = renderSupportSignatureText(sig);
assert.match(text, /Aipify Group AS/);
assert.match(text, /Kari Nordmann/);
const technical = createDefaultSupportSignature({ displayName: "Verify Display 20261127" });
assert.equal(officialSignatureDisplayName(technical), "Aipify Support");
assert.doesNotMatch(renderSupportSignatureText(technical), /Verify Display/);

assert.equal(TEMPLATE_DRAFT_PERSISTED, false);
assert.equal(TEMPLATE_DELETE_PERSISTED, false);
const lifecycleSql = readFileSync(TEMPLATE_LIFECYCLE_SQL_CANDIDATE_PATH);
assert.equal(
  createHash("sha256").update(lifecycleSql).digest("hex"),
  TEMPLATE_LIFECYCLE_SQL_CANDIDATE_SHA256,
);
assert.match(lifecycleSql.toString("utf8"), /PREPARED_ONLY/);
assert.match(lifecycleSql.toString("utf8"), /DO NOT APPLY/i);
assert.equal(PLATFORM_SUPPORT_CENTER_SQL_CANDIDATE_APPLIED, false);
assert.ok(existsSync(PLATFORM_SUPPORT_CENTER_SQL_CANDIDATE_PATH));
assert.doesNotMatch(PLATFORM_SUPPORT_CENTER_SQL_CANDIDATE_PATH, /supabase\/migrations\//);
const sql = readFileSync(PLATFORM_SUPPORT_CENTER_SQL_CANDIDATE_PATH, "utf8");
const sha = createHash("sha256").update(sql).digest("hex");
assert.equal(sha, PLATFORM_SUPPORT_CENTER_SQL_CANDIDATE_SHA256);
assert.match(sql, /PREPARED_ONLY/);
assert.match(sql, /DO NOT APPLY/i);
// Executable statements must not create/alter CSP sales-email CRM tables.
const executableSql = sql
  .split("\n")
  .filter((line) => !line.trimStart().startsWith("--"))
  .join("\n");
assert.doesNotMatch(executableSql, /csp_sales_email_/);
assert.doesNotMatch(executableSql, /create table[\s\S]*csp_/i);
for (const table of PLATFORM_SUPPORT_CENTER_SQL_TABLES) {
  assert.match(sql, new RegExp(`create table if not exists public\\.${table}`));
}
assert.match(sql, /revoke all on table public\.platform_support_ticket_messages from public, anon, authenticated/i);

// ---------------------------------------------------------------------------
// Polish V2 — Mine tab, KPIs, signature store, signature marker, timeline
// ---------------------------------------------------------------------------

function ticket(
  id: string,
  overrides: Partial<PlatformSupportTicketsListItem> = {},
): PlatformSupportTicketsListItem {
  return {
    id,
    company_id: "c1",
    company_name: "Kunde",
    title: `Sak ${id}`,
    description_preview: "",
    category: "general",
    priority: "normal",
    status: "open",
    channel: "app_portal",
    source_locale: null,
    related_module: null,
    assigned_support_owner_id: null,
    attachment_count: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
    resolved_at: null,
    ...overrides,
  };
}

const rows = [
  ticket("a", { assigned_support_owner_id: "me", status: "in_progress" }),
  ticket("b", { assigned_support_owner_id: "other", priority: "critical" }),
  ticket("c", { priority: "urgent", status: "in_progress" }),
  ticket("d"),
];
assert.deepEqual(
  filterTicketsForTab(rows, "mine", "me").map((r) => r.id),
  ["a"],
);
assert.equal(filterTicketsForTab(rows, "mine", null).length, 0);
assert.equal(filterTicketsForTab(rows, "mine", undefined).length, 0);
assert.equal(filterTicketsForTab(rows, "all", "me").length, 4);

// KPI states: loading / unavailable / zero are all distinguishable.
const kpiLoading = computeSupportKpis({ status: "loading", counts: null, items: [] });
assert.equal(kpiLoading.open.state, "loading");
assert.equal(kpiLoading.critical.state, "loading");
const kpiBlocked = computeSupportKpis({ status: "unavailable", counts: null, items: [] });
assert.equal(kpiBlocked.inProgress.state, "unavailable");
assert.equal(kpiBlocked.usesLoadedPage, false);
const kpiReady = computeSupportKpis({
  status: "ready",
  counts: { total: 9, open: 4, waiting: 2, resolved_or_closed: 3 },
  items: rows,
});
assert.deepEqual(kpiReady.open, { state: "value", value: 4, source: "counts" });
assert.deepEqual(kpiReady.waiting, { state: "value", value: 2, source: "counts" });
assert.deepEqual(kpiReady.resolved, { state: "value", value: 3, source: "counts" });
assert.deepEqual(kpiReady.inProgress, { state: "value", value: 2, source: "page" });
assert.deepEqual(kpiReady.critical, { state: "value", value: 2, source: "page" });
assert.equal(kpiReady.usesLoadedPage, true);
// Counts missing (counts API failed) → counts cards unavailable, never a fake zero.
const kpiNoCounts = computeSupportKpis({ status: "ready", counts: null, items: [] });
assert.equal(kpiNoCounts.open.state, "unavailable");
assert.deepEqual(kpiNoCounts.inProgress, { state: "value", value: 0, source: "page" });

assert.deepEqual(nextStatusOptions("open", SUPPORT_STATUS_TRANSITIONS)[0], "open");
assert.ok(nextStatusOptions("open", SUPPORT_STATUS_TRANSITIONS).includes("in_progress"));
assert.deepEqual(nextStatusOptions("archived", SUPPORT_STATUS_TRANSITIONS), ["archived"]);

// Timeline: honest empty, drops junk, maps message-thread + audit rows.
assert.deepEqual(normalizeSupportTimeline([]), []);
assert.deepEqual(normalizeSupportTimeline(null), []);
const timeline = normalizeSupportTimeline([
  { id: "1", description: "Opprettet", created_at: "2026-01-01T00:00:00Z" },
  {
    id: "2",
    direction: "outbound",
    body_text: "Utkast",
    delivery_status: "blocked_unconfigured",
    created_at: "2026-01-02T00:00:00Z",
  },
  { id: "3", direction: "internal_note", body_text: "Intern" },
  { id: "4" },
  "junk",
]);
assert.deepEqual(
  timeline.map((e) => e.kind),
  ["event", "reply_draft", "internal_note"],
);
assert.equal(timeline[1].deliveryStatus, "blocked_unconfigured");
assert.equal(resolveTicketDescription({ description: "Full tekst" }, "preview"), "Full tekst");
assert.equal(resolveTicketDescription(null, "preview"), "preview");
assert.equal(ticketFromDetailItem("x", null), null);
assert.equal(ticketFromDetailItem("x", { title: "T", status: "open" })?.title, "T");

// Signature marker: attach is idempotent and replaces rather than duplicates.
const sigText = "Aipify Support\nAipify Group AS";
const once = attachSupportSignatureToDraft("Hei,\n\nTakk.", sigText);
assert.ok(once.includes(SUPPORT_SIGNATURE_MARKER));
assert.equal(draftHasSupportSignature(once), true);
assert.equal(draftHasSupportSignature("Hei,\n\nTakk."), false);
const twice = attachSupportSignatureToDraft(once, sigText);
assert.equal(twice, once);
assert.equal(twice.split("Aipify Group AS").length - 1, 1);
assert.equal(stripSupportSignatureFromDraft(once), "Hei,\n\nTakk.");
assert.equal(
  attachSupportSignatureToDraft(once, "Annen signatur").includes("Aipify Group AS"),
  false,
);
assert.equal(attachSupportSignatureToDraft("", sigText).startsWith(SUPPORT_SIGNATURE_MARKER), true);

// Signature store: defaults until saved; save validates; reset clears; never durable.
__resetSupportSignatureStoreForTests();
const initial = getStoredSupportSignature();
assert.equal(initial.customized, false);
assert.equal(initial.persistConfigured, false);
assert.equal(initial.signature.companyName, "Aipify Group AS");
const saved = saveSupportSignature({
  ...initial.signature,
  agentName: "Kari Nordmann",
  logoUrl: "https://evil.example/logo.png",
});
assert.equal(saved.ok, true);
if (saved.ok) {
  assert.equal(saved.customized, true);
  assert.equal(saved.signature.agentName, "Kari Nordmann");
  // Only the official brand logo is ever stored.
  assert.equal(saved.signature.logoUrl, SUPPORT_SIGNATURE_LOGO_URL);
  assert.equal(saved.signature.version, 1);
}
const savedAgain = saveSupportSignature({ ...initial.signature, agentName: "Ola" });
assert.equal(savedAgain.ok && savedAgain.signature.version, 2);
assert.equal(getStoredSupportSignature().signature.agentName, "Ola");
assert.equal(
  saveSupportSignature({ ...initial.signature, supportEmail: "x@aipify.com" }).ok,
  false,
);
assert.equal(
  saveSupportSignature({ ...initial.signature, supportEmail: "not-an-email" }).ok,
  false,
);
assert.equal(
  saveSupportSignature({ ...initial.signature, websiteUrl: "javascript:alert(1)" }).ok,
  false,
);
assert.equal(saveSupportSignature({ ...initial.signature, companyName: "", displayName: "" }).ok, false);
assert.equal(saveSupportSignature(null).ok, false);
// Failed saves never overwrite the stored signature.
assert.equal(getStoredSupportSignature().signature.agentName, "Ola");
const resetResult = resetSupportSignature();
assert.equal(resetResult.ok && resetResult.customized, false);
assert.equal(getStoredSupportSignature().signature.agentName, "");
__resetSupportSignatureStoreForTests();

// Channel statuses stay accurate (Core intake is closed) and email stays off.
assert.equal(listSupportChannelActivations().filter((c) => c.status === "active").length, 0);
assert.equal(listSupportChannelActivations().filter((c) => c.status === "incoming_live").length, 1);
assert.equal(getSupportCenterGateState().emailSendConfigured, false);

// i18n: every core locale carries the full supportCenter key set; no jargon.
function flatKeys(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object") return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
    flatKeys(v, prefix ? `${prefix}.${k}` : k),
  );
}
const localeDicts: Record<string, Record<string, unknown>> = {};
for (const locale of ["en", "no", "sv", "da", "pl", "uk"]) {
  const json = JSON.parse(
    readLocale(`locales/${locale}/platform.json`, "utf8"),
  ) as { supportCenter: Record<string, unknown> };
  localeDicts[locale] = json.supportCenter;
}
const enKeys = new Set(flatKeys(localeDicts.en));
for (const [locale, dict] of Object.entries(localeDicts)) {
  const keys = new Set(flatKeys(dict));
  assert.deepEqual(
    [...enKeys].filter((k) => !keys.has(k)),
    [],
    `${locale} is missing supportCenter keys`,
  );
  assert.deepEqual(
    [...keys].filter((k) => !enKeys.has(k)),
    [],
    `${locale} has extra supportCenter keys`,
  );
  assert.equal("legacyKpiRemoved" in dict, false);
  const channelsJson = JSON.stringify(dict.channels);
  assert.doesNotMatch(channelsJson, /\bRPC\b|\bSQL\b|\bSoT\b|app_portal_support_requests/);
  const coreCopy = JSON.stringify([
    dict.coreBlockedBody,
    dict.emptyCoreBlocked,
    (dict.kpi as Record<string, unknown>).sourceNote,
  ]);
  assert.doesNotMatch(coreCopy, /\bRPC\b|\bSQL\b|\bSoT\b|\bCore\b/);
}
const enChannels = localeDicts.en.channels as Record<string, string>;
assert.equal(enChannels.active, "Active");
assert.equal(enChannels.notActivated, "Not activated");
assert.equal(enChannels.preparedOnly, "Not configured");
assert.match(enChannels.emailSendBlocked, /not configured/i);

// Send vs draft + status transitions + email gates stay fail-closed.
assert.equal(SUPPORT_SEND_PUBLIC_REPLY_APPLIED, false);
assert.equal(SUPPORT_EMAIL_DELIVERY_LIVE, false);
assert.equal(getSupportEmailNotifyGateState().deliveryLive, false);
assert.ok(SUPPORT_EMAIL_TEMPLATE_KEYS.includes("public-reply-to-customer"));
assert.ok(SUPPORT_EMAIL_TEMPLATE_KEYS.includes("public-reply-to-partner"));
assert.equal(canTransitionSupportStatus("open", "in_progress"), true);
assert.equal(canTransitionSupportStatus("closed", "open"), false);
assert.equal(canTransitionSupportStatus("archived", "open"), false);
assert.ok(SUPPORT_STATUS_TRANSITIONS.open.includes("waiting_for_aipify"));
assert.ok(SUPPORT_STATUS_TRANSITIONS.open.includes("in_review"));

assert.equal(existsSync(SUPPORT_SEND_PUBLIC_REPLY_SQL_PATH), true);
assert.equal(
  createHash("sha256")
    .update(readFileSync(SUPPORT_SEND_PUBLIC_REPLY_SQL_PATH))
    .digest("hex"),
  SUPPORT_SEND_PUBLIC_REPLY_SQL_SHA256,
);
assert.equal(existsSync(SUPPORT_APP_VISIBLE_MESSAGES_SQL_PATH), true);
assert.equal(
  createHash("sha256")
    .update(readFileSync(SUPPORT_APP_VISIBLE_MESSAGES_SQL_PATH))
    .digest("hex"),
  SUPPORT_APP_VISIBLE_MESSAGES_SQL_SHA256,
);
assert.equal(
  SUPPORT_ALL_CHANNELS_INTAKE_SQL_SHA256,
  "24bac8714ebc07e3311b47db0a6fe9716d0328c107e1a872cb79a0c796db0a46",
);

for (const locale of ["en", "no", "sv", "da", "pl", "uk"]) {
  const reply = localeDicts[locale].reply as Record<string, string>;
  assert.ok(reply.sendReply?.trim());
  assert.ok(reply.saveDraft?.trim());
  assert.ok(reply.sendReplySaved?.trim());
  assert.ok(reply.sendReplyCorePending?.trim());
  assert.doesNotMatch(reply.sendReplyCorePending, /\bCore\b/);
  assert.notEqual(reply.sendReply, reply.saveDraft);
  const delivery = (localeDicts[locale].detail as { deliveryLabels: Record<string, string> })
    .deliveryLabels;
  assert.ok(delivery.inbox_persisted?.trim());
  const errors = (localeDicts[locale].detail as { writeErrors: Record<string, string> })
    .writeErrors;
  assert.ok(errors.invalid_transition?.trim());
}

async function assertSendPublicReplyFailClosed() {
  const sendDenied = await sendPublicSupportReply({
    ticketId: "00000000-0000-4000-8000-000000000001",
    body: "Hei — dette er et testsvar.",
    agentUserId: "00000000-0000-4000-8000-000000000002",
    includeSignature: false,
    rpc: {
      rpc: async () => ({ data: null, error: null }),
    },
  });
  assert.equal(sendDenied.ok, false);
  if (!sendDenied.ok) {
    assert.equal(sendDenied.code, "core_not_applied");
  }
}

assertSendPublicReplyFailClosed()
  .then(() => {
    console.log("support-center.test.ts: ok");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
