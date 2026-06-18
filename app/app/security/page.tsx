import { SecurityComplianceDashboardPanel } from "@/components/app/security-compliance";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SecurityPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "securityCompliance");
  const t = createTranslator(dict);
  const p = "customerApp.securityCompliance";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <SecurityComplianceDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          emergencyStopActive: t(`${p}.emergencyStopActive`),
          openIncidents: t(`${p}.openIncidents`),
          criticalIncidents: t(`${p}.criticalIncidents`),
          secretsExpiring: t(`${p}.secretsExpiring`),
          incidents: t(`${p}.incidents`),
          secrets: t(`${p}.secrets`),
          policies: t(`${p}.policies`),
          compliance: t(`${p}.compliance`),
          dataGovernance: t(`${p}.dataGovernance`),
          recentDecisions: t(`${p}.recentDecisions`),
          noDecisions: t(`${p}.noDecisions`),
          principle: t(`${p}.principle`),
        }}
      />
    </div>
  );
}
