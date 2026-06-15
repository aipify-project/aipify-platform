-- Phase 284 — Academy Studio & Training Content Engine

-- ---------------------------------------------------------------------------
-- 1. Courses
-- ---------------------------------------------------------------------------
create table if not exists public.academy_studio_courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  audience text not null default 'growth_partners' check (
    audience in (
      'growth_partners', 'customers', 'enterprise_administrators',
      'internal_employees', 'support_teams', 'growth_partner_managers'
    )
  ),
  difficulty text not null default 'beginner' check (
    difficulty in ('beginner', 'intermediate', 'advanced', 'expert')
  ),
  language text not null default 'en' check (language in ('en', 'no', 'sv', 'da')),
  estimated_duration_minutes integer not null default 60,
  certification_required boolean not null default true,
  renewal_period_days integer,
  passing_threshold integer not null default 75 check (passing_threshold between 1 and 100),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  workflow_step text not null default 'define_audience' check (
    workflow_step in (
      'define_audience', 'define_objective', 'generate_outline',
      'generate_materials', 'publish_certification'
    )
  ),
  objective text not null default '',
  outline jsonb not null default '[]'::jsonb,
  content_types jsonb not null default '[]'::jsonb,
  ai_generation_notes jsonb not null default '{}'::jsonb,
  video_production_meta jsonb not null default '{
    "avatars_ready": false,
    "voice_generation_ready": false,
    "subtitle_generation_ready": false,
    "translation_ready": false,
    "production_partners_ready": false
  }'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists academy_studio_courses_status_idx
  on public.academy_studio_courses (status, audience);

-- ---------------------------------------------------------------------------
-- 2. Modules
-- ---------------------------------------------------------------------------
create table if not exists public.academy_studio_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.academy_studio_courses (id) on delete cascade,
  module_order integer not null default 1,
  module_type text not null default 'reading' check (
    module_type in (
      'video_lesson', 'reading', 'interactive_question',
      'scenario_exercise', 'assessment', 'practical_task'
    )
  ),
  title text not null,
  content jsonb not null default '{}'::jsonb,
  estimated_minutes integer not null default 15
);

create index if not exists academy_studio_modules_course_idx
  on public.academy_studio_modules (course_id, module_order);

-- ---------------------------------------------------------------------------
-- 3. Assessment questions
-- ---------------------------------------------------------------------------
create table if not exists public.academy_studio_questions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.academy_studio_courses (id) on delete cascade,
  module_id uuid references public.academy_studio_modules (id) on delete set null,
  question_type text not null default 'multiple_choice' check (
    question_type in ('multiple_choice', 'true_false', 'scenario_based', 'practical_validation')
  ),
  prompt text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null default '',
  difficulty_score integer not null default 50 check (difficulty_score between 1 and 100)
);

create index if not exists academy_studio_questions_course_idx
  on public.academy_studio_questions (course_id);

-- ---------------------------------------------------------------------------
-- 4. Certifications (learner progress)
-- ---------------------------------------------------------------------------
create table if not exists public.academy_studio_certifications (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.academy_studio_courses (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  status text not null default 'not_started' check (
    status in ('not_started', 'in_progress', 'certified', 'expired', 'suspended')
  ),
  score numeric(5,2),
  certified_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, user_id)
);

create index if not exists academy_studio_certifications_status_idx
  on public.academy_studio_certifications (status, expires_at);

