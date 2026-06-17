-- Phase 329 — Companion Relationship Intelligence Engine
-- Advisory relationship insights — humans maintain relationships, Aipify assists.

create table if not exists public.companion_relationship_intelligence_settings (
  organization_id              uuid primary key references public.organizations (id) on delete cascade,
  manager_team_relationships_enabled boolean not null default false,
  admin_org_relationships_enabled    boolean not null default true,
  reminders_enabled                  boolean not null default true,
  preferences                        jsonb not null default '{}'::jsonb,
  updated_at                         timestamptz not null default now(),
  updated_by                         uuid references public.users (id) on delete set null
);

create table if not exists public.companion_relationship_profiles (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references public.organizations (id) on delete cascade,
  user_id             uuid not null references public.users (id) on delete cascade,
  profile_key         text not null default '',
  contact_name        text not null default '',
  organization_name   text not null default '',
  contact_role        text not null default '',
  relationship_type   text not null default 'customers' check (relationship_type in (
    'customers','prospects','partners','vendors','employees','executives',
    'advisors','investors','growth_partners','strategic_contacts'
  )),
  health_level        text not null default 'stable' check (health_level in (
    'excellent','healthy','stable','needs_attention','at_risk'
  )),
  health_score        integer not null default 50 check (health_score between 0 and 100),
  engagement_level    text not null default 'moderate' check (engagement_level in (
    'high','moderate','low','inactive'
  )),
  last_interaction_at date,
  recommended_action  text not null default 'schedule_check_in',
  owner_label         text not null default '',
  department          text not null default '',
  insight             text not null default '',
  signals             jsonb not null default '{}'::jsonb,
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (organization_id, user_id, profile_key)
);

create index if not exists companion_relationship_profiles_org_idx
  on public.companion_relationship_profiles (organization_id, user_id, health_level);

create table if not exists public.companion_relationship_interactions (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id      uuid not null references public.companion_relationship_profiles (id) on delete cascade,
  user_id         uuid not null references public.users (id) on delete cascade,
  interaction_type text not null check (interaction_type in (
    'meeting','call','email','task','follow_up','milestone','note'
  )),
  title           text not null default '',
  description     text not null default '',
  interaction_date date not null default current_date,
  created_at      timestamptz not null default now()
);

create index if not exists companion_relationship_interactions_profile_idx
  on public.companion_relationship_interactions (profile_id, interaction_date desc);

create table if not exists public.companion_relationship_opportunities (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id      uuid references public.companion_relationship_profiles (id) on delete set null,
  user_id         uuid not null references public.users (id) on delete cascade,
  opportunity_type text not null check (opportunity_type in (
    'reconnect','partnership','customer_expansion','retention','recognition'
  )),
  title           text not null default '',
  description     text not null default '',
  priority        text not null default 'medium',
  status          text not null default 'open' check (status in ('open','completed','dismissed')),
  created_at      timestamptz not null default now()
);

create table if not exists public.companion_relationship_reminders (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id      uuid references public.companion_relationship_profiles (id) on delete set null,
  user_id         uuid not null references public.users (id) on delete cascade,
  reminder_type   text not null check (reminder_type in (
    'birthday','work_anniversary','customer_anniversary','contract_renewal',
    'quarterly_review','relationship_check_in','partnership_review','milestone'
  )),
  title           text not null default '',
  due_date        date not null,
  status          text not null default 'scheduled' check (status in (
    'scheduled','completed','dismissed'
  )),
  created_at      timestamptz not null default now()
);

create table if not exists public.companion_relationship_recognition (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id      uuid references public.companion_relationship_profiles (id) on delete set null,
  user_id         uuid not null references public.users (id) on delete cascade,
  recognition_type text not null check (recognition_type in (
    'employee','partner','customer'
  )),
  title           text not null default '',
  description     text not null default '',
  status          text not null default 'suggested' check (status in ('suggested','acknowledged','dismissed')),
  created_at      timestamptz not null default now()
);

