import { ExplanationDetailPanel } from "@/components/app/trust-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function ExplanationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "trustEngine");
  const t = createTranslator(dict);
  const p = "customerApp.trustEngine";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <ExplanationDetailPanel
        explanationId={id}
        labels={{
          loading: t(`${p}.loading`),
          notFound: t(`${p}.notFound`),
          back: t(`${p}.back`),
          confidence: t(`${p}.confidence`),
          simpleExplanation: t(`${p}.simpleExplanation`),
          operationalExplanation: t(`${p}.operationalExplanation`),
          technicalExplanation: t(`${p}.technicalExplanation`),
          reasoning: t(`${p}.reasoning`),
          informationUsed: t(`${p}.informationUsed`),
          rulesApplied: t(`${p}.rulesApplied`),
          alternatives: t(`${p}.alternatives`),
          nextActions: t(`${p}.nextActions`),
          helpful: t(`${p}.helpful`),
          unclear: t(`${p}.unclear`),
          override: t(`${p}.override`),
          eventHistory: t(`${p}.eventHistory`),
          governanceNote: t(`${p}.governanceNote`),
        }}
      />
    </div>
  );
}
