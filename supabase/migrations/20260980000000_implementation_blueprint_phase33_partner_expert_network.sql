-- Implementation Blueprint Phase 33 — Partner & Aipify Expert Network Engine
-- Partner Terminology Update: official tiers sales_representative, sales_expert, certified, expert
-- Extends Marketplace & Partner Ecosystem Foundation Engine (Phase A.45). Preserves ALL Phase 19 dashboard/card fields.


-- Bootstrap Phase 91 partner ecosystem DDL (record-only baseline recovery)
-- ---------------------------------------------------------------------------
-- 1. partner_ecosystem_settings
-- ---------------------------------------------------------------------------
create table if not exists public.partner_ecosystem_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  program_enabled boolean not null default true,
  lead_referral_enabled boolean not null default true,
  public_directory_enabled boolean not null default true,
  certification_renewal_months int not null default 24,
  require_compliance_agreement boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.partner_ecosystem_settings enable row level security;
revoke all on public.partner_ecosystem_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. partner_ecosystem_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.partner_ecosystem_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partner_name text not null,
  partner_type text not null default 'implementation' check (
    partner_type in (
      'implementation', 'certified_consultant', 'development', 'technology',
      'strategic_alliance', 'training', 'managed_service', 'reseller'
    )
  ),
  partner_tier text not null default 'registered' check (
    partner_tier in ('registered', 'certified', 'advanced', 'premier', 'strategic')
  ),
  status text not null default 'active' check (
    status in ('pending', 'active', 'probation', 'review', 'suspended', 'archived')
  ),
  country text,
  industry_expertise text[] not null default '{}',
  languages text[] not null default '{}',
  service_offerings text[] not null default '{}',
  contact_email text,
  website_url text,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, partner_name)
);

create index if not exists partner_ecosystem_profiles_tenant_idx
  on public.partner_ecosystem_profiles (tenant_id, partner_tier, status);

alter table public.partner_ecosystem_profiles enable row level security;
revoke all on public.partner_ecosystem_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. partner_certification_tracks
-- ---------------------------------------------------------------------------
create table if not exists public.partner_certification_tracks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  track_key text not null,
  title text not null,
  description text not null,
  certification_area text not null check (
    certification_area in (
      'aipify_foundations', 'support_ai_specialist', 'governance_specialist',
      'enterprise_deployment', 'commerce_specialist', 'integration_specialist',
      'strategic_intelligence'
    )
  ),
  requirements jsonb not null default '[]'::jsonb,
  renewal_months int not null default 24,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  unique (tenant_id, track_key)
);

alter table public.partner_certification_tracks enable row level security;
revoke all on public.partner_certification_tracks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. partner_certification_progress
-- ---------------------------------------------------------------------------
create table if not exists public.partner_certification_progress (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partner_id uuid not null references public.partner_ecosystem_profiles (id) on delete cascade,
  track_id uuid not null references public.partner_certification_tracks (id) on delete cascade,
  status text not null default 'not_started' check (
    status in ('not_started', 'in_progress', 'completed', 'expired', 'renewal_required')
  ),
  progress_pct numeric(5, 2) not null default 0 check (progress_pct between 0 and 100),
  completed_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_id, track_id)
);

alter table public.partner_certification_progress enable row level security;
revoke all on public.partner_certification_progress from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. partner_certification_attempts
-- ---------------------------------------------------------------------------
create table if not exists public.partner_certification_attempts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partner_id uuid not null references public.partner_ecosystem_profiles (id) on delete cascade,
  track_id uuid not null references public.partner_certification_tracks (id) on delete cascade,
  attempt_type text not null default 'examination' check (
    attempt_type in ('examination', 'simulation', 'case_study', 'practical_assessment')
  ),
  score numeric(5, 2),
  passed boolean not null default false,
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'failed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.partner_certification_attempts enable row level security;
revoke all on public.partner_certification_attempts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. partner_digital_credentials
-- ---------------------------------------------------------------------------
create table if not exists public.partner_digital_credentials (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partner_id uuid not null references public.partner_ecosystem_profiles (id) on delete cascade,
  track_id uuid references public.partner_certification_tracks (id) on delete set null,
  credential_code text not null,
  title text not null,
  badge_label text,
  status text not null default 'active' check (
    status in ('active', 'expired', 'revoked', 'pending_renewal')
  ),
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  verification_url text,
  metadata jsonb not null default '{}'::jsonb,
  unique (tenant_id, credential_code)
);

alter table public.partner_digital_credentials enable row level security;
revoke all on public.partner_digital_credentials from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. partner_ecosystem_scorecards
-- ---------------------------------------------------------------------------
create table if not exists public.partner_ecosystem_scorecards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partner_id uuid not null references public.partner_ecosystem_profiles (id) on delete cascade,
  overall_score numeric(5, 2) not null default 0 check (overall_score between 0 and 100),
  certification_completion numeric(5, 2) not null default 0,
  customer_feedback_score numeric(5, 2) not null default 0,
  implementation_success numeric(5, 2) not null default 0,
  support_quality numeric(5, 2) not null default 0,
  revenue_contribution numeric(5, 2) not null default 0,
  ecosystem_participation numeric(5, 2) not null default 0,
  calculated_at timestamptz not null default now()
);

alter table public.partner_ecosystem_scorecards enable row level security;
revoke all on public.partner_ecosystem_scorecards from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. partner_ecosystem_resources
-- ---------------------------------------------------------------------------
create table if not exists public.partner_ecosystem_resources (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  resource_key text not null,
  title text not null,
  description text not null,
  resource_type text not null default 'guide' check (
    resource_type in ('guide', 'best_practice', 'sales_enablement', 'technical_doc', 'training_video', 'case_study', 'template')
  ),
  url text,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  unique (tenant_id, resource_key)
);

alter table public.partner_ecosystem_resources enable row level security;
revoke all on public.partner_ecosystem_resources from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. partner_lead_registrations
-- ---------------------------------------------------------------------------
create table if not exists public.partner_lead_registrations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partner_id uuid references public.partner_ecosystem_profiles (id) on delete set null,
  opportunity_name text not null,
  company_name text,
  country text,
  estimated_value numeric(12, 2),
  status text not null default 'registered' check (
    status in ('registered', 'qualified', 'protected', 'won', 'lost', 'expired')
  ),
  protection_expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.partner_lead_registrations enable row level security;
revoke all on public.partner_lead_registrations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. partner_ecosystem_feedback
-- ---------------------------------------------------------------------------
create table if not exists public.partner_ecosystem_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partner_id uuid not null references public.partner_ecosystem_profiles (id) on delete cascade,
  rating numeric(3, 1) not null check (rating between 1 and 5),
  feedback_text text,
  deployment_success boolean,
  created_at timestamptz not null default now()
);

alter table public.partner_ecosystem_feedback enable row level security;
revoke all on public.partner_ecosystem_feedback from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 11. partner_recognition_awards
-- ---------------------------------------------------------------------------
create table if not exists public.partner_recognition_awards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partner_id uuid references public.partner_ecosystem_profiles (id) on delete set null,
  award_type text not null check (
    award_type in (
      'partner_of_the_year', 'innovation_partner', 'customer_success',
      'technical_excellence', 'community_champion'
    )
  ),
  title text not null,
  description text,
  awarded_at timestamptz not null default now(),
  year int not null default extract(year from now())::int
);

