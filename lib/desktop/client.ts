import type { CommandCenterBundle } from "@/lib/notification/command-center-state";
import { DESKTOP_SESSION_HEADER, formatBearerToken } from "./security";

export const DESKTOP_API_PREFIX = "/api/desktop";

export type DesktopClientConfig = {
  baseUrl: string;
  sessionToken: string;
};

export type DesktopSessionResponse = {
  session_token: string;
  client_id: string;
  expires_at: string;
  platform: string;
};

export async function fetchCommandCenter(
  config: DesktopClientConfig
): Promise<CommandCenterBundle> {
  const res = await fetch(`${config.baseUrl}${DESKTOP_API_PREFIX}/command-center`, {
    headers: {
      [DESKTOP_SESSION_HEADER]: formatBearerToken(config.sessionToken),
    },
  });
  if (!res.ok) {
    throw new Error(`Command center fetch failed: ${res.status}`);
  }
  return (await res.json()) as CommandCenterBundle;
}

export async function performDesktopQuickAction(
  config: DesktopClientConfig,
  actionId: string,
  notificationId?: string
): Promise<unknown> {
  const res = await fetch(`${config.baseUrl}${DESKTOP_API_PREFIX}/quick-action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [DESKTOP_SESSION_HEADER]: formatBearerToken(config.sessionToken),
    },
    body: JSON.stringify({ action_id: actionId, notification_id: notificationId }),
  });
  if (!res.ok) {
    throw new Error(`Quick action failed: ${res.status}`);
  }
  return res.json();
}

export async function revokeDesktopSession(
  config: DesktopClientConfig
): Promise<void> {
  await fetch(`${config.baseUrl}${DESKTOP_API_PREFIX}/sessions/revoke`, {
    method: "POST",
    headers: {
      [DESKTOP_SESSION_HEADER]: formatBearerToken(config.sessionToken),
    },
  });
}
