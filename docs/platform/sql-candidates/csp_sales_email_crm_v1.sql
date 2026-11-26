-- =============================================================================
-- PREPARED_ONLY — Aipify Sales Partner email + CRM canonical contract V2
-- DO NOT APPLY to Staging or Production from this change.
-- Staging needs a separate owner approval. Production needs a second approval
-- after Staging is verified. Applying this file does not send email.
--
-- Replaces the unapplied V1 draft (three tables, no RPCs, no thread).
-- Those table names are retired and are not created here:
--   csp_marketing_email_sends
--   csp_marketing_email_inbound_events
--   csp_email_crm_leads
--
-- Hash method for every future check:
--   shasum -a 256 docs/platform/sql-candidates/csp_sales_email_crm_v1.sql
-- Hash the exact file bytes. Do not paste the digest into this file.
-- The digest lives only in the sibling csp_sales_email_crm_v1.sql.sha256.
--
-- Dependencies that must already exist (this file does not create or alter them):
--   public.csp_partner_profiles(id)
--   public.csp_sales_products(product_key)
--   public.csp_product_certifications(partner_id, product_id, status)
--   public.is_platform_admin()
--   auth.uid()
-- This file never inserts into csp_qualified_sales or csp_commission_ledger.
-- A reply is a lead. It is not a sale and it is not earned commission.
-- Retention helper exists for a later owner task. Nothing in this file calls it.
-- =============================================================================

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin;
  end if;
end
$$;

create table if not exists public.csp_sales_email_sends (
  id uuid primary key,
  tenant_id text not null default 'aipify_internal' check (tenant_id = 'aipify_internal'),
  partner_id uuid not null references public.csp_partner_profiles (id) on delete restrict,
  product_key text not null references public.csp_sales_products (product_key) on delete restrict,
  template_id text not null check (length(btrim(template_id)) > 0),
  template_version integer not null check (template_version > 0),
  locale text not null check (locale in ('en', 'no', 'sv', 'da', 'pl', 'uk', 'es')),
  recipient_email text not null check (recipient_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  referral_url text not null check (
    referral_url ~ '^https://aipify\.ai/p/csp-[a-z0-9]{12}/(kompis_web|kompis_bedrift)\?channel=email&lang=(en|no|sv|da|pl|uk|es)$'
  ),
  idempotency_key text not null check (length(idempotency_key) between 8 and 120),
  token_hash text not null check (token_hash ~ '^[0-9a-f]{64}$'),
  token_expires_at timestamptz not null,
  delivery_status text not null default 'queued'
    check (delivery_status in ('draft', 'queued', 'accepted_by_provider', 'delivered', 'bounced', 'failed')),
  provider_message_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_id, idempotency_key),
  unique (token_hash)
);

create index if not exists csp_sales_email_sends_partner_created_idx
  on public.csp_sales_email_sends (partner_id, created_at desc);

create unique index if not exists csp_sales_email_sends_provider_message_idx
  on public.csp_sales_email_sends (provider_message_id)
  where provider_message_id is not null;

create table if not exists public.csp_sales_email_provider_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text not null unique,
  send_id uuid references public.csp_sales_email_sends (id) on delete restrict,
  partner_id uuid references public.csp_partner_profiles (id) on delete restrict,
  tenant_id text not null default 'aipify_internal' check (tenant_id = 'aipify_internal'),
  event_class text not null check (
    event_class in ('human', 'auto_reply', 'bounce', 'spam', 'out_of_office', 'loop', 'delivered')
  ),
  disposition text not null check (
    disposition in ('create_or_attach_lead', 'transport_event_only', 'quarantine_manual_review', 'ignore_duplicate')
  ),
  quarantine_reason text,
  created_at timestamptz not null default now()
);

create index if not exists csp_sales_email_provider_events_send_idx
  on public.csp_sales_email_provider_events (send_id, created_at desc);

