-- Growth Partner Economy Engine — Partner Sales & Self-Billing Framework
-- Feature owner: PARTNERS PORTAL. Helpers: _gpgee_*

create table if not exists public.growth_partner_economy_profiles (
  partner_org_id uuid primary key references public.growth_partner_portal_organizations (id) on delete cascade,
  company_type text check (company_type in ('norwegian_as', 'norwegian_enk', 'foreign_equivalent')),
  company_name text not null default '',
  organization_number text not null default '',
  vat_number text not null default '',
  vat_registered boolean not null default false,
  business_address jsonb not null default '{}'::jsonb,
  bank_account jsonb not null default '{}'::jsonb,
  country_code text not null default 'NO',
  invoice_prefix text not null default '',
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'in_review', 'verified', 'rejected', 'no_company')
  ),
  verification_checklist jsonb not null default '{}'::jsonb,
  can_earn_commissions boolean not null default false,
  approved_sales_count integer not null default 0 check (approved_sales_count >= 0),
  current_commission_tier_pct numeric(5, 2) not null default 5 check (current_commission_tier_pct between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  verified_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.growth_partner_economy_agreements (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  agreement_type text not null check (
    agreement_type in ('growth_partner_agreement', 'self_billing_agreement', 'partner_terms')
  ),
  version text not null default '1.0',
  accepted boolean not null default false,
  accepted_at timestamptz,
  accepted_by uuid,
  acceptance_ip text,
  metadata jsonb not null default '{}'::jsonb,
  unique (partner_org_id, agreement_type, version)
);

create table if not exists public.growth_partner_economy_sales (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  sale_key text not null,
  customer_label text not null default '',
  plan_key text not null default 'professional',
  sale_amount numeric(12, 2) not null default 0 check (sale_amount >= 0),
  is_first_purchase boolean not null default true,
  is_enterprise boolean not null default false,
  sale_status text not null default 'pending_verification' check (
    sale_status in ('pending_verification', 'approved', 'rejected')
  ),
  verified_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (partner_org_id, sale_key)
);

create index if not exists growth_partner_economy_sales_org_idx
  on public.growth_partner_economy_sales (partner_org_id, sale_status, created_at desc);

create table if not exists public.growth_partner_economy_commissions (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  sale_id uuid not null references public.growth_partner_economy_sales (id) on delete cascade,
  commission_type text not null default 'initial' check (commission_type = 'initial'),
  commission_rate_pct numeric(5, 2) not null default 5,
  commission_basis numeric(12, 2) not null default 0,
  commission_amount numeric(12, 2) not null default 0,
  commission_status text not null default 'pending' check (
    commission_status in ('pending', 'included_in_settlement', 'paid', 'withheld')
  ),
  settlement_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (sale_id)
);

create index if not exists growth_partner_economy_commissions_org_idx
  on public.growth_partner_economy_commissions (partner_org_id, commission_status);

create table if not exists public.growth_partner_economy_milestones (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  milestone_key text not null,
  milestone_label text not null default '',
  achieved boolean not null default false,
  achieved_at timestamptz,
  bonus_amount numeric(12, 2),
  metadata jsonb not null default '{}'::jsonb,
  unique (partner_org_id, milestone_key)
);

create table if not exists public.growth_partner_economy_settlements (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  settlement_key text not null,
  settlement_period text not null,
  period_from date not null,
  period_to date not null,
  commission_total numeric(12, 2) not null default 0,
  bonus_total numeric(12, 2) not null default 0,
  vat_amount numeric(12, 2) not null default 0,
  total_payable numeric(12, 2) not null default 0,
  settlement_status text not null default 'pending_partner_approval' check (
    settlement_status in ('pending_partner_approval', 'approved', 'invoice_generated', 'paid', 'cancelled')
  ),
  partner_approved_at timestamptz,
  partner_approved_by uuid,
  approval_statement text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (partner_org_id, settlement_key)
);

create index if not exists growth_partner_economy_settlements_org_idx
  on public.growth_partner_economy_settlements (partner_org_id, settlement_status, created_at desc);

create table if not exists public.growth_partner_economy_invoice_sequences (
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  invoice_year integer not null,
  last_sequence integer not null default 0,
  primary key (partner_org_id, invoice_year)
);

create table if not exists public.growth_partner_economy_invoices (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  settlement_id uuid not null references public.growth_partner_economy_settlements (id) on delete restrict,
  invoice_number text not null,
  issue_date date not null default current_date,
  settlement_period text not null,
  description text not null default 'Growth Partner commission — initial sale',
  commission_basis numeric(12, 2) not null default 0,
  vat_rate_pct numeric(5, 2) not null default 0,
  vat_amount numeric(12, 2) not null default 0,
  total_amount numeric(12, 2) not null default 0,
  payment_terms text not null default '30 days',
  invoice_status text not null default 'draft' check (
    invoice_status in ('draft', 'finalized', 'delivered', 'paid')
  ),
  partner_company_snapshot jsonb not null default '{}'::jsonb,
  aipify_company_snapshot jsonb not null default '{}'::jsonb,
  finalized_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (partner_org_id, invoice_number),
  unique (settlement_id)
);

create table if not exists public.growth_partner_economy_audit_logs (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  actor_auth_user_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists growth_partner_economy_audit_org_idx
  on public.growth_partner_economy_audit_logs (partner_org_id, created_at desc);

alter table public.growth_partner_economy_profiles enable row level security;
alter table public.growth_partner_economy_agreements enable row level security;
alter table public.growth_partner_economy_sales enable row level security;
alter table public.growth_partner_economy_commissions enable row level security;
alter table public.growth_partner_economy_milestones enable row level security;
alter table public.growth_partner_economy_settlements enable row level security;
alter table public.growth_partner_economy_invoice_sequences enable row level security;
alter table public.growth_partner_economy_invoices enable row level security;
alter table public.growth_partner_economy_audit_logs enable row level security;
revoke all on public.growth_partner_economy_profiles from authenticated, anon;
revoke all on public.growth_partner_economy_agreements from authenticated, anon;
revoke all on public.growth_partner_economy_sales from authenticated, anon;
revoke all on public.growth_partner_economy_commissions from authenticated, anon;
revoke all on public.growth_partner_economy_milestones from authenticated, anon;
revoke all on public.growth_partner_economy_settlements from authenticated, anon;
revoke all on public.growth_partner_economy_invoice_sequences from authenticated, anon;
revoke all on public.growth_partner_economy_invoices from authenticated, anon;
revoke all on public.growth_partner_economy_audit_logs from authenticated, anon;

create or replace function public._gpgee_commission_tier(p_approved_count integer)
returns numeric
language sql
immutable
as $$
  select case
    when p_approved_count >= 100 then 25
    when p_approved_count >= 50 then 20
    when p_approved_count >= 25 then 15
    when p_approved_count >= 10 then 10
    else 5
  end;
$$;

create or replace function public._gpgee_require_partner()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_org_id uuid;
begin
  v_org_id := public._gppf05_require_org();
  perform public._gpgee_ensure_profile(v_org_id);
  return v_org_id;
end;
$$;

create or replace function public._gpgee_ensure_profile(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_prefix text; v_name text;
begin
  select left(upper(regexp_replace(coalesce(o.org_name, 'GP'), '[^A-Za-z0-9]', '', 'g')), 3)
  into v_prefix from public.growth_partner_portal_organizations o where o.id = p_org_id;
  insert into public.growth_partner_economy_profiles (partner_org_id, invoice_prefix)
  values (p_org_id, coalesce(nullif(v_prefix, ''), 'GP'))
  on conflict (partner_org_id) do nothing;

  insert into public.growth_partner_economy_agreements (partner_org_id, agreement_type)
  values
    (p_org_id, 'growth_partner_agreement'),
    (p_org_id, 'self_billing_agreement'),
    (p_org_id, 'partner_terms')
  on conflict (partner_org_id, agreement_type, version) do nothing;

  insert into public.growth_partner_economy_milestones (partner_org_id, milestone_key, milestone_label) values
    (p_org_id, 'first_sale', 'First sale completed'),
    (p_org_id, 'first_enterprise', 'First Enterprise customer'),
    (p_org_id, 'sales_10', '10 completed sales'),
    (p_org_id, 'sales_50', '50 completed sales'),
    (p_org_id, 'sales_100', '100 completed sales')
  on conflict (partner_org_id, milestone_key) do nothing;
end;
$$;

create or replace function public._gpgee_refresh_verification(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.growth_partner_economy_profiles;
  v_all_agreements boolean;
  v_verified boolean := true;
begin
  select * into v_profile from public.growth_partner_economy_profiles where partner_org_id = p_org_id;
  if not found then return; end if;

  if v_profile.company_type is null or v_profile.organization_number = '' or v_profile.company_name = '' then
    v_verified := false;
  end if;
  if coalesce(v_profile.business_address->>'line1', '') = '' then v_verified := false; end if;
  if coalesce(v_profile.bank_account->>'iban', '') = '' and coalesce(v_profile.bank_account->>'account_number', '') = '' then
    v_verified := false;
  end if;

  select bool_and(a.accepted) into v_all_agreements
  from public.growth_partner_economy_agreements a where a.partner_org_id = p_org_id;
  if coalesce(v_all_agreements, false) = false then v_verified := false; end if;

  update public.growth_partner_economy_profiles set
    verification_status = case
      when company_type is null then 'no_company'
      when v_verified then 'verified'
      else coalesce(nullif(verification_status, 'verified'), 'pending')
    end,
    can_earn_commissions = v_verified,
    updated_at = now()
  where partner_org_id = p_org_id;
end;
$$;

create or replace function public._gpgee_sync_commissions(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.growth_partner_economy_profiles;
  v_tier numeric;
  v_sale record;
  v_count integer;
begin
  select * into v_profile from public.growth_partner_economy_profiles where partner_org_id = p_org_id;
  select count(*)::integer into v_count from public.growth_partner_economy_sales s
  where s.partner_org_id = p_org_id and s.sale_status = 'approved' and s.is_first_purchase = true;

  v_tier := public._gpgee_commission_tier(v_count);
  update public.growth_partner_economy_profiles set
    approved_sales_count = v_count,
    current_commission_tier_pct = v_tier,
    updated_at = now()
  where partner_org_id = p_org_id;

  if coalesce(v_profile.can_earn_commissions, false) = false then return; end if;

  for v_sale in
    select * from public.growth_partner_economy_sales s
    where s.partner_org_id = p_org_id and s.sale_status = 'approved' and s.is_first_purchase = true
  loop
    insert into public.growth_partner_economy_commissions (
      partner_org_id, sale_id, commission_type, commission_rate_pct, commission_basis, commission_amount
    ) values (
      p_org_id, v_sale.id, 'initial', v_tier, v_sale.sale_amount,
      round(v_sale.sale_amount * v_tier / 100.0, 2)
    )
    on conflict (sale_id) do update set
      commission_rate_pct = excluded.commission_rate_pct,
      commission_basis = excluded.commission_basis,
      commission_amount = excluded.commission_amount;
  end loop;

  update public.growth_partner_economy_milestones set achieved = true, achieved_at = coalesce(achieved_at, now())
  where partner_org_id = p_org_id and milestone_key = 'first_sale' and v_count >= 1 and achieved = false;
  update public.growth_partner_economy_milestones set achieved = true, achieved_at = coalesce(achieved_at, now())
  where partner_org_id = p_org_id and milestone_key = 'sales_10' and v_count >= 10 and achieved = false;
  update public.growth_partner_economy_milestones set achieved = true, achieved_at = coalesce(achieved_at, now())
  where partner_org_id = p_org_id and milestone_key = 'sales_50' and v_count >= 50 and achieved = false;
  update public.growth_partner_economy_milestones set achieved = true, achieved_at = coalesce(achieved_at, now())
  where partner_org_id = p_org_id and milestone_key = 'sales_100' and v_count >= 100 and achieved = false;
  update public.growth_partner_economy_milestones set achieved = true, achieved_at = coalesce(achieved_at, now())
  where partner_org_id = p_org_id and milestone_key = 'first_enterprise' and exists (
    select 1 from public.growth_partner_economy_sales s
    where s.partner_org_id = p_org_id and s.sale_status = 'approved' and s.is_enterprise = true
  ) and achieved = false;
end;
$$;

create or replace function public._gpgee_seed_demo_sales(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.growth_partner_economy_sales where partner_org_id = p_org_id) then return; end if;
  insert into public.growth_partner_economy_sales (
    partner_org_id, sale_key, customer_label, plan_key, sale_amount, is_first_purchase, is_enterprise, sale_status, verified_at
  ) values
    (p_org_id, 'demo-001', 'Nordic Operations AS', 'business', 12000, true, false, 'approved', now()),
    (p_org_id, 'demo-002', 'Bergen Tech ENK', 'professional', 4800, true, false, 'approved', now());
end;
$$;

create or replace function public.get_growth_partner_economy_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid; v_profile record; v_pending numeric; v_milestones jsonb; v_settlements jsonb;
begin
  v_org_id := public._gpgee_require_partner();
  perform public._gpgee_seed_demo_sales(v_org_id);
  perform public._gpgee_sync_commissions(v_org_id);

  select p.* into v_profile from public.growth_partner_economy_profiles p where p.partner_org_id = v_org_id;

  select coalesce(sum(c.commission_amount), 0) into v_pending
  from public.growth_partner_economy_commissions c
  where c.partner_org_id = v_org_id and c.commission_status = 'pending';

  select coalesce(jsonb_agg(jsonb_build_object(
    'milestone_key', m.milestone_key, 'label', m.milestone_label, 'achieved', m.achieved, 'achieved_at', m.achieved_at
  ) order by m.milestone_key), '[]'::jsonb) into v_milestones
  from public.growth_partner_economy_milestones m where m.partner_org_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'settlement_key', s.settlement_key, 'settlement_period', s.settlement_period,
    'total_payable', s.total_payable, 'settlement_status', s.settlement_status, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb) into v_settlements
  from (
    select * from public.growth_partner_economy_settlements
    where partner_org_id = v_org_id order by created_at desc limit 10
  ) s;

  return jsonb_build_object(
    'found', true,
    'principle', 'Growth Partners are independent businesses — one-time commissions on initial sales only. No recurring commissions.',
    'no_company', v_profile.verification_status = 'no_company',
    'can_earn_commissions', coalesce(v_profile.can_earn_commissions, false),
    'verification_status', v_profile.verification_status,
    'company_name', v_profile.company_name,
    'approved_sales_count', v_profile.approved_sales_count,
    'current_commission_tier_pct', v_profile.current_commission_tier_pct,
    'pending_commission_total', v_pending,
    'milestones', v_milestones,
    'pending_settlements', (
      select coalesce(jsonb_agg(jsonb_build_object('id', s.id, 'settlement_period', s.settlement_period, 'total_payable', s.total_payable)), '[]'::jsonb)
      from public.growth_partner_economy_settlements s
      where s.partner_org_id = v_org_id and s.settlement_status = 'pending_partner_approval'
    ),
    'recent_settlements', v_settlements,
    'agreements', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'agreement_type', a.agreement_type, 'accepted', a.accepted, 'accepted_at', a.accepted_at
      )), '[]'::jsonb)
      from public.growth_partner_economy_agreements a where a.partner_org_id = v_org_id
    )
  );
