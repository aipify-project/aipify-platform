-- Companion answer quality feedback — org-isolated conversation feedback storage
-- Feature owner: CUSTOMER APP (Command Brief / Aipify Companion)

create table if not exists public.companion_answer_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  conversation_id text not null,
  message_id text not null,
  question text not null check (char_length(question) <= 2000),
  answer_summary text not null check (char_length(answer_summary) <= 4000),
  sources jsonb not null default '[]'::jsonb,
  route_context text,
  language text not null default 'en',
  user_role text not null default 'staff',
  feedback_type text not null check (
    feedback_type in ('helpful', 'not_helpful', 'org_confirm')
  ),
  negative_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists companion_answer_feedback_tenant_created_idx
  on public.companion_answer_feedback (tenant_id, created_at desc);

create index if not exists companion_answer_feedback_message_idx
  on public.companion_answer_feedback (tenant_id, message_id);

alter table public.companion_answer_feedback enable row level security;
revoke all on public.companion_answer_feedback from authenticated, anon;

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
  );

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

grant execute on function public.record_companion_answer_feedback(
  text, text, text, text, jsonb, text, text, text, text, jsonb
) to authenticated;
