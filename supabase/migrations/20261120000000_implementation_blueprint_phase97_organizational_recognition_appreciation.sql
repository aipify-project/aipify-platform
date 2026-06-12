-- Implementation Blueprint Phase 97 — Organizational Recognition & Appreciation Engine
-- Extends Gratitude & Recognition Engine (Phase A.89 + Phase 9 + Phase 53). No new tables.
-- Phase number collision: Repo Phase 97 Future Technologies (/app/future-tech) + Blueprint Phase 63 Future Readiness.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._oraebp97_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 97 — Organizational Recognition & Appreciation Engine at /app/gratitude-recognition-engine. Extends Gratitude & Recognition Engine Phase A.89 and preserves ALL Blueprint Phase 9 (_gre_*) and Phase 53 (_lehmbp_*) dashboard fields. Organizational recognition strengthens belonging through authentic appreciation — not transactional competition. Distinct from Future Technologies & Emerging Interfaces repo Phase 97 at /app/future-tech (Blueprint Phase 63 Future Readiness extends that surface — phase number collision only). Distinct from Presence & Comfort A.90 (/app/presence-comfort-protocol) — comfort roses vs recognition roses. Cross-links Self Love A.76, Purpose & Values Blueprint Phase 95, Organizational Health Blueprint Phase 96 (/app/organizational-health-engine), Community Phase 89, Sales Expert A.95, Life Events Phase 53, Wonder A.88, Hope A.92. Helpers use _oraebp97_* — never collide with _gre_* or _lehmbp_*.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._oraebp97_mission()
returns text language sql immutable as $$
  select 'Strengthen belonging, motivation, and connection through intentional, authentic recognition.';
$$;

create or replace function public._oraebp97_philosophy()
returns text language sql immutable as $$
  select 'Recognition genuine, not transactional — people who feel appreciated engage more. Appreciation is not competition; celebrate contribution without forced visibility.';
$$;

create or replace function public._oraebp97_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — authentic recognition strengthens culture. Aipify prepares gentle prompts and metadata summaries; humans decide who to appreciate and how to celebrate.';
$$;

create or replace function public._oraebp97_vision()
returns text language sql immutable as $$
  select 'We celebrate the people who make our mission possible.';
$$;

create or replace function public._oraebp97_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'peer_appreciation', 'label', 'Peer appreciation culture', 'emoji', '🌹', 'description', 'Everyday colleague recognition — digital roses and gratitude moments with boundary-safe warmth'),
    jsonb_build_object('key', 'leadership_recognition', 'label', 'Leadership recognition', 'emoji', '🦉', 'description', 'Leaders model appreciation consistently — aggregate insights, not surveillance'),
    jsonb_build_object('key', 'customer_appreciation', 'label', 'Customer appreciation', 'emoji', '❤️', 'description', 'Customer praise and service excellence celebrated — metadata summaries only'),
    jsonb_build_object('key', 'sales_expert_milestones', 'label', 'Sales Expert milestones', 'emoji', '🔔', 'description', 'Partner certification and community wins — cross-link Sales Expert A.95'),
    jsonb_build_object('key', 'mentorship_kindness', 'label', 'Mentorship & kindness', 'emoji', '🌹', 'description', 'Quiet helpers and mentors seen — not only loud contributors'),
    jsonb_build_object('key', 'organizational_celebration', 'label', 'Organizational celebration', 'emoji', '🔔', 'description', 'Launches, anniversaries, team wins — without leaderboards or popularity contests')
  );
$$;

create or replace function public._oraebp97_recognition_moments()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recognition moments honor meaningful contribution — metadata categories only, never forced public display.',
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'anniversaries', 'label', 'Work anniversaries', 'emoji', '🔔', 'description', 'Tenure milestones — cross-link Phase 53 Human Moments consent scaffold', 'cross_link', 'Phase 53'),
      jsonb_build_object('key', 'launches', 'label', 'Product & project launches', 'emoji', '🦉', 'description', 'Team launches and meaningful delivery milestones — celebrate effort, not vanity metrics'),
      jsonb_build_object('key', 'customer_praise', 'label', 'Customer praise', 'emoji', '❤️', 'description', 'Customer appreciation and service excellence — cross-link Business DNA and support operations'),
      jsonb_build_object('key', 'kindness', 'label', 'Acts of kindness', 'emoji', '🌹', 'description', 'Steady support, patience, and everyday care — quiet contributors deserve visibility'),
      jsonb_build_object('key', 'mentorship', 'label', 'Mentorship', 'emoji', '🦉', 'description', 'Knowledge sharing and guidance — cross-link Employee Knowledge and Community Phase 89'),
      jsonb_build_object('key', 'sales_expert_milestones', 'label', 'Sales Expert milestones', 'emoji', '🔔', 'description', 'Certification and partner community wins — cross-link Sales Expert A.95 Phase 47')
    ),
    'boundary_note', 'Moments are voluntary celebrations — never mandatory public recognition or comparison leaderboards.'
  );
