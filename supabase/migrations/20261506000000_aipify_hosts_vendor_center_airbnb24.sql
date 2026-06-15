-- Phase Airbnb 24 — Aipify Hosts Vendor Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostvnd_* (engine), _ahostbp386_* (blueprint)

create table if not exists public.aipify_hosts_vendor_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'vendors' check (
    default_section in ('vendors', 'contracts', 'service_agreements', 'certifications', 'performance_reviews')
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_vendor_center_settings enable row level security;
revoke all on public.aipify_hosts_vendor_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_vendors (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  vendor_key text not null,
  company_name text not null,
  contact_person text,
  email text,
  phone_number text,
  service_category text not null check (
    service_category in (
      'cleaning', 'maintenance', 'plumbing', 'electrical', 'locksmith', 'landscaping',
      'snow_removal', 'photography', 'linen_services', 'concierge_services', 'pest_control', 'other'
    )
  ),
  coverage_area text,
  vendor_status text not null default 'in_review' check (
    vendor_status in ('active', 'in_review', 'suspended', 'inactive')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, vendor_key)
);
create index if not exists aipify_hosts_vendors_tenant_status_idx
  on public.aipify_hosts_vendors (tenant_id, vendor_status, service_category);
alter table public.aipify_hosts_vendors enable row level security;
revoke all on public.aipify_hosts_vendors from authenticated, anon;

create table if not exists public.aipify_hosts_vendor_contracts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  vendor_id uuid not null references public.aipify_hosts_vendors (id) on delete cascade,
  contract_key text not null,
  contract_type text not null check (
    contract_type in ('service_agreement', 'maintenance_agreement', 'cleaning_agreement', 'seasonal_agreement', 'other')
  ),
  start_date date not null,
  end_date date not null,
  renewal_terms text,
  contract_status text not null default 'draft' check (
    contract_status in ('draft', 'active', 'expiring_soon', 'expired', 'terminated')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, contract_key)
);
create index if not exists aipify_hosts_vendor_contracts_tenant_idx
  on public.aipify_hosts_vendor_contracts (tenant_id, contract_status, end_date);
alter table public.aipify_hosts_vendor_contracts enable row level security;
revoke all on public.aipify_hosts_vendor_contracts from authenticated, anon;

