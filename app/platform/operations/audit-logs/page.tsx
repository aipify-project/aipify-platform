import PlatformActionsListPanel from "@/components/platform/PlatformActionsListPanel";
import { PlatformDriftHubShell } from "@/components/platform/drift/PlatformDriftHubShell";
import { DRIFT_OPERATIONS_HUB_ID } from "@/lib/platform/drift-hub";
import { buildActionListPanelLabels } from "@/lib/platform/action-page-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import Link from "next/link";

export default async function PlatformOperationsAuditLogsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const actionLabels = buildActionListPanelLabels(t, "executed");

  return (
    <PlatformDriftHubShell hub={DRIFT_OPERATIONS_HUB_ID}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--aipify-text)]">
            {t("platform.driftHub.auditLogs.title")}
          </h1>
          <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">
            {t("platform.driftHub.auditLogs.subtitle")}
          </p>
          <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">
            {t("platform.driftHub.auditLogs.scopeNote")}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link
              href="/platform/actions"
              className="font-medium text-violet-700 hover:text-violet-800 dark:text-violet-300"
            >
              {t("platform.driftHub.auditLogs.openActions")}
            </Link>
            <Link
              href="/platform/governance/activity-logs"
              className="font-medium text-violet-700 hover:text-violet-800 dark:text-violet-300"
            >
              {t("platform.driftHub.auditLogs.openGovernance")}
            </Link>
          </div>
        </div>

        <PlatformActionsListPanel
          locale={locale}
          statusFilter={null}
          showActions
          hideHeader
          labels={{
            ...actionLabels,
            title: t("platform.driftHub.auditLogs.title"),
            subtitle: t("platform.driftHub.auditLogs.subtitle"),
            empty: t("platform.driftHub.auditLogs.empty"),
            loadError: t("platform.driftHub.auditLogs.loadError"),
          }}
        />
      </div>
    </PlatformDriftHubShell>
  );
}
