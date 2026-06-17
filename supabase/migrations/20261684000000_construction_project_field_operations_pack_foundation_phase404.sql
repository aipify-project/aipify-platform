-- Phase 404 — Construction, Project Delivery & Field Operations Pack Foundation
-- Feature owner: CUSTOMER APP. Route: /app/construction. Helpers: _gcpfo404_*
-- Industry Pack home for contractors, builders, project organizations, and field operations.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.construction_pack_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  portfolio_type text not null default 'single_project' check (
    portfolio_type in (
      'single_project', 'multi_project', 'regional_portfolio',
      'enterprise_portfolio', 'infrastructure_group'
    )
  ),
  health_score integer not null default 71 check (health_score between 0 and 100),
  industry_pack_install_id uuid references public.tenant_industry_pack_installs (id) on delete set null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  project_key text not null,
  project_name text not null,
  customer_name text not null default '',
  project_type text not null default 'commercial' check (
    project_type in (
      'residential', 'commercial', 'industrial', 'infrastructure',
      'renovation', 'civil_engineering', 'government', 'custom'
    )
  ),
  location text not null default '',
  budget_amount numeric(16, 2) not null default 0,
  project_status text not null default 'planning' check (
    project_status in (
      'planning', 'approved', 'in_progress', 'on_hold',
      'delayed', 'completed', 'cancelled', 'archived'
    )
  ),
  completion_percent numeric(5, 2) not null default 0 check (completion_percent between 0 and 100),
  profitability_label text not null default 'stable' check (
    profitability_label in ('outperforming', 'stable', 'needs_attention', 'critical')
  ),
  timeline_start date,
  timeline_end date,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, project_key)
);

create index if not exists construction_projects_tenant_idx
  on public.construction_projects (tenant_id, project_status);

create table if not exists public.construction_sites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  project_id uuid references public.construction_projects (id) on delete set null,
  site_key text not null,
  site_name text not null,
  site_manager text not null default '',
  safety_status text not null default 'compliant' check (
    safety_status in ('compliant', 'attention_required', 'non_compliant', 'under_review')
  ),
  compliance_status text not null default 'pending' check (
    compliance_status in ('pending', 'compliant', 'expired', 'failed')
  ),
  daily_activity_summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, site_key)
);

create index if not exists construction_sites_tenant_idx
  on public.construction_sites (tenant_id, safety_status);

create table if not exists public.construction_workforce_assignments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  project_id uuid references public.construction_projects (id) on delete set null,
  site_id uuid references public.construction_sites (id) on delete set null,
  worker_name text not null,
  worker_type text not null default 'employee' check (
    worker_type in ('employee', 'subcontractor', 'specialist', 'supervisor')
  ),
  certification_status text not null default 'valid' check (
    certification_status in ('valid', 'expiring', 'expired', 'missing')
  ),
  assignment_status text not null default 'assigned' check (
    assignment_status in ('assigned', 'on_site', 'off_site', 'completed', 'archived')
  ),
  shift_label text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists construction_workforce_assignments_tenant_idx
  on public.construction_workforce_assignments (tenant_id, assignment_status);

create table if not exists public.construction_equipment (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  project_id uuid references public.construction_projects (id) on delete set null,
  equipment_key text not null,
  equipment_name text not null,
  equipment_type text not null default 'machinery' check (
    equipment_type in ('machinery', 'vehicle', 'tool', 'safety', 'other')
  ),
  utilization_percent numeric(5, 2) not null default 0 check (utilization_percent between 0 and 100),
  availability_status text not null default 'available' check (
    availability_status in ('available', 'in_use', 'maintenance', 'inspection', 'unavailable')
  ),
  last_inspection_date date,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, equipment_key)
);

create index if not exists construction_equipment_tenant_idx
  on public.construction_equipment (tenant_id, availability_status);

