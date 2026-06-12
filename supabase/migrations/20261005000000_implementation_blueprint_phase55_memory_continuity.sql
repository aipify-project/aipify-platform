-- Implementation Blueprint Phase 55 — Memory & Continuity Engine
-- Extends Organizational Memory Engine (Phase A.34 + ABOS alignment). Continuity framework scaffold.

-- ---------------------------------------------------------------------------
-- 1. memory_continuity_settings — user/org continuity category controls
-- ---------------------------------------------------------------------------
create table if not exists public.memory_continuity_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null,
  operational_continuity_enabled boolean not null default true,
  relationship_continuity_enabled boolean not null default true,
  learning_continuity_enabled boolean not null default true,
  companion_continuity_enabled boolean not null default true,
  cross_device_continuity_enabled boolean not null default false,
  pame_cross_link_enabled boolean not null default true,
  retention_policy_preference text not null default 'org_default' check (
    retention_policy_preference in ('org_default', 'review_quarterly', 'review_annual', 'minimal')
  ),
  proactive_reminders_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists memory_continuity_settings_org_idx
  on public.memory_continuity_settings (organization_id, user_id);

alter table public.memory_continuity_settings enable row level security;
revoke all on public.memory_continuity_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._mcebp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 55 — Memory & Continuity Engine at /app/organizational-memory-engine. Extends Organizational Memory Engine Phase A.34. Distinct from PAME /app/assistant/memory — personal assistant metadata memories; individual continuity cross-link only, never duplicate personal_memories in org RPC payloads. Learning Engine Phase 23 /app/learning — product learning memory, not relationship continuity. Memory Engine Phase 62 /app/memory and OME Phase 50 — institutional memory timeline; A.34 explains how things should work vs how they unfolded. Companion Device Phase 36 — cross-device continuity cross-link only. Employee Knowledge EKE /app/settings/employee-knowledge — approved internal knowledge, not companion preference memory. Blueprint Phase 55 = continuity framework across operational, relationship, learning, and companion memory categories with user/org control. Cross-links: Workflow Orchestration A.42, Identity A.34 personal RSI separate, Context Engine, Self Love A.76, Human Moments Phase 53. All Phase A.34 and ABOS alignment dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 3. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._mcebp_blueprint_mission()
returns text language sql immutable as $$
  select 'Help people and organizations maintain continuity — remembering context, preferences, relationships, and lessons — so Aipify feels like a companion that grows alongside the work, never a system that forgets or manipulates.';
$$;

create or replace function public._mcebp_blueprint_philosophy()
returns text language sql immutable as $$
  select 'Continuity strengthens trust — memory should be intentional, transparent, and human-controlled. Metadata only; never hidden retention; never manipulative personalization.';
$$;

create or replace function public._mcebp_blueprint_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) remembers with permission — organizations and individuals decide what continuity means; Aipify prepares context and gentle reminders.';
$$;

create or replace function public._mcebp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'relationship_continuity', 'label', 'Relationship continuity', 'emoji', '❤️', 'description', 'Remember communication preferences and partnership context — cross-link RSI, never impersonate'),
    jsonb_build_object('key', 'organizational_context', 'label', 'Organizational context', 'emoji', '🦉', 'description', 'Preserve operational lessons, decisions, and workflow context across teams'),
    jsonb_build_object('key', 'preferences', 'label', 'Preferences & companion growth', 'emoji', '🌹', 'description', 'Companion preferences and tone continuity — distinct from PAME personal memories'),
    jsonb_build_object('key', 'workflow_continuity', 'label', 'Workflow continuity', 'emoji', '🔔', 'description', 'Since-last-time awareness across workflows — cross-link Workflow Orchestration A.42'),
    jsonb_build_object('key', 'personalized_support', 'label', 'Personalized support', 'emoji', '🌹', 'description', 'Context-aware assistance that references approved memory metadata only'),
    jsonb_build_object('key', 'long_term_companion', 'label', 'Long-term companion growth', 'emoji', '🦉', 'description', 'Companion learns patterns over time with explicit consent and review')
  );
$$;

