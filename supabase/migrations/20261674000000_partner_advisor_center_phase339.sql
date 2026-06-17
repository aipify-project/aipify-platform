-- Phase 339 — Partner Advisor Center
-- Feature owner: GROWTH PARTNER PORTAL. Route: /partner/advisor. Helpers: _gpa339_*

create table if not exists public.growth_partner_portal_advisor_profiles (
  id uuid primary key default gen_random_uuid(),
  advisor_key text not null unique,
  display_name text not null,
  role_title text not null default 'Growth Partner Advisor',
  advisor_type text not null default 'growth_advisor' check (
    advisor_type in (
      'onboarding_advisor', 'sales_advisor', 'growth_advisor',
      'enterprise_advisor', 'strategic_advisor'
    )
  ),
  photo_url text not null default '',
  languages text[] not null default array['en']::text[],
  availability_status text not null default 'available' check (
    availability_status in ('available', 'limited', 'unavailable', 'scheduled')
  ),
  availability_note text not null default '',
  contact_email text not null default '',
  contact_calendar_url text not null default '',
  contact_chat_enabled boolean not null default true,
  partners_supported integer not null default 0,
  avg_partner_growth_pct numeric(5, 2) not null default 0,
  partner_retention_pct numeric(5, 2) not null default 0,
  enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.growth_partner_portal_advisor_profiles enable row level security;
revoke all on public.growth_partner_portal_advisor_profiles from authenticated, anon;

create table if not exists public.growth_partner_portal_advisor_assignments (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  advisor_profile_id uuid not null references public.growth_partner_portal_advisor_profiles (id) on delete cascade,
  assignment_status text not null default 'active' check (
    assignment_status in ('pending', 'active', 'paused', 'completed')
  ),
  is_primary boolean not null default true,
  assigned_at timestamptz not null default now(),
  introduction_scheduled_at timestamptz,
  introduction_completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  unique (partner_org_id, advisor_profile_id)
);
create index if not exists gpp_advisor_assignments_org_idx
  on public.growth_partner_portal_advisor_assignments (partner_org_id, assignment_status);
alter table public.growth_partner_portal_advisor_assignments enable row level security;
revoke all on public.growth_partner_portal_advisor_assignments from authenticated, anon;

create table if not exists public.growth_partner_portal_advisor_messages (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  message_key text not null,
  message_source text not null default 'advisor' check (
    message_source in ('advisor', 'companion', 'system', 'milestone')
  ),
  message_type text not null default 'recommendation' check (
    message_type in (
      'welcome', 'encouragement', 'recommendation', 'warning',
      'milestone', 'training', 'performance', 'strategic'
    )
  ),
  subject text not null default '',
  body text not null default '',
  sender_name text not null default '',
  is_read boolean not null default false,
  direction text not null default 'inbound' check (direction in ('inbound', 'outbound')),
  actor_auth_user_id uuid,
  search_document text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (partner_org_id, message_key)
);
create index if not exists gpp_advisor_messages_org_idx
  on public.growth_partner_portal_advisor_messages (partner_org_id, created_at desc);
alter table public.growth_partner_portal_advisor_messages enable row level security;
revoke all on public.growth_partner_portal_advisor_messages from authenticated, anon;

create table if not exists public.growth_partner_portal_advisor_reviews (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in ('30_day', '60_day', '90_day', 'quarterly', 'annual')
  ),
  scheduled_date date not null,
  review_status text not null default 'scheduled' check (
    review_status in ('scheduled', 'in_progress', 'completed', 'cancelled', 'overdue')
  ),
  advisor_notes text not null default '',
  recommendations jsonb not null default '[]'::jsonb,
  action_items jsonb not null default '[]'::jsonb,
  advisor_profile_id uuid references public.growth_partner_portal_advisor_profiles (id) on delete set null,
  search_document text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_org_id, review_key)
);
create index if not exists gpp_advisor_reviews_org_idx
  on public.growth_partner_portal_advisor_reviews (partner_org_id, scheduled_date desc);
alter table public.growth_partner_portal_advisor_reviews enable row level security;
revoke all on public.growth_partner_portal_advisor_reviews from authenticated, anon;

