/**
 * Isolated Docker Postgres contract for visitor FAQ install isolation SQL proposal.
 * Does NOT touch Staging/Production. Skips when Docker is unavailable.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WEBSITE_KOMPIS_VISITOR_FAQ_SQL_PROPOSAL } from "./sql-proposal";
import { WEBSITE_KOMPIS_VISITOR_FAQ_CURRENT_LEAK_SQL_FRAGMENT } from "./policy";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const container = `aipify-wk-visitor-faq-iso-${Date.now()}`;
const migrationPath = path.join(
  root,
  WEBSITE_KOMPIS_VISITOR_FAQ_SQL_PROPOSAL.migrationRelativePath,
);
const widenPath = path.join(
  root,
  "supabase/migrations/20261932500000_widen_website_kompis_faq_retrieval.sql",
);

const TENANT = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const TENANT_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const INSTALL_A = "11111111-1111-4111-8111-111111111111";
const INSTALL_B = "22222222-2222-4222-8222-222222222222";
const INSTALL_OTHER = "33333333-3333-4333-8333-333333333333";

function dockerAvailable(): boolean {
  return spawnSync("docker", ["info"], { stdio: "ignore" }).status === 0;
}

function sql(query: string): string {
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
      "wkfaq",
      "-v",
      "ON_ERROR_STOP=1",
      "-tA",
      "-c",
      query,
    ],
    { encoding: "utf8" },
  ).trim();
  const lines = out.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines[lines.length - 1] ?? "";
}

function applySqlFile(filePath: string): void {
  const body = fs.readFileSync(filePath, "utf8");
  execFileSync(
    "docker",
    ["exec", "-i", container, "psql", "-U", "postgres", "-d", "wkfaq", "-v", "ON_ERROR_STOP=1"],
    { input: body, encoding: "utf8" },
  );
}

function cleanup(): void {
  spawnSync("docker", ["rm", "-f", container], { stdio: "ignore" });
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
      "POSTGRES_DB=wkfaq",
      "postgres:16-alpine",
    ],
    { stdio: "ignore" },
  );

  let readyOk = false;
  for (let i = 0; i < 40; i += 1) {
    const ready = spawnSync(
      "docker",
      ["exec", container, "pg_isready", "-U", "postgres", "-d", "wkfaq"],
      { stdio: "ignore" },
    );
    if (ready.status === 0) {
      readyOk = true;
      break;
    }
    spawnSync("sleep", ["1"], { stdio: "ignore" });
  }
  if (!readyOk) throw new Error("Postgres container failed to become ready");
  spawnSync("sleep", ["2"], { stdio: "ignore" });

  sql(`
    create role anon nologin;
    create role authenticated nologin;
    grant usage on schema public to anon, authenticated;

    create table public.customers (id uuid primary key, company_id uuid);
    create table public.installations (
      id uuid primary key,
      customer_id uuid,
      company_id uuid,
      site_url text,
      revoked_at timestamptz,
      status text
    );
    create table public.customer_domains (
      customer_id uuid,
      domain text,
      verification_status text,
      status text,
      installation_id uuid
    );
    create table public.tenant_public_companion_faq_items (
      id uuid primary key default gen_random_uuid(),
      tenant_id uuid not null,
      install_id uuid,
      domain text,
      locale text not null,
      title text not null,
      question text,
      answer text not null,
      category text,
      content_type text not null default 'faq',
      status text not null,
      public_safe boolean not null default false,
      surface text not null default 'website_kompis',
      priority integer not null default 100,
      tags text[] not null default '{}'::text[],
      source_url text,
      valid_from timestamptz,
      valid_until timestamptz,
      published_at timestamptz,
      updated_at timestamptz not null default now()
    );

    create or replace function public.normalize_domain(p_domain text)
    returns text language sql immutable as $$
      select nullif(lower(trim(coalesce(p_domain, ''))), '')
    $$;

    create or replace function public._wpkf_resolve_visitor_context(
      p_install_id uuid,
      p_domain text
    )
    returns table (
      tenant_id uuid,
      resolved_install_id uuid,
      resolved_domain text
    )
    language plpgsql stable security definer set search_path = public
    as $fn$
    declare
      v_domain text := public.normalize_domain(p_domain);
      v_tenant uuid;
      v_install uuid;
    begin
      if p_install_id is not null then
        select i.customer_id, i.id into v_tenant, v_install
        from public.installations i
        where i.id = p_install_id
          and i.revoked_at is null
          and i.status in ('ready', 'installing', 'active', 'warning')
        limit 1;
        if v_install is null then
          return;
        end if;
        if v_domain is not null and not exists (
          select 1 from public.customer_domains cd
          where cd.customer_id = v_tenant
            and cd.domain = v_domain
            and cd.verification_status = 'verified'
            and cd.status = 'active'
            and (cd.installation_id is null or cd.installation_id = p_install_id)
        ) then
          return;
        end if;
        tenant_id := v_tenant;
        resolved_install_id := v_install;
        resolved_domain := v_domain;
        return next;
        return;
      end if;
      if v_domain is not null then
        select cd.customer_id, cd.installation_id
        into v_tenant, v_install
        from public.customer_domains cd
        where cd.domain = v_domain
          and cd.verification_status = 'verified'
          and cd.status = 'active'
        limit 1;
        if v_tenant is null then
          return;
        end if;
        tenant_id := v_tenant;
        resolved_install_id := v_install;
        resolved_domain := v_domain;
        return next;
      end if;
      return;
    end;
    $fn$;
  `);

  applySqlFile(widenPath);
}

function seedBase(): void {
  sql(`
    truncate public.customers, public.installations, public.customer_domains, public.tenant_public_companion_faq_items;
    insert into public.customers values
      ('${TENANT}', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'),
      ('${TENANT_B}', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd');
    insert into public.installations values
      ('${INSTALL_A}', '${TENANT}', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'https://site-a.example', null, 'active'),
      ('${INSTALL_B}', '${TENANT}', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'https://site-b.example', null, 'active'),
      ('${INSTALL_OTHER}', '${TENANT_B}', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'https://other.example', null, 'active');
  `);
}

function insertFaq(opts: {
  id: string;
  tenant: string;
  install: string | null;
  title: string;
  status?: string;
  publicSafe?: boolean;
  surface?: string;
  locale?: string;
}): void {
  const installSql = opts.install == null ? "null" : `'${opts.install}'`;
  sql(`
    insert into public.tenant_public_companion_faq_items (
      id, tenant_id, install_id, locale, title, answer, content_type, status, public_safe, surface, published_at
    ) values (
      '${opts.id}',
      '${opts.tenant}',
      ${installSql},
      '${opts.locale ?? "no"}',
      '${opts.title}',
      'answer for ${opts.title}',
      'faq',
      '${opts.status ?? "published"}',
      ${opts.publicSafe === false ? "false" : "true"},
      '${opts.surface ?? "website_kompis"}',
      now()
    );
  `);
}

function searchTitles(installId: string, domain: string): string[] {
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
      "wkfaq",
      "-v",
      "ON_ERROR_STOP=1",
      "-tA",
      "-c",
      `select title from public.search_tenant_public_visitor_knowledge(
        '${installId}'::uuid,
        '${domain}',
        'no',
        'faq',
        null,
        10
      ) order by title;`,
    ],
    { encoding: "utf8" },
  )
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return out;
}

function main(): void {
  // Static proposal checks (always run)
  assert.ok(fs.existsSync(migrationPath));
  const migrationBody = fs.readFileSync(migrationPath, "utf8");
  const sha256 = createHash("sha256").update(migrationBody).digest("hex");
  assert.equal(sha256, WEBSITE_KOMPIS_VISITOR_FAQ_SQL_PROPOSAL.migrationSha256);
  assert.match(migrationBody, /_wpkf_count_active_verified_installs/);
  assert.match(migrationBody, /active_verified_install_count = 1/);
  assert.doesNotMatch(
    migrationBody,
    new RegExp(WEBSITE_KOMPIS_VISITOR_FAQ_CURRENT_LEAK_SQL_FRAGMENT.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  );
  assert.match(migrationBody, /_wpkf_assert_install_owned_by_tenant/);
  assert.doesNotMatch(migrationBody, /employee_knowledge/i);

  const manifest = JSON.parse(
    fs.readFileSync(
      path.join(root, "docs/integrations/website-kompis-public-chain-frozen-manifest.json"),
      "utf8",
    ),
  ) as { protectedRuntimeFiles: Array<{ path: string; sha256: string }> };
  assert.equal(manifest.protectedRuntimeFiles.length, 46);
  for (const entry of manifest.protectedRuntimeFiles) {
    const live = createHash("sha256")
      .update(fs.readFileSync(path.join(root, entry.path)))
      .digest("hex");
    assert.equal(live, entry.sha256, `frozen drift: ${entry.path}`);
  }

  console.log(
    JSON.stringify({
      migration: WEBSITE_KOMPIS_VISITOR_FAQ_SQL_PROPOSAL.migrationRelativePath,
      sha256,
      sqlApplied: false,
      frozenFilesTouched: 0,
    }),
  );

  if (!dockerAvailable()) {
    console.log("visitor-faq-sql-isolation.contract.test.ts: Docker NOT RUN (unavailable)");
    return;
  }

  try {
    bootstrap();
    seedBase();

    // Single-install + apex/www aliases count as ONE install
    sql(`
      insert into public.customer_domains values
        ('${TENANT}', 'site-a.example', 'verified', 'active', '${INSTALL_A}'),
        ('${TENANT}', 'www.site-a.example', 'verified', 'active', '${INSTALL_A}');
    `);
    for (let i = 1; i <= 5; i += 1) {
      insertFaq({
        id: `00000000-0000-4000-8000-00000000000${i}`,
        tenant: TENANT,
        install: i === 5 ? INSTALL_A : null,
        title: `faq single ${i}`,
      });
    }
    insertFaq({
      id: "00000000-0000-4000-8000-000000000099",
      tenant: TENANT,
      install: null,
      title: "faq draft hidden",
      status: "draft",
      publicSafe: false,
    });
    insertFaq({
      id: "00000000-0000-4000-8000-000000000098",
      tenant: TENANT_B,
      install: INSTALL_OTHER,
      title: "faq other tenant",
    });

    // Prove aliases (apex+www) are one install before helper exists
    assert.equal(
      sql(`
        select count(distinct cd.installation_id)::text
        from public.customer_domains cd
        join public.installations i on i.id = cd.installation_id
        where cd.customer_id = '${TENANT}'
          and cd.verification_status = 'verified'
          and cd.status = 'active'
          and i.revoked_at is null
          and i.status in ('ready', 'installing', 'active', 'warning')
      `),
      "1",
    );

    // Apply proposal migration (local Docker only — not Staging/Production)
    applySqlFile(migrationPath);

    assert.equal(sql(`select public._wpkf_count_active_verified_installs('${TENANT}'::uuid)`), "1");
    const singleTitles = searchTitles(INSTALL_A, "www.site-a.example");
    assert.deepEqual(singleTitles, [
      "faq single 1",
      "faq single 2",
      "faq single 3",
      "faq single 4",
      "faq single 5",
    ]);
    assert.ok(!singleTitles.includes("faq draft hidden"));
    assert.ok(!singleTitles.includes("faq other tenant"));

    // Multi-install: NULL bleed must stop; scoped rows stay per install
    sql(`
      insert into public.customer_domains values
        ('${TENANT}', 'site-b.example', 'verified', 'active', '${INSTALL_B}');
      delete from public.tenant_public_companion_faq_items;
    `);
    assert.equal(sql(`select public._wpkf_count_active_verified_installs('${TENANT}'::uuid)`), "2");

    insertFaq({
      id: "00000000-0000-4000-8000-000000000011",
      tenant: TENANT,
      install: INSTALL_A,
      title: "faq only A",
    });
    insertFaq({
      id: "00000000-0000-4000-8000-000000000012",
      tenant: TENANT,
      install: INSTALL_B,
      title: "faq only B",
    });
    insertFaq({
      id: "00000000-0000-4000-8000-000000000013",
      tenant: TENANT,
      install: null,
      title: "faq legacy null",
    });

    assert.deepEqual(searchTitles(INSTALL_A, "site-a.example"), ["faq only A"]);
    assert.deepEqual(searchTitles(INSTALL_B, "site-b.example"), ["faq only B"]);

    // Wrong domain / unknown install → fail closed
    assert.deepEqual(searchTitles(INSTALL_A, "evil.example"), []);
    assert.deepEqual(
      searchTitles("99999999-9999-4999-8999-999999999999", "site-a.example"),
      [],
    );

    // Upsert ownership helper
    const ok = spawnSync(
      "docker",
      [
        "exec",
        "-i",
        container,
        "psql",
        "-U",
        "postgres",
        "-d",
        "wkfaq",
        "-v",
        "ON_ERROR_STOP=1",
        "-c",
        `select public._wpkf_assert_install_owned_by_tenant('${TENANT}'::uuid, '${INSTALL_A}'::uuid);`,
      ],
      { encoding: "utf8" },
    );
    assert.equal(ok.status, 0);

    const bad = spawnSync(
      "docker",
      [
        "exec",
        "-i",
        container,
        "psql",
        "-U",
        "postgres",
        "-d",
        "wkfaq",
        "-v",
        "ON_ERROR_STOP=1",
        "-c",
        `select public._wpkf_assert_install_owned_by_tenant('${TENANT}'::uuid, '${INSTALL_OTHER}'::uuid);`,
      ],
      { encoding: "utf8" },
    );
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr + bad.stdout, /install_id not owned/i);

    console.log("visitor-faq-sql-isolation.contract.test.ts: all assertions passed");
  } finally {
    cleanup();
  }
}

main();
