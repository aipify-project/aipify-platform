import { RecoveryTaskBoardPanel } from "@/components/app/business-continuity";
import { buildBusinessContinuityLabels } from "@/lib/business-continuity-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function RecoveryTaskBoardPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "businessContinuity");
  const t = createTranslator(dict);
  return <RecoveryTaskBoardPanel labels={buildBusinessContinuityLabels(t)} />;
}