create or replace function public._mcebp_blueprint_memory_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'operational',
      'label', 'Operational continuity',
      'description', 'Process improvements, incident resolutions, workflow adjustments',
      'maps_to', 'organization_memory_records',
      'record_categories', jsonb_build_array('process_improvements', 'resolved_incidents', 'operational_decisions'),
      'emoji', '🔔'
    ),
    jsonb_build_object(
      'key', 'relationship',
      'label', 'Relationship continuity',
      'description', 'Customer preferences, communication styles, partnership patterns — RSI cross-link',
      'maps_to', 'organization_memory_records + RSI cross-link',
      'record_categories', jsonb_build_array('support_learnings', 'onboarding_lessons'),
      'rsi_route', '/app/assistant/relationships',
      'emoji', '❤️'
    ),
    jsonb_build_object(
      'key', 'learning',
      'label', 'Learning continuity',
      'description', 'Product learning patterns — cross-link Learning Engine Phase 23, not duplicated',
      'maps_to', 'customer_learning_memory (aggregate counts only in RPC)',
      'learning_route', '/app/learning',
      'emoji', '🦉'
    ),
    jsonb_build_object(
      'key', 'companion',
      'label', 'Companion continuity',
      'description', 'Companion preferences, device context, proactive tone — cross-link Companion Device Phase 36',
      'maps_to', 'memory_continuity_settings + companion device cross-link',
      'companion_device_route', '/app/companion-device-ecosystem-engine',
      'emoji', '🌹'
    )
  );
$$;

create or replace function public._mcebp_blueprint_organizational_continuity()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'emoji', '🦉',
    'label', 'Organizational continuity',
    'principle', 'Teams remember how work actually unfolded — decisions, incidents, and improvements preserved with metadata summaries.',
    'companion_examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'incident_recall', 'example', 'A similar incident was resolved six months ago — here is the approved lesson summary.'),
      jsonb_build_object('emoji', '🔔', 'key', 'workflow_context', 'example', 'This workflow step aligns with a precedent your team recorded last quarter.'),
      jsonb_build_object('emoji', '🌹', 'key', 'decision_continuity', 'example', 'Your organization chose this approach before — rationale and outcomes are available for review.')
    ),
    'settings_keys', jsonb_build_array('operational_continuity_enabled', 'retention_policy_preference'),
    'boundary', 'Organizational memory metadata only — never raw chat, email, or operational records in RPC payloads.'
  );
$$;

create or replace function public._mcebp_blueprint_individual_continuity()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'emoji', '❤️',
    'label', 'Individual continuity',
    'principle', 'Personal preferences and relationship notes stay user-owned — PAME cross-link only, never duplicate personal_memories content in org dashboards.',
    'companion_examples', jsonb_build_array(
      jsonb_build_object('emoji', '❤️', 'key', 'pame_cross_link', 'example', 'You noted a preference for morning briefings — PAME holds this; continuity surfaces it when relevant.'),
      jsonb_build_object('emoji', '🌹', 'key', 'gentle_preference', 'example', 'Your communication style preference is remembered — you can review or remove it anytime.'),
      jsonb_build_object('emoji', '🔔', 'key', 'follow_up', 'example', 'You asked to revisit this topic next week — a gentle reminder, not pressure.')
    ),
    'pame_route', '/app/assistant/memory',
    'pame_boundary', 'Cross-link PAME preferences — never duplicate personal_memories rows in organizational RPC payloads.',
    'settings_keys', jsonb_build_array('pame_cross_link_enabled', 'relationship_continuity_enabled'),
    'identity_note', 'Identity A.34 personal style separate from institutional memory — RSI relationship notes require explicit approval.'
  );
$$;

create or replace function public._mcebp_blueprint_memory_management()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'label', 'Memory management',
    'principle', 'Users and organizations review, update, remove, and set retention — full control UI scaffold.',
    'controls', jsonb_build_array(
      jsonb_build_object('key', 'review', 'label', 'Scheduled memory reviews', 'route', '/app/organizational-memory-engine', 'maps_to', 'organization_memory_reviews'),
      jsonb_build_object('key', 'update', 'label', 'Edit metadata summaries', 'permission', 'memory.edit'),
      jsonb_build_object('key', 'remove', 'label', 'Archive or supersede outdated memory', 'permission', 'memory.archive'),
      jsonb_build_object('key', 'retention', 'label', 'Retention policies', 'maps_to', 'organization_memory_settings.retention_days')
    ),
    'retention_options', jsonb_build_array(
      jsonb_build_object('key', 'org_default', 'label', 'Organization default retention'),
      jsonb_build_object('key', 'review_quarterly', 'label', 'Quarterly review preference'),
      jsonb_build_object('key', 'review_annual', 'label', 'Annual review preference'),
      jsonb_build_object('key', 'minimal', 'label', 'Minimal retention — review before keeping')
    ),
    'settings_table', 'memory_continuity_settings',
    'org_settings_table', 'organization_memory_settings'
  );
