-- NOT APPLIED
-- Do not execute until the owner approves this exact file and its SHA-256.
-- Do not apply docs/platform/NOT_APPLIED_website_kompis_feedback_review_close_v1.sql
-- and do not apply docs/platform/NOT_APPLIED_website_kompis_feedback_review_approval_v1.sql.
-- Those files use a different status check and do not update the review read.
-- This file is the replacement. Existing rows stay open. Nothing is closed in bulk.
-- Closing a review does not delete feedback or receipts and does not publish a FAQ.
--
-- Security:
-- * Tenant comes from _wpkf_auth_tenant_id(), which uses the authenticated user.
-- * Only an owner or admin of that tenant can close a row.
-- * A client-supplied feedback id is accepted only inside that tenant. Other tenants fail.
-- * Confirmation is required. Closing an already closed row returns the same status.
-- * The vote, comment, question, answer, and original timestamps stay.
-- * reviewed_by and reviewed_at are stored. The overview returns the time, not a raw user id.
-- * Audit stores the action and actor. It does not copy the answer text.
-- * Anonymous role is excluded. Authenticated may execute only the security-definer close function.
-- * search_path is public. The function does not update FAQ rows.

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

  update public.website_kompis_answer_feedback
  set review_status = 'closed',
      reviewed_at = timezone('utc', now()),
      reviewed_by = auth.uid()
  where id = v_row.id
    and tenant_id = v_tenant
    and review_status = 'open';

  insert into public.website_kompis_answer_feedback_review_audit (
    tenant_id, feedback_id, action, actor_user_id
  ) values (
    v_tenant, v_row.id, 'closed', auth.uid()
  );

  return jsonb_build_object(
    'id', v_row.id,
    'review_status', 'closed',
    'reviewed_at', timezone('utc', now()),
    'faq_published', false
  );
end;
$$;

revoke all on function public.close_website_kompis_answer_feedback_review(uuid, boolean) from public, anon;
grant execute on function public.close_website_kompis_answer_feedback_review(uuid, boolean) to authenticated;

create or replace function public.get_website_kompis_answer_feedback_overview(
  p_limit integer default 40
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
  v_totals jsonb;
  v_recent jsonb;
begin
  v_tenant_id := public._wpkf_auth_tenant_id();
  if v_tenant_id is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if not public._wpkf_auth_is_owner_admin() then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  v_limit := greatest(1, least(coalesce(p_limit, 40), 100));

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
    )
  )
  into v_totals;

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
    join public.website_kompis_answer_receipts r on r.id = f.answer_id
    where f.tenant_id = v_tenant_id
    order by f.created_at desc
    limit v_limit
  ) x;

  return jsonb_build_object(
    'ok', true,
    'persistence_ready', true,
    'review_close_ready', true,
    'totals', v_totals,
    'recent', v_recent
  );
end;
$$;