-- ---------------------------------------------------------------------------
-- 5. Audit
-- ---------------------------------------------------------------------------
create table if not exists public.academy_studio_audit_logs (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.academy_studio_courses (id) on delete set null,
  event_type text not null check (
    event_type in (
      'course_created', 'course_updated', 'course_published',
      'assessment_completed', 'certification_issued', 'certification_renewed', 'content_exported'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists academy_studio_audit_created_idx
  on public.academy_studio_audit_logs (created_at desc);

alter table public.academy_studio_courses enable row level security;
alter table public.academy_studio_modules enable row level security;
alter table public.academy_studio_questions enable row level security;
alter table public.academy_studio_certifications enable row level security;
alter table public.academy_studio_audit_logs enable row level security;

revoke all on public.academy_studio_courses from authenticated, anon;
revoke all on public.academy_studio_modules from authenticated, anon;
revoke all on public.academy_studio_questions from authenticated, anon;
revoke all on public.academy_studio_certifications from authenticated, anon;
revoke all on public.academy_studio_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._ast284_require_super_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from public.platform_admins pa
    where pa.auth_user_id = auth.uid() and pa.role = 'super_admin'
  ) then
    raise exception 'Not authorized';
  end if;
end; $$;

create or replace function public._ast284_require_platform_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;
end; $$;

create or replace function public._ast284_current_user_id()
returns uuid language plpgsql stable security definer set search_path = public as $$
declare v_user_id uuid;
begin
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  return v_user_id;
end; $$;

create or replace function public._ast284_log_audit(
  p_course_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.academy_studio_audit_logs (course_id, event_type, summary, context)
  values (p_course_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._ast284_build_course_row(p_course public.academy_studio_courses)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_modules jsonb; v_questions jsonb;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'module_order', m.module_order, 'module_type', m.module_type,
    'title', m.title, 'content', m.content, 'estimated_minutes', m.estimated_minutes
  ) order by m.module_order), '[]'::jsonb)
  into v_modules from public.academy_studio_modules m where m.course_id = p_course.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', q.id, 'question_type', q.question_type, 'prompt', q.prompt,
    'options', q.options, 'difficulty_score', q.difficulty_score
  )), '[]'::jsonb)
  into v_questions from public.academy_studio_questions q where q.course_id = p_course.id;

  return jsonb_build_object(
    'id', p_course.id, 'title', p_course.title, 'description', p_course.description,
    'audience', p_course.audience, 'difficulty', p_course.difficulty, 'language', p_course.language,
    'estimated_duration_minutes', p_course.estimated_duration_minutes,
    'certification_required', p_course.certification_required,
    'renewal_period_days', p_course.renewal_period_days,
    'passing_threshold', p_course.passing_threshold, 'status', p_course.status,
    'workflow_step', p_course.workflow_step, 'objective', p_course.objective,
    'outline', p_course.outline, 'content_types', p_course.content_types,
    'ai_generation_notes', p_course.ai_generation_notes,
    'video_production_meta', p_course.video_production_meta,
    'published_at', p_course.published_at,
    'modules', v_modules, 'questions', v_questions,
    'created_at', p_course.created_at, 'updated_at', p_course.updated_at
  );
end; $$;

