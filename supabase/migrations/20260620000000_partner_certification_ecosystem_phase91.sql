-- Phase 91 — Partner & Certification Ecosystem
-- Principle: Enable others to succeed with Aipify.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification'
  )
);

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
-- 14. Helpers (_pce_)
-- ---------------------------------------------------------------------------
create or replace function public._pce_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._pce_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._pce_log_audit(
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

create or replace function public._pce_ensure_settings(p_tenant_id uuid)
returns public.partner_ecosystem_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.partner_ecosystem_settings;
begin
  insert into public.partner_ecosystem_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.partner_ecosystem_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._pce_tier_label(p_tier text)
returns text language sql immutable as $$
  select case p_tier
    when 'registered' then 'Registered Partner'
    when 'certified' then 'Certified Partner'
    when 'advanced' then 'Advanced Partner'
    when 'premier' then 'Premier Partner'
    when 'strategic' then 'Strategic Partner'
    else initcap(replace(p_tier, '_', ' '))
  end;
$$;

create or replace function public._pce_seed_tracks(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.partner_certification_tracks (tenant_id, track_key, title, description, certification_area, requirements)
  select p_tenant_id, v.key, v.title, v.item_description, v.area, v.reqs
  from (values
    ('foundations', 'Aipify Foundations', 'Core platform knowledge and implementation fundamentals.',
      'aipify_foundations', '["Course completion","Knowledge examination"]'::jsonb),
    ('support_ai', 'Support AI Specialist', 'Deploy and optimize Aipify Support AI.',
      'support_ai_specialist', '["Course completion","Practical assessment","Scenario simulation"]'::jsonb),
    ('governance', 'Governance Specialist', 'Marketplace governance and quality standards.',
      'governance_specialist', '["Course completion","Case study evaluation"]'::jsonb),
    ('enterprise', 'Enterprise Deployment Specialist', 'Enterprise deployment and security.',
      'enterprise_deployment', '["Course completion","Practical assessment","Case study"]'::jsonb),
    ('commerce', 'Commerce Specialist', 'Commerce integrations and marketplace operations.',
      'commerce_specialist', '["Course completion","Scenario simulation"]'::jsonb),
    ('integration', 'Integration Specialist', 'API integrations and connector development.',
      'integration_specialist', '["Practical assessment","Case study evaluation"]'::jsonb),
    ('strategic_intel', 'Strategic Intelligence Specialist', 'Strategic intelligence and advisory.',
      'strategic_intelligence', '["Course completion","Knowledge examination","Case study"]'::jsonb)
  ) as v(key, title, item_description, area, reqs)
  where not exists (
    select 1 from public.partner_certification_tracks t where t.tenant_id = p_tenant_id and t.track_key = v.key
  );
end; $$;

create or replace function public._pce_seed_resources(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.partner_ecosystem_resources (tenant_id, resource_key, title, description, resource_type)
  select p_tenant_id, v.key, v.title, v.item_description, v.type
  from (values
    ('impl_guide', 'Implementation Guide', 'Step-by-step Aipify deployment guide.', 'guide'),
    ('best_practices', 'Best Practices', 'Proven patterns for customer success.', 'best_practice'),
    ('sales_kit', 'Sales Enablement Kit', 'Pitch decks and ROI calculators.', 'sales_enablement'),
    ('tech_docs', 'Technical Documentation', 'API reference and integration guides.', 'technical_doc'),
    ('training_videos', 'Training Videos', 'On-demand certification training.', 'training_video'),
    ('case_studies', 'Case Studies', 'Customer success stories.', 'case_study'),
    ('gov_templates', 'Governance Templates', 'Quality and governance policy templates.', 'template')
  ) as v(key, title, item_description, type)
  where not exists (
    select 1 from public.partner_ecosystem_resources r where r.tenant_id = p_tenant_id and r.resource_key = v.key
  );
end; $$;

create or replace function public._pce_seed_partners(p_tenant_id uuid)
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
    case when er.strategic_importance in ('high', 'critical') then 'certified' else 'registered' end,
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
  select p_tenant_id, 'Aipify Implementation Services', 'implementation', 'premier', 'active', 'Global',
    array['Enterprise', 'Commerce'], array['English', 'Danish'],
    array['Installation', 'Configuration', 'Onboarding'],
    'Premier implementation partner for enterprise Aipify deployments.'
  where not exists (
    select 1 from public.partner_ecosystem_profiles p
    where p.tenant_id = p_tenant_id and p.partner_name = 'Aipify Implementation Services'
  );
end; $$;

create or replace function public._pce_seed_certifications(p_tenant_id uuid)
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
        when 'strategic' then 100
        when 'premier' then 85
        when 'advanced' then 70
        when 'certified' then 55
        else 25
      end;
      if v_track.track_key not in ('foundations', 'support_ai') and v_partner.partner_tier in ('registered') then
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

create or replace function public._pce_seed_leads(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.partner_lead_registrations (
    tenant_id, partner_id, opportunity_name, company_name, country, estimated_value, status, protection_expires_at
  )
  select p_tenant_id, p.id, 'Enterprise rollout — ' || p.partner_name,
    'Prospect Co.', coalesce(p.country, 'Global'), 50000 + random() * 150000,
    'protected', now() + interval '90 days'
  from public.partner_ecosystem_profiles p
  where p.tenant_id = p_tenant_id and p.partner_tier in ('certified', 'advanced', 'premier', 'strategic')
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

create or replace function public._pce_seed_compliance(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.partner_compliance_records (tenant_id, partner_id, compliance_type, status, accepted_at, expires_at)
  select p_tenant_id, p.id, c.type,
    case when p.partner_tier in ('certified', 'advanced', 'premier', 'strategic') then 'accepted' else 'pending' end,
    case when p.partner_tier in ('certified', 'advanced', 'premier', 'strategic') then now() - interval '60 days' else null end,
    case when p.partner_tier in ('certified', 'advanced', 'premier', 'strategic') then now() + interval '12 months' else null end
  from public.partner_ecosystem_profiles p
  cross join (values
    ('code_of_conduct'), ('data_protection'), ('ethical_ai'), ('brand_usage'), ('confidentiality')
  ) as c(type)
  where p.tenant_id = p_tenant_id and p.status = 'active'
  on conflict (partner_id, compliance_type) do nothing;
end; $$;

create or replace function public._pce_calculate_scorecards(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_partner record; v_cert numeric; v_overall numeric;
begin
  delete from public.partner_ecosystem_scorecards where tenant_id = p_tenant_id;
  for v_partner in select id from public.partner_ecosystem_profiles where tenant_id = p_tenant_id and status = 'active'
  loop
    select coalesce(avg(cp.progress_pct), 0) into v_cert
    from public.partner_certification_progress cp where cp.partner_id = v_partner.id;
    v_overall := least(100, round(v_cert * 0.5 + 75 * 0.5, 1));
    insert into public.partner_ecosystem_scorecards (
      tenant_id, partner_id, overall_score, certification_completion, customer_feedback_score,
      implementation_success, support_quality, revenue_contribution, ecosystem_participation
    ) values (
      p_tenant_id, v_partner.id, v_overall, v_cert, 75, 80, 78, 65, 70
    );
  end loop;
end; $$;

create or replace function public._pce_ecosystem_health(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_partners int;
  v_certified int;
  v_avg_score numeric;
  v_leads int;
  v_compliance_pct numeric;
begin
  select count(*), count(*) filter (where partner_tier in ('certified', 'advanced', 'premier', 'strategic'))
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

create or replace function public._pce_trust_explanation(p_tenant_id uuid, p_score numeric, p_label text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.generate_decision_explanation(
    'pce-score-' || p_tenant_id::text,
    'partner_certification',
    'partner_certification',
    'Partner ecosystem health: ' || p_score || '/100',
    p_label || '. Aipify supports partner success; high-impact program decisions require human approval.',
    jsonb_build_array(
      jsonb_build_object('source', 'certification_completion'),
      jsonb_build_object('source', 'customer_feedback'),
      jsonb_build_object('source', 'compliance_status')
    ),
    jsonb_build_array('human_oversight_required', 'certification_renewal', 'audit_logged'),
    'medium',
    '[]'::jsonb,
    '[]'::jsonb
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 15. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.register_partner_lead(
  p_opportunity_name text,
  p_company_name text default null,
  p_country text default null,
  p_estimated_value numeric default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid;
begin
  v_tenant_id := public._pce_require_tenant();
  insert into public.partner_lead_registrations (
    tenant_id, opportunity_name, company_name, country, estimated_value, status, protection_expires_at
  ) values (
    v_tenant_id, p_opportunity_name, p_company_name, p_country, p_estimated_value,
    'registered', now() + interval '90 days'
  ) returning id into v_id;
  perform public._pce_log_audit(v_tenant_id, 'lead_registered', 'Partner lead registered: ' || p_opportunity_name,
    'lead_referral', jsonb_build_object('lead_id', v_id));
  return jsonb_build_object('lead_id', v_id, 'status', 'registered');
end; $$;

create or replace function public.verify_partner_credential(p_credential_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_cred record;
begin
  v_tenant_id := public._pce_require_tenant();
  select c.*, p.partner_name, p.partner_tier, t.title as track_title
  into v_cred
  from public.partner_digital_credentials c
  join public.partner_ecosystem_profiles p on p.id = c.partner_id
  left join public.partner_certification_tracks t on t.id = c.track_id
  where c.tenant_id = v_tenant_id and c.credential_code = p_credential_code;

  if v_cred.id is null then
    return jsonb_build_object('valid', false, 'error', 'Credential not found');
  end if;

  return jsonb_build_object(
    'valid', v_cred.status = 'active',
    'credential_code', v_cred.credential_code,
    'title', v_cred.title,
    'partner_name', v_cred.partner_name,
    'partner_tier', v_cred.partner_tier,
    'partner_tier_label', public._pce_tier_label(v_cred.partner_tier),
    'track_title', v_cred.track_title,
    'status', v_cred.status,
    'issued_at', v_cred.issued_at,
    'expires_at', v_cred.expires_at
  );
end; $$;

create or replace function public.accept_partner_compliance(p_partner_id uuid, p_compliance_type text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._pce_require_tenant();
  insert into public.partner_compliance_records (tenant_id, partner_id, compliance_type, status, accepted_at, expires_at)
  values (v_tenant_id, p_partner_id, p_compliance_type, 'accepted', now(), now() + interval '12 months')
  on conflict (partner_id, compliance_type) do update set
    status = 'accepted', accepted_at = now(), expires_at = now() + interval '12 months';
  perform public._pce_log_audit(v_tenant_id, 'compliance_accepted', 'Partner compliance accepted',
    'compliance', jsonb_build_object('partner_id', p_partner_id, 'type', p_compliance_type));
  return jsonb_build_object('status', 'accepted');
end; $$;

-- ---------------------------------------------------------------------------
-- 16. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_partner_ecosystem_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_health jsonb;
  v_id uuid;
  v_summary text;
begin
  v_tenant_id := public._pce_require_tenant();
  perform public._pce_ensure_settings(v_tenant_id);
  perform public._pce_seed_tracks(v_tenant_id);
  perform public._pce_seed_resources(v_tenant_id);
  perform public._pce_seed_partners(v_tenant_id);
  perform public._pce_seed_certifications(v_tenant_id);
  perform public._pce_seed_leads(v_tenant_id);
  perform public._pce_seed_compliance(v_tenant_id);
  perform public._pce_calculate_scorecards(v_tenant_id);
  v_health := public._pce_ecosystem_health(v_tenant_id);
  perform public._pce_trust_explanation(v_tenant_id,
    (v_health->>'ecosystem_score')::numeric, 'Partner Ecosystem Health');

  v_summary := 'Partner Ecosystem Score ' || (v_health->>'ecosystem_score') || '/100 — ' ||
    (v_health->>'certified_partners') || ' certified partners, ' ||
    (v_health->>'open_leads') || ' open leads';

  insert into public.partner_ecosystem_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_health || jsonb_build_object('human_oversight_required', true))
  returning id into v_id;

  perform public._pce_log_audit(v_tenant_id, 'briefing_generated', v_summary, 'executive_briefing',
    jsonb_build_object('briefing_id', v_id));

  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_partner_ecosystem_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_health jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_health := public._pce_ecosystem_health(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'ecosystem_score', v_health->'ecosystem_score',
    'active_partners', v_health->'active_partners',
    'certified_partners', v_health->'certified_partners',
    'open_leads', v_health->'open_leads',
    'philosophy', 'Enable others to succeed with Aipify.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_partner_ecosystem_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.partner_ecosystem_settings;
  v_health jsonb;
begin
  v_tenant_id := public._pce_require_tenant();
  v_settings := public._pce_ensure_settings(v_tenant_id);
  perform public._pce_seed_tracks(v_tenant_id);
  perform public._pce_seed_resources(v_tenant_id);
  perform public._pce_seed_partners(v_tenant_id);
  perform public._pce_seed_certifications(v_tenant_id);
  perform public._pce_seed_leads(v_tenant_id);
  perform public._pce_seed_compliance(v_tenant_id);
  perform public._pce_calculate_scorecards(v_tenant_id);
  v_health := public._pce_ecosystem_health(v_tenant_id);
  perform public._pce_trust_explanation(v_tenant_id,
    (v_health->>'ecosystem_score')::numeric, 'Partner Ecosystem Health');

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'program_enabled', v_settings.program_enabled,
    'lead_referral_enabled', v_settings.lead_referral_enabled,
    'public_directory_enabled', v_settings.public_directory_enabled,
    'philosophy', 'Enable others to succeed with Aipify.',
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
      'Managed Service Providers', 'Reseller Partners'
    ),
    'partner_tiers', jsonb_build_array(
      jsonb_build_object('tier', 'registered', 'label', public._pce_tier_label('registered')),
      jsonb_build_object('tier', 'certified', 'label', public._pce_tier_label('certified')),
      jsonb_build_object('tier', 'advanced', 'label', public._pce_tier_label('advanced')),
      jsonb_build_object('tier', 'premier', 'label', public._pce_tier_label('premier')),
      jsonb_build_object('tier', 'strategic', 'label', public._pce_tier_label('strategic'))
    ),
    'partners', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'partner_name', p.partner_name, 'partner_type', p.partner_type,
        'partner_tier', p.partner_tier, 'partner_tier_label', public._pce_tier_label(p.partner_tier),
        'status', p.status, 'country', p.country, 'industry_expertise', p.industry_expertise,
        'languages', p.languages, 'service_offerings', p.service_offerings, 'description', p.description
      ) order by case p.partner_tier
        when 'strategic' then 1 when 'premier' then 2 when 'advanced' then 3
        when 'certified' then 4 else 5 end)
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
-- 17. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'partner-certification', 'Partner & Certification Program', 'Guides for working with trusted Aipify experts and certification.', 'authenticated', 36
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'partner-certification' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 18. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_partner_ecosystem_card() to authenticated;
grant execute on function public.get_partner_ecosystem_dashboard() to authenticated;
grant execute on function public.generate_partner_ecosystem_briefing() to authenticated;
grant execute on function public.register_partner_lead(text, text, text, numeric) to authenticated;
grant execute on function public.verify_partner_credential(text) to authenticated;
grant execute on function public.accept_partner_compliance(uuid, text) to authenticated;
