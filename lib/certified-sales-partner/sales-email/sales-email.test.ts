import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { CSP_SALES_COPY_REGISTRY } from "../sales-materials-catalog";
import { LOCALES } from "@/lib/i18n/config";
import { getSalesEmailTemplate, SALES_EMAIL_TEMPLATES } from "./catalog";
import { CSP_SALES_EMAIL_SQL_CANDIDATE_PATH, CSP_SALES_EMAIL_SQL_CANDIDATE_SHA256 } from "./contract";
import { evaluateSalesEmailSend, salesEffectOfEmailEvent } from "./gates";
import { applyInboundReply, createReplyToken, type InboundState, type StoredSend } from "./inbound";
import { decideInboundHttp } from "./inbound-http";
import { renderSalesEmail, SALES_EMAIL_DUMMY_CODE, SALES_EMAIL_DUMMY_SELLER, validateTemplateSource } from "./render";
import { resetSalesEmailSendState, salesEmailRateLimited, sendSalesEmail } from "./send";
import { sellerAdminShortLabel } from "@/lib/platform/seller-admin-short-labels";

const root = new URL("../../../", import.meta.url);

test("approved Norwegian copy is reused and English is not substituted", () => {
  const template = getSalesEmailTemplate("kompis_web.product_introduction.v1");
  assert.ok(template);
  const approved = CSP_SALES_COPY_REGISTRY.find((item) => item.id === "kompis-web-informative");
  assert.equal(template.locales.no.status, "published");
  assert.equal(template.locales.no.body, approved?.text.no);
  assert.notEqual(template.locales.no.body, template.locales.en.body);
  for (const locale of LOCALES) {
    assert.equal(template.locales[locale].status, "published");
    assert.equal(template.locales[locale].body, approved?.text[locale]);
  }
});

test("renderer keeps the seller link and drops unsafe avatars", () => {
  const template = SALES_EMAIL_TEMPLATES[0];
  const rendered = renderSalesEmail({
    locale: "no",
    productKey: "kompis_web",
    source: template.locales.no,
    seller: { ...SALES_EMAIL_DUMMY_SELLER, avatarUrl: "javascript:alert(1)" },
    referralCode: SALES_EMAIL_DUMMY_CODE,
  });
  assert.equal(rendered.ok, true);
  if (!rendered.ok) return;
  assert.match(rendered.referralUrl, /\/p\/csp-0123456789ab\/kompis_web/);
  assert.match(rendered.referralUrl, /channel=email/);
  assert.match(rendered.referralUrl, /lang=no/);
  assert.equal(rendered.avatarMode, "initials");
  assert.match(rendered.text, /Kompis Web hjelper besøkende/);
  assert.equal(rendered.html.includes("<script"), false);
  const safe = renderSalesEmail({
    locale: "en",
    productKey: "kompis_web",
    source: template.locales.en,
    seller: { ...SALES_EMAIL_DUMMY_SELLER, avatarUrl: "https://aipify.ai/website-kompis/design-v1/brand/aipify-logo-light.png" },
    referralCode: SALES_EMAIL_DUMMY_CODE,
  });
  assert.equal(safe.ok && safe.avatarMode, "image");
});

test("unknown placeholders and html are rejected", () => {
  assert.equal(validateTemplateSource({ subject: "Hi {{secret_field}}", body: "Body", cta: "Open" }).ok, false);
  assert.equal(validateTemplateSource({ subject: "Hi", body: "<script>alert(1)</script>", cta: "Open" }).ok, false);
  assert.equal(renderSalesEmail({
    locale: "en",
    productKey: "kompis_web",
    source: { subject: "Hi", preheader: "", body: "Hello", cta: "Open" },
    seller: SALES_EMAIL_DUMMY_SELLER,
    referralCode: "not-a-code",
  }).ok, false);
});

