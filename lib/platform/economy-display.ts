/**
 * Platform economy presentation only.
 * Amount fields on invoices and agreements are major currency units (numeric 12,2).
 * Pass scale "minor" only when the source field is ISO 4217 minor units.
 * This module never converts currencies and never writes billing data.
 */

import {
  resolveAuthoritativeTimeZone,
  toBcp47Locale,
} from "@/lib/platform-presentation-quality/bcp47";

const ZERO_DECIMAL = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "ISK",
  "JPY",
  "KMF",
  "KRW",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

const THREE_DECIMAL = new Set(["BHD", "IQD", "JOD", "KWD", "LYD", "OMR", "TND"]);

const MONEY_KEYS = new Set([
  "amount",
  "price",
  "price_amount",
  "total_amount",
  "subtotal",
  "subtotal_amount",
  "vat_amount",
  "tax_amount",
  "commission_amount",
  "refund_amount",
  "outstanding",
  "outstanding_amount",
  "mrr",
  "arr",
]);

const PERCENT_KEYS = new Set(["rate", "vat_rate", "tax_rate", "percent", "percentage"]);

const COUNT_KEYS = new Set([
  "count",
  "total_sessions",
  "reverse_charge_count",
  "invalid_validations",
  "service_failures",
  "connected",
  "active_customers",
  "open_invoices",
  "overdue_customers",
  "checkout_sessions",
  "total",
  "private",
  "business",
  "pools",
  "active_domains",
  "purchased_domains",
]);

export type EconomyPhrases = {
  unavailable: string;
  notRegistered: string;
  mustVerify: string;
  active: string;
  inactive: string;
  yes: string;
  no: string;
  staging: string;
  lifetime: string;
  monthly: string;
  yearly: string;
  oneTime: string;
  seeProductCatalog: string;
  seeSellers: string;
  sourceError: string;
  noRecords: string;
  kidNotApplicable: string;
  kidNotApplicablePaidOnline: string;
  kidMissingReview: string;
  columns: Record<string, string>;
};

export type MoneyDisplay = { state: "value"; text: string } | { state: "unavailable" };

export function currencyFractionDigits(currency: string | null | undefined): number | null {
  const code = (currency ?? "").trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(code)) return null;
  if (ZERO_DECIMAL.has(code)) return 0;
  if (THREE_DECIMAL.has(code)) return 3;
  return 2;
}

function toMinorUnits(amount: number, digits: number, scale: "major" | "minor"): number | null {
  if (!Number.isFinite(amount)) return null;
  if (scale === "minor") return Math.trunc(amount);
  const negative = amount < 0;
  const text = Object.is(amount, -0) ? "0" : String(Math.abs(amount));
  if (!/^\d+(\.\d+)?$/.test(text)) return null;
  const [whole, fraction = ""] = text.split(".");
  const padded = (fraction + "0".repeat(digits)).slice(0, digits);
  const roundUp = fraction.length > digits && fraction[digits]! >= "5";
  let minor = Number(whole) * 10 ** digits + Number(padded || "0");
  if (roundUp) minor += 1;
  return negative ? -minor : minor;
}

