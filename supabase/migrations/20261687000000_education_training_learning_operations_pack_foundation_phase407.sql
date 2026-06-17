-- Phase 407 — Education, Training & Learning Operations Pack Foundation
-- Feature owner: CUSTOMER APP. Route: /app/education. Helpers: _getlo407_*
-- Industry Pack home for students, courses, programs, instructors, assessments, and certifications.
-- Extends the Academy framework into complete educational operations.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.education_pack_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  institution_type text not null default 'training' check (
    institution_type in ('school', 'university', 'training', 'academy', 'corporate', 'enterprise')
  ),
  health_score integer not null default 70 check (health_score between 0 and 100),
  industry_pack_install_id uuid references public.tenant_industry_pack_installs (id) on delete set null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education_students (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  student_key text not null,
  full_name text not null,
  student_status text not null default 'prospective' check (
    student_status in (
      'prospective', 'enrolled', 'active', 'on_leave',
      'graduated', 'completed', 'archived'
    )
  ),
  progress_percent numeric(5, 2) not null default 0 check (progress_percent between 0 and 100),
  engagement_score integer not null default 70 check (engagement_score between 0 and 100),
  certification_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, student_key)
);

create index if not exists education_students_tenant_idx
  on public.education_students (tenant_id, student_status);

create table if not exists public.education_instructors (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  instructor_key text not null,
  full_name text not null,
  availability_status text not null default 'available' check (
    availability_status in ('available', 'assigned', 'limited', 'unavailable')
  ),
  performance_score integer not null default 75 check (performance_score between 0 and 100),
  course_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, instructor_key)
);

create index if not exists education_instructors_tenant_idx
  on public.education_instructors (tenant_id, availability_status);

create table if not exists public.education_programs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  program_key text not null,
  program_name text not null,
  program_type text not null default 'professional_training' check (
    program_type in (
      'academic', 'professional_training', 'corporate_learning',
      'certification', 'industry', 'executive', 'custom'
    )
  ),
  duration_weeks integer not null default 0,
  program_status text not null default 'active' check (
    program_status in ('draft', 'active', 'paused', 'completed', 'archived')
  ),
  completion_criteria text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, program_key)
);

create index if not exists education_programs_tenant_idx
  on public.education_programs (tenant_id, program_status);

create table if not exists public.education_courses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  course_key text not null,
  course_name text not null,
  program_id uuid references public.education_programs (id) on delete set null,
  instructor_id uuid references public.education_instructors (id) on delete set null,
  lesson_count integer not null default 0,
  completion_rate numeric(5, 2) not null default 0 check (completion_rate between 0 and 100),
  course_status text not null default 'active' check (
    course_status in ('draft', 'active', 'paused', 'completed', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, course_key)
);

create index if not exists education_courses_tenant_idx
  on public.education_courses (tenant_id, course_status);

create table if not exists public.education_assessments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  assessment_key text not null,
  assessment_name text not null,
  assessment_type text not null default 'quiz' check (
    assessment_type in ('quiz', 'assignment', 'project', 'practical', 'exam', 'certification_test', 'peer_review')
  ),
  course_id uuid references public.education_courses (id) on delete set null,
  student_id uuid references public.education_students (id) on delete set null,
  score numeric(5, 2),
  assessment_status text not null default 'pending' check (
    assessment_status in ('pending', 'in_progress', 'completed', 'reviewed', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, assessment_key)
);

create index if not exists education_assessments_tenant_idx
  on public.education_assessments (tenant_id, assessment_status);

create table if not exists public.education_certifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  certification_key text not null,
  certification_name text not null,
  student_id uuid references public.education_students (id) on delete set null,
  program_id uuid references public.education_programs (id) on delete set null,
  certification_status text not null default 'in_progress' check (
    certification_status in ('in_progress', 'awarded', 'renewal_due', 'expired', 'revoked', 'archived')
  ),
  valid_until date,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, certification_key)
);

create index if not exists education_certifications_tenant_idx
  on public.education_certifications (tenant_id, certification_status);

create table if not exists public.education_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'completion_improving', 'engagement_declining', 'certification_demand',
      'instructor_utilization', 'program_review_recommended',
      'student_support_required', 'certification_renewal_due',
      'course_completion_improving', 'program_engagement_declining',
      'learning_opportunity'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists education_advisor_signals_tenant_idx
  on public.education_advisor_signals (tenant_id, created_at desc);

create table if not exists public.education_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'student_enrolled', 'course_created', 'program_created',
      'assessment_completed', 'certification_awarded', 'certification_renewed',
      'instructor_assigned', 'learning_record_updated', 'pack_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists education_audit_logs_tenant_idx
  on public.education_audit_logs (tenant_id, created_at desc);

