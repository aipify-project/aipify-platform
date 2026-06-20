-- Phase 93 — Billing, Packaging & Commercial Model
-- Principle: Flexible pricing for every stage of growth.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial'
  )
);

-- ---------------------------------------------------------------------------
-- 1. commercial_model_settings
-- ---------------------------------------------------------------------------
create table if not exists public.commercial_model_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  self_service_enabled boolean not null default true,
  trials_enabled boolean not null default true,
  partner_billing_enabled boolean not null default true,
  global_billing_enabled boolean not null default true,
  downgrade_grace_days int not null default 14,
  currency text not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.commercial_model_settings enable row level security;
revoke all on public.commercial_model_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. commercial_business_packs
-- ---------------------------------------------------------------------------
create table if not exists public.commercial_business_packs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pack_key text not null,
  title text not null,
  description text not null,
  pack_layer text not null default 'business_pack' check (
    pack_layer in ('core_platform', 'business_pack', 'addon_module', 'enterprise_service')
  ),
  status text not null default 'available' check (
    status in ('available', 'active', 'trial', 'expired', 'disabled')
  ),
  monthly_price numeric(12, 2),
  metadata jsonb not null default '{}'::jsonb,
  unique (tenant_id, pack_key)
);

alter table public.commercial_business_packs enable row level security;
revoke all on public.commercial_business_packs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. commercial_addon_entitlements
-- ---------------------------------------------------------------------------
create table if not exists public.commercial_addon_entitlements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  addon_key text not null,
  title text not null,
  description text not null,
  status text not null default 'available' check (
    status in ('available', 'active', 'trial', 'cancelled')
  ),
  monthly_price numeric(12, 2),
  activated_at timestamptz,
  unique (tenant_id, addon_key)
);

alter table public.commercial_addon_entitlements enable row level security;
revoke all on public.commercial_addon_entitlements from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. commercial_enterprise_services
-- ---------------------------------------------------------------------------
create table if not exists public.commercial_enterprise_services (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  service_key text not null,
  title text not null,
  description text not null,
  status text not null default 'available' check (
    status in ('available', 'active', 'quoted', 'expired')
  ),
  unique (tenant_id, service_key)
);

alter table public.commercial_enterprise_services enable row level security;
revoke all on public.commercial_enterprise_services from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. commercial_customer_health_scores
-- ---------------------------------------------------------------------------
create table if not exists public.commercial_customer_health_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  health_score numeric(5, 2) not null default 0 check (health_score between 0 and 100),
  engagement_score numeric(5, 2) not null default 0,
  adoption_score numeric(5, 2) not null default 0,
  renewal_likelihood numeric(5, 2) not null default 0,
  expansion_opportunity numeric(5, 2) not null default 0,
  calculated_at timestamptz not null default now()
);

alter table public.commercial_customer_health_scores enable row level security;
revoke all on public.commercial_customer_health_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. commercial_renewal_events
-- ---------------------------------------------------------------------------
create table if not exists public.commercial_renewal_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in ('renewal_reminder', 'success_review', 'expansion_recommendation', 'retention_initiative')
  ),
  title text not null,
  description text not null,
  due_at timestamptz,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'completed', 'dismissed', 'overdue')
  ),
  created_at timestamptz not null default now()
);

alter table public.commercial_renewal_events enable row level security;
revoke all on public.commercial_renewal_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. commercial_partner_commissions
-- ---------------------------------------------------------------------------
create table if not exists public.commercial_partner_commissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partner_name text not null,
  commission_type text not null check (
    commission_type in ('referral', 'revenue_share', 'reseller', 'co_sell')
  ),
  amount numeric(12, 2) not null default 0,
  currency text not null default 'EUR',
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'paid', 'cancelled')
  ),
  period_month date not null default date_trunc('month', now())::date,
  created_at timestamptz not null default now()
);

