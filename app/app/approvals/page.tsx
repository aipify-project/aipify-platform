import { ApprovalsCenterPanel } from "@/components/app/approvals/ApprovalsCenterPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ApprovalsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp", "branding"]);
  const t = createTranslator(dict);

  return (
    <ApprovalsCenterPanel
      locale={locale}
      labels={{
        title: t("customerApp.approvals.title"),
        subtitle: t("customerApp.approvals.subtitle"),
        loading: t("customerApp.approvals.loading"),
        empty: t("customerApp.approvals.empty"),
        pulseLabel: t("branding.pulseLabel"),
        openActionCenter: t("customerApp.approvals.openActionCenter"),
        statusLabels: {
          pending: t("customerApp.approvals.statusLabels.pending"),
          approved: t("customerApp.approvals.statusLabels.approved"),
          rejected: t("customerApp.approvals.statusLabels.rejected"),
          completed: t("customerApp.approvals.statusLabels.completed"),
        },
        categoryLabels: {
          notification: t("customerApp.approvals.categoryLabels.notification"),
          recommendation: t("customerApp.approvals.categoryLabels.recommendation"),
          automation: t("customerApp.approvals.categoryLabels.automation"),
          integration: t("customerApp.approvals.categoryLabels.integration"),
          update: t("customerApp.approvals.categoryLabels.update"),
        },
      }}
    />
  );
}
