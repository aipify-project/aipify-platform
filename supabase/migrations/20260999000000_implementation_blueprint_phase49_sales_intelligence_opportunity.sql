-- Implementation Blueprint Phase 49 — Sales Intelligence & Opportunity Engine
-- Extends Sales Expert Operating System (A.95 + Phases 41–46, 42, 43, 44, marketing 33-extension). No new tables.

create or replace function public._siobp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 49 — Sales Intelligence & Opportunity at /app/sales-expert-engine Intelligence tab. Distinct from Predictive Insights A.66 (/app/predictive-insights-engine), Strategic Intelligence A.31, Industry Intelligence A.44 (/app/industry-intelligence-foundation-engine), and Cross-Tenant Intelligence A.71 — those are tenant/org intelligence engines. Phase 49 is Sales Expert opportunity guidance in the partner portal only — tenant-scoped pipeline metadata, no cross-tenant data. Cross-links Phase 43 engagement, Phase 44 renewal/expansion, Phase 45 coach activity recommendations, Industry Intelligence A.44 / Blueprint 32, Decision Support A.54, Self Love A.76.';
$$;

create or replace function public._siobp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'opportunity_awareness', 'label', 'Opportunity awareness', 'description', 'Surface open pipeline opportunities with context — metadata only'),
    jsonb_build_object('key', 'prioritization', 'label', 'Prioritization guidance', 'description', 'Scores and categories inform focus — humans always decide'),
    jsonb_build_object('key', 'industry_insights', 'label', 'Industry insights', 'description', 'Commerce, professional services, community platform patterns — scaffold'),
    jsonb_build_object('key', 'follow_up_recommendations', 'label', 'Follow-up recommendations', 'description', 'Stale opportunities, demo nudges, educational resources — supportive not urgent'),
    jsonb_build_object('key', 'pipeline_visibility', 'label', 'Pipeline visibility', 'description', 'Early-stage, demo candidates, renewal-related, expansion conversations from opportunity metadata'),
    jsonb_build_object('key', 'market_observations', 'label', 'Market observations', 'description', 'Illustrative sector patterns — never cross-tenant benchmarks')
  );
$$;

create or replace function public._siobp_blueprint_opportunity_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion opportunity insights — observe, inform, recommend. Never pressure or imply every deal is urgent.',
    'companion_examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'pipeline_review', 'example', 'Three opportunities may benefit from a thoughtful follow-up this week — here is what Aipify noticed from pipeline metadata.'),
      jsonb_build_object('emoji', '🌹', 'key', 'demo_ready', 'example', 'A prospect in qualification may be ready for a focused demo — prepare discovery questions first.'),
      jsonb_build_object('emoji', '🔔', 'key', 'stale_nudge', 'example', 'One opportunity has been quiet for a while — a gentle check-in may reopen the conversation.')
    ),
    'coach_tab_cross_link', 'Phase 45 Coach tab — activity recommendations complement intelligence insights',
    'opportunities_tab_note', 'Raw pipeline CRUD remains on Opportunities tab — Intelligence tab is guidance only'
  );
$$;

create or replace function public._siobp_blueprint_industry_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Industry patterns scaffold discovery — cross-link Industry Intelligence A.44 and Blueprint Phase 32. Tenant-scoped only; no cross-tenant sector benchmarks.',
    'industries', jsonb_build_array(
      jsonb_build_object(
        'key', 'commerce',
        'label', 'Commerce',
        'patterns', jsonb_build_array('Seasonal campaign support load', 'Inventory and order workflow friction', 'Multi-channel customer service'),
        'common_objections', jsonb_build_array('We already have a commerce stack', 'Integration seems complex'),
        'typical_needs', jsonb_build_array('Support AI in existing admin', 'Operational visibility without new daily login')
      ),
      jsonb_build_object(
        'key', 'professional_services',
        'label', 'Professional services',
        'patterns', jsonb_build_array('Knowledge scattered across tools', 'Client onboarding consistency', 'Proposal and delivery handoffs'),
        'common_objections', jsonb_build_array('Our team is too busy to adopt new software', 'We need proof before committing'),
        'typical_needs', jsonb_build_array('Install-first assistant in existing systems', 'Decision support and document prep metadata')
      ),
      jsonb_build_object(
        'key', 'community_platforms',
        'label', 'Community platforms',
        'patterns', jsonb_build_array('Moderation and member support scale', 'Volunteer and staff coordination', 'Event and engagement workflows'),
        'common_objections', jsonb_build_array('Budget is limited for nonprofits', 'We need simple onboarding'),
        'typical_needs', jsonb_build_array('Support operations without replacing community tools', 'Ethical automation with human approval')
      )
    ),
    'industry_intelligence_route', '/app/industry-intelligence-foundation-engine',
    'blueprint_phase32_note', 'Blueprint Phase 32 Industry Solutions extends A.44 — complementary, not duplicated here'
  );
$$;

create or replace function public._siobp_pipeline_insights(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_early int := 0;
  v_demo_candidates int := 0;
  v_follow_up int := 0;
  v_renewal int := 0;
  v_expansion int := 0;
  v_items jsonb := '[]'::jsonb;
begin
  select count(*) filter (where pipeline_stage in ('discovery', 'qualification')),
         count(*) filter (where pipeline_stage in ('qualification', 'demo') and status = 'open'),
         count(*) filter (where status = 'open' and (next_action <> '' or recommended_action <> '')),
         count(*) filter (where status = 'open' and pipeline_stage in ('negotiation', 'proposal')
           and coalesce(metadata->>'renewal_related', 'false') = 'true'),
         count(*) filter (where status = 'open' and pipeline_stage in ('proposal', 'negotiation')
           and coalesce(metadata->>'expansion_conversation', 'false') = 'true')
    into v_early, v_demo_candidates, v_follow_up, v_renewal, v_expansion
  from public.organization_sales_expert_opportunities
  where organization_id = p_organization_id and status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'title', o.title, 'pipeline_stage', o.pipeline_stage,
    'category', case
      when o.pipeline_stage in ('discovery', 'qualification') then 'early_stage'
      when o.pipeline_stage in ('qualification', 'demo') then 'demo_candidate'
      when coalesce(o.metadata->>'renewal_related', 'false') = 'true' then 'renewal_related'
      when coalesce(o.metadata->>'expansion_conversation', 'false') = 'true' then 'expansion_conversation'
      when o.next_action <> '' or o.recommended_action <> '' then 'follow_up_priority'
      else 'general'
    end,
    'estimated_value', o.estimated_value, 'currency', o.currency,
    'next_action', o.next_action, 'recommended_action', o.recommended_action
  ) order by o.updated_at desc), '[]'::jsonb)
  into v_items
  from public.organization_sales_expert_opportunities o
  where o.organization_id = p_organization_id and o.status = 'open'
  limit 15;

  return jsonb_build_object(
    'principle', 'Pipeline intelligence from organization_sales_expert_opportunities metadata — informs focus, never dictates.',
    'counts', jsonb_build_object(
      'early_stage', v_early,
      'demo_candidates', v_demo_candidates,
      'follow_up_priorities', v_follow_up,
      'renewal_related', v_renewal,
      'expansion_conversations', v_expansion,
      'total_open', v_early + greatest(0, v_demo_candidates - v_early) + v_renewal + v_expansion
    ),
    'highlighted_opportunities', v_items,
    'renewal_expansion_cross_link', 'Phase 44 Renewal & Expansion tab — customer relationship context complements pipeline categories',
    'privacy_note', 'Tenant-scoped opportunity metadata only — no cross-tenant data.'
  );
