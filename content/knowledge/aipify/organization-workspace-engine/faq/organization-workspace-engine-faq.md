# Organization & Workspace Engine — FAQ

## What is the organization and workspace hierarchy?

Aipify structures tenant access as **Organization → Workspace → Users → Roles → Permissions**. Your organization is the tenant boundary (from Multi-Tenant Architecture, A.1). Workspaces are isolated operational contexts within that organization — each can scope Knowledge Center content, support queues, automations, tasks, and audit without duplicating engine tables.

## How does workspace isolation work?

Every workspace belongs to exactly one `organization_id`. Queries and RPCs always filter by the active organization from `organization_user_context`. Workspace data never crosses tenant boundaries. Workspace members, roles, and audit logs are scoped to their workspace within the organization.

## What is the difference between organization switching and workspace switching?

**Organization switching** (A.1) changes your tenant context — which customer organization you operate in. **Workspace switching** (A.75) changes your operational context *within* the current organization — for example from Executive Office to Support. The two are independent; changing workspace does not change organization.

## Can I create custom workspace roles?

Yes. Organizations with `allow_custom_roles` enabled can define `workspace_custom_roles` with a JSON permissions list. Members can be assigned a built-in role (`owner`, `administrator`, `manager`, `employee`, `support_agent`, `moderator`, `viewer`) or a custom role via `custom_role_id`. Built-in workspace role permissions can also be configured per workspace or as org-level templates in `workspace_role_permissions`.

## Who can create and manage workspaces?

Permissions are enforced server-side via `workspaces.*` keys: `workspaces.view`, `workspaces.create`, `workspaces.manage`, `workspaces.members.manage`, `workspaces.roles.manage`, `workspaces.settings.manage`, `workspaces.audit.view`, and `workspaces.switch`. Owners and administrators have full workspace permissions by default; managers can manage members; all roles can switch when permitted.

## What integrations does each workspace scaffold?

Each workspace exposes metadata-only integration links to Knowledge Center, Support AI queues, PAME memories, Action Center automations, Meeting Collaboration, Unified Tasks, and Audit Accountability. These are scaffold links — they do not duplicate PAME or Knowledge Center tables. Future phases will bind `workspace_id` scope in those engines.

## What dogfood workspaces are seeded?

For **Aipify Group AS** (`aipify-group`): Executive Office, Development, Support, Operations, Sales. For **Unonight** (`unonight`): Admin, Moderation, Customer Support, Marketplace Operations. Seeds run only when the organization exists and has no workspaces yet.

## How does Implementation Blueprint Phase 1 relate to this engine?

Phase 1 — Organization & Workspace Foundation defines the ABOS structural base: Organization → Workspaces → Users → Roles → Permissions → Companion Experiences. The Organization & Workspace Engine (A.75) implements this foundation. See [IMPLEMENTATION_BLUEPRINT_PHASE1_ORGANIZATION_WORKSPACE_FOUNDATION.md](../../../IMPLEMENTATION_BLUEPRINT_PHASE1_ORGANIZATION_WORKSPACE_FOUNDATION.md).

## What is the ABOS companion foundation?

Per-organization companion settings (metadata): communication tone, humor level, bell moments, Self Love reminders, recognition features, and Presence & Comfort. Configured at `/app/organization-workspace-engine` — Aipify identity stays consistent while allowing appropriate customization.

## What are Phase 1 success criteria?

Multiple organizations, independent workspaces, secure user membership, enforceable permissions, tenant isolation, per-organization Knowledge Centers, and safe companion preference configuration. The dashboard shows live status for your organization.
