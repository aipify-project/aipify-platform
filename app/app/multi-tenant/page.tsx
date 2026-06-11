import { MultiTenantArchitectureDashboardPanel } from "@/components/app/multi-tenant-architecture";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MultiTenantArchitecturePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.multiTenantArchitecture";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <MultiTenantArchitectureDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          aipifyCore: t(`${p}.aipifyCore`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          team: t(`${p}.team`),
          unonightPilot: t(`${p}.unonightPilot`),
          unonightNote: t(`${p}.unonightNote`),
          selectedOrganization: t(`${p}.selectedOrganization`),
          role: t(`${p}.role`),
          modulesEnabled: t(`${p}.modulesEnabled`),
          pendingTasks: t(`${p}.pendingTasks`),
          activeAlerts: t(`${p}.activeAlerts`),
          faqs: t(`${p}.faqs`),
          yourOrganizations: t(`${p}.yourOrganizations`),
          enabledModules: t(`${p}.enabledModules`),
          enabled: t(`${p}.enabled`),
          disabled: t(`${p}.disabled`),
          integrations: t(`${p}.integrations`),
          rolePermissions: t(`${p}.rolePermissions`),
          dataIsolation: t(`${p}.dataIsolation`),
          auditLogging: t(`${p}.auditLogging`),
          aiInvolved: t(`${p}.aiInvolved`),
        }}
      />
    </div>
  );
}
