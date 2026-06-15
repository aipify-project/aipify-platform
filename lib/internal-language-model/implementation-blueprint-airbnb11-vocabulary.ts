/** Phase Airbnb 11 — Hosts Knowledge Center & Self-Service vocabulary. */
export const AIPIFY_HOSTS_KNOWLEDGE_POSITIONING =
  "Operational guidance when you need it — self-service answers for hospitality hosts, without contacting support.";

export const AIPIFY_HOSTS_KNOWLEDGE_TERMINOLOGY = {
  knowledgeCenter: "Hosts Knowledge Center",
  selfService: "Self-Service Foundation",
} as const;

export const AIPIFY_HOSTS_KNOWLEDGE_FORBIDDEN = [
  "AI assistant",
  "AI chatbot",
  "raw documentation",
  "wiki",
] as const;

export const AIPIFY_HOSTS_KNOWLEDGE_ROUTE = "/app/aipify-hosts/knowledge";

export const AIPIFY_HOSTS_KNOWLEDGE_SECTIONS = [
  "getting_started",
  "guest_management",
  "property_management",
  "cleaning_operations",
  "maintenance",
  "team_management",
  "trust_compliance",
  "revenue_optimization",
  "incident_handling",
  "billing_licensing",
] as const;
