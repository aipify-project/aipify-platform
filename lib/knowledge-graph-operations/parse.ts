import type {
  DecisionRecord,
  GraphDependency,
  GraphEntity,
  GraphRelationship,
  KnowledgeGraphCenter,
  MemoryRecord,
  TimelineEvent,
} from "./types";

function parseEntity(row: Record<string, unknown>): GraphEntity {
  return {
    id: String(row.id ?? ""),
    entity_type: String(row.entity_type ?? ""),
    entity_key: row.entity_key ? String(row.entity_key) : undefined,
    title: String(row.title ?? ""),
    summary: row.summary ? String(row.summary) : undefined,
    status: row.status ? String(row.status) : undefined,
    source_id: row.source_id ? String(row.source_id) : undefined,
    domain_id: row.domain_id ? String(row.domain_id) : undefined,
    business_pack_key: row.business_pack_key ? String(row.business_pack_key) : undefined,
    record_href: row.record_href ? String(row.record_href) : undefined,
    connection_count: row.connection_count != null ? Number(row.connection_count) : undefined,
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

function parseEntities(value: unknown): GraphEntity[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((r) => parseEntity(r as Record<string, unknown>));
}

function parseRelationships(value: unknown): GraphRelationship[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id ?? ""),
      relationship_type: String(r.relationship_type ?? ""),
      label: r.label ? String(r.label) : undefined,
      strength: r.strength ? String(r.strength) : undefined,
      from_entity: r.from_entity ? parseEntity(r.from_entity as Record<string, unknown>) : undefined,
      to_entity: r.to_entity ? parseEntity(r.to_entity as Record<string, unknown>) : undefined,
      created_at: r.created_at ? String(r.created_at) : undefined,
    };
  });
}

function parseDependencies(value: unknown): GraphDependency[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id ?? ""),
      dependency_type: String(r.dependency_type ?? ""),
      impact_level: String(r.impact_level ?? "moderate"),
      summary: r.summary ? String(r.summary) : undefined,
      entity: r.entity ? parseEntity(r.entity as Record<string, unknown>) : undefined,
      depends_on: r.depends_on ? parseEntity(r.depends_on as Record<string, unknown>) : undefined,
    };
  });
}

function parseMemory(value: unknown): MemoryRecord[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id ?? ""),
      memory_type: String(r.memory_type ?? ""),
      title: String(r.title ?? ""),
      summary: r.summary ? String(r.summary) : undefined,
      reason: r.reason ? String(r.reason) : undefined,
      outcome: r.outcome ? String(r.outcome) : undefined,
      lessons_learned: r.lessons_learned ? String(r.lessons_learned) : undefined,
      occurred_at: r.occurred_at ? String(r.occurred_at) : undefined,
      entity_id: r.entity_id ? String(r.entity_id) : undefined,
    };
  });
}

function parseDecisions(value: unknown): DecisionRecord[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id ?? ""),
      decision_title: String(r.decision_title ?? ""),
      reason: r.reason ? String(r.reason) : undefined,
      participants: r.participants,
      outcome: r.outcome ? String(r.outcome) : undefined,
      lessons_learned: r.lessons_learned ? String(r.lessons_learned) : undefined,
      decided_at: r.decided_at ? String(r.decided_at) : undefined,
      entity_id: r.entity_id ? String(r.entity_id) : undefined,
    };
  });
}

function parseTimeline(value: unknown): TimelineEvent[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id ?? ""),
      event_type: String(r.event_type ?? ""),
      title: String(r.title ?? ""),
      summary: r.summary ? String(r.summary) : undefined,
      occurred_at: r.occurred_at ? String(r.occurred_at) : undefined,
      entity_id: r.entity_id ? String(r.entity_id) : undefined,
    };
  });
}

export function parseKnowledgeGraphCenter(row: Record<string, unknown>): KnowledgeGraphCenter {
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    entity_types: Array.isArray(row.entity_types) ? row.entity_types.map(String) : undefined,
    relationship_types: Array.isArray(row.relationship_types) ? row.relationship_types.map(String) : undefined,
    entities: parseEntities(row.entities),
    relationships: parseRelationships(row.relationships),
    connections: Array.isArray(row.connections)
      ? row.connections.map((c) => {
          const item = c as Record<string, unknown>;
          return {
            entity: item.entity ? parseEntity(item.entity as Record<string, unknown>) : undefined,
            connection_count: item.connection_count != null ? Number(item.connection_count) : undefined,
          };
        })
      : undefined,
    dependencies: parseDependencies(row.dependencies),
    insights: row.insights as Record<string, unknown> | undefined,
    organizational_memory: parseMemory(row.organizational_memory),
    decision_history: parseDecisions(row.decision_history),
    relationship_explorer: row.relationship_explorer as Record<string, unknown> | undefined,
    knowledge_timeline: parseTimeline(row.knowledge_timeline),
    domain_intelligence: parseEntities(row.domain_intelligence),
    business_pack_integration: parseEntities(row.business_pack_integration),
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    companion_integration: row.companion_integration as Record<string, unknown> | undefined,
    search_integration: row.search_integration as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            action: String(e.action ?? ""),
            summary: String(e.summary ?? ""),
            section: e.section ? String(e.section) : undefined,
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}

export function parseKnowledgeGraphSearchResults(row: Record<string, unknown>): GraphEntity[] {
  if (row.found !== true || !Array.isArray(row.results)) return [];
  return row.results.map((r) => parseEntity(r as Record<string, unknown>));
}
