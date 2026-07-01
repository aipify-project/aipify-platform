import type { MarketingDictionary } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";

export type HomepageOutcome = { title: string; description: string };
export type HomepageFlowStep = { title: string; description: string };
export type HomepagePack = { id: string; name: string; audience: string; value: string; href: string };
export type HomepageCompanionCapability = { title: string; description: string };
export type HomepagePracticeExample = {
  title: string;
  challenge: string;
  coordination: string;
  outcome: string;
};
export type HomepagePlanOverview = { name: string; description: string };

export type CommandBriefMockupLabels = {
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
  illustrativeLabel?: string;
  title?: string;
  subtitle?: string;
  panelOrganization?: string;
  panelContext?: string;
  headerBadge?: string;
};

export type CommandBriefDemoLabels = CommandBriefMockupLabels;

export type HomepageRedesignContent = {
  hero: {
    badge: string;
    title: string;
    headline: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  commandBrief: CommandBriefMockupLabels;
  trustFoundation: {
    items: HomepageOutcome[];
  };
  problemOutcome: {
    title: string;
    problemLabel: string;
    problem: string;
    outcomeLabel: string;
    outcome: string;
  };
  simpleFlow: {
    title: string;
    subtitle: string;
    learnMore: string;
    permissionNote: string;
    steps: HomepageFlowStep[];
  };
  businessPacks: {
    title: string;
    subtitle: string;
    viewDetails: string;
    exploreAll: string;
    packs: HomepagePack[];
  };
  companion: {
    title: string;
    subtitle: string;
    learnMore: string;
    capabilities: HomepageCompanionCapability[];
  };
  enterpriseTrust: {
    title: string;
    subtitle: string;
    exploreEnterprise: string;
    points: { title: string; description: string }[];
  };
  practice: {
    title: string;
    subtitle: string;
    illustrativeLabel: string;
    exampleLabel: string;
    examples: HomepagePracticeExample[];
  };
  buyingJourney: {
    title: string;
    subtitle: string;
    footnote: string;
    comparePlans: string;
    plans: HomepagePlanOverview[];
  };
  finalCta: {
    title: string;
    subtitle: string;
    bookDemo: string;
    talkToAipify: string;
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

function parseTrustPoints(section: Record<string, unknown> | undefined): { title: string; description: string }[] {
  const raw = section?.points;
  if (!raw || typeof raw !== "object") return [];
  return Object.values(raw as Record<string, { title?: string; description?: string }>).map((p) => ({
    title: p.title ?? "",
    description: p.description ?? "",
  }));
}

function parsePracticeExamples(section: Record<string, unknown> | undefined): HomepagePracticeExample[] {
  const raw = section?.examples;
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const item = (raw as Record<string, HomepagePracticeExample>)[k] ?? ({} as HomepagePracticeExample);
      return {
        title: item.title ?? "",
        challenge: item.challenge ?? "",
        coordination: item.coordination ?? "",
        outcome: item.outcome ?? "",
      };
    });
}

function parsePlans(section: Record<string, unknown> | undefined): HomepagePlanOverview[] {
  const raw = section?.plans;
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const item = (raw as Record<string, { name?: string; description?: string }>)[k] ?? {};
      return { name: item.name ?? "", description: item.description ?? "" };
    });
}

/** Launch-ready packs shown on homepage (max four). */
const CURATED_PACK_IDS = ["support", "hosts", "commerce", "services"] as const;

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

function parseCommandBrief(section: Record<string, unknown> | undefined): CommandBriefMockupLabels {
  const s = section as Record<string, string> | undefined;
  return {
    panelTitle: String(s?.panelTitle ?? "Command Brief"),
    sinceLastLogin: String(s?.sinceLastLogin ?? "Since your last visit"),
    aipifyCompleted: String(s?.aipifyCompleted ?? "Aipify completed"),
    needsAttention: String(s?.needsAttention ?? "Requires your attention"),
    recommendedActions: String(s?.recommendedActions ?? "Recommended actions"),
    organizationStatus: String(s?.organizationStatus ?? "Organization status"),
    illustrativeLabel: String(s?.illustrativeLabel ?? "Illustrative product view"),
    title: s?.title ? String(s.title) : undefined,
    subtitle: s?.subtitle ? String(s.subtitle) : undefined,
    sinceItems: parseStringListFromRecord(section, "sinceItems"),
    completedItems: parseStringListFromRecord(section, "completedItems"),
    attentionItems: parseStringListFromRecord(section, "attentionItems"),
    actionItems: parseStringListFromRecord(section, "actionItems"),
    statusItems: parseStringListFromRecord(section, "statusItems"),
  };
}

