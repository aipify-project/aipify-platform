-- Phase 268 (APP) — Organizational Memory & Follow-Up Center

create table if not exists public.app_portal_follow_ups (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  category text not null check (category in (
    'customer_follow_up', 'internal_follow_up', 'pending_decision',
    'waiting_external', 'strategic_reminder', 'overdue_commitment'
  )),
  assigned_owner_id uuid references public.users (id) on delete set null,
  status text not null default 'open' check (status in (
    'open', 'in_progress', 'waiting', 'completed', 'cancelled', 'escalated'
  )),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  related_module text,
  suggested_next_action text,
  notes text not null default '',
  due_at timestamptz,
  is_suggestion boolean not null default false,
  suggestion_accepted boolean not null default false,
  source_reference jsonb not null default '{}'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists app_portal_follow_ups_company_status_idx
  on public.app_portal_follow_ups (company_id, status, due_at nulls last);

create index if not exists app_portal_follow_ups_owner_idx
  on public.app_portal_follow_ups (company_id, assigned_owner_id);

create table if not exists public.app_portal_follow_up_audit_logs (
  id uuid primary key default gen_random_uuid(),
  follow_up_id uuid not null references public.app_portal_follow_ups (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_follow_up_audit_follow_up_idx
  on public.app_portal_follow_up_audit_logs (follow_up_id, created_at desc);

alter table public.app_portal_follow_ups enable row level security;
alter table public.app_portal_follow_up_audit_logs enable row level security;
revoke all on public.app_portal_follow_ups from authenticated, anon;
revoke all on public.app_portal_follow_up_audit_logs from authenticated, anon;

create or replace function public._apfuc268_current_user()
returns public.users
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user public.users;
begin
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  return v_user;
end;
$$;

create or replace function public._apfuc268_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
begin
  v_access := public._apsf260_require_app_access();
  v_user := public._apfuc268_current_user();
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'user_role', v_user.role,
    'can_manage', (v_access->>'organization_role') in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._apfuc268_can_view_follow_up(
  p_company_id uuid,
  p_assigned_owner_id uuid,
  p_created_by uuid,
  p_ctx jsonb
)
returns boolean
language sql
immutable
as $$
  select (p_ctx->>'company_id')::uuid = p_company_id
    and (
      coalesce(p_ctx->>'can_manage', 'false') = 'true'
      or (p_ctx->>'user_id')::uuid = p_assigned_owner_id
      or (p_ctx->>'user_id')::uuid = p_created_by
    );
$$;

create or replace function public._apfuc268_follow_up_row(f public.app_portal_follow_ups)
returns jsonb
language plpgsql
stable
as $$
declare
  v_owner_name text;
begin
  select coalesce(u.full_name, 'Unassigned')
  into v_owner_name
  from public.users u
  where u.id = f.assigned_owner_id;

  return jsonb_build_object(
    'id', f.id,
    'title', f.title,
    'category', f.category,
    'assigned_owner_id', f.assigned_owner_id,
    'assigned_owner', coalesce(v_owner_name, 'Unassigned'),
    'created_at', f.created_at,
    'due_at', f.due_at,
    'status', f.status,
    'priority', f.priority,
    'related_module', f.related_module,
    'suggested_next_action', f.suggested_next_action,
    'notes', f.notes,
    'is_suggestion', f.is_suggestion,
    'is_overdue', f.due_at is not null and f.due_at < now() and f.status not in ('completed', 'cancelled'),
    'days_open', greatest(0, extract(day from now() - f.created_at)::int)
  );
end;
$$;

create or replace function public._apfuc268_log_event(
  p_follow_up_id uuid,
  p_company_id uuid,
  p_event_type text,
  p_description text,
  p_performed_by uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.app_portal_follow_up_audit_logs (
    follow_up_id, company_id, event_type, description, performed_by, metadata
  ) values (
    p_follow_up_id, p_company_id, p_event_type, left(coalesce(p_description, ''), 500),
    p_performed_by, coalesce(p_metadata, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.list_app_portal_follow_ups(
  p_category text default null,
  p_owner_id uuid default null,
  p_status text default null,
  p_priority text default null,
  p_overdue_only boolean default false
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
  v_items jsonb := '[]'::jsonb;
  v_suggestions jsonb := '[]'::jsonb;
  v_reminders jsonb := '[]'::jsonb;
  v_pending_approvals integer := 0;
  v_open_support integer := 0;
  v_blocked integer := 0;
begin
  v_ctx := public._apfuc268_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._apfuc268_follow_up_row(f) order by
    case f.priority when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end,
    f.due_at asc nulls last,
    f.created_at desc
  ), '[]'::jsonb)
  into v_items
  from public.app_portal_follow_ups f
  where f.company_id = v_company_id
    and public._apfuc268_can_view_follow_up(f.company_id, f.assigned_owner_id, f.created_by, v_ctx)
    and (p_category is null or f.category = p_category)
    and (p_owner_id is null or f.assigned_owner_id = p_owner_id)
    and (p_status is null or f.status = p_status)
    and (p_priority is null or f.priority = p_priority)
    and (not p_overdue_only or (f.due_at < now() and f.status not in ('completed', 'cancelled')));

  if to_regclass('public.action_requests') is not null then
    select count(*)::int into v_pending_approvals
    from public.action_requests ar
    where ar.tenant_id = (select c.id from public.customers c where c.company_id = v_company_id limit 1)
      and ar.status = 'pending';
  end if;

  if to_regclass('public.support_cases') is not null then
    select count(*)::int into v_open_support
    from public.support_cases sc
    where sc.tenant_id = v_company_id
      and sc.status not in ('resolved', 'closed', 'auto_replied');
  end if;

  if to_regclass('public.aipify_actions') is not null then
    select count(*)::int into v_blocked
    from public.aipify_actions a
    where a.tenant_id = v_company_id and a.status = 'blocked';
  end if;

  if v_pending_approvals > 0 then
    v_suggestions := v_suggestions || jsonb_build_object(
      'id', 'suggest-approval-backlog',
      'title', format('Approval has remained pending (%s awaiting review)', v_pending_approvals),
      'category', 'pending_decision',
      'priority', case when v_pending_approvals > 3 then 'high' else 'medium' end,
      'suggested_next_action', 'Review pending approvals and assign owners',
      'related_module', 'approvals',
      'requires_review', true
    );
  end if;

  if v_open_support > 0 then
    v_suggestions := v_suggestions || jsonb_build_object(
      'id', 'suggest-customer-reply',
      'title', 'Customer may not have received a reply',
      'category', 'customer_follow_up',
      'priority', 'high',
      'suggested_next_action', 'Review open support cases and confirm responses',
      'related_module', 'support',
      'requires_review', true
    );
  end if;

  if v_blocked > 0 then
    v_suggestions := v_suggestions || jsonb_build_object(
      'id', 'suggest-strategic-stall',
      'title', format('Strategic action%s have not progressed', case when v_blocked > 1 then 's' else '' end),
      'category', 'strategic_reminder',
      'priority', 'medium',
      'suggested_next_action', 'Unblock or reassign stalled initiatives',
      'related_module', 'action_center',
      'requires_review', true
    );
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'message', format('This commitment has been open for %s days.', greatest(1, extract(day from now() - f.created_at)::int)),
    'follow_up_id', f.id,
    'title', f.title
  ) order by f.created_at asc), '[]'::jsonb)
  into v_reminders
  from public.app_portal_follow_ups f
  where f.company_id = v_company_id
    and f.status not in ('completed', 'cancelled')
    and f.created_at < now() - interval '14 days'
    and public._apfuc268_can_view_follow_up(f.company_id, f.assigned_owner_id, f.created_by, v_ctx)
  limit 5;

  if v_pending_approvals > 0 then
    v_reminders := v_reminders || jsonb_build_object(
      'message', 'This approval has exceeded its expected response time.',
      'follow_up_id', null,
      'title', 'Pending approvals'
    );
  end if;

  return jsonb_build_object(
    'found', true,
    'items', v_items,
    'suggestions', v_suggestions,
    'smart_reminders', v_reminders,
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'customer_follow_up', 'count', (select count(*) from public.app_portal_follow_ups where company_id = v_company_id and category = 'customer_follow_up' and status not in ('completed','cancelled'))),
      jsonb_build_object('key', 'internal_follow_up', 'count', (select count(*) from public.app_portal_follow_ups where company_id = v_company_id and category = 'internal_follow_up' and status not in ('completed','cancelled'))),
      jsonb_build_object('key', 'pending_decision', 'count', (select count(*) from public.app_portal_follow_ups where company_id = v_company_id and category = 'pending_decision' and status not in ('completed','cancelled'))),
      jsonb_build_object('key', 'waiting_external', 'count', (select count(*) from public.app_portal_follow_ups where company_id = v_company_id and category = 'waiting_external' and status not in ('completed','cancelled'))),
      jsonb_build_object('key', 'strategic_reminder', 'count', (select count(*) from public.app_portal_follow_ups where company_id = v_company_id and category = 'strategic_reminder' and status not in ('completed','cancelled'))),
      jsonb_build_object('key', 'overdue_commitment', 'count', (select count(*) from public.app_portal_follow_ups where company_id = v_company_id and category = 'overdue_commitment' and status not in ('completed','cancelled')))
    ),
    'principle', 'Aipify provides reminders and recommendations. Humans remain responsible for organizational commitments.'
  );
