-- Phase 53 — Adaptive Automation Layer (AAL)

-- ---------------------------------------------------------------------------
-- 1. aipify_automation_templates
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_automation_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  template_key text not null,
  template_name text not null,
  category text not null default 'internal' check (
    category in (
      'support', 'ecommerce', 'onboarding', 'moderation', 'admin', 'sales',
      'marketing', 'finance', 'internal', 'reminders', 'integrations'
    )
  ),
  description text,
  trigger_definition jsonb not null default '{}'::jsonb,
  condition_definition jsonb not null default '{}'::jsonb,
  action_definition jsonb not null default '{}'::jsonb,
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'blocked')
  ),
  required_permissions jsonb not null default '[]'::jsonb,
  default_enabled boolean not null default false,
  version int not null default 1,
  is_global boolean not null default false,
  created_by text not null default 'system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists aipify_automation_templates_global_key_idx
  on public.aipify_automation_templates (template_key)
  where tenant_id is null and is_global;

create unique index if not exists aipify_automation_templates_tenant_key_idx
  on public.aipify_automation_templates (tenant_id, template_key)
  where tenant_id is not null;

alter table public.aipify_automation_templates enable row level security;
revoke all on public.aipify_automation_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_automation_suggestions
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_automation_suggestions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  suggestion_type text not null check (
    suggestion_type in (
      'repeated_support_question', 'delayed_queue', 'repeated_admin_task',
      'onboarding_pattern', 'customer_followup_pattern', 'sla_risk',
      'moderation_pattern', 'ecommerce_followup', 'insight_derived', 'prediction_derived'
    )
  ),
  title text not null,
  summary text not null,
  evidence jsonb not null default '{}'::jsonb,
  estimated_time_saved_minutes_per_week int,
  estimated_monthly_value numeric(12, 2),
  confidence_score numeric(4, 2) not null default 0.7,
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'blocked')
  ),
  recommended_template_id uuid references public.aipify_automation_templates (id) on delete set null,
  generated_flow_draft jsonb not null default '{}'::jsonb,
  source_insight_id uuid,
  source_prediction_id uuid,
  status text not null default 'open' check (
    status in ('open', 'reviewing', 'approved', 'rejected', 'dismissed', 'snoozed', 'converted')
  ),
  assigned_user_id uuid references public.users (id) on delete set null,
  snoozed_until timestamptz,
  reviewed_by_user_id uuid references public.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_automation_suggestions_tenant_status_idx
  on public.aipify_automation_suggestions (tenant_id, status);

alter table public.aipify_automation_suggestions enable row level security;
revoke all on public.aipify_automation_suggestions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aipify_automations
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_automations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  name text not null,
  automation_key text not null,
  description text,
  category text not null default 'internal',
  template_id uuid references public.aipify_automation_templates (id) on delete set null,
  suggestion_id uuid references public.aipify_automation_suggestions (id) on delete set null,
  status text not null default 'draft' check (
    status in ('draft', 'pending_approval', 'active', 'paused', 'disabled', 'archived', 'failed')
  ),
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'blocked')
  ),
  trigger_definition jsonb not null default '{}'::jsonb,
  condition_definition jsonb not null default '{}'::jsonb,
  action_definition jsonb not null default '{}'::jsonb,
  approval_policy jsonb not null default '{"require_on_enable": true}'::jsonb,
  execution_policy jsonb not null default '{"max_per_day": 20}'::jsonb,
  owner_user_id uuid references public.users (id) on delete set null,
  owner_unit_id uuid,
  created_by_user_id uuid references public.users (id) on delete set null,
  created_by_ai boolean not null default false,
  enabled_at timestamptz,
  last_run_at timestamptz,
  next_run_at timestamptz,
  version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, automation_key)
);

create index if not exists aipify_automations_tenant_status_idx
  on public.aipify_automations (tenant_id, status);

alter table public.aipify_automations enable row level security;
revoke all on public.aipify_automations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. aipify_automation_approvals
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_automation_approvals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  automation_id uuid references public.aipify_automations (id) on delete cascade,
  suggestion_id uuid references public.aipify_automation_suggestions (id) on delete set null,
  approval_type text not null check (
    approval_type in (
      'create_automation', 'enable_automation', 'execute_once',
      'trust_medium_risk', 'edit_automation', 'disable_automation'
    )
  ),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'expired', 'cancelled')
  ),
  requested_by_user_id uuid references public.users (id) on delete set null,
  requested_by_ai boolean not null default false,
  approved_by_user_id uuid references public.users (id) on delete set null,
  approved_at timestamptz,
  rejection_reason text,
  approval_context jsonb not null default '{}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_automation_approvals_tenant_idx
  on public.aipify_automation_approvals (tenant_id, status);

alter table public.aipify_automation_approvals enable row level security;
revoke all on public.aipify_automation_approvals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. aipify_automation_executions
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_automation_executions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  automation_id uuid not null references public.aipify_automations (id) on delete cascade,
  trigger_source_type text,
  trigger_source_id text,
  status text not null default 'queued' check (
    status in ('queued', 'running', 'success', 'partial_success', 'failed', 'skipped', 'waiting_approval')
  ),
  result_summary text,
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,
  error_message text,
  risk_level_at_execution text,
  required_approval_id uuid references public.aipify_automation_approvals (id) on delete set null,
  started_at timestamptz,
  completed_at timestamptz,
  duration_ms int,
  created_at timestamptz not null default now()
);

create index if not exists aipify_automation_executions_tenant_idx
  on public.aipify_automation_executions (tenant_id, automation_id, created_at desc);