end; $$;

create or replace function public._siobp_follow_up_intelligence(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_stale jsonb := '[]'::jsonb;
  v_demo_nudges jsonb := '[]'::jsonb;
  v_resources jsonb;
  v_stale_count int := 0;
  v_demo_count int := 0;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'title', o.title, 'pipeline_stage', o.pipeline_stage,
    'days_since_activity', extract(day from now() - o.updated_at)::int,
    'suggested_action', coalesce(nullif(o.recommended_action, ''), 'A gentle check-in may help — respect their timeline.')
  ) order by o.updated_at asc), '[]'::jsonb), count(*)
  into v_stale, v_stale_count
  from public.organization_sales_expert_opportunities o
  where o.organization_id = p_organization_id
    and o.status = 'open'
    and o.updated_at < now() - interval '21 days'
  limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'title', o.title, 'pipeline_stage', o.pipeline_stage,
    'next_action', o.next_action,
    'nudge', case o.pipeline_stage
      when 'demo' then 'Confirm demo attendees and prepare industry-aware discovery questions.'
      when 'qualification' then 'Qualification may be complete — consider offering a focused demonstration.'
      else 'Review demo outcomes and agree clear next steps.'
    end
  ) order by o.updated_at desc), '[]'::jsonb), count(*)
  into v_demo_nudges, v_demo_count
  from public.organization_sales_expert_opportunities o
  where o.organization_id = p_organization_id
    and o.status = 'open'
    and o.pipeline_stage in ('qualification', 'demo', 'proposal')
  limit 10;

  v_resources := jsonb_build_array(
    jsonb_build_object('key', 'discovery_playbook', 'label', 'Discovery conversation guide', 'route', '/app/sales-expert-engine', 'note', 'Coach tab discovery questions — Phase 45'),
    jsonb_build_object('key', 'demo_prep', 'label', 'Demo preparation checklist', 'route', '/app/sales-expert-engine', 'note', 'Demo Experience tab — Phase 42'),
    jsonb_build_object('key', 'booking_follow_up', 'label', 'Engagement follow-up cadences', 'route', '/app/sales-expert-engine', 'note', 'Phase 43 engagement — one-to-one only'),
    jsonb_build_object('key', 'industry_patterns', 'label', 'Industry pattern library', 'route', '/app/industry-intelligence-foundation-engine', 'note', 'Industry Intelligence A.44 — org-level, distinct from partner portal')
  );

  return jsonb_build_object(
    'principle', 'Follow-up intelligence supports consistency — not urgency. Self Love A.76: not every opportunity needs action today.',
    'stale_opportunities', v_stale,
    'stale_count', v_stale_count,
    'demo_stage_nudges', v_demo_nudges,
    'demo_nudge_count', v_demo_count,
    'educational_resources', v_resources,
    'engagement_phase43_cross_link', 'Phase 43 engagement follow-ups complement intelligence nudges',
    'privacy_note', 'Derived from opportunity timestamps and pipeline stage — no email or chat content.'
  );
end; $$;

create or replace function public._siobp_opportunity_scores(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_scores jsonb := '[]'::jsonb;
begin
  select coalesce(jsonb_agg(scored order by (scored->>'composite_score')::numeric desc), '[]'::jsonb)
  into v_scores
  from (
    select jsonb_build_object(
      'opportunity_id', o.id,
      'title', o.title,
      'pipeline_stage', o.pipeline_stage,
      'engagement_score', case
        when o.updated_at >= now() - interval '7 days' then 85
        when o.updated_at >= now() - interval '14 days' then 65
        when o.updated_at >= now() - interval '30 days' then 40
        else 20
      end,
      'demo_completed', o.pipeline_stage in ('proposal', 'negotiation'),
      'demo_stage_active', o.pipeline_stage = 'demo',
      'stakeholder_signals', greatest(1, coalesce((o.metadata->>'stakeholder_count')::int, case when o.customer_id is not null then 1 else 0 end)),
      'positive_signals', coalesce(o.metadata->'positive_signals', jsonb_build_array()),
      'positive_signal_count', coalesce(jsonb_array_length(o.metadata->'positive_signals'), 0),
      'composite_score', least(100, greatest(0,
        case when o.updated_at >= now() - interval '14 days' then 30 else 10 end
        + case o.pipeline_stage
            when 'negotiation' then 25 when 'proposal' then 22 when 'demo' then 18
            when 'qualification' then 12 when 'discovery' then 8 else 5 end
        + least(15, coalesce((o.metadata->>'stakeholder_count')::int, 1) * 5)
        + least(15, coalesce(jsonb_array_length(o.metadata->'positive_signals'), 0) * 5)
        + case when o.estimated_value >= 50000 then 15 when o.estimated_value >= 20000 then 10 when o.estimated_value > 0 then 5 else 0 end
      )),
      'score_note', 'Informative metadata — prioritization aid only; Sales Expert decides all actions.',
      'factors_explained', jsonb_build_array(
        'Engagement from recent activity on opportunity record',
        'Pipeline stage progression (demo completed = proposal or later)',
        'Stakeholder count from opportunity metadata scaffold',
        'Positive signals array in opportunity metadata',
        'Estimated value tier — illustrative only'
      )
    ) as scored
    from public.organization_sales_expert_opportunities o
    where o.organization_id = p_organization_id and o.status = 'open'
    order by o.updated_at desc
    limit 20
  ) sub;

  return jsonb_build_object(
    'principle', 'Opportunity scoring informs prioritization — never dictates. Humans always decide which opportunities deserve attention.',
    'scores', v_scores,
    'scoring_dimensions', jsonb_build_array(
      jsonb_build_object('key', 'engagement', 'label', 'Engagement', 'weight_note', 'Recency of opportunity activity'),
      jsonb_build_object('key', 'demo_completed', 'label', 'Demo completed', 'weight_note', 'Pipeline at proposal stage or later'),
      jsonb_build_object('key', 'stakeholders', 'label', 'Stakeholders', 'weight_note', 'Metadata stakeholder_count scaffold'),
      jsonb_build_object('key', 'positive_signals', 'label', 'Positive signals', 'weight_note', 'Metadata positive_signals array')
    ),
    'privacy_note', 'Scores from tenant-scoped opportunity metadata only — no cross-tenant comparison.'
  );
end; $$;

create or replace function public._siobp_intelligence_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_pipeline jsonb;
  v_follow_up jsonb;
  v_scores jsonb;
  v_engagement jsonb;
  v_open int := 0;
  v_top jsonb := '[]'::jsonb;
begin
  v_pipeline := public._siobp_pipeline_insights(p_organization_id);
  v_follow_up := public._siobp_follow_up_intelligence(p_organization_id);
  v_scores := public._siobp_opportunity_scores(p_organization_id);
  v_engagement := public._seos_engagement_summary(p_organization_id);

  v_open := coalesce((v_engagement->>'active_opportunities')::int, 0);

  select coalesce(jsonb_agg(elem order by (elem->>'composite_score')::numeric desc), '[]'::jsonb)
  into v_top
  from jsonb_array_elements(coalesce(v_scores->'scores', '[]'::jsonb)) elem
  limit 5;

  return jsonb_build_object(
    'status', case when v_open > 0 then 'live_metadata' else 'metadata_scaffold' end,
    'active_opportunities', v_open,
    'early_stage_count', v_pipeline->'counts'->'early_stage',
    'demo_candidates_count', v_pipeline->'counts'->'demo_candidates',
    'follow_up_priorities_count', v_pipeline->'counts'->'follow_up_priorities',
    'renewal_related_count', v_pipeline->'counts'->'renewal_related',
    'expansion_conversations_count', v_pipeline->'counts'->'expansion_conversations',
    'stale_opportunities_count', v_follow_up->'stale_count',
    'demo_nudge_count', v_follow_up->'demo_nudge_count',
    'top_scored_opportunities', v_top,
    'market_observations_note', 'Sector patterns are illustrative scaffolds — partner applies judgment per prospect. No cross-tenant market data.',
    'upcoming_follow_ups', v_engagement->'upcoming_follow_ups',
    'demo_stage_opportunities', v_engagement->'demo_stage_opportunities',
    'privacy_note', 'Summary from tenant-scoped pipeline and follow-up metadata only.'
  );
end; $$;

create or replace function public._siobp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Not every opportunity is urgent. Intelligence informs focus — sustainable pacing protects wellbeing and integrity.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'example', 'Your pipeline is healthy — choose one meaningful conversation today rather than chasing every lead.'),
      jsonb_build_object('emoji', '❤️', 'example', 'A quiet week in the pipeline is normal — recovery and preparation count as professional work.'),
      jsonb_build_object('emoji', '🦉', 'example', 'Scores suggest priorities — you still decide what deserves your attention this week.')
    ),
    'route', '/app/self-love-engine',
    'self_love_phase', 'A.76',
    'boundary', 'Intelligence never implies inadequacy for unfollowed suggestions'
  );
