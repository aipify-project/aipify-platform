-- Phase 291 (APP) — Organizational Commitment Tracking Center

create table if not exists public.app_portal_commitments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  commitment_type text not null check (commitment_type in (
    'customer_commitment', 'employee_commitment', 'executive_commitment', 'team_commitment',
    'vendor_commitment', 'regulatory_commitment', 'strategic_commitment', 'operational_commitment',
    'partnership_commitment', 'custom_commitment'
  )),
  owner_id uuid references public.users (id) on delete set null,
  recipient text not null default '',
  contributor_ids jsonb not null default '[]'::jsonb,
  status text not null default 'proposed' check (status in (
    'proposed', 'accepted', 'in_progress', 'at_risk', 'fulfilled', 'cancelled', 'archived'
  )),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  commitment_date date,
  due_date date,
  fulfillment_criteria text not null default '',
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  milestones_achieved text not null default '',
  delays_encountered text not null default '',
  obstacles_identified text not null default '',
  completion_evidence text not null default '',
  lessons_learned text not null default '',
  related_goal_ids jsonb not null default '[]'::jsonb,
  related_follow_up_ids jsonb not null default '[]'::jsonb,
  related_decision_ids jsonb not null default '[]'::jsonb,
  related_communication_ids jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_commitments_company_idx
  on public.app_portal_commitments (company_id, commitment_type, status, priority, due_date, updated_at desc);

