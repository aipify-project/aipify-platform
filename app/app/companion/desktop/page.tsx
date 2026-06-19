import { CompanionPresenceOperationsPanel } from "@/components/app/companion-presence-operations";
import { buildCompanionPresenceOperationsLabels } from "@/lib/companion-presence-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionDesktopPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const labels = buildCompanionPresenceOperationsLabels(createTranslator(dict));
  return (
    <CompanionPresenceOperationsPanel
      labels={labels}
      initialTab="desktop_companion"
      titleOverride={labels.desktopTitle}
      subtitleOverride={labels.desktopSubtitle}
      visibleTabs={["overview", "desktop_companion", "presence", "preferences", "devices"]}
    />
  );
}
