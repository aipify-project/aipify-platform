create or replace function public._sec_emergency_stop_active(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public._tacc_is_emergency_active(p_tenant_id);
$$;
