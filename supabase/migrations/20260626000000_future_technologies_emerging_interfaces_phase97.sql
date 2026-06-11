-- Phase 97 — Future Technologies & Emerging Interfaces Framework
-- Principle: Prepared for tomorrow. Valuable today.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies'
  )
);

-- ---------------------------------------------------------------------------
-- 1. future_tech_settings
-- ---------------------------------------------------------------------------
create table if not exists public.future_tech_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  observatory_enabled boolean not null default true,
  scenario_planning_enabled boolean not null default true,
  voice_readiness_tracking boolean not null default true,
  multimodal_exploration boolean not null default true,
  human_approval_required boolean not null default true,
  interoperability_focus boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.future_tech_settings enable row level security;
revoke all on public.future_tech_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. technology observations + trend reports
-- ---------------------------------------------------------------------------
create table if not exists public.future_technology_observations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  observation_key text not null,
  title text not null,
  description text not null,
  observation_area text not null check (
    observation_area in (
      'ai_advancements', 'human_computer_interaction', 'automation',
      'digital_workplace', 'collaboration', 'infrastructure'
    )
  ),
  maturity_level text not null default 'emerging' check (
    maturity_level in ('emerging', 'developing', 'maturing', 'established')
  ),
  relevance_score numeric(5, 2) not null default 0 check (relevance_score between 0 and 100),
  status text not null default 'active' check (status in ('active', 'monitoring', 'archived')),
  unique (tenant_id, observation_key)
);

alter table public.future_technology_observations enable row level security;
revoke all on public.future_technology_observations from authenticated, anon;

create table if not exists public.future_trend_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  report_key text not null,
  title text not null,
  summary text not null,
  trend_category text not null default 'interface' check (
    trend_category in ('interface', 'automation', 'collaboration', 'infrastructure', 'ai_capability')
  ),
  impact_level text not null default 'medium' check (impact_level in ('low', 'medium', 'high')),
  published_at timestamptz not null default now(),
  unique (tenant_id, report_key)
);

alter table public.future_trend_reports enable row level security;
revoke all on public.future_trend_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. emerging initiatives + pilot opportunities
-- ---------------------------------------------------------------------------
create table if not exists public.future_emerging_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  title text not null,
  description text not null,
  interface_type text not null check (
    interface_type in (
      'conversational', 'voice', 'multimodal', 'wearable', 'ambient',
      'augmented_reality', 'virtual_collaboration', 'digital_companion'
    )
  ),
  status text not null default 'exploration' check (
    status in ('exploration', 'assessment', 'pilot', 'evaluated', 'deferred', 'adopted')
  ),
  business_value_score numeric(5, 2) not null default 0,
  governance_compatible boolean not null default true,
  unique (tenant_id, initiative_key)
);

alter table public.future_emerging_initiatives enable row level security;
revoke all on public.future_emerging_initiatives from authenticated, anon;

create table if not exists public.future_pilot_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_id uuid references public.future_emerging_initiatives (id) on delete set null,
  opportunity_key text not null,
  title text not null,
  description text not null,
  status text not null default 'open' check (
    status in ('open', 'recruiting', 'active', 'completed', 'cancelled')
  ),
  participant_type text not null default 'customer' check (
    participant_type in ('customer', 'partner', 'internal', 'advisory_board')
  ),
  unique (tenant_id, opportunity_key)
);

alter table public.future_pilot_opportunities enable row level security;
revoke all on public.future_pilot_opportunities from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. assessments, scenarios, reviews, recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.future_readiness_assessments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  assessment_type text not null check (
    assessment_type in ('technology_maturity', 'innovation_readiness', 'workforce_preparedness', 'strategic_implications')
  ),
  title text not null,
  summary text not null,
  readiness_score numeric(5, 2) not null default 0 check (readiness_score between 0 and 100),
  created_at timestamptz not null default now()
);

alter table public.future_readiness_assessments enable row level security;
revoke all on public.future_readiness_assessments from authenticated, anon;

