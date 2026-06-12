# Identity, Roles & Permission Engine — Phase A.2

## Vision

**Every user, role, permission, and AI action operates within secure boundaries.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260707000000_identity_permissions_engine_phase_a2.sql` |
| Blueprint alignment | `supabase/migrations/20260947000000_implementation_blueprint_phase2_user_role_permission.sql` |
| Blueprint doc | [IMPLEMENTATION_BLUEPRINT_PHASE2_USER_ROLE_PERMISSION_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE2_USER_ROLE_PERMISSION_FOUNDATION.md) |
| Prefix | `_irp_` · decision type: `identity_permissions` |
| Lib | `lib/aipify/identity-permissions/`, `lib/core/permissions.ts`, `lib/core/identity-permissions.ts` |
| API | `/api/aipify/identity-permissions/*`, `/api/identity/*` |
| UI | `/app/identity-access` |
| ILM | `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase2-user-role-permission.txt` |
| KC FAQ | `content/knowledge/aipify/identity-permissions/faq/identity-permissions-faq.md`, `implementation-blueprint-phase2-faq.md` |

## Core components

1. **Identity Management** — account status, login tracking, failed login monitoring, session revocation
2. **Role Framework** — organization-specific roles (owner → viewer)
3. **Permission Catalog** — 18 granular permissions (`users.view`, `ai.approve`, etc.)
4. **Role Permissions** — tenant-customizable `organization_role_permissions`
5. **User Overrides** — `organization_user_permissions` for exceptions
6. **Permission Evaluation** — membership → account status → role → override → module enabled
7. **Approval Engine** — low (auto), medium (human), high (owner/admin)
8. **AI Risk Classification** — low / medium / high action categories
9. **Session Security** — `identity_sessions`, revoke all devices
10. **MFA Readiness** — architecture for authenticator, email, SMS, passkeys

## Permission evaluation order

1. Verify tenant membership
2. Verify user account status
3. Verify role permissions
4. Verify user overrides
5. Verify module enabled
6. Approve or deny request

## RPCs

- `get_identity_permissions_dashboard()` — identity dashboard (Phase 2 blueprint fields)
- `get_identity_permissions_card()` — summary card
- `save_identity_access_review_settings(jsonb)` — access review prefs
- `save_identity_companion_permission_prefs(jsonb)` — companion permission prefs
- `check_identity_permission(text)` — evaluate single permission
- `invite_organization_user(text, text)` — invite user
- `update_organization_user_role(uuid, text)` — change role
- `suspend_organization_user(uuid)` — suspend user
- `grant_user_permission(uuid, text, boolean)` — permission override
- `create_identity_approval_request(text, text, jsonb)` — submit approval
- `resolve_identity_approval_request(uuid, text)` — approve/reject
- `record_identity_login(boolean)` — login/failed login tracking
- `list_identity_sessions()` / `revoke_identity_sessions(boolean, uuid)` — session management

## TypeScript helpers

`lib/core/permissions.ts`:

- `hasPermission()`, `requirePermission()`
- `requireApproval()`, `isOwner()`, `isAdministrator()`
- `canApproveRisk()`, `canAccessModule()`

## API endpoints

- `GET /api/aipify/identity-permissions/dashboard`
- `GET /api/aipify/identity-permissions/card`
- `POST /api/aipify/identity-permissions/access-review-settings`
- `POST /api/aipify/identity-permissions/companion-permission-prefs`
- `GET /api/identity/permissions?key=`
- `GET|POST /api/identity/sessions`
- `POST /api/identity/approvals/[id]/approve`
- `POST /api/identity/approvals/[id]/reject`

## Principle

Only low-risk AI actions may execute automatically. Medium and high-risk actions require human approval. All identity actions are audit-logged.
