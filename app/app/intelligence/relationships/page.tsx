import { OrganizationalRelationshipIntelligencePanel } from "@/components/app/organizational-relationship-intelligence";
import { buildOrganizationalRelationshipIntelligenceLabels } from "@/lib/organizational-relationship-intelligence/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalRelationshipIntelligencePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "organizationalRelationshipIntelligence");
  const t = createTranslator(dict);
  const labels = buildOrganizationalRelationshipIntelligenceLabels(t);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <OrganizationalRelationshipIntelligencePanel labels={labels} />
    </div>
  );
}
