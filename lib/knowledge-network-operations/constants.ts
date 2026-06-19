export const WISDOM_STATUSES = ["strong_learning_culture", "knowledge_gaps", "critical_knowledge_risk"] as const;
export const LESSON_CATEGORIES = ["project", "customer_success", "supplier", "security", "growth_partner", "operations", "finance", "support", "hr", "custom"] as const;
export const EXPERIENCE_TYPES = ["success", "failure", "repeat", "avoid"] as const;

export const WISDOM_STATUS_BADGES: Record<string, string> = {
  strong_learning_culture: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  knowledge_gaps: "bg-amber-50 text-amber-800 ring-amber-200",
  critical_knowledge_risk: "bg-red-50 text-red-800 ring-red-200",
};
