import { OrganizationalHealthIntelligenceCenterPanel } from "@/components/app/organizational-health-intelligence-center";
import { buildOrganizationalHealthIntelligenceCenterLabels } from "@/lib/organizational-health-intelligence-center/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalHealthIntelligenceCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "organizationalHealthIntelligenceCenter");
  const t = createTranslator(dict);
  const labels = buildOrganizationalHealthIntelligenceCenterLabels(t);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <OrganizationalHealthIntelligenceCenterPanel labels={labels} />
    </div>
  );
}
