-- Phase 294 (APP) — Customer Learning & Academy Center

create table if not exists public.app_portal_academy_assignments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  course_slug text not null,
  course_title text not null default '',
  section text not null default 'team_training',
  assignee_user_id uuid references public.users (id) on delete cascade,
  department text not null default '',
  required boolean not null default true,
  due_date date,
  assigned_by uuid references public.users (id) on delete set null,
  status text not null default 'assigned' check (status in (
    'assigned', 'in_progress', 'completed', 'overdue'
  )),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_academy_assignments_company_idx
  on public.app_portal_academy_assignments (company_id, assignee_user_id, department, status, due_date);

create table if not exists public.app_portal_academy_completions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  course_slug text not null,
  section text not null default '',
  completed_at timestamptz not null default now(),
  unique (company_id, user_id, course_slug)
);

create index if not exists app_portal_academy_completions_company_idx
  on public.app_portal_academy_completions (company_id, user_id, completed_at desc);

create table if not exists public.app_portal_academy_certifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  certification_type text not null check (certification_type in (
    'aipify_certified_user', 'aipify_operations_user', 'aipify_support_user', 'aipify_executive_user'
  )),
  status text not null default 'in_progress' check (status in ('in_progress', 'earned', 'expired')),
  earned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, user_id, certification_type)
);

create index if not exists app_portal_academy_certifications_company_idx
  on public.app_portal_academy_certifications (company_id, user_id, certification_type);

create table if not exists public.app_portal_academy_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_academy_audit_idx
  on public.app_portal_academy_audit_logs (company_id, created_at desc);

alter table public.app_portal_academy_assignments enable row level security;
alter table public.app_portal_academy_completions enable row level security;
alter table public.app_portal_academy_certifications enable row level security;
alter table public.app_portal_academy_audit_logs enable row level security;
revoke all on public.app_portal_academy_assignments from authenticated, anon;
revoke all on public.app_portal_academy_completions from authenticated, anon;
revoke all on public.app_portal_academy_certifications from authenticated, anon;
revoke all on public.app_portal_academy_audit_logs from authenticated, anon;

create or replace function public._aclac294_access_context()
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
    'can_admin', v_role in ('organization_owner', 'organization_admin'),
    'is_member', v_role in ('organization_owner', 'organization_admin', 'organization_manager', 'organization_member')
  );
end;
$$;

