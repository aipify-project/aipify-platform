/**
 * Optional client helper for Agents 1/2 to mount after SQL apply + owner approval.
 * Not imported by Platform Admin shell — avoids APP/SELLER file overlap until coordinated.
 */

import {
  PLATFORM_LIVE_PRESENCE_HEARTBEAT_API_PATH,
  PLATFORM_LIVE_PRESENCE_HEARTBEAT_MIN_INTERVAL_MS,
  type PlatformLivePresencePortal,
} from "./constants";

export function createLivePresenceClientInstanceId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `lp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function sendLivePresenceHeartbeat(input: {
  portal: PlatformLivePresencePortal;
  clientInstanceId: string;
  signal?: AbortSignal;
}): Promise<{ ok: boolean; status: number; throttled?: boolean }> {
  const response = await fetch(PLATFORM_LIVE_PRESENCE_HEARTBEAT_API_PATH, {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    signal: input.signal,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      portal: input.portal,
      clientInstanceId: input.clientInstanceId,
    }),
  });

  if (!response.ok) {
    return { ok: false, status: response.status };
  }

  const payload: unknown = await response.json().catch(() => null);
  const result =
    payload && typeof payload === "object"
      ? (payload as { result?: { throttled?: unknown } }).result
      : null;
  return {
    ok: true,
    status: response.status,
    throttled: Boolean(result?.throttled),
  };
}

export { PLATFORM_LIVE_PRESENCE_HEARTBEAT_MIN_INTERVAL_MS };
