-- Implementation Blueprint Phase 117 — Community & Collective Success Engine
-- Extends Community hub at /app/community (repo Phase 89 + Blueprint Phase 24 + Phase 52 + Phase 89).
-- No new tables — metadata helpers and dashboard/card RPC extensions only.

-- ---------------------------------------------------------------------------
-- Distinction & static blueprint helpers (_ccsbp117_*)
-- ---------------------------------------------------------------------------

create or replace function public._ccsbp117_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 117 — Community & Collective Success Engine at /app/community. Extends repo Phase 89 Community hub with community spaces, mentorship, events, knowledge vault, and collective success scaffolds — preserves Blueprint Phase 24, Phase 52, and Phase 89 fields. Distinct from Gratitude & Recognition Engine Phase A.89 at /app/gratitude-recognition-engine (recognition cross-link only). Cross-Tenant Intelligence A.71 at /app/cross-tenant-intelligence-engine (platform patterns). Organizational Memory A.34 at /app/organizational-memory-engine (tenant memory). People First — community metrics improve support, not rank people. Metadata and anonymized aggregates only — no PII, no surveillance.';
$$;

create or replace function public._ccsbp117_mission()
returns text language sql immutable as $$
  select 'Help people learn from one another, share proven practices, and build a thriving ecosystem where success is shared — not isolated.';
$$;

create or replace function public._ccsbp117_philosophy()
returns text language sql immutable as $$
  select 'The strongest ecosystems are built by people helping people. Community is wisdom and encouragement — not noise. People First. Growth through support. Success shared, not isolated.';
$$;

create or replace function public._ccsbp117_abos_principle()
returns text language sql immutable as $$
  select 'Collective success through shared learning — Aipify surfaces governed community patterns from anonymized contributions; humans guide community leadership; Companions support, never dominate.';
$$;

create or replace function public._ccsbp117_vision()
returns text language sql immutable as $$
  select 'A community where every contribution strengthens the whole — where newcomers feel supported, mentors share generously, and collective intelligence accelerates responsible innovation.';
$$;

create or replace function public._ccsbp117_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'learn_collectively', 'label', 'Learn collectively', 'description', 'Governed, anonymized collective learning — metadata only, never raw communications'),
    jsonb_build_object('key', 'share_proven_practices', 'label', 'Share proven practices', 'description', 'Playbooks, templates, and implementation stories that help others succeed'),
    jsonb_build_object('key', 'support_newcomers', 'label', 'Support newcomers', 'description', 'Welcoming paths, mentorship, and onboarding into community spaces'),
    jsonb_build_object('key', 'celebrate_contributions', 'label', 'Celebrate contributions', 'description', 'Recognition of values and usefulness — cross-link Gratitude A.89, not popularity'),
    jsonb_build_object('key', 'accelerate_responsible_innovation', 'label', 'Accelerate responsible innovation', 'description', 'Shared patterns that inform innovation without prescribing outcomes'),
    jsonb_build_object('key', 'preserve_community_knowledge', 'label', 'Preserve community knowledge', 'description', 'Knowledge vault assets remain accessible — wisdom compounds over time'),
    jsonb_build_object('key', 'encourage_collaboration', 'label', 'Encourage collaboration', 'description', 'Cross-community and Growth Partner collaboration modes — voluntary participation'),
    jsonb_build_object('key', 'strengthen_belonging', 'label', 'Strengthen belonging', 'description', 'Psychological safety, inclusion, and authentic community connection')
  );
$$;

create or replace function public._ccsbp117_community_spaces()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ten community spaces — each governed, voluntary, and scoped to relevant audiences.',
    'spaces', jsonb_build_array(
      jsonb_build_object('key', 'industry', 'label', 'Industry', 'description', 'Sector-specific practices and operational lessons'),
      jsonb_build_object('key', 'growth_partner', 'label', 'Growth Partner', 'description', 'Partner collaboration — cross-link Phase 114 /app/growth-partner-operations'),
      jsonb_build_object('key', 'executive', 'label', 'Executive', 'description', 'Leadership forums and strategic community dialogue'),
      jsonb_build_object('key', 'companion', 'label', 'Companion', 'description', 'Companion adoption best practices — humans guide, Companions support'),
      jsonb_build_object('key', 'support', 'label', 'Support', 'description', 'Support operations wisdom and triage improvements'),
      jsonb_build_object('key', 'commerce', 'label', 'Commerce', 'description', 'Commerce insights and operational patterns — metadata only'),
      jsonb_build_object('key', 'security', 'label', 'Security', 'description', 'Security and governance stewardship discussions'),
      jsonb_build_object('key', 'regional', 'label', 'Regional', 'description', 'Regional networks and local collaboration'),
      jsonb_build_object('key', 'language_based', 'label', 'Language-Based', 'description', 'Multilingual community resources — en/no/sv/da and beyond'),
      jsonb_build_object('key', 'special_interest', 'label', 'Special Interest', 'description', 'Focused topics and working groups')
    )
  );
$$;

create or replace function public._ccsbp117_community_contributions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ten contribution types — usefulness over visibility. Governed review before publication.',
    'contribution_types', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_articles', 'label', 'Knowledge articles', 'description', 'Structured knowledge for the community vault'),
      jsonb_build_object('key', 'implementation_stories', 'label', 'Implementation stories', 'description', 'Real-world adoption narratives — anonymized'),
      jsonb_build_object('key', 'playbooks', 'label', 'Playbooks', 'description', 'Step-by-step operational guides'),
      jsonb_build_object('key', 'templates', 'label', 'Templates', 'description', 'Reusable templates and frameworks'),
      jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned', 'description', 'Honest reflections from experience'),
      jsonb_build_object('key', 'case_studies', 'label', 'Case studies', 'description', 'Governed case studies — no confidential records'),
      jsonb_build_object('key', 'discussion_participation', 'label', 'Discussion participation', 'description', 'Thoughtful community dialogue — metadata summaries only'),
      jsonb_build_object('key', 'mentorship', 'label', 'Mentorship', 'description', 'Voluntary mentorship contributions — cross-link mentorship program'),
      jsonb_build_object('key', 'resource_libraries', 'label', 'Resource libraries', 'description', 'Curated resource collections for community use'),
      jsonb_build_object('key', 'community_events', 'label', 'Community events', 'description', 'Event summaries and participation — not passive consumption')
    )
  );
$$;