export function parseHomepageRedesign(marketing: MarketingDictionary): HomepageRedesignContent {
  const hp = getSection<Record<string, unknown>>(marketing, "homepageRedesign");
  const heroFallback = getSection<Record<string, string>>(marketing, "hero");
  const cta = getSection<Record<string, string>>(marketing, "ctaBand");
  const heroSection = hp.hero as Record<string, string> | undefined;

  return {
    hero: {
      badge: String(heroSection?.badge ?? heroFallback.badge ?? "Aipify Business Operating System"),
      title: String(heroSection?.title ?? "Aipify works for you."),
      headline: String(
        heroSection?.headline ?? heroFallback.title ?? "Business Operating System for modern organizations."
      ),
      description: String(
        heroSection?.description ??
          "Aipify brings operations, support, knowledge, governance and approved workflows into one coordinated platform — so the organization can see what changed, what needs attention and what should happen next."
      ),
      ctaPrimary: String(heroSection?.ctaPrimary ?? heroFallback.ctaPrimary ?? "Book demo"),
      ctaSecondary: String(heroSection?.ctaSecondary ?? "See Aipify in action"),
    },
    commandBrief: parseCommandBrief(hp.commandBrief as Record<string, unknown> | undefined),
    trustFoundation: {
      items: parseOutcomes(hp.trustFoundation as Record<string, unknown> | undefined),
    },
    problemOutcome: {
      title: String((hp.problemOutcome as Record<string, string> | undefined)?.title ?? ""),
      problemLabel: String((hp.problemOutcome as Record<string, string> | undefined)?.problemLabel ?? "The problem"),
      problem: String((hp.problemOutcome as Record<string, string> | undefined)?.problem ?? ""),
      outcomeLabel: String((hp.problemOutcome as Record<string, string> | undefined)?.outcomeLabel ?? "The Aipify outcome"),
      outcome: String((hp.problemOutcome as Record<string, string> | undefined)?.outcome ?? ""),
    },
    simpleFlow: {
      title: String((hp.simpleFlow as Record<string, string> | undefined)?.title ?? "How Aipify works"),
      subtitle: String((hp.simpleFlow as Record<string, string> | undefined)?.subtitle ?? ""),
      learnMore: String((hp.simpleFlow as Record<string, string> | undefined)?.learnMore ?? "Learn how Aipify works"),
      permissionNote: String(
        (hp.simpleFlow as Record<string, string> | undefined)?.permissionNote ??
          "Aipify can do anything it has permission to do."
      ),
      steps: parseFlowSteps(hp.simpleFlow as Record<string, unknown> | undefined),
    },
    businessPacks: {
      title: String((hp.businessPacks as Record<string, string> | undefined)?.title ?? ""),
      subtitle: String((hp.businessPacks as Record<string, string> | undefined)?.subtitle ?? ""),
      viewDetails: String((hp.businessPacks as Record<string, string> | undefined)?.viewDetails ?? "View details"),
      exploreAll: String((hp.businessPacks as Record<string, string> | undefined)?.exploreAll ?? "Explore Business Packs"),
      packs: parsePacks(hp.businessPacks as Record<string, unknown> | undefined),
    },
    companion: {
      title: String((hp.companion as Record<string, string> | undefined)?.title ?? "One Aipify, connected to your operations."),
      subtitle: String((hp.companion as Record<string, string> | undefined)?.subtitle ?? ""),
      learnMore: String((hp.companion as Record<string, string> | undefined)?.learnMore ?? "Explore the platform"),
      capabilities: parseCompanionCapabilities(hp.companion as Record<string, unknown> | undefined),
    },
    enterpriseTrust: {
      title: String((hp.enterpriseTrust as Record<string, string> | undefined)?.title ?? ""),
      subtitle: String((hp.enterpriseTrust as Record<string, string> | undefined)?.subtitle ?? ""),
      exploreEnterprise: String((hp.enterpriseTrust as Record<string, string> | undefined)?.exploreEnterprise ?? "Explore Enterprise"),
      points: parseTrustPoints(hp.enterpriseTrust as Record<string, unknown> | undefined),
    },
    practice: {
      title: String((hp.practice as Record<string, string> | undefined)?.title ?? "Aipify in practice"),
      subtitle: String((hp.practice as Record<string, string> | undefined)?.subtitle ?? ""),
      illustrativeLabel: String((hp.practice as Record<string, string> | undefined)?.illustrativeLabel ?? "Illustrative product view"),
      exampleLabel: String((hp.practice as Record<string, string> | undefined)?.exampleLabel ?? "Operational example"),
      examples: parsePracticeExamples(hp.practice as Record<string, unknown> | undefined),
    },
    buyingJourney: {
      title: String((hp.buyingJourney as Record<string, string> | undefined)?.title ?? ""),
      subtitle: String((hp.buyingJourney as Record<string, string> | undefined)?.subtitle ?? ""),
      footnote: String((hp.buyingJourney as Record<string, string> | undefined)?.footnote ?? ""),
      comparePlans: String((hp.buyingJourney as Record<string, string> | undefined)?.comparePlans ?? "Compare plans"),
      plans: parsePlans(hp.buyingJourney as Record<string, unknown> | undefined),
    },
    finalCta: {
      title: String((hp.finalCta as Record<string, string> | undefined)?.title ?? cta.title ?? ""),
      subtitle: String((hp.finalCta as Record<string, string> | undefined)?.subtitle ?? cta.subtitle ?? ""),
      bookDemo: String((hp.finalCta as Record<string, string> | undefined)?.bookDemo ?? cta.bookDemo ?? "Book demo"),
      talkToAipify: String((hp.finalCta as Record<string, string> | undefined)?.talkToAipify ?? "Talk to Aipify"),
    },
  };
}
