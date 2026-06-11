-- Phase 46 — Adaptive Working Style Engine (AWSE)

-- ---------------------------------------------------------------------------
-- 1. aipify_user_working_preferences
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_user_working_preferences (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  working_profile text not null default 'custom' check (
    working_profile in ('executive', 'operations', 'support', 'sales', 'focus', 'custom')
  ),
  detail_level text not null default 'standard' check (
    detail_level in ('compact', 'standard', 'detailed')
  ),
  reminder_frequency text not null default 'balanced' check (
    reminder_frequency in ('minimal', 'balanced', 'proactive', 'highly_proactive')
  ),
  preferred_summary_time text not null default 'morning' check (
    preferred_summary_time in ('morning', 'midday', 'evening', 'none')
  ),
  preferred_notification_categories_json jsonb not null default '{
    "email": true,
    "task": true,
    "meeting": true,
    "support": true,
    "sales": true,
    "relationship": true
  }'::jsonb,
  preferred_dashboard_layout_json jsonb not null default '{"widgets": [], "layout": "default"}'::jsonb,
  focus_mode_enabled boolean not null default false,
  adaptive_learning_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index if not exists aipify_user_working_preferences_tenant_idx
  on public.aipify_user_working_preferences (tenant_id, user_id);

alter table public.aipify_user_working_preferences enable row level security;
revoke all on public.aipify_user_working_preferences from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_user_adaptation_signals
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_user_adaptation_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'recommendation_accepted', 'recommendation_rejected',
      'reminder_dismissed', 'reminder_completed',
      'detailed_view_selected', 'compact_view_selected',
      'summary_opened', 'suggestion_ignored'
    )
  ),
  signal_value text not null default '',
  source_module text not null default 'awse',
  created_at timestamptz not null default now()
);

create index if not exists aipify_user_adaptation_signals_user_idx
  on public.aipify_user_adaptation_signals (tenant_id, user_id, created_at desc);

alter table public.aipify_user_adaptation_signals enable row level security;
revoke all on public.aipify_user_adaptation_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aipify_department_working_style_templates (Enterprise)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_department_working_style_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  department_name text not null,
  working_profile text not null default 'custom' check (
    working_profile in ('executive', 'operations', 'support', 'sales', 'focus', 'custom')
  ),
  detail_level text not null default 'standard' check (
    detail_level in ('compact', 'standard', 'detailed')
  ),
  reminder_frequency text not null default 'balanced' check (
    reminder_frequency in ('minimal', 'balanced', 'proactive', 'highly_proactive')
  ),
  role_names_json jsonb not null default '[]'::jsonb,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, department_name)
);

