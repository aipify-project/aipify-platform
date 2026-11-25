-- =============================================================================
-- PREPARED ONLY — DO NOT APPLY without exact owner approval naming this file.
-- Date: 2026-11-25
-- Target: Production Core qbcqoixhrvhnuwphefvw (+ Staging auedugihkduoaikfusqe after Prod)
-- Depends on: 20261941000000 foundation + 20261941100000 impl (already applied)
-- Purpose:
--   1) Score academy attempts against the SUBMITTED exam subset (15 of 25), not all
--      loaded questions — matches product rule PASS >= 12/15 (80%).
--   2) Seed Kompis Web answer keys for positions 1..25 (kw_q01..kw_q25 mapping).
--      Locale question text continues to live in the app bank; Core stores keys only.
--   3) Publish kompis_web_v1 only after 25 questions exist.
--   4) Enrich csp_get_platform_overview with partners[], products[], academy counts.
-- Safety: additive; no DROP of tables; no Stripe/secrets; no customer names.
-- =============================================================================

begin;

-- ---------------------------------------------------------------------------
-- A) Subset scoring for exam variants
-- ---------------------------------------------------------------------------
create or replace function public.csp_record_academy_attempt(
  p_course_id uuid,
  p_score_pct numeric,
  p_passed boolean,
  p_answers jsonb
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_partner public.csp_partner_profiles%rowtype;
  v_course public.csp_academy_courses%rowtype;
  v_total integer;
  v_correct integer;
  v_score integer;
  v_passed boolean;
  v_attempt_id uuid;
  v_cert_status text := null;
  v_submitted integer;
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;
  if jsonb_typeof(p_answers) is distinct from 'object' then
    return jsonb_build_object('found', false, 'error', 'invalid_answers');
  end if;

  select * into v_partner from public.csp_partner_profiles where auth_user_id = v_uid for update;
  if not found then
    return jsonb_build_object('found', false, 'error', 'partner_not_found');
  end if;
  if v_partner.status not in ('approved','active','certified','in_academy') then
    return jsonb_build_object('found', false, 'error', 'partner_not_eligible');
  end if;

  select * into v_course from public.csp_academy_courses where id = p_course_id and published;
  if not found then
    return jsonb_build_object('found', false, 'error', 'course_not_found');
  end if;

  if (select count(*) from public.csp_academy_attempts
      where partner_id = v_partner.id and course_id = v_course.id
        and submitted_at > now() - interval '24 hours') >= 10 then
    return jsonb_build_object('found', false, 'error', 'attempt_limit_reached');
  end if;

  -- Require a full exam-sized answer set (15..25). Fewer answers cannot pass.
  select count(*) into v_submitted
  from jsonb_object_keys(p_answers) k
  where k ~ '^[0-9]+$' or k ~ '^[0-9a-f-]{36}$';

  if v_submitted < 15 or v_submitted > 25 then
    return jsonb_build_object('found', false, 'error', 'invalid_exam_size', 'submitted', v_submitted);
  end if;

  -- Score ONLY questions present in p_answers (exam subset), never the whole bank.
  select count(*),
         count(*) filter (where
           coalesce(p_answers -> q.id::text, p_answers -> q.position::text) =
           case when jsonb_typeof(q.answer_key) = 'object' and q.answer_key ? 'correct'
                then q.answer_key -> 'correct' else q.answer_key end)
  into v_total, v_correct
  from public.csp_academy_questions q
  where q.course_id = v_course.id
    and (p_answers ? q.id::text or p_answers ? q.position::text);

  if v_total = 0 then
    return jsonb_build_object('found', false, 'error', 'academy_questions_not_loaded');
  end if;
  if v_total < 15 then
    return jsonb_build_object('found', false, 'error', 'incomplete_exam_coverage', 'matched', v_total);
  end if;

  v_score := round(100.0 * v_correct / v_total)::integer;
  v_passed := v_score >= v_course.pass_score;

  insert into public.csp_academy_attempts (partner_id, course_id, score, passed)
  values (v_partner.id, v_course.id, v_score, v_passed)
  returning id into v_attempt_id;

  if v_passed and v_course.product_id is not null
     and v_partner.status in ('approved','active','certified') then
    insert into public.csp_product_certifications (partner_id, product_id, status, score, passed_at)
    values (v_partner.id, v_course.product_id, 'passed', v_score, now())
    on conflict (partner_id, product_id) do update
      set status = 'passed', score = excluded.score, passed_at = now()
      where public.csp_product_certifications.status <> 'revoked'
    returning status into v_cert_status;
  end if;

  perform public._csp_audit(v_uid, 'partner', 'academy_attempt_recorded',
    'csp_academy_attempts', v_attempt_id,
    jsonb_build_object(
      'partner_id', v_partner.id, 'course_id', v_course.id,
      'score', v_score, 'passed', v_passed,
      'client_score_pct', p_score_pct, 'client_passed', p_passed,
      'certification_status', v_cert_status,
      'scored_questions', v_total));

  return jsonb_build_object(
    'found', true, 'attempt_id', v_attempt_id,
    'score_pct', v_score, 'passed', v_passed, 'pass_score', v_course.pass_score,
    'certification_status', v_cert_status,
    'scored_questions', v_total
  );
end;
$$;

revoke all on function public.csp_record_academy_attempt(uuid, numeric, boolean, jsonb) from public, anon, authenticated, service_role;
grant execute on function public.csp_record_academy_attempt(uuid, numeric, boolean, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- B) Seed answer keys (positions 1..25) + publish course when complete
--    Keys match lib/certified-sales-partner/academy/kompis-web-answer-key.ts
-- ---------------------------------------------------------------------------
do $$
declare
  v_course_id uuid;
  v_keys text[] := array[
    'b','c','a','d','b','a','c','d','b','c',
    'a','d','c','b','a','c','d','b','a','c',
    'b','d','a','c','b'
  ];
  i integer;
  v_n integer;
begin
  select id into v_course_id from public.csp_academy_courses where course_key = 'kompis_web_v1';
  if v_course_id is null then
    raise exception 'csp_academy_course_missing:kompis_web_v1';
  end if;

  for i in 1..25 loop
    insert into public.csp_academy_questions (course_id, position, question_blocks, answer_key)
    values (
      v_course_id,
      i,
      jsonb_build_object(
        'local_id', 'kw_q' || lpad(i::text, 2, '0'),
        'source', 'app_bank_v1',
        'note', 'Locale stems/options served by partner app; Core stores answer key only.'
      ),
      to_jsonb(v_keys[i])
    )
    on conflict (course_id, position) do update
      set answer_key = excluded.answer_key,
          question_blocks = excluded.question_blocks;
  end loop;

  select count(*) into v_n from public.csp_academy_questions where course_id = v_course_id;
  if v_n >= 25 then
    update public.csp_academy_courses
       set published = true
     where id = v_course_id
       and published is distinct from true;
  end if;

  perform public._csp_audit(null, 'system', 'csp_academy_bank_seed_v1', 'csp_academy_courses', v_course_id,
    jsonb_build_object('questions', v_n, 'published', true, 'pass_score', 80));
end;
$$;

-- ---------------------------------------------------------------------------
-- C) Platform overview enrichment (directory + academy aggregates)
-- ---------------------------------------------------------------------------
create or replace function public.csp_get_platform_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;

  return jsonb_build_object(
    'found', true,
    'partners_by_status', coalesce((
      select jsonb_object_agg(s.status, s.n)
      from (select status, count(*) as n from public.csp_partner_profiles group by status) s
    ), '{}'::jsonb),
    'partners_total', (select count(*) from public.csp_partner_profiles),
    'certified_partners', (
      select count(distinct partner_id) from public.csp_product_certifications where status = 'passed'
    ),
    'qualified_sales_total', (select count(*) from public.csp_qualified_sales),
    'products_total', (select count(*) from public.csp_sales_products),
    'products_published', (select count(*) from public.csp_sales_products where published),
    'open_settlements', jsonb_build_object(
      'count', (select count(*) from public.csp_monthly_settlements where status = 'open'),
      'by_currency', coalesce((
        select jsonb_object_agg(s.currency, s.total)
        from (
          select currency, sum(total_amount) as total
          from public.csp_monthly_settlements
          where status = 'open'
          group by currency
        ) s
      ), '{}'::jsonb)
    ),
    'unpaid_settlements_count', (
      select count(*) from public.csp_monthly_settlements where status in ('open','approved','closed')
    ),
    'partners', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id,
        'status', p.status,
        'display_name', p.display_name,
        'country', p.country,
        'created_at', p.created_at
      ) order by p.created_at desc)
      from public.csp_partner_profiles p
    ), '[]'::jsonb),
    'products', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', sp.id,
        'product_key', sp.product_key,
        'title', sp.product_key,
        'currency', sp.currency,
        'fixed_commission_amount', sp.fixed_commission_amount,
        'published', sp.published
      ) order by sp.product_key)
      from public.csp_sales_products sp
    ), '[]'::jsonb),
    'academy', jsonb_build_object(
      'attempts_total', (select count(*) from public.csp_academy_attempts),
      'attempts_passed', (select count(*) from public.csp_academy_attempts where passed),
      'attempts_failed', (select count(*) from public.csp_academy_attempts where not passed),
      'certifications_active', (
        select count(*) from public.csp_product_certifications where status = 'passed'
      )
    )
  );
end;
$$;

revoke all on function public.csp_get_platform_overview() from public, anon, authenticated, service_role;
grant execute on function public.csp_get_platform_overview() to authenticated;

commit;

-- Verify after apply (read-only):
-- select course_key, published, (select count(*) from csp_academy_questions q where q.course_id=c.id) as q
--   from csp_academy_courses c where course_key='kompis_web_v1';
-- select position, answer_key from csp_academy_questions
--   where course_id=(select id from csp_academy_courses where course_key='kompis_web_v1')
--   order by position;
