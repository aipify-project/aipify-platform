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

const root = buildKompisWebSalesMetadata(labels, "/", "en");
assert.equal(root.title, KOMPIS_WEB_SALES_BROWSER_TITLE);
assert.equal(root.title, "Aipify works for you | Buddy Web");
assert.equal(buildKompisWebSalesMetadata(labels, "/", "no").title, "Aipify works for you | Kompis Web");
assert.equal(root.alternates?.canonical, KOMPIS_WEB_SALES_CANONICAL_URL);
assert.ok(String(root.title).includes("Aipify works for you"));
assert.equal(
  typeof root.twitter === "object" && root.twitter && "title" in root.twitter
    ? root.twitter.title
    : null,
  "Aipify works for you",
);

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
for (const path of ["/kompis-web", "/book-demo"]) {
  const rule = MARKETING_PUBLIC_REDIRECTS.find((r) => r.source === path);
  assert.equal(rule?.destination, "/");
  assert.equal(rule?.permanent, true);
}
const contactRule = MARKETING_PUBLIC_REDIRECTS.find((r) => r.source === "/contact");
assert.equal(contactRule?.destination, "/contact/support");
assert.equal(contactRule?.permanent, true);
assert.equal(labels.hrefs.contact, "/contact/support");
assert.equal(labels.hrefs.becomeSeller, "/growth-partners#apply");
assert.equal(labels.hrefs.growthPartners, "/growth-partners");
assert.equal(labels.growthPartners.cta, "Become a seller");
assert.equal(labels.growthPartners.learnMore, "Learn about Growth Partners");
assert.notEqual(labels.growthPartners.cta, labels.growthPartners.learnMore);

console.log("kompis-web-sales sales-route metadata: PASS");
