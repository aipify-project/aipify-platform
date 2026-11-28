import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

const layout = read("app/platform/layout.tsx");
const page = read("app/platform/page.tsx");
const topbar = read("components/dashboard/Topbar.tsx");
const shell = read("components/dashboard/DashboardShell.tsx");
const live = read("components/platform/platform-portal/PlatformGlobalLiveStatusBar.tsx");

assert.match(layout, /trafficStatusLabels=\{buildPlatformTrafficStatusLabels\(t\)\}/);
assert.doesNotMatch(page, /PlatformTrafficStatusBar/);
assert.doesNotMatch(page, /loadPlatformTrafficStatus/);
assert.match(topbar, /statusSlot/);
assert.match(shell, /PlatformGlobalLiveStatusBar/);
assert.match(shell, /shellVariant === "platform" && trafficStatusLabels/);
assert.match(live, /usePollingTask/);
assert.match(live, /platform-admin-global-live-status-bar/);
assert.match(live, /PLATFORM_TRAFFIC_STATUS_POLL_MS/);
assert.match(live, /refreshOnVisible: true/);

console.log("traffic-status-shell.contract.test.ts: ok");
