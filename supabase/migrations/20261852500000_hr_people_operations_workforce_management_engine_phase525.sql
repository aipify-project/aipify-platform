-- Phase 525 — HR, People Operations & Workforce Management Engine
-- Employees are people. Organizations succeed through people.
-- Integrates: organization_employee_profiles (503), Lifecycle (516), Goals Engine, Domains (505A)

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_people_operations_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enable_leave_management boolean not null default true,
  enable_attendance_tracking boolean not null default true,
  enable_performance_reviews boolean not null default true,
  enable_recognition boolean not null default true,
  companion_people_context_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_people_operations_settings enable row level security;
revoke all on public.organization_people_operations_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Attendance
-- ---------------------------------------------------------------------------
create table if not exists public.organization_people_attendance_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_profile_id uuid not null references public.organization_employee_profiles (id) on delete cascade,
  attendance_date date not null default current_date,
  status text not null default 'present' check (
    status in ('present', 'scheduled', 'absent', 'remote', 'completed')
  ),
  work_hours numeric(5, 2) not null default 0,
  check_in_at timestamptz,
  check_out_at timestamptz,
  location text not null default '',
  shift_key text,
  notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, employee_profile_id, attendance_date)
);

create index if not exists organization_people_attendance_org_idx
  on public.organization_people_attendance_records (organization_id, attendance_date desc);

alter table public.organization_people_attendance_records enable row level security;
revoke all on public.organization_people_attendance_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Leave management
-- ---------------------------------------------------------------------------
create table if not exists public.organization_people_leave_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  request_number text,
  employee_profile_id uuid not null references public.organization_employee_profiles (id) on delete cascade,
  leave_type text not null default 'vacation' check (
    leave_type in (
      'vacation', 'sick', 'parental', 'training', 'business_travel', 'personal', 'custom'
    )
  ),
  start_date date not null,
  end_date date not null,
  reason text not null default '',
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'cancelled')
  ),
  approval_status text not null default 'pending_manager' check (
    approval_status in ('pending_manager', 'approved', 'rejected')
  ),
  approved_by_user_id uuid references public.users (id) on delete set null,
  approved_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, request_number)
);

create index if not exists organization_people_leave_org_idx
  on public.organization_people_leave_requests (organization_id, status, start_date);

alter table public.organization_people_leave_requests enable row level security;
revoke all on public.organization_people_leave_requests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Workforce planning
-- ---------------------------------------------------------------------------
create table if not exists public.organization_people_workforce_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_id uuid references public.organization_departments (id) on delete set null,
  plan_period text not null default '',
  headcount_current int not null default 0,
  headcount_target int not null default 0,
  open_positions int not null default 0,
  capacity_score numeric(5, 2) not null default 0,
  workload_level text not null default 'balanced' check (
    workload_level in ('low', 'balanced', 'high', 'critical')
  ),
  hiring_needs text not null default '',
  succession_notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists organization_people_workforce_org_idx
  on public.organization_people_workforce_plans (organization_id, updated_at desc);

alter table public.organization_people_workforce_plans enable row level security;
revoke all on public.organization_people_workforce_plans from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Performance reviews
-- ---------------------------------------------------------------------------
create table if not exists public.organization_people_performance_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_number text,
  employee_profile_id uuid not null references public.organization_employee_profiles (id) on delete cascade,
  reviewer_user_id uuid references public.users (id) on delete set null,
  review_type text not null default 'quarterly' check (
    review_type in ('monthly', 'quarterly', 'annual', 'custom')
  ),
  review_period text not null default '',
  goals_summary text not null default '',
  achievements text not null default '',
  challenges text not null default '',
  feedback text not null default '',
  action_plan text not null default '',
  status text not null default 'draft' check (
    status in ('draft', 'in_progress', 'pending_approval', 'completed')
  ),
  rating numeric(3, 1),
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, review_number)
);

create index if not exists organization_people_reviews_org_idx
  on public.organization_people_performance_reviews (organization_id, status, updated_at desc);

