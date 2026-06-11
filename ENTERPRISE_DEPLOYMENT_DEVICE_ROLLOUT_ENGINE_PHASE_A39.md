# Enterprise Deployment & Device Rollout Engine — Phase A.39

## Vision

**Enterprise Deployment & Device Rollout Engine** — Customer App + Install Engine capability for IT administrators to manage licenses, seats, device enrollment, and enterprise rollout readiness without surveillance tooling.

## Feature owner

- **Customer App** — IT admin dashboard at `/app/enterprise-deployment-device-rollout-engine`
- **Install Engine** — device enrollment API at `/api/install/device-enroll`

## Build order (this phase)

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | License and seat structure | **Implemented** — `organization_licenses`, `organization_seats` |
| 2 | Device registration | **Implemented** — `registered_devices`, `register_device` |
| 3 | Email invite deployment | **Implemented** — `deployment_email_invites`, `send_deployment_email_invite` |
| 4 | License key activation | **Implemented** — hashed keys, `activate_license_key` |
| 5 | Deployment dashboard | **Implemented** — dashboard RPC + UI panel |
| 6 | Enrollment token structure | **Implemented** — hashed tokens, shown once |
| 7 | SSO readiness model | **Scaffold** — `sso_provider_configs`, no OAuth flow |
| 8 | Enterprise installer requirements | **Documented** — `constants.ts` + installer settings |
| 9 | SCIM readiness model | **Scaffold** — tables + `/api/deployment/scim` stub |
| 10 | Hybrid connector preparation | **Scaffold** — docs + constants only |

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260810000000_enterprise_deployment_device_rollout_engine_phase_a39.sql` |
| Prefix | `_edd_` |
| Lib | `lib/aipify/enterprise-deployment-device-rollout-engine/` |
| Core | `lib/core/enterprise-deployment-device-rollout.ts` |
| API | `/api/aipify/enterprise-deployment-device-rollout-engine/*`, `/api/deployment/*`, `/api/install/device-enroll` |
| UI | `/app/enterprise-deployment-device-rollout-engine` |
| KC FAQ | `content/knowledge/aipify/enterprise-deployment-device-rollout-engine/faq/` |

## Core tables

- `organization_licenses` — `license_key_hash`, type, seat limits, status
- `organization_seats` — user seat assignments
- `registered_devices` — device metadata, hashed identifier
- `deployment_enrollment_tokens` — hashed tokens, domain restrictions
- `organization_domains` — domain verification readiness
- `identity_group_mappings` — IdP group → Aipify role
- `sso_provider_configs` — SSO readiness (no OAuth yet)
- `scim_provisioning_settings` — SCIM readiness scaffold

## RPCs

- `get_enterprise_deployment_device_rollout_engine_dashboard()`
- `get_enterprise_deployment_device_rollout_engine_card()`
- `create_organization_license()` — returns raw key once
- `activate_license_key()`
- `assign_organization_seat()` / `revoke_organization_seat()`
- `create_deployment_enrollment_token()` — returns raw token once
- `revoke_deployment_enrollment_token()`
- `send_deployment_email_invite()`
- `register_device()` / `revoke_registered_device()` / `record_device_heartbeat()`
- `save_sso_provider_config()` / `save_scim_provisioning_settings()`
- `add_organization_deployment_domain()` / `save_identity_group_mapping()`
- `list_organization_licenses()` / `list_registered_devices()`

## Permissions

- `deployment.view` · `deployment.manage` · `deployment.enroll` · `deployment.revoke`
- `licenses.manage` · `devices.manage`

## Privacy rules

- **No keystroke monitoring**
- **No screen monitoring**
- Device records store name, OS, companion version, last-seen metadata only
- License keys and enrollment tokens are SHA-256 hashed — raw values shown once at creation

## Silent install parameters

Defined in `lib/aipify/enterprise-deployment-device-rollout-engine/constants.ts`:

- `AIPIFY_TENANT_SLUG`
- `AIPIFY_REGION`
- `AIPIFY_ENROLLMENT_TOKEN`
- `AIPIFY_AUTO_START`
- `AIPIFY_SSO_REQUIRED`

## Integrations

- **Desktop Command Center** (`apps/command-center/`, `lib/desktop/`) — device enrollment + heartbeat
- **Enterprise Readiness (A.30)** — governance and deployment readiness links
- **Install Engine (A.22)** — `/api/install/device-enroll`
- **Subscription Plan Management (A.11)** — seat sync settings scaffold
- **Desktop Companion (A.38)** — scaffold only; see `DESKTOP_COMPANION_PHASE_A38.md`
- **API Platform (A.21)** — scaffold only; see `API_PLATFORM_PHASE_A21.md`

## Principle

Business logic in RPCs; panels are thin clients. Tenant-scoped via `organizations.id`. Humans control rollout — Aipify prepares and audits.