end;
$$;

create or replace function public.list_growth_partner_economy_sales(
  p_status text default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_org_id uuid; v_sales jsonb;
begin
  v_org_id := public._gpgee_require_partner();
  perform public._gpgee_sync_commissions(v_org_id);

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb) into v_sales
  from (
    select jsonb_build_object(
      'id', s.id, 'sale_key', s.sale_key, 'customer_label', s.customer_label,
      'plan_key', s.plan_key, 'sale_amount', s.sale_amount, 'sale_status', s.sale_status,
      'is_enterprise', s.is_enterprise, 'created_at', s.created_at
    ) as row
    from public.growth_partner_economy_sales s
    where s.partner_org_id = v_org_id
      and (p_status is null or s.sale_status = p_status)
      and (p_search is null or trim(p_search) = '' or s.customer_label ilike '%' || trim(p_search) || '%')
    order by s.created_at desc limit 50
  ) sub;

  return jsonb_build_object('found', true, 'sales', v_sales);
end;
$$;

create or replace function public.list_growth_partner_economy_commissions()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_org_id uuid; v_commissions jsonb;
begin
  v_org_id := public._gpgee_require_partner();
  perform public._gpgee_sync_commissions(v_org_id);

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb) into v_commissions
  from (
    select jsonb_build_object(
      'id', c.id, 'customer_label', s.customer_label, 'commission_rate_pct', c.commission_rate_pct,
      'commission_basis', c.commission_basis, 'commission_amount', c.commission_amount,
      'commission_status', c.commission_status, 'created_at', c.created_at
    ) as row
    from public.growth_partner_economy_commissions c
    join public.growth_partner_economy_sales s on s.id = c.sale_id
    where c.partner_org_id = v_org_id
    order by c.created_at desc limit 50
  ) sub;

  return jsonb_build_object('found', true, 'commissions', v_commissions);
