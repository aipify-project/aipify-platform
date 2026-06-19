import { CompanionMemoryEvolutionPanel } from "@/components/app/companion-memory-evolution";
import { buildCompanionMemoryEvolutionLabels } from "@/lib/customer-companion-memory-evolution";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionMemoryCenterPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionMemoryEvolution");
  return (
    <CompanionMemoryEvolutionPanel
      backHref="/app/companion"
      labels={buildCompanionMemoryEvolutionLabels(createTranslator(dict))}
    />
  );
}
