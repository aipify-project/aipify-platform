import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  MARKETING_BUSINESS_PACK_REGISTRY,
  MARKETING_BUSINESS_PACK_SLUGS,
} from "../business-packs/registry";
import {
  getAllArticleSlugs,
  PUBLIC_KNOWLEDGE_ARTICLE_REGISTRY,
} from "./registry";
import { PUBLIC_BUSINESS_PACK_SLUGS, PUBLIC_KNOWLEDGE_INDUSTRIES } from "./types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const LOCALES = ["en", "no", "sv", "da"] as const;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

function loadMarketing(locale: string): Record<string, unknown> {
  const filePath = path.join(ROOT, "locales", locale, "marketing.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
}

function publicKnowledge(marketing: Record<string, unknown>) {
  return (marketing.publicKnowledge ?? {}) as Record<string, unknown>;
}

test("six industry slugs resolve in registry and industryDetails i18n", () => {
  const en = loadMarketing("en");
  const details = (publicKnowledge(en).industryDetails ?? {}) as Record<string, { headline?: string }>;

  assert.equal(PUBLIC_KNOWLEDGE_INDUSTRIES.length, 6);
  for (const industryId of PUBLIC_KNOWLEDGE_INDUSTRIES) {
    assert.ok(details[industryId]?.headline, `missing industryDetails.${industryId} in en`);
  }
});

test("four KC business pack card slugs use canonical hrefs", () => {
  assert.deepEqual([...PUBLIC_BUSINESS_PACK_SLUGS], ["hosts", "support", "warehouse", "finance"]);

  for (const slug of PUBLIC_BUSINESS_PACK_SLUGS) {
    const href = `/business-packs/${slug}`;
    assert.match(href, /^\/business-packs\/(hosts|support|warehouse|finance)$/);
  }
});

test("warehouse pack is in marketing business pack registry", () => {
  assert.ok(MARKETING_BUSINESS_PACK_SLUGS.includes("warehouse"));
  const entry = MARKETING_BUSINESS_PACK_REGISTRY.find((e) => e.slug === "warehouse");
  assert.ok(entry);
  assert.equal(entry?.detailHref, "/business-packs/warehouse");
});

test("nineteen article slugs in registry with i18n keys in all core locales", () => {
  const registrySlugs = getAllArticleSlugs();
  assert.equal(registrySlugs.length, 19);
  assert.equal(PUBLIC_KNOWLEDGE_ARTICLE_REGISTRY.length, 19);

  for (const locale of LOCALES) {
    const marketing = loadMarketing(locale);
    const articles = (publicKnowledge(marketing).articles ?? {}) as Record<
      string,
      {
        title?: string;
        keyTakeaways?: Record<string, string>;
        readingTime?: string;
        publishedDate?: string;
        sections?: unknown[];
      }
    >;

    for (const slug of registrySlugs) {
      const article = articles[slug];
      assert.ok(article?.title, `${locale}: missing publicKnowledge.articles.${slug}.title`);
      assert.ok(article.readingTime, `${locale}: missing readingTime for ${slug}`);
      assert.ok(article.publishedDate, `${locale}: missing publishedDate for ${slug}`);
      assert.ok(
        article.keyTakeaways && Object.keys(article.keyTakeaways).length >= 3,
        `${locale}: missing keyTakeaways for ${slug}`,
      );
      assert.ok(
        Array.isArray(article.sections) && article.sections.length >= 3,
        `${locale}: insufficient sections for ${slug}`,
      );
    }
  }
});

test("no duplicate article registries — single canonical registry export", () => {
  const registryPath = path.join(__dirname, "registry.ts");
  const source = fs.readFileSync(registryPath, "utf8");
  const registryExports = (source.match(/export const PUBLIC_KNOWLEDGE_ARTICLE_REGISTRY/g) ?? []).length;
  assert.equal(registryExports, 1, "PUBLIC_KNOWLEDGE_ARTICLE_REGISTRY must be defined once");

  const duplicateArticleArrays = (source.match(/PublicKnowledgeArticleMeta\[\]\s*=\s*\[/g) ?? []).length;
  assert.equal(duplicateArticleArrays, 1, "article registry array must not be duplicated in registry.ts");
});

test("KC business pack names use canonical marketing names in en", () => {
  const en = loadMarketing("en");
  const packs = (publicKnowledge(en).businessPacks ?? {}) as Record<string, { name?: string }>;
  assert.equal(packs.hosts?.name, "Aipify Hosts");
  assert.equal(packs.support?.name, "Aipify Support");
  assert.equal(packs.finance?.name, "Aipify Finance");
  assert.equal(packs.warehouse?.name, "Warehouse Operations Pack");
});

console.log("\nAll knowledge route tests passed.");
