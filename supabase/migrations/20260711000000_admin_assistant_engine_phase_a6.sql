-- Phase A.6 — Admin Assistant Engine
-- Principle: practical AI assistance for administrators — tenant-aware, explainable, auditable.

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
    'knowledge_center_engine', 'admin_assistant_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. admin_tasks
-- ---------------------------------------------------------------------------
create table if not exists public.admin_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  title text not null,
  description text,
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'critical')
  ),
  status text not null default 'open' check (
    status in ('open', 'in_progress', 'waiting', 'completed', 'cancelled')
  ),
  assigned_to uuid references public.users (id) on delete set null,
  due_date timestamptz,
  ai_generated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_tasks_org_status_idx
  on public.admin_tasks (organization_id, status, priority, due_date);

alter table public.admin_tasks enable row level security;
revoke all on public.admin_tasks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. admin_assistant_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.admin_assistant_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  summary text not null,
  reason text,
  expected_outcome text,
  urgency text not null default 'medium' check (urgency in ('low', 'medium', 'high', 'critical')),
  suggested_next_step text,
  category text not null default 'operational' check (
    category in ('support', 'knowledge', 'approval', 'integration', 'task', 'operational')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'rejected', 'dismissed')
  ),
  knowledge_article_id uuid references public.knowledge_articles (id) on delete set null,
  ai_generated boolean not null default true,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references public.users (id) on delete set null
);

create index if not exists admin_assistant_recommendations_org_idx
  on public.admin_assistant_recommendations (organization_id, status, urgency);

alter table public.admin_assistant_recommendations enable row level security;
revoke all on public.admin_assistant_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. admin_assistant_notifications
-- ---------------------------------------------------------------------------
create table if not exists public.admin_assistant_notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  notification_type text not null check (
    notification_type in ('support_alert', 'ai_recommendation', 'approval_request', 'integration_issue', 'task_assignment', 'reminder')
  ),
  title text not null,
  body text,
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_assistant_notifications_org_idx
  on public.admin_assistant_notifications (organization_id, user_id, created_at desc);

alter table public.admin_assistant_notifications enable row level security;
revoke all on public.admin_assistant_notifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. admin_assistant_sessions (since last login tracking)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_assistant_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  last_login_at timestamptz not null default now(),
  previous_login_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

alter table public.admin_assistant_sessions enable row level security;
revoke all on public.admin_assistant_sessions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'admin_assistant', v.description
from (values
  ('assistant.view', 'View Admin Assistant', 'Access admin assistant dashboard'),
  ('assistant.recommend', 'Assistant Recommendations', 'View and act on AI recommendations'),
  ('assistant.manage_tasks', 'Manage Assistant Tasks', 'Create and manage admin tasks'),
  ('assistant.view_notifications', 'View Assistant Notifications', 'View assistant notification center')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'assistant.view'), ('owner', 'assistant.recommend'), ('owner', 'assistant.manage_tasks'), ('owner', 'assistant.view_notifications'),
  ('administrator', 'assistant.view'), ('administrator', 'assistant.recommend'), ('administrator', 'assistant.manage_tasks'), ('administrator', 'assistant.view_notifications'),
  ('manager', 'assistant.view'), ('manager', 'assistant.recommend'), ('manager', 'assistant.manage_tasks'), ('manager', 'assistant.view_notifications'),
  ('support_agent', 'assistant.view'), ('support_agent', 'assistant.view_notifications')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_aae_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._aae_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'admin_assistant',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb,
  p_ai_involved boolean default true
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, p_ai_involved, false, null, p_metadata
  );
end; $$;

create or replace function public._aae_touch_session(p_organization_id uuid, p_user_id uuid)
returns timestamptz language plpgsql security definer set search_path = public as $$
declare v_previous timestamptz;
begin
  select last_login_at into v_previous
  from public.admin_assistant_sessions
  where organization_id = p_organization_id and user_id = p_user_id;

  insert into public.admin_assistant_sessions (organization_id, user_id, last_login_at, previous_login_at)
  values (p_organization_id, p_user_id, now(), v_previous)
  on conflict (organization_id, user_id) do update set
    previous_login_at = admin_assistant_sessions.last_login_at,
    last_login_at = now(),
    updated_at = now();

  return coalesce(v_previous, now() - interval '7 days');
