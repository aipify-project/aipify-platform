/**
 * Honest source-channel activation status for Support Center.
 * Only channels with a real, secure data contract are marked active.
 */

import { PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK } from "@/lib/platform-portal/support-tickets-read-adapter";

export type SupportChannelActivation = {
  id: string;
  labelKey: string;
  status: "active" | "incoming_live" | "staging_only" | "not_activated" | "prepared_only";
  noteKey: string;
  sotChannels: readonly string[];
};

export function listSupportChannelActivations(): SupportChannelActivation[] {
  const link = PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK;
  return [
    {
      id: "web",
      labelKey: "channels.web",
      // Public form exists. Intake V3 is applied on Staging only; Production intake stays off.
      status: "staging_only",
      noteKey: "channels.webNote",
      sotChannels: link.aipify_public_site.sotChannels,
    },
    {
      id: "app",
      labelKey: "channels.app",
      // Production inbox already holds APP channel tickets. Email send stays off.
      status: "incoming_live",
      noteKey: "channels.appNote",
      sotChannels: link.kompis_bedrift_app.sotChannels,
    },
    {
      id: "partner",
      labelKey: "channels.partner",
      // Partner intake V3 is applied on Staging only. Production feature stays off.
      status: "staging_only",
      noteKey: "channels.partnerNote",
      sotChannels: link.sellers_partners.sotChannels,
    },
    {
      id: "module",
      labelKey: "channels.module",
      status: "not_activated",
      noteKey: "channels.moduleNote",
      sotChannels: [],
    },
    {
      id: "kompis",
      labelKey: "channels.kompis",
      status: "not_activated",
      noteKey: "channels.kompisNote",
      sotChannels: [],
    },
  ];
}

/** Outbound email reply transport — separate owner gate (Resend/DNS/secrets). */
export const SUPPORT_EMAIL_SEND_CONFIGURED = false as const;
