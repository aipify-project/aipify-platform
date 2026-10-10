/**
 * Isolated Postgres RLS/grants matrix for public site index tables.
 * Requires Docker. Skips cleanly when Docker is unavailable.
 */
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url)))));
const container = `aipify-wpsi-rls-${Date.now()}`;
const migrationPath = path.join(
  root,
  "supabase/migrations/20261937600000_website_kompis_public_site_index_v1.sql",
);

function dockerAvailable(): boolean {
  const probe = spawnSync("docker", ["info"], { stdio: "ignore" });
  return probe.status === 0;
}

function sql(client: "postgres" | "anon" | "authenticated" | "service_role", query: string): string {
  const roleMap = {
    postgres: "postgres",
    anon: "anon",
    authenticated: "authenticated",
    service_role: "service_role",
  } as const;
  const role = roleMap[client];
  const wrapped =
    client === "postgres"
      ? query
      : `set local role ${role}; ${query}`;
  const out = execFileSync(
    "docker",
    [
      "exec",
      "-i",
      container,
      "psql",
      "-U",
      "postgres",
      "-d",
      "wpsi",
      "-v",
      "ON_ERROR_STOP=1",
      "-tA",
      "-c",
      wrapped,
    ],
    { encoding: "utf8" },
  ).trim();
  const lines = out.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines[lines.length - 1] ?? "";
}

function bootstrap(): void {
  spawnSync("docker", ["rm", "-f", container], { stdio: "ignore" });
  execFileSync(
    "docker",
    [
      "run",
      "-d",
      "--name",
      container,
      "-e",
      "POSTGRES_PASSWORD=postgres",
      "-e",
      "POSTGRES_DB=wpsi",
      "postgres:16-alpine",
    ],
    { stdio: "ignore" },
  );

  // Wait for ready
  let readyOk = false;
  for (let i = 0; i < 40; i += 1) {
    const ready = spawnSync(
      "docker",
      ["exec", container, "pg_isready", "-U", "postgres", "-d", "wpsi"],
      { stdio: "ignore" },
    );
    if (ready.status === 0) {
      readyOk = true;
      break;
    }
    spawnSync("sleep", ["1"], { stdio: "ignore" });
  }
  if (!readyOk) {
    throw new Error("Postgres container failed to become ready");
  }
  // Extra settle after first ready
  spawnSync("sleep", ["2"], { stdio: "ignore" });

  // Minimal stubs required by migration RPCs
  sql(
    "postgres",
    `
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    grant usage on schema public to anon, authenticated, service_role;
    create schema if not exists auth;
    create or replace function auth.role() returns text language sql stable as $$ select current_setting('request.jwt.claim.role', true) $$;
    create or replace function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create table public.installations (
      id uuid primary key,
      customer_id uuid,
      company_id uuid,
      site_url text,
      revoked_at timestamptz,
      status text
    );
    create table public.customers (id uuid primary key, company_id uuid);
    create table public.customer_domains (
      customer_id uuid,
      domain text,
      verification_status text,
      status text,
      installation_id uuid
    );
    create or replace function public.is_tenant_module_enabled(p_tenant_id uuid, p_module_key text)
    returns boolean language sql stable as $$ select true $$;
    create or replace function public.normalize_domain(p_domain text)
    returns text language sql immutable as $$ select lower(trim(p_domain)) $$;
    create or replace function public._wpkf_resolve_visitor_context(p_install_id uuid, p_domain text)
    returns table (tenant_id uuid, resolved_install_id uuid, resolved_domain text)
    language sql stable as $$
      select c.customer_id, p_install_id, public.normalize_domain(p_domain)
      from public.customer_domains c
      where c.domain = public.normalize_domain(p_domain)
        and c.verification_status = 'verified'
        and c.status = 'active'
      limit 1
    $$;
    `,
  );

  const migration = fs.readFileSync(migrationPath, "utf8");
  // Apply via stdin
  execFileSync(
    "docker",
    ["exec", "-i", container, "psql", "-U", "postgres", "-d", "wpsi", "-v", "ON_ERROR_STOP=1"],
    { input: migration, encoding: "utf8" },
  );

  sql(
    "postgres",
    `
    insert into public.customers values
      ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
      ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd');
    insert into public.installations values
      ('11111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'https://www.customer.example', null, 'active'),
      ('22222222-2222-4222-8222-222222222222', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'https://www.other.example', null, 'active');
    insert into public.customer_domains values
      ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'www.customer.example', 'verified', 'active', '11111111-1111-4111-8111-111111111111'),
      ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'www.other.example', 'verified', 'active', '22222222-2222-4222-8222-222222222222');
    `,
  );
}

