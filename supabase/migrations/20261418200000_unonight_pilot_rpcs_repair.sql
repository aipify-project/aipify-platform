-- pilot helpers and rpcs
create or replace function public._pilot_require_platform_admin()
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._pilot_require_tenant_access(p_tenant_id uuid)
returns void
language plpgsql security definer set search_path = public
as $$
declare v_auth uuid;
begin
  if public.is_platform_admin() then return; end if;
  v_auth := auth.uid();
  if v_auth is null then raise exception 'Not authenticated'; end if;
  if not exists (
    select 1 from public.users u
    join public.customers c on c.company_id = u.company_id
    where u.auth_user_id = v_auth and c.id = p_tenant_id
  ) then
    raise exception 'Not authorized for tenant';
  end if;
end;
$$;

create or replace function public._pilot_record_event(
  p_tenant_id uuid,
  p_event_type text,
  p_title text,
  p_summary text default null,
  p_severity text default 'info',
  p_metadata jsonb default '{}'::jsonb,
  p_created_by text default 'system'
)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare v_id uuid;
begin
  insert into public.aipify_tenant_pilot_events (
    tenant_id, event_type, title, summary, severity, metadata, created_by
  ) values (
    p_tenant_id, p_event_type, p_title, p_summary, p_severity, coalesce(p_metadata, '{}'::jsonb), p_created_by
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._pilot_profile_json(p_row public.aipify_tenant_profiles)
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'id', p_row.id,
    'tenant_id', p_row.tenant_id,
    'name', p_row.name,
    'slug', p_row.slug,
    'tenant_type', p_row.tenant_type,
    'industry', p_row.industry,
    'region', p_row.region,
    'default_language', p_row.default_language,
    'supported_languages', p_row.supported_languages,
    'timezone', p_row.timezone,
    'pilot_status', p_row.pilot_status,
    'pilot_stage', p_row.pilot_stage,
    'metadata', p_row.metadata,
    'created_at', p_row.created_at,
    'updated_at', p_row.updated_at
  );
$$;
create or replace function public.get_pilot_install_status(p_slug text)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_profile public.aipify_tenant_profiles;
begin
  perform public._pilot_require_platform_admin();

  select * into v_profile
  from public.aipify_tenant_profiles p
  where p.slug = p_slug
  limit 1;

  if not found then
    return jsonb_build_object('exists', false, 'slug', p_slug);
  end if;

  v_tenant_id := v_profile.tenant_id;

  return jsonb_build_object(
    'exists', true,
    'profile', public._pilot_profile_json(v_profile),
    'dashboard', public.get_tenant_pilot_dashboard(v_tenant_id)
  );
end;
$$;

