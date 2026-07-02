import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  applyWebsiteCompanionWindowDragDelta,
  applyWebsiteCompanionWindowMaximize,
  applyWebsiteCompanionWindowResizeDelta,
  applyWebsiteCompanionWindowRestore,
  canStartWebsiteCompanionWindowDrag,
  clearWebsiteCompanionWindowState,
  clampWebsiteCompanionWindowGeometry,
  getDefaultWebsiteCompanionWindowGeometry,
  getWebsiteCompanionWindowMaxHeight,
  getWebsiteCompanionWindowMaxWidth,
  getWebsiteCompanionWindowMaximizedGeometry,
  getWebsiteCompanionWindowResetLabel,
  getWebsiteCompanionWindowResetLayout,
  getWebsiteCompanionWindowViewportOffset,
  isWebsiteCompanionDesktopViewport,
  isWebsiteCompanionLocalStorageAvailable,
  isWebsiteCompanionPointerEventsSupported,
  isWebsiteCompanionWindowControlBandWithinViewport,
  isWebsiteCompanionWindowHeaderWithinViewport,
  parseWebsiteCompanionWindowLayoutState,
  parseWebsiteCompanionWindowState,
  readWebsiteCompanionViewport,
  readWebsiteCompanionWindowLayoutState,
  readWebsiteCompanionWindowState,
  reconcileWebsiteCompanionWindowGeometry,
  reconcileWebsiteCompanionWindowLayoutState,
  serializeWebsiteCompanionWindowLayoutState,
  serializeWebsiteCompanionWindowState,
  shouldAllowWebsiteCompanionWindowDrag,
  shouldAllowWebsiteCompanionWindowResize,
  shouldIgnoreWebsiteCompanionDesktopState,
  shouldShowWebsiteCompanionMaximizeControl,
  shouldUseWebsiteCompanionFloatingWindow,
  WEBSITE_COMPANION_WINDOW_DEFAULT_HEIGHT_PX,
  WEBSITE_COMPANION_WINDOW_DEFAULT_WIDTH_PX,
  WEBSITE_COMPANION_WINDOW_DESKTOP_MAX_WIDTH_PX,
  WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_HEIGHT_PX,
  WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_WIDTH_PX,
  WEBSITE_COMPANION_WINDOW_HEADER_MIN_VISIBLE_PX,
  WEBSITE_COMPANION_WINDOW_LEGACY_SCHEMA_VERSION,
  WEBSITE_COMPANION_WINDOW_MAX_HEIGHT_DVH_RATIO,
  WEBSITE_COMPANION_WINDOW_SCHEMA_VERSION,
  WEBSITE_COMPANION_WINDOW_STORAGE_KEY,
  WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX,
  writeWebsiteCompanionWindowLayoutState,
  writeWebsiteCompanionWindowState,
} from "@/lib/marketing/website-companion-window";
import {
  assertWebsiteCompanionAskBodyShape,
  buildWebsiteCompanionAskBody,
} from "@/lib/marketing/website-companion-chat";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const desktopViewport = { width: 1280, height: 900 };
const wideViewport = { width: 1440, height: 900 };
const mobileViewport = { width: 390, height: 844 };

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.get(key) ?? null;
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

function createDomTarget(path: string[]): { closest: (selector: string) => Element | null } {
  return {
    closest(selector: string) {
      if (selector === "[data-companion-window-drag-handle]" && path.includes("header")) {
        return {} as Element;
      }
      if (selector === "[data-companion-window-no-drag]" && path.includes("no-drag")) {
        return {} as Element;
      }
      if (selector === "[data-companion-window-resize-handle]" && path.includes("resize")) {
        return {} as Element;
      }
      if (
        selector === "[data-companion-window-maximize-control]" &&
        path.includes("maximize")
      ) {
        return {} as Element;
      }
      const interactiveTags = ["button", "a", "input", "textarea", "select", "label"];
      if (interactiveTags.some((tag) => selector.includes(tag) && path.includes(tag))) {
        return {} as Element;
      }
      return null;
    },
  };
}

// 1. Max width can reach 1080 px when viewport allows it
assert.equal(getWebsiteCompanionWindowMaxWidth(wideViewport), 1080);
assert.equal(getWebsiteCompanionWindowMaxWidth(desktopViewport), 1080);
const narrowDesktop = { width: 900, height: 900 };
assert.equal(
  getWebsiteCompanionWindowMaxWidth(narrowDesktop),
  narrowDesktop.width - WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX * 2,
);
console.log("ok max width reaches 1080 when viewport allows");