create table if not exists public.future_scenario_plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scenario_key text not null,
  title text not null,
  description text not null,
  time_horizon text not null default 'medium_term' check (
    time_horizon in ('near_term', 'medium_term', 'long_term')
  ),
  status text not null default 'draft' check (status in ('draft', 'active', 'reviewed', 'archived')),
  unique (tenant_id, scenario_key)
);

alter table public.future_scenario_plans enable row level security;
revoke all on public.future_scenario_plans from authenticated, anon;

create table if not exists public.future_technology_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_id uuid references public.future_emerging_initiatives (id) on delete set null,
  review_type text not null check (
    review_type in ('business_value', 'ethical', 'security', 'governance', 'operational_feasibility')
  ),
  title text not null,
  outcome text not null default 'pending' check (
    outcome in ('pending', 'approved', 'needs_work', 'declined')
  ),
  score numeric(5, 2),
  notes text,
  reviewed_at timestamptz
);

alter table public.future_technology_reviews enable row level security;
revoke all on public.future_technology_reviews from authenticated, anon;

create table if not exists public.future_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  title text not null,
  description text not null,
  recommendation_type text not null check (
    recommendation_type in ('opportunity', 'readiness_gap', 'pilot_candidate', 'risk_mitigation', 'interoperability')
  ),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table public.future_recommendations enable row level security;
revoke all on public.future_recommendations from authenticated, anon;

create table if not exists public.future_tech_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.future_tech_briefings enable row level security;
revoke all on public.future_tech_briefings from authenticated, anon;

create table if not exists public.future_tech_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.future_tech_audit_log enable row level security;
revoke all on public.future_tech_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers (_ftei_)
-- ---------------------------------------------------------------------------
create or replace function public._ftei_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ftei_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.future_tech_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'future_technologies_' || p_event_type, 'future_technologies', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._ftei_ensure_settings(p_tenant_id uuid)
returns public.future_tech_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.future_tech_settings;
begin
  insert into public.future_tech_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.future_tech_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ftei_interface_label(p_type text)
returns text language sql immutable as $$
  select case p_type
    when 'conversational' then 'Conversational Interface'
    when 'voice' then 'Voice Experience'
    when 'multimodal' then 'Multimodal Interaction'
    when 'wearable' then 'Wearable Integration'
    when 'ambient' then 'Ambient Computing'
    when 'augmented_reality' then 'Augmented Reality'
    when 'virtual_collaboration' then 'Virtual Collaboration'
    when 'digital_companion' then 'Digital Companion'
    else initcap(replace(p_type, '_', ' '))
  end;
$$;

