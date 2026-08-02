import { SoftwareCatalogPanel } from "@/components/app/app-portal/SoftwareCatalogPanel";
import { buildSoftwareCatalogLabels } from "@/lib/app-portal/software-catalog";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export const dynamic = "force-dynamic";

export default async function SoftwareCatalogPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  return <SoftwareCatalogPanel labels={buildSoftwareCatalogLabels(t)} />;
}
