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

/** Nordic locales keep helper name Kompis; EN/ES/PL/UK use Buddy (product name Kompis Web stays). */
function helperNameLeak(locale: string, sales: unknown): string[] {
  const blob = JSON.stringify(sales);
  const protectedBlob = blob.replaceAll("Kompis Web", "«PW»").replaceAll("Kompis Bedrift", "«PB»");
  const leaks: string[] = [];
  if (locale === "no" || locale === "sv" || locale === "da") {
    if (protectedBlob.includes("Buddy")) leaks.push("unexpected Buddy in Nordic helper copy");
  } else if (protectedBlob.includes("Kompis")) {
    leaks.push("unexpected helper Kompis outside product name");
  }
  return leaks;
}

for (const [locale, marketing] of [
  ["en", enMarketing],
  ["es", esMarketing],
  ["no", noMarketing],
  ["sv", svMarketing],
  ["da", daMarketing],
  ["pl", plMarketing],
  ["uk", ukMarketing],
] as const) {
  const sales = (marketing as { kompisWebSales: unknown }).kompisWebSales;
  const leaks = helperNameLeak(locale, sales);
  assert.equal(leaks.length, 0, `${locale}: ${leaks.join("; ")}`);
  const labels = parseKompisWebSalesLabels(marketing as Record<string, unknown>);
  assert.ok(labels.hero.titleBefore.includes("Aipify"), `${locale}: H1 must lead with Aipify`);
  assert.ok(labels.meta.title.includes("Aipify"), `${locale}: title must include Aipify`);
  assert.ok(labels.meta.title.includes("Kompis Web"), `${locale}: title must include Kompis Web`);
  assert.ok(
    labels.footer.tagline.includes("Aipify works for you"),
    `${locale}: preserve Aipify works for you brand SEO phrase`,
  );
  assert.doesNotMatch(
    `${labels.hero.titleBefore} ${labels.hero.titleHighlight} ${labels.hero.subtitle}`,
    /\bAI hjelper deg\b|\bAI-hjelper deg\b/i,
    `${locale}: must not use legacy AI-hjelper-deg phrasing`,
  );
}

console.log("kompis-web-sales locale policy: PASS");
