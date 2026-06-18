import Link from "next/link";
import { OrchestrationFlowsPanel } from "@/components/app/orchestration";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrchestrationFlowsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "orchestration");
  const t = createTranslator(dict);
  const p = "customerApp.orchestration";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <Link href="/app/orchestration" className="text-sm text-indigo-600 hover:underline">{t(`${p}.back`)}</Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.flowsTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.flowsSubtitle`)}</p>
      </div>
      <OrchestrationFlowsPanel
        labels={{
          loading: t(`${p}.loading`),
          noFlows: t(`${p}.noFlows`),
          allStatuses: t(`${p}.allStatuses`),
          refresh: t(`${p}.refresh`),
          currentStep: t(`${p}.currentStep`),
          retry: t(`${p}.retry`),
          cancel: t(`${p}.cancel`),
        }}
      />
    </div>
  );
}
