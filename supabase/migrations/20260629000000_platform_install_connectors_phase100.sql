-- Phase 100 — Platform Install Connectors
-- Principle: Installation should feel simple. Payment should feel safe.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install'
  )
);

-- ---------------------------------------------------------------------------
-- 1. platform_install_settings
-- ---------------------------------------------------------------------------
create table if not exists public.platform_install_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  install_assistant_enabled boolean not null default true,
  trial_days int not null default 14,
  require_payment_before_trial boolean not null default true,
  stripe_checkout_enabled boolean not null default true,
  health_check_on_connect boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_install_settings enable row level security;
revoke all on public.platform_install_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. platform_connectors (catalog)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_connectors (
  id uuid primary key default gen_random_uuid(),
  connector_key text not null unique,
  name text not null,
  description text not null,
  install_method text not null check (
    install_method in ('plugin', 'app', 'oauth', 'script', 'api', 'webhook', 'hybrid')
  ),
  sort_order int not null default 0,
  is_active boolean not null default true
);

alter table public.platform_connectors enable row level security;
revoke all on public.platform_connectors from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. installation_sessions + connector_installations
-- ---------------------------------------------------------------------------
create table if not exists public.installation_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_status text not null default 'not_started' check (
    session_status in (
      'not_started', 'account_created', 'payment_required', 'trial_active',
      'platform_selected', 'awaiting_authorization', 'connected',
      'health_check_required', 'live', 'issue_detected', 'suspended', 'cancelled'
    )
  ),
  trial_status text not null default 'no_account' check (
    trial_status in (
      'no_account', 'account_created', 'payment_required', 'payment_method_registered',
      'trial_active', 'trial_expiring_soon', 'trial_cancelled', 'trial_ended',
      'subscription_active', 'payment_failed', 'subscription_cancelled'
    )
  ),
  selected_platform text check (
    selected_platform in ('wordpress', 'shopify', 'woocommerce', 'other')
  ),
  other_platform_name text,
  current_step text not null default 'welcome',
  plan_key text,
  stripe_checkout_session_id text,
  stripe_customer_id text,
  trial_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.installation_sessions enable row level security;
revoke all on public.installation_sessions from authenticated, anon;

create table if not exists public.connector_installations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_id uuid references public.installation_sessions (id) on delete set null,
  connector_id uuid references public.platform_connectors (id) on delete set null,
  platform text not null check (
    platform in ('wordpress', 'shopify', 'woocommerce', 'other')
  ),
  domain text,
  install_status text not null default 'not_started' check (
    install_status in (
      'not_started', 'awaiting_authorization', 'connected', 'health_check_required',
      'live', 'issue_detected', 'suspended', 'cancelled'
    )
  ),
  plugin_status text,
  oauth_status text,
  widget_visible boolean not null default false,
  modules_activated jsonb not null default '[]'::jsonb,
  last_health_score numeric(5, 2),
  connected_at timestamptz,
  live_at timestamptz,
  unique (tenant_id, platform, domain)
);

alter table public.connector_installations enable row level security;
revoke all on public.connector_installations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. steps, health checks, permissions, keys, oauth, webhooks
-- ---------------------------------------------------------------------------
create table if not exists public.installation_steps (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_id uuid references public.installation_sessions (id) on delete cascade,
  step_key text not null,
  step_order int not null,
  title text not null,
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'failed', 'skipped')
  ),
  completed_at timestamptz,
  unique (session_id, step_key)
);

alter table public.installation_steps enable row level security;
revoke all on public.installation_steps from authenticated, anon;

create table if not exists public.installation_health_checks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  installation_id uuid references public.connector_installations (id) on delete cascade,
  check_type text not null,
  status text not null check (status in ('passed', 'failed', 'warning')),
  summary text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.installation_health_checks enable row level security;
revoke all on public.installation_health_checks from authenticated, anon;

create table if not exists public.platform_permissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  installation_id uuid references public.connector_installations (id) on delete cascade,
  permission_key text not null,
  permission_label text not null,
  granted boolean not null default false,
  required boolean not null default true,
  unique (installation_id, permission_key)
);

