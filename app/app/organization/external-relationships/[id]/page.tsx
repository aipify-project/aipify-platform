import { ExternalRelationshipDetailPanel } from "@/components/app/app-portal/ExternalRelationshipDetailPanel";
import { buildExternalRelationshipsLabels } from "@/lib/app-portal/external-relationships";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function ExternalRelationshipDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <ExternalRelationshipDetailPanel relationshipId={id} labels={buildExternalRelationshipsLabels(t)} />
    </div>
  );
}
