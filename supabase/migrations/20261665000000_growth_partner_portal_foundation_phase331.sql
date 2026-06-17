-- Phase 331 — Growth Partner Portal Foundation
-- Feature owner: GROWTH PARTNER PORTAL (external layer). Route: /partner
-- Extends Foundation 05 growth_partner_portal_* tables. Helpers: _gpp331_*

alter table public.growth_partner_portal_organizations
  add column if not exists partner_type text not null default 'registered';

alter table public.growth_partner_portal_organizations
  drop constraint if exists growth_partner_portal_organizations_partner_type_check;

alter table public.growth_partner_portal_organizations
  add constraint growth_partner_portal_organizations_partner_type_check check (
    partner_type in ('registered', 'certified', 'professional', 'elite', 'strategic')
  );

alter table public.growth_partner_portal_organizations
  add column if not exists activation_status text not null default 'pending';

alter table public.growth_partner_portal_organizations
  drop constraint if exists growth_partner_portal_organizations_activation_status_check;

alter table public.growth_partner_portal_organizations
  add constraint growth_partner_portal_organizations_activation_status_check check (
    activation_status in ('pending', 'onboarding', 'verified', 'active', 'suspended')
  );

alter table public.growth_partner_portal_members
  drop constraint if exists growth_partner_portal_members_team_role_check;

alter table public.growth_partner_portal_members
  add constraint growth_partner_portal_members_team_role_check check (
    team_role in (
      'partner_owner', 'partner_manager', 'sales_member',
      'owner', 'manager', 'sales_representative', 'trainer', 'advisor', 'viewer'
    )
  );

create table if not exists public.growth_partner_portal_profiles (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade unique,
  company_name text not null default '',
  organization_number text not null default '',
  vat_number text not null default '',
  business_address text not null default '',
  contact_email text not null default '',
  contact_phone text not null default '',
  website text not null default '',
  country_code text not null default '',
  preferred_language text not null default 'en',
  bank_account_holder text not null default '',
  bank_account_number text not null default '',
  bank_routing text not null default '',
  tax_information text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.growth_partner_portal_profiles enable row level security;
revoke all on public.growth_partner_portal_profiles from authenticated, anon;

create table if not exists public.growth_partner_portal_verifications (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  verification_type text not null check (
    verification_type in (
      'company_registration', 'organization_number', 'vat', 'identity', 'banking'
    )
  ),
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'in_review', 'verified', 'rejected')
  ),
  verified_at timestamptz,
  notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_org_id, verification_type)
);
create index if not exists growth_partner_portal_verifications_org_idx
  on public.growth_partner_portal_verifications (partner_org_id, verification_status);
alter table public.growth_partner_portal_verifications enable row level security;
revoke all on public.growth_partner_portal_verifications from authenticated, anon;

create table if not exists public.growth_partner_portal_onboarding (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade unique,
  current_step text not null default 'create_account' check (
    current_step in (
      'create_account', 'verify_business', 'configure_profile',
      'complete_introduction', 'access_academy', 'become_active'
    )
  ),
  completion_pct integer not null default 0 check (completion_pct between 0 and 100),
  missing_requirements jsonb not null default '[]'::jsonb,
  recommended_next_step text not null default 'verify_business',
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.growth_partner_portal_onboarding enable row level security;
revoke all on public.growth_partner_portal_onboarding from authenticated, anon;

create table if not exists public.growth_partner_portal_member_permissions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.growth_partner_portal_members (id) on delete cascade,
  permission_key text not null check (
    permission_key in (
      'view_opportunities', 'manage_customers', 'access_academy', 'access_materials',
      'view_commissions', 'manage_team', 'view_reports', 'settlement_access', 'banking_changes'
    )
  ),
  granted boolean not null default true,
  created_at timestamptz not null default now(),
  unique (member_id, permission_key)
);
alter table public.growth_partner_portal_member_permissions enable row level security;
revoke all on public.growth_partner_portal_member_permissions from authenticated, anon;

