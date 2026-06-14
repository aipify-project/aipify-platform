-- Phase A.60 — Records & Retention Management Engine
-- Extends Security & Trust (A.18), Compliance (A.29), Organizational Memory (A.34), Document & Output (A.59).

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
    'records_retention_management_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. retention_policies
-- ---------------------------------------------------------------------------
-- Legacy trust retention used tenant_id/data_category; A.60 uses organization_id/record_category.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'retention_policies' and column_name = 'tenant_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'retention_policies' and column_name = 'organization_id'
  ) then
    alter table public.retention_policies rename to retention_policies_trust_legacy;
  end if;
end $$;

create table if not exists public.retention_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_name text not null,
  record_category text not null check (
    record_category in (
      'executive_report', 'support_report', 'incident_report', 'certificate',
      'governance_document', 'audit_log', 'knowledge_export', 'workflow_output'
    )
  ),
  retention_period_value int not null default 365 check (retention_period_value >= 0),
  retention_period_unit text not null default 'days' check (
    retention_period_unit in ('days', 'months', 'years', 'indefinite')
  ),
  archive_required boolean not null default true,
  disposal_method text not null default 'secure_delete' check (
    disposal_method in ('secure_delete', 'anonymize', 'transfer_to_archive', 'legal_hold')
  ),
  status text not null default 'draft' check (
    status in ('active', 'draft', 'retired')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists retention_policies_org_idx
  on public.retention_policies (organization_id, status, record_category, updated_at desc);

alter table public.retention_policies enable row level security;
revoke all on public.retention_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. archived_records
-- ---------------------------------------------------------------------------
create table if not exists public.archived_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_id uuid references public.retention_policies (id) on delete set null,
  source_entity_type text not null,
  source_entity_id uuid not null,
  archived_at timestamptz not null default now(),
  version int not null default 1 check (version >= 1),
  metadata jsonb not null default '{}'::jsonb,
  restored_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists archived_records_org_idx
  on public.archived_records (organization_id, source_entity_type, archived_at desc);

create index if not exists archived_records_source_idx
  on public.archived_records (organization_id, source_entity_id);

alter table public.archived_records enable row level security;
revoke all on public.archived_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. record_disposal_requests
-- ---------------------------------------------------------------------------
create table if not exists public.record_disposal_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  archived_record_id uuid not null references public.archived_records (id) on delete cascade,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'completed', 'rejected')
  ),
  approved_by uuid references public.users (id) on delete set null,
  disposed_at timestamptz,
  disposal_log jsonb not null default '{}'::jsonb,
  requested_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists record_disposal_requests_org_idx
  on public.record_disposal_requests (organization_id, status, created_at desc);

