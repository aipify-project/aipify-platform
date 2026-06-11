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

export type SupportAiEngineCard = {
  has_organization: boolean;
  open_cases?: number;
  pending_approvals?: number;
  philosophy?: string;
};

export type SupportAiEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
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