end;
$$;

create or replace function public.get_app_portal_follow_up(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_f public.app_portal_follow_ups;
  v_timeline jsonb;
  v_owner_name text;
begin
  v_ctx := public._apfuc268_access_context();
  select * into v_f from public.app_portal_follow_ups where id = p_id;
  if v_f.id is null then return jsonb_build_object('found', false); end if;
  if not public._apfuc268_can_view_follow_up(v_f.company_id, v_f.assigned_owner_id, v_f.created_by, v_ctx) then
    raise exception 'Follow-up access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'event_type', l.event_type,
    'description', l.description,
    'created_at', l.created_at,
    'performed_by', coalesce(u.full_name, 'System')
  ) order by l.created_at desc), '[]'::jsonb)
  into v_timeline
  from public.app_portal_follow_up_audit_logs l
  left join public.users u on u.id = l.performed_by
  where l.follow_up_id = p_id;

  select coalesce(u.full_name, 'Unassigned') into v_owner_name
  from public.users u where u.id = v_f.assigned_owner_id;

  return jsonb_build_object(
    'found', true,
    'follow_up', public._apfuc268_follow_up_row(v_f) || jsonb_build_object(
      'notes', v_f.notes,
      'source_reference', v_f.source_reference,
      'updated_at', v_f.updated_at,
      'completed_at', v_f.completed_at
    ),
    'assigned_users', case when v_f.assigned_owner_id is not null then jsonb_build_array(jsonb_build_object('id', v_f.assigned_owner_id, 'name', v_owner_name)) else '[]'::jsonb end,
    'timeline', v_timeline,
    'status_history', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'status', coalesce(l.metadata->>'status', l.event_type),
        'at', l.created_at,
        'description', l.description
      ) order by l.created_at desc), '[]'::jsonb)
      from public.app_portal_follow_up_audit_logs l
      where l.follow_up_id = p_id
    ),
    'recommended_actions', jsonb_build_array(
      coalesce(v_f.suggested_next_action, 'Review and update status'),
      case when v_f.due_at < now() and v_f.status not in ('completed','cancelled') then 'Address overdue commitment' else null end
    ) - null,
    'audit_history', v_timeline
  );
