-- Phase 335 — Partner Self-Billing & Compliance Center
-- Feature owner: GROWTH PARTNER PORTAL. Route: /partner/compliance. Helpers: _gpc335_*

-- Extend verification statuses for global compliance (under_review alias + expired)
alter table public.growth_partner_portal_verifications
  drop constraint if exists growth_partner_portal_verifications_verification_status_check;

alter table public.growth_partner_portal_verifications
  add constraint growth_partner_portal_verifications_verification_status_check check (
    verification_status in ('pending', 'in_review', 'under_review', 'verified', 'rejected', 'expired')
  );

create table if not exists public.growth_partner_portal_compliance_records (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade unique,
  compliance_status text not null default 'not_started' check (
    compliance_status in ('not_started', 'under_review', 'compliant', 'action_required')
  ),
  business_verification_status text not null default 'pending' check (
    business_verification_status in ('pending', 'under_review', 'verified', 'rejected', 'expired')
  ),
  identity_verification_status text not null default 'pending' check (
    identity_verification_status in ('pending', 'under_review', 'verified', 'rejected', 'expired')
  ),
  tax_profile_status text not null default 'pending' check (
    tax_profile_status in ('pending', 'under_review', 'verified', 'rejected', 'expired')
  ),
  banking_verification_status text not null default 'pending' check (
    banking_verification_status in ('pending', 'under_review', 'verified', 'rejected', 'expired')
  ),
  agreement_status text not null default 'pending' check (
    agreement_status in ('pending', 'active', 'expired', 'requires_acceptance')
  ),
  settlement_eligibility text not null default 'not_eligible' check (
    settlement_eligibility in ('eligible', 'partially_eligible', 'not_eligible')
  ),
  health_score_label text not null default 'action_required' check (
    health_score_label in ('excellent', 'good', 'needs_attention', 'action_required')
  ),
  health_score_pct integer not null default 0 check (health_score_pct between 0 and 100),
  country_code text not null default '',
  requirements_approved boolean not null default false,
  search_document text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists gpp_compliance_records_org_idx
  on public.growth_partner_portal_compliance_records (partner_org_id, compliance_status);
alter table public.growth_partner_portal_compliance_records enable row level security;
revoke all on public.growth_partner_portal_compliance_records from authenticated, anon;

create table if not exists public.growth_partner_portal_compliance_business (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade unique,
  company_name text not null default '',
  registration_number text not null default '',
  vat_number text not null default '',
  country_code text not null default '',
  registered_address text not null default '',
  legal_representative text not null default '',
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'under_review', 'verified', 'rejected', 'expired')
  ),
  verified_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.growth_partner_portal_compliance_business enable row level security;
revoke all on public.growth_partner_portal_compliance_business from authenticated, anon;

create table if not exists public.growth_partner_portal_compliance_tax_profiles (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade unique,
  vat_registered boolean not null default false,
  vat_number text not null default '',
  country_code text not null default '',
  tax_classification text not null default 'business' check (
    tax_classification in ('business', 'sole_proprietor', 'partnership', 'corporation', 'other')
  ),
  reverse_charge_eligible boolean not null default false,
  additional_tax_references jsonb not null default '[]'::jsonb,
  profile_status text not null default 'pending' check (
    profile_status in ('pending', 'under_review', 'verified', 'rejected', 'expired')
  ),
  verified_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.growth_partner_portal_compliance_tax_profiles enable row level security;
revoke all on public.growth_partner_portal_compliance_tax_profiles from authenticated, anon;

create table if not exists public.growth_partner_portal_compliance_banking (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade unique,
  account_holder text not null default '',
  account_number text not null default '',
  iban text not null default '',
  swift_bic text not null default '',
  country_code text not null default '',
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'under_review', 'verified', 'rejected', 'expired')
  ),
  verified_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.growth_partner_portal_compliance_banking enable row level security;
revoke all on public.growth_partner_portal_compliance_banking from authenticated, anon;

