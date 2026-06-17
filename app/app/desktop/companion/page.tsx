import { DesktopChatPanel } from "@/components/app/desktop";
import { DesktopCompanionFoundationShell } from "@/components/app/desktop";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { getDesktopCompanionPageLabels } from "@/lib/desktop-companion-foundation/page-labels";

export default async function DesktopCompanionChatPage() {
  const labels = await getDesktopCompanionPageLabels();
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <DesktopCompanionFoundationShell labels={labels}>
      <DesktopChatPanel
        labels={{
          title: t("customerApp.desktop.chat.title"),
          hint: t("customerApp.desktop.chat.hint"),
          empty: t("customerApp.desktop.chat.empty"),
          placeholder: t("customerApp.desktop.chat.placeholder"),
          send: t("customerApp.desktop.chat.send"),
          openLink: t("customerApp.desktop.chat.openLink"),
          disabled: t("customerApp.desktop.chat.disabled"),
        }}
      />
    </DesktopCompanionFoundationShell>
  );
}