alter table public.partner_recognition_awards enable row level security;
revoke all on public.partner_recognition_awards from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 12. partner_compliance_records
-- ---------------------------------------------------------------------------
create table if not exists public.partner_compliance_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partner_id uuid not null references public.partner_ecosystem_profiles (id) on delete cascade,
  compliance_type text not null check (
    compliance_type in (
      'code_of_conduct', 'data_protection', 'ethical_ai', 'brand_usage', 'confidentiality'
    )
  ),
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'expired', 'violation')
  ),
  accepted_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (partner_id, compliance_type)
);

alter table public.partner_compliance_records enable row level security;
revoke all on public.partner_compliance_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 13. partner_ecosystem_briefings + audit log
-- ---------------------------------------------------------------------------
create table if not exists public.partner_ecosystem_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.partner_ecosystem_briefings enable row level security;
revoke all on public.partner_ecosystem_briefings from authenticated, anon;

create table if not exists public.partner_ecosystem_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.partner_ecosystem_audit_log enable row level security;
revoke all on public.partner_ecosystem_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 14. Helpers (_partner_eco_)
-- ---------------------------------------------------------------------------
create or replace function public._partner_eco_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._partner_eco_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._partner_eco_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.partner_ecosystem_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'partner_certification_' || p_event_type, 'partner_certification', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._partner_eco_ensure_settings(p_tenant_id uuid)
returns public.partner_ecosystem_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.partner_ecosystem_settings;
begin
  insert into public.partner_ecosystem_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.partner_ecosystem_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

-- ---------------------------------------------------------------------------
-- 1. Schema: certification_level / partner_tier — extend constraints + migrate data
-- ---------------------------------------------------------------------------
alter table public.partners drop constraint if exists partners_certification_level_check;

do $$
begin
  if to_regclass('public.partner_ecosystem_profiles') is not null then
    alter table public.partner_ecosystem_profiles drop constraint if exists partner_ecosystem_profiles_partner_tier_check;
  end if;
end $$;

update public.partners
set certification_level = 'sales_representative'
where certification_level = 'registered';

update public.partners
set certification_level = 'expert'
where certification_level in ('advanced', 'strategic');

do $$
begin
  if to_regclass('public.partner_ecosystem_profiles') is not null then
    update public.partner_ecosystem_profiles
    set partner_tier = 'sales_representative'
    where partner_tier = 'registered';

    update public.partner_ecosystem_profiles
    set partner_tier = 'expert'
    where partner_tier in ('advanced', 'premier', 'strategic');
  end if;
end $$;

alter table public.partners
  add constraint partners_certification_level_check check (
    certification_level in ('sales_representative', 'sales_expert', 'certified', 'expert')
  );

do $$
begin
  if to_regclass('public.partner_ecosystem_profiles') is not null then
    alter table public.partner_ecosystem_profiles
      add constraint partner_ecosystem_profiles_partner_tier_check check (
        partner_tier in ('sales_representative', 'sales_expert', 'certified', 'expert')
      );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Tier label helper (A.45 + Phase 91)
-- ---------------------------------------------------------------------------
create or replace function public._mpfe_tier_label(p_level text)
returns text language sql immutable as $$
  select case p_level
    when 'sales_representative' then 'Aipify Sales Representative'
    when 'sales_expert' then 'Aipify Sales Expert'
    when 'certified' then 'Aipify Certified Partner'
    when 'expert' then 'Aipify Expert Partner'
    when 'registered' then 'Aipify Sales Representative'
    when 'advanced' then 'Aipify Expert Partner'
    when 'strategic' then 'Aipify Expert Partner'
    when 'premier' then 'Aipify Expert Partner'
    else initcap(replace(coalesce(p_level, ''), '_', ' '))
  end;
$$;

create or replace function public._partner_eco_tier_label(p_tier text)
returns text language sql immutable as $$
  select public._mpfe_tier_label(p_tier);
$$;

-- ---------------------------------------------------------------------------
-- 3. Update A.45 seed + submit defaults to new tier keys
-- ---------------------------------------------------------------------------
create or replace function public._mpfe_seed_partners()
returns void language plpgsql security definer set search_path = public as $$
declare v_partner_id uuid;
begin
  insert into public.partners (partner_name, partner_type, status, certification_level, website, quality_score)
  values
    ('Nordic Commerce Partners', 'integrator', 'approved', 'certified', 'https://example.com/nordic-commerce', 88),
    ('Workflow Studio AS', 'agency', 'approved', 'sales_expert', 'https://example.com/workflow-studio', 92),
    ('Aipify Training Collective', 'training_provider', 'approved', 'expert', 'https://example.com/training', 95)
  on conflict do nothing;

  update public.partners set certification_level = 'certified'
  where partner_name = 'Nordic Commerce Partners' and certification_level not in ('sales_representative', 'sales_expert', 'certified', 'expert');
  update public.partners set certification_level = 'sales_expert'
  where partner_name = 'Workflow Studio AS' and certification_level not in ('sales_representative', 'sales_expert', 'certified', 'expert');
  update public.partners set certification_level = 'expert'
  where partner_name = 'Aipify Training Collective' and certification_level not in ('sales_representative', 'sales_expert', 'certified', 'expert');

  select id into v_partner_id from public.partners where partner_name = 'Nordic Commerce Partners' limit 1;
  if v_partner_id is not null then
    insert into public.marketplace_offerings (partner_id, offering_type, title, description, version, status, quality_indicator)
    values
      (v_partner_id, 'integrations', 'Shopify Connector Pack', 'Pre-built Shopify integration templates', '1.2.0', 'published', 'excellent'),
      (v_partner_id, 'business_packs', 'Nordic Retail Pack', 'Retail operations pack for Nordic markets', '1.0.0', 'published', 'good')
    on conflict do nothing;
  end if;

  select id into v_partner_id from public.partners where partner_name = 'Workflow Studio AS' limit 1;
  if v_partner_id is not null then
    insert into public.marketplace_offerings (partner_id, offering_type, title, description, version, status, quality_indicator)
    values
      (v_partner_id, 'workflow_templates', 'Support Escalation Workflow', 'Multi-step support escalation template', '2.0.0', 'published', 'excellent'),
      (v_partner_id, 'consulting_services', 'Operations Review', 'Quarterly operations optimization consulting', '1.0.0', 'published', 'good')
    on conflict do nothing;
  end if;

  select id into v_partner_id from public.partners where partner_name = 'Aipify Training Collective' limit 1;
  if v_partner_id is not null then
    insert into public.marketplace_offerings (partner_id, offering_type, title, description, version, status, quality_indicator)
    values
      (v_partner_id, 'training_content', 'Aipify Administrator Certification', 'Role-based admin training path', '3.1.0', 'published', 'excellent'),
      (v_partner_id, 'industry_templates', 'Hospitality Onboarding Template', 'Industry-specific onboarding content', '1.0.0', 'published', 'acceptable')
    on conflict do nothing;
  end if;
end; $$;

