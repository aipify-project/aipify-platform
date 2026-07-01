export const WEBSITE_COMPANION_WINDOW_SCHEMA_VERSION = 1;
export const WEBSITE_COMPANION_WINDOW_STORAGE_KEY = "aipify-website-companion-window";

export const WEBSITE_COMPANION_WINDOW_DESKTOP_BREAKPOINT_PX = 768;
export const WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_WIDTH_PX = 360;
export const WEBSITE_COMPANION_WINDOW_DESKTOP_MAX_WIDTH_PX = 720;
export const WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_HEIGHT_PX = 420;
export const WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX = 16;
export const WEBSITE_COMPANION_WINDOW_TOGGLE_RESERVE_PX = 80;
export const WEBSITE_COMPANION_WINDOW_HEADER_MIN_VISIBLE_PX = 48;
export const WEBSITE_COMPANION_WINDOW_DEFAULT_WIDTH_PX = 460;
export const WEBSITE_COMPANION_WINDOW_DEFAULT_HEIGHT_PX = 680;

export type CompanionViewport = {
  width: number;
  height: number;
};

export type CompanionWindowGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CompanionWindowPersistedState = CompanionWindowGeometry & {
  schemaVersion: number;
};

type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

const RESET_LABELS: Record<string, string> = {
  en: "Reset size and position",
  no: "Tilbakestill størrelse og plassering",
  sv: "Återställ storlek och position",
  da: "Nulstil størrelse og placering",
  pl: "Resetuj rozmiar i pozycję",
  uk: "Скинути розмір і положення",
};

export function isWebsiteCompanionDesktopViewport(viewportWidth: number): boolean {
  return viewportWidth >= WEBSITE_COMPANION_WINDOW_DESKTOP_BREAKPOINT_PX;
}

export function shouldIgnoreWebsiteCompanionDesktopState(viewportWidth: number): boolean {
  return !isWebsiteCompanionDesktopViewport(viewportWidth);
}

export function getWebsiteCompanionWindowResetLabel(locale: string): string {
  const normalized = locale.trim().toLowerCase().split("-")[0];
  return RESET_LABELS[normalized] ?? RESET_LABELS.en;
}

export function getWebsiteCompanionWindowMaxWidth(viewport: CompanionViewport): number {
  const margin = WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX * 2;
  return Math.min(
    WEBSITE_COMPANION_WINDOW_DESKTOP_MAX_WIDTH_PX,
    Math.max(WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_WIDTH_PX, viewport.width - margin),
  );
}

export function getWebsiteCompanionWindowMaxHeight(viewport: CompanionViewport): number {
  const verticalMargin =
    WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX + WEBSITE_COMPANION_WINDOW_TOGGLE_RESERVE_PX;
  return Math.max(
    WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_HEIGHT_PX,
    viewport.height - verticalMargin,
  );
}

export function clampWebsiteCompanionWindowSize(
  width: number,
  height: number,
  viewport: CompanionViewport,
): Pick<CompanionWindowGeometry, "width" | "height"> {
  const maxWidth = getWebsiteCompanionWindowMaxWidth(viewport);
  const maxHeight = getWebsiteCompanionWindowMaxHeight(viewport);
  return {
    width: Math.min(maxWidth, Math.max(WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_WIDTH_PX, width)),
    height: Math.min(maxHeight, Math.max(WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_HEIGHT_PX, height)),
  };
}

export function clampWebsiteCompanionWindowPosition(
  x: number,
  y: number,
  size: Pick<CompanionWindowGeometry, "width" | "height">,
  viewport: CompanionViewport,
): Pick<CompanionWindowGeometry, "x" | "y"> {
  const margin = WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX;
  const minX = margin;
  const maxX = Math.max(margin, viewport.width - size.width - margin);
  const minY = margin;
  const maxY = Math.max(
    margin,
    viewport.height - WEBSITE_COMPANION_WINDOW_HEADER_MIN_VISIBLE_PX - margin,
  );

  const clampedX = Math.min(maxX, Math.max(minX, x));
  const clampedY = Math.min(maxY, Math.max(minY, y));

  return { x: clampedX, y: clampedY };
}

export function clampWebsiteCompanionWindowGeometry(
  geometry: CompanionWindowGeometry,
  viewport: CompanionViewport,
): CompanionWindowGeometry {
  const size = clampWebsiteCompanionWindowSize(geometry.width, geometry.height, viewport);
  const position = clampWebsiteCompanionWindowPosition(geometry.x, geometry.y, size, viewport);
  return { ...position, ...size };
}

export function getDefaultWebsiteCompanionWindowGeometry(
  viewport: CompanionViewport,
): CompanionWindowGeometry {
  const size = clampWebsiteCompanionWindowSize(
    WEBSITE_COMPANION_WINDOW_DEFAULT_WIDTH_PX,
    WEBSITE_COMPANION_WINDOW_DEFAULT_HEIGHT_PX,
    viewport,
  );
  const margin = WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX;
  const x = viewport.width - size.width - margin;
  const y = viewport.height - size.height - WEBSITE_COMPANION_WINDOW_TOGGLE_RESERVE_PX;
  return clampWebsiteCompanionWindowGeometry({ x, y, ...size }, viewport);
}

