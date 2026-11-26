/**
 * Runs the canonical SQL file against an ephemeral PGlite database.
 * This is not Staging or Production. Nothing here calls Resend.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const sqlPath = path.join(root, "docs/platform/sql-candidates/csp_sales_email_crm_v1.sql");
const runnerDir = path.join(root, "tools/csp-sales-email-sql-runner");

const SELLER = "11111111-1111-4111-8111-111111111111";
const SELLER_AUTH = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const OTHER = "22222222-2222-4222-8222-222222222222";
const OTHER_AUTH = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const PRODUCT = "33333333-3333-4333-8333-333333333333";
const SEND = "44444444-4444-4444-8444-444444444444";
const TOKEN_HASH = "ab".repeat(32);
const REFERRAL = "https://aipify.ai/p/csp-0123456789ab/kompis_web?channel=email&lang=en";

type Db = {
  exec: (sql: string) => Promise<unknown>;
  query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
};

function rowJson(result: { rows: Array<Record<string, unknown>> }): Record<string, unknown> {
  const value = result.rows[0]?.result;
  if (typeof value === "string") return JSON.parse(value) as Record<string, unknown>;
  return (value ?? {}) as Record<string, unknown>;
}

async function asService(db: Db, sql: string, params: unknown[] = []) {
  await db.exec("set role service_role");
  try {
    return await db.query(sql, params);
  } finally {
    await db.exec("reset role");
  }
}

async function asSeller(db: Db, authUserId: string, sql: string, params: unknown[] = []) {
  await db.exec(`select set_config('request.jwt.claim.sub', '${authUserId}', false)`);
  await db.exec("set role authenticated");
  try {
    return await db.query(sql, params);
  } finally {
    await db.exec("reset role");
  }
}

test("canonical SQL enforces isolation, one lead, and no commission", async () => {
  const require = createRequire(path.join(runnerDir, "package.json"));
  const { PGlite } = require("@electric-sql/pglite") as { PGlite: new () => Db };
  const db = new PGlite();
  const file = readFileSync(sqlPath);
  const digest = createHash("sha256").update(file).digest("hex");
  assert.equal(digest, readFileSync(`${sqlPath}.sha256`, "utf8").trim().split(/\s+/)[0]);

  await db.exec(`
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    create or replace function public.is_platform_admin() returns boolean language sql stable as $$
      select current_setting('request.jwt.claim.role', true) = 'platform_admin'
    $$;
    create table public.csp_partner_profiles (
      id uuid primary key,
      auth_user_id uuid not null unique,
      display_name text not null,
      country text not null,
      status text not null
    );
    create table public.csp_sales_products (
      id uuid primary key,
      product_key text not null unique,
      fixed_commission_amount numeric not null,
      currency text not null,
      published boolean not null
    );
    create table public.csp_product_certifications (
      id uuid primary key,
      partner_id uuid not null,
      product_id uuid not null,
      status text not null
    );
    create table public.csp_commission_ledger (
      id uuid primary key default gen_random_uuid(),
      partner_id uuid not null,
      amount numeric not null,
      currency text not null,
      entry_type text not null
    );
    create table public.csp_qualified_sales (
      id uuid primary key default gen_random_uuid(),
      partner_id uuid not null,
      status text not null
    );
    insert into public.csp_partner_profiles values
      ('${SELLER}', '${SELLER_AUTH}', 'Ada Seller', 'NO', 'active'),
      ('${OTHER}', '${OTHER_AUTH}', 'Bea Seller', 'NO', 'active');
    insert into public.csp_sales_products values
      ('${PRODUCT}', 'kompis_web', 0, 'NOK', true);
    insert into public.csp_product_certifications values
      ('55555555-5555-4555-8555-555555555555', '${SELLER}', '${PRODUCT}', 'passed');
    insert into public.csp_commission_ledger (partner_id, amount, currency, entry_type)
      values ('${SELLER}', 10, 'NOK', 'earned');
    insert into public.csp_qualified_sales (partner_id, status)
      values ('${SELLER}', 'earned');
  `);
  await db.exec(file.toString("utf8"));

  const input = {
    send_id: SEND,
    product_key: "kompis_web",
    template_id: "product_introduction",
    template_version: 1,
    locale: "en",
    recipient: "buyer@example.com",
    idempotency_key: "idem-key-01",
    referral_url: REFERRAL,
    token_hash: TOKEN_HASH,
    token_expires_at: "2099-01-01T00:00:00.000Z",
    partner_id: OTHER,
  };
  const recorded = rowJson(
    await asSeller(db, SELLER_AUTH, "select public.csp_sales_email_record_send($1::jsonb) as result", [JSON.stringify(input)]),
  );
  assert.equal(recorded.ok, true);
  assert.equal(recorded.duplicate, false);
  const owner = await db.query("select partner_id::text from public.csp_sales_email_sends");
  assert.equal(owner.rows[0]?.partner_id, SELLER);
  await db.exec("set role authenticated");
  await assert.rejects(
    db.query("select public.csp_sales_email_ingest_reply('{}'::jsonb)"),
    /permission denied|42501/i,
  );
  await db.exec("reset role");

  const human = {
    provider_event_id: "evt-human-1",
    event_class: "human",
    send_id: SEND,
    token_hash: TOKEN_HASH,
    token_expires_at: "2099-01-01T00:00:00.000Z",
    sender_email: "buyer@example.com",
    body_text: "I want a demo.",
    partner_id_claim: SELLER,
    tenant_id: "aipify_internal",
  };
  const created = rowJson(
    await asService(db, "select public.csp_sales_email_ingest_reply($1::jsonb) as result", [JSON.stringify(human)]),
  );
  assert.equal(created.outcome, "lead_created");
  assert.equal(created.creates_commission, false);
  const leadId = String(created.lead_id);

  const spoof = rowJson(
    await asService(db, "select public.csp_sales_email_ingest_reply($1::jsonb) as result", [
      JSON.stringify({ ...human, provider_event_id: "evt-spoof", partner_id_claim: OTHER, body_text: "nope" }),
    ]),
  );
  assert.equal(spoof.outcome, "quarantine");
  assert.equal(spoof.reason, "spoofed_partner");

  const wrongTenant = rowJson(
    await asService(db, "select public.csp_sales_email_ingest_reply($1::jsonb) as result", [
      JSON.stringify({ ...human, provider_event_id: "evt-tenant", tenant_id: "other_tenant", body_text: "nope" }),
    ]),
  );
  assert.equal(wrongTenant.reason, "wrong_tenant");

  const expired = rowJson(
    await asService(db, "select public.csp_sales_email_ingest_reply($1::jsonb) as result", [
      JSON.stringify({ ...human, provider_event_id: "evt-expired", token_expires_at: "2000-01-01T00:00:00.000Z", body_text: "old" }),
    ]),
  );
  assert.equal(expired.reason, "expired_token");

  const badHash = rowJson(
    await asService(db, "select public.csp_sales_email_ingest_reply($1::jsonb) as result", [
      JSON.stringify({ ...human, provider_event_id: "evt-bad-hash", token_hash: "cd".repeat(32), body_text: "bad" }),
    ]),
  );
  assert.equal(badHash.reason, "invalid_token");

  const auto = rowJson(
    await asService(db, "select public.csp_sales_email_ingest_reply($1::jsonb) as result", [
      JSON.stringify({ ...human, provider_event_id: "evt-auto", event_class: "auto_reply" }),
    ]),
  );
  assert.equal(auto.outcome, "transport_event");

  const bounce = rowJson(
    await asService(db, "select public.csp_sales_email_ingest_reply($1::jsonb) as result", [
      JSON.stringify({ ...human, provider_event_id: "evt-bounce", event_class: "bounce" }),
    ]),
  );
  assert.equal(bounce.outcome, "transport_event");

  const duplicate = rowJson(
    await asService(db, "select public.csp_sales_email_ingest_reply($1::jsonb) as result", [JSON.stringify(human)]),
  );
  assert.equal(duplicate.outcome, "duplicate");

  const again = rowJson(
    await asService(db, "select public.csp_sales_email_ingest_reply($1::jsonb) as result", [
      JSON.stringify({ ...human, provider_event_id: "evt-human-2", body_text: "Still interested." }),
    ]),
  );
  assert.equal(again.outcome, "lead_updated");
  assert.equal(again.lead_id, leadId);

  const counts = await db.query(`
    select
      (select count(*) from public.csp_sales_email_leads) as leads,
      (select count(*) from public.csp_sales_email_messages) as messages,
      (select count(*) from public.csp_sales_email_notifications where read_at is null) as unread,
      (select count(*) from public.csp_commission_ledger) as ledger,
      (select count(*) from public.csp_qualified_sales) as sales,
      (select count(*) from public.csp_sales_email_suppressions) as suppressed
  `);
  assert.equal(Number(counts.rows[0]?.leads), 1);
  assert.equal(Number(counts.rows[0]?.messages), 2);
  assert.equal(Number(counts.rows[0]?.unread), 1);
  assert.equal(Number(counts.rows[0]?.ledger), 1);
  assert.equal(Number(counts.rows[0]?.sales), 1);
  assert.equal(Number(counts.rows[0]?.suppressed), 1);

  const unread = rowJson(await asSeller(db, SELLER_AUTH, "select public.csp_sales_email_list_unread() as result"));
  const notes = unread.unread as Array<{ id: string }>;
  assert.equal(notes.length, 1);
  const denied = rowJson(
    await asSeller(db, OTHER_AUTH, "select public.csp_sales_email_mark_notification_read($1::uuid) as result", [notes[0].id]),
  );
  assert.equal(denied.code, "forbidden");
  const stillUnread = await db.query("select count(*) as n from public.csp_sales_email_notifications where read_at is null");
  assert.equal(Number(stillUnread.rows[0]?.n), 1);
  const read = rowJson(
    await asSeller(db, SELLER_AUTH, "select public.csp_sales_email_mark_notification_read($1::uuid) as result", [notes[0].id]),
  );
  assert.equal(read.ok, true);
  const afterRead = await db.query("select count(*) as n from public.csp_sales_email_notifications where read_at is null");
  assert.equal(Number(afterRead.rows[0]?.n), 0);

  const hidden = rowJson(
    await asSeller(db, OTHER_AUTH, "select public.csp_sales_email_list_thread($1::uuid) as result", [leadId]),
  );
  assert.equal(hidden.code, "forbidden");
  const thread = rowJson(
    await asSeller(db, SELLER_AUTH, "select public.csp_sales_email_list_thread($1::uuid) as result", [leadId]),
  );
  assert.equal(thread.ok, true);
  assert.equal((thread.messages as unknown[]).length, 2);

  await db.exec("set role authenticated");
  await assert.rejects(db.query("select * from public.csp_sales_email_leads"));
  await db.exec("reset role");

  const adminDenied = rowJson(await asSeller(db, SELLER_AUTH, "select public.csp_sales_email_admin_list() as result"));
  assert.equal(adminDenied.code, "forbidden");
  await db.exec(`select set_config('request.jwt.claim.sub', '${SELLER_AUTH}', false)`);
  await db.exec(`select set_config('request.jwt.claim.role', 'platform_admin', false)`);
  const admin = rowJson(await db.query("select public.csp_sales_email_admin_list() as result"));
  assert.equal(admin.ok, true);
  assert.ok(Array.isArray(admin.events) && admin.events.length > 0);
});