create or replace function public._ccsbp117_collective_intelligence_patterns()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective Intelligence Engine patterns — shared learning, not centralized control. Anonymized aggregates only.',
    'patterns', jsonb_build_array(
      jsonb_build_object('key', 'frequently_solved_challenges', 'label', 'Frequently solved challenges', 'description', 'Recurring problem patterns and proven resolutions'),
      jsonb_build_object('key', 'effective_implementations', 'label', 'Effective implementations', 'description', 'Implementation approaches that consistently succeed'),
      jsonb_build_object('key', 'companion_adoption_strategies', 'label', 'Companion adoption strategies', 'description', 'Responsible companion integration patterns'),
      jsonb_build_object('key', 'training_recommendations', 'label', 'Training recommendations', 'description', 'Role-based learning paths — cross-link Aipify University Phase 115'),
      jsonb_build_object('key', 'governance_practices', 'label', 'Governance practices', 'description', 'Community governance and policy stewardship examples'),
      jsonb_build_object('key', 'commerce_insights', 'label', 'Commerce insights', 'description', 'Operational commerce patterns — metadata only'),
      jsonb_build_object('key', 'growth_partner_success_factors', 'label', 'Growth Partner success factors', 'description', 'Partnership excellence patterns — cross-link Phase 114')
    )
  );
$$;

create or replace function public._ccsbp117_mentorship_program()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community Mentorship Program — voluntary, mutual, and psychologically safe. Distinct from Sales Community Blueprint Phase 47 peer mentorship at /app/sales-expert-engine.',
    'mentorship_types', jsonb_build_array(
      jsonb_build_object('key', 'growth_partner', 'label', 'Growth Partner mentorship', 'description', 'Partner-to-partner and partner-to-customer guidance'),
      jsonb_build_object('key', 'executive', 'label', 'Executive mentorship', 'description', 'Leadership development and strategic guidance'),
      jsonb_build_object('key', 'implementation', 'label', 'Implementation mentorship', 'description', 'Hands-on implementation coaching'),
      jsonb_build_object('key', 'companion_coaching', 'label', 'Companion coaching', 'description', 'Responsible companion adoption guidance — humans decide'),
      jsonb_build_object('key', 'governance_mentoring', 'label', 'Governance mentoring', 'description', 'Policy and ethical stewardship mentoring')
    ),
    'principles', jsonb_build_array(
      jsonb_build_object('key', 'voluntary', 'label', 'Voluntary', 'description', 'Mentorship is always opt-in for both mentor and mentee'),
      jsonb_build_object('key', 'mutual_respect', 'label', 'Mutual respect', 'description', 'Dignity and professionalism in every interaction'),
      jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety', 'description', 'Safe space for questions, mistakes, and growth'),
      jsonb_build_object('key', 'shared_growth', 'label', 'Shared growth', 'description', 'Both mentor and mentee learn — success is shared')
    ),
    'sales_community_route', '/app/sales-expert-engine',
    'sales_community_note', 'Sales Community Blueprint Phase 47 — peer mentorship within Sales Expert; distinct from general community mentorship.'
  );
$$;

create or replace function public._ccsbp117_community_recognition()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community Recognition — values, not popularity. Cross-link Gratitude & Recognition A.89; do not duplicate recognition storage.',
    'recognition_types', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'knowledge_generosity', 'label', 'Knowledge generosity', 'description', 'Sharing wisdom generously with the community'),
      jsonb_build_object('emoji', '🌹', 'key', 'responsible_leadership', 'label', 'Responsible leadership', 'description', 'Leaders who model governed sharing and trust'),
      jsonb_build_object('emoji', '🌹', 'key', 'support_excellence', 'label', 'Support excellence', 'description', 'Outstanding support that helps the broader ecosystem'),
      jsonb_build_object('emoji', '🌹', 'key', 'governance_stewardship', 'label', 'Governance stewardship', 'description', 'Ethical policy and community safety stewardship'),
      jsonb_build_object('emoji', '🌹', 'key', 'community_building', 'label', 'Community building', 'description', 'Efforts that strengthen belonging and inclusion'),
      jsonb_build_object('emoji', '🌹', 'key', 'innovation_with_integrity', 'label', 'Innovation with integrity', 'description', 'Responsible innovation that respects community values'),
      jsonb_build_object('emoji', '🌹', 'key', 'growth_partner_excellence', 'label', 'Growth Partner excellence', 'description', 'Partnership quality and ecosystem contribution'),
      jsonb_build_object('emoji', '🌹', 'key', 'companion_best_practices', 'label', 'Companion best practices', 'description', 'Thoughtful companion adoption and coaching')
    ),
    'gratitude_route', '/app/gratitude-recognition-engine',
    'boundary_note', 'Gratitude & Recognition Engine Phase A.89 — recognition cross-link only; phase number collision with repo Community Phase 89.'
  );
$$;

create or replace function public._ccsbp117_community_events()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community Events Engine — participation over passive consumption. Metadata summaries only; no raw event recordings without governance.',
    'event_types', jsonb_build_array(
      jsonb_build_object('key', 'virtual_meetups', 'label', 'Virtual meetups', 'description', 'Informal community connection and Q&A'),
      jsonb_build_object('key', 'roundtables', 'label', 'Roundtables', 'description', 'Facilitated discussion on focused topics'),
      jsonb_build_object('key', 'executive_forums', 'label', 'Executive forums', 'description', 'Leadership dialogue and strategic community sessions'),
      jsonb_build_object('key', 'industry_summits', 'label', 'Industry summits', 'description', 'Sector-wide knowledge sharing events'),
      jsonb_build_object('key', 'training_workshops', 'label', 'Training workshops', 'description', 'Hands-on learning — cross-link Aipify University Phase 115'),
      jsonb_build_object('key', 'companion_demonstrations', 'label', 'Companion demonstrations', 'description', 'Responsible companion capability showcases'),
      jsonb_build_object('key', 'knowledge_sharing_sessions', 'label', 'Knowledge sharing sessions', 'description', 'Structured knowledge transfer from community experts'),
      jsonb_build_object('key', 'growth_partner_conferences', 'label', 'Growth Partner conferences', 'description', 'Partner ecosystem gatherings — cross-link Phase 114')
    )
  );
$$;