create or replace function public._ast284_seed_if_empty()
returns void language plpgsql security definer set search_path = public as $$
declare v_course_id uuid;
begin
  if exists (select 1 from public.academy_studio_courses limit 1) then return; end if;

  insert into public.academy_studio_courses (
    title, description, audience, difficulty, language, estimated_duration_minutes,
    certification_required, renewal_period_days, passing_threshold, status, workflow_step,
    objective, outline, content_types, published_at
  ) values (
    'Growth Partner Onboarding',
    'Professional onboarding for new Growth Partners — certification required.',
    'growth_partners', 'beginner', 'en', 120, true, 365, 75, 'published', 'publish_certification',
    'Enable Growth Partners to represent Aipify professionally and guide customers with confidence.',
    jsonb_build_array(
      jsonb_build_object('order', 1, 'title', 'Welcome & Aipify Values'),
      jsonb_build_object('order', 2, 'title', 'Product Overview'),
      jsonb_build_object('order', 3, 'title', 'Customer Onboarding Process'),
      jsonb_build_object('order', 4, 'title', 'Certification Assessment')
    ),
    jsonb_build_array('course_module', 'quiz', 'certification_program', 'checklist'),
    now() - interval '14 days'
  ) returning id into v_course_id;

  insert into public.academy_studio_modules (course_id, module_order, module_type, title, content, estimated_minutes)
  values
    (v_course_id, 1, 'video_lesson', 'Welcome to Aipify Growth Partners',
     jsonb_build_object('script', 'Introduce Aipify mission, People First principles, and partner expectations.'), 20),
    (v_course_id, 2, 'reading', 'Enterprise Billing Overview',
     jsonb_build_object('summary', 'Subscription tiers, license center, and renewal workflows.'), 25),
    (v_course_id, 3, 'scenario_exercise', 'Customer Onboarding Walkthrough',
     jsonb_build_object('scenario', 'Guide a new customer through install and first-week success.'), 30),
    (v_course_id, 4, 'assessment', 'Certification Quiz',
     jsonb_build_object('passing_threshold', 75), 45);

  insert into public.academy_studio_questions (course_id, question_type, prompt, options, correct_answer, difficulty_score)
  values
    (v_course_id, 'multiple_choice', 'What is the default payment grace period for customers?',
     jsonb_build_array('1 day', '3 days', '7 days', '14 days'), '3 days', 40),
    (v_course_id, 'true_false', 'Growth Partners may impersonate Aipify support staff.',
     jsonb_build_array('True', 'False'), 'False', 30),
    (v_course_id, 'scenario_based', 'A customer asks you to bypass billing approval. What do you recommend?',
     jsonb_build_array('Approve immediately', 'Escalate to Aipify support', 'Ignore the request', 'Share admin credentials'),
     'Escalate to Aipify support', 70);

  insert into public.academy_studio_courses (
    title, description, audience, difficulty, language, status, workflow_step, objective
  ) values (
    'Shopify Installation Training',
    'Installation training for Shopify customers — draft outline ready for AI generation.',
    'customers', 'intermediate', 'en', 'draft', 'generate_outline',
    'Help customers install Aipify on Shopify confidently within 30 minutes.'
  );

  perform public._ast284_log_audit(null, 'course_created', 'Academy Studio seeded with starter courses.', '{}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Overview RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_academy_studio_center(p_surface text default 'platform')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_user_id uuid;
  v_overview jsonb;
  v_courses jsonb;
  v_analytics jsonb;
  v_recommendations jsonb;
  v_audit jsonb;
  v_workflow jsonb;
  v_principle text := 'Technology scales processes. Education scales people.';
begin
  perform public._ast284_seed_if_empty();
  v_user_id := public._ast284_current_user_id();

  if p_surface = 'super' then
    perform public._ast284_require_super_admin();
  elsif p_surface = 'platform' then
    perform public._ast284_require_platform_admin();
  elsif p_surface = 'partner' then
    if v_user_id is null then
      return jsonb_build_object('has_access', false);
    end if;
  else
    raise exception 'Unknown surface';
  end if;

  v_overview := jsonb_build_object(
    'active_courses', (select count(*)::int from public.academy_studio_courses where status = 'published'),
    'certified_users', (select count(*)::int from public.academy_studio_certifications where status = 'certified'),
    'expiring_certifications', (
      select count(*)::int from public.academy_studio_certifications
      where status = 'certified' and expires_at is not null and expires_at <= now() + interval '30 days'
    ),
    'completion_rate', coalesce((
      select round(100.0 * count(*) filter (where status = 'certified') / nullif(count(*), 0), 1)
      from public.academy_studio_certifications
    ), 0),
    'courses_requiring_review', (select count(*)::int from public.academy_studio_courses where status = 'draft'),
    'recommended_improvements', (select count(*)::int from public.academy_studio_courses where status = 'published' and updated_at < now() - interval '180 days')
  );

  v_analytics := jsonb_build_object(
    'completion_rate', v_overview->'completion_rate',
    'pass_rate', coalesce((
      select round(avg(score), 1) from public.academy_studio_certifications where score is not null
    ), 0),
    'average_score', coalesce((select round(avg(score), 1) from public.academy_studio_certifications where score is not null), 0),
    'module_drop_off_rate', 12.5,
    'most_difficult_questions', coalesce((
      select jsonb_agg(jsonb_build_object('prompt', q.prompt, 'difficulty_score', q.difficulty_score) order by q.difficulty_score desc)
      from (select prompt, difficulty_score from public.academy_studio_questions order by difficulty_score desc limit 3) q
    ), '[]'::jsonb),
    'retraining_opportunities', coalesce((
      select count(*)::int from public.academy_studio_certifications where status in ('expired', 'suspended')
    ), 0)
  );

  if p_surface = 'partner' then
    select coalesce(jsonb_agg(public._ast284_build_course_row(c.*) order by c.title), '[]'::jsonb)
    into v_courses
    from public.academy_studio_courses c
    where c.status = 'published'
      and c.audience in ('growth_partners', 'growth_partner_managers');
  else
    select coalesce(jsonb_agg(public._ast284_build_course_row(c.*) order by c.updated_at desc), '[]'::jsonb)
    into v_courses
    from public.academy_studio_courses c
    where c.status <> 'archived'
    limit 25;
  end if;

  v_recommendations := coalesce((
    select jsonb_agg(r) from (
      select jsonb_build_object(
        'key', 'update_outdated',
        'message_key', 'update_outdated',
        'count', (select count(*)::int from public.academy_studio_courses where status = 'published' and updated_at < now() - interval '180 days')
      ) as r
      where exists (select 1 from public.academy_studio_courses where status = 'published' and updated_at < now() - interval '180 days')
      union all
      select jsonb_build_object('key', 'clarify_topics', 'message_key', 'clarify_topics')
      where exists (select 1 from public.academy_studio_questions where difficulty_score >= 70)
      union all
      select jsonb_build_object('key', 'new_course', 'message_key', 'new_course')
      where (select count(*) from public.academy_studio_courses where audience = 'customers' and status = 'published') < 2
      union all
      select jsonb_build_object('key', 'refresher_training', 'message_key', 'refresher_training')
      where (select count(*) from public.academy_studio_certifications where status = 'expired') > 0
    ) recs
  ), '[]'::jsonb);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from public.academy_studio_audit_logs a limit 15;

  v_workflow := jsonb_build_array(
    jsonb_build_object('step', 'define_audience', 'order', 1),
    jsonb_build_object('step', 'define_objective', 'order', 2),
    jsonb_build_object('step', 'generate_outline', 'order', 3),
    jsonb_build_object('step', 'generate_materials', 'order', 4),
    jsonb_build_object('step', 'publish_certification', 'order', 5)
  );

  return jsonb_build_object(
    'has_access', true,
    'surface', p_surface,
    'overview', v_overview,
    'courses', v_courses,
    'analytics', v_analytics,
    'recommendations', v_recommendations,
    'audit', v_audit,
    'workflow', v_workflow,
    'default_passing_threshold', 75,
    'principle', v_principle,
    'supported_languages', jsonb_build_array('en', 'no', 'sv', 'da'),
    'video_production_readiness', jsonb_build_object(
      'ai_avatars', 'prepared',
      'voice_generation', 'prepared',
      'subtitle_generation', 'prepared',
      'translation_engines', 'prepared',
      'production_partners', 'prepared'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Actions RPC
-- ---------------------------------------------------------------------------
create or replace function public.record_academy_studio_action(
  p_action text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_course public.academy_studio_courses;
  v_course_id uuid;
  v_user_id uuid;
  v_export jsonb;
  v_outline jsonb;
  v_materials jsonb;
begin
  p_payload := coalesce(p_payload, '{}'::jsonb);
  v_user_id := public._ast284_current_user_id();

  if p_action in (
    'create_course', 'update_course', 'publish_course', 'generate_outline',
    'generate_materials', 'generate_quiz', 'export_fiverr_package'
  ) then
    perform public._ast284_require_super_admin();
  end if;

  if p_action = 'create_course' then
    insert into public.academy_studio_courses (
      title, description, audience, difficulty, language, estimated_duration_minutes,
      certification_required, renewal_period_days, passing_threshold, objective, workflow_step
    ) values (
      coalesce(p_payload->>'title', 'New course'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'audience', 'growth_partners'),
      coalesce(p_payload->>'difficulty', 'beginner'),
      coalesce(p_payload->>'language', 'en'),
      coalesce((p_payload->>'estimated_duration_minutes')::int, 60),
      coalesce((p_payload->>'certification_required')::boolean, true),
      nullif(p_payload->>'renewal_period_days', '')::int,
      coalesce((p_payload->>'passing_threshold')::int, 75),
      coalesce(p_payload->>'objective', ''),
      'define_audience'
    ) returning * into v_course;

    perform public._ast284_log_audit(v_course.id, 'course_created', format('Course created: %s', v_course.title), '{}'::jsonb);
    return jsonb_build_object('ok', true, 'course', public._ast284_build_course_row(v_course));
  end if;

  if p_action = 'update_course' then
    v_course_id := nullif(p_payload->>'course_id', '')::uuid;
    update public.academy_studio_courses c set
      title = coalesce(nullif(p_payload->>'title', ''), c.title),
      description = coalesce(p_payload->>'description', c.description),
      audience = coalesce(nullif(p_payload->>'audience', ''), c.audience),
      difficulty = coalesce(nullif(p_payload->>'difficulty', ''), c.difficulty),
      language = coalesce(nullif(p_payload->>'language', ''), c.language),
      objective = coalesce(p_payload->>'objective', c.objective),
      workflow_step = coalesce(nullif(p_payload->>'workflow_step', ''), c.workflow_step),
      updated_at = now()
    where c.id = v_course_id returning * into v_course;
    if v_course.id is null then raise exception 'Course not found'; end if;
    perform public._ast284_log_audit(v_course.id, 'course_updated', format('Course updated: %s', v_course.title), '{}'::jsonb);
    return jsonb_build_object('ok', true, 'course', public._ast284_build_course_row(v_course));
  end if;

  if p_action = 'generate_outline' then
    v_course_id := nullif(p_payload->>'course_id', '')::uuid;
    v_outline := jsonb_build_array(
      jsonb_build_object('order', 1, 'title', 'Introduction & objectives'),
      jsonb_build_object('order', 2, 'title', 'Core concepts'),
      jsonb_build_object('order', 3, 'title', 'Practical exercises'),
      jsonb_build_object('order', 4, 'title', 'Assessment & certification')
    );
    update public.academy_studio_courses c set
      outline = v_outline, workflow_step = 'generate_outline',
      ai_generation_notes = coalesce(c.ai_generation_notes, '{}'::jsonb) || jsonb_build_object('outline_generated_at', now()),
      updated_at = now()
    where c.id = v_course_id returning * into v_course;
    if v_course.id is null then raise exception 'Course not found'; end if;
    perform public._ast284_log_audit(v_course.id, 'course_updated', 'AI-assisted outline generated.', jsonb_build_object('outline', v_outline));
    return jsonb_build_object('ok', true, 'course', public._ast284_build_course_row(v_course));
  end if;

  if p_action = 'generate_materials' then
    v_course_id := nullif(p_payload->>'course_id', '')::uuid;
    select * into v_course from public.academy_studio_courses where id = v_course_id;
    if v_course.id is null then raise exception 'Course not found'; end if;

    v_materials := jsonb_build_object(
      'video_manuscript', format('Professional training manuscript for: %s', v_course.title),
      'presentation_slides', jsonb_build_array('Slide 1: Objectives', 'Slide 2: Key concepts', 'Slide 3: Summary'),
      'knowledge_summary', v_course.description,
      'follow_up_materials', jsonb_build_array('Checklist', 'PDF guide outline')
    );

    update public.academy_studio_courses set
      ai_generation_notes = coalesce(ai_generation_notes, '{}'::jsonb) || jsonb_build_object('materials', v_materials, 'materials_generated_at', now()),
      workflow_step = 'generate_materials', updated_at = now()
    where id = v_course_id returning * into v_course;

    perform public._ast284_log_audit(v_course.id, 'course_updated', 'AI-assisted materials generated.', v_materials);
    return jsonb_build_object('ok', true, 'course', public._ast284_build_course_row(v_course), 'materials', v_materials);
  end if;

  if p_action = 'generate_quiz' then
    v_course_id := nullif(p_payload->>'course_id', '')::uuid;
    insert into public.academy_studio_questions (course_id, question_type, prompt, options, correct_answer, difficulty_score)
    values (
      v_course_id, 'multiple_choice',
      coalesce(p_payload->>'topic', 'Course topic') || ' — knowledge check',
      jsonb_build_array('Option A', 'Option B', 'Option C', 'Option D'),
      'Option A', 55
    );
    perform public._ast284_log_audit(v_course_id, 'course_updated', 'AI-assisted quiz question generated.', '{}'::jsonb);
    select * into v_course from public.academy_studio_courses where id = v_course_id;
    return jsonb_build_object('ok', true, 'course', public._ast284_build_course_row(v_course));
  end if;

  if p_action = 'publish_course' then
    v_course_id := nullif(p_payload->>'course_id', '')::uuid;
    update public.academy_studio_courses c set
      status = 'published', workflow_step = 'publish_certification', published_at = now(), updated_at = now()
    where c.id = v_course_id returning * into v_course;
    if v_course.id is null then raise exception 'Course not found'; end if;
    perform public._ast284_log_audit(v_course.id, 'course_published', format('Course published: %s', v_course.title), '{}'::jsonb);
    return jsonb_build_object('ok', true, 'course', public._ast284_build_course_row(v_course));
  end if;

  if p_action = 'export_fiverr_package' then
    v_course_id := nullif(p_payload->>'course_id', '')::uuid;
    select * into v_course from public.academy_studio_courses where id = v_course_id;
    if v_course.id is null then raise exception 'Course not found'; end if;
    perform public._ast284_require_super_admin();

    v_export := jsonb_build_object(
      'course_objective', v_course.objective,
      'complete_script', coalesce(v_course.ai_generation_notes->'materials'->>'video_manuscript', v_course.description),
      'scene_descriptions', v_course.outline,
      'slide_references', coalesce(v_course.ai_generation_notes->'materials'->'presentation_slides', '[]'::jsonb),
      'branding_instructions', 'Aipify enterprise palette — calm, professional, People First.',
      'voice_style_guidance', 'Warm, authoritative, Norwegian-English neutral accent.',
      'certification_outcomes', jsonb_build_object('passing_threshold', v_course.passing_threshold, 'renewal_days', v_course.renewal_period_days)
    );

    perform public._ast284_log_audit(v_course.id, 'content_exported', 'Fiverr production package exported.', jsonb_build_object('export_type', 'fiverr'));
    return jsonb_build_object('ok', true, 'export', v_export);
  end if;

  if p_action = 'start_course' then
    if v_user_id is null then raise exception 'User not found'; end if;
    v_course_id := nullif(p_payload->>'course_id', '')::uuid;
    insert into public.academy_studio_certifications (course_id, user_id, status)
    values (v_course_id, v_user_id, 'in_progress')
    on conflict (course_id, user_id) do update set status = 'in_progress', updated_at = now();
    perform public._ast284_log_audit(v_course_id, 'assessment_completed', 'Learner started course.', jsonb_build_object('user_id', v_user_id));
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'complete_assessment' then
    if v_user_id is null then raise exception 'User not found'; end if;
    v_course_id := nullif(p_payload->>'course_id', '')::uuid;
    select * into v_course from public.academy_studio_courses where id = v_course_id;

    update public.academy_studio_certifications set
      status = case when coalesce((p_payload->>'score')::numeric, 0) >= v_course.passing_threshold then 'certified' else 'in_progress' end,
      score = coalesce((p_payload->>'score')::numeric, 0),
      certified_at = case when coalesce((p_payload->>'score')::numeric, 0) >= v_course.passing_threshold then now() else null end,
      expires_at = case
        when coalesce((p_payload->>'score')::numeric, 0) >= v_course.passing_threshold and v_course.renewal_period_days is not null
        then now() + make_interval(days => v_course.renewal_period_days)
        else null
      end,
      updated_at = now()
    where course_id = v_course_id and user_id = v_user_id;

    perform public._ast284_log_audit(v_course_id, 'assessment_completed', 'Assessment completed.', p_payload);
    if coalesce((p_payload->>'score')::numeric, 0) >= v_course.passing_threshold then
      perform public._ast284_log_audit(v_course_id, 'certification_issued', 'Certification issued.', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', p_action;
end; $$;

grant execute on function public.get_academy_studio_center(text) to authenticated;
grant execute on function public.record_academy_studio_action(text, jsonb) to authenticated;
