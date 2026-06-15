# Release Management & Change Log Center — Phase 277

**Feature owner:** Platform Admin  
**Route:** `/platform/product/release-center`  
**Module:** `lib/release-center/`  
**Migration:** `supabase/migrations/20261464000000_release_management_change_log_center_phase277.sql`

## Purpose

Centralized system for planning, documenting, approving, and communicating all platform changes.

## Capabilities

| Area | Description |
|------|-------------|
| Release types | Major, minor, hotfix, security, infrastructure, experimental |
| Overview cards | Upcoming, in testing, production, hotfixes, pending notifications, completed |
| Change log | New features, improvements, bug fixes, security, performance, deprecated |
| Status workflow | Planned → Development → Testing → Validation → Approved → Released / Rolled back |
| Approvals | Super Admin, Product Owner, Technical Lead for major/security/enterprise-impacting |
| Communications | Customer Portal, Announcement Center, email, in-app notifications |
| Audience targeting | All customers, enterprise, specific plans, Growth Partners, internal teams |
| Rollback tracking | Reason, impact assessment, resolution notes, recovery actions |
| Release calendar | Upcoming releases, blackout periods, maintenance windows, enterprise notices |
| Audit logging | Created, modified, approvals, published, rollback initiated |

## APIs

| Method | Path | RPC |
|--------|------|-----|
| GET | `/api/release-center/overview` | `get_release_center(p_filters)` |
| POST | `/api/release-center/actions` | `record_release_center_action(p_payload)` |

## Founding principle

Customers should never wonder what changed. Transparency builds trust. Communication reduces uncertainty.

Aipify Group AS — Bergen, Norway. For the world.
