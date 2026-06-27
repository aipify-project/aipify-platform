-- P1.13G — Harden assign_support_case assignee membership at execution.
-- Feature owner: CUSTOMER APP. Defense-in-depth aligned with record_companion_support_action_request.

create or replace function public.assign_support_case(p_case_id uuid, p_user_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('support.assign');
  v_org_id := public._mta_require_organization();

  if public._mta_membership_active(v_org_id, p_user_id) is null then
    raise exception 'Invalid assignee';
  end if;

  update public.organization_support_cases set assigned_to = p_user_id, updated_at = now()
  where id = p_case_id and organization_id = v_org_id;
  perform public._sai_log(v_org_id, 'support_case_assigned', 'support_case', p_case_id,
    jsonb_build_object('assigned_to', p_user_id), false);
  return jsonb_build_object('case_id', p_case_id, 'assigned_to', p_user_id);
end; $$;
