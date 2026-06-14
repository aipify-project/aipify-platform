-- Phase A.57 — Capability Maturity Engine
-- Extends Learning & Training (A.36), Value Realization (A.48), Strategic Alignment (A.55).
-- Prefix _cma_ (distinct from change-management _cme_).

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
    'capability_maturity_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. capability_maturity_assessments
-- ---------------------------------------------------------------------------
create table if not exists public.capability_maturity_assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain text not null check (
    domain in (
      'support_operations', 'governance', 'knowledge_management',
      'workflow_automation', 'change_management', 'strategic_execution'
    )
  ),
  maturity_level int not null check (maturity_level between 1 and 5),
  assessment_summary text,
  assessed_by uuid references public.users (id) on delete set null,
  assessed_at timestamptz not null default now(),
  criteria_scores jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists capability_maturity_assessments_org_idx
  on public.capability_maturity_assessments (organization_id, domain, assessed_at desc);

alter table public.capability_maturity_assessments enable row level security;
revoke all on public.capability_maturity_assessments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. capability_maturity_roadmaps
-- ---------------------------------------------------------------------------
create table if not exists public.capability_maturity_roadmaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain text not null check (
    domain in (
      'support_operations', 'governance', 'knowledge_management',
      'workflow_automation', 'change_management', 'strategic_execution'
    )
  ),
  recommendations jsonb not null default '[]'::jsonb,
  learning_requirements text,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'completed', 'archived')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, domain)
);

create index if not exists capability_maturity_roadmaps_org_idx
  on public.capability_maturity_roadmaps (organization_id, status, domain);

alter table public.capability_maturity_roadmaps enable row level security;
revoke all on public.capability_maturity_roadmaps from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. capability_maturity_reports
-- ---------------------------------------------------------------------------
create table if not exists public.capability_maturity_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_type text not null default 'executive_overview' check (
    report_type in ('domain_summary', 'executive_overview', 'roadmap_export', 'assessment_history')
  ),
  exported_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists capability_maturity_reports_org_idx
  on public.capability_maturity_reports (organization_id, report_type, exported_at desc);

