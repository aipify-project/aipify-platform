import { TrustAdoptionPanel } from "@/components/app/companion";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TrustAdoptionPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const ns = "customerApp.trustAdoption";

  return (
    <TrustAdoptionPanel
      labels={{
        title: t(`${ns}.title`),
        subtitle: t(`${ns}.subtitle`),
        loading: t(`${ns}.loading`),
        corePrinciple: t(`${ns}.corePrinciple`),
        philosophyTitle: t(`${ns}.philosophyTitle`),
        adoptionStage: t(`${ns}.adoptionStage`),
        adoptionState: t(`${ns}.adoptionState`),
        reliabilityScore: t(`${ns}.reliabilityScore`),
        reliabilityLevel: t(`${ns}.reliabilityLevel`),
        trustTrend: t(`${ns}.trustTrend`),
        valueMomentsTitle: t(`${ns}.valueMomentsTitle`),
        signalsTitle: t(`${ns}.signalsTitle`),
        recommendationsTitle: t(`${ns}.recommendationsTitle`),
        widgetsTitle: t(`${ns}.widgetsTitle`),
        auditTitle: t(`${ns}.auditTitle`),
        noAudit: t(`${ns}.noAudit`),
        companionLink: t(`${ns}.companionLink`),
        firstDayLink: t(`${ns}.firstDayLink`),
        privacyNote: t(`${ns}.privacyNote`),
        stages: {
          curiosity: t(`${ns}.stages.curiosity`),
          confidence: t(`${ns}.stages.confidence`),
          dependence: t(`${ns}.stages.dependence`),
          companionship: t(`${ns}.stages.companionship`),
        },
        states: {
          exploring: t(`${ns}.states.exploring`),
          learning: t(`${ns}.states.learning`),
          integrating: t(`${ns}.states.integrating`),
          relying: t(`${ns}.states.relying`),
          advocating: t(`${ns}.states.advocating`),
        },
        reliabilityLevels: {
          building_trust: t(`${ns}.reliabilityLevels.buildingTrust`),
          reliable: t(`${ns}.reliabilityLevels.reliable`),
          highly_reliable: t(`${ns}.reliabilityLevels.highlyReliable`),
          essential_companion: t(`${ns}.reliabilityLevels.essentialCompanion`),
        },
      }}
    />
  );
}
