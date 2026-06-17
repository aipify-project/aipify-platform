-- Phase 330 — Executive Companion Layer (Companion Maturity capstone)
-- Unified executive experience — advisory only, Golden Rule enforced.

create table if not exists public.companion_executive_layer_settings (
  organization_id              uuid primary key references public.organizations (id) on delete cascade,
  manager_limited_access_enabled boolean not null default true,
  default_focus_limit            integer not null default 5 check (default_focus_limit in (3, 5, 10)),
  default_workspace_view         text not null default 'organization' check (default_workspace_view in (
    'personal','organization','strategic','growth','future'
  )),
  preferences                    jsonb not null default '{}'::jsonb,
  updated_at                     timestamptz not null default now(),
  updated_by                       uuid references public.users (id) on delete set null
);

create table if not exists public.companion_executive_briefings (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references public.organizations (id) on delete cascade,
  user_id             uuid not null references public.users (id) on delete cascade,
  briefing_key        text not null default '',
  briefing_period     text not null default 'today' check (briefing_period in (
    'today','this_week','this_month','this_quarter'
  )),
  executive_summary   text not null default '',
  organizational_summary text not null default '',
  daily_opening       text not null default '',
  briefing_date       date not null default current_date,
  status              text not null default 'active',
  generated_at        timestamptz not null default now(),
  unique (organization_id, user_id, briefing_period, briefing_date)
);

create table if not exists public.companion_executive_priorities (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid not null references public.users (id) on delete cascade,
  priority_key    text not null default '',
  title           text not null default '',
  description     text not null check (char_length(description) <= 500),
  focus_area      text not null default 'strategic' check (focus_area in (
    'strategic','operational','growth','workforce','customer'
  )),
  priority_level  text not null default 'high',
  rank_order      integer not null default 0,
  due_date        date,
  status          text not null default 'open',
  metadata        jsonb not null default '{}'::jsonb,
  unique (organization_id, user_id, priority_key)
);

create table if not exists public.companion_executive_actions (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid not null references public.users (id) on delete cascade,
  action_key      text not null default '',
  action_type     text not null check (action_type in (
    'decision_review','approval','strategic_review','readiness','follow_up','relationship'
  )),
  title           text not null default '',
  description     text not null default '',
  priority        text not null default 'high',
  status          text not null default 'pending',
  due_date        date,
  unique (organization_id, user_id, action_key)
);

create table if not exists public.companion_executive_insights (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid not null references public.users (id) on delete cascade,
  insight_key     text not null default '',
  insight_type    text not null check (insight_type in ('risk','opportunity','decision_support','intelligence')),
  observation     text not null default '',
  explanation     text not null default '',
  impact          text not null default '',
  recommendation  text not null default '',
  effort          text not null default '',
  potential_value text not null default '',
  source_module   text not null default 'companion',
  unique (organization_id, user_id, insight_key)
);

