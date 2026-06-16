-- Phase 284 (APP) — Organizational Communications & Announcements Center

create table if not exists public.app_portal_communications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  summary text not null default '',
  full_message text not null default '',
  communication_type text not null check (communication_type in (
    'company_announcement', 'operational_update', 'policy_update', 'security_notice',
    'executive_message', 'team_update', 'maintenance_notification', 'celebration_recognition',
    'emergency_communication', 'custom_communication'
  )),
  author_id uuid references public.users (id) on delete set null,
  publish_date timestamptz,
  expiration_date timestamptz,
  audience_type text not null default 'entire_organization' check (audience_type in (
    'entire_organization', 'specific_departments', 'administrators_only', 'executives_only',
    'custom_groups', 'individual_users'
  )),
  audience_target_ids jsonb not null default '[]'::jsonb,
  priority text not null default 'informational' check (priority in (
    'informational', 'important', 'high_priority', 'critical'
  )),
  status text not null default 'draft' check (status in (
    'draft', 'scheduled', 'published', 'expired', 'archived'
  )),
  related_modules jsonb not null default '[]'::jsonb,
  related_policy_ids jsonb not null default '[]'::jsonb,
  attachments_placeholder jsonb not null default '[]'::jsonb,
  requires_acknowledgement boolean not null default false,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_communications_company_idx
  on public.app_portal_communications (company_id, communication_type, status, publish_date desc);

create table if not exists public.app_portal_communication_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  communication_id uuid not null references public.app_portal_communications (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  acknowledged_at timestamptz not null default now(),
  unique (communication_id, user_id)
);

create index if not exists app_portal_communication_ack_idx
  on public.app_portal_communication_acknowledgements (communication_id, acknowledged_at desc);

