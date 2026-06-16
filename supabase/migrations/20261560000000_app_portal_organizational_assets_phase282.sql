-- Phase 282 (APP) — Organizational Assets & Resource Center

create table if not exists public.app_portal_organizational_assets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  asset_name text not null,
  asset_type text not null check (asset_type in (
    'software_license', 'hardware', 'subscription', 'domain_name', 'api_key_reference',
    'shared_account', 'training_resource', 'internal_resource', 'documentation_resource', 'custom_asset'
  )),
  description text not null default '',
  owner_id uuid references public.users (id) on delete set null,
  backup_owner_id uuid references public.users (id) on delete set null,
  status text not null default 'active' check (status in (
    'active', 'under_review', 'pending_renewal', 'retired', 'archived'
  )),
  vendor text not null default '',
  purchase_date date,
  renewal_date date,
  renewal_reminder_date date,
  criticality_level text not null default 'moderate' check (criticality_level in (
    'low', 'moderate', 'high', 'mission_critical'
  )),
  internal_notes text not null default '',
  related_modules jsonb not null default '[]'::jsonb,
  related_external_relationship_ids jsonb not null default '[]'::jsonb,
  related_risk_ids jsonb not null default '[]'::jsonb,
  related_follow_up_ids jsonb not null default '[]'::jsonb,
  shared_with_ids jsonb not null default '[]'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_organizational_assets_company_idx
  on public.app_portal_organizational_assets (company_id, asset_type, status, updated_at desc);

