-- Phase 552 — Aipify Knowledge Network, Collective Learning & Organizational Wisdom Engine
-- Preserve organizational wisdom. Feature owner: CUSTOMER APP.
-- Routes: /app/knowledge-network, /app/knowledge-network/lessons, /app/knowledge-network/experience

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_knowledge_network_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  knowledge_network_enabled boolean not null default true,
  lesson_engine_enabled boolean not null default true,
  playbook_engine_enabled boolean not null default true,
  retention_engine_enabled boolean not null default true,
  companion_learning_enabled boolean not null default true,
  meeting_intelligence_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_knowledge_network_settings enable row level security;
revoke all on public.organization_knowledge_network_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Knowledge assets, lessons, experience, playbooks, best practices
-- ---------------------------------------------------------------------------
create table if not exists public.organization_knowledge_network_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  asset_key text not null,
  title text not null,
  asset_type text not null check (
    asset_type in (
      'document', 'policy', 'procedure', 'template', 'playbook', 'guide',
      'report', 'meeting_outcome', 'decision', 'lesson_learned'
    )
  ),
  department_label text not null default '',
  business_pack_key text,
  summary text not null default '' check (char_length(summary) <= 500),
  review_status text not null default 'current' check (
    review_status in ('current', 'review_due', 'archived', 'draft')
  ),
  usage_count integer not null default 0 check (usage_count >= 0),
  author_label text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, asset_key)
);

create index if not exists organization_knowledge_network_assets_org_idx
  on public.organization_knowledge_network_assets (organization_id, asset_type, review_status);

alter table public.organization_knowledge_network_assets enable row level security;
revoke all on public.organization_knowledge_network_assets from authenticated, anon;

create table if not exists public.organization_knowledge_network_lessons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  lesson_key text not null,
  title text not null,
  category text not null default 'operational' check (
    category in (
      'project', 'customer_success', 'supplier', 'security', 'growth_partner',
      'operations', 'finance', 'support', 'hr', 'custom'
    )
  ),
  source_label text not null default '',
  department_label text not null default '',
  project_label text not null default '',
  outcome text not null default '',
  recommendation text not null default '' check (char_length(recommendation) <= 500),
  author_label text not null default '',
  review_status text not null default 'published' check (
    review_status in ('draft', 'review_required', 'published', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, lesson_key)
);

alter table public.organization_knowledge_network_lessons enable row level security;
revoke all on public.organization_knowledge_network_lessons from authenticated, anon;

create table if not exists public.organization_knowledge_network_experience (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  experience_key text not null,
  title text not null,
  experience_type text not null default 'success' check (
    experience_type in ('success', 'failure', 'repeat', 'avoid')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  department_label text not null default '',
  author_label text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, experience_key)
);

alter table public.organization_knowledge_network_experience enable row level security;
revoke all on public.organization_knowledge_network_experience from authenticated, anon;

create table if not exists public.organization_knowledge_network_playbooks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  playbook_key text not null,
  title text not null,
  playbook_type text not null default 'operational' check (
    playbook_type in (
      'operational', 'department', 'business_pack', 'emergency', 'executive'
    )
  ),
  department_label text not null default '',
  business_pack_key text,
  summary text not null default '' check (char_length(summary) <= 500),
  status text not null default 'active' check (
    status in ('draft', 'active', 'review_due', 'archived')
  ),
  usage_count integer not null default 0 check (usage_count >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, playbook_key)
);

alter table public.organization_knowledge_network_playbooks enable row level security;
revoke all on public.organization_knowledge_network_playbooks from authenticated, anon;

create table if not exists public.organization_knowledge_network_best_practices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  practice_key text not null,
  title text not null,
  pattern_type text not null default 'workflow' check (
    pattern_type in (
      'team_performance', 'customer_retention', 'workflow', 'growth_partner',
      'support_process', 'operations', 'custom'
    )
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  department_label text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, practice_key)
);

