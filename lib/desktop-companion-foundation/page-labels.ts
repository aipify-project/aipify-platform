import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildDesktopCompanionLabels } from "@/lib/desktop-companion-foundation/labels";

export async function getDesktopCompanionPageLabels() {
  const dict = await getDictionary(await getLocale(), ["desktopCompanion"]);
  const t = createTranslator(dict);
  return buildDesktopCompanionLabels(t);
}
