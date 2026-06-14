/**
 * Enterprise Loading Language Standard
 *
 * Loading states must reinforce trust, competence, and executive readiness —
 * never generic AI or chatbot waiting language.
 */

export type EnterpriseLoadingCategory =
  | "executive"
  | "operations"
  | "security"
  | "companion"
  | "commerce";

export type EnterpriseLoadingVariant =
  | "briefing"
  | "overview"
  | "insights"
  | "intelligence"
  | "priorities"
  | "operationalData"
  | "pendingActivities"
  | "workflows"
  | "activityStatus"
  | "securityPosture"
  | "compliance"
  | "governance"
  | "workspace"
  | "prioritiesReview"
  | "recommendations"
  | "commerceIntelligence"
  | "performance"
  | "marketInsights";

export const FORBIDDEN_LOADING_PATTERNS = [
  /loading ai/i,
  /\bai is thinking\b/i,
  /\bai assistant\b/i,
  /\bthe ai has\b/i,
  /\bartificial intelligence recommends\b/i,
  /^processing\.{3}$/i,
  /^thinking[.…]*$/i,
  /^loading\.{3}$/i,
] as const;

export const ENTERPRISE_LOADING_MESSAGES: Record<
  EnterpriseLoadingCategory,
  Record<EnterpriseLoadingVariant, string>
> = {
  executive: {
    briefing: "Preparing executive briefing…",
    overview: "Updating operational overview…",
    insights: "Synchronizing organizational insights…",
    intelligence: "Refreshing executive intelligence…",
    priorities: "Preparing today's priorities…",
    operationalData: "Updating operational overview…",
    pendingActivities: "Updating operational overview…",
    workflows: "Synchronizing organizational insights…",
    activityStatus: "Updating operational overview…",
    securityPosture: "Updating operational overview…",
    compliance: "Updating operational overview…",
    governance: "Refreshing executive intelligence…",
    workspace: "Updating operational overview…",
    prioritiesReview: "Preparing today's priorities…",
    recommendations: "Preparing today's priorities…",
    commerceIntelligence: "Refreshing executive intelligence…",
    performance: "Refreshing executive intelligence…",
    marketInsights: "Synchronizing organizational insights…",
  },
  operations: {
    briefing: "Gathering operational data…",
    overview: "Gathering operational data…",
    insights: "Reviewing pending activities…",
    intelligence: "Gathering operational data…",
    priorities: "Reviewing pending activities…",
    operationalData: "Gathering operational data…",
    pendingActivities: "Reviewing pending activities…",
    workflows: "Synchronizing approved workflows…",
    activityStatus: "Updating business activity status…",
    securityPosture: "Gathering operational data…",
    compliance: "Reviewing pending activities…",
    governance: "Synchronizing approved workflows…",
    workspace: "Gathering operational data…",
    prioritiesReview: "Reviewing pending activities…",
    recommendations: "Reviewing pending activities…",
    commerceIntelligence: "Gathering operational data…",
    performance: "Updating business activity status…",
    marketInsights: "Gathering operational data…",
  },
  security: {
    briefing: "Verifying security posture…",
    overview: "Verifying security posture…",
    insights: "Reviewing compliance indicators…",
    intelligence: "Updating governance insights…",
    priorities: "Reviewing compliance indicators…",
    operationalData: "Verifying security posture…",
    pendingActivities: "Reviewing compliance indicators…",
    workflows: "Updating governance insights…",
    activityStatus: "Verifying security posture…",
    securityPosture: "Verifying security posture…",
    compliance: "Reviewing compliance indicators…",
    governance: "Updating governance insights…",
    workspace: "Verifying security posture…",
    prioritiesReview: "Reviewing compliance indicators…",
    recommendations: "Updating governance insights…",
    commerceIntelligence: "Reviewing compliance indicators…",
    performance: "Updating governance insights…",
    marketInsights: "Reviewing compliance indicators…",
  },
  companion: {
    briefing: "Aipify is preparing your workspace…",
    overview: "Aipify is preparing your workspace…",
    insights: "Reviewing your organization's priorities…",
    intelligence: "Reviewing your organization's priorities…",
    priorities: "Reviewing your organization's priorities…",
    operationalData: "Aipify is preparing your workspace…",
    pendingActivities: "Reviewing your organization's priorities…",
    workflows: "Aipify is preparing your workspace…",
    activityStatus: "Aipify is preparing your workspace…",
    securityPosture: "Aipify is preparing your workspace…",
    compliance: "Aipify is preparing your workspace…",
    governance: "Reviewing your organization's priorities…",
    workspace: "Aipify is preparing your workspace…",
    prioritiesReview: "Reviewing your organization's priorities…",
    recommendations: "Preparing recommendations…",
    commerceIntelligence: "Preparing recommendations…",
    performance: "Preparing recommendations…",
    marketInsights: "Preparing recommendations…",
  },
  commerce: {
    briefing: "Updating commerce intelligence…",
    overview: "Updating commerce intelligence…",
    insights: "Reviewing performance indicators…",
    intelligence: "Updating commerce intelligence…",
    priorities: "Reviewing performance indicators…",
    operationalData: "Updating commerce intelligence…",
    pendingActivities: "Reviewing performance indicators…",
    workflows: "Synchronizing market insights…",
    activityStatus: "Reviewing performance indicators…",
    securityPosture: "Updating commerce intelligence…",
    compliance: "Reviewing performance indicators…",
    governance: "Synchronizing market insights…",
    workspace: "Updating commerce intelligence…",
    prioritiesReview: "Reviewing performance indicators…",
    recommendations: "Synchronizing market insights…",
    commerceIntelligence: "Updating commerce intelligence…",
    performance: "Reviewing performance indicators…",
    marketInsights: "Synchronizing market insights…",
  },
};