alter table public.organization_knowledge_network_best_practices enable row level security;
revoke all on public.organization_knowledge_network_best_practices from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Decision knowledge, wisdom score, retention, meetings, companion, departments
-- ---------------------------------------------------------------------------
create table if not exists public.organization_knowledge_network_decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_key text not null,
  title text not null,
  reason_summary text not null default '' check (char_length(reason_summary) <= 500),
  outcome_summary text not null default '' check (char_length(outcome_summary) <= 500),
  lesson_summary text not null default '',
  impact_label text not null default 'moderate',
  future_recommendation text not null default '',
  knowledge_graph_ref text not null default '/app/knowledge-graph',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, decision_key)
);

alter table public.organization_knowledge_network_decisions enable row level security;
revoke all on public.organization_knowledge_network_decisions from authenticated, anon;

create table if not exists public.organization_knowledge_network_wisdom_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  wisdom_score integer not null default 75 check (wisdom_score between 0 and 100),
  wisdom_status text not null default 'strong_learning_culture' check (
    wisdom_status in ('strong_learning_culture', 'knowledge_gaps', 'critical_knowledge_risk')
  ),
  knowledge_usage_pct integer not null default 0 check (knowledge_usage_pct between 0 and 100),
  knowledge_contribution_pct integer not null default 0 check (knowledge_contribution_pct between 0 and 100),
  playbook_usage_pct integer not null default 0 check (playbook_usage_pct between 0 and 100),
  lessons_activity_count integer not null default 0,
  knowledge_sharing_pct integer not null default 0 check (knowledge_sharing_pct between 0 and 100),
  summary text not null default '',
  recorded_at timestamptz not null default now()
);

create index if not exists organization_knowledge_network_wisdom_scores_org_idx
  on public.organization_knowledge_network_wisdom_scores (organization_id, recorded_at desc);

alter table public.organization_knowledge_network_wisdom_scores enable row level security;
revoke all on public.organization_knowledge_network_wisdom_scores from authenticated, anon;

create table if not exists public.organization_knowledge_network_retention_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  retention_key text not null,
  employee_label text not null,
  status text not null default 'pending' check (
    status in ('pending', 'in_capture', 'review', 'stored', 'complete')
  ),
  capture_summary text not null default '',
  due_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, retention_key)
);

alter table public.organization_knowledge_network_retention_queue enable row level security;
revoke all on public.organization_knowledge_network_retention_queue from authenticated, anon;

create table if not exists public.organization_knowledge_network_meeting_intel (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  meeting_key text not null,
  title text not null,
  outcome_summary text not null default '' check (char_length(outcome_summary) <= 500),
  decisions_captured integer not null default 0,
  action_items_captured integer not null default 0,
  lessons_captured integer not null default 0,
  follow_up_status text not null default 'open' check (follow_up_status in ('open', 'complete', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, meeting_key)
);

alter table public.organization_knowledge_network_meeting_intel enable row level security;
revoke all on public.organization_knowledge_network_retention_queue from authenticated, anon;

create table if not exists public.organization_knowledge_network_companion_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'successful_process', 'failed_process', 'common_question',
      'best_practice', 'operational_pattern'
    )
  ),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_knowledge_network_companion_signals enable row level security;
revoke all on public.organization_knowledge_network_companion_signals from authenticated, anon;

create table if not exists public.organization_knowledge_network_department_centers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_key text not null,
  department_label text not null,
  asset_count integer not null default 0,
  lesson_count integer not null default 0,
  playbook_count integer not null default 0,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, department_key)
);

alter table public.organization_knowledge_network_department_centers enable row level security;
revoke all on public.organization_knowledge_network_department_centers from authenticated, anon;

create table if not exists public.organization_knowledge_network_business_pack_contributions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  business_pack_key text not null,
  pack_label text not null,
  assets_count integer not null default 0,
  playbooks_count integer not null default 0,
  lessons_count integer not null default 0,
  best_practices_count integer not null default 0,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, business_pack_key)
);

alter table public.organization_knowledge_network_business_pack_contributions enable row level security;
revoke all on public.organization_knowledge_network_business_pack_contributions from authenticated, anon;

create table if not exists public.organization_knowledge_network_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  context_type text not null default 'customer_record' check (
    context_type in ('customer_record', 'project', 'employee', 'support_case', 'general')
  ),
  recommendation_type text not null check (
    recommendation_type in ('playbook', 'lesson', 'best_practice', 'asset')
  ),
  title text not null,
  target_href text not null default '/app/knowledge-network',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_knowledge_network_recommendations enable row level security;
