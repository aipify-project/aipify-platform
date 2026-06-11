import { TenantIntegrationsPanel } from "@/components/platform/pilot";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function TenantIntegrationsPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <TenantIntegrationsPanel
      tenantId={id}
      labels={{
        title: t("platform.pilot.integrationsPageTitle"),
        loading: t("platform.pilot.loading"),
        testConnection: t("platform.pilot.testConnection"),
      }}
    />
  );
}
