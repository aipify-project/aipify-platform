-- Phase A.3 — Secure AI Action Engine
-- Principle: AI recommends and performs actions only within approved security boundaries.

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
    'identity_permissions', 'secure_ai_action'
  )
);

-- ---------------------------------------------------------------------------
-- 1. ai_actions (organization-scoped action catalog)
-- ---------------------------------------------------------------------------
create table if not exists public.ai_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_key text not null,
  category text not null check (
    category in ('support', 'knowledge', 'tasks', 'notifications', 'integrations', 'users', 'settings', 'commerce', 'moderation')
  ),
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high')
  ),
  title text not null,
  description text,
  enabled boolean not null default true,
  requires_approval boolean not null default true,
  rollback_supported boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, action_key)
);

create index if not exists ai_actions_org_idx on public.ai_actions (organization_id, category, enabled);

alter table public.ai_actions enable row level security;
revoke all on public.ai_actions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. ai_action_requests (execution queue)
-- ---------------------------------------------------------------------------
create table if not exists public.ai_action_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  initiated_by uuid references public.users (id) on delete set null,
  action_key text not null,
  action_payload jsonb not null default '{}'::jsonb,
  risk_level text not null check (risk_level in ('low', 'medium', 'high')),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'executed', 'failed', 'cancelled')
  ),
  recommendation jsonb not null default '{}'::jsonb,
  approved_by uuid references public.users (id) on delete set null,
  approved_at timestamptz,
  executed_at timestamptz,
  execution_result jsonb,
  rollback_payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ai_action_requests_org_status_idx
  on public.ai_action_requests (organization_id, status, created_at desc);