create or replace function public.get_tenant_pilot_dashboard(p_tenant_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_profile public.aipify_tenant_profiles;
  v_modules int;
  v_integrations_connected int;
  v_articles int;
  v_gaps int;
  v_workflows int;
  v_pending_approvals int;
  v_blocked_actions int;
  v_checklist_done int;
  v_checklist_total int;
  v_last_discovery public.aipify_tenant_discovery_runs;
  v_emergency boolean;
  v_governance public.aipify_governance_settings;
  v_support_mode text;
  v_completeness int;
begin
  perform public._pilot_require_tenant_access(p_tenant_id);

  select * into v_profile from public.aipify_tenant_profiles where tenant_id = p_tenant_id;

  select count(*) into v_modules
  from public.tenant_modules where tenant_id = p_tenant_id and enabled = true;

  select count(*) into v_integrations_connected
  from public.aipify_tenant_integrations
  where tenant_id = p_tenant_id and status = 'connected';

  select count(*) into v_articles
  from public.aipify_knowledge_articles
  where tenant_id = p_tenant_id and status = 'published';

  select count(*) into v_gaps
  from public.aipify_knowledge_gaps
  where tenant_id = p_tenant_id and status in ('open', 'in_review');

  select count(*) into v_workflows
  from public.aipify_workflow_definitions
  where tenant_id = p_tenant_id and active = true;

  select count(*) into v_pending_approvals
  from public.aipify_approval_requests
  where tenant_id = p_tenant_id and status = 'pending';

  select count(*) into v_blocked_actions
  from public.aipify_action_permissions
  where tenant_id = p_tenant_id and permission_level = 'blocked' and enabled = true;

  select count(*) filter (where status = 'completed'),
         count(*)
  into v_checklist_done, v_checklist_total
  from public.aipify_tenant_pilot_checklist where tenant_id = p_tenant_id;

  select * into v_last_discovery
  from public.aipify_tenant_discovery_runs
  where tenant_id = p_tenant_id
  order by created_at desc
  limit 1;

  select * into v_governance from public.aipify_governance_settings where tenant_id = p_tenant_id;
  v_emergency := public._tacc_is_emergency_active(p_tenant_id);

  select coalesce(mode, 'disabled') into v_support_mode
  from public.tenant_modules
  where tenant_id = p_tenant_id and module_key = 'support_ai'
  limit 1;

  v_completeness := case when v_checklist_total = 0 then 0
    else round((v_checklist_done::numeric / v_checklist_total) * 100)::int end;

  return jsonb_build_object(
    'tenant_id', p_tenant_id,
    'profile', case when v_profile.id is not null then public._pilot_profile_json(v_profile) else null end,
    'setup_completeness_score', v_completeness,
    'safe_mode', coalesce(v_governance.governance_mode, 'safe') in ('safe', 'enterprise_control'),
    'governance_mode', coalesce(v_governance.governance_mode, 'safe'),
    'emergency_stop_active', v_emergency,
    'support_ai_mode', coalesce(v_support_mode, 'disabled'),
    'knowledge_articles_count', v_articles,
    'open_knowledge_gaps', v_gaps,
    'workflows_detected', v_workflows,
    'integrations_connected', v_integrations_connected,
    'modules_enabled', v_modules,
    'last_discovery_run', case when v_last_discovery.id is not null then jsonb_build_object(
      'id', v_last_discovery.id,
      'status', v_last_discovery.status,
      'summary', v_last_discovery.summary,
      'completed_at', v_last_discovery.completed_at,
      'findings', v_last_discovery.findings
    ) else null end,
    'pending_approvals', v_pending_approvals,
    'blocked_actions', v_blocked_actions,
    'checklist_summary', jsonb_build_object(
      'completed', v_checklist_done,
      'total', v_checklist_total
    ),
    'next_recommended_step', public._pilot_next_step(p_tenant_id)
  );
end;
$$;

create or replace function public._pilot_next_step(p_tenant_id uuid)
returns text
language plpgsql stable security definer set search_path = public
as $$
declare v_item public.aipify_tenant_pilot_checklist;
begin
  select * into v_item
  from public.aipify_tenant_pilot_checklist
  where tenant_id = p_tenant_id and status in ('pending', 'in_progress', 'blocked')
  order by priority desc, created_at
  limit 1;
  if not found then return 'Pilot checklist complete — review dashboard metrics.'; end if;
  return v_item.title;
end;
$$;
create or replace function public.get_tenant_pilot_modules(p_tenant_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
begin
  perform public._pilot_require_tenant_access(p_tenant_id);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', m.id, 'module_key', m.module_key, 'enabled', m.enabled,
      'licensed', m.licensed, 'status', m.status, 'mode', m.mode,
      'settings', m.settings, 'enabled_at', m.enabled_at, 'updated_at', m.updated_at
    ) order by m.module_key)
    from public.tenant_modules m where m.tenant_id = p_tenant_id
  ), '[]'::jsonb);
end;
$$;

create or replace function public.update_tenant_pilot_module(
  p_tenant_id uuid,
  p_module_key text,
  p_patch jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_row public.tenant_modules;
begin
  perform public._pilot_require_platform_admin();
  perform public._pilot_require_tenant_access(p_tenant_id);

  update public.tenant_modules set
    enabled = coalesce((p_patch->>'enabled')::boolean, enabled),
    mode = coalesce(p_patch->>'mode', mode),
    status = case
      when coalesce((p_patch->>'enabled')::boolean, enabled) then 'enabled'
      else 'disabled'
    end,
    settings = settings || coalesce(p_patch->'settings', '{}'::jsonb),
    enabled_at = case when coalesce((p_patch->>'enabled')::boolean, enabled) then coalesce(enabled_at, now()) else enabled_at end,
    updated_at = now()
  where tenant_id = p_tenant_id and module_key = p_module_key
  returning * into v_row;

  if not found then raise exception 'Module not found'; end if;

  perform public._pilot_record_event(
    p_tenant_id, 'module_enabled', 'Module updated',
    p_module_key || ' set to ' || v_row.mode, 'info'
  );

  return jsonb_build_object(
    'module_key', v_row.module_key, 'enabled', v_row.enabled, 'mode', v_row.mode, 'status', v_row.status
  );
end;
$$;

create or replace function public.get_tenant_integrations(p_tenant_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
begin
  perform public._pilot_require_tenant_access(p_tenant_id);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', i.id, 'integration_key', i.integration_key, 'display_name', i.display_name,
      'status', i.status, 'connection_mode', i.connection_mode,
      'capabilities', i.capabilities, 'last_sync_at', i.last_sync_at,
      'error_message', i.error_message, 'updated_at', i.updated_at
    ) order by i.integration_key)
    from public.aipify_tenant_integrations i where i.tenant_id = p_tenant_id
  ), '[]'::jsonb);
