-- NOT APPLIED
-- Do not execute until the owner approves this exact file and its SHA-256.
-- Do not apply these earlier candidates:
--   docs/platform/NOT_APPLIED_website_kompis_feedback_review_close_v1.sql
--   docs/platform/NOT_APPLIED_website_kompis_feedback_review_approval_v1.sql
--   docs/platform/NOT_APPLIED_website_kompis_feedback_review_close_read_v1.sql
-- This file replaces that read candidate. It keeps the close, and it adds a
-- negative-only guard plus separate review/history pages with a stable cursor.
-- Existing rows stay open. Nothing is closed in bulk. No FAQ row is written.
--
-- Security:
-- * Tenant comes from _wpkf_auth_tenant_id(). There is no client tenant argument.
-- * Only an owner or admin of that tenant can read or close.
-- * Close accepts a feedback id only inside that tenant. Other tenants get not found.
-- * Confirmation is required. An already closed row returns the same status and writes no second audit.
-- * Only an open not_helpful row can be closed. Helpful rows stay historical.
-- * Vote, comment, question, answer, and original timestamps stay.
-- * reviewed_by is stored and audited. Overview and pages do not return that uuid.
-- * Audit stores action and actor. It does not copy the answer text.
-- * Anonymous role is excluded. Authenticated may execute only the security-definer functions.
-- * search_path is public.
--
-- Rollback, after a separate decision:
-- * Restore get_website_kompis_answer_feedback_overview(integer) from
--   supabase/migrations/20261937900000_website_kompis_answer_feedback_v1.sql.
-- * Drop close_website_kompis_answer_feedback_review(uuid, boolean).
-- * Leave feedback rows, review columns, and the audit table in place.
-- * Do not delete feedback or receipts.

alter table public.website_kompis_answer_feedback
  add column if not exists review_status text not null default 'open'
    check (review_status in ('open', 'closed')),
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid;

create index if not exists website_kompis_answer_feedback_tenant_review_idx
  on public.website_kompis_answer_feedback (tenant_id, review_status);

