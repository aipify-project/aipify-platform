import { AssistantWelcomePanel } from "@/components/app/assistant-identity";
import { FOCUS_AREAS, COMMUNICATION_STYLES, UNCERTAINTY_HANDLING, ADDRESS_NAME_MODES } from "@/lib/aipify/assistant-identity";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AssistantWelcomePage() {
  const dict = await getCustomerAppDictionaryForSplits(await getLocale(), ["core"]);
  const t = createTranslator(dict);

  const mapKeys = (keys: readonly string[], prefix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`customerApp.assistantIdentity.${prefix}.${k}`)]));

  return (
    <AssistantWelcomePanel
      labels={{
        title: t("customerApp.assistantIdentity.welcome.title"),
        subtitle: t("customerApp.assistantIdentity.welcome.subtitle"),
        loading: t("customerApp.assistantIdentity.loading"),
        step1Question: t("customerApp.assistantIdentity.welcome.step1"),
        step2Question: t("customerApp.assistantIdentity.welcome.step2"),
        step3Question: t("customerApp.assistantIdentity.welcome.step3"),
        step4Question: t("customerApp.assistantIdentity.welcome.step4"),
        step5Question: t("customerApp.assistantIdentity.welcome.step5"),
        namePlaceholder: t("customerApp.assistantIdentity.welcome.namePlaceholder"),
        continue: t("customerApp.assistantIdentity.welcome.continue"),
        finish: t("customerApp.assistantIdentity.welcome.finish"),
        getStarted: t("customerApp.assistantIdentity.welcome.getStarted"),
        alreadyComplete: t("customerApp.assistantIdentity.welcome.alreadyComplete"),
        goHome: t("customerApp.assistantIdentity.welcome.goHome"),
        privacy: t("customerApp.assistantIdentity.privacy"),
      }}
      focusOptions={mapKeys(FOCUS_AREAS, "focusAreas")}
      styleOptions={mapKeys(COMMUNICATION_STYLES, "communicationStyles")}
      uncertaintyOptions={mapKeys(UNCERTAINTY_HANDLING, "uncertaintyHandling")}
      addressModeOptions={mapKeys(ADDRESS_NAME_MODES, "addressModes")}
    />
  );
}