create or replace function public._ccsbp117_safety_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community Safety Framework — moderation protects, not censors. Psychological safety enables honest sharing.',
    'principles', jsonb_build_array(
      jsonb_build_object('key', 'respect', 'label', 'Respect', 'description', 'Treat every community member with dignity'),
      jsonb_build_object('key', 'constructive_dialogue', 'label', 'Constructive dialogue', 'description', 'Disagreement is welcome when expressed constructively'),
      jsonb_build_object('key', 'inclusion', 'label', 'Inclusion', 'description', 'Welcome diverse perspectives, backgrounds, and experience levels'),
      jsonb_build_object('key', 'professional_conduct', 'label', 'Professional conduct', 'description', 'Maintain professional standards in all community spaces'),
      jsonb_build_object('key', 'responsible_disagreement', 'label', 'Responsible disagreement', 'description', 'Challenge ideas, not people — no personal attacks'),
      jsonb_build_object('key', 'knowledge_integrity', 'label', 'Knowledge integrity', 'description', 'Share accurate, governed information — cite sources when appropriate'),
      jsonb_build_object('key', 'supportive_participation', 'label', 'Supportive participation', 'description', 'Encourage newcomers; celebrate progress, not perfection')
    )
  );
$$;

create or replace function public._ccsbp117_knowledge_vault()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community Knowledge Vault — wisdom remains accessible. Cross-link Knowledge Center A.5 at /app/knowledge-center-engine.',
    'asset_types', jsonb_build_array(
      jsonb_build_object('key', 'best_practices', 'label', 'Best practices', 'description', 'Validated operational best practices'),
      jsonb_build_object('key', 'case_studies', 'label', 'Case studies', 'description', 'Governed anonymized case studies'),
      jsonb_build_object('key', 'templates', 'label', 'Templates', 'description', 'Reusable community templates'),
      jsonb_build_object('key', 'faqs', 'label', 'FAQs', 'description', 'Frequently asked community questions'),
      jsonb_build_object('key', 'recorded_sessions', 'label', 'Recorded sessions', 'description', 'Governed event recordings — metadata and summaries'),
      jsonb_build_object('key', 'discussion_summaries', 'label', 'Discussion summaries', 'description', 'Anonymized discussion takeaways — never raw transcripts'),
      jsonb_build_object('key', 'implementation_frameworks', 'label', 'Implementation frameworks', 'description', 'Structured implementation guides'),
      jsonb_build_object('key', 'governance_examples', 'label', 'Governance examples', 'description', 'Policy and ethical stewardship examples')
    ),
    'knowledge_center_route', '/app/knowledge-center-engine',
    'boundary_note', 'Knowledge Center A.5 — canonical FAQs and playbooks; community vault complements with collective wisdom.'
  );
$$;

create or replace function public._ccsbp117_companion_participation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Humans guide community leadership; Companions support — never dominate conversations or replace human judgment.',
    'may', jsonb_build_array(
      'Summarize discussions — metadata summaries only',
      'Organize resources and highlight relevant vault assets',
      'Highlight unanswered questions for community leaders',
      'Suggest knowledge contributions when gaps are detected',
      'Support moderation with explainable, transparent guidance'
    ),
    'must_never', jsonb_build_array(
      'Dominate conversations or speak on behalf of community members',
      'Replace community leadership or human moderators',
      'Suppress diverse viewpoints or manipulate participation',
      'Rank individuals or organizations — metrics improve support, not surveillance'
    )
  );
$$;

create or replace function public._ccsbp117_growth_partner_network()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner Community Network — seven collaboration modes. Cross-link Growth Partner Ops Phase 114 at /app/growth-partner-operations.',
    'collaboration_modes', jsonb_build_array(
      jsonb_build_object('key', 'peer_learning', 'label', 'Peer learning', 'description', 'Partner-to-partner knowledge exchange'),
      jsonb_build_object('key', 'regional_networks', 'label', 'Regional networks', 'description', 'Geographic partner collaboration groups'),
      jsonb_build_object('key', 'industry_working_groups', 'label', 'Industry working groups', 'description', 'Sector-focused partner initiatives'),
      jsonb_build_object('key', 'joint_initiatives', 'label', 'Joint initiatives', 'description', 'Collaborative ecosystem projects'),
      jsonb_build_object('key', 'resource_exchanges', 'label', 'Resource exchanges', 'description', 'Shared templates, playbooks, and tools'),
      jsonb_build_object('key', 'shared_training', 'label', 'Shared training', 'description', 'Cross-partner training — cross-link Aipify University Phase 115'),
      jsonb_build_object('key', 'cross_mentorship', 'label', 'Cross-mentorship', 'description', 'Partner mentorship across regions and industries')
    ),
    'growth_partner_ops_route', '/app/growth-partner-operations',
    'aipify_university_route', '/app/aipify-university'
  );
$$;

create or replace function public._ccsbp117_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in community — authenticity, empathy, and celebration of progress without pressure or judgment.',
    'practices', jsonb_build_array(
      'Authenticity — share honestly within governance boundaries',
      'Empathy — recognize others may be at different stages',
      'Patience — learning and contribution happen at your pace',
      'Reflection — community wisdom includes space for thoughtful pause',
      'Constructive support — encourage without comparison or ranking',
      'Celebration of progress — honor small wins and shared growth'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love A.76 influences tone — encouragement only. Community stores anonymized metadata, not wellbeing content.'
  );
$$;

create or replace function public._ccsbp117_community_analytics()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community Analytics — improve support, not rank people. Anonymized aggregates only; no individual surveillance.',
    'metrics', jsonb_build_array(
      jsonb_build_object('key', 'participation_quality', 'label', 'Participation quality', 'description', 'Thoughtful engagement patterns — not volume alone'),
      jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions', 'description', 'Governed contributions entering the vault'),
      jsonb_build_object('key', 'mentorship_activity', 'label', 'Mentorship activity', 'description', 'Voluntary mentorship participation signals'),
      jsonb_build_object('key', 'event_engagement', 'label', 'Event engagement', 'description', 'Active participation in community events'),
      jsonb_build_object('key', 'resource_utilization', 'label', 'Resource utilization', 'description', 'Knowledge vault asset usefulness trends'),
      jsonb_build_object('key', 'support_interactions', 'label', 'Support interactions', 'description', 'Community support quality — metadata only'),
      jsonb_build_object('key', 'community_satisfaction', 'label', 'Community satisfaction', 'description', 'Aggregate satisfaction signals — never individual profiling'),
      jsonb_build_object('key', 'cross_community_collaboration', 'label', 'Cross-community collaboration', 'description', 'Collaboration across spaces and partner networks')
    ),
    'not_for_ranking_note', 'Metrics improve community support — they do not rank people or organizations.'
  );
