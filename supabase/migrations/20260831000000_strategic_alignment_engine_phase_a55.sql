-- Phase A.55 — Strategic Alignment Engine
-- Extends Executive Insights (A.35), Value Realization (A.48), Organizational Decision Support (A.54).
-- Distinct from legacy Strategy Engine at /app/strategy (lib/aipify/strategy/).

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
    'strategic_alignment_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. strategic_objectives
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_objectives (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  objective_name text not null,
  description text,
  owner_user_id uuid references public.users (id) on delete set null,
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'strategic')
  ),
  status text not null default 'planned' check (
    status in ('planned', 'active', 'completed', 'paused', 'cancelled')
  ),
  target_date date,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists strategic_objectives_org_idx
  on public.strategic_objectives (organization_id, status, priority, created_at desc);

alter table public.strategic_objectives enable row level security;
revoke all on public.strategic_objectives from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. strategic_objective_links
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_objective_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  objective_id uuid not null references public.strategic_objectives (id) on delete cascade,
  link_type text not null check (
    link_type in (
      'workflow', 'improvement_initiative', 'value_metric',
      'executive_priority', 'business_pack'
    )
  ),
  linked_entity_id uuid not null,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (objective_id, link_type, linked_entity_id)
);

create index if not exists strategic_objective_links_objective_idx
  on public.strategic_objective_links (objective_id, link_type, created_at desc);

alter table public.strategic_objective_links enable row level security;
revoke all on public.strategic_objective_links from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. strategic_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  objective_id uuid not null references public.strategic_objectives (id) on delete cascade,
  review_date date not null default current_date,
  findings text not null,
  participants_metadata jsonb not null default '{}'::jsonb,
  org_memory_hook_metadata jsonb not null default '{}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists strategic_reviews_objective_idx
  on public.strategic_reviews (objective_id, review_date desc);

alter table public.strategic_reviews enable row level security;
revoke all on public.strategic_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. strategic_alignment_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_alignment_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  misaligned_initiatives jsonb not null default '[]'::jsonb,
  progress_metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists strategic_alignment_snapshots_org_idx
  on public.strategic_alignment_snapshots (organization_id, created_at desc);

