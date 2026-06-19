import { EnterpriseNetworkPanel } from "@/components/app/enterprise-network-operations";
import { buildEnterpriseNetworkLabels } from "@/lib/customer-enterprise-network-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EnterpriseNetworkWorkspacesPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "enterpriseNetworkOperations");
  const labels = buildEnterpriseNetworkLabels(createTranslator(dict));
  return (
    <EnterpriseNetworkPanel
      backHref="/app/network"
      initialTab="workspaces"
      visibleTabs={["workspaces", "collaborations", "trust", "organizations", "overview"]}
      titleOverride={labels.workspacesTitle}
      labels={labels}
    />
  );
}