create or replace function public._aclac294_course_catalog()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('slug', 'welcome_to_aipify', 'title', 'Welcome to Aipify', 'section', 'getting_started', 'category', 'getting_started', 'difficulty', 'beginner', 'duration_minutes', 10, 'content_type', 'course', 'description', 'Introduction to Aipify and customer success.'),
    jsonb_build_object('slug', 'setting_up_organization', 'title', 'Setting up your organization', 'section', 'getting_started', 'category', 'getting_started', 'difficulty', 'beginner', 'duration_minutes', 15, 'content_type', 'course', 'description', 'Configure your organization workspace.'),
    jsonb_build_object('slug', 'inviting_employees', 'title', 'Inviting employees', 'section', 'getting_started', 'category', 'getting_started', 'difficulty', 'beginner', 'duration_minutes', 10, 'content_type', 'course', 'description', 'Invite and onboard team members.'),
    jsonb_build_object('slug', 'security_setup', 'title', 'Security setup', 'section', 'getting_started', 'category', 'getting_started', 'difficulty', 'intermediate', 'duration_minutes', 15, 'content_type', 'course', 'description', 'Establish security foundations for your organization.'),
    jsonb_build_object('slug', 'activating_2fa', 'title', 'Activating 2FA', 'section', 'getting_started', 'category', 'getting_started', 'difficulty', 'beginner', 'duration_minutes', 8, 'content_type', 'course', 'description', 'Enable two-factor authentication.'),
    jsonb_build_object('slug', 'understanding_business_packs', 'title', 'Understanding Business Packs', 'section', 'getting_started', 'category', 'getting_started', 'difficulty', 'beginner', 'duration_minutes', 12, 'content_type', 'course', 'description', 'Learn how Business Packs extend Aipify.'),
    jsonb_build_object('slug', 'dashboard_essentials', 'title', 'Dashboard Essentials', 'section', 'product_training', 'category', 'product_training', 'difficulty', 'beginner', 'duration_minutes', 15, 'content_type', 'course', 'description', 'Navigate the APP dashboard effectively.'),
    jsonb_build_object('slug', 'operations_center', 'title', 'Operations Center', 'section', 'product_training', 'category', 'product_training', 'difficulty', 'intermediate', 'duration_minutes', 20, 'content_type', 'course', 'description', 'Use operational modules across the organization.'),
    jsonb_build_object('slug', 'knowledge_center', 'title', 'Knowledge Center', 'section', 'product_training', 'category', 'product_training', 'difficulty', 'beginner', 'duration_minutes', 12, 'content_type', 'course', 'description', 'Find answers and organizational knowledge.'),
    jsonb_build_object('slug', 'notifications', 'title', 'Notifications', 'section', 'product_training', 'category', 'product_training', 'difficulty', 'beginner', 'duration_minutes', 10, 'content_type', 'course', 'description', 'Manage alerts and notification preferences.'),
    jsonb_build_object('slug', 'integrations', 'title', 'Integrations', 'section', 'product_training', 'category', 'product_training', 'difficulty', 'intermediate', 'duration_minutes', 18, 'content_type', 'course', 'description', 'Connect Aipify with your systems.'),
    jsonb_build_object('slug', 'governance_security', 'title', 'Governance & Security', 'section', 'product_training', 'category', 'product_training', 'difficulty', 'intermediate', 'duration_minutes', 20, 'content_type', 'course', 'description', 'Roles, permissions and trust controls.'),
    jsonb_build_object('slug', 'business_packs_training', 'title', 'Business Packs', 'section', 'product_training', 'category', 'product_training', 'difficulty', 'intermediate', 'duration_minutes', 15, 'content_type', 'course', 'description', 'Activate and configure Business Packs.'),
    jsonb_build_object('slug', 'support_center', 'title', 'Support Center', 'section', 'product_training', 'category', 'product_training', 'difficulty', 'beginner', 'duration_minutes', 10, 'content_type', 'course', 'description', 'Get help and manage support requests.'),
    jsonb_build_object('slug', 'academy_faq_overview', 'title', 'What is Aipify Academy?', 'section', 'knowledge_center', 'category', 'knowledge_center', 'difficulty', 'beginner', 'duration_minutes', 3, 'content_type', 'faq', 'description', 'Overview of customer learning and adoption.'),
    jsonb_build_object('slug', 'academy_faq_assignments', 'title', 'Assigning learning to teams', 'section', 'knowledge_center', 'category', 'knowledge_center', 'difficulty', 'beginner', 'duration_minutes', 3, 'content_type', 'article', 'description', 'How managers assign and track training.'),
    jsonb_build_object('slug', 'academy_faq_certifications', 'title', 'Earning certifications', 'section', 'knowledge_center', 'category', 'knowledge_center', 'difficulty', 'beginner', 'duration_minutes', 5, 'content_type', 'article', 'description', 'Certification paths and recognition.'),
    jsonb_build_object('slug', 'academy_video_welcome', 'title', 'Welcome video: Getting started with Aipify', 'section', 'knowledge_center', 'category', 'knowledge_center', 'difficulty', 'beginner', 'duration_minutes', 8, 'content_type', 'video', 'description', 'Video introduction to the platform.')
  );
$$;

create or replace function public._aclac294_certification_catalog()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('type', 'aipify_certified_user', 'title', 'Aipify Certified User', 'required_courses', jsonb_build_array('welcome_to_aipify', 'dashboard_essentials', 'knowledge_center')),
    jsonb_build_object('type', 'aipify_operations_user', 'title', 'Aipify Operations User', 'required_courses', jsonb_build_array('operations_center', 'integrations', 'governance_security')),
    jsonb_build_object('type', 'aipify_support_user', 'title', 'Aipify Support User', 'required_courses', jsonb_build_array('support_center', 'knowledge_center', 'notifications')),
    jsonb_build_object('type', 'aipify_executive_user', 'title', 'Aipify Executive User', 'required_courses', jsonb_build_array('dashboard_essentials', 'operations_center', 'governance_security', 'understanding_business_packs'))
  );
