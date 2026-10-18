-- NOT APPLIED
-- Candidate only. Do not execute against local, staging, or production Core.
-- Purpose: persist owner review of Website Kompis answer feedback.
-- Approving a review must not publish a public FAQ and must not change the answer the visitor already received.

-- Backfill: existing rows stay open. No automatic approval.

alter table public.website_kompis_answer_feedback
  add column if not exists review_status text not null default 'open'
    check (review_status in ('open', 'approved')),
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid,
  add column if not exists faq_item_id uuid;

comment on column public.website_kompis_answer_feedback.review_status is
  'Owner review only. open is the default. approved does not publish FAQ content.';

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

-- Tenant comes from the authenticated organization, never from a client argument.
-- Caller must be owner or admin of that tenant.
-- Idempotent: approving an already approved row returns the same row.
-- The receipt answer_text is not updated.
-- No grant to anon or authenticated. Access stays on the security definer RPC.

create or replace function public.approve_website_kompis_answer_feedback(
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

  if v_row.review_status = 'approved' then
    return jsonb_build_object(
      'id', v_row.id,
      'review_status', v_row.review_status,
      'reviewed_at', v_row.reviewed_at,
      'faq_published', false
    );
  end if;

  update public.website_kompis_answer_feedback
  set review_status = 'approved',
      reviewed_at = timezone('utc', now()),
      reviewed_by = auth.uid()
  where id = v_row.id
    and tenant_id = v_tenant
    and review_status = 'open';

  insert into public.website_kompis_answer_feedback_review_audit (
    tenant_id, feedback_id, action, actor_user_id
  ) values (
    v_tenant, v_row.id, 'approved', auth.uid()
  );

  return jsonb_build_object(
    'id', v_row.id,
    'review_status', 'approved',
    'faq_published', false
  );
end;
$$;

revoke all on function public.approve_website_kompis_answer_feedback(uuid, boolean) from public, anon, authenticated;
