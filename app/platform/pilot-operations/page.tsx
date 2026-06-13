import { CustomerZeroCenterPanel } from "@/components/platform/customer-zero";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformPilotOperationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const ns = "platform.customerZero";

  return (
    <CustomerZeroCenterPanel
      labels={{
        title: t(`${ns}.title`),
        subtitle: t(`${ns}.subtitle`),
        loading: t(`${ns}.loading`),
        corePrinciple: t(`${ns}.corePrinciple`),
        customerZeroPrinciple: t(`${ns}.customerZeroPrinciple`),
        readinessTitle: t(`${ns}.readinessTitle`),
        sourcesTitle: t(`${ns}.sourcesTitle`),
        discoverSources: t(`${ns}.discoverSources`),
        discovering: t(`${ns}.discovering`),
        pilotLevelTitle: t(`${ns}.pilotLevelTitle`),
        recommendationsTitle: t(`${ns}.recommendationsTitle`),
        noRecommendations: t(`${ns}.noRecommendations`),
        approve: t(`${ns}.approve`),
        reject: t(`${ns}.reject`),
        valueTitle: t(`${ns}.valueTitle`),
        expansionTitle: t(`${ns}.expansionTitle`),
        auditTitle: t(`${ns}.auditTitle`),
        noAudit: t(`${ns}.noAudit`),
        gateStatus: t(`${ns}.gateStatus`),
        privacyNote: t(`${ns}.privacyNote`),
        pilotLevels: {
          "1": t(`${ns}.pilotLevels.observe`),
          "2": t(`${ns}.pilotLevels.recommend`),
          "3": t(`${ns}.pilotLevels.assist`),
          "4": t(`${ns}.pilotLevels.execute`),
        },
        readinessStates: {
          learning: t(`${ns}.readinessStates.learning`),
          partially_ready: t(`${ns}.readinessStates.partiallyReady`),
          ready_to_assist: t(`${ns}.readinessStates.readyToAssist`),
          ready_to_execute: t(`${ns}.readinessStates.readyToExecute`),
        },
      }}
    />
  );
}