create table if not exists public.csp_sales_email_leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'aipify_internal' check (tenant_id = 'aipify_internal'),
  partner_id uuid not null references public.csp_partner_profiles (id) on delete restrict,
  product_key text not null references public.csp_sales_products (product_key) on delete restrict,
  recipient_email text not null,
  send_id uuid not null references public.csp_sales_email_sends (id) on delete restrict,
  status text not null default 'new_inquiry' check (
    status in (
      'new_inquiry', 'contacted', 'interested', 'meeting_scheduled',
      'offer_sent', 'converted', 'closed'
    )
  ),
  last_inbound_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, partner_id, product_key, recipient_email)
);

create index if not exists csp_sales_email_leads_partner_idx
  on public.csp_sales_email_leads (partner_id, updated_at desc);

create table if not exists public.csp_sales_email_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.csp_sales_email_leads (id) on delete restrict,
  send_id uuid references public.csp_sales_email_sends (id) on delete restrict,
  direction text not null check (direction in ('inbound', 'outbound')),
  body_text text not null check (length(body_text) between 1 and 8000),
  created_at timestamptz not null default now()
);

create index if not exists csp_sales_email_messages_lead_idx
  on public.csp_sales_email_messages (lead_id, created_at);

create table if not exists public.csp_sales_email_notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'aipify_internal' check (tenant_id = 'aipify_internal'),
  partner_id uuid not null references public.csp_partner_profiles (id) on delete restrict,
  lead_id uuid not null references public.csp_sales_email_leads (id) on delete restrict,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists csp_sales_email_notifications_one_unread_idx
  on public.csp_sales_email_notifications (lead_id)
  where read_at is null;

create index if not exists csp_sales_email_notifications_unread_idx
  on public.csp_sales_email_notifications (partner_id, created_at desc)
  where read_at is null;

create table if not exists public.csp_sales_email_suppressions (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'aipify_internal' check (tenant_id = 'aipify_internal'),
  email text not null,
  reason text not null check (reason in ('bounce', 'spam', 'owner')),
  created_at timestamptz not null default now(),
  unique (tenant_id, email)
);

