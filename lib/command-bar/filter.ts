import type { CommandBarItem } from "./types";

function haystackForItem(item: CommandBarItem): string {
  return [item.label, item.description ?? "", item.href ?? "", ...(item.keywords ?? [])]
    .join(" ")
    .toLowerCase();
}

export function filterCommandItems(items: CommandBarItem[], query: string): CommandBarItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => haystackForItem(item).includes(q));
}

export function rankCommandItems(items: CommandBarItem[], query: string): CommandBarItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return [...items].sort((a, b) => scoreItem(a, q) - scoreItem(b, q));
}

function scoreItem(item: CommandBarItem, query: string): number {
  const label = item.label.toLowerCase();
  if (label === query) return 0;
  if (label.startsWith(query)) return 1;
  if (label.includes(query)) return 2;
  if (item.keywords?.some((keyword) => keyword.toLowerCase().includes(query))) return 3;
  return 4;
}