create table if not exists public.growth_partner_portal_advisor_goals (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  goal_key text not null,
  goal_type text not null check (
    goal_type in ('sales', 'certification', 'opportunity', 'revenue', 'growth')
  ),
  title text not null,
  description text not null default '',
  target_value numeric(12, 2) not null default 0,
  current_value numeric(12, 2) not null default 0,
  goal_status text not null default 'active' check (
    goal_status in ('active', 'completed', 'paused', 'at_risk', 'cancelled')
  ),
  due_date date,
  search_document text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_org_id, goal_key)
);
create index if not exists gpp_advisor_goals_org_idx
  on public.growth_partner_portal_advisor_goals (partner_org_id, goal_status);
alter table public.growth_partner_portal_advisor_goals enable row level security;
revoke all on public.growth_partner_portal_advisor_goals from authenticated, anon;

create table if not exists public.growth_partner_portal_advisor_success_plans (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null unique references public.growth_partner_portal_organizations (id) on delete cascade,
  current_stage text not null default 'foundation',
  next_milestone text not null default '',
  recommended_actions jsonb not null default '[]'::jsonb,
  estimated_time text not null default '',
  expected_outcome text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.growth_partner_portal_advisor_success_plans enable row level security;
revoke all on public.growth_partner_portal_advisor_success_plans from authenticated, anon;

create table if not exists public.growth_partner_portal_advisor_journey_milestones (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  milestone_key text not null,
  milestone_category text not null check (
    milestone_category in (
      'joined', 'certification', 'sales', 'commission', 'customer', 'recognition'
    )
  ),
  title text not null,
  summary text not null default '',
  achieved_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique (partner_org_id, milestone_key)
);
create index if not exists gpp_advisor_journey_org_idx
  on public.growth_partner_portal_advisor_journey_milestones (partner_org_id, achieved_at desc);
alter table public.growth_partner_portal_advisor_journey_milestones enable row level security;
revoke all on public.growth_partner_portal_advisor_journey_milestones from authenticated, anon;

create table if not exists public.growth_partner_portal_advisor_companion_signals (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  signal_key text not null,
  signal_type text not null default 'attention' check (
    signal_type in ('attention', 'milestone', 'risk', 'opportunity', 'celebration')
  ),
  summary text not null,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  resolved boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (partner_org_id, signal_key)
);
alter table public.growth_partner_portal_advisor_companion_signals enable row level security;
revoke all on public.growth_partner_portal_advisor_companion_signals from authenticated, anon;

create table if not exists public.growth_partner_portal_advisor_audit_logs (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  event_type text not null,
  summary text not null default '',
  actor_auth_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists gpp_advisor_audit_org_idx
  on public.growth_partner_portal_advisor_audit_logs (partner_org_id, created_at desc);
alter table public.growth_partner_portal_advisor_audit_logs enable row level security;
revoke all on public.growth_partner_portal_advisor_audit_logs from authenticated, anon;

create or replace function public._gpa339_positioning() returns text language sql immutable as $$
  select 'You have a team behind you — dedicated guidance, recommendations, and support designed to help you grow successfully with Aipify.'; $$;

create or replace function public._gpa339_member_role(p_org_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select coalesce(public._gppf05_member_role(p_org_id), ''); $$;

create or replace function public._gpa339_can_access(p_org_id uuid)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_role text := public._gpa339_member_role(p_org_id);
begin
  if v_role in ('partner_owner', 'owner', 'partner_manager', 'manager') then return true; end if;
  if v_role in ('sales_member', 'sales_representative', 'trainer', 'advisor', 'viewer') then return true; end if;
  return coalesce((public._gpp331_member_permissions(p_org_id)->>'view_advisor')::boolean, true);
end; $$;

create or replace function public._gpa339_can_write(p_org_id uuid)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_role text := public._gpa339_member_role(p_org_id);
begin
  if v_role in ('partner_owner', 'owner', 'partner_manager', 'manager') then return true; end if;
  return false;
end; $$;

create or replace function public._gpa339_log_audit(
  p_org_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_advisor_audit_logs (
    partner_org_id, event_type, summary, actor_auth_user_id, context
  ) values (
    p_org_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._gpa339_seed_advisors()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_advisor_profiles (
    advisor_key, display_name, role_title, advisor_type, languages,
    availability_status, availability_note, contact_email, partners_supported,
    avg_partner_growth_pct, partner_retention_pct
  ) values
    (
      'ADV-SOFIA', 'Sofia Berg', 'Senior Growth Advisor', 'growth_advisor',
      array['en', 'no', 'sv']::text[], 'available',
      'Available weekdays 09:00–17:00 CET', 'advisors@aipify.ai', 42, 28.5, 94.2
    ),
    (
      'ADV-ELENA', 'Elena Novak', 'Enterprise Partner Advisor', 'enterprise_advisor',
      array['en', 'pl', 'de']::text[], 'limited',
      'Limited availability — book ahead', 'enterprise-advisors@aipify.ai', 18, 35.0, 97.1
    ),
    (
      'ADV-JAMES', 'James O''Connor', 'Onboarding Advisor', 'onboarding_advisor',
      array['en']::text[], 'available',
      'Dedicated onboarding support', 'onboarding@aipify.ai', 65, 22.0, 91.5
    )
  on conflict (advisor_key) do nothing;
end; $$;

create or replace function public._gpa339_compute_health(p_org_id uuid)
returns table(label text, pct integer, readiness_pct integer) language plpgsql stable security definer set search_path = public as $$
declare
  v_score integer := 55;
  v_readiness integer := 50;
  v_label text := 'needs_attention';
  v_cert_count integer := 0;
  v_opp_active integer := 0;
  v_opp_won integer := 0;
  v_days_inactive integer := 0;
  v_onboarding_pct integer := 0;
begin
  select coalesce(count(*) filter (where a.certification_status = 'earned'), 0)
  into v_cert_count
  from public.growth_partner_portal_academy_certification_awards a
  where a.partner_org_id = p_org_id;

  select count(*) filter (where o.status = 'active'),
         count(*) filter (where o.stage_key = 'closed_won')
  into v_opp_active, v_opp_won
  from public.growth_partner_portal_opportunities o
  where o.partner_org_id = p_org_id;

  select coalesce(
    extract(day from (now() - max(m.created_at)))::int, 30
  ) into v_days_inactive
  from public.growth_partner_portal_advisor_messages m
  where m.partner_org_id = p_org_id;

  select coalesce(o.completion_pct, 0) into v_onboarding_pct
  from public.growth_partner_portal_onboarding o
  where o.partner_org_id = p_org_id;
  v_onboarding_pct := coalesce(v_onboarding_pct, 0);

  v_score := 40;
  v_readiness := 35;
  if v_cert_count >= 1 then v_score := v_score + 15; v_readiness := v_readiness + 20; end if;
  if v_cert_count >= 2 then v_score := v_score + 10; v_readiness := v_readiness + 15; end if;
  if v_opp_active >= 1 then v_score := v_score + 10; v_readiness := v_readiness + 10; end if;
  if v_opp_won >= 1 then v_score := v_score + 20; v_readiness := v_readiness + 25; end if;
  if v_onboarding_pct >= 80 then v_score := v_score + 10; v_readiness := v_readiness + 15; end if;
  if v_days_inactive <= 7 then v_score := v_score + 10;
  elsif v_days_inactive >= 14 then v_score := v_score - 15; v_readiness := v_readiness - 10;
  end if;

  v_score := greatest(0, least(100, v_score));
  v_readiness := greatest(0, least(100, v_readiness));

  if v_score >= 85 then v_label := 'excellent';
  elsif v_score >= 65 then v_label := 'healthy';
  elsif v_score >= 40 then v_label := 'needs_attention';
  else v_label := 'at_risk';
  end if;

  label := v_label;
  pct := v_score;
  readiness_pct := v_readiness;
  return next;
end; $$;

create or replace function public._gpa339_advisor_json(p_advisor public.growth_partner_portal_advisor_profiles)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_advisor.id,
    'advisor_key', p_advisor.advisor_key,
    'display_name', p_advisor.display_name,
    'role_title', p_advisor.role_title,
    'advisor_type', p_advisor.advisor_type,
    'photo_url', p_advisor.photo_url,
    'languages', to_jsonb(p_advisor.languages),
    'availability_status', p_advisor.availability_status,
    'availability_note', p_advisor.availability_note,
    'contact_email', p_advisor.contact_email,
    'contact_calendar_url', p_advisor.contact_calendar_url,
    'contact_chat_enabled', p_advisor.contact_chat_enabled,
    'partners_supported', p_advisor.partners_supported,
    'avg_partner_growth_pct', p_advisor.avg_partner_growth_pct,
    'partner_retention_pct', p_advisor.partner_retention_pct
  ); $$;

create or replace function public._gpa339_recommendations(p_org_id uuid, p_health text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_recs jsonb := '[]'::jsonb;
  v_cert_count integer := 0;
  v_opp_count integer := 0;
begin
  select count(*) into v_cert_count
  from public.growth_partner_portal_academy_certification_awards a
  where a.partner_org_id = p_org_id and a.certification_status = 'earned';

  select count(*) into v_opp_count
  from public.growth_partner_portal_opportunities o
  where o.partner_org_id = p_org_id and o.status = 'active';

  if v_cert_count = 0 then
    v_recs := v_recs || jsonb_build_array('Complete your Foundation Certification.');
  end if;
  if v_opp_count = 0 then
    v_recs := v_recs || jsonb_build_array('Schedule your first customer demo.');
  elsif v_opp_count >= 3 then
    v_recs := v_recs || jsonb_build_array(format('Follow up on your %s most active opportunities.', least(v_opp_count, 3)));
  end if;
  v_recs := v_recs || jsonb_build_array('Review the new Enterprise Sales Pack.');
  if p_health in ('needs_attention', 'at_risk') then
    v_recs := v_recs || jsonb_build_array('Schedule a check-in with your advisor this week.');
  end if;
  return v_recs;
end; $$;

create or replace function public._gpa339_advisor_insights(p_org_id uuid, p_health text, p_readiness integer)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_insights jsonb := '[]'::jsonb;
  v_opp_won integer := 0;
  v_opp_active integer := 0;
  v_cert_count integer := 0;
begin
  select count(*) filter (where stage_key = 'closed_won'),
         count(*) filter (where status = 'active')
  into v_opp_won, v_opp_active
  from public.growth_partner_portal_opportunities where partner_org_id = p_org_id;

  select count(*) into v_cert_count
  from public.growth_partner_portal_academy_certification_awards
  where partner_org_id = p_org_id and certification_status = 'earned';

  if v_opp_won = 0 and v_opp_active >= 1 then
    v_insights := v_insights || jsonb_build_array('This partner is close to first sale.');
  end if;
  if p_health in ('needs_attention', 'at_risk') then
    v_insights := v_insights || jsonb_build_array('This partner may need onboarding support.');
  end if;
  if p_readiness >= 75 then
    v_insights := v_insights || jsonb_build_array('This partner is ready for enterprise opportunities.');
  end if;
  if v_cert_count >= 2 and v_opp_active >= 2 then
    v_insights := v_insights || jsonb_build_array('This partner is progressing rapidly.');
  end if;
  return v_insights;
end; $$;

create or replace function public._gpa339_seed_partner(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_advisor_id uuid;
  v_joined timestamptz;
begin
  perform public._gpa339_seed_advisors();

  select id into v_advisor_id
  from public.growth_partner_portal_advisor_profiles
  where advisor_key = 'ADV-SOFIA' limit 1;

  insert into public.growth_partner_portal_advisor_assignments (
    partner_org_id, advisor_profile_id, assignment_status, is_primary
  ) values (p_org_id, v_advisor_id, 'active', true)
  on conflict (partner_org_id, advisor_profile_id) do nothing;

  select created_at into v_joined
  from public.growth_partner_portal_organizations where id = p_org_id;

  insert into public.growth_partner_portal_advisor_success_plans (
    partner_org_id, current_stage, next_milestone, recommended_actions, estimated_time, expected_outcome
  ) values (
    p_org_id,
    'foundation',
    'First qualified opportunity',
    jsonb_build_array(
      'Complete Foundation Certification',
      'Register three active opportunities',
      'Schedule advisor introduction call'
    ),
    '4–6 weeks',
    'Confident pipeline with advisor-supported next steps'
  ) on conflict (partner_org_id) do nothing;

  insert into public.growth_partner_portal_advisor_journey_milestones (
    partner_org_id, milestone_key, milestone_category, title, summary, achieved_at
  ) values
    (p_org_id, 'joined', 'joined', 'Joined Growth Partner Program', 'Welcome to the Aipify partner community.', coalesce(v_joined, now()))
  on conflict (partner_org_id, milestone_key) do nothing;

  if not exists (select 1 from public.growth_partner_portal_advisor_messages where partner_org_id = p_org_id limit 1) then
    insert into public.growth_partner_portal_advisor_messages (
      partner_org_id, message_key, message_source, message_type, subject, body, sender_name, search_document
    ) values
      (
        p_org_id, 'MSG-WELCOME', 'advisor', 'welcome',
        'Welcome to your Advisor Center',
        'I am here to help you build a successful business with Aipify. Let us schedule an introduction when you are ready.',
        'Sofia Berg', 'welcome advisor introduction'
      ),
      (
        p_org_id, 'MSG-COMPANION-001', 'companion', 'recommendation',
        'Foundation Certification recommended',
        'Completing your Foundation Certification strengthens credibility with prospects.',
        'Aipify', 'companion certification recommendation'
      ),
      (
        p_org_id, 'MSG-SYSTEM-001', 'system', 'training',
        'Advisor Center is ready',
        'Your Advisor Center is active. Explore recommendations, reviews, and your success plan.',
        'Aipify', 'system advisor center ready'
      );
  end if;

  if not exists (select 1 from public.growth_partner_portal_advisor_reviews where partner_org_id = p_org_id limit 1) then
    insert into public.growth_partner_portal_advisor_reviews (
      partner_org_id, review_key, review_type, scheduled_date, review_status,
      advisor_notes, recommendations, action_items, advisor_profile_id, search_document
    ) values
      (
        p_org_id, 'REV-30', '30_day', (current_date + 14), 'scheduled',
        '', '[]'::jsonb, '[]'::jsonb, v_advisor_id, '30 day review introduction'
      ),
      (
        p_org_id, 'REV-90', '90_day', (current_date + 75), 'scheduled',
        '', '[]'::jsonb, '[]'::jsonb, v_advisor_id, '90 day review quarterly'
      );
  end if;

  if not exists (select 1 from public.growth_partner_portal_advisor_goals where partner_org_id = p_org_id limit 1) then
    insert into public.growth_partner_portal_advisor_goals (
      partner_org_id, goal_key, goal_type, title, description, target_value, current_value, goal_status, due_date, search_document
    ) values
      (p_org_id, 'GOAL-CERT', 'certification', 'Earn Foundation Certification', 'Complete academy foundation track.', 1, 0, 'active', current_date + 30, 'foundation certification goal'),
      (p_org_id, 'GOAL-OPP', 'opportunity', 'Register 3 active opportunities', 'Build initial pipeline.', 3, 0, 'active', current_date + 45, 'opportunity pipeline goal'),
      (p_org_id, 'GOAL-REV', 'revenue', 'First closed-won customer', 'Convert first opportunity to customer.', 1, 0, 'active', current_date + 90, 'revenue first sale goal');
  end if;

  insert into public.growth_partner_portal_advisor_companion_signals (
    partner_org_id, signal_key, signal_type, summary, priority
  ) values
    (p_org_id, 'SIG-CERT', 'opportunity', 'A partner completed all certifications.', 'normal')
  on conflict (partner_org_id, signal_key) do nothing;
end; $$;

create or replace function public.get_partner_advisor(
  p_advisor_type text default null,
  p_health_score text default null,
  p_performance text default null,
  p_country text default null,
  p_partner_tier text default null,
  p_goal_status text default null,
  p_search text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_role text;
  v_org public.growth_partner_portal_organizations;
  v_profile public.growth_partner_portal_profiles;
  v_advisor public.growth_partner_portal_advisor_profiles;
  v_assignment public.growth_partner_portal_advisor_assignments;
  v_health record;
  v_plan public.growth_partner_portal_advisor_success_plans;
  v_has_assignment boolean := false;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  if not public._gpa339_can_access(v_org_id) then
    return jsonb_build_object('has_access', false, 'access_denied', true);
  end if;

  perform public._gpp331_provision(v_org_id);
  perform public._gpa339_seed_partner(v_org_id);
  v_role := public._gpa339_member_role(v_org_id);

  select * into v_org from public.growth_partner_portal_organizations where id = v_org_id;
  select * into v_profile from public.growth_partner_portal_profiles where partner_org_id = v_org_id limit 1;

  select a.* into v_assignment
  from public.growth_partner_portal_advisor_assignments a
  where a.partner_org_id = v_org_id and a.is_primary = true and a.assignment_status = 'active'
  limit 1;

  if found then
    select * into v_advisor
    from public.growth_partner_portal_advisor_profiles ap
    where ap.id = v_assignment.advisor_profile_id;
    v_has_assignment := found;
  end if;
  select * into v_health from public._gpa339_compute_health(v_org_id);
  select * into v_plan from public.growth_partner_portal_advisor_success_plans where partner_org_id = v_org_id;

  if p_health_score is not null and v_health.label <> p_health_score then
    return jsonb_build_object(
      'has_access', true,
      'filtered_out', true,
      'health_score_label', v_health.label
    );
  end if;

  return jsonb_build_object(
    'has_access', true,
    'can_write', public._gpa339_can_write(v_org_id),
    'team_role', v_role,
    'positioning', public._gpa339_positioning(),
    'partner_info', jsonb_build_object(
      'org_name', coalesce(v_org.org_name, ''),
      'partner_type', coalesce(v_org.partner_type, 'growth_partner'),
      'country_code', coalesce(v_profile.country_code, ''),
      'joined_date', coalesce(v_org.created_at::text, ''),
      'contact_email', coalesce(v_profile.contact_email, ''),
      'company_name', coalesce(v_profile.company_name, '')
    ),
    'has_advisor', v_has_assignment,
    'advisor', case when v_has_assignment then public._gpa339_advisor_json(v_advisor) else null end,
    'assignment', case when v_has_assignment then jsonb_build_object(
      'status', v_assignment.assignment_status,
      'introduction_scheduled_at', coalesce(v_assignment.introduction_scheduled_at::text, ''),
      'introduction_completed_at', coalesce(v_assignment.introduction_completed_at::text, '')
    ) else null end,
    'health_score_label', v_health.label,
    'health_score_pct', v_health.pct,
    'readiness_score_pct', v_health.readiness_pct,
    'recommendations', public._gpa339_recommendations(v_org_id, v_health.label),
    'advisor_insights', public._gpa339_advisor_insights(v_org_id, v_health.label, v_health.readiness_pct),
    'upcoming_reviews', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_type', r.review_type, 'scheduled_date', r.scheduled_date::text,
        'review_status', r.review_status
      ) order by r.scheduled_date asc), '[]'::jsonb)
      from public.growth_partner_portal_advisor_reviews r
      where r.partner_org_id = v_org_id and r.review_status in ('scheduled', 'in_progress', 'overdue')
        and (p_search is null or r.search_document like '%' || lower(trim(p_search)) || '%')
    ),
    'recent_messages', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', m.id, 'message_source', m.message_source, 'message_type', m.message_type,
        'subject', m.subject, 'body', m.body, 'sender_name', m.sender_name,
        'is_read', m.is_read, 'created_at', m.created_at::text
      ) order by m.created_at desc), '[]'::jsonb)
      from (
        select * from public.growth_partner_portal_advisor_messages
        where partner_org_id = v_org_id
          and (p_search is null or search_document like '%' || lower(trim(p_search)) || '%')
        order by created_at desc limit 5
      ) m
    ),
    'success_plan', case when v_plan.id is not null then jsonb_build_object(
      'current_stage', v_plan.current_stage,
      'next_milestone', v_plan.next_milestone,
      'recommended_actions', v_plan.recommended_actions,
      'estimated_time', v_plan.estimated_time,
      'expected_outcome', v_plan.expected_outcome
    ) else null end,
    'journey', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', j.id, 'milestone_category', j.milestone_category,
        'title', j.title, 'summary', j.summary, 'achieved_at', j.achieved_at::text
      ) order by j.achieved_at desc), '[]'::jsonb)
      from public.growth_partner_portal_advisor_journey_milestones j
      where j.partner_org_id = v_org_id
    ),
    'companion_signals', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', s.id, 'signal_type', s.signal_type, 'summary', s.summary,
        'priority', s.priority, 'created_at', s.created_at::text
      ) order by s.created_at desc), '[]'::jsonb)
      from public.growth_partner_portal_advisor_companion_signals s
      where s.partner_org_id = v_org_id and s.resolved = false
    ),
    'empty_state', case when not v_has_assignment then jsonb_build_object(
      'title', 'Your Advisor Center is ready.',
      'message', 'Aipify Advisors help Growth Partners build successful businesses and achieve long-term success.',
      'cta', 'Schedule Introduction'
    ) else null end
  );
