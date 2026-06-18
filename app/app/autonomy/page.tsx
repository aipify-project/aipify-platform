import { AutonomousOrganizationCenterPanel } from "@/components/app/autonomous-organization-center";
import { buildAutonomousOrganizationCenterLabels } from "@/lib/autonomous-organization-center/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AutonomousOrganizationPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "autonomousOrganizationCenter");
  const t = createTranslator(dict);
  const labels = buildAutonomousOrganizationCenterLabels(t);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <AutonomousOrganizationCenterPanel labels={labels} />
    </div>
  );
}
