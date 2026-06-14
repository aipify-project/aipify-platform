-- Portal separation — Platform Admin audit trail

create table if not exists public.platform_admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_auth_user_id uuid not null references auth.users (id) on delete cascade,
  action_type text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_admin_audit_logs_admin_created_idx
  on public.platform_admin_audit_logs (admin_auth_user_id, created_at desc);

alter table public.platform_admin_audit_logs enable row level security;

create policy platform_admin_audit_logs_select on public.platform_admin_audit_logs
  for select to authenticated
  using (public.is_platform_admin());

create policy platform_admin_audit_logs_insert on public.platform_admin_audit_logs
  for insert to authenticated
  with check (
    admin_auth_user_id = auth.uid()
    and public.is_platform_admin()
  );

create or replace function public.record_platform_admin_audit_event(
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
  if not public.is_platform_admin() then
    raise exception 'Platform Admin access required';
  end if;

  insert into public.platform_admin_audit_logs (
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

grant execute on function public.record_platform_admin_audit_event(text, text, text, jsonb) to authenticated;
