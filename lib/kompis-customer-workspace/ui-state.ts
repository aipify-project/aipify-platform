const STORAGE_KEY = "aipify.kompis.global.ui.v1";

export type KompisGlobalUiPersisted = {
  open: boolean;
  updatedAt: number;
};

export function readKompisGlobalUiState(): KompisGlobalUiPersisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<KompisGlobalUiPersisted>;
    if (typeof parsed.open !== "boolean") return null;
    return {
      open: parsed.open,
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

export function writeKompisGlobalUiState(open: boolean): void {
  if (typeof window === "undefined") return;
  try {
    const payload: KompisGlobalUiPersisted = { open, updatedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota / private mode
  }
}
