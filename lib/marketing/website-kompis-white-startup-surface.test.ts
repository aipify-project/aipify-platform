/**
 * Job 52 — closed first-load must not reveal a panel-sized white host frame.
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
assert.match(loaderSource, /Premature open sizing before a closed handshake/);
assert.match(loaderSource, /if \(!closedHandshakeDone\) return/);
assert.match(loaderSource, /allowtransparency/);
assert.match(loaderSource, /backgroundColor = "transparent"/);
assert.doesNotMatch(loaderSource, /loading", "lazy"/);
assert.doesNotMatch(loaderSource, /setAttribute\("loading"/);

// Simulate handshake state machine (mirrors loader rules)
function simulateHostFrame() {
  let closedHandshakeDone = false;
  let shellReady = false;
  let opacity = "0";
  let width = 72;
  let height = 72;
  let lastOpenRequested = false;
  let surfaceActive = true;

  function markShellReady() {
    if (!closedHandshakeDone) return;
    if (!surfaceActive) {
      opacity = "0";
      return;
    }
    shellReady = true;
    opacity = "1";
  }

  function applyResize(open: boolean) {
    let wantOpen = open;
    if (wantOpen && !closedHandshakeDone) {
      wantOpen = false;
    }
    if (wantOpen && !surfaceActive) {
      wantOpen = false;
    }
    lastOpenRequested = wantOpen;
    if (!wantOpen) {
      width = 72;
      height = 72;
      closedHandshakeDone = true;
      markShellReady();
      return;
    }
    width = 474;
    height = 824;
    markShellReady();
  }

  return {
    applyResize,
    setActive(active: boolean) {
      surfaceActive = active;
      if (!active) {
        opacity = "0";
        lastOpenRequested = false;
        applyResize(false);
      } else if (!lastOpenRequested) {
        applyResize(false);
      } else {
        markShellReady();
      }
    },
    snapshot: () => ({
      closedHandshakeDone,
      shellReady,
      opacity,
      width,
      height,
      lastOpenRequested,
    }),
  };
}

const cold = simulateHostFrame();
// Premature open on cold start must not enlarge or reveal
cold.applyResize(true);
assert.deepEqual(cold.snapshot(), {
  closedHandshakeDone: true,
  shellReady: true,
  opacity: "1",
  width: 72,
  height: 72,
  lastOpenRequested: false,
});

// After handshake, open may enlarge
cold.applyResize(true);
assert.equal(cold.snapshot().width, 474);
assert.equal(cold.snapshot().height, 824);
assert.equal(cold.snapshot().opacity, "1");

// Close returns to 72 and stays visible when active
cold.applyResize(false);
assert.equal(cold.snapshot().width, 72);
assert.equal(cold.snapshot().height, 72);

// Inactive hides; late open-size must not enlarge or reveal a white panel
const denied = simulateHostFrame();
denied.applyResize(false);
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
