-- Phase 81 — Strategic Intelligence & Opportunity Engine
-- Core principle: Aipify recommends strategy. Humans decide strategy.

-- Extend Trust Engine decision types
alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity', 'strategy'
  )
);

-- ---------------------------------------------------------------------------
-- 1. strategic_opportunities
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null check (
    category in (
      'operational', 'knowledge', 'automation', 'organizational', 'marketplace',
      'blueprint', 'value', 'risk_reduction'
    )
  ),
  horizon text not null default 'mid_term' check (horizon in ('short_term', 'mid_term', 'long_term')),
  title text not null,
  description text not null,
  expected_value text,
  risk_level text not null default 'low' check (risk_level in ('low', 'medium', 'high')),
  confidence_level text not null default 'medium' check (confidence_level in ('high', 'medium', 'low')),
  supporting_evidence jsonb not null default '{}'::jsonb,
  status text not null default 'open' check (status in ('open', 'reviewed', 'accepted', 'dismissed', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists strategic_opportunities_tenant_idx
  on public.strategic_opportunities (tenant_id, category, status, created_at desc);

alter table public.strategic_opportunities enable row level security;
revoke all on public.strategic_opportunities from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. strategic_risks
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_risks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  title text not null,
  description text not null,
  impact_level text not null default 'medium' check (impact_level in ('low', 'medium', 'high', 'critical')),
  confidence_level text not null default 'medium' check (confidence_level in ('high', 'medium', 'low')),
  mitigation_suggestion text,
  status text not null default 'open' check (status in ('open', 'mitigating', 'accepted', 'dismissed', 'resolved')),
  created_at timestamptz not null default now()
);

create index if not exists strategic_risks_tenant_idx
  on public.strategic_risks (tenant_id, status, created_at desc);

alter table public.strategic_risks enable row level security;
revoke all on public.strategic_risks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. strategic_scorecards
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_scorecards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  overall_score numeric(5, 2) not null default 75.00,
  health_band text not null default 'prepared',
  operational_score numeric(5, 2) not null default 75.00,
  knowledge_score numeric(5, 2) not null default 75.00,
  automation_score numeric(5, 2) not null default 75.00,
  alignment_score numeric(5, 2) not null default 75.00,
  governance_score numeric(5, 2) not null default 75.00,
  innovation_score numeric(5, 2) not null default 75.00,
  continuity_score numeric(5, 2) not null default 75.00,
  created_at timestamptz not null default now()
);

create index if not exists strategic_scorecards_tenant_idx
  on public.strategic_scorecards (tenant_id, created_at desc);

alter table public.strategic_scorecards enable row level security;
revoke all on public.strategic_scorecards from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. strategic_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  opportunity_id uuid references public.strategic_opportunities (id) on delete set null,
  risk_id uuid references public.strategic_risks (id) on delete set null,
  summary text not null,
  opportunity_description text,
  supporting_evidence jsonb not null default '[]'::jsonb,
  expected_benefits text,
  potential_risks text,
  confidence_level text not null default 'medium' check (confidence_level in ('high', 'medium', 'low')),
  next_steps jsonb not null default '[]'::jsonb,
  horizon text not null default 'mid_term' check (horizon in ('short_term', 'mid_term', 'long_term')),
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'approved', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists strategic_recommendations_tenant_idx
  on public.strategic_recommendations (tenant_id, status, created_at desc);

alter table public.strategic_recommendations enable row level security;
revoke all on public.strategic_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. strategic_briefings
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.strategic_briefings enable row level security;
revoke all on public.strategic_briefings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. strategic_settings
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  recommendations_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.strategic_settings enable row level security;
revoke all on public.strategic_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. strategic_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.strategic_audit_log enable row level security;
revoke all on public.strategic_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers (_str_)
-- ---------------------------------------------------------------------------
create or replace function public._str_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._str_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._str_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.strategic_audit_log (tenant_id, event_type, summary, metadata, actor_user_id)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb), public._str_auth_user_id())
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'strategy_' || p_event_type, 'strategy', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._str_health_band(p_score numeric)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'highly_prepared'
    when p_score >= 75 then 'prepared'
    when p_score >= 60 then 'improvement_recommended'
    when p_score >= 40 then 'resilience_concerns'
    else 'critical_gap'
  end;
