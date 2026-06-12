import type { createTranslator } from "@/lib/i18n/translate";

type Translator = ReturnType<typeof createTranslator>;

export type CompanionBriefingLabels = {
  companionBriefing: string;
  loading: string;
  viewDetails: string;
  aipifyNoticed: string;
  companionNote: string;
  privacy: string;
};

export function buildCompanionBriefingLabels(t: Translator): CompanionBriefingLabels {
  const p = "customerApp.companionBriefing";
  return {
    companionBriefing: t(`${p}.companionBriefing`),
    loading: t(`${p}.loading`),
    viewDetails: t(`${p}.viewDetails`),
    aipifyNoticed: t(`${p}.aipifyNoticed`),
    companionNote: t(`${p}.companionNote`),
    privacy: t(`${p}.privacy`),
  };
}
