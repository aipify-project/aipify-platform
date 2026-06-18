import { MarketplaceItemDetailPanel } from "@/components/app/marketplace";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function MarketplaceItemPage({ params }: PageProps) {
  const { id } = await params;
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "marketplace");
  const t = createTranslator(dict);
  const p = "customerApp.marketplace";

  return (
    <div className="mx-auto max-w-4xl p-6">
      <MarketplaceItemDetailPanel
        itemKey={id}
        labels={{
          loading: t(`${p}.loading`),
          back: t(`${p}.back`),
          notFound: t(`${p}.notFound`),
          riskLevel: t(`${p}.riskLevel`),
          pricing: t(`${p}.pricing`),
          deployment: t(`${p}.deployment`),
          includedSkills: t(`${p}.includedSkills`),
          permissions: t(`${p}.permissions`),
          install: t(`${p}.install`),
          installWithApproval: t(`${p}.installWithApproval`),
          installing: t(`${p}.installing`),
          installed: t(`${p}.installedSuccess`),
          alreadyInstalled: t(`${p}.alreadyInstalled`),
          approvalRequired: t(`${p}.approvalRequired`),
          precheckFailed: t(`${p}.precheckFailed`),
          reviews: t(`${p}.reviews`),
        }}
      />
    </div>
  );
}
