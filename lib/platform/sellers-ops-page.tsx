import {
  CertifiedSellersOpsPanel,
  type SellersOpsLabels,
  type SellersOpsSection,
} from "@/components/platform/sellers/CertifiedSellersOpsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

function buildOpsLabels(t: (key: string) => string): SellersOpsLabels {
  const live = (k: string) => t(`platform.sellers.live.${k}`);
  const ops = (k: string) => t(`platform.sellers.ops.${k}`);
  return {
    loading: live("loading"),
    retry: live("retry"),
    errorTitle: live("errorTitle"),
    errorBody: live("errorBody"),
    forbiddenTitle: live("forbiddenTitle"),
    forbiddenBody: live("forbiddenBody"),
    searchPlaceholder: ops("searchPlaceholder"),
    emptyTitle: ops("emptyTitle"),
    emptyBody: ops("emptyBody"),
    colPartner: live("colPartner"),
    colCode: ops("colCode"),
    colClicks: ops("colClicks"),
    colVisits: ops("colVisits"),
    colRegistrations: ops("colRegistrations"),
    colStatus: live("colStatus"),
    colKind: ops("colKind"),
    colProduct: live("colProduct"),
    colAmount: ops("colAmount"),
    colDate: ops("colDate"),
    colAction: live("colAction"),
    colActor: ops("colActor"),
    colSubject: ops("colSubject"),
    colEffectiveFrom: ops("colEffectiveFrom"),
    colCategory: ops("colCategory"),
    colVersion: ops("colVersion"),
    openPartner: ops("openPartner"),
    kindRegistration: ops("kindRegistration"),
    kindSale: ops("kindSale"),
    active: ops("active"),
    inactive: ops("inactive"),
    published: live("productPublished"),
    draft: live("productDraft"),
    materialsGateTitle: ops("materialsGateTitle"),
    materialsGateBody: ops("materialsGateBody"),
    messagesGateTitle: ops("messagesGateTitle"),
    messagesGateBody: ops("messagesGateBody"),
    sendMessageTitle: ops("sendMessageTitle"),
    sendMessagePartnerId: ops("sendMessagePartnerId"),
    recipientSearchPlaceholder: ops("recipientSearchPlaceholder"),
    recipientEmpty: ops("recipientEmpty"),
    recipientNotEligible: ops("recipientNotEligible"),
    selectedRecipient: ops("selectedRecipient"),
    clearRecipient: ops("clearRecipient"),
    unnamedRecipient: ops("unnamedRecipient"),
    sendMessageSubject: ops("sendMessageSubject"),
    sendMessageBody: ops("sendMessageBody"),
    sendMessageCta: ops("sendMessageCta"),
    sendMessageOk: ops("sendMessageOk"),
    sendMessageError: ops("sendMessageError"),
    sendMessageBlocked: ops("sendMessageBlocked"),
    conversationTitle: ops("conversationTitle"),
    partnerStatusLabels: {
      registered: live("partnerStatus.registered"),
      under_review: live("partnerStatus.under_review"),
      needs_information: live("partnerStatus.needs_information"),
      approved: live("partnerStatus.approved"),
      active: live("partnerStatus.active"),
      certified: live("partnerStatus.certified"),
      in_academy: live("partnerStatus.in_academy"),
      rejected: live("partnerStatus.rejected"),
      suspended: live("partnerStatus.suspended"),
      unknown: live("partnerStatus.unknown"),
    },
    registerMaterialTitle: ops("registerMaterialTitle"),
    materialKey: ops("materialKey"),
    materialTitle: ops("materialTitle"),
    materialCategory: ops("materialCategory"),
    materialAssetPath: ops("materialAssetPath"),
    registerMaterialCta: ops("registerMaterialCta"),
    publishCta: ops("publishCta"),
    withdrawCta: ops("withdrawCta"),
    materialWriteOk: ops("materialWriteOk"),
    materialWriteError: ops("materialWriteError"),
    settingsPolicyTitle: ops("settingsPolicyTitle"),
    settingsPolicies: [
      ops("policyManualPayouts"),
      ops("policyNoStripeConnect"),
      ops("policyMonthlySecondPeriod"),
      ops("policyAnnualFirstPeriod"),
      ops("policyNoRetroactiveRates"),
      ops("policyAuditRequired"),
    ],
    notReported: live("notReported"),
    dateEmpty: live("dateEmpty"),
    dateInvalid: live("dateInvalid"),
  };
}

export async function renderPlatformSellersOpsPage(input: {
  titleKey: string;
  subtitleKey: string;
  section: SellersOpsSection;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <CertifiedSellersOpsPanel
      section={input.section}
      locale={locale}
      title={t(input.titleKey)}
      subtitle={t(input.subtitleKey)}
      notReadyTitle={t("platform.sellers.backend.notReadyTitle")}
      notReadyBody={t("platform.sellers.backend.notReadyBody")}
      labels={buildOpsLabels(t)}
    />
  );
}
