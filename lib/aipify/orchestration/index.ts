export * from "./types";
export * from "./parse";

export const ORCHESTRATION_MODULE_PATH = "aipify-core/orchestration";
export const ORCHESTRATION_PHILOSOPHY =
  "One coordinated brain — modules emit events, orchestration routes safe next actions through policy and governance.";
export const ORCHESTRATION_SAFETY_NOTE =
  "Orchestration never bypasses Emergency Stop, Policy Engine, or Governance approvals for high-risk actions.";

/** Org-scoped workflow orchestration (Phase A.42) — distinct from platform event orchestration. */
export const ORG_WORKFLOW_ORCHESTRATION_MODULE_PATH = "aipify-core/workflow-orchestration-engine";
export const ORG_WORKFLOW_ORCHESTRATION_ROUTE = "/app/workflow-orchestration-engine";
export const ORG_WORKFLOW_ORCHESTRATION_PHILOSOPHY =
  "Human-defined organization workflows with Human Oversight (A.40) and Delegated Trust hooks (A.41).";
