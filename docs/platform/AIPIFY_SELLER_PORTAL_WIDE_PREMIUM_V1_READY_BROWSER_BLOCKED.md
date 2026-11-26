# AIPIFY_SELLER_PORTAL_WIDE_PREMIUM_V1_READY_BROWSER_BLOCKED

Date: 2026-11-26

## Delivery

| Field | Value |
|---|---|
| Status | `READY_BROWSER_BLOCKED` |
| PR | https://github.com/aipify-project/aipify-platform/pull/377 |
| Branch | `feat/seller-portal-wide-premium-redesign-v1-20261126` |
| HEAD | `41d5a85c6132202751cd50a5a83aae5fb87311af` |
| Main baseline | `67713f889ea8d1ed741065e181312024a1e6cc27` (#376 included; #375 already on main) |
| Merge-SHA | not merged — visual QA gate open |
| Production deploy | not started |

## What changed

### Shell
- Fixed desktop left nav (~256px) along the viewport
- Content topbar over the work area (route title, language, messages, notifications, profile menu, sign out)
- Mobile drawer with Escape / backdrop / focus return
- Removed centered `max-w-[1600px]` shell clamp and nested panel clamps

### Design primitives (`components/partners-portal/design/`)
- `AipifyCard`, `AipifyPageHeader`, `AipifyStatCard`, `AipifyStatusBadge`, `AipifyAlert`, `AipifyTabs`
- Tokens in `lib/partners-portal/design-tokens.ts`

### Pages / panels
- Overview dashboard: profile/intro card + honest KPI row from Core portal bundle
- Workspace panel: gate UI only (no repeated hero/canvas)
- Help, messages, products, links, notifications: full-width under shell
- Profile dropdown: profile + help/settings

### Locales
- `settingsMenu` added under `certifiedSalesPartner.topbar` for en/no/sv/da/pl/uk/es

## Technical verification

- `tsc --noEmit` PASS
- `seller-portal-wide-shell.test.ts` PASS
- `nav-performance.test.ts` PASS
- `csp-portal-v7.test.ts` PASS (Stripe assertion aligned to existing service-role caller; no payment code change)

## Visual QA — blocked

No approved Certified Sales Partner browser session was available in this agent run.

Per job §10–§12: **do not auto-merge / Production deploy** until authenticated desktop + mobile screenshots of the new shell and key routes are reviewed PASS.

Mark remaining work: `BROWSER_AUTH_BLOCKED`.

## Explicit scope guarantees

- `NO_SQL`
- `NO_PAYMENT_CHANGES`
- `NO_PLATFORM_ADMIN_DIFF`
- `NO_APP_CUSTOMER_DIFF`

Preserved: CSP session provider, #372 help/notifications separation, attribution/links, commission rules, Academy Core, marketing language separation.