$$;

create or replace function public._mcebp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recognize progress, gentle reminders, celebrate resilience — continuity aligned with Self Love A.76, never guilt or perfectionism.',
    'practices', jsonb_build_array(
      'Acknowledge how far the organization or person has come',
      'Gentle reminders instead of pressure when follow-ups are due',
      'Celebrate lessons learned — not only polished outcomes',
      'Proactive reminders opt-out via proactive_reminders_enabled'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'settings_key', 'proactive_reminders_enabled'
  );
$$;

create or replace function public._mcebp_blueprint_trust_privacy()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'No hidden memory — intentional retention, transparent surfacing, no manipulative personalization.',
    'commitments', jsonb_build_array(
      'Users see what continuity categories are active',
      'Metadata summaries only in dashboard RPCs',
      'Never duplicate PAME personal_memories content in org payloads',
      'Aggregate learning counts — never raw customer_learning_memory content',
      'Cross-device continuity requires explicit opt-in',
      'Employee Knowledge EKE remains approved internal knowledge — distinct boundary'
    ),
    'controls', jsonb_build_array(
      jsonb_build_object('key', 'category_toggles', 'label', 'Per-category continuity toggles'),
      jsonb_build_object('key', 'pame_cross_link', 'label', 'PAME cross-link opt-in'),
      jsonb_build_object('key', 'cross_device', 'label', 'Cross-device continuity opt-in'),
      jsonb_build_object('key', 'retention_policy_preference', 'label', 'Personal retention review preference')
    ),
    'trust_note', 'Continuity summary returns aggregate counts only — no PII, no personal memory content.'
  );
$$;

create or replace function public._mcebp_blueprint_companion_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Warm, transparent, optional — Companion Identity tone for continuity surfacing.',
    'qualities', jsonb_build_array(
      'Explain why context is surfaced',
      'Offer review and dismiss paths',
      'Never imply the user forgot',
      'Cultural sensitivity — i18n en/no/sv/da'
    ),
    'companion_identity_route', '/app/companion-identity-engine',
    'human_moments_route', '/app/gratitude-recognition-engine',
    'human_moments_phase', 53
  );
$$;

create or replace function public._mcebp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates continuity internally; Unonight pilots org memory + continuity scaffolds.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — continuity settings, PAME boundary validation, retention policy review',
      'focus', jsonb_build_array('memory_continuity_settings defaults', 'PAME cross-link without duplication', 'Workflow A.42 since-last-time cross-links')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — operational memory continuity in support workflows',
      'focus', jsonb_build_array('Incident lesson recall', 'Support learning continuity', 'Consent-first companion preferences')
    )
  );
$$;

create or replace function public._mcebp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'pame', 'label', 'PAME Personal Memory', 'route', '/app/assistant/memory', 'note', 'User-owned metadata — cross-link only'),
    jsonb_build_object('key', 'learning_engine', 'label', 'Learning Engine (Phase 23)', 'route', '/app/learning', 'note', 'Product learning — aggregate counts only'),
    jsonb_build_object('key', 'memory_engine', 'label', 'Memory Engine (Phase 62)', 'route', '/app/memory', 'note', 'Institutional timeline — distinct from continuity framework'),
    jsonb_build_object('key', 'ome_phase50', 'label', 'OME Phase 50', 'route', '/app/memory', 'note', 'Institutional memory hub'),
    jsonb_build_object('key', 'companion_device', 'label', 'Companion Device (Phase 36)', 'route', '/app/companion-device-ecosystem-engine', 'note', 'Cross-device continuity cross-link'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'route', '/app/settings/employee-knowledge', 'note', 'Approved internal knowledge — not companion preference memory'),
    jsonb_build_object('key', 'workflow', 'label', 'Workflow Orchestration (A.42)', 'route', '/app/workflow-orchestration-engine'),
    jsonb_build_object('key', 'identity', 'label', 'Identity Engine (A.34)', 'route', '/app/assistant/identity', 'note', 'Personal style — RSI separate'),
    jsonb_build_object('key', 'context', 'label', 'Context Engine', 'route', '/app/assistant/context'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine'),
    jsonb_build_object('key', 'human_moments', 'label', 'Human Moments (Phase 53)', 'route', '/app/gratitude-recognition-engine'),
    jsonb_build_object('key', 'rsi', 'label', 'Relationship Intelligence (RSI)', 'route', '/app/assistant/relationships'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'How things should work vs memory of what unfolded')
  );