create or replace function public.submit_partner_for_review(
  p_partner_name text,
  p_partner_type text default 'developer',
  p_website text default null,
  p_offering jsonb default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_partner public.partners;
  v_offering public.marketplace_offerings;
begin
  perform public._irp_require_permission('ecosystem.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if coalesce(trim(p_partner_name), '') = '' then
    raise exception 'Partner name required';
  end if;

  insert into public.partners (
    partner_name, partner_type, status, certification_level, website,
    submitted_by_organization_id, reviewed_by
  )
  values (
    left(trim(p_partner_name), 200),
    coalesce(p_partner_type, 'developer'),
    'pending',
    'sales_representative',
    left(coalesce(p_website, ''), 500),
    v_org_id,
    v_user_id
  )
  returning * into v_partner;

  if p_offering is not null and p_offering ? 'title' then
    insert into public.marketplace_offerings (
      partner_id, offering_type, title, description, version, status
    )
    values (
      v_partner.id,
      coalesce(p_offering->>'offering_type', 'integrations'),
      left(p_offering->>'title', 200),
      left(coalesce(p_offering->>'description', ''), 2000),
      coalesce(p_offering->>'version', '1.0.0'),
      'draft'
    )
    returning * into v_offering;
  end if;

  perform public._mpfe_log(v_org_id, 'partner_submitted_for_review', 'partner', v_partner.id,
    jsonb_build_object('partner_name', v_partner.partner_name));

  return jsonb_build_object('partner_id', v_partner.id, 'status', v_partner.status);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Phase 91 seed helpers — new tier keys
-- ---------------------------------------------------------------------------
create or replace function public._partner_eco_seed_partners(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.partner_ecosystem_profiles (
    tenant_id, partner_name, partner_type, partner_tier, status, country,
    industry_expertise, languages, service_offerings, description, metadata
  )
  select p_tenant_id, er.relationship_name,
    case er.category
      when 'partners' then 'implementation'
      when 'technology_providers' then 'technology'
      when 'consultants' then 'certified_consultant'
      when 'external_developers' then 'development'
      else 'certified_consultant'
    end,
    case when er.strategic_importance in ('high', 'critical') then 'certified' else 'sales_representative' end,
    'active', 'Global',
    array[er.category],
    array['English'],
    array['Implementation', 'Advisory'],
    coalesce(er.description, 'Trusted Aipify partner from ecosystem intelligence.'),
    jsonb_build_object('source', 'ecosystem_intelligence', 'relationship_id', er.id)
  from public.ecosystem_relationships er
  where er.tenant_id = p_tenant_id
    and er.category in ('partners', 'suppliers', 'technology_providers', 'consultants', 'external_developers')
    and er.status = 'active'
  on conflict (tenant_id, partner_name) do nothing;

  insert into public.partner_ecosystem_profiles (
    tenant_id, partner_name, partner_type, partner_tier, status, country,
    industry_expertise, languages, service_offerings, description
  )
  select p_tenant_id, 'Aipify Implementation Services', 'implementation', 'expert', 'active', 'Global',
    array['Enterprise', 'Commerce'], array['English', 'Danish'],
    array['Installation', 'Configuration', 'Onboarding'],
    'Expert Partner for enterprise Aipify deployments.'
  where not exists (
    select 1 from public.partner_ecosystem_profiles p
    where p.tenant_id = p_tenant_id and p.partner_name = 'Aipify Implementation Services'
  );
end; $$;

create or replace function public._partner_eco_seed_certifications(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_partner record;
  v_track record;
  v_progress numeric;
begin
  for v_partner in
    select id, partner_tier from public.partner_ecosystem_profiles
    where tenant_id = p_tenant_id and status = 'active' limit 10
  loop
    for v_track in
      select id, track_key from public.partner_certification_tracks
      where tenant_id = p_tenant_id and status = 'active'
    loop
      v_progress := case v_partner.partner_tier
        when 'expert' then 100
        when 'certified' then 70
        when 'sales_expert' then 55
        else 25
      end;
      if v_track.track_key not in ('foundations', 'support_ai') and v_partner.partner_tier = 'sales_representative' then
        v_progress := 10;
      end if;

      insert into public.partner_certification_progress (
        tenant_id, partner_id, track_id, status, progress_pct, completed_at, expires_at
      )
      values (
        p_tenant_id, v_partner.id, v_track.id,
        case when v_progress >= 100 then 'completed'
             when v_progress >= 50 then 'in_progress'
             else 'not_started' end,
        v_progress,
        case when v_progress >= 100 then now() - interval '30 days' else null end,
        case when v_progress >= 100 then now() + interval '24 months' else null end
      )
      on conflict (partner_id, track_id) do nothing;

      if v_progress >= 100 then
        insert into public.partner_digital_credentials (
          tenant_id, partner_id, track_id, credential_code, title, badge_label, status, expires_at
        )
        select p_tenant_id, v_partner.id, v_track.id,
          'PCE-' || upper(substr(md5(v_partner.id::text || v_track.id::text), 1, 8)),
          t.title || ' Certificate', 'Verified', 'active', now() + interval '24 months'
        from public.partner_certification_tracks t where t.id = v_track.id
        on conflict (tenant_id, credential_code) do nothing;
      end if;
    end loop;
  end loop;
end; $$;

create or replace function public._partner_eco_seed_leads(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.partner_lead_registrations (
    tenant_id, partner_id, opportunity_name, company_name, country, estimated_value, status, protection_expires_at
  )
  select p_tenant_id, p.id, 'Enterprise rollout — ' || p.partner_name,
    'Prospect Co.', coalesce(p.country, 'Global'), 50000 + random() * 150000,
    'protected', now() + interval '90 days'
  from public.partner_ecosystem_profiles p
  where p.tenant_id = p_tenant_id and p.partner_tier in ('certified', 'sales_expert', 'expert')
    and p.status = 'active'
  limit 3;

  if not exists (select 1 from public.partner_lead_registrations where tenant_id = p_tenant_id) then
    insert into public.partner_lead_registrations (
      tenant_id, opportunity_name, company_name, country, estimated_value, status
    ) values (
      p_tenant_id, 'Commerce expansion opportunity', 'Retail Group AB', 'Sweden', 75000, 'registered'
    );
  end if;
end; $$;

create or replace function public._partner_eco_seed_compliance(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.partner_compliance_records (tenant_id, partner_id, compliance_type, status, accepted_at, expires_at)
  select p_tenant_id, p.id, c.type,
    case when p.partner_tier in ('certified', 'sales_expert', 'expert') then 'accepted' else 'pending' end,
    case when p.partner_tier in ('certified', 'sales_expert', 'expert') then now() - interval '60 days' else null end,
    case when p.partner_tier in ('certified', 'sales_expert', 'expert') then now() + interval '12 months' else null end
  from public.partner_ecosystem_profiles p
  cross join (values
    ('code_of_conduct'), ('data_protection'), ('ethical_ai'), ('brand_usage'), ('confidentiality')
  ) as c(type)
  where p.tenant_id = p_tenant_id and p.status = 'active'
  on conflict (partner_id, compliance_type) do nothing;
end; $$;

create or replace function public._partner_eco_ecosystem_health(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_partners int;
  v_certified int;
  v_avg_score numeric;
  v_leads int;
  v_compliance_pct numeric;
begin
  select count(*), count(*) filter (where partner_tier in ('certified', 'sales_expert', 'expert'))
  into v_partners, v_certified from public.partner_ecosystem_profiles
  where tenant_id = p_tenant_id and status = 'active';

  select coalesce(avg(overall_score), 0) into v_avg_score
  from public.partner_ecosystem_scorecards sc
  join public.partner_ecosystem_profiles p on p.id = sc.partner_id
  where p.tenant_id = p_tenant_id
  and sc.calculated_at = (select max(calculated_at) from public.partner_ecosystem_scorecards where partner_id = sc.partner_id);

  select count(*) into v_leads from public.partner_lead_registrations
  where tenant_id = p_tenant_id and status in ('registered', 'qualified', 'protected');

  select coalesce(
    100.0 * count(*) filter (where status = 'accepted') / nullif(count(*), 0), 0
  ) into v_compliance_pct from public.partner_compliance_records where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'ecosystem_score', least(100, round((v_avg_score * 0.4 + (v_certified::numeric / greatest(v_partners, 1)) * 60))),
    'active_partners', v_partners,
    'certified_partners', v_certified,
    'avg_partner_score', round(coalesce(v_avg_score, 0), 1),
    'open_leads', v_leads,
    'compliance_pct', round(coalesce(v_compliance_pct, 0), 1)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Phase 33 blueprint helpers (_penbp_*)
-- ---------------------------------------------------------------------------
create or replace function public._penbp_blueprint_mission()
returns text language sql immutable as $$
  select 'Build a global network of qualified Aipify professionals — Sales Representatives, Sales Experts, Certified Partners, and Expert Partners — who help organizations succeed with ABOS adoption.';
$$;

create or replace function public._penbp_blueprint_philosophy()
returns text language sql immutable as $$
  select 'Technology succeeds when knowledgeable people guide adoption — partners strengthen trust through verified expertise and professional engagement.';
$$;

create or replace function public._penbp_blueprint_partner_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'implementation_partners', 'label', 'Certified implementation partners', 'description', 'Qualified partners who deploy and configure Aipify in customer environments'),
    jsonb_build_object('key', 'consultants', 'label', 'Consultants', 'description', 'Advisors who guide operational strategy and ABOS adoption'),
    jsonb_build_object('key', 'solution_architects', 'label', 'Solution architects', 'description', 'Design integrations, business packs, and multi-module solutions'),
    jsonb_build_object('key', 'training_specialists', 'label', 'Training specialists', 'description', 'Deliver learning paths and certification preparation'),
    jsonb_build_object('key', 'msps', 'label', 'Managed service providers', 'description', 'Ongoing operational support and optimization for customer tenants'),
    jsonb_build_object('key', 'opportunity_introduction', 'label', 'Opportunity introduction', 'description', 'Sales Representatives and Sales Experts identify and nurture customer opportunities', 'status', 'active')
  );
$$;

create or replace function public._penbp_blueprint_partner_tiers()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'tier_key', 'sales_representative',
      'display_name', 'Aipify Sales Representative',
      'certification_level', 'sales_representative',
      'focus', 'Prospecting, relationship building, product introductions, opportunity identification',
      'requirements', jsonb_build_array('Product understanding', 'Partner onboarding completed'),
      'benefits', jsonb_build_array('Partner directory listing', 'Partner Resources access', 'Recurring commission')
    ),
    jsonb_build_object(
      'tier_key', 'sales_expert',
      'display_name', 'Aipify Sales Expert',
      'certification_level', 'sales_expert',
      'focus', 'Product demos, solution matching, business pack recommendations',
      'requirements', jsonb_build_array('Aipify Foundations Certification', 'Demonstrated opportunity management'),
      'benefits', jsonb_build_array('Enhanced recurring commission', 'Pipeline visibility', 'Co-marketing opportunities')
    ),
    jsonb_build_object(
      'tier_key', 'certified',
      'display_name', 'Aipify Certified Partner',
      'certification_level', 'certified',
      'focus', 'Onboarding, KC setup, workflow config, training delivery',
      'requirements', jsonb_build_array('Administrator Certification', 'Successful customer implementations'),
      'benefits', jsonb_build_array('Enhanced directory visibility', 'Implementation services recognition', 'Early feature access')
    ),
    jsonb_build_object(
      'tier_key', 'expert',
      'display_name', 'Aipify Expert Partner',
      'certification_level', 'expert',
      'focus', 'Executive consulting, industry specialization, large-scale implementations',
      'requirements', jsonb_build_array('Advanced certifications', 'Proven customer outcomes', 'Ecosystem contributions'),
      'benefits', jsonb_build_array('Strategic collaboration', 'Preferred partner status', 'Advisory participation')
    )
  );
$$;

create or replace function public._penbp_blueprint_partner_capabilities()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'onboarding', 'label', 'Onboarding', 'description', 'Guide new organizations through install and initial configuration'),
    jsonb_build_object('key', 'training', 'label', 'Training', 'description', 'Deliver certification prep and team enablement'),
    jsonb_build_object('key', 'kc_development', 'label', 'Knowledge Center development', 'description', 'Help build approved KC articles and industry packs'),
    jsonb_build_object('key', 'integration_guidance', 'label', 'Integration guidance', 'description', 'Connect customer systems via Integration Engine'),
    jsonb_build_object('key', 'business_pack_selection', 'label', 'Business pack selection', 'description', 'Recommend and activate outcome-oriented packs'),
    jsonb_build_object('key', 'operational_optimization', 'label', 'Operational optimization', 'description', 'Improve workflows, support operations, and executive visibility')
  );
$$;

create or replace function public._penbp_blueprint_partner_marketplace_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizations discover partners, review expertise, evaluate certifications, and request assistance — human approval before engagement.',
    'discovery_steps', jsonb_build_array(
      'Browse approved partners in the expert network directory',
      'Review expertise areas and official partner tier',
      'Evaluate published offerings and quality indicators',
      'Submit assistance request — partner review with human approval'
    ),
    'route', '/app/marketplace-partner-ecosystem-foundation-engine',
    'partners_route', '/app/partners',
    'boundary', 'Metadata and governance fields only — no partner PII beyond approved directory listings.'
  );