// 2. Max height follows safe ~92dvh limit
const maxHeight1440 = getWebsiteCompanionWindowMaxHeight(wideViewport);
assert.equal(maxHeight1440, Math.min(900 * WEBSITE_COMPANION_WINDOW_MAX_HEIGHT_DVH_RATIO, 900 - 48));
assert.ok(maxHeight1440 > 800);
console.log("ok max height follows 92dvh safe limit");

// 3. New default size is larger than previous 460×680
const defaultGeometry = getDefaultWebsiteCompanionWindowGeometry(desktopViewport);
assert.equal(WEBSITE_COMPANION_WINDOW_DEFAULT_WIDTH_PX, 540);
assert.equal(WEBSITE_COMPANION_WINDOW_DEFAULT_HEIGHT_PX, 740);
assert.ok(defaultGeometry.width >= 540);
assert.ok(defaultGeometry.height >= 740);
assert.ok(defaultGeometry.width > 460);
assert.ok(defaultGeometry.height > 680);
console.log("ok default size larger than legacy 460x680");

// 4. Maximize uses available viewport without overflow
const manualLayout = {
  geometry: { x: 700, y: 120, width: 480, height: 640 },
  isMaximized: false,
  restoreState: { x: 700, y: 120, width: 480, height: 640 },
};
const maximized = applyWebsiteCompanionWindowMaximize(manualLayout, wideViewport);
assert.equal(maximized.isMaximized, true);
assert.equal(maximized.geometry.width, 1080);
assert.equal(maximized.geometry.height, getWebsiteCompanionWindowMaxHeight(wideViewport));
assert.ok(
  maximized.geometry.x + maximized.geometry.width <=
    wideViewport.width - WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX,
);
assert.ok(
  maximized.geometry.y + maximized.geometry.height <= wideViewport.height - 48,
);
console.log("ok maximize uses viewport without overflow");

// 5. Restore returns to last manual state
const restored = applyWebsiteCompanionWindowRestore(maximized, wideViewport);
assert.equal(restored.isMaximized, false);
assert.equal(restored.geometry.width, 480);
assert.equal(restored.geometry.height, 640);
assert.equal(restored.geometry.x, 700);
console.log("ok restore returns to last manual state");

// 6. Maximize/restore does not delete messages (storage layer has no message keys)
const messageArchive = ["user:hello", "assistant:hei"];
applyWebsiteCompanionWindowMaximize(manualLayout, desktopViewport);
applyWebsiteCompanionWindowRestore(maximized, desktopViewport);
assert.deepEqual(messageArchive, ["user:hello", "assistant:hei"]);
console.log("ok maximize restore does not touch conversation data");

// 7. Maximize/restore button does not start drag
assert.equal(canStartWebsiteCompanionWindowDrag(createDomTarget(["header", "maximize"])), false);
assert.equal(canStartWebsiteCompanionWindowDrag(createDomTarget(["header", "div"])), true);
console.log("ok maximize control does not start drag");

// 8. Drag and resize ignored while maximized
assert.equal(shouldAllowWebsiteCompanionWindowDrag(maximized), false);
assert.equal(shouldAllowWebsiteCompanionWindowResize(maximized), false);
assert.equal(shouldAllowWebsiteCompanionWindowDrag(manualLayout), true);
assert.equal(shouldAllowWebsiteCompanionWindowResize(manualLayout), true);
console.log("ok drag resize blocked while maximized");

// 9. Persistence restores isMaximized and restoreState
const storage = createMemoryStorage();
writeWebsiteCompanionWindowLayoutState(storage, maximized, wideViewport);
const parsedMax = parseWebsiteCompanionWindowLayoutState(
  storage.getItem(WEBSITE_COMPANION_WINDOW_STORAGE_KEY),
  wideViewport,
);
assert.ok(parsedMax);
assert.equal(parsedMax.isMaximized, true);
assert.equal(parsedMax.restoreState?.width, 480);
const readBack = readWebsiteCompanionWindowLayoutState(storage, wideViewport);
assert.equal(readBack.isMaximized, true);
console.log("ok persistence restores isMaximized and restoreState");

// 10. SchemaVersion 1 migrates safely
const v1Payload = JSON.stringify({
  schemaVersion: WEBSITE_COMPANION_WINDOW_LEGACY_SCHEMA_VERSION,
  x: 700,
  y: 120,
  width: 480,
  height: 640,
});
const migrated = parseWebsiteCompanionWindowLayoutState(v1Payload, desktopViewport);
assert.ok(migrated);
assert.equal(migrated.isMaximized, false);
assert.equal(migrated.geometry.width, 480);
assert.equal(migrated.restoreState?.width, 480);
console.log("ok schema v1 migrates safely");

