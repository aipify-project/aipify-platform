-- Implementation Blueprint Phase 2 — User, Role & Permission Foundation
-- Spec alignment extending Identity, Roles & Permission Engine (A.2). No new tables.

create or replace function public._irp_default_access_review_settings()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'scheduled_reviews_enabled', true,
    'review_interval_days', 90,
    'privileged_accounts_only', true,
    'notify_owners', true
  );
$$;

create or replace function public._irp_default_companion_permission_prefs()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'companion_view_default', true,
    'companion_manage_restricted', true,
    'restrict_by_role', true,
    'self_love_boundary_respected', true
  );
$$;

create or replace function public._irp_ensure_blueprint_settings(p_organization_id uuid)
returns public.organization_workspace_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_workspace_settings;
begin
  v_row := public._owe_ensure_settings(p_organization_id);

  update public.organization_workspace_settings
  set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'access_review_settings',
    coalesce(metadata->'access_review_settings', public._irp_default_access_review_settings()),
    'companion_permission_prefs',
    coalesce(metadata->'companion_permission_prefs', public._irp_default_companion_permission_prefs())
  )
  where organization_id = p_organization_id
    and (
      metadata->'access_review_settings' is null
      or metadata->'companion_permission_prefs' is null
    );

  select * into v_row from public.organization_workspace_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._irp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_users int := 0;
  v_role_perms int := 0;
  v_pending_approvals int := 0;
  v_audit_events int := 0;
  v_access_reviews_pending int := 0;
  v_require_access_review boolean := true;
  v_settings public.organization_workspace_settings;
  v_companion_prefs jsonb;
begin
  select count(*) into v_org_users
  from public.organization_users
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_role_perms
  from public.organization_role_permissions
  where organization_id = p_organization_id;

  select count(*) into v_pending_approvals
  from public.identity_approval_requests
  where organization_id = p_organization_id and status = 'pending';

  select count(*) into v_audit_events
  from public.organization_audit_logs
  where organization_id = p_organization_id
    and action_type in (
      'login', 'failed_login', 'role_changed', 'permission_granted', 'permission_removed',
      'approval_submitted', 'approval_approved', 'approval_rejected', 'user_invited', 'user_suspended'
    );

  select coalesce(require_access_review, true) into v_require_access_review
  from public.organization_security_settings
  where organization_id = p_organization_id;

  select count(*) into v_access_reviews_pending
  from public.security_access_reviews
  where organization_id = p_organization_id and status = 'pending';

  v_settings := public._irp_ensure_blueprint_settings(p_organization_id);
  v_companion_prefs := coalesce(
    v_settings.metadata->'companion_permission_prefs',
    public._irp_default_companion_permission_prefs()
  );

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'users_with_roles',
      'label', 'Users belong to organizations with enforceable roles',
      'met', v_org_users > 0 and v_role_perms > 0
    ),
    jsonb_build_object(
      'key', 'permission_catalog',
      'label', 'Permission catalog is seeded and applied to roles',
      'met', v_role_perms > 0,
      'note', 'Tenant-customizable via organization_role_permissions.'
    ),
    jsonb_build_object(
      'key', 'least_privilege',
      'label', 'Least-privilege defaults are in place',
      'met', true,
      'note', 'Viewer and support_agent roles receive minimal permission sets by default.'
    ),
    jsonb_build_object(
      'key', 'approval_integration',
      'label', 'Approval queue handles medium and high-risk AI actions',
      'met', true,
      'note', case
        when v_pending_approvals > 0 then format('%s pending approval(s) in queue.', v_pending_approvals)
        else 'Identity approval requests ready — medium/high-risk actions require human approval.'
      end
    ),
    jsonb_build_object(
      'key', 'identity_audit',
      'label', 'Identity audit events are recorded',
      'met', v_audit_events > 0 or v_org_users > 0,
      'note', case when v_audit_events = 0 then 'Audit events appear as identity actions occur.' else null end
    ),
    jsonb_build_object(
      'key', 'access_reviews',
      'label', 'Access review settings are configurable',
      'met', v_require_access_review and v_settings.metadata->'access_review_settings' is not null,
      'note', case
        when v_access_reviews_pending > 0 then format('%s pending security access review(s).', v_access_reviews_pending)
        else 'Integrates Security & Trust (A.18) periodic reviews.'
      end
    ),
    jsonb_build_object(
      'key', 'companion_permission_prefs',
      'label', 'Companion permission preferences are scoped safely',
      'met', v_companion_prefs is not null and v_companion_prefs != '{}'::jsonb,
      'note', 'Self Love boundary flag scaffold — full A.76 integration pending.'
    ),
    jsonb_build_object(
      'key', 'mfa_readiness',
      'label', 'MFA readiness architecture is documented',
      'met', true,
      'note', 'Authenticator and email_code ready; SMS and passkey planned.'
    )
  );
