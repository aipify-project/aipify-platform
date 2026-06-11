-- Phase 87 — Self-Awareness & Platform Integrity Engine
-- Core principle: Aipify evaluates itself. Humans govern improvements.

-- Extend Trust Engine decision types
alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity'
  )
);

-- ---------------------------------------------------------------------------
-- 1. integrity_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.integrity_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_type text not null default 'comprehensive' check (
    review_type in ('comprehensive', 'knowledge', 'support', 'marketplace', 'targeted')
  ),
  review_period text not null default 'monthly' check (
    review_period in ('weekly', 'monthly', 'quarterly', 'annual')
  ),
  status text not null default 'completed' check (
    status in ('scheduled', 'in_progress', 'completed', 'archived')
  ),
  summary text,
  created_at timestamptz not null default now()
);

create index if not exists integrity_reviews_tenant_idx
  on public.integrity_reviews (tenant_id, review_period, created_at desc);

alter table public.integrity_reviews enable row level security;
revoke all on public.integrity_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. integrity_findings
-- ---------------------------------------------------------------------------
create table if not exists public.integrity_findings (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references public.integrity_reviews (id) on delete set null,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  domain text not null check (
    domain in (
      'knowledge', 'support', 'marketplace', 'blueprint', 'recommendation',
      'explanation', 'human_success', 'desktop', 'strategic_intelligence', 'governance'
    )
  ),
  severity text not null default 'monitor' check (
    severity in ('healthy', 'monitor', 'attention_required', 'critical_review_required')
  ),
  status text not null default 'open' check (
    status in ('open', 'acknowledged', 'in_review', 'resolved', 'deferred')
  ),
  summary text not null,
  evidence jsonb not null default '{}'::jsonb,
  affected_domains jsonb not null default '[]'::jsonb,
  potential_impact text,
  recommended_actions jsonb not null default '[]'::jsonb,
  governance_requirements text,
  created_at timestamptz not null default now()
);

create index if not exists integrity_findings_tenant_idx
  on public.integrity_findings (tenant_id, domain, severity, status, created_at desc);

alter table public.integrity_findings enable row level security;
revoke all on public.integrity_findings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. integrity_scores
-- ---------------------------------------------------------------------------
create table if not exists public.integrity_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  integrity_score numeric(5, 2) not null default 0 check (integrity_score between 0 and 100),
  integrity_band text not null default 'improvements_recommended',
  trust_score numeric(5, 2) not null default 0,
  knowledge_score numeric(5, 2) not null default 0,
  support_score numeric(5, 2) not null default 0,
  governance_score numeric(5, 2) not null default 0,
  score_components jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists integrity_scores_tenant_idx
  on public.integrity_scores (tenant_id, created_at desc);

alter table public.integrity_scores enable row level security;
revoke all on public.integrity_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. integrity_actions
-- ---------------------------------------------------------------------------
create table if not exists public.integrity_actions (
  id uuid primary key default gen_random_uuid(),
  finding_id uuid not null references public.integrity_findings (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_description text not null,
  owner_id uuid references public.users (id) on delete set null,
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'dismissed', 'awaiting_governance')
  ),
  requires_governance boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists integrity_actions_tenant_idx
  on public.integrity_actions (tenant_id, status, created_at desc);

alter table public.integrity_actions enable row level security;
revoke all on public.integrity_actions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. integrity_deprecated_assets
-- ---------------------------------------------------------------------------
create table if not exists public.integrity_deprecated_assets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  asset_type text not null check (
    asset_type in ('faq', 'pack', 'blueprint', 'recommendation', 'article', 'workflow')
  ),
  asset_ref text not null,
  asset_title text not null,
  reason text not null,
  flagged_at timestamptz not null default now(),
  status text not null default 'flagged' check (
    status in ('flagged', 'under_review', 'retained', 'deprecated')
  )
);

create index if not exists integrity_deprecated_assets_tenant_idx
  on public.integrity_deprecated_assets (tenant_id, status, flagged_at desc);

