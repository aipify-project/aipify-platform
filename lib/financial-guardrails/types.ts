import type { APPROVAL_THRESHOLDS, LIMIT_TYPES, SPENDING_CATEGORIES } from "./constants";

export type SpendingCategory = (typeof SPENDING_CATEGORIES)[number];
export type LimitType = (typeof LIMIT_TYPES)[number];
export type ApprovalThreshold = (typeof APPROVAL_THRESHOLDS)[number];

export type FinancialGuardrailProfile = {
  profile_key: string;
  profile_name: string;
  spending_category: SpendingCategory | string;
  limit_type: LimitType | string;
  approval_threshold: ApprovalThreshold | string;
  status: string;
  limits: Record<string, unknown> | null;
  allowed_providers: string[] | null;
  restrictions: Record<string, unknown> | null;
};

export type FinancialGuardrailRecommendation = {
  recommendation_key: string;
  message: string;
  spending_category: string | null;
  status: string;
};

export type FinancialGuardrailExpenditure = {
  expenditure_key: string;
  profile_key: string;
  category: string;
  amount: number;
  currency: string;
  status: string;
  approval_threshold: string | null;
  created_at: string;
};

export type FinancialGuardrailAlert = {
  alert_key: string;
  alert_type: string;
  message: string;
  severity: string;
  status: string;
  created_at: string;
};

export type FinancialGuardrailsCenter = {
  settings: { guardrails_enabled: boolean; default_approval_threshold: string } | null;
  active_profiles: FinancialGuardrailProfile[];
  recommendations: FinancialGuardrailRecommendation[];
  expenditures: FinancialGuardrailExpenditure[];
  alerts: FinancialGuardrailAlert[];
  spending_trends: Record<string, unknown> | null;
  budget_utilization: Record<string, unknown> | null;
  high_value_transactions: FinancialGuardrailExpenditure[];
  policy_exceptions: Record<string, unknown> | null;
  effectiveness_indicators: Record<string, unknown> | null;
  blueprint: Record<string, unknown> | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_record: boolean;
  can_delete: boolean;
  privacy_note: string | null;
};
