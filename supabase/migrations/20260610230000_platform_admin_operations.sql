-- Platform Admin: installations list, support queue, extended support metadata

alter table public.support_cases
  add column if not exists category text not null default 'general',
  add column if not exists priority text not null default 'normal' check (
    priority in ('low', 'normal', 'high', 'urgent')
  ),
  add column if not exists ai_escalation_reason text;

create or replace function public.list_platform_installations()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return coalesce(
    (
      select jsonb_agg(row_data order by created_at desc)
      from (
        select jsonb_build_object(
          'id', i.id,
          'customer_id', c.id,
          'customer_number', c.customer_number,
          'customer_name', coalesce(c.company_name, c.full_name, c.email),
          'customer_email', c.email,
          'site_url', i.site_url,
          'system_type', i.system_type,
          'status', i.status,
          'modules', coalesce(
            (
              select jsonb_agg(im.module_key order by im.module_key)
              from public.installation_modules im
              where im.installation_id = i.id and im.enabled = true
            ),
            '[]'::jsonb
          ),
          'integrations', coalesce(
            (
              select jsonb_agg(
                jsonb_build_object(
                  'integration_key', ii.integration_key,
                  'status', ii.status,
                  'last_synced_at', ii.last_synced_at
                )
                order by ii.integration_key
              )
              from public.installation_integrations ii
              where ii.installation_id = i.id
            ),
            '[]'::jsonb
          ),
          'last_synced_at', i.last_synced_at,
          'created_at', i.created_at
        ) as row_data,
        i.created_at
        from public.installations i
        join public.customers c on c.company_id = i.company_id
      ) rows
    ),
    '[]'::jsonb
  );
end;
$$;

grant execute on function public.list_platform_installations() to authenticated;

create or replace function public.list_platform_support_queue()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return coalesce(
    (
      select jsonb_agg(row_data order by opened_at desc)
      from (
        select jsonb_build_object(
          'id', sc.id,
          'customer_id', sc.customer_id,
          'customer_number', c.customer_number,
          'customer_name', coalesce(c.company_name, c.full_name, c.email),
          'customer_email', c.email,
          'subject', sc.subject,
          'category', sc.category,
          'priority', sc.priority,
          'status', sc.status,
          'assigned_agent', sc.assigned_agent,
          'ai_escalation_reason', sc.ai_escalation_reason,
          'opened_at', sc.opened_at,
          'last_contact_at', sc.last_contact_at,
          'updated_at', coalesce(sc.last_contact_at, sc.opened_at)
        ) as row_data,
        sc.opened_at
        from public.support_cases sc
        join public.customers c on c.id = sc.customer_id
      ) rows
    ),
    '[]'::jsonb
  );
end;
$$;

grant execute on function public.list_platform_support_queue() to authenticated;

do $$
declare
  v_customer_id uuid;
begin
  select id into v_customer_id
  from public.customers
  where customer_number = 'AIP-000001'
  limit 1;

  if v_customer_id is null then
    return;
  end if;

  update public.support_cases
  set
    category = 'onboarding',
    priority = 'normal',
    assigned_agent = 'Platform Support',
    last_contact_at = now() - interval '1 day'
  where customer_id = v_customer_id
    and subject = 'Onboarding check-in';

  insert into public.support_cases (
    customer_id,
    subject,
    category,
    priority,
    status,
    assigned_agent,
    ai_escalation_reason,
    opened_at,
    last_contact_at
  )
  select
    v_customer_id,
    'Refund policy clarification',
    'billing',
    'high',
    'escalated',
    'Unassigned',
    'AI could not resolve the case',
    now() - interval '6 hours',
    now() - interval '2 hours'
  where not exists (
    select 1
    from public.support_cases
    where customer_id = v_customer_id
      and subject = 'Refund policy clarification'
  );

  insert into public.support_cases (
    customer_id,
    subject,
    category,
    priority,
    status,
    assigned_agent,
    ai_escalation_reason,
    opened_at,
    last_contact_at
  )
  select
    v_customer_id,
    'Integration sync delay',
    'technical',
    'urgent',
    'escalated',
    'Platform Support',
    'Requires human review',
    now() - interval '12 hours',
    now() - interval '3 hours'
  where not exists (
    select 1
    from public.support_cases
    where customer_id = v_customer_id
      and subject = 'Integration sync delay'
  );
end;
$$;