create table if not exists public.website_kompis_answer_feedback_review_audit (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  feedback_id uuid not null,
  action text not null,
  actor_user_id uuid,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.website_kompis_answer_feedback_review_audit enable row level security;
revoke all on table public.website_kompis_answer_feedback_review_audit from public, anon, authenticated;

create or replace function public.close_website_kompis_answer_feedback_review(
  p_feedback_id uuid,
  p_confirmation boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant uuid;
  v_row public.website_kompis_answer_feedback%rowtype;
  v_reviewed_at timestamptz;
begin
  if p_confirmation is not true then
    raise exception 'confirmation required';
  end if;

  v_tenant := public._wpkf_auth_tenant_id();
  if v_tenant is null then
    raise exception 'tenant required';
  end if;

  if not public._wpkf_auth_is_owner_admin() then
    raise exception 'owner or admin required';
  end if;

  select * into v_row
  from public.website_kompis_answer_feedback
  where id = p_feedback_id
    and tenant_id = v_tenant
  for update;

  if not found then
    raise exception 'feedback not found';
  end if;

  if v_row.review_status = 'closed' then
    return jsonb_build_object(
      'id', v_row.id,
      'review_status', 'closed',
      'reviewed_at', v_row.reviewed_at,
      'faq_published', false
    );
  end if;

  if v_row.vote is distinct from 'not_helpful' then
    raise exception 'not eligible';
  end if;

  update public.website_kompis_answer_feedback
  set review_status = 'closed',
      reviewed_at = timezone('utc', now()),
      reviewed_by = auth.uid()
  where id = v_row.id
    and tenant_id = v_tenant
    and review_status = 'open'
    and vote = 'not_helpful'
  returning reviewed_at into v_reviewed_at;

  if not found then
    raise exception 'feedback not found';
  end if;

  insert into public.website_kompis_answer_feedback_review_audit (
    tenant_id, feedback_id, action, actor_user_id
  ) values (
    v_tenant, v_row.id, 'closed', auth.uid()
  );

  return jsonb_build_object(
    'id', v_row.id,
    'review_status', 'closed',
    'reviewed_at', v_reviewed_at,
    'faq_published', false
  );
end;
$$;

revoke all on function public.close_website_kompis_answer_feedback_review(uuid, boolean) from public, anon;
grant execute on function public.close_website_kompis_answer_feedback_review(uuid, boolean) to authenticated;

drop function if exists public.get_website_kompis_answer_feedback_overview(integer);

create function public.get_website_kompis_answer_feedback_overview(
  p_limit integer default 40,
  p_queue text default null,
  p_before timestamptz default null,
  p_before_id uuid default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_limit integer;
  v_fetch integer;
  v_totals jsonb;
  v_recent jsonb;
  v_review_page jsonb;
  v_history_page jsonb;
  v_queue text;
begin
  v_tenant_id := public._wpkf_auth_tenant_id();
  if v_tenant_id is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if not public._wpkf_auth_is_owner_admin() then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  if p_queue is not null and p_queue not in ('review', 'history') then
    return jsonb_build_object('ok', false, 'error', 'invalid_queue');
  end if;

  v_limit := greatest(1, least(coalesce(p_limit, 40), 100));
  v_fetch := v_limit + 1;
  v_queue := p_queue;

  select jsonb_build_object(
    'answers', (select count(*)::int from public.website_kompis_answer_receipts r where r.tenant_id = v_tenant_id),
    'helpful', (
      select count(*)::int
      from public.website_kompis_answer_feedback f
      where f.tenant_id = v_tenant_id and f.vote = 'helpful'
    ),
    'not_helpful', (
      select count(*)::int
      from public.website_kompis_answer_feedback f
      where f.tenant_id = v_tenant_id and f.vote = 'not_helpful'
    ),
    'with_comment', (
      select count(*)::int
      from public.website_kompis_answer_feedback f
      where f.tenant_id = v_tenant_id and f.comment is not null and btrim(f.comment) <> ''
    ),
    'needs_review', (
      select count(*)::int
      from public.website_kompis_answer_feedback f
      where f.tenant_id = v_tenant_id
        and f.vote = 'not_helpful'
        and f.review_status = 'open'
    ),
    'history', (
      select count(*)::int
      from public.website_kompis_answer_feedback f
      where f.tenant_id = v_tenant_id
        and (f.vote = 'helpful' or f.review_status = 'closed')
    )
  )
  into v_totals;

  if v_queue is null then
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', x.id,
          'vote', x.vote,
          'comment', x.comment,
          'question_preview', x.question_preview,
          'answer_preview', x.answer_preview,
          'page_pathname', x.page_pathname,
          'locale', x.locale,
          'created_at', x.created_at,
          'review_status', x.review_status,
          'reviewed_at', x.reviewed_at
        )
        order by x.created_at desc
      ),
      '[]'::jsonb
    )
    into v_recent
    from (
      select
        f.id,
        f.vote,
        f.comment,
        left(r.question, 180) as question_preview,
        left(r.answer_text, 220) as answer_preview,
        r.page_pathname,
        r.locale,
        f.created_at,
        f.review_status,
        f.reviewed_at
      from public.website_kompis_answer_feedback f
      join public.website_kompis_answer_receipts r
        on r.id = f.answer_id
       and r.tenant_id = f.tenant_id
      where f.tenant_id = v_tenant_id
      order by f.created_at desc, f.id desc
      limit v_limit
    ) x;
  else
    v_recent := '[]'::jsonb;
  end if;

  if v_queue is null or v_queue = 'review' then
    with picked as (
      select
        f.id,
        f.vote,
        f.comment,
        left(r.question, 180) as question_preview,
        left(r.answer_text, 220) as answer_preview,
        r.page_pathname,
        r.locale,
        f.created_at,
        f.review_status,
        f.reviewed_at
      from public.website_kompis_answer_feedback f
      join public.website_kompis_answer_receipts r
        on r.id = f.answer_id
       and r.tenant_id = f.tenant_id
      where f.tenant_id = v_tenant_id
        and f.vote = 'not_helpful'
        and f.review_status = 'open'
        and (
          (case when v_queue = 'review' then p_before else null end) is null
          or f.created_at < p_before
          or (f.created_at = p_before and p_before_id is not null and f.id < p_before_id)
        )
      order by f.created_at desc, f.id desc
      limit v_fetch
    )
    select jsonb_build_object(
      'rows', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'id', kept.id,
            'vote', kept.vote,
            'comment', kept.comment,
            'question_preview', kept.question_preview,
            'answer_preview', kept.answer_preview,
            'page_pathname', kept.page_pathname,
            'locale', kept.locale,
            'created_at', kept.created_at,
            'review_status', kept.review_status,
            'reviewed_at', kept.reviewed_at
          )
          order by kept.created_at desc, kept.id desc
        )
        from (
          select * from picked
          order by created_at desc, id desc
          limit v_limit
        ) kept
      ), '[]'::jsonb),
      'has_more', (select count(*) > v_limit from picked),
      'next_before', case
        when (select count(*) > v_limit from picked) then (
          select kept.created_at
          from (
            select created_at, id from picked
            order by created_at desc, id desc
            limit v_limit
          ) kept
          order by kept.created_at asc, kept.id asc
          limit 1
        )
        else null
      end,
      'next_before_id', case
        when (select count(*) > v_limit from picked) then (
          select kept.id
          from (
            select created_at, id from picked
            order by created_at desc, id desc
            limit v_limit
          ) kept
          order by kept.created_at asc, kept.id asc
          limit 1
        )
        else null
      end
    )
    into v_review_page;
  end if;

  if v_queue is null or v_queue = 'history' then
    with picked as (
      select
        f.id,
        f.vote,
        f.comment,
        left(r.question, 180) as question_preview,
        left(r.answer_text, 220) as answer_preview,
        r.page_pathname,
        r.locale,
        f.created_at,
        f.review_status,
        f.reviewed_at
      from public.website_kompis_answer_feedback f
      join public.website_kompis_answer_receipts r
        on r.id = f.answer_id
       and r.tenant_id = f.tenant_id
      where f.tenant_id = v_tenant_id
        and (f.vote = 'helpful' or f.review_status = 'closed')
        and (
          (case when v_queue = 'history' then p_before else null end) is null
          or f.created_at < p_before
          or (f.created_at = p_before and p_before_id is not null and f.id < p_before_id)
        )
      order by f.created_at desc, f.id desc
      limit v_fetch
    )
    select jsonb_build_object(
      'rows', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'id', kept.id,
            'vote', kept.vote,
            'comment', kept.comment,
            'question_preview', kept.question_preview,
            'answer_preview', kept.answer_preview,
            'page_pathname', kept.page_pathname,
            'locale', kept.locale,
            'created_at', kept.created_at,
            'review_status', kept.review_status,
            'reviewed_at', kept.reviewed_at
          )
          order by kept.created_at desc, kept.id desc
        )
        from (
          select * from picked
          order by created_at desc, id desc
          limit v_limit
        ) kept
      ), '[]'::jsonb),
      'has_more', (select count(*) > v_limit from picked),
      'next_before', case
        when (select count(*) > v_limit from picked) then (
          select kept.created_at
          from (
            select created_at, id from picked
            order by created_at desc, id desc
            limit v_limit
          ) kept
          order by kept.created_at asc, kept.id asc
          limit 1
        )
        else null
      end,
      'next_before_id', case
        when (select count(*) > v_limit from picked) then (
          select kept.id
          from (
            select created_at, id from picked
            order by created_at desc, id desc
            limit v_limit
          ) kept
          order by kept.created_at asc, kept.id asc
          limit 1
        )
        else null
      end
    )
    into v_history_page;
  end if;

  return jsonb_build_object(
    'ok', true,
    'persistence_ready', true,
    'review_close_ready', true,
    'review_page_ready', true,
    'totals', v_totals,
    'recent', v_recent,
    'review_page', v_review_page,
    'history_page', v_history_page
  );
end;
$$;

revoke all on function public.get_website_kompis_answer_feedback_overview(integer, text, timestamptz, uuid) from public, anon;
grant execute on function public.get_website_kompis_answer_feedback_overview(integer, text, timestamptz, uuid) to authenticated;
