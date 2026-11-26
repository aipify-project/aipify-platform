import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
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
assert.equal(channels.find((c) => c.id === "web")?.status, "not_activated");
assert.equal(channels.find((c) => c.id === "app")?.status, "prepared_only");
assert.equal(channels.find((c) => c.id === "partner")?.status, "not_activated");
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

console.log("support-center.test.ts: ok");