create table if not exists public.companion_relationship_timeline (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id      uuid references public.companion_relationship_profiles (id) on delete set null,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  performed_by    uuid references public.users (id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists companion_relationship_timeline_org_idx
  on public.companion_relationship_timeline (organization_id, created_at desc);

create table if not exists public.companion_relationship_audit_logs (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id      uuid references public.companion_relationship_profiles (id) on delete set null,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

alter table public.companion_relationship_intelligence_settings enable row level security;
alter table public.companion_relationship_profiles          enable row level security;
alter table public.companion_relationship_interactions      enable row level security;
alter table public.companion_relationship_opportunities     enable row level security;
alter table public.companion_relationship_reminders         enable row level security;
alter table public.companion_relationship_recognition       enable row level security;
alter table public.companion_relationship_timeline          enable row level security;
alter table public.companion_relationship_audit_logs        enable row level security;
revoke all on public.companion_relationship_intelligence_settings from authenticated, anon;
revoke all on public.companion_relationship_profiles          from authenticated, anon;
revoke all on public.companion_relationship_interactions      from authenticated, anon;
revoke all on public.companion_relationship_opportunities     from authenticated, anon;
revoke all on public.companion_relationship_reminders         from authenticated, anon;
revoke all on public.companion_relationship_recognition       from authenticated, anon;
revoke all on public.companion_relationship_timeline          from authenticated, anon;
revoke all on public.companion_relationship_audit_logs        from authenticated, anon;

create or replace function public._cri329_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_role text := 'member'; v_mgr boolean := false; v_adm boolean := true;
begin
  v_org_id  := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  select coalesce(m.role, 'member') into v_role
  from public.organization_users m
  where m.organization_id = v_org_id and m.user_id = v_user_id and m.status = 'active' limit 1;
  select coalesce(s.manager_team_relationships_enabled, false), coalesce(s.admin_org_relationships_enabled, true)
  into v_mgr, v_adm from public.companion_relationship_intelligence_settings s where s.organization_id = v_org_id;
  if v_role in ('owner', 'executive') then
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', true, 'can_organization', true, 'can_executive', true);
  elsif v_role in ('administrator', 'admin') and v_adm then
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', true, 'can_organization', true, 'can_executive', false);
  elsif v_role = 'manager' and v_mgr then
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', true, 'can_organization', false, 'can_executive', false);
  else
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', false, 'can_organization', false, 'can_executive', false);
  end if;
end; $$;

create or replace function public._cri329_log(
  p_org_id uuid, p_user_id uuid, p_profile_id uuid, p_event text, p_desc text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_relationship_audit_logs
    (organization_id, profile_id, user_id, event_type, description, metadata)
  values (p_org_id, p_profile_id, p_user_id, p_event, left(p_desc, 500), coalesce(p_meta, '{}'::jsonb));
end; $$;

create or replace function public._cri329_timeline(
  p_org_id uuid, p_profile_id uuid, p_user_id uuid, p_event text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_relationship_timeline
    (organization_id, profile_id, user_id, event_type, description, performed_by)
  values (p_org_id, p_profile_id, p_user_id, p_event, left(p_desc, 500), p_user_id);
end; $$;

create or replace function public._cri329_profile_json(p public.companion_relationship_profiles)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p.id, 'contact_name', p.contact_name, 'organization_name', p.organization_name,
    'contact_role', p.contact_role, 'relationship_type', p.relationship_type,
    'health_level', p.health_level, 'health_score', p.health_score,
    'engagement_level', p.engagement_level, 'last_interaction_at', p.last_interaction_at,
    'recommended_action', p.recommended_action, 'owner_label', p.owner_label,
    'department', p.department, 'insight', p.insight, 'signals', p.signals
  );
$$;

create or replace function public._cri329_seed_profiles(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_pid uuid;
begin
  if exists(select 1 from public.companion_relationship_profiles where organization_id = p_org_id and user_id = p_user_id limit 1) then
    return;
  end if;

  insert into public.companion_relationship_profiles (
    organization_id, user_id, profile_key, contact_name, organization_name, contact_role,
    relationship_type, health_level, health_score, engagement_level, last_interaction_at,
    recommended_action, owner_label, department, insight, signals
  ) values
    (p_org_id, p_user_id, 'rel_customer_acme', 'Elena Nordstrøm', 'Acme Industries', 'VP Operations',
     'customers', 'needs_attention', 62, 'moderate', current_date - 90,
     'schedule_check_in', 'You', 'Customer Success',
     'Your relationship with this customer may benefit from a check-in.',
     jsonb_build_object('communication_frequency', 'low', 'support_activity', 'moderate')),
    (p_org_id, p_user_id, 'rel_growth_partner', 'Marcus Chen', 'Nordic Growth Partners', 'Managing Partner',
     'growth_partners', 'at_risk', 48, 'inactive', current_date - 45,
     'reconnect', 'You', 'Partnerships',
     'This Growth Partner has not received communication in over 45 days.',
     jsonb_build_object('communication_frequency', 'very_low', 'meeting_activity', 'none')),
    (p_org_id, p_user_id, 'rel_employee', 'Sara Johansen', 'Internal', 'Senior Project Lead',
     'employees', 'excellent', 92, 'high', current_date - 3,
     'recognize', 'You', 'People',
     'This employee has completed several major initiatives and may deserve recognition.',
     jsonb_build_object('project_collaboration', 'high', 'engagement_patterns', 'rising')),
    (p_org_id, p_user_id, 'rel_prospect', 'David Park', 'BrightPath Solutions', 'CEO',
     'prospects', 'healthy', 78, 'high', current_date - 7,
     'follow_up', 'You', 'Sales',
     'This prospect has shown strong interest during the last two weeks.',
     jsonb_build_object('email_activity', 'high', 'meeting_activity', 'recent')),
    (p_org_id, p_user_id, 'rel_advisor', 'Dr. Ingrid Solberg', 'Independent', 'Strategic Advisor',
     'advisors', 'stable', 70, 'low', current_date - 120,
     'schedule_check_in', 'You', 'Executive',
     'You have not spoken with this advisor since the last strategic review.',
     jsonb_build_object('communication_frequency', 'low')),
    (p_org_id, p_user_id, 'rel_partner', 'TechBridge AS', 'TechBridge AS', 'Alliance Director',
     'partners', 'healthy', 80, 'moderate', current_date - 21,
     'partnership_review', 'You', 'Partnerships',
     'Partnership review due this quarter.',
     jsonb_build_object('project_collaboration', 'moderate', 'contract_activity', 'active'));

  select id into v_pid from public.companion_relationship_profiles
  where organization_id = p_org_id and user_id = p_user_id and profile_key = 'rel_customer_acme';

  insert into public.companion_relationship_interactions
    (organization_id, profile_id, user_id, interaction_type, title, description, interaction_date)
  values
    (p_org_id, v_pid, p_user_id, 'meeting', 'Quarterly review', 'Last quarterly business review.', current_date - 90),
    (p_org_id, v_pid, p_user_id, 'email', 'Proposal follow-up', 'Sent proposal follow-up email.', current_date - 85);

  insert into public.companion_relationship_opportunities
    (organization_id, profile_id, user_id, opportunity_type, title, description, priority)
  values
    (p_org_id, v_pid, p_user_id, 'reconnect', 'Customer check-in', 'Reconnect with strategic customer after 90 days.', 'high'),
    (p_org_id, null, p_user_id, 'retention', 'Retention outreach', 'Proactive retention conversation recommended.', 'medium'),
    (p_org_id, null, p_user_id, 'recognition', 'Employee recognition', 'Recognize Sara for major initiative completion.', 'high');

  insert into public.companion_relationship_reminders
    (organization_id, profile_id, user_id, reminder_type, title, due_date)
  select p_org_id, p.id, p_user_id, 'relationship_check_in', 'Relationship check-in: '||p.contact_name, current_date + 7
  from public.companion_relationship_profiles p
  where p.organization_id = p_org_id and p.user_id = p_user_id and p.health_level in ('needs_attention','at_risk');

  insert into public.companion_relationship_reminders
    (organization_id, profile_id, user_id, reminder_type, title, due_date)
  values
    (p_org_id, (select id from public.companion_relationship_profiles where profile_key = 'rel_employee' and organization_id = p_org_id limit 1),
     p_user_id, 'work_anniversary', 'Work anniversary — Sara Johansen', current_date + 14);

  insert into public.companion_relationship_recognition
    (organization_id, profile_id, user_id, recognition_type, title, description)
  values
    (p_org_id, (select id from public.companion_relationship_profiles where profile_key = 'rel_employee' and organization_id = p_org_id limit 1),
     p_user_id, 'employee', 'Recognize initiative completion',
     'Sara completed several major initiatives — consider recognition.');

  perform public._cri329_timeline(p_org_id, null, p_user_id, 'profiles_initialized', 'Relationship profiles initialized');
end; $$;

create or replace function public.get_companion_relationship_intelligence_dashboard(
  p_relationship_type text default null, p_health_level text default null,
  p_engagement_level text default null, p_owner text default null,
  p_department text default null, p_date_from date default null, p_search text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_role text;
  v_profiles jsonb; v_timeline jsonb; v_health int; v_attention int; v_strategic int;
begin
  v_ctx := public._cri329_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_role := coalesce(v_ctx->>'role', 'member');

  insert into public.companion_relationship_intelligence_settings (organization_id) values (v_org_id) on conflict do nothing;
  perform public._cri329_seed_profiles(v_org_id, v_user_id);

  select coalesce(avg(p.health_score)::int, 0),
         count(*) filter (where p.health_level in ('needs_attention','at_risk')),
         count(*) filter (where p.relationship_type in ('customers','partners','growth_partners','strategic_contacts','executives'))
  into v_health, v_attention, v_strategic
  from public.companion_relationship_profiles p
  where p.organization_id = v_org_id and p.user_id = v_user_id;

  select coalesce(jsonb_agg(public._cri329_profile_json(p) order by
    case p.health_level when 'at_risk' then 1 when 'needs_attention' then 2 else 3 end, p.health_score),'[]'::jsonb)
  into v_profiles
  from public.companion_relationship_profiles p
  where p.organization_id = v_org_id and p.user_id = v_user_id
    and (p_relationship_type is null or p.relationship_type = p_relationship_type)
    and (p_health_level is null or p.health_level = p_health_level)
    and (p_engagement_level is null or p.engagement_level = p_engagement_level)
    and (p_owner is null or p.owner_label ilike '%'||trim(p_owner)||'%')
    and (p_department is null or p.department ilike '%'||trim(p_department)||'%')
    and (p_search is null or trim(p_search) = ''
         or p.contact_name ilike '%'||trim(p_search)||'%' or p.organization_name ilike '%'||trim(p_search)||'%'
         or p.insight ilike '%'||trim(p_search)||'%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'event_type', t.event_type, 'description', t.description, 'created_at', t.created_at
  ) order by t.created_at desc),'[]'::jsonb) into v_timeline
  from (select * from public.companion_relationship_timeline t
    where t.organization_id = v_org_id and (t.user_id = v_user_id or t.user_id is null)
    order by t.created_at desc limit 12) t;

  return jsonb_build_object(
    'found', true,
    'has_relationships', jsonb_array_length(v_profiles) > 0,
    'role', v_role,
    'can_team', coalesce(v_ctx->>'can_team','false') = 'true',
    'can_organization', coalesce(v_ctx->>'can_organization','false') = 'true',
    'can_executive', coalesce(v_ctx->>'can_executive','false') = 'true',
    'relationship_health_score', v_health,
    'strategic_count', v_strategic,
    'attention_count', v_attention,
    'profiles', v_profiles,
    'timeline', v_timeline,
    'usage_example', 'Your relationship with this customer may benefit from a check-in.',
    'privacy_note', 'Relationship intelligence is advisory only. Humans remain responsible for relationship management.',
    'principle', 'People first. Relationships matter. Aipify assists — never replaces human connection.'
  );
end; $$;

create or replace function public.get_companion_relationship_profile(p_profile_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_p record; v_interactions jsonb;
begin
  v_ctx := public._cri329_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cri329_seed_profiles(v_org_id, v_user_id);

  select * into v_p from public.companion_relationship_profiles p
  where p.id = p_profile_id and p.organization_id = v_org_id and p.user_id = v_user_id;
  if not found then return jsonb_build_object('found', false); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'interaction_type', i.interaction_type, 'title', i.title,
    'description', i.description, 'interaction_date', i.interaction_date
  ) order by i.interaction_date desc),'[]'::jsonb) into v_interactions
  from public.companion_relationship_interactions i where i.profile_id = p_profile_id;

  return jsonb_build_object(
    'found', true,
    'profile', public._cri329_profile_json(v_p),
    'interactions', v_interactions
  );
end; $$;

create or replace function public.list_companion_relationship_opportunities()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_items jsonb;
begin
  v_ctx := public._cri329_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cri329_seed_profiles(v_org_id, v_user_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'profile_id', o.profile_id, 'opportunity_type', o.opportunity_type,
    'title', o.title, 'description', o.description, 'priority', o.priority, 'status', o.status
  ) order by case o.priority when 'high' then 1 when 'medium' then 2 else 3 end),'[]'::jsonb) into v_items
  from public.companion_relationship_opportunities o
  where o.organization_id = v_org_id and o.user_id = v_user_id and o.status = 'open';

  return jsonb_build_object('found', true, 'opportunities', v_items);
