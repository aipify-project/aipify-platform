import { CommitmentTrackingDetailPanel } from "@/components/app/app-portal/CommitmentTrackingDetailPanel";
import { buildCommitmentTrackingLabels } from "@/lib/app-portal/commitment-tracking";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function CommitmentTrackingDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <CommitmentTrackingDetailPanel commitmentId={id} labels={buildCommitmentTrackingLabels(t)} />
    </div>
  );
}