$$;

create or replace function public._penbp_blueprint_partner_portal_terminology()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partner Portal uses professional business terminology — never affiliate or hustle language in customer-facing copy.',
    'preferred_terms', jsonb_build_array(
      jsonb_build_object('key', 'customers', 'label', 'Customers', 'replaces', 'Leads (when meaning relationships)'),
      jsonb_build_object('key', 'opportunities', 'label', 'Opportunities', 'replaces', 'Lead referral program'),
      jsonb_build_object('key', 'pipeline', 'label', 'Pipeline', 'replaces', 'Referral hustle'),
      jsonb_build_object('key', 'commission_overview', 'label', 'Commission Overview', 'replaces', 'Affiliate Earnings'),
      jsonb_build_object('key', 'certifications', 'label', 'Certifications', 'replaces', 'Generic badges'),
      jsonb_build_object('key', 'performance_insights', 'label', 'Performance Insights', 'replaces', 'Hustle metrics'),
      jsonb_build_object('key', 'partner_resources', 'label', 'Partner Resources', 'replaces', 'Affiliate toolkit')
    ),
    'avoid_terms', jsonb_build_array(
      'Affiliate', 'Affiliate Dashboard', 'Affiliate Earnings', 'Referral hustle', 'Reseller hustle'
    ),
    'partners_route', '/app/partners'
  );
$$;