alter table public.integrity_deprecated_assets enable row level security;
revoke all on public.integrity_deprecated_assets from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. integrity_briefings
-- ---------------------------------------------------------------------------
create table if not exists public.integrity_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.integrity_briefings enable row level security;
revoke all on public.integrity_briefings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. integrity_settings
-- ---------------------------------------------------------------------------
create table if not exists public.integrity_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  reviews_enabled boolean not null default true,
  weekly_reviews boolean not null default true,
  show_critical_findings boolean not null default true,
  auto_flag_deprecated boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.integrity_settings enable row level security;
revoke all on public.integrity_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. integrity_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.integrity_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.integrity_audit_log enable row level security;
revoke all on public.integrity_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Helpers (_int_)
-- ---------------------------------------------------------------------------
create or replace function public._int_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._int_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._int_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.integrity_audit_log (tenant_id, event_type, summary, metadata, actor_user_id)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb), public._int_auth_user_id())
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'integrity_' || p_event_type, 'platform_integrity', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._int_ensure_settings(p_tenant_id uuid)
returns public.integrity_settings language plpgsql security definer set search_path = public as $$
declare v_row public.integrity_settings;
begin
  insert into public.integrity_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.integrity_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._int_integrity_band(p_score numeric)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional'
    when p_score >= 75 then 'strong'
    when p_score >= 60 then 'improvements_recommended'
    when p_score >= 40 then 'concerns_identified'
    else 'critical_review_required'
  end;
$$;

create or replace function public._int_band_label(p_band text)
returns text language sql immutable as $$
  select case p_band
    when 'exceptional' then 'Exceptional Integrity (90–100)'
    when 'strong' then 'Strong Integrity (75–89)'
    when 'improvements_recommended' then 'Integrity Improvements Recommended (60–74)'
    when 'concerns_identified' then 'Integrity Concerns Identified (40–59)'
    when 'critical_review_required' then 'Critical Integrity Review Required (below 40)'
    else p_band
  end;
$$;

