#!/usr/bin/env node
/**
 * Verify canonical Self Love Knowledge Center articles and retrieval confidence.
 * Usage: npx tsx scripts/verify-kc-canonical-articles.ts
 */
import fs from "node:fs";
import path from "node:path";
import { loadSeedKnowledgeArticles } from "../lib/aipify/knowledge/import-seed";

const CANONICAL_SOURCE_PATHS = [
  "content/knowledge/aipify/self-love-engine/articles/what-is-self-love-in-aipify.md",
  "content/knowledge/aipify/abos/articles/understanding-self-love.md",
  "content/knowledge/aipify/self-love-engine/faq/self-love-engine-faq.md",
];

const TEST_QUERIES = ["selflove", "self love", "Self Love", "hva er selflove"];

function loadLocalArticles() {
  const articles = loadSeedKnowledgeArticles();
  return CANONICAL_SOURCE_PATHS.map((sourcePath) => {
    const article = articles.find((entry) => entry.source_path === sourcePath);
    return { sourcePath, article };
  });
}

async function queryRemote(sql: string) {
  const projectRef =
    process.env.SUPABASE_PROJECT_REF ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1];
  const token = process.env.SUPABASE_ACCESS_TOKEN || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!projectRef || !token) return null;

  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  if (!response.ok) {
    console.error("Remote query failed:", await response.text());
    return null;
  }
  return response.json();
}

async function main() {
  const local = loadLocalArticles();
  console.log("LOCAL SEED PARSE STATUS");
  for (const row of local) {
    console.log(
      JSON.stringify({
        source_path: row.sourcePath,
        present_locally: fs.existsSync(path.join(process.cwd(), row.sourcePath)),
        parsed: Boolean(row.article),
        slug: row.article?.slug ?? null,
        title: row.article?.title ?? null,
        language: row.article?.language ?? null,
        status: row.article?.status ?? null,
      }),
    );
  }

  const sql = `
    select
      a.source_path,
      a.slug,
      a.title,
      a.language,
      a.status,
      a.version,
      a.published_at as effective_date,
      (a.search_vector is not null) as search_vector_populated
    from public.aipify_knowledge_articles a
    where a.source_path = any(array[
      'content/knowledge/aipify/self-love-engine/articles/what-is-self-love-in-aipify.md',
      'content/knowledge/aipify/abos/articles/understanding-self-love.md',
      'content/knowledge/aipify/self-love-engine/faq/self-love-engine-faq.md'
    ])
    order by a.source_path, a.language;
  `;

  const remoteRows = await queryRemote(sql);
  console.log("\nPRODUCTION KC STATUS");
  if (!remoteRows) {
    console.log("Remote verification skipped — set SUPABASE_ACCESS_TOKEN and project ref.");
  } else {
    console.log(JSON.stringify(remoteRows, null, 2));
    for (const query of TEST_QUERIES) {
      const escaped = query.replace(/'/g, "''");
      const confidenceSql = `
        select '${escaped}' as query,
               coalesce((public.search_knowledge_articles('${escaped}', 'no', 'authenticated', 1)->0->>'score')::numeric, 0) as score;
      `;
      const confidence = await queryRemote(confidenceSql);
      console.log("CONFIDENCE", JSON.stringify(confidence));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