create table if not exists public.growth_partner_portal_activity (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  activity_type text not null check (
    activity_type in (
      'customer_introduction', 'opportunity_change', 'certification_completed',
      'milestone_reached', 'commission_event', 'settlement_event', 'team_event', 'onboarding_event'
    )
  ),
  title text not null default '',
  summary text not null default '',
  actor_auth_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists growth_partner_portal_activity_org_idx
  on public.growth_partner_portal_activity (partner_org_id, created_at desc);
alter table public.growth_partner_portal_activity enable row level security;
revoke all on public.growth_partner_portal_activity from authenticated, anon;

create table if not exists public.growth_partner_portal_notifications (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  recipient_auth_user_id uuid,
  notification_type text not null check (
    notification_type in (
      'new_opportunity', 'certification_update', 'settlement_update',
      'commission_update', 'product_update', 'training_update'
    )
  ),
  title text not null default '',
  body text not null default '',
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists growth_partner_portal_notifications_org_idx
  on public.growth_partner_portal_notifications (partner_org_id, created_at desc);
alter table public.growth_partner_portal_notifications enable row level security;
revoke all on public.growth_partner_portal_notifications from authenticated, anon;

create or replace function public._gpp331bp_positioning() returns text language sql immutable as $$
  select 'Growth Partners are independent business operators who help organizations discover, implement, and grow with Aipify — not affiliates.'; $$;

create or replace function public._gpp331bp_routes() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'dashboard', 'route', '/partner/dashboard'),
    jsonb_build_object('key', 'opportunities', 'route', '/partner/opportunities'),
    jsonb_build_object('key', 'customers', 'route', '/partner/customers'),
    jsonb_build_object('key', 'academy', 'route', '/partner/academy'),
    jsonb_build_object('key', 'materials', 'route', '/partner/materials'),
    jsonb_build_object('key', 'commissions', 'route', '/partner/commissions'),
    jsonb_build_object('key', 'settlements', 'route', '/partner/settlements'),
    jsonb_build_object('key', 'performance', 'route', '/partner/performance'),
    jsonb_build_object('key', 'advisor', 'route', '/partner/advisor'),
    jsonb_build_object('key', 'settings', 'route', '/partner/settings')
  ); $$;

create or replace function public._gpp331_ensure_profile(p_org_id uuid)
returns public.growth_partner_portal_profiles language plpgsql security definer set search_path = public as $$
declare
  v_row public.growth_partner_portal_profiles;
  v_org public.growth_partner_portal_organizations;
begin
  select * into v_org from public.growth_partner_portal_organizations where id = p_org_id;
  insert into public.growth_partner_portal_profiles (partner_org_id, company_name)
  values (p_org_id, coalesce(v_org.org_name, ''))
  on conflict (partner_org_id) do nothing;
  select * into v_row from public.growth_partner_portal_profiles where partner_org_id = p_org_id;
  return v_row;
end; $$;

create or replace function public._gpp331_ensure_onboarding(p_org_id uuid)
returns public.growth_partner_portal_onboarding language plpgsql security definer set search_path = public as $$
declare v_row public.growth_partner_portal_onboarding;
begin
  insert into public.growth_partner_portal_onboarding (partner_org_id)
  values (p_org_id) on conflict (partner_org_id) do nothing;
  select * into v_row from public.growth_partner_portal_onboarding where partner_org_id = p_org_id;
  return v_row;
end; $$;

