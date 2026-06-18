import { SupportRequestsCenterPanel } from "@/components/app/app-portal/SupportRequestsCenterPanel";
import { buildSupportRequestsLabels } from "@/lib/app-portal/support-requests";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SupportRequestsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <SupportRequestsCenterPanel labels={buildSupportRequestsLabels(t)} />
    </div>
  );
}
