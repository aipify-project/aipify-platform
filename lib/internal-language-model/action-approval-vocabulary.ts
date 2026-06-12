/** Action & Approval Engine tiers — canonical spec mapped to Trust & Action / risk levels. */

export const ACTION_APPROVAL_TIERS = [
  {
    tier: 1,
    key: "informational",
    label: "Informational Actions",
    approval: "none",
    trust_action_level: 0,
    risk_level: "low" as const,
    description: "No operational impact. No approval required.",
    examples: [
      "Answering questions",
      "Providing recommendations",
      "Generating reports",
      "Summarizing meetings",
      "Suggesting improvements",
    ],
  },
  {
    tier: 2,
    key: "assisted",
    label: "Assisted Actions",
    approval: "review_recommended",
    trust_action_level: 1,
    risk_level: "medium" as const,
    description: "Moderate operational impact. Human review recommended.",
    examples: [
      "Drafting customer emails",
      "Preparing support responses",
      "Suggesting knowledge updates",
      "Generating marketing content",
      "Creating task recommendations",
    ],
  },
  {
    tier: 3,
    key: "approval_based",
    label: "Approval-Based Actions",
    approval: "explicit_required",
    trust_action_level: 2,
    risk_level: "medium" as const,
    description: "Direct business impact. Explicit approval required.",
    examples: [
      "Publishing content",
      "Updating documentation",
      "Responding to customers",
      "Triggering automations",
      "Creating support tickets",
      "Modifying workflows",
    ],
  },
  {
    tier: 4,
    key: "high_risk",
    label: "High-Risk Actions",
    approval: "multi_approver",
    trust_action_level: 3,
    risk_level: "high" as const,
    description: "Significant operational impact. Multiple approvals may be required.",
    examples: [
      "Financial approvals",
      "Contract generation",
      "User access modifications",
      "Organization-wide changes",
      "Data exports",
    ],
  },
  {
    tier: 5,
    key: "restricted",
    label: "Restricted Actions",
    approval: "never_autonomous",
    trust_action_level: 4,
    risk_level: "critical" as const,
    description: "Never executed autonomously by AI.",
    examples: [
      "Permanent data deletion",
      "Legal commitments",
      "Regulatory filings",
      "Executive termination actions",
      "Irreversible system modifications",
    ],
  },
] as const;

export type ActionApprovalTierKey = (typeof ACTION_APPROVAL_TIERS)[number]["key"];

export function getActionApprovalTiers() {
  return ACTION_APPROVAL_TIERS;
}

export function mapRiskToActionTier(risk: string): (typeof ACTION_APPROVAL_TIERS)[number] | undefined {
  if (risk === "critical") return ACTION_APPROVAL_TIERS[4];
  if (risk === "high") return ACTION_APPROVAL_TIERS[3];
  if (risk === "medium") return ACTION_APPROVAL_TIERS[2];
  return ACTION_APPROVAL_TIERS[0];
}

export const ACTION_APPROVAL_MISSION =
  "Enable safe execution of operational actions while maintaining transparency, control, and trust.";

export const ACTION_APPROVAL_ABOS_PRINCIPLE =
  "Trust is built through transparency. Humans make decisions; Aipify helps them decide faster.";
