-- Phase 307 (APP) — Business Pack Automation Orchestration Center

create table if not exists public.app_portal_business_pack_automation_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  member_access_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_business_pack_automation_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  automation_key text not null,
  automation_name text not null default '',
  pack_key text not null default '',
  category text not null default 'operational' check (category in (
    'operational', 'support', 'governance', 'executive', 'notification',
    'business_pack', 'customer_success', 'custom'
  )),
  status text not null default 'recommended' check (status in (
    'recommended', 'draft', 'active', 'paused', 'requires_review', 'retired'
  )),
  health_status text not null default 'stable' check (health_status in (
    'healthy', 'stable', 'requires_attention', 'at_risk'
  )),
  trigger_description text not null default '',
  action_description text not null default '',
  estimated_value numeric(14, 2) not null default 0,
  time_saved_hours numeric(10, 2) not null default 0,
  owner text not null default '',
  success_rate integer not null default 0 check (success_rate between 0 and 100),
  recommended_improvements jsonb not null default '[]'::jsonb,
  last_execution_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, automation_key)
);

create index if not exists app_portal_business_pack_automation_records_company_idx
  on public.app_portal_business_pack_automation_records (company_id, status, category, health_status);

create table if not exists public.app_portal_business_pack_automation_approvals (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  automation_key text not null,
  approver_name text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  governance_notes text not null default '',
  review_schedule text not null default 'quarterly',
  approved_by uuid references public.users (id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_automation_approvals_idx
  on public.app_portal_business_pack_automation_approvals (company_id, automation_key, created_at desc);

create table if not exists public.app_portal_business_pack_automation_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  snapshot_date date not null default current_date,
  total_automations integer not null default 0,
  active_automations integer not null default 0,
  recommended_count integer not null default 0,
  review_count integer not null default 0,
  total_time_saved_hours numeric(10, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (company_id, snapshot_date)
);

create table if not exists public.app_portal_business_pack_automation_timeline (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  automation_key text not null default '',
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_automation_timeline_idx
  on public.app_portal_business_pack_automation_timeline (company_id, created_at desc);

create table if not exists public.app_portal_business_pack_automation_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  automation_key text,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_automation_audit_idx
  on public.app_portal_business_pack_automation_audit_logs (company_id, created_at desc);

alter table public.app_portal_business_pack_automation_state enable row level security;
alter table public.app_portal_business_pack_automation_records enable row level security;
alter table public.app_portal_business_pack_automation_approvals enable row level security;
alter table public.app_portal_business_pack_automation_snapshots enable row level security;
alter table public.app_portal_business_pack_automation_timeline enable row level security;
alter table public.app_portal_business_pack_automation_audit_logs enable row level security;
revoke all on public.app_portal_business_pack_automation_state from authenticated, anon;
revoke all on public.app_portal_business_pack_automation_records from authenticated, anon;
revoke all on public.app_portal_business_pack_automation_approvals from authenticated, anon;
revoke all on public.app_portal_business_pack_automation_snapshots from authenticated, anon;
revoke all on public.app_portal_business_pack_automation_timeline from authenticated, anon;
revoke all on public.app_portal_business_pack_automation_audit_logs from authenticated, anon;

create or replace function public._abpao307_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
  v_role text;
  v_member_enabled boolean := true;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';

  select coalesce(as_.member_access_enabled, true) into v_member_enabled
  from public.app_portal_business_pack_automation_state as_
  where as_.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_member' and not v_member_enabled then
    raise exception 'Automation Center access requires organization authorization';
  end if;

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_full', v_role in ('organization_owner', 'organization_admin'),
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'can_view', v_role in ('organization_owner', 'organization_admin', 'organization_manager', 'organization_member'),
    'can_approve', v_role in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._abpao307_infer_category(p_pack_key text)
returns text
language sql
immutable
as $$
  select case
    when p_pack_key ilike '%support%' then 'support'
    when p_pack_key ilike '%governance%' or p_pack_key ilike '%compliance%' then 'governance'
    when p_pack_key ilike '%executive%' then 'executive'
    when p_pack_key ilike '%notification%' or p_pack_key ilike '%presence%' then 'notification'
    when p_pack_key ilike '%customer%' or p_pack_key ilike '%success%' then 'customer_success'
    else 'operational'
  end;
$$;

create or replace function public._abpao307_infer_health(p_success integer, p_status text)
returns text
language sql
immutable
as $$
  select case
    when p_status in ('requires_review', 'paused') then 'requires_attention'
    when p_success >= 90 and p_status = 'active' then 'healthy'
    when p_success >= 70 then 'stable'
    when p_success >= 40 then 'requires_attention'
    else 'at_risk'
  end;
$$;

create or replace function public._abpao307_sync_records(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pack record;
  v_adoption integer;
  v_key text;
begin
  insert into public.app_portal_business_pack_automation_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  if to_regclass('public.tenant_modules') is not null then
    for v_pack in
      select tm.module_key, tm.status
      from public.tenant_modules tm
      where tm.company_id = p_company_id and tm.status in ('enabled', 'trial', 'beta')
    loop
      v_adoption := 0;
      if to_regclass('public.app_portal_business_pack_adoption') is not null then
        select a.adoption_score into v_adoption
        from public.app_portal_business_pack_adoption a
        where a.company_id = p_company_id and a.pack_key = v_pack.module_key;
      end if;
      v_adoption := coalesce(v_adoption, 0);

      v_key := v_pack.module_key || '-workflow-automation';
      insert into public.app_portal_business_pack_automation_records (
        company_id, automation_key, automation_name, pack_key, category, status,
        trigger_description, action_description, estimated_value, time_saved_hours,
        success_rate, health_status, recommended_improvements
      ) values (
        p_company_id, v_key, initcap(replace(v_pack.module_key, '_', ' ')) || ' Workflow',
        v_pack.module_key, public._abpao307_infer_category(v_pack.module_key),
        case when v_adoption >= 50 then 'active' else 'recommended' end,
        'When operational conditions are met within ' || v_pack.module_key,
        'Prepare recommended action for human approval',
        round(v_adoption * 50::numeric, 2), round(v_adoption * 0.3::numeric, 2),
        least(100, v_adoption + 20),
        public._abpao307_infer_health(least(100, v_adoption + 20), case when v_adoption >= 50 then 'active' else 'recommended' end),
        '["Review automation triggers","Confirm approval workflow"]'::jsonb
      )
      on conflict (company_id, automation_key) do update set
        pack_key = excluded.pack_key,
        category = excluded.category,
        updated_at = now();

      v_key := v_pack.module_key || '-notification-automation';
      insert into public.app_portal_business_pack_automation_records (
        company_id, automation_key, automation_name, pack_key, category, status,
        trigger_description, action_description, estimated_value, time_saved_hours, success_rate, health_status
      ) values (
        p_company_id, v_key, initcap(replace(v_pack.module_key, '_', ' ')) || ' Notifications',
        v_pack.module_key, 'notification', 'recommended',
        'When attention-required events occur',
        'Notify responsible team members for review',
        round(v_adoption * 25::numeric, 2), round(v_adoption * 0.15::numeric, 2),
        least(100, v_adoption + 10), 'stable'
      )
      on conflict (company_id, automation_key) do nothing;
    end loop;
  end if;
end;
$$;

create or replace function public._abpao307_automation_card(p_row public.app_portal_business_pack_automation_records)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', p_row.automation_key,
    'automation_key', p_row.automation_key,
    'name', p_row.automation_name,
    'pack_key', p_row.pack_key,
    'category', p_row.category,
    'status', p_row.status,
    'health_status', p_row.health_status,
    'trigger_description', p_row.trigger_description,
    'action_description', p_row.action_description,
    'estimated_value', p_row.estimated_value,
    'time_saved_hours', p_row.time_saved_hours,
    'owner', p_row.owner,
    'success_rate', p_row.success_rate,
    'recommended_improvements', p_row.recommended_improvements,
    'last_execution_at', p_row.last_execution_at
  );
$$;

create or replace function public._abpao307_build_recommendations(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_row record;
begin
  v_recs := v_recs || jsonb_build_object('id', 'notify-' || p_company_id, 'key', 'automateNotifications');
  v_recs := v_recs || jsonb_build_object('id', 'approval-' || p_company_id, 'key', 'introduceApprovals');
  v_recs := v_recs || jsonb_build_object('id', 'manual-' || p_company_id, 'key', 'reduceManualEffort');

  for v_row in
    select ar.* from public.app_portal_business_pack_automation_records ar
    where ar.company_id = p_company_id and ar.status = 'recommended'
  loop
    v_recs := v_recs || jsonb_build_object('id', 'explore-' || v_row.automation_key, 'key', 'explorePackAutomation', 'automation_key', v_row.automation_key);
  end loop;

  for v_row in
    select ar.* from public.app_portal_business_pack_automation_records ar
    where ar.company_id = p_company_id and ar.health_status = 'at_risk'
  loop
    v_recs := v_recs || jsonb_build_object('id', 'review-' || v_row.automation_key, 'key', 'reviewFailing', 'automation_key', v_row.automation_key);
  end loop;

  for v_row in
    select ar.* from public.app_portal_business_pack_automation_records ar
    where ar.company_id = p_company_id and ar.status = 'active' and ar.success_rate >= 80
  loop
    v_recs := v_recs || jsonb_build_object('id', 'expand-' || v_row.automation_key, 'key', 'expandSuccessful', 'automation_key', v_row.automation_key);
  end loop;

  return v_recs;
end;
$$;

create or replace function public._abpao307_build_insights(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
begin
  return jsonb_build_object(
    'most_valuable', (
      select coalesce(jsonb_agg(jsonb_build_object('automation_key', ar.automation_key, 'name', ar.automation_name, 'estimated_value', ar.estimated_value) order by ar.estimated_value desc), '[]'::jsonb)
      from (select ar.* from public.app_portal_business_pack_automation_records ar where ar.company_id = p_company_id order by ar.estimated_value desc limit 5) ar
    ),
    'underutilized', (
      select coalesce(jsonb_agg(jsonb_build_object('automation_key', ar.automation_key, 'name', ar.automation_name)), '[]'::jsonb)
      from public.app_portal_business_pack_automation_records ar
      where ar.company_id = p_company_id and ar.status in ('recommended', 'draft', 'paused')
      limit 5
    ),
    'frequently_used', (
      select coalesce(jsonb_agg(jsonb_build_object('automation_key', ar.automation_key, 'name', ar.automation_name)), '[]'::jsonb)
      from public.app_portal_business_pack_automation_records ar
      where ar.company_id = p_company_id and ar.status = 'active'
      limit 5
    ),
    'failed_attention', (
      select coalesce(jsonb_agg(jsonb_build_object('automation_key', ar.automation_key, 'name', ar.automation_name)), '[]'::jsonb)
      from public.app_portal_business_pack_automation_records ar
      where ar.company_id = p_company_id and ar.health_status in ('requires_attention', 'at_risk')
      limit 5
    ),
    'expansion_opportunities', (
      select coalesce(jsonb_agg(jsonb_build_object('automation_key', ar.automation_key, 'name', ar.automation_name)), '[]'::jsonb)
      from public.app_portal_business_pack_automation_records ar
      where ar.company_id = p_company_id and ar.status = 'recommended'
      limit 5
    )
  );
end;
$$;

create or replace function public.list_app_portal_business_pack_automation(
  p_category text default null,
  p_status text default null,
  p_owner text default null,
  p_pack_key text default null,
  p_health_status text default null,
  p_period_from date default null,
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
  v_user_id uuid;
  v_automations jsonb := '[]'::jsonb;
  v_row record;
  v_total integer := 0;
  v_active integer := 0;
  v_recommended integer := 0;
  v_review integer := 0;
  v_hours numeric := 0;
begin
  v_ctx := public._abpao307_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abpao307_sync_records(v_company_id, v_user_id);

  for v_row in
    select ar.* from public.app_portal_business_pack_automation_records ar
    where ar.company_id = v_company_id
      and (p_category is null or ar.category = p_category)
      and (p_status is null or ar.status = p_status)
      and (p_owner is null or trim(p_owner) = '' or ar.owner ilike '%' || trim(p_owner) || '%')
      and (p_pack_key is null or ar.pack_key = p_pack_key)
      and (p_health_status is null or ar.health_status = p_health_status)
      and (p_period_from is null or ar.created_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or ar.automation_name ilike '%' || trim(p_search) || '%' or ar.pack_key ilike '%' || trim(p_search) || '%')
    order by ar.estimated_value desc
  loop
    v_automations := v_automations || public._abpao307_automation_card(v_row);
    v_total := v_total + 1;
    if v_row.status = 'active' then v_active := v_active + 1; end if;
    if v_row.status = 'recommended' then v_recommended := v_recommended + 1; end if;
    if v_row.status = 'requires_review' or v_row.health_status in ('requires_attention', 'at_risk') then v_review := v_review + 1; end if;
    v_hours := v_hours + coalesce(v_row.time_saved_hours, 0);
  end loop;

  insert into public.app_portal_business_pack_automation_snapshots (
    company_id, total_automations, active_automations, recommended_count, review_count, total_time_saved_hours
  ) values (v_company_id, v_total, v_active, v_recommended, v_review, v_hours)
  on conflict (company_id, snapshot_date) do update set
    total_automations = excluded.total_automations,
    active_automations = excluded.active_automations,
    recommended_count = excluded.recommended_count,
    review_count = excluded.review_count,
    total_time_saved_hours = excluded.total_time_saved_hours;

  return jsonb_build_object(
    'found', true,
    'can_full', coalesce(v_ctx->>'can_full', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'can_approve', coalesce(v_ctx->>'can_approve', 'false') = 'true',
    'has_automation_data', v_total > 0,
    'total_automations', v_total,
    'active_automations', v_active,
    'recommended_automations', v_recommended,
    'automations_requiring_review', v_review,
    'time_saved_hours', round(v_hours, 2),
    'executive_summary', case
      when v_total = 0 then 'No automation insights are available yet.'
      when v_active >= v_total / 2 then 'Automation coverage is developing across the Business Pack ecosystem.'
      when v_recommended > 0 then format('%s automation opportunities are available for review.', v_recommended)
      else 'Automation health remains stable — periodic governance reviews are recommended.'
    end,
    'automations', v_automations,
    'insights', public._abpao307_build_insights(v_company_id),
    'recommendations', public._abpao307_build_recommendations(v_company_id),
    'principle', 'Explicit approval is always required before automations are enabled — Aipify never activates automations without authorization.'
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_automation_detail(p_automation_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_row record;
  v_approvals jsonb;
begin
  v_ctx := public._abpao307_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abpao307_sync_records(v_company_id, v_user_id);

  select ar.* into v_row
  from public.app_portal_business_pack_automation_records ar
  where ar.company_id = v_company_id and ar.automation_key = p_automation_key;

  if not found then
    return jsonb_build_object('found', false);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'status', a.status, 'approver_name', a.approver_name,
    'governance_notes', a.governance_notes, 'review_schedule', a.review_schedule, 'approved_at', a.approved_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_approvals
  from public.app_portal_business_pack_automation_approvals a
  where a.company_id = v_company_id and a.automation_key = p_automation_key;

  return public._abpao307_automation_card(v_row) || jsonb_build_object(
    'found', true,
    'approval_history', v_approvals,
    'can_approve', coalesce(v_ctx->>'can_approve', 'false') = 'true',
    'recommendations', (
      select coalesce(jsonb_agg(r), '[]'::jsonb) from (
        select r from jsonb_array_elements(public._abpao307_build_recommendations(v_company_id)) r
        where r->>'automation_key' = p_automation_key or r->>'automation_key' is null
      ) sub
    )
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_automation_recommendations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
begin
  v_ctx := public._abpao307_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpao307_sync_records(v_company_id, v_user_id);

  return jsonb_build_object(
    'found', true,
    'recommendations', public._abpao307_build_recommendations(v_company_id)
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_automation_timeline(
  p_automation_key text default null,
  p_period_from date default null
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
  v_user_id uuid;
  v_events jsonb;
begin
  v_ctx := public._abpao307_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpao307_sync_records(v_company_id, v_user_id);

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb)
  into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'automation_key', t.automation_key, 'event_type', t.event_type,
      'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_business_pack_automation_timeline t
    where t.company_id = v_company_id
      and (p_automation_key is null or t.automation_key = p_automation_key)
      and (p_period_from is null or t.created_at::date >= p_period_from)
    order by t.created_at desc
    limit 20
  ) sub;

  if jsonb_array_length(v_events) = 0 then
    select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb)
    into v_events
    from (
      select jsonb_build_object(
        'id', ar.id, 'automation_key', ar.automation_key, 'event_type',
        case when ar.status = 'active' then 'automation_activated' else 'automation_recommended' end,
        'description', ar.automation_name, 'created_at', ar.created_at
      ) as row
      from public.app_portal_business_pack_automation_records ar
      where ar.company_id = v_company_id
        and (p_automation_key is null or ar.automation_key = p_automation_key)
      order by ar.created_at desc
      limit 15
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;

create or replace function public.approve_app_portal_business_pack_automation(
  p_automation_key text,
  p_governance_notes text default null,
  p_review_schedule text default 'quarterly'
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
  v_approval_id uuid;
begin
  v_ctx := public._abpao307_access_context();
  if coalesce(v_ctx->>'can_approve', 'false') <> 'true' then
    raise exception 'Automation approval requires manager authorization or higher';
  end if;

  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if not exists (
    select 1 from public.app_portal_business_pack_automation_records ar
    where ar.company_id = v_company_id and ar.automation_key = p_automation_key
  ) then
    raise exception 'Automation not found';
  end if;

  insert into public.app_portal_business_pack_automation_approvals (
    company_id, automation_key, approver_name, status, governance_notes, review_schedule, approved_by, approved_at
  ) values (
    v_company_id, p_automation_key, coalesce((select u.display_name from public.users u where u.id = v_user_id), 'Approver'),
    'approved', coalesce(p_governance_notes, ''), coalesce(p_review_schedule, 'quarterly'), v_user_id, now()
  ) returning id into v_approval_id;

  update public.app_portal_business_pack_automation_records set
    status = 'active',
    health_status = 'healthy',
    updated_at = now()
  where company_id = v_company_id and automation_key = p_automation_key;

  insert into public.app_portal_business_pack_automation_timeline (
    company_id, automation_key, event_type, description, performed_by
  ) values (
    v_company_id, p_automation_key, 'automation_activated',
    'Automation approved and activated with explicit authorization', v_user_id
  );

  insert into public.app_portal_business_pack_automation_audit_logs (
    company_id, automation_key, event_type, description, performed_by, metadata
  ) values (
    v_company_id, p_automation_key, 'automation_approved', 'Automation explicitly approved',
    v_user_id, jsonb_build_object('approval_id', v_approval_id)
  );

  return jsonb_build_object(
    'found', true,
    'approval_id', v_approval_id,
    'status', 'approved',
    'automation_key', p_automation_key,
    'message', 'Automation approved — activation recorded with governance audit trail.'
  );
end;
$$;

grant execute on function public._abpao307_access_context() to authenticated;
grant execute on function public.list_app_portal_business_pack_automation(text, text, text, text, text, date, text) to authenticated;
grant execute on function public.get_app_portal_business_pack_automation_detail(text) to authenticated;
grant execute on function public.get_app_portal_business_pack_automation_recommendations() to authenticated;
grant execute on function public.get_app_portal_business_pack_automation_timeline(text, date) to authenticated;
grant execute on function public.approve_app_portal_business_pack_automation(text, text, text) to authenticated;
