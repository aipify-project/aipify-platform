export type SupportCase = {
  id: string;
  case_number: string;
  subject: string;
  customer_identifier?: string | null;
  channel?: string;
  status?: string;
  priority?: string;
  ai_summary?: string | null;
  created_at?: string;
  escalated_at?: string | null;
  escalation_reason?: string | null;
};

export type PendingApproval = {
  id: string;
  case_id: string;
  content?: string;
  response_mode?: string;
  confidence_score?: number;
  created_at?: string;
};

export type KnowledgeGap = {
  id: string;
  question: string;
  occurrence_count?: number;
  gap_type?: string;
  status?: string;
  suggested_article_title?: string | null;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type SupportTier = {
  key?: string;
  label?: string;
  focus?: string[];
  examples?: string[];
  response_modes?: string[];
};

export type SupportObjective = {
  key?: string;
  label?: string;
};

export type KcConnection = {
  principle?: string;
  flows?: Array<{ key?: string; action?: string }>;
  knowledge_center_route?: string;
  gap_rpc?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  support_patterns?: string[];
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  customers_should_know?: string[];
  organizations_should_understand?: string[];
  audit_note?: string;
};

export type CaseManagementCapabilities = {
  note?: string;
  capabilities?: Array<Record<string, unknown>>;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type SupportAiEngineCard = {
  has_organization: boolean;
  open_cases?: number;
  pending_approvals?: number;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  implementation_blueprint?: ImplementationBlueprint;
  support_ai_engine_note?: string;
};

export type SupportAiEngineDashboard = {
  has_organization: boolean;
  implementation_blueprint?: ImplementationBlueprint;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  support_ai_engine_note?: string;
  distinction_note?: string;
  support_objectives?: SupportObjective[];
  support_tiers?: SupportTier[];
  case_management_capabilities?: CaseManagementCapabilities;
  kc_connection?: KcConnection;
  self_love_connection?: SelfLoveConnection;
  self_love_note?: string;
  trust_connection?: TrustConnection;
  dogfooding?: {
    principle?: string;
    aipify_group?: { slug?: string; role?: string; focus?: string[] };
    unonight?: { slug?: string; role?: string; focus?: string[] };
  };
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  safety_note?: string;
  principles?: string[];
  settings?: {
    default_response_mode?: string;
    auto_faq_enabled?: boolean;
    escalation_confidence_threshold?: number;
    channels_enabled?: string[];
  };
  open_cases: SupportCase[];
  pending_approvals: PendingApproval[];
  escalated_cases: SupportCase[];
  unresolved_issues: SupportCase[];
  ai_statistics?: {
    total_responses?: number;
    automatic_sent?: number;
    drafts_pending?: number;
    escalated?: number;
  };
  metrics?: Record<string, unknown>;
  knowledge_gaps: KnowledgeGap[];
  response_modes?: string[];
  channels?: string[];
};