create table if not exists public.aipify_hosts_vendor_certifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  vendor_id uuid not null references public.aipify_hosts_vendors (id) on delete cascade,
  certification_type text not null check (
    certification_type in ('insurance', 'license', 'compliance_document')
  ),
  document_name text not null,
  expiry_date date,
  verification_status text not null default 'missing' check (
    verification_status in ('valid', 'expiring_soon', 'expired', 'missing')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_hosts_vendor_certifications_vendor_idx
  on public.aipify_hosts_vendor_certifications (vendor_id, verification_status);
alter table public.aipify_hosts_vendor_certifications enable row level security;
revoke all on public.aipify_hosts_vendor_certifications from authenticated, anon;

create table if not exists public.aipify_hosts_vendor_performance_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  vendor_id uuid not null references public.aipify_hosts_vendors (id) on delete cascade,
  review_frequency text not null default 'quarterly' check (
    review_frequency in ('monthly', 'quarterly', 'annually')
  ),
  reliability_score numeric(5,2) not null default 0 check (reliability_score >= 0 and reliability_score <= 100),
  response_time_score numeric(5,2) not null default 0 check (response_time_score >= 0 and response_time_score <= 100),
  quality_rating numeric(5,2) not null default 0 check (quality_rating >= 0 and quality_rating <= 100),
  cost_effectiveness numeric(5,2) not null default 0 check (cost_effectiveness >= 0 and cost_effectiveness <= 100),
  overall_rating numeric(5,2) not null default 0 check (overall_rating >= 0 and overall_rating <= 100),
  review_notes text,
  next_review_due date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_hosts_vendor_performance_reviews_vendor_idx
  on public.aipify_hosts_vendor_performance_reviews (vendor_id, created_at desc);
alter table public.aipify_hosts_vendor_performance_reviews enable row level security;
revoke all on public.aipify_hosts_vendor_performance_reviews from authenticated, anon;

create table if not exists public.aipify_hosts_vendor_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_vendor_center_events_tenant_idx
  on public.aipify_hosts_vendor_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_vendor_center_events enable row level security;
revoke all on public.aipify_hosts_vendor_center_events from authenticated, anon;

create or replace function public._ahostvnd_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_vendor_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_vendor_center_settings;
begin
  insert into public.aipify_hosts_vendor_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_vendor_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostvnd_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_vendor_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'vendor_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostvnd_push_notification(
  p_tenant_id uuid, p_key text, p_priority text, p_title text, p_message text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_notifications (
    tenant_id, notification_key, category, priority, notification_status, title, message, requires_attention
  ) values (
    p_tenant_id, p_key, 'team_events', p_priority, 'unread', p_title, p_message, p_priority in ('high', 'critical')
  ) on conflict (tenant_id, notification_key) do update set
    priority = excluded.priority, title = excluded.title, message = excluded.message,
    requires_attention = excluded.requires_attention, notification_status = 'unread', updated_at = now();
exception when undefined_table then null;
end; $$;

create or replace function public._ahostvnd_cert_status(p_expiry date)
returns text language sql immutable as $$
  select case
    when p_expiry is null then 'missing'
    when p_expiry < current_date then 'expired'
    when p_expiry <= current_date + 30 then 'expiring_soon'
    else 'valid'
  end; $$;

create or replace function public._ahostvnd_contract_status(p_end date, p_status text)
returns text language sql immutable as $$
  select case
    when p_status = 'terminated' then 'terminated'
    when p_status = 'draft' then 'draft'
    when p_end < current_date then 'expired'
    when p_end <= current_date + 30 then 'expiring_soon'
    else coalesce(nullif(p_status, ''), 'active')
  end; $$;

create or replace function public._ahostbp386_positioning() returns text language sql immutable as $$
  select 'Manage third-party service providers and operational agreements — vendors, contracts, certifications, and performance in one Vendor Center.'; $$;

create or replace function public._ahostbp386_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'vendors', 'label', 'Vendors'),
    jsonb_build_object('key', 'contracts', 'label', 'Contracts'),
    jsonb_build_object('key', 'service_agreements', 'label', 'Service Agreements'),
    jsonb_build_object('key', 'certifications', 'label', 'Certifications'),
    jsonb_build_object('key', 'performance_reviews', 'label', 'Performance Reviews')
  ); $$;

create or replace function public._ahostbp386_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'cleaning', 'maintenance', 'plumbing', 'electrical', 'locksmith', 'landscaping',
    'snow_removal', 'photography', 'linen_services', 'concierge_services', 'pest_control', 'other'
  ); $$;

create or replace function public._ahostvnd_vendor_row(p_v public.aipify_hosts_vendors)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_v.id,
    'vendor_key', p_v.vendor_key,
    'company_name', p_v.company_name,
    'contact_person', coalesce(p_v.contact_person, '—'),
    'email', coalesce(p_v.email, '—'),
    'phone_number', coalesce(p_v.phone_number, '—'),
    'service_category', p_v.service_category,
    'coverage_area', coalesce(p_v.coverage_area, '—'),
    'status', p_v.vendor_status,
    'created_at', to_char(p_v.created_at, 'YYYY-MM-DD HH24:MI')
  ); $$;

create or replace function public._ahostvnd_contract_row(p_c public.aipify_hosts_vendor_contracts, p_vendor text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_c.id,
    'contract_key', p_c.contract_key,
    'vendor', coalesce(p_vendor, '—'),
    'vendor_id', p_c.vendor_id,
    'contract_type', p_c.contract_type,
    'start_date', p_c.start_date::text,
    'end_date', p_c.end_date::text,
    'renewal_terms', coalesce(p_c.renewal_terms, '—'),
    'status', public._ahostvnd_contract_status(p_c.end_date, p_c.contract_status)
  ); $$;

