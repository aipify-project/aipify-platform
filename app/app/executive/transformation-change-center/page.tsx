import { TransformationChangeCenterPanel } from "@/components/app/executive/TransformationChangeCenterPanel";
import { buildEnterpriseTransformationChangeLabels } from "@/lib/enterprise-transformation-change";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TransformationChangeCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return <TransformationChangeCenterPanel labels={buildEnterpriseTransformationChangeLabels(t)} />;
}