$$;

create or replace function public._ccsbp117_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective success without surveillance — metadata and anonymized aggregates only.',
    'must', jsonb_build_array(
      'Anonymized aggregation only — no org or individual identity disclosure',
      'Explicit permission before contributions enter collective intelligence',
      'Governed review workflow — draft through publication approval',
      'Community metrics improve support — never rank people',
      'Voluntary participation — organizations and individuals control opt-in'
    ),
    'must_not', jsonb_build_array(
      'Store PII, raw communications, or confidential business records',
      'Hidden profiling of individuals or organizations',
      'Surveillance framing — observations inform, they do not monitor',
      'Duplicate Gratitude A.89 recognition storage — cross-link only',
      'Replace human community leadership with automated decisions'
    ),
    'shared_learning_note', 'Shared learning, not surveillance — collective success strengthens people.'
  );
$$;

create or replace function public._ccsbp117_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion adaptation in community — Aipify-first language; humans guide, Companions support.',
    'examples', jsonb_build_array(
      jsonb_build_object(
        'emoji', '🦉',
        'key', 'community_pattern',
        'scenario', 'Community pattern worth exploring',
        'example', '🦉 Aipify noticed a recurring theme across governed community contributions — shall Aipify prepare a summary for your next community review?'
      ),
      jsonb_build_object(
        'emoji', '🌹',
        'key', 'mentorship_opportunity',
        'scenario', 'Mentorship opportunity',
        'example', '🌹 A community member may benefit from mentorship in this area — voluntary connection when both parties are ready.'
      ),
      jsonb_build_object(
        'emoji', '🔔',
        'key', 'knowledge_gap',
        'scenario', 'Knowledge gap in community vault',
        'example', '🔔 An unanswered question appears frequently in community discussions — a knowledge contribution may help when your team has capacity.'
      )
    )
  );
$$;

create or replace function public._ccsbp117_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Community Phase 89 + Blueprint 24/52/89', 'route', '/app/community', 'note', 'THIS blueprint extends — all prior fields preserved'),
    jsonb_build_object('label', 'Gratitude & Recognition A.89', 'route', '/app/gratitude-recognition-engine', 'note', 'Recognition cross-link — do not duplicate storage'),
    jsonb_build_object('label', 'Sales Community Blueprint 47', 'route', '/app/sales-expert-engine', 'note', 'Peer mentorship within Sales Expert — distinct from general mentorship'),
    jsonb_build_object('label', 'Growth Partner Ops Phase 114', 'route', '/app/growth-partner-operations', 'note', 'GP community network collaboration'),
    jsonb_build_object('label', 'Aipify University Phase 115', 'route', '/app/aipify-university', 'note', 'Training and workshop cross-link'),
    jsonb_build_object('label', 'Trust Phase 116', 'route', '/app/trust-reputation-engine', 'note', 'Trust and community health cross-link'),
    jsonb_build_object('label', 'Cross-Tenant Intelligence A.71', 'route', '/app/cross-tenant-intelligence-engine', 'note', 'Platform patterns — distinct from tenant community hub'),
    jsonb_build_object('label', 'Ecosystem Intelligence Blueprint 88', 'route', '/app/ecosystem', 'note', 'External relationships — distinct from internal community wisdom'),
    jsonb_build_object('label', 'Organizational Memory A.34', 'route', '/app/organizational-memory-engine', 'note', 'Tenant memory — distinct from collective community vault'),
    jsonb_build_object('label', 'Knowledge Center A.5', 'route', '/app/knowledge-center-engine', 'note', 'Canonical FAQs and playbooks — vault complements KC'),
    jsonb_build_object('label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Community tone — encouragement only')
  );
$$;

create or replace function public._ccsbp117_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'higher_knowledge_sharing', 'label', 'Higher knowledge sharing', 'description', 'More governed contributions entering the community vault'),
    jsonb_build_object('key', 'stronger_gp_collaboration', 'label', 'Stronger GP collaboration', 'description', 'Growth Partner network engagement and cross-mentorship'),
    jsonb_build_object('key', 'improved_customer_outcomes', 'label', 'Improved customer outcomes', 'description', 'Collective wisdom translating to better operational results'),
    jsonb_build_object('key', 'increased_mentorship', 'label', 'Increased mentorship', 'description', 'Voluntary mentorship participation across community spaces'),
    jsonb_build_object('key', 'ecosystem_resilience', 'label', 'Ecosystem resilience', 'description', 'Community knowledge preserved and accessible over time'),
    jsonb_build_object('key', 'healthier_engagement', 'label', 'Healthier engagement', 'description', 'Quality participation — not volume for its own sake'),
    jsonb_build_object('key', 'expanded_collective_intelligence', 'label', 'Expanded collective intelligence', 'description', 'More governed patterns available for optional adoption'),
    jsonb_build_object('key', 'sense_of_belonging', 'label', 'Sense of belonging', 'description', 'Inclusive community where newcomers feel supported'),
    jsonb_build_object('key', 'long_term_sustainability', 'label', 'Long-term sustainability', 'description', 'Community thrives through shared success, not extraction')
  );
$$;

create or replace function public._ccsbp117_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_collective jsonb;
  v_engagement jsonb;
begin
  v_collective := public._clwbp_collective_summary(p_organization_id);
  v_engagement := public._ccibp_engagement_summary(p_organization_id);

  return jsonb_build_object(
    'community_spaces', jsonb_array_length(public._ccsbp117_community_spaces()->'spaces'),
    'contribution_types', jsonb_array_length(public._ccsbp117_community_contributions()->'contribution_types'),
    'collective_intelligence_patterns', jsonb_array_length(public._ccsbp117_collective_intelligence_patterns()->'patterns'),
    'mentorship_types', jsonb_array_length(public._ccsbp117_mentorship_program()->'mentorship_types'),
    'recognition_types', jsonb_array_length(public._ccsbp117_community_recognition()->'recognition_types'),
    'event_types', jsonb_array_length(public._ccsbp117_community_events()->'event_types'),
    'safety_principles', jsonb_array_length(public._ccsbp117_safety_framework()->'principles'),
    'vault_asset_types', jsonb_array_length(public._ccsbp117_knowledge_vault()->'asset_types'),
    'analytics_metrics', jsonb_array_length(public._ccsbp117_community_analytics()->'metrics'),
    'cross_links', jsonb_array_length(public._ccsbp117_cross_links()),
    'tenant_contributions_total', coalesce((v_collective->>'tenant_contributions_total')::int, 0),
    'ecosystem_published_total', coalesce((v_collective->>'ecosystem_published_total')::int, 0),
    'contributions_total', coalesce((v_engagement->>'contributions_total')::int, 0),
    'published_contributions', coalesce((v_engagement->>'published_contributions')::int, 0),
    'participation_enabled', coalesce((v_engagement->>'participation_enabled')::boolean, false),
    'privacy_note', 'Collective success metadata only — anonymized aggregates, no PII or individual ranking.'
  );
