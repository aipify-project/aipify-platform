export const COMPANION_BRIEFING_CONTEXTS = [
  "home",
  "customers",
  "customer_success",
  "billing",
  "support",
  "approvals",
  "command_center",
  "commerce",
  "commerce_intelligence",
  "commerce_performance",
  "product_automation",
  "dropshipping",
  "license",
  "learning",
  "install",
] as const;

export type CompanionBriefingContext = (typeof COMPANION_BRIEFING_CONTEXTS)[number];

/** Canonical Customer App route → companion briefing context */
export const COMPANION_BRIEFING_ROUTE_MAP: Record<string, CompanionBriefingContext> = {
  "/app": "home",
  "/app/customer-lifecycle": "customer_success",
  "/app/customer-success-engine": "customer_success",
  "/app/settings/billing": "billing",
  "/app/license": "license",
  "/app/support-ai-engine": "support",
  "/app/approvals": "approvals",
  "/app/command-center": "command_center",
  "/app/commerce-companion": "commerce",
  "/app/commerce-intelligence": "commerce_intelligence",
  "/app/commerce-performance": "commerce_performance",
  "/app/product-automation": "product_automation",
  "/app/dropshipping-operations": "dropshipping",
  "/app/learning": "learning",
  "/app/install": "install",
};

export function isCompanionBriefingContext(value: string): value is CompanionBriefingContext {
  return (COMPANION_BRIEFING_CONTEXTS as readonly string[]).includes(value);
}

export function companionContextForRoute(route: string): CompanionBriefingContext | null {
  const normalized = route.replace(/\/$/, "") || "/app";
  return COMPANION_BRIEFING_ROUTE_MAP[normalized] ?? null;
}
