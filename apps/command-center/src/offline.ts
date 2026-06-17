const OFFLINE_KEY = "aipify_companion_offline";

export type OfflineItem = {
  id: string;
  type: "note" | "task" | "reminder" | "briefing";
  title: string;
  body: string;
  updated_at: string;
};

export function loadOfflineItems(): OfflineItem[] {
  try {
    const raw = localStorage.getItem(OFFLINE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OfflineItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOfflineItem(item: Omit<OfflineItem, "id" | "updated_at">) {
  const items = loadOfflineItems();
  const next: OfflineItem = {
    ...item,
    id: crypto.randomUUID(),
    updated_at: new Date().toISOString(),
  };
  items.unshift(next);
  localStorage.setItem(OFFLINE_KEY, JSON.stringify(items.slice(0, 100)));
  return next;
}

export function isFirstRunComplete(): boolean {
  return localStorage.getItem("aipify_companion_first_run") === "1";
}

export function markFirstRunComplete() {
  localStorage.setItem("aipify_companion_first_run", "1");
}

export function detectPlatform(): "macos" | "windows" | "linux" {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("linux")) return "linux";
  return "macos";
}

export function defaultHotkey(): string {
  const platform = detectPlatform();
  if (platform === "macos") return "Command+Space";
  return "Control+Space";
}
