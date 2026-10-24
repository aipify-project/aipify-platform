-- NOT APPLIED
-- Do not execute until the owner approves this exact file, its SHA-256, and the environment.
-- Verified read-only before this file was written: website_kompis_answer_feedback has
-- id, tenant_id, install_id, answer_id, vote, comment, visitor_key_hash, created_at.
-- review_disposition, the audit table, and the disposition RPCs are absent.
-- Do not apply docs/platform/NOT_APPLIED_website_kompis_feedback_review_disposition_queue_v2.sql
-- or any earlier close/approval candidate. This file refuses to run if review_disposition
-- already exists, so two disposition contracts cannot be stacked.
-- This file does not write FAQ rows, does not publish, and does not delete feedback,
-- receipts, or FAQ items. A draft save is not a disposition and has no function here.
--
-- Dispositions, all kept for history:
-- * published — FAQ is already published, public-safe, same tenant, same install, same locale.
-- * retrieval_unresolved — that FAQ is linked, but the search miss stays an open follow-up.
-- * rejected — spam or irrelevant, with a reason and no FAQ id.
-- * duplicate — same, with a reason and no FAQ id.
-- Open not_helpful rows stay in the active review queue.
-- Helpful rows, and every terminal disposition, are history.
-- Bulk accepts only rejected or duplicate, at most 25 explicit ids, and reports each id.
-- It cannot publish or close a retrieval miss.
--
-- Security:
-- * Tenant comes from _wpkf_auth_tenant_id(). There is no client tenant argument.
-- * Only an owner or admin can write or read the queue.
-- * Another tenant's feedback id or FAQ id is not found.
-- * Confirmation is required. A retry of the same outcome does not write a second audit.
-- * A terminal row cannot change outcome.
-- * reviewed_by is stored and is not returned.
-- * Audit stores action, actor, FAQ id, and reason. It does not copy question or answer text.
-- * Only the public FAQ table is read. Private company knowledge is not a link target.
-- * Anonymous is excluded. Authenticated may execute only these security-definer functions.
--
-- Rollback, after a separate decision:
-- * Drop the functions in this file.
-- * Leave feedback rows, disposition columns, and the audit table in place.
-- * Do not delete feedback, receipts, or FAQ items.

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'website_kompis_answer_feedback'
      and column_name = 'review_disposition'
  ) then
    raise exception 'review_disposition already exists; do not stack disposition contracts';
  end if;
end
$$;

alter table public.website_kompis_answer_feedback
  add column review_disposition text,
  add column reviewed_at timestamptz,
  add column reviewed_by uuid,
  add column published_faq_item_id uuid,
  add column review_reason text,
  add column follow_up_status text;

update public.website_kompis_answer_feedback
set review_disposition = 'open',
    follow_up_status = 'none'
where review_disposition is null
   or follow_up_status is null;

alter table public.website_kompis_answer_feedback
  alter column review_disposition set default 'open',
  alter column review_disposition set not null,
  alter column follow_up_status set default 'none',
  alter column follow_up_status set not null;

alter table public.website_kompis_answer_feedback
  add constraint website_kompis_answer_feedback_review_disposition_check
  check (review_disposition in ('open', 'published', 'retrieval_unresolved', 'rejected', 'duplicate'));

alter table public.website_kompis_answer_feedback
  add constraint website_kompis_answer_feedback_follow_up_check
  check (
    (review_disposition = 'retrieval_unresolved' and follow_up_status = 'open')
    or (review_disposition <> 'retrieval_unresolved' and follow_up_status = 'none')
  );

alter table public.website_kompis_answer_feedback
  add constraint website_kompis_answer_feedback_published_faq_check
  check (
    (
      review_disposition in ('published', 'retrieval_unresolved')
      and published_faq_item_id is not null
    )
    or (
      review_disposition in ('open', 'rejected', 'duplicate')
      and published_faq_item_id is null
    )
  );

