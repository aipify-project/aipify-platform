/**
 * Honest source-channel activation status for Support Center.
 * Only channels with a real, secure data contract are marked active.
 */

import { PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK } from "@/lib/platform-portal/support-tickets-read-adapter";

export type SupportChannelActivation = {
  id: string;
  labelKey: string;
  status: "active" | "not_activated" | "prepared_only";
  noteKey: string;
  sotChannels: readonly string[];
};

export function listSupportChannelActivations(): SupportChannelActivation[] {
  const link = PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK;
  return [
    {
      id: "web",
      labelKey: "channels.web",
      // Form + API exist at /contact/support and /api/support-intake/web — Core write still gated.
      status: "prepared_only",
      noteKey: "channels.webNote",
      sotChannels: link.aipify_public_site.sotChannels,
    },
    {
      id: "app",
      labelKey: "channels.app",
      status: link.kompis_bedrift_app.linked ? "prepared_only" : "not_activated",
      noteKey: "channels.appNote",
      sotChannels: link.kompis_bedrift_app.sotChannels,
    },
    {
      id: "partner",
      labelKey: "channels.partner",
      // Authenticated CSP intake route prepared; Core write still gated. CRM stays separate.
      status: "prepared_only",
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
