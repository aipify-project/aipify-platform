-- Phase 410 — Professional Services, Consulting & Client Delivery Pack Foundation
-- Feature owner: CUSTOMER APP. Route: /app/professional-services. Helpers: _gpsccd410_*
-- Industry Pack home for clients, projects, consultants, delivery, profitability, and client success.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.professional_services_pack_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  firm_type text not null default 'consulting' check (
    firm_type in ('consulting', 'agency', 'accounting', 'advisory', 'implementation', 'enterprise')
  ),
  health_score integer not null default 70 check (health_score between 0 and 100),
  industry_pack_install_id uuid references public.tenant_industry_pack_installs (id) on delete set null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.professional_services_clients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  client_key text not null,
  client_name text not null,
  organization_label text not null default '',
  client_status text not null default 'prospect' check (
    client_status in ('prospect', 'active', 'strategic', 'at_risk', 'inactive', 'archived')
  ),
  health_score integer not null default 70 check (health_score between 0 and 100),
  satisfaction_score integer check (satisfaction_score between 0 and 100),
  revenue_total numeric(14, 2) not null default 0,
  project_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, client_key)
);

create index if not exists professional_services_clients_tenant_idx
  on public.professional_services_clients (tenant_id, client_status);

create table if not exists public.professional_services_consultants (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  consultant_key text not null,
  full_name text not null,
  availability_status text not null default 'available' check (
    availability_status in ('available', 'allocated', 'limited', 'unavailable')
  ),
  utilization_percent numeric(5, 2) not null default 0 check (utilization_percent between 0 and 100),
  performance_score integer not null default 75 check (performance_score between 0 and 100),
  project_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, consultant_key)
);

create index if not exists professional_services_consultants_tenant_idx
  on public.professional_services_consultants (tenant_id, availability_status);

create table if not exists public.professional_services_projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  project_key text not null,
  project_name text not null,
  client_id uuid references public.professional_services_clients (id) on delete set null,
  owner_name text not null default '',
  consultant_id uuid references public.professional_services_consultants (id) on delete set null,
  budget_amount numeric(14, 2) not null default 0,
  revenue_amount numeric(14, 2) not null default 0,
  cost_amount numeric(14, 2) not null default 0,
  gross_margin_percent numeric(5, 2) not null default 0,
  project_status text not null default 'planned' check (
    project_status in (
      'planned', 'approved', 'in_progress', 'awaiting_feedback',
      'completed', 'cancelled', 'archived'
    )
  ),
  satisfaction_score integer check (satisfaction_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, project_key)
);

create index if not exists professional_services_projects_tenant_idx
  on public.professional_services_projects (tenant_id, project_status);

create table if not exists public.professional_services_deliverables (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  deliverable_key text not null,
  deliverable_name text not null,
  project_id uuid references public.professional_services_projects (id) on delete set null,
  deliverable_status text not null default 'pending' check (
    deliverable_status in ('pending', 'in_progress', 'awaiting_approval', 'approved', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, deliverable_key)
);

create index if not exists professional_services_deliverables_tenant_idx
  on public.professional_services_deliverables (tenant_id, deliverable_status);

create table if not exists public.professional_services_expansion_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  opportunity_key text not null,
  client_id uuid references public.professional_services_clients (id) on delete set null,
  opportunity_title text not null,
  opportunity_status text not null default 'identified' check (
    opportunity_status in ('identified', 'qualified', 'pursuing', 'won', 'lost', 'archived')
  ),
  estimated_value numeric(14, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, opportunity_key)
);

create index if not exists professional_services_expansion_opportunities_tenant_idx
  on public.professional_services_expansion_opportunities (tenant_id, opportunity_status);

create table if not exists public.professional_services_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'profitability_declining', 'utilization_increasing', 'satisfaction_improving',
      'capacity_required', 'expansion_identified', 'project_attention',
      'client_health_declining', 'consultant_capacity', 'expansion_available',
      'profitability_review'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists professional_services_advisor_signals_tenant_idx
  on public.professional_services_advisor_signals (tenant_id, created_at desc);

create table if not exists public.professional_services_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'client_created', 'project_created', 'project_updated', 'consultant_assigned',
      'deliverable_approved', 'invoice_generated', 'client_health_updated',
      'expansion_opportunity_created', 'pack_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists professional_services_audit_logs_tenant_idx
  on public.professional_services_audit_logs (tenant_id, created_at desc);

alter table public.professional_services_pack_settings enable row level security;
alter table public.professional_services_clients enable row level security;
alter table public.professional_services_consultants enable row level security;
alter table public.professional_services_projects enable row level security;
alter table public.professional_services_deliverables enable row level security;
alter table public.professional_services_expansion_opportunities enable row level security;
alter table public.professional_services_advisor_signals enable row level security;
alter table public.professional_services_audit_logs enable row level security;