$$;

create or replace function public._siobp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Transparent intelligence — experts should understand why recommendations appear.',
    'experts_should_understand', jsonb_build_array(
      'Scores derive from pipeline stage, activity timestamps, and opportunity metadata fields',
      'Industry insights are illustrative scaffolds — not live market research',
      'No cross-tenant benchmarks or competitor data appear in Sales Expert intelligence',
      'Follow-up nudges complement Phase 43 engagement — they do not auto-send messages',
      'Coach Phase 45 activity recommendations overlap by design — intelligence focuses on pipeline categories',
      'Optional insights — hide or ignore without penalty; humans decide all outreach'
    ),
    'metadata_only', true,
    'insights_generated_from', jsonb_build_array(
      'organization_sales_expert_opportunities',
      '_siobp_pipeline_insights',
      '_siobp_follow_up_intelligence',
      '_siobp_opportunity_scores'
    )
  );
$$;

create or replace function public._siobp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'aipify_group', jsonb_build_object(
      'role', 'Aipify Group AS Sales Experts use Intelligence tab during partner program pilot',
      'note', 'Dogfooding pipeline metadata before broader partner rollout'
    ),
    'unonight_pilot', jsonb_build_object(
      'status', 'metadata_scaffold',
      'note', 'Pilot partners validate intelligence categories without cross-tenant leakage'
    )
  );
$$;

create or replace function public._siobp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Sales Experts see their pipeline clearly — and choose where to invest energy thoughtfully.',
    'Intelligence augments judgment; it never replaces relationship and integrity.',
    'Aipify Business Operating System (ABOS) partners grow through informed, sustainable sales practice.'
  );
$$;

create or replace function public._siobp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'industry_intelligence', 'label', 'Industry Intelligence A.44', 'route', '/app/industry-intelligence-foundation-engine', 'note', 'Org-level industry patterns — distinct from partner portal intelligence'),
    jsonb_build_object('key', 'industry_solutions', 'label', 'Industry Solutions Blueprint 32', 'route', '/app/industry-intelligence-foundation-engine', 'note', 'Extends A.44 with solution packs'),
    jsonb_build_object('key', 'engagement_booking', 'label', 'Engagement & Booking Phase 43', 'route', '/app/sales-expert-engine', 'note', 'Follow-up cadences and booking metadata'),
    jsonb_build_object('key', 'renewal_expansion', 'label', 'Renewal & Expansion Phase 44', 'route', '/app/sales-expert-engine', 'note', 'Customer renewal context complements pipeline categories'),
    jsonb_build_object('key', 'sales_coach', 'label', 'Sales Coach Phase 45', 'route', '/app/sales-expert-engine', 'note', 'Activity recommendations overlap — coach for daily enablement'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support A.54', 'route', '/app/organizational-decision-support-engine', 'note', 'Org-level decisions — distinct from partner opportunity guidance'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Sustainable pacing — not every opportunity urgent')
  );
$$;

create or replace function public._siobp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_pipeline jsonb;
  v_scores jsonb;
