-- Phase 332 — Partner Academy Foundation
-- Feature owner: GROWTH PARTNER PORTAL. Route: /partner/academy. Helpers: _gpa332_*

create table if not exists public.growth_partner_portal_academy_courses (
  id uuid primary key default gen_random_uuid(),
  course_key text not null unique,
  module_number integer not null check (module_number between 1 and 5),
  title text not null,
  summary text not null default '',
  category text not null default 'fundamentals' check (
    category in (
      'fundamentals', 'product', 'sales', 'implementation', 'operations',
      'customer_success', 'business_development'
    )
  ),
  learning_type text not null default 'course' check (
    learning_type in ('course', 'lesson', 'document', 'video', 'playbook', 'assessment')
  ),
  certification_level text not null default 'foundation' check (
    certification_level in ('foundation', 'certified', 'professional', 'elite', 'strategic')
  ),
  difficulty text not null default 'introductory' check (
    difficulty in ('introductory', 'intermediate', 'advanced')
  ),
  locale text not null default 'en',
  topic_tags jsonb not null default '[]'::jsonb,
  sort_order integer not null default 100,
  enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.growth_partner_portal_academy_courses enable row level security;
revoke all on public.growth_partner_portal_academy_courses from authenticated, anon;

create table if not exists public.growth_partner_portal_academy_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.growth_partner_portal_academy_courses (id) on delete cascade,
  lesson_key text not null,
  title text not null,
  summary text not null default '',
  learning_type text not null default 'lesson' check (
    learning_type in ('course', 'lesson', 'document', 'video', 'playbook', 'assessment')
  ),
  duration_minutes integer not null default 15,
  sort_order integer not null default 100,
  content_ref text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  unique (course_id, lesson_key)
);
alter table public.growth_partner_portal_academy_lessons enable row level security;
revoke all on public.growth_partner_portal_academy_lessons from authenticated, anon;

