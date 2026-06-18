import { AipifyCompanionBriefingBanner } from "@/components/app/briefing";
import { ModernInstallAssistantPanel } from "@/components/app/install-engine";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import type { InstallPlatformOption } from "@/lib/install/experience";
import { MODERN_INSTALL_FLOW } from "@/lib/install/experience";
import { getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppInstallPage() {
  const locale = await getLocale();
  const dict = {
    ...(await getCustomerAppDictionaryForSplits(locale, ["dashboard"])),
    ...(await getDictionary(locale, ["install", "branding"])),
  };
  const t = createTranslator(dict);

  const flowLabels = Object.fromEntries(
    MODERN_INSTALL_FLOW.map((step) => [step.id, t(step.labelKey)])
  );

  const platformKeys: InstallPlatformOption[] = [
    "shopify",
    "wordpress",
    "woocommerce",
    "custom_website",
    "developer_setup",
    "not_sure",
  ];

  const platforms = Object.fromEntries(
    platformKeys.map((key) => [key, t(`install.modern.platforms.${key}`)])
  ) as Record<InstallPlatformOption, string>;

  return (
    <div className="space-y-4">
      <div className="px-6 pt-6">
        <AipifyCompanionBriefingBanner context="install" labels={buildCompanionBriefingLabels(t)} />
      </div>
      <ModernInstallAssistantPanel
      labels={{
        title: t("install.modern.title"),
        subtitle: t("install.modern.subtitle"),
        principle: t("install.modern.principle"),
        loading: t("install.loading"),
        empty: t("install.modern.empty"),
        pulseLabel: t("branding.pulseLabel"),
        assistantPrompt: t("install.modern.assistantPrompt"),
        platforms,
        flow: flowLabels,
        heartbeat: {
          connected: t("install.modern.heartbeat.connected"),
          warning: t("install.modern.heartbeat.warning"),
          disconnected: t("install.modern.heartbeat.disconnected"),
          updating: t("install.modern.heartbeat.updating"),
          suspended: t("install.modern.heartbeat.suspended"),
        },
        planLimits: t("install.modern.planLimits"),
        beginConnect: t("install.modern.beginConnect"),
        viewGuide: t("install.modern.viewGuide"),
        escalate: t("install.modern.escalate"),
        escalateTitle: t("install.modern.escalateTitle"),
        escalateHint: t("install.modern.escalateHint"),
        escalateSubmit: t("install.modern.escalateSubmit"),
        escalateSuccess: t("install.modern.escalateSuccess"),
        escalateError: t("install.modern.escalateError"),
        developerLink: t("install.modern.developerLink"),
        detecting: t("install.modern.detecting"),
        detectionUncertain: t("install.modern.detectionUncertain"),
        working: t("install.modern.working"),
        error: t("install.error"),
        licensePaused: t("install.modern.licensePaused"),
        licenseGrace: t("install.modern.licenseGrace"),
      }}
    />
    </div>
  );
}
