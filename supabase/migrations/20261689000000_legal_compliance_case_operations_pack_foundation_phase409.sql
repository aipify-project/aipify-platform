-- Phase 409 — Legal, Compliance & Case Operations Pack Foundation
-- Feature owner: CUSTOMER APP. Route: /app/legal. Helpers: _glcco409_*
-- Confidentiality-first legal operations — cases, clients, contracts, compliance, and governance.
-- Aipify supports legal professionals; Aipify does not provide legal advice.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.legal_pack_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  practice_type text not null default 'law_firm' check (
    practice_type in ('law_firm', 'legal_department', 'compliance_team', 'advisory', 'enterprise')
  ),
  health_score integer not null default 70 check (health_score between 0 and 100),
  confidentiality_mode boolean not null default true,
  document_governance_enabled boolean not null default true,
  strict_access_controls boolean not null default true,
  compliance_status text not null default 'review_due' check (
    compliance_status in ('compliant', 'review_due', 'attention_required', 'critical')
  ),
  industry_pack_install_id uuid references public.tenant_industry_pack_installs (id) on delete set null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_clients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  client_key text not null,
  client_name text not null,
  organization_label text not null default '',
  compliance_status text not null default 'review_due' check (
    compliance_status in ('compliant', 'review_due', 'attention_required')
  ),
  case_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, client_key)
);

create index if not exists legal_clients_tenant_idx
  on public.legal_clients (tenant_id);

create table if not exists public.legal_cases (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  case_key text not null,
  case_number text not null,
  case_type text not null default 'contract_review' check (
    case_type in (
      'contract_review', 'corporate_law', 'employment_law', 'compliance',
      'litigation_support', 'property_matters', 'regulatory_matters', 'custom'
    )
  ),
  case_title text not null,
  client_id uuid references public.legal_clients (id) on delete set null,
  assigned_team text not null default '',
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'critical')),
  case_status text not null default 'open' check (
    case_status in (
      'open', 'in_review', 'awaiting_action', 'pending_response',
      'completed', 'closed', 'archived'
    )
  ),
  deadline_at timestamptz,
  risk_level text not null default 'low' check (risk_level in ('low', 'moderate', 'high', 'critical')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, case_key)
);

create index if not exists legal_cases_tenant_idx
  on public.legal_cases (tenant_id, case_status);

create table if not exists public.legal_contracts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  contract_key text not null,
  contract_name text not null,
  parties_label text not null default '',
  client_id uuid references public.legal_clients (id) on delete set null,
  contract_status text not null default 'draft' check (
    contract_status in (
      'draft', 'under_review', 'approved', 'active',
      'renewal_due', 'expired', 'archived'
    )
  ),
  effective_date date,
  renewal_date date,
  expiration_date date,
  risk_status text not null default 'low' check (risk_status in ('low', 'moderate', 'high', 'critical')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, contract_key)
);

create index if not exists legal_contracts_tenant_idx
  on public.legal_contracts (tenant_id, contract_status);

create table if not exists public.legal_compliance_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_title text not null,
  review_type text not null default 'regulatory' check (
    review_type in ('regulatory', 'policy', 'audit', 'program', 'other')
  ),
  review_status text not null default 'pending' check (
    review_status in ('pending', 'in_progress', 'completed', 'overdue', 'archived')
  ),
  findings_count integer not null default 0,
  due_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists legal_compliance_reviews_tenant_idx
  on public.legal_compliance_reviews (tenant_id, review_status);

