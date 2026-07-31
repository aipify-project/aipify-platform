import { AipifyCompanionBriefingBanner } from "@/components/app/briefing";
import { ApprovalsCenterPanel } from "@/components/app/approvals/ApprovalsCenterPanel";
import { buildApprovalsCenterLabels } from "@/lib/companion-action-approval/approvals-center-labels";
import { buildCompanionActionApprovalLabels } from "@/lib/companion-action-approval/labels";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { Suspense } from "react";
import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";

export default async function ApprovalsPage() {
  const locale = await getLocale();
  const [dashboardDict, brandingDict, companionActionApprovalDict] = await Promise.all([
    getCustomerAppDictionaryForSplits(locale, ["dashboard"]),
    getDictionary(locale, ["branding"]),
    getDictionary(locale, ["companionActionApproval"]),
  ]);
  const dict = { ...dashboardDict, ...brandingDict };
  const t = createTranslator(dict);
  const companionLabels = buildCompanionActionApprovalLabels(
    createTranslator(companionActionApprovalDict),
  );

  const labels = buildApprovalsCenterLabels(t, {
    pulseLabel: t("branding.pulseLabel"),
    companion: {
      section: t("customerApp.approvals.companionSection"),
      empty: t("customerApp.approvals.companionEmpty"),
      loadError: companionLabels.errorMessage,
      openCenter: companionLabels.title,
      reason: companionLabels.reason,
      expires: companionLabels.expires,
      category: companionLabels.category,
      statusLabels: {
        pending: companionLabels.status_pending,
        awaiting_approval: companionLabels.status_pending,
        approved: companionLabels.status_approved,
        rejected: companionLabels.status_rejected,
        status_pending: companionLabels.status_pending,
        status_approved: companionLabels.status_approved,
        status_rejected: companionLabels.status_rejected,
      },
    },
  });

  return (
    <div className="space-y-3">
      <div className="mx-auto w-full max-w-[1560px] px-4 pt-4 sm:px-6 lg:px-8">
        <AipifyCompanionBriefingBanner
          context="approvals"
          labels={buildCompanionBriefingLabels(t)}
        />
      </div>
      <Suspense fallback={<AipifyLoadingState message={labels.loading} centered />}>
        <ApprovalsCenterPanel locale={locale} labels={labels} />
      </Suspense>
    </div>
  );
}
