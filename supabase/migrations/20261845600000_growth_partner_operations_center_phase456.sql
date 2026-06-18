-- Phase 456 — Growth Partner Operations Center (Customer App)
-- Route hub: /app/growth-partner/*

create table if not exists public.growth_partner_ops_dashboard_metrics (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'active_leads', 'active_customers', 'monthly_commission', 'lifetime_commission',
    'pipeline_value', 'certification_status', 'upcoming_payout'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (profile_id, metric_key)
);

create table if not exists public.growth_partner_ops_leads (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  lead_key text not null,
  company_name text not null,
  contact_name text not null default '',
  lead_status text not null default 'new' check (lead_status in (
    'new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'
  )),
  lead_source text not null default '',
  partner_notes text not null default '' check (char_length(partner_notes) <= 500),
  follow_up_task text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (profile_id, lead_key)
);

create index if not exists growth_partner_ops_leads_profile_idx
  on public.growth_partner_ops_leads (profile_id, lead_status);

create table if not exists public.growth_partner_ops_opportunities (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  opportunity_key text not null,
  title text not null,
  stage text not null default 'discovery' check (stage in (
    'discovery', 'qualification', 'presentation', 'proposal', 'negotiation', 'won', 'lost'
  )),
  forecast_value_label text not null default '',
  expected_close_date text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (profile_id, opportunity_key)
);

create table if not exists public.growth_partner_ops_customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  customer_key text not null,
  customer_name text not null,
  plan_label text not null default '',
  monthly_revenue_label text not null default '',
  commission_value_label text not null default '',
  renewal_status text not null default '',
  health_label text not null default '',
  support_status text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (profile_id, customer_key)
);

create table if not exists public.growth_partner_ops_commissions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  period_key text not null,
  period_label text not null,
  amount_label text not null default '',
  commission_type text not null default 'recurring' check (commission_type in (
    'current_month', 'previous_month', 'quarter', 'year', 'lifetime', 'upcoming', 'historical'
  )),
  rules_summary text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (profile_id, period_key)
);

create table if not exists public.growth_partner_ops_payouts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  payout_key text not null,
  amount_label text not null default '',
  payout_status text not null default 'pending' check (payout_status in (
    'pending', 'approved', 'paid', 'failed'
  )),
  bank_verification_label text not null default '',
  settlement_date_label text not null default '',
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now(),
  unique (profile_id, payout_key)
);

create table if not exists public.growth_partner_ops_resources (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  resource_type text not null check (resource_type in (
    'sales_deck', 'brochure', 'email_template', 'landing_page', 'logo',
    'brand_asset', 'case_study', 'business_pack'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (profile_id, resource_type, title)
);

create table if not exists public.growth_partner_ops_performance (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  metric_key text not null,
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (profile_id, metric_key)
);

create table if not exists public.growth_partner_ops_recommendations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  recommendation_type text not null check (recommendation_type in (
    'industry', 'market', 'business_pack', 'training', 'sales_opportunity'
  )),
  title text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now()
);

create index if not exists growth_partner_ops_recommendations_profile_idx
  on public.growth_partner_ops_recommendations (profile_id);

create table if not exists public.growth_partner_ops_activity (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  activity_key text not null,
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  date_label text not null default '',
  audit_ref text not null default '',
  status_key text not null default 'information',
  created_at timestamptz not null default now(),
  unique (profile_id, activity_key)
);

create index if not exists growth_partner_ops_activity_profile_idx
  on public.growth_partner_ops_activity (profile_id, created_at desc);

alter table public.growth_partner_ops_dashboard_metrics enable row level security;
alter table public.growth_partner_ops_leads enable row level security;
alter table public.growth_partner_ops_opportunities enable row level security;
alter table public.growth_partner_ops_customers enable row level security;
alter table public.growth_partner_ops_commissions enable row level security;
alter table public.growth_partner_ops_payouts enable row level security;
alter table public.growth_partner_ops_resources enable row level security;
alter table public.growth_partner_ops_performance enable row level security;
alter table public.growth_partner_ops_recommendations enable row level security;
alter table public.growth_partner_ops_activity enable row level security;

revoke all on public.growth_partner_ops_dashboard_metrics from authenticated, anon;
revoke all on public.growth_partner_ops_leads from authenticated, anon;
revoke all on public.growth_partner_ops_opportunities from authenticated, anon;
revoke all on public.growth_partner_ops_customers from authenticated, anon;
revoke all on public.growth_partner_ops_commissions from authenticated, anon;
revoke all on public.growth_partner_ops_payouts from authenticated, anon;
revoke all on public.growth_partner_ops_resources from authenticated, anon;
revoke all on public.growth_partner_ops_performance from authenticated, anon;
revoke all on public.growth_partner_ops_recommendations from authenticated, anon;
revoke all on public.growth_partner_ops_activity from authenticated, anon;

create or replace function public._gp456_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_profile public.growth_partner_app_profiles;
begin
  v_profile := public._gp455_profile_for_auth();
  if v_profile.id is null then
    return jsonb_build_object('found', false, 'error', 'Growth Partner profile not found');
  end if;
  if not public._irp_has_permission('growth_partner.view', v_profile.organization_id) then
    return jsonb_build_object('found', false, 'error', 'Access denied');
  end if;
  return jsonb_build_object(
    'found', true,
    'profile_id', v_profile.id,
    'organization_id', v_profile.organization_id,
    'partner_status', v_profile.partner_status,
    'certification_status', v_profile.certification_status,
    'can_manage', public._irp_has_permission('growth_partner.profile', v_profile.organization_id)
  );
end; $$;

create or replace function public._gp456_seed(p_profile_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.growth_partner_ops_leads where profile_id = p_profile_id limit 1) then
    return;
  end if;

  insert into public.growth_partner_ops_dashboard_metrics
    (profile_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_profile_id, 'active_leads', '12', '+3 this month', 'information'),
    (p_profile_id, 'active_customers', '8', '2 renewals due', 'verified'),
    (p_profile_id, 'monthly_commission', '€2,840', 'Current month', 'information'),
    (p_profile_id, 'lifetime_commission', '€18,420', 'Since activation', 'verified'),
    (p_profile_id, 'pipeline_value', '€46,500', 'Qualified + proposal', 'requires_attention'),
    (p_profile_id, 'certification_status', 'Certified', 'Renewal not due', 'verified'),
    (p_profile_id, 'upcoming_payout', '€1,920', 'Scheduled next cycle', 'waiting');

  insert into public.growth_partner_ops_leads
    (profile_id, lead_key, company_name, contact_name, lead_status, lead_source, partner_notes, follow_up_task, status_key)
  values
    (p_profile_id, 'lead-001', 'Nordic Hospitality Group', 'Elena Berg', 'qualified', 'Outbound', 'Interested in Aipify Hosts pack for 3 properties.', 'Send tailored demo — Friday', 'requires_attention'),
    (p_profile_id, 'lead-002', 'Bergen Retail Co', 'Jonas Nilsen', 'proposal_sent', 'Referral', 'Commerce pack evaluation in progress.', 'Follow up on proposal feedback', 'waiting'),
    (p_profile_id, 'lead-003', 'Oslo Professional Services', 'Maria Solberg', 'new', 'Website', 'Requested ABOS overview for 40-person firm.', 'Schedule discovery call', 'information');

  insert into public.growth_partner_ops_opportunities
    (profile_id, opportunity_key, title, stage, forecast_value_label, expected_close_date, status_key)
  values
    (p_profile_id, 'opp-001', 'Nordic Hospitality — 3 sites', 'presentation', '€24,000 ARR', '2026-Q3', 'requires_attention'),
    (p_profile_id, 'opp-002', 'Bergen Retail — Commerce expansion', 'proposal', '€12,500 ARR', '2026-Q2', 'waiting'),
    (p_profile_id, 'opp-003', 'Oslo Professional — Starter upgrade', 'discovery', '€6,800 ARR', '2026-Q3', 'information');

  insert into public.growth_partner_ops_customers
    (profile_id, customer_key, customer_name, plan_label, monthly_revenue_label, commission_value_label, renewal_status, health_label, support_status, status_key)
  values
    (p_profile_id, 'cust-001', 'Unonight Pilot', 'Business', '€890/mo', '€178/mo commission', 'Renewal in 45 days', 'Healthy', 'No open tickets', 'verified'),
    (p_profile_id, 'cust-002', 'Fjord Commerce AS', 'Professional', '€420/mo', '€84/mo commission', 'Auto-renew', 'Stable', '1 informational ticket', 'verified');

  insert into public.growth_partner_ops_commissions
    (profile_id, period_key, period_label, amount_label, commission_type, rules_summary, status_key)
  values
    (p_profile_id, 'current_month', 'Current month', '€2,840', 'current_month', 'Global default 20% recurring — individual override visible after approval.', 'information'),
    (p_profile_id, 'previous_month', 'Previous month', '€2,610', 'previous_month', 'Paid customers only — attribution locked to partner ID.', 'verified'),
    (p_profile_id, 'quarter', 'This quarter', '€7,920', 'quarter', 'Quarter aggregate — audit trail in commission center.', 'information'),
    (p_profile_id, 'year', 'Year to date', '€14,280', 'year', 'YTD recurring commissions.', 'information'),
    (p_profile_id, 'lifetime', 'Lifetime earnings', '€18,420', 'lifetime', 'Lifetime partner-attributed revenue share.', 'verified'),
    (p_profile_id, 'upcoming', 'Upcoming commissions', '€960', 'upcoming', 'Pending customer activations this cycle.', 'waiting');

  insert into public.growth_partner_ops_payouts
    (profile_id, payout_key, amount_label, payout_status, bank_verification_label, settlement_date_label, status_key)
  values
    (p_profile_id, 'pay-001', '€1,920', 'pending', 'Bank account pending verification', '2026-07-01', 'waiting'),
    (p_profile_id, 'pay-002', '€2,610', 'paid', 'Verified — Nordics Business Bank', '2026-06-01', 'completed'),
    (p_profile_id, 'pay-003', '€2,480', 'approved', 'Verified — awaiting settlement', '2026-06-15', 'verified');

  insert into public.growth_partner_ops_resources
    (profile_id, resource_type, title, summary, status_key)
  values
    (p_profile_id, 'sales_deck', 'Aipify ABOS Sales Deck', 'Enterprise positioning — Companion, governance, and install-first story.', 'verified'),
    (p_profile_id, 'brochure', 'Growth Partner Brochure', 'One-page overview for prospect meetings.', 'verified'),
    (p_profile_id, 'email_template', 'Discovery Email Templates', 'Approved outreach sequences — brand compliant.', 'verified'),
    (p_profile_id, 'landing_page', 'Partner Referral Landing Pages', 'Tracked landing pages for your portfolio.', 'information'),
    (p_profile_id, 'logo', 'Aipify Logo Pack', 'Official logos and usage guidelines.', 'verified'),
    (p_profile_id, 'brand_asset', 'Brand Asset Library', 'Colors, typography, and enterprise copy standards.', 'verified'),
    (p_profile_id, 'case_study', 'Unonight Pilot Case Study', 'Anonymised operational proof — hospitality vertical.', 'verified'),
    (p_profile_id, 'business_pack', 'Aipify Hosts Business Pack', 'Sales sheet and demo script for hospitality prospects.', 'verified');

  insert into public.growth_partner_ops_performance
    (profile_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_profile_id, 'revenue_generated', '€92,400', 'Partner-attributed ARR', 'verified'),
    (p_profile_id, 'conversion_rate', '24%', 'Lead to customer', 'information'),
    (p_profile_id, 'lead_response_time', '4.2 hours', 'Average first response', 'verified'),
    (p_profile_id, 'customer_retention', '96%', 'Rolling 12 months', 'verified'),
    (p_profile_id, 'top_business_pack', 'Aipify Hosts', 'Highest conversion in your region', 'information'),
    (p_profile_id, 'partner_ranking', 'Top 15%', 'Nordic Growth Partners', 'verified');

  insert into public.growth_partner_ops_recommendations
    (profile_id, recommendation_type, title, insight, status_key)
  values
    (p_profile_id, 'industry', 'Target hospitality operators', 'Hospitality demand increasing in your region — Aipify Hosts pack aligns with seasonal booking cycles.', 'information'),
    (p_profile_id, 'business_pack', 'Focus on Commerce Business Pack', 'Commerce Business Pack has highest conversion rate among your recent leads.', 'information'),
    (p_profile_id, 'market', 'Expand into western Norway', 'Three qualified leads in Bergen — consider local follow-up this week.', 'requires_attention'),
    (p_profile_id, 'training', 'Complete objection handling module', 'Improves close rate on Professional tier prospects.', 'waiting'),
    (p_profile_id, 'sales_opportunity', 'Follow up Bergen Retail proposal', 'Proposal sent 5 days ago — gentle follow-up recommended.', 'requires_attention');

  insert into public.growth_partner_ops_activity
    (profile_id, activity_key, title, summary, date_label, audit_ref, status_key)
  values
    (p_profile_id, 'act-001', 'Lead qualified', 'Nordic Hospitality Group moved to qualified.', '2026-06-17', 'AUD-GP-1042', 'verified'),
    (p_profile_id, 'act-002', 'Commission accrued', 'Fjord Commerce AS — June recurring commission recorded.', '2026-06-16', 'AUD-COM-8831', 'information'),
    (p_profile_id, 'act-003', 'Payout approved', 'May settlement approved — pending bank transfer.', '2026-06-15', 'AUD-PAY-2201', 'waiting');
end; $$;

create or replace function public.get_growth_partner_operations_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_profile_id uuid;
  v_partner_status text;
  v_dashboard jsonb;
  v_leads jsonb;
  v_opportunities jsonb;
  v_customers jsonb;
  v_commissions jsonb;
  v_payouts jsonb;
  v_resources jsonb;
  v_training jsonb;
  v_performance jsonb;
  v_recommendations jsonb;
  v_activity jsonb;
  v_completed int;
  v_total int;
  v_cert_key text;
  v_cert_label text;
begin
  v_ctx := public._gp456_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_profile_id := (v_ctx->>'profile_id')::uuid;
  v_partner_status := coalesce(v_ctx->>'partner_status', 'certification_required');
  perform public._gp456_seed(v_profile_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_value', m.metric_value,
    'trend_label', m.trend_label, 'status_key', m.status_key, 'item_type', 'dashboard_metric'
  ) order by case m.metric_key
    when 'active_leads' then 1 when 'active_customers' then 2 when 'monthly_commission' then 3
    when 'lifetime_commission' then 4 when 'pipeline_value' then 5 when 'certification_status' then 6
    else 7 end), '[]'::jsonb)
  into v_dashboard from public.growth_partner_ops_dashboard_metrics m where m.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'lead_key', l.lead_key, 'company_name', l.company_name, 'contact_name', l.contact_name,
    'lead_status', l.lead_status, 'lead_source', l.lead_source, 'partner_notes', l.partner_notes,
    'follow_up_task', l.follow_up_task, 'status_key', l.status_key, 'item_type', 'lead'
  ) order by l.updated_at desc), '[]'::jsonb)
  into v_leads from public.growth_partner_ops_leads l where l.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'opportunity_key', o.opportunity_key, 'title', o.title, 'stage', o.stage,
    'forecast_value_label', o.forecast_value_label, 'expected_close_date', o.expected_close_date,
    'status_key', o.status_key, 'item_type', 'opportunity'
  ) order by o.updated_at desc), '[]'::jsonb)
  into v_opportunities from public.growth_partner_ops_opportunities o where o.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'customer_key', c.customer_key, 'customer_name', c.customer_name,
    'plan_label', c.plan_label, 'monthly_revenue_label', c.monthly_revenue_label,
    'commission_value_label', c.commission_value_label, 'renewal_status', c.renewal_status,
    'health_label', c.health_label, 'support_status', c.support_status,
    'status_key', c.status_key, 'item_type', 'customer'
  ) order by c.customer_name), '[]'::jsonb)
  into v_customers from public.growth_partner_ops_customers c where c.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'period_key', c.period_key, 'period_label', c.period_label,
    'amount_label', c.amount_label, 'commission_type', c.commission_type,
    'rules_summary', c.rules_summary, 'status_key', c.status_key, 'item_type', 'commission'
  ) order by case c.commission_type
    when 'current_month' then 1 when 'previous_month' then 2 when 'quarter' then 3
    when 'year' then 4 when 'lifetime' then 5 else 6 end), '[]'::jsonb)
  into v_commissions from public.growth_partner_ops_commissions c where c.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'payout_key', p.payout_key, 'amount_label', p.amount_label,
    'payout_status', p.payout_status, 'bank_verification_label', p.bank_verification_label,
    'settlement_date_label', p.settlement_date_label, 'status_key', p.status_key, 'item_type', 'payout'
  ) order by p.updated_at desc), '[]'::jsonb)
  into v_payouts from public.growth_partner_ops_payouts p where p.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'resource_type', r.resource_type, 'title', r.title, 'summary', r.summary,
    'status_key', r.status_key, 'item_type', 'resource'
  ) order by r.title), '[]'::jsonb)
  into v_resources from public.growth_partner_ops_resources r where r.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_value', m.metric_value,
    'trend_label', m.trend_label, 'status_key', m.status_key, 'item_type', 'performance'
  ) order by m.metric_key), '[]'::jsonb)
  into v_performance from public.growth_partner_ops_performance m where m.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'recommendation_type', r.recommendation_type, 'title', r.title,
    'insight', r.insight, 'status_key', r.status_key, 'item_type', 'recommendation'
  ) order by r.updated_at desc), '[]'::jsonb)
  into v_recommendations from public.growth_partner_ops_recommendations r where r.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'activity_key', a.activity_key, 'title', a.title, 'summary', a.summary,
    'date_label', a.date_label, 'audit_ref', a.audit_ref, 'status_key', a.status_key, 'item_type', 'activity'
  ) order by a.created_at desc), '[]'::jsonb)
  into v_activity from public.growth_partner_ops_activity a where a.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'module_key', m.module_key, 'module_title', m.module_title,
    'status', coalesce(tp.status, 'not_started'), 'sort_order', m.sort_order, 'item_type', 'training_module'
  ) order by m.sort_order), '[]'::jsonb)
  into v_training
  from public.growth_partner_training_modules m
  left join public.growth_partner_training_progress tp
    on tp.module_key = m.module_key and tp.profile_id = v_profile_id;

  select count(*) filter (where tp.status = 'completed'), count(*)
  into v_completed, v_total
  from public.growth_partner_training_progress tp where tp.profile_id = v_profile_id;

  if v_partner_status = 'certified' then
    v_cert_key := 'verified';
    v_cert_label := 'Verified — Certified Growth Partner';
  else
    v_cert_key := 'waiting';
    v_cert_label := 'Waiting — Certification Required';
  end if;

  return jsonb_build_object(
    'found', true,
    'partner_status', v_partner_status,
    'certification_status', coalesce(v_ctx->>'certification_status', 'pending'),
    'certification_status_key', v_cert_key,
    'certification_status_label', v_cert_label,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'Every sales action includes audit log, partner attribution, commission traceability, payout traceability, and approval history. Growth Partners see only their own data.',
    'privacy_note', 'No access to Platform Admin, Super Admin, other partner data, or customer internal systems.',
    'training_progress_pct', case when v_total > 0 then round((v_completed::numeric / v_total) * 100)::int else 0 end,
    'training_completed_count', v_completed,
    'training_total_count', v_total,
    'dashboard_metrics', v_dashboard,
    'lead_management', v_leads,
    'opportunity_pipeline', v_opportunities,
    'customer_portfolio', v_customers,
    'commission_center', v_commissions,
    'payout_center', v_payouts,
    'marketing_resources', v_resources,
    'training_center', v_training,
    'performance_center', v_performance,
    'growth_recommendations', v_recommendations,
    'recent_activity', v_activity,
    'statistics', jsonb_build_object(
      'lead_count', jsonb_array_length(v_leads),
      'opportunity_count', jsonb_array_length(v_opportunities),
      'customer_count', jsonb_array_length(v_customers),
      'resource_count', jsonb_array_length(v_resources)
    )
  );
end; $$;

grant execute on function public.get_growth_partner_operations_center() to authenticated;
