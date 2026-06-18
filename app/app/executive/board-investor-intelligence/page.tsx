import { BoardInvestorIntelligencePanel } from "@/components/app/executive/BoardInvestorIntelligencePanel";
import { buildBoardInvestorIntelligenceLabels } from "@/lib/board-investor-intelligence";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BoardInvestorIntelligencePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return <BoardInvestorIntelligencePanel labels={buildBoardInvestorIntelligenceLabels(t)} />;
}
