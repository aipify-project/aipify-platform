-- Foundation 05 — Growth Partner Portal Foundation
-- Feature owner: GROWTH PARTNER PORTAL. Helpers: _gppf05_* (engine), _gppf05bp_* (blueprint)

create table if not exists public.growth_partner_portal_organizations (
  id uuid primary key default gen_random_uuid(),
  org_key text not null unique,
  org_name text not null,
  partner_tenant_id uuid references public.customers (id) on delete set null,
  certification_status text not null default 'certified' check (
    certification_status in ('pending', 'certified', 'professional', 'enterprise', 'master')
  ),
  enabled boolean not null default true,
  metadata jsonb not null default '{"external_portal":true,"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.growth_partner_portal_organizations enable row level security;
revoke all on public.growth_partner_portal_organizations from authenticated, anon;

create table if not exists public.growth_partner_portal_members (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  auth_user_id uuid not null,
  member_email text,
  member_name text not null default '',
  team_role text not null default 'sales_member' check (
    team_role in ('partner_owner', 'partner_manager', 'sales_member')
  ),
  member_status text not null default 'active' check (
    member_status in ('invited', 'active', 'suspended')
  ),
  invited_at timestamptz,
  joined_at timestamptz default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_org_id, auth_user_id)
);
create index if not exists growth_partner_portal_members_auth_idx
  on public.growth_partner_portal_members (auth_user_id, member_status);
alter table public.growth_partner_portal_members enable row level security;
revoke all on public.growth_partner_portal_members from authenticated, anon;

create table if not exists public.growth_partner_portal_settings (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade unique,
  default_section text not null default 'dashboard' check (
    default_section in (
      'dashboard', 'leads', 'referrals', 'commissions', 'payouts',
      'academy', 'assets', 'team', 'settings'
    )
  ),
  notification_email text,
  metadata jsonb not null default '{"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.growth_partner_portal_settings enable row level security;
revoke all on public.growth_partner_portal_settings from authenticated, anon;

create table if not exists public.growth_partner_portal_leads (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  lead_key text not null,
  company_name text not null,
  contact_name text,
  contact_email text,
  lead_status text not null default 'new' check (
    lead_status in ('new', 'contacted', 'qualified', 'trial_started', 'converted', 'lost')
  ),
  source text,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_org_id, lead_key)
);
create index if not exists growth_partner_portal_leads_org_idx
  on public.growth_partner_portal_leads (partner_org_id, lead_status, created_at desc);
alter table public.growth_partner_portal_leads enable row level security;
revoke all on public.growth_partner_portal_leads from authenticated, anon;

create table if not exists public.growth_partner_portal_referrals (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  referral_key text not null,
  prospect_name text not null,
  prospect_email text,
  referral_status text not null default 'invited' check (
    referral_status in ('invited', 'registered', 'trial_started', 'converted', 'active', 'rewarded')
  ),
  invited_at timestamptz default now(),
  converted_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_org_id, referral_key)
);
create index if not exists growth_partner_portal_referrals_org_idx
  on public.growth_partner_portal_referrals (partner_org_id, referral_status, created_at desc);
alter table public.growth_partner_portal_referrals enable row level security;
revoke all on public.growth_partner_portal_referrals from authenticated, anon;

create table if not exists public.growth_partner_portal_commissions (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  commission_key text not null,
  customer_label text not null,
  amount numeric(12, 2) not null default 0,
  commission_status text not null default 'pending' check (
    commission_status in ('pending', 'approved', 'scheduled', 'paid', 'rejected')
  ),
  expected_payout_date date,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_org_id, commission_key)
);
create index if not exists growth_partner_portal_commissions_org_idx
  on public.growth_partner_portal_commissions (partner_org_id, commission_status);
alter table public.growth_partner_portal_commissions enable row level security;
revoke all on public.growth_partner_portal_commissions from authenticated, anon;

create table if not exists public.growth_partner_portal_payouts (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  payout_key text not null,
  payout_period text not null,
  total_amount numeric(12, 2) not null default 0,
  payout_status text not null default 'scheduled' check (
    payout_status in ('scheduled', 'processing', 'completed', 'failed')
  ),
  scheduled_date date,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (partner_org_id, payout_key)
);
create index if not exists growth_partner_portal_payouts_org_idx
  on public.growth_partner_portal_payouts (partner_org_id, scheduled_date desc);
