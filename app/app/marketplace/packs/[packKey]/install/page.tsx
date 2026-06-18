import { BusinessPackMarketplaceInstallPanel } from "@/components/app/business-pack-marketplace-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ packKey: string }> };

export default async function BusinessPackInstallPage({ params }: PageProps) {
  const { packKey } = await params;
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "businessPackMarketplaceInstall");
  const t = createTranslator(dict);
  const p = "customerApp.businessPackMarketplaceInstall";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    notFoundTitle: t(`${p}.notFoundTitle`),
    notFoundMessage: t(`${p}.notFoundMessage`),
    backToMarketplace: t(`${p}.backToMarketplace`),
    viewPack: t(`${p}.viewPack`),
    installWorkflow: t(`${p}.installWorkflow`),
    installSubtitle: t(`${p}.installSubtitle`),
    installationFlow: t(`${p}.installationFlow`),
    commercialPrinciples: t(`${p}.commercialPrinciples`),
    openStep: t(`${p}.openStep`),
    activatePack: t(`${p}.activatePack`),
    activateSuccess: t(`${p}.activateSuccess`),
    openWorkspace: t(`${p}.openWorkspace`),
    legalRequiredTitle: t(`${p}.legalRequiredTitle`),
    legalRequiredMessage: t(`${p}.legalRequiredMessage`),
    acceptTerms: t(`${p}.acceptTerms`),
    actionFailed: t(`${p}.actionFailed`),
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <BusinessPackMarketplaceInstallPanel packKey={packKey} labels={labels} />
    </div>
  );
}
