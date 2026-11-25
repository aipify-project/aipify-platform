-- =============================================================================
-- PREPARED ONLY — DO NOT APPLY without exact owner approval naming this file.
-- Date: 2026-11-25
-- Target order: Staging auedugihkduoaikfusqe FIRST, then separately approved Production
--               qbcqoixhrvhnuwphefvw. Never apply Production before Staging readback.
-- Depends on: 20261941000000 + 20261941100000 (already applied)
-- Purpose: Close partner-session answer-key leak on public.csp_get_academy_answer_key.
--   1) Replace body so the RPC never returns answer keys (defense in depth).
--   2) REVOKE EXECUTE from public, anon, authenticated, and service_role.
--   3) Do NOT GRANT EXECUTE to authenticated (or any browser-reachable role).
-- Scoring remains: app server-only answer key + csp_record_academy_attempt recompute.
-- Does NOT seed questions, does NOT publish kompis_web_v1, does NOT touch Stripe.
-- Run this BEFORE any Academy bank / publish candidate.
-- =============================================================================

begin;

create or replace function public.csp_get_academy_answer_key(p_course_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  -- Retired partner path. Answer keys must never leave Core via this RPC.
  -- p_course_id retained for signature compatibility with 19411 callers.
  perform public._csp_audit(
    auth.uid(),
    'security',
    'csp_academy_answer_key_rpc_denied',
    'csp_academy_courses',
    p_course_id,
    jsonb_build_object('reason', 'answer_key_rpc_retired')
  );
  return jsonb_build_object('found', false, 'error', 'forbidden');
exception
  when others then
    -- Fail closed even if audit helper is unavailable in a partial environment.
    return jsonb_build_object('found', false, 'error', 'forbidden');
end;
$$;

revoke all on function public.csp_get_academy_answer_key(uuid)
  from public, anon, authenticated, service_role;

-- Explicitly no GRANT to authenticated / anon / public / service_role.

comment on function public.csp_get_academy_answer_key(uuid) is
  'RETIRED. Always returns forbidden. Answer keys are not exposed via RPC; exam scoring uses csp_record_academy_attempt plus server-only app keys.';

commit;

-- Readback after apply (read-only):
-- select has_function_privilege('anon','public.csp_get_academy_answer_key(uuid)','execute') as anon_exec,
--        has_function_privilege('authenticated','public.csp_get_academy_answer_key(uuid)','execute') as auth_exec,
--        has_function_privilege('service_role','public.csp_get_academy_answer_key(uuid)','execute') as service_exec;
-- Expected: all false.
-- select public.csp_get_academy_answer_key('00000000-0000-0000-0000-000000000000'::uuid);
-- Expected when callable as postgres: {"found":false,"error":"forbidden"} with no answer_key.