end; $$;

create or replace function public._aae_seed_demo_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.admin_tasks (
    organization_id, title, description, priority, status, due_date, ai_generated
  )
  select p_organization_id, v.title, v.description, v.priority, v.status, now() + v.due, v.ai
  from (values
    ('Review pending AI action approvals', 'Three medium-risk AI actions await administrator approval.', 'high', 'open', interval '1 day', true),
    ('Update stale knowledge articles', 'Two published articles are past their review due date.', 'medium', 'open', interval '3 days', true),
    ('Follow up on open support cases', 'Check unresolved support cases from the last 48 hours.', 'high', 'in_progress', interval '12 hours', false),
    ('Verify integration health', 'Review integration connection status and error logs.', 'medium', 'waiting', interval '2 days', true)
  ) as v(title, description, priority, status, due, ai)
  where not exists (
    select 1 from public.admin_tasks t
    where t.organization_id = p_organization_id and t.title = v.title limit 1
  );

  insert into public.admin_assistant_recommendations (
    organization_id, summary, reason, expected_outcome, urgency, suggested_next_step, category, status
  )
  select p_organization_id, v.summary, v.reason, v.outcome, v.urgency, v.step, v.category, v.status
  from (values
    ('Approve low-risk FAQ auto-responses', 'Three FAQ responses are ready for auto-execution.', 'Faster customer response times', 'medium', 'Review and approve in Secure AI Actions', 'approval', 'pending'),
    ('Publish updated onboarding guide', 'Knowledge article draft is ready for review.', 'Improved new user onboarding', 'medium', 'Submit for review in Knowledge Center', 'knowledge', 'pending'),
    ('Assign overdue support follow-up', 'One support case has been open for 72+ hours.', 'Reduced customer wait time', 'high', 'Create task and assign to support agent', 'support', 'pending')
  ) as v(summary, reason, outcome, urgency, step, category, status)
  where not exists (
    select 1 from public.admin_assistant_recommendations r
    where r.organization_id = p_organization_id and r.summary = v.summary limit 1
  );

  insert into public.admin_assistant_notifications (
    organization_id, notification_type, title, body, metadata
  )
  select p_organization_id, v.ntype, v.title, v.body, v.meta
  from (values
    ('approval_request', 'AI action awaiting approval', 'Support reply draft requires manager approval.', '{"source":"ai_actions"}'::jsonb),
    ('support_alert', 'Open support cases', '2 support cases remain unresolved.', '{"count":2}'::jsonb),
    ('reminder', 'Overdue task reminder', 'Integration health check is due today.', '{"task_type":"integration"}'::jsonb),
    ('ai_recommendation', 'New AI recommendation', 'Review suggested knowledge article updates.', '{"category":"knowledge"}'::jsonb)
  ) as v(ntype, title, body, meta)
  where not exists (
    select 1 from public.admin_assistant_notifications n
    where n.organization_id = p_organization_id and n.title = v.title limit 1
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Since last login
-- ---------------------------------------------------------------------------
create or replace function public.get_since_last_login_summary()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_since timestamptz;
begin
  perform public._irp_require_permission('assistant.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_since := public._aae_touch_session(v_org_id, v_user_id);

  return jsonb_build_object(
    'since', v_since,
    'new_support_cases', coalesce((
      select count(*) from public.support_cases sc
      where sc.customer_id = v_org_id and sc.created_at > v_since
    ), 0),
    'unresolved_approvals', coalesce((
      select count(*) from public.ai_action_requests r
      where r.organization_id = v_org_id and r.status = 'pending'
    ), 0),
    'new_users', coalesce((
      select count(*) from public.organization_users ou
      where ou.organization_id = v_org_id and ou.created_at > v_since
    ), 0),
    'failed_integrations', coalesce((
      select count(*) from public.audit_logs l
      where l.organization_id = v_org_id
        and l.action_type in ('integration_removed')
        and l.created_at > v_since
    ), 0),
    'knowledge_updates', coalesce((
      select jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title, 'published_at', a.published_at))
      from public.knowledge_articles a
      where a.organization_id = v_org_id and a.status = 'published' and a.published_at > v_since
      limit 10
    ), '[]'::jsonb),
    'ai_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'summary', r.summary, 'urgency', r.urgency, 'category', r.category
      ) order by r.created_at desc)
      from public.admin_assistant_recommendations r
      where r.organization_id = v_org_id and r.status = 'pending' and r.created_at > v_since
      limit 10
    ), '[]'::jsonb),
    'open_support_cases', coalesce((
      select count(*) from public.support_cases sc
      where sc.customer_id = v_org_id and sc.status in ('open', 'escalated')
    ), 0)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Task management
