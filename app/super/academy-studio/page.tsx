import { AcademyStudioPanel } from "@/components/academy-studio";
import { buildAcademyStudioLabels } from "@/lib/academy-studio";
import { SUPER_ADMIN_HOME_ROUTE } from "@/lib/super-admin/nav-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuperAdminAcademyStudioPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["superAdmin"]);
  const t = createTranslator(dict);

  return (
    <AcademyStudioPanel
      surface="super"
      backHref={SUPER_ADMIN_HOME_ROUTE}
      labels={buildAcademyStudioLabels(t, "superAdmin.academyStudio")}
    />
  );
}
