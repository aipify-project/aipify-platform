-- Implementation Blueprint Phase 9 — Recognition & Celebration Foundation
-- Spec alignment extending Gratitude & Recognition Engine (Phase A.89). No new tables.

create or replace function public._gre_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.organization_gratitude_recognition_settings;
  v_moments int := 0;
  v_roses int := 0;
  v_self_moments int := 0;
  v_type_coverage int := 0;
  v_celebrated int := 0;
begin
  v_settings := public._gre_ensure_settings(p_organization_id);
  perform public._gre_seed_moments(p_organization_id);

  select count(*) into v_moments
  from public.organization_gratitude_moments where organization_id = p_organization_id;

  select count(*) into v_roses
  from public.organization_digital_rose_recognitions where organization_id = p_organization_id;

  select count(*) into v_self_moments
  from public.organization_gratitude_moments
  where organization_id = p_organization_id and recognition_target_role = 'self';

  select count(distinct moment_type) into v_type_coverage
  from public.organization_gratitude_moments where organization_id = p_organization_id;

  select count(*) into v_celebrated
  from public.organization_gratitude_moments
  where organization_id = p_organization_id and status in ('celebrated', 'acknowledged');

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'recognition_enabled',
      'label', 'Recognition engine enabled with roses and/or gratitude moments',
      'met', v_settings.enabled and (v_settings.digital_rose_enabled or v_settings.gratitude_moments_enabled),
      'note', case
        when not v_settings.enabled then 'Enable the Gratitude & Recognition Engine for this organization.'
        when not v_settings.digital_rose_enabled and not v_settings.gratitude_moments_enabled
          then 'Enable Digital Recognition Roses and/or gratitude moments.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'moment_coverage',
      'label', 'Gratitude moments recorded across recognition categories',
      'met', v_moments >= 3 and v_type_coverage >= 3,
      'note', case
        when v_moments < 3 then format('%s moments recorded — seed or capture more diverse recognition.', v_moments)
        when v_type_coverage < 3 then 'Record moments across individual, team, and organizational scopes.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'recognition_roses',
      'label', 'Digital recognition roses available and used',
      'met', v_settings.digital_rose_enabled and v_roses > 0,
      'note', case
        when not v_settings.digital_rose_enabled then 'Enable Digital Recognition Roses in settings.'
        when v_roses = 0 then 'Send a Digital Recognition Rose to validate the flow — appreciation, not romance.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'self_recognition',
      'label', 'Self-recognition encouraged when appropriate',
      'met', v_self_moments > 0 or v_celebrated > 0,
      'note', case
        when v_self_moments = 0 then 'Encourage acknowledging own effort — recognition_target_role self or celebrated moments.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'authentic_recognition',
      'label', 'Recognition stays authentic — specific observations, not generic praise',
      'met', v_moments > 0 and v_settings.redirect_romantic_language,
      'note', 'Prefer specific summaries in moments and roses; redirect romantic language to peer recognition.'
    ),
    jsonb_build_object(
      'key', 'comfort_boundary',
      'label', 'Recognition roses distinct from Presence & Comfort A.90 comfort roses',
      'met', true,
      'note', 'Comfort roses live in /app/presence-comfort-protocol — recognition roses here are peer appreciation only.'
    )
  );
end; $$;

create or replace function public._gre_recognition_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'individual',
      'label', 'Individual',
      'focus', jsonb_build_array('support', 'goals', 'consistency', 'growth'),
      'moment_type_keys', jsonb_build_array('exceptional_support', 'consistent_helper', 'above_and_beyond'),
      'examples', jsonb_build_array(
        'Exceptional support on a complex customer case',
        'Personal goal milestone — honest progress celebrated',
        'Consistent helper who kept handoffs smooth all week',
        'Growth through learning — effort recognized, not only outcomes'
      )
    ),
    jsonb_build_object(
      'key', 'team',
      'label', 'Team',
      'focus', jsonb_build_array('milestones', 'collaboration', 'customer_praise', 'knowledge'),
      'moment_type_keys', jsonb_build_array('milestone', 'above_and_beyond', 'customer_appreciation', 'exceptional_support'),
      'examples', jsonb_build_array(
        'Team completed a major onboarding milestone together',
        'Cross-team collaboration during a busy operational period',
        'Customer praise reflecting shared team values',
        'Knowledge shared that helped colleagues move faster'
      )
    ),
    jsonb_build_object(
      'key', 'organizational',
      'label', 'Organizational',
      'focus', jsonb_build_array('major_accomplishments', 'anniversaries', 'growth', 'legacy'),
      'moment_type_keys', jsonb_build_array('milestone', 'above_and_beyond', 'customer_appreciation'),
      'examples', jsonb_build_array(
        'Major accomplishment that strengthened the organization',
        'Work anniversary or tenure worth honoring',
        'Sustained growth through collective effort',
        'Lasting contribution that shaped how the team works'
      )
    )
  );
