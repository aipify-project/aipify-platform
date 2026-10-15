/**
 * Platform Support inbox UI — Phase B dormant shell contract.
 *
 * Presentation-only while feature gates stay OFF. Does not call APP SoT RPCs,
 * invent tickets, or treat legacy queue / usage_statistics as ticket counts.
 */

import {
  PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK,
  PLATFORM_SUPPORT_TICKETS_READ_FEATURE_GATE,
  canInvokePlatformSupportTicketsReadRpc,
} from "./support-tickets-read-adapter";
import {
  PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED,
  PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED,
} from "./support-tickets-cross-tenant-read-contract";

export const PLATFORM_SUPPORT_INBOX_UI_CONTRACT_ID =
  "platform_support_inbox_ui_dormant_v1" as const;

/** Product inbox tabs for the future four-channel workspace. */
export const PLATFORM_SUPPORT_INBOX_PRODUCT_TABS = [
  "aipify_public_site",
  "kompis_web",
  "kompis_bedrift_app",
  "sellers_partners",
] as const;

export type PlatformSupportInboxProductTab =
  (typeof PLATFORM_SUPPORT_INBOX_PRODUCT_TABS)[number];

/**
 * Missing backend contracts — documented only; do not fake UI behaviour.
 */
export const PLATFORM_SUPPORT_INBOX_MISSING_CONTRACTS = [
  {
    id: "core_read_rpc_apply",
    required: true,
    status: "NOT_APPLIED" as const,
    detail:
      "docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql must be applied with named owner YES before live list/get/counts.",
  },
  {
    id: "feature_gate_on",
    required: true,
    status: "OFF" as const,
    detail: "PLATFORM_SUPPORT_TICKETS_READ_FEATURE_GATE remains false.",
  },
  {
    id: "ui_wire_flag",
    required: true,
    status: "OFF" as const,
    detail: "PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED remains false — no live ticket binding.",
  },
  {
    id: "public_site_ingest",
    required: true,
    status: "NOT_LINKED" as const,
    detail: "Aipify public website has no confirmed ticket write path into APP SoT.",
  },
  {
    id: "kompis_web_ticket_escalation",
    required: true,
    status: "NOT_LINKED" as const,
    detail: "Kompis Web ask/FAQ is not APP ticket SoT (frozen public chain).",
  },
  {
    id: "sellers_ticket_ingest",
    required: true,
    status: "NOT_LINKED" as const,
    detail: "Selgere / Growth Partner has no dedicated ticket ingest into APP SoT.",
  },
  {
    id: "source_locale_column",
    required: false,
    status: "ABSENT" as const,
    detail:
      "source_locale is not on app_portal_support_requests — dual-language UI stays planned; never invent locale.",
  },
  {
    id: "outbound_reply_approve_send",
    required: true,
    status: "MISSING" as const,
    detail:
      "No Platform reply/send RPC with human approval gate — reply composer stays dormant.",
  },
  {
    id: "translation_pipeline",
    required: false,
    status: "MISSING" as const,
    detail:
      "Original + Norwegian translation + outbound translation require a separate approved job.",
  },
] as const;

export function getPlatformSupportInboxUiGateState() {
  return {
    contractId: PLATFORM_SUPPORT_INBOX_UI_CONTRACT_ID,
    rpcConnected: PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED,
    featureGate: PLATFORM_SUPPORT_TICKETS_READ_FEATURE_GATE,
    uiWired: PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED,
    liveTickets: canInvokePlatformSupportTicketsReadRpc() && PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED,
    productChannelLink: PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK,
    missingContracts: PLATFORM_SUPPORT_INBOX_MISSING_CONTRACTS,
  };
}

export function assertPlatformSupportInboxUiIsDormant(): boolean {
  return (
    PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED === false &&
    PLATFORM_SUPPORT_TICKETS_READ_FEATURE_GATE === false &&
    PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED === false &&
    getPlatformSupportInboxUiGateState().liveTickets === false
  );
}