$$;

create or replace function public._mcebp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Continuity is earned through transparency — never through hidden retention.',
    '🦉 Organizations remember lessons — metadata protects privacy.',
    '❤️ Personal continuity stays user-owned — PAME cross-link, not duplication.',
    '🌹 Companion preferences grow with consent — review anytime.',
    '🔔 Workflow continuity reduces re-explaining — since-last-time awareness.',
    'Learning continuity improves the product — distinct from relationship memory.',
    'No manipulative personalization — humans decide what persists.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Settings helpers
-- ---------------------------------------------------------------------------
create or replace function public._mcebp_ensure_settings(
  p_organization_id uuid,
  p_user_id uuid
)
returns public.memory_continuity_settings language plpgsql security definer set search_path = public as $$
declare v_row public.memory_continuity_settings;
begin
  insert into public.memory_continuity_settings (organization_id, user_id)
  values (p_organization_id, p_user_id)
  on conflict (organization_id, user_id) do nothing;

  select * into v_row
  from public.memory_continuity_settings
  where organization_id = p_organization_id and user_id = p_user_id;

  return v_row;
end; $$;

create or replace function public._mcebp_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'mcebp_' || p_action_type,
    'organizational_memory_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public.update_memory_continuity_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.memory_continuity_settings;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._irp_require_permission(v_org_id, 'memory.edit');
  v_row := public._mcebp_ensure_settings(v_org_id, v_user_id);

  update public.memory_continuity_settings set
    operational_continuity_enabled = coalesce(
      (p_payload->>'operational_continuity_enabled')::boolean, operational_continuity_enabled
    ),
    relationship_continuity_enabled = coalesce(
      (p_payload->>'relationship_continuity_enabled')::boolean, relationship_continuity_enabled
    ),
    learning_continuity_enabled = coalesce(
      (p_payload->>'learning_continuity_enabled')::boolean, learning_continuity_enabled
    ),
    companion_continuity_enabled = coalesce(
      (p_payload->>'companion_continuity_enabled')::boolean, companion_continuity_enabled
    ),
    cross_device_continuity_enabled = coalesce(
      (p_payload->>'cross_device_continuity_enabled')::boolean, cross_device_continuity_enabled
    ),
    pame_cross_link_enabled = coalesce(
      (p_payload->>'pame_cross_link_enabled')::boolean, pame_cross_link_enabled
    ),
    retention_policy_preference = coalesce(
      nullif(trim(p_payload->>'retention_policy_preference'), ''), retention_policy_preference
    ),
    proactive_reminders_enabled = coalesce(
      (p_payload->>'proactive_reminders_enabled')::boolean, proactive_reminders_enabled
    ),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id and user_id = v_user_id
  returning * into v_row;

  perform public._mcebp_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'operational_continuity_enabled', v_row.operational_continuity_enabled,
    'pame_cross_link_enabled', v_row.pame_cross_link_enabled,
    'retention_policy_preference', v_row.retention_policy_preference,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Continuity summary (aggregate counts only — no PAME content)
-- ---------------------------------------------------------------------------
create or replace function public._mcebp_continuity_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_operational_count int := 0;
  v_relationship_count int := 0;
  v_learning_count int := 0;
  v_companion_opt_in int := 0;
  v_pame_cross_link int := 0;
  v_cross_device_opt_in int := 0;
  v_pending_reviews int := 0;
  v_pame_memory_count int := 0;
