/**
 * Job 52 + P1 scoped reopen — closed first-load must not reveal a panel-sized white host frame.
 * Open host geometry is deferred until closed 72×72 paint is committed (restore/hydration race).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  WEBSITE_KOMPIS_EMBED_CLOSED_HEIGHT_PX,
  WEBSITE_KOMPIS_EMBED_CLOSED_WIDTH_PX,
  WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_PX,
  WEBSITE_KOMPIS_EMBED_OPEN_WIDTH_PX,
  buildWebsiteKompisEmbedResizeMessage,
} from "@/lib/marketing/website-kompis-embed";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const loaderSource = readFileSync(path.join(root, "public/embed/website-kompis.js"), "utf8");
const embedLayoutSource = readFileSync(
  path.join(root, "app/embed/website-kompis/layout.tsx"),
  "utf8",
);

assert.equal(WEBSITE_KOMPIS_EMBED_CLOSED_WIDTH_PX, 72);
assert.equal(WEBSITE_KOMPIS_EMBED_CLOSED_HEIGHT_PX, 72);
assert.equal(WEBSITE_KOMPIS_EMBED_OPEN_WIDTH_PX, 450);
assert.equal(WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_PX, 800);

const closedMsg = buildWebsiteKompisEmbedResizeMessage(false);
assert.equal(closedMsg.open, false);
assert.equal(closedMsg.width, 72);
assert.equal(closedMsg.height, 72);

// Loader readiness contract
assert.match(loaderSource, /closedHandshakeDone/);
assert.match(loaderSource, /closedPaintCommitted/);
assert.match(loaderSource, /pendingOpenResize/);
assert.match(loaderSource, /scheduleClosedPaintCommit/);
assert.match(loaderSource, /Premature open sizing before a closed handshake/);
assert.match(loaderSource, /stash intent; do not fake a closed handshake/);
assert.match(loaderSource, /if \(!closedHandshakeDone\) return/);
assert.match(loaderSource, /allowtransparency/);
assert.match(loaderSource, /backgroundColor = "transparent"/);
assert.doesNotMatch(loaderSource, /loading", "lazy"/);
assert.doesNotMatch(loaderSource, /setAttribute\("loading"/);

type FrameSnapshot = {
  closedHandshakeDone: boolean;
  closedPaintCommitted: boolean;
  shellReady: boolean;
  opacity: string;
  width: number;
  height: number;
  lastOpenRequested: boolean;
  pendingOpen: boolean;
};

/** Mirrors loader rules (including double-rAF paint commit + pending open). */
function simulateHostFrame() {
  let closedHandshakeDone = false;
  let closedPaintCommitted = false;
  let shellReady = false;
  let opacity = "0";
  let width = 72;
  let height = 72;
  let lastOpenRequested = false;
  let surfaceActive = true;
  let pendingOpenResize: { width?: number; height?: number } | null = null;
  const rafQueue: Array<() => void> = [];
  let rafEpoch = 0;

  function markShellReady() {
    if (!closedHandshakeDone) return;
    if (!surfaceActive) {
      opacity = "0";
      return;
    }
    shellReady = true;
    opacity = "1";
  }

  function flushPendingOpenResize() {
    if (!pendingOpenResize || !closedPaintCommitted || !closedHandshakeDone) return;
    if (!surfaceActive) {
      pendingOpenResize = null;
      return;
    }
    const pending = pendingOpenResize;
    pendingOpenResize = null;
    applyResize(true, pending.width, pending.height);
  }

  function scheduleClosedPaintCommit() {
    if (closedPaintCommitted) {
      flushPendingOpenResize();
      return;
    }
    const epoch = ++rafEpoch;
    rafQueue.length = 0;
    rafQueue.push(() => {
      if (epoch !== rafEpoch) return;
      rafQueue.push(() => {
        if (epoch !== rafEpoch) return;
        closedPaintCommitted = true;
        flushPendingOpenResize();
      });
    });
  }

  function applyResize(open: boolean, _width?: number, _height?: number) {
    let wantOpen = open;
    if (wantOpen && !closedHandshakeDone) {
      pendingOpenResize = { width: _width, height: _height };
      return;
    }
    if (wantOpen && !surfaceActive) {
      pendingOpenResize = null;
      wantOpen = false;
    }
    if (wantOpen && !closedPaintCommitted) {
      pendingOpenResize = { width: _width, height: _height };
      wantOpen = false;
    } else if (wantOpen) {
      pendingOpenResize = null;
    } else if (!open && closedHandshakeDone) {
      pendingOpenResize = null;
    }
    lastOpenRequested = wantOpen;
    if (wantOpen) {
      width = 474;
      height = 824;
      markShellReady();
      return;
    }
    width = 72;
    height = 72;
    closedHandshakeDone = true;
    markShellReady();
    scheduleClosedPaintCommit();
  }

  return {
    applyResize,
    /** Advance one animation frame (loader uses double-rAF). */
    tickFrame() {
      const job = rafQueue.shift();
      if (job) job();
    },
    flushPaint() {
      this.tickFrame();
      this.tickFrame();
    },
    setActive(active: boolean) {
      surfaceActive = active;
      if (!active) {
        opacity = "0";
        lastOpenRequested = false;
        pendingOpenResize = null;
        applyResize(false);
      } else if (!lastOpenRequested) {
        applyResize(false);
      } else {
        markShellReady();
      }
    },
    snapshot: (): FrameSnapshot => ({
      closedHandshakeDone,
      closedPaintCommitted,
      shellReady,
      opacity,
      width,
      height,
      lastOpenRequested,
      pendingOpen: pendingOpenResize != null,
    }),
  };
}