alter table public.organization_people_performance_reviews enable row level security;
revoke all on public.organization_people_performance_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Development, goals, recognition
-- ---------------------------------------------------------------------------
create table if not exists public.organization_people_development_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_profile_id uuid not null references public.organization_employee_profiles (id) on delete cascade,
  development_type text not null check (
    development_type in ('training', 'certification', 'course', 'business_pack', 'leadership', 'learning_path')
  ),
  title text not null,
  provider text not null default '',
  status text not null default 'in_progress' check (
    status in ('planned', 'in_progress', 'completed', 'expired')
  ),
  business_pack_key text,
  completed_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_people_development_org_idx
  on public.organization_people_development_records (organization_id, status);

alter table public.organization_people_development_records enable row level security;
revoke all on public.organization_people_development_records from authenticated, anon;

create table if not exists public.organization_people_goals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  goal_number text,
  employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  goal_scope text not null default 'individual' check (
    goal_scope in ('individual', 'department', 'team', 'manager', 'organization')
  ),
  title text not null,
  description text not null default '',
  target_date date,
  status text not null default 'planned' check (
    status in ('planned', 'active', 'at_risk', 'achieved', 'missed')
  ),
  progress_percent int not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  owner_user_id uuid references public.users (id) on delete set null,
  business_pack_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, goal_number)
);

create index if not exists organization_people_goals_org_idx
  on public.organization_people_goals (organization_id, status, updated_at desc);

alter table public.organization_people_goals enable row level security;
revoke all on public.organization_people_goals from authenticated, anon;

create table if not exists public.organization_people_recognitions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_profile_id uuid not null references public.organization_employee_profiles (id) on delete cascade,
  recognition_type text not null check (
    recognition_type in (
      'achievement', 'milestone', 'work_anniversary', 'training_completion',
      'certification', 'project', 'internal'
    )
  ),
  title text not null,
  description text not null default '',
  recognized_by_user_id uuid references public.users (id) on delete set null,
  recognized_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_people_recognitions_org_idx
  on public.organization_people_recognitions (organization_id, recognized_at desc);

alter table public.organization_people_recognitions enable row level security;
revoke all on public.organization_people_recognitions from authenticated, anon;

create table if not exists public.organization_people_operations_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_people_audit_org_idx
  on public.organization_people_operations_audit_logs (organization_id, created_at desc);

