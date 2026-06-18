import { AssistantIdentitySettingsPanel } from "@/components/app/assistant-identity";
import { COMMUNICATION_STYLES, UNCERTAINTY_HANDLING } from "@/lib/aipify/assistant-identity";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AssistantIdentitySettingsPage() {
  const dict = await getCustomerAppDictionaryForSplits(await getLocale(), ["core"]);
  const t = createTranslator(dict);

  const mapKeys = (keys: readonly string[], prefix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`customerApp.assistantIdentity.${prefix}.${k}`)]));

  return (
    <AssistantIdentitySettingsPanel
      labels={{
        title: t("customerApp.assistantIdentity.settings.title"),
        subtitle: t("customerApp.assistantIdentity.settings.subtitle"),
        loading: t("customerApp.assistantIdentity.loading"),
        back: t("customerApp.assistantIdentity.settings.back"),
        ownerName: t("customerApp.assistantIdentity.settings.ownerName"),
        greetingName: t("customerApp.assistantIdentity.settings.greetingName"),
        communicationStyle: t("customerApp.assistantIdentity.settings.communicationStyle"),
        uncertainty: t("customerApp.assistantIdentity.settings.uncertainty"),
        useNameInGreetings: t("customerApp.assistantIdentity.settings.useNameInGreetings"),
        allowPersonalized: t("customerApp.assistantIdentity.settings.allowPersonalized"),
        redoWelcome: t("customerApp.assistantIdentity.settings.redoWelcome"),
        resetWelcome: t("customerApp.assistantIdentity.settings.resetWelcome"),
        resetConfirm: t("customerApp.assistantIdentity.settings.resetConfirm"),
        privacy: t("customerApp.assistantIdentity.privacy"),
      }}
      styleOptions={mapKeys(COMMUNICATION_STYLES, "communicationStyles")}
      uncertaintyOptions={mapKeys(UNCERTAINTY_HANDLING, "uncertaintyHandling")}
    />
  );
}