alter table public.website_kompis_answer_feedback
  add constraint website_kompis_answer_feedback_review_reason_check
  check (
    (
      review_disposition in ('rejected', 'duplicate', 'retrieval_unresolved')
      and review_reason is not null
      and char_length(btrim(review_reason)) between 3 and 280
    )
    or (
      review_disposition in ('open', 'published')
      and review_reason is null
    )
  );

alter table public.website_kompis_answer_feedback
  add constraint website_kompis_answer_feedback_published_faq_fk
  foreign key (published_faq_item_id)
  references public.tenant_public_companion_faq_items (id)
  on delete restrict;

create index if not exists website_kompis_answer_feedback_tenant_disposition_idx
  on public.website_kompis_answer_feedback (tenant_id, review_disposition, created_at desc, id desc);

create table public.website_kompis_answer_feedback_review_audit (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  feedback_id uuid not null,
  action text not null,
  faq_item_id uuid,
  reason text,
  actor_user_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  constraint website_kompis_answer_feedback_review_audit_action_check
    check (action in ('published', 'retrieval_unresolved', 'rejected', 'duplicate'))
);

alter table public.website_kompis_answer_feedback_review_audit enable row level security;
revoke all on table public.website_kompis_answer_feedback_review_audit from public, anon, authenticated;

create policy website_kompis_answer_feedback_review_audit_deny_all
  on public.website_kompis_answer_feedback_review_audit
  for all
  to authenticated, anon
  using (false)
  with check (false);

create or replace function public._wk_feedback_review_reason(p_reason text)
returns text
language plpgsql
immutable
set search_path = public
as $$
declare
  v_reason text;
begin
  v_reason := btrim(coalesce(p_reason, ''));
  if char_length(v_reason) < 3 or char_length(v_reason) > 280 then
    raise exception 'reason required';
  end if;
  return v_reason;
end;
$$;

revoke all on function public._wk_feedback_review_reason(text) from public, anon, authenticated;

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
  v_locale text;
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
      'follow_up_status', v_row.follow_up_status,
      'install_id', v_row.install_id,
      'reviewed_at', v_row.reviewed_at
    );
  end if;

  if v_row.review_disposition <> 'open' or v_row.vote is distinct from 'not_helpful' then
    raise exception 'not eligible';
  end if;

  select locale into v_locale
  from public.website_kompis_answer_receipts
  where id = v_row.answer_id
    and tenant_id = v_tenant
    and install_id = v_row.install_id;

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
  if v_locale is null or v_faq.locale is distinct from v_locale then
    raise exception 'faq locale mismatch';
  end if;

  update public.website_kompis_answer_feedback
  set review_disposition = 'published',
      published_faq_item_id = v_faq.id,
      review_reason = null,
      follow_up_status = 'none',
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
    tenant_id, feedback_id, action, faq_item_id, reason, actor_user_id
  ) values (
    v_tenant, v_row.id, 'published', v_faq.id, null, auth.uid()
  );

  return jsonb_build_object(
    'id', v_row.id,
    'review_disposition', 'published',
    'published_faq_item_id', v_faq.id,
    'follow_up_status', 'none',
    'install_id', v_row.install_id,
    'reviewed_at', v_reviewed_at
  );
end;
$$;