end; $$;

create or replace function public.list_companion_relationship_reminders()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_items jsonb; v_recognition jsonb;
begin
  v_ctx := public._cri329_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cri329_seed_profiles(v_org_id, v_user_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'profile_id', r.profile_id, 'reminder_type', r.reminder_type,
    'title', r.title, 'due_date', r.due_date, 'status', r.status
  ) order by r.due_date),'[]'::jsonb) into v_items
  from public.companion_relationship_reminders r
  where r.organization_id = v_org_id and r.user_id = v_user_id and r.status = 'scheduled';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', rc.id, 'profile_id', rc.profile_id, 'recognition_type', rc.recognition_type,
    'title', rc.title, 'description', rc.description, 'status', rc.status
  )),'[]'::jsonb) into v_recognition
  from public.companion_relationship_recognition rc
  where rc.organization_id = v_org_id and rc.user_id = v_user_id and rc.status = 'suggested';

  return jsonb_build_object('found', true, 'reminders', v_items, 'recognition', v_recognition);
end; $$;

create or replace function public.create_companion_relationship_note(
  p_profile_id uuid default null, p_title text default '', p_description text default '',
  p_interaction_type text default 'note'
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._cri329_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_profile_id is not null then
    insert into public.companion_relationship_interactions
      (organization_id, profile_id, user_id, interaction_type, title, description)
    values (v_org_id, p_profile_id, v_user_id, coalesce(p_interaction_type,'note'),
      left(coalesce(p_title,''), 200), left(coalesce(p_description,''), 500));
    update public.companion_relationship_profiles set last_interaction_at = current_date, updated_at = now()
    where id = p_profile_id and organization_id = v_org_id;
  end if;

  perform public._cri329_timeline(v_org_id, p_profile_id, v_user_id, 'note_added', coalesce(p_title, 'Relationship note added'));
  perform public._cri329_log(v_org_id, v_user_id, p_profile_id, 'note_added', coalesce(p_title, 'Relationship note added'));

  return jsonb_build_object('ok', true, 'profile_id', p_profile_id);
end; $$;

grant execute on function public.get_companion_relationship_intelligence_dashboard(text,text,text,text,text,date,text) to authenticated;
grant execute on function public.get_companion_relationship_profile(uuid) to authenticated;
grant execute on function public.list_companion_relationship_opportunities() to authenticated;
grant execute on function public.list_companion_relationship_reminders() to authenticated;
grant execute on function public.create_companion_relationship_note(uuid,text,text,text) to authenticated;
