/**
 * Platform Support Center V1 — domain types (tickets, status, tabs, gates).
 * Canonical ticket SoT remains app_portal_support_requests (read adapter).
 */

export const SUPPORT_CENTER_TAB_IDS = [
  "all",
  "mine",
  "templates",
  "signature",
  "channels",
] as const;

export type SupportCenterTabId = (typeof SUPPORT_CENTER_TAB_IDS)[number];

export const SUPPORT_TICKET_STATUSES = [
  "new",
  "open",
  "in_progress",
  "waiting_for_customer",
  "waiting_internal",
  "resolved",
  "closed",
  "reopened",
  "archived",
] as const;

export type SupportTicketStatus = (typeof SUPPORT_TICKET_STATUSES)[number];

export const SUPPORT_TICKET_PRIORITIES = [
  "low",
  "normal",
  "high",
  "critical",
  "urgent",
] as const;

export type SupportTicketPriority = (typeof SUPPORT_TICKET_PRIORITIES)[number];

/** Allowed template variables — never free client-controlled execution. */
export const SUPPORT_TEMPLATE_VARIABLES = [
  "customer_name",
  "ticket_number",
  "product_name",
  "agent_name",
] as const;

export type SupportTemplateVariable = (typeof SUPPORT_TEMPLATE_VARIABLES)[number];

export type SupportCenterGateState = {
  ticketsLive: boolean;
  emailSendConfigured: boolean;
  signaturePersistConfigured: boolean;
  templatePersistConfigured: boolean;
  rpcConnected: boolean;
  featureGate: boolean;
  uiWired: boolean;
};

export function isSupportCenterTabId(value: string | null | undefined): value is SupportCenterTabId {
  return (
    typeof value === "string" &&
    (SUPPORT_CENTER_TAB_IDS as readonly string[]).includes(value)
  );
}

export function parseSupportCenterTab(
  value: string | null | undefined,
): SupportCenterTabId {
  return isSupportCenterTabId(value) ? value : "all";
}
