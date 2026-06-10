-- AI-first platform dashboard: admin login tracking + activity snapshot

alter table public.platform_admins
  add column if not exists last_login_at timestamptz,
  add column if not exists previous_login_at timestamptz;

create or replace function public.record_platform_admin_login()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_row public.platform_admins%rowtype;
  v_name text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update public.platform_admins
  set
    previous_login_at = last_login_at,
    last_login_at = now()
  where auth_user_id = auth.uid()
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Not authorized';
  end if;

  select coalesce(
    nullif(trim(au.raw_user_meta_data ->> 'full_name'), ''),
    split_part(au.email, '@', 1)
  )
  into v_name
  from auth.users au
  where au.id = auth.uid();

  return jsonb_build_object(
    'admin_name', coalesce(v_name, 'Admin'),
    'last_login_at', v_row.last_login_at,
    'previous_login_at', v_row.previous_login_at
  );
end;
$$;

grant execute on function public.record_platform_admin_login() to authenticated;

create or replace function public.get_platform_dashboard_snapshot(p_since timestamptz default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_since timestamptz := coalesce(p_since, now() - interval '7 days');
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return jsonb_build_object(
    'since', v_since,
    'new_customers',
      (select count(*) from public.customers c where c.created_at > v_since),
    'new_installations',
      (select count(*) from public.installations i where i.created_at > v_since),
    'trials_ending_7d',
      (
        select count(*)
        from public.customers c
        join public.subscriptions s on s.customer_id = c.id
        where s.status = 'trialing'
          and s.trial_ends_at is not null
          and s.trial_ends_at <= now() + interval '7 days'
      ),
    'support_resolved',
      coalesce(
        (select us.support_requests_handled from public.usage_statistics us limit 1),
        0
      ),
    'escalated_cases',
      (select count(*) from public.support_cases sc where sc.status = 'escalated'),
    'waiting_human',
      (
        select count(*)
        from public.support_cases sc
        where sc.status = 'escalated'
          and sc.ai_escalation_reason is not null
      ),
    'open_cases',
      (select count(*) from public.support_cases sc where sc.status = 'open'),
    'billing_events',
      (
        select count(*)
        from public.invoices inv
        where inv.created_at > v_since
           or (inv.status = 'overdue' and inv.due_date <= now())
      ),
    'follow_up_customers',
      (select count(*) from public.customers c where c.status in ('paused', 'overdue')),
    'system_incidents',
      (select count(*) from public.installations i where i.status in ('revoked', 'paused'))
  );
end;
$$;

grant execute on function public.get_platform_dashboard_snapshot(timestamptz) to authenticated;
