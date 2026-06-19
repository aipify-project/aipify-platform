import type { ReactNode } from "react";
import { CompanionFeedbackCenterNav } from "@/components/app/companion-feedback-center";
import { buildCompanionFeedbackCenterLabels } from "@/lib/companion-feedback-center-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionFeedbackCenterLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "companionFeedbackCenter");
  const t = createTranslator(dict);
  const labels = buildCompanionFeedbackCenterLabels(t);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <CompanionFeedbackCenterNav labels={labels.sections} />
      {children}
    </div>
  );
}