alter table public.aipify_automation_executions enable row level security;
revoke all on public.aipify_automation_executions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. aipify_automation_execution_steps
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_automation_execution_steps (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  execution_id uuid not null references public.aipify_automation_executions (id) on delete cascade,
  automation_id uuid not null references public.aipify_automations (id) on delete cascade,
  step_order int not null,
  step_type text not null check (
    step_type in (
      'trigger', 'condition', 'action', 'approval', 'notification',
      'integration_call', 'ai_draft', 'audit'
    )
  ),
  step_name text not null,
  status text not null default 'pending' check (
    status in ('pending', 'running', 'success', 'failed', 'skipped', 'waiting_approval')
  ),
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists aipify_automation_execution_steps_exec_idx
  on public.aipify_automation_execution_steps (execution_id, step_order);

alter table public.aipify_automation_execution_steps enable row level security;
revoke all on public.aipify_automation_execution_steps from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. aipify_automation_metrics
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_automation_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  automation_id uuid not null references public.aipify_automations (id) on delete cascade,
  period_start date not null,
  period_end date not null,
  executions_count int not null default 0,
  success_count int not null default 0,
  failure_count int not null default 0,
  skipped_count int not null default 0,
  approvals_required_count int not null default 0,
  estimated_time_saved_minutes int not null default 0,
  estimated_value numeric(12, 2),
  error_rate numeric(5, 4) not null default 0,
  last_calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (tenant_id, automation_id, period_start, period_end)
);

alter table public.aipify_automation_metrics enable row level security;
revoke all on public.aipify_automation_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. aipify_automation_settings
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_automation_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default false,
  allow_automation_discovery boolean not null default true,
  allow_ai_generated_drafts boolean not null default true,
  allow_low_risk_auto_execution boolean not null default false,
  require_approval_for_medium_risk boolean not null default true,
  require_approval_for_high_risk boolean not null default true,
  max_daily_executions int not null default 100,
  max_external_messages_per_day int not null default 25,
  enable_value_estimation boolean not null default true,
  notification_channel text not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_automation_settings enable row level security;
revoke all on public.aipify_automation_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. aipify_automation_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_automation_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  actor_type text not null check (actor_type in ('user', 'aipify', 'system', 'integration')),
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists aipify_automation_audit_log_tenant_idx
  on public.aipify_automation_audit_log (tenant_id, created_at desc);

alter table public.aipify_automation_audit_log enable row level security;
revoke all on public.aipify_automation_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._aal_tenant_plan(p_tenant_id uuid)
returns text
language sql stable security definer set search_path = public
as $$
  select coalesce(s.plan_key, s.plan_type, 'starter')
  from public.subscriptions s where s.customer_id = p_tenant_id limit 1;
$$;

