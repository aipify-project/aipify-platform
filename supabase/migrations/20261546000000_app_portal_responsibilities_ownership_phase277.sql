-- Phase 277 (APP) — Team Responsibilities & Ownership Center

create table if not exists public.app_portal_responsibilities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  area text not null check (area in (
    'goals', 'follow_ups', 'decisions', 'approvals', 'support_requests',
    'integrations', 'business_packs', 'billing', 'security', 'operations'
  )),
  primary_owner_id uuid references public.users (id) on delete set null,
  backup_owner_id uuid references public.users (id) on delete set null,
  contributor_ids jsonb not null default '[]'::jsonb,
  status text not null default 'unassigned' check (status in (
    'active', 'needs_review', 'unassigned', 'inactive'
  )),
  related_module text,
  last_reviewed_date date,
  review_frequency text check (review_frequency is null or review_frequency in (
    'monthly', 'quarterly', 'semi_annual', 'annual'
  )),
  notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_responsibilities_company_idx
  on public.app_portal_responsibilities (company_id, area, status, updated_at desc);

create table if not exists public.app_portal_responsibility_audit_logs (
  id uuid primary key default gen_random_uuid(),
  responsibility_id uuid not null references public.app_portal_responsibilities (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_responsibility_audit_idx
  on public.app_portal_responsibility_audit_logs (responsibility_id, created_at desc);

alter table public.app_portal_responsibilities enable row level security;
alter table public.app_portal_responsibility_audit_logs enable row level security;
revoke all on public.app_portal_responsibilities from authenticated, anon;
revoke all on public.app_portal_responsibility_audit_logs from authenticated, anon;

create or replace function public._apresp277_access_context()
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
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', (v_access->>'organization_role') in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._apresp277_can_view(
  r public.app_portal_responsibilities,
  p_ctx jsonb
)
returns boolean
language plpgsql
stable
as $$
declare v_uid uuid;
begin
  if (p_ctx->>'company_id')::uuid <> r.company_id then return false; end if;
  if coalesce(p_ctx->>'can_manage', 'false') = 'true' then return true; end if;
  v_uid := (p_ctx->>'user_id')::uuid;
  return r.primary_owner_id = v_uid
    or r.backup_owner_id = v_uid
    or coalesce(r.contributor_ids, '[]'::jsonb) @> jsonb_build_array(v_uid::text);
end;
$$;

create or replace function public._apresp277_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._apresp277_row(r public.app_portal_responsibilities)
returns jsonb
language plpgsql
stable
as $$
begin
  return jsonb_build_object(
    'id', r.id,
    'title', r.title,
    'description', left(r.description, 500),
    'area', r.area,
    'primary_owner_id', r.primary_owner_id,
    'primary_owner_name', public._apresp277_user_name(r.primary_owner_id),
    'backup_owner_id', r.backup_owner_id,
    'backup_owner_name', public._apresp277_user_name(r.backup_owner_id),
    'contributor_ids', r.contributor_ids,
    'status', r.status,
    'related_module', r.related_module,
    'last_reviewed_date', r.last_reviewed_date,
    'review_frequency', r.review_frequency,
    'notes', left(r.notes, 300),
    'created_at', r.created_at,
    'updated_at', r.updated_at
  );
end;
$$;

create or replace function public._apresp277_derive_status(r public.app_portal_responsibilities)
returns text
language plpgsql
stable
as $$
begin
  if r.primary_owner_id is null then return 'unassigned'; end if;
  if r.status = 'inactive' then return 'inactive'; end if;
  if r.last_reviewed_date is null or r.last_reviewed_date < current_date - interval '90 days' then
    return 'needs_review';
  end if;
  return coalesce(nullif(r.status, 'unassigned'), 'active');
end;
$$;

create or replace function public._apresp277_build_recommendations(p_items jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_item jsonb;
begin
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    if v_item->>'primary_owner_id' is null then
      v_recs := v_recs || jsonb_build_object('id', 'assign-' || (v_item->>'id'), 'key', 'assignOwner', 'responsibility_id', v_item->>'id', 'priority', 'high');
    elsif v_item->>'backup_owner_id' is null and (v_item->>'area') in ('security', 'billing', 'approvals', 'operations') then
      v_recs := v_recs || jsonb_build_object('id', 'backup-' || (v_item->>'id'), 'key', 'addBackupOwner', 'responsibility_id', v_item->>'id', 'priority', 'high');
    elsif (v_item->>'status') = 'needs_review' then
      v_recs := v_recs || jsonb_build_object('id', 'review-' || (v_item->>'id'), 'key', 'reviewStale', 'responsibility_id', v_item->>'id', 'priority', 'medium');
    end if;
  end loop;
  if jsonb_array_length(v_recs) = 0 then
    v_recs := v_recs || jsonb_build_object('id', 'balance-ownership', 'key', 'balanceOwnership', 'priority', 'low');
  end if;
  v_recs := v_recs || jsonb_build_object('id', 'clarify-approvals', 'key', 'clarifyApprovals', 'priority', 'medium');
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_responsibilities(
  p_area text default null,
  p_owner_id uuid default null,
  p_status text default null,
  p_review_before date default null,
  p_has_backup boolean default null,
  p_related_module text default null,
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
  v_items jsonb := '[]'::jsonb;
  v_assigned integer := 0;
  v_unassigned integer := 0;
  v_needs_review integer := 0;
  v_no_backup integer := 0;
  v_overloaded jsonb := '[]'::jsonb;
  v_recent jsonb := '[]'::jsonb;
begin
  v_ctx := public._apresp277_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(
    public._apresp277_row(r) || jsonb_build_object('status', public._apresp277_derive_status(r))
    order by r.updated_at desc
  ), '[]'::jsonb)
  into v_items
  from public.app_portal_responsibilities r
  where r.company_id = v_company_id
    and public._apresp277_can_view(r, v_ctx)
    and (p_area is null or r.area = p_area)
    and (p_owner_id is null or r.primary_owner_id = p_owner_id or r.backup_owner_id = p_owner_id)
    and (p_status is null or public._apresp277_derive_status(r) = p_status)
    and (p_review_before is null or r.last_reviewed_date <= p_review_before)
    and (p_has_backup is null or (p_has_backup = true and r.backup_owner_id is not null) or (p_has_backup = false and r.backup_owner_id is null))
    and (p_related_module is null or r.related_module = p_related_module)
    and (
      p_search is null or trim(p_search) = ''
      or r.title ilike '%' || trim(p_search) || '%'
      or r.description ilike '%' || trim(p_search) || '%'
      or r.notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_assigned
  from public.app_portal_responsibilities r
  where r.company_id = v_company_id and r.primary_owner_id is not null;

  select count(*)::int into v_unassigned
  from public.app_portal_responsibilities r
  where r.company_id = v_company_id and r.primary_owner_id is null;

  select count(*)::int into v_needs_review
  from public.app_portal_responsibilities r
  where r.company_id = v_company_id and public._apresp277_derive_status(r) = 'needs_review';

  select count(*)::int into v_no_backup
  from public.app_portal_responsibilities r
  where r.company_id = v_company_id
    and r.primary_owner_id is not null
    and r.backup_owner_id is null
    and r.area in ('security', 'billing', 'approvals', 'operations');

  select coalesce(jsonb_agg(jsonb_build_object(
    'user_id', x.primary_owner_id, 'name', public._apresp277_user_name(x.primary_owner_id), 'count', x.cnt
  ) order by x.cnt desc), '[]'::jsonb)
  into v_overloaded
  from (
    select r.primary_owner_id, count(*)::int as cnt
    from public.app_portal_responsibilities r
    where r.company_id = v_company_id and r.primary_owner_id is not null and r.status <> 'inactive'
    group by r.primary_owner_id
    having count(*) >= 3
    order by cnt desc
    limit 5
  ) x;

  select coalesce(jsonb_agg(public._apresp277_row(r) order by r.updated_at desc), '[]'::jsonb)
  into v_recent
  from (
    select * from public.app_portal_responsibilities r
    where r.company_id = v_company_id
    order by r.updated_at desc
    limit 5
  ) r;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'assigned', v_assigned,
      'unassigned', v_unassigned,
      'needs_review', v_needs_review,
      'critical_no_backup', v_no_backup,
      'overloaded_owners', v_overloaded,
      'recently_updated', v_recent
    ),
    'recommendations', public._apresp277_build_recommendations(v_items),
    'principle', 'Clear ownership reduces ambiguity — human administrators assign responsibility.'
  );
end;
$$;

create or replace function public.get_app_portal_responsibility(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_responsibilities;
  v_audit jsonb := '[]'::jsonb;
  v_contributors jsonb := '[]'::jsonb;
begin
  v_ctx := public._apresp277_access_context();
  select * into v_r from public.app_portal_responsibilities where id = p_id;
  if v_r.id is null then return jsonb_build_object('found', false); end if;
  if not public._apresp277_can_view(v_r, v_ctx) then
    raise exception 'Responsibility access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object('user_id', u.id, 'name', u.full_name)), '[]'::jsonb)
  into v_contributors
  from public.users u
  where u.id in (
    select t.value::uuid from jsonb_array_elements_text(coalesce(v_r.contributor_ids, '[]'::jsonb)) as t(value)
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._apresp277_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_responsibility_audit_logs l where l.responsibility_id = p_id;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'responsibility', public._apresp277_row(v_r) || jsonb_build_object(
      'status', public._apresp277_derive_status(v_r),
      'description_full', v_r.description,
      'notes_full', v_r.notes
    ),
    'contributors', v_contributors,
    'audit_history', v_audit,
    'recommendations', public._apresp277_build_recommendations(jsonb_build_array(public._apresp277_row(v_r)))
  );
end;
$$;

create or replace function public.create_app_portal_responsibility(
  p_title text,
  p_description text default '',
  p_area text default 'operations',
  p_primary_owner_id uuid default null,
  p_backup_owner_id uuid default null,
  p_contributor_ids jsonb default '[]'::jsonb,
  p_status text default 'active',
  p_related_module text default null,
  p_last_reviewed_date date default null,
  p_review_frequency text default null,
  p_notes text default ''
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
  v_r public.app_portal_responsibilities;
begin
  v_ctx := public._apresp277_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Responsibility creation requires manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_responsibilities (
    company_id, title, description, area, primary_owner_id, backup_owner_id, contributor_ids,
    status, related_module, last_reviewed_date, review_frequency, notes, created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 5000),
    coalesce(nullif(trim(p_area), ''), 'operations'),
    p_primary_owner_id,
    p_backup_owner_id,
    coalesce(p_contributor_ids, '[]'::jsonb),
    case when p_primary_owner_id is null then 'unassigned' else coalesce(nullif(trim(p_status), ''), 'active') end,
    nullif(trim(p_related_module), ''),
    p_last_reviewed_date,
    nullif(trim(p_review_frequency), ''),
    left(coalesce(p_notes, ''), 2000),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_responsibility_audit_logs (responsibility_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'Responsibility created', v_user_id);

  select * into v_r from public.app_portal_responsibilities where id = v_id;
  return jsonb_build_object('created', true, 'responsibility', public._apresp277_row(v_r));
end;
$$;

create or replace function public.update_app_portal_responsibility(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_area text default null,
  p_primary_owner_id uuid default null,
  p_backup_owner_id uuid default null,
  p_contributor_ids jsonb default null,
  p_status text default null,
  p_related_module text default null,
  p_last_reviewed_date date default null,
  p_review_frequency text default null,
  p_notes text default null,
  p_clear_primary_owner boolean default false,
  p_clear_backup_owner boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_responsibilities;
  v_user_id uuid;
begin
  v_ctx := public._apresp277_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Responsibility update requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_r from public.app_portal_responsibilities where id = p_id;
  if v_r.id is null then raise exception 'Responsibility not found'; end if;
  if v_r.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Access denied'; end if;

  update public.app_portal_responsibilities set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    area = coalesce(nullif(trim(p_area), ''), area),
    primary_owner_id = case when p_clear_primary_owner then null when p_primary_owner_id is not null then p_primary_owner_id else primary_owner_id end,
    backup_owner_id = case when p_clear_backup_owner then null when p_backup_owner_id is not null then p_backup_owner_id else backup_owner_id end,
    contributor_ids = coalesce(p_contributor_ids, contributor_ids),
    status = coalesce(nullif(trim(p_status), ''), status),
    related_module = case when p_related_module is not null then nullif(trim(p_related_module), '') else related_module end,
    last_reviewed_date = coalesce(p_last_reviewed_date, last_reviewed_date),
    review_frequency = case when p_review_frequency is not null then nullif(trim(p_review_frequency), '') else review_frequency end,
    notes = case when p_notes is not null then left(p_notes, 2000) else notes end,
    updated_at = now()
  where id = p_id;

  update public.app_portal_responsibilities set
    status = case when primary_owner_id is null then 'unassigned' else status end
  where id = p_id;

  insert into public.app_portal_responsibility_audit_logs (responsibility_id, company_id, event_type, description, performed_by)
  values (p_id, v_r.company_id, 'updated', 'Responsibility updated', v_user_id);

  select * into v_r from public.app_portal_responsibilities where id = p_id;
  return jsonb_build_object('updated', true, 'responsibility', public._apresp277_row(v_r));
end;
$$;

create or replace function public.get_app_portal_responsibility_owner(p_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_owned jsonb := '[]'::jsonb;
  v_backup jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
  v_goals jsonb := '[]'::jsonb;
  v_approvals integer := 0;
  v_support integer := 0;
  v_workload text := 'balanced';
  v_total integer := 0;
begin
  v_ctx := public._apresp277_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  if not exists (select 1 from public.users u where u.id = p_user_id and u.company_id = v_company_id) then
    raise exception 'User not found';
  end if;

  if coalesce(v_ctx->>'can_manage', 'false') <> 'true'
     and (v_ctx->>'user_id')::uuid <> p_user_id
  then
    raise exception 'Owner detail access denied';
  end if;

  select coalesce(jsonb_agg(public._apresp277_row(r)), '[]'::jsonb) into v_owned
  from public.app_portal_responsibilities r
  where r.company_id = v_company_id and r.primary_owner_id = p_user_id;

  select coalesce(jsonb_agg(public._apresp277_row(r)), '[]'::jsonb) into v_backup
  from public.app_portal_responsibilities r
  where r.company_id = v_company_id and r.backup_owner_id = p_user_id;

  if to_regclass('public.app_portal_follow_ups') is not null then
    select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'title', f.title, 'status', f.status)), '[]'::jsonb)
    into v_follow_ups
    from public.app_portal_follow_ups f
    where f.company_id = v_company_id and f.assigned_owner_id = p_user_id
      and f.status not in ('completed', 'cancelled');
  end if;

  if to_regclass('public.app_portal_goals') is not null then
    select coalesce(jsonb_agg(jsonb_build_object('id', g.id, 'title', g.title, 'status', g.status)), '[]'::jsonb)
    into v_goals
    from public.app_portal_goals g
    where g.company_id = v_company_id and g.owner_id = p_user_id
      and g.status not in ('achieved', 'cancelled');
  end if;

  if to_regclass('public.action_requests') is not null then
    select count(*)::int into v_approvals
    from public.action_requests ar
    where ar.company_id = v_company_id and ar.status = 'pending';
  end if;

  if to_regclass('public.app_portal_support_requests') is not null then
    select count(*)::int into v_support
    from public.app_portal_support_requests sr
    where sr.company_id = v_company_id and sr.created_by = p_user_id
      and sr.status not in ('resolved', 'closed');
  end if;

  v_total := jsonb_array_length(v_owned) + jsonb_array_length(v_backup) + jsonb_array_length(v_follow_ups) + jsonb_array_length(v_goals) + v_approvals + v_support;
  if v_total >= 8 then v_workload := 'high';
  elsif v_total >= 4 then v_workload := 'moderate';
  end if;

  return jsonb_build_object(
    'found', true,
    'user_id', p_user_id,
    'user_name', public._apresp277_user_name(p_user_id),
    'owned_responsibilities', v_owned,
    'backup_responsibilities', v_backup,
    'assigned_follow_ups', v_follow_ups,
    'assigned_goals', v_goals,
    'pending_approvals', v_approvals,
    'open_support_requests', v_support,
    'workload_indicator', v_workload,
    'workload_total', v_total
  );
end;
$$;

grant execute on function public.list_app_portal_responsibilities(text, uuid, text, date, boolean, text, text) to authenticated;
grant execute on function public.get_app_portal_responsibility(uuid) to authenticated;
grant execute on function public.create_app_portal_responsibility(text, text, text, uuid, uuid, jsonb, text, text, date, text, text) to authenticated;
grant execute on function public.update_app_portal_responsibility(uuid, text, text, text, uuid, uuid, jsonb, text, text, date, text, text, boolean, boolean) to authenticated;
grant execute on function public.get_app_portal_responsibility_owner(uuid) to authenticated;
