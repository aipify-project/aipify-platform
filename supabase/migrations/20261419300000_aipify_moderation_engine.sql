-- Aipify Moderation — Image Approval & Content Review Engine
-- Multi-tenant content moderation with human-in-the-loop. Unonight is first pilot.
-- Helpers: _amod_*

-- ---------------------------------------------------------------------------
-- 1. moderation_settings
-- ---------------------------------------------------------------------------
create table if not exists public.moderation_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  suggest_only_mode boolean not null default true,
  auto_approve_enabled boolean not null default false,
  auto_reject_enabled boolean not null default true,
  auto_approve_threshold integer not null default 90 check (auto_approve_threshold between 50 and 100),
  auto_reject_threshold integer not null default 90 check (auto_reject_threshold between 50 and 100),
  manual_review_threshold integer not null default 50 check (manual_review_threshold between 0 and 89),
  profile_image_priority boolean not null default true,
  enabled_source_types jsonb not null default '[
    "profile_image", "album_image", "chat_attachment", "marketplace_image",
    "verification_image", "support_attachment", "product_image"
  ]'::jsonb,
  privacy_settings jsonb not null default '{
    "log_image_views": true,
    "mask_rejected_previews": true,
    "retention_days": 90
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.moderation_settings enable row level security;
revoke all on public.moderation_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. moderation_policies (versioned per tenant)
-- ---------------------------------------------------------------------------
create table if not exists public.moderation_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  policy_key text not null default 'default',
  version integer not null default 1,
  label text not null default 'Default moderation policy',
  platform_profile text not null default 'community' check (
    platform_profile in ('membership', 'dating', 'marketplace', 'social', 'commerce', 'forum', 'creator', 'support', 'custom')
  ),
  rules jsonb not null default '{
    "adult_content_allowed": false,
    "adult_in_profile_allowed": false,
    "adult_in_private_album_allowed": true,
    "product_images_only": false,
    "watermarks_allowed": true,
    "hate_symbols_forbidden": true,
    "spam_forbidden": true,
    "explicit_profile_forbidden": true
  }'::jsonb,
  source_type_rules jsonb not null default '{}'::jsonb,
  critical_stop_categories jsonb not null default '[
    "possible_minor", "child_content", "bestiality", "sexualized_violence",
    "severe_violence", "illegal_content", "hate_symbols", "self_harm",
    "non_consensual", "stolen_identity", "deepfake_intimate"
  ]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, policy_key, version)
);

create index if not exists moderation_policies_tenant_active_idx
  on public.moderation_policies (tenant_id, active, version desc);

alter table public.moderation_policies enable row level security;
revoke all on public.moderation_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. moderation_results
-- ---------------------------------------------------------------------------
create table if not exists public.moderation_results (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  source_system text not null default 'aipify',
  source_type text not null check (
    source_type in (
      'profile_image', 'album_image', 'chat_attachment', 'marketplace_image',
      'verification_image', 'support_attachment', 'product_image'
    )
  ),
  source_id text,
  user_id uuid references public.users (id) on delete set null,
  image_url text not null,
  decision text not null check (
    decision in ('auto_approve', 'manual_review', 'auto_reject')
  ),
  confidence integer not null default 0 check (confidence between 0 and 100),
  categories jsonb not null default '[]'::jsonb,
  risk_flags jsonb not null default '[]'::jsonb,
  policy_version integer not null default 1,
  reason_summary text not null default '',
  suggested_action text check (
    suggested_action is null or suggested_action in (
      'approve', 'reject', 'request_new_upload', 'escalate', 'blur', 'age_gate', 'move_to_adult_area'
    )
  ),
  is_high_risk boolean not null default false,
  is_reported boolean not null default false,
  priority text not null default 'normal' check (
    priority in ('low', 'normal', 'high', 'critical')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'escalated', 'superseded')
  ),
  reviewed_by uuid references public.users (id) on delete set null,
  reviewed_at timestamptz,
  final_decision text check (
    final_decision is null or final_decision in ('approve', 'reject', 'request_new_upload', 'escalate', 'blur', 'age_gate', 'move_to_adult_area')
  ),
  review_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint moderation_results_reason_len check (char_length(reason_summary) <= 500)
);

create index if not exists moderation_results_tenant_status_idx
  on public.moderation_results (tenant_id, status, decision, created_at desc);