create or replace function public._penbp_blueprint_compensation_principle()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Transparent, tier-aligned compensation — recurring commission for sales roles; implementation and services revenue for delivery partners.',
    'tiers', jsonb_build_array(
      jsonb_build_object('tier', 'sales_representative', 'label', 'Aipify Sales Representative', 'model', 'Recurring commission on qualified opportunities'),
      jsonb_build_object('tier', 'sales_expert', 'label', 'Aipify Sales Expert', 'model', 'Enhanced recurring commission with demo and solution-matching accountability'),
      jsonb_build_object('tier', 'certified', 'label', 'Aipify Certified Partner', 'model', 'Implementation and enablement services revenue'),
      jsonb_build_object('tier', 'expert', 'label', 'Aipify Expert Partner', 'model', 'Advisory, enterprise deployment, and strategic engagement fees')
    ),
    'governance', 'Human approval required for program changes — metadata only on dashboard; no payment PII stored in partner ecosystem tables.',
    'boundary', 'Distinct from Commercial Packages billing at /app/settings/billing — partner compensation governance is program metadata.'
  );
$$;

create or replace function public._penbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Celebrate partner achievements, support continuous learning, and encourage collaboration over competition — expert growth strengthens the whole ecosystem.',
    'practices', jsonb_build_array(
      'Celebrate certification milestones without comparison pressure',
      'Support learning pathways — partners grow alongside customers',
      'Collaboration over competition — shared success in the expert network',
      'Self Love encourages sustainable partner engagement — never urgency or guilt'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'boundary', 'Self Love influences partner community tone — Partner Expert Network stores governance metadata only.'
  );
$$;

create or replace function public._penbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizations should understand what each official tier means, how verified expertise is earned, and how to escalate when expectations are not met.',
    'organizations_should_understand', jsonb_build_array(
      'What each partner tier represents — Sales Representative through Expert Partner',
      'How partner status is earned through demonstrated outcomes and recertification',
      'Verified expertise — approved partners only in production directory views',
      'Escalation path when assistance quality or trust concerns arise'
    ),
    'security_route', '/app/security-trust-engine',
    'trust_route', '/app/trust-reputation-engine',
    'boundary', 'Trust surfaces explain certification meaning — Partner Expert Network governs partner metadata and human approval workflows.'
  );
$$;

create or replace function public._penbp_blueprint_certification_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partner tiers connect to Aipify certification pathways — Foundations for Sales Expert, Administrator for Certified Partner, advanced paths for Expert Partner.',
    'pathways', jsonb_build_array(
      jsonb_build_object('key', 'foundations', 'label', 'Foundations', 'description', 'Core ABOS understanding — required for Aipify Sales Expert tier', 'tier', 'sales_expert'),
      jsonb_build_object('key', 'administrator', 'label', 'Administrator', 'description', 'Operational certification — Aipify Certified Partner requirement', 'tier', 'certified'),
      jsonb_build_object('key', 'executive', 'label', 'Executive', 'description', 'Leadership and strategic certification pathway', 'tier', 'expert'),
      jsonb_build_object('key', 'industry', 'label', 'Industry certifications', 'description', 'Sector-specific expertise credentials', 'tier', 'expert'),
      jsonb_build_object('key', 'future', 'label', 'Future pathways', 'description', 'Expanding certification catalog — metadata scaffold', 'status', 'future_scaffold')
    ),
    'certification_route', '/app/certification-achievement-engine',
    'training_route', '/app/learning-training-engine',
    'partners_route', '/app/partners'
  );
$$;

create or replace function public._penbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates partner governance, official tier mapping, and certification pathways internally; Unonight is the first external pilot for expert network discovery.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation',
      'focus', jsonb_build_array('Official tier mapping', 'Partner certification workflow', 'Recertification and quality indicators'),
      'note', 'Validate tier labels, human approval flows, and certification cross-links before broad release'
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot',
      'focus', jsonb_build_array('Discover Certified and Expert Partners', 'Commerce implementation assistance', 'Training and onboarding support'),
      'note', 'First external organization to locate and engage qualified Aipify experts using official tier terminology'
    )
  );
$$;

create or replace function public._penbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'certification_achievement', 'label', 'Certification & Achievement (A.37)', 'route', '/app/certification-achievement-engine', 'note', 'Foundations, Administrator, Executive, and industry certification pathways'),
    jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training (A.36 / Phase 31)', 'route', '/app/learning-training-engine', 'note', 'Training paths and certification preparation'),
    jsonb_build_object('key', 'partners', 'label', 'Partner Certification (Phase 91)', 'route', '/app/partners', 'note', 'Partner portal — Opportunities, Pipeline, Certifications'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Celebrate achievements — collaboration over competition'),
    jsonb_build_object('key', 'security_trust', 'label', 'Security & Trust (A.18 / Phase 30)', 'route', '/app/security-trust-engine', 'note', 'What certifications mean and verified expertise transparency'),
    jsonb_build_object('key', 'trust_reputation', 'label', 'Trust & Reputation (Phase 26)', 'route', '/app/trust-reputation-engine', 'note', 'Trust relationship and escalation pathways'),
    jsonb_build_object('key', 'marketplace_ecosystem', 'label', 'Marketplace Ecosystem (A.45 / Phase 19)', 'route', '/app/marketplace-partner-ecosystem-foundation-engine', 'note', 'Ecosystem objectives, offerings, and activation — this engine')
  );
$$;

create or replace function public._penbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Technology succeeds when knowledgeable people guide adoption.',
    'Partners strengthen trust — verified expertise, not anonymous marketplaces.',
    'Organizations locate experts who understand their industry and goals.',
    'Official tiers must be credible — earned through demonstrated outcomes.',
    'Responsible growth — quality partners over quantity.',
    'Collaboration over competition — the expert network succeeds together.',
    'Professional partner language — never affiliate hustle in public copy.'
  );
$$;

create or replace function public._penbp_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_sales_rep int := 0;
  v_sales_expert int := 0;
  v_certified int := 0;
  v_expert int := 0;
  v_pending int := 0;
  v_suspended int := 0;
  v_published_offerings int := 0;
  v_org_submissions int := 0;
begin
  if to_regclass('public.partners') is not null then
    select count(*) into v_sales_rep
    from public.partners where status = 'approved' and certification_level = 'sales_representative';

    select count(*) into v_sales_expert
    from public.partners where status = 'approved' and certification_level = 'sales_expert';

    select count(*) into v_certified
    from public.partners where status = 'approved' and certification_level = 'certified';

    select count(*) into v_expert
    from public.partners where status = 'approved' and certification_level = 'expert';

    select count(*) into v_pending from public.partners where status = 'pending';
    select count(*) into v_suspended from public.partners where status = 'suspended';

    select count(*) into v_org_submissions
    from public.partners where submitted_by_organization_id = p_organization_id;
  end if;

  if to_regclass('public.marketplace_offerings') is not null then
    select count(*) into v_published_offerings
    from public.marketplace_offerings where status = 'published';
  end if;

  return jsonb_build_object(
    'sales_representative_partners', v_sales_rep,
    'sales_expert_partners', v_sales_expert,
    'certified_partners', v_certified,
    'expert_partners', v_expert,
    'approved_partners_total', v_sales_rep + v_sales_expert + v_certified + v_expert,
    'pending_reviews', v_pending,
    'suspended_partners', v_suspended,
    'published_offerings', v_published_offerings,
    'org_partner_submissions', v_org_submissions,
    'tier_summary', format(
      '%s Sales Representatives, %s Sales Experts, %s Certified Partners, %s Expert Partners — %s pending review, %s published offerings.',
      v_sales_rep, v_sales_expert, v_certified, v_expert, v_pending, v_published_offerings
    ),
    'privacy_note', 'Partner counts by official tier only — no credentials, partner PII, or customer operational content.'
  );
