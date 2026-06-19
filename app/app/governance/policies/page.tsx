import { GovernanceManagementPanel } from "@/components/app/governance-management";
import { buildGovernanceManagementLabels } from "@/lib/governance-management/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GovernancePoliciesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildGovernanceManagementLabels(t);
  return <GovernanceManagementPanel labels={labels} initialTab="policies" titleOverride={labels.policiesTitle} />;
}
