/**
 * AIPIFY_APP_PROFILE_CONTAINER_WIDTH_V1
 * Min profil / Kundeforhold must use the same APP content frame as Kundeservice.
 *
 * Kundeservice reference (`/app/support/requests`):
 * - Token: AppLayoutClasses.pageWidth → max-w-[1560px] (APP_CONTENT_MAX_WIDTH_PX = 1560)
 * - Source: lib/design/app-layout.ts
 * - Page pad: AppLayoutClasses.pagePaddingX → px-4 sm:px-6 lg:px-8
 *   (app/app/support/requests/page.tsx) inside DashboardShell mainScroll
 *   (px-4 sm:px-6 lg:px-10 from lib/design/app-visual-system.ts)
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  APP_CONTENT_MAX_WIDTH_PX,
  AppLayoutClasses,
} from "@/lib/design/app-layout";
import { AppVisualClasses } from "@/lib/design/app-visual-system";

const ROOT = process.cwd();
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

assert.equal(APP_CONTENT_MAX_WIDTH_PX, 1560);
assert.match(AppLayoutClasses.pageWidth, /max-w-\[1560px\]/);
assert.match(AppLayoutClasses.pagePaddingX, /px-4 sm:px-6 lg:px-8/);
assert.match(AppVisualClasses.mainScroll, /px-4/);
assert.match(AppVisualClasses.mainScroll, /sm:px-6/);
assert.match(AppVisualClasses.mainScroll, /lg:px-10/);

const supportPage = read("app/app/support/requests/page.tsx");
assert.match(supportPage, /AppLayoutClasses\.pagePaddingX/);
const supportPanel = read("components/app/app-portal/SupportRequestsCenterPanel.tsx");
assert.match(supportPanel, /AppLayoutClasses\.pageWidth/);

const profilePage = read("app/app/profile/page.tsx");
assert.match(profilePage, /AppLayoutClasses\.pagePaddingX/);
assert.match(profilePage, /AppHubShell/);
assert.match(profilePage, /AppCustomerProfilePanel/);

const hubShell = read("components/app/hubs/AppHubShell.tsx");
assert.match(hubShell, /AppContentWidth/);
const contentWidth = read("components/app/design/AppContentWidth.tsx");
assert.match(contentWidth, /AppLayoutClasses\.pageWidth/);

const panel = read("components/app/account-profile/AppCustomerProfilePanel.tsx");
assert.doesNotMatch(panel, /max-w-\[50rem\]/);
assert.match(panel, /w-full min-w-0 space-y-6/);

const formStyles = read("lib/app/account-profile/form-styles.ts");
assert.doesNotMatch(formStyles, /max-w-\[50rem\]/);
assert.match(formStyles, /w-full min-w-0/);

console.log(
  "profile-container-width: PASS",
  `reference=${APP_CONTENT_MAX_WIDTH_PX}px`,
  "token=AppLayoutClasses.pageWidth",
  "pad=AppLayoutClasses.pagePaddingX",
);
