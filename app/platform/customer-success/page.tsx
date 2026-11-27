import { PlatformCustomersHubShell } from "@/components/platform/customers/PlatformCustomersHubShell";
import { PlatformCustomerSuccessOverviewPanel } from "@/components/platform/platform-portal/PlatformCustomerSuccessOverviewPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPlatformCustomerSuccessLabels } from "@/lib/platform-portal/labels";

export default async function PlatformCustomerSuccessOverviewPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformCustomerSuccessLabels(t);

  return (
    <PlatformCustomersHubShell>
      <PlatformCustomerSuccessOverviewPanel labels={labels} locale={locale} />
    </PlatformCustomersHubShell>
  );
}
