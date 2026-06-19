import { PlatformCustomerSuccessOperationsSubNav } from "@/components/platform/customer-success-operations";
import { CSAR587_PLATFORM_SECTIONS } from "@/lib/customer-success-operations/config";
import { buildPlatformCsar587OperationsLabels } from "@/lib/customer-success-operations/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformCustomerSuccessLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformCsar587OperationsLabels(t);

  const navLabels = Object.fromEntries(
    CSAR587_PLATFORM_SECTIONS.map((s) => [s.key, labels.sections[s.key]])
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <PlatformCustomerSuccessOperationsSubNav labels={navLabels} />
      {children}
    </div>
  );
}