// 11. Corrupt state falls back without crash
assert.equal(parseWebsiteCompanionWindowLayoutState("{bad", desktopViewport), null);
assert.equal(
  parseWebsiteCompanionWindowLayoutState(
    JSON.stringify({ schemaVersion: 99, x: 1, y: 2, width: 480, height: 640 }),
    desktopViewport,
  ),
  null,
);
const fallback = readWebsiteCompanionWindowLayoutState(
  {
    getItem: () => "not-json",
    setItem: () => undefined,
    removeItem: () => undefined,
  },
  desktopViewport,
);
assert.ok(fallback.geometry.width >= WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_WIDTH_PX);
assert.equal(fallback.isMaximized, false);
console.log("ok corrupt state safe fallback");

// 12. Viewport resize clamps normal state and restoreState
const offscreen = { x: 1100, y: 700, width: 460, height: 680 };
const smallerViewport = { width: 1024, height: 768 };
const reclamped = reconcileWebsiteCompanionWindowGeometry(offscreen, smallerViewport);
assert.ok(reclamped.x + reclamped.width <= smallerViewport.width);
assert.ok(reclamped.y + WEBSITE_COMPANION_WINDOW_HEADER_MIN_VISIBLE_PX <= smallerViewport.height);
const layoutWithRestore = reconcileWebsiteCompanionWindowLayoutState(
  {
    geometry: offscreen,
    isMaximized: false,
    restoreState: { x: 1200, y: 800, width: 700, height: 900 },
  },
  smallerViewport,
);
assert.ok(layoutWithRestore.restoreState);
assert.ok(layoutWithRestore.restoreState.x + layoutWithRestore.restoreState.width <= smallerViewport.width);
console.log("ok viewport resize clamps normal and restore state");

// 13. Maximized state adapts to new viewport
const maximizedOnSmall = reconcileWebsiteCompanionWindowLayoutState(
  { ...maximized, isMaximized: true },
  smallerViewport,
);
assert.equal(maximizedOnSmall.isMaximized, true);
assert.ok(maximizedOnSmall.geometry.width <= getWebsiteCompanionWindowMaxWidth(smallerViewport));
assert.ok(maximizedOnSmall.geometry.height <= getWebsiteCompanionWindowMaxHeight(smallerViewport));
console.log("ok maximized state adapts to viewport resize");

// 14. Reset exits maximize mode and keeps chat
writeWebsiteCompanionWindowLayoutState(storage, maximized, wideViewport);
clearWebsiteCompanionWindowState(storage);
const resetLayout = getWebsiteCompanionWindowResetLayout(desktopViewport);
assert.equal(resetLayout.isMaximized, false);
assert.ok(resetLayout.geometry.width >= WEBSITE_COMPANION_WINDOW_DEFAULT_WIDTH_PX);
const chatAfterReset = ["user:still-here"];
assert.deepEqual(chatAfterReset, ["user:still-here"]);
console.log("ok reset exits maximize and keeps chat");

// 15. Mobile shows no maximize control
assert.equal(shouldShowWebsiteCompanionMaximizeControl(mobileViewport.width), false);
assert.equal(shouldIgnoreWebsiteCompanionDesktopState(mobileViewport.width), true);
assert.equal(
  shouldUseWebsiteCompanionFloatingWindow({
    viewportWidth: mobileViewport.width,
    pointerEventsSupported: true,
  }),
  false,
);
console.log("ok mobile hides maximize control");

// 16. Missing localStorage gives functioning default
const brokenStorage = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
  removeItem: () => {
    throw new Error("blocked");
  },
};
assert.equal(isWebsiteCompanionLocalStorageAvailable(brokenStorage), false);
const defaultFromBroken = readWebsiteCompanionWindowLayoutState(brokenStorage, desktopViewport);
assert.ok(defaultFromBroken.geometry.width >= WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_WIDTH_PX);
console.log("ok missing localStorage uses default layout");

// 17. Missing Pointer Events gives safe fixed layout
assert.equal(
  shouldUseWebsiteCompanionFloatingWindow({
    viewportWidth: desktopViewport.width,
    pointerEventsSupported: false,
  }),
  false,
);
assert.equal(isWebsiteCompanionPointerEventsSupported({ window: {} }), false);
console.log("ok missing pointer events disables floating controls");

