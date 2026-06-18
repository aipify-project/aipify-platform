import { OpportunityDetailPanel } from "@/components/app/strategy";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "strategyEngine");
  const t = createTranslator(dict);
  const p = "customerApp.strategyEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <OpportunityDetailPanel
        opportunityId={id}
        labels={{
          loading: t(`${p}.loading`),
          notFound: t(`${p}.notFound`),
          back: t(`${p}.back`),
          expectedValue: t(`${p}.expectedValue`),
          humanLeadership: t(`${p}.humanLeadership`),
          recommendationsSection: t(`${p}.recommendationsSection`),
          potentialRisks: t(`${p}.potentialRisks`),
        }}
      />
    </div>
  );
}