$$;

create or replace function public._str_horizon_label(p_horizon text)
returns text language sql immutable as $$
  select case p_horizon
    when 'short_term' then '0–30 days'
    when 'mid_term' then '30–90 days'
    when 'long_term' then '90–365 days'
    else p_horizon
  end;
$$;

create or replace function public._str_ensure_settings(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.strategic_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Detect opportunities from integrated engines
-- ---------------------------------------------------------------------------
create or replace function public._str_generate_recommendations_from_opportunities(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_opp public.strategic_opportunities;
begin
  for v_opp in
    select * from public.strategic_opportunities o
    where o.tenant_id = p_tenant_id and o.status = 'open'
      and not exists (select 1 from public.strategic_recommendations r where r.opportunity_id = o.id and r.status in ('pending', 'reviewed', 'approved'))
  loop
    insert into public.strategic_recommendations (
      tenant_id, opportunity_id, summary, opportunity_description,
      supporting_evidence, expected_benefits, potential_risks,
      confidence_level, next_steps, horizon
    ) values (
      p_tenant_id, v_opp.id, v_opp.title,
      v_opp.description,
      coalesce(v_opp.supporting_evidence->'items', '[]'::jsonb),
      coalesce(v_opp.expected_value, 'Improved organizational readiness and foresight.'),
      case v_opp.risk_level when 'high' then 'Implementation may require significant change management.'
        when 'medium' then 'Moderate resource investment may be required.'
        else 'Low risk — advisory review recommended.' end,
      v_opp.confidence_level,
      jsonb_build_array(
        'Review supporting evidence with leadership',
        'Validate assumptions with domain owners',
        'Decide whether to pursue — human approval required'
      ),
      v_opp.horizon
    );
  end loop;
end; $$;

create or replace function public._str_detect_opportunities()
returns void language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_finding public.aoc_watcher_findings;
  v_aoc_count int;
  v_backup_gaps int;
begin
  v_tenant_id := public._str_require_tenant();
  perform public._str_ensure_settings(v_tenant_id);

  -- Escalate persistent AOC findings into strategic opportunities
  for v_finding in
    select * from public.aoc_watcher_findings f
    where f.tenant_id = v_tenant_id and f.status = 'open' and f.severity in ('warning', 'critical')
    limit 5
  loop
    if not exists (
      select 1 from public.strategic_opportunities o
      where o.tenant_id = v_tenant_id and o.title = 'Address: ' || left(v_finding.summary, 100)
    ) then
      insert into public.strategic_opportunities (
        tenant_id, category, horizon, title, description, expected_value,
        risk_level, confidence_level, supporting_evidence
      ) values (
        v_tenant_id, 'operational', 'short_term',
        'Address: ' || left(v_finding.summary, 100),
        'AOC identified a persistent operational signal that may benefit from strategic attention. ' || coalesce(v_finding.recommendation, ''),
        'Reduced operational friction and improved awareness.',
        case v_finding.severity when 'critical' then 'high' else 'medium' end,
        'medium',
        jsonb_build_object('source', 'aoc', 'finding_id', v_finding.id, 'watcher_type', v_finding.watcher_type,
          'items', jsonb_build_array('AOC watcher finding', v_finding.summary))
      );
      perform public._str_log_audit(v_tenant_id, 'opportunity_created',
        'Strategic opportunity from AOC: ' || left(v_finding.summary, 80),
        jsonb_build_object('source', 'aoc', 'finding_id', v_finding.id));
    end if;
  end loop;

  -- Continuity backup gaps -> risk reduction
  select count(*) into v_backup_gaps from public.continuity_critical_processes cp
  where cp.tenant_id = v_tenant_id
    and not exists (select 1 from public.continuity_backup_assignments b where b.process_id = cp.id);

  if v_backup_gaps > 0 and not exists (
    select 1 from public.strategic_opportunities o
    where o.tenant_id = v_tenant_id and o.title = 'Strengthen backup ownership coverage'
  ) then
    insert into public.strategic_opportunities (
      tenant_id, category, horizon, title, description, expected_value,
      risk_level, confidence_level, supporting_evidence
    ) values (
      v_tenant_id, 'risk_reduction', 'mid_term',
      'Strengthen backup ownership coverage',
      v_backup_gaps || ' critical process(es) lack complete backup ownership chains.',
      'Improved continuity preparedness and reduced single-point-of-failure risk.',
      'medium', 'high',
      jsonb_build_object('source', 'continuity', 'backup_gaps', v_backup_gaps,
        'items', jsonb_build_array('Continuity Engine backup gap analysis'))
    );
  end if;

  -- Seed baseline opportunities if tenant has none
  select count(*) into v_aoc_count from public.strategic_opportunities where tenant_id = v_tenant_id;
  if v_aoc_count = 0 then
    insert into public.strategic_opportunities (
      tenant_id, category, horizon, title, description, expected_value,
      risk_level, confidence_level, supporting_evidence
    ) values
      (v_tenant_id, 'knowledge', 'short_term', 'Expand knowledge ownership coverage',
        'Review knowledge gaps and assign clear ownership for high-traffic topics.',
        'Faster resolution and reduced support load.', 'low', 'medium',
        jsonb_build_object('source', 'learning', 'items', jsonb_build_array('Learning Engine signals', 'Support topic frequency'))),
      (v_tenant_id, 'automation', 'mid_term', 'Identify repetitive workflow automation candidates',
        'Analyze recurring manual tasks for safe automation under Governance controls.',
        'Time savings and reduced manual errors.', 'low', 'medium',
        jsonb_build_object('source', 'value', 'items', jsonb_build_array('Value Engine efficiency signals'))),
      (v_tenant_id, 'organizational', 'long_term', 'Review escalation and ownership structures',
        'Use Digital Twin insights to validate role clarity and escalation paths.',
        'Clearer accountability and faster decision-making.', 'medium', 'medium',
        jsonb_build_object('source', 'digital_twin', 'items', jsonb_build_array('Digital Twin organizational model'))),
      (v_tenant_id, 'value', 'mid_term', 'Prioritize high-ROI improvement initiatives',
        'Focus investment on changes with measurable Value Engine impact.',
        'Improved ROI and resource optimization.', 'low', 'high',
        jsonb_build_object('source', 'value_engine', 'items', jsonb_build_array('Value Engine ROI estimates'))),
      (v_tenant_id, 'marketplace', 'long_term', 'Evaluate complementary Business Packs',
        'Review marketplace offerings aligned with organizational maturity.',
        'Accelerated capability adoption.', 'low', 'low',
        jsonb_build_object('source', 'marketplace', 'items', jsonb_build_array('Marketplace catalog analysis')));

    insert into public.strategic_risks (
      tenant_id, title, description, impact_level, confidence_level, mitigation_suggestion
    ) values
      (v_tenant_id, 'Governance friction in approval chains',
        'Repeated delays in approval workflows may indicate structural bottlenecks.',
        'medium', 'medium', 'Review approval paths in Digital Twin and simplify where safe.'),
      (v_tenant_id, 'Knowledge concentration risk',
        'Critical knowledge may be concentrated in too few roles.',
        'medium', 'low', 'Expand backup ownership and documentation coverage.');

    perform public._str_log_audit(v_tenant_id, 'opportunity_created', 'Baseline strategic opportunities seeded', '{}'::jsonb);
  end if;

  perform public._str_generate_recommendations_from_opportunities(v_tenant_id);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Calculate Strategic Health Score
-- ---------------------------------------------------------------------------
create or replace function public.calculate_strategic_health_score()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_operational numeric := 75;
  v_knowledge numeric := 75;
  v_automation numeric := 72;
  v_alignment numeric := 78;
  v_governance numeric := 80;
  v_innovation numeric := 70;
  v_continuity numeric := 75;
  v_overall numeric;
  v_band text;
  v_id uuid;
begin
  v_tenant_id := public._str_require_tenant();
  perform public._str_detect_opportunities();

  begin
    select coalesce((public.calculate_aoc_operational_health()->>'overall_score')::numeric, 75) into v_operational;
  exception when others then v_operational := 75;
  end;

  begin
    select coalesce((public.calculate_continuity_readiness_score()->>'overall_score')::numeric, 75) into v_continuity;
  exception when others then v_continuity := 75;
  end;

  begin
    select coalesce((public.calculate_digital_twin_health_score()->>'twin_health_score')::numeric, 78) into v_alignment;
  exception when others then v_alignment := 78;
  end;

  v_overall := round((v_operational + v_knowledge + v_automation + v_alignment + v_governance + v_innovation + v_continuity) / 7.0, 1);
  v_band := public._str_health_band(v_overall);

  insert into public.strategic_scorecards (
    tenant_id, overall_score, health_band,
    operational_score, knowledge_score, automation_score, alignment_score,
    governance_score, innovation_score, continuity_score
  ) values (
    v_tenant_id, v_overall, v_band,
    v_operational, v_knowledge, v_automation, v_alignment,
    v_governance, v_innovation, v_continuity
  ) returning id into v_id;

  perform public._str_log_audit(v_tenant_id, 'score_recalculated',
    'Strategic Health Score: ' || v_overall || ' (' || v_band || ')',
    jsonb_build_object('scorecard_id', v_id));

  return jsonb_build_object(
    'overall_score', v_overall,
    'health_band', v_band,
    'operational_score', v_operational,
    'knowledge_score', v_knowledge,
    'automation_score', v_automation,
    'alignment_score', v_alignment,
    'governance_score', v_governance,
    'innovation_score', v_innovation,
    'continuity_score', v_continuity,
    'human_leadership_required', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Recommendation actions (advisory only)
-- ---------------------------------------------------------------------------
create or replace function public.dismiss_strategic_recommendation(p_recommendation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_rec public.strategic_recommendations;
begin
  v_tenant_id := public._str_require_tenant();
  select * into v_rec from public.strategic_recommendations
  where id = p_recommendation_id and tenant_id = v_tenant_id;
  if v_rec.id is null then return jsonb_build_object('error', 'not_found'); end if;

  update public.strategic_recommendations set status = 'dismissed' where id = v_rec.id;
  if v_rec.opportunity_id is not null then
    update public.strategic_opportunities set status = 'dismissed' where id = v_rec.opportunity_id;
  end if;

  perform public._str_log_audit(v_tenant_id, 'recommendation_dismissed', v_rec.summary,
    jsonb_build_object('recommendation_id', v_rec.id));

  return jsonb_build_object('status', 'dismissed', 'human_leadership_required', true);
end; $$;

create or replace function public.approve_strategic_recommendation(p_recommendation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_rec public.strategic_recommendations;
begin
  v_tenant_id := public._str_require_tenant();
  select * into v_rec from public.strategic_recommendations
  where id = p_recommendation_id and tenant_id = v_tenant_id;
  if v_rec.id is null then return jsonb_build_object('error', 'not_found'); end if;

  update public.strategic_recommendations set status = 'approved' where id = v_rec.id;
  if v_rec.opportunity_id is not null then
    update public.strategic_opportunities set status = 'accepted' where id = v_rec.opportunity_id;
  end if;

  perform public._str_log_audit(v_tenant_id, 'recommendation_approved', v_rec.summary,
    jsonb_build_object('recommendation_id', v_rec.id, 'note', 'Advisory approval only — no autonomous execution'));

  begin
    perform public.generate_decision_explanation(
      'strategy-rec-' || v_rec.id::text, 'strategy', 'strategy',
      'Strategic recommendation approved — ' || v_rec.summary,
      'Leadership approved this advisory recommendation. Aipify does not execute strategic changes autonomously.',
      coalesce(v_rec.supporting_evidence, '[]'::jsonb),
      jsonb_build_array('human_leadership_required', 'no_autonomous_execution'),
      v_rec.confidence_level,
      jsonb_build_array('dismiss_recommendation', 'defer_to_leadership'),
      coalesce(v_rec.next_steps, '[]'::jsonb),
      jsonb_build_object('simple', 'Recommendation noted for leadership action. Aipify will not execute changes automatically.')
    );
  exception when others then null;
  end;

  return jsonb_build_object('status', 'approved', 'human_leadership_required', true,
    'note', 'Approval is advisory — Aipify does not execute strategic changes autonomously.');
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Strategic briefing
-- ---------------------------------------------------------------------------
create or replace function public.generate_strategic_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_score jsonb;
  v_opportunities jsonb;
  v_risks jsonb;
  v_recommendations jsonb;
  v_horizons jsonb;
  v_summary text;
  v_id uuid;
begin
  v_tenant_id := public._str_require_tenant();
  v_score := public.calculate_strategic_health_score();

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'category', o.category, 'title', o.title, 'confidence_level', o.confidence_level,
    'horizon', o.horizon, 'horizon_label', public._str_horizon_label(o.horizon)
  ) order by case o.confidence_level when 'high' then 1 when 'medium' then 2 else 3 end), '[]'::jsonb)
  into v_opportunities
  from public.strategic_opportunities o where o.tenant_id = v_tenant_id and o.status = 'open' limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'impact_level', r.impact_level, 'confidence_level', r.confidence_level,
    'mitigation_suggestion', r.mitigation_suggestion
  ) order by case r.impact_level when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end), '[]'::jsonb)
  into v_risks
  from public.strategic_risks r where r.tenant_id = v_tenant_id and r.status = 'open' limit 8;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', rec.id, 'summary', rec.summary, 'confidence_level', rec.confidence_level,
    'horizon', rec.horizon, 'next_steps', rec.next_steps
  )), '[]'::jsonb) into v_recommendations
  from public.strategic_recommendations rec
  where rec.tenant_id = v_tenant_id and rec.status in ('pending', 'reviewed') limit 10;

  v_horizons := jsonb_build_object(
    'short_term', (select coalesce(jsonb_agg(jsonb_build_object('title', o.title, 'category', o.category)), '[]'::jsonb)
      from public.strategic_opportunities o where o.tenant_id = v_tenant_id and o.horizon = 'short_term' and o.status = 'open' limit 5),
    'mid_term', (select coalesce(jsonb_agg(jsonb_build_object('title', o.title, 'category', o.category)), '[]'::jsonb)
      from public.strategic_opportunities o where o.tenant_id = v_tenant_id and o.horizon = 'mid_term' and o.status = 'open' limit 5),
    'long_term', (select coalesce(jsonb_agg(jsonb_build_object('title', o.title, 'category', o.category)), '[]'::jsonb)
      from public.strategic_opportunities o where o.tenant_id = v_tenant_id and o.horizon = 'long_term' and o.status = 'open' limit 5)
  );

  v_summary := 'Strategic Briefing — health ' || (v_score->>'overall_score') || ', human leadership mandatory.';

  insert into public.strategic_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, jsonb_build_object(
    'score', v_score,
    'top_opportunities', v_opportunities,
    'top_risks', v_risks,
    'recommendations', v_recommendations,
    'horizon_recommendations', v_horizons,
    'trend_analysis', jsonb_build_object(
      'opportunity_count', (select count(*) from public.strategic_opportunities where tenant_id = v_tenant_id and status = 'open'),
      'risk_count', (select count(*) from public.strategic_risks where tenant_id = v_tenant_id and status = 'open')
    ),
    'human_leadership_required', true
  )) returning id into v_id;

  perform public._str_log_audit(v_tenant_id, 'briefing_generated', v_summary, jsonb_build_object('briefing_id', v_id));

  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary, 'content', (
    select content from public.strategic_briefings where id = v_id
  ));
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_strategic_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_score numeric;
  v_band text;
  v_opportunities int;
  v_risks int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select overall_score, health_band into v_score, v_band
  from public.strategic_scorecards where tenant_id = v_tenant_id order by created_at desc limit 1;

  select count(*) into v_opportunities from public.strategic_opportunities
  where tenant_id = v_tenant_id and status = 'open';

  select count(*) into v_risks from public.strategic_risks
  where tenant_id = v_tenant_id and status = 'open';

  return jsonb_build_object(
    'has_customer', true,
    'overall_score', coalesce(v_score, 75),
    'health_band', coalesce(v_band, 'prepared'),
    'open_opportunities', v_opportunities,
    'open_risks', v_risks,
    'philosophy', 'Aipify recommends strategy. Humans decide strategy.',
    'human_leadership_required', true
  );
