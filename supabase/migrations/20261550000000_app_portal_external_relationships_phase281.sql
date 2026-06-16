-- Phase 281 (APP) — Vendor & External Relationship Center

create table if not exists public.app_portal_external_relationships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  organization_name text not null,
  relationship_type text not null check (relationship_type in (
    'supplier', 'strategic_partner', 'technology_vendor', 'consultant',
    'outsourcing_provider', 'financial_institution', 'legal_advisor',
    'insurance_provider', 'service_provider', 'custom'
  )),
  primary_contact text not null default '',
  secondary_contact text not null default '',
  email text not null default '',
  phone text not null default '',
  country text not null default '',
  status text not null default 'active' check (status in (
    'active', 'under_review', 'pending_renewal', 'suspended', 'ended'
  )),
  owner_id uuid references public.users (id) on delete set null,
  stakeholder_ids jsonb not null default '[]'::jsonb,
  shared_with_ids jsonb not null default '[]'::jsonb,
  service_description text not null default '',
  contract_start_date date,
  contract_end_date date,
  renewal_reminder_date date,
  criticality_level text not null default 'moderate' check (criticality_level in (
    'low', 'moderate', 'high', 'mission_critical'
  )),
  related_risk_ids jsonb not null default '[]'::jsonb,
  related_follow_up_ids jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_external_relationships_company_idx
  on public.app_portal_external_relationships (company_id, relationship_type, status, updated_at desc);

