export const EXECUTIVE_DECISION_SUPPORT_ROUTE = "/app/executive/decision-support";

export const DECISION_CATEGORIES = ["personal", "business", "executive", "community"] as const;

export const DECISION_STATES = [
  "gathering_info",
  "under_evaluation",
  "awaiting_approval",
  "decided",
  "archived",
] as const;

export const DECISION_FRAMEWORKS = [
  "pros_cons",
  "weighted_criteria",
  "scenario_analysis",
  "risk_review",
] as const;

export const DECISION_SENSITIVITY = ["low", "medium", "high", "critical"] as const;

export const EXECUTIVE_DECISION_CORE_PRINCIPLE =
  "Aipify should improve decision quality. Humans remain responsible for decisions.";

export const EXECUTIVE_DECISION_PHILOSOPHY =
  "Aipify should help answer: What should I consider before deciding? — not What should I do?";

export const EXECUTIVE_DECISION_VISION =
  "Important decisions deserve thoughtful consideration. Think more clearly, evaluate more intentionally, and decide with greater confidence.";