end; $$;

create or replace function public.get_strategic_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_score jsonb;
  v_opportunities jsonb;
  v_risks jsonb;
  v_recommendations jsonb;
  v_briefings jsonb;
  v_horizons jsonb;
  v_trends jsonb;
  v_settings boolean;
begin
  v_tenant_id := public._str_require_tenant();
  perform public._str_ensure_settings(v_tenant_id);
  v_score := public.calculate_strategic_health_score();

  select recommendations_enabled into v_settings from public.strategic_settings where tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'category', o.category, 'horizon', o.horizon,
    'horizon_label', public._str_horizon_label(o.horizon),
    'title', o.title, 'description', o.description,
    'expected_value', o.expected_value, 'risk_level', o.risk_level,
    'confidence_level', o.confidence_level, 'status', o.status, 'created_at', o.created_at
  ) order by case o.confidence_level when 'high' then 1 when 'medium' then 2 else 3 end), '[]'::jsonb)
  into v_opportunities
  from public.strategic_opportunities o where o.tenant_id = v_tenant_id and o.status in ('open', 'reviewed') limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'description', r.description,
    'impact_level', r.impact_level, 'confidence_level', r.confidence_level,
    'mitigation_suggestion', r.mitigation_suggestion, 'status', r.status, 'created_at', r.created_at
  ) order by case r.impact_level when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end), '[]'::jsonb)
  into v_risks
  from public.strategic_risks r where r.tenant_id = v_tenant_id and r.status = 'open' limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', rec.id, 'opportunity_id', rec.opportunity_id, 'summary', rec.summary,
    'opportunity_description', rec.opportunity_description,
    'supporting_evidence', rec.supporting_evidence,
    'expected_benefits', rec.expected_benefits, 'potential_risks', rec.potential_risks,
    'confidence_level', rec.confidence_level, 'next_steps', rec.next_steps,
    'horizon', rec.horizon, 'horizon_label', public._str_horizon_label(rec.horizon),
    'status', rec.status, 'created_at', rec.created_at
  )), '[]'::jsonb) into v_recommendations
  from public.strategic_recommendations rec
  where rec.tenant_id = v_tenant_id and rec.status in ('pending', 'reviewed', 'approved') limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb) into v_briefings
  from public.strategic_briefings b where b.tenant_id = v_tenant_id limit 5;

  v_horizons := jsonb_build_array(
    jsonb_build_object('horizon', 'short_term', 'label', 'Short-Term (0–30 days)', 'focus', 'Operational optimization'),
    jsonb_build_object('horizon', 'mid_term', 'label', 'Mid-Term (30–90 days)', 'focus', 'Process improvement'),
    jsonb_build_object('horizon', 'long_term', 'label', 'Long-Term (90–365 days)', 'focus', 'Strategic transformation')
  );

  v_trends := jsonb_build_object(
    'open_opportunities', (select count(*) from public.strategic_opportunities where tenant_id = v_tenant_id and status = 'open'),
    'open_risks', (select count(*) from public.strategic_risks where tenant_id = v_tenant_id and status = 'open'),
    'pending_recommendations', (select count(*) from public.strategic_recommendations where tenant_id = v_tenant_id and status = 'pending')
  );

  perform public._str_log_audit(v_tenant_id, 'dashboard_viewed', 'Strategic Intelligence dashboard accessed', '{}'::jsonb);

  return jsonb_build_object(
    'has_customer', true,
    'human_leadership_required', true,
    'recommendations_enabled', coalesce(v_settings, true),
    'overall_score', v_score->'overall_score',
    'health_band', v_score->'health_band',
    'score_components', jsonb_build_object(
      'operational', v_score->'operational_score',
      'knowledge', v_score->'knowledge_score',
      'automation', v_score->'automation_score',
      'alignment', v_score->'alignment_score',
      'governance', v_score->'governance_score',
      'innovation', v_score->'innovation_score',
      'continuity', v_score->'continuity_score'
    ),
    'opportunities', v_opportunities,
    'risks', v_risks,
    'recommendations', v_recommendations,
    'briefings', v_briefings,
    'horizons', v_horizons,
    'trends', v_trends,
    'integrations', jsonb_build_object(
      'value_engine', 'ROI and productivity estimates',
      'learning_engine', 'Recommendation quality and prioritization',
      'global_learning', 'Anonymized best practices and industry trends',
      'digital_twin', 'Organizational and ownership recommendations',
      'simulation_lab', 'Investment and process redesign priorities',
      'aoc', 'Operational findings escalated to strategy',
      'executive_briefing', 'Strategic summaries for leadership',
      'continuity', 'Risk reduction and preparedness opportunities'
    )
  );
