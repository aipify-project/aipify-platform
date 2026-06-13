export type MemoryItem = {
  item_key: string;
  title: string;
  category: string;
  summary: string;
  validation_status: string;
  health_level: string;
  usage_count: number;
  owner_label: string | null;
  last_reviewed_at: string | null;
  source_type: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type MemoryGap = {
  gap_key: string;
  message: string;
  priority: string;
  status: string;
};

export type RetentionRisk = {
  risk_key: string;
  message: string;
  risk_type: string;
  status: string;
};

export type MemoryInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type MemoryContribution = {
  contribution_key: string;
  contributor_label: string;
  title: string;
  content: string;
  category: string;
  status: string;
  created_at: string | null;
};

export type OrganizationalMemoryCenter = {
  dashboard: {
    knowledge_health_score: number;
    health_label: string;
    recent_added_count: number;
    gaps_open_count: number;
    usage_total: number;
    critical_risks_count: number;
    retention_risks_count: number;
    contributions_pending: number;
    reuse_rate: number;
  } | null;
  recent_knowledge: MemoryItem[];
  knowledge_items: MemoryItem[];
  knowledge_gaps: MemoryGap[];
  retention_risks: RetentionRisk[];
  insights: MemoryInsight[];
  contributions: MemoryContribution[];
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
