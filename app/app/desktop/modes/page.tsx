import { DesktopModesPanel } from "@/components/app/desktop";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DesktopModesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <DesktopModesPanel
      labels={{
        title: t("customerApp.desktop.modesTitle"),
        subtitle: t("customerApp.desktop.modesSubtitle"),
        loading: t("customerApp.desktop.loading"),
        back: t("customerApp.desktop.back"),
        minSeverity: t("customerApp.desktop.modesLabels.minSeverity"),
        miniChat: t("customerApp.desktop.modesLabels.miniChat"),
        dailyBrief: t("customerApp.desktop.modesLabels.dailyBrief"),
        focusCategories: t("customerApp.desktop.modesLabels.focusCategories"),
      }}
    />
  );
}
