/** Context Intelligence Engine — organizational ABOS context (Phase A.77). */

export const CONTEXT_INTELLIGENCE_MISSION =
  "Right assistance, right people, right time, right context.";

export const CONTEXT_INTELLIGENCE_ABOS_PRINCIPLE =
  "ABOS composes organizational intelligence from structure, memory, permissions, and operational signals — never from raw customer content.";

export const CONTEXT_DIMENSION_DEFINITIONS = [
  {
    key: "organizational",
    label: "Organizational Context",
    description: "Tenant structure, membership, and organization-level defaults.",
  },
  {
    key: "workspace",
    label: "Workspace Context",
    description: "Isolated operational contexts within the organization.",
  },
  {
    key: "user",
    label: "User Context",
    description: "Who is acting, their roles, and active workspace selection.",
  },
  {
    key: "historical",
    label: "Historical Context",
    description: "Organizational memory, precedents, and past decisions.",
  },
  {
    key: "operational",
    label: "Operational Context",
    description: "Tasks, approvals, and in-flight operational activity.",
  },
  {
    key: "permission",
    label: "Permission Context",
    description: "Role permissions and access boundaries for safe assistance.",
  },
  {
    key: "strategic",
    label: "Strategic Context",
    description: "Goals, OKRs, and strategic alignment signals.",
  },
  {
    key: "temporal",
    label: "Temporal Context",
    description: "Time-bound signals — calendars, deadlines, and scheduling context.",
  },
] as const;

export function getContextDimensions() {
  return CONTEXT_DIMENSION_DEFINITIONS;
}

export function describeContextDimension(key: string) {
  return CONTEXT_DIMENSION_DEFINITIONS.find((d) => d.key === key);
}

export const CONTEXT_INTELLIGENCE_PHASE35_NOTE =
  "Phase 35 Context Engine (/app/assistant/context) orchestrates personal calendars — distinct from organizational context intelligence (A.77).";
