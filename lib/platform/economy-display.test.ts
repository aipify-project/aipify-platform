import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  classifyAddress,
  classifyKid,
  currencyFractionDigits,
  economyColumnLabel,
  formatEconomyCount,
  formatEconomyMoney,
  formatEconomyPercent,
  isNonPayingEnvironment,
  isTechnicalCustomerId,
  presentCustomerNumber,
  presentEconomyCell,
  presentEconomyStat,
  presentKidDisplay,
  presentTaxRuleLabel,
  type EconomyPhrases,
} from "./economy-display";

const phrases: EconomyPhrases = {
  unavailable: "Ikke tilgjengelig",
  notRegistered: "Ikke registrert",
  mustVerify: "Må verifiseres",
  active: "Aktiv",
  inactive: "Inaktiv",
  yes: "Ja",
  no: "Nei",
  staging: "Internt eller staging — ikke kundesalg",
  lifetime: "Ubegrenset",
  monthly: "Månedlig",
  yearly: "Årlig",
  oneTime: "Engangsbeløp",
  seeProductCatalog: "Se produktkatalog under Moduler",
  seeSellers: "Åpne under Selgere",
  sourceError: "Kilden svarte ikke.",
  noRecords: "Ingen poster er registrert.",
  kidNotApplicable: "Ikke aktuelt",
  kidNotApplicablePaidOnline: "Ikke aktuelt – betalt på nett",
  kidMissingReview: "Mangler KID – krever kontroll",
  columns: { amount: "Beløp", active: "Aktiv", total: "Totalt", private: "Privat", business: "Bedrift" },
};

test("Norwegian major-unit currency keeps øre and uses space grouping", () => {
  assert.equal(
    formatEconomyMoney({ amount: 299, currency: "EUR", locale: "no" }).state === "value"
      ? (formatEconomyMoney({ amount: 299, currency: "EUR", locale: "no" }) as { text: string }).text
      : "",
    "299,00 EUR",
  );
  assert.equal(
    (formatEconomyMoney({ amount: 1199, currency: "NOK", locale: "no" }) as { text: string }).text,
    "1\u00a0199,00 kr",
  );
  assert.equal(
    (formatEconomyMoney({ amount: 0, currency: "NOK", locale: "no" }) as { text: string }).text,
    "0,00 kr",
  );
  assert.equal(
    (formatEconomyMoney({ amount: -15.5, currency: "EUR", locale: "no" }) as { text: string }).text,
    "-15,50 EUR",
  );
});

test("minor units are scaled only when the field contract says so", () => {
  assert.equal(
    (
      formatEconomyMoney({ amount: 29900, currency: "EUR", locale: "no", scale: "minor" }) as {
        text: string;
      }
    ).text,
    "299,00 EUR",
  );
  assert.equal(
    (formatEconomyMoney({ amount: 29900, currency: "EUR", locale: "no", scale: "major" }) as { text: string })
      .text,
    "29\u00a0900,00 EUR",
  );
});

test("currency rules, percents, counts, and missing values stay distinct", () => {
  assert.equal(currencyFractionDigits("JPY"), 0);
  assert.equal(currencyFractionDigits("KWD"), 3);
  assert.equal(currencyFractionDigits("EUR"), 2);
  assert.equal(
    (formatEconomyMoney({ amount: 1199, currency: "JPY", locale: "no" }) as { text: string }).text,
    "1\u00a0199 JPY",
  );
  assert.equal(formatEconomyMoney({ amount: null, currency: "NOK", locale: "no" }).state, "unavailable");
  assert.equal(formatEconomyMoney({ amount: 10, currency: null, locale: "no" }).state, "unavailable");
  assert.equal((formatEconomyPercent(25, "no") as { text: string }).text, "25 %");
  assert.equal((formatEconomyCount(3, "no") as { text: string }).text, "3");
  assert.equal((formatEconomyCount(0, "no") as { text: string }).text, "0");
  assert.equal(formatEconomyCount(null, "no").state, "unavailable");
  const large = formatEconomyMoney({ amount: 1234567.89, currency: "NOK", locale: "no" });
  assert.equal(large.state, "value");
  assert.match((large as { text: string }).text, /1\s234\s567,89 kr|1\u00a0234\u00a0567,89 kr/);
});

test("placeholder payment details and staging identities are not presented as sales", () => {
  assert.equal(classifyKid("KID-PLACEHOLDER-000001"), "placeholder");
  assert.equal(classifyKid("12345678903"), "present");
  assert.equal(classifyKid(""), "missing");
  assert.equal(classifyAddress("Billing address pending, 0000 Oslo"), "placeholder");
  assert.equal(isNonPayingEnvironment("staging"), true);
  assert.equal(
    presentEconomyCell({
      key: "kid_number",
      value: "KID-PLACEHOLDER-000001",
      locale: "no",
      phrases,
    }),
    "Ikke tilgjengelig",
  );
  assert.equal(
    presentEconomyCell({
      key: "billing_address",
      value: "Billing address pending, 0000 Oslo",
      locale: "no",
      phrases,
    }),
    "Må verifiseres",
  );
  assert.equal(
    presentEconomyCell({
      key: "environment_type",
      value: "staging",
      locale: "no",
      phrases,
    }),
    phrases.staging,
  );
  assert.equal(
    presentEconomyCell({ key: "active", value: true, locale: "no", phrases }),
    "Aktiv",
  );
  assert.equal(
    presentEconomyCell({
      key: "amount",
      value: 299,
      currency: "EUR",
      locale: "no",
      phrases,
    }),
    "299,00 EUR",
  );
  assert.equal(
    presentEconomyCell({ key: "status", value: "paid", locale: "no", phrases }),
    "Betalt",
  );
  assert.equal(
    presentEconomyCell({ key: "status", value: "paid", locale: "en", phrases }),
    "paid",
  );
});

