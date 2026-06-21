-- Phase 620 — APP Support History (read-only GET + reopen mutation)

alter table public.app_portal_support_requests
  add column if not exists channel text not null default 'app_portal';

alter table public.app_portal_support_requests
  add column if not exists resolved_at timestamptz;

alter table public.app_portal_support_requests
  drop constraint if exists app_portal_support_requests_status_check;

alter table public.app_portal_support_requests
  add constraint app_portal_support_requests_status_check
  check (status in (
    'open', 'in_review', 'waiting_for_customer', 'waiting_for_aipify',
    'resolved', 'closed', 'reopened', 'archived'
  ));

alter table public.app_portal_support_requests
  drop constraint if exists app_portal_support_requests_channel_check;

alter table public.app_portal_support_requests
  add constraint app_portal_support_requests_channel_check
  check (channel in ('app_portal', 'email', 'chat', 'phone', 'assistant'));

create index if not exists app_portal_support_requests_history_idx
  on public.app_portal_support_requests (company_id, status, updated_at desc)
  where status in ('resolved', 'closed', 'reopened', 'archived');

create or replace function public._apsr271_request_row(r public.app_portal_support_requests)
returns jsonb
language plpgsql
stable
as $$
declare
  v_creator text;
  v_assignee text;
begin
  select coalesce(u.full_name, 'Unknown') into v_creator from public.users u where u.id = r.created_by;
  select coalesce(u.full_name, 'Unassigned') into v_assignee from public.users u where u.id = r.assigned_support_owner_id;
  return jsonb_build_object(
    'id', r.id,
    'title', r.title,
    'description', left(r.description, 500),
    'category', r.category,
    'priority', r.priority,
    'status', r.status,
    'channel', coalesce(r.channel, 'app_portal'),
    'created_by_id', r.created_by,
    'created_by', coalesce(v_creator, 'Unknown'),
    'assigned_support_owner_id', r.assigned_support_owner_id,
    'assigned_support_owner', coalesce(v_assignee, 'Unassigned'),
    'related_module', r.related_module,
    'attachments', r.attachments,
    'internal_notes', case when r.internal_notes = '' then null else left(r.internal_notes, 200) end,
    'created_at', r.created_at,
    'updated_at', r.updated_at,
    'resolved_at', r.resolved_at
  );
end;
$$;

