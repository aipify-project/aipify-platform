export type SelfSupportConversation = {
  id: string;
  conversation_number: string;
  subject: string;
  channel?: string;
  status?: string;
  last_confidence_level?: string | null;
  escalation_count?: number;
  created_at?: string;
  escalated_at?: string | null;
};

export type SelfSupportEscalation = {
  id: string;
  conversation_id: string;
  reason?: string;
  status?: string;
  created_at?: string;
  subject?: string;
  conversation_number?: string;
};

export type SelfSupportKnowledgeGap = {
  id: string;
  question: string;
  occurrence_count?: number;
  gap_type?: string;
  status?: string;
  suggested_article_title?: string | null;
};

export type SelfSupportEngineCard = {
  has_organization: boolean;
  active_conversations?: number;
  open_escalations?: number;
  philosophy?: string;
};

export type SelfSupportEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  settings?: {
    auto_response_enabled?: boolean;
    escalation_confidence_threshold?: number;
    sensitive_topic_escalation?: boolean;
    channels_enabled?: string[];
    future_channels?: string[];
  };
  active_conversations: SelfSupportConversation[];
  escalation_queue: SelfSupportEscalation[];
  unresolved_issues: SelfSupportConversation[];
  satisfaction_trends?: {
    helpful?: number;
    unhelpful?: number;
    positive?: number;
    neutral?: number;
    negative?: number;
  };
  statistics?: {
    total_conversations?: number;
    automatic_responses?: number;
    draft_responses?: number;
    escalated_conversations?: number;
    open_escalations?: number;
  };
  knowledge_gaps: SelfSupportKnowledgeGap[];
  confidence_levels?: string[];
  channels?: string[];
  future_channels?: string[];
};
