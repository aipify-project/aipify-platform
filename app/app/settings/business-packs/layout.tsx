import { BusinessPackRuntimeCustomerNav } from "@/components/app/business-pack-runtime";
import { BPR603_CUSTOMER_SECTIONS } from "@/lib/business-pack-runtime-engine/config";
import { buildBusinessPackRuntimeCustomerLabels } from "@/lib/business-pack-runtime-engine/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import Link from "next/link";

export default async function BusinessPacksSettingsLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildBusinessPackRuntimeCustomerLabels(t);
  const navLabels = Object.fromEntries(BPR603_CUSTOMER_SECTIONS.map((s) => [s.key, labels.sections[s.key]]));

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <div>
        <Link href="/app/settings" className="text-sm font-medium text-violet-700 hover:text-violet-900">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <BusinessPackRuntimeCustomerNav labels={navLabels} />
      {children}
    </div>
  );
}
