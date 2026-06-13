# Aipify Update Engine

**Phase 18 · Version 1.0 · Critical**

Safe, controlled, logged, and reversible version deployment across all Aipify installations.

**Prerequisites:** [CORE_FOUNDATION.md](./CORE_FOUNDATION.md) · [OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md) · [ARCHITECTURE.md](./ARCHITECTURE.md) · [INSTALL_ENGINE.md](./INSTALL_ENGINE.md)

**Code:** `lib/update/` · Platform: `app/platform/updates/` · Embedded: `app/api/install/version`, `app/api/install/update-status`

---

## 1. Core principle

**Aipify updates must only update Aipify software.**

Updates must never silently alter customer data, configuration, billing, domains, or permissions. No installation database may change unless the update includes an **approved database migration**.

---

## 2. Update types

| Type | Description |
|------|-------------|
| `patch` | Small fix. No database change. |
| `minor` | New feature. No destructive change. |
| `major` | Large change. May require migration. |
| `security` | Urgent security fix. |
| `database_migration` | Requires special approval. |

Constants: `UPDATE_TYPES` in `lib/update/engine.ts`

---

## 3. Update channels & rollout

Channels: `internal` · `pilot` · `stable` · `enterprise`

Rollout order:

1. Aipify internal
2. Unonight pilot
3. Selected beta customers (pilot channel)
4. All stable customers
5. Enterprise customers

---

## 4. Maintenance windows

`platform_updates` table fields: version, title, description, `scheduled_at`, `expected_duration_minutes`, status, update type/channel, migration metadata, rollback plan.

Statuses: `draft` · `scheduled` · `in_progress` · `completed` · `failed` · `rolled_back`

---

## 5. Version tracking (per installation)

Each installation tracks:

- `version` (current)
- `target_version`
- `last_update_at`
- `update_status`
- `rollback_available`
- `update_channel`

---

## 6. Database safety

Default: software updates **must not** touch customer databases.

Migrations require: explicit file, description, affected tables, backup strategy, rollback plan, and approval.

Forbidden without approval (`FORBIDDEN_MIGRATION_OPERATIONS` in `lib/update/safety.ts`):

- Delete table/column/customer data
- Overwrite customer settings
- Reset installation configuration
- Change billing data or permissions

Validation: `validateDatabaseMigration()` in `lib/update/safety.ts`

---

## 7. Customer notifications

Channels: Presence Center · notification bell · email · Customer Control Center · Platform Admin

Customers see: what updates, when, expected downtime, whether action is required, data impact, support contact.

Reassurance: *"Nothing is required from you. Aipify will continue monitoring after the update."*

---

## 8. Presence integration

| Phase | Message |
|-------|---------|
| Scheduled | "Scheduled update tonight at {time}." |
| In progress | "Aipify is updating safely." |
| Completed | "Update completed successfully. No action required." |
| Failed | "Aipify detected an update issue and requires review." |

**Code:** `lib/update/presence.ts`

---

## 9. Rollback

Every update defines: `rollback_available`, `rollback_steps`, `previous_version`, `rollback_deadline`.

On failure: mark installation failed, alert Platform Admin, notify customer, attempt safe rollback if allowed.

**Code:** `lib/update/rollback.ts`

---

## 10. Audit logging

Events: `update_created` · `update_scheduled` · `notification_sent` · `update_started` · `installation_updated` · `installation_failed` · `rollback_started` · `rollback_completed` · `migration_approved` · `migration_rejected`

Table: `platform_update_audit_log` · RPC: `record_update_audit_event`

---

## 11. Architecture placement

| Layer | Responsibility | Paths |
|-------|----------------|-------|
| **Platform Admin** | Schedule updates, rollout, audit, rollback | `/platform/updates`, `/platform/updates/[id]` |
| **Customer App** | Read-only version & maintenance visibility | Settings → Updates (`/app/settings/updates`) |
| **Embedded** | Report version, update success/failure | `/api/install/version`, `/api/install/update-status` |

---

## 12. APIs & RPCs

| Endpoint / RPC | Purpose |
|----------------|---------|
| `POST /api/install/version` | Embedded version report |
| `POST /api/install/update-status` | Update result + heartbeat |
| `list_platform_updates()` | Platform list |
| `get_platform_update_detail(id)` | Platform detail |
| `get_customer_update_overview()` | Customer read-only view |
| `record_installation_version_report()` | Persist embedded reports |

---

## 13. Success criteria

- Schedule updates with maintenance windows
- Notify customers before maintenance
- Track versions per installation
- Log all update events
- Require approval for database migrations
- Rollback structure exists
- Platform Admin monitors rollout
- Customer data protected

**Final principle:** Aipify must be trusted. Customers must know Aipify can improve without risking their business data.
