/**
 * Job 39 — extract → replace RPC persist → read-back → FTS must keep late FAQ answers.
 * Isolated Docker Postgres. Skips when Docker is unavailable.
 * Neutral Desk Pass topics only (no owner LIVE travel wording as fixtures).
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const moduleApi = require("node:module") as {
  Module: { _load: (request: string, parent: unknown, isMain: boolean) => unknown };
};
const originalLoad = moduleApi.Module._load;
moduleApi.Module._load = function (request, parent, isMain) {
  if (request === "server-only") return {};
  return originalLoad.call(this, request, parent, isMain);
};

const root = path.dirname(
  path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url)))),
);
const container = `aipify-wpsi-faq-storage-${Date.now()}`;
const baseMigration = path.join(
  root,
  "supabase/migrations/20261937600000_website_kompis_public_site_index_v1.sql",
);
const repairMigration = path.join(
  root,
  "supabase/migrations/20261938100000_website_kompis_public_site_index_faq_storage_contract_v1.sql",
);

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
      "wpsi",
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
    ["exec", "-i", container, "psql", "-U", "postgres", "-d", "wpsi", "-v", "ON_ERROR_STOP=1"],
    { input: body, encoding: "utf8" },
  );
}

function sqlLiteral(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
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
  if (!readyOk) throw new Error("Postgres container failed to become ready");
  spawnSync("sleep", ["2"], { stdio: "ignore" });

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
  `);

  applySqlFile(baseMigration);
  applySqlFile(repairMigration);

  sql(`
    insert into public.customers values
      ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
      ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd');
    insert into public.installations values
      ('11111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'https://www.customer.example', null, 'active'),
      ('22222222-2222-4222-8222-222222222222', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'https://www.other.example', null, 'active');
    insert into public.customer_domains values
      ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'www.customer.example', 'verified', 'active', '11111111-1111-4111-8111-111111111111'),
      ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'www.other.example', 'verified', 'active', '22222222-2222-4222-8222-222222222222');
  `);
}

function cleanup(): void {
  spawnSync("docker", ["rm", "-f", container], { stdio: "ignore" });
}

function buildClosedFaqHtml(
  pairs: Array<{ question: string; answer: string }>,
): string {
  const escaped = pairs
    .map(
      (pair) =>
        `{\\"question\\":\\"${pair.question.replace(/"/g, '\\"')}\\",\\"answer\\":\\"${pair.answer.replace(
          /"/g,
          '\\"',
        )}\\"}`,
    )
    .join(",");
  const buttons = pairs
    .map(
      (pair) =>
        `<button type="button" aria-expanded="false">${pair.question} +</button>`,
    )
    .join("\n");
  return `<!doctype html><html lang="no"><head><title>FAQ — hjelp og svar</title></head><body>
<main><h1>Ofte stilte spørsmål</h1>${buttons}</main>
<script type="application/json">{"faq":[${escaped}]}</script>
</body></html>`;
}

async function main(): Promise<void> {
  if (!dockerAvailable()) {
    console.log("faq-storage-contract.test.ts: SKIPPED (docker unavailable)");
    return;
  }

  const {
    extractPublicPageFromHtml,
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_PERSIST_BODY_MAX,
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_PERSIST_CHUNK_MAX,
    WEBSITE_KOMPIS_PUBLIC_FAQ_CHUNK_MAX,
    WEBSITE_KOMPIS_PUBLIC_FAQ_BODY_MAX,
  } = await import("./extract");
  const { buildWebsiteKompisEvidencePack } = await import(
    "../website-kompis-grounded-answer"
  );

  assert.equal(
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_PERSIST_CHUNK_MAX,
    WEBSITE_KOMPIS_PUBLIC_FAQ_CHUNK_MAX,
  );
  assert.equal(
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_PERSIST_BODY_MAX,
    WEBSITE_KOMPIS_PUBLIC_FAQ_BODY_MAX,
  );

  const pairs: Array<{ question: string; answer: string }> = [];
  for (let i = 0; i < 200; i += 1) {
    pairs.push({
      question: `Hva dekker Desk Pass nivå ${i + 1} på NETTSTED_NAVN?`,
      answer: `Desk Pass nivå ${i + 1} gir offentlig beskrevne desk-fordeler uten private medlemsdata.`,
    });
  }
  pairs.push({
    question: "Hva skjer med Desk Pass-oppføringer når abonnementet utløper?",
    answer:
      "Når Desk Pass-abonnementet utløper, pauses publiserte desk-annonser. Nye desk-annonser krever aktiv tilgang.",
  });
  pairs.push({
    question: "Kan jeg pause en Desk Pass-annonse og åpne den igjen senere?",
    answer:
      "Ja. Du kan pause en publisert desk-annonse og åpne den igjen senere. Å åpne igjen krever fortsatt aktivt Desk Pass.",
  });

  const html = buildClosedFaqHtml(pairs);
  const extracted = extractPublicPageFromHtml(html, "no");
  assert.ok(extracted.chunks.length > 24, "fixture must exceed old 24-chunk persist cap");
  assert.ok(extracted.bodyText.length > 24000, "fixture must exceed old 24k body persist cap");
  assert.match(extracted.bodyText, /pauses publiserte desk-annonser/i);
  const lateChunkIndex = extracted.chunks.findIndex((c) =>
    /pauses publiserte desk-annonser/i.test(c),
  );
  assert.ok(lateChunkIndex > 24, `late answer must sit after chunk 24 (was ${lateChunkIndex})`);
  assert.ok(extracted.chunks.length <= WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_PERSIST_CHUNK_MAX);

  try {
    bootstrap();

    const chunkArraySql = `array[${extracted.chunks.map((c) => sqlLiteral(c)).join(",")}]::text[]`;
    const persist = sql(`
      select set_config('request.jwt.claim.role', 'service_role', true);
      select public.replace_tenant_public_site_index_document(
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid,
        '11111111-1111-4111-8111-111111111111'::uuid,
        'www.customer.example',
        'https://www.customer.example/no/faq',
        '/no/faq',
        'no',
        ${sqlLiteral(extracted.title || "FAQ — hjelp og svar")},
        ${sqlLiteral(extracted.metaDescription || "Offentlige svar")},
        ${sqlLiteral(extracted.excerpt.slice(0, 420))},
        ${sqlLiteral(extracted.bodyText)},
        ${sqlLiteral(extracted.contentHash)},
        ${chunkArraySql}
      );
    `);
    assert.match(persist, /^[0-9a-f-]{36}$/i);

    const bodyLen = Number(
      sql(
        `select length(body_text) from public.tenant_public_site_index_documents where id = '${persist}'`,
      ),
    );
    const chunkCount = Number(
      sql(
        `select count(*) from public.tenant_public_site_index_chunks where document_id = '${persist}'`,
      ),
    );
    assert.ok(bodyLen > 24000);
    assert.ok(bodyLen <= WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_PERSIST_BODY_MAX);
    assert.ok(chunkCount > 24);
    assert.ok(chunkCount <= WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_PERSIST_CHUNK_MAX);

    const hasA1 = sql(
      `select (body_text ilike '%pauses publiserte desk-annonser%')::text
       from public.tenant_public_site_index_documents where id = '${persist}'`,
    );
    const chunkHasA1 = sql(
      `select exists(
         select 1 from public.tenant_public_site_index_chunks
         where document_id = '${persist}'
           and content ilike '%pauses publiserte desk-annonser%'
       )::text`,
    );
    const chunkHasA2 = sql(
      `select exists(
         select 1 from public.tenant_public_site_index_chunks
         where document_id = '${persist}'
           and content ilike '%pause en publisert desk-annonse%'
       )::text`,
    );
    const isTrue = (v: string) => v === "t" || v === "true";
    assert.ok(isTrue(hasA1), `body A1 expected true, got ${hasA1}`);
    assert.ok(isTrue(chunkHasA1), `chunk A1 expected true, got ${chunkHasA1}`);
    assert.ok(isTrue(chunkHasA2), `chunk A2 expected true, got ${chunkHasA2}`);

    // Last allowed pair near cap still present when within extract budget
    const lastPairProbe = sql(
      `select exists(
         select 1 from public.tenant_public_site_index_chunks
         where document_id = '${persist}'
           and content ilike '%åpne den igjen senere%'
       )::text`,
    );
    assert.ok(isTrue(lastPairProbe), `late pair expected true, got ${lastPairProbe}`);

    // FTS / search returns chunk with answer prose (paraphrase + distinctive tokens)
    const searchHit = sql(`
      select chunk_content from public.search_tenant_public_site_index(
        '11111111-1111-4111-8111-111111111111'::uuid,
        'www.customer.example',
        'no',
        'Kan jeg pause en Desk Pass-annonse og aktivere den senere?',
        5
      ) limit 1;
    `);
    assert.match(searchHit, /pause en publisert desk-annonse|pauses publiserte desk-annonser/i);
    assert.doesNotMatch(searchHit, /^\+\s*Hva dekker Desk Pass/i);

    const answerTokenHit = sql(`
      select chunk_content from public.search_tenant_public_site_index(
        '11111111-1111-4111-8111-111111111111'::uuid,
        'www.customer.example',
        'no',
        'pauses publiserte desk-annonser aktiv tilgang',
        5
      ) limit 1;
    `);
    assert.match(
      answerTokenHit,
      /pauses publiserte desk-annonser|pause en publisert desk-annonse|aktiv tilgang/i,
    );
    assert.doesNotMatch(answerTokenHit, /^\+\s*Hva /);

    const pack = buildWebsiteKompisEvidencePack({
      question: "Kan jeg pause en Desk Pass-annonse og aktivere den senere?",
      locale: "no",
      siteIndexHits: [
        {
          documentId: persist,
          chunkId: "chunk-late",
          title: "FAQ — hjelp og svar",
          canonicalUrl: "https://www.customer.example/no/faq",
          pathname: "/no/faq",
          locale: "no",
          excerpt: searchHit.slice(0, 120),
          chunkContent: searchHit,
          score: 40,
          matchedReason: "public_site_index",
          crawledAt: null,
        },
      ],
    });
    assert.ok(
      pack.evidence.some((item) =>
        /pause en publisert desk-annonse|pauses publiserte desk-annonser/i.test(item.text),
      ),
    );

    // Idempotent replace (same hash) keeps one document
    const again = sql(`
      select set_config('request.jwt.claim.role', 'service_role', true);
      select public.replace_tenant_public_site_index_document(
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid,
        '11111111-1111-4111-8111-111111111111'::uuid,
        'www.customer.example',
        'https://www.customer.example/no/faq',
        '/no/faq',
        'no',
        ${sqlLiteral(extracted.title || "FAQ — hjelp og svar")},
        ${sqlLiteral(extracted.metaDescription || "Offentlige svar")},
        ${sqlLiteral(extracted.excerpt.slice(0, 420))},
        ${sqlLiteral(extracted.bodyText)},
        ${sqlLiteral(extracted.contentHash)},
        ${chunkArraySql}
      );
    `);
    assert.equal(again, persist);
    const docCount = sql(
      `select count(*) from public.tenant_public_site_index_documents
       where tenant_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
         and canonical_url = 'https://www.customer.example/no/faq'`,
    );
    assert.equal(docCount, "1");

    // Over-cap chunks: only first 48 persisted
    const overflowCount =
      WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_PERSIST_CHUNK_MAX + 5 - extracted.chunks.length;
    const padded = [
      ...extracted.chunks,
      ...Array.from({ length: Math.max(5, overflowCount) }, (_, i) =>
        `Extra overflow chunk ${i + 1} with enough public desk text to exceed the persist ceiling intentionally.`,
      ),
    ];
    assert.ok(padded.length > WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_PERSIST_CHUNK_MAX);
    const paddedSql = `array[${padded.map((c) => sqlLiteral(c)).join(",")}]::text[]`;
    const overCapDoc = sql(`
      select set_config('request.jwt.claim.role', 'service_role', true);
      select public.replace_tenant_public_site_index_document(
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid,
        '11111111-1111-4111-8111-111111111111'::uuid,
        'www.customer.example',
        'https://www.customer.example/no/faq',
        '/no/faq',
        'no',
        'FAQ',
        'desc',
        'excerpt',
        ${sqlLiteral(extracted.bodyText)},
        ${sqlLiteral(createHash("sha256").update("overcap").digest("hex"))},
        ${paddedSql}
      );
    `);
    const overCapCount = Number(
      sql(
        `select count(*) from public.tenant_public_site_index_chunks where document_id = '${overCapDoc}'`,
      ),
    );
    assert.equal(overCapCount, WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_PERSIST_CHUNK_MAX);

    // Ordinary page still indexable with small body (non-FAQ contract unchanged)
    const ordinary = sql(`
      select set_config('request.jwt.claim.role', 'service_role', true);
      select public.replace_tenant_public_site_index_document(
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid,
        '11111111-1111-4111-8111-111111111111'::uuid,
        'www.customer.example',
        'https://www.customer.example/no/about',
        '/no/about',
        'no',
        'Om oss',
        'Offentlig side',
        'Desk fellesskap',
        ${sqlLiteral("Offentlig desk-informasjon om NETTSTED_NAVN for besøkende. ".repeat(20))},
        ${sqlLiteral(createHash("sha256").update("about").digest("hex"))},
        array[${sqlLiteral(
          "Offentlig desk-informasjon om NETTSTED_NAVN for besøkende med nok tekst til chunk.",
        )}]::text[]
      );
    `);
    assert.match(ordinary, /^[0-9a-f-]{36}$/i);

    // Cross-tenant isolation
    const cross = sql(`
      select count(*) from public.search_tenant_public_site_index(
        '22222222-2222-4222-8222-222222222222'::uuid,
        'www.other.example',
        'no',
        'pause Desk Pass-annonse',
        5
      );
    `);
    assert.equal(cross, "0");

    console.log("faq-storage-contract.test.ts: passed");
  } finally {
    cleanup();
  }
}

main().catch((error) => {
  cleanup();
  console.error(error);
  process.exit(1);
});
