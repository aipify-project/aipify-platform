/**
 * Honest source-channel activation status for Support Center.
 * Config status follows Support intake gates. Runtime health is not claimed
 * from Admin alone — successful public submit verifies the rate-limit store.
 */

import { getSupportIntakeGateState } from "@/lib/support-intake/submit";
import { PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK } from "@/lib/platform-portal/support-tickets-read-adapter";

export type SupportChannelActivation = {
  id: string;
  labelKey: string;
  status: "active" | "incoming_live" | "staging_only" | "not_activated" | "prepared_only";
  noteKey: string;
  sotChannels: readonly string[];
  /** Config from app gates only — never implies Redis/RPC runtime health. */
  runtimeHealth: "unverified" | "not_applicable";
};

export function listSupportChannelActivations(): SupportChannelActivation[] {
  const link = PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK;
  const intakeLive = getSupportIntakeGateState().live;
  return [
    {
      id: "web",
      labelKey: "channels.web",
      // Public website intake follows SUPPORT_INTAKE_* gates (config), not Admin UI.
      status: intakeLive ? "active" : "staging_only",
      noteKey: intakeLive ? "channels.webNoteLive" : "channels.webNote",
      sotChannels: link.aipify_public_site.sotChannels,
      runtimeHealth: "unverified",
    },
    {
      id: "app",
      labelKey: "channels.app",
      // Production inbox already holds APP channel tickets. Email send stays off.
      status: "incoming_live",
      noteKey: "channels.appNote",
      sotChannels: link.kompis_bedrift_app.sotChannels,
      runtimeHealth: "not_applicable",
    },
    {
      id: "partner",
      labelKey: "channels.partner",
      // Partner create shares the same SUPPORT_INTAKE_* config gates as web.
      // Do not invent a separate partner activation here.
      status: intakeLive ? "active" : "staging_only",
      noteKey: intakeLive ? "channels.partnerNoteLive" : "channels.partnerNote",
      sotChannels: link.sellers_partners.sotChannels,
      runtimeHealth: "unverified",
    },
    {
      id: "module",
      labelKey: "channels.module",
      status: "not_activated",
      noteKey: "channels.moduleNote",
      sotChannels: [],
      runtimeHealth: "not_applicable",
    },
    {
      id: "kompis",
      labelKey: "channels.kompis",
      status: "not_activated",
      noteKey: "channels.kompisNote",
      sotChannels: [],
      runtimeHealth: "not_applicable",
    },
  ];
}

/** Outbound email reply transport — separate owner gate (Resend/DNS/secrets). */
export const SUPPORT_EMAIL_SEND_CONFIGURED = false as const;
