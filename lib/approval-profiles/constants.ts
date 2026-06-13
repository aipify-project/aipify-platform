export const APPROVAL_PROFILES_ROUTE = "/app/governance/approval-profiles";

export const PROFILE_TYPES = ["personal", "business", "executive", "department"] as const;

export const APPROVAL_MODES = ["always_ask", "simplified", "rule_based"] as const;

export const REVIEW_STATES = ["current", "needs_review", "suspended", "expired"] as const;

export const APPROVAL_PROFILES_CORE_PRINCIPLE =
  "People should not need to repeatedly approve the same low-risk actions. Aipify should make approvals easier without removing meaningful control.";

export const APPROVAL_PROFILES_PHILOSOPHY =
  'Without profiles: repeated "Do you approve this action?" With profiles: "I recognize this matches your approved preferences."';

export const APPROVAL_PROFILES_VISION =
  "The goal is not to eliminate approvals. The goal is to reserve human attention for the approvals that truly matter.";
