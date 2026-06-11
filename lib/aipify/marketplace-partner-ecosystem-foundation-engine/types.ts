export type PartnerRecord = {
  id?: string;
  partner_name?: string;
  partner_type?: string;
  status?: string;
  certification_level?: string;
  website?: string;
  quality_score?: number;
  review_notes?: string;
  [key: string]: unknown;
};

export type MarketplaceOfferingRecord = {
  offering?: Record<string, unknown>;
  partner_name?: string;
  partner_certification?: string;
  [key: string]: unknown;
};

export type MarketplacePartnerEcosystemFoundationEngineCard = {
  has_organization: boolean;
  approved_partners?: number;
  published_offerings?: number;
  pending_reviews?: number;
  philosophy?: string;
  [key: string]: unknown;
};

export type MarketplacePartnerEcosystemFoundationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  approved_partners?: PartnerRecord[];
  pending_partners?: PartnerRecord[];
  offerings?: MarketplaceOfferingRecord[];
  certification_breakdown?: Record<string, unknown>;
  quality_indicators?: Record<string, unknown>;
  integration_notes?: Record<string, unknown>;
  recent_activity?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};
