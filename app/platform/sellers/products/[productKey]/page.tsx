import { ProductEditorPageClient } from "@/components/platform/sellers/ProductEditorPageClient";
import {
  buildProductShopifyEditorLabels,
  buildSellersActionLabels,
} from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformSellersProductEditPage({
  params,
}: {
  params: Promise<{ productKey: string }>;
}) {
  const { productKey: raw } = await params;
  const productKey = decodeURIComponent(raw);
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <ProductEditorPageClient
        mode="edit"
        productKey={productKey}
        locale={locale}
        actionLabels={buildSellersActionLabels(t)}
        editorLabels={buildProductShopifyEditorLabels(t)}
        notReadyTitle={t("platform.sellers.backend.notReadyTitle")}
        notReadyBody={t("platform.sellers.backend.notReadyBody")}
      />
    </div>
  );
}
