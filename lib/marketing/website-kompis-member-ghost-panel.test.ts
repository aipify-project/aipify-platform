/**
 * Member refresh ghost panel: do not mount on private routes, and do not
 * expand an open restore before the child reports a painted shell.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  resolveWebsiteKompisPublicLoaderMount,
  shouldExpandWebsiteKompisHostFrame,
} from "@/lib/marketing/website-kompis-public-surface-contract";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const loaderSource = readFileSync(path.join(root, "public/embed/website-kompis.js"), "utf8");
const widgetSource = readFileSync(
  path.join(root, "components/embed/WebsiteKompisEmbedWidget.tsx"),
  "utf8",
);

assert.match(loaderSource, /painted !== true/);
assert.match(loaderSource, /removeChild\(iframe\)/);
assert.match(loaderSource, /var surfaceActive = false/);
assert.match(widgetSource, /postResizeToParent\(true, true\)/);
assert.doesNotMatch(widgetSource, /postResizeToParent\(restored\.open\)/);

assert.equal(
  resolveWebsiteKompisPublicLoaderMount({
    pathname: "/about",
    attributeMissing: true,
  }).mount,
  true,
  "public page without an attribute still mounts",
);

const memberRefresh = resolveWebsiteKompisPublicLoaderMount({
  pathname: "/member/inbox",
  attributeMissing: true,
});
assert.equal(memberRefresh.mount, false);
assert.equal(memberRefresh.accessClass, "private");
assert.equal(
  shouldExpandWebsiteKompisHostFrame({ mount: memberRefresh.mount, open: true, painted: true }),
  false,
);

assert.equal(
  resolveWebsiteKompisPublicLoaderMount({
    pathname: "/no/account/billing",
    attributeMissing: true,
  }).mount,
  false,
);

assert.equal(
  resolveWebsiteKompisPublicLoaderMount({
    pathname: "/app/software",
    attributeMissing: true,
  }).mount,
  false,
);

assert.equal(
  shouldExpandWebsiteKompisHostFrame({ mount: true, open: true, painted: false }),
  false,
);
assert.equal(
  shouldExpandWebsiteKompisHostFrame({ mount: true, open: true, painted: true }),
  true,
);

const secondRefresh = resolveWebsiteKompisPublicLoaderMount({
  pathname: "/member/inbox",
  attributeMissing: true,
});
assert.equal(secondRefresh.mount, false);
assert.equal(
  shouldExpandWebsiteKompisHostFrame({ mount: secondRefresh.mount, open: true, painted: true }),
  false,
);

const afterRouteChange = resolveWebsiteKompisPublicLoaderMount({
  pathname: "/members/home",
  hostAccessClass: "public",
  attributeMissing: false,
});
assert.equal(afterRouteChange.mount, false);
assert.equal(
  shouldExpandWebsiteKompisHostFrame({
    mount: afterRouteChange.mount,
    open: true,
    painted: true,
  }),
  false,
);

assert.equal(
  resolveWebsiteKompisPublicLoaderMount({
    pathname: "/about",
    hostAccessClass: "unknown",
    attributeMissing: false,
  }).mount,
  false,
);

console.log("website-kompis-member-ghost-panel.test.ts: all assertions passed");