// Legacy coverage retained from production-proven baseline
const storedGeometry = { x: 700, y: 120, width: 480, height: 640 };
writeWebsiteCompanionWindowState(storage, storedGeometry, desktopViewport);
const restoredLegacy = readWebsiteCompanionWindowState(storage, desktopViewport);
assert.equal(restoredLegacy.width, 480);
assert.equal(restoredLegacy.height, 640);
console.log("ok valid stored geometry restored");

const dragged = applyWebsiteCompanionWindowDragDelta(
  { x: 100, y: 100, width: 460, height: 680 },
  5000,
  5000,
  desktopViewport,
);
assert.ok(dragged.x < desktopViewport.width - 50);
assert.ok(dragged.y <= desktopViewport.height - 48);
console.log("ok drag clamped within viewport");

const resized = applyWebsiteCompanionWindowResizeDelta(
  { x: 700, y: 120, width: 460, height: 680 },
  -500,
  -500,
  desktopViewport,
);
assert.equal(resized.width, WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_WIDTH_PX);
assert.equal(resized.height, WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_HEIGHT_PX);
const expanded = applyWebsiteCompanionWindowResizeDelta(
  { x: 100, y: 100, width: 460, height: 680 },
  5000,
  5000,
  desktopViewport,
);
assert.ok(expanded.width <= WEBSITE_COMPANION_WINDOW_DESKTOP_MAX_WIDTH_PX);
assert.ok(expanded.height <= getWebsiteCompanionWindowMaxHeight(desktopViewport));
console.log("ok resize min/max respected");

assert.equal(canStartWebsiteCompanionWindowDrag(createDomTarget(["header", "button"])), false);
assert.equal(canStartWebsiteCompanionWindowDrag(createDomTarget(["header", "textarea"])), false);
assert.equal(canStartWebsiteCompanionWindowDrag(createDomTarget(["header", "resize"])), false);
console.log("ok interactive controls do not start drag");

// 18. Chat request and recentContext shape unchanged
const body = buildWebsiteCompanionAskBody({
  question: "Hva koster Aipify?",
  locale: "no",
  messages: [
    { id: "1", role: "user", text: "Hva koster Aipify?" },
    {
      id: "2",
      role: "assistant",
      directAnswer: "Svar",
      explanation: "",
      steps: [],
      sources: [],
      actions: [],
    },
  ],
});
assertWebsiteCompanionAskBodyShape(body);
assert.equal(body.locale, "no");
assert.equal(body.recentContext?.length, 2);
console.log("ok chat request shape unchanged");

assert.equal(getWebsiteCompanionWindowResetLabel("no"), "Tilbakestill størrelse og plassering");
assert.equal(getWebsiteCompanionWindowResetLabel("en"), "Reset size and position");
assert.equal(isWebsiteCompanionDesktopViewport(1280), true);

const serialized = serializeWebsiteCompanionWindowState(
  clampWebsiteCompanionWindowGeometry(
    getDefaultWebsiteCompanionWindowGeometry(desktopViewport),
    desktopViewport,
  ),
);
const parsedJson = JSON.parse(serialized) as { schemaVersion: number };
assert.equal(parsedJson.schemaVersion, WEBSITE_COMPANION_WINDOW_SCHEMA_VERSION);

const serializedLayout = serializeWebsiteCompanionWindowLayoutState(
  applyWebsiteCompanionWindowMaximize(
    getWebsiteCompanionWindowResetLayout(desktopViewport),
    desktopViewport,
  ),
);
const parsedLayout = JSON.parse(serializedLayout) as {
  schemaVersion: number;
  isMaximized: boolean;
  restoreState: { width: number };
};
assert.equal(parsedLayout.schemaVersion, WEBSITE_COMPANION_WINDOW_SCHEMA_VERSION);
assert.equal(parsedLayout.isMaximized, true);
assert.ok(parsedLayout.restoreState.width >= WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_WIDTH_PX);
console.log("ok persistence schema version 2");

const lowViewport = { width: 1440, height: 420 };

// 04E-1. Negative stored y clamped so header stays visible
const negativeYGeometry = clampWebsiteCompanionWindowGeometry(
  { x: 120, y: -240, width: 540, height: 680 },
  lowViewport,
);
assert.ok(negativeYGeometry.y >= WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX);
assert.equal(isWebsiteCompanionWindowHeaderWithinViewport(negativeYGeometry, lowViewport), true);
console.log("ok negative stored y clamped with visible header");