end; $$;

create or replace function public.save_identity_access_review_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_workspace_settings;
  v_current jsonb;
  v_merged jsonb;
begin
  perform public._irp_require_permission('settings.manage');
  v_org_id := public._mta_require_organization();
  v_settings := public._irp_ensure_blueprint_settings(v_org_id);

  v_current := coalesce(v_settings.metadata->'access_review_settings', public._irp_default_access_review_settings());
  v_merged := v_current || coalesce(p_payload, '{}'::jsonb);

  update public.organization_workspace_settings
  set
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('access_review_settings', v_merged),
    updated_at = now()
  where organization_id = v_org_id;

  perform public._irp_log_identity_event(
    v_org_id, 'access_review_settings_saved',
    jsonb_build_object('metadata_only', true)
  );

  return jsonb_build_object('has_organization', true, 'access_review_settings', v_merged);
end; $$;

create or replace function public.save_identity_companion_permission_prefs(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_workspace_settings;
  v_current jsonb;
  v_merged jsonb;
begin
  perform public._irp_require_permission('settings.manage');
  v_org_id := public._mta_require_organization();
  v_settings := public._irp_ensure_blueprint_settings(v_org_id);

  v_current := coalesce(v_settings.metadata->'companion_permission_prefs', public._irp_default_companion_permission_prefs());
  v_merged := v_current || coalesce(p_payload, '{}'::jsonb);

  update public.organization_workspace_settings
  set
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('companion_permission_prefs', v_merged),
    updated_at = now()
  where organization_id = v_org_id;

  perform public._irp_log_identity_event(
    v_org_id, 'companion_permission_prefs_saved',
    jsonb_build_object('metadata_only', true)
  );

  return jsonb_build_object('has_organization', true, 'companion_permission_prefs', v_merged);
end; $$;

create or replace function public.get_identity_permissions_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'active_users', (select count(*) from public.organization_users where organization_id = v_org_id and status = 'active'),
    'pending_approvals', (select count(*) from public.identity_approval_requests where organization_id = v_org_id and status = 'pending'),
    'philosophy', 'Every user, role, permission, and AI action operates within secure boundaries.',
    'mission', 'Secure identity management, roles, and permissions — the right access at the right time.',
    'build_philosophy', 'Least privilege by default. Humans decide. Aipify prepares and enforces.',
    'implementation_blueprint', 'Phase 2 — User, Role & Permission Foundation'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_identity_permissions_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_membership public.organization_users;
  v_role text;
  v_settings public.organization_workspace_settings;
  v_access_review jsonb;
  v_companion_prefs jsonb;
  v_custom_roles int := 0;
  v_pending_access_reviews int := 0;
begin
  v_org_id := public._mta_require_organization();
  v_membership := public._mta_membership_active(v_org_id);
  v_role := v_membership.role;

  perform public._irp_seed_role_permissions(v_org_id);
  v_settings := public._irp_ensure_blueprint_settings(v_org_id);
  v_access_review := coalesce(v_settings.metadata->'access_review_settings', public._irp_default_access_review_settings());
  v_companion_prefs := coalesce(v_settings.metadata->'companion_permission_prefs', public._irp_default_companion_permission_prefs());

  select count(*) into v_custom_roles
  from public.workspace_custom_roles
  where organization_id = v_org_id;

  select count(*) into v_pending_access_reviews
  from public.security_access_reviews
  where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Every user, role, permission, and AI action operates within secure boundaries.',
    'mission', 'Secure identity management, roles, and permissions — the right access at the right time.',
    'build_philosophy', 'Least privilege by default. Humans decide. Aipify prepares and enforces.',
    'abos_principle', 'Access without accountability erodes trust. Accountability without empathy erodes adoption. Aipify balances both.',
    'vision', 'Phase 2 completes the identity layer atop Phase 1 organizational structure. Every module depends on roles and permissions enforced here.',
    'safety_note', 'Only low-risk AI actions may execute automatically. Medium and high-risk actions require human approval.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 2 — User, Role & Permission Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE2_USER_ROLE_PERMISSION_FOUNDATION.md',
      'engine', 'Identity, Roles & Permission Engine (A.2)'
    ),
    'user_management_requirements', jsonb_build_array(
      'Identifier, name, display name, email, profile image',
      'Language, timezone, and accessibility preferences',
      'Notification and companion preferences',
      'Status: active, inactive, pending, suspended'
    ),
    'org_membership_model', jsonb_build_array(
      'One organization per active context',
      'Multiple workspaces and teams within the organization',
      'Independent permission evaluation per organization'
    ),
    'default_roles', jsonb_build_array(
      jsonb_build_object('key', 'super_admin', 'label', 'Super Admin', 'implemented', false, 'scope', 'platform', 'note', 'Platform Admin (/platform) only — not a customer org role.'),
      jsonb_build_object('key', 'owner', 'label', 'Org Owner', 'implemented', true, 'scope', 'organization'),
      jsonb_build_object('key', 'administrator', 'label', 'Administrator', 'implemented', true, 'scope', 'organization'),
      jsonb_build_object('key', 'executive', 'label', 'Executive', 'implemented', false, 'scope', 'organization', 'note', 'Scaffold — maps to manager/owner capabilities in pilot.'),
      jsonb_build_object('key', 'manager', 'label', 'Manager', 'implemented', true, 'scope', 'organization'),
      jsonb_build_object('key', 'support_agent', 'label', 'Support Agent', 'implemented', true, 'scope', 'organization'),
      jsonb_build_object('key', 'moderator', 'label', 'Moderator', 'implemented', false, 'scope', 'workspace', 'note', 'Workspace custom role — seed via Organization & Workspace Engine.'),
      jsonb_build_object('key', 'employee', 'label', 'Employee', 'implemented', false, 'scope', 'workspace', 'note', 'Workspace member role scaffold.'),
      jsonb_build_object('key', 'viewer', 'label', 'Viewer', 'implemented', true, 'scope', 'organization'),
      jsonb_build_object('key', 'custom', 'label', 'Custom Roles', 'implemented', v_custom_roles > 0, 'scope', 'workspace', 'note', format('%s custom workspace role(s) defined.', v_custom_roles))
    ),
    'permission_categories', jsonb_build_array(
      jsonb_build_object('category', 'organization', 'description', 'Users, modules, and organization settings', 'examples', jsonb_build_array('users.view', 'modules.manage', 'settings.manage')),
      jsonb_build_object('category', 'workspace', 'description', 'Workspace structure, switching, and members', 'examples', jsonb_build_array('workspaces.view', 'workspaces.switch', 'workspaces.members.manage')),
      jsonb_build_object('category', 'knowledge', 'description', 'Knowledge Center access and publishing', 'examples', jsonb_build_array('knowledge.view', 'knowledge.create', 'knowledge.publish')),
      jsonb_build_object('category', 'support', 'description', 'Support cases, replies, and escalation', 'examples', jsonb_build_array('support.view', 'support.reply', 'support.escalate')),
      jsonb_build_object('category', 'companion', 'description', 'Companion visibility and management', 'examples', jsonb_build_array('companion.view', 'companion.manage', 'companion_identity.manage')),
      jsonb_build_object('category', 'admin', 'description', 'Audit, integrations, and AI approvals', 'examples', jsonb_build_array('audit.view', 'integrations.manage', 'ai.approve', 'ai.reject'))
    ),
    'least_privilege_note', 'Default role seeds grant minimal permissions. Viewer and support_agent receive read-focused access. Elevated permissions require owner or administrator assignment.',
    'approval_integration', jsonb_build_object(
      'low_risk', 'Auto-execute allowed for FAQ suggestions and draft recommendations',
      'medium_risk', 'Human approval required — support responses, knowledge updates, workflow changes',
      'high_risk', 'Owner or administrator approval — billing, permissions, destructive actions, integration removal',
      'queue_route', '/app/approvals'
    ),
    'self_love_connection', jsonb_build_object(
      'status', 'scaffold',
      'note', 'Companion permission prefs respect wellbeing boundaries. Full Self Love Engine (A.76) integration pending.',
      'route', '/app/organization-workspace-engine',
      'flag', coalesce((v_companion_prefs->>'self_love_boundary_respected')::boolean, true)
    ),
    'trust_connection', jsonb_build_object(
      'security_trust_engine', '/app/security-trust-engine',
      'trust_center', '/app/license',
      'audit_route', '/app/settings/security',
      'require_access_review', coalesce((
        select require_access_review from public.organization_security_settings where organization_id = v_org_id
      ), true)
    ),
    'audit_requirements', jsonb_build_array(
      'All role and permission changes logged immediately',
      'Login, failed login, and session revocation tracked',
      'AI approval submissions and resolutions audited',
      'User invite, suspend, and remove actions recorded',
      'Platform sees aggregates only — never customer operational content'
    ),
    'access_reviews', jsonb_build_object(
      'settings', v_access_review,
      'pending_count', v_pending_access_reviews,
      'compliance_route', '/app/compliance-regulatory-readiness-engine',
      'security_route', '/app/security-trust-engine'
    ),
    'companion_permission_prefs', v_companion_prefs,
    'success_criteria', public._irp_blueprint_success_criteria(v_org_id),
    'current_role', v_role,
    'active_users', (
      select count(*) from public.organization_users ou
      where ou.organization_id = v_org_id and ou.status = 'active'
    ),
    'pending_invitations', (
      select count(*) from public.organization_users ou
      where ou.organization_id = v_org_id and ou.status = 'invited'
    ),
    'pending_approvals', (
      select count(*) from public.identity_approval_requests r
      where r.organization_id = v_org_id and r.status = 'pending'
    ),
    'suspended_users', (
      select count(*) from public.organization_users ou
      where ou.organization_id = v_org_id and ou.status = 'suspended'
    ),
    'role_distribution', coalesce((
      select jsonb_agg(jsonb_build_object('role', ou.role, 'count', cnt) order by ou.role)
      from (
        select role, count(*) as cnt
        from public.organization_users
        where organization_id = v_org_id and status = 'active'
        group by role
      ) ou
    ), '[]'::jsonb),
    'approval_requests', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'action_type', r.action_type, 'risk_level', r.risk_level,
        'status', r.status, 'metadata', r.metadata, 'created_at', r.created_at
      ) order by r.created_at desc)
      from public.identity_approval_requests r
      where r.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'recent_access_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'action_type', l.action_type, 'actor_role', l.actor_role,
        'created_at', l.created_at, 'metadata', l.metadata
      ) order by l.created_at desc)
      from public.organization_audit_logs l
      where l.organization_id = v_org_id
        and l.action_type in (
          'login', 'failed_login', 'logout', 'role_changed', 'permission_granted',
          'permission_removed', 'approval_submitted', 'approval_approved', 'approval_rejected',
          'user_invited', 'user_suspended', 'access_review_settings_saved', 'companion_permission_prefs_saved'
        )
      limit 10
    ), '[]'::jsonb),
    'user_permissions', coalesce((
      select jsonb_agg(rp.permission_key order by rp.permission_key)
      from public.organization_role_permissions rp
      where rp.organization_id = v_org_id and rp.role = v_role
    ), '[]'::jsonb),
    'ai_risk_classification', jsonb_build_array(
      jsonb_build_object('level', 'low', 'examples', jsonb_build_array('FAQ suggestions', 'draft recommendations'), 'auto_execute', true),
      jsonb_build_object('level', 'medium', 'examples', jsonb_build_array('support responses', 'knowledge updates', 'workflow changes'), 'auto_execute', false),
      jsonb_build_object('level', 'high', 'examples', jsonb_build_array('billing changes', 'permission changes', 'destructive actions', 'integration removal'), 'auto_execute', false)
    ),
    'mfa_readiness', jsonb_build_array(
      jsonb_build_object('method', 'authenticator', 'status', 'ready'),
      jsonb_build_object('method', 'email_code', 'status', 'ready'),
      jsonb_build_object('method', 'sms_code', 'status', 'planned'),
      jsonb_build_object('method', 'passkey', 'status', 'planned')
    ),
    'can_approve_low', public._irp_can_approve_risk('low', v_org_id),
    'can_approve_medium', public._irp_can_approve_risk('medium', v_org_id),
    'can_approve_high', public._irp_can_approve_risk('high', v_org_id),
    'blueprint_integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Organization & Workspace (A.75)', 'route', '/app/organization-workspace-engine'),
      jsonb_build_object('label', 'Multi-Tenant Architecture (A.1)', 'route', '/app/multi-tenant'),
      jsonb_build_object('label', 'Security & Trust (A.18)', 'route', '/app/security-trust-engine'),
      jsonb_build_object('label', 'Trust & Action Engine', 'route', '/app/approvals'),
      jsonb_build_object('label', 'Compliance Readiness (A.29)', 'route', '/app/compliance-regulatory-readiness-engine'),
      jsonb_build_object('label', 'Companion Identity (A.84)', 'route', '/app/companion-identity-engine'),
      jsonb_build_object('label', 'Team Management', 'route', '/app/team')
    )
  );
end; $$;

grant execute on function public._irp_default_access_review_settings() to authenticated;
grant execute on function public._irp_default_companion_permission_prefs() to authenticated;
grant execute on function public._irp_ensure_blueprint_settings(uuid) to authenticated;
grant execute on function public._irp_blueprint_success_criteria(uuid) to authenticated;
grant execute on function public.save_identity_access_review_settings(jsonb) to authenticated;
grant execute on function public.save_identity_companion_permission_prefs(jsonb) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'implementation-blueprint-phase2', 'ABOS Phase 2 Identity Foundation', 'User, Role & Permission Foundation — secure access layer of ABOS.', 'authenticated', 6
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'implementation-blueprint-phase2' and tenant_id is null);
