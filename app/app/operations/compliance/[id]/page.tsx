import { ComplianceDetailPanel } from "@/components/app/app-portal/ComplianceDetailPanel";
import { buildComplianceLabels } from "@/lib/app-portal/compliance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function ComplianceDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <ComplianceDetailPanel policyId={id} labels={buildComplianceLabels(t)} />
    </div>
  );
}