end; $$;

create or replace function public._penbp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_approved int := 0;
  v_certified int := 0;
  v_expert int := 0;
  v_sales int := 0;
  v_pending int := 0;
  v_offerings int := 0;
begin
  v_engagement := public._penbp_engagement_summary(p_organization_id);
  v_approved := coalesce((v_engagement->>'approved_partners_total')::int, 0);
  v_certified := coalesce((v_engagement->>'certified_partners')::int, 0);
  v_expert := coalesce((v_engagement->>'expert_partners')::int, 0);
  v_sales := coalesce((v_engagement->>'sales_representative_partners')::int, 0)
    + coalesce((v_engagement->>'sales_expert_partners')::int, 0);
  v_pending := coalesce((v_engagement->>'pending_reviews')::int, 0);
  v_offerings := coalesce((v_engagement->>'published_offerings')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'organizations_locate_experts',
      'label', 'Organizations can locate qualified experts — approved partners in directory',
      'met', v_approved > 0,
      'note', case when v_approved = 0 then 'Approved partners populate the expert network after human review.' else null end
    ),
    jsonb_build_object(
      'key', 'partners_deliver_value',
      'label', 'Partners deliver value — published offerings from approved partners',
      'met', v_offerings > 0 and v_approved > 0,
      'note', case when v_offerings = 0 then 'Offerings publish after partner approval and quality review.' else null end
    ),
    jsonb_build_object(
      'key', 'official_tiers_documented',
      'label', 'Four official partner tiers documented with DB mapping',
      'met', jsonb_array_length(public._penbp_blueprint_partner_tiers()) = 4,
      'note', 'sales_representative, sales_expert, certified, expert — see PARTNER_TERMINOLOGY_UPDATE.md'
    ),
    jsonb_build_object(
      'key', 'tier_distribution',
      'label', 'Expert network shows tier progression — certified, expert, or sales partners present',
      'met', v_certified > 0 or v_expert > 0 or v_sales > 0,
      'note', null
    ),
    jsonb_build_object(
      'key', 'responsible_growth',
      'label', 'Responsible growth — human approval for pending applications',
      'met', true,
      'note', case when v_pending > 0 then format('%s partner applications awaiting human review.', v_pending) else 'Human approval required for all partner actions.' end
    ),
    jsonb_build_object(
      'key', 'portal_terminology',
      'label', 'Partner Portal professional terminology documented — no affiliate language',
      'met', jsonb_array_length(public._penbp_blueprint_partner_portal_terminology()->'preferred_terms') >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'certification_connection',
      'label', 'Certification connection — pathways cross-link A.37 and Learning & Training A.36',
      'met', (public._penbp_blueprint_certification_connection()->>'certification_route') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust connection — what official tiers mean and escalation documented',
      'met', jsonb_array_length(public._penbp_blueprint_trust_connection()->'organizations_should_understand') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_collaboration',
      'label', 'Self Love connection — collaboration over competition principle',
      'met', true,
      'note', 'Self Love is a principle — celebrate partner learning without comparison guilt.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links to certification, training, partners, trust, self-love, and security surfaces',
      'met', jsonb_array_length(public._penbp_blueprint_integration_links()) >= 6,
      'note', null
    )
  );
end; $$;

create or replace function public._penbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Certification & Achievement A.37 /app/certification-achievement-engine (internal team certifications), Learning & Training A.36 /app/learning-training-engine (user education paths), Partner Certification Phase 91 /app/partners (partner portal — Opportunities, Pipeline, Certifications), Module Marketplace A.23 (module licensing), and Marketplace Ecosystem Blueprint Phase 19 (ecosystem objectives, connectors, industry packs). Phase 33 focuses on the global Aipify Expert Network with official partner tiers. All Phase 19 fields preserved. See PARTNER_TERMINOLOGY_UPDATE.md.';
$$;

