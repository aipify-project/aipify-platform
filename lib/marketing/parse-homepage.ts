import type { MarketingDictionary } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";

export type HomepageOutcome = { title: string; description: string };
export type HomepageFlowStep = { title: string; description: string };
export type HomepagePack = { id: string; name: string; audience: string; value: string; href: string };
export type HomepageCompanionCapability = { title: string; description: string };

export type HomepageRedesignContent = {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    benefits: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    explorePacks: string;
  };
  commandBrief: {
    title: string;
    subtitle: string;
    panelTitle: string;
    sinceLastLogin: string;
    aipifyCompleted: string;
    needsAttention: string;
    recommendedActions: string;
    organizationStatus: string;
    sinceItems: string[];
    completedItems: string[];
    attentionItems: string[];
    actionItems: string[];
    statusItems: string[];
  };
  coreOutcomes: {
    title: string;
    items: HomepageOutcome[];
  };
  simpleFlow: {
    title: string;
    subtitle: string;
    learnMore: string;
    steps: HomepageFlowStep[];
  };
  businessPacks: {
    title: string;
    subtitle: string;
    viewDetails: string;
    exploreAll: string;
    packs: HomepagePack[];
  };
  workflowDemo: {
    title: string;
    subtitle: string;
    steps: { title: string; detail: string }[];
  };
  enterpriseTrust: {
    title: string;
    subtitle: string;
    exploreEnterprise: string;
    points: { title: string; description: string }[];
  };
  companion: {
    title: string;
    subtitle: string;
    learnMore: string;
    capabilities: HomepageCompanionCapability[];
  };
  finalCta: {
    title: string;
    subtitle: string;
    bookDemo: string;
    earlyAccess: string;
    earlyAccessDivider: string;
  };
};

function parseStringListFromRecord(
  section: Record<string, unknown> | undefined,
  key: string
): string[] {
  const raw = section?.[key];
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => String((raw as Record<string, string>)[k] ?? ""));
}

function parseOutcomes(section: Record<string, unknown> | undefined): HomepageOutcome[] {
  const raw = section?.items;
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const item = (raw as Record<string, { title?: string; description?: string }>)[k] ?? {};
      return { title: item.title ?? "", description: item.description ?? "" };
    });
}

function parseFlowSteps(section: Record<string, unknown> | undefined): HomepageFlowStep[] {
  const raw = section?.steps;
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const item = (raw as Record<string, { title?: string; description?: string }>)[k] ?? {};
      return { title: item.title ?? "", description: item.description ?? "" };
    });
}

function parseDemoSteps(section: Record<string, unknown> | undefined): { title: string; detail: string }[] {
  const raw = section?.steps;
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const item = (raw as Record<string, { title?: string; detail?: string }>)[k] ?? {};
      return { title: item.title ?? "", detail: item.detail ?? "" };
    });
}

function parseTrustPoints(section: Record<string, unknown> | undefined): { title: string; description: string }[] {
  const raw = section?.points;
  if (!raw || typeof raw !== "object") return [];
  return Object.values(raw as Record<string, { title?: string; description?: string }>).map((p) => ({
    title: p.title ?? "",
    description: p.description ?? "",
  }));
}

const CURATED_PACK_IDS = ["hosts", "support", "commerce", "services", "projects", "finance"] as const;

function parsePacks(section: Record<string, unknown> | undefined): HomepagePack[] {
  const raw = section?.packs;
  if (!raw || typeof raw !== "object") return [];
  return CURATED_PACK_IDS.flatMap((id) => {
    const pack = (raw as Record<string, { name?: string; audience?: string; value?: string; href?: string }>)[id];
    if (!pack) return [];
    return [
      {
        id,
        name: pack.name ?? id,
        audience: pack.audience ?? "",
        value: pack.value ?? "",
        href: pack.href ?? `/business-packs/${id}`,
      },
    ];
  });
}

function parseCompanionCapabilities(section: Record<string, unknown> | undefined): HomepageCompanionCapability[] {
  const raw = section?.capabilities;
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort()
    .map((k) => {
      const item = (raw as Record<string, { title?: string; description?: string }>)[k] ?? {};
      return { title: item.title ?? k, description: item.description ?? "" };
    });
}

