-- Phase A.53 — Stakeholder Communication Engine
-- Extends Customer Success (A.26), Executive Insights (A.35), Change Management (A.47), Incident Response (A.51).

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
    'stakeholder_communication_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. stakeholder_communication_campaigns
-- ---------------------------------------------------------------------------
create table if not exists public.stakeholder_communication_campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  campaign_name text not null,
  stakeholder_type text not null check (
    stakeholder_type in ('employee', 'manager', 'executive', 'customer', 'partner', 'supplier')
  ),
  communication_type text not null check (
    communication_type in (
      'announcement', 'operational_update', 'incident_notification',
      'onboarding_message', 'executive_communication', 'policy_update'
    )
  ),
  status text not null default 'draft' check (
    status in ('draft', 'scheduled', 'active', 'completed', 'cancelled')
  ),
  owner_user_id uuid references public.users (id) on delete set null,
  scheduled_at timestamptz,
  delivery_channels jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stakeholder_communication_campaigns_org_idx
  on public.stakeholder_communication_campaigns (organization_id, status, scheduled_at desc);

alter table public.stakeholder_communication_campaigns enable row level security;
revoke all on public.stakeholder_communication_campaigns from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. stakeholder_communication_deliveries
-- ---------------------------------------------------------------------------
create table if not exists public.stakeholder_communication_deliveries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  campaign_id uuid not null references public.stakeholder_communication_campaigns (id) on delete cascade,
  channel text not null check (
    channel in ('email', 'desktop_notification', 'in_platform', 'knowledge_center')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'delivered', 'failed', 'skipped')
  ),
  delivered_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists stakeholder_communication_deliveries_campaign_idx
  on public.stakeholder_communication_deliveries (campaign_id, channel, delivered_at desc);