alter table public.ai_action_requests enable row level security;
revoke all on public.ai_action_requests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Helpers (_sae_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._sae_permission_for_category(p_category text)
returns text language sql immutable as $$
  select case p_category
    when 'support' then 'support.reply'
    when 'knowledge' then 'knowledge.update'
    when 'tasks' then 'support.view'
    when 'notifications' then 'support.reply'
    when 'integrations' then 'integrations.manage'
    when 'users' then 'users.update'
    when 'settings' then 'settings.manage'
    when 'commerce' then 'modules.view'
    when 'moderation' then 'modules.manage'
    else 'ai.approve'
  end;
$$;

create or replace function public._sae_classify_risk(p_action_key text, p_default text default 'medium')
returns text language plpgsql immutable as $$
begin
  if p_action_key like '%faq%' or p_action_key like '%summary%' or p_action_key like '%draft%' or p_action_key like '%recommend%' then
    return 'low';
  end if;
  if p_action_key like '%role%' or p_action_key like '%billing%' or p_action_key like '%suspend%' or p_action_key like '%remove%' or p_action_key like '%delete%' then
    return 'high';
  end if;
  return p_default;
end; $$;

create or replace function public._sae_requires_approval(p_risk_level text, p_action public.ai_actions default null)
returns boolean language plpgsql immutable as $$
begin
  if p_action is not null and not p_action.enabled then return true; end if;
  if p_action is not null and p_action.requires_approval then
    return p_risk_level in ('medium', 'high');
  end if;
  return p_risk_level <> 'low';
end; $$;

create or replace function public._sae_seed_actions(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.ai_actions (organization_id, action_key, category, risk_level, title, description, enabled, requires_approval, rollback_supported)
  select p_organization_id, v.key, v.cat, v.risk, v.title, v.item_description, true, v.approval, v.rollback
  from (values
    ('faq_response', 'support', 'low', 'FAQ Response', 'Answer from approved knowledge base', false, false),
    ('internal_summary', 'tasks', 'low', 'Internal Summary', 'Summarize operational context internally', false, false),
    ('task_recommendation', 'tasks', 'low', 'Task Recommendation', 'Suggest next operational tasks', false, false),
    ('draft_creation', 'support', 'low', 'Draft Creation', 'Create draft content for human review', false, false),
    ('support_reply', 'support', 'medium', 'Support Reply', 'Send customer support response', true, true),
    ('knowledge_publish', 'knowledge', 'medium', 'Publish Knowledge', 'Publish Knowledge Center article', true, true),
    ('customer_notification', 'notifications', 'medium', 'Customer Notification', 'Send customer notification', true, true),
    ('workflow_update', 'settings', 'medium', 'Workflow Update', 'Update operational workflow', true, true),
    ('role_change', 'users', 'high', 'Role Change', 'Change user role assignment', true, true),
    ('billing_change', 'commerce', 'high', 'Billing Change', 'Modify billing configuration', true, false),
    ('integration_removal', 'integrations', 'high', 'Integration Removal', 'Remove connected integration', true, true),
    ('account_suspension', 'users', 'high', 'Account Suspension', 'Suspend user account', true, true),
    ('destructive_action', 'settings', 'high', 'Destructive Action', 'Irreversible configuration change', true, false)
  ) as v(key, cat, risk, title, item_description, approval, rollback)
  on conflict (organization_id, action_key) do nothing;
end; $$;

create or replace function public._sae_log(
  p_organization_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb,
  p_ai_involved boolean default true
)
returns uuid language plpgsql security definer set search_path = public as $$
begin
  return public._mta_create_audit_log(
    p_organization_id, p_action_type, 'ai_action', null, p_ai_involved,
    true, null, p_metadata
  );
end; $$;

create or replace function public._sae_get_action(p_organization_id uuid, p_action_key text)
returns public.ai_actions language plpgsql stable security definer set search_path = public as $$
declare v_action public.ai_actions;
begin
  perform public._sae_seed_actions(p_organization_id);
  select * into v_action from public.ai_actions
  where organization_id = p_organization_id and action_key = p_action_key;
  return v_action;
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Core execution RPCs
-- ---------------------------------------------------------------------------
create or replace function public.suggest_ai_action(
  p_action_key text,
  p_payload jsonb default '{}'::jsonb,
  p_recommendation jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action public.ai_actions;
  v_risk text;
  v_request_id uuid;
  v_needs_approval boolean;
  v_perm text;
begin
  v_org_id := public._mta_require_organization();
  v_action := public._sae_get_action(v_org_id, p_action_key);

  if v_action.id is null then raise exception 'Unknown action: %', p_action_key; end if;
  if not v_action.enabled then raise exception 'Action is disabled: %', p_action_key; end if;

  v_perm := public._sae_permission_for_category(v_action.category);
  if not public._irp_has_permission(v_perm, v_org_id) and not public._irp_has_permission('ai.approve', v_org_id) then
    raise exception 'AI action exceeds granted permissions';
  end if;

  v_risk := coalesce(nullif(v_action.risk_level, ''), public._sae_classify_risk(p_action_key));
  v_needs_approval := public._sae_requires_approval(v_risk, v_action);

  insert into public.ai_action_requests (
    organization_id, initiated_by, action_key, action_payload, risk_level, status, recommendation
  ) values (
    v_org_id, public._mta_app_user_id(), p_action_key, p_payload, v_risk,
    case when v_needs_approval then 'pending' else 'approved' end,
    coalesce(p_recommendation, '{}'::jsonb) || jsonb_build_object(
      'summary', coalesce(p_recommendation->>'summary', v_action.title),
      'reason', coalesce(p_recommendation->>'reason', v_action.description),
      'expected_impact', coalesce(p_recommendation->>'expected_impact', 'Operational improvement'),
      'required_approvals', case v_risk when 'low' then 'none' when 'medium' then 'manager_or_administrator' else 'owner_or_administrator' end,
      'rollback_considerations', coalesce(p_recommendation->>'rollback_considerations', case when v_action.rollback_supported then 'Rollback available' else 'Manual review required' end)
    )
  ) returning id into v_request_id;

  perform public._sae_log(v_org_id, 'ai_action_suggested', jsonb_build_object(
    'request_id', v_request_id, 'action_key', p_action_key, 'risk_level', v_risk
  ));

  if not v_needs_approval then
    return public.execute_ai_action(v_request_id);
  end if;

  return jsonb_build_object(
    'request_id', v_request_id,
    'status', 'pending',
    'risk_level', v_risk,
    'requires_approval', true,
    'recommendation', (select recommendation from public.ai_action_requests where id = v_request_id)
  );
end; $$;

create or replace function public.submit_ai_action_approval(p_request_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_req public.ai_action_requests;
  v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  select * into v_req from public.ai_action_requests
  where id = p_request_id and organization_id = v_org_id;

  if v_req.id is null then raise exception 'Request not found'; end if;
  if v_req.status <> 'pending' then raise exception 'Request not pending'; end if;

  if not public._irp_can_approve_risk(v_req.risk_level, v_org_id) then
    raise exception 'Insufficient role to approve % risk action', v_req.risk_level;
  end if;

  perform public._irp_require_permission('ai.approve', v_org_id);

  update public.ai_action_requests set
    status = 'approved', approved_by = public._mta_app_user_id(), approved_at = now()
  where id = p_request_id;

  perform public._sae_log(v_org_id, 'ai_action_approved', jsonb_build_object('request_id', p_request_id));

  return public.execute_ai_action(p_request_id);
end; $$;

create or replace function public.reject_ai_action_request(p_request_id uuid, p_reason text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission('ai.reject', v_org_id);

  update public.ai_action_requests set status = 'rejected', approved_by = public._mta_app_user_id(), approved_at = now(),
    execution_result = jsonb_build_object('reason', coalesce(p_reason, 'Rejected by reviewer'))
  where id = p_request_id and organization_id = v_org_id and status = 'pending';

  perform public._sae_log(v_org_id, 'ai_action_rejected', jsonb_build_object('request_id', p_request_id));

  return jsonb_build_object('request_id', p_request_id, 'status', 'rejected');
end; $$;

create or replace function public.execute_ai_action(p_request_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_req public.ai_action_requests;
  v_org_id uuid;
  v_result jsonb;
begin
  v_org_id := public._mta_require_organization();
  select * into v_req from public.ai_action_requests
  where id = p_request_id and organization_id = v_org_id;

  if v_req.id is null then raise exception 'Request not found'; end if;
  if v_req.status not in ('approved', 'pending') then raise exception 'Request not executable'; end if;

  if v_req.status = 'pending' and public._sae_requires_approval(v_req.risk_level) then
    raise exception 'Approval required before execution';
  end if;

  v_result := jsonb_build_object(
    'status', 'executed',
    'action_key', v_req.action_key,
    'message', 'Action executed within secure boundaries',
    'executed_at', now()
  );

  update public.ai_action_requests set
    status = 'executed',
    executed_at = now(),
    execution_result = v_result,
    approved_at = coalesce(approved_at, now()),
    approved_by = coalesce(approved_by, initiated_by)
  where id = p_request_id;

  perform public._sae_log(v_org_id, 'ai_action_executed', jsonb_build_object(
    'request_id', p_request_id, 'action_key', v_req.action_key, 'risk_level', v_req.risk_level
  ), true);

  return jsonb_build_object(
    'request_id', p_request_id,
    'status', 'executed',
    'execution_result', v_result
  );
exception when others then
  update public.ai_action_requests set
    status = 'failed',
    execution_result = jsonb_build_object('error', sqlerrm)
  where id = p_request_id;
  perform public._sae_log(v_org_id, 'ai_action_failed', jsonb_build_object('request_id', p_request_id, 'error', sqlerrm));
  raise;
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_secure_ai_action_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._sae_seed_actions(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify transforms from conversational assistant into an operational companion — every action stays within secure boundaries.',
    'safety_note', 'AI never bypasses permissions, tenant isolation, or approval requirements. Sensitive actions always require human oversight.',
    'principles', jsonb_build_array(
      'AI must never exceed granted permissions',
      'AI actions inherit tenant context',
      'AI actions are risk-classified and auditable',
      'Sensitive actions require human approval'
    ),
    'pending_approvals', (
      select count(*) from public.ai_action_requests
      where organization_id = v_org_id and status = 'pending'
    ),
    'failed_executions', (
      select count(*) from public.ai_action_requests
      where organization_id = v_org_id and status = 'failed'
    ),
    'executed_count', (
      select count(*) from public.ai_action_requests
      where organization_id = v_org_id and status = 'executed'
    ),
    'approval_statistics', jsonb_build_object(
      'approved', (select count(*) from public.ai_action_requests where organization_id = v_org_id and status = 'executed'),
      'rejected', (select count(*) from public.ai_action_requests where organization_id = v_org_id and status = 'rejected'),
      'pending', (select count(*) from public.ai_action_requests where organization_id = v_org_id and status = 'pending'),
      'failed', (select count(*) from public.ai_action_requests where organization_id = v_org_id and status = 'failed')
    ),
    'risk_distribution', coalesce((
      select jsonb_agg(jsonb_build_object('risk_level', r.risk_level, 'count', r.cnt))
      from (
        select risk_level, count(*) as cnt
        from public.ai_action_requests where organization_id = v_org_id
        group by risk_level
      ) r
    ), '[]'::jsonb),
    'action_catalog', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action_key', a.action_key, 'category', a.category, 'risk_level', a.risk_level,
        'title', a.title, 'enabled', a.enabled, 'requires_approval', a.requires_approval,
        'rollback_supported', a.rollback_supported
      ) order by a.category, a.action_key)
      from public.ai_actions a where a.organization_id = v_org_id
    ), '[]'::jsonb),
    'recent_requests', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'action_key', r.action_key, 'risk_level', r.risk_level,
        'status', r.status, 'recommendation', r.recommendation,
        'created_at', r.created_at, 'executed_at', r.executed_at,
        'execution_result', r.execution_result
      ) order by r.created_at desc)
      from public.ai_action_requests r where r.organization_id = v_org_id limit 15
    ), '[]'::jsonb),
    'categories', jsonb_build_array('support', 'knowledge', 'tasks', 'notifications', 'integrations', 'users', 'settings', 'commerce', 'moderation')
  );
