-- Companion conversation lifecycle: archive, delete, audit, notification read sync
-- Feature owner: CUSTOMER APP (Companion chat surfaces)

alter table public.companion_conversations
  add column if not exists archived_at timestamptz,
  add column if not exists deleted_at timestamptz;

create index if not exists companion_conversations_active_idx
  on public.companion_conversations (tenant_id, user_id, updated_at desc)
  where deleted_at is null and archived_at is null;

create table if not exists public.companion_conversation_audit_logs (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  action text not null check (action in ('archive', 'delete', 'restore')),
  created_at timestamptz not null default now()
);

create index if not exists companion_conversation_audit_logs_created_idx
  on public.companion_conversation_audit_logs (created_at desc);

alter table public.companion_conversation_audit_logs enable row level security;
revoke all on public.companion_conversation_audit_logs from authenticated, anon;

create or replace function public._companion_conversation_owned(p_conversation_id text)
returns boolean
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
    return false;
  end if;

  return exists (
    select 1
    from public.companion_conversations c
    where c.id = left(p_conversation_id, 120)
      and c.tenant_id = v_ctx.tenant_id
      and c.user_id = v_ctx.user_id
      and c.deleted_at is null
  );
end;
$$;

create or replace function public.archive_companion_conversation(p_conversation_id text)
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
  set archived_at = now(),
      updated_at = now()
  where c.id = left(p_conversation_id, 120)
    and c.tenant_id = v_ctx.tenant_id
    and c.user_id = v_ctx.user_id
    and c.deleted_at is null
    and c.archived_at is null;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  insert into public.companion_conversation_audit_logs (
    conversation_id, tenant_id, user_id, action
  ) values (
    left(p_conversation_id, 120), v_ctx.tenant_id, v_ctx.user_id, 'archive'
  );

  return jsonb_build_object('ok', true, 'conversation_id', p_conversation_id);
end;
$$;

create or replace function public.delete_companion_conversation(p_conversation_id text)
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
  set deleted_at = now(),
      archived_at = coalesce(c.archived_at, now()),
      updated_at = now()
  where c.id = left(p_conversation_id, 120)
    and c.tenant_id = v_ctx.tenant_id
    and c.user_id = v_ctx.user_id
    and c.deleted_at is null;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  insert into public.companion_conversation_audit_logs (
    conversation_id, tenant_id, user_id, action
  ) values (
    left(p_conversation_id, 120), v_ctx.tenant_id, v_ctx.user_id, 'delete'
  );

  return jsonb_build_object('ok', true, 'conversation_id', p_conversation_id);
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

  if not exists (
    select 1
    from public.companion_conversations c
    where c.id = left(p_conversation_id, 120)
      and c.tenant_id = v_ctx.tenant_id
      and c.user_id = v_ctx.user_id
      and c.deleted_at is null
  ) then
    return jsonb_build_object('ok', false, 'error', 'not_found', 'messages', '[]'::jsonb, 'queue', '[]'::jsonb);
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
        'updated_at', c.updated_at,
        'archived_at', c.archived_at
      )
      from public.companion_conversations c
      where c.id = p_conversation_id
        and c.tenant_id = v_ctx.tenant_id
        and c.user_id = v_ctx.user_id
        and c.deleted_at is null
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
          and c.deleted_at is null
          and c.archived_at is null
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
  where c.id = left(p_conversation_id, 120)
    and c.tenant_id = v_ctx.tenant_id
    and c.user_id = v_ctx.user_id
    and c.deleted_at is null;

  update public.presence_notifications n
  set status = 'read',
      read_at = coalesce(n.read_at, now())
  where n.tenant_id = v_ctx.tenant_id
    and n.event_type = 'companion_reply_ready'
    and coalesce(n.metadata ->> 'conversation_id', '') = left(p_conversation_id, 120)
    and n.status in ('pending', 'delivered');

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.archive_companion_conversation(text) to authenticated;
grant execute on function public.delete_companion_conversation(text) to authenticated;