create table if not exists public.companion_executive_timeline (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  performed_by    uuid references public.users (id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists companion_executive_timeline_org_idx
  on public.companion_executive_timeline (organization_id, created_at desc);

create table if not exists public.companion_executive_audit_logs (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

alter table public.companion_executive_layer_settings enable row level security;
alter table public.companion_executive_briefings         enable row level security;
alter table public.companion_executive_priorities        enable row level security;
alter table public.companion_executive_actions           enable row level security;
alter table public.companion_executive_insights          enable row level security;
alter table public.companion_executive_timeline          enable row level security;
alter table public.companion_executive_audit_logs        enable row level security;
revoke all on public.companion_executive_layer_settings from authenticated, anon;
revoke all on public.companion_executive_briefings         from authenticated, anon;
revoke all on public.companion_executive_priorities        from authenticated, anon;
revoke all on public.companion_executive_actions           from authenticated, anon;
revoke all on public.companion_executive_insights          from authenticated, anon;
revoke all on public.companion_executive_timeline          from authenticated, anon;
revoke all on public.companion_executive_audit_logs        from authenticated, anon;

create or replace function public._cel330_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_role text := 'member'; v_mgr boolean := true;
begin
  v_org_id  := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  select coalesce(m.role, 'member') into v_role
  from public.organization_users m
  where m.organization_id = v_org_id and m.user_id = v_user_id and m.status = 'active' limit 1;
  select coalesce(s.manager_limited_access_enabled, true)
  into v_mgr from public.companion_executive_layer_settings s where s.organization_id = v_org_id;

  if v_role in ('owner', 'executive') then
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_access', true, 'can_full', true, 'can_limited', false);
  elsif v_role in ('administrator', 'admin') then
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_access', true, 'can_full', true, 'can_limited', false);
  elsif v_role = 'manager' and v_mgr then
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_access', true, 'can_full', false, 'can_limited', true);
  else
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_access', false, 'can_full', false, 'can_limited', false);
  end if;
end; $$;

create or replace function public._cel330_require_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb;
begin
  v_ctx := public._cel330_access();
  if coalesce(v_ctx->>'can_access','false') <> 'true' then
    raise exception 'Executive Companion access denied for this role';
  end if;
  return v_ctx;
end; $$;

create or replace function public._cel330_log(
  p_org_id uuid, p_user_id uuid, p_event text, p_desc text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_executive_audit_logs
    (organization_id, user_id, event_type, description, metadata)
  values (p_org_id, p_user_id, p_event, left(p_desc, 500), coalesce(p_meta, '{}'::jsonb));
end; $$;

create or replace function public._cel330_seed(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists(select 1 from public.companion_executive_priorities where organization_id = p_org_id and user_id = p_user_id limit 1) then
    return;
  end if;

  insert into public.companion_executive_briefings (
    organization_id, user_id, briefing_key, briefing_period, executive_summary,
    organizational_summary, daily_opening
  ) values
    (p_org_id, p_user_id, 'brief_today', 'today',
     'Three strategic items require attention. One executive review is overdue. Two opportunities deserve consideration.',
     'Organizational momentum is stable with elevated attention on approvals and customer engagement.',
     'Good morning. Three strategic items require attention. One executive review is overdue. Two opportunities deserve consideration. One partner milestone is approaching.'),
    (p_org_id, p_user_id, 'brief_week', 'this_week',
     'Weekly executive focus: strategic reviews, customer expansion, and workforce recognition.',
     'Organization approaching a major milestone this month.',
     'This week: prioritize overdue approval, executive check-in, and partnership review.');

  insert into public.companion_executive_priorities
    (organization_id, user_id, priority_key, title, description, focus_area, priority_level, rank_order, due_date)
  values
    (p_org_id, p_user_id, 'pri_approval', 'Approval blocking initiatives',
     'One approval is blocking multiple downstream initiatives.', 'operational', 'critical', 1, current_date),
    (p_org_id, p_user_id, 'pri_review', 'Executive review overdue', 'Strategic planning review requires attention.', 'strategic', 'high', 2, current_date - 1),
    (p_org_id, p_user_id, 'pri_customer', 'Customer engagement opportunity',
     'Customer engagement improved — executive check-in recommended.', 'customer', 'high', 3, current_date + 2),
    (p_org_id, p_user_id, 'pri_growth', 'Growth partnership milestone', 'Growth Partner milestone approaching.', 'growth', 'medium', 4, current_date + 5),
    (p_org_id, p_user_id, 'pri_workforce', 'Employee recognition', 'Key employee completed major initiatives.', 'workforce', 'medium', 5, current_date + 3);

  insert into public.companion_executive_actions
    (organization_id, user_id, action_key, action_type, title, description, priority, due_date)
  values
    (p_org_id, p_user_id, 'act_approval', 'approval', 'Budget approval pending',
     'Decision awaiting review — estimated 10 minutes.', 'critical', current_date),
    (p_org_id, p_user_id, 'act_decision', 'decision_review', 'Strategic initiative decision',
     'Initiative scope decision requires executive input.', 'high', current_date + 1),
    (p_org_id, p_user_id, 'act_followup', 'follow_up', 'Partner follow-up commitment',
     'Follow-up from last executive session remains open.', 'medium', current_date + 2),
    (p_org_id, p_user_id, 'act_relationship', 'relationship', 'Advisor check-in',
     'Strategic advisor has not been contacted since last review.', 'medium', current_date + 7);

  insert into public.companion_executive_insights
    (organization_id, user_id, insight_key, insight_type, observation, explanation, impact, recommendation, effort, potential_value, source_module)
  values
    (p_org_id, p_user_id, 'ins_approval', 'decision_support', 'One approval blocking multiple initiatives.',
     'Downstream teams cannot proceed until sign-off.', 'High operational and strategic delay.',
     'Review today.', '10 minutes', 'High', 'companion'),
    (p_org_id, p_user_id, 'ins_customer', 'opportunity', 'Customer engagement has improved significantly.',
     'Engagement trend positive over last 30 days.', 'Retention and expansion potential.',
     'Schedule an executive check-in.', '30 minutes', 'High', 'relationship_intelligence'),
    (p_org_id, p_user_id, 'ins_milestone', 'risk', 'Organization approaching a major milestone.',
     'Quarterly milestone due within two weeks.', 'Leadership visibility and alignment needed.',
     'Prepare executive summary.', '45 minutes', 'High', 'companion'),
    (p_org_id, p_user_id, 'ins_intel', 'intelligence', 'Cross-functional readiness elevated.',
     'Readiness and forecasting signals align on growth focus.', 'Supports strategic allocation.',
     'Review intelligence modules.', '20 minutes', 'Moderate', 'enterprise_intelligence');

  insert into public.companion_executive_timeline
    (organization_id, user_id, event_type, description, performed_by)
  values
    (p_org_id, p_user_id, 'briefing_generated', 'Executive briefing generated', p_user_id),
    (p_org_id, p_user_id, 'strategic_review', 'Strategic review scheduled', p_user_id);

  perform public._cel330_log(p_org_id, p_user_id, 'layer_initialized', 'Executive Companion Layer initialized');
end; $$;

create or replace function public.generate_companion_executive_briefing(p_period text default 'today')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_id uuid;
begin
  v_ctx := public._cel330_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  insert into public.companion_executive_layer_settings (organization_id) values (v_org_id) on conflict do nothing;
  perform public._cel330_seed(v_org_id, v_user_id);

  insert into public.companion_executive_briefings (
    organization_id, user_id, briefing_key, briefing_period, executive_summary, organizational_summary, daily_opening, generated_at
  ) values (
    v_org_id, v_user_id, 'brief_'||coalesce(p_period,'today')||'_'||current_date::text,
    coalesce(p_period,'today'),
    'Executive briefing regenerated for '||coalesce(p_period,'today')||'.',
    'Organizational summary updated.',
    'Good morning. Your executive companion briefing is ready.',
    now()
  )
  on conflict (organization_id, user_id, briefing_period, briefing_date) do update set
    executive_summary = excluded.executive_summary,
    organizational_summary = excluded.organizational_summary,
    daily_opening = excluded.daily_opening,
    generated_at = now()
  returning id into v_id;

  insert into public.companion_executive_timeline
    (organization_id, user_id, event_type, description, performed_by)
  values (v_org_id, v_user_id, 'briefing_generated', 'Executive briefing generated', v_user_id);

  return jsonb_build_object('ok', true, 'briefing_id', v_id);
end; $$;

create or replace function public.get_companion_executive_layer_dashboard(
  p_workspace text default null, p_search text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_role text;
  v_priorities jsonb; v_actions jsonb; v_insights jsonb; v_timeline jsonb; v_briefing record;
  v_risk int; v_opp int;
begin
  v_ctx := public._cel330_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_role := coalesce(v_ctx->>'role', 'member');
  insert into public.companion_executive_layer_settings (organization_id) values (v_org_id) on conflict do nothing;
  perform public._cel330_seed(v_org_id, v_user_id);

  select * into v_briefing from public.companion_executive_briefings b
  where b.organization_id = v_org_id and b.user_id = v_user_id and b.briefing_period = 'today' and b.briefing_date = current_date;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'title', p.title, 'description', p.description, 'focus_area', p.focus_area,
    'priority_level', p.priority_level, 'rank_order', p.rank_order, 'due_date', p.due_date
  ) order by p.rank_order),'[]'::jsonb) into v_priorities
  from public.companion_executive_priorities p
  where p.organization_id = v_org_id and p.user_id = v_user_id and p.status = 'open'
    and (p_search is null or trim(p_search) = '' or p.title ilike '%'||trim(p_search)||'%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'action_type', a.action_type, 'title', a.title, 'description', a.description,
    'priority', a.priority, 'status', a.status, 'due_date', a.due_date
  )),'[]'::jsonb) into v_actions
  from public.companion_executive_actions a
  where a.organization_id = v_org_id and a.user_id = v_user_id and a.status = 'pending';

  select count(*) filter (where insight_type = 'risk'),
         count(*) filter (where insight_type = 'opportunity')
  into v_risk, v_opp
  from public.companion_executive_insights where organization_id = v_org_id and user_id = v_user_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'insight_type', i.insight_type, 'observation', i.observation,
    'explanation', i.explanation, 'impact', i.impact, 'recommendation', i.recommendation,
    'effort', i.effort, 'potential_value', i.potential_value, 'source_module', i.source_module
  )),'[]'::jsonb) into v_insights
  from public.companion_executive_insights i
  where i.organization_id = v_org_id and i.user_id = v_user_id
    and (p_search is null or trim(p_search) = '' or i.observation ilike '%'||trim(p_search)||'%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'event_type', t.event_type, 'description', t.description, 'created_at', t.created_at
  ) order by t.created_at desc),'[]'::jsonb) into v_timeline
  from (select * from public.companion_executive_timeline t where t.organization_id = v_org_id
    order by t.created_at desc limit 12) t;

  return jsonb_build_object(
    'found', true,
    'has_briefing', v_briefing.id is not null,
    'role', v_role,
    'can_full', coalesce(v_ctx->>'can_full','false') = 'true',
    'can_limited', coalesce(v_ctx->>'can_limited','false') = 'true',
    'workspace_view', coalesce(p_workspace, 'organization'),
    'executive_health_score', 82,
    'organizational_health_score', 76,
    'executive_readiness_score', 79,
    'risk_count', v_risk,
    'opportunity_count', v_opp,
    'daily_opening', coalesce(v_briefing.daily_opening, 'Good morning. Your Executive Companion is ready.'),
    'executive_summary', coalesce(v_briefing.executive_summary, ''),
    'organizational_summary', coalesce(v_briefing.organizational_summary, ''),
    'priorities', v_priorities,
    'actions', v_actions,
    'insights', v_insights,
    'timeline', v_timeline,
    'intelligence_modules', jsonb_build_array(
      jsonb_build_object('key', 'benchmarking', 'label', 'Benchmarking', 'status', 'available'),
      jsonb_build_object('key', 'forecasting', 'label', 'Forecasting', 'status', 'available'),
      jsonb_build_object('key', 'readiness', 'label', 'Readiness', 'status', 'elevated'),
      jsonb_build_object('key', 'opportunities', 'label', 'Opportunities', 'status', 'active'),
      jsonb_build_object('key', 'future_state', 'label', 'Future-State Planning', 'status', 'available'),
      jsonb_build_object('key', 'scenario_planning', 'label', 'Scenario Planning', 'status', 'available'),
      jsonb_build_object('key', 'cross_functional', 'label', 'Cross-Functional Intelligence', 'status', 'active')
    ),
    'usage_example', 'You have one approval blocking multiple initiatives. Estimated review time: 10 minutes. Potential impact: High.',
    'privacy_note', 'Aipify provides context and recommendations. Leadership remains responsible for decisions.',
    'principle', 'One place for executive visibility. High signal, low noise. Companion Golden Rule enforced.',
    'golden_rule', 'Observation → Explanation → Impact → Recommendation → Effort → Value'
  );