create or replace function public._aal_package_allows(p_tenant_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public._aal_tenant_plan(p_tenant_id) in ('business', 'enterprise');
$$;

create or replace function public._aal_user_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select u.id from public.users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._aal_user_role()
returns text
language sql stable security definer set search_path = public
as $$
  select coalesce(u.role, 'staff') from public.users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._aal_require_admin()
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if public._aal_user_role() not in ('owner', 'admin') then
    raise exception 'Admin access required';
  end if;
end;
$$;

create or replace function public._aal_log_audit(
  p_tenant_id uuid, p_actor_type text, p_action text,
  p_target_type text default null, p_target_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.aipify_automation_audit_log (
    tenant_id, actor_type, actor_user_id, action, target_type, target_id, metadata
  )
  values (
    p_tenant_id, p_actor_type,
    case when p_actor_type = 'user' then public._aal_user_id() else null end,
    p_action, p_target_type, p_target_id, coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

create or replace function public.ensure_aal_automation_settings(p_tenant_id uuid)
returns public.aipify_automation_settings
language plpgsql security definer set search_path = public
as $$
declare v_row public.aipify_automation_settings;
begin
  insert into public.aipify_automation_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_automation_settings where tenant_id = p_tenant_id;
  return v_row;
end;
$$;

create or replace function public.seed_aal_global_templates()
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.aipify_automation_templates where template_key = 'aipify_support_faq_flow' and is_global) then
    insert into public.aipify_automation_templates (
      tenant_id, template_key, template_name, category, description,
      trigger_definition, condition_definition, action_definition, risk_level, is_global, created_by
    ) values (
      null, 'aipify_support_faq_flow', 'Support FAQ Flow', 'support',
      'Respond to repeated support questions with approved FAQ templates.',
      '{"type": "support_ticket_created"}'::jsonb, '{"match_category": true}'::jsonb,
      '{"actions": [{"type": "tag_ticket"}, {"type": "draft_email"}, {"type": "create_support_note"}]}'::jsonb,
      'low', true, 'system'
    );
  end if;

  if not exists (select 1 from public.aipify_automation_templates where template_key = 'aipify_verification_reminder_flow' and is_global) then
    insert into public.aipify_automation_templates (
      tenant_id, template_key, template_name, category, description,
      trigger_definition, condition_definition, action_definition, risk_level, is_global, created_by
    ) values (
      null, 'aipify_verification_reminder_flow', 'Verification Reminder Flow', 'onboarding',
      'Remind users who started verification but did not complete.',
      '{"type": "workflow_event", "event_type": "created"}'::jsonb, '{"hours_since_start": 24}'::jsonb,
      '{"actions": [{"type": "send_internal_notification"}, {"type": "create_task"}]}'::jsonb,
      'low', true, 'system'
    );
  end if;

  if not exists (select 1 from public.aipify_automation_templates where template_key = 'aipify_digital_approval_queue_reminder' and is_global) then
    insert into public.aipify_automation_templates (
      tenant_id, template_key, template_name, category, description,
      trigger_definition, condition_definition, action_definition, risk_level, is_global, created_by
    ) values (
      null, 'aipify_digital_approval_queue_reminder', 'Digital Approval Queue Reminder', 'moderation',
      'Notify moderators when digital products wait too long for approval.',
      '{"type": "workflow_event", "workflow_key": "digital_approval"}'::jsonb, '{"pending_hours": 24}'::jsonb,
      '{"actions": [{"type": "notify_admin"}, {"type": "create_task"}]}'::jsonb,
      'low', true, 'system'
    );
  end if;

  if not exists (select 1 from public.aipify_automation_templates where template_key = 'aipify_birthday_reminder_flow' and is_global) then
    insert into public.aipify_automation_templates (
      tenant_id, template_key, template_name, category, description,
      trigger_definition, condition_definition, action_definition, risk_level, is_global, created_by
    ) values (
      null, 'aipify_birthday_reminder_flow', 'Birthday Reminder Flow', 'reminders',
      'Remind relevant users about upcoming member birthdays.',
      '{"type": "schedule", "cron": "0 8 * * *"}'::jsonb, '{"days_before": 14}'::jsonb,
      '{"actions": [{"type": "send_internal_notification"}]}'::jsonb,
      'low', true, 'system'
    );
  end if;

  if not exists (select 1 from public.aipify_automation_templates where template_key = 'aipify_shopify_order_followup_flow' and is_global) then
    insert into public.aipify_automation_templates (
      tenant_id, template_key, template_name, category, description,
      trigger_definition, condition_definition, action_definition, risk_level, is_global, created_by
    ) values (
      null, 'aipify_shopify_order_followup_flow', 'Shopify Order Follow-up Flow', 'ecommerce',
      'Follow up on delayed orders or customer order questions.',
      '{"type": "integration_event", "source": "shopify"}'::jsonb, '{"delay_days": 3}'::jsonb,
      '{"actions": [{"type": "draft_email"}, {"type": "create_support_case"}]}'::jsonb,
      'medium', true, 'system'
    );
  end if;

  if not exists (select 1 from public.aipify_automation_templates where template_key = 'aipify_lead_followup_flow' and is_global) then
    insert into public.aipify_automation_templates (
      tenant_id, template_key, template_name, category, description,
      trigger_definition, condition_definition, action_definition, risk_level, is_global, created_by
    ) values (
      null, 'aipify_lead_followup_flow', 'Lead Follow-up Flow', 'sales',
      'Create tasks and draft emails when leads lack follow-up.',
      '{"type": "workflow_event", "workflow_key": "lead_followup"}'::jsonb, '{"hours_without_activity": 48}'::jsonb,
      '{"actions": [{"type": "create_task"}, {"type": "draft_email"}, {"type": "notify_admin"}]}'::jsonb,
      'medium', true, 'system'
    );
  end if;

  if not exists (select 1 from public.aipify_automation_templates where template_key = 'aipify_customer_onboarding_flow' and is_global) then
    insert into public.aipify_automation_templates (
      tenant_id, template_key, template_name, category, description,
      trigger_definition, condition_definition, action_definition, risk_level, is_global, created_by
    ) values (
      null, 'aipify_customer_onboarding_flow', 'Customer Onboarding Flow', 'onboarding',
      'Guide new customers through setup with checklist and reminders.',
      '{"type": "workflow_event", "workflow_key": "customer_onboarding"}'::jsonb, '{"setup_incomplete": true}'::jsonb,
      '{"actions": [{"type": "create_task"}, {"type": "send_internal_notification"}, {"type": "notify_admin"}]}'::jsonb,
      'low', true, 'system'
    );
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. Settings RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_automation_settings()
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_automation_settings;
  v_plan text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_plan := public._aal_tenant_plan(v_tenant_id);

  if not public._aal_package_allows(v_tenant_id) then
    return jsonb_build_object('has_customer', true, 'has_access', false, 'upgrade_required', true, 'plan', v_plan);
  end if;

  perform public._aal_require_admin();
  perform public.seed_aal_global_templates();
  v_settings := public.ensure_aal_automation_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true, 'has_access', true, 'upgrade_required', false, 'plan', v_plan,
    'settings', jsonb_build_object(
      'enabled', v_settings.enabled,
      'allow_automation_discovery', v_settings.allow_automation_discovery,
      'allow_ai_generated_drafts', v_settings.allow_ai_generated_drafts,
      'allow_low_risk_auto_execution', v_settings.allow_low_risk_auto_execution,
      'require_approval_for_medium_risk', v_settings.require_approval_for_medium_risk,
      'require_approval_for_high_risk', v_settings.require_approval_for_high_risk,
      'max_daily_executions', v_settings.max_daily_executions,
      'max_external_messages_per_day', v_settings.max_external_messages_per_day,
      'enable_value_estimation', v_settings.enable_value_estimation,
      'notification_channel', v_settings.notification_channel
    )
  );
end;
$$;

create or replace function public.update_automation_settings(p_patch jsonb)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_tenant_id uuid; v_settings public.aipify_automation_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  if not public._aal_package_allows(v_tenant_id) then raise exception 'Upgrade required'; end if;
  perform public._aal_require_admin();
  v_settings := public.ensure_aal_automation_settings(v_tenant_id);

  update public.aipify_automation_settings s set
    enabled = coalesce((p_patch->>'enabled')::boolean, s.enabled),
    allow_automation_discovery = coalesce((p_patch->>'allow_automation_discovery')::boolean, s.allow_automation_discovery),
    allow_ai_generated_drafts = coalesce((p_patch->>'allow_ai_generated_drafts')::boolean, s.allow_ai_generated_drafts),
    allow_low_risk_auto_execution = coalesce((p_patch->>'allow_low_risk_auto_execution')::boolean, s.allow_low_risk_auto_execution),
    require_approval_for_medium_risk = coalesce((p_patch->>'require_approval_for_medium_risk')::boolean, s.require_approval_for_medium_risk),
    require_approval_for_high_risk = coalesce((p_patch->>'require_approval_for_high_risk')::boolean, s.require_approval_for_high_risk),
    max_daily_executions = coalesce((p_patch->>'max_daily_executions')::int, s.max_daily_executions),
    max_external_messages_per_day = coalesce((p_patch->>'max_external_messages_per_day')::int, s.max_external_messages_per_day),
    enable_value_estimation = coalesce((p_patch->>'enable_value_estimation')::boolean, s.enable_value_estimation),
    notification_channel = coalesce(p_patch->>'notification_channel', s.notification_channel),
    updated_at = now()
  where s.tenant_id = v_tenant_id returning * into v_settings;

  perform public._aal_log_audit(v_tenant_id, 'user', 'update_automation_settings', 'automation_settings', v_settings.id, p_patch);
  return public.get_automation_settings();
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. Discovery
-- ---------------------------------------------------------------------------
create or replace function public._aal_template_id_by_key(p_key text)
returns uuid
language sql stable security definer set search_path = public
as $$
  select id from public.aipify_automation_templates
  where template_key = p_key and is_global limit 1;
$$;

create or replace function public.discover_automation_opportunities_for_tenant(p_tenant_id uuid)
returns int
language plpgsql security definer set search_path = public
as $$
declare
  v_count int := 0;
  v_settings public.aipify_automation_settings;
  v_events int;
  v_delayed int;
  r record;
begin
  select * into v_settings from public.aipify_automation_settings where tenant_id = p_tenant_id;
  if v_settings.id is null or not v_settings.enabled or not v_settings.allow_automation_discovery then
    return 0;
  end if;

  perform public.seed_aal_global_templates();

  select count(*) into v_events
  from public.aipify_workflow_events e
  where e.tenant_id = p_tenant_id and e.occurred_at > now() - interval '7 days';

  if v_events >= 20 and not exists (
    select 1 from public.aipify_automation_suggestions s
    where s.tenant_id = p_tenant_id and s.suggestion_type = 'repeated_support_question'
      and s.status in ('open', 'reviewing') and s.created_at > now() - interval '48 hours'
  ) then
    insert into public.aipify_automation_suggestions (
      tenant_id, suggestion_type, title, summary, evidence,
      estimated_time_saved_minutes_per_week, confidence_score, risk_level,
      recommended_template_id, generated_flow_draft
    ) values (
      p_tenant_id, 'repeated_support_question',
      'Automate verification support questions',
      'Similar support workflow activity appears frequently. A safe FAQ automation may save manual response time.',
      jsonb_build_object('workflow_events_7d', v_events, 'method', 'frequency_threshold'),
      420, 0.75, 'low',
      public._aal_template_id_by_key('aipify_support_faq_flow'),
      jsonb_build_object('template_key', 'aipify_support_faq_flow')
    );
    v_count := v_count + 1;
  end if;

  select count(*) into v_delayed
  from public.aipify_workflow_events e
  where e.tenant_id = p_tenant_id and e.event_type = 'delayed'
    and e.occurred_at > now() - interval '14 days';

  if v_delayed >= 5 and not exists (
    select 1 from public.aipify_automation_suggestions s
    where s.tenant_id = p_tenant_id and s.suggestion_type = 'delayed_queue'
      and s.status in ('open', 'reviewing') and s.created_at > now() - interval '48 hours'
  ) then
    insert into public.aipify_automation_suggestions (
      tenant_id, suggestion_type, title, summary, evidence,
      estimated_time_saved_minutes_per_week, confidence_score, risk_level,
      recommended_template_id, generated_flow_draft
    ) values (
      p_tenant_id, 'delayed_queue',
      'Digital product approvals are repeatedly delayed',
      format('%s delayed workflow events in the last 14 days suggest a queue reminder automation may help.', v_delayed),
      jsonb_build_object('delayed_events', v_delayed),
      180, 0.72, 'low',
      public._aal_template_id_by_key('aipify_digital_approval_queue_reminder'),
      jsonb_build_object('template_key', 'aipify_digital_approval_queue_reminder')
    );
    v_count := v_count + 1;
  end if;

  for r in
    select i.id, i.title, i.summary, i.insight_type
    from public.aipify_insight_items i
    where i.tenant_id = p_tenant_id
      and i.insight_type in ('automation_suggestion', 'bottleneck', 'forgotten_task')
      and i.status in ('open', 'acknowledged')
      and i.created_at > now() - interval '7 days'
  loop
    if not exists (
      select 1 from public.aipify_automation_suggestions s
      where s.tenant_id = p_tenant_id and s.source_insight_id = r.id
    ) then
      insert into public.aipify_automation_suggestions (
        tenant_id, suggestion_type, title, summary, evidence,
        estimated_time_saved_minutes_per_week, confidence_score, risk_level,
        source_insight_id, recommended_template_id
      ) values (
        p_tenant_id, 'insight_derived', r.title, r.summary,
        jsonb_build_object('insight_type', r.insight_type),
        120, 0.7, 'medium', r.id,
        public._aal_template_id_by_key('aipify_support_faq_flow')
      );
      v_count := v_count + 1;
    end if;
  end loop;

  for r in
    select a.id, a.title, a.summary, a.alert_type
    from public.aipify_predictive_alerts a
    where a.tenant_id = p_tenant_id
      and a.alert_type in ('sla_risk', 'future_bottleneck', 'followup_risk')
      and a.status in ('open', 'acknowledged')
      and a.created_at > now() - interval '7 days'
  loop
    if not exists (
      select 1 from public.aipify_automation_suggestions s
      where s.tenant_id = p_tenant_id and s.source_prediction_id = r.id
    ) then
      insert into public.aipify_automation_suggestions (
        tenant_id, suggestion_type, title, summary, evidence,
        estimated_time_saved_minutes_per_week, confidence_score, risk_level,
        source_prediction_id,
        recommended_template_id
      ) values (
        p_tenant_id, 'prediction_derived',
        format('Prevent: %s', r.title), r.summary,
        jsonb_build_object('alert_type', r.alert_type),
        case r.alert_type when 'sla_risk' then 240 else 180 end,
        0.68,
        case r.alert_type when 'sla_risk' then 'medium' else 'low' end,
        r.id,
        case r.alert_type
          when 'sla_risk' then public._aal_template_id_by_key('aipify_support_faq_flow')
          when 'followup_risk' then public._aal_template_id_by_key('aipify_lead_followup_flow')
          else public._aal_template_id_by_key('aipify_digital_approval_queue_reminder')
        end
      );
      v_count := v_count + 1;
    end if;
  end loop;

  if v_count > 0 then
    perform public._aal_log_audit(p_tenant_id, 'system', 'suggestion_created', null, null,
      jsonb_build_object('count', v_count));
  end if;

  return v_count;
end;
$$;

create or replace function public.run_aal_discovery_jobs(p_tenant_id uuid default null)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_tenant_id uuid; v_count int;
begin
  v_tenant_id := coalesce(p_tenant_id, public._presence_tenant_for_auth());
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  perform public.ensure_aal_automation_settings(v_tenant_id);
  v_count := public.discover_automation_opportunities_for_tenant(v_tenant_id);
  return jsonb_build_object('suggestions_created', v_count);
end;
$$;

-- ---------------------------------------------------------------------------
-- 13. Suggestions + drafts
-- ---------------------------------------------------------------------------
create or replace function public._aal_suggestion_json(s public.aipify_automation_suggestions)
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'id', s.id, 'suggestion_type', s.suggestion_type, 'title', s.title, 'summary', s.summary,
    'evidence', s.evidence, 'estimated_time_saved_minutes_per_week', s.estimated_time_saved_minutes_per_week,
    'estimated_monthly_value', s.estimated_monthly_value, 'confidence_score', s.confidence_score,
    'risk_level', s.risk_level, 'recommended_template_id', s.recommended_template_id,
    'generated_flow_draft', s.generated_flow_draft, 'status', s.status,
    'snoozed_until', s.snoozed_until, 'created_at', s.created_at, 'updated_at', s.updated_at
  );