create or replace function public.get_app_portal_support_history(
  p_status text default null,
  p_category text default null,
  p_priority text default null,
  p_channel text default null,
  p_assigned uuid default null,
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_search text default null,
  p_sort text default null,
  p_page integer default 1,
  p_page_size integer default 10
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
  v_page integer := greatest(coalesce(p_page, 1), 1);
  v_page_size integer := least(greatest(coalesce(p_page_size, 10), 1), 50);
  v_offset integer;
  v_total integer := 0;
  v_items jsonb := '[]'::jsonb;
  v_overview jsonb;
  v_insights jsonb;
  v_sort text := lower(coalesce(nullif(trim(p_sort), ''), 'updated_desc'));
  v_historical text[] := array['resolved', 'closed', 'reopened', 'archived'];
begin
  v_ctx := public._apsr271_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_offset := (v_page - 1) * v_page_size;

  select count(*)::integer into v_total
  from public.app_portal_support_requests r
  where r.company_id = v_company_id
    and public._apsr271_can_view_request(r.company_id, r.created_by, v_ctx)
    and (
      (p_status is not null and r.status = p_status)
      or (p_status is null and r.status = any(v_historical))
    )
    and (p_category is null or r.category = p_category)
    and (p_priority is null or r.priority = p_priority)
    and (p_channel is null or coalesce(r.channel, 'app_portal') = p_channel)
    and (p_assigned is null or r.assigned_support_owner_id = p_assigned)
    and (p_date_from is null or r.updated_at >= p_date_from)
    and (p_date_to is null or r.updated_at <= p_date_to)
    and (
      p_search is null or trim(p_search) = ''
      or r.title ilike '%' || trim(p_search) || '%'
      or r.description ilike '%' || trim(p_search) || '%'
    );

  select coalesce(jsonb_agg(public._apsr271_request_row(r)), '[]'::jsonb)
  into v_items
  from (
    select r.*
    from public.app_portal_support_requests r
    where r.company_id = v_company_id
      and public._apsr271_can_view_request(r.company_id, r.created_by, v_ctx)
      and (
        (p_status is not null and r.status = p_status)
        or (p_status is null and r.status = any(v_historical))
      )
      and (p_category is null or r.category = p_category)
      and (p_priority is null or r.priority = p_priority)
      and (p_channel is null or coalesce(r.channel, 'app_portal') = p_channel)
      and (p_assigned is null or r.assigned_support_owner_id = p_assigned)
      and (p_date_from is null or r.updated_at >= p_date_from)
      and (p_date_to is null or r.updated_at <= p_date_to)
      and (
        p_search is null or trim(p_search) = ''
        or r.title ilike '%' || trim(p_search) || '%'
        or r.description ilike '%' || trim(p_search) || '%'
      )
    order by
      case when v_sort = 'updated_asc' then r.updated_at end asc,
      case when v_sort = 'created_desc' then r.created_at end desc,
      case when v_sort = 'created_asc' then r.created_at end asc,
      case when v_sort = 'title_asc' then r.title end asc,
      case when v_sort = 'priority_desc' then
        case r.priority when 'urgent' then 4 when 'high' then 3 when 'medium' then 2 else 1 end
      end desc,
      r.updated_at desc
    offset v_offset
    limit v_page_size
  ) r;

  select jsonb_build_object(
    'total_historical', count(*) filter (where r.status = any(v_historical)),
    'resolved', count(*) filter (where r.status = 'resolved'),
    'closed', count(*) filter (where r.status = 'closed'),
    'reopened', count(*) filter (where r.status = 'reopened'),
    'archived', count(*) filter (where r.status = 'archived'),
    'avg_resolution_days', coalesce(
      round(avg(extract(epoch from (coalesce(r.resolved_at, r.updated_at) - r.created_at)) / 86400.0)::numeric, 1),
      0
    )
  )
  into v_overview
  from public.app_portal_support_requests r
  where r.company_id = v_company_id
    and public._apsr271_can_view_request(r.company_id, r.created_by, v_ctx)
    and r.status = any(v_historical);

  select jsonb_build_object(
    'top_categories', coalesce((
      select jsonb_agg(jsonb_build_object('category', x.category, 'count', x.cnt) order by x.cnt desc)
      from (
        select r.category, count(*)::integer as cnt
        from public.app_portal_support_requests r
        where r.company_id = v_company_id
          and public._apsr271_can_view_request(r.company_id, r.created_by, v_ctx)
          and r.status = any(v_historical)
        group by r.category
        order by cnt desc
        limit 3
      ) x
    ), '[]'::jsonb),
    'reopen_rate_percent', case
      when coalesce((v_overview->>'total_historical')::integer, 0) = 0 then 0
      else round(
        100.0 * coalesce((v_overview->>'reopened')::numeric, 0)
        / greatest((v_overview->>'total_historical')::numeric, 1),
        1
      )
    end,
    'most_recent_resolution_at', (
      select max(coalesce(r.resolved_at, r.updated_at))
      from public.app_portal_support_requests r
      where r.company_id = v_company_id
        and public._apsr271_can_view_request(r.company_id, r.created_by, v_ctx)
        and r.status in ('resolved', 'closed', 'archived')
    )
  )
  into v_insights;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_reopen', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'overview', v_overview,
    'insights', v_insights,
    'items', v_items,
    'pagination', jsonb_build_object(
      'page', v_page,
      'page_size', v_page_size,
      'total', v_total,
      'total_pages', case when v_total = 0 then 0 else ceil(v_total::numeric / v_page_size)::integer end
    ),
    'principle', 'Support History preserves resolved cases for your organization — transparent audit trails, no cross-tenant visibility.'
  );
end;
$$;

