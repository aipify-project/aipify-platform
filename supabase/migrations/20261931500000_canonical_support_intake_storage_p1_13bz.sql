-- P1.13BZ — Canonical support intake storage (inbound messages + tenant-scoped idempotency)

-- Tenant-safe composite FK requires (id, organization_id) on parent cases first.
alter table public.organization_support_cases
  drop constraint if exists organization_support_cases_id_org_key;

alter table public.organization_support_cases
  add constraint organization_support_cases_id_org_key unique (id, organization_id);

-- ---------------------------------------------------------------------------
-- 1. organization_support_case_messages
-- ---------------------------------------------------------------------------
create table if not exists public.organization_support_case_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_id uuid not null,
  direction text not null check (
    direction in ('inbound', 'outbound', 'internal')
  ),
  author_kind text not null check (
    author_kind in ('customer', 'user', 'system', 'ai')
  ),
  body text not null check (char_length(body) between 1 and 8000),
  created_at timestamptz not null default now(),
  constraint organization_support_case_messages_case_org_fkey
    foreign key (case_id, organization_id)
    references public.organization_support_cases (id, organization_id)
    on delete cascade
);

create index if not exists organization_support_case_messages_org_case_created_idx
  on public.organization_support_case_messages (organization_id, case_id, created_at);

alter table public.organization_support_case_messages enable row level security;
revoke all on public.organization_support_case_messages from public, authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Idempotency columns on organization_support_cases
-- ---------------------------------------------------------------------------
alter table public.organization_support_cases
  add column if not exists intake_idempotency_key text,
  add column if not exists intake_payload_hash text;

alter table public.organization_support_cases
  drop constraint if exists organization_support_cases_intake_key_trim;

alter table public.organization_support_cases
  add constraint organization_support_cases_intake_key_trim check (
    intake_idempotency_key is null
    or intake_idempotency_key = btrim(intake_idempotency_key)
  );

alter table public.organization_support_cases
  drop constraint if exists organization_support_cases_intake_key_len;

alter table public.organization_support_cases
  add constraint organization_support_cases_intake_key_len check (
    intake_idempotency_key is null
    or char_length(intake_idempotency_key) between 1 and 128
  );

alter table public.organization_support_cases
  drop constraint if exists organization_support_cases_intake_hash_required;

alter table public.organization_support_cases
  add constraint organization_support_cases_intake_hash_required check (
    (intake_idempotency_key is null and intake_payload_hash is null)
    or (intake_idempotency_key is not null and intake_payload_hash is not null)
  );

create unique index if not exists organization_support_cases_intake_idempotency_idx
  on public.organization_support_cases (organization_id, intake_idempotency_key)
  where intake_idempotency_key is not null;

-- ---------------------------------------------------------------------------
-- 3. Intake helpers
-- ---------------------------------------------------------------------------
create or replace function public._sai_intake_lock_key(
  p_organization_id uuid,
  p_idempotency_key text
)
returns bigint
language sql
immutable
set search_path = public
as $$
  select hashtextextended(
    'support_intake_idem:' || coalesce(p_organization_id::text, '') || ':' || coalesce(p_idempotency_key, ''),
    0
  );
$$;

create or replace function public._sai_intake_payload_hash(
  p_subject text,
  p_initial_message text,
  p_customer_identifier text,
  p_channel text,
  p_priority text
)
returns text
language sql
immutable
set search_path = public
as $$
  select encode(
    extensions.digest(
      convert_to(
        jsonb_build_object(
          'subject', coalesce(p_subject, ''),
          'initial_message', coalesce(p_initial_message, ''),
          'customer_identifier', coalesce(p_customer_identifier, ''),
          'channel', coalesce(p_channel, 'admin_inbox'),
          'priority', coalesce(p_priority, 'medium')
        )::text,
        'UTF8'
      ),
      'sha256'
    ),
    'hex'
  );
$$;

revoke all on function public._sai_intake_lock_key(uuid, text) from public, anon, authenticated, service_role;
revoke all on function public._sai_intake_payload_hash(text, text, text, text, text) from public, anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 4. Replace create_organization_support_case (drop 4-arg, create single 6-arg)
-- ---------------------------------------------------------------------------
do $$
declare
  v_count int;
begin
  select count(*) into v_count
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'create_organization_support_case'
    and p.prokind = 'f';

  if v_count > 1 then
    raise exception 'create_organization_support_case overload conflict detected: %', v_count;
  end if;
end $$;

drop function if exists public.create_organization_support_case(text, text, text, text);

