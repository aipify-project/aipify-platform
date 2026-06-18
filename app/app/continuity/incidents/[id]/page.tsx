import { IncidentDetailPanel } from "@/components/app/continuity";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function IncidentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "continuityEngine");
  const t = createTranslator(dict);
  const p = "customerApp.continuityEngine";

  return (
    <div className="mx-auto max-w-4xl p-6">
      <IncidentDetailPanel
        incidentId={id}
        labels={{
          loading: t(`${p}.loading`),
          notFound: t(`${p}.notFound`),
          back: t(`${p}.back`),
          recoveryActions: t(`${p}.recoveryActions`),
          humanLeadership: t(`${p}.humanLeadership`),
        }}
      />
    </div>
  );
}