end; $$;

create or replace function public._ccsbp117_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_tenant_published int := 0;
  v_participation_enabled boolean := false;
begin
  v_summary := public._clwbp_collective_summary(p_organization_id);
  v_tenant_published := coalesce((v_summary->>'tenant_published')::int, 0);

  select coalesce(participation_enabled, false)
  into v_participation_enabled
  from public.community_settings where tenant_id = p_organization_id;

  return jsonb_build_array(
    jsonb_build_object('key', 'community_spaces', 'label', 'Community spaces — ten governed spaces documented', 'met', jsonb_array_length(public._ccsbp117_community_spaces()->'spaces') >= 10, 'note', null),
    jsonb_build_object('key', 'community_contributions', 'label', 'Community contributions — ten contribution types', 'met', jsonb_array_length(public._ccsbp117_community_contributions()->'contribution_types') >= 10, 'note', 'Usefulness over visibility.'),
    jsonb_build_object('key', 'collective_intelligence_patterns', 'label', 'Collective intelligence patterns — seven patterns', 'met', jsonb_array_length(public._ccsbp117_collective_intelligence_patterns()->'patterns') >= 7, 'note', 'Shared learning, not centralized control.'),
    jsonb_build_object('key', 'mentorship_program', 'label', 'Mentorship program — five types, four principles', 'met', jsonb_array_length(public._ccsbp117_mentorship_program()->'mentorship_types') >= 5 and jsonb_array_length(public._ccsbp117_mentorship_program()->'principles') >= 4, 'note', 'Voluntary and psychologically safe.'),
    jsonb_build_object('key', 'community_recognition', 'label', 'Community recognition — eight value-based types', 'met', jsonb_array_length(public._ccsbp117_community_recognition()->'recognition_types') >= 8, 'note', 'Cross-link Gratitude A.89 — do not duplicate.'),
    jsonb_build_object('key', 'community_events', 'label', 'Community events — eight event types', 'met', jsonb_array_length(public._ccsbp117_community_events()->'event_types') >= 8, 'note', 'Participation over passive consumption.'),
    jsonb_build_object('key', 'safety_framework', 'label', 'Safety framework — seven principles', 'met', jsonb_array_length(public._ccsbp117_safety_framework()->'principles') >= 7, 'note', 'Moderation protects, not censors.'),
    jsonb_build_object('key', 'knowledge_vault', 'label', 'Knowledge vault — eight asset types', 'met', jsonb_array_length(public._ccsbp117_knowledge_vault()->'asset_types') >= 8, 'note', 'Cross-link KC A.5.'),
    jsonb_build_object('key', 'companion_participation', 'label', 'Companion participation — may/must never documented', 'met', jsonb_array_length(public._ccsbp117_companion_participation()->'must_never') >= 4, 'note', 'Humans guide; Companions support.'),
    jsonb_build_object('key', 'growth_partner_network', 'label', 'Growth Partner network — seven collaboration modes', 'met', jsonb_array_length(public._ccsbp117_growth_partner_network()->'collaboration_modes') >= 7, 'note', 'Cross-link Phase 114.'),
    jsonb_build_object('key', 'community_analytics', 'label', 'Community analytics — improve support, not rank', 'met', jsonb_array_length(public._ccsbp117_community_analytics()->'metrics') >= 8, 'note', null),
    jsonb_build_object('key', 'limitation_principles', 'label', 'Limitation principles — no PII, no surveillance', 'met', jsonb_array_length(public._ccsbp117_limitation_principles()->'must_not') >= 4, 'note', null),
    jsonb_build_object('key', 'companion_adaptation', 'label', 'Companion adaptation — 🦉🌹🔔 examples', 'met', jsonb_array_length(public._ccsbp117_companion_adaptation()->'examples') >= 3, 'note', 'Aipify-first language.'),
    jsonb_build_object('key', 'cross_links', 'label', 'Cross-links distinct from related engines', 'met', jsonb_array_length(public._ccsbp117_cross_links()) >= 10, 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — nine outcomes documented', 'met', jsonb_array_length(public._ccsbp117_success_metrics()) >= 9, 'note', null),
    jsonb_build_object('key', 'voluntary_participation', 'label', 'Voluntary participation effective', 'met', v_participation_enabled or v_tenant_published > 0, 'note', case when not v_participation_enabled and v_tenant_published = 0 then 'Enable participation when ready to contribute.' else null end)
  );
end; $$;

create or replace function public._ccsbp117_community_collective_success_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'implementation_blueprint_phase117', jsonb_build_object(
      'phase', 'Phase 117 — Community & Collective Success Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE117_COMMUNITY_COLLECTIVE_SUCCESS.md',
      'engine_phase', 'Repo Phase 89 Community & Collective Intelligence',
      'extends', 'Blueprint Phase 24 + Phase 52 + Phase 89',
      'route', '/app/community',
      'admin_route', '/app/community/admin',
      'mapping_note', 'ABOS Blueprint Phase 117 extends repo Phase 89 community hub — community spaces, mentorship, events, knowledge vault, collective success. Preserves Phase 24, Phase 52, and Phase 89 fields.'
    ),
    'community_collective_success_note', 'Community & Collective Success Engine (ABOS Blueprint Phase 117) — people helping people, success shared not isolated. Metrics improve support, not rank people.',
    'distinction_note', public._ccsbp117_distinction_note(),
    'mission', public._ccsbp117_mission(),
    'philosophy', public._ccsbp117_philosophy(),
    'abos_principle', public._ccsbp117_abos_principle(),
    'vision', public._ccsbp117_vision(),
    'objectives', public._ccsbp117_objectives(),
    'community_spaces', public._ccsbp117_community_spaces(),
    'community_contributions', public._ccsbp117_community_contributions(),
    'collective_intelligence_patterns', public._ccsbp117_collective_intelligence_patterns(),
    'mentorship_program', public._ccsbp117_mentorship_program(),
    'community_recognition', public._ccsbp117_community_recognition(),
    'community_events', public._ccsbp117_community_events(),
    'safety_framework', public._ccsbp117_safety_framework(),
    'knowledge_vault', public._ccsbp117_knowledge_vault(),
    'companion_participation', public._ccsbp117_companion_participation(),
    'growth_partner_network', public._ccsbp117_growth_partner_network(),
    'self_love_connection', public._ccsbp117_self_love_connection(),
    'community_analytics', public._ccsbp117_community_analytics(),
    'limitation_principles', public._ccsbp117_limitation_principles(),
    'companion_adaptation', public._ccsbp117_companion_adaptation(),
    'cross_links', public._ccsbp117_cross_links(),
    'success_metrics', public._ccsbp117_success_metrics(),
    'success_criteria', public._ccsbp117_success_criteria(p_organization_id),
    'engagement_summary', public._ccsbp117_engagement_summary(p_organization_id),
    'people_first_note', 'People First — growth through support. Success shared, not isolated.',
    'privacy_note', 'Community collective success metadata only — governed contributions, anonymized aggregates. No PII, no individual ranking, no surveillance.'
  );
