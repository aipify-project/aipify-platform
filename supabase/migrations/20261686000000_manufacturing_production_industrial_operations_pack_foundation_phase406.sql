-- Phase 406 — Manufacturing, Production & Industrial Operations Pack Foundation
-- Feature owner: CUSTOMER APP. Route: /app/manufacturing. Helpers: _gmpio406_*
-- Industry Pack home for production planning, work orders, materials, quality, and capacity.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.manufacturing_pack_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  facility_type text not null default 'factory' check (
    facility_type in ('factory', 'assembly', 'processing', 'mixed', 'enterprise')
  ),
  health_score integer not null default 70 check (health_score between 0 and 100),
  industry_pack_install_id uuid references public.tenant_industry_pack_installs (id) on delete set null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.manufacturing_work_orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  work_order_key text not null,
  product_name text not null,
  quantity numeric(14, 2) not null default 1,
  production_line_id uuid,
  work_order_status text not null default 'planned' check (
    work_order_status in (
      'planned', 'approved', 'in_production', 'paused',
      'delayed', 'completed', 'cancelled', 'archived'
    )
  ),
  priority text not null default 'normal' check (
    priority in ('low', 'normal', 'high', 'critical')
  ),
  start_date date,
  completion_date date,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, work_order_key)
);

create index if not exists manufacturing_work_orders_tenant_idx
  on public.manufacturing_work_orders (tenant_id, work_order_status);

create table if not exists public.manufacturing_production_lines (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  line_key text not null,
  line_name text not null,
  capacity_units numeric(14, 2) not null default 0,
  output_units numeric(14, 2) not null default 0,
  utilization_percent numeric(5, 2) not null default 0 check (utilization_percent between 0 and 100),
  downtime_hours numeric(10, 2) not null default 0,
  quality_score integer not null default 75 check (quality_score between 0 and 100),
  maintenance_status text not null default 'operational' check (
    maintenance_status in ('operational', 'scheduled', 'maintenance', 'inspection_due', 'offline')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, line_key)
);

create index if not exists manufacturing_production_lines_tenant_idx
  on public.manufacturing_production_lines (tenant_id, maintenance_status);

alter table public.manufacturing_work_orders
  drop constraint if exists manufacturing_work_orders_production_line_id_fkey;

alter table public.manufacturing_work_orders
  add constraint manufacturing_work_orders_production_line_id_fkey
  foreign key (production_line_id) references public.manufacturing_production_lines (id) on delete set null;

create table if not exists public.manufacturing_materials (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  material_key text not null,
  material_name text not null,
  material_type text not null default 'raw' check (
    material_type in ('raw', 'component', 'subassembly', 'finished_good')
  ),
  inventory_quantity numeric(14, 2) not null default 0,
  consumption_rate numeric(10, 4) not null default 0,
  material_cost numeric(14, 2) not null default 0,
  availability_status text not null default 'available' check (
    availability_status in ('available', 'low', 'shortage', 'unavailable')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, material_key)
);

create index if not exists manufacturing_materials_tenant_idx
  on public.manufacturing_materials (tenant_id, availability_status);

create table if not exists public.manufacturing_quality_inspections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  inspection_key text not null,
  product_name text not null default '',
  work_order_id uuid references public.manufacturing_work_orders (id) on delete set null,
  quality_status text not null default 'under_review' check (
    quality_status in (
      'passed', 'failed', 'under_review',
      'corrective_action_required', 'rejected', 'approved'
    )
  ),
  defect_count integer not null default 0,
  severity text not null default 'low' check (
    severity in ('low', 'moderate', 'high', 'critical')
  ),
  root_cause text not null default '',
  financial_impact numeric(14, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, inspection_key)
);

create index if not exists manufacturing_quality_inspections_tenant_idx
  on public.manufacturing_quality_inspections (tenant_id, quality_status);

create table if not exists public.manufacturing_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'capacity_constrained', 'material_shortages', 'quality_improving',
      'downtime_increasing', 'additional_shifts_required',
      'material_shortages_attention', 'production_targets_at_risk',
      'capacity_expansion', 'maintenance_overdue'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists manufacturing_advisor_signals_tenant_idx
  on public.manufacturing_advisor_signals (tenant_id, created_at desc);

create table if not exists public.manufacturing_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'work_order_created', 'work_order_updated', 'production_started',
      'production_completed', 'quality_inspection_completed', 'defect_recorded',
      'material_consumed', 'capacity_forecast_generated', 'pack_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists manufacturing_audit_logs_tenant_idx
  on public.manufacturing_audit_logs (tenant_id, created_at desc);

