-- Synthetic cases for the disposable fixture. Fails the script on a wrong result.

insert into installations (id, customer_id, status, revoked_at) values
  ('11111111-1111-4111-8111-111111111101', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'ready', null),
  ('22222222-2222-4222-8222-222222222202', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'ready', null),
  ('33333333-3333-4333-8333-333333333301', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'ready', null),
  ('44444444-4444-4444-8444-444444444404', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'ready', now());

insert into customer_domains (customer_id, domain, installation_id, verification_status, status) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'a1.example', '11111111-1111-4111-8111-111111111101', 'verified', 'active'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'www.a1.example', '11111111-1111-4111-8111-111111111101', 'verified', 'active'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'b1.example', '33333333-3333-4333-8333-333333333301', 'verified', 'active');

insert into faq_items (id, tenant_id, install_id, domain, locale, status, title) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa11', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', null, null, 'sv', 'published', 'legacy'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa12', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-1111-4111-8111-111111111101', 'a1.example', 'sv', 'published', 'a1'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa13', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-1111-4111-8111-111111111101', 'a1.example', 'sv', 'draft', 'draft'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb11', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', '33333333-3333-4333-8333-333333333301', 'b1.example', 'da', 'published', 'b1');

do $$
declare
  n int;
begin
  -- Alias www and apex share one installation, so the tenant still has exactly one active install.
  if count_active_verified_installs('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1') <> 1 then
    raise exception 'alias should count as one install';
  end if;
  select count(*) into n from visible_faq(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111101',
    'a1.example'
  );
  if n <> 2 then
    raise exception 'single install should see legacy and own published rows, got %', n;
  end if;

  insert into customer_domains (customer_id, domain, installation_id, verification_status, status)
  values (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'a2.example',
    '22222222-2222-4222-8222-222222222202',
    'verified',
    'active'
  );

  if count_active_verified_installs('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1') <> 2 then
    raise exception 'two installs expected';
  end if;

  if exists (
    select 1 from visible_faq(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111101',
      'a1.example'
    ) where visible_faq = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa11'
  ) then
    raise exception 'legacy null leaked across two installs';
  end if;

  if exists (
    select 1 from visible_faq(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '22222222-2222-4222-8222-222222222202',
      'a2.example'
    ) where visible_faq = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa12'
  ) then
    raise exception 'a1 row leaked to a2';
  end if;

  if exists (
    select 1 from visible_faq(
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
      '33333333-3333-4333-8333-333333333301',
      'b1.example'
    ) where visible_faq = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa12'
  ) then
    raise exception 'cross tenant leak';
  end if;

  if exists (
    select 1 from visible_faq(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111101',
      'a1.example'
    ) where visible_faq = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa13'
  ) then
    raise exception 'draft row was visible';
  end if;
end $$;

insert into organization_domains (id, organization_id, customer_id, domain, verification_status, domain_status)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa21', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'new.example', 'pending', 'pending'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa22', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'ready.example', 'verified', 'active'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb22', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'ready.example', 'verified', 'active');

insert into license_pool (organization_id, valid) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', true),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', false);

do $$
begin
  begin
    perform provision_site('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa21', true);
    raise exception 'pending domain was provisioned';
  exception
    when others then
      if sqlerrm <> 'domain_not_ready' then
        raise;
      end if;
  end;

  begin
    perform provision_site('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb22', true);
    raise exception 'missing license was provisioned';
  exception
    when others then
      if sqlerrm <> 'license_missing' then
        raise;
      end if;
  end;

  begin
    perform provision_site('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa22', false);
    raise exception 'unconfirmed provision succeeded';
  exception
    when others then
      if sqlerrm <> 'confirmation_required' then
        raise;
      end if;
  end;
end $$;

do $$
declare
  first_id uuid;
  second_id uuid;
begin
  first_id := provision_site('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa22', true);
  second_id := provision_site('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa22', true);
  if first_id is null or first_id <> second_id then
    raise exception 'provision was not idempotent';
  end if;
  if (select count(*) from customer_domains where domain = 'ready.example' and installation_id = first_id) <> 1 then
    raise exception 'hostname binding missing';
  end if;
end $$;

create role fixture_owner nologin;
create role fixture_viewer nologin;
revoke all on function provision_site(uuid, boolean) from public;
grant execute on function provision_site(uuid, boolean) to fixture_owner;

do $$
begin
  begin
    execute 'set local role fixture_viewer';
    perform provision_site('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa22', true);
    raise exception 'viewer executed provision';
  exception
    when insufficient_privilege then
      null;
  end;
end $$;
