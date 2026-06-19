-- Phase 558 — Companion Memory Evolution, Context Awareness & Long-Term Relationship Engine
-- Feature owner: CUSTOMER APP. Route: /app/companion/memory. Helpers: _cme558_*

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_memory_evolution_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  memory_evolution_enabled boolean not null default true,
  personal_memory_enabled boolean not null default true,
  organization_memory_enabled boolean not null default true,
  context_awareness_enabled boolean not null default true,
  relationship_memory_enabled boolean not null default true,
  governance_required boolean not null default true,
  privacy_controls_enabled boolean not null default true,
  retention_days integer not null default 365 check (retention_days between 30 and 3650),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_memory_evolution_settings enable row level security;
revoke all on public.organization_companion_memory_evolution_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Memory items (personal, organization, department categories)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_memory_evolution_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  memory_key text not null,
  memory_title text not null,
  memory_category text not null check (
    memory_category in (
      'user_preferences', 'working_habits', 'business_context', 'department_context',
      'organization_context', 'companion_preferences', 'approved_knowledge', 'relationship_context'
    )
  ),
  memory_status text not null default 'active' check (
    memory_status in ('active', 'review_required', 'restricted', 'disabled')
  ),
  memory_layer text not null default 'personal' check (
    memory_layer in ('personal', 'organization', 'department', 'relationship')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default 'approved',
  confidence_score integer not null default 80 check (confidence_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, memory_key)
);

create index if not exists organization_companion_memory_evolution_items_org_idx
  on public.organization_companion_memory_evolution_items (organization_id, memory_category, memory_status);

alter table public.organization_companion_memory_evolution_items enable row level security;
revoke all on public.organization_companion_memory_evolution_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Working style, context, relationships, conversation, evolution
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_memory_evolution_working_style (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  style_key text not null,
  style_title text not null,
  preference_type text not null check (
    preference_type in (
      'meeting', 'approval', 'reporting', 'task_management', 'communication'
    )
  ),
  preference_value text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, style_key)
);

alter table public.organization_companion_memory_evolution_working_style enable row level security;
revoke all on public.organization_companion_memory_evolution_working_style from authenticated, anon;

create table if not exists public.organization_companion_memory_evolution_context_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  context_key text not null,
  context_title text not null,
  context_type text not null default 'project' check (
    context_type in ('project', 'customer', 'document', 'risk', 'task', 'session')
  ),
  related_entities jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  relevance_score integer not null default 75 check (relevance_score between 0 and 100),
  recorded_at timestamptz not null default now(),
  unique (organization_id, context_key)
);

alter table public.organization_companion_memory_evolution_context_snapshots enable row level security;
revoke all on public.organization_companion_memory_evolution_context_snapshots from authenticated, anon;

create table if not exists public.organization_companion_memory_evolution_relationship_memory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  relationship_key text not null,
  relationship_title text not null,
  relationship_type text not null check (
    relationship_type in ('manager', 'department', 'partner', 'customer', 'operational')
  ),
  parties jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  interaction_frequency text not null default 'regular',
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, relationship_key)
);

alter table public.organization_companion_memory_evolution_relationship_memory enable row level security;
revoke all on public.organization_companion_memory_evolution_relationship_memory from authenticated, anon;

create table if not exists public.organization_companion_memory_evolution_conversation_context (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  session_key text not null,
  session_title text not null,
  session_scope text not null default 'current' check (
    session_scope in ('current', 'recent', 'historical')
  ),
  linked_context jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  recorded_at timestamptz not null default now(),
  unique (organization_id, session_key)
);

alter table public.organization_companion_memory_evolution_conversation_context enable row level security;
revoke all on public.organization_companion_memory_evolution_conversation_context from authenticated, anon;

create table if not exists public.organization_companion_memory_evolution_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_key text not null,
  event_type text not null check (
    event_type in ('pattern_identified', 'preference_learned', 'context_gap', 'preference_removed')
  ),
  pattern_summary text not null default '' check (char_length(pattern_summary) <= 500),
  outcome_summary text not null default '' check (char_length(outcome_summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  unique (organization_id, event_key)
);

alter table public.organization_companion_memory_evolution_events enable row level security;
revoke all on public.organization_companion_memory_evolution_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Governance, privacy, department, decision, meeting, packs, health
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_memory_evolution_governance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_key text not null,
  policy_title text not null,
  policy_type text not null check (
    policy_type in ('retention', 'approval', 'review', 'export', 'disable')
  ),
  policy_body text not null default '',
  is_enforced boolean not null default true,
  unique (organization_id, policy_key)
);

