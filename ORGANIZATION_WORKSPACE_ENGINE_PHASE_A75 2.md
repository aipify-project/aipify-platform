# Organization & Workspace Engine — Phase A.75

**Feature owner:** Customer App

Organization → Workspace → Users → Roles → Permissions hierarchy with isolated operational contexts per workspace.

## Extends

- Multi-Tenant Architecture Engine (A.1) — `organizations`, `organization_users`, `organization_user_context`
- Identity, Roles & Permission Engine (A.2) — `aipify_permissions`, `organization_role_permissions`, `_irp_*`

## Route

`/app/organization-workspace-engine` — nav id `organizationWorkspaceEngine`

## Tables

- `organization_workspaces` — name, slug, description, status, settings
- `workspace_members` — workspace_id, user_id, role, custom_role_id, status
- `workspace_custom_roles` — organization_id, name, permissions jsonb
- `workspace_role_permissions` — org template or workspace-specific role permissions
- `workspace_user_context` — selected workspace session per user per org
- `workspace_audit_logs` — workspace_id, action, actor, metadata only
- `organization_workspace_settings` — org-level defaults

## Workspace roles

`owner` · `administrator` · `manager` · `employee` · `support_agent` · `moderator` · `viewer` · custom

## Permissions

`workspaces.view` · `workspaces.manage` · `workspaces.create` · `workspaces.members.manage` · `workspaces.roles.manage` · `workspaces.settings.manage` · `workspaces.audit.view` · `workspaces.switch`

## RPCs

Dashboard, card, list workspaces, get/switch current workspace, create/update/archive workspace, invite/update member, list/create custom roles, get/save workspace permissions, save organization companion foundation, export summary.

## Dogfood seeds

- `aipify-group`: Executive Office, Development, Support, Operations, Sales
- `unonight`: Admin, Moderation, Customer Support, Marketplace Operations

## Implementation Blueprint Phase 1 alignment

See [IMPLEMENTATION_BLUEPRINT_PHASE1_ORGANIZATION_WORKSPACE_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE1_ORGANIZATION_WORKSPACE_FOUNDATION.md).

Migration `20260946000000_implementation_blueprint_phase1_org_workspace.sql` extends dashboard/card with mission, build philosophy, ABOS principle, success criteria, companion foundation (`metadata.companion_foundation`), and blueprint integration links. RPC `save_organization_companion_foundation(p_payload)`.

Metadata only — integration links scaffold KC, PAME, support, automations without duplicating engine tables.
