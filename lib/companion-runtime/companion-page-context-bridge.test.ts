import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isPlatformProductKnowledgeQuery } from "@/lib/companion-platform-knowledge/platform-product-foundation";
import { searchPlatformKnowledge } from "@/lib/companion-platform-knowledge/search";
import { buildCompanionExperienceLabels } from "@/lib/app/companion/labels";
import { createTranslator } from "@/lib/i18n/translate";
import {
  buildAppCompanionSubmitPageContext,
  sanitizeCompanionSubmitPageContext,
} from "./companion-submit-page-context";
import {
  resolveAppPageCorpusArticleId,
  tryBuildAppPageContextSearchResult,
} from "./app-companion-page-context";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const clientSource = fs.readFileSync(
  path.join(root, "lib/app/companion/chat-queue/client.ts"),
  "utf8",
);
const enqueueRouteSource = fs.readFileSync(
  path.join(root, "app/api/aipify/companion/chat/enqueue/route.ts"),
  "utf8",
);

function loadCompanionPlatformKnowledgeSplit(locale: string) {
  const file = path.join(root, "locales", locale, "customer-app", "companionPlatformKnowledge.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, unknown>;
}

const dict = {
  customerApp: loadCompanionPlatformKnowledgeSplit("no"),
};
const t = createTranslator(dict);
const labels = buildCompanionExperienceLabels(t);

assert.equal(
  resolveAppPageCorpusArticleId("/app/support"),
  "knowledge-center",
  "support page maps to knowledge-center corpus",
);

const appPageContext = buildAppCompanionSubmitPageContext("/app/support", {
  document: {
    title: "Support | Aipify",
    querySelector: () => null,
  },
});
assert.equal(appPageContext?.surface, "app");
assert.equal(appPageContext?.pathname, "/app/support");

const pageContextAnswer = tryBuildAppPageContextSearchResult({
  question: "Hva handler denne siden om?",
  pageContext: appPageContext,
  t,
  labels,
  userRole: "owner",
});
assert.ok(pageContextAnswer, "APP page-context question should resolve on mapped support page");
assert.equal(pageContextAnswer?.matchedArticleId, "knowledge-center");

const solutionsQuery = "Hvilken løsninger har dere?";
assert.equal(isPlatformProductKnowledgeQuery(solutionsQuery), true);
assert.equal(
  tryBuildAppPageContextSearchResult({
    question: solutionsQuery,
    pageContext: appPageContext,
    t,
    labels,
    userRole: "owner",
  }),
  null,
  "core capability question must not use APP page context",
);

assert.throws(() =>
  sanitizeCompanionSubmitPageContext({
    pathname: "/app/support",
    pageHtml: "<p>unsafe</p>",
  }),
);

assert.match(clientSource, /page_context:\s*input\.pageContext/);
assert.match(enqueueRouteSource, /sanitizeCompanionSubmitPageContext/);
assert.match(enqueueRouteSource, /pageContext,/);

void (async () => {
  const coreResult = await searchPlatformKnowledge(solutionsQuery, {
    t,
    locale: "no",
    ctx: { userRole: "owner", locale: "no" },
    getSearchTermsArray: (key: string) => {
      const pathParts = key.replace(/^customerApp\./, "").split(".");
      let current: unknown = dict.customerApp;
      for (const part of pathParts) {
        if (!current || typeof current !== "object") return [];
        current = (current as Record<string, unknown>)[part];
      }
      return Array.isArray(current) ? current.map(String) : [];
    },
    companionSurface: true,
  });
  assert.equal(coreResult.answer.sourceId, "aipify-capabilities");
  assert.notEqual(coreResult.answer.sourceId, "member.search");
  assert.notEqual(coreResult.answer.sourceId, "organization-intelligence-gap");
  console.log("ok companion-page-context-bridge");
})();
