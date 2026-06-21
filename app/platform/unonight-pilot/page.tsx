import { UnonightPilotHealthPanel } from "@/components/platform/unonight-pilot";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformUnonightPilotPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const ns = "platform.unonightPilot621";

  return (
    <UnonightPilotHealthPanel
      labels={{
        title: t(`${ns}.title`),
        subtitle: t(`${ns}.subtitle`),
        loading: t(`${ns}.loading`),
        healthState: t(`${ns}.healthState`),
        killSwitch: t(`${ns}.killSwitch`),
        killSwitchOn: t(`${ns}.killSwitchOn`),
        killSwitchOff: t(`${ns}.killSwitchOff`),
        readOnly: t(`${ns}.readOnly`),
        shadowMode: t(`${ns}.shadowMode`),
        dataSources: t(`${ns}.dataSources`),
        syncRuns: t(`${ns}.syncRuns`),
        discoveryReports: t(`${ns}.discoveryReports`),
        auditLogs: t(`${ns}.auditLogs`),
        shadowPrepared: t(`${ns}.shadowPrepared`),
        privacyNote: t(`${ns}.privacyNote`),
        enableDiscovery: t(`${ns}.enableDiscovery`),
        enableReadOnly: t(`${ns}.enableReadOnly`),
        enableShadowMode: t(`${ns}.enableShadowMode`),
        pause: t(`${ns}.pause`),
        disable: t(`${ns}.disable`),
        activateKillSwitch: t(`${ns}.activateKillSwitch`),
        deactivateKillSwitch: t(`${ns}.deactivateKillSwitch`),
        runDiscovery: t(`${ns}.runDiscovery`),
        runSync: t(`${ns}.runSync`),
        approveSource: t(`${ns}.approveSource`),
        externalConnectionNote: t(`${ns}.externalConnectionNote`),
        healthStates: {
          disabled: t(`${ns}.healthStates.disabled`),
          discovery: t(`${ns}.healthStates.discovery`),
          syncing: t(`${ns}.healthStates.syncing`),
          read_only_active: t(`${ns}.healthStates.read_only_active`),
          shadow_mode_active: t(`${ns}.healthStates.shadow_mode_active`),
          degraded: t(`${ns}.healthStates.degraded`),
          paused: t(`${ns}.healthStates.paused`),
          failed: t(`${ns}.healthStates.failed`),
        },
      }}
    />
  );
}
