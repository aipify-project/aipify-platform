import { SuperAdminModuleRegistryPanel } from "@/components/super-admin/module-registry/SuperAdminModuleRegistryPanel";
import { buildSuperAdminModuleRegistryLabels } from "@/lib/module-registry/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuperAdminModuleRegistryPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["superAdmin"]);
  const t = createTranslator(dict);
  const labels = buildSuperAdminModuleRegistryLabels(t);

  return <SuperAdminModuleRegistryPanel labels={labels} />;
}