end;
$$;

create or replace function public.list_growth_partner_economy_invoices()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_org_id uuid; v_invoices jsonb;
begin
  v_org_id := public._gpgee_require_partner();

  select coalesce(jsonb_agg(row order by row->>'issue_date' desc), '[]'::jsonb) into v_invoices
  from (
    select jsonb_build_object(
      'id', i.id, 'invoice_number', i.invoice_number, 'issue_date', i.issue_date,
      'settlement_period', i.settlement_period, 'total_amount', i.total_amount,
      'invoice_status', i.invoice_status, 'finalized_at', i.finalized_at
    ) as row
    from public.growth_partner_economy_invoices i
    where i.partner_org_id = v_org_id
    order by i.issue_date desc limit 50
  ) sub;

  return jsonb_build_object('found', true, 'invoices', v_invoices);
end;
$$;

create or replace function public.get_growth_partner_economy_settlement(p_settlement_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_org_id uuid; v_row record;
begin
  v_org_id := public._gpgee_require_partner();
  select * into v_row from public.growth_partner_economy_settlements s
  where s.partner_org_id = v_org_id and s.id = p_settlement_id;
  if not found then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'settlement_key', v_row.settlement_key,
    'settlement_period', v_row.settlement_period,
    'period_from', v_row.period_from,
    'period_to', v_row.period_to,
    'commission_total', v_row.commission_total,
    'bonus_total', v_row.bonus_total,
    'vat_amount', v_row.vat_amount,
    'total_payable', v_row.total_payable,
    'settlement_status', v_row.settlement_status,
    'partner_approved_at', v_row.partner_approved_at,
    'approval_statement', 'I confirm that the settlement information is accurate and authorize Aipify Group AS to issue an invoice on behalf of my business.',
    'commissions', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'customer_label', s.customer_label, 'commission_amount', c.commission_amount
      )), '[]'::jsonb)
      from public.growth_partner_economy_commissions c
      join public.growth_partner_economy_sales s on s.id = c.sale_id
      where c.settlement_id = v_row.id
    )
  );
