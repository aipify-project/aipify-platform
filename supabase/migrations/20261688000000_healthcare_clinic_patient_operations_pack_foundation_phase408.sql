-- Phase 408 — Healthcare, Clinic & Patient Operations Pack Foundation
-- Feature owner: CUSTOMER APP. Route: /app/healthcare. Helpers: _ghcpo408_*
-- Compliance-first healthcare operations — patients, appointments, providers, consent, and governance.
-- Metadata-first design: coordinates operations; does not replace healthcare professionals.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.healthcare_pack_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  facility_type text not null default 'clinic' check (
    facility_type in ('clinic', 'practice', 'treatment_center', 'hospital_adjacent', 'enterprise')
  ),
  health_score integer not null default 70 check (health_score between 0 and 100),
  privacy_controls_enabled boolean not null default true,
  consent_required boolean not null default true,
  strict_access_controls boolean not null default true,
  compliance_status text not null default 'review_due' check (
    compliance_status in ('compliant', 'review_due', 'attention_required', 'critical')
  ),
  industry_pack_install_id uuid references public.tenant_industry_pack_installs (id) on delete set null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.healthcare_patients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  patient_key text not null,
  display_name text not null,
  patient_status text not null default 'new' check (
    patient_status in ('new', 'active', 'under_care', 'follow_up_required', 'inactive', 'archived')
  ),
  satisfaction_score integer check (satisfaction_score between 0 and 100),
  care_plan_count integer not null default 0,
  consent_on_file boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, patient_key)
);

create index if not exists healthcare_patients_tenant_idx
  on public.healthcare_patients (tenant_id, patient_status);

create table if not exists public.healthcare_providers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  provider_key text not null,
  full_name text not null,
  provider_role text not null default 'clinician' check (
    provider_role in ('clinician', 'nurse', 'specialist', 'administrator', 'coordinator', 'other')
  ),
  specialization text not null default '',
  availability_status text not null default 'available' check (
    availability_status in ('available', 'limited', 'at_capacity', 'unavailable')
  ),
  capacity_percent numeric(5, 2) not null default 0 check (capacity_percent between 0 and 100),
  compliance_status text not null default 'compliant' check (
    compliance_status in ('compliant', 'review_due', 'attention_required')
  ),
  performance_score integer not null default 75 check (performance_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, provider_key)
);

create index if not exists healthcare_providers_tenant_idx
  on public.healthcare_providers (tenant_id, availability_status);

create table if not exists public.healthcare_appointments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  appointment_key text not null,
  appointment_type text not null default 'consultation',
  patient_id uuid references public.healthcare_patients (id) on delete set null,
  provider_id uuid references public.healthcare_providers (id) on delete set null,
  location_label text not null default '',
  scheduled_at timestamptz,
  appointment_status text not null default 'scheduled' check (
    appointment_status in (
      'scheduled', 'confirmed', 'checked_in', 'completed',
      'cancelled', 'no_show', 'archived'
    )
  ),
  follow_up_required boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, appointment_key)
);

create index if not exists healthcare_appointments_tenant_idx
  on public.healthcare_appointments (tenant_id, appointment_status, scheduled_at);

create table if not exists public.healthcare_care_plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  care_plan_key text not null,
  plan_title text not null,
  patient_id uuid references public.healthcare_patients (id) on delete set null,
  provider_id uuid references public.healthcare_providers (id) on delete set null,
  plan_status text not null default 'active' check (
    plan_status in ('draft', 'active', 'follow_up', 'completed', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, care_plan_key)
);

create index if not exists healthcare_care_plans_tenant_idx
  on public.healthcare_care_plans (tenant_id, plan_status);

create table if not exists public.healthcare_consent_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  consent_key text not null,
  patient_id uuid references public.healthcare_patients (id) on delete set null,
  consent_type text not null default 'treatment' check (
    consent_type in ('treatment', 'communication', 'data_processing', 'research', 'other')
  ),
  consent_status text not null default 'pending' check (
    consent_status in ('pending', 'granted', 'expired', 'withdrawn')
  ),
  consent_date date,
  expires_at date,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, consent_key)
);

create index if not exists healthcare_consent_records_tenant_idx
  on public.healthcare_consent_records (tenant_id, consent_status);