create table if not exists public.app_portal_organizational_asset_audit_logs (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.app_portal_organizational_assets (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_org_asset_audit_idx
  on public.app_portal_organizational_asset_audit_logs (asset_id, created_at desc);

alter table public.app_portal_organizational_assets enable row level security;
alter table public.app_portal_organizational_asset_audit_logs enable row level security;
revoke all on public.app_portal_organizational_assets from authenticated, anon;
revoke all on public.app_portal_organizational_asset_audit_logs from authenticated, anon;

create or replace function public._aoar282_access_context()
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
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._aoar282_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._aoar282_assert_no_secrets(p_text text)
returns void
language plpgsql
as $$
begin
  if p_text is null or trim(p_text) = '' then return; end if;
  if p_text ~* '(password\s*[:=]|secret\s*[:=]|bearer\s+[a-z0-9._-]{20,}|sk_(live|test)_[a-z0-9]{16,}|api[_-]?key\s*[:=]\s*[a-z0-9]{16,})' then
    raise exception 'Sensitive credentials must not be stored. Use references only.';
  end if;
end;
$$;

create or replace function public._aoar282_derive_status(a public.app_portal_organizational_assets)
returns text
language sql
stable
as $$
  select case
    when a.status in ('retired', 'archived') then a.status
    when a.renewal_date is not null and a.renewal_date < current_date then 'pending_renewal'
    when a.renewal_reminder_date is not null and a.renewal_reminder_date <= current_date then 'pending_renewal'
    when a.renewal_date is not null and a.renewal_date <= current_date + interval '60 days' then 'pending_renewal'
    else coalesce(nullif(a.status, ''), 'active')
  end;
$$;

create or replace function public._aoar282_can_view(
  a public.app_portal_organizational_assets,
  p_ctx jsonb
)
returns boolean
language plpgsql
stable
as $$
declare v_uid uuid;
begin
  if (p_ctx->>'company_id')::uuid <> a.company_id then return false; end if;
  if coalesce(p_ctx->>'can_manage', 'false') = 'true' then return true; end if;
  v_uid := (p_ctx->>'user_id')::uuid;
  return a.owner_id = v_uid
    or a.backup_owner_id = v_uid
    or coalesce(a.shared_with_ids, '[]'::jsonb) @> jsonb_build_array(v_uid::text);
end;
$$;

create or replace function public._aoar282_needs_review(a public.app_portal_organizational_assets)
returns boolean
language sql
stable
as $$
  select public._aoar282_derive_status(a) = 'under_review'
    or (a.status = 'active' and a.updated_at < now() - interval '180 days');
$$;

create or replace function public._aoar282_row(a public.app_portal_organizational_assets)
returns jsonb
language plpgsql
stable
as $$
declare v_status text;
begin
  v_status := public._aoar282_derive_status(a);
  return jsonb_build_object(
    'id', a.id,
    'asset_name', a.asset_name,
    'asset_type', a.asset_type,
    'description', left(a.description, 300),
    'owner_id', a.owner_id,
    'owner_name', public._aoar282_user_name(a.owner_id),
    'backup_owner_id', a.backup_owner_id,
    'backup_owner_name', public._aoar282_user_name(a.backup_owner_id),
    'status', v_status,
    'vendor', a.vendor,
    'purchase_date', a.purchase_date,
    'renewal_date', a.renewal_date,
    'renewal_reminder_date', a.renewal_reminder_date,
    'criticality_level', a.criticality_level,
    'internal_notes', left(a.internal_notes, 300),
    'related_modules', a.related_modules,
    'related_external_relationship_ids', a.related_external_relationship_ids,
    'related_risk_ids', a.related_risk_ids,
    'related_follow_up_ids', a.related_follow_up_ids,
    'shared_with_ids', a.shared_with_ids,
    'needs_review', public._aoar282_needs_review(a),
    'renewal_upcoming', (
      a.renewal_date is not null and a.renewal_date between current_date and current_date + interval '90 days'
      and v_status not in ('retired', 'archived')
    ),
    'renewal_expired', (a.renewal_date is not null and a.renewal_date < current_date),
    'created_at', a.created_at,
    'updated_at', a.updated_at
  );
end;
$$;

create or replace function public._aoar282_build_recommendations(p_items jsonb)
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
    if (v_item->>'owner_id') is null and (v_item->>'status') not in ('retired', 'archived') then
      v_recs := v_recs || jsonb_build_object('id', 'owner-' || (v_item->>'id'), 'key', 'assignOwner', 'asset_id', v_item->>'id', 'priority', 'high');
    elsif coalesce((v_item->>'renewal_upcoming')::boolean, false) then
      v_recs := v_recs || jsonb_build_object('id', 'renewal-' || (v_item->>'id'), 'key', 'reviewUpcomingRenewals', 'asset_id', v_item->>'id', 'priority', 'medium');
    elsif (v_item->>'backup_owner_id') is null and (v_item->>'status') = 'active' then
      v_recs := v_recs || jsonb_build_object('id', 'backup-' || (v_item->>'id'), 'key', 'addBackupOwner', 'asset_id', v_item->>'id', 'priority', 'medium');
    elsif (v_item->>'criticality_level') = 'mission_critical' and (v_item->>'status') = 'active' then
      v_recs := v_recs || jsonb_build_object('id', 'critical-' || (v_item->>'id'), 'key', 'reviewMissionCritical', 'asset_id', v_item->>'id', 'priority', 'high');
    end if;
  end loop;
  v_recs := v_recs || jsonb_build_object('id', 'archive-unused', 'key', 'archiveUnused', 'priority', 'low');
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_organizational_assets(
  p_asset_type text default null,
  p_owner_id uuid default null,
  p_status text default null,
  p_vendor text default null,
  p_criticality text default null,
  p_renewal_before date default null,
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
  v_upcoming integer := 0;
  v_critical integer := 0;
  v_needs_review integer := 0;
  v_no_owner integer := 0;
  v_recent jsonb := '[]'::jsonb;
begin
  v_ctx := public._aoar282_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._aoar282_row(a) order by a.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_organizational_assets a
  where a.company_id = v_company_id
    and public._aoar282_can_view(a, v_ctx)
    and (p_asset_type is null or a.asset_type = p_asset_type)
    and (p_owner_id is null or a.owner_id = p_owner_id)
    and (p_status is null or public._aoar282_derive_status(a) = p_status)
    and (p_vendor is null or trim(p_vendor) = '' or lower(a.vendor) = lower(trim(p_vendor)))
    and (p_criticality is null or a.criticality_level = p_criticality)
    and (p_renewal_before is null or a.renewal_date <= p_renewal_before)
    and (
      p_search is null or trim(p_search) = ''
      or a.asset_name ilike '%' || trim(p_search) || '%'
      or a.description ilike '%' || trim(p_search) || '%'
      or a.vendor ilike '%' || trim(p_search) || '%'
      or a.internal_notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active
  from public.app_portal_organizational_assets a
  where a.company_id = v_company_id and public._aoar282_derive_status(a) = 'active';

  select count(*)::int into v_upcoming
  from public.app_portal_organizational_assets a
  where a.company_id = v_company_id
    and a.renewal_date between current_date and current_date + interval '90 days'
    and public._aoar282_derive_status(a) not in ('retired', 'archived');

  select count(*)::int into v_critical
  from public.app_portal_organizational_assets a
  where a.company_id = v_company_id
    and a.criticality_level = 'mission_critical'
    and public._aoar282_derive_status(a) not in ('retired', 'archived');

  select count(*)::int into v_needs_review
  from public.app_portal_organizational_assets a
  where a.company_id = v_company_id and public._aoar282_needs_review(a);

  select count(*)::int into v_no_owner
  from public.app_portal_organizational_assets a
  where a.company_id = v_company_id and a.owner_id is null
    and public._aoar282_derive_status(a) not in ('retired', 'archived');

  select coalesce(jsonb_agg(public._aoar282_row(a) order by a.updated_at desc), '[]'::jsonb)
  into v_recent
  from (select * from public.app_portal_organizational_assets where company_id = v_company_id order by updated_at desc limit 5) a;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active', v_active,
      'needs_review', v_needs_review,
      'upcoming_renewals', v_upcoming,
      'mission_critical', v_critical,
      'without_owner', v_no_owner,
      'recently_updated', v_recent
    ),
    'recommendations', public._aoar282_build_recommendations(v_items),
    'principle', 'Operational awareness strengthens continuity — store references only, never credentials.'
  );
end;
$$;

create or replace function public.get_app_portal_organizational_asset(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_a public.app_portal_organizational_assets;
  v_audit jsonb := '[]'::jsonb;
  v_renewals jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
  v_relationships jsonb := '[]'::jsonb;
begin
  v_ctx := public._aoar282_access_context();
  select * into v_a from public.app_portal_organizational_assets where id = p_id;
  if v_a.id is null then return jsonb_build_object('found', false); end if;
  if not public._aoar282_can_view(v_a, v_ctx) then
    raise exception 'Asset access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._aoar282_user_name(l.performed_by),
    'metadata', l.metadata
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_organizational_asset_audit_logs l where l.asset_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'description', l.description, 'created_at', l.created_at,
    'performed_by', public._aoar282_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_renewals
  from public.app_portal_organizational_asset_audit_logs l
  where l.asset_id = p_id and l.event_type = 'renewal';

  if to_regclass('public.app_portal_risks') is not null and jsonb_array_length(coalesce(v_a.related_risk_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', rk.id, 'title', rk.title, 'status', rk.status)), '[]'::jsonb)
    into v_risks
    from public.app_portal_risks rk
    where rk.id in (select t.value::uuid from jsonb_array_elements_text(v_a.related_risk_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null and jsonb_array_length(coalesce(v_a.related_follow_up_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'title', f.title, 'status', f.status)), '[]'::jsonb)
    into v_follow_ups
    from public.app_portal_follow_ups f
    where f.id in (select t.value::uuid from jsonb_array_elements_text(v_a.related_follow_up_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_external_relationships') is not null
     and jsonb_array_length(coalesce(v_a.related_external_relationship_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', r.id, 'name', r.organization_name, 'status', r.status)), '[]'::jsonb)
    into v_relationships
    from public.app_portal_external_relationships r
    where r.id in (select t.value::uuid from jsonb_array_elements_text(v_a.related_external_relationship_ids) as t(value));
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'asset', public._aoar282_row(v_a) || jsonb_build_object(
      'description_full', v_a.description,
      'internal_notes_full', v_a.internal_notes
    ),
    'related_risks', v_risks,
    'related_follow_ups', v_follow_ups,
    'related_external_relationships', v_relationships,
    'renewal_history', v_renewals,
    'activity_timeline', v_audit,
    'audit_history', v_audit,
    'recommendations', public._aoar282_build_recommendations(jsonb_build_array(public._aoar282_row(v_a)))
  );
end;
$$;

create or replace function public.create_app_portal_organizational_asset(
  p_asset_name text,
  p_asset_type text default 'software_license',
  p_description text default '',
  p_owner_id uuid default null,
  p_backup_owner_id uuid default null,
  p_status text default 'active',
  p_vendor text default '',
  p_purchase_date date default null,
  p_renewal_date date default null,
  p_renewal_reminder_date date default null,
  p_criticality_level text default 'moderate',
  p_internal_notes text default '',
  p_related_modules jsonb default '[]'::jsonb
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
  v_a public.app_portal_organizational_assets;
begin
  v_ctx := public._aoar282_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Asset creation requires manager access';
  end if;
  perform public._aoar282_assert_no_secrets(p_description);
  perform public._aoar282_assert_no_secrets(p_internal_notes);

  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_organizational_assets (
    company_id, asset_name, asset_type, description, owner_id, backup_owner_id,
    status, vendor, purchase_date, renewal_date, renewal_reminder_date,
    criticality_level, internal_notes, related_modules, created_by
  ) values (
    v_company_id,
    left(trim(p_asset_name), 200),
    coalesce(nullif(trim(p_asset_type), ''), 'software_license'),
    left(coalesce(p_description, ''), 5000),
    p_owner_id,
    p_backup_owner_id,
    coalesce(nullif(trim(p_status), ''), 'active'),
    left(coalesce(p_vendor, ''), 200),
    p_purchase_date,
    p_renewal_date,
    p_renewal_reminder_date,
    coalesce(nullif(trim(p_criticality_level), ''), 'moderate'),
    left(coalesce(p_internal_notes, ''), 2000),
    coalesce(p_related_modules, '[]'::jsonb),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_organizational_asset_audit_logs (asset_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'Organizational asset created', v_user_id);

  select * into v_a from public.app_portal_organizational_assets where id = v_id;
  return jsonb_build_object('created', true, 'asset', public._aoar282_row(v_a));
end;
$$;

create or replace function public.update_app_portal_organizational_asset(
  p_id uuid,
  p_asset_name text default null,
  p_asset_type text default null,
  p_description text default null,
  p_owner_id uuid default null,
  p_backup_owner_id uuid default null,
  p_status text default null,
  p_vendor text default null,
  p_purchase_date date default null,
  p_renewal_date date default null,
  p_renewal_reminder_date date default null,
  p_criticality_level text default null,
  p_internal_notes text default null,
  p_related_modules jsonb default null,
  p_renewal_note text default null,
  p_clear_owner boolean default false,
  p_clear_backup_owner boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_a public.app_portal_organizational_assets;
  v_user_id uuid;
begin
  v_ctx := public._aoar282_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Asset update requires manager access';
  end if;
  if p_description is not null then perform public._aoar282_assert_no_secrets(p_description); end if;
  if p_internal_notes is not null then perform public._aoar282_assert_no_secrets(p_internal_notes); end if;

  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_a from public.app_portal_organizational_assets where id = p_id;
  if v_a.id is null then raise exception 'Asset not found'; end if;
  if v_a.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Access denied'; end if;

  update public.app_portal_organizational_assets set
    asset_name = coalesce(nullif(trim(p_asset_name), ''), asset_name),
    asset_type = coalesce(nullif(trim(p_asset_type), ''), asset_type),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    owner_id = case when p_clear_owner then null when p_owner_id is not null then p_owner_id else owner_id end,
    backup_owner_id = case when p_clear_backup_owner then null when p_backup_owner_id is not null then p_backup_owner_id else backup_owner_id end,
    status = coalesce(nullif(trim(p_status), ''), status),
    vendor = case when p_vendor is not null then left(p_vendor, 200) else vendor end,
    purchase_date = coalesce(p_purchase_date, purchase_date),
    renewal_date = coalesce(p_renewal_date, renewal_date),
    renewal_reminder_date = coalesce(p_renewal_reminder_date, renewal_reminder_date),
    criticality_level = coalesce(nullif(trim(p_criticality_level), ''), criticality_level),
    internal_notes = case when p_internal_notes is not null then left(p_internal_notes, 2000) else internal_notes end,
    related_modules = coalesce(p_related_modules, related_modules),
    updated_at = now()
  where id = p_id;

  if p_renewal_note is not null and trim(p_renewal_note) <> '' then
    insert into public.app_portal_organizational_asset_audit_logs (asset_id, company_id, event_type, description, performed_by)
    values (p_id, v_a.company_id, 'renewal', left(trim(p_renewal_note), 500), v_user_id);
  else
    insert into public.app_portal_organizational_asset_audit_logs (asset_id, company_id, event_type, description, performed_by)
    values (p_id, v_a.company_id, 'updated', 'Organizational asset updated', v_user_id);
  end if;

  select * into v_a from public.app_portal_organizational_assets where id = p_id;
  return jsonb_build_object('updated', true, 'asset', public._aoar282_row(v_a));
end;
$$;

grant execute on function public.list_app_portal_organizational_assets(text, uuid, text, text, text, date, text) to authenticated;
grant execute on function public.get_app_portal_organizational_asset(uuid) to authenticated;
grant execute on function public.create_app_portal_organizational_asset(text, text, text, uuid, uuid, text, text, date, date, date, text, text, jsonb) to authenticated;
grant execute on function public.update_app_portal_organizational_asset(uuid, text, text, text, uuid, uuid, text, text, date, date, date, text, text, jsonb, text, boolean, boolean) to authenticated;