create table if not exists public.growth_partner_portal_academy_certifications (
  id uuid primary key default gen_random_uuid(),
  certification_key text not null unique,
  title text not null,
  summary text not null default '',
  certification_level text not null check (
    certification_level in ('foundation', 'certified', 'professional', 'elite', 'strategic')
  ),
  course_id uuid references public.growth_partner_portal_academy_courses (id) on delete set null,
  passing_score integer not null default 80 check (passing_score between 50 and 100),
  max_attempts integer not null default 3,
  sort_order integer not null default 100,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.growth_partner_portal_academy_certifications enable row level security;
revoke all on public.growth_partner_portal_academy_certifications from authenticated, anon;

create table if not exists public.growth_partner_portal_academy_exams (
  id uuid primary key default gen_random_uuid(),
  exam_key text not null unique,
  certification_id uuid not null references public.growth_partner_portal_academy_certifications (id) on delete cascade,
  title text not null,
  exam_type text not null default 'module_exam' check (
    exam_type in ('knowledge_assessment', 'module_exam', 'certification_exam')
  ),
  passing_score integer not null default 80,
  question_count integer not null default 10,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.growth_partner_portal_academy_exams enable row level security;
revoke all on public.growth_partner_portal_academy_exams from authenticated, anon;

create table if not exists public.growth_partner_portal_academy_course_progress (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  auth_user_id uuid not null,
  course_id uuid not null references public.growth_partner_portal_academy_courses (id) on delete cascade,
  progress_pct integer not null default 0 check (progress_pct between 0 and 100),
  status text not null default 'not_started' check (
    status in ('not_started', 'in_progress', 'completed')
  ),
  lessons_completed integer not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (partner_org_id, auth_user_id, course_id)
);
create index if not exists gpp_academy_course_progress_org_idx
  on public.growth_partner_portal_academy_course_progress (partner_org_id, auth_user_id, status);
alter table public.growth_partner_portal_academy_course_progress enable row level security;
revoke all on public.growth_partner_portal_academy_course_progress from authenticated, anon;

create table if not exists public.growth_partner_portal_academy_exam_attempts (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  auth_user_id uuid not null,
  exam_id uuid not null references public.growth_partner_portal_academy_exams (id) on delete cascade,
  attempt_number integer not null default 1,
  score_pct integer not null default 0 check (score_pct between 0 and 100),
  passed boolean not null default false,
  completed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);
create index if not exists gpp_academy_exam_attempts_org_idx
  on public.growth_partner_portal_academy_exam_attempts (partner_org_id, auth_user_id, exam_id);
alter table public.growth_partner_portal_academy_exam_attempts enable row level security;
revoke all on public.growth_partner_portal_academy_exam_attempts from authenticated, anon;

create table if not exists public.growth_partner_portal_academy_certification_awards (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  auth_user_id uuid not null,
  certification_id uuid not null references public.growth_partner_portal_academy_certifications (id) on delete cascade,
  certification_status text not null default 'earned' check (
    certification_status in ('in_progress', 'earned', 'expired', 'revoked')
  ),
  score_pct integer not null default 0,
  attempts_used integer not null default 1,
  awarded_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique (partner_org_id, auth_user_id, certification_id)
);
alter table public.growth_partner_portal_academy_certification_awards enable row level security;
revoke all on public.growth_partner_portal_academy_certification_awards from authenticated, anon;

create table if not exists public.growth_partner_portal_academy_timeline (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  auth_user_id uuid,
  event_type text not null check (
    event_type in (
      'course_started', 'course_completed', 'certification_earned',
      'exam_attempt', 'lesson_completed'
    )
  ),
  title text not null default '',
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists gpp_academy_timeline_org_idx
  on public.growth_partner_portal_academy_timeline (partner_org_id, created_at desc);
alter table public.growth_partner_portal_academy_timeline enable row level security;
revoke all on public.growth_partner_portal_academy_timeline from authenticated, anon;

create table if not exists public.growth_partner_portal_academy_audit_logs (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  event_type text not null,
  summary text not null default '',
  actor_auth_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists gpp_academy_audit_org_idx
  on public.growth_partner_portal_academy_audit_logs (partner_org_id, created_at desc);
alter table public.growth_partner_portal_academy_audit_logs enable row level security;
revoke all on public.growth_partner_portal_academy_audit_logs from authenticated, anon;

create or replace function public._gpa332bp_positioning() returns text language sql immutable as $$
  select 'The Partner Academy educates, certifies, and continuously develops Growth Partners to represent Aipify professionally and successfully.'; $$;

create or replace function public._gpa332_academy_access(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_role text;
begin
  v_role := public._gppf05_member_role(p_org_id);
  return jsonb_build_object(
    'team_role', v_role,
    'full_access', v_role in ('partner_owner', 'owner', 'partner_manager', 'manager', 'trainer'),
    'assigned_learning', v_role in ('sales_member', 'sales_representative', 'advisor'),
    'limited_access', v_role = 'viewer',
    'can_take_exams', v_role <> 'viewer',
    'can_manage_team_learning', v_role in ('partner_owner', 'owner', 'partner_manager', 'manager')
  );
end; $$;

create or replace function public._gpa332_log_audit(
  p_org_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_academy_audit_logs (
    partner_org_id, event_type, summary, actor_auth_user_id, context
  ) values (p_org_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._gpa332_log_timeline(
  p_org_id uuid, p_type text, p_title text, p_summary text, p_context jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_academy_timeline (
    partner_org_id, auth_user_id, event_type, title, summary, context
  ) values (
    p_org_id, auth.uid(), p_type, p_title, p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._gpa332_seed_catalog()
returns void language plpgsql security definer set search_path = public as $$
declare
  v_course_id uuid;
begin
  if exists (select 1 from public.growth_partner_portal_academy_courses limit 1) then return; end if;

  insert into public.growth_partner_portal_academy_courses (
    course_key, module_number, title, summary, category, learning_type, certification_level, topic_tags, sort_order
  ) values
    ('mod-1-aipify-fundamentals', 1, 'Aipify Fundamentals',
     'What Aipify is, vision, Companion, Business Operating System, and customer types.',
     'fundamentals', 'course', 'foundation',
     '["What is Aipify","Aipify Vision","Aipify Companion","Business Operating System","Customer Types"]'::jsonb, 10),
    ('mod-2-product-knowledge', 2, 'Product Knowledge',
     'Core platform, intelligence layer, Companion layer, Business Packs, and integrations.',
     'product', 'course', 'certified',
     '["Core Platform","Intelligence Layer","Companion Layer","Business Packs","Integrations"]'::jsonb, 20),
    ('mod-3-sales-foundations', 3, 'Sales Foundations',
     'Discovery, objection handling, qualification, demonstrations, and follow-ups.',
     'sales', 'course', 'certified',
     '["Discovery Calls","Objection Handling","Customer Qualification","Demonstrations","Follow-Ups"]'::jsonb, 30),
    ('mod-4-implementation', 4, 'Implementation Fundamentals',
     'Onboarding, setup, best practices, and customer success.',
     'implementation', 'course', 'professional',
     '["Onboarding","Setup","Best Practices","Customer Success"]'::jsonb, 40),
    ('mod-5-gp-operations', 5, 'Growth Partner Operations',
     'Lead management, opportunities, customer relationships, and ethical selling.',
     'operations', 'course', 'professional',
     '["Lead Management","Opportunity Management","Customer Relationships","Ethical Selling"]'::jsonb, 50);

  for v_course_id in select id from public.growth_partner_portal_academy_courses loop
    insert into public.growth_partner_portal_academy_lessons (
      course_id, lesson_key, title, summary, learning_type, duration_minutes, sort_order
    )
    select v_course_id,
      'lesson-' || c.course_key || '-' || (row_number() over (order by t.tag))::text,
      t.tag,
      'Practical learning for ' || t.tag || '.',
      case when row_number() over (order by t.tag) = 5 then 'assessment' else 'lesson' end,
      20,
      (row_number() over (order by t.tag))::int * 10
    from public.growth_partner_portal_academy_courses c,
         lateral jsonb_array_elements_text(c.topic_tags) as t(tag)
    where c.id = v_course_id
    on conflict do nothing;
  end loop;

  insert into public.growth_partner_portal_academy_certifications (
    certification_key, title, summary, certification_level, course_id, passing_score, sort_order
  )
  select
    'cert-' || c.course_key,
    c.title || ' Certification',
    'Certification for completing ' || c.title || '.',
    c.certification_level,
    c.id,
    80,
    c.sort_order
  from public.growth_partner_portal_academy_courses c
  on conflict (certification_key) do nothing;

  insert into public.growth_partner_portal_academy_exams (
    exam_key, certification_id, title, exam_type, passing_score, question_count
  )
  select
    'exam-' || cert.certification_key,
    cert.id,
    cert.title || ' Exam',
    case cert.certification_level
      when 'foundation' then 'knowledge_assessment'
      when 'strategic' then 'certification_exam'
      else 'module_exam'
    end,
    cert.passing_score,
    10
  from public.growth_partner_portal_academy_certifications cert
  on conflict (exam_key) do nothing;
end; $$;

create or replace function public._gpa332_readiness_score(p_org_id uuid, p_user_id uuid)
returns integer language plpgsql stable security definer set search_path = public as $$
declare
  v_courses integer;
  v_certs integer;
  v_activity integer;
  v_assessments integer;
  v_total_courses integer;
begin
  select count(*) into v_total_courses from public.growth_partner_portal_academy_courses where enabled;
  select count(*) into v_courses
  from public.growth_partner_portal_academy_course_progress
  where partner_org_id = p_org_id and auth_user_id = p_user_id and status = 'completed';

  select count(*) into v_certs
  from public.growth_partner_portal_academy_certification_awards
  where partner_org_id = p_org_id and auth_user_id = p_user_id and certification_status = 'earned';

  select count(*) into v_activity
  from public.growth_partner_portal_academy_timeline
  where partner_org_id = p_org_id and (auth_user_id = p_user_id or auth_user_id is null);

  select count(*) into v_assessments
  from public.growth_partner_portal_academy_exam_attempts
  where partner_org_id = p_org_id and auth_user_id = p_user_id and passed;

  return least(100, greatest(10,
    (case when v_total_courses = 0 then 0 else (v_courses * 30 / v_total_courses) end) +
    (v_certs * 15) +
    least(v_activity * 2, 20) +
    (v_assessments * 5)
  ));
end; $$;

create or replace function public._gpa332_course_filters(
  p_category text, p_status text, p_cert_level text, p_difficulty text, p_locale text, p_search text
) returns text language sql immutable as $$
  select trim(both from coalesce(p_category, '') || ' ' || coalesce(p_status, '') || ' ' ||
    coalesce(p_cert_level, '') || ' ' || coalesce(p_difficulty, '') || ' ' ||
    coalesce(p_locale, '') || ' ' || coalesce(p_search, '')); $$;

create or replace function public.get_partner_academy_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid := auth.uid();
  v_access jsonb;
  v_progress_pct integer;
begin
  if v_user_id is null then return jsonb_build_object('has_access', false); end if;
  perform public._gpa332_seed_catalog();
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  perform public._gpp331_provision(v_org_id);
  v_access := public._gpa332_academy_access(v_org_id);

  select coalesce(round(avg(progress_pct))::int, 0) into v_progress_pct
  from public.growth_partner_portal_academy_course_progress
  where partner_org_id = v_org_id and auth_user_id = v_user_id;

  return jsonb_build_object(
    'has_access', true,
    'org_id', v_org_id,
    'positioning', public._gpa332bp_positioning(),
    'access', v_access,
    'academy_progress_pct', v_progress_pct,
    'certifications_earned', (
      select count(*)::int from public.growth_partner_portal_academy_certification_awards
      where partner_org_id = v_org_id and auth_user_id = v_user_id and certification_status = 'earned'
    ),
    'courses_in_progress', (
      select count(*)::int from public.growth_partner_portal_academy_course_progress
      where partner_org_id = v_org_id and auth_user_id = v_user_id and status = 'in_progress'
    ),
    'courses_completed', (
      select count(*)::int from public.growth_partner_portal_academy_course_progress
      where partner_org_id = v_org_id and auth_user_id = v_user_id and status = 'completed'
    ),
    'partner_readiness_score', public._gpa332_readiness_score(v_org_id, v_user_id),
    'recommended_learning', coalesce((
      select jsonb_agg(jsonb_build_object(
        'course_key', c.course_key,
        'title', c.title,
        'reason', 'Suggested next step for partner readiness',
        'certification_level', c.certification_level
      ) order by c.sort_order)
      from public.growth_partner_portal_academy_courses c
      where c.enabled and not exists (
        select 1 from public.growth_partner_portal_academy_course_progress p
        where p.course_id = c.id and p.partner_org_id = v_org_id
          and p.auth_user_id = v_user_id and p.status = 'completed'
      )
      limit 3
    ), '[]'::jsonb),
    'missing_certifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'certification_key', cert.certification_key,
        'title', cert.title,
        'certification_level', cert.certification_level
      ) order by cert.sort_order)
      from public.growth_partner_portal_academy_certifications cert
      where not exists (
        select 1 from public.growth_partner_portal_academy_certification_awards a
        where a.certification_id = cert.id and a.partner_org_id = v_org_id
          and a.auth_user_id = v_user_id and a.certification_status = 'earned'
      )
      limit 5
    ), '[]'::jsonb),
    'improvement_areas', jsonb_build_array(
      'Product knowledge depth',
      'Sales discovery practice',
      'Implementation best practices'
    ),
    'timeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id,
        'event_type', t.event_type,
        'title', t.title,
        'summary', t.summary,
        'created_at', t.created_at::text
      ) order by t.created_at desc)
      from public.growth_partner_portal_academy_timeline t
      where t.partner_org_id = v_org_id
      limit 20
    ), '[]'::jsonb),
    'filters', jsonb_build_object(
      'categories', jsonb_build_array('fundamentals', 'product', 'sales', 'implementation', 'operations'),
      'statuses', jsonb_build_array('not_started', 'in_progress', 'completed'),
      'certification_levels', jsonb_build_array('foundation', 'certified', 'professional', 'elite', 'strategic'),
      'difficulties', jsonb_build_array('introductory', 'intermediate', 'advanced'),
      'locales', jsonb_build_array('en', 'no', 'sv', 'da')
    )
  );
end; $$;

create or replace function public.get_partner_academy_courses(
  p_category text default null,
  p_status text default null,
  p_cert_level text default null,
  p_difficulty text default null,
  p_locale text default null,
  p_search text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid := auth.uid();
begin
  if v_user_id is null then return jsonb_build_object('has_access', false); end if;
  perform public._gpa332_seed_catalog();
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;

  return jsonb_build_object(
    'has_access', true,
    'courses', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id,
        'course_key', c.course_key,
        'module_number', c.module_number,
        'title', c.title,
        'summary', c.summary,
        'category', c.category,
        'learning_type', c.learning_type,
        'certification_level', c.certification_level,
        'difficulty', c.difficulty,
        'locale', c.locale,
        'topic_tags', c.topic_tags,
        'lesson_count', (select count(*)::int from public.growth_partner_portal_academy_lessons l where l.course_id = c.id),
        'progress_pct', coalesce(p.progress_pct, 0),
        'status', coalesce(p.status, 'not_started'),
        'lessons', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', l.id, 'lesson_key', l.lesson_key, 'title', l.title,
            'learning_type', l.learning_type, 'duration_minutes', l.duration_minutes
          ) order by l.sort_order)
          from public.growth_partner_portal_academy_lessons l where l.course_id = c.id
        ), '[]'::jsonb)
      ) order by c.sort_order)
      from public.growth_partner_portal_academy_courses c
      left join public.growth_partner_portal_academy_course_progress p
        on p.course_id = c.id and p.partner_org_id = v_org_id and p.auth_user_id = v_user_id
      where c.enabled
        and (p_category is null or c.category = p_category)
        and (p_cert_level is null or c.certification_level = p_cert_level)
        and (p_difficulty is null or c.difficulty = p_difficulty)
        and (p_locale is null or c.locale = p_locale)
        and (p_status is null or coalesce(p.status, 'not_started') = p_status)
        and (
          p_search is null or p_search = '' or
          c.title ilike '%' || p_search || '%' or
          c.summary ilike '%' || p_search || '%' or
          c.topic_tags::text ilike '%' || p_search || '%'
        )
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_partner_academy_certifications()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid := auth.uid();
begin
  if v_user_id is null then return jsonb_build_object('has_access', false); end if;
  perform public._gpa332_seed_catalog();
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;

  return jsonb_build_object(
    'has_access', true,
    'certifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cert.id,
        'certification_key', cert.certification_key,
        'title', cert.title,
        'summary', cert.summary,
        'certification_level', cert.certification_level,
        'passing_score', cert.passing_score,
        'max_attempts', cert.max_attempts,
        'certification_status', coalesce(a.certification_status, 'not_started'),
        'attempts_used', coalesce(a.attempts_used, 0),
        'score_pct', coalesce(a.score_pct, 0),
        'completion_date', coalesce(a.awarded_at::text, ''),
        'exam', (
          select jsonb_build_object(
            'exam_key', e.exam_key,
            'exam_type', e.exam_type,
            'passing_score', e.passing_score
          )
          from public.growth_partner_portal_academy_exams e
          where e.certification_id = cert.id limit 1
        )
      ) order by cert.sort_order)
      from public.growth_partner_portal_academy_certifications cert
      left join public.growth_partner_portal_academy_certification_awards a
        on a.certification_id = cert.id and a.partner_org_id = v_org_id and a.auth_user_id = v_user_id
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_partner_academy_progress()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid := auth.uid();
begin
  if v_user_id is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;

  return jsonb_build_object(
    'has_access', true,
    'partner_readiness_score', public._gpa332_readiness_score(v_org_id, v_user_id),
    'course_progress', coalesce((
      select jsonb_agg(jsonb_build_object(
        'course_key', c.course_key,
        'title', c.title,
        'progress_pct', p.progress_pct,
        'status', p.status,
        'started_at', coalesce(p.started_at::text, ''),
        'completed_at', coalesce(p.completed_at::text, '')
      ) order by c.sort_order)
      from public.growth_partner_portal_academy_course_progress p
      join public.growth_partner_portal_academy_courses c on c.id = p.course_id
      where p.partner_org_id = v_org_id and p.auth_user_id = v_user_id
    ), '[]'::jsonb),
    'exam_attempts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'exam_key', e.exam_key,
        'attempt_number', a.attempt_number,
        'score_pct', a.score_pct,
        'passed', a.passed,
        'completed_at', a.completed_at::text
      ) order by a.completed_at desc)
      from public.growth_partner_portal_academy_exam_attempts a
      join public.growth_partner_portal_academy_exams e on e.id = a.exam_id
      where a.partner_org_id = v_org_id and a.auth_user_id = v_user_id
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.submit_partner_academy_exam(
  p_exam_key text,
  p_score_pct integer default null,
  p_start_course_key text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid := auth.uid();
  v_exam public.growth_partner_portal_academy_exams;
  v_cert public.growth_partner_portal_academy_certifications;
  v_attempts integer;
  v_passed boolean;
  v_course public.growth_partner_portal_academy_courses;
  v_score integer;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();

  if not (public._gpa332_academy_access(v_org_id)->>'can_take_exams')::boolean then
    raise exception 'Academy exam access not permitted for this role';
  end if;

  if p_start_course_key is not null then
    select * into v_course from public.growth_partner_portal_academy_courses
    where course_key = p_start_course_key;
    if v_course.id is null then raise exception 'Course not found'; end if;

    insert into public.growth_partner_portal_academy_course_progress (
      partner_org_id, auth_user_id, course_id, progress_pct, status, started_at
    ) values (v_org_id, v_user_id, v_course.id, 5, 'in_progress', now())
    on conflict (partner_org_id, auth_user_id, course_id) do update set
      status = case when growth_partner_portal_academy_course_progress.status = 'completed'
        then 'completed' else 'in_progress' end,
      started_at = coalesce(growth_partner_portal_academy_course_progress.started_at, now()),
      updated_at = now();

    perform public._gpa332_log_timeline(
      v_org_id, 'course_started', v_course.title,
      'Course started in Partner Academy.', jsonb_build_object('course_key', p_start_course_key)
    );
    perform public._gpa332_log_audit(v_org_id, 'course_started', 'Academy course started',
      jsonb_build_object('course_key', p_start_course_key));

    return public.get_partner_academy_dashboard();
  end if;

  select * into v_exam from public.growth_partner_portal_academy_exams where exam_key = p_exam_key;
  if v_exam.id is null then raise exception 'Exam not found'; end if;
  select * into v_cert from public.growth_partner_portal_academy_certifications where id = v_exam.certification_id;

  select count(*) into v_attempts
  from public.growth_partner_portal_academy_exam_attempts
  where partner_org_id = v_org_id and auth_user_id = v_user_id and exam_id = v_exam.id;

  if v_attempts >= v_cert.max_attempts then
    raise exception 'Maximum exam attempts reached';
  end if;

  v_score := coalesce(p_score_pct, 85);
  v_passed := v_score >= v_exam.passing_score;

  insert into public.growth_partner_portal_academy_exam_attempts (
    partner_org_id, auth_user_id, exam_id, attempt_number, score_pct, passed
  ) values (v_org_id, v_user_id, v_exam.id, v_attempts + 1, v_score, v_passed);

  perform public._gpa332_log_timeline(
    v_org_id, 'exam_attempt', v_exam.title,
    'Exam attempt recorded.', jsonb_build_object('exam_key', p_exam_key, 'score', v_score, 'passed', v_passed)
  );

  if v_passed then
    insert into public.growth_partner_portal_academy_certification_awards (
      partner_org_id, auth_user_id, certification_id, certification_status, score_pct, attempts_used
    ) values (v_org_id, v_user_id, v_cert.id, 'earned', v_score, v_attempts + 1)
    on conflict (partner_org_id, auth_user_id, certification_id) do update set
      certification_status = 'earned',
      score_pct = greatest(growth_partner_portal_academy_certification_awards.score_pct, excluded.score_pct),
      attempts_used = excluded.attempts_used,
      awarded_at = now();

    if v_cert.course_id is not null then
      update public.growth_partner_portal_academy_course_progress set
        progress_pct = 100, status = 'completed', completed_at = now(), updated_at = now()
      where partner_org_id = v_org_id and auth_user_id = v_user_id and course_id = v_cert.course_id;
    end if;

    perform public._gpa332_log_timeline(
      v_org_id, 'certification_earned', v_cert.title,
      'Certification earned.', jsonb_build_object('certification_key', v_cert.certification_key)
    );
    perform public._gpa332_log_audit(v_org_id, 'certification_earned', 'Partner certification earned',
      jsonb_build_object('certification_key', v_cert.certification_key, 'score', v_score));
  end if;

  return public.get_partner_academy_certifications();
end; $$;

grant execute on function public.get_partner_academy_dashboard() to authenticated;
grant execute on function public.get_partner_academy_courses(text, text, text, text, text, text) to authenticated;
grant execute on function public.get_partner_academy_certifications() to authenticated;
grant execute on function public.get_partner_academy_progress() to authenticated;
grant execute on function public.submit_partner_academy_exam(text, integer, text) to authenticated;
