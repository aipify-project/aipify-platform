import assert from "node:assert/strict";
import test from "node:test";
import { personalSalesLocalePath, resolvePersonalSalesLocale } from "./locale";

test("explicit language wins over the saved language and the browser", () => {
  assert.equal(
    resolvePersonalSalesLocale({
      queryLang: "uk",
      cookieLocale: "no",
      acceptLanguage: "en-US,en;q=0.8",
    }),
    "uk",
  );
  assert.equal(resolvePersonalSalesLocale({ queryLang: "nb-NO", cookieLocale: "en" }), "no");
});

test("saved language wins over Accept-Language", () => {
  assert.equal(
    resolvePersonalSalesLocale({
      cookieLocale: "da",
      acceptLanguage: "sv-SE,sv;q=0.9,en;q=0.4",
    }),
    "da",
  );
});

test("Accept-Language falls through to English when nothing matches", () => {
  assert.equal(resolvePersonalSalesLocale({ acceptLanguage: "fr-FR,de;q=0.8" }), "en");
  assert.equal(
    resolvePersonalSalesLocale({ acceptLanguage: "fr;q=0.2,pl;q=0.9" }),
    "pl",
  );
});

test("language switch keeps the partner code", () => {
  assert.equal(personalSalesLocalePath("North-Studio", "uk"), "/s/north-studio?lang=uk");
  assert.equal(personalSalesLocalePath("csp-0123456789ab", "no"), "/s/csp-0123456789ab?lang=no");
});