create or replace function public._ahostvnd_seed_vendors(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_clean uuid; v_maint uuid; v_contract uuid;
begin
  if exists (select 1 from public.aipify_hosts_vendors where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_hosts_vendors (
    tenant_id, vendor_key, company_name, contact_person, email, phone_number,
    service_category, coverage_area, vendor_status
  ) values
    (p_tenant_id, 'vnd_001', 'Nordic Clean Pro', 'Anna Larsen', 'anna@nordicclean.no', '+47 400 55 001',
      'cleaning', 'Oslo region', 'active'),
    (p_tenant_id, 'vnd_002', 'Fjord Maintenance AS', 'Erik Hansen', 'erik@fjordmaint.no', '+47 400 55 002',
      'maintenance', 'Eastern Norway', 'active'),
    (p_tenant_id, 'vnd_003', 'QuickLock Services', 'Maria Olsen', 'maria@quicklock.no', '+47 400 55 003',
      'locksmith', 'Oslo & Akershus', 'in_review'),
    (p_tenant_id, 'vnd_004', 'Alpine Snow Care', 'Jon Berg', 'jon@alpine.no', '+47 400 55 004',
      'snow_removal', 'Mountain properties', 'suspended');
  select id into v_clean from public.aipify_hosts_vendors where tenant_id = p_tenant_id and vendor_key = 'vnd_001';
  select id into v_maint from public.aipify_hosts_vendors where tenant_id = p_tenant_id and vendor_key = 'vnd_002';
  insert into public.aipify_hosts_vendor_contracts (
    tenant_id, vendor_id, contract_key, contract_type, start_date, end_date, renewal_terms, contract_status
  ) values
    (p_tenant_id, v_clean, 'ctr_001', 'cleaning_agreement', current_date - 180, current_date + 185,
      'Auto-renew annually with 30-day notice', 'active'),
    (p_tenant_id, v_maint, 'ctr_002', 'maintenance_agreement', current_date - 90, current_date + 20,
      'Renewal review required 60 days before expiry', 'active'),
    (p_tenant_id, v_clean, 'ctr_003', 'service_agreement', current_date - 365, current_date - 30,
      'Terminated — replaced by ctr_001', 'expired');
  insert into public.aipify_hosts_vendor_certifications (
    tenant_id, vendor_id, certification_type, document_name, expiry_date, verification_status
  ) values
    (p_tenant_id, v_clean, 'insurance', 'General liability insurance', current_date + 120, 'valid'),
    (p_tenant_id, v_clean, 'license', 'Commercial cleaning license', current_date + 25, 'expiring_soon'),
    (p_tenant_id, v_maint, 'insurance', 'Professional indemnity insurance', current_date - 5, 'expired'),
    (p_tenant_id, v_maint, 'compliance_document', 'Safety compliance certificate', current_date + 200, 'valid');
  insert into public.aipify_hosts_vendor_performance_reviews (
    tenant_id, vendor_id, review_frequency, reliability_score, response_time_score,
    quality_rating, cost_effectiveness, overall_rating, review_notes, next_review_due
  ) values
    (p_tenant_id, v_clean, 'quarterly', 92, 88, 90, 85, 89,
      'Consistent turnover quality with minor scheduling delays.', current_date + 45),
    (p_tenant_id, v_maint, 'quarterly', 78, 72, 80, 75, 76,
      'Response times need improvement during peak season.', current_date + 14);
end; $$;

create or replace function public._ahostvnd_dashboard_stats(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'active_vendors', (select count(*)::int from public.aipify_hosts_vendors
      where tenant_id = p_tenant_id and vendor_status = 'active'),
    'contracts_expiring', (select count(*)::int from public.aipify_hosts_vendor_contracts c
      join public.aipify_hosts_vendors v on v.id = c.vendor_id
      where c.tenant_id = p_tenant_id and public._ahostvnd_contract_status(c.end_date, c.contract_status) = 'expiring_soon'),
    'certs_expiring', (select count(*)::int from public.aipify_hosts_vendor_certifications
      where tenant_id = p_tenant_id and verification_status in ('expiring_soon', 'expired')),
    'reviews_due', (select count(*)::int from public.aipify_hosts_vendor_performance_reviews
      where tenant_id = p_tenant_id and next_review_due is not null and next_review_due <= current_date + 14),
    'suspended_vendors', (select count(*)::int from public.aipify_hosts_vendors
      where tenant_id = p_tenant_id and vendor_status = 'suspended')
  ); $$;

create or replace function public.get_aipify_hosts_vendor_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_vc public.aipify_hosts_vendor_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_vc := public._ahostvnd_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_vc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp386_positioning(),
    'route', '/app/aipify-hosts/vendors',
    'stats', public._ahostvnd_dashboard_stats(v_tenant_id)
  );
end; $$;

create or replace function public.get_aipify_hosts_vendor_center_dashboard(
  p_section text default 'vendors',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_vc public.aipify_hosts_vendor_center_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_vendors jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_vc := public._ahostvnd_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_vc.default_section, 'vendors');
  perform public._ahostvnd_seed_vendors(v_tenant_id);
  perform public._ahostvnd_check_notifications(v_tenant_id);
  perform public._ahostvnd_log_event(v_tenant_id, 'dashboard_view', 'Vendor Center viewed',
    jsonb_build_object('section', v_section));

  select coalesce(jsonb_agg(public._ahostvnd_vendor_row(v) order by v.company_name), '[]'::jsonb)
  into v_vendors from public.aipify_hosts_vendors v where v.tenant_id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_vc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp386_positioning(),
    'governance', jsonb_build_object(
      'audit_vendor_changes', true,
      'audit_contract_changes', true,
      'audit_performance_reviews', true,
      'role_permissions', true
    ),
    'sections', public._ahostbp386_sections(),
    'vendor_categories', public._ahostbp386_categories(),
    'vendor_statuses', jsonb_build_array('active', 'in_review', 'suspended', 'inactive'),
    'contract_statuses', jsonb_build_array('draft', 'active', 'expiring_soon', 'expired', 'terminated'),
    'contract_types', jsonb_build_array('service_agreement', 'maintenance_agreement', 'cleaning_agreement', 'seasonal_agreement', 'other'),
    'certification_statuses', jsonb_build_array('valid', 'expiring_soon', 'expired', 'missing'),
    'review_frequencies', jsonb_build_array('monthly', 'quarterly', 'annually'),
    'stats', public._ahostvnd_dashboard_stats(v_tenant_id),
    'vendors', v_vendors,
    'contracts', (
      select coalesce(jsonb_agg(public._ahostvnd_contract_row(c, v.company_name) order by c.end_date), '[]'::jsonb)
      from public.aipify_hosts_vendor_contracts c
      join public.aipify_hosts_vendors v on v.id = c.vendor_id
      where c.tenant_id = v_tenant_id
    ),
    'service_agreements', (
      select coalesce(jsonb_agg(public._ahostvnd_contract_row(c, v.company_name) order by c.end_date), '[]'::jsonb)
      from public.aipify_hosts_vendor_contracts c
      join public.aipify_hosts_vendors v on v.id = c.vendor_id
      where c.tenant_id = v_tenant_id and c.contract_type in ('service_agreement', 'cleaning_agreement')
    ),
    'certifications', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', cert.id, 'vendor_id', cert.vendor_id, 'vendor', v.company_name,
        'certification_type', cert.certification_type, 'document_name', cert.document_name,
        'expiry_date', cert.expiry_date::text,
        'verification_status', public._ahostvnd_cert_status(cert.expiry_date)
      ) order by cert.expiry_date nulls last), '[]'::jsonb)
      from public.aipify_hosts_vendor_certifications cert
      join public.aipify_hosts_vendors v on v.id = cert.vendor_id
      where cert.tenant_id = v_tenant_id
    ),
    'performance_reviews', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', r.id, 'vendor_id', r.vendor_id, 'vendor', v.company_name,
        'review_frequency', r.review_frequency,
        'reliability_score', r.reliability_score, 'response_time_score', r.response_time_score,
        'quality_rating', r.quality_rating, 'cost_effectiveness', r.cost_effectiveness,
        'overall_rating', r.overall_rating, 'review_notes', r.review_notes,
        'next_review_due', r.next_review_due::text,
        'created_at', to_char(r.created_at, 'YYYY-MM-DD HH24:MI')
      ) order by r.next_review_due nulls last), '[]'::jsonb)
      from public.aipify_hosts_vendor_performance_reviews r
      join public.aipify_hosts_vendors v on v.id = r.vendor_id
      where r.tenant_id = v_tenant_id
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 24 — Vendor Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_24_VENDOR_CENTER.text',
      'route', '/app/aipify-hosts/vendors'
    )
  );
