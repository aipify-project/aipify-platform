-- Phase 463 — Aipify Renewals, Expansion & Revenue Growth Center (Customer App)
-- Route hub: /app/revenue-growth

create table if not exists public.revenue_growth_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  growth_partner_name text not null default '',
  growth_partner_attributed boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.revenue_growth_dashboard_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'mrr', 'arr', 'renewal_rate', 'expansion_revenue', 'churn_rate', 'nrr', 'clv'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.revenue_growth_renewals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  renewal_key text not null,
  customer_label text not null default '',
  renewal_date_label text not null default '',
  renewal_status text not null default 'upcoming' check (
    renewal_status in ('upcoming', 'in_review', 'renewed', 'at_risk', 'lost')
  ),
  renewal_risk_label text not null default '',
  health_label text not null default '',
  owner_label text not null default '',
  pipeline_stage text not null default '',
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now(),
  unique (organization_id, renewal_key)
);

create table if not exists public.revenue_growth_expansion_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_key text not null,
  title text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  suggestion text not null default '' check (char_length(suggestion) <= 500),
  opportunity_type text not null default 'business_pack' check (
    opportunity_type in (
      'additional_users', 'additional_departments', 'business_pack',
      'integration', 'advanced_feature', 'enterprise'
    )
  ),
  potential_revenue_label text not null default '',
  confidence_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, opportunity_key)
);

create table if not exists public.revenue_growth_subscription (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  item_key text not null check (item_key in (
    'current_plan', 'recommended_plan', 'usage_trends', 'growth_indicators', 'user_limits'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  value_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, item_key)
);

create table if not exists public.revenue_growth_business_pack_expansion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_name text not null,
  pack_status text not null default 'installed' check (
    pack_status in ('installed', 'active', 'underutilized', 'recommended')
  ),
  department_usage_label text not null default '',
  potential_revenue_label text not null default '',
  expected_adoption_label text not null default '',
  confidence_label text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, pack_key)
);

create table if not exists public.revenue_growth_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  forecast_period text not null check (forecast_period in ('30_days', '90_days', '6_months', '12_months')),
  renewals_label text not null default '',
  expansion_revenue_label text not null default '',
  new_revenue_label text not null default '',
  retention_revenue_label text not null default '',
  total_forecast_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, forecast_period)
);

create table if not exists public.revenue_growth_clv (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  clv_key text not null check (clv_key in (
    'historical_revenue', 'recurring_revenue', 'growth_revenue', 'projected_revenue',
    'clv_total', 'retention_risk', 'expansion_potential'
  )),
  title text not null,
  value_label text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, clv_key)
);

create table if not exists public.revenue_growth_partner_view (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  item_key text not null,
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  value_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, item_key)
);

create table if not exists public.revenue_growth_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'mrr', 'arr', 'nrr', 'renewal_health', 'expansion_health', 'growth_forecast'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.revenue_growth_companion_advice (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  advice_key text not null,
  title text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  recommendation text not null default '' check (char_length(recommendation) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, advice_key)
);

create table if not exists public.revenue_growth_retention_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  signal_key text not null,
  title text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  intervention text not null default '' check (char_length(intervention) <= 500),
  signal_type text not null default 'usage_decline' check (
    signal_type in (
      'usage_decline', 'support_friction', 'training_gap',
      'pack_underutilization', 'executive_disengagement'
    )
  ),
  status_key text not null default 'requires_attention',
  updated_at timestamptz not null default now(),
  unique (organization_id, signal_key)
);

create table if not exists public.revenue_growth_playbooks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  playbook_key text not null check (playbook_key in (
    'renewal', 'expansion', 'enterprise_upgrade', 'business_pack_expansion', 'customer_recovery'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  steps_summary text not null default '' check (char_length(steps_summary) <= 500),
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, playbook_key)
);

create table if not exists public.revenue_growth_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_key text not null,
  title text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, recommendation_key)
);