create table if not exists public.legal_deadlines (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  deadline_key text not null,
  deadline_title text not null,
  deadline_type text not null default 'case_milestone' check (
    deadline_type in (
      'filing', 'review', 'renewal', 'compliance', 'contract_expiration', 'case_milestone'
    )
  ),
  case_id uuid references public.legal_cases (id) on delete set null,
  contract_id uuid references public.legal_contracts (id) on delete set null,
  due_at timestamptz not null,
  deadline_status text not null default 'upcoming' check (
    deadline_status in ('upcoming', 'due_soon', 'overdue', 'completed', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, deadline_key)
);

create index if not exists legal_deadlines_tenant_idx
  on public.legal_deadlines (tenant_id, due_at);

create table if not exists public.legal_access_grants (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  grant_key text not null,
  subject_type text not null check (subject_type in ('user', 'team', 'role')),
  subject_label text not null,
  access_scope text not null default 'case_metadata' check (
    access_scope in ('case_metadata', 'contract_metadata', 'compliance_review', 'document_governance')
  ),
  grant_status text not null default 'active' check (grant_status in ('active', 'revoked', 'expired')),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  unique (tenant_id, grant_key)
);

create index if not exists legal_access_grants_tenant_idx
  on public.legal_access_grants (tenant_id, grant_status);

create table if not exists public.legal_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'contract_renewal', 'compliance_overdue', 'case_deadline',
      'document_approval', 'risk_exposure', 'contract_renewal_approaching',
      'compliance_review_attention', 'deadline_approaching', 'approval_pending',
      'risk_review'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists legal_advisor_signals_tenant_idx
  on public.legal_advisor_signals (tenant_id, created_at desc);

create table if not exists public.legal_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'case_created', 'case_updated', 'contract_created', 'contract_approved',
      'document_uploaded', 'document_approved', 'compliance_review_completed',
      'risk_assessment_updated', 'access_granted', 'access_revoked', 'pack_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists legal_audit_logs_tenant_idx
  on public.legal_audit_logs (tenant_id, created_at desc);

alter table public.legal_pack_settings enable row level security;
alter table public.legal_clients enable row level security;
alter table public.legal_cases enable row level security;
alter table public.legal_contracts enable row level security;
alter table public.legal_compliance_reviews enable row level security;
alter table public.legal_deadlines enable row level security;
alter table public.legal_access_grants enable row level security;
alter table public.legal_advisor_signals enable row level security;
alter table public.legal_audit_logs enable row level security;

revoke all on public.legal_pack_settings from authenticated, anon;
revoke all on public.legal_clients from authenticated, anon;
revoke all on public.legal_cases from authenticated, anon;
revoke all on public.legal_contracts from authenticated, anon;
revoke all on public.legal_compliance_reviews from authenticated, anon;
revoke all on public.legal_deadlines from authenticated, anon;
revoke all on public.legal_access_grants from authenticated, anon;
revoke all on public.legal_advisor_signals from authenticated, anon;
revoke all on public.legal_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'legal_compliance_case_operations_pack', v.description
from (values
  ('legal.view', 'View Legal Pack', 'View legal operations with governed confidentiality and metadata access only'),
  ('legal.manage', 'Manage Legal Pack', 'Manage cases, clients, contracts, compliance reviews, and legal settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

update public.industry_pack_registry
set
  short_description = 'Legal and compliance operations — cases, clients, contracts, document governance, deadlines, and risk on ABOS with strict confidentiality.',
  lifecycle_status = 'production',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'canonical_route', '/app/legal',
    'confidentiality_first', true,
    'not_legal_advice', true,
    'phase', 409
  ),
  updated_at = now()
where pack_key = 'legal_pack';

-- ---------------------------------------------------------------------------
-- 2. Helpers — _glcco409_*
-- ---------------------------------------------------------------------------
create or replace function public._glcco409_require_access()
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
    raise exception 'Legal Pack requires an active subscription';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._glcco409_log_audit(
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
  insert into public.legal_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._glcco409_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.legal_pack_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.legal_pack_settings;
  v_registry_id uuid;
  v_install_id uuid;
begin
  select id into v_registry_id from public.industry_pack_registry where pack_key = 'legal_pack' limit 1;

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

  insert into public.legal_pack_settings (organization_id, tenant_id, industry_pack_install_id)
  values (p_org_id, p_tenant_id, v_install_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.legal_pack_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._glcco409_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.legal_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.legal_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'compliance_overdue',
      'Compliance reviews may be overdue or due for attention.',
      'Delayed reviews increase regulatory and operational risk.',
      'Open Compliance module and confirm review schedules and findings.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'contract_renewal',
      'Several contracts may require renewal attention.',
      'Missed renewals create contract exposure and continuity risk.',
      'Review Contracts module and confirm renewal and expiration dates.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'case_deadline',
      'Case deadlines may be approaching across active matters.',
      'Missed deadlines affect accountability and client trust.',
      'Open Cases module and confirm milestone and filing deadlines.',
      'moderate', 'high'
    );
end;
$$;

create or replace function public._glcco409_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_cases integer := 0;
  v_clients integer := 0;
  v_contracts integer := 0;
  v_reviews integer := 0;
  v_deadlines integer := 0;
  v_doc_activity integer := 0;
  v_health numeric := 70;
  v_compliance text := 'review_due';
begin
  select count(*)::int into v_cases
  from public.legal_cases
  where tenant_id = p_tenant_id and case_status not in ('closed', 'archived');

  select count(*)::int into v_clients
  from public.legal_clients where tenant_id = p_tenant_id;

  select count(*)::int into v_contracts
  from public.legal_contracts
  where tenant_id = p_tenant_id and contract_status not in ('archived', 'expired');

  select count(*)::int into v_reviews
  from public.legal_compliance_reviews
  where tenant_id = p_tenant_id and review_status not in ('completed', 'archived');

  select count(*)::int into v_deadlines
  from public.legal_deadlines
  where tenant_id = p_tenant_id
    and deadline_status in ('upcoming', 'due_soon', 'overdue')
    and due_at >= now() - interval '7 days'
    and due_at <= now() + interval '30 days';

  select count(*)::int into v_doc_activity
  from public.legal_audit_logs
  where tenant_id = p_tenant_id
    and event_type in ('document_uploaded', 'document_approved')
    and created_at >= now() - interval '30 days';

  select coalesce(health_score, 70), compliance_status
  into v_health, v_compliance
  from public.legal_pack_settings where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'active_cases', v_cases,
    'clients', v_clients,
    'contracts', v_contracts,
    'compliance_reviews', v_reviews,
    'upcoming_deadlines', v_deadlines,
    'document_activity', v_doc_activity,
    'compliance_status', coalesce(v_compliance, 'review_due'),
    'legal_health_score', round(v_health)::int
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_legal_compliance_case_operations_center()
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
  v_settings public.legal_pack_settings;
  v_cases jsonb := '[]'::jsonb;
  v_clients jsonb := '[]'::jsonb;
  v_contracts jsonb := '[]'::jsonb;
  v_reviews jsonb := '[]'::jsonb;
  v_deadlines jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('legal.view');
  v_ctx := public._glcco409_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._glcco409_ensure_settings(v_org_id, v_tenant_id);
  perform public._glcco409_seed_advisor(v_tenant_id);
  v_overview := public._glcco409_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'case_key', c.case_key, 'case_number', c.case_number,
    'case_title', c.case_title, 'case_type', c.case_type, 'case_status', c.case_status,
    'priority', c.priority, 'risk_level', c.risk_level, 'deadline_at', c.deadline_at,
    'client_id', c.client_id, 'assigned_team', c.assigned_team
  ) order by c.updated_at desc), '[]'::jsonb)
  into v_cases
  from public.legal_cases c
  where c.tenant_id = v_tenant_id and c.case_status != 'archived'
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', cl.id, 'client_key', cl.client_key, 'client_name', cl.client_name,
    'organization_label', cl.organization_label, 'compliance_status', cl.compliance_status,
    'case_count', cl.case_count
  ) order by cl.client_name), '[]'::jsonb)
  into v_clients
  from public.legal_clients cl
  where cl.tenant_id = v_tenant_id
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ct.id, 'contract_key', ct.contract_key, 'contract_name', ct.contract_name,
    'contract_status', ct.contract_status, 'parties_label', ct.parties_label,
    'renewal_date', ct.renewal_date, 'expiration_date', ct.expiration_date,
    'risk_status', ct.risk_status, 'client_id', ct.client_id
  ) order by ct.contract_name), '[]'::jsonb)
  into v_contracts
  from public.legal_contracts ct
  where ct.tenant_id = v_tenant_id and ct.contract_status != 'archived'
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'review_key', r.review_key, 'review_title', r.review_title,
    'review_type', r.review_type, 'review_status', r.review_status,
    'findings_count', r.findings_count, 'due_at', r.due_at
  ) order by r.due_at nulls last), '[]'::jsonb)
  into v_reviews
  from public.legal_compliance_reviews r
  where r.tenant_id = v_tenant_id and r.review_status != 'archived'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'deadline_key', d.deadline_key, 'deadline_title', d.deadline_title,
    'deadline_type', d.deadline_type, 'due_at', d.due_at, 'deadline_status', d.deadline_status,
    'case_id', d.case_id, 'contract_id', d.contract_id
  ) order by d.due_at), '[]'::jsonb)
  into v_deadlines
  from public.legal_deadlines d
  where d.tenant_id = v_tenant_id and d.deadline_status != 'archived'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.legal_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.legal_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Legal work depends on information accuracy, governance, confidentiality, deadlines, and accountability.',
    'mission', 'Legal & Compliance Operations — cases, clients, contracts, compliance, and document governance.',
    'abos_principle', 'Aipify supports legal professionals with operational visibility; Aipify does not provide legal advice.',
    'governance_note', 'Confidentiality-first design with document governance, access controls, and immutable audit logging.',
    'disclaimer', 'Aipify coordinates legal operations metadata. It is not a substitute for qualified legal counsel.',
    'industry_packs_route', '/app/industry-packs',
    'distinction_note', 'Visibility, governance, and accountability for legal operations — professional responsibility remains with licensed professionals.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/legal'),
      jsonb_build_object('key', 'cases', 'route', '/app/legal/cases'),
      jsonb_build_object('key', 'clients', 'route', '/app/legal/clients'),
      jsonb_build_object('key', 'contracts', 'route', '/app/legal/contracts'),
      jsonb_build_object('key', 'compliance', 'route', '/app/legal/compliance'),
      jsonb_build_object('key', 'documents', 'route', '/app/legal/documents'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/legal/intelligence'),
      jsonb_build_object('key', 'governance', 'route', '/app/legal/governance')
    ),
    'cases', v_cases,
    'clients', v_clients,
    'contracts', v_contracts,
    'compliance_reviews', v_reviews,
    'deadlines', v_deadlines,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'cases_route', '/app/legal/cases',
      'clients_route', '/app/legal/clients',
      'contracts_route', '/app/legal/contracts',
      'compliance_route', '/app/legal/compliance',
      'documents_route', '/app/legal/documents',
      'governance_route', '/app/legal/governance'
    ),
    'executive_dashboard', jsonb_build_object(
      'case_portfolio', v_overview->>'active_cases',
      'compliance_status', v_overview->>'compliance_status',
      'contract_exposure', v_overview->>'contracts',
      'upcoming_deadlines', v_overview->>'upcoming_deadlines',
      'legal_health_score', v_overview->>'legal_health_score',
      'executive_route', '/app/legal/intelligence'
    ),
    'privacy_note', 'Strict client and document isolation. Operational metadata only — confidentiality controls and full audit trail on all access.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.legal_compliance_case_operations_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_case_id uuid;
  v_case_title text;
  v_client_id uuid;
  v_contract_id uuid;
  v_review_id uuid;
