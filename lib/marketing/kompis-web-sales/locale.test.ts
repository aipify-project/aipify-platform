import assert from "node:assert/strict";
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

console.log("kompis-web-sales locale policy: PASS");
