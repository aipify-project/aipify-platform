import { DomainLicenseCenterPanel } from "@/components/app/domain-license";
import { buildDomainLicenseLabels } from "@/lib/domain-license/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DomainsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildDomainLicenseLabels(t);

  return <DomainLicenseCenterPanel labels={labels} />;
}
