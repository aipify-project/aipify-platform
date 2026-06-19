import { IntegrationHubPanel } from "@/components/app/integration-hub-operations";
import { buildIntegrationHubLabels } from "@/lib/integration-hub-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IntegrationsApiPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildIntegrationHubLabels(t);
  return (
    <IntegrationHubPanel
      labels={labels}
      initialTab="api_keys"
      titleOverride={labels.apiTitle}
      subtitleOverride={labels.apiSubtitle}
      visibleTabs={["api_keys", "webhooks", "reports"]}
    />
  );
}