$$;

create or replace function public.update_automation_suggestion_status(
  p_suggestion_id uuid, p_status text, p_snooze_until timestamptz default null
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_s public.aipify_automation_suggestions;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;

  select * into v_s from public.aipify_automation_suggestions
  where id = p_suggestion_id and tenant_id = v_tenant_id;
  if not found then raise exception 'Suggestion not found'; end if;

  if p_status in ('approved', 'rejected', 'dismissed') then
    perform public._aal_require_admin();
  end if;

  update public.aipify_automation_suggestions set
    status = p_status,
    snoozed_until = case when p_status = 'snoozed' then p_snooze_until else snoozed_until end,
    reviewed_by_user_id = case when p_status in ('approved', 'rejected', 'reviewing') then public._aal_user_id() else reviewed_by_user_id end,
    reviewed_at = case when p_status in ('approved', 'rejected', 'reviewing') then now() else reviewed_at end,
    updated_at = now()
  where id = p_suggestion_id returning * into v_s;

  perform public._aal_log_audit(v_tenant_id, 'user', 'suggestion_reviewed', 'automation_suggestion', p_suggestion_id,
    jsonb_build_object('status', p_status));
  return public._aal_suggestion_json(v_s);
end;
$$;

create or replace function public.convert_suggestion_to_draft(p_suggestion_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_s public.aipify_automation_suggestions;
  v_template public.aipify_automation_templates;
  v_auto_id uuid;
  v_key text;
  v_settings public.aipify_automation_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  perform public._aal_require_admin();
  v_settings := public.ensure_aal_automation_settings(v_tenant_id);
  if not v_settings.enabled then raise exception 'Automation layer not enabled'; end if;
  if not v_settings.allow_ai_generated_drafts then raise exception 'AI drafts not allowed'; end if;

  select * into v_s from public.aipify_automation_suggestions
  where id = p_suggestion_id and tenant_id = v_tenant_id;
  if not found then raise exception 'Suggestion not found'; end if;

  if v_s.recommended_template_id is not null then
    select * into v_template from public.aipify_automation_templates where id = v_s.recommended_template_id;
  end if;

  v_key := 'auto_' || left(replace(gen_random_uuid()::text, '-', ''), 12);

  insert into public.aipify_automations (
    tenant_id, name, automation_key, description, category, template_id, suggestion_id,
    status, risk_level, trigger_definition, condition_definition, action_definition,
    approval_policy, execution_policy, created_by_user_id, created_by_ai
  ) values (
    v_tenant_id,
    coalesce(v_template.template_name, v_s.title),
    v_key,
    v_s.summary,
    coalesce(v_template.category, 'internal'),
    v_s.recommended_template_id,
    v_s.id,
    case when v_s.risk_level in ('high', 'blocked') then 'pending_approval' else 'draft' end,
    coalesce(v_template.risk_level, v_s.risk_level),
    coalesce(v_template.trigger_definition, '{}'::jsonb),
    coalesce(v_template.condition_definition, '{}'::jsonb),
    coalesce(v_template.action_definition, v_s.generated_flow_draft, '{}'::jsonb),
    jsonb_build_object(
      'require_on_enable', true,
      'require_each_run', v_s.risk_level = 'high'
    ),
    jsonb_build_object('max_per_day', 20),
    public._aal_user_id(),
    true
  ) returning id into v_auto_id;

  update public.aipify_automation_suggestions set status = 'converted', updated_at = now()
  where id = p_suggestion_id;

  if v_s.risk_level in ('medium', 'high') or v_settings.require_approval_for_medium_risk then
    insert into public.aipify_automation_approvals (
      tenant_id, automation_id, suggestion_id, approval_type, requested_by_ai, status
    ) values (
      v_tenant_id, v_auto_id, p_suggestion_id, 'create_automation', true, 'pending'
    );
  end if;

  perform public._aal_log_audit(v_tenant_id, 'aipify', 'automation_drafted', 'automation', v_auto_id,
    jsonb_build_object('suggestion_id', p_suggestion_id));

  return jsonb_build_object('automation_id', v_auto_id, 'status', 'draft');
end;
$$;

-- ---------------------------------------------------------------------------
-- 14. Templates + automations list
-- ---------------------------------------------------------------------------
create or replace function public.get_automation_templates()
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return '[]'::jsonb; end if;
  if not public._aal_package_allows(v_tenant_id) then return '[]'::jsonb; end if;
  perform public.seed_aal_global_templates();

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', t.id, 'template_key', t.template_key, 'template_name', t.template_name,
      'category', t.category, 'description', t.description, 'risk_level', t.risk_level,
      'is_global', t.is_global, 'trigger_definition', t.trigger_definition,
      'condition_definition', t.condition_definition, 'action_definition', t.action_definition
    ) order by t.is_global desc, t.template_name)
    from public.aipify_automation_templates t
    where t.is_global or t.tenant_id = v_tenant_id
  ), '[]'::jsonb);
