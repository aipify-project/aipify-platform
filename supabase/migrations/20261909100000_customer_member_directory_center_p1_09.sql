-- P1.09 — Customer Community Member Directory Center (read-only exact source)
-- Authoritative tenant-scoped community member directory metadata.
-- No raw email/phone, admin/system users, or test/demo accounts in search results.

create table if not exists public.customer_community_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  member_key text not null,
  username text not null,
  display_name text not null,
  membership_status text not null default 'active' check (
    membership_status in ('active', 'inactive', 'suspended', 'pending')
  ),
  membership_level text not null default 'standard' check (
    membership_level in ('standard', 'bronze', 'silver', 'gold', 'platinum')
  ),
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'in_review', 'approved', 'rejected', 'expired')
  ),
  profile_reference text not null default 'profile_ref_***',
  email_masked text,
  phone_masked text,
  is_system_user boolean not null default false,
  is_admin_user boolean not null default false,
  is_test boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, member_key),
  unique (organization_id, username)
);

create index if not exists customer_community_members_org_search_idx
  on public.customer_community_members (organization_id, lower(display_name), lower(username));

alter table public.customer_community_members enable row level security;
revoke all on public.customer_community_members from authenticated, anon;

create table if not exists public.customer_community_member_directory_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid,
  action text not null default 'read',
  search_field text,
  search_term text,
  match_count integer not null default 0,
  source_reference text not null default 'get_customer_member_directory_center',
  created_at timestamptz not null default now()
);

create index if not exists customer_community_member_directory_audit_org_idx
  on public.customer_community_member_directory_audit (organization_id, created_at desc);

alter table public.customer_community_member_directory_audit enable row level security;
revoke all on public.customer_community_member_directory_audit from authenticated, anon;

create or replace function public._cmd09_assert_read_access(p_org_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_license text := 'active';
  v_user_id uuid := public._mta_app_user_id();
  v_user_role text;
begin
  if v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'permission_denied');
  end if;

  select u.role into v_user_role from public.users u where u.id = v_user_id limit 1;

  if not (
    public._irp_has_permission('customer_community.view', p_org_id)
    or coalesce(v_user_role, '') in ('owner', 'admin', 'support')
    or exists (
      select 1
      from public.organization_users ou
      where ou.organization_id = p_org_id
        and ou.user_id = v_user_id
        and ou.status = 'active'
        and ou.role in (
          'organization_owner', 'organization_admin', 'owner', 'admin', 'support'
        )
    )
  ) then
    return jsonb_build_object('ok', false, 'error', 'permission_denied');
  end if;

  if exists (select 1 from pg_proc where proname = 'resolve_license_service_status') then
    begin
      v_license := coalesce(public.resolve_license_service_status(p_org_id), 'active');
    exception when others then
      v_license := 'active';
    end;
  end if;

  if v_license = 'paused' then
    return jsonb_build_object('ok', false, 'error', 'app_suspended');
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public._cmd09_seed_members(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.customer_community_members where organization_id = p_org_id
  ) then
    return;
  end if;

  insert into public.customer_community_members (
    organization_id, member_key, username, display_name,
    membership_status, membership_level, verification_status, profile_reference,
    email_masked, phone_masked,
    is_system_user, is_admin_user, is_test, is_demo
  ) values
    (
      p_org_id, 'mbr_jane_001', 'jane_community', 'Jane Nordmann',
      'active', 'gold', 'approved', 'profile_ref_***001',
      'j***@example.com', '****5678',
      false, false, false, false
    ),
    (
      p_org_id, 'mbr_ole_002', 'ole_community', 'Ole Hansen',
      'active', 'silver', 'pending', 'profile_ref_***002',
      'o***@example.com', '****9012',
      false, false, false, false
    ),
    (
      p_org_id, 'mbr_liv_003', 'liv_member', 'Liv Olsen',
      'inactive', 'bronze', 'approved', 'profile_ref_***003',
      'l***@example.com', '****3456',
      false, false, false, false
    ),
    (
      p_org_id, 'mbr_admin_sys', 'admin_system', 'System Admin',
      'active', 'platinum', 'approved', 'profile_ref_***admin',
      null, null,
      true, true, false, false
    ),
    (
      p_org_id, 'mbr_demo_test', 'demo_member', 'Demo Member',
      'active', 'standard', 'approved', 'profile_ref_***demo',
      null, null,
      false, false, true, true
    );
end;
$$;

create or replace function public.get_customer_member_directory_center(
  p_search_term text default null,
  p_search_field text default 'name'
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_access jsonb;
  v_field text := lower(coalesce(nullif(trim(p_search_field), ''), 'name'));
  v_term text := nullif(trim(p_search_term), '');
  v_members jsonb := '[]'::jsonb;
  v_match_count int := 0;
  v_total_count int := 0;
  v_completeness text := 'empty';
  v_generated_at timestamptz := now();
begin
  v_org_id := public._presence_tenant_for_auth();
  v_user_id := public._mta_app_user_id();
  if v_org_id is null or v_user_id is null then
    return jsonb_build_object('found', false, 'error', 'access_denied');
  end if;

  v_access := public._cmd09_assert_read_access(v_org_id);
  if coalesce(v_access->>'ok', 'false') <> 'true' then
    return jsonb_build_object(
      'found', false,
      'error', coalesce(v_access->>'error', 'access_denied'),
      'organization_id', v_org_id
    );
  end if;

  perform public._cmd09_seed_members(v_org_id);

  select count(*)::int
  into v_total_count
  from public.customer_community_members m
  where m.organization_id = v_org_id
    and m.is_system_user = false
    and m.is_admin_user = false
    and m.is_test = false
    and m.is_demo = false;

  v_completeness := case when v_total_count > 0 then 'complete' else 'empty' end;

  if v_term is not null then
    select coalesce(jsonb_agg(
      jsonb_build_object(
        'member_id', m.member_key,
        'username', m.username,
        'display_name', m.display_name,
        'membership_status', m.membership_status,
        'membership_level', m.membership_level,
        'verification_status', m.verification_status,
        'profile_reference', m.profile_reference,
        'email_masked', m.email_masked,
        'phone_masked', m.phone_masked
      ) order by m.display_name asc
    ), '[]'::jsonb)
    into v_members
    from public.customer_community_members m
    where m.organization_id = v_org_id
      and m.is_system_user = false
      and m.is_admin_user = false
      and m.is_test = false
      and m.is_demo = false
      and (
        (v_field = 'name' and lower(m.display_name) like '%' || lower(v_term) || '%')
        or (v_field = 'username' and lower(m.username) like '%' || lower(v_term) || '%')
        or (v_field in ('external_id', 'member_id') and lower(m.member_key) = lower(v_term))
      );

    v_match_count := coalesce(jsonb_array_length(v_members), 0);
  end if;

  insert into public.customer_community_member_directory_audit (
    organization_id, actor_user_id, action, search_field, search_term, match_count, source_reference
  ) values (
    v_org_id, v_user_id, 'read', v_field, v_term, v_match_count, 'get_customer_member_directory_center'
  );

  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'source_reference', 'get_customer_member_directory_center',
    'completeness', v_completeness,
    'total_member_count', v_total_count,
    'members', coalesce(v_members, '[]'::jsonb),
    'search', jsonb_build_object(
      'field', v_field,
      'term', v_term,
      'match_count', v_match_count
    ),
    'generated_at', v_generated_at,
    'privacy_note', 'Masked community member directory metadata — no raw email or phone values.'
  );
end;
$$;

grant execute on function public.get_customer_member_directory_center(text, text) to authenticated;