create table if not exists public.construction_material_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  project_id uuid references public.construction_projects (id) on delete set null,
  material_key text not null,
  material_name text not null,
  delivery_status text not null default 'scheduled' check (
    delivery_status in ('scheduled', 'in_transit', 'delivered', 'delayed', 'shortage')
  ),
  quantity numeric(12, 2) not null default 0,
  unit_label text not null default 'units',
  cost_amount numeric(14, 2) not null default 0,
  supplier_name text not null default '',
  risk_level text not null default 'low' check (risk_level in ('low', 'moderate', 'high', 'critical')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, material_key)
);

create index if not exists construction_material_records_tenant_idx
  on public.construction_material_records (tenant_id, delivery_status);

create table if not exists public.construction_safety_incidents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  project_id uuid references public.construction_projects (id) on delete set null,
  site_id uuid references public.construction_sites (id) on delete set null,
  incident_reference text not null,
  incident_type text not null default 'observation' check (
    incident_type in ('observation', 'near_miss', 'injury', 'property_damage', 'environmental', 'other')
  ),
  severity text not null default 'moderate' check (
    severity in ('informational', 'moderate', 'high', 'critical')
  ),
  location_label text not null default '',
  investigation_status text not null default 'open' check (
    investigation_status in ('open', 'investigating', 'corrective_action', 'resolved', 'closed')
  ),
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, incident_reference)
);

create index if not exists construction_safety_incidents_tenant_idx
  on public.construction_safety_incidents (tenant_id, created_at desc);