-- ---------------------------------------------------------------------------
create or replace function public.create_admin_task(
  p_title text,
  p_description text default null,
  p_priority text default 'medium',
  p_assigned_to uuid default null,
  p_due_date timestamptz default null,
  p_ai_generated boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid;
begin
  perform public._irp_require_permission('assistant.manage_tasks');
  v_org_id := public._mta_require_organization();

  insert into public.admin_tasks (
    organization_id, title, description, priority, assigned_to, due_date, ai_generated
  ) values (
    v_org_id, p_title, p_description, coalesce(p_priority, 'medium'),
    p_assigned_to, p_due_date, coalesce(p_ai_generated, false)
  ) returning id into v_id;

  if p_assigned_to is not null then
    insert into public.admin_assistant_notifications (
      organization_id, user_id, notification_type, title, body, metadata
    ) values (
      v_org_id, p_assigned_to, 'task_assignment', 'New task assigned',
      p_title, jsonb_build_object('task_id', v_id)
    );
    perform public._aae_log(v_org_id, 'assistant_task_assigned', 'admin_task', v_id,
      jsonb_build_object('title', p_title, 'assigned_to', p_assigned_to), p_ai_generated);
  end if;

  if p_ai_generated then
    perform public._aae_log(v_org_id, 'assistant_task_created', 'admin_task', v_id,
      jsonb_build_object('title', p_title, 'ai_generated', true), true);
  end if;

  return jsonb_build_object('id', v_id, 'status', 'open');
end; $$;

create or replace function public.update_admin_task(
  p_task_id uuid,
  p_status text default null,
  p_priority text default null,
  p_assigned_to uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('assistant.manage_tasks');
  v_org_id := public._mta_require_organization();

  update public.admin_tasks set
    status = coalesce(p_status, status),
    priority = coalesce(p_priority, priority),
    assigned_to = coalesce(p_assigned_to, assigned_to),
    updated_at = now()
  where id = p_task_id and organization_id = v_org_id;

  perform public._aae_log(v_org_id, 'assistant_task_updated', 'admin_task', p_task_id,
    jsonb_build_object('status', p_status, 'priority', p_priority), false);

  return jsonb_build_object('id', p_task_id, 'status', coalesce(p_status, 'updated'));
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Recommendations
-- ---------------------------------------------------------------------------
create or replace function public.accept_assistant_recommendation(p_recommendation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('assistant.recommend');
  v_org_id := public._mta_require_organization();

  update public.admin_assistant_recommendations set
    status = 'accepted', resolved_at = now(), resolved_by = public._mta_app_user_id()
  where id = p_recommendation_id and organization_id = v_org_id and status = 'pending';

  perform public._aae_log(v_org_id, 'assistant_recommendation_accepted', 'admin_assistant', p_recommendation_id,
    jsonb_build_object('recommendation_id', p_recommendation_id), true);

  return jsonb_build_object('id', p_recommendation_id, 'status', 'accepted');
end; $$;

create or replace function public.reject_assistant_recommendation(p_recommendation_id uuid, p_reason text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('assistant.recommend');
  v_org_id := public._mta_require_organization();

  update public.admin_assistant_recommendations set
    status = 'rejected', resolved_at = now(), resolved_by = public._mta_app_user_id()
  where id = p_recommendation_id and organization_id = v_org_id and status = 'pending';

  perform public._aae_log(v_org_id, 'assistant_recommendation_rejected', 'admin_assistant', p_recommendation_id,
    jsonb_build_object('recommendation_id', p_recommendation_id, 'reason', p_reason), true);

  return jsonb_build_object('id', p_recommendation_id, 'status', 'rejected');
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Reminders & daily briefing
-- ---------------------------------------------------------------------------
create or replace function public.generate_admin_daily_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_open_tasks int;
  v_pending_approvals int;
  v_open_support int;
  v_stale_knowledge int;
begin
  perform public._irp_require_permission('assistant.view');
  v_org_id := public._mta_require_organization();
  perform public._aae_seed_demo_content(v_org_id);

  select count(*) into v_open_tasks from public.admin_tasks
  where organization_id = v_org_id and status in ('open', 'in_progress', 'waiting');

  select count(*) into v_pending_approvals from public.ai_action_requests
  where organization_id = v_org_id and status = 'pending';

  select count(*) into v_open_support from public.support_cases
  where customer_id = v_org_id and status in ('open', 'pending', 'escalated');

  select count(*) into v_stale_knowledge from public.knowledge_articles
  where organization_id = v_org_id and status = 'published'
    and review_due_at is not null and review_due_at < now();

  perform public._aae_log(v_org_id, 'assistant_daily_briefing_generated', 'admin_assistant', v_org_id,
    jsonb_build_object('open_tasks', v_open_tasks, 'pending_approvals', v_pending_approvals), true);

  return jsonb_build_object(
    'generated_at', now(),
    'operational_summary', format(
      '%s open tasks, %s pending approvals, %s open support cases.',
      v_open_tasks, v_pending_approvals, v_open_support
    ),
    'key_metrics', jsonb_build_object(
      'open_tasks', v_open_tasks,
      'pending_approvals', v_pending_approvals,
      'open_support_cases', v_open_support,
      'stale_knowledge_articles', v_stale_knowledge,
      'unread_notifications', (
        select count(*) from public.admin_assistant_notifications
        where organization_id = v_org_id and read_at is null
      )
    ),
    'urgent_items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'type', 'task', 'title', t.title, 'priority', t.priority, 'due_date', t.due_date
      ) order by t.due_date asc nulls last)
      from public.admin_tasks t
      where t.organization_id = v_org_id
        and t.status in ('open', 'in_progress')
        and t.priority in ('high', 'critical')
      limit 5
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'summary', r.summary, 'urgency', r.urgency, 'suggested_next_step', r.suggested_next_step
      ) order by r.urgency desc)
      from public.admin_assistant_recommendations r
      where r.organization_id = v_org_id and r.status = 'pending' limit 5
    ), '[]'::jsonb),
    'reminders', jsonb_build_array(
      case when v_open_support > 0 then format('%s unanswered support cases need attention', v_open_support) end,
      case when v_pending_approvals > 0 then format('%s approvals are pending review', v_pending_approvals) end,
      case when v_stale_knowledge > 0 then format('%s knowledge articles are stale', v_stale_knowledge) end
    )
  );
