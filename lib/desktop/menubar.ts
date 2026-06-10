/** Menu bar presence status (Phase 27 — macOS Phase 1). */

export const MENUBAR_STATUS = ["healthy", "attention", "critical", "offline"] as const;

export type MenubarStatus = (typeof MENUBAR_STATUS)[number];

export const MENUBAR_STATUS_COLORS: Record<MenubarStatus, string> = {
  healthy: "#22c55e",
  attention: "#f97316",
  critical: "#ef4444",
  offline: "#9ca3af",
};

export const MENUBAR_STATUS_LABELS: Record<MenubarStatus, string> = {
  healthy: "Healthy",
  attention: "Attention recommended",
  critical: "Critical issue detected",
  offline: "Offline or paused",
};

export function deriveMenubarStatus(
  healthScore: number | null | undefined,
  connected: boolean
): MenubarStatus {
  if (!connected) return "offline";
  if (healthScore == null) return "healthy";
  if (healthScore < 70) return "critical";
  if (healthScore < 85) return "attention";
  return "healthy";
}
