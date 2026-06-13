import type { ACTION_MARKETPLACE_CATEGORIES } from "./constants";

export type ActionMarketplaceCategory = (typeof ACTION_MARKETPLACE_CATEGORIES)[number];

export type ActionProvider = {
  provider_key: string;
  provider_name: string;
  category: ActionMarketplaceCategory | string;
  governance_level: number;
  integration_status: string;
  health_score: number | null;
  installed: boolean;
  countries_supported: string[] | null;
};

export type ActionRecommendation = {
  provider_key: string;
  provider_name?: string;
  message: string;
  status: string;
};

export type ActionHistoryEntry = {
  request_key: string;
  action_category: string;
  provider_key: string;
  status: string;
  outcome_summary: string | null;
  created_at: string;
};

export type ActionUserPreferences = {
  usage_context: string;
  spending_limits: Record<string, unknown> | null;
  approval_requirements: Record<string, unknown> | null;
  preferred_providers: string[] | null;
};

export type CompanionActionMarketplaceCenter = {
  catalog_by_category: Record<ActionMarketplaceCategory, ActionProvider[]>;
  installed_providers: ActionProvider[];
  recommended: ActionRecommendation[];
  governance_warnings: Array<{ provider_key: string; message: string; severity?: string }>;
  usage_trends: Record<string, unknown> | null;
  user_preferences: ActionUserPreferences | null;
  org_controls: Record<string, unknown> | null;
  action_history: ActionHistoryEntry[];
  execution_flow: Array<{ step: string; description: string }> | null;
  blueprint: Record<string, unknown> | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_activate: boolean;
  can_record: boolean;
  privacy_note: string | null;
};
