-- Phase 88 — Ecosystem Intelligence & External Relationship Engine
-- Core principle: Aipify maps relationships. Humans govern relationships.

-- Extend Trust Engine decision types
alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem'
  )
);

-- ---------------------------------------------------------------------------
-- 1. ecosystem_relationships
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_relationships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  relationship_name text not null,
  category text not null check (
    category in (
      'customers', 'partners', 'suppliers', 'technology_providers',
      'regulatory_bodies', 'consultants', 'external_developers', 'community_contributors', 'custom'
    )
  ),
  description text,
  strategic_importance text not null default 'medium' check (
    strategic_importance in ('low', 'medium', 'high', 'critical')
  ),
  dependency_level text not null default 'moderate' check (
    dependency_level in ('minimal', 'moderate', 'significant', 'critical')
  ),
  value_contribution text,
  risk_indicators jsonb not null default '[]'::jsonb,
  source_module text,
  status text not null default 'active' check (status in ('active', 'monitoring', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ecosystem_relationships_tenant_idx
  on public.ecosystem_relationships (tenant_id, category, strategic_importance, created_at desc);

alter table public.ecosystem_relationships enable row level security;
revoke all on public.ecosystem_relationships from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. ecosystem_dependencies
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_dependencies (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.ecosystem_relationships (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  dependency_type text not null check (
    dependency_type in (
      'integration', 'workflow', 'data', 'payment', 'communication',
      'infrastructure', 'compliance', 'support', 'other'
    )
  ),
  dependency_name text not null,
  criticality_level text not null default 'medium' check (
    criticality_level in ('low', 'medium', 'high', 'critical')
  ),
  continuity_plan_reference text,
  created_at timestamptz not null default now()
);

create index if not exists ecosystem_dependencies_tenant_idx
  on public.ecosystem_dependencies (tenant_id, criticality_level);

alter table public.ecosystem_dependencies enable row level security;
revoke all on public.ecosystem_dependencies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. ecosystem_risks
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_risks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  relationship_id uuid references public.ecosystem_relationships (id) on delete set null,
  risk_description text not null,
  risk_type text not null default 'dependency_concentration' check (
    risk_type in (
      'dependency_concentration', 'single_provider', 'integration_instability',
      'regulatory_uncertainty', 'partnership_vulnerability', 'lack_of_backup'
    )
  ),
  severity text not null default 'medium' check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  mitigation_recommendation text,
  status text not null default 'open' check (status in ('open', 'mitigating', 'accepted', 'resolved')),
  created_at timestamptz not null default now()
);

create index if not exists ecosystem_risks_tenant_idx
  on public.ecosystem_risks (tenant_id, severity, status, created_at desc);

alter table public.ecosystem_risks enable row level security;
revoke all on public.ecosystem_risks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. ecosystem_opportunities
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  relationship_id uuid references public.ecosystem_relationships (id) on delete set null,
  title text not null,
  description text not null,
  opportunity_type text not null default 'partnership' check (
    opportunity_type in ('partnership', 'diversification', 'collaboration', 'marketplace', 'strategic')
  ),
  status text not null default 'open' check (status in ('open', 'reviewed', 'pursued', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table public.ecosystem_opportunities enable row level security;
revoke all on public.ecosystem_opportunities from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. ecosystem_scores
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  ecosystem_score numeric(5, 2) not null default 0 check (ecosystem_score between 0 and 100),
  ecosystem_band text not null default 'improvement_opportunities',
  dependency_score numeric(5, 2) not null default 0,
  resilience_score numeric(5, 2) not null default 0,
  partner_score numeric(5, 2) not null default 0,
  score_components jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ecosystem_scores_tenant_idx
  on public.ecosystem_scores (tenant_id, created_at desc);

alter table public.ecosystem_scores enable row level security;
revoke all on public.ecosystem_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. relationship_owners
-- ---------------------------------------------------------------------------
create table if not exists public.relationship_owners (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.ecosystem_relationships (id) on delete cascade unique,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  primary_owner text,
  secondary_owner text,
  continuity_owner text,
  created_at timestamptz not null default now()
);

alter table public.relationship_owners enable row level security;
revoke all on public.relationship_owners from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. ecosystem_briefings
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.ecosystem_briefings enable row level security;
revoke all on public.ecosystem_briefings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. ecosystem_settings
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  intelligence_enabled boolean not null default true,
  external_monitoring_consent boolean not null default false,
  show_critical_risks boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ecosystem_settings enable row level security;
revoke all on public.ecosystem_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. ecosystem_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.ecosystem_audit_log enable row level security;
revoke all on public.ecosystem_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Helpers (_eco_)
-- ---------------------------------------------------------------------------
create or replace function public._eco_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._eco_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._eco_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.ecosystem_audit_log (tenant_id, event_type, summary, metadata, actor_user_id)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb), public._eco_auth_user_id())
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'ecosystem_' || p_event_type, 'ecosystem', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._eco_ensure_settings(p_tenant_id uuid)
returns public.ecosystem_settings language plpgsql security definer set search_path = public as $$
declare v_row public.ecosystem_settings;
begin
  insert into public.ecosystem_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.ecosystem_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._eco_health_band(p_score numeric)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'highly_resilient'
    when p_score >= 75 then 'healthy'
    when p_score >= 60 then 'improvement_opportunities'
    when p_score >= 40 then 'risk_concerns'
    else 'critical_vulnerabilities'
  end;
$$;

create or replace function public._eco_band_label(p_band text)
returns text language sql immutable as $$
  select case p_band
    when 'highly_resilient' then 'Highly Resilient Ecosystem (90–100)'
    when 'healthy' then 'Healthy Ecosystem (75–89)'
    when 'improvement_opportunities' then 'Improvement Opportunities (60–74)'
    when 'risk_concerns' then 'Ecosystem Risk Concerns (40–59)'
    when 'critical_vulnerabilities' then 'Critical Ecosystem Vulnerabilities (below 40)'
    else p_band
  end;
$$;

-- ---------------------------------------------------------------------------
-- 11. Seed relationships (authorized, tenant-scoped only)
-- ---------------------------------------------------------------------------
create or replace function public._eco_seed_relationships(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_rel_id uuid;
  v_settings public.ecosystem_settings;
begin
  v_settings := public._eco_ensure_settings(p_tenant_id);
  if not v_settings.intelligence_enabled then return; end if;

  -- Template technology providers (organization-declared, not external monitoring)
  insert into public.ecosystem_relationships (
    tenant_id, relationship_name, category, description,
    strategic_importance, dependency_level, value_contribution, source_module
  )
  select p_tenant_id, v.name, 'technology_providers', v.desc,
    v.importance, v.dependency, v.value, 'ecosystem_intelligence'
  from (values
    ('Cloud Infrastructure', 'Primary hosting and compute platform.', 'critical', 'critical', 'Core platform availability'),
    ('Email & Communication', 'External email and messaging services.', 'high', 'significant', 'Customer and team communication'),
    ('Payment Processing', 'Payment gateway for subscriptions and billing.', 'high', 'significant', 'Revenue collection')
  ) as v(name, desc, importance, dependency, value)
  where not exists (
    select 1 from public.ecosystem_relationships er
    where er.tenant_id = p_tenant_id and er.relationship_name = v.name
  );

  -- Marketplace packs as partner relationships
  insert into public.ecosystem_relationships (
    tenant_id, relationship_name, category, description,
    strategic_importance, dependency_level, value_contribution, source_module
  )
  select
    p_tenant_id,
    'Marketplace: ' || coalesce(s.name, 'Business Pack'),
    'partners',
    'Installed or recommended marketplace capability.',
    'medium', 'moderate',
    'Extended Aipify capabilities through marketplace ecosystem.',
    'marketplace'
  from public.tenant_skills ts
  join public.skills s on s.id = ts.skill_id
  where ts.tenant_id = p_tenant_id and ts.status = 'active'
  and not exists (
    select 1 from public.ecosystem_relationships er
    where er.tenant_id = p_tenant_id and er.relationship_name = 'Marketplace: ' || coalesce(s.name, 'Business Pack')
  )
  limit 5;

  -- Customer domains as customer relationship touchpoints
  insert into public.ecosystem_relationships (
    tenant_id, relationship_name, category, description,
    strategic_importance, dependency_level, source_module
  )
  select
    p_tenant_id,
    'Customer Channel: ' || coalesce(cd.domain, 'Primary domain'),
    'customers',
    'Customer-facing digital presence and engagement channel.',
    'high', 'significant', 'customer_domains'
  from public.customer_domains cd
  where cd.customer_id = p_tenant_id and cd.status = 'active'
  and not exists (
    select 1 from public.ecosystem_relationships er
    where er.tenant_id = p_tenant_id and er.relationship_name like 'Customer Channel:%'
      and er.relationship_name = 'Customer Channel: ' || coalesce(cd.domain, 'Primary domain')
  )
  limit 3;

  -- Seed owners for critical relationships
  for v_rel_id in
    select id from public.ecosystem_relationships
    where tenant_id = p_tenant_id and strategic_importance in ('high', 'critical')
  loop
    insert into public.relationship_owners (relationship_id, tenant_id, primary_owner, secondary_owner, continuity_owner)
    values (v_rel_id, p_tenant_id, 'Partnership Lead', 'Operations Manager', 'Continuity Coordinator')
    on conflict (relationship_id) do nothing;
  end loop;

  -- Seed dependencies for technology providers
  insert into public.ecosystem_dependencies (relationship_id, tenant_id, dependency_type, dependency_name, criticality_level, continuity_plan_reference)
  select er.id, p_tenant_id, 'infrastructure', 'Platform hosting dependency', 'critical', 'See Continuity Engine backup plans'
  from public.ecosystem_relationships er
  where er.tenant_id = p_tenant_id and er.category = 'technology_providers'
    and er.relationship_name = 'Cloud Infrastructure'
  and not exists (
    select 1 from public.ecosystem_dependencies ed where ed.relationship_id = er.id and ed.dependency_name = 'Platform hosting dependency'
  );

  insert into public.ecosystem_dependencies (relationship_id, tenant_id, dependency_type, dependency_name, criticality_level, continuity_plan_reference)
  select er.id, p_tenant_id, 'payment', 'Billing and subscription processing', 'high', 'Continuity recovery actions for billing disruption'
  from public.ecosystem_relationships er
  where er.tenant_id = p_tenant_id and er.relationship_name = 'Payment Processing'
  and not exists (
    select 1 from public.ecosystem_dependencies ed where ed.relationship_id = er.id
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Dependency analysis & risk detection
-- ---------------------------------------------------------------------------
create or replace function public._eco_analyze_risks(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_critical_deps int;
  v_single_provider int;
  v_rel record;
begin
  select count(*) into v_critical_deps
  from public.ecosystem_dependencies
  where tenant_id = p_tenant_id and criticality_level = 'critical';

  if v_critical_deps >= 2 and not exists (
    select 1 from public.ecosystem_risks
    where tenant_id = p_tenant_id and risk_type = 'dependency_concentration' and status = 'open'
  ) then
    insert into public.ecosystem_risks (
      tenant_id, risk_description, risk_type, severity, mitigation_recommendation
    ) values (
      p_tenant_id,
      'Multiple critical external dependencies detected — concentration risk.',
      'dependency_concentration', 'high',
      'Identify backup providers and document continuity plans in Continuity Engine.'
    );
  end if;

  for v_rel in
    select er.id, er.relationship_name, count(ed.id) as dep_count
    from public.ecosystem_relationships er
    join public.ecosystem_dependencies ed on ed.relationship_id = er.id
    where er.tenant_id = p_tenant_id and er.dependency_level = 'critical'
    group by er.id, er.relationship_name
    having count(ed.id) >= 2
  loop
    if not exists (
      select 1 from public.ecosystem_risks
      where tenant_id = p_tenant_id and relationship_id = v_rel.id and status = 'open'
    ) then
      insert into public.ecosystem_risks (
        tenant_id, relationship_id, risk_description, risk_type, severity, mitigation_recommendation
      ) values (
        p_tenant_id, v_rel.id,
        'Single provider (' || v_rel.relationship_name || ') supports multiple critical functions.',
        'single_provider', 'high',
        'Diversify providers or establish documented backup relationships.'
      );
    end if;
  end loop;

  -- Continuity integration: open continuity incidents suggest external vulnerability
  if exists (
    select 1 from public.continuity_incident_events
    where tenant_id = p_tenant_id and status in ('open', 'investigating', 'recovering')
      and created_at > now() - interval '30 days'
  ) and not exists (
    select 1 from public.ecosystem_risks
    where tenant_id = p_tenant_id and risk_type = 'partnership_vulnerability'
      and status = 'open' and created_at > now() - interval '14 days'
  ) then
    insert into public.ecosystem_risks (
      tenant_id, risk_description, risk_type, severity, mitigation_recommendation
    ) values (
      p_tenant_id,
      'Active continuity incident may indicate external dependency disruption.',
      'partnership_vulnerability', 'medium',
      'Review Continuity Engine recovery actions and strengthen backup relationships.'
    );
  end if;

  -- Strategic risks with external exposure
  insert into public.ecosystem_risks (
    tenant_id, risk_description, risk_type, severity, mitigation_recommendation
  )
  select
    p_tenant_id,
    'Strategic risk with external exposure: ' || sr.title,
    'regulatory_uncertainty',
    case sr.impact_level when 'critical' then 'critical' when 'high' then 'high' else 'medium' end,
    coalesce(sr.mitigation_suggestion, 'Review regulatory and partnership implications.')
  from public.strategic_risks sr
  where sr.tenant_id = p_tenant_id and sr.status = 'open'
    and sr.title ilike any (array['%vendor%', '%supplier%', '%partner%', '%regulatory%', '%external%'])
  and not exists (
    select 1 from public.ecosystem_risks er
    where er.tenant_id = p_tenant_id and er.risk_description like 'Strategic risk with external exposure:%'
      and er.risk_description like '%' || sr.title || '%'
  )
  limit 3;
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Partner opportunities
-- ---------------------------------------------------------------------------
create or replace function public._eco_seed_opportunities(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.ecosystem_opportunities (tenant_id, title, description, opportunity_type)
  select p_tenant_id,
    'Explore complementary Marketplace packs',
    'Additional Business Packs may strengthen your ecosystem without single-provider concentration.',
    'marketplace'
  where not exists (
    select 1 from public.ecosystem_opportunities
    where tenant_id = p_tenant_id and title = 'Explore complementary Marketplace packs' and status = 'open'
  );

  insert into public.ecosystem_opportunities (tenant_id, relationship_id, title, description, opportunity_type)
  select p_tenant_id, er.id,
    'Strengthen partnership with ' || er.relationship_name,
    'High strategic importance relationship may benefit from executive sponsorship and regular review.',
    'partnership'
  from public.ecosystem_relationships er
  where er.tenant_id = p_tenant_id and er.strategic_importance = 'high'
    and er.category in ('partners', 'technology_providers')
  and not exists (
    select 1 from public.ecosystem_opportunities eo
    where eo.tenant_id = p_tenant_id and eo.relationship_id = er.id and eo.status = 'open'
  )
  limit 3;

  insert into public.ecosystem_opportunities (tenant_id, title, description, opportunity_type)
  select p_tenant_id,
    'Diversify critical technology dependencies',
    'Strategic Intelligence recommends reducing single-provider concentration for resilience.',
    'diversification'
  from public.ecosystem_risks er
  where er.tenant_id = p_tenant_id and er.risk_type in ('single_provider', 'dependency_concentration')
    and er.status = 'open'
  and not exists (
    select 1 from public.ecosystem_opportunities
    where tenant_id = p_tenant_id and opportunity_type = 'diversification' and status = 'open'
  )
  limit 1;
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Calculate Ecosystem Health Score
-- ---------------------------------------------------------------------------
create or replace function public._eco_calculate_score(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_diversity numeric := 70;
  v_quality numeric := 75;
  v_integration numeric := 75;
  v_partner numeric := 70;
  v_supplier numeric := 75;
  v_risk_exposure numeric := 80;
  v_alignment numeric := 75;
  v_overall numeric;
  v_band text;
  v_rel_count int;
  v_cat_count int;
  v_open_risks int;
  v_critical_risks int;
  v_twin_health numeric;
  v_continuity numeric;
  v_id uuid;
begin
  select count(*), count(distinct category) into v_rel_count, v_cat_count
  from public.ecosystem_relationships where tenant_id = p_tenant_id and status = 'active';

  select count(*), count(*) filter (where severity in ('high', 'critical'))
  into v_open_risks, v_critical_risks
  from public.ecosystem_risks where tenant_id = p_tenant_id and status = 'open';

  v_diversity := least(100, 40 + v_cat_count * 8 + v_rel_count * 2);
  v_risk_exposure := greatest(20, 100 - v_open_risks * 8 - v_critical_risks * 15);

  select coalesce((public.calculate_digital_twin_health_score()->>'twin_health_score')::numeric, 70)
  into v_twin_health;
  v_quality := (v_twin_health + v_diversity) / 2;

  select coalesce(success_score, 70) into v_continuity
  from public.customer_profiles where tenant_id = p_tenant_id;
  v_supplier := v_continuity;

  select coalesce(overall_score, 70) into v_alignment
  from public.strategic_scorecards where tenant_id = p_tenant_id
  order by created_at desc limit 1;

  v_integration := case when v_critical_risks > 0 then 55 else 80 end;
  v_partner := case when exists (
    select 1 from public.ecosystem_opportunities where tenant_id = p_tenant_id and status = 'open'
  ) then 75 else 65 end;

  v_overall := round((
    v_diversity * 0.18 +
    v_quality * 0.15 +
    v_integration * 0.15 +
    v_partner * 0.12 +
    v_supplier * 0.12 +
    v_risk_exposure * 0.18 +
    v_alignment * 0.10
  )::numeric, 2);

  v_band := public._eco_health_band(v_overall);

  insert into public.ecosystem_scores (
    tenant_id, ecosystem_score, ecosystem_band,
    dependency_score, resilience_score, partner_score, score_components
  ) values (
    p_tenant_id, v_overall, v_band,
    v_diversity, v_risk_exposure, v_partner,
    jsonb_build_object(
      'dependency_diversity', v_diversity,
      'relationship_quality', v_quality,
      'integration_stability', v_integration,
      'partner_value_contribution', v_partner,
      'supplier_resilience', v_supplier,
      'external_risk_exposure', v_risk_exposure,
      'strategic_alignment', v_alignment
    )
  ) returning id into v_id;

  perform public._eco_log_audit(p_tenant_id, 'score_recalculated',
    'Ecosystem Health Score: ' || v_overall,
    jsonb_build_object('score', v_overall, 'band', v_band));

  return jsonb_build_object(
    'ecosystem_score', v_overall,
    'ecosystem_band', v_band,
    'ecosystem_band_label', public._eco_band_label(v_band),
    'dependency_score', v_diversity,
    'resilience_score', v_risk_exposure,
    'partner_score', v_partner,
    'components', jsonb_build_object(
      'dependency_diversity', v_diversity,
      'relationship_quality', v_quality,
      'integration_stability', v_integration,
      'partner_value_contribution', v_partner,
      'supplier_resilience', v_supplier,
      'external_risk_exposure', v_risk_exposure,
      'strategic_alignment', v_alignment
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 15. Trust explanation
-- ---------------------------------------------------------------------------
create or replace function public._eco_trust_explanation(p_tenant_id uuid, p_score numeric, p_band text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  return public.generate_decision_explanation(
    'eco-score-' || p_tenant_id::text,
    'ecosystem',
    'ecosystem',
    'Ecosystem Health Score: ' || p_score || '/100',
    'Band: ' || public._eco_band_label(p_band) || '. Based on authorized relationship maps and dependency analysis only.',
    jsonb_build_array(
      jsonb_build_object('source', 'relationship_maps'),
      jsonb_build_object('source', 'dependency_analysis'),
      jsonb_build_object('source', 'digital_twin')
    ),
    jsonb_build_array('no_unauthorized_monitoring', 'consent_required', 'human_governed_relationships'),
    'medium',
    '["defer_diversification"]'::jsonb,
    jsonb_build_array('Review critical dependencies', 'Assign relationship owners', 'Pursue diversification where needed'),
    jsonb_build_object(
      'simple', 'This score reflects how resilient your external relationships and dependencies are.',
      'operational', 'Analysis uses organization-declared relationships — never unauthorized external monitoring.',
      'technical', 'Components: diversity, quality, integration stability, partner value, supplier resilience, risk exposure, alignment.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 16. Briefing & dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_ecosystem_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_score jsonb;
  v_id uuid;
  v_summary text;
  v_content jsonb;
begin
  v_tenant_id := public._eco_require_tenant();
  perform public._eco_seed_relationships(v_tenant_id);
  perform public._eco_analyze_risks(v_tenant_id);
  perform public._eco_seed_opportunities(v_tenant_id);
  v_score := public._eco_calculate_score(v_tenant_id);
  perform public._eco_trust_explanation(v_tenant_id,
    (v_score->>'ecosystem_score')::numeric, v_score->>'ecosystem_band');

  v_summary := 'Ecosystem Health Score ' || (v_score->>'ecosystem_score') || '/100 — ' ||
    public._eco_band_label(v_score->>'ecosystem_band');

  v_content := jsonb_build_object(
    'ecosystem_score', v_score->'ecosystem_score',
    'critical_dependencies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'relationship', er.relationship_name, 'dependency', ed.dependency_name, 'criticality', ed.criticality_level
      ))
      from public.ecosystem_dependencies ed
      join public.ecosystem_relationships er on er.id = ed.relationship_id
      where ed.tenant_id = v_tenant_id and ed.criticality_level in ('high', 'critical')
    ), '[]'::jsonb),
    'emerging_risks', coalesce((
      select jsonb_agg(jsonb_build_object('description', r.risk_description, 'severity', r.severity))
      from public.ecosystem_risks r where r.tenant_id = v_tenant_id and r.status = 'open'
      order by case r.severity when 'critical' then 1 when 'high' then 2 else 3 end limit 10
    ), '[]'::jsonb),
    'partnership_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object('title', o.title, 'description', o.description))
      from public.ecosystem_opportunities o where o.tenant_id = v_tenant_id and o.status = 'open' limit 5
    ), '[]'::jsonb),
    'diversification_recommendations', coalesce((
      select jsonb_agg(r.mitigation_recommendation)
      from public.ecosystem_risks r
      where r.tenant_id = v_tenant_id and r.risk_type in ('single_provider', 'dependency_concentration') and r.status = 'open'
    ), '[]'::jsonb),
    'health_trends', coalesce((
      select jsonb_agg(jsonb_build_object('score', s.ecosystem_score, 'band', s.ecosystem_band, 'created_at', s.created_at)
        order by s.created_at desc)
      from public.ecosystem_scores s where s.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'consent_required', true,
    'human_governance_required', true
  );

  insert into public.ecosystem_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_content) returning id into v_id;

  perform public._eco_log_audit(v_tenant_id, 'briefing_generated', v_summary,
    jsonb_build_object('briefing_id', v_id));

  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary, 'content', v_content);
end; $$;

create or replace function public.get_ecosystem_intelligence_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_score numeric; v_band text; v_risks int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select ecosystem_score, ecosystem_band into v_score, v_band
  from public.ecosystem_scores where tenant_id = v_tenant_id order by created_at desc limit 1;

  select count(*) into v_risks from public.ecosystem_risks
  where tenant_id = v_tenant_id and status = 'open';

  return jsonb_build_object(
    'has_customer', true,
    'ecosystem_score', coalesce(v_score, 0),
    'ecosystem_band', v_band,
    'ecosystem_band_label', public._eco_band_label(coalesce(v_band, 'improvement_opportunities')),
    'open_risks', v_risks,
    'philosophy', 'Aipify maps relationships. Humans govern relationships.',
    'consent_required', true
  );
end; $$;

create or replace function public.get_ecosystem_intelligence_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.ecosystem_settings;
  v_score jsonb;
  v_relationships jsonb;
  v_dependencies jsonb;
  v_risks jsonb;
  v_opportunities jsonb;
  v_briefings jsonb;
  v_categories jsonb;
begin
  v_tenant_id := public._eco_require_tenant();
  v_settings := public._eco_ensure_settings(v_tenant_id);
  perform public._eco_seed_relationships(v_tenant_id);
  perform public._eco_analyze_risks(v_tenant_id);
  perform public._eco_seed_opportunities(v_tenant_id);
  v_score := public._eco_calculate_score(v_tenant_id);
  perform public._eco_trust_explanation(v_tenant_id,
    (v_score->>'ecosystem_score')::numeric, v_score->>'ecosystem_band');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', er.id, 'relationship_name', er.relationship_name, 'category', er.category,
    'description', er.description, 'strategic_importance', er.strategic_importance,
    'dependency_level', er.dependency_level, 'value_contribution', er.value_contribution,
    'primary_owner', ro.primary_owner, 'secondary_owner', ro.secondary_owner,
    'continuity_owner', ro.continuity_owner
  ) order by case er.strategic_importance when 'critical' then 1 when 'high' then 2 else 3 end), '[]'::jsonb)
  into v_relationships
  from public.ecosystem_relationships er
  left join public.relationship_owners ro on ro.relationship_id = er.id
  where er.tenant_id = v_tenant_id and er.status = 'active'
  limit 25;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ed.id, 'relationship_id', ed.relationship_id,
    'relationship_name', er.relationship_name,
    'dependency_type', ed.dependency_type, 'dependency_name', ed.dependency_name,
    'criticality_level', ed.criticality_level,
    'continuity_plan_reference', ed.continuity_plan_reference
  ) order by case ed.criticality_level when 'critical' then 1 when 'high' then 2 else 3 end), '[]'::jsonb)
  into v_dependencies
  from public.ecosystem_dependencies ed
  join public.ecosystem_relationships er on er.id = ed.relationship_id
  where ed.tenant_id = v_tenant_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'relationship_id', r.relationship_id, 'risk_description', r.risk_description,
    'risk_type', r.risk_type, 'severity', r.severity,
    'mitigation_recommendation', r.mitigation_recommendation, 'status', r.status,
    'created_at', r.created_at
  ) order by case r.severity when 'critical' then 1 when 'high' then 2 else 3 end), '[]'::jsonb)
  into v_risks
  from public.ecosystem_risks r
  where r.tenant_id = v_tenant_id and r.status = 'open'
    and (v_settings.show_critical_risks or r.severity != 'critical')
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'title', o.title, 'description', o.description,
    'opportunity_type', o.opportunity_type, 'status', o.status
  )), '[]'::jsonb) into v_opportunities
  from public.ecosystem_opportunities o
  where o.tenant_id = v_tenant_id and o.status = 'open'
  limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb) into v_briefings
  from public.ecosystem_briefings b where b.tenant_id = v_tenant_id limit 5;

  v_categories := jsonb_build_array(
    jsonb_build_object('key', 'customers', 'label', 'Customers'),
    jsonb_build_object('key', 'partners', 'label', 'Partners'),
    jsonb_build_object('key', 'suppliers', 'label', 'Suppliers'),
    jsonb_build_object('key', 'technology_providers', 'label', 'Technology Providers'),
    jsonb_build_object('key', 'regulatory_bodies', 'label', 'Regulatory Bodies'),
    jsonb_build_object('key', 'consultants', 'label', 'Consultants'),
    jsonb_build_object('key', 'external_developers', 'label', 'External Developers'),
    jsonb_build_object('key', 'community_contributors', 'label', 'Community Contributors')
  );

  return jsonb_build_object(
    'has_customer', true,
    'consent_required', true,
    'human_governance_required', true,
    'intelligence_enabled', v_settings.intelligence_enabled,
    'external_monitoring_consent', v_settings.external_monitoring_consent,
    'philosophy', 'Aipify maps relationships. Humans govern relationships.',
    'safety_note', 'No unauthorized external monitoring. Transparency and consent are mandatory.',
    'ecosystem_score', v_score->'ecosystem_score',
    'ecosystem_band', v_score->'ecosystem_band',
    'ecosystem_band_label', v_score->'ecosystem_band_label',
    'score_components', v_score->'components',
    'dependency_score', v_score->'dependency_score',
    'resilience_score', v_score->'resilience_score',
    'partner_score', v_score->'partner_score',
    'relationships', v_relationships,
    'critical_dependencies', v_dependencies,
    'external_risks', v_risks,
    'partnership_opportunities', v_opportunities,
    'briefings', v_briefings,
    'relationship_categories', v_categories,
    'review_frequencies', jsonb_build_array(
      jsonb_build_object('key', 'monthly', 'label', 'Monthly', 'purpose', 'Monitor ecosystem changes'),
      jsonb_build_object('key', 'quarterly', 'label', 'Quarterly', 'purpose', 'Assess strategic alignment'),
      jsonb_build_object('key', 'annual', 'label', 'Annual', 'purpose', 'Evaluate long-term resilience')
    ),
    'integrations', jsonb_build_object(
      'digital_twin', 'External dependencies and cross-boundary workflows',
      'continuity_engine', 'Supplier failures and backup relationship planning',
      'strategic_intelligence', 'Ecosystem opportunities and diversification',
      'marketplace', 'Partner and pack relationship mapping',
      'value_engine', 'Partner and supplier value contribution',
      'risk_engine', 'External exposure and concentration risks',
      'executive_briefing', 'Ecosystem briefings with critical dependencies'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 17. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'ecosystem', 'Ecosystem Intelligence', 'External relationships, dependencies, and partnership guides.', 'authenticated', 33
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'ecosystem' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 18. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_ecosystem_intelligence_card() to authenticated;
grant execute on function public.get_ecosystem_intelligence_dashboard() to authenticated;
grant execute on function public.generate_ecosystem_briefing() to authenticated;
