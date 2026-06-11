-- Phase A.10 — Customer Onboarding Engine
-- Principle: guided setup for new organizations — step-by-step with checklist and KC recommendations.

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
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_onboarding
-- ---------------------------------------------------------------------------
create table if not exists public.organization_onboarding (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade unique,
  current_step text not null default 'welcome' check (
    current_step in (
      'welcome', 'organization_profile', 'team_setup', 'module_activation',
      'knowledge_center', 'integrations', 'support_ai', 'secure_ai_actions',
      'admin_assistant', 'go_live'
    )
  ),
  completion_percentage numeric(5, 2) not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.organization_onboarding enable row level security;
revoke all on public.organization_onboarding from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. onboarding_checklist_items
-- ---------------------------------------------------------------------------
create table if not exists public.onboarding_checklist_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  checklist_key text not null,
  title text not null,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, checklist_key)
);

create index if not exists onboarding_checklist_items_org_idx
  on public.onboarding_checklist_items (organization_id, completed);

alter table public.onboarding_checklist_items enable row level security;
revoke all on public.onboarding_checklist_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'customer_onboarding', v.description
from (values
  ('onboarding.view', 'View Onboarding', 'View onboarding progress and checklist'),
  ('onboarding.manage', 'Manage Onboarding', 'Advance steps and complete onboarding')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'onboarding.view'), ('owner', 'onboarding.manage'),
  ('administrator', 'onboarding.view'), ('administrator', 'onboarding.manage'),
  ('manager', 'onboarding.view'),
  ('support_agent', 'onboarding.view'),
  ('viewer', 'onboarding.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 4. Helpers (_cob_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._cob_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'customer_onboarding',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._cob_steps()
returns text[] language sql immutable as $$
  select array[
    'welcome', 'organization_profile', 'team_setup', 'module_activation',
    'knowledge_center', 'integrations', 'support_ai', 'secure_ai_actions',
    'admin_assistant', 'go_live'
  ];
$$;

create or replace function public._cob_step_index(p_step text)
returns int language sql immutable as $$
  select coalesce(
    (select ordinality - 1 from unnest(public._cob_steps()) with ordinality as s(step, ordinality) where s.step = p_step),
    0
  );
$$;

create or replace function public._cob_recalc_completion(p_organization_id uuid)
returns numeric language plpgsql security definer set search_path = public as $$
declare
  v_total int;
  v_done int;
  v_pct numeric;
begin
  select count(*) into v_total from public.onboarding_checklist_items where organization_id = p_organization_id;
  select count(*) into v_done from public.onboarding_checklist_items where organization_id = p_organization_id and completed;

  if v_total = 0 then
    v_pct := 0;
  else
    v_pct := round((v_done::numeric / v_total::numeric) * 100, 1);
  end if;

  update public.organization_onboarding set
    completion_percentage = v_pct,
    updated_at = now()
  where organization_id = p_organization_id;

  return v_pct;
end; $$;

create or replace function public._cob_ensure_onboarding(p_organization_id uuid)
returns public.organization_onboarding language plpgsql security definer set search_path = public as $$
declare v_row public.organization_onboarding;
begin
  insert into public.organization_onboarding (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row from public.organization_onboarding where organization_id = p_organization_id;

  insert into public.onboarding_checklist_items (organization_id, checklist_key, title)
  select p_organization_id, v.key, v.title
  from (values
    ('complete_organization_profile', 'Complete organization profile'),
    ('invite_team_member', 'Invite at least one team member'),
    ('activate_core_module', 'Activate a core module'),
    ('publish_first_article', 'Publish your first knowledge article'),
    ('connect_first_integration', 'Connect your first integration'),
    ('configure_support_channels', 'Configure support channels'),
    ('review_ai_action_policies', 'Review AI action policies'),
    ('complete_security_review', 'Complete security review'),
    ('explore_operations_dashboard', 'Explore the operations dashboard'),
    ('acknowledge_getting_started', 'Acknowledge getting started guide')
  ) as v(key, title)
  where not exists (
    select 1 from public.onboarding_checklist_items c
    where c.organization_id = p_organization_id and c.checklist_key = v.key
  );

  if v_row.started_at = v_row.updated_at and v_row.completion_percentage = 0 then
    perform public._cob_log(p_organization_id, 'onboarding_started', 'customer_onboarding', v_row.id,
      jsonb_build_object('current_step', v_row.current_step));
  end if;

  return v_row;
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Onboarding RPCs
-- ---------------------------------------------------------------------------
create or replace function public.advance_onboarding_step()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organization_onboarding;
  v_steps text[];
  v_idx int;
  v_next text;
begin
  perform public._irp_require_permission('onboarding.manage');
  v_org_id := public._mta_require_organization();
  v_row := public._cob_ensure_onboarding(v_org_id);
  v_steps := public._cob_steps();
  v_idx := public._cob_step_index(v_row.current_step);

  if v_row.completed_at is not null then
    return jsonb_build_object('current_step', v_row.current_step, 'completed', true);
  end if;

  if v_idx >= array_length(v_steps, 1) - 1 then
    v_next := v_steps[array_length(v_steps, 1)];
  else
    v_next := v_steps[v_idx + 2];
  end if;

  update public.organization_onboarding set
    current_step = v_next,
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._cob_log(v_org_id, 'onboarding_step_advanced', 'customer_onboarding', v_row.id,
    jsonb_build_object('current_step', v_row.current_step));

  return jsonb_build_object(
    'current_step', v_row.current_step,
    'completion_percentage', v_row.completion_percentage,
    'step_index', public._cob_step_index(v_row.current_step),
    'total_steps', array_length(v_steps, 1)
  );
end; $$;

create or replace function public.complete_checklist_item(p_checklist_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_item public.onboarding_checklist_items; v_pct numeric;
begin
  perform public._irp_require_permission('onboarding.manage');
  v_org_id := public._mta_require_organization();
  perform public._cob_ensure_onboarding(v_org_id);

  update public.onboarding_checklist_items set
    completed = true,
    completed_at = now()
  where organization_id = v_org_id and checklist_key = p_checklist_key and not completed
  returning * into v_item;

  if v_item.id is null then
    select * into v_item from public.onboarding_checklist_items
    where organization_id = v_org_id and checklist_key = p_checklist_key;
    if v_item.id is null then raise exception 'Checklist item not found'; end if;
  else
    perform public._cob_log(v_org_id, 'checklist_completed', 'onboarding_checklist', v_item.id,
      jsonb_build_object('checklist_key', p_checklist_key));
  end if;

  v_pct := public._cob_recalc_completion(v_org_id);

  return jsonb_build_object(
    'checklist_key', p_checklist_key,
    'completed', v_item.completed,
    'completion_percentage', v_pct
  );
end; $$;

create or replace function public.get_onboarding_recommendations()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organization_onboarding;
  v_knowledge jsonb;
  v_steps text[];
begin
  perform public._irp_require_permission('onboarding.view');
  v_org_id := public._mta_require_organization();
  v_row := public._cob_ensure_onboarding(v_org_id);
  v_steps := public._cob_steps();

  v_knowledge := public.retrieve_knowledge_for_ai(
    'onboarding setup ' || v_row.current_step || ' getting started',
    'en',
    'internal'
  );

  return jsonb_build_object(
    'current_step', v_row.current_step,
    'step_index', public._cob_step_index(v_row.current_step),
    'total_steps', array_length(v_steps, 1),
    'next_step_hint', case v_row.current_step
      when 'welcome' then 'Review your organization profile and team structure.'
      when 'organization_profile' then 'Invite team members and assign roles.'
      when 'team_setup' then 'Enable the modules your organization needs.'
      when 'module_activation' then 'Add knowledge articles for Support AI and Admin Assistant.'
      when 'knowledge_center' then 'Connect integrations such as Unonight or email.'
      when 'integrations' then 'Configure Support AI channels and response modes.'
      when 'support_ai' then 'Review Secure AI Action policies and approval rules.'
      when 'secure_ai_actions' then 'Set up Admin Assistant tasks and recommendations.'
      when 'admin_assistant' then 'Review the operations dashboard and go live.'
      else 'Congratulations — your organization is ready to operate with Aipify.'
    end,
    'knowledge_articles', coalesce(v_knowledge->'articles', '[]'::jsonb),
    'suggested_checklist', coalesce((
      select jsonb_agg(jsonb_build_object(
        'checklist_key', c.checklist_key, 'title', c.title, 'completed', c.completed
      ) order by c.created_at)
      from public.onboarding_checklist_items c
      where c.organization_id = v_org_id and not c.completed limit 3
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.complete_onboarding()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_onboarding; v_pct numeric;
begin
  perform public._irp_require_permission('onboarding.manage');
  v_org_id := public._mta_require_organization();
  v_row := public._cob_ensure_onboarding(v_org_id);
  v_pct := public._cob_recalc_completion(v_org_id);

  if v_pct < 50 then
    raise exception 'Complete at least half of the onboarding checklist before finishing';
  end if;

  update public.organization_onboarding set
    current_step = 'go_live',
    completion_percentage = greatest(v_pct, 100),
    completed_at = coalesce(completed_at, now()),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._cob_log(v_org_id, 'onboarding_completed', 'customer_onboarding', v_row.id,
    jsonb_build_object('completion_percentage', v_row.completion_percentage));

  return jsonb_build_object(
    'completed', true,
    'completed_at', v_row.completed_at,
    'completion_percentage', v_row.completion_percentage
  );
end; $$;

create or replace function public.get_customer_onboarding_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organization_onboarding;
  v_steps text[];
  v_recommendations jsonb;
begin
  perform public._irp_require_permission('onboarding.view');
  v_org_id := public._mta_require_organization();
  v_row := public._cob_ensure_onboarding(v_org_id);
  v_steps := public._cob_steps();
  perform public._cob_recalc_completion(v_org_id);
  select * into v_row from public.organization_onboarding where organization_id = v_org_id;
  v_recommendations := public.get_onboarding_recommendations();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Guided onboarding helps organizations activate Aipify confidently — step by step with checklist and knowledge support.',
    'safety_note', 'Onboarding tracks progress metadata only. Operational data remains in respective modules.',
    'principles', jsonb_build_array(
      'Ten-step guided flow',
      'Actionable checklist items',
      'Knowledge Center recommendations',
      'Progress tracking with audit trail',
      'Owner and administrator control'
    ),
    'current_step', v_row.current_step,
    'step_index', public._cob_step_index(v_row.current_step),
    'total_steps', array_length(v_steps, 1),
    'steps', coalesce((
      select jsonb_agg(jsonb_build_object(
        'step_key', s.step,
        'step_index', s.ordinality - 1,
        'completed', public._cob_step_index(v_row.current_step) >= s.ordinality - 1,
        'current', v_row.current_step = s.step
      ) order by s.ordinality)
      from unnest(v_steps) with ordinality as s(step, ordinality)
    ), '[]'::jsonb),
    'completion_percentage', v_row.completion_percentage,
    'completed_at', v_row.completed_at,
    'checklist', coalesce((
      select jsonb_agg(jsonb_build_object(
        'checklist_key', c.checklist_key, 'title', c.title,
        'completed', c.completed, 'completed_at', c.completed_at
      ) order by c.created_at)
      from public.onboarding_checklist_items c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'checklist_completed', (
      select count(*) from public.onboarding_checklist_items where organization_id = v_org_id and completed
    ),
    'checklist_total', (
      select count(*) from public.onboarding_checklist_items where organization_id = v_org_id
    ),
    'recommendations', v_recommendations
  );
end; $$;

create or replace function public.get_customer_onboarding_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_onboarding;
begin
  v_org_id := public._mta_require_organization();
  v_row := public._cob_ensure_onboarding(v_org_id);
  perform public._cob_recalc_completion(v_org_id);
  select * into v_row from public.organization_onboarding where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'current_step', v_row.current_step,
    'completion_percentage', v_row.completion_percentage,
    'completed', v_row.completed_at is not null,
    'checklist_remaining', (
      select count(*) from public.onboarding_checklist_items
      where organization_id = v_org_id and not completed
    ),
    'philosophy', 'Guided setup for new organizations.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- Update audit list
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_connected', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged',
    'onboarding_started', 'onboarding_step_advanced', 'checklist_completed', 'onboarding_completed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._cob_ensure_onboarding(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'customer-onboarding-engine', 'Customer Onboarding Engine', 'Guided setup for new Aipify organizations.', 'authenticated', 60
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'customer-onboarding-engine' and tenant_id is null);

grant execute on function public.advance_onboarding_step() to authenticated;
grant execute on function public.complete_checklist_item(text) to authenticated;
grant execute on function public.get_onboarding_recommendations() to authenticated;
grant execute on function public.complete_onboarding() to authenticated;
grant execute on function public.get_customer_onboarding_engine_dashboard() to authenticated;
grant execute on function public.get_customer_onboarding_engine_card() to authenticated;