create table if not exists public.csp_sales_email_audit (
  id uuid primary key default gen_random_uuid(),
  actor_auth_user_id uuid,
  actor_kind text not null check (actor_kind in ('partner', 'platform_admin', 'system')),
  action text not null,
  subject_table text,
  subject_id uuid,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists csp_sales_email_audit_created_idx
  on public.csp_sales_email_audit (created_at desc);

alter table public.csp_sales_email_sends enable row level security;
alter table public.csp_sales_email_provider_events enable row level security;
alter table public.csp_sales_email_leads enable row level security;
alter table public.csp_sales_email_messages enable row level security;
alter table public.csp_sales_email_notifications enable row level security;
alter table public.csp_sales_email_suppressions enable row level security;
alter table public.csp_sales_email_audit enable row level security;

revoke all on public.csp_sales_email_sends from public, anon, authenticated;
revoke all on public.csp_sales_email_provider_events from public, anon, authenticated;
revoke all on public.csp_sales_email_leads from public, anon, authenticated;
revoke all on public.csp_sales_email_messages from public, anon, authenticated;
revoke all on public.csp_sales_email_notifications from public, anon, authenticated;
revoke all on public.csp_sales_email_suppressions from public, anon, authenticated;
revoke all on public.csp_sales_email_audit from public, anon, authenticated;

create or replace function public._csp_sales_email_audit(
  p_kind text,
  p_action text,
  p_table text,
  p_subject uuid,
  p_detail jsonb
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.csp_sales_email_audit (
    actor_auth_user_id, actor_kind, action, subject_table, subject_id, detail
  ) values (
    auth.uid(), p_kind, p_action, p_table, p_subject, coalesce(p_detail, '{}'::jsonb)
  );
end;
$$;

create or replace function public._csp_sales_email_actor()
returns public.csp_partner_profiles
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.csp_partner_profiles%rowtype;
begin
  if v_uid is null then
    return null;
  end if;
  select * into v_row from public.csp_partner_profiles where auth_user_id = v_uid;
  return v_row;
end;
$$;

create or replace function public.csp_sales_email_backend_status()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'ready', true,
    'tenant_id', 'aipify_internal',
    'retention_days', 180,
    'creates_sale', false,
    'creates_commission', false
  );
$$;

create or replace function public.csp_sales_email_record_send(p_input jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_partner public.csp_partner_profiles%rowtype;
  v_send_id uuid;
  v_product text;
  v_template text;
  v_version integer;
  v_locale text;
  v_recipient text;
  v_key text;
  v_url text;
  v_hash text;
  v_exp timestamptz;
  v_existing public.csp_sales_email_sends%rowtype;
  v_recent integer;
begin
  -- Client partner ids are not a parameter and are ignored if present in JSON.
  v_partner := public._csp_sales_email_actor();
  if v_partner.id is null then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'partner_not_found');
  end if;
  if v_partner.status not in ('approved', 'active', 'certified', 'in_academy') then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'suspended_partner');
  end if;

  begin
    v_send_id := nullif(p_input->>'send_id', '')::uuid;
    v_exp := nullif(p_input->>'token_expires_at', '')::timestamptz;
  exception when others then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'invalid_payload');
  end;

  v_product := lower(btrim(coalesce(p_input->>'product_key', '')));
  v_template := btrim(coalesce(p_input->>'template_id', ''));
  v_version := nullif(p_input->>'template_version', '')::integer;
  v_locale := lower(btrim(coalesce(p_input->>'locale', '')));
  v_recipient := lower(btrim(coalesce(p_input->>'recipient', '')));
  v_key := btrim(coalesce(p_input->>'idempotency_key', ''));
  v_url := btrim(coalesce(p_input->>'referral_url', ''));
  v_hash := lower(btrim(coalesce(p_input->>'token_hash', '')));

  if v_send_id is null or v_template = '' or v_version is null or v_exp is null
     or v_recipient !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
     or v_hash !~ '^[0-9a-f]{64}$'
     or length(v_key) < 8 or length(v_key) > 120 then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'invalid_payload');
  end if;
  if v_exp <= now() then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'expired_token');
  end if;

  if exists (
    select 1 from public.csp_sales_email_suppressions s
    where s.tenant_id = 'aipify_internal' and s.email = v_recipient
  ) then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'suppressed');
  end if;

  if not exists (
    select 1
    from public.csp_product_certifications c
    join public.csp_sales_products p on p.id = c.product_id
    where c.partner_id = v_partner.id
      and p.product_key = v_product
      and c.status = 'passed'
  ) then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'certification_required');
  end if;

  select * into v_existing
  from public.csp_sales_email_sends
  where partner_id = v_partner.id and idempotency_key = v_key;
  if found then
    return jsonb_build_object(
      'ready', true,
      'ok', true,
      'duplicate', true,
      'send_id', v_existing.id,
      'delivery_status', v_existing.delivery_status
    );
  end if;

  select count(*) into v_recent
  from public.csp_sales_email_sends
  where partner_id = v_partner.id
    and created_at > now() - interval '1 hour'
    and delivery_status in ('queued', 'accepted_by_provider', 'delivered');
  if v_recent >= 3 then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'rate_limited');
  end if;

  insert into public.csp_sales_email_sends (
    id, tenant_id, partner_id, product_key, template_id, template_version, locale,
    recipient_email, referral_url, idempotency_key, token_hash, token_expires_at, delivery_status
  ) values (
    v_send_id, 'aipify_internal', v_partner.id, v_product, v_template, v_version, v_locale,
    v_recipient, v_url, v_key, v_hash, v_exp, 'queued'
  );

  perform public._csp_sales_email_audit(
    'partner', 'record_send', 'csp_sales_email_sends', v_send_id,
    jsonb_build_object('product_key', v_product, 'recipient_domain', split_part(v_recipient, '@', 2))
  );

  return jsonb_build_object(
    'ready', true,
    'ok', true,
    'duplicate', false,
    'send_id', v_send_id,
    'delivery_status', 'queued',
    'creates_sale', false,
    'creates_commission', false
  );
