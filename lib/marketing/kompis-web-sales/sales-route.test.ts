import assert from "node:assert/strict";
import {
  buildKompisWebSalesMetadata,
  buildKompisWebStartMetadata,
  KOMPIS_WEB_SALES_BROWSER_TITLE,
  KOMPIS_WEB_SALES_CANONICAL_URL,
} from "./sales-metadata";
import { parseKompisWebSalesLabels } from "./labels";
import enMarketing from "../../../locales/en/marketing.json";
import { MARKETING_PUBLIC_REDIRECTS } from "@/lib/marketing/public-redirects";

const labels = parseKompisWebSalesLabels(enMarketing as Record<string, unknown>);

const root = buildKompisWebSalesMetadata(labels, "/");
assert.equal(root.title, KOMPIS_WEB_SALES_BROWSER_TITLE);
assert.equal(root.title, "Aipify works for you");
assert.doesNotMatch(String(root.title), /Kompis/i);
assert.equal(root.alternates?.canonical, KOMPIS_WEB_SALES_CANONICAL_URL);
assert.equal(
  typeof root.openGraph === "object" && root.openGraph && "title" in root.openGraph
    ? root.openGraph.title
    : null,
  "Aipify works for you",
);
assert.equal(
  typeof root.twitter === "object" && root.twitter && "title" in root.twitter
    ? root.twitter.title
    : null,
  "Aipify works for you",
);
assert.doesNotMatch(labels.hero.eyebrow + labels.hero.subtitle + labels.demo.title, /Kompis/);
assert.match(labels.hero.eyebrow, /Buddy Web/);

const startMeta = buildKompisWebStartMetadata(labels);
assert.equal(
  typeof startMeta.robots === "object" && startMeta.robots && "index" in startMeta.robots
    ? startMeta.robots.index
    : null,
  false,
);

assert.equal(labels.hrefs.start, "/start");
assert.equal(labels.hrefs.contactMailto, "mailto:hello@aipify.ai");
assert.equal(labels.hrefs.faq, "/#faq");
assert.doesNotMatch(labels.pricing.paid.cta, /book demo/i);
assert.doesNotMatch(labels.finalCta.secondary, /book demo/i);
assert.doesNotMatch(labels.hero.secondaryCta, /book demo/i);

const sources = MARKETING_PUBLIC_REDIRECTS.map((r) => r.source);
assert.ok(sources.includes("/kompis-web"));
assert.ok(sources.includes("/book-demo"));
assert.ok(sources.includes("/contact"));
for (const path of ["/kompis-web", "/book-demo", "/contact"]) {
  const rule = MARKETING_PUBLIC_REDIRECTS.find((r) => r.source === path);
  assert.equal(rule?.destination, "/");
  assert.equal(rule?.permanent, true);
}

console.log("kompis-web-sales sales-route metadata: PASS");