end;
$$;

create or replace function public.connect_tenant_integration(
  p_tenant_id uuid,
  p_integration_key text,
  p_patch jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_row public.aipify_tenant_integrations;
begin
  perform public._pilot_require_platform_admin();
  perform public._pilot_require_tenant_access(p_tenant_id);

  update public.aipify_tenant_integrations set
    status = coalesce(p_patch->>'status', 'connected'),
    connection_mode = coalesce(p_patch->>'connection_mode', connection_mode),
    capabilities = capabilities || coalesce(p_patch->'capabilities', '{}'::jsonb),
    last_sync_at = now(),
    error_message = null,
    updated_at = now()
  where tenant_id = p_tenant_id and integration_key = p_integration_key
  returning * into v_row;

  if not found then raise exception 'Integration not found'; end if;

  perform public._pilot_record_event(
    p_tenant_id, 'integration_connected', 'Integration connected',
    v_row.display_name || ' is now ' || v_row.status, 'info',
    jsonb_build_object('integration_key', p_integration_key)
  );

  return jsonb_build_object(
    'integration_key', v_row.integration_key,
    'status', v_row.status,
    'last_sync_at', v_row.last_sync_at
  );
end;
$$;

create or replace function public.disable_tenant_integration(
  p_tenant_id uuid,
  p_integration_key text
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
begin
  perform public._pilot_require_platform_admin();
  return public.connect_tenant_integration(
    p_tenant_id, p_integration_key, jsonb_build_object('status', 'disabled')
  );
end;
$$;

create or replace function public.get_tenant_pilot_checklist(p_tenant_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
begin
  perform public._pilot_require_tenant_access(p_tenant_id);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', c.id, 'checklist_key', c.checklist_key, 'title', c.title,
      'description', c.description, 'status', c.status, 'priority', c.priority,
      'completed_at', c.completed_at, 'updated_at', c.updated_at
    ) order by c.priority desc, c.created_at)
    from public.aipify_tenant_pilot_checklist c where c.tenant_id = p_tenant_id
  ), '[]'::jsonb);
end;
$$;

create or replace function public.update_pilot_checklist_item(
  p_tenant_id uuid,
  p_item_id uuid,
  p_status text
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_row public.aipify_tenant_pilot_checklist;
begin
  perform public._pilot_require_platform_admin();
  perform public._pilot_require_tenant_access(p_tenant_id);

  if p_status not in ('pending', 'in_progress', 'completed', 'blocked', 'skipped') then
    raise exception 'Invalid status';
  end if;

  update public.aipify_tenant_pilot_checklist set
    status = p_status,
    completed_at = case when p_status = 'completed' then now() else completed_at end,
    updated_at = now()
  where id = p_item_id and tenant_id = p_tenant_id
  returning * into v_row;

  if not found then raise exception 'Checklist item not found'; end if;

  return jsonb_build_object(
    'id', v_row.id, 'checklist_key', v_row.checklist_key, 'status', v_row.status
  );
end;
$$;

create or replace function public.get_tenant_pilot_events(p_tenant_id uuid, p_limit int default 50)
returns jsonb
language plpgsql security definer set search_path = public
as $$
begin
  perform public._pilot_require_tenant_access(p_tenant_id);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', e.id, 'event_type', e.event_type, 'title', e.title,
      'summary', e.summary, 'severity', e.severity, 'metadata', e.metadata,
      'created_by', e.created_by, 'created_at', e.created_at
    ) order by e.created_at desc)
    from (
      select * from public.aipify_tenant_pilot_events
      where tenant_id = p_tenant_id
      order by created_at desc
      limit greatest(1, least(p_limit, 200))
    ) e
  ), '[]'::jsonb);
end;
$$;


grant execute on function public.get_pilot_install_status(text) to authenticated;
grant execute on function public.get_tenant_pilot_dashboard(uuid) to authenticated;
grant execute on function public.get_tenant_pilot_modules(uuid) to authenticated;
grant execute on function public.get_tenant_integrations(uuid) to authenticated;
grant execute on function public.get_tenant_pilot_checklist(uuid) to authenticated;
grant execute on function public.get_tenant_pilot_events(uuid, int) to authenticated;

