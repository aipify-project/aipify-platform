-- Phase 449 — Business Memory & Corporate Brain Engine (Customer App)
-- Route: /app/intelligence/corporate-brain

create table if not exists public.corporate_brain_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  brain_enabled boolean not null default true,
  knowledge_preservation_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.corporate_brain_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'organizational_memory', 'business_knowledge', 'historical_decisions', 'lessons_learned',
    'institutional_knowledge', 'knowledge_timeline', 'corporate_intelligence'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  metric_label text not null default '',
  metric_value text not null default '',
  status_key text not null default 'information' check (status_key in (
    'completed', 'requires_attention', 'waiting', 'information', 'restricted', 'verified', 'not_allowed'
  )),
  updated_at timestamptz not null default now()
);

create index if not exists corporate_brain_sections_org_idx
  on public.corporate_brain_section_items (organization_id, section_key);

create table if not exists public.corporate_brain_memory_entities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  entity_type text not null check (entity_type in (
    'projects', 'customers', 'vendors', 'employees', 'meetings', 'decisions',
    'policies', 'procedures', 'business_packs', 'relationships'
  )),
  entity_name text not null,
  connection_label text not null default '',
  record_count_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, entity_type)
);

create table if not exists public.corporate_brain_timeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  timeline_year text not null,
  timeline_month text not null default '',
  event_title text not null,
  decision_label text not null default '',
  outcome_label text not null default '',
  impact_label text not null default '',
  status_key text not null default 'information',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists corporate_brain_timeline_org_idx
  on public.corporate_brain_timeline (organization_id, sort_order);

create table if not exists public.corporate_brain_decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_title text not null,
  reason_label text not null default '' check (char_length(reason_label) <= 500),
  alternatives_label text not null default '',
  expected_outcome_label text not null default '',
  actual_outcome_label text not null default '',
  lessons_label text not null default '',
  owner_name text not null default '',
  source_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create table if not exists public.corporate_brain_knowledge_graph (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  node_type text not null check (node_type in (
    'people', 'projects', 'customers', 'documents', 'tasks', 'workflows', 'systems'
  )),
  node_name text not null,
  connection_count_label text not null default '',
  relationship_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, node_type)
);