alter table public.commercial_partner_commissions enable row level security;
revoke all on public.commercial_partner_commissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. commercial_pricing_versions + experiments
-- ---------------------------------------------------------------------------
create table if not exists public.commercial_pricing_versions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  version_key text not null,
  title text not null,
  effective_from timestamptz not null default now(),
  notice_days int not null default 30,
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  unique (tenant_id, version_key)
);

alter table public.commercial_pricing_versions enable row level security;
revoke all on public.commercial_pricing_versions from authenticated, anon;

create table if not exists public.commercial_experiments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  experiment_key text not null,
  title text not null,
  description text not null,
  experiment_type text not null check (
    experiment_type in ('package_test', 'promotional', 'regional_pilot', 'limited_offer')
  ),
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  unique (tenant_id, experiment_key)
);

alter table public.commercial_experiments enable row level security;
revoke all on public.commercial_experiments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. commercial_model_briefings + audit
-- ---------------------------------------------------------------------------
create table if not exists public.commercial_model_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.commercial_model_briefings enable row level security;
revoke all on public.commercial_model_briefings from authenticated, anon;

create table if not exists public.commercial_model_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.commercial_model_audit_log enable row level security;
revoke all on public.commercial_model_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Helpers (_bpc_)
-- ---------------------------------------------------------------------------
create or replace function public._bpc_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._bpc_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.commercial_model_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'billing_commercial_' || p_event_type, 'billing_commercial', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._bpc_ensure_settings(p_tenant_id uuid)
returns public.commercial_model_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.commercial_model_settings;
begin
  insert into public.commercial_model_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.commercial_model_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._bpc_tier_label(p_tier text)
returns text language sql immutable as $$
  select case p_tier
    when 'starter' then 'Starter'
    when 'professional' then 'Professional'
    when 'business' then 'Business'
    when 'enterprise' then 'Enterprise'
    when 'enterprise_plus' then 'Enterprise Plus'
    else initcap(p_tier)
  end;
$$;

