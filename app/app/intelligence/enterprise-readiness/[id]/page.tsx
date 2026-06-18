import { EnterpriseReadinessDetailPanel } from "@/components/app/app-portal/EnterpriseReadinessDetailPanel";
import { buildEnterpriseReadinessLabels } from "@/lib/app-portal/enterprise-readiness";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function EnterpriseReadinessDetailPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <EnterpriseReadinessDetailPanel assessmentId={id} labels={buildEnterpriseReadinessLabels(t)} />
    </div>
  );
}
