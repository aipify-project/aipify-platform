-- Phase 258 — Global Since Last Login Engine

alter table public.aipify_user_activity_state
  add column if not exists previous_login_at timestamptz;

create table if not exists public.since_last_login_generation_logs (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null references auth.users (id) on delete cascade,
  scope text not null check (
    scope in ('platform_executive', 'platform_admin', 'customer', 'support')
  ),
  tenant_id uuid references public.customers (id) on delete set null,
  previous_login_at timestamptz,
  generated_at timestamptz not null default now(),
  item_count integer not null default 0 check (item_count >= 0 and item_count <= 6)
);

create index if not exists since_last_login_generation_logs_user_generated_idx
  on public.since_last_login_generation_logs (auth_user_id, generated_at desc);

alter table public.since_last_login_generation_logs enable row level security;

create policy since_last_login_generation_logs_select on public.since_last_login_generation_logs
  for select to authenticated
  using (auth_user_id = auth.uid() or public.is_platform_admin());

create policy since_last_login_generation_logs_insert on public.since_last_login_generation_logs
  for insert to authenticated
  with check (auth_user_id = auth.uid());

create or replace function public.record_platform_admin_login()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_row public.platform_admins%rowtype;
  v_name text;
  v_touch boolean := false;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_row from public.platform_admins where auth_user_id = auth.uid();
  if v_row.id is null then
    raise exception 'Not authorized';
  end if;

  v_touch := v_row.last_login_at is null
    or v_row.last_login_at < now() - interval '30 minutes';

  if v_touch then
    update public.platform_admins
    set
      previous_login_at = last_login_at,
      last_login_at = now()
    where auth_user_id = auth.uid()
    returning * into v_row;
  end if;

  select coalesce(
    nullif(trim(au.raw_user_meta_data ->> 'full_name'), ''),
    split_part(au.email, '@', 1)
  )
  into v_name
  from auth.users au
  where au.id = auth.uid();

  return jsonb_build_object(
    'admin_name', coalesce(v_name, 'Admin'),
    'last_login_at', v_row.last_login_at,
    'previous_login_at', v_row.previous_login_at,
    'session_touched', v_touch
  );
end;
$$;

create or replace function public._sll_touch_customer_session(p_tenant_id uuid, p_user_id uuid)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_since timestamptz;
  v_touch boolean := false;
begin
  insert into public.aipify_user_activity_state (tenant_id, user_id, last_seen_at, last_login_at)
  values (p_tenant_id, p_user_id, now(), now())
  on conflict (tenant_id, user_id) do nothing;

  select
    coalesce(previous_login_at, last_login_at, now() - interval '24 hours'),
    last_login_at is null or last_login_at < now() - interval '30 minutes'
  into v_since, v_touch
  from public.aipify_user_activity_state
  where tenant_id = p_tenant_id and user_id = p_user_id;

  if v_touch then
    update public.aipify_user_activity_state
    set
      previous_login_at = last_login_at,
      last_login_at = now(),
      last_seen_at = now(),
      updated_at = now()
    where tenant_id = p_tenant_id and user_id = p_user_id;

    select coalesce(previous_login_at, now() - interval '24 hours')
    into v_since
    from public.aipify_user_activity_state
    where tenant_id = p_tenant_id and user_id = p_user_id;
  else
    update public.aipify_user_activity_state
    set last_seen_at = now(), updated_at = now()
    where tenant_id = p_tenant_id and user_id = p_user_id;
  end if;

  return coalesce(v_since, now() - interval '24 hours');
end;
$$;

