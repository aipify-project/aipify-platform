import { ExecutiveCommandCenterPanel } from "@/components/app/executive-command-center";
import { PilotCommandBriefStrip } from "@/components/app/unonight-pilot";
import { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";
import type { Ecc590Section } from "@/lib/executive-command-center-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function ExecutiveCommandCenterSectionPage({ activeSection }: { activeSection: Ecc590Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "executiveCommandCenter");
  const t = createTranslator(dict);
  const tp = createTranslator(dict);
  const pilotNs = "customerApp.unonightPilot621";

  return (
    <div className="space-y-6">
      {activeSection === "overview" ? (
        <div className="px-4 sm:px-6">
          <PilotCommandBriefStrip
            labels={{
              title: tp(`${pilotNs}.title`),
              readOnlyActive: tp(`${pilotNs}.readOnlyActive`),
              shadowModeActive: tp(`${pilotNs}.shadowModeActive`),
              dataSourceFreshness: tp(`${pilotNs}.dataSourceFreshness`),
              shadowRecommendationPrepared: tp(`${pilotNs}.shadowRecommendationPrepared`),
              sourceFailure: tp(`${pilotNs}.sourceFailure`),
              freshnessFresh: tp(`${pilotNs}.freshnessFresh`),
              freshnessStale: tp(`${pilotNs}.freshnessStale`),
              freshnessOutdated: tp(`${pilotNs}.freshnessOutdated`),
              freshnessUnknown: tp(`${pilotNs}.freshnessUnknown`),
              principle: tp(`${pilotNs}.principle`),
            }}
          />
        </div>
      ) : null}
      <ExecutiveCommandCenterPanel labels={buildExecutiveCommandCenterLabels(t)} activeSection={activeSection} />
    </div>
  );
}
