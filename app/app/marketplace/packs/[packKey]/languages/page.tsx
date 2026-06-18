import { BusinessPackLanguageCenterPanel } from "@/components/app/business-pack-language-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ packKey: string }> };

export default async function BusinessPackLanguagePage({ params }: PageProps) {
  const { packKey } = await params;
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "businessPackLanguage");
  const t = createTranslator(dict);
  const p = "customerApp.businessPackLanguage";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    notFoundTitle: t(`${p}.notFoundTitle`),
    notFoundMessage: t(`${p}.notFoundMessage`),
    backToMarketplace: t(`${p}.backToMarketplace`),
    viewPack: t(`${p}.viewPack`),
    languageCenter: t(`${p}.languageCenter`),
    overview: t(`${p}.overview`),
    translationCompletion: t(`${p}.translationCompletion`),
    defaultLanguage: t(`${p}.defaultLanguage`),
    resourcePath: t(`${p}.resourcePath`),
    installationFlow: t(`${p}.installationFlow`),
    generateResources: t(`${p}.generateResources`),
    languages: t(`${p}.languages`),
    enableLanguage: t(`${p}.enableLanguage`),
    disableLanguage: t(`${p}.disableLanguage`),
    setDefault: t(`${p}.setDefault`),
    fallbackRules: t(`${p}.fallbackRules`),
    actionFailed: t(`${p}.actionFailed`),
    actionSuccess: t(`${p}.actionSuccess`),
    status_complete: t(`${p}.statuses.complete`),
    status_partial: t(`${p}.statuses.partial`),
    status_pending: t(`${p}.statuses.pending`),
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <BusinessPackLanguageCenterPanel packKey={packKey} labels={labels} />
    </div>
  );
}
