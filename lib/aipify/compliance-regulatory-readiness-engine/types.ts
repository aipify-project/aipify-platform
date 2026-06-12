export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type BlueprintItem = {
  key?: string;
  label?: string;
  description?: string;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type SuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  self_love_route?: string;
  boundary_note?: string;
};

export type ComplianceCompanionBlueprint = {
  principle?: string;
  may?: string[];
  must_avoid?: string[];
  legal_disclaimer?: string;
};

export type ComplianceEngagementSummary = {
  open_records?: number;
  overdue_records?: number;
  active_policies?: number;
  under_review_policies?: number;
  scheduled_reviews?: number;
  overdue_reviews?: number;
  pending_attestations?: number;
  audit_ready_items?: number;
  audit_needs_attention?: number;
  cross_links_count?: number;
  phase145_note?: string;
  privacy_note?: string;
};

export type CompliancePolicyRegistryItem = {
  id?: string;
  policy_key?: string;
  policy_type?: string;
  title?: string;
  status?: string;
  owner_user_id?: string | null;
  last_reviewed_at?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
};

export type ComplianceReviewCycle = {
  id?: string;
  cycle_key?: string;
  review_type?: string;
  title?: string;
  status?: string;
  scheduled_at?: string;
  completed_at?: string | null;
  attestation_status?: string | null;
  gap_findings?: unknown[];
  owner_user_id?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
};

export type ComplianceAuditReadinessItem = {
  id?: string;
  item_key?: string;
  evidence_type?: string;
  title?: string;
  status?: string;
  due_date?: string | null;
  owner_user_id?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
};

export type ComplianceRegulatoryReadinessEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  open_records?: number;
  implementation_blueprint_phase145?: Record<string, unknown>;
  mission?: string;
  abos_principle?: string;
  engagement_summary?: ComplianceEngagementSummary;
  legal_disclaimer?: string;
  blueprint_note?: string;
  companion_note?: string;
  [key: string]: unknown;
};

export type ComplianceRegulatoryReadinessEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  records?: Record<string, unknown>[];
  retention_policies?: Record<string, unknown>[];
  review_schedules?: Record<string, unknown>[];
  implementation_blueprint_phase145?: Record<string, unknown>;
  global_compliance_regulatory_intelligence_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  vision?: string;
  phase145_objectives?: BlueprintObjective[];
  global_compliance_center?: Record<string, unknown>;
  regulatory_intelligence_engine?: BlueprintItem[];
  policy_management_engine?: BlueprintItem[];
  compliance_review_engine?: BlueprintItem[];
  executive_compliance_dashboard?: Record<string, unknown>;
  compliance_companion?: ComplianceCompanionBlueprint;
  audit_readiness_engine?: BlueprintItem[];
  growth_partner_compliance_support?: Record<string, unknown>;
  phase145_companion_limitations?: string[];
  phase145_self_love_connection?: SelfLoveConnection;
  phase145_security_requirements?: BlueprintItem[];
  phase145_integration_links?: IntegrationLink[];
  dogfooding_phase145?: Record<string, unknown>;
  phase145_success_criteria?: SuccessCriterion[];
  engagement_summary?: ComplianceEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
  legal_disclaimer?: string;
  sections?: {
    policy_registry?: CompliancePolicyRegistryItem[];
    review_cycles?: ComplianceReviewCycle[];
    audit_readiness_items?: ComplianceAuditReadinessItem[];
  };
  [key: string]: unknown;
};