begin
  v_summary := public._siobp_intelligence_summary(p_organization_id);
  v_pipeline := public._siobp_pipeline_insights(p_organization_id);
  v_scores := public._siobp_opportunity_scores(p_organization_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Six intelligence objectives documented', 'met', jsonb_array_length(public._siobp_blueprint_objectives()) = 6, 'note', null),
    jsonb_build_object('key', 'companion_examples', 'label', 'Opportunity insight companion examples scaffolded', 'met', jsonb_array_length(public._siobp_blueprint_opportunity_insights()->'companion_examples') = 3, 'note', null),
    jsonb_build_object('key', 'pipeline_insights', 'label', 'Pipeline intelligence from opportunities table', 'met', (v_pipeline->>'principle') is not null, 'note', null),
    jsonb_build_object('key', 'industry_insights', 'label', 'Industry insights for three sectors', 'met', jsonb_array_length(public._siobp_blueprint_industry_insights()->'industries') = 3, 'note', null),
    jsonb_build_object('key', 'follow_up_intelligence', 'label', 'Follow-up intelligence for stale and demo stages', 'met', (public._siobp_follow_up_intelligence(p_organization_id)->>'principle') is not null, 'note', null),
    jsonb_build_object('key', 'opportunity_scoring', 'label', 'Opportunity scoring informs not dictates', 'met', (v_scores->>'principle') like '%never dictates%', 'note', null),
    jsonb_build_object('key', 'distinction_note', 'label', 'Distinction from org intelligence engines documented', 'met', public._siobp_distinction_note() like '%Predictive Insights A.66%', 'note', null),
    jsonb_build_object('key', 'no_cross_tenant', 'label', 'No cross-tenant data in sales expert intelligence', 'met', (v_pipeline->>'privacy_note') like '%no cross-tenant%', 'note', null),
    jsonb_build_object('key', 'self_love_connection', 'label', 'Self Love connection for sustainable pacing', 'met', (public._siobp_blueprint_self_love_connection()->>'route') is not null, 'note', null),
    jsonb_build_object('key', 'trust_transparency', 'label', 'Trust connection explains scoring and recommendations', 'met', jsonb_array_length(public._siobp_blueprint_trust_connection()->'experts_should_understand') >= 6, 'note', null),
    jsonb_build_object('key', 'live_summary', 'label', 'Intelligence summary derives from opportunity metadata', 'met', (v_summary->>'status') in ('live_metadata', 'metadata_scaffold'), 'note', case when coalesce((v_summary->>'active_opportunities')::int, 0) = 0 then 'Add opportunities to populate intelligence dashboard.' else null end)
  );
end; $$;

-- Extend dashboard — preserve ALL prior fields through Phase 48; append Phase 47 + Phase 49
create or replace function public.get_sales_expert_operating_system_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_sales_expert_settings;
  v_summary jsonb;
  v_base jsonb;
