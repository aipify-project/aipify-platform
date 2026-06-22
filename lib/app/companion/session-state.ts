import { COMPANION_UI_SESSION_STORAGE_KEY } from "./constants";

export type CompanionUiSession = {
  version: 1;
  panelOpen: boolean;
  activeConversationId: string | null;
  draftText: string;
  scrollTop: number;
  organizationKey: string | null;
  pathname: string | null;
  updatedAt: number;
};

const EMPTY_SESSION: CompanionUiSession = {
  version: 1,
  panelOpen: false,
  activeConversationId: null,
  draftText: "",
  scrollTop: 0,
  organizationKey: null,
  pathname: null,
  updatedAt: 0,
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function normalizeSession(raw: unknown): CompanionUiSession | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<CompanionUiSession>;
  if (value.version !== 1) return null;
  return {
    version: 1,
    panelOpen: value.panelOpen === true,
    activeConversationId:
      typeof value.activeConversationId === "string" ? value.activeConversationId : null,
    draftText: typeof value.draftText === "string" ? value.draftText : "",
    scrollTop: typeof value.scrollTop === "number" && Number.isFinite(value.scrollTop) ? value.scrollTop : 0,
    organizationKey: typeof value.organizationKey === "string" ? value.organizationKey : null,
    pathname: typeof value.pathname === "string" ? value.pathname : null,
    updatedAt: typeof value.updatedAt === "number" ? value.updatedAt : 0,
  };
}

export function readCompanionUiSession(organizationKey?: string | null): CompanionUiSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = sessionStorage.getItem(COMPANION_UI_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = normalizeSession(JSON.parse(raw));
    if (!parsed) return null;
    if (
      organizationKey &&
      parsed.organizationKey &&
      parsed.organizationKey !== organizationKey
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeCompanionUiSession(session: CompanionUiSession): void {
  if (!isBrowser()) return;
  try {
    sessionStorage.setItem(
      COMPANION_UI_SESSION_STORAGE_KEY,
      JSON.stringify({ ...session, version: 1, updatedAt: Date.now() }),
    );
  } catch {
    // Session storage may be unavailable — ignore silently.
  }
}

export function patchCompanionUiSession(
  patch: Partial<Omit<CompanionUiSession, "version">>,
  organizationKey?: string | null,
): CompanionUiSession {
  const current =
    readCompanionUiSession(organizationKey) ??
    readCompanionUiSession() ??
    { ...EMPTY_SESSION, organizationKey: organizationKey ?? null };
  const next: CompanionUiSession = {
    ...current,
    ...patch,
    version: 1,
    organizationKey: organizationKey ?? patch.organizationKey ?? current.organizationKey,
    updatedAt: Date.now(),
  };
  writeCompanionUiSession(next);
  return next;
}

export function clearCompanionUiSession(): void {
  if (!isBrowser()) return;
  try {
    sessionStorage.removeItem(COMPANION_UI_SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}