end; $$;

create or replace function public.get_partner_advisor_reviews(
  p_review_type text default null,
  p_review_status text default null,
  p_search text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpa339_can_access(v_org_id) then
    return jsonb_build_object('has_access', false, 'access_denied', true);
  end if;
  perform public._gpa339_seed_partner(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'can_write', public._gpa339_can_write(v_org_id),
    'reviews', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', r.id,
        'review_key', r.review_key,
        'review_type', r.review_type,
        'scheduled_date', r.scheduled_date::text,
        'review_status', r.review_status,
        'advisor_notes', r.advisor_notes,
        'recommendations', r.recommendations,
        'action_items', r.action_items,
        'updated_at', r.updated_at::text
      ) order by r.scheduled_date desc), '[]'::jsonb)
      from public.growth_partner_portal_advisor_reviews r
      where r.partner_org_id = v_org_id
        and (p_review_type is null or r.review_type = p_review_type)
        and (p_review_status is null or r.review_status = p_review_status)
        and (p_search is null or r.search_document like '%' || lower(trim(p_search)) || '%')
    )
  );
end; $$;

create or replace function public.get_partner_advisor_messages(
  p_message_source text default null,
  p_message_type text default null,
  p_search text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpa339_can_access(v_org_id) then
    return jsonb_build_object('has_access', false, 'access_denied', true);
  end if;
  perform public._gpa339_seed_partner(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'can_write', public._gpa339_can_write(v_org_id),
    'messages', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', m.id,
        'message_key', m.message_key,
        'message_source', m.message_source,
        'message_type', m.message_type,
        'subject', m.subject,
        'body', m.body,
        'sender_name', m.sender_name,
        'direction', m.direction,
        'is_read', m.is_read,
        'created_at', m.created_at::text
      ) order by m.created_at desc), '[]'::jsonb)
      from public.growth_partner_portal_advisor_messages m
      where m.partner_org_id = v_org_id
        and (p_message_source is null or m.message_source = p_message_source)
        and (p_message_type is null or m.message_type = p_message_type)
        and (p_search is null or m.search_document like '%' || lower(trim(p_search)) || '%')
    )
  );