test("send stays closed until owner gates and persistence exist", () => {
  const closed = evaluateSalesEmailSend({
    tenantId: "aipify_internal",
    partnerStatus: "certified",
    productCertified: true,
    referralUrl: "https://aipify.ai/p/csp-0123456789ab/kompis_web?channel=email",
    sellerCompany: "Example Company",
    sellerContact: "alex@example.com",
    templatePublished: true,
    recipients: ["person@example.com"],
    suppressed: false,
    lawfulBasisRecorded: false,
    outboundOwnerApproved: false,
    recipientAllowlisted: false,
    transportConfigured: false,
    replyDomainConfigured: false,
    tokenSecretConfigured: false,
    persistenceReady: false,
    rateLimited: false,
    idempotencyKey: "idem-key-1",
  });
  assert.equal(closed.ok, false);
  if (!closed.ok) assert.equal(closed.code, "lawful_basis_not_verified");
  const open = evaluateSalesEmailSend({
    tenantId: "aipify_internal",
    partnerStatus: "certified",
    productCertified: true,
    referralUrl: "https://aipify.ai/p/csp-0123456789ab/kompis_web?channel=email",
    sellerCompany: "Example Company",
    sellerContact: "alex@example.com",
    templatePublished: true,
    recipients: ["person@example.com"],
    suppressed: false,
    lawfulBasisRecorded: true,
    outboundOwnerApproved: true,
    recipientAllowlisted: true,
    transportConfigured: true,
    replyDomainConfigured: true,
    tokenSecretConfigured: true,
    persistenceReady: true,
    rateLimited: false,
    idempotencyKey: "idem-key-1",
  });
  assert.equal(open.ok, true);
  assert.equal(evaluateSalesEmailSend({ ...openBase(), recipients: ["one@example.com", "two@example.com"] }).ok, false);
  assert.equal(evaluateSalesEmailSend({ ...openBase(), suppressed: true }).ok, false);
  assert.equal(evaluateSalesEmailSend({ ...openBase(), partnerStatus: "suspended" }).ok, false);
  assert.equal(evaluateSalesEmailSend({ ...openBase(), tenantId: "other_customer" }).ok, false);
  assert.deepEqual(salesEffectOfEmailEvent(), { createsSale: false, createsCommission: false });
});

function openBase() {
  return {
    tenantId: "aipify_internal",
    partnerStatus: "certified",
    productCertified: true,
    referralUrl: "https://aipify.ai/p/csp-0123456789ab/kompis_web?channel=email",
    sellerCompany: "Example Company",
    sellerContact: "alex@example.com",
    templatePublished: true,
    recipients: ["person@example.com"],
    suppressed: false,
    lawfulBasisRecorded: true,
    outboundOwnerApproved: true,
    recipientAllowlisted: true,
    transportConfigured: true,
    replyDomainConfigured: true,
    tokenSecretConfigured: true,
    persistenceReady: true,
    rateLimited: false,
    idempotencyKey: "idem-key-1",
  };
}

const sendRow: StoredSend = {
  id: "send-1",
  tenantId: "aipify_internal",
  partnerId: "partner-1",
  productKey: "kompis_web",
  recipientEmail: "person@example.com",
  partnerStatus: "certified",
};

function state(): InboundState {
  return { sends: [sendRow], leads: [], seenEventIds: [] };
}

