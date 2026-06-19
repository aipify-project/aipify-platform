-- Phase 600 — Aipify Companion Evolution, Self-Governance & Next-Generation Business Companion Framework
-- Feature owner: CUSTOMER APP
-- Route: /app/evolution/*
-- Helpers: _ce600_*

create table if not exists public.organization_ce600_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  evolution_center_enabled boolean not null default true,
  platform_evolution_enabled boolean not null default true,
  companion_evolution_enabled boolean not null default true,
  innovation_pipeline_enabled boolean not null default true,
  future_opportunity_enabled boolean not null default true,
  self_assessment_enabled boolean not null default true,
  stewardship_enabled boolean not null default true,
  mobile_access_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_ce600_settings enable row level security;
revoke all on public.organization_ce600_settings from authenticated, anon;

create table if not exists public.organization_ce600_platform_phases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  phase_key text not null,
  phase_title text not null,
  phase_type text not null check (
    phase_type in (
      'completed_phase', 'planned_phase', 'requested_feature',
      'customer_request', 'partner_request', 'innovation_opportunity'
    )
  ),
  phase_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, phase_key)
);

alter table public.organization_ce600_platform_phases enable row level security;
revoke all on public.organization_ce600_platform_phases from authenticated, anon;

create table if not exists public.organization_ce600_companion_evolution (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  evolution_key text not null,
  evolution_title text not null,
  evolution_domain text not null check (
    evolution_domain in ('knowledge', 'reasoning', 'workflows', 'recommendations', 'automation', 'governance')
  ),
  evolution_status text not null default 'approved' check (
    evolution_status in ('approved', 'pending_approval', 'restricted')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, evolution_key)
);

alter table public.organization_ce600_companion_evolution enable row level security;
revoke all on public.organization_ce600_companion_evolution from authenticated, anon;

create table if not exists public.organization_ce600_innovation_pipeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pipeline_key text not null,
  pipeline_title text not null,
  pipeline_stage text not null check (
    pipeline_stage in ('idea', 'concept', 'experiment', 'pilot', 'beta', 'released')
  ),
  pipeline_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pipeline_key)
);

alter table public.organization_ce600_innovation_pipeline enable row level security;
revoke all on public.organization_ce600_innovation_pipeline from authenticated, anon;

create table if not exists public.organization_ce600_future_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_key text not null,
  opportunity_title text not null,
  opportunity_type text not null check (
    opportunity_type in (
      'new_market', 'new_business_pack', 'new_integration',
      'revenue_opportunity', 'partner_opportunity'
    )
  ),
  opportunity_status text not null default 'identified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, opportunity_key)
);

alter table public.organization_ce600_future_opportunities enable row level security;
revoke all on public.organization_ce600_future_opportunities from authenticated, anon;

create table if not exists public.organization_ce600_self_assessment (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  assessment_key text not null,
  assessment_title text not null,
  assessment_type text not null check (
    assessment_type in (
      'performance', 'reliability', 'knowledge_quality', 'governance_quality',
      'companion_quality', 'customer_satisfaction'
    )
  ),
  assessment_score integer not null default 75 check (assessment_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, assessment_key)
);

alter table public.organization_ce600_self_assessment enable row level security;
revoke all on public.organization_ce600_self_assessment from authenticated, anon;

create table if not exists public.organization_ce600_capability_roadmap (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  capability_key text not null,
  capability_title text not null,
  capability_status text not null check (
    capability_status in ('current', 'planned', 'experimental', 'deprecated')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, capability_key)
);

alter table public.organization_ce600_capability_roadmap enable row level security;
revoke all on public.organization_ce600_capability_roadmap from authenticated, anon;

create table if not exists public.organization_ce600_pack_evolution (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  pack_evolution_type text not null check (
    pack_evolution_type in (
      'installed', 'recommended', 'emerging', 'future', 'pack_health', 'pack_adoption'
    )
  ),
  pack_score integer not null default 75 check (pack_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_ce600_pack_evolution enable row level security;
revoke all on public.organization_ce600_pack_evolution from authenticated, anon;

create table if not exists public.organization_ce600_readiness_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  readiness_key text not null,
  readiness_title text not null,
  readiness_type text not null check (
    readiness_type in (
      'technology', 'operational', 'governance', 'growth', 'ai_readiness'
    )
  ),
  readiness_score integer not null default 75 check (readiness_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, readiness_key)
);

alter table public.organization_ce600_readiness_reviews enable row level security;
revoke all on public.organization_ce600_readiness_reviews from authenticated, anon;

create table if not exists public.organization_ce600_stewardship (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  stewardship_key text not null,
  stewardship_title text not null,
  debt_type text not null check (
    debt_type in (
      'technical_debt', 'governance_debt', 'knowledge_debt', 'workflow_debt', 'documentation_debt'
    )
  ),
  debt_level text not null default 'moderate' check (
    debt_level in ('low', 'moderate', 'elevated', 'critical')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, stewardship_key)
);

alter table public.organization_ce600_stewardship enable row level security;
revoke all on public.organization_ce600_stewardship from authenticated, anon;

create table if not exists public.organization_ce600_enterprise_program (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  program_key text not null,
  program_title text not null,
  program_type text not null check (
    program_type in (
      'enterprise_customer', 'growth_partner', 'pack_provider', 'platform_administrator', 'ecosystem_participant'
    )
  ),
  program_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, program_key)
);

alter table public.organization_ce600_enterprise_program enable row level security;
revoke all on public.organization_ce600_enterprise_program from authenticated, anon;

create table if not exists public.organization_ce600_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'evolution',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_ce600_audit_logs enable row level security;
revoke all on public.organization_ce600_audit_logs from authenticated, anon;

create or replace function public._ce600_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._ce600_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'evolution'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_ce600_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'evolution'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._ce600_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_ce600_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._ce600_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ce600_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_ce600_platform_phases where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_ce600_platform_phases (
    organization_id, phase_key, phase_title, phase_type, summary
  ) values
    (p_org_id, 'phase_599', 'Phase 599 — AOS Orchestration', 'completed_phase', 'Business Operating System orchestration layer complete.'),
    (p_org_id, 'phase_600', 'Phase 600 — Companion Evolution', 'completed_phase', 'Evolution and self-governance framework established.'),
    (p_org_id, 'phase_601', 'Phase 601 — Planned', 'planned_phase', 'Structured future growth pipeline.'),
    (p_org_id, 'req_analytics', 'Advanced Analytics Pack', 'requested_feature', 'Customer-requested analytics expansion.'),
    (p_org_id, 'req_partner_api', 'Partner API Extensions', 'partner_request', 'Growth partner integration request.'),
    (p_org_id, 'req_mobile', 'Mobile Command Enhancements', 'customer_request', 'Mobile roadmap enhancement request.'),
    (p_org_id, 'inn_ai_governance', 'AI Governance Automation', 'innovation_opportunity', 'Innovation opportunity — governance automation.');

  insert into public.organization_ce600_companion_evolution (
    organization_id, evolution_key, evolution_title, evolution_domain, evolution_status, summary
  ) values
    (p_org_id, 'evo_knowledge', 'Knowledge Improvement', 'knowledge', 'approved', 'Companion may improve knowledge — transparency preserved.'),
    (p_org_id, 'evo_reasoning', 'Reasoning Improvement', 'reasoning', 'approved', 'Better reasoning within governance bounds.'),
    (p_org_id, 'evo_workflows', 'Workflow Improvement', 'workflows', 'approved', 'Workflow suggestions — human approval required.'),
    (p_org_id, 'evo_recommend', 'Recommendation Quality', 'recommendations', 'approved', 'Companion Golden Rule enforced.'),
    (p_org_id, 'evo_automation', 'Automation Improvement', 'automation', 'pending_approval', 'Automation changes require explicit approval.'),
    (p_org_id, 'evo_governance', 'Governance Alignment', 'governance', 'restricted', 'Companion may never bypass governance or override permissions.');

  insert into public.organization_ce600_innovation_pipeline (
    organization_id, pipeline_key, pipeline_title, pipeline_stage, summary
  ) values
    (p_org_id, 'pipe_idea_1', 'Unified Mobile Briefing', 'idea', 'Innovation pipeline — idea stage.'),
    (p_org_id, 'pipe_concept_1', 'Cross-Pack Intelligence', 'concept', 'Concept validated for pilot consideration.'),
    (p_org_id, 'pipe_experiment_1', 'Predictive Governance Alerts', 'experiment', 'Controlled experiment — metadata only.'),
    (p_org_id, 'pipe_pilot_1', 'Hosts Pack Evolution', 'pilot', 'Pilot with approved customer cohort.'),
    (p_org_id, 'pipe_beta_1', 'Evolution Advisor v2', 'beta', 'Beta program — feedback collected.'),
    (p_org_id, 'pipe_released_1', 'AOS Center', 'released', 'Released — Phase 599 foundation.');

  insert into public.organization_ce600_future_opportunities (
    organization_id, opportunity_key, opportunity_title, opportunity_type, summary
  ) values
    (p_org_id, 'opp_market_nordics', 'Nordic Enterprise Expansion', 'new_market', 'New market opportunity identified.'),
    (p_org_id, 'opp_pack_commerce', 'Commerce Intelligence Pack', 'new_business_pack', 'Emerging Business Pack opportunity.'),
    (p_org_id, 'opp_int_erp', 'ERP Integration Layer', 'new_integration', 'Integration opportunity for enterprise customers.'),
    (p_org_id, 'opp_revenue_upsell', 'Enterprise Upsell Path', 'revenue_opportunity', 'Revenue growth through pack adoption.'),
    (p_org_id, 'opp_partner_channel', 'Growth Partner Channel', 'partner_opportunity', 'Partner ecosystem expansion.');

  insert into public.organization_ce600_self_assessment (
    organization_id, assessment_key, assessment_title, assessment_type, assessment_score, summary
  ) values
    (p_org_id, 'assess_perf', 'Platform Performance', 'performance', 84, 'Platform continuously improves.'),
    (p_org_id, 'assess_rel', 'Reliability', 'reliability', 88, 'Operational reliability tracked.'),
    (p_org_id, 'assess_know', 'Knowledge Quality', 'knowledge_quality', 82, 'Knowledge Fabric quality reviewed.'),
    (p_org_id, 'assess_gov', 'Governance Quality', 'governance_quality', 90, 'Governance foundation strong.'),
    (p_org_id, 'assess_comp', 'Companion Quality', 'companion_quality', 86, 'Companion evolution within identity bounds.'),
    (p_org_id, 'assess_csat', 'Customer Satisfaction', 'customer_satisfaction', 79, 'Customer satisfaction monitored.');

  insert into public.organization_ce600_capability_roadmap (
    organization_id, capability_key, capability_title, capability_status, summary
  ) values
    (p_org_id, 'cap_aos', 'AOS Orchestration', 'current', 'Current capability — live.'),
    (p_org_id, 'cap_evolution', 'Evolution Center', 'current', 'Current capability — Phase 600.'),
    (p_org_id, 'cap_future_ai', 'Predictive Evolution', 'planned', 'Planned capability on roadmap.'),
    (p_org_id, 'cap_exp_pack', 'Experimental Pack Composer', 'experimental', 'Experimental — governance review required.'),
    (p_org_id, 'cap_legacy_dash', 'Legacy Dashboard Routes', 'deprecated', 'Deprecated — migrate to /app/* centers.');

  insert into public.organization_ce600_pack_evolution (
    organization_id, pack_key, pack_title, pack_evolution_type, pack_score, summary
  ) values
    (p_org_id, 'pack_support', 'Support Pack', 'installed', 88, 'Installed — healthy adoption.'),
    (p_org_id, 'pack_finance', 'Finance Pack', 'recommended', 82, 'Recommended for operational maturity.'),
    (p_org_id, 'pack_hosts', 'Hosts Pack', 'emerging', 76, 'Emerging pack — pilot interest growing.'),
    (p_org_id, 'pack_commerce', 'Commerce Pack', 'future', 70, 'Future pack on evolution roadmap.'),
    (p_org_id, 'pack_health', 'Pack Health Index', 'pack_health', 85, 'Business Pack ecosystem health.'),
    (p_org_id, 'pack_adopt', 'Pack Adoption Rate', 'pack_adoption', 78, 'Adoption trending upward.');

  insert into public.organization_ce600_readiness_reviews (
    organization_id, readiness_key, readiness_title, readiness_type, readiness_score, summary
  ) values
    (p_org_id, 'ready_tech', 'Technology Readiness', 'technology', 84, 'Technology readiness for next evolution cycle.'),
    (p_org_id, 'ready_ops', 'Operational Readiness', 'operational', 80, 'Operations prepared for growth.'),
    (p_org_id, 'ready_gov', 'Governance Readiness', 'governance', 91, 'Governance controls in place.'),
    (p_org_id, 'ready_growth', 'Growth Readiness', 'growth', 77, 'Growth readiness — opportunities identified.'),
    (p_org_id, 'ready_ai', 'AI Readiness', 'ai_readiness', 83, 'Responsible AI readiness — human control preserved.');

  insert into public.organization_ce600_stewardship (
    organization_id, stewardship_key, stewardship_title, debt_type, debt_level, summary
  ) values
    (p_org_id, 'debt_tech', 'Technical Debt', 'technical_debt', 'moderate', 'Platform stewardship — technical debt tracked.'),
    (p_org_id, 'debt_gov', 'Governance Debt', 'governance_debt', 'low', 'Governance debt minimal.'),
    (p_org_id, 'debt_know', 'Knowledge Debt', 'knowledge_debt', 'moderate', 'Knowledge gaps identified for review.'),
    (p_org_id, 'debt_workflow', 'Workflow Debt', 'workflow_debt', 'low', 'Workflow optimization opportunities.'),
    (p_org_id, 'debt_docs', 'Documentation Debt', 'documentation_debt', 'elevated', 'Documentation refresh recommended.');

  insert into public.organization_ce600_enterprise_program (
    organization_id, program_key, program_title, program_type, summary
  ) values
    (p_org_id, 'prog_enterprise', 'Enterprise Customers', 'enterprise_customer', 'Enterprise evolution program participants.'),
    (p_org_id, 'prog_partner', 'Growth Partners', 'growth_partner', 'Partner evolution track.'),
    (p_org_id, 'prog_provider', 'Business Pack Providers', 'pack_provider', 'Pack provider ecosystem.'),
    (p_org_id, 'prog_platform', 'Platform Administrators', 'platform_administrator', 'Platform stewardship participants.'),
    (p_org_id, 'prog_ecosystem', 'Future Ecosystem', 'ecosystem_participant', 'Future ecosystem participants scaffold.');

  perform public._ce600_log(p_org_id, 'evolution_center_seeded', 'Evolution center baseline seeded — Phase 600 milestone.');
end; $$;

create or replace function public.get_organization_evolution_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_avg_assessment integer;
begin
  v_org_id := public._ce600_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._ce600_seed(v_org_id);

  v_avg_assessment := coalesce((
    select round(avg(assessment_score)) from public.organization_ce600_self_assessment where organization_id = v_org_id
  ), 75);

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Technology changes. Organizations change. Markets change. Aipify must evolve — but trust, governance, transparency, and human control remain unchanged.',
      'privacy_note', 'Evolution tracking uses approved metadata — Companion may improve within governance; identity changes require approval.',
      'foundation_milestone', jsonb_build_object(
        'companion_foundation', true,
        'business_operating_system', true,
        'digital_workforce', true,
        'governance', true,
        'knowledge', true,
        'strategy', true,
        'revenue', true,
        'business_pack', true,
        'executive', true,
        'enterprise', true
      ),
      'executive_dashboard', jsonb_build_object(
        'platform_health_score', v_avg_assessment,
        'completed_phases', (select count(*) from public.organization_ce600_platform_phases where organization_id = v_org_id and phase_type = 'completed_phase'),
        'planned_phases', (select count(*) from public.organization_ce600_platform_phases where organization_id = v_org_id and phase_type = 'planned_phase'),
        'innovation_pipeline', (select count(*) from public.organization_ce600_innovation_pipeline where organization_id = v_org_id),
        'future_opportunities', (select count(*) from public.organization_ce600_future_opportunities where organization_id = v_org_id),
        'open_requests', (select count(*) from public.organization_ce600_platform_phases where organization_id = v_org_id and phase_type in ('customer_request', 'partner_request', 'requested_feature')),
        'companion_recommendations', (select count(*) from public.organization_ce600_future_opportunities where organization_id = v_org_id)
      ),
      'stats', jsonb_build_object(
        'platform_phases', (select count(*) from public.organization_ce600_platform_phases where organization_id = v_org_id),
        'companion_evolution', (select count(*) from public.organization_ce600_companion_evolution where organization_id = v_org_id),
        'innovation_items', (select count(*) from public.organization_ce600_innovation_pipeline where organization_id = v_org_id),
        'opportunities', (select count(*) from public.organization_ce600_future_opportunities where organization_id = v_org_id),
        'capabilities', (select count(*) from public.organization_ce600_capability_roadmap where organization_id = v_org_id),
        'pack_evolution', (select count(*) from public.organization_ce600_pack_evolution where organization_id = v_org_id)
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'opportunity_title', o.opportunity_title, 'recommendation', o.summary, 'opportunity_type', o.opportunity_type
        ) order by o.opportunity_type)
        from public.organization_ce600_future_opportunities o
        where o.organization_id = v_org_id
        limit 4
      ), '[]'::jsonb),
      'self_assessment', coalesce((
        select jsonb_agg(jsonb_build_object(
          'assessment_title', a.assessment_title, 'assessment_type', a.assessment_type,
          'assessment_score', a.assessment_score, 'summary', a.summary
        ) order by a.assessment_score desc)
        from public.organization_ce600_self_assessment a where a.organization_id = v_org_id
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'One Companion. One Platform. One Business Operating System. One Future.',
    'privacy_note', 'Companion becomes future advisor — recommendations prepare and inform; humans decide.',
    'executive_dashboard', jsonb_build_object(
      'platform_health_score', v_avg_assessment,
      'completed_phases', (select count(*) from public.organization_ce600_platform_phases where organization_id = v_org_id and phase_type = 'completed_phase'),
      'planned_phases', (select count(*) from public.organization_ce600_platform_phases where organization_id = v_org_id and phase_type = 'planned_phase'),
      'innovation_pipeline', (select count(*) from public.organization_ce600_innovation_pipeline where organization_id = v_org_id),
      'future_opportunities', (select count(*) from public.organization_ce600_future_opportunities where organization_id = v_org_id),
      'open_requests', (select count(*) from public.organization_ce600_platform_phases where organization_id = v_org_id and phase_type in ('customer_request', 'partner_request', 'requested_feature')),
      'companion_recommendations', (select count(*) from public.organization_ce600_future_opportunities where organization_id = v_org_id)
    ),
    'platform_phases', coalesce((select jsonb_agg(jsonb_build_object(
      'phase_key', p.phase_key, 'phase_title', p.phase_title,
      'phase_type', p.phase_type, 'phase_status', p.phase_status, 'summary', p.summary
    ) order by p.phase_type) from public.organization_ce600_platform_phases p where p.organization_id = v_org_id), '[]'::jsonb),
    'companion_evolution', coalesce((select jsonb_agg(jsonb_build_object(
      'evolution_key', e.evolution_key, 'evolution_title', e.evolution_title,
      'evolution_domain', e.evolution_domain, 'evolution_status', e.evolution_status, 'summary', e.summary
    ) order by e.evolution_domain) from public.organization_ce600_companion_evolution e where e.organization_id = v_org_id), '[]'::jsonb),
    'innovation_pipeline', coalesce((select jsonb_agg(jsonb_build_object(
      'pipeline_key', i.pipeline_key, 'pipeline_title', i.pipeline_title,
      'pipeline_stage', i.pipeline_stage, 'pipeline_status', i.pipeline_status, 'summary', i.summary
    ) order by i.pipeline_stage) from public.organization_ce600_innovation_pipeline i where i.organization_id = v_org_id), '[]'::jsonb),
    'future_opportunities', coalesce((select jsonb_agg(jsonb_build_object(
      'opportunity_key', o.opportunity_key, 'opportunity_title', o.opportunity_title,
      'opportunity_type', o.opportunity_type, 'opportunity_status', o.opportunity_status, 'summary', o.summary
    ) order by o.opportunity_type) from public.organization_ce600_future_opportunities o where o.organization_id = v_org_id), '[]'::jsonb),
    'self_assessment', coalesce((select jsonb_agg(jsonb_build_object(
      'assessment_key', a.assessment_key, 'assessment_title', a.assessment_title,
      'assessment_type', a.assessment_type, 'assessment_score', a.assessment_score, 'summary', a.summary
    ) order by a.assessment_score desc) from public.organization_ce600_self_assessment a where a.organization_id = v_org_id), '[]'::jsonb),
    'capability_roadmap', coalesce((select jsonb_agg(jsonb_build_object(
      'capability_key', c.capability_key, 'capability_title', c.capability_title,
      'capability_status', c.capability_status, 'summary', c.summary
    ) order by c.capability_status) from public.organization_ce600_capability_roadmap c where c.organization_id = v_org_id), '[]'::jsonb),
    'pack_evolution', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', p.pack_key, 'pack_title', p.pack_title,
      'pack_evolution_type', p.pack_evolution_type, 'pack_score', p.pack_score, 'summary', p.summary
    ) order by p.pack_evolution_type) from public.organization_ce600_pack_evolution p where p.organization_id = v_org_id), '[]'::jsonb),
    'readiness_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'readiness_key', r.readiness_key, 'readiness_title', r.readiness_title,
      'readiness_type', r.readiness_type, 'readiness_score', r.readiness_score, 'summary', r.summary
    ) order by r.readiness_type) from public.organization_ce600_readiness_reviews r where r.organization_id = v_org_id), '[]'::jsonb),
    'stewardship', coalesce((select jsonb_agg(jsonb_build_object(
      'stewardship_key', s.stewardship_key, 'stewardship_title', s.stewardship_title,
      'debt_type', s.debt_type, 'debt_level', s.debt_level, 'summary', s.summary
    ) order by s.debt_type) from public.organization_ce600_stewardship s where s.organization_id = v_org_id), '[]'::jsonb),
    'enterprise_program', coalesce((select jsonb_agg(jsonb_build_object(
      'program_key', e.program_key, 'program_title', e.program_title,
      'program_type', e.program_type, 'program_status', e.program_status, 'summary', e.summary
    ) order by e.program_type) from public.organization_ce600_enterprise_program e where e.organization_id = v_org_id), '[]'::jsonb),
    'reports', jsonb_build_object(
      'build_next', 'What should we build next?',
      'emerging', 'What opportunities are emerging?',
      'missing', 'What capabilities are missing?',
      'improve', 'How can we improve?'
    ),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_ce600_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'review_roadmaps', true,
      'review_opportunities', true,
      'review_innovation', true,
      'review_recommendations', true,
      'generate_reports', true
    )
  );
end;
$$;

create or replace function public.get_aipify_companion_evolution_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
  v_exec jsonb;
begin
  v_center := public.get_organization_evolution_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';
  v_exec := v_center->'executive_dashboard';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Evolution Briefing',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'build_next',
        'observation', format('%s planned phase(s) and %s innovation item(s) in pipeline.', v_exec->>'planned_phases', v_stats->>'innovation_items'),
        'recommendation', 'Review roadmaps and planned capabilities.',
        'href', '/app/evolution/roadmaps'
      ),
      jsonb_build_object(
        'key', 'emerging',
        'observation', format('%s future opportunit(ies) identified.', v_exec->>'future_opportunities'),
        'recommendation', 'Open Future Opportunities for growth signals.',
        'href', '/app/evolution/opportunities'
      ),
      jsonb_build_object(
        'key', 'missing',
        'observation', format('%s capability roadmap entries — platform health %s.', v_stats->>'capabilities', v_exec->>'platform_health_score'),
        'recommendation', 'Review capability gaps and self-assessment.',
        'href', '/app/evolution/platform'
      ),
      jsonb_build_object(
        'key', 'improve',
        'observation', format('%s open request(s) from customers and partners.', v_exec->>'open_requests'),
        'recommendation', 'Review recommendations and stewardship debt.',
        'href', '/app/evolution/recommendations'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_evolution_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_evolution_center('overview');
end;
$$;

grant execute on function public.get_organization_evolution_center(text) to authenticated;
grant execute on function public.get_aipify_companion_evolution_advisor_bundle() to authenticated;
grant execute on function public.get_organization_evolution_center_mobile_summary() to authenticated;