export function parseHomepageRedesign(marketing: MarketingDictionary): HomepageRedesignContent {
  const hp = getSection<Record<string, unknown>>(marketing, "homepageRedesign");
  const heroFallback = getSection<Record<string, string>>(marketing, "hero");
  const cta = getSection<Record<string, string>>(marketing, "ctaBand");

  return {
    hero: {
      badge: String(hp.hero && typeof hp.hero === "object" ? (hp.hero as Record<string, string>).badge : heroFallback.badge ?? ""),
      title: String(hp.hero && typeof hp.hero === "object" ? (hp.hero as Record<string, string>).title : heroFallback.title ?? ""),
      subtitle: String(hp.hero && typeof hp.hero === "object" ? (hp.hero as Record<string, string>).subtitle : heroFallback.subtitle ?? ""),
      benefits: parseStringListFromRecord(hp.hero as Record<string, unknown> | undefined, "benefits"),
      ctaPrimary: String(hp.hero && typeof hp.hero === "object" ? (hp.hero as Record<string, string>).ctaPrimary : heroFallback.ctaPrimary ?? "Book Demo"),
      ctaSecondary: String(hp.hero && typeof hp.hero === "object" ? (hp.hero as Record<string, string>).ctaSecondary : heroFallback.ctaSecondary ?? "See How Aipify Works"),
      explorePacks: String(hp.hero && typeof hp.hero === "object" ? (hp.hero as Record<string, string>).explorePacks : "Explore Business Packs"),
    },
    commandBrief: {
      title: String((hp.commandBrief as Record<string, string> | undefined)?.title ?? "Your organization, summarized before you start the day."),
      subtitle: String((hp.commandBrief as Record<string, string> | undefined)?.subtitle ?? ""),
      panelTitle: String((hp.commandBrief as Record<string, string> | undefined)?.panelTitle ?? "Command Brief"),
      sinceLastLogin: String((hp.commandBrief as Record<string, string> | undefined)?.sinceLastLogin ?? "Since last login"),
      aipifyCompleted: String((hp.commandBrief as Record<string, string> | undefined)?.aipifyCompleted ?? "Aipify completed"),
      needsAttention: String((hp.commandBrief as Record<string, string> | undefined)?.needsAttention ?? "Needs your attention"),
      recommendedActions: String((hp.commandBrief as Record<string, string> | undefined)?.recommendedActions ?? "Recommended actions"),
      organizationStatus: String((hp.commandBrief as Record<string, string> | undefined)?.organizationStatus ?? "Organization status"),
      sinceItems: parseStringListFromRecord(hp.commandBrief as Record<string, unknown> | undefined, "sinceItems"),
      completedItems: parseStringListFromRecord(hp.commandBrief as Record<string, unknown> | undefined, "completedItems"),
      attentionItems: parseStringListFromRecord(hp.commandBrief as Record<string, unknown> | undefined, "attentionItems"),
      actionItems: parseStringListFromRecord(hp.commandBrief as Record<string, unknown> | undefined, "actionItems"),
      statusItems: parseStringListFromRecord(hp.commandBrief as Record<string, unknown> | undefined, "statusItems"),
    },
    coreOutcomes: {
      title: String((hp.coreOutcomes as Record<string, string> | undefined)?.title ?? ""),
      items: parseOutcomes(hp.coreOutcomes as Record<string, unknown> | undefined),
    },
    simpleFlow: {
      title: String((hp.simpleFlow as Record<string, string> | undefined)?.title ?? "How Aipify works"),
      subtitle: String((hp.simpleFlow as Record<string, string> | undefined)?.subtitle ?? ""),
      learnMore: String((hp.simpleFlow as Record<string, string> | undefined)?.learnMore ?? "Learn how Aipify works"),
      steps: parseFlowSteps(hp.simpleFlow as Record<string, unknown> | undefined),
    },
    businessPacks: {
      title: String((hp.businessPacks as Record<string, string> | undefined)?.title ?? ""),
      subtitle: String((hp.businessPacks as Record<string, string> | undefined)?.subtitle ?? ""),
      viewDetails: String((hp.businessPacks as Record<string, string> | undefined)?.viewDetails ?? "View details"),
      exploreAll: String((hp.businessPacks as Record<string, string> | undefined)?.exploreAll ?? "Explore all Business Packs"),
      packs: parsePacks(hp.businessPacks as Record<string, unknown> | undefined),
    },
    workflowDemo: {
      title: String((hp.workflowDemo as Record<string, string> | undefined)?.title ?? ""),
      subtitle: String((hp.workflowDemo as Record<string, string> | undefined)?.subtitle ?? ""),
      steps: parseDemoSteps(hp.workflowDemo as Record<string, unknown> | undefined),
    },
    enterpriseTrust: {
      title: String((hp.enterpriseTrust as Record<string, string> | undefined)?.title ?? ""),
      subtitle: String((hp.enterpriseTrust as Record<string, string> | undefined)?.subtitle ?? ""),
      exploreEnterprise: String((hp.enterpriseTrust as Record<string, string> | undefined)?.exploreEnterprise ?? "Explore Enterprise"),
      points: parseTrustPoints(hp.enterpriseTrust as Record<string, unknown> | undefined),
    },
    companion: {
      title: String((hp.companion as Record<string, string> | undefined)?.title ?? "Companion, not chatbot."),
      subtitle: String((hp.companion as Record<string, string> | undefined)?.subtitle ?? ""),
      learnMore: String((hp.companion as Record<string, string> | undefined)?.learnMore ?? "Learn about Companion"),
      capabilities: parseCompanionCapabilities(hp.companion as Record<string, unknown> | undefined),
    },
    finalCta: {
      title: String((hp.finalCta as Record<string, string> | undefined)?.title ?? cta.title ?? ""),
      subtitle: String((hp.finalCta as Record<string, string> | undefined)?.subtitle ?? cta.subtitle ?? ""),
      bookDemo: String((hp.finalCta as Record<string, string> | undefined)?.bookDemo ?? cta.bookDemo ?? "Book Demo"),
      earlyAccess: String((hp.finalCta as Record<string, string> | undefined)?.earlyAccess ?? cta.earlyAccess ?? "Early Access"),
      earlyAccessDivider: String(
        (hp.finalCta as Record<string, string> | undefined)?.earlyAccessDivider ?? "Or request early access"
      ),
    },
  };
}
