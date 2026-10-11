-- AIPIFY.KOMPIS.CORE.ANSWER.FEEDBACK.COPY.V1
-- Public Website Kompis answer receipts + visitor feedback (tenant-bound).
-- Reuse of voted answers remains OFF in application code until separate gates land.
-- Idempotent apply-safe. No customer seeds. No APPLY in this Core job by default.

create table if not exists public.website_kompis_answer_receipts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  install_id uuid not null references public.installations (id) on delete cascade,
  domain text,
  locale text,
  page_pathname text,
  question text not null,
  answer_text text not null,
  sources jsonb not null default '[]'::jsonb,
  source_version_refs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists website_kompis_answer_receipts_tenant_created_idx
  on public.website_kompis_answer_receipts (tenant_id, created_at desc);

create index if not exists website_kompis_answer_receipts_install_created_idx
  on public.website_kompis_answer_receipts (install_id, created_at desc);

create table if not exists public.website_kompis_answer_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  install_id uuid not null references public.installations (id) on delete cascade,
  answer_id uuid not null references public.website_kompis_answer_receipts (id) on delete cascade,
  vote text not null check (vote in ('helpful', 'not_helpful')),
  comment text,
  visitor_key_hash text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (answer_id, visitor_key_hash)
);

create index if not exists website_kompis_answer_feedback_tenant_created_idx
  on public.website_kompis_answer_feedback (tenant_id, created_at desc);

create index if not exists website_kompis_answer_feedback_answer_idx
  on public.website_kompis_answer_feedback (answer_id);

alter table public.website_kompis_answer_receipts enable row level security;
alter table public.website_kompis_answer_feedback enable row level security;

revoke all on table public.website_kompis_answer_receipts from public, anon, authenticated;
revoke all on table public.website_kompis_answer_feedback from public, anon, authenticated;

drop policy if exists website_kompis_answer_receipts_deny_all on public.website_kompis_answer_receipts;
create policy website_kompis_answer_receipts_deny_all
  on public.website_kompis_answer_receipts
  for all
  to authenticated, anon
  using (false)
  with check (false);

drop policy if exists website_kompis_answer_feedback_deny_all on public.website_kompis_answer_feedback;
create policy website_kompis_answer_feedback_deny_all
  on public.website_kompis_answer_feedback
  for all
  to authenticated, anon
  using (false)
  with check (false);

