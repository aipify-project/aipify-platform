import { SuperPortalLanguageAdministrationPanel } from "@/components/super-admin/super-portal";
import { buildSuperPortalLabels } from "@/lib/super-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuperLanguageAdministrationPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["superAdmin"]);
  const t = createTranslator(dict);

  return (
    <SuperPortalLanguageAdministrationPanel
      labels={buildSuperPortalLabels(t).languageAdministration}
    />
  );
}