create or replace function public.reopen_app_portal_support_request(
  p_id uuid,
  p_reason text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_user_id uuid;
  v_r public.app_portal_support_requests;
  v_reason text;
begin
  v_ctx := public._apsr271_access_context();
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_reason := left(trim(coalesce(p_reason, '')), 1000);

  select * into v_r from public.app_portal_support_requests where id = p_id;
  if v_r.id is null then raise exception 'Support request not found'; end if;
  if not public._apsr271_can_view_request(v_r.company_id, v_r.created_by, v_ctx) then
    raise exception 'Support request access denied';
  end if;

  if v_r.status not in ('resolved', 'closed', 'archived') then
    raise exception 'Only resolved, closed, or archived cases can be reopened';
  end if;

  if coalesce(v_ctx->>'can_manage', 'false') <> 'true'
     and (v_ctx->>'user_id')::uuid <> v_r.created_by then
    raise exception 'Permission denied: cannot reopen this support request';
  end if;

  if v_reason = '' then
    raise exception 'Reopen reason is required';
  end if;

  update public.app_portal_support_requests set
    status = 'reopened',
    resolved_at = null,
    updated_at = now()
  where id = p_id;

  perform public._apsr271_log_event(
    p_id,
    v_r.company_id,
    'status_changed',
    format('Case reopened: %s', v_reason),
    v_user_id,
    jsonb_build_object('status', 'reopened', 'previous_status', v_r.status, 'reason', v_reason)
  );

  select * into v_r from public.app_portal_support_requests where id = p_id;
  return jsonb_build_object(
    'reopened', true,
    'request', public._apsr271_request_row(v_r)
  );
end;
$$;

create or replace function public.get_app_portal_support_request(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_support_requests;
  v_timeline jsonb;
  v_status_history jsonb;
  v_related_activity jsonb := '[]'::jsonb;
  v_can_reopen boolean := false;
  v_is_historical boolean := false;
  v_resolution jsonb := null;
begin
  v_ctx := public._apsr271_access_context();
  select * into v_r from public.app_portal_support_requests where id = p_id;
  if v_r.id is null then return jsonb_build_object('found', false); end if;
  if not public._apsr271_can_view_request(v_r.company_id, v_r.created_by, v_ctx) then
    raise exception 'Support request access denied';
  end if;

  v_is_historical := v_r.status in ('resolved', 'closed', 'reopened', 'archived');
  v_can_reopen := v_r.status in ('resolved', 'closed', 'archived')
    and (
      coalesce(v_ctx->>'can_manage', 'false') = 'true'
      or (v_ctx->>'user_id')::uuid = v_r.created_by
    );

  if v_r.status in ('resolved', 'closed', 'archived') then
    v_resolution := jsonb_build_object(
      'status', v_r.status,
      'resolved_at', coalesce(v_r.resolved_at, v_r.updated_at),
      'summary', left(v_r.description, 500)
    );
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', coalesce(u.full_name, 'System')
  ) order by l.created_at desc), '[]'::jsonb)
  into v_timeline
  from public.app_portal_support_request_audit_logs l
  left join public.users u on u.id = l.performed_by
  where l.request_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'status', coalesce(l.metadata->>'status', l.event_type),
    'at', l.created_at,
    'description', l.description
  ) order by l.created_at asc), '[]'::jsonb)
  into v_status_history
  from public.app_portal_support_request_audit_logs l
  where l.request_id = p_id and l.event_type in ('created', 'status_changed');

  if to_regclass('public.app_portal_support_request_audit_logs') is not null then
    v_related_activity := v_timeline;
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_reopen', v_can_reopen,
    'is_historical', v_is_historical,
    'resolution', v_resolution,
    'request', public._apsr271_request_row(v_r) || jsonb_build_object(
      'description_full', v_r.description,
      'internal_notes_full', v_r.internal_notes,
      'attachments', v_r.attachments
    ),
    'status_history', v_status_history,
    'timeline', v_timeline,
    'audit_history', v_timeline,
    'related_activity', v_related_activity,
    'comments_placeholder', true,
    'internal_notes_placeholder', true,
    'attachments_placeholder', jsonb_array_length(v_r.attachments) = 0
  );
end;
$$;

create or replace function public.update_app_portal_support_request(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_category text default null,
  p_priority text default null,
  p_status text default null,
  p_related_module text default null,
  p_internal_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_support_requests;
  v_user_id uuid;
  v_new_status text;
begin
  v_ctx := public._apsr271_access_context();
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_r from public.app_portal_support_requests where id = p_id;
  if v_r.id is null then raise exception 'Support request not found'; end if;
  if not public._apsr271_can_view_request(v_r.company_id, v_r.created_by, v_ctx) then
    raise exception 'Support request access denied';
  end if;

  v_new_status := coalesce(nullif(trim(p_status), ''), v_r.status);

  update public.app_portal_support_requests set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    category = coalesce(nullif(trim(p_category), ''), category),
    priority = coalesce(nullif(trim(p_priority), ''), priority),
    status = v_new_status,
    related_module = case when p_related_module is not null then nullif(trim(p_related_module), '') else related_module end,
    internal_notes = case
      when p_internal_notes is not null and coalesce(v_ctx->>'can_manage', 'false') = 'true'
      then left(p_internal_notes, 2000) else internal_notes
    end,
    resolved_at = case
      when v_new_status in ('resolved', 'closed', 'archived') and v_r.status not in ('resolved', 'closed', 'archived')
      then now()
      when v_new_status in ('open', 'in_review', 'waiting_for_customer', 'waiting_for_aipify', 'reopened')
      then null
      else resolved_at
    end,
    updated_at = now()
  where id = p_id;

  if p_status is not null and v_new_status <> v_r.status then
    perform public._apsr271_log_event(p_id, v_r.company_id, 'status_changed', format('Status updated to %s', v_new_status), v_user_id, jsonb_build_object('status', v_new_status));
  else
    perform public._apsr271_log_event(p_id, v_r.company_id, 'updated', 'Support request updated', v_user_id, '{}'::jsonb);
  end if;

  select * into v_r from public.app_portal_support_requests where id = p_id;
  return jsonb_build_object('updated', true, 'request', public._apsr271_request_row(v_r));
end;
$$;

grant execute on function public.get_app_portal_support_history(text, text, text, text, uuid, timestamptz, timestamptz, text, text, integer, integer) to authenticated;
grant execute on function public.reopen_app_portal_support_request(uuid, text) to authenticated;
