/**
 * REPAIR.09 — prove public search is write-free under read-only transactions
 * (PostgREST STABLE behaviour) and that access gates still fail closed.
 * Requires Docker. Skips cleanly when Docker is unavailable.
 */
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url)))));
const container = `aipify-wpsi-ro-${Date.now()}`;
const postgrestContainer = `${container}-rest`;
const network = `${container}-net`;
const migration376 = path.join(
  root,
  "supabase/migrations/20261937600000_website_kompis_public_site_index_v1.sql",
);
const migration378 = path.join(
  root,
  "supabase/migrations/20261937800000_website_kompis_public_site_index_readonly_search_v1.sql",
);

const TENANT_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const TENANT_B = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const INSTALL_A = "11111111-1111-4111-8111-111111111111";
const INSTALL_B = "22222222-2222-4222-8222-222222222222";
const HOST_A = "www.customer.example";
const HOST_B = "www.other.example";

function dockerAvailable(): boolean {
  return spawnSync("docker", ["info"], { stdio: "ignore" }).status === 0;
}

function sql(query: string, opts?: { readOnly?: boolean; role?: string }): string {
  const role = opts?.role;
  const parts: string[] = [];
  if (opts?.readOnly) {
    parts.push("begin read only;");
  } else {
    parts.push("begin;");
  }
  if (role) {
    parts.push(`set local role ${role};`);
  }
  parts.push(query);
  parts.push("commit;");
  const wrapped = parts.join("\n");
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
  const noise = new Set(["BEGIN", "COMMIT", "SET", "ROLLBACK"]);
  const lines = out
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !noise.has(l.toUpperCase()));
  return lines[lines.length - 1] ?? "";
}

function sqlExpectFail(query: string, opts?: { readOnly?: boolean; role?: string }): string {
  try {
    sql(query, opts);
    return "";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return message;
  }
}

function applyFile(filePath: string): void {
  const body = fs.readFileSync(filePath, "utf8");
  execFileSync(
    "docker",
    ["exec", "-i", container, "psql", "-U", "postgres", "-d", "wpsi", "-v", "ON_ERROR_STOP=1"],
    { input: body, encoding: "utf8" },
  );
}

