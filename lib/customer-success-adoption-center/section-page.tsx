import { CustomerSuccessAdoptionCenterPanel } from "@/components/app/customer-success-adoption-center";
import { buildCustomerSuccessAdoptionCenterLabels } from "@/lib/customer-success-adoption-center/labels";
import type { CustomerSuccessSection } from "@/lib/customer-success-adoption-center";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function CustomerSuccessSectionPage({
  activeSection,
}: {
  activeSection: CustomerSuccessSection;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "customerSuccessAdoptionCenter");
  const t = createTranslator(dict);
  const labels = buildCustomerSuccessAdoptionCenterLabels(t);

  return <CustomerSuccessAdoptionCenterPanel labels={labels} activeSection={activeSection} />;
}
