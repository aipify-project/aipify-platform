import { TrustCultureDimensionPanel } from "@/components/app/app-portal/TrustCultureDimensionPanel";
import { buildTrustCultureLabels } from "@/lib/app-portal/trust-culture";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ dimension: string }> };

export default async function TrustCultureDimensionPage({ params }: Props) {
  const { dimension } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <TrustCultureDimensionPanel dimension={dimension} labels={buildTrustCultureLabels(t)} />
    </div>
  );
}
