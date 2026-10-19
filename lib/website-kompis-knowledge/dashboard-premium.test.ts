import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const page = fs.readFileSync(path.join(root, "app/app/website-kompis/page.tsx"), "utf8");
const view = fs.readFileSync(
  path.join(root, "components/app/website-kompis/WebsiteKompisDashboardPremium.tsx"),
  "utf8",
);

assert.match(page, /getWebsiteKompisAnswerFeedbackOverview/);
assert.match(page, /loadWebsiteKompisKnowledgeSummary/);
assert.match(page, /loadWebsiteKompisConnectionSummary/);
assert.match(page, /kompisWebQa/);
assert.match(page, /kompisWebFaq/);
assert.match(page, /kompisWebConnection/);
assert.match(page, /kompisWebAppearance/);
assert.match(page, /kompisWebModules/);
assert.match(view, /kompis_mascot_premium_v2\.png/);
assert.match(view, /kompis_hero_glow_premium_v2\.png/);
assert.match(view, /maskImage/);
assert.match(view, /radial-gradient/);
assert.doesNotMatch(page + view, /AI-assistent|AI assistant|\+12%|\+23%/);
assert.match(page, /needsReview \?\? overview\.totals\.notHelpful/);
assert.doesNotMatch(page, /feedbackNeedsReview/);
assert.match(page, /knowledgeWindowNote/);
assert.match(page, /hintReviewUnseparated/);
assert.match(view, /lg:grid-cols-3/);
assert.match(view, /tabular-nums/);
assert.match(page, /aggregate === "active"/);

console.log("dashboard-premium.test.ts: ok");
