export const WEBSITE_COMPANION_WINDOW_LEGACY_SCHEMA_VERSION = 1;
export const WEBSITE_COMPANION_WINDOW_SCHEMA_VERSION = 2;
export const WEBSITE_COMPANION_WINDOW_STORAGE_KEY = "aipify-website-companion-window";

export const WEBSITE_COMPANION_WINDOW_DESKTOP_BREAKPOINT_PX = 768;
export const WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_WIDTH_PX = 360;
export const WEBSITE_COMPANION_WINDOW_DESKTOP_MAX_WIDTH_PX = 1080;
export const WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_HEIGHT_PX = 420;
export const WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX = 16;
export const WEBSITE_COMPANION_WINDOW_TOGGLE_RESERVE_PX = 80;
export const WEBSITE_COMPANION_WINDOW_HEADER_MIN_VISIBLE_PX = 48;
export const WEBSITE_COMPANION_WINDOW_MAX_HEIGHT_TOP_MARGIN_PX = 48;
export const WEBSITE_COMPANION_WINDOW_MAX_HEIGHT_DVH_RATIO = 0.92;
export const WEBSITE_COMPANION_WINDOW_DEFAULT_WIDTH_PX = 540;
export const WEBSITE_COMPANION_WINDOW_DEFAULT_HEIGHT_PX = 740;

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

export type CompanionWindowLayoutState = {
  geometry: CompanionWindowGeometry;
  isMaximized: boolean;
  restoreState: CompanionWindowGeometry | null;
};

export type CompanionWindowPersistedState = CompanionWindowGeometry & {
  schemaVersion: number;
  isMaximized?: boolean;
  restoreState?: CompanionWindowGeometry | null;
};

