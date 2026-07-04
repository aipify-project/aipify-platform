import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";
import { isCapabilityHelpQuery } from "./aipify-core-query";
import { isAppNavigationQuery, isProductConceptQuery } from "@/lib/companion-runtime/product-concept";
import type { PlatformCorpusArticleId } from "./types";

export type PlatformProductFoundationTopic =
  | "aipify_overview"
  | "aipify_capabilities"
  | "subscription_pricing"
  | "onboarding_registration"
  | "growth_partners"
  | "business_packs"
  | "app_usage"
  | "support_contact"
  | "team_members";

type ProductTopicDescriptor = {
  topic: PlatformProductFoundationTopic;
  corpusArticleId: PlatformCorpusArticleId;
  signalGroups: readonly (readonly string[])[];
  excludeSignals?: readonly string[];
  minScore: number;
  priority: number;
};

const PRODUCT_TOPIC_DESCRIPTORS: readonly ProductTopicDescriptor[] = [
  {
    topic: "growth_partners",
    corpusArticleId: "growth-partners",
    signalGroups: [
      ["growth partner", "growth partners", "partnerprogram", "partner program"],
      ["partner", "partnership", "resell", "reseller", "forhandler", "affiliate"],
      ["selge", "selger", "sell", "selling"],
    ],
    excludeSignals: ["member", "medlem", "medlemmer", "members"],
    minScore: 30,
    priority: 95,
  },
  {
    topic: "subscription_pricing",
    corpusArticleId: "subscription-pricing",
    signalGroups: [
      ["pricing", "price", "pris", "priser", "kost", "koster", "cost", "subscription", "abonnement"],
    ],
    minScore: 20,
    priority: 90,
  },
  {
    topic: "business_packs",
    corpusArticleId: "business-packs",
    signalGroups: [["business pack", "business packs", "modul", "module", "marketplace pack"]],
    minScore: 20,
    priority: 85,
  },
  {
    topic: "team_members",
    corpusArticleId: "add-team-members",
    signalGroups: [
      ["employee", "employees", "ansatte", "medarbeider", "team member", "team members"],
      ["legge til", "add", "invite", "inviter"],
    ],
    excludeSignals: ["member count", "medlemmer", "how many", "hvor mange"],
    minScore: 25,
    priority: 84,
  },
  {
    topic: "onboarding_registration",
    corpusArticleId: "install-web-app",
    signalGroups: [
      ["register", "registration", "registrer", "registrerer", "signup", "sign up"],
      ["getting started", "kom i gang", "onboard", "onboarding", "establish workspace"],
    ],
    excludeSignals: ["member", "medlem", "medlemmer", "members"],
    minScore: 20,
    priority: 80,
  },
  {
    topic: "support_contact",
    corpusArticleId: "contact-support",
    signalGroups: [
      ["support", "hjelp", "help desk", "contact support", "kontakt support", "henvendelse"],
    ],
    minScore: 20,
    priority: 75,
  },
  {
    topic: "app_usage",
    corpusArticleId: "app-panel-navigation",
    signalGroups: [
      ["app panel", "app-panelet", "app portal", "sidebar", "navigation", "how to use"],
      ["hvordan bruker", "how do i use", "how to use the app"],
    ],
    minScore: 20,
    priority: 70,
  },
  {
    topic: "aipify_capabilities",
    corpusArticleId: "aipify-capabilities",
    signalGroups: [
      ["løsning", "løsninger", "losning", "losninger", "solution", "solutions"],
    ],
    minScore: 25,
    priority: 66,
  },
  {
    topic: "aipify_capabilities",
    corpusArticleId: "aipify-capabilities",
    signalGroups: [
      ["help me", "hjelpe meg", "help with", "capabilities", "funksjoner", "what can"],
      ["gjøre for", "do for", "bedriften", "business", "organization"],
    ],
    minScore: 25,
    priority: 65,
  },
  {
    topic: "aipify_overview",
    corpusArticleId: "aipify-overview",
    signalGroups: [
      ["aipify", "abos"],
      ["what is", "hva er", "about", "overview", "explain", "forklar"],
    ],
    minScore: 25,
    priority: 60,
  },
];

function hasSignal(normalized: string, signal: string): boolean {
  const token = signal.trim().toLowerCase();
  if (!token) return false;
  if (token.includes(" ")) {
    return normalized.includes(token);
  }
  return new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(normalized);
}

function scoreProductTopicDescriptor(normalized: string, descriptor: ProductTopicDescriptor): number {
  if (descriptor.excludeSignals?.some((signal) => hasSignal(normalized, signal))) {
    return 0;
  }

  let score = 0;
  let matchedGroups = 0;

  for (const group of descriptor.signalGroups) {
    if (group.some((signal) => hasSignal(normalized, signal))) {
      matchedGroups += 1;
      score += 30;
    }
  }

  if (descriptor.topic === "aipify_overview" && matchedGroups < 2) {
    return 0;
  }

  if (descriptor.topic === "growth_partners") {
    const hasPartnerCore =
      descriptor.signalGroups.slice(0, 2).some((group) =>
        group.some((signal) => hasSignal(normalized, signal)),
      );
    if (!hasPartnerCore) return 0;
  }

  if (score < descriptor.minScore) return 0;
  return score + descriptor.priority * 0.01;
}

/** Semantic product/foundation topic — not phrase-specific routing. */
export function resolvePlatformProductFoundationTopic(
  query: string,
): PlatformProductFoundationTopic | null {
  const normalized = normalizeIntegrationQuery(query).toLowerCase();
  if (!normalized.trim()) return null;

  const scored = PRODUCT_TOPIC_DESCRIPTORS.map((descriptor) => ({
    topic: descriptor.topic,
    score: scoreProductTopicDescriptor(normalized, descriptor),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored[0]?.topic ?? null;
}

export function resolvePlatformProductCorpusArticleId(
  query: string,
): PlatformCorpusArticleId | null {
  const topic = resolvePlatformProductFoundationTopic(query);
  if (!topic) return null;
  return PRODUCT_TOPIC_DESCRIPTORS.find((descriptor) => descriptor.topic === topic)?.corpusArticleId ?? null;
}

/** Product/platform questions should use foundation corpus — not org intelligence or smalltalk. */
export function isPlatformProductKnowledgeQuery(query: string): boolean {
  if (resolvePlatformProductFoundationTopic(query)) return true;
  if (isProductConceptQuery(query)) return true;
  if (isAppNavigationQuery(query)) return true;
  if (isCapabilityHelpQuery(query)) return true;

  const normalized = normalizeIntegrationQuery(query).toLowerCase();
  return /\b(aipify|abos|business pack|growth partner|companion)\b/i.test(normalized);
}

export function shouldBypassOrganizationIntelligenceForProductQuery(query: string): boolean {
  return isPlatformProductKnowledgeQuery(query);
}

export const PLATFORM_PRODUCT_CORPUS_MIN_SCORE = 20;
