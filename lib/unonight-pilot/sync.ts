import { canRunSync } from "./gates";
import { fetchReadOnlyPilotSignals } from "./connector/read-only-adapter";
import { buildPilotSignalDedupKey } from "./dedup";
import type { UnonightPilotSettings } from "./types";

export type PilotSyncSchedulerInput = {
  settings: UnonightPilotSettings | null;
  sources: Array<{ source_key: string; allowed: boolean }>;
  existingDedupKeys?: Set<string>;
  configuredViewUrl?: string | null;
  liveConnectionVerified?: boolean;
};

export type PilotSyncSchedulerResult = {
  ok: boolean;
  reason?: string;
  ingested: number;
  skipped: number;
  deduped: number;
  signals: Array<{
    dedupKey: string;
    signal_type: string;
    title: string;
  }>;
};

/** Sync scheduler hook — server/cron only; no browser trigger. */
export async function runPilotSyncScheduler(
  input: PilotSyncSchedulerInput
): Promise<PilotSyncSchedulerResult> {
  if (!canRunSync(input.settings)) {
    return {
      ok: false,
      reason: input.settings?.kill_switch ? "kill_switch_active" : "pilot_not_ready",
      ingested: 0,
      skipped: 0,
      deduped: 0,
      signals: [],
    };
  }

  const existing = input.existingDedupKeys ?? new Set<string>();
  let ingested = 0;
  let skipped = 0;
  let deduped = 0;
  const signals: PilotSyncSchedulerResult["signals"] = [];

  for (const source of input.sources.filter((s) => s.allowed)) {
    const result = await fetchReadOnlyPilotSignals({
      sourceKey: source.source_key,
      allowed: source.allowed,
      configuredViewUrl: input.configuredViewUrl,
      liveConnectionVerified: input.liveConnectionVerified,
    });

    if (result.skippedSources.includes(source.source_key)) {
      skipped += 1;
      continue;
    }

    for (const signal of result.signals) {
      const dedupKey = buildPilotSignalDedupKey({
        organizationId: "org",
        sourceSystem: signal.source_system,
        sourceRecordId: signal.source_record_id,
        eventType: signal.event_type,
      });

      if (existing.has(dedupKey)) {
        deduped += 1;
        continue;
      }

      existing.add(dedupKey);
      ingested += 1;
      signals.push({
        dedupKey,
        signal_type: signal.signal_type,
        title: signal.title,
      });
    }
  }

  return { ok: true, ingested, skipped, deduped, signals };
}