create table if not exists public.healthcare_access_grants (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  grant_key text not null,
  subject_type text not null check (subject_type in ('provider', 'user', 'department')),
  subject_label text not null,
  access_scope text not null default 'operational_metadata' check (
    access_scope in ('operational_metadata', 'scheduling', 'consent_review', 'compliance_review')
  ),
  grant_status text not null default 'active' check (grant_status in ('active', 'revoked', 'expired')),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  unique (tenant_id, grant_key)
);

create index if not exists healthcare_access_grants_tenant_idx
  on public.healthcare_access_grants (tenant_id, grant_status);

create table if not exists public.healthcare_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'appointment_demand', 'follow_up_review', 'provider_capacity',
      'patient_satisfaction', 'compliance_review', 'provider_capacity_constrained',
      'follow_up_overdue', 'compliance_documentation', 'operational_bottleneck'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists healthcare_advisor_signals_tenant_idx
  on public.healthcare_advisor_signals (tenant_id, created_at desc);

create table if not exists public.healthcare_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'patient_created', 'appointment_created', 'appointment_completed',
      'consent_granted', 'consent_withdrawn', 'provider_added',
      'access_granted', 'access_revoked', 'compliance_review_completed',
      'pack_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists healthcare_audit_logs_tenant_idx
  on public.healthcare_audit_logs (tenant_id, created_at desc);

alter table public.healthcare_pack_settings enable row level security;
alter table public.healthcare_patients enable row level security;
alter table public.healthcare_providers enable row level security;
alter table public.healthcare_appointments enable row level security;
alter table public.healthcare_care_plans enable row level security;
alter table public.healthcare_consent_records enable row level security;
alter table public.healthcare_access_grants enable row level security;
alter table public.healthcare_advisor_signals enable row level security;
alter table public.healthcare_audit_logs enable row level security;