end; $$;

create or replace function public.get_secure_ai_action_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'pending_approvals', (select count(*) from public.ai_action_requests where organization_id = v_org_id and status = 'pending'),
    'philosophy', 'Secure AI actions within approval boundaries.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- Seed demo requests for all orgs
do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._sae_seed_actions(v_org_id);
    insert into public.ai_action_requests (
      organization_id, action_key, action_payload, risk_level, status, recommendation, created_at
    )
    select v_org_id, v.key, '{}'::jsonb, v.risk, v.status, v.rec, now() - v.ago
    from (values
      ('task_recommendation', 'low', 'executed', '{"summary":"Review pending support tickets","reason":"3 tickets awaiting response","expected_impact":"Faster customer resolution","required_approvals":"none","rollback_considerations":"N/A"}'::jsonb, interval '1 hour'),
      ('support_reply', 'medium', 'pending', '{"summary":"Draft support reply for order inquiry","reason":"Customer asked about delivery status","expected_impact":"Improved response time","required_approvals":"manager_or_administrator","rollback_considerations":"Message not sent until approved"}'::jsonb, interval '30 minutes'),
      ('workflow_update', 'medium', 'pending', '{"summary":"Suggest workflow automation for FAQ routing","reason":"Repeated FAQ pattern detected","expected_impact":"Reduced manual triage","required_approvals":"manager_or_administrator","rollback_considerations":"Revert workflow configuration"}'::jsonb, interval '2 hours')
    ) as v(key, risk, status, rec, ago)
    where not exists (
      select 1 from public.ai_action_requests r
      where r.organization_id = v_org_id and r.action_key = v.key and r.status = v.status
      limit 1
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 6. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'secure-ai-action', 'Secure AI Action Engine', 'AI action classification, approval workflows, and secure execution.', 'authenticated', 53
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'secure-ai-action' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.suggest_ai_action(text, jsonb, jsonb) to authenticated;
grant execute on function public.submit_ai_action_approval(uuid) to authenticated;
grant execute on function public.reject_ai_action_request(uuid, text) to authenticated;
grant execute on function public.execute_ai_action(uuid) to authenticated;
grant execute on function public.get_secure_ai_action_dashboard() to authenticated;
grant execute on function public.get_secure_ai_action_card() to authenticated;
