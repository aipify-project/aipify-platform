import { PlatformDriftHubShell } from "@/components/platform/drift/PlatformDriftHubShell";
import { PlatformDriftHonestEmpty } from "@/components/platform/drift/PlatformDriftHonestEmpty";
import { DRIFT_PUBLISH_VERIFY_HUB_ID } from "@/lib/platform/drift-hub";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformDeploymentsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformDriftHubShell hub={DRIFT_PUBLISH_VERIFY_HUB_ID}>
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--aipify-text)]">
            {t("platform.driftHub.deployments.title")}
          </h1>
          <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">
            {t("platform.driftHub.deployments.subtitle")}
          </p>
        </div>
        <PlatformDriftHonestEmpty
          title={t("platform.driftHub.deployments.notConfiguredTitle")}
          body={t("platform.driftHub.deployments.notConfiguredBody")}
          actions={[
            {
              href: "/platform/operations/platform-health",
              label: t("platform.driftHub.deployments.openHealth"),
            },
            {
              href: "/platform/website-verification",
              label: t("platform.driftHub.deployments.openVerification"),
            },
          ]}
        />
      </div>
    </PlatformDriftHubShell>
  );
}
