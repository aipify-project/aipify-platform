-- Companion persistent chat conversations, messages, and server-side queue
-- Feature owner: CUSTOMER APP (shared Companion chat shell)

create table if not exists public.companion_conversations (
  id text primary key check (char_length(id) <= 120),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  title text,
  locale text,
  pathname text,
  unread_count integer not null default 0 check (unread_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_read_at timestamptz
);

create index if not exists companion_conversations_tenant_user_updated_idx
  on public.companion_conversations (tenant_id, user_id, updated_at desc);

create table if not exists public.companion_chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null references public.companion_conversations (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  client_message_id text check (client_message_id is null or char_length(client_message_id) <= 120),
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) <= 8000),
  payload jsonb not null default '{}'::jsonb,
  sequence_no integer not null check (sequence_no > 0),
  created_at timestamptz not null default now(),
  unique (conversation_id, sequence_no),
  unique (conversation_id, client_message_id)
);

create index if not exists companion_chat_messages_conversation_seq_idx
  on public.companion_chat_messages (conversation_id, sequence_no asc);

create table if not exists public.companion_message_queue (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null references public.companion_conversations (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  idempotency_key text not null check (char_length(idempotency_key) <= 160),
  status text not null default 'waiting' check (
    status in ('waiting', 'processing', 'completed', 'failed', 'cancelled')
  ),
  question_text text not null check (char_length(question_text) <= 4000),
  attachment_ids jsonb not null default '[]'::jsonb,
  active_artifact_id text,
  attachment_summaries jsonb not null default '[]'::jsonb,
  locale text,
  pathname text,
  platform_active_modules text,
  queue_position integer not null check (queue_position > 0),
  user_client_message_id text,
  result_message_id uuid references public.companion_chat_messages (id) on delete set null,
  error_message text,
  error_code text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (conversation_id, idempotency_key)
);

create index if not exists companion_message_queue_conv_status_pos_idx
  on public.companion_message_queue (conversation_id, status, queue_position asc);

create index if not exists companion_message_queue_processing_idx
  on public.companion_message_queue (status, updated_at asc)
  where status in ('waiting', 'processing');

alter table public.companion_conversations enable row level security;
alter table public.companion_chat_messages enable row level security;
alter table public.companion_message_queue enable row level security;
revoke all on public.companion_conversations from authenticated, anon;
revoke all on public.companion_chat_messages from authenticated, anon;
revoke all on public.companion_message_queue from authenticated, anon;

create or replace function public._companion_chat_context()
returns table (tenant_id uuid, user_id uuid)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  tenant_id := public._presence_tenant_for_auth();
  select u.id into user_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;
  return next;
end;
$$;

create or replace function public.upsert_companion_conversation(
  p_conversation_id text,
  p_title text default null,
  p_locale text default null,
  p_pathname text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  insert into public.companion_conversations (
    id, tenant_id, user_id, title, locale, pathname
  ) values (
    left(coalesce(p_conversation_id, ''), 120),
    v_ctx.tenant_id,
    v_ctx.user_id,
    nullif(left(coalesce(p_title, ''), 200), ''),
    nullif(left(coalesce(p_locale, ''), 12), ''),
    nullif(left(coalesce(p_pathname, ''), 240), '')
  )
  on conflict (id) do update
  set
    title = coalesce(excluded.title, public.companion_conversations.title),
    locale = coalesce(excluded.locale, public.companion_conversations.locale),
    pathname = coalesce(excluded.pathname, public.companion_conversations.pathname),
    updated_at = now();

  return jsonb_build_object('ok', true, 'conversation_id', p_conversation_id);
end;
$$;

create or replace function public.append_companion_chat_message(
  p_conversation_id text,
  p_role text,
  p_content text,
  p_payload jsonb default '{}'::jsonb,
  p_client_message_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_seq integer;
  v_id uuid;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  if p_client_message_id is not null then
    select m.id into v_id
    from public.companion_chat_messages m
    where m.conversation_id = p_conversation_id
      and m.client_message_id = p_client_message_id
    limit 1;
    if v_id is not null then
      return jsonb_build_object('ok', true, 'message_id', v_id, 'deduplicated', true);
    end if;
  end if;

  select coalesce(max(m.sequence_no), 0) + 1 into v_seq
  from public.companion_chat_messages m
  where m.conversation_id = p_conversation_id;

  insert into public.companion_chat_messages (
    conversation_id,
    tenant_id,
    user_id,
    client_message_id,
    role,
    content,
    payload,
    sequence_no
  ) values (
    left(p_conversation_id, 120),
    v_ctx.tenant_id,
    v_ctx.user_id,
    nullif(left(coalesce(p_client_message_id, ''), 120), ''),
    left(p_role, 16),
    left(coalesce(p_content, ''), 8000),
    coalesce(p_payload, '{}'::jsonb),
    v_seq
  )
  returning id into v_id;

  update public.companion_conversations c
  set updated_at = now(),
      unread_count = case when p_role = 'assistant' then c.unread_count + 1 else c.unread_count end
  where c.id = p_conversation_id
    and c.tenant_id = v_ctx.tenant_id
    and c.user_id = v_ctx.user_id;

  return jsonb_build_object('ok', true, 'message_id', v_id, 'sequence_no', v_seq);
end;
$$;

create or replace function public.enqueue_companion_chat_message(
  p_conversation_id text,
  p_idempotency_key text,
  p_question_text text,
  p_attachment_ids jsonb default '[]'::jsonb,
  p_active_artifact_id text default null,
  p_attachment_summaries jsonb default '[]'::jsonb,
  p_locale text default null,
  p_pathname text default null,
  p_platform_active_modules text default null,
  p_user_client_message_id text default null,
  p_title text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_existing uuid;
  v_position integer;
  v_id uuid;
  v_user_msg jsonb;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  perform public.upsert_companion_conversation(
    p_conversation_id,
    p_title,
    p_locale,
    p_pathname
  );

  select q.id into v_existing
  from public.companion_message_queue q
  where q.conversation_id = p_conversation_id
    and q.idempotency_key = left(p_idempotency_key, 160)
  limit 1;

  if v_existing is not null then
    return jsonb_build_object('ok', true, 'queue_id', v_existing, 'deduplicated', true);
  end if;

  v_user_msg := public.append_companion_chat_message(
    p_conversation_id,
    'user',
    p_question_text,
    jsonb_build_object(
      'attachments', coalesce(p_attachment_summaries, '[]'::jsonb),
      'activeArtifactId', p_active_artifact_id
    ),
    p_user_client_message_id
  );

  select coalesce(max(q.queue_position), 0) + 1 into v_position
  from public.companion_message_queue q
  where q.conversation_id = p_conversation_id
    and q.status in ('waiting', 'processing');

  insert into public.companion_message_queue (
    conversation_id,
    tenant_id,
    user_id,
    idempotency_key,
    question_text,
    attachment_ids,
    active_artifact_id,
    attachment_summaries,
    locale,
    pathname,
    platform_active_modules,
    queue_position,
    user_client_message_id
  ) values (
    left(p_conversation_id, 120),
    v_ctx.tenant_id,
    v_ctx.user_id,
    left(p_idempotency_key, 160),
    left(coalesce(p_question_text, ''), 4000),
    coalesce(p_attachment_ids, '[]'::jsonb),
    nullif(left(coalesce(p_active_artifact_id, ''), 120), ''),
    coalesce(p_attachment_summaries, '[]'::jsonb),
    nullif(left(coalesce(p_locale, ''), 12), ''),
    nullif(left(coalesce(p_pathname, ''), 240), ''),
    nullif(left(coalesce(p_platform_active_modules, ''), 500), ''),
    v_position,
    nullif(left(coalesce(p_user_client_message_id, ''), 120), '')
  )
  returning id into v_id;

  return jsonb_build_object(
    'ok', true,
    'queue_id', v_id,
    'queue_position', v_position,
    'user_message_id', v_user_msg -> 'message_id'
  );
end;
$$;

create or replace function public.claim_companion_queue_item(p_conversation_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_row public.companion_message_queue%rowtype;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  select q.* into v_row
  from public.companion_message_queue q
  where q.conversation_id = p_conversation_id
    and q.tenant_id = v_ctx.tenant_id
    and q.user_id = v_ctx.user_id
    and q.status = 'waiting'
  order by q.queue_position asc, q.created_at asc
  limit 1
  for update skip locked;

  if v_row.id is null then
    return jsonb_build_object('ok', false, 'error', 'empty');
  end if;

  update public.companion_message_queue q
  set status = 'processing',
      started_at = now(),
      updated_at = now()
  where q.id = v_row.id;

  return jsonb_build_object(
    'ok', true,
    'queue', jsonb_build_object(
      'id', v_row.id,
      'conversation_id', v_row.conversation_id,
      'question_text', v_row.question_text,
      'attachment_ids', v_row.attachment_ids,
      'active_artifact_id', v_row.active_artifact_id,
      'attachment_summaries', v_row.attachment_summaries,
      'locale', v_row.locale,
      'pathname', v_row.pathname,
      'platform_active_modules', v_row.platform_active_modules,
      'queue_position', v_row.queue_position,
      'user_client_message_id', v_row.user_client_message_id
    )
  );
end;
$$;

create or replace function public.complete_companion_queue_item(
  p_queue_id uuid,
  p_assistant_content text,
  p_assistant_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_row public.companion_message_queue%rowtype;
  v_msg jsonb;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  select q.* into v_row
  from public.companion_message_queue q
  where q.id = p_queue_id
    and q.tenant_id = v_ctx.tenant_id
    and q.user_id = v_ctx.user_id
    and q.status = 'processing'
  limit 1;

  if v_row.id is null then
    return jsonb_build_object('ok', false, 'error', 'not_processing');
  end if;

  v_msg := public.append_companion_chat_message(
    v_row.conversation_id,
    'assistant',
    p_assistant_content,
    p_assistant_payload,
    'assistant-' || p_queue_id::text
  );

  update public.companion_message_queue q
  set status = 'completed',
      result_message_id = (v_msg ->> 'message_id')::uuid,
      completed_at = now(),
      updated_at = now()
  where q.id = p_queue_id;

  return jsonb_build_object(
    'ok', true,
    'message_id', v_msg -> 'message_id',
    'conversation_id', v_row.conversation_id
  );
end;
$$;

create or replace function public.fail_companion_queue_item(
  p_queue_id uuid,
  p_error_message text default null,
  p_error_code text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  update public.companion_message_queue q
  set status = 'failed',
      error_message = nullif(left(coalesce(p_error_message, ''), 500), ''),
      error_code = nullif(left(coalesce(p_error_code, ''), 64), ''),
      completed_at = now(),
      updated_at = now()
  where q.id = p_queue_id
    and q.tenant_id = v_ctx.tenant_id
    and q.user_id = v_ctx.user_id
    and q.status = 'processing';

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_processing');
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.cancel_companion_queue_item(p_queue_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  update public.companion_message_queue q
  set status = 'cancelled',
      completed_at = now(),
      updated_at = now()
  where q.id = p_queue_id
    and q.tenant_id = v_ctx.tenant_id
    and q.user_id = v_ctx.user_id
    and q.status = 'waiting';

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_waiting');
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.retry_companion_queue_item(p_queue_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_position integer;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  select coalesce(max(q.queue_position), 0) + 1 into v_position
  from public.companion_message_queue q
  join public.companion_message_queue target on target.conversation_id = q.conversation_id
  where target.id = p_queue_id
    and q.status in ('waiting', 'processing');

  update public.companion_message_queue q
  set status = 'waiting',
      queue_position = v_position,
      error_message = null,
      error_code = null,
      started_at = null,
      completed_at = null,
      updated_at = now()
  where q.id = p_queue_id
    and q.tenant_id = v_ctx.tenant_id
    and q.user_id = v_ctx.user_id
    and q.status = 'failed';

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_failed');
  end if;

  return jsonb_build_object('ok', true, 'queue_position', v_position);
end;
$$;

create or replace function public.get_companion_chat_state(p_conversation_id text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx record;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  return jsonb_build_object(
    'ok', true,
    'conversation', (
      select jsonb_build_object(
        'id', c.id,
        'title', c.title,
        'locale', c.locale,
        'pathname', c.pathname,
        'unread_count', c.unread_count,
        'updated_at', c.updated_at
      )
      from public.companion_conversations c
      where c.id = p_conversation_id
        and c.tenant_id = v_ctx.tenant_id
        and c.user_id = v_ctx.user_id
      limit 1
    ),
    'messages', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', coalesce(m.client_message_id, m.id::text),
            'server_id', m.id,
            'role', m.role,
            'content', m.content,
            'payload', m.payload,
            'sequence_no', m.sequence_no,
            'timestamp', extract(epoch from m.created_at) * 1000
          ) order by m.sequence_no asc
        )
        from public.companion_chat_messages m
        where m.conversation_id = p_conversation_id
          and m.tenant_id = v_ctx.tenant_id
          and m.user_id = v_ctx.user_id
      ),
      '[]'::jsonb
    ),
    'queue', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', q.id,
            'status', q.status,
            'question_text', q.question_text,
            'queue_position', q.queue_position,
            'error_message', q.error_message,
            'error_code', q.error_code,
            'created_at', q.created_at,
            'started_at', q.started_at,
            'completed_at', q.completed_at
          ) order by q.queue_position asc, q.created_at asc
        )
        from public.companion_message_queue q
        where q.conversation_id = p_conversation_id
          and q.tenant_id = v_ctx.tenant_id
          and q.user_id = v_ctx.user_id
          and q.status in ('waiting', 'processing', 'failed')
      ),
      '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.list_companion_conversations(p_limit integer default 8)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx record;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant', 'conversations', '[]'::jsonb);
  end if;

  return jsonb_build_object(
    'ok', true,
    'conversations', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', c.id,
            'title', c.title,
            'updated_at', c.updated_at,
            'unread_count', c.unread_count,
            'preview', (
              select m.content
              from public.companion_chat_messages m
              where m.conversation_id = c.id
              order by m.sequence_no desc
              limit 1
            )
          ) order by c.updated_at desc
        )
        from public.companion_conversations c
        where c.tenant_id = v_ctx.tenant_id
          and c.user_id = v_ctx.user_id
        limit greatest(1, least(coalesce(p_limit, 8), 20))
      ),
      '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.mark_companion_conversation_read(p_conversation_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  update public.companion_conversations c
  set unread_count = 0,
      last_read_at = now(),
      updated_at = c.updated_at
  where c.id = p_conversation_id
    and c.tenant_id = v_ctx.tenant_id
    and c.user_id = v_ctx.user_id;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.upsert_companion_conversation(text, text, text, text) to authenticated;
grant execute on function public.append_companion_chat_message(text, text, text, jsonb, text) to authenticated;
grant execute on function public.enqueue_companion_chat_message(text, text, text, jsonb, text, jsonb, text, text, text, text, text) to authenticated;
grant execute on function public.claim_companion_queue_item(text) to authenticated;
grant execute on function public.complete_companion_queue_item(uuid, text, jsonb) to authenticated;
grant execute on function public.fail_companion_queue_item(uuid, text, text) to authenticated;
grant execute on function public.cancel_companion_queue_item(uuid) to authenticated;
grant execute on function public.retry_companion_queue_item(uuid) to authenticated;
grant execute on function public.get_companion_chat_state(text) to authenticated;
grant execute on function public.list_companion_conversations(integer) to authenticated;
grant execute on function public.mark_companion_conversation_read(text) to authenticated;
