-- Phase A.79 — Proactive Companion Engine
-- Organizational ABOS engine for timely proactive assistance categories, preferences, and companion style.
-- Distinct from Companion Presence Indicator (A.67 — floating orb) and ILM proactive guidance (language patterns).

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'notification_communication_engine',
    'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'deployment_environment_management_engine',
    'observability_platform_health_engine', 'aipify_install_engine',
    'module_marketplace_foundation_engine', 'aipify_internal_operations_engine',
    'launch_readiness_engine', 'customer_success_engine',
    'aipify_status_transparency_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'operations_center_foundation_engine',
    'continuous_improvement_engine', 'human_oversight_engine',
    'workflow_orchestration_engine', 'business_packs_foundation_engine',
    'industry_intelligence_foundation_engine',
    'marketplace_partner_ecosystem_foundation_engine',
    'ai_ethics_responsible_use_engine',
    'change_management_engine',
    'value_realization_engine',
    'organizational_resilience_engine',
    'incident_response_coordination_engine',
    'service_level_commitment_engine',
    'stakeholder_communication_engine',
    'organizational_decision_support_engine',
    'strategic_alignment_engine',
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'resource_planning_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'trust_reputation_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_proactive_companion_settings (org defaults)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_proactive_companion_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  enabled_categories jsonb not null default '["operational","support","knowledge","executive","team_awareness"]'::jsonb,
  default_frequency text not null default 'normal' check (
    default_frequency in ('low', 'normal', 'high')
  ),
  default_communication_style text not null default 'supportive' check (
    default_communication_style in ('supportive', 'balanced', 'minimal')
  ),
  default_channels jsonb not null default '["in_app","command_center"]'::jsonb,
  max_nudges_per_day int not null default 12,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_proactive_companion_settings enable row level security;
