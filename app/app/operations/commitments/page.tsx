import { CommitmentTrackingPanel } from "@/components/app/app-portal/CommitmentTrackingPanel";
import { buildCommitmentTrackingLabels } from "@/lib/app-portal/commitment-tracking";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CommitmentTrackingPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <CommitmentTrackingPanel labels={buildCommitmentTrackingLabels(t)} />
    </div>
  );
}