end; $$;

create or replace function public.create_aipify_hosts_vendor(
  p_company_name text,
  p_service_category text,
  p_contact_person text default null,
  p_email text default null,
  p_phone_number text default null,
  p_coverage_area text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_key text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if coalesce(trim(p_company_name), '') = '' then raise exception 'Company name required'; end if;
  v_key := 'vnd_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  insert into public.aipify_hosts_vendors (
    tenant_id, vendor_key, company_name, contact_person, email, phone_number, service_category, coverage_area
  ) values (
    v_tenant_id, v_key, trim(p_company_name), p_contact_person, p_email, p_phone_number, p_service_category, p_coverage_area
  ) returning id into v_id;
  perform public._ahostvnd_log_event(v_tenant_id, 'vendor_created', 'Vendor created',
    jsonb_build_object('vendor_id', v_id));
  return jsonb_build_object('success', true, 'vendor_id', v_id);
end; $$;

create or replace function public.perform_aipify_hosts_vendor_action(
  p_vendor_id uuid,
  p_action_type text,
  p_property_id uuid default null,
  p_contract_id uuid default null,
  p_notes text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_vendor public.aipify_hosts_vendors; v_contract public.aipify_hosts_vendor_contracts;
  v_task_key text; v_summary text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into v_vendor from public.aipify_hosts_vendors where id = p_vendor_id and tenant_id = v_tenant_id;
  if v_vendor.id is null then raise exception 'Vendor not found'; end if;

  if p_action_type = 'assign_vendor' then
    v_summary := 'Vendor assigned: ' || v_vendor.company_name;
    v_task_key := 'task_vnd_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    insert into public.aipify_hosts_tasks (
      tenant_id, property_id, task_key, title, description, category, priority, assignee_name
    ) values (
      v_tenant_id, p_property_id, v_task_key, 'Vendor assignment: ' || v_vendor.company_name,
      v_summary, 'maintenance', 'medium', v_vendor.contact_person
    );
  elsif p_action_type = 'request_service' then
    v_summary := 'Service requested from ' || v_vendor.company_name;
    v_task_key := 'task_svc_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    insert into public.aipify_hosts_tasks (
      tenant_id, property_id, task_key, title, description, category, priority
    ) values (
      v_tenant_id, p_property_id, v_task_key, 'Service request: ' || v_vendor.company_name,
      coalesce(p_notes, v_summary),
      case when v_vendor.service_category = 'cleaning' then 'cleaning' else 'maintenance' end, 'high'
    );
  elsif p_action_type = 'review_performance' then
    insert into public.aipify_hosts_vendor_performance_reviews (
      tenant_id, vendor_id, review_frequency, reliability_score, response_time_score,
      quality_rating, cost_effectiveness, overall_rating, review_notes, next_review_due
    ) values (
      v_tenant_id, p_vendor_id, 'quarterly', 85, 82, 88, 80, 84,
      coalesce(p_notes, 'Performance review recorded'), current_date + 90
    );
    perform public._ahostvnd_push_notification(v_tenant_id, 'vnd_rev_' || p_vendor_id::text, 'important',
      'Vendor review recorded', 'Performance review completed for ' || v_vendor.company_name);
    v_summary := 'Performance review recorded';
  elsif p_action_type = 'renew_contract' then
    if p_contract_id is null then raise exception 'contract_id required'; end if;
    select * into v_contract from public.aipify_hosts_vendor_contracts
    where id = p_contract_id and tenant_id = v_tenant_id;
    update public.aipify_hosts_vendor_contracts set
      end_date = end_date + interval '1 year',
      contract_status = 'active',
      updated_at = now()
    where id = p_contract_id;
    perform public._ahostvnd_log_event(v_tenant_id, 'contract_renewed', 'Contract renewed',
      jsonb_build_object('contract_id', p_contract_id));
    v_summary := 'Contract renewed for ' || v_vendor.company_name;
  elsif p_action_type = 'archive_vendor' then
    update public.aipify_hosts_vendors set vendor_status = 'inactive', updated_at = now()
    where id = p_vendor_id;
    v_summary := 'Vendor archived: ' || v_vendor.company_name;
  elsif p_action_type = 'suspend_vendor' then
    update public.aipify_hosts_vendors set vendor_status = 'suspended', updated_at = now()
    where id = p_vendor_id;
    perform public._ahostvnd_push_notification(v_tenant_id, 'vnd_susp_' || p_vendor_id::text, 'high',
      'Vendor suspended', v_vendor.company_name || ' has been suspended');
    v_summary := 'Vendor suspended: ' || v_vendor.company_name;
  else
    raise exception 'Invalid action type';
  end if;

  perform public._ahostvnd_log_event(v_tenant_id, 'vendor_action', v_summary,
    jsonb_build_object('vendor_id', p_vendor_id, 'action_type', p_action_type));
  return jsonb_build_object('success', true, 'vendor_id', p_vendor_id, 'action_type', p_action_type);
