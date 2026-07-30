import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export async function assertKompisOperatorRateLimit(input: {
  supabase: SupabaseClient;
  userId: string;
  organizationId: string;
  kind: "plan" | "execute" | "write" | "live" | "health";
}): Promise<{ allowed: boolean; resetInSeconds?: number }> {
  const limits =
    input.kind === "write"
      ? { perMinute: 10, perHour: 40 }
      : input.kind === "execute"
        ? { perMinute: 20, perHour: 120 }
        : input.kind === "live"
          ? { perMinute: 12, perHour: 80 }
          : input.kind === "health"
            ? { perMinute: 4, perHour: 20 }
            : { perMinute: 30, perHour: 200 };

  const minuteKey = `kompis:${input.kind}:user:${input.userId}:org:${input.organizationId}:m`;
  const hourKey = `kompis:${input.kind}:user:${input.userId}:org:${input.organizationId}:h`;

  const minute = await input.supabase.rpc("_kompis_operator_rate_limit_check", {
    p_bucket: minuteKey,
    p_limit: limits.perMinute,
    p_window_seconds: 60,
  });
  if (minute.error) return { allowed: true };
  const minuteData = (minute.data ?? {}) as { allowed?: boolean; reset_in_seconds?: number };
  if (minuteData.allowed === false) {
    return { allowed: false, resetInSeconds: minuteData.reset_in_seconds ?? 60 };
  }

  const hour = await input.supabase.rpc("_kompis_operator_rate_limit_check", {
    p_bucket: hourKey,
    p_limit: limits.perHour,
    p_window_seconds: 3600,
  });
  if (hour.error) return { allowed: true };
  const hourData = (hour.data ?? {}) as { allowed?: boolean; reset_in_seconds?: number };
  if (hourData.allowed === false) {
    return { allowed: false, resetInSeconds: hourData.reset_in_seconds ?? 3600 };
  }
  return { allowed: true };
}
