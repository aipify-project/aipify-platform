import type { MarketingDictionary } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";
import type { MarketingBusinessPackSlug } from "./registry";

export type BusinessPackDetailOutcome = { title: string; body: string };
export type BusinessPackDetailStep = { title: string; body: string };

export type BusinessPackDetailPackContent = {
  name: string;
  label: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  introduction: string;
  heroCapabilities: string[];
  outcomes: BusinessPackDetailOutcome[];
  capabilities: string[];
  steps: BusinessPackDetailStep[];
  governanceTitle: string;
  governanceBody: string;
  whoForTitle: string;
  whoForBody: string;
  planActivationTitle: string;
  planActivationBody: string;
  primaryCta: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
};

export type BusinessPackDetailSharedLabels = {
  breadcrumbs: { home: string; businessPacks: string };
  availableFrom: string;
  commercialTypes: { addon: string; tailored_addon: string };
  sections: {
    businessValue: string;
    capabilities: string;
    howItWorks: string;
    governance: string;
    whoFor: string;
    planActivation: string;
    relatedPacks: string;
    heroPanel: string;
  };
  ctas: {
    bookDemo: string;
    viewDetails: string;
    exploreBusinessPacks: string;
  };
  planNames: Record<string, string>;
  notFound: {
    title: string;
    subtitle: string;
    backToPacks: string;
    bookDemo: string;
    contact: string;
  };
};

function recordValues<T>(raw: Record<string, T> | undefined): T[] {
  if (!raw) return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => raw[key]);
}

function parseOutcomes(raw: Record<string, { title?: string; body?: string }> | undefined): BusinessPackDetailOutcome[] {
  return recordValues(raw).map((item) => ({
    title: item.title ?? "",
    body: item.body ?? "",
  }));
}

function parseSteps(raw: Record<string, { title?: string; body?: string }> | undefined): BusinessPackDetailStep[] {
  return recordValues(raw).map((item) => ({
    title: item.title ?? "",
    body: item.body ?? "",
  }));
}

function parseStringList(raw: Record<string, string> | undefined): string[] {
  return recordValues(raw).filter(Boolean);
}

export function parseBusinessPackDetailSharedLabels(marketing: MarketingDictionary): BusinessPackDetailSharedLabels {
  const shared = getSection<Record<string, unknown>>(marketing, "businessPackDetailPages.shared");

  const breadcrumbs = (shared.breadcrumbs ?? {}) as Record<string, string>;
  const commercialTypes = (shared.commercialTypes ?? {}) as Record<string, string>;
  const sections = (shared.sections ?? {}) as Record<string, string>;
  const ctas = (shared.ctas ?? {}) as Record<string, string>;
  const planNames = (shared.planNames ?? {}) as Record<string, string>;
  const notFound = (shared.notFound ?? {}) as Record<string, string>;

  return {
    breadcrumbs: {
      home: breadcrumbs.home ?? "Home",
      businessPacks: breadcrumbs.businessPacks ?? "Business Packs",
    },
    availableFrom: String(shared.availableFrom ?? "Available from"),
    commercialTypes: {
      addon: commercialTypes.addon ?? "Add-on",
      tailored_addon: commercialTypes.tailored_addon ?? "Tailored add-on",
    },
    sections: {
      businessValue: sections.businessValue ?? "Business value",
      capabilities: sections.capabilities ?? "What Aipify helps with",
      howItWorks: sections.howItWorks ?? "How it works",
      governance: sections.governance ?? "Governance and control",
      whoFor: sections.whoFor ?? "Who it is for",
      planActivation: sections.planActivation ?? "Plan and activation",
      relatedPacks: sections.relatedPacks ?? "Related Business Packs",
      heroPanel: sections.heroPanel ?? "Pack capabilities",
    },
    ctas: {
      bookDemo: ctas.bookDemo ?? "Book a demo",
      viewDetails: ctas.viewDetails ?? "View details",
      exploreBusinessPacks: ctas.exploreBusinessPacks ?? "Explore Business Packs",
    },
    planNames: {
      starter: planNames.starter ?? "Starter",
      professional: planNames.professional ?? "Professional",
      business: planNames.business ?? "Business",
      enterprise: planNames.enterprise ?? "Enterprise",
    },
    notFound: {
      title: notFound.title ?? "This Business Pack page is not available",
      subtitle:
        notFound.subtitle ??
        "The pack you requested is not in our public catalog. Explore available Business Packs or speak with Aipify.",
      backToPacks: notFound.backToPacks ?? "View Business Packs",
      bookDemo: notFound.bookDemo ?? "Book a demo",
      contact: notFound.contact ?? "Contact Aipify",
    },
  };
}

export function parseBusinessPackDetailPackContent(
  marketing: MarketingDictionary,
  slug: MarketingBusinessPackSlug,
): BusinessPackDetailPackContent | null {
  const root = getSection<{ packs?: Record<string, Record<string, unknown>> }>(marketing, "businessPackDetailPages");
  const raw = root.packs?.[slug];
  if (!raw?.name) return null;

  return {
    name: String(raw.name),
    label: String(raw.label ?? raw.name),
    metaTitle: String(raw.metaTitle ?? raw.name),
    metaDescription: String(raw.metaDescription ?? ""),
    headline: String(raw.headline ?? raw.name),
    introduction: String(raw.introduction ?? ""),
    heroCapabilities: parseStringList(raw.heroCapabilities as Record<string, string>),
    outcomes: parseOutcomes(raw.outcomes as Record<string, { title?: string; body?: string }>),
    capabilities: parseStringList(raw.capabilities as Record<string, string>),
    steps: parseSteps(raw.steps as Record<string, { title?: string; body?: string }>),
    governanceTitle: String(raw.governanceTitle ?? ""),
    governanceBody: String(raw.governanceBody ?? ""),
    whoForTitle: String(raw.whoForTitle ?? ""),
    whoForBody: String(raw.whoForBody ?? ""),
    planActivationTitle: String(raw.planActivationTitle ?? ""),
    planActivationBody: String(raw.planActivationBody ?? ""),
    primaryCta: String(raw.primaryCta ?? "Get Aipify today"),
    finalCtaTitle: String(raw.finalCtaTitle ?? "Ready to move forward?"),
    finalCtaSubtitle: String(raw.finalCtaSubtitle ?? ""),
  };
}
