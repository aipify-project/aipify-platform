import type { MarketingDictionary } from "./get-marketing-context";
import {
  formatMarketingTrustMetricValue,
  getMarketingTrustMetricValues,
} from "./trust-metrics";

export function recordValues<T>(obj: Record<string, T> | undefined): T[] {
  if (!obj) return [];
  return Object.keys(obj)
    .sort((a, b) => {
      const na = Number(a);
      const nb = Number(b);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    })
    .map((key) => obj[key]);
}

export function getSection<T>(marketing: MarketingDictionary, key: string): T {
  return (marketing[key] ?? {}) as T;
}

export function parseDemoSteps(
  marketing: MarketingDictionary
): Array<{ title: string; detail: string }> {
  const section = getSection<{ steps?: Record<string, { title: string; detail: string }> }>(
    marketing,
    "animatedDemo"
  );
  return recordValues(section.steps);
}

export function parseWorkSteps(
  marketing: MarketingDictionary
): Array<{ title: string; description: string }> {
  const section = getSection<{ steps?: Record<string, { title: string; description: string }> }>(
    marketing,
    "howItWorks"
  );
  return recordValues(section.steps).map(({ title, description }) => ({ title, description }));
}

export function parseModules(
  marketing: MarketingDictionary
): Array<{ name: string; description: string }> {
  const section = getSection<{ items?: Record<string, { name: string; description: string }> }>(
    marketing,
    "modules"
  );
  return recordValues(section.items).map(({ name, description }) => ({ name, description }));
}

export function parseTrustPoints(
  marketing: MarketingDictionary
): Array<{ title: string; description: string }> {
  const section = getSection<{ points?: Record<string, { title: string; description: string }> }>(
    marketing,
    "enterpriseTrust"
  );
  return recordValues(section.points).map(({ title, description }) => ({ title, description }));
}

export function parsePilotHighlights(marketing: MarketingDictionary): string[] {
  const section = getSection<{ highlights?: Record<string, string> }>(marketing, "pilot");
  return recordValues(section.highlights);
}

export function parseHeroOutcomes(marketing: MarketingDictionary): string[] {
  const section = getSection<{ outcomes?: Record<string, string> }>(marketing, "hero");
  return recordValues(section.outcomes);
}

export function parseValueStripCards(
  marketing: MarketingDictionary
): Array<{ title: string; description: string }> {
  const section = getSection<{ cards?: Record<string, { title: string; description: string }> }>(
    marketing,
    "valueStrip"
  );
  return recordValues(section.cards);
}

export function parseTrustBarCards(
  marketing: MarketingDictionary
): Array<{ title: string; description: string }> {
  const section = getSection<{ cards?: Record<string, { title: string; description: string }> }>(
    marketing,
    "trustBar"
  );
  return recordValues(section.cards);
}

export function parseStringList(marketing: MarketingDictionary, sectionKey: string, listKey: string): string[] {
  const section = getSection<Record<string, Record<string, string>>>(marketing, sectionKey);
  return recordValues(section[listKey]);
}

export function parseParagraphs(marketing: MarketingDictionary, sectionKey: string): string[] {
  const section = getSection<{ paragraphs?: Record<string, string> }>(marketing, sectionKey);
  return recordValues(section.paragraphs);
}

export function parseJourneySteps(
  marketing: MarketingDictionary,
  sectionKey = "customerJourney"
): Array<{ title: string; description: string }> {
  const section = getSection<{ steps?: Record<string, { title: string; description: string }> }>(
    marketing,
    sectionKey
  );
  return recordValues(section.steps);
}

export function parseOutputs(marketing: MarketingDictionary): string[] {
  const section = getSection<{ items?: Record<string, string> }>(marketing, "outputs");
  return recordValues(section.items);
}

export function parseOversightLadder(
  marketing: MarketingDictionary
): Array<{ label: string; description: string }> {
  const section = getSection<{ ladder?: Record<string, { label: string; description: string }> }>(
    marketing,
    "humanOversight"
  );
  return recordValues(section.ladder).map(({ label, description }) => ({ label, description }));
}

