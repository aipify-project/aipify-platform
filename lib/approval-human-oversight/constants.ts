export const APPROVAL_HUMAN_OVERSIGHT_ROUTE = "/app/governance/approval-center";

export const APPROVAL_CATEGORIES = [
  "personal",
  "business",
  "financial",
  "technical",
  "executive",
] as const;

export const APPROVAL_RISK_LEVELS = ["low", "moderate", "elevated", "high"] as const;

export const APPROVAL_OVERSIGHT_CORE_PRINCIPLE =
  "Aipify may recommend. Humans remain responsible for important decisions.";

export const APPROVAL_OVERSIGHT_VISION =
  "Aipify should help people move faster without sacrificing control. Efficiency and responsibility grow together.";

export const SNOOZE_OPTIONS = [
  { key: "1h", hours: 1 },
  { key: "tomorrow", hours: 24 },
  { key: "next_business_day", hours: 48 },
] as const;
