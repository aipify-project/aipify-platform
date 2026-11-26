import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { classifyInboundEvent } from "./classify";
import { CSP_SALES_EMAIL_RETIRED_ENV, CSP_SALES_EMAIL_SQL_CANDIDATE_PATH } from "./contract";
import { payloadFromReceivedEmail, prepareInboundEvent } from "./prepare-inbound";
import { htmlToPlainText, messageTextFromReceived } from "./received-email";
import { buildSalesReferralUrl, publicEmailAvatarUrl, readProfileSignature, resolveSellerCompany } from "./signature";
import { verifyResendSvixSignature } from "./svix";
import { createReplyToken, hashReplyToken, inspectReplyToken, replyTokenFitsSmtp, replyTokenLocalPart } from "./token";
import { evaluateCspMarketingSendGate } from "../email-outbound/send-gate";

const SECRET = "token-secret-value";

test("reply token stays inside the SMTP local-part limit", () => {
  const token = createReplyToken(SECRET);
  assert.equal(token.length, 43);
  assert.equal(replyTokenLocalPart(token).length <= 64, true);
  assert.equal(replyTokenFitsSmtp(token), true);
  assert.equal(inspectReplyToken(SECRET, token).ok, true);
  assert.equal(inspectReplyToken(SECRET, `${token.slice(0, 42)}*`).ok, false);
  assert.equal(hashReplyToken(token) === hashReplyToken(`${token.slice(0, 42)}A`), false);
  assert.throws(() => createReplyToken("short"), /token_secret_too_short/);
});

test("Svix signature matches Resend's signed payload and rejects a raw-body HMAC", () => {
  const body = '{"id":"evt_1"}';
  const key = Buffer.from("c2VjcmV0LWtleS0xMjM0NTY=", "utf8").toString("base64");
  const secret = `whsec_${key}`;
  const id = "msg_1";
  const timestamp = "1700000000";
  const signature = createHmac("sha256", Buffer.from(key, "base64"))
    .update(`${id}.${timestamp}.${body}`)
    .digest("base64");
  assert.equal(
    verifyResendSvixSignature({
      secret,
      body,
      id,
      timestamp,
      signature: `v1,${signature}`,
      now: 1700000000 * 1000,
    }),
    true,
  );
  const wrong = createHmac("sha256", secret).update(body).digest("hex");
  assert.equal(
    verifyResendSvixSignature({
      secret,
      body,
      id,
      timestamp,
      signature: wrong,
      now: 1700000000 * 1000,
    }),
    false,
  );
});

test("autoreply and bounce are not human", () => {
  assert.equal(classifyInboundEvent({ eventType: "email.received", headers: { "Auto-Submitted": "auto-replied" } }), "auto_reply");
  assert.equal(classifyInboundEvent({ eventType: "email.bounced" }), "bounce");
  assert.equal(classifyInboundEvent({ eventType: "email.received", subject: "Out of office" }), "out_of_office");
  assert.equal(classifyInboundEvent({ eventType: "email.received", subject: "Hello" }), "human");
});

test("private avatar pointers and off-host images are dropped", () => {
  assert.equal(publicEmailAvatarUrl("/api/partners/profile/avatar?v=2"), "");
  assert.equal(publicEmailAvatarUrl("https://cdn.example/a.png"), "");
  assert.equal(publicEmailAvatarUrl("https://aipify.ai/a.png"), "https://aipify.ai/a.png");
});

test("referral url uses the seller code and fails closed on a bad code", () => {
  assert.equal(
    buildSalesReferralUrl({ code: "csp-0123456789ab", productKey: "kompis_web", locale: "no" }),
    "https://aipify.ai/p/csp-0123456789ab/kompis_web?channel=email&lang=no",
  );
  assert.equal(buildSalesReferralUrl({ code: "not-a-code", productKey: "kompis_web", locale: "no" }), "");
});

test("profile signature requires name, company, and contact", () => {
  assert.equal(readProfileSignature({ displayName: "Ada", company: "", contactEmail: "ada@example.com", avatarUrl: null }).ok, false);
  const ok = readProfileSignature({
    displayName: "Ada",
    company: "Ada AS",
    contactEmail: "Ada@Example.com",
    avatarUrl: "https://app.aipify.ai/a.png",
  });
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.contact, "ada@example.com");
});