end; $$;

create or replace function public.get_companion_executive_layer_briefing(p_period text default 'today')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_b record;
begin
  v_ctx := public._cel330_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cel330_seed(v_org_id, v_user_id);

  select * into v_b from public.companion_executive_briefings b
  where b.organization_id = v_org_id and b.user_id = v_user_id
    and b.briefing_period = coalesce(p_period,'today')
  order by b.briefing_date desc limit 1;

  return jsonb_build_object(
    'found', v_b.id is not null,
    'period', coalesce(p_period,'today'),
    'daily_opening', coalesce(v_b.daily_opening, ''),
    'executive_summary', coalesce(v_b.executive_summary, ''),
    'organizational_summary', coalesce(v_b.organizational_summary, ''),
    'generated_at', v_b.generated_at
  );
end; $$;

create or replace function public.get_companion_executive_layer_priorities(p_limit integer default 5)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_items jsonb; v_limit int;
begin
  v_ctx := public._cel330_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cel330_seed(v_org_id, v_user_id);
  v_limit := greatest(3, least(coalesce(p_limit, 5), 10));

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'title', p.title, 'description', p.description, 'focus_area', p.focus_area,
    'priority_level', p.priority_level, 'rank_order', p.rank_order, 'due_date', p.due_date
  ) order by p.rank_order),'[]'::jsonb) into v_items
  from (select * from public.companion_executive_priorities p
    where p.organization_id = v_org_id and p.user_id = v_user_id and p.status = 'open'
    order by p.rank_order limit v_limit) p;

  return jsonb_build_object('found', true, 'focus_limit', v_limit, 'priorities', v_items);
