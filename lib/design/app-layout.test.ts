import assert from "node:assert/strict";
import { APP_CONTENT_MAX_WIDTH_PX, AppLayoutClasses } from "./app-layout";
import { AppPremiumShell } from "./app-premium-shell";

assert.equal(APP_CONTENT_MAX_WIDTH_PX, 1560);
assert.match(AppLayoutClasses.page, /max-w-\[1560px\]/);
assert.match(AppLayoutClasses.pageWidth, /max-w-\[1560px\]/);
assert.equal(AppPremiumShell.page, AppLayoutClasses.page);
assert.match(AppLayoutClasses.splitGrid, /28%/);
assert.match(AppLayoutClasses.overlayPanel, /max-w-md/);

console.log("app-layout.test.ts: ok");