end; $$;

create or replace function public.get_partner_advisor_goals(
  p_goal_type text default null,
  p_goal_status text default null,
  p_search text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpa339_can_access(v_org_id) then
    return jsonb_build_object('has_access', false, 'access_denied', true);
  end if;
  perform public._gpa339_seed_partner(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'can_write', public._gpa339_can_write(v_org_id),
    'goals', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', g.id,
        'goal_key', g.goal_key,
        'goal_type', g.goal_type,
        'title', g.title,
        'description', g.description,
        'target_value', g.target_value,
        'current_value', g.current_value,
        'goal_status', g.goal_status,
        'due_date', coalesce(g.due_date::text, ''),
        'updated_at', g.updated_at::text
      ) order by g.due_date nulls last), '[]'::jsonb)
      from public.growth_partner_portal_advisor_goals g
      where g.partner_org_id = v_org_id
        and (p_goal_type is null or g.goal_type = p_goal_type)
        and (p_goal_status is null or g.goal_status = p_goal_status)
        and (p_search is null or g.search_document like '%' || lower(trim(p_search)) || '%')
    )
  );
end; $$;

create or replace function public.post_partner_advisor_message(
  p_subject text,
  p_body text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_key text;
  v_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('ok', false, 'error', 'unauthorized'); end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpa339_can_write(v_org_id) then
    return jsonb_build_object('ok', false, 'error', 'access_denied');
  end if;
  if coalesce(trim(p_body), '') = '' then
    return jsonb_build_object('ok', false, 'error', 'body_required');
  end if;

  v_key := 'MSG-OUT-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  insert into public.growth_partner_portal_advisor_messages (
    partner_org_id, message_key, message_source, message_type, subject, body,
    sender_name, direction, actor_auth_user_id, search_document
  ) values (
    v_org_id, v_key, 'advisor', 'strategic',
    coalesce(nullif(trim(p_subject), ''), 'Message to advisor'),
    trim(p_body), 'Partner', 'outbound', auth.uid(),
    lower(coalesce(p_subject, '') || ' ' || p_body)
  ) returning id into v_id;

  perform public._gpa339_log_audit(v_org_id, 'message_sent', 'Partner sent message to advisor', jsonb_build_object('message_id', v_id));

  return jsonb_build_object('ok', true, 'message_id', v_id);