exception
  when unique_violation then
    select * into v_existing
    from public.csp_sales_email_sends
    where partner_id = v_partner.id and idempotency_key = v_key;
    if found then
      return jsonb_build_object(
        'ready', true, 'ok', true, 'duplicate', true,
        'send_id', v_existing.id, 'delivery_status', v_existing.delivery_status
      );
    end if;
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'invalid_payload');
  when foreign_key_violation then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'product_unknown');
end;
$$;

create or replace function public.csp_sales_email_mark_send_result(p_input jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_partner public.csp_partner_profiles%rowtype;
  v_send_id uuid;
  v_status text;
  v_provider text;
begin
  v_partner := public._csp_sales_email_actor();
  if v_partner.id is null then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'partner_not_found');
  end if;
  begin
    v_send_id := nullif(p_input->>'send_id', '')::uuid;
  exception when others then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'invalid_payload');
  end;
  v_status := btrim(coalesce(p_input->>'delivery_status', ''));
  v_provider := nullif(btrim(coalesce(p_input->>'provider_message_id', '')), '');
  if v_send_id is null or v_status not in ('accepted_by_provider', 'failed') then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'invalid_payload');
  end if;

  update public.csp_sales_email_sends
  set delivery_status = v_status,
      provider_message_id = coalesce(v_provider, provider_message_id),
      updated_at = now()
  where id = v_send_id
    and partner_id = v_partner.id
    and delivery_status = 'queued';

  if not found then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'forbidden');
  end if;

  perform public._csp_sales_email_audit(
    'partner', 'mark_send_result', 'csp_sales_email_sends', v_send_id,
    jsonb_build_object('delivery_status', v_status)
  );
  return jsonb_build_object('ready', true, 'ok', true, 'delivery_status', v_status, 'creates_commission', false);
end;
$$;

