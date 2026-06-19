import { EmployeeDashboardPanel } from "@/components/app/employee-management";
import { buildEmployeeManagementLabels } from "@/lib/employee-management/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EmployeeMePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildEmployeeManagementLabels(t);

  return <EmployeeDashboardPanel labels={labels} />;
}
