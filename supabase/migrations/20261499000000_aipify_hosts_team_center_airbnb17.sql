-- Phase Airbnb 17 — Aipify Hosts Team Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostteam_* (engine), _ahostbp379_* (blueprint)

create table if not exists public.aipify_hosts_team_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'team_members' check (
    default_section in ('team_members', 'roles', 'permissions', 'invitations', 'activity_log')
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true,"least_privilege":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_team_center_settings enable row level security;
revoke all on public.aipify_hosts_team_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_team_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  member_key text not null,
  full_name text not null,
  email text not null,
  role_key text not null check (
    role_key in ('owner', 'property_manager', 'cleaner', 'maintenance', 'support')
  ),
  member_status text not null default 'active' check (member_status in ('active', 'removed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, member_key)
);
create index if not exists aipify_hosts_team_members_tenant_idx
  on public.aipify_hosts_team_members (tenant_id, member_status);
alter table public.aipify_hosts_team_members enable row level security;
revoke all on public.aipify_hosts_team_members from authenticated, anon;

create table if not exists public.aipify_hosts_team_member_properties (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  member_id uuid not null references public.aipify_hosts_team_members (id) on delete cascade,
  property_id uuid not null references public.aipify_hosts_properties (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (member_id, property_id)
);
create index if not exists aipify_hosts_team_member_properties_member_idx
  on public.aipify_hosts_team_member_properties (member_id);
alter table public.aipify_hosts_team_member_properties enable row level security;
revoke all on public.aipify_hosts_team_member_properties from authenticated, anon;

create table if not exists public.aipify_hosts_team_invitations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  email text not null,
  role_key text not null check (
    role_key in ('owner', 'property_manager', 'cleaner', 'maintenance', 'support')
  ),
  invitation_status text not null default 'pending' check (
    invitation_status in ('pending', 'accepted', 'expired', 'revoked')
  ),
  property_ids jsonb not null default '[]'::jsonb,
  invited_by uuid,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_hosts_team_invitations_tenant_idx
  on public.aipify_hosts_team_invitations (tenant_id, invitation_status);
alter table public.aipify_hosts_team_invitations enable row level security;
revoke all on public.aipify_hosts_team_invitations from authenticated, anon;

create table if not exists public.aipify_hosts_team_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_team_center_events_tenant_idx
  on public.aipify_hosts_team_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_team_center_events enable row level security;
revoke all on public.aipify_hosts_team_center_events from authenticated, anon;

create or replace function public._ahostteam_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_team_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_team_center_settings;
begin
  insert into public.aipify_hosts_team_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_team_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostteam_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_team_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'team_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostbp379_positioning() returns text language sql immutable as $$
  select 'Manage hospitality teams with complete control over roles, permissions, and property assignments.'; $$;

create or replace function public._ahostbp379_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'team_members', 'label', 'Team Members'),
    jsonb_build_object('key', 'roles', 'label', 'Roles'),
    jsonb_build_object('key', 'permissions', 'label', 'Permissions'),
    jsonb_build_object('key', 'invitations', 'label', 'Invitations'),
    jsonb_build_object('key', 'activity_log', 'label', 'Activity Log')
  ); $$;

create or replace function public._ahostbp379_roles() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'owner', 'label', 'Owner'),
    jsonb_build_object('key', 'property_manager', 'label', 'Property Manager'),
    jsonb_build_object('key', 'cleaner', 'label', 'Cleaner'),
    jsonb_build_object('key', 'maintenance', 'label', 'Maintenance'),
    jsonb_build_object('key', 'support', 'label', 'Support')
  ); $$;

create or replace function public._ahostbp379_role_permissions() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'owner', jsonb_build_array('full_access', 'billing_access', 'team_management', 'property_management', 'approval_rights'),
    'property_manager', jsonb_build_array('manage_assigned_properties', 'manage_operations', 'assign_tasks', 'view_reports'),
    'cleaner', jsonb_build_array('view_assigned_tasks', 'update_cleaning_status', 'report_issues', 'upload_completion_evidence'),
    'maintenance', jsonb_build_array('view_work_orders', 'update_maintenance_status', 'report_completed_work'),
    'support', jsonb_build_array('view_guest_requests', 'update_request_statuses', 'escalate_incidents')
  ); $$;

create or replace function public._ahostbp379_invitation_statuses() returns jsonb language sql immutable as $$
  select jsonb_build_array('pending', 'accepted', 'expired', 'revoked'); $$;