$$;

create or replace function public._aclac294_course_by_slug(p_slug text)
returns jsonb
language sql
stable
as $$
  select c from jsonb_array_elements(public._aclac294_course_catalog()) c
  where c->>'slug' = p_slug limit 1;
$$;

create or replace function public._aclac294_user_progress(p_company_id uuid, p_user_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_catalog jsonb := public._aclac294_course_catalog();
  v_total integer;
  v_completed integer;
  v_started integer;
begin
  select count(*)::int into v_total from jsonb_array_elements(v_catalog) c where (c->>'content_type') = 'course';
  select count(*)::int into v_completed
  from public.app_portal_academy_completions co
  where co.company_id = p_company_id and co.user_id = p_user_id;
  select count(*)::int into v_started
  from public.app_portal_academy_assignments a
  where a.company_id = p_company_id and a.assignee_user_id = p_user_id
    and a.status in ('assigned', 'in_progress', 'overdue');
  return jsonb_build_object(
    'courses_total', v_total,
    'courses_completed', v_completed,
    'courses_started', v_started + v_completed,
    'completion_percent', case when v_total > 0 then round((v_completed::numeric / v_total) * 100)::int else 0 end,
    'outstanding_assignments', v_started
  );
end;
$$;

create or replace function public._aclac294_evaluate_certifications(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cert jsonb;
  v_type text;
  v_required jsonb;
  v_slug text;
  v_all_done boolean;
begin
  for v_cert in select * from jsonb_array_elements(public._aclac294_certification_catalog())
  loop
    v_type := v_cert->>'type';
    v_required := v_cert->'required_courses';
    v_all_done := true;
    for v_slug in select jsonb_array_elements_text(v_required)
    loop
      if not exists (
        select 1 from public.app_portal_academy_completions co
        where co.company_id = p_company_id and co.user_id = p_user_id and co.course_slug = v_slug
      ) then
        v_all_done := false;
        exit;
      end if;
    end loop;

    if v_all_done then
      insert into public.app_portal_academy_certifications (company_id, user_id, certification_type, status, earned_at)
      values (p_company_id, p_user_id, v_type, 'earned', now())
      on conflict (company_id, user_id, certification_type)
      do update set status = 'earned', earned_at = coalesce(public.app_portal_academy_certifications.earned_at, now()), updated_at = now();
    else
      insert into public.app_portal_academy_certifications (company_id, user_id, certification_type, status)
      values (p_company_id, p_user_id, v_type, 'in_progress')
      on conflict (company_id, user_id, certification_type)
      do update set status = case when public.app_portal_academy_certifications.status = 'earned' then 'earned' else 'in_progress' end, updated_at = now();
    end if;
  end loop;
end;
$$;

create or replace function public._aclac294_team_reporting(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_teams jsonb := '[]'::jsonb;
  v_team record;
begin
  for v_team in
    select * from (values
      ('Support Team', 'support'),
      ('Operations Team', 'operations'),
      ('Leadership Team', 'leadership')
    ) as t(team_name, dept_key)
  loop
    v_teams := v_teams || jsonb_build_object(
      'team', v_team.team_name,
      'department', v_team.dept_key,
      'completion_rate', coalesce((
        select round(
          (count(*) filter (where a.status = 'completed')::numeric / nullif(count(*), 0)) * 100
        )::int
        from public.app_portal_academy_assignments a
        where a.company_id = p_company_id and a.department = v_team.dept_key
      ), 0),
      'assigned_count', coalesce((
        select count(*)::int from public.app_portal_academy_assignments a
        where a.company_id = p_company_id and a.department = v_team.dept_key
      ), 0),
      'overdue_count', coalesce((
        select count(*)::int from public.app_portal_academy_assignments a
        where a.company_id = p_company_id and a.department = v_team.dept_key
          and a.status = 'overdue'
      ), 0)
    );
  end loop;
  return v_teams;
end;
$$;

create or replace function public.list_app_portal_academy(
  p_category text default null,
  p_completion_status text default null,
  p_certification_type text default null,
  p_department text default null,
  p_assigned_by uuid default null,
  p_difficulty text default null,
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
  v_progress jsonb;
  v_courses jsonb := '[]'::jsonb;
  v_recommended jsonb := '[]'::jsonb;
  v_assigned jsonb := '[]'::jsonb;
  v_certifications jsonb := '[]'::jsonb;
  v_recent jsonb := '[]'::jsonb;
  v_paths jsonb := '[]'::jsonb;
  v_team jsonb := '[]'::jsonb;
  v_team_rate integer := 0;
  v_course jsonb;
begin
  v_ctx := public._aclac294_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_progress := public._aclac294_user_progress(v_company_id, v_user_id);

  for v_course in
    select c from jsonb_array_elements(public._aclac294_course_catalog()) c
    where (p_category is null or c->>'category' = p_category)
      and (p_difficulty is null or c->>'difficulty' = p_difficulty)
      and (
        p_search is null or trim(p_search) = ''
        or c->>'title' ilike '%' || trim(p_search) || '%'
        or c->>'description' ilike '%' || trim(p_search) || '%'
      )
  loop
    if p_completion_status is not null then
      if p_completion_status = 'completed' and not exists (
        select 1 from public.app_portal_academy_completions co
        where co.company_id = v_company_id and co.user_id = v_user_id and co.course_slug = v_course->>'slug'
      ) then continue; end if;
      if p_completion_status = 'not_started' and exists (
        select 1 from public.app_portal_academy_completions co
        where co.company_id = v_company_id and co.user_id = v_user_id and co.course_slug = v_course->>'slug'
      ) then continue; end if;
    end if;
    v_courses := v_courses || (v_course || jsonb_build_object(
      'completed', exists (
        select 1 from public.app_portal_academy_completions co
        where co.company_id = v_company_id and co.user_id = v_user_id and co.course_slug = v_course->>'slug'
      ),
      'assigned', exists (
        select 1 from public.app_portal_academy_assignments a
        where a.company_id = v_company_id and a.course_slug = v_course->>'slug'
          and (a.assignee_user_id = v_user_id or (a.assignee_user_id is null and trim(a.department) <> ''))
      )
    ));
  end loop;

  select coalesce(jsonb_agg(c order by (c->>'section'), (c->>'title')), '[]'::jsonb)
  into v_recommended
  from (
    select c || jsonb_build_object('completed', false) as c
    from jsonb_array_elements(public._aclac294_course_catalog()) c
    where c->>'section' in ('getting_started', 'product_training')
      and not exists (
        select 1 from public.app_portal_academy_completions co
        where co.company_id = v_company_id and co.user_id = v_user_id and co.course_slug = c->>'slug'
      )
    limit 5
  ) sub;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'course_slug', a.course_slug, 'course_title', a.course_title,
    'section', a.section, 'required', a.required, 'due_date', a.due_date,
    'status', case when a.due_date is not null and a.due_date < current_date and a.status <> 'completed' then 'overdue' else a.status end,
    'department', a.department
  ) order by a.due_date asc nulls last), '[]'::jsonb)
  into v_assigned
  from public.app_portal_academy_assignments a
  where a.company_id = v_company_id
    and (a.assignee_user_id = v_user_id or (a.assignee_user_id is null and trim(a.department) <> ''))
    and (p_department is null or trim(p_department) = '' or a.department = p_department)
    and (p_assigned_by is null or a.assigned_by = p_assigned_by);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ce.id, 'certification_type', ce.certification_type,
    'title', cat->>'title', 'status', ce.status, 'earned_at', ce.earned_at
  )), '[]'::jsonb)
  into v_certifications
  from public.app_portal_academy_certifications ce
  cross join lateral (
    select c as cat from jsonb_array_elements(public._aclac294_certification_catalog()) c
    where c->>'type' = ce.certification_type limit 1
  ) cat
  where ce.company_id = v_company_id and ce.user_id = v_user_id
    and (p_certification_type is null or ce.certification_type = p_certification_type);

  select coalesce(jsonb_agg(c), '[]'::jsonb) into v_recent
  from (
    select c from jsonb_array_elements(public._aclac294_course_catalog()) c
    where c->>'content_type' = 'course'
    order by c->>'slug' desc limit 4
  ) sub;

  v_paths := jsonb_build_array(
    jsonb_build_object('id', 'path-getting-started', 'title', 'Getting Started Path', 'section', 'getting_started'),
    jsonb_build_object('id', 'path-product', 'title', 'Product Training Path', 'section', 'product_training'),
    jsonb_build_object('id', 'path-certification', 'title', 'Certification Path', 'section', 'certifications')
  );

  if coalesce(v_ctx->>'can_manage', 'false') = 'true' then
    v_team := public._aclac294_team_reporting(v_company_id);
    select round(avg((t->>'completion_rate')::numeric))::int into v_team_rate
    from jsonb_array_elements(v_team) t;
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_admin', coalesce(v_ctx->>'can_admin', 'false') = 'true',
    'progress', v_progress,
    'courses', v_courses,
    'recommended_courses', v_recommended,
    'assigned_training', v_assigned,
    'certifications', v_certifications,
    'recently_released', v_recent,
    'suggested_paths', v_paths,
    'team_reporting', v_team,
    'team_completion_rate', coalesce(v_team_rate, 0),
    'principle', 'Aipify helps customers become successful — not only software, but adoption and operational maturity.'
  );
