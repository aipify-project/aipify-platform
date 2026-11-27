import assert from "node:assert/strict";
import test from "node:test";
import {
  classifyAddress,
  classifyKid,
  currencyFractionDigits,
  formatEconomyCount,
  formatEconomyMoney,
  formatEconomyPercent,
  isNonPayingEnvironment,
  presentEconomyCell,
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
  columns: { amount: "Beløp", active: "Aktiv" },
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
    "Må verifiseres",
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
    "paid",
  );
});

console.log("economy-display: all tests passed");
