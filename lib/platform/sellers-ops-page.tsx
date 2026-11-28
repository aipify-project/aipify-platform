import {
  CertifiedSellersOpsPanel,
  type SellersOpsLabels,
  type SellersOpsSection,
} from "@/components/platform/sellers/CertifiedSellersOpsPanel";
import { PlatformSellersHubShell } from "@/components/platform/sellers/PlatformSellersHubShell";
import { OPS_AUDIT_ACTION_KEYS } from "@/lib/certified-sales-partner/platform-sellers-ops-view";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPlatformSellersHubLabels } from "@/lib/platform/sellers-hub-labels";

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
    materialUploadPending: ops("materialUploadPending"),
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
    navLabel: live("sectionsTitle"),
    navLabels: {
      overview: t("platform.sellers.overview.title"),
      partners: t("platform.sellers.partners.title"),
      products: t("platform.sellers.products.title"),
      commissionRates: t("platform.sellers.commissionRates.title"),
      attribution: t("platform.sellers.attribution.title"),
      academy: t("platform.sellers.academy.title"),
      materials: t("platform.sellers.materials.title"),
      leadsSales: t("platform.sellers.leadsSales.title"),
      commissions: t("platform.sellers.commissions.title"),
      settlements: t("platform.sellers.settlements.title"),
      messages: t("platform.sellers.messages.title"),
      audit: t("platform.sellers.audit.title"),
      settings: t("platform.sellers.settings.title"),
    },
    folderInbox: ops("folderInbox"),
    folderSent: ops("folderSent"),
    folderArchive: ops("folderArchive"),
    archiveBlocked: ops("archiveBlocked"),
    directionAdminToPartner: ops("directionAdminToPartner"),
    directionPartnerToAdmin: ops("directionPartnerToAdmin"),
    deliveryStatus: {
      recorded: ops("deliveryStatus.recorded"),
      queued: ops("deliveryStatus.queued"),
      sent: ops("deliveryStatus.sent"),
      failed: ops("deliveryStatus.failed"),
      read: ops("deliveryStatus.read"),
      unknown: ops("deliveryStatus.unknown"),
    },
    auditFallback: ops("auditFallback"),
    auditActions: Object.fromEntries(OPS_AUDIT_ACTION_KEYS.map((key) => [key, ops(`auditActions.${key}`)])),
    materialFilterAll: ops("materialFilterAll"),
    materialFilterDraft: ops("materialFilterDraft"),
    materialFilterPublished: ops("materialFilterPublished"),
    materialGroupBanners: ops("materialGroupBanners"),
    materialGroupCopy: ops("materialGroupCopy"),
    materialGroupEmail: ops("materialGroupEmail"),
    materialGroupOther: ops("materialGroupOther"),
    materialGroupEmpty: ops("materialGroupEmpty"),
    materialTechnical: ops("materialTechnical"),
    settingsCurrentTitle: ops("settingsCurrentTitle"),
    settingsApprovalTitle: ops("settingsApprovalTitle"),
    settingsApprovalPercent: ops("settingsApprovalPercent"),
    settingsApprovalMessages: ops("settingsApprovalMessages"),
    ratesReadOnly: ops("ratesReadOnly"),
    ratesVariantMappingNote: ops("ratesVariantMappingNote"),
    ratesPersistenceBlocked: ops("ratesPersistenceBlocked"),
    ratesCoreEnabled: ops("ratesCoreEnabled"),
    ratesOpenProductEditor: ops("ratesOpenProductEditor"),
    ratesColVariantMapping: ops("ratesColVariantMapping"),
    ratesMappingRequired: ops("ratesMappingRequired"),
    ratesExVat: ops("ratesExVat"),
    ratesColVariant: ops("ratesColVariant"),
    ratesColInterval: ops("ratesColInterval"),
    ratesColModel: ops("ratesColModel"),
    ratesLegacyProductTitle: ops("ratesLegacyProductTitle"),
    ratesVariantCoreTitle: ops("ratesVariantCoreTitle"),
    ratesCommissionDraft: {
      title: t("platform.sellers.actions.editorVariantCommissionTitle"),
      active: t("platform.sellers.actions.editorVariantCommissionActive"),
      inactive: t("platform.sellers.actions.editorVariantCommissionInactive"),
      modelFixed: t("platform.sellers.actions.editorVariantCommissionModelFixed"),
      modelPercent: t("platform.sellers.actions.editorVariantCommissionModelPercent"),
      amountFixed: t("platform.sellers.actions.editorVariantCommissionAmountFixed"),
      ratePercent: t("platform.sellers.actions.editorVariantCommissionRatePercent"),
      preview: t("platform.sellers.actions.editorVariantCommissionPreview"),
      previewInactive: t("platform.sellers.actions.editorVariantCommissionPreviewInactive"),
      exVat: t("platform.sellers.actions.editorVariantVatExclusive"),
      percentBasis: t("platform.sellers.actions.editorVariantCommissionPercentBasis"),
      freeHint: t("platform.sellers.actions.editorVariantCommissionFreeHint"),
      notConfigured: t("platform.sellers.actions.editorVariantCommissionNotConfigured"),
      configure: t("platform.sellers.actions.editorVariantCommissionConfigure"),
      clearConfiguration: t("platform.sellers.actions.editorVariantCommissionClear"),
    },
    ratesCommissionMonth: t("platform.sellers.actions.editorVariantCommissionMonth"),
    ratesCommissionYear: t("platform.sellers.actions.editorVariantCommissionYear"),
    ratesCommissionOneTime: t("platform.sellers.actions.editorVariantCommissionOneTime"),
    newMessage: ops("newMessage"),
    closeCompose: ops("closeCompose"),
    fromAdmin: ops("fromAdmin"),
    fromPartner: ops("fromPartner"),
    allConversations: ops("allConversations"),
    sentByAdmin: ops("sentByAdmin"),
    threadEmpty: ops("threadEmpty"),
    unread: ops("unread"),
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
    <PlatformSellersHubShell labels={buildPlatformSellersHubLabels(t)}>
      <CertifiedSellersOpsPanel
        section={input.section}
        locale={locale}
        title={t(input.titleKey)}
        subtitle={t(input.subtitleKey)}
        notReadyTitle={t("platform.sellers.backend.notReadyTitle")}
        notReadyBody={t("platform.sellers.backend.notReadyBody")}
        labels={buildOpsLabels(t)}
      />
    </PlatformSellersHubShell>
  );
}
