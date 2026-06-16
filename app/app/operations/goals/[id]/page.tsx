import { OrganizationalGoalDetailPanel } from "@/components/app/app-portal/OrganizationalGoalDetailPanel";
import { buildOrganizationalGoalsLabels } from "@/lib/app-portal/organizational-goals";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function OrganizationalGoalDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <OrganizationalGoalDetailPanel goalId={id} labels={buildOrganizationalGoalsLabels(t)} />
    </div>
  );
}