const ORB_STATE_ALIASES: Record<string, string> = {
  report_ready: "attention",
  approval_required: "attention",
};

export function parseOrbStates(
  marketing: MarketingDictionary
): Record<string, { label: string; description: string }> {
  const section = getSection<{ states?: Record<string, { label: string; description: string }> }>(
    marketing,
    "companionOrb"
  );
  const raw = section.states ?? {};
  const normalized: Record<string, { label: string; description: string }> = {};

  for (const [key, value] of Object.entries(raw)) {
    const target = ORB_STATE_ALIASES[key] ?? key;
    if (!normalized[target]) normalized[target] = value;
  }

  return normalized;
}

function parseNamedItems(
  marketing: MarketingDictionary,
  sectionKey: string,
  itemsKey: string
): Array<{ name: string; description: string }> {
  const section = getSection<Record<string, Record<string, { name?: string; description?: string; title?: string }>>>(
    marketing,
    sectionKey
  );
  const items = section[itemsKey] ?? {};
  return recordValues(items).map((item) => ({
    name: String(item.name ?? item.title ?? ""),
    description: String(item.description ?? ""),
  }));
}

function parseLabeledItems(
  marketing: MarketingDictionary,
  sectionKey: string,
  itemsKey: string
): Array<{ label: string; description: string }> {
  const section = getSection<Record<string, Record<string, { label?: string; description?: string }>>>(
    marketing,
    sectionKey
  );
  const items = section[itemsKey] ?? {};
  return recordValues(items).map((item) => ({
    label: String(item.label ?? ""),
    description: String(item.description ?? ""),
  }));
}

export function parsePlatformPreview(marketing: MarketingDictionary) {
  return parseLabeledItems(marketing, "platformAuthority", "preview");
}

export function parseArchitectureLayers(marketing: MarketingDictionary) {
  return parseLabeledItems(marketing, "platformAuthority", "layers");
}

export function parsePlatformEngines(marketing: MarketingDictionary) {
  return parseNamedItems(marketing, "platformAuthority", "engines");
}

export function parseConfidenceItems(marketing: MarketingDictionary) {
  return parseNamedItems(marketing, "platformAuthority", "confidence");
}

export function parsePlatformMapNodes(marketing: MarketingDictionary) {
  return parseNamedItems(marketing, "platformAuthority", "mapNodes");
}

export function parseDifferentiationItems(
  marketing: MarketingDictionary
): Array<{ question: string; answer: string }> {
  const section = getSection<{ questions?: Record<string, { q: string; a: string }> }>(
    marketing,
    "platformAuthority"
  );
  return recordValues(section.questions).map(({ q, a }) => ({ question: q, answer: a }));
}

export function parsePartnerAuthorityBadges(marketing: MarketingDictionary) {
  return parseNamedItems(marketing, "platformAuthority", "partnerBadges");
}

export function parsePartnerAuthorityStats(marketing: MarketingDictionary) {
  const section = getSection<{ partnerStats?: Record<string, { value: string; label: string }> }>(
    marketing,
    "platformAuthority"
  );
  return recordValues(section.partnerStats);
}

export function parseBeforeAfter(
  marketing: MarketingDictionary,
  sectionKey: string
): { before: string[]; after: string[] } {
  const section = getSection<{ before?: Record<string, string>; after?: Record<string, string> }>(
    marketing,
    sectionKey
  );
  return {
    before: recordValues(section.before),
    after: recordValues(section.after),
  };
}

export function parseTitleDescriptionCards(
  marketing: MarketingDictionary,
  sectionKey: string,
  cardsKey: string
): Array<{ title: string; description: string }> {
  const section = getSection<Record<string, Record<string, { title: string; description: string }>>>(
    marketing,
    sectionKey
  );
  return recordValues(section[cardsKey]);
}

