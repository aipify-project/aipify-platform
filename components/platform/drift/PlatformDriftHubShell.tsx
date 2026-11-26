import { Suspense, type ReactNode } from "react";
import { PlatformDriftHubTabs } from "@/components/platform/drift/PlatformDriftHubTabs";
import type { DriftHubId } from "@/lib/platform/drift-hub";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PlatformDriftHubShellProps = {
  hub: DriftHubId;
  children: ReactNode;
};

function buildTabLabels(t: (key: string) => string) {
  return {
    overview: t("platform.driftHub.tabs.overview"),
    platformHealth: t("platform.driftHub.tabs.platformHealth"),
    installations: t("platform.driftHub.tabs.installations"),
    auditLogs: t("platform.driftHub.tabs.auditLogs"),
    pilot: t("platform.driftHub.tabs.pilot"),
    deployments: t("platform.driftHub.tabs.deployments"),
    websiteVerification: t("platform.driftHub.tabs.websiteVerification"),
    verificationHistory: t("platform.driftHub.tabs.verificationHistory"),
    kompis: t("platform.driftHub.tabs.kompis"),
  };
}

export async function PlatformDriftHubShell({ hub, children }: PlatformDriftHubShellProps) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildTabLabels(t);
  const ariaLabel = t("platform.driftHub.tabsAria");

  return (
    <div className="space-y-4">
      <Suspense fallback={null}>
        <PlatformDriftHubTabs hub={hub} labels={labels} ariaLabel={ariaLabel} />
      </Suspense>
      {children}
    </div>
  );
}