function cleanup(): void {
  spawnSync("docker", ["rm", "-f", container], { stdio: "ignore" });
}

function main(): void {
  if (!dockerAvailable()) {
    console.log("website-kompis-public-site-index rls-matrix: SKIPPED (docker unavailable)");
    return;
  }

  try {
    bootstrap();

    // FORCE RLS present
    const forceDocs = sql(
      "postgres",
      `select relforcerowsecurity from pg_class where relname = 'tenant_public_site_index_documents'`,
    );
    assert.equal(forceDocs, "t");

    // Anon cannot select tables (REVOKE)
    let anonBlocked = false;
    try {
      sql("anon", `select count(*) from public.tenant_public_site_index_documents`);
    } catch {
      anonBlocked = true;
    }
    assert.equal(anonBlocked, true);

    // service_role can insert via RPC (same session as JWT role claim)
    const docId = sql(
      "postgres",
      `
      select set_config('request.jwt.claim.role', 'service_role', true);
      select public.replace_tenant_public_site_index_document(
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid,
        '11111111-1111-4111-8111-111111111111'::uuid,
        'www.customer.example',
        'https://www.customer.example/no/membership-guide',
        '/no/membership-guide',
        'no',
        'Medlemsguide',
        'Sammenlign nivåer',
        'Bronze Silver Gold',
        'Bronze, Silver, Gold og Elite Diamond har ulike fordeler for medlemmer på NETTSTED_NAVN.',
        'hashhashhashhash',
        array['Bronze, Silver, Gold og Elite Diamond har ulike fordeler for medlemmer på NETTSTED_NAVN.']
      );
      `,
    );
    assert.match(docId, /^[0-9a-f-]{36}$/i);

    // Wrong host rejected
    let wrongHost = false;
    try {
      sql(
        "postgres",
        `
        select set_config('request.jwt.claim.role', 'service_role', true);
        select public.replace_tenant_public_site_index_document(
          'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid,
          '11111111-1111-4111-8111-111111111111'::uuid,
          'evil.example',
          'https://evil.example/no/x',
          '/no/x',
          'no',
          'x',
          'x',
          'x',
          'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          'hashhashhashhash',
          array['xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        );
        `,
      );
    } catch {
      wrongHost = true;
    }
    assert.equal(wrongHost, true);

    // Cross-tenant search returns empty
    const cross = sql(
      "postgres",
      `
      select count(*) from public.search_tenant_public_site_index(
        '22222222-2222-4222-8222-222222222222'::uuid,
        'www.other.example',
        'no',
        'Bronze Silver Gold Elite Diamond',
        5
      );
      `,
    );
    assert.equal(cross, "0");

    // Correct tenant search returns rows
    const own = sql(
      "postgres",
      `
      select count(*) from public.search_tenant_public_site_index(
        '11111111-1111-4111-8111-111111111111'::uuid,
        'www.customer.example',
        'no',
        'Bronze Silver Gold Elite Diamond',
        5
      );
      `,
    );
    assert.ok(Number(own) >= 1);

    // Stale excluded
    sql(
      "postgres",
      `
      update public.tenant_public_site_index_documents
      set status = 'stale'
      where canonical_url = 'https://www.customer.example/no/membership-guide';
      `,
    );
    const stale = sql(
      "postgres",
      `
      select count(*) from public.search_tenant_public_site_index(
        '11111111-1111-4111-8111-111111111111'::uuid,
        'www.customer.example',
        'no',
        'Bronze Silver Gold Elite Diamond',
        5
      );
      `,
    );
    assert.equal(stale, "0");

    console.log("website-kompis-public-site-index rls-matrix: all tests passed");
  } finally {
    cleanup();
  }
}

main();
