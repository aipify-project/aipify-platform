import { AppsDashboardPanel } from "@/components/app/app-ecosystem";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.appEcosystem";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AppsDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          overview: t(`${p}.overview`),
          installedApps: t(`${p}.installedApps`),
          updatesAvailable: t(`${p}.updatesAvailable`),
          principle: t(`${p}.principle`),
          developerPortal: t(`${p}.developerPortal`),
          marketplace: t(`${p}.marketplace`),
          installedAppsTitle: t(`${p}.installedAppsTitle`),
          catalog: t(`${p}.catalog`),
          install: t(`${p}.install`),
          installing: t(`${p}.installing`),
          installed: t(`${p}.installedLabel`),
          update: t(`${p}.update`),
          safetyNote: t(`${p}.safetyNote`),
        }}
      />
    </div>
  );
}
