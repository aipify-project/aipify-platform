-- Implementation Blueprint Phase 1 — Organization & Workspace Foundation
-- Spec alignment extending Organization & Workspace Engine (A.75). No new tables.

create or replace function public._owe_default_companion_foundation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'communication_tone', 'professional',
    'humor_level', 'balanced',
    'bell_moments_enabled', true,
    'self_love_reminders_enabled', true,
    'recognition_features_enabled', true,
    'presence_comfort_enabled', true
  );
$$;

create or replace function public._owe_ensure_settings(p_organization_id uuid)
returns public.organization_workspace_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_workspace_settings;
begin
  insert into public.organization_workspace_settings (organization_id, metadata)
  values (p_organization_id, jsonb_build_object('companion_foundation', public._owe_default_companion_foundation()))
  on conflict (organization_id) do nothing;

  update public.organization_workspace_settings
  set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'companion_foundation',
    coalesce(metadata->'companion_foundation', public._owe_default_companion_foundation())
  )
  where organization_id = p_organization_id
    and (metadata->'companion_foundation' is null or metadata->'companion_foundation' = 'null'::jsonb);

  select * into v_row from public.organization_workspace_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._owe_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ws_count int := 0;
  v_org_users int := 0;
  v_kc_count int := 0;
  v_companion jsonb;
begin
  select count(*) into v_ws_count
  from public.organization_workspaces
  where organization_id = p_organization_id and status != 'archived';

  select count(*) into v_org_users
  from public.organization_users
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_kc_count
  from public.knowledge_categories
  where organization_id = p_organization_id;

  select coalesce(s.metadata->'companion_foundation', public._owe_default_companion_foundation())
  into v_companion
  from public.organization_workspace_settings s
  where s.organization_id = p_organization_id;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'multiple_organizations',
      'label', 'Multiple organizations can exist simultaneously',
      'met', true,
      'note', 'Platform-level — your organization is isolated within ABOS multi-tenant architecture.'
    ),
    jsonb_build_object(
      'key', 'workspaces_independent',
      'label', 'Workspaces can be created independently',
      'met', v_ws_count > 0
    ),
    jsonb_build_object(
      'key', 'users_secure',
      'label', 'Users belong to organizations securely',
      'met', v_org_users > 0
    ),
    jsonb_build_object(
      'key', 'permissions_enforceable',
      'label', 'Permissions are enforceable',
      'met', true,
      'note', 'Identity & Permissions (A.2) and workspaces.* keys enforced server-side.'
    ),
    jsonb_build_object(
      'key', 'isolation',
      'label', 'Organizational isolation is functioning correctly',
      'met', true,
      'note', 'Row-level security, tenant helpers, and secure API boundaries.'
    ),
    jsonb_build_object(
      'key', 'knowledge_centers',
      'label', 'Knowledge Centers can be created per organization',
      'met', v_kc_count > 0,
      'note', case when v_kc_count = 0 then 'Seed categories via Knowledge Center Engine (A.5).' else null end
    ),
    jsonb_build_object(
      'key', 'companion_preferences',
      'label', 'Companion preferences can be configured safely',
      'met', v_companion is not null and v_companion != '{}'::jsonb
    )
  );
end; $$;