create or replace function public._gpp331_seed_verifications(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_verifications (partner_org_id, verification_type, verification_status)
  values
    (p_org_id, 'company_registration', 'pending'),
    (p_org_id, 'organization_number', 'pending'),
    (p_org_id, 'vat', 'pending'),
    (p_org_id, 'identity', 'pending'),
    (p_org_id, 'banking', 'pending')
  on conflict (partner_org_id, verification_type) do nothing;
end; $$;

create or replace function public._gpp331_default_permissions(p_member_id uuid, p_role text)
returns void language plpgsql security definer set search_path = public as $$
declare v_perm text;
begin
  for v_perm in select unnest(array[
    'view_opportunities', 'manage_customers', 'access_academy', 'access_materials',
    'view_commissions', 'manage_team', 'view_reports', 'settlement_access', 'banking_changes'
  ]) loop
    insert into public.growth_partner_portal_member_permissions (member_id, permission_key, granted)
    values (
      p_member_id, v_perm,
      case
        when p_role in ('partner_owner', 'owner') then true
        when p_role in ('partner_manager', 'manager') and v_perm in (
          'view_opportunities', 'manage_customers', 'access_academy', 'access_materials',
          'view_commissions', 'manage_team', 'view_reports'
        ) then true
        when p_role in ('sales_member', 'sales_representative') and v_perm in (
          'view_opportunities', 'manage_customers', 'access_academy', 'access_materials', 'view_commissions'
        ) then true
        when p_role = 'trainer' and v_perm in ('access_academy', 'access_materials', 'view_reports') then true
        when p_role = 'advisor' and v_perm in ('view_opportunities', 'view_commissions', 'view_reports') then true
        when p_role = 'viewer' and v_perm in ('view_opportunities', 'view_commissions', 'view_reports') then true
        else false
      end
    ) on conflict (member_id, permission_key) do nothing;
  end loop;
end; $$;

create or replace function public._gpp331_member_permissions(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_member_id uuid;
  v_role text;
begin
  select m.id, m.team_role into v_member_id, v_role
  from public.growth_partner_portal_members m
  where m.partner_org_id = p_org_id and m.auth_user_id = auth.uid() and m.member_status = 'active'
  limit 1;

  if v_member_id is null then return '{}'::jsonb; end if;

  perform public._gpp331_default_permissions(v_member_id, v_role);

  return coalesce((
    select jsonb_object_agg(permission_key, granted)
    from public.growth_partner_portal_member_permissions
    where member_id = v_member_id
  ), '{}'::jsonb);
end; $$;

create or replace function public._gpp331_two_factor_status()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_enabled boolean := false;
begin
  if auth.uid() is null then
    return jsonb_build_object('enabled', false, 'required_for', '[]'::jsonb);
  end if;
  if to_regclass('public.user_two_factor_settings') is not null then
    select coalesce(t.totp_enabled, false) into v_enabled
    from public.user_two_factor_settings t
    where t.user_id = auth.uid() limit 1;
  end if;
  return jsonb_build_object(
    'enabled', coalesce(v_enabled, false),
    'required_for', jsonb_build_array('partner_owner', 'settlement_access', 'banking_changes'),
    'settings_route', '/partner/settings/security'
  );
end; $$;

create or replace function public._gpp331_health_score(p_org_id uuid)
returns integer language plpgsql stable security definer set search_path = public as $$
declare
  v_score integer := 0;
  v_verified integer;
  v_onboarding integer;
  v_opportunities integer;
begin
  select count(*) into v_verified
  from public.growth_partner_portal_verifications
  where partner_org_id = p_org_id and verification_status = 'verified';

  select coalesce(completion_pct, 0) into v_onboarding
  from public.growth_partner_portal_onboarding where partner_org_id = p_org_id;

  select count(*) into v_opportunities
  from public.growth_partner_portal_leads
  where partner_org_id = p_org_id and lead_status not in ('lost');

  v_score := least(100, (v_verified * 10) + (v_onboarding / 2) + least(v_opportunities * 5, 25));
  return greatest(v_score, 10);
end; $$;

create or replace function public._gpp331_recompute_onboarding(p_org_id uuid)
returns public.growth_partner_portal_onboarding language plpgsql security definer set search_path = public as $$
declare
  v_row public.growth_partner_portal_onboarding;
  v_profile public.growth_partner_portal_profiles;
  v_verified integer;
  v_total integer := 5;
  v_pct integer;
  v_missing jsonb := '[]'::jsonb;
  v_next text := 'verify_business';
begin
  v_row := public._gpp331_ensure_onboarding(p_org_id);
  v_profile := public._gpp331_ensure_profile(p_org_id);
  perform public._gpp331_seed_verifications(p_org_id);

  select count(*) into v_verified
  from public.growth_partner_portal_verifications
  where partner_org_id = p_org_id and verification_status = 'verified';

  v_pct := 15;
  if v_verified >= v_total then v_pct := v_pct + 25; else
    v_missing := v_missing || jsonb_build_array('business_verification');
    v_next := 'verify_business';
  end if;

  if coalesce(v_profile.company_name, '') <> '' and coalesce(v_profile.organization_number, '') <> '' then
    v_pct := v_pct + 20;
  else
    v_missing := v_missing || jsonb_build_array('business_profile');
    if v_next <> 'verify_business' or v_verified >= v_total then
      v_next := 'configure_profile';
    end if;
  end if;

  if exists (
    select 1 from public.growth_partner_portal_academy_progress pr
    join public.growth_partner_portal_academy_modules m on m.id = pr.module_id
    where pr.partner_org_id = p_org_id and pr.completed = true
  ) then
    v_pct := v_pct + 20;
  else
    v_missing := v_missing || jsonb_build_array('academy_introduction');
    if v_next = 'verify_business' then
      v_next := 'access_academy';
    end if;
  end if;

  if v_verified >= v_total and v_pct >= 80 then
    v_pct := 100;
    v_next := 'become_active';
    update public.growth_partner_portal_organizations
    set activation_status = 'active', partner_type = case when partner_type = 'registered' then 'certified' else partner_type end
    where id = p_org_id;
  elsif v_pct >= 60 then
    update public.growth_partner_portal_organizations set activation_status = 'onboarding' where id = p_org_id;
  end if;

  update public.growth_partner_portal_onboarding set
    completion_pct = least(v_pct, 100),
    missing_requirements = v_missing,
    recommended_next_step = v_next,
    updated_at = now()
  where partner_org_id = p_org_id
  returning * into v_row;

  return v_row;
end; $$;

create or replace function public._gpp331_log_activity(
  p_org_id uuid, p_type text, p_title text, p_summary text, p_context jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_activity (
    partner_org_id, activity_type, title, summary, actor_auth_user_id, context
  ) values (
    p_org_id, p_type, p_title, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  );
  perform public._gppf05_log_audit(p_org_id, p_type, p_summary, p_context);
end; $$;

create or replace function public._gpp331_seed_notifications(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.growth_partner_portal_notifications where partner_org_id = p_org_id limit 1) then
    return;
  end if;
  insert into public.growth_partner_portal_notifications (
    partner_org_id, notification_type, title, body
  ) values
    (p_org_id, 'product_update', 'Welcome to Aipify Growth Partners', 'Build your business with Aipify and help organizations grow through intelligent business operations.'),
    (p_org_id, 'training_update', 'Academy introduction available', 'Complete your introduction module to unlock certification pathways.'),
    (p_org_id, 'certification_update', 'Business verification required', 'Verify your business entity before activation.');
end; $$;

create or replace function public._gpp331_provision(p_org_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_member_id uuid;
begin
  perform public._gpp331_ensure_profile(p_org_id);
  perform public._gpp331_seed_verifications(p_org_id);
  perform public._gpp331_recompute_onboarding(p_org_id);
  perform public._gpp331_seed_notifications(p_org_id);

  select m.id into v_member_id
  from public.growth_partner_portal_members m
  where m.partner_org_id = p_org_id and m.auth_user_id = auth.uid() and m.member_status = 'active'
  limit 1;

  if v_member_id is not null then
    perform public._gpp331_default_permissions(
      v_member_id,
      (select team_role from public.growth_partner_portal_members where id = v_member_id)
    );
  end if;

  return p_org_id;
end; $$;

create or replace function public.get_partner_portal_profile()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org public.growth_partner_portal_organizations;
  v_profile public.growth_partner_portal_profiles;
  v_onboarding public.growth_partner_portal_onboarding;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  perform public._gppf05_seed_academy_catalog();
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  perform public._gpp331_provision(v_org_id);

  select * into v_org from public.growth_partner_portal_organizations where id = v_org_id;
  v_profile := public._gpp331_ensure_profile(v_org_id);
  v_onboarding := public._gpp331_recompute_onboarding(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'org_id', v_org_id,
    'org_name', v_org.org_name,
    'partner_type', v_org.partner_type,
    'activation_status', v_org.activation_status,
    'certification_status', v_org.certification_status,
    'team_role', public._gppf05_member_role(v_org_id),
    'permissions', public._gpp331_member_permissions(v_org_id),
    'two_factor', public._gpp331_two_factor_status(),
    'profile', jsonb_build_object(
      'company_name', v_profile.company_name,
      'organization_number', v_profile.organization_number,
      'vat_number', v_profile.vat_number,
      'business_address', v_profile.business_address,
      'contact_email', v_profile.contact_email,
      'contact_phone', v_profile.contact_phone,
      'website', v_profile.website,
      'country_code', v_profile.country_code,
      'preferred_language', v_profile.preferred_language,
      'bank_account_holder', v_profile.bank_account_holder,
      'bank_account_number', v_profile.bank_account_number,
      'bank_routing', v_profile.bank_routing,
      'tax_information', v_profile.tax_information
    ),
    'verifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'verification_type', v.verification_type,
        'verification_status', v.verification_status,
        'verified_at', coalesce(v.verified_at::text, '')
      ) order by v.verification_type)
      from public.growth_partner_portal_verifications v where v.partner_org_id = v_org_id
    ), '[]'::jsonb),
    'onboarding', jsonb_build_object(
      'current_step', v_onboarding.current_step,
      'completion_pct', v_onboarding.completion_pct,
      'missing_requirements', v_onboarding.missing_requirements,
      'recommended_next_step', v_onboarding.recommended_next_step
    ),
    'business_verified', (
      select count(*) = 5 from public.growth_partner_portal_verifications
      where partner_org_id = v_org_id and verification_status = 'verified'
    )
  );