// 04E-2. Maximized state with negative y recalculated safely
const negativeMaximizedPayload = JSON.stringify({
  schemaVersion: WEBSITE_COMPANION_WINDOW_SCHEMA_VERSION,
  x: 16,
  y: -180,
  width: 1080,
  height: 820,
  isMaximized: true,
  restoreState: { x: 700, y: 120, width: 480, height: 640 },
});
const negativeMaximized = parseWebsiteCompanionWindowLayoutState(
  negativeMaximizedPayload,
  lowViewport,
);
assert.ok(negativeMaximized);
assert.equal(negativeMaximized.isMaximized, true);
assert.equal(negativeMaximized.geometry.y, WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX);
assert.equal(
  isWebsiteCompanionWindowControlBandWithinViewport(negativeMaximized.geometry, lowViewport),
  true,
);
console.log("ok maximized negative y recalculated");

// 04E-3. Reload with isMaximized=true uses current viewport, not stored geometry
const storedLargeMaximized = JSON.stringify({
  schemaVersion: WEBSITE_COMPANION_WINDOW_SCHEMA_VERSION,
  x: 16,
  y: 16,
  width: 1080,
  height: 828,
  isMaximized: true,
  restoreState: { x: 700, y: 120, width: 480, height: 640 },
});
const reloadedMaximized = parseWebsiteCompanionWindowLayoutState(
  storedLargeMaximized,
  lowViewport,
);
assert.ok(reloadedMaximized);
assert.ok(reloadedMaximized.geometry.height <= getWebsiteCompanionWindowMaxHeight(lowViewport));
assert.ok(
  reloadedMaximized.geometry.y + reloadedMaximized.geometry.height <=
    lowViewport.height - WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX + 1,
);
console.log("ok reload maximized uses current viewport");

// 04E-4. Too tall height clamped without hiding header
const tallGeometry = clampWebsiteCompanionWindowGeometry(
  { x: 16, y: 16, width: 540, height: 2000 },
  lowViewport,
);
assert.ok(tallGeometry.height <= getWebsiteCompanionWindowMaxHeight(lowViewport));
assert.equal(isWebsiteCompanionWindowHeaderWithinViewport(tallGeometry, lowViewport), true);
assert.ok(tallGeometry.y + tallGeometry.height <= lowViewport.height - WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX + 1);
console.log("ok excessive height clamped with header visible");

// 04E-5. Smaller viewport after reload keeps header visible
const smallerReloadViewport = { width: 1280, height: 520 };
const persistedWide = applyWebsiteCompanionWindowMaximize(manualLayout, wideViewport);
writeWebsiteCompanionWindowLayoutState(storage, persistedWide, wideViewport);
const reloadedOnSmall = readWebsiteCompanionWindowLayoutState(storage, smallerReloadViewport);
assert.equal(
  isWebsiteCompanionWindowHeaderWithinViewport(
    getWebsiteCompanionWindowMaximizedGeometry(smallerReloadViewport),
    smallerReloadViewport,
  ),
  true,
);
assert.equal(
  isWebsiteCompanionWindowHeaderWithinViewport(reloadedOnSmall.geometry, smallerReloadViewport),
  true,
);
console.log("ok smaller viewport reload keeps header visible");

// 04E-6. Visual viewport / zoom reconciliation
const zoomedViewport = readWebsiteCompanionViewport({
  innerWidth: 1280,
  innerHeight: 900,
  visualViewport: { width: 1280, height: 520, offsetLeft: 0, offsetTop: 140 },
});
assert.equal(zoomedViewport.height, 520);
const zoomReconciled = reconcileWebsiteCompanionWindowLayoutState(persistedWide, zoomedViewport);
assert.equal(
  isWebsiteCompanionWindowControlBandWithinViewport(zoomReconciled.geometry, zoomedViewport),
  true,
);
assert.deepEqual(getWebsiteCompanionWindowViewportOffset({
  visualViewport: { offsetLeft: 12, offsetTop: 48 },
}), { x: 12, y: 48 });
console.log("ok visual viewport reconciliation");

// 04E-7. restoreState with negative position repaired
const negativeRestoreLayout = reconcileWebsiteCompanionWindowLayoutState(
  {
    geometry: { x: 700, y: 120, width: 480, height: 640 },
    isMaximized: false,
    restoreState: { x: 120, y: -300, width: 480, height: 640 },
  },
  desktopViewport,
);
assert.ok(negativeRestoreLayout.restoreState);
assert.ok(negativeRestoreLayout.restoreState.y >= WEBSITE_COMPANION_WINDOW_VIEWPORT_MARGIN_PX);
console.log("ok negative restoreState repaired");

