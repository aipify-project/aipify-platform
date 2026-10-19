-- NOT APPLIED
-- Do not execute until the owner approves this exact file and its SHA-256.
-- This file does not publish FAQ content and does not delete feedback or receipts.
-- The earlier candidate docs/platform/NOT_APPLIED_website_kompis_feedback_review_approval_v1.sql
-- is also not applied. This file is the closure contract to approve instead of that one.
--
-- Security:
-- * Tenant id comes from _wpkf_auth_tenant_id(), never from the client.
-- * Only an owner or admin of that tenant may close a row.
-- * Confirmation is required. A repeated close of the same row is idempotent.
-- * The visitor receipt, vote, and comment stay. review_status moves from open to closed.
-- * Audit stores the action, actor, and time. It does not store the answer text.
-- * No anon grant. Authenticated may execute only the security-definer RPC.
-- * Rollback is a new reviewed action, not a delete of the audit row.
-- * Closing a review must not publish, revise, or unpublish a FAQ.

alter table public.website_kompis_answer_feedback
  add column if not exists review_status text not null default 'open'
    check (review_status in ('open', 'closed')),
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid;

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
    'faq_published', false
  );
end;
$$;

revoke all on function public.close_website_kompis_answer_feedback_review(uuid, boolean) from public, anon;
grant execute on function public.close_website_kompis_answer_feedback_review(uuid, boolean) to authenticated;
