# Implementation Blueprint Phase 34 — API & Developer Platform FAQ

## What is Phase 34 of the Implementation Blueprint?

Phase 34 promotes API Platform Engine Phase A.21 from scaffold to full Customer App engine — secure tenant APIs, developer governance, and extensibility cross-links.

## Which engine is the primary surface?

**API Platform Engine Phase A.21** at `/app/api-platform-engine`. Phase 34 extends A.21 RPCs, dashboard, and ILM vocabulary — do not duplicate App Ecosystem or Developer Portal.

## How does Phase 34 relate to App Ecosystem Phase 75?

**App Ecosystem Phase 75** at `/app/apps` handles installed apps, catalog, and install flow. **Developer Portal** at `/developers` provides SDK and publishing. Phase 34 cross-links these surfaces — do not duplicate app install logic.

## How is A.21 different from Platform Admin APIs?

**Platform Admin** `/api/platform/*` is for Aipify Group AS only. **A.21** is the customer tenant API platform — keys, webhooks, and audit metadata scoped to one organization.

## What developer objectives does Phase 34 cover?

Public APIs, Partner APIs, secure authentication, API key management, webhooks, developer documentation, and sandbox environments — from `_apdbp_developer_objectives()`.

## What API categories are documented?

Core (organizations through support), Companion (conversations through recognition), Commerce (products through financial events), and Partner (Sales Expert Portal through lifecycle visibility) — from `_apdbp_api_categories()`.

## What security principles apply?

Scoped permissions, audit logging, rate limits, token expiration, secure secret handling, and elevated scope approval — from `_apdbp_security_principles()`.

## Are full API keys stored in the database?

No. Only key prefix and hash are stored. Webhook secrets use `secret_ref` vault references — never raw secrets in the database.

## What are the Phase 34 success criteria?

Computed live by `_apdbp_success_criteria(org_id)`: developers build securely, integrations accelerate adoption, partner capabilities expand, extensibility increases, governance strong, sandbox available.

## What does engagement summary show?

Live counts from `_apdbp_engagement_summary(org_id)`: active keys, pending approval keys, webhooks, audit events (30d), sandbox status — counts only, no PII.

## Where does dogfooding happen?

**Aipify Group AS** validates API key lifecycle, webhook metadata, and audit logging internally. **Unonight** is the first external pilot for integration experiences.

## Where is the dashboard?

`/app/api-platform-engine` — API: `GET /api/aipify/api-platform-engine/dashboard`

## Which permissions are required?

`api_platform.view` (dashboard), `api_platform.manage` (settings and webhooks), `api_platform.keys` (key creation — elevated scopes require approval).
