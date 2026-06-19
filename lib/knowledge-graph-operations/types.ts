export type KnowledgeGraphTab =
  | "overview"
  | "relationships"
  | "entities"
  | "connections"
  | "insights"
  | "dependencies"
  | "timeline"
  | "memory"
  | "decisions"
  | "reports"
  | "companion";

export type GraphEntity = {
  id: string;
  entity_type: string;
  entity_key?: string;
  title: string;
  summary?: string;
  status?: string;
  source_id?: string;
  domain_id?: string;
  business_pack_key?: string;
  record_href?: string;
  connection_count?: number;
  created_at?: string;
  updated_at?: string;
};

export type GraphRelationship = {
  id: string;
  relationship_type: string;
  label?: string;
  strength?: string;
  from_entity?: GraphEntity;
  to_entity?: GraphEntity;
  created_at?: string;
};

export type GraphDependency = {
  id: string;
  dependency_type: string;
  impact_level: string;
  summary?: string;
  entity?: GraphEntity;
  depends_on?: GraphEntity;
};

export type MemoryRecord = {
  id: string;
  memory_type: string;
  title: string;
  summary?: string;
  reason?: string;
  outcome?: string;
  lessons_learned?: string;
  occurred_at?: string;
  entity_id?: string;
};

export type DecisionRecord = {
  id: string;
  decision_title: string;
  reason?: string;
  participants?: unknown;
  outcome?: string;
  lessons_learned?: string;
  decided_at?: string;
  entity_id?: string;
};

export type TimelineEvent = {
  id: string;
  event_type: string;
  title: string;
  summary?: string;
  occurred_at?: string;
  entity_id?: string;
};

export type KnowledgeGraphCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: Record<string, string | number | undefined>;
  entity_types?: string[];
  relationship_types?: string[];
  entities?: GraphEntity[];
  relationships?: GraphRelationship[];
  connections?: { entity?: GraphEntity; connection_count?: number }[];
  dependencies?: GraphDependency[];
  insights?: Record<string, unknown>;
  organizational_memory?: MemoryRecord[];
  decision_history?: DecisionRecord[];
  relationship_explorer?: Record<string, unknown>;
  knowledge_timeline?: TimelineEvent[];
  domain_intelligence?: GraphEntity[];
  business_pack_integration?: GraphEntity[];
  executive_dashboard?: Record<string, unknown>;
  companion_integration?: Record<string, unknown>;
  search_integration?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  mobile_access?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; section?: string; created_at?: string }[];
  routes?: Record<string, string>;
  error?: string;
};
