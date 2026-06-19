import { TaxVerificationPanel } from "@/components/platform/billing";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBillingVatEnginePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <TaxVerificationPanel
      labels={{
        title: t("platform.billingCommerceCenter.modules.vatEngine"),
        subtitle: t("platform.billingCommerceCenter.moduleDescriptions.vatEngine"),
        loading: t("platform.taxVerification.loading"),
        legalReviewBanner: t("platform.taxVerification.legalReviewBanner"),
        customerType: t("platform.taxVerification.customerType"),
        vatNumber: t("platform.taxVerification.vatNumber"),
        validationStatus: t("platform.taxVerification.validationStatus"),
        vatApplied: t("platform.taxVerification.vatApplied"),
        reverseCharge: t("platform.taxVerification.reverseCharge"),
        invoiceHistory: t("platform.taxVerification.invoiceHistory"),
        validationLogs: t("platform.taxVerification.validationLogs"),
        taxNotes: t("platform.taxVerification.taxNotes"),
        auditLogs: t("platform.taxVerification.auditLogs"),
        empty: t("platform.taxVerification.empty"),
        stats: {
          totalSessions: t("platform.taxVerification.stats.totalSessions"),
          reverseChargeCount: t("platform.taxVerification.stats.reverseChargeCount"),
          invalidValidations: t("platform.taxVerification.stats.invalidValidations"),
          serviceFailures: t("platform.taxVerification.stats.serviceFailures"),
        },
      }}
    />
  );
}
