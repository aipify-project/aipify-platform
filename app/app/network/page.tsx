import { GlobalBusinessNetworkCenterPanel } from "@/components/app/global-business-network-center";
import { buildGlobalBusinessNetworkCenterLabels } from "@/lib/global-business-network-center/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GlobalBusinessNetworkPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "globalBusinessNetworkCenter");
  const t = createTranslator(dict);
  const labels = buildGlobalBusinessNetworkCenterLabels(t);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <GlobalBusinessNetworkCenterPanel labels={labels} />
    </div>
  );
}
