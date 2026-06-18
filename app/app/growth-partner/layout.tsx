import type { ReactNode } from "react";
import Link from "next/link";
import { GrowthPartnerOpsNav } from "@/components/app/growth-partner-operations-center";
import { buildGrowthPartnerOperationsCenterLabels } from "@/lib/growth-partner-operations-center/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GrowthPartnerLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "growthPartnerOperationsCenter");
  const t = createTranslator(dict);
  const labels = buildGrowthPartnerOperationsCenterLabels(t);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <GrowthPartnerOpsNav labels={labels.sections} />
      {children}
      <footer className="border-t border-zinc-200 pt-6 text-sm text-zinc-500">
        <div className="flex flex-wrap gap-4">
          <Link href="/app/growth-partner/core-values" className="font-medium text-violet-700 hover:underline">
            {labels.sections.coreValues}
          </Link>
          <Link href="/growth-partner-terms" className="font-medium text-violet-700 hover:underline">
            {labels.sections.terms}
          </Link>
        </div>
        <p className="mt-3 text-xs">Aipify Group AS · Bergen. Norway. For the world.</p>
      </footer>
    </div>
  );
}
