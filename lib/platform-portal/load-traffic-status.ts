import { listCspPlatformPartners } from "@/lib/certified-sales-partner/partner-admin-detail";
import { resolveAuthoritativeTimeZone } from "@/lib/platform-presentation-quality/bcp47";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { loadPlatformLivePresenceSnapshot } from "@/lib/platform-portal/live-presence/load-presence-snapshot";
import {
  buildPlatformTrafficStatus,
  countCreatedOnCalendarDay,
  countNewAppCustomersToday,
  type PlatformTrafficStatus,
  type TrafficCount,
} from "@/lib/platform-portal/traffic-status";
import { resolveVisitorTodayFromGa4 } from "@/lib/platform-portal/visitor-today-ga4-adapter";
import { visitorTodayToTrafficCount } from "@/lib/platform-portal/visitor-today-contract";

const SOURCE_UNAVAILABLE: TrafficCount = { state: "unavailable", reason: "source_unavailable" };
const NOT_MEASURED: TrafficCount = { state: "unavailable", reason: "not_measured" };
const SELLER_LIST_LIMIT = 500;

async function loadCustomerEnvironments(
  customerIds: string[],
): Promise<Map<string, string | null> | null> {
  if (customerIds.length === 0) return new Map();
  try {
    const admin = createServiceRoleClient();
    const map = new Map<string, string | null>();
    for (let index = 0; index < customerIds.length; index += 100) {
      const chunk = customerIds.slice(index, index + 100);
      const { data, error } = await admin
        .from("customers")
        .select("id, environment_type")
        .in("id", chunk);
      if (error || !Array.isArray(data)) return null;
      for (const row of data) {
        const record = row as { id?: unknown; environment_type?: unknown };
        if (typeof record.id !== "string") continue;
        map.set(
          record.id,
          typeof record.environment_type === "string" ? record.environment_type : null,
        );
      }
    }
    return map;
  } catch {
    return null;
  }
}

async function loadNewAppCustomersToday(now: Date, timeZone: string): Promise<TrafficCount> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_platform_portal_customers");
    if (error) return SOURCE_UNAVAILABLE;
    const root =
      data && typeof data === "object" && !Array.isArray(data)
        ? (data as { customers?: unknown })
        : null;
    const customers = Array.isArray(root?.customers) ? root.customers : null;
    if (!customers) return SOURCE_UNAVAILABLE;
    const ids = customers.flatMap((row) => {
      const id =
        row && typeof row === "object" ? (row as { customer_id?: unknown }).customer_id : null;
      return typeof id === "string" && id ? [id] : [];
    });
    if (ids.length !== customers.length) return SOURCE_UNAVAILABLE;
    const environments = await loadCustomerEnvironments(ids);
    return countNewAppCustomersToday({
      registry: data,
      environmentByCustomerId: environments,
      now,
      timeZone,
    });
  } catch {
    return SOURCE_UNAVAILABLE;
  }
}

async function loadNewSellersToday(now: Date, timeZone: string): Promise<TrafficCount> {
  try {
    const listed = await listCspPlatformPartners();
    if (listed.kind !== "ok") return SOURCE_UNAVAILABLE;
    return countCreatedOnCalendarDay({
      rows: listed.partners.map((partner) => ({ created_at: partner.created_at })),
      now,
      timeZone,
      truncated: listed.partners.length >= SELLER_LIST_LIMIT,
    });
  } catch {
    return SOURCE_UNAVAILABLE;
  }
}

/** Server read for the Platform Admin global status bar. Fail closed for unmeasured. */
export async function loadPlatformTrafficStatus(now = new Date()): Promise<PlatformTrafficStatus> {
  const dayTimeZone = resolveAuthoritativeTimeZone();
  const [newAppCustomersToday, newSellersToday, presence, visitorToday] = await Promise.all([
    loadNewAppCustomersToday(now, dayTimeZone),
    loadNewSellersToday(now, dayTimeZone),
    loadPlatformLivePresenceSnapshot(),
    resolveVisitorTodayFromGa4({ now, dayTimeZone }),
  ]);

  const presenceMeasured = presence?.measured === true;
  const visitorsToday = visitorTodayToTrafficCount(visitorToday);
  const visitorsSource =
    visitorToday.source === "ga4_data_api"
      ? `ga4_data_api · ${visitorToday.freshness}${visitorToday.note ? ` · ${visitorToday.note}` : ""}`
      : visitorToday.source === "fixture"
        ? "fixture (tests only)"
        : `Agent 3 visitor-today · ${visitorToday.source}/${visitorToday.freshness}${
            visitorToday.note ? ` · ${visitorToday.note}` : ""
          }`;

  return buildPlatformTrafficStatus({
    checkedAt: now.toISOString(),
    dayTimeZone,
    newAppCustomersToday,
    newSellersToday,
    appCustomersOnline: presenceMeasured ? presence.appCustomersOnline : NOT_MEASURED,
    sellersOnline: presenceMeasured ? presence.sellersOnline : NOT_MEASURED,
    signedInUsers: presenceMeasured ? presence.signedInUsers : NOT_MEASURED,
    visitorsToday,
    presenceMeasured,
    visitorsSource,
  });
}
