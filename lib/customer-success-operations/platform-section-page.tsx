import { PlatformCustomerSuccessOperationsPanel } from "@/components/platform/customer-success-operations";
import { buildPlatformCsar587OperationsLabels } from "@/lib/customer-success-operations/labels";
import type { Csar587PlatformSection } from "@/lib/customer-success-operations/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function PlatformCustomerSuccessOperationsSectionPage({
  section,
}: {
  section: Csar587PlatformSection;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformCsar587OperationsLabels(t);

  return (
    <PlatformCustomerSuccessOperationsPanel
      labels={labels}
      section={section}
      backHref="/platform/customer-success"
    />
  );
}
