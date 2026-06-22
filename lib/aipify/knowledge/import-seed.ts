import "server-only";

import fs from "node:fs";
import path from "node:path";

export type SeedArticleFrontmatter = {
  title: string;
  slug: string;
  category: string;
  language: string;
  visibility: string;
  status: string;
  tags?: string[];
  keywords?: string[];
  priority?: number;
  article_type?: string;
};

export type ParsedSeedArticle = SeedArticleFrontmatter & {
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

function inferCategoryFromSourcePath(sourcePath: string): string {
  const segments = sourcePath.split("/");
  const aipifyIndex = segments.indexOf("aipify");
  if (aipifyIndex >= 0 && segments[aipifyIndex + 1]) {
    return segments[aipifyIndex + 1];
  }
  return "faq";
}

function inferKeywordsFromTitle(title: string, body: string): string[] {
  const keywords = new Set<string>();
  const normalizedTitle = title.trim();
  if (normalizedTitle) keywords.add(normalizedTitle.toLowerCase());
  if (/self love/i.test(`${title}\n${body}`)) {
    keywords.add("self love");
    keywords.add("selflove");
    keywords.add("Self Love");
  }
  return [...keywords];
}

function parsePlainMarkdownArticle(content: string, sourcePath: string): ParsedSeedArticle | null {
  const trimmed = content.trim();
  if (!trimmed || trimmed.startsWith("---")) return null;
  const titleMatch = trimmed.match(/^#\s+(.+)$/m);
  if (!titleMatch?.[1]) return null;

  const title = titleMatch[1].trim();
  const slug = path.basename(sourcePath, ".md");
  const body = trimmed.replace(/^#\s+.+\n+/, "").trim();
  const category = inferCategoryFromSourcePath(sourcePath);
  const articleType = sourcePath.includes("/faq/") ? "faq" : "guide";

  return {
    title,
    slug,
    category,
    language: "en",
    visibility: "authenticated",
    status: "published",
    tags: category.includes("self-love") ? ["self-love", "abos", "aipify"] : ["aipify"],
    keywords: inferKeywordsFromTitle(title, body),
    priority: 0,
    article_type: articleType,
    body,
    source_path: sourcePath,
  };
}

function parseSeedFileContent(content: string, sourcePath: string): ParsedSeedArticle[] {
  const articles: ParsedSeedArticle[] = [];
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
      priority: typeof fm.priority === "number" ? fm.priority : 0,
      article_type: String(fm.article_type ?? "faq"),
      body,
      source_path: sourcePath,
    });
  }

  if (articles.length === 0) {
    const plain = parsePlainMarkdownArticle(content, sourcePath);
    if (plain) articles.push(plain);
  }

  return articles;
}

export function loadSeedKnowledgeArticles(rootDir?: string): ParsedSeedArticle[] {
  const base =
    rootDir ??
    path.join(/* turbopackIgnore: true */ process.cwd(), "content/knowledge/aipify");
  if (!fs.existsSync(base)) return [];

  const articles: ParsedSeedArticle[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".md")) {
        const rel = path.relative(/* turbopackIgnore: true */ process.cwd(), full);
        articles.push(...parseSeedFileContent(fs.readFileSync(full, "utf8"), rel));
      }
    }
  };
  walk(base);
  return articles;
}
