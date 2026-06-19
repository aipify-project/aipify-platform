import { DigitalTwinSimulationPanel } from "@/components/app/digital-twin-simulation-operations";
import { buildDigitalTwinSimulationLabels } from "@/lib/customer-digital-twin-simulation-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function WhatIfWorkspacePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "digitalTwinSimulationOperations");
  const labels = buildDigitalTwinSimulationLabels(createTranslator(dict));
  return <DigitalTwinSimulationPanel backHref="/app/digital-twin-center" labels={labels} whatIfMode />;
}
