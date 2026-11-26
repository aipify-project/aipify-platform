/**
 * Server-only. Visit counts for a partner's OWN sales links.
 *
 * Callers pass link ids that came from the partner's own Core overview (`csp_get_partner_overview`,
 * scoped to the signed-in partner) — never ids from the request. Counts are read with the service
 * role from `csp_attribution_events` (counts only; no visitor data exists in that table).
 * A failed or truncated read returns `null` so the UI says "not reported" rather than inventing 0.
 */

type EventRow = { link_id?: unknown; event_type?: unknown };

type EventsQuery = PromiseLike<{ data: unknown; error: unknown }>;

/** Minimal client surface used here — satisfied by the Supabase service-role client and by test fakes. */
export type CspLinkStatsClient = {
  from(table: "csp_attribution_events"): {
    select(columns: string): {
      in(column: string, values: string[]): {
        limit(count: number): EventsQuery;
      };
    };
  };
};

export const CSP_LINK_STATS_EVENT_LIMIT = 20000;

export async function loadOwnLinkVisitCounts(
  admin: CspLinkStatsClient,
  ownLinkIds: readonly string[],
): Promise<Map<string, number> | null> {
  const ids = [...new Set(ownLinkIds.filter((id) => typeof id === "string" && id.length > 0))];
  if (ids.length === 0) return new Map();
  try {
    const { data, error } = await admin
      .from("csp_attribution_events")
      .select("link_id, event_type")
      .in("link_id", ids)
      .limit(CSP_LINK_STATS_EVENT_LIMIT);
    if (error || !Array.isArray(data)) return null;
    // Truncated read → never present a partial number as a total.
    if (data.length >= CSP_LINK_STATS_EVENT_LIMIT) return null;
    const counts = new Map<string, number>(ids.map((id) => [id, 0]));
    for (const raw of data as EventRow[]) {
      const linkId = typeof raw.link_id === "string" ? raw.link_id : null;
      if (!linkId || raw.event_type !== "click" || !counts.has(linkId)) continue;
      counts.set(linkId, (counts.get(linkId) ?? 0) + 1);
    }
    return counts;
  } catch {
    return null;
  }
}
