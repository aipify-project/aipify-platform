export * from "./types";
export * from "./parse";

export const CONTINUITY_MODULE_PATH = "aipify-core/continuity";
export const CONTINUITY_PHILOSOPHY =
  "Aipify supports resilience. Humans lead resilience.";
export const CONTINUITY_SAFETY_NOTE =
  "Continuity features never override Governance, grant elevated permissions, or execute irreversible actions autonomously.";

export const INCIDENT_LEVEL_LABELS: Record<number, string> = {
  1: "Localized Incident",
  2: "Departmental Incident",
  3: "Organizational Incident",
  4: "Critical Crisis",
};
