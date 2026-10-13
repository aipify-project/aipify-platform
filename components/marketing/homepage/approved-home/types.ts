export type ApprovedPublicHomeDemoMode = "web" | "company";

export type ApprovedPublicHomeDemoContent = {
  kicker: string;
  title: string;
  text: string;
  pills: string[];
  name: string;
  question: string;
  answer: string;
  source: string;
};

/** Product capability line with verified availability status. */
export type ApprovedPublicHomeFeature = {
  text: string;
  status: "available" | "planned";
};

export type ApprovedPublicHomeLabels = {
  demoBadge: string;
  eyebrow: string;
  heroTitleBefore: string;
  heroTitleMid: string;
  heroTitleAnd: string;
  heroTitleEnd: string;
  heroCopy: string;
  ctaExploreWeb: string;
  ctaExploreBedrift: string;
  trustSource: string;
  trustMultilingual: string;
  trustHuman: string;
  demoAria: string;
  demoAddress: string;
  demoInputPlaceholder: string;
  demoSwitchAria: string;
  demoWebTab: string;
  demoCompanyTab: string;
  demoOnline: string;
  demoWeb: ApprovedPublicHomeDemoContent;
  demoCompany: ApprovedPublicHomeDemoContent;
  productsLabel: string;
  productsTitle: string;
  productsSubtitle: string;
  productWebTitle: string;
  productWebBody: string;
  productWebFeatures: ApprovedPublicHomeFeature[];
  productWebCta: string;
  productBedriftTitle: string;
  productBedriftBody: string;
  productBedriftFeatures: ApprovedPublicHomeFeature[];
  productBedriftCta: string;
  productIconAlt: string;
  availableNowLabel: string;
  plannedLabel: string;
  coreLabel: string;
  coreTitle: string;
  coreBody: string;
  coreCta: string;
  coreSteps: { title: string; detail: string; status: string }[];
  securityLabel: string;
  securityTitle: string;
  securitySubtitle: string;
  values: { title: string; body: string; icon: string }[];
  addonsLabel: string;
  addonsTitle: string;
  addonsSubtitle: string;
  addonDesignTitle: string;
  addonDesignBody: string;
  addonTranslatorTitle: string;
  addonTranslatorBody: string;
  plannedTag: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
