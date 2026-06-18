import { EnterpriseAgentsPanel } from "@/components/app/enterprise";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EnterpriseAgentsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseDeployment";

  return (
    <EnterpriseAgentsPanel
      locale={locale}
      labels={{
        title: t(`${p}.agentsTitle`),
        subtitle: t(`${p}.agentsSubtitle`),
        loading: t(`${p}.loading`),
        back: t(`${p}.back`),
        registerAgent: t(`${p}.registerAgent`),
        register: t(`${p}.register`),
        agentKeyOnce: t(`${p}.agentKeyOnce`),
        noAgents: t(`${p}.noAgents`),
        lastSeen: t(`${p}.lastSeen`),
        never: t(`${p}.neverSeen`),
        disable: t(`${p}.disable`),
      }}
    />
  );
}