end;
$$;

create or replace function public.create_growth_partner_economy_settlement()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid; v_profile record; v_total numeric; v_settlement_id uuid; v_key text;
begin
  v_org_id := public._gpgee_require_partner();
  select * into v_profile from public.growth_partner_economy_profiles where partner_org_id = v_org_id;
  if coalesce(v_profile.can_earn_commissions, false) = false then
    raise exception 'Commissions require completed partner verification';
  end if;

  perform public._gpgee_sync_commissions(v_org_id);

  select coalesce(sum(c.commission_amount), 0) into v_total
  from public.growth_partner_economy_commissions c
  where c.partner_org_id = v_org_id and c.commission_status = 'pending';

  if v_total <= 0 then raise exception 'No pending commissions available for settlement'; end if;

  v_key := 'STL-' || to_char(now(), 'YYYYMM') || '-' || left(replace(gen_random_uuid()::text, '-', ''), 6);

  insert into public.growth_partner_economy_settlements (
    partner_org_id, settlement_key, settlement_period, period_from, period_to,
    commission_total, total_payable, settlement_status
  ) values (
    v_org_id, v_key, to_char(now(), 'YYYY-MM'), date_trunc('month', now())::date,
    (date_trunc('month', now()) + interval '1 month - 1 day')::date,
    v_total, v_total, 'pending_partner_approval'
  ) returning id into v_settlement_id;

  update public.growth_partner_economy_commissions set
    commission_status = 'included_in_settlement', settlement_id = v_settlement_id
  where partner_org_id = v_org_id and commission_status = 'pending';

  insert into public.growth_partner_economy_audit_logs (
    partner_org_id, event_type, description, actor_auth_user_id, metadata
  ) values (
    v_org_id, 'settlement_created', 'Settlement prepared for partner review', auth.uid(),
    jsonb_build_object('settlement_id', v_settlement_id, 'total', v_total)
  );

  return jsonb_build_object('found', true, 'settlement_id', v_settlement_id, 'total_payable', v_total);
