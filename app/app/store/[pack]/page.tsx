import { Suspense } from "react";
import { AppStorePackDetailPanel } from "@/components/app/app-store";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { buildAppStoreLabels } from "@/lib/app-store/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ pack: string }> };

export default async function AppStorePackPage({ params }: PageProps) {
  const { pack } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["marketplace"]);
  const t = createTranslator(dict);
  const labels = buildAppStoreLabels(t);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[320px] items-center justify-center">
          <AipifyLoader centered />
        </div>
      }
    >
      <AppStorePackDetailPanel packKey={pack} labels={labels} />
    </Suspense>
  );
}
