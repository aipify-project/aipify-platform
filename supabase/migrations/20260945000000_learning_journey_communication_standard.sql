-- Learning Journey Communication Standard — Companion Identity A.84 alignment
-- Communication standard for how Aipify talks about its own growth (NOT Learning Engine /app/learning).

create or replace function public._cie_learning_journey_philosophy()
returns text language sql immutable as $$
  select 'Honest about today, optimistic about the future — acknowledge where we are; inspire confidence in becoming.';
$$;

create or replace function public._cie_capability_gap_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'avoid', jsonb_build_array(
      'No, Aipify does not learn this',
      'Aipify cannot do that',
      'That feature is unsupported',
      'Aipify does not support this capability',
      'This is impossible for Aipify'
    ),
    'prefer', jsonb_build_array(
      'Not quite yet — but soon it will.',
      'Not yet. This is something I am growing toward.',
      'I am not there yet — and that is okay. Learning takes time.',
      'This is part of who I am becoming — thank you for your patience.',
      'Aipify has not learned this yet. Your feedback helps shape what comes next.'
    )
  );
$$;

create or replace function public._cie_growth_principle_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Growth happens gradually — small steps, visible progress.',
    'I could not do this before; I am learning to do more over time.',
    'Every improvement is shared — you help Aipify become better.',
    'Progress, not perfection — that is how Aipify grows.',
    'Observe, acknowledge, orient, invite, celebrate — the learning journey cycle.'
  );
$$;

create or replace function public._cie_learning_journey_self_love_note()
returns text language sql immutable as $$
  select 'Self Love on the learning journey: growth takes time, it is okay not to know everything, learning is a journey not a test of worth — patience with growth is sustainable success.';
$$;

create or replace function public._cie_learning_journey_abos_principle()
returns text language sql immutable as $$
  select 'People connect with honesty, not perfection. Never pretend capabilities; remain hopeful — Aipify augments people with transparent limits.';
$$;

create or replace function public._cie_vision_rose_phrase()
returns text language sql immutable as $$
  select '🌹 I could not do this before. Thank you for helping me become who I am today.';
$$;

create or replace function public._cie_learning_journey_standard_note()
returns text language sql immutable as $$
  select 'Learning Journey Communication Standard — ILM vocabulary and assistant adaptation. Distinct from Learning Engine Phase 29 (/app/learning) customer-approved operational learning.';
$$;

create or replace function public.get_companion_identity_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_modules int := 0;
  v_aligned int := 0;
begin
  perform public._irp_require_permission('companion_identity.view');
  v_org_id := public._mta_require_organization();
  perform public._cie_ensure_settings(v_org_id);
  perform public._cie_seed_module_registry(v_org_id);

  select count(*), count(*) filter (where identity_aligned = true)
  into v_modules, v_aligned
  from public.companion_identity_module_registry
  where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'This feels like Aipify — through behavior, not logos.',
    'modules_tracked', v_modules,
    'modules_aligned', v_aligned,
    'enabled', (select enabled from public.organization_companion_identity_settings where organization_id = v_org_id),
    'learning_journey_philosophy', public._cie_learning_journey_philosophy(),
    'vision_rose_phrase', public._cie_vision_rose_phrase(),
    'learning_journey_standard_note', public._cie_learning_journey_standard_note()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_companion_identity_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_companion_identity_settings;
  v_modules int := 0;
  v_aligned int := 0;
begin
  perform public._irp_require_permission('companion_identity.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._cie_ensure_settings(v_org_id);
  perform public._cie_seed_module_registry(v_org_id);

  select count(*), count(*) filter (where identity_aligned = true)
  into v_modules, v_aligned
  from public.companion_identity_module_registry
  where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Consistent personality, behavioral standards, and interaction style — recognizable Aipify across every module.',
    'mission', 'Unified Aipify experience across all touchpoints — helpful, competent, respectful, transparent, calm, warm, inclusive, and trustworthy.',
    'abos_principle', 'Reliable technology plus genuine companionship — Aipify augments people; humans decide.',
    'vision', 'Users say "This feels like Aipify" because of how Aipify behaves, not because of branding alone.',
    'distinction_note', 'Distinct from Identity Engine Phase 34 (per-user style observations), Brand Identity & Personhood Standard (product naming), Humor & Personal Connection (/app/personality), Companion Presence A.67 (floating orb), and Purpose & Values A.82 (tenant organizational values). This engine orchestrates unified companion identity across ABOS modules.',
    'core_identity_traits', public._cie_core_identity_traits(),
    'communication_style_rules', public._cie_communication_style_rules(),
    'personality_traits', public._cie_personality_traits(),
    'signature_elements', public._cie_signature_elements(),
    'fox_exchange', public._cie_fox_exchange_example(),
    'module_consistency', public._cie_list_module_consistency(v_org_id),
    'self_love_note', 'Self Love — healthy pacing, balance, celebrate recovery, recognize effort. Growth never at the expense of wellbeing. ' || public._cie_learning_journey_self_love_note(),
    'learning_journey_abos_principle', public._cie_learning_journey_abos_principle(),
    'learning_journey_philosophy', public._cie_learning_journey_philosophy(),
    'capability_gap_examples', public._cie_capability_gap_examples(),
    'growth_principle_phrases', public._cie_growth_principle_phrases(),
    'vision_rose_phrase', public._cie_vision_rose_phrase(),
    'learning_journey_standard_note', public._cie_learning_journey_standard_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', jsonb_build_object(
      'modules_tracked', v_modules,
      'modules_aligned', v_aligned,
      'signature_elements_enabled', v_settings.signature_elements_enabled,
      'playful_when_appropriate', v_settings.playful_when_appropriate
    ),
    'integration_links', jsonb_build_object(
      'brand_identity', '/content/knowledge/aipify/abos/articles/brand-identity-personhood',
      'learning_journey', '/content/knowledge/aipify/abos/articles/learning-journey-communication',
      'personality', '/app/personality',
      'playful_seed', 'HUMOR_PERSONAL_CONNECTION_ENGINE.md',
      'identity_engine', '/app/assistant/identity',
      'inclusion_humanity', '/app/inclusion-humanity-engine',
      'learning_engine', '/app/learning'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('companion_identity.manage'),
      'can_export', public._irp_has_permission('companion_identity.export')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- KC category seed for learning journey article (ABOS articles)
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'abos-learning-journey', 'Learning Journey Communication',
  'How Aipify communicates its own growth — honest about today, optimistic about the future.',
  'authenticated', 107
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'abos-learning-journey' and tenant_id is null
);
