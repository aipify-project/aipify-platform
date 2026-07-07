import { DomainLicenseCenterPanel } from "@/components/app/domain-license";
import { buildDomainCenterLoadLabels } from "@/lib/app/license-labels";
import { buildDomainLicenseLabels } from "@/lib/domain-license/labels";
import { getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DomainsPage() {
  const locale = await getLocale();
  const dict = {
    ...(await getCustomerAppDictionaryForSplits(locale, ["settings"])),
    ...(await getDictionary(locale, ["shell"])),
  };
  const t = createTranslator(dict);
  const labels = buildDomainLicenseLabels(t);
  const loadLabels = buildDomainCenterLoadLabels(t);

  return <DomainLicenseCenterPanel labels={labels} loadLabels={loadLabels} />;
}
