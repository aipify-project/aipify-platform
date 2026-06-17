import { CompanionMemoryContextPanel } from "@/components/app/desktop/CompanionMemoryContextPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildCompanionMemoryContextLabels } from "@/lib/companion-memory-context/labels";

export default async function DesktopMemoryPage() {
  const dict = await getDictionary(await getLocale(), ["companionMemoryContext"]);
  const t = createTranslator(dict);
  return <CompanionMemoryContextPanel labels={buildCompanionMemoryContextLabels(t)} />;
}
