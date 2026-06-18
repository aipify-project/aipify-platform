import { OwnerDetailPanel } from "@/components/app/app-portal/OwnerDetailPanel";
import { buildResponsibilitiesLabels } from "@/lib/app-portal/responsibilities";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ userId: string }> };

export default async function OwnerDetailPage({ params }: Props) {
  const { userId } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <OwnerDetailPanel userId={userId} labels={buildResponsibilitiesLabels(t)} />
    </div>
  );
}
