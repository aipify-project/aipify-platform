-- Phase A.85 — Impact Engine (ABOS)
-- Outcome-focused impact orchestration across five dimensions — impact not activity.
-- Distinct from Platform Anonymised Impact, Value Engine Phase 73, Value Realization A.48, Innovation & Impact A.28.

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
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'notification_communication_engine',
    'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'deployment_environment_management_engine',
    'observability_platform_health_engine', 'aipify_install_engine',
    'module_marketplace_foundation_engine', 'aipify_internal_operations_engine',
    'launch_readiness_engine', 'customer_success_engine',
    'aipify_status_transparency_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'operations_center_foundation_engine',
    'continuous_improvement_engine', 'human_oversight_engine',
    'workflow_orchestration_engine', 'business_packs_foundation_engine',
    'industry_intelligence_foundation_engine',
    'marketplace_partner_ecosystem_foundation_engine',
    'ai_ethics_responsible_use_engine',
    'change_management_engine',
    'value_realization_engine',
    'organizational_resilience_engine',
    'incident_response_coordination_engine',
    'service_level_commitment_engine',
    'stakeholder_communication_engine',
    'organizational_decision_support_engine',
    'strategic_alignment_engine',
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'resource_planning_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'trust_reputation_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'priority_focus_engine',
    'growth_evolution_engine',
    'purpose_values_engine',
    'inclusion_humanity_engine',
    'companion_identity_engine',
    'impact_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_impact_engine_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_impact_engine_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  reporting_cadence text not null default 'monthly' check (
    reporting_cadence in ('weekly', 'monthly', 'quarterly')
  ),
  celebrate_progress boolean not null default true,
  include_wellbeing_metrics boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_impact_engine_settings enable row level security;
