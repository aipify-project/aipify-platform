import { OrganizationalAssetDetailPanel } from "@/components/app/app-portal/OrganizationalAssetDetailPanel";
import { buildOrganizationalAssetsLabels } from "@/lib/app-portal/organizational-assets";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function OrganizationalAssetDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <OrganizationalAssetDetailPanel assetId={id} labels={buildOrganizationalAssetsLabels(t)} />
    </div>
  );
}