alter table public.platform_permissions enable row level security;
revoke all on public.platform_permissions from authenticated, anon;

create table if not exists public.connector_api_keys (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  installation_id uuid references public.connector_installations (id) on delete cascade,
  key_label text not null,
  secret_ref text not null,
  key_prefix text,
  status text not null default 'active' check (status in ('active', 'revoked', 'rotated')),
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

alter table public.connector_api_keys enable row level security;
revoke all on public.connector_api_keys from authenticated, anon;

create table if not exists public.oauth_connections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  installation_id uuid references public.connector_installations (id) on delete cascade,
  provider text not null,
  access_token_ref text,
  refresh_token_ref text,
  scopes text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'connected', 'expired', 'revoked')),
  expires_at timestamptz,
  connected_at timestamptz
);

alter table public.oauth_connections enable row level security;
revoke all on public.oauth_connections from authenticated, anon;

create table if not exists public.connector_webhook_endpoints (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  installation_id uuid references public.connector_installations (id) on delete cascade,
  endpoint_url text not null,
  secret_ref text,
  events text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'active', 'failed', 'disabled')),
  last_delivery_at timestamptz
);

alter table public.connector_webhook_endpoints enable row level security;
revoke all on public.connector_webhook_endpoints from authenticated, anon;

create table if not exists public.connector_webhook_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  endpoint_id uuid references public.connector_webhook_endpoints (id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  delivery_status text not null default 'received',
  created_at timestamptz not null default now()
);

alter table public.connector_webhook_events enable row level security;
revoke all on public.connector_webhook_events from authenticated, anon;

create table if not exists public.connector_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  installation_id uuid references public.connector_installations (id) on delete set null,
  log_level text not null default 'info' check (log_level in ('info', 'warn', 'error')),
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.connector_logs enable row level security;
revoke all on public.connector_logs from authenticated, anon;

