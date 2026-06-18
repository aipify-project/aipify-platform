import { OrganizationalMaturityCenterPanel } from "@/components/app/organizational-maturity-center";
import { buildOrganizationalMaturityCenterLabels } from "@/lib/organizational-maturity-center/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalMaturityCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "organizationalMaturityCenter");
  const t = createTranslator(dict);
  const labels = buildOrganizationalMaturityCenterLabels(t);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <OrganizationalMaturityCenterPanel labels={labels} />
    </div>
  );
}
