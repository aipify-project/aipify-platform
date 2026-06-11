export const CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;

export const INSIGHT_TYPES = [
  "bottleneck",
  "ownership_gap",
  "escalation_overload",
  "knowledge_gap",
  "routing_suggestion",
  "confidence_review",
  "process_health",
] as const;

export type DigitalTwinRole = {
  id?: string;
  role_key: string;
  role_name: string;
  description?: string | null;
  responsibility_types: string[];
  escalation_authority?: boolean;
  knowledge_ownership?: boolean;
};

export type DigitalTwinProcess = {
  process_key: string;
  process_name: string;
  category: string;
  owner_role_id?: string | null;
  deadline_hours?: number | null;
};

export type DigitalTwinKnowledgeOwner = {
  topic: string;
  topic_key: string;
  role_id?: string | null;
  confidence: number;
  confidence_level: string;
  requires_review: boolean;
};

export type DigitalTwinInsight = {
  id: string;
  insight_type: string;
  summary: string;
  confidence: number;
  status?: string;
};

export type DigitalTwinOrgUnit = {
  id: string;
  name: string;
  unit_type: string;
};

export type DigitalTwinCard = {
  has_customer: boolean;
  twin_health_score?: number;
  open_insights?: number;
  philosophy?: string;
  privacy_note?: string;
};

export type DigitalTwinDashboard = {
  has_customer: boolean;
  twin_health_score?: number;
  process_coverage?: number;
  knowledge_owners?: number;
  low_confidence_count?: number;
  roles: DigitalTwinRole[];
  processes: DigitalTwinProcess[];
  knowledge_routing: DigitalTwinKnowledgeOwner[];
  insights: DigitalTwinInsight[];
  organization_units: DigitalTwinOrgUnit[];
  integrations?: Record<string, string>;
};

export type KnowledgeRouteResult = {
  routed: boolean;
  topic?: string;
  role_key?: string;
  role_name?: string;
  confidence?: number;
  confidence_level?: string;
  requires_review?: boolean;
  explanation?: string;
  reason?: string;
};

export type EscalationResult = {
  resolved: boolean;
  process_key?: string;
  current_step?: number;
  role_key?: string;
  role_name?: string;
  next_role_key?: string;
  explanation?: string;
  reason?: string;
};

export type BottleneckResult = {
  bottlenecks_found: number;
  insights: DigitalTwinInsight[];
};

export type TwinHealthResult = {
  twin_health_score?: number;
  process_coverage?: number;
  role_count?: number;
  knowledge_owners?: number;
  low_confidence_count?: number;
};

export type ProcessDetail = {
  process: DigitalTwinProcess;
  steps: Array<{
    step_order: number;
    step_name: string;
    reviewer_role_id?: string | null;
    escalation_role_id?: string | null;
  }>;
  escalation_path: Array<{ path_order: number; role_key: string }>;
};
