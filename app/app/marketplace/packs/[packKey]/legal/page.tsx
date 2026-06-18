import { BusinessPackLegalCenterPanel } from "@/components/app/business-pack-legal-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ packKey: string }> };

export default async function BusinessPackLegalPage({ params }: PageProps) {
  const { packKey } = await params;
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "businessPackLegal");
  const t = createTranslator(dict);
  const p = "customerApp.businessPackLegal";

  const termKeys = [
    "scope", "intended_use", "license_limitations", "customer_responsibilities",
    "platform_responsibilities", "data_handling_principles",
  ] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    notFoundTitle: t(`${p}.notFoundTitle`),
    notFoundMessage: t(`${p}.notFoundMessage`),
    backToMarketplace: t(`${p}.backToMarketplace`),
    viewPack: t(`${p}.viewPack`),
    legalCenter: t(`${p}.legalCenter`),
    overview: t(`${p}.overview`),
    governingLaw: t(`${p}.governingLaw`),
    jurisdiction: t(`${p}.jurisdiction`),
    publicationStatus: t(`${p}.publicationStatus`),
    allRequiredAccepted: t(`${p}.allRequiredAccepted`),
    yes: t(`${p}.yes`),
    no: t(`${p}.no`),
    packTerms: t(`${p}.packTerms`),
    legalEntity: t(`${p}.legalEntity`),
    companyConfigNote: t(`${p}.companyConfigNote`),
    availableDocuments: t(`${p}.availableDocuments`),
    version: t(`${p}.version`),
    effectiveDate: t(`${p}.effectiveDate`),
    accepted: t(`${p}.accepted`),
    acceptanceRequired: t(`${p}.acceptanceRequired`),
    viewDocument: t(`${p}.viewDocument`),
    hideDocument: t(`${p}.hideDocument`),
    activationBlockedTitle: t(`${p}.activationBlockedTitle`),
    activationBlockedMessage: t(`${p}.activationBlockedMessage`),
    acceptRequired: t(`${p}.acceptRequired`),
    acceptSuccess: t(`${p}.acceptSuccess`),
    actionFailed: t(`${p}.actionFailed`),
  };

  for (const key of termKeys) labels[`term_${key}`] = t(`${p}.terms.${key}`);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <BusinessPackLegalCenterPanel packKey={packKey} labels={labels} />
    </div>
  );
}
