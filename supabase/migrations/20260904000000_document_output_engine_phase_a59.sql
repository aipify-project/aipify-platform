-- Phase A.59 — Document & Output Engine (CRITICAL V1)
-- Extends API Platform (A.21), Executive Insights (A.35), Certification (A.37),
-- Workflow Orchestration (A.42), Value Realization (A.48), Incident Response (A.51).

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
    'document_output_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. output_templates
-- ---------------------------------------------------------------------------
create table if not exists public.output_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  template_name text not null,
  template_type text not null check (
    template_type in (
      'executive', 'support', 'incident', 'governance', 'security', 'training',
      'certification', 'value_realization', 'org_health', 'strategic_alignment', 'benchmarking'
    )
  ),
  output_format text not null default 'pdf' check (
    output_format in (
      'pdf', 'docx', 'xlsx', 'pptx', 'csv', 'json', 'md', 'txt', 'rtf', 'xml', 'yaml', 'ods', 'odp'
    )
  ),
  version int not null default 1 check (version >= 1),
  status text not null default 'draft' check (
    status in ('active', 'draft', 'archived')
  ),
  template_config jsonb not null default '{}'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists output_templates_org_idx
  on public.output_templates (organization_id, status, template_type, updated_at desc);

alter table public.output_templates enable row level security;
revoke all on public.output_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. output_generations
-- ---------------------------------------------------------------------------
create table if not exists public.output_generations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  template_id uuid references public.output_templates (id) on delete set null,
  report_type text not null check (
    report_type in (
      'executive', 'support', 'incident', 'governance', 'security', 'training',
      'certification', 'value_realization', 'org_health', 'strategic_alignment', 'benchmarking'
    )
  ),
  output_format text not null check (
    output_format in (
      'pdf', 'docx', 'xlsx', 'pptx', 'csv', 'json', 'md', 'txt', 'rtf', 'xml', 'yaml', 'ods', 'odp'
    )
  ),
  version int not null default 1 check (version >= 1),
  generated_by uuid references public.users (id) on delete set null,
  generated_at timestamptz not null default now(),
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'approved', 'rejected', 'not_required')
  ),
  delivery_status text not null default 'pending' check (
    delivery_status in ('pending', 'delivered', 'failed', 'cancelled')
  ),
  file_metadata jsonb not null default '{}'::jsonb,
  source_context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists output_generations_org_idx
  on public.output_generations (organization_id, report_type, generated_at desc);

alter table public.output_generations enable row level security;
revoke all on public.output_generations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. output_schedules
-- ---------------------------------------------------------------------------
create table if not exists public.output_schedules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  template_id uuid not null references public.output_templates (id) on delete cascade,
  cadence text not null check (
    cadence in ('daily', 'weekly', 'monthly', 'quarterly', 'annual')
  ),
  delivery_method text not null default 'download' check (
    delivery_method in ('download', 'email', 'kc_publish', 'executive', 'workflow_attachment')
  ),
  next_run_at timestamptz not null default now(),
  status text not null default 'active' check (
    status in ('active', 'paused', 'cancelled')
  ),
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists output_schedules_org_idx
  on public.output_schedules (organization_id, status, next_run_at);

alter table public.output_schedules enable row level security;
revoke all on public.output_schedules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. output_deliveries
-- ---------------------------------------------------------------------------
create table if not exists public.output_deliveries (
  id uuid primary key default gen_random_uuid(),
  generation_id uuid not null references public.output_generations (id) on delete cascade,
  delivery_method text not null check (
    delivery_method in ('download', 'email', 'kc_publish', 'executive', 'workflow_attachment')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'delivered', 'failed', 'cancelled')
  ),
  delivered_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists output_deliveries_generation_idx
  on public.output_deliveries (generation_id, status, created_at desc);

