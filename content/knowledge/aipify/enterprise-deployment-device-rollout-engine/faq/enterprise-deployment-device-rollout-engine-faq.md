# Enterprise Deployment & Device Rollout Engine — FAQ

## What is this engine?

Enterprise Deployment & Device Rollout Engine is a Customer App engine (Phase A.39) with IT admin dashboard at `/app/enterprise-deployment-device-rollout-engine`. It manages organization licenses, seat assignments, device enrollment, and enterprise rollout readiness.

## Who can access the deployment dashboard?

Owners and administrators have full deployment, license, and device management access. Managers can view deployment status and manage devices. Viewers have read-only access. Server-side RPCs enforce `deployment.*`, `licenses.manage`, and `devices.manage` permissions.

## Are license keys and enrollment tokens stored securely?

Yes. Raw license keys and enrollment tokens are SHA-256 hashed before storage. Raw values are returned only once at creation — never stored or displayed again.

## What deployment methods are supported?

Email invite, license key activation, enrollment tokens, SSO readiness configuration, managed enterprise (Intune/Jamf-style tokens via silent install params), hybrid connector documentation, and future on-prem hooks. Full SSO OAuth and SCIM sync are readiness scaffolds only in this phase.

## Does Aipify monitor keystrokes or screens on enrolled devices?

No. Aipify never monitors keystrokes or screens. Device registration stores metadata only: device name, type, OS, companion version, enrollment method, and last-seen timestamp.

## How do devices enroll?

Devices enroll via `/api/install/device-enroll` (Install Engine) or Customer App APIs using an enrollment token, license key seat activation, or IT-managed silent install parameters (`AIPIFY_ENROLLMENT_TOKEN`, etc.). Device identifiers are hashed server-side.

## Where does business logic live?

All business logic is in Supabase RPCs (`_edd_*` helpers). API routes and dashboard panels are thin clients.

## How does this integrate with Desktop Command Center?

Enrolled devices connect to Aipify Core through the Desktop Command Center client (`apps/command-center/`, `lib/desktop/`). Heartbeats update `last_seen_at` via `record_device_heartbeat`. Stale devices are flagged automatically.

## What is SSO/SCIM readiness?

SSO provider configs and SCIM provisioning settings tables store tenant configuration for future OAuth and SCIM phases. This phase does not implement full IdP OAuth flows or SCIM endpoint provisioning — only configuration and audit scaffolding.

## How do I get enterprise installers?

Installer download metadata is tracked in deployment settings. macOS DMG, Windows MSI, and Linux DEB packages are documented with silent-install parameter requirements — packaging links are pending IT distribution build pipeline.
