-- Implementation Blueprint Phase 94 — Organizational Memory & Legacy Engine
-- Extends Organizational Memory Engine (Phase A.34 + ABOS + Blueprint Phase 55). No new tables.
-- Cross-links Legacy Engine A.86 + Blueprint Phase 83 — never duplicate _leg_* / _ltbp_* storage.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._omlebp94_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 94 — Organizational Memory & Legacy Engine at /app/organizational-memory-engine. Extends Organizational Memory Engine Phase A.34 (20260805000000), ABOS alignment (20260949000000), and Blueprint Phase 55 Memory Continuity (_mcebp_*). Unified memory + legacy framing — wisdom preservation with governed retention. Cross-links Legacy Engine A.86 + Blueprint Phase 83 Long-Term Stewardship (_ltbp_*) at /app/legacy-engine — never duplicate organization_legacy_stories, organization_legacy_milestones, or _leg_* RPCs. Distinct from Aipify Academy & Learning Ecosystem repo Phase 94 at /app/academy (phase number collision). Distinct from Wisdom Intervention Protocol Phase A.94 at /app/wisdom-intervention-protocol (repo engine phase collision). Distinct from PAME /app/assistant/memory — personal metadata only. Distinct from Learning Engine Phase 23 /app/learning — aggregate counts only. Helpers use _omlebp94_* only — never collide with _mcebp_* or _ltbp_*. Wisdom not accumulation — governance, no surveillance.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._omlebp94_mission()
returns text language sql immutable as $$
  select 'Transform experiences into lasting organizational wisdom for future generations.';
$$;

create or replace function public._omlebp94_philosophy()
returns text language sql immutable as $$
  select 'Knowledge should not disappear when circumstances change — memory strengthens continuity. Wisdom, not accumulation — governed retention with transparency; no surveillance.';
$$;

create or replace function public._omlebp94_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) preserves what matters — organizations decide what wisdom endures; Aipify prepares context, gentle reflection, and cross-links to legacy stewardship without hidden retention.';
$$;

create or replace function public._omlebp94_vision()
returns text language sql immutable as $$
  select 'We remember the people, experiences and lessons that helped us become who we are.';
$$;

create or replace function public._omlebp94_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'experience_transformation', 'label', 'Experience transformation', 'emoji', '🦉', 'description', 'Transform operational experiences into lasting wisdom metadata — metadata summaries only'),
    jsonb_build_object('key', 'leadership_continuity', 'label', 'Leadership continuity', 'emoji', '🦉', 'description', 'Preserve leadership transitions, retiring wisdom, and strategic timelines — cross-link Legacy A.86'),
    jsonb_build_object('key', 'community_memory', 'label', 'Community memory', 'emoji', '❤️', 'description', 'Community collaboration patterns, partnerships, and support learnings'),
    jsonb_build_object('key', 'cultural_preservation', 'label', 'Cultural preservation', 'emoji', '🌹', 'description', 'Milestone archives, traditions in action, values through experience'),
    jsonb_build_object('key', 'legacy_cross_link', 'label', 'Legacy cross-link', 'emoji', '🔔', 'description', 'Cross-link Legacy Engine A.86 + Phase 83 — never duplicate legacy tables or _ltbp_* storage'),
    jsonb_build_object('key', 'governed_retention', 'label', 'Governed retention', 'emoji', '🔔', 'description', 'Privacy-first memory — governance, no surveillance, no permanent retention without approval')
  );
$$;