create table if not exists public.app_portal_external_relationship_audit_logs (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.app_portal_external_relationships (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_external_rel_audit_idx
  on public.app_portal_external_relationship_audit_logs (relationship_id, created_at desc);

alter table public.app_portal_external_relationships enable row level security;
alter table public.app_portal_external_relationship_audit_logs enable row level security;
revoke all on public.app_portal_external_relationships from authenticated, anon;
revoke all on public.app_portal_external_relationship_audit_logs from authenticated, anon;

create or replace function public._aper281_access_context()
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
    'is_procurement_leader', v_role in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._aper281_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._aper281_derive_status(r public.app_portal_external_relationships)
returns text
language sql
stable
as $$
  select case
    when r.status in ('suspended', 'ended') then r.status
    when r.contract_end_date is not null and r.contract_end_date < current_date then 'ended'
    when r.renewal_reminder_date is not null and r.renewal_reminder_date <= current_date then 'pending_renewal'
    when r.contract_end_date is not null and r.contract_end_date <= current_date + interval '60 days' then 'pending_renewal'
    else coalesce(nullif(r.status, ''), 'active')
  end;
$$;

create or replace function public._aper281_can_view(
  r public.app_portal_external_relationships,
  p_ctx jsonb
)
returns boolean
language plpgsql
stable
as $$
declare v_uid uuid;
begin
  if (p_ctx->>'company_id')::uuid <> r.company_id then return false; end if;
  if coalesce(p_ctx->>'can_manage', 'false') = 'true' then return true; end if;
  if coalesce(p_ctx->>'is_procurement_leader', 'false') = 'true'
     and r.criticality_level in ('high', 'mission_critical') then return true; end if;
  v_uid := (p_ctx->>'user_id')::uuid;
  return r.owner_id = v_uid
    or coalesce(r.stakeholder_ids, '[]'::jsonb) @> jsonb_build_array(v_uid::text)
    or coalesce(r.shared_with_ids, '[]'::jsonb) @> jsonb_build_array(v_uid::text);
end;
$$;

create or replace function public._aper281_needs_review(r public.app_portal_external_relationships)
returns boolean
language sql
stable
as $$
  select public._aper281_derive_status(r) = 'under_review'
    or (r.status = 'active' and r.updated_at < now() - interval '180 days');
$$;

create or replace function public._aper281_row(r public.app_portal_external_relationships)
returns jsonb
language plpgsql
stable
as $$
declare v_status text;
begin
  v_status := public._aper281_derive_status(r);
  return jsonb_build_object(
    'id', r.id,
    'organization_name', r.organization_name,
    'relationship_type', r.relationship_type,
    'primary_contact', r.primary_contact,
    'secondary_contact', r.secondary_contact,
    'email', r.email,
    'phone', r.phone,
    'country', r.country,
    'status', v_status,
    'owner_id', r.owner_id,
    'owner_name', public._aper281_user_name(r.owner_id),
    'stakeholder_ids', r.stakeholder_ids,
    'shared_with_ids', r.shared_with_ids,
    'service_description', left(r.service_description, 300),
    'contract_start_date', r.contract_start_date,
    'contract_end_date', r.contract_end_date,
    'renewal_reminder_date', r.renewal_reminder_date,
    'criticality_level', r.criticality_level,
    'related_risk_ids', r.related_risk_ids,
    'related_follow_up_ids', r.related_follow_up_ids,
    'notes', left(r.notes, 300),
    'needs_review', public._aper281_needs_review(r),
    'renewal_upcoming', (
      r.contract_end_date is not null and r.contract_end_date between current_date and current_date + interval '90 days'
      and v_status not in ('ended', 'suspended')
    ),
    'renewal_expired', (r.contract_end_date is not null and r.contract_end_date < current_date),
    'created_at', r.created_at,
    'updated_at', r.updated_at
  );
end;
$$;

create or replace function public._aper281_build_recommendations(p_items jsonb)
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
    if (v_item->>'criticality_level') = 'mission_critical' and (v_item->>'status') = 'active' then
      v_recs := v_recs || jsonb_build_object('id', 'critical-' || (v_item->>'id'), 'key', 'reviewMissionCritical', 'relationship_id', v_item->>'id', 'priority', 'high');
    elsif (v_item->>'owner_id') is null and (v_item->>'status') not in ('ended', 'suspended') then
      v_recs := v_recs || jsonb_build_object('id', 'owner-' || (v_item->>'id'), 'key', 'assignOwner', 'relationship_id', v_item->>'id', 'priority', 'high');
    elsif coalesce((v_item->>'renewal_upcoming')::boolean, false) then
      v_recs := v_recs || jsonb_build_object('id', 'renewal-' || (v_item->>'id'), 'key', 'scheduleRenewal', 'relationship_id', v_item->>'id', 'priority', 'medium');
    elsif (v_item->>'secondary_contact') is null or trim(v_item->>'secondary_contact') = '' then
      v_recs := v_recs || jsonb_build_object('id', 'backup-' || (v_item->>'id'), 'key', 'addBackupContact', 'relationship_id', v_item->>'id', 'priority', 'low');
    end if;
  end loop;
  v_recs := v_recs || jsonb_build_object('id', 'review-expiring', 'key', 'reviewExpiring', 'priority', 'medium');
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_external_relationships(
  p_relationship_type text default null,
  p_owner_id uuid default null,
  p_status text default null,
  p_criticality text default null,
  p_country text default null,
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
  v_ctx := public._aper281_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._aper281_row(r) order by r.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id
    and public._aper281_can_view(r, v_ctx)
    and (p_relationship_type is null or r.relationship_type = p_relationship_type)
    and (p_owner_id is null or r.owner_id = p_owner_id)
    and (p_status is null or public._aper281_derive_status(r) = p_status)
    and (p_criticality is null or r.criticality_level = p_criticality)
    and (p_country is null or trim(p_country) = '' or lower(r.country) = lower(trim(p_country)))
    and (p_renewal_before is null or r.contract_end_date <= p_renewal_before)
    and (
      p_search is null or trim(p_search) = ''
      or r.organization_name ilike '%' || trim(p_search) || '%'
      or r.primary_contact ilike '%' || trim(p_search) || '%'
      or r.service_description ilike '%' || trim(p_search) || '%'
      or r.notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id and public._aper281_derive_status(r) = 'active';

  select count(*)::int into v_upcoming
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id
    and r.contract_end_date between current_date and current_date + interval '90 days'
    and public._aper281_derive_status(r) not in ('ended', 'suspended');

  select count(*)::int into v_critical
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id
    and r.criticality_level in ('high', 'mission_critical')
    and public._aper281_derive_status(r) not in ('ended', 'suspended');

  select count(*)::int into v_needs_review
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id and public._aper281_needs_review(r);

  select count(*)::int into v_no_owner
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id and r.owner_id is null and public._aper281_derive_status(r) not in ('ended');

  select coalesce(jsonb_agg(public._aper281_row(r) order by r.updated_at desc), '[]'::jsonb)
  into v_recent
  from (select * from public.app_portal_external_relationships where company_id = v_company_id order by updated_at desc limit 5) r;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active', v_active,
      'upcoming_renewals', v_upcoming,
      'critical', v_critical,
      'needs_review', v_needs_review,
      'without_owner', v_no_owner,
      'recently_updated', v_recent
    ),
    'recommendations', public._aper281_build_recommendations(v_items),
    'principle', 'Proactive relationship management strengthens resilience — humans retain vendor decisions.'
  );
end;
$$;

create or replace function public.get_app_portal_external_relationship(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_external_relationships;
  v_stakeholders jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_renewals jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
begin
  v_ctx := public._aper281_access_context();
  select * into v_r from public.app_portal_external_relationships where id = p_id;
  if v_r.id is null then return jsonb_build_object('found', false); end if;
  if not public._aper281_can_view(v_r, v_ctx) then
    raise exception 'Relationship access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object('user_id', u.id, 'name', u.full_name)), '[]'::jsonb)
  into v_stakeholders
  from public.users u
  where u.id in (
    select t.value::uuid from jsonb_array_elements_text(coalesce(v_r.stakeholder_ids, '[]'::jsonb)) as t(value)
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._aper281_user_name(l.performed_by),
    'metadata', l.metadata
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_external_relationship_audit_logs l where l.relationship_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'description', l.description, 'created_at', l.created_at,
    'performed_by', public._aper281_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_renewals
  from public.app_portal_external_relationship_audit_logs l
  where l.relationship_id = p_id and l.event_type = 'renewal';

  if to_regclass('public.app_portal_risks') is not null and jsonb_array_length(coalesce(v_r.related_risk_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', rk.id, 'title', rk.title, 'status', rk.status)), '[]'::jsonb)
    into v_risks
    from public.app_portal_risks rk
    where rk.id in (select t.value::uuid from jsonb_array_elements_text(v_r.related_risk_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null and jsonb_array_length(coalesce(v_r.related_follow_up_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'title', f.title, 'status', f.status)), '[]'::jsonb)
    into v_follow_ups
    from public.app_portal_follow_ups f
    where f.id in (select t.value::uuid from jsonb_array_elements_text(v_r.related_follow_up_ids) as t(value));
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'relationship', public._aper281_row(v_r) || jsonb_build_object(
      'service_description_full', v_r.service_description,
      'notes_full', v_r.notes
    ),
    'stakeholders', v_stakeholders,
    'related_risks', v_risks,
    'related_follow_ups', v_follow_ups,
    'renewal_history', v_renewals,
    'activity_timeline', v_audit,
    'audit_history', v_audit,
    'recommendations', public._aper281_build_recommendations(jsonb_build_array(public._aper281_row(v_r)))
  );
end;
$$;

create or replace function public.create_app_portal_external_relationship(
  p_organization_name text,
  p_relationship_type text default 'supplier',
  p_primary_contact text default '',
  p_secondary_contact text default '',
  p_email text default '',
  p_phone text default '',
  p_country text default '',
  p_status text default 'active',
  p_owner_id uuid default null,
  p_stakeholder_ids jsonb default '[]'::jsonb,
  p_service_description text default '',
  p_contract_start_date date default null,
  p_contract_end_date date default null,
  p_renewal_reminder_date date default null,
  p_criticality_level text default 'moderate',
  p_notes text default ''
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
  v_r public.app_portal_external_relationships;
begin
  v_ctx := public._aper281_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Relationship creation requires manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_external_relationships (
    company_id, organization_name, relationship_type, primary_contact, secondary_contact,
    email, phone, country, status, owner_id, stakeholder_ids, service_description,
    contract_start_date, contract_end_date, renewal_reminder_date, criticality_level, notes, created_by
  ) values (
    v_company_id,
    left(trim(p_organization_name), 200),
    coalesce(nullif(trim(p_relationship_type), ''), 'supplier'),
    left(coalesce(p_primary_contact, ''), 200),
    left(coalesce(p_secondary_contact, ''), 200),
    left(coalesce(p_email, ''), 200),
    left(coalesce(p_phone, ''), 80),
    left(coalesce(p_country, ''), 80),
    coalesce(nullif(trim(p_status), ''), 'active'),
    p_owner_id,
    coalesce(p_stakeholder_ids, '[]'::jsonb),
    left(coalesce(p_service_description, ''), 5000),
    p_contract_start_date,
    p_contract_end_date,
    p_renewal_reminder_date,
    coalesce(nullif(trim(p_criticality_level), ''), 'moderate'),
    left(coalesce(p_notes, ''), 2000),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_external_relationship_audit_logs (relationship_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'External relationship created', v_user_id);

  select * into v_r from public.app_portal_external_relationships where id = v_id;
  return jsonb_build_object('created', true, 'relationship', public._aper281_row(v_r));
end;
$$;

create or replace function public.update_app_portal_external_relationship(
  p_id uuid,
  p_organization_name text default null,
  p_relationship_type text default null,
  p_primary_contact text default null,
  p_secondary_contact text default null,
  p_email text default null,
  p_phone text default null,
  p_country text default null,
  p_status text default null,
  p_owner_id uuid default null,
  p_stakeholder_ids jsonb default null,
  p_service_description text default null,
  p_contract_start_date date default null,
  p_contract_end_date date default null,
  p_renewal_reminder_date date default null,
  p_criticality_level text default null,
  p_notes text default null,
  p_renewal_note text default null,
  p_clear_owner boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_external_relationships;
  v_user_id uuid;
begin
  v_ctx := public._aper281_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Relationship update requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_r from public.app_portal_external_relationships where id = p_id;
  if v_r.id is null then raise exception 'Relationship not found'; end if;
  if v_r.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Access denied'; end if;

  update public.app_portal_external_relationships set
    organization_name = coalesce(nullif(trim(p_organization_name), ''), organization_name),
    relationship_type = coalesce(nullif(trim(p_relationship_type), ''), relationship_type),
    primary_contact = case when p_primary_contact is not null then left(p_primary_contact, 200) else primary_contact end,
    secondary_contact = case when p_secondary_contact is not null then left(p_secondary_contact, 200) else secondary_contact end,
    email = case when p_email is not null then left(p_email, 200) else email end,
    phone = case when p_phone is not null then left(p_phone, 80) else phone end,
    country = case when p_country is not null then left(p_country, 80) else country end,
    status = coalesce(nullif(trim(p_status), ''), status),
    owner_id = case when p_clear_owner then null when p_owner_id is not null then p_owner_id else owner_id end,
    stakeholder_ids = coalesce(p_stakeholder_ids, stakeholder_ids),
    service_description = case when p_service_description is not null then left(p_service_description, 5000) else service_description end,
    contract_start_date = coalesce(p_contract_start_date, contract_start_date),
    contract_end_date = coalesce(p_contract_end_date, contract_end_date),
    renewal_reminder_date = coalesce(p_renewal_reminder_date, renewal_reminder_date),
    criticality_level = coalesce(nullif(trim(p_criticality_level), ''), criticality_level),
    notes = case when p_notes is not null then left(p_notes, 2000) else notes end,
    updated_at = now()
  where id = p_id;

  if p_renewal_note is not null and trim(p_renewal_note) <> '' then
    insert into public.app_portal_external_relationship_audit_logs (relationship_id, company_id, event_type, description, performed_by)
    values (p_id, v_r.company_id, 'renewal', left(trim(p_renewal_note), 500), v_user_id);
  else
    insert into public.app_portal_external_relationship_audit_logs (relationship_id, company_id, event_type, description, performed_by)
    values (p_id, v_r.company_id, 'updated', 'External relationship updated', v_user_id);
  end if;

  select * into v_r from public.app_portal_external_relationships where id = p_id;
  return jsonb_build_object('updated', true, 'relationship', public._aper281_row(v_r));
end;
$$;

grant execute on function public.list_app_portal_external_relationships(text, uuid, text, text, text, date, text) to authenticated;
grant execute on function public.get_app_portal_external_relationship(uuid) to authenticated;
grant execute on function public.create_app_portal_external_relationship(text, text, text, text, text, text, text, text, uuid, jsonb, text, date, date, date, text, text) to authenticated;
grant execute on function public.update_app_portal_external_relationship(uuid, text, text, text, text, text, text, text, text, uuid, jsonb, text, date, date, date, text, text, text, boolean) to authenticated;
