-- Phase 270 (APP) — Action Timeline & Activity History Center
-- Aggregates existing audit/activity sources — no duplicate event store.

create or replace function public._apah270_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
  v_org_name text;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  select coalesce(c.name, 'Organization') into v_org_name
  from public.companies c where c.id = (v_access->>'company_id')::uuid;
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'organization_name', v_org_name,
    'can_manage', (v_access->>'organization_role') in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._apah270_can_view_event(p_performed_by uuid, p_ctx jsonb)
returns boolean
language sql
immutable
as $$
  select coalesce(p_ctx->>'can_manage', 'false') = 'true'
    or (p_ctx->>'user_id')::uuid = p_performed_by
    or p_performed_by is null;
$$;

create or replace function public._apah270_event_row(
  p_id text,
  p_event_type text,
  p_title text,
  p_description text,
  p_module text,
  p_user_id uuid,
  p_user_name text,
  p_timestamp timestamptz,
  p_organization text,
  p_related_id uuid,
  p_related_type text,
  p_severity text,
  p_action_link text
)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'id', p_id,
    'event_type', p_event_type,
    'title', p_title,
    'description', p_description,
    'module_source', p_module,
    'user_id', p_user_id,
    'user_name', coalesce(p_user_name, 'System'),
    'timestamp', p_timestamp,
    'organization', p_organization,
    'related_entity_id', p_related_id,
    'related_entity_type', p_related_type,
    'severity', p_severity,
    'action_link', p_action_link
  );
$$;

