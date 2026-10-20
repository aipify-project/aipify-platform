-- NOT APPLIED
-- Do not execute until the owner approves this exact file, its SHA-256, and the environment.
-- This file is the single disposition contract for review completion and spam rejection.
-- Do not also apply:
--   docs/platform/NOT_APPLIED_website_kompis_feedback_review_disposition_v1.sql
--     SHA-256 2e15bb7f7dec7b1652f70eb033a6abca0717c27eba606c77a95a515437cf1f2e
--   docs/platform/NOT_APPLIED_website_kompis_feedback_review_close_page_v1.sql
--     SHA-256 05269740bf701f558b4b347ecb658775425cd9a97fabb09e298f1fac6482d1b6
--   docs/platform/NOT_APPLIED_website_kompis_feedback_review_close_v1.sql
--   docs/platform/NOT_APPLIED_website_kompis_feedback_review_close_read_v1.sql
--   docs/platform/NOT_APPLIED_website_kompis_feedback_review_approval_v1.sql
-- Those candidates compete with this contract. The earlier close candidates use a
-- binary close column and can close a case without a published FAQ. The v1 queue
-- omits the question, answer, and comment the review cards must show.
-- This file does not replace get_website_kompis_answer_feedback_overview(integer).
-- It does not write FAQ rows and it does not delete feedback or receipts.
-- Queue pages include the same preview fields the applied overview already returns,
-- joined to the receipt only inside the authenticated tenant, so review and history
-- can page past 100 rows without a second read model.
-- The page aggregate orders by created_at desc, id desc. That is the same total
-- order as the keyset cursor. A subquery ORDER BY is not enough inside jsonb_agg.
--
-- Two terminal dispositions, both kept for history:
-- * published — only after tenant_public_companion_faq_items.status is already
--   published for the same tenant and the same install_id.
-- * rejected — spam or irrelevant, with no FAQ id.
-- Open not_helpful rows stay in the active review queue.
--
-- FAQ publish and this completion are separate transactions.
-- The APP must publish first, then call the published completion with the
-- returned FAQ id. If that call fails, the review row stays open.
-- A retry with the same FAQ id is idempotent and does not write a second audit.
-- A rejected row cannot later be marked published, and a published row cannot
-- be rejected, so spam never counts as a published FAQ.
--
-- Security:
-- * Tenant comes from _wpkf_auth_tenant_id(). There is no client tenant argument.
-- * Only an owner or admin can complete or reject.
-- * Another tenant's feedback id or FAQ id is not found.
-- * Confirmation is required.
-- * reviewed_by is stored and audited, and is not returned.
-- * Audit stores action, actor, and FAQ id. It does not copy question or answer text.
-- * Anonymous is excluded. Authenticated may execute only these security-definer functions.
-- * search_path is public.
--
-- Rollback, after a separate decision:
-- * Drop the three functions in this file.
-- * Leave feedback rows, disposition columns, and the audit table in place.
-- * Do not delete feedback, receipts, or FAQ items.

alter table public.website_kompis_answer_feedback
  add column if not exists review_disposition text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid,
  add column if not exists published_faq_item_id uuid;

update public.website_kompis_answer_feedback
set review_disposition = 'open'
where review_disposition is null;

alter table public.website_kompis_answer_feedback
  alter column review_disposition set default 'open';

alter table public.website_kompis_answer_feedback
  alter column review_disposition set not null;

alter table public.website_kompis_answer_feedback
  drop constraint if exists website_kompis_answer_feedback_review_disposition_check;

alter table public.website_kompis_answer_feedback
  add constraint website_kompis_answer_feedback_review_disposition_check
  check (review_disposition in ('open', 'published', 'rejected'));

alter table public.website_kompis_answer_feedback
  drop constraint if exists website_kompis_answer_feedback_published_faq_check;

alter table public.website_kompis_answer_feedback
  add constraint website_kompis_answer_feedback_published_faq_check
  check (
    (review_disposition = 'published' and published_faq_item_id is not null)
    or (review_disposition <> 'published' and published_faq_item_id is null)
  );