end; $$;
-- ---------------------------------------------------------------------------
-- Dashboard — preserve ALL Phase 89 repo + Phase 24 + Phase 52; append Phase 89 + Phase 117 blueprint
-- ---------------------------------------------------------------------------

create or replace function public.get_community_intelligence_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.community_settings;
  v_scores jsonb;
  v_briefings jsonb;
begin
  v_tenant_id := public._col_require_tenant();
  v_settings := public._col_ensure_settings(v_tenant_id);
  perform public._col_seed_templates(v_tenant_id);
  perform public._col_seed_suggestions(v_tenant_id);
  v_scores := public._col_calculate_scores(v_tenant_id);
  perform public._col_trust_explanation(v_tenant_id, (v_scores->>'health_score')::numeric);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb) into v_briefings
  from public.community_briefings b where b.tenant_id = v_tenant_id limit 5;

  return jsonb_build_object(
    'has_customer', true,
    'participation_enabled', v_settings.participation_enabled,
    'participation_voluntary', true,
    'anonymization_required', v_settings.anonymization_required,
    'philosophy', 'Organizations own their knowledge. Organizations control participation.',
    'safety_note', 'No confidential sharing. Participation is voluntary, governed, and anonymized.',
    'health_score', v_scores->'health_score',
    'intelligence_score', v_scores->'intelligence_score',
    'contribution_score', v_scores->'contribution_score',
    'score_components', v_scores->'components',
    'featured_learnings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 300),
        'category', c.category, 'category_label', public._col_category_label(c.category),
        'contribution_type', c.contribution_type, 'type_label', public._col_contribution_type_label(c.contribution_type),
        'rating_avg', c.rating_avg, 'rating_count', c.rating_count, 'published_at', c.published_at
      ) order by c.published_at desc)
      from public.community_contributions c
      where c.status = 'published' and c.anonymization_verified = true limit 6
    ), '[]'::jsonb),
    'featured_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 300),
        'category', c.category, 'contribution_type', c.contribution_type,
        'type_label', public._col_contribution_type_label(c.contribution_type),
        'rating_avg', c.rating_avg, 'rating_count', c.rating_count
      ) order by c.published_at desc)
      from public.community_contributions c
      where c.status = 'published' and c.anonymization_verified = true limit 6
    ), '[]'::jsonb),
    'best_practices', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'category', c.category,
        'category_label', public._col_category_label(c.category), 'rating_avg', c.rating_avg
      ) order by c.rating_avg desc)
      from public.community_contributions c
      where c.status = 'published' and c.category in ('knowledge', 'governance', 'operational') limit 8
    ), '[]'::jsonb),
    'recently_validated', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'category', c.category,
        'category_label', public._col_category_label(c.category), 'published_at', c.published_at
      ) order by c.published_at desc)
      from public.community_contributions c
      where c.status = 'published' and c.published_at > now() - interval '90 days' limit 8
    ), '[]'::jsonb),
    'blueprint_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 200)
      ))
      from public.community_contributions c
      where c.status = 'published' and c.category = 'industry' limit 5
    ), '[]'::jsonb),
    'blueprint_discussions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 200)
      ))
      from public.community_contributions c
      where c.status = 'published' and c.contribution_type = 'blueprint_enhancement' limit 5
    ), '[]'::jsonb),
    'industry_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 200),
        'category_label', public._col_category_label(c.category)
      ))
      from public.community_contributions c
      where c.status = 'published' and c.category = 'industry' limit 6
    ), '[]'::jsonb),
    'popular_resources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'rating_avg', c.rating_avg, 'rating_count', c.rating_count
      ) order by c.rating_avg desc, c.rating_count desc)
      from public.community_contributions c where c.status = 'published' limit 10
    ), '[]'::jsonb),
    'top_rated', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'rating_avg', c.rating_avg, 'rating_count', c.rating_count
      ) order by c.rating_avg desc, c.rating_count desc)
      from public.community_contributions c where c.status = 'published' limit 10
    ), '[]'::jsonb),
    'briefings', v_briefings,
    'intelligence_categories', jsonb_build_array(
      jsonb_build_object('key', 'knowledge', 'label', 'Knowledge Contributions'),
      jsonb_build_object('key', 'operational', 'label', 'Operational Contributions'),
      jsonb_build_object('key', 'governance', 'label', 'Governance Contributions'),
      jsonb_build_object('key', 'customer_success', 'label', 'Customer Success Contributions'),
      jsonb_build_object('key', 'industry', 'label', 'Industry Contributions'),
      jsonb_build_object('key', 'marketplace', 'label', 'Marketplace Contributions')
    ),
    'contribution_types', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_article', 'label', 'Knowledge Articles'),
      jsonb_build_object('key', 'implementation_guide', 'label', 'Implementation Guides'),
      jsonb_build_object('key', 'blueprint_enhancement', 'label', 'Blueprint Enhancements'),
      jsonb_build_object('key', 'business_pack_review', 'label', 'Business Pack Reviews'),
      jsonb_build_object('key', 'operational_lesson', 'label', 'Operational Lessons Learned'),
      jsonb_build_object('key', 'governance_recommendation', 'label', 'Governance Recommendations'),
      jsonb_build_object('key', 'adoption_success_story', 'label', 'Adoption Success Stories'),
      jsonb_build_object('key', 'risk_mitigation_practice', 'label', 'Risk Mitigation Practices')
    ),
    'approval_workflow', jsonb_build_array(
      jsonb_build_object('step', 'draft', 'label', 'Draft'),
      jsonb_build_object('step', 'review', 'label', 'Internal Review'),
      jsonb_build_object('step', 'governance_check', 'label', 'Governance Validation'),
      jsonb_build_object('step', 'anonymization_check', 'label', 'Anonymization Check'),
      jsonb_build_object('step', 'published', 'label', 'Publication Approval'),
      jsonb_build_object('step', 'community_rating', 'label', 'Community Availability')
    ),
    'integrations', jsonb_build_object(
      'learning_engine', 'Improves recommendations, knowledge suggestions, and Human Success initiatives',
      'knowledge_center', 'Enriches FAQs, playbooks, best practices, and Blueprint guidance',
      'global_learning', 'Strengthens pattern recognition and industry guidance',
      'marketplace', 'Community feedback, outcome validation, and pack improvements',
      'strategic_intelligence', 'Emerging trends, repeated opportunities, and community priorities',
      'human_success', 'Successful onboarding patterns and adoption accelerators',
      'executive_briefing', 'Community intelligence briefings'
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 24 — Community & Collective Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE24_COMMUNITY_COLLECTIVE_INTELLIGENCE.md',
      'engine_phase', 'Phase 89 Community & Collective Intelligence',
      'route', '/app/community',
      'admin_route', '/app/community/admin',
      'mapping_note', 'ABOS Blueprint Phase 24 maps to Community & Collective Intelligence Phase 89 — extend, do not duplicate Cross-Tenant Intelligence A.71, Benchmarking A.58, or Learning Phase 23.'
    ),
    'mission', 'Identify broader patterns, shared learning, and collective improvements across organizations — preserving privacy, security, and trust.',
    'community_philosophy', 'Organizations should not solve every problem alone — shared learning accelerates progress; collective intelligence without compromising confidentiality.',
    'abos_principle', 'Wisdom grows when experiences are shared responsibly.',
    'core_principle', 'Organizations own their knowledge. Organizations control participation.',
    'vision', 'Benefit from broader ecosystem lessons — "we would never have discovered this on our own."',
    'community_intelligence_note', 'Community & Collective Intelligence Engine (ABOS Phase 24) — extends Phase 89 with blueprint metadata, collective insight examples, privacy principles, and live success criteria.',
    'distinction_note', public._ccibp_distinction_note(),
    'community_objectives', public._ccibp_blueprint_community_objectives(),
    'collective_insight_examples', public._ccibp_blueprint_collective_insight_examples(),
    'privacy_principles', public._ccibp_blueprint_privacy_principles(),
    'community_contributions_blueprint', public._ccibp_blueprint_community_contributions(),
    'companion_examples', public._ccibp_blueprint_companion_examples(),
    'self_love_connection', public._ccibp_blueprint_self_love_connection(),
    'trust_connection', public._ccibp_blueprint_trust_connection(),
    'dogfooding', public._ccibp_blueprint_dogfooding(),
    'integration_links', public._ccibp_blueprint_integration_links(),
    'engagement_summary', public._ccibp_engagement_summary(v_tenant_id),
    'success_criteria', public._ccibp_blueprint_success_criteria(v_tenant_id),
    'vision_phrases', public._ccibp_blueprint_vision_phrases(),
    'privacy_note', 'Community intelligence is governed, anonymized, voluntary, and explainable. Metadata only — no org identity or confidential content.',
    'principles', jsonb_build_array(
      'Organizations own their knowledge — organizations control participation',
      'Voluntary participation — governed review before publication',
      'Anonymized aggregation — no org identity disclosure',
      'Collective intelligence without compromising confidentiality',
      'Trust is non-negotiable — explicit governance and transparency'
    ),
    'collective_learning_wisdom_blueprint', jsonb_build_object(
      'phase', 'Phase 52 — Collective Learning & Wisdom Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE52_COLLECTIVE_LEARNING_WISDOM.md',
      'engine_phase', 'Phase 89 Community & Collective Intelligence',
      'extends', 'Phase 24 Community Blueprint',
      'route', '/app/community',
      'admin_route', '/app/community/admin',
      'mapping_note', 'Anonymized collective wisdom compounding across the ecosystem via community intelligence — inform not prescribe.'
    ),
    'clwbp_mission', public._clwbp_blueprint_mission(),
    'clwbp_philosophy', public._clwbp_blueprint_philosophy(),
    'clwbp_abos_principle', public._clwbp_blueprint_abos_principle(),
    'clwbp_objectives', public._clwbp_blueprint_objectives(),
    'collective_observations', public._clwbp_blueprint_collective_observations(),
    'best_practice_evolution', public._clwbp_blueprint_best_practice_evolution(),
    'clwbp_anonymization_principles', public._clwbp_blueprint_anonymization_principles(),
    'knowledge_center_connection', public._clwbp_blueprint_knowledge_center_connection(),
    'sales_expert_connection', public._clwbp_blueprint_sales_expert_connection(),
    'executive_connection', public._clwbp_blueprint_executive_connection(),
    'clwbp_self_love_connection', public._clwbp_blueprint_self_love_connection(),
    'clwbp_trust_connection', public._clwbp_blueprint_trust_connection(),
    'clwbp_dogfooding', public._clwbp_blueprint_dogfooding(),
    'clwbp_integration_links', public._clwbp_blueprint_integration_links(),
    'collective_summary', public._clwbp_collective_summary(v_tenant_id),
    'clwbp_success_criteria', public._clwbp_blueprint_success_criteria(v_tenant_id),
    'clwbp_distinction_note', public._clwbp_distinction_note(),
    'clwbp_vision_phrases', public._clwbp_blueprint_vision_phrases(),
    'inform_not_prescribe_note', 'Collective observations inform — they do not prescribe. Humans decide what to adopt.',
    'community_collective_intelligence_blueprint_phase89', public._ccibp89_community_collective_intelligence_block(v_tenant_id),
    'community_collective_success_blueprint_phase117', public._ccsbp117_community_collective_success_block(v_tenant_id)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- Card RPC — compact Phase 89 + Phase 117 blueprint metadata