$$;

create or replace function public._oraebp97_companion_recognition_prompts()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion recognition prompts — warm, optional, non-intrusive. Never mandatory participation.',
    'prompts', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'peer_appreciation', 'prompt', 'Would you like to send a Digital Recognition Rose to someone whose steady support made a difference this week?', 'consideration', 'Quiet contributors deserve appreciation — voluntary gesture'),
      jsonb_build_object('emoji', '❤️', 'key', 'customer_praise', 'prompt', 'Customer praise arrived — shall Aipify prepare a brief celebration summary for the team that earned it?', 'consideration', 'Service excellence celebrated — metadata only'),
      jsonb_build_object('emoji', '🦉', 'key', 'mentorship_thanks', 'prompt', 'A mentorship moment was noted — would a gentle thank-you to the mentor feel appropriate?', 'consideration', 'Cross-link Employee Knowledge and Community Phase 89'),
      jsonb_build_object('emoji', '🔔', 'key', 'launch_celebration', 'prompt', 'A meaningful milestone was reached — would a quiet bell moment honor the team effort?', 'consideration', 'Celebrate delivery without vanity metrics or forced broadcast')
    ),
    'companion_identity_route', '/app/companion-identity-engine',
    'boundary_note', 'Companion scaffolds appreciation — humans decide; never auto-send recognition or public ranking.'
  );
$$;

create or replace function public._oraebp97_peer_recognition()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Peer recognition — voluntary appreciation between colleagues with boundary-safe warmth.',
    'gestures', jsonb_build_array(
      jsonb_build_object('key', 'digital_rose', 'label', 'Digital Recognition Rose', 'emoji', '🌹', 'description', 'Symbolic appreciation — not romance; display label only'),
      jsonb_build_object('key', 'gratitude_moment', 'label', 'Gratitude moment', 'emoji', '❤️', 'description', 'Metadata summary of appreciation — exceptional support, consistent helper, above and beyond'),
      jsonb_build_object('key', 'bell_moment', 'label', 'Bell moment', 'emoji', '🔔', 'description', 'Quiet team celebration — cross-link Phase 9 bell moments')
    ),
    'quiet_contributor_note', 'Steady helpers and behind-the-scenes contributors deserve recognition — not only visible heroics.',
    'settings_keys', jsonb_build_array('digital_rose_enabled', 'gratitude_moments_enabled')
  );
$$;

create or replace function public._oraebp97_leadership_recognition()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership recognition — model appreciation consistently; aggregate patterns for dialogue, not surveillance.',
    'practices', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'consistent_appreciation', 'label', 'Consistent appreciation', 'description', 'Leaders celebrate effort and milestones — not only outcomes'),
      jsonb_build_object('emoji', '🌹', 'key', 'quiet_contributors', 'label', 'See quiet contributors', 'description', 'Recognition includes steady support — not popularity contests'),
      jsonb_build_object('emoji', '❤️', 'key', 'customer_care', 'label', 'Celebrate customer care', 'description', 'Customer praise shared with teams that earned it'),
      jsonb_build_object('emoji', '🔔', 'key', 'team_wins', 'label', 'Team wins without comparison', 'description', 'Organizational celebration without leaderboards')
    ),
    'boundary_note', 'Leadership sees aggregate celebration metadata — no individual ranking or output-only metrics.'
  );
$$;

create or replace function public._oraebp97_customer_appreciation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Customer appreciation — celebrate service excellence and customer praise with metadata summaries only.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '❤️', 'key', 'customer_praise', 'label', 'Customer praise', 'description', 'Positive customer feedback celebrated with the team — no raw chat content'),
      jsonb_build_object('emoji', '🌹', 'key', 'service_excellence', 'label', 'Service excellence', 'description', 'Exceptional support moments — cross-link Autonomous Support Operations'),
      jsonb_build_object('emoji', '🦉', 'key', 'care_consistency', 'label', 'Consistent care', 'description', 'Steady customer-care effort acknowledged — not only crisis heroics'),
      jsonb_build_object('emoji', '🔔', 'key', 'team_celebration', 'label', 'Team celebration', 'description', 'Quiet bell when customer appreciation arrives — optional broadcast')
    ),
    'business_dna_route', '/app/settings/business-dna',
    'support_operations_route', '/app/settings/support-operations',
    'boundary_note', 'Customer appreciation metadata only — never store raw email, chat, or PII in recognition RPCs.'
  );
$$;