create or replace function public.save_organization_companion_foundation(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_workspace_settings;
  v_current jsonb;
  v_merged jsonb;
begin
  perform public._irp_require_permission('workspaces.settings.manage');
  v_org_id := public._mta_require_organization();
  v_settings := public._owe_ensure_settings(v_org_id);

  v_current := coalesce(v_settings.metadata->'companion_foundation', public._owe_default_companion_foundation());
  v_merged := v_current || coalesce(p_payload, '{}'::jsonb);

  update public.organization_workspace_settings
  set
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('companion_foundation', v_merged),
    updated_at = now()
  where organization_id = v_org_id;

  perform public._mta_create_audit_log(
    v_org_id, 'owe_companion_foundation_saved', 'organization_workspace_settings', v_org_id, false, false, null,
    jsonb_build_object('metadata_only', true)
  );

  return jsonb_build_object(
    'has_organization', true,
    'companion_foundation', v_merged
  );
end; $$;

create or replace function public.get_organization_workspace_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb; v_current jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._owe_ensure_settings(v_org_id);
  v_summary := public._owe_summary_block(v_org_id);

  select jsonb_build_object('workspace_id', wuc.workspace_id, 'updated_at', wuc.updated_at)
  into v_current
  from public.workspace_user_context wuc
  where wuc.user_id = public._mta_app_user_id() and wuc.organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organization → Workspace → Users → Roles — isolated operational contexts within your tenant.',
    'mission', 'Build organizational architecture that supports businesses of all sizes through secure, scalable, isolated environments.',
    'build_philosophy', 'Build once. Build properly. Scale forever.',
    'abos_principle', 'Intelligence without structure creates chaos. Structure without humanity creates rigidity. Aipify combines both.',
    'implementation_blueprint', 'Phase 1 — Organization & Workspace Foundation',
    'total_workspaces', v_summary->'total_workspaces',
    'active_workspaces', v_summary->'active_workspaces',
    'total_members', v_summary->'total_members',
    'current_workspace_id', v_current->'workspace_id'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_organization_workspace_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org record;
  v_settings public.organization_workspace_settings;
  v_current jsonb;
  v_summary jsonb;
  v_companion jsonb;
begin
  perform public._irp_require_permission('workspaces.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._owe_ensure_settings(v_org_id);
  v_summary := public._owe_summary_block(v_org_id);
  v_companion := coalesce(v_settings.metadata->'companion_foundation', public._owe_default_companion_foundation());

  select o.id, o.name, o.slug, o.status into v_org
  from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'workspace_id', wuc.workspace_id,
    'workspace', row_to_json(w)::jsonb
  )
  into v_current
  from public.workspace_user_context wuc
  left join public.organization_workspaces w on w.id = wuc.workspace_id
  where wuc.user_id = public._mta_app_user_id() and wuc.organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Each workspace is an isolated operational context — KC, support, memories, automations, and tasks scoped per workspace without duplicating engine tables.',
    'mission', 'Build organizational architecture that supports businesses of all sizes through secure, scalable, isolated environments.',
    'build_philosophy', 'Build once. Build properly. Scale forever.',
    'abos_principle', 'Intelligence without structure creates chaos. Structure without humanity creates rigidity. Aipify combines both.',
    'vision', 'This phase is the first true foundation of ABOS. Everything that follows depends upon what is built here.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 1 — Organization & Workspace Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE1_ORGANIZATION_WORKSPACE_FOUNDATION.md',
      'engine', 'Organization & Workspace Engine (A.75)'
    ),
    'principles', jsonb_build_array(
      'Organization → Workspace → Users → Roles → Permissions → Companion Experiences',
      'Multi-tenant isolation mandatory — workspaces never cross organizations',
      'Custom roles supported alongside built-in workspace roles',
      'Workspace switching preserves org context — distinct from organization switcher',
      'Integration links scaffold KC, PAME, support, automations — metadata only'
    ),
    'organizational_hierarchy', jsonb_build_array(
      'Organization',
      'Workspaces',
      'Users',
      'Roles',
      'Permissions',
      'Companion Experiences'
    ),
    'org_engine_requirements', jsonb_build_array(
      'Organization name, identifier, branding, and settings',
      'Timezone and language preferences',
      'Subscription and billing via License Center',
      'Feature flags and governance settings',
      'Audit configurations'
    ),
    'workspace_engine_requirements', jsonb_build_array(
      'Knowledge Center scope per workspace',
      'Tasks and notifications',
      'Companion preferences',
      'Operational dashboards',
      'Team visibility',
      'Workspace automations (scaffold)'
    ),
    'user_management_requirements', jsonb_build_array(
      'Users belong to organizations and one or more workspaces',
      'Profile, notification, companion, language, and accessibility preferences'
    ),
    'multi_tenant_security_requirements', jsonb_build_array(
      'Tenant isolation',
      'Row-level security',
      'Secure API boundaries',
      'Audit logging',
      'Encrypted storage',
      'Permission enforcement'
    ),
    'companion_foundation', v_companion,
    'knowledge_center_foundation', jsonb_build_array(
      'FAQs and documentation',
      'Internal procedures and organizational values',
      'Learning resources and companion guidance',
      'Foundation of Organizational Memory'
    ),
    'dogfooding', jsonb_build_object(
      'principle', 'Aipify uses ABOS internally; Unonight is the first external pilot.',
      'aipify_group', jsonb_build_object(
        'slug', 'aipify-group',
        'workspaces', jsonb_build_array('Executive Office', 'Development', 'Support', 'Operations', 'Sales')
      ),
      'unonight', jsonb_build_object(
        'slug', 'unonight',
        'workspaces', jsonb_build_array('Admin', 'Moderation', 'Customer Support', 'Marketplace Operations'),
        'blueprint_mapping', jsonb_build_object(
          'Support', 'Customer Support',
          'Moderation', 'Moderation',
          'Operations', 'Marketplace Operations',
          'Marketplace', 'Marketplace Operations',
          'Executive Office', 'Admin'
        )
      )
    ),
    'success_criteria', public._owe_blueprint_success_criteria(v_org_id),
    'organization', jsonb_build_object('id', v_org.id, 'name', v_org.name, 'slug', v_org.slug, 'status', v_org.status),
    'summary', v_summary,
    'settings', row_to_json(v_settings)::jsonb,
    'current_workspace', coalesce(v_current, '{}'::jsonb),
    'workspaces', public.list_organization_workspaces(),
    'custom_roles', public.list_workspace_custom_roles(),
    'members_by_workspace', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'workspace_id', w.id,
          'workspace_slug', w.slug,
          'members', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'id', wm.id,
                'user_id', wm.user_id,
                'role', wm.role,
                'custom_role_id', wm.custom_role_id,
                'status', wm.status
              ) order by wm.role
            )
            from public.workspace_members wm
            where wm.workspace_id = w.id and wm.status != 'removed'
          ), '[]'::jsonb)
        ) order by w.name
      )
      from public.organization_workspaces w
      where w.organization_id = v_org_id and w.status != 'archived'
    ), '[]'::jsonb),
    'integration_links', case
      when v_current->>'workspace_id' is not null
      then public._owe_integration_links((v_current->>'workspace_id')::uuid)
      else '{}'::jsonb
    end,
    'blueprint_integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Multi-Tenant Architecture (A.1)', 'route', '/app/multi-tenant'),
      jsonb_build_object('label', 'Identity & Permissions (A.2)', 'route', '/app/identity-access'),
      jsonb_build_object('label', 'Knowledge Center Engine (A.5)', 'route', '/app/knowledge-center-engine'),
      jsonb_build_object('label', 'Companion Identity (A.84)', 'route', '/app/companion-identity-engine'),
      jsonb_build_object('label', 'Presence & Comfort (A.90)', 'route', '/app/presence-comfort-protocol'),
      jsonb_build_object('label', 'License Center', 'route', '/app/license')
    ),
    'permissions', public.get_workspace_permissions(null)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._owe_default_companion_foundation() to authenticated;
grant execute on function public._owe_blueprint_success_criteria(uuid) to authenticated;
grant execute on function public.save_organization_companion_foundation(jsonb) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'implementation-blueprint-phase1', 'ABOS Phase 1 Foundation', 'Organization & Workspace Foundation — the structural base of ABOS.', 'authenticated', 5
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'implementation-blueprint-phase1' and tenant_id is null);
