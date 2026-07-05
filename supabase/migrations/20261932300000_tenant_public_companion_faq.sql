-- PUBLIC.KOMPIS.FAQ.01D — Website Kompis public-safe FAQ storage + audit
-- Feature owner: Customer App (APP) · Public read RPC deferred to gate 01E
-- Tenant model: public.customers (Companion tenant pattern)

-- ---------------------------------------------------------------------------
-- 0. Auth helpers (owner/admin + tenant scope for RLS)
-- ---------------------------------------------------------------------------
create or replace function public._wpkf_auth_is_owner_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.auth_user_id = auth.uid()
      and u.role::text in ('owner', 'admin')
  );
$$;

create or replace function public._wpkf_auth_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select public._presence_tenant_for_auth();
$$;

revoke all on function public._wpkf_auth_is_owner_admin() from public;
revoke all on function public._wpkf_auth_tenant_id() from public;
grant execute on function public._wpkf_auth_is_owner_admin() to authenticated;
grant execute on function public._wpkf_auth_tenant_id() to authenticated;

-- ---------------------------------------------------------------------------
-- 1. tenant_public_companion_faq_items
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_public_companion_faq_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  install_id uuid references public.installations (id) on delete set null,
  domain text,
  locale text not null,
  title text not null,
  question text,
  answer text not null,
  category text,
  content_type text not null,
  status text not null default 'draft',
  public_safe boolean not null default false,
  surface text not null default 'website_kompis',
  priority integer not null default 100,
  tags text[] not null default '{}'::text[],
  source_url text,
  valid_from timestamptz,
  valid_until timestamptz,
  last_reviewed_at timestamptz,
  published_at timestamptz,
  published_by uuid references public.users (id) on delete set null,
  created_by uuid not null references public.users (id) on delete restrict,
  updated_by uuid references public.users (id) on delete set null,
  archived_at timestamptz,
  archived_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenant_public_companion_faq_items_status_check check (
    status in ('draft', 'published', 'archived')
  ),
  constraint tenant_public_companion_faq_items_content_type_check check (
    content_type in (
      'faq',
      'opening_hours',
      'holiday_notice',
      'contact',
      'policy',
      'product_info',
      'service_info',
      'link'
    )
  ),
  constraint tenant_public_companion_faq_items_surface_check check (
    surface = 'website_kompis'
  ),
  constraint tenant_public_companion_faq_items_locale_not_empty check (
    char_length(trim(locale)) > 0
  ),
  constraint tenant_public_companion_faq_items_title_not_empty check (
    char_length(trim(title)) > 0
  ),
  constraint tenant_public_companion_faq_items_answer_not_empty check (
    char_length(trim(answer)) > 0
  ),
  constraint tenant_public_companion_faq_items_valid_range check (
    valid_until is null
    or valid_from is null
    or valid_until >= valid_from
  ),
  constraint tenant_public_companion_faq_items_published_invariant check (
    status <> 'published'
    or (public_safe = true and published_at is not null)
  ),
  constraint tenant_public_companion_faq_items_archived_invariant check (
    status <> 'archived'
    or archived_at is not null
  )
);

comment on table public.tenant_public_companion_faq_items is
  'APP-owned public-safe knowledge for Website Kompis — not internal KCE/EKE or APP Companion runtime.';

create index if not exists wpkf_items_tenant_status_surface_idx
  on public.tenant_public_companion_faq_items (tenant_id, status, public_safe, surface);

create index if not exists wpkf_items_tenant_locale_status_idx
  on public.tenant_public_companion_faq_items (tenant_id, locale, status);

create index if not exists wpkf_items_tenant_domain_status_idx
  on public.tenant_public_companion_faq_items (tenant_id, domain, status);

create index if not exists wpkf_items_tenant_surface_locale_status_idx
  on public.tenant_public_companion_faq_items (tenant_id, status, surface, locale);

create index if not exists wpkf_items_tenant_content_type_status_idx
  on public.tenant_public_companion_faq_items (tenant_id, content_type, status);

create index if not exists wpkf_items_install_status_idx
  on public.tenant_public_companion_faq_items (install_id, status)
  where install_id is not null;

create index if not exists wpkf_items_validity_idx
  on public.tenant_public_companion_faq_items (tenant_id, valid_from, valid_until);

create index if not exists wpkf_items_tags_gin_idx
  on public.tenant_public_companion_faq_items using gin (tags);

alter table public.tenant_public_companion_faq_items enable row level security;

revoke all on public.tenant_public_companion_faq_items from anon;
revoke all on public.tenant_public_companion_faq_items from authenticated;

grant select, insert, update on public.tenant_public_companion_faq_items to authenticated;

create policy wpkf_items_select_owner_admin
  on public.tenant_public_companion_faq_items
  for select
  to authenticated
  using (
    tenant_id = public._wpkf_auth_tenant_id()
    and public._wpkf_auth_is_owner_admin()
  );

create policy wpkf_items_insert_owner_admin
  on public.tenant_public_companion_faq_items
  for insert
  to authenticated
  with check (
    tenant_id = public._wpkf_auth_tenant_id()
    and public._wpkf_auth_is_owner_admin()
  );

create policy wpkf_items_update_owner_admin
  on public.tenant_public_companion_faq_items
  for update
  to authenticated
  using (
    tenant_id = public._wpkf_auth_tenant_id()
    and public._wpkf_auth_is_owner_admin()
  )
  with check (
    tenant_id = public._wpkf_auth_tenant_id()
    and public._wpkf_auth_is_owner_admin()
  );

-- ---------------------------------------------------------------------------
-- 2. tenant_public_companion_faq_audit_events
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_public_companion_faq_audit_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  item_id uuid references public.tenant_public_companion_faq_items (id) on delete set null,
  action text not null,
  old_status text,
  new_status text,
  actor_user_id uuid references public.users (id) on delete set null,
  locale text,
  install_id uuid references public.installations (id) on delete set null,
  domain text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint tenant_public_companion_faq_audit_events_action_check check (
    action in ('created', 'updated', 'published', 'unpublished', 'archived', 'restored')
  ),
  constraint tenant_public_companion_faq_audit_events_old_status_check check (
    old_status is null
    or old_status in ('draft', 'published', 'archived')
  ),
  constraint tenant_public_companion_faq_audit_events_new_status_check check (
    new_status is null
    or new_status in ('draft', 'published', 'archived')
  )
);

comment on table public.tenant_public_companion_faq_audit_events is
  'Publish/unpublish/archive audit trail for Website Kompis public FAQ — owner/admin read only.';

create index if not exists wpkf_audit_tenant_created_idx
  on public.tenant_public_companion_faq_audit_events (tenant_id, created_at desc);

create index if not exists wpkf_audit_item_created_idx
  on public.tenant_public_companion_faq_audit_events (item_id, created_at desc)
  where item_id is not null;

alter table public.tenant_public_companion_faq_audit_events enable row level security;

revoke all on public.tenant_public_companion_faq_audit_events from anon;
revoke all on public.tenant_public_companion_faq_audit_events from authenticated;

grant select, insert on public.tenant_public_companion_faq_audit_events to authenticated;

create policy wpkf_audit_select_owner_admin
  on public.tenant_public_companion_faq_audit_events
  for select
  to authenticated
  using (
    tenant_id = public._wpkf_auth_tenant_id()
    and public._wpkf_auth_is_owner_admin()
  );

create policy wpkf_audit_insert_owner_admin
  on public.tenant_public_companion_faq_audit_events
  for insert
  to authenticated
  with check (
    tenant_id = public._wpkf_auth_tenant_id()
    and public._wpkf_auth_is_owner_admin()
  );