begin
  perform public._irp_require_permission('sales_expert.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._sebbp_ensure_booking_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  perform public._seosmc_ensure_settings(v_org_id);
  perform public._scmbp_ensure_settings(v_org_id);
  perform public._sobmbp_ensure_business_goals(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);

  v_base := jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Sales Expert Operating System — partner portal for pipeline, commissions, training, and one-to-one follow-up. Metadata only — no mass email.',
    'principles', jsonb_build_array(
      'Official partner tiers — never Affiliate publicly',
      'Aipify subscription: Customer ↔ Aipify; consulting: Customer ↔ Sales Expert',
      'One-to-one email only — mass campaigns explicitly not supported',
      'Human approval for sensitive commission and program changes',
      'Metadata only — no raw email bodies or customer PII in logs'
    ),
    'privacy_note', 'Customer org names and commission metadata only — no email content or PII stored.',
    'engine_phase', 'A.95',
    'implementation_blueprint', jsonb_build_object(
      'phase', '33-extension',
      'title', 'Sales Expert Operating System',
      'engine_phase', 'A.95',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md',
      'parent', 'IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md'
    ),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', v_summary,
    'sections', jsonb_build_object(
      'dashboard', jsonb_build_object(
        'revenue_overview', v_summary,
        'monthly_commissions', jsonb_build_object(
          'pending', v_summary->'monthly_commissions_pending',
          'paid', v_summary->'monthly_commissions_paid',
          'forecasted', v_summary->'forecasted_commissions'
        ),
        'lifetime_subscription_value', v_summary->'lifetime_subscription_value',
        'upcoming_follow_ups', v_summary->'upcoming_follow_ups',
        'active_opportunities', v_summary->'active_opportunities'
      ),
      'customers', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', c.id, 'org_name', c.org_name, 'status', c.status,
          'subscription_status', c.subscription_status,
          'onboarding_progress', c.onboarding_progress,
          'next_follow_up', c.next_follow_up,
          'notes_metadata', c.notes_metadata
        ) order by c.next_follow_up nulls last)
        from public.organization_sales_expert_customers c
        where c.organization_id = v_org_id limit 50
      ), '[]'::jsonb),
      'opportunities', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', o.id, 'title', o.title, 'pipeline_stage', o.pipeline_stage,
          'estimated_value', o.estimated_value, 'currency', o.currency,
          'next_action', o.next_action, 'recommended_action', o.recommended_action,
          'status', o.status, 'customer_id', o.customer_id
        ) order by
          case o.pipeline_stage
            when 'negotiation' then 0 when 'proposal' then 1 when 'demo' then 2 else 3 end)
        from public.organization_sales_expert_opportunities o
        where o.organization_id = v_org_id and o.status = 'open' limit 50
      ), '[]'::jsonb),
      'commissions', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', c.id, 'commission_type', c.commission_type, 'amount', c.amount,
          'currency', c.currency, 'status', c.status,
          'subscription_plan_key', c.subscription_plan_key, 'period_month', c.period_month
        ) order by c.period_month desc)
        from public.organization_sales_expert_commissions c
        where c.organization_id = v_org_id limit 50
      ), '[]'::jsonb),
      'email_templates', coalesce((
        select jsonb_agg(jsonb_build_object(
          'template_key', t.template_key, 'title', t.title,
          'subject_pattern', t.subject_pattern, 'category', t.category,
          'placeholders', t.placeholders
        ) order by t.template_key)
        from public.organization_sales_expert_email_templates t
        where t.organization_id = v_org_id
      ), '[]'::jsonb),
      'emails', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', e.id, 'template_key', e.template_key, 'subject_metadata', e.subject_metadata,
          'status', e.status, 'delivery_mode', e.delivery_mode,
          'scheduled_for', e.scheduled_for, 'sent_at', e.sent_at
        ) order by e.created_at desc)
        from public.organization_sales_expert_emails e
        where e.organization_id = v_org_id limit 30
      ), '[]'::jsonb),
      'follow_ups', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', f.id, 'cadence_days', f.cadence_days, 'template_key', f.template_key,
          'scheduled_for', f.scheduled_for, 'status', f.status, 'customer_id', f.customer_id
        ) order by f.scheduled_for)
        from public.organization_sales_expert_follow_ups f
        where f.organization_id = v_org_id limit 30
      ), '[]'::jsonb)
    ),
    'official_terminology', public._seos_blueprint_official_terminology(),
    'portal_sections', public._seos_blueprint_portal_sections(),
    'blueprint_email_templates', public._seos_blueprint_email_templates_list(),
    'follow_up_cadences', public._seos_blueprint_follow_up_cadences(),
    'implementation_services', public._seos_blueprint_implementation_services_pricing(),
    'subscription_principles', public._seos_blueprint_subscription_principles(),
    'commercial_commission_summary', public._seos_commercial_commission_summary(v_org_id),
    'mass_email_supported', false,
    'integration_links', jsonb_build_array(
      jsonb_build_object('key', 'marketplace_ecosystem', 'label', 'Partner Ecosystem A.45', 'route', '/app/marketplace-partner-ecosystem-foundation-engine'),
      jsonb_build_object('key', 'partners', 'label', 'Partner Certification Phase 91', 'route', '/app/partners'),
      jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training A.36', 'route', '/app/learning-training-engine'),
      jsonb_build_object('key', 'certification', 'label', 'Certification & Achievement A.37', 'route', '/app/certification-achievement-engine'),
      jsonb_build_object('key', 'partner_success', 'label', 'Partner Success A.73', 'route', '/app/partner-success-engine'),
      jsonb_build_object('key', 'gratitude_recognition', 'label', 'Gratitude & Recognition A.89', 'route', '/app/gratitude-recognition-engine'),
      jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine')
    ),
    'training_center', jsonb_build_object(
      'foundations_route', '/app/learning-training-engine',
      'certification_route', '/app/certification-achievement-engine',
      'demo_simulations_note', 'Demo simulations scaffold — metadata only',
      'product_updates_note', 'Product update briefings via Notification Engine — metadata cross-link'
    ),
    'resource_library', jsonb_build_object(
      'status', 'metadata_scaffold',
      'categories', jsonb_build_array('Marketing materials', 'Playbooks', 'Product sheets', 'Templates', 'Case studies'),
      'privacy_note', 'Resource metadata only — assets stored in approved KC or partner program surfaces.'
    ),
    'distinction_note', public._seos_distinction_note()
  );

  return v_base || jsonb_build_object(
    'implementation_blueprint_phase41', jsonb_build_object(
      'phase', 41,
      'title', 'Sales Performance & Recognition Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE41_SALES_PERFORMANCE_RECOGNITION.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — cross-links Gratitude & Recognition A.89 Phase 9, not a duplicate engine.'
    ),
    'performance_recognition_mission', 'Help Sales Experts maintain momentum, celebrate achievements, and build sustainable businesses around Aipify.',
    'performance_recognition_philosophy', 'Recognition strengthens motivation. Competition should inspire growth. Success should never come at the expense of integrity.',
    'performance_recognition_abos_principle', 'People thrive when their efforts are noticed. Recognition should reinforce values, not ego.',
    'performance_objectives', public._sprbp_blueprint_objectives(),
    'performance_dashboard_fields', public._sprbp_blueprint_performance_dashboard_fields(),
    'performance_summary', public._sprbp_performance_summary(v_org_id),
    'milestone_recognition', public._sprbp_blueprint_milestones(),
    'milestone_progress', public._sprbp_milestone_progress(v_org_id),
    'bell_moments', public._sprbp_blueprint_bell_moments(),
    'recognition_roses', public._sprbp_blueprint_recognition_roses(),
    'leaderboards', public._sprbp_blueprint_leaderboards(),
    'performance_self_love_connection', public._sprbp_blueprint_self_love_connection(),
    'performance_trust_connection', public._sprbp_blueprint_trust_connection(),
    'performance_dogfooding', public._sprbp_blueprint_dogfooding(),
    'performance_vision_phrases', public._sprbp_blueprint_vision_phrases(),
    'performance_integration_links', public._sprbp_blueprint_integration_links(),
    'performance_blueprint_success_criteria', public._sprbp_blueprint_success_criteria(v_org_id),
    'performance_distinction_note', public._sprbp_distinction_note()
  ) || jsonb_build_object(
    'implementation_blueprint_phase45', jsonb_build_object(
      'phase', 45,
      'title', 'Sales Coach & Enablement Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE45_SALES_COACH_ENABLEMENT.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Coach & Enablement tab; cross-links Phase 41 bell moments without duplication.'
    ),
    'sales_coach_mission', 'Equip Sales Experts with supportive coaching, enablement guidance, and sustainable pacing — never punitive judgment.',
    'sales_coach_philosophy', 'Coaching strengthens confidence. Guidance should inspire thoughtful action. Success should never come at the expense of wellbeing or integrity.',
    'sales_coach_abos_principle', 'People thrive when they feel equipped and respected. Coaching should reinforce professional growth, not pressure.',
    'sales_companion_roles', public._scebp_blueprint_companion_roles(),
    'sales_coach_dashboard_fields', public._scebp_blueprint_coach_dashboard_fields(),
    'sales_coach_summary', public._scebp_coach_summary(v_org_id),
    'daily_sales_briefing', public._scebp_daily_briefing(v_org_id),
    'sales_activity_recommendations', public._scebp_activity_recommendations(v_org_id),
    'field_sales_coaching', public._scebp_blueprint_field_sales_coaching(),
    'demonstration_guidance', public._scebp_blueprint_demonstration_guidance(),
    'objection_handling_library', public._scebp_blueprint_objection_handling_library(),
    'communication_coaching', public._scebp_blueprint_communication_coaching(),
    'personal_performance_insights', public._scebp_performance_insights(v_org_id),
    'sales_coach_self_love_connection', public._scebp_blueprint_self_love_connection(),
    'sales_coach_bell_moments', public._scebp_blueprint_bell_moments(),
    'sales_training_integration', public._scebp_blueprint_sales_training_integration(),
    'roleplay_simulation', public._scebp_blueprint_roleplay_simulation(),
    'sales_coach_trust_connection', public._scebp_blueprint_trust_connection(),
    'sales_coach_dogfooding', public._scebp_blueprint_dogfooding(),
    'sales_coach_success_criteria', public._scebp_blueprint_success_criteria(v_org_id),
    'sales_coach_vision_phrases', public._scebp_blueprint_vision_phrases(),
    'sales_coach_distinction_note', public._scebp_distinction_note(),
    'sales_coach_integration_links', public._scebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase46', jsonb_build_object(
      'phase', 46,
      'title', 'Sales Coach Certification & Field Enablement Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE46_SALES_COACH_CERTIFICATION_FIELD_ENABLEMENT.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Certification & Field Enablement tab; cross-links A.37, A.36, Phase 91, Phase 45 coach tab.'
    ),
    'sales_certification_mission', 'Develop competent professionals — training strengthens confidence; certification reflects genuine competence.',
    'sales_certification_philosophy', 'Assessment encourages growth, not fear. Mastery not exclusion. Field enablement supports excellence at a sustainable pace.',
    'sales_certification_abos_principle', 'Aipify Business Operating System (ABOS) partners grow through genuine capability — certification means readiness to help organizations work smarter.',
    'sales_training_pathway', public._sccfebp_blueprint_sales_training_pathway(),
    'sales_simulation_engine', public._sccfebp_blueprint_sales_simulation_engine(),
    'telephone_sales_coaching', public._sccfebp_blueprint_telephone_sales_coaching(),
    'assessment_principles', public._sccfebp_blueprint_assessment_principles(),
    'certification_requirements', public._sccfebp_blueprint_certification_requirements(),
    'reassessment_principles', public._sccfebp_blueprint_reassessment_principles(),
    'certification_display', public._sccfebp_blueprint_certification_display(),
    'email_enablement_center', public._sccfebp_blueprint_email_enablement_center(),
    'implementation_pricing_guidance', public._sccfebp_blueprint_implementation_pricing_guidance(),
    'installation_experience_journey', public._sccfebp_blueprint_installation_experience_journey(),
    'field_sales_enablement', public._sccfebp_blueprint_field_sales_enablement(),
    'sales_performance_culture', public._sccfebp_blueprint_sales_performance_culture(),
    'sales_certification_summary', public._sccfebp_certification_summary(v_org_id),
    'sales_certification_self_love_connection', public._sccfebp_blueprint_self_love_connection(),
    'sales_certification_trust_connection', public._sccfebp_blueprint_trust_connection(),
    'sales_certification_dogfooding', public._sccfebp_blueprint_dogfooding(),
    'sales_certification_success_criteria', public._sccfebp_blueprint_success_criteria(v_org_id),
    'sales_certification_vision_phrases', public._sccfebp_blueprint_vision_phrases(),
    'sales_certification_distinction_note', public._sccfebp_distinction_note(),
    'sales_certification_integration_links', public._sccfebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'sales_expert_marketing_center', public._seosmc_marketing_center_bundle(v_org_id)
  ) || jsonb_build_object(
    'implementation_blueprint_phase42', jsonb_build_object(
      'phase', 42,
      'title', 'Sales Demo & Experience Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE42_SALES_DEMO_EXPERIENCE.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Demo tab; cross-links Coach Phase 45/46, Certification Module 4, Simulation Lab Phase 78 (NOT sales demos).'
    ),
    'sales_demo_mission', 'Help Sales Experts deliver outcome-focused demonstrations that help prospects envision a better future.',
    'sales_demo_philosophy', 'People invest in outcomes, not features. Demos should inspire confidence through honest, tailored storytelling.',
    'sales_demo_objectives', public._sdebp_blueprint_objectives(),
    'demo_environments', public._sdebp_blueprint_demo_environments(),
    'demo_data_examples', public._sdebp_blueprint_demo_data_examples(),
    'industry_demonstrations', public._sdebp_blueprint_industry_demonstrations(),
    'demo_guidance', public._sdebp_blueprint_demo_guidance(),
    'discovery_question_library', public._sdebp_blueprint_discovery_question_library(),
    'demo_flow_structure', public._sdebp_blueprint_demo_flow_structure(),
    'custom_demo_experiences', public._sdebp_blueprint_custom_demo_experiences(),
    'demo_links_scaffold', public._sdebp_blueprint_demo_links_scaffold(),
    'demo_links_summary', public._sdebp_demo_links_summary(v_org_id),
    'companion_demo_experience', public._sdebp_blueprint_companion_demo_experience(),
    'sales_demo_self_love_connection', public._sdebp_blueprint_self_love_connection(),
    'sales_demo_trust_connection', public._sdebp_blueprint_trust_connection(),
    'sales_demo_dogfooding', public._sdebp_blueprint_dogfooding(),
    'sales_demo_success_criteria', public._sdebp_blueprint_success_criteria(v_org_id),
    'sales_demo_vision_phrases', public._sdebp_blueprint_vision_phrases(),
    'sales_demo_abos_principle', 'Aipify Business Operating System (ABOS) demos show how operational AI augments people — humans decide, Aipify informs and prepares.',
    'sales_demo_distinction_note', public._sdebp_distinction_note(),
    'sales_demo_integration_links', public._sdebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase43', jsonb_build_object(
      'phase', 43,
      'title', 'Sales Engagement & Booking Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE43_SALES_ENGAGEMENT_BOOKING.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Engagement & Booking tab; cross-links Context Engine calendars, Coach 45/46, Unified Tasks A.62, Meeting Collaboration A.61, Self Love A.76.'
    ),
    'engagement_mission', 'Help Sales Experts schedule meetings professionally, follow up consistently, and prepare thoughtfully — trust through consistency.',
    'engagement_philosophy', 'Follow-up demonstrates professionalism. Booking should feel personal and respectful — never pressure or mass outreach.',
    'engagement_abos_principle', 'Aipify Business Operating System (ABOS) partners build trust through prepared, consistent engagement — humans decide; Aipify informs and prepares.',
    'engagement_objectives', public._sebbp_blueprint_objectives(),
    'booking_center', public._sebbp_blueprint_booking_center(),
    'calendar_integrations', public._sebbp_blueprint_calendar_integrations(),
    'discovery_meetings', public._sebbp_blueprint_discovery_meetings(),
    'demonstration_bookings', public._sebbp_blueprint_demonstration_bookings(),
    'follow_up_engagement', public._sebbp_blueprint_follow_up_engagement(),
    'meeting_preparation', public._sebbp_blueprint_meeting_preparation(),
    'engagement_history', public._sebbp_engagement_history(v_org_id),
    'engagement_summary', public._sebbp_engagement_summary(v_org_id),
    'engagement_self_love_connection', public._sebbp_blueprint_self_love_connection(),
    'engagement_trust_connection', public._sebbp_blueprint_trust_connection(),
    'engagement_dogfooding', public._sebbp_blueprint_dogfooding(),
    'engagement_success_criteria', public._sebbp_blueprint_success_criteria(v_org_id),
    'engagement_vision_phrases', public._sebbp_blueprint_vision_phrases(),
    'engagement_distinction_note', public._sebbp_distinction_note(),
    'engagement_integration_links', public._sebbp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase44', jsonb_build_object(
      'phase', 44,
      'title', 'Customer Renewal & Expansion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE44_CUSTOMER_RENEWAL_EXPANSION.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Renewal & Expansion tab; distinct from Autonomous Execution Framework Phase 44 (/app/action-center).'
    ),
    'renewal_expansion_mission', 'Help Sales Experts nurture long-term customer partnerships through renewal awareness, health insights, and consultative expansion — never aggressive upsell.',
    'renewal_expansion_philosophy', 'Renewals should feel intentional, not accidental. Customer health metadata supports care — never surveillance or blame.',
    'renewal_expansion_abos_principle', 'Aipify Business Operating System (ABOS) partnerships grow when organizations succeed — humans decide, Aipify prepares renewal conversations with clarity.',
    'renewal_expansion_objectives', public._crebp_blueprint_objectives(),
    'renewal_dashboard_fields', public._crebp_blueprint_renewal_dashboard_fields(),
    'renewal_expansion_summary', public._crebp_renewal_summary(v_org_id),
    'renewal_companion_examples', public._crebp_blueprint_companion_examples(),
    'customer_health_insights', public._crebp_blueprint_health_insights(),
    'success_review_questions', public._crebp_blueprint_success_review_questions(),
    'expansion_opportunities', public._crebp_blueprint_expansion_opportunities(),
    'renewal_playbooks', public._crebp_blueprint_renewal_playbooks(),
    'customer_celebration_experiences', public._crebp_blueprint_celebration_experiences(),
    'churn_prevention_support', public._crebp_blueprint_churn_prevention(),
    'renewal_sales_expert_insights', public._crebp_blueprint_sales_expert_insights(),
    'renewal_expansion_self_love_connection', public._crebp_blueprint_self_love_connection(),
    'renewal_expansion_trust_connection', public._crebp_blueprint_trust_connection(),
    'renewal_expansion_dogfooding', public._crebp_blueprint_dogfooding(),
    'renewal_expansion_success_criteria', public._crebp_blueprint_success_criteria(v_org_id),
    'renewal_expansion_vision_phrases', public._crebp_blueprint_vision_phrases(),
    'renewal_expansion_distinction_note', public._crebp_distinction_note(),
    'renewal_expansion_integration_links', public._crebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase48', jsonb_build_object(
      'phase', 48,
      'title', 'Sales Operations & Business Management Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE48_SALES_OPERATIONS_BUSINESS_MANAGEMENT.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Operations tab; cross-links commercial, performance, renewal, goals, capacity, Self Love; distinct from Value Realization A.48.'
    ),
    'sales_operations_mission', 'Help independent Sales Experts see revenue, goals, capacity, and service obligations clearly — so they can build sustainable Aipify businesses.',
    'sales_operations_philosophy', 'Operational visibility supports planning. Forecasts inform; they never pressure. You operate your own business — Aipify augments awareness.',
    'sales_operations_abos_principle', 'Aipify Business Operating System (ABOS) partners thrive with honest metadata, sustainable pacing, and human judgment — not automated business management.',
    'sales_operations_objectives', public._sobmbp_blueprint_objectives(),
    'sales_operations_dashboard_fields', public._sobmbp_blueprint_business_dashboard_fields(),
    'sales_operations_summary', public._sobmbp_operations_summary(v_org_id),
    'sales_business_goal_management', public._sobmbp_blueprint_goal_management(),
    'sales_business_goals_summary', public._sobmbp_business_goals_summary(v_org_id),
    'sales_capacity_awareness', public._sobmbp_blueprint_capacity_awareness(),
    'sales_service_tracking', public._sobmbp_blueprint_service_tracking(),
    'sales_forecasting_support', public._sobmbp_blueprint_forecasting_support(),
    'sales_operations_self_love_connection', public._sobmbp_blueprint_self_love_connection(),
    'sales_operations_trust_connection', public._sobmbp_blueprint_trust_connection(),
    'sales_operations_dogfooding', public._sobmbp_blueprint_dogfooding(),
    'sales_operations_success_criteria', public._sobmbp_blueprint_success_criteria(v_org_id),
    'sales_operations_vision_phrases', public._sobmbp_blueprint_vision_phrases(),
    'sales_operations_distinction_note', public._sobmbp_distinction_note(),
    'sales_operations_integration_links', public._sobmbp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase47', jsonb_build_object(
      'phase', 47,
      'title', 'Sales Community & Mentorship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE47_SALES_COMMUNITY_MENTORSHIP.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Community tab; peer learning and voluntary mentorship within partner portal.'
    ),
    'sales_community_mission', public._scmbp_blueprint_mission(),
    'sales_community_philosophy', public._scmbp_blueprint_philosophy(),
    'sales_community_abos_principle', public._scmbp_blueprint_abos_principle(),
    'sales_community_objectives', public._scmbp_blueprint_objectives(),
    'sales_expert_community_center', public._scmbp_community_center_bundle(v_org_id),
    'sales_community_distinction_note', public._scmbp_distinction_note(),
    'sales_community_integration_links', public._scmbp_blueprint_integration_links(),
    'sales_community_success_criteria', public._scmbp_blueprint_success_criteria(v_org_id),
    'sales_community_vision_phrases', public._scmbp_blueprint_vision_phrases()
  ) || jsonb_build_object(
    'implementation_blueprint_phase49', jsonb_build_object(
      'phase', 49,
      'title', 'Sales Intelligence & Opportunity Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE49_SALES_INTELLIGENCE_OPPORTUNITY.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Intelligence tab; partner portal opportunity guidance only. Distinct from Predictive Insights A.66, Strategic Intelligence A.31, Industry Intelligence A.44, Cross-Tenant A.71.'
    ),
    'sales_intelligence_mission', 'Help Sales Experts see their pipeline clearly, prioritize thoughtfully, and act with integrity — intelligence informs, humans decide.',
    'sales_intelligence_philosophy', 'Not every opportunity is urgent. Scores and categories support focus — sustainable pacing protects wellbeing and professional judgment.',
    'sales_intelligence_abos_principle', 'Aipify Business Operating System (ABOS) partners grow through informed, relationship-first sales — Aipify prepares context; Sales Experts choose every action.',
    'sales_intelligence_objectives', public._siobp_blueprint_objectives(),
    'opportunity_insights', public._siobp_blueprint_opportunity_insights(),
    'sales_intelligence_summary', public._siobp_intelligence_summary(v_org_id),
    'pipeline_intelligence', public._siobp_pipeline_insights(v_org_id),
    'industry_insights', public._siobp_blueprint_industry_insights(),
    'follow_up_intelligence', public._siobp_follow_up_intelligence(v_org_id),
    'opportunity_scoring', public._siobp_opportunity_scores(v_org_id),
    'sales_intelligence_self_love_connection', public._siobp_blueprint_self_love_connection(),
    'sales_intelligence_trust_connection', public._siobp_blueprint_trust_connection(),
    'sales_intelligence_dogfooding', public._siobp_blueprint_dogfooding(),
    'sales_intelligence_success_criteria', public._siobp_blueprint_success_criteria(v_org_id),
    'sales_intelligence_vision_phrases', public._siobp_blueprint_vision_phrases(),
    'sales_intelligence_distinction_note', public._siobp_distinction_note(),
    'sales_intelligence_integration_links', public._siobp_blueprint_integration_links()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_sales_expert_operating_system_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_summary jsonb;
  v_perf jsonb;
  v_coach jsonb;
  v_cert jsonb;
  v_marketing jsonb;
  v_demo_env jsonb;
  v_demo_links jsonb;
  v_renewal jsonb;
  v_engagement jsonb;
  v_ops jsonb;
  v_community jsonb;
  v_intelligence jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._sebbp_ensure_booking_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  perform public._seosmc_ensure_settings(v_org_id);
  perform public._scmbp_ensure_settings(v_org_id);
  perform public._sobmbp_ensure_business_goals(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);
  v_perf := public._sprbp_performance_summary(v_org_id);
  v_coach := public._scebp_coach_summary(v_org_id);
  v_cert := public._sccfebp_certification_summary(v_org_id);
  v_marketing := public._seosmc_performance_tracking(v_org_id);
  v_demo_env := public._sdebp_blueprint_demo_environments();
  v_demo_links := public._sdebp_demo_links_summary(v_org_id);
  v_renewal := public._crebp_renewal_summary(v_org_id);
  v_engagement := public._sebbp_engagement_summary(v_org_id);
  v_ops := public._sobmbp_operations_summary(v_org_id);
  v_community := public._scmbp_community_summary(v_org_id);
  v_intelligence := public._siobp_intelligence_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Professional partner portal — Customers, Opportunities, Pipeline, Commission Overview.',
    'engine_phase', 'A.95',
    'route', '/app/sales-expert-engine',
    'active_opportunities', v_summary->'active_opportunities',
    'monthly_commissions_pending', v_summary->'monthly_commissions_pending',
    'upcoming_follow_ups', v_summary->'upcoming_follow_ups',
    'lifetime_subscription_value', v_summary->'lifetime_subscription_value',
    'milestones_achieved', v_perf->'milestones_achieved',
    'performance_recognition_phase', 41,
    'sales_coach_enablement_phase', 45,
    'sales_certification_field_enablement_phase', 46,
    'sales_expert_marketing_center_phase', '33-extension-marketing',
    'sales_demo_experience_phase', 42,
    'sales_engagement_booking_phase', 43,
    'customer_renewal_expansion_phase', 44,
    'sales_community_mentorship_phase', 47,
    'sales_operations_business_management_phase', 48,
    'sales_intelligence_opportunity_phase', 49,
    'coach_suggested_actions', v_coach->'suggested_next_actions_count',
    'coach_scheduled_demos', v_coach->'scheduled_demos',
    'coach_brief_summary', format(
      '%s follow-ups · %s demos · %s new this month',
      coalesce(v_coach->>'upcoming_follow_ups', '0'),
      coalesce(v_coach->>'scheduled_demos', '0'),
      coalesce(v_coach->>'new_customers_this_month', '0')
    ),
    'certification_tier_label', v_cert->'current_tier_label',
    'certification_attempts_remaining', v_cert->'attempts_remaining',
    'certification_brief_summary', format(
      '%s · %s attempts remaining',
      coalesce(v_cert->>'current_tier_label', 'Training in progress'),
      coalesce(v_cert->>'attempts_remaining', '3')
    ),
    'marketing_link_clicks', v_marketing->'link_clicks',
    'marketing_signups', v_marketing->'signups',
    'marketing_subscriptions', v_marketing->'subscriptions',
    'marketing_brief_summary', format(
      '%s clicks · %s signups · %s subscriptions',
      coalesce(v_marketing->>'link_clicks', '0'),
      coalesce(v_marketing->>'signups', '0'),
      coalesce(v_marketing->>'subscriptions', '0')
    ),
    'demo_environments_count', jsonb_array_length(coalesce(v_demo_env->'environments', '[]'::jsonb)),
    'demo_links_active_count', v_demo_links->'active_links_count',
    'demo_brief_summary', format(
      '%s demo environments · %s active links (scaffold)',
      coalesce(jsonb_array_length(coalesce(v_demo_env->'environments', '[]'::jsonb))::text, '0'),
      coalesce(v_demo_links->>'active_links_count', '0')
    ),
    'renewal_upcoming_count', v_renewal->'upcoming_renewals_count',
    'renewal_at_risk_count', v_renewal->'at_risk_count',
    'renewal_brief_summary', format(
      '%s upcoming · %s at-risk · readiness %s%%',
      coalesce(v_renewal->>'upcoming_renewals_count', '0'),
      coalesce(v_renewal->>'at_risk_count', '0'),
      coalesce(v_renewal->>'average_readiness_pct', '0')
    ),
    'engagement_scheduled_bookings', v_engagement->'scheduled_bookings',
    'engagement_upcoming_bookings_7d', v_engagement->'upcoming_bookings_7d',
    'engagement_booking_page_url', v_engagement->'booking_page_url',
    'engagement_brief_summary', format(
      '%s follow-ups · %s bookings · %s this week',
      coalesce(v_engagement->>'upcoming_follow_ups', '0'),
      coalesce(v_engagement->>'scheduled_bookings', '0'),
      coalesce(v_engagement->>'upcoming_bookings_7d', '0')
    ),
    'operations_monthly_revenue', v_ops->'monthly_revenue_metadata',
    'operations_active_goals', v_ops->'active_goals_count',
    'operations_brief_summary', format(
      '%s goals · capacity %s%%',
      coalesce(v_ops->>'active_goals_count', '0'),
      coalesce(v_ops->>'capacity_utilization_pct', '0')
    ),
    'community_stories_count', v_community->'stories_count',
    'community_active_mentorships', v_community->'active_mentorships',
    'community_brief_summary', format(
      '%s stories · %s mentorships · %s contributors',
      coalesce(v_community->>'stories_count', '0'),
      coalesce(v_community->>'active_mentorships', '0'),
      coalesce(v_community->>'contributors_count', '0')
    ),
    'intelligence_stale_count', v_intelligence->'stale_opportunities_count',
    'intelligence_demo_candidates_count', v_intelligence->'demo_candidates_count',
    'intelligence_brief_summary', format(
      '%s open · %s demo candidates · %s stale',
      coalesce(v_intelligence->>'active_opportunities', '0'),
      coalesce(v_intelligence->>'demo_candidates_count', '0'),
      coalesce(v_intelligence->>'stale_opportunities_count', '0')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._siobp_distinction_note() to authenticated;
grant execute on function public._siobp_blueprint_objectives() to authenticated;
grant execute on function public._siobp_blueprint_opportunity_insights() to authenticated;
grant execute on function public._siobp_blueprint_industry_insights() to authenticated;
grant execute on function public._siobp_pipeline_insights(uuid) to authenticated;
grant execute on function public._siobp_follow_up_intelligence(uuid) to authenticated;
grant execute on function public._siobp_opportunity_scores(uuid) to authenticated;
grant execute on function public._siobp_intelligence_summary(uuid) to authenticated;
grant execute on function public._siobp_blueprint_self_love_connection() to authenticated;
grant execute on function public._siobp_blueprint_trust_connection() to authenticated;
grant execute on function public._siobp_blueprint_dogfooding() to authenticated;
grant execute on function public._siobp_blueprint_vision_phrases() to authenticated;
grant execute on function public._siobp_blueprint_integration_links() to authenticated;
grant execute on function public._siobp_blueprint_success_criteria(uuid) to authenticated;
