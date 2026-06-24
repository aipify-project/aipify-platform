-- GET notification preferences: any authenticated tenant member may read (match inbox feed).
-- Regression: settings.view gate blocked staff from reading prefs while inbox worked.
-- Feature owner: CUSTOMER APP

create or replace function public.get_presence_notification_preferences()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_prefs public.presence_notification_preferences;
  v_personality public.personality_settings;
  v_prefs_json jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_prefs := public._presence_read_notification_preferences(v_tenant_id);
  v_prefs_json := to_jsonb(v_prefs);

  select * into v_personality
  from public.personality_settings
  where tenant_id = v_tenant_id;

  v_prefs_json := v_prefs_json || jsonb_build_object(
    'playful_moments_enabled', coalesce(v_personality.playful_moments_enabled, true)
  );

  return jsonb_build_object(
    'has_customer', true,
    'preferences', v_prefs_json
  );
end;
$$;

grant execute on function public.get_presence_notification_preferences() to authenticated;