$$;

create or replace function public._gre_bell_moments()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'emoji', '🔔',
    'label', 'Bell Moments',
    'principle', 'Small celebrations — infrequent enough to retain significance. Gentle presence, not alert spam.',
    'frequency_note', 'Organizations may tune celebration_frequency in settings metadata — default balanced.',
    'examples', jsonb_build_array(
      jsonb_build_object('key', 'first_milestone', 'text', '🔔 First meaningful milestone reached — worth a quiet celebration.'),
      jsonb_build_object('key', 'team_goal', 'text', '🔔 Team goal completed after sustained effort — notice the people behind it.'),
      jsonb_build_object('key', 'customer_praise', 'text', '🔔 Customer praise arrived — share what the team did well.'),
      jsonb_build_object('key', 'steady_reliability', 'text', '🔔 A week of steady reliability — consistency deserves recognition too.')
    ),
    'disabled_when', jsonb_build_array('Critical incidents', 'Emergency stop active', 'Focus or quiet hours when configured')
  );
$$;

create or replace function public._gre_recognition_roses()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'emoji', '🌹',
    'label', 'Recognition Roses',
    'principle', 'Appreciation and gratitude — NOT romantic intent. Specific observations strengthen trust.',
    'boundary_note', 'Distinct from Presence & Comfort A.90 comfort roses — care during difficulty, not peer recognition.',
    'examples', jsonb_build_array(
      jsonb_build_object(
        'key', 'colleague_help',
        'text', '🌹 Thank you for the extra patience on that handoff — it made a real difference today.'
      ),
      jsonb_build_object(
        'key', 'red_rose_redirect',
        'text', 'When someone says "I love you Aipify" — warm trust language, then invite peer recognition.'
      ),
      jsonb_build_object(
        'key', 'specific_observation',
        'text', '🌹 Your clear summary saved the team twenty minutes — I noticed that effort.'
      ),
      jsonb_build_object(
        'key', 'pass_forward',
        'text', 'Would you like to send a Digital Recognition Rose to someone who helped you today?'
      )
    ),
    'digital_rose_symbol', 'Digital Recognition Rose (🌹) — appreciation in everyday work.'
  );
$$;

create or replace function public._gre_self_recognition()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Encourage acknowledging own efforts — healthy self-recognition, not vanity or pressure.',
    'examples', jsonb_build_array(
      'You completed a demanding task with honest effort — that counts.',
      'Progress without perfection — celebrate what moved forward today.',
      'Recovery after a busy period is an accomplishment worth noting.',
      'Learning growth matters — not only polished outcomes.'
    ),
    'target_role', 'self',
    'self_love_note', 'Self Love includes self-recognition without perfectionism — sustainable growth over burnout.'
  );
$$;

create or replace function public._gre_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love influences recognition through appreciation, reduced perfectionism, effort celebration, and sustainable growth.',
    'not_a_toggle', true,
    'influences', jsonb_build_array(
      'Appreciation without perfectionism pressure',
      'Celebrate effort and honest progress',
      'Self-recognition as healthy practice',
      'Rest and recovery as accomplishments worth noting',
      'Sustainable growth — never guilt-based motivation'
    ),
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. No ™ in product copy.'
  );
$$;

create or replace function public._gre_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Authentic recognition builds trust — avoid excessive or generic praise; prefer specific observations.',
    'prefer', jsonb_build_array(
      'Specific observations of effort or impact',
      'Timely acknowledgment — not delayed annual-only praise',
      'Inclusive recognition — diverse contributions seen',
      'Metadata only — display labels and approved summaries'
    ),
    'avoid', jsonb_build_array(
      'Generic superlatives without substance',
      'Excessive praise that feels transactional',
      'Romantic or intimate reciprocation toward Aipify',
      'Storing raw messages, emails, or PII in recognition records'
    ),
    'audit_note', 'Rose sends and settings changes logged via _gre_log() — full transparency, metadata only.'
  );
$$;