create or replace function public.csp_sales_email_ingest_reply(p_event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_id text := nullif(btrim(coalesce(p_event->>'provider_event_id', '')), '');
  v_class text := nullif(btrim(coalesce(p_event->>'event_class', '')), '');
  v_send_id uuid;
  v_claim uuid;
  v_exp timestamptz;
  v_hash text := nullif(lower(btrim(coalesce(p_event->>'token_hash', ''))), '');
  v_sender text := lower(btrim(coalesce(p_event->>'sender_email', '')));
  v_body text := left(btrim(coalesce(p_event->>'body_text', '')), 8000);
  v_tenant text := btrim(coalesce(p_event->>'tenant_id', ''));
  v_provider text := nullif(btrim(coalesce(p_event->>'provider_message_id', '')), '');
  v_send public.csp_sales_email_sends%rowtype;
  v_partner_status text;
  v_lead_id uuid;
  v_inserted boolean := false;
  v_reason text;
begin
  if v_event_id is null or v_class is null
     or v_class not in ('human', 'auto_reply', 'bounce', 'spam', 'out_of_office', 'loop', 'delivered') then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'invalid_payload');
  end if;

  if exists (
    select 1 from public.csp_sales_email_provider_events where provider_event_id = v_event_id
  ) then
    return jsonb_build_object('ready', true, 'ok', true, 'outcome', 'duplicate', 'lead_id', null, 'creates_commission', false);
  end if;

  begin
    v_send_id := nullif(p_event->>'send_id', '')::uuid;
    v_claim := nullif(p_event->>'partner_id_claim', '')::uuid;
    v_exp := nullif(p_event->>'token_expires_at', '')::timestamptz;
  exception when others then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'invalid_payload');
  end;

  if v_send_id is not null then
    select * into v_send from public.csp_sales_email_sends where id = v_send_id;
  elsif v_provider is not null then
    select * into v_send from public.csp_sales_email_sends where provider_message_id = v_provider;
  end if;

  if v_send.id is null then
    insert into public.csp_sales_email_provider_events (
      provider_event_id, tenant_id, event_class, disposition, quarantine_reason
    ) values (
      v_event_id, 'aipify_internal', v_class, 'quarantine_manual_review', 'unknown_send'
    );
    return jsonb_build_object('ready', true, 'ok', true, 'outcome', 'quarantine', 'reason', 'unknown_send', 'lead_id', null, 'creates_commission', false);
  end if;

  if v_class = 'human' then
    v_reason := null;
    if v_hash is null or v_hash is distinct from v_send.token_hash then
      v_reason := 'invalid_token';
    elsif v_exp is null or v_exp < now() then
      v_reason := 'expired_token';
    elsif v_tenant is distinct from 'aipify_internal' or v_send.tenant_id is distinct from 'aipify_internal' then
      v_reason := 'wrong_tenant';
    elsif v_claim is null or v_claim is distinct from v_send.partner_id then
      v_reason := 'spoofed_partner';
    else
      select status into v_partner_status from public.csp_partner_profiles where id = v_send.partner_id;
      if v_partner_status is null or v_partner_status not in ('approved', 'active', 'certified', 'in_academy') then
        v_reason := 'suspended_partner';
      elsif v_sender is distinct from v_send.recipient_email then
        v_reason := 'sender_mismatch';
      elsif length(v_body) < 1 then
        v_reason := 'invalid_payload';
      end if;
    end if;

    if v_reason is not null then
      insert into public.csp_sales_email_provider_events (
        provider_event_id, send_id, partner_id, tenant_id, event_class, disposition, quarantine_reason
      ) values (
        v_event_id, v_send.id, v_send.partner_id, 'aipify_internal', v_class, 'quarantine_manual_review', v_reason
      );
      perform public._csp_sales_email_audit(
        'system', 'quarantine_reply', 'csp_sales_email_provider_events', v_send.id,
        jsonb_build_object('reason', v_reason)
      );
      return jsonb_build_object('ready', true, 'ok', true, 'outcome', 'quarantine', 'reason', v_reason, 'lead_id', null, 'creates_commission', false);
    end if;

    select id into v_lead_id
    from public.csp_sales_email_leads
    where tenant_id = 'aipify_internal'
      and partner_id = v_send.partner_id
      and product_key = v_send.product_key
      and recipient_email = v_send.recipient_email;

    if v_lead_id is null then
      insert into public.csp_sales_email_leads (
        tenant_id, partner_id, product_key, recipient_email, send_id, status, last_inbound_at
      ) values (
        'aipify_internal', v_send.partner_id, v_send.product_key, v_send.recipient_email, v_send.id, 'new_inquiry', now()
      )
      returning id into v_lead_id;
      v_inserted := true;
    else
      update public.csp_sales_email_leads
      set updated_at = now(), last_inbound_at = now()
      where id = v_lead_id;
      v_inserted := false;
    end if;

    insert into public.csp_sales_email_messages (lead_id, send_id, direction, body_text)
    values (v_lead_id, v_send.id, 'inbound', v_body);

    insert into public.csp_sales_email_notifications (tenant_id, partner_id, lead_id)
    values ('aipify_internal', v_send.partner_id, v_lead_id)
    on conflict (lead_id) where read_at is null do nothing;

    insert into public.csp_sales_email_provider_events (
      provider_event_id, send_id, partner_id, tenant_id, event_class, disposition
    ) values (
      v_event_id, v_send.id, v_send.partner_id, 'aipify_internal', 'human', 'create_or_attach_lead'
    );

    perform public._csp_sales_email_audit(
      'system', 'ingest_human_reply', 'csp_sales_email_leads', v_lead_id,
      jsonb_build_object('product_key', v_send.product_key, 'inserted', v_inserted)
    );

    return jsonb_build_object(
      'ready', true,
      'ok', true,
      'outcome', case when v_inserted then 'lead_created' else 'lead_updated' end,
      'lead_id', v_lead_id,
      'partner_id', v_send.partner_id,
      'creates_sale', false,
      'creates_commission', false
    );
  end if;

  insert into public.csp_sales_email_provider_events (
    provider_event_id, send_id, partner_id, tenant_id, event_class, disposition
  ) values (
    v_event_id, v_send.id, v_send.partner_id, 'aipify_internal', v_class, 'transport_event_only'
  );

  if v_class in ('bounce', 'spam') then
    insert into public.csp_sales_email_suppressions (tenant_id, email, reason)
    values ('aipify_internal', v_send.recipient_email, v_class)
    on conflict (tenant_id, email) do nothing;
  end if;

  if v_class = 'bounce' then
    update public.csp_sales_email_sends
    set delivery_status = 'bounced', updated_at = now()
    where id = v_send.id and delivery_status in ('queued', 'accepted_by_provider', 'delivered');
  elsif v_class = 'delivered' then
    update public.csp_sales_email_sends
    set delivery_status = 'delivered', updated_at = now()
    where id = v_send.id and delivery_status = 'accepted_by_provider';
  end if;

  perform public._csp_sales_email_audit(
    'system', 'ingest_transport', 'csp_sales_email_sends', v_send.id,
    jsonb_build_object('event_class', v_class)
  );

  return jsonb_build_object(
    'ready', true, 'ok', true, 'outcome', 'transport_event', 'lead_id', null,
    'creates_sale', false, 'creates_commission', false
  );