alter table public.stakeholder_communication_deliveries enable row level security;
revoke all on public.stakeholder_communication_deliveries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. stakeholder_communication_engagement
-- ---------------------------------------------------------------------------
create table if not exists public.stakeholder_communication_engagement (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  campaign_id uuid not null references public.stakeholder_communication_campaigns (id) on delete cascade,
  engagement_metadata jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists stakeholder_communication_engagement_campaign_idx
  on public.stakeholder_communication_engagement (campaign_id, recorded_at desc);

alter table public.stakeholder_communication_engagement enable row level security;
revoke all on public.stakeholder_communication_engagement from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. stakeholder_communication_outcomes
-- ---------------------------------------------------------------------------
create table if not exists public.stakeholder_communication_outcomes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  campaign_id uuid not null references public.stakeholder_communication_campaigns (id) on delete cascade,
  outcome_summary text not null,
  org_memory_hook_metadata jsonb not null default '{}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists stakeholder_communication_outcomes_campaign_idx
  on public.stakeholder_communication_outcomes (campaign_id, created_at desc);

alter table public.stakeholder_communication_outcomes enable row level security;
revoke all on public.stakeholder_communication_outcomes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions (communications.* — distinct from notifications.*)
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'stakeholder_communication', v.description
from (values
  ('communications.view', 'View Communications', 'View stakeholder communication campaigns and delivery status'),
  ('communications.manage', 'Manage Communications', 'Create and update stakeholder communication campaigns'),
  ('communications.publish', 'Publish Communications', 'Schedule and publish stakeholder communications'),
  ('communications.export', 'Export Communications', 'Export communication campaign metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'communications.view'), ('owner', 'communications.manage'), ('owner', 'communications.publish'), ('owner', 'communications.export'),
  ('administrator', 'communications.view'), ('administrator', 'communications.manage'), ('administrator', 'communications.publish'), ('administrator', 'communications.export'),
  ('manager', 'communications.view'), ('manager', 'communications.manage'), ('manager', 'communications.publish'), ('manager', 'communications.export'),
  ('support_agent', 'communications.view'), ('support_agent', 'communications.manage'),
  ('viewer', 'communications.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_sce_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._sce_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'stakeholder_communication_campaign',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._sce_customer_success_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'customer_success_health_scores' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'onboarding_campaigns', coalesce((
      select count(*) from public.stakeholder_communication_campaigns
      where organization_id = p_organization_id
        and communication_type = 'onboarding_message'
        and status in ('active', 'completed')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._sce_change_management_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'change_communication_plans' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'change_plans_released', coalesce((
      select count(*) from public.change_communication_plans
      where organization_id = p_organization_id and status = 'released'
    ), 0),
    'policy_update_campaigns', coalesce((
      select count(*) from public.stakeholder_communication_campaigns
      where organization_id = p_organization_id
        and communication_type = 'policy_update'
        and status in ('active', 'completed')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._sce_incident_response_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'incident_records' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'open_incidents', coalesce((
      select count(*) from public.incident_records
      where organization_id = p_organization_id and status in ('identified', 'investigating', 'mitigated')
    ), 0),
    'incident_notification_campaigns', coalesce((
      select count(*) from public.stakeholder_communication_campaigns
      where organization_id = p_organization_id
        and communication_type = 'incident_notification'
        and status in ('active', 'completed')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._sce_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'active_campaigns', coalesce((
      select count(*) from public.stakeholder_communication_campaigns
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'scheduled_campaigns', coalesce((
      select count(*) from public.stakeholder_communication_campaigns
      where organization_id = p_organization_id and status = 'scheduled'
    ), 0),
    'executive_communications_30d', coalesce((
      select count(*) from public.stakeholder_communication_campaigns
      where organization_id = p_organization_id
        and communication_type = 'executive_communication'
        and created_at >= now() - interval '30 days'
    ), 0),
    'deliveries_30d', coalesce((
      select count(*) from public.stakeholder_communication_deliveries
      where organization_id = p_organization_id
        and status = 'delivered'
        and delivered_at >= now() - interval '30 days'
    ), 0)
  );
end; $$;

create or replace function public._sce_capture_memory_hook(
  p_organization_id uuid,
  p_campaign_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;

  return public.capture_organization_memory(
    'communication_outcome',
    left(coalesce(p_summary, 'Stakeholder communication outcome captured'), 500),
    jsonb_build_object(
      'source', 'stakeholder_communication_engine',
      'campaign_id', p_campaign_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._sce_seed_campaigns(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_campaign_id uuid;
begin
  if exists (select 1 from public.stakeholder_communication_campaigns where organization_id = p_organization_id limit 1) then
    return;
  end if;

  insert into public.stakeholder_communication_campaigns (
    organization_id, campaign_name, stakeholder_type, communication_type,
    status, delivery_channels
  )
  values (
    p_organization_id,
    'Quarterly operational update',
    'employee',
    'operational_update',
    'draft',
    jsonb_build_array('in_platform', 'email')
  )
  returning id into v_campaign_id;

  insert into public.stakeholder_communication_deliveries (
    organization_id, campaign_id, channel, status, metadata
  )
  values
    (p_organization_id, v_campaign_id, 'in_platform', 'pending', jsonb_build_object('source', 'seed')),
    (p_organization_id, v_campaign_id, 'email', 'pending', jsonb_build_object('source', 'seed'));
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_communication_campaign(
  p_campaign_name text,
  p_stakeholder_type text,
  p_communication_type text,
  p_delivery_channels jsonb default '[]'::jsonb,
  p_owner_user_id uuid default null,
  p_scheduled_at timestamptz default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.stakeholder_communication_campaigns; v_user_id uuid;
begin
  perform public._irp_require_permission('communications.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if coalesce(trim(p_campaign_name), '') = '' then raise exception 'Campaign name required'; end if;

  insert into public.stakeholder_communication_campaigns (
    organization_id, campaign_name, stakeholder_type, communication_type,
    status, owner_user_id, scheduled_at, delivery_channels
  )
  values (
    v_org_id, left(trim(p_campaign_name), 200), p_stakeholder_type, p_communication_type,
    case when p_scheduled_at is not null then 'scheduled' else 'draft' end,
    coalesce(p_owner_user_id, v_user_id), p_scheduled_at,
    coalesce(p_delivery_channels, '[]'::jsonb)
  )
  returning * into v_row;

  perform public._sce_log(
    v_org_id, 'sce_campaign_created', 'stakeholder_communication_campaign', v_row.id,
    jsonb_build_object('campaign_name', v_row.campaign_name, 'communication_type', v_row.communication_type)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_campaign_status(
  p_campaign_id uuid,
  p_status text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.stakeholder_communication_campaigns; v_prev text;
begin
  perform public._irp_require_permission('communications.manage');
  v_org_id := public._mta_require_organization();

  select status into v_prev from public.stakeholder_communication_campaigns
  where id = p_campaign_id and organization_id = v_org_id;

  update public.stakeholder_communication_campaigns
  set status = p_status, updated_at = now()
  where id = p_campaign_id and organization_id = v_org_id
    and status not in ('completed', 'cancelled')
  returning * into v_row;

  if v_row.id is null then raise exception 'Campaign not found or not updatable'; end if;

  perform public._sce_log(
    v_org_id, 'sce_campaign_status_updated', 'stakeholder_communication_campaign', v_row.id,
    jsonb_build_object('previous', v_prev, 'status', p_status)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.schedule_campaign(
  p_campaign_id uuid,
  p_scheduled_at timestamptz
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.stakeholder_communication_campaigns;
begin
  perform public._irp_require_permission('communications.publish');
  v_org_id := public._mta_require_organization();

  if p_scheduled_at is null then raise exception 'Scheduled time required'; end if;

  update public.stakeholder_communication_campaigns
  set status = 'scheduled', scheduled_at = p_scheduled_at, updated_at = now()
  where id = p_campaign_id and organization_id = v_org_id
    and status in ('draft', 'scheduled')
  returning * into v_row;

  if v_row.id is null then raise exception 'Campaign not found or not schedulable'; end if;

  perform public._sce_log(
    v_org_id, 'sce_campaign_scheduled', 'stakeholder_communication_campaign', v_row.id,
    jsonb_build_object('scheduled_at', p_scheduled_at)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.publish_campaign(p_campaign_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.stakeholder_communication_campaigns;
  v_user_id uuid;
  v_channel text;
  v_deliveries jsonb := '[]'::jsonb;
begin
  perform public._irp_require_permission('communications.publish');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.stakeholder_communication_campaigns
  set status = 'active', updated_at = now()
  where id = p_campaign_id and organization_id = v_org_id
    and status in ('draft', 'scheduled')
  returning * into v_row;

  if v_row.id is null then raise exception 'Campaign not found or not publishable'; end if;

  for v_channel in
    select jsonb_array_elements_text(coalesce(v_row.delivery_channels, '[]'::jsonb))
  loop
    insert into public.stakeholder_communication_deliveries (
      organization_id, campaign_id, channel, status, delivered_at, metadata
    )
    values (
      v_org_id, v_row.id, v_channel, 'delivered', now(),
      jsonb_build_object('published_by', v_user_id, 'auto_delivery', true)
    );
    v_deliveries := v_deliveries || jsonb_build_array(v_channel);
  end loop;

  perform public._sce_log(
    v_org_id, 'sce_campaign_published', 'stakeholder_communication_campaign', v_row.id,
    jsonb_build_object('channels', v_deliveries)
  );

  return jsonb_build_object('campaign', row_to_json(v_row)::jsonb, 'channels_delivered', v_deliveries);
end; $$;

create or replace function public.cancel_campaign(p_campaign_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.stakeholder_communication_campaigns;
begin
  perform public._irp_require_permission('communications.manage');
  v_org_id := public._mta_require_organization();

  update public.stakeholder_communication_campaigns
  set status = 'cancelled', updated_at = now()
  where id = p_campaign_id and organization_id = v_org_id
    and status in ('draft', 'scheduled')
  returning * into v_row;

  if v_row.id is null then raise exception 'Campaign not found or not cancellable'; end if;

  perform public._sce_log(
    v_org_id, 'sce_campaign_cancelled', 'stakeholder_communication_campaign', v_row.id,
    jsonb_build_object('campaign_name', v_row.campaign_name)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_campaign_delivery(
  p_campaign_id uuid,
  p_channel text,
  p_status text default 'delivered',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.stakeholder_communication_deliveries; v_user_id uuid;
begin
  perform public._irp_require_permission('communications.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if not exists (
    select 1 from public.stakeholder_communication_campaigns
    where id = p_campaign_id and organization_id = v_org_id
  ) then
    raise exception 'Campaign not found';
  end if;

  insert into public.stakeholder_communication_deliveries (
    organization_id, campaign_id, channel, status, delivered_at, metadata
  )
  values (
    v_org_id, p_campaign_id, p_channel, coalesce(p_status, 'delivered'),
    case when coalesce(p_status, 'delivered') = 'delivered' then now() else null end,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('recorded_by', v_user_id)
  )
  returning * into v_row;

  perform public._sce_log(
    v_org_id, 'sce_campaign_delivery_recorded', 'stakeholder_communication_delivery', v_row.id,
    jsonb_build_object('campaign_id', p_campaign_id, 'channel', p_channel, 'status', p_status)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_communication_outcome(
  p_campaign_id uuid,
  p_outcome_summary text,
  p_engagement_metadata jsonb default '{}'::jsonb,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.stakeholder_communication_outcomes;
  v_eng public.stakeholder_communication_engagement;
  v_user_id uuid;
  v_memory jsonb;
begin
  perform public._irp_require_permission('communications.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if not exists (
    select 1 from public.stakeholder_communication_campaigns
    where id = p_campaign_id and organization_id = v_org_id
      and status in ('active', 'completed')
  ) then
    raise exception 'Campaign not found or not ready for outcome recording';
  end if;

  v_memory := '{}'::jsonb;
  if coalesce(p_capture_memory, false) then
    v_memory := public._sce_capture_memory_hook(v_org_id, p_campaign_id, p_outcome_summary, p_engagement_metadata);
  end if;

  insert into public.stakeholder_communication_outcomes (
    organization_id, campaign_id, outcome_summary, org_memory_hook_metadata, recorded_by
  )
  values (
    v_org_id, p_campaign_id, left(coalesce(trim(p_outcome_summary), 'Outcome recorded'), 500),
    v_memory, v_user_id
  )
  returning * into v_row;

  if p_engagement_metadata is not null and p_engagement_metadata <> '{}'::jsonb then
    insert into public.stakeholder_communication_engagement (
      organization_id, campaign_id, engagement_metadata
    )
    values (v_org_id, p_campaign_id, p_engagement_metadata)
    returning * into v_eng;
  end if;

  update public.stakeholder_communication_campaigns
  set status = 'completed', updated_at = now()
  where id = p_campaign_id and organization_id = v_org_id and status = 'active';

  perform public._sce_log(
    v_org_id, 'sce_communication_outcome_recorded', 'stakeholder_communication_outcome', v_row.id,
    jsonb_build_object('campaign_id', p_campaign_id, 'memory_hook', v_memory)
  );

  return jsonb_build_object('outcome', row_to_json(v_row)::jsonb, 'memory_hook', v_memory);
end; $$;

create or replace function public.export_communication_campaigns(
  p_status_filter text default null,
  p_communication_type text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_campaigns jsonb;
  v_deliveries jsonb;
  v_outcomes jsonb;
begin
  perform public._irp_require_permission('communications.export');
  v_org_id := public._mta_require_organization();

  select coalesce(jsonb_agg(row_to_json(c) order by c.created_at desc), '[]'::jsonb)
  into v_campaigns
  from public.stakeholder_communication_campaigns c
  where c.organization_id = v_org_id
    and (p_status_filter is null or c.status = p_status_filter)
    and (p_communication_type is null or c.communication_type = p_communication_type)
  limit 100;

  select coalesce(jsonb_agg(row_to_json(d) order by d.delivered_at desc nulls last), '[]'::jsonb)
  into v_deliveries
  from public.stakeholder_communication_deliveries d
  where d.organization_id = v_org_id
  limit 200;

  select coalesce(jsonb_agg(row_to_json(o) order by o.created_at desc), '[]'::jsonb)
  into v_outcomes
  from public.stakeholder_communication_outcomes o
  where o.organization_id = v_org_id
  limit 50;

  perform public._sce_log(
    v_org_id, 'sce_campaigns_exported', 'stakeholder_communication_campaign', null,
    jsonb_build_object(
      'campaign_count', jsonb_array_length(v_campaigns),
      'status_filter', p_status_filter,
      'communication_type', p_communication_type
    )
  );

  return jsonb_build_object(
    'campaigns', v_campaigns,
    'deliveries', v_deliveries,
    'outcomes', v_outcomes,
    'exported_at', now(),
    'privacy_note', 'Metadata only — no PII'
  );
end; $$;

create or replace function public.get_executive_communication_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('communications.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Transparent stakeholder communications — humans approve, Aipify coordinates delivery.',
    'summary', public._sce_executive_summary_block(v_org_id),
    'executive_communications_pending', coalesce((
      select count(*) from public.stakeholder_communication_campaigns
      where organization_id = v_org_id
        and communication_type = 'executive_communication'
        and status in ('draft', 'scheduled')
    ), 0),
    'integration_notes', jsonb_build_object(
      'executive_insights', 'Feeds executive visibility via A.35 reporting scaffolds',
      'customer_success', 'Onboarding messages align with A.26 success workflows',
      'change_management', 'Policy updates complement A.47 change communications',
      'incident_response', 'Incident notifications link to A.51 response coordination'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_stakeholder_communication_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('communications.view');
  v_org_id := public._mta_require_organization();
  perform public._sce_seed_campaigns(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Coordinated stakeholder communications — humans approve, Aipify structures delivery and tracks engagement.',
    'principles', jsonb_build_array(
      'Audience-aware messaging',
      'Multi-channel delivery',
      'Transparent scheduling',
      'Engagement accountability',
      'Metadata-only outcomes'
    ),
    'summary', jsonb_build_object(
      'total_campaigns', coalesce((
        select count(*) from public.stakeholder_communication_campaigns where organization_id = v_org_id
      ), 0),
      'draft_campaigns', coalesce((
        select count(*) from public.stakeholder_communication_campaigns
        where organization_id = v_org_id and status = 'draft'
      ), 0),
      'active_campaigns', coalesce((
        select count(*) from public.stakeholder_communication_campaigns
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'scheduled_campaigns', coalesce((
        select count(*) from public.stakeholder_communication_campaigns
        where organization_id = v_org_id and status = 'scheduled'
      ), 0),
      'completed_30d', coalesce((
        select count(*) from public.stakeholder_communication_campaigns
        where organization_id = v_org_id and status = 'completed'
          and updated_at >= now() - interval '30 days'
      ), 0),
      'deliveries_30d', coalesce((
        select count(*) from public.stakeholder_communication_deliveries
        where organization_id = v_org_id and status = 'delivered'
          and delivered_at >= now() - interval '30 days'
      ), 0)
    ),
    'campaigns', coalesce((
      select jsonb_agg(row_to_json(c) order by c.created_at desc)
      from public.stakeholder_communication_campaigns c where c.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'deliveries', coalesce((
      select jsonb_agg(row_to_json(d) order by d.delivered_at desc nulls last)
      from public.stakeholder_communication_deliveries d where d.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'engagement', coalesce((
      select jsonb_agg(row_to_json(e) order by e.recorded_at desc)
      from public.stakeholder_communication_engagement e where e.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'outcomes', coalesce((
      select jsonb_agg(row_to_json(o) order by o.created_at desc)
      from public.stakeholder_communication_outcomes o where o.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'executive_summary', public._sce_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'customer_success', 'Extends Customer Success (A.26) with onboarding and success communications',
      'executive_insights', 'Executive summary via get_executive_communication_summary() — A.35',
      'change_management', 'Policy updates complement Change Management (A.47) communication plans',
      'incident_response', 'Incident notifications link to Incident Response (A.51) coordination',
      'organizational_memory', 'Outcomes may capture org memory — metadata only (A.34)'
    ),
    'integration_summaries', jsonb_build_object(
      'customer_success', public._sce_customer_success_summary(v_org_id),
      'change_management', public._sce_change_management_summary(v_org_id),
      'incident_response', public._sce_incident_response_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_stakeholder_communication_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._sce_seed_campaigns(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Stakeholder communications with multi-channel delivery and engagement tracking.',
    'active_campaigns', coalesce((
      select count(*) from public.stakeholder_communication_campaigns
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'scheduled_campaigns', coalesce((
      select count(*) from public.stakeholder_communication_campaigns
      where organization_id = v_org_id and status = 'scheduled'
    ), 0),
    'draft_campaigns', coalesce((
      select count(*) from public.stakeholder_communication_campaigns
      where organization_id = v_org_id and status = 'draft'
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
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged',
    'onboarding_started', 'onboarding_step_advanced', 'checklist_completed', 'onboarding_completed',
    'subscription_created', 'trial_started', 'plan_upgraded', 'plan_downgraded',
    'subscription_cancelled', 'subscription_reactivated',
    'self_support_response_sent', 'self_support_draft_generated', 'self_support_escalated',
    'self_support_conversation_closed', 'self_support_feedback_submitted',
    'self_support_knowledge_recommended', 'self_support_conversation_created',
    'quality_alert_created', 'quality_check_resolved', 'quality_finding_ignored',
    'quality_recommendation_accepted', 'quality_recommendation_rejected', 'quality_scan_executed',
    'notification_sent', 'notification_dismissed', 'notification_preferences_saved',
    'notification_digest_generated', 'critical_alert_sent', 'notification_delivery_failed',
    'deployment_scheduled', 'deployment_initiated', 'deployment_completed', 'deployment_failed',
    'deployment_rollback_executed', 'feature_flag_changed', 'rollout_adjusted',
    'health_check_recorded', 'incident_created', 'incident_updated', 'incident_resolved',
    'maintenance_scheduled', 'maintenance_started', 'maintenance_completed',
    'installation_started', 'installation_step_advanced', 'installation_discovery_executed',
    'installation_permissions_approved', 'installation_recommendations_accepted',
    'integrations_connected', 'installation_completed',
    'internal_validation_recorded', 'internal_feedback_submitted',
    'launch_checklist_updated', 'launch_review_submitted',
    'success_health_assessed', 'success_intervention_created',
    'status_event_recorded', 'incident_published', 'incident_updated', 'incident_resolved',
    'maintenance_announced', 'status_configuration_changed', 'status_override_applied',
    'enterprise_setting_changed', 'delegated_admin_assigned', 'approval_chain_updated',
    'approval_override_applied', 'readiness_assessment_recorded', 'enterprise_export_generated',
    'memory_record_created', 'memory_record_updated', 'memory_record_archived',
    'memory_record_superseded', 'memory_record_restored', 'memory_visibility_changed',
    'memory_captured', 'decision_register_created', 'memory_review_scheduled',
    'memory_review_completed', 'memory_settings_changed',
    'training_assigned', 'training_progress_recorded', 'training_completed',
    'training_assessment_submitted', 'learning_path_updated', 'training_settings_changed',
    'license_created', 'seat_assigned', 'seat_revoked',
    'device_registered', 'device_revoked',
    'enrollment_token_created', 'enrollment_token_revoked',
    'deployment_invite_sent', 'domain_verification_started',
    'sso_config_updated', 'scim_settings_updated',
    'baseline_changed', 'impact_report_exported',
    'compliance_review_completed', 'compliance_report_exported', 'compliance_status_changed',
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
    'sce_campaign_created', 'sce_campaign_status_updated', 'sce_campaign_scheduled',
    'sce_campaign_published', 'sce_campaign_cancelled', 'sce_campaign_delivery_recorded',
    'sce_communication_outcome_recorded', 'sce_campaigns_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'stakeholder-communication-engine', 'Stakeholder Communication Engine', 'Coordinated stakeholder communications with multi-channel delivery, engagement tracking, and org memory outcomes.', 'authenticated', 83
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'stakeholder-communication-engine' and tenant_id is null);

grant execute on function public.create_communication_campaign(text, text, text, jsonb, uuid, timestamptz) to authenticated;
grant execute on function public.update_campaign_status(uuid, text) to authenticated;
grant execute on function public.schedule_campaign(uuid, timestamptz) to authenticated;
grant execute on function public.publish_campaign(uuid) to authenticated;
grant execute on function public.cancel_campaign(uuid) to authenticated;
grant execute on function public.record_campaign_delivery(uuid, text, text, jsonb) to authenticated;
grant execute on function public.record_communication_outcome(uuid, text, jsonb, boolean) to authenticated;
grant execute on function public.export_communication_campaigns(text, text) to authenticated;
grant execute on function public.get_executive_communication_summary() to authenticated;
grant execute on function public.get_stakeholder_communication_engine_dashboard() to authenticated;
grant execute on function public.get_stakeholder_communication_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._sce_seed_campaigns(v_org_id);
  end loop;
end $$;
