import type { WebsiteKompisCommunicationTemplate } from "./types";

/**
 * Draft communication catalog for Platform preview.
 * No send pipeline — customer transactional email catalogs are MISSING in Core.
 */
export const WEBSITE_KOMPIS_COMMUNICATION_TEMPLATES: readonly WebsiteKompisCommunicationTemplate[] =
  [
    {
      id: "welcome_free",
      deliveryStatus: "draft_preview_only",
      requiresLedgerEvent: false,
      requiresStripeEvent: false,
    },
    {
      id: "quota_remaining_30",
      deliveryStatus: "draft_preview_only",
      requiresLedgerEvent: true,
      requiresStripeEvent: false,
    },
    {
      id: "quota_remaining_10",
      deliveryStatus: "draft_preview_only",
      requiresLedgerEvent: true,
      requiresStripeEvent: false,
    },
    {
      id: "quota_remaining_0",
      deliveryStatus: "draft_preview_only",
      requiresLedgerEvent: true,
      requiresStripeEvent: false,
    },
    {
      id: "upgrade_confirmed",
      deliveryStatus: "draft_preview_only",
      requiresLedgerEvent: true,
      requiresStripeEvent: true,
    },
    {
      id: "invoice_paid",
      deliveryStatus: "draft_preview_only",
      requiresLedgerEvent: false,
      requiresStripeEvent: true,
    },
    {
      id: "payment_failed",
      deliveryStatus: "draft_preview_only",
      requiresLedgerEvent: false,
      requiresStripeEvent: true,
    },
    {
      id: "payment_grace_3_days",
      deliveryStatus: "draft_preview_only",
      requiresLedgerEvent: false,
      requiresStripeEvent: true,
    },
    {
      id: "reactivated",
      deliveryStatus: "draft_preview_only",
      requiresLedgerEvent: true,
      requiresStripeEvent: true,
    },
  ] as const;

export type WebsiteKompisEmailPreviewCopy = {
  subject: string;
  title: string;
  body: string;
  ctaLabel: string;
};

/** Localized preview bodies — presentation only; never marks delivery as sent. */
export function buildWebsiteKompisEmailPreviewCopy(
  templateId: WebsiteKompisCommunicationTemplate["id"],
  t: (key: string) => string
): WebsiteKompisEmailPreviewCopy {
  const p = `platform.websiteKompisPlans.preview.${templateId}`;
  return {
    subject: t(`${p}.subject`),
    title: t(`${p}.title`),
    body: t(`${p}.body`),
    ctaLabel: t(`${p}.cta`),
  };
}