create or replace function public._oraebp97_sales_expert_recognition()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sales Expert recognition — celebrate certification, mentorship, and community contribution — cross-link A.95.',
    'milestones', jsonb_build_array(
      jsonb_build_object('emoji', '🔔', 'key', 'certification', 'label', 'Certification earned', 'description', 'Sales Expert and Elite tiers — human review deserves celebration'),
      jsonb_build_object('emoji', '🦉', 'key', 'mentorship', 'label', 'Partner mentorship', 'description', 'Guidance in partner community — Phase 47 cross-link'),
      jsonb_build_object('emoji', '🌹', 'key', 'community_contribution', 'label', 'Community contribution', 'description', 'Forum answers and advisory participation — metadata only'),
      jsonb_build_object('emoji', '❤️', 'key', 'stewardship', 'label', 'Ethical stewardship', 'description', 'Customer-care culture in sales — cross-link Purpose & Values Phase 95')
    ),
    'sales_expert_route', '/app/sales-expert-engine',
    'community_phase', 47,
    'boundary_note', 'Partner portal milestones live in Sales Expert — aggregate celebration counts here only.'
  );
$$;

create or replace function public._oraebp97_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — appreciation of steady progress without perfection pressure; recognition without earning exhaustion.',
    'quotes', jsonb_build_array(
      'You do not need to earn appreciation through burnout.',
      'Steady contribution deserves recognition — not only visible heroics.',
      'Celebrate progress at a human pace — sustainable growth, one moment at a time.',
      'Appreciation is not a competition — your worth is not measured by leaderboard position.'
    ),
    'practices', jsonb_build_array(
      'Celebrate effort and recovery — not only polished outcomes',
      'Recognition optional — never mandatory public visibility',
      'Gratitude for perseverance during demanding seasons',
      'Sustainable engagement — cross-link Self Love A.76 rhythms'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'boundary_note', 'Self Love supports wellbeing rhythms — principle cross-link only; recognition stores metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._oraebp97_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — aggregate recognition patterns encourage dialogue; never popularity contests or output-only metrics.',
    'insights', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'celebration_balance', 'label', 'Celebration balance', 'description', 'Are quiet contributors receiving appreciation alongside visible wins?'),
      jsonb_build_object('emoji', '🌹', 'key', 'appreciation_frequency', 'label', 'Appreciation frequency', 'description', 'Aggregate moment and rose counts — metadata trends only'),
      jsonb_build_object('emoji', '❤️', 'key', 'customer_praise_patterns', 'label', 'Customer praise patterns', 'description', 'Customer appreciation moments by category — no raw content'),
      jsonb_build_object('emoji', '🔔', 'key', 'milestone_coverage', 'label', 'Milestone coverage', 'description', 'Anniversaries, launches, and certifications celebrated — consent-first where applicable')
    ),
    'organizational_health_route', '/app/organizational-health-engine',
    'boundary_note', 'Insights are illustrative metadata — leaders decide action; no hidden individual scoring.'
  );
$$;

create or replace function public._oraebp97_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent recognition — voluntary gestures, explainable prompts, metadata-only summaries.',
    'users_should_see', jsonb_build_array(
      'How recognition moments and roses are recorded — metadata summaries only',
      'Optional companion prompts — dismiss or snooze anytime',
      'Privacy controls for human moments — Phase 53 consent scaffold preserved',
      'Boundary between recognition roses (A.89) and comfort roses (A.90)'
    ),
    'operators_should_understand', jsonb_build_array(
      'Recognition is scaffolding — not automated praise bots or mandatory participation',
      'Aggregate leadership insights — never individual surveillance or ranking',
      'Cross-links Trust & Action Engine — sensitive celebrations may need approval context',
      'Full audit via gratitude recognition settings changes and rose sends'
    ),
    'audit_note', 'gre_settings_changed, gre_rose_sent, gre_report_exported — metadata only.'
  );
$$;

create or replace function public._oraebp97_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Appreciation not competition — privacy and dignity in organizational recognition.',
    'must_avoid', jsonb_build_array(
      'Forced public recognition or mandatory celebration participation',
      'Popularity contests, leaderboards, and comparison ranking',
      'Output-only metrics that ignore quiet contributors and steady support',
      'Ignoring behind-the-scenes helpers while celebrating only visible heroics'
    ),
    'required', jsonb_build_array(
      'Voluntary appreciation gestures — humans initiate recognition',
      'Metadata-only summaries — no raw customer content or PII',
      'Inclusive celebration framing — quiet contributors visible',
      'Consent-first human moments — Phase 53 settings preserved'
    ),
    'boundary_note', 'Aipify scaffolds authentic recognition — individuals and organizations retain agency.'
  );
$$;