revoke all on public.organization_proactive_companion_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_proactive_nudges (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_proactive_nudges (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  category text not null check (
    category in ('operational', 'support', 'knowledge', 'executive', 'team_awareness')
  ),
  summary text not null check (char_length(summary) <= 500),
  suggested_action text,
  priority text not null default 'normal' check (
    priority in ('low', 'normal', 'high')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'dismissed', 'acted', 'snoozed')
  ),
  snoozed_until timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_proactive_nudges_org_user_idx
  on public.organization_proactive_nudges (organization_id, user_id, status, created_at desc);
create index if not exists organization_proactive_nudges_org_status_idx
  on public.organization_proactive_nudges (organization_id, status, priority);

alter table public.organization_proactive_nudges enable row level security;
revoke all on public.organization_proactive_nudges from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_proactive_companion_user_preferences
-- ---------------------------------------------------------------------------
create table if not exists public.organization_proactive_companion_user_preferences (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  frequency text not null default 'normal' check (
    frequency in ('low', 'normal', 'high')
  ),
  channels jsonb not null default '["in_app","command_center"]'::jsonb,
  quiet_hours jsonb not null default '{"enabled": false, "start": "22:00", "end": "07:00", "timezone": "UTC"}'::jsonb,
  enabled_categories jsonb not null default '["operational","support","knowledge","executive","team_awareness"]'::jsonb,
  communication_style text not null default 'supportive' check (
    communication_style in ('supportive', 'balanced', 'minimal')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

alter table public.organization_proactive_companion_user_preferences enable row level security;
revoke all on public.organization_proactive_companion_user_preferences from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_proactive_companion_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_proactive_companion_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  action_type text not null check (
    action_type in (
      'nudge_dismissed', 'nudge_snoozed', 'nudge_acted',
      'org_settings_changed', 'user_preferences_changed', 'summary_exported'
    )
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_proactive_companion_audit_org_idx
  on public.organization_proactive_companion_audit_logs (organization_id, created_at desc);

alter table public.organization_proactive_companion_audit_logs enable row level security;
revoke all on public.organization_proactive_companion_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'proactive_companion', v.description
from (values
  ('proactive_companion.view', 'View Proactive Companion', 'View proactive companion dashboard and nudges'),
  ('proactive_companion.manage', 'Manage Proactive Companion', 'Configure organization proactive companion settings'),
  ('proactive_companion.nudges.dismiss', 'Dismiss Proactive Nudges', 'Dismiss or snooze proactive companion nudges'),
  ('proactive_companion.preferences.manage', 'Manage Proactive Preferences', 'Manage personal proactive companion preferences')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'proactive_companion.view'), ('owner', 'proactive_companion.manage'),
  ('owner', 'proactive_companion.nudges.dismiss'), ('owner', 'proactive_companion.preferences.manage'),
  ('administrator', 'proactive_companion.view'), ('administrator', 'proactive_companion.manage'),
  ('administrator', 'proactive_companion.nudges.dismiss'), ('administrator', 'proactive_companion.preferences.manage'),
  ('manager', 'proactive_companion.view'), ('manager', 'proactive_companion.nudges.dismiss'),
  ('manager', 'proactive_companion.preferences.manage'),
  ('support_agent', 'proactive_companion.view'), ('support_agent', 'proactive_companion.nudges.dismiss'),
  ('support_agent', 'proactive_companion.preferences.manage'),
  ('viewer', 'proactive_companion.view'), ('viewer', 'proactive_companion.nudges.dismiss'),
  ('viewer', 'proactive_companion.preferences.manage')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_pce_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._pce_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_proactive_companion_audit_logs (
    organization_id, user_id, action_type, metadata
  ) values (
    p_organization_id, p_user_id, p_action_type, coalesce(p_metadata, '{}'::jsonb)
  );

  perform public._mta_create_audit_log(
    p_organization_id,
    'pce_' || p_action_type,
    'proactive_companion',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._pce_ensure_settings(p_organization_id uuid)
returns public.organization_proactive_companion_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_proactive_companion_settings;
begin
  insert into public.organization_proactive_companion_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_proactive_companion_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._pce_ensure_user_prefs(
  p_organization_id uuid,
  p_user_id uuid
)
returns public.organization_proactive_companion_user_preferences language plpgsql security definer set search_path = public as $$
declare v_row public.organization_proactive_companion_user_preferences;
declare v_settings public.organization_proactive_companion_settings;
begin
  v_settings := public._pce_ensure_settings(p_organization_id);

  insert into public.organization_proactive_companion_user_preferences (
    organization_id, user_id, frequency, channels, enabled_categories, communication_style
  ) values (
    p_organization_id,
    p_user_id,
    v_settings.default_frequency,
    v_settings.default_channels,
    v_settings.enabled_categories,
    v_settings.default_communication_style
  )
  on conflict (organization_id, user_id) do nothing;

  select * into v_row
  from public.organization_proactive_companion_user_preferences
  where organization_id = p_organization_id and user_id = p_user_id;

  return v_row;
end; $$;

create or replace function public._pce_assistance_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'operational', 'label', 'Operational', 'description', 'Workflow readiness, task follow-ups, and operational checkpoints before deadlines.'),
    jsonb_build_object('key', 'support', 'label', 'Support', 'description', 'Queue awareness, escalation readiness, and customer response preparation.'),
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge', 'description', 'Approved knowledge gaps, documentation updates, and learning opportunities.'),
    jsonb_build_object('key', 'executive', 'label', 'Executive', 'description', 'Briefing preparation, decision context, and strategic alignment reminders.'),
    jsonb_build_object('key', 'team_awareness', 'label', 'Team awareness', 'description', 'Shared context and coordination cues — never colleague surveillance.')
  );
$$;

create or replace function public._pce_companion_style_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('style', 'supportive', 'example', 'When you have a moment, three support items may benefit from review.'),
    jsonb_build_object('style', 'supportive', 'example', 'Your weekly briefing is ready — would you like a summary before your meeting?'),
    jsonb_build_object('style', 'balanced', 'example', 'Two operational nudges are pending. Review when convenient.'),
    jsonb_build_object('style', 'minimal', 'example', '1 approval pending.')
  );
$$;

create or replace function public._pce_boundaries()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'No anxiety-inducing urgency language',
    'No notification flooding — daily caps and quiet hours respected',
    'No surveillance — metadata summaries only, never keystrokes or colleague monitoring',
    'Human control — nudges suggest; users dismiss, snooze, or act',
    'Self Love monitors fatigue — reduces frequency when overload signals appear'
  );
$$;

create or replace function public._pce_seed_nudges(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_proactive_nudges
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_proactive_nudges (
    organization_id, user_id, category, summary, suggested_action, priority, status, metadata
  ) values
    (p_organization_id, null, 'operational',
     'Weekly operational review window opens tomorrow — prepare open tasks and approvals summary.',
     'Review Command Center operational feed', 'normal', 'pending',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, null, 'support',
     'Support queue trend suggests elevated volume — consider reviewing escalation rules.',
     'Open Support AI dashboard', 'normal', 'pending',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, null, 'knowledge',
     'Two knowledge articles may need review based on recent support patterns.',
     'Visit Knowledge Center review queue', 'low', 'pending',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, null, 'executive',
     'Executive briefing materials can be prepared before the next leadership sync.',
     'Generate executive summary draft', 'normal', 'pending',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, null, 'team_awareness',
     'Shared project milestone approaching — coordinate handoffs without monitoring individuals.',
     'Review team coordination checklist', 'low', 'pending',
     '{"seed": true, "metadata_only": true}'::jsonb);
end; $$;

create or replace function public._pce_preference_summary(
  p_organization_id uuid,
  p_user_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_prefs public.organization_proactive_companion_user_preferences;
declare v_settings public.organization_proactive_companion_settings;
begin
  v_settings := public._pce_ensure_settings(p_organization_id);
  v_prefs := public._pce_ensure_user_prefs(p_organization_id, p_user_id);

  return jsonb_build_object(
    'frequency', v_prefs.frequency,
    'communication_style', v_prefs.communication_style,
    'channels', v_prefs.channels,
    'quiet_hours', v_prefs.quiet_hours,
    'enabled_categories', v_prefs.enabled_categories,
    'org_defaults', jsonb_build_object(
      'enabled', v_settings.enabled,
      'default_frequency', v_settings.default_frequency,
      'default_communication_style', v_settings.default_communication_style,
      'max_nudges_per_day', v_settings.max_nudges_per_day
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. list_proactive_companion_nudges
-- ---------------------------------------------------------------------------
create or replace function public.list_proactive_companion_nudges(p_status text default 'pending')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
begin
  perform public._irp_require_permission('proactive_companion.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._pce_seed_nudges(v_org_id);

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', n.id,
        'category', n.category,
        'summary', n.summary,
        'suggested_action', n.suggested_action,
        'priority', n.priority,
        'status', n.status,
        'snoozed_until', n.snoozed_until,
        'metadata', n.metadata,
        'created_at', n.created_at,
        'updated_at', n.updated_at
      ) order by
        case n.priority when 'high' then 0 when 'normal' then 1 else 2 end,
        n.created_at desc
    )
    from public.organization_proactive_nudges n
    where n.organization_id = v_org_id
      and (n.user_id is null or n.user_id = v_user_id)
      and (p_status is null or n.status = p_status)
      and (n.status != 'snoozed' or n.snoozed_until is null or n.snoozed_until <= now())
  ), '[]'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. dismiss / snooze nudge
-- ---------------------------------------------------------------------------
create or replace function public.dismiss_proactive_companion_nudge(p_nudge_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_proactive_nudges%rowtype;
begin
  perform public._irp_require_permission('proactive_companion.nudges.dismiss');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.organization_proactive_nudges set
    status = 'dismissed',
    updated_at = now()
  where id = p_nudge_id
    and organization_id = v_org_id
    and (user_id is null or user_id = v_user_id)
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Nudge not found or not accessible';
  end if;

  perform public._pce_log(v_org_id, v_user_id, 'nudge_dismissed', jsonb_build_object(
    'nudge_id', v_row.id,
    'category', v_row.category,
    'metadata_only', true
  ));

  return jsonb_build_object('dismissed', true, 'nudge_id', v_row.id);
end; $$;

create or replace function public.snooze_proactive_companion_nudge(
  p_nudge_id uuid,
  p_until timestamptz default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_until timestamptz;
  v_row public.organization_proactive_nudges%rowtype;
begin
  perform public._irp_require_permission('proactive_companion.nudges.dismiss');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_until := coalesce(p_until, now() + interval '4 hours');

  update public.organization_proactive_nudges set
    status = 'snoozed',
    snoozed_until = v_until,
    updated_at = now()
  where id = p_nudge_id
    and organization_id = v_org_id
    and (user_id is null or user_id = v_user_id)
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Nudge not found or not accessible';
  end if;

  perform public._pce_log(v_org_id, v_user_id, 'nudge_snoozed', jsonb_build_object(
    'nudge_id', v_row.id,
    'snoozed_until', v_until,
    'metadata_only', true
  ));

  return jsonb_build_object('snoozed', true, 'nudge_id', v_row.id, 'snoozed_until', v_until);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. save org settings / user preferences
-- ---------------------------------------------------------------------------
create or replace function public.save_proactive_companion_org_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_proactive_companion_settings;
begin
  perform public._irp_require_permission('proactive_companion.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._pce_ensure_settings(v_org_id);

  update public.organization_proactive_companion_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    enabled_categories = coalesce(p_payload->'enabled_categories', enabled_categories),
    default_frequency = coalesce(nullif(trim(p_payload->>'default_frequency'), ''), default_frequency),
    default_communication_style = coalesce(nullif(trim(p_payload->>'default_communication_style'), ''), default_communication_style),
    default_channels = coalesce(p_payload->'default_channels', default_channels),
    max_nudges_per_day = coalesce((p_payload->>'max_nudges_per_day')::int, max_nudges_per_day),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_settings;

  perform public._pce_log(v_org_id, v_user_id, 'org_settings_changed', jsonb_build_object(
    'metadata_only', true,
    'enabled', v_settings.enabled
  ));

  return row_to_json(v_settings)::jsonb;
end; $$;

create or replace function public.save_proactive_companion_user_preferences(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_prefs public.organization_proactive_companion_user_preferences;
begin
  perform public._irp_require_permission('proactive_companion.preferences.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_prefs := public._pce_ensure_user_prefs(v_org_id, v_user_id);

  update public.organization_proactive_companion_user_preferences set
    frequency = coalesce(nullif(trim(p_payload->>'frequency'), ''), frequency),
    channels = coalesce(p_payload->'channels', channels),
    quiet_hours = coalesce(p_payload->'quiet_hours', quiet_hours),
    enabled_categories = coalesce(p_payload->'enabled_categories', enabled_categories),
    communication_style = coalesce(nullif(trim(p_payload->>'communication_style'), ''), communication_style),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id and user_id = v_user_id
  returning * into v_prefs;

  perform public._pce_log(v_org_id, v_user_id, 'user_preferences_changed', jsonb_build_object(
    'metadata_only', true,
    'frequency', v_prefs.frequency,
    'communication_style', v_prefs.communication_style
  ));

  return row_to_json(v_prefs)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_proactive_companion_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_pending int := 0;
begin
  perform public._irp_require_permission('proactive_companion.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._pce_seed_nudges(v_org_id);

  select count(*) into v_pending
  from public.organization_proactive_nudges n
  where n.organization_id = v_org_id
    and (n.user_id is null or n.user_id = v_user_id)
    and n.status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Timely, relevant, responsible guidance before urgent — supportive, not intrusive.',
    'pending_nudges', v_pending,
    'enabled', (select enabled from public.organization_proactive_companion_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_proactive_companion_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_proactive_companion_settings;
  v_prefs public.organization_proactive_companion_user_preferences;
begin
  perform public._irp_require_permission('proactive_companion.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._pce_ensure_settings(v_org_id);
  v_prefs := public._pce_ensure_user_prefs(v_org_id, v_user_id);
  perform public._pce_seed_nudges(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify offers timely, relevant guidance before things become urgent — always supportive, never intrusive.',
    'mission', 'Deliver responsible proactive assistance across operational, support, knowledge, executive, and team awareness categories while respecting human control and personal boundaries.',
    'abos_principle', 'Assistance augments people — Aipify informs and prepares; humans decide. Proactive companion is an ABOS Assistance pillar capability.',
    'self_love_note', 'Self Love (A.76 planned) monitors fatigue signals and may reduce nudge frequency — never pressure or guilt.',
    'distinction_note', 'Distinct from Companion Presence (A.67 — floating orb/heartbeat) and ILM proactive guidance (assistant language patterns).',
    'assistance_categories', public._pce_assistance_categories(),
    'companion_style_examples', public._pce_companion_style_examples(),
    'boundaries', public._pce_boundaries(),
    'settings', row_to_json(v_settings)::jsonb,
    'user_preferences', row_to_json(v_prefs)::jsonb,
    'preference_summary', public._pce_preference_summary(v_org_id, v_user_id),
    'active_nudges', public.list_proactive_companion_nudges('pending'),
    'summary', jsonb_build_object(
      'pending_nudges', coalesce((
        select count(*) from public.organization_proactive_nudges
        where organization_id = v_org_id
          and (user_id is null or user_id = v_user_id)
          and status = 'pending'
      ), 0),
      'snoozed_nudges', coalesce((
        select count(*) from public.organization_proactive_nudges
        where organization_id = v_org_id
          and (user_id is null or user_id = v_user_id)
          and status = 'snoozed'
      ), 0),
      'dismissed_today', coalesce((
        select count(*) from public.organization_proactive_nudges
        where organization_id = v_org_id
          and (user_id is null or user_id = v_user_id)
          and status = 'dismissed'
          and updated_at >= date_trunc('day', now())
      ), 0)
    ),
    'integration_links', jsonb_build_object(
      'command_center', '/app/command-center',
      'companion_presence', '/app/settings/companion-presence',
      'notification_engine', '/app/notification-communication-engine',
      'quality_guardian', '/app/quality-guardian-engine',
      'assistant', '/app/assistant'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('proactive_companion.manage'),
      'can_dismiss', public._irp_has_permission('proactive_companion.nudges.dismiss'),
      'can_manage_preferences', public._irp_has_permission('proactive_companion.preferences.manage')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_proactive_companion_summary(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_proactive_companion_settings;
begin
  perform public._irp_require_permission('proactive_companion.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._pce_ensure_settings(v_org_id);

  perform public._pce_log(v_org_id, v_user_id, 'summary_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'proactive_companion',
    'format', coalesce(p_format, 'json'),
    'settings', row_to_json(v_settings)::jsonb,
    'preference_summary', public._pce_preference_summary(v_org_id, v_user_id),
    'assistance_categories', public._pce_assistance_categories(),
    'boundaries', public._pce_boundaries(),
    'active_nudges', public.list_proactive_companion_nudges('pending'),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('proactive_companion.manage'),
      'can_dismiss', public._irp_has_permission('proactive_companion.nudges.dismiss')
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Audit allowlist extension
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'insight_dismissed', 'strategic_export_generated', 'insight_status_changed',
    'operations_event_acknowledged', 'operations_event_assigned', 'operations_event_escalated',
    'operations_event_resolved', 'operations_event_dismissed',
    'improvement_approved', 'improvement_dismissed', 'improvement_implemented',
    'improvement_feedback_submitted', 'improvement_outcome_reviewed',
    'oversight_approval_submitted', 'oversight_approval_granted', 'oversight_approval_rejected',
    'oversight_override_applied', 'oversight_critical_confirmed', 'oversight_rationale_updated',
    'oversight_settings_changed',
    'business_pack_activated', 'business_pack_customized', 'business_pack_update_acknowledged',
    'workflow_created', 'workflow_status_changed', 'workflow_executed',
    'workflow_template_applied', 'workflow_step_approval_requested', 'workflow_step_approved',
    'workflow_step_rejected', 'workflow_escalated',
    'industry_profile_assigned', 'industry_insight_overridden', 'industry_insights_toggled',
    'industry_terminology_updated', 'industry_priorities_updated', 'industry_insights_exported',
    'change_initiative_created', 'change_initiative_status_updated', 'change_impact_assessed',
    'change_communication_plan_created', 'change_communication_released',
    'change_training_assigned', 'change_adoption_metric_recorded', 'change_milestone_completed',
    'value_baseline_captured', 'value_metric_recorded', 'value_metric_updated',
    'value_report_generated', 'value_report_exported', 'value_milestone_adjusted',
    'resilience_plan_created', 'resilience_plan_status_updated', 'resilience_plan_approved',
    'resilience_simulation_recorded', 'resilience_review_completed',
    'resilience_vulnerability_recorded', 'resilience_vulnerability_resolved',
    'irce_incident_created', 'irce_incident_owner_assigned', 'irce_incident_severity_updated',
    'irce_incident_status_updated', 'irce_incident_escalated', 'irce_incident_resolved',
    'irce_incident_closed', 'irce_incident_communication_recorded', 'irce_incident_lessons_captured',
    'odse_decision_proposed', 'odse_decision_review_started', 'odse_decision_approved',
    'odse_decision_rejected', 'odse_decision_implemented', 'odse_decision_outcome_recorded',
    'odse_decision_report_exported',
    'sae_objective_created', 'sae_objective_updated', 'sae_objective_entity_linked',
    'sae_strategic_review_recorded', 'sae_misalignment_detected', 'sae_alignment_report_exported',
    'ohe_health_measured', 'ohe_category_refreshed', 'ohe_score_overridden',
    'ohe_recommendations_generated', 'ohe_intervention_approved', 'ohe_health_report_exported',
    'cma_assessment_created', 'cma_assessment_updated', 'cma_roadmap_generated', 'cma_maturity_report_exported',
    'obe_profile_created', 'obe_profile_updated', 'obe_comparison_generated', 'obe_benchmark_report_exported',
    'doe_template_created', 'doe_template_updated', 'doe_template_archived',
    'doe_output_generated', 'doe_schedule_created', 'doe_schedule_cancelled',
    'doe_delivery_recorded', 'doe_manifest_exported',
    'rrme_policy_created', 'rrme_policy_updated', 'rrme_policy_retired',
    'rrme_record_archived', 'rrme_record_restored',
    'rrme_disposal_requested', 'rrme_disposal_rejected', 'rrme_disposal_approved', 'rrme_disposal_completed',
    'mcie_meeting_created', 'mcie_meeting_status_updated', 'mcie_meeting_cancelled',
    'mcie_agenda_generated', 'mcie_summary_captured', 'mcie_actions_extracted',
    'mcie_action_assigned', 'mcie_action_status_updated', 'mcie_actions_marked_overdue',
    'mcie_decision_captured', 'mcie_outputs_generated', 'mcie_manifest_exported',
    'utfe_task_created', 'utfe_task_created_from_source', 'utfe_task_assigned',
    'utfe_task_status_updated', 'utfe_task_completed', 'utfe_reminder_scheduled',
    'utfe_task_escalated', 'utfe_calendar_sync_requested', 'utfe_manifest_exported',
    'rpe_plan_created', 'rpe_plan_status_updated', 'rpe_plan_approved',
    'rpe_allocation_created', 'rpe_allocation_updated', 'rpe_utilization_overridden',
    'rpe_scenario_created', 'rpe_scenarios_compared', 'rpe_manifest_exported',
    'cwme_capacity_profile_created', 'cwme_capacity_profile_updated',
    'cwme_workload_item_created', 'cwme_workload_reassigned',
    'cwme_warning_acknowledged', 'cwme_threshold_updated', 'cwme_manifest_exported',
    'goke_objective_created', 'goke_objective_activated', 'goke_objective_completion_approved',
    'goke_key_result_created', 'goke_progress_updated', 'goke_progress_overridden',
    'goke_manifest_exported',
    'pie_insights_generated', 'pie_insight_dismissed', 'pie_manifest_exported',
    'ctie_participation_updated', 'ctie_insights_generated', 'ctie_anonymized_contribution',
    'ctie_recommendation_approved', 'ctie_outcome_recorded', 'ctie_manifest_exported',
    'pse_partner_created', 'pse_partner_updated', 'pse_partner_status_changed',
    'pse_engagement_created', 'pse_review_recorded', 'pse_manifest_exported', 'pse_outcome_recorded',
    'tre_trust_score_refreshed', 'tre_signal_recorded', 'tre_manifest_exported',
    'acge_budget_created', 'acge_budget_updated', 'acge_usage_recorded', 'acge_alert_triggered',
    'acge_manifest_exported',
    'owe_workspace_created', 'owe_workspace_updated', 'owe_workspace_archived',
    'owe_workspace_switched', 'owe_member_invited', 'owe_member_updated',
    'owe_custom_role_created', 'owe_org_permissions_saved', 'owe_summary_exported',
    'cpie_critical_alert_acknowledged', 'cpie_quiet_mode_changed', 'cpie_org_settings_changed',
    'pce_nudge_dismissed', 'pce_nudge_snoozed', 'pce_nudge_acted',
    'pce_org_settings_changed', 'pce_user_preferences_changed', 'pce_summary_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%';
$$;

-- ---------------------------------------------------------------------------
-- 12. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'proactive-companion-engine', 'Proactive Companion Engine',
  'Timely, responsible proactive assistance — categories, preferences, and companion communication style. ABOS Assistance pillar.',
  'authenticated', 101
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'proactive-companion-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 13. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_proactive_companion_engine_card() to authenticated;
grant execute on function public.get_proactive_companion_engine_dashboard() to authenticated;
grant execute on function public.list_proactive_companion_nudges(text) to authenticated;
grant execute on function public.dismiss_proactive_companion_nudge(uuid) to authenticated;
grant execute on function public.snooze_proactive_companion_nudge(uuid, timestamptz) to authenticated;
grant execute on function public.save_proactive_companion_org_settings(jsonb) to authenticated;
grant execute on function public.save_proactive_companion_user_preferences(jsonb) to authenticated;
grant execute on function public.export_proactive_companion_summary(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 14. Seed settings + sample nudges per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._pce_ensure_settings(v_org_id);
    perform public._pce_seed_nudges(v_org_id);
  end loop;
end; $$;