create or replace function public._int_create_action(
  p_tenant_id uuid, p_finding_id uuid,
  p_description text, p_requires_governance boolean default false
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.integrity_actions (finding_id, tenant_id, action_description, requires_governance, status)
  values (p_finding_id, p_tenant_id, p_description, p_requires_governance,
    case when p_requires_governance then 'awaiting_governance' else 'pending' end)
  returning id into v_id;
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Seed findings from integrated sources
-- ---------------------------------------------------------------------------
create or replace function public._int_seed_findings(
  p_tenant_id uuid,
  p_review_id uuid
)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_settings public.integrity_settings;
  v_gap_count int;
  v_failed_outcomes int;
  v_low_adoption numeric;
  v_dismissed_recs int;
begin
  v_settings := public._int_ensure_settings(p_tenant_id);
  if not v_settings.reviews_enabled then return; end if;

  -- Knowledge integrity: open knowledge gaps
  select count(*) into v_gap_count
  from public.aipify_knowledge_gaps
  where tenant_id = p_tenant_id and status in ('open', 'reviewing');

  if v_gap_count > 0 and not exists (
    select 1 from public.integrity_findings
    where tenant_id = p_tenant_id and domain = 'knowledge' and summary like 'Unresolved knowledge gaps%'
      and status = 'open'
  ) then
    insert into public.integrity_findings (
      review_id, tenant_id, domain, severity, summary, evidence,
      affected_domains, potential_impact, recommended_actions, governance_requirements
    ) values (
      p_review_id, p_tenant_id, 'knowledge',
      case when v_gap_count >= 10 then 'attention_required' else 'monitor' end,
      'Unresolved knowledge gaps may indicate outdated or missing documentation.',
      jsonb_build_object('open_gaps', v_gap_count, 'source', 'knowledge_center'),
      '["knowledge","support"]'::jsonb,
      'Reduced support accuracy and increased escalations.',
      '["Review top knowledge gaps","Assign Knowledge Owner review","Update FAQ entries"]'::jsonb,
      'Low-risk knowledge updates may proceed with Knowledge Owner approval.'
    );
  end if;

  -- Outcomes integration: failed validations
  select count(*) into v_failed_outcomes
  from public.validation_results vr
  join public.success_hypotheses sh on sh.id = vr.hypothesis_id
  where sh.tenant_id = p_tenant_id and vr.validation_status = 'not_validated';

  if v_failed_outcomes > 0 and not exists (
    select 1 from public.integrity_findings
    where tenant_id = p_tenant_id and domain = 'recommendation' and summary like 'Failed outcome validations%'
      and status = 'open'
  ) then
    insert into public.integrity_findings (
      review_id, tenant_id, domain, severity, summary, evidence,
      affected_domains, potential_impact, recommended_actions, governance_requirements
    ) values (
      p_review_id, p_tenant_id, 'recommendation', 'monitor',
      'Failed outcome validations indicate recommendations that did not achieve expected results.',
      jsonb_build_object('failed_validations', v_failed_outcomes, 'source', 'outcomes_engine'),
      '["recommendation","strategic_intelligence"]'::jsonb,
      'Recommendation quality and trust may be affected if patterns persist.',
      '["Review failed hypotheses","Capture lessons learned","Refine recommendation criteria"]'::jsonb,
      'Transparency required — failed recommendations must remain visible.'
    );
  end if;

  -- Human Success integrity
  select coalesce(avg(adoption_score), 75) into v_low_adoption
  from public.user_adoption_scores where tenant_id = p_tenant_id
  and created_at > now() - interval '30 days';

  if v_low_adoption < 60 and not exists (
    select 1 from public.integrity_findings
    where tenant_id = p_tenant_id and domain = 'human_success' and status = 'open'
      and created_at > now() - interval '14 days'
  ) then
    insert into public.integrity_findings (
      review_id, tenant_id, domain, severity, summary, evidence,
      affected_domains, potential_impact, recommended_actions, governance_requirements
    ) values (
      p_review_id, p_tenant_id, 'human_success', 'attention_required',
      'Low adoption scores suggest Human Success initiatives may need review.',
      jsonb_build_object('avg_adoption_score', v_low_adoption, 'source', 'human_success_engine'),
      '["human_success","desktop"]'::jsonb,
      'Users may not be realizing full platform value.',
      '["Review onboarding paths","Identify friction points","Strengthen learning recommendations"]'::jsonb,
      null
    );
  end if;

  -- Recommendation fatigue: dismissed customer recommendations
  select count(*) into v_dismissed_recs
  from public.customer_recommendations
  where tenant_id = p_tenant_id and status = 'dismissed'
    and created_at > now() - interval '30 days';

  if v_dismissed_recs >= 5 and not exists (
    select 1 from public.integrity_findings
    where tenant_id = p_tenant_id and domain = 'recommendation' and summary like 'Recommendation fatigue%'
      and status = 'open'
  ) then
    insert into public.integrity_findings (
      review_id, tenant_id, domain, severity, summary, evidence,
      affected_domains, potential_impact, recommended_actions, governance_requirements
    ) values (
      p_review_id, p_tenant_id, 'recommendation', 'monitor',
      'Recommendation fatigue detected — multiple suggestions dismissed recently.',
      jsonb_build_object('dismissed_count', v_dismissed_recs, 'source', 'customer_lifecycle'),
      '["recommendation"]'::jsonb,
      'Users may perceive recommendations as noise rather than value.',
      '["Reduce recommendation frequency","Improve relevance scoring","Review dismissal patterns"]'::jsonb,
      null
    );
  end if;

  -- Governance integrity: critical evolution proposals pending
  if exists (
    select 1 from public.evolution_proposals
    where tenant_id = p_tenant_id and risk_level = 'critical'
      and status in ('proposed', 'under_review')
      and created_at < now() - interval '14 days'
  ) and not exists (
    select 1 from public.integrity_findings
    where tenant_id = p_tenant_id and domain = 'governance' and status = 'open'
      and created_at > now() - interval '7 days'
  ) then
    insert into public.integrity_findings (
      review_id, tenant_id, domain, severity, summary, evidence,
      affected_domains, potential_impact, recommended_actions, governance_requirements
    ) values (
      p_review_id, p_tenant_id, 'governance', 'critical_review_required',
      'Critical evolution proposals awaiting review beyond expected timeframe.',
      jsonb_build_object('source', 'evolution_governance'),
      '["governance","strategic_intelligence"]'::jsonb,
      'Governance backlog may delay necessary improvements or create risk.',
      '["Escalate to executive reviewer","Complete governance review","Document decision rationale"]'::jsonb,
      'Executive approval required for critical-risk proposals.'
    );
  end if;

  -- Explanation integrity: low confidence explanations
  if exists (
    select 1 from public.decision_explanations
    where tenant_id = p_tenant_id and confidence_level = 'low'
      and created_at > now() - interval '30 days'
    limit 1
  ) and not exists (
    select 1 from public.integrity_findings
    where tenant_id = p_tenant_id and domain = 'explanation' and status = 'open'
      and created_at > now() - interval '14 days'
  ) then
    insert into public.integrity_findings (
      review_id, tenant_id, domain, severity, summary, evidence,
      affected_domains, potential_impact, recommended_actions, governance_requirements
    ) values (
      p_review_id, p_tenant_id, 'explanation', 'monitor',
      'Low-confidence Trust explanations detected — clarity may need improvement.',
      jsonb_build_object('source', 'trust_engine'),
      '["explanation","support"]'::jsonb,
      'Users may not understand why Aipify made certain recommendations.',
      '["Review explanation quality","Improve evidence documentation","Simplify language layers"]'::jsonb,
      null
    );
  end if;

  -- Create actions for open critical/attention findings
  insert into public.integrity_actions (finding_id, tenant_id, action_description, requires_governance, status)
  select f.id, p_tenant_id,
    coalesce(f.recommended_actions->>0, 'Review integrity finding: ' || f.summary),
    f.severity in ('critical_review_required', 'attention_required') and f.domain = 'governance',
    case when f.severity = 'critical_review_required' then 'awaiting_governance' else 'pending' end
  from public.integrity_findings f
  where f.tenant_id = p_tenant_id and f.review_id = p_review_id
    and f.severity in ('attention_required', 'critical_review_required')
    and not exists (select 1 from public.integrity_actions a where a.finding_id = f.id);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Flag deprecated assets
-- ---------------------------------------------------------------------------
create or replace function public._int_flag_deprecated_assets(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_settings public.integrity_settings;
begin
  v_settings := public._int_ensure_settings(p_tenant_id);
  if not v_settings.auto_flag_deprecated then return; end if;

  insert into public.integrity_deprecated_assets (tenant_id, asset_type, asset_ref, asset_title, reason)
  select p_tenant_id, 'faq', kg.id::text,
    left(coalesce(kg.suggested_title, kg.question), 120),
    'Knowledge gap open for extended period — content may be outdated or missing.'
  from public.aipify_knowledge_gaps kg
  where kg.tenant_id = p_tenant_id and kg.status = 'open'
    and kg.created_at < now() - interval '90 days'
  and not exists (
    select 1 from public.integrity_deprecated_assets da
    where da.tenant_id = p_tenant_id and da.asset_ref = kg.id::text and da.status = 'flagged'
  )
  limit 5;

  insert into public.integrity_deprecated_assets (tenant_id, asset_type, asset_ref, asset_title, reason)
  select p_tenant_id, 'recommendation', cr.id::text,
    left(cr.recommendation, 120),
    'Recommendation repeatedly dismissed — may no longer be relevant.'
  from public.customer_recommendations cr
  where cr.tenant_id = p_tenant_id and cr.status = 'dismissed'
    and cr.created_at < now() - interval '60 days'
  and not exists (
    select 1 from public.integrity_deprecated_assets da
    where da.tenant_id = p_tenant_id and da.asset_ref = cr.id::text
  )
  limit 3;
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Calculate Integrity Score
-- ---------------------------------------------------------------------------
create or replace function public._int_calculate_integrity_score(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_trust numeric := 75;
  v_knowledge numeric := 75;
  v_support numeric := 75;
  v_governance numeric := 80;
  v_recommendation numeric := 75;
  v_customer_value numeric := 70;
  v_experience numeric := 75;
  v_marketplace numeric := 70;
  v_overall numeric;
  v_band text;
  v_open_critical int;
  v_gap_count int;
  v_outcomes_score numeric;
  v_customer_score numeric;
  v_id uuid;
begin
  select count(*) filter (where severity = 'critical_review_required'),
         count(*) filter (where domain = 'knowledge')
  into v_open_critical, v_gap_count
  from public.integrity_findings
  where tenant_id = p_tenant_id and status = 'open';

  select coalesce(validated_success_score, 70) into v_outcomes_score
  from public.success_scorecards where tenant_id = p_tenant_id
  order by created_at desc limit 1;

  select coalesce(success_score, 70) into v_customer_score
  from public.customer_profiles where tenant_id = p_tenant_id;

  v_knowledge := greatest(30, 100 - v_gap_count * 3);
  v_trust := case when exists (
    select 1 from public.decision_explanations
    where tenant_id = p_tenant_id and confidence_level = 'low'
      and created_at > now() - interval '30 days'
  ) then 65 else 85 end;

  v_support := coalesce((
    select 100 - count(*) * 5 from public.aipify_friction_events
    where tenant_id = p_tenant_id and resolved_at is null
  ), 75);

  v_governance := case when v_open_critical > 0 then 45 else 85 end;
  v_recommendation := v_outcomes_score;
  v_customer_value := (v_outcomes_score + v_customer_score) / 2;
  v_experience := v_customer_score;
  v_marketplace := 70;

  v_overall := round((
    v_trust * 0.15 +
    v_knowledge * 0.15 +
    v_support * 0.12 +
    v_recommendation * 0.13 +
    v_customer_value * 0.15 +
    v_experience * 0.10 +
    v_marketplace * 0.10 +
    v_governance * 0.10
  )::numeric, 2);

  v_band := public._int_integrity_band(v_overall);

  insert into public.integrity_scores (
    tenant_id, integrity_score, integrity_band,
    trust_score, knowledge_score, support_score, governance_score,
    score_components
  ) values (
    p_tenant_id, v_overall, v_band,
    v_trust, v_knowledge, v_support, v_governance,
    jsonb_build_object(
      'trust_quality', v_trust,
      'knowledge_freshness', v_knowledge,
      'support_effectiveness', v_support,
      'recommendation_accuracy', v_recommendation,
      'customer_value', v_customer_value,
      'experience_consistency', v_experience,
      'marketplace_effectiveness', v_marketplace,
      'governance_alignment', v_governance
    )
  ) returning id into v_id;

  perform public._int_log_audit(p_tenant_id, 'score_recalculated',
    'Integrity Score: ' || v_overall,
    jsonb_build_object('score', v_overall, 'band', v_band, 'scorecard_id', v_id));

  return jsonb_build_object(
    'integrity_score', v_overall,
    'integrity_band', v_band,
    'integrity_band_label', public._int_band_label(v_band),
    'components', jsonb_build_object(
      'trust_quality', v_trust,
      'knowledge_freshness', v_knowledge,
      'support_effectiveness', v_support,
      'recommendation_accuracy', v_recommendation,
      'customer_value', v_customer_value,
      'experience_consistency', v_experience,
      'marketplace_effectiveness', v_marketplace,
      'governance_alignment', v_governance
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Run integrity review
-- ---------------------------------------------------------------------------
create or replace function public._int_run_review(
  p_tenant_id uuid,
  p_period text default 'monthly'
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_review_id uuid;
begin
  insert into public.integrity_reviews (tenant_id, review_type, review_period, status, summary)
  values (
    p_tenant_id, 'comprehensive', p_period, 'completed',
    'Platform integrity review — ' || p_period
  ) returning id into v_review_id;

  perform public._int_seed_findings(p_tenant_id, v_review_id);
  perform public._int_flag_deprecated_assets(p_tenant_id);

  perform public._int_log_audit(p_tenant_id, 'review_completed',
    'Integrity review completed: ' || p_period,
    jsonb_build_object('review_id', v_review_id));

  return v_review_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Trust explanation
-- ---------------------------------------------------------------------------
create or replace function public._int_trust_explanation(p_tenant_id uuid, p_score numeric, p_band text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  return public.generate_decision_explanation(
    'int-score-' || p_tenant_id::text,
    'platform_integrity',
    'platform_integrity',
    'Aipify Integrity Score: ' || p_score || '/100',
    'Band: ' || public._int_band_label(p_band) || '. Score reflects knowledge, support, recommendations, value, and governance alignment.',
    jsonb_build_array(
      jsonb_build_object('source', 'integrity_findings'),
      jsonb_build_object('source', 'outcomes_engine'),
      jsonb_build_object('source', 'human_success')
    ),
    jsonb_build_array('no_score_manipulation', 'transparent_findings', 'human_governed_improvements'),
    'medium',
    '["defer_review","escalate_to_governance"]'::jsonb,
    jsonb_build_array('Review open findings', 'Prioritize critical items', 'Follow governance for major changes'),
    jsonb_build_object(
      'simple', 'This score shows how well Aipify is delivering on its promises in your organization.',
      'operational', 'Integrity reviews analyze knowledge, support, recommendations, and governance alignment.',
      'technical', 'Score computed from findings, outcomes validation, adoption, and gap analysis. Never inflated.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 15. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.acknowledge_integrity_finding(p_finding_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._int_require_tenant();
  update public.integrity_findings set status = 'acknowledged'
  where id = p_finding_id and tenant_id = v_tenant_id;
  perform public._int_log_audit(v_tenant_id, 'finding_acknowledged', 'Finding acknowledged',
    jsonb_build_object('finding_id', p_finding_id));
  return jsonb_build_object('status', 'acknowledged', 'human_oversight_required', true);
end; $$;

create or replace function public.complete_integrity_action(p_action_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_action public.integrity_actions;
begin
  v_tenant_id := public._int_require_tenant();
  select * into v_action from public.integrity_actions
  where id = p_action_id and tenant_id = v_tenant_id;
  if v_action.id is null then raise exception 'Action not found'; end if;
  if v_action.requires_governance and v_action.status = 'awaiting_governance' then
    raise exception 'Governance approval required before completing this action';
  end if;

  update public.integrity_actions set status = 'completed' where id = p_action_id;
  perform public._int_log_audit(v_tenant_id, 'action_completed', v_action.action_description,
    jsonb_build_object('action_id', p_action_id));
  return jsonb_build_object('status', 'completed', 'autonomous_correction', false);
end; $$;

create or replace function public.generate_integrity_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_score jsonb;
  v_id uuid;
  v_summary text;
  v_content jsonb;
  v_review_id uuid;
begin
  v_tenant_id := public._int_require_tenant();
  v_review_id := public._int_run_review(v_tenant_id, 'monthly');
  v_score := public._int_calculate_integrity_score(v_tenant_id);
  perform public._int_trust_explanation(v_tenant_id,
    (v_score->>'integrity_score')::numeric, v_score->>'integrity_band');

  v_summary := 'Integrity Score ' || (v_score->>'integrity_score') || '/100 — ' ||
    public._int_band_label(v_score->>'integrity_band');

  v_content := jsonb_build_object(
    'integrity_score', v_score->'integrity_score',
    'integrity_band', v_score->'integrity_band',
    'integrity_trends', coalesce((
      select jsonb_agg(jsonb_build_object('score', s.integrity_score, 'band', s.integrity_band, 'created_at', s.created_at)
        order by s.created_at desc)
      from public.integrity_scores s where s.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'critical_findings', coalesce((
      select jsonb_agg(jsonb_build_object('domain', f.domain, 'summary', f.summary, 'severity', f.severity))
      from public.integrity_findings f
      where f.tenant_id = v_tenant_id and f.severity = 'critical_review_required' and f.status = 'open'
    ), '[]'::jsonb),
    'improvement_priorities', coalesce((
      select jsonb_agg(jsonb_build_object('summary', f.summary, 'recommended_actions', f.recommended_actions))
      from public.integrity_findings f
      where f.tenant_id = v_tenant_id and f.status = 'open'
      order by case f.severity when 'critical_review_required' then 1 when 'attention_required' then 2 else 3 end
      limit 10
    ), '[]'::jsonb),
    'governance_implications', coalesce((
      select jsonb_agg(jsonb_build_object('summary', f.summary, 'requirements', f.governance_requirements))
      from public.integrity_findings f
      where f.tenant_id = v_tenant_id and f.governance_requirements is not null and f.status = 'open'
    ), '[]'::jsonb),
    'human_oversight_required', true
  );

  insert into public.integrity_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_content) returning id into v_id;

  perform public._int_log_audit(v_tenant_id, 'briefing_generated', v_summary,
    jsonb_build_object('briefing_id', v_id, 'review_id', v_review_id));

  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary, 'content', v_content);
end; $$;

-- ---------------------------------------------------------------------------
-- 16. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_integrity_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_score numeric; v_band text; v_open int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select integrity_score, integrity_band into v_score, v_band
  from public.integrity_scores where tenant_id = v_tenant_id
  order by created_at desc limit 1;

  select count(*) into v_open from public.integrity_findings
  where tenant_id = v_tenant_id and status = 'open';

  return jsonb_build_object(
    'has_customer', true,
    'integrity_score', coalesce(v_score, 0),
    'integrity_band', v_band,
    'integrity_band_label', public._int_band_label(coalesce(v_band, 'improvements_recommended')),
    'open_findings', v_open,
    'philosophy', 'Aipify evaluates itself. Humans govern improvements.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_platform_integrity_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.integrity_settings;
  v_score jsonb;
  v_findings jsonb;
  v_reviews jsonb;
  v_actions jsonb;
  v_deprecated jsonb;
  v_briefings jsonb;
  v_trends jsonb;
  v_domains jsonb;
begin
  v_tenant_id := public._int_require_tenant();
  v_settings := public._int_ensure_settings(v_tenant_id);
  perform public._int_run_review(v_tenant_id, 'monthly');
  v_score := public._int_calculate_integrity_score(v_tenant_id);
  perform public._int_trust_explanation(v_tenant_id,
    (v_score->>'integrity_score')::numeric, v_score->>'integrity_band');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'domain', f.domain, 'severity', f.severity, 'status', f.status,
    'summary', f.summary, 'evidence', f.evidence,
    'affected_domains', f.affected_domains, 'potential_impact', f.potential_impact,
    'recommended_actions', f.recommended_actions,
    'governance_requirements', f.governance_requirements, 'created_at', f.created_at
  ) order by case f.severity
    when 'critical_review_required' then 1 when 'attention_required' then 2
    when 'monitor' then 3 else 4 end), '[]'::jsonb)
  into v_findings
  from public.integrity_findings f
  where f.tenant_id = v_tenant_id and f.status in ('open', 'acknowledged', 'in_review')
  limit 25;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'review_type', r.review_type, 'review_period', r.review_period,
    'status', r.status, 'summary', r.summary, 'created_at', r.created_at
  ) order by r.created_at desc), '[]'::jsonb)
  into v_reviews
  from public.integrity_reviews r where r.tenant_id = v_tenant_id limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'finding_id', a.finding_id, 'action_description', a.action_description,
    'status', a.status, 'requires_governance', a.requires_governance, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_actions
  from public.integrity_actions a where a.tenant_id = v_tenant_id and a.status not in ('completed', 'dismissed')
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'asset_type', d.asset_type, 'asset_title', d.asset_title,
    'reason', d.reason, 'status', d.status, 'flagged_at', d.flagged_at
  ) order by d.flagged_at desc), '[]'::jsonb)
  into v_deprecated
  from public.integrity_deprecated_assets d
  where d.tenant_id = v_tenant_id and d.status in ('flagged', 'under_review')
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb)
  into v_briefings
  from public.integrity_briefings b where b.tenant_id = v_tenant_id limit 5;

  select coalesce(jsonb_agg(jsonb_build_object(
    'score', s.integrity_score, 'band', s.integrity_band, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_trends
  from public.integrity_scores s where s.tenant_id = v_tenant_id limit 12;

  v_domains := jsonb_build_array(
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge Integrity'),
    jsonb_build_object('key', 'support', 'label', 'Support Integrity'),
    jsonb_build_object('key', 'marketplace', 'label', 'Marketplace Integrity'),
    jsonb_build_object('key', 'blueprint', 'label', 'Blueprint Integrity'),
    jsonb_build_object('key', 'recommendation', 'label', 'Recommendation Integrity'),
    jsonb_build_object('key', 'explanation', 'label', 'Explanation Integrity'),
    jsonb_build_object('key', 'human_success', 'label', 'Human Success Integrity'),
    jsonb_build_object('key', 'desktop', 'label', 'Desktop Experience Integrity'),
    jsonb_build_object('key', 'strategic_intelligence', 'label', 'Strategic Intelligence Integrity'),
    jsonb_build_object('key', 'governance', 'label', 'Governance Integrity')
  );

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'reviews_enabled', v_settings.reviews_enabled,
    'show_critical_findings', v_settings.show_critical_findings,
    'philosophy', 'Aipify evaluates itself. Humans govern improvements.',
    'safety_note', 'Integrity scores are never inflated. Quality concerns are never concealed.',
    'integrity_score', v_score->'integrity_score',
    'integrity_band', v_score->'integrity_band',
    'integrity_band_label', v_score->'integrity_band_label',
    'score_components', v_score->'components',
    'review_queue', v_reviews,
    'findings', case when v_settings.show_critical_findings then v_findings else
      (select coalesce(jsonb_agg(x), '[]'::jsonb) from jsonb_array_elements(v_findings) x
       where x->>'severity' != 'critical_review_required') end,
    'actions', v_actions,
    'deprecated_assets', v_deprecated,
    'briefings', v_briefings,
    'integrity_trends', v_trends,
    'review_domains', v_domains,
    'review_frequencies', jsonb_build_array(
      jsonb_build_object('key', 'weekly', 'label', 'Weekly', 'purpose', 'Identify emerging issues'),
      jsonb_build_object('key', 'monthly', 'label', 'Monthly', 'purpose', 'Evaluate trends'),
      jsonb_build_object('key', 'quarterly', 'label', 'Quarterly', 'purpose', 'Assess strategic quality'),
      jsonb_build_object('key', 'annual', 'label', 'Annual', 'purpose', 'Review long-term alignment')
    ),
    'integrations', jsonb_build_object(
      'learning_engine', 'Emerging quality issues and improvement opportunities',
      'strategic_intelligence', 'High-value integrity investments',
      'outcomes_engine', 'Recommendation and marketplace effectiveness',
      'governance', 'Review workflows and approval requirements',
      'trust_engine', 'Transparent findings and explanations',
      'executive_briefing', 'Integrity trends and critical findings',
      'knowledge_center', 'Outdated content and gap identification'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 17. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'integrity', 'Platform Integrity', 'Self-awareness, quality reviews, and integrity guidelines.', 'authenticated', 32
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'integrity' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 18. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_platform_integrity_card() to authenticated;
grant execute on function public.get_platform_integrity_dashboard() to authenticated;
grant execute on function public.acknowledge_integrity_finding(uuid) to authenticated;
grant execute on function public.complete_integrity_action(uuid) to authenticated;
grant execute on function public.generate_integrity_briefing() to authenticated;