alter table public.website_kompis_answer_feedback
  drop constraint if exists website_kompis_answer_feedback_published_faq_fk;

alter table public.website_kompis_answer_feedback
  add constraint website_kompis_answer_feedback_published_faq_fk
  foreign key (published_faq_item_id)
  references public.tenant_public_companion_faq_items (id)
  on delete restrict;

create index if not exists website_kompis_answer_feedback_tenant_disposition_idx
  on public.website_kompis_answer_feedback (tenant_id, review_disposition, created_at desc, id desc);

create table if not exists public.website_kompis_answer_feedback_review_audit (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  feedback_id uuid not null,
  action text not null check (action in ('published', 'rejected')),
  faq_item_id uuid,
  actor_user_id uuid,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.website_kompis_answer_feedback_review_audit enable row level security;
revoke all on table public.website_kompis_answer_feedback_review_audit from public, anon, authenticated;

drop policy if exists website_kompis_answer_feedback_review_audit_deny_all
  on public.website_kompis_answer_feedback_review_audit;
create policy website_kompis_answer_feedback_review_audit_deny_all
  on public.website_kompis_answer_feedback_review_audit
  for all
  to authenticated, anon
  using (false)
  with check (false);

create or replace function public.complete_website_kompis_feedback_review_as_published(
  p_feedback_id uuid,
  p_faq_item_id uuid,
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
  v_faq public.tenant_public_companion_faq_items%rowtype;
  v_reviewed_at timestamptz;
begin
  if p_confirmation is not true then
    raise exception 'confirmation required';
  end if;
  if p_faq_item_id is null then
    raise exception 'faq required';
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

  if v_row.review_disposition = 'published' and v_row.published_faq_item_id = p_faq_item_id then
    return jsonb_build_object(
      'id', v_row.id,
      'review_disposition', 'published',
      'published_faq_item_id', v_row.published_faq_item_id,
      'install_id', v_row.install_id,
      'reviewed_at', v_row.reviewed_at
    );
  end if;

  if v_row.review_disposition <> 'open' or v_row.vote is distinct from 'not_helpful' then
    raise exception 'not eligible';
  end if;

  select * into v_faq
  from public.tenant_public_companion_faq_items
  where id = p_faq_item_id
    and tenant_id = v_tenant
  for share;

  if not found
    or v_faq.status is distinct from 'published'
    or v_faq.public_safe is distinct from true
    or v_faq.install_id is distinct from v_row.install_id
  then
    raise exception 'faq not published for this site';
  end if;

  update public.website_kompis_answer_feedback
  set review_disposition = 'published',
      published_faq_item_id = v_faq.id,
      reviewed_at = timezone('utc', now()),
      reviewed_by = auth.uid()
  where id = v_row.id
    and tenant_id = v_tenant
    and review_disposition = 'open'
    and vote = 'not_helpful'
  returning reviewed_at into v_reviewed_at;

  if not found then
    raise exception 'feedback not found';
  end if;

  insert into public.website_kompis_answer_feedback_review_audit (
    tenant_id, feedback_id, action, faq_item_id, actor_user_id
  ) values (
    v_tenant, v_row.id, 'published', v_faq.id, auth.uid()
  );

  return jsonb_build_object(
    'id', v_row.id,
    'review_disposition', 'published',
    'published_faq_item_id', v_faq.id,
    'install_id', v_row.install_id,
    'reviewed_at', v_reviewed_at
  );
end;
$$;

create or replace function public.reject_website_kompis_feedback_review(
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

  if v_row.review_disposition = 'rejected' then
    return jsonb_build_object(
      'id', v_row.id,
      'review_disposition', 'rejected',
      'published_faq_item_id', null,
      'install_id', v_row.install_id,
      'reviewed_at', v_row.reviewed_at
    );
  end if;

  if v_row.review_disposition <> 'open' or v_row.vote is distinct from 'not_helpful' then
    raise exception 'not eligible';
  end if;

  update public.website_kompis_answer_feedback
  set review_disposition = 'rejected',
      published_faq_item_id = null,
      reviewed_at = timezone('utc', now()),
      reviewed_by = auth.uid()
  where id = v_row.id
    and tenant_id = v_tenant
    and review_disposition = 'open'
    and vote = 'not_helpful'
    and published_faq_item_id is null
  returning reviewed_at into v_reviewed_at;

  if not found then
    raise exception 'feedback not found';
  end if;

  insert into public.website_kompis_answer_feedback_review_audit (
    tenant_id, feedback_id, action, faq_item_id, actor_user_id
  ) values (
    v_tenant, v_row.id, 'rejected', null, auth.uid()
  );

  return jsonb_build_object(
    'id', v_row.id,
    'review_disposition', 'rejected',
    'published_faq_item_id', null,
    'install_id', v_row.install_id,
    'reviewed_at', v_reviewed_at
  );
end;
$$;

create or replace function public.get_website_kompis_feedback_review_queue(
  p_limit integer default 40,
  p_queue text default 'review',
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
  v_tenant uuid;
  v_limit integer;
  v_items jsonb;
  v_open bigint;
  v_published bigint;
  v_rejected bigint;
begin
  v_tenant := public._wpkf_auth_tenant_id();
  if v_tenant is null then
    raise exception 'tenant required';
  end if;
  if not public._wpkf_auth_is_owner_admin() then
    raise exception 'owner or admin required';
  end if;
  if p_queue is distinct from 'review' and p_queue is distinct from 'history' then
    raise exception 'queue required';
  end if;
  if (p_before is null) <> (p_before_id is null) then
    raise exception 'cursor requires both timestamps';
  end if;

  v_limit := least(greatest(coalesce(p_limit, 40), 1), 100);

  select count(*) into v_open
  from public.website_kompis_answer_feedback
  where tenant_id = v_tenant
    and review_disposition = 'open'
    and vote = 'not_helpful';

  select count(*) into v_published
  from public.website_kompis_answer_feedback
  where tenant_id = v_tenant
    and review_disposition = 'published';

  select count(*) into v_rejected
  from public.website_kompis_answer_feedback
  where tenant_id = v_tenant
    and review_disposition = 'rejected';

  select coalesce(
    jsonb_agg(
      row_to_json(q)::jsonb
      order by q.created_at desc, q.id desc
    ),
    '[]'::jsonb
  )
  into v_items
  from (
    select
      f.id,
      f.install_id,
      f.vote,
      f.comment,
      f.review_disposition,
      f.published_faq_item_id,
      f.reviewed_at,
      f.created_at,
      left(r.question, 180) as question_preview,
      left(r.answer_text, 220) as answer_preview,
      r.page_pathname,
      r.locale
    from public.website_kompis_answer_feedback f
    left join public.website_kompis_answer_receipts r
      on r.id = f.answer_id
     and r.tenant_id = f.tenant_id
    where f.tenant_id = v_tenant
      and (
        (p_queue = 'review' and f.review_disposition = 'open' and f.vote = 'not_helpful')
        or (p_queue = 'history' and (f.vote = 'helpful' or f.review_disposition in ('published', 'rejected')))
      )
      and (
        p_before is null
        or (f.created_at, f.id) < (p_before, p_before_id)
      )
    order by f.created_at desc, f.id desc
    limit v_limit
  ) q;

  return jsonb_build_object(
    'queue', p_queue,
    'limit', v_limit,
    'open_review_count', v_open,
    'published_count', v_published,
    'rejected_count', v_rejected,
    'items', v_items
  );
end;
$$;

revoke all on function public.complete_website_kompis_feedback_review_as_published(uuid, uuid, boolean) from public, anon;
revoke all on function public.reject_website_kompis_feedback_review(uuid, boolean) from public, anon;
revoke all on function public.get_website_kompis_feedback_review_queue(integer, text, timestamptz, uuid) from public, anon;

grant execute on function public.complete_website_kompis_feedback_review_as_published(uuid, uuid, boolean) to authenticated;
grant execute on function public.reject_website_kompis_feedback_review(uuid, boolean) to authenticated;
grant execute on function public.get_website_kompis_feedback_review_queue(integer, text, timestamptz, uuid) to authenticated;