alter table public.growth_partner_portal_payouts enable row level security;
revoke all on public.growth_partner_portal_payouts from authenticated, anon;

create table if not exists public.growth_partner_portal_academy_modules (
  id uuid primary key default gen_random_uuid(),
  module_key text not null unique,
  module_type text not null check (
    module_type in ('training', 'playbook', 'product_knowledge', 'compliance', 'certification')
  ),
  title text not null,
  summary text,
  sort_order int not null default 100,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.growth_partner_portal_academy_modules enable row level security;
revoke all on public.growth_partner_portal_academy_modules from authenticated, anon;

create table if not exists public.growth_partner_portal_academy_progress (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  module_id uuid not null references public.growth_partner_portal_academy_modules (id) on delete cascade,
  progress_pct int not null default 0 check (progress_pct between 0 and 100),
  completed boolean not null default false,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (partner_org_id, module_id)
);
alter table public.growth_partner_portal_academy_progress enable row level security;
revoke all on public.growth_partner_portal_academy_progress from authenticated, anon;

create table if not exists public.growth_partner_portal_assets (
  id uuid primary key default gen_random_uuid(),
  asset_key text not null unique,
  asset_type text not null check (
    asset_type in ('logo', 'banner', 'email_template', 'sales_deck', 'one_pager', 'social')
  ),
  title text not null,
  description text,
  download_label text,
  sort_order int not null default 100,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.growth_partner_portal_assets enable row level security;
revoke all on public.growth_partner_portal_assets from authenticated, anon;

create table if not exists public.growth_partner_portal_audit_logs (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  event_type text not null,
  summary text not null,
  actor_auth_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists growth_partner_portal_audit_org_idx
  on public.growth_partner_portal_audit_logs (partner_org_id, created_at desc);
alter table public.growth_partner_portal_audit_logs enable row level security;
revoke all on public.growth_partner_portal_audit_logs from authenticated, anon;

create or replace function public._gppf05bp_positioning() returns text language sql immutable as $$
  select 'Certified Growth Partners track leads, referrals, commissions, academy progress, and approved assets in one dedicated sales workspace.'; $$;

create or replace function public._gppf05bp_routes() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'dashboard', 'route', '/growth-partner/dashboard'),
    jsonb_build_object('key', 'leads', 'route', '/growth-partner/leads'),
    jsonb_build_object('key', 'referrals', 'route', '/growth-partner/referrals'),
    jsonb_build_object('key', 'commissions', 'route', '/growth-partner/commissions'),
    jsonb_build_object('key', 'payouts', 'route', '/growth-partner/payouts'),
    jsonb_build_object('key', 'academy', 'route', '/growth-partner/academy'),
    jsonb_build_object('key', 'assets', 'route', '/growth-partner/assets'),
    jsonb_build_object('key', 'team', 'route', '/growth-partner/team'),
    jsonb_build_object('key', 'settings', 'route', '/growth-partner/settings')
  ); $$;

create or replace function public._gppf05_resolve_org()
returns uuid language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return null; end if;
  select m.partner_org_id into v_org_id
  from public.growth_partner_portal_members m
  where m.auth_user_id = auth.uid() and m.member_status = 'active'
  order by m.created_at limit 1;
  return v_org_id;
end; $$;

create or replace function public._gppf05_require_org()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._gppf05_resolve_org();
  if v_org_id is null then raise exception 'Growth Partner access required'; end if;
  return v_org_id;
end; $$;

create or replace function public._gppf05_member_role(p_org_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_role text;
begin
  select team_role into v_role from public.growth_partner_portal_members
  where partner_org_id = p_org_id and auth_user_id = auth.uid() and member_status = 'active'
  limit 1;
  return coalesce(v_role, 'sales_member');
end; $$;

create or replace function public._gppf05_log_audit(
  p_org_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_audit_logs (
    partner_org_id, event_type, summary, actor_auth_user_id, context
  ) values (
    p_org_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._gppf05_ensure_settings(p_org_id uuid)
returns public.growth_partner_portal_settings language plpgsql security definer set search_path = public as $$
declare v_row public.growth_partner_portal_settings;
begin
  insert into public.growth_partner_portal_settings (partner_org_id)
  values (p_org_id) on conflict (partner_org_id) do nothing;
  select * into v_row from public.growth_partner_portal_settings where partner_org_id = p_org_id;
  return v_row;
end; $$;

create or replace function public._gppf05_provision_membership()
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_email text;
  v_name text;
begin
  if auth.uid() is null then return null; end if;
  v_org_id := public._gppf05_resolve_org();
  if v_org_id is not null then return v_org_id; end if;

  v_tenant_id := public._presence_tenant_for_auth();
  select u.email, coalesce(u.full_name, u.email, 'Growth Partner') into v_email, v_name
  from public.users u where u.auth_user_id = auth.uid() limit 1;

  insert into public.growth_partner_portal_organizations (
    org_key, org_name, partner_tenant_id, certification_status
  ) values (
    'gp-' || left(replace(auth.uid()::text, '-', ''), 12),
    coalesce(v_name, 'Growth Partner Organization'),
    v_tenant_id, 'professional'
  ) on conflict (org_key) do nothing
  returning id into v_org_id;

  if v_org_id is null then
    select id into v_org_id from public.growth_partner_portal_organizations
    where org_key = 'gp-' || left(replace(auth.uid()::text, '-', ''), 12);
  end if;

  insert into public.growth_partner_portal_members (
    partner_org_id, auth_user_id, member_email, member_name, team_role, member_status, joined_at
  ) values (
    v_org_id, auth.uid(), v_email, coalesce(v_name, 'Partner Owner'), 'partner_owner', 'active', now()
  ) on conflict (partner_org_id, auth_user_id) do nothing;

  perform public._gppf05_ensure_settings(v_org_id);
  return v_org_id;
exception when others then
  return public._gppf05_resolve_org();
end; $$;

create or replace function public._gppf05_seed_academy_catalog()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_academy_modules (module_key, module_type, title, summary, sort_order) values
    ('mod-getting-started', 'training', 'Getting started as a Growth Partner', 'Orientation, workspace tour, and certification pathway overview.', 10),
    ('mod-sales-playbook', 'playbook', 'Sales playbook fundamentals', 'Discovery, qualification, and ethical closing practices.', 20),
    ('mod-product-knowledge', 'product_knowledge', 'Aipify product knowledge', 'Business Operating System positioning, packs, and customer outcomes.', 30),
    ('mod-compliance', 'compliance', 'Compliance and sales ethics', 'Referral rules, commission transparency, and customer data boundaries.', 40),
    ('mod-certification', 'certification', 'Certification requirements', 'Professional and Enterprise certification milestones.', 50)
  on conflict (module_key) do nothing;

  insert into public.growth_partner_portal_assets (asset_key, asset_type, title, description, download_label, sort_order) values
    ('asset-logo-primary', 'logo', 'Aipify Growth Partner logo', 'Primary logo for partner co-branding.', 'Download logo pack', 10),
    ('asset-banner-web', 'banner', 'Web banner set', 'Homepage and partner directory banners.', 'Download banners', 20),
    ('asset-email-intro', 'email_template', 'Introduction email template', 'Professional introduction email for prospects.', 'Download template', 30),
    ('asset-deck-sales', 'sales_deck', 'Sales deck', 'Executive-friendly sales presentation.', 'Download deck', 40),
    ('asset-onepager', 'one_pager', 'Aipify one-pager', 'Concise value overview for prospects.', 'Download one-pager', 50),
    ('asset-social', 'social', 'Social media assets', 'LinkedIn and community post templates.', 'Download social pack', 60)
  on conflict (asset_key) do nothing;
end; $$;

create or replace function public._gppf05_seed_demo(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.growth_partner_portal_leads where partner_org_id = p_org_id limit 1) then return; end if;

  insert into public.growth_partner_portal_leads (
    partner_org_id, lead_key, company_name, contact_name, contact_email, lead_status, source
  ) values
    (p_org_id, 'LEAD-001', 'Nordic Retail Group', 'Anna Lindstrom', 'anna@nordicretail.example', 'qualified', 'Inbound'),
    (p_org_id, 'LEAD-002', 'Bergen Logistics AS', 'Erik Berg', 'erik@bergenlog.example', 'trial_started', 'Referral'),
    (p_org_id, 'LEAD-003', 'Oslo Hospitality Co', 'Sofia Hansen', 'sofia@oslohosp.example', 'new', 'Event'),
    (p_org_id, 'LEAD-004', 'Copenhagen Tech', 'James Wright', 'james@cph-tech.example', 'converted', 'Outbound')
  on conflict (partner_org_id, lead_key) do nothing;

  insert into public.growth_partner_portal_referrals (
    partner_org_id, referral_key, prospect_name, prospect_email, referral_status
  ) values
    (p_org_id, 'REF-001', 'Maria Santos', 'maria@example.com', 'active'),
    (p_org_id, 'REF-002', 'Thomas Wright', 'thomas@example.com', 'converted'),
    (p_org_id, 'REF-003', 'Lena Olsen', 'lena@example.com', 'invited'),
    (p_org_id, 'REF-004', 'Peter Nielsen', 'peter@example.com', 'rewarded')
  on conflict (partner_org_id, referral_key) do nothing;

  insert into public.growth_partner_portal_commissions (
    partner_org_id, commission_key, customer_label, amount, commission_status, expected_payout_date
  ) values
    (p_org_id, 'COM-001', 'Nordic Retail Group', 1250.00, 'approved', current_date + 14),
    (p_org_id, 'COM-002', 'Bergen Logistics AS', 890.00, 'pending', current_date + 21),
    (p_org_id, 'COM-003', 'Copenhagen Tech', 420.00, 'scheduled', current_date + 7),
    (p_org_id, 'COM-004', 'Oslo Hospitality Co', 310.00, 'paid', current_date - 15)
  on conflict (partner_org_id, commission_key) do nothing;

  insert into public.growth_partner_portal_payouts (
    partner_org_id, payout_key, payout_period, total_amount, payout_status, scheduled_date
  ) values
    (p_org_id, 'PAY-001', to_char(current_date, 'YYYY-MM'), 2140.00, 'scheduled', current_date + 10),
    (p_org_id, 'PAY-002', to_char(current_date - interval '1 month', 'YYYY-MM'), 1890.00, 'completed', current_date - 20)
  on conflict (partner_org_id, payout_key) do nothing;

  insert into public.growth_partner_portal_academy_progress (partner_org_id, module_id, progress_pct, completed)
  select p_org_id, m.id,
    case m.module_key
      when 'mod-getting-started' then 100
      when 'mod-sales-playbook' then 75
      when 'mod-product-knowledge' then 50
      else 0
    end,
    m.module_key = 'mod-getting-started'
  from public.growth_partner_portal_academy_modules m
  on conflict (partner_org_id, module_id) do nothing;

  insert into public.growth_partner_portal_members (
    partner_org_id, auth_user_id, member_email, member_name, team_role, member_status, invited_at
  ) values
    (p_org_id, gen_random_uuid(), 'manager@partner.example', 'Partner Manager', 'partner_manager', 'invited', now()),
    (p_org_id, gen_random_uuid(), 'sales@partner.example', 'Sales Member', 'sales_member', 'invited', now())
  on conflict do nothing;
exception when others then null;
end; $$;

create or replace function public._gppf05_dashboard_stats(p_org_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'leads_this_month', (
      select count(*)::int from public.growth_partner_portal_leads
      where partner_org_id = p_org_id and created_at >= date_trunc('month', current_date)
    ),
    'active_referrals', (
      select count(*)::int from public.growth_partner_portal_referrals
      where partner_org_id = p_org_id and referral_status in ('registered', 'trial_started', 'converted', 'active')
    ),
    'converted_customers', (
      select count(*)::int from public.growth_partner_portal_leads
      where partner_org_id = p_org_id and lead_status = 'converted'
    ),
    'pending_commissions', (
      select coalesce(sum(amount), 0) from public.growth_partner_portal_commissions
      where partner_org_id = p_org_id and commission_status in ('pending', 'approved')
    ),
    'upcoming_payouts', (
      select coalesce(sum(total_amount), 0) from public.growth_partner_portal_payouts
      where partner_org_id = p_org_id and payout_status in ('scheduled', 'processing')
    ),
    'certification_status', (
      select certification_status from public.growth_partner_portal_organizations where id = p_org_id
    )
  ); $$;

create or replace function public.get_growth_partner_portal_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_stats jsonb;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  v_stats := public._gppf05_dashboard_stats(v_org_id);
  return jsonb_build_object(
    'has_access', true,
    'org_id', v_org_id,
    'leads_this_month', v_stats->'leads_this_month',
    'active_referrals', v_stats->'active_referrals',
    'certification_status', v_stats->'certification_status',
    'philosophy', public._gppf05bp_positioning()
  );
end; $$;

create or replace function public.get_growth_partner_portal_dashboard(p_section text default 'dashboard')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org public.growth_partner_portal_organizations;
  v_settings public.growth_partner_portal_settings;
  v_section text := coalesce(nullif(trim(p_section), ''), 'dashboard');
  v_role text;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  perform public._gppf05_seed_academy_catalog();
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  select * into v_org from public.growth_partner_portal_organizations where id = v_org_id;
  v_settings := public._gppf05_ensure_settings(v_org_id);
  perform public._gppf05_seed_demo(v_org_id);
  v_role := public._gppf05_member_role(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'org_id', v_org_id,
    'org_name', v_org.org_name,
    'active_section', v_section,
    'team_role', v_role,
    'positioning', public._gppf05bp_positioning(),
    'governance', jsonb_build_object(
      'role_permissions', true,
      'audit_lead_changes', true,
      'audit_referral_events', true,
      'audit_commission_status', true,
      'audit_payout_views', true,
      'audit_team_invitations', true,
      'no_customer_access', true,
      'no_platform_admin', true,
      'no_super_admin', true
    ),
    'routes', public._gppf05bp_routes(),
    'lead_statuses', jsonb_build_array('new', 'contacted', 'qualified', 'trial_started', 'converted', 'lost'),
    'referral_statuses', jsonb_build_array('invited', 'registered', 'trial_started', 'converted', 'active', 'rewarded'),
    'commission_statuses', jsonb_build_array('pending', 'approved', 'scheduled', 'paid', 'rejected'),
    'team_roles', jsonb_build_array('partner_owner', 'partner_manager', 'sales_member'),
    'stats', public._gppf05_dashboard_stats(v_org_id),
    'settings', jsonb_build_object(
      'default_section', v_settings.default_section,
      'notification_email', coalesce(v_settings.notification_email, '')
    ),
    'leads', case when v_section in ('dashboard', 'leads') then coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'lead_key', l.lead_key, 'company_name', l.company_name,
        'contact_name', coalesce(l.contact_name, ''), 'contact_email', coalesce(l.contact_email, ''),
        'lead_status', l.lead_status, 'source', coalesce(l.source, ''), 'notes', coalesce(l.notes, ''),
        'created_at', l.created_at::text
      ) order by l.created_at desc)
      from public.growth_partner_portal_leads l where l.partner_org_id = v_org_id
    ), '[]'::jsonb) else '[]'::jsonb end,
    'referrals', case when v_section in ('dashboard', 'referrals') then coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'referral_key', r.referral_key, 'prospect_name', r.prospect_name,
        'prospect_email', coalesce(r.prospect_email, ''), 'referral_status', r.referral_status,
        'invited_at', coalesce(r.invited_at::text, ''), 'converted_at', coalesce(r.converted_at::text, '')
      ) order by r.created_at desc)
      from public.growth_partner_portal_referrals r where r.partner_org_id = v_org_id
    ), '[]'::jsonb) else '[]'::jsonb end,
    'commissions', case when v_section in ('dashboard', 'commissions') then coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'commission_key', c.commission_key, 'customer_label', c.customer_label,
        'amount', c.amount, 'commission_status', c.commission_status,
        'expected_payout_date', coalesce(c.expected_payout_date::text, ''),
        'notes', coalesce(c.notes, '')
      ) order by c.created_at desc)
      from public.growth_partner_portal_commissions c where c.partner_org_id = v_org_id
    ), '[]'::jsonb) else '[]'::jsonb end,
    'payouts', case when v_section in ('dashboard', 'payouts') then coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'payout_key', p.payout_key, 'payout_period', p.payout_period,
        'total_amount', p.total_amount, 'payout_status', p.payout_status,
        'scheduled_date', coalesce(p.scheduled_date::text, ''),
        'paid_at', coalesce(p.paid_at::text, '')
      ) order by p.scheduled_date desc nulls last)
      from public.growth_partner_portal_payouts p where p.partner_org_id = v_org_id
    ), '[]'::jsonb) else '[]'::jsonb end,
    'academy', case when v_section in ('dashboard', 'academy') then jsonb_build_object(
      'modules', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', m.id, 'module_key', m.module_key, 'module_type', m.module_type,
          'title', m.title, 'summary', coalesce(m.summary, ''),
          'progress_pct', coalesce(pr.progress_pct, 0), 'completed', coalesce(pr.completed, false)
        ) order by m.sort_order)
        from public.growth_partner_portal_academy_modules m
        left join public.growth_partner_portal_academy_progress pr
          on pr.module_id = m.id and pr.partner_org_id = v_org_id
      ), '[]'::jsonb),
      'certification_progress', coalesce((
        select round(avg(coalesce(pr.progress_pct, 0))::numeric, 0)
        from public.growth_partner_portal_academy_modules m
        left join public.growth_partner_portal_academy_progress pr
          on pr.module_id = m.id and pr.partner_org_id = v_org_id
      ), 0)
    ) else null end,
    'assets', case when v_section in ('dashboard', 'assets') then coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'asset_key', a.asset_key, 'asset_type', a.asset_type,
        'title', a.title, 'description', coalesce(a.description, ''),
        'download_label', coalesce(a.download_label, 'Download')
      ) order by a.sort_order)
      from public.growth_partner_portal_assets a
    ), '[]'::jsonb) else '[]'::jsonb end,
    'team', case when v_section in ('dashboard', 'team') then coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'member_name', m.member_name, 'member_email', coalesce(m.member_email, ''),
        'team_role', m.team_role, 'member_status', m.member_status,
        'invited_at', coalesce(m.invited_at::text, ''), 'joined_at', coalesce(m.joined_at::text, '')
      ) order by m.created_at)
      from public.growth_partner_portal_members m where m.partner_org_id = v_org_id
    ), '[]'::jsonb) else '[]'::jsonb end,
    'implementation_blueprint', jsonb_build_object(
      'foundation', 'Foundation 05 — Growth Partner Portal',
      'doc', 'FOUNDATION_05_GROWTH_PARTNER_PORTAL.text',
      'route', '/growth-partner'
    )
  );
