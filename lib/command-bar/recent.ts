import type { CommandBarPortal, CommandBarRecentEntry } from "./types";

const STORAGE_PREFIX = "aipify-command-bar-recent";
const MAX_RECENT = 8;

function storageKey(portal: CommandBarPortal): string {
  return `${STORAGE_PREFIX}:${portal}`;
}

export function loadRecentDestinations(portal: CommandBarPortal): CommandBarRecentEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(portal));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CommandBarRecentEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => entry.id && entry.label && entry.href)
      .sort((a, b) => b.visitedAt - a.visitedAt)
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

export function recordRecentDestination(
  portal: CommandBarPortal,
  entry: Omit<CommandBarRecentEntry, "visitedAt">
): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadRecentDestinations(portal).filter((item) => item.id !== entry.id);
    const next: CommandBarRecentEntry[] = [
      { ...entry, visitedAt: Date.now() },
      ...existing,
    ].slice(0, MAX_RECENT);
    window.localStorage.setItem(storageKey(portal), JSON.stringify(next));
  } catch {
    // Ignore storage failures — command bar still works without history.
  }
}
