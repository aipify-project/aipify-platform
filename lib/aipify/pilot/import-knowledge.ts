import "server-only";

import fs from "node:fs";
import path from "node:path";

export type TenantSeedArticle = {
  title: string;
  slug: string;
  category: string;
  language: string;
  visibility: string;
  status: string;
  tags?: string[];
  keywords?: string[];
  article_type?: string;
  body: string;
  source_path: string;
};

function parseFrontmatterBlock(block: string): Record<string, string | string[] | number> {
  const result: Record<string, string | string[] | number> = {};
  for (const line of block.split("\n")) {
    const match = line.match(/^([\w_]+):\s*(.+)$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      result[key] = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      value = value.replace(/^["']|["']$/g, "");
      result[key] = key === "priority" ? Number(value) : value;
    }
  }
  return result;
}

function parseSeedFileContent(content: string, sourcePath: string): TenantSeedArticle[] {
  const articles: TenantSeedArticle[] = [];
  const parts = content.split(/\n---\n/).filter(Boolean);

  for (let i = 0; i < parts.length; i += 2) {
    const fmBlock = parts[i]?.trim();
    const body = parts[i + 1]?.trim() ?? "";
    if (!fmBlock || !fmBlock.includes("title:")) continue;
    const fm = parseFrontmatterBlock(fmBlock);
    if (!fm.title || !fm.slug) continue;
    articles.push({
      title: String(fm.title),
      slug: String(fm.slug),
      category: String(fm.category ?? "faq"),
      language: String(fm.language ?? "en"),
      visibility: String(fm.visibility ?? "authenticated"),
      status: String(fm.status ?? "published"),
      tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
      keywords: Array.isArray(fm.keywords) ? fm.keywords.map(String) : [],
      article_type: String(fm.article_type ?? "faq"),
      body,
      source_path: sourcePath,
    });
  }

  return articles;
}

export function loadTenantSeedKnowledgeArticles(
  tenantSlug: string,
  rootDir?: string
): TenantSeedArticle[] {
  const base = rootDir ?? path.join(process.cwd(), "content/knowledge", tenantSlug);
  if (!fs.existsSync(base)) return [];

  const articles: TenantSeedArticle[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".md")) {
        articles.push(...parseSeedFileContent(fs.readFileSync(full, "utf8"), full));
      }
    }
  };
  walk(base);
  return articles;
}

export function tenantSeedArticlesToRpcPayload(articles: TenantSeedArticle[]) {
  return articles.map((a) => ({
    title: a.title,
    slug: a.slug,
    category: a.category,
    language: a.language,
    visibility: a.visibility,
    status: a.status,
    article_type: a.article_type,
    body: a.body,
    source_path: a.source_path,
    tags: a.tags ?? [],
    keywords: a.keywords ?? [],
  }));
}
