# Desktop Companion — Phase A.38 (Scaffold)

## Status

**Scaffold only** — referenced by Phase A.39 Enterprise Deployment & Device Rollout Engine for device enrollment integration. Full A.38 implementation is a separate phase.

## Existing foundation

- Desktop Companion (Phase 61): `/app/desktop`, `lib/aipify/desktop/`
- Desktop Command Center (Phase 27): `apps/command-center/`, `lib/desktop/`

## A.39 integration points

- Device enrollment via `register_device` with `enrollment_method = 'silent_install'`
- Heartbeat via `record_device_heartbeat`
- Silent install params in `lib/aipify/enterprise-deployment-device-rollout-engine/constants.ts`

## Not built in A.38 scaffold

- Dedicated A.38 migration or dashboard route
- Separate A.38 permission namespace
