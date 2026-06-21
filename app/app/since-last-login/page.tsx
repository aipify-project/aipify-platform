import { ActivityOperationsPanel } from "@/components/app/activity-operations";
import { buildSinceLastLoginUxLabels } from "@/lib/command-center/since-last-login-labels";
import { buildActivityOperationsLabels } from "@/lib/activity-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SinceLastLoginPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings", "commandCenter"]);
  const t = createTranslator(dict);
  const labels = buildActivityOperationsLabels(t);
  const sinceLastLoginUxLabels = buildSinceLastLoginUxLabels(t);
  return (
    <ActivityOperationsPanel
      labels={labels}
      sinceLastLoginUxLabels={sinceLastLoginUxLabels}
      initialTab="since_last_login"
      titleOverride={labels.sinceLastLoginTitle}
      subtitleOverride={labels.sinceLastLoginSubtitle}
      visibleTabs={["since_last_login", "overview", "organization", "approvals", "companion_insights"]}
    />
  );
}
