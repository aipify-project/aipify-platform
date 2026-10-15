-- ACL / behavior matrix. Assumes fixture + NOT_APPLIED RPCs already applied.
\set ON_ERROR_STOP on

create temporary table if not exists _matrix_results (
  case_id text primary key,
  expected text not null,
  actual text not null,
  pass boolean not null
);

create or replace function pg_temp.record_case(p_id text, p_expected text, p_actual text)
returns void
language plpgsql
as $$
begin
  insert into _matrix_results(case_id, expected, actual, pass)
  values (p_id, p_expected, p_actual, p_expected = p_actual)
  on conflict (case_id) do update
    set expected = excluded.expected,
        actual = excluded.actual,
        pass = excluded.pass;
end;
$$;

create or replace function pg_temp.as_user(p_uid text)
returns void
language plpgsql
as $$
begin
  -- Only impersonate auth.uid(); stay as session owner so temp matrix table is writable.
  -- SECURITY DEFINER RPCs still enforce _ppsf258_require_platform_access via auth.uid().
  perform set_config('request.jwt.claim.sub', coalesce(p_uid, ''), true);
end;
$$;

-- 1) super_admin list sees both orgs, not platform company tickets (none), total >= 2
do $$
declare
  v jsonb;
  v_total int;
  v_ids text;
begin
  perform pg_temp.as_user('51111111-1111-1111-1111-111111111111');
  v := public.list_platform_app_portal_support_requests();
  v_total := (v->'pagination'->>'total')::int;
  v_ids := coalesce((select string_agg(x->>'id', ',') from jsonb_array_elements(v->'items') x), '');
  perform pg_temp.record_case(
    'super_admin_list_total_ge_2',
    'pass',
    case when v_total >= 2 and (v->>'ok')::boolean then 'pass' else 'fail:' || v_total::text end
  );
  perform pg_temp.record_case(
    'super_admin_list_has_both_orgs',
    'pass',
    case
      when v_ids like '%a1111111-1111-1111-1111-111111111111%'
       and v_ids like '%b2222222-2222-2222-2222-222222222222%'
      then 'pass' else 'fail:' || v_ids
    end
  );
  perform pg_temp.record_case(
    'list_has_no_source_locale_invented',
    'pass',
    case
      when exists (
        select 1 from jsonb_array_elements(v->'items') x
        where x ? 'source_locale' and x->>'source_locale' is not null
      ) then 'fail'
      else 'pass'
    end
  );
  perform pg_temp.record_case(
    'list_description_is_preview_only',
    'pass',
    case
      when exists (
        select 1 from jsonb_array_elements(v->'items') x where x ? 'description'
      ) then 'fail'
      when exists (
        select 1 from jsonb_array_elements(v->'items') x where x ? 'description_preview'
      ) then 'pass'
      else 'fail'
    end
  );
end $$;

-- 2) platform_support can list
do $$
declare v jsonb;
begin
  perform pg_temp.as_user('52111111-1111-1111-1111-111111111111');
  v := public.list_platform_app_portal_support_requests();
  perform pg_temp.record_case(
    'platform_support_list_ok',
    'pass',
    case when (v->>'ok')::boolean then 'pass' else 'fail' end
  );
end $$;

-- 3) inactive admin denied
do $$
declare
  v_err text := 'none';
begin
  perform pg_temp.as_user('53111111-1111-1111-1111-111111111111');
  begin
    perform public.list_platform_app_portal_support_requests();
  exception when others then
    v_err := sqlerrm;
  end;
  perform pg_temp.record_case(
    'inactive_admin_denied',
    'pass',
    case when v_err = 'Platform portal access denied' then 'pass' else 'fail:' || v_err end
  );
end $$;

-- 4) ordinary APP member denied
do $$
declare v_err text := 'none';
begin
  perform pg_temp.as_user('54111111-1111-1111-1111-111111111111');
  begin
    perform public.list_platform_app_portal_support_requests();
  exception when others then
    v_err := sqlerrm;
  end;
  perform pg_temp.record_case(
    'app_member_denied',
    'pass',
    case when v_err = 'Platform portal access denied' then 'pass' else 'fail:' || v_err end
  );