alter table public.organization_people_operations_audit_logs enable row level security;
revoke all on public.organization_people_operations_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._ppl525_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._ppl525_log(
  p_org_id uuid,
  p_action text,
  p_summary text,
  p_employee_id uuid default null,
  p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_people_operations_audit_logs (
    organization_id, actor_user_id, action, summary, employee_profile_id, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_employee_id,
    coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._ppl525_next_number(p_org_id uuid, p_prefix text, p_table text)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  execute format('select count(*) + 1 from public.%I where organization_id = $1', p_table)
  into v_n using p_org_id;
  return p_prefix || '-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._ppl525_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_people_operations_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._ppl525_employee_json(p_row public.organization_employee_profiles)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'employee_number', p_row.employee_number,
    'full_name', p_row.full_name,
    'email', p_row.email,
    'job_title', p_row.job_title,
    'department_name', (select name from public.organization_departments where id = p_row.department_id),
    'manager_name', (select coalesce(u.full_name, u.email) from public.users u where u.id = p_row.manager_user_id),
    'office_location', p_row.office_location,
    'employee_status', p_row.employee_status,
    'org_role', p_row.org_role,
    'start_date', p_row.start_date,
    'updated_at', p_row.updated_at
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. People Operations Center
-- ---------------------------------------------------------------------------
create or replace function public.get_people_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('people.view');
  v_org_id := public._ppl525_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._ppl525_ensure_settings(v_org_id);
  perform public._ppl525_log(v_org_id, 'center_view', 'People Center viewed', null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Employees are not resources. Employees are people.',
    'overview', jsonb_build_object(
      'workforce_size', (
        select count(*) from public.organization_employee_profiles
        where organization_id = v_org_id and employee_status = 'active'
      ),
      'present_today', (
        select count(*) from public.organization_people_attendance_records
        where organization_id = v_org_id and attendance_date = current_date
          and status in ('present', 'remote', 'completed')
      ),
      'on_leave_today', (
        select count(*) from public.organization_people_leave_requests
        where organization_id = v_org_id and status = 'approved'
          and current_date between start_date and end_date
      ),
      'pending_leave', (
        select count(*) from public.organization_people_leave_requests
        where organization_id = v_org_id and status = 'pending'
      ),
      'upcoming_reviews', (
        select count(*) from public.organization_people_performance_reviews
        where organization_id = v_org_id and status in ('draft', 'in_progress', 'pending_approval')
      ),
      'active_goals', (
        select count(*) from public.organization_people_goals
        where organization_id = v_org_id and status in ('planned', 'active', 'at_risk')
      ),
      'training_in_progress', (
        select count(*) from public.organization_people_development_records
        where organization_id = v_org_id and status = 'in_progress'
      ),
      'open_positions', coalesce((
        select sum(open_positions) from public.organization_people_workforce_plans
        where organization_id = v_org_id
      ), 0)
    ),
    'workforce', coalesce((
      select jsonb_agg(public._ppl525_employee_json(e) order by e.full_name)
      from (
        select * from public.organization_employee_profiles
        where organization_id = v_org_id and employee_status = 'active'
        order by full_name limit 50
      ) e
    ), '[]'::jsonb),
    'attendance', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'employee_name', (select full_name from public.organization_employee_profiles where id = a.employee_profile_id),
        'attendance_date', a.attendance_date, 'status', a.status,
        'work_hours', a.work_hours, 'location', a.location
      ) order by a.attendance_date desc)
      from public.organization_people_attendance_records a
      where a.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'leave_requests', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'request_number', l.request_number,
        'employee_name', (select full_name from public.organization_employee_profiles where id = l.employee_profile_id),
        'leave_type', l.leave_type, 'start_date', l.start_date, 'end_date', l.end_date,
        'status', l.status, 'approval_status', l.approval_status
      ) order by l.start_date desc)
      from public.organization_people_leave_requests l
      where l.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'pending_leave', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'employee_name', (select full_name from public.organization_employee_profiles where id = l.employee_profile_id),
        'leave_type', l.leave_type, 'start_date', l.start_date, 'end_date', l.end_date
      ) order by l.start_date)
      from public.organization_people_leave_requests l
      where l.organization_id = v_org_id and l.status = 'pending' limit 30
    ), '[]'::jsonb),
    'development', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id,
        'employee_name', (select full_name from public.organization_employee_profiles where id = d.employee_profile_id),
        'development_type', d.development_type, 'title', d.title, 'status', d.status,
        'expires_at', d.expires_at, 'business_pack_key', d.business_pack_key
      ) order by d.updated_at desc)
      from public.organization_people_development_records d
      where d.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'performance_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_number', r.review_number,
        'employee_name', (select full_name from public.organization_employee_profiles where id = r.employee_profile_id),
        'review_type', r.review_type, 'review_period', r.review_period,
        'status', r.status, 'rating', r.rating
      ) order by r.updated_at desc)
      from public.organization_people_performance_reviews r
      where r.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'goals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', g.id, 'goal_number', g.goal_number, 'title', g.title,
        'goal_scope', g.goal_scope, 'status', g.status,
        'progress_percent', g.progress_percent, 'target_date', g.target_date,
        'employee_name', (select full_name from public.organization_employee_profiles where id = g.employee_profile_id)
      ) order by g.updated_at desc)
      from public.organization_people_goals g
      where g.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'workforce_planning', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id,
        'department_name', (select name from public.organization_departments where id = w.department_id),
        'headcount_current', w.headcount_current, 'headcount_target', w.headcount_target,
        'open_positions', w.open_positions, 'capacity_score', w.capacity_score,
        'workload_level', w.workload_level, 'hiring_needs', w.hiring_needs
      ) order by w.updated_at desc)
      from public.organization_people_workforce_plans w
      where w.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'recognitions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', rc.id,
        'employee_name', (select full_name from public.organization_employee_profiles where id = rc.employee_profile_id),
        'recognition_type', rc.recognition_type, 'title', rc.title,
        'recognized_at', rc.recognized_at
      ) order by rc.recognized_at desc)
      from public.organization_people_recognitions rc
      where rc.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'headcount', (select count(*) from public.organization_employee_profiles where organization_id = v_org_id and employee_status = 'active'),
      'leave_usage_month', (
        select count(*) from public.organization_people_leave_requests
        where organization_id = v_org_id and status = 'approved'
          and start_date >= date_trunc('month', now())
      ),
      'review_completion_rate', coalesce((
        select round(100.0 * count(*) filter (where status = 'completed') / nullif(count(*), 0), 1)
        from public.organization_people_performance_reviews where organization_id = v_org_id
      ), 0),
      'goal_achievement_rate', coalesce((
        select round(100.0 * count(*) filter (where status = 'achieved') / nullif(count(*), 0), 1)
        from public.organization_people_goals where organization_id = v_org_id
      ), 0),
      'training_completed', (
        select count(*) from public.organization_people_development_records
        where organization_id = v_org_id and status = 'completed'
      )
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_people_operations_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'workforce', 'attendance', 'leave', 'development',
      'performance', 'reviews', 'planning', 'reports'
    ),
    'routes', jsonb_build_object(
      'people', '/app/people',
      'attendance', '/app/people/attendance',
      'goals', '/app/people/goals',
      'employees', '/app/employees'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_people_operations_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
begin
  v_org_id := public._ppl525_org();
  if v_org_id is null then return jsonb_build_object('ok', false, 'error', 'organization_not_found'); end if;

  if p_action_type in (
    'record_attendance', 'create_leave_request', 'approve_leave', 'reject_leave',
    'create_review', 'complete_review', 'create_development', 'complete_development',
    'create_goal', 'update_goal_status', 'create_recognition', 'update_workforce_plan'
  ) then
    perform public._irp_require_permission('people.manage');
  else
    perform public._irp_require_permission('people.view');
  end if;

  perform public._ppl525_ensure_settings(v_org_id);

  if p_action_type = 'record_attendance' then
    insert into public.organization_people_attendance_records (
      organization_id, employee_profile_id, attendance_date, status,
      work_hours, location, check_in_at
    ) values (
      v_org_id,
      (p_payload->>'employee_profile_id')::uuid,
      coalesce(nullif(p_payload->>'attendance_date', '')::date, current_date),
      coalesce(p_payload->>'status', 'present'),
      coalesce((p_payload->>'work_hours')::numeric, 8),
      coalesce(p_payload->>'location', ''),
      now()
    )
    on conflict (organization_id, employee_profile_id, attendance_date) do update set
      status = excluded.status, work_hours = excluded.work_hours,
      location = excluded.location, updated_at = now()
    returning id into v_id;
    perform public._ppl525_log(v_org_id, 'attendance_recorded', 'Attendance recorded', (p_payload->>'employee_profile_id')::uuid, p_payload);
    return jsonb_build_object('ok', true, 'attendance_id', v_id);

  elsif p_action_type = 'create_leave_request' then
    insert into public.organization_people_leave_requests (
      organization_id, request_number, employee_profile_id, leave_type,
      start_date, end_date, reason
    ) values (
      v_org_id,
      coalesce(p_payload->>'request_number', public._ppl525_next_number(v_org_id, 'LV', 'organization_people_leave_requests')),
      (p_payload->>'employee_profile_id')::uuid,
      coalesce(p_payload->>'leave_type', 'vacation'),
      (p_payload->>'start_date')::date,
      (p_payload->>'end_date')::date,
      coalesce(p_payload->>'reason', '')
    ) returning id into v_id;
    perform public._ppl525_log(v_org_id, 'leave_requested', 'Leave request created', (p_payload->>'employee_profile_id')::uuid, p_payload);
    return jsonb_build_object('ok', true, 'leave_id', v_id);

  elsif p_action_type = 'approve_leave' then
    v_id := (p_payload->>'leave_id')::uuid;
    update public.organization_people_leave_requests set
      status = 'approved', approval_status = 'approved',
      approved_by_user_id = (select id from public.users where auth_user_id = auth.uid() limit 1),
      approved_at = now(), updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._ppl525_log(v_org_id, 'leave_approved', 'Leave approved', null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'reject_leave' then
    v_id := (p_payload->>'leave_id')::uuid;
    update public.organization_people_leave_requests set
      status = 'rejected', approval_status = 'rejected', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._ppl525_log(v_org_id, 'leave_rejected', 'Leave rejected', null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_review' then
    insert into public.organization_people_performance_reviews (
      organization_id, review_number, employee_profile_id, review_type, review_period, status
    ) values (
      v_org_id,
      coalesce(p_payload->>'review_number', public._ppl525_next_number(v_org_id, 'REV', 'organization_people_performance_reviews')),
      (p_payload->>'employee_profile_id')::uuid,
      coalesce(p_payload->>'review_type', 'quarterly'),
      coalesce(p_payload->>'review_period', to_char(now(), 'YYYY-Q') || extract(quarter from now())::text),
      'in_progress'
    ) returning id into v_id;
    perform public._ppl525_log(v_org_id, 'review_created', 'Performance review created', (p_payload->>'employee_profile_id')::uuid, p_payload);
    return jsonb_build_object('ok', true, 'review_id', v_id);

  elsif p_action_type = 'complete_review' then
    v_id := (p_payload->>'review_id')::uuid;
    update public.organization_people_performance_reviews set
      status = 'completed', completed_at = now(),
      feedback = coalesce(p_payload->>'feedback', feedback),
      rating = coalesce((p_payload->>'rating')::numeric, rating),
      updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._ppl525_log(v_org_id, 'review_completed', 'Review completed', null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_development' then
    insert into public.organization_people_development_records (
      organization_id, employee_profile_id, development_type, title, provider, business_pack_key
    ) values (
      v_org_id,
      (p_payload->>'employee_profile_id')::uuid,
      coalesce(p_payload->>'development_type', 'training'),
      coalesce(p_payload->>'title', 'Training'),
      coalesce(p_payload->>'provider', ''),
      p_payload->>'business_pack_key'
    ) returning id into v_id;
    return jsonb_build_object('ok', true, 'development_id', v_id);

  elsif p_action_type = 'complete_development' then
    v_id := (p_payload->>'development_id')::uuid;
    update public.organization_people_development_records set
      status = 'completed', completed_at = now(), updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._ppl525_log(v_org_id, 'training_completed', 'Training completed', null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_goal' then
    insert into public.organization_people_goals (
      organization_id, goal_number, employee_profile_id, department_id,
      goal_scope, title, description, target_date, status,
      owner_user_id, business_pack_key
    ) values (
      v_org_id,
      coalesce(p_payload->>'goal_number', public._ppl525_next_number(v_org_id, 'GOL', 'organization_people_goals')),
      nullif(p_payload->>'employee_profile_id', '')::uuid,
      nullif(p_payload->>'department_id', '')::uuid,
      coalesce(p_payload->>'goal_scope', 'individual'),
      coalesce(p_payload->>'title', 'Goal'),
      coalesce(p_payload->>'description', ''),
      nullif(p_payload->>'target_date', '')::date,
      coalesce(p_payload->>'status', 'active'),
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      p_payload->>'business_pack_key'
    ) returning id into v_id;
    perform public._ppl525_log(v_org_id, 'goal_created', 'Goal created', nullif(p_payload->>'employee_profile_id', '')::uuid, p_payload);
    return jsonb_build_object('ok', true, 'goal_id', v_id);

  elsif p_action_type = 'update_goal_status' then
    v_id := (p_payload->>'goal_id')::uuid;
    update public.organization_people_goals set
      status = coalesce(p_payload->>'status', status),
      progress_percent = coalesce((p_payload->>'progress_percent')::int, progress_percent),
      updated_at = now()
    where id = v_id and organization_id = v_org_id;
    if coalesce(p_payload->>'status', '') = 'achieved' then
      perform public._ppl525_log(v_org_id, 'goal_achieved', 'Goal achieved', null, p_payload);
    end if;
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_recognition' then
    insert into public.organization_people_recognitions (
      organization_id, employee_profile_id, recognition_type, title, description, recognized_by_user_id
    ) values (
      v_org_id,
      (p_payload->>'employee_profile_id')::uuid,
      coalesce(p_payload->>'recognition_type', 'achievement'),
      coalesce(p_payload->>'title', 'Recognition'),
      coalesce(p_payload->>'description', ''),
      (select id from public.users where auth_user_id = auth.uid() limit 1)
    ) returning id into v_id;
    perform public._ppl525_log(v_org_id, 'recognition_granted', 'Recognition granted', (p_payload->>'employee_profile_id')::uuid, p_payload);
    return jsonb_build_object('ok', true, 'recognition_id', v_id);

  elsif p_action_type = 'update_workforce_plan' then
    insert into public.organization_people_workforce_plans (
      organization_id, department_id, plan_period, headcount_current, headcount_target,
      open_positions, capacity_score, workload_level, hiring_needs
    ) values (
      v_org_id,
      nullif(p_payload->>'department_id', '')::uuid,
      coalesce(p_payload->>'plan_period', to_char(now(), 'YYYY-MM')),
      coalesce((p_payload->>'headcount_current')::int, 0),
      coalesce((p_payload->>'headcount_target')::int, 0),
      coalesce((p_payload->>'open_positions')::int, 0),
      coalesce((p_payload->>'capacity_score')::numeric, 0),
      coalesce(p_payload->>'workload_level', 'balanced'),
      coalesce(p_payload->>'hiring_needs', '')
    ) returning id into v_id;
    return jsonb_build_object('ok', true, 'plan_id', v_id);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_people_operations_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('people.view');
  v_org_id := public._ppl525_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._ppl525_ensure_settings(v_org_id);

  return jsonb_build_object(
    'found', true,
    'principle', 'Organizations succeed through people.',
    'upcoming_reviews', (
      select count(*) from public.organization_people_performance_reviews
      where organization_id = v_org_id and status in ('draft', 'in_progress')
    ),
    'leave_next_week', coalesce((
      select jsonb_agg(jsonb_build_object(
        'employee_name', (select full_name from public.organization_employee_profiles where id = l.employee_profile_id),
        'start_date', l.start_date, 'end_date', l.end_date
      ))
      from public.organization_people_leave_requests l
      where l.organization_id = v_org_id and l.status = 'approved'
        and l.start_date between current_date and current_date + 7
      limit 10
    ), '[]'::jsonb),
    'expiring_certifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'employee_name', (select full_name from public.organization_employee_profiles where id = d.employee_profile_id),
        'title', d.title, 'expires_at', d.expires_at
      ))
      from public.organization_people_development_records d
      where d.organization_id = v_org_id and d.development_type = 'certification'
        and d.expires_at between current_date and current_date + 30
      limit 10
    ), '[]'::jsonb),
    'companion_prompts', jsonb_build_array(
      'Show upcoming reviews.',
      'Who is on leave next week?',
      'Which employees require training?',
      'Show department capacity.',
      'Which certifications are expiring?'
    ),
    'routes', jsonb_build_object('people', '/app/people', 'attendance', '/app/people/attendance', 'goals', '/app/people/goals')
  );
end; $$;

create or replace function public.get_my_people_operations_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('people.view');
  v_org_id := public._ppl525_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('people.manage', v_org_id),
    'pending_leave', (select count(*) from public.organization_people_leave_requests where organization_id = v_org_id and status = 'pending'),
    'upcoming_reviews', (select count(*) from public.organization_people_performance_reviews where organization_id = v_org_id and status in ('draft', 'in_progress')),
    'routes', jsonb_build_object('people', '/app/people', 'mobile_ready', true)
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('people', '/app/people'));
end; $$;

-- Module registry
do $$ begin
  perform public._mre501_seed_module(
    'people', 'People Operations', 'people', 'operations',
    'HR, workforce, attendance, leave, development, performance reviews, and goals.',
    'starter', null, 'operations', '/app/people', 'licensed', 12
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('people', 'people.view', 'view', 'People Operations — view workforce, attendance, leave, and reviews'),
    ('people', 'people.manage', 'manage', 'People Operations — manage HR, leave, goals, and workforce planning')
  on conflict (permission_key) do nothing;
exception when others then
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('people', 'people.view', 'view', 'People Operations — view workforce, attendance, leave, and reviews'),
    ('people', 'people.manage', 'manage', 'People Operations — manage HR, leave, goals, and workforce planning')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_people_operations_center(text) to authenticated;
grant execute on function public.perform_people_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_people_operations_context() to authenticated;
grant execute on function public.get_my_people_operations_summary() to authenticated;