alter table public.output_deliveries enable row level security;
revoke all on public.output_deliveries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions — outputs.*
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'document_output', v.description
from (values
  ('outputs.view', 'View Outputs', 'View output templates, generations, schedules, and manifests'),
  ('outputs.generate', 'Generate Outputs', 'Generate document outputs from templates'),
  ('outputs.export', 'Export Outputs', 'Export output manifests and generation metadata'),
  ('outputs.schedule', 'Schedule Outputs', 'Schedule recurring output delivery'),
  ('outputs.manage_templates', 'Manage Templates', 'Create, update, and archive output templates')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'outputs.view'), ('owner', 'outputs.generate'), ('owner', 'outputs.export'),
  ('owner', 'outputs.schedule'), ('owner', 'outputs.manage_templates'),
  ('administrator', 'outputs.view'), ('administrator', 'outputs.generate'), ('administrator', 'outputs.export'),
  ('administrator', 'outputs.schedule'), ('administrator', 'outputs.manage_templates'),
  ('manager', 'outputs.view'), ('manager', 'outputs.generate'), ('manager', 'outputs.export'),
  ('manager', 'outputs.schedule'), ('manager', 'outputs.manage_templates'),
  ('support_agent', 'outputs.view'), ('support_agent', 'outputs.generate'),
  ('viewer', 'outputs.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_doe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._doe_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'output_generation',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._doe_mime_for_format(p_format text)
returns text language sql immutable as $$
  select case lower(coalesce(p_format, 'pdf'))
    when 'pdf' then 'application/pdf'
    when 'docx' then 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    when 'xlsx' then 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    when 'pptx' then 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    when 'csv' then 'text/csv'
    when 'json' then 'application/json'
    when 'md' then 'text/markdown'
    when 'txt' then 'text/plain'
    when 'rtf' then 'application/rtf'
    when 'xml' then 'application/xml'
    when 'yaml' then 'application/yaml'
    when 'ods' then 'application/vnd.oasis.opendocument.spreadsheet'
    when 'odp' then 'application/vnd.oasis.opendocument.presentation'
    else 'application/octet-stream'
  end;
$$;

create or replace function public._doe_format_adapter(
  p_format text,
  p_report_type text,
  p_generation_id uuid,
  p_source_context jsonb default '{}'::jsonb
)
returns jsonb language plpgsql stable as $$
declare
  v_format text := lower(coalesce(nullif(trim(p_format), ''), 'pdf'));
  v_report text := coalesce(nullif(trim(p_report_type), ''), 'executive');
  v_keys jsonb := '[]'::jsonb;
  v_key text;
begin
  for v_key in select jsonb_object_keys(coalesce(p_source_context, '{}'::jsonb)) loop
    v_keys := v_keys || to_jsonb(v_key);
  end loop;

  return jsonb_build_object(
    'adapter', 'scaffold',
    'format', v_format,
    'report_type', v_report,
    'mime_type', public._doe_mime_for_format(v_format),
    'download_url', '/api/aipify/document-output-engine/download/' || p_generation_id::text,
    'expires_at', (now() + interval '24 hours')::timestamptz,
    'size_bytes_estimate', case v_format
      when 'pdf' then 245760
      when 'xlsx' then 98304
      when 'pptx' then 524288
      else 32768
    end,
    'sections', jsonb_build_array('summary', 'metrics', 'metadata'),
    'metadata_only', true,
    'no_raw_content', true,
    'source_context_keys', v_keys
  );
end; $$;

create or replace function public._doe_next_run_at(p_cadence text)
returns timestamptz language sql immutable as $$
  select case lower(coalesce(p_cadence, 'monthly'))
    when 'daily' then now() + interval '1 day'
    when 'weekly' then now() + interval '7 days'
    when 'monthly' then now() + interval '1 month'
    when 'quarterly' then now() + interval '3 months'
    when 'annual' then now() + interval '1 year'
    else now() + interval '1 month'
  end;
$$;

create or replace function public._doe_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'templates_active', coalesce((
      select count(*) from public.output_templates
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'templates_total', coalesce((
      select count(*) from public.output_templates where organization_id = p_organization_id
    ), 0),
    'generations_count', coalesce((
      select count(*) from public.output_generations where organization_id = p_organization_id
    ), 0),
    'pending_delivery', coalesce((
      select count(*) from public.output_generations
      where organization_id = p_organization_id and delivery_status = 'pending'
    ), 0),
    'schedules_active', coalesce((
      select count(*) from public.output_schedules
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'latest_generation_at', (
      select max(generated_at) from public.output_generations where organization_id = p_organization_id
    )
  );
end; $$;

create or replace function public._doe_executive_insights_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'get_executive_insights_engine_dashboard') then
    return jsonb_build_object('available', false, 'source', 'executive_insights_a35');
  end if;
  return jsonb_build_object('available', true, 'source', 'executive_insights_a35', 'metadata_only', true);
exception when others then
  return jsonb_build_object('available', false, 'source', 'executive_insights_a35');
end; $$;

create or replace function public._doe_certification_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_certifications' and schemaname = 'public') then
    return jsonb_build_object('available', false, 'source', 'certification_a37');
  end if;
  return jsonb_build_object(
    'available', true,
    'source', 'certification_a37',
    'certifications_count', coalesce((
      select count(*) from public.organization_certifications where organization_id = p_organization_id
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false, 'source', 'certification_a37');
end; $$;

create or replace function public._doe_value_realization_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'value_metrics' and schemaname = 'public') then
    return jsonb_build_object('available', false, 'source', 'value_realization_a48');
  end if;
  return jsonb_build_object(
    'available', true,
    'source', 'value_realization_a48',
    'metrics_count', coalesce((
      select count(*) from public.value_metrics where organization_id = p_organization_id
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false, 'source', 'value_realization_a48');
end; $$;

create or replace function public._doe_incident_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'incident_records' and schemaname = 'public') then
    return jsonb_build_object('available', false, 'source', 'incident_response_a51');
  end if;
  return jsonb_build_object(
    'available', true,
    'source', 'incident_response_a51',
    'open_incidents', coalesce((
      select count(*) from public.incident_records
      where organization_id = p_organization_id and status not in ('resolved', 'closed')
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false, 'source', 'incident_response_a51');
end; $$;

create or replace function public._doe_seed_templates(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.output_templates (
    organization_id, template_name, template_type, output_format, version, status, template_config
  )
  select p_organization_id, v.name, v.type, v.format, 1, 'active', v.config
  from (values
    (
      'Executive Summary Pack', 'executive', 'pdf',
      '{"sections":["overview","risks","opportunities"],"source":"executive_insights_a35"}'::jsonb
    ),
    (
      'Support Operations Report', 'support', 'xlsx',
      '{"sections":["backlog","response_times","satisfaction"],"metadata_only":true}'::jsonb
    ),
    (
      'Incident Response Summary', 'incident', 'pdf',
      '{"sections":["open_incidents","timeline","lessons"],"source":"incident_response_a51"}'::jsonb
    ),
    (
      'Value Realization Export', 'value_realization', 'csv',
      '{"sections":["metrics","milestones","trends"],"source":"value_realization_a48"}'::jsonb
    )
  ) as v(name, type, format, config)
  where not exists (
    select 1 from public.output_templates t
    where t.organization_id = p_organization_id and t.template_name = v.name
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_output_template(
  p_template_name text,
  p_template_type text,
  p_output_format text default 'pdf',
  p_template_config jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.output_templates;
begin
  perform public._irp_require_permission('outputs.manage_templates');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  insert into public.output_templates (
    organization_id, template_name, template_type, output_format, version, status,
    template_config, created_by
  )
  values (
    v_org_id, trim(p_template_name), p_template_type,
    lower(coalesce(nullif(trim(p_output_format), ''), 'pdf')),
    1, 'draft', coalesce(p_template_config, '{}'::jsonb), v_user_id
  )
  returning * into v_row;

  perform public._doe_log(
    v_org_id, 'doe_template_created', 'output_template', v_row.id,
    jsonb_build_object('template_name', v_row.template_name, 'template_type', v_row.template_type)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_output_template(
  p_template_id uuid,
  p_template_name text default null,
  p_output_format text default null,
  p_template_config jsonb default null,
  p_status text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.output_templates;
begin
  perform public._irp_require_permission('outputs.manage_templates');
  v_org_id := public._mta_require_organization();

  update public.output_templates
  set
    template_name = coalesce(nullif(trim(p_template_name), ''), template_name),
    output_format = coalesce(nullif(lower(trim(p_output_format)), ''), output_format),
    template_config = coalesce(p_template_config, template_config),
    status = coalesce(nullif(trim(p_status), ''), status),
    version = version + case when p_template_config is not null then 1 else 0 end,
    updated_at = now()
  where id = p_template_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Output template not found'; end if;

  perform public._doe_log(
    v_org_id, 'doe_template_updated', 'output_template', v_row.id,
    jsonb_build_object('template_id', p_template_id, 'status', v_row.status)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.archive_output_template(p_template_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.output_templates;
begin
  perform public._irp_require_permission('outputs.manage_templates');
  v_org_id := public._mta_require_organization();

  update public.output_templates
  set status = 'archived', updated_at = now()
  where id = p_template_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Output template not found'; end if;

  perform public._doe_log(
    v_org_id, 'doe_template_archived', 'output_template', v_row.id,
    jsonb_build_object('template_id', p_template_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.generate_document_output(
  p_template_id uuid default null,
  p_report_type text default 'executive',
  p_format text default 'pdf',
  p_source_context jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_template public.output_templates;
  v_format text;
  v_report_type text;
  v_row public.output_generations;
  v_file_meta jsonb;
  v_hook jsonb;
begin
  perform public._irp_require_permission('outputs.generate');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if p_template_id is not null then
    select * into v_template from public.output_templates
    where id = p_template_id and organization_id = v_org_id and status = 'active';
    if v_template.id is null then raise exception 'Active output template not found'; end if;
    v_format := coalesce(nullif(lower(trim(p_format)), ''), v_template.output_format);
    v_report_type := coalesce(nullif(trim(p_report_type), ''), v_template.template_type);
  else
    v_format := lower(coalesce(nullif(trim(p_format), ''), 'pdf'));
    v_report_type := coalesce(nullif(trim(p_report_type), ''), 'executive');
  end if;

  insert into public.output_generations (
    organization_id, template_id, report_type, output_format, version,
    generated_by, approval_status, delivery_status, source_context, file_metadata
  )
  values (
    v_org_id, p_template_id, v_report_type, v_format, coalesce(v_template.version, 1),
    v_user_id, 'not_required', 'pending', coalesce(p_source_context, '{}'::jsonb), '{}'::jsonb
  )
  returning * into v_row;

  v_file_meta := public._doe_format_adapter(v_format, v_report_type, v_row.id, p_source_context);

  update public.output_generations
  set file_metadata = v_file_meta
  where id = v_row.id
  returning * into v_row;

  v_hook := public.trigger_workflow_output_hook(v_row.id, coalesce(p_source_context, '{}'::jsonb));

  perform public._doe_log(
    v_org_id, 'doe_output_generated', 'output_generation', v_row.id,
    jsonb_build_object(
      'report_type', v_report_type, 'format', v_format,
      'template_id', p_template_id, 'metadata_only', true
    )
  );

  return jsonb_build_object(
    'generation', row_to_json(v_row)::jsonb,
    'file_metadata', v_file_meta,
    'workflow_hook', v_hook
  );
end; $$;

create or replace function public.schedule_output_delivery(
  p_template_id uuid,
  p_cadence text default 'monthly',
  p_delivery_method text default 'download'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.output_schedules;
begin
  perform public._irp_require_permission('outputs.schedule');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if not exists (
    select 1 from public.output_templates
    where id = p_template_id and organization_id = v_org_id and status = 'active'
  ) then
    raise exception 'Active output template not found';
  end if;

  insert into public.output_schedules (
    organization_id, template_id, cadence, delivery_method, next_run_at, status, created_by
  )
  values (
    v_org_id, p_template_id,
    lower(coalesce(nullif(trim(p_cadence), ''), 'monthly')),
    lower(coalesce(nullif(trim(p_delivery_method), ''), 'download')),
    public._doe_next_run_at(p_cadence), 'active', v_user_id
  )
  returning * into v_row;

  perform public._doe_log(
    v_org_id, 'doe_schedule_created', 'output_schedule', v_row.id,
    jsonb_build_object('template_id', p_template_id, 'cadence', v_row.cadence)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_output_delivery(
  p_generation_id uuid,
  p_delivery_method text default 'download',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_gen public.output_generations;
  v_row public.output_deliveries;
begin
  perform public._irp_require_permission('outputs.export');
  v_org_id := public._mta_require_organization();

  select * into v_gen from public.output_generations
  where id = p_generation_id and organization_id = v_org_id;
  if v_gen.id is null then raise exception 'Output generation not found'; end if;

  insert into public.output_deliveries (generation_id, delivery_method, status, delivered_at, metadata)
  values (
    p_generation_id,
    lower(coalesce(nullif(trim(p_delivery_method), ''), 'download')),
    'delivered', now(),
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  )
  returning * into v_row;

  update public.output_generations
  set delivery_status = 'delivered'
  where id = p_generation_id;

  perform public._doe_log(
    v_org_id, 'doe_delivery_recorded', 'output_delivery', v_row.id,
    jsonb_build_object('generation_id', p_generation_id, 'delivery_method', v_row.delivery_method)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.cancel_scheduled_output(p_schedule_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.output_schedules;
begin
  perform public._irp_require_permission('outputs.schedule');
  v_org_id := public._mta_require_organization();

  update public.output_schedules
  set status = 'cancelled', updated_at = now()
  where id = p_schedule_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Output schedule not found'; end if;

  perform public._doe_log(
    v_org_id, 'doe_schedule_cancelled', 'output_schedule', v_row.id,
    jsonb_build_object('schedule_id', p_schedule_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.list_output_generations(p_limit int default 20, p_offset int default 0)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('outputs.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'has_organization', true,
    'generations', coalesce((
      select jsonb_agg(row_to_json(g) order by g.generated_at desc)
      from (
        select * from public.output_generations
        where organization_id = v_org_id
        order by generated_at desc
        limit greatest(coalesce(p_limit, 20), 1)
        offset greatest(coalesce(p_offset, 0), 0)
      ) g
    ), '[]'::jsonb),
    'total', coalesce((
      select count(*) from public.output_generations where organization_id = v_org_id
    ), 0)
  );
end; $$;

create or replace function public.export_output_manifest(p_report_type text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_generations jsonb;
  v_deliveries jsonb;
begin
  perform public._irp_require_permission('outputs.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select coalesce(jsonb_agg(row_to_json(g) order by g.generated_at desc), '[]'::jsonb) into v_generations
  from public.output_generations g
  where g.organization_id = v_org_id
    and (p_report_type is null or g.report_type = p_report_type)
  limit 50;

  select coalesce(jsonb_agg(row_to_json(d) order by d.created_at desc), '[]'::jsonb) into v_deliveries
  from public.output_deliveries d
  join public.output_generations g on g.id = d.generation_id
  where g.organization_id = v_org_id
  limit 50;

  perform public._doe_log(
    v_org_id, 'doe_manifest_exported', 'output_generation', null,
    jsonb_build_object('report_type', p_report_type, 'exported_by', v_user_id)
  );

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'report_type_filter', p_report_type,
    'summary', public._doe_executive_summary_block(v_org_id),
    'generations', coalesce(v_generations, '[]'::jsonb),
    'deliveries', coalesce(v_deliveries, '[]'::jsonb),
    'metadata_only', true
  );
end; $$;

create or replace function public.trigger_workflow_output_hook(
  p_generation_id uuid,
  p_trigger_context jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_gen public.output_generations;
  v_workflow_count int := 0;
begin
  v_org_id := public._mta_require_organization();

  select * into v_gen from public.output_generations
  where id = p_generation_id and organization_id = v_org_id;
  if v_gen.id is null then
    return jsonb_build_object('triggered', false, 'reason', 'generation_not_found');
  end if;

  if exists (select 1 from pg_tables where tablename = 'organization_workflows' and schemaname = 'public') then
    select count(*) into v_workflow_count
    from public.organization_workflows
    where organization_id = v_org_id and status = 'active';
  end if;

  return jsonb_build_object(
    'triggered', v_workflow_count > 0,
    'scaffold', true,
    'source', 'workflow_orchestration_a42',
    'generation_id', p_generation_id,
    'report_type', v_gen.report_type,
    'active_workflows', v_workflow_count,
    'trigger_context', coalesce(p_trigger_context, '{}'::jsonb),
    'metadata_only', true,
    'hook_type', 'output_generated'
  );
exception when others then
  return jsonb_build_object('triggered', false, 'scaffold', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public.get_executive_output_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('outputs.view');
  v_org_id := public._mta_require_organization();
  perform public._doe_seed_templates(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Operational value captured — save, export, share, automate, reproduce.',
    'summary', public._doe_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'api_platform', 'Download URL scaffold aligns with API Platform (A.21)',
      'executive_insights', 'Executive report source metadata (A.35)',
      'certification', 'Certification export context (A.37)',
      'workflow_orchestration', 'Metadata triggers on generation (A.42)',
      'value_realization', 'Value report source metadata (A.48)',
      'incident_response', 'Incident report context (A.51)'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_document_output_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('outputs.view');
  v_org_id := public._mta_require_organization();
  perform public._doe_seed_templates(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'If Aipify generates operational value — save, export, share, automate, reproduce.',
    'principles', jsonb_build_array(
      'Metadata and generation requests in database',
      'Format generation via adapter layer — no raw PII',
      'Scheduled outputs for daily/weekly/monthly/quarterly/annual cadences',
      'Workflow hooks integrate with organization workflows',
      'Humans approve sensitive exports when required'
    ),
    'summary', public._doe_executive_summary_block(v_org_id),
    'templates', coalesce((
      select jsonb_agg(row_to_json(t) order by t.updated_at desc)
      from public.output_templates t
      where t.organization_id = v_org_id and t.status != 'archived'
      limit 20
    ), '[]'::jsonb),
    'generations', coalesce((
      select jsonb_agg(row_to_json(g) order by g.generated_at desc)
      from public.output_generations g
      where g.organization_id = v_org_id
      limit 15
    ), '[]'::jsonb),
    'schedules', coalesce((
      select jsonb_agg(row_to_json(s) order by s.next_run_at)
      from public.output_schedules s
      where s.organization_id = v_org_id and s.status = 'active'
      limit 15
    ), '[]'::jsonb),
    'executive_summary', public._doe_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'api_platform', 'API Platform export scaffold (A.21)',
      'executive_insights', 'Executive Insights reporting (A.35)',
      'certification', 'Certification & Achievement exports (A.37)',
      'workflow_orchestration', 'Workflow output hooks (A.42)',
      'value_realization', 'Value Realization reports (A.48)',
      'incident_response', 'Incident Response summaries (A.51)'
    ),
    'integration_summaries', jsonb_build_object(
      'executive_insights', public._doe_executive_insights_summary(v_org_id),
      'certification', public._doe_certification_summary(v_org_id),
      'value_realization', public._doe_value_realization_summary(v_org_id),
      'incident_response', public._doe_incident_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_document_output_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._doe_seed_templates(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Document & Output Engine — capture operational value as exportable outputs.',
    'templates_active', coalesce((
      select count(*) from public.output_templates
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'generations_count', coalesce((
      select count(*) from public.output_generations where organization_id = v_org_id
    ), 0),
    'schedules_active', coalesce((
      select count(*) from public.output_schedules
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'pending_delivery', coalesce((
      select count(*) from public.output_generations
      where organization_id = v_org_id and delivery_status = 'pending'
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
    'sae_strategic_review_recorded', 'sae_misalignment_detected', 'sae_alignment_report_exported',
    'ohe_health_measured', 'ohe_category_refreshed', 'ohe_score_overridden',
    'ohe_recommendations_generated', 'ohe_intervention_approved', 'ohe_health_report_exported',
    'cma_assessment_created', 'cma_assessment_updated', 'cma_roadmap_generated', 'cma_maturity_report_exported',
    'obe_profile_created', 'obe_profile_updated', 'obe_comparison_generated', 'obe_benchmark_report_exported',
    'doe_template_created', 'doe_template_updated', 'doe_template_archived',
    'doe_output_generated', 'doe_schedule_created', 'doe_schedule_cancelled',
    'doe_delivery_recorded', 'doe_manifest_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'document-output-engine', 'Document & Output Engine', 'Templates, generation, scheduling, and delivery of operational outputs — metadata only, no raw PII in audit.', 'authenticated', 90
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'document-output-engine' and tenant_id is null);

grant execute on function public.create_output_template(text, text, text, jsonb) to authenticated;
grant execute on function public.update_output_template(uuid, text, text, jsonb, text) to authenticated;
grant execute on function public.archive_output_template(uuid) to authenticated;
grant execute on function public.generate_document_output(uuid, text, text, jsonb) to authenticated;
grant execute on function public.schedule_output_delivery(uuid, text, text) to authenticated;
grant execute on function public.record_output_delivery(uuid, text, jsonb) to authenticated;
grant execute on function public.cancel_scheduled_output(uuid) to authenticated;
grant execute on function public.list_output_generations(int, int) to authenticated;
grant execute on function public.export_output_manifest(text) to authenticated;
grant execute on function public.trigger_workflow_output_hook(uuid, jsonb) to authenticated;
grant execute on function public.get_executive_output_summary() to authenticated;
grant execute on function public.get_document_output_engine_dashboard() to authenticated;
grant execute on function public.get_document_output_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._doe_seed_templates(v_org_id);
  end loop;
end $$;