end $$;

-- 5) anon cannot execute (no grant) — simulate by resetting role and revoking path
do $$
declare v_err text := 'none';
begin
  perform set_config('request.jwt.claim.sub', '', true);
  begin
    -- Call as postgres without auth.uid platform row should also deny
    perform public.list_platform_app_portal_support_requests();
  exception when others then
    v_err := sqlerrm;
  end;
  perform pg_temp.record_case(
    'no_auth_uid_denied',
    'pass',
    case when v_err = 'Platform portal access denied' then 'pass' else 'fail:' || v_err end
  );
end $$;

-- 6) get by id + timeline
do $$
declare v jsonb;
begin
  perform pg_temp.as_user('51111111-1111-1111-1111-111111111111');
  v := public.get_platform_app_portal_support_request('a1111111-1111-1111-1111-111111111111'::uuid);
  perform pg_temp.record_case(
    'get_found_with_timeline',
    'pass',
    case
      when (v->>'found')::boolean
       and (v->'item'->>'title') = 'Alpha billing question'
       and jsonb_array_length(v->'timeline') >= 1
       and (v->'item'->>'internal_notes') is not null
      then 'pass' else 'fail:' || coalesce(v::text, 'null')
    end
  );
end $$;

-- 7) get missing id → not_found (not exception)
do $$
declare v jsonb;
begin
  perform pg_temp.as_user('51111111-1111-1111-1111-111111111111');
  v := public.get_platform_app_portal_support_request('ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid);
  perform pg_temp.record_case(
    'get_missing_not_found',
    'pass',
    case when (v->>'found') = 'false' and (v->>'error') = 'not_found' then 'pass' else 'fail' end
  );
end $$;

-- 8) filter by company + channel + pagination
do $$
declare v jsonb;
begin
  perform pg_temp.as_user('52111111-1111-1111-1111-111111111111');
  v := public.list_platform_app_portal_support_requests(
    null, 'chat', null, null,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    null, null, null, null, 1, 1
  );
  perform pg_temp.record_case(
    'filter_channel_company_page_size',
    'pass',
    case
      when (v->'pagination'->>'page_size')::int = 1
       and jsonb_array_length(v->'items') = 1
       and (v->'items'->0->>'channel') = 'chat'
      then 'pass' else 'fail:' || coalesce(v::text,'null')
    end
  );
end $$;

-- 9) counts from APP SoT only
do $$
declare v jsonb;
begin
  perform pg_temp.as_user('51111111-1111-1111-1111-111111111111');
  v := public.get_platform_app_portal_support_request_counts();
  perform pg_temp.record_case(
    'counts_ok_source',
    'pass',
    case
      when (v->>'source') = 'app_portal_support_requests'
       and (v->'counts'->>'total')::int >= 3
      then 'pass' else 'fail'
    end
  );
end $$;

-- 10) invalid page_size clamped to <= 50
do $$
declare v jsonb;
begin
  perform pg_temp.as_user('51111111-1111-1111-1111-111111111111');
  v := public.list_platform_app_portal_support_requests(
    null,null,null,null,null,null,null,null,null,1,999
  );
  perform pg_temp.record_case(
    'page_size_clamped_50',
    'pass',
    case when (v->'pagination'->>'page_size')::int = 50 then 'pass' else 'fail' end
  );
end $$;

-- 11) idempotent re-apply marker (counts still work)
do $$
declare v jsonb;
begin
  perform pg_temp.as_user('51111111-1111-1111-1111-111111111111');
  v := public.get_platform_app_portal_support_request_counts();
  perform pg_temp.record_case(
    'idempotent_counts_still_ok',
    'pass',
    case when (v->>'ok')::boolean then 'pass' else 'fail' end
  );
end $$;

\echo '=== MATRIX RESULTS ==='
select case_id, expected, actual, pass from _matrix_results order by case_id;

\echo '=== SUMMARY ==='
select
  count(*) filter (where pass) as passed,
  count(*) filter (where not pass) as failed,
  count(*) as total
from _matrix_results;