-- ---------------------------------------------------------------------------
-- 6. Dashboard + card — preserve Phase 19; append Phase 33
-- ---------------------------------------------------------------------------
create or replace function public.get_marketplace_partner_ecosystem_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._mpfe_seed_partners();

  return jsonb_build_object(
    'has_organization', true,
    'approved_partners', coalesce((select count(*) from public.partners where status = 'approved'), 0),
    'published_offerings', coalesce((select count(*) from public.marketplace_offerings where status = 'published'), 0),
    'pending_reviews', coalesce((select count(*) from public.partners where status = 'pending'), 0),
    'philosophy', 'Certified partner ecosystem with governed offerings.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 19,
      'title', 'Marketplace & Ecosystem Engine',
      'engine_phase', 'A.45',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE19_MARKETPLACE_ECOSYSTEM.md'
    ),
    'mission', 'Discover, activate, and benefit from ecosystem extensions — Business Packs, Industry Packs, Connectors, Knowledge Packs, and Companion Skills.',
    'abos_principle', 'No single platform solves everything — empower contributors and grow the ecosystem openly.',
    'ecosystem_activation_summary', public._mpfe_ecosystem_activation_summary(v_org_id),
    'partner_mission', public._penbp_blueprint_mission(),
    'partner_philosophy', public._penbp_blueprint_philosophy(),
    'partner_abos_principle', 'Verified expertise earns trust — official partner tiers must be credible and outcomes-driven.',
    'implementation_blueprint_phase33', jsonb_build_object(
      'phase', 33,
      'title', 'Partner & Aipify Expert Network Engine',
      'engine_phase', 'A.45',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md'
    ),
    'partner_engagement_summary', public._penbp_engagement_summary(v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_marketplace_partner_ecosystem_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('ecosystem.view');
  v_org_id := public._mta_require_organization();
  perform public._mpfe_seed_partners();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Curated partner ecosystem — approved partners, offerings, and certification with human governance. Extends Module Marketplace (A.23), Business Packs (A.43), and API Platform (A.21).',
    'principles', jsonb_build_array(
      'Approved partners only in production views',
      'Official partner tiers with re-certification workflow',
      'Offering quality indicators — transparent, not hidden',
      'Full audit for approvals, suspensions, and publications',
      'Metadata only — no partner PII in dashboard'
    ),
    'summary', jsonb_build_object(
      'approved_partners', coalesce((select count(*) from public.partners where status = 'approved'), 0),
      'pending_partners', coalesce((select count(*) from public.partners where status = 'pending'), 0),
      'suspended_partners', coalesce((select count(*) from public.partners where status = 'suspended'), 0),
      'published_offerings', coalesce((select count(*) from public.marketplace_offerings where status = 'published'), 0),
      'strategic_partners', coalesce((select count(*) from public.partners where certification_level = 'expert' and status = 'approved'), 0),
      'org_submissions', coalesce((select count(*) from public.partners where submitted_by_organization_id = v_org_id), 0)
    ),
    'approved_partners', coalesce((
      select jsonb_agg(
        (row_to_json(p)::jsonb || jsonb_build_object(
          'certification_level_label', public._mpfe_tier_label(p.certification_level)
        ))
        order by
          case p.certification_level when 'expert' then 0 when 'certified' then 1 when 'sales_expert' then 2 when 'sales_representative' then 3 else 4 end,
          p.partner_name
      )
      from public.partners p where p.status = 'approved'
    ), '[]'::jsonb),
    'pending_partners', coalesce((
      select jsonb_agg(
        (row_to_json(p)::jsonb || jsonb_build_object(
          'certification_level_label', public._mpfe_tier_label(p.certification_level)
        ))
        order by p.created_at desc
      )
      from public.partners p where p.status = 'pending'
    ), '[]'::jsonb),
    'offerings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'offering', row_to_json(o),
        'partner_name', p.partner_name,
        'partner_certification', p.certification_level,
        'partner_certification_label', public._mpfe_tier_label(p.certification_level)
      ) order by o.title)
      from public.marketplace_offerings o
      join public.partners p on p.id = o.partner_id
      where o.status = 'published' and p.status = 'approved'
    ), '[]'::jsonb),
    'certification_breakdown', coalesce((
      select jsonb_object_agg(certification_level, cnt)
      from (
        select certification_level, count(*) as cnt
        from public.partners where status = 'approved'
        group by certification_level
      ) s
    ), '{}'::jsonb),
    'certification_breakdown_labels', coalesce((
      select jsonb_object_agg(certification_level, public._mpfe_tier_label(certification_level))
      from (
        select distinct certification_level
        from public.partners where status = 'approved'
      ) s
    ), '{}'::jsonb),
    'quality_indicators', coalesce((
      select jsonb_object_agg(coalesce(quality_indicator, 'unrated'), cnt)
      from (
        select quality_indicator, count(*) as cnt
        from public.marketplace_offerings where status = 'published'
        group by quality_indicator
      ) s
    ), '{}'::jsonb),
    'integration_notes', jsonb_build_object(
      'module_marketplace', jsonb_build_object('route', '/app/module-marketplace-foundation-engine', 'note', 'Activate modules from marketplace catalog'),
      'business_packs', jsonb_build_object('route', '/app/business-packs-foundation-engine', 'note', 'Business pack offerings from certified partners')
    ),
    'recent_activity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action_type', al.action_type,
        'entity_type', al.entity_type,
        'created_at', al.created_at,
        'metadata', al.metadata
      ) order by al.created_at desc)
      from (
        select action_type, entity_type, created_at, metadata
        from public.audit_logs
        where organization_id = v_org_id
          and action_type in (
            'partner_submitted_for_review', 'partner_application_reviewed',
            'partner_approved', 'partner_suspended', 'partner_recertified',
            'offering_published', 'offering_suspended'
          )
        order by created_at desc
        limit 10
      ) al
    ), '[]'::jsonb),
    'implementation_blueprint', jsonb_build_object(
      'phase', 19,
      'title', 'Marketplace & Ecosystem Engine',
      'engine_phase', 'A.45',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE19_MARKETPLACE_ECOSYSTEM.md',
      'mapping_note', 'ABOS Blueprint Phase 19 maps to Marketplace & Partner Ecosystem Foundation Engine A.45 — extend, do not duplicate Module Marketplace A.23 or Business Packs A.43.'
    ),
    'mission', 'Discover, activate, and benefit from ecosystem extensions — Business Packs, Industry Packs, Connectors, Knowledge Packs, and Companion Skills.',
    'abos_principle', 'No single platform solves everything — empower contributors and grow the ecosystem openly.',
    'ecosystem_objectives', public._mpfe_blueprint_ecosystem_objectives(),
    'industry_packs', public._mpfe_blueprint_industry_packs(),
    'connector_marketplace', public._mpfe_blueprint_connector_marketplace(),
    'knowledge_packs', public._mpfe_blueprint_knowledge_packs(),
    'companion_skills', public._mpfe_blueprint_companion_skills(),
    'self_love_connection', public._mpfe_blueprint_self_love_connection(),
    'trust_connection', public._mpfe_blueprint_trust_connection(),
    'quality_guardian_connection', public._mpfe_blueprint_quality_guardian_connection(),
    'dogfooding', public._mpfe_blueprint_dogfooding(),
    'integration_links', public._mpfe_blueprint_integration_links(),
    'ecosystem_activation_summary', public._mpfe_ecosystem_activation_summary(v_org_id),
    'success_criteria', public._mpfe_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._mpfe_blueprint_vision_phrases(),
    'partner_mission', public._penbp_blueprint_mission(),
    'partner_philosophy', public._penbp_blueprint_philosophy(),
    'partner_abos_principle', 'Verified expertise earns trust — official partner tiers must be credible and outcomes-driven.',
    'partner_vision', 'Organizations locate experts they trust — partners deliver measurable value through credible certification and collaboration.',
    'implementation_blueprint_phase33', jsonb_build_object(
      'phase', 33,
      'title', 'Partner & Aipify Expert Network Engine',
      'engine_phase', 'A.45',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md',
      'mapping_note', 'ABOS Blueprint Phase 33 extends A.45 with expert network tiers, partner discovery, certification cross-links — preserves Phase 19 ecosystem fields. See PARTNER_TERMINOLOGY_UPDATE.md.'
    ),
    'partner_objectives', public._penbp_blueprint_partner_objectives(),
    'partner_tiers', public._penbp_blueprint_partner_tiers(),
    'partner_capabilities', public._penbp_blueprint_partner_capabilities(),
    'partner_marketplace_connection', public._penbp_blueprint_partner_marketplace_connection(),
    'partner_portal_terminology', public._penbp_blueprint_partner_portal_terminology(),
    'compensation_principle', public._penbp_blueprint_compensation_principle(),
    'partner_self_love_connection', public._penbp_blueprint_self_love_connection(),
    'partner_trust_connection', public._penbp_blueprint_trust_connection(),
    'certification_connection', public._penbp_blueprint_certification_connection(),
    'partner_dogfooding', public._penbp_blueprint_dogfooding(),
    'penbp_integration_links', public._penbp_blueprint_integration_links(),
    'partner_engagement_summary', public._penbp_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._penbp_blueprint_success_criteria(v_org_id),
    'partner_vision_phrases', public._penbp_blueprint_vision_phrases(),
    'blueprint_distinction_note', public._penbp_distinction_note()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Phase 91 dashboard — four official tiers
-- ---------------------------------------------------------------------------
create or replace function public.get_partner_ecosystem_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.partner_ecosystem_settings;
  v_health jsonb;
