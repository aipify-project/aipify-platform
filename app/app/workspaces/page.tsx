import { OrganizationOperationsPanel } from "@/components/app/organization-operations";
import { buildOrganizationOperationsLabels } from "@/lib/organization-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function WorkspacesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildOrganizationOperationsLabels(t);

  return (
    <OrganizationOperationsPanel
      labels={labels}
      initialTab="workspaces"
      visibleTabs={["overview", "workspaces", "brands", "domains", "health", "companion"]}
      titleOverride={t("organizationOperations.workspacesPage.title")}
      subtitleOverride={t("organizationOperations.workspacesPage.subtitle")}
    />
  );
}
