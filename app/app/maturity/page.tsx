import { MaturityEvolutionPanel } from "@/components/app/maturity-evolution-operations";
import { buildMaturityEvolutionLabels } from "@/lib/customer-maturity-evolution-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MaturityPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "maturityEvolutionOperations");
  const labels = buildMaturityEvolutionLabels(createTranslator(dict));
  return <MaturityEvolutionPanel backHref="/app" labels={labels} />;
}
