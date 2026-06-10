const API_PREFIX = "/api/desktop";

export type CommandCenterData = {
  has_customer: boolean;
  presence_status?: string;
  health_overview?: { score: number; label: string };
  executive_feed?: Array<{ time_label: string; message: string }>;
  morning_briefing?: {
    greeting: string;
    headline: string;
    bullets: string[];
    timezone?: string;
    period?: string;
  };
  notifications?: Array<{ id: string; title: string; level: string }>;
  pending_approvals?: number;
  unread_count?: number;
  quick_actions?: Array<{ id: string; label: string }>;
};

export async function fetchCommandCenter(
  baseUrl: string,
  sessionToken: string
): Promise<CommandCenterData> {
  const res = await fetch(`${baseUrl}${API_PREFIX}/command-center`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<CommandCenterData>;
}

export async function runQuickAction(
  baseUrl: string,
  sessionToken: string,
  actionId: string
): Promise<void> {
  await fetch(`${baseUrl}${API_PREFIX}/quick-action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ action_id: actionId }),
  });
}

export const STATUS_COLORS: Record<string, string> = {
  healthy: "#22c55e",
  attention: "#f97316",
  critical: "#ef4444",
  offline: "#9ca3af",
};