create table if not exists public.app_portal_communication_audit_logs (
  id uuid primary key default gen_random_uuid(),
  communication_id uuid not null references public.app_portal_communications (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_communication_audit_idx
  on public.app_portal_communication_audit_logs (communication_id, created_at desc);

alter table public.app_portal_communications enable row level security;
alter table public.app_portal_communication_acknowledgements enable row level security;
alter table public.app_portal_communication_audit_logs enable row level security;
revoke all on public.app_portal_communications from authenticated, anon;
revoke all on public.app_portal_communication_acknowledgements from authenticated, anon;
revoke all on public.app_portal_communication_audit_logs from authenticated, anon;

create or replace function public._aoca284_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
  v_role text;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'is_executive', v_role in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._aoca284_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._aoca284_derive_status(c public.app_portal_communications)
returns text
language sql
stable
as $$
  select case
    when c.status = 'archived' then 'archived'
    when c.expiration_date is not null and c.expiration_date < now() then 'expired'
    when c.status = 'scheduled' and c.publish_date is not null and c.publish_date <= now() then 'published'
    when c.status = 'draft' then 'draft'
    when c.status = 'scheduled' then 'scheduled'
    else coalesce(nullif(c.status, ''), 'draft')
  end;
$$;

create or replace function public._aoca284_can_view(
  c public.app_portal_communications,
  p_ctx jsonb
)
returns boolean
language plpgsql
stable
as $$
declare v_uid uuid;
declare v_role text;
begin
  if (p_ctx->>'company_id')::uuid <> c.company_id then return false; end if;
  if coalesce(p_ctx->>'can_manage', 'false') = 'true' then return true; end if;
  if public._aoca284_derive_status(c) = 'draft' then return false; end if;
  if public._aoca284_derive_status(c) not in ('published', 'scheduled', 'expired') then return false; end if;

  v_uid := (p_ctx->>'user_id')::uuid;
  v_role := p_ctx->>'organization_role';

  if c.audience_type = 'entire_organization' then return true; end if;
  if c.audience_type = 'administrators_only' and v_role in ('organization_owner', 'organization_admin') then return true; end if;
  if c.audience_type = 'executives_only' and v_role in ('organization_owner', 'organization_admin', 'organization_manager') then return true; end if;
  if c.audience_type in ('specific_departments', 'custom_groups', 'individual_users')
     and coalesce(c.audience_target_ids, '[]'::jsonb) @> jsonb_build_array(v_uid::text) then return true; end if;

  return false;
end;
$$;

create or replace function public._aoca284_ack_count(p_communication_id uuid)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'acknowledged', count(*)::int,
    'recent', coalesce(jsonb_agg(jsonb_build_object(
      'user_id', a.user_id,
      'user_name', public._aoca284_user_name(a.user_id),
      'acknowledged_at', a.acknowledged_at
    ) order by a.acknowledged_at desc), '[]'::jsonb)
  )
  from public.app_portal_communication_acknowledgements a
  where a.communication_id = p_communication_id;
$$;

create or replace function public._aoca284_row(c public.app_portal_communications, p_ctx jsonb default null)
returns jsonb
language plpgsql
stable
as $$
declare
  v_status text;
  v_uid uuid;
  v_ack boolean := false;
  v_ack_count integer := 0;
begin
  v_status := public._aoca284_derive_status(c);
  if p_ctx is not null then
    v_uid := (p_ctx->>'user_id')::uuid;
    select exists(
      select 1 from public.app_portal_communication_acknowledgements a
      where a.communication_id = c.id and a.user_id = v_uid
    ) into v_ack;
  end if;
  select count(*)::int into v_ack_count
  from public.app_portal_communication_acknowledgements a where a.communication_id = c.id;

  return jsonb_build_object(
    'id', c.id,
    'title', c.title,
    'summary', left(c.summary, 300),
    'communication_type', c.communication_type,
    'author_id', c.author_id,
    'author_name', public._aoca284_user_name(c.author_id),
    'publish_date', c.publish_date,
    'expiration_date', c.expiration_date,
    'audience_type', c.audience_type,
    'audience_target_ids', c.audience_target_ids,
    'priority', c.priority,
    'status', v_status,
    'requires_acknowledgement', c.requires_acknowledgement,
    'related_modules', c.related_modules,
    'related_policy_ids', c.related_policy_ids,
    'attachments_placeholder', c.attachments_placeholder,
    'expiring_soon', (
      c.expiration_date is not null and c.expiration_date between now() and now() + interval '30 days'
      and v_status = 'published'
    ),
    'user_acknowledged', v_ack,
    'acknowledgement_count', v_ack_count,
    'created_at', c.created_at,
    'updated_at', c.updated_at
  );
end;
$$;

create or replace function public._aoca284_build_recommendations(p_items jsonb, p_critical integer)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_item jsonb;
begin
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    if (v_item->>'priority') = 'critical' and (v_item->>'status') = 'published' and coalesce((v_item->>'user_acknowledged')::boolean, false) = false then
      v_recs := v_recs || jsonb_build_object('id', 'ack-' || (v_item->>'id'), 'key', 'remindAcknowledgement', 'communication_id', v_item->>'id', 'priority', 'high');
    elsif coalesce((v_item->>'expiring_soon')::boolean, false) then
      v_recs := v_recs || jsonb_build_object('id', 'archive-' || (v_item->>'id'), 'key', 'archiveOutdated', 'communication_id', v_item->>'id', 'priority', 'low');
    elsif (v_item->>'communication_type') = 'security_notice' and (v_item->>'status') = 'draft' then
      v_recs := v_recs || jsonb_build_object('id', 'security-' || (v_item->>'id'), 'key', 'publishSecurityPromptly', 'communication_id', v_item->>'id', 'priority', 'high');
    end if;
  end loop;
  if p_critical > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'critical-notices', 'key', 'remindAcknowledgement', 'priority', 'high');
  end if;
  v_recs := v_recs || jsonb_build_object('id', 'review-audience', 'key', 'reviewAudience', 'priority', 'medium');
  v_recs := v_recs || jsonb_build_object('id', 'recurring-updates', 'key', 'scheduleRecurring', 'priority', 'low');
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_communications(
  p_communication_type text default null,
  p_author_id uuid default null,
  p_status text default null,
  p_priority text default null,
  p_audience_type text default null,
  p_publish_from timestamptz default null,
  p_publish_to timestamptz default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_items jsonb := '[]'::jsonb;
  v_active integer := 0;
  v_scheduled integer := 0;
  v_critical integer := 0;
  v_expiring integer := 0;
  v_drafts integer := 0;
  v_recent jsonb := '[]'::jsonb;
begin
  v_ctx := public._aoca284_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._aoca284_row(c, v_ctx) order by coalesce(c.publish_date, c.created_at) desc), '[]'::jsonb)
  into v_items
  from public.app_portal_communications c
  where c.company_id = v_company_id
    and public._aoca284_can_view(c, v_ctx)
    and (p_communication_type is null or c.communication_type = p_communication_type)
    and (p_author_id is null or c.author_id = p_author_id)
    and (p_status is null or public._aoca284_derive_status(c) = p_status)
    and (p_priority is null or c.priority = p_priority)
    and (p_audience_type is null or c.audience_type = p_audience_type)
    and (p_publish_from is null or c.publish_date >= p_publish_from)
    and (p_publish_to is null or c.publish_date <= p_publish_to)
    and (
      p_search is null or trim(p_search) = ''
      or c.title ilike '%' || trim(p_search) || '%'
      or c.summary ilike '%' || trim(p_search) || '%'
      or c.full_message ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active
  from public.app_portal_communications c
  where c.company_id = v_company_id and public._aoca284_derive_status(c) = 'published';

  select count(*)::int into v_scheduled
  from public.app_portal_communications c
  where c.company_id = v_company_id and public._aoca284_derive_status(c) = 'scheduled';

  select count(*)::int into v_critical
  from public.app_portal_communications c
  where c.company_id = v_company_id
    and c.priority = 'critical' and public._aoca284_derive_status(c) = 'published';

  select count(*)::int into v_expiring
  from public.app_portal_communications c
  where c.company_id = v_company_id
    and c.expiration_date between now() and now() + interval '30 days'
    and public._aoca284_derive_status(c) = 'published';

  select count(*)::int into v_drafts
  from public.app_portal_communications c
  where c.company_id = v_company_id and public._aoca284_derive_status(c) = 'draft'
    and coalesce(v_ctx->>'can_manage', 'false') = 'true';

  select coalesce(jsonb_agg(public._aoca284_row(c, v_ctx) order by c.publish_date desc nulls last), '[]'::jsonb)
  into v_recent
  from (
    select c2.* from public.app_portal_communications c2
    where c2.company_id = v_company_id and public._aoca284_derive_status(c2) = 'published'
    order by c2.publish_date desc nulls last limit 5
  ) c;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active', v_active,
      'scheduled', v_scheduled,
      'critical', v_critical,
      'expiring', v_expiring,
      'recently_published', v_recent,
      'drafts', v_drafts
    ),
    'recommendations', public._aoca284_build_recommendations(v_items, v_critical),
    'principle', 'Clear communication strengthens transparency — humans approve and own every message.'
  );