create table if not exists public.revenue_growth_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  item_type text not null,
  item_id uuid,
  action text not null,
  description text not null default '' check (char_length(description) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists revenue_growth_audit_org_idx
  on public.revenue_growth_audit (organization_id, created_at desc);

alter table public.revenue_growth_settings enable row level security;
alter table public.revenue_growth_dashboard_metrics enable row level security;
alter table public.revenue_growth_renewals enable row level security;
alter table public.revenue_growth_expansion_opportunities enable row level security;
alter table public.revenue_growth_subscription enable row level security;
alter table public.revenue_growth_business_pack_expansion enable row level security;
alter table public.revenue_growth_forecasts enable row level security;
alter table public.revenue_growth_clv enable row level security;
alter table public.revenue_growth_partner_view enable row level security;
alter table public.revenue_growth_executive_metrics enable row level security;
alter table public.revenue_growth_companion_advice enable row level security;
alter table public.revenue_growth_retention_signals enable row level security;
alter table public.revenue_growth_playbooks enable row level security;
alter table public.revenue_growth_recommendations enable row level security;
alter table public.revenue_growth_audit enable row level security;

revoke all on public.revenue_growth_settings from authenticated, anon;
revoke all on public.revenue_growth_dashboard_metrics from authenticated, anon;
revoke all on public.revenue_growth_renewals from authenticated, anon;
revoke all on public.revenue_growth_expansion_opportunities from authenticated, anon;
revoke all on public.revenue_growth_subscription from authenticated, anon;
revoke all on public.revenue_growth_business_pack_expansion from authenticated, anon;
revoke all on public.revenue_growth_forecasts from authenticated, anon;
revoke all on public.revenue_growth_clv from authenticated, anon;
revoke all on public.revenue_growth_partner_view from authenticated, anon;
revoke all on public.revenue_growth_executive_metrics from authenticated, anon;
revoke all on public.revenue_growth_companion_advice from authenticated, anon;
revoke all on public.revenue_growth_retention_signals from authenticated, anon;
revoke all on public.revenue_growth_playbooks from authenticated, anon;
revoke all on public.revenue_growth_recommendations from authenticated, anon;
revoke all on public.revenue_growth_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'revenue_growth_center', v.description
from (values
  ('revenue_growth.view', 'View Revenue Growth Center', 'View renewals, expansion, forecasts, and CLV'),
  ('revenue_growth.manage', 'Manage Revenue Growth Center', 'Manage renewal decisions and growth recommendations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'revenue_growth.view'), ('owner', 'revenue_growth.manage'),
  ('administrator', 'revenue_growth.view'), ('administrator', 'revenue_growth.manage'),
  ('manager', 'revenue_growth.view'),
  ('employee', 'revenue_growth.view'),
  ('support_agent', 'revenue_growth.view'),
  ('moderator', 'revenue_growth.view'),
  ('viewer', 'revenue_growth.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._rge463_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  if not public._irp_has_permission('revenue_growth.view', v_org_id) then
    return jsonb_build_object('found', false, 'error', 'Access denied');
  end if;
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_manage', public._irp_has_permission('revenue_growth.manage', v_org_id),
    'can_executive', public._irp_has_permission('revenue_growth.manage', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._rge463_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.revenue_growth_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._rge463_renewal_status(p_status text)
returns text language sql immutable as $$
  select case p_status
    when 'renewed' then 'verified'
    when 'in_review' then 'information'
    when 'at_risk' then 'requires_attention'
    when 'lost' then 'not_allowed'
    else 'waiting'
  end;
$$;

create or replace function public._rge463_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.revenue_growth_settings (organization_id, growth_partner_attributed, growth_partner_name)
  values (p_org_id, false, '') on conflict do nothing;

  if exists (select 1 from public.revenue_growth_dashboard_metrics where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.revenue_growth_dashboard_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'mrr', 'NOK 48,500', '+8% vs last month', 'verified'),
    (p_org_id, 'arr', 'NOK 582,000', 'On track', 'information'),
    (p_org_id, 'renewal_rate', '94%', '+2 pts', 'verified'),
    (p_org_id, 'expansion_revenue', 'NOK 12,400', '+18% QoQ', 'verified'),
    (p_org_id, 'churn_rate', '3.2%', '-0.5 pts', 'information'),
    (p_org_id, 'nrr', '112%', 'Strong expansion', 'verified'),
    (p_org_id, 'clv', 'NOK 186,000', 'Growing', 'information');

  insert into public.revenue_growth_renewals
    (organization_id, renewal_key, customer_label, renewal_date_label, renewal_status, renewal_risk_label, health_label, owner_label, pipeline_stage, status_key)
  values
    (p_org_id, 'renewal_q3', 'Annual subscription', 'Sep 30, 2026', 'upcoming', 'Low', 'Healthy', 'Account Owner', 'Pipeline', 'waiting'),
    (p_org_id, 'renewal_addon', 'Commerce Pack add-on', 'Aug 15, 2026', 'in_review', 'Moderate', 'At risk', 'Success Manager', 'In review', 'information'),
    (p_org_id, 'renewal_enterprise', 'Enterprise upgrade', 'Dec 1, 2026', 'at_risk', 'High', 'Declining usage', 'Executive Sponsor', 'At risk', 'requires_attention');

  insert into public.revenue_growth_expansion_opportunities
    (organization_id, opportunity_key, title, insight, suggestion, opportunity_type, potential_revenue_label, confidence_label, status_key)
  values
    (p_org_id, 'commerce_pack', 'Commerce Operations Pack', 'Customer has adopted Support Pack successfully.', 'Commerce Operations Pack recommended for retail workflows.', 'business_pack', 'NOK 4,200/mo', 'High', 'information'),
    (p_org_id, 'additional_users', 'Additional user seats', 'Operations team growth detected — approaching plan limits.', 'Add 5 user seats to Professional plan.', 'additional_users', 'NOK 1,500/mo', 'Moderate', 'information'),
    (p_org_id, 'enterprise', 'Enterprise upgrade path', 'Multi-department adoption and governance requirements emerging.', 'Schedule Enterprise plan evaluation with owner.', 'enterprise', 'NOK 18,000/yr', 'Moderate', 'information'),
    (p_org_id, 'integration_stripe', 'Stripe integration', 'Payment workflows identified — integration not connected.', 'Connect Stripe for commerce automation.', 'integration', 'NOK 800/mo', 'High', 'information');

  insert into public.revenue_growth_subscription
    (organization_id, item_key, title, summary, value_label, status_key)
  values
    (p_org_id, 'current_plan', 'Current Plan', 'Active subscription tier.', 'Business', 'verified'),
    (p_org_id, 'recommended_plan', 'Recommended Plan', 'Based on usage and adoption signals.', 'Professional → Enterprise', 'information'),
    (p_org_id, 'usage_trends', 'Usage Trends', 'Platform usage over last 90 days.', '+14% active users', 'verified'),
    (p_org_id, 'growth_indicators', 'Growth Indicators', 'Expansion readiness signals.', '3 packs adopted, 2 departments active', 'information'),
    (p_org_id, 'user_limits', 'User Limits', 'Seat utilization against plan cap.', '18 of 20 seats — approaching limit', 'requires_attention');

  insert into public.revenue_growth_business_pack_expansion
    (organization_id, pack_key, pack_name, pack_status, department_usage_label, potential_revenue_label, expected_adoption_label, confidence_label, summary, status_key)
  values
    (p_org_id, 'support', 'Support Pack', 'active', 'Support · Operations', 'NOK 0 (included)', '95%', 'Verified', 'Primary pack — high utilization.', 'verified'),
    (p_org_id, 'commerce', 'Commerce Pack', 'installed', 'Sales · 1 dept', 'NOK 4,200/mo', '68%', 'High', 'Installed — adoption building.', 'information'),
    (p_org_id, 'hosts', 'Aipify Hosts', 'underutilized', 'Hospitality · limited', 'NOK 2,800/mo', '35%', 'Moderate', 'Licensed — underutilized.', 'requires_attention'),
    (p_org_id, 'warehouse', 'Warehouse Pack', 'recommended', 'Not deployed', 'NOK 3,600/mo', '55%', 'Moderate', 'Recommended based on operations profile.', 'information');

  insert into public.revenue_growth_forecasts
    (organization_id, forecast_period, renewals_label, expansion_revenue_label, new_revenue_label, retention_revenue_label, total_forecast_label, status_key)
  values
    (p_org_id, '30_days', 'NOK 12,000', 'NOK 4,200', 'NOK 0', 'NOK 48,500', 'NOK 64,700', 'information'),
    (p_org_id, '90_days', 'NOK 36,000', 'NOK 14,800', 'NOK 2,400', 'NOK 145,500', 'NOK 198,700', 'information'),
    (p_org_id, '6_months', 'NOK 72,000', 'NOK 32,000', 'NOK 8,000', 'NOK 291,000', 'NOK 403,000', 'verified'),
    (p_org_id, '12_months', 'NOK 582,000', 'NOK 68,000', 'NOK 24,000', 'NOK 582,000', 'NOK 674,000', 'verified');

  insert into public.revenue_growth_clv
    (organization_id, clv_key, title, value_label, summary, status_key)
  values
    (p_org_id, 'historical_revenue', 'Historical Revenue', 'NOK 124,000', 'Total revenue since signup.', 'information'),
    (p_org_id, 'recurring_revenue', 'Recurring Revenue', 'NOK 582,000/yr', 'Current annual recurring base.', 'verified'),
    (p_org_id, 'growth_revenue', 'Growth Revenue', 'NOK 48,800', 'Expansion and upsell to date.', 'information'),
    (p_org_id, 'projected_revenue', 'Projected Revenue', 'NOK 674,000', '12-month projection with expansion.', 'information'),
    (p_org_id, 'clv_total', 'Customer Lifetime Value', 'NOK 186,000', 'Blended CLV estimate.', 'verified'),
    (p_org_id, 'retention_risk', 'Retention Risk', 'Moderate', 'One renewal at risk — intervention recommended.', 'requires_attention'),
    (p_org_id, 'expansion_potential', 'Expansion Potential', 'High', 'Commerce and Enterprise paths identified.', 'information');

  insert into public.revenue_growth_partner_view
    (organization_id, item_key, title, summary, value_label, status_key)
  values
    (p_org_id, 'partner_attribution', 'Growth Partner attribution', 'No Growth Partner attributed to this organization.', 'Not attributed', 'waiting');

  insert into public.revenue_growth_executive_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'mrr', 'NOK 48,500', '+8%', 'verified'),
    (p_org_id, 'arr', 'NOK 582,000', 'On track', 'information'),
    (p_org_id, 'nrr', '112%', 'Strong expansion', 'verified'),
    (p_org_id, 'renewal_health', '94%', '1 renewal at risk', 'requires_attention'),
    (p_org_id, 'expansion_health', 'High', '3 opportunities active', 'information'),
    (p_org_id, 'growth_forecast', 'NOK 674K', '12-month projection', 'verified');

  insert into public.revenue_growth_companion_advice
    (organization_id, advice_key, title, insight, recommendation, status_key)
  values
    (p_org_id, 'adoption_surge', 'Customer adoption increasing rapidly', 'Weekly active users up 14% — strong expansion signal.', 'Review Commerce Pack and seat expansion with leadership.', 'information'),
    (p_org_id, 'expansion_detected', 'Expansion opportunity detected', 'Support Pack success suggests Commerce Pack fit.', 'Prepare expansion recommendation — no sales pressure, success-first.', 'information'),
    (p_org_id, 'renewal_risk', 'Renewal risk increasing', 'Enterprise upgrade renewal flagged at risk.', 'Schedule executive review and success plan refresh before renewal date.', 'requires_attention'),
    (p_org_id, 'renewal_strong', 'Strong renewal probability', 'Annual subscription renewal on track — health score healthy.', 'Confirm renewal timeline and document success outcomes.', 'verified');

  insert into public.revenue_growth_retention_signals
    (organization_id, signal_key, title, insight, intervention, signal_type, status_key)
  values
    (p_org_id, 'usage_decline', 'Usage decline in operations', 'Operations module usage down 8% month-over-month.', 'Schedule adoption review and targeted training.', 'usage_decline', 'requires_attention'),
    (p_org_id, 'support_friction', 'Support escalation pattern', 'Two unresolved escalations beyond SLA.', 'Success manager follow-up and support workflow review.', 'support_friction', 'requires_attention'),
    (p_org_id, 'training_gap', 'Admin training incomplete', 'Required modules incomplete for renewal stakeholders.', 'Assign training before renewal review.', 'training_gap', 'information'),
    (p_org_id, 'exec_disengage', 'Executive briefing skipped', 'Owner has not opened executive briefing in 21 days.', 'Recommend executive re-engagement session.', 'executive_disengagement', 'information');

  insert into public.revenue_growth_playbooks
    (organization_id, playbook_key, title, summary, steps_summary, status_key)
  values
    (p_org_id, 'renewal', 'Renewal Playbook', 'Success-first renewal preparation — document value, address risk, confirm timeline.', 'Review health · Success outcomes · Risk mitigation · Owner approval · Renew', 'verified'),
    (p_org_id, 'expansion', 'Expansion Playbook', 'Natural expansion from demonstrated success — never pressure-driven.', 'Adoption proof · Pack fit · Business case · Customer decision · Activate', 'verified'),
    (p_org_id, 'enterprise_upgrade', 'Enterprise Upgrade Playbook', 'Governance and scale requirements trigger Enterprise evaluation.', 'Requirements · Security review · Plan comparison · Executive sign-off', 'information'),
    (p_org_id, 'business_pack_expansion', 'Business Pack Expansion Playbook', 'Recommend packs when operational fit is clear.', 'Usage analysis · Department fit · Pilot · Full rollout', 'information'),
    (p_org_id, 'customer_recovery', 'Customer Recovery Playbook', 'Intervene when retention signals emerge — restore value before churn.', 'Diagnose · Success plan · Training · Executive touch · Monitor', 'verified');

  insert into public.revenue_growth_recommendations
    (organization_id, recommendation_key, title, insight, status_key)
  values
    (p_org_id, 'commerce_expansion', 'Commerce Pack expansion', 'Support Pack success — Commerce Pack is the natural next step.', 'information'),
    (p_org_id, 'seat_expansion', 'User seat expansion', 'Approaching plan limits — add seats before friction.', 'requires_attention'),
    (p_org_id, 'renewal_prep', 'Renewal preparation', 'Q3 renewal upcoming — document success outcomes now.', 'information');

  perform public._rge463_log(
    p_org_id, null, 'revenue_growth_center', null, 'seed',
    'Revenue Growth Center initialized with renewals, expansion, and forecast baseline.'
  );
end; $$;

create or replace function public.get_customer_revenue_growth_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_org public.organizations;
  v_settings public.revenue_growth_settings;
  v_dashboard jsonb := '[]'::jsonb;
  v_renewals jsonb := '[]'::jsonb;
  v_expansion jsonb := '[]'::jsonb;
  v_subscription jsonb := '[]'::jsonb;
  v_packs jsonb := '[]'::jsonb;
  v_forecasts jsonb := '[]'::jsonb;
  v_clv jsonb := '[]'::jsonb;
  v_partner jsonb := '[]'::jsonb;
  v_executive jsonb := '[]'::jsonb;
  v_advice jsonb := '[]'::jsonb;
  v_retention jsonb := '[]'::jsonb;
  v_playbooks jsonb := '[]'::jsonb;
  v_recommendations jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
begin
  v_ctx := public._rge463_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return v_ctx;
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._rge463_seed(v_org_id);

  select * into v_org from public.organizations where id = v_org_id;
  select * into v_settings from public.revenue_growth_settings where organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_value', m.metric_value,
    'trend_label', m.trend_label, 'status_key', m.status_key, 'item_type', 'dashboard_metric'
  ) order by m.metric_key), '[]'::jsonb)
  into v_dashboard from public.revenue_growth_dashboard_metrics m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'renewal_key', r.renewal_key, 'customer_label', r.customer_label,
    'renewal_date_label', r.renewal_date_label, 'renewal_status', r.renewal_status,
    'renewal_risk_label', r.renewal_risk_label, 'health_label', r.health_label,
    'owner_label', r.owner_label, 'pipeline_stage', r.pipeline_stage,
    'status_key', r.status_key, 'item_type', 'renewal'
  ) order by r.renewal_date_label), '[]'::jsonb)
  into v_renewals from public.revenue_growth_renewals r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'opportunity_key', e.opportunity_key, 'title', e.title,
    'insight', e.insight, 'suggestion', e.suggestion, 'opportunity_type', e.opportunity_type,
    'potential_revenue_label', e.potential_revenue_label, 'confidence_label', e.confidence_label,
    'status_key', e.status_key, 'item_type', 'expansion'
  ) order by e.title), '[]'::jsonb)
  into v_expansion from public.revenue_growth_expansion_opportunities e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'item_key', s.item_key, 'title', s.title, 'summary', s.summary,
    'value_label', s.value_label, 'status_key', s.status_key, 'item_type', 'subscription'
  ) order by s.item_key), '[]'::jsonb)
  into v_subscription from public.revenue_growth_subscription s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'pack_key', p.pack_key, 'pack_name', p.pack_name, 'pack_status', p.pack_status,
    'department_usage_label', p.department_usage_label, 'potential_revenue_label', p.potential_revenue_label,
    'expected_adoption_label', p.expected_adoption_label, 'confidence_label', p.confidence_label,
    'summary', p.summary, 'status_key', p.status_key, 'item_type', 'business_pack'
  ) order by p.pack_status, p.pack_name), '[]'::jsonb)
  into v_packs from public.revenue_growth_business_pack_expansion p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'forecast_period', f.forecast_period,
    'renewals_label', f.renewals_label, 'expansion_revenue_label', f.expansion_revenue_label,
    'new_revenue_label', f.new_revenue_label, 'retention_revenue_label', f.retention_revenue_label,
    'total_forecast_label', f.total_forecast_label, 'status_key', f.status_key, 'item_type', 'forecast'
  ) order by f.forecast_period), '[]'::jsonb)
  into v_forecasts from public.revenue_growth_forecasts f where f.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'clv_key', c.clv_key, 'title', c.title, 'value_label', c.value_label,
    'summary', c.summary, 'status_key', c.status_key, 'item_type', 'clv'
  ) order by c.clv_key), '[]'::jsonb)
  into v_clv from public.revenue_growth_clv c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'item_key', p.item_key, 'title', p.title, 'summary', p.summary,
    'value_label', p.value_label, 'status_key', p.status_key, 'item_type', 'partner'
  ) order by p.item_key), '[]'::jsonb)
  into v_partner from public.revenue_growth_partner_view p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'metric_key', e.metric_key, 'metric_value', e.metric_value,
    'trend_label', e.trend_label, 'status_key', e.status_key, 'item_type', 'executive'
  ) order by e.metric_key), '[]'::jsonb)
  into v_executive from public.revenue_growth_executive_metrics e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'advice_key', a.advice_key, 'title', a.title,
    'insight', a.insight, 'recommendation', a.recommendation,
    'status_key', a.status_key, 'item_type', 'companion_advice'
  ) order by a.updated_at desc), '[]'::jsonb)
  into v_advice from public.revenue_growth_companion_advice a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'signal_key', r.signal_key, 'title', r.title,
    'insight', r.insight, 'intervention', r.intervention, 'signal_type', r.signal_type,
    'status_key', r.status_key, 'item_type', 'retention_signal'
  ) order by r.updated_at desc), '[]'::jsonb)
  into v_retention from public.revenue_growth_retention_signals r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'playbook_key', p.playbook_key, 'title', p.title,
    'summary', p.summary, 'steps_summary', p.steps_summary,
    'status_key', p.status_key, 'item_type', 'playbook'
  ) order by p.playbook_key), '[]'::jsonb)
  into v_playbooks from public.revenue_growth_playbooks p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'recommendation_key', r.recommendation_key, 'title', r.title,
    'insight', r.insight, 'status_key', r.status_key, 'item_type', 'recommendation'
  ) order by r.title), '[]'::jsonb)
  into v_recommendations from public.revenue_growth_recommendations r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', audit_row.id, 'item_type', audit_row.item_type, 'action', audit_row.action,
    'description', audit_row.description, 'created_at', audit_row.created_at, 'item_type_label', 'audit'
  )), '[]'::jsonb)
  into v_audit
  from (
    select a.id, a.item_type, a.action, a.description, a.created_at
    from public.revenue_growth_audit a
    where a.organization_id = v_org_id
    order by a.created_at desc
    limit 20
  ) audit_row;

  return jsonb_build_object(
    'found', true,
    'organization_name', v_org.name,
    'plan_label', initcap(replace(v_org.subscription_plan, '_', ' ')),
    'growth_partner_attributed', coalesce(v_settings.growth_partner_attributed, false),
    'growth_partner_name', coalesce(v_settings.growth_partner_name, ''),
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'governance_note', 'Renewal decisions, expansion recommendations, revenue changes, and plan changes are fully audited with approval history.',
    'privacy_note', 'Revenue growth data is tenant-scoped. Growth Partners see only their own portfolio. Platform Admin sees aggregates only.',
    'core_principle', 'Growth should come from customer success — not sales pressure. Customers that achieve results naturally expand.',
    'dashboard_metrics', v_dashboard,
    'renewals', v_renewals,
    'expansion_opportunities', v_expansion,
    'subscription_growth', v_subscription,
    'business_pack_expansion', v_packs,
    'revenue_forecasts', v_forecasts,
    'customer_lifetime_value', v_clv,
    'growth_partner_view', v_partner,
    'executive_overview', v_executive,
    'companion_advice', v_advice,
    'retention_protection', v_retention,
    'revenue_playbooks', v_playbooks,
    'growth_recommendations', v_recommendations,
    'audit_history', v_audit,
    'statistics', jsonb_build_object(
      'renewal_count', jsonb_array_length(v_renewals),
      'expansion_count', jsonb_array_length(v_expansion),
      'at_risk_renewals', (
        select count(*) from public.revenue_growth_renewals r
        where r.organization_id = v_org_id and r.renewal_status in ('at_risk', 'lost')
      ),
      'playbook_count', jsonb_array_length(v_playbooks)
    )
  );
end; $$;

grant execute on function public.get_customer_revenue_growth_center() to authenticated;
