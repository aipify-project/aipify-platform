import { ServiceRebookingPanel } from "@/components/app/service-experience/ServiceRebookingPanel";
import { ServiceFeedbackPanel } from "@/components/app/service-experience/ServiceFeedbackPanel";
import { ServiceQualityPanel } from "@/components/app/service-experience/ServiceQualityPanel";
import {
  buildServiceRebookingLabels,
  buildServiceFeedbackLabels,
  buildServiceQualityLabels,
} from "@/lib/service-experience-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function ServiceRebookingPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "serviceRebooking");
  return <ServiceRebookingPanel labels={buildServiceRebookingLabels(createTranslator(dict))} />;
}

export async function ServiceFeedbackPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "serviceFeedback");
  return <ServiceFeedbackPanel labels={buildServiceFeedbackLabels(createTranslator(dict))} />;
}

export async function ServiceQualityPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "serviceQuality");
  return <ServiceQualityPanel labels={buildServiceQualityLabels(createTranslator(dict))} />;
}