end; $$;

create or replace function public.perform_growth_partner_portal_action(
  p_action_type text,
  p_entity_id uuid default null,
  p_status text default null,
  p_email text default null,
  p_name text default null,
  p_role text default null,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_role text;
  v_summary text;
  v_old text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  v_role := public._gppf05_member_role(v_org_id);

  if p_action_type = 'update_lead_status' and p_entity_id is not null then
    select lead_status into v_old from public.growth_partner_portal_leads
    where id = p_entity_id and partner_org_id = v_org_id;
    update public.growth_partner_portal_leads set
      lead_status = coalesce(p_status, lead_status), updated_at = now()
    where id = p_entity_id and partner_org_id = v_org_id;
    perform public._gppf05_log_audit(v_org_id, 'lead_status_changed', 'Lead status updated',
      jsonb_build_object('lead_id', p_entity_id, 'from', v_old, 'to', p_status));
    v_summary := 'Lead status updated';

  elsif p_action_type = 'update_referral_status' and p_entity_id is not null then
    select referral_status into v_old from public.growth_partner_portal_referrals
    where id = p_entity_id and partner_org_id = v_org_id;
    update public.growth_partner_portal_referrals set
      referral_status = coalesce(p_status, referral_status),
      converted_at = case when p_status in ('converted', 'active', 'rewarded') then now() else converted_at end,
      updated_at = now()
    where id = p_entity_id and partner_org_id = v_org_id;
    perform public._gppf05_log_audit(v_org_id, 'referral_event', 'Referral status updated',
      jsonb_build_object('referral_id', p_entity_id, 'from', v_old, 'to', p_status));
    v_summary := 'Referral status updated';

  elsif p_action_type = 'invite_team_member' then
    if v_role not in ('partner_owner', 'partner_manager') then
      raise exception 'Insufficient permissions';
    end if;
    insert into public.growth_partner_portal_members (
      partner_org_id, auth_user_id, member_email, member_name, team_role, member_status, invited_at
    ) values (
      v_org_id, gen_random_uuid(), coalesce(p_email, ''), coalesce(p_name, 'Team member'),
      coalesce(p_role, 'sales_member'), 'invited', now()
    );
    perform public._gppf05_log_audit(v_org_id, 'team_invitation', 'Team member invited',
      jsonb_build_object('email', p_email, 'role', p_role));
    v_summary := 'Team invitation recorded';

  elsif p_action_type = 'record_payout_view' and p_entity_id is not null then
    perform public._gppf05_log_audit(v_org_id, 'payout_viewed', 'Payout details viewed',
      jsonb_build_object('payout_id', p_entity_id));
    v_summary := 'Payout view recorded';

  elsif p_action_type = 'update_settings' then
    if v_role <> 'partner_owner' then raise exception 'Owner permissions required'; end if;
    update public.growth_partner_portal_settings set
      notification_email = coalesce(p_email, notification_email), updated_at = now()
    where partner_org_id = v_org_id;
    perform public._gppf05_log_audit(v_org_id, 'settings_updated', 'Portal settings updated', '{}'::jsonb);
    v_summary := 'Settings updated';

  else
    raise exception 'Invalid action type';
  end if;

  perform public._gppf05_log_audit(v_org_id, 'action', v_summary,
    jsonb_build_object('action_type', p_action_type, 'entity_id', p_entity_id));
  return jsonb_build_object('success', true, 'action_type', p_action_type, 'summary', v_summary);
end; $$;

create or replace function public.seed_growth_partner_portal_knowledge()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = '_ahostkc_ensure_category') then return; end if;
  perform public._ahostkc_ensure_category(
    'growth-partner-portal', 'Growth Partner Portal',
    'Getting started, referral rules, commissions, sales ethics, certification, and approved assets.', 410
  );
  perform public._ahostkc_seed_article('growth-partner-portal', 'getting-started-growth-partner', 'Getting started as Growth Partner',
    'Your Growth Partner workspace tracks leads, referrals, commissions, academy progress, and approved assets — without accessing customer systems directly.');
  perform public._ahostkc_seed_article('growth-partner-portal', 'referral-rules', 'Referral rules',
    'Refer prospects ethically. Track referral status from invited through rewarded. Never misrepresent Aipify capabilities or guarantee outcomes.');
  perform public._ahostkc_seed_article('growth-partner-portal', 'commission-overview', 'Commission overview',
    'Commissions move through pending, approved, scheduled, paid, and rejected. Payout schedules are visible in your portal — contact Aipify only for disputes.');
  perform public._ahostkc_seed_article('growth-partner-portal', 'sales-ethics', 'Sales ethics',
    'Growth Partners operate with transparency. Use approved assets only. Respect customer data boundaries — partners do not access customer portals.');
  perform public._ahostkc_seed_article('growth-partner-portal', 'certification-requirements', 'Certification requirements',
    'Complete academy modules and certification milestones to advance from Certified through Professional and Enterprise levels.');
  perform public._ahostkc_seed_article('growth-partner-portal', 'using-aipify-assets', 'Using Aipify assets',
    'Download logos, banners, email templates, sales decks, one-pagers, and social assets from the Assets section. Co-brand professionally — Growth Partner, never Affiliate.');
end; $$;

select public.seed_growth_partner_portal_knowledge();

grant execute on function public.get_growth_partner_portal_card() to authenticated;
grant execute on function public.get_growth_partner_portal_dashboard(text) to authenticated;
grant execute on function public.perform_growth_partner_portal_action(text, uuid, text, text, text, text, text) to authenticated;
