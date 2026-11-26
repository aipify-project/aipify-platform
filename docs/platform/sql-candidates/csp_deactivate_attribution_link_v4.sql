-- PREPARED_ONLY — do not apply until owner approval.
-- AIPIFY CSP: partner self-service deactivate for own attribution links (V4).
-- Idempotent: re-deactivating an inactive own link returns changed=false.
-- Never deletes history; only sets active=false and audits.

create or replace function public.csp_deactivate_attribution_link(p_code text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_partner public.csp_partner_profiles%rowtype;
  v_link public.csp_attribution_links%rowtype;
  v_code text := lower(btrim(coalesce(p_code, '')));
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;
  if v_code = '' then
    return jsonb_build_object('found', false, 'error', 'link_code_required');
  end if;

  select * into v_partner from public.csp_partner_profiles where auth_user_id = v_uid;
  if not found then
    return jsonb_build_object('found', false, 'error', 'partner_not_found');
  end if;
  if v_partner.status not in ('approved', 'active', 'certified', 'in_academy') then
    return jsonb_build_object('found', false, 'error', 'partner_not_active');
  end if;

  select * into v_link
  from public.csp_attribution_links
  where code = v_code
  for update;
  if not found then
    return jsonb_build_object('found', false, 'error', 'link_not_found');
  end if;
  if v_link.partner_id <> v_partner.id then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  if not v_link.active then
    return jsonb_build_object(
      'found', true,
      'changed', false,
      'link_id', v_link.id,
      'code', v_link.code,
      'active', false
    );
  end if;

  update public.csp_attribution_links
  set active = false
  where id = v_link.id;

  perform public._csp_audit(
    v_uid,
    'partner',
    'attribution_link_deactivated',
    'csp_attribution_links',
    v_link.id,
    jsonb_build_object('code', v_link.code, 'channel', v_link.channel_origin)
  );

  return jsonb_build_object(
    'found', true,
    'changed', true,
    'link_id', v_link.id,
    'code', v_link.code,
    'active', false
  );
end;
$$;

revoke all on function public.csp_deactivate_attribution_link(text) from public, anon, authenticated, service_role;
grant execute on function public.csp_deactivate_attribution_link(text) to authenticated;