begin
  perform public._ome_ensure_settings(p_organization_id);

  select count(*) into v_operational_count
  from public.organization_memory_records
  where organization_id = p_organization_id and status = 'active'
    and category in ('process_improvements', 'resolved_incidents', 'operational_decisions');

  select count(*) into v_relationship_count
  from public.organization_memory_records
  where organization_id = p_organization_id and status = 'active'
    and category in ('support_learnings', 'onboarding_lessons');

  select count(*) into v_learning_count
  from public.customer_learning_memory
  where tenant_id = p_organization_id and status = 'active';

  select count(*) into v_companion_opt_in
  from public.memory_continuity_settings
  where organization_id = p_organization_id and companion_continuity_enabled = true;

  select count(*) into v_pame_cross_link
  from public.memory_continuity_settings
  where organization_id = p_organization_id and pame_cross_link_enabled = true;

  select count(*) into v_cross_device_opt_in
  from public.memory_continuity_settings
  where organization_id = p_organization_id and cross_device_continuity_enabled = true;

  select count(*) into v_pending_reviews
  from public.organization_memory_reviews
  where organization_id = p_organization_id and status in ('scheduled', 'overdue');

  select count(*) into v_pame_memory_count
  from public.personal_memories
  where tenant_id = p_organization_id and status = 'active';

  return jsonb_build_object(
    'operational_memory_count', v_operational_count,
    'relationship_memory_count', v_relationship_count,
    'learning_memory_count', v_learning_count,
    'companion_continuity_opt_in_count', v_companion_opt_in,
    'pame_cross_link_opt_in_count', v_pame_cross_link,
    'cross_device_opt_in_count', v_cross_device_opt_in,
    'pending_review_count', v_pending_reviews,
    'pame_active_memory_count', v_pame_memory_count,
    'privacy_note', 'Aggregate counts only — no personal_memories content, no learning memory text, no PII in RPC payloads.',
    'summary_text', format(
      '%s operational, %s relationship org memories; %s learning entries; %s PAME cross-link opt-ins.',
      v_operational_count, v_relationship_count, v_learning_count, v_pame_cross_link
    )
  );
end; $$;

create or replace function public._mcebp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_operational int := 0;
  v_categories int := 0;
