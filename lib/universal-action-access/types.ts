import type { UAAF_ACTION_CATEGORIES, UAAF_APPROVAL_LEVELS } from "./constants";

export type UaafActionCategory = (typeof UAAF_ACTION_CATEGORIES)[number];
export type UaafApprovalLevel = (typeof UAAF_APPROVAL_LEVELS)[number];

export type UaafSettings = {
  enabled: boolean;
  emergency_stop_honored: boolean;
  business_hours_only: boolean;
  geographic_limit: string | null;
  default_approval_level: UaafApprovalLevel;
};

export type UaafIntegrationAccess = {
  id: string;
  integration_key: string;
  integration_label: string;
  action_category: UaafActionCategory;
  access_scope: string;
  execute_scope: string;
  approval_level: UaafApprovalLevel;
  logging_required: boolean;
  reversal_available: boolean;
  status: string;
};

export type UaafActionAuditEntry = {
  id: string;
  integration_key: string | null;
  action_category: string | null;
  action_key: string | null;
  action_label: string | null;
  approval_status: string | null;
  outcome: string | null;
  reversal_status: string | null;
  summary: string | null;
  created_at: string;
};

export type UaafActionAccessCenter = {
  settings: UaafSettings;
  integrations: UaafIntegrationAccess[];
  recent_audit: UaafActionAuditEntry[];
  core_principle: string;
  metrics?: {
    actions_proposed?: number;
    actions_executed?: number;
    actions_blocked?: number;
  };
};

export type UaafActionValidation = {
  allowed: boolean;
  approval_level_required: UaafApprovalLevel;
  reason: string;
  offer_prompt_en?: string | null;
  offer_prompt_no?: string | null;
};

export type UaafActionOffer = {
  should_offer: boolean;
  action_key: string | null;
  category: UaafActionCategory | null;
  prompt_en: string;
  prompt_no: string;
};
