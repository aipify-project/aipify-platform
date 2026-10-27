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
  kompisWebSalesHelperDisplayName,
  resolveKompisWebSalesLocale,
} from "./locale";

assert.equal(resolveKompisWebSalesLocale({ cookieLocale: null }), "en");
assert.equal(resolveKompisWebSalesLocale({ cookieLocale: undefined }), "en");
assert.equal(resolveKompisWebSalesLocale({ cookieLocale: "no" }), "no");
assert.equal(resolveKompisWebSalesLocale({ cookieLocale: "sv" }), "sv");
assert.equal(resolveKompisWebSalesLocale({ cookieLocale: "xx" }), "en");

assert.equal(kompisWebSalesHelperDisplayName("no"), "Kompis");
assert.equal(kompisWebSalesHelperDisplayName("sv"), "Kompis");
assert.equal(kompisWebSalesHelperDisplayName("da"), "Kompis");
assert.equal(kompisWebSalesHelperDisplayName("en"), "Buddy");
assert.equal(kompisWebSalesHelperDisplayName("es"), "Buddy");
assert.equal(kompisWebSalesHelperDisplayName("pl"), "Buddy");
assert.equal(kompisWebSalesHelperDisplayName("uk"), "Buddy");

const NORDIC = new Set(["no", "sv", "da"]);
const BUDDY = new Set(["en", "es", "pl", "uk"]);

/** Nordic locales keep helper name Kompis; EN/ES/PL/UK use Buddy (product name Kompis Web stays). */
function helperNameLeak(locale: string, sales: unknown): string[] {
  const blob = JSON.stringify(sales);
  const protectedBlob = blob
    .replaceAll("Kompis Web", "«PW»")
    .replaceAll("Kompis Bedrift", "«PB»");
  const leaks: string[] = [];
  if (NORDIC.has(locale)) {
    if (protectedBlob.includes("Buddy")) leaks.push("unexpected Buddy in Nordic helper copy");
  } else if (protectedBlob.includes("Kompis")) {
    leaks.push("unexpected helper Kompis outside product name");
  }
  return leaks;
}

type AuditRow = {
  locale: string;
  path: string;
  text: string;
  kind: "assistant" | "product" | "brand";
};

function walk(obj: unknown, path: string, rows: AuditRow[], locale: string) {
  if (typeof obj === "string") {
    if (!/Kompis|Buddy|buddy|kompis/i.test(obj)) return;
    const withoutProduct = obj.replaceAll("Kompis Web", "").replaceAll("Kompis Bedrift", "");
    if (/\bBuddy\b/i.test(obj)) {
      rows.push({ locale, path, text: obj, kind: "assistant" });
    }
    if (/\bKompis\b/i.test(withoutProduct)) {
      rows.push({ locale, path, text: obj, kind: "assistant" });
    }
    if (/Kompis Web/.test(obj)) {
      rows.push({ locale, path, text: obj, kind: "product" });
    }
    if (/Aipify works for you/.test(obj)) {
      rows.push({ locale, path, text: obj, kind: "brand" });
    }
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => walk(item, `${path}[${i}]`, rows, locale));
    return;
  }
  if (obj && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      walk(value, path ? `${path}.${key}` : key, rows, locale);
    }
  }
}

const localeBundles = [
  ["en", enMarketing],
  ["es", esMarketing],
  ["no", noMarketing],
  ["sv", svMarketing],
  ["da", daMarketing],
  ["pl", plMarketing],
  ["uk", ukMarketing],
] as const;

const auditRows: AuditRow[] = [];

for (const [locale, marketing] of localeBundles) {
  const sales = (marketing as { kompisWebSales: unknown }).kompisWebSales;
  const leaks = helperNameLeak(locale, sales);
  assert.equal(leaks.length, 0, `${locale}: ${leaks.join("; ")}`);

  const labels = parseKompisWebSalesLabels(marketing as Record<string, unknown>);
  assert.ok(labels.hero.titleBefore.includes("Aipify"), `${locale}: H1 must lead with Aipify`);
  assert.ok(labels.meta.title.includes("Aipify works for you"), `${locale}: meta.title brand phrase`);
  assert.ok(labels.footer.tagline.includes("Aipify works for you"), `${locale}: footer brand phrase`);
  assert.equal(labels.hrefs.start, "/start");
  assert.doesNotMatch(
    `${labels.hero.secondaryCta} ${labels.finalCta.secondary} ${labels.pricing.paid.cta} ${labels.pricing.plannedNote} ${labels.pricing.paid.checkoutUnavailable}`,
    /book\s*demo/i,
    `${locale}: book demo must not remain in CTAs`,
  );
  assert.ok(labels.start.collectTitle.length > 0, `${locale}: start flow labels required`);

  const expectedHelper = NORDIC.has(locale) ? "Kompis" : "Buddy";
  const surface = [
    labels.hero.mascotAlt,
    ...labels.benefits.items.map((i) => `${i.title} ${i.body}`),
    ...labels.how.steps.map((i) => `${i.title} ${i.body}`),
    ...labels.faq.items.map((i) => `${i.question} ${i.answer}`),
  ].join("\n");
  assert.match(surface, new RegExp(`\\b${expectedHelper}\\b`), `${locale}: helper name ${expectedHelper}`);
  if (BUDDY.has(locale)) {
    assert.doesNotMatch(
      surface.replaceAll("Kompis Web", "«PW»").replaceAll("Kompis Bedrift", "«PB»"),
      /\bKompis\b/,
      `${locale}: assistant must not be Kompis`,
    );
  } else {
    assert.doesNotMatch(surface, /\bBuddy\b/, `${locale}: assistant must not be Buddy`);
  }

  walk(sales, "kompisWebSales", auditRows, locale);
}

const assistantMistakes = auditRows.filter((row) => {
  if (row.kind !== "assistant") return false;
  const withoutProduct = row.text.replaceAll("Kompis Web", "").replaceAll("Kompis Bedrift", "");
  if (NORDIC.has(row.locale)) return /\bBuddy\b/i.test(row.text);
  return /\bKompis\b/i.test(withoutProduct);
});
assert.equal(assistantMistakes.length, 0, JSON.stringify(assistantMistakes.slice(0, 5), null, 2));

const productRows = auditRows.filter((r) => r.kind === "product");
assert.ok(productRows.length > 0, "expected intentional Kompis Web product-name occurrences");

console.log(
  "kompis-web-sales locale policy: PASS",
  `assistant_ok locales=${localeBundles.length}`,
  `product_name_rows=${productRows.length}`,
);