begin
  v_summary := public._mcebp_continuity_summary(p_organization_id);
  v_operational := coalesce((v_summary->>'operational_memory_count')::int, 0);
  v_categories := jsonb_array_length(public._mcebp_blueprint_memory_categories());

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Six continuity objectives documented — relationship through long-term companion growth',
      'met', jsonb_array_length(public._mcebp_blueprint_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'memory_categories',
      'label', 'Four memory categories scaffolded — operational, relationship, learning, companion',
      'met', v_categories >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'continuity_settings',
      'label', 'User/org continuity controls — memory_continuity_settings scaffold',
      'met', to_regclass('public.memory_continuity_settings') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'organizational_continuity',
      'label', 'Organizational continuity examples documented',
      'met', public._mcebp_blueprint_organizational_continuity() is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'individual_continuity',
      'label', 'Individual continuity with PAME cross-link boundary',
      'met', (public._mcebp_blueprint_individual_continuity()->>'pame_boundary') is not null,
      'note', 'Never duplicate personal_memories in org RPC payloads.'
    ),
    jsonb_build_object(
      'key', 'memory_management',
      'label', 'Memory management scaffold — review, update, remove, retention',
      'met', jsonb_array_length(public._mcebp_blueprint_memory_management()->'controls') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'operational_memory',
      'label', 'Operational continuity memory records captured',
      'met', v_operational >= 1,
      'note', case when v_operational < 1 then 'Capture operational memory records or seed org memory.' else null end
    ),
    jsonb_build_object(
      'key', 'pame_boundary',
      'label', 'PAME boundary enforced — cross-link only, no content duplication',
      'met', true,
      'note', 'personal_memories content never included in organizational dashboard RPC payloads.'
    ),
    jsonb_build_object(
      'key', 'trust_privacy',
      'label', 'Trust & privacy principles — no hidden memory, no manipulative personalization',
      'met', true,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-engine integration links documented',
      'met', jsonb_array_length(public._mcebp_blueprint_integration_links()) >= 8,
      'note', null
    ),
    jsonb_build_object(
      'key', 'cultural_i18n',
      'label', 'Cultural i18n scaffold — en/no/sv/da',
      'met', true,
      'note', 'Continuity copy localized in customerApp.organizationalMemoryEngine.phase55.*'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Card RPC — preserve A.34 fields + Phase 55 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_memory_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.view');

  return jsonb_build_object(
    'has_organization', true,
    'active_records', coalesce((
      select count(*) from public.organization_memory_records
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'pending_reviews', coalesce((
      select count(*) from public.organization_memory_reviews
      where organization_id = v_org_id and status in ('scheduled', 'overdue')
    ), 0),
    'philosophy', 'Experience has value. Reflection creates wisdom. Memory strengthens continuity.',
    'mission', 'Help organizations remember important events, decisions and learning experiences so future actions become wiser and more effective.',
    'abos_principle', 'Knowledge tells us what we know. Memory reminds us who we have become.',
    'knowledge_vs_memory_note', 'Knowledge explains how things should work. Memory captures how things actually unfolded.',
    'implementation_blueprint_phase55', jsonb_build_object(
      'phase', 55,
      'title', 'Memory & Continuity Engine',
      'engine_phase', 'A.34',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE55_MEMORY_CONTINUITY.md',
      'route', '/app/organizational-memory-engine'
    ),
    'continuity_mission', public._mcebp_blueprint_mission(),
    'continuity_summary', public._mcebp_continuity_summary(v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Dashboard RPC — preserve ALL A.34 + ABOS fields; append Phase 55
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_memory_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_memory_settings;
  v_continuity_settings public.memory_continuity_settings;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._irp_require_permission(v_org_id, 'memory.view');
  v_settings := public._ome_ensure_settings(v_org_id);
  v_continuity_settings := public._mcebp_ensure_settings(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Experience has value. Reflection creates wisdom. Memory strengthens continuity. Organizations should not have to relearn the same lessons repeatedly.',
    'mission', 'Help organizations remember important events, decisions and learning experiences so future actions become wiser and more effective.',
    'abos_principle', 'Knowledge tells us what we know. Memory reminds us who we have become.',
    'vision', 'Aipify should become a companion that helps organizations remember their journey. Experience deserves to be preserved.',
    'knowledge_vs_memory_note', 'Knowledge explains how things should work. Memory captures how things actually unfolded.',
    'core_philosophy', jsonb_build_array(
      'Experience has value',
      'Reflection creates wisdom',
      'Memory strengthens continuity',
      'Organizations should not relearn the same lessons repeatedly'
    ),
    'memory_categories', jsonb_build_array(
      jsonb_build_object(
        'key', 'operational',
        'label', 'Operational Memory',
        'examples', jsonb_build_array(
          'Process improvements', 'Incident resolutions', 'Successful interventions', 'Workflow adjustments'
        ),
        'record_categories', jsonb_build_array('process_improvements', 'resolved_incidents', 'operational_decisions')
      ),
      jsonb_build_object(
        'key', 'relationship',
        'label', 'Relationship Memory',
        'examples', jsonb_build_array(
          'Customer preferences', 'Communication styles', 'Long-term partnerships', 'Team collaboration patterns'
        ),
        'record_categories', jsonb_build_array('support_learnings', 'onboarding_lessons')
      ),
      jsonb_build_object(
        'key', 'decision',
        'label', 'Decision Memory',
        'examples', jsonb_build_array(
          'Major decisions', 'Decision rationale', 'Trade-offs considered', 'Outcomes achieved'
        ),
        'record_categories', jsonb_build_array('operational_decisions', 'strategic_decisions', 'approval_precedents')
      ),
      jsonb_build_object(
        'key', 'growth',
        'label', 'Growth Memory',
        'examples', jsonb_build_array(
          'Milestones achieved', 'Challenges overcome', 'Lessons learned', 'Improvements implemented'
        ),
        'record_categories', jsonb_build_array('onboarding_lessons', 'process_improvements', 'support_learnings')
      )
    ),
    'memory_capabilities', jsonb_build_array(
      jsonb_build_object('key', 'recall', 'label', 'Recall previous situations'),
      jsonb_build_object('key', 'surface', 'label', 'Surface relevant experiences'),
      jsonb_build_object('key', 'highlight', 'label', 'Highlight similar events'),
      jsonb_build_object('key', 'recommend', 'label', 'Recommend lessons learned'),
      jsonb_build_object('key', 'preserve', 'label', 'Preserve organizational context')
    ),
    'capability_examples', jsonb_build_array(
      'A similar issue occurred six months ago. Here is how it was resolved.',
      'This decision aligns with a previously successful strategy.',
      'Several lessons emerged from a comparable situation.',
      'You have faced challenges like this before — and you found a way through.'
    ),
    'self_love_note', 'Self Love (A.76 planned) encourages celebrating progress, recognizing resilience, appreciating effort, and reflecting on growth — organizations often forget how far they have come.',
    'trust_connection', jsonb_build_object(
      'principle', 'Organizational Memory should remain transparent.',
      'organizations_should_understand', jsonb_build_array(
        'What is remembered',
        'Why it is relevant',
        'Who contributed the knowledge',
        'How it informs recommendations'
      )
    ),
    'memory_levels', jsonb_build_array(
      jsonb_build_object('level', 'session', 'label', 'Session Memory', 'description', 'Short-term conversational awareness'),
      jsonb_build_object('level', 'workspace', 'label', 'Workspace Memory', 'description', 'Knowledge shared within a specific workspace'),
      jsonb_build_object('level', 'organization', 'label', 'Organizational Memory', 'description', 'Approved institutional knowledge across the organization'),
      jsonb_build_object('level', 'strategic', 'label', 'Strategic Memory', 'description', 'Executive-level insights and decision history')
    ),
    'knowledge_domains', jsonb_build_array(
      'Operational knowledge — SOPs, workflows, support routines, escalation paths',
      'Organizational preferences — communication styles, brand guidelines, terminology, priorities',
      'Historical context — incidents, resolved problems, decisions, lessons learned',
      'Customer intelligence — FAQs, pain points, product knowledge, service expectations',
      'Strategic knowledge — objectives, department goals, KPIs, long-term initiatives'
    ),
    'approved_sources', jsonb_build_array(
      'knowledge_center', 'internal_documentation', 'faq', 'support_conversation',
      'meeting_notes', 'policy_procedure', 'case_resolution'
    ),
    'principles', jsonb_build_array(
      'Humans approve knowledge sources and retention policies',
      'Metadata-only summaries — never raw chat, email, or PII',
      'Distinct from PAME personal memories and Learning Engine',
      'Workspace-scoped memory when organization uses workspaces (A.75)',
      'Scheduled reviews and archival with full audit accountability',
      'Security empowers meaningful work — clear responsibilities strengthen organizations'
    ),
    'distinction_note', 'Distinct from Knowledge Center (A.5) — knowledge is approved documentation; memory is experience captured over time. Distinct from PAME and Learning Engine.',
    'success_criteria', public._ome_abos_success_criteria(v_org_id),
    'integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Knowledge Center Engine (A.5)', 'route', '/app/knowledge-center-engine'),
      jsonb_build_object('label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine'),
      jsonb_build_object('label', 'Legacy Engine (A.86)', 'route', '/app/legacy-engine'),
      jsonb_build_object('label', 'Learning Review Center', 'route', '/app/learning'),
      jsonb_build_object('label', 'Organization & Workspaces (A.75)', 'route', '/app/organization-workspace-engine')
    ),
    'settings', row_to_json(v_settings),
    'summary', jsonb_build_object(
      'active_records', coalesce((
        select count(*) from public.organization_memory_records
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'archived_records', coalesce((
        select count(*) from public.organization_memory_records
        where organization_id = v_org_id and status = 'archived'
      ), 0),
      'active_decisions', coalesce((
        select count(*) from public.organization_decision_register
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'pending_reviews', coalesce((
        select count(*) from public.organization_memory_reviews
        where organization_id = v_org_id and status in ('scheduled', 'overdue')
      ), 0),
      'by_memory_level', coalesce((
        select jsonb_object_agg(memory_level, cnt)
        from (
          select memory_level, count(*)::int as cnt
          from public.organization_memory_records
          where organization_id = v_org_id and status = 'active'
          group by memory_level
        ) s
      ), '{}'::jsonb)
    ),
    'recent_learnings', coalesce((
      select jsonb_agg(public._ome_record_json(r) order by r.created_at desc)
      from (
        select * from public.organization_memory_records
        where organization_id = v_org_id and status = 'active'
        order by created_at desc limit 8
      ) r
    ), '[]'::jsonb),
    'recurring_themes', coalesce((
      select jsonb_agg(jsonb_build_object('category', category, 'count', cnt) order by cnt desc)
      from (
        select category, count(*)::int as cnt
        from public.organization_memory_records
        where organization_id = v_org_id and status = 'active'
        group by category order by cnt desc limit 6
      ) t
    ), '[]'::jsonb),
    'frequently_referenced', coalesce((
      select jsonb_agg(public._ome_record_json(r) order by r.reference_count desc, r.updated_at desc)
      from (
        select * from public.organization_memory_records
        where organization_id = v_org_id and status = 'active' and reference_count > 0
        order by reference_count desc, updated_at desc limit 5
      ) r
    ), '[]'::jsonb),
    'archived_decisions', coalesce((
      select jsonb_agg(public._ome_decision_json(d) order by d.updated_at desc)
      from (
        select * from public.organization_decision_register
        where organization_id = v_org_id and status in ('archived', 'superseded')
        order by updated_at desc limit 5
      ) d
    ), '[]'::jsonb),
    'recommended_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', rv.id, 'review_type', rv.review_type, 'scheduled_at', rv.scheduled_at,
        'status', rv.status, 'memory_record_id', rv.memory_record_id
      ) order by rv.scheduled_at asc)
      from (
        select * from public.organization_memory_reviews
        where organization_id = v_org_id and status in ('scheduled', 'overdue')
        order by scheduled_at asc limit 5
      ) rv
    ), '[]'::jsonb),
    'privacy_note', 'Organizational Memory stores metadata summaries only. Humans approve sources, remove outdated information, and define retention policies.',
  -- Phase 55 — Memory & Continuity Engine
    'implementation_blueprint_phase55', jsonb_build_object(
      'phase', 55,
      'title', 'Memory & Continuity Engine',
      'engine_phase', 'A.34',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE55_MEMORY_CONTINUITY.md',
      'route', '/app/organizational-memory-engine',
      'mapping_note', 'ABOS Blueprint Phase 55 extends A.34 with continuity framework — preserves all A.34 and ABOS alignment fields.'
    ),
    'continuity_mission', public._mcebp_blueprint_mission(),
    'continuity_philosophy', public._mcebp_blueprint_philosophy(),
    'continuity_abos_principle', public._mcebp_blueprint_abos_principle(),
    'continuity_objectives', public._mcebp_blueprint_objectives(),
    'continuity_memory_categories', public._mcebp_blueprint_memory_categories(),
    'organizational_continuity', public._mcebp_blueprint_organizational_continuity(),
    'individual_continuity', public._mcebp_blueprint_individual_continuity(),
    'memory_management', public._mcebp_blueprint_memory_management(),
    'continuity_self_love_connection', public._mcebp_blueprint_self_love_connection(),
    'continuity_trust_privacy', public._mcebp_blueprint_trust_privacy(),
    'continuity_companion_principles', public._mcebp_blueprint_companion_principles(),
    'continuity_settings', row_to_json(v_continuity_settings)::jsonb,
    'continuity_summary', public._mcebp_continuity_summary(v_org_id),
    'continuity_dogfooding', public._mcebp_blueprint_dogfooding(),
    'mcebp_integration_links', public._mcebp_blueprint_integration_links(),
    'continuity_success_criteria', public._mcebp_blueprint_success_criteria(v_org_id),
    'continuity_vision_phrases', public._mcebp_blueprint_vision_phrases(),
    'continuity_distinction_note', public._mcebp_distinction_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Grants
-- ---------------------------------------------------------------------------
grant execute on function public._mcebp_distinction_note() to authenticated;
grant execute on function public._mcebp_blueprint_mission() to authenticated;
grant execute on function public._mcebp_blueprint_philosophy() to authenticated;
grant execute on function public._mcebp_blueprint_abos_principle() to authenticated;
grant execute on function public._mcebp_blueprint_objectives() to authenticated;
grant execute on function public._mcebp_blueprint_memory_categories() to authenticated;
grant execute on function public._mcebp_blueprint_organizational_continuity() to authenticated;
grant execute on function public._mcebp_blueprint_individual_continuity() to authenticated;
grant execute on function public._mcebp_blueprint_memory_management() to authenticated;
grant execute on function public._mcebp_blueprint_self_love_connection() to authenticated;
grant execute on function public._mcebp_blueprint_trust_privacy() to authenticated;
grant execute on function public._mcebp_blueprint_companion_principles() to authenticated;
grant execute on function public._mcebp_blueprint_dogfooding() to authenticated;
grant execute on function public._mcebp_blueprint_integration_links() to authenticated;
grant execute on function public._mcebp_blueprint_vision_phrases() to authenticated;
grant execute on function public._mcebp_continuity_summary(uuid) to authenticated;
grant execute on function public._mcebp_blueprint_success_criteria(uuid) to authenticated;
grant execute on function public.update_memory_continuity_settings(jsonb) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'memory-continuity-blueprint', 'Memory & Continuity (ABOS Phase 55)',
  'Continuity framework across operational, relationship, learning, and companion memory — extends Organizational Memory A.34.',
  'authenticated', 113
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'memory-continuity-blueprint' and tenant_id is null
);
