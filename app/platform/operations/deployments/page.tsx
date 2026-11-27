import { PlatformUpdatesPanel } from "@/components/platform/update-engine";
import { PlatformDriftHubShell } from "@/components/platform/drift/PlatformDriftHubShell";
import { DRIFT_PUBLISH_VERIFY_HUB_ID } from "@/lib/platform/drift-hub";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import Link from "next/link";

export default async function PlatformDeploymentsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <PlatformDriftHubShell hub={DRIFT_PUBLISH_VERIFY_HUB_ID}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--aipify-text)]">
            {t("platform.driftHub.deployments.title")}
          </h1>
          <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">
            {t("platform.driftHub.deployments.subtitle")}
          </p>
          <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">
            {t("platform.driftHub.deployments.scopeNote")}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link
              href="/platform/operations/platform-health"
              className="font-medium text-violet-700 hover:text-violet-800 dark:text-violet-300"
            >
              {t("platform.driftHub.deployments.openHealth")}
            </Link>
            <Link
              href="/platform/website-verification"
              className="font-medium text-violet-700 hover:text-violet-800 dark:text-violet-300"
            >
              {t("platform.driftHub.deployments.openVerification")}
            </Link>
          </div>
        </div>

        <PlatformUpdatesPanel
          locale={locale}
          embedded
          labels={{
            title: t("platform.driftHub.deployments.title"),
            subtitle: t("platform.driftHub.deployments.subtitle"),
            loading: t("platform.updates.loading"),
            empty: t("platform.driftHub.deployments.empty"),
            version: t("platform.updates.version"),
            status: t("platform.updates.status"),
            type: t("platform.updates.type"),
            channel: t("platform.updates.channel"),
            scheduled: t("platform.updates.scheduled"),
            affected: t("platform.updates.affected"),
            view: t("platform.updates.view"),
            areas: {
              scheduled: t("platform.updates.areas.scheduled"),
              history: t("platform.updates.areas.history"),
              rollout: t("platform.updates.areas.rollout"),
              failed: t("platform.updates.areas.failed"),
              rollback: t("platform.updates.areas.rollback"),
            },
            pulseLabel: t("branding.pulseLabel"),
            sourceUnavailableTitle: t("platform.driftHub.deployments.rpcMissingTitle"),
            sourceUnavailableBody: t("platform.driftHub.deployments.rpcMissingBody"),
            loadError: t("platform.driftHub.deployments.loadError"),
            retry: t("platform.driftHub.deployments.retry"),
          }}
        />
      </div>
    </PlatformDriftHubShell>
  );
}
