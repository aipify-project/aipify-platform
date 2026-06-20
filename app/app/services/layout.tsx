import type { ReactNode } from "react";
import { ServicesAreaChrome } from "@/components/app/service-network/ServicesAreaChrome";
import { buildServiceNetworkLabels } from "@/lib/service-network-engine/labels";
import { buildServicePaymentsLabels } from "@/lib/service-payments-engine/labels";
import { buildServiceIntakeLabels } from "@/lib/service-intake-engine/labels";
import {
  buildServiceCommunicationsLabels,
  buildServiceRebookingLabels,
  buildServiceFeedbackLabels,
  buildServiceQualityLabels,
} from "@/lib/service-experience-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ServicesLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const [networkDict, paymentsDict, intakeDict, commDict, rebDict, fbDict, qualDict] = await Promise.all([
    getCustomerAppDictionaryForModule(locale, "serviceNetwork"),
    getCustomerAppDictionaryForModule(locale, "servicePayments"),
    getCustomerAppDictionaryForModule(locale, "serviceIntake"),
    getCustomerAppDictionaryForModule(locale, "serviceCommunications"),
    getCustomerAppDictionaryForModule(locale, "serviceRebooking"),
    getCustomerAppDictionaryForModule(locale, "serviceFeedback"),
    getCustomerAppDictionaryForModule(locale, "serviceQuality"),
  ]);
  const tComm = createTranslator(commDict);
  const networkLabels = buildServiceNetworkLabels(createTranslator(networkDict));
  const paymentsLabels = buildServicePaymentsLabels(createTranslator(paymentsDict));
  const intakeLabels = buildServiceIntakeLabels(createTranslator(intakeDict));
  const communicationsLabels = buildServiceCommunicationsLabels(tComm);
  const rebookingLabels = buildServiceRebookingLabels(createTranslator(rebDict));
  const feedbackLabels = buildServiceFeedbackLabels(createTranslator(fbDict));
  const qualityLabels = buildServiceQualityLabels(createTranslator(qualDict));
  const areaLabels = {
    communications: communicationsLabels.title,
    rebooking: rebookingLabels.title,
    feedback: feedbackLabels.title,
    quality: qualityLabels.title,
  };
  return (
    <div className="mx-auto max-w-7xl p-6">
      <ServicesAreaChrome
        networkLabels={networkLabels}
        paymentsLabels={paymentsLabels}
        intakeLabels={intakeLabels}
        communicationsLabels={communicationsLabels}
        rebookingLabels={rebookingLabels}
        feedbackLabels={feedbackLabels}
        qualityLabels={qualityLabels}
        areaLabels={areaLabels}
      >
        {children}
      </ServicesAreaChrome>
    </div>
  );
}