test("KID follows payment method and never treats a placeholder as a real KID", () => {
  const kidPhrases = phrases;
  assert.equal(
    presentKidDisplay({
      kid: "",
      provider: "stripe",
      invoiceStatus: "paid",
      phrases: kidPhrases,
    }).text,
    "Ikke aktuelt – betalt på nett",
  );
  assert.equal(
    presentKidDisplay({
      kid: "KID-PLACEHOLDER-000001",
      provider: "vipps",
      invoiceStatus: "sent",
      phrases: kidPhrases,
    }).text,
    "Ikke aktuelt",
  );
  assert.equal(
    presentKidDisplay({
      kid: null,
      provider: "invoice",
      phrases: kidPhrases,
    }).text,
    "Mangler KID – krever kontroll",
  );
  assert.equal(
    presentKidDisplay({
      kid: "KID-PLACEHOLDER-000001",
      provider: "manual",
      phrases: kidPhrases,
    }).text,
    "Mangler KID – krever kontroll",
  );
  assert.equal(
    presentKidDisplay({ kid: "", provider: null, phrases: kidPhrases }).text,
    "Ikke tilgjengelig",
  );
  assert.equal(
    presentKidDisplay({
      kid: "12345678903",
      provider: "stripe",
      invoiceStatus: "paid",
      phrases: kidPhrases,
    }).text,
    "12345678903",
  );
  assert.notEqual(
    presentKidDisplay({
      kid: "KID-PLACEHOLDER-000001",
      provider: "klarna",
      invoiceStatus: "paid",
      phrases: kidPhrases,
    }).text,
    "KID-PLACEHOLDER-000001",
  );
});

test("customer number stays separate from the technical id", () => {
  const technicalId = "00000000-0000-4000-8000-000000000001";
  assert.equal(presentCustomerNumber("AIP-000001", phrases.unavailable), "AIP-000001");
  assert.equal(isTechnicalCustomerId(technicalId), true);
  assert.equal(presentCustomerNumber(technicalId, phrases.unavailable), phrases.unavailable);
  assert.equal(presentCustomerNumber(null, phrases.unavailable), phrases.unavailable);
  assert.equal(
    presentEconomyCell({
      key: "customer_number",
      value: technicalId,
      locale: "no",
      phrases,
    }),
    phrases.unavailable,
  );
});

test("customer type counts stay counts and a missing total is not invented", () => {
  assert.equal(presentEconomyStat({ key: "private", value: 0, locale: "no", phrases }), "0");
  assert.equal(presentEconomyStat({ key: "business", value: 3, locale: "no", phrases }), "3");
  assert.equal(presentEconomyStat({ key: "total", value: 3, locale: "no", phrases }), "3");
  assert.equal(
    presentEconomyStat({ key: "total", value: null, locale: "no", phrases }),
    phrases.unavailable,
  );
  assert.equal(economyColumnLabel("active_domains", { ...phrases, columns: { active_domains: "Aktive domener" } }), "Aktive domener");
  assert.equal(
    presentTaxRuleLabel("no_private_business", "Norway private/business standard VAT", "no"),
    "Norsk MVA for privat og bedrift",
  );
  assert.equal(
    presentTaxRuleLabel("custom_external_rule", "Stored external label", "no"),
    "Stored external label",
  );
});

test("Norwegian economy labels use sentence case", () => {
  const platform = JSON.parse(
    readFileSync(new URL("../../locales/no/platform.json", import.meta.url), "utf8"),
  ) as {
    economyDisplay: { columns: Record<string, string>; kidNotApplicablePaidOnline: string };
    paymentProviders: { setupStatus: { inProgress: string }; enterpriseBilling: { title: string } };
  };
  const expected = [
    platform.economyDisplay.columns.active_domains,
    platform.economyDisplay.columns.purchased_domains,
    platform.economyDisplay.columns.included_licenses,
    platform.economyDisplay.columns.purchased_licenses,
    platform.economyDisplay.columns.pools,
    platform.economyDisplay.columns.tenant_overrides,
    platform.economyDisplay.columns.revenue_invoices,
    platform.economyDisplay.columns.accounting_exports,
    platform.economyDisplay.columns.partner_commissions,
    platform.paymentProviders.enterpriseBilling.title,
    platform.paymentProviders.setupStatus.inProgress,
  ];
  for (const label of expected) {
    assert.match(label, /^[A-ZÆØÅ]/);
    const words = label.split(" ");
    if (words.length > 1) {
      assert.notEqual(label, words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "));
    }
  }
  assert.equal(platform.economyDisplay.kidNotApplicablePaidOnline, "Ikke aktuelt – betalt på nett");
});

console.log("economy-display: all tests passed");
