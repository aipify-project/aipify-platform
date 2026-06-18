import { AgentsDetailPanel } from "@/components/app/agents";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function AgentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "agents");
  const t = createTranslator(dict);
  const p = "customerApp.agents";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <AgentsDetailPanel
        agentKey={id}
        labels={{
          loading: t(`${p}.loading`),
          notFound: t(`${p}.notFound`),
          back: t(`${p}.back`),
          risk: t(`${p}.risk`),
          disableAgent: t(`${p}.disableAgent`),
          enableAgent: t(`${p}.enableAgent`),
          responsibilities: t(`${p}.responsibilities`),
          capabilities: t(`${p}.capabilities`),
          requiresApproval: t(`${p}.requiresApproval`),
          permissions: t(`${p}.permissions`),
          granted: t(`${p}.granted`),
          denied: t(`${p}.denied`),
          metrics: t(`${p}.metrics`),
          eventHistory: t(`${p}.eventHistory`),
          governanceNote: t(`${p}.governanceNote`),
        }}
      />
    </div>
  );
}
