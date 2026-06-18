import { OffboardingPanel } from "@/components/app/employee-lifecycle";
import { buildEmployeeLifecycleLabels } from "@/lib/employee-lifecycle/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EmployeeOffboardingPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildEmployeeLifecycleLabels(t);

  return <OffboardingPanel labels={labels} />;
}