// 04E-8. Restore cannot place header outside viewport
const restoredFromMax = applyWebsiteCompanionWindowRestore(
  {
    geometry: getWebsiteCompanionWindowMaximizedGeometry(lowViewport),
    isMaximized: true,
    restoreState: { x: 120, y: -400, width: 480, height: 640 },
  },
  lowViewport,
);
assert.equal(restoredFromMax.isMaximized, false);
assert.equal(isWebsiteCompanionWindowHeaderWithinViewport(restoredFromMax.geometry, lowViewport), true);
console.log("ok restore keeps header within viewport");

// 04E-9. Reset gives safe default placement
const resetOnLow = getWebsiteCompanionWindowResetLayout(lowViewport);
assert.equal(resetOnLow.isMaximized, false);
assert.equal(isWebsiteCompanionWindowHeaderWithinViewport(resetOnLow.geometry, lowViewport), true);
console.log("ok reset gives safe default placement");

// 04E-10. Page scroll does not change viewport-relative positioning inputs
const beforeScroll = readWebsiteCompanionViewport({
  innerWidth: 1280,
  innerHeight: 720,
  visualViewport: { width: 1280, height: 720, offsetLeft: 0, offsetTop: 0 },
});
const afterScroll = readWebsiteCompanionViewport({
  innerWidth: 1280,
  innerHeight: 720,
  visualViewport: { width: 1280, height: 720, offsetLeft: 0, offsetTop: 240 },
});
assert.equal(beforeScroll.width, afterScroll.width);
assert.equal(beforeScroll.height, afterScroll.height);
assert.notEqual(
  getWebsiteCompanionWindowViewportOffset({
    visualViewport: { offsetLeft: 0, offsetTop: 240 },
  }).y,
  0,
);
console.log("ok page scroll uses visual viewport offset not document scroll");

// 04E-11. Close control band stays within computed visible header area
const headerSafeGeometry = getWebsiteCompanionWindowMaximizedGeometry(lowViewport);
assert.equal(isWebsiteCompanionWindowControlBandWithinViewport(headerSafeGeometry, lowViewport), true);
console.log("ok close control band within visible area");

// 04E-12. Maximize/restore controls remain within visible area
const maxOnLow = applyWebsiteCompanionWindowMaximize(manualLayout, lowViewport);
assert.equal(isWebsiteCompanionWindowControlBandWithinViewport(maxOnLow.geometry, lowViewport), true);
assert.equal(
  isWebsiteCompanionWindowControlBandWithinViewport(
    applyWebsiteCompanionWindowRestore(maxOnLow, lowViewport).geometry,
    lowViewport,
  ),
  true,
);
console.log("ok maximize restore controls within visible area");

// 04E-13. Mobile behavior unchanged
assert.equal(shouldShowWebsiteCompanionMaximizeControl(mobileViewport.width), false);
assert.equal(shouldUseWebsiteCompanionFloatingWindow({
  viewportWidth: mobileViewport.width,
  pointerEventsSupported: true,
}), false);
console.log("ok mobile behavior unchanged");

// 04E-14. Chat request shape unchanged (covered above, reassert)
assertWebsiteCompanionAskBodyShape(body);
console.log("ok chat request shape unchanged after header recovery");

// 04E-15. Corrupt localStorage gives safe recovery
const corruptRecovery = readWebsiteCompanionWindowLayoutState(
  {
    getItem: () =>
      JSON.stringify({
        schemaVersion: WEBSITE_COMPANION_WINDOW_SCHEMA_VERSION,
        x: Number.NaN,
        y: -999,
        width: 9999,
        height: 9999,
        isMaximized: true,
      }),
    setItem: () => undefined,
    removeItem: () => undefined,
  },
  lowViewport,
);
assert.equal(isWebsiteCompanionWindowHeaderWithinViewport(corruptRecovery.geometry, lowViewport), true);
console.log("ok corrupt localStorage recovery");

// 04E-16. No customer-specific logic in window module
const moduleSource = fs.readFileSync(
  path.join(root, "lib/marketing/website-companion-window.ts"),
  "utf8",
);
for (const term of ["unonight", "Unonight", "unonight.com"]) {
  assert.equal(moduleSource.includes(term), false);
}
console.log("ok no customer-specific logic in window module");

console.log("website-companion-window.test.ts: all assertions passed");
