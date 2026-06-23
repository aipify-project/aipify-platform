import { Suspense } from "react";
import { CompanionPageClient } from "@/components/app/companion-experience/CompanionPageClient";
import { buildCompanionExperienceLabels } from "@/lib/app/companion/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { AipifyLoader } from "@/components/ui/aipify-loader";

export default async function AipifyCompanionPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["companion"]);
  const labels = buildCompanionExperienceLabels(createTranslator(dict));

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <AipifyLoader centered />
        </div>
      }
    >
      <CompanionPageClient labels={labels} locale={locale} />
    </Suspense>
  );
}