create table if not exists public.growth_partner_portal_compliance_documents (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  document_type text not null check (
    document_type in (
      'business_registration', 'vat_documentation', 'banking_documentation',
      'compliance_certificate', 'signed_agreement', 'identity_document', 'other'
    )
  ),
  file_name text not null default '',
  document_status text not null default 'pending' check (
    document_status in ('pending', 'approved', 'rejected', 'expired', 'archived')
  ),
  uploaded_by uuid,
  reviewed_at timestamptz,
  expires_at timestamptz,
  notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists gpp_compliance_documents_org_idx
  on public.growth_partner_portal_compliance_documents (partner_org_id, document_status, created_at desc);
alter table public.growth_partner_portal_compliance_documents enable row level security;
revoke all on public.growth_partner_portal_compliance_documents from authenticated, anon;

create table if not exists public.growth_partner_portal_compliance_timeline (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  event_type text not null,
  title text not null default '',
  summary text not null default '',
  actor_auth_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists gpp_compliance_timeline_org_idx
  on public.growth_partner_portal_compliance_timeline (partner_org_id, created_at desc);
alter table public.growth_partner_portal_compliance_timeline enable row level security;
revoke all on public.growth_partner_portal_compliance_timeline from authenticated, anon;

create table if not exists public.growth_partner_portal_compliance_alerts (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  alert_key text not null,
  message text not null default '',
  severity text not null default 'info' check (severity in ('info', 'warning', 'critical')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (partner_org_id, alert_key)
);
alter table public.growth_partner_portal_compliance_alerts enable row level security;
revoke all on public.growth_partner_portal_compliance_alerts from authenticated, anon;

create table if not exists public.growth_partner_portal_compliance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  event_type text not null,
  summary text not null default '',
  actor_auth_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists gpp_compliance_audit_org_idx
  on public.growth_partner_portal_compliance_audit_logs (partner_org_id, created_at desc);
alter table public.growth_partner_portal_compliance_audit_logs enable row level security;
revoke all on public.growth_partner_portal_compliance_audit_logs from authenticated, anon;

create or replace function public._gpc335bp_positioning() returns text language sql immutable as $$
  select 'Compliance by default — verified business, tax, and banking information before settlement processing. Aipify scales partner governance without proportional finance administration.'; $$;

create or replace function public._gpc335_member_role(p_org_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select coalesce(public._gppf05_member_role(p_org_id), ''); $$;

create or replace function public._gpc335_can_access(p_org_id uuid, p_write boolean default false)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_role text := public._gpc335_member_role(p_org_id);
begin
  if v_role in ('partner_owner', 'owner') then return true; end if;
  if p_write then return false; end if;
  if v_role in ('partner_manager', 'manager') then return true; end if;
  return false;
end; $$;

create or replace function public._gpc335_log_audit(
  p_org_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_compliance_audit_logs (
    partner_org_id, event_type, summary, actor_auth_user_id, context
  ) values (
    p_org_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._gpc335_log_timeline(
  p_org_id uuid, p_event_type text, p_title text, p_summary text, p_context jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_compliance_timeline (
    partner_org_id, event_type, title, summary, actor_auth_user_id, context
  ) values (
    p_org_id, p_event_type, p_title, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._gpc335_ensure_rows(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_profile public.growth_partner_portal_profiles;
begin
  perform public._gpp331_ensure_profile(p_org_id);
  perform public._gpp331_seed_verifications(p_org_id);
  perform public._gps334_ensure_agreement_row(p_org_id);

  select * into v_profile from public.growth_partner_portal_profiles where partner_org_id = p_org_id;

  insert into public.growth_partner_portal_compliance_records (partner_org_id, country_code)
  values (p_org_id, coalesce(v_profile.country_code, ''))
  on conflict (partner_org_id) do nothing;

  insert into public.growth_partner_portal_compliance_business (
    partner_org_id, company_name, registration_number, vat_number, country_code, registered_address
  ) values (
    p_org_id,
    coalesce(v_profile.company_name, ''),
    coalesce(v_profile.organization_number, ''),
    coalesce(v_profile.vat_number, ''),
    coalesce(v_profile.country_code, ''),
    coalesce(v_profile.business_address, '')
  ) on conflict (partner_org_id) do nothing;

  insert into public.growth_partner_portal_compliance_tax_profiles (
    partner_org_id, vat_registered, vat_number, country_code
  ) values (
    p_org_id,
    coalesce(nullif(trim(v_profile.vat_number), ''), '') <> '',
    coalesce(v_profile.vat_number, ''),
    coalesce(v_profile.country_code, '')
  ) on conflict (partner_org_id) do nothing;

  insert into public.growth_partner_portal_compliance_banking (
    partner_org_id, account_holder, account_number, iban, swift_bic, country_code
  ) values (
    p_org_id,
    coalesce(v_profile.bank_account_holder, ''),
    coalesce(v_profile.bank_account_number, ''),
    coalesce(v_profile.bank_account_number, ''),
    coalesce(v_profile.bank_routing, ''),
    coalesce(v_profile.country_code, '')
  ) on conflict (partner_org_id) do nothing;
end; $$;

create or replace function public._gpc335_sync_from_profile(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_profile public.growth_partner_portal_profiles;
begin
  select * into v_profile from public.growth_partner_portal_profiles where partner_org_id = p_org_id;
  if v_profile.id is null then return; end if;

  update public.growth_partner_portal_compliance_business set
    company_name = coalesce(v_profile.company_name, company_name),
    registration_number = coalesce(v_profile.organization_number, registration_number),
    vat_number = coalesce(v_profile.vat_number, vat_number),
    country_code = coalesce(v_profile.country_code, country_code),
    registered_address = coalesce(v_profile.business_address, registered_address),
    updated_at = now()
  where partner_org_id = p_org_id;

  update public.growth_partner_portal_compliance_banking set
    account_holder = coalesce(v_profile.bank_account_holder, account_holder),
    account_number = coalesce(v_profile.bank_account_number, account_number),
    iban = coalesce(v_profile.bank_account_number, iban),
    swift_bic = coalesce(v_profile.bank_routing, swift_bic),
    country_code = coalesce(v_profile.country_code, country_code),
    updated_at = now()
  where partner_org_id = p_org_id;

  update public.growth_partner_portal_compliance_tax_profiles set
    vat_number = coalesce(v_profile.vat_number, vat_number),
    vat_registered = coalesce(nullif(trim(v_profile.vat_number), ''), '') <> '',
    country_code = coalesce(v_profile.country_code, country_code),
    updated_at = now()
  where partner_org_id = p_org_id;
end; $$;

create or replace function public._gpc335_map_verification_status(p_status text)
returns text language sql immutable as $$
  select case
    when p_status in ('verified') then 'verified'
    when p_status in ('in_review', 'under_review') then 'under_review'
    when p_status = 'rejected' then 'rejected'
    when p_status = 'expired' then 'expired'
    else 'pending'
  end; $$;

create or replace function public._gpc335_recompute(p_org_id uuid)
returns public.growth_partner_portal_compliance_records language plpgsql security definer set search_path = public as $$
declare
  v_row public.growth_partner_portal_compliance_records;
  v_business public.growth_partner_portal_compliance_business;
  v_tax public.growth_partner_portal_compliance_tax_profiles;
  v_banking public.growth_partner_portal_compliance_banking;
  v_agreement public.growth_partner_portal_self_billing_agreements;
  v_identity_status text;
  v_business_status text;
  v_tax_status text;
  v_banking_status text;
  v_agreement_status text;
  v_score integer := 0;
  v_label text := 'action_required';
  v_eligibility text := 'not_eligible';
  v_compliance text := 'not_started';
  v_requirements boolean := false;
  v_search text;
begin
  perform public._gpc335_ensure_rows(p_org_id);
  perform public._gpc335_sync_from_profile(p_org_id);

  select * into v_business from public.growth_partner_portal_compliance_business where partner_org_id = p_org_id;
  select * into v_tax from public.growth_partner_portal_compliance_tax_profiles where partner_org_id = p_org_id;
  select * into v_banking from public.growth_partner_portal_compliance_banking where partner_org_id = p_org_id;
  select * into v_agreement from public.growth_partner_portal_self_billing_agreements
  where partner_org_id = p_org_id order by agreement_version desc limit 1;

  select public._gpc335_map_verification_status(verification_status) into v_business_status
  from public.growth_partner_portal_verifications
  where partner_org_id = p_org_id and verification_type = 'company_registration' limit 1;

  select public._gpc335_map_verification_status(verification_status) into v_identity_status
  from public.growth_partner_portal_verifications
  where partner_org_id = p_org_id and verification_type = 'identity' limit 1;

  v_business_status := coalesce(v_business.verification_status, v_business_status, 'pending');
  v_tax_status := coalesce(v_tax.profile_status, 'pending');
  v_banking_status := coalesce(v_banking.verification_status, 'pending');

  if coalesce(v_agreement.accepted, false) then
    v_agreement_status := 'active';
  elsif v_agreement.id is not null then
    v_agreement_status := 'requires_acceptance';
  else
    v_agreement_status := 'pending';
  end if;

  if v_business_status = 'verified' then v_score := v_score + 20; end if;
  if v_identity_status = 'verified' then v_score := v_score + 15; end if;
  if v_tax_status = 'verified' then v_score := v_score + 20; end if;
  if v_banking_status = 'verified' then v_score := v_score + 20; end if;
  if v_agreement_status = 'active' then v_score := v_score + 15; end if;
  if coalesce(v_business.company_name, '') <> ''
     and coalesce(v_business.registration_number, '') <> ''
     and coalesce(v_business.registered_address, '') <> '' then
    v_score := v_score + 10;
  end if;

  v_requirements := v_business_status = 'verified'
    and v_identity_status = 'verified'
    and v_banking_status = 'verified'
    and v_agreement_status = 'active'
    and v_tax_status = 'verified';

  if v_requirements then
    v_eligibility := 'eligible';
    v_compliance := 'compliant';
  elsif v_score >= 40 then
    v_eligibility := 'partially_eligible';
    v_compliance := 'action_required';
  else
    v_eligibility := 'not_eligible';
    v_compliance := case when v_score = 0 then 'not_started' else 'action_required' end;
  end if;

  if v_score >= 90 then v_label := 'excellent';
  elsif v_score >= 70 then v_label := 'good';
  elsif v_score >= 40 then v_label := 'needs_attention';
  else v_label := 'action_required';
  end if;

  v_search := lower(trim(
    coalesce(v_business.company_name, '') || ' ' ||
    coalesce(v_business.registration_number, '') || ' ' ||
    coalesce(v_business.vat_number, '') || ' ' ||
    coalesce(v_business.country_code, '') || ' ' ||
    coalesce(v_tax.tax_classification, '') || ' ' ||
    v_compliance || ' ' || v_eligibility
  ));

  update public.growth_partner_portal_compliance_records set
    compliance_status = v_compliance,
    business_verification_status = v_business_status,
    identity_verification_status = v_identity_status,
    tax_profile_status = v_tax_status,
    banking_verification_status = v_banking_status,
    agreement_status = v_agreement_status,
    settlement_eligibility = v_eligibility,
    health_score_label = v_label,
    health_score_pct = v_score,
    country_code = coalesce(v_business.country_code, country_code),
    requirements_approved = v_requirements,
    search_document = v_search,
    updated_at = now()
  where partner_org_id = p_org_id
  returning * into v_row;

  delete from public.growth_partner_portal_compliance_alerts where partner_org_id = p_org_id;

  if v_tax_status in ('pending', 'under_review') and coalesce(v_tax.vat_registered, false) then
    insert into public.growth_partner_portal_compliance_alerts (partner_org_id, alert_key, message, severity)
    values (p_org_id, 'vat_review', 'VAT information requires review.', 'warning');
  end if;
  if v_banking.expires_at is not null and v_banking.expires_at < (now() + interval '30 days') then
    insert into public.growth_partner_portal_compliance_alerts (partner_org_id, alert_key, message, severity)
    values (p_org_id, 'banking_expiry', 'Banking verification expires soon.', 'warning');
  end if;
  if v_agreement_status = 'requires_acceptance' then
    insert into public.growth_partner_portal_compliance_alerts (partner_org_id, alert_key, message, severity)
    values (p_org_id, 'agreement_update', 'Updated self-billing agreement requires acceptance.', 'critical');
  elsif v_agreement_status = 'pending' then
    insert into public.growth_partner_portal_compliance_alerts (partner_org_id, alert_key, message, severity)
    values (p_org_id, 'agreement_pending', 'Self-billing agreement must be accepted before settlement processing.', 'critical');
  end if;
  if v_business_status = 'expired' then
    insert into public.growth_partner_portal_compliance_alerts (partner_org_id, alert_key, message, severity)
    values (p_org_id, 'business_renewal', 'Business verification documents need renewal.', 'warning');
  end if;

  return v_row;
end; $$;

create or replace function public._gpc335_assert_settlement_eligible(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_row public.growth_partner_portal_compliance_records;
begin
  v_row := public._gpc335_recompute(p_org_id);
  if v_row.settlement_eligibility <> 'eligible' then
    raise exception 'Partner is not eligible for settlement processing. Complete compliance setup first.';
  end if;
end; $$;

create or replace function public._gpc335_seed_demo(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._gpc335_ensure_rows(p_org_id);

  update public.growth_partner_portal_verifications set verification_status = 'verified', verified_at = now()
  where partner_org_id = p_org_id
    and verification_type in ('company_registration', 'organization_number', 'identity', 'banking');

  update public.growth_partner_portal_compliance_business set
    verification_status = 'verified', verified_at = now(),
    legal_representative = coalesce(nullif(legal_representative, ''), 'Authorized Representative')
  where partner_org_id = p_org_id
    and coalesce(company_name, '') <> '';

  update public.growth_partner_portal_compliance_tax_profiles set
    profile_status = 'verified', verified_at = now()
  where partner_org_id = p_org_id;

  update public.growth_partner_portal_compliance_banking set
    verification_status = 'verified', verified_at = now(),
    expires_at = now() + interval '365 days'
  where partner_org_id = p_org_id
    and coalesce(account_number, '') <> '';

  insert into public.growth_partner_portal_compliance_documents (
    partner_org_id, document_type, file_name, document_status
  )
  select p_org_id, x.doc_type, x.file_name, 'approved'
  from (values
    ('business_registration', 'business-registration.pdf'),
    ('vat_documentation', 'vat-certificate.pdf'),
    ('signed_agreement', 'self-billing-agreement-v1.pdf')
  ) as x(doc_type, file_name)
  on conflict do nothing;

  perform public._gpc335_recompute(p_org_id);
end; $$;

-- Hook settlement engine to eligibility
create or replace function public.prepare_partner_monthly_settlement(p_period text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_bounds record;
  v_total numeric;
  v_vat_rate numeric;
  v_vat_amount numeric;
  v_payable numeric;
  v_settlement_id uuid;
  v_key text;
  v_existing uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  perform public._gpc335_assert_settlement_eligible(v_org_id);
  perform public._gps334_ensure_agreement_row(v_org_id);
  perform public._gpc333_seed_demo(v_org_id);

  select * into v_bounds from public._gps334_period_bounds(p_period);

  select id into v_existing from public.growth_partner_portal_settlements
  where partner_org_id = v_org_id and settlement_period = v_bounds.period_label
    and settlement_status not in ('rejected', 'cancelled')
  limit 1;

  if v_existing is not null then
    return public.get_partner_settlement(v_existing);
  end if;

  v_total := public._gps334_payable_commissions(v_org_id, v_bounds.period_from, v_bounds.period_to);

  if v_total <= 0 then
    return jsonb_build_object(
      'has_access', true,
      'has_payable_settlement', false,
      'message', 'No payable settlement this month.',
      'settlement_period', v_bounds.period_label
    );
  end if;

  v_vat_rate := public._gps334_vat_rate(v_org_id);
  v_vat_amount := round(v_total * v_vat_rate / 100, 2);
  v_payable := v_total + v_vat_amount;
  v_key := 'STL-' || replace(v_bounds.period_label, '-', '') || '-' || left(replace(gen_random_uuid()::text, '-', ''), 6);

  insert into public.growth_partner_portal_settlements (
    partner_org_id, settlement_key, settlement_period, period_from, period_to,
    commission_total, vat_rate_pct, vat_amount, total_payable,
    settlement_status, due_date
  ) values (
    v_org_id, v_key, v_bounds.period_label, v_bounds.period_from, v_bounds.period_to,
    v_total, v_vat_rate, v_vat_amount, v_payable,
    'awaiting_partner_approval', current_date + 30
  ) returning id into v_settlement_id;

  insert into public.growth_partner_portal_settlement_items (
    settlement_id, commission_record_id, sale_reference, customer_name, package_label,
    sale_value, commission_rate_pct, commission_amount, line_description, sort_order
  )
  select
    v_settlement_id, cr.id, coalesce(s.sale_reference, cr.commission_key),
    cr.customer_name, cr.package_label, cr.sale_value, cr.commission_rate_pct,
    cr.commission_amount,
    'Commission — initial sale — ' || cr.customer_name || ' (' || cr.package_label || ')',
    row_number() over (order by cr.record_date)::int * 10
  from public.growth_partner_portal_commission_engine_records cr
  left join public.growth_partner_portal_commission_sales s on s.id = cr.sale_id
  where cr.partner_org_id = v_org_id
    and cr.commission_status in ('approved', 'ready_for_settlement')
    and cr.record_date between v_bounds.period_from and v_bounds.period_to;

  perform public._gps334_log_audit(
    v_org_id, v_settlement_id, 'settlement_draft_created',
    'Monthly settlement draft prepared.', jsonb_build_object('total_payable', v_payable)
  );

  return public.get_partner_settlement(v_settlement_id);
end; $$;

create or replace function public.approve_partner_settlement(
  p_settlement_id uuid,
  p_approval_statement text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.growth_partner_portal_settlements;
  v_agreement public.growth_partner_portal_self_billing_agreements;
  v_invoice_number text;
  v_seller jsonb;
  v_buyer jsonb;
  v_lines jsonb;
  v_invoice_id uuid;
  v_accounting jsonb;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  perform public._gpc335_assert_settlement_eligible(v_org_id);

  select * into v_agreement from public.growth_partner_portal_self_billing_agreements
  where partner_org_id = v_org_id and agreement_version = '1.0';
  if coalesce(v_agreement.accepted, false) = false then
    raise exception 'Self-billing agreement must be accepted before invoice generation';
  end if;

  select * into v_row from public.growth_partner_portal_settlements
  where id = p_settlement_id and partner_org_id = v_org_id;
  if v_row.id is null then raise exception 'Settlement not found'; end if;
  if v_row.total_payable <= 0 then raise exception 'Cannot approve empty settlement'; end if;
  if v_row.settlement_status not in ('draft', 'awaiting_partner_approval') then
    raise exception 'Settlement is not awaiting approval';
  end if;

  if coalesce(trim(p_approval_statement), '') = '' then
    raise exception 'Partner approval statement is required';
  end if;

  update public.growth_partner_portal_settlements set
    settlement_status = 'approved',
    partner_approved_at = now(),
    partner_approved_by = auth.uid(),
    approval_statement = p_approval_statement,
    updated_at = now()
  where id = p_settlement_id;

  v_invoice_number := public._gps334_next_invoice_number(v_org_id);
  v_seller := public._gps334_seller_snapshot(v_org_id);
  v_buyer := public._gps334_aipify_buyer();

  select coalesce(jsonb_agg(jsonb_build_object(
    'sale_reference', si.sale_reference,
    'customer', si.customer_name,
    'package', si.package_label,
    'commission_pct', si.commission_rate_pct,
    'amount', si.commission_amount
  ) order by si.sort_order), '[]'::jsonb) into v_lines
  from public.growth_partner_portal_settlement_items si where si.settlement_id = p_settlement_id;

  v_accounting := jsonb_build_object(
    'integration', 'fiken_ready',
    'direction', 'incoming_supplier_invoice',
    'supplier', v_seller,
    'buyer', v_buyer,
    'currency', 'NOK',
    'line_items', v_lines
  );

  insert into public.growth_partner_portal_settlement_invoices (
    partner_org_id, settlement_id, invoice_number, invoice_date, due_date,
    settlement_period, commission_total, vat_rate_pct, vat_amount, total_payable,
    payment_terms, invoice_status, seller_snapshot, buyer_snapshot, line_items,
    immutable, finalized_at, sent_to_accounting_at, accounting_payload
  ) values (
    v_org_id, p_settlement_id, v_invoice_number, current_date, v_row.due_date,
    v_row.settlement_period, v_row.commission_total, v_row.vat_rate_pct, v_row.vat_amount, v_row.total_payable,
    v_row.payment_terms, 'sent_to_accounting', v_seller, v_buyer, v_lines,
    true, now(), now(), v_accounting
  ) returning id into v_invoice_id;

  update public.growth_partner_portal_settlements set
    settlement_status = 'sent_to_accounting', updated_at = now()
  where id = p_settlement_id;

  update public.growth_partner_portal_commission_engine_records cr set
    commission_status = 'paid', updated_at = now()
  from public.growth_partner_portal_settlement_items si
  where si.commission_record_id = cr.id and si.settlement_id = p_settlement_id;

  perform public._gps334_log_audit(
    v_org_id, p_settlement_id, 'settlement_approved_invoice_generated',
    'Partner approved settlement; legal invoice generated.',
    jsonb_build_object('invoice_id', v_invoice_id, 'invoice_number', v_invoice_number)
  );

  return public.get_partner_settlement(p_settlement_id);
end; $$;

create or replace function public.get_partner_compliance(
  p_compliance_status text default null,
  p_country text default null,
  p_verification_status text default null,
  p_agreement_status text default null,
  p_tax_status text default null,
  p_date_from date default null,
  p_search text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_role text;
  v_record public.growth_partner_portal_compliance_records;
  v_can_write boolean := false;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  if not public._gpc335_can_access(v_org_id, false) then
    return jsonb_build_object('has_access', false, 'access_denied', true);
  end if;

  v_role := public._gpc335_member_role(v_org_id);
  v_can_write := public._gpc335_can_access(v_org_id, true);

  perform public._gpp331_provision(v_org_id);
  perform public._gpc335_seed_demo(v_org_id);
  v_record := public._gpc335_recompute(v_org_id);

  if p_compliance_status is not null and v_record.compliance_status <> p_compliance_status then
    return jsonb_build_object('has_access', true, 'can_write', v_can_write, 'team_role', v_role, 'filtered_out', true);
  end if;
  if p_country is not null and lower(v_record.country_code) <> lower(p_country) then
    return jsonb_build_object('has_access', true, 'can_write', v_can_write, 'team_role', v_role, 'filtered_out', true);
  end if;
  if p_search is not null and v_record.search_document not like '%' || lower(trim(p_search)) || '%' then
    return jsonb_build_object('has_access', true, 'can_write', v_can_write, 'team_role', v_role, 'filtered_out', true);
  end if;

  return jsonb_build_object(
    'has_access', true,
    'can_write', v_can_write,
    'team_role', v_role,
    'positioning', public._gpc335bp_positioning(),
    'dashboard', jsonb_build_object(
      'compliance_status', v_record.compliance_status,
      'business_verification_status', v_record.business_verification_status,
      'identity_verification_status', v_record.identity_verification_status,
      'self_billing_agreement_status', v_record.agreement_status,
      'tax_information_status', v_record.tax_profile_status,
      'settlement_eligibility', v_record.settlement_eligibility,
      'banking_verification_status', v_record.banking_verification_status,
      'health_score_label', v_record.health_score_label,
      'health_score_pct', v_record.health_score_pct,
      'requirements_approved', v_record.requirements_approved,
      'country_code', v_record.country_code
    ),
    'business', (
      select jsonb_build_object(
        'company_name', b.company_name,
        'registration_number', b.registration_number,
        'vat_number', b.vat_number,
        'country_code', b.country_code,
        'registered_address', b.registered_address,
        'legal_representative', b.legal_representative,
        'verification_status', b.verification_status
      ) from public.growth_partner_portal_compliance_business b where b.partner_org_id = v_org_id
    ),
    'banking', (
      select jsonb_build_object(
        'account_holder', bk.account_holder,
        'account_number', bk.account_number,
        'iban', bk.iban,
        'swift_bic', bk.swift_bic,
        'country_code', bk.country_code,
        'verification_status', bk.verification_status,
        'expires_at', coalesce(bk.expires_at::text, '')
      ) from public.growth_partner_portal_compliance_banking bk where bk.partner_org_id = v_org_id
    ),
    'alerts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'alert_key', a.alert_key,
        'message', a.message,
        'severity', a.severity
      ) order by a.severity desc)
      from public.growth_partner_portal_compliance_alerts a
      where a.partner_org_id = v_org_id and a.active = true
    ), '[]'::jsonb),
    'timeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id,
        'event_type', t.event_type,
        'title', t.title,
        'summary', t.summary,
        'created_at', t.created_at::text
      ) order by t.created_at desc)
      from public.growth_partner_portal_compliance_timeline t
      where t.partner_org_id = v_org_id
        and (p_date_from is null or t.created_at::date >= p_date_from)
      limit 50
    ), '[]'::jsonb),
    'empty_state', jsonb_build_object(
      'title', 'Complete compliance setup to activate partner payments.',
      'message', 'Aipify requires verified business and tax information before settlement processing.',
      'cta', 'Complete Compliance Setup'
    )
  );
end; $$;

create or replace function public.get_partner_compliance_documents(
  p_document_status text default null,
  p_search text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpc335_can_access(v_org_id, false) then return jsonb_build_object('has_access', false); end if;
  perform public._gpc335_ensure_rows(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'documents', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id,
        'document_type', d.document_type,
        'file_name', d.file_name,
        'document_status', d.document_status,
        'expires_at', coalesce(d.expires_at::text, ''),
        'created_at', d.created_at::text
      ) order by d.created_at desc)
      from public.growth_partner_portal_compliance_documents d
      where d.partner_org_id = v_org_id
        and (p_document_status is null or d.document_status = p_document_status)
        and (p_search is null or lower(d.file_name) like '%' || lower(trim(p_search)) || '%')
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_partner_compliance_tax_profile()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpc335_can_access(v_org_id, false) then return jsonb_build_object('has_access', false); end if;
  perform public._gpc335_ensure_rows(v_org_id);
  perform public._gpc335_recompute(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'tax_profile', (
      select jsonb_build_object(
        'vat_registered', t.vat_registered,
        'vat_number', t.vat_number,
        'country_code', t.country_code,
        'tax_classification', t.tax_classification,
        'reverse_charge_eligible', t.reverse_charge_eligible,
        'additional_tax_references', t.additional_tax_references,
        'profile_status', t.profile_status,
        'verified_at', coalesce(t.verified_at::text, '')
      ) from public.growth_partner_portal_compliance_tax_profiles t where t.partner_org_id = v_org_id
    )
  );
end; $$;

create or replace function public.get_partner_compliance_agreements()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpc335_can_access(v_org_id, false) then return jsonb_build_object('has_access', false); end if;
  perform public._gps334_ensure_agreement_row(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'current', (
      select jsonb_build_object(
        'agreement_version', a.agreement_version,
        'accepted', a.accepted,
        'accepted_at', coalesce(a.accepted_at::text, ''),
        'accepted_by', a.accepted_by,
        'status', case when a.accepted then 'active' else 'pending' end
      ) from public.growth_partner_portal_self_billing_agreements a
      where a.partner_org_id = v_org_id order by a.agreement_version desc limit 1
    ),
    'history', coalesce((
      select jsonb_agg(jsonb_build_object(
        'agreement_version', a.agreement_version,
        'accepted', a.accepted,
        'accepted_at', coalesce(a.accepted_at::text, ''),
        'status', case when a.accepted then 'active' else 'pending' end
      ) order by a.agreement_version desc)
      from public.growth_partner_portal_self_billing_agreements a
      where a.partner_org_id = v_org_id
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.submit_partner_compliance_verification(
  p_verification_type text default 'business'
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpc335_can_access(v_org_id, true) then
    raise exception 'Compliance write access required';
  end if;

  perform public._gpc335_ensure_rows(v_org_id);
  perform public._gpc335_sync_from_profile(v_org_id);

  if p_verification_type in ('business', 'company_registration') then
    update public.growth_partner_portal_compliance_business set
      verification_status = 'under_review', updated_at = now()
    where partner_org_id = v_org_id;
    update public.growth_partner_portal_verifications set
      verification_status = 'under_review', updated_at = now()
    where partner_org_id = v_org_id and verification_type = 'company_registration';
  elsif p_verification_type = 'banking' then
    update public.growth_partner_portal_compliance_banking set
      verification_status = 'under_review', updated_at = now()
    where partner_org_id = v_org_id;
    update public.growth_partner_portal_verifications set
      verification_status = 'under_review', updated_at = now()
    where partner_org_id = v_org_id and verification_type = 'banking';
  elsif p_verification_type = 'tax' then
    update public.growth_partner_portal_compliance_tax_profiles set
      profile_status = 'under_review', updated_at = now()
    where partner_org_id = v_org_id;
  elsif p_verification_type = 'identity' then
    update public.growth_partner_portal_verifications set
      verification_status = 'under_review', updated_at = now()
    where partner_org_id = v_org_id and verification_type = 'identity';
  end if;

  perform public._gpc335_log_timeline(
    v_org_id, 'verification_submitted', 'Verification submitted',
    'Compliance verification submitted for review.', jsonb_build_object('type', p_verification_type)
  );
  perform public._gpc335_log_audit(
    v_org_id, 'verification_submitted', 'Partner submitted compliance verification.',
    jsonb_build_object('verification_type', p_verification_type)
  );
  perform public._gpc335_recompute(v_org_id);

  return public.get_partner_compliance(null, null, null, null, null, null, null);
end; $$;

create or replace function public.update_partner_compliance_profile(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_profile public.growth_partner_portal_profiles;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpc335_can_access(v_org_id, true) then
    raise exception 'Compliance write access required';
  end if;

  perform public._gpp331_ensure_profile(v_org_id);
  perform public._gpc335_ensure_rows(v_org_id);

  update public.growth_partner_portal_profiles set
    company_name = coalesce(p_payload->>'company_name', company_name),
    organization_number = coalesce(p_payload->>'registration_number', organization_number),
    vat_number = coalesce(p_payload->>'vat_number', vat_number),
    business_address = coalesce(p_payload->>'registered_address', business_address),
    country_code = coalesce(p_payload->>'country_code', country_code),
    bank_account_holder = coalesce(p_payload->>'account_holder', bank_account_holder),
    bank_account_number = coalesce(p_payload->>'account_number', bank_account_number),
    bank_routing = coalesce(p_payload->>'swift_bic', bank_routing),
    tax_information = coalesce(p_payload->>'tax_classification', tax_information),
    updated_at = now()
  where partner_org_id = v_org_id
  returning * into v_profile;

  update public.growth_partner_portal_compliance_business set
    company_name = coalesce(p_payload->>'company_name', company_name),
    registration_number = coalesce(p_payload->>'registration_number', registration_number),
    vat_number = coalesce(p_payload->>'vat_number', vat_number),
    registered_address = coalesce(p_payload->>'registered_address', registered_address),
    legal_representative = coalesce(p_payload->>'legal_representative', legal_representative),
    country_code = coalesce(p_payload->>'country_code', country_code),
    updated_at = now()
  where partner_org_id = v_org_id;

  update public.growth_partner_portal_compliance_tax_profiles set
    vat_registered = coalesce((p_payload->>'vat_registered')::boolean, vat_registered),
    vat_number = coalesce(p_payload->>'vat_number', vat_number),
    country_code = coalesce(p_payload->>'country_code', country_code),
    tax_classification = coalesce(p_payload->>'tax_classification', tax_classification),
    reverse_charge_eligible = coalesce((p_payload->>'reverse_charge_eligible')::boolean, reverse_charge_eligible),
    updated_at = now()
  where partner_org_id = v_org_id;

  update public.growth_partner_portal_compliance_banking set
    account_holder = coalesce(p_payload->>'account_holder', account_holder),
    account_number = coalesce(p_payload->>'account_number', account_number),
    iban = coalesce(p_payload->>'iban', iban),
    swift_bic = coalesce(p_payload->>'swift_bic', swift_bic),
    country_code = coalesce(p_payload->>'bank_country_code', country_code),
    updated_at = now()
  where partner_org_id = v_org_id;

  perform public._gpc335_log_timeline(
    v_org_id, 'tax_profile_updated', 'Tax profile updated',
    'Partner compliance profile updated.', '{}'::jsonb
  );
  perform public._gpc335_log_audit(
    v_org_id, 'compliance_profile_updated', 'Partner updated compliance profile.', p_payload
  );
  perform public._gpc335_recompute(v_org_id);

  return public.get_partner_compliance(null, null, null, null, null, null, null);
end; $$;

grant execute on function public.get_partner_compliance(text, text, text, text, text, date, text) to authenticated;
grant execute on function public.get_partner_compliance_documents(text, text) to authenticated;
grant execute on function public.get_partner_compliance_tax_profile() to authenticated;
grant execute on function public.get_partner_compliance_agreements() to authenticated;
grant execute on function public.submit_partner_compliance_verification(text) to authenticated;
grant execute on function public.update_partner_compliance_profile(jsonb) to authenticated;

-- Partner portal routes blueprint — include Compliance Center
create or replace function public._gpp331bp_routes() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'dashboard', 'route', '/partner/dashboard'),
    jsonb_build_object('key', 'opportunities', 'route', '/partner/opportunities'),
    jsonb_build_object('key', 'customers', 'route', '/partner/customers'),
    jsonb_build_object('key', 'academy', 'route', '/partner/academy'),
    jsonb_build_object('key', 'materials', 'route', '/partner/materials'),
    jsonb_build_object('key', 'commissions', 'route', '/partner/commissions'),
    jsonb_build_object('key', 'settlements', 'route', '/partner/settlements'),
    jsonb_build_object('key', 'compliance', 'route', '/partner/compliance'),
    jsonb_build_object('key', 'performance', 'route', '/partner/performance'),
    jsonb_build_object('key', 'advisor', 'route', '/partner/advisor'),
    jsonb_build_object('key', 'settings', 'route', '/partner/settings')
  ); $$;