end;
$$;

create or replace function public.create_app_portal_follow_up(
  p_title text,
  p_category text,
  p_priority text default 'medium',
  p_assigned_owner_id uuid default null,
  p_due_at timestamptz default null,
  p_related_module text default null,
  p_suggested_next_action text default null,
  p_notes text default '',
  p_is_suggestion boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_f public.app_portal_follow_ups;
begin
  v_ctx := public._apfuc268_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_follow_ups (
    company_id, title, category, assigned_owner_id, priority, due_at,
    related_module, suggested_next_action, notes, is_suggestion, suggestion_accepted,
    created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    coalesce(nullif(trim(p_category), ''), 'internal_follow_up'),
    p_assigned_owner_id,
    coalesce(nullif(trim(p_priority), ''), 'medium'),
    p_due_at,
    nullif(trim(p_related_module), ''),
    nullif(trim(p_suggested_next_action), ''),
    left(coalesce(p_notes, ''), 2000),
    coalesce(p_is_suggestion, false),
    coalesce(p_is_suggestion, false),
    v_user_id
  ) returning id into v_id;

  perform public._apfuc268_log_event(v_id, v_company_id, 'created', 'Follow-up created', v_user_id, jsonb_build_object('status', 'open'));

  select * into v_f from public.app_portal_follow_ups where id = v_id;
  return jsonb_build_object('created', true, 'follow_up', public._apfuc268_follow_up_row(v_f));
end;
$$;

create or replace function public.update_app_portal_follow_up(
  p_id uuid,
  p_status text default null,
  p_priority text default null,
  p_assigned_owner_id uuid default null,
  p_due_at timestamptz default null,
  p_notes text default null,
  p_suggested_next_action text default null,
  p_title text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_f public.app_portal_follow_ups;
  v_user_id uuid;
  v_can_edit boolean;
begin
  v_ctx := public._apfuc268_access_context();
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_f from public.app_portal_follow_ups where id = p_id;
  if v_f.id is null then raise exception 'Follow-up not found'; end if;

  v_can_edit := coalesce(v_ctx->>'can_manage', 'false') = 'true'
    or v_f.assigned_owner_id = v_user_id
    or v_f.created_by = v_user_id;
  if not v_can_edit then raise exception 'Follow-up update denied'; end if;

  update public.app_portal_follow_ups set
    title = coalesce(nullif(trim(p_title), ''), title),
    status = coalesce(nullif(trim(p_status), ''), status),
    priority = coalesce(nullif(trim(p_priority), ''), priority),
    assigned_owner_id = coalesce(p_assigned_owner_id, assigned_owner_id),
    due_at = coalesce(p_due_at, due_at),
    notes = case when p_notes is not null then left(p_notes, 2000) else notes end,
    suggested_next_action = coalesce(nullif(trim(p_suggested_next_action), ''), suggested_next_action),
    updated_at = now(),
    completed_at = case
      when coalesce(nullif(trim(p_status), ''), status) = 'completed' and completed_at is null then now()
      when coalesce(nullif(trim(p_status), ''), status) <> 'completed' then null
      else completed_at
    end
  where id = p_id;

  if p_status is not null and nullif(trim(p_status), '') is not null then
    perform public._apfuc268_log_event(
      p_id, v_f.company_id,
      case when p_status = 'escalated' then 'escalated' else 'status_changed' end,
      format('Status updated to %s', p_status),
      v_user_id,
      jsonb_build_object('status', p_status)
    );
  else
    perform public._apfuc268_log_event(p_id, v_f.company_id, 'updated', 'Follow-up updated', v_user_id, '{}'::jsonb);
  end if;

  select * into v_f from public.app_portal_follow_ups where id = p_id;
  return jsonb_build_object('updated', true, 'follow_up', public._apfuc268_follow_up_row(v_f));
end;
$$;

grant execute on function public.list_app_portal_follow_ups(text, uuid, text, text, boolean) to authenticated;
grant execute on function public.get_app_portal_follow_up(uuid) to authenticated;
grant execute on function public.create_app_portal_follow_up(text, text, text, uuid, timestamptz, text, text, text, boolean) to authenticated;
grant execute on function public.update_app_portal_follow_up(uuid, text, text, uuid, timestamptz, text, text, text) to authenticated;