begin
  perform public._irp_require_permission('legal.manage');
  perform public._glcco409_require_access();
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  perform public._glcco409_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_case' then
    insert into public.legal_cases (
      tenant_id, case_key, case_number, case_title, case_type,
      client_id, assigned_team, priority, case_status, deadline_at, risk_level
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'case_key', 'case-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'case_number', 'CASE-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'case_title', 'New case'),
      coalesce(p_payload->>'case_type', 'contract_review'),
      nullif(p_payload->>'client_id', '')::uuid,
      coalesce(p_payload->>'assigned_team', ''),
      coalesce(p_payload->>'priority', 'normal'),
      coalesce(p_payload->>'case_status', 'open'),
      nullif(p_payload->>'deadline_at', '')::timestamptz,
      coalesce(p_payload->>'risk_level', 'low')
    ) returning id, case_title into v_case_id, v_case_title;

    perform public._glcco409_log_audit(
      v_tenant_id, 'case_created', 'Case created: ' || v_case_title,
      jsonb_build_object('case_id', v_case_id)
    );

    return jsonb_build_object('ok', true, 'case_id', v_case_id);
  end if;

  if v_action = 'create_client' then
    insert into public.legal_clients (
      tenant_id, client_key, client_name, organization_label, compliance_status
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'client_key', 'client-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'client_name', 'New client'),
      coalesce(p_payload->>'organization_label', ''),
      coalesce(p_payload->>'compliance_status', 'review_due')
    ) returning id into v_client_id;

    return jsonb_build_object('ok', true, 'client_id', v_client_id);
  end if;

  if v_action = 'create_contract' then
    insert into public.legal_contracts (
      tenant_id, contract_key, contract_name, parties_label, client_id,
      contract_status, effective_date, renewal_date, expiration_date, risk_status
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'contract_key', 'contract-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'contract_name', 'New contract'),
      coalesce(p_payload->>'parties_label', ''),
      nullif(p_payload->>'client_id', '')::uuid,
      coalesce(p_payload->>'contract_status', 'draft'),
      nullif(p_payload->>'effective_date', '')::date,
      nullif(p_payload->>'renewal_date', '')::date,
      nullif(p_payload->>'expiration_date', '')::date,
      coalesce(p_payload->>'risk_status', 'low')
    ) returning id into v_contract_id;

    perform public._glcco409_log_audit(
      v_tenant_id, 'contract_created', 'Contract created',
      jsonb_build_object('contract_id', v_contract_id)
    );

    return jsonb_build_object('ok', true, 'contract_id', v_contract_id);
  end if;

  if v_action = 'approve_contract' then
    update public.legal_contracts
    set contract_status = 'approved', updated_at = now()
    where id = nullif(p_payload->>'contract_id', '')::uuid and tenant_id = v_tenant_id
    returning id into v_contract_id;

    perform public._glcco409_log_audit(
      v_tenant_id, 'contract_approved', 'Contract approved',
      jsonb_build_object('contract_id', v_contract_id)
    );

    return jsonb_build_object('ok', true, 'contract_id', v_contract_id);
  end if;

  if v_action = 'create_compliance_review' then
    insert into public.legal_compliance_reviews (
      tenant_id, review_key, review_title, review_type, review_status, due_at
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'review_key', 'REV-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'review_title', 'New compliance review'),
      coalesce(p_payload->>'review_type', 'regulatory'),
      coalesce(p_payload->>'review_status', 'pending'),
      nullif(p_payload->>'due_at', '')::timestamptz
    ) returning id into v_review_id;

    return jsonb_build_object('ok', true, 'review_id', v_review_id);
  end if;

  if v_action = 'complete_compliance_review' then
    update public.legal_compliance_reviews
    set
      review_status = 'completed',
      findings_count = coalesce((p_payload->>'findings_count')::int, findings_count),
      updated_at = now()
    where id = nullif(p_payload->>'review_id', '')::uuid and tenant_id = v_tenant_id
    returning id into v_review_id;

    update public.legal_pack_settings
    set compliance_status = coalesce(p_payload->>'compliance_status', 'compliant'), updated_at = now()
    where tenant_id = v_tenant_id;

    perform public._glcco409_log_audit(
      v_tenant_id, 'compliance_review_completed', 'Compliance review completed',
      jsonb_build_object('review_id', v_review_id)
    );

    return jsonb_build_object('ok', true, 'review_id', v_review_id);
  end if;

  if v_action = 'update_risk_assessment' then
    if nullif(p_payload->>'case_id', '')::uuid is not null then
      update public.legal_cases
      set risk_level = coalesce(p_payload->>'risk_level', risk_level), updated_at = now()
      where id = nullif(p_payload->>'case_id', '')::uuid and tenant_id = v_tenant_id;
    end if;

    perform public._glcco409_log_audit(
      v_tenant_id, 'risk_assessment_updated', 'Risk assessment updated',
      jsonb_build_object('case_id', p_payload->>'case_id', 'risk_level', p_payload->>'risk_level')
    );

    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unsupported legal action: %', v_action;
end;
$$;

grant execute on function public.get_legal_compliance_case_operations_center() to authenticated;
grant execute on function public.legal_compliance_case_operations_action(jsonb) to authenticated;
