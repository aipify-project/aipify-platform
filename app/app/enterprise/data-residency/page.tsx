import { EnterpriseDataResidencyPanel } from "@/components/app/enterprise";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EnterpriseDataResidencyPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "enterpriseDeployment");
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseDeployment";

  return (
    <EnterpriseDataResidencyPanel
      labels={{
        title: t(`${p}.residencyTitle`),
        subtitle: t(`${p}.residencySubtitle`),
        loading: t(`${p}.loading`),
        back: t(`${p}.back`),
        storage: t(`${p}.storage`),
        cloudSyncAllowed: t(`${p}.cloudSyncAllowed`),
        redactionRequired: t(`${p}.redactionRequired`),
      }}
    />
  );
}