revoke all on public.healthcare_pack_settings from authenticated, anon;
revoke all on public.healthcare_patients from authenticated, anon;
revoke all on public.healthcare_providers from authenticated, anon;
revoke all on public.healthcare_appointments from authenticated, anon;
revoke all on public.healthcare_care_plans from authenticated, anon;
revoke all on public.healthcare_consent_records from authenticated, anon;
revoke all on public.healthcare_access_grants from authenticated, anon;
revoke all on public.healthcare_advisor_signals from authenticated, anon;
revoke all on public.healthcare_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'healthcare_clinic_patient_operations_pack', v.description
from (values
  ('healthcare.view', 'View Healthcare Pack', 'View healthcare operations with governed metadata access only'),
  ('healthcare.manage', 'Manage Healthcare Pack', 'Manage patients, appointments, providers, consent, and compliance settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

update public.industry_pack_registry
set
  short_description = 'Healthcare and clinical operations — patients, appointments, providers, consent, compliance, and care coordination on ABOS with strict governance.',
  lifecycle_status = 'production',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'canonical_route', '/app/healthcare',
    'privacy_first', true,
    'consent_required_default', true,
    'phase', 408
  ),
  updated_at = now()
where pack_key = 'healthcare_pack';

-- ---------------------------------------------------------------------------
-- 2. Helpers — _ghcpo408_*
-- ---------------------------------------------------------------------------
create or replace function public._ghcpo408_require_access()
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
    raise exception 'Healthcare Pack requires an active subscription';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._ghcpo408_log_audit(
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
  insert into public.healthcare_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._ghcpo408_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.healthcare_pack_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.healthcare_pack_settings;
  v_registry_id uuid;
  v_install_id uuid;
begin
  select id into v_registry_id from public.industry_pack_registry where pack_key = 'healthcare_pack' limit 1;

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

  insert into public.healthcare_pack_settings (organization_id, tenant_id, industry_pack_install_id)
  values (p_org_id, p_tenant_id, v_install_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.healthcare_pack_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._ghcpo408_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.healthcare_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.healthcare_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'compliance_review',
      'A compliance review may be recommended for healthcare operations.',
      'Governance gaps increase privacy and regulatory risk.',
      'Open Compliance module and confirm consent, access, and audit controls.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'provider_capacity',
      'Provider capacity indicators should be monitored as appointment demand changes.',
      'Capacity constraints affect patient experience and follow-up timeliness.',
      'Review Provider Operations and scheduling utilization.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'follow_up_review',
      'Follow-up activity may require review across active care plans.',
      'Missed follow-ups can delay continuity of care coordination.',
      'Open Care Operations and confirm follow-up requirements.',
      'moderate', 'high'
    );
end;
$$;

create or replace function public._ghcpo408_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_patients integer := 0;
  v_appointments integer := 0;
  v_providers integer := 0;
  v_care_plans integer := 0;
  v_capacity numeric := 0;
  v_compliance text := 'review_due';
  v_satisfaction numeric := 0;
  v_health numeric := 70;
begin
  select count(*)::int into v_patients
  from public.healthcare_patients
  where tenant_id = p_tenant_id and patient_status != 'archived';

  select count(*)::int into v_appointments
  from public.healthcare_appointments
  where tenant_id = p_tenant_id and appointment_status not in ('archived', 'cancelled');

  select count(*)::int into v_providers
  from public.healthcare_providers where tenant_id = p_tenant_id;

  select count(*)::int into v_care_plans
  from public.healthcare_care_plans
  where tenant_id = p_tenant_id and plan_status != 'archived';

  select case when count(*) > 0 then round(avg(capacity_percent)::numeric, 1) else 0 end
  into v_capacity
  from public.healthcare_providers where tenant_id = p_tenant_id;

  select compliance_status into v_compliance
  from public.healthcare_pack_settings where tenant_id = p_tenant_id;

  select case when count(*) filter (where satisfaction_score is not null) > 0
    then round(avg(satisfaction_score) filter (where satisfaction_score is not null)::numeric, 1)
    else 0 end
  into v_satisfaction
  from public.healthcare_patients where tenant_id = p_tenant_id;

  select coalesce(health_score, 70) into v_health
  from public.healthcare_pack_settings where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'patients', v_patients,
    'appointments', v_appointments,
    'providers', v_providers,
    'care_plans', v_care_plans,
    'operational_capacity', v_capacity,
    'compliance_status', coalesce(v_compliance, 'review_due'),
    'patient_satisfaction', v_satisfaction,
    'healthcare_health_score', round(v_health)::int
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_healthcare_clinic_patient_operations_center()
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
  v_settings public.healthcare_pack_settings;
  v_patients jsonb := '[]'::jsonb;
  v_appointments jsonb := '[]'::jsonb;
  v_providers jsonb := '[]'::jsonb;
  v_care_plans jsonb := '[]'::jsonb;
  v_consents jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('healthcare.view');
  v_ctx := public._ghcpo408_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._ghcpo408_ensure_settings(v_org_id, v_tenant_id);
  perform public._ghcpo408_seed_advisor(v_tenant_id);
  v_overview := public._ghcpo408_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'patient_key', p.patient_key, 'display_name', p.display_name,
    'patient_status', p.patient_status, 'consent_on_file', p.consent_on_file,
    'care_plan_count', p.care_plan_count, 'satisfaction_score', p.satisfaction_score
  ) order by p.display_name), '[]'::jsonb)
  into v_patients
  from public.healthcare_patients p
  where p.tenant_id = v_tenant_id and p.patient_status != 'archived'
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'appointment_key', a.appointment_key, 'appointment_type', a.appointment_type,
    'appointment_status', a.appointment_status, 'scheduled_at', a.scheduled_at,
    'location_label', a.location_label, 'follow_up_required', a.follow_up_required,
    'patient_id', a.patient_id, 'provider_id', a.provider_id
  ) order by a.scheduled_at nulls last), '[]'::jsonb)
  into v_appointments
  from public.healthcare_appointments a
  where a.tenant_id = v_tenant_id and a.appointment_status != 'archived'
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', pr.id, 'provider_key', pr.provider_key, 'full_name', pr.full_name,
    'provider_role', pr.provider_role, 'specialization', pr.specialization,
    'availability_status', pr.availability_status, 'capacity_percent', pr.capacity_percent,
    'compliance_status', pr.compliance_status
  ) order by pr.full_name), '[]'::jsonb)
  into v_providers
  from public.healthcare_providers pr
  where pr.tenant_id = v_tenant_id
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'care_plan_key', c.care_plan_key, 'plan_title', c.plan_title,
    'plan_status', c.plan_status, 'patient_id', c.patient_id, 'provider_id', c.provider_id
  ) order by c.plan_title), '[]'::jsonb)
  into v_care_plans
  from public.healthcare_care_plans c
  where c.tenant_id = v_tenant_id and c.plan_status != 'archived'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'consent_key', c.consent_key, 'consent_type', c.consent_type,
    'consent_status', c.consent_status, 'consent_date', c.consent_date,
    'expires_at', c.expires_at, 'patient_id', c.patient_id
  ) order by c.updated_at desc), '[]'::jsonb)
  into v_consents
  from public.healthcare_consent_records c
  where c.tenant_id = v_tenant_id
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.healthcare_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.healthcare_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Healthcare success begins with patient care, trust, privacy, compliance, and operational excellence.',
    'mission', 'Healthcare & Clinical Operations — coordinate patients, appointments, providers, consent, and compliance.',
    'abos_principle', 'Aipify coordinates operations and governance; healthcare professionals retain clinical decisions.',
    'governance_note', 'Metadata-first operations with consent management, access controls, and immutable audit logging.',
    'industry_packs_route', '/app/industry-packs',
    'distinction_note', 'Technology supports healthcare professionals — better coordination, visibility, governance, and patient experience.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/healthcare'),
      jsonb_build_object('key', 'patients', 'route', '/app/healthcare/patients'),
      jsonb_build_object('key', 'appointments', 'route', '/app/healthcare/appointments'),
      jsonb_build_object('key', 'providers', 'route', '/app/healthcare/providers'),
      jsonb_build_object('key', 'care_operations', 'route', '/app/healthcare/care'),
      jsonb_build_object('key', 'documentation', 'route', '/app/healthcare/documentation'),
      jsonb_build_object('key', 'compliance', 'route', '/app/healthcare/compliance'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/healthcare/intelligence')
    ),
    'patients', v_patients,
    'appointments', v_appointments,
    'providers', v_providers,
    'care_plans', v_care_plans,
    'consent_records', v_consents,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'patients_route', '/app/healthcare/patients',
      'appointments_route', '/app/healthcare/appointments',
      'providers_route', '/app/healthcare/providers',
      'care_route', '/app/healthcare/care',
      'documentation_route', '/app/healthcare/documentation',
      'compliance_route', '/app/healthcare/compliance'
    ),
    'executive_dashboard', jsonb_build_object(
      'patient_volume', v_overview->>'patients',
      'appointment_performance', v_overview->>'appointments',
      'provider_utilization', v_overview->>'operational_capacity',
      'compliance_status', v_overview->>'compliance_status',
      'patient_satisfaction', v_overview->>'patient_satisfaction',
      'healthcare_health_score', v_overview->>'healthcare_health_score',
      'executive_route', '/app/healthcare/intelligence'
    ),
    'privacy_note', 'Strict tenant isolation. Operational metadata only — no clinical record storage without explicit approved integrations. All access audited.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.healthcare_clinic_patient_operations_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_patient_id uuid;
  v_display_name text;
  v_appointment_id uuid;
  v_provider_id uuid;
  v_consent_id uuid;
  v_grant_id uuid;
