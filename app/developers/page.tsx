import { DeveloperPortalPanel } from "@/components/app/app-ecosystem";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DeveloperPortalPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.developerPortal";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.pageSubtitle`)}</p>
      </div>
      <DeveloperPortalPanel
        labels={{
          welcome: t(`${p}.welcome`),
          subtitle: t(`${p}.subtitle`),
          gettingStarted: t(`${p}.gettingStarted`),
          manifestSpec: t(`${p}.manifestSpec`),
          manifestHint: t(`${p}.manifestHint`),
          sandboxTitle: t(`${p}.sandboxTitle`),
          partnerTiers: t(`${p}.partnerTiers`),
          resources: t(`${p}.resources`),
          appRegistry: t(`${p}.appRegistry`),
          marketplace: t(`${p}.marketplace`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          governanceNote: t(`${p}.governanceNote`),
        }}
      />
    </div>
  );
}