create or replace function public._gre_org_configuration_boundaries()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'configurable', jsonb_build_array(
      jsonb_build_object('key', 'enabled', 'label', 'Recognition engine master toggle', 'via', 'organization_gratitude_recognition_settings.enabled'),
      jsonb_build_object('key', 'digital_rose_enabled', 'label', 'Recognition roses', 'via', 'digital_rose_enabled'),
      jsonb_build_object('key', 'gratitude_moments_enabled', 'label', 'Gratitude moments and bell cues', 'via', 'gratitude_moments_enabled'),
      jsonb_build_object('key', 'redirect_romantic_language', 'label', 'Red Rose Moment redirects', 'via', 'redirect_romantic_language'),
      jsonb_build_object('key', 'bell_moments_enabled', 'label', 'Bell moment preference', 'via', 'metadata.bell_moments_enabled'),
      jsonb_build_object('key', 'celebration_frequency', 'label', 'Celebration frequency scaffold', 'via', 'metadata.celebration_frequency (reserved · balanced · frequent)'),
      jsonb_build_object('key', 'milestone_thresholds', 'label', 'Milestone thresholds', 'via', 'metadata.milestone_thresholds jsonb scaffold')
    ),
    'consistent', jsonb_build_array(
      'Recognition roses are appreciation — not romance',
      'Comfort roses remain in Presence & Comfort A.90',
      'Specific observations over generic praise',
      'Humans decide — Aipify suggests and prepares',
      'Metadata only — no raw conversation content'
    ),
    'boundary_note', 'Organizations tune expression frequency; core recognition boundaries remain consistent.'
  );
$$;

create or replace function public._gre_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates recognition internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — bell moments, recognition roses, Red Rose Moment boundaries',
      'focus', jsonb_build_array('Module cross-links', 'Companion Identity recognition cues', 'Authentic praise ILM review')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — peer appreciation in support and commerce workflows',
      'focus', jsonb_build_array('Customer praise moments', 'Team milestone celebrations', 'Digital roses in daily work')
    )
  );
$$;

create or replace function public._gre_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Cultures where appreciation, gratitude, and recognition are natural in everyday work.',
    'Recognition strengthens people — small gestures create lasting memories.',
    '🔔 Small celebration — your team reached a milestone worth noticing.',
    '🌹 Someone noticed your effort today. Would you like to pass that appreciation forward?',
    'I could not do this before. Thank you for helping me become who I am today.',
    'Digital rose as symbol someone noticed effort or kindness — technology strengthens human connection.'
  );
$$;

create or replace function public.get_gratitude_recognition_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_moments int := 0;
  v_roses int := 0;
  v_pending int := 0;
begin
  perform public._irp_require_permission('gratitude_recognition.view');
  v_org_id := public._mta_require_organization();
  perform public._gre_ensure_settings(v_org_id);
  perform public._gre_seed_moments(v_org_id);

  select count(*) into v_moments
  from public.organization_gratitude_moments where organization_id = v_org_id;

  select count(*) into v_roses
  from public.organization_digital_rose_recognitions where organization_id = v_org_id;

  select count(*) into v_pending
  from public.organization_gratitude_moments
  where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Sincere, human recognition strengthens relationships — help people express appreciation.',
    'moment_count', v_moments,
    'rose_count', v_roses,
    'pending_moments', v_pending,
    'enabled', (select enabled from public.organization_gratitude_recognition_settings where organization_id = v_org_id),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 9 — Recognition & Celebration Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE9_RECOGNITION_CELEBRATION_FOUNDATION.md',
      'engine_phase', 'A.89 Gratitude & Recognition Engine',
      'route', '/app/gratitude-recognition-engine'
    ),
    'gratitude_recognition_engine_note', 'Recognition & Celebration Foundation (ABOS Phase 9) — extends Gratitude & Recognition Engine (Phase A.89).'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_gratitude_recognition_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_gratitude_recognition_settings;