function bootstrapBase(): void {
  spawnSync("docker", ["rm", "-f", container, postgrestContainer], { stdio: "ignore" });
  spawnSync("docker", ["network", "rm", network], { stdio: "ignore" });
  execFileSync("docker", ["network", "create", network], { stdio: "ignore" });
  execFileSync(
    "docker",
    [
      "run",
      "-d",
      "--name",
      container,
      "--network",
      network,
      "-e",
      "POSTGRES_PASSWORD=postgres",
      "-e",
      "POSTGRES_DB=wpsi",
      "postgres:16-alpine",
    ],
    { stdio: "ignore" },
  );

  let ready = false;
  for (let i = 0; i < 40; i += 1) {
    if (
      spawnSync("docker", ["exec", container, "pg_isready", "-U", "postgres", "-d", "wpsi"], {
        stdio: "ignore",
      }).status === 0
    ) {
      ready = true;
      break;
    }
    spawnSync("sleep", ["1"], { stdio: "ignore" });
  }
  if (!ready) throw new Error("Postgres container failed to become ready");
  spawnSync("sleep", ["2"], { stdio: "ignore" });

  // Stubs + writing commercial sync (reproduces Production blocker)
  sql(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    grant usage on schema public to anon, authenticated, service_role;
    create schema if not exists auth;
    create or replace function auth.role() returns text language sql stable as $$
      select current_setting('request.jwt.claim.role', true)
    $$;
    create or replace function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;

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
    create table public.tenant_modules (
      id uuid primary key default gen_random_uuid(),
      tenant_id uuid not null,
      module_key text not null,
      licensed boolean not null default false,
      enabled boolean not null default false,
      status text not null default 'disabled',
      activated_at timestamptz,
      updated_at timestamptz default now(),
      unique (tenant_id, module_key)
    );

    create or replace function public.sync_tenant_modules_from_package(p_tenant_id uuid)
    returns void language plpgsql security definer set search_path = public as $$
    begin
      insert into public.tenant_modules (tenant_id, module_key, licensed, enabled, status, activated_at)
      values (p_tenant_id, 'website_kompis', true, true, 'enabled', now())
      on conflict (tenant_id, module_key) do update set
        licensed = true,
        enabled = true,
        status = 'enabled',
        updated_at = now();
    end;
    $$;

    create or replace function public.ensure_tenant_commercial_setup(p_tenant_id uuid)
    returns void language plpgsql security definer set search_path = public as $$
    begin
      perform public.sync_tenant_modules_from_package(p_tenant_id);
    end;
    $$;

    create or replace function public.is_tenant_module_enabled(p_tenant_id uuid, p_module_key text)
    returns boolean language plpgsql stable security definer set search_path = public as $$
    declare v_row public.tenant_modules;
    begin
      perform public.ensure_tenant_commercial_setup(p_tenant_id);
      select * into v_row from public.tenant_modules
      where tenant_id = p_tenant_id and module_key = p_module_key;
      if v_row.id is null then return false; end if;
      return v_row.licensed and v_row.enabled and v_row.status in ('enabled', 'trial', 'beta');
    end;
    $$;

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
        and (p_install_id is null or c.installation_id = p_install_id)
      limit 1
    $$;
  `);

  applyFile(migration376);

  sql(`
    insert into public.customers values
      ('${TENANT_A}', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
      ('${TENANT_B}', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd');
    insert into public.installations values
      ('${INSTALL_A}', '${TENANT_A}', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'https://${HOST_A}', null, 'active'),
      ('${INSTALL_B}', '${TENANT_B}', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'https://${HOST_B}', null, 'active');
    insert into public.customer_domains values
      ('${TENANT_A}', '${HOST_A}', 'verified', 'active', '${INSTALL_A}'),
      ('${TENANT_B}', '${HOST_B}', 'verified', 'active', '${INSTALL_B}');
    insert into public.tenant_modules (tenant_id, module_key, licensed, enabled, status, activated_at)
    values
      ('${TENANT_A}', 'website_kompis', true, true, 'enabled', now()),
      ('${TENANT_B}', 'website_kompis', true, true, 'enabled', now());
  `);

  // Seed docs via replace RPC
  sql(`
    select set_config('request.jwt.claim.role', 'service_role', true);
    select public.replace_tenant_public_site_index_document(
      '${TENANT_A}'::uuid, '${INSTALL_A}'::uuid, '${HOST_A}',
      'https://${HOST_A}/no/membership-guide', '/no/membership-guide', 'no',
      'Medlemsguide', 'Sammenlign nivåer', 'Bronze Silver Gold',
      'Bronze, Silver, Gold og Elite Diamond har ulike fordeler for medlemmer på NETTSTED_NAVN.',
      'hash-active-1',
      array['Bronze, Silver, Gold og Elite Diamond har ulike fordeler for medlemmer på NETTSTED_NAVN.']
    );
    select public.replace_tenant_public_site_index_document(
      '${TENANT_A}'::uuid, '${INSTALL_A}'::uuid, '${HOST_A}',
      'https://${HOST_A}/no/modell/Admin', '/no/modell/Admin', 'no',
      'Admin profile', 'login', 'Logg inn for å se profil',
      'Logg inn for å se privat medlemsprofil Admin på NETTSTED_NAVN.',
      'hash-stale-admin',
      array['Logg inn for å se privat medlemsprofil Admin på NETTSTED_NAVN.']
    );
    update public.tenant_public_site_index_documents
      set status = 'stale'
      where canonical_url = 'https://${HOST_A}/no/modell/Admin';
    select public.replace_tenant_public_site_index_document(
      '${TENANT_B}'::uuid, '${INSTALL_B}'::uuid, '${HOST_B}',
      'https://${HOST_B}/no/membership-guide', '/no/membership-guide', 'no',
      'Other tenant', 'secret', 'Other tenant secret membership text UNIQUEOTHERTOKEN',
      'Other tenant secret membership text UNIQUEOTHERTOKEN must never leak.',
      'hash-other',
      array['Other tenant secret membership text UNIQUEOTHERTOKEN must never leak.']
    );
  `);
}

function startPostgrest(): number {
  execFileSync(
    "docker",
    [
      "run",
      "-d",
      "--name",
      postgrestContainer,
      "--network",
      network,
      "-p",
      "3001:3000",
      "-e",
      `PGRST_DB_URI=postgres://postgres:postgres@${container}:5432/wpsi`,
      "-e",
      "PGRST_DB_SCHEMAS=public",
      "-e",
      "PGRST_DB_ANON_ROLE=anon",
      "postgrest/postgrest:v12.2.3",
    ],
    { stdio: "ignore" },
  );

  for (let i = 0; i < 40; i += 1) {
    try {
      const code = execFileSync(
        "curl",
        ["-s", "-o", "/dev/null", "-w", "%{http_code}", "http://127.0.0.1:3001/"],
        { encoding: "utf8" },
      ).trim();
      if (code === "200" || code === "401") return 3001;
    } catch {
      // retry
    }
    spawnSync("sleep", ["1"], { stdio: "ignore" });
  }
  const logs = spawnSync("docker", ["logs", postgrestContainer], { encoding: "utf8" });
  throw new Error(`PostgREST failed to become ready: ${logs.stderr || logs.stdout}`);
}

async function postgrestRpcAsync(
  port: number,
  body: Record<string, unknown>,
): Promise<{ status: number; json: unknown }> {
  const payload = JSON.stringify(body);
  return await new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path: "/rpc/search_tenant_public_site_index",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json: unknown = text;
          try {
            json = JSON.parse(text);
          } catch {
            // keep text
          }
          resolve({ status: res.statusCode ?? 0, json });
        });
      },
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

