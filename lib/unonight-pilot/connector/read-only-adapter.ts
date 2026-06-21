import { generateUnonightDiscoveryFindings } from "@/lib/aipify/integrations/unonight/adapter";
import { filterDeniedFields } from "../denylist";
import type { PilotOrganizationSignal } from "../types";

export type ReadOnlyConnectorFetchResult = {
  signals: Array<Omit<PilotOrganizationSignal, "observed_at"> & {
    source_system: string;
    source_record_id: string;
    event_type: string;
  }>;
  skippedSources: string[];
  externalConnectionRequired: boolean;
  connectionNote: string;
};

/** Read-only adapter stub — validates gates; ingests from approved views when configured. */
export async function fetchReadOnlyPilotSignals(options: {
  sourceKey: string;
  allowed: boolean;
  configuredViewUrl?: string | null;
}): Promise<ReadOnlyConnectorFetchResult> {
  if (!options.allowed) {
    return {
      signals: [],
      skippedSources: [options.sourceKey],
      externalConnectionRequired: true,
      connectionNote: `Source ${options.sourceKey} is not approved for ingestion.`,
    };
  }

  if (options.sourceKey === "workflow_events") {
    const { findings } = generateUnonightDiscoveryFindings();
    const queues = Array.isArray((findings as { queues_detected?: unknown }).queues_detected)
      ? ((findings as { queues_detected: Array<Record<string, unknown>> }).queues_detected)
      : [];

    const signals = queues.map((queue, index) => {
      const payload = filterDeniedFields({
        queue_label: String(queue.queue_label ?? ""),
        estimated_volume: String(queue.estimated_volume ?? ""),
        read_only: true,
      });

      return {
        source_system: "unonight_read_only_connector",
        source_record_id: `discovery-queue-${index + 1}`,
        event_type: "queue_detected",
        signal_type: "queue_metric",
        title: String(queue.queue_label ?? "Queue detected"),
        summary: "Metadata-only queue signal from read-only discovery.",
        metrics: payload.allowed,
      };
    });

    return {
      signals,
      skippedSources: [],
      externalConnectionRequired: !options.configuredViewUrl,
      connectionNote: options.configuredViewUrl
        ? "Supabase read-only view configured — replace stub with live fetch."
        : "Configure Unonight read-only API views or Supabase views — no HTML scraping.",
    };
  }

  return {
    signals: [],
    skippedSources: [options.sourceKey],
    externalConnectionRequired: true,
    connectionNote: `External Unonight connection required for ${options.sourceKey}.`,
  };
}