begin
  perform public._irp_require_permission('healthcare.manage');
  perform public._ghcpo408_require_access();
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  perform public._ghcpo408_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_patient' then
    insert into public.healthcare_patients (
      tenant_id, patient_key, display_name, patient_status
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'patient_key', 'patient-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'display_name', 'New patient'),
      coalesce(p_payload->>'patient_status', 'new')
    ) returning id, display_name into v_patient_id, v_display_name;

    perform public._ghcpo408_log_audit(
      v_tenant_id, 'patient_created', 'Patient record created',
      jsonb_build_object('patient_id', v_patient_id)
    );

    return jsonb_build_object('ok', true, 'patient_id', v_patient_id);
  end if;

  if v_action = 'create_appointment' then
    insert into public.healthcare_appointments (
      tenant_id, appointment_key, appointment_type, patient_id, provider_id,
      location_label, scheduled_at, appointment_status, follow_up_required
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'appointment_key', 'APT-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'appointment_type', 'consultation'),
      nullif(p_payload->>'patient_id', '')::uuid,
      nullif(p_payload->>'provider_id', '')::uuid,
      coalesce(p_payload->>'location_label', ''),
      nullif(p_payload->>'scheduled_at', '')::timestamptz,
      coalesce(p_payload->>'appointment_status', 'scheduled'),
      coalesce((p_payload->>'follow_up_required')::boolean, false)
    ) returning id into v_appointment_id;

    perform public._ghcpo408_log_audit(
      v_tenant_id, 'appointment_created', 'Appointment created',
      jsonb_build_object('appointment_id', v_appointment_id)
    );

    return jsonb_build_object('ok', true, 'appointment_id', v_appointment_id);
  end if;

  if v_action = 'create_provider' then
    insert into public.healthcare_providers (
      tenant_id, provider_key, full_name, provider_role, specialization, availability_status
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'provider_key', 'provider-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'full_name', 'New provider'),
      coalesce(p_payload->>'provider_role', 'clinician'),
      coalesce(p_payload->>'specialization', ''),
      coalesce(p_payload->>'availability_status', 'available')
    ) returning id into v_provider_id;

    perform public._ghcpo408_log_audit(
      v_tenant_id, 'provider_added', 'Provider added',
      jsonb_build_object('provider_id', v_provider_id)
    );

    return jsonb_build_object('ok', true, 'provider_id', v_provider_id);
  end if;

  if v_action = 'grant_consent' then
    insert into public.healthcare_consent_records (
      tenant_id, consent_key, patient_id, consent_type, consent_status, consent_date, expires_at
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'consent_key', 'CON-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      nullif(p_payload->>'patient_id', '')::uuid,
      coalesce(p_payload->>'consent_type', 'treatment'),
      'granted',
      coalesce(nullif(p_payload->>'consent_date', '')::date, current_date),
      nullif(p_payload->>'expires_at', '')::date
    ) returning id into v_consent_id;

    if nullif(p_payload->>'patient_id', '')::uuid is not null then
      update public.healthcare_patients
      set consent_on_file = true, updated_at = now()
      where id = nullif(p_payload->>'patient_id', '')::uuid and tenant_id = v_tenant_id;
    end if;

    perform public._ghcpo408_log_audit(
      v_tenant_id, 'consent_granted', 'Consent granted',
      jsonb_build_object('consent_id', v_consent_id, 'patient_id', p_payload->>'patient_id')
    );

    return jsonb_build_object('ok', true, 'consent_id', v_consent_id);
  end if;

  if v_action = 'withdraw_consent' then
    update public.healthcare_consent_records
    set consent_status = 'withdrawn', updated_at = now()
    where id = nullif(p_payload->>'consent_id', '')::uuid and tenant_id = v_tenant_id
    returning id into v_consent_id;

    perform public._ghcpo408_log_audit(
      v_tenant_id, 'consent_withdrawn', 'Consent withdrawn',
      jsonb_build_object('consent_id', v_consent_id)
    );

    return jsonb_build_object('ok', true, 'consent_id', v_consent_id);
  end if;

  if v_action = 'grant_access' then
    insert into public.healthcare_access_grants (
      tenant_id, grant_key, subject_type, subject_label, access_scope, grant_status
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'grant_key', 'GRANT-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'subject_type', 'provider'),
      coalesce(p_payload->>'subject_label', 'Access grant'),
      coalesce(p_payload->>'access_scope', 'operational_metadata'),
      'active'
    ) returning id into v_grant_id;

    perform public._ghcpo408_log_audit(
      v_tenant_id, 'access_granted', 'Access granted',
      jsonb_build_object('grant_id', v_grant_id)
    );

    return jsonb_build_object('ok', true, 'grant_id', v_grant_id);
  end if;

  if v_action = 'revoke_access' then
    update public.healthcare_access_grants
    set grant_status = 'revoked', revoked_at = now()
    where id = nullif(p_payload->>'grant_id', '')::uuid and tenant_id = v_tenant_id
    returning id into v_grant_id;

    perform public._ghcpo408_log_audit(
      v_tenant_id, 'access_revoked', 'Access revoked',
      jsonb_build_object('grant_id', v_grant_id)
    );

    return jsonb_build_object('ok', true, 'grant_id', v_grant_id);
  end if;

  if v_action = 'complete_compliance_review' then
    update public.healthcare_pack_settings
    set compliance_status = coalesce(p_payload->>'compliance_status', 'compliant'), updated_at = now()
    where tenant_id = v_tenant_id;

    perform public._ghcpo408_log_audit(
      v_tenant_id, 'compliance_review_completed', 'Compliance review completed',
      jsonb_build_object('compliance_status', coalesce(p_payload->>'compliance_status', 'compliant'))
    );

    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unsupported healthcare action: %', v_action;
end;
$$;

grant execute on function public.get_healthcare_clinic_patient_operations_center() to authenticated;
grant execute on function public.healthcare_clinic_patient_operations_action(jsonb) to authenticated;
