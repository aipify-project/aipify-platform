import type { WebsiteKompisEmbedLocale } from "@/lib/marketing/website-kompis-embed";

export const WEBSITE_KOMPIS_EMBED_SESSION_STORAGE_PREFIX =
  "aipify.wk.session.v1" as const;
export const WEBSITE_KOMPIS_EMBED_SESSION_MAX_MESSAGES = 40;
export const WEBSITE_KOMPIS_EMBED_SESSION_MAX_AGE_MS = 6 * 60 * 60 * 1000;
export const WEBSITE_KOMPIS_EMBED_SESSION_MAX_CHARS = 48_000;

export type WebsiteKompisEmbedSessionMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      text: string;
      sources?: Array<{ title: string; href?: string | null }>;
      answerId?: string | null;
      feedbackPersistenceReady?: boolean;
      failed?: false;
    }
  | {
      id: string;
      role: "assistant";
      failed: true;
      retryQuestion: string;
    };

export type WebsiteKompisEmbedSessionState = {
  v: 1;
  installId: string;
  domain: string;
  open: boolean;
  locale: WebsiteKompisEmbedLocale;
  messages: WebsiteKompisEmbedSessionMessage[];
  updatedAt: number;
};

export function buildWebsiteKompisEmbedSessionStorageKey(
  installId: string,
  domain: string,
): string {
  return `${WEBSITE_KOMPIS_EMBED_SESSION_STORAGE_PREFIX}:${installId}:${domain}`;
}

function estimateSessionChars(state: WebsiteKompisEmbedSessionState): number {
  try {
    return JSON.stringify(state).length;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

export function sanitizeWebsiteKompisEmbedSessionState(
  value: unknown,
  expected: { installId: string; domain: string },
  nowMs: number = Date.now(),
): WebsiteKompisEmbedSessionState | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (record.v !== 1) return null;
  if (record.installId !== expected.installId || record.domain !== expected.domain) {
    return null;
  }
  if (typeof record.updatedAt !== "number" || !Number.isFinite(record.updatedAt)) {
    return null;
  }
  if (nowMs - record.updatedAt > WEBSITE_KOMPIS_EMBED_SESSION_MAX_AGE_MS) {
    return null;
  }
  if (typeof record.open !== "boolean") return null;
  if (typeof record.locale !== "string") return null;
  if (!Array.isArray(record.messages)) return null;

  const messages: WebsiteKompisEmbedSessionMessage[] = [];
  for (const entry of record.messages.slice(-WEBSITE_KOMPIS_EMBED_SESSION_MAX_MESSAGES)) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const row = entry as Record<string, unknown>;
    if (typeof row.id !== "string" || !row.id.trim()) continue;
    if (row.role === "user" && typeof row.text === "string" && row.text.trim()) {
      messages.push({ id: row.id, role: "user", text: row.text.slice(0, 4000) });
      continue;
    }
    if (row.role === "assistant" && row.failed === true && typeof row.retryQuestion === "string") {
      messages.push({
        id: row.id,
        role: "assistant",
        failed: true,
        retryQuestion: row.retryQuestion.slice(0, 1000),
      });
      continue;
    }
    if (row.role === "assistant" && typeof row.text === "string" && row.text.trim()) {
      const sources = Array.isArray(row.sources)
        ? row.sources
            .filter((source) => source && typeof source === "object")
            .map((source) => {
              const s = source as Record<string, unknown>;
              return {
                title: typeof s.title === "string" ? s.title.slice(0, 200) : "Source",
                href: typeof s.href === "string" ? s.href.slice(0, 500) : null,
              };
            })
            .slice(0, 8)
        : undefined;
      messages.push({
        id: row.id,
        role: "assistant",
        text: row.text.slice(0, 8000),
        sources,
        answerId: typeof row.answerId === "string" ? row.answerId.slice(0, 80) : null,
        feedbackPersistenceReady:
          row.feedbackPersistenceReady === true && typeof row.answerId === "string",
      });
    }
  }

  const state: WebsiteKompisEmbedSessionState = {
    v: 1,
    installId: expected.installId,
    domain: expected.domain,
    open: record.open,
    locale: record.locale as WebsiteKompisEmbedLocale,
    messages,
    updatedAt: record.updatedAt,
  };

  if (estimateSessionChars(state) > WEBSITE_KOMPIS_EMBED_SESSION_MAX_CHARS) {
    return {
      ...state,
      messages: state.messages.slice(-12),
    };
  }
  return state;
}

export function readWebsiteKompisEmbedSession(
  storage: Pick<Storage, "getItem"> | null | undefined,
  expected: { installId: string; domain: string },
): WebsiteKompisEmbedSessionState | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(
      buildWebsiteKompisEmbedSessionStorageKey(expected.installId, expected.domain),
    );
    if (!raw) return null;
    return sanitizeWebsiteKompisEmbedSessionState(JSON.parse(raw), expected);
  } catch {
    return null;
  }
}

export function writeWebsiteKompisEmbedSession(
  storage: Pick<Storage, "setItem" | "removeItem"> | null | undefined,
  state: WebsiteKompisEmbedSessionState,
): boolean {
  if (!storage) return false;
  const key = buildWebsiteKompisEmbedSessionStorageKey(state.installId, state.domain);
  try {
    const sanitized = sanitizeWebsiteKompisEmbedSessionState(state, {
      installId: state.installId,
      domain: state.domain,
    });
    if (!sanitized) {
      storage.removeItem(key);
      return false;
    }
    storage.setItem(key, JSON.stringify(sanitized));
    return true;
  } catch {
    try {
      storage.removeItem(key);
    } catch {
      /* ignore blocked storage */
    }
    return false;
  }
}
