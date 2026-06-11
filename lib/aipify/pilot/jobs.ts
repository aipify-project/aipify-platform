import {
  generatePilotSampleWorkflowEvents,
  generateUnonightDiscoveryFindings,
} from "@/lib/aipify/integrations/unonight";

type RpcFetcher = (name: string, params: Record<string, unknown>) => Promise<unknown>;

/** unonight_initial_discovery — run after tenant creation. */
export async function runInitialDiscoveryJob(
  fetcher: RpcFetcher,
  tenantId: string,
  runType: "initial_install" | "manual_rescan" | "scheduled_scan" = "initial_install"
) {
  const { findings, recommendations } = generateUnonightDiscoveryFindings();
  return fetcher("run_tenant_discovery", {
    p_tenant_id: tenantId,
    p_run_type: runType,
    p_findings: findings,
    p_recommendations: recommendations,
  });
}

/** unonight_sync_workflow_events — periodic sync stub for pilot. */
export async function runWorkflowEventSyncJob(fetcher: RpcFetcher, tenantId: string) {
  const events = generatePilotSampleWorkflowEvents();
  return fetcher("record_tenant_workflow_events", {
    p_tenant_id: tenantId,
    p_events: events,
  });
}

/** unonight_pilot_health_check — daily health validation. */
export async function runPilotHealthCheckJob(fetcher: RpcFetcher, tenantId: string) {
  return fetcher("run_pilot_health_check", { p_tenant_id: tenantId });
}
