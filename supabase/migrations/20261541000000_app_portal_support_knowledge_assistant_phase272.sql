-- Phase 272 (APP) — Customer Support Knowledge Assistant (context staging only)

create table if not exists public.app_portal_support_assistant_context (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  question_asked text not null default '',
  article_id text,
  article_title text,
  related_module text,
  user_language text not null default 'en',
  context_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_support_assistant_context_company_idx
  on public.app_portal_support_assistant_context (company_id, created_at desc);

alter table public.app_portal_support_assistant_context enable row level security;
revoke all on public.app_portal_support_assistant_context from authenticated, anon;

create or replace function public._apsa272_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  return v_access || jsonb_build_object('user_id', v_user.id);
end;
$$;

create or replace function public.prepare_app_portal_support_assistant_context(
  p_question_asked text,
  p_article_id text default null,
  p_article_title text default null,
  p_related_module text default null,
  p_user_language text default 'en',
  p_context_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_prepared jsonb;
begin
  v_ctx := public._apsa272_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  v_prepared := jsonb_build_object(
    'question_asked', left(coalesce(p_question_asked, ''), 500),
    'article_id', p_article_id,
    'article_title', p_article_title,
    'related_module', p_related_module,
    'user_language', coalesce(nullif(trim(p_user_language), ''), 'en'),
    'organization_id', v_company_id,
    'timestamp', now()
  ) || coalesce(p_context_payload, '{}'::jsonb);

  insert into public.app_portal_support_assistant_context (
    company_id, user_id, question_asked, article_id, article_title,
    related_module, user_language, context_payload
  ) values (
    v_company_id, v_user_id,
    left(coalesce(p_question_asked, ''), 500),
    p_article_id, p_article_title,
    nullif(trim(p_related_module), ''),
    coalesce(nullif(trim(p_user_language), ''), 'en'),
    v_prepared
  ) returning id into v_id;

  return jsonb_build_object(
    'prepared', true,
    'context_id', v_id,
    'context', v_prepared,
    'requires_confirmation', true,
    'support_request_route', '/app/support/requests'
  );
end;
$$;

grant execute on function public.prepare_app_portal_support_assistant_context(text, text, text, text, text, jsonb) to authenticated;
