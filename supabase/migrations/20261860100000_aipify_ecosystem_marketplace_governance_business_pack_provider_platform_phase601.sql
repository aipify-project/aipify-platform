-- Phase 601 — Ecosystem, Marketplace Governance & Business Pack Provider Platform
-- Feature owner: PLATFORM ADMIN
-- Route: /platform/ecosystem/*
-- Helpers: _ep601_*

-- ---------------------------------------------------------------------------
-- 1. Provider Registry
-- ---------------------------------------------------------------------------
create table if not exists public.platform_ep601_providers (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null unique,
  provider_name text not null,
  company_name text not null,
  country text not null default 'NO',
  provider_status text not null default 'active' check (
    provider_status in ('active', 'pending', 'suspended', 'archived')
  ),
  verification_level text not null default 'pending' check (
    verification_level in ('pending', 'verified', 'certified', 'enterprise_certified', 'suspended')
  ),
  certification_level text not null default 'none' check (
    certification_level in ('none', 'consultant', 'implementer', 'growth_partner', 'pack_provider', 'enterprise_partner')
  ),
  published_packs integer not null default 0 check (published_packs >= 0),
  total_revenue numeric(14, 2) not null default 0,
  support_rating numeric(4, 2) not null default 0 check (support_rating between 0 and 5),
  pilot_customer text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_ep601_providers enable row level security;
revoke all on public.platform_ep601_providers from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Provider Verification Engine
-- ---------------------------------------------------------------------------
create table if not exists public.platform_ep601_provider_verifications (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null references public.platform_ep601_providers (provider_id) on delete cascade,
  verification_type text not null check (
    verification_type in ('identity', 'company', 'domain', 'bank', 'compliance')
  ),
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'verified', 'certified', 'enterprise_certified', 'suspended', 'failed')
  ),
  reviewer_notes text not null default '',
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider_id, verification_type)
);

alter table public.platform_ep601_provider_verifications enable row level security;
revoke all on public.platform_ep601_provider_verifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Business Pack Publishing
-- ---------------------------------------------------------------------------
create table if not exists public.platform_ep601_pack_publications (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null unique,
  pack_title text not null,
  provider_id text not null references public.platform_ep601_providers (provider_id) on delete cascade,
  publication_status text not null default 'draft' check (
    publication_status in ('draft', 'submitted', 'in_review', 'approved', 'published', 'rejected', 'deprecated')
  ),
  includes_templates boolean not null default true,
  includes_workflows boolean not null default true,
  includes_knowledge boolean not null default true,
  includes_integrations boolean not null default false,
  includes_skills boolean not null default true,
  includes_automations boolean not null default true,
  review_notes text not null default '',
  submitted_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.platform_ep601_pack_publications enable row level security;
revoke all on public.platform_ep601_pack_publications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Marketplace Governance
-- ---------------------------------------------------------------------------
create table if not exists public.platform_ep601_marketplace_governance (
  id uuid primary key default gen_random_uuid(),
  requirement_key text not null unique,
  requirement_title text not null,
  requirement_domain text not null check (
    requirement_domain in ('security', 'compliance', 'quality', 'documentation', 'licensing', 'privacy', 'support')
  ),
  requirement_status text not null default 'required' check (
    requirement_status in ('required', 'recommended', 'waived', 'blocked')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  sort_order int not null default 0
);

alter table public.platform_ep601_marketplace_governance enable row level security;
revoke all on public.platform_ep601_marketplace_governance from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Provider Revenue Engine
-- ---------------------------------------------------------------------------
create table if not exists public.platform_ep601_provider_revenue (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null references public.platform_ep601_providers (provider_id) on delete cascade,
  revenue_type text not null check (
    revenue_type in ('sale', 'subscription', 'renewal', 'refund', 'revenue_share', 'payout', 'marketplace')
  ),
  amount numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  period_label text not null default 'current',
  recorded_at timestamptz not null default now()
);

create index if not exists platform_ep601_provider_revenue_idx
  on public.platform_ep601_provider_revenue (provider_id, revenue_type, period_label);

alter table public.platform_ep601_provider_revenue enable row level security;
revoke all on public.platform_ep601_provider_revenue from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Certification Program
-- ---------------------------------------------------------------------------
create table if not exists public.platform_ep601_certifications (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null references public.platform_ep601_providers (provider_id) on delete cascade,
  certification_type text not null check (
    certification_type in ('consultant', 'implementer', 'growth_partner', 'pack_provider', 'enterprise_partner')
  ),
  certification_status text not null default 'pending' check (
    certification_status in ('pending', 'active', 'expired', 'revoked')
  ),
  issued_at timestamptz,
  expires_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (provider_id, certification_type)
);

alter table public.platform_ep601_certifications enable row level security;
revoke all on public.platform_ep601_certifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Provider Scorecards
-- ---------------------------------------------------------------------------
create table if not exists public.platform_ep601_provider_scorecards (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null unique references public.platform_ep601_providers (provider_id) on delete cascade,
  support_quality_score integer not null default 75 check (support_quality_score between 0 and 100),
  satisfaction_score integer not null default 75 check (satisfaction_score between 0 and 100),
  renewal_rate_pct numeric(5, 2) not null default 0,
  revenue_score integer not null default 75 check (revenue_score between 0 and 100),
  response_time_hours numeric(8, 2) not null default 24,
  compliance_score integer not null default 80 check (compliance_score between 0 and 100),
  score_band text not null default 'trusted' check (
    score_band in ('excellent', 'trusted', 'review_needed', 'provider_risk')
  ),
  updated_at timestamptz not null default now()
);

alter table public.platform_ep601_provider_scorecards enable row level security;
revoke all on public.platform_ep601_provider_scorecards from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Business Pack Licensing
-- ---------------------------------------------------------------------------
create table if not exists public.platform_ep601_pack_licensing (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null references public.platform_ep601_pack_publications (pack_key) on delete cascade,
  license_model text not null check (
    license_model in ('free', 'paid', 'subscription', 'enterprise', 'usage_based')
  ),
  price_amount numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  revenue_share_pct numeric(5, 2) not null default 70,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (pack_key, license_model)
);

alter table public.platform_ep601_pack_licensing enable row level security;
revoke all on public.platform_ep601_pack_licensing from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Provider Support Requirements
-- ---------------------------------------------------------------------------
create table if not exists public.platform_ep601_support_requirements (
  id uuid primary key default gen_random_uuid(),
  requirement_key text not null unique,
  requirement_title text not null,
  minimum_sla_hours numeric(8, 2) not null default 24,
  escalation_required boolean not null default true,
  documentation_required boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_ep601_support_requirements enable row level security;
revoke all on public.platform_ep601_support_requirements from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Revenue Sharing Framework
-- ---------------------------------------------------------------------------
create table if not exists public.platform_ep601_revenue_sharing (
  id uuid primary key default gen_random_uuid(),
  share_key text not null unique,
  share_title text not null,
  platform_share_pct numeric(5, 2) not null default 30,
  provider_share_pct numeric(5, 2) not null default 60,
  partner_share_pct numeric(5, 2) not null default 10,
  referral_commission_pct numeric(5, 2) not null default 5,
  is_active boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_ep601_revenue_sharing enable row level security;
revoke all on public.platform_ep601_revenue_sharing from authenticated, anon;

create table if not exists public.platform_ep601_revenue_sharing_audit (
  id uuid primary key default gen_random_uuid(),
  share_key text,
  event_type text not null check (
    event_type in ('share_updated', 'payout_processed', 'referral_commission', 'revenue_recorded', 'refund_processed')
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_ep601_revenue_sharing_audit_idx
  on public.platform_ep601_revenue_sharing_audit (created_at desc);

alter table public.platform_ep601_revenue_sharing_audit enable row level security;
revoke all on public.platform_ep601_revenue_sharing_audit from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 11. Marketplace Reviews
-- ---------------------------------------------------------------------------
create table if not exists public.platform_ep601_reviews (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null references public.platform_ep601_providers (provider_id) on delete cascade,
  pack_key text references public.platform_ep601_pack_publications (pack_key) on delete set null,
  review_rating integer not null check (review_rating between 1 and 5),
  review_status text not null default 'published' check (
    review_status in ('pending', 'published', 'flagged', 'removed')
  ),
  review_summary text not null default '' check (char_length(review_summary) <= 500),
  pilot_customer text,
  created_at timestamptz not null default now()
);

alter table public.platform_ep601_reviews enable row level security;
revoke all on public.platform_ep601_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 12. Audit logging
-- ---------------------------------------------------------------------------
create table if not exists public.platform_ep601_audit_logs (
  id uuid primary key default gen_random_uuid(),
  provider_id text,
  pack_key text,
  event_type text not null check (
    event_type in (
      'provider_registered', 'provider_verified', 'provider_suspended',
      'pack_submitted', 'pack_approved', 'pack_rejected', 'pack_published',
      'revenue_recorded', 'certification_issued', 'certification_revoked',
      'report_generated', 'governance_updated', 'revenue_share_updated'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_ep601_audit_logs_idx
  on public.platform_ep601_audit_logs (created_at desc);

alter table public.platform_ep601_audit_logs enable row level security;
revoke all on public.platform_ep601_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._ep601_require_platform_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
end; $$;

create or replace function public._ep601_log(
  p_provider_id text,
  p_pack_key text,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_ep601_audit_logs (provider_id, pack_key, event_type, summary, context)
  values (p_provider_id, p_pack_key, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._ep601_seed()
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.platform_ep601_providers limit 1) then return; end if;

  insert into public.platform_ep601_providers (
    provider_id, provider_name, company_name, country, provider_status, verification_level,
    certification_level, published_packs, total_revenue, support_rating, pilot_customer
  ) values
    ('unonight_ops', 'Unonight Operations', 'Unonight AS', 'NO', 'active', 'enterprise_certified',
      'enterprise_partner', 3, 128500.00, 4.8, 'unonight'),
    ('nordic_hosts', 'Nordic Hosts Studio', 'Nordic Hosts AS', 'NO', 'active', 'certified',
      'pack_provider', 2, 45200.00, 4.5, null),
    ('growth_north', 'Growth North Partners', 'Growth North AS', 'NO', 'active', 'verified',
      'growth_partner', 1, 18900.00, 4.2, null),
    ('pending_pack_co', 'Pending Pack Co', 'Pending Pack AS', 'SE', 'pending', 'pending',
      'none', 0, 0, 0, null);

  insert into public.platform_ep601_provider_verifications (provider_id, verification_type, verification_status, reviewer_notes, verified_at)
  select p.provider_id, v.verification_type,
    case
      when p.verification_level = 'enterprise_certified' then 'enterprise_certified'
      when p.verification_level = 'certified' then 'certified'
      when p.verification_level = 'verified' then 'verified'
      else 'pending'
    end,
    'Phase 601 verification scaffold — platform admin review.',
    case when p.verification_level in ('verified', 'certified', 'enterprise_certified') then now() - interval '30 days' else null end
  from public.platform_ep601_providers p
  cross join (values ('identity'), ('company'), ('domain'), ('bank'), ('compliance')) as v(verification_type)
  on conflict (provider_id, verification_type) do nothing;

  insert into public.platform_ep601_pack_publications (
    pack_key, pack_title, provider_id, publication_status, includes_templates, includes_workflows,
    includes_knowledge, includes_integrations, includes_skills, includes_automations, submitted_at, published_at
  ) values
    ('unonight_hospitality', 'Unonight Hospitality Pack', 'unonight_ops', 'published', true, true, true, true, true, true, now() - interval '60 days', now() - interval '45 days'),
    ('nordic_hosts_pack', 'Nordic Hosts Pack', 'nordic_hosts', 'approved', true, true, true, false, true, true, now() - interval '14 days', null),
    ('support_ops_pack', 'Support Operations Pack', 'growth_north', 'in_review', true, true, true, false, true, false, now() - interval '7 days', null),
    ('draft_warehouse', 'Warehouse Draft Pack', 'pending_pack_co', 'draft', true, false, true, false, false, false, null, null);

  insert into public.platform_ep601_marketplace_governance (requirement_key, requirement_title, requirement_domain, requirement_status, summary, sort_order)
  values
    ('gov_security', 'Security review before publication', 'security', 'required', 'Every pack requires security review — no exceptions.', 1),
    ('gov_compliance', 'Compliance attestation', 'compliance', 'required', 'Providers attest to regulatory compliance for target markets.', 2),
    ('gov_quality', 'Quality assurance checklist', 'quality', 'required', 'Functional QA and Companion insight validation.', 3),
    ('gov_docs', 'Documentation completeness', 'documentation', 'required', 'Install, operator, and support documentation required.', 4),
    ('gov_license', 'Licensing transparency', 'licensing', 'required', 'License model and revenue share disclosed before listing.', 5),
    ('gov_privacy', 'Privacy-by-design review', 'privacy', 'required', 'Metadata-only learning — no prohibited data categories.', 6),
    ('gov_support', 'Support SLA commitment', 'support', 'required', 'Provider support SLA and escalation path documented.', 7);

  insert into public.platform_ep601_provider_revenue (provider_id, revenue_type, amount, period_label)
  values
    ('unonight_ops', 'subscription', 24500.00, 'current'),
    ('unonight_ops', 'renewal', 18200.00, 'current'),
    ('unonight_ops', 'marketplace', 8600.00, 'current'),
    ('nordic_hosts', 'sale', 12000.00, 'current'),
    ('nordic_hosts', 'revenue_share', 4200.00, 'current'),
    ('growth_north', 'revenue_share', 1900.00, 'current');

  insert into public.platform_ep601_certifications (provider_id, certification_type, certification_status, issued_at, expires_at, summary)
  values
    ('unonight_ops', 'enterprise_partner', 'active', now() - interval '180 days', now() + interval '545 days', 'Unonight pilot — enterprise partner certification.'),
    ('unonight_ops', 'pack_provider', 'active', now() - interval '120 days', now() + interval '605 days', 'Pack provider for hospitality vertical.'),
    ('nordic_hosts', 'pack_provider', 'active', now() - interval '90 days', now() + interval '635 days', 'Certified pack provider — hosts vertical.'),
    ('growth_north', 'growth_partner', 'active', now() - interval '60 days', now() + interval '665 days', 'Growth partner — referral channel.');

  insert into public.platform_ep601_provider_scorecards (
    provider_id, support_quality_score, satisfaction_score, renewal_rate_pct, revenue_score,
    response_time_hours, compliance_score, score_band
  ) values
    ('unonight_ops', 92, 94, 96.5, 90, 4.5, 95, 'excellent'),
    ('nordic_hosts', 84, 86, 88.0, 78, 8.0, 88, 'trusted'),
    ('growth_north', 76, 80, 82.0, 72, 12.0, 85, 'trusted'),
    ('pending_pack_co', 55, 50, 0, 40, 48.0, 60, 'review_needed');

  insert into public.platform_ep601_pack_licensing (pack_key, license_model, price_amount, revenue_share_pct, summary)
  values
    ('unonight_hospitality', 'enterprise', 0, 70, 'Enterprise licensing for Unonight pilot.'),
    ('unonight_hospitality', 'subscription', 4900, 70, 'Monthly subscription for hospitality operators.'),
    ('nordic_hosts_pack', 'paid', 2900, 65, 'One-time paid pack license.'),
    ('nordic_hosts_pack', 'subscription', 990, 65, 'Monthly subscription tier.'),
    ('support_ops_pack', 'free', 0, 60, 'Free tier with upgrade path.');

  insert into public.platform_ep601_support_requirements (requirement_key, requirement_title, minimum_sla_hours, escalation_required, documentation_required, summary)
  values
    ('support_sla_p1', 'Priority 1 response SLA', 4, true, true, 'Critical incidents — 4 hour first response.'),
    ('support_sla_p2', 'Priority 2 response SLA', 12, true, true, 'Operational issues — 12 hour first response.'),
    ('support_docs', 'Support documentation', 24, false, true, 'Knowledge base and runbooks required.'),
    ('support_escalation', 'Escalation to Aipify', 24, true, true, 'Provider escalation path to platform support.');

  insert into public.platform_ep601_revenue_sharing (share_key, share_title, platform_share_pct, provider_share_pct, partner_share_pct, referral_commission_pct, summary)
  values
    ('standard_marketplace', 'Standard Marketplace Share', 30, 60, 10, 5, 'Default marketplace revenue split.'),
    ('enterprise_partner', 'Enterprise Partner Share', 20, 70, 10, 8, 'Enterprise partner enhanced provider share.'),
    ('growth_referral', 'Growth Partner Referral', 25, 55, 20, 10, 'Referral-heavy growth partner program.');

  insert into public.platform_ep601_reviews (provider_id, pack_key, review_rating, review_status, review_summary, pilot_customer)
  values
    ('unonight_ops', 'unonight_hospitality', 5, 'published', 'Unonight pilot — hospitality pack accelerated guest operations.', 'unonight'),
    ('nordic_hosts', 'nordic_hosts_pack', 4, 'published', 'Strong hosts workflows — documentation could be expanded.', null),
    ('growth_north', null, 4, 'published', 'Reliable growth partner onboarding and support.', null);

  insert into public.platform_ep601_revenue_sharing_audit (share_key, event_type, summary)
  values
    ('standard_marketplace', 'share_updated', 'Phase 601 — standard marketplace share framework seeded.'),
    ('unonight_ops', 'revenue_recorded', 'Unonight pilot marketplace revenue recorded — metadata only.');

  perform public._ep601_log('unonight_ops', 'unonight_hospitality', 'provider_registered', 'Unonight Operations registered as enterprise pack provider.');
  perform public._ep601_log('unonight_ops', 'unonight_hospitality', 'provider_verified', 'Enterprise certification verification complete.');
  perform public._ep601_log('unonight_ops', 'unonight_hospitality', 'pack_submitted', 'Unonight Hospitality Pack submitted for review.');
  perform public._ep601_log('unonight_ops', 'unonight_hospitality', 'pack_approved', 'Pack approved — governance requirements met.');
  perform public._ep601_log('unonight_ops', 'unonight_hospitality', 'pack_published', 'Pack published to marketplace — Unonight pilot visibility.');
  perform public._ep601_log('unonight_ops', null, 'certification_issued', 'Enterprise partner certification issued.');
  perform public._ep601_log(null, null, 'report_generated', 'Ecosystem center baseline report generated — Phase 601.');
end; $$;

select public._ep601_seed();

-- ---------------------------------------------------------------------------
-- Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_ecosystem_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_total_providers integer;
  v_verified_providers integer;
  v_published_packs integer;
  v_marketplace_revenue numeric;
  v_avg_rating numeric;
  v_excellent_providers integer;
  v_risk_providers integer;
begin
  perform public._ep601_require_platform_admin();
  perform public._ep601_seed();

  select count(*), count(*) filter (where verification_level in ('verified', 'certified', 'enterprise_certified'))
  into v_total_providers, v_verified_providers
  from public.platform_ep601_providers
  where provider_status <> 'archived';

  select count(*) into v_published_packs
  from public.platform_ep601_pack_publications where publication_status = 'published';

  select coalesce(sum(amount), 0) into v_marketplace_revenue
  from public.platform_ep601_provider_revenue
  where revenue_type in ('marketplace', 'sale', 'subscription', 'renewal');

  select coalesce(avg(support_rating), 0) into v_avg_rating from public.platform_ep601_providers where support_rating > 0;

  select count(*) filter (where score_band = 'excellent'), count(*) filter (where score_band = 'provider_risk')
  into v_excellent_providers, v_risk_providers
  from public.platform_ep601_provider_scorecards;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'One Aipify ecosystem — providers extend ABOS through certified Business Packs; governance, transparency, and human accountability remain unchanged.',
      'privacy_note', 'Platform-wide aggregates only — provider operational data stays with providers and customers.',
      'executive_dashboard', jsonb_build_object(
        'total_providers', v_total_providers,
        'verified_providers', v_verified_providers,
        'published_packs', v_published_packs,
        'marketplace_revenue', v_marketplace_revenue,
        'average_support_rating', round(v_avg_rating, 2),
        'excellent_providers', v_excellent_providers,
        'providers_at_risk', v_risk_providers,
        'pending_reviews', (select count(*) from public.platform_ep601_pack_publications where publication_status in ('submitted', 'in_review')),
        'active_certifications', (select count(*) from public.platform_ep601_certifications where certification_status = 'active')
      ),
      'stats', jsonb_build_object(
        'providers', v_total_providers,
        'packs_in_review', (select count(*) from public.platform_ep601_pack_publications where publication_status in ('submitted', 'in_review', 'approved')),
        'governance_requirements', (select count(*) from public.platform_ep601_marketplace_governance where requirement_status = 'required'),
        'marketplace_reviews', (select count(*) from public.platform_ep601_reviews where review_status = 'published'),
        'revenue_records', (select count(*) from public.platform_ep601_provider_revenue),
        'certifications', (select count(*) from public.platform_ep601_certifications where certification_status = 'active')
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(rec order by rec->>'score_band')
        from (
          select jsonb_build_object(
            'key', s.provider_id,
            'score_band', s.score_band,
            'observation', format('Provider %s — score band %s.', p.provider_name, s.score_band),
            'recommendation', case s.score_band
              when 'provider_risk' then 'Schedule governance review and support remediation.'
              when 'review_needed' then 'Review verification and publication pipeline.'
              else 'Monitor scorecard and renewal metrics.'
            end,
            'href', '/platform/ecosystem/providers'
          ) as rec
          from public.platform_ep601_provider_scorecards s
          join public.platform_ep601_providers p on p.provider_id = s.provider_id
          limit 4
        ) sub
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Aipify governs the marketplace — providers publish; platform certifies; customers decide.',
    'privacy_note', 'Ecosystem intelligence uses approved metadata — never customer PII or operational records.',
    'executive_dashboard', jsonb_build_object(
      'total_providers', v_total_providers,
      'verified_providers', v_verified_providers,
      'published_packs', v_published_packs,
      'marketplace_revenue', v_marketplace_revenue,
      'average_support_rating', round(v_avg_rating, 2),
      'excellent_providers', v_excellent_providers,
      'providers_at_risk', v_risk_providers,
      'pending_reviews', (select count(*) from public.platform_ep601_pack_publications where publication_status in ('submitted', 'in_review')),
      'active_certifications', (select count(*) from public.platform_ep601_certifications where certification_status = 'active')
    ),
    'stats', jsonb_build_object(
      'providers', v_total_providers,
      'published_packs', v_published_packs,
      'pending_publications', (select count(*) from public.platform_ep601_pack_publications where publication_status in ('submitted', 'in_review')),
      'governance_rules', (select count(*) from public.platform_ep601_marketplace_governance),
      'reviews', (select count(*) from public.platform_ep601_reviews where review_status = 'published'),
      'revenue_events', (select count(*) from public.platform_ep601_provider_revenue),
      'certifications', (select count(*) from public.platform_ep601_certifications where certification_status = 'active')
    ),
    'providers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'provider_id', p.provider_id, 'provider_name', p.provider_name, 'company_name', p.company_name,
        'country', p.country, 'provider_status', p.provider_status, 'verification_level', p.verification_level,
        'certification_level', p.certification_level, 'published_packs', p.published_packs,
        'total_revenue', p.total_revenue, 'support_rating', p.support_rating, 'pilot_customer', p.pilot_customer
      ) order by p.total_revenue desc)
      from public.platform_ep601_providers p where p.provider_status <> 'archived'
    ), '[]'::jsonb),
    'verifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'provider_id', v.provider_id, 'verification_type', v.verification_type,
        'verification_status', v.verification_status, 'reviewer_notes', v.reviewer_notes
      ) order by v.provider_id, v.verification_type)
      from public.platform_ep601_provider_verifications v
    ), '[]'::jsonb),
    'pack_publications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', pp.pack_key, 'pack_title', pp.pack_title, 'provider_id', pp.provider_id,
        'publication_status', pp.publication_status, 'includes_templates', pp.includes_templates,
        'includes_workflows', pp.includes_workflows, 'includes_knowledge', pp.includes_knowledge,
        'includes_integrations', pp.includes_integrations, 'includes_skills', pp.includes_skills,
        'includes_automations', pp.includes_automations, 'review_notes', pp.review_notes
      ) order by pp.publication_status, pp.pack_title)
      from public.platform_ep601_pack_publications pp
    ), '[]'::jsonb),
    'pack_licensing', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', l.pack_key, 'license_model', l.license_model, 'price_amount', l.price_amount,
        'currency', l.currency, 'revenue_share_pct', l.revenue_share_pct, 'summary', l.summary
      ) order by l.pack_key, l.license_model)
      from public.platform_ep601_pack_licensing l
    ), '[]'::jsonb),
    'certifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'provider_id', c.provider_id, 'certification_type', c.certification_type,
        'certification_status', c.certification_status, 'issued_at', c.issued_at,
        'expires_at', c.expires_at, 'summary', c.summary
      ) order by c.certification_type)
      from public.platform_ep601_certifications c
    ), '[]'::jsonb),
    'marketplace_governance', coalesce((
      select jsonb_agg(jsonb_build_object(
        'requirement_key', g.requirement_key, 'requirement_title', g.requirement_title,
        'requirement_domain', g.requirement_domain, 'requirement_status', g.requirement_status,
        'summary', g.summary
      ) order by g.sort_order)
      from public.platform_ep601_marketplace_governance g
    ), '[]'::jsonb),
    'reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'provider_id', r.provider_id, 'pack_key', r.pack_key, 'review_rating', r.review_rating,
        'review_status', r.review_status, 'review_summary', r.review_summary,
        'pilot_customer', r.pilot_customer, 'created_at', r.created_at
      ) order by r.created_at desc)
      from public.platform_ep601_reviews r
    ), '[]'::jsonb),
    'provider_revenue', coalesce((
      select jsonb_agg(jsonb_build_object(
        'provider_id', rv.provider_id, 'revenue_type', rv.revenue_type, 'amount', rv.amount,
        'currency', rv.currency, 'period_label', rv.period_label
      ) order by rv.amount desc)
      from public.platform_ep601_provider_revenue rv
    ), '[]'::jsonb),
    'revenue_sharing', coalesce((
      select jsonb_agg(jsonb_build_object(
        'share_key', s.share_key, 'share_title', s.share_title,
        'platform_share_pct', s.platform_share_pct, 'provider_share_pct', s.provider_share_pct,
        'partner_share_pct', s.partner_share_pct, 'referral_commission_pct', s.referral_commission_pct,
        'summary', s.summary
      ) order by s.share_key)
      from public.platform_ep601_revenue_sharing s where s.is_active
    ), '[]'::jsonb),
    'scorecards', coalesce((
      select jsonb_agg(jsonb_build_object(
        'provider_id', sc.provider_id, 'support_quality_score', sc.support_quality_score,
        'satisfaction_score', sc.satisfaction_score, 'renewal_rate_pct', sc.renewal_rate_pct,
        'revenue_score', sc.revenue_score, 'response_time_hours', sc.response_time_hours,
        'compliance_score', sc.compliance_score, 'score_band', sc.score_band
      ) order by sc.score_band)
      from public.platform_ep601_provider_scorecards sc
    ), '[]'::jsonb),
    'support_requirements', coalesce((
      select jsonb_agg(jsonb_build_object(
        'requirement_key', sr.requirement_key, 'requirement_title', sr.requirement_title,
        'minimum_sla_hours', sr.minimum_sla_hours, 'escalation_required', sr.escalation_required,
        'documentation_required', sr.documentation_required, 'summary', sr.summary
      ) order by sr.requirement_key)
      from public.platform_ep601_support_requirements sr
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'provider_health', 'Which providers need governance review?',
      'publication_pipeline', 'Which packs are pending publication?',
      'revenue_share', 'How is marketplace revenue distributed?',
      'certification_status', 'Which certifications are expiring soon?'
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_type', a.event_type, 'provider_id', a.provider_id, 'pack_key', a.pack_key,
        'summary', a.summary, 'created_at', a.created_at
      ) order by a.created_at desc)
      from (select * from public.platform_ep601_audit_logs order by created_at desc limit 25) a
    ), '[]'::jsonb),
    'rows', coalesce((
      select jsonb_agg(row_data) from (
        select jsonb_build_object(
          'title', p.provider_name,
          'status', p.verification_level,
          'customer_name', p.company_name
        ) as row_data
        from public.platform_ep601_providers p
        where v_section = 'providers' and p.provider_status <> 'archived'
        union all
        select jsonb_build_object(
          'title', pp.pack_title,
          'status', pp.publication_status,
          'customer_name', pp.provider_id
        )
        from public.platform_ep601_pack_publications pp
        where v_section = 'businessPacks'
        union all
        select jsonb_build_object(
          'title', g.requirement_title,
          'status', g.requirement_status,
          'customer_name', g.requirement_domain
        )
        from public.platform_ep601_marketplace_governance g
        where v_section in ('marketplace', 'governance')
        union all
        select jsonb_build_object(
          'title', coalesce(r.pack_key, r.provider_id),
          'status', r.review_status,
          'customer_name', r.review_rating::text
        )
        from public.platform_ep601_reviews r
        where v_section = 'reviews'
        union all
        select jsonb_build_object(
          'title', rv.revenue_type,
          'status', rv.period_label,
          'customer_name', rv.provider_id
        )
        from public.platform_ep601_provider_revenue rv
        where v_section = 'revenue'
        union all
        select jsonb_build_object(
          'title', c.certification_type,
          'status', c.certification_status,
          'customer_name', c.provider_id
        )
        from public.platform_ep601_certifications c
        where v_section = 'certifications'
      ) sub
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.get_aipify_companion_marketplace_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_exec jsonb;
  v_stats jsonb;
begin
  perform public._ep601_require_platform_admin();
  v_center := public.get_platform_ecosystem_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_exec := v_center->'executive_dashboard';
  v_stats := v_center->'stats';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Marketplace Ecosystem Briefing',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'providers',
        'observation', format('%s verified provider(s) of %s total.', v_exec->>'verified_providers', v_exec->>'total_providers'),
        'recommendation', 'Review provider scorecards and verification status.',
        'href', '/platform/ecosystem/providers'
      ),
      jsonb_build_object(
        'key', 'publications',
        'observation', format('%s pack(s) published; %s pending review.', v_exec->>'published_packs', v_exec->>'pending_reviews'),
        'recommendation', 'Open Business Packs to review publication pipeline.',
        'href', '/platform/ecosystem/business-packs'
      ),
      jsonb_build_object(
        'key', 'governance',
        'observation', format('%s required governance rule(s) active.', v_stats->>'governance_requirements'),
        'recommendation', 'Validate marketplace governance before new listings.',
        'href', '/platform/ecosystem/governance'
      ),
      jsonb_build_object(
        'key', 'revenue',
        'observation', format('Marketplace revenue NOK %s — average support rating %s.', v_exec->>'marketplace_revenue', v_exec->>'average_support_rating'),
        'recommendation', 'Review revenue sharing and provider payouts.',
        'href', '/platform/ecosystem/revenue'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_platform_ecosystem_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._ep601_require_platform_admin();
  return public.get_platform_ecosystem_center('overview');
end;
$$;

grant execute on function public.get_platform_ecosystem_center(text) to authenticated;
grant execute on function public.get_aipify_companion_marketplace_advisor_bundle() to authenticated;
grant execute on function public.get_platform_ecosystem_center_mobile_summary() to authenticated;
