import { PlatformPlaybookDesignerPanel } from "@/components/platform/platform-playbook-center/PlatformPlaybookDesignerPanel";
import { buildPlatformPlaybookCenterLabels } from "@/lib/platform-playbook-center";
import { SUPER_ADMIN_HOME_ROUTE } from "@/lib/super-admin/nav-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuperAdminPlaybooksPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "superAdmin"]);
  const t = createTranslator(dict);

  return (
    <PlatformPlaybookDesignerPanel
      surface="super"
      backHref={SUPER_ADMIN_HOME_ROUTE}
      labels={buildPlatformPlaybookCenterLabels(t)}
    />
  );
}