end;
$$;

create or replace function public.get_app_portal_communication(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_c public.app_portal_communications;
  v_audit jsonb := '[]'::jsonb;
  v_policies jsonb := '[]'::jsonb;
  v_ack_data jsonb;
  v_uid uuid;
begin
  v_ctx := public._aoca284_access_context();
  v_uid := (v_ctx->>'user_id')::uuid;
  select * into v_c from public.app_portal_communications where id = p_id;
  if v_c.id is null then return jsonb_build_object('found', false); end if;
  if not public._aoca284_can_view(v_c, v_ctx) then
    raise exception 'Communication access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._aoca284_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_communication_audit_logs l where l.communication_id = p_id;

  if to_regclass('public.app_portal_compliance_policies') is not null
     and jsonb_array_length(coalesce(v_c.related_policy_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'title', p.title, 'status', p.status)), '[]'::jsonb)
    into v_policies
    from public.app_portal_compliance_policies p
    where p.id in (select t.value::uuid from jsonb_array_elements_text(v_c.related_policy_ids) as t(value));
  end if;

  v_ack_data := public._aoca284_ack_count(p_id);

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'communication', public._aoca284_row(v_c, v_ctx) || jsonb_build_object(
      'summary_full', v_c.summary,
      'full_message', v_c.full_message
    ),
    'related_policies', v_policies,
    'delivery_status', jsonb_build_object(
      'acknowledged_count', (v_ack_data->>'acknowledged')::int,
      'outstanding_note', 'Audience-specific totals require manager review'
    ),
    'acknowledgements', v_ack_data->'recent',
    'user_acknowledgement', jsonb_build_object(
      'acknowledged', exists(select 1 from public.app_portal_communication_acknowledgements a where a.communication_id = p_id and a.user_id = v_uid),
      'pending', not exists(select 1 from public.app_portal_communication_acknowledgements a where a.communication_id = p_id and a.user_id = v_uid)
        and public._aoca284_derive_status(v_c) = 'published'
    ),
    'activity_timeline', v_audit,
    'audit_history', v_audit,
    'recommendations', public._aoca284_build_recommendations(jsonb_build_array(public._aoca284_row(v_c, v_ctx)), 0)
  );
end;
$$;