create table if not exists public.construction_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'project_delay_detected', 'material_shortage', 'safety_training_overdue',
      'equipment_utilization_declining', 'profitability_review', 'timeline_review',
      'material_delivery_delayed', 'safety_compliance_attention', 'equipment_maintenance_overdue',
      'profitability_improving'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  project_id uuid references public.construction_projects (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists construction_advisor_signals_tenant_idx
  on public.construction_advisor_signals (tenant_id, created_at desc);

create table if not exists public.construction_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'project_created', 'project_updated', 'site_created', 'material_delivered',
      'incident_reported', 'inspection_completed', 'equipment_assigned',
      'financial_record_updated', 'pack_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists construction_audit_logs_tenant_idx
  on public.construction_audit_logs (tenant_id, created_at desc);

alter table public.construction_pack_settings enable row level security;
alter table public.construction_projects enable row level security;
alter table public.construction_sites enable row level security;
alter table public.construction_workforce_assignments enable row level security;
alter table public.construction_equipment enable row level security;
alter table public.construction_material_records enable row level security;
alter table public.construction_safety_incidents enable row level security;
alter table public.construction_advisor_signals enable row level security;
alter table public.construction_audit_logs enable row level security;

revoke all on public.construction_pack_settings from authenticated, anon;
revoke all on public.construction_projects from authenticated, anon;
revoke all on public.construction_sites from authenticated, anon;
revoke all on public.construction_workforce_assignments from authenticated, anon;
revoke all on public.construction_equipment from authenticated, anon;
revoke all on public.construction_material_records from authenticated, anon;
revoke all on public.construction_safety_incidents from authenticated, anon;
revoke all on public.construction_advisor_signals from authenticated, anon;
revoke all on public.construction_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'construction_project_field_operations_pack', v.description
from (values
  ('construction.view', 'View Construction Pack', 'View construction projects, sites, workforce, equipment, materials, and safety'),
  ('construction.manage', 'Manage Construction Pack', 'Manage projects, sites, field operations, safety, and construction settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

update public.industry_pack_registry
set
  short_description = 'Construction and field operations — projects, sites, workforce, equipment, materials, safety, and project delivery on ABOS.',
  lifecycle_status = 'production',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'canonical_route', '/app/construction',
    'phase', 404
  ),
  updated_at = now()
where pack_key = 'construction_pack';

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gcpfo404_*
-- ---------------------------------------------------------------------------
create or replace function public._gcpfo404_require_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Construction Pack requires an active subscription';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._gcpfo404_log_audit(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.construction_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gcpfo404_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.construction_pack_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.construction_pack_settings;
  v_registry_id uuid;
  v_install_id uuid;
begin
  select id into v_registry_id from public.industry_pack_registry where pack_key = 'construction_pack' limit 1;

  if v_registry_id is not null then
    insert into public.tenant_industry_pack_installs (
      organization_id, registry_id, install_status, install_mode, health_score
    )
    select p_org_id, v_registry_id, 'active', 'guided', 74
    where not exists (
      select 1 from public.tenant_industry_pack_installs
      where organization_id = p_org_id and registry_id = v_registry_id and install_status != 'removed'
    );
  end if;

  select id into v_install_id
  from public.tenant_industry_pack_installs
  where organization_id = p_org_id and registry_id = v_registry_id and install_status = 'active'
  limit 1;

  insert into public.construction_pack_settings (organization_id, tenant_id, industry_pack_install_id)
  values (p_org_id, p_tenant_id, v_install_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.construction_pack_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._gcpfo404_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.construction_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.construction_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'timeline_review',
      'Project timelines may require review across active delivery schedules.',
      'Schedule drift increases cost overrun and safety coordination risk.',
      'Open Projects module and confirm milestone dates with site managers.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'safety_compliance_attention',
      'Safety compliance indicators may require attention on active sites.',
      'Compliance gaps increase incident risk and regulatory exposure.',
      'Review Safety Operations and confirm inspection and training status.',
      'high', 'high'
    ),
    (
      p_tenant_id, 'equipment_maintenance_overdue',
      'Equipment maintenance schedules may require verification.',
      'Unplanned downtime delays project delivery and increases costs.',
      'Open Equipment module and confirm inspection and availability status.',
      'moderate', 'moderate'
    );
end;
$$;

create or replace function public._gcpfo404_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_projects integer := 0;
  v_project_value numeric := 0;
  v_workforce integer := 0;
  v_sites integer := 0;
  v_equipment integer := 0;
  v_utilization numeric := 0;
  v_progress numeric := 0;
  v_safety_issues integer := 0;
  v_health numeric := 71;
  v_material_risks integer := 0;
begin
  select count(*)::int, coalesce(sum(budget_amount), 0), coalesce(avg(completion_percent), 0)
  into v_projects, v_project_value, v_progress
  from public.construction_projects
  where tenant_id = p_tenant_id and project_status not in ('cancelled', 'archived');

  select count(*)::int into v_sites
  from public.construction_sites where tenant_id = p_tenant_id;

  select count(*)::int into v_workforce
  from public.construction_workforce_assignments
  where tenant_id = p_tenant_id and assignment_status in ('assigned', 'on_site');

  select count(*)::int, coalesce(avg(utilization_percent), 0)
  into v_equipment, v_utilization
  from public.construction_equipment where tenant_id = p_tenant_id;

  select count(*)::int into v_safety_issues
  from public.construction_safety_incidents
  where tenant_id = p_tenant_id and investigation_status not in ('resolved', 'closed');

  select count(*)::int into v_material_risks
  from public.construction_material_records
  where tenant_id = p_tenant_id and risk_level in ('high', 'critical');

  select coalesce(health_score, 71) into v_health
  from public.construction_pack_settings where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'active_projects', v_projects,
    'project_value', v_project_value,
    'workforce_assigned', v_workforce,
    'active_sites', v_sites,
    'equipment_count', v_equipment,
    'equipment_utilization', round(v_utilization, 1),
    'project_progress', round(v_progress, 1),
    'safety_open_incidents', v_safety_issues,
    'construction_health_score', round(v_health)::int,
    'material_risks', v_material_risks
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_construction_project_field_operations_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_settings public.construction_pack_settings;
  v_projects jsonb := '[]'::jsonb;
  v_sites jsonb := '[]'::jsonb;
  v_workforce jsonb := '[]'::jsonb;
  v_equipment jsonb := '[]'::jsonb;
  v_materials jsonb := '[]'::jsonb;
  v_incidents jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('construction.view');
  v_ctx := public._gcpfo404_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gcpfo404_ensure_settings(v_org_id, v_tenant_id);
  perform public._gcpfo404_seed_advisor(v_tenant_id);
  v_overview := public._gcpfo404_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'project_key', p.project_key, 'project_name', p.project_name,
    'customer_name', p.customer_name, 'project_type', p.project_type,
    'location', p.location, 'budget_amount', p.budget_amount,
    'project_status', p.project_status, 'completion_percent', p.completion_percent,
    'profitability_label', p.profitability_label
  ) order by p.project_name), '[]'::jsonb)
  into v_projects
  from public.construction_projects p
  where p.tenant_id = v_tenant_id and p.project_status not in ('archived');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'site_key', s.site_key, 'site_name', s.site_name,
    'site_manager', s.site_manager, 'safety_status', s.safety_status,
    'compliance_status', s.compliance_status, 'project_id', s.project_id
  ) order by s.site_name), '[]'::jsonb)
  into v_sites
  from public.construction_sites s
  where s.tenant_id = v_tenant_id
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id, 'worker_name', w.worker_name, 'worker_type', w.worker_type,
    'certification_status', w.certification_status, 'assignment_status', w.assignment_status,
    'shift_label', w.shift_label, 'project_id', w.project_id
  ) order by w.worker_name), '[]'::jsonb)
  into v_workforce
  from public.construction_workforce_assignments w
  where w.tenant_id = v_tenant_id and w.assignment_status != 'archived'
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'equipment_key', e.equipment_key, 'equipment_name', e.equipment_name,
    'equipment_type', e.equipment_type, 'utilization_percent', e.utilization_percent,
    'availability_status', e.availability_status, 'project_id', e.project_id
  ) order by e.equipment_name), '[]'::jsonb)
  into v_equipment
  from public.construction_equipment e
  where e.tenant_id = v_tenant_id
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'material_key', m.material_key, 'material_name', m.material_name,
    'delivery_status', m.delivery_status, 'quantity', m.quantity,
    'cost_amount', m.cost_amount, 'supplier_name', m.supplier_name, 'risk_level', m.risk_level
  ) order by m.material_name), '[]'::jsonb)
  into v_materials
  from public.construction_material_records m
  where m.tenant_id = v_tenant_id
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'incident_reference', i.incident_reference, 'incident_type', i.incident_type,
    'severity', i.severity, 'investigation_status', i.investigation_status,
    'summary', i.summary, 'location_label', i.location_label
  ) order by i.created_at desc), '[]'::jsonb)
  into v_incidents
  from public.construction_safety_incidents i
  where i.tenant_id = v_tenant_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.construction_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.construction_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Construction success is achieved through planning, coordination, execution, safety, and accountability.',
    'mission', 'Construction & Field Operations System — project delivery, workforce, materials, equipment, and safety visibility.',
    'abos_principle', 'Aipify informs and prepares; operators decide. Field-ready project controls on unified ABOS foundation.',
    'industry_packs_route', '/app/industry-packs',
    'distinction_note', 'Information flows as efficiently as materials and people — unified construction visibility.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/construction'),
      jsonb_build_object('key', 'projects', 'route', '/app/construction/projects'),
      jsonb_build_object('key', 'sites', 'route', '/app/construction/sites'),
      jsonb_build_object('key', 'workforce', 'route', '/app/construction/workforce'),
      jsonb_build_object('key', 'equipment', 'route', '/app/construction/equipment'),
      jsonb_build_object('key', 'materials', 'route', '/app/construction/materials'),
      jsonb_build_object('key', 'safety', 'route', '/app/construction/safety'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/construction/intelligence')
    ),
    'projects', v_projects,
    'sites', v_sites,
    'workforce', v_workforce,
    'equipment', v_equipment,
    'materials', v_materials,
    'safety_incidents', v_incidents,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'sites_route', '/app/construction/sites',
      'workforce_route', '/app/construction/workforce',
      'materials_route', '/app/construction/materials',
      'equipment_route', '/app/construction/equipment',
      'safety_route', '/app/construction/safety',
      'field_reports_route', '/app/construction/field-reports'
    ),
    'executive_dashboard', jsonb_build_object(
      'project_portfolio', v_overview->>'active_projects',
      'project_value', v_overview->>'project_value',
      'project_progress', v_overview->>'project_progress',
      'safety_health', v_overview->>'safety_open_incidents',
      'equipment_utilization', v_overview->>'equipment_utilization',
      'construction_health_score', v_overview->>'construction_health_score',
      'executive_route', '/app/construction/intelligence'
    ),
    'privacy_note', 'Project and workforce data isolated per organization — metadata-first intelligence only.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.construction_project_field_operations_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_project_id uuid;
  v_project_name text;
  v_site_id uuid;
  v_equipment_id uuid;