create or replace function public._ahostteam_member_row(p_member public.aipify_hosts_team_members)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_member.id,
    'member_key', p_member.member_key,
    'full_name', p_member.full_name,
    'email', p_member.email,
    'role_key', p_member.role_key,
    'member_status', p_member.member_status,
    'property_ids', coalesce((
      select jsonb_agg(mp.property_id)
      from public.aipify_hosts_team_member_properties mp
      where mp.member_id = p_member.id
    ), '[]'::jsonb),
    'property_names', coalesce((
      select jsonb_agg(p.display_name order by p.display_name)
      from public.aipify_hosts_team_member_properties mp
      join public.aipify_hosts_properties p on p.id = mp.property_id
      where mp.member_id = p_member.id
    ), '[]'::jsonb),
    'property_count', (
      select count(*)::int from public.aipify_hosts_team_member_properties mp where mp.member_id = p_member.id
    ),
    'created_at', to_char(p_member.created_at, 'YYYY-MM-DD')
  ); $$;

create or replace function public._ahostteam_seed_members(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_owner_id uuid; v_pm_id uuid; v_cleaner_id uuid; v_prop record; v_i int := 0;
begin
  if exists (select 1 from public.aipify_hosts_team_members where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_hosts_team_members (tenant_id, member_key, full_name, email, role_key)
  values (p_tenant_id, 'owner_1', 'Host Owner', 'owner@example.com', 'owner')
  returning id into v_owner_id;
  insert into public.aipify_hosts_team_members (tenant_id, member_key, full_name, email, role_key)
  values (p_tenant_id, 'pm_1', 'Operations Lead', 'ops@example.com', 'property_manager')
  returning id into v_pm_id;
  insert into public.aipify_hosts_team_members (tenant_id, member_key, full_name, email, role_key)
  values (p_tenant_id, 'cleaner_1', 'Nordic Clean Co.', 'cleaning@example.com', 'cleaner')
  returning id into v_cleaner_id;
  for v_prop in
    select id from public.aipify_hosts_properties
    where tenant_id = p_tenant_id and status = 'active' order by display_name limit 3
  loop
    v_i := v_i + 1;
    insert into public.aipify_hosts_team_member_properties (tenant_id, member_id, property_id)
    values (p_tenant_id, v_owner_id, v_prop.id) on conflict do nothing;
    if v_i <= 2 then
      insert into public.aipify_hosts_team_member_properties (tenant_id, member_id, property_id)
      values (p_tenant_id, v_pm_id, v_prop.id) on conflict do nothing;
    end if;
    if v_i = 1 then
      insert into public.aipify_hosts_team_member_properties (tenant_id, member_id, property_id)
      values (p_tenant_id, v_cleaner_id, v_prop.id) on conflict do nothing;
    end if;
  end loop;
  insert into public.aipify_hosts_team_invitations (tenant_id, email, role_key, invitation_status, property_ids, expires_at)
  values (
    p_tenant_id, 'maintenance@example.com', 'maintenance', 'pending', '[]'::jsonb,
    now() + interval '7 days'
  );
end; $$;

create or replace function public._ahostteam_notifications(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_pending int; v_accepted int; v_role_updates int;
begin
  select count(*)::int into v_pending from public.aipify_hosts_team_invitations
  where tenant_id = p_tenant_id and invitation_status = 'pending';
  select count(*)::int into v_accepted from public.aipify_hosts_team_invitations
  where tenant_id = p_tenant_id and invitation_status = 'accepted'
    and updated_at > now() - interval '7 days';
  select count(*)::int into v_role_updates from public.aipify_hosts_team_center_events
  where tenant_id = p_tenant_id and event_type = 'role_changed'
    and created_at > now() - interval '7 days';
  if v_pending = 0 and v_accepted = 0 and v_role_updates = 0 then return '[]'::jsonb; end if;
  return coalesce((
    select jsonb_agg(x) from (
      select jsonb_build_object('key', 'invitation_sent', 'active', v_pending > 0, 'count', v_pending,
        'message', v_pending || ' pending team invitation(s)') as x where v_pending > 0
      union all
      select jsonb_build_object('key', 'invitation_accepted', 'active', v_accepted > 0, 'count', v_accepted,
        'message', v_accepted || ' invitation(s) accepted recently') where v_accepted > 0
      union all
      select jsonb_build_object('key', 'role_updated', 'active', v_role_updates > 0, 'count', v_role_updates,
        'message', v_role_updates || ' role update(s) this week') where v_role_updates > 0
    ) n
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_aipify_hosts_team_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_tc public.aipify_hosts_team_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_tc := public._ahostteam_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_tc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp379_positioning(),
    'route', '/app/aipify-hosts/team'
  );
end; $$;

create or replace function public.get_aipify_hosts_team_center_dashboard(
  p_section text default 'team_members',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_tc public.aipify_hosts_team_center_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_members jsonb; v_invitations jsonb; v_activity jsonb; v_properties jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_tc := public._ahostteam_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_tc.default_section, 'team_members');
  perform public._ahostteam_seed_members(v_tenant_id);
  perform public._ahostteam_log_event(v_tenant_id, 'dashboard_view', 'Team Center viewed',
    jsonb_build_object('section', v_section));

  select coalesce(jsonb_agg(public._ahostteam_member_row(m) order by m.full_name), '[]'::jsonb) into v_members
  from public.aipify_hosts_team_members m
  where m.tenant_id = v_tenant_id and m.member_status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'email', i.email, 'role_key', i.role_key, 'status', i.invitation_status,
    'property_ids', i.property_ids,
    'property_names', coalesce((
      select jsonb_agg(p.display_name order by p.display_name)
      from jsonb_array_elements_text(i.property_ids) pid
      join public.aipify_hosts_properties p on p.id = pid::uuid
      where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'invited_at', to_char(i.created_at, 'YYYY-MM-DD'),
    'expires_at', case when i.expires_at is not null then to_char(i.expires_at, 'YYYY-MM-DD') else null end
  ) order by i.created_at desc), '[]'::jsonb) into v_invitations
  from public.aipify_hosts_team_invitations i
  where i.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'event_type', e.event_type, 'summary', e.summary,
    'when', to_char(e.created_at, 'YYYY-MM-DD HH24:MI')
  ) order by e.created_at desc), '[]'::jsonb) into v_activity
  from public.aipify_hosts_team_center_events e
  where e.tenant_id = v_tenant_id
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'display_name', p.display_name
  ) order by p.display_name), '[]'::jsonb) into v_properties
  from public.aipify_hosts_properties p
  where p.tenant_id = v_tenant_id and p.status <> 'archived';

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_tc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp379_positioning(),
    'governance', jsonb_build_object(
      'role_permissions', true,
      'least_privilege', true,
      'audit_permission_changes', true,
      'audit_role_assignments', true
    ),
    'sections', public._ahostbp379_sections(),
    'roles', public._ahostbp379_roles(),
    'role_permissions', public._ahostbp379_role_permissions(),
    'invitation_statuses', public._ahostbp379_invitation_statuses(),
    'notifications', public._ahostteam_notifications(v_tenant_id),
    'team_members', v_members,
    'invitations', v_invitations,
    'activity_log', v_activity,
    'properties', v_properties,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 17 — Team Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_17_TEAM_CENTER.text',
      'route', '/app/aipify-hosts/team'
    )
  );
