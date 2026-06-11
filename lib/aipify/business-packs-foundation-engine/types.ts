export type BusinessPackRecord = {
  id?: string;
  pack_key: string;
  pack_name: string;
  industry?: string;
  description?: string;
  status?: string;
  version?: string;
  is_future?: boolean;
  components?: Record<string, unknown>;
  [key: string]: unknown;
};

export type BusinessPacksFoundationEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_packs?: number;
  available_packs?: number;
  [key: string]: unknown;
};

export type BusinessPacksFoundationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  active_packs?: Array<{ activation?: Record<string, unknown>; pack?: BusinessPackRecord; customization_status?: string }>;
  available_packs?: BusinessPackRecord[];
  recommended_packs?: BusinessPackRecord[];
  future_packs?: Array<Record<string, unknown>>;
  recent_activation_logs?: Array<Record<string, unknown>>;
  integration_notes?: Record<string, string>;
  [key: string]: unknown;
};

export type BusinessPackReview = {
  pack?: BusinessPackRecord;
  review?: Record<string, unknown>;
  already_active?: boolean;
  industry_blueprint_note?: string;
  [key: string]: unknown;
};