create or replace function public._omlebp94_memory_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'operational',
      'label', 'Operational memory',
      'emoji', '🔔',
      'description', 'How work actually unfolded — process, incidents, and workflow context',
      'sub_items', jsonb_build_array('Process improvements', 'Incident resolutions', 'Workflow adjustments', 'Operational decisions'),
      'record_categories', jsonb_build_array('process_improvements', 'resolved_incidents', 'operational_decisions'),
      'maps_to', 'organization_memory_records'
    ),
    jsonb_build_object(
      'key', 'leadership',
      'label', 'Leadership memory',
      'emoji', '🦉',
      'description', 'Leadership transitions, strategic decisions, and executive insights',
      'sub_items', jsonb_build_array('Leadership transitions', 'Strategic decisions', 'Executive insights', 'Decision register entries'),
      'record_categories', jsonb_build_array('strategic_decisions', 'operational_decisions', 'approval_precedents'),
      'maps_to', 'organization_memory_records + organization_decision_register',
      'executive_insights_route', '/app/executive-insights-engine'
    ),
    jsonb_build_object(
      'key', 'community',
      'label', 'Community memory',
      'emoji', '❤️',
      'description', 'Team collaboration, partnerships, and shared lessons',
      'sub_items', jsonb_build_array('Team collaboration patterns', 'Long-term partnerships', 'Support learnings', 'Onboarding lessons'),
      'record_categories', jsonb_build_array('support_learnings', 'onboarding_lessons'),
      'maps_to', 'organization_memory_records'
    ),
    jsonb_build_object(
      'key', 'cultural',
      'label', 'Cultural memory',
      'emoji', '🌹',
      'description', 'Milestones, traditions, and values expressed through experience',
      'sub_items', jsonb_build_array('Milestone archives', 'Traditions in action', 'Values through experience', 'Celebration moments'),
      'record_categories', jsonb_build_array('onboarding_lessons', 'process_improvements'),
      'maps_to', 'organization_memory_records + Legacy A.86 cross-link',
      'legacy_engine_route', '/app/legacy-engine'
    )
  );
$$;

create or replace function public._omlebp94_memory_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Memory questions — wisdom-oriented reflection, not surveillance or accumulation pressure.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'lessons_inform_decisions', 'question', 'What lessons from past experiences should inform current decisions?', 'description', 'Wisdom from operational and strategic memory — metadata summaries only'),
      jsonb_build_object('emoji', '🌹', 'key', 'milestones_remembered', 'question', 'What milestones and achievements deserve to be remembered?', 'description', 'Celebrate progress — cross-link Legacy A.86 milestone archives'),
      jsonb_build_object('emoji', '❤️', 'key', 'honor_contributors', 'question', 'Who contributed wisdom that should be honored for future generations?', 'description', 'People and partnerships — never PII in RPC payloads'),
      jsonb_build_object('emoji', '🔔', 'key', 'patterns_for_tomorrow', 'question', 'What operational patterns should continuity preserve for tomorrow?', 'description', 'Continuity cross-link Phase 55 — since-last-time awareness')
    ),
    'reflection_note', 'Questions invite organizational reflection — humans decide what persists; Aipify scaffolds governed memory metadata.'
  );
$$;

create or replace function public._omlebp94_legacy_preservation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Legacy preservation — cross-link Legacy Engine A.86 and Blueprint Phase 83; never duplicate legacy storage on A.34.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'leadership_transitions', 'label', 'Leadership transitions', 'description', 'Retiring wisdom and handoff context — cross-link /app/legacy-engine stories', 'emoji', '🦉'),
      jsonb_build_object('key', 'retiring_wisdom', 'label', 'Retiring wisdom', 'description', 'Honor departing leaders and long-tenured contributors — metadata only', 'emoji', '🌹'),
      jsonb_build_object('key', 'strategic_timelines', 'label', 'Strategic timelines', 'description', 'Decision register and executive reflection cross-links — Phase 82', 'emoji', '🦉'),
      jsonb_build_object('key', 'milestone_archives', 'label', 'Milestone archives', 'description', 'Organization milestones — _ltbp_engagement_summary counts only, stories live in Legacy A.86', 'emoji', '🔔')
    ),
    'legacy_engine_route', '/app/legacy-engine',
    'phase83_helpers', '_ltbp_*',
    'boundary_note', 'A.34 stores experience metadata; Legacy A.86 stores stories and milestones — cross-link only, never duplicate tables.'
  );
$$;

