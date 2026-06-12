# Implementation Blueprint Phase 5 — Integration & Connectivity Foundation FAQ

## What is Phase 5 of the Implementation Blueprint?

Phase 5 aligns the Integration Engine (Phase A.8) with ABOS integration and connectivity requirements — secure connections, permission scopes, audit trails, modular connectors, and reduced setup friction.

## How is this different from Install Engine (Phase 17)?

Install Engine discovers environments and recommends integrations during onboarding. Integration Engine manages **ongoing** tenant-scoped connections — credentials, sync, webhooks, and lifecycle events at `/app/integration-engine`.

## What platform categories are prioritized?

Commerce (Shopify, WooCommerce, WordPress), Communication (Gmail, Outlook, Slack, Teams), Productivity (Google/MS Calendar, tasks), and Support (Native Aipify, future ticketing). Most connectors are catalog scaffolds until individually released.

## How are credentials protected?

Sensitive credentials are stored in `integration_credential_vault` server-side. The frontend receives configuration metadata only — never secrets.

## What integration events are audited?

Created, updated, disabled, connected, credential rotation, sync executed/failed, webhook received/failed — recorded in organization audit logs via `_ige_log()`.

## What permissions are required?

`integrations.view`, `integrations.create`, `integrations.update`, `integrations.disable`, `integrations.delete`, and `integrations.sync` — scoped per role through `organization_role_permissions`.

## Can integrations be disabled?

Yes. Organizations can disable integrations from the dashboard or via the `integrations.disable` permission. Credentials remain vaulted until explicitly revoked.

## What is the Self Love scaffold?

Self Love (A.76 planned) will reduce integration burden and celebrate early wins. Phase 5 includes a dashboard note only — Integration Engine does not store wellbeing content.

## What are the Phase 5 success criteria?

Connect services, scoped permissions, audit trails, modular catalog, reduced friction via sync, and cross-system assistance via webhooks — computed live on the dashboard from existing integration tables.

## Where does Unonight fit?

Unonight is the first external pilot integration (`connect_unonight_integration`). Aipify Group validates Gmail, Google Calendar, and Knowledge Center sync internally.
