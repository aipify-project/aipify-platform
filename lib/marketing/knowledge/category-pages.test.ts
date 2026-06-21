import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  assertCategoryRegistryComplete,
  getAllCategoryRegistryEntries,
  getCategoryRegistryEntry,
  PUBLIC_KNOWLEDGE_CATEGORY_REGISTRY,
} from "./category-registry";
import { PUBLIC_KNOWLEDGE_CATEGORIES } from "./types";
import { getArticlesByCategory } from "./registry";

const ROOT = join(import.meta.dirname, "..", "..", "..");
const LOCALES = ["en", "no", "sv", "da"] as const;

const REQUIRED_CATEGORY_KEYS = [
  "name",
  "description",
  "headline",
  "introduction",
  "topics",
  "seo",
  "cta",
] as const;

const REQUIRED_TOPIC_SHAPE = ["title", "description"] as const;
const REQUIRED_SEO_SHAPE = ["title", "description"] as const;
const REQUIRED_CTA_SHAPE = ["primary", "secondary", "primaryHref", "secondaryHref"] as const;

// 1. All 12 slugs resolve via static params contract
assert.equal(PUBLIC_KNOWLEDGE_CATEGORIES.length, 12);
for (const slug of PUBLIC_KNOWLEDGE_CATEGORIES) {
  assert.ok(getCategoryRegistryEntry(slug), `registry entry missing for ${slug}`);
}

// 2. Registry complete — one entry per canonical slug
assertCategoryRegistryComplete();
assert.equal(PUBLIC_KNOWLEDGE_CATEGORY_REGISTRY.length, 12);

// 3. Registry fields valid
for (const entry of getAllCategoryRegistryEntries()) {
  assert.ok(entry.topicIds.length >= 3 && entry.topicIds.length <= 5, `${entry.id} topic count`);
  assert.equal(entry.relatedCategoryIds.length, 3, `${entry.id} related categories`);
  assert.ok(entry.featuredArticleSlugs.length <= 3, `${entry.id} featured slugs`);
  assert.ok(entry.ctaPrimaryHref.startsWith("/"), `${entry.id} primary href`);
  assert.ok(entry.ctaSecondaryHref.startsWith("/"), `${entry.id} secondary href`);

  for (const slug of entry.featuredArticleSlugs) {
    const meta = getArticlesByCategory(entry.id).find((a) => a.slug === slug);
    assert.ok(meta, `${entry.id} featured slug ${slug} must belong to category`);
  }

  for (const relatedId of entry.relatedCategoryIds) {
    assert.ok(
      PUBLIC_KNOWLEDGE_CATEGORIES.includes(relatedId),
      `${entry.id} related category ${relatedId} invalid`
    );
  }
}

// 4. No unknown params — registry ids match canonical list exactly
const registryIdSet = new Set(PUBLIC_KNOWLEDGE_CATEGORY_REGISTRY.map((e) => e.id));
for (const id of PUBLIC_KNOWLEDGE_CATEGORIES) {
  assert.ok(registryIdSet.has(id), `canonical slug ${id} not in registry`);
}
assert.equal(registryIdSet.size, PUBLIC_KNOWLEDGE_CATEGORIES.length);

// 5. i18n keys exist in en/no/sv/da for all categories
for (const locale of LOCALES) {
  const marketing = JSON.parse(readFileSync(join(ROOT, "locales", locale, "marketing.json"), "utf8"));
  const publicKnowledge = marketing.publicKnowledge as Record<string, unknown>;
  assert.ok(publicKnowledge?.categoryPage, `${locale} missing publicKnowledge.categoryPage`);

  const categories = (publicKnowledge.categories ?? {}) as Record<string, Record<string, unknown>>;
  for (const slug of PUBLIC_KNOWLEDGE_CATEGORIES) {
    const block = categories[slug];
    assert.ok(block, `${locale} missing category block: ${slug}`);

    for (const key of REQUIRED_CATEGORY_KEYS) {
      assert.ok(block[key], `${locale}.${slug} missing ${key}`);
    }

    const registry = getCategoryRegistryEntry(slug)!;
    const topics = block.topics as Record<string, Record<string, string>>;
    for (const topicId of registry.topicIds) {
      assert.ok(topics?.[topicId], `${locale}.${slug} missing topic ${topicId}`);
      for (const field of REQUIRED_TOPIC_SHAPE) {
        assert.ok(topics[topicId][field], `${locale}.${slug}.topics.${topicId}.${field}`);
      }
    }

    const seo = block.seo as Record<string, string>;
    for (const field of REQUIRED_SEO_SHAPE) {
      assert.ok(seo?.[field], `${locale}.${slug}.seo.${field}`);
    }

    const cta = block.cta as Record<string, string>;
    for (const field of REQUIRED_CTA_SHAPE) {
      assert.ok(cta?.[field], `${locale}.${slug}.cta.${field}`);
    }
  }

  const hub = publicKnowledge.hub as Record<string, string>;
  assert.match(hub.viewCategory ?? "", /→/u, `${locale} hub.viewCategory should include arrow`);
}

// 6. Card hrefs canonical — /knowledge/{id}
for (const id of PUBLIC_KNOWLEDGE_CATEGORIES) {
  const canonicalHref = `/knowledge/${id}`;
  assert.equal(canonicalHref, `/knowledge/${id}`);
  assert.doesNotMatch(canonicalHref, /\/knowledge\/category\//);
}

console.log("category-pages.test.ts: all assertions passed");
