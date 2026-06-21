import { generateUnonightDiscoveryFindings } from "@/lib/aipify/integrations/unonight/adapter";

export type DiscoveryRunSummary = {
  adapter: string;
  queuesDetected: number;
  integrationCapabilities: string[];
  externalConnectionRequired: boolean;
  connectionNote: string;
};

/** Discovery runner — reuses Install Engine / Unonight adapter findings. */
export function runPilotDiscovery(): DiscoveryRunSummary {
  const { findings } = generateUnonightDiscoveryFindings();
  const queues = (findings as { queues_detected?: unknown[] }).queues_detected ?? [];
  const capabilities = (findings as { integration_capabilities?: string[] }).integration_capabilities ?? [];

  return {
    adapter: String((findings as { adapter?: string }).adapter ?? "unonight_platform"),
    queuesDetected: queues.length,
    integrationCapabilities: capabilities,
    externalConnectionRequired: true,
    connectionNote:
      "Configure Unonight read-only API views or Supabase views when external connection is ready.",
  };
}
