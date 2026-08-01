import type { InstallationSupportMode } from "./enums";

export const INSTALLATION_HANDOFF_TYPES = [
  "aipify_managed_setup",
  "guided_setup_request",
  "customer_it_invitation",
  "self_service_start",
] as const;

export type InstallationHandoffType = (typeof INSTALLATION_HANDOFF_TYPES)[number];

export const INSTALLATION_HANDOFF_STATUSES = [
  "requested",
  "acknowledged",
  "assigned",
  "in_progress",
  "waiting_customer",
  "completed",
  "cancelled",
  "failed",
] as const;

export type InstallationHandoffStatus = (typeof INSTALLATION_HANDOFF_STATUSES)[number];

export type InstallationHandoffResponse = {
  handoff_request_id: string;
  status: InstallationHandoffStatus | string;
  lifecycle_state: string;
  next_step: string;
  created_at: string;
  requested_at?: string;
  duplicate: boolean;
  invite_id?: string | null;
  recipient_email?: string | null;
  notification_id?: string | null;
  error_code?: string;
};

export function handoffTypeForSupportMode(
  mode: InstallationSupportMode
): InstallationHandoffType | null {
  switch (mode) {
    case "aipify_managed":
      return "aipify_managed_setup";
    case "guided":
      return "guided_setup_request";
    case "customer_it_managed":
      return "customer_it_invitation";
    case "self_service":
      return "self_service_start";
    default:
      return null;
  }
}

export function isOperationalHandoffAction(action: {
  handoff?: string | null;
  action_key: string;
}): boolean {
  if (action.handoff === "request" || action.handoff === "invite") return true;
  return (
    action.action_key === "aipify_managed" ||
    action.action_key === "request_guided" ||
    action.action_key === "invite_it"
  );
}

export function buildHandoffIdempotencyKey(opts: {
  providerKey: string;
  handoffType: InstallationHandoffType;
  sessionId: string | null | undefined;
}): string {
  const sessionPart = opts.sessionId?.trim() || "no-session";
  return `handoff:${opts.providerKey}:${opts.handoffType}:${sessionPart}`;
}

export function isValidInviteEmail(value: string | null | undefined): boolean {
  if (!value) return false;
  const email = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Open (not terminal) handoff statuses that mean waiting is legitimate. */
export function isOpenHandoffStatus(status: string | null | undefined): boolean {
  if (!status) return false;
  return (
    status === "requested" ||
    status === "acknowledged" ||
    status === "assigned" ||
    status === "in_progress" ||
    status === "waiting_customer"
  );
}
