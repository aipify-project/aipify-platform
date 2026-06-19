import type { ReactNode } from "react";
import { ServicesAreaChrome } from "@/components/app/service-network/ServicesAreaChrome";
import { buildServiceNetworkLabels } from "@/lib/service-network-engine/labels";
import { buildServicePaymentsLabels } from "@/lib/service-payments-engine/labels";
import { buildServiceIntakeLabels } from "@/lib/service-intake-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ServicesLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const [networkDict, paymentsDict, intakeDict] = await Promise.all([
    getCustomerAppDictionaryForModule(locale, "serviceNetwork"),
    getCustomerAppDictionaryForModule(locale, "servicePayments"),
    getCustomerAppDictionaryForModule(locale, "serviceIntake"),
  ]);
  const networkLabels = buildServiceNetworkLabels(createTranslator(networkDict));
  const paymentsLabels = buildServicePaymentsLabels(createTranslator(paymentsDict));
  const intakeLabels = buildServiceIntakeLabels(createTranslator(intakeDict));
  return (
    <div className="mx-auto max-w-7xl p-6">
      <ServicesAreaChrome networkLabels={networkLabels} paymentsLabels={paymentsLabels} intakeLabels={intakeLabels}>
        {children}
      </ServicesAreaChrome>
    </div>
  );
}