test("reply correlation creates one lead and ignores spoofed seller ids", () => {
  const secret = "test-secret-value-32";
  const token = createReplyToken(
    {
      sendId: "send-1",
      partnerId: "partner-1",
      tenantId: "aipify_internal",
      productKey: "kompis_web",
      recipient: "person@example.com",
    },
    secret,
    1_700_000_000_000,
  );
  const payload = JSON.stringify({
    id: "evt-1",
    from: "Person <person@example.com>",
    to: `reply+${token}@reply.aipify.ai`,
    subject: "Re: Om Kompis Web",
    text: "Yes, please tell me more.",
    message_id: "msg-1",
  });
  const headers = {
    "x-aipify-sales-email-signature": "",
  };
  const { createHmac } = require("node:crypto") as typeof import("node:crypto");
  headers["x-aipify-sales-email-signature"] = createHmac("sha256", secret).update(payload).digest("hex");
  const first = decideInboundHttp({
    rawBody: payload,
    headers,
    hmacSecret: secret,
    svixSecret: null,
    tokenSecret: secret,
    state: state(),
    now: 1_700_000_000_000,
  });
  assert.equal(first.status, 200);
  assert.equal(first.body.outcome, "lead_created");
  assert.equal(first.body.partnerId, "partner-1");
  assert.equal(first.body.createsSale, false);
  const second = decideInboundHttp({
    rawBody: payload.replace("evt-1", "evt-2").replace("msg-1", "msg-2"),
    headers: {
      "x-aipify-sales-email-signature": createHmac("sha256", secret)
        .update(payload.replace("evt-1", "evt-2").replace("msg-1", "msg-2"))
        .digest("hex"),
    },
    hmacSecret: secret,
    svixSecret: null,
    tokenSecret: secret,
    state: first.state,
    now: 1_700_000_000_000,
  });
  assert.equal(second.body.outcome, "lead_updated");
  assert.equal(second.state.leads.length, 1);
  const duplicate = decideInboundHttp({
    rawBody: payload,
    headers,
    hmacSecret: secret,
    svixSecret: null,
    tokenSecret: secret,
    state: second.state,
    now: 1_700_000_000_000,
  });
  assert.equal(duplicate.body.outcome, "duplicate");
  const bad = decideInboundHttp({
    rawBody: payload,
    headers: { "x-aipify-sales-email-signature": "00".repeat(32) },
    hmacSecret: secret,
    svixSecret: null,
    tokenSecret: secret,
    state: state(),
  });
  assert.equal(bad.status, 401);
  assert.equal(bad.state.leads.length, 0);
});

test("transport noise, suspension, and the wrong tenant do not create leads", () => {
  const secret = "test-secret-value-32";
  const now = 1_700_000_000_000;
  const token = createReplyToken(
    { sendId: "send-1", partnerId: "partner-1", tenantId: "aipify_internal", productKey: "kompis_web", recipient: "person@example.com" },
    secret,
    now,
  );
  const auto = applyInboundReply(state(), {
    providerEventId: "auto-1",
    token: null,
    from: "person@example.com",
    inboundClass: "auto_reply",
    messageId: "auto-msg",
  });
  assert.equal(auto.decision.outcome, "transport_event");
  const suspended = applyInboundReply(
    { sends: [{ ...sendRow, partnerStatus: "suspended" }], leads: [], seenEventIds: [] },
    {
      providerEventId: "human-1",
      token: { v: 1, sendId: "send-1", partnerId: "partner-1", tenantId: "aipify_internal", productKey: "kompis_web", recipient: "person@example.com", exp: now + 1000 },
      from: "person@example.com",
      inboundClass: "human",
      messageId: "m1",
    },
  );
  assert.equal(suspended.decision.outcome, "quarantine");
  const foreign = applyInboundReply(state(), {
    providerEventId: "human-2",
    token: { v: 1, sendId: "send-1", partnerId: "partner-1", tenantId: "other_customer", productKey: "kompis_web", recipient: "person@example.com", exp: now + 1000 },
    from: "person@example.com",
    inboundClass: "human",
    messageId: "m2",
  });
  assert.equal(foreign.decision.outcome, "quarantine");
  if (foreign.decision.outcome === "quarantine") assert.equal(foreign.decision.reason, "tenant_mismatch");
  const spoofed = applyInboundReply(state(), {
    providerEventId: "human-3",
    token: { v: 1, sendId: "send-1", partnerId: "partner-1", tenantId: "aipify_internal", productKey: "kompis_web", recipient: "person@example.com", exp: now + 1000 },
    from: "person@example.com",
    inboundClass: "human",
    messageId: "m4",
    claimedPartnerId: "someone-else",
  });
  assert.equal(spoofed.decision.outcome, "quarantine");
  if (spoofed.decision.outcome === "quarantine") assert.equal(spoofed.decision.reason, "spoofed_partner");
  assert.equal(spoofed.state.leads.length, 0);
  const expired = decideInboundHttp({
    rawBody: JSON.stringify({ id: "exp-1", from: "person@example.com", to: `reply+${token}@reply.aipify.ai`, subject: "Hi", text: "Hello", message_id: "m3" }),
    headers: {
      "x-aipify-sales-email-signature": require("node:crypto")
        .createHmac("sha256", secret)
        .update(JSON.stringify({ id: "exp-1", from: "person@example.com", to: `reply+${token}@reply.aipify.ai`, subject: "Hi", text: "Hello", message_id: "m3" }))
        .digest("hex"),
    },
    hmacSecret: secret,
    svixSecret: null,
    tokenSecret: secret,
    state: state(),
    now: now + 1000 * 60 * 60 * 24 * 400,
  });
  assert.equal(expired.body.outcome, "quarantine");
  assert.equal(expired.body.reason, "expired_token");
  assert.equal(decideInboundHttp({ rawBody: "{}", headers: {}, hmacSecret: null, svixSecret: null, tokenSecret: null, state: state() }).body.realInboundE2e, "REAL_INBOUND_E2E_BLOCKED");
});

