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
  openProduct: string;
  monthly: string;
  yearly: string;
  intervalLabel: string;
  includedHeading: string;
  seeAllFeatures: string;
  hideFeatures: string;
  billingUnavailable: string;
  exploreLink: string;
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
    openProduct: pick("openProduct"),
    monthly: pick("monthly"),
    yearly: pick("yearly"),
    intervalLabel: pick("intervalLabel"),
    includedHeading: pick("includedHeading"),
    seeAllFeatures: pick("seeAllFeatures"),
    hideFeatures: pick("hideFeatures"),
    billingUnavailable: pick("billingUnavailable"),
    exploreLink: pick("exploreLink"),
  };
}