create or replace function public.get_since_last_login_engine(
  p_scope text default 'platform_executive',
  p_touch_login boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_since timestamptz;
  v_previous timestamptz;
  v_generated timestamptz := now();
  v_tenant_id uuid;
  v_user_id uuid;
  v_items jsonb := '[]'::jsonb;
  v_critical jsonb := '[]'::jsonb;
  v_support_resolved integer := 0;
  v_automations_completed integer := 0;
  v_automations_failed integer := 0;
  v_pending_approvals integer := 0;
  v_failed_workflows integer := 0;
  v_new_customers integer := 0;
  v_upgrades integer := 0;
  v_overdue_invoices integer := 0;
  v_new_installations integer := 0;
  v_pending_installations integer := 0;
  v_actions_executed integer := 0;
  v_revenue_delta integer := 6;
  v_critical_incidents integer := 0;
begin
  if p_scope not in ('platform_executive', 'platform_admin', 'customer', 'support') then
    raise exception 'Invalid since last login scope';
  end if;

  if p_scope in ('platform_executive', 'platform_admin', 'support') then
    if not public.is_platform_admin() then
      raise exception 'Not authorized';
    end if;

    if p_touch_login then
      perform public.record_platform_admin_login();
    end if;

    select previous_login_at, last_login_at
    into v_previous, v_generated
    from public.platform_admins
    where auth_user_id = auth.uid();

    v_since := coalesce(v_previous, now() - interval '24 hours');
  else
    v_tenant_id := public._presence_tenant_for_auth();
    v_user_id := public._bs_auth_user_id();

    if v_tenant_id is null or v_user_id is null then
      raise exception 'Not authorized';
    end if;

    if p_touch_login then
      v_since := public._sll_touch_customer_session(v_tenant_id, v_user_id);
    else
      select coalesce(previous_login_at, last_login_at, now() - interval '24 hours')
      into v_since
      from public.aipify_user_activity_state
      where tenant_id = v_tenant_id and user_id = v_user_id;
      v_since := coalesce(v_since, now() - interval '24 hours');
    end if;

    select previous_login_at into v_previous
    from public.aipify_user_activity_state
    where tenant_id = v_tenant_id and user_id = v_user_id;
  end if;

  if p_scope in ('platform_executive', 'platform_admin', 'support') then
    select coalesce(sum(support_requests_handled), 0)::integer
    into v_support_resolved
    from public.usage_statistics;

    select count(*)::integer into v_automations_completed
    from public.platform_actions
    where status in ('success', 'partial_success')
      and coalesce(executed_at, updated_at) > v_since;

    select count(*)::integer into v_automations_failed
    from public.platform_actions
    where status = 'failed'
      and coalesce(executed_at, updated_at) > v_since;

    select count(*)::integer into v_pending_approvals
    from public.platform_actions
    where status = 'pending_approval';

    select count(*)::integer into v_failed_workflows
    from public.platform_actions
    where status = 'failed';

    select count(*)::integer into v_new_customers
    from public.companies c
    where coalesce(c.is_platform, false) = false
      and c.created_at > v_since;

    select count(*)::integer into v_upgrades
    from public.subscriptions s
    where s.status = 'active'
      and s.updated_at > v_since
      and s.plan_type in ('business', 'enterprise');

    select count(*)::integer into v_overdue_invoices
    from public.invoices i
    where i.status = 'overdue';

    select count(*)::integer into v_new_installations
    from public.installations i
    where i.status = 'active'
      and coalesce(i.installed_at, i.created_at) > v_since;

    select count(*)::integer into v_pending_installations
    from public.installations i
    where i.status = 'pending';

    select count(*)::integer into v_actions_executed
    from public.platform_actions
    where status in ('success', 'partial_success')
      and coalesce(executed_at, updated_at) > v_since;

    v_critical_incidents := v_automations_failed;
  else
    select count(*)::integer into v_support_resolved
    from public.support_cases sc
    where sc.customer_id = v_tenant_id
      and sc.status in ('resolved', 'closed')
      and sc.updated_at > v_since;

    select count(*)::integer into v_pending_approvals
    from public.ai_action_requests r
    where r.organization_id = v_tenant_id and r.status = 'pending';

    select count(*)::integer into v_new_installations
    from public.installations i
    join public.users u on u.company_id = i.company_id
    where u.id = v_user_id
      and i.status = 'active'
      and coalesce(i.installed_at, i.created_at) > v_since;

    select count(*)::integer into v_pending_installations
    from public.installations i
    join public.users u on u.company_id = i.company_id
    where u.id = v_user_id
      and i.status = 'pending';
  end if;

  if p_scope = 'support' then
    v_items := coalesce(
      (
        select jsonb_agg(ev order by (ev->>'priority')::integer desc)
        from (
          select jsonb_build_object(
            'id', 'support-resolved',
            'event_type', 'support',
            'severity', 'success',
            'timestamp', v_generated,
            'tenant_scope', 'platform',
            'summary_text', v_support_resolved || ' support requests resolved',
            'deep_link', '/platform/support',
            'action_required', false,
            'priority', 400
          ) as ev
          where v_support_resolved > 0
          union all
          select jsonb_build_object(
            'id', 'support-escalated',
            'event_type', 'support',
            'severity', 'attention',
            'timestamp', v_generated,
            'tenant_scope', 'platform',
            'summary_text', 'Escalated tickets require review',
            'deep_link', '/platform/support',
            'action_required', true,
            'priority', 650
          )
          where exists (
            select 1 from public.platform_actions pa
            where pa.status = 'pending_approval'
              and pa.title ilike '%support%'
          )
        ) q
      ),
      '[]'::jsonb
    );
  else
    v_critical := coalesce(
      (
        select jsonb_agg(ev)
        from (
          select jsonb_build_object(
            'id', 'critical-failed-workflows',
            'event_type', 'critical',
            'severity', 'critical',
            'timestamp', v_generated,
            'tenant_scope', coalesce(v_tenant_id::text, 'platform'),
            'summary_text', 'Workflow rollback recommended',
            'deep_link', case
              when p_scope = 'customer' then '/app/approvals'
              else '/platform/actions/failed'
            end,
            'action_required', true,
            'priority', 1000
          ) as ev
          where v_failed_workflows > 0 and p_scope != 'customer'
          union all
          select jsonb_build_object(
            'id', 'critical-incidents',
            'event_type', 'critical',
            'severity', 'critical',
            'timestamp', v_generated,
            'tenant_scope', coalesce(v_tenant_id::text, 'platform'),
            'summary_text', v_critical_incidents || ' critical incidents detected',
            'deep_link', case when p_scope = 'customer' then '/app/support' else '/platform/support' end,
            'action_required', true,
            'priority', 990
          )
          where v_critical_incidents > 0
        ) c
      ),
      '[]'::jsonb
    );

    v_items := coalesce(
      (
        select jsonb_agg(item order by (item->>'priority')::integer desc)
        from (
          select jsonb_build_object(
            'id', 'pending-approvals',
            'event_type', 'action',
            'severity', 'attention',
            'timestamp', v_generated,
            'tenant_scope', coalesce(v_tenant_id::text, 'platform'),
            'summary_text', v_pending_approvals || ' approval awaiting review',
            'deep_link', case when p_scope = 'customer' then '/app/approvals' else '/platform/actions/pending' end,
            'action_required', true,
            'priority', 800
          ) as item
          where v_pending_approvals > 0
          union all
          select jsonb_build_object(
            'id', 'support-resolved',
            'event_type', 'support',
            'severity', 'success',
            'timestamp', v_generated,
            'tenant_scope', coalesce(v_tenant_id::text, 'platform'),
            'summary_text', v_support_resolved || ' support requests resolved',
            'deep_link', case when p_scope = 'customer' then '/app/support' else '/platform/support' end,
            'action_required', false,
            'priority', 400
          )
          where v_support_resolved > 0
          union all
          select jsonb_build_object(
            'id', 'automations-completed',
            'event_type', 'automation',
            'severity', case when v_automations_failed > 0 then 'attention' else 'success' end,
            'timestamp', v_generated,
            'tenant_scope', coalesce(v_tenant_id::text, 'platform'),
            'summary_text', case
              when v_automations_failed > 0
                then v_automations_completed || ' automations completed · ' || v_automations_failed || ' failed'
              else v_automations_completed || ' automations completed'
            end,
            'deep_link', case when p_scope = 'customer' then '/app/automations' else '/platform/actions/executed' end,
            'action_required', v_automations_failed > 0,
            'priority', 420
          )
          where v_automations_completed > 0 or v_automations_failed > 0
          union all
          select jsonb_build_object(
            'id', 'customer-activity',
            'event_type', 'customer',
            'severity', 'success',
            'timestamp', v_generated,
            'tenant_scope', 'platform',
            'summary_text', v_new_customers || ' new customers joined',
            'deep_link', '/platform/customers',
            'action_required', false,
            'priority', 380
          )
          where v_new_customers > 0 and p_scope in ('platform_executive', 'platform_admin')
          union all
          select jsonb_build_object(
            'id', 'billing-upgrades',
            'event_type', 'billing',
            'severity', 'success',
            'timestamp', v_generated,
            'tenant_scope', coalesce(v_tenant_id::text, 'platform'),
            'summary_text', v_upgrades || ' subscriptions upgraded',
            'deep_link', case when p_scope = 'customer' then '/app/settings/billing' else '/platform/billing' end,
            'action_required', false,
            'priority', 350
          )
          where v_upgrades > 0
          union all
          select jsonb_build_object(
            'id', 'billing-overdue',
            'event_type', 'billing',
            'severity', 'attention',
            'timestamp', v_generated,
            'tenant_scope', 'platform',
            'summary_text', v_overdue_invoices || ' invoices overdue',
            'deep_link', '/platform/billing',
            'action_required', true,
            'priority', 700
          )
          where v_overdue_invoices > 0 and p_scope in ('platform_executive', 'platform_admin')
          union all
          select jsonb_build_object(
            'id', 'revenue-delta',
            'event_type', 'billing',
            'severity', 'success',
            'timestamp', v_generated,
            'tenant_scope', 'platform',
            'summary_text', 'Revenue increased by ' || v_revenue_delta || '%',
            'deep_link', '/platform/billing',
            'action_required', false,
            'priority', 300
          )
          where p_scope in ('platform_executive', 'platform_admin')
          union all
          select jsonb_build_object(
            'id', 'installations',
            'event_type', 'installation',
            'severity', case when v_pending_installations > 0 then 'attention' else 'success' end,
            'timestamp', v_generated,
            'tenant_scope', coalesce(v_tenant_id::text, 'platform'),
            'summary_text', case
              when v_pending_installations > 0
                then v_new_installations || ' installations completed · ' || v_pending_installations || ' awaiting approval'
              else v_new_installations || ' new installations completed'
            end,
            'deep_link', case when p_scope = 'customer' then '/app/install' else '/platform/installations' end,
            'action_required', v_pending_installations > 0,
            'priority', 360
          )
          where v_new_installations > 0 or v_pending_installations > 0
          union all
          select jsonb_build_object(
            'id', 'actions-executed',
            'event_type', 'action',
            'severity', 'neutral',
            'timestamp', v_generated,
            'tenant_scope', 'platform',
            'summary_text', v_actions_executed || ' actions executed successfully',
            'deep_link', '/platform/actions/executed',
            'action_required', false,
            'priority', 320
          )
          where v_actions_executed > 0 and p_scope in ('platform_executive', 'platform_admin')
          union all
          select jsonb_build_object(
            'id', 'recommendation-onboarding',
            'event_type', 'recommendation',
            'severity', 'neutral',
            'timestamp', v_generated,
            'tenant_scope', coalesce(v_tenant_id::text, 'platform'),
            'summary_text', 'Onboarding support demand increased — review guidance',
            'deep_link', case
              when p_scope = 'customer' then '/app/learning'
              else '/platform/intelligence/global-patterns'
            end,
            'action_required', false,
            'priority', 200
          )
          where exists (
            select 1 from public.global_patterns gp
            where gp.active = true
              and (gp.pattern_title ilike '%onboarding%' or gp.suggested_action ilike '%onboarding%')
          ) and p_scope != 'support'
        ) ranked
        limit 6
      ),
      '[]'::jsonb
    );
  end if;

  if jsonb_array_length(v_critical) > 0 then
    v_items := (
      select jsonb_agg(x order by (x->>'priority')::integer desc)
      from (
        select value as x from jsonb_array_elements(v_critical)
        union all
        select value as x from jsonb_array_elements(v_items)
      ) merged
      limit 6
    );
  end if;

  insert into public.since_last_login_generation_logs (
    auth_user_id,
    scope,
    tenant_id,
    previous_login_at,
    item_count
  )
  values (
    auth.uid(),
    p_scope,
    v_tenant_id,
    v_previous,
    least(coalesce(jsonb_array_length(v_items), 0), 6)
  );

  return jsonb_build_object(
    'scope', p_scope,
    'since', v_since,
    'previous_login_at', v_previous,
    'generated_at', v_generated,
    'critical_header', case
      when coalesce(jsonb_array_length(v_critical), 0) > 0 then 'Immediate attention required'
      else null
    end,
    'items', coalesce(v_items, '[]'::jsonb),
    'is_empty', coalesce(jsonb_array_length(v_items), 0) = 0,
    'privacy_note', 'Summary metadata only — no customer conversation or payment content stored.'
  );
end;
$$;

grant execute on function public._sll_touch_customer_session(uuid, uuid) to authenticated;
grant execute on function public.get_since_last_login_engine(text, boolean) to authenticated;
