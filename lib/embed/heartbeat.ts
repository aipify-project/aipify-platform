import {
  DEFAULT_HEARTBEAT_INTERVAL_MINUTES,
  INSTALL_API_PREFIX,
  type HeartbeatStatus,
} from "@/lib/install";

export type HeartbeatPayload = {
  installation_token: string;
  status: HeartbeatStatus;
  details?: Record<string, unknown>;
};

/** Layer 3 — embedded heartbeat agent endpoint. */
export const HEARTBEAT_ENDPOINT = `${INSTALL_API_PREFIX}/heartbeat`;

export async function sendInstallationHeartbeat(
  payload: HeartbeatPayload
): Promise<Response> {
  return fetch(HEARTBEAT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function getHeartbeatIntervalMs(
  minutes: number = DEFAULT_HEARTBEAT_INTERVAL_MINUTES
): number {
  return minutes * 60 * 1000;
}
