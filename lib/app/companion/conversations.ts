import { COMPANION_CONVERSATIONS_STORAGE_KEY } from "./constants";
import type { CompanionChatMessage, CompanionConversationPreview } from "./types";

const MAX_RECENT = 8;

function normalizeTitle(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, " ");
}

export function loadRecentConversations(): CompanionConversationPreview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPANION_CONVERSATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CompanionConversationPreview[];
    if (!Array.isArray(parsed)) return [];
    return dedupeConversations(parsed).slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

export function dedupeConversations(
  conversations: CompanionConversationPreview[],
): CompanionConversationPreview[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const result: CompanionConversationPreview[] = [];

  for (const conv of conversations) {
    if (!conv?.id || seenIds.has(conv.id)) continue;
    const titleKey = normalizeTitle(conv.title);
    if (seenTitles.has(titleKey)) continue;
    seenIds.add(conv.id);
    seenTitles.add(titleKey);
    result.push(conv);
  }

  return result.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveRecentConversation(entry: CompanionConversationPreview): CompanionConversationPreview[] {
  const withoutDuplicate = loadRecentConversations().filter(
    (c) => c.id !== entry.id && normalizeTitle(c.title) !== normalizeTitle(entry.title),
  );
  const next = dedupeConversations([entry, ...withoutDuplicate]).slice(0, MAX_RECENT);
  localStorage.setItem(COMPANION_CONVERSATIONS_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function deleteRecentConversation(conversationId: string): CompanionConversationPreview[] {
  const next = loadRecentConversations().filter((c) => c.id !== conversationId);
  localStorage.setItem(COMPANION_CONVERSATIONS_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function createConversationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `conv-${crypto.randomUUID()}`;
  }
  return `conv-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildConversationPreview(input: {
  id: string;
  title: string;
  preview: string;
  locale: string;
  messages: CompanionChatMessage[];
  pinned?: boolean;
}): CompanionConversationPreview {
  return {
    id: input.id,
    title: input.title.length > 48 ? `${input.title.slice(0, 48)}…` : input.title,
    preview: input.preview,
    pinned: input.pinned ?? false,
    updatedAt: Date.now(),
    locale: input.locale,
    messages: input.messages,
  };
}