end; $$;

create or replace function public.get_partner_portal_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org public.growth_partner_portal_organizations;
  v_stats jsonb;
  v_onboarding public.growth_partner_portal_onboarding;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  perform public._gppf05_seed_academy_catalog();
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  perform public._gpp331_provision(v_org_id);
  perform public._gppf05_seed_demo(v_org_id);

  select * into v_org from public.growth_partner_portal_organizations where id = v_org_id;
  v_stats := public._gppf05_dashboard_stats(v_org_id);
  v_onboarding := public._gpp331_recompute_onboarding(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'org_id', v_org_id,
    'org_name', v_org.org_name,
    'partner_type', v_org.partner_type,
    'activation_status', v_org.activation_status,
    'positioning', public._gpp331bp_positioning(),
    'health_score', public._gpp331_health_score(v_org_id),
    'active_opportunities', (
      select count(*)::int from public.growth_partner_portal_leads
      where partner_org_id = v_org_id and lead_status not in ('converted', 'lost')
    ),
    'customers_introduced', v_stats->'converted_customers',
    'pending_commissions', v_stats->'pending_commissions',
    'pending_settlements', v_stats->'upcoming_payouts',
    'certification_status', v_stats->'certification_status',
    'certification_progress', coalesce((
      select round(avg(coalesce(pr.progress_pct, 0))::numeric, 0)
      from public.growth_partner_portal_academy_modules m
      left join public.growth_partner_portal_academy_progress pr
        on pr.module_id = m.id and pr.partner_org_id = v_org_id
    ), 0),
    'performance_overview', jsonb_build_object(
      'leads_this_month', v_stats->'leads_this_month',
      'active_referrals', v_stats->'active_referrals',
      'conversion_rate_pct', case
        when (select count(*) from public.growth_partner_portal_leads where partner_org_id = v_org_id) = 0 then 0
        else round(
          (select count(*)::numeric from public.growth_partner_portal_leads
           where partner_org_id = v_org_id and lead_status = 'converted')
          / greatest((select count(*) from public.growth_partner_portal_leads where partner_org_id = v_org_id), 1) * 100
        )::int
      end
    ),
    'onboarding', jsonb_build_object(
      'completion_pct', v_onboarding.completion_pct,
      'missing_requirements', v_onboarding.missing_requirements,
      'recommended_next_step', v_onboarding.recommended_next_step
    ),
    'notifications_unread', (
      select count(*)::int from public.growth_partner_portal_notifications
      where partner_org_id = v_org_id and read_at is null
    ),
    'routes', public._gpp331bp_routes(),
    'two_factor', public._gpp331_two_factor_status()
  );
