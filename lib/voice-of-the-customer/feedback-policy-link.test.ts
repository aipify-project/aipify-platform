import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CUSTOMER_FEEDBACK_POLICY_ARTICLE_PATH,
  CUSTOMER_FEEDBACK_POLICY_ARTICLE_SLUG,
} from "./constants";
import { getAllArticleSlugs } from "@/lib/marketing/knowledge/registry";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const LOCALES = ["en", "no", "sv", "da"] as const;

assert.equal(
  CUSTOMER_FEEDBACK_POLICY_ARTICLE_PATH,
  "/app/support/knowledge-center/articles/customer-feedback-and-product-improvement"
);
assert.notEqual(CUSTOMER_FEEDBACK_POLICY_ARTICLE_PATH, "/install");
assert.notEqual(CUSTOMER_FEEDBACK_POLICY_ARTICLE_PATH, "#");
assert.ok(getAllArticleSlugs().includes(CUSTOMER_FEEDBACK_POLICY_ARTICLE_SLUG));

const widgetSource = fs.readFileSync(
  path.join(ROOT, "components/app/voice-of-the-customer/ShareFeedbackWidget.tsx"),
  "utf8"
);
assert.match(widgetSource, /CUSTOMER_FEEDBACK_POLICY_ARTICLE_PATH/);
assert.doesNotMatch(widgetSource, /resolveAppHref\("\/app\/license"\)/);
assert.doesNotMatch(widgetSource, /href=["']#["']/);
assert.match(widgetSource, /target="_blank"/);
assert.match(widgetSource, /rel="noopener noreferrer"/);
assert.match(widgetSource, /trustStatementLinkAria/);

for (const locale of LOCALES) {
  const marketing = JSON.parse(
    fs.readFileSync(path.join(ROOT, `locales/${locale}/marketing.json`), "utf8")
  ) as { publicKnowledge?: { articles?: Record<string, { title?: string }> } };
  const article = marketing.publicKnowledge?.articles?.[CUSTOMER_FEEDBACK_POLICY_ARTICLE_SLUG];
  assert.ok(article?.title, `${locale}: missing feedback policy article title`);

  const nav = JSON.parse(
    fs.readFileSync(path.join(ROOT, `locales/${locale}/customer-app/navigation.json`), "utf8")
  ) as { voiceOfCustomer?: { trustStatementLinkAria?: string } };
  assert.ok(nav.voiceOfCustomer?.trustStatementLinkAria, `${locale}: missing aria label`);
}

console.log("feedback-policy-link.test.ts: all assertions passed");