create or replace function public._ftei_seed_observations(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.future_technology_observations (
    tenant_id, observation_key, title, description, observation_area, maturity_level, relevance_score
  )
  select p_tenant_id, v.key, v.title, v.desc, v.area, v.maturity, v.score
  from (values
    ('agentic_ai', 'Agentic AI Workflows', 'Autonomous multi-step AI agents with human oversight.', 'ai_advancements', 'developing', 92.0),
    ('multimodal_llm', 'Multimodal AI Models', 'Combined text, voice, image and document understanding.', 'ai_advancements', 'maturing', 88.0),
    ('voice_assistants', 'Enterprise Voice Assistants', 'Hands-free operational guidance and briefings.', 'human_computer_interaction', 'emerging', 75.0),
    ('ambient_workplace', 'Ambient Workplace Computing', 'Context-aware assistance with minimal disruption.', 'digital_workplace', 'emerging', 70.0),
    ('immersive_collab', 'Immersive Collaboration', 'Virtual workspaces for distributed teams.', 'collaboration', 'emerging', 65.0),
    ('edge_ai', 'Edge AI Infrastructure', 'On-device inference for latency-sensitive workflows.', 'infrastructure', 'developing', 78.0)
  ) as v(key, title, desc, area, maturity, score)
  where not exists (select 1 from public.future_technology_observations o where o.tenant_id = p_tenant_id and o.observation_key = v.key);
end; $$;

create or replace function public._ftei_seed_initiatives(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.future_emerging_initiatives (
    tenant_id, initiative_key, title, description, interface_type, status, business_value_score, governance_compatible
  )
  select p_tenant_id, v.key, v.title, v.desc, v.type, v.status, v.score, v.gov
  from (values
    ('voice_briefings', 'Voice Executive Briefings', 'Hands-free daily briefing delivery for executives.', 'voice', 'assessment', 82.0, true),
    ('multimodal_assistant', 'Multimodal Assistant', 'Combine text, voice, documents and visual context.', 'multimodal', 'pilot', 88.0, true),
    ('ambient_nudges', 'Ambient Operational Nudges', 'Timely, low-friction workflow guidance.', 'ambient', 'exploration', 76.0, true),
    ('wearable_approvals', 'Wearable Quick Approvals', 'Smartwatch notifications for urgent approvals.', 'wearable', 'exploration', 68.0, true),
    ('vr_collab_lab', 'Virtual Collaboration Lab', 'Immersive meeting environments for remote teams.', 'virtual_collaboration', 'exploration', 62.0, true),
    ('digital_companion_v2', 'Proactive Digital Companion', 'Contextual recommendations with human approval.', 'digital_companion', 'assessment', 85.0, true)
  ) as v(key, title, desc, type, status, score, gov)
  where not exists (select 1 from public.future_emerging_initiatives i where i.tenant_id = p_tenant_id and i.initiative_key = v.key);
end; $$;

create or replace function public._ftei_seed_scenarios(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.future_scenario_plans (tenant_id, scenario_key, title, description, time_horizon, status)
  select p_tenant_id, v.key, v.title, v.desc, v.horizon, v.status
  from (values
    ('voice_first_ops', 'Voice-First Operations', 'Operations teams rely on voice for routine guidance.', 'medium_term', 'active'),
    ('multimodal_default', 'Multimodal as Default', 'Most interactions combine text, voice and documents.', 'long_term', 'draft'),
    ('ambient_workforce', 'Ambient Workforce Assistant', 'Proactive assistance integrated into daily workflows.', 'long_term', 'draft')
  ) as v(key, title, desc, horizon, status)
  where not exists (select 1 from public.future_scenario_plans s where s.tenant_id = p_tenant_id and s.scenario_key = v.key);
end; $$;

create or replace function public._ftei_seed_pilots(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.future_pilot_opportunities (tenant_id, initiative_id, opportunity_key, title, description, status, participant_type)
  select p_tenant_id, i.id, 'multimodal_pilot', 'Multimodal Assistant Pilot', 'Customer beta for multimodal interaction patterns.', 'recruiting', 'customer'
  from public.future_emerging_initiatives i
  where i.tenant_id = p_tenant_id and i.initiative_key = 'multimodal_assistant'
  on conflict (tenant_id, opportunity_key) do nothing;

  insert into public.future_pilot_opportunities (tenant_id, opportunity_key, title, description, status, participant_type)
  select p_tenant_id, v.key, v.title, v.desc, v.status, v.ptype
  from (values
    ('voice_exec_beta', 'Voice Briefing Beta', 'Executive voice briefing pilot with selected customers.', 'open', 'customer'),
    ('partner_immersive', 'Partner Immersive Workshop', 'Partner-led exploration of collaboration interfaces.', 'open', 'partner')
  ) as v(key, title, desc, status, ptype)
  where not exists (select 1 from public.future_pilot_opportunities p where p.tenant_id = p_tenant_id and p.opportunity_key = v.key);
end; $$;

create or replace function public._ftei_seed_recommendations(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.future_recommendations (tenant_id, title, description, recommendation_type, priority)
  select p_tenant_id, v.title, v.desc, v.type, v.pri
  from (values
    ('Prioritize multimodal assistant pilot', 'Highest business value with strong governance compatibility.', 'pilot_candidate', 'high'),
    ('Assess voice readiness for executive workflows', 'Voice briefings show strong potential for accessibility gains.', 'opportunity', 'medium'),
    ('Review interoperability for wearable integrations', 'Avoid lock-in with emerging wearable ecosystems.', 'interoperability', 'medium'),
    ('Workforce preparedness for ambient assistance', 'Teams may need guidance on proactive AI interactions.', 'readiness_gap', 'low')
  ) as v(title, desc, type, pri)
  where not exists (select 1 from public.future_recommendations r where r.tenant_id = p_tenant_id limit 1);
end; $$;

create or replace function public._ftei_refresh_assessments(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_avg_relevance numeric; v_future_readiness numeric;
begin
  select coalesce(avg(relevance_score), 0) into v_avg_relevance
  from public.future_technology_observations where tenant_id = p_tenant_id and status = 'active';

  v_future_readiness := least(100, round(v_avg_relevance * 0.75 + 15, 1));

  delete from public.future_readiness_assessments where tenant_id = p_tenant_id;
  insert into public.future_readiness_assessments (tenant_id, assessment_type, title, summary, readiness_score)
  values
    (p_tenant_id, 'technology_maturity', 'Technology Maturity Assessment', 'Emerging interfaces tracked across AI, voice, and collaboration.', v_future_readiness),
    (p_tenant_id, 'innovation_readiness', 'Innovation Readiness', 'Organization prepared for controlled future technology pilots.', round(v_future_readiness * 0.9, 1)),
    (p_tenant_id, 'workforce_preparedness', 'Workforce Preparedness', 'Teams benefit from scenario planning and Academy education.', round(v_future_readiness * 0.85, 1)),
    (p_tenant_id, 'strategic_implications', 'Strategic Implications', 'Future technologies align with governance and business value principles.', round(v_future_readiness * 0.95, 1));

  delete from public.future_trend_reports where tenant_id = p_tenant_id;
  insert into public.future_trend_reports (tenant_id, report_key, title, summary, trend_category, impact_level)
  values
    (p_tenant_id, 'multimodal_trend', 'Multimodal AI Convergence', 'Text, voice and visual inputs increasingly unified in enterprise AI.', 'ai_capability', 'high'),
    (p_tenant_id, 'voice_enterprise', 'Voice in Enterprise Workflows', 'Hands-free operations gaining traction in executive and field roles.', 'interface', 'medium'),
    (p_tenant_id, 'ambient_assist', 'Ambient Assistance Patterns', 'Proactive, low-friction guidance without overwhelming users.', 'interface', 'medium');

  return jsonb_build_object(
    'future_readiness_score', v_future_readiness,
    'avg_technology_relevance', round(v_avg_relevance, 1),
    'active_initiatives', (select count(*) from public.future_emerging_initiatives where tenant_id = p_tenant_id and status in ('exploration', 'assessment', 'pilot')),
    'open_pilot_opportunities', (select count(*) from public.future_pilot_opportunities where tenant_id = p_tenant_id and status in ('open', 'recruiting', 'active'))
  );
end; $$;

create or replace function public._ftei_trust_explanation(p_tenant_id uuid, p_score numeric)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.generate_decision_explanation(
    'ftei-score-' || p_tenant_id::text,
    'future_technologies',
    'future_technologies',
    'Future readiness: ' || p_score || '/100',
    'The future should be understood, evaluated and approached with intention.',
    jsonb_build_array(
      jsonb_build_object('source', 'technology_observations'),
      jsonb_build_object('source', 'emerging_initiatives'),
      jsonb_build_object('source', 'readiness_assessments')
    ),
    jsonb_build_array('human_approval', 'governance_compatible', 'audit_logged'),
    'medium', '[]'::jsonb, '[]'::jsonb
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.advance_emerging_initiative(p_initiative_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_new_status text;
begin
  v_tenant_id := public._ftei_require_tenant();
  select case status
    when 'exploration' then 'assessment'
    when 'assessment' then 'pilot'
    when 'pilot' then 'evaluated'
    when 'evaluated' then 'adopted'
    else status
  end into v_new_status
  from public.future_emerging_initiatives where id = p_initiative_id and tenant_id = v_tenant_id;

  if v_new_status is null then return jsonb_build_object('error', 'Initiative not found'); end if;

  update public.future_emerging_initiatives set status = v_new_status
  where id = p_initiative_id and tenant_id = v_tenant_id;

  perform public._ftei_log_audit(v_tenant_id, 'initiative_advanced', 'Initiative advanced to ' || v_new_status, 'emerging_interfaces',
    jsonb_build_object('initiative_id', p_initiative_id, 'status', v_new_status));
  return jsonb_build_object('status', v_new_status);
end; $$;

create or replace function public.dismiss_future_recommendation(p_recommendation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ftei_require_tenant();
  update public.future_recommendations set status = 'dismissed'
  where id = p_recommendation_id and tenant_id = v_tenant_id;
  perform public._ftei_log_audit(v_tenant_id, 'recommendation_dismissed', 'Future recommendation dismissed', 'observatory',
    jsonb_build_object('recommendation_id', p_recommendation_id));
  return jsonb_build_object('status', 'dismissed');
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_future_technologies_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_metrics jsonb;
  v_id uuid;
  v_summary text;
begin
  v_tenant_id := public._ftei_require_tenant();
  perform public._ftei_ensure_settings(v_tenant_id);
  perform public._ftei_seed_observations(v_tenant_id);
  perform public._ftei_seed_initiatives(v_tenant_id);
  v_metrics := public._ftei_refresh_assessments(v_tenant_id);

  v_summary := 'Future technologies briefing: readiness ' || (v_metrics->>'future_readiness_score') || '/100, '
    || (v_metrics->>'active_initiatives') || ' active initiatives, '
    || (v_metrics->>'open_pilot_opportunities') || ' pilot opportunities.';

  insert into public.future_tech_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_metrics)
  returning id into v_id;

  perform public._ftei_log_audit(v_tenant_id, 'briefing_generated', v_summary, 'executive_dashboard', v_metrics);
  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_future_technologies_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._ftei_ensure_settings(v_tenant_id);
  perform public._ftei_seed_observations(v_tenant_id);
  v_metrics := public._ftei_refresh_assessments(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'future_readiness_score', v_metrics->'future_readiness_score',
    'active_initiatives', v_metrics->'active_initiatives',
    'philosophy', 'Prepared for tomorrow. Valuable today.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_future_technologies_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.future_tech_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._ftei_require_tenant();
  v_settings := public._ftei_ensure_settings(v_tenant_id);
  perform public._ftei_seed_observations(v_tenant_id);
  perform public._ftei_seed_initiatives(v_tenant_id);
  perform public._ftei_seed_scenarios(v_tenant_id);
  perform public._ftei_seed_pilots(v_tenant_id);
  perform public._ftei_seed_recommendations(v_tenant_id);
  v_metrics := public._ftei_refresh_assessments(v_tenant_id);
  perform public._ftei_trust_explanation(v_tenant_id, (v_metrics->>'future_readiness_score')::numeric);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'philosophy', 'Prepared for tomorrow. Valuable today.',
    'safety_note', 'Aipify augments human capabilities — future initiatives require human approval and governance alignment.',
    'observatory_enabled', v_settings.observatory_enabled,
    'scenario_planning_enabled', v_settings.scenario_planning_enabled,
    'voice_readiness_tracking', v_settings.voice_readiness_tracking,
    'multimodal_exploration', v_settings.multimodal_exploration,
    'human_approval_required', v_settings.human_approval_required,
    'interoperability_focus', v_settings.interoperability_focus,
    'future_readiness_score', v_metrics->'future_readiness_score',
    'avg_technology_relevance', v_metrics->'avg_technology_relevance',
    'active_initiatives', v_metrics->'active_initiatives',
    'open_pilot_opportunities', v_metrics->'open_pilot_opportunities',
    'observation_areas', jsonb_build_array(
      'Artificial Intelligence advancements', 'Human-computer interaction models',
      'Automation technologies', 'Digital workplace evolution',
      'Collaboration technologies', 'Infrastructure innovations'
    ),
    'emerging_interfaces', jsonb_build_array(
      jsonb_build_object('type', 'conversational', 'label', public._ftei_interface_label('conversational')),
      jsonb_build_object('type', 'voice', 'label', public._ftei_interface_label('voice')),
      jsonb_build_object('type', 'multimodal', 'label', public._ftei_interface_label('multimodal')),
      jsonb_build_object('type', 'wearable', 'label', public._ftei_interface_label('wearable')),
      jsonb_build_object('type', 'ambient', 'label', public._ftei_interface_label('ambient')),
      jsonb_build_object('type', 'augmented_reality', 'label', public._ftei_interface_label('augmented_reality')),
      jsonb_build_object('type', 'virtual_collaboration', 'label', public._ftei_interface_label('virtual_collaboration'))
    ),
    'technology_observations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'observation_key', o.observation_key, 'title', o.title,
        'description', o.description, 'observation_area', o.observation_area,
        'maturity_level', o.maturity_level, 'relevance_score', o.relevance_score, 'status', o.status
      ) order by o.relevance_score desc)
      from public.future_technology_observations o where o.tenant_id = v_tenant_id and o.status = 'active'
    ), '[]'::jsonb),
    'trend_reports', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'title', r.title, 'summary', r.summary,
        'trend_category', r.trend_category, 'impact_level', r.impact_level
      ) order by r.published_at desc)
      from public.future_trend_reports r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'emerging_initiatives', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'initiative_key', i.initiative_key, 'title', i.title,
        'description', i.description, 'interface_type', i.interface_type,
        'interface_label', public._ftei_interface_label(i.interface_type),
        'status', i.status, 'business_value_score', i.business_value_score,
        'governance_compatible', i.governance_compatible
      ) order by i.business_value_score desc)
      from public.future_emerging_initiatives i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'pilot_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'title', p.title, 'description', p.description,
        'status', p.status, 'participant_type', p.participant_type
      ))
      from public.future_pilot_opportunities p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'readiness_assessments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'assessment_type', a.assessment_type, 'title', a.title,
        'summary', a.summary, 'readiness_score', a.readiness_score
      ))
      from public.future_readiness_assessments a where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'scenario_plans', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'title', s.title, 'description', s.description,
        'time_horizon', s.time_horizon, 'status', s.status
      ))
      from public.future_scenario_plans s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'title', r.title, 'description', r.description,
        'recommendation_type', r.recommendation_type, 'priority', r.priority, 'status', r.status
      ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.future_recommendations r
      where r.tenant_id = v_tenant_id and r.status = 'open' limit 10
    ), '[]'::jsonb),
    'responsible_adoption_principles', jsonb_build_array(
      'Business value', 'Customer benefit', 'Ethical considerations',
      'Security implications', 'Governance compatibility', 'Operational feasibility'
    ),
    'automation_evolution_principles', jsonb_build_array(
      'Human oversight', 'Explainability', 'Reversibility',
      'Governance alignment', 'Risk awareness'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.future_tech_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'innovation_lab', 'Controlled future technology pilots',
      'governance', 'Human approval and ethical evaluations',
      'enterprise_deployment', 'Future-ready architecture',
      'academy', 'Scenario planning and readiness education',
      'strategic_intelligence', 'Trend analysis and opportunity assessments'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'future-technologies', 'Future Technologies', 'Understand emerging trends and prepare for technological change responsibly.', 'authenticated', 41
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'future-technologies' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 9. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_future_technologies_card() to authenticated;
grant execute on function public.get_future_technologies_dashboard() to authenticated;
grant execute on function public.generate_future_technologies_briefing() to authenticated;
grant execute on function public.advance_emerging_initiative(uuid) to authenticated;
grant execute on function public.dismiss_future_recommendation(uuid) to authenticated;
