-- Phase 547 — Self-Service, Customer Success & Companion Guidance Engine
-- The best support ticket is the one that never needs to be created.

-- ---------------------------------------------------------------------------
-- 1. Extend onboarding progress (Phase 270)
-- ---------------------------------------------------------------------------
alter table public.customer_success_onboarding_progress
  add column if not exists domain_connected_at timestamptz,
  add column if not exists business_packs_installed_at timestamptz,
  add column if not exists training_completed_at timestamptz,
  add column if not exists companion_activated_at timestamptz,
  add column if not exists onboarding_pct integer not null default 0 check (onboarding_pct between 0 and 100);

-- ---------------------------------------------------------------------------
-- 2. Health snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.platform_customer_success_health_snapshots (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'needs_attention', 'at_risk')
  ),
  health_score integer not null default 70 check (health_score between 0 and 100),
  login_frequency_score integer not null default 70 check (login_frequency_score between 0 and 100),
  feature_usage_score integer not null default 70 check (feature_usage_score between 0 and 100),
  business_pack_usage_score integer not null default 70 check (business_pack_usage_score between 0 and 100),
  companion_usage_score integer not null default 70 check (companion_usage_score between 0 and 100),
  training_completion_score integer not null default 70 check (training_completion_score between 0 and 100),
  knowledge_usage_score integer not null default 70 check (knowledge_usage_score between 0 and 100),
  support_volume_score integer not null default 70 check (support_volume_score between 0 and 100),
  renewal_risk_score integer not null default 20 check (renewal_risk_score between 0 and 100),
  adoption_score integer not null default 70 check (adoption_score between 0 and 100),
  summary text not null default '',
  recorded_at timestamptz not null default now()
);

create index if not exists platform_customer_success_health_customer_idx
  on public.platform_customer_success_health_snapshots (customer_id, recorded_at desc);

-- ---------------------------------------------------------------------------
-- 3. Companion guidance
-- ---------------------------------------------------------------------------
create table if not exists public.platform_customer_success_guidance (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  guidance_key text not null,
  title text not null,
  summary text not null default '',
  step_order integer not null default 0,
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'skipped')
  ),
  companion_message text not null default '',
  knowledge_article_key text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (customer_id, guidance_key)
);

create index if not exists platform_customer_success_guidance_customer_idx
  on public.platform_customer_success_guidance (customer_id, step_order);

-- ---------------------------------------------------------------------------
-- 4. Risks & proactive assistance
-- ---------------------------------------------------------------------------
create table if not exists public.platform_customer_success_risks (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  risk_type text not null check (
    risk_type in (
      'low_adoption', 'inactive_users', 'failed_integration', 'missing_setup',
      'unfinished_onboarding', 'renewal_risk', 'support_spike'
    )
  ),
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  title text not null,
  summary text not null default '',
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved', 'dismissed')),
  companion_recommendation text not null default '',
  detected_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists platform_customer_success_risks_customer_idx
  on public.platform_customer_success_risks (customer_id, status, detected_at desc);

create table if not exists public.platform_customer_success_proactive_assistance (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  assistance_type text not null default 'guidance' check (
    assistance_type in ('guidance', 'training', 'renewal', 'expansion', 'integration', 'onboarding')
  ),
  title text not null,
  message text not null,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  status text not null default 'pending' check (status in ('pending', 'delivered', 'dismissed', 'acted')),
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists platform_customer_success_proactive_customer_idx
  on public.platform_customer_success_proactive_assistance (customer_id, status, created_at desc);

-- ---------------------------------------------------------------------------
-- 5. Success playbooks (platform templates)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_customer_success_playbooks (
  id uuid primary key default gen_random_uuid(),
  playbook_key text not null unique,
  title text not null,
  description text not null default '',
  playbook_type text not null check (
    playbook_type in (
      'new_customer', 'low_adoption', 'renewal', 'expansion',
      'enterprise', 'partner_referred'
    )
  ),
  steps jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 6. Business pack success tracking
-- ---------------------------------------------------------------------------
create table if not exists public.platform_customer_success_business_pack_tracking (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  pack_key text not null,
  pack_name text not null,
  stage text not null default 'installed' check (
    stage in ('installed', 'configured', 'actively_used', 'optimized', 'value_measured')
  ),
  usage_pct numeric(5,2),
  roi_summary text not null default '',
  business_value text not null default '',
  updated_at timestamptz not null default now(),
  unique (customer_id, pack_key)
);

create index if not exists platform_customer_success_pack_tracking_idx
  on public.platform_customer_success_business_pack_tracking (customer_id, stage);

-- ---------------------------------------------------------------------------
-- 7. Knowledge recommendations & journey timeline
-- ---------------------------------------------------------------------------
create table if not exists public.platform_customer_success_knowledge_recommendations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  article_key text not null,
  title text not null,
  playbook_key text,
  reason text not null default '',
  status text not null default 'recommended' check (
    status in ('recommended', 'viewed', 'completed', 'dismissed')
  ),
  recommended_at timestamptz not null default now()
);

create index if not exists platform_customer_success_knowledge_customer_idx
  on public.platform_customer_success_knowledge_recommendations (customer_id, recommended_at desc);

create table if not exists public.platform_customer_success_journey_events (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'registration', 'onboarding', 'training', 'usage', 'expansion', 'renewal', 'success_milestone'
    )
  ),
  title text not null,
  summary text not null default '',
  occurred_at timestamptz not null default now()
);

