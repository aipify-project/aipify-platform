import { SuccessCenterPanel } from "@/components/app/app-portal/SuccessCenterPanel";
import { buildSuccessCenterLabels } from "@/lib/app-portal/success-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuccessCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <SuccessCenterPanel labels={buildSuccessCenterLabels(t)} />
    </div>
  );
}
