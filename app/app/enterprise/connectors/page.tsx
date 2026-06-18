import { EnterpriseConnectorsPanel } from "@/components/app/enterprise";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EnterpriseConnectorsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "enterpriseDeployment");
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseDeployment";

  return (
    <EnterpriseConnectorsPanel
      labels={{
        title: t(`${p}.connectorsTitle`),
        subtitle: t(`${p}.connectorsSubtitle`),
        loading: t(`${p}.loading`),
        back: t(`${p}.back`),
        requiresAgent: t(`${p}.requiresAgent`),
        cloudOk: t(`${p}.cloudOk`),
      }}
    />
  );
}