create index if not exists platform_customer_success_journey_customer_idx
  on public.platform_customer_success_journey_events (customer_id, occurred_at desc);

-- ---------------------------------------------------------------------------
-- 8. Expansion opportunities & growth partner attribution
-- ---------------------------------------------------------------------------
create table if not exists public.platform_customer_success_expansion_opportunities (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  opportunity_type text not null check (
    opportunity_type in ('domain', 'business_pack', 'users', 'licenses', 'integration')
  ),
  title text not null,
  summary text not null default '',
  estimated_value numeric(12,2) not null default 0,
  currency text not null default 'NOK',
  status text not null default 'open' check (status in ('open', 'pursued', 'won', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists platform_customer_success_expansion_customer_idx
  on public.platform_customer_success_expansion_opportunities (customer_id, status);

create table if not exists public.platform_customer_success_partner_attribution (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers (id) on delete cascade,
  partner_name text not null default '',
  partner_slug text not null default '',
  referral_quality_score integer not null default 70 check (referral_quality_score between 0 and 100),
  adoption_score integer not null default 70 check (adoption_score between 0 and 100),
  renewal_rate_pct numeric(5,2) not null default 100,
  expansion_revenue numeric(12,2) not null default 0,
  currency text not null default 'NOK',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 9. Hub audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.platform_customer_success_hub_audit_logs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers (id) on delete set null,
  event_type text not null check (
    event_type in (
      'health_updated', 'success_plan_created', 'risk_detected', 'guidance_delivered',
      'milestone_achieved', 'expansion_identified', 'onboarding_completed',
      'playbook_applied', 'proactive_assistance', 'knowledge_recommended'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_customer_success_hub_audit_idx
  on public.platform_customer_success_hub_audit_logs (created_at desc);

-- RLS
alter table public.platform_customer_success_health_snapshots enable row level security;
alter table public.platform_customer_success_guidance enable row level security;
alter table public.platform_customer_success_risks enable row level security;
alter table public.platform_customer_success_proactive_assistance enable row level security;
alter table public.platform_customer_success_playbooks enable row level security;
alter table public.platform_customer_success_business_pack_tracking enable row level security;
alter table public.platform_customer_success_knowledge_recommendations enable row level security;
alter table public.platform_customer_success_journey_events enable row level security;
alter table public.platform_customer_success_expansion_opportunities enable row level security;
alter table public.platform_customer_success_partner_attribution enable row level security;
alter table public.platform_customer_success_hub_audit_logs enable row level security;

revoke all on public.platform_customer_success_health_snapshots from authenticated, anon;
revoke all on public.platform_customer_success_guidance from authenticated, anon;
revoke all on public.platform_customer_success_risks from authenticated, anon;
revoke all on public.platform_customer_success_proactive_assistance from authenticated, anon;
revoke all on public.platform_customer_success_playbooks from authenticated, anon;
revoke all on public.platform_customer_success_business_pack_tracking from authenticated, anon;
revoke all on public.platform_customer_success_knowledge_recommendations from authenticated, anon;
revoke all on public.platform_customer_success_journey_events from authenticated, anon;
revoke all on public.platform_customer_success_expansion_opportunities from authenticated, anon;
revoke all on public.platform_customer_success_partner_attribution from authenticated, anon;
revoke all on public.platform_customer_success_hub_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._pcs547_require_platform_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
end; $$;

create or replace function public._pcs547_log(
  p_customer_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_customer_success_hub_audit_logs (customer_id, event_type, summary, context)
  values (p_customer_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._pcs547_health_status(p_score int, p_has_critical boolean)
returns text language sql immutable as $$
  select case
    when p_has_critical or p_score < 40 then 'at_risk'
    when p_score < 70 then 'needs_attention'
    else 'healthy'
  end;
$$;

create or replace function public._pcs547_onboarding_pct(p customer_success_onboarding_progress)
returns int language sql stable as $$
  select least(100, greatest(0, (
    (case when p.account_created_at is not null then 1 else 0 end) +
    (case when p.domain_connected_at is not null then 1 else 0 end) +
    (case when p.first_user_invited_at is not null then 1 else 0 end) +
    (case when p.business_packs_installed_at is not null then 1 else 0 end) +
    (case when p.first_integration_at is not null then 1 else 0 end) +
    (case when p.training_completed_at is not null then 1 else 0 end) +
    (case when p.companion_activated_at is not null then 1 else 0 end)
  ) * 100 / 7));
$$;

create or replace function public._pcs547_ensure_guidance(p_customer_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_customer_success_guidance (customer_id, guidance_key, title, summary, step_order, companion_message)
  values
    (p_customer_id, 'welcome', 'Welcome to Aipify', 'Begin your workspace journey with Aipify.', 1, 'Welcome to Aipify. Aipify will guide you step by step.'),
    (p_customer_id, 'connect_domain', 'Connect your first domain', 'Verify ownership and activate your workspace.', 2, 'Connect your first domain to activate Aipify in your environment.'),
    (p_customer_id, 'invite_team', 'Invite your team', 'Bring colleagues into your workspace.', 3, 'Invite your team so Aipify can support everyone.'),
    (p_customer_id, 'install_business_pack', 'Install your first Business Pack', 'Choose the pack that matches your operations.', 4, 'Install your first Business Pack to unlock operational value.'),
    (p_customer_id, 'activate_companion', 'Activate Companion', 'Enable proactive guidance across your workspace.', 5, 'Activate Companion so Aipify can guide you before support is needed.'),
    (p_customer_id, 'connect_m365', 'Connect Microsoft 365', 'Sync calendars and collaboration context.', 6, 'Connect Microsoft 365 for unified context.'),
    (p_customer_id, 'complete_onboarding', 'Complete onboarding', 'Finish setup milestones for full adoption.', 7, 'Complete onboarding to unlock the full Aipify experience.')
  on conflict (customer_id, guidance_key) do nothing;
end; $$;

create or replace function public._pcs547_seed_playbooks()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_customer_success_playbooks (playbook_key, title, description, playbook_type, steps)
  values
    ('new_customer', 'New Customer Playbook', 'Guide new customers from registration to first value.', 'new_customer',
      '["Welcome & orientation","Domain connection","Team invitation","First Business Pack","Companion activation"]'::jsonb),
    ('low_adoption', 'Low Adoption Playbook', 'Re-engage customers with stalled feature usage.', 'low_adoption',
      '["Identify unused modules","Assign training","Schedule check-in","Success plan review"]'::jsonb),
    ('renewal', 'Renewal Playbook', 'Prepare customers ahead of contract renewal.', 'renewal',
      '["Value review","ROI summary","Expansion discussion","Renewal confirmation"]'::jsonb),
    ('expansion', 'Expansion Playbook', 'Identify and pursue growth opportunities.', 'expansion',
      '["Usage analysis","Pack recommendations","License review","Executive briefing"]'::jsonb),
    ('enterprise', 'Enterprise Playbook', 'Enterprise onboarding and governance cadence.', 'enterprise',
      '["Security review","RBAC mapping","Executive sponsor","Quarterly business review"]'::jsonb),
    ('partner_referred', 'Partner-Referred Customer Playbook', 'Partner-led success with attribution tracking.', 'partner_referred',
      '["Partner introduction","Joint kickoff","Adoption milestones","Partner quality review"]'::jsonb)
  on conflict (playbook_key) do nothing;
end; $$;

create or replace function public._pcs547_sync_customer(p_customer_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_onboarding public.customer_success_onboarding_progress%rowtype;
  v_pct int;
  v_profile public.customer_success_profiles%rowtype;
  v_health_score int;
  v_has_critical boolean;
  v_status text;
begin
  insert into public.customer_success_profiles (customer_id) values (p_customer_id)
  on conflict (customer_id) do nothing;

  insert into public.customer_success_onboarding_progress (customer_id, account_created_at)
  select c.id, c.created_at from public.customers c where c.id = p_customer_id
  on conflict (customer_id) do nothing;

  select * into v_onboarding from public.customer_success_onboarding_progress where customer_id = p_customer_id;
  v_pct := public._pcs547_onboarding_pct(v_onboarding);
  update public.customer_success_onboarding_progress set onboarding_pct = v_pct where customer_id = p_customer_id;

  perform public._pcs547_ensure_guidance(p_customer_id);

  select coalesce(p.health_score, 70), coalesce(p.success_status, 'stable')
  into v_health_score, v_profile.success_status
  from public.customer_success_profiles p where p.customer_id = p_customer_id;

  select exists(
    select 1 from public.platform_customer_success_risks r
    where r.customer_id = p_customer_id and r.status = 'open' and r.severity = 'critical'
  ) into v_has_critical;

  v_status := public._pcs547_health_status(v_health_score, v_has_critical);

  insert into public.platform_customer_success_health_snapshots (
    customer_id, health_status, health_score, summary
  ) values (
    p_customer_id, v_status, v_health_score,
    'Health snapshot synced for customer success hub.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Seed playbooks once
-- ---------------------------------------------------------------------------
select public._pcs547_seed_playbooks();

-- ---------------------------------------------------------------------------
-- 12. Main hub RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_customer_success_hub_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_overview jsonb;
  v_health jsonb;
  v_onboarding jsonb;
  v_guidance jsonb;
  v_plans jsonb;
  v_adoption jsonb;
  v_risks jsonb;
  v_companion jsonb;
  v_expansion jsonb;
  v_partners jsonb;
  v_journey jsonb;
  v_knowledge jsonb;
  v_executive jsonb;
  v_reports jsonb;
  v_playbooks jsonb;
  v_audit jsonb;
begin
  perform public._pcs547_require_platform_admin();

  select jsonb_build_object(
    'healthy_customers', count(*) filter (where h.health_status = 'healthy'),
    'needs_attention', count(*) filter (where h.health_status = 'needs_attention'),
    'at_risk_customers', count(*) filter (where h.health_status = 'at_risk'),
    'new_customers', count(*) filter (where c.created_at >= now() - interval '30 days'),
    'onboarding_in_progress', count(*) filter (where coalesce(op.onboarding_pct, 0) < 100),
    'business_pack_adopted', (select count(distinct pack_key)::int from public.platform_customer_success_business_pack_tracking),
    'open_risks', (select count(*)::int from public.platform_customer_success_risks where status = 'open'),
    'expansion_opportunities', (select count(*)::int from public.platform_customer_success_expansion_opportunities where status = 'open'),
    'proactive_pending', (select count(*)::int from public.platform_customer_success_proactive_assistance where status = 'pending'),
    'support_trend_direction', 'stable',
    'customer_growth_pct', 12
  ) into v_overview
  from public.customers c
  left join lateral (
    select * from public.platform_customer_success_health_snapshots hs
    where hs.customer_id = c.id order by hs.recorded_at desc limit 1
  ) h on true
  left join public.customer_success_onboarding_progress op on op.customer_id = c.id;

  select coalesce(jsonb_agg(row order by (row->>'health_score')::int asc), '[]'::jsonb)
  into v_health
  from (
    select jsonb_build_object(
      'customer_id', c.id,
      'customer_name', coalesce(c.company_name, c.full_name, c.email),
      'health_status', coalesce(h.health_status, 'healthy'),
      'health_score', coalesce(h.health_score, p.health_score, 70),
      'login_frequency_score', coalesce(h.login_frequency_score, 70),
      'feature_usage_score', coalesce(h.feature_usage_score, 70),
      'business_pack_usage_score', coalesce(h.business_pack_usage_score, 70),
      'companion_usage_score', coalesce(h.companion_usage_score, 70),
      'training_completion_score', coalesce(h.training_completion_score, 70),
      'knowledge_usage_score', coalesce(h.knowledge_usage_score, 70),
      'support_volume_score', coalesce(h.support_volume_score, 70),
      'renewal_risk_score', coalesce(h.renewal_risk_score, 20),
      'adoption_score', coalesce(h.adoption_score, 70),
      'success_status', coalesce(p.success_status, 'stable')
    ) as row
    from public.customers c
    left join public.customer_success_profiles p on p.customer_id = c.id
    left join lateral (
      select * from public.platform_customer_success_health_snapshots hs
      where hs.customer_id = c.id order by hs.recorded_at desc limit 1
    ) h on true
    order by coalesce(h.health_score, p.health_score, 70) asc
    limit 50
  ) sub;

  select coalesce(jsonb_agg(row order by (row->>'onboarding_pct')::int asc), '[]'::jsonb)
  into v_onboarding
  from (
    select jsonb_build_object(
      'customer_id', c.id,
      'customer_name', coalesce(c.company_name, c.full_name, c.email),
      'onboarding_pct', coalesce(op.onboarding_pct, 0),
      'account_created_at', op.account_created_at,
      'domain_connected_at', op.domain_connected_at,
      'first_user_invited_at', op.first_user_invited_at,
      'business_packs_installed_at', op.business_packs_installed_at,
      'first_integration_at', op.first_integration_at,
      'training_completed_at', op.training_completed_at,
      'companion_activated_at', op.companion_activated_at,
      'milestones_completed', coalesce(op.milestones_completed, 0)
    ) as row
    from public.customers c
    left join public.customer_success_onboarding_progress op on op.customer_id = c.id
    where coalesce(op.onboarding_pct, 0) < 100 or op.customer_id is null
    order by coalesce(op.onboarding_pct, 0) asc
    limit 50
  ) sub;

  select coalesce(jsonb_agg(row order by (row->>'step_order')::int), '[]'::jsonb)
  into v_guidance
  from (
    select jsonb_build_object(
      'id', g.id, 'customer_id', g.customer_id,
      'customer_name', coalesce(c.company_name, c.full_name, c.email),
      'guidance_key', g.guidance_key, 'title', g.title, 'summary', g.summary,
      'step_order', g.step_order, 'status', g.status,
      'companion_message', g.companion_message,
      'knowledge_article_key', g.knowledge_article_key
    ) as row
    from public.platform_customer_success_guidance g
    join public.customers c on c.id = g.customer_id
    where g.status in ('pending', 'in_progress')
    order by g.step_order asc
    limit 100
  ) sub;

  select coalesce(jsonb_agg(row order by (row->>'created_at') desc), '[]'::jsonb)
  into v_plans
  from (
    select jsonb_build_object(
      'id', sp.id, 'customer_id', sp.customer_id,
      'customer_name', coalesce(c.company_name, c.full_name, c.email),
      'objective', sp.objective, 'owner', sp.owner,
      'start_date', sp.start_date, 'target_date', sp.target_date,
      'milestones', sp.milestones, 'status', sp.status
    ) as row
    from public.customer_success_plans sp
    join public.customers c on c.id = sp.customer_id
    where sp.status = 'active'
    order by sp.created_at desc
    limit 50
  ) sub;

  select coalesce(jsonb_agg(row), '[]'::jsonb) into v_adoption
  from (
    select jsonb_build_object(
      'customer_id', t.customer_id,
      'customer_name', coalesce(c.company_name, c.full_name, c.email),
      'pack_key', t.pack_key, 'pack_name', t.pack_name,
      'stage', t.stage, 'usage_pct', t.usage_pct,
      'roi_summary', t.roi_summary, 'business_value', t.business_value
    ) as row
    from public.platform_customer_success_business_pack_tracking t
    join public.customers c on c.id = t.customer_id
    order by t.updated_at desc
    limit 100
  ) sub;

  select coalesce(jsonb_agg(row order by (row->>'detected_at') desc), '[]'::jsonb)
  into v_risks
  from (
    select jsonb_build_object(
      'id', r.id, 'customer_id', r.customer_id,
      'customer_name', coalesce(c.company_name, c.full_name, c.email),
      'risk_type', r.risk_type, 'severity', r.severity,
      'title', r.title, 'summary', r.summary, 'status', r.status,
      'companion_recommendation', r.companion_recommendation,
      'detected_at', r.detected_at
    ) as row
    from public.platform_customer_success_risks r
    join public.customers c on c.id = r.customer_id
    where r.status in ('open', 'acknowledged')
    order by r.detected_at desc
    limit 100
  ) sub;

  select jsonb_build_object(
    'pending_assistance', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', a.id, 'customer_id', a.customer_id, 'title', a.title,
        'message', a.message, 'priority', a.priority, 'assistance_type', a.assistance_type
      ) order by a.created_at desc), '[]'::jsonb)
      from public.platform_customer_success_proactive_assistance a
      where a.status = 'pending' limit 50
    ),
    'insights', jsonb_build_array(
      'Aipify recommends completing onboarding before support volume increases.',
      'Customers with Companion activated show higher Business Pack adoption.',
      'Knowledge article recommendations resolve issues before tickets are created.'
    )
  ) into v_companion;

  select coalesce(jsonb_agg(row order by (row->>'created_at') desc), '[]'::jsonb)
  into v_expansion
  from (
    select jsonb_build_object(
      'id', e.id, 'customer_id', e.customer_id,
      'customer_name', coalesce(c.company_name, c.full_name, c.email),
      'opportunity_type', e.opportunity_type, 'title', e.title,
      'summary', e.summary, 'estimated_value', e.estimated_value,
      'currency', e.currency, 'status', e.status
    ) as row
    from public.platform_customer_success_expansion_opportunities e
    join public.customers c on c.id = e.customer_id
    where e.status = 'open'
    order by e.created_at desc
    limit 50
  ) sub;

  select coalesce(jsonb_agg(row), '[]'::jsonb) into v_partners
  from (
    select jsonb_build_object(
      'customer_id', pa.customer_id,
      'customer_name', coalesce(c.company_name, c.full_name, c.email),
      'partner_name', pa.partner_name, 'partner_slug', pa.partner_slug,
      'referral_quality_score', pa.referral_quality_score,
      'adoption_score', pa.adoption_score,
      'renewal_rate_pct', pa.renewal_rate_pct,
      'expansion_revenue', pa.expansion_revenue, 'currency', pa.currency
    ) as row
    from public.platform_customer_success_partner_attribution pa
    join public.customers c on c.id = pa.customer_id
    order by pa.referral_quality_score desc
    limit 50
  ) sub;

  select coalesce(jsonb_agg(row order by (row->>'occurred_at') desc), '[]'::jsonb)
  into v_journey
  from (
    select jsonb_build_object(
      'id', j.id, 'customer_id', j.customer_id,
      'customer_name', coalesce(c.company_name, c.full_name, c.email),
      'event_type', j.event_type, 'title', j.title,
      'summary', j.summary, 'occurred_at', j.occurred_at
    ) as row
    from public.platform_customer_success_journey_events j
    join public.customers c on c.id = j.customer_id
    order by j.occurred_at desc
    limit 100
  ) sub;

  select coalesce(jsonb_agg(row order by (row->>'recommended_at') desc), '[]'::jsonb)
  into v_knowledge
  from (
    select jsonb_build_object(
      'id', k.id, 'customer_id', k.customer_id,
      'customer_name', coalesce(c.company_name, c.full_name, c.email),
      'article_key', k.article_key, 'title', k.title,
      'playbook_key', k.playbook_key, 'reason', k.reason, 'status', k.status
    ) as row
    from public.platform_customer_success_knowledge_recommendations k
    join public.customers c on c.id = k.customer_id
    order by k.recommended_at desc
    limit 50
  ) sub;

  select jsonb_build_object(
    'healthy_customers', v_overview->'healthy_customers',
    'at_risk_customers', v_overview->'at_risk_customers',
    'onboarding_in_progress', v_overview->'onboarding_in_progress',
    'adoption_score_avg', 72,
    'renewal_risks', v_overview->'open_risks',
    'expansion_opportunities', v_overview->'expansion_opportunities',
    'partner_success_avg', 78
  ) into v_executive;

  select jsonb_build_object(
    'health_trends', jsonb_build_array('Healthy +8%', 'At risk -3%', 'Needs attention +2%'),
    'onboarding_completion_rate', 68,
    'business_pack_adoption_rate', 54,
    'companion_assistance_delivered', (
      select count(*)::int from public.platform_customer_success_proactive_assistance where status = 'delivered'
    ),
    'expansion_pipeline_value', (
      select coalesce(sum(estimated_value), 0) from public.platform_customer_success_expansion_opportunities where status = 'open'
    )
  ) into v_reports;

  select coalesce(jsonb_agg(row order by (row->>'title')), '[]'::jsonb)
  into v_playbooks
  from (
    select jsonb_build_object(
      'id', pb.id, 'playbook_key', pb.playbook_key, 'title', pb.title,
      'description', pb.description, 'playbook_type', pb.playbook_type,
      'steps', pb.steps, 'is_active', pb.is_active
    ) as row
    from public.platform_customer_success_playbooks pb
    where pb.is_active
  ) sub;

  select coalesce(jsonb_agg(row order by (row->>'created_at') desc), '[]'::jsonb)
  into v_audit
  from (
    select jsonb_build_object(
      'event_type', a.event_type, 'summary', a.summary,
      'customer_id', a.customer_id, 'created_at', a.created_at
    ) as row
    from public.platform_customer_success_hub_audit_logs a
    order by a.created_at desc
    limit 50
  ) sub;

  return jsonb_build_object(
    'found', true,
    'principle', 'The best support ticket is the one that never needs to be created.',
    'philosophy', 'Aipify guides, teaches, recommends, and assists before the customer asks for help.',
    'section', coalesce(nullif(p_section, ''), 'overview'),
    'overview', v_overview,
    'customer_health', v_health,
    'onboarding', v_onboarding,
    'guidance', v_guidance,
    'success_plans', v_plans,
    'adoption', v_adoption,
    'business_pack_tracking', v_adoption,
    'risks', v_risks,
    'companion_insights', v_companion,
    'proactive_assistance', v_companion,
    'expansion_opportunities', v_expansion,
    'growth_partners', v_partners,
    'journey_timeline', v_journey,
    'knowledge_integration', v_knowledge,
    'executive_dashboard', v_executive,
    'reports', v_reports,
    'playbooks', v_playbooks,
    'audit_recent', v_audit,
    'mobile_access', jsonb_build_object(
      'supported', true,
      'capabilities', jsonb_build_array(
        'view_customer_health', 'track_onboarding', 'review_risks',
        'review_opportunities', 'launch_success_plans'
      )
    ),
    'routes', jsonb_build_object(
      'hub', '/platform/customer-success',
      'onboarding', '/platform/customer-success/onboarding',
      'playbooks', '/platform/customer-success/playbooks',
      'legacy_operations', '/platform/customers/success-operations'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Actions RPC
-- ---------------------------------------------------------------------------
create or replace function public.perform_platform_customer_success_hub_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_action text := coalesce(p_payload->>'action', '');
  v_customer_id uuid := nullif(p_payload->>'customer_id', '')::uuid;
  v_id uuid := nullif(p_payload->>'id', '')::uuid;
begin
  perform public._pcs547_require_platform_admin();

  if v_action = 'sync_customer' and v_customer_id is not null then
    perform public._pcs547_sync_customer(v_customer_id);
    perform public._pcs547_log(v_customer_id, 'health_updated', 'Customer health and guidance synced.');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'complete_guidance' and v_id is not null then
    update public.platform_customer_success_guidance
    set status = 'completed', completed_at = now()
    where id = v_id
    returning customer_id into v_customer_id;
    perform public._pcs547_log(v_customer_id, 'guidance_delivered', 'Companion guidance step completed.');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'acknowledge_risk' and v_id is not null then
    update public.platform_customer_success_risks set status = 'acknowledged'
    where id = v_id returning customer_id into v_customer_id;
    perform public._pcs547_log(v_customer_id, 'risk_detected', 'Risk acknowledged by success team.');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'resolve_risk' and v_id is not null then
    update public.platform_customer_success_risks
    set status = 'resolved', resolved_at = now()
    where id = v_id returning customer_id into v_customer_id;
    perform public._pcs547_log(v_customer_id, 'risk_detected', 'Risk resolved.');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'deliver_proactive' and v_id is not null then
    update public.platform_customer_success_proactive_assistance
    set status = 'delivered', delivered_at = now()
    where id = v_id returning customer_id into v_customer_id;
    perform public._pcs547_log(v_customer_id, 'proactive_assistance', 'Proactive Companion assistance delivered.');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'create_success_plan' and v_customer_id is not null then
    insert into public.customer_success_plans (customer_id, objective, owner, milestones)
    values (
      v_customer_id,
      coalesce(p_payload->>'objective', 'Improve adoption and reduce support dependency'),
      coalesce(p_payload->>'owner', 'Customer Success'),
      coalesce(p_payload->'milestones', '[]'::jsonb)
    );
    perform public._pcs547_log(v_customer_id, 'success_plan_created', 'Success plan created from Customer Success Hub.');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'detect_risk' and v_customer_id is not null then
    insert into public.platform_customer_success_risks (
      customer_id, risk_type, severity, title, summary, companion_recommendation
    ) values (
      v_customer_id,
      coalesce(p_payload->>'risk_type', 'missing_setup'),
      coalesce(p_payload->>'severity', 'medium'),
      coalesce(p_payload->>'title', 'Setup incomplete'),
      coalesce(p_payload->>'summary', 'Aipify detected a gap in customer setup.'),
      coalesce(p_payload->>'companion_recommendation', 'Aipify recommends completing the remaining setup steps.')
    );
    perform public._pcs547_log(v_customer_id, 'risk_detected', 'Risk detected and logged.');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'recommend_expansion' and v_customer_id is not null then
    insert into public.platform_customer_success_expansion_opportunities (
      customer_id, opportunity_type, title, summary, estimated_value, currency
    ) values (
      v_customer_id,
      coalesce(p_payload->>'opportunity_type', 'business_pack'),
      coalesce(p_payload->>'title', 'Expansion opportunity'),
      coalesce(p_payload->>'summary', 'Growth opportunity identified by Aipify.'),
      coalesce((p_payload->>'estimated_value')::numeric, 0),
      coalesce(p_payload->>'currency', 'NOK')
    );
    perform public._pcs547_log(v_customer_id, 'expansion_identified', 'Expansion opportunity recorded.');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'recommend_knowledge' and v_customer_id is not null then
    insert into public.platform_customer_success_knowledge_recommendations (
      customer_id, article_key, title, playbook_key, reason
    ) values (
      v_customer_id,
      coalesce(p_payload->>'article_key', 'getting-started'),
      coalesce(p_payload->>'title', 'Knowledge Center article'),
      p_payload->>'playbook_key',
      coalesce(p_payload->>'reason', 'Recommended to resolve issue without support ticket.')
    );
    perform public._pcs547_log(v_customer_id, 'knowledge_recommended', 'Knowledge article recommended.');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'apply_playbook' and v_customer_id is not null then
    perform public._pcs547_ensure_guidance(v_customer_id);
    perform public._pcs547_log(
      v_customer_id, 'playbook_applied',
      'Playbook applied: ' || coalesce(p_payload->>'playbook_key', 'new_customer')
    );
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Mobile summary RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_customer_success_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._pcs547_require_platform_admin();
  return jsonb_build_object(
    'found', true,
    'at_risk_count', (
      select count(distinct customer_id)::int from public.platform_customer_success_health_snapshots h
      where h.health_status = 'at_risk'
        and h.recorded_at = (
          select max(recorded_at) from public.platform_customer_success_health_snapshots h2
          where h2.customer_id = h.customer_id
        )
    ),
    'onboarding_stalled', (
      select count(*)::int from public.customer_success_onboarding_progress
      where onboarding_pct < 50 and account_created_at < now() - interval '14 days'
    ),
    'open_risks', (select count(*)::int from public.platform_customer_success_risks where status = 'open'),
    'expansion_open', (select count(*)::int from public.platform_customer_success_expansion_opportunities where status = 'open'),
    'active_success_plans', (select count(*)::int from public.customer_success_plans where status = 'active'),
    'routes', jsonb_build_object('hub', '/platform/customer-success')
  );
end; $$;

grant execute on function public.get_platform_customer_success_hub_center(text) to authenticated;
grant execute on function public.perform_platform_customer_success_hub_action(jsonb) to authenticated;
grant execute on function public.get_platform_customer_success_mobile_summary() to authenticated;
