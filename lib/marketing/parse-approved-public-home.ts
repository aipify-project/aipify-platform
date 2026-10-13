import type { ApprovedPublicHomeLabels } from "@/components/marketing/homepage/approved-home/types";
import { getSection } from "@/lib/marketing/parse-marketing";

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function strList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => str(item)).filter(Boolean);
}

function demo(value: unknown) {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    kicker: str(row.kicker),
    title: str(row.title),
    text: str(row.text),
    pills: strList(row.pills),
    name: str(row.name),
    question: str(row.question),
    answer: str(row.answer),
    source: str(row.source),
  };
}

export function parseApprovedPublicHome(marketing: Record<string, unknown>): ApprovedPublicHomeLabels {
  const section = getSection<Record<string, unknown>>(marketing, "approvedPublicHome");
  const valuesRaw = Array.isArray(section.values) ? section.values : [];
  const stepsRaw = Array.isArray(section.coreSteps) ? section.coreSteps : [];

  return {
    demoBadge: str(section.demoBadge, "Product demo"),
    eyebrow: str(section.eyebrow),
    heroTitleBefore: str(section.heroTitleBefore),
    heroTitleMid: str(section.heroTitleMid),
    heroTitleAnd: str(section.heroTitleAnd),
    heroTitleEnd: str(section.heroTitleEnd),
    heroCopy: str(section.heroCopy),
    ctaExploreWeb: str(section.ctaExploreWeb),
    ctaExploreBedrift: str(section.ctaExploreBedrift),
    trustSource: str(section.trustSource),
    trustMultilingual: str(section.trustMultilingual),
    trustHuman: str(section.trustHuman),
    demoAria: str(section.demoAria),
    demoAddress: str(section.demoAddress),
    demoInputPlaceholder: str(section.demoInputPlaceholder),
    demoSwitchAria: str(section.demoSwitchAria),
    demoWebTab: str(section.demoWebTab),
    demoCompanyTab: str(section.demoCompanyTab),
    demoOnline: str(section.demoOnline),
    demoWeb: demo(section.demoWeb),
    demoCompany: demo(section.demoCompany),
    productsLabel: str(section.productsLabel),
    productsTitle: str(section.productsTitle),
    productsSubtitle: str(section.productsSubtitle),
    productWebTitle: str(section.productWebTitle),
    productWebBody: str(section.productWebBody),
    productWebFeatures: strList(section.productWebFeatures),
    productWebCta: str(section.productWebCta),
    productBedriftTitle: str(section.productBedriftTitle),
    productBedriftBody: str(section.productBedriftBody),
    productBedriftFeatures: strList(section.productBedriftFeatures),
    productBedriftCta: str(section.productBedriftCta),
    productIconAlt: str(section.productIconAlt),
    coreLabel: str(section.coreLabel),
    coreTitle: str(section.coreTitle),
    coreBody: str(section.coreBody),
    coreCta: str(section.coreCta),
    coreSteps: stepsRaw.map((step) => {
      const row = (step ?? {}) as Record<string, unknown>;
      return {
        title: str(row.title),
        detail: str(row.detail),
        status: str(row.status),
      };
    }),
    securityLabel: str(section.securityLabel),
    securityTitle: str(section.securityTitle),
    securitySubtitle: str(section.securitySubtitle),
    values: valuesRaw.map((value) => {
      const row = (value ?? {}) as Record<string, unknown>;
      return {
        title: str(row.title),
        body: str(row.body),
        icon: str(row.icon, "•"),
      };
    }),
    addonsLabel: str(section.addonsLabel),
    addonsTitle: str(section.addonsTitle),
    addonsSubtitle: str(section.addonsSubtitle),
    addonDesignTitle: str(section.addonDesignTitle),
    addonDesignBody: str(section.addonDesignBody),
    addonTranslatorTitle: str(section.addonTranslatorTitle),
    addonTranslatorBody: str(section.addonTranslatorBody),
    plannedTag: str(section.plannedTag),
    ctaTitle: str(section.ctaTitle),
    ctaBody: str(section.ctaBody),
    ctaButton: str(section.ctaButton),
  };
}