end; $$;

create or replace function public.get_assistant_knowledge_suggestions(p_query text default 'admin operations')
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._irp_require_permission('assistant.view');
  return public.retrieve_knowledge_for_ai(p_query, 'en', 'internal');
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_admin_assistant_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_since jsonb;
  v_briefing jsonb;
begin
  perform public._irp_require_permission('assistant.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._aae_seed_demo_content(v_org_id);
  v_since := public.get_since_last_login_summary();
  v_briefing := public.generate_admin_daily_briefing();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'A practical AI assistant that saves time, improves awareness, and reduces administrative workload.',
    'safety_note', 'Sensitive actions require approval. All important assistant activities are audited.',
    'principles', jsonb_build_array(
      'Tenant-aware operation',
      'Explainable recommendations',
      'Approval before sensitive actions',
      'Audit logging for important events',
      'Knowledge-driven responses'
    ),
    'since_last_login', v_since,
    'daily_briefing', v_briefing,
    'pending_tasks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'title', t.title, 'description', t.description, 'priority', t.priority,
        'status', t.status, 'due_date', t.due_date, 'ai_generated', t.ai_generated
      ) order by
        case t.priority when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end,
        t.due_date asc nulls last)
      from public.admin_tasks t
      where t.organization_id = v_org_id and t.status in ('open', 'in_progress', 'waiting') limit 12
    ), '[]'::jsonb),
    'pending_approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'action_key', r.action_key, 'risk_level', r.risk_level,
        'status', r.status, 'recommendation', r.recommendation, 'created_at', r.created_at
      ) order by r.created_at desc)
      from public.ai_action_requests r
      where r.organization_id = v_org_id and r.status = 'pending' limit 8
    ), '[]'::jsonb),
    'support_overview', jsonb_build_object(
      'open_cases', coalesce((
        select count(*) from public.support_cases sc
        where sc.customer_id = v_org_id and sc.status in ('open', 'escalated')
      ), 0),
      'recent_cases', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', sc.id, 'subject', sc.subject, 'status', sc.status, 'created_at', sc.created_at
        ) order by sc.created_at desc)
        from public.support_cases sc
        where sc.customer_id = v_org_id limit 6
      ), '[]'::jsonb)
    ),
    'recommended_actions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'summary', r.summary, 'reason', r.reason, 'expected_outcome', r.expected_outcome,
        'urgency', r.urgency, 'suggested_next_step', r.suggested_next_step, 'category', r.category,
        'status', r.status
      ) order by
        case r.urgency when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end)
      from public.admin_assistant_recommendations r
      where r.organization_id = v_org_id and r.status = 'pending' limit 10
    ), '[]'::jsonb),
    'recent_notifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', n.id, 'notification_type', n.notification_type, 'title', n.title,
        'body', n.body, 'read_at', n.read_at, 'created_at', n.created_at
      ) order by n.created_at desc)
      from public.admin_assistant_notifications n
      where n.organization_id = v_org_id
        and (n.user_id is null or n.user_id = v_user_id)
      limit 12
    ), '[]'::jsonb),
    'knowledge_suggestions', public.get_assistant_knowledge_suggestions('admin assistant daily operations'),
    'task_counts', jsonb_build_object(
      'open', (select count(*) from public.admin_tasks where organization_id = v_org_id and status = 'open'),
      'in_progress', (select count(*) from public.admin_tasks where organization_id = v_org_id and status = 'in_progress'),
      'overdue', (select count(*) from public.admin_tasks where organization_id = v_org_id and due_date < now() and status not in ('completed', 'cancelled'))
    ),
    'unread_notifications', (
      select count(*) from public.admin_assistant_notifications
      where organization_id = v_org_id and (user_id is null or user_id = v_user_id) and read_at is null
    )
  );