/** @deprecated Use CompanionWindowLayoutState */
export type CompanionWindowPersistedStateV1 = CompanionWindowGeometry & {
  schemaVersion: typeof WEBSITE_COMPANION_WINDOW_LEGACY_SCHEMA_VERSION;
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

const MAXIMIZE_ARIA_LABELS: Record<string, string> = {
  en: "Maximize Companion window",
  no: "Maksimer Companion-vinduet",
  sv: "Maximera Companion-fönstret",
  da: "Maksimer Companion-vinduet",
  pl: "Maksymalizuj okno Companion",
  uk: "Розгорнути вікно Companion",
};

const RESTORE_ARIA_LABELS: Record<string, string> = {
  en: "Restore Companion window size",
  no: "Gjenopprett Companion-vinduets størrelse",
  sv: "Återställ Companion-fönstrets storlek",
  da: "Gendan Companion-vinduets størrelse",
  pl: "Przywróć rozmiar okna Companion",
  uk: "Відновити розмір вікна Companion",
};

function normalizeLocale(locale: string): string {
  return locale.trim().toLowerCase().split("-")[0];
}

function lookupLocaleLabel(labels: Record<string, string>, locale: string): string {
  const normalized = normalizeLocale(locale);
  return labels[normalized] ?? labels.en;
}

export function isWebsiteCompanionDesktopViewport(viewportWidth: number): boolean {
  return viewportWidth >= WEBSITE_COMPANION_WINDOW_DESKTOP_BREAKPOINT_PX;
}

export function shouldIgnoreWebsiteCompanionDesktopState(viewportWidth: number): boolean {
  return !isWebsiteCompanionDesktopViewport(viewportWidth);
}

export function getWebsiteCompanionWindowResetLabel(locale: string): string {
  return lookupLocaleLabel(RESET_LABELS, locale);
}

export function getWebsiteCompanionWindowMaximizeAriaLabel(locale: string): string {
  return lookupLocaleLabel(MAXIMIZE_ARIA_LABELS, locale);
}

export function getWebsiteCompanionWindowRestoreAriaLabel(locale: string): string {
  return lookupLocaleLabel(RESTORE_ARIA_LABELS, locale);
}

export function readWebsiteCompanionViewport(windowLike: {
  innerWidth: number;
  innerHeight: number;
  visualViewport?: {
    width: number;
    height: number;
    offsetLeft: number;
    offsetTop: number;
  } | null;
}): CompanionViewport {
  const visualViewport = windowLike.visualViewport;
  if (
    visualViewport &&
    Number.isFinite(visualViewport.width) &&
    Number.isFinite(visualViewport.height) &&
    visualViewport.width > 0 &&
    visualViewport.height > 0
  ) {
    return {
      width: visualViewport.width,
      height: visualViewport.height,
    };
  }

  return {
    width: windowLike.innerWidth,
    height: windowLike.innerHeight,
  };
}

export function getWebsiteCompanionWindowViewportOffset(windowLike: {
  visualViewport?: {
    offsetLeft: number;
    offsetTop: number;
  } | null;
}): Pick<CompanionWindowGeometry, "x" | "y"> {
  const visualViewport = windowLike.visualViewport;
  return {
    x: visualViewport?.offsetLeft ?? 0,
    y: visualViewport?.offsetTop ?? 0,
  };
}

export function getWebsiteCompanionWindowFitHeight(viewport: CompanionViewport): number {
  const margin = WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX;
  return Math.max(
    WEBSITE_COMPANION_WINDOW_HEADER_MIN_VISIBLE_PX,
    viewport.height - margin * 2,
  );
}

export function getWebsiteCompanionWindowMaxWidth(viewport: CompanionViewport): number {
  const margin = WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX * 2;
  return Math.min(
    WEBSITE_COMPANION_WINDOW_DESKTOP_MAX_WIDTH_PX,
    Math.max(WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_WIDTH_PX, viewport.width - margin),
  );
}

export function getWebsiteCompanionWindowMaxHeight(viewport: CompanionViewport): number {
  const fitHeight = getWebsiteCompanionWindowFitHeight(viewport);
  const dvhHeight = viewport.height * WEBSITE_COMPANION_WINDOW_MAX_HEIGHT_DVH_RATIO;
  const marginHeight = viewport.height - WEBSITE_COMPANION_WINDOW_MAX_HEIGHT_TOP_MARGIN_PX;
  const capped = Math.min(dvhHeight, marginHeight, fitHeight);
  const minHeight = Math.min(WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_HEIGHT_PX, fitHeight);
  return Math.max(minHeight, capped);
}

export function clampWebsiteCompanionWindowSize(
  width: number,
  height: number,
  viewport: CompanionViewport,
): Pick<CompanionWindowGeometry, "width" | "height"> {
  const maxWidth = getWebsiteCompanionWindowMaxWidth(viewport);
  const maxHeight = getWebsiteCompanionWindowMaxHeight(viewport);
  const minHeight = Math.min(WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_HEIGHT_PX, maxHeight);
  return {
    width: Math.min(maxWidth, Math.max(WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_WIDTH_PX, width)),
    height: Math.min(maxHeight, Math.max(minHeight, height)),
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
  const maxY = Math.max(margin, viewport.height - size.height - margin);

  return {
    x: Math.min(maxX, Math.max(minX, x)),
    y: Math.min(maxY, Math.max(minY, y)),
  };
}

export function isWebsiteCompanionWindowHeaderWithinViewport(
  geometry: CompanionWindowGeometry,
  viewport: CompanionViewport,
): boolean {
  const margin = WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX;
  return (
    geometry.y >= margin &&
    geometry.y <= viewport.height - WEBSITE_COMPANION_WINDOW_HEADER_MIN_VISIBLE_PX - margin
  );
}

export function isWebsiteCompanionWindowControlBandWithinViewport(
  geometry: CompanionWindowGeometry,
  viewport: CompanionViewport,
): boolean {
  return isWebsiteCompanionWindowHeaderWithinViewport(geometry, viewport);
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

export function getWebsiteCompanionWindowMaximizedGeometry(
  viewport: CompanionViewport,
): CompanionWindowGeometry {
  const margin = WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX;
  const size = clampWebsiteCompanionWindowSize(
    getWebsiteCompanionWindowMaxWidth(viewport),
    getWebsiteCompanionWindowMaxHeight(viewport),
    viewport,
  );
  return clampWebsiteCompanionWindowGeometry({ x: margin, y: margin, ...size }, viewport);
}

export function getWebsiteCompanionWindowResetLayout(
  viewport: CompanionViewport,
): CompanionWindowLayoutState {
  const geometry = getDefaultWebsiteCompanionWindowGeometry(viewport);
  return {
    geometry,
    isMaximized: false,
    restoreState: geometry,
  };
}

function isValidGeometry(value: unknown): value is CompanionWindowGeometry {
  if (!value || typeof value !== "object") return false;
  const candidate = value as CompanionWindowGeometry;
  return (
    typeof candidate.x === "number" &&
    typeof candidate.y === "number" &&
    typeof candidate.width === "number" &&
    typeof candidate.height === "number" &&
    Number.isFinite(candidate.x) &&
    Number.isFinite(candidate.y) &&
    Number.isFinite(candidate.width) &&
    Number.isFinite(candidate.height)
  );
}

function migrateLegacyWebsiteCompanionWindowState(
  parsed: Partial<CompanionWindowPersistedState>,
  viewport: CompanionViewport,
): CompanionWindowLayoutState | null {
  if (parsed.schemaVersion !== WEBSITE_COMPANION_WINDOW_LEGACY_SCHEMA_VERSION) return null;
  if (!isValidGeometry(parsed)) return null;
  const geometry = clampWebsiteCompanionWindowGeometry(
    {
      x: parsed.x,
      y: parsed.y,
      width: parsed.width,
      height: parsed.height,
    },
    viewport,
  );
  return {
    geometry,
    isMaximized: false,
    restoreState: geometry,
  };
}

export function parseWebsiteCompanionWindowLayoutState(
  raw: string | null,
  viewport: CompanionViewport,
): CompanionWindowLayoutState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CompanionWindowPersistedState>;
    if (parsed.schemaVersion === WEBSITE_COMPANION_WINDOW_LEGACY_SCHEMA_VERSION) {
      return migrateLegacyWebsiteCompanionWindowState(parsed, viewport);
    }
    if (parsed.schemaVersion !== WEBSITE_COMPANION_WINDOW_SCHEMA_VERSION) return null;
    const isMaximized = parsed.isMaximized === true;
    const rawRestoreState = parsed.restoreState;
    if (!isValidGeometry(parsed)) return null;

    const geometry = clampWebsiteCompanionWindowGeometry(
      {
        x: parsed.x,
        y: parsed.y,
        width: parsed.width,
        height: parsed.height,
      },
      viewport,
    );
    const restoreState = isValidGeometry(rawRestoreState)
      ? clampWebsiteCompanionWindowGeometry(rawRestoreState, viewport)
      : geometry;

    if (isMaximized) {
      return {
        geometry: getWebsiteCompanionWindowMaximizedGeometry(viewport),
        isMaximized: true,
        restoreState,
      };
    }

    return {
      geometry,
      isMaximized: false,
      restoreState,
    };
  } catch {
    return null;
  }
}

/** @deprecated Prefer parseWebsiteCompanionWindowLayoutState */
export function parseWebsiteCompanionWindowState(
  raw: string | null,
  viewport: CompanionViewport,
): CompanionWindowGeometry | null {
  const layout = parseWebsiteCompanionWindowLayoutState(raw, viewport);
  if (!layout) return null;
  return layout.isMaximized
    ? getWebsiteCompanionWindowMaximizedGeometry(viewport)
    : layout.geometry;
}

export function serializeWebsiteCompanionWindowLayoutState(
  layout: CompanionWindowLayoutState,
): string {
  const payload: CompanionWindowPersistedState = {
    schemaVersion: WEBSITE_COMPANION_WINDOW_SCHEMA_VERSION,
    ...layout.geometry,
    isMaximized: layout.isMaximized,
    restoreState: layout.restoreState ?? layout.geometry,
  };
  return JSON.stringify(payload);
}

/** @deprecated Prefer serializeWebsiteCompanionWindowLayoutState */
export function serializeWebsiteCompanionWindowState(
  geometry: CompanionWindowGeometry,
): string {
  return serializeWebsiteCompanionWindowLayoutState({
    geometry,
    isMaximized: false,
    restoreState: geometry,
  });
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

export function readWebsiteCompanionWindowLayoutState(
  storage: StorageLike,
  viewport: CompanionViewport,
): CompanionWindowLayoutState {
  if (!isWebsiteCompanionLocalStorageAvailable(storage)) {
    return getWebsiteCompanionWindowResetLayout(viewport);
  }
  const stored = parseWebsiteCompanionWindowLayoutState(
    storage.getItem(WEBSITE_COMPANION_WINDOW_STORAGE_KEY),
    viewport,
  );
  return stored ?? getWebsiteCompanionWindowResetLayout(viewport);
}

/** @deprecated Prefer readWebsiteCompanionWindowLayoutState */
export function readWebsiteCompanionWindowState(
  storage: StorageLike,
  viewport: CompanionViewport,
): CompanionWindowGeometry {
  const layout = readWebsiteCompanionWindowLayoutState(storage, viewport);
  return layout.isMaximized
    ? getWebsiteCompanionWindowMaximizedGeometry(viewport)
    : layout.geometry;
}

export function writeWebsiteCompanionWindowLayoutState(
  storage: StorageLike,
  layout: CompanionWindowLayoutState,
  viewport: CompanionViewport,
): void {
  if (!isWebsiteCompanionLocalStorageAvailable(storage)) return;
  const reconciled = reconcileWebsiteCompanionWindowLayoutState(layout, viewport);
  storage.setItem(
    WEBSITE_COMPANION_WINDOW_STORAGE_KEY,
    serializeWebsiteCompanionWindowLayoutState(reconciled),
  );
}

/** @deprecated Prefer writeWebsiteCompanionWindowLayoutState */
export function writeWebsiteCompanionWindowState(
  storage: StorageLike,
  geometry: CompanionWindowGeometry,
  viewport: CompanionViewport,
): void {
  writeWebsiteCompanionWindowLayoutState(
    storage,
    {
      geometry: clampWebsiteCompanionWindowGeometry(geometry, viewport),
      isMaximized: false,
      restoreState: clampWebsiteCompanionWindowGeometry(geometry, viewport),
    },
    viewport,
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

export function reconcileWebsiteCompanionWindowLayoutState(
  layout: CompanionWindowLayoutState,
  viewport: CompanionViewport,
): CompanionWindowLayoutState {
  const restoreState = layout.restoreState
    ? clampWebsiteCompanionWindowGeometry(layout.restoreState, viewport)
    : clampWebsiteCompanionWindowGeometry(layout.geometry, viewport);

  if (layout.isMaximized) {
    return {
      geometry: getWebsiteCompanionWindowMaximizedGeometry(viewport),
      isMaximized: true,
      restoreState,
    };
  }

  const geometry = clampWebsiteCompanionWindowGeometry(layout.geometry, viewport);
  return {
    geometry,
    isMaximized: false,
    restoreState,
  };
}

export function getWebsiteCompanionWindowDisplayedGeometry(
  layout: CompanionWindowLayoutState,
  viewport: CompanionViewport,
): CompanionWindowGeometry {
  return layout.isMaximized
    ? getWebsiteCompanionWindowMaximizedGeometry(viewport)
    : clampWebsiteCompanionWindowGeometry(layout.geometry, viewport);
}

export function applyWebsiteCompanionWindowMaximize(
  layout: CompanionWindowLayoutState,
  viewport: CompanionViewport,
): CompanionWindowLayoutState {
  if (layout.isMaximized) {
    return reconcileWebsiteCompanionWindowLayoutState(layout, viewport);
  }
  const manualGeometry = clampWebsiteCompanionWindowGeometry(layout.geometry, viewport);
  return {
    geometry: getWebsiteCompanionWindowMaximizedGeometry(viewport),
    isMaximized: true,
    restoreState: manualGeometry,
  };
}

export function applyWebsiteCompanionWindowRestore(
  layout: CompanionWindowLayoutState,
  viewport: CompanionViewport,
): CompanionWindowLayoutState {
  if (!layout.isMaximized) {
    return reconcileWebsiteCompanionWindowLayoutState(layout, viewport);
  }
  const restored = layout.restoreState
    ? clampWebsiteCompanionWindowGeometry(layout.restoreState, viewport)
    : getDefaultWebsiteCompanionWindowGeometry(viewport);
  return {
    geometry: restored,
    isMaximized: false,
    restoreState: restored,
  };
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
  if (target.closest("[data-companion-window-maximize-control]")) return false;
  if (target.closest("button, a, input, textarea, select, label")) return false;
  return true;
}

export function shouldAllowWebsiteCompanionWindowDrag(layout: CompanionWindowLayoutState): boolean {
  return !layout.isMaximized;
}

export function shouldAllowWebsiteCompanionWindowResize(layout: CompanionWindowLayoutState): boolean {
  return !layout.isMaximized;
}

export function shouldShowWebsiteCompanionMaximizeControl(viewportWidth: number): boolean {
  return isWebsiteCompanionDesktopViewport(viewportWidth);
}