end; $$;

create or replace function public.schedule_partner_advisor_introduction()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_assignment_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('ok', false, 'error', 'unauthorized'); end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpa339_can_write(v_org_id) then
    return jsonb_build_object('ok', false, 'error', 'access_denied');
  end if;

  perform public._gpa339_seed_partner(v_org_id);

  update public.growth_partner_portal_advisor_assignments set
    introduction_scheduled_at = now() + interval '3 days',
    assignment_status = 'active'
  where partner_org_id = v_org_id and is_primary = true
  returning id into v_assignment_id;

  insert into public.growth_partner_portal_advisor_messages (
    partner_org_id, message_key, message_source, message_type, subject, body, sender_name, search_document
  ) values (
    v_org_id,
    'MSG-INTRO-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
    'system', 'milestone',
    'Introduction scheduled',
    'Your advisor introduction has been scheduled. You will receive calendar details shortly.',
    'Aipify', 'introduction scheduled milestone'
  ) on conflict do nothing;

  perform public._gpa339_log_audit(v_org_id, 'introduction_scheduled', 'Partner scheduled advisor introduction');

  return jsonb_build_object('ok', true, 'assignment_id', v_assignment_id);
end; $$;

create or replace function public.create_partner_advisor_review(
  p_review_type text,
  p_scheduled_date date default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_key text;
  v_id uuid;
  v_advisor_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('ok', false, 'error', 'unauthorized'); end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpa339_can_write(v_org_id) then
    return jsonb_build_object('ok', false, 'error', 'access_denied');
  end if;
  if p_review_type not in ('30_day', '60_day', '90_day', 'quarterly', 'annual') then
    return jsonb_build_object('ok', false, 'error', 'invalid_review_type');
  end if;

  select advisor_profile_id into v_advisor_id
  from public.growth_partner_portal_advisor_assignments
  where partner_org_id = v_org_id and is_primary = true limit 1;

  v_key := 'REV-REQ-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
  insert into public.growth_partner_portal_advisor_reviews (
    partner_org_id, review_key, review_type, scheduled_date, review_status,
    advisor_profile_id, search_document
  ) values (
    v_org_id, v_key, p_review_type,
    coalesce(p_scheduled_date, current_date + 14),
    'scheduled', v_advisor_id,
    lower(p_review_type || ' review request')
  ) returning id into v_id;

  perform public._gpa339_log_audit(v_org_id, 'review_requested', 'Partner requested advisor review', jsonb_build_object('review_id', v_id, 'review_type', p_review_type));

  return jsonb_build_object('ok', true, 'review_id', v_id);
end; $$;

create or replace function public.get_platform_partner_advisor_overview()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_advisor_count integer;
  v_assignment_count integer;
  v_at_risk integer;
begin
  if not public.is_platform_admin() then
    return jsonb_build_object('has_access', false);
  end if;

  select count(*) into v_advisor_count from public.growth_partner_portal_advisor_profiles where enabled;
  select count(*) into v_assignment_count from public.growth_partner_portal_advisor_assignments where assignment_status = 'active';

  return jsonb_build_object(
    'has_access', true,
    'privacy_note', 'Aggregate advisor program metrics only — no partner message content.',
    'advisors_enabled', v_advisor_count,
    'active_assignments', v_assignment_count,
    'reviews_scheduled', (
      select count(*) from public.growth_partner_portal_advisor_reviews where review_status = 'scheduled'
    ),
    'messages_last_30_days', (
      select count(*) from public.growth_partner_portal_advisor_messages
      where created_at >= now() - interval '30 days'
    )
  );
end; $$;

grant execute on function public.get_partner_advisor(text, text, text, text, text, text, text) to authenticated;
grant execute on function public.get_partner_advisor_reviews(text, text, text) to authenticated;
grant execute on function public.get_partner_advisor_messages(text, text, text) to authenticated;
grant execute on function public.get_partner_advisor_goals(text, text, text) to authenticated;
grant execute on function public.post_partner_advisor_message(text, text) to authenticated;
grant execute on function public.schedule_partner_advisor_introduction() to authenticated;
grant execute on function public.create_partner_advisor_review(text, date) to authenticated;
grant execute on function public.get_platform_partner_advisor_overview() to authenticated;
