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

/** Read-only adapter — uses approved workflow stubs until live Unonight connection is verified. */
export async function fetchReadOnlyPilotSignals(options: {
  sourceKey: string;
  allowed: boolean;
  configuredViewUrl?: string | null;
  liveConnectionVerified?: boolean;
}): Promise<ReadOnlyConnectorFetchResult> {
  if (!options.allowed) {
    return {
      signals: [],
      skippedSources: [options.sourceKey],
      externalConnectionRequired: true,
      connectionNote: `Source ${options.sourceKey} is not approved for ingestion.`,
    };
  }

  if (options.sourceKey === "unonight_platform_api") {
    if (!options.liveConnectionVerified) {
      return {
        signals: [],
        skippedSources: [options.sourceKey],
        externalConnectionRequired: true,
        connectionNote:
          "Unonight read-only connection must be verified before platform API ingestion.",
      };
    }
    return {
      signals: [],
      skippedSources: [],
      externalConnectionRequired: false,
      connectionNote: "Live read-only connection verified — data sync not enabled in this phase.",
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
      externalConnectionRequired: !options.configuredViewUrl && !options.liveConnectionVerified,
      connectionNote: options.liveConnectionVerified
        ? "Workflow discovery active — platform API awaits first sync phase."
        : "Configure and verify Unonight read-only connection — no HTML scraping.",
    };
  }

  return {
    signals: [],
    skippedSources: [options.sourceKey],
    externalConnectionRequired: true,
    connectionNote: `External Unonight connection required for ${options.sourceKey}.`,
  };
}