end;
$$;

create or replace function public.create_automation_from_template(p_template_id uuid, p_name text default null)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_t public.aipify_automation_templates;
  v_auto_id uuid;
  v_key text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  perform public._aal_require_admin();
  perform public.ensure_aal_automation_settings(v_tenant_id);

  select * into v_t from public.aipify_automation_templates
  where id = p_template_id and (is_global or tenant_id = v_tenant_id);
  if not found then raise exception 'Template not found'; end if;
  if v_t.risk_level = 'blocked' then raise exception 'Template is blocked'; end if;

  v_key := 'tpl_' || left(replace(gen_random_uuid()::text, '-', ''), 12);

  insert into public.aipify_automations (
    tenant_id, name, automation_key, description, category, template_id, status, risk_level,
    trigger_definition, condition_definition, action_definition, created_by_user_id
  ) values (
    v_tenant_id, coalesce(p_name, v_t.template_name), v_key, v_t.description, v_t.category,
    v_t.id, 'draft', v_t.risk_level,
    v_t.trigger_definition, v_t.condition_definition, v_t.action_definition,
    public._aal_user_id()
  ) returning id into v_auto_id;

  perform public._aal_log_audit(v_tenant_id, 'user', 'automation_drafted', 'automation', v_auto_id,
    jsonb_build_object('template_id', p_template_id));

  return jsonb_build_object('automation_id', v_auto_id);