create table if not exists public.corporate_brain_lessons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  lesson_type text not null check (lesson_type in (
    'success', 'failure', 'experiment', 'improvement'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  lesson_label text not null default '',
  owner_name text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now()
);

create table if not exists public.corporate_brain_historical_search (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  question_type text not null check (question_type in (
    'why_decision', 'when_process_change', 'who_approved', 'what_implementation', 'general_history'
  )),
  question text not null,
  answer text not null default '' check (char_length(answer) <= 500),
  source_label text not null default '',
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists corporate_brain_historical_org_idx
  on public.corporate_brain_historical_search (organization_id, status);

create table if not exists public.corporate_brain_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'key_milestones', 'major_decisions', 'important_lessons', 'strategic_history'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.corporate_brain_companion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  historian_type text not null check (historian_type in (
    'workflow_origin', 'policy_implementation', 'past_attempt', 'general_context'
  )),
  question text not null,
  historical_context text not null default '' check (char_length(historical_context) <= 500),
  evidence_label text not null default '',
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists corporate_brain_companion_org_idx
  on public.corporate_brain_companion (organization_id, status);

create table if not exists public.corporate_brain_intelligence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  intel_type text not null check (intel_type in (
    'pattern', 'repeated_problem', 'repeated_success', 'long_term_trend'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now()
);

create table if not exists public.corporate_brain_preservation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  preservation_type text not null check (preservation_type in (
    'knowledge', 'processes', 'documentation', 'context', 'history'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, preservation_type)
);

create table if not exists public.corporate_brain_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  item_type text not null,
  item_id uuid,
  action text not null,
  description text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists corporate_brain_audit_org_idx
  on public.corporate_brain_audit (organization_id, created_at desc);

alter table public.corporate_brain_settings enable row level security;
alter table public.corporate_brain_section_items enable row level security;
alter table public.corporate_brain_memory_entities enable row level security;
alter table public.corporate_brain_timeline enable row level security;
alter table public.corporate_brain_decisions enable row level security;
alter table public.corporate_brain_knowledge_graph enable row level security;
alter table public.corporate_brain_lessons enable row level security;
alter table public.corporate_brain_historical_search enable row level security;
alter table public.corporate_brain_executive_metrics enable row level security;
alter table public.corporate_brain_companion enable row level security;
alter table public.corporate_brain_intelligence enable row level security;
alter table public.corporate_brain_preservation enable row level security;
alter table public.corporate_brain_audit enable row level security;
revoke all on public.corporate_brain_settings from authenticated, anon;
revoke all on public.corporate_brain_section_items from authenticated, anon;
revoke all on public.corporate_brain_memory_entities from authenticated, anon;
revoke all on public.corporate_brain_timeline from authenticated, anon;
revoke all on public.corporate_brain_decisions from authenticated, anon;
revoke all on public.corporate_brain_knowledge_graph from authenticated, anon;
revoke all on public.corporate_brain_lessons from authenticated, anon;
revoke all on public.corporate_brain_historical_search from authenticated, anon;
revoke all on public.corporate_brain_executive_metrics from authenticated, anon;
revoke all on public.corporate_brain_companion from authenticated, anon;
revoke all on public.corporate_brain_intelligence from authenticated, anon;
revoke all on public.corporate_brain_preservation from authenticated, anon;
revoke all on public.corporate_brain_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'corporate_brain_center', v.description
from (values
  ('corporate_brain.view', 'View Corporate Brain Center', 'View organizational memory, knowledge graph, decisions, and lessons learned'),
  ('corporate_brain.manage', 'Manage Corporate Brain Center', 'Manage memory records, lessons, and knowledge preservation settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'corporate_brain.view'), ('owner', 'corporate_brain.manage'),
  ('administrator', 'corporate_brain.view'), ('administrator', 'corporate_brain.manage'),
  ('manager', 'corporate_brain.view'),
  ('employee', 'corporate_brain.view'),
  ('support_agent', 'corporate_brain.view'),
  ('moderator', 'corporate_brain.view'),
  ('viewer', 'corporate_brain.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._bmcb449_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('corporate_brain.manage', v_org_id),
    'can_manage', public._irp_has_permission('corporate_brain.manage', v_org_id),
    'can_view', public._irp_has_permission('corporate_brain.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._bmcb449_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.corporate_brain_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._bmcb449_section_json(s public.corporate_brain_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'metric_label', s.metric_label, 'metric_value', s.metric_value,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._bmcb449_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.corporate_brain_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.corporate_brain_memory_entities where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.corporate_brain_section_items
    (organization_id, section_key, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'organizational_memory', 'Organizational memory', 'Persistent memory layer connecting business knowledge across years of activity.', 'Records', '4,820', 'verified'),
    (p_org_id, 'business_knowledge', 'Business knowledge', 'Projects, customers, vendors, policies, procedures, and Business Packs connected.', 'Entities', '10', 'verified'),
    (p_org_id, 'historical_decisions', 'Historical decisions', 'Decision memory with reason, alternatives, outcomes, and lessons learned.', 'Decisions', '186', 'verified'),
    (p_org_id, 'lessons_learned', 'Lessons learned', 'Successes, failures, experiments, and improvements captured for continuity.', 'Lessons', '94', 'information'),
    (p_org_id, 'institutional_knowledge', 'Institutional knowledge', 'Knowledge preserved when people leave — processes, documentation, context.', 'Preserved', '100%', 'verified'),
    (p_org_id, 'knowledge_timeline', 'Knowledge timeline', 'Year-by-year organizational events, decisions, outcomes, and impact.', 'Events', '240', 'verified'),
    (p_org_id, 'corporate_intelligence', 'Corporate intelligence', 'Patterns, repeated problems, successes, and long-term trends.', 'Patterns', '12', 'information');

  insert into public.corporate_brain_memory_entities
    (organization_id, entity_type, entity_name, connection_label, record_count_label, status_key)
  values
    (p_org_id, 'projects', 'Projects', 'Connected to decisions, customers, and timelines', '142 active', 'verified'),
    (p_org_id, 'customers', 'Customers', 'Linked to relationships, decisions, and revenue history', '89 accounts', 'verified'),
    (p_org_id, 'vendors', 'Vendors', 'Connected to policies, procedures, and lessons learned', '34 vendors', 'verified'),
    (p_org_id, 'employees', 'Employees', 'Institutional knowledge and process ownership', 'Metadata only', 'verified'),
    (p_org_id, 'meetings', 'Meetings', 'Decision context and historical approvals', '1,240 indexed', 'verified'),
    (p_org_id, 'decisions', 'Decisions', 'Full decision memory with outcomes', '186 records', 'verified'),
    (p_org_id, 'policies', 'Policies', 'Versioned policy history and changes', '48 policies', 'verified'),
    (p_org_id, 'procedures', 'Procedures', 'Step-by-step institutional procedures', '76 procedures', 'verified'),
    (p_org_id, 'business_packs', 'Business Packs', 'Module launch history and adoption', '8 packs', 'verified'),
    (p_org_id, 'relationships', 'Relationships', 'Customer and partner relationship intelligence', '156 connections', 'verified');

  insert into public.corporate_brain_timeline
    (organization_id, timeline_year, timeline_month, event_title, decision_label, outcome_label, impact_label, status_key, sort_order)
  values
    (p_org_id, '2026', 'Q2', 'Aipify Hosts launched', 'Approved hospitality vertical expansion', 'Revenue growth in hospitality segment', '+18% segment revenue', 'completed', 1),
    (p_org_id, '2026', 'Q3', 'Growth Partner program expanded', 'Approved partner-led GTM strategy', '12 new partners onboarded', '28% market coverage increase', 'verified', 2),
    (p_org_id, '2027', 'Q1', 'Hospitality Business Pack released', 'Approved dedicated Business Pack launch', 'Expansion into new market vertical', 'NOK 1.8M ARR potential', 'waiting', 3),
    (p_org_id, '2027', 'Q2', 'Nordic market entry assessment', 'Deferred pending partner pipeline review', 'Assessment complete — decision pending', 'Strategic option preserved', 'information', 4);

  insert into public.corporate_brain_decisions
    (organization_id, decision_title, reason_label, alternatives_label, expected_outcome_label, actual_outcome_label, lessons_label, owner_name, source_label, status_key)
  values
    (p_org_id, 'Launch Aipify Hosts', 'Hospitality vertical demand rising — pilot customers validated product-market fit.', 'Wait for enterprise tier · Partner-only launch', 'NOK 800K ARR in 12 months', 'NOK 920K ARR — exceeded target', 'Vertical-specific Business Packs accelerate adoption', 'Executive Team', 'Board recommendation · Q2 2026', 'completed'),
    (p_org_id, 'Vendor cloud migration', 'Primary vendor end-of-life announcement required migration.', 'Multi-cloud · Delayed migration', 'Zero downtime migration in 90 days', '2-week delay — partial outage during cutover', 'Add migration checklist and rollback plan', 'Operations', 'Infrastructure review · 2025', 'requires_attention'),
    (p_org_id, 'Enterprise pricing adjustment', 'Mid-market accounts requesting enterprise features at scale.', 'Grandfather existing · Tiered add-ons only', '+12% ARPU with minimal churn', 'In progress — monitoring churn signals', 'Pending — review in Q3', 'Finance', 'Executive board · Q1 2027', 'waiting');

  insert into public.corporate_brain_knowledge_graph
    (organization_id, node_type, node_name, connection_count_label, relationship_label, status_key)
  values
    (p_org_id, 'people', 'People', '89 nodes', 'Employees, owners, approvers, and relationship contacts', 'verified'),
    (p_org_id, 'projects', 'Projects', '142 nodes', 'Connected to customers, decisions, and timelines', 'verified'),
    (p_org_id, 'customers', 'Customers', '89 nodes', 'Revenue history, decisions, and relationship intelligence', 'verified'),
    (p_org_id, 'documents', 'Documents', '340 nodes', 'Policies, procedures, and approved knowledge sources', 'verified'),
    (p_org_id, 'tasks', 'Tasks', '1,840 nodes', 'Workflow tasks linked to projects and decisions', 'verified'),
    (p_org_id, 'workflows', 'Workflows', '48 nodes', 'Orchestration flows with governance checkpoints', 'verified'),
    (p_org_id, 'systems', 'Systems', '12 nodes', 'Integrations, Business Packs, and install contexts', 'verified');

  insert into public.corporate_brain_lessons
    (organization_id, lesson_type, title, summary, lesson_label, owner_name, status_key)
  values
    (p_org_id, 'failure', 'Vendor migration caused delays', 'Primary cloud vendor migration experienced 2-week delay during cutover.', 'Add migration checklist and rollback plan before any infrastructure migration.', 'Operations', 'requires_attention'),
    (p_org_id, 'success', 'Business Pack vertical launch', 'Hospitality Business Pack exceeded ARR target by 15% in first year.', 'Vertical-specific packs with pilot validation accelerate market entry.', 'Product', 'completed'),
    (p_org_id, 'experiment', 'Partner-led GTM pilot', 'Growth Partner program tested in Nordic markets before full rollout.', 'Partner-led expansion reduces capital intensity — validate pipeline first.', 'Growth', 'verified'),
    (p_org_id, 'improvement', 'Approval bottleneck resolution', 'Finance approval delays reduced from 72h to 36h after dual-auth policy update.', 'Department-specific approval rules prevent enterprise-wide bottlenecks.', 'Finance', 'verified');

  insert into public.corporate_brain_historical_search
    (organization_id, question_type, question, answer, source_label)
  values
    (p_org_id, 'why_decision', 'Why was the Hospitality Business Pack launched?', 'Board approved launch based on +34% segment inquiry growth and successful Aipify Hosts pilot — decision recorded Q1 2027.', 'Decision memory · board recommendation · segment analytics'),
    (p_org_id, 'when_process_change', 'When did we change the vendor approval process?', 'Dual-authorization for Finance approvals implemented March 2026 after approval bottleneck analysis.', 'Policy history · approval intelligence · audit trail'),
    (p_org_id, 'who_approved', 'Who approved the Growth Partner expansion?', 'Executive Team approved Q3 2026 — recorded in board decision package with full audit trail.', 'Decision memory · approval history'),
    (p_org_id, 'what_implementation', 'What happened during the vendor migration?', '2-week delay during cutover — lesson captured: add migration checklist. Full timeline and outcome in decision memory.', 'Timeline · lessons learned · decision memory');

  insert into public.corporate_brain_executive_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'key_milestones', '24', 'Aipify Hosts · Growth Partners · Hospitality Pack', 'verified'),
    (p_org_id, 'major_decisions', '186', 'Full decision memory with outcomes', 'verified'),
    (p_org_id, 'important_lessons', '94', 'Including 12 from past 12 months', 'information'),
    (p_org_id, 'strategic_history', '5 years', 'Organizational timeline from 2022', 'verified');

  insert into public.corporate_brain_companion
    (organization_id, historian_type, question, historical_context, evidence_label)
  values
    (p_org_id, 'workflow_origin', 'Why do we use this workflow?', 'This workflow was adopted after the vendor migration lesson in 2025 — rollback checkpoints were added following a 2-week delay during cutover.', 'Decision memory · lessons learned · timeline'),
    (p_org_id, 'policy_implementation', 'When did we implement this policy?', 'Finance dual-authorization policy implemented March 2026 after approval bottleneck analysis reduced delays from 72h to 36h.', 'Policy history · approval intelligence'),
    (p_org_id, 'past_attempt', 'What happened last time we tried this?', 'Previous Nordic expansion was deferred in 2026 pending partner pipeline review — assessment complete, decision preserved for Q2 2027.', 'Timeline · board decision · strategic history'),
    (p_org_id, 'general_context', 'What is our institutional knowledge on hospitality vertical?', 'Aipify Hosts launched Q2 2026 exceeded ARR target. Hospitality Business Pack approved Q1 2027 based on +34% inquiry growth.', 'Memory entities · timeline · decision memory');

  insert into public.corporate_brain_intelligence
    (organization_id, intel_type, title, summary, trend_label, status_key)
  values
    (p_org_id, 'pattern', 'Vertical Business Pack adoption pattern', 'Vertical-specific packs consistently exceed ARR targets when preceded by pilot validation.', '3 of 3 launches exceeded target', 'verified'),
    (p_org_id, 'repeated_problem', 'Infrastructure migration delays', 'Vendor and cloud migrations have caused delays in 2 of 3 historical attempts.', 'Add checklist before next migration', 'requires_attention'),
    (p_org_id, 'repeated_success', 'Partner-led market expansion', 'Growth Partner program delivered 28% coverage increase in both pilot markets.', 'Replicate in Nordic assessment', 'completed'),
    (p_org_id, 'long_term_trend', 'Revenue diversification improving', 'Segment concentration reduced from 52% to 41% over 24 months.', 'On track for 30% target', 'verified');

  insert into public.corporate_brain_preservation
    (organization_id, preservation_type, title, summary, status_key)
  values
    (p_org_id, 'knowledge', 'Knowledge preservation', 'Approved knowledge sources and institutional memory remain when employees leave.', 'verified'),
    (p_org_id, 'processes', 'Process preservation', 'Documented procedures and workflow definitions retained with version history.', 'verified'),
    (p_org_id, 'documentation', 'Documentation preservation', 'Policies, templates, and approved guides indexed in corporate brain.', 'verified'),
    (p_org_id, 'context', 'Context preservation', 'Decision reason, alternatives, and outcomes preserved for historical search.', 'verified'),
    (p_org_id, 'history', 'History preservation', 'Organizational timeline and audit trail maintained indefinitely.', 'verified');

end; $$;

create or replace function public.get_corporate_brain_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_settings jsonb;
  v_mem_s jsonb; v_know_s jsonb; v_dec_s jsonb; v_lesson_s jsonb;
  v_inst_s jsonb; v_time_s jsonb; v_intel_s jsonb;
  v_entities jsonb; v_timeline jsonb; v_decisions jsonb; v_graph jsonb;
  v_lessons jsonb; v_search jsonb; v_exec jsonb; v_companion jsonb;
  v_intelligence jsonb; v_preservation jsonb;
begin
  perform public._irp_require_permission('corporate_brain.view');
  v_ctx := public._bmcb449_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._bmcb449_seed(v_org_id);

  select jsonb_build_object(
    'brain_enabled', s.brain_enabled,
    'knowledge_preservation_enabled', s.knowledge_preservation_enabled
  ) into v_settings
  from public.corporate_brain_settings s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(public._bmcb449_section_json(s)), '[]'::jsonb) into v_mem_s
  from public.corporate_brain_section_items s where s.organization_id = v_org_id and s.section_key = 'organizational_memory';
  select coalesce(jsonb_agg(public._bmcb449_section_json(s)), '[]'::jsonb) into v_know_s
  from public.corporate_brain_section_items s where s.organization_id = v_org_id and s.section_key = 'business_knowledge';
  select coalesce(jsonb_agg(public._bmcb449_section_json(s)), '[]'::jsonb) into v_dec_s
  from public.corporate_brain_section_items s where s.organization_id = v_org_id and s.section_key = 'historical_decisions';
  select coalesce(jsonb_agg(public._bmcb449_section_json(s)), '[]'::jsonb) into v_lesson_s
  from public.corporate_brain_section_items s where s.organization_id = v_org_id and s.section_key = 'lessons_learned';
  select coalesce(jsonb_agg(public._bmcb449_section_json(s)), '[]'::jsonb) into v_inst_s
  from public.corporate_brain_section_items s where s.organization_id = v_org_id and s.section_key = 'institutional_knowledge';
  select coalesce(jsonb_agg(public._bmcb449_section_json(s)), '[]'::jsonb) into v_time_s
  from public.corporate_brain_section_items s where s.organization_id = v_org_id and s.section_key = 'knowledge_timeline';
  select coalesce(jsonb_agg(public._bmcb449_section_json(s)), '[]'::jsonb) into v_intel_s
  from public.corporate_brain_section_items s where s.organization_id = v_org_id and s.section_key = 'corporate_intelligence';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'entity_type', e.entity_type, 'entity_name', e.entity_name,
    'connection_label', e.connection_label, 'record_count_label', e.record_count_label,
    'status_key', e.status_key, 'item_type', 'memory_entity'
  ) order by e.entity_name), '[]'::jsonb)
  into v_entities from public.corporate_brain_memory_entities e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'timeline_year', t.timeline_year, 'timeline_month', t.timeline_month,
    'event_title', t.event_title, 'decision_label', t.decision_label,
    'outcome_label', t.outcome_label, 'impact_label', t.impact_label,
    'status_key', t.status_key, 'item_type', 'timeline'
  ) order by t.sort_order), '[]'::jsonb)
  into v_timeline from public.corporate_brain_timeline t where t.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'decision_title', d.decision_title, 'reason_label', d.reason_label,
    'alternatives_label', d.alternatives_label, 'expected_outcome_label', d.expected_outcome_label,
    'actual_outcome_label', d.actual_outcome_label, 'lessons_label', d.lessons_label,
    'owner_name', d.owner_name, 'source_label', d.source_label,
    'status_key', d.status_key, 'item_type', 'decision'
  ) order by d.updated_at desc), '[]'::jsonb)
  into v_decisions from public.corporate_brain_decisions d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'node_type', g.node_type, 'node_name', g.node_name,
    'connection_count_label', g.connection_count_label, 'relationship_label', g.relationship_label,
    'status_key', g.status_key, 'item_type', 'graph_node'
  ) order by g.node_name), '[]'::jsonb)
  into v_graph from public.corporate_brain_knowledge_graph g where g.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'lesson_type', l.lesson_type, 'title', l.title, 'summary', l.summary,
    'lesson_label', l.lesson_label, 'owner_name', l.owner_name,
    'status_key', l.status_key, 'item_type', 'lesson'
  ) order by l.updated_at desc), '[]'::jsonb)
  into v_lessons from public.corporate_brain_lessons l where l.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', h.id, 'question_type', h.question_type, 'question', h.question,
    'answer', h.answer, 'source_label', h.source_label,
    'status', h.status, 'item_type', 'historical_search'
  ) order by h.created_at desc), '[]'::jsonb)
  into v_search from public.corporate_brain_historical_search h
  where h.organization_id = v_org_id and h.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_value', m.metric_value,
    'trend_label', m.trend_label, 'status_key', m.status_key, 'item_type', 'executive'
  ) order by case m.metric_key
    when 'key_milestones' then 1 when 'major_decisions' then 2
    when 'important_lessons' then 3 else 4 end), '[]'::jsonb)
  into v_exec from public.corporate_brain_executive_metrics m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'historian_type', c.historian_type, 'question', c.question,
    'historical_context', c.historical_context, 'evidence_label', c.evidence_label,
    'status', c.status, 'item_type', 'companion'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_companion from public.corporate_brain_companion c
  where c.organization_id = v_org_id and c.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'intel_type', i.intel_type, 'title', i.title, 'summary', i.summary,
    'trend_label', i.trend_label, 'status_key', i.status_key, 'item_type', 'intelligence'
  ) order by i.title), '[]'::jsonb)
  into v_intelligence from public.corporate_brain_intelligence i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'preservation_type', p.preservation_type, 'title', p.title,
    'summary', p.summary, 'status_key', p.status_key, 'item_type', 'preservation'
  ) order by p.title), '[]'::jsonb)
  into v_preservation from public.corporate_brain_preservation p where p.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'People leave. Documents get lost. Knowledge disappears. Aipify becomes the organization long-term memory — metadata only, with owner, date, source, version, audit trail, and access controls.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'All memory records include owner, date, source, version, audit trail, and access controls. No raw chat or PII in corporate brain.',
    'brain_settings', coalesce(v_settings, '{}'::jsonb),
    'memory_engine', v_entities,
    'organizational_timeline', v_timeline,
    'decision_memory', v_decisions,
    'corporate_knowledge_graph', v_graph,
    'lessons_learned_engine', v_lessons,
    'historical_search', v_search,
    'executive_memory_dashboard', v_exec,
    'companion_corporate_historian', v_companion,
    'corporate_intelligence_layer', v_intelligence,
    'knowledge_preservation', v_preservation,
    'sections', jsonb_build_object(
      'organizational_memory', v_mem_s,
      'business_knowledge', v_know_s,
      'historical_decisions', v_dec_s,
      'lessons_learned', v_lesson_s,
      'institutional_knowledge', v_inst_s,
      'knowledge_timeline', v_time_s,
      'corporate_intelligence', v_intel_s
    ),
    'statistics', jsonb_build_object(
      'entity_count', jsonb_array_length(v_entities),
      'timeline_count', jsonb_array_length(v_timeline),
      'decision_count', jsonb_array_length(v_decisions),
      'graph_count', jsonb_array_length(v_graph),
      'lesson_count', jsonb_array_length(v_lessons),
      'companion_count', jsonb_array_length(v_companion)
    ),
    'privacy_note', 'Organizational memory metadata only — no raw email, chat, payment data, or unapproved PII in corporate brain records.'
  );
end; $$;

create or replace function public.manage_corporate_brain_item(
  p_item_type text,
  p_item_id uuid default null,
  p_action text default 'acknowledge',
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._bmcb449_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'approve', 'archive', 'escalate') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'companion' and p_item_id is not null then
    update public.corporate_brain_companion set
      status = case p_action when 'acknowledge' then 'acknowledged' when 'dismiss' then 'dismissed' else status end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'historical_search' and p_item_id is not null then
    update public.corporate_brain_historical_search set
      status = case p_action when 'acknowledge' then 'acknowledged' when 'dismiss' then 'dismissed' else status end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'lesson' and p_item_id is not null then
    update public.corporate_brain_lessons set
      status_key = case p_action when 'approve' then 'verified' when 'archive' then 'completed' when 'escalate' then 'requires_attention' else status_key end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'decision' and p_item_id is not null then
    update public.corporate_brain_decisions set
      status_key = case p_action when 'approve' then 'verified' when 'archive' then 'completed' else status_key end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._bmcb449_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Corporate brain item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_corporate_brain_center() to authenticated;
grant execute on function public.manage_corporate_brain_item(text, uuid, text, jsonb) to authenticated;