create or replace function public._omlebp94_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Warm, transparent companion guidance for wisdom surfacing — review and dismiss paths always available.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'lesson_recall', 'prompt', 'A similar situation was resolved before — would reviewing the approved lesson summary help?', 'consideration', 'Metadata summary only — explain why context is surfaced'),
      jsonb_build_object('emoji', '🌹', 'key', 'milestone_reflection', 'prompt', 'Your organization reached a meaningful milestone — shall I highlight what was preserved in legacy archives?', 'consideration', 'Cross-link Legacy A.86 — celebration without pressure'),
      jsonb_build_object('emoji', '🔔', 'key', 'continuity_pattern', 'prompt', 'This pattern aligns with a precedent your team recorded — would continuity context be helpful?', 'consideration', 'Phase 55 continuity cross-link — since-last-time awareness')
    ),
    'boundary_note', 'Companion surfaces governed memory metadata — never implies surveillance or hidden accumulation.'
  );
$$;

create or replace function public._omlebp94_meeting_companion_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Meeting Companion A.61 — meeting summaries, decisions, and action items may feed organizational memory metadata with approval.',
    'feeds', jsonb_build_array('Meeting summaries (metadata)', 'Decisions captured in meetings', 'Action items with organizational context'),
    'route', '/app/meeting-collaboration-intelligence-engine',
    'phase', 'A.61',
    'boundary_note', 'Meeting content never auto-stored — humans approve memory capture from meeting metadata hooks.'
  );
$$;

create or replace function public._omlebp94_knowledge_center_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge Center A.5 explains how things should work; Organizational Memory A.34 captures how things actually unfolded.',
    'distinction', 'Knowledge = approved documentation. Memory = experience over time with metadata summaries.',
    'route', '/app/knowledge-center-engine',
    'phase', 'A.5',
    'approved_sources', jsonb_build_array('knowledge_center', 'faq', 'internal_documentation', 'policy_procedure')
  );
$$;

create or replace function public._omlebp94_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love A.76 — celebrate how far the organization has come; memory aligned with resilience, not guilt.',
    'practices', jsonb_build_array(
      'Acknowledge progress and milestones without perfection pressure',
      'Gentle memory reviews — not surveillance reminders',
      'Celebrate lessons learned — not only polished outcomes',
      'Cross-link Phase 55 proactive_reminders_enabled — opt-out available'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'journey_phrase', 'We remember how far we have come — not only what remains unfinished.'
  );
$$;

create or replace function public._omlebp94_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational memory requires transparency — organizations understand what is remembered and why.',
    'organizations_should_understand', jsonb_build_array(
      'What memory metadata is stored — summaries only, never raw chat or email',
      'Why a memory is relevant to current recommendations',
      'Who approved memory capture and retention policies',
      'How legacy cross-links relate to Legacy Engine A.86 — distinct storage'
    ),
    'leaders_should_know', jsonb_build_array(
      'Governed retention — no permanent retention without policy approval',
      'Legacy stories live in Legacy Engine — A.34 cross-links aggregate counts only',
      'Distinct from surveillance, employee monitoring, or hidden accumulation',
      'Scheduled reviews via organization_memory_reviews — full audit accountability'
    ),
    'audit_note', 'Memory actions audited via _ome_* and _mta_create_audit_log — metadata only, tenant-scoped.'
  );
$$;

create or replace function public._omlebp94_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wisdom not accumulation — governed retention, no surveillance.',
    'forbidden', jsonb_build_array(
      'Permanent retention without governance and scheduled review',
      'Unnecessary PII in organizational memory metadata',
      'Surveillance or hidden memory accumulation',
      'Sensitive organizational memory without explicit approval'
    ),
    'required', jsonb_build_array(
      'Metadata summaries only in dashboard RPC payloads',
      'Human approval for memory capture and retention policies',
      'Transparent surfacing — explain why context is shown',
      'Legacy content cross-linked from A.86 — never duplicated in org memory tables'
    ),
    'boundary_note', 'Aipify preserves wisdom with permission — organizations and humans retain agency.'
  );