alter table public.manufacturing_pack_settings enable row level security;
alter table public.manufacturing_work_orders enable row level security;
alter table public.manufacturing_production_lines enable row level security;
alter table public.manufacturing_materials enable row level security;
alter table public.manufacturing_quality_inspections enable row level security;
alter table public.manufacturing_advisor_signals enable row level security;
alter table public.manufacturing_audit_logs enable row level security;

revoke all on public.manufacturing_pack_settings from authenticated, anon;
revoke all on public.manufacturing_work_orders from authenticated, anon;
revoke all on public.manufacturing_production_lines from authenticated, anon;
revoke all on public.manufacturing_materials from authenticated, anon;
revoke all on public.manufacturing_quality_inspections from authenticated, anon;
revoke all on public.manufacturing_advisor_signals from authenticated, anon;
revoke all on public.manufacturing_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'manufacturing_production_industrial_operations_pack', v.description
from (values
  ('manufacturing.view', 'View Manufacturing Pack', 'View production, work orders, materials, quality, and capacity operations'),
  ('manufacturing.manage', 'Manage Manufacturing Pack', 'Manage work orders, materials, production lines, and manufacturing settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

update public.industry_pack_registry
set
  short_description = 'Manufacturing and production operations — work orders, materials, quality control, capacity, and industrial performance on ABOS.',
  lifecycle_status = 'production',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'canonical_route', '/app/manufacturing',
    'phase', 406
  ),
  updated_at = now()
where pack_key = 'manufacturing_pack';

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gmpio406_*
-- ---------------------------------------------------------------------------
create or replace function public._gmpio406_require_access()
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
    raise exception 'Manufacturing Pack requires an active subscription';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._gmpio406_log_audit(
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
  insert into public.manufacturing_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gmpio406_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.manufacturing_pack_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.manufacturing_pack_settings;
  v_registry_id uuid;
  v_install_id uuid;
begin
  select id into v_registry_id from public.industry_pack_registry where pack_key = 'manufacturing_pack' limit 1;

  if v_registry_id is not null then
    insert into public.tenant_industry_pack_installs (
      organization_id, registry_id, install_status, install_mode, health_score
    )
    select p_org_id, v_registry_id, 'active', 'guided', 73
    where not exists (
      select 1 from public.tenant_industry_pack_installs
      where organization_id = p_org_id and registry_id = v_registry_id and install_status != 'removed'
    );
  end if;

  select id into v_install_id
  from public.tenant_industry_pack_installs
  where organization_id = p_org_id and registry_id = v_registry_id and install_status = 'active'
  limit 1;

  insert into public.manufacturing_pack_settings (organization_id, tenant_id, industry_pack_install_id)
  values (p_org_id, p_tenant_id, v_install_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.manufacturing_pack_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._gmpio406_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.manufacturing_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.manufacturing_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'capacity_constrained',
      'Production capacity may be constrained across active lines.',
      'Constrained capacity delays work orders and increases overtime costs.',
      'Review Production Planning and confirm capacity targets against scheduled output.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'quality_improving',
      'Quality performance indicators are trending positively.',
      'Improved quality reduces rework and protects customer delivery commitments.',
      'Document successful inspection practices in Knowledge Center.',
      'low', 'moderate'
    ),
    (
      p_tenant_id, 'maintenance_overdue',
      'Equipment maintenance schedules may require attention.',
      'Overdue maintenance increases downtime and quality risk.',
      'Open Equipment module and confirm maintenance and inspection status.',
      'moderate', 'high'
    );
end;
$$;

create or replace function public._gmpio406_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_orders integer := 0;
  v_output numeric := 0;
  v_capacity numeric := 0;
  v_utilized numeric := 0;
  v_materials_available numeric := 0;
  v_materials_total integer := 0;
  v_quality_score numeric := 0;
  v_equipment_available numeric := 0;
  v_lines_total integer := 0;
  v_health numeric := 70;
begin
  select count(*)::int into v_orders
  from public.manufacturing_work_orders
  where tenant_id = p_tenant_id and work_order_status not in ('completed', 'cancelled', 'archived');

  select coalesce(sum(output_units), 0), coalesce(sum(capacity_units), 0), coalesce(avg(utilization_percent), 0)
  into v_output, v_capacity, v_utilized
  from public.manufacturing_production_lines
  where tenant_id = p_tenant_id and maintenance_status != 'offline';

  select count(*)::int,
    case when count(*) > 0
      then round(count(*) filter (where availability_status = 'available')::numeric / count(*)::numeric * 100, 1)
      else 0 end
  into v_materials_total, v_materials_available
  from public.manufacturing_materials where tenant_id = p_tenant_id;

  select case when count(*) > 0
    then round(avg(quality_score)::numeric, 1)
    else 75 end
  into v_quality_score
  from public.manufacturing_production_lines where tenant_id = p_tenant_id;

  select count(*)::int,
    case when count(*) > 0
      then round(count(*) filter (where maintenance_status = 'operational')::numeric / count(*)::numeric * 100, 1)
      else 0 end
  into v_lines_total, v_equipment_available
  from public.manufacturing_production_lines where tenant_id = p_tenant_id;

  select coalesce(health_score, 70) into v_health
  from public.manufacturing_pack_settings where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'production_orders', v_orders,
    'production_output', v_output,
    'production_capacity', v_capacity,
    'capacity_utilization', round(v_utilized, 1),
    'material_availability', v_materials_available,
    'materials_tracked', v_materials_total,
    'quality_score', v_quality_score,
    'equipment_availability', v_equipment_available,
    'production_lines', v_lines_total,
    'manufacturing_health_score', round(v_health)::int
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_manufacturing_production_industrial_operations_center()
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
  v_settings public.manufacturing_pack_settings;
  v_work_orders jsonb := '[]'::jsonb;
  v_materials jsonb := '[]'::jsonb;
  v_lines jsonb := '[]'::jsonb;
  v_inspections jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('manufacturing.view');
  v_ctx := public._gmpio406_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gmpio406_ensure_settings(v_org_id, v_tenant_id);
  perform public._gmpio406_seed_advisor(v_tenant_id);
  v_overview := public._gmpio406_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id, 'work_order_key', w.work_order_key, 'product_name', w.product_name,
    'quantity', w.quantity, 'work_order_status', w.work_order_status,
    'priority', w.priority, 'production_line_id', w.production_line_id,
    'start_date', w.start_date, 'completion_date', w.completion_date
  ) order by w.updated_at desc), '[]'::jsonb)
  into v_work_orders
  from public.manufacturing_work_orders w
  where w.tenant_id = v_tenant_id and w.work_order_status != 'archived'
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'material_key', m.material_key, 'material_name', m.material_name,
    'material_type', m.material_type, 'inventory_quantity', m.inventory_quantity,
    'consumption_rate', m.consumption_rate, 'material_cost', m.material_cost,
    'availability_status', m.availability_status
  ) order by m.material_name), '[]'::jsonb)
  into v_materials
  from public.manufacturing_materials m
  where m.tenant_id = v_tenant_id
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'line_key', l.line_key, 'line_name', l.line_name,
    'capacity_units', l.capacity_units, 'output_units', l.output_units,
    'utilization_percent', l.utilization_percent, 'downtime_hours', l.downtime_hours,
    'quality_score', l.quality_score, 'maintenance_status', l.maintenance_status
  ) order by l.line_name), '[]'::jsonb)
  into v_lines
  from public.manufacturing_production_lines l
  where l.tenant_id = v_tenant_id
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', q.id, 'inspection_key', q.inspection_key, 'product_name', q.product_name,
    'quality_status', q.quality_status, 'defect_count', q.defect_count,
    'severity', q.severity, 'work_order_id', q.work_order_id
  ) order by q.updated_at desc), '[]'::jsonb)
  into v_inspections
  from public.manufacturing_quality_inspections q
  where q.tenant_id = v_tenant_id
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.manufacturing_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.manufacturing_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Manufacturing success depends on planning, execution, quality, efficiency, and continuous improvement.',
    'mission', 'Manufacturing & Production Operating System — production planning, work orders, materials, quality, and capacity.',
    'abos_principle', 'Aipify informs and prepares; operators decide. Industrial-grade production visibility on unified ABOS foundation.',
    'industry_packs_route', '/app/industry-packs',
    'distinction_note', 'Unified manufacturing operations for factories, production facilities, and industrial companies.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/manufacturing'),
      jsonb_build_object('key', 'planning', 'route', '/app/manufacturing/planning'),
      jsonb_build_object('key', 'work_orders', 'route', '/app/manufacturing/work-orders'),
      jsonb_build_object('key', 'materials', 'route', '/app/manufacturing/materials'),
      jsonb_build_object('key', 'quality', 'route', '/app/manufacturing/quality'),
      jsonb_build_object('key', 'equipment', 'route', '/app/manufacturing/equipment'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/manufacturing/intelligence'),
      jsonb_build_object('key', 'governance', 'route', '/app/manufacturing/governance')
    ),
    'work_orders', v_work_orders,
    'materials', v_materials,
    'production_lines', v_lines,
    'quality_inspections', v_inspections,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'planning_route', '/app/manufacturing/planning',
      'work_orders_route', '/app/manufacturing/work-orders',
      'materials_route', '/app/manufacturing/materials',
      'quality_route', '/app/manufacturing/quality',
      'equipment_route', '/app/manufacturing/equipment'
    ),
    'executive_dashboard', jsonb_build_object(
      'production_output', v_overview->>'production_output',
      'capacity_utilization', v_overview->>'capacity_utilization',
      'quality_score', v_overview->>'quality_score',
      'equipment_availability', v_overview->>'equipment_availability',
      'manufacturing_health_score', v_overview->>'manufacturing_health_score',
      'executive_route', '/app/manufacturing/intelligence'
    ),
    'privacy_note', 'Production, quality, and material data isolated per organization — metadata-first intelligence only.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.manufacturing_production_industrial_operations_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_work_order_id uuid;
  v_product_name text;
  v_material_id uuid;
  v_line_id uuid;
  v_inspection_id uuid;