alter table public.capability_maturity_reports enable row level security;
revoke all on public.capability_maturity_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'capability_maturity', v.description
from (values
  ('maturity.view', 'View Maturity', 'View capability maturity assessments and roadmaps'),
  ('maturity.manage', 'Manage Maturity', 'Create and update maturity assessments'),
  ('maturity.review', 'Review Maturity', 'Review assessments and generate improvement roadmaps'),
  ('maturity.export', 'Export Maturity', 'Export capability maturity reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'maturity.view'), ('owner', 'maturity.manage'), ('owner', 'maturity.review'), ('owner', 'maturity.export'),
  ('administrator', 'maturity.view'), ('administrator', 'maturity.manage'), ('administrator', 'maturity.review'), ('administrator', 'maturity.export'),
  ('manager', 'maturity.view'), ('manager', 'maturity.manage'), ('manager', 'maturity.review'), ('manager', 'maturity.export'),
  ('support_agent', 'maturity.view'),
  ('viewer', 'maturity.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_cma_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._cma_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'maturity_assessment',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._cma_maturity_level_label(p_level int)
returns text language sql immutable as $$
  select case coalesce(p_level, 1)
    when 1 then 'initial'
    when 2 then 'developing'
    when 3 then 'established'
    when 4 then 'advanced'
    when 5 then 'optimized'
    else 'initial'
  end;
$$;

create or replace function public._cma_learning_training_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'learning_paths' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'learning_paths', coalesce((
      select count(*) from public.learning_paths where organization_id = p_organization_id
    ), 0),
    'assigned_paths', coalesce((
      select count(*) from public.learning_path_assignments where organization_id = p_organization_id
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._cma_value_realization_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_value_metrics' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'tracked_metrics', coalesce((
      select count(*) from public.organization_value_metrics where organization_id = p_organization_id
    ), 0),
    'positive_improvements', coalesce((
      select count(*) from public.organization_value_metrics
      where organization_id = p_organization_id and improvement_percentage > 0
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._cma_organizational_health_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organizational_health_scores' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'health_scores', coalesce((
      select count(*) from public.organizational_health_scores where organization_id = p_organization_id
    ), 0),
    'pending_interventions', coalesce((
      select count(*) from public.organizational_health_interventions
      where organization_id = p_organization_id and status in ('proposed', 'approved')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._cma_strategic_alignment_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'strategic_objectives' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'active_objectives', coalesce((
      select count(*) from public.strategic_objectives
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'strategic_priority', coalesce((
      select count(*) from public.strategic_objectives
      where organization_id = p_organization_id and priority = 'strategic' and status in ('planned', 'active')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._cma_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'assessed_domains', coalesce((
      select count(distinct domain) from public.capability_maturity_assessments
      where organization_id = p_organization_id
    ), 0),
    'total_assessments', coalesce((
      select count(*) from public.capability_maturity_assessments where organization_id = p_organization_id
    ), 0),
    'average_maturity_level', coalesce((
      select round(avg(maturity_level)::numeric, 2)
      from (
        select distinct on (domain) maturity_level
        from public.capability_maturity_assessments
        where organization_id = p_organization_id
        order by domain, assessed_at desc
      ) latest
    ), 0),
    'active_roadmaps', coalesce((
      select count(*) from public.capability_maturity_roadmaps
      where organization_id = p_organization_id and status in ('draft', 'active')
    ), 0),
    'domains_below_established', coalesce((
      select count(*) from (
        select distinct on (domain) domain, maturity_level
        from public.capability_maturity_assessments
        where organization_id = p_organization_id
        order by domain, assessed_at desc
      ) latest where latest.maturity_level < 3
    ), 0)
  );
end; $$;

create or replace function public._cma_capture_memory_hook(
  p_organization_id uuid,
  p_assessment_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;

  return public.capture_organization_memory(
    'maturity_assessment',
    left(coalesce(p_summary, 'Maturity assessment captured'), 500),
    jsonb_build_object(
      'source', 'capability_maturity_engine',
      'assessment_id', p_assessment_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._cma_domain_roadmap_recommendations(
  p_domain text,
  p_maturity_level int
)
returns jsonb language sql immutable as $$
  select case p_domain
    when 'support_operations' then jsonb_build_array(
      jsonb_build_object('priority', 'high', 'action', 'Standardize support triage workflows'),
      jsonb_build_object('priority', 'medium', 'action', 'Document escalation paths and SLAs')
    )
    when 'governance' then jsonb_build_array(
      jsonb_build_object('priority', 'high', 'action', 'Establish approval policies for AI actions'),
      jsonb_build_object('priority', 'medium', 'action', 'Schedule quarterly governance reviews')
    )
    when 'knowledge_management' then jsonb_build_array(
      jsonb_build_object('priority', 'high', 'action', 'Approve and publish core knowledge articles'),
      jsonb_build_object('priority', 'medium', 'action', 'Close recurring knowledge gaps')
    )
    when 'workflow_automation' then jsonb_build_array(
      jsonb_build_object('priority', 'high', 'action', 'Map high-volume manual workflows'),
      jsonb_build_object('priority', 'medium', 'action', 'Pilot reversible automation with human oversight')
    )
    when 'change_management' then jsonb_build_array(
      jsonb_build_object('priority', 'high', 'action', 'Define change communication templates'),
      jsonb_build_object('priority', 'medium', 'action', 'Track adoption metrics per initiative')
    )
    when 'strategic_execution' then jsonb_build_array(
      jsonb_build_object('priority', 'high', 'action', 'Link objectives to operational entities'),
      jsonb_build_object('priority', 'medium', 'action', 'Conduct alignment reviews quarterly')
    )
    else jsonb_build_array(
      jsonb_build_object('priority', 'medium', 'action', 'Review domain practices and document gaps')
    )
  end ||
  case when coalesce(p_maturity_level, 1) < 3 then
    jsonb_build_array(jsonb_build_object('priority', 'high', 'action', 'Complete foundational training for ' || p_domain))
  else '[]'::jsonb end;
$$;

create or replace function public._cma_learning_requirements_text(
  p_domain text,
  p_maturity_level int
)
returns text language sql immutable as $$
  select case
    when coalesce(p_maturity_level, 1) <= 2 then
      'Assign foundational learning paths for ' || p_domain || ' — review team readiness via Learning & Training Engine (A.36).'
    when coalesce(p_maturity_level, 1) = 3 then
      'Assign intermediate certification paths — validate readiness before advancing to established practices.'
    else
      'Optional advanced workshops — maintain maturity through periodic reviews and knowledge refresh.'
  end;
$$;

create or replace function public._cma_seed_assessments(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.capability_maturity_assessments
    where organization_id = p_organization_id limit 1
  ) then
    return;
  end if;

  insert into public.capability_maturity_assessments (
    organization_id, domain, maturity_level, assessment_summary, criteria_scores
  )
  values
    (
      p_organization_id, 'support_operations', 2,
      'Support operations at developing level — triage workflows need standardization.',
      jsonb_build_object('triage_consistency', 2, 'escalation_clarity', 2, 'knowledge_usage', 3)
    ),
    (
      p_organization_id, 'governance', 2,
      'Governance at developing level — approval policies partially documented.',
      jsonb_build_object('policy_coverage', 2, 'audit_trail', 3, 'human_oversight', 2)
    ),
    (
      p_organization_id, 'strategic_execution', 1,
      'Strategic execution at initial level — objectives not yet linked to operations.',
      jsonb_build_object('objective_clarity', 1, 'entity_linking', 1, 'review_cadence', 2)
    );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_maturity_assessment(
  p_domain text,
  p_maturity_level int default 1,
  p_assessment_summary text default null,
  p_criteria_scores jsonb default '{}'::jsonb,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.capability_maturity_assessments;
  v_memory jsonb;
begin
  perform public._irp_require_permission('maturity.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if coalesce(p_maturity_level, 1) < 1 or coalesce(p_maturity_level, 1) > 5 then
    raise exception 'Maturity level must be between 1 and 5';
  end if;

  insert into public.capability_maturity_assessments (
    organization_id, domain, maturity_level, assessment_summary,
    assessed_by, criteria_scores
  )
  values (
    v_org_id, coalesce(p_domain, 'support_operations'),
    coalesce(p_maturity_level, 1),
    left(coalesce(p_assessment_summary, ''), 2000),
    v_user_id, coalesce(p_criteria_scores, '{}'::jsonb)
  )
  returning * into v_row;

  v_memory := '{}'::jsonb;
  if coalesce(p_capture_memory, false) then
    v_memory := public._cma_capture_memory_hook(
      v_org_id, v_row.id, v_row.assessment_summary,
      jsonb_build_object('domain', v_row.domain, 'maturity_level', v_row.maturity_level)
    );
  end if;

  perform public._cma_log(
    v_org_id, 'cma_assessment_created', 'maturity_assessment', v_row.id,
    jsonb_build_object(
      'domain', v_row.domain,
      'maturity_level', v_row.maturity_level,
      'maturity_label', public._cma_maturity_level_label(v_row.maturity_level),
      'memory_hook', v_memory
    )
  );

  return jsonb_build_object('assessment', row_to_json(v_row)::jsonb, 'memory_hook', v_memory);
end; $$;

create or replace function public.update_maturity_assessment(
  p_assessment_id uuid,
  p_maturity_level int default null,
  p_assessment_summary text default null,
  p_criteria_scores jsonb default null,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.capability_maturity_assessments;
  v_memory jsonb;
begin
  perform public._irp_require_permission('maturity.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if p_maturity_level is not null and (p_maturity_level < 1 or p_maturity_level > 5) then
    raise exception 'Maturity level must be between 1 and 5';
  end if;

  update public.capability_maturity_assessments
  set
    maturity_level = coalesce(p_maturity_level, maturity_level),
    assessment_summary = coalesce(left(p_assessment_summary, 2000), assessment_summary),
    criteria_scores = coalesce(p_criteria_scores, criteria_scores),
    assessed_by = v_user_id,
    assessed_at = now(),
    updated_at = now()
  where id = p_assessment_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Assessment not found'; end if;

  v_memory := '{}'::jsonb;
  if coalesce(p_capture_memory, false) then
    v_memory := public._cma_capture_memory_hook(
      v_org_id, v_row.id, v_row.assessment_summary,
      jsonb_build_object('domain', v_row.domain, 'maturity_level', v_row.maturity_level)
    );
  end if;

  perform public._cma_log(
    v_org_id, 'cma_assessment_updated', 'maturity_assessment', v_row.id,
    jsonb_build_object(
      'domain', v_row.domain,
      'maturity_level', v_row.maturity_level,
      'updated_by', v_user_id,
      'memory_hook', v_memory
    )
  );

  return jsonb_build_object('assessment', row_to_json(v_row)::jsonb, 'memory_hook', v_memory);
end; $$;

create or replace function public.generate_maturity_roadmap(
  p_domain text default null,
  p_status text default 'active'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_domain text;
  v_level int;
  v_row public.capability_maturity_roadmaps;
  v_generated jsonb := '[]'::jsonb;
  v_rec record;
begin
  perform public._irp_require_permission('maturity.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  for v_rec in
    select d.domain as domain_name
    from (values
      ('support_operations'), ('governance'), ('knowledge_management'),
      ('workflow_automation'), ('change_management'), ('strategic_execution')
    ) as d(domain)
    where p_domain is null or d.domain = p_domain
  loop
    select a.maturity_level into v_level
    from public.capability_maturity_assessments a
    where a.organization_id = v_org_id and a.domain = v_rec.domain_name
    order by a.assessed_at desc
    limit 1;

    v_level := coalesce(v_level, 1);

    insert into public.capability_maturity_roadmaps (
      organization_id, domain, recommendations, learning_requirements, status
    )
    values (
      v_org_id, v_rec.domain_name,
      public._cma_domain_roadmap_recommendations(v_rec.domain_name, v_level),
      public._cma_learning_requirements_text(v_rec.domain_name, v_level),
      coalesce(p_status, 'active')
    )
    on conflict (organization_id, domain) do update
    set
      recommendations = excluded.recommendations,
      learning_requirements = excluded.learning_requirements,
      status = excluded.status,
      updated_at = now()
    returning * into v_row;

    v_generated := v_generated || jsonb_build_array(row_to_json(v_row)::jsonb);
  end loop;

  perform public._cma_log(
    v_org_id, 'cma_roadmap_generated', 'maturity_roadmap', null,
    jsonb_build_object('domain', p_domain, 'generated_count', jsonb_array_length(v_generated), 'generated_by', v_user_id)
  );

  return jsonb_build_object('roadmaps', v_generated, 'generated_count', jsonb_array_length(v_generated));
end; $$;

create or replace function public.export_maturity_report(p_report_type text default 'executive_overview')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.capability_maturity_reports;
  v_assessments jsonb;
  v_roadmaps jsonb;
  v_summary jsonb;
begin
  perform public._irp_require_permission('maturity.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  v_summary := public._cma_executive_summary_block(v_org_id);

  select coalesce(jsonb_agg(row_to_json(sub) order by sub.assessed_at desc), '[]'::jsonb) into v_assessments
  from (
    select distinct on (a.domain) a.*
    from public.capability_maturity_assessments a
    where a.organization_id = v_org_id
    order by a.domain, a.assessed_at desc
  ) sub;

  select coalesce(jsonb_agg(row_to_json(r) order by r.domain), '[]'::jsonb) into v_roadmaps
  from public.capability_maturity_roadmaps r
  where r.organization_id = v_org_id;

  insert into public.capability_maturity_reports (organization_id, report_type, metadata)
  values (
    v_org_id, coalesce(p_report_type, 'executive_overview'),
    jsonb_build_object(
      'exported_by', v_user_id,
      'summary', v_summary,
      'assessment_count', jsonb_array_length(coalesce(v_assessments, '[]'::jsonb)),
      'roadmap_count', jsonb_array_length(coalesce(v_roadmaps, '[]'::jsonb))
    )
  )
  returning * into v_row;

  perform public._cma_log(
    v_org_id, 'cma_report_exported', 'maturity_report', v_row.id,
    jsonb_build_object('report_type', v_row.report_type, 'exported_by', v_user_id)
  );

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', v_row.exported_at,
    'report_type', v_row.report_type,
    'report_id', v_row.id,
    'assessments', coalesce(v_assessments, '[]'::jsonb),
    'roadmaps', coalesce(v_roadmaps, '[]'::jsonb),
    'summary', v_summary,
    'metadata', v_row.metadata
  );
end; $$;

create or replace function public.get_executive_maturity_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('maturity.view');
  v_org_id := public._mta_require_organization();
  perform public._cma_seed_assessments(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Capability maturity — humans assess; Aipify surfaces gaps and learning paths.',
    'summary', public._cma_executive_summary_block(v_org_id),
    'maturity_labels', jsonb_build_object(
      '1', 'initial', '2', 'developing', '3', 'established', '4', 'advanced', '5', 'optimized'
    ),
    'integration_notes', jsonb_build_object(
      'learning_training', 'Roadmaps reference Learning & Training paths (A.36)',
      'value_realization', 'Maturity aligns with Value Realization metrics (A.48)',
      'strategic_alignment', 'Strategic execution domain links to Strategic Alignment (A.55)',
      'organizational_memory', 'Assessments may capture org memory — metadata only (A.34)'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_capability_maturity_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('maturity.view');
  v_org_id := public._mta_require_organization();
  perform public._cma_seed_assessments(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify surfaces maturity gaps. Humans assess and decide improvement priorities.',
    'principles', jsonb_build_array(
      'Domain-based capability assessment',
      'Five-level maturity scale',
      'Roadmaps with learning requirements',
      'Executive maturity summaries',
      'Metadata only — no PII'
    ),
    'summary', public._cma_executive_summary_block(v_org_id),
    'maturity_labels', jsonb_build_object(
      '1', 'initial', '2', 'developing', '3', 'established', '4', 'advanced', '5', 'optimized'
    ),
    'assessments', coalesce((
      select jsonb_agg(row_to_json(sub) order by sub.domain)
      from (
        select distinct on (a.domain) a.*
        from public.capability_maturity_assessments a
        where a.organization_id = v_org_id
        order by a.domain, a.assessed_at desc
      ) sub
    ), '[]'::jsonb),
    'roadmaps', coalesce((
      select jsonb_agg(row_to_json(r) order by r.domain)
      from public.capability_maturity_roadmaps r where r.organization_id = v_org_id
    ), '[]'::jsonb),
    'reports', coalesce((
      select jsonb_agg(row_to_json(rep) order by rep.exported_at desc)
      from (
        select * from public.capability_maturity_reports
        where organization_id = v_org_id
        order by exported_at desc limit 10
      ) rep
    ), '[]'::jsonb),
    'executive_summary', public._cma_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'learning_training', 'Learning paths inform roadmap requirements — A.36',
      'value_realization', 'Value metrics contextualize maturity progress — A.48',
      'strategic_alignment', 'Strategic execution domain connects to objectives — A.55',
      'organizational_health', 'Maturity informs organizational health readiness — A.56',
      'organizational_memory', 'Assessment learnings via org memory hooks — A.34'
    ),
    'integration_summaries', jsonb_build_object(
      'learning_training', public._cma_learning_training_summary(v_org_id),
      'value_realization', public._cma_value_realization_summary(v_org_id),
      'strategic_alignment', public._cma_strategic_alignment_summary(v_org_id),
      'organizational_health', public._cma_organizational_health_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_capability_maturity_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._cma_seed_assessments(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Capability maturity — assess domains, generate roadmaps, track progress.',
    'assessed_domains', coalesce((
      select count(distinct domain) from public.capability_maturity_assessments
      where organization_id = v_org_id
    ), 0),
    'average_maturity_level', coalesce((
      select round(avg(maturity_level)::numeric, 1)
      from (
        select distinct on (domain) maturity_level
        from public.capability_maturity_assessments
        where organization_id = v_org_id
        order by domain, assessed_at desc
      ) latest
    ), 0),
    'active_roadmaps', coalesce((
      select count(*) from public.capability_maturity_roadmaps
      where organization_id = v_org_id and status in ('draft', 'active')
    ), 0)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Audit allowlist extension
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
    'cma_assessment_created', 'cma_assessment_updated', 'cma_roadmap_generated', 'cma_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'capability-maturity-engine', 'Capability Maturity Engine', 'Domain-based capability maturity assessments, improvement roadmaps, and executive maturity reporting.', 'authenticated', 87
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'capability-maturity-engine' and tenant_id is null);

grant execute on function public.create_maturity_assessment(text, int, text, jsonb, boolean) to authenticated;
grant execute on function public.update_maturity_assessment(uuid, int, text, jsonb, boolean) to authenticated;
grant execute on function public.generate_maturity_roadmap(text, text) to authenticated;
grant execute on function public.export_maturity_report(text) to authenticated;
grant execute on function public.get_executive_maturity_summary() to authenticated;
grant execute on function public.get_capability_maturity_engine_dashboard() to authenticated;
grant execute on function public.get_capability_maturity_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._cma_seed_assessments(v_org_id);
  end loop;
end $$;