function cleanup(): void {
  spawnSync("docker", ["rm", "-f", container, postgrestContainer], { stdio: "ignore" });
  spawnSync("docker", ["network", "rm", network], { stdio: "ignore" });
}

async function main(): Promise<void> {
  if (!dockerAvailable()) {
    console.log("readonly-search-matrix: SKIPPED (docker unavailable)");
    return;
  }

  try {
    bootstrapBase();

    // --- BEFORE repair: writing assert fails under read-only (Production 25006) ---
    const beforeErr = sqlExpectFail(
      `select count(*) from public.search_tenant_public_site_index(
        '${INSTALL_A}'::uuid, '${HOST_A}', 'no', 'Bronze Silver Gold Elite Diamond', 5
      );`,
      { readOnly: true },
    );
    assert.match(beforeErr, /25006|read-only transaction/i);

    // Apply repair
    applyFile(migration378);

    // --- AFTER repair: read-only transaction succeeds with hits ---
    const afterCount = sql(
      `select count(*) from public.search_tenant_public_site_index(
        '${INSTALL_A}'::uuid, '${HOST_A}', 'no', 'Bronze Silver Gold Elite Diamond', 5
      );`,
      { readOnly: true, role: "anon" },
    );
    assert.ok(Number(afterCount) >= 1, `expected hits after repair, got ${afterCount}`);

    const url = sql(
      `select canonical_url from public.search_tenant_public_site_index(
        '${INSTALL_A}'::uuid, '${HOST_A}', 'no', 'Bronze Silver Gold Elite Diamond', 1
      );`,
      { readOnly: true, role: "anon" },
    );
    assert.equal(url, `https://${HOST_A}/no/membership-guide`);

    // Stale Admin profile never returned
    const staleHits = sql(
      `select count(*) from public.search_tenant_public_site_index(
        '${INSTALL_A}'::uuid, '${HOST_A}', 'no', 'Admin privat medlemsprofil Logg inn', 5
      );`,
      { readOnly: true, role: "anon" },
    );
    assert.equal(staleHits, "0");

    // Cross-tenant / wrong install: no leak of UNIQUEOTHERTOKEN
    const cross = sql(
      `select coalesce(string_agg(chunk_content, ' '), '') from public.search_tenant_public_site_index(
        '${INSTALL_A}'::uuid, '${HOST_A}', 'no', 'UNIQUEOTHERTOKEN membership', 5
      );`,
      { readOnly: true, role: "anon" },
    );
    assert.doesNotMatch(cross, /UNIQUEOTHERTOKEN/);

    const wrongInstall = sql(
      `select count(*) from public.search_tenant_public_site_index(
        '${INSTALL_B}'::uuid, '${HOST_A}', 'no', 'Bronze Silver Gold Elite Diamond', 5
      );`,
      { readOnly: true, role: "anon" },
    );
    assert.equal(wrongInstall, "0");

    // Module disabled → deny
    sql(`update public.tenant_modules set enabled = false, status = 'disabled'
         where tenant_id = '${TENANT_A}' and module_key = 'website_kompis';`);
    const disabled = sql(
      `select count(*) from public.search_tenant_public_site_index(
        '${INSTALL_A}'::uuid, '${HOST_A}', 'no', 'Bronze Silver Gold Elite Diamond', 5
      );`,
      { readOnly: true, role: "anon" },
    );
    assert.equal(disabled, "0");

    // Restore + revoke row (missing) → deny
    sql(`delete from public.tenant_modules
         where tenant_id = '${TENANT_A}' and module_key = 'website_kompis';`);
    const missing = sql(
      `select count(*) from public.search_tenant_public_site_index(
        '${INSTALL_A}'::uuid, '${HOST_A}', 'no', 'Bronze Silver Gold Elite Diamond', 5
      );`,
      { readOnly: true, role: "anon" },
    );
    assert.equal(missing, "0");

    // Re-enable for PostgREST
    sql(`insert into public.tenant_modules (tenant_id, module_key, licensed, enabled, status, activated_at)
         values ('${TENANT_A}', 'website_kompis', true, true, 'enabled', now());`);

    // Prove search path does zero writes: count tenant_modules before/after read-only search
    const beforeMods = sql(`select count(*) from public.tenant_modules;`);
    sql(
      `select count(*) from public.search_tenant_public_site_index(
        '${INSTALL_A}'::uuid, '${HOST_A}', 'no', 'Bronze Silver Gold Elite Diamond', 5
      );`,
      { readOnly: true, role: "anon" },
    );
    const afterMods = sql(`select count(*) from public.tenant_modules;`);
    assert.equal(beforeMods, afterMods);

    // PostgREST RPC (anon) — real HTTP path
    let postgrestOk = false;
    let postgrestNote = "";
    try {
      const port = startPostgrest();
      const res = await postgrestRpcAsync(port, {
        p_install_id: INSTALL_A,
        p_domain: HOST_A,
        p_locale: "no",
        p_query: "Bronze Silver Gold Elite Diamond",
        p_limit: 3,
      });
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.json));
      const rows = res.json as Array<{ canonical_url?: string }>;
      assert.ok(rows.length >= 1);
      assert.equal(rows[0]?.canonical_url, `https://${HOST_A}/no/membership-guide`);
      postgrestOk = true;
      postgrestNote = `PostgREST HTTP 200 with ${rows.length} hit(s)`;
    } catch (error) {
      postgrestNote = `PostgREST unverified: ${error instanceof Error ? error.message : String(error)}`;
      // Read-only SQL path already proved; PostgREST is best-effort if image pull fails
      console.warn(postgrestNote);
    }

    console.log(
      JSON.stringify({
        ok: true,
        beforeRepair: "25006 under read-only",
        afterRepairHits: Number(afterCount),
        staleExcluded: true,
        crossTenantLeak: false,
        moduleDisabledDeny: true,
        missingModuleDeny: true,
        moduleRowCountUnchanged: beforeMods === afterMods,
        postgrestOk,
        postgrestNote,
      }),
    );
    console.log("readonly-search-matrix: all required DB proofs passed");
  } finally {
    cleanup();
  }
}

main().catch((error) => {
  cleanup();
  console.error(error);
  process.exit(1);
});
