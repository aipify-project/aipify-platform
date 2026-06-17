export type RealEstateProperty = {
  id?: string;
  property_key?: string;
  property_name?: string;
  property_type?: string;
  location?: string;
  ownership_label?: string;
  market_value?: number;
  monthly_revenue?: number;
  monthly_expenses?: number;
  performance_label?: string;
  portfolio_id?: string | null;
  [key: string]: unknown;
};

export type RealEstateLease = {
  id?: string;
  lease_reference?: string;
  lease_status?: string;
  lease_start?: string;
  lease_end?: string;
  monthly_rent?: number;
  renewal_status?: string;
  property_id?: string | null;
  unit_id?: string | null;
  [key: string]: unknown;
};

export type RealEstateAdvisorSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type RealEstatePortfolioOperationsCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  industry_packs_route?: string;
  hospitality_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  properties?: RealEstateProperty[];
  units?: Array<Record<string, unknown>>;
  tenants?: Array<Record<string, unknown>>;
  leases?: RealEstateLease[];
  vendors?: Array<Record<string, unknown>>;
  maintenance_requests?: Array<Record<string, unknown>>;
  portfolios?: Array<Record<string, unknown>>;
  advisor_signals?: RealEstateAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
