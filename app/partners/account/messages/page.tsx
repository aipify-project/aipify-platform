import { PartnersMessagesCenterPanel } from "@/components/partners-portal/PartnersMessagesCenterPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPartnersPortalMessagesLabels } from "@/lib/partners-portal/shell-labels";

export default async function PartnersMessagesPage() {
  const dict = await getDictionary(await getLocale(), ["partnersPortal"]);
  const t = createTranslator(dict);

  return <PartnersMessagesCenterPanel labels={buildPartnersPortalMessagesLabels(t)} />;
}