function formatGroupedWhole(whole: number, locale: string): string {
  return new Intl.NumberFormat(toBcp47Locale(locale), {
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(whole);
}

export function formatEconomyMoney(input: {
  amount: number | string | null | undefined;
  currency: string | null | undefined;
  locale: string;
  scale?: "major" | "minor";
}): MoneyDisplay {
  if (input.amount === null || input.amount === undefined || input.amount === "") {
    return { state: "unavailable" };
  }
  const numeric = typeof input.amount === "number" ? input.amount : Number(input.amount);
  if (!Number.isFinite(numeric)) return { state: "unavailable" };
  const digits = currencyFractionDigits(input.currency);
  const currency = (input.currency ?? "").trim().toUpperCase();
  if (digits === null) return { state: "unavailable" };
  const minor = toMinorUnits(numeric, digits, input.scale ?? "major");
  if (minor === null) return { state: "unavailable" };

  const sign = minor < 0 ? "-" : "";
  const abs = Math.abs(minor);
  const factor = 10 ** digits;
  const whole = Math.trunc(abs / factor);
  const fraction = abs % factor;
  const grouped = formatGroupedWhole(whole, input.locale);
  const decimalSep = input.locale === "en" ? "." : ",";
  const numberText =
    digits === 0
      ? `${sign}${grouped}`
      : `${sign}${grouped}${decimalSep}${String(fraction).padStart(digits, "0")}`;

  if (input.locale === "no" && currency === "NOK") {
    return { state: "value", text: `${numberText} kr` };
  }
  if (input.locale === "no") {
    return { state: "value", text: `${numberText} ${currency}` };
  }

  const major = minor / factor;
  try {
    return {
      state: "value",
      text: new Intl.NumberFormat(toBcp47Locale(input.locale), {
        style: "currency",
        currency,
        currencyDisplay: "code",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(major),
    };
  } catch {
    return { state: "value", text: `${numberText} ${currency}` };
  }
}

export function formatEconomyPercent(
  value: number | string | null | undefined,
  locale: string,
): MoneyDisplay {
  if (value === null || value === undefined || value === "") return { state: "unavailable" };
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return { state: "unavailable" };
  const text = new Intl.NumberFormat(toBcp47Locale(locale), {
    minimumFractionDigits: Number.isInteger(numeric) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numeric);
  return { state: "value", text: `${text} %` };
}

export function formatEconomyCount(
  value: number | string | null | undefined,
  locale: string,
): MoneyDisplay {
  if (value === null || value === undefined || value === "") return { state: "unavailable" };
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return { state: "unavailable" };
  return {
    state: "value",
    text: new Intl.NumberFormat(toBcp47Locale(locale), { maximumFractionDigits: 0 }).format(numeric),
  };
}

export function formatEconomyDate(value: string | null | undefined, locale: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(toBcp47Locale(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: resolveAuthoritativeTimeZone(),
  }).format(date);
}

export function classifyKid(value: string | null | undefined): "missing" | "placeholder" | "present" {
  const text = (value ?? "").trim();
  if (!text) return "missing";
  if (/placeholder/i.test(text) || /^kid[-_\s]?0+$/i.test(text)) return "placeholder";
  return "present";
}

const ONLINE_PAYMENT_PROVIDERS = new Set(["klarna", "stripe", "vipps"]);
const INVOICE_PAYMENT_PROVIDERS = new Set(["invoice", "manual", "dnb", "bank_transfer"]);
const CUSTOMER_NUMBER_PATTERN = /^AIP-\d{6}$/;
const TECHNICAL_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type KidRequirement = "not_applicable" | "required" | "unknown";

/** Online card and wallet providers do not use a Norwegian KID. Invoice and manual collection do. */
export function kidRequirementForProvider(provider: string | null | undefined): KidRequirement {
  const key = (provider ?? "").trim().toLowerCase();
  if (!key) return "unknown";
  if (ONLINE_PAYMENT_PROVIDERS.has(key)) return "not_applicable";
  if (INVOICE_PAYMENT_PROVIDERS.has(key)) return "required";
  return "unknown";
}

export function presentKidDisplay(input: {
  kid: string | null | undefined;
  provider: string | null | undefined;
  invoiceStatus?: string | null;
  phrases: Pick<
    EconomyPhrases,
    "kidNotApplicable" | "kidNotApplicablePaidOnline" | "kidMissingReview" | "unavailable"
  >;
}): { text: string; storedPlaceholder: string | null } {
  const kind = classifyKid(input.kid);
  const storedPlaceholder = kind === "placeholder" ? (input.kid ?? "").trim() : null;
  if (kind === "present") return { text: (input.kid ?? "").trim(), storedPlaceholder: null };
  const requirement = kidRequirementForProvider(input.provider);
  if (requirement === "not_applicable") {
    const paidOnline = (input.invoiceStatus ?? "").trim().toLowerCase() === "paid";
    return {
      text: paidOnline ? input.phrases.kidNotApplicablePaidOnline : input.phrases.kidNotApplicable,
      storedPlaceholder,
    };
  }
  if (requirement === "required") {
    return { text: input.phrases.kidMissingReview, storedPlaceholder };
  }
  return { text: input.phrases.unavailable, storedPlaceholder };
}

export function presentCustomerNumber(value: string | null | undefined, unavailable: string): string {
  const text = (value ?? "").trim();
  if (CUSTOMER_NUMBER_PATTERN.test(text)) return text;
  return unavailable;
}

export function isTechnicalCustomerId(value: string | null | undefined): boolean {
  return TECHNICAL_ID_PATTERN.test((value ?? "").trim());
}

const TAX_RULE_LABELS: Record<string, Record<string, string>> = {
  no: {
    no_private_business: "Norsk MVA for privat og bedrift",
    eu_b2b_reverse_charge: "EU bedrift med omvendt avgiftsplikt",
    invalid_business_standard: "Ugyldig bedrift — standardsats",
    service_unavailable_standard: "Register utilgjengelig — standardsats",
  },
};

export function presentTaxRuleLabel(
  ruleKey: string | null | undefined,
  storedLabel: string | null | undefined,
  locale: string,
): string {
  const key = (ruleKey ?? "").trim();
  const mapped = TAX_RULE_LABELS[locale]?.[key];
  if (mapped) return mapped;
  const stored = (storedLabel ?? "").trim();
  return stored || key;
}

export function classifyAddress(value: string | null | undefined): "missing" | "placeholder" | "present" {
  const text = (value ?? "").trim();
  if (!text) return "missing";
  if (/pending|placeholder|not provided|mangler/i.test(text) || /\b0000\b/.test(text)) {
    return "placeholder";
  }
  return "present";
}

export function isNonPayingEnvironment(value: string | null | undefined): boolean {
  return /staging|sandbox|demo|test|internal/i.test(value ?? "");
}

export function presentBillingCycle(
  cycle: string | null | undefined,
  phrases: Pick<EconomyPhrases, "lifetime" | "monthly" | "yearly" | "oneTime" | "notRegistered">,
): string {
  const key = (cycle ?? "").trim().toLowerCase();
  if (!key) return phrases.notRegistered;
  if (key === "lifetime") return phrases.lifetime;
  if (key === "monthly" || key === "month") return phrases.monthly;
  if (key === "yearly" || key === "annual" || key === "year") return phrases.yearly;
  if (key === "one_time" || key === "once" || key === "onetime") return phrases.oneTime;
  return cycle ?? phrases.notRegistered;
}

function looksLikeDateKey(key: string): boolean {
  return /(_at|_date)$/.test(key) || key === "due" || key === "issued";
}

export function presentEconomyCell(input: {
  key: string;
  value: unknown;
  locale: string;
  phrases: EconomyPhrases;
  currency?: string | null;
  provider?: string | null;
  invoiceStatus?: string | null;
  ruleKey?: string | null;
}): string {
  const { key, value, locale, phrases } = input;
  if (key === "kid" || key === "kid_number" || key.endsWith("_kid")) {
    return presentKidDisplay({
      kid: value === null || value === undefined ? "" : String(value),
      provider: input.provider,
      invoiceStatus: input.invoiceStatus,
      phrases,
    }).text;
  }
  if (value === null || value === undefined || value === "") return phrases.notRegistered;
  if (typeof value === "boolean") {
    if (key === "active" || key.endsWith("_active") || key === "is_active") {
      return value ? phrases.active : phrases.inactive;
    }
    return value ? phrases.yes : phrases.no;
  }
  if (typeof value === "object") return phrases.unavailable;

  const text = String(value);
  if (key === "customer_number") return presentCustomerNumber(text, phrases.unavailable);
  if (key === "label") {
    return presentTaxRuleLabel(input.ruleKey, text, locale);
  }
  if (key.includes("address")) {
    const kind = classifyAddress(text);
    if (kind === "placeholder") return phrases.mustVerify;
    if (kind === "missing") return phrases.notRegistered;
    return text;
  }
  if (key === "environment" || key === "environment_type" || key === "customer_environment") {
    if (isNonPayingEnvironment(text)) return phrases.staging;
  }
  if (key === "billing_cycle" || key === "cycle" || key === "interval") {
    return presentBillingCycle(text, phrases);
  }
  if (PERCENT_KEYS.has(key)) {
    const percent = formatEconomyPercent(text, locale);
    return percent.state === "value" ? percent.text : phrases.unavailable;
  }
  if (MONEY_KEYS.has(key)) {
    const money = formatEconomyMoney({
      amount: text,
      currency: input.currency,
      locale,
      scale: "major",
    });
    return money.state === "value" ? money.text : phrases.unavailable;
  }
  if (COUNT_KEYS.has(key) || key.endsWith("_count")) {
    const count = formatEconomyCount(text, locale);
    return count.state === "value" ? count.text : phrases.unavailable;
  }
  if (looksLikeDateKey(key)) {
    return formatEconomyDate(text, locale) ?? text;
  }
  if (text === "true") return phrases.yes;
  if (text === "false") return phrases.no;
  if (
    (locale === "no" || locale === "nb") &&
    (key === "status" || key === "payment_status" || key === "customer_type" || key === "license_status")
  ) {
    const known: Record<string, string> = {
      active: "Aktiv",
      inactive: "Inaktiv",
      paid: "Betalt",
      draft: "Utkast",
      sent: "Sendt",
      overdue: "Forfalt",
      cancelled: "Kansellert",
      canceled: "Kansellert",
      failed: "Mislykket",
      pending: "Venter",
      company: "Bedrift",
      private: "Privat",
      not_connected: "Ikke tilkoblet",
      pending_setup: "Oppsett gjenstår",
      trial: "Prøveperiode",
      trialing: "Prøveperiode",
    };
    return known[text.trim().toLowerCase()] ?? text;
  }
  return text;
}

export function presentEconomyStat(input: {
  key: string;
  value: unknown;
  locale: string;
  phrases: EconomyPhrases;
  currency?: string | null;
}): string {
  if (input.value === null || input.value === undefined || input.value === "") {
    return input.phrases.unavailable;
  }
  return presentEconomyCell(input);
}

export function economyColumnLabel(key: string, phrases: EconomyPhrases): string {
  return phrases.columns[key] ?? phrases.columns[key.replace(/_/g, "")] ?? key.replace(/_/g, " ");
}

export function moneyText(display: MoneyDisplay, unavailable: string): string {
  return display.state === "value" ? display.text : unavailable;
}