alter table public.strategic_alignment_snapshots enable row level security;
revoke all on public.strategic_alignment_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'strategic_alignment', v.description
from (values
  ('strategy.view', 'View Strategy', 'View strategic objectives, alignment reviews, and snapshots'),
  ('strategy.manage', 'Manage Strategy', 'Create and update strategic objectives and entity links'),
  ('strategy.review', 'Review Strategy', 'Record strategic reviews and detect misaligned initiatives'),
  ('strategy.export', 'Export Strategy', 'Export strategic alignment reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'strategy.view'), ('owner', 'strategy.manage'), ('owner', 'strategy.review'), ('owner', 'strategy.export'),
  ('administrator', 'strategy.view'), ('administrator', 'strategy.manage'), ('administrator', 'strategy.review'), ('administrator', 'strategy.export'),
  ('manager', 'strategy.view'), ('manager', 'strategy.manage'), ('manager', 'strategy.review'), ('manager', 'strategy.export'),
  ('support_agent', 'strategy.view'),
  ('viewer', 'strategy.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_sae_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._sae_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'strategic_objective',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._sae_executive_insights_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'executive_insight_reports' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'recent_reports', coalesce((
      select count(*) from public.executive_insight_reports
      where organization_id = p_organization_id and generated_at >= now() - interval '30 days'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._sae_value_realization_summary(p_organization_id uuid)
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

create or replace function public._sae_organizational_decision_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organizational_decision_support_items' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'total_decisions', coalesce((
      select count(*) from public.organizational_decision_support_items where organization_id = p_organization_id
    ), 0),
    'strategic_planning', coalesce((
      select count(*) from public.organizational_decision_support_items
      where organization_id = p_organization_id and decision_category = 'strategic_planning'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._sae_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'total_objectives', coalesce((
      select count(*) from public.strategic_objectives where organization_id = p_organization_id
    ), 0),
    'active_objectives', coalesce((
      select count(*) from public.strategic_objectives
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'strategic_priority', coalesce((
      select count(*) from public.strategic_objectives
      where organization_id = p_organization_id and priority = 'strategic' and status in ('planned', 'active')
    ), 0),
    'linked_entities', coalesce((
      select count(*) from public.strategic_objective_links where organization_id = p_organization_id
    ), 0),
    'reviews_recorded', coalesce((
      select count(*) from public.strategic_reviews where organization_id = p_organization_id
    ), 0),
    'latest_misaligned_count', coalesce((
      select jsonb_array_length(s.misaligned_initiatives)
      from public.strategic_alignment_snapshots s
      where s.organization_id = p_organization_id
      order by s.created_at desc limit 1
    ), 0)
  );
end; $$;

create or replace function public._sae_capture_memory_hook(
  p_organization_id uuid,
  p_objective_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;

  return public.capture_organization_memory(
    'strategic_review',
    left(coalesce(p_summary, 'Strategic review captured'), 500),
    jsonb_build_object(
      'source', 'strategic_alignment_engine',
      'objective_id', p_objective_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._sae_seed_objectives(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.strategic_objectives where organization_id = p_organization_id limit 1) then
    return;
  end if;

  insert into public.strategic_objectives (
    organization_id, objective_name, description, priority, status, target_date
  )
  values (
    p_organization_id,
    'Improve operational efficiency through workflow alignment',
    'Ensure active workflows and improvement initiatives align with executive priorities and value metrics.',
    'strategic',
    'active',
    (current_date + interval '180 days')::date
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_strategic_objective(
  p_objective_name text,
  p_description text default null,
  p_owner_user_id uuid default null,
  p_priority text default 'medium',
  p_status text default 'planned',
  p_target_date date default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.strategic_objectives; v_user_id uuid;
begin
  perform public._irp_require_permission('strategy.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if coalesce(trim(p_objective_name), '') = '' then raise exception 'Objective name required'; end if;

  insert into public.strategic_objectives (
    organization_id, objective_name, description, owner_user_id,
    priority, status, target_date, created_by
  )
  values (
    v_org_id, left(trim(p_objective_name), 200), left(coalesce(p_description, ''), 2000),
    p_owner_user_id, coalesce(p_priority, 'medium'), coalesce(p_status, 'planned'),
    p_target_date, v_user_id
  )
  returning * into v_row;

  perform public._sae_log(
    v_org_id, 'sae_objective_created', 'strategic_objective', v_row.id,
    jsonb_build_object('objective_name', v_row.objective_name, 'priority', v_row.priority)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_strategic_objective(
  p_objective_id uuid,
  p_objective_name text default null,
  p_description text default null,
  p_owner_user_id uuid default null,
  p_priority text default null,
  p_status text default null,
  p_target_date date default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.strategic_objectives; v_user_id uuid;
begin
  perform public._irp_require_permission('strategy.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.strategic_objectives
  set
    objective_name = coalesce(left(trim(p_objective_name), 200), objective_name),
    description = coalesce(left(p_description, 2000), description),
    owner_user_id = coalesce(p_owner_user_id, owner_user_id),
    priority = coalesce(p_priority, priority),
    status = coalesce(p_status, status),
    target_date = coalesce(p_target_date, target_date),
    updated_at = now()
  where id = p_objective_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Objective not found'; end if;

  perform public._sae_log(
    v_org_id, 'sae_objective_updated', 'strategic_objective', v_row.id,
    jsonb_build_object('status', v_row.status, 'updated_by', v_user_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.link_objective_entity(
  p_objective_id uuid,
  p_link_type text,
  p_linked_entity_id uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.strategic_objective_links; v_user_id uuid;
begin
  perform public._irp_require_permission('strategy.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if not exists (
    select 1 from public.strategic_objectives
    where id = p_objective_id and organization_id = v_org_id
  ) then
    raise exception 'Objective not found';
  end if;

  insert into public.strategic_objective_links (
    organization_id, objective_id, link_type, linked_entity_id, metadata, created_by
  )
  values (
    v_org_id, p_objective_id, coalesce(p_link_type, 'workflow'),
    p_linked_entity_id, coalesce(p_metadata, '{}'::jsonb), v_user_id
  )
  on conflict (objective_id, link_type, linked_entity_id) do update
  set metadata = excluded.metadata
  returning * into v_row;

  perform public._sae_log(
    v_org_id, 'sae_objective_entity_linked', 'strategic_objective_link', v_row.id,
    jsonb_build_object('objective_id', p_objective_id, 'link_type', v_row.link_type)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_strategic_review(
  p_objective_id uuid,
  p_findings text,
  p_review_date date default null,
  p_participants_metadata jsonb default '{}'::jsonb,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.strategic_reviews;
  v_user_id uuid;
  v_memory jsonb;
begin
  perform public._irp_require_permission('strategy.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if not exists (
    select 1 from public.strategic_objectives
    where id = p_objective_id and organization_id = v_org_id
  ) then
    raise exception 'Objective not found';
  end if;

  v_memory := '{}'::jsonb;
  if coalesce(p_capture_memory, false) then
    v_memory := public._sae_capture_memory_hook(
      v_org_id, p_objective_id, p_findings, p_participants_metadata
    );
  end if;

  insert into public.strategic_reviews (
    organization_id, objective_id, review_date, findings,
    participants_metadata, org_memory_hook_metadata, recorded_by
  )
  values (
    v_org_id, p_objective_id, coalesce(p_review_date, current_date),
    left(coalesce(trim(p_findings), 'Review recorded'), 2000),
    coalesce(p_participants_metadata, '{}'::jsonb), v_memory, v_user_id
  )
  returning * into v_row;

  perform public._sae_log(
    v_org_id, 'sae_strategic_review_recorded', 'strategic_review', v_row.id,
    jsonb_build_object('objective_id', p_objective_id, 'memory_hook', v_memory)
  );

  return jsonb_build_object('review', row_to_json(v_row)::jsonb, 'memory_hook', v_memory);
end; $$;

create or replace function public.detect_misaligned_initiatives(p_objective_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_misaligned jsonb;
  v_row public.strategic_alignment_snapshots;
  v_active_without_links int;
begin
  perform public._irp_require_permission('strategy.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select coalesce(jsonb_agg(jsonb_build_object(
    'objective_id', o.id,
    'objective_name', o.objective_name,
    'priority', o.priority,
    'status', o.status,
    'link_count', coalesce((
      select count(*) from public.strategic_objective_links l where l.objective_id = o.id
    ), 0),
    'reason', case
      when coalesce((
        select count(*) from public.strategic_objective_links l where l.objective_id = o.id
      ), 0) = 0 then 'no_linked_entities'
      when o.target_date is not null and o.target_date < current_date and o.status = 'active'
        then 'past_target_date'
      else 'review_recommended'
    end
  )), '[]'::jsonb) into v_misaligned
  from public.strategic_objectives o
  where o.organization_id = v_org_id
    and o.status in ('planned', 'active')
    and (p_objective_id is null or o.id = p_objective_id)
    and (
      coalesce((select count(*) from public.strategic_objective_links l where l.objective_id = o.id), 0) = 0
      or (o.target_date is not null and o.target_date < current_date and o.status = 'active')
      or o.priority = 'strategic'
    );

  select count(*) into v_active_without_links
  from public.strategic_objectives o
  where o.organization_id = v_org_id
    and o.status = 'active'
    and not exists (select 1 from public.strategic_objective_links l where l.objective_id = o.id);

  insert into public.strategic_alignment_snapshots (
    organization_id, misaligned_initiatives, progress_metadata, created_by
  )
  values (
    v_org_id, coalesce(v_misaligned, '[]'::jsonb),
    jsonb_build_object(
      'detected_at', now(),
      'active_without_links', v_active_without_links,
      'scoped_objective_id', p_objective_id
    ),
    v_user_id
  )
  returning * into v_row;

  perform public._sae_log(
    v_org_id, 'sae_misalignment_detected', 'strategic_alignment_snapshot', v_row.id,
    jsonb_build_object('misaligned_count', jsonb_array_length(coalesce(v_misaligned, '[]'::jsonb)))
  );

  return jsonb_build_object(
    'snapshot', row_to_json(v_row)::jsonb,
    'misaligned_initiatives', coalesce(v_misaligned, '[]'::jsonb)
  );
end; $$;

create or replace function public.export_strategic_alignment_report(p_objective_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_objective jsonb;
  v_links jsonb;
  v_reviews jsonb;
  v_snapshots jsonb;
begin
  perform public._irp_require_permission('strategy.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if p_objective_id is not null then
    select row_to_json(o)::jsonb into v_objective
    from public.strategic_objectives o
    where o.id = p_objective_id and o.organization_id = v_org_id;

    if v_objective is null then raise exception 'Objective not found'; end if;

    select coalesce(jsonb_agg(row_to_json(l) order by l.created_at desc), '[]'::jsonb) into v_links
    from public.strategic_objective_links l
    where l.objective_id = p_objective_id and l.organization_id = v_org_id;

    select coalesce(jsonb_agg(row_to_json(r) order by r.review_date desc), '[]'::jsonb) into v_reviews
    from public.strategic_reviews r
    where r.objective_id = p_objective_id and r.organization_id = v_org_id;
  end if;

  select coalesce(jsonb_agg(row_to_json(sub) order by sub.created_at desc), '[]'::jsonb) into v_snapshots
  from (
    select s.* from public.strategic_alignment_snapshots s
    where s.organization_id = v_org_id
    order by s.created_at desc
    limit 10
  ) sub;

  perform public._sae_log(
    v_org_id, 'sae_alignment_report_exported', 'strategic_objective', p_objective_id,
    jsonb_build_object('exported_by', v_user_id, 'objective_id', p_objective_id)
  );

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'exported_by', v_user_id,
    'objective', v_objective,
    'links', coalesce(v_links, '[]'::jsonb),
    'reviews', coalesce(v_reviews, '[]'::jsonb),
    'snapshots', coalesce(v_snapshots, '[]'::jsonb),
    'summary', case
      when p_objective_id is null then public._sae_executive_summary_block(v_org_id)
      else null
    end,
    'objectives', case
      when p_objective_id is null then coalesce((
        select jsonb_agg(row_to_json(o) order by o.created_at desc)
        from public.strategic_objectives o where o.organization_id = v_org_id limit 50
      ), '[]'::jsonb)
      else null
    end
  );
end; $$;

create or replace function public.get_executive_strategic_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('strategy.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Strategic alignment — humans define objectives; Aipify surfaces gaps.',
    'summary', public._sae_executive_summary_block(v_org_id),
    'strategic_priority_active', coalesce((
      select count(*) from public.strategic_objectives
      where organization_id = v_org_id and priority = 'strategic' and status = 'active'
    ), 0),
    'integration_notes', jsonb_build_object(
      'executive_insights', 'Aligns with Executive Insights reporting (A.35)',
      'value_realization', 'Connects to Value Realization metrics (A.48)',
      'organizational_decisions', 'Links to Organizational Decision Support (A.54)',
      'legacy_strategy', 'Distinct from legacy Strategy Engine at /app/strategy'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_strategic_alignment_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('strategy.view');
  v_org_id := public._mta_require_organization();
  perform public._sae_seed_objectives(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify surfaces alignment gaps. Humans define and decide strategy.',
    'principles', jsonb_build_array(
      'Clear strategic objectives',
      'Entity linking for accountability',
      'Periodic alignment reviews',
      'Misalignment detection',
      'Metadata only — no PII'
    ),
    'summary', public._sae_executive_summary_block(v_org_id),
    'objectives', coalesce((
      select jsonb_agg(row_to_json(o) order by o.created_at desc)
      from public.strategic_objectives o where o.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'links', coalesce((
      select jsonb_agg(row_to_json(l) order by l.created_at desc)
      from public.strategic_objective_links l where l.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'reviews', coalesce((
      select jsonb_agg(row_to_json(r) order by r.review_date desc)
      from public.strategic_reviews r where r.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'snapshots', coalesce((
      select jsonb_agg(row_to_json(s) order by s.created_at desc)
      from public.strategic_alignment_snapshots s where s.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'executive_summary', public._sae_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'legacy_strategy', 'Distinct from legacy Strategy Engine at /app/strategy — nav id strategicAlignmentEngine',
      'executive_insights', 'Executive summary via get_executive_strategic_summary() — A.35',
      'value_realization', 'Value Realization context for linked metrics — A.48',
      'organizational_decisions', 'Organizational Decision Support for strategic planning — A.54',
      'organizational_memory', 'Reviews may capture org memory — metadata only (A.34)'
    ),
    'integration_summaries', jsonb_build_object(
      'executive_insights', public._sae_executive_insights_summary(v_org_id),
      'value_realization', public._sae_value_realization_summary(v_org_id),
      'organizational_decisions', public._sae_organizational_decision_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_strategic_alignment_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._sae_seed_objectives(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Strategic alignment — objectives linked to operational entities.',
    'active_objectives', coalesce((
      select count(*) from public.strategic_objectives
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'misaligned_count', coalesce((
      select jsonb_array_length(s.misaligned_initiatives)
      from public.strategic_alignment_snapshots s
      where s.organization_id = v_org_id
      order by s.created_at desc limit 1
    ), 0)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Audit allowlist extension
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
    'sae_strategic_review_recorded', 'sae_misalignment_detected', 'sae_alignment_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'strategic-alignment-engine', 'Strategic Alignment Engine', 'Strategic objectives, entity linking, alignment reviews, and misalignment detection with executive reporting.', 'authenticated', 86
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'strategic-alignment-engine' and tenant_id is null);

grant execute on function public.create_strategic_objective(text, text, uuid, text, text, date) to authenticated;
grant execute on function public.update_strategic_objective(uuid, text, text, uuid, text, text, date) to authenticated;
grant execute on function public.link_objective_entity(uuid, text, uuid, jsonb) to authenticated;
grant execute on function public.record_strategic_review(uuid, text, date, jsonb, boolean) to authenticated;
grant execute on function public.detect_misaligned_initiatives(uuid) to authenticated;
grant execute on function public.export_strategic_alignment_report(uuid) to authenticated;
grant execute on function public.get_executive_strategic_summary() to authenticated;
grant execute on function public.get_strategic_alignment_engine_dashboard() to authenticated;
grant execute on function public.get_strategic_alignment_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._sae_seed_objectives(v_org_id);
  end loop;
end $$;
