/**
 * FROZEN contract gate + local Docker Postgres matrix for verified apex↔www
 * FAQ visitor domain eligibility.
 *
 * Enforce:
 *   npx --yes tsx lib/website-kompis-verified-apex-www-faq-eligibility/verified-apex-www-faq-eligibility.contract.test.ts
 *
 * Does NOT touch Staging/Production. Skips Docker matrix when Docker unavailable
 * (reports NOT RUN — never claims local SQL PASS without Docker).
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  WEBSITE_KOMPIS_VERIFIED_APEX_WWW_FAQ_ELIGIBILITY_CONTRACT as C,
  WEBSITE_KOMPIS_VERIFIED_APEX_WWW_FAQ_ELIGIBILITY_MIGRATION_SHA256,
} from "./contract";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const container = `aipify-wk-apex-www-faq-${Date.now()}`;
const widenPath = path.join(
  root,
  "supabase/migrations/20261932500000_widen_website_kompis_faq_retrieval.sql",
);
const isolationPath = path.join(
  root,
  "supabase/migrations/20261938200000_website_kompis_visitor_faq_install_isolation_v1.sql",
);
const migrationPath = path.join(root, C.migrationRelativePath);

const TENANT = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const TENANT_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const INSTALL_A = "11111111-1111-4111-8111-111111111111";
const INSTALL_B = "22222222-2222-4222-8222-222222222222";
const INSTALL_OTHER = "33333333-3333-4333-8333-333333333333";

const APEX = "site-a.example";
const WWW = "www.site-a.example";
const OTHER_SUB = "blog.site-a.example";
const B_APEX = "other.example";

type MatrixResult = { case: string; status: "PASS" | "FAIL"; detail?: string };

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

function functionSha256(name: string): string {
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
      `select md5(pg_get_functiondef('${name}'::regprocedure));`,
    ],
    { encoding: "utf8" },
  ).trim();
  const md5 = out.split("\n").map((l) => l.trim()).filter(Boolean).at(-1) ?? "";
  assert.ok(/^[a-f0-9]{32}$/.test(md5), `bad function md5 for ${name}: ${md5}`);
  return md5;
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
      return;
    end;
    $fn$;
  `);

  applySqlFile(widenPath);
  applySqlFile(isolationPath);
}

function seedInstalls(): void {
  sql(`
    truncate public.customers, public.installations, public.customer_domains, public.tenant_public_companion_faq_items;
    insert into public.customers values
      ('${TENANT}', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'),
      ('${TENANT_B}', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd');
    insert into public.installations values
      ('${INSTALL_A}', '${TENANT}', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'https://${APEX}', null, 'active'),
      ('${INSTALL_B}', '${TENANT}', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'https://site-b.example', null, 'active'),
      ('${INSTALL_OTHER}', '${TENANT_B}', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'https://${B_APEX}', null, 'active');
  `);
}

function insertFaq(opts: {
  id: string;
  tenant: string;
  install: string | null;
  domain: string | null;
  title: string;
  answer?: string;
  status?: string;
  publicSafe?: boolean;
  surface?: string;
  locale?: string;
  validUntil?: string | null;
}): void {
  const installSql = opts.install == null ? "null" : `'${opts.install}'`;
  const domainSql = opts.domain == null ? "null" : `'${opts.domain}'`;
  const untilSql =
    opts.validUntil === undefined
      ? "null"
      : opts.validUntil === null
        ? "null"
        : `'${opts.validUntil}'`;
  sql(`
    insert into public.tenant_public_companion_faq_items (
      id, tenant_id, install_id, domain, locale, title, answer, content_type,
      status, public_safe, surface, published_at, valid_until, priority
    ) values (
      '${opts.id}',
      '${opts.tenant}',
      ${installSql},
      ${domainSql},
      '${opts.locale ?? "no"}',
      '${opts.title.replace(/'/g, "''")}',
      '${(opts.answer ?? `answer for ${opts.title}`).replace(/'/g, "''")}',
      'faq',
      '${opts.status ?? "published"}',
      ${opts.publicSafe === false ? "false" : "true"},
      '${opts.surface ?? "website_kompis"}',
      now(),
      ${untilSql},
      100
    );
  `);
}

function searchTitles(
  installId: string,
  domain: string,
  query: string,
  locale = "no",
): string[] {
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
        '${locale}',
        '${query.replace(/'/g, "''")}',
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

function expectCase(
  results: MatrixResult[],
  name: string,
  fn: () => void,
): void {
  try {
    fn();
    results.push({ case: name, status: "PASS" });
  } catch (err) {
    results.push({
      case: name,
      status: "FAIL",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}

function runStaticGates(): { sha256: string } {
  assert.ok(fs.existsSync(migrationPath), "migration missing");
  const body = fs.readFileSync(migrationPath, "utf8");
  const sha256 = createHash("sha256").update(body).digest("hex");
  assert.equal(
    sha256,
    WEBSITE_KOMPIS_VERIFIED_APEX_WWW_FAQ_ELIGIBILITY_MIGRATION_SHA256,
    "migration SHA-256 drift — update contract constant if intentional",
  );

  assert.match(body, /_wpkf_is_exact_apex_www_pair/);
  assert.match(body, /_wpkf_faq_domain_eligible_for_resolved_visitor/);
  assert.match(body, new RegExp(C.requiredEligibilityCall));
  assert.doesNotMatch(
    body,
    /create\s+or\s+replace\s+function\s+public\._wpkf_resolve_visitor_context/i,
  );
  assert.doesNotMatch(body, C.forbiddenBarePredicateInSearchBody);
  assert.doesNotMatch(body, /unonight/i);
  assert.doesNotMatch(body, /180c9d31/i);
  assert.match(body, /FROZEN/);

  const invariant = fs.readFileSync(
    path.join(
      root,
      "lib/website-kompis-verified-apex-www-faq-eligibility/FROZEN_INVARIANT.md",
    ),
    "utf8",
  );
  assert.match(invariant, /FROZEN/);
  assert.match(invariant, /enforceCommand|Machine gate|npx --yes tsx/);

  const manifest = JSON.parse(
    fs.readFileSync(
      path.join(root, "docs/integrations/website-kompis-public-chain-frozen-manifest.json"),
      "utf8",
    ),
  ) as { protectedRuntimeFiles: Array<{ path: string; sha256: string }> };

  for (const frozenPath of C.frozenPublicChainUntouched) {
    const entry = manifest.protectedRuntimeFiles.find((f) => f.path === frozenPath);
    assert.ok(entry, `manifest missing ${frozenPath}`);
    const live = createHash("sha256")
      .update(fs.readFileSync(path.join(root, frozenPath)))
      .digest("hex");
    assert.equal(live, entry.sha256, `frozen drift: ${frozenPath}`);
  }

  console.log(
    JSON.stringify({
      contract: C.status,
      migration: C.migrationRelativePath,
      sha256,
      enforceCommand: C.enforceCommand,
      followUp: C.followUpNotInThisChange,
    }),
  );

  return { sha256 };
}

function main(): void {
  const { sha256 } = runStaticGates();
  const matrix: MatrixResult[] = [];

  if (!dockerAvailable()) {
    console.log(
      "verified-apex-www-faq-eligibility.contract.test.ts: Docker NOT RUN (unavailable)",
    );
    console.log(JSON.stringify({ migrationSha256: sha256, docker: "NOT_RUN", matrix }));
    return;
  }

  let beforeHash = "";
  let afterHash = "";

  try {
    bootstrap();
    seedInstalls();

    sql(`
      insert into public.customer_domains values
        ('${TENANT}', '${APEX}', 'verified', 'active', '${INSTALL_A}'),
        ('${TENANT}', '${WWW}', 'verified', 'active', '${INSTALL_A}'),
        ('${TENANT}', '${OTHER_SUB}', 'verified', 'active', '${INSTALL_A}'),
        ('${TENANT}', 'site-b.example', 'verified', 'active', '${INSTALL_B}'),
        ('${TENANT}', 'www.site-b.example', 'verified', 'active', '${INSTALL_B}'),
        ('${TENANT_B}', '${B_APEX}', 'verified', 'active', '${INSTALL_OTHER}'),
        ('${TENANT_B}', 'www.${B_APEX}', 'verified', 'active', '${INSTALL_OTHER}');
    `);

    insertFaq({
      id: "00000000-0000-4000-8000-000000000001",
      tenant: TENANT,
      install: INSTALL_A,
      domain: APEX,
      title: "strong email faq",
      answer: "email notifications are available for members",
    });
    insertFaq({
      id: "00000000-0000-4000-8000-000000000002",
      tenant: TENANT,
      install: INSTALL_A,
      domain: WWW,
      title: "www stored faq",
      answer: "stored under www host",
    });
    insertFaq({
      id: "00000000-0000-4000-8000-000000000003",
      tenant: TENANT,
      install: null,
      domain: null,
      title: "null domain faq",
      answer: "legacy null domain",
    });
    insertFaq({
      id: "00000000-0000-4000-8000-000000000004",
      tenant: TENANT,
      install: INSTALL_A,
      domain: APEX,
      title: "weak socks faq",
      answer: "unrelated weak topical content about socks",
    });
    insertFaq({
      id: "00000000-0000-4000-8000-000000000005",
      tenant: TENANT,
      install: INSTALL_A,
      domain: APEX,
      title: "draft email faq",
      answer: "draft must stay hidden",
      status: "draft",
      publicSafe: false,
    });
    insertFaq({
      id: "00000000-0000-4000-8000-000000000006",
      tenant: TENANT,
      install: INSTALL_A,
      domain: APEX,
      title: "unsafe email faq",
      answer: "not public safe",
      publicSafe: false,
    });
    insertFaq({
      id: "00000000-0000-4000-8000-000000000007",
      tenant: TENANT,
      install: INSTALL_A,
      domain: APEX,
      title: "expired email faq",
      answer: "expired",
      validUntil: "2000-01-01T00:00:00Z",
    });
    insertFaq({
      id: "00000000-0000-4000-8000-000000000008",
      tenant: TENANT_B,
      install: INSTALL_OTHER,
      domain: B_APEX,
      title: "foreign tenant email faq",
      answer: "must not leak",
    });
    insertFaq({
      id: "00000000-0000-4000-8000-000000000009",
      tenant: TENANT,
      install: INSTALL_B,
      domain: "site-b.example",
      title: "other install email faq",
      answer: "other install",
    });
    insertFaq({
      id: "00000000-0000-4000-8000-000000000010",
      tenant: TENANT,
      install: INSTALL_A,
      domain: APEX,
      title: "swedish email faq",
      answer: "sv only",
      locale: "sv",
    });

    beforeHash = functionSha256(
      "public.search_tenant_public_visitor_knowledge(uuid,text,text,text,text,integer)",
    );

    // Pre-migration baseline: www visitor must NOT see apex-stored strong FAQ
    expectCase(matrix, "pre_migration_www_misses_apex_faq", () => {
      const titles = searchTitles(INSTALL_A, WWW, "email");
      assert.ok(
        !titles.includes("strong email faq"),
        `unexpected hit before migration: ${titles.join(",")}`,
      );
    });

    applySqlFile(migrationPath);
    afterHash = functionSha256(
      "public.search_tenant_public_visitor_knowledge(uuid,text,text,text,text,integer)",
    );
    assert.notEqual(beforeHash, afterHash, "function body must change after migration");

    expectCase(matrix, "www_visitor_hits_apex_faq", () => {
      const titles = searchTitles(INSTALL_A, WWW, "email");
      assert.ok(titles.includes("strong email faq"), titles.join(","));
    });

    expectCase(matrix, "apex_visitor_hits_www_faq", () => {
      const titles = searchTitles(INSTALL_A, APEX, "www stored");
      assert.ok(titles.includes("www stored faq"), titles.join(","));
    });

    expectCase(matrix, "exact_host_still_works", () => {
      const titles = searchTitles(INSTALL_A, APEX, "email");
      assert.ok(titles.includes("strong email faq"), titles.join(","));
    });

    expectCase(matrix, "null_domain_legacy_single_install_blocked_when_multi", () => {
      // Tenant has two installs → NULL install FAQs denied by isolation; null domain alone is not enough
      const titles = searchTitles(INSTALL_A, WWW, "null domain");
      assert.ok(!titles.includes("null domain faq"), titles.join(","));
    });

    expectCase(matrix, "null_domain_allowed_when_single_install", () => {
      sql(`
        delete from public.customer_domains
        where installation_id = '${INSTALL_B}';
        delete from public.installations where id = '${INSTALL_B}';
      `);
      const titles = searchTitles(INSTALL_A, WWW, "null domain");
      assert.ok(titles.includes("null domain faq"), titles.join(","));
      // restore install B for later negatives
      sql(`
        insert into public.installations values
          ('${INSTALL_B}', '${TENANT}', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'https://site-b.example', null, 'active')
        on conflict (id) do nothing;
        insert into public.customer_domains values
          ('${TENANT}', 'site-b.example', 'verified', 'active', '${INSTALL_B}'),
          ('${TENANT}', 'www.site-b.example', 'verified', 'active', '${INSTALL_B}');
      `);
    });

    expectCase(matrix, "cross_tenant_negative", () => {
      const titles = searchTitles(INSTALL_A, WWW, "foreign tenant");
      assert.ok(!titles.includes("foreign tenant email faq"), titles.join(","));
    });

    expectCase(matrix, "cross_install_negative", () => {
      const titles = searchTitles(INSTALL_A, WWW, "other install");
      assert.ok(!titles.includes("other install email faq"), titles.join(","));
    });

    expectCase(matrix, "unrelated_subdomain_negative", () => {
      assert.equal(
        sql(`select public._wpkf_is_exact_apex_www_pair('${APEX}', '${OTHER_SUB}')::text`),
        "false",
      );
      // blog is verified on same install but not apex/www pair of FAQ domain
      sql(`
        update public.tenant_public_companion_faq_items
        set domain = '${OTHER_SUB}'
        where id = '00000000-0000-4000-8000-000000000001';
      `);
      const titles = searchTitles(INSTALL_A, WWW, "email");
      assert.ok(!titles.includes("strong email faq"), titles.join(","));
      sql(`
        update public.tenant_public_companion_faq_items
        set domain = '${APEX}'
        where id = '00000000-0000-4000-8000-000000000001';
      `);
    });

    expectCase(matrix, "unverified_alias_negative", () => {
      sql(`
        update public.customer_domains
        set verification_status = 'pending'
        where domain = '${WWW}' and installation_id = '${INSTALL_A}';
      `);
      // resolve itself fails for www when unverified — zero rows
      const titles = searchTitles(INSTALL_A, WWW, "email");
      assert.deepEqual(titles, []);
      sql(`
        update public.customer_domains
        set verification_status = 'verified'
        where domain = '${WWW}' and installation_id = '${INSTALL_A}';
      `);
    });

    expectCase(matrix, "inactive_alias_negative", () => {
      sql(`
        update public.customer_domains
        set status = 'disabled'
        where domain = '${APEX}' and installation_id = '${INSTALL_A}';
      `);
      const titles = searchTitles(INSTALL_A, WWW, "email");
      assert.ok(!titles.includes("strong email faq"), titles.join(","));
      sql(`
        update public.customer_domains
        set status = 'active'
        where domain = '${APEX}' and installation_id = '${INSTALL_A}';
      `);
    });

    expectCase(matrix, "draft_negative", () => {
      const titles = searchTitles(INSTALL_A, WWW, "draft email");
      assert.ok(!titles.includes("draft email faq"), titles.join(","));
    });

    expectCase(matrix, "not_public_safe_negative", () => {
      const titles = searchTitles(INSTALL_A, WWW, "unsafe email");
      assert.ok(!titles.includes("unsafe email faq"), titles.join(","));
    });

    expectCase(matrix, "expired_negative", () => {
      const titles = searchTitles(INSTALL_A, WWW, "expired email");
      assert.ok(!titles.includes("expired email faq"), titles.join(","));
    });

    expectCase(matrix, "locale_filter", () => {
      const noTitles = searchTitles(INSTALL_A, WWW, "swedish", "no");
      assert.ok(!noTitles.includes("swedish email faq"), noTitles.join(","));
      const svTitles = searchTitles(INSTALL_A, WWW, "swedish", "sv");
      assert.ok(svTitles.includes("swedish email faq"), svTitles.join(","));
    });

    expectCase(matrix, "relevance_strong_over_weak_unchanged", () => {
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
            '${INSTALL_A}'::uuid, '${WWW}', 'no', 'email', null, 2
          ) order by score desc, title;`,
        ],
        { encoding: "utf8" },
      )
        .trim()
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      assert.equal(out[0], "strong email faq");
      assert.ok(!out.includes("weak socks faq"));
    });

    expectCase(matrix, "pair_helper_rejects_www_www", () => {
      assert.equal(
        sql(`select public._wpkf_is_exact_apex_www_pair('www.a.example', 'www.b.example')::text`),
        "false",
      );
      assert.equal(
        sql(`select public._wpkf_is_exact_apex_www_pair('${APEX}', '${WWW}')::text`),
        "true",
      );
    });

    expectCase(matrix, "anon_execute_preserved", () => {
      const priv = sql(`
        select has_function_privilege('anon',
          'public.search_tenant_public_visitor_knowledge(uuid,text,text,text,text,integer)',
          'execute')::text;
      `);
      assert.equal(priv, "true");
      const helperPriv = sql(`
        select has_function_privilege('anon',
          'public._wpkf_faq_domain_eligible_for_resolved_visitor(text,text,uuid,uuid)',
          'execute')::text;
      `);
      assert.equal(helperPriv, "false");
    });
  } finally {
    cleanup();
  }

  const failed = matrix.filter((m) => m.status === "FAIL");
  console.log(
    JSON.stringify(
      {
        migrationSha256: sha256,
        functionHashBefore: beforeHash,
        functionHashAfter: afterHash,
        matrix,
        docker: "RAN",
      },
      null,
      2,
    ),
  );

  if (failed.length > 0) {
    throw new Error(
      `LOCAL matrix FAIL (${failed.length}): ${failed.map((f) => f.case).join(", ")}`,
    );
  }

  console.log("verified-apex-www-faq-eligibility.contract.test.ts: all assertions passed");
}

main();
