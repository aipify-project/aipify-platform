import { AipifyCorePlatformDashboardPanel } from "@/components/app/core-platform";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyCorePlatformPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aipifyCorePlatform");
  const t = createTranslator(dict);
  const p = "customerApp.aipifyCorePlatform";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyCorePlatformDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          homeOverview: t(`${p}.homeOverview`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          platformInstall: t(`${p}.platformInstall`),
          approvals: t(`${p}.approvals`),
          pilotMode: t(`${p}.pilotMode`),
          pilotNote: t(`${p}.pilotNote`),
          coreHealth: t(`${p}.coreHealth`),
          componentsActive: t(`${p}.componentsActive`),
          modulesEnabled: t(`${p}.modulesEnabled`),
          coreComponents: t(`${p}.coreComponents`),
          authenticationRoles: t(`${p}.authenticationRoles`),
          aiActionFramework: t(`${p}.aiActionFramework`),
          autoAllowed: t(`${p}.autoAllowed`),
          approvalRequired: t(`${p}.approvalRequired`),
          moduleFramework: t(`${p}.moduleFramework`),
          enabled: t(`${p}.enabled`),
          disabled: t(`${p}.disabled`),
          integrations: t(`${p}.integrations`),
          pilotPrinciples: t(`${p}.pilotPrinciples`),
          auditLogging: t(`${p}.auditLogging`),
        }}
      />
    </div>
  );
}