create index if not exists moderation_results_tenant_queue_idx
  on public.moderation_results (tenant_id, is_high_risk, is_reported, priority, created_at desc);

create index if not exists moderation_results_source_idx
  on public.moderation_results (tenant_id, source_type, source_id);

alter table public.moderation_results enable row level security;
revoke all on public.moderation_results from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. moderation_override_logs
-- ---------------------------------------------------------------------------
create table if not exists public.moderation_override_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  result_id uuid not null references public.moderation_results (id) on delete cascade,
  admin_id uuid references public.users (id) on delete set null,
  previous_decision text not null,
  new_decision text not null,
  previous_final_decision text,
  new_final_decision text,
  reason text not null default '',
  created_at timestamptz not null default now(),
  constraint moderation_override_reason_len check (char_length(reason) <= 500)
);

create index if not exists moderation_override_logs_tenant_idx
  on public.moderation_override_logs (tenant_id, created_at desc);

alter table public.moderation_override_logs enable row level security;
revoke all on public.moderation_override_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. moderation_access_logs (who viewed/handled sensitive content)
-- ---------------------------------------------------------------------------
create table if not exists public.moderation_access_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  result_id uuid references public.moderation_results (id) on delete set null,
  admin_id uuid references public.users (id) on delete set null,
  action_type text not null check (
    action_type in ('view', 'review', 'override', 'export', 'delete')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists moderation_access_logs_tenant_idx
  on public.moderation_access_logs (tenant_id, result_id, created_at desc);

alter table public.moderation_access_logs enable row level security;
revoke all on public.moderation_access_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'moderation_ai', v.description
from (values
  ('moderation.view', 'View Moderation Queue', 'View Aipify Moderation queue and history'),
  ('moderation.review', 'Review Moderated Content', 'Approve, reject, or escalate moderated images'),
  ('moderation.manage', 'Manage Moderation Settings', 'Configure moderation thresholds and modes'),
  ('moderation.policy', 'Manage Moderation Policy', 'Update tenant moderation policies')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 7. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._amod_tenant()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
begin
  return public._presence_tenant_for_auth();
end;
$$;

create or replace function public._amod_require_moderator()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public._bde_require_admin();
end;
$$;

create or replace function public._amod_record_access(
  p_tenant_id uuid,
  p_result_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_admin uuid;
begin
  select id into v_admin from public.users where auth_user_id = auth.uid() limit 1;
  insert into public.moderation_access_logs (tenant_id, result_id, admin_id, action_type, metadata)
  values (p_tenant_id, p_result_id, v_admin, p_action_type, p_metadata)
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.ensure_moderation_settings(p_tenant_id uuid)
returns public.moderation_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.moderation_settings;
begin
  insert into public.moderation_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  if not exists (
    select 1 from public.moderation_policies where tenant_id = p_tenant_id and active
  ) then
    insert into public.moderation_policies (
      tenant_id, policy_key, version, label, platform_profile, rules, source_type_rules
    )
    values (
      p_tenant_id,
      'default',
      1,
      'Default moderation policy',
      'membership',
      '{
        "adult_content_allowed": true,
        "adult_in_profile_allowed": false,
        "adult_in_private_album_allowed": true,
        "product_images_only": false,
        "watermarks_allowed": true,
        "hate_symbols_forbidden": true,
        "spam_forbidden": true,
        "explicit_profile_forbidden": true
      }'::jsonb,
      '{
        "profile_image": {"explicit_forbidden": true, "adult_forbidden": true},
        "album_image": {"adult_allowed_in_public": false},
        "verification_image": {"face_required": true},
        "marketplace_image": {"product_only": true}
      }'::jsonb
    );
  end if;

  select * into v_row from public.moderation_settings where tenant_id = p_tenant_id;
  return v_row;
end;
$$;

create or replace function public._amod_apply_suggest_only(
  p_settings public.moderation_settings,
  p_decision text,
  p_is_high_risk boolean,
  p_risk_flags jsonb
)
returns text
language plpgsql
immutable
as $$
begin
  if p_is_high_risk then
    return 'manual_review';
  end if;
  if coalesce(p_settings.suggest_only_mode, true) then
    if p_decision = 'auto_reject' and coalesce(p_settings.auto_reject_enabled, true) then
      return 'auto_reject';
    end if;
    return 'manual_review';
  end if;
  if p_decision = 'auto_approve' and not coalesce(p_settings.auto_approve_enabled, false) then
    return 'manual_review';
  end if;
  return p_decision;
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. submit_moderation_image
-- ---------------------------------------------------------------------------
create or replace function public.submit_moderation_image(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.moderation_settings;
  v_policy public.moderation_policies;
  v_decision text;
  v_confidence integer;
  v_categories jsonb;
  v_risk_flags jsonb;
  v_reason text;
  v_suggested text;
  v_is_high_risk boolean;
  v_priority text;
  v_status text;
  v_id uuid;
begin
  v_tenant_id := coalesce((p_payload->>'tenant_id')::uuid, public._amod_tenant());
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  if coalesce(p_payload->>'image_url', '') = '' then
    raise exception 'image_url is required';
  end if;

  v_settings := public.ensure_moderation_settings(v_tenant_id);

  select * into v_policy
  from public.moderation_policies
  where tenant_id = v_tenant_id and active
  order by version desc
  limit 1;

  v_decision := coalesce(nullif(p_payload->>'decision', ''), 'manual_review');
  v_confidence := coalesce((p_payload->>'confidence')::integer, 50);
  v_categories := coalesce(p_payload->'categories', '[]'::jsonb);
  v_risk_flags := coalesce(p_payload->'risk_flags', '[]'::jsonb);
  v_reason := left(coalesce(p_payload->>'reason_summary', 'Awaiting moderation review.'), 500);
  v_suggested := nullif(p_payload->>'suggested_action', '');
  v_is_high_risk := coalesce((p_payload->>'is_high_risk')::boolean, false);
  v_priority := coalesce(nullif(p_payload->>'priority', ''), 'normal');

  if exists (
    select 1
    from jsonb_array_elements_text(v_risk_flags) rf(flag)
    where rf.flag in (
      select jsonb_array_elements_text(v_policy.critical_stop_categories)
    )
  ) then
    v_is_high_risk := true;
    v_priority := 'critical';
    if v_confidence >= v_settings.auto_reject_threshold then
      v_decision := 'auto_reject';
      v_suggested := coalesce(v_suggested, 'reject');
    else
      v_decision := 'manual_review';
      v_suggested := coalesce(v_suggested, 'escalate');
    end if;
  end if;

  v_decision := public._amod_apply_suggest_only(v_settings, v_decision, v_is_high_risk, v_risk_flags);

  v_status := case
    when v_decision = 'auto_approve' then 'approved'
    when v_decision = 'auto_reject' then 'rejected'
    else 'pending'
  end;

  insert into public.moderation_results (
    tenant_id, source_system, source_type, source_id, user_id, image_url,
    decision, confidence, categories, risk_flags, policy_version,
    reason_summary, suggested_action, is_high_risk, is_reported, priority, status,
    final_decision, metadata
  )
  values (
    v_tenant_id,
    coalesce(nullif(p_payload->>'source_system', ''), 'aipify'),
    coalesce(nullif(p_payload->>'source_type', ''), 'profile_image'),
    nullif(p_payload->>'source_id', ''),
    nullif(p_payload->>'user_id', '')::uuid,
    p_payload->>'image_url',
    v_decision,
    v_confidence,
    v_categories,
    v_risk_flags,
    coalesce(v_policy.version, 1),
    v_reason,
    v_suggested,
    v_is_high_risk,
    coalesce((p_payload->>'is_reported')::boolean, false),
    v_priority,
    v_status,
    case when v_status in ('approved', 'rejected') then v_suggested else null end,
    coalesce(p_payload->'metadata', '{}'::jsonb)
  )
  returning id into v_id;

  return jsonb_build_object(
    'moderation_result_id', v_id,
    'decision', v_decision,
    'confidence', v_confidence,
    'categories', v_categories,
    'risk_flags', v_risk_flags,
    'reason_summary', v_reason,
    'suggested_action', v_suggested,
    'status', v_status,
    'is_high_risk', v_is_high_risk,
    'suggest_only_mode', v_settings.suggest_only_mode
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. get_aipify_moderation_dashboard
-- ---------------------------------------------------------------------------
create or replace function public.get_aipify_moderation_dashboard(p_tab text default 'needs_review')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.moderation_settings;
  v_policy public.moderation_policies;
  v_items jsonb;
  v_tab text := coalesce(nullif(p_tab, ''), 'needs_review');
begin
  perform public._amod_require_moderator();
  v_tenant_id := public._amod_tenant();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  v_settings := public.ensure_moderation_settings(v_tenant_id);

  select * into v_policy
  from public.moderation_policies
  where tenant_id = v_tenant_id and active
  order by version desc
  limit 1;

  select coalesce(jsonb_agg(row_to_json(r)::jsonb order by r.created_at desc), '[]'::jsonb)
  into v_items
  from (
    select
      id, source_system, source_type, source_id, user_id, image_url,
      decision, confidence, categories, risk_flags, policy_version,
      reason_summary, suggested_action, is_high_risk, is_reported, priority,
      status, reviewed_by, reviewed_at, final_decision, review_reason, created_at
    from public.moderation_results m
    where m.tenant_id = v_tenant_id
      and case v_tab
        when 'needs_review' then m.status = 'pending' and m.decision = 'manual_review'
        when 'auto_approved' then m.decision = 'auto_approve'
        when 'auto_rejected' then m.decision = 'auto_reject'
        when 'high_risk' then m.is_high_risk = true and m.status = 'pending'
        when 'reported' then m.is_reported = true
        when 'history' then m.status in ('approved', 'rejected', 'escalated')
        else m.status = 'pending'
      end
    order by
      case m.priority when 'critical' then 0 when 'high' then 1 when 'normal' then 2 else 3 end,
      m.created_at desc
    limit 100
  ) r;

  return jsonb_build_object(
    'tab', v_tab,
    'settings', jsonb_build_object(
      'suggest_only_mode', v_settings.suggest_only_mode,
      'auto_approve_enabled', v_settings.auto_approve_enabled,
      'auto_reject_enabled', v_settings.auto_reject_enabled,
      'auto_approve_threshold', v_settings.auto_approve_threshold,
      'auto_reject_threshold', v_settings.auto_reject_threshold
    ),
    'policy', jsonb_build_object(
      'version', coalesce(v_policy.version, 1),
      'label', coalesce(v_policy.label, 'Default moderation policy'),
      'platform_profile', coalesce(v_policy.platform_profile, 'community')
    ),
    'metrics', jsonb_build_object(
      'total_reviewed', (select count(*) from public.moderation_results where tenant_id = v_tenant_id),
      'pending_review', (select count(*) from public.moderation_results where tenant_id = v_tenant_id and status = 'pending'),
      'auto_approved', (select count(*) from public.moderation_results where tenant_id = v_tenant_id and decision = 'auto_approve'),
      'auto_rejected', (select count(*) from public.moderation_results where tenant_id = v_tenant_id and decision = 'auto_reject'),
      'high_risk_pending', (select count(*) from public.moderation_results where tenant_id = v_tenant_id and is_high_risk and status = 'pending'),
      'admin_overrides', (select count(*) from public.moderation_override_logs where tenant_id = v_tenant_id),
      'queue_reduction_pct', case
        when (select count(*) from public.moderation_results where tenant_id = v_tenant_id) = 0 then 0
        else round(
          100.0 * (
            select count(*) from public.moderation_results
            where tenant_id = v_tenant_id and decision in ('auto_approve', 'auto_reject')
          )::numeric / greatest((select count(*) from public.moderation_results where tenant_id = v_tenant_id), 1)::numeric
        )
      end
    ),
    'learning_insights', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'pattern', pattern,
        'count', cnt,
        'message', msg
      )), '[]'::jsonb)
      from (
        select
          'auto_approve_overridden_to_reject' as pattern,
          count(*)::int as cnt,
          format(
            'Aipify suggested approval for %s images that admins later rejected. Policy thresholds may need review.',
            count(*)
          ) as msg
        from public.moderation_override_logs o
        join public.moderation_results r on r.id = o.result_id
        where o.tenant_id = v_tenant_id
          and o.previous_decision = 'auto_approve'
          and o.new_final_decision = 'reject'
        having count(*) >= 3
      ) x
    ),
    'items', v_items,
    'privacy_note', 'Moderation metrics are tenant-scoped. Platform sees aggregates only.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. review_moderation_result