end;
$$;

create or replace function public.list_app_portal_academy_courses(
  p_category text default null,
  p_completion_status text default null,
  p_difficulty text default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return public.list_app_portal_academy(p_category, p_completion_status, null, null, null, p_difficulty, p_search)
    || jsonb_build_object('items', (public.list_app_portal_academy(p_category, p_completion_status, null, null, null, p_difficulty, p_search)->'courses'));
end;
$$;

create or replace function public.list_app_portal_academy_certifications(
  p_certification_type text default null
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
  v_catalog jsonb;
  v_earned jsonb := '[]'::jsonb;
  v_cert jsonb;
begin
  v_ctx := public._aclac294_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_catalog := public._aclac294_certification_catalog();

  for v_cert in select * from jsonb_array_elements(v_catalog)
  loop
    if p_certification_type is not null and v_cert->>'type' <> p_certification_type then continue; end if;
    v_earned := v_earned || jsonb_build_object(
      'certification_type', v_cert->>'type',
      'title', v_cert->>'title',
      'required_courses', v_cert->'required_courses',
      'status', coalesce((
        select ce.status from public.app_portal_academy_certifications ce
        where ce.company_id = v_company_id and ce.user_id = v_user_id and ce.certification_type = v_cert->>'type'
      ), 'not_started'),
      'earned_at', (
        select ce.earned_at from public.app_portal_academy_certifications ce
        where ce.company_id = v_company_id and ce.user_id = v_user_id and ce.certification_type = v_cert->>'type'
      )
    );
  end loop;

  return jsonb_build_object('found', true, 'certifications', v_earned);
end;
$$;

create or replace function public.get_app_portal_academy_progress()
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
  v_progress jsonb;
  v_completions jsonb := '[]'::jsonb;
  v_outstanding jsonb := '[]'::jsonb;
begin
  v_ctx := public._aclac294_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_progress := public._aclac294_user_progress(v_company_id, v_user_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'course_slug', co.course_slug, 'section', co.section, 'completed_at', co.completed_at
  ) order by co.completed_at desc), '[]'::jsonb)
  into v_completions
  from public.app_portal_academy_completions co
  where co.company_id = v_company_id and co.user_id = v_user_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'course_slug', a.course_slug, 'course_title', a.course_title,
    'due_date', a.due_date, 'status', a.status, 'required', a.required
  ) order by a.due_date asc nulls last), '[]'::jsonb)
  into v_outstanding
  from public.app_portal_academy_assignments a
  where a.company_id = v_company_id and a.assignee_user_id = v_user_id and a.status <> 'completed';

  return jsonb_build_object(
    'found', true,
    'progress', v_progress,
    'completions', v_completions,
    'outstanding_assignments', v_outstanding,
    'certifications_earned', (
      select count(*)::int from public.app_portal_academy_certifications ce
      where ce.company_id = v_company_id and ce.user_id = v_user_id and ce.status = 'earned'
    )
  );