alter table public.record_disposal_requests enable row level security;
revoke all on public.record_disposal_requests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. retention_compliance_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.retention_compliance_snapshots (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  upcoming_expirations jsonb not null default '[]'::jsonb,
  compliance_indicators jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.retention_compliance_snapshots enable row level security;
revoke all on public.retention_compliance_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions — records.*
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'records_retention_management', v.description
from (values
  ('records.view', 'View Records', 'View retention policies, archived records, and compliance snapshots'),
  ('records.manage', 'Manage Records', 'Create, update, and retire retention policies'),
  ('records.archive', 'Archive Records', 'Archive and restore operational records with metadata only'),
  ('records.dispose', 'Dispose Records', 'Request, approve, and complete record disposal')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'records.view'), ('owner', 'records.manage'), ('owner', 'records.archive'), ('owner', 'records.dispose'),
  ('administrator', 'records.view'), ('administrator', 'records.manage'), ('administrator', 'records.archive'), ('administrator', 'records.dispose'),
  ('manager', 'records.view'), ('manager', 'records.manage'), ('manager', 'records.archive'),
  ('support_agent', 'records.view'), ('support_agent', 'records.archive'),
  ('viewer', 'records.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- Tenant module licensing (business+ engines)
insert into public.plan_modules (plan_key, module_key, enabled)
select v.plan, v.module, true
from (values
  ('business', 'records_retention_management_engine'),
  ('enterprise', 'records_retention_management_engine'),
  ('internal', 'records_retention_management_engine')
) as v(plan, module)
where not exists (
  select 1 from public.plan_modules pm where pm.plan_key = v.plan and pm.module_key = v.module
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_rrme_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._rrme_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'archived_record',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._rrme_sync_tenant_module(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'tenant_modules' and schemaname = 'public') then
    return;
  end if;

  insert into public.tenant_modules (tenant_id, module_key, enabled, licensed, status)
  values (p_organization_id, 'records_retention_management_engine', true, true, 'enabled')
  on conflict (tenant_id, module_key) do update set
    licensed = true,
    enabled = true,
    status = 'enabled',
    updated_at = now();
end; $$;

create or replace function public._rrme_expires_at(
  p_archived_at timestamptz,
  p_value int,
  p_unit text
)
returns timestamptz language sql immutable as $$
  select case lower(coalesce(p_unit, 'days'))
    when 'indefinite' then null
    when 'years' then p_archived_at + make_interval(years => coalesce(p_value, 1))
    when 'months' then p_archived_at + make_interval(months => coalesce(p_value, 1))
    else p_archived_at + make_interval(days => coalesce(p_value, 365))
  end;
$$;

create or replace function public._rrme_security_trust_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'security_trust_settings' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'trust_policies_count', coalesce((
      select count(*) from public.security_trust_settings where organization_id = p_organization_id
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._rrme_compliance_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'compliance_readiness_scores' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'readiness_scores', coalesce((
      select count(*) from public.compliance_readiness_scores where organization_id = p_organization_id
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._rrme_document_output_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'output_generations' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'generations_count', coalesce((
      select count(*) from public.output_generations where organization_id = p_organization_id
    ), 0),
    'archivable_source', 'output_generation',
    'recent_generations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', og.id,
        'report_type', og.report_type,
        'output_format', og.output_format,
        'generated_at', og.generated_at,
        'metadata_only', true
      ) order by og.generated_at desc)
      from (
        select * from public.output_generations
        where organization_id = p_organization_id
        order by generated_at desc limit 10
      ) og
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._rrme_capture_memory_hook(
  p_organization_id uuid,
  p_record_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;

  return public.capture_organization_memory(
    'retention_record',
    left(coalesce(p_summary, 'Retention record archived'), 500),
    jsonb_build_object(
      'source', 'records_retention_management_engine',
      'archived_record_id', p_record_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._rrme_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'active_policies', coalesce((
      select count(*) from public.retention_policies
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'archived_records', coalesce((
      select count(*) from public.archived_records
      where organization_id = p_organization_id and restored_at is null
    ), 0),
    'pending_disposals', coalesce((
      select count(*) from public.record_disposal_requests
      where organization_id = p_organization_id and status = 'pending'
    ), 0),
    'approved_disposals', coalesce((
      select count(*) from public.record_disposal_requests
      where organization_id = p_organization_id and status = 'approved'
    ), 0)
  );
end; $$;

create or replace function public._rrme_seed_policies(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.retention_policies (
    organization_id, policy_name, record_category, retention_period_value,
    retention_period_unit, archive_required, disposal_method, status
  )
  select p_organization_id, v.name, v.cat, v.val, v.unit, v.archive, v.disposal, 'active'
  from (values
    ('Executive reports — 7 years', 'executive_report', 7, 'years', true, 'transfer_to_archive'),
    ('Support reports — 3 years', 'support_report', 3, 'years', true, 'secure_delete'),
    ('Incident reports — 5 years', 'incident_report', 5, 'years', true, 'transfer_to_archive'),
    ('Certificates — indefinite', 'certificate', 0, 'indefinite', true, 'legal_hold'),
    ('Governance documents — 10 years', 'governance_document', 10, 'years', true, 'transfer_to_archive'),
    ('Audit logs — 7 years', 'audit_log', 7, 'years', true, 'anonymize'),
    ('Knowledge exports — 2 years', 'knowledge_export', 2, 'years', true, 'secure_delete'),
    ('Workflow outputs — 1 year', 'workflow_output', 365, 'days', true, 'secure_delete')
  ) as v(name, cat, val, unit, archive, disposal)
  where not exists (
    select 1 from public.retention_policies rp
    where rp.organization_id = p_organization_id and rp.record_category = v.cat and rp.status <> 'retired'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Policy RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_retention_policy(
  p_policy_name text,
  p_record_category text,
  p_retention_period_value int default 365,
  p_retention_period_unit text default 'days',
  p_archive_required boolean default true,
  p_disposal_method text default 'secure_delete',
  p_status text default 'draft'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.retention_policies;
begin
  perform public._irp_require_permission('records.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  insert into public.retention_policies (
    organization_id, policy_name, record_category, retention_period_value,
    retention_period_unit, archive_required, disposal_method, status
  )
  values (
    v_org_id,
    coalesce(nullif(trim(p_policy_name), ''), 'Untitled policy'),
    coalesce(nullif(trim(p_record_category), ''), 'audit_log'),
    greatest(coalesce(p_retention_period_value, 365), 0),
    coalesce(nullif(trim(p_retention_period_unit), ''), 'days'),
    coalesce(p_archive_required, true),
    coalesce(nullif(trim(p_disposal_method), ''), 'secure_delete'),
    coalesce(nullif(trim(p_status), ''), 'draft')
  )
  returning * into v_row;

  perform public._rrme_log(
    v_org_id, 'rrme_policy_created', 'retention_policy', v_row.id,
    jsonb_build_object('policy_name', v_row.policy_name, 'record_category', v_row.record_category, 'created_by', v_user_id)
  );

  return jsonb_build_object('policy', row_to_json(v_row)::jsonb);
end; $$;

create or replace function public.update_retention_policy(
  p_policy_id uuid,
  p_policy_name text default null,
  p_retention_period_value int default null,
  p_retention_period_unit text default null,
  p_archive_required boolean default null,
  p_disposal_method text default null,
  p_status text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.retention_policies;
begin
  perform public._irp_require_permission('records.manage');
  v_org_id := public._mta_require_organization();

  update public.retention_policies set
    policy_name = coalesce(nullif(trim(p_policy_name), ''), policy_name),
    retention_period_value = coalesce(p_retention_period_value, retention_period_value),
    retention_period_unit = coalesce(nullif(trim(p_retention_period_unit), ''), retention_period_unit),
    archive_required = coalesce(p_archive_required, archive_required),
    disposal_method = coalesce(nullif(trim(p_disposal_method), ''), disposal_method),
    status = coalesce(nullif(trim(p_status), ''), status),
    updated_at = now()
  where id = p_policy_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Retention policy not found';
  end if;

  perform public._rrme_log(
    v_org_id, 'rrme_policy_updated', 'retention_policy', v_row.id,
    jsonb_build_object('policy_name', v_row.policy_name, 'status', v_row.status)
  );

  return jsonb_build_object('policy', row_to_json(v_row)::jsonb);
end; $$;

create or replace function public.retire_retention_policy(p_policy_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.retention_policies;
begin
  perform public._irp_require_permission('records.manage');
  v_org_id := public._mta_require_organization();

  update public.retention_policies set status = 'retired', updated_at = now()
  where id = p_policy_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Retention policy not found';
  end if;

  perform public._rrme_log(
    v_org_id, 'rrme_policy_retired', 'retention_policy', v_row.id,
    jsonb_build_object('policy_name', v_row.policy_name)
  );

  return jsonb_build_object('policy', row_to_json(v_row)::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Archive / restore RPCs
-- ---------------------------------------------------------------------------
create or replace function public.archive_record(
  p_source_entity_type text,
  p_source_entity_id uuid,
  p_policy_id uuid default null,
  p_metadata jsonb default '{}'::jsonb,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_policy public.retention_policies;
  v_row public.archived_records;
  v_meta jsonb;
  v_output_row public.output_generations;
begin
  perform public._irp_require_permission('records.archive');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if p_policy_id is not null then
    select * into v_policy from public.retention_policies
    where id = p_policy_id and organization_id = v_org_id and status = 'active';
  end if;

  v_meta := coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object(
    'metadata_only', true,
    'no_raw_content', true,
    'archived_by', v_user_id
  );

  if lower(coalesce(p_source_entity_type, '')) = 'output_generation'
    and exists (select 1 from pg_tables where tablename = 'output_generations' and schemaname = 'public') then
    select * into v_output_row from public.output_generations
    where id = p_source_entity_id and organization_id = v_org_id;

    if v_output_row.id is not null then
      v_meta := v_meta || jsonb_build_object(
        'output_generation_id', v_output_row.id,
        'report_type', v_output_row.report_type,
        'output_format', v_output_row.output_format,
        'generated_at', v_output_row.generated_at,
        'file_metadata', coalesce(v_output_row.file_metadata, '{}'::jsonb),
        'source_context_keys', (
          select coalesce(jsonb_agg(k), '[]'::jsonb)
          from jsonb_object_keys(coalesce(v_output_row.source_context, '{}'::jsonb)) as k
        )
      );

      if v_policy.id is null then
        select * into v_policy from public.retention_policies
        where organization_id = v_org_id and record_category = 'executive_report' and status = 'active'
        order by updated_at desc limit 1;
      end if;
    end if;
  end if;

  insert into public.archived_records (
    organization_id, policy_id, source_entity_type, source_entity_id, version, metadata
  )
  values (
    v_org_id,
    v_policy.id,
    coalesce(nullif(trim(p_source_entity_type), ''), 'unknown'),
    p_source_entity_id,
    1,
    v_meta
  )
  returning * into v_row;

  if coalesce(p_capture_memory, false) then
    perform public._rrme_capture_memory_hook(
      v_org_id, v_row.id,
      'Record archived: ' || v_row.source_entity_type,
      jsonb_build_object('source_entity_id', v_row.source_entity_id)
    );
  end if;

  perform public._rrme_log(
    v_org_id, 'rrme_record_archived', 'archived_record', v_row.id,
    jsonb_build_object('source_entity_type', v_row.source_entity_type, 'policy_id', v_row.policy_id)
  );

  perform public.get_retention_compliance_summary();

  return jsonb_build_object('archived_record', row_to_json(v_row)::jsonb);
end; $$;

create or replace function public.search_archived_records(
  p_source_entity_type text default null,
  p_query text default null,
  p_limit int default 50,
  p_offset int default 0
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_rows jsonb;
begin
  perform public._irp_require_permission('records.view');
  v_org_id := public._mta_require_organization();

  select coalesce(jsonb_agg(row_to_json(r) order by r.archived_at desc), '[]'::jsonb) into v_rows
  from (
    select ar.*,
      public._rrme_expires_at(ar.archived_at, rp.retention_period_value, rp.retention_period_unit) as expires_at,
      rp.policy_name, rp.record_category, rp.disposal_method
    from public.archived_records ar
    left join public.retention_policies rp on rp.id = ar.policy_id
    where ar.organization_id = v_org_id
      and ar.restored_at is null
      and (p_source_entity_type is null or ar.source_entity_type = p_source_entity_type)
      and (
        p_query is null or trim(p_query) = ''
        or ar.source_entity_type ilike '%' || trim(p_query) || '%'
        or ar.metadata::text ilike '%' || trim(p_query) || '%'
      )
    order by ar.archived_at desc
    limit greatest(least(coalesce(p_limit, 50), 200), 1)
    offset greatest(coalesce(p_offset, 0), 0)
  ) r;

  return jsonb_build_object('records', v_rows, 'count', jsonb_array_length(v_rows));
end; $$;

create or replace function public.restore_archived_record(p_archived_record_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.archived_records;
begin
  perform public._irp_require_permission('records.archive');
  v_org_id := public._mta_require_organization();

  update public.archived_records set restored_at = now()
  where id = p_archived_record_id and organization_id = v_org_id and restored_at is null
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Archived record not found or already restored';
  end if;

  perform public._rrme_log(
    v_org_id, 'rrme_record_restored', 'archived_record', v_row.id,
    jsonb_build_object('source_entity_type', v_row.source_entity_type)
  );

  return jsonb_build_object('archived_record', row_to_json(v_row)::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Disposal RPCs
-- ---------------------------------------------------------------------------
create or replace function public.request_record_disposal(p_archived_record_id uuid, p_reason text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_archived public.archived_records;
  v_row public.record_disposal_requests;
begin
  perform public._irp_require_permission('records.dispose');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select * into v_archived from public.archived_records
  where id = p_archived_record_id and organization_id = v_org_id and restored_at is null;

  if v_archived.id is null then
    raise exception 'Archived record not found';
  end if;

  if exists (
    select 1 from public.record_disposal_requests
    where archived_record_id = p_archived_record_id and status in ('pending', 'approved')
  ) then
    raise exception 'Disposal request already pending or approved';
  end if;

  insert into public.record_disposal_requests (
    organization_id, archived_record_id, status, disposal_log, requested_by
  )
  values (
    v_org_id, p_archived_record_id, 'pending',
    jsonb_build_object('reason', left(coalesce(p_reason, ''), 500), 'metadata_only', true),
    v_user_id
  )
  returning * into v_row;

  perform public._rrme_log(
    v_org_id, 'rrme_disposal_requested', 'record_disposal_request', v_row.id,
    jsonb_build_object('archived_record_id', p_archived_record_id)
  );

  return jsonb_build_object('disposal_request', row_to_json(v_row)::jsonb);
end; $$;

create or replace function public.approve_record_disposal(
  p_disposal_request_id uuid,
  p_approved boolean default true
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.record_disposal_requests;
begin
  perform public._irp_require_permission('records.dispose');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.record_disposal_requests set
    status = case when coalesce(p_approved, true) then 'approved' else 'rejected' end,
    approved_by = v_user_id,
    disposal_log = disposal_log || jsonb_build_object(
      'approved', coalesce(p_approved, true),
      'approved_at', now()
    ),
    updated_at = now()
  where id = p_disposal_request_id and organization_id = v_org_id and status = 'pending'
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Disposal request not found or not pending';
  end if;

  perform public._rrme_log(
    v_org_id,
    case when v_row.status = 'approved' then 'rrme_disposal_approved' else 'rrme_disposal_rejected' end,
    'record_disposal_request', v_row.id,
    jsonb_build_object('archived_record_id', v_row.archived_record_id)
  );

  return jsonb_build_object('disposal_request', row_to_json(v_row)::jsonb);
end; $$;

create or replace function public.complete_record_disposal(p_disposal_request_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.record_disposal_requests;
  v_archived public.archived_records;
  v_policy public.retention_policies;
begin
  perform public._irp_require_permission('records.dispose');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select * into v_row from public.record_disposal_requests
  where id = p_disposal_request_id and organization_id = v_org_id and status = 'approved';

  if v_row.id is null then
    raise exception 'Approved disposal request not found';
  end if;

  select * into v_archived from public.archived_records where id = v_row.archived_record_id;
  select * into v_policy from public.retention_policies where id = v_archived.policy_id;

  update public.record_disposal_requests set
    status = 'completed',
    disposed_at = now(),
    disposal_log = disposal_log || jsonb_build_object(
      'completed_at', now(),
      'disposal_method', coalesce(v_policy.disposal_method, 'secure_delete'),
      'metadata_only', true,
      'completed_by', v_user_id
    ),
    updated_at = now()
  where id = v_row.id
  returning * into v_row;

  update public.archived_records set
    metadata = metadata || jsonb_build_object('disposed', true, 'disposed_at', now())
  where id = v_archived.id;

  perform public._rrme_log(
    v_org_id, 'rrme_disposal_completed', 'record_disposal_request', v_row.id,
    jsonb_build_object('archived_record_id', v_row.archived_record_id, 'disposal_method', coalesce(v_policy.disposal_method, 'secure_delete'))
  );

  perform public.get_retention_compliance_summary();

  return jsonb_build_object('disposal_request', row_to_json(v_row)::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Compliance RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_upcoming_expirations(p_days_ahead int default 90)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_expirations jsonb;
  v_horizon interval;
begin
  perform public._irp_require_permission('records.view');
  v_org_id := public._mta_require_organization();
  v_horizon := make_interval(days => greatest(coalesce(p_days_ahead, 90), 1));

  select coalesce(jsonb_agg(jsonb_build_object(
    'archived_record_id', ar.id,
    'source_entity_type', ar.source_entity_type,
    'source_entity_id', ar.source_entity_id,
    'archived_at', ar.archived_at,
    'expires_at', public._rrme_expires_at(ar.archived_at, rp.retention_period_value, rp.retention_period_unit),
    'record_category', rp.record_category,
    'policy_name', rp.policy_name,
    'days_until_expiry', extract(day from (
      public._rrme_expires_at(ar.archived_at, rp.retention_period_value, rp.retention_period_unit) - now()
    ))
  ) order by public._rrme_expires_at(ar.archived_at, rp.retention_period_value, rp.retention_period_unit)), '[]'::jsonb)
  into v_expirations
  from public.archived_records ar
  join public.retention_policies rp on rp.id = ar.policy_id
  where ar.organization_id = v_org_id
    and ar.restored_at is null
    and rp.retention_period_unit <> 'indefinite'
    and public._rrme_expires_at(ar.archived_at, rp.retention_period_value, rp.retention_period_unit) <= now() + v_horizon
    and public._rrme_expires_at(ar.archived_at, rp.retention_period_value, rp.retention_period_unit) >= now();

  return jsonb_build_object('upcoming_expirations', v_expirations, 'horizon_days', p_days_ahead);
end; $$;

create or replace function public.get_retention_compliance_summary()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_expirations jsonb;
  v_indicators jsonb;
begin
  perform public._irp_require_permission('records.view');
  v_org_id := public._mta_require_organization();

  v_expirations := (public.get_upcoming_expirations(90))->'upcoming_expirations';

  v_indicators := jsonb_build_object(
    'active_policies', coalesce((
      select count(*) from public.retention_policies where organization_id = v_org_id and status = 'active'
    ), 0),
    'archived_active', coalesce((
      select count(*) from public.archived_records where organization_id = v_org_id and restored_at is null
    ), 0),
    'pending_disposals', coalesce((
      select count(*) from public.record_disposal_requests where organization_id = v_org_id and status = 'pending'
    ), 0),
    'policies_without_archive', coalesce((
      select count(*) from public.retention_policies
      where organization_id = v_org_id and status = 'active' and archive_required = false
    ), 0),
    'expiring_within_30_days', coalesce(jsonb_array_length(
      (public.get_upcoming_expirations(30))->'upcoming_expirations'
    ), 0),
    'metadata_only', true
  );

  insert into public.retention_compliance_snapshots (organization_id, upcoming_expirations, compliance_indicators, updated_at)
  values (v_org_id, coalesce(v_expirations, '[]'::jsonb), v_indicators, now())
  on conflict (organization_id) do update set
    upcoming_expirations = excluded.upcoming_expirations,
    compliance_indicators = excluded.compliance_indicators,
    updated_at = now();

  return jsonb_build_object(
    'has_organization', true,
    'upcoming_expirations', coalesce(v_expirations, '[]'::jsonb),
    'compliance_indicators', v_indicators,
    'summary', public._rrme_executive_summary_block(v_org_id)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_records_retention_management_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('records.view');
  v_org_id := public._mta_require_organization();
  perform public._rrme_seed_policies(v_org_id);
  perform public._rrme_sync_tenant_module(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify governs record retention with metadata-only archives. Humans approve disposal.',
    'principles', jsonb_build_array(
      'Metadata-only archived records — no raw document content',
      'Retention policies by record category',
      'Human-approved disposal workflow',
      'Compliance snapshots with upcoming expirations',
      'Integrates Document Output and Organizational Memory'
    ),
    'summary', public._rrme_executive_summary_block(v_org_id),
    'policies', coalesce((
      select jsonb_agg(row_to_json(p) order by p.updated_at desc)
      from public.retention_policies p where p.organization_id = v_org_id and p.status <> 'retired'
    ), '[]'::jsonb),
    'archived_records', coalesce((
      select jsonb_agg(row_to_json(r) order by r.archived_at desc)
      from (
        select ar.* from public.archived_records ar
        where ar.organization_id = v_org_id and ar.restored_at is null
        order by ar.archived_at desc limit 30
      ) r
    ), '[]'::jsonb),
    'disposal_requests', coalesce((
      select jsonb_agg(row_to_json(d) order by d.created_at desc)
      from (
        select * from public.record_disposal_requests
        where organization_id = v_org_id order by created_at desc limit 20
      ) d
    ), '[]'::jsonb),
    'compliance', public.get_retention_compliance_summary(),
    'upcoming_expirations', public.get_upcoming_expirations(90),
    'integration_notes', jsonb_build_object(
      'security_trust', 'Security & Trust policy alignment — A.18',
      'compliance', 'Compliance readiness indicators — A.29',
      'organizational_memory', 'Org memory capture on archive — A.34',
      'document_output', 'output_generations as archivable source — A.59'
    ),
    'integration_summaries', jsonb_build_object(
      'security_trust', public._rrme_security_trust_summary(v_org_id),
      'compliance', public._rrme_compliance_summary(v_org_id),
      'document_output', public._rrme_document_output_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_records_retention_management_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._rrme_seed_policies(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Records & Retention — metadata-only archives with human-approved disposal.',
    'active_policies', coalesce((
      select count(*) from public.retention_policies where organization_id = v_org_id and status = 'active'
    ), 0),
    'archived_records', coalesce((
      select count(*) from public.archived_records where organization_id = v_org_id and restored_at is null
    ), 0),
    'pending_disposals', coalesce((
      select count(*) from public.record_disposal_requests where organization_id = v_org_id and status = 'pending'
    ), 0),
    'expiring_soon', coalesce(jsonb_array_length(
      (public.get_upcoming_expirations(30))->'upcoming_expirations'
    ), 0)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Audit allowlist extension
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
    'rrme_disposal_requested', 'rrme_disposal_approved', 'rrme_disposal_rejected', 'rrme_disposal_completed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'records-retention-management-engine', 'Records & Retention Management Engine', 'Retention policies, metadata-only archives, disposal approvals, and compliance snapshots.', 'authenticated', 91
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'records-retention-management-engine' and tenant_id is null);

grant execute on function public.create_retention_policy(text, text, int, text, boolean, text, text) to authenticated;
grant execute on function public.update_retention_policy(uuid, text, int, text, boolean, text, text) to authenticated;
grant execute on function public.retire_retention_policy(uuid) to authenticated;
grant execute on function public.archive_record(text, uuid, uuid, jsonb, boolean) to authenticated;
grant execute on function public.search_archived_records(text, text, int, int) to authenticated;
grant execute on function public.restore_archived_record(uuid) to authenticated;
grant execute on function public.request_record_disposal(uuid, text) to authenticated;
grant execute on function public.approve_record_disposal(uuid, boolean) to authenticated;
grant execute on function public.complete_record_disposal(uuid) to authenticated;
grant execute on function public.get_upcoming_expirations(int) to authenticated;
grant execute on function public.get_retention_compliance_summary() to authenticated;
grant execute on function public.get_records_retention_management_engine_dashboard() to authenticated;
grant execute on function public.get_records_retention_management_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._rrme_seed_policies(v_org_id);
    perform public._rrme_sync_tenant_module(v_org_id);
  end loop;
end $$;
