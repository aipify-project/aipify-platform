export type MarketplaceSelfServiceSectionKey =
  | "installed"
  | "recommended"
  | "discover"
  | "trials"
  | "billing";

export type MarketplacePackCardStatus =
  | "installed"
  | "available"
  | "upgrade_required"
  | "trial_available";

export type MarketplacePackCard = {
  pack_key: string;
  name: string;
  description: string;
  features: string[];
  pricing_label: string;
  monthly_price: number;
  trial_available: boolean;
  card_status: MarketplacePackCardStatus;
  workspace_route: string;
  min_subscription_tier: string;
};

export type MarketplaceRecommendation = {
  id: string;
  recommendation_key: string;
  pack_key: string | null;
  title: string;
  message: string;
  action_type: string;
  action_target: string | null;
  priority: number;
};

export type MarketplaceSelfServiceDashboard = {
  has_customer: boolean;
  section: MarketplaceSelfServiceSectionKey;
  philosophy: string;
  governance_note: string;
  principle: string;
  current_tier: string;
  sections: Array<{ key: string; label: string }>;
  cards: MarketplacePackCard[];
  recommendations?: MarketplaceRecommendation[];
  activation_steps?: Array<{ step: number; key: string; label: string }>;
  billing_summary?: Record<string, unknown>;
  addon_modules?: Array<Record<string, unknown>>;
  billing_route?: string;
  packages_route?: string;
};

export type MarketplaceSelfServiceActionResult = {
  action: string;
  status: string;
  pack_key?: string;
  message?: string;
  workspace_route?: string;
  billing_route?: string;
  requires_payment?: boolean;
  current_tier?: string;
  required_tier?: string;
  upgrade_event_id?: string;
};