begin
  perform public._irp_require_permission('gratitude_recognition.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._gre_ensure_settings(v_org_id);
  perform public._gre_seed_moments(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy',
      'Sincere, human recognition strengthens relationships — help people express appreciation in everyday work.',
    'mission',
      'Notice effort, celebrate milestones, and express appreciation more frequently — genuine, timely, human, encouraging, inclusive.',
    'abos_principle',
      'Recognition strengthens people — small gestures create lasting memories.',
    'vision',
      'Cultures where appreciation, gratitude, and recognition are natural in everyday work.',
    'distinction_note',
      'Distinct from Human Success Phase 82 (/app/human-success), Wonder Engine A.88, Legacy A.86, Humor & Personal Connection (/app/personality), and Relationship Intelligence A.78/RSI. Also distinct from Presence & Comfort A.90 (/app/presence-comfort-protocol) — comfort roses vs recognition roses. Gratitude & Recognition A.89 = peer appreciation, digital rose gestures, gratitude moments, boundary-safe warmth.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 9 — Recognition & Celebration Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE9_RECOGNITION_CELEBRATION_FOUNDATION.md',
      'engine_phase', 'A.89 Gratitude & Recognition Engine',
      'route', '/app/gratitude-recognition-engine',
      'mapping_note', 'ABOS Blueprint Phase 9 maps to Gratitude & Recognition Engine A.89 — extend, do not duplicate.'
    ),
    'gratitude_recognition_engine_note', 'Recognition & Celebration Foundation (ABOS Phase 9) — extends Gratitude & Recognition Engine (Phase A.89).',
    'recognition_categories', public._gre_recognition_categories(),
    'bell_moments', public._gre_bell_moments(),
    'recognition_roses', public._gre_recognition_roses(),
    'self_recognition', public._gre_self_recognition(),
    'self_love_connection', public._gre_self_love_connection(),
    'trust_connection', public._gre_trust_connection(),
    'org_configuration_boundaries', public._gre_org_configuration_boundaries(),
    'dogfooding', public._gre_blueprint_dogfooding(),
    'success_criteria', public._gre_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._gre_vision_phrases(),
    'gratitude_moment_types', public._gre_gratitude_moment_types(),
    'red_rose_moment', public._gre_red_rose_moment(),
    'boundary_phrases', public._gre_boundary_phrases(),
    'self_love_note', public._gre_self_love_note(),
    'trust_note', public._gre_trust_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_moments', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'moment_type', m.moment_type,
          'summary', m.summary,
          'recognition_target_role', m.recognition_target_role,
          'status', m.status,
          'metadata', m.metadata,
          'created_at', m.created_at,
          'updated_at', m.updated_at
        ) order by m.created_at desc
      )
      from (
        select * from public.organization_gratitude_moments
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) m
    ), '[]'::jsonb),
    'recent_roses', jsonb_build_object(
      'count', coalesce((
        select count(*) from public.organization_digital_rose_recognitions
        where organization_id = v_org_id
      ), 0),
      'last_sent_at', (
        select max(rose_sent_at) from public.organization_digital_rose_recognitions
        where organization_id = v_org_id
      )
    ),
    'summary', jsonb_build_object(
      'moment_count', coalesce((
        select count(*) from public.organization_gratitude_moments where organization_id = v_org_id
      ), 0),
      'moments_by_type', coalesce((
        select jsonb_object_agg(moment_type, cnt)
        from (
          select moment_type, count(*) as cnt
          from public.organization_gratitude_moments
          where organization_id = v_org_id
          group by moment_type
        ) t
      ), '{}'::jsonb),
      'moments_by_status', coalesce((
        select jsonb_object_agg(status, cnt)
        from (
          select status, count(*) as cnt
          from public.organization_gratitude_moments
          where organization_id = v_org_id
          group by status
        ) s
      ), '{}'::jsonb),
      'rose_count', coalesce((
        select count(*) from public.organization_digital_rose_recognitions
        where organization_id = v_org_id
      ), 0),
      'digital_rose_enabled', v_settings.digital_rose_enabled,
      'gratitude_moments_enabled', v_settings.gratitude_moments_enabled
    ),
    'integration_links', jsonb_build_object(
      'companion_identity', '/app/companion-identity-engine',
      'personality', '/app/personality',
      'presence_comfort', '/app/presence-comfort-protocol',
      'presence_comfort_note', 'Comfort roses (A.90) — distinct from recognition roses (A.89)',
      'self_love_naming', 'SELF_LOVE_NAMING_STANDARD.md',
      'human_success', '/app/human-success',
      'relationship_intelligence', '/app/relationship-intelligence-engine',
      'inclusion_humanity', '/app/inclusion-humanity-engine',
      'impact_engine', '/app/impact-engine',
      'legacy_engine', '/app/legacy-engine',
      'wonder_engine', '/app/wonder-engine',
      'purpose_values', '/app/purpose-values-engine',
      'recognition_blueprint', 'IMPLEMENTATION_BLUEPRINT_PHASE9_RECOGNITION_CELEBRATION_FOUNDATION.md'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('gratitude_recognition.manage'),
      'can_export', public._irp_has_permission('gratitude_recognition.export'),
      'can_send_rose', public._irp_has_permission('gratitude_recognition.rose.send')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._gre_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'gratitude-recognition-blueprint', 'Recognition & Celebration (ABOS Phase 9)',
  'Recognition and celebration foundation — extends Gratitude & Recognition Engine A.89.',
  'authenticated', 110
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'gratitude-recognition-blueprint' and tenant_id is null
);
