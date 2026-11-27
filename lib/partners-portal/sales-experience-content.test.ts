import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { createTranslator } from "@/lib/i18n/translate";
import {
  buildAcademyExperience,
  buildCommissionExperience,
  buildHomeExperience,
  buildProductExperience,
  buildToolsExperience,
} from "@/lib/partners-portal/sales-experience-content";

const LOCALES = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;
const root = new URL("../../", import.meta.url);

function translator(locale: (typeof LOCALES)[number]) {
  const partnersPortal = JSON.parse(readFileSync(new URL(`locales/${locale}/partnersPortal.json`, root), "utf8"));
  return createTranslator({ partnersPortal }, { devMode: false });
}

test("sales experience copy exists in every portal locale", () => {
  const homeTitles = new Set<string>();
  for (const locale of LOCALES) {
    const t = translator(locale);
    const home = buildHomeExperience(t);
    const products = buildProductExperience(t);
    const tools = buildToolsExperience(t);
    const academy = buildAcademyExperience(t);
    const commission = buildCommissionExperience(t);
    for (const value of [
      home.hero.title,
      home.hero.support,
      home.notice,
      products.hero.title,
      products.know,
      tools.hero.title,
      academy.title,
      academy.passedStatus,
      commission.hero.title,
      ...commission.steps.map((step) => step.label),
      ...commission.rules.map((rule) => rule.body),
    ]) {
      assert.equal(value.includes("partnersPortal."), false, `${locale} leaked a key: ${value}`);
      assert.ok(value.trim().length > 3, `${locale} empty copy`);
    }
    assert.equal(home.steps.length, 4);
    assert.equal(tools.steps.length, 6);
    assert.equal(commission.steps.length, 5);
    assert.equal(tools.categories.length, 6);
    homeTitles.add(`${locale}:${home.hero.title}`);
  }
  assert.equal(homeTitles.size, LOCALES.length);
  const english = buildHomeExperience(translator("en")).hero.title;
  for (const locale of LOCALES) {
    if (locale === "en") continue;
    assert.notEqual(buildHomeExperience(translator(locale)).hero.title, english, locale);
  }
});

test("Norwegian home hero uses the approved sentence", () => {
  const home = buildHomeExperience(translator("no"));
  assert.equal(home.hero.title, "Gode salg starter med en god samtale.");
  assert.equal(home.notice, "Dette er en veiledning, ikke en automatisk salgsutsendelse.");
  assert.match(buildProductExperience(translator("no")).hero.title, /Forstå produktet/);
  assert.match(buildToolsExperience(translator("no")).hero.title, /gode spørsmål/);
  const commission = buildCommissionExperience(translator("no"));
  assert.match(commission.rules.find((rule) => rule.id === "yearly")?.body ?? "", /beregner ikke årsintervall/);
  assert.match(commission.notes.join(" "), /andre vellykkede betalte periode/);
});

test("presentation components stay free of tenant brand names", () => {
  const dir = new URL("components/partners-portal/sales-experience/", root);
  const files = readdirSync(dir).filter((name) => name.endsWith(".tsx") || name.endsWith(".ts"));
  for (const name of files) {
    const source = readFileSync(new URL(name, dir), "utf8");
    assert.equal(/Aipify|Kompis|UnoNight/i.test(source), false, name);
    assert.equal(source.includes("stripe"), false, name);
    assert.equal(/fetch\(/.test(source), false, name);
  }
});

test("seller product card does not offer purchase", () => {
  const source = readFileSync(
    new URL("components/partners-portal/CertifiedSalesPartnerProductCatalogPanel.tsx", root),
    "utf8",
  );
  assert.match(source, /shareProduct|experience\?\.share/);
  assert.doesNotMatch(source, />\s*(Buy|Kjøp|Kjop)\s*</);
});
