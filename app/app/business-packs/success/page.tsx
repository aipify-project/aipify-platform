import { BusinessPackSuccessPanel } from "@/components/app/app-portal/BusinessPackSuccessPanel";
import { buildBusinessPackSuccessLabels } from "@/lib/app-portal/business-pack-success";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackSuccessPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <BusinessPackSuccessPanel labels={buildBusinessPackSuccessLabels(t)} />
    </div>
  );
}
