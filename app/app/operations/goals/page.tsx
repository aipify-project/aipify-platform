import { OrganizationalGoalsPanel } from "@/components/app/app-portal/OrganizationalGoalsPanel";
import { buildOrganizationalGoalsLabels } from "@/lib/app-portal/organizational-goals";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalGoalsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <OrganizationalGoalsPanel labels={buildOrganizationalGoalsLabels(t)} />
    </div>
  );
}
