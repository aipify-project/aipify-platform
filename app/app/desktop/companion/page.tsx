import { DesktopChatPanel } from "@/components/app/desktop";
import { DesktopCompanionFoundationShell } from "@/components/app/desktop";
import { buildCompanionExperienceLabels } from "@/lib/app/companion/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { getDesktopCompanionPageLabels } from "@/lib/desktop-companion-foundation/page-labels";

export default async function DesktopCompanionChatPage() {
  const locale = await getLocale();
  const shellLabels = await getDesktopCompanionPageLabels();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["companion"]);
  const companionLabels = buildCompanionExperienceLabels(createTranslator(dict));

  return (
    <DesktopCompanionFoundationShell labels={shellLabels}>
      <DesktopChatPanel labels={companionLabels} locale={locale} />
    </DesktopCompanionFoundationShell>
  );
}