export function parseWebsiteCompanionWindowState(
  raw: string | null,
  viewport: CompanionViewport,
): CompanionWindowGeometry | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CompanionWindowPersistedState>;
    if (parsed.schemaVersion !== WEBSITE_COMPANION_WINDOW_SCHEMA_VERSION) return null;
    if (
      typeof parsed.x !== "number" ||
      typeof parsed.y !== "number" ||
      typeof parsed.width !== "number" ||
      typeof parsed.height !== "number" ||
      !Number.isFinite(parsed.x) ||
      !Number.isFinite(parsed.y) ||
      !Number.isFinite(parsed.width) ||
      !Number.isFinite(parsed.height)
    ) {
      return null;
    }
    return clampWebsiteCompanionWindowGeometry(
      {
        x: parsed.x,
        y: parsed.y,
        width: parsed.width,
        height: parsed.height,
      },
      viewport,
    );
  } catch {
    return null;
  }
}

export function serializeWebsiteCompanionWindowState(
  geometry: CompanionWindowGeometry,
): string {
  const payload: CompanionWindowPersistedState = {
    schemaVersion: WEBSITE_COMPANION_WINDOW_SCHEMA_VERSION,
    ...geometry,
  };
  return JSON.stringify(payload);
}

export function isWebsiteCompanionLocalStorageAvailable(storage?: StorageLike | null): boolean {
  if (!storage) return false;
  try {
    const probeKey = `${WEBSITE_COMPANION_WINDOW_STORAGE_KEY}__probe`;
    storage.setItem(probeKey, "1");
    storage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
}

export function readWebsiteCompanionWindowState(
  storage: StorageLike,
  viewport: CompanionViewport,
): CompanionWindowGeometry {
  if (!isWebsiteCompanionLocalStorageAvailable(storage)) {
    return getDefaultWebsiteCompanionWindowGeometry(viewport);
  }
  const stored = parseWebsiteCompanionWindowState(
    storage.getItem(WEBSITE_COMPANION_WINDOW_STORAGE_KEY),
    viewport,
  );
  return stored ?? getDefaultWebsiteCompanionWindowGeometry(viewport);
}

export function writeWebsiteCompanionWindowState(
  storage: StorageLike,
  geometry: CompanionWindowGeometry,
  viewport: CompanionViewport,
): void {
  if (!isWebsiteCompanionLocalStorageAvailable(storage)) return;
  const clamped = clampWebsiteCompanionWindowGeometry(geometry, viewport);
  storage.setItem(
    WEBSITE_COMPANION_WINDOW_STORAGE_KEY,
    serializeWebsiteCompanionWindowState(clamped),
  );
}

export function clearWebsiteCompanionWindowState(storage: StorageLike): void {
  if (!isWebsiteCompanionLocalStorageAvailable(storage)) return;
  storage.removeItem(WEBSITE_COMPANION_WINDOW_STORAGE_KEY);
}

export function isWebsiteCompanionPointerEventsSupported(globalObject?: {
  window?: { PointerEvent?: unknown };
}): boolean {
  return typeof globalObject?.window?.PointerEvent === "function";
}

export function shouldUseWebsiteCompanionFloatingWindow(input: {
  viewportWidth: number;
  pointerEventsSupported: boolean;
}): boolean {
  return (
    isWebsiteCompanionDesktopViewport(input.viewportWidth) && input.pointerEventsSupported
  );
}

export function reconcileWebsiteCompanionWindowGeometry(
  geometry: CompanionWindowGeometry,
  viewport: CompanionViewport,
): CompanionWindowGeometry {
  return clampWebsiteCompanionWindowGeometry(geometry, viewport);
}

export function applyWebsiteCompanionWindowDragDelta(
  start: CompanionWindowGeometry,
  deltaX: number,
  deltaY: number,
  viewport: CompanionViewport,
): CompanionWindowGeometry {
  return clampWebsiteCompanionWindowGeometry(
    {
      ...start,
      x: start.x + deltaX,
      y: start.y + deltaY,
    },
    viewport,
  );
}

export function applyWebsiteCompanionWindowResizeDelta(
  start: CompanionWindowGeometry,
  deltaWidth: number,
  deltaHeight: number,
  viewport: CompanionViewport,
): CompanionWindowGeometry {
  return clampWebsiteCompanionWindowGeometry(
    {
      ...start,
      width: start.width + deltaWidth,
      height: start.height + deltaHeight,
    },
    viewport,
  );
}

export function canStartWebsiteCompanionWindowDrag(target: {
  closest: (selector: string) => Element | null;
}): boolean {
  if (!target.closest("[data-companion-window-drag-handle]")) return false;
  if (target.closest("[data-companion-window-no-drag]")) return false;
  if (target.closest("[data-companion-window-resize-handle]")) return false;
  if (target.closest("button, a, input, textarea, select, label")) return false;
  return true;
}