revoke all on public.organization_knowledge_network_recommendations from authenticated, anon;

create table if not exists public.organization_knowledge_network_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null check (
    event_type in (
      'knowledge_created', 'knowledge_updated', 'lesson_added', 'playbook_published',
      'best_practice_identified', 'knowledge_reviewed', 'knowledge_archived',
      'experience_contributed', 'retention_capture_started', 'wisdom_score_updated'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_knowledge_network_audit_logs_org_idx
  on public.organization_knowledge_network_audit_logs (organization_id, created_at desc);

alter table public.organization_knowledge_network_audit_logs enable row level security;
revoke all on public.organization_knowledge_network_audit_logs from authenticated, anon;

-- Fix mistaken revoke on retention instead of meeting_intel
revoke all on public.organization_knowledge_network_meeting_intel from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._knet552_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._knet552_log(
  p_org_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_knowledge_network_audit_logs (
    organization_id, actor_user_id, event_type, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._knet552_wisdom_status(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 80 then 'strong_learning_culture'
    when p_score >= 55 then 'knowledge_gaps'
    else 'critical_knowledge_risk'
  end;
$$;

create or replace function public._knet552_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_knowledge_network_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._knet552_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_knowledge_network_assets where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_knowledge_network_assets (
    organization_id, asset_key, title, asset_type, department_label, summary, author_label, usage_count
  ) values
    (p_org_id, 'onboarding_procedure', 'Customer Onboarding Procedure', 'procedure', 'Operations', 'Standard onboarding steps for new customers.', 'Operations Team', 42),
    (p_org_id, 'escalation_policy', 'Support Escalation Policy', 'policy', 'Support', 'When and how to escalate support cases.', 'Support Lead', 28),
    (p_org_id, 'quarterly_review_template', 'Quarterly Review Template', 'template', 'Finance', 'Executive quarterly review structure.', 'Finance', 15);

  insert into public.organization_knowledge_network_lessons (
    organization_id, lesson_key, title, category, source_label, department_label, project_label,
    outcome, recommendation, author_label, review_status
  ) values
    (p_org_id, 'project_delay_001', 'Project Delay Lesson', 'project', 'Delivery retrospective', 'Operations', 'Platform rollout',
     'Timeline slipped due to dependency gaps.', 'Front-load dependency mapping before kickoff.', 'Project Manager', 'published'),
    (p_org_id, 'customer_success_001', 'Customer Success Lesson', 'customer_success', 'Account review', 'Support', 'Enterprise pilot',
     'Early check-ins reduced churn risk.', 'Schedule 30-day success review for all enterprise accounts.', 'Success Lead', 'published'),
    (p_org_id, 'security_001', 'Security Lesson', 'security', 'Incident review', 'IT', 'Access review',
     'Unrecognized device flagged before breach.', 'Require device approval for all new locations.', 'Security Admin', 'review_required');

  insert into public.organization_knowledge_network_experience (
    organization_id, experience_key, title, experience_type, summary, department_label, author_label
  ) values
    (p_org_id, 'exp_success_001', 'Weekly team standups improved handoffs', 'success', 'Short structured standups reduced missed tasks.', 'Operations', 'Team Lead'),
    (p_org_id, 'exp_avoid_001', 'Skipping playbook review before launch', 'avoid', 'Launch without playbook review caused rework.', 'Product', 'Program Manager');

  insert into public.organization_knowledge_network_playbooks (
    organization_id, playbook_key, title, playbook_type, department_label, business_pack_key, summary, usage_count
  ) values
    (p_org_id, 'customer_onboarding', 'Customer Onboarding', 'operational', 'Operations', null, 'End-to-end customer onboarding guide.', 56),
    (p_org_id, 'employee_onboarding', 'Employee Onboarding', 'department', 'HR', null, 'New employee onboarding checklist.', 34),
    (p_org_id, 'incident_response', 'Incident Response', 'emergency', 'IT', null, 'Security and operational incident response.', 12),
    (p_org_id, 'property_playbook', 'Property Management Playbook', 'business_pack', 'Operations', 'hosts_pack', 'Hosts Pack property operations guide.', 19);

  insert into public.organization_knowledge_network_best_practices (
    organization_id, practice_key, title, pattern_type, summary, department_label, confidence
  ) values
    (p_org_id, 'retention_best', 'Best Customer Retention Methods', 'customer_retention', 'Proactive success reviews correlate with retention.', 'Support', 'high'),
    (p_org_id, 'support_efficiency', 'Most Efficient Support Processes', 'support_process', 'Template-first replies with knowledge lookup.', 'Support', 'high');

  insert into public.organization_knowledge_network_decisions (
    organization_id, decision_key, title, reason_summary, outcome_summary, lesson_summary, future_recommendation
  ) values
    (p_org_id, 'dec_001', 'Expand to second domain', 'Growth opportunity with verified ownership.',
     'Successful rollout with minimal support impact.', 'Verify domain ownership before marketing launch.',
     'Repeat domain verification checklist for future expansions.');

  insert into public.organization_knowledge_network_retention_queue (
    organization_id, retention_key, employee_label, status, capture_summary
  ) values
    (p_org_id, 'offboard_001', 'Departing Specialist', 'pending', 'Capture support procedures, contacts, and lessons before offboarding.');

  insert into public.organization_knowledge_network_meeting_intel (
    organization_id, meeting_key, title, outcome_summary, decisions_captured, action_items_captured, lessons_captured
  ) values
    (p_org_id, 'meet_q1', 'Q1 Operations Review', 'Approved playbook updates and retention priorities.', 2, 5, 1);

  insert into public.organization_knowledge_network_companion_signals (
    organization_id, signal_type, title, summary
  ) values
    (p_org_id, 'successful_process', 'Template-first support replies', 'High-confidence replies when knowledge assets are referenced first.'),
    (p_org_id, 'common_question', 'How do we onboard enterprise customers?', 'Frequent question — link Customer Onboarding playbook.');

  insert into public.organization_knowledge_network_department_centers (
    organization_id, department_key, department_label, asset_count, lesson_count, playbook_count, summary
  ) values
    (p_org_id, 'finance', 'Finance Knowledge', 1, 0, 0, 'Financial procedures and review templates.'),
    (p_org_id, 'support', 'Support Knowledge', 1, 1, 0, 'Escalation policies and success lessons.'),
    (p_org_id, 'operations', 'Operations Knowledge', 1, 1, 2, 'Onboarding and operational playbooks.'),
    (p_org_id, 'hr', 'HR Knowledge', 0, 0, 1, 'Employee onboarding playbook.');

  insert into public.organization_knowledge_network_business_pack_contributions (
    organization_id, business_pack_key, pack_label, assets_count, playbooks_count, lessons_count, best_practices_count, summary
  ) values
    (p_org_id, 'hosts_pack', 'Hosts Pack', 0, 1, 0, 0, 'Property playbooks and operational guides.'),
    (p_org_id, 'support_pack', 'Support Pack', 1, 0, 1, 1, 'Escalation procedures and support lessons.');

  insert into public.organization_knowledge_network_recommendations (
    organization_id, context_type, recommendation_type, title, target_href, summary
  ) values
    (p_org_id, 'customer_record', 'playbook', 'Suggested: Customer Onboarding', '/app/knowledge-network', 'Open when viewing new customer records.'),
    (p_org_id, 'customer_record', 'lesson', 'Suggested: Customer Success Lesson', '/app/knowledge-network/lessons', 'Enterprise account success pattern.');

  insert into public.organization_knowledge_network_wisdom_scores (
    organization_id, wisdom_score, wisdom_status, knowledge_usage_pct, knowledge_contribution_pct,
    playbook_usage_pct, lessons_activity_count, knowledge_sharing_pct, summary
  ) values (
    p_org_id, 78, 'strong_learning_culture', 72, 64, 58, 3, 61,
    'Strong learning culture with gaps in offboarding capture and security lesson review.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_knowledge_network_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org_name text;
  v_graph jsonb;
begin
  v_org_id := public._knet552_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._knet552_ensure_settings(v_org_id);
  perform public._knet552_seed(v_org_id);

  select o.name into v_org_name from public.organizations o where o.id = v_org_id;

  if to_regprocedure('public.get_organization_knowledge_graph_center(text)') is not null then
    begin
      v_graph := public.get_organization_knowledge_graph_center('decisions');
    exception when others then
      v_graph := '{}'::jsonb;
    end;
  else
    v_graph := '{}'::jsonb;
  end if;

  return jsonb_build_object(
    'found', true,
    'section', coalesce(p_section, 'overview'),
    'principle', 'Organizations lose knowledge when people leave, projects end, and documents disappear. Aipify preserves organizational wisdom.',
    'organization', jsonb_build_object('id', v_org_id, 'name', v_org_name),
    'overview', jsonb_build_object(
      'knowledge_assets', (select count(*) from public.organization_knowledge_network_assets where organization_id = v_org_id),
      'lessons_learned', (select count(*) from public.organization_knowledge_network_lessons where organization_id = v_org_id),
      'playbooks', (select count(*) from public.organization_knowledge_network_playbooks where organization_id = v_org_id and status = 'active'),
      'best_practices', (select count(*) from public.organization_knowledge_network_best_practices where organization_id = v_org_id),
      'experience_entries', (select count(*) from public.organization_knowledge_network_experience where organization_id = v_org_id),
      'wisdom_score', coalesce((select wisdom_score from public.organization_knowledge_network_wisdom_scores where organization_id = v_org_id order by recorded_at desc limit 1), 75),
      'wisdom_status', coalesce((select wisdom_status from public.organization_knowledge_network_wisdom_scores where organization_id = v_org_id order by recorded_at desc limit 1), 'strong_learning_culture'),
      'retention_pending', (select count(*) from public.organization_knowledge_network_retention_queue where organization_id = v_org_id and status in ('pending', 'in_capture')),
      'reviews_due', (select count(*) from public.organization_knowledge_network_assets where organization_id = v_org_id and review_status = 'review_due')
    ),
    'knowledge_assets', coalesce((select jsonb_agg(to_jsonb(a) order by a.usage_count desc) from public.organization_knowledge_network_assets a where a.organization_id = v_org_id), '[]'::jsonb),
    'lessons_learned_engine', coalesce((select jsonb_agg(to_jsonb(l) order by l.updated_at desc) from public.organization_knowledge_network_lessons l where l.organization_id = v_org_id), '[]'::jsonb),
    'experience_library', coalesce((select jsonb_agg(to_jsonb(e) order by e.updated_at desc) from public.organization_knowledge_network_experience e where e.organization_id = v_org_id), '[]'::jsonb),
    'playbook_engine', coalesce((select jsonb_agg(to_jsonb(p) order by p.usage_count desc) from public.organization_knowledge_network_playbooks p where p.organization_id = v_org_id), '[]'::jsonb),
    'best_practice_engine', coalesce((select jsonb_agg(to_jsonb(b) order by b.created_at desc) from public.organization_knowledge_network_best_practices b where b.organization_id = v_org_id), '[]'::jsonb),
    'decision_knowledge_base', coalesce((select jsonb_agg(to_jsonb(d) order by d.updated_at desc) from public.organization_knowledge_network_decisions d where d.organization_id = v_org_id), '[]'::jsonb),
    'knowledge_graph_integration', v_graph,
    'organizational_wisdom_score', coalesce((select to_jsonb(w) from public.organization_knowledge_network_wisdom_scores w where w.organization_id = v_org_id order by w.recorded_at desc limit 1), '{}'::jsonb),
    'knowledge_retention_engine', coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.organization_knowledge_network_retention_queue r where r.organization_id = v_org_id), '[]'::jsonb),
    'meeting_intelligence', coalesce((select jsonb_agg(to_jsonb(m) order by m.created_at desc) from public.organization_knowledge_network_meeting_intel m where m.organization_id = v_org_id), '[]'::jsonb),
    'companion_learning_engine', coalesce((select jsonb_agg(to_jsonb(c) order by c.created_at desc) from public.organization_knowledge_network_companion_signals c where c.organization_id = v_org_id), '[]'::jsonb),
    'department_knowledge_centers', coalesce((select jsonb_agg(to_jsonb(d) order by d.department_label) from public.organization_knowledge_network_department_centers d where d.organization_id = v_org_id), '[]'::jsonb),
    'business_pack_integration', coalesce((select jsonb_agg(to_jsonb(b) order by b.pack_label) from public.organization_knowledge_network_business_pack_contributions b where b.organization_id = v_org_id), '[]'::jsonb),
    'knowledge_recommendations', coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.organization_knowledge_network_recommendations r where r.organization_id = v_org_id), '[]'::jsonb),
    'companion_advisor', jsonb_build_object(
      'advisor_prompts', jsonb_build_array(
        'What lessons apply to this customer situation?',
        'Which playbook should we follow for onboarding?',
        'What best practices helped similar teams?',
        'What knowledge gaps exist in this department?',
        'What should be captured before this employee leaves?'
      )
    ),
    'executive_dashboard', jsonb_build_object(
      'knowledge_growth', (select count(*) from public.organization_knowledge_network_assets where organization_id = v_org_id),
      'knowledge_usage', coalesce((select knowledge_usage_pct from public.organization_knowledge_network_wisdom_scores where organization_id = v_org_id order by recorded_at desc limit 1), 0),
      'top_contributors', (select count(distinct author_label) from public.organization_knowledge_network_lessons where organization_id = v_org_id),
      'knowledge_risks', (select count(*) from public.organization_knowledge_network_retention_queue where organization_id = v_org_id and status = 'pending'),
      'playbook_adoption', coalesce((select playbook_usage_pct from public.organization_knowledge_network_wisdom_scores where organization_id = v_org_id order by recorded_at desc limit 1), 0),
      'companion_learning_signals', (select count(*) from public.organization_knowledge_network_companion_signals where organization_id = v_org_id)
    ),
    'reports', jsonb_build_object(
      'knowledge_created', (select count(*) from public.organization_knowledge_network_assets where organization_id = v_org_id),
      'knowledge_consumption', coalesce((select knowledge_usage_pct from public.organization_knowledge_network_wisdom_scores where organization_id = v_org_id order by recorded_at desc limit 1), 0),
      'knowledge_gaps', (select count(*) from public.organization_knowledge_network_assets where organization_id = v_org_id and review_status = 'review_due'),
      'playbook_usage', (select coalesce(sum(usage_count), 0) from public.organization_knowledge_network_playbooks where organization_id = v_org_id),
      'lessons_count', (select count(*) from public.organization_knowledge_network_lessons where organization_id = v_org_id),
      'department_contributions', jsonb_array_length(coalesce((select jsonb_agg(to_jsonb(d)) from public.organization_knowledge_network_department_centers d where d.organization_id = v_org_id), '[]'::jsonb))
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_knowledge_network_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'knowledge', true, 'playbooks', true, 'lessons', true, 'best_practices', true, 'experience', true
    ),
    'routes', jsonb_build_object(
      'knowledge_network', '/app/knowledge-network',
      'lessons', '/app/knowledge-network/lessons',
      'experience', '/app/knowledge-network/experience',
      'knowledge_graph', '/app/knowledge-graph',
      'learning', '/app/learning'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Actions & mobile
-- ---------------------------------------------------------------------------
create or replace function public.perform_organization_knowledge_network_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  perform public._bde_require_admin();
  v_org_id := public._knet552_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;

  if p_action_type = 'add_lesson' then
    insert into public.organization_knowledge_network_lessons (
      organization_id, lesson_key, title, category, source_label, department_label,
      outcome, recommendation, author_label
    ) values (
      v_org_id,
      coalesce(p_payload->>'lesson_key', 'lesson_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'title', 'New lesson learned'),
      coalesce(p_payload->>'category', 'custom'),
      coalesce(p_payload->>'source_label', ''),
      coalesce(p_payload->>'department_label', ''),
      coalesce(p_payload->>'outcome', ''),
      coalesce(p_payload->>'recommendation', ''),
      coalesce(p_payload->>'author_label', '')
    );
    perform public._knet552_log(v_org_id, 'lesson_added', 'Lesson learned added to Knowledge Network.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'publish_playbook' then
    update public.organization_knowledge_network_playbooks
    set status = 'active', updated_at = now()
    where organization_id = v_org_id and playbook_key = coalesce(p_payload->>'playbook_key', '');
    perform public._knet552_log(v_org_id, 'playbook_published', 'Playbook published to Knowledge Network.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'contribute_experience' then
    insert into public.organization_knowledge_network_experience (
      organization_id, experience_key, title, experience_type, summary, department_label, author_label
    ) values (
      v_org_id,
      coalesce(p_payload->>'experience_key', 'exp_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'title', 'Organizational experience'),
      coalesce(p_payload->>'experience_type', 'success'),
      coalesce(p_payload->>'summary', ''),
      coalesce(p_payload->>'department_label', ''),
      coalesce(p_payload->>'author_label', '')
    );
    perform public._knet552_log(v_org_id, 'experience_contributed', 'Experience contributed to library.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'start_retention_capture' then
    update public.organization_knowledge_network_retention_queue
    set status = 'in_capture', updated_at = now()
    where organization_id = v_org_id and retention_key = coalesce(p_payload->>'retention_key', '');
    perform public._knet552_log(v_org_id, 'retention_capture_started', 'Offboarding knowledge capture started.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'refresh_wisdom_score' then
    insert into public.organization_knowledge_network_wisdom_scores (
      organization_id, wisdom_score, wisdom_status, knowledge_usage_pct, knowledge_contribution_pct,
      playbook_usage_pct, lessons_activity_count, knowledge_sharing_pct, summary
    ) values (
      v_org_id,
      coalesce((p_payload->>'wisdom_score')::int, 78),
      public._knet552_wisdom_status(coalesce((p_payload->>'wisdom_score')::int, 78)),
      coalesce((p_payload->>'knowledge_usage_pct')::int, 72),
      coalesce((p_payload->>'knowledge_contribution_pct')::int, 64),
      coalesce((p_payload->>'playbook_usage_pct')::int, 58),
      coalesce((p_payload->>'lessons_activity_count')::int, 3),
      coalesce((p_payload->>'knowledge_sharing_pct')::int, 61),
      coalesce(p_payload->>'summary', 'Organizational wisdom score refreshed.')
    );
    perform public._knet552_log(v_org_id, 'wisdom_score_updated', 'Organizational wisdom score updated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'mark_reviewed' then
    update public.organization_knowledge_network_assets
    set review_status = 'current', updated_at = now()
    where organization_id = v_org_id and asset_key = coalesce(p_payload->>'asset_key', '');
    perform public._knet552_log(v_org_id, 'knowledge_reviewed', 'Knowledge asset marked as reviewed.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  return jsonb_build_object('ok', false, 'error', 'Unknown action');
end; $$;

create or replace function public.get_organization_knowledge_network_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_knowledge_network_center('mobile');
  return jsonb_build_object(
    'found', v_center->'found',
    'wisdom_score', v_center->'overview'->'wisdom_score',
    'wisdom_status', v_center->'overview'->'wisdom_status',
    'knowledge_assets', v_center->'overview'->'knowledge_assets',
    'playbooks', v_center->'overview'->'playbooks',
    'lessons_learned', v_center->'overview'->'lessons_learned',
    'retention_pending', v_center->'overview'->'retention_pending',
    'routes', v_center->'routes',
    'mobile_access', v_center->'mobile_access'
  );
end; $$;

create or replace function public.get_companion_knowledge_network_advisor_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_knowledge_network_center('companion');
  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'principle', v_center->'principle',
    'advisor', v_center->'companion_advisor',
    'recommendations', v_center->'knowledge_recommendations',
    'wisdom_status', v_center->'overview'->'wisdom_status',
    'routes', v_center->'routes'
  );
end; $$;

grant execute on function public.get_organization_knowledge_network_center(text) to authenticated;
grant execute on function public.perform_organization_knowledge_network_action(text, jsonb) to authenticated;
grant execute on function public.get_organization_knowledge_network_mobile_summary() to authenticated;
grant execute on function public.get_companion_knowledge_network_advisor_context(text) to authenticated;
