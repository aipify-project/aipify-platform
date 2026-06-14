-- Phase 94 — Aipify Academy & Learning Ecosystem
-- Principle: Empowering people to work smarter with AI.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning'
  )
);

-- ---------------------------------------------------------------------------
-- 1. academy_settings
-- ---------------------------------------------------------------------------
create table if not exists public.academy_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  academy_enabled boolean not null default true,
  microlearning_enabled boolean not null default true,
  role_based_recommendations boolean not null default true,
  certification_prep_enabled boolean not null default true,
  annual_recertification_months int not null default 12,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.academy_settings enable row level security;
revoke all on public.academy_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. academy_learning_paths
-- ---------------------------------------------------------------------------
create table if not exists public.academy_learning_paths (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  path_key text not null,
  title text not null,
  description text not null,
  pillar text not null check (
    pillar in ('customer_learning', 'professional_development', 'partner_education', 'executive_education')
  ),
  access_level text not null default 'customer' check (
    access_level in ('public', 'customer', 'partner', 'enterprise', 'certification')
  ),
  target_roles text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'archived')),
  sort_order int not null default 0,
  unique (tenant_id, path_key)
);

alter table public.academy_learning_paths enable row level security;
revoke all on public.academy_learning_paths from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. academy_courses
-- ---------------------------------------------------------------------------
create table if not exists public.academy_courses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  path_id uuid references public.academy_learning_paths (id) on delete set null,
  course_key text not null,
  title text not null,
  description text not null,
  format_type text not null default 'self_paced' check (
    format_type in ('self_paced', 'instructor_led', 'workshop', 'scenario', 'simulation', 'certification_prep')
  ),
  content_type text not null default 'guide' check (
    content_type in ('video', 'guide', 'tutorial', 'playbook', 'template', 'case_study', 'quiz', 'microlearning')
  ),
  duration_minutes int not null default 30,
  access_level text not null default 'customer' check (
    access_level in ('public', 'customer', 'partner', 'enterprise', 'certification')
  ),
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  unique (tenant_id, course_key)
);

alter table public.academy_courses enable row level security;
revoke all on public.academy_courses from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. academy_course_progress
-- ---------------------------------------------------------------------------
create table if not exists public.academy_course_progress (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  course_id uuid not null references public.academy_courses (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  status text not null default 'not_started' check (
    status in ('not_started', 'in_progress', 'completed', 'expired')
  ),
  progress_pct numeric(5, 2) not null default 0 check (progress_pct between 0 and 100),
  started_at timestamptz,
  completed_at timestamptz,
  unique (tenant_id, course_id, user_id)
);

alter table public.academy_course_progress enable row level security;
revoke all on public.academy_course_progress from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. academy_assessments + attempts
-- ---------------------------------------------------------------------------
create table if not exists public.academy_assessments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  course_id uuid references public.academy_courses (id) on delete cascade,
  title text not null,
  assessment_type text not null default 'quiz' check (
    assessment_type in ('quiz', 'scenario', 'practical', 'certification_exam')
  ),
  passing_score numeric(5, 2) not null default 70,
  status text not null default 'active' check (status in ('active', 'archived')),
  unique (tenant_id, course_id, title)
);

alter table public.academy_assessments enable row level security;
revoke all on public.academy_assessments from authenticated, anon;