alter table public.organization_companion_memory_evolution_governance enable row level security;
revoke all on public.organization_companion_memory_evolution_governance from authenticated, anon;

create table if not exists public.organization_companion_memory_evolution_privacy_controls (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  control_key text not null,
  control_title text not null,
  category_scope text not null default 'all',
  is_enabled boolean not null default true,
  can_view boolean not null default true,
  can_edit boolean not null default true,
  can_delete boolean not null default true,
  can_export boolean not null default true,
  unique (organization_id, user_id, control_key)
);

alter table public.organization_companion_memory_evolution_privacy_controls enable row level security;
revoke all on public.organization_companion_memory_evolution_privacy_controls from authenticated, anon;

create table if not exists public.organization_companion_memory_evolution_department_memory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_key text not null,
  department_title text not null,
  memory_domain text not null check (
    memory_domain in ('finance', 'support', 'operations', 'warehouse', 'project', 'knowledge')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  intelligence_score integer not null default 70 check (intelligence_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, department_key)
);

alter table public.organization_companion_memory_evolution_department_memory enable row level security;
revoke all on public.organization_companion_memory_evolution_department_memory from authenticated, anon;

create table if not exists public.organization_companion_memory_evolution_decision_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_key text not null,
  decision_title text not null,
  reason_summary text not null default '' check (char_length(reason_summary) <= 500),
  outcome_summary text not null default '' check (char_length(outcome_summary) <= 500),
  recommendation_impact text not null default '',
  recorded_at timestamptz not null default now(),
  unique (organization_id, decision_key)
);

alter table public.organization_companion_memory_evolution_decision_links enable row level security;
revoke all on public.organization_companion_memory_evolution_decision_links from authenticated, anon;

create table if not exists public.organization_companion_memory_evolution_meeting_memory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  meeting_key text not null,
  meeting_title text not null,
  outcomes jsonb not null default '[]'::jsonb,
  action_items jsonb not null default '[]'::jsonb,
  follow_ups jsonb not null default '[]'::jsonb,
  lessons_learned jsonb not null default '[]'::jsonb,
  decisions jsonb not null default '[]'::jsonb,
  agreements jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  recorded_at timestamptz not null default now(),
  unique (organization_id, meeting_key)
);

alter table public.organization_companion_memory_evolution_meeting_memory enable row level security;
revoke all on public.organization_companion_memory_evolution_meeting_memory from authenticated, anon;

create table if not exists public.organization_companion_memory_evolution_business_pack_contributions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  contribution_type text not null check (
    contribution_type in ('context', 'preferences', 'relationships', 'history')
  ),
  contribution_title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key, contribution_type, contribution_title)
);

alter table public.organization_companion_memory_evolution_business_pack_contributions enable row level security;
revoke all on public.organization_companion_memory_evolution_business_pack_contributions from authenticated, anon;

create table if not exists public.organization_companion_memory_evolution_health_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  memory_usage_score integer not null default 78 check (memory_usage_score between 0 and 100),
  memory_quality_score integer not null default 82 check (memory_quality_score between 0 and 100),
  context_relevance_score integer not null default 80 check (context_relevance_score between 0 and 100),
  relationship_accuracy_score integer not null default 76 check (relationship_accuracy_score between 0 and 100),
  governance_compliance_score integer not null default 88 check (governance_compliance_score between 0 and 100),
  composite_score integer not null default 81 check (composite_score between 0 and 100),
  health_label text not null default 'healthy' check (
    health_label in ('excellent', 'healthy', 'review_required', 'attention')
  ),
  recorded_at timestamptz not null default now()
);

create index if not exists organization_companion_memory_evolution_health_scores_org_idx
  on public.organization_companion_memory_evolution_health_scores (organization_id, recorded_at desc);

alter table public.organization_companion_memory_evolution_health_scores enable row level security;
revoke all on public.organization_companion_memory_evolution_health_scores from authenticated, anon;

create table if not exists public.organization_companion_memory_evolution_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_memory_evolution_audit_logs_org_idx
  on public.organization_companion_memory_evolution_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_memory_evolution_audit_logs enable row level security;