alter table public.aipify_department_working_style_templates enable row level security;
revoke all on public.aipify_department_working_style_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._awse_auth_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.id from public.users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._awse_package_caps(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_plan text;
begin
  select coalesce(s.plan_key, s.plan_type, 'starter') into v_plan
  from public.subscriptions s
  where s.customer_id = p_tenant_id
  limit 1;

  return jsonb_build_object(
    'plan_key', v_plan,
    'manual_preferences_only', v_plan in ('starter', 'growth'),
    'adaptive_learning_allowed', v_plan in ('business', 'enterprise'),
    'enterprise_templates', v_plan = 'enterprise',
    'user_profiles', v_plan in ('business', 'enterprise'),
    'daily_summary_customization', v_plan in ('business', 'enterprise')
  );
end;
$$;

create or replace function public.ensure_awse_user_preferences(
  p_tenant_id uuid,
  p_user_id uuid
)
returns public.aipify_user_working_preferences
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.aipify_user_working_preferences;
begin
  insert into public.aipify_user_working_preferences (tenant_id, user_id)
  values (p_tenant_id, p_user_id)
  on conflict (tenant_id, user_id) do nothing;

  select * into v_row
  from public.aipify_user_working_preferences
  where tenant_id = p_tenant_id and user_id = p_user_id;

  return v_row;
end;
$$;

create or replace function public._awse_adaptation_suggestion(p_tenant_id uuid, p_user_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_compact integer;
  v_detailed integer;
  v_dismissed integer;
  v_completed integer;
begin
  select count(*) into v_compact
  from public.aipify_user_adaptation_signals s
  where s.tenant_id = p_tenant_id and s.user_id = p_user_id
    and s.signal_type = 'compact_view_selected'
    and s.created_at > now() - interval '30 days';

  select count(*) into v_detailed
  from public.aipify_user_adaptation_signals s
  where s.tenant_id = p_tenant_id and s.user_id = p_user_id
    and s.signal_type = 'detailed_view_selected'
    and s.created_at > now() - interval '30 days';

  select count(*) into v_dismissed
  from public.aipify_user_adaptation_signals s
  where s.tenant_id = p_tenant_id and s.user_id = p_user_id
    and s.signal_type = 'reminder_dismissed'
    and s.created_at > now() - interval '30 days';

  select count(*) into v_completed
  from public.aipify_user_adaptation_signals s
  where s.tenant_id = p_tenant_id and s.user_id = p_user_id
    and s.signal_type = 'reminder_completed'
    and s.created_at > now() - interval '30 days';

  if v_compact >= 3 and v_compact > v_detailed then
    return 'I''ve noticed you often prefer concise summaries. Would you like me to make compact summaries your default format?';
  end if;
  if v_detailed >= 3 and v_detailed > v_compact then
    return 'I''ve noticed you often request more explanation. Would you like me to make detailed summaries your default format?';
  end if;
  if v_dismissed >= 3 and v_dismissed > v_completed then
    return 'I''ve noticed reminders may feel frequent. Would you like me to reduce reminder frequency?';
  end if;
  if v_completed >= 3 and v_completed > v_dismissed then
    return 'I''ve noticed you appreciate follow-up support. Would you like me to increase reminder frequency?';
  end if;

  return null;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. get_customer_working_style_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_working_style_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_prefs public.aipify_user_working_preferences;
  v_caps jsonb;
  v_templates jsonb := '[]'::jsonb;
  v_note text;
  v_suggestion text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_user_id := public._awse_auth_user_id();
  if v_user_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_prefs := public.ensure_awse_user_preferences(v_tenant_id, v_user_id);
  v_caps := public._awse_package_caps(v_tenant_id);

  if (v_caps->>'adaptive_learning_allowed')::boolean is not true then
    update public.aipify_user_working_preferences
    set adaptive_learning_enabled = false, updated_at = now()
    where tenant_id = v_tenant_id and user_id = v_user_id and adaptive_learning_enabled = true;
    select * into v_prefs from public.aipify_user_working_preferences
    where tenant_id = v_tenant_id and user_id = v_user_id;
  end if;

  if (v_caps->>'enterprise_templates')::boolean then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', t.id,
      'department_name', t.department_name,
      'working_profile', t.working_profile,
      'detail_level', t.detail_level,
      'reminder_frequency', t.reminder_frequency,
      'role_names', t.role_names_json,
      'is_default', t.is_default
    ) order by t.department_name), '[]'::jsonb) into v_templates
    from public.aipify_department_working_style_templates t
    where t.tenant_id = v_tenant_id;
  end if;

  v_note := format(
    'Your working profile is %s with %s detail and %s reminders. You can change or disable adaptation anytime.',
    v_prefs.working_profile, v_prefs.detail_level, v_prefs.reminder_frequency
  );

  if v_prefs.adaptive_learning_enabled then
    v_suggestion := public._awse_adaptation_suggestion(v_tenant_id, v_user_id);
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'capabilities', v_caps,
    'preferences', jsonb_build_object(
      'id', v_prefs.id,
      'tenant_id', v_prefs.tenant_id,
      'user_id', v_prefs.user_id,
      'working_profile', v_prefs.working_profile,
      'detail_level', v_prefs.detail_level,
      'reminder_frequency', v_prefs.reminder_frequency,
      'preferred_summary_time', v_prefs.preferred_summary_time,
      'preferred_notification_categories', v_prefs.preferred_notification_categories_json,
      'preferred_dashboard_layout', v_prefs.preferred_dashboard_layout_json,
      'focus_mode_enabled', v_prefs.focus_mode_enabled,
      'adaptive_learning_enabled', v_prefs.adaptive_learning_enabled,
      'created_at', v_prefs.created_at,
      'updated_at', v_prefs.updated_at
    ),
    'signals', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', s.id,
        'signal_type', s.signal_type,
        'signal_value', s.signal_value,
        'source_module', s.source_module,
        'created_at', s.created_at
      ) order by s.created_at desc), '[]'::jsonb)
      from (
        select * from public.aipify_user_adaptation_signals
        where tenant_id = v_tenant_id and user_id = v_user_id
        order by created_at desc
        limit 20
      ) s
    ),
    'department_templates', v_templates,
    'transparency_note', v_note,
    'adaptation_suggestion', v_suggestion
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. update_customer_working_preferences
-- ---------------------------------------------------------------------------
create or replace function public.update_customer_working_preferences(
  p_working_profile text default null,
  p_detail_level text default null,
  p_reminder_frequency text default null,
  p_preferred_summary_time text default null,
  p_preferred_notification_categories jsonb default null,
  p_preferred_dashboard_layout jsonb default null,
  p_focus_mode_enabled boolean default null,
  p_adaptive_learning_enabled boolean default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_caps jsonb;
  v_adaptive boolean;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_user_id := public._awse_auth_user_id();
  if v_tenant_id is null or v_user_id is null then
    raise exception 'Not authorized';
  end if;

  perform public.ensure_awse_user_preferences(v_tenant_id, v_user_id);
  v_caps := public._awse_package_caps(v_tenant_id);

  v_adaptive := coalesce(p_adaptive_learning_enabled, false);
  if (v_caps->>'adaptive_learning_allowed')::boolean is not true then
    v_adaptive := false;
  end if;

  update public.aipify_user_working_preferences
  set
    working_profile = coalesce(p_working_profile, working_profile),
    detail_level = coalesce(p_detail_level, detail_level),
    reminder_frequency = coalesce(p_reminder_frequency, reminder_frequency),
    preferred_summary_time = coalesce(p_preferred_summary_time, preferred_summary_time),
    preferred_notification_categories_json = coalesce(
      p_preferred_notification_categories, preferred_notification_categories_json
    ),
    preferred_dashboard_layout_json = coalesce(
      p_preferred_dashboard_layout, preferred_dashboard_layout_json
    ),
    focus_mode_enabled = coalesce(p_focus_mode_enabled, focus_mode_enabled),
    adaptive_learning_enabled = v_adaptive,
    updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. reset_customer_working_preferences
-- ---------------------------------------------------------------------------
create or replace function public.reset_customer_working_preferences()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_user_id := public._awse_auth_user_id();
  if v_tenant_id is null or v_user_id is null then
    raise exception 'Not authorized';
  end if;

  update public.aipify_user_working_preferences
  set
    working_profile = 'custom',
    detail_level = 'standard',
    reminder_frequency = 'balanced',
    preferred_summary_time = 'morning',
    preferred_notification_categories_json = '{
      "email": true, "task": true, "meeting": true,
      "support": true, "sales": true, "relationship": true
    }'::jsonb,
    preferred_dashboard_layout_json = '{"widgets": [], "layout": "default"}'::jsonb,
    focus_mode_enabled = false,
    adaptive_learning_enabled = false,
    updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id;

  return jsonb_build_object('reset', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. record_awse_adaptation_signal
-- ---------------------------------------------------------------------------
create or replace function public.record_awse_adaptation_signal(
  p_signal_type text,
  p_signal_value text default '',
  p_source_module text default 'awse'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_prefs public.aipify_user_working_preferences;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_user_id := public._awse_auth_user_id();
  if v_tenant_id is null or v_user_id is null then
    raise exception 'Not authorized';
  end if;

  v_prefs := public.ensure_awse_user_preferences(v_tenant_id, v_user_id);
  if not v_prefs.adaptive_learning_enabled then
    return null;
  end if;

  insert into public.aipify_user_adaptation_signals (
    tenant_id, user_id, signal_type, signal_value, source_module
  )
  values (v_tenant_id, v_user_id, p_signal_type, coalesce(p_signal_value, ''), coalesce(p_source_module, 'awse'))
  returning id into v_id;

  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Enterprise department templates
-- ---------------------------------------------------------------------------
create or replace function public.upsert_awse_department_template(
  p_department_name text,
  p_working_profile text default 'custom',
  p_detail_level text default 'standard',
  p_reminder_frequency text default 'balanced',
  p_role_names jsonb default '[]'::jsonb,
  p_is_default boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_caps jsonb;
  v_id uuid;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  v_caps := public._awse_package_caps(v_tenant_id);

  if (v_caps->>'enterprise_templates')::boolean is not true then
    raise exception 'Enterprise plan required';
  end if;

  if p_is_default then
    update public.aipify_department_working_style_templates
    set is_default = false, updated_at = now()
    where tenant_id = v_tenant_id;
  end if;

  insert into public.aipify_department_working_style_templates (
    tenant_id, department_name, working_profile, detail_level,
    reminder_frequency, role_names_json, is_default
  )
  values (
    v_tenant_id, p_department_name, p_working_profile, p_detail_level,
    p_reminder_frequency, coalesce(p_role_names, '[]'::jsonb), coalesce(p_is_default, false)
  )
  on conflict (tenant_id, department_name) do update set
    working_profile = excluded.working_profile,
    detail_level = excluded.detail_level,
    reminder_frequency = excluded.reminder_frequency,
    role_names_json = excluded.role_names_json,
    is_default = excluded.is_default,
    updated_at = now()
  returning id into v_id;

  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_customer_working_style_center() to authenticated;
grant execute on function public.update_customer_working_preferences(
  text, text, text, text, jsonb, jsonb, boolean, boolean
) to authenticated;
grant execute on function public.reset_customer_working_preferences() to authenticated;
grant execute on function public.record_awse_adaptation_signal(text, text, text) to authenticated;
grant execute on function public.upsert_awse_department_template(
  text, text, text, text, jsonb, boolean
) to authenticated;