alter table public.education_pack_settings enable row level security;
alter table public.education_students enable row level security;
alter table public.education_instructors enable row level security;
alter table public.education_programs enable row level security;
alter table public.education_courses enable row level security;
alter table public.education_assessments enable row level security;
alter table public.education_certifications enable row level security;
alter table public.education_advisor_signals enable row level security;
alter table public.education_audit_logs enable row level security;

revoke all on public.education_pack_settings from authenticated, anon;
revoke all on public.education_students from authenticated, anon;
revoke all on public.education_instructors from authenticated, anon;
revoke all on public.education_programs from authenticated, anon;
revoke all on public.education_courses from authenticated, anon;
revoke all on public.education_assessments from authenticated, anon;
revoke all on public.education_certifications from authenticated, anon;
revoke all on public.education_advisor_signals from authenticated, anon;
revoke all on public.education_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'education_training_learning_operations_pack', v.description
from (values
  ('education.view', 'View Education Pack', 'View students, courses, programs, instructors, and learning operations'),
  ('education.manage', 'Manage Education Pack', 'Manage students, courses, programs, certifications, and education settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

update public.industry_pack_registry
set
  short_description = 'Education and learning operations — students, courses, programs, instructors, assessments, certifications, and outcomes on ABOS.',
  lifecycle_status = 'production',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'canonical_route', '/app/education',
    'academy_cross_link', '/app/academy',
    'phase', 407
  ),
  updated_at = now()
where pack_key = 'education_pack';

-- ---------------------------------------------------------------------------
-- 2. Helpers — _getlo407_*
-- ---------------------------------------------------------------------------
create or replace function public._getlo407_require_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Education Pack requires an active subscription';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._getlo407_log_audit(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.education_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._getlo407_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.education_pack_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.education_pack_settings;
  v_registry_id uuid;
  v_install_id uuid;
begin
  select id into v_registry_id from public.industry_pack_registry where pack_key = 'education_pack' limit 1;

  if v_registry_id is not null then
    insert into public.tenant_industry_pack_installs (
      organization_id, registry_id, install_status, install_mode, health_score
    )
    select p_org_id, v_registry_id, 'active', 'guided', 73
    where not exists (
      select 1 from public.tenant_industry_pack_installs
      where organization_id = p_org_id and registry_id = v_registry_id and install_status != 'removed'
    );
  end if;

  select id into v_install_id
  from public.tenant_industry_pack_installs
  where organization_id = p_org_id and registry_id = v_registry_id and install_status = 'active'
  limit 1;

  insert into public.education_pack_settings (organization_id, tenant_id, industry_pack_install_id)
  values (p_org_id, p_tenant_id, v_install_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.education_pack_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._getlo407_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.education_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.education_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'completion_improving',
      'Course and program completion indicators may be trending positively.',
      'Higher completion supports learning outcomes and certification readiness.',
      'Review Education Overview and confirm progress tracking across active programs.',
      'low', 'moderate'
    ),
    (
      p_tenant_id, 'certification_renewal_due',
      'Certification renewals may be approaching for enrolled learners.',
      'Expired certifications create compliance and credential gaps.',
      'Open Certifications module and confirm validity and renewal schedules.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'learning_opportunity',
      'Learning opportunities may be identified across programs and courses.',
      'Targeted opportunities improve engagement and student success.',
      'Review Programs module and align courses with learner progress signals.',
      'moderate', 'high'
    );
end;
$$;

create or replace function public._getlo407_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_students integer := 0;
  v_courses integer := 0;
  v_programs integer := 0;
  v_instructors integer := 0;
  v_completion numeric := 0;
  v_cert_rate numeric := 0;
  v_outcomes numeric := 0;
  v_health numeric := 70;
begin
  select count(*)::int into v_students
  from public.education_students
  where tenant_id = p_tenant_id and student_status not in ('archived');

  select count(*)::int into v_courses
  from public.education_courses
  where tenant_id = p_tenant_id and course_status != 'archived';

  select count(*)::int into v_programs
  from public.education_programs
  where tenant_id = p_tenant_id and program_status != 'archived';

  select count(*)::int into v_instructors
  from public.education_instructors where tenant_id = p_tenant_id;

  select case when count(*) > 0 then round(avg(completion_rate)::numeric, 1) else 0 end
  into v_completion
  from public.education_courses where tenant_id = p_tenant_id and course_status = 'active';

  select case when count(*) filter (where student_status in ('active', 'enrolled', 'completed', 'graduated')) > 0
    then round(
      count(*) filter (where certification_count > 0)::numeric /
      nullif(count(*) filter (where student_status in ('active', 'enrolled', 'completed', 'graduated')), 0)::numeric * 100, 1)
    else 0 end
  into v_cert_rate
  from public.education_students where tenant_id = p_tenant_id;

  select case when count(*) > 0
    then round(avg((progress_percent + engagement_score) / 2)::numeric, 1)
    else 70 end
  into v_outcomes
  from public.education_students
  where tenant_id = p_tenant_id and student_status in ('active', 'enrolled');

  select coalesce(health_score, 70) into v_health
  from public.education_pack_settings where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'students', v_students,
    'courses', v_courses,
    'programs', v_programs,
    'instructors', v_instructors,
    'completion_rates', v_completion,
    'certification_rates', v_cert_rate,
    'learning_outcomes', v_outcomes,
    'education_health_score', round(v_health)::int
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_education_training_learning_operations_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_settings public.education_pack_settings;
  v_students jsonb := '[]'::jsonb;
  v_courses jsonb := '[]'::jsonb;
  v_programs jsonb := '[]'::jsonb;
  v_instructors jsonb := '[]'::jsonb;
  v_assessments jsonb := '[]'::jsonb;
  v_certifications jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
  v_academy_route text := '/app/academy';
begin
  perform public._irp_require_permission('education.view');
  v_ctx := public._getlo407_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._getlo407_ensure_settings(v_org_id, v_tenant_id);
  perform public._getlo407_seed_advisor(v_tenant_id);
  v_overview := public._getlo407_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'student_key', s.student_key, 'full_name', s.full_name,
    'student_status', s.student_status, 'progress_percent', s.progress_percent,
    'engagement_score', s.engagement_score, 'certification_count', s.certification_count
  ) order by s.full_name), '[]'::jsonb)
  into v_students
  from public.education_students s
  where s.tenant_id = v_tenant_id and s.student_status != 'archived'
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'course_key', c.course_key, 'course_name', c.course_name,
    'course_status', c.course_status, 'completion_rate', c.completion_rate,
    'lesson_count', c.lesson_count, 'program_id', c.program_id, 'instructor_id', c.instructor_id
  ) order by c.course_name), '[]'::jsonb)
  into v_courses
  from public.education_courses c
  where c.tenant_id = v_tenant_id and c.course_status != 'archived'
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'program_key', p.program_key, 'program_name', p.program_name,
    'program_type', p.program_type, 'program_status', p.program_status,
    'duration_weeks', p.duration_weeks
  ) order by p.program_name), '[]'::jsonb)
  into v_programs
  from public.education_programs p
  where p.tenant_id = v_tenant_id and p.program_status != 'archived'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'instructor_key', i.instructor_key, 'full_name', i.full_name,
    'availability_status', i.availability_status, 'performance_score', i.performance_score,
    'course_count', i.course_count
  ) order by i.full_name), '[]'::jsonb)
  into v_instructors
  from public.education_instructors i
  where i.tenant_id = v_tenant_id
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'assessment_key', a.assessment_key, 'assessment_name', a.assessment_name,
    'assessment_type', a.assessment_type, 'assessment_status', a.assessment_status,
    'score', a.score, 'course_id', a.course_id
  ) order by a.updated_at desc), '[]'::jsonb)
  into v_assessments
  from public.education_assessments a
  where a.tenant_id = v_tenant_id
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'certification_key', c.certification_key, 'certification_name', c.certification_name,
    'certification_status', c.certification_status, 'valid_until', c.valid_until,
    'student_id', c.student_id, 'program_id', c.program_id
  ) order by c.updated_at desc), '[]'::jsonb)
  into v_certifications
  from public.education_certifications c
  where c.tenant_id = v_tenant_id and c.certification_status != 'archived'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.education_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.education_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Education is student success, learning outcomes, engagement, governance, and continuous development — not only content delivery.',
    'mission', 'Education & Learning Operating System — students, courses, programs, instructors, assessments, and certifications.',
    'abos_principle', 'Aipify informs and prepares; educators decide. Measurable learning improvement on unified ABOS foundation.',
    'industry_packs_route', '/app/industry-packs',
    'academy_route', v_academy_route,
    'distinction_note', 'Extends the Academy framework into a complete educational operations platform.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/education'),
      jsonb_build_object('key', 'students', 'route', '/app/education/students'),
      jsonb_build_object('key', 'courses', 'route', '/app/education/courses'),
      jsonb_build_object('key', 'programs', 'route', '/app/education/programs'),
      jsonb_build_object('key', 'instructors', 'route', '/app/education/instructors'),
      jsonb_build_object('key', 'assessments', 'route', '/app/education/assessments'),
      jsonb_build_object('key', 'certifications', 'route', '/app/education/certifications'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/education/intelligence')
    ),
    'students', v_students,
    'courses', v_courses,
    'programs', v_programs,
    'instructors', v_instructors,
    'assessments', v_assessments,
    'certifications', v_certifications,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'students_route', '/app/education/students',
      'courses_route', '/app/education/courses',
      'programs_route', '/app/education/programs',
      'instructors_route', '/app/education/instructors',
      'assessments_route', '/app/education/assessments',
      'certifications_route', '/app/education/certifications',
      'academy_route', v_academy_route
    ),
    'executive_dashboard', jsonb_build_object(
      'enrollment', v_overview->>'students',
      'completion_rates', v_overview->>'completion_rates',
      'certification_coverage', v_overview->>'certification_rates',
      'learning_outcomes', v_overview->>'learning_outcomes',
      'education_health_score', v_overview->>'education_health_score',
      'executive_route', '/app/education/intelligence'
    ),
    'privacy_note', 'Student, instructor, and learning records isolated per organization — metadata-first intelligence only.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.education_training_learning_operations_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_student_id uuid;
  v_student_name text;
  v_course_id uuid;
  v_program_id uuid;
  v_instructor_id uuid;
  v_cert_id uuid;