-- ---------------------------------------------------------------------------
create or replace function public.review_moderation_result(
  p_result_id uuid,
  p_final_decision text,
  p_reason text default '',
  p_override_ai boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_admin uuid;
  v_row public.moderation_results;
  v_status text;
begin
  perform public._amod_require_moderator();
  v_tenant_id := public._amod_tenant();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select id into v_admin from public.users where auth_user_id = auth.uid() limit 1;

  select * into v_row
  from public.moderation_results
  where id = p_result_id and tenant_id = v_tenant_id
  for update;

  if v_row.id is null then raise exception 'Moderation result not found'; end if;

  v_status := case p_final_decision
    when 'approve' then 'approved'
    when 'reject' then 'rejected'
    when 'escalate' then 'escalated'
    else 'pending'
  end;

  if p_override_ai and p_final_decision is distinct from v_row.suggested_action then
    insert into public.moderation_override_logs (
      tenant_id, result_id, admin_id,
      previous_decision, new_decision,
      previous_final_decision, new_final_decision, reason
    )
    values (
      v_tenant_id, p_result_id, v_admin,
      v_row.decision, v_row.decision,
      v_row.final_decision, p_final_decision,
      left(coalesce(p_reason, ''), 500)
    );
  end if;

  update public.moderation_results
  set
    final_decision = p_final_decision,
    review_reason = left(coalesce(p_reason, ''), 500),
    status = v_status,
    reviewed_by = v_admin,
    reviewed_at = now(),
    updated_at = now()
  where id = p_result_id;

  perform public._amod_record_access(v_tenant_id, p_result_id, 'review', jsonb_build_object('final_decision', p_final_decision));

  return jsonb_build_object('updated', true, 'status', v_status, 'final_decision', p_final_decision);
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. log_moderation_view
-- ---------------------------------------------------------------------------
create or replace function public.log_moderation_view(p_result_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  perform public._amod_require_moderator();
  v_tenant_id := public._amod_tenant();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  if not exists (
    select 1 from public.moderation_results where id = p_result_id and tenant_id = v_tenant_id
  ) then
    raise exception 'Moderation result not found';
  end if;

  perform public._amod_record_access(v_tenant_id, p_result_id, 'view');
  return jsonb_build_object('logged', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. update_moderation_settings
-- ---------------------------------------------------------------------------
create or replace function public.update_moderation_settings(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  perform public._amod_require_moderator();
  v_tenant_id := public._amod_tenant();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  perform public.ensure_moderation_settings(v_tenant_id);

  update public.moderation_settings
  set
    suggest_only_mode = coalesce((p_payload->>'suggest_only_mode')::boolean, suggest_only_mode),
    auto_approve_enabled = coalesce((p_payload->>'auto_approve_enabled')::boolean, auto_approve_enabled),
    auto_reject_enabled = coalesce((p_payload->>'auto_reject_enabled')::boolean, auto_reject_enabled),
    auto_approve_threshold = coalesce((p_payload->>'auto_approve_threshold')::integer, auto_approve_threshold),
    auto_reject_threshold = coalesce((p_payload->>'auto_reject_threshold')::integer, auto_reject_threshold),
    updated_at = now()
  where tenant_id = v_tenant_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 13. Platform overview (aggregates only)
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_moderation_overview()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  return jsonb_build_object(
    'tenant_count', (select count(distinct tenant_id) from public.moderation_results),
    'total_results', (select count(*) from public.moderation_results),
    'pending_review', (select count(*) from public.moderation_results where status = 'pending'),
    'high_risk_pending', (select count(*) from public.moderation_results where is_high_risk and status = 'pending'),
    'override_count', (select count(*) from public.moderation_override_logs),
    'privacy_note', 'Aggregates only — no image content or URLs exposed at platform level.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 14. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.submit_moderation_image(jsonb) to authenticated;
grant execute on function public.get_aipify_moderation_dashboard(text) to authenticated;
grant execute on function public.review_moderation_result(uuid, text, text, boolean) to authenticated;
grant execute on function public.log_moderation_view(uuid) to authenticated;
grant execute on function public.update_moderation_settings(jsonb) to authenticated;
grant execute on function public.get_platform_moderation_overview() to authenticated;