test("provider acceptance is not delivery and retries do not double-send", async () => {
  resetSalesEmailSendState();
  let calls = 0;
  const fetchImpl: typeof fetch = async () => {
    calls += 1;
    return new Response(JSON.stringify({ id: "provider-1" }), { status: 200 });
  };
  const first = await sendSalesEmail({
    apiKey: "re_test_key",
    to: "person@example.com",
    subject: "Subject",
    html: "<p>Hidden</p>",
    text: "Hidden",
    replyTo: "reply@example.com",
    idempotencyKey: "same-key-123",
    partnerId: "partner-1",
    fetchImpl,
  });
  const second = await sendSalesEmail({
    apiKey: "re_test_key",
    to: "person@example.com",
    subject: "Subject",
    html: "<p>Hidden</p>",
    text: "Hidden",
    replyTo: "reply@example.com",
    idempotencyKey: "same-key-123",
    partnerId: "partner-1",
    fetchImpl,
  });
  assert.equal(first.status, "accepted_by_provider");
  assert.equal(second.status, "accepted_by_provider");
  if (second.status === "accepted_by_provider") assert.equal(second.duplicate, true);
  assert.equal(calls, 1);
  assert.equal(salesEmailRateLimited("partner-1"), false);
  resetSalesEmailSendState();
});

test("platform menu short labels are natural equivalents", () => {
  assert.equal(sellerAdminShortLabel("partners", "no"), "Partnere");
  assert.equal(sellerAdminShortLabel("links", "no"), "Salgslenker");
  assert.equal(sellerAdminShortLabel("materials", "no"), "Salgsmateriell");
  assert.equal(sellerAdminShortLabel("communication", "no"), "Kommunikasjon");
  assert.equal(sellerAdminShortLabel("security", "no"), "Sikkerhet");
  assert.equal(sellerAdminShortLabel("pilot", "no"), "Pilotkontroll");
  assert.equal(sellerAdminShortLabel("partners", "en"), "Partners");
});

test("prepared SQL hash matches the candidate file", () => {
  const file = readFileSync(new URL(CSP_SALES_EMAIL_SQL_CANDIDATE_PATH, root));
  const hash = createHash("sha256").update(file).digest("hex");
  assert.equal(hash, CSP_SALES_EMAIL_SQL_CANDIDATE_SHA256);
});
