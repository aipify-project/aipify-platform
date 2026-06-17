import { CompanionActionApprovalPanel } from "@/components/app/companion/CompanionActionApprovalPanel";
import { buildCompanionActionApprovalLabels } from "@/lib/companion-action-approval/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionActionsPage() {
  const dict = await getDictionary(await getLocale(), ["companionActionApproval"]);
  const t = createTranslator(dict);
  return <CompanionActionApprovalPanel labels={buildCompanionActionApprovalLabels(t)} />;
}
