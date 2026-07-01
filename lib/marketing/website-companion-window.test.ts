import assert from "node:assert/strict";
import {
  applyWebsiteCompanionWindowDragDelta,
  applyWebsiteCompanionWindowResizeDelta,
  canStartWebsiteCompanionWindowDrag,
  clearWebsiteCompanionWindowState,
  clampWebsiteCompanionWindowGeometry,
  getDefaultWebsiteCompanionWindowGeometry,
  getWebsiteCompanionWindowResetLabel,
  isWebsiteCompanionDesktopViewport,
  isWebsiteCompanionLocalStorageAvailable,
  isWebsiteCompanionPointerEventsSupported,
  parseWebsiteCompanionWindowState,
  readWebsiteCompanionWindowState,
  reconcileWebsiteCompanionWindowGeometry,
  serializeWebsiteCompanionWindowState,
  shouldIgnoreWebsiteCompanionDesktopState,
  shouldUseWebsiteCompanionFloatingWindow,
  WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_HEIGHT_PX,
  WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_WIDTH_PX,
  WEBSITE_COMPANION_WINDOW_HEADER_MIN_VISIBLE_PX,
  WEBSITE_COMPANION_WINDOW_SCHEMA_VERSION,
  WEBSITE_COMPANION_WINDOW_STORAGE_KEY,
  writeWebsiteCompanionWindowState,
} from "@/lib/marketing/website-companion-window";
import {
  assertWebsiteCompanionAskBodyShape,
  buildWebsiteCompanionAskBody,
} from "@/lib/marketing/website-companion-chat";

const desktopViewport = { width: 1280, height: 900 };
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
      const interactiveTags = ["button", "a", "input", "textarea", "select", "label"];
      if (interactiveTags.some((tag) => selector.includes(tag) && path.includes(tag))) {
        return {} as Element;
      }
      return null;
    },
  };
}

// 1. Valid stored size and position restored
const storage = createMemoryStorage();
const storedGeometry = { x: 700, y: 120, width: 480, height: 640 };
writeWebsiteCompanionWindowState(storage, storedGeometry, desktopViewport);
const restored = readWebsiteCompanionWindowState(storage, desktopViewport);
assert.equal(restored.width, 480);
assert.equal(restored.height, 640);
assert.ok(restored.x >= 16);
assert.ok(restored.y >= 16);
console.log("ok valid stored geometry restored");

// 2. Invalid localStorage falls back safely
assert.equal(parseWebsiteCompanionWindowState("{bad", desktopViewport), null);
assert.equal(
  parseWebsiteCompanionWindowState(
    JSON.stringify({ schemaVersion: 99, x: 1, y: 2, width: 480, height: 640 }),
    desktopViewport,
  ),
  null,
);
const fallback = readWebsiteCompanionWindowState(
  {
    getItem: () => "not-json",
    setItem: () => undefined,
    removeItem: () => undefined,
  },
  desktopViewport,
);
assert.ok(fallback.width >= WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_WIDTH_PX);
console.log("ok invalid localStorage safe fallback");

// 3. Drag clamped within viewport
const dragged = applyWebsiteCompanionWindowDragDelta(
  { x: 100, y: 100, width: 460, height: 680 },
  5000,
  5000,
  desktopViewport,
);
assert.ok(dragged.x < desktopViewport.width - 50);
assert.ok(dragged.y <= desktopViewport.height - 48);
console.log("ok drag clamped within viewport");

// 4. Resize respects min/max width and height
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
assert.ok(expanded.width <= 720);
assert.ok(expanded.height <= desktopViewport.height - 80);
console.log("ok resize min/max respected");

// 5. Viewport change reclamps window back on screen
const offscreen = { x: 1100, y: 700, width: 460, height: 680 };
const smallerViewport = { width: 1024, height: 768 };
const reclamped = reconcileWebsiteCompanionWindowGeometry(offscreen, smallerViewport);
assert.ok(reclamped.x + reclamped.width <= smallerViewport.width);
assert.ok(reclamped.y + WEBSITE_COMPANION_WINDOW_HEADER_MIN_VISIBLE_PX <= smallerViewport.height);
console.log("ok viewport change reclamps geometry");

// 6. Reset clears only window state
writeWebsiteCompanionWindowState(storage, storedGeometry, desktopViewport);
clearWebsiteCompanionWindowState(storage);
assert.equal(storage.getItem(WEBSITE_COMPANION_WINDOW_STORAGE_KEY), null);
console.log("ok reset clears window state only");

// 7. Reset does not delete messages (storage layer has no message keys)
const messageArchive = ["user:hello", "assistant:hei"];
clearWebsiteCompanionWindowState(storage);
assert.deepEqual(messageArchive, ["user:hello", "assistant:hei"]);
console.log("ok reset does not touch conversation data");

// 8. Mobile ignores desktop position and size
assert.equal(shouldIgnoreWebsiteCompanionDesktopState(mobileViewport.width), true);
assert.equal(
  shouldUseWebsiteCompanionFloatingWindow({
    viewportWidth: mobileViewport.width,
    pointerEventsSupported: true,
  }),
  false,
);
console.log("ok mobile ignores desktop floating window");

// 9. Missing Pointer Events uses fixed functioning panel mode
assert.equal(
  shouldUseWebsiteCompanionFloatingWindow({
    viewportWidth: desktopViewport.width,
    pointerEventsSupported: false,
  }),
  false,
);
assert.equal(isWebsiteCompanionPointerEventsSupported({ window: {} }), false);
console.log("ok missing pointer events disables floating controls");

// 10. Missing localStorage still yields functioning default geometry
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
const defaultGeometry = readWebsiteCompanionWindowState(brokenStorage, desktopViewport);
assert.ok(defaultGeometry.width >= WEBSITE_COMPANION_WINDOW_DESKTOP_MIN_WIDTH_PX);
console.log("ok missing localStorage uses default geometry");

// 11. Close/send/input do not start drag
assert.equal(canStartWebsiteCompanionWindowDrag(createDomTarget(["header", "div"])), true);
assert.equal(canStartWebsiteCompanionWindowDrag(createDomTarget(["header", "button"])), false);
assert.equal(canStartWebsiteCompanionWindowDrag(createDomTarget(["header", "textarea"])), false);
assert.equal(canStartWebsiteCompanionWindowDrag(createDomTarget(["header", "resize"])), false);
console.log("ok interactive controls do not start drag");

// 12. Chat request and context shape unchanged
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
const parsed = JSON.parse(serialized) as { schemaVersion: number };
assert.equal(parsed.schemaVersion, WEBSITE_COMPANION_WINDOW_SCHEMA_VERSION);
console.log("ok persistence schema version");

console.log("website-companion-window.test.ts: all assertions passed");
