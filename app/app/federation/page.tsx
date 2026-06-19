import { FederationPanel } from "@/components/app/federation-operations";
import { buildFederationLabels } from "@/lib/customer-federation-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function FederationPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "federationOperations");
  const labels = buildFederationLabels(createTranslator(dict));
  return <FederationPanel backHref="/app" labels={labels} />;
}