-- ---------------------------------------------------------------------------

create or replace function public.get_community_intelligence_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_health numeric;
  v_intelligence numeric;
  v_pending int;
  v_engagement jsonb;
  v_collective jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select health_score, contribution_score into v_health, v_intelligence
  from public.community_scores where tenant_id = v_tenant_id order by calculated_at desc limit 1;

  select count(*) into v_pending from public.community_contributions
  where tenant_id = v_tenant_id and status in ('review', 'governance_check', 'anonymization_check');

  v_engagement := public._ccibp_engagement_summary(v_tenant_id);
  v_collective := public._clwbp_collective_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'health_score', coalesce(v_health, 0),
    'intelligence_score', coalesce(v_intelligence, 0),
    'contribution_score', coalesce(v_intelligence, 0),
    'pending_reviews', v_pending,
    'philosophy', 'Organizations own their knowledge. Organizations control participation.',
    'participation_voluntary', true,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 24 — Community & Collective Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE24_COMMUNITY_COLLECTIVE_INTELLIGENCE.md',
      'engine_phase', 'Phase 89 Community & Collective Intelligence',
      'route', '/app/community',
      'admin_route', '/app/community/admin'
    ),
    'collective_learning_wisdom_blueprint', jsonb_build_object(
      'phase', 'Phase 52 — Collective Learning & Wisdom Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE52_COLLECTIVE_LEARNING_WISDOM.md',
      'route', '/app/community'
    ),
    'community_collective_intelligence_blueprint_phase89', jsonb_build_object(
      'phase', 'Phase 89 — Community & Collective Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE89_COMMUNITY_COLLECTIVE_INTELLIGENCE.md',
      'route', '/app/community'
    ),
    'mission', 'Identify broader patterns and collective improvements — preserving privacy, security, and trust.',
    'clwbp_mission', public._clwbp_blueprint_mission(),
    'ccibp89_mission', public._ccibp89_mission(),
    'abos_principle', 'Wisdom grows when experiences are shared responsibly.',
    'clwbp_abos_principle', public._clwbp_blueprint_abos_principle(),
    'ccibp89_abos_principle', public._ccibp89_abos_principle(),
    'ccibp89_philosophy', public._ccibp89_philosophy(),
    'ccibp89_vision', public._ccibp89_vision(),
    'core_principle', 'Organizations own their knowledge. Organizations control participation.',
    'engagement_summary', v_engagement,
    'collective_summary', v_collective,
    'ccibp89_engagement_summary', public._ccibp89_engagement_summary(v_tenant_id),
    'inform_not_prescribe_note', 'Collective observations inform — they do not prescribe.',
    'shared_learning_not_surveillance_note', 'Shared learning, not surveillance.',
    'blueprint_note', 'Community & Collective Intelligence (ABOS Phase 24 + Phase 52 + Blueprint Phase 89) — governed, anonymized collective wisdom.',
    'clwbp_distinction_note', public._clwbp_distinction_note(),
    'ccibp89_distinction_note', public._ccibp89_distinction_note(),
    'community_collective_success_blueprint_phase117', jsonb_build_object(
      'phase', 'Phase 117 — Community & Collective Success Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE117_COMMUNITY_COLLECTIVE_SUCCESS.md',
      'route', '/app/community'
    ),
    'ccsbp117_mission', public._ccsbp117_mission(),
    'ccsbp117_philosophy', public._ccsbp117_philosophy(),
    'ccsbp117_abos_principle', public._ccsbp117_abos_principle(),
    'ccsbp117_vision', public._ccsbp117_vision(),
    'ccsbp117_engagement_summary', public._ccsbp117_engagement_summary(v_tenant_id),
    'ccsbp117_distinction_note', public._ccsbp117_distinction_note(),
    'people_first_note', 'People First — growth through support. Success shared, not isolated.',
    'blueprint_note', 'Community & Collective Success (ABOS Phase 24 + Phase 52 + Phase 89 + Blueprint Phase 117) — governed, anonymized collective wisdom.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- Grants + knowledge category