end; $$;

create or replace function public.get_admin_assistant_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'open_tasks', (select count(*) from public.admin_tasks where organization_id = v_org_id and status in ('open', 'in_progress')),
    'pending_recommendations', (select count(*) from public.admin_assistant_recommendations where organization_id = v_org_id and status = 'pending'),
    'philosophy', 'Your AI-powered admin companion.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.mark_assistant_notification_read(p_notification_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('assistant.view_notifications');
  v_org_id := public._mta_require_organization();
  update public.admin_assistant_notifications set read_at = now()
  where id = p_notification_id and organization_id = v_org_id;
  return jsonb_build_object('id', p_notification_id, 'read_at', now());
end; $$;

-- Update audit should-audit list
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_connected', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._aae_seed_demo_content(v_org_id);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 12. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'admin-assistant-engine', 'Admin Assistant Engine', 'AI-powered administrative assistant for daily operations.', 'authenticated', 56
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'admin-assistant-engine' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 13. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_since_last_login_summary() to authenticated;
grant execute on function public.create_admin_task(text, text, text, uuid, timestamptz, boolean) to authenticated;
grant execute on function public.update_admin_task(uuid, text, text, uuid) to authenticated;
grant execute on function public.accept_assistant_recommendation(uuid) to authenticated;
grant execute on function public.reject_assistant_recommendation(uuid, text) to authenticated;
grant execute on function public.generate_admin_daily_briefing() to authenticated;
grant execute on function public.get_assistant_knowledge_suggestions(text) to authenticated;
grant execute on function public.get_admin_assistant_engine_dashboard() to authenticated;
grant execute on function public.get_admin_assistant_engine_card() to authenticated;
grant execute on function public.mark_assistant_notification_read(uuid) to authenticated;
