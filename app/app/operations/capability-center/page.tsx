import { CapabilityCenterPanel } from "@/components/app/app-portal/CapabilityCenterPanel";
import { buildCapabilityCenterLabels } from "@/lib/app-portal/capability-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CapabilityCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <CapabilityCenterPanel labels={buildCapabilityCenterLabels(t)} />
    </div>
  );
}
