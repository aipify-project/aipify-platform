import { FederationPanel } from "@/components/app/federation-operations";
import { buildFederationLabels } from "@/lib/customer-federation-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function FederationWorkspacesPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "federationOperations");
  const labels = buildFederationLabels(createTranslator(dict));
  return (
    <FederationPanel
      backHref="/app/federation"
      initialTab="workspaces"
      visibleTabs={["workspaces", "intelligence", "trust", "organizations", "overview"]}
      titleOverride={labels.workspacesTitle}
      labels={labels}
    />
  );
}