begin
  v_tenant_id := public._partner_eco_require_tenant();
  v_settings := public._partner_eco_ensure_settings(v_tenant_id);
  perform public._partner_eco_seed_tracks(v_tenant_id);
  perform public._partner_eco_seed_resources(v_tenant_id);
  perform public._partner_eco_seed_partners(v_tenant_id);
  perform public._partner_eco_seed_certifications(v_tenant_id);
  perform public._partner_eco_seed_leads(v_tenant_id);
  perform public._partner_eco_seed_compliance(v_tenant_id);
  perform public._partner_eco_calculate_scorecards(v_tenant_id);
  v_health := public._partner_eco_ecosystem_health(v_tenant_id);
  perform public._partner_eco_trust_explanation(v_tenant_id,
    (v_health->>'ecosystem_score')::numeric, 'Partner Ecosystem Health');

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'program_enabled', v_settings.program_enabled,
    'lead_referral_enabled', v_settings.lead_referral_enabled,
    'public_directory_enabled', v_settings.public_directory_enabled,
    'philosophy', 'Enable others to succeed with Aipify — professional partner engagement.',
    'safety_note', 'Aipify supports partner success. High-impact program decisions require human approval.',
    'ecosystem_score', v_health->'ecosystem_score',
    'active_partners', v_health->'active_partners',
    'certified_partners', v_health->'certified_partners',
    'avg_partner_score', v_health->'avg_partner_score',
    'open_leads', v_health->'open_leads',
    'compliance_pct', v_health->'compliance_pct',
    'partner_categories', jsonb_build_array(
      'Implementation Partners', 'Certified Consultants', 'Development Partners',
      'Technology Partners', 'Strategic Alliance Partners', 'Training Partners',
      'Managed Service Providers', 'Sales Partners'
    ),
    'partner_tiers', jsonb_build_array(
      jsonb_build_object('tier', 'sales_representative', 'label', public._partner_eco_tier_label('sales_representative')),
      jsonb_build_object('tier', 'sales_expert', 'label', public._partner_eco_tier_label('sales_expert')),
      jsonb_build_object('tier', 'certified', 'label', public._partner_eco_tier_label('certified')),
      jsonb_build_object('tier', 'expert', 'label', public._partner_eco_tier_label('expert'))
    ),
    'partners', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'partner_name', p.partner_name, 'partner_type', p.partner_type,
        'partner_tier', p.partner_tier, 'partner_tier_label', public._partner_eco_tier_label(p.partner_tier),
        'status', p.status, 'country', p.country, 'industry_expertise', p.industry_expertise,
        'languages', p.languages, 'service_offerings', p.service_offerings, 'description', p.description
      ) order by case p.partner_tier
        when 'expert' then 1 when 'certified' then 2 when 'sales_expert' then 3 when 'sales_representative' then 4 else 5 end)
      from public.partner_ecosystem_profiles p where p.tenant_id = v_tenant_id and p.status = 'active' limit 20
    ), '[]'::jsonb),
    'certification_tracks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'track_key', t.track_key, 'title', t.title, 'description', t.description,
        'certification_area', t.certification_area, 'requirements', t.requirements, 'renewal_months', t.renewal_months
      ))
      from public.partner_certification_tracks t where t.tenant_id = v_tenant_id and t.status = 'active'
    ), '[]'::jsonb),
    'certification_progress', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cp.id, 'partner_name', p.partner_name, 'track_title', t.title,
        'status', cp.status, 'progress_pct', cp.progress_pct, 'expires_at', cp.expires_at
      ) order by cp.progress_pct desc)
      from public.partner_certification_progress cp
      join public.partner_ecosystem_profiles p on p.id = cp.partner_id
      join public.partner_certification_tracks t on t.id = cp.track_id
      where cp.tenant_id = v_tenant_id limit 15
    ), '[]'::jsonb),
    'digital_credentials', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'credential_code', c.credential_code, 'title', c.title,
        'partner_name', p.partner_name, 'badge_label', c.badge_label,
        'status', c.status, 'issued_at', c.issued_at, 'expires_at', c.expires_at
      ) order by c.issued_at desc)
      from public.partner_digital_credentials c
      join public.partner_ecosystem_profiles p on p.id = c.partner_id
      where c.tenant_id = v_tenant_id and c.status = 'active' limit 10
    ), '[]'::jsonb),
    'scorecards', coalesce((
      select jsonb_agg(jsonb_build_object(
        'partner_name', p.partner_name, 'partner_tier', p.partner_tier,
        'partner_tier_label', public._partner_eco_tier_label(p.partner_tier),
        'overall_score', sc.overall_score, 'certification_completion', sc.certification_completion,
        'customer_feedback_score', sc.customer_feedback_score, 'implementation_success', sc.implementation_success
      ) order by sc.overall_score desc)
      from public.partner_ecosystem_scorecards sc
      join public.partner_ecosystem_profiles p on p.id = sc.partner_id
      where p.tenant_id = v_tenant_id
      limit 10
    ), '[]'::jsonb),
    'lead_registrations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'opportunity_name', l.opportunity_name, 'company_name', l.company_name,
        'country', l.country, 'estimated_value', l.estimated_value, 'status', l.status,
        'partner_name', p.partner_name, 'protection_expires_at', l.protection_expires_at
      ) order by l.created_at desc)
      from public.partner_lead_registrations l
      left join public.partner_ecosystem_profiles p on p.id = l.partner_id
      where l.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'resources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'title', r.title, 'description', r.description,
        'resource_type', r.resource_type, 'url', r.url
      ))
      from public.partner_ecosystem_resources r where r.tenant_id = v_tenant_id and r.status = 'active'
    ), '[]'::jsonb),
    'recognition_awards', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'award_type', a.award_type, 'title', a.title,
        'description', a.description, 'partner_name', p.partner_name, 'year', a.year
      ) order by a.awarded_at desc)
      from public.partner_recognition_awards a
      left join public.partner_ecosystem_profiles p on p.id = a.partner_id
      where a.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'compliance_records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cr.id, 'partner_id', cr.partner_id, 'partner_name', p.partner_name,
        'compliance_type', cr.compliance_type,
        'status', cr.status, 'accepted_at', cr.accepted_at, 'expires_at', cr.expires_at
      ))
      from public.partner_compliance_records cr
      join public.partner_ecosystem_profiles p on p.id = cr.partner_id
      where cr.tenant_id = v_tenant_id and cr.status = 'pending' limit 10
    ), '[]'::jsonb),
    'community_engagement', jsonb_build_array(
      'Partner forums', 'Advisory councils', 'Beta programs',
      'Product feedback initiatives', 'Innovation workshops'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.partner_ecosystem_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'knowledge_center', 'Partner & Certification Program education',
      'aipify_academy', 'Certification courses and assessments',
      'billing', 'Partner revenue and packaging',
      'enterprise_deployment', 'Enterprise partner deployment framework',
      'marketplace_governance', 'Quality standards for commerce partners',
      'ecosystem_intelligence', 'Partner relationship mapping'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Grants + KC category
-- ---------------------------------------------------------------------------
grant execute on function public._mpfe_tier_label(text) to authenticated;
grant execute on function public._penbp_blueprint_mission() to authenticated;
grant execute on function public._penbp_blueprint_philosophy() to authenticated;
grant execute on function public._penbp_blueprint_partner_objectives() to authenticated;
grant execute on function public._penbp_blueprint_partner_tiers() to authenticated;
grant execute on function public._penbp_blueprint_partner_capabilities() to authenticated;
grant execute on function public._penbp_blueprint_partner_marketplace_connection() to authenticated;
grant execute on function public._penbp_blueprint_partner_portal_terminology() to authenticated;
grant execute on function public._penbp_blueprint_compensation_principle() to authenticated;
grant execute on function public._penbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._penbp_blueprint_trust_connection() to authenticated;
grant execute on function public._penbp_blueprint_certification_connection() to authenticated;
grant execute on function public._penbp_blueprint_dogfooding() to authenticated;
grant execute on function public._penbp_blueprint_integration_links() to authenticated;
grant execute on function public._penbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._penbp_engagement_summary(uuid) to authenticated;
grant execute on function public._penbp_blueprint_success_criteria(uuid) to authenticated;
grant execute on function public._penbp_distinction_note() to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'partner-expert-network-engine-blueprint', 'Partner & Aipify Expert Network Engine (ABOS Phase 33)',
  'Partner & Aipify Expert Network Engine — official partner tiers, professional portal terminology, certification cross-links, and live engagement summary. See PARTNER_TERMINOLOGY_UPDATE.md.',
  'authenticated', 98
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'partner-expert-network-engine-blueprint' and tenant_id is null
);