-- ---------------------------------------------------------------------------

grant execute on function public._ccsbp117_distinction_note() to authenticated;
grant execute on function public._ccsbp117_mission() to authenticated;
grant execute on function public._ccsbp117_philosophy() to authenticated;
grant execute on function public._ccsbp117_abos_principle() to authenticated;
grant execute on function public._ccsbp117_vision() to authenticated;
grant execute on function public._ccsbp117_objectives() to authenticated;
grant execute on function public._ccsbp117_community_spaces() to authenticated;
grant execute on function public._ccsbp117_community_contributions() to authenticated;
grant execute on function public._ccsbp117_collective_intelligence_patterns() to authenticated;
grant execute on function public._ccsbp117_mentorship_program() to authenticated;
grant execute on function public._ccsbp117_community_recognition() to authenticated;
grant execute on function public._ccsbp117_community_events() to authenticated;
grant execute on function public._ccsbp117_safety_framework() to authenticated;
grant execute on function public._ccsbp117_knowledge_vault() to authenticated;
grant execute on function public._ccsbp117_companion_participation() to authenticated;
grant execute on function public._ccsbp117_growth_partner_network() to authenticated;
grant execute on function public._ccsbp117_self_love_connection() to authenticated;
grant execute on function public._ccsbp117_community_analytics() to authenticated;
grant execute on function public._ccsbp117_limitation_principles() to authenticated;
grant execute on function public._ccsbp117_companion_adaptation() to authenticated;
grant execute on function public._ccsbp117_cross_links() to authenticated;
grant execute on function public._ccsbp117_success_metrics() to authenticated;
grant execute on function public._ccsbp117_engagement_summary(uuid) to authenticated;
grant execute on function public._ccsbp117_success_criteria(uuid) to authenticated;
grant execute on function public._ccsbp117_community_collective_success_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'community-collective-success-blueprint-phase117', 'Community & Collective Success Engine (ABOS Blueprint Phase 117)',
  'Community & Collective Success Blueprint Phase 117 — community spaces, mentorship, events, knowledge vault, and collective success via /app/community.',
  'authenticated', 123
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'community-collective-success-blueprint-phase117' and tenant_id is null
);