export function parseNamedDescriptionItems(
  marketing: MarketingDictionary,
  sectionKey: string,
  itemsKey: string
): Array<{ name: string; description: string }> {
  const section = getSection<Record<string, Record<string, { name: string; description: string }>>>(
    marketing,
    sectionKey
  );
  return recordValues(section[itemsKey]);
}

export function parseCtaBandLabels(marketing: MarketingDictionary): {
  title: string;
  subtitle: string;
  bookDemo: string;
  earlyAccess: string;
  growthPartners: string;
} {
  const ctaBand = getSection<Record<string, string>>(marketing, "ctaBand");
  const primaryCtas = getSection<Record<string, string>>(marketing, "primaryCtas");
  return {
    title: ctaBand.title ?? "",
    subtitle: ctaBand.subtitle ?? "",
    bookDemo: ctaBand.bookDemo ?? primaryCtas.bookDemo ?? "Book Demo",
    earlyAccess: ctaBand.earlyAccess ?? primaryCtas.earlyAccess ?? "Request Early Access",
    growthPartners: ctaBand.growthPartners ?? primaryCtas.growthPartners ?? "Become Growth Partner",
  };
}

export function parseCategoryPositioningIntro(marketing: MarketingDictionary) {
  const categoryStatement = getSection<Record<string, string>>(marketing, "categoryStatement");
  const whatIsBos = getSection<Record<string, string>>(marketing, "whatIsBos");

  return {
    categoryStatement: {
      title: categoryStatement.title ?? "",
      negations: parseStringList(marketing, "categoryStatement", "negations"),
      affirmation: categoryStatement.affirmation ?? "",
      closing: categoryStatement.closing ?? "",
    },
    whatIsBos: {
      title: whatIsBos.title ?? "",
      paragraphs: parseParagraphs(marketing, "whatIsBos"),
    },
  };
}

const TRUST_METRIC_ORDER = [
  "businessPacks",
  "operationalModules",
  "knowledgeAssets",
  "approvalWorkflows",
  "supportedLanguages",
  "governanceControls",
] as const;

export function buildMarketingTrustMetricCards(
  marketing: MarketingDictionary
): Array<{ label: string; value: string }> {
  const { labels } = getSection<{ labels?: Record<string, string> }>(marketing, "trustMetrics");
  const labelMap = labels ?? {};
  const values = getMarketingTrustMetricValues();

  return TRUST_METRIC_ORDER.map((key) => ({
    label: labelMap[key] ?? key,
    value: formatMarketingTrustMetricValue(key, values[key]),
  }));
}

export function parseHumanDifferenceContent(marketing: MarketingDictionary) {
  const section = getSection<Record<string, string>>(marketing, "humanDifference");
  return {
    title: section.title ?? "",
    paragraphs: parseParagraphs(marketing, "humanDifference"),
  };
}

export function parseProductExplorerItems(marketing: MarketingDictionary) {
  const section = getSection<{
    items?: Record<
      string,
      {
        title: string;
        explanation: string;
        screenshotLabel: string;
        workflow: string;
        value: string;
      }
    >;
  }>(marketing, "productExplorer");
  return recordValues(section.items).map((item, index) => ({
    id: `product-${index + 1}`,
    ...item,
  }));
}

export function parseRoleBenefitProfiles(marketing: MarketingDictionary) {
  const section = getSection<{
    roles?: Record<string, { title: string; benefits?: Record<string, string> }>;
  }>(marketing, "roleBenefits");
  return Object.entries(section.roles ?? {}).map(([id, role]) => ({
    id,
    title: role.title,
    benefits: recordValues(role.benefits),
  }));
}

export function parseBusinessPackExplorerItems(marketing: MarketingDictionary) {
  const section = getSection<{
    packs?: Record<
      string,
      { name: string; purpose: string; capabilities: string; audience: string; benefits: string }
    >;
  }>(marketing, "businessPackExplorer");
  return Object.entries(section.packs ?? {}).map(([id, pack]) => ({ id, ...pack }));
}

