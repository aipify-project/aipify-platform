import assert from "node:assert/strict";
import enMarketing from "../../../locales/en/marketing.json";
import esMarketing from "../../../locales/es/marketing.json";
import noMarketing from "../../../locales/no/marketing.json";
import svMarketing from "../../../locales/sv/marketing.json";
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
] as const) {
  const sales = (marketing as { kompisWebSales: unknown }).kompisWebSales;
  const leaks = helperNameLeak(locale, sales);
  assert.equal(leaks.length, 0, `${locale}: ${leaks.join("; ")}`);
}

console.log("kompis-web-sales locale policy: PASS");
