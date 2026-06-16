import { SuperPortalExecutiveDashboardPanel } from "@/components/super-admin/super-portal";
import { SUPER_ADMIN_SECTIONS } from "@/lib/super-admin/nav-config";
import { buildSuperPortalLabels } from "@/lib/super-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuperAdminPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["superAdmin"]);
  const t = createTranslator(dict);
  const labels = buildSuperPortalLabels(t);

  const sectionLabels = Object.fromEntries(
    SUPER_ADMIN_SECTIONS.map((section) => [
      section.id,
      {
        title: t(section.titleKey),
        purpose: t(section.purposeKey),
      },
    ])
  );

  const moduleLabels: Record<string, { label: string; description: string }> = {};
  for (const section of SUPER_ADMIN_SECTIONS) {
    for (const module of section.modules) {
      moduleLabels[module.id] = {
        label: t(module.labelKey),
        description: t(module.descriptionKey),
      };
    }
  }

  return (
    <SuperPortalExecutiveDashboardPanel
      labels={labels.dashboard}
      sections={SUPER_ADMIN_SECTIONS}
      sectionLabels={sectionLabels}
      moduleLabels={moduleLabels}
    />
  );
}