create or replace function public._oraebp97_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates organizational recognition patterns internally — companion tone, Sales Expert cross-links, leadership appreciation, community, and KC.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — companion milestones, Sales Expert recognition, leadership appreciation, community mentorship thanks',
      'focus', jsonb_build_array(
        'Companion recognition prompt tone review (🌹❤️🦉🔔)',
        'Sales Expert certification celebration cross-links',
        'Leadership appreciation consistency — aggregate metadata only',
        'Community Phase 89 mentorship thanks — cross-link only',
        'Knowledge Center FAQ validation — implementation-blueprint-phase97-faq'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — customer appreciation and team celebration in commerce operations',
      'focus', jsonb_build_array(
        'Customer praise celebration metadata in support workflows',
        'Peer appreciation roses in team operations',
        'Launch milestone quiet bell moments',
        'Consent-first anniversary scaffold cross-link Phase 53'
      )
    )
  );
$$;

create or replace function public._oraebp97_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We celebrate the people who make our mission possible.',
    'Recognition genuine, not transactional — appreciation strengthens belonging.',
    '🌹 A quiet rose for steady support — voluntary, boundary-safe warmth.',
    '❤️ Customer praise shared with the team that earned it — metadata only.',
    '🦉 Mentorship and kindness deserve visibility — not only loud wins.',
    '🔔 Milestones honored without leaderboards — celebration not competition.',
    'Quiet contributors matter — appreciation is not a popularity contest.',
    'Humans decide who to celebrate; Aipify informs and prepares.'
  );
$$;