// Premature open on cold start must not enlarge, reveal, or fake a closed handshake.
const cold = simulateHostFrame();
cold.applyResize(true);
assert.deepEqual(cold.snapshot(), {
  closedHandshakeDone: false,
  closedPaintCommitted: false,
  shellReady: false,
  opacity: "0",
  width: 72,
  height: 72,
  lastOpenRequested: false,
  pendingOpen: true,
});

// Real closed handshake reveals 72×72 but must not enlarge yet.
cold.applyResize(false);
assert.equal(cold.snapshot().width, 72);
assert.equal(cold.snapshot().height, 72);
assert.equal(cold.snapshot().opacity, "1");
assert.equal(cold.snapshot().closedHandshakeDone, true);
assert.equal(cold.snapshot().closedPaintCommitted, false);
assert.equal(cold.snapshot().pendingOpen, true);

// Same-turn open after closed (restore/hydration) stays at 72 until paint commit.
cold.applyResize(true);
assert.equal(cold.snapshot().width, 72);
assert.equal(cold.snapshot().height, 72);
assert.equal(cold.snapshot().lastOpenRequested, false);
assert.equal(cold.snapshot().pendingOpen, true);

// After closed paint commit, pending open may enlarge.
cold.flushPaint();
assert.equal(cold.snapshot().width, 474);
assert.equal(cold.snapshot().height, 824);
assert.equal(cold.snapshot().opacity, "1");
assert.equal(cold.snapshot().lastOpenRequested, true);
assert.equal(cold.snapshot().pendingOpen, false);

// Close returns to 72 and stays visible when active; later open is not paint-gated.
cold.applyResize(false);
assert.equal(cold.snapshot().width, 72);
assert.equal(cold.snapshot().height, 72);
cold.applyResize(true);
assert.equal(cold.snapshot().width, 474);
assert.equal(cold.snapshot().height, 824);

// Inactive hides; late open-size must not enlarge or reveal a white panel
const denied = simulateHostFrame();
denied.applyResize(false);
denied.flushPaint();
denied.setActive(false);
assert.equal(denied.snapshot().opacity, "0");
denied.applyResize(true);
assert.equal(denied.snapshot().width, 72);
assert.equal(denied.snapshot().opacity, "0");
denied.setActive(true);
assert.equal(denied.snapshot().width, 72);
assert.equal(denied.snapshot().opacity, "1");

// Embed layout pins closed before hydrate
assert.match(embedLayoutSource, /data-ak-shell","closed"/);
assert.match(embedLayoutSource, /data-ak-embed-root/);
assert.match(embedLayoutSource, /body\.min-h-full/);
assert.match(embedLayoutSource, /#__next/);

console.log("website-kompis-white-startup-surface.test.ts: all assertions passed");
