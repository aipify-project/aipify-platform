-- Extend companion read sync to playful bell moments tied to the active conversation.

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
    and n.status in ('pending', 'delivered')
    and (
      (
        n.event_type = 'companion_reply_ready'
        and coalesce(n.metadata ->> 'conversation_id', '') = left(p_conversation_id, 120)
      )
      or (
        n.event_type = 'playful_bell_moment'
        and coalesce(n.metadata ->> 'conversation_id', '') = left(p_conversation_id, 120)
      )
    );

  return jsonb_build_object('ok', true);
end;
$$;
