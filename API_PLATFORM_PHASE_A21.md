# API Platform — Phase A.21 (Scaffold)

## Status

**Scaffold only** — referenced by Phase A.39 for future enterprise API key provisioning and device enrollment webhooks. Full A.21 API Platform is a separate phase.

## Existing related surfaces

- App Ecosystem & Developer Platform (Phase 75): `/app/apps`, `/developers`
- Platform Admin APIs: `/api/platform/*` (Aipify Group AS only)

## A.39 integration points

- Device enrollment REST API: `/api/install/device-enroll`
- Deployment APIs: `/api/deployment/*`
- SCIM stub: `/api/deployment/scim` (readiness only)

## Not built in A.21 scaffold

- Customer-facing API key management UI
- OAuth2 client credentials for tenant API access
- Webhook subscription registry