begin
  perform public._irp_require_permission('manufacturing.manage');
  perform public._gmpio406_require_access();
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  perform public._gmpio406_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_work_order' then
    insert into public.manufacturing_work_orders (
      tenant_id, work_order_key, product_name, quantity, work_order_status, priority,
      production_line_id, start_date
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'work_order_key', 'WO-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'product_name', 'New product'),
      coalesce((p_payload->>'quantity')::numeric, 1),
      coalesce(p_payload->>'work_order_status', 'planned'),
      coalesce(p_payload->>'priority', 'normal'),
      nullif(p_payload->>'production_line_id', '')::uuid,
      nullif(p_payload->>'start_date', '')::date
    ) returning id, product_name into v_work_order_id, v_product_name;

    perform public._gmpio406_log_audit(
      v_tenant_id, 'work_order_created', 'Work order created: ' || v_product_name,
      jsonb_build_object('work_order_id', v_work_order_id)
    );

    return jsonb_build_object('ok', true, 'work_order_id', v_work_order_id);
  end if;

  if v_action = 'create_material' then
    insert into public.manufacturing_materials (
      tenant_id, material_key, material_name, material_type,
      inventory_quantity, consumption_rate, material_cost, availability_status
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'material_key', 'mat-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'material_name', 'New material'),
      coalesce(p_payload->>'material_type', 'raw'),
      coalesce((p_payload->>'inventory_quantity')::numeric, 0),
      coalesce((p_payload->>'consumption_rate')::numeric, 0),
      coalesce((p_payload->>'material_cost')::numeric, 0),
      coalesce(p_payload->>'availability_status', 'available')
    ) returning id into v_material_id;

    perform public._gmpio406_log_audit(
      v_tenant_id, 'material_consumed', 'Material record created',
      jsonb_build_object('material_id', v_material_id)
    );

    return jsonb_build_object('ok', true, 'material_id', v_material_id);
  end if;

  if v_action = 'create_production_line' then
    insert into public.manufacturing_production_lines (
      tenant_id, line_key, line_name, capacity_units, output_units, maintenance_status
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'line_key', 'line-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'line_name', 'New production line'),
      coalesce((p_payload->>'capacity_units')::numeric, 0),
      coalesce((p_payload->>'output_units')::numeric, 0),
      coalesce(p_payload->>'maintenance_status', 'operational')
    ) returning id into v_line_id;

    perform public._gmpio406_log_audit(
      v_tenant_id, 'capacity_forecast_generated', 'Production line created',
      jsonb_build_object('production_line_id', v_line_id)
    );

    return jsonb_build_object('ok', true, 'production_line_id', v_line_id);
  end if;

  if v_action = 'create_quality_inspection' then
    insert into public.manufacturing_quality_inspections (
      tenant_id, inspection_key, product_name, work_order_id,
      quality_status, defect_count, severity
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'inspection_key', 'QC-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'product_name', ''),
      nullif(p_payload->>'work_order_id', '')::uuid,
      coalesce(p_payload->>'quality_status', 'under_review'),
      coalesce((p_payload->>'defect_count')::int, 0),
      coalesce(p_payload->>'severity', 'low')
    ) returning id into v_inspection_id;

    perform public._gmpio406_log_audit(
      v_tenant_id, 'quality_inspection_completed', 'Quality inspection recorded',
      jsonb_build_object('inspection_id', v_inspection_id)
    );

    return jsonb_build_object('ok', true, 'inspection_id', v_inspection_id);
  end if;

  raise exception 'Unsupported manufacturing action: %', v_action;
end;
$$;

grant execute on function public.get_manufacturing_production_industrial_operations_center() to authenticated;
grant execute on function public.manufacturing_production_industrial_operations_action(jsonb) to authenticated;
