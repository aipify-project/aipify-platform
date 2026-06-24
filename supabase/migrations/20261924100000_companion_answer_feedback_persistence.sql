-- Companion answer feedback: upsert per user/message and hydrate into chat state.

delete from public.companion_answer_feedback a
using public.companion_answer_feedback b
where a.tenant_id = b.tenant_id
  and a.user_id is not distinct from b.user_id
  and a.message_id = b.message_id
  and a.created_at < b.created_at;

create unique index if not exists companion_answer_feedback_user_message_uidx
  on public.companion_answer_feedback (tenant_id, user_id, message_id);

create or replace function public.record_companion_answer_feedback(
  p_conversation_id text,
  p_message_id text,
  p_question text,
  p_answer_summary text,
  p_sources jsonb default '[]'::jsonb,
  p_route_context text default null,
  p_language text default 'en',
  p_feedback_type text default 'helpful',
  p_negative_reason text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_role text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('recorded', false, 'error', 'no_tenant');
  end if;

  select u.id, u.role::text
  into v_user_id, v_role
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  if p_feedback_type = 'org_confirm' and coalesce(v_role, 'staff') not in ('owner', 'admin') then
    return jsonb_build_object('recorded', false, 'error', 'forbidden');
  end if;

  insert into public.companion_answer_feedback (
    tenant_id,
    user_id,
    conversation_id,
    message_id,
    question,
    answer_summary,
    sources,
    route_context,
    language,
    user_role,
    feedback_type,
    negative_reason,
    metadata
  ) values (
    v_tenant_id,
    v_user_id,
    left(coalesce(p_conversation_id, ''), 120),
    left(coalesce(p_message_id, ''), 120),
    left(coalesce(p_question, ''), 2000),
    left(coalesce(p_answer_summary, ''), 4000),
    coalesce(p_sources, '[]'::jsonb),
    left(coalesce(p_route_context, ''), 500),
    left(coalesce(p_language, 'en'), 16),
    left(coalesce(v_role, 'staff'), 32),
    p_feedback_type,
    left(coalesce(p_negative_reason, ''), 120),
    coalesce(p_metadata, '{}'::jsonb)
  )
  on conflict (tenant_id, user_id, message_id) do update
  set
    conversation_id = excluded.conversation_id,
    question = excluded.question,
    answer_summary = excluded.answer_summary,
    sources = excluded.sources,
    route_context = excluded.route_context,
    language = excluded.language,
    user_role = excluded.user_role,
    feedback_type = excluded.feedback_type,
    negative_reason = excluded.negative_reason,
    metadata = excluded.metadata,
    created_at = now();

  perform public.record_trust_audit_event(
    v_tenant_id,
    'companion_answer_feedback',
    'success',
    null,
    p_feedback_type,
    coalesce(v_role, 'staff'),
    null,
    jsonb_build_object(
      'conversation_id', p_conversation_id,
      'message_id', p_message_id,
      'language', p_language,
      'negative_reason', p_negative_reason
    )
  );

  return jsonb_build_object('recorded', true);
exception
  when others then
    return jsonb_build_object('recorded', false, 'error', 'insert_failed');
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
            'timestamp', extract(epoch from m.created_at) * 1000,
            'feedback_type', (
              select f.feedback_type
              from public.companion_answer_feedback f
              where f.tenant_id = v_ctx.tenant_id
                and f.user_id = v_ctx.user_id
                and f.message_id = coalesce(m.client_message_id, m.id::text)
              order by f.created_at desc
              limit 1
            )
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