export function parseIndustryExplorerItems(marketing: MarketingDictionary) {
  const section = getSection<{
    industries?: Record<string, { name: string; description: string }>;
  }>(marketing, "industryExplorer");
  return recordValues(section.industries);
}

export function parseLiveWorkflowFlows(marketing: MarketingDictionary) {
  const section = getSection<{
    flows?: Record<string, { title: string; steps?: Record<string, string> }>;
  }>(marketing, "liveWorkflows");
  return recordValues(section.flows).map((flow) => ({
    title: flow.title,
    steps: recordValues(flow.steps),
  }));
}

export function parseCompanionConversationExamples(marketing: MarketingDictionary) {
  const section = getSection<{
    examples?: Record<string, { question: string; answer: string }>;
  }>(marketing, "companionConversations");
  return recordValues(section.examples).map((example, index) => ({
    id: `companion-${index + 1}`,
    ...example,
  }));
}

export function parseCategoryDifferenceFlow(marketing: MarketingDictionary) {
  const section = getSection<{
    title?: string;
    traditional?: { label?: string; steps?: Record<string, string> };
    aipify?: { label?: string; steps?: Record<string, string> };
  }>(marketing, "categoryDifferenceFlow");
  return {
    title: section.title ?? "",
    traditional: {
      label: section.traditional?.label ?? "",
      steps: recordValues(section.traditional?.steps),
    },
    aipify: {
      label: section.aipify?.label ?? "",
      steps: recordValues(section.aipify?.steps),
    },
  };
}

export function parseCompanionCapabilities(marketing: MarketingDictionary) {
  const section = getSection<{
    capabilities?: Record<string, { title: string; example: string }>;
  }>(marketing, "whatCompanionDoes");
  return Object.entries(section.capabilities ?? {}).map(([id, capability]) => ({
    id,
    title: capability.title,
    example: capability.example,
  }));
}

export function parseOperationalVisibilityRoles(marketing: MarketingDictionary) {
  const section = getSection<{
    title?: string;
    closing?: string;
    roles?: Record<string, { role: string; need: string; answer: string }>;
  }>(marketing, "operationalVisibility");
  return {
    title: section.title ?? "",
    closing: section.closing ?? "",
    roles: recordValues(section.roles),
  };
}

export function parseCompanionTimelineMilestones(marketing: MarketingDictionary) {
  const section = getSection<{
    milestones?: Record<string, { period: string; description: string }>;
  }>(marketing, "companionTimeline");
  return recordValues(section.milestones);
}

export function parseProcurementQuestions(
  marketing: MarketingDictionary
): Array<{ question: string; answer: string }> {
  const section = getSection<{ items?: Record<string, { q: string; a: string }> }>(
    marketing,
    "procurementQuestions"
  );
  return recordValues(section.items).map(({ q, a }) => ({ question: q, answer: a }));
}

export function parseEnterpriseCtaLabels(marketing: MarketingDictionary): {
  title: string;
  subtitle: string;
  bookEnterpriseDemo: string;
  speakWithAipify: string;
  earlyAccess: string;
} {
  const enterpriseCta = getSection<Record<string, string>>(marketing, "enterpriseCta");
  const ctaBand = getSection<Record<string, string>>(marketing, "ctaBand");
  return {
    title: enterpriseCta.title ?? ctaBand.title ?? "",
    subtitle: enterpriseCta.subtitle ?? ctaBand.subtitle ?? "",
    bookEnterpriseDemo: enterpriseCta.bookEnterpriseDemo ?? "Book Enterprise Demo",
    speakWithAipify: enterpriseCta.speakWithAipify ?? "Speak With Aipify",
    earlyAccess: enterpriseCta.earlyAccess ?? ctaBand.earlyAccess ?? "Request Early Access",
  };
}