end; $$;

create or replace function public.send_aipify_hosts_team_invitation(
  p_email text,
  p_role_key text,
  p_property_ids jsonb default '[]'::jsonb,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user uuid; v_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_user := auth.uid();
  if v_user is null then raise exception 'Authentication required'; end if;
  if coalesce(trim(p_email), '') = '' then raise exception 'Email required'; end if;
  if p_role_key not in ('owner', 'property_manager', 'cleaner', 'maintenance', 'support') then
    raise exception 'Invalid role';
  end if;
  insert into public.aipify_hosts_team_invitations (tenant_id, email, role_key, property_ids, invited_by, expires_at)
  values (v_tenant_id, lower(trim(p_email)), p_role_key, coalesce(p_property_ids, '[]'::jsonb), v_user, now() + interval '14 days')
  returning id into v_id;
  perform public._ahostteam_log_event(v_tenant_id, 'user_invited', 'Team invitation sent',
    jsonb_build_object('invitation_id', v_id, 'email', lower(trim(p_email)), 'role_key', p_role_key));
  return jsonb_build_object('success', true, 'invitation_id', v_id);
end; $$;

create or replace function public.update_aipify_hosts_team_member_role(
  p_member_id uuid,
  p_role_key text,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_role_key not in ('owner', 'property_manager', 'cleaner', 'maintenance', 'support') then
    raise exception 'Invalid role';
  end if;
  update public.aipify_hosts_team_members
  set role_key = p_role_key, updated_at = now()
  where id = p_member_id and tenant_id = v_tenant_id and member_status = 'active';
  perform public._ahostteam_log_event(v_tenant_id, 'role_changed', 'Team member role updated',
    jsonb_build_object('member_id', p_member_id, 'role_key', p_role_key));
  return jsonb_build_object('success', true, 'member_id', p_member_id, 'role_key', p_role_key);
end; $$;

create or replace function public.update_aipify_hosts_team_member_properties(
  p_member_id uuid,
  p_property_ids jsonb,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_pid text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  delete from public.aipify_hosts_team_member_properties
  where member_id = p_member_id and tenant_id = v_tenant_id;
  for v_pid in select jsonb_array_elements_text(coalesce(p_property_ids, '[]'::jsonb))
  loop
    insert into public.aipify_hosts_team_member_properties (tenant_id, member_id, property_id)
    select v_tenant_id, p_member_id, v_pid::uuid
    where exists (
      select 1 from public.aipify_hosts_properties p
      where p.id = v_pid::uuid and p.tenant_id = v_tenant_id
    )
    on conflict do nothing;
  end loop;
  perform public._ahostteam_log_event(v_tenant_id, 'permission_updated', 'Property assignments updated',
    jsonb_build_object('member_id', p_member_id, 'property_ids', p_property_ids));
  return jsonb_build_object('success', true, 'member_id', p_member_id);
end; $$;

create or replace function public.revoke_aipify_hosts_team_invitation(
  p_invitation_id uuid,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  update public.aipify_hosts_team_invitations
  set invitation_status = 'revoked', updated_at = now()
  where id = p_invitation_id and tenant_id = v_tenant_id;
  return jsonb_build_object('success', true, 'invitation_id', p_invitation_id);
end; $$;

create or replace function public.remove_aipify_hosts_team_member(
  p_member_id uuid,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_role text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select role_key into v_role from public.aipify_hosts_team_members
  where id = p_member_id and tenant_id = v_tenant_id;
  if v_role = 'owner' then raise exception 'Owner cannot be removed'; end if;
  update public.aipify_hosts_team_members
  set member_status = 'removed', updated_at = now()
  where id = p_member_id and tenant_id = v_tenant_id;
  perform public._ahostteam_log_event(v_tenant_id, 'user_removed', 'Team member removed',
    jsonb_build_object('member_id', p_member_id));
  return jsonb_build_object('success', true, 'member_id', p_member_id);
end; $$;

create or replace function public.seed_aipify_hosts_team_center_knowledge_airbnb17()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-team', 'Hosts Team Center',
    'Team roles, permissions, invitations, and hospitality staffing governance.', 250
  );
  perform public._ahostkc_seed_article('aipify-hosts-team', 'hospitality-team-roles', 'Hospitality team roles',
    'Assign Owner, Property Manager, Cleaner, Maintenance, and Support roles with least-privilege access.');
  perform public._ahostkc_seed_article('aipify-hosts-team', 'property-assignments', 'Property assignments',
    'Use single or multi-property assignments so each team member sees only what they need.');
  perform public._ahostkc_seed_article('aipify-hosts-team', 'team-invitations', 'Team invitations',
    'Send email invitations with role and property assignment. Track pending, accepted, expired, and revoked statuses.');
  perform public._ahostkc_seed_article('aipify-hosts-team', 'team-governance', 'Team governance',
    'Audit role changes, permission updates, and removals. Owners retain billing and team management control.');
end; $$;

select public.seed_aipify_hosts_team_center_knowledge_airbnb17();

grant execute on function public.get_aipify_hosts_team_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_team_center_dashboard(text, uuid) to authenticated;
grant execute on function public.send_aipify_hosts_team_invitation(text, text, jsonb, uuid) to authenticated;
grant execute on function public.update_aipify_hosts_team_member_role(uuid, text, uuid) to authenticated;
grant execute on function public.update_aipify_hosts_team_member_properties(uuid, jsonb, uuid) to authenticated;
grant execute on function public.revoke_aipify_hosts_team_invitation(uuid, uuid) to authenticated;
grant execute on function public.remove_aipify_hosts_team_member(uuid, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_team_center_knowledge_airbnb17() to authenticated;