begin
  perform public._irp_require_permission('construction.manage');
  perform public._gcpfo404_require_access();
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  perform public._gcpfo404_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_project' then
    insert into public.construction_projects (
      tenant_id, project_key, project_name, customer_name, project_type,
      location, budget_amount, project_status, completion_percent
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'project_key', 'project-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'project_name', 'New project'),
      coalesce(p_payload->>'customer_name', ''),
      coalesce(p_payload->>'project_type', 'commercial'),
      coalesce(p_payload->>'location', ''),
      coalesce((p_payload->>'budget_amount')::numeric, 0),
      coalesce(p_payload->>'project_status', 'planning'),
      coalesce((p_payload->>'completion_percent')::numeric, 0)
    ) returning id, project_name into v_project_id, v_project_name;

    perform public._gcpfo404_log_audit(
      v_tenant_id, 'project_created', 'Project created: ' || v_project_name,
      jsonb_build_object('project_id', v_project_id)
    );

    return jsonb_build_object('ok', true, 'project_id', v_project_id);
  end if;

  if v_action = 'create_site' then
    insert into public.construction_sites (
      tenant_id, project_id, site_key, site_name, site_manager, safety_status
    ) values (
      v_tenant_id,
      nullif(p_payload->>'project_id', '')::uuid,
      lower(regexp_replace(coalesce(p_payload->>'site_key', 'site-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'site_name', 'New site'),
      coalesce(p_payload->>'site_manager', ''),
      coalesce(p_payload->>'safety_status', 'compliant')
    ) returning id into v_site_id;

    perform public._gcpfo404_log_audit(
      v_tenant_id, 'site_created', 'Site created',
      jsonb_build_object('site_id', v_site_id)
    );

    return jsonb_build_object('ok', true, 'site_id', v_site_id);
  end if;

  if v_action = 'create_equipment' then
    insert into public.construction_equipment (
      tenant_id, project_id, equipment_key, equipment_name, equipment_type, utilization_percent
    ) values (
      v_tenant_id,
      nullif(p_payload->>'project_id', '')::uuid,
      lower(regexp_replace(coalesce(p_payload->>'equipment_key', 'equip-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'equipment_name', 'New equipment'),
      coalesce(p_payload->>'equipment_type', 'machinery'),
      coalesce((p_payload->>'utilization_percent')::numeric, 0)
    ) returning id into v_equipment_id;

    perform public._gcpfo404_log_audit(
      v_tenant_id, 'equipment_assigned', 'Equipment registered',
      jsonb_build_object('equipment_id', v_equipment_id)
    );

    return jsonb_build_object('ok', true, 'equipment_id', v_equipment_id);
  end if;

  raise exception 'Unsupported construction action: %', v_action;
end;
$$;

grant execute on function public.get_construction_project_field_operations_center() to authenticated;
grant execute on function public.construction_project_field_operations_action(jsonb) to authenticated;