begin
  perform public._irp_require_permission('education.manage');
  perform public._getlo407_require_access();
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  perform public._getlo407_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_student' then
    insert into public.education_students (
      tenant_id, student_key, full_name, student_status, progress_percent, engagement_score
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'student_key', 'student-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'full_name', 'New student'),
      coalesce(p_payload->>'student_status', 'enrolled'),
      coalesce((p_payload->>'progress_percent')::numeric, 0),
      coalesce((p_payload->>'engagement_score')::int, 70)
    ) returning id, full_name into v_student_id, v_student_name;

    perform public._getlo407_log_audit(
      v_tenant_id, 'student_enrolled', 'Student enrolled: ' || v_student_name,
      jsonb_build_object('student_id', v_student_id)
    );

    return jsonb_build_object('ok', true, 'student_id', v_student_id);
  end if;

  if v_action = 'create_course' then
    insert into public.education_courses (
      tenant_id, course_key, course_name, program_id, instructor_id, lesson_count, course_status
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'course_key', 'course-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'course_name', 'New course'),
      nullif(p_payload->>'program_id', '')::uuid,
      nullif(p_payload->>'instructor_id', '')::uuid,
      coalesce((p_payload->>'lesson_count')::int, 0),
      coalesce(p_payload->>'course_status', 'active')
    ) returning id into v_course_id;

    perform public._getlo407_log_audit(
      v_tenant_id, 'course_created', 'Course created',
      jsonb_build_object('course_id', v_course_id)
    );

    return jsonb_build_object('ok', true, 'course_id', v_course_id);
  end if;

  if v_action = 'create_program' then
    insert into public.education_programs (
      tenant_id, program_key, program_name, program_type, duration_weeks, program_status
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'program_key', 'program-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'program_name', 'New program'),
      coalesce(p_payload->>'program_type', 'professional_training'),
      coalesce((p_payload->>'duration_weeks')::int, 0),
      coalesce(p_payload->>'program_status', 'active')
    ) returning id into v_program_id;

    perform public._getlo407_log_audit(
      v_tenant_id, 'program_created', 'Program created',
      jsonb_build_object('program_id', v_program_id)
    );

    return jsonb_build_object('ok', true, 'program_id', v_program_id);
  end if;

  if v_action = 'create_instructor' then
    insert into public.education_instructors (
      tenant_id, instructor_key, full_name, availability_status, performance_score
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'instructor_key', 'instructor-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'full_name', 'New instructor'),
      coalesce(p_payload->>'availability_status', 'available'),
      coalesce((p_payload->>'performance_score')::int, 75)
    ) returning id into v_instructor_id;

    perform public._getlo407_log_audit(
      v_tenant_id, 'instructor_assigned', 'Instructor added',
      jsonb_build_object('instructor_id', v_instructor_id)
    );

    return jsonb_build_object('ok', true, 'instructor_id', v_instructor_id);
  end if;

  if v_action = 'create_certification' then
    insert into public.education_certifications (
      tenant_id, certification_key, certification_name, student_id, program_id, certification_status, valid_until
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'certification_key', 'CERT-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'certification_name', 'New certification'),
      nullif(p_payload->>'student_id', '')::uuid,
      nullif(p_payload->>'program_id', '')::uuid,
      coalesce(p_payload->>'certification_status', 'in_progress'),
      nullif(p_payload->>'valid_until', '')::date
    ) returning id into v_cert_id;

    perform public._getlo407_log_audit(
      v_tenant_id, 'certification_awarded', 'Certification record created',
      jsonb_build_object('certification_id', v_cert_id)
    );

    return jsonb_build_object('ok', true, 'certification_id', v_cert_id);
  end if;

  raise exception 'Unsupported education action: %', v_action;
end;
$$;

grant execute on function public.get_education_training_learning_operations_center() to authenticated;
grant execute on function public.education_training_learning_operations_action(jsonb) to authenticated;
