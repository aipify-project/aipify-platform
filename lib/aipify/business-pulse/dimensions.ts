export const PULSE_AREAS = [
  "support",
  "sales",
  "operations",
  "team",
  "customer",
  "automation",
] as const;

export type PulseArea = (typeof PULSE_AREAS)[number];

export const PULSE_STATUSES = [
  "normal",
  "worth_reviewing",
  "needs_attention",
  "requires_action",
] as const;

export type PulseStatus = (typeof PULSE_STATUSES)[number];

export const PULSE_ALERT_SEVERITIES = [
  "info",
  "review",
  "attention",
  "action_required",
] as const;

export type PulseAlertSeverity = (typeof PULSE_ALERT_SEVERITIES)[number];

export const PULSE_ALERT_STATUSES = [
  "active",
  "acknowledged",
  "resolved",
  "dismissed",
] as const;

export type PulseAlertStatus = (typeof PULSE_ALERT_STATUSES)[number];

export const BPE_ALLOWED_PLANS = ["business", "enterprise"] as const;

export const BPE_ENTERPRISE_PLANS = ["enterprise"] as const;

export const BPE_CORE_AREAS: PulseArea[] = ["support", "sales", "operations", "customer", "automation"];

export const BPE_ENTERPRISE_AREAS: PulseArea[] = ["team"];
