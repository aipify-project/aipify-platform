import assert from "node:assert/strict";
import daMarketing from "../../../locales/da/marketing.json";
import enMarketing from "../../../locales/en/marketing.json";
import esMarketing from "../../../locales/es/marketing.json";
import noMarketing from "../../../locales/no/marketing.json";
import plMarketing from "../../../locales/pl/marketing.json";
import svMarketing from "../../../locales/sv/marketing.json";
import ukMarketing from "../../../locales/uk/marketing.json";
import { parseKompisWebSalesLabels } from "./labels";
import {
  KOMPIS_WEB_SALES_BROWSER_TITLE,
  buildKompisWebSalesMetadata,
} from "./sales-metadata";
import {
  kompisWebSalesHelperDisplayName,
  resolveKompisWebSalesLocale,
} from "./locale";

assert.equal(resolveKompisWebSalesLocale({ cookieLocale: null }), "en");
assert.equal(kompisWebSalesHelperDisplayName("no"), "Kompis");
assert.equal(kompisWebSalesHelperDisplayName("en"), "Buddy");
assert.equal(KOMPIS_WEB_SALES_BROWSER_TITLE, "Aipify works for you");

const BUDDY_LOCALES = new Set(["en", "es", "pl", "uk"]);

const localeBundles = [
  ["en", enMarketing],
  ["es", esMarketing],
  ["no", noMarketing],
  ["sv", svMarketing],
  ["da", daMarketing],
  ["pl", plMarketing],
  ["uk", ukMarketing],
] as const;

for (const [locale, marketing] of localeBundles) {
  const sales = (marketing as { kompisWebSales: Record<string, unknown> }).kompisWebSales;
  const labels = parseKompisWebSalesLabels(marketing as Record<string, unknown>);
  const salesJson = JSON.stringify(sales);
  const meta = buildKompisWebSalesMetadata(labels, "/");

  assert.equal(meta.title, "Aipify works for you", `${locale}: browser title locked`);
  assert.equal(
    typeof meta.openGraph === "object" && meta.openGraph && "title" in meta.openGraph
      ? meta.openGraph.title
      : null,
    "Aipify works for you",
  );

  const surface = [
    labels.meta.title,
    labels.meta.description,
    labels.hero.eyebrow,
    labels.hero.titleBefore,
    labels.hero.titleHighlight,
    labels.hero.subtitle,
    labels.hero.mascotAlt,
    labels.benefits.title,
    ...labels.benefits.items.flatMap((i) => [i.title, i.body]),
    labels.how.title,
    labels.how.intro,
    ...labels.how.steps.flatMap((i) => [i.title, i.body]),
    labels.demo.title,
    labels.demo.subtitle,
    labels.demo.widgetTitle,
    labels.demo.widgetReply,
    labels.pricing.title,
    labels.pricing.subtitle,
    labels.pricing.plannedNote,
    labels.pricing.asideBody,
    ...labels.pricing.free.features,
    ...labels.pricing.paid.features,
    labels.pricing.paid.checkoutUnavailable,
    ...labels.faq.items.flatMap((i) => [i.question, i.answer]),
    labels.finalCta.title,
    labels.finalCta.subtitle,
    labels.footer.tagline,
    labels.start.metaTitle,
    labels.start.metaDescription,
    labels.start.backHome,
    labels.start.successBody,
  ].join("\n");

  if (BUDDY_LOCALES.has(locale)) {
    assert.doesNotMatch(salesJson, /Kompis/, `${locale}: zero Kompis in sales JSON`);
    assert.doesNotMatch(surface, /Kompis/, `${locale}: zero Kompis in rendered sales labels`);
    assert.match(surface, /\bBuddy\b/, `${locale}: Buddy present`);
    if (locale === "en") {
      assert.match(surface, /Buddy Web/, "en: Buddy Web product display name");
      assert.doesNotMatch(surface, /Owner-decided|billing gate|catalog/i, "en: no technical residue");
    }
  } else {
    assert.match(surface, /\bKompis\b/, `${locale}: Kompis assistant/product present`);
    assert.doesNotMatch(surface, /\bBuddy\b/, `${locale}: no Buddy`);
    assert.match(salesJson, /Kompis Web/, `${locale}: keeps Kompis Web product name`);
  }

  assert.doesNotMatch(
    `${labels.hero.secondaryCta} ${labels.finalCta.secondary} ${labels.pricing.paid.cta}`,
    /book\s*demo/i,
  );
}

console.log("kompis-web-sales locale policy: PASS (Buddy Web EN surface)");
