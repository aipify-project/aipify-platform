import type {
  MarketplacePackCard,
  MarketplaceRecommendation,
  MarketplaceSelfServiceActionResult,
  MarketplaceSelfServiceDashboard,
  MarketplaceSelfServiceSectionKey,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseCards(data: unknown): MarketplacePackCard[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.pack_key) return null;
      return {
        pack_key: String(d.pack_key),
        name: typeof d.name === "string" ? d.name : String(d.pack_key),
        description: typeof d.description === "string" ? d.description : "",
        features: asArray<string>(d.features).map(String),
        pricing_label: typeof d.pricing_label === "string" ? d.pricing_label : "",
        monthly_price: Number(d.monthly_price ?? 0),
        trial_available: Boolean(d.trial_available),
        card_status: (typeof d.card_status === "string" ? d.card_status : "available") as MarketplacePackCard["card_status"],
        workspace_route: typeof d.workspace_route === "string" ? d.workspace_route : "/app",
        min_subscription_tier: typeof d.min_subscription_tier === "string" ? d.min_subscription_tier : "starter",
      };
    })
    .filter((r): r is MarketplacePackCard => r !== null);
}

function parseRecommendations(data: unknown): MarketplaceRecommendation[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        recommendation_key: typeof d.recommendation_key === "string" ? d.recommendation_key : "",
        pack_key: d.pack_key != null ? String(d.pack_key) : null,
        title: typeof d.title === "string" ? d.title : "",
        message: typeof d.message === "string" ? d.message : "",
        action_type: typeof d.action_type === "string" ? d.action_type : "",
        action_target: d.action_target != null ? String(d.action_target) : null,
        priority: Number(d.priority ?? 0),
      };
    })
    .filter((r): r is MarketplaceRecommendation => r !== null);
}

export function parseMarketplaceSelfServiceDashboard(data: unknown): MarketplaceSelfServiceDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;

  return {
    has_customer: true,
    section: (typeof d.section === "string" ? d.section : "discover") as MarketplaceSelfServiceSectionKey,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : "",
    governance_note: typeof d.governance_note === "string" ? d.governance_note : "",
    principle: typeof d.principle === "string" ? d.principle : "",
    current_tier: typeof d.current_tier === "string" ? d.current_tier : "",
    sections: asArray<{ key: string; label: string }>(d.sections),
    cards: parseCards(d.cards),
    recommendations: d.recommendations ? parseRecommendations(d.recommendations) : undefined,
    activation_steps: asArray<{ step: number; key: string; label: string }>(d.activation_steps),
    billing_summary: typeof d.billing_summary === "object" && d.billing_summary ? (d.billing_summary as Record<string, unknown>) : undefined,
    addon_modules: asArray<Record<string, unknown>>(d.addon_modules),
    billing_route: typeof d.billing_route === "string" ? d.billing_route : undefined,
    packages_route: typeof d.packages_route === "string" ? d.packages_route : undefined,
  };
}

export function parseMarketplaceSelfServiceActionResult(data: unknown): MarketplaceSelfServiceActionResult {
  const d = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  return {
    action: typeof d.action === "string" ? d.action : "",
    status: typeof d.status === "string" ? d.status : "",
    pack_key: typeof d.pack_key === "string" ? d.pack_key : undefined,
    message: typeof d.message === "string" ? d.message : undefined,
    workspace_route: typeof d.workspace_route === "string" ? d.workspace_route : undefined,
    billing_route: typeof d.billing_route === "string" ? d.billing_route : undefined,
    requires_payment: d.requires_payment != null ? Boolean(d.requires_payment) : undefined,
    current_tier: typeof d.current_tier === "string" ? d.current_tier : undefined,
    required_tier: typeof d.required_tier === "string" ? d.required_tier : undefined,
    upgrade_event_id: d.upgrade_event_id != null ? String(d.upgrade_event_id) : undefined,
  };
}