create or replace function public.mark_website_kompis_feedback_retrieval_unresolved(
  p_feedback_id uuid,
  p_faq_item_id uuid,
  p_reason text,
  p_confirmation boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant uuid;
  v_reason text;
  v_row public.website_kompis_answer_feedback%rowtype;
  v_faq public.tenant_public_companion_faq_items%rowtype;
  v_locale text;
  v_reviewed_at timestamptz;
begin
  if p_confirmation is not true then
    raise exception 'confirmation required';
  end if;
  if p_faq_item_id is null then
    raise exception 'faq required';
  end if;
  v_reason := public._wk_feedback_review_reason(p_reason);

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

  if v_row.review_disposition = 'retrieval_unresolved'
     and v_row.published_faq_item_id = p_faq_item_id
     and v_row.follow_up_status = 'open' then
    return jsonb_build_object(
      'id', v_row.id,
      'review_disposition', 'retrieval_unresolved',
      'published_faq_item_id', v_row.published_faq_item_id,
      'follow_up_status', 'open',
      'install_id', v_row.install_id,
      'reviewed_at', v_row.reviewed_at
    );
  end if;

  if v_row.review_disposition <> 'open' or v_row.vote is distinct from 'not_helpful' then
    raise exception 'not eligible';
  end if;

  select locale into v_locale
  from public.website_kompis_answer_receipts
  where id = v_row.answer_id
    and tenant_id = v_tenant
    and install_id = v_row.install_id;

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
  if v_locale is null or v_faq.locale is distinct from v_locale then
    raise exception 'faq locale mismatch';
  end if;

  update public.website_kompis_answer_feedback
  set review_disposition = 'retrieval_unresolved',
      published_faq_item_id = v_faq.id,
      review_reason = v_reason,
      follow_up_status = 'open',
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
    tenant_id, feedback_id, action, faq_item_id, reason, actor_user_id
  ) values (
    v_tenant, v_row.id, 'retrieval_unresolved', v_faq.id, v_reason, auth.uid()
  );

  return jsonb_build_object(
    'id', v_row.id,
    'review_disposition', 'retrieval_unresolved',
    'published_faq_item_id', v_faq.id,
    'follow_up_status', 'open',
    'install_id', v_row.install_id,
    'reviewed_at', v_reviewed_at
  );
end;
$$;

create or replace function public._wk_feedback_close_without_faq(
  p_feedback_id uuid,
  p_disposition text,
  p_reason text,
  p_confirmation boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant uuid;
  v_reason text;
  v_row public.website_kompis_answer_feedback%rowtype;
  v_reviewed_at timestamptz;
begin
  if p_confirmation is not true then
    raise exception 'confirmation required';
  end if;
  if p_disposition is distinct from 'rejected' and p_disposition is distinct from 'duplicate' then
    raise exception 'not eligible';
  end if;
  v_reason := public._wk_feedback_review_reason(p_reason);

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

  if v_row.review_disposition = p_disposition and v_row.published_faq_item_id is null then
    return jsonb_build_object(
      'id', v_row.id,
      'review_disposition', v_row.review_disposition,
      'published_faq_item_id', null,
      'follow_up_status', 'none',
      'install_id', v_row.install_id,
      'reviewed_at', v_row.reviewed_at
    );
  end if;

  if v_row.review_disposition <> 'open' or v_row.vote is distinct from 'not_helpful' then
    raise exception 'not eligible';
  end if;

  update public.website_kompis_answer_feedback
  set review_disposition = p_disposition,
      published_faq_item_id = null,
      review_reason = v_reason,
      follow_up_status = 'none',
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
    tenant_id, feedback_id, action, faq_item_id, reason, actor_user_id
  ) values (
    v_tenant, v_row.id, p_disposition, null, v_reason, auth.uid()
  );

  return jsonb_build_object(
    'id', v_row.id,
    'review_disposition', p_disposition,
    'published_faq_item_id', null,
    'follow_up_status', 'none',
    'install_id', v_row.install_id,
    'reviewed_at', v_reviewed_at
  );
end;
$$;

revoke all on function public._wk_feedback_close_without_faq(uuid, text, text, boolean) from public, anon, authenticated;