create table if not exists public.app_portal_commitment_progress (
  id uuid primary key default gen_random_uuid(),
  commitment_id uuid not null references public.app_portal_commitments (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  progress_percent integer check (progress_percent between 0 and 100),
  milestones_achieved text not null default '',
  delays_encountered text not null default '',
  obstacles_identified text not null default '',
  progress_update text not null default '',
  completion_evidence text not null default '',
  lessons_learned text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_commitment_progress_commitment_idx
  on public.app_portal_commitment_progress (commitment_id, created_at desc);

create table if not exists public.app_portal_commitment_audit_logs (
  id uuid primary key default gen_random_uuid(),
  commitment_id uuid not null references public.app_portal_commitments (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_commitment_audit_idx
  on public.app_portal_commitment_audit_logs (commitment_id, created_at desc);

alter table public.app_portal_commitments enable row level security;
alter table public.app_portal_commitment_progress enable row level security;
alter table public.app_portal_commitment_audit_logs enable row level security;
revoke all on public.app_portal_commitments from authenticated, anon;
revoke all on public.app_portal_commitment_progress from authenticated, anon;
revoke all on public.app_portal_commitment_audit_logs from authenticated, anon;

create or replace function public._aoct291_access_context()
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
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'is_executive', v_role in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._aoct291_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._aoct291_can_view(
  c public.app_portal_commitments,
  p_ctx jsonb
)
returns boolean
language plpgsql
stable
as $$
declare v_uid uuid;
begin
  if (p_ctx->>'company_id')::uuid <> c.company_id then return false; end if;
  if coalesce(p_ctx->>'can_manage', 'false') = 'true' then return true; end if;
  v_uid := (p_ctx->>'user_id')::uuid;
  if c.owner_id = v_uid then return true; end if;
  if exists (
    select 1 from jsonb_array_elements_text(coalesce(c.contributor_ids, '[]'::jsonb)) t
    where t.value::uuid = v_uid
  ) then return true; end if;
  return false;
end;
$$;

create or replace function public._aoct291_row(c public.app_portal_commitments)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', c.id,
    'title', c.title,
    'description', left(c.description, 300),
    'commitment_type', c.commitment_type,
    'owner_id', c.owner_id,
    'owner_name', public._aoct291_user_name(c.owner_id),
    'recipient', c.recipient,
    'contributor_ids', c.contributor_ids,
    'status', c.status,
    'priority', c.priority,
    'commitment_date', c.commitment_date,
    'due_date', c.due_date,
    'fulfillment_criteria', left(c.fulfillment_criteria, 300),
    'progress_percent', c.progress_percent,
    'is_overdue', c.due_date is not null and c.due_date < current_date and c.status not in ('fulfilled', 'cancelled', 'archived'),
    'is_at_risk', c.status = 'at_risk',
    'notes', left(c.notes, 300),
    'created_at', c.created_at,
    'updated_at', c.updated_at
  );
$$;

create or replace function public._aoct291_build_recommendations(p_items jsonb)
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
    if coalesce((v_item->>'is_overdue')::boolean, false) then
      v_recs := v_recs || jsonb_build_object('id', 'deadline-' || (v_item->>'id'), 'key', 'reviewDeadlines', 'commitment_id', v_item->>'id', 'priority', 'high');
    elsif coalesce((v_item->>'is_at_risk')::boolean, false) then
      v_recs := v_recs || jsonb_build_object('id', 'escalate-' || (v_item->>'id'), 'key', 'escalateAtRisk', 'commitment_id', v_item->>'id', 'priority', 'high');
    elsif (v_item->>'status') = 'fulfilled' then
      v_recs := v_recs || jsonb_build_object('id', 'celebrate-' || (v_item->>'id'), 'key', 'celebrateFulfilled', 'commitment_id', v_item->>'id', 'priority', 'low');
    elsif trim(coalesce(v_item->>'fulfillment_criteria', '')) = '' then
      v_recs := v_recs || jsonb_build_object('id', 'criteria-' || (v_item->>'id'), 'key', 'clarifyCriteria', 'commitment_id', v_item->>'id', 'priority', 'medium');
    end if;
  end loop;
  v_recs := v_recs || jsonb_build_object('id', 'support', 'key', 'assignSupport', 'priority', 'medium');
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_commitments(
  p_commitment_type text default null,
  p_status text default null,
  p_owner_id uuid default null,
  p_recipient text default null,
  p_priority text default null,
  p_due_from date default null,
  p_due_to date default null,
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
  v_active integer := 0;
  v_at_risk jsonb := '[]'::jsonb;
  v_fulfilled jsonb := '[]'::jsonb;
  v_overdue integer := 0;
  v_high_priority jsonb := '[]'::jsonb;
  v_trends jsonb := '[]'::jsonb;
begin
  v_ctx := public._aoct291_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._aoct291_row(c) order by c.due_date asc nulls last, c.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_commitments c
  where c.company_id = v_company_id
    and public._aoct291_can_view(c, v_ctx)
    and (p_commitment_type is null or c.commitment_type = p_commitment_type)
    and (p_status is null or c.status = p_status)
    and (p_owner_id is null or c.owner_id = p_owner_id)
    and (p_recipient is null or trim(p_recipient) = '' or c.recipient ilike '%' || trim(p_recipient) || '%')
    and (p_priority is null or c.priority = p_priority)
    and (p_due_from is null or c.due_date >= p_due_from)
    and (p_due_to is null or c.due_date <= p_due_to)
    and (
      p_search is null or trim(p_search) = ''
      or c.title ilike '%' || trim(p_search) || '%'
      or c.description ilike '%' || trim(p_search) || '%'
      or c.recipient ilike '%' || trim(p_search) || '%'
      or c.fulfillment_criteria ilike '%' || trim(p_search) || '%'
      or c.notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active
  from public.app_portal_commitments c
  where c.company_id = v_company_id
    and c.status in ('accepted', 'in_progress', 'at_risk');

  select coalesce(jsonb_agg(public._aoct291_row(c) order by c.updated_at desc), '[]'::jsonb)
  into v_at_risk
  from public.app_portal_commitments c
  where c.company_id = v_company_id
    and c.status = 'at_risk'
    and public._aoct291_can_view(c, v_ctx)
  limit 5;

  select coalesce(jsonb_agg(public._aoct291_row(c) order by c.updated_at desc), '[]'::jsonb)
  into v_fulfilled
  from (
    select * from public.app_portal_commitments
    where company_id = v_company_id and status = 'fulfilled'
    order by updated_at desc limit 5
  ) c;

  select count(*)::int into v_overdue
  from public.app_portal_commitments c
  where c.company_id = v_company_id
    and c.due_date is not null
    and c.due_date < current_date
    and c.status not in ('fulfilled', 'cancelled', 'archived');

  select coalesce(jsonb_agg(public._aoct291_row(c) order by c.due_date asc nulls last), '[]'::jsonb)
  into v_high_priority
  from public.app_portal_commitments c
  where c.company_id = v_company_id
    and c.priority in ('high', 'critical')
    and c.status not in ('fulfilled', 'cancelled', 'archived')
    and public._aoct291_can_view(c, v_ctx)
  limit 5;

  select coalesce(jsonb_agg(public._aoct291_row(c) order by c.updated_at desc), '[]'::jsonb)
  into v_trends
  from (select * from public.app_portal_commitments where company_id = v_company_id order by updated_at desc limit 5) c;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active', v_active,
      'at_risk', v_at_risk,
      'recently_fulfilled', v_fulfilled,
      'overdue', v_overdue,
      'high_priority', v_high_priority,
      'completion_trends', v_trends
    ),
    'recommendations', public._aoct291_build_recommendations(v_items),
    'principle', 'Trust grows when organizations consistently follow through on their commitments.'
  );
end;
$$;

create or replace function public.get_app_portal_commitment(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_c public.app_portal_commitments;
  v_audit jsonb := '[]'::jsonb;
  v_progress jsonb := '[]'::jsonb;
  v_goals jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
  v_decisions jsonb := '[]'::jsonb;
  v_comms jsonb := '[]'::jsonb;
begin
  v_ctx := public._aoct291_access_context();
  select * into v_c from public.app_portal_commitments where id = p_id;
  if v_c.id is null then return jsonb_build_object('found', false); end if;
  if not public._aoct291_can_view(v_c, v_ctx) then
    raise exception 'Commitment access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._aoct291_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_commitment_audit_logs l where l.commitment_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'progress_percent', p.progress_percent,
    'milestones_achieved', p.milestones_achieved,
    'delays_encountered', p.delays_encountered,
    'obstacles_identified', p.obstacles_identified,
    'progress_update', p.progress_update,
    'completion_evidence', p.completion_evidence,
    'lessons_learned', p.lessons_learned,
    'created_at', p.created_at,
    'performed_by', public._aoct291_user_name(p.performed_by)
  ) order by p.created_at desc), '[]'::jsonb)
  into v_progress
  from public.app_portal_commitment_progress p where p.commitment_id = p_id;

  if to_regclass('public.app_portal_goals') is not null
     and jsonb_array_length(coalesce(v_c.related_goal_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', g.id, 'title', g.title, 'status', g.status)), '[]'::jsonb)
    into v_goals from public.app_portal_goals g
    where g.id in (select t.value::uuid from jsonb_array_elements_text(v_c.related_goal_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null
     and jsonb_array_length(coalesce(v_c.related_follow_up_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'title', f.title, 'status', f.status)), '[]'::jsonb)
    into v_follow_ups from public.app_portal_follow_ups f
    where f.id in (select t.value::uuid from jsonb_array_elements_text(v_c.related_follow_up_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_decisions') is not null
     and jsonb_array_length(coalesce(v_c.related_decision_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', d.id, 'title', d.title, 'status', d.status)), '[]'::jsonb)
    into v_decisions from public.app_portal_decisions d
    where d.id in (select t.value::uuid from jsonb_array_elements_text(v_c.related_decision_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_communications') is not null
     and jsonb_array_length(coalesce(v_c.related_communication_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', cm.id, 'title', cm.title, 'status', cm.status)), '[]'::jsonb)
    into v_comms from public.app_portal_communications cm
    where cm.id in (select t.value::uuid from jsonb_array_elements_text(v_c.related_communication_ids) as t(value));
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'commitment', public._aoct291_row(v_c) || jsonb_build_object(
      'description_full', v_c.description,
      'fulfillment_criteria_full', v_c.fulfillment_criteria,
      'milestones_achieved', v_c.milestones_achieved,
      'delays_encountered', v_c.delays_encountered,
      'obstacles_identified', v_c.obstacles_identified,
      'completion_evidence', v_c.completion_evidence,
      'lessons_learned', v_c.lessons_learned,
      'notes_full', v_c.notes
    ),
    'progress_history', v_progress,
    'related_goals', v_goals,
    'related_follow_ups', v_follow_ups,
    'related_decisions', v_decisions,
    'related_communications', v_comms,
    'activity_timeline', v_audit,
    'audit_history', v_audit,
    'recommendations', public._aoct291_build_recommendations(jsonb_build_array(public._aoct291_row(v_c)))
  );
end;
$$;

create or replace function public.create_app_portal_commitment(
  p_title text,
  p_description text default '',
  p_commitment_type text default 'operational_commitment',
  p_recipient text default '',
  p_priority text default 'medium',
  p_due_date date default null,
  p_fulfillment_criteria text default '',
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
  v_c public.app_portal_commitments;
begin
  v_ctx := public._aoct291_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Commitment creation requires manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_commitments (
    company_id, title, description, commitment_type, owner_id, recipient,
    priority, commitment_date, due_date, fulfillment_criteria, notes, created_by, status
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 5000),
    coalesce(nullif(trim(p_commitment_type), ''), 'operational_commitment'),
    v_user_id,
    left(coalesce(p_recipient, ''), 500),
    coalesce(nullif(trim(p_priority), ''), 'medium'),
    current_date,
    p_due_date,
    left(coalesce(p_fulfillment_criteria, ''), 2000),
    left(coalesce(p_notes, ''), 2000),
    v_user_id,
    'proposed'
  ) returning id into v_id;

  insert into public.app_portal_commitment_audit_logs (commitment_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'Commitment recorded', v_user_id);

  select * into v_c from public.app_portal_commitments where id = v_id;
  return jsonb_build_object('created', true, 'commitment', public._aoct291_row(v_c));
end;
$$;

create or replace function public.update_app_portal_commitment(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_commitment_type text default null,
  p_status text default null,
  p_priority text default null,
  p_recipient text default null,
  p_fulfillment_criteria text default null,
  p_due_date date default null,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_c public.app_portal_commitments;
  v_user_id uuid;
begin
  v_ctx := public._aoct291_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Commitment update requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_c from public.app_portal_commitments where id = p_id;
  if v_c.id is null then raise exception 'Commitment not found'; end if;

  update public.app_portal_commitments set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    commitment_type = coalesce(nullif(trim(p_commitment_type), ''), commitment_type),
    status = coalesce(nullif(trim(p_status), ''), status),
    priority = coalesce(nullif(trim(p_priority), ''), priority),
    recipient = case when p_recipient is not null then left(p_recipient, 500) else recipient end,
    fulfillment_criteria = case when p_fulfillment_criteria is not null then left(p_fulfillment_criteria, 2000) else fulfillment_criteria end,
    due_date = coalesce(p_due_date, due_date),
    notes = case when p_notes is not null then left(p_notes, 2000) else notes end,
    updated_at = now()
  where id = p_id;

  insert into public.app_portal_commitment_audit_logs (commitment_id, company_id, event_type, description, performed_by)
  values (p_id, v_c.company_id, 'updated', 'Commitment updated', v_user_id);

  select * into v_c from public.app_portal_commitments where id = p_id;
  return jsonb_build_object('updated', true, 'commitment', public._aoct291_row(v_c));
end;
$$;

create or replace function public.record_app_portal_commitment_progress(
  p_id uuid,
  p_progress_percent integer default null,
  p_milestones_achieved text default null,
  p_delays_encountered text default null,
  p_obstacles_identified text default null,
  p_progress_update text default '',
  p_completion_evidence text default null,
  p_lessons_learned text default null,
  p_status text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_c public.app_portal_commitments;
  v_user_id uuid;
  v_progress integer;
begin
  v_ctx := public._aoct291_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Commitment progress requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_c from public.app_portal_commitments where id = p_id;
  if v_c.id is null then raise exception 'Commitment not found'; end if;

  v_progress := coalesce(greatest(0, least(100, p_progress_percent)), v_c.progress_percent);

  insert into public.app_portal_commitment_progress (
    commitment_id, company_id, progress_percent, milestones_achieved, delays_encountered,
    obstacles_identified, progress_update, completion_evidence, lessons_learned, performed_by
  ) values (
    p_id, v_c.company_id, v_progress,
    left(coalesce(p_milestones_achieved, ''), 2000),
    left(coalesce(p_delays_encountered, ''), 2000),
    left(coalesce(p_obstacles_identified, ''), 2000),
    left(coalesce(p_progress_update, ''), 2000),
    left(coalesce(p_completion_evidence, ''), 2000),
    left(coalesce(p_lessons_learned, ''), 2000),
    v_user_id
  );

  update public.app_portal_commitments set
    progress_percent = v_progress,
    status = coalesce(nullif(trim(p_status), ''), status),
    milestones_achieved = case when p_milestones_achieved is not null then left(p_milestones_achieved, 2000) else milestones_achieved end,
    delays_encountered = case when p_delays_encountered is not null then left(p_delays_encountered, 2000) else delays_encountered end,
    obstacles_identified = case when p_obstacles_identified is not null then left(p_obstacles_identified, 2000) else obstacles_identified end,
    completion_evidence = case when p_completion_evidence is not null then left(p_completion_evidence, 2000) else completion_evidence end,
    lessons_learned = case when p_lessons_learned is not null then left(p_lessons_learned, 2000) else lessons_learned end,
    updated_at = now()
  where id = p_id;

  insert into public.app_portal_commitment_audit_logs (commitment_id, company_id, event_type, description, performed_by, metadata)
  values (p_id, v_c.company_id, 'progress', 'Progress updated to ' || v_progress || '%', v_user_id,
    jsonb_build_object('progress_percent', v_progress));

  select * into v_c from public.app_portal_commitments where id = p_id;
  return jsonb_build_object('recorded', true, 'commitment', public._aoct291_row(v_c));
end;
$$;

grant execute on function public.list_app_portal_commitments(text, text, uuid, text, text, date, date, text) to authenticated;
grant execute on function public.get_app_portal_commitment(uuid) to authenticated;
grant execute on function public.create_app_portal_commitment(text, text, text, text, text, date, text, text) to authenticated;
grant execute on function public.update_app_portal_commitment(uuid, text, text, text, text, text, text, text, date, text) to authenticated;
grant execute on function public.record_app_portal_commitment_progress(uuid, integer, text, text, text, text, text, text, text) to authenticated;
