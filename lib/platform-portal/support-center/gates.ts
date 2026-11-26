/**
 * Aggregated Support Center gates — honest activation status for UI.
 */

import {
  getPlatformSupportTicketsReadGateState,
  canInvokePlatformSupportTicketsReadRpc,
} from "@/lib/platform-portal/support-tickets-read-adapter";
import { SUPPORT_EMAIL_SEND_CONFIGURED } from "./channel-status";
import { SUPPORT_SIGNATURE_PERSIST_CONFIGURED } from "./signature";
import { SUPPORT_TEMPLATE_PERSIST_CONFIGURED } from "./reply-templates";
import type { SupportCenterGateState } from "./types";

export function getSupportCenterGateState(): SupportCenterGateState {
  const tickets = getPlatformSupportTicketsReadGateState();
  return {
    ticketsLive: canInvokePlatformSupportTicketsReadRpc(),
    emailSendConfigured: SUPPORT_EMAIL_SEND_CONFIGURED,
    signaturePersistConfigured: SUPPORT_SIGNATURE_PERSIST_CONFIGURED,
    templatePersistConfigured: SUPPORT_TEMPLATE_PERSIST_CONFIGURED,
    rpcConnected: tickets.rpcConnected,
    featureGate: tickets.featureGate,
    uiWired: tickets.uiWired,
  };
}

/** Explicit: email send remains off for Staging activation. */
export const SUPPORT_CENTER_EMAIL_SEND_REMAINS_OFF = !SUPPORT_EMAIL_SEND_CONFIGURED;