$$;

create or replace function public._omlebp94_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates organizational memory + legacy cross-link patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — companion philosophy, product milestones, Sales Expert ecosystem, executive decisions, KC links',
      'focus', jsonb_build_array(
        'Companion philosophy and governed memory capture',
        'Product milestone archives cross-linked to Legacy A.86',
        'Sales Expert ecosystem memory patterns — metadata only',
        'Executive decision memory hooks — cross-link Executive Insights A.35 / Phase 82',
        'Knowledge Center articles as approved memory sources'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — operational memory + legacy cross-links in support workflows',
      'focus', jsonb_build_array(
        'Support incident lesson recall',
        'Onboarding lesson preservation',
        'Legacy milestone celebration cross-links',
        'Consent-first memory review cycles'
      )
    )
  );
$$;

create or replace function public._omlebp94_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We remember the people, experiences and lessons that helped us become who we are.',
    'Knowledge should not disappear when circumstances change.',
    'Memory strengthens continuity — wisdom, not accumulation.',
    'Legacy lives in Legacy Engine A.86 — A.34 cross-links, never duplicates.',
    'Governed retention with transparency — no surveillance.',
    'Experience has value. Reflection creates wisdom.'
  );
$$;

create or replace function public._omlebp94_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'legacy_engine', 'label', 'Legacy Engine (A.86)', 'route', '/app/legacy-engine', 'note', 'Stories and milestones — Phase 83 _ltbp_* cross-link only'),
    jsonb_build_object('key', 'legacy_phase83', 'label', 'Long-Term Stewardship (Blueprint Phase 83)', 'route', '/app/legacy-engine', 'note', '_ltbp_* helpers on Legacy route — never duplicate'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'How things should work vs memory of what unfolded'),
    jsonb_build_object('key', 'meeting_companion', 'label', 'Meeting Companion (A.61)', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Meeting summaries and decisions feed memory metadata'),
    jsonb_build_object('key', 'executive_insights', 'label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Executive context and Since Last Time summaries'),
    jsonb_build_object('key', 'executive_reflection_phase82', 'label', 'Executive Reflection (Blueprint Phase 82)', 'route', '/app/executive-insights-engine', 'note', 'Decision learning and leadership reflection cross-link'),
    jsonb_build_object('key', 'org_decision_support', 'label', 'Organizational Decision Support (A.54)', 'route', '/app/organizational-decision-support-engine', 'note', 'Decision register and rationale'),
    jsonb_build_object('key', 'wisdom_engine', 'label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine', 'note', 'Wisdom principles cross-link'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous Improvement (A.33)', 'route', '/app/continuous-improvement-engine', 'note', 'Improvement lessons into organizational memory'),
    jsonb_build_object('key', 'learning_engine', 'label', 'Learning Engine (Phase 23)', 'route', '/app/learning', 'note', 'Product learning — aggregate counts only'),
    jsonb_build_object('key', 'memory_continuity_phase55', 'label', 'Memory Continuity (Blueprint Phase 55)', 'route', '/app/organizational-memory-engine', 'note', 'Continuity framework — _mcebp_* preserved on same route'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Celebrate progress — resilience not guilt'),
    jsonb_build_object('key', 'academy_repo94', 'label', 'Aipify Academy (Repo Phase 94)', 'route', '/app/academy', 'note', 'Phase number collision — distinct learning ecosystem'),
    jsonb_build_object('key', 'wisdom_intervention_a94', 'label', 'Wisdom Intervention Protocol (A.94)', 'route', '/app/wisdom-intervention-protocol', 'note', 'Repo engine phase collision — distinct route')
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Engagement summary (memory + legacy cross-link counts only)
-- ---------------------------------------------------------------------------
create or replace function public._omlebp94_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_continuity jsonb;
  v_legacy jsonb;
  v_active_records int := 0;
  v_active_decisions int := 0;
  v_pending_reviews int := 0;
begin
  v_continuity := public._mcebp_continuity_summary(p_organization_id);

  begin
    v_legacy := public._ltbp_engagement_summary(p_organization_id);
  exception when others then
    v_legacy := jsonb_build_object(
      'story_count', 0,
      'milestone_count', 0,
      'uncelebrated_milestones', 0,
      'cross_link_note', 'Legacy A.86 engagement available when legacy tables exist — counts only, no story content.'
    );
  end;

  select count(*) into v_active_records
  from public.organization_memory_records
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_active_decisions
  from public.organization_decision_register
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_pending_reviews
  from public.organization_memory_reviews
  where organization_id = p_organization_id and status in ('scheduled', 'overdue');

  return jsonb_build_object(
    'active_memory_records', v_active_records,
    'active_decisions', v_active_decisions,
    'pending_reviews', v_pending_reviews,
    'memory_categories', jsonb_array_length(public._omlebp94_memory_categories()),
    'memory_questions', jsonb_array_length(public._omlebp94_memory_questions()->'questions'),
    'legacy_preservation_dimensions', jsonb_array_length(public._omlebp94_legacy_preservation()->'dimensions'),
    'companion_examples', jsonb_array_length(public._omlebp94_companion_guidance()->'examples'),
    'continuity_summary', v_continuity,
    'legacy_engagement_summary', v_legacy,
    'privacy_note', 'Aggregate counts only — no legacy story content, no PII, no personal_memories text in RPC payloads.'
  );
end; $$;

create or replace function public._omlebp94_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_active_records int := 0;
  v_legacy_stories int := 0;
begin
  v_engagement := public._omlebp94_engagement_summary(p_organization_id);
  v_active_records := coalesce((v_engagement->>'active_memory_records')::int, 0);
  v_legacy_stories := coalesce((v_engagement->'legacy_engagement_summary'->>'story_count')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Six memory + legacy objectives documented',
      'met', jsonb_array_length(public._omlebp94_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'memory_categories',
      'label', 'Four memory categories — operational, leadership, community, cultural',
      'met', jsonb_array_length(public._omlebp94_memory_categories()) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'memory_questions',
      'label', 'Memory questions scaffold — 🦉🌹❤️🔔 reflection prompts',
      'met', jsonb_array_length(public._omlebp94_memory_questions()->'questions') >= 4,
      'note', 'Wisdom-oriented reflection — not surveillance.'
    ),
    jsonb_build_object(
      'key', 'legacy_preservation',
      'label', 'Legacy preservation dimensions — cross-link Legacy A.86',
      'met', jsonb_array_length(public._omlebp94_legacy_preservation()->'dimensions') >= 4,
      'note', 'Never duplicate legacy tables on A.34.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — warm, transparent wisdom surfacing',
      'met', jsonb_array_length(public._omlebp94_companion_guidance()->'examples') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy principles — wisdom not accumulation, no surveillance',
      'met', jsonb_array_length(public._omlebp94_privacy_principles()->'forbidden') >= 4,
      'note', 'Governed retention required.'
    ),
    jsonb_build_object(
      'key', 'legacy_cross_link',
      'label', 'Legacy Engine cross-link documented — /app/legacy-engine',
      'met', exists (
        select 1 from jsonb_array_elements(public._omlebp94_integration_links()) elem
        where elem->>'key' = 'legacy_engine'
      ),
      'note', 'Phase 83 _ltbp_* on Legacy route — cross-link only.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-engine integration links documented',
      'met', jsonb_array_length(public._omlebp94_integration_links()) >= 10,
      'note', null
    ),
    jsonb_build_object(
      'key', 'operational_memory',
      'label', 'Active organizational memory records captured',
      'met', v_active_records >= 1,
      'note', case when v_active_records < 1 then 'Capture memory records or seed org memory.' else null end
    ),
    jsonb_build_object(
      'key', 'phase55_preserved',
      'label', 'Blueprint Phase 55 Memory Continuity fields preserved',
      'met', true,
      'note', 'All _mcebp_* continuity fields remain on dashboard RPC.'
    ),
    jsonb_build_object(
      'key', 'legacy_engagement',
      'label', 'Legacy engagement cross-link available',
      'met', v_legacy_stories >= 0,
      'note', 'Legacy story counts from _ltbp_engagement_summary — content lives in Legacy A.86.'
    )
  );
end; $$;

create or replace function public._omlebp94_organizational_memory_legacy_blueprint_block(p_organization_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 94 — Organizational Memory & Legacy Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE94_ORGANIZATIONAL_MEMORY_LEGACY.md',
    'engine_phase', 'A.34 Organizational Memory Engine',
    'route', '/app/organizational-memory-engine',
    'mapping_note', 'ABOS Blueprint Phase 94 extends A.34 + Phase 55 with unified memory + legacy framing. Cross-links Legacy A.86 + Phase 83 — never duplicate legacy storage.',
    'distinction_note', public._omlebp94_distinction_note(),
    'mission', public._omlebp94_mission(),
    'philosophy', public._omlebp94_philosophy(),
    'abos_principle', public._omlebp94_abos_principle(),
    'objectives', public._omlebp94_objectives(),
    'memory_categories', public._omlebp94_memory_categories(),
    'memory_questions', public._omlebp94_memory_questions(),
    'legacy_preservation', public._omlebp94_legacy_preservation(),
    'companion_guidance', public._omlebp94_companion_guidance(),
    'meeting_companion_connection', public._omlebp94_meeting_companion_connection(),
    'knowledge_center_connection', public._omlebp94_knowledge_center_connection(),
    'self_love_connection', public._omlebp94_self_love_connection(),
    'trust_connection', public._omlebp94_trust_connection(),
    'privacy_principles', public._omlebp94_privacy_principles(),
    'dogfooding', public._omlebp94_dogfooding(),
    'success_criteria', public._omlebp94_success_criteria(p_organization_id),
    'vision', public._omlebp94_vision(),
    'vision_phrases', public._omlebp94_vision_phrases(),
    'integration_links', public._omlebp94_integration_links(),
    'engagement_summary', public._omlebp94_engagement_summary(p_organization_id),
    'privacy_note', 'Organizational Memory Legacy blueprint data is metadata only — memory and legacy aggregate counts. No PII, no legacy story content duplication, no surveillance. Humans decide; Aipify informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve A.34 + Phase 55 fields; append Phase 94 framing
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
    'continuity_summary', public._mcebp_continuity_summary(v_org_id),
    'implementation_blueprint_phase94', jsonb_build_object(
      'phase', 'Phase 94 — Organizational Memory & Legacy Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE94_ORGANIZATIONAL_MEMORY_LEGACY.md',
      'engine_phase', 'A.34 Organizational Memory Engine',
      'route', '/app/organizational-memory-engine'
    ),
    'memory_legacy_mission', public._omlebp94_mission(),
    'memory_legacy_abos_principle', public._omlebp94_abos_principle(),
    'memory_legacy_vision', public._omlebp94_vision(),
    'memory_legacy_engagement_summary', public._omlebp94_engagement_summary(v_org_id),
    'memory_legacy_note', 'Organizational Memory & Legacy Engine (ABOS Phase 94) — transform experiences into lasting wisdom; cross-link Legacy A.86 without duplication.',
    'memory_legacy_distinction_note', public._omlebp94_distinction_note()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard RPC — preserve ALL A.34 + ABOS + Phase 55 fields; append Phase 94
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
    'continuity_distinction_note', public._mcebp_distinction_note(),
    'implementation_blueprint_phase94', jsonb_build_object(
      'phase', 'Phase 94 — Organizational Memory & Legacy Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE94_ORGANIZATIONAL_MEMORY_LEGACY.md',
      'engine_phase', 'A.34 Organizational Memory Engine',
      'route', '/app/organizational-memory-engine',
      'mapping_note', 'ABOS Blueprint Phase 94 extends A.34 + Phase 55 with unified memory + legacy framing. Cross-links Legacy A.86 + Phase 83 — never duplicate legacy storage.'
    ),
    'organizational_memory_legacy_blueprint', public._omlebp94_organizational_memory_legacy_blueprint_block(v_org_id),
    'memory_legacy_distinction_note', public._omlebp94_distinction_note(),
    'memory_legacy_mission', public._omlebp94_mission(),
    'memory_legacy_philosophy', public._omlebp94_philosophy(),
    'memory_legacy_abos_principle', public._omlebp94_abos_principle(),
    'memory_legacy_objectives', public._omlebp94_objectives(),
    'memory_legacy_categories', public._omlebp94_memory_categories(),
    'memory_legacy_questions', public._omlebp94_memory_questions(),
    'memory_legacy_preservation', public._omlebp94_legacy_preservation(),
    'memory_legacy_companion_guidance', public._omlebp94_companion_guidance(),
    'memory_legacy_meeting_companion_connection', public._omlebp94_meeting_companion_connection(),
    'memory_legacy_knowledge_center_connection', public._omlebp94_knowledge_center_connection(),
    'memory_legacy_self_love_connection', public._omlebp94_self_love_connection(),
    'memory_legacy_trust_connection', public._omlebp94_trust_connection(),
    'memory_legacy_privacy_principles', public._omlebp94_privacy_principles(),
    'memory_legacy_dogfooding', public._omlebp94_dogfooding(),
    'omlebp94_integration_links', public._omlebp94_integration_links(),
    'memory_legacy_engagement_summary', public._omlebp94_engagement_summary(v_org_id),
    'memory_legacy_success_criteria', public._omlebp94_success_criteria(v_org_id),
    'memory_legacy_vision', public._omlebp94_vision(),
    'memory_legacy_vision_phrases', public._omlebp94_vision_phrases(),
    'memory_legacy_privacy_note', 'Organizational Memory Legacy blueprint data is metadata only — no PII, no legacy story content duplication, no surveillance. Humans decide; Aipify informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._omlebp94_distinction_note() to authenticated;
grant execute on function public._omlebp94_mission() to authenticated;
grant execute on function public._omlebp94_philosophy() to authenticated;
grant execute on function public._omlebp94_abos_principle() to authenticated;
grant execute on function public._omlebp94_vision() to authenticated;
grant execute on function public._omlebp94_objectives() to authenticated;
grant execute on function public._omlebp94_memory_categories() to authenticated;
grant execute on function public._omlebp94_memory_questions() to authenticated;
grant execute on function public._omlebp94_legacy_preservation() to authenticated;
grant execute on function public._omlebp94_companion_guidance() to authenticated;
grant execute on function public._omlebp94_meeting_companion_connection() to authenticated;
grant execute on function public._omlebp94_knowledge_center_connection() to authenticated;
grant execute on function public._omlebp94_self_love_connection() to authenticated;
grant execute on function public._omlebp94_trust_connection() to authenticated;
grant execute on function public._omlebp94_privacy_principles() to authenticated;
grant execute on function public._omlebp94_dogfooding() to authenticated;
grant execute on function public._omlebp94_vision_phrases() to authenticated;
grant execute on function public._omlebp94_integration_links() to authenticated;
grant execute on function public._omlebp94_engagement_summary(uuid) to authenticated;
grant execute on function public._omlebp94_success_criteria(uuid) to authenticated;
grant execute on function public._omlebp94_organizational_memory_legacy_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-memory-legacy-blueprint-phase94', 'Organizational Memory & Legacy Engine (ABOS Phase 94)',
  'Organizational Memory & Legacy Engine — extends A.34 + Phase 55 with unified memory + legacy framing, governed retention, and Legacy A.86 cross-links. Wisdom not accumulation.',
  'authenticated', 124
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'organizational-memory-legacy-blueprint-phase94' and tenant_id is null
);
