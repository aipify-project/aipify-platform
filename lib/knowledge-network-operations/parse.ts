import type { KnowledgeNetworkCenter } from "./types";

export function parseKnowledgeNetworkCenter(data: unknown): KnowledgeNetworkCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    principle: row.principle as string | undefined,
    section: row.section as string | undefined,
    organization: row.organization as KnowledgeNetworkCenter["organization"],
    overview: row.overview as KnowledgeNetworkCenter["overview"],
    knowledge_assets: row.knowledge_assets as KnowledgeNetworkCenter["knowledge_assets"],
    lessons_learned_engine: row.lessons_learned_engine as KnowledgeNetworkCenter["lessons_learned_engine"],
    experience_library: row.experience_library as KnowledgeNetworkCenter["experience_library"],
    playbook_engine: row.playbook_engine as KnowledgeNetworkCenter["playbook_engine"],
    best_practice_engine: row.best_practice_engine as KnowledgeNetworkCenter["best_practice_engine"],
    decision_knowledge_base: row.decision_knowledge_base as KnowledgeNetworkCenter["decision_knowledge_base"],
    knowledge_graph_integration: row.knowledge_graph_integration as Record<string, unknown> | undefined,
    organizational_wisdom_score: row.organizational_wisdom_score as Record<string, unknown> | undefined,
    knowledge_retention_engine: row.knowledge_retention_engine as KnowledgeNetworkCenter["knowledge_retention_engine"],
    meeting_intelligence: row.meeting_intelligence as KnowledgeNetworkCenter["meeting_intelligence"],
    companion_learning_engine: row.companion_learning_engine as KnowledgeNetworkCenter["companion_learning_engine"],
    department_knowledge_centers: row.department_knowledge_centers as KnowledgeNetworkCenter["department_knowledge_centers"],
    business_pack_integration: row.business_pack_integration as KnowledgeNetworkCenter["business_pack_integration"],
    knowledge_recommendations: row.knowledge_recommendations as KnowledgeNetworkCenter["knowledge_recommendations"],
    companion_advisor: row.companion_advisor as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: row.audit_recent as KnowledgeNetworkCenter["audit_recent"],
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error as string | undefined,
  };
}
