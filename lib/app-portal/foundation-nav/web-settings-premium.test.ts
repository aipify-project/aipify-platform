/**
 * Kompis Web settings overview stays a four-card hub.
 * Integrations and notifications remain settings entries, not sidebar rows.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const page = readFileSync(join(ROOT, "app/app/website-kompis/settings/page.tsx"), "utf8");

assert.match(page, /suppressPageHeader/);
assert.match(page, /kompisWebAppearance/);
assert.match(page, /accountIntegrations/);
assert.match(page, /accountNotifications/);
assert.match(page, /kompisOperatorPreserved/);
assert.match(page, /lg:grid-cols-2/);
assert.doesNotMatch(page, /kompisWebModules/);

const appearance = readFileSync(join(ROOT, "app/app/website-kompis/appearance/page.tsx"), "utf8");
assert.match(appearance, /DomainLicenseCenterPanel/);
assert.match(appearance, /WebsiteKompisSettingsIntro/);

const integrations = readFileSync(join(ROOT, "app/app/account/integrations/page.tsx"), "utf8");
assert.match(integrations, /renderAppPortalIntegrationsHubPage/);
assert.match(integrations, /WebsiteKompisSettingsIntro/);

const notifications = readFileSync(join(ROOT, "app/app/account/notifications/page.tsx"), "utf8");
assert.match(notifications, /NotificationSettingsPanel/);
assert.match(notifications, /WebsiteKompisSettingsIntro/);

const operator = readFileSync(join(ROOT, "app/app/kompis/page.tsx"), "utf8");
assert.match(operator, /KompisOperatorWorkspacePanel/);

console.log("web-settings-premium.test.ts: OK");