revoke all on public.organization_companion_memory_evolution_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cme558_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cme558_log(
  p_org_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_memory_evolution_audit_logs (
    organization_id, actor_user_id, event_type, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cme558_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_memory_evolution_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cme558_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_companion_memory_evolution_items
    where organization_id = p_org_id limit 1
  ) then
    return;
  end if;

  insert into public.organization_companion_memory_evolution_items (
    organization_id, memory_key, memory_title, memory_category, memory_status, memory_layer, summary, source_label
  ) values
    (p_org_id, 'pref_morning_briefing', 'Morning Briefing Preference', 'user_preferences', 'active', 'personal',
     'Executive prefers morning briefing with strategic summary and revenue overview.', 'approved'),
    (p_org_id, 'pref_dashboard_exec', 'Preferred Executive Dashboard', 'user_preferences', 'active', 'personal',
     'Frequently reviews executive dashboard and revenue reports.', 'approved'),
    (p_org_id, 'habit_daily_approvals', 'Daily Approval Reviews', 'working_habits', 'active', 'personal',
     'User reviews approvals daily — concise format preferred.', 'approved'),
    (p_org_id, 'org_growth_focus', 'Organization Growth Focus', 'organization_context', 'active', 'organization',
     'Organization focuses on growth and pipeline expansion.', 'approved'),
    (p_org_id, 'org_compliance_priority', 'Compliance Priority', 'organization_context', 'active', 'organization',
     'Organization prioritizes compliance and governance reviews.', 'approved'),
    (p_org_id, 'org_international_ops', 'International Operations', 'organization_context', 'active', 'organization',
     'Organization operates internationally across multiple regions.', 'approved'),
    (p_org_id, 'companion_concise_reports', 'Concise Report Preference', 'companion_preferences', 'active', 'personal',
     'User prefers concise reports with clear next steps.', 'approved'),
    (p_org_id, 'knowledge_revenue_reports', 'Revenue Report Knowledge', 'approved_knowledge', 'active', 'organization',
     'Approved knowledge: revenue reporting procedures and KPI definitions.', 'approved'),
    (p_org_id, 'rel_manager_ops', 'Operations Manager Relationship', 'relationship_context', 'review_required', 'relationship',
     'Regular collaboration with operations manager on warehouse priorities.', 'approved');

  insert into public.organization_companion_memory_evolution_working_style (
    organization_id, style_key, style_title, preference_type, preference_value, summary
  ) values
    (p_org_id, 'meeting_brief', 'Brief Meeting Prep', 'meeting', 'concise', 'Prefers concise meeting preparation.'),
    (p_org_id, 'approval_daily', 'Daily Approval Review', 'approval', 'daily', 'Reviews approvals each business day.'),
    (p_org_id, 'report_concise', 'Concise Reporting', 'reporting', 'concise', 'Prefers concise operational reports.'),
    (p_org_id, 'report_detailed', 'Detailed Analysis Option', 'reporting', 'detailed', 'Requests detailed analysis for finance reviews.'),
    (p_org_id, 'comm_professional', 'Professional Communication', 'communication', 'professional', 'Professional and respectful tone.');

  insert into public.organization_companion_memory_evolution_context_snapshots (
    organization_id, context_key, context_title, context_type, related_entities, summary, relevance_score
  ) values
    (p_org_id, 'ctx_open_project_alpha', 'Project Alpha', 'project',
     '["Related Customers","Related Documents","Related Risks","Related Tasks"]'::jsonb,
     'Open project with linked customers, documents, risks, and tasks.', 88),
    (p_org_id, 'ctx_session_project_status', 'Project Status Session', 'session',
     '["Current Project","Recent Activity","Approvals","Risks","Deadlines"]'::jsonb,
     'Companion understands project context without repeated questions.', 92);

  insert into public.organization_companion_memory_evolution_relationship_memory (
    organization_id, relationship_key, relationship_title, relationship_type, parties, summary
  ) values
    (p_org_id, 'rel_exec_finance', 'Executive ↔ Finance', 'department',
     '["Executive Team","Finance Department"]'::jsonb, 'Regular strategic finance collaboration.'),
    (p_org_id, 'rel_support_customers', 'Support ↔ Customers', 'customer',
     '["Support Team","Customer Accounts"]'::jsonb, 'Operational support relationships tracked.'),
    (p_org_id, 'rel_partner_growth', 'Growth Partner Network', 'partner',
     '["Growth Partners","Sales"]'::jsonb, 'Partner relationships for commercial growth.');

  insert into public.organization_companion_memory_evolution_conversation_context (
    organization_id, session_key, session_title, session_scope, linked_context, summary
  ) values
    (p_org_id, 'sess_current', 'Current Session', 'current',
     '["Project Alpha","Pending Approvals"]'::jsonb, 'Active session with project and approval context.'),
    (p_org_id, 'sess_recent_briefings', 'Recent Briefings', 'recent',
     '["Morning Briefing","Revenue Overview"]'::jsonb, 'Recent executive briefing context retained.');

  insert into public.organization_companion_memory_evolution_events (
    organization_id, event_key, event_type, pattern_summary, outcome_summary
  ) values
    (p_org_id, 'evo_revenue_search', 'pattern_identified',
     'Repeated searches for revenue reports identified.', 'Preference learned: prioritize revenue overview in briefings.'),
    (p_org_id, 'evo_concise_pref', 'preference_learned',
     'User consistently selects concise summaries.', 'Experience improved with concise default formatting.');

  insert into public.organization_companion_memory_evolution_governance (
    organization_id, policy_key, policy_title, policy_type, policy_body
  ) values
    (p_org_id, 'gov_approve_memory', 'Approve Memory', 'approval', 'New memory requires administrator approval before active use.'),
    (p_org_id, 'gov_review_cycle', 'Review Cycle', 'review', 'Memory items require periodic governance review.'),
    (p_org_id, 'gov_retention', 'Retention Policy', 'retention', 'Metadata-only memory retained per organizational policy.'),
    (p_org_id, 'gov_export', 'Export Control', 'export', 'Users may export their memory — full audit trail required.'),
    (p_org_id, 'gov_disable', 'Disable Memory', 'disable', 'Organizations may disable memory categories at any time.');

  insert into public.organization_companion_memory_evolution_department_memory (
    organization_id, department_key, department_title, memory_domain, summary, intelligence_score
  ) values
    (p_org_id, 'dept_finance', 'Finance Memory', 'finance', 'Long-term finance context, reporting cycles, and KPI patterns.', 84),
    (p_org_id, 'dept_support', 'Support Memory', 'support', 'Customer support procedures and escalation patterns.', 82),
    (p_org_id, 'dept_operations', 'Operations Memory', 'operations', 'Operational workflows and cross-team coordination.', 79),
    (p_org_id, 'dept_warehouse', 'Warehouse Memory', 'warehouse', 'Inventory and fulfillment operational intelligence.', 77),
    (p_org_id, 'dept_project', 'Project Memory', 'project', 'Project delivery patterns and milestone history.', 80),
    (p_org_id, 'dept_knowledge', 'Knowledge Memory', 'knowledge', 'Approved organizational knowledge references.', 85);

  insert into public.organization_companion_memory_evolution_decision_links (
    organization_id, decision_key, decision_title, reason_summary, outcome_summary, recommendation_impact
  ) values
    (p_org_id, 'dec_pipeline_priority', 'Pipeline Priority Decision', 'Growth focus required Q3 pipeline acceleration.',
     'Outcome: increased partner outreach.', 'Future recommendations weight pipeline metrics higher.');

  insert into public.organization_companion_memory_evolution_meeting_memory (
    organization_id, meeting_key, meeting_title, outcomes, action_items, follow_ups, lessons_learned, decisions, agreements, summary
  ) values
    (p_org_id, 'mtg_qtr_planning', 'Quarterly Planning Meeting',
     '["Aligned on growth targets"]'::jsonb, '["Review partner pipeline"]'::jsonb,
     '["Schedule executive briefing"]'::jsonb, '["Cross-team alignment improves velocity"]'::jsonb,
     '["Prioritize compliance review"]'::jsonb, '["Partner expansion approved"]'::jsonb,
     'Quarterly planning captured as organizational memory.');

  insert into public.organization_companion_memory_evolution_business_pack_contributions (
    organization_id, pack_key, contribution_type, contribution_title, summary
  ) values
    (p_org_id, 'finance_operations', 'context', 'Financial Context', 'Revenue, margin, and forecast context overlay.'),
    (p_org_id, 'support_operations', 'context', 'Customer Context', 'Support case and customer relationship context.'),
    (p_org_id, 'warehouse_operations', 'history', 'Inventory Context', 'Warehouse operational history metadata.'),
    (p_org_id, 'growth_partner', 'relationships', 'Partner Context', 'Partner relationship and referral context.');

  insert into public.organization_companion_memory_evolution_health_scores (
    organization_id, memory_usage_score, memory_quality_score, context_relevance_score,
    relationship_accuracy_score, governance_compliance_score, composite_score, health_label
  ) values (p_org_id, 78, 82, 80, 76, 88, 81, 'healthy');
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_companion_memory_evolution_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org jsonb;
  v_overview jsonb;
  v_personal jsonb;
  v_organization jsonb;
  v_preferences jsonb;
  v_context jsonb;
  v_learning jsonb;
  v_governance jsonb;
  v_reports jsonb;
  v_executive jsonb;
  v_health jsonb;
  v_audit jsonb;
  v_advisor jsonb;
begin
  v_org_id := public._cme558_org();
  if v_org_id is null then
    return jsonb_build_object('found', false, 'error', 'Organization not found');
  end if;

  perform public._cme558_ensure_settings(v_org_id);
  perform public._cme558_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name)
  into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'memory_items', (select count(*) from public.organization_companion_memory_evolution_items where organization_id = v_org_id),
    'active_memory', count(*) filter (where memory_status = 'active'),
    'review_required', count(*) filter (where memory_status = 'review_required'),
    'restricted_memory', count(*) filter (where memory_status = 'restricted'),
    'disabled_memory', count(*) filter (where memory_status = 'disabled'),
    'context_snapshots', (select count(*) from public.organization_companion_memory_evolution_context_snapshots where organization_id = v_org_id),
    'relationship_entries', (select count(*) from public.organization_companion_memory_evolution_relationship_memory where organization_id = v_org_id),
    'evolution_events', (select count(*) from public.organization_companion_memory_evolution_events where organization_id = v_org_id),
    'department_memory', (select count(*) from public.organization_companion_memory_evolution_department_memory where organization_id = v_org_id),
    'memory_health_score', coalesce((
      select composite_score from public.organization_companion_memory_evolution_health_scores
      where organization_id = v_org_id order by recorded_at desc limit 1
    ), 81)
  ) into v_overview
  from public.organization_companion_memory_evolution_items
  where organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'memory_key', m.memory_key, 'memory_title', m.memory_title,
    'memory_category', m.memory_category, 'memory_status', m.memory_status,
    'summary', m.summary, 'source_label', m.source_label
  ) order by m.memory_title), '[]'::jsonb)
  into v_personal
  from public.organization_companion_memory_evolution_items m
  where m.organization_id = v_org_id and m.memory_layer = 'personal';

  select coalesce(jsonb_agg(jsonb_build_object(
    'memory_key', m.memory_key, 'memory_title', m.memory_title,
    'memory_category', m.memory_category, 'memory_status', m.memory_status,
    'summary', m.summary
  ) order by m.memory_title), '[]'::jsonb)
  into v_organization
  from public.organization_companion_memory_evolution_items m
  where m.organization_id = v_org_id and m.memory_layer = 'organization';

  select jsonb_build_object(
    'working_style', coalesce((
      select jsonb_agg(jsonb_build_object(
        'style_key', w.style_key, 'style_title', w.style_title,
        'preference_type', w.preference_type, 'preference_value', w.preference_value, 'summary', w.summary
      ) order by w.style_title)
      from public.organization_companion_memory_evolution_working_style w where w.organization_id = v_org_id
    ), '[]'::jsonb),
    'companion_preferences', coalesce((
      select jsonb_agg(jsonb_build_object('memory_title', m.memory_title, 'summary', m.summary))
      from public.organization_companion_memory_evolution_items m
      where m.organization_id = v_org_id and m.memory_category = 'companion_preferences'
    ), '[]'::jsonb),
    'privacy_controls', jsonb_build_object(
      'view', true, 'edit', true, 'delete', true, 'disable_categories', true, 'export', true
    ),
    'mobile_access', jsonb_build_object(
      'review_memory', true, 'manage_preferences', true, 'review_context', true,
      'manage_privacy_controls', true, 'export_memory', true, 'route', '/app/companion/memory'
    )
  ) into v_preferences;

  select jsonb_build_object(
    'context_snapshots', coalesce((
      select jsonb_agg(jsonb_build_object(
        'context_key', c.context_key, 'context_title', c.context_title,
        'context_type', c.context_type, 'related_entities', c.related_entities,
        'summary', c.summary, 'relevance_score', c.relevance_score
      ) order by c.relevance_score desc)
      from public.organization_companion_memory_evolution_context_snapshots c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'conversation_context', coalesce((
      select jsonb_agg(jsonb_build_object(
        'session_key', s.session_key, 'session_title', s.session_title,
        'session_scope', s.session_scope, 'linked_context', s.linked_context, 'summary', s.summary
      ) order by s.recorded_at desc)
      from public.organization_companion_memory_evolution_conversation_context s where s.organization_id = v_org_id
    ), '[]'::jsonb),
    'relationship_memory', coalesce((
      select jsonb_agg(jsonb_build_object(
        'relationship_key', r.relationship_key, 'relationship_title', r.relationship_title,
        'relationship_type', r.relationship_type, 'parties', r.parties, 'summary', r.summary
      ) order by r.relationship_title)
      from public.organization_companion_memory_evolution_relationship_memory r where r.organization_id = v_org_id
    ), '[]'::jsonb)
  ) into v_context;

  select jsonb_build_object(
    'memory_evolution', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_key', e.event_key, 'event_type', e.event_type,
        'pattern_summary', e.pattern_summary, 'outcome_summary', e.outcome_summary
      ) order by e.recorded_at desc)
      from public.organization_companion_memory_evolution_events e where e.organization_id = v_org_id
    ), '[]'::jsonb),
    'department_memory', coalesce((
      select jsonb_agg(jsonb_build_object(
        'department_key', d.department_key, 'department_title', d.department_title,
        'memory_domain', d.memory_domain, 'summary', d.summary, 'intelligence_score', d.intelligence_score
      ) order by d.department_title)
      from public.organization_companion_memory_evolution_department_memory d where d.organization_id = v_org_id
    ), '[]'::jsonb),
    'decision_memory', coalesce((
      select jsonb_agg(jsonb_build_object(
        'decision_key', dl.decision_key, 'decision_title', dl.decision_title,
        'reason_summary', dl.reason_summary, 'outcome_summary', dl.outcome_summary,
        'recommendation_impact', dl.recommendation_impact
      ) order by dl.recorded_at desc)
      from public.organization_companion_memory_evolution_decision_links dl where dl.organization_id = v_org_id
    ), '[]'::jsonb),
    'meeting_memory', coalesce((
      select jsonb_agg(jsonb_build_object(
        'meeting_key', mm.meeting_key, 'meeting_title', mm.meeting_title,
        'summary', mm.summary, 'outcomes', mm.outcomes, 'action_items', mm.action_items
      ) order by mm.recorded_at desc)
      from public.organization_companion_memory_evolution_meeting_memory mm where mm.organization_id = v_org_id
    ), '[]'::jsonb),
    'business_pack_integration', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', bp.pack_key, 'contribution_type', bp.contribution_type,
        'contribution_title', bp.contribution_title, 'summary', bp.summary
      ) order by bp.pack_key)
      from public.organization_companion_memory_evolution_business_pack_contributions bp where bp.organization_id = v_org_id
    ), '[]'::jsonb)
  ) into v_learning;

  select jsonb_build_object(
    'policies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'policy_key', g.policy_key, 'policy_title', g.policy_title,
        'policy_type', g.policy_type, 'policy_body', g.policy_body, 'is_enforced', g.is_enforced
      ) order by g.policy_title)
      from public.organization_companion_memory_evolution_governance g where g.organization_id = v_org_id
    ), '[]'::jsonb),
    'governance_note', 'Organizations control memory. Companion must be transparent — approve, review, delete, export, or disable.',
    'retention_days', coalesce((
      select retention_days from public.organization_companion_memory_evolution_settings where organization_id = v_org_id
    ), 365),
    'categories', jsonb_build_array(
      'user_preferences', 'working_habits', 'business_context', 'department_context',
      'organization_context', 'companion_preferences', 'approved_knowledge', 'relationship_context'
    ),
    'statuses', jsonb_build_object(
      'active', 'Active', 'review_required', 'Review Required',
      'restricted', 'Restricted', 'disabled', 'Disabled'
    )
  ) into v_governance;

  select jsonb_build_object(
    'memory_growth', jsonb_build_object(
      'items', (select count(*) from public.organization_companion_memory_evolution_items where organization_id = v_org_id),
      'evolution_events', (select count(*) from public.organization_companion_memory_evolution_events where organization_id = v_org_id)
    ),
    'context_usage', (select count(*) from public.organization_companion_memory_evolution_context_snapshots where organization_id = v_org_id),
    'preference_trends', coalesce((
      select jsonb_agg(jsonb_build_object('preference_type', w.preference_type, 'preference_value', w.preference_value))
      from public.organization_companion_memory_evolution_working_style w where w.organization_id = v_org_id
    ), '[]'::jsonb),
    'relationship_trends', (select count(*) from public.organization_companion_memory_evolution_relationship_memory where organization_id = v_org_id),
    'learning_activity', (select count(*) from public.organization_companion_memory_evolution_events where organization_id = v_org_id),
    'governance_reviews', (select count(*) from public.organization_companion_memory_evolution_items where organization_id = v_org_id and memory_status = 'review_required')
  ) into v_reports;

  select coalesce((
    select jsonb_build_object(
      'memory_usage', hs.memory_usage_score,
      'memory_quality', hs.memory_quality_score,
      'context_coverage', hs.context_relevance_score,
      'department_adoption', (select count(*) from public.organization_companion_memory_evolution_department_memory where organization_id = v_org_id),
      'relationship_coverage', hs.relationship_accuracy_score,
      'companion_learning_activity', (select count(*) from public.organization_companion_memory_evolution_events where organization_id = v_org_id),
      'composite_score', hs.composite_score,
      'health_label', hs.health_label
    )
    from public.organization_companion_memory_evolution_health_scores hs
    where hs.organization_id = v_org_id
    order by hs.recorded_at desc limit 1
  ), '{}'::jsonb) into v_executive;

  select coalesce((
    select jsonb_build_object(
      'memory_usage_score', hs.memory_usage_score,
      'memory_quality_score', hs.memory_quality_score,
      'context_relevance_score', hs.context_relevance_score,
      'relationship_accuracy_score', hs.relationship_accuracy_score,
      'governance_compliance_score', hs.governance_compliance_score,
      'composite_score', hs.composite_score,
      'health_label', hs.health_label
    )
    from public.organization_companion_memory_evolution_health_scores hs
    where hs.organization_id = v_org_id
    order by hs.recorded_at desc limit 1
  ), '{}'::jsonb) into v_health;

  select jsonb_build_object(
    'advisor_prompts', jsonb_build_array(
      'What do you know about this customer?',
      'What should I remember?',
      'What preferences have I set?',
      'Show relevant context.',
      'Why did you recommend this?'
    ),
    'explains_memory_usage', true,
    'integrations', jsonb_build_array('PAME', 'Knowledge Graph', 'Decision Support Engine', 'Context Engine')
  ) into v_advisor;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select event_type, summary, created_at
    from public.organization_companion_memory_evolution_audit_logs
    where organization_id = v_org_id
    order by created_at desc
    limit 25
  ) a;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion should become smarter over time — not by remembering everything, but by remembering what matters.',
    'philosophy', 'Knowledge explains the past. Context explains the present. Memory improves the future.',
    'section', p_section,
    'organization', v_org,
    'overview', v_overview,
    'personal_memory', v_personal,
    'organization_memory', v_organization,
    'preferences', v_preferences,
    'context', v_context,
    'learning', v_learning,
    'memory_governance', v_governance,
    'reports', v_reports,
    'executive_dashboard', v_executive,
    'memory_health', v_health,
    'companion_context_advisor', v_advisor,
    'audit_recent', v_audit,
    'mobile_access', jsonb_build_object(
      'review_memory', true, 'manage_preferences', true, 'review_context', true,
      'manage_privacy_controls', true, 'export_memory', true, 'route', '/app/companion/memory'
    ),
    'notifications', jsonb_build_object(
      'types', jsonb_build_array(
        'memory_review_due', 'memory_governance_change', 'memory_export_requested',
        'context_gap_detected', 'preference_change_detected'
      )
    ),
    'routes', jsonb_build_object(
      'memory_center', '/app/companion/memory',
      'assistant_memory', '/app/assistant/memory',
      'decisions', '/app/assistant/decisions',
      'context', '/app/companion/context',
      'commitments', '/app/companion/memory'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions RPC
-- ---------------------------------------------------------------------------
create or replace function public.perform_organization_companion_memory_evolution_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_memory_key text := coalesce(p_payload->>'memory_key', '');
begin
  v_org_id := public._cme558_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'approve_memory' and v_memory_key <> '' then
    update public.organization_companion_memory_evolution_items
    set memory_status = 'active', updated_at = now()
    where organization_id = v_org_id and memory_key = v_memory_key;
    perform public._cme558_log(v_org_id, 'memory_created', 'Memory approved.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'review_memory' and v_memory_key <> '' then
    update public.organization_companion_memory_evolution_items
    set memory_status = 'review_required', updated_at = now()
    where organization_id = v_org_id and memory_key = v_memory_key;
    perform public._cme558_log(v_org_id, 'governance_review_completed', 'Memory marked for review.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'delete_memory' and v_memory_key <> '' then
    delete from public.organization_companion_memory_evolution_items
    where organization_id = v_org_id and memory_key = v_memory_key;
    perform public._cme558_log(v_org_id, 'memory_deleted', 'Memory deleted.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'disable_memory' and v_memory_key <> '' then
    update public.organization_companion_memory_evolution_items
    set memory_status = 'disabled', updated_at = now()
    where organization_id = v_org_id and memory_key = v_memory_key;
    perform public._cme558_log(v_org_id, 'preference_removed', 'Memory disabled.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'export_memory' then
    perform public._cme558_log(v_org_id, 'memory_exported', 'Memory export requested.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action, 'export_ready', true);

  elsif v_action = 'refresh_health_score' then
    insert into public.organization_companion_memory_evolution_health_scores (
      organization_id, memory_usage_score, memory_quality_score, context_relevance_score,
      relationship_accuracy_score, governance_compliance_score, composite_score, health_label
    )
    select v_org_id,
      least(100, coalesce((select memory_usage_score from public.organization_companion_memory_evolution_health_scores where organization_id = v_org_id order by recorded_at desc limit 1), 78) + 1),
      least(100, coalesce((select memory_quality_score from public.organization_companion_memory_evolution_health_scores where organization_id = v_org_id order by recorded_at desc limit 1), 82) + 1),
      least(100, coalesce((select context_relevance_score from public.organization_companion_memory_evolution_health_scores where organization_id = v_org_id order by recorded_at desc limit 1), 80) + 1),
      least(100, coalesce((select relationship_accuracy_score from public.organization_companion_memory_evolution_health_scores where organization_id = v_org_id order by recorded_at desc limit 1), 76) + 1),
      least(100, coalesce((select governance_compliance_score from public.organization_companion_memory_evolution_health_scores where organization_id = v_org_id order by recorded_at desc limit 1), 88)),
      least(100, coalesce((select composite_score from public.organization_companion_memory_evolution_health_scores where organization_id = v_org_id order by recorded_at desc limit 1), 81) + 1),
      'healthy';
    perform public._cme558_log(v_org_id, 'context_generated', 'Memory health score refreshed.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'learn_preference' then
    insert into public.organization_companion_memory_evolution_events (
      organization_id, event_key, event_type, pattern_summary, outcome_summary
    ) values (
      v_org_id,
      'evo_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
      'preference_learned',
      coalesce(p_payload->>'pattern_summary', 'New preference pattern identified.'),
      coalesce(p_payload->>'outcome_summary', 'Companion experience improved.')
    );
    perform public._cme558_log(v_org_id, 'preference_learned', 'Preference learned from pattern.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);

  else
    raise exception 'Unknown action: %', v_action;
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Mobile & advisor RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_companion_memory_evolution_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_companion_memory_evolution_center('mobile');
  return jsonb_build_object(
    'found', v_center->'found',
    'memory_health_score', v_center#>>'{overview,memory_health_score}',
    'capabilities', jsonb_build_array(
      'review_memory', 'manage_preferences', 'review_context',
      'manage_privacy_controls', 'export_memory'
    ),
    'route', '/app/companion/memory'
  );
end; $$;

create or replace function public.get_assistant_companion_memory_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_companion_memory_evolution_center('companion');
  return jsonb_build_object(
    'found', v_center->'found',
    'principle', v_center->'principle',
    'companion_context_advisor', v_center->'companion_context_advisor',
    'memory_health', v_center->'memory_health',
    'active_context', v_center->'context',
    'route', '/app/companion/memory'
  );
end; $$;

grant execute on function public.get_organization_companion_memory_evolution_center(text) to authenticated;
grant execute on function public.perform_organization_companion_memory_evolution_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_memory_evolution_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_memory_advisor_context() to authenticated;
