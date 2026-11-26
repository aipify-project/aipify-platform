import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { classifyInboundEvent } from "./classify";
import { CSP_SALES_EMAIL_RETIRED_ENV, CSP_SALES_EMAIL_SQL_CANDIDATE_PATH } from "./contract";
import { prepareInboundEvent } from "./prepare-inbound";
import { buildSalesReferralUrl, publicEmailAvatarUrl, readProfileSignature } from "./signature";
import { verifyResendSvixSignature } from "./svix";
import { createReplyToken, hashReplyToken, inspectReplyToken } from "./token";
import { evaluateCspMarketingSendGate } from "../email-outbound/send-gate";

const SECRET = "token-secret-value";

test("reply token rejects tampering and expiry", () => {
  const token = createReplyToken(
    {
      sendId: "11111111-1111-4111-8111-111111111111",
      partnerId: "22222222-2222-4222-8222-222222222222",
      tenantId: "aipify_internal",
      productKey: "kompis_web",
      recipient: "buyer@example.com",
    },
    SECRET,
    1_000,
  );
  assert.equal(inspectReplyToken(SECRET, token, 1_000).ok, true);
  assert.equal(inspectReplyToken(SECRET, `${token}x`, 1_000).ok, false);
  const expired = inspectReplyToken(SECRET, token, 1_000 + 1000 * 60 * 60 * 24 * 121);
  assert.equal(expired.ok, false);
  if (!expired.ok) assert.equal(expired.error, "expired");
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

test("prepared inbound keeps the signed partner and hashes the token", () => {
  const token = createReplyToken(
    {
      sendId: "11111111-1111-4111-8111-111111111111",
      partnerId: "22222222-2222-4222-8222-222222222222",
      tenantId: "aipify_internal",
      productKey: "kompis_web",
      recipient: "buyer@example.com",
    },
    SECRET,
    1_700_000_000_000,
  );
  const prepared = prepareInboundEvent({
    tokenSecret: SECRET,
    now: 1_700_000_000_000,
    payload: {
      type: "email.received",
      data: {
        email_id: "evt_9",
        from: "Buyer <buyer@example.com>",
        to: [`reply+${token}@reply.aipify.ai`],
        subject: "Interested",
        text: "Please call me.",
      },
    },
  });
  assert.equal(prepared.ok, true);
  if (prepared.ok) {
    assert.equal(prepared.event.event_class, "human");
    assert.equal(prepared.event.partner_id_claim, "22222222-2222-4222-8222-222222222222");
    assert.equal(prepared.event.token_hash, hashReplyToken(token));
    assert.equal(prepared.event.sender_email, "buyer@example.com");
  }
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