test("retired marketing flag does not unlock a send", () => {
  const previous = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CSP_MARKETING_EMAIL_SEND_ENABLED: process.env.CSP_MARKETING_EMAIL_SEND_ENABLED,
    CSP_SALES_EMAIL_OUTBOUND: process.env.CSP_SALES_EMAIL_OUTBOUND,
  };
  process.env.RESEND_API_KEY = "re_test_key_123456";
  process.env.CSP_MARKETING_EMAIL_SEND_ENABLED = "1";
  delete process.env.CSP_SALES_EMAIL_OUTBOUND;
  try {
    assert.equal(
      evaluateCspMarketingSendGate({
        partnerActive: true,
        productCertified: true,
        templateOk: true,
        recipient: "buyer@example.com",
        consentVerified: true,
      }).reason,
      "marketing_send_locked",
    );
    assert.ok(CSP_SALES_EMAIL_RETIRED_ENV.includes("CSP_MARKETING_EMAIL_SEND_ENABLED"));
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("missing owner env stops before a provider call would be allowed", () => {
  const keys = [
    "RESEND_API_KEY",
    "CSP_SALES_EMAIL_OUTBOUND",
    "CSP_SALES_EMAIL_LAWFUL_BASIS",
    "CSP_SALES_EMAIL_ALLOWLIST",
    "CSP_SALES_EMAIL_REPLY_DOMAIN",
    "CSP_SALES_EMAIL_TOKEN_SECRET",
  ] as const;
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  process.env.RESEND_API_KEY = "re_test_key_123456";
  process.env.CSP_SALES_EMAIL_OUTBOUND = "owner_approved";
  process.env.CSP_SALES_EMAIL_LAWFUL_BASIS = "owner_recorded";
  delete process.env.CSP_SALES_EMAIL_ALLOWLIST;
  process.env.CSP_SALES_EMAIL_REPLY_DOMAIN = "reply.aipify.ai";
  process.env.CSP_SALES_EMAIL_TOKEN_SECRET = SECRET;
  try {
    assert.equal(
      evaluateCspMarketingSendGate({
        partnerActive: true,
        productCertified: true,
        templateOk: true,
        recipient: "buyer@example.com",
        consentVerified: true,
      }).reason,
      "recipient_not_allowlisted",
    );
  } finally {
    for (const key of keys) {
      const value = previous[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("prepared inbound uses the fetched message and ignores a spoofed webhook sender", () => {
  const token = createReplyToken(SECRET);
  const payload = payloadFromReceivedEmail({
    providerEventId: "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
    eventType: "email.received",
    email: {
      id: "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
      from: "Buyer <buyer@example.com>",
      to: [`reply+${token}@reply.aipify.ai`],
      cc: [],
      subject: "Interested",
      text: messageTextFromReceived({
        text: null,
        html: "<p>Please call me.</p><script>alert(1)</script>",
      }),
      headers: {},
      messageId: "<m@example.com>",
    },
  });
  const prepared = prepareInboundEvent({ tokenSecret: SECRET, payload });
  assert.equal(prepared.ok, true);
  if (prepared.ok) {
    assert.equal(prepared.event.event_class, "human");
    assert.equal(prepared.event.partner_id_claim, null);
    assert.equal(prepared.event.send_id, null);
    assert.equal(prepared.event.tenant_id, "aipify_internal");
    assert.equal(prepared.event.token_hash, hashReplyToken(token));
    assert.equal(prepared.event.sender_email, "buyer@example.com");
    assert.equal(prepared.event.body_text, "Please call me.");
    assert.equal(prepared.event.body_text.includes("alert"), false);
  }
  assert.equal(htmlToPlainText("<b>Hei</b>").includes("<b>"), false);
  assert.equal(resolveSellerCompany({ legalBusinessName: "Example AS", metadataCompany: "Other" }), "Example AS");
  assert.equal(resolveSellerCompany({ legalBusinessName: "  ", metadataCompany: "" }), "");
});

test("SQL candidate hash matches the file bytes and does not write commission", () => {
  const file = readFileSync(CSP_SALES_EMAIL_SQL_CANDIDATE_PATH);
  const digest = createHash("sha256").update(file).digest("hex");
  const recorded = readFileSync(`${CSP_SALES_EMAIL_SQL_CANDIDATE_PATH}.sha256`, "utf8").trim().split(/\s+/)[0];
  assert.equal(digest, recorded);
  const sql = file.toString("utf8").toLowerCase();
  assert.equal(sql.includes("insert into public.csp_commission_ledger"), false);
  assert.equal(sql.includes("insert into public.csp_qualified_sales"), false);
  assert.equal(sql.includes("ed24863a"), false);
});
