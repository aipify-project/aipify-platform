export type UnifiedBillingProfile = {
  id?: string;
  profile_key: string;
  profile_label: string;
  customer_type: string;
  company_name: string;
  vat_number: string;
  country: string;
  tax_status: string;
  validation_status: string;
  is_primary: boolean;
};

export type UnifiedBillingCenter = {
  found: boolean;
  error?: string;
  principle?: string;
  privacy_note?: string;
  can_manage_profiles?: boolean;
  profiles?: UnifiedBillingProfile[];
  subscriptions?: Record<string, unknown>[];
  invoices?: Record<string, unknown>[];
  licenses?: Record<string, unknown>[];
  recent_events?: Record<string, unknown>[];
  checkout_flow?: string[];
  stats?: Record<string, number>;
};

export type UnifiedBillingAdvisorInsight = {
  key: string;
  observation: string;
  recommendation: string;
  href: string;
};

export type UnifiedBillingAdvisorBundle = {
  found: boolean;
  insights?: UnifiedBillingAdvisorInsight[];
  center?: UnifiedBillingCenter;
};
