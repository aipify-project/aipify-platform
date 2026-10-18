import type { Translator } from "@/lib/i18n/translate";

const NS = "customerApp.commercialPackages.portfolio";

export type PortfolioLabels = {
  mySubscription: string;
  currentLicense: string;
  registeredLegacy: string;
  myProducts: string;
  exploreProducts: string;
  packagesTitle: string;
  packagesIntro: string;
  subscriptionIntro: string;
  kompisWeb: string;
  kompisBedrift: string;
  webSummary: string;
  webBody: string;
  bedriftSummary: string;
  bedriftBody: string;
  webImageAlt: string;
  bedriftImageAlt: string;
  answerPlanUnassigned: string;
  availableInWorkspace: string;
  notLicensed: string;
  planned: string;
  active: string;
  pending: string;
  unknown: string;
  exploreReview: string;
  seeWeb: string;
  plannedPlansTitle: string;
  seeBedrift: string;
  noRenewal: string;
  detailsUnavailable: string;
  contactForAccess: string;
  noChange: string;
  limitUnavailable: string;
  plannedCatalogNote: string;
  freeName: string;
  standardName: string;
  proName: string;
  perMonth: string;
  perYear: string;
  lifetimeAnswers: string;
  answersPerMonth: string;
  noCard: string;
  invoiceDetails: string;
};

export function buildPortfolioLabels(t: Translator): PortfolioLabels {
  return {
    mySubscription: t(`${NS}.mySubscription`),
    currentLicense: t(`${NS}.currentLicense`),
    registeredLegacy: t(`${NS}.registeredLegacy`),
    myProducts: t(`${NS}.myProducts`),
    exploreProducts: t(`${NS}.exploreProducts`),
    packagesTitle: t(`${NS}.packagesTitle`),
    packagesIntro: t(`${NS}.packagesIntro`),
    subscriptionIntro: t(`${NS}.subscriptionIntro`),
    kompisWeb: t(`${NS}.kompisWeb`),
    kompisBedrift: t(`${NS}.kompisBedrift`),
    webSummary: t(`${NS}.webSummary`),
    webBody: t(`${NS}.webBody`),
    bedriftSummary: t(`${NS}.bedriftSummary`),
    bedriftBody: t(`${NS}.bedriftBody`),
    webImageAlt: t(`${NS}.webImageAlt`),
    bedriftImageAlt: t(`${NS}.bedriftImageAlt`),
    answerPlanUnassigned: t(`${NS}.answerPlanUnassigned`),
    availableInWorkspace: t(`${NS}.availableInWorkspace`),
    notLicensed: t(`${NS}.notLicensed`),
    planned: t(`${NS}.planned`),
    active: t(`${NS}.active`),
    pending: t(`${NS}.pending`),
    unknown: t(`${NS}.unknown`),
    exploreReview: t(`${NS}.exploreReview`),
    seeWeb: t(`${NS}.seeWeb`),
    plannedPlansTitle: t(`${NS}.plannedPlansTitle`),
    seeBedrift: t(`${NS}.seeBedrift`),
    noRenewal: t(`${NS}.noRenewal`),
    detailsUnavailable: t(`${NS}.detailsUnavailable`),
    contactForAccess: t(`${NS}.contactForAccess`),
    noChange: t(`${NS}.noChange`),
    limitUnavailable: t(`${NS}.limitUnavailable`),
    plannedCatalogNote: t(`${NS}.plannedCatalogNote`),
    freeName: t(`${NS}.freeName`),
    standardName: t(`${NS}.standardName`),
    proName: t(`${NS}.proName`),
    perMonth: t(`${NS}.perMonth`),
    perYear: t(`${NS}.perYear`),
    lifetimeAnswers: t(`${NS}.lifetimeAnswers`),
    answersPerMonth: t(`${NS}.answersPerMonth`),
    noCard: t(`${NS}.noCard`),
    invoiceDetails: t(`${NS}.invoiceDetails`),
  };
}
