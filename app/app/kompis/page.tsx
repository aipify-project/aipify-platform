import { Suspense } from "react";
import { KompisOperatorWorkspacePanel } from "@/components/app/kompis-operator/KompisOperatorWorkspacePanel";
import { buildKompisOperatorLabels } from "@/lib/kompis-operator/labels";
import { buildWebsiteCmsLabels } from "@/lib/website-cms/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { AipifyLoader } from "@/components/ui/aipify-loader";

export default async function KompisOperatorPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core", "portalStructure"]);
  const t = createTranslator(dict);
  const labels = buildKompisOperatorLabels(t);
  const websiteCmsLabels = buildWebsiteCmsLabels(t);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <AipifyLoader centered />
        </div>
      }
    >
      <KompisOperatorWorkspacePanel labels={labels} websiteCmsLabels={websiteCmsLabels} locale={locale} />
    </Suspense>
  );
}
