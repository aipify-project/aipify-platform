-- AIPIFY.CORE.APP.PRODUCTION.EXPERIENCE.V2
-- Read-only enrichment of Kompis conversation list for meaningful history titles.
-- Side effects: 0 (no customer data writes, no approval/CMS changes).

create or replace function public.list_app_kompis_operator_conversations(p_limit int default 20)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_limit int := greatest(1, least(coalesce(p_limit, 20), 50));
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', c.id,
      'title', c.title,
      'locale', c.locale,
      'status', c.status,
      'created_at', c.created_at,
      'updated_at', c.updated_at,
      'latest_request_text', lr.request_text,
      'latest_result_summary', lr.result_summary,
      'latest_status', lr.status,
      'latest_approval_status', lr.approval_status,
      'latest_tool_key', ls.tool_key
    ) order by c.updated_at desc)
    from (
      select * from public.kompis_operator_conversations
      where organization_id = v_org
      order by updated_at desc
      limit v_limit
    ) c
    left join lateral (
      select r.request_text, r.result_summary, r.status, r.approval_status, r.id
      from public.kompis_operator_runs r
      where r.conversation_id = c.id
        and r.organization_id = v_org
      order by r.created_at desc nulls last, r.id desc
      limit 1
    ) lr on true
    left join lateral (
      select s.tool_key
      from public.kompis_operator_steps s
      where s.run_id = lr.id
      order by s.sequence asc nulls last, s.id asc
      limit 1
    ) ls on true
  ), '[]'::jsonb);
end;
$$;

revoke all on function public.list_app_kompis_operator_conversations(int) from public, anon;
grant execute on function public.list_app_kompis_operator_conversations(int) to authenticated;