revoke all on public.professional_services_pack_settings from authenticated, anon;
revoke all on public.professional_services_clients from authenticated, anon;
revoke all on public.professional_services_consultants from authenticated, anon;
revoke all on public.professional_services_projects from authenticated, anon;
revoke all on public.professional_services_deliverables from authenticated, anon;
revoke all on public.professional_services_expansion_opportunities from authenticated, anon;
revoke all on public.professional_services_advisor_signals from authenticated, anon;
revoke all on public.professional_services_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'professional_services_consulting_client_delivery_pack', v.description
from (values
  ('professional_services.view', 'View Professional Services Pack', 'View clients, projects, consultants, and service delivery operations'),
  ('professional_services.manage', 'Manage Professional Services Pack', 'Manage clients, projects, consultants, and professional services settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

update public.industry_pack_registry
set
  short_description = 'Professional services operations — clients, projects, consultants, delivery, profitability, utilization, and client success on ABOS.',
  lifecycle_status = 'production',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'canonical_route', '/app/professional-services',
    'phase', 410
  ),
  updated_at = now()
where pack_key = 'professional_services_pack';

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gpsccd410_*
-- ---------------------------------------------------------------------------
create or replace function public._gpsccd410_require_access()
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
    raise exception 'Professional Services Pack requires an active subscription';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._gpsccd410_log_audit(
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
  insert into public.professional_services_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gpsccd410_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.professional_services_pack_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.professional_services_pack_settings;
  v_registry_id uuid;
  v_install_id uuid;
begin
  select id into v_registry_id from public.industry_pack_registry where pack_key = 'professional_services_pack' limit 1;

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

  insert into public.professional_services_pack_settings (organization_id, tenant_id, industry_pack_install_id)
  values (p_org_id, p_tenant_id, v_install_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.professional_services_pack_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._gpsccd410_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.professional_services_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.professional_services_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'utilization_increasing',
      'Consultant utilization indicators may be trending upward.',
      'Higher utilization improves revenue capacity when aligned with profitable projects.',
      'Review Resource Planning and confirm project allocations.',
      'low', 'moderate'
    ),
    (
      p_tenant_id, 'expansion_identified',
      'Expansion opportunities may be available across active client relationships.',
      'Identified expansion supports long-term client success and revenue growth.',
      'Open Client Success module and review relationship health scores.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'profitability_review',
      'Project profitability may benefit from periodic review.',
      'Margin visibility protects service business sustainability.',
      'Review Profitability module and confirm project margins.',
      'moderate', 'high'
    );
end;
$$;

create or replace function public._gpsccd410_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_clients integer := 0;
  v_projects integer := 0;
  v_consultants integer := 0;
  v_revenue numeric := 0;
  v_profitability numeric := 0;
  v_utilization numeric := 0;
  v_satisfaction numeric := 0;
  v_health numeric := 70;
begin
  select count(*)::int into v_clients
  from public.professional_services_clients
  where tenant_id = p_tenant_id and client_status != 'archived';

  select count(*)::int into v_projects
  from public.professional_services_projects
  where tenant_id = p_tenant_id and project_status not in ('completed', 'cancelled', 'archived');

  select count(*)::int into v_consultants
  from public.professional_services_consultants where tenant_id = p_tenant_id;

  select coalesce(sum(revenue_amount), 0), coalesce(avg(gross_margin_percent), 0)
  into v_revenue, v_profitability
  from public.professional_services_projects
  where tenant_id = p_tenant_id and project_status != 'archived';

  select case when count(*) > 0 then round(avg(utilization_percent)::numeric, 1) else 0 end
  into v_utilization
  from public.professional_services_consultants where tenant_id = p_tenant_id;

  select case when count(*) filter (where satisfaction_score is not null) > 0
    then round(avg(satisfaction_score) filter (where satisfaction_score is not null)::numeric, 1)
    else case when count(*) > 0 then round(avg(health_score)::numeric, 1) else 0 end end
  into v_satisfaction
  from public.professional_services_clients where tenant_id = p_tenant_id;

  select coalesce(health_score, 70) into v_health
  from public.professional_services_pack_settings where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'clients', v_clients,
    'projects', v_projects,
    'consultants', v_consultants,
    'revenue', v_revenue,
    'profitability', round(v_profitability, 1),
    'utilization', v_utilization,
    'client_satisfaction', v_satisfaction,
    'services_health_score', round(v_health)::int
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_professional_services_consulting_client_delivery_center()
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
  v_settings public.professional_services_pack_settings;
  v_clients jsonb := '[]'::jsonb;
  v_projects jsonb := '[]'::jsonb;
  v_consultants jsonb := '[]'::jsonb;
  v_deliverables jsonb := '[]'::jsonb;
  v_opportunities jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('professional_services.view');
  v_ctx := public._gpsccd410_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gpsccd410_ensure_settings(v_org_id, v_tenant_id);
  perform public._gpsccd410_seed_advisor(v_tenant_id);
  v_overview := public._gpsccd410_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'client_key', c.client_key, 'client_name', c.client_name,
    'client_status', c.client_status, 'health_score', c.health_score,
    'satisfaction_score', c.satisfaction_score, 'revenue_total', c.revenue_total,
    'project_count', c.project_count
  ) order by c.client_name), '[]'::jsonb)
  into v_clients
  from public.professional_services_clients c
  where c.tenant_id = v_tenant_id and c.client_status != 'archived'
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'project_key', p.project_key, 'project_name', p.project_name,
    'project_status', p.project_status, 'budget_amount', p.budget_amount,
    'revenue_amount', p.revenue_amount, 'gross_margin_percent', p.gross_margin_percent,
    'client_id', p.client_id, 'owner_name', p.owner_name, 'consultant_id', p.consultant_id,
    'satisfaction_score', p.satisfaction_score
  ) order by p.updated_at desc), '[]'::jsonb)
  into v_projects
  from public.professional_services_projects p
  where p.tenant_id = v_tenant_id and p.project_status != 'archived'
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', cn.id, 'consultant_key', cn.consultant_key, 'full_name', cn.full_name,
    'availability_status', cn.availability_status, 'utilization_percent', cn.utilization_percent,
    'performance_score', cn.performance_score, 'project_count', cn.project_count
  ) order by cn.full_name), '[]'::jsonb)
  into v_consultants
  from public.professional_services_consultants cn
  where cn.tenant_id = v_tenant_id
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'deliverable_key', d.deliverable_key, 'deliverable_name', d.deliverable_name,
    'deliverable_status', d.deliverable_status, 'project_id', d.project_id
  ) order by d.updated_at desc), '[]'::jsonb)
  into v_deliverables
  from public.professional_services_deliverables d
  where d.tenant_id = v_tenant_id and d.deliverable_status != 'archived'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'opportunity_key', o.opportunity_key, 'opportunity_title', o.opportunity_title,
    'opportunity_status', o.opportunity_status, 'estimated_value', o.estimated_value,
    'client_id', o.client_id
  ) order by o.updated_at desc), '[]'::jsonb)
  into v_opportunities
  from public.professional_services_expansion_opportunities o
  where o.tenant_id = v_tenant_id and o.opportunity_status != 'archived'
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.professional_services_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.professional_services_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Professional services organizations sell expertise, outcomes, and trust — operational visibility is essential for growth.',
    'mission', 'Professional Services Operating System — clients, projects, consultants, delivery, profitability, and client success.',
    'abos_principle', 'Aipify informs and prepares; service leaders decide. Complete operational visibility for consulting and advisory firms.',
    'industry_packs_route', '/app/industry-packs',
    'distinction_note', 'Unified visibility for clients, projects, profitability, utilization, and long-term relationships.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/professional-services'),
      jsonb_build_object('key', 'clients', 'route', '/app/professional-services/clients'),
      jsonb_build_object('key', 'projects', 'route', '/app/professional-services/projects'),
      jsonb_build_object('key', 'consultants', 'route', '/app/professional-services/consultants'),
      jsonb_build_object('key', 'delivery', 'route', '/app/professional-services/delivery'),
      jsonb_build_object('key', 'profitability', 'route', '/app/professional-services/profitability'),
      jsonb_build_object('key', 'client_success', 'route', '/app/professional-services/client-success'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/professional-services/intelligence')
    ),
    'clients', v_clients,
    'projects', v_projects,
    'consultants', v_consultants,
    'deliverables', v_deliverables,
    'expansion_opportunities', v_opportunities,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'clients_route', '/app/professional-services/clients',
      'projects_route', '/app/professional-services/projects',
      'consultants_route', '/app/professional-services/consultants',
      'delivery_route', '/app/professional-services/delivery',
      'profitability_route', '/app/professional-services/profitability',
      'client_success_route', '/app/professional-services/client-success'
    ),
    'executive_dashboard', jsonb_build_object(
      'revenue', v_overview->>'revenue',
      'profitability', v_overview->>'profitability',
      'utilization', v_overview->>'utilization',
      'client_satisfaction', v_overview->>'client_satisfaction',
      'services_health_score', v_overview->>'services_health_score',
      'executive_route', '/app/professional-services/intelligence'
    ),
    'privacy_note', 'Client and project data isolated per organization — metadata-first intelligence with full audit trail.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.professional_services_consulting_client_delivery_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_client_id uuid;
  v_project_id uuid;
  v_consultant_id uuid;
  v_opportunity_id uuid;
  v_project_name text;
