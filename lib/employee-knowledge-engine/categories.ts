import type { HealthLevel, KnowledgeCategory } from "./types";

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  "company_info",
  "policies",
  "operational_procedures",
  "product_knowledge",
  "support_procedures",
  "training_content",
];

export const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  company_info: "Company Information",
  policies: "Policies",
  operational_procedures: "Operational Procedures",
  product_knowledge: "Product Knowledge",
  support_procedures: "Support Procedures",
  training_content: "Training Content",
};

export const HEALTH_LEVELS: HealthLevel[] = ["critical", "limited", "operational", "strong"];

export const HEALTH_LEVEL_LABELS: Record<HealthLevel, string> = {
  critical: "Critical gaps",
  limited: "Limited coverage",
  operational: "Operational readiness",
  strong: "Strong maturity",
};
