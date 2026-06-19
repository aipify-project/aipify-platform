import { TrustCenterOperationsPanel } from "@/components/app/trust-center-operations";
import { buildTrustCenterOperationsLabels } from "@/lib/trust-center-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TrustCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "trustCenterOperations");
  return (
    <TrustCenterOperationsPanel
      backHref="/app"
      labels={buildTrustCenterOperationsLabels(createTranslator(dict))}
    />
  );
}