create table if not exists public.academy_assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  assessment_id uuid not null references public.academy_assessments (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  score numeric(5, 2),
  passed boolean not null default false,
  status text not null default 'completed' check (status in ('in_progress', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.academy_assessment_attempts enable row level security;
revoke all on public.academy_assessment_attempts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. academy_digital_badges
-- ---------------------------------------------------------------------------
create table if not exists public.academy_digital_badges (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  badge_key text not null,
  title text not null,
  badge_type text not null check (
    badge_type in ('completion', 'specialist', 'milestone', 'community')
  ),
  earned_at timestamptz not null default now(),
  unique (tenant_id, user_id, badge_key)
);

alter table public.academy_digital_badges enable row level security;
revoke all on public.academy_digital_badges from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. academy_learning_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.academy_learning_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  course_id uuid references public.academy_courses (id) on delete cascade,
  title text not null,
  description text not null,
  reason text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  target_role text,
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table public.academy_learning_recommendations enable row level security;
revoke all on public.academy_learning_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. academy_organizational_reports + events + community + reviews
-- ---------------------------------------------------------------------------
create table if not exists public.academy_organizational_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  report_type text not null check (
    report_type in ('participation', 'completion', 'certification', 'readiness', 'skill_trends', 'executive')
  ),
  title text not null,
  summary text,
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.academy_organizational_reports enable row level security;
revoke all on public.academy_organizational_reports from authenticated, anon;

create table if not exists public.academy_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in ('webinar', 'workshop', 'learning_campaign', 'feature_briefing', 'learning_challenge')
  ),
  title text not null,
  description text not null,
  scheduled_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.academy_events enable row level security;
revoke all on public.academy_events from authenticated, anon;

create table if not exists public.academy_community_resources (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  title text not null,
  description text not null,
  resource_type text not null check (
    resource_type in ('user_tutorial', 'expert_webinar', 'best_practice', 'knowledge_share')
  ),
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.academy_community_resources enable row level security;
revoke all on public.academy_community_resources from authenticated, anon;

create table if not exists public.academy_content_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  course_id uuid references public.academy_courses (id) on delete set null,
  review_status text not null default 'current' check (
    review_status in ('current', 'review_due', 'updated', 'deprecated')
  ),
  accuracy_score numeric(5, 2),
  relevance_score numeric(5, 2),
  last_reviewed_at timestamptz,
  notes text
);

alter table public.academy_content_reviews enable row level security;
revoke all on public.academy_content_reviews from authenticated, anon;

create table if not exists public.academy_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.academy_briefings enable row level security;
revoke all on public.academy_briefings from authenticated, anon;

create table if not exists public.academy_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.academy_audit_log enable row level security;
revoke all on public.academy_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Helpers (_aac_)
-- ---------------------------------------------------------------------------
create or replace function public._aac_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._aac_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._aac_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.academy_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'academy_learning_' || p_event_type, 'academy_learning', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._aac_ensure_settings(p_tenant_id uuid)
returns public.academy_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.academy_settings;
begin
  insert into public.academy_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.academy_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._aac_pillar_label(p_pillar text)
returns text language sql immutable as $$
  select case p_pillar
    when 'customer_learning' then 'Customer Learning'
    when 'professional_development' then 'Professional Development'
    when 'partner_education' then 'Partner Education'
    when 'executive_education' then 'Executive Education'
    else initcap(replace(p_pillar, '_', ' '))
  end;
$$;

create or replace function public._aac_seed_paths(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.academy_learning_paths (tenant_id, path_key, title, description, pillar, access_level, target_roles, sort_order)
  select p_tenant_id, v.key, v.title, v.item_description, v.pillar, v.access, v.roles, v.ord
  from (values
    ('getting_started', 'Getting Started with Aipify', 'Foundation for new users.', 'customer_learning', 'customer', array['standard_user'], 1),
    ('support_ai_basics', 'Introduction to Support AI', 'Deploy and optimize Support AI.', 'customer_learning', 'customer', array['support_lead', 'standard_user'], 2),
    ('knowledge_centers', 'Building Knowledge Centers', 'Structure operational knowledge.', 'customer_learning', 'customer', array['standard_user', 'analyst'], 3),
    ('governance_fundamentals', 'Governance Fundamentals', 'Internal quality and policy standards.', 'customer_learning', 'customer', array['governance_officer'], 4),
    ('aipify_administrator', 'Aipify Administrator', 'Platform configuration and user management.', 'professional_development', 'customer', array['platform_administrator'], 10),
    ('governance_specialist', 'Governance Specialist', 'Advanced governance and compliance.', 'professional_development', 'certification', array['governance_officer'], 11),
    ('support_operations', 'Support Operations Specialist', 'Support workflows and escalation.', 'professional_development', 'customer', array['support_lead'], 12),
    ('partner_implementation', 'Partner Implementation Methodology', 'Deployment best practices for partners.', 'partner_education', 'partner', array['implementation_partner'], 20),
    ('partner_commercial', 'Partner Commercial Enablement', 'Sales and referral frameworks.', 'partner_education', 'partner', array['partner'], 21),
    ('executive_ai_strategy', 'AI Strategy for Leaders', 'Strategic AI adoption for executives.', 'executive_education', 'enterprise', array['executive_sponsor'], 30),
    ('executive_governance', 'Governance Models for Leadership', 'Risk, oversight, and organizational readiness.', 'executive_education', 'enterprise', array['executive_sponsor', 'governance_officer'], 31)
  ) as v(key, title, item_description, pillar, access, roles, ord)
  where not exists (select 1 from public.academy_learning_paths lp where lp.tenant_id = p_tenant_id and lp.path_key = v.key);
end; $$;

create or replace function public._aac_seed_courses(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.academy_courses (tenant_id, path_id, course_key, title, description, format_type, content_type, duration_minutes, access_level)
  select p_tenant_id, lp.id, v.key, v.title, v.item_description, v.format, v.content, v.dur, lp.access_level
  from public.academy_learning_paths lp
  cross join lateral (values
    ('welcome', 'Welcome to Aipify', 'Platform overview and first steps.', 'self_paced', 'video', 10),
    ('core_concepts', 'Core Concepts', 'Assistant, Knowledge Center, and Actions.', 'self_paced', 'guide', 25),
    ('hands_on', 'Hands-On Tutorial', 'Interactive first workflow setup.', 'scenario', 'tutorial', 45)
  ) as v(key, title, item_description, format, content, dur)
  where lp.tenant_id = p_tenant_id and lp.path_key = 'getting_started'
  on conflict (tenant_id, course_key) do nothing;

  insert into public.academy_courses (tenant_id, path_id, course_key, title, description, format_type, content_type, duration_minutes, access_level)
  select p_tenant_id, lp.id, 'support_' || lp.path_key, lp.title || ' — Module 1', lp.description,
    'self_paced', 'guide', 30, lp.access_level
  from public.academy_learning_paths lp
  where lp.tenant_id = p_tenant_id and lp.path_key != 'getting_started'
  on conflict (tenant_id, course_key) do nothing;

  insert into public.academy_courses (tenant_id, course_key, title, description, format_type, content_type, duration_minutes, access_level)
  select p_tenant_id, v.key, v.title, v.item_description, 'self_paced', 'microlearning', v.dur, 'customer'
  from (values
    ('daily_tip_actions', 'Daily Tip: Action Center', '5-minute feature introduction.', 5),
    ('daily_tip_briefing', 'Daily Tip: Daily Briefing', 'Get value from briefings quickly.', 5),
    ('refresher_governance', 'Governance Refresher', 'Quick policy and approval recap.', 8)
  ) as v(key, title, item_description, dur)
  where not exists (select 1 from public.academy_courses c where c.tenant_id = p_tenant_id and c.course_key = v.key);
end; $$;

create or replace function public._aac_seed_progress(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_user_id uuid;
begin
  v_user_id := public._aac_auth_user_id();
  insert into public.academy_course_progress (tenant_id, course_id, user_id, status, progress_pct, started_at, completed_at)
  select p_tenant_id, c.id, v_user_id,
    case when c.course_key in ('welcome', 'core_concepts') then 'completed'
         when c.course_key = 'hands_on' then 'in_progress' else 'not_started' end,
    case when c.course_key in ('welcome', 'core_concepts') then 100
         when c.course_key = 'hands_on' then 45 else 0 end,
    case when c.course_key != 'daily_tip_actions' then now() - interval '7 days' else null end,
    case when c.course_key in ('welcome', 'core_concepts') then now() - interval '3 days' else null end
  from public.academy_courses c where c.tenant_id = p_tenant_id
  on conflict (tenant_id, course_id, user_id) do nothing;
end; $$;

create or replace function public._aac_seed_recommendations(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.academy_learning_recommendations (tenant_id, course_id, title, description, reason, priority, target_role)
  select p_tenant_id, c.id, 'Recommended: ' || c.title, c.description,
    'Based on your role and incomplete learning paths.', 'high', 'platform_administrator'
  from public.academy_courses c
  where c.tenant_id = p_tenant_id and c.course_key = 'hands_on'
    and not exists (select 1 from public.academy_learning_recommendations r where r.tenant_id = p_tenant_id limit 1);

  insert into public.academy_learning_recommendations (tenant_id, title, description, reason, priority, target_role)
  select p_tenant_id, v.title, v.item_description, v.reason, v.pri, v.role
  from (values
    ('Complete Governance Fundamentals', 'Align with your governance officer responsibilities.', 'Skill gap identified', 'medium', 'governance_officer'),
    ('Partner Implementation Methodology', 'Prepare for certification renewal.', 'Partner track available', 'high', 'implementation_partner')
  ) as v(title, item_description, reason, pri, role)
  where not exists (select 1 from public.academy_learning_recommendations r where r.tenant_id = p_tenant_id and r.title = v.title);
end; $$;

create or replace function public._aac_seed_badges(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_user_id uuid;
begin
  v_user_id := public._aac_auth_user_id();
  insert into public.academy_digital_badges (tenant_id, user_id, badge_key, title, badge_type)
  select p_tenant_id, v_user_id, v.key, v.title, v.type
  from (values
    ('foundations_complete', 'Aipify Foundations Complete', 'completion'),
    ('first_course', 'First Course Milestone', 'milestone'),
    ('support_basics', 'Support AI Basics', 'specialist')
  ) as v(key, title, type)
  on conflict (tenant_id, user_id, badge_key) do nothing;
end; $$;

create or replace function public._aac_seed_events(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.academy_events where tenant_id = p_tenant_id) then
    insert into public.academy_events (tenant_id, event_type, title, description, scheduled_at, status)
    values
      (p_tenant_id, 'webinar', 'Academy Live: Governance Best Practices', 'Expert-led session on marketplace governance.', now() + interval '14 days', 'scheduled'),
      (p_tenant_id, 'learning_campaign', 'March Learning Campaign', 'Complete 3 courses this month for a milestone badge.', now() + interval '7 days', 'scheduled'),
      (p_tenant_id, 'feature_briefing', 'Feature Update: Strategic Intelligence', 'Learn what changed and how to adopt.', now() + interval '3 days', 'scheduled');
  end if;
end; $$;

create or replace function public._aac_seed_community(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.academy_community_resources (tenant_id, title, description, resource_type, status)
  select p_tenant_id, v.title, v.item_description, v.type, 'published'
  from (values
    ('Community: Workflow Optimization Tips', 'User-generated tutorial on automation patterns.', 'user_tutorial'),
    ('Expert Webinar: Enterprise Deployment', 'Recorded partner session on rollout methodology.', 'expert_webinar'),
    ('Best Practice: Knowledge Center Structure', 'Community-contributed playbook.', 'best_practice')
  ) as v(title, item_description, type)
  where not exists (select 1 from public.academy_community_resources r where r.tenant_id = p_tenant_id and r.title = v.title);
end; $$;

create or replace function public._aac_org_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_total int; v_completed int; v_in_progress int; v_participation numeric;
begin
  select count(*), count(*) filter (where status = 'completed'), count(*) filter (where status = 'in_progress')
  into v_total, v_completed, v_in_progress from public.academy_course_progress where tenant_id = p_tenant_id;

  v_participation := case when v_total = 0 then 0 else round(100.0 * (v_completed + v_in_progress) / greatest(v_total, 1), 1) end;

  delete from public.academy_organizational_reports where tenant_id = p_tenant_id;
  insert into public.academy_organizational_reports (tenant_id, report_type, title, summary, metrics)
  values
    (p_tenant_id, 'participation', 'Learning Participation', 'Team engagement with Academy content.',
      jsonb_build_object('participation_pct', v_participation, 'active_learners', v_in_progress + v_completed)),
    (p_tenant_id, 'completion', 'Completion Rates', 'Course completion across the organization.',
      jsonb_build_object('completed', v_completed, 'in_progress', v_in_progress, 'completion_rate_pct', case when v_total = 0 then 0 else round(100.0 * v_completed / v_total, 1) end)),
    (p_tenant_id, 'readiness', 'Team Readiness', 'Organizational readiness indicators.',
      jsonb_build_object('readiness_score', least(100, v_participation + 20), 'skill_maturity', 'developing'));

  return jsonb_build_object(
    'participation_pct', v_participation,
    'completion_rate_pct', case when v_total = 0 then 0 else round(100.0 * v_completed / v_total, 1) end,
    'courses_completed', v_completed,
    'courses_in_progress', v_in_progress,
    'readiness_score', least(100, v_participation + 20),
    'certification_progress_pct', 35
  );
end; $$;

create or replace function public._aac_trust_explanation(p_tenant_id uuid, p_score numeric)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.generate_decision_explanation(
    'aac-score-' || p_tenant_id::text,
    'academy_learning',
    'academy_learning',
    'Academy readiness: ' || p_score || '/100',
    'People unlock the true value of technology. Education creates confidence.',
    jsonb_build_array(
      jsonb_build_object('source', 'course_progress'),
      jsonb_build_object('source', 'learning_recommendations'),
      jsonb_build_object('source', 'organizational_participation')
    ),
    jsonb_build_array('continuous_learning', 'role_based_paths', 'audit_logged'),
    'medium', '[]'::jsonb, '[]'::jsonb
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.enroll_academy_course(p_course_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._aac_require_tenant();
  v_user_id := public._aac_auth_user_id();
  insert into public.academy_course_progress (tenant_id, course_id, user_id, status, progress_pct, started_at)
  values (p_tenant_id, p_course_id, v_user_id, 'in_progress', 5, now())
  on conflict (tenant_id, course_id, user_id) do update set
    status = 'in_progress', started_at = coalesce(academy_course_progress.started_at, now());
  perform public._aac_log_audit(v_tenant_id, 'course_enrolled', 'Enrolled in course', 'learning_progress',
    jsonb_build_object('course_id', p_course_id));
  return jsonb_build_object('status', 'in_progress');
end; $$;

create or replace function public.complete_academy_course(p_course_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._aac_require_tenant();
  v_user_id := public._aac_auth_user_id();
  update public.academy_course_progress set status = 'completed', progress_pct = 100, completed_at = now()
  where tenant_id = v_tenant_id and course_id = p_course_id and (user_id = v_user_id or user_id is null);
  perform public._aac_log_audit(v_tenant_id, 'course_completed', 'Course completed', 'learning_progress',
    jsonb_build_object('course_id', p_course_id));
  return jsonb_build_object('status', 'completed');
end; $$;

create or replace function public.dismiss_academy_recommendation(p_recommendation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._aac_require_tenant();
  update public.academy_learning_recommendations set status = 'dismissed'
  where id = p_recommendation_id and tenant_id = v_tenant_id;
  return jsonb_build_object('status', 'dismissed');
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_academy_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_metrics jsonb;
  v_id uuid;
  v_summary text;
begin
  v_tenant_id := public._aac_require_tenant();
  perform public._aac_ensure_settings(v_tenant_id);
  perform public._aac_seed_paths(v_tenant_id);
  perform public._aac_seed_courses(v_tenant_id);
  perform public._aac_seed_progress(v_tenant_id);
  perform public._aac_seed_recommendations(v_tenant_id);
  perform public._aac_seed_badges(v_tenant_id);
  perform public._aac_seed_events(v_tenant_id);
  perform public._aac_seed_community(v_tenant_id);
  v_metrics := public._aac_org_metrics(v_tenant_id);
  perform public._aac_trust_explanation(v_tenant_id, (v_metrics->>'readiness_score')::numeric);

  v_summary := 'Academy readiness ' || (v_metrics->>'readiness_score') || '/100 — ' ||
    (v_metrics->>'courses_completed') || ' courses completed, ' ||
    (v_metrics->>'courses_in_progress') || ' in progress';

  insert into public.academy_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_metrics) returning id into v_id;

  perform public._aac_log_audit(v_tenant_id, 'briefing_generated', v_summary, 'executive_briefing',
    jsonb_build_object('briefing_id', v_id));

  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_academy_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_metrics := public._aac_org_metrics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'readiness_score', v_metrics->'readiness_score',
    'completion_rate_pct', v_metrics->'completion_rate_pct',
    'philosophy', 'Empowering people to work smarter with AI.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_academy_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.academy_settings;
  v_metrics jsonb;
  v_user_id uuid;
begin
  v_tenant_id := public._aac_require_tenant();
  v_user_id := public._aac_auth_user_id();
  v_settings := public._aac_ensure_settings(v_tenant_id);
  perform public._aac_seed_paths(v_tenant_id);
  perform public._aac_seed_courses(v_tenant_id);
  perform public._aac_seed_progress(v_tenant_id);
  perform public._aac_seed_recommendations(v_tenant_id);
  perform public._aac_seed_badges(v_tenant_id);
  perform public._aac_seed_events(v_tenant_id);
  perform public._aac_seed_community(v_tenant_id);
  v_metrics := public._aac_org_metrics(v_tenant_id);
  perform public._aac_trust_explanation(v_tenant_id, (v_metrics->>'readiness_score')::numeric);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'philosophy', 'Empowering people to work smarter with AI.',
    'safety_note', 'The Academy complements the Knowledge Center — structured education for capability development.',
    'academy_enabled', v_settings.academy_enabled,
    'microlearning_enabled', v_settings.microlearning_enabled,
    'role_based_recommendations', v_settings.role_based_recommendations,
    'certification_prep_enabled', v_settings.certification_prep_enabled,
    'readiness_score', v_metrics->'readiness_score',
    'participation_pct', v_metrics->'participation_pct',
    'completion_rate_pct', v_metrics->'completion_rate_pct',
    'courses_completed', v_metrics->'courses_completed',
    'courses_in_progress', v_metrics->'courses_in_progress',
    'certification_progress_pct', v_metrics->'certification_progress_pct',
    'learning_pillars', jsonb_build_array(
      jsonb_build_object('pillar', 'customer_learning', 'label', public._aac_pillar_label('customer_learning')),
      jsonb_build_object('pillar', 'professional_development', 'label', public._aac_pillar_label('professional_development')),
      jsonb_build_object('pillar', 'partner_education', 'label', public._aac_pillar_label('partner_education')),
      jsonb_build_object('pillar', 'executive_education', 'label', public._aac_pillar_label('executive_education'))
    ),
    'access_levels', jsonb_build_array('Public Learning', 'Customer Learning', 'Partner Learning', 'Enterprise Learning', 'Certification Programs'),
    'learning_formats', jsonb_build_array(
      'Video lessons', 'Written guides', 'Interactive tutorials', 'Downloadable playbooks',
      'Templates', 'Case studies', 'Quizzes', 'Assessments', 'Microlearning modules'
    ),
    'learning_paths', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', lp.id, 'path_key', lp.path_key, 'title', lp.title, 'description', lp.description,
        'pillar', lp.pillar, 'pillar_label', public._aac_pillar_label(lp.pillar),
        'access_level', lp.access_level, 'target_roles', lp.target_roles
      ) order by lp.sort_order)
      from public.academy_learning_paths lp where lp.tenant_id = v_tenant_id and lp.status = 'active'
    ), '[]'::jsonb),
    'courses', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'course_key', c.course_key, 'title', c.title, 'description', c.description,
        'format_type', c.format_type, 'content_type', c.content_type,
        'duration_minutes', c.duration_minutes, 'access_level', c.access_level,
        'path_title', lp.title
      ) order by c.duration_minutes)
      from public.academy_courses c
      left join public.academy_learning_paths lp on lp.id = c.path_id
      where c.tenant_id = v_tenant_id and c.status = 'active' limit 20
    ), '[]'::jsonb),
    'course_progress', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cp.id, 'course_title', c.title, 'status', cp.status,
        'progress_pct', cp.progress_pct, 'completed_at', cp.completed_at
      ) order by cp.progress_pct desc)
      from public.academy_course_progress cp
      join public.academy_courses c on c.id = cp.course_id
      where cp.tenant_id = v_tenant_id and (cp.user_id = v_user_id or cp.user_id is null) limit 15
    ), '[]'::jsonb),
    'digital_badges', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'title', b.title, 'badge_type', b.badge_type, 'earned_at', b.earned_at
      ) order by b.earned_at desc)
      from public.academy_digital_badges b
      where b.tenant_id = v_tenant_id and (b.user_id = v_user_id or b.user_id is null) limit 10
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'title', r.title, 'description', r.description,
        'reason', r.reason, 'priority', r.priority, 'target_role', r.target_role, 'status', r.status
      ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.academy_learning_recommendations r
      where r.tenant_id = v_tenant_id and r.status = 'open' limit 10
    ), '[]'::jsonb),
    'organizational_reports', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'report_type', r.report_type, 'title', r.title,
        'summary', r.summary, 'metrics', r.metrics
      ))
      from public.academy_organizational_reports r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'academy_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'event_type', e.event_type, 'title', e.title,
        'description', e.description, 'scheduled_at', e.scheduled_at, 'status', e.status
      ) order by e.scheduled_at asc)
      from public.academy_events e where e.tenant_id = v_tenant_id and e.status = 'scheduled'
    ), '[]'::jsonb),
    'community_resources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cr.id, 'title', cr.title, 'description', cr.description,
        'resource_type', cr.resource_type, 'status', cr.status
      ))
      from public.academy_community_resources cr where cr.tenant_id = v_tenant_id and cr.status = 'published'
    ), '[]'::jsonb),
    'role_based_learning', jsonb_build_array(
      jsonb_build_object('role', 'Support Agent', 'topics', jsonb_build_array('Ticket optimization', 'Knowledge usage', 'Escalation handling')),
      jsonb_build_object('role', 'Administrator', 'topics', jsonb_build_array('Configuration', 'Governance controls', 'User management')),
      jsonb_build_object('role', 'Executive', 'topics', jsonb_build_array('Reporting', 'Strategic oversight', 'Adoption metrics'))
    ),
    'continuous_learning', jsonb_build_array(
      'Monthly learning campaigns', 'Feature update briefings',
      'Annual recertification', 'Learning challenges'
    ),
    'ai_learning_assistant', jsonb_build_object(
      'capabilities', jsonb_build_array(
        'Answer learning questions', 'Recommend resources',
        'Explain concepts', 'Suggest next learning steps'
      ),
      'note', 'Educational support through Aipify Assistant — integrated with Knowledge Center.'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.academy_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'knowledge_center', 'FAQ recommendations and contextual learning links',
      'partner_certification', 'Certification preparation paths',
      'enterprise_deployment', 'Executive and admin education',
      'billing_commercial', 'Entitlement-based access control',
      'learning_engine', 'Distinct from AI adaptive learning at /app/learning'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-academy', 'Aipify Academy', 'Structured education and capability development for Aipify success.', 'authenticated', 38
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-academy' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 13. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_academy_card() to authenticated;
grant execute on function public.get_academy_dashboard() to authenticated;
grant execute on function public.generate_academy_briefing() to authenticated;
grant execute on function public.enroll_academy_course(uuid) to authenticated;
grant execute on function public.complete_academy_course(uuid) to authenticated;
grant execute on function public.dismiss_academy_recommendation(uuid) to authenticated;
