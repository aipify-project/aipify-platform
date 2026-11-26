/**
 * Aggregated Support Center gates — honest activation status for UI.
 */

import {
  getPlatformSupportTicketsReadGateState,
  canInvokePlatformSupportTicketsReadRpc,
} from "@/lib/platform-portal/support-tickets-read-adapter";
import { SUPPORT_EMAIL_SEND_CONFIGURED } from "./channel-status";
import { resolveSupportCenterLiveGates } from "./staging-core-activation";
import type { SupportCenterGateState } from "./types";

export function getSupportCenterGateState(): SupportCenterGateState {
  const tickets = getPlatformSupportTicketsReadGateState();
  const live = resolveSupportCenterLiveGates();
  return {
    ticketsLive: canInvokePlatformSupportTicketsReadRpc(),
    emailSendConfigured: SUPPORT_EMAIL_SEND_CONFIGURED || live.emailSendConfigured,
    signaturePersistConfigured: live.signaturePersistConfigured,
    templatePersistConfigured: live.templatePersistConfigured,
    rpcConnected: tickets.rpcConnected,
    featureGate: tickets.featureGate,
    uiWired: tickets.uiWired,
  };
}

/** Explicit: email send remains off for Staging activation. */
export const SUPPORT_CENTER_EMAIL_SEND_REMAINS_OFF = !SUPPORT_EMAIL_SEND_CONFIGURED;