export function parseImplementationCtaLabels(marketing: MarketingDictionary): {
  title: string;
  subtitle: string;
  bookDemo: string;
  earlyAccess: string;
  speakWithAipify: string;
} {
  const implementationCta = getSection<Record<string, string>>(marketing, "implementationCta");
  const ctaBand = getSection<Record<string, string>>(marketing, "ctaBand");
  return {
    title: implementationCta.title ?? "",
    subtitle: implementationCta.subtitle ?? "",
    bookDemo: implementationCta.bookDemo ?? ctaBand.bookDemo ?? "Book Demo",
    earlyAccess: implementationCta.earlyAccess ?? ctaBand.earlyAccess ?? "Request Early Access",
    speakWithAipify: implementationCta.speakWithAipify ?? "Speak With Aipify",
  };
}

export function parseFirst30DaysMilestones(marketing: MarketingDictionary) {
  const section = getSection<{
    milestones?: Record<string, { day: string; label: string }>;
  }>(marketing, "getStartedFirst30Days");
  return recordValues(section.milestones);
}

export function parseImplementationStories(marketing: MarketingDictionary) {
  const section = getSection<{
    title?: string;
    stories?: Record<string, { title: string; steps?: Record<string, string> }>;
  }>(marketing, "getStartedStories");
  return {
    title: section.title ?? "",
    stories: recordValues(section.stories).map((story) => ({
      title: story.title,
      steps: recordValues(story.steps),
    })),
  };
}

export function parseGetStartedPageLabels(marketing: MarketingDictionary) {
  const page = getSection<{
    title?: string;
    subtitle?: string;
    meta?: { title?: string; description?: string };
  }>(marketing, "getStartedPage");
  const stories = parseImplementationStories(marketing);
  return {
    meta: {
      title: page.meta?.title ?? "",
      description: page.meta?.description ?? "",
    },
    hero: {
      title: page.title ?? "",
      subtitle: page.subtitle ?? "",
    },
    first30Days: {
      title: getSection<{ title?: string }>(marketing, "getStartedFirst30Days").title ?? "",
      milestones: parseFirst30DaysMilestones(marketing),
    },
    implementationTimeline: {
      title: getSection<{ title?: string }>(marketing, "getStartedTimeline").title ?? "",
      steps: parseStringList(marketing, "getStartedTimeline", "steps"),
    },
    companionOnboarding: {
      title: getSection<{ title?: string }>(marketing, "getStartedCompanion").title ?? "",
      intro: getSection<{ intro?: string }>(marketing, "getStartedCompanion").intro ?? "",
      learns: parseStringList(marketing, "getStartedCompanion", "learns"),
      closing: getSection<{ closing?: string }>(marketing, "getStartedCompanion").closing ?? "",
    },
    businessPackActivation: {
      title: getSection<{ title?: string }>(marketing, "getStartedPackActivation").title ?? "",
      steps: parseStringList(marketing, "getStartedPackActivation", "steps"),
    },
    implementationSupport: {
      title: getSection<{ title?: string }>(marketing, "getStartedSupport").title ?? "",
      items: parseStringList(marketing, "getStartedSupport", "items"),
    },
    timeToValue: {
      title: getSection<{ title?: string }>(marketing, "getStartedTimeToValue").title ?? "",
      outcomes: parseStringList(marketing, "getStartedTimeToValue", "outcomes"),
    },
    companionChecklist: {
      title: getSection<{ title?: string }>(marketing, "getStartedChecklist").title ?? "",
      items: parseStringList(marketing, "getStartedChecklist", "items"),
    },
    customerSuccessJourney: {
      title: getSection<{ title?: string }>(marketing, "getStartedSuccessJourney").title ?? "",
      steps: parseStringList(marketing, "getStartedSuccessJourney", "steps"),
    },
    implementationStories: stories,
    complexityReassurance: {
      title: getSection<{ title?: string }>(marketing, "getStartedComplexity").title ?? "",
      paragraphs: parseParagraphs(marketing, "getStartedComplexity"),
    },
    implementationCta: parseImplementationCtaLabels(marketing),
  };
}
