import { SubscriptionOperationsPanel } from "@/components/platform/subscription-operations";
import { buildSubscriptionOperationsLabels } from "@/lib/subscription-operations";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformSubscriptionOperationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <SubscriptionOperationsPanel
      backHref="/platform/billing"
      labels={buildSubscriptionOperationsLabels(t)}
    />
  );
}