end; $$;

create or replace function public.get_partner_portal_team()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  perform public._gpp331_provision(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'org_id', v_org_id,
    'team_role', public._gppf05_member_role(v_org_id),
    'permissions', public._gpp331_member_permissions(v_org_id),
    'roles', jsonb_build_array(
      'owner', 'manager', 'sales_representative', 'trainer', 'advisor', 'viewer'
    ),
    'members', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id,
        'member_name', m.member_name,
        'member_email', coalesce(m.member_email, ''),
        'team_role', m.team_role,
        'member_status', m.member_status,
        'invited_at', coalesce(m.invited_at::text, ''),
        'joined_at', coalesce(m.joined_at::text, ''),
        'permissions', coalesce((
          select jsonb_object_agg(mp.permission_key, mp.granted)
          from public.growth_partner_portal_member_permissions mp where mp.member_id = m.id
        ), '{}'::jsonb)
      ) order by m.created_at)
      from public.growth_partner_portal_members m where m.partner_org_id = v_org_id
    ), '[]'::jsonb),
    'team_performance', jsonb_build_object(
      'active_members', (
        select count(*)::int from public.growth_partner_portal_members
        where partner_org_id = v_org_id and member_status = 'active'
      ),
      'invited_members', (
        select count(*)::int from public.growth_partner_portal_members
        where partner_org_id = v_org_id and member_status = 'invited'
      )
    )
  );