exception
  when unique_violation then
    return jsonb_build_object('ready', true, 'ok', true, 'outcome', 'duplicate', 'lead_id', null, 'creates_commission', false);
end;
$$;

create or replace function public.csp_sales_email_list_unread()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_partner public.csp_partner_profiles%rowtype;
begin
  v_partner := public._csp_sales_email_actor();
  if v_partner.id is null then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'partner_not_found', 'unread', '[]'::jsonb);
  end if;
  return jsonb_build_object(
    'ready', true,
    'ok', true,
    'unread', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', n.id,
        'lead_id', n.lead_id,
        'product_key', l.product_key,
        'created_at', n.created_at
      ) order by n.created_at desc)
      from public.csp_sales_email_notifications n
      join public.csp_sales_email_leads l on l.id = n.lead_id
      where n.partner_id = v_partner.id and n.read_at is null
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.csp_sales_email_mark_notification_read(p_notification_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_partner public.csp_partner_profiles%rowtype;
  v_owner uuid;
begin
  v_partner := public._csp_sales_email_actor();
  if v_partner.id is null then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'partner_not_found');
  end if;
  select partner_id into v_owner
  from public.csp_sales_email_notifications
  where id = p_notification_id;
  if v_owner is null then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'not_found');
  end if;
  if v_owner is distinct from v_partner.id then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'forbidden');
  end if;
  update public.csp_sales_email_notifications
  set read_at = coalesce(read_at, now())
  where id = p_notification_id and partner_id = v_partner.id;
  return jsonb_build_object('ready', true, 'ok', true);
end;
$$;