end;
$$;

create or replace function public.create_app_portal_academy_assignment(
  p_course_slug text,
  p_assignee_user_id uuid default null,
  p_department text default '',
  p_required boolean default true,
  p_due_date date default null,
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
  v_course jsonb;
  v_id uuid;
  v_row public.app_portal_academy_assignments;
begin
  v_ctx := public._aclac294_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Assignment requires manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_course := public._aclac294_course_by_slug(p_course_slug);
  if v_course is null then raise exception 'Course not found'; end if;
  if p_assignee_user_id is null and trim(coalesce(p_department, '')) = '' then
    raise exception 'Assignee or department required';
  end if;

  insert into public.app_portal_academy_assignments (
    company_id, course_slug, course_title, section, assignee_user_id, department,
    required, due_date, assigned_by, notes
  ) values (
    v_company_id, p_course_slug, v_course->>'title', v_course->>'section',
    p_assignee_user_id, left(coalesce(p_department, ''), 100),
    coalesce(p_required, true), p_due_date, v_user_id, left(coalesce(p_notes, ''), 500)
  ) returning id into v_id;

  insert into public.app_portal_academy_audit_logs (company_id, event_type, description, performed_by, metadata)
  values (v_company_id, 'assignment_created', 'Training assigned: ' || (v_course->>'title'), v_user_id,
    jsonb_build_object('assignment_id', v_id, 'course_slug', p_course_slug));

  select * into v_row from public.app_portal_academy_assignments where id = v_id;
  return jsonb_build_object('created', true, 'assignment', jsonb_build_object(
    'id', v_row.id, 'course_slug', v_row.course_slug, 'course_title', v_row.course_title,
    'assignee_user_id', v_row.assignee_user_id, 'department', v_row.department,
    'required', v_row.required, 'due_date', v_row.due_date, 'status', v_row.status
  ));
end;
$$;

create or replace function public.record_app_portal_academy_completion(
  p_course_slug text
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
  v_course jsonb;
begin
  v_ctx := public._aclac294_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_course := public._aclac294_course_by_slug(p_course_slug);
  if v_course is null then raise exception 'Course not found'; end if;

  insert into public.app_portal_academy_completions (company_id, user_id, course_slug, section)
  values (v_company_id, v_user_id, p_course_slug, v_course->>'section')
  on conflict (company_id, user_id, course_slug) do update set completed_at = now();

  update public.app_portal_academy_assignments set status = 'completed', updated_at = now()
  where company_id = v_company_id and assignee_user_id = v_user_id and course_slug = p_course_slug;

  perform public._aclac294_evaluate_certifications(v_company_id, v_user_id);

  insert into public.app_portal_academy_audit_logs (company_id, event_type, description, performed_by, metadata)
  values (v_company_id, 'course_completed', 'Course completed: ' || (v_course->>'title'), v_user_id,
    jsonb_build_object('course_slug', p_course_slug));

  return jsonb_build_object(
    'completed', true,
    'course_slug', p_course_slug,
    'progress', public._aclac294_user_progress(v_company_id, v_user_id)
  );
end;
$$;

grant execute on function public.list_app_portal_academy(text, text, text, text, uuid, text, text) to authenticated;
grant execute on function public.list_app_portal_academy_courses(text, text, text, text) to authenticated;
grant execute on function public.list_app_portal_academy_certifications(text) to authenticated;
grant execute on function public.get_app_portal_academy_progress() to authenticated;
grant execute on function public.create_app_portal_academy_assignment(text, uuid, text, boolean, date, text) to authenticated;
grant execute on function public.record_app_portal_academy_completion(text) to authenticated;