create or replace function public.create_organization_support_case(
  p_subject text,
  p_customer_identifier text default null,
  p_channel text default 'admin_inbox',
  p_priority text default 'medium',
  p_initial_message text default null,
  p_idempotency_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_subject text;
  v_message text;
  v_customer text;
  v_channel text;
  v_priority text;
  v_key text;
  v_hash text;
  v_existing public.organization_support_cases;
  v_id uuid;
  v_num text;
  v_message_id uuid;
begin
  perform public._irp_require_permission('support.view');
  v_org_id := public._mta_require_organization();

  v_subject := btrim(coalesce(p_subject, ''));
  if v_subject = '' or char_length(v_subject) > 500 then
    raise exception 'invalid_subject';
  end if;

  v_message := nullif(btrim(coalesce(p_initial_message, '')), '');
  if v_message is not null and char_length(v_message) > 8000 then
    raise exception 'invalid_message';
  end if;

  v_customer := nullif(btrim(coalesce(p_customer_identifier, '')), '');
  v_channel := coalesce(nullif(btrim(coalesce(p_channel, '')), ''), 'admin_inbox');
  v_priority := coalesce(nullif(btrim(coalesce(p_priority, '')), ''), 'medium');
  v_key := nullif(btrim(coalesce(p_idempotency_key, '')), '');

  if v_key is not null then
    if char_length(v_key) > 128 then
      raise exception 'invalid_idempotency_key';
    end if;
    if v_message is null then
      raise exception 'idempotency_requires_message';
    end if;
  end if;

  if v_channel not in (
    'support_widget', 'admin_inbox', 'email_support', 'live_chat', 'social_media', 'messaging'
  ) then
    raise exception 'invalid_channel';
  end if;

  if v_priority not in ('low', 'medium', 'high', 'urgent') then
    raise exception 'invalid_priority';
  end if;

  v_hash := case
    when v_key is not null then public._sai_intake_payload_hash(
      v_subject, v_message, v_customer, v_channel, v_priority
    )
    else null
  end;

  if v_key is not null then
    perform pg_advisory_xact_lock(public._sai_intake_lock_key(v_org_id, v_key));

    select * into v_existing
    from public.organization_support_cases c
    where c.organization_id = v_org_id
      and c.intake_idempotency_key = v_key;

    if found then
      if v_existing.intake_payload_hash is distinct from v_hash then
        raise exception 'support_intake_idempotency_conflict';
      end if;

      select m.id into v_message_id
      from public.organization_support_case_messages m
      where m.organization_id = v_org_id
        and m.case_id = v_existing.id
        and m.direction = 'inbound'
        and m.author_kind = 'customer'
      order by m.created_at asc
      limit 1;

      return jsonb_build_object(
        'id', v_existing.id,
        'case_number', v_existing.case_number,
        'status', v_existing.status,
        'created', false,
        'message_id', v_message_id
      );
    end if;
  end if;

  v_num := public._sai_next_case_number(v_org_id);

  begin
    insert into public.organization_support_cases (
      organization_id,
      case_number,
      subject,
      customer_identifier,
      channel,
      status,
      priority,
      intake_idempotency_key,
      intake_payload_hash
    ) values (
      v_org_id,
      v_num,
      v_subject,
      v_customer,
      v_channel,
      'new',
      v_priority,
      v_key,
      v_hash
    ) returning id into v_id;
  exception
    when unique_violation then
      if v_key is null then
        raise;
      end if;

      select * into v_existing
      from public.organization_support_cases c
      where c.organization_id = v_org_id
        and c.intake_idempotency_key = v_key;

      if not found then
        raise;
      end if;

      if v_existing.intake_payload_hash is distinct from v_hash then
        raise exception 'support_intake_idempotency_conflict';
      end if;

      select m.id into v_message_id
      from public.organization_support_case_messages m
      where m.organization_id = v_org_id
        and m.case_id = v_existing.id
        and m.direction = 'inbound'
        and m.author_kind = 'customer'
      order by m.created_at asc
      limit 1;

      return jsonb_build_object(
        'id', v_existing.id,
        'case_number', v_existing.case_number,
        'status', v_existing.status,
        'created', false,
        'message_id', v_message_id
      );
  end;

  v_message_id := null;
  if v_message is not null then
    insert into public.organization_support_case_messages (
      organization_id,
      case_id,
      direction,
      author_kind,
      body
    ) values (
      v_org_id,
      v_id,
      'inbound',
      'customer',
      v_message
    ) returning id into v_message_id;
  end if;

  perform public._sai_log(
    v_org_id,
    'support_case_created',
    'support_case',
    v_id,
    jsonb_build_object('case_number', v_num, 'subject', v_subject)
  );

  return jsonb_build_object(
    'id', v_id,
    'case_number', v_num,
    'status', 'new',
    'created', true,
    'message_id', v_message_id
  );
end;
$$;

revoke all on function public.create_organization_support_case(text, text, text, text, text, text) from public, anon;
grant execute on function public.create_organization_support_case(text, text, text, text, text, text) to authenticated;