create or replace function public._oraebp97_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'presence_comfort', 'label', 'Presence & Comfort (A.90)', 'route', '/app/presence-comfort-protocol', 'note', 'Comfort roses — distinct from recognition roses'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable pacing — principle cross-link'),
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values (Blueprint Phase 95)', 'route', '/app/purpose-values-engine', 'note', 'Value-aligned celebration reinforcement'),
    jsonb_build_object('key', 'organizational_health', 'label', 'Organizational Health (Blueprint Phase 96)', 'route', '/app/organizational-health-engine', 'note', 'Employee experience wellbeing — aggregate cross-link'),
    jsonb_build_object('key', 'community', 'label', 'Community & Collective Intelligence (Phase 89)', 'route', '/app/community-collective-intelligence-engine', 'note', 'Community contribution celebration'),
    jsonb_build_object('key', 'sales_expert', 'label', 'Sales Expert Operating System (A.95)', 'route', '/app/sales-expert-engine', 'note', 'Certification and partner milestones'),
    jsonb_build_object('key', 'human_moments', 'label', 'Life Events & Human Moments (Phase 53)', 'route', '/app/gratitude-recognition-engine', 'note', 'Consent-based anniversaries — preserved'),
    jsonb_build_object('key', 'wonder', 'label', 'Wonder Engine (A.88)', 'route', '/app/wonder-engine', 'note', 'Amazement distinct from appreciation'),
    jsonb_build_object('key', 'hope', 'label', 'Hope Engine (A.92)', 'route', '/app/hope-engine', 'note', 'Encouragement during difficulty — distinct'),
    jsonb_build_object('key', 'companion_identity', 'label', 'Companion Identity (A.84)', 'route', '/app/companion-identity-engine'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'route', '/app/settings/employee-knowledge', 'note', 'Mentorship and onboarding paths'),
    jsonb_build_object('key', 'future_tech', 'label', 'Future Technologies (repo Phase 97)', 'route', '/app/future-tech', 'note', 'Phase number collision — distinct surface'),
    jsonb_build_object('key', 'recognition_blueprint_phase9', 'label', 'Recognition Foundation (Phase 9)', 'route', '/app/gratitude-recognition-engine', 'note', 'Preserved bell moments and categories')
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Live recognition summary + seed
-- ---------------------------------------------------------------------------
create or replace function public._oraebp97_seed_organizational_recognition_moments(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_gratitude_moments
    where organization_id = p_organization_id
      and coalesce(metadata->>'organizational_recognition', 'false') = 'true'
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_gratitude_moments (
    organization_id, moment_type, summary, recognition_target_role, status, metadata
  ) values
    (p_organization_id, 'customer_appreciation',
     'Customer praise noted — service excellence celebrated with the team that earned it.',
     'team', 'celebrated',
     '{"seed": true, "organizational_recognition": true, "recognition_category": "customer_praise", "metadata_only": true}'::jsonb),
    (p_organization_id, 'consistent_helper',
     'Mentorship thanks — quiet guidance strengthened a colleague this month.',
     'colleague', 'acknowledged',
     '{"seed": true, "organizational_recognition": true, "recognition_category": "mentorship", "metadata_only": true}'::jsonb),
    (p_organization_id, 'milestone',
     'Product launch milestone — team delivery honored without comparison leaderboard.',
     'team', 'pending',
     '{"seed": true, "organizational_recognition": true, "recognition_category": "launches", "metadata_only": true}'::jsonb),
    (p_organization_id, 'above_and_beyond',
     'Act of kindness — steady support during a demanding week acknowledged.',
     'colleague', 'pending',
     '{"seed": true, "organizational_recognition": true, "recognition_category": "kindness", "metadata_only": true}'::jsonb);
end; $$;

create or replace function public._oraebp97_recognition_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_recognition_count int := 0;
  v_rose_count int := 0;
  v_pending int := 0;
  v_by_category jsonb := '{}'::jsonb;
begin
  perform public._gre_ensure_settings(p_organization_id);
  perform public._gre_seed_moments(p_organization_id);
  perform public._oraebp97_seed_organizational_recognition_moments(p_organization_id);

  select count(*) into v_org_recognition_count
  from public.organization_gratitude_moments
  where organization_id = p_organization_id
    and coalesce(metadata->>'organizational_recognition', 'false') = 'true';

  select count(*) into v_rose_count
  from public.organization_digital_rose_recognitions
  where organization_id = p_organization_id;

  select count(*) into v_pending
  from public.organization_gratitude_moments
  where organization_id = p_organization_id
    and coalesce(metadata->>'organizational_recognition', 'false') = 'true'
    and status = 'pending';

  select coalesce(jsonb_object_agg(category, cnt), '{}'::jsonb) into v_by_category
  from (
    select coalesce(metadata->>'recognition_category', 'uncategorized') as category, count(*) as cnt
    from public.organization_gratitude_moments
    where organization_id = p_organization_id
      and coalesce(metadata->>'organizational_recognition', 'false') = 'true'
    group by coalesce(metadata->>'recognition_category', 'uncategorized')
  ) t;

  return jsonb_build_object(
    'organizational_recognition_count', v_org_recognition_count,
    'rose_count', v_rose_count,
    'pending_recognition_moments', v_pending,
    'recognition_counts_by_category', v_by_category,
    'companion_prompts_documented', jsonb_array_length(public._oraebp97_companion_recognition_prompts()->'prompts'),
    'privacy_note', 'Aggregate recognition counts and category metadata only — no names, raw customer content, or PII.',
    'summary_text', format(
      '%s organizational recognition moments; %s digital roses; %s pending celebrations.',
      v_org_recognition_count, v_rose_count, v_pending
    )
  );
end; $$;

create or replace function public._oraebp97_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_org_count int := 0;
begin
  perform public._oraebp97_seed_organizational_recognition_moments(p_organization_id);
  v_summary := public._oraebp97_recognition_summary(p_organization_id);
  v_org_count := coalesce((v_summary->>'organizational_recognition_count')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Six organizational recognition objectives documented',
      'met', jsonb_array_length(public._oraebp97_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'recognition_moments',
      'label', 'Recognition moment categories — anniversaries through Sales Expert milestones',
      'met', jsonb_array_length(public._oraebp97_recognition_moments()->'categories') >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_prompts',
      'label', 'Companion recognition prompts — 🌹❤️🦉🔔 optional and warm',
      'met', jsonb_array_length(public._oraebp97_companion_recognition_prompts()->'prompts') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'peer_leadership_customer',
      'label', 'Peer, leadership, customer, and Sales Expert recognition documented',
      'met', (public._oraebp97_peer_recognition()->>'principle') is not null
        and (public._oraebp97_leadership_recognition()->>'principle') is not null
        and (public._oraebp97_customer_appreciation()->>'principle') is not null
        and (public._oraebp97_sales_expert_recognition()->>'principle') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'organizational_moments_recorded',
      'label', 'Organizational recognition moments recorded with metadata categories',
      'met', v_org_count >= 2,
      'note', case when v_org_count < 2 then 'Seed or capture moments with organizational_recognition metadata.' else null end
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy principles — no forced public recognition or popularity contests',
      'met', jsonb_array_length(public._oraebp97_privacy_principles()->'must_avoid') >= 4,
      'note', 'Appreciation not competition — quiet contributors included.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — recognition without earning exhaustion',
      'met', jsonb_array_length(public._oraebp97_self_love_connection()->'quotes') >= 2,
      'note', 'Cross-link Self Love A.76 — principle only.'
    ),
    jsonb_build_object(
      'key', 'comfort_boundary',
      'label', 'Distinct from Presence & Comfort A.90 comfort roses',
      'met', true,
      'note', 'Comfort roses live in /app/presence-comfort-protocol — recognition roses here.'
    ),
    jsonb_build_object(
      'key', 'phase53_preserved',
      'label', 'Phase 53 Human Moments fields preserved on dashboard',
      'met', to_regclass('public.human_moments_settings') is not null,
      'note', 'Consent-first life events — layered, not replaced.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links to Purpose & Values, Org Health, Community, Sales Expert, Wonder, Hope',
      'met', jsonb_array_length(public._oraebp97_integration_links()) >= 10,
      'note', 'Future Tech repo Phase 97 collision documented.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group and Unonight pilot scaffolds',
      'met', (public._oraebp97_dogfooding()->'aipify_group') is not null,
      'note', null
    )
  );
end; $$;

create or replace function public._oraebp97_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 97 — Organizational Recognition & Appreciation Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE97_ORGANIZATIONAL_RECOGNITION_APPRECIATION.md',
    'engine_phase', 'A.89 Gratitude & Recognition Engine',
    'route', '/app/gratitude-recognition-engine',
    'distinction_note', public._oraebp97_distinction_note(),
    'mission', public._oraebp97_mission(),
    'philosophy', public._oraebp97_philosophy(),
    'abos_principle', public._oraebp97_abos_principle(),
    'objectives', public._oraebp97_objectives(),
    'recognition_moments', public._oraebp97_recognition_moments(),
    'companion_recognition_prompts', public._oraebp97_companion_recognition_prompts(),
    'peer_recognition', public._oraebp97_peer_recognition(),
    'leadership_recognition', public._oraebp97_leadership_recognition(),
    'customer_appreciation', public._oraebp97_customer_appreciation(),
    'sales_expert_recognition', public._oraebp97_sales_expert_recognition(),
    'self_love_connection', public._oraebp97_self_love_connection(),
    'leadership_insights', public._oraebp97_leadership_insights(),
    'trust_connection', public._oraebp97_trust_connection(),
    'privacy_principles', public._oraebp97_privacy_principles(),
    'dogfooding', public._oraebp97_dogfooding(),
    'success_criteria', public._oraebp97_success_criteria(p_org_id),
    'vision', public._oraebp97_vision(),
    'vision_phrases', public._oraebp97_vision_phrases(),
    'integration_links', public._oraebp97_integration_links(),
    'recognition_summary', public._oraebp97_recognition_summary(p_org_id),
    'privacy_note', 'Organizational recognition metadata only — voluntary gestures, aggregate counts, no PII. Humans decide; Aipify informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 9 + Phase 53; append Phase 97
-- ---------------------------------------------------------------------------
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
  perform public._lehmbp_seed_human_moments(v_org_id);
  perform public._oraebp97_seed_organizational_recognition_moments(v_org_id);

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
    'gratitude_recognition_engine_note', 'Recognition & Celebration Foundation (ABOS Phase 9) — extends Gratitude & Recognition Engine (Phase A.89).',
    'implementation_blueprint_phase53', jsonb_build_object(
      'phase', 53,
      'title', 'Life Events & Human Moments Engine',
      'engine_phase', 'A.89',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE53_LIFE_EVENTS_HUMAN_MOMENTS.md',
      'route', '/app/gratitude-recognition-engine'
    ),
    'human_moments_mission', public._lehmbp_blueprint_mission(),
    'human_moments_summary', public._lehmbp_moments_summary(v_org_id),
    'implementation_blueprint_phase97', jsonb_build_object(
      'phase', 97,
      'title', 'Organizational Recognition & Appreciation Engine',
      'engine_phase', 'A.89',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE97_ORGANIZATIONAL_RECOGNITION_APPRECIATION.md',
      'route', '/app/gratitude-recognition-engine',
      'mapping_note', 'ABOS Blueprint Phase 97 extends A.89 with organizational recognition — preserves Phase 9 and Phase 53 fields. Distinct from Future Tech repo Phase 97.'
    ),
    'organizational_recognition_mission', public._oraebp97_mission(),
    'organizational_recognition_abos_principle', public._oraebp97_abos_principle(),
    'organizational_recognition_summary', public._oraebp97_recognition_summary(v_org_id),
    'organizational_recognition_note', 'Organizational Recognition & Appreciation Engine (ABOS Phase 97) — authentic appreciation without competition.',
    'organizational_recognition_vision_note', public._oraebp97_vision()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard RPC — preserve ALL Phase A.89 + Phase 9 + Phase 53; append Phase 97
-- ---------------------------------------------------------------------------
create or replace function public.get_gratitude_recognition_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_gratitude_recognition_settings;
  v_human_settings public.human_moments_settings;
begin
  perform public._irp_require_permission('gratitude_recognition.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._gre_ensure_settings(v_org_id);
  perform public._gre_seed_moments(v_org_id);
  perform public._lehmbp_seed_human_moments(v_org_id);
  perform public._oraebp97_seed_organizational_recognition_moments(v_org_id);
  v_human_settings := public._lehmbp_ensure_settings(v_org_id, v_user_id);

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
      'recognition_blueprint', 'IMPLEMENTATION_BLUEPRINT_PHASE9_RECOGNITION_CELEBRATION_FOUNDATION.md',
      'pame_memory', '/app/assistant/memory',
      'life_os', '/app/assistant/life',
      'self_love', '/app/self-love-engine',
      'employee_knowledge', '/app/settings/employee-knowledge',
      'sales_expert_community', '/app/sales-expert-engine',
      'human_moments_blueprint', 'IMPLEMENTATION_BLUEPRINT_PHASE53_LIFE_EVENTS_HUMAN_MOMENTS.md',
      'organizational_health', '/app/organizational-health-engine',
      'community_collective', '/app/community-collective-intelligence-engine',
      'hope_engine', '/app/hope-engine',
      'organizational_recognition_blueprint', 'IMPLEMENTATION_BLUEPRINT_PHASE97_ORGANIZATIONAL_RECOGNITION_APPRECIATION.md'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('gratitude_recognition.manage'),
      'can_export', public._irp_has_permission('gratitude_recognition.export'),
      'can_send_rose', public._irp_has_permission('gratitude_recognition.rose.send')
    ),
    'implementation_blueprint_phase53', jsonb_build_object(
      'phase', 53,
      'title', 'Life Events & Human Moments Engine',
      'engine_phase', 'A.89',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE53_LIFE_EVENTS_HUMAN_MOMENTS.md',
      'route', '/app/gratitude-recognition-engine',
      'mapping_note', 'ABOS Blueprint Phase 53 extends A.89 with consent-based life events — preserves Phase 9 fields.'
    ),
    'human_moments_mission', public._lehmbp_blueprint_mission(),
    'human_moments_philosophy', public._lehmbp_blueprint_philosophy(),
    'human_moments_abos_principle', public._lehmbp_blueprint_abos_principle(),
    'human_moments_objectives', public._lehmbp_blueprint_objectives(),
    'birthday_experiences', public._lehmbp_blueprint_birthday_experiences(),
    'professional_anniversaries', public._lehmbp_blueprint_professional_anniversaries(),
    'certification_celebrations', public._lehmbp_blueprint_certification_celebrations(),
    'community_contributions', public._lehmbp_blueprint_community_contributions(),
    'human_moments_self_love_connection', public._lehmbp_blueprint_self_love_connection(),
    'companion_principles', public._lehmbp_blueprint_companion_principles(),
    'privacy_principles', public._lehmbp_blueprint_privacy_principles(),
    'human_moments_settings', row_to_json(v_human_settings)::jsonb,
    'human_moments_summary', public._lehmbp_moments_summary(v_org_id),
    'human_moments_dogfooding', public._lehmbp_blueprint_dogfooding(),
    'lehmbp_integration_links', public._lehmbp_blueprint_integration_links(),
    'human_moments_success_criteria', public._lehmbp_blueprint_success_criteria(v_org_id),
    'human_moments_vision_phrases', public._lehmbp_blueprint_vision_phrases(),
    'human_moments_distinction_note', public._lehmbp_distinction_note(),
    'implementation_blueprint_phase97', jsonb_build_object(
      'phase', 97,
      'title', 'Organizational Recognition & Appreciation Engine',
      'engine_phase', 'A.89',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE97_ORGANIZATIONAL_RECOGNITION_APPRECIATION.md',
      'route', '/app/gratitude-recognition-engine',
      'mapping_note', 'ABOS Blueprint Phase 97 extends A.89 with organizational recognition — preserves Phase 9 and Phase 53. Distinct from Future Tech repo Phase 97.'
    ),
    'organizational_recognition_engine_note', 'Organizational Recognition & Appreciation Engine (ABOS Phase 97) — authentic appreciation strengthens belonging without competition.',
    'organizational_recognition_appreciation_blueprint', public._oraebp97_blueprint_block(v_org_id),
    'organizational_recognition_distinction_note', public._oraebp97_distinction_note(),
    'organizational_recognition_mission', public._oraebp97_mission(),
    'organizational_recognition_philosophy', public._oraebp97_philosophy(),
    'organizational_recognition_abos_principle', public._oraebp97_abos_principle(),
    'organizational_recognition_objectives', public._oraebp97_objectives(),
    'recognition_moments', public._oraebp97_recognition_moments(),
    'companion_recognition_prompts', public._oraebp97_companion_recognition_prompts(),
    'peer_recognition', public._oraebp97_peer_recognition(),
    'leadership_recognition', public._oraebp97_leadership_recognition(),
    'customer_appreciation', public._oraebp97_customer_appreciation(),
    'sales_expert_recognition', public._oraebp97_sales_expert_recognition(),
    'organizational_self_love_connection', public._oraebp97_self_love_connection(),
    'leadership_insights', public._oraebp97_leadership_insights(),
    'organizational_trust_connection', public._oraebp97_trust_connection(),
    'organizational_privacy_principles', public._oraebp97_privacy_principles(),
    'organizational_recognition_dogfooding', public._oraebp97_dogfooding(),
    'oraebp97_integration_links', public._oraebp97_integration_links(),
    'organizational_recognition_summary', public._oraebp97_recognition_summary(v_org_id),
    'organizational_recognition_success_criteria', public._oraebp97_success_criteria(v_org_id),
    'organizational_recognition_vision', public._oraebp97_vision(),
    'organizational_recognition_vision_phrases', public._oraebp97_vision_phrases(),
    'organizational_recognition_privacy_note', 'Organizational recognition metadata only — voluntary gestures, aggregate counts, no PII. Appreciation not competition.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Audit allowlist extension
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
    'pce_org_settings_changed', 'pce_user_preferences_changed', 'pce_summary_exported',
    'gee_settings_changed', 'gee_recommendation_accepted', 'gee_recommendation_dismissed',
    'gee_recommendation_deferred', 'gee_report_exported',
    'pfe_item_created', 'pfe_item_updated', 'pfe_recommendation_resolved',
    'pfe_org_settings_changed', 'pfe_summary_exported',
    'pve_value_upserted', 'pve_settings_changed', 'pve_reflection_acknowledged',
    'pve_reflection_dismissed', 'pve_report_exported',
    'ihe_settings_changed', 'ihe_reflection_acknowledged', 'ihe_reflection_dismissed',
    'ihe_report_exported',
    'cie_settings_changed', 'cie_report_exported',
    'ime_settings_changed', 'ime_summary_generated', 'ime_report_exported',
    'leg_settings_changed', 'leg_milestone_acknowledged', 'leg_report_exported',
    'cde_settings_changed', 'cde_prompt_explored', 'cde_prompt_dismissed', 'cde_report_exported',
    'wne_settings_changed', 'wne_reflection_acknowledged', 'wne_reflection_dismissed',
    'wne_moment_acknowledged', 'wne_report_exported',
    'gre_settings_changed', 'gre_rose_sent', 'gre_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%' or p_action_type like 'ihe_%'
    or p_action_type like 'cie_%' or p_action_type like 'ime_%' or p_action_type like 'leg_%'
    or p_action_type like 'cde_%' or p_action_type like 'wne_%' or p_action_type like 'gre_%'
    or p_action_type like 'lehmbp_%' or p_action_type like 'oraebp97_%';
$$;

-- ---------------------------------------------------------------------------
-- 7. Grants + KC category
-- ---------------------------------------------------------------------------
grant execute on function public._oraebp97_distinction_note() to authenticated;
grant execute on function public._oraebp97_mission() to authenticated;
grant execute on function public._oraebp97_philosophy() to authenticated;
grant execute on function public._oraebp97_abos_principle() to authenticated;
grant execute on function public._oraebp97_vision() to authenticated;
grant execute on function public._oraebp97_objectives() to authenticated;
grant execute on function public._oraebp97_recognition_moments() to authenticated;
grant execute on function public._oraebp97_companion_recognition_prompts() to authenticated;
grant execute on function public._oraebp97_peer_recognition() to authenticated;
grant execute on function public._oraebp97_leadership_recognition() to authenticated;
grant execute on function public._oraebp97_customer_appreciation() to authenticated;
grant execute on function public._oraebp97_sales_expert_recognition() to authenticated;
grant execute on function public._oraebp97_self_love_connection() to authenticated;
grant execute on function public._oraebp97_leadership_insights() to authenticated;
grant execute on function public._oraebp97_trust_connection() to authenticated;
grant execute on function public._oraebp97_privacy_principles() to authenticated;
grant execute on function public._oraebp97_dogfooding() to authenticated;
grant execute on function public._oraebp97_vision_phrases() to authenticated;
grant execute on function public._oraebp97_integration_links() to authenticated;
grant execute on function public._oraebp97_recognition_summary(uuid) to authenticated;
grant execute on function public._oraebp97_success_criteria(uuid) to authenticated;
grant execute on function public._oraebp97_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-recognition-appreciation-blueprint', 'Organizational Recognition & Appreciation (ABOS Phase 97)',
  'Authentic organizational recognition and appreciation — peer, leadership, customer, and Sales Expert celebration without competition. Extends Gratitude & Recognition A.89.',
  'authenticated', 112
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'organizational-recognition-appreciation-blueprint' and tenant_id is null
);
