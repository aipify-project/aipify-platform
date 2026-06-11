export * from "./types";
export * from "./parse";

export const EVOLUTION_GOVERNANCE_MODULE_PATH = "aipify-core/evolution-governance";
export const EVOLUTION_GOVERNANCE_PHILOSOPHY =
  "Aipify proposes evolution. Humans approve evolution.";
export const EVOLUTION_GOVERNANCE_SAFETY_NOTE =
  "Evolution capabilities never modify systems autonomously, bypass Governance, or override executive approvals.";

export const RISK_LEVEL_LABELS: Record<string, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
  critical: "Critical Risk",
};

export const STATUS_LABELS: Record<string, string> = {
  proposed: "Proposed",
  under_review: "Under Review",
  approved: "Approved",
  scheduled: "Scheduled",
  implemented: "Implemented",
  validated: "Validated",
  archived: "Archived",
  rejected: "Rejected",
};
