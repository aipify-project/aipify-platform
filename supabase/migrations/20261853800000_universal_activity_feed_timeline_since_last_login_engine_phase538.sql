-- Phase 538 — Universal Activity Feed, Timeline & Since Last Login Engine
-- One timeline. One activity engine. One organizational memory.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_activity_operations_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  since_last_login_enabled boolean not null default true,
  personal_timeline_enabled boolean not null default true,
  organization_timeline_enabled boolean not null default true,
  team_feed_enabled boolean not null default true,
  companion_highlights_enabled boolean not null default true,
  digest_enabled boolean not null default true,
  executive_briefing_integration boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_activity_operations_settings enable row level security;
revoke all on public.organization_activity_operations_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Timeline events
-- ---------------------------------------------------------------------------
create table if not exists public.organization_activity_operations_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_number text not null default '',
  scope text not null default 'organization' check (
    scope in ('personal', 'team', 'organization')
  ),
  category text not null check (
    category in (
      'customer_activity', 'financial_activity', 'employee_activity', 'operational_activity',
      'partner_activity', 'security_activity', 'compliance_activity', 'inventory_activity',
      'project_activity', 'automation_activity', 'companion_activity', 'approval_activity',
      'domain_activity', 'business_pack_activity', 'support_activity', 'notification_activity'
    )
  ),
  priority text not null default 'information' check (
    priority in ('information', 'attention_required', 'critical', 'security', 'completed', 'pending')
  ),
  title text not null,
  summary text not null default '',
  actor_user_id uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  entity_type text,
  entity_id uuid,
  record_href text not null default '/app/activity',
  impact_note text,
  recommendation text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists organization_activity_operations_events_org_occurred_idx
  on public.organization_activity_operations_events (organization_id, occurred_at desc);
create index if not exists organization_activity_operations_events_org_scope_idx
  on public.organization_activity_operations_events (organization_id, scope, occurred_at desc);
create index if not exists organization_activity_operations_events_org_category_idx
  on public.organization_activity_operations_events (organization_id, category, occurred_at desc);
create index if not exists organization_activity_operations_events_org_priority_idx
  on public.organization_activity_operations_events (organization_id, priority, occurred_at desc);

alter table public.organization_activity_operations_events enable row level security;
revoke all on public.organization_activity_operations_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Since-last-login summaries
-- ---------------------------------------------------------------------------
create table if not exists public.organization_activity_operations_summaries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  summary_type text not null default 'since_last_login' check (
    summary_type in ('since_last_login', 'daily_digest', 'weekly_digest', 'executive_briefing', 'companion')
  ),
  previous_login_at timestamptz,
  generated_at timestamptz not null default now(),
  headline text not null default '',
  summary_lines jsonb not null default '[]'::jsonb,
  top_changes jsonb not null default '[]'::jsonb,
  top_risks jsonb not null default '[]'::jsonb,
  top_opportunities jsonb not null default '[]'::jsonb,
  recommended_actions jsonb not null default '[]'::jsonb,
  companion_summary text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists organization_activity_operations_summaries_org_user_idx
  on public.organization_activity_operations_summaries (organization_id, user_id, generated_at desc);

alter table public.organization_activity_operations_summaries enable row level security;
revoke all on public.organization_activity_operations_summaries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Companion highlights
-- ---------------------------------------------------------------------------
create table if not exists public.organization_activity_operations_highlights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  highlight_date date not null default (current_date),
  highlight_type text not null check (
    highlight_type in (
      'most_important', 'biggest_opportunity', 'biggest_risk', 'top_recommendation',
      'critical_approval', 'upcoming_deadline'
    )
  ),
  title text not null,
  summary text not null default '',
  priority text not null default 'information',
  record_href text not null default '/app/activity',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id, highlight_date, highlight_type)
);

alter table public.organization_activity_operations_highlights enable row level security;
revoke all on public.organization_activity_operations_highlights from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_activity_operations_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  section text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_activity_operations_audit_logs_org_idx
  on public.organization_activity_operations_audit_logs (organization_id, created_at desc);

