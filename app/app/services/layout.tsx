import type { ReactNode } from "react";
import { ServicesAreaChrome } from "@/components/app/service-network/ServicesAreaChrome";
import { buildServiceNetworkLabels } from "@/lib/service-network-engine/labels";
import { buildServicePaymentsLabels } from "@/lib/service-payments-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ServicesLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const [networkDict, paymentsDict] = await Promise.all([
    getCustomerAppDictionaryForModule(locale, "serviceNetwork"),
    getCustomerAppDictionaryForModule(locale, "servicePayments"),
  ]);
  const networkLabels = buildServiceNetworkLabels(createTranslator(networkDict));
  const paymentsLabels = buildServicePaymentsLabels(createTranslator(paymentsDict));
  return (
    <div className="mx-auto max-w-7xl p-6">
      <ServicesAreaChrome networkLabels={networkLabels} paymentsLabels={paymentsLabels}>
        {children}
      </ServicesAreaChrome>
    </div>
  );
}
