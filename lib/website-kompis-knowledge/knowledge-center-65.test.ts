/**
 * Job 65 — Kompis Web Knowledge Center source governance contract.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  KNOWLEDGE_CENTER_UNSUPPORTED_WITHOUT_MIGRATION,
  summarizeFaqItems,
  WEBSITE_KOMPIS_KNOWLEDGE_CENTER_VERSION,
  WEBSITE_KOMPIS_KNOWLEDGE_SOURCE_INVENTORY,
} from "@/lib/website-kompis-knowledge/source-inventory";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";

const ROOT = process.cwd();

assert.equal(FOUNDATION_NAV_BINDINGS.kompisWebFaq, "/app/website-kompis/faq");
assert.equal(WEBSITE_KOMPIS_KNOWLEDGE_CENTER_VERSION, "65.1");

const byId = Object.fromEntries(
  WEBSITE_KOMPIS_KNOWLEDGE_SOURCE_INVENTORY.map((row) => [row.id, row]),
);
assert.equal(byId.faq.capability, "full_app_read_write");
assert.equal(byId.public_pages.capability, "unavailable_needs_list_rpc");
assert.equal(byId.public_documents.capability, "unavailable_not_in_product");
assert.equal(byId.answer_feedback.capability, "app_read_signals_only");
assert.ok(byId.faq.usedByFrozenRuntime);
assert.ok(byId.public_pages.usedByFrozenRuntime);
assert.equal(byId.public_documents.usedByFrozenRuntime, false);
assert.ok(
  KNOWLEDGE_CENTER_UNSUPPORTED_WITHOUT_MIGRATION.includes(
    "list_tenant_public_site_index_pages_for_app",
  ),
);
assert.ok(
  KNOWLEDGE_CENTER_UNSUPPORTED_WITHOUT_MIGRATION.includes(
    "website_kompis_public_document_upload_pipeline",
  ),
);
assert.ok(KNOWLEDGE_CENTER_UNSUPPORTED_WITHOUT_MIGRATION.includes("unanswered_question_inbox"));

assert.deepEqual(
  summarizeFaqItems([
    { status: "published", updatedAt: "2026-04-01T10:00:00.000Z" },
    { status: "draft", updatedAt: "2026-04-02T10:00:00.000Z" },
    { status: "draft", publishedAt: null },
    { status: "archived", updatedAt: "2026-03-01T10:00:00.000Z" },
  ]),
  {
    total: 4,
    published: 1,
    draft: 2,
    archived: 1,
    lastUpdatedAt: "2026-04-02T10:00:00.000Z",
  },
);

const faqPage = readFileSync(join(ROOT, "app/app/website-kompis/faq/page.tsx"), "utf8");
assert.match(faqPage, /WebsiteKompisKnowledgeCenterPanel/);
assert.match(faqPage, /loadWebsiteKompisKnowledgeSummary/);
assert.match(faqPage, /WebsiteKompisFaqAdminPanel/);
assert.match(faqPage, /embedded/);
assert.doesNotMatch(faqPage, /kompis-bedrift\/documents/i);

const hubPage = readFileSync(join(ROOT, "app/app/website-kompis/page.tsx"), "utf8");
assert.match(hubPage, /loadWebsiteKompisKnowledgeSummary/);
assert.match(hubPage, /dashboardTitle/);
assert.match(hubPage, /create=1/);
assert.match(hubPage, /section=pages/);

const panel = readFileSync(
  join(ROOT, "components/app/website-kompis/WebsiteKompisKnowledgeCenterPanel.tsx"),
  "utf8",
);
assert.match(faqPage, /AppHubShell/);
assert.doesNotMatch(faqPage, /suppressPageHeader/);
assert.match(panel, /overviewTitle/);
assert.match(panel, /hintPublished/);
assert.match(panel, /neverAutoPublish/);
assert.match(panel, /bedriftNotMixed/);
assert.match(panel, /followUp/);
assert.match(panel, /pagesUnavailableTitle/);
assert.match(panel, /documentsUnavailableTitle/);
assert.doesNotMatch(panel, /uploadDocument|drag.?and.?drop/i);

function flatten(value: unknown, prefix = ""): string[] {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
      flatten(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

const en = JSON.parse(readFileSync(join(ROOT, "locales/en/customer-app/core.json"), "utf8"))
  .websiteKompisKnowledge;
const enKeys = flatten(en).sort();
for (const locale of ["en", "no", "sv", "da", "pl", "uk"] as const) {
  const block = JSON.parse(
    readFileSync(join(ROOT, `locales/${locale}/customer-app/core.json`), "utf8"),
  ).websiteKompisKnowledge;
  assert.ok(block, `missing websiteKompisKnowledge in ${locale}`);
  assert.deepEqual(flatten(block).sort(), enKeys, `key parity ${locale}`);
}

console.log("knowledge-center-65.test.ts: OK");
