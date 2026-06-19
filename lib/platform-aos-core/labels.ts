import type { Translator } from "@/lib/i18n/translate";
import type { PlatformAosCoreLabels, PlatformAosCoreTab } from "./types";
import { ENGINE_STATUSES } from "./constants";

const TAB_KEYS: PlatformAosCoreTab[] = [
  "overview",
  "orchestration",
  "engine_registry",
  "dependencies",
  "platform_health",
  "feature_flags",
  "execution_control",
  "governance",
  "reports",
  "executive",
];

export function buildPlatformAosCoreLabels(t: Translator): PlatformAosCoreLabels {
  const p = "platform.aosCore";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      TAB_KEYS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as PlatformAosCoreLabels["tabs"],
    overview: {
      registeredEngines: t(`${p}.overview.registeredEngines`),
      healthyEngines: t(`${p}.overview.healthyEngines`),
      dependencies: t(`${p}.overview.dependencies`),
      orchestrationFlows: t(`${p}.overview.orchestrationFlows`),
      featureFlags: t(`${p}.overview.featureFlags`),
      policies: t(`${p}.overview.policies`),
      platformHealthScore: t(`${p}.overview.platformHealthScore`),
    },
    actions: {
      refreshHealth: t(`${p}.actions.refreshHealth`),
      enableFeature: t(`${p}.actions.enableFeature`),
      disableFeature: t(`${p}.actions.disableFeature`),
      runSimulation: t(`${p}.actions.runSimulation`),
      openEngines: t(`${p}.actions.openEngines`),
      openFeatures: t(`${p}.actions.openFeatures`),
    },
    engineStatuses: Object.fromEntries(
      ENGINE_STATUSES.map((key) => [key, t(`${p}.engineStatuses.${key}`)])
    ) as PlatformAosCoreLabels["engineStatuses"],
    enginesPage: {
      title: t(`${p}.enginesPage.title`),
      subtitle: t(`${p}.enginesPage.subtitle`),
    },
    featuresPage: {
      title: t(`${p}.featuresPage.title`),
      subtitle: t(`${p}.featuresPage.subtitle`),
    },
  };
}