end; $$;

create or replace function public.get_partner_portal_activity()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  perform public._gpp331_provision(v_org_id);

  if not exists (select 1 from public.growth_partner_portal_activity where partner_org_id = v_org_id limit 1) then
    perform public._gpp331_log_activity(
      v_org_id, 'onboarding_event', 'Growth Partner workspace created',
      'Welcome to Aipify Growth Partners.', '{}'::jsonb
    );
    perform public._gpp331_log_activity(
      v_org_id, 'milestone_reached', 'Onboarding started',
      'Complete business verification to activate your partner workspace.', '{}'::jsonb
    );
  end if;

  return jsonb_build_object(
    'has_access', true,
    'org_id', v_org_id,
    'activity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'activity_type', a.activity_type,
        'title', a.title,
        'summary', a.summary,
        'created_at', a.created_at::text
      ) order by a.created_at desc)
      from public.growth_partner_portal_activity a
      where a.partner_org_id = v_org_id
      limit 50
    ), '[]'::jsonb),
    'notifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', n.id,
        'notification_type', n.notification_type,
        'title', n.title,
        'body', n.body,
        'read_at', coalesce(n.read_at::text, ''),
        'created_at', n.created_at::text
      ) order by n.created_at desc)
      from public.growth_partner_portal_notifications n
      where n.partner_org_id = v_org_id
      limit 20
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.update_partner_portal_profile(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_role text;
  v_tf jsonb;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  v_role := public._gppf05_member_role(v_org_id);
  v_tf := public._gpp331_two_factor_status();

  if p_patch ? 'bank_account_number' or p_patch ? 'bank_routing' or p_patch ? 'bank_account_holder' then
    if not (v_tf->>'enabled')::boolean and v_role in ('partner_owner', 'owner') then
      raise exception 'Two-factor authentication required for banking changes';
    end if;
  end if;

  perform public._gpp331_ensure_profile(v_org_id);

  update public.growth_partner_portal_profiles set
    company_name = coalesce(p_patch->>'company_name', company_name),
    organization_number = coalesce(p_patch->>'organization_number', organization_number),
    vat_number = coalesce(p_patch->>'vat_number', vat_number),
    business_address = coalesce(p_patch->>'business_address', business_address),
    contact_email = coalesce(p_patch->>'contact_email', contact_email),
    contact_phone = coalesce(p_patch->>'contact_phone', contact_phone),
    website = coalesce(p_patch->>'website', website),
    country_code = coalesce(p_patch->>'country_code', country_code),
    preferred_language = coalesce(p_patch->>'preferred_language', preferred_language),
    bank_account_holder = coalesce(p_patch->>'bank_account_holder', bank_account_holder),
    bank_account_number = coalesce(p_patch->>'bank_account_number', bank_account_number),
    bank_routing = coalesce(p_patch->>'bank_routing', bank_routing),
    tax_information = coalesce(p_patch->>'tax_information', tax_information),
    updated_at = now()
  where partner_org_id = v_org_id;

  if coalesce(p_patch->>'company_name', '') <> '' then
    update public.growth_partner_portal_organizations
    set org_name = p_patch->>'company_name', updated_at = now()
    where id = v_org_id;
  end if;

  perform public._gpp331_recompute_onboarding(v_org_id);
  perform public._gpp331_log_activity(
    v_org_id, 'onboarding_event', 'Partner profile updated',
    'Business profile information was updated.', p_patch
  );

  return public.get_partner_portal_profile();
end; $$;

create or replace function public.advance_partner_portal_onboarding(p_step text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_step text := coalesce(nullif(trim(p_step), ''), 'verify_business');
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  perform public._gpp331_ensure_onboarding(v_org_id);

  update public.growth_partner_portal_onboarding set
    current_step = case v_step
      when 'verify_business' then 'verify_business'
      when 'configure_profile' then 'configure_profile'
      when 'complete_introduction' then 'complete_introduction'
      when 'access_academy' then 'access_academy'
      when 'become_active' then 'become_active'
      else current_step
    end,
    updated_at = now()
  where partner_org_id = v_org_id;

  if v_step = 'verify_business' then
    update public.growth_partner_portal_verifications set
      verification_status = 'in_review', updated_at = now()
    where partner_org_id = v_org_id and verification_status = 'pending';
    perform public._gpp331_log_activity(
      v_org_id, 'onboarding_event', 'Business verification submitted',
      'Verification records submitted for review.', jsonb_build_object('step', v_step)
    );
  elsif v_step = 'complete_introduction' then
    perform public._gpp331_log_activity(
      v_org_id, 'milestone_reached', 'Introduction completed',
      'Growth Partner introduction module completed.', jsonb_build_object('step', v_step)
    );
  end if;

  perform public._gpp331_recompute_onboarding(v_org_id);
  return public.get_partner_portal_profile();
end; $$;

grant execute on function public.get_partner_portal_profile() to authenticated;
grant execute on function public.get_partner_portal_dashboard() to authenticated;
grant execute on function public.get_partner_portal_team() to authenticated;
grant execute on function public.get_partner_portal_activity() to authenticated;
grant execute on function public.update_partner_portal_profile(jsonb) to authenticated;
grant execute on function public.advance_partner_portal_onboarding(text) to authenticated;
