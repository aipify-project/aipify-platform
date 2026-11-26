/**
 * Label contract for the canonical Certified Seller profile (`platform.sellers.profile.*`).
 * Pure — safe to import from server label builders and client components alike.
 */
import type { Translator } from "@/lib/i18n/translate";

export const SELLER_PROFILE_TEXT_KEYS = [
  "title",
  "openFullProfile",
  "backToPartners",
  "avatarAlt",
  "unnamedSeller",
  "certifiedBadge",
  "notCertifiedBadge",
  "sendMessage",
  "managePartner",
  "hideManage",
  "manageTitle",
  "manageHint",
  "kpiRegionLabel",
  "kpiClicks",
  "kpiRegistrations",
  "kpiSales",
  "kpiCommissions",
  "kpiCertifications",
  "kpiOpenSettlements",
  "notReported",
  "unknownValue",
  "sectionUnavailable",
  "tabsLabel",
  "tabOverview",
  "tabSales",
  "tabAcademy",
  "tabCommissions",
  "tabMessages",
  "tabHistory",
  "overviewRecentActivity",
  "linksTitle",
  "linksEmpty",
  "colCode",
  "colChannel",
  "colClicks",
  "colRegistrations",
  "colLinkStatus",
  "linkActive",
  "linkInactive",
  "salesTitle",
  "salesEmpty",
  "colProduct",
  "colSaleStatus",
  "colDate",
  "colAmount",
  "colPaidPeriods",
  "academyTitle",
  "commissionsEarnedTitle",
  "commissionsEarnedEmpty",
  "settlementsTitle",
  "settlementsEmpty",
  "colPeriod",
  "colSettlementStatus",
  "colTotal",
  "ledgerTitle",
  "ledgerEmpty",
  "colEntryType",
  "ledgerNote",
  "messagesGateTitle",
  "messagesGateBody",
  "openMessages",
  "sendMessageSubject",
  "sendMessageBody",
  "sendMessageCta",
  "sendMessageOk",
  "sendMessageError",
  "sendMessageBlocked",
  "messagesEmpty",
  "conversationTitle",
  "directionAdmin",
  "directionPartner",
  "readYes",
  "readNo",
  "historyTitle",
  "historyEmpty",
  "accessTitle",
  "dualIdentityTitle",
  "dualIdentityBody",
  "dualIdentityActive",
  "dualIdentityNone",
  "referenceLabel",
] as const;

export const SELLER_PROFILE_CHANNEL_KEYS = [
  "referral_link",
  "partner_code",
  "partner_registered_customer",
  "event",
  "manual_platform_assignment",
  "unknown",
] as const;

export const SELLER_PROFILE_SALE_STATUS_KEYS = [
  "registered_awaiting_second_payment",
  "pending_possible",
  "earned",
  "approved_for_payout",
  "queued_for_payout",
  "paid",
  "reversed",
  "rejected",
  "unknown",
] as const;

export const SELLER_PROFILE_LEDGER_TYPE_KEYS = ["earned", "payout", "reversal", "adjustment", "unknown"] as const;
export const SELLER_PROFILE_ACTOR_KEYS = ["partner", "platform_admin", "system", "unknown"] as const;
export const SELLER_PROFILE_SETTLEMENT_STATUS_KEYS = ["open", "approved", "closed", "paid", "voided", "unknown"] as const;

export type SellerProfileLabels = Record<(typeof SELLER_PROFILE_TEXT_KEYS)[number], string> & {
  channelLabels: Record<string, string>;
  saleStatusLabels: Record<string, string>;
  ledgerTypeLabels: Record<string, string>;
  actorLabels: Record<string, string>;
  settlementStatusLabels: Record<string, string>;
};

function labelMap(keys: readonly string[], resolve: (key: string) => string): Record<string, string> {
  return Object.fromEntries(keys.map((key) => [key, resolve(key)]));
}

/** `platform.sellers.profile.*` → typed labels. */
export function buildSellerProfileLabels(t: Translator): SellerProfileLabels {
  const k = (key: string) => t(`platform.sellers.profile.${key}`);
  const text = labelMap(SELLER_PROFILE_TEXT_KEYS, k) as Record<(typeof SELLER_PROFILE_TEXT_KEYS)[number], string>;
  return {
    ...text,
    channelLabels: labelMap(SELLER_PROFILE_CHANNEL_KEYS, (key) => k(`channelLabels.${key}`)),
    saleStatusLabels: labelMap(SELLER_PROFILE_SALE_STATUS_KEYS, (key) => k(`saleStatusLabels.${key}`)),
    ledgerTypeLabels: labelMap(SELLER_PROFILE_LEDGER_TYPE_KEYS, (key) => k(`ledgerTypeLabels.${key}`)),
    actorLabels: labelMap(SELLER_PROFILE_ACTOR_KEYS, (key) => k(`actorLabels.${key}`)),
    settlementStatusLabels: labelMap(SELLER_PROFILE_SETTLEMENT_STATUS_KEYS, (key) =>
      key === "unknown" ? k("unknownValue") : t(`platform.sellers.actions.settlementStatusOptions.${key}`),
    ),
  };
}
