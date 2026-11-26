import { PlatformDriftHubShell } from "@/components/platform/drift/PlatformDriftHubShell";
import { PlatformDriftHonestEmpty } from "@/components/platform/drift/PlatformDriftHonestEmpty";
import { DRIFT_OPERATIONS_HUB_ID } from "@/lib/platform/drift-hub";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformOperationsAuditLogsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformDriftHubShell hub={DRIFT_OPERATIONS_HUB_ID}>
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--aipify-text)]">
            {t("platform.driftHub.auditLogs.title")}
          </h1>
          <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">
            {t("platform.driftHub.auditLogs.subtitle")}
          </p>
        </div>
        <PlatformDriftHonestEmpty
          title={t("platform.driftHub.auditLogs.notConfiguredTitle")}
          body={t("platform.driftHub.auditLogs.notConfiguredBody")}
          actions={[
            {
              href: "/platform/governance/activity-logs",
              label: t("platform.driftHub.auditLogs.openGovernance"),
            },
          ]}
        />
      </div>
    </PlatformDriftHubShell>
  );
}
