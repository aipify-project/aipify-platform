/**
 * Owner QA checklist (28.11.2026 screenshots): English public sales page must show Buddy Web.
 * Nordic locales keep Kompis Web. English fallbacks in labels.ts must not reintroduce Kompis Web.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import daMarketing from "../../../locales/da/marketing.json";
import enMarketing from "../../../locales/en/marketing.json";
import noMarketing from "../../../locales/no/marketing.json";
import svMarketing from "../../../locales/sv/marketing.json";
import { parseKompisWebSalesLabels } from "./labels";
import { buildKompisWebSalesMetadata } from "./sales-metadata";

const en = parseKompisWebSalesLabels(enMarketing as Record<string, unknown>);
const no = parseKompisWebSalesLabels(noMarketing as Record<string, unknown>);
const sv = parseKompisWebSalesLabels(svMarketing as Record<string, unknown>);
const da = parseKompisWebSalesLabels(daMarketing as Record<string, unknown>);

/** Owner screenshot checklist — EN surface. */
assert.equal(en.hero.eyebrow, "Aipify Buddy Web");
assert.match(en.hero.subtitle, /^Buddy Web answers/);
assert.doesNotMatch(en.hero.subtitle, /Kompis Web/);
assert.match(en.signupCard.continueHint, /Buddy Web/);
assert.doesNotMatch(en.signupCard.continueHint, /Kompis Web/);
assert.equal(en.demo.title, "See Buddy Web in context");
assert.match(en.pricing.subtitle, /Buddy Web/);
assert.match(en.pricing.plannedNote, /Buddy Web/);
assert.ok(en.pricing.pro.features.some((f) => /Buddy Web/.test(f)));
assert.ok(
  en.faq.items.some((i) => i.question === "Where do I get Buddy Web?"),
  "FAQ must ask Where do I get Buddy Web?",
);
assert.ok(
  en.faq.items.some((i) => /What does Buddy use for answers/.test(i.question)),
  "FAQ assistant name Buddy must remain",
);

const enSurface = JSON.stringify({
  hero: en.hero,
  signupCard: en.signupCard,
  demo: en.demo,
  pricing: en.pricing,
  faq: en.faq,
  benefits: en.benefits,
  start: en.start,
  meta: en.meta,
});
assert.doesNotMatch(enSurface, /Kompis Web/, "no customer-visible Kompis Web on EN sales labels");
assert.match(enSurface, /Buddy Web/);

const enMeta = buildKompisWebSalesMetadata(en, "/", "en");
assert.equal(enMeta.title, "Aipify works for you | Buddy Web");
assert.doesNotMatch(String(enMeta.description ?? ""), /Kompis Web/);

/** Empty marketing object → English Buddy fallbacks (never Kompis Web). */
let threw = false;
try {
  parseKompisWebSalesLabels({});
} catch {
  threw = true; // missing required benefit/how/faq arrays is expected
}
assert.equal(threw, true);
const labelsSrc = readFileSync(join(process.cwd(), "lib/marketing/kompis-web-sales/labels.ts"), "utf8");
assert.doesNotMatch(labelsSrc, /"Aipify Kompis Web"/);
assert.doesNotMatch(labelsSrc, /"See Kompis Web in context"/);
assert.doesNotMatch(labelsSrc, /Owner-decided Kompis Web/);
assert.doesNotMatch(labelsSrc, /Start free \| Kompis Web/);
assert.match(labelsSrc, /Aipify Buddy Web/);
assert.match(labelsSrc, /See Buddy Web in context/);

/** Nordic regression. */
assert.match(no.hero.eyebrow, /Kompis Web/);
assert.match(no.hero.subtitle, /Kompis Web/);
assert.equal(no.demo.title, "Se Kompis Web i kontekst");
assert.match(no.pricing.subtitle, /Kompis Web/);
assert.ok(no.faq.items.some((i) => /Kompis Web/.test(i.question)));
assert.doesNotMatch(JSON.stringify(no.hero) + JSON.stringify(no.demo) + JSON.stringify(no.pricing), /\bBuddy Web\b/);

assert.match(sv.hero.eyebrow, /Kompis Web/);
assert.doesNotMatch(JSON.stringify(sv.hero), /\bBuddy Web\b/);
assert.match(da.hero.eyebrow, /Kompis Web/);
assert.doesNotMatch(JSON.stringify(da.hero), /\bBuddy Web\b/);

const noMeta = buildKompisWebSalesMetadata(no, "/", "no");
assert.equal(noMeta.title, "Aipify works for you | Kompis Web");

/** Top-level marketing SEO keys for EN. */
const enRoot = enMarketing as {
  meta?: { kompisWebTitle?: string; kompisWebDescription?: string };
};
assert.match(String(enRoot.meta?.kompisWebTitle ?? ""), /Buddy Web/);
assert.doesNotMatch(String(enRoot.meta?.kompisWebTitle ?? ""), /Kompis Web/);
assert.match(String(enRoot.meta?.kompisWebDescription ?? ""), /Buddy Web/);

console.log("english-buddy-web-sales-name: PASS", "en=Buddy Web", "no/sv/da=Kompis Web");