export function getEnterpriseLoadingMessage(
  category: EnterpriseLoadingCategory,
  variant: EnterpriseLoadingVariant = "overview",
): string {
  return ENTERPRISE_LOADING_MESSAGES[category][variant];
}

export function isForbiddenLoadingMessage(message: string): boolean {
  const trimmed = message.trim();
  return FORBIDDEN_LOADING_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function inferLoadingCategoryFromKey(key: string): EnterpriseLoadingCategory {
  const normalized = key.toLowerCase();

  if (
    /security|compliance|governance|trust|audit|verification|twoFactor|2fa|policy|risk|resilience|continuity|incident|records|retention|ethics/.test(
      normalized,
    )
  ) {
    return "security";
  }

  if (/commerce|supplier|subscription|marketplace|sales|product|margin|shop/.test(normalized)) {
    return "commerce";
  }

  if (
    /assistant|companion|memory|identity|life|relationship|goal|attention|proactive|chat|briefing/.test(
      normalized,
    )
  ) {
    return "companion";
  }

  if (
    /executive|leadership|strategic|insight|intelligence|decision|portfolio|command|founder|cockpit|okr|priority|foresight|wisdom|sensemaking|stewardship/.test(
      normalized,
    )
  ) {
    return "executive";
  }

  return "operations";
}

export function inferLoadingVariantFromKey(key: string): EnterpriseLoadingVariant {
  const normalized = key.toLowerCase();

  if (/briefing|brief/.test(normalized)) return "briefing";
  if (/recommend|suggest/.test(normalized)) return "recommendations";
  if (/workflow|automation|orchestr|install|execution|action|approval|task|operation/.test(normalized)) {
    return "workflows";
  }
  if (/security|trust|compliance|governance|audit|verification|policy|risk|ethics/.test(normalized)) {
    return /compliance|policy|audit|ethics/.test(normalized) ? "compliance" : "securityPosture";
  }
  if (/commerce|supplier|market|performance|margin|product/.test(normalized)) {
    return /performance|margin|indicator/.test(normalized) ? "performance" : "commerceIntelligence";
  }
  if (/insight|intelligence|analytics|pulse|predict/.test(normalized)) return "insights";
  if (/presence|activity|status|notification/.test(normalized)) return "activityStatus";
  if (/priority|okr|focus|goal/.test(normalized)) return "priorities";
  if (/companion|assistant|memory|workspace|identity/.test(normalized)) return "workspace";

  return "overview";
}

export function resolveEnterpriseLoadingMessageFromKey(
  key: string,
  fallback?: string,
): string {
  if (fallback && !isForbiddenLoadingMessage(fallback)) {
    return fallback;
  }

  const category = inferLoadingCategoryFromKey(key);
  const variant = inferLoadingVariantFromKey(key);
  return getEnterpriseLoadingMessage(category, variant);
}
