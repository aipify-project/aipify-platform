import { TrustCulturePanel } from "@/components/app/app-portal/TrustCulturePanel";
import { buildTrustCultureLabels } from "@/lib/app-portal/trust-culture";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TrustCulturePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <TrustCulturePanel labels={buildTrustCultureLabels(t)} />
    </div>
  );
}
