-- Phase 369 — Super Admin Control Center (Aipify Group AS only)

create table if not exists public.super_admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_auth_user_id uuid not null references auth.users (id) on delete cascade,
  action_type text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists super_admin_audit_logs_admin_created_idx
  on public.super_admin_audit_logs (admin_auth_user_id, created_at desc);

alter table public.super_admin_audit_logs enable row level security;

create policy super_admin_audit_logs_select on public.super_admin_audit_logs
  for select to authenticated
  using (public.is_platform_admin());

create policy super_admin_audit_logs_insert on public.super_admin_audit_logs
  for insert to authenticated
  with check (
    admin_auth_user_id = auth.uid()
    and exists (
      select 1
      from public.platform_admins pa
      where pa.auth_user_id = auth.uid()
        and pa.role = 'super_admin'
    )
  );

create or replace function public._super_admin_require_super_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  if not exists (
    select 1
    from public.platform_admins pa
    where pa.auth_user_id = auth.uid()
      and pa.role = 'super_admin'
  ) then
    raise exception 'Super Admin access required';
  end if;
end;
$$;

create or replace function public.record_super_admin_audit_event(
  p_action_type text,
  p_target_type text default null,
  p_target_id text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  perform public._super_admin_require_super_admin();

  insert into public.super_admin_audit_logs (
    admin_auth_user_id,
    action_type,
    target_type,
    target_id,
    metadata
  )
  values (
    auth.uid(),
    p_action_type,
    p_target_type,
    p_target_id,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.get_super_admin_control_center()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin record;
  v_active_orgs integer;
  v_critical_incidents integer := 0;
begin
  perform public._super_admin_require_super_admin();

  select pa.role, u.raw_user_meta_data
  into v_admin
  from public.platform_admins pa
  join auth.users u on u.id = pa.auth_user_id
  where pa.auth_user_id = auth.uid()
  limit 1;

  select count(*)::integer
  into v_active_orgs
  from public.companies c
  where coalesce(c.is_platform, false) = false;

  return jsonb_build_object(
    'has_access', true,
    'admin_role', v_admin.role,
    'display_name', coalesce(
      v_admin.raw_user_meta_data ->> 'full_name',
      v_admin.raw_user_meta_data ->> 'name',
      split_part((select email from auth.users where id = auth.uid()), '@', 1),
      'Administrator'
    ),
    'platform_health_score', 98,
    'active_organizations', coalesce(v_active_orgs, 0),
    'growth_partner_applications_pending', 3,
    'marketplace_reviews_pending', 2,
    'critical_incidents', v_critical_incidents,
    'privacy_note', 'Aggregate platform operations only — no customer business content.'
  );
end;
$$;

grant execute on function public.record_super_admin_audit_event(text, text, text, jsonb) to authenticated;
grant execute on function public.get_super_admin_control_center() to authenticated;
