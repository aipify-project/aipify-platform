-- Phase 450 — Organizational Consciousness Engine (Customer App)
-- Route: /app/intelligence/consciousness

create table if not exists public.organizational_consciousness_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  consciousness_enabled boolean not null default true,
  human_control_required boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.organizational_consciousness_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'organizational_awareness', 'strategic_awareness', 'operational_awareness', 'cultural_awareness',
    'organizational_alignment', 'long_term_trends', 'emerging_signals'
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

create index if not exists organizational_consciousness_sections_org_idx
  on public.organizational_consciousness_section_items (organization_id, section_key);

create table if not exists public.organizational_consciousness_awareness (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  awareness_area text not null check (awareness_area in (
    'operations', 'customers', 'employees', 'projects', 'finance',
    'knowledge', 'governance', 'business_packs', 'integrations'
  )),
  area_name text not null,
  evaluation_label text not null default '',
  signal_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, awareness_area)
);

create table if not exists public.organizational_consciousness_alignment (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  alignment_type text not null check (alignment_type in (
    'conflicting_priorities', 'misaligned_objectives', 'department_friction', 'communication_gaps'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  evidence_label text not null default '',
  status_key text not null default 'requires_attention',
  updated_at timestamptz not null default now()
);

create table if not exists public.organizational_consciousness_strategic (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  strategic_type text not null check (strategic_type in (
    'growth', 'competition', 'customer_trends', 'partner_trends', 'technology_trends', 'market_signals'
  )),
  title text not null,
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, strategic_type)
);

create table if not exists public.organizational_consciousness_narrative (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  narrative_type text not null check (narrative_type in (
    'current_state', 'direction', 'what_changed', 'what_next'
  )),
  title text not null,
  narrative text not null default '' check (char_length(narrative) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, narrative_type)
);

create table if not exists public.organizational_consciousness_emerging_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  signal_type text not null check (signal_type in (
    'customer_behavior', 'knowledge_creation', 'support_demand', 'operational_stress', 'market_shift'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  evidence_label text not null default '',
  status_key text not null default 'requires_attention',
  updated_at timestamptz not null default now()
);

create table if not exists public.organizational_consciousness_coherence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  coherence_dimension text not null check (coherence_dimension in (
    'vision', 'strategy', 'operations', 'execution', 'results'
  )),
  dimension_name text not null,
  alignment_score_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, coherence_dimension)
);

create table if not exists public.organizational_consciousness_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'current_state', 'emerging_risks', 'emerging_opportunities', 'strategic_direction', 'organizational_confidence'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.organizational_consciousness_companion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  advisor_type text not null check (advisor_type in (
    'what_missing', 'where_drifting', 'greatest_opportunity', 'leadership_attention'
  )),
  question text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  evidence_label text not null default '',
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists organizational_consciousness_companion_org_idx
  on public.organizational_consciousness_companion (organization_id, status);

create table if not exists public.organizational_consciousness_long_term (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  horizon_key text not null check (horizon_key in ('one_year', 'three_year', 'five_year', 'ten_year')),
  horizon_label text not null,
  trend_summary text not null default '' check (char_length(trend_summary) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, horizon_key)
);

