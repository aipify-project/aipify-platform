import { SecurityIncidentsPanel } from "@/components/app/security-compliance";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SecurityIncidentsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "securityCompliance");
  const t = createTranslator(dict);
  const p = "customerApp.securityCompliance";

  return (
    <SecurityIncidentsPanel
      labels={{
        title: t(`${p}.incidentsTitle`),
        subtitle: t(`${p}.incidentsSubtitle`),
        loading: t(`${p}.loading`),
        back: t(`${p}.back`),
        noIncidents: t(`${p}.noIncidents`),
        resolve: t(`${p}.resolve`),
      }}
    />
  );
}
