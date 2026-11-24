/**
 * Kompis help for the partner test/academy context is DISABLED.
 * Honest blocked state — no Core / Website Kompis changes are made here; consumers
 * simply render this constant instead of calling any Kompis ask path.
 */
export const HONEST_BLOCKED = {
  enabled: false,
  reason: "kompis_help_disabled_for_partner_test",
  /** i18n key for the visible, honest explanation. */
  messageKey: "customerApp.certifiedSalesPartner.kompisHelpDisabled",
} as const;

export type CspKompisHelpState = typeof HONEST_BLOCKED;

export function isKompisHelpAvailableInPartnerContext(): false {
  return HONEST_BLOCKED.enabled;
}