create or replace function public.list_app_portal_activity_history(
  p_event_type text default null,
  p_module text default null,
  p_user_id uuid default null,
  p_severity text default null,
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_org_name text;
  v_items jsonb := '[]'::jsonb;
  v_chunk jsonb;
  r record;
begin
  v_ctx := public._apah270_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_org_name := coalesce(v_ctx->>'organization_name', 'Organization');

  if to_regclass('public.app_portal_follow_up_audit_logs') is not null then
    for r in
      select l.id, l.event_type, l.description, l.performed_by, l.created_at, l.follow_up_id, l.metadata,
             f.title as entity_title, u.full_name as user_name
      from public.app_portal_follow_up_audit_logs l
      join public.app_portal_follow_ups f on f.id = l.follow_up_id
      left join public.users u on u.id = l.performed_by
      where l.company_id = v_company_id
        and public._apah270_can_view_event(l.performed_by, v_ctx)
      order by l.created_at desc
      limit 100
    loop
      v_chunk := public._apah270_event_row(
        'fu-' || r.id::text,
        case
          when r.event_type = 'created' and coalesce((r.metadata->>'is_suggestion')::boolean, false) then 'system_recommendation'
          when r.event_type = 'status_changed' and coalesce(r.metadata->>'status', '') = 'completed' then 'follow_up_completed'
          when r.event_type = 'created' then 'follow_up_created'
          else 'follow_up_created'
        end,
        coalesce(r.entity_title, 'Follow-up activity'),
        r.description,
        'follow_ups',
        r.performed_by,
        r.user_name,
        r.created_at,
        v_org_name,
        r.follow_up_id,
        'follow_up',
        case
          when r.event_type = 'status_changed' and coalesce(r.metadata->>'status', '') = 'completed' then 'notice'
          when coalesce((r.metadata->>'is_suggestion')::boolean, false) then 'notice'
          else 'info'
        end,
        '/app/operations/follow-ups/' || r.follow_up_id::text
      );
      v_items := v_items || jsonb_build_array(v_chunk);
    end loop;
  end if;

  if to_regclass('public.app_portal_decision_audit_logs') is not null then
    for r in
      select l.id, l.event_type, l.description, l.performed_by, l.created_at, l.decision_id,
             d.title as entity_title, u.full_name as user_name
      from public.app_portal_decision_audit_logs l
      join public.app_portal_decisions d on d.id = l.decision_id
      left join public.users u on u.id = l.performed_by
      where l.company_id = v_company_id
        and public._apah270_can_view_event(l.performed_by, v_ctx)
      order by l.created_at desc
      limit 100
    loop
      v_chunk := public._apah270_event_row(
        'dc-' || r.id::text,
        case when r.event_type = 'evaluated' then 'decision_evaluated' else 'decision_recorded' end,
        coalesce(r.entity_title, 'Decision activity'),
        r.description,
        'decision_center',
        r.performed_by,
        r.user_name,
        r.created_at,
        v_org_name,
        r.decision_id,
        'decision',
        case when r.event_type = 'evaluated' then 'important' when r.event_type = 'created' then 'notice' else 'info' end,
        '/app/operations/decision-center/' || r.decision_id::text
      );
      v_items := v_items || jsonb_build_array(v_chunk);
    end loop;
  end if;

  if to_regclass('public.action_requests') is not null then
    for r in
      select ar.id, ar.action_name, ar.status, ar.risk_level, ar.created_at, ar.updated_at
      from public.action_requests ar
      where ar.tenant_id = (select c.id from public.customers c where c.company_id = v_company_id limit 1)
        and coalesce(v_ctx->>'can_manage', 'false') = 'true'
      order by ar.created_at desc
      limit 50
    loop
      v_chunk := public._apah270_event_row(
        'ar-' || r.id::text || '-req',
        'approval_requested',
        coalesce(r.action_name, 'Approval request'),
        format('Approval requested — status %s', r.status),
        'approvals',
        null,
        'System',
        r.created_at,
        v_org_name,
        r.id,
        'approval',
        case when r.risk_level >= 3 then 'critical' when r.risk_level >= 2 then 'important' else 'notice' end,
        '/app/approvals'
      );
      v_items := v_items || jsonb_build_array(v_chunk);
      if r.status in ('approved', 'rejected') then
        v_chunk := public._apah270_event_row(
          'ar-' || r.id::text || '-done',
          'approval_completed',
          coalesce(r.action_name, 'Approval completed'),
          format('Approval %s', r.status),
          'approvals',
          null,
          'System',
          coalesce(r.updated_at, r.created_at),
          v_org_name,
          r.id,
          'approval',
          case when r.status = 'rejected' then 'important' else 'notice' end,
          '/app/approvals'
        );
        v_items := v_items || jsonb_build_array(v_chunk);
      end if;
    end loop;
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    for r in
      select c.id, c.provider_key, c.status, c.created_by, c.updated_at, u.full_name as user_name
      from public.app_portal_integration_connections c
      left join public.users u on u.id = c.created_by
      where c.company_id = v_company_id
        and c.status = 'connected'
        and public._apah270_can_view_event(c.created_by, v_ctx)
      order by c.updated_at desc
      limit 50
    loop
      v_chunk := public._apah270_event_row(
        'int-' || r.id::text,
        'integration_connected',
        format('Integration connected — %s', r.provider_key),
        r.provider_key,
        'integrations',
        r.created_by,
        r.user_name,
        r.updated_at,
        v_org_name,
        r.id,
        'integration',
        'notice',
        '/app/platform/integrations/connected'
      );
      v_items := v_items || jsonb_build_array(v_chunk);
    end loop;
  end if;

  if to_regclass('public.tenant_modules') is not null
     and coalesce(v_ctx->>'can_manage', 'false') = 'true' then
    for r in
      select tm.id, tm.module_key, tm.created_at
      from public.tenant_modules tm
      where tm.tenant_id = (select c.id from public.customers c where c.company_id = v_company_id limit 1)
        and tm.status in ('enabled', 'trial', 'beta')
      order by tm.created_at desc
      limit 30
    loop
      v_chunk := public._apah270_event_row(
        'bp-' || r.id::text,
        'business_pack_installed',
        format('Business Pack — %s', r.module_key),
        format('Module %s enabled', r.module_key),
        'business_packs',
        null,
        'System',
        r.created_at,
        v_org_name,
        r.id,
        'business_pack',
        'notice',
        '/app/business-packs/installed'
      );
      v_items := v_items || jsonb_build_array(v_chunk);
    end loop;
  end if;

  if to_regclass('public.support_cases') is not null then
    for r in
      select sc.id, sc.subject, sc.status, sc.risk_level, sc.created_at
      from public.support_cases sc
      where sc.tenant_id = v_company_id
        and coalesce(v_ctx->>'can_manage', 'false') = 'true'
      order by sc.created_at desc
      limit 30
    loop
      v_chunk := public._apah270_event_row(
        'sup-' || r.id::text,
        'support_event',
        coalesce(r.subject, 'Support case'),
        format('Support case — %s', r.status),
        'support',
        null,
        'System',
        r.created_at,
        v_org_name,
        r.id,
        'support_case',
        case when r.risk_level in ('high', 'critical') then 'important' else 'info' end,
        '/app/support/history'
      );
      v_items := v_items || jsonb_build_array(v_chunk);
    end loop;
  end if;

  select coalesce(jsonb_agg(item order by (item->>'timestamp') desc), '[]'::jsonb)
  into v_items
  from (
    select item
    from jsonb_array_elements(v_items) as item
    where (p_event_type is null or item->>'event_type' = p_event_type)
      and (p_module is null or item->>'module_source' = p_module)
      and (p_user_id is null or (item->>'user_id')::uuid = p_user_id)
      and (p_severity is null or item->>'severity' = p_severity)
      and (p_date_from is null or (item->>'timestamp')::timestamptz >= p_date_from)
      and (p_date_to is null or (item->>'timestamp')::timestamptz <= p_date_to)
      and (
        p_search is null or trim(p_search) = ''
        or item->>'title' ilike '%' || trim(p_search) || '%'
        or item->>'description' ilike '%' || trim(p_search) || '%'
        or item->>'module_source' ilike '%' || trim(p_search) || '%'
        or item->>'user_name' ilike '%' || trim(p_search) || '%'
      )
    limit 200
  ) filtered;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'principle', 'Activity History preserves organizational accountability. Important audit records remain available for transparency and compliance.'
  );
end;
$$;

grant execute on function public.list_app_portal_activity_history(text, text, uuid, text, timestamptz, timestamptz, text) to authenticated;
