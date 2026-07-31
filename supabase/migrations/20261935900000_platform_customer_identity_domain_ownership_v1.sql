-- Platform Customer Identity Domain Ownership V1
-- Generic contact-email update RPC + repair internal tenant email generator.
-- Apply-side effects: none (no customer row updates, no auth/billing/email/DNS).

create unique index if not exists customers_email_lower_uidx
  on public.customers (lower(email))
  where email is not null and btrim(email) <> '';

create table if not exists public.platform_customer_identity_writes (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id),
  organization_id uuid not null,
  idempotency_key text not null,
  previous_email text not null,
  new_email text not null,
  previous_email_domain text not null,
  new_email_domain text not null,
  internal_reason text not null,
  actor_auth_user_id uuid not null,
  result text not null check (result in ('updated', 'idempotent_replay')),
  created_at timestamptz not null default now(),
  constraint platform_customer_identity_writes_key_uniq unique (idempotency_key)
);

create index if not exists platform_customer_identity_writes_customer_idx
  on public.platform_customer_identity_writes (customer_id, created_at desc);

alter table public.platform_customer_identity_writes enable row level security;

revoke all on table public.platform_customer_identity_writes from public, anon;
grant select on table public.platform_customer_identity_writes to authenticated;

create or replace function public._is_internal_aipify_customer(p_customer_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_slug text;
  v_is_platform boolean := false;
begin
  select lower(coalesce(c.slug, '')), coalesce(co.is_platform, false)
    into v_slug, v_is_platform
  from public.customers c
  left join public.companies co on co.id = c.company_id
  where c.id = p_customer_id;

  if not found then
    return false;
  end if;

  if v_is_platform then
    return true;
  end if;

  return v_slug in ('aipify-group', 'aipify-internal', 'aipify');
end;
$$;

revoke all on function public._is_internal_aipify_customer(uuid) from public, anon;
grant execute on function public._is_internal_aipify_customer(uuid) to authenticated;

create or replace function public._normalize_customer_contact_email(p_email text)
returns text
language plpgsql
immutable
set search_path = public
as $$
declare
  v_email text;
begin
  v_email := lower(btrim(coalesce(p_email, '')));
  if v_email = '' then
    raise exception 'invalid_email' using errcode = 'P0001';
  end if;
  if length(v_email) > 254
     or v_email !~* '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$'
  then
    raise exception 'invalid_email' using errcode = 'P0001';
  end if;
  return v_email;
end;
$$;

revoke all on function public._normalize_customer_contact_email(text) from public, anon;

create or replace function public._assert_customer_contact_email_allowed(
  p_email text,
  p_is_internal boolean
)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_email text;
  v_domain text;
begin
  v_email := public._normalize_customer_contact_email(p_email);
  v_domain := split_part(v_email, '@', 2);

  -- Always reject unowned aipify.com (boundary: exact domain).
  if v_domain = 'aipify.com' then
    raise exception 'aipify_com_not_owned' using errcode = 'P0001';
  end if;

  if p_is_internal and v_domain <> 'aipify.ai' then
    raise exception 'internal_aipify_requires_owned_domain' using errcode = 'P0001';
  end if;

  return v_email;
end;
$$;

revoke all on function public._assert_customer_contact_email_allowed(text, boolean) from public, anon;

create or replace function public.get_platform_portal_customer_identity(
  p_customer_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer public.customers%rowtype;
  v_email text;
  v_domain text;
  v_internal boolean;
begin
  perform public._platform_require_high_risk_write();

  select * into v_customer
  from public.customers c
  where c.id = p_customer_id;

  if not found then
    raise exception 'customer_not_found' using errcode = 'P0001';
  end if;

  v_email := lower(btrim(coalesce(v_customer.email, '')));
  v_domain := case when v_email like '%@%' then split_part(v_email, '@', 2) else null end;
  v_internal := public._is_internal_aipify_customer(p_customer_id);

  return jsonb_build_object(
    'customer_id', v_customer.id,
    'organization_id', v_customer.id,
    'slug', v_customer.slug,
    'company_name', v_customer.company_name,
    'contact_email', nullif(v_email, ''),
    'email_domain', v_domain,
    'is_internal_aipify_identity', v_internal,
    'forbidden_unowned_domain', coalesce(v_domain = 'aipify.com', false),
    'owned_aipify_domain', coalesce(v_domain = 'aipify.ai', false),
    'updated_at', v_customer.updated_at
  );
end;
$$;

revoke all on function public.get_platform_portal_customer_identity(uuid) from public, anon;
grant execute on function public.get_platform_portal_customer_identity(uuid) to authenticated;

create or replace function public.update_platform_portal_customer_contact_email(
  p_customer_id uuid,
  p_email text,
  p_expected_current_email text,
  p_confirmation boolean,
  p_internal_reason text,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_customer public.customers%rowtype;
  v_internal boolean;
  v_current text;
  v_expected text;
  v_new text;
  v_prev_domain text;
  v_new_domain text;
  v_reason text;
  v_key text;
  v_existing public.platform_customer_identity_writes%rowtype;
  v_conflict_id uuid;
  v_result text := 'updated';
begin
  perform public._platform_require_high_risk_write();

  if coalesce(p_confirmation, false) is not true then
    raise exception 'confirmation_required' using errcode = 'P0001';
  end if;

  v_reason := nullif(btrim(coalesce(p_internal_reason, '')), '');
  if v_reason is null or char_length(v_reason) < 3 or char_length(v_reason) > 500 then
    raise exception 'invalid_internal_reason' using errcode = 'P0001';
  end if;

  v_key := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'invalid_idempotency_key' using errcode = 'P0001';
  end if;
  if v_key !~ '^[A-Za-z0-9._:-]+$' then
    raise exception 'invalid_idempotency_key' using errcode = 'P0001';
  end if;

  select * into v_existing
  from public.platform_customer_identity_writes w
  where w.idempotency_key = v_key;

  if found then
    if v_existing.customer_id <> p_customer_id then
      raise exception 'idempotency_conflict' using errcode = 'P0001';
    end if;
    return jsonb_build_object(
      'ok', true,
      'result', 'idempotent_replay',
      'customer_id', v_existing.customer_id,
      'organization_id', v_existing.organization_id,
      'previous_email', v_existing.previous_email,
      'new_email', v_existing.new_email,
      'previous_email_domain', v_existing.previous_email_domain,
      'new_email_domain', v_existing.new_email_domain,
      'idempotency_key', v_existing.idempotency_key,
      'write_id', v_existing.id,
      'auth_unchanged', true,
      'billing_unchanged', true,
      'email_sent', false,
      'notification_sent', false
    );
  end if;

  select * into v_customer
  from public.customers c
  where c.id = p_customer_id
  for update;

  if not found then
    raise exception 'customer_not_found' using errcode = 'P0001';
  end if;

  v_internal := public._is_internal_aipify_customer(p_customer_id);
  v_current := lower(btrim(coalesce(v_customer.email, '')));
  v_expected := public._normalize_customer_contact_email(p_expected_current_email);
  v_new := public._assert_customer_contact_email_allowed(p_email, v_internal);

  if v_current <> v_expected then
    raise exception 'expected_email_mismatch' using errcode = 'P0001';
  end if;

  if v_current = v_new then
    insert into public.platform_customer_identity_writes (
      customer_id, organization_id, idempotency_key,
      previous_email, new_email, previous_email_domain, new_email_domain,
      internal_reason, actor_auth_user_id, result
    ) values (
      p_customer_id, p_customer_id, v_key,
      v_current, v_new, split_part(v_current, '@', 2), split_part(v_new, '@', 2),
      v_reason, v_actor, 'idempotent_replay'
    )
    returning * into v_existing;

    perform public.record_platform_admin_audit_event(
      'platform_customer_contact_email_noop',
      'customer',
      p_customer_id::text,
      jsonb_build_object(
        'organization_id', p_customer_id,
        'previous_email', v_current,
        'new_email', v_new,
        'previous_email_domain', split_part(v_current, '@', 2),
        'new_email_domain', split_part(v_new, '@', 2),
        'internal_reason', v_reason,
        'idempotency_key', v_key,
        'result', 'idempotent_replay',
        'auth_unchanged', true,
        'billing_unchanged', true,
        'email_sent', false
      )
    );

    return jsonb_build_object(
      'ok', true,
      'result', 'idempotent_replay',
      'customer_id', p_customer_id,
      'organization_id', p_customer_id,
      'previous_email', v_current,
      'new_email', v_new,
      'previous_email_domain', split_part(v_current, '@', 2),
      'new_email_domain', split_part(v_new, '@', 2),
      'idempotency_key', v_key,
      'write_id', v_existing.id,
      'auth_unchanged', true,
      'billing_unchanged', true,
      'email_sent', false,
      'notification_sent', false
    );
  end if;

  select c.id into v_conflict_id
  from public.customers c
  where lower(btrim(c.email)) = v_new
    and c.id <> p_customer_id
  limit 1;

  if v_conflict_id is not null then
    raise exception 'email_conflict' using errcode = 'P0001';
  end if;

  v_prev_domain := split_part(v_current, '@', 2);
  v_new_domain := split_part(v_new, '@', 2);

  update public.customers
  set email = v_new,
      updated_at = now()
  where id = p_customer_id
    and lower(btrim(email)) = v_expected
  returning id into v_conflict_id;

  if v_conflict_id is null then
    raise exception 'expected_email_mismatch' using errcode = 'P0001';
  end if;

  insert into public.platform_customer_identity_writes (
    customer_id, organization_id, idempotency_key,
    previous_email, new_email, previous_email_domain, new_email_domain,
    internal_reason, actor_auth_user_id, result
  ) values (
    p_customer_id, p_customer_id, v_key,
    v_current, v_new, v_prev_domain, v_new_domain,
    v_reason, v_actor, v_result
  )
  returning * into v_existing;

  perform public.record_platform_admin_audit_event(
    'platform_customer_contact_email_updated',
    'customer',
    p_customer_id::text,
    jsonb_build_object(
      'organization_id', p_customer_id,
      'previous_email', v_current,
      'new_email', v_new,
      'previous_email_domain', v_prev_domain,
      'new_email_domain', v_new_domain,
      'internal_reason', v_reason,
      'idempotency_key', v_key,
      'result', v_result,
      'auth_unchanged', true,
      'billing_unchanged', true,
      'email_sent', false,
      'notification_sent', false
    )
  );

  return jsonb_build_object(
    'ok', true,
    'result', v_result,
    'customer_id', p_customer_id,
    'organization_id', p_customer_id,
    'previous_email', v_current,
    'new_email', v_new,
    'previous_email_domain', v_prev_domain,
    'new_email_domain', v_new_domain,
    'idempotency_key', v_key,
    'write_id', v_existing.id,
    'auth_unchanged', true,
    'billing_unchanged', true,
    'email_sent', false,
    'notification_sent', false
  );
end;
$$;

revoke all on function public.update_platform_portal_customer_contact_email(
  uuid, text, text, boolean, text, text
) from public, anon;
grant execute on function public.update_platform_portal_customer_contact_email(
  uuid, text, text, boolean, text, text
) to authenticated;

-- Repair generator default only. Does not mutate existing customer rows.
create or replace function public._aio_provision_internal_tenant()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_company_id uuid;
  v_customer_id uuid;
begin
  select id into v_company_id from public.companies where is_platform = true limit 1;

  if v_company_id is null then
    insert into public.companies (name, slug, is_platform)
    values ('Aipify Group AS', 'aipify-internal', true)
    returning id into v_company_id;
  end if;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_company_id
  order by c.created_at
  limit 1;

  if v_customer_id is null then
    select c.id into v_customer_id
    from public.customers c
    where c.slug in ('aipify-group', 'aipify-internal', 'aipify')
    limit 1;
  end if;

  if v_customer_id is null then
    insert into public.customers (
      customer_number, company_id, customer_type, slug, company_name, email, country, language, status
    ) values (
      public.format_customer_number(nextval('public.customer_number_seq')),
      v_company_id,
      'company',
      'aipify-group',
      'Aipify Group AS',
      'admin@aipify.ai',
      'NO',
      'en',
      'active'
    )
    returning id into v_customer_id;
  end if;

  if to_regprocedure('public._mta_sync_organization_from_customer(uuid)') is not null then
    perform public._mta_sync_organization_from_customer(v_customer_id);
  end if;

  select id into v_org_id from public.organizations where id = v_customer_id;
  if v_org_id is null then
    insert into public.organizations (id, name, slug, status, subscription_plan)
    values (v_customer_id, 'Aipify Group AS', 'aipify-internal', 'active', 'internal')
    on conflict (id) do update set
      name = excluded.name,
      slug = excluded.slug,
      status = excluded.status,
      subscription_plan = excluded.subscription_plan,
      updated_at = now()
    returning id into v_org_id;
    v_org_id := coalesce(v_org_id, v_customer_id);
  end if;

  return v_org_id;
end;
$$;

revoke all on function public._aio_provision_internal_tenant() from public, anon;
