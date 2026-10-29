-- AIPIFY CORE STAGING — synthetic visitor FAQ fixtures v1
-- Exact task: AIPIFY_CORE_STAGING_BASELINE_AND_SQL396_CONTROLLED_LIVE_PLAN_V1
--
-- Synthetic only. Placeholder domains/UUIDs. NO Production customer/FAQ/auth data.
-- Requires baseline tables + search RPC (after 325/382 or 396).
-- DO NOT APPLY without owner approval of this exact file + SHA-256.

-- Tenant A: one install, verified apex + www
-- Tenant B: isolated install (cross-tenant negative)

truncate public.tenant_public_companion_faq_items;
delete from public.customer_domains;
delete from public.installations;
delete from public.customers;

insert into public.customers (id, company_id) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd');

insert into public.installations (id, customer_id, company_id, site_url, revoked_at, status) values
  (
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'https://site-a.example',
    null,
    'active'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    'https://other.example',
    null,
    'active'
  );

insert into public.customer_domains (
  customer_id, domain, verification_status, status, installation_id
) values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'site-a.example',
    'verified',
    'active',
    '11111111-1111-4111-8111-111111111111'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'www.site-a.example',
    'verified',
    'active',
    '11111111-1111-4111-8111-111111111111'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'other.example',
    'verified',
    'active',
    '33333333-3333-4333-8333-333333333333'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'www.other.example',
    'verified',
    'active',
    '33333333-3333-4333-8333-333333333333'
  );

insert into public.tenant_public_companion_faq_items (
  id, tenant_id, install_id, domain, locale, title, answer,
  content_type, status, public_safe, surface, published_at, priority
) values
  (
    '00000000-0000-4000-8000-000000000001',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '11111111-1111-4111-8111-111111111111',
    'site-a.example',
    'no',
    'strong email faq',
    'email notifications are available for members',
    'faq',
    'published',
    true,
    'website_kompis',
    now(),
    100
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '11111111-1111-4111-8111-111111111111',
    'www.site-a.example',
    'no',
    'www stored faq',
    'stored under www host',
    'faq',
    'published',
    true,
    'website_kompis',
    now(),
    100
  ),
  (
    '00000000-0000-4000-8000-000000000008',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '33333333-3333-4333-8333-333333333333',
    'other.example',
    'no',
    'foreign tenant email faq',
    'must not leak',
    'faq',
    'published',
    true,
    'website_kompis',
    now(),
    100
  );

insert into supabase_migrations.schema_migrations (version)
values ('staging_wk_faq_visitor_synthetic_fixtures_v1')
on conflict (version) do nothing;
