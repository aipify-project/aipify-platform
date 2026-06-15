import { GroupOverviewPanel } from "@/components/super-admin/group-overview";
import { buildGroupOrganizationLabels } from "@/lib/group-organization";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuperAdminGroupOverviewPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["superAdmin"]);
  const t = createTranslator(dict);

  return (
    <GroupOverviewPanel
      backHref="/super"
      labels={buildGroupOrganizationLabels(t)}
    />
  );
}
