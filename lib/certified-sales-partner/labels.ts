import type { Translator } from "@/lib/i18n/translate";
import type {
  CspChannelOrigin,
  CspPartnerStatus,
  CspSaleStatus,
  CspSettlementStatus,
} from "./constants";

/** i18n namespace (customer-app split `certifiedSalesPartner`). Strings live in locale files only. */
export const CSP_LABEL_NS = "customerApp.certifiedSalesPartner";

export type CspLabels = {
  title: string;
  subtitle: string;
  backendNotReady: string;
  kompisHelpDisabled: string;
  saleStatus: Record<CspSaleStatus, string>;
  partnerStatus: Record<CspPartnerStatus, string>;
  channelOrigin: Record<CspChannelOrigin, string>;
  settlementStatus: Record<CspSettlementStatus, string>;
};

export function buildCspSaleStatusLabel(t: Translator, status: CspSaleStatus): string {
  return t(`${CSP_LABEL_NS}.saleStatus.${status}`);
}

export function buildCspPartnerStatusLabel(t: Translator, status: CspPartnerStatus): string {
  return t(`${CSP_LABEL_NS}.partnerStatus.${status}`);
}

export function buildCspChannelOriginLabel(t: Translator, origin: CspChannelOrigin): string {
  return t(`${CSP_LABEL_NS}.channelOrigin.${origin}`);
}

export function buildCspSettlementStatusLabel(t: Translator, status: CspSettlementStatus): string {
  return t(`${CSP_LABEL_NS}.settlementStatus.${status}`);
}

export function buildCspLabels(t: Translator): CspLabels {
  const map = <K extends string>(keys: readonly K[], group: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`${CSP_LABEL_NS}.${group}.${k}`)])) as Record<K, string>;
  return {
    title: t(`${CSP_LABEL_NS}.title`),
    subtitle: t(`${CSP_LABEL_NS}.subtitle`),
    backendNotReady: t(`${CSP_LABEL_NS}.backendNotReady`),
    kompisHelpDisabled: t(`${CSP_LABEL_NS}.kompisHelpDisabled`),
    saleStatus: map(
      [
        "registered_awaiting_second_payment",
        "pending_possible",
        "earned",
        "approved_for_payout",
        "queued_for_payout",
        "paid",
        "reversed",
        "rejected",
      ] as const,
      "saleStatus",
    ),
    partnerStatus: map(
      [
        "registered",
        "under_review",
        "needs_information",
        "approved",
        "rejected",
        "suspended",
      ] as const,
      "partnerStatus",
    ),
    channelOrigin: map(
      [
        "facebook",
        "instagram",
        "x",
        "snapchat",
        "tiktok",
        "linkedin",
        "email",
        "qr",
        "other",
        "referral_link",
        "partner_code",
        "manual_platform_assignment",
      ] as const,
      "channelOrigin",
    ),
    settlementStatus: map(["open", "closed", "approved", "paid", "voided"] as const, "settlementStatus"),
  };
}

export function buildCertifiedSalesPartnerLabels(t: Translator) {
  const base = buildCspLabels(t);
  return {
    brand: t(`${CSP_LABEL_NS}.brand`),
    portalBadge: t(`${CSP_LABEL_NS}.portal.badge`),
    portalTitle: t(`${CSP_LABEL_NS}.portal.title`),
    portalSubtitle: t(`${CSP_LABEL_NS}.portal.subtitle`),
    backendNotReadyTitle: t(`${CSP_LABEL_NS}.backend.notReadyTitle`),
    backendNotReadyBody: base.backendNotReady,
    kompisBlockedTitle: t(`${CSP_LABEL_NS}.kompis.honestBlockedTitle`),
    kompisBlockedBody: base.kompisHelpDisabled,
    recruitmentCta: t(`${CSP_LABEL_NS}.recruitment.cta`),
    independentPartnerNote: t(`${CSP_LABEL_NS}.recruitment.independentNote`),
    noIncomeGuarantee: t(`${CSP_LABEL_NS}.recruitment.noIncomeGuarantee`),
    getMyLink: t(`${CSP_LABEL_NS}.catalog.getMyLink`),
    share: t(`${CSP_LABEL_NS}.catalog.share`),
    takeTest: t(`${CSP_LABEL_NS}.catalog.takeTest`),
    noBuyButton: t(`${CSP_LABEL_NS}.catalog.noBuyButton`),
    ...base,
  };
}
