import { collectPresetEvents, presetEventsToRpcPayload, type CollectorContext } from "./collectors";

type RpcFetcher = (name: string, params: Record<string, unknown>) => Promise<unknown>;

export async function collectBriefingEventsJob(
  fetcher: RpcFetcher,
  since?: string,
  ctx: CollectorContext = {}
) {
  const result = await fetcher("collect_briefing_events", {
    p_since: since ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const presets = collectPresetEvents(ctx);
  if (presets.length > 0) {
    await fetcher("upsert_briefing_events_batch", {
      p_events: presetEventsToRpcPayload(presets),
    });
  }

  return result;
}

export async function generateSinceLastLoginJob(fetcher: RpcFetcher) {
  return fetcher("generate_briefing_since_last_login", {});
}

export async function generateDailyBriefJob(fetcher: RpcFetcher) {
  return fetcher("generate_briefing_daily", {});
}

export async function markBriefingViewedJob(fetcher: RpcFetcher, summaryId?: string) {
  return fetcher("mark_briefing_viewed", { p_summary_id: summaryId ?? null });
}