create or replace function public.create_app_portal_communication(
  p_title text,
  p_summary text default '',
  p_full_message text default '',
  p_communication_type text default 'company_announcement',
  p_audience_type text default 'entire_organization',
  p_priority text default 'informational',
  p_publish_date timestamptz default null,
  p_expiration_date timestamptz default null,
  p_requires_acknowledgement boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_c public.app_portal_communications;
begin
  v_ctx := public._aoca284_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Communication creation requires manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_communications (
    company_id, title, summary, full_message, communication_type, author_id,
    publish_date, expiration_date, audience_type, priority, status,
    requires_acknowledgement, created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_summary, ''), 500),
    left(coalesce(p_full_message, ''), 10000),
    coalesce(nullif(trim(p_communication_type), ''), 'company_announcement'),
    v_user_id,
    p_publish_date,
    p_expiration_date,
    coalesce(nullif(trim(p_audience_type), ''), 'entire_organization'),
    coalesce(nullif(trim(p_priority), ''), 'informational'),
    case when p_publish_date is not null and p_publish_date > now() then 'scheduled' else 'draft' end,
    coalesce(p_requires_acknowledgement, false),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_communication_audit_logs (communication_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'Communication created', v_user_id);

  select * into v_c from public.app_portal_communications where id = v_id;
  return jsonb_build_object('created', true, 'communication', public._aoca284_row(v_c, v_ctx));
end;
$$;

create or replace function public.update_app_portal_communication(
  p_id uuid,
  p_title text default null,
  p_summary text default null,
  p_full_message text default null,
  p_communication_type text default null,
  p_audience_type text default null,
  p_audience_target_ids jsonb default null,
  p_priority text default null,
  p_status text default null,
  p_publish_date timestamptz default null,
  p_expiration_date timestamptz default null,
  p_requires_acknowledgement boolean default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_c public.app_portal_communications;
  v_user_id uuid;
begin
  v_ctx := public._aoca284_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Communication update requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_c from public.app_portal_communications where id = p_id;
  if v_c.id is null then raise exception 'Communication not found'; end if;
  if v_c.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Access denied'; end if;

  update public.app_portal_communications set
    title = coalesce(nullif(trim(p_title), ''), title),
    summary = case when p_summary is not null then left(p_summary, 500) else summary end,
    full_message = case when p_full_message is not null then left(p_full_message, 10000) else full_message end,
    communication_type = coalesce(nullif(trim(p_communication_type), ''), communication_type),
    audience_type = coalesce(nullif(trim(p_audience_type), ''), audience_type),
    audience_target_ids = coalesce(p_audience_target_ids, audience_target_ids),
    priority = coalesce(nullif(trim(p_priority), ''), priority),
    status = coalesce(nullif(trim(p_status), ''), status),
    publish_date = coalesce(p_publish_date, publish_date),
    expiration_date = coalesce(p_expiration_date, expiration_date),
    requires_acknowledgement = coalesce(p_requires_acknowledgement, requires_acknowledgement),
    updated_at = now()
  where id = p_id;

  insert into public.app_portal_communication_audit_logs (communication_id, company_id, event_type, description, performed_by)
  values (p_id, v_c.company_id, 'updated', 'Communication updated', v_user_id);

  select * into v_c from public.app_portal_communications where id = p_id;
  return jsonb_build_object('updated', true, 'communication', public._aoca284_row(v_c, v_ctx));
end;
$$;

create or replace function public.acknowledge_app_portal_communication(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_c public.app_portal_communications;
  v_user_id uuid;
begin
  v_ctx := public._aoca284_access_context();
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_c from public.app_portal_communications where id = p_id;
  if v_c.id is null then raise exception 'Communication not found'; end if;
  if not public._aoca284_can_view(v_c, v_ctx) then raise exception 'Communication access denied'; end if;
  if public._aoca284_derive_status(v_c) <> 'published' then
    raise exception 'Only published communications can be acknowledged';
  end if;

  insert into public.app_portal_communication_acknowledgements (communication_id, company_id, user_id)
  values (p_id, v_c.company_id, v_user_id)
  on conflict (communication_id, user_id) do nothing;

  insert into public.app_portal_communication_audit_logs (communication_id, company_id, event_type, description, performed_by)
  values (p_id, v_c.company_id, 'acknowledged', 'Communication acknowledged', v_user_id);

  return jsonb_build_object('acknowledged', true, 'communication_id', p_id);
end;
$$;

grant execute on function public.list_app_portal_communications(text, uuid, text, text, text, timestamptz, timestamptz, text) to authenticated;
grant execute on function public.get_app_portal_communication(uuid) to authenticated;
grant execute on function public.create_app_portal_communication(text, text, text, text, text, text, timestamptz, timestamptz, boolean) to authenticated;
grant execute on function public.update_app_portal_communication(uuid, text, text, text, text, text, jsonb, text, text, timestamptz, timestamptz, boolean) to authenticated;
grant execute on function public.acknowledge_app_portal_communication(uuid) to authenticated;