end; $$;

create or replace function public.get_companion_executive_layer_relationships()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_items jsonb;
begin
  v_ctx := public._cel330_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cel330_seed(v_org_id, v_user_id);

  select coalesce(jsonb_agg(public._cri329_profile_json(p)),'[]'::jsonb) into v_items
  from (
    select * from public.companion_relationship_profiles p
    where p.organization_id = v_org_id and p.user_id = v_user_id
      and p.relationship_type in ('customers','partners','growth_partners','advisors','employees')
    order by p.health_score asc
    limit 8
  ) p;

  return jsonb_build_object(
    'found', true,
    'relationships', v_items,
    'recognition_opportunities', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', r.id, 'title', r.title, 'description', r.description, 'recognition_type', r.recognition_type
      )),'[]'::jsonb)
      from public.companion_relationship_recognition r
      where r.organization_id = v_org_id and r.user_id = v_user_id and r.status = 'suggested'
    )
  );
exception when undefined_table then
  return jsonb_build_object('found', true, 'relationships', '[]'::jsonb, 'recognition_opportunities', '[]'::jsonb);
end; $$;

create or replace function public.get_companion_executive_layer_intelligence()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._cel330_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cel330_seed(v_org_id, v_user_id);

  return jsonb_build_object(
    'found', true,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'benchmarking', 'summary', 'Performance benchmarks stable across key metrics.'),
      jsonb_build_object('key', 'forecasting', 'summary', 'Growth forecast aligned with current pipeline.'),
      jsonb_build_object('key', 'readiness', 'summary', 'Organizational readiness elevated for Q2 initiatives.'),
      jsonb_build_object('key', 'opportunities', 'summary', 'Two expansion opportunities identified.'),
      jsonb_build_object('key', 'future_state', 'summary', 'Future-state planning review recommended this month.'),
      jsonb_build_object('key', 'scenario_planning', 'summary', 'Scenario models available for strategic review.'),
      jsonb_build_object('key', 'cross_functional', 'summary', 'Cross-functional signals indicate customer focus priority.')
    ),
    'decision_support', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'observation', i.observation, 'explanation', i.explanation, 'impact', i.impact,
        'recommendation', i.recommendation, 'effort', i.effort, 'potential_value', i.potential_value
      )),'[]'::jsonb)
      from public.companion_executive_insights i
      where i.organization_id = v_org_id and i.user_id = v_user_id and i.insight_type = 'decision_support'
    )
  );
end; $$;

grant execute on function public.generate_companion_executive_briefing(text) to authenticated;
grant execute on function public.get_companion_executive_layer_dashboard(text,text) to authenticated;
grant execute on function public.get_companion_executive_layer_briefing(text) to authenticated;
grant execute on function public.get_companion_executive_layer_priorities(integer) to authenticated;
grant execute on function public.get_companion_executive_layer_relationships() to authenticated;
grant execute on function public.get_companion_executive_layer_intelligence() to authenticated;
