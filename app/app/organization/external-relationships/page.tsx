import { ExternalRelationshipsPanel } from "@/components/app/app-portal/ExternalRelationshipsPanel";
import { buildExternalRelationshipsLabels } from "@/lib/app-portal/external-relationships";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExternalRelationshipsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <ExternalRelationshipsPanel labels={buildExternalRelationshipsLabels(t)} />
    </div>
  );
}