begin
  perform public._irp_require_permission('professional_services.manage');
  perform public._gpsccd410_require_access();
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  perform public._gpsccd410_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_client' then
    insert into public.professional_services_clients (
      tenant_id, client_key, client_name, organization_label, client_status, health_score
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'client_key', 'client-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'client_name', 'New client'),
      coalesce(p_payload->>'organization_label', ''),
      coalesce(p_payload->>'client_status', 'prospect'),
      coalesce((p_payload->>'health_score')::int, 70)
    ) returning id into v_client_id;

    perform public._gpsccd410_log_audit(
      v_tenant_id, 'client_created', 'Client created',
      jsonb_build_object('client_id', v_client_id)
    );

    return jsonb_build_object('ok', true, 'client_id', v_client_id);
  end if;

  if v_action = 'create_project' then
    insert into public.professional_services_projects (
      tenant_id, project_key, project_name, client_id, owner_name, consultant_id,
      budget_amount, revenue_amount, cost_amount, gross_margin_percent, project_status
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'project_key', 'project-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'project_name', 'New project'),
      nullif(p_payload->>'client_id', '')::uuid,
      coalesce(p_payload->>'owner_name', ''),
      nullif(p_payload->>'consultant_id', '')::uuid,
      coalesce((p_payload->>'budget_amount')::numeric, 0),
      coalesce((p_payload->>'revenue_amount')::numeric, 0),
      coalesce((p_payload->>'cost_amount')::numeric, 0),
      coalesce((p_payload->>'gross_margin_percent')::numeric, 0),
      coalesce(p_payload->>'project_status', 'planned')
    ) returning id, project_name into v_project_id, v_project_name;

    perform public._gpsccd410_log_audit(
      v_tenant_id, 'project_created', 'Project created: ' || v_project_name,
      jsonb_build_object('project_id', v_project_id)
    );

    return jsonb_build_object('ok', true, 'project_id', v_project_id);
  end if;

  if v_action = 'create_consultant' then
    insert into public.professional_services_consultants (
      tenant_id, consultant_key, full_name, availability_status, utilization_percent
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'consultant_key', 'consultant-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'full_name', 'New consultant'),
      coalesce(p_payload->>'availability_status', 'available'),
      coalesce((p_payload->>'utilization_percent')::numeric, 0)
    ) returning id into v_consultant_id;

    perform public._gpsccd410_log_audit(
      v_tenant_id, 'consultant_assigned', 'Consultant added',
      jsonb_build_object('consultant_id', v_consultant_id)
    );

    return jsonb_build_object('ok', true, 'consultant_id', v_consultant_id);
  end if;

  if v_action = 'assign_consultant' then
    update public.professional_services_projects
    set consultant_id = nullif(p_payload->>'consultant_id', '')::uuid, updated_at = now()
    where id = nullif(p_payload->>'project_id', '')::uuid and tenant_id = v_tenant_id;

    perform public._gpsccd410_log_audit(
      v_tenant_id, 'consultant_assigned', 'Consultant assigned to project',
      jsonb_build_object('project_id', p_payload->>'project_id', 'consultant_id', p_payload->>'consultant_id')
    );

    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'update_client_health' then
    update public.professional_services_clients
    set
      health_score = coalesce((p_payload->>'health_score')::int, health_score),
      satisfaction_score = coalesce((p_payload->>'satisfaction_score')::int, satisfaction_score),
      updated_at = now()
    where id = nullif(p_payload->>'client_id', '')::uuid and tenant_id = v_tenant_id
    returning id into v_client_id;

    perform public._gpsccd410_log_audit(
      v_tenant_id, 'client_health_updated', 'Client health updated',
      jsonb_build_object('client_id', v_client_id)
    );

    return jsonb_build_object('ok', true, 'client_id', v_client_id);
  end if;

  if v_action = 'create_expansion_opportunity' then
    insert into public.professional_services_expansion_opportunities (
      tenant_id, opportunity_key, client_id, opportunity_title, estimated_value
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'opportunity_key', 'OPP-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      nullif(p_payload->>'client_id', '')::uuid,
      coalesce(p_payload->>'opportunity_title', 'Expansion opportunity'),
      coalesce((p_payload->>'estimated_value')::numeric, 0)
    ) returning id into v_opportunity_id;

    perform public._gpsccd410_log_audit(
      v_tenant_id, 'expansion_opportunity_created', 'Expansion opportunity created',
      jsonb_build_object('opportunity_id', v_opportunity_id)
    );

    return jsonb_build_object('ok', true, 'opportunity_id', v_opportunity_id);
  end if;

  raise exception 'Unsupported professional services action: %', v_action;
end;
$$;

grant execute on function public.get_professional_services_consulting_client_delivery_center() to authenticated;
grant execute on function public.professional_services_consulting_client_delivery_action(jsonb) to authenticated;