create table if not exists public.organizational_consciousness_reflection (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  reflection_type text not null check (reflection_type in (
    'what_worked', 'what_failed', 'what_improved', 'what_stagnated', 'what_should_change'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, reflection_type)
);

create table if not exists public.organizational_consciousness_audit (
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

create index if not exists organizational_consciousness_audit_org_idx
  on public.organizational_consciousness_audit (organization_id, created_at desc);

alter table public.organizational_consciousness_settings enable row level security;
alter table public.organizational_consciousness_section_items enable row level security;
alter table public.organizational_consciousness_awareness enable row level security;
alter table public.organizational_consciousness_alignment enable row level security;
alter table public.organizational_consciousness_strategic enable row level security;
alter table public.organizational_consciousness_narrative enable row level security;
alter table public.organizational_consciousness_emerging_signals enable row level security;
alter table public.organizational_consciousness_coherence enable row level security;
alter table public.organizational_consciousness_executive_metrics enable row level security;
alter table public.organizational_consciousness_companion enable row level security;
alter table public.organizational_consciousness_long_term enable row level security;
alter table public.organizational_consciousness_reflection enable row level security;
alter table public.organizational_consciousness_audit enable row level security;
revoke all on public.organizational_consciousness_settings from authenticated, anon;
revoke all on public.organizational_consciousness_section_items from authenticated, anon;
revoke all on public.organizational_consciousness_awareness from authenticated, anon;
revoke all on public.organizational_consciousness_alignment from authenticated, anon;
revoke all on public.organizational_consciousness_strategic from authenticated, anon;
revoke all on public.organizational_consciousness_narrative from authenticated, anon;
revoke all on public.organizational_consciousness_emerging_signals from authenticated, anon;
revoke all on public.organizational_consciousness_coherence from authenticated, anon;
revoke all on public.organizational_consciousness_executive_metrics from authenticated, anon;
revoke all on public.organizational_consciousness_companion from authenticated, anon;
revoke all on public.organizational_consciousness_long_term from authenticated, anon;
revoke all on public.organizational_consciousness_reflection from authenticated, anon;
revoke all on public.organizational_consciousness_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'organizational_consciousness_center', v.description
from (values
  ('organizational_consciousness.view', 'View Organizational Consciousness Center', 'View awareness, alignment, strategic signals, and organizational narrative'),
  ('organizational_consciousness.manage', 'Manage Organizational Consciousness Center', 'Manage reflection items and consciousness settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'organizational_consciousness.view'), ('owner', 'organizational_consciousness.manage'),
  ('administrator', 'organizational_consciousness.view'), ('administrator', 'organizational_consciousness.manage'),
  ('manager', 'organizational_consciousness.view'),
  ('employee', 'organizational_consciousness.view'),
  ('support_agent', 'organizational_consciousness.view'),
  ('moderator', 'organizational_consciousness.view'),
  ('viewer', 'organizational_consciousness.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._oce450_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('organizational_consciousness.manage', v_org_id),
    'can_manage', public._irp_has_permission('organizational_consciousness.manage', v_org_id),
    'can_view', public._irp_has_permission('organizational_consciousness.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._oce450_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organizational_consciousness_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._oce450_section_json(s public.organizational_consciousness_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'metric_label', s.metric_label, 'metric_value', s.metric_value,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._oce450_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organizational_consciousness_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.organizational_consciousness_awareness where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organizational_consciousness_section_items
    (organization_id, section_key, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'organizational_awareness', 'Organizational awareness', 'Unified understanding synthesized from operations, knowledge, relationships, and history.', 'Awareness', 'High', 'verified'),
    (p_org_id, 'strategic_awareness', 'Strategic awareness', 'Growth, competition, customer trends, partner trends, and market signals.', 'Signals', '6 active', 'information'),
    (p_org_id, 'operational_awareness', 'Operational awareness', 'Operations, projects, finance, and execution coherence monitored continuously.', 'Health', '91/100', 'verified'),
    (p_org_id, 'cultural_awareness', 'Cultural awareness', 'Team alignment, communication patterns, and organizational behavior signals.', 'Alignment', 'Moderate', 'requires_attention'),
    (p_org_id, 'organizational_alignment', 'Organizational alignment', 'Conflicting priorities, misaligned objectives, and department friction detected.', 'Issues', '4', 'requires_attention'),
    (p_org_id, 'long_term_trends', 'Long-term trends', '1-year through 10-year organizational trend analysis.', 'Horizons', '4', 'information'),
    (p_org_id, 'emerging_signals', 'Emerging signals', 'Weak signals identified before they become major events.', 'Signals', '5', 'requires_attention');

  insert into public.organizational_consciousness_awareness
    (organization_id, awareness_area, area_name, evaluation_label, signal_label, status_key)
  values
    (p_org_id, 'operations', 'Operations', 'Support and delivery within targets — capacity approaching limit', 'Operational stress rising in peak season', 'requires_attention'),
    (p_org_id, 'customers', 'Customers', 'Customer health 84/100 — retention stable', 'Behavior patterns shifting in hospitality segment', 'requires_attention'),
    (p_org_id, 'employees', 'Employees', 'Team capacity aligned with current workload', 'Knowledge creation slowing in Operations', 'information'),
    (p_org_id, 'projects', 'Projects', '142 active projects — 18 at risk', 'Hospitality Pack on track for Q1 target', 'verified'),
    (p_org_id, 'finance', 'Finance', 'Revenue +12% YoY — cash runway 18 months', 'Sales growth exceeding support cost capacity', 'requires_attention'),
    (p_org_id, 'knowledge', 'Knowledge', 'Corporate brain indexing 4,820 records', 'Knowledge creation rate down 8% QoQ', 'requires_attention'),
    (p_org_id, 'governance', 'Governance', 'Trust score 87/100 — governance compliant', 'Finance approval delays detected', 'verified'),
    (p_org_id, 'business_packs', 'Business Packs', '8 packs active — Hospitality Pack in development', 'Vertical pack demand rising', 'information'),
    (p_org_id, 'integrations', 'Integrations', '12 integrations — all healthy', 'No critical integration signals', 'verified');

  insert into public.organizational_consciousness_alignment
    (organization_id, alignment_type, title, summary, evidence_label, status_key)
  values
    (p_org_id, 'conflicting_priorities', 'Sales growth vs support capacity', 'Sales growth goals exceed current support capacity during peak season.', 'Sales pipeline +22% · Support capacity +8%', 'requires_attention'),
    (p_org_id, 'misaligned_objectives', 'Expansion vs staffing plans', 'Expansion plans exceed staffing plans for Nordic market entry.', 'Partner pipeline ready · Hiring plan 6 months behind', 'requires_attention'),
    (p_org_id, 'department_friction', 'Product velocity vs operational maturity', 'Feature velocity prioritized while operational maturity signals rising importance.', 'Support tickets +18% · Feature releases on schedule', 'information'),
    (p_org_id, 'communication_gaps', 'Cross-department priority visibility', 'Finance and Operations lack shared visibility on approval bottlenecks.', 'Approval Intelligence · department survey metadata', 'waiting');

  insert into public.organizational_consciousness_strategic
    (organization_id, strategic_type, title, trend_label, status_key)
  values
    (p_org_id, 'growth', 'Growth trajectory', '+18% ARR — scaling phase entered', 'verified'),
    (p_org_id, 'competition', 'Competitive landscape', 'New entrants in hospitality AI segment', 'requires_attention'),
    (p_org_id, 'customer_trends', 'Customer trends', 'Hospitality segment inquiry volume +34% QoQ', 'information'),
    (p_org_id, 'partner_trends', 'Partner trends', 'Growth Partner pipeline strong in Nordic markets', 'verified'),
    (p_org_id, 'technology_trends', 'Technology trends', 'Enterprise AI governance requirements increasing', 'information'),
    (p_org_id, 'market_signals', 'Market signals', 'Mid-market requesting enterprise features at scale', 'verified');

  insert into public.organizational_consciousness_narrative
    (organization_id, narrative_type, title, narrative, status_key)
  values
    (p_org_id, 'current_state', 'Where we are today', 'Aipify has entered a scaling phase where operational maturity is becoming more important than feature velocity.', 'information'),
    (p_org_id, 'direction', 'Where we are heading', 'Vertical Business Packs, partner-led expansion, and enterprise governance positioning define the next 18 months.', 'verified'),
    (p_org_id, 'what_changed', 'What has changed', 'Segment concentration reduced from 52% to 41%. Support volume approaching capacity. Knowledge creation slowing.', 'requires_attention'),
    (p_org_id, 'what_next', 'What should happen next', 'Prioritize support capacity, accelerate Hospitality Pack launch, and align staffing with expansion plans.', 'waiting');

  insert into public.organizational_consciousness_emerging_signals
    (organization_id, signal_type, title, summary, evidence_label, status_key)
  values
    (p_org_id, 'customer_behavior', 'Customer behavior shifting', 'Hospitality segment customers requesting enterprise features earlier in lifecycle.', 'Segment inquiry trends · support category metadata', 'requires_attention'),
    (p_org_id, 'knowledge_creation', 'Knowledge creation slowing', 'Approved knowledge source contributions down 8% quarter-over-quarter.', 'Corporate brain · employee knowledge metrics', 'requires_attention'),
    (p_org_id, 'support_demand', 'Support demand accelerating', 'Support ticket volume increasing faster than staffing growth.', 'Support metrics · 30-day trend', 'requires_attention'),
    (p_org_id, 'operational_stress', 'Operational stress in peak season', 'Response times approaching SLA threshold during peak periods.', 'Operations dashboard · capacity model', 'waiting'),
    (p_org_id, 'market_shift', 'Market shift toward governance', 'Enterprise prospects requesting governance and audit capabilities in evaluations.', 'Sales pipeline metadata · RFP patterns', 'information');

  insert into public.organizational_consciousness_coherence
    (organization_id, coherence_dimension, dimension_name, alignment_score_label, status_key)
  values
    (p_org_id, 'vision', 'Vision', '92% aligned', 'verified'),
    (p_org_id, 'strategy', 'Strategy', '86% aligned', 'verified'),
    (p_org_id, 'operations', 'Operations', '78% aligned', 'requires_attention'),
    (p_org_id, 'execution', 'Execution', '84% aligned', 'verified'),
    (p_org_id, 'results', 'Results', '88% aligned', 'verified');

  insert into public.organizational_consciousness_executive_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'current_state', 'Scaling phase', 'Operational maturity rising in importance', 'information'),
    (p_org_id, 'emerging_risks', '4 active', 'Support capacity · knowledge slowdown · alignment gaps', 'requires_attention'),
    (p_org_id, 'emerging_opportunities', '3 active', 'Hospitality Pack · Nordic expansion · enterprise tier', 'verified'),
    (p_org_id, 'strategic_direction', 'Vertical + partner-led', 'Business Packs and Growth Partners define GTM', 'verified'),
    (p_org_id, 'organizational_confidence', 'High', 'Trust 87 · governance compliant · revenue growing', 'verified');

  insert into public.organizational_consciousness_companion
    (organization_id, advisor_type, question, insight, evidence_label)
  values
    (p_org_id, 'what_missing', 'What are we missing?', 'Support capacity planning has not kept pace with sales growth — the greatest gap is operational readiness for the scaling phase.', 'Alignment analysis · awareness engine · emerging signals'),
    (p_org_id, 'where_drifting', 'Where are we drifting?', 'Feature velocity remains prioritized while operational maturity signals indicate it should become the primary focus.', 'Coherence engine · narrative · reflection'),
    (p_org_id, 'greatest_opportunity', 'What is our greatest opportunity?', 'Hospitality Business Pack with +34% segment inquiry growth — pilot validation complete, launch timing favorable.', 'Strategic awareness · corporate brain · board recommendations'),
    (p_org_id, 'leadership_attention', 'What should leadership pay attention to now?', 'Align staffing plans with expansion timeline and resolve support capacity before peak season.', 'Emerging signals · alignment · executive dashboard');

  insert into public.organizational_consciousness_long_term
    (organization_id, horizon_key, horizon_label, trend_summary, status_key)
  values
    (p_org_id, 'one_year', '1 Year', 'Hospitality Pack launch, support capacity expansion, segment diversification below 30%.', 'verified'),
    (p_org_id, 'three_year', '3 Years', 'Nordic expansion, 3 new Business Packs, enterprise governance positioning.', 'information'),
    (p_org_id, 'five_year', '5 Years', 'Global ABOS platform — trusted organizational consciousness for 10,000+ organizations.', 'information'),
    (p_org_id, 'ten_year', '10 Years', 'Organizational wisdom layer — beyond information management toward institutional understanding.', 'verified');

  insert into public.organizational_consciousness_reflection
    (organization_id, reflection_type, title, summary, status_key)
  values
    (p_org_id, 'what_worked', 'What worked', 'Vertical Business Pack strategy — Aipify Hosts exceeded ARR target by 15%. Partner-led GTM reduced capital intensity.', 'completed'),
    (p_org_id, 'what_failed', 'What failed', 'Vendor migration caused 2-week delay — lesson captured in corporate brain.', 'requires_attention'),
    (p_org_id, 'what_improved', 'What improved', 'Segment concentration reduced from 52% to 41%. Trust score increased to 87/100.', 'verified'),
    (p_org_id, 'what_stagnated', 'What stagnated', 'Knowledge creation rate declined 8% QoQ — institutional knowledge capture needs attention.', 'requires_attention'),
    (p_org_id, 'what_should_change', 'What should change', 'Prioritize operational maturity over feature velocity during scaling phase.', 'waiting');

end; $$;

create or replace function public.get_organizational_consciousness_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_settings jsonb;
  v_org_s jsonb; v_strat_s jsonb; v_ops_s jsonb; v_cult_s jsonb;
  v_align_s jsonb; v_trend_s jsonb; v_signal_s jsonb;
  v_awareness jsonb; v_alignment jsonb; v_strategic jsonb; v_narrative jsonb;
  v_emerging jsonb; v_coherence jsonb; v_exec jsonb; v_companion jsonb;
  v_long_term jsonb; v_reflection jsonb;
begin
  perform public._irp_require_permission('organizational_consciousness.view');
  v_ctx := public._oce450_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._oce450_seed(v_org_id);

  select jsonb_build_object(
    'consciousness_enabled', s.consciousness_enabled,
    'human_control_required', s.human_control_required
  ) into v_settings
  from public.organizational_consciousness_settings s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(public._oce450_section_json(s)), '[]'::jsonb) into v_org_s
  from public.organizational_consciousness_section_items s where s.organization_id = v_org_id and s.section_key = 'organizational_awareness';
  select coalesce(jsonb_agg(public._oce450_section_json(s)), '[]'::jsonb) into v_strat_s
  from public.organizational_consciousness_section_items s where s.organization_id = v_org_id and s.section_key = 'strategic_awareness';
  select coalesce(jsonb_agg(public._oce450_section_json(s)), '[]'::jsonb) into v_ops_s
  from public.organizational_consciousness_section_items s where s.organization_id = v_org_id and s.section_key = 'operational_awareness';
  select coalesce(jsonb_agg(public._oce450_section_json(s)), '[]'::jsonb) into v_cult_s
  from public.organizational_consciousness_section_items s where s.organization_id = v_org_id and s.section_key = 'cultural_awareness';
  select coalesce(jsonb_agg(public._oce450_section_json(s)), '[]'::jsonb) into v_align_s
  from public.organizational_consciousness_section_items s where s.organization_id = v_org_id and s.section_key = 'organizational_alignment';
  select coalesce(jsonb_agg(public._oce450_section_json(s)), '[]'::jsonb) into v_trend_s
  from public.organizational_consciousness_section_items s where s.organization_id = v_org_id and s.section_key = 'long_term_trends';
  select coalesce(jsonb_agg(public._oce450_section_json(s)), '[]'::jsonb) into v_signal_s
  from public.organizational_consciousness_section_items s where s.organization_id = v_org_id and s.section_key = 'emerging_signals';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'awareness_area', a.awareness_area, 'area_name', a.area_name,
    'evaluation_label', a.evaluation_label, 'signal_label', a.signal_label,
    'status_key', a.status_key, 'item_type', 'awareness'
  ) order by a.area_name), '[]'::jsonb)
  into v_awareness from public.organizational_consciousness_awareness a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', al.id, 'alignment_type', al.alignment_type, 'title', al.title,
    'summary', al.summary, 'evidence_label', al.evidence_label,
    'status_key', al.status_key, 'item_type', 'alignment'
  ) order by al.title), '[]'::jsonb)
  into v_alignment from public.organizational_consciousness_alignment al where al.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'strategic_type', s.strategic_type, 'title', s.title,
    'trend_label', s.trend_label, 'status_key', s.status_key, 'item_type', 'strategic'
  ) order by s.title), '[]'::jsonb)
  into v_strategic from public.organizational_consciousness_strategic s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', n.id, 'narrative_type', n.narrative_type, 'title', n.title,
    'narrative', n.narrative, 'status_key', n.status_key, 'item_type', 'narrative'
  ) order by case n.narrative_type when 'current_state' then 1 when 'direction' then 2 when 'what_changed' then 3 else 4 end), '[]'::jsonb)
  into v_narrative from public.organizational_consciousness_narrative n where n.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'signal_type', e.signal_type, 'title', e.title, 'summary', e.summary,
    'evidence_label', e.evidence_label, 'status_key', e.status_key, 'item_type', 'emerging_signal'
  ) order by e.title), '[]'::jsonb)
  into v_emerging from public.organizational_consciousness_emerging_signals e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'coherence_dimension', c.coherence_dimension, 'dimension_name', c.dimension_name,
    'alignment_score_label', c.alignment_score_label, 'status_key', c.status_key, 'item_type', 'coherence'
  ) order by case c.coherence_dimension when 'vision' then 1 when 'strategy' then 2 when 'operations' then 3 when 'execution' then 4 else 5 end), '[]'::jsonb)
  into v_coherence from public.organizational_consciousness_coherence c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_value', m.metric_value,
    'trend_label', m.trend_label, 'status_key', m.status_key, 'item_type', 'executive'
  ) order by case m.metric_key
    when 'current_state' then 1 when 'emerging_risks' then 2 when 'emerging_opportunities' then 3
    when 'strategic_direction' then 4 else 5 end), '[]'::jsonb)
  into v_exec from public.organizational_consciousness_executive_metrics m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'advisor_type', c.advisor_type, 'question', c.question,
    'insight', c.insight, 'evidence_label', c.evidence_label,
    'status', c.status, 'item_type', 'companion'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_companion from public.organizational_consciousness_companion c
  where c.organization_id = v_org_id and c.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'horizon_key', l.horizon_key, 'horizon_label', l.horizon_label,
    'trend_summary', l.trend_summary, 'status_key', l.status_key, 'item_type', 'long_term'
  ) order by case l.horizon_key when 'one_year' then 1 when 'three_year' then 2 when 'five_year' then 3 else 4 end), '[]'::jsonb)
  into v_long_term from public.organizational_consciousness_long_term l where l.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'reflection_type', r.reflection_type, 'title', r.title,
    'summary', r.summary, 'status_key', r.status_key, 'item_type', 'reflection'
  ) order by case r.reflection_type
    when 'what_worked' then 1 when 'what_failed' then 2 when 'what_improved' then 3
    when 'what_stagnated' then 4 else 5 end), '[]'::jsonb)
  into v_reflection from public.organizational_consciousness_reflection r where r.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Data is not understanding. Knowledge is not wisdom. Aipify synthesizes information into organizational understanding — explainable, auditable, evidence-based, and human-controlled.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'All awareness outputs are explainable, auditable, evidence-based, and human-controlled. No autonomous strategic authority.',
    'consciousness_settings', coalesce(v_settings, '{}'::jsonb),
    'awareness_engine', v_awareness,
    'organizational_alignment_analysis', v_alignment,
    'strategic_awareness_layer', v_strategic,
    'organizational_narrative_engine', v_narrative,
    'emerging_signal_detection', v_emerging,
    'organizational_coherence_engine', v_coherence,
    'executive_awareness_dashboard', v_exec,
    'companion_strategic_advisor', v_companion,
    'long_term_intelligence_layer', v_long_term,
    'reflection_engine', v_reflection,
    'sections', jsonb_build_object(
      'organizational_awareness', v_org_s,
      'strategic_awareness', v_strat_s,
      'operational_awareness', v_ops_s,
      'cultural_awareness', v_cult_s,
      'organizational_alignment', v_align_s,
      'long_term_trends', v_trend_s,
      'emerging_signals', v_signal_s
    ),
    'statistics', jsonb_build_object(
      'awareness_count', jsonb_array_length(v_awareness),
      'alignment_count', jsonb_array_length(v_alignment),
      'signal_count', jsonb_array_length(v_emerging),
      'reflection_count', jsonb_array_length(v_reflection),
      'companion_count', jsonb_array_length(v_companion)
    ),
    'privacy_note', 'Organizational consciousness metadata and aggregate signals only — no raw communications or unapproved PII.'
  );
end; $$;

create or replace function public.manage_organizational_consciousness_item(
  p_item_type text,
  p_item_id uuid default null,
  p_action text default 'acknowledge',
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._oce450_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'escalate', 'resolve') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'companion' and p_item_id is not null then
    update public.organizational_consciousness_companion set
      status = case p_action when 'acknowledge' then 'acknowledged' when 'dismiss' then 'dismissed' else status end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'emerging_signal' and p_item_id is not null then
    update public.organizational_consciousness_emerging_signals set
      status_key = case p_action
        when 'acknowledge' then 'information'
        when 'escalate' then 'requires_attention'
        when 'resolve' then 'verified'
        else status_key
      end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'alignment' and p_item_id is not null then
    update public.organizational_consciousness_alignment set
      status_key = case p_action when 'resolve' then 'verified' when 'escalate' then 'requires_attention' else status_key end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._oce450_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Organizational consciousness item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_organizational_consciousness_center() to authenticated;
grant execute on function public.manage_organizational_consciousness_item(text, uuid, text, jsonb) to authenticated;