end; $$;

create or replace function public._ahostvnd_check_notifications(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare r record;
begin
  for r in
    select c.id, v.company_name, c.end_date from public.aipify_hosts_vendor_contracts c
    join public.aipify_hosts_vendors v on v.id = c.vendor_id
    where c.tenant_id = p_tenant_id
      and public._ahostvnd_contract_status(c.end_date, c.contract_status) = 'expiring_soon'
  loop
    perform public._ahostvnd_push_notification(p_tenant_id, 'vnd_ctr_' || r.id::text, 'important',
      'Contract expiring within 30 days', r.company_name || ' contract expires ' || r.end_date::text);
  end loop;
  for r in
    select cert.id, v.company_name, cert.document_name, cert.expiry_date
    from public.aipify_hosts_vendor_certifications cert
    join public.aipify_hosts_vendors v on v.id = cert.vendor_id
    where cert.tenant_id = p_tenant_id
      and public._ahostvnd_cert_status(cert.expiry_date) = 'expiring_soon'
  loop
    perform public._ahostvnd_push_notification(p_tenant_id, 'vnd_cert_' || r.id::text, 'high',
      'Certification expiring', r.document_name || ' for ' || r.company_name || ' expires soon');
  end loop;
  for r in
    select r2.id, v.company_name from public.aipify_hosts_vendor_performance_reviews r2
    join public.aipify_hosts_vendors v on v.id = r2.vendor_id
    where r2.tenant_id = p_tenant_id and r2.next_review_due <= current_date + 7
  loop
    perform public._ahostvnd_push_notification(p_tenant_id, 'vnd_due_' || r.id::text, 'important',
      'Vendor review due', 'Performance review due for ' || r.company_name);
  end loop;
end; $$;

create or replace function public.seed_aipify_hosts_vendor_center_knowledge_airbnb24()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-vendors', 'Hosts Vendor Center',
    'Selecting vendors, managing agreements, reviews, and contract lifecycle.', 320
  );
  perform public._ahostkc_seed_article('aipify-hosts-vendors', 'selecting-reliable-vendors', 'Selecting reliable vendors',
    'Evaluate coverage area, certifications, references, and response time before activating a vendor.');
  perform public._ahostkc_seed_article('aipify-hosts-vendors', 'managing-hospitality-service-agreements', 'Managing hospitality service agreements',
    'Document scope, renewal terms, and escalation paths in every service agreement.');
  perform public._ahostkc_seed_article('aipify-hosts-vendors', 'vendor-review-best-practices', 'Vendor review best practices',
    'Review reliability, quality, response time, and cost effectiveness on a consistent schedule.');
  perform public._ahostkc_seed_article('aipify-hosts-vendors', 'contract-lifecycle-management', 'Contract lifecycle management',
    'Track draft through active, expiring soon, expired, and terminated states with audited renewals.');
end; $$;

select public.seed_aipify_hosts_vendor_center_knowledge_airbnb24();

grant execute on function public.get_aipify_hosts_vendor_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_vendor_center_dashboard(text, uuid) to authenticated;
grant execute on function public.create_aipify_hosts_vendor(text, text, text, text, text, text, uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_vendor_action(uuid, text, uuid, uuid, text, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_vendor_center_knowledge_airbnb24() to authenticated;