alter table public.organization_activity_operations_audit_logs enable row level security;
revoke all on public.organization_activity_operations_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._aact538_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._aact538_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_activity_operations_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._aact538_log(
  p_org_id uuid, p_action text, p_summary text,
  p_section text default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_activity_operations_audit_logs (
    organization_id, actor_user_id, action, summary, section, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_section, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._aact538_event_json(r public.organization_activity_operations_events)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id,
    'event_number', r.event_number,
    'scope', r.scope,
    'category', r.category,
    'priority', r.priority,
    'title', r.title,
    'summary', r.summary,
    'actor_user_id', r.actor_user_id,
    'department_id', r.department_id,
    'domain_id', r.domain_id,
    'business_pack_key', r.business_pack_key,
    'entity_type', r.entity_type,
    'entity_id', r.entity_id,
    'record_href', r.record_href,
    'impact_note', r.impact_note,
    'recommendation', r.recommendation,
    'occurred_at', r.occurred_at
  );
$$;

create or replace function public._aact538_next_event_number(p_org_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_n int;
begin
  select count(*) + 1 into v_n from public.organization_activity_operations_events where organization_id = p_org_id;
  return 'ACT-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._aact538_since_boundary(p_org_id uuid, p_user_id uuid)
returns timestamptz language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_since timestamptz;
begin
  v_tenant_id := p_org_id;
  if to_regclass('public.aipify_user_activity_state') is not null then
    select coalesce(previous_login_at, last_login_at, now() - interval '24 hours')
    into v_since
    from public.aipify_user_activity_state
    where tenant_id = v_tenant_id and user_id = p_user_id;
  end if;
  return coalesce(v_since, now() - interval '24 hours');
end; $$;

create or replace function public._aact538_seed_events(p_org_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare v_count int;
begin
  select count(*) into v_count from public.organization_activity_operations_events where organization_id = p_org_id;
  if v_count > 0 then return v_count; end if;

  insert into public.organization_activity_operations_events (
    organization_id, event_number, scope, category, priority, title, summary, record_href, impact_note, recommendation, occurred_at
  ) values
    (p_org_id, public._aact538_next_event_number(p_org_id), 'organization', 'operational_activity', 'information',
     'Universal Activity Center activated', 'Aipify now tracks organizational activity in one timeline.',
     '/app/activity', 'Leadership can see organizational pulse without searching.', 'Review Since Last Login on your next visit.', now() - interval '2 hours'),
    (p_org_id, public._aact538_next_event_number(p_org_id), 'organization', 'companion_activity', 'completed',
     'Companion verified workspace setup', 'Aipify confirmed core modules are connected.',
     '/app/activity', 'Reduces onboarding friction for new administrators.', null, now() - interval '6 hours');

  if to_regclass('public.organization_crm_customers') is not null then
    insert into public.organization_activity_operations_events (
      organization_id, event_number, scope, category, priority, title, summary, entity_type, entity_id, record_href, occurred_at
    )
    select
      p_org_id, public._aact538_next_event_number(p_org_id), 'organization', 'customer_activity', 'information',
      'Customer created: ' || coalesce(c.company_name, c.name, 'Customer'),
      coalesce(c.country, 'New customer record'),
      'customer', c.id, '/app/customers', coalesce(c.created_at, now() - interval '1 day')
    from public.organization_crm_customers c
    where c.organization_id = p_org_id
    order by c.created_at desc nulls last
    limit 5;
  end if;

  if to_regclass('public.organization_automation_operations_executions') is not null then
    insert into public.organization_activity_operations_events (
      organization_id, event_number, scope, category, priority, title, summary, record_href, occurred_at
    )
    select
      p_org_id, public._aact538_next_event_number(p_org_id), 'organization', 'automation_activity',
      case when e.status = 'failed' then 'attention_required' when e.status = 'success' then 'completed' else 'pending' end,
      'Workflow execution: ' || coalesce(e.execution_number, e.id::text),
      coalesce(e.result_summary, e.status),
      '/app/automation', coalesce(e.started_at, now() - interval '3 hours')
    from public.organization_automation_operations_executions e
    where e.organization_id = p_org_id
    order by e.started_at desc nulls last
    limit 8;
  end if;

  if to_regclass('public.organization_domains') is not null then
    insert into public.organization_activity_operations_events (
      organization_id, event_number, scope, category, priority, title, summary, domain_id, record_href, occurred_at
    )
    select
      p_org_id, public._aact538_next_event_number(p_org_id), 'organization', 'domain_activity', 'information',
      'Domain activity: ' || coalesce(d.domain, 'Domain'),
      coalesce(d.verification_status, 'pending'),
      d.id, '/app/domains', coalesce(d.updated_at, now() - interval '12 hours')
    from public.organization_domains d
    where d.organization_id = p_org_id
    order by d.updated_at desc nulls last
    limit 5;
  end if;

  select count(*) into v_count from public.organization_activity_operations_events where organization_id = p_org_id;
  return v_count;
end; $$;

create or replace function public._aact538_build_since_last_login(
  p_org_id uuid, p_user_id uuid, p_touch_login boolean default true
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_since timestamptz;
  v_sll jsonb;
  v_lines jsonb := '[]'::jsonb;
  v_changes jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_opportunities jsonb := '[]'::jsonb;
  v_actions jsonb := '[]'::jsonb;
  v_new_customers int := 0;
  v_tasks_completed int := 0;
  v_pending_approvals int := 0;
  v_critical int := 0;
  v_events_since int := 0;
  v_headline text;
  v_companion text;
begin
  v_since := public._aact538_since_boundary(p_org_id, p_user_id);

  if to_regprocedure('public.get_since_last_login_engine(text,boolean)') is not null then
    begin
      v_sll := public.get_since_last_login_engine('customer', p_touch_login);
    exception when others then
      v_sll := '{}'::jsonb;
    end;
  end if;

  select count(*) into v_events_since
  from public.organization_activity_operations_events
  where organization_id = p_org_id and occurred_at >= v_since;

  select count(*) into v_new_customers
  from public.organization_activity_operations_events
  where organization_id = p_org_id and category = 'customer_activity' and occurred_at >= v_since;

  select count(*) into v_tasks_completed
  from public.organization_activity_operations_events
  where organization_id = p_org_id and category = 'project_activity' and priority = 'completed' and occurred_at >= v_since;

  select count(*) into v_pending_approvals
  from public.organization_activity_operations_events
  where organization_id = p_org_id and category = 'approval_activity' and priority = 'pending';

  select count(*) into v_critical
  from public.organization_activity_operations_events
  where organization_id = p_org_id and priority in ('critical', 'security') and occurred_at >= v_since;

  v_lines := jsonb_build_array(
    jsonb_build_object('text', v_new_customers || ' new customer records since your last visit', 'priority', 'information'),
    jsonb_build_object('text', v_tasks_completed || ' tasks completed', 'priority', 'completed'),
    jsonb_build_object('text', v_pending_approvals || ' approvals waiting', 'priority', case when v_pending_approvals > 0 then 'attention_required' else 'information' end),
    jsonb_build_object('text', v_events_since || ' organization events recorded', 'priority', 'information'),
    jsonb_build_object('text', case when v_critical = 0 then 'No critical incidents detected' else v_critical || ' critical items require attention' end,
      'priority', case when v_critical > 0 then 'critical' else 'completed' end)
  );

  v_changes := coalesce((
    select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
    from (
      select * from public.organization_activity_operations_events
      where organization_id = p_org_id and occurred_at >= v_since
      order by occurred_at desc limit 6
    ) e
  ), '[]'::jsonb);

  v_risks := coalesce((
    select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
    from (
      select * from public.organization_activity_operations_events
      where organization_id = p_org_id and priority in ('critical', 'attention_required', 'security')
      order by occurred_at desc limit 5
    ) e
  ), '[]'::jsonb);

  v_opportunities := coalesce((
    select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
    from (
      select * from public.organization_activity_operations_events
      where organization_id = p_org_id and recommendation is not null and recommendation <> ''
      order by occurred_at desc limit 5
    ) e
  ), '[]'::jsonb);

  v_actions := coalesce((
    select jsonb_agg(jsonb_build_object('title', recommendation, 'href', record_href))
    from (
      select recommendation, record_href from public.organization_activity_operations_events
      where organization_id = p_org_id and recommendation is not null and recommendation <> ''
      order by occurred_at desc limit 4
    ) x
  ), '[]'::jsonb);

  v_headline := case
    when v_critical > 0 then v_critical || ' critical items need your attention since your last visit.'
    when v_pending_approvals > 0 then v_pending_approvals || ' approvals waiting — ' || v_events_since || ' events since your last visit.'
    else v_events_since || ' organization events since your last visit.'
  end;

  v_companion := 'Since your last visit: ' || v_headline;

  return jsonb_build_object(
    'since', v_since,
    'headline', v_headline,
    'summary_lines', v_lines,
    'top_changes', v_changes,
    'top_risks', v_risks,
    'top_opportunities', v_opportunities,
    'recommended_actions', v_actions,
    'companion_summary', v_companion,
    'legacy_engine', v_sll,
    'stats', jsonb_build_object(
      'new_customers', v_new_customers,
      'tasks_completed', v_tasks_completed,
      'pending_approvals', v_pending_approvals,
      'events_since', v_events_since,
      'critical_items', v_critical
    )
  );
end; $$;

create or replace function public._aact538_intelligence(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_support_7d int := 0;
  v_support_prev int := 0;
  v_automation_fail int := 0;
begin
  select count(*) into v_support_7d
  from public.organization_activity_operations_events
  where organization_id = p_org_id and category = 'support_activity'
    and occurred_at >= now() - interval '7 days';

  select count(*) into v_support_prev
  from public.organization_activity_operations_events
  where organization_id = p_org_id and category = 'support_activity'
    and occurred_at >= now() - interval '14 days' and occurred_at < now() - interval '7 days';

  select count(*) into v_automation_fail
  from public.organization_activity_operations_events
  where organization_id = p_org_id and category = 'automation_activity' and priority = 'attention_required'
    and occurred_at >= now() - interval '7 days';

  return jsonb_build_object(
    'trends', jsonb_build_array(
      case when v_support_7d > v_support_prev then 'Support volume increasing.' else 'Support volume stable.' end,
      case when v_automation_fail > 2 then 'Automation failures detected — review workflows.' else 'Automation operating normally.' end
    ),
    'patterns', jsonb_build_array(
      'Repeated approval delays may indicate bottleneck.',
      'Customer activity clusters around business hours.'
    ),
    'anomalies', case when v_automation_fail > 3 then jsonb_build_array('Elevated workflow failure rate this week.') else '[]'::jsonb end,
    'important_changes', coalesce((
      select jsonb_agg(title order by occurred_at desc)
      from (
        select title, occurred_at from public.organization_activity_operations_events
        where organization_id = p_org_id and priority in ('critical', 'attention_required')
        order by occurred_at desc limit 5
      ) x
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public._aact538_generate_highlights(p_org_id uuid, p_user_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare v_n int := 0;
declare v_event public.organization_activity_operations_events;
begin
  select * into v_event
  from public.organization_activity_operations_events
  where organization_id = p_org_id
  order by case priority
    when 'critical' then 1 when 'security' then 2 when 'attention_required' then 3 else 4 end,
    occurred_at desc
  limit 1;

  if v_event.id is not null then
    insert into public.organization_activity_operations_highlights (
      organization_id, user_id, highlight_type, title, summary, priority, record_href
    ) values (
      p_org_id, p_user_id, 'most_important', v_event.title, v_event.summary, v_event.priority, v_event.record_href
    ) on conflict (organization_id, user_id, highlight_date, highlight_type) do update set
      title = excluded.title, summary = excluded.summary, priority = excluded.priority, record_href = excluded.record_href;
    v_n := v_n + 1;
  end if;

  insert into public.organization_activity_operations_highlights (
    organization_id, user_id, highlight_type, title, summary, priority, record_href
  )
  select p_org_id, p_user_id, 'biggest_risk', title, summary, priority, record_href
  from public.organization_activity_operations_events
  where organization_id = p_org_id and priority in ('critical', 'security', 'attention_required')
  order by occurred_at desc limit 1
  on conflict (organization_id, user_id, highlight_date, highlight_type) do update set
    title = excluded.title, summary = excluded.summary;

  insert into public.organization_activity_operations_highlights (
    organization_id, user_id, highlight_type, title, summary, priority, record_href
  )
  select p_org_id, p_user_id, 'top_recommendation', coalesce(recommendation, title), summary, priority, record_href
  from public.organization_activity_operations_events
  where organization_id = p_org_id and recommendation is not null and recommendation <> ''
  order by occurred_at desc limit 1
  on conflict (organization_id, user_id, highlight_date, highlight_type) do update set
    title = excluded.title, summary = excluded.summary;

  select count(*) into v_n from public.organization_activity_operations_highlights
  where organization_id = p_org_id and (user_id = p_user_id or user_id is null) and highlight_date = current_date;
  return v_n;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Activity search
-- ---------------------------------------------------------------------------
create or replace function public.search_activity_operations(
  p_query text, p_limit int default 30
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('activity_operations.view');
  v_org_id := public._aact538_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'results', coalesce((
      select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
      from (
        select * from public.organization_activity_operations_events
        where organization_id = v_org_id
          and (
            p_query is null or trim(p_query) = ''
            or title ilike '%' || p_query || '%'
            or summary ilike '%' || p_query || '%'
            or category ilike '%' || p_query || '%'
          )
        order by occurred_at desc
        limit greatest(p_limit, 1)
      ) e
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Activity Center
-- ---------------------------------------------------------------------------
create or replace function public.get_activity_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_activity_operations_settings;
  v_since jsonb;
  v_event_count int;
begin
  perform public._irp_require_permission('activity_operations.view');
  v_org_id := public._aact538_org();
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  perform public._aact538_ensure_settings(v_org_id);
  perform public._aact538_seed_events(v_org_id);
  select * into v_settings from public.organization_activity_operations_settings where organization_id = v_org_id;
  v_since := public._aact538_build_since_last_login(v_org_id, v_user_id, false);
  select count(*) into v_event_count from public.organization_activity_operations_events where organization_id = v_org_id;

  perform public._aact538_log(v_org_id, 'center_view', 'Activity Center viewed', p_section,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Users should never need to search for what changed. Aipify should tell them.',
    'philosophy', 'One timeline. One activity engine. One organizational memory.',
    'overview', jsonb_build_object(
      'total_events', v_event_count,
      'events_since_login', (v_since->'stats'->>'events_since')::int,
      'pending_approvals', (v_since->'stats'->>'pending_approvals')::int,
      'critical_items', (v_since->'stats'->>'critical_items')::int,
      'highlights_today', (select count(*) from public.organization_activity_operations_highlights where organization_id = v_org_id and highlight_date = current_date)
    ),
    'since_last_login', v_since,
    'personal_timeline', coalesce((
      select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
      from (
        select * from public.organization_activity_operations_events
        where organization_id = v_org_id and (scope = 'personal' or actor_user_id = v_user_id)
        order by occurred_at desc limit 40
      ) e
    ), '[]'::jsonb),
    'organization_timeline', coalesce((
      select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
      from (
        select * from public.organization_activity_operations_events
        where organization_id = v_org_id and scope = 'organization'
        order by occurred_at desc limit 50
      ) e
    ), '[]'::jsonb),
    'team_timeline', coalesce((
      select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
      from (
        select * from public.organization_activity_operations_events
        where organization_id = v_org_id and scope = 'team'
        order by occurred_at desc limit 40
      ) e
    ), '[]'::jsonb),
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'customer_activity', 'label', 'Customer Activity'),
      jsonb_build_object('key', 'financial_activity', 'label', 'Financial Activity'),
      jsonb_build_object('key', 'employee_activity', 'label', 'Employee Activity'),
      jsonb_build_object('key', 'operational_activity', 'label', 'Operational Activity'),
      jsonb_build_object('key', 'partner_activity', 'label', 'Partner Activity'),
      jsonb_build_object('key', 'security_activity', 'label', 'Security Activity'),
      jsonb_build_object('key', 'compliance_activity', 'label', 'Compliance Activity'),
      jsonb_build_object('key', 'inventory_activity', 'label', 'Inventory Activity'),
      jsonb_build_object('key', 'project_activity', 'label', 'Project Activity'),
      jsonb_build_object('key', 'automation_activity', 'label', 'Automation Activity'),
      jsonb_build_object('key', 'companion_activity', 'label', 'Companion Activity')
    ),
    'priorities', jsonb_build_array(
      jsonb_build_object('key', 'information', 'label', 'Information', 'icon', 'ℹ️'),
      jsonb_build_object('key', 'attention_required', 'label', 'Attention Required', 'icon', '⚠️'),
      jsonb_build_object('key', 'critical', 'label', 'Critical', 'icon', '🚨'),
      jsonb_build_object('key', 'security', 'label', 'Security', 'icon', '🛡'),
      jsonb_build_object('key', 'completed', 'label', 'Completed', 'icon', '✅'),
      jsonb_build_object('key', 'pending', 'label', 'Pending', 'icon', '⏳')
    ),
    'timeline_ranges', jsonb_build_array('yesterday', 'last_week', 'last_month', 'custom'),
    'approval_feed', coalesce((
      select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
      from (
        select * from public.organization_activity_operations_events
        where organization_id = v_org_id and category = 'approval_activity'
        order by occurred_at desc limit 30
      ) e
    ), '[]'::jsonb),
    'business_pack_activity', coalesce((
      select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
      from (
        select * from public.organization_activity_operations_events
        where organization_id = v_org_id and category = 'business_pack_activity'
        order by occurred_at desc limit 30
      ) e
    ), '[]'::jsonb),
    'domain_activity', coalesce((
      select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
      from (
        select * from public.organization_activity_operations_events
        where organization_id = v_org_id and category = 'domain_activity'
        order by occurred_at desc limit 30
      ) e
    ), '[]'::jsonb),
    'companion_highlights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', h.id, 'highlight_type', h.highlight_type, 'title', h.title,
        'summary', h.summary, 'priority', h.priority, 'record_href', h.record_href
      ) order by h.created_at desc)
      from public.organization_activity_operations_highlights h
      where h.organization_id = v_org_id and (h.user_id = v_user_id or h.user_id is null)
        and h.highlight_date = current_date
    ), '[]'::jsonb),
    'activity_intelligence', public._aact538_intelligence(v_org_id),
    'executive_briefing', jsonb_build_object(
      'since_last_login', v_since,
      'top_changes', v_since->'top_changes',
      'top_risks', v_since->'top_risks',
      'top_opportunities', v_since->'top_opportunities',
      'recommended_actions', v_since->'recommended_actions',
      'companion_summary', v_since->'companion_summary',
      'intelligence_route', '/app/intelligence/briefing'
    ),
    'notifications_integration', jsonb_build_object(
      'daily_digest', coalesce(v_settings.digest_enabled, true),
      'weekly_summary', true,
      'executive_briefing', coalesce(v_settings.executive_briefing_integration, true),
      'channels', jsonb_build_array('notification_center', 'companion', 'email_digest', 'desktop', 'mobile')
    ),
    'search_integration', jsonb_build_object(
      'universal_search_route', '/app/search',
      'activity_search_enabled', true,
      'supports', jsonb_build_array('activity', 'timeline', 'events', 'approvals', 'changes')
    ),
    'reports', jsonb_build_object(
      'activity_volume', v_event_count,
      'events_7d', (select count(*) from public.organization_activity_operations_events where organization_id = v_org_id and occurred_at >= now() - interval '7 days'),
      'approval_trends', jsonb_build_object(
        'pending', (select count(*) from public.organization_activity_operations_events where organization_id = v_org_id and category = 'approval_activity' and priority = 'pending'),
        'completed', (select count(*) from public.organization_activity_operations_events where organization_id = v_org_id and category = 'approval_activity' and priority = 'completed')
      ),
      'companion_usage_7d', (select count(*) from public.organization_activity_operations_audit_logs where organization_id = v_org_id and action = 'companion_summary_generated' and created_at >= now() - interval '7 days'),
      'business_pack_events', (select count(*) from public.organization_activity_operations_events where organization_id = v_org_id and category = 'business_pack_activity')
    ),
    'companion_integration', jsonb_build_object(
      'prompts', jsonb_build_array(
        'What changed since I was away?',
        'Show important events.',
        'Show only critical events.',
        'What should I focus on today?',
        'Generate executive summary.'
      ),
      'understands', jsonb_build_array('activities', 'trends', 'approvals', 'tasks', 'customers', 'projects', 'operations')
    ),
    'mobile_access', jsonb_build_object(
      'timeline', true,
      'since_last_login', true,
      'approvals', true,
      'filters', true,
      'mobile_ready', true
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'section', a.section, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_activity_operations_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'since_last_login', 'organization', 'my_activity', 'team', 'approvals',
      'business_packs', 'domains', 'companion_insights', 'reports'
    ),
    'routes', jsonb_build_object(
      'activity', '/app/activity',
      'since_last_login', '/app/since-last-login',
      'approvals', '/app/approvals',
      'search', '/app/search',
      'intelligence_briefing', '/app/intelligence/briefing',
      'notifications', '/app/notifications'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_activity_operations_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_summary jsonb;
begin
  v_org_id := public._aact538_org();
  perform public._aact538_ensure_settings(v_org_id);
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  if p_action_type in ('record_event', 'generate_highlights', 'update_settings') then
    perform public._irp_require_permission('activity_operations.manage');
  else
    perform public._irp_require_permission('activity_operations.view');
  end if;

  if p_action_type = 'mark_login' then
    v_summary := public._aact538_build_since_last_login(v_org_id, v_user_id, true);
    insert into public.organization_activity_operations_summaries (
      organization_id, user_id, summary_type, previous_login_at, headline, summary_lines,
      top_changes, top_risks, top_opportunities, recommended_actions, companion_summary
    ) values (
      v_org_id, v_user_id, 'since_last_login',
      (v_summary->>'since')::timestamptz,
      coalesce(v_summary->>'headline', ''),
      coalesce(v_summary->'summary_lines', '[]'::jsonb),
      coalesce(v_summary->'top_changes', '[]'::jsonb),
      coalesce(v_summary->'top_risks', '[]'::jsonb),
      coalesce(v_summary->'top_opportunities', '[]'::jsonb),
      coalesce(v_summary->'recommended_actions', '[]'::jsonb),
      v_summary->>'companion_summary'
    ) returning id into v_id;
    perform public._aact538_log(v_org_id, 'summary_generated', 'Since Last Login summary generated', 'since_last_login', p_payload);
    return jsonb_build_object('ok', true, 'summary_id', v_id, 'summary', v_summary);

  elsif p_action_type = 'generate_summary' then
    v_summary := public._aact538_build_since_last_login(v_org_id, v_user_id, false);
    insert into public.organization_activity_operations_summaries (
      organization_id, user_id, summary_type, previous_login_at, headline, summary_lines,
      top_changes, top_risks, top_opportunities, recommended_actions, companion_summary
    ) values (
      v_org_id, v_user_id, coalesce(p_payload->>'summary_type', 'since_last_login'),
      (v_summary->>'since')::timestamptz,
      coalesce(v_summary->>'headline', ''),
      coalesce(v_summary->'summary_lines', '[]'::jsonb),
      coalesce(v_summary->'top_changes', '[]'::jsonb),
      coalesce(v_summary->'top_risks', '[]'::jsonb),
      coalesce(v_summary->'top_opportunities', '[]'::jsonb),
      coalesce(v_summary->'recommended_actions', '[]'::jsonb),
      v_summary->>'companion_summary'
    ) returning id into v_id;
    perform public._aact538_log(v_org_id, 'summary_generated', 'Activity summary generated', coalesce(p_payload->>'summary_type', 'since_last_login'), p_payload);
    return jsonb_build_object('ok', true, 'summary_id', v_id, 'summary', v_summary);

  elsif p_action_type = 'generate_highlights' then
    return jsonb_build_object('ok', true, 'highlights', public._aact538_generate_highlights(v_org_id, v_user_id));

  elsif p_action_type = 'record_event' then
    insert into public.organization_activity_operations_events (
      organization_id, event_number, scope, category, priority, title, summary,
      actor_user_id, department_id, domain_id, business_pack_key, entity_type, entity_id,
      record_href, impact_note, recommendation
    ) values (
      v_org_id, public._aact538_next_event_number(v_org_id),
      coalesce(p_payload->>'scope', 'organization'),
      coalesce(p_payload->>'category', 'operational_activity'),
      coalesce(p_payload->>'priority', 'information'),
      coalesce(p_payload->>'title', 'Activity event'),
      coalesce(p_payload->>'summary', ''),
      v_user_id,
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      p_payload->>'entity_type',
      nullif(p_payload->>'entity_id', '')::uuid,
      coalesce(p_payload->>'record_href', '/app/activity'),
      p_payload->>'impact_note',
      p_payload->>'recommendation'
    ) returning id into v_id;
    perform public._aact538_log(v_org_id, 'activity_created', 'Activity event recorded', p_payload->>'category', p_payload);
    return jsonb_build_object('ok', true, 'event_id', v_id);

  elsif p_action_type = 'companion_summary' then
    v_summary := public._aact538_build_since_last_login(v_org_id, v_user_id, false);
    perform public._aact538_log(v_org_id, 'companion_summary_generated', 'Companion activity summary generated', 'companion', p_payload);
    return jsonb_build_object('ok', true, 'summary', v_summary);

  elsif p_action_type = 'executive_briefing_viewed' then
    perform public._aact538_log(v_org_id, 'executive_briefing_viewed', 'Executive briefing activity section viewed', 'executive_briefing', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'digest_sent' then
    perform public._aact538_log(v_org_id, 'digest_sent', 'Activity digest sent', 'notifications', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'timeline_viewed' then
    perform public._aact538_log(v_org_id, 'timeline_viewed', 'Timeline viewed', coalesce(p_payload->>'scope', 'organization'), p_payload);
    return jsonb_build_object('ok', true);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_activity_operations_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
declare v_user_id uuid;
declare v_center jsonb;
declare v_search jsonb;
begin
  perform public._irp_require_permission('activity_operations.view');
  v_org_id := public._aact538_org();
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_center := public.get_activity_operations_center('companion');
  if p_query is not null and trim(p_query) <> '' then
    v_search := public.search_activity_operations(p_query, 15);
  end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify tells you what changed — and why it matters.',
    'query', p_query,
    'since_last_login', v_center->'since_last_login',
    'companion_highlights', v_center->'companion_highlights',
    'activity_intelligence', v_center->'activity_intelligence',
    'search', v_search,
    'companion_prompts', jsonb_build_array(
      'What changed since I was away?',
      'Show important events.',
      'Show only critical events.',
      'What should I focus on today?',
      'Generate executive summary.'
    ),
    'routes', jsonb_build_object(
      'activity', '/app/activity',
      'since_last_login', '/app/since-last-login',
      'search', '/app/search'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_activity_operations_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
declare v_user_id uuid;
declare v_since jsonb;
begin
  perform public._irp_require_permission('activity_operations.view');
  v_org_id := public._aact538_org();
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  v_since := public._aact538_build_since_last_login(v_org_id, v_user_id, false);

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('activity_operations.manage', v_org_id),
    'since_last_login', v_since,
    'highlights', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'summary', summary, 'priority', priority))
      from public.organization_activity_operations_highlights
      where organization_id = v_org_id and (user_id = v_user_id or user_id is null) and highlight_date = current_date
    ), '[]'::jsonb),
    'routes', jsonb_build_object(
      'activity', '/app/activity',
      'since_last_login', '/app/since-last-login',
      'approvals', '/app/approvals',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('activity', '/app/activity', 'since_last_login', '/app/since-last-login'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'activity_operations', 'Universal Activity & Timeline', 'activity-timeline', 'operations',
    'Universal activity center — since last login, personal and organization timelines, approvals, and Companion highlights.',
    'starter', null, 'main', '/app/activity', 'licensed', 4
  );
exception when others then null;
end $$;

insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
values
  ('activity_operations', 'activity_operations.view', 'view', 'Activity Center — view timelines and since-last-login summaries'),
  ('activity_operations', 'activity_operations.manage', 'manage', 'Activity Center — record events and manage activity settings')
on conflict do nothing;

grant execute on function public._aact538_event_json(public.organization_activity_operations_events) to authenticated;
grant execute on function public._aact538_seed_events(uuid) to authenticated;
grant execute on function public.search_activity_operations(text, int) to authenticated;
grant execute on function public.get_activity_operations_center(text) to authenticated;
grant execute on function public.perform_activity_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_activity_operations_context(text) to authenticated;
grant execute on function public.get_my_activity_operations_summary() to authenticated;