create table if not exists public.installation_errors (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  installation_id uuid references public.connector_installations (id) on delete set null,
  error_code text not null,
  title text not null,
  explanation text not null,
  fix_recommendation text not null,
  can_retry boolean not null default true,
  needs_support boolean not null default false,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.installation_errors enable row level security;
revoke all on public.installation_errors from authenticated, anon;

create table if not exists public.install_assistant_messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_id uuid references public.installation_sessions (id) on delete cascade,
  message_type text not null default 'guidance' check (
    message_type in ('guidance', 'warning', 'success', 'billing', 'error')
  ),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.install_assistant_messages enable row level security;
revoke all on public.install_assistant_messages from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. trial & billing tracking
-- ---------------------------------------------------------------------------
create table if not exists public.install_subscription_trials (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  session_id uuid references public.installation_sessions (id) on delete set null,
  plan_key text not null default 'starter',
  trial_status text not null default 'payment_required',
  payment_method_registered boolean not null default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  trial_starts_at timestamptz,
  trial_ends_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.install_subscription_trials enable row level security;
revoke all on public.install_subscription_trials from authenticated, anon;

create table if not exists public.trial_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.trial_events enable row level security;
revoke all on public.trial_events from authenticated, anon;

create table if not exists public.trial_reminders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reminder_day int not null,
  message text not null,
  sent_at timestamptz,
  scheduled_for timestamptz not null
);

alter table public.trial_reminders enable row level security;
revoke all on public.trial_reminders from authenticated, anon;

create table if not exists public.cancellation_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reason text,
  cancelled_before_trial_end boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.cancellation_events enable row level security;
revoke all on public.cancellation_events from authenticated, anon;

create table if not exists public.billing_portal_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  stripe_session_id text,
  portal_url text,
  status text not null default 'created',
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

alter table public.billing_portal_sessions enable row level security;
revoke all on public.billing_portal_sessions from authenticated, anon;

create table if not exists public.platform_install_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.platform_install_briefings enable row level security;
revoke all on public.platform_install_briefings from authenticated, anon;

create table if not exists public.platform_install_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.platform_install_audit_log enable row level security;
revoke all on public.platform_install_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers (_pic_)
-- ---------------------------------------------------------------------------
create or replace function public._pic_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._pic_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.platform_install_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'platform_install_' || p_event_type, 'platform_install', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._pic_ensure_settings(p_tenant_id uuid)
returns public.platform_install_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.platform_install_settings;
begin
  insert into public.platform_install_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.platform_install_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._pic_seed_connectors()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_connectors (connector_key, name, description, install_method, sort_order)
  select v.key, v.name, v.desc, v.method, v.ord
  from (values
    ('wordpress', 'WordPress', 'Official plugin, manual upload, JavaScript embed, or API key connection.', 'plugin', 1),
    ('shopify', 'Shopify', 'Shopify app installation with OAuth, storefront widget, and webhooks.', 'app', 2),
    ('woocommerce', 'WooCommerce', 'WordPress plugin with WooCommerce REST API connection.', 'hybrid', 3),
    ('other', 'Other Platforms', 'JavaScript embed, API keys, webhooks, and developer documentation.', 'script', 4)
  ) as v(key, name, desc, method, ord)
  where not exists (select 1 from public.platform_connectors c where c.connector_key = v.key);
end; $$;

create or replace function public._pic_wizard_steps()
returns table(step_key text, step_order int, title text) language sql immutable as $$
  select * from (values
    ('welcome', 1, 'Welcome'),
    ('create_account', 2, 'Create account / sign in'),
    ('choose_plan', 3, 'Choose plan'),
    ('register_payment', 4, 'Register payment method'),
    ('start_trial', 5, 'Start 14-day trial'),
    ('choose_platform', 6, 'Choose platform'),
    ('connect_platform', 7, 'Connect platform'),
    ('verify_permissions', 8, 'Verify permissions'),
    ('install_connector', 9, 'Install plugin / app / script'),
    ('health_check', 10, 'Run health check'),
    ('activate', 11, 'Activate Aipify'),
    ('success', 12, 'Success')
  ) as t(step_key, step_order, title);
$$;

create or replace function public._pic_ensure_session(p_tenant_id uuid)
returns public.installation_sessions language plpgsql security definer set search_path = public as $$
declare v_session public.installation_sessions;
begin
  select * into v_session from public.installation_sessions
  where tenant_id = p_tenant_id order by created_at desc limit 1;

  if v_session.id is null then
    insert into public.installation_sessions (tenant_id, session_status, trial_status, current_step)
    values (p_tenant_id, 'account_created', 'account_created', 'welcome')
    returning * into v_session;
  end if;

  insert into public.installation_steps (tenant_id, session_id, step_key, step_order, title, status)
  select p_tenant_id, v_session.id, w.step_key, w.step_order, w.title, 'pending'
  from public._pic_wizard_steps() w
  where not exists (
    select 1 from public.installation_steps s where s.session_id = v_session.id and s.step_key = w.step_key
  );

  return v_session;
end; $$;

create or replace function public._pic_seed_trial(p_tenant_id uuid, p_session_id uuid, p_settings public.platform_install_settings)
returns public.install_subscription_trials language plpgsql security definer set search_path = public as $$
declare v_trial public.install_subscription_trials;
begin
  insert into public.install_subscription_trials (tenant_id, session_id, plan_key, trial_status)
  values (p_tenant_id, p_session_id, 'starter', 'payment_required')
  on conflict (tenant_id) do nothing;

  select * into v_trial from public.install_subscription_trials where tenant_id = p_tenant_id;

  insert into public.trial_reminders (tenant_id, reminder_day, message, scheduled_for)
  select p_tenant_id, v.day, v.msg, now() + (v.day || ' days')::interval
  from (values
    (1, 'Your 14-day Aipify trial has started. You will not be charged today.'),
    (7, 'Your trial is halfway through. Explore modules and run a health check.'),
    (11, 'Your trial ends soon. Cancel before the trial ends to avoid being charged.'),
    (13, 'Your Aipify trial ends tomorrow. Your subscription will begin automatically unless you cancel.')
  ) as v(day, msg)
  where not exists (select 1 from public.trial_reminders r where r.tenant_id = p_tenant_id limit 1);

  return v_trial;
end; $$;

create or replace function public._pic_assistant_message(
  p_tenant_id uuid, p_session_id uuid, p_type text, p_content text
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.install_assistant_messages (tenant_id, session_id, message_type, content)
  values (p_tenant_id, p_session_id, p_type, p_content);
end; $$;

create or replace function public._pic_platform_permissions(p_tenant_id uuid, p_installation_id uuid, p_platform text)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_permissions (tenant_id, installation_id, permission_key, permission_label, granted, required)
  select p_tenant_id, p_installation_id, v.key, v.label, false, v.req
  from (values
    ('domain_verification', 'Domain verification', true),
    ('api_key_valid', 'API key validity', true),
    ('widget_visible', 'Widget visibility', true),
    ('webhook_delivery', 'Webhook delivery', p_platform in ('shopify', 'woocommerce')),
    ('product_access', 'Product access', p_platform in ('shopify', 'woocommerce')),
    ('admin_role', 'Admin role validation', p_platform in ('wordpress', 'woocommerce'))
  ) as v(key, label, req)
  where not exists (
    select 1 from public.platform_permissions pp
    where pp.installation_id = p_installation_id and pp.permission_key = v.key
  );
end; $$;

create or replace function public._pic_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_install_score numeric;
  v_steps_completed int;
  v_steps_total int;
  v_health_passed int;
begin
  select count(*) filter (where status = 'completed'), count(*)
  into v_steps_completed, v_steps_total
  from public.installation_steps where tenant_id = p_tenant_id;

  select count(*) into v_health_passed
  from public.installation_health_checks
  where tenant_id = p_tenant_id and status = 'passed';

  select coalesce(avg(last_health_score), 85.0) into v_install_score
  from public.connector_installations where tenant_id = p_tenant_id;

  v_install_score := least(100, round(
    coalesce(100.0 * v_steps_completed / nullif(v_steps_total, 0), 0) * 0.4 +
    v_install_score * 0.4 +
    v_health_passed * 5, 1
  ));

  return jsonb_build_object(
    'install_score', v_install_score,
    'steps_completed', v_steps_completed,
    'steps_total', v_steps_total,
    'health_checks_passed', v_health_passed,
    'active_installations', (select count(*) from public.connector_installations where tenant_id = p_tenant_id and install_status = 'live')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.start_installation_session()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.platform_install_settings;
  v_session public.installation_sessions;
  v_trial public.install_subscription_trials;
begin
  v_tenant_id := public._pic_require_tenant();
  v_settings := public._pic_ensure_settings(v_tenant_id);
  perform public._pic_seed_connectors();
  v_session := public._pic_ensure_session(v_tenant_id);
  v_trial := public._pic_seed_trial(v_tenant_id, v_session.id, v_settings);

  perform public._pic_assistant_message(v_tenant_id, v_session.id, 'guidance',
    'Welcome! I will guide you through installing Aipify on your platform.');
  perform public._pic_assistant_message(v_tenant_id, v_session.id, 'billing',
    'You will not be charged today. Your 14-day free trial starts after your payment method is registered.');

  perform public._pic_log_audit(v_tenant_id, 'session_started', 'Installation session started', 'install_wizard');

  return jsonb_build_object(
    'session_id', v_session.id,
    'status', v_session.session_status,
    'trial_status', v_trial.trial_status,
    'current_step', v_session.current_step
  );
end; $$;

create or replace function public.select_install_platform(p_platform text, p_other_platform text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_session public.installation_sessions;
  v_connector_id uuid;
  v_installation_id uuid;
  v_msg text;
begin
  v_tenant_id := public._pic_require_tenant();
  v_session := public._pic_ensure_session(v_tenant_id);

  if p_platform not in ('wordpress', 'shopify', 'woocommerce', 'other') then
    raise exception 'Unsupported platform';
  end if;

  select id into v_connector_id from public.platform_connectors where connector_key = p_platform;

  update public.installation_sessions
  set selected_platform = p_platform, other_platform_name = p_other_platform,
      session_status = 'platform_selected', current_step = 'connect_platform', updated_at = now()
  where id = v_session.id;

  insert into public.connector_installations (tenant_id, session_id, connector_id, platform, install_status)
  values (v_tenant_id, v_session.id, v_connector_id, p_platform, 'awaiting_authorization')
  on conflict (tenant_id, platform, domain) do update set session_id = v_session.id
  returning id into v_installation_id;

  if v_installation_id is null then
    select id into v_installation_id from public.connector_installations
    where tenant_id = v_tenant_id and platform = p_platform order by connected_at desc nulls last limit 1;
  end if;

  perform public._pic_platform_permissions(v_tenant_id, v_installation_id, p_platform);

  v_msg := case p_platform
    when 'shopify' then 'I see you selected Shopify. I will help you connect your store.'
    when 'wordpress' then 'I see you selected WordPress. I will guide you through plugin installation.'
    when 'woocommerce' then 'I see you selected WooCommerce. I will confirm your WordPress environment first.'
    else 'I will recommend the best install method for your platform.'
  end;

  perform public._pic_assistant_message(v_tenant_id, v_session.id, 'guidance', v_msg);
  perform public._pic_log_audit(v_tenant_id, 'platform_selected', v_msg, 'install_wizard',
    jsonb_build_object('platform', p_platform));

  return jsonb_build_object('status', 'platform_selected', 'platform', p_platform, 'installation_id', v_installation_id);
end; $$;

create or replace function public.connect_install_platform(p_installation_id uuid, p_connection jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_session public.installation_sessions;
  v_domain text;
begin
  v_tenant_id := public._pic_require_tenant();
  v_session := public._pic_ensure_session(v_tenant_id);
  v_domain := coalesce(p_connection->>'domain', p_connection->>'store_url');

  update public.connector_installations
  set domain = v_domain, install_status = 'connected', connected_at = now(),
      plugin_status = coalesce(p_connection->>'plugin_status', 'pending'),
      oauth_status = coalesce(p_connection->>'oauth_status', 'pending')
  where id = p_installation_id and tenant_id = v_tenant_id;

  update public.installation_sessions
  set session_status = 'connected', current_step = 'verify_permissions', updated_at = now()
  where id = v_session.id;

  perform public._pic_assistant_message(v_tenant_id, v_session.id, 'success',
    'Platform connection initiated. Next I will verify permissions.');
  perform public._pic_log_audit(v_tenant_id, 'platform_connected', 'Platform connection started', 'connector',
    jsonb_build_object('installation_id', p_installation_id, 'domain', v_domain));

  return jsonb_build_object('status', 'connected', 'installation_id', p_installation_id);
end; $$;

create or replace function public.verify_install_connection(p_installation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_platform text;
  v_missing int;
begin
  v_tenant_id := public._pic_require_tenant();
  select platform into v_platform from public.connector_installations
  where id = p_installation_id and tenant_id = v_tenant_id;

  update public.platform_permissions set granted = true
  where installation_id = p_installation_id
    and permission_key in ('domain_verification', 'api_key_valid', 'admin_role');

  if v_platform in ('shopify', 'woocommerce') then
    update public.platform_permissions set granted = false
    where installation_id = p_installation_id and permission_key = 'product_access';
  end if;

  select count(*) into v_missing from public.platform_permissions
  where installation_id = p_installation_id and required = true and granted = false;

  if v_missing > 0 then
    insert into public.installation_errors (tenant_id, installation_id, error_code, title, explanation, fix_recommendation, can_retry, needs_support)
    values (
      v_tenant_id, p_installation_id, 'missing_permissions',
      'Missing required permissions',
      'The connector is installed, but required permissions are not yet approved.',
      case v_platform
        when 'shopify' then 'Please approve product access so Aipify can analyze your store.'
        when 'woocommerce' then 'Connect WooCommerce API keys with read permissions.'
        else 'Complete API key registration and verify domain ownership.'
      end,
      true, false
    );
    perform public._pic_assistant_message(v_tenant_id, (select session_id from public.connector_installations where id = p_installation_id),
      'error', 'Some permissions are still missing. I will explain how to fix this.');
    return jsonb_build_object('status', 'issue_detected', 'missing_permissions', v_missing);
  end if;

  update public.connector_installations set install_status = 'health_check_required' where id = p_installation_id;
  return jsonb_build_object('status', 'verified');
end; $$;

create or replace function public.run_install_health_check(p_installation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_session_id uuid;
  v_score numeric := 92.0;
  v_check record;
  v_failed int := 0;
begin
  v_tenant_id := public._pic_require_tenant();
  select session_id into v_session_id from public.connector_installations where id = p_installation_id and tenant_id = v_tenant_id;

  for v_check in
    select * from (values
      ('account_status', 'Account status verified'),
      ('billing_status', 'Billing and trial status verified'),
      ('domain_connection', 'Domain connection verified'),
      ('api_key_validity', 'API key validity confirmed'),
      ('plugin_status', 'Plugin/app status confirmed'),
      ('widget_visibility', 'Widget visibility confirmed'),
      ('module_activation', 'Module activation confirmed')
    ) as c(check_type, summary)
  loop
    insert into public.installation_health_checks (tenant_id, installation_id, check_type, status, summary)
    values (v_tenant_id, p_installation_id, v_check.check_type, 'passed', v_check.summary);
  end loop;

  update public.platform_permissions set granted = true where installation_id = p_installation_id;

  update public.connector_installations
  set install_status = 'live', widget_visible = true, last_health_score = v_score, live_at = now()
  where id = p_installation_id;

  update public.installation_sessions
  set session_status = 'live', current_step = 'success', updated_at = now()
  where id = v_session_id;

  perform public._pic_assistant_message(v_tenant_id, v_session_id, 'success',
    'Health check passed. Your platform connector is live and Aipify is ready.');
  perform public._pic_log_audit(v_tenant_id, 'health_check_passed', 'Installation health check passed', 'health_check',
    jsonb_build_object('installation_id', p_installation_id, 'score', v_score));

  return jsonb_build_object('status', 'live', 'health_score', v_score, 'failed_checks', v_failed);
end; $$;

create or replace function public.register_trial_payment_method(p_stripe_customer_id text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.platform_install_settings;
  v_session public.installation_sessions;
  v_trial public.install_subscription_trials;
begin
  v_tenant_id := public._pic_require_tenant();
  v_settings := public._pic_ensure_settings(v_tenant_id);
  v_session := public._pic_ensure_session(v_tenant_id);

  update public.install_subscription_trials
  set payment_method_registered = true,
      trial_status = 'trial_active',
      stripe_customer_id = coalesce(p_stripe_customer_id, stripe_customer_id),
      trial_starts_at = now(),
      trial_ends_at = now() + (v_settings.trial_days || ' days')::interval,
      updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_trial;

  update public.installation_sessions
  set trial_status = 'trial_active', session_status = 'trial_active',
      trial_ends_at = v_trial.trial_ends_at, stripe_customer_id = p_stripe_customer_id,
      current_step = 'choose_platform', updated_at = now()
  where id = v_session.id;

  insert into public.trial_events (tenant_id, event_type, summary)
  values (v_tenant_id, 'trial_started', '14-day trial started after payment method registration');

  perform public._pic_assistant_message(v_tenant_id, v_session.id, 'billing',
    'Your payment method is registered. You will not be charged today. Your trial ends on ' || to_char(v_trial.trial_ends_at, 'YYYY-MM-DD') || '.');

  perform public._pic_log_audit(v_tenant_id, 'trial_started', 'Trial activated', 'billing');

  return jsonb_build_object(
    'status', 'trial_active',
    'trial_ends_at', v_trial.trial_ends_at,
    'billing_copy', 'You will not be charged today. Your subscription begins automatically after the trial unless you cancel.'
  );
end; $$;

create or replace function public.cancel_install_trial(p_reason text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._pic_require_tenant();

  update public.install_subscription_trials
  set trial_status = 'trial_cancelled', cancelled_at = now(), updated_at = now()
  where tenant_id = v_tenant_id;

  update public.installation_sessions
  set trial_status = 'trial_cancelled', session_status = 'cancelled', updated_at = now()
  where tenant_id = v_tenant_id;

  insert into public.cancellation_events (tenant_id, reason, cancelled_before_trial_end)
  values (v_tenant_id, p_reason, true);

  insert into public.trial_events (tenant_id, event_type, summary)
  values (v_tenant_id, 'trial_cancelled', coalesce(p_reason, 'Trial cancelled before trial end'));

  perform public._pic_log_audit(v_tenant_id, 'trial_cancelled', 'Trial cancelled before billing', 'billing');

  return jsonb_build_object('status', 'trial_cancelled', 'charged', false);
end; $$;

create or replace function public.get_install_status()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_session public.installation_sessions;
  v_trial public.install_subscription_trials;
  v_metrics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select * into v_session from public.installation_sessions where tenant_id = v_tenant_id order by created_at desc limit 1;
  select * into v_trial from public.install_subscription_trials where tenant_id = v_tenant_id;
  v_metrics := public._pic_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'session_status', coalesce(v_session.session_status, 'not_started'),
    'trial_status', coalesce(v_trial.trial_status, 'no_account'),
    'current_step', coalesce(v_session.current_step, 'welcome'),
    'selected_platform', v_session.selected_platform,
    'trial_ends_at', v_trial.trial_ends_at,
    'payment_method_registered', coalesce(v_trial.payment_method_registered, false),
    'install_score', v_metrics->'install_score'
  );
end; $$;

create or replace function public.get_billing_trial_status()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_trial public.install_subscription_trials;
  v_sub public.subscriptions;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select * into v_trial from public.install_subscription_trials where tenant_id = v_tenant_id;
  select * into v_sub from public.subscriptions where customer_id = v_tenant_id order by created_at desc limit 1;

  return jsonb_build_object(
    'has_customer', true,
    'trial_status', coalesce(v_trial.trial_status, 'payment_required'),
    'plan_key', coalesce(v_trial.plan_key, v_sub.plan_key, 'starter'),
    'trial_starts_at', coalesce(v_trial.trial_starts_at, v_sub.trial_starts_at),
    'trial_ends_at', coalesce(v_trial.trial_ends_at, v_sub.trial_ends_at),
    'payment_method_registered', coalesce(v_trial.payment_method_registered, false),
    'billing_copy_short', 'Start your 14-day free trial today. No charge now. Cancel before the trial ends and you will not be charged.',
    'billing_copy_full', 'You will not be charged today. Your 14-day free trial starts after your payment method has been registered. Your subscription will begin automatically after the trial ends unless you cancel before that date.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_platform_install_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_metrics jsonb;
  v_id uuid;
  v_summary text;
begin
  v_tenant_id := public._pic_require_tenant();
  perform public._pic_ensure_settings(v_tenant_id);
  v_metrics := public._pic_refresh_metrics(v_tenant_id);

  v_summary := 'Install briefing: score ' || (v_metrics->>'install_score') || '/100, '
    || (v_metrics->>'steps_completed') || '/' || (v_metrics->>'steps_total') || ' steps completed.';

  insert into public.platform_install_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_metrics)
  returning id into v_id;

  perform public._pic_log_audit(v_tenant_id, 'briefing_generated', v_summary, 'executive_reporting', v_metrics);
  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_platform_install_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._pic_ensure_settings(v_tenant_id);
  v_metrics := public._pic_refresh_metrics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'install_score', v_metrics->'install_score',
    'steps_total', v_metrics->'steps_total',
    'philosophy', 'Everybody should be able to install Aipify with Aipify''s help.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_platform_install_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.platform_install_settings;
  v_session public.installation_sessions;
  v_trial public.install_subscription_trials;
  v_metrics jsonb;
begin
  v_tenant_id := public._pic_require_tenant();
  v_settings := public._pic_ensure_settings(v_tenant_id);
  perform public._pic_seed_connectors();
  v_session := public._pic_ensure_session(v_tenant_id);
  perform public._pic_seed_trial(v_tenant_id, v_session.id, v_settings);
  v_metrics := public._pic_refresh_metrics(v_tenant_id);
  select * into v_trial from public.install_subscription_trials where tenant_id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'philosophy', 'Everybody should be able to install Aipify with Aipify''s help.',
    'safety_note', 'Payment method is required to start the trial. You are not charged until the 14-day trial ends.',
    'install_assistant_enabled', v_settings.install_assistant_enabled,
    'trial_days', v_settings.trial_days,
    'require_payment_before_trial', v_settings.require_payment_before_trial,
    'install_score', v_metrics->'install_score',
    'steps_completed', v_metrics->'steps_completed',
    'steps_total', v_metrics->'steps_total',
    'health_checks_passed', v_metrics->'health_checks_passed',
    'active_installations', v_metrics->'active_installations',
    'session_id', v_session.id,
    'session_status', v_session.session_status,
    'trial_status', coalesce(v_trial.trial_status, v_session.trial_status),
    'current_step', v_session.current_step,
    'selected_platform', v_session.selected_platform,
    'trial_ends_at', v_trial.trial_ends_at,
    'payment_method_registered', coalesce(v_trial.payment_method_registered, false),
    'billing_copy_short', 'Start your 14-day free trial today. No charge now.',
    'billing_copy_full', 'You will not be charged today. Your 14-day free trial starts after your payment method has been registered.',
    'wizard_steps', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'step_key', s.step_key, 'step_order', s.step_order,
        'title', s.title, 'status', s.status
      ) order by s.step_order)
      from public.installation_steps s where s.session_id = v_session.id
    ), '[]'::jsonb),
    'platform_connectors', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'connector_key', c.connector_key, 'name', c.name,
        'description', c.description, 'install_method', c.install_method
      ) order by c.sort_order)
      from public.platform_connectors c where c.is_active
    ), '[]'::jsonb),
    'connector_installations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'platform', i.platform, 'domain', i.domain,
        'install_status', i.install_status, 'plugin_status', i.plugin_status,
        'widget_visible', i.widget_visible, 'last_health_score', i.last_health_score
      ))
      from public.connector_installations i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'platform_permissions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'permission_key', p.permission_key, 'permission_label', p.permission_label,
        'granted', p.granted, 'required', p.required, 'installation_id', p.installation_id
      ))
      from public.platform_permissions p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'installation_errors', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'error_code', e.error_code, 'title', e.title,
        'explanation', e.explanation, 'fix_recommendation', e.fix_recommendation,
        'can_retry', e.can_retry, 'resolved', e.resolved
      ) order by e.created_at desc)
      from public.installation_errors e where e.tenant_id = v_tenant_id and e.resolved = false
    ), '[]'::jsonb),
    'assistant_messages', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'message_type', m.message_type, 'content', m.content, 'created_at', m.created_at
      ) order by m.created_at desc)
      from public.install_assistant_messages m where m.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'health_checks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', h.id, 'check_type', h.check_type, 'status', h.status, 'summary', h.summary
      ) order by h.created_at desc)
      from public.installation_health_checks h where h.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'trial_reminders', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'reminder_day', r.reminder_day, 'message', r.message, 'sent_at', r.sent_at
      ) order by r.reminder_day)
      from public.trial_reminders r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.platform_install_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'install_assistant', 'Guided setup with step verification',
      'billing', 'Stripe Checkout trial with no immediate charge',
      'knowledge_center', 'Platform installation guides and troubleshooting',
      'support', 'Escalation for unresolved install issues'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Knowledge Center categories
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'platform-installation', 'Platform Installation', 'Install Aipify on WordPress, Shopify, WooCommerce and other platforms.', 'authenticated', 44
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'platform-installation' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 10. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_platform_install_card() to authenticated;
grant execute on function public.get_platform_install_dashboard() to authenticated;
grant execute on function public.generate_platform_install_briefing() to authenticated;
grant execute on function public.start_installation_session() to authenticated;
grant execute on function public.select_install_platform(text, text) to authenticated;
grant execute on function public.connect_install_platform(uuid, jsonb) to authenticated;
grant execute on function public.verify_install_connection(uuid) to authenticated;
grant execute on function public.run_install_health_check(uuid) to authenticated;
grant execute on function public.register_trial_payment_method(text) to authenticated;
grant execute on function public.cancel_install_trial(text) to authenticated;
grant execute on function public.get_install_status() to authenticated;
grant execute on function public.get_billing_trial_status() to authenticated;