revoke all on public.organization_impact_engine_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_impact_signals (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_impact_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  dimension text not null check (
    dimension in ('operational', 'customer', 'human', 'knowledge', 'strategic')
  ),
  signal_type text not null,
  summary text not null check (char_length(summary) <= 500),
  trend_pct numeric(6,2),
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  measurement_notes text check (char_length(measurement_notes) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_impact_signals_org_dim_idx
  on public.organization_impact_signals (organization_id, dimension, created_at desc);

alter table public.organization_impact_signals enable row level security;
revoke all on public.organization_impact_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_impact_reports
-- ---------------------------------------------------------------------------
create table if not exists public.organization_impact_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_period text not null,
  summary text not null check (char_length(summary) <= 1000),
  highlights jsonb not null default '[]'::jsonb,
  limitations jsonb not null default '[]'::jsonb,
  assumptions jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (
    status in ('draft', 'published', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_impact_reports_org_idx
  on public.organization_impact_reports (organization_id, status, created_at desc);

alter table public.organization_impact_reports enable row level security;
revoke all on public.organization_impact_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'impact_engine', v.description
from (values
  ('impact_engine.view', 'View Impact Engine', 'View impact dashboard and outcome signals'),
  ('impact_engine.manage', 'Manage Impact Engine', 'Update impact settings and reporting preferences'),
  ('impact_engine.export', 'Export Impact Engine', 'Export impact reports and summaries'),
  ('impact_engine.reports.generate', 'Generate Impact Reports', 'Generate impact summary reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'impact_engine.view'), ('owner', 'impact_engine.manage'),
  ('owner', 'impact_engine.export'), ('owner', 'impact_engine.reports.generate'),
  ('administrator', 'impact_engine.view'), ('administrator', 'impact_engine.manage'),
  ('administrator', 'impact_engine.export'), ('administrator', 'impact_engine.reports.generate'),
  ('manager', 'impact_engine.view'), ('manager', 'impact_engine.manage'),
  ('manager', 'impact_engine.export'), ('manager', 'impact_engine.reports.generate'),
  ('employee', 'impact_engine.view'), ('employee', 'impact_engine.export'),
  ('support_agent', 'impact_engine.view'),
  ('moderator', 'impact_engine.view'),
  ('viewer', 'impact_engine.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_ime_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ime_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'ime_' || p_action_type,
    'impact_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._ime_ensure_settings(p_organization_id uuid)
returns public.organization_impact_engine_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_impact_engine_settings;
begin
  insert into public.organization_impact_engine_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_impact_engine_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._ime_impact_dimensions()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'operational',
      'label', 'Operational impact',
      'bullets', jsonb_build_array(
        'Smoother workflows and reduced operational friction',
        'Faster issue resolution and clearer handoffs',
        'Less time lost to context switching and repeat work'
      )
    ),
    jsonb_build_object(
      'key', 'customer',
      'label', 'Customer impact',
      'bullets', jsonb_build_array(
        'Better customer experience through faster, clearer support',
        'Reduced repeat contacts and improved first-response quality',
        'More consistent communication across channels'
      )
    ),
    jsonb_build_object(
      'key', 'human',
      'label', 'Human impact',
      'bullets', jsonb_build_array(
        'Sustainable workload distribution — not output-only pressure',
        'Wellbeing signals and recovery-friendly rhythms',
        'Teams feel supported, not surveilled or judged'
      )
    ),
    jsonb_build_object(
      'key', 'knowledge',
      'label', 'Knowledge impact',
      'bullets', jsonb_build_array(
        'Knowledge Center articles preventing repeat requests',
        'Fewer knowledge gaps and faster self-service resolution',
        'Approved learning improving support quality over time'
      )
    ),
    jsonb_build_object(
      'key', 'strategic',
      'label', 'Strategic impact',
      'bullets', jsonb_build_array(
        'Clearer priorities and aligned decision-making',
        'Progress toward stated goals — not busyness for its own sake',
        'Evidence that the organization is doing better than before'
      )
    )
  );
$$;

create or replace function public._ime_reporting_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'support_response_improvement',
      'label', 'Support response improvement',
      'example', 'Median first-response time improved 18% this period — customers wait less, teams handle volume sustainably.'
    ),
    jsonb_build_object(
      'key', 'kc_prevented_requests',
      'label', 'Knowledge Center prevented requests',
      'example', 'KC self-service resolved an estimated 24% of repeat questions — fewer tickets, faster answers.'
    ),
    jsonb_build_object(
      'key', 'priority_clarity',
      'label', 'Priority clarity',
      'example', 'Priority Focus alignment rose — teams report clearer top-three focus, less reactive thrash.'
    ),
    jsonb_build_object(
      'key', 'self_love_workload',
      'label', 'Self Love workload distribution',
      'example', 'Workload signals improved — recovery blocks honored, fewer burnout-risk spikes across the week.'
    )
  );
$$;

create or replace function public._ime_celebration_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('context', 'support_milestone', 'bell_text', 'Support response times improved — a quiet bell for meaningful progress.'),
    jsonb_build_object('context', 'kc_milestone', 'bell_text', 'Knowledge Center prevented repeat requests this month — worth a bell.'),
    jsonb_build_object('context', 'wellbeing_milestone', 'bell_text', 'Workload distribution improved — sustainable rhythms, not just output.'),
    jsonb_build_object('context', 'priority_milestone', 'bell_text', 'Priority clarity rose — teams know what matters most.'),
    jsonb_build_object('context', 'strategic_milestone', 'bell_text', 'We are doing better than we were before — progress noted.')
  );
$$;

create or replace function public._ime_trust_note()
returns text language sql immutable as $$
  select 'Impact calculations are transparent: each signal includes confidence, measurement notes, and limitations. Metadata only — no raw customer conversations, emails, or PII. Assumptions are stated explicitly in every report.';
$$;

create or replace function public._ime_self_love_note()
returns text language sql immutable as $$
  select 'Self Love connects sustainability, wellbeing, recovery, and long-term success — impact includes human outcomes, not output-only metrics. Growth never at the expense of dignity or rest.';
$$;

create or replace function public._ime_seed_signals(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_impact_signals
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_impact_signals (
    organization_id, dimension, signal_type, summary, trend_pct, confidence, measurement_notes, metadata
  ) values
    (p_organization_id, 'operational', 'response_time_improvement',
     'Median support first-response time improved — operational friction reduced.',
     18.0, 'moderate',
     'Compared to prior 30-day baseline; metadata aggregates only.',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'customer', 'repeat_contact_reduction',
     'Repeat customer contacts declined — clearer answers on first touch.',
     -12.5, 'moderate',
     'Estimated from ticket metadata patterns; no message content stored.',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'human', 'workload_balance',
     'Workload distribution signals improved — fewer burnout-risk spikes.',
     8.0, 'low',
     'Self Love wellbeing metrics optional; illustrative when enabled.',
     '{"seed": true, "metadata_only": true, "self_love_aligned": true}'::jsonb),
    (p_organization_id, 'knowledge', 'kc_deflection',
     'Knowledge Center articles prevented an estimated share of repeat requests.',
     24.0, 'moderate',
     'Deflection estimated from KC view-to-ticket ratio metadata.',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'strategic', 'priority_clarity',
     'Priority Focus alignment rose — teams report clearer top-three focus.',
     15.0, 'moderate',
     'Derived from priority resolution and focus-session metadata.',
     '{"seed": true, "metadata_only": true}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. update settings
-- ---------------------------------------------------------------------------
create or replace function public.update_impact_engine_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_impact_engine_settings;
begin
  perform public._irp_require_permission('impact_engine.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._ime_ensure_settings(v_org_id);

  update public.organization_impact_engine_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    reporting_cadence = coalesce(nullif(trim(p_payload->>'reporting_cadence'), ''), reporting_cadence),
    celebrate_progress = coalesce((p_payload->>'celebrate_progress')::boolean, celebrate_progress),
    include_wellbeing_metrics = coalesce(
      (p_payload->>'include_wellbeing_metrics')::boolean, include_wellbeing_metrics
    ),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._ime_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'enabled', v_row.enabled,
    'reporting_cadence', v_row.reporting_cadence,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. generate_impact_summary
-- ---------------------------------------------------------------------------
create or replace function public.generate_impact_summary(p_period text default 'monthly')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_period text;
  v_report_id uuid;
  v_highlights jsonb;
  v_limitations jsonb;
  v_assumptions jsonb;
  v_summary text;
  v_signal_count int;
begin
  perform public._irp_require_permission('impact_engine.reports.generate');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._ime_ensure_settings(v_org_id);
  perform public._ime_seed_signals(v_org_id);

  v_period := coalesce(nullif(trim(p_period), ''), 'monthly');
  if v_period not in ('weekly', 'monthly', 'quarterly') then
    raise exception 'Invalid report period: %', v_period;
  end if;

  select count(*) into v_signal_count
  from public.organization_impact_signals
  where organization_id = v_org_id;

  v_highlights := coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'dimension', s.dimension,
        'signal_type', s.signal_type,
        'summary', s.summary,
        'trend_pct', s.trend_pct,
        'confidence', s.confidence
      ) order by s.dimension asc
    )
    from (
      select distinct on (dimension) *
      from public.organization_impact_signals
      where organization_id = v_org_id
      order by dimension, created_at desc
    ) s
  ), '[]'::jsonb);

  v_limitations := jsonb_build_array(
    'Metadata-only signals — no raw customer content or PII',
    'Trend percentages are illustrative when seed data is present',
    'Cross-engine integrations may not yet be fully connected',
    'Low-confidence signals require human review before executive use'
  );

  v_assumptions := jsonb_build_array(
    'Activity does not equal progress — outcomes matter more than volume',
    'Wellbeing metrics included only when include_wellbeing_metrics is enabled',
    'Comparisons use prior-period baselines from approved metadata sources',
    'Celebration bells respect celebrate_progress setting'
  );

  v_summary := format(
    'Impact summary for %s period: %s outcome signals across five dimensions. Activity ≠ progress — meaningful improvements for people, teams, and the organization.',
    v_period, v_signal_count
  );

  insert into public.organization_impact_reports (
    organization_id, report_period, summary, highlights, limitations, assumptions, status, metadata
  ) values (
    v_org_id, v_period, v_summary, v_highlights, v_limitations, v_assumptions, 'published',
    jsonb_build_object('generated_by', v_user_id, 'metadata_only', true, 'signal_count', v_signal_count)
  )
  returning id into v_report_id;

  perform public._ime_log(v_org_id, v_user_id, 'summary_generated', jsonb_build_object(
    'report_id', v_report_id,
    'report_period', v_period,
    'metadata_only', true
  ));

  return jsonb_build_object(
    'success', true,
    'report_id', v_report_id,
    'report_period', v_period,
    'summary', v_summary,
    'highlights', v_highlights,
    'limitations', v_limitations,
    'assumptions', v_assumptions,
    'status', 'published'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_impact_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_signals int := 0;
  v_reports int := 0;
  v_positive_trends int := 0;
begin
  perform public._irp_require_permission('impact_engine.view');
  v_org_id := public._mta_require_organization();
  perform public._ime_ensure_settings(v_org_id);
  perform public._ime_seed_signals(v_org_id);

  select count(*) into v_signals
  from public.organization_impact_signals where organization_id = v_org_id;

  select count(*) into v_reports
  from public.organization_impact_reports
  where organization_id = v_org_id and status = 'published';

  select count(*) into v_positive_trends
  from public.organization_impact_signals
  where organization_id = v_org_id and trend_pct > 0;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Activity ≠ progress — measure value for people, teams, and organizations.',
    'signal_count', v_signals,
    'published_reports', v_reports,
    'positive_trends', v_positive_trends,
    'enabled', (select enabled from public.organization_impact_engine_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_impact_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_impact_engine_settings;
begin
  perform public._irp_require_permission('impact_engine.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._ime_ensure_settings(v_org_id);
  perform public._ime_seed_signals(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Activity ≠ progress. Impact means meaningful improvements — not busyness for its own sake.',
    'mission', 'Help organizations understand how Aipify contributes to healthier operations, relationships, and outcomes.',
    'abos_principle', 'Improve lives, not busyness — measure value for people, teams, and organizations.',
    'vision', 'We are doing better than we were before.',
    'distinction_note',
      'Distinct from Platform Anonymised Impact (/platform/impact), Value Engine Phase 73 (/app/value), Value Realization A.48 (/app/value-realization-engine), and Innovation & Impact A.28 (/app/innovation-impact-engine). ABOS Impact Engine: outcome-focused impact orchestration across five dimensions.',
    'impact_dimensions', public._ime_impact_dimensions(),
    'reporting_examples', public._ime_reporting_examples(),
    'celebration_examples', public._ime_celebration_examples(),
    'self_love_note', public._ime_self_love_note(),
    'trust_note', public._ime_trust_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'dimension', s.dimension,
          'signal_type', s.signal_type,
          'summary', s.summary,
          'trend_pct', s.trend_pct,
          'confidence', s.confidence,
          'measurement_notes', s.measurement_notes,
          'metadata', s.metadata,
          'created_at', s.created_at,
          'updated_at', s.updated_at
        ) order by s.created_at desc
      )
      from (
        select * from public.organization_impact_signals
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) s
    ), '[]'::jsonb),
    'latest_report', (
      select jsonb_build_object(
        'id', r.id,
        'report_period', r.report_period,
        'summary', r.summary,
        'highlights', r.highlights,
        'limitations', r.limitations,
        'assumptions', r.assumptions,
        'status', r.status,
        'created_at', r.created_at,
        'updated_at', r.updated_at
      )
      from public.organization_impact_reports r
      where r.organization_id = v_org_id
      order by r.created_at desc
      limit 1
    ),
    'summary', jsonb_build_object(
      'signal_count', coalesce((
        select count(*) from public.organization_impact_signals where organization_id = v_org_id
      ), 0),
      'signals_by_dimension', coalesce((
        select jsonb_object_agg(dimension, cnt)
        from (
          select dimension, count(*) as cnt
          from public.organization_impact_signals
          where organization_id = v_org_id
          group by dimension
        ) d
      ), '{}'::jsonb),
      'published_reports', coalesce((
        select count(*) from public.organization_impact_reports
        where organization_id = v_org_id and status = 'published'
      ), 0),
      'positive_trends', coalesce((
        select count(*) from public.organization_impact_signals
        where organization_id = v_org_id and trend_pct > 0
      ), 0),
      'celebrate_progress', v_settings.celebrate_progress,
      'include_wellbeing_metrics', v_settings.include_wellbeing_metrics
    ),
    'integration_links', jsonb_build_object(
      'value_realization', '/app/value-realization-engine',
      'innovation_impact', '/app/innovation-impact-engine',
      'value_engine', '/app/value',
      'platform_impact', '/platform/impact',
      'organizational_health', '/app/organizational-health-engine',
      'priority_focus', '/app/priority-focus-engine',
      'purpose_values', '/app/purpose-values-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('impact_engine.manage'),
      'can_export', public._irp_has_permission('impact_engine.export'),
      'can_generate_reports', public._irp_has_permission('impact_engine.reports.generate')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_impact_engine_report(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_impact_engine_settings;
begin
  perform public._irp_require_permission('impact_engine.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._ime_ensure_settings(v_org_id);
  perform public._ime_seed_signals(v_org_id);

  perform public._ime_log(v_org_id, v_user_id, 'report_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'impact_engine',
    'format', coalesce(p_format, 'json'),
    'philosophy', 'Activity ≠ progress — measure value for people, teams, and organizations.',
    'mission', 'Help organizations understand how Aipify contributes to healthier operations, relationships, and outcomes.',
    'abos_principle', 'Improve lives, not busyness.',
    'vision', 'We are doing better than we were before.',
    'impact_dimensions', public._ime_impact_dimensions(),
    'reporting_examples', public._ime_reporting_examples(),
    'trust_note', public._ime_trust_note(),
    'self_love_note', public._ime_self_love_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'dimension', s.dimension,
          'signal_type', s.signal_type,
          'summary', s.summary,
          'trend_pct', s.trend_pct,
          'confidence', s.confidence,
          'measurement_notes', s.measurement_notes,
          'created_at', s.created_at
        ) order by s.created_at desc
      )
      from public.organization_impact_signals s
      where s.organization_id = v_org_id
      order by s.created_at desc
      limit 50
    ), '[]'::jsonb),
    'latest_report', (
      select jsonb_build_object(
        'id', r.id,
        'report_period', r.report_period,
        'summary', r.summary,
        'highlights', r.highlights,
        'limitations', r.limitations,
        'assumptions', r.assumptions,
        'status', r.status,
        'created_at', r.created_at
      )
      from public.organization_impact_reports r
      where r.organization_id = v_org_id
      order by r.created_at desc
      limit 1
    ),
    'summary', jsonb_build_object(
      'signal_count', coalesce((
        select count(*) from public.organization_impact_signals where organization_id = v_org_id
      ), 0),
      'published_reports', coalesce((
        select count(*) from public.organization_impact_reports
        where organization_id = v_org_id and status = 'published'
      ), 0)
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('impact_engine.manage'),
      'can_export', true,
      'can_generate_reports', public._irp_has_permission('impact_engine.reports.generate')
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Audit allowlist extension
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'insight_dismissed', 'strategic_export_generated', 'insight_status_changed',
    'operations_event_acknowledged', 'operations_event_assigned', 'operations_event_escalated',
    'operations_event_resolved', 'operations_event_dismissed',
    'improvement_approved', 'improvement_dismissed', 'improvement_implemented',
    'improvement_feedback_submitted', 'improvement_outcome_reviewed',
    'oversight_approval_submitted', 'oversight_approval_granted', 'oversight_approval_rejected',
    'oversight_override_applied', 'oversight_critical_confirmed', 'oversight_rationale_updated',
    'oversight_settings_changed',
    'business_pack_activated', 'business_pack_customized', 'business_pack_update_acknowledged',
    'workflow_created', 'workflow_status_changed', 'workflow_executed',
    'workflow_template_applied', 'workflow_step_approval_requested', 'workflow_step_approved',
    'workflow_step_rejected', 'workflow_escalated',
    'industry_profile_assigned', 'industry_insight_overridden', 'industry_insights_toggled',
    'industry_terminology_updated', 'industry_priorities_updated', 'industry_insights_exported',
    'change_initiative_created', 'change_initiative_status_updated', 'change_impact_assessed',
    'change_communication_plan_created', 'change_communication_released',
    'change_training_assigned', 'change_adoption_metric_recorded', 'change_milestone_completed',
    'value_baseline_captured', 'value_metric_recorded', 'value_metric_updated',
    'value_report_generated', 'value_report_exported', 'value_milestone_adjusted',
    'resilience_plan_created', 'resilience_plan_status_updated', 'resilience_plan_approved',
    'resilience_simulation_recorded', 'resilience_review_completed',
    'resilience_vulnerability_recorded', 'resilience_vulnerability_resolved',
    'irce_incident_created', 'irce_incident_owner_assigned', 'irce_incident_severity_updated',
    'irce_incident_status_updated', 'irce_incident_escalated', 'irce_incident_resolved',
    'irce_incident_closed', 'irce_incident_communication_recorded', 'irce_incident_lessons_captured',
    'odse_decision_proposed', 'odse_decision_review_started', 'odse_decision_approved',
    'odse_decision_rejected', 'odse_decision_implemented', 'odse_decision_outcome_recorded',
    'odse_decision_report_exported',
    'sae_objective_created', 'sae_objective_updated', 'sae_objective_entity_linked',
    'sae_strategic_review_recorded', 'sae_misalignment_detected', 'sae_alignment_report_exported',
    'ohe_health_measured', 'ohe_category_refreshed', 'ohe_score_overridden',
    'ohe_recommendations_generated', 'ohe_intervention_approved', 'ohe_health_report_exported',
    'cma_assessment_created', 'cma_assessment_updated', 'cma_roadmap_generated', 'cma_maturity_report_exported',
    'obe_profile_created', 'obe_profile_updated', 'obe_comparison_generated', 'obe_benchmark_report_exported',
    'doe_template_created', 'doe_template_updated', 'doe_template_archived',
    'doe_output_generated', 'doe_schedule_created', 'doe_schedule_cancelled',
    'doe_delivery_recorded', 'doe_manifest_exported',
    'rrme_policy_created', 'rrme_policy_updated', 'rrme_policy_retired',
    'rrme_record_archived', 'rrme_record_restored',
    'rrme_disposal_requested', 'rrme_disposal_rejected', 'rrme_disposal_approved', 'rrme_disposal_completed',
    'mcie_meeting_created', 'mcie_meeting_status_updated', 'mcie_meeting_cancelled',
    'mcie_agenda_generated', 'mcie_summary_captured', 'mcie_actions_extracted',
    'mcie_action_assigned', 'mcie_action_status_updated', 'mcie_actions_marked_overdue',
    'mcie_decision_captured', 'mcie_outputs_generated', 'mcie_manifest_exported',
    'utfe_task_created', 'utfe_task_created_from_source', 'utfe_task_assigned',
    'utfe_task_status_updated', 'utfe_task_completed', 'utfe_reminder_scheduled',
    'utfe_task_escalated', 'utfe_calendar_sync_requested', 'utfe_manifest_exported',
    'rpe_plan_created', 'rpe_plan_status_updated', 'rpe_plan_approved',
    'rpe_allocation_created', 'rpe_allocation_updated', 'rpe_utilization_overridden',
    'rpe_scenario_created', 'rpe_scenarios_compared', 'rpe_manifest_exported',
    'cwme_capacity_profile_created', 'cwme_capacity_profile_updated',
    'cwme_workload_item_created', 'cwme_workload_reassigned',
    'cwme_warning_acknowledged', 'cwme_threshold_updated', 'cwme_manifest_exported',
    'goke_objective_created', 'goke_objective_activated', 'goke_objective_completion_approved',
    'goke_key_result_created', 'goke_progress_updated', 'goke_progress_overridden',
    'goke_manifest_exported',
    'pie_insights_generated', 'pie_insight_dismissed', 'pie_manifest_exported',
    'ctie_participation_updated', 'ctie_insights_generated', 'ctie_anonymized_contribution',
    'ctie_recommendation_approved', 'ctie_outcome_recorded', 'ctie_manifest_exported',
    'pse_partner_created', 'pse_partner_updated', 'pse_partner_status_changed',
    'pse_engagement_created', 'pse_review_recorded', 'pse_manifest_exported', 'pse_outcome_recorded',
    'tre_trust_score_refreshed', 'tre_signal_recorded', 'tre_manifest_exported',
    'acge_budget_created', 'acge_budget_updated', 'acge_usage_recorded', 'acge_alert_triggered',
    'acge_manifest_exported',
    'owe_workspace_created', 'owe_workspace_updated', 'owe_workspace_archived',
    'owe_workspace_switched', 'owe_member_invited', 'owe_member_updated',
    'owe_custom_role_created', 'owe_org_permissions_saved', 'owe_summary_exported',
    'cpie_critical_alert_acknowledged', 'cpie_quiet_mode_changed', 'cpie_org_settings_changed',
    'pce_nudge_dismissed', 'pce_nudge_snoozed', 'pce_nudge_acted',
    'pce_org_settings_changed', 'pce_user_preferences_changed', 'pce_summary_exported',
    'gee_settings_changed', 'gee_recommendation_accepted', 'gee_recommendation_dismissed',
    'gee_recommendation_deferred', 'gee_report_exported',
    'pfe_item_created', 'pfe_item_updated', 'pfe_recommendation_resolved',
    'pfe_org_settings_changed', 'pfe_summary_exported',
    'pve_value_upserted', 'pve_settings_changed', 'pve_reflection_acknowledged',
    'pve_reflection_dismissed', 'pve_report_exported',
    'ihe_settings_changed', 'ihe_reflection_acknowledged', 'ihe_reflection_dismissed',
    'ihe_report_exported',
    'cie_settings_changed', 'cie_report_exported',
    'ime_settings_changed', 'ime_summary_generated', 'ime_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%' or p_action_type like 'ihe_%'
    or p_action_type like 'cie_%' or p_action_type like 'ime_%';
$$;

-- ---------------------------------------------------------------------------
-- 10. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'impact-engine', 'Impact Engine',
  'Outcome-focused impact orchestration — measure meaningful improvements across operational, customer, human, knowledge, and strategic dimensions.',
  'authenticated', 107
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'impact-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 11. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_impact_engine_card() to authenticated;
grant execute on function public.get_impact_engine_dashboard() to authenticated;
grant execute on function public.update_impact_engine_settings(jsonb) to authenticated;
grant execute on function public.generate_impact_summary(text) to authenticated;
grant execute on function public.export_impact_engine_report(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 12. Seed settings + sample data per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._ime_ensure_settings(v_org_id);
    perform public._ime_seed_signals(v_org_id);
  end loop;
end; $$;