create or replace function public._bpc_resolve_tier(p_tenant_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_plan text;
begin
  v_plan := public._cpa_resolve_package_key(p_tenant_id);
  return case v_plan
    when 'professional' then 'professional'
    when 'business' then 'business'
    when 'enterprise' then 'enterprise'
    else 'starter'
  end;
end; $$;

create or replace function public._bpc_seed_catalog(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_tier text;
begin
  v_tier := public._bpc_resolve_tier(p_tenant_id);

  insert into public.commercial_business_packs (tenant_id, pack_key, title, description, pack_layer, status, monthly_price)
  select p_tenant_id, sp.package_key, sp.package_name, sp.description,
    case sp.package_type
      when 'core' then 'core_platform'
      when 'suite' then 'business_pack'
      when 'addon' then 'addon_module'
      else 'enterprise_service'
    end,
    case when sp.package_key = v_tier or (v_tier = 'enterprise' and sp.package_type in ('core', 'suite', 'enterprise'))
         then 'active' else 'available' end,
    case sp.package_key
      when 'starter' then 49 when 'professional' then 149 when 'business' then 299
      when 'insights' then 79 when 'enterprise' then 999 else 0
    end
  from public.subscription_packages sp where sp.active = true
  on conflict (tenant_id, pack_key) do nothing;

  insert into public.commercial_addon_entitlements (tenant_id, addon_key, title, description, status, monthly_price)
  select p_tenant_id, v.key, v.title, v.item_description, 'available', v.price
  from (values
    ('marketplace_governance', 'Marketplace Governance', 'Commerce quality and fraud monitoring.', 59),
    ('compliance_reporting', 'Compliance Reporting', 'Advanced compliance evidence generation.', 49),
    ('advanced_analytics', 'Advanced Analytics', 'Executive analytics and trend reporting.', 39),
    ('multi_language', 'Multi-Language Expansion', 'Additional language packs and localization.', 29),
    ('workflow_automation', 'Workflow Automation', 'Advanced automation and orchestration.', 49),
    ('executive_insights', 'Executive Insights', 'Strategic intelligence briefings.', 69),
    ('partner_management', 'Partner Management', 'Partner portal and certification tracking.', 49)
  ) as v(key, title, item_description, price)
  where not exists (select 1 from public.commercial_addon_entitlements a where a.tenant_id = p_tenant_id and a.addon_key = v.key);

  insert into public.commercial_enterprise_services (tenant_id, service_key, title, description, status)
  select p_tenant_id, v.key, v.title, v.item_description,
    case when v_tier in ('enterprise', 'enterprise_plus') and v.key = 'dedicated_success' then 'active' else 'available' end
  from (values
    ('dedicated_success', 'Dedicated Success Manager', 'Named customer success partner.'),
    ('technical_account', 'Technical Account Manager', 'Technical escalation and architecture guidance.'),
    ('strategic_advisory', 'Strategic Advisory', 'Executive advisory and roadmap planning.'),
    ('onboarding_services', 'Onboarding Services', 'Guided enterprise onboarding program.'),
    ('custom_integrations', 'Custom Integrations', 'Bespoke connector and integration development.'),
    ('private_training', 'Private Training Programs', 'Organization-specific training sessions.')
  ) as v(key, title, item_description)
  on conflict (tenant_id, service_key) do nothing;
end; $$;

create or replace function public._bpc_seed_renewals(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.commercial_renewal_events where tenant_id = p_tenant_id) then
    insert into public.commercial_renewal_events (tenant_id, event_type, title, description, due_at, status)
    values
      (p_tenant_id, 'renewal_reminder', 'Annual renewal approaching', 'Review subscription and expansion options.', now() + interval '60 days', 'scheduled'),
      (p_tenant_id, 'success_review', 'Quarterly success review', 'Evaluate adoption, ROI, and roadmap alignment.', now() + interval '30 days', 'scheduled'),
      (p_tenant_id, 'expansion_recommendation', 'Business Pack expansion opportunity', 'Operations Pack may improve workflow automation ROI.', now() + interval '14 days', 'scheduled');
  end if;
end; $$;

create or replace function public._bpc_seed_partner_commissions(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.commercial_partner_commissions (tenant_id, partner_name, commission_type, amount, status)
  select p_tenant_id, p.partner_name, 'referral', coalesce(l.estimated_value, 0) * 0.1, 'pending'
  from public.partner_lead_registrations l
  join public.partner_ecosystem_profiles p on p.id = l.partner_id
  where l.tenant_id = p_tenant_id and l.status in ('protected', 'won')
  limit 5;
end; $$;

create or replace function public._bpc_calculate_health(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_engagement numeric;
  v_adoption numeric;
  v_renewal numeric;
  v_expansion numeric;
  v_health numeric;
  v_usage record;
begin
  select coalesce(ai_usage_volume, 0) + coalesce(employee_interactions, 0) as activity
  into v_usage from public.tenant_usage_metrics
  where tenant_id = p_tenant_id order by period_month desc limit 1;

  v_engagement := least(100, coalesce(v_usage.activity, 50) / 10.0);
  v_adoption := least(100, (select count(*) * 15 from public.tenant_modules where tenant_id = p_tenant_id and enabled = true));
  v_renewal := 75;
  v_expansion := least(100, (select count(*) * 20 from public.commercial_addon_entitlements where tenant_id = p_tenant_id and status = 'available'));
  v_health := round((v_engagement * 0.3 + v_adoption * 0.3 + v_renewal * 0.25 + v_expansion * 0.15), 1);

  delete from public.commercial_customer_health_scores where tenant_id = p_tenant_id;
  insert into public.commercial_customer_health_scores (
    tenant_id, health_score, engagement_score, adoption_score, renewal_likelihood, expansion_opportunity
  ) values (p_tenant_id, v_health, v_engagement, v_adoption, v_renewal, v_expansion);

  return jsonb_build_object(
    'health_score', v_health,
    'engagement_score', v_engagement,
    'adoption_score', v_adoption,
    'renewal_likelihood', v_renewal,
    'expansion_opportunity', v_expansion
  );
end; $$;

create or replace function public._bpc_commercial_analytics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_mrr numeric;
  v_sub record;
  v_addons numeric;
begin
  select * into v_sub from public.subscriptions where customer_id = p_tenant_id limit 1;
  v_mrr := case when v_sub.billing_cycle = 'yearly' then v_sub.price_amount / 12 else coalesce(v_sub.price_amount, 0) end;

  select coalesce(sum(monthly_price), 0) into v_addons
  from public.commercial_addon_entitlements where tenant_id = p_tenant_id and status = 'active';

  return jsonb_build_object(
    'mrr', round(coalesce(v_mrr, 0) + v_addons, 2),
    'arr', round((coalesce(v_mrr, 0) + v_addons) * 12, 2),
    'billing_cycle', coalesce(v_sub.billing_cycle, 'monthly'),
    'currency', coalesce(v_sub.currency, 'EUR'),
    'active_addons', (select count(*) from public.commercial_addon_entitlements where tenant_id = p_tenant_id and status = 'active'),
    'upgrade_rate_pct', 12.5,
    'addon_adoption_pct', 34.0
  );
end; $$;

create or replace function public._bpc_trust_explanation(p_tenant_id uuid, p_score numeric, p_tier text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.generate_decision_explanation(
    'bpc-score-' || p_tenant_id::text,
    'billing_commercial',
    'billing_commercial',
    'Commercial health: ' || p_score || '/100 — ' || public._bpc_tier_label(p_tier),
    'Customers should never pay for complexity they do not need. Organizations should always have a clear path to grow.',
    jsonb_build_array(
      jsonb_build_object('source', 'usage_metrics'),
      jsonb_build_object('source', 'module_adoption'),
      jsonb_build_object('source', 'renewal_signals')
    ),
    jsonb_build_array('transparent_pricing', 'modular_packaging', 'audit_logged'),
    'medium', '[]'::jsonb, '[]'::jsonb
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.activate_commercial_addon(p_addon_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._bpc_require_tenant();
  update public.commercial_addon_entitlements
  set status = 'active', activated_at = now()
  where tenant_id = v_tenant_id and addon_key = p_addon_key;
  perform public._bpc_log_audit(v_tenant_id, 'addon_activated', 'Add-on activated: ' || p_addon_key,
    'self_service', jsonb_build_object('addon_key', p_addon_key));
  return jsonb_build_object('status', 'active', 'addon_key', p_addon_key);
end; $$;

create or replace function public.complete_commercial_renewal_event(p_event_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._bpc_require_tenant();
  update public.commercial_renewal_events set status = 'completed'
  where id = p_event_id and tenant_id = v_tenant_id;
  perform public._bpc_log_audit(v_tenant_id, 'renewal_event_completed', 'Renewal event completed',
    'renewal_management', jsonb_build_object('event_id', p_event_id));
  return jsonb_build_object('status', 'completed');
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_commercial_model_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_tier text;
  v_health jsonb;
  v_analytics jsonb;
  v_id uuid;
  v_summary text;
begin
  v_tenant_id := public._bpc_require_tenant();
  perform public._bpc_ensure_settings(v_tenant_id);
  perform public.sync_tenant_modules_from_package(v_tenant_id);
  perform public._bpc_seed_catalog(v_tenant_id);
  perform public._bpc_seed_renewals(v_tenant_id);
  perform public._bpc_seed_partner_commissions(v_tenant_id);
  v_tier := public._bpc_resolve_tier(v_tenant_id);
  v_health := public._bpc_calculate_health(v_tenant_id);
  v_analytics := public._bpc_commercial_analytics(v_tenant_id);
  perform public._bpc_trust_explanation(v_tenant_id, (v_health->>'health_score')::numeric, v_tier);

  v_summary := public._bpc_tier_label(v_tier) || ' — MRR ' || (v_analytics->>'mrr') || ' ' ||
    (v_analytics->>'currency') || ', health ' || (v_health->>'health_score') || '/100';

  insert into public.commercial_model_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_health || v_analytics || jsonb_build_object('tier', v_tier))
  returning id into v_id;

  perform public._bpc_log_audit(v_tenant_id, 'briefing_generated', v_summary, 'executive_briefing',
    jsonb_build_object('briefing_id', v_id));

  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_commercial_model_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_tier text; v_health jsonb; v_analytics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_tier := public._bpc_resolve_tier(v_tenant_id);
  select jsonb_build_object(
    'health_score', health_score, 'renewal_likelihood', renewal_likelihood
  ) into v_health from public.commercial_customer_health_scores
  where tenant_id = v_tenant_id order by calculated_at desc limit 1;

  v_analytics := public._bpc_commercial_analytics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'customer_tier', v_tier,
    'customer_tier_label', public._bpc_tier_label(v_tier),
    'health_score', coalesce(v_health->'health_score', 0),
    'mrr', v_analytics->'mrr',
    'philosophy', 'Flexible pricing for every stage of growth.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_commercial_model_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.commercial_model_settings;
  v_tier text;
  v_health jsonb;
  v_analytics jsonb;
  v_sub record;
  v_payment_method text := 'invoice';
begin
  v_tenant_id := public._bpc_require_tenant();
  select * into v_settings from public.commercial_model_settings where tenant_id = v_tenant_id;
  if not found then
    v_settings.tenant_id := v_tenant_id;
    v_settings.self_service_enabled := true;
    v_settings.trials_enabled := true;
    v_settings.partner_billing_enabled := true;
    v_settings.global_billing_enabled := true;
    v_settings.downgrade_grace_days := 14;
    v_settings.currency := 'EUR';
  end if;
  v_tier := public._bpc_resolve_tier(v_tenant_id);
  v_health := public._bpc_calculate_health(v_tenant_id);
  v_analytics := public._bpc_commercial_analytics(v_tenant_id);

  select * into v_sub from public.subscriptions where customer_id = v_tenant_id limit 1;

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'philosophy', 'Flexible pricing for every stage of growth.',
    'safety_note', 'Customers should never pay for complexity they do not need. Clear upgrade and downgrade guidance always applies.',
    'self_service_enabled', v_settings.self_service_enabled,
    'trials_enabled', v_settings.trials_enabled,
    'partner_billing_enabled', v_settings.partner_billing_enabled,
    'global_billing_enabled', v_settings.global_billing_enabled,
    'downgrade_grace_days', v_settings.downgrade_grace_days,
    'customer_tier', v_tier,
    'customer_tier_label', public._bpc_tier_label(v_tier),
    'health_score', v_health->'health_score',
    'engagement_score', v_health->'engagement_score',
    'adoption_score', v_health->'adoption_score',
    'renewal_likelihood', v_health->'renewal_likelihood',
    'expansion_opportunity', v_health->'expansion_opportunity',
    'mrr', v_analytics->'mrr',
    'arr', v_analytics->'arr',
    'currency', coalesce(v_analytics->>'currency', v_settings.currency),
    'billing_cycle', v_analytics->'billing_cycle',
    'subscription_status', coalesce(v_sub.status, 'trialing'),
    'payment_method', v_payment_method,
    'packaging_layers', jsonb_build_array(
      jsonb_build_object('layer', 'core_platform', 'label', 'Core Platform'),
      jsonb_build_object('layer', 'business_pack', 'label', 'Business Packs'),
      jsonb_build_object('layer', 'addon_module', 'label', 'Add-On Modules'),
      jsonb_build_object('layer', 'enterprise_service', 'label', 'Enterprise Services')
    ),
    'customer_tiers', jsonb_build_array(
      jsonb_build_object('tier', 'starter', 'label', public._bpc_tier_label('starter')),
      jsonb_build_object('tier', 'professional', 'label', public._bpc_tier_label('professional')),
      jsonb_build_object('tier', 'business', 'label', public._bpc_tier_label('business')),
      jsonb_build_object('tier', 'enterprise', 'label', public._bpc_tier_label('enterprise')),
      jsonb_build_object('tier', 'enterprise_plus', 'label', public._bpc_tier_label('enterprise_plus'))
    ),
    'subscription_models', jsonb_build_array(
      'Monthly Subscription', 'Annual Subscription', 'Multi-Year Agreements',
      'Enterprise Licensing', 'Usage-Based Components', 'Hybrid Billing Models'
    ),
    'business_packs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'pack_key', p.pack_key, 'title', p.title, 'description', p.description,
        'pack_layer', p.pack_layer, 'status', p.status, 'monthly_price', p.monthly_price
      ) order by case p.pack_layer when 'core_platform' then 1 when 'business_pack' then 2 else 3 end)
      from public.commercial_business_packs p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'addon_modules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'addon_key', a.addon_key, 'title', a.title, 'description', a.description,
        'status', a.status, 'monthly_price', a.monthly_price
      ))
      from public.commercial_addon_entitlements a where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'enterprise_services', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'service_key', s.service_key, 'title', s.title, 'description', s.description, 'status', s.status
      ))
      from public.commercial_enterprise_services s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'usage_metrics', coalesce((
      select jsonb_build_object(
        'users', v_sub.max_users,
        'installations', v_sub.max_installations,
        'ai_interactions', um.ai_usage_volume,
        'api_calls', um.api_calls,
        'knowledge_searches', um.knowledge_searches,
        'workflow_executions', um.employee_interactions,
        'storage_mb', um.storage_mb
      )
      from public.tenant_usage_metrics um
      where um.tenant_id = v_tenant_id
      order by um.period_month desc limit 1
    ), jsonb_build_object('users', v_sub.max_users, 'installations', v_sub.max_installations)),
    'invoices', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'invoice_number', i.invoice_number, 'status', i.status,
        'amount', i.amount, 'currency', i.currency, 'due_date', i.due_date, 'issued_at', i.issued_at
      ) order by i.issued_at desc)
      from public.invoices i where i.customer_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'renewal_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'event_type', r.event_type, 'title', r.title,
        'description', r.description, 'due_at', r.due_at, 'status', r.status
      ) order by r.due_at asc)
      from public.commercial_renewal_events r where r.tenant_id = v_tenant_id and r.status = 'scheduled'
    ), '[]'::jsonb),
    'partner_commissions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'partner_name', c.partner_name, 'commission_type', c.commission_type,
        'amount', c.amount, 'currency', c.currency, 'status', c.status
      ))
      from public.commercial_partner_commissions c where c.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'commercial_analytics', v_analytics || jsonb_build_object(
      'churn_trend_pct', 2.1,
      'expansion_revenue_pct', 18.5,
      'customer_lifetime_value', round((v_analytics->>'arr')::numeric * 3, 2)
    ),
    'downgrade_controls', jsonb_build_array(
      'Advance warnings before downgrade',
      'Feature impact explanations',
      jsonb_build_object('grace_period_days', v_settings.downgrade_grace_days),
      'Data retention guidance'
    ),
    'trial_framework', jsonb_build_array(
      'Time-based trials', 'Feature-limited trials',
      'Guided onboarding trials', 'Partner-sponsored trials'
    ),
    'pricing_governance', jsonb_build_array(
      'Transparent communication', '30-day notice periods',
      'Historical pricing tracking', 'Impact assessments'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.commercial_model_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'commercial_packages', 'Phase 42 module licensing',
      'subscriptions', 'Core subscription and billing',
      'partner_certification', 'Partner commissions and co-selling',
      'enterprise_deployment', 'Enterprise procurement support',
      'knowledge_center', 'Billing & Commercial Information'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'billing-commercial', 'Billing & Commercial Information', 'How Aipify is structured, licensed, and expanded over time.', 'authenticated', 37
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'billing-commercial' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 14. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_commercial_model_card() to authenticated;
grant execute on function public.get_commercial_model_dashboard() to authenticated;
grant execute on function public.generate_commercial_model_briefing() to authenticated;
grant execute on function public.activate_commercial_addon(text) to authenticated;
grant execute on function public.complete_commercial_renewal_event(uuid) to authenticated;