end;
$$;

create or replace function public._aal_automation_json(a public.aipify_automations)
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'id', a.id, 'name', a.name, 'automation_key', a.automation_key, 'description', a.description,
    'category', a.category, 'status', a.status, 'risk_level', a.risk_level,
    'template_id', a.template_id, 'suggestion_id', a.suggestion_id,
    'trigger_definition', a.trigger_definition, 'condition_definition', a.condition_definition,
    'action_definition', a.action_definition, 'approval_policy', a.approval_policy,
    'execution_policy', a.execution_policy, 'enabled_at', a.enabled_at,
    'last_run_at', a.last_run_at, 'created_by_ai', a.created_by_ai,
    'created_at', a.created_at, 'updated_at', a.updated_at
  );
$$;

-- ---------------------------------------------------------------------------
-- 15. Approvals + enable/pause/disable
-- ---------------------------------------------------------------------------
create or replace function public.resolve_automation_approval(
  p_approval_id uuid, p_status text, p_reason text default null
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_ap public.aipify_automation_approvals;
  v_auto public.aipify_automations;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  perform public._aal_require_admin();

  select * into v_ap from public.aipify_automation_approvals
  where id = p_approval_id and tenant_id = v_tenant_id and status = 'pending';
  if not found then raise exception 'Approval not found'; end if;

  update public.aipify_automation_approvals set
    status = p_status,
    approved_by_user_id = case when p_status = 'approved' then public._aal_user_id() else approved_by_user_id end,
    approved_at = case when p_status = 'approved' then now() else approved_at end,
    rejection_reason = p_reason,
    updated_at = now()
  where id = p_approval_id returning * into v_ap;

  if v_ap.automation_id is not null and p_status = 'approved' then
    select * into v_auto from public.aipify_automations where id = v_ap.automation_id;
    if v_ap.approval_type in ('create_automation', 'enable_automation') then
      update public.aipify_automations set
        status = 'active', enabled_at = now(), updated_at = now()
      where id = v_ap.automation_id;
    end if;
  end if;

  perform public._aal_log_audit(v_tenant_id, 'user',
    case when p_status = 'approved' then 'automation_approved' else 'approval_rejected' end,
    'automation_approval', p_approval_id, jsonb_build_object('status', p_status));

  return jsonb_build_object('approval_id', p_approval_id, 'status', p_status);
end;
$$;

create or replace function public.request_automation_enable(p_automation_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_auto public.aipify_automations;
  v_settings public.aipify_automation_settings;
  v_approval_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  perform public._aal_require_admin();
  v_settings := public.ensure_aal_automation_settings(v_tenant_id);
  if not v_settings.enabled then raise exception 'Automation not enabled'; end if;

  select * into v_auto from public.aipify_automations
  where id = p_automation_id and tenant_id = v_tenant_id;
  if not found then raise exception 'Automation not found'; end if;
  if v_auto.risk_level = 'blocked' then raise exception 'Automation is blocked'; end if;

  if v_auto.risk_level = 'low'
    and v_settings.allow_low_risk_auto_execution
    and not v_settings.require_approval_for_medium_risk then
    update public.aipify_automations set status = 'active', enabled_at = now(), updated_at = now()
    where id = p_automation_id;
    perform public._aal_log_audit(v_tenant_id, 'user', 'automation_enabled', 'automation', p_automation_id, '{}'::jsonb);
    return jsonb_build_object('automation_id', p_automation_id, 'status', 'active', 'approval_required', false);
  end if;

  insert into public.aipify_automation_approvals (
    tenant_id, automation_id, approval_type, requested_by_user_id, status
  ) values (
    v_tenant_id, p_automation_id, 'enable_automation', public._aal_user_id(), 'pending'
  ) returning id into v_approval_id;

  update public.aipify_automations set status = 'pending_approval', updated_at = now()
  where id = p_automation_id;

  perform public._aal_log_audit(v_tenant_id, 'user', 'approval_requested', 'automation', p_automation_id,
    jsonb_build_object('approval_id', v_approval_id));

  return jsonb_build_object('automation_id', p_automation_id, 'status', 'pending_approval', 'approval_id', v_approval_id);
end;
$$;

create or replace function public.set_automation_status(p_automation_id uuid, p_status text)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_tenant_id uuid; v_auto public.aipify_automations;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  perform public._aal_require_admin();

  if p_status not in ('paused', 'disabled', 'active', 'archived') then
    raise exception 'Invalid status';
  end if;

  update public.aipify_automations set status = p_status, updated_at = now()
  where id = p_automation_id and tenant_id = v_tenant_id
  returning * into v_auto;
  if not found then raise exception 'Automation not found'; end if;

  perform public._aal_log_audit(v_tenant_id, 'user',
    case p_status when 'paused' then 'automation_paused' when 'disabled' then 'automation_disabled' else 'automation_enabled' end,
    'automation', p_automation_id, jsonb_build_object('status', p_status));

  return public._aal_automation_json(v_auto);
end;
$$;

-- ---------------------------------------------------------------------------
-- 16. Safe executor V1
-- ---------------------------------------------------------------------------
create or replace function public.execute_automation(
  p_automation_id uuid,
  p_input jsonb default '{}'::jsonb,
  p_trigger_source_type text default 'manual',
  p_trigger_source_id text default null
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_auto public.aipify_automations;
  v_settings public.aipify_automation_settings;
  v_exec_id uuid;
  v_step_id uuid;
  v_daily int;
  v_action jsonb;
  v_step_order int := 0;
  v_ok boolean := true;
  v_summary text := '';
  v_blocked_types text[] := array['delete_data', 'change_billing', 'modify_membership', 'process_refund', 'approve_adult_content'];
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  v_settings := public.ensure_aal_automation_settings(v_tenant_id);
  if not v_settings.enabled then raise exception 'Automation layer disabled'; end if;

  select * into v_auto from public.aipify_automations
  where id = p_automation_id and tenant_id = v_tenant_id;
  if not found then raise exception 'Automation not found'; end if;
  if v_auto.status <> 'active' then raise exception 'Automation is not active'; end if;
  if v_auto.risk_level = 'blocked' then raise exception 'Automation is blocked'; end if;

  select count(*) into v_daily
  from public.aipify_automation_executions
  where tenant_id = v_tenant_id and automation_id = p_automation_id
    and created_at::date = current_date and status in ('success', 'partial_success', 'running');

  if v_daily >= v_settings.max_daily_executions then
    raise exception 'Daily execution limit reached';
  end if;

  if v_auto.risk_level = 'high' and v_settings.require_approval_for_high_risk then
    if not exists (
      select 1 from public.aipify_automation_approvals
      where automation_id = p_automation_id and approval_type = 'execute_once'
        and status = 'approved' and approved_at > now() - interval '1 hour'
    ) then
      insert into public.aipify_automation_executions (
        tenant_id, automation_id, trigger_source_type, trigger_source_id,
        status, risk_level_at_execution, input_payload
      ) values (
        v_tenant_id, p_automation_id, p_trigger_source_type, p_trigger_source_id,
        'waiting_approval', v_auto.risk_level, p_input
      ) returning id into v_exec_id;

      insert into public.aipify_automation_approvals (
        tenant_id, automation_id, approval_type, requested_by_user_id, status,
        approval_context
      ) values (
        v_tenant_id, p_automation_id, 'execute_once', public._aal_user_id(), 'pending',
        jsonb_build_object('execution_id', v_exec_id)
      );

      return jsonb_build_object('execution_id', v_exec_id, 'status', 'waiting_approval');
    end if;
  end if;

  insert into public.aipify_automation_executions (
    tenant_id, automation_id, trigger_source_type, trigger_source_id,
    status, risk_level_at_execution, input_payload, started_at
  ) values (
    v_tenant_id, p_automation_id, p_trigger_source_type, p_trigger_source_id,
    'running', v_auto.risk_level, p_input, now()
  ) returning id into v_exec_id;

  v_step_order := v_step_order + 1;
  insert into public.aipify_automation_execution_steps (
    tenant_id, execution_id, automation_id, step_order, step_type, step_name, status, started_at, completed_at
  ) values (
    v_tenant_id, v_exec_id, p_automation_id, v_step_order, 'trigger', 'Trigger', 'success', now(), now()
  );

  for v_action in
    select * from jsonb_array_elements(coalesce(v_auto.action_definition->'actions', '[]'::jsonb))
  loop
    v_step_order := v_step_order + 1;

    if (v_action->>'type') = any(v_blocked_types) then
      insert into public.aipify_automation_execution_steps (
        tenant_id, execution_id, automation_id, step_order, step_type, step_name, status,
        error_message, input
      ) values (
        v_tenant_id, v_exec_id, p_automation_id, v_step_order, 'action', v_action->>'type', 'failed',
        'Blocked action type', v_action
      );
      v_ok := false;
      continue;
    end if;

    if (v_action->>'type') in ('draft_email', 'send_template_email')
      and v_auto.risk_level in ('high', 'medium')
      and v_settings.require_approval_for_medium_risk then
      insert into public.aipify_automation_execution_steps (
        tenant_id, execution_id, automation_id, step_order, step_type, step_name, status, input, output
      ) values (
        v_tenant_id, v_exec_id, p_automation_id, v_step_order, 'action', v_action->>'type', 'skipped',
        v_action, jsonb_build_object('reason', 'external_message_requires_template_approval')
      );
      continue;
    end if;

    insert into public.aipify_automation_execution_steps (
      tenant_id, execution_id, automation_id, step_order, step_type, step_name, status,
      input, output, started_at, completed_at
    ) values (
      v_tenant_id, v_exec_id, p_automation_id, v_step_order, 'action', coalesce(v_action->>'type', 'action'), 'success',
      v_action,
      case v_action->>'type'
        when 'create_task' then jsonb_build_object('task_created', true)
        when 'notify_admin' then jsonb_build_object('notified', true)
        when 'send_internal_notification' then jsonb_build_object('sent', true)
        when 'draft_email' then jsonb_build_object('draft_created', true)
        when 'tag_ticket' then jsonb_build_object('tagged', true)
        when 'assign_case' then jsonb_build_object('assigned', true)
        when 'create_support_note' then jsonb_build_object('note_created', true)
        when 'create_support_case' then jsonb_build_object('case_created', true)
        when 'request_approval' then jsonb_build_object('approval_requested', true)
        when 'generate_summary' then jsonb_build_object('summary_generated', true)
        else jsonb_build_object('completed', true)
      end,
      now(), now()
    );

    v_summary := v_summary || coalesce(v_action->>'type', 'action') || '; ';
  end loop;

  update public.aipify_automation_executions set
    status = case when v_ok then 'success' else 'partial_success' end,
    result_summary = trim(v_summary),
    output_payload = jsonb_build_object('steps', v_step_order),
    completed_at = now(),
    duration_ms = extract(epoch from (now() - started_at))::int * 1000
  where id = v_exec_id;

  update public.aipify_automations set last_run_at = now(), updated_at = now()
  where id = p_automation_id;

  insert into public.aipify_automation_metrics (
    tenant_id, automation_id, period_start, period_end,
    executions_count, success_count, estimated_time_saved_minutes
  ) values (
    v_tenant_id, p_automation_id, date_trunc('month', current_date)::date,
    (date_trunc('month', current_date) + interval '1 month' - interval '1 day')::date,
    1, case when v_ok then 1 else 0 end, 5
  )
  on conflict (tenant_id, automation_id, period_start, period_end) do update set
    executions_count = aipify_automation_metrics.executions_count + 1,
    success_count = aipify_automation_metrics.success_count + case when v_ok then 1 else 0 end,
    estimated_time_saved_minutes = aipify_automation_metrics.estimated_time_saved_minutes + 5,
    last_calculated_at = now();

  perform public._aal_log_audit(v_tenant_id, 'system', 'automation_executed', 'automation', p_automation_id,
    jsonb_build_object('execution_id', v_exec_id));

  return jsonb_build_object('execution_id', v_exec_id, 'status', case when v_ok then 'success' else 'partial_success' end);
end;
$$;

-- ---------------------------------------------------------------------------
-- 17. Automation center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_automation_center()
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_plan text;
  v_settings public.aipify_automation_settings;
  v_time_saved int := 0;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_plan := public._aal_tenant_plan(v_tenant_id);

  if not public._aal_package_allows(v_tenant_id) then
    return jsonb_build_object(
      'has_customer', true, 'has_access', false, 'upgrade_required', true, 'plan', v_plan,
      'privacy_note', 'Adaptive Automation discovers safe automation opportunities — never hidden execution.'
    );
  end if;

  perform public.seed_aal_global_templates();
  v_settings := public.ensure_aal_automation_settings(v_tenant_id);

  if not v_settings.enabled then
    return jsonb_build_object(
      'has_customer', true, 'has_access', true, 'enabled', false, 'upgrade_required', false, 'plan', v_plan,
      'privacy_note', 'Enable Adaptive Automation in settings to discover and manage safe automations.',
      'settings_url', '/app/settings/automation'
    );
  end if;

  if not exists (
    select 1 from public.aipify_automation_suggestions s
    where s.tenant_id = v_tenant_id and s.created_at::date = current_date
  ) and v_settings.allow_automation_discovery then
    perform public.discover_automation_opportunities_for_tenant(v_tenant_id);
  end if;

  select coalesce(sum(m.estimated_time_saved_minutes), 0) into v_time_saved
  from public.aipify_automation_metrics m
  where m.tenant_id = v_tenant_id
    and m.period_start >= date_trunc('month', current_date)::date;

  perform public._aal_log_audit(v_tenant_id, 'user', 'view_automation_center', null, null, '{}'::jsonb);

  return jsonb_build_object(
    'has_customer', true, 'has_access', true, 'enabled', true, 'upgrade_required', false, 'plan', v_plan,
    'privacy_note', 'Automations require approval before activation. High-risk actions require approval every run.',
    'metrics', jsonb_build_object(
      'active_count', (select count(*) from public.aipify_automations where tenant_id = v_tenant_id and status = 'active'),
      'draft_count', (select count(*) from public.aipify_automations where tenant_id = v_tenant_id and status in ('draft', 'pending_approval')),
      'paused_count', (select count(*) from public.aipify_automations where tenant_id = v_tenant_id and status = 'paused'),
      'failed_count', (select count(*) from public.aipify_automations where tenant_id = v_tenant_id and status = 'failed'),
      'new_suggestions', (select count(*) from public.aipify_automation_suggestions where tenant_id = v_tenant_id and status = 'open'),
      'pending_approvals', (select count(*) from public.aipify_automation_approvals where tenant_id = v_tenant_id and status = 'pending'),
      'time_saved_minutes_month', v_time_saved
    ),
    'automations', coalesce((
      select jsonb_agg(public._aal_automation_json(a) order by a.updated_at desc)
      from public.aipify_automations a where a.tenant_id = v_tenant_id
        and a.status not in ('archived', 'disabled') limit 20
    ), '[]'::jsonb),
    'suggestions', coalesce((
      select jsonb_agg(public._aal_suggestion_json(s) order by s.created_at desc)
      from public.aipify_automation_suggestions s
      where s.tenant_id = v_tenant_id and s.status in ('open', 'reviewing')
        and (s.snoozed_until is null or s.snoozed_until < now()) limit 10
    ), '[]'::jsonb),
    'pending_approvals_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ap.id, 'automation_id', ap.automation_id, 'approval_type', ap.approval_type,
        'status', ap.status, 'created_at', ap.created_at
      ) order by ap.created_at desc)
      from public.aipify_automation_approvals ap
      where ap.tenant_id = v_tenant_id and ap.status = 'pending' limit 10
    ), '[]'::jsonb),
    'recent_executions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'automation_id', e.automation_id, 'status', e.status,
        'result_summary', e.result_summary, 'created_at', e.created_at
      ) order by e.created_at desc)
      from public.aipify_automation_executions e
      where e.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.get_automation_executions()
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return '[]'::jsonb; end if;
  if not public._aal_package_allows(v_tenant_id) then return '[]'::jsonb; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', e.id, 'automation_id', e.automation_id,
      'automation_name', a.name,
      'status', e.status, 'result_summary', e.result_summary,
      'error_message', e.error_message, 'risk_level_at_execution', e.risk_level_at_execution,
      'started_at', e.started_at, 'completed_at', e.completed_at,
      'duration_ms', e.duration_ms, 'created_at', e.created_at
    ) order by e.created_at desc)
    from public.aipify_automation_executions e
    join public.aipify_automations a on a.id = e.automation_id
    where e.tenant_id = v_tenant_id limit 50
  ), '[]'::jsonb);
end;
$$;

-- ---------------------------------------------------------------------------
-- 18. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_customer_automation_center() to authenticated;
grant execute on function public.get_automation_settings() to authenticated;
grant execute on function public.update_automation_settings(jsonb) to authenticated;
grant execute on function public.run_aal_discovery_jobs(uuid) to authenticated;
grant execute on function public.update_automation_suggestion_status(uuid, text, timestamptz) to authenticated;
grant execute on function public.convert_suggestion_to_draft(uuid) to authenticated;
grant execute on function public.get_automation_templates() to authenticated;
grant execute on function public.create_automation_from_template(uuid, text) to authenticated;
grant execute on function public.request_automation_enable(uuid) to authenticated;
grant execute on function public.set_automation_status(uuid, text) to authenticated;
grant execute on function public.resolve_automation_approval(uuid, text, text) to authenticated;
grant execute on function public.execute_automation(uuid, jsonb, text, text) to authenticated;
grant execute on function public.get_automation_executions() to authenticated;
