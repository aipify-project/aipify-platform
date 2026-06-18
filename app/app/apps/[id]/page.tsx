import { AppsDetailPanel } from "@/components/app/app-ecosystem";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function AppDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "appEcosystem");
  const t = createTranslator(dict);
  const p = "customerApp.appEcosystem";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <AppsDetailPanel
        appKey={id}
        labels={{
          loading: t(`${p}.loading`),
          notFound: t(`${p}.notFound`),
          back: t(`${p}.back`),
          risk: t(`${p}.risk`),
          sandbox: t(`${p}.sandbox`),
          install: t(`${p}.install`),
          uninstall: t(`${p}.uninstall`),
          permissions: t(`${p}.permissions`),
          versions: t(`${p}.versions`),
          permissionsChanged: t(`${p}.permissionsChanged`),
          reviews: t(`${p}.reviews`),
          telemetry: t(`${p}.telemetry`),
          governanceNote: t(`${p}.governanceNote`),
        }}
      />
    </div>
  );
}