create or replace function public.reject_website_kompis_feedback_review(
  p_feedback_id uuid,
  p_reason text,
  p_confirmation boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  return public._wk_feedback_close_without_faq(p_feedback_id, 'rejected', p_reason, p_confirmation);
end;
$$;

create or replace function public.mark_website_kompis_feedback_review_duplicate(
  p_feedback_id uuid,
  p_reason text,
  p_confirmation boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  return public._wk_feedback_close_without_faq(p_feedback_id, 'duplicate', p_reason, p_confirmation);
end;
$$;

create or replace function public.bulk_dispose_website_kompis_feedback_reviews(
  p_feedback_ids uuid[],
  p_disposition text,
  p_reason text,
  p_confirmation boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_seen uuid[] := '{}';
  v_results jsonb := '[]'::jsonb;
  v_body jsonb;
  v_count integer;
begin
  if p_confirmation is not true then
    raise exception 'confirmation required';
  end if;
  if p_disposition is distinct from 'rejected' and p_disposition is distinct from 'duplicate' then
    raise exception 'not eligible';
  end if;
  perform public._wk_feedback_review_reason(p_reason);
  v_count := coalesce(array_length(p_feedback_ids, 1), 0);
  if v_count < 1 or v_count > 25 then
    raise exception 'batch limit';
  end if;

  foreach v_id in array p_feedback_ids loop
    if v_id = any (v_seen) then
      continue;
    end if;
    v_seen := v_seen || v_id;
    begin
      v_body := public._wk_feedback_close_without_faq(v_id, p_disposition, p_reason, true);
      v_results := v_results || jsonb_build_array(jsonb_build_object(
        'id', v_id,
        'ok', true,
        'review_disposition', v_body ->> 'review_disposition'
      ));
    exception
      when others then
        v_results := v_results || jsonb_build_array(jsonb_build_object(
          'id', v_id,
          'ok', false,
          'code', case
            when sqlerrm ilike '%not eligible%' then 'not_eligible'
            when sqlerrm ilike '%feedback not found%' then 'missing'
            when sqlerrm ilike '%owner or admin%' then 'forbidden'
            else 'failed'
          end
        ));
    end;
  end loop;

  return jsonb_build_object(
    'disposition', p_disposition,
    'results', v_results
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
  v_retrieval bigint;
  v_rejected bigint;
  v_duplicate bigint;
  v_follow_up bigint;
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
  where tenant_id = v_tenant and review_disposition = 'published';

  select count(*) into v_retrieval
  from public.website_kompis_answer_feedback
  where tenant_id = v_tenant and review_disposition = 'retrieval_unresolved';

  select count(*) into v_rejected
  from public.website_kompis_answer_feedback
  where tenant_id = v_tenant and review_disposition = 'rejected';

  select count(*) into v_duplicate
  from public.website_kompis_answer_feedback
  where tenant_id = v_tenant and review_disposition = 'duplicate';

  select count(*) into v_follow_up
  from public.website_kompis_answer_feedback
  where tenant_id = v_tenant and follow_up_status = 'open';

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
      f.review_reason,
      f.follow_up_status,
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
        or (
          p_queue = 'history'
          and (
            f.vote = 'helpful'
            or f.review_disposition in ('published', 'retrieval_unresolved', 'rejected', 'duplicate')
          )
        )
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
    'retrieval_unresolved_count', v_retrieval,
    'rejected_count', v_rejected,
    'duplicate_count', v_duplicate,
    'follow_up_open_count', v_follow_up,
    'items', v_items
  );
end;
$$;

revoke all on function public.complete_website_kompis_feedback_review_as_published(uuid, uuid, boolean) from public, anon;
revoke all on function public.mark_website_kompis_feedback_retrieval_unresolved(uuid, uuid, text, boolean) from public, anon;
revoke all on function public.reject_website_kompis_feedback_review(uuid, text, boolean) from public, anon;
revoke all on function public.mark_website_kompis_feedback_review_duplicate(uuid, text, boolean) from public, anon;
revoke all on function public.bulk_dispose_website_kompis_feedback_reviews(uuid[], text, text, boolean) from public, anon;
revoke all on function public.get_website_kompis_feedback_review_queue(integer, text, timestamptz, uuid) from public, anon;

grant execute on function public.complete_website_kompis_feedback_review_as_published(uuid, uuid, boolean) to authenticated;
grant execute on function public.mark_website_kompis_feedback_retrieval_unresolved(uuid, uuid, text, boolean) to authenticated;
grant execute on function public.reject_website_kompis_feedback_review(uuid, text, boolean) to authenticated;
grant execute on function public.mark_website_kompis_feedback_review_duplicate(uuid, text, boolean) to authenticated;
grant execute on function public.bulk_dispose_website_kompis_feedback_reviews(uuid[], text, text, boolean) to authenticated;
grant execute on function public.get_website_kompis_feedback_review_queue(integer, text, timestamptz, uuid) to authenticated;
