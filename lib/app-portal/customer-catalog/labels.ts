import type { Translator } from "@/lib/i18n/translate";

const NS = "customerApp.customerCatalog";

export type CustomerCatalogLabels = {
  eyebrow: string;
  title: string;
  description: string;
  categoriesLabel: string;
  all: string;
  kompis: string;
  voice: string;
  otherCategory: string;
  kompisWebTitle: string;
  kompisWebDescription: string;
  kompisBedriftTitle: string;
  kompisBedriftDescription: string;
  stateActive: string;
  stateNotLicensed: string;
  stateUnknown: string;
  stateComingLater: string;
  priceUnavailable: string;
  purchaseClosed: string;
  startPurchase: string;
  purchasePending: string;
  purchaseError: string;
  openProduct: string;
  monthly: string;
  yearly: string;
  perMonth: string;
  perYear: string;
  pricingHeading: string;
  intervalLabel: string;
  includedHeading: string;
  seeAllFeatures: string;
  hideFeatures: string;
  billingUnavailable: string;
  exploreLink: string;
  emptyTitle: string;
  emptyDescription: string;
};

export function buildCustomerCatalogLabels(t: Translator): CustomerCatalogLabels {
  const pick = (key: string) => t(`${NS}.${key}`);
  return {
    eyebrow: pick("eyebrow"),
    title: pick("title"),
    description: pick("description"),
    categoriesLabel: pick("categoriesLabel"),
    all: pick("all"),
    kompis: pick("kompis"),
    voice: pick("voice"),
    otherCategory: pick("otherCategory"),
    kompisWebTitle: pick("kompisWebTitle"),
    kompisWebDescription: pick("kompisWebDescription"),
    kompisBedriftTitle: pick("kompisBedriftTitle"),
    kompisBedriftDescription: pick("kompisBedriftDescription"),
    stateActive: pick("stateActive"),
    stateNotLicensed: pick("stateNotLicensed"),
    stateUnknown: pick("stateUnknown"),
    stateComingLater: pick("stateComingLater"),
    priceUnavailable: pick("priceUnavailable"),
    purchaseClosed: pick("purchaseClosed"),
    startPurchase: pick("startPurchase"),
    purchasePending: pick("purchasePending"),
    purchaseError: pick("purchaseError"),
    openProduct: pick("openProduct"),
    monthly: pick("monthly"),
    yearly: pick("yearly"),
    perMonth: pick("perMonth"),
    perYear: pick("perYear"),
    pricingHeading: pick("pricingHeading"),
    intervalLabel: pick("intervalLabel"),
    includedHeading: pick("includedHeading"),
    seeAllFeatures: pick("seeAllFeatures"),
    hideFeatures: pick("hideFeatures"),
    billingUnavailable: pick("billingUnavailable"),
    exploreLink: pick("exploreLink"),
    emptyTitle: pick("emptyTitle"),
    emptyDescription: pick("emptyDescription"),
  };
}
