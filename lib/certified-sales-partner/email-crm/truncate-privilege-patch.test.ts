/**
 * Local proof for the service_role table-privilege patch.
 * Uses ephemeral PGlite only. It does not connect to Staging or Production.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const originalPath = path.join(root, "docs/platform/sql-candidates/csp_sales_email_crm_v1.sql");
const patchPath = path.join(
  root,
  "docs/platform/sql-candidates/csp_sales_email_crm_v1_revoke_service_table_privileges_v1.sql",
);
const runnerDir = path.join(root, "tools/csp-sales-email-sql-runner");

const SELLER = "11111111-1111-4111-8111-111111111111";
const SELLER_AUTH = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const OTHER = "22222222-2222-4222-8222-222222222222";
const OTHER_AUTH = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const PRODUCT = "33333333-3333-4333-8333-333333333333";
const SEND = "44444444-4444-4444-8444-444444444444";
const TOKEN_HASH = "ab".repeat(32);
const REFERRAL = "https://aipify.ai/p/csp-0123456789ab/kompis_web?channel=email&lang=en";
const TABLES = [
  "csp_sales_email_sends",
  "csp_sales_email_provider_events",
  "csp_sales_email_leads",
  "csp_sales_email_messages",
  "csp_sales_email_notifications",
  "csp_sales_email_suppressions",
  "csp_sales_email_audit",
];

type Db = {
  exec: (sql: string) => Promise<unknown>;
  query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
};

function rowJson(result: { rows: Array<Record<string, unknown>> }): Record<string, unknown> {
  const value = result.rows[0]?.result;
  if (typeof value === "string") return JSON.parse(value) as Record<string, unknown>;
  return (value ?? {}) as Record<string, unknown>;
}

async function canTruncate(db: Db, table: string): Promise<boolean> {
  const result = await db.query(
    "select has_table_privilege('service_role', $1::regclass, 'TRUNCATE') as allowed",
    [`public.${table}`],
  );
  return result.rows[0]?.allowed === true;
}

test("service_role can truncate before the patch and cannot after it", async () => {
  const require = createRequire(path.join(runnerDir, "package.json"));
  const { PGlite } = require("@electric-sql/pglite") as { PGlite: new () => Db };
  const db = new PGlite();
  const original = readFileSync(originalPath);
  const patch = readFileSync(patchPath);
  assert.equal(
    createHash("sha256").update(original).digest("hex"),
    "a72df92796ac16140ca99b3cb16f18cf7d44c08b9973bc5c9753fcc5995924e5",
  );
  assert.equal(
    createHash("sha256").update(patch).digest("hex"),
    readFileSync(`${patchPath}.sha256`, "utf8").trim().split(/\s+/)[0],
  );

  await db.exec(`
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    create or replace function public.is_platform_admin() returns boolean language sql stable as $$
      select current_setting('request.jwt.claim.role', true) = 'platform_admin'
    $$;
    create role service_role nologin;
    create role authenticated nologin;
    alter default privileges in schema public grant truncate, references, trigger on tables to service_role;
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
    insert into public.csp_sales_products values ('${PRODUCT}', 'kompis_web', 0, 'NOK', true);
    insert into public.csp_product_certifications values
      ('55555555-5555-4555-8555-555555555555', '${SELLER}', '${PRODUCT}', 'passed'),
      ('66666666-6666-4666-8666-666666666666', '${OTHER}', '${PRODUCT}', 'passed');
    insert into public.csp_commission_ledger (partner_id, amount, currency, entry_type)
      values ('${SELLER}', 10, 'NOK', 'earned');
    insert into public.csp_qualified_sales (partner_id, status)
      values ('${SELLER}', 'earned');
  `);
  await db.exec(original.toString("utf8"));

  for (const table of TABLES) {
    assert.equal(await canTruncate(db, table), true, table);
  }
  await db.exec("begin");
  await db.exec("set role service_role");
  await db.exec("truncate table public.csp_sales_email_messages");
  await db.exec("reset role");
  await db.exec("rollback");

  await db.exec(patch.toString("utf8"));
  for (const table of TABLES) {
    assert.equal(await canTruncate(db, table), false, table);
  }
  await db.exec("set role service_role");
  await assert.rejects(db.exec("truncate table public.csp_sales_email_messages"), /permission denied|42501/i);
  await db.exec("reset role");

  const status = rowJson(await db.query("select public.csp_sales_email_backend_status() as result"));
  assert.equal(status.creates_sale, false);
  assert.equal(status.creates_commission, false);

  await db.exec(`select set_config('request.jwt.claim.sub', '${SELLER_AUTH}', false)`);
  await db.exec("set role authenticated");
  const recorded = rowJson(
    await db.query("select public.csp_sales_email_record_send($1::jsonb) as result", [
      JSON.stringify({
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
      }),
    ]),
  );
  assert.equal(recorded.ok, true);
  const marked = rowJson(
    await db.query("select public.csp_sales_email_mark_send_result($1::jsonb) as result", [
      JSON.stringify({ send_id: SEND, delivery_status: "accepted_by_provider", provider_message_id: "prov-1" }),
    ]),
  );
  assert.equal(marked.ok, true);
  assert.equal(marked.creates_commission, false);
  await db.exec("reset role");

  await db.exec("set role service_role");
  const created = rowJson(
    await db.query("select public.csp_sales_email_ingest_reply($1::jsonb) as result", [
      JSON.stringify({
        provider_event_id: "evt-human-1",
        event_class: "human",
        send_id: SEND,
        token_hash: TOKEN_HASH,
        token_expires_at: "2099-01-01T00:00:00.000Z",
        sender_email: "buyer@example.com",
        body_text: "I want a demo.",
        partner_id_claim: SELLER,
        tenant_id: "aipify_internal",
      }),
    ]),
  );
  assert.equal(created.outcome, "lead_created");
  assert.equal(created.creates_commission, false);
  const duplicate = rowJson(
    await db.query("select public.csp_sales_email_ingest_reply($1::jsonb) as result", [
      JSON.stringify({
        provider_event_id: "evt-human-1",
        event_class: "human",
        send_id: SEND,
        token_hash: TOKEN_HASH,
        token_expires_at: "2099-01-01T00:00:00.000Z",
        sender_email: "buyer@example.com",
        body_text: "again",
        partner_id_claim: SELLER,
        tenant_id: "aipify_internal",
      }),
    ]),
  );
  assert.equal(duplicate.outcome, "duplicate");
  const wrongTenant = rowJson(
    await db.query("select public.csp_sales_email_ingest_reply($1::jsonb) as result", [
      JSON.stringify({
        provider_event_id: "evt-tenant",
        event_class: "human",
        send_id: SEND,
        token_hash: TOKEN_HASH,
        token_expires_at: "2099-01-01T00:00:00.000Z",
        sender_email: "buyer@example.com",
        body_text: "nope",
        partner_id_claim: SELLER,
        tenant_id: "other_tenant",
      }),
    ]),
  );
  assert.equal(wrongTenant.reason, "wrong_tenant");
  const badToken = rowJson(
    await db.query("select public.csp_sales_email_ingest_reply($1::jsonb) as result", [
      JSON.stringify({
        provider_event_id: "evt-token",
        event_class: "human",
        send_id: SEND,
        token_hash: "cd".repeat(32),
        token_expires_at: "2099-01-01T00:00:00.000Z",
        sender_email: "buyer@example.com",
        body_text: "nope",
        partner_id_claim: SELLER,
        tenant_id: "aipify_internal",
      }),
    ]),
  );
  assert.equal(badToken.reason, "invalid_token");
  const auto = rowJson(
    await db.query("select public.csp_sales_email_ingest_reply($1::jsonb) as result", [
      JSON.stringify({
        provider_event_id: "evt-auto",
        event_class: "auto_reply",
        send_id: SEND,
        tenant_id: "aipify_internal",
      }),
    ]),
  );
  assert.equal(auto.outcome, "transport_event");
  await db.exec("reset role");

  await db.exec(`select set_config('request.jwt.claim.sub', '${SELLER_AUTH}', false)`);
  await db.exec("set role authenticated");
  const leads = rowJson(await db.query("select public.csp_sales_email_list_leads() as result"));
  assert.equal(leads.ok, true);
  assert.equal((leads.leads as unknown[]).length, 1);
  const unread = rowJson(await db.query("select public.csp_sales_email_list_unread() as result"));
  const noteId = (unread.unread as Array<{ id: string }>)[0]?.id;
  const thread = rowJson(
    await db.query("select public.csp_sales_email_list_thread($1::uuid) as result", [created.lead_id]),
  );
  assert.equal(thread.ok, true);
  await db.exec("reset role");

  await db.exec(`select set_config('request.jwt.claim.sub', '${OTHER_AUTH}', false)`);
  await db.exec("set role authenticated");
  const hidden = rowJson(
    await db.query("select public.csp_sales_email_list_thread($1::uuid) as result", [created.lead_id]),
  );
  assert.equal(hidden.code, "forbidden");
  const otherLeads = rowJson(await db.query("select public.csp_sales_email_list_leads() as result"));
  assert.equal((otherLeads.leads as unknown[]).length, 0);
  const deniedRead = rowJson(
    await db.query("select public.csp_sales_email_mark_notification_read($1::uuid) as result", [noteId]),
  );
  assert.equal(deniedRead.code, "forbidden");
  const adminDenied = rowJson(await db.query("select public.csp_sales_email_admin_list() as result"));
  assert.equal(adminDenied.code, "forbidden");
  await db.exec("reset role");

  await db.exec(`select set_config('request.jwt.claim.sub', '${SELLER_AUTH}', false)`);
  await db.exec("set role authenticated");
  const read = rowJson(
    await db.query("select public.csp_sales_email_mark_notification_read($1::uuid) as result", [noteId]),
  );
  assert.equal(read.ok, true);
  await db.exec("reset role");

  const counts = await db.query(`
    select
      (select count(*) from public.csp_sales_email_messages) as messages,
      (select count(*) from public.csp_commission_ledger) as ledger,
      (select count(*) from public.csp_qualified_sales) as sales
  `);
  assert.equal(Number(counts.rows[0]?.messages), 1);
  assert.equal(Number(counts.rows[0]?.ledger), 1);
  assert.equal(Number(counts.rows[0]?.sales), 1);
});