end;
$$;

create or replace function public.approve_growth_partner_economy_settlement(
  p_settlement_id uuid,
  p_approval_statement text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid; v_settlement record; v_profile record;
  v_year integer; v_seq integer; v_invoice_number text; v_vat numeric; v_vat_rate numeric := 0;
  v_invoice_id uuid;
begin
  v_org_id := public._gpgee_require_partner();
  if public._gppf05_member_role(v_org_id) not in ('partner_owner', 'partner_manager') then
    raise exception 'Settlement approval requires partner owner or manager role';
  end if;

  select * into v_settlement from public.growth_partner_economy_settlements
  where id = p_settlement_id and partner_org_id = v_org_id;
  if not found then raise exception 'Settlement not found'; end if;
  if v_settlement.settlement_status <> 'pending_partner_approval' then
    raise exception 'Settlement is not awaiting partner approval';
  end if;

  select * into v_profile from public.growth_partner_economy_profiles where partner_org_id = v_org_id;
  if not exists (
    select 1 from public.growth_partner_economy_agreements a
    where a.partner_org_id = v_org_id and a.agreement_type = 'self_billing_agreement' and a.accepted = true
  ) then raise exception 'Self-Billing Agreement must be accepted before invoice generation'; end if;

  v_vat_rate := case when coalesce(v_profile.vat_registered, false) then 25 else 0 end;
  v_vat := round(v_settlement.commission_total * v_vat_rate / 100.0, 2);

  update public.growth_partner_economy_settlements set
    settlement_status = 'approved',
    partner_approved_at = now(),
    partner_approved_by = auth.uid(),
    approval_statement = coalesce(p_approval_statement, 'Partner approved settlement for self-billing invoice generation.'),
    vat_amount = v_vat,
    total_payable = v_settlement.commission_total + v_vat
  where id = p_settlement_id;

  v_year := extract(year from now())::integer;
  insert into public.growth_partner_economy_invoice_sequences (partner_org_id, invoice_year, last_sequence)
  values (v_org_id, v_year, 0)
  on conflict (partner_org_id, invoice_year) do nothing;

  update public.growth_partner_economy_invoice_sequences set last_sequence = last_sequence + 1
  where partner_org_id = v_org_id and invoice_year = v_year
  returning last_sequence into v_seq;

  v_invoice_number := coalesce(nullif(v_profile.invoice_prefix, ''), 'GP') || '-' || v_year::text || '-' || lpad(v_seq::text, 4, '0');

  insert into public.growth_partner_economy_invoices (
    partner_org_id, settlement_id, invoice_number, settlement_period, commission_basis,
    vat_rate_pct, vat_amount, total_amount, invoice_status,
    partner_company_snapshot, aipify_company_snapshot, finalized_at
  ) values (
    v_org_id, p_settlement_id, v_invoice_number, v_settlement.settlement_period,
    v_settlement.commission_total, v_vat_rate, v_vat, v_settlement.commission_total + v_vat, 'finalized',
    jsonb_build_object(
      'company_name', v_profile.company_name,
      'organization_number', v_profile.organization_number,
      'vat_number', v_profile.vat_number,
      'address', v_profile.business_address
    ),
    jsonb_build_object(
      'company_name', 'Aipify Group AS',
      'organization_number', '923456789',
      'address', jsonb_build_object('line1', 'Bergen, Norway')
    ),
    now()
  ) returning id into v_invoice_id;

  update public.growth_partner_economy_settlements set settlement_status = 'invoice_generated' where id = p_settlement_id;

  insert into public.growth_partner_economy_audit_logs (
    partner_org_id, event_type, description, actor_auth_user_id, metadata
  ) values (
    v_org_id, 'settlement_approved', 'Partner approved settlement — self-billing invoice generated', auth.uid(),
    jsonb_build_object('settlement_id', p_settlement_id, 'invoice_id', v_invoice_id, 'invoice_number', v_invoice_number)
  );

  return jsonb_build_object(
    'found', true, 'settlement_id', p_settlement_id, 'invoice_id', v_invoice_id,
    'invoice_number', v_invoice_number,
    'message', 'Settlement approved. Aipify Group AS generated a compliant self-billing invoice on behalf of your business.'
  );
end;
$$;

create or replace function public.accept_growth_partner_economy_agreement(
  p_agreement_type text,
  p_company_profile jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare v_org_id uuid;
begin
  v_org_id := public._gpgee_require_partner();
  if p_agreement_type not in ('growth_partner_agreement', 'self_billing_agreement', 'partner_terms') then
    raise exception 'Invalid agreement type';
  end if;

  if p_company_profile is not null then
    update public.growth_partner_economy_profiles set
      company_type = coalesce(p_company_profile->>'company_type', company_type),
      company_name = coalesce(p_company_profile->>'company_name', company_name),
      organization_number = coalesce(p_company_profile->>'organization_number', organization_number),
      vat_number = coalesce(p_company_profile->>'vat_number', vat_number),
      vat_registered = coalesce((p_company_profile->>'vat_registered')::boolean, vat_registered),
      country_code = coalesce(p_company_profile->>'country_code', country_code),
      business_address = coalesce(p_company_profile->'business_address', business_address),
      bank_account = coalesce(p_company_profile->'bank_account', bank_account),
      updated_at = now()
    where partner_org_id = v_org_id;
  end if;

  update public.growth_partner_economy_agreements set
    accepted = true, accepted_at = now(), accepted_by = auth.uid()
  where partner_org_id = v_org_id and agreement_type = p_agreement_type;

  perform public._gpgee_refresh_verification(v_org_id);

  insert into public.growth_partner_economy_audit_logs (
    partner_org_id, event_type, description, actor_auth_user_id, metadata
  ) values (
    v_org_id, 'agreement_accepted', 'Growth Partner agreement accepted', auth.uid(),
    jsonb_build_object('agreement_type', p_agreement_type)
  );

  return jsonb_build_object('found', true, 'agreement_type', p_agreement_type);
end;
$$;

grant execute on function public.get_growth_partner_economy_overview() to authenticated;
grant execute on function public.list_growth_partner_economy_sales(text, text) to authenticated;
grant execute on function public.list_growth_partner_economy_commissions() to authenticated;
grant execute on function public.list_growth_partner_economy_invoices() to authenticated;
grant execute on function public.get_growth_partner_economy_settlement(uuid) to authenticated;
grant execute on function public.create_growth_partner_economy_settlement() to authenticated;
grant execute on function public.approve_growth_partner_economy_settlement(uuid, text) to authenticated;
grant execute on function public.accept_growth_partner_economy_agreement(text, jsonb) to authenticated;