create or replace function public.create_website_kompis_answer_receipt(
  p_install_id uuid,
  p_domain text,
  p_locale text,
  p_question text,
  p_answer_text text,
  p_sources jsonb default '[]'::jsonb,
  p_source_version_refs jsonb default '[]'::jsonb,
  p_page_pathname text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_id uuid;
  v_question text;
  v_answer text;
  v_locale text;
  v_path text;
begin
  if p_install_id is null then
    return jsonb_build_object('ok', false, 'error', 'install_required');
  end if;

  v_question := nullif(btrim(coalesce(p_question, '')), '');
  v_answer := nullif(btrim(coalesce(p_answer_text, '')), '');
  if v_question is null or v_answer is null then
    return jsonb_build_object('ok', false, 'error', 'content_required');
  end if;

  v_question := left(v_question, 2000);
  v_answer := left(v_answer, 4000);
  v_locale := nullif(left(btrim(coalesce(p_locale, '')), 16), '');
  v_path := nullif(left(btrim(coalesce(p_page_pathname, '')), 500), '');
  if v_path is not null and left(v_path, 1) <> '/' then
    v_path := null;
  end if;

  select * into v_ctx
  from public._wpkf_resolve_visitor_context(p_install_id, p_domain)
  limit 1;

  if v_ctx.tenant_id is null then
    return jsonb_build_object('ok', false, 'error', 'tenant_unresolved');
  end if;

  insert into public.website_kompis_answer_receipts (
    tenant_id,
    install_id,
    domain,
    locale,
    page_pathname,
    question,
    answer_text,
    sources,
    source_version_refs
  ) values (
    v_ctx.tenant_id,
    v_ctx.resolved_install_id,
    v_ctx.resolved_domain,
    v_locale,
    v_path,
    v_question,
    v_answer,
    coalesce(p_sources, '[]'::jsonb),
    coalesce(p_source_version_refs, '[]'::jsonb)
  )
  returning id into v_id;

  return jsonb_build_object(
    'ok', true,
    'answer_id', v_id,
    'tenant_id', v_ctx.tenant_id,
    'install_id', v_ctx.resolved_install_id
  );
end;
$$;

create or replace function public.record_website_kompis_answer_feedback(
  p_answer_id uuid,
  p_install_id uuid,
  p_domain text,
  p_vote text,
  p_comment text default null,
  p_visitor_key_hash text default null,
  p_clear boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_receipt public.website_kompis_answer_receipts;
  v_vote text;
  v_comment text;
  v_hash text;
  v_id uuid;
  v_existing uuid;
  v_existing_vote text;
  v_recent_count integer;
begin
  if p_answer_id is null or p_install_id is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_payload');
  end if;

  v_hash := nullif(btrim(coalesce(p_visitor_key_hash, '')), '');
  if v_hash is null or length(v_hash) < 32 or length(v_hash) > 128 then
    return jsonb_build_object('ok', false, 'error', 'visitor_key_required');
  end if;

  select * into v_ctx
  from public._wpkf_resolve_visitor_context(p_install_id, p_domain)
  limit 1;

  if v_ctx.tenant_id is null then
    return jsonb_build_object('ok', false, 'error', 'tenant_unresolved');
  end if;

  select * into v_receipt
  from public.website_kompis_answer_receipts r
  where r.id = p_answer_id
  limit 1;

  if v_receipt.id is null then
    return jsonb_build_object('ok', false, 'error', 'answer_not_found');
  end if;

  if v_receipt.tenant_id <> v_ctx.tenant_id then
    return jsonb_build_object('ok', false, 'error', 'tenant_mismatch');
  end if;

  if v_receipt.install_id <> v_ctx.resolved_install_id then
    return jsonb_build_object('ok', false, 'error', 'install_mismatch');
  end if;

  select count(*)::int into v_recent_count
  from public.website_kompis_answer_feedback f
  where f.visitor_key_hash = v_hash
    and f.created_at > timezone('utc', now()) - interval '1 hour';

  if coalesce(v_recent_count, 0) >= 40 then
    return jsonb_build_object('ok', false, 'error', 'rate_limited');
  end if;

  select f.id, f.vote into v_existing, v_existing_vote
  from public.website_kompis_answer_feedback f
  where f.answer_id = p_answer_id
    and f.visitor_key_hash = v_hash
  limit 1;

  if coalesce(p_clear, false) then
    if v_existing is null then
      return jsonb_build_object('ok', true, 'cleared', true, 'already_recorded', false);
    end if;
    delete from public.website_kompis_answer_feedback where id = v_existing;
    return jsonb_build_object(
      'ok', true,
      'cleared', true,
      'feedback_id', v_existing,
      'already_recorded', true
    );
  end if;

  v_vote := lower(btrim(coalesce(p_vote, '')));
  if v_vote not in ('helpful', 'not_helpful') then
    return jsonb_build_object('ok', false, 'error', 'invalid_vote');
  end if;

  v_comment := nullif(left(btrim(coalesce(p_comment, '')), 500), '');

  if v_existing is not null then
    update public.website_kompis_answer_feedback
    set
      vote = v_vote,
      comment = coalesce(v_comment, comment)
    where id = v_existing
    returning id into v_id;

    return jsonb_build_object(
      'ok', true,
      'feedback_id', v_id,
      'vote', v_vote,
      'already_recorded', v_existing_vote = v_vote,
      'updated', v_existing_vote is distinct from v_vote
    );
  end if;

  insert into public.website_kompis_answer_feedback (
    tenant_id,
    install_id,
    answer_id,
    vote,
    comment,
    visitor_key_hash
  ) values (
    v_ctx.tenant_id,
    v_ctx.resolved_install_id,
    p_answer_id,
    v_vote,
    v_comment,
    v_hash
  )
  returning id into v_id;

  return jsonb_build_object(
    'ok', true,
    'feedback_id', v_id,
    'vote', v_vote,
    'already_recorded', false,
    'updated', false
  );
end;
$$;

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
        'created_at', x.created_at
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
      f.created_at
    from public.website_kompis_answer_feedback f
    join public.website_kompis_answer_receipts r on r.id = f.answer_id
    where f.tenant_id = v_tenant_id
    order by f.created_at desc
    limit v_limit
  ) x;

  return jsonb_build_object(
    'ok', true,
    'persistence_ready', true,
    'totals', v_totals,
    'recent', v_recent
  );
end;
$$;

revoke all on function public.create_website_kompis_answer_receipt(uuid, text, text, text, text, jsonb, jsonb, text) from public;
revoke all on function public.record_website_kompis_answer_feedback(uuid, uuid, text, text, text, text, boolean) from public;
revoke all on function public.get_website_kompis_answer_feedback_overview(integer) from public;

grant execute on function public.create_website_kompis_answer_receipt(uuid, text, text, text, text, jsonb, jsonb, text) to service_role;
grant execute on function public.record_website_kompis_answer_feedback(uuid, uuid, text, text, text, text, boolean) to service_role;
grant execute on function public.get_website_kompis_answer_feedback_overview(integer) to authenticated;

comment on table public.website_kompis_answer_receipts is
  'Website Kompis public answer receipts for feedback binding; not used for answer reuse in V1.';
comment on table public.website_kompis_answer_feedback is
  'Visitor thumbs feedback for Website Kompis answers; tenant-bound; reuse remains application-gated OFF.';