end; $$;

create or replace function public.get_strategic_opportunity(p_opportunity_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_opp public.strategic_opportunities;
  v_recommendations jsonb;
begin
  v_tenant_id := public._str_require_tenant();
  select * into v_opp from public.strategic_opportunities
  where id = p_opportunity_id and tenant_id = v_tenant_id;
  if v_opp.id is null then return jsonb_build_object('error', 'not_found'); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', rec.id, 'summary', rec.summary, 'confidence_level', rec.confidence_level,
    'expected_benefits', rec.expected_benefits, 'potential_risks', rec.potential_risks,
    'next_steps', rec.next_steps, 'status', rec.status
  )), '[]'::jsonb) into v_recommendations
  from public.strategic_recommendations rec where rec.opportunity_id = v_opp.id;

  return jsonb_build_object(
    'opportunity', jsonb_build_object(
      'id', v_opp.id, 'category', v_opp.category, 'horizon', v_opp.horizon,
      'horizon_label', public._str_horizon_label(v_opp.horizon),
      'title', v_opp.title, 'description', v_opp.description,
      'expected_value', v_opp.expected_value, 'risk_level', v_opp.risk_level,
      'confidence_level', v_opp.confidence_level,
      'supporting_evidence', v_opp.supporting_evidence, 'status', v_opp.status,
      'created_at', v_opp.created_at
    ),
    'recommendations', v_recommendations,
    'human_leadership_required', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'strategy', 'Strategic Intelligence', 'Opportunity identification, risk tracking, and strategic planning guides.', 'authenticated', 25
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'strategy' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 15. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.calculate_strategic_health_score() to authenticated;
grant execute on function public.generate_strategic_briefing() to authenticated;
grant execute on function public.dismiss_strategic_recommendation(uuid) to authenticated;
grant execute on function public.approve_strategic_recommendation(uuid) to authenticated;
grant execute on function public.get_strategic_card() to authenticated;
grant execute on function public.get_strategic_dashboard() to authenticated;
grant execute on function public.get_strategic_opportunity(uuid) to authenticated;
