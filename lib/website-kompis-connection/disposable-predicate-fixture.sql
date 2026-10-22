-- Disposable local fixture. Not a migration. Do not apply to a shared database.
-- Reproduces the live public FAQ predicate and a provision idempotency sketch
-- with synthetic tenants only.

create table installations (
  id uuid primary key,
  customer_id uuid not null,
  status text not null,
  revoked_at timestamptz
);

create table customer_domains (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null,
  domain text not null,
  installation_id uuid references installations (id),
  verification_status text not null,
  status text not null,
  unique (customer_id, domain)
);

create table faq_items (
  id uuid primary key,
  tenant_id uuid not null,
  install_id uuid,
  domain text,
  locale text not null,
  status text not null,
  title text not null
);

create table organization_domains (
  id uuid primary key,
  organization_id uuid not null,
  customer_id uuid not null,
  domain text not null,
  verification_status text not null,
  domain_status text not null
);

create table license_pool (
  organization_id uuid primary key,
  valid boolean not null
);

create function count_active_verified_installs(p_tenant_id uuid)
returns integer
language sql
stable
as $$
  select coalesce((
    select count(distinct cd.installation_id)::integer
    from customer_domains cd
    inner join installations i on i.id = cd.installation_id
    where cd.customer_id = p_tenant_id
      and cd.verification_status = 'verified'
      and cd.status = 'active'
      and cd.installation_id is not null
      and i.revoked_at is null
      and i.status in ('ready', 'installing', 'active', 'warning')
  ), 0);
$$;

create function visible_faq(p_tenant uuid, p_install uuid, p_domain text)
returns setof uuid
language sql
stable
as $$
  select f.id
  from faq_items f
  where f.tenant_id = p_tenant
    and f.status = 'published'
    and (
      f.install_id = p_install
      or (
        f.install_id is null
        and count_active_verified_installs(p_tenant) = 1
      )
    )
    and (
      f.domain is null
      or p_domain is null
      or f.domain = p_domain
    );
$$;

create function provision_site(p_domain_id uuid, p_confirmation boolean)
returns uuid
language plpgsql
as $$
declare
  v_org uuid;
  v_customer uuid;
  v_domain text;
  v_verified text;
  v_status text;
  v_existing uuid;
  v_install uuid;
  v_valid boolean;
begin
  if p_confirmation is not true then
    raise exception 'confirmation_required';
  end if;

  select organization_id, customer_id, domain, verification_status, domain_status
    into v_org, v_customer, v_domain, v_verified, v_status
  from organization_domains
  where id = p_domain_id
  for update;

  if v_org is null then
    raise exception 'domain_missing';
  end if;
  if v_verified is distinct from 'verified' or v_status is distinct from 'active' then
    raise exception 'domain_not_ready';
  end if;

  select valid into v_valid from license_pool where organization_id = v_org;
  if v_valid is not true then
    raise exception 'license_missing';
  end if;

  select installation_id into v_existing
  from customer_domains
  where customer_id = v_customer and domain = v_domain
  for update;

  if v_existing is not null then
    return v_existing;
  end if;

  if exists (
    select 1 from customer_domains
    where domain = v_domain and customer_id <> v_customer and installation_id is not null
  ) then
    raise exception 'hostname_foreign';
  end if;

  insert into installations (id, customer_id, status, revoked_at)
  values (gen_random_uuid(), v_customer, 'ready', null)
  returning id into v_install;

  insert into customer_domains (
    customer_id, domain, installation_id, verification_status, status
  ) values (
    v_customer, v_domain, v_install, 'verified', 'active'
  );

  return v_install;
end;
$$;