create or replace function public.csp_sales_email_list_leads()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_partner public.csp_partner_profiles%rowtype;
begin
  v_partner := public._csp_sales_email_actor();
  if v_partner.id is null then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'partner_not_found', 'leads', '[]'::jsonb);
  end if;
  return jsonb_build_object(
    'ready', true,
    'ok', true,
    'leads', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id,
        'product_key', l.product_key,
        'recipient_email', l.recipient_email,
        'status', l.status,
        'updated_at', l.updated_at
      ) order by l.updated_at desc)
      from public.csp_sales_email_leads l
      where l.partner_id = v_partner.id and l.tenant_id = 'aipify_internal'
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.csp_sales_email_list_thread(p_lead_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_partner public.csp_partner_profiles%rowtype;
  v_lead public.csp_sales_email_leads%rowtype;
begin
  v_partner := public._csp_sales_email_actor();
  if v_partner.id is null then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'partner_not_found');
  end if;
  select * into v_lead from public.csp_sales_email_leads where id = p_lead_id;
  if v_lead.id is null then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'not_found');
  end if;
  if v_lead.partner_id is distinct from v_partner.id or v_lead.tenant_id is distinct from 'aipify_internal' then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'forbidden');
  end if;
  return jsonb_build_object(
    'ready', true,
    'ok', true,
    'lead', jsonb_build_object(
      'id', v_lead.id,
      'product_key', v_lead.product_key,
      'recipient_email', v_lead.recipient_email,
      'status', v_lead.status
    ),
    'messages', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id,
        'direction', m.direction,
        'body_text', m.body_text,
        'created_at', m.created_at
      ) order by m.created_at)
      from public.csp_sales_email_messages m
      where m.lead_id = v_lead.id
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.csp_sales_email_admin_list()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'forbidden');
  end if;
  return jsonb_build_object(
    'ready', true,
    'ok', true,
    'events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id,
        'provider_event_id', e.provider_event_id,
        'partner_id', e.partner_id,
        'send_id', e.send_id,
        'event_class', e.event_class,
        'disposition', e.disposition,
        'quarantine_reason', e.quarantine_reason,
        'created_at', e.created_at
      ) order by e.created_at desc)
      from (
        select * from public.csp_sales_email_provider_events
        order by created_at desc
        limit 50
      ) e
    ), '[]'::jsonb)
  );
end;
$$;

-- Not scheduled. Rollout must not call this. Historical rows stay until a later owner task.
create or replace function public.csp_sales_email_purge_expired(p_older_than interval default interval '180 days')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cut timestamptz := now() - p_older_than;
  v_messages integer := 0;
begin
  if auth.uid() is not null and not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'forbidden');
  end if;
  delete from public.csp_sales_email_messages m
  using public.csp_sales_email_leads l
  where m.lead_id = l.id and m.created_at < v_cut;
  get diagnostics v_messages = row_count;
  return jsonb_build_object('ready', true, 'ok', true, 'messages_removed', v_messages);
end;
$$;

revoke all on function public._csp_sales_email_audit(text, text, text, uuid, jsonb) from public, anon, authenticated, service_role;
revoke all on function public._csp_sales_email_actor() from public, anon, authenticated, service_role;
revoke all on function public.csp_sales_email_backend_status() from public, anon, authenticated, service_role;
revoke all on function public.csp_sales_email_record_send(jsonb) from public, anon, authenticated, service_role;
revoke all on function public.csp_sales_email_mark_send_result(jsonb) from public, anon, authenticated, service_role;
revoke all on function public.csp_sales_email_ingest_reply(jsonb) from public, anon, authenticated, service_role;
revoke all on function public.csp_sales_email_list_unread() from public, anon, authenticated, service_role;
revoke all on function public.csp_sales_email_mark_notification_read(uuid) from public, anon, authenticated, service_role;
revoke all on function public.csp_sales_email_list_leads() from public, anon, authenticated, service_role;
revoke all on function public.csp_sales_email_list_thread(uuid) from public, anon, authenticated, service_role;
revoke all on function public.csp_sales_email_admin_list() from public, anon, authenticated, service_role;
revoke all on function public.csp_sales_email_purge_expired(interval) from public, anon, authenticated, service_role;

grant execute on function public.csp_sales_email_backend_status() to authenticated, service_role;
grant execute on function public.csp_sales_email_record_send(jsonb) to authenticated;
grant execute on function public.csp_sales_email_mark_send_result(jsonb) to authenticated;
grant execute on function public.csp_sales_email_ingest_reply(jsonb) to service_role;
grant execute on function public.csp_sales_email_list_unread() to authenticated;
grant execute on function public.csp_sales_email_mark_notification_read(uuid) to authenticated;
grant execute on function public.csp_sales_email_list_leads() to authenticated;
grant execute on function public.csp_sales_email_list_thread(uuid) to authenticated;
grant execute on function public.csp_sales_email_admin_list() to authenticated;
grant execute on function public.csp_sales_email_purge_expired(interval) to service_role;
