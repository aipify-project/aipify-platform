-- Implementation Blueprint Phase 44 — Customer Renewal & Expansion Engine
-- Extends Sales Expert Operating System (A.95 + Phases 41, 45, 46, 42, marketing 33-extension). No new tables.

create or replace function public._crebp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 44 — Customer Renewal & Expansion at /app/sales-expert-engine Renewal & Expansion tab. Distinct from Autonomous Execution Framework Phase 44 (/app/action-center, AEF) — controlled business action execution, not partner renewal coaching. Cross-links Revenue Intelligence Phase 39 (/app/commercial), Customer Success A.26, Partner Success A.73, Performance Phase 41, commercial_renewal_events / commercial_customer_health_scores (Phase 93 metadata only), Business Packs A.43 — never duplicate.';
$$;

create or replace function public._crebp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'renewal_awareness', 'label', 'Renewal awareness', 'description', 'Upcoming renewals, anniversaries, and intentional follow-up windows — never accidental surprises'),
    jsonb_build_object('key', 'health_monitoring', 'label', 'Customer health monitoring', 'description', 'Aggregate engagement, adoption, and readiness signals — metadata only, no PII'),
    jsonb_build_object('key', 'expansion_recommendations', 'label', 'Expansion recommendations', 'description', 'Consultative opportunities — team growth, business packs, intelligence modules — never aggressive upsell'),
    jsonb_build_object('key', 'success_planning', 'label', 'Success planning', 'description', 'Success review questions and next-year outcomes — relationship-focused'),
    jsonb_build_object('key', 'risk_support', 'label', 'Risk support', 'description', 'Early at-risk signals with prevention guidance — support, not blame'),
    jsonb_build_object('key', 'relationships', 'label', 'Long-term relationships', 'description', 'Celebration moments and partnership continuity — humans decide, Aipify prepares')
  );
$$;

create or replace function public._crebp_blueprint_renewal_dashboard_fields()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'upcoming_renewals', 'label', 'Upcoming renewals'),
    jsonb_build_object('key', 'recently_renewed', 'label', 'Recently renewed'),
    jsonb_build_object('key', 'anniversaries', 'label', 'Customer anniversaries'),
    jsonb_build_object('key', 'readiness_indicators', 'label', 'Renewal readiness indicators'),
    jsonb_build_object('key', 'at_risk_count', 'label', 'At-risk relationships')
  );
$$;

create or replace function public._crebp_blueprint_companion_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('emoji', '🔔', 'example', 'Two customer relationships may benefit from a renewal conversation in the next 30 days — here is what Aipify noticed from follow-up metadata.'),
    jsonb_build_object('emoji', '🌹', 'example', 'A customer recently renewed — a thoughtful check-in may strengthen the partnership.'),
    jsonb_build_object('emoji', '🔔', 'example', 'An anniversary is approaching — celebrate progress before discussing next year.'),
    jsonb_build_object('emoji', '🌹', 'example', 'Onboarding readiness looks strong — a success review may be a natural next step.')
  );
$$;

create or replace function public._crebp_blueprint_health_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Engagement signals are aggregate metadata — login frequency patterns, training completion, support volume trends, Knowledge Center usage, workflow adoption — never raw customer records.',
    'signals', jsonb_build_array(
      jsonb_build_object('key', 'login_frequency', 'label', 'Login frequency', 'description', 'Aggregate active-user trend — metadata counts only'),
      jsonb_build_object('key', 'training_completion', 'label', 'Training completion', 'description', 'Learning & Training module progress — no personal content'),
      jsonb_build_object('key', 'support_engagement', 'label', 'Support engagement', 'description', 'Case volume and resolution trend metadata — no ticket bodies'),
      jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center usage', 'description', 'Article engagement counts — no search queries with PII'),
      jsonb_build_object('key', 'workflow_adoption', 'label', 'Workflow adoption', 'description', 'Active workflow count and completion rates — process metadata only')
    ),
    'commercial_health_cross_link', '/app/commercial',
    'commercial_tables_note', 'commercial_customer_health_scores (Phase 93) — health, engagement, adoption, renewal_likelihood, expansion_opportunity when available',
    'metadata_only', true
  );
$$;

create or replace function public._crebp_blueprint_success_review_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Success reviews focus on outcomes and partnership — not interrogation.',
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'outcomes', 'label', 'Outcomes achieved', 'questions', jsonb_build_array(
        'What operational improvements has your team noticed since adopting Aipify?',
        'Which workflows or modules deliver the most value today?'
      )),
      jsonb_build_object('key', 'challenges', 'label', 'Challenges addressed', 'questions', jsonb_build_array(
        'What friction remains that we should address together?',
        'Are there areas where expectations and outcomes diverged — honestly?'
      )),
      jsonb_build_object('key', 'future_value', 'label', 'Future value', 'questions', jsonb_build_array(
        'Where could Aipify support your organization in the next 12 months?',
        'Are there teams or workflows not yet using Aipify that might benefit?'
      )),
      jsonb_build_object('key', 'next_year_success', 'label', 'Next year success', 'questions', jsonb_build_array(
        'What would a successful partnership look like one year from now?',
        'Which one outcome would make renewal feel clearly worthwhile?'
      ))
    )
  );
$$;

create or replace function public._crebp_blueprint_expansion_opportunities()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Expansion is consultative — understand workflow before recommending. Never aggressive upsell.',
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'team_members', 'label', 'Team members', 'guidance', 'Additional seats when collaboration patterns suggest broader adoption — optional conversation'),
      jsonb_build_object('key', 'business_packs', 'label', 'Business packs', 'guidance', 'Industry or operational packs from Business Packs A.43 — review before activate', 'route', '/app/business-packs-foundation-engine'),
      jsonb_build_object('key', 'executive_intelligence', 'label', 'Executive intelligence', 'guidance', 'Executive insights and strategic summaries when leadership engagement is growing'),
      jsonb_build_object('key', 'support_intelligence', 'label', 'Support intelligence', 'guidance', 'Support operations modules when case metadata shows scaling need'),
      jsonb_build_object('key', 'commerce_intelligence', 'label', 'Commerce intelligence', 'guidance', 'Commerce modules when product operations expand — distinct from subscription revenue'),
      jsonb_build_object('key', 'strategic_intelligence', 'label', 'Strategic intelligence', 'guidance', 'Strategic alignment and decision support when organizational maturity increases')
    ),
    'tone', 'consultative_not_aggressive'
  );
$$;

create or replace function public._crebp_blueprint_renewal_playbooks()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Renewal playbooks from Sales Coach Phase 45 — structure not scripts. Preparation, not pressure.',
    'coach_tab_cross_link', 'Phase 45 Coach tab — daily coaching complements renewal playbooks',
    'milestones', jsonb_build_array(
      jsonb_build_object('key', 'thirty_days', 'days_before', 30, 'label', '30 days before renewal', 'guidance', 'Review customer health metadata, schedule success review, confirm onboarding outcomes, identify expansion consultatively'),
      jsonb_build_object('key', 'fourteen_days', 'days_before', 14, 'label', '14 days before renewal', 'guidance', 'Share value summary from metadata, address open follow-ups, prepare renewal conversation talking points — honest scope'),
      jsonb_build_object('key', 'renewal_week', 'days_before', 7, 'label', 'Renewal week', 'guidance', 'Relationship-focused check-in, celebrate progress, confirm next-year success criteria, respect customer timeline')
    )
  );
$$;

create or replace function public._crebp_blueprint_celebration_experiences()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Celebrate customer progress and partnership milestones — voluntary, warm, never performative.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'example', 'A customer completed a meaningful onboarding milestone — acknowledge their team effort.'),
      jsonb_build_object('emoji', '🔔', 'example', 'First renewal completed — a gentle bell moment for the Sales Expert relationship.'),
      jsonb_build_object('emoji', '❤️', 'example', 'Long-term partnership anniversary — gratitude for sustained trust.')
    ),
    'performance_phase41_cross_link', 'Phase 41 Performance tab — Bell Moments and Recognition Roses for Sales Expert achievements; Phase 44 focuses on customer celebration guidance',
    'gratitude_route', '/app/gratitude-recognition-engine'
  );
$$;

create or replace function public._crebp_blueprint_churn_prevention()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Churn prevention is support — early signals, honest conversations, and helpful next steps. Never blame the customer or Sales Expert.',
    'signals', jsonb_build_array(
      jsonb_build_object('key', 'at_risk_status', 'label', 'At-risk customer status', 'guidance', 'Review onboarding progress and follow-up cadence — offer help'),
      jsonb_build_object('key', 'low_engagement', 'label', 'Low engagement metadata', 'guidance', 'Suggest training or success review — consultative'),
      jsonb_build_object('key', 'support_spike', 'label', 'Support volume trend', 'guidance', 'Connect with Customer Success patterns — metadata only'),
      jsonb_build_object('key', 'missed_follow_ups', 'label', 'Missed follow-ups', 'guidance', 'Gentle re-engagement — Self Love pacing respected')
    ),
    'companion_examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'example', 'Engagement metadata suggests a check-in may help — here is what changed, without judgment.'),
      jsonb_build_object('emoji', '🌹', 'example', 'A relationship needs care, not pressure — prevention focuses on understanding challenges.')
    ),
    'customer_success_route', '/app/customer-success-engine',
    'tone', 'prevention_not_blame'
  );
$$;

create or replace function public._crebp_blueprint_sales_expert_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sales Expert insights combine renewal summary, commission forecast metadata, and customer journey visibility — consultative preparation.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'renewal_forecasts', 'label', 'Renewal forecasts', 'description', 'Upcoming renewal counts and readiness from customer metadata'),
      jsonb_build_object('key', 'expansion_recommendations', 'label', 'Expansion recommendations', 'description', 'Consultative module and pack suggestions when adoption signals support them'),
      jsonb_build_object('key', 'journey_visibility', 'label', 'Customer journey visibility', 'description', 'Onboarding progress, subscription status, follow-up cadence — no raw communications'),
      jsonb_build_object('key', 'engagement_summaries', 'label', 'Engagement summaries', 'description', 'Aggregate health and activity metadata across managed customers')
    ),
    'revenue_intelligence_route', '/app/commercial',
    'revenue_intelligence_note', 'Phase 39 MRR/ARR operational layer — cross-link, do not duplicate'
  );
$$;

create or replace function public._crebp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Renewal season can be emotionally demanding — sustainable pacing and clarity over anxiety.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '❤️', 'example', 'Not every renewal conversation needs to happen today — intentional preparation reduces pressure.'),
      jsonb_build_object('emoji', '❤️', 'example', 'A thoughtful no is still professional — Self Love respects boundaries after setbacks.')
    ),
    'route', '/app/self-love-engine',
    'boundary', 'Self Love A.76 influences renewal tone — metadata and encouragement only.'
  );
$$;

create or replace function public._crebp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Transparent renewal metrics, honest expansion scaffolds, and clear commercial cross-links.',
    'experts_should_understand', jsonb_build_array(
      'Renewal summary derives from organization_sales_expert_customers and optional commercial_* metadata',
      'Health insights are aggregate scores — no raw email, chat, orders, or financial PII',
      'Expansion recommendations are consultative scaffolds — Sales Experts decide every conversation',
      'Phase 39 Revenue Intelligence at /app/commercial covers MRR/ARR — Phase 44 covers partner customer relationships',
      'Churn prevention focuses on support — never blame or hidden manipulation'
    ),
    'metadata_only', true,
    'insights_generated_from', jsonb_build_array(
      'organization_sales_expert_customers',
      'commercial_renewal_events',
      'commercial_customer_health_scores',
      '_crebp_renewal_summary'
    )
  );
$$;

create or replace function public._crebp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'aipify_group', jsonb_build_object(
      'role', 'Aipify Group Sales Experts use Renewal & Expansion tab internally first — validate playbook tone and health signal clarity',
      'focus', jsonb_build_array('Renewal playbook usefulness', 'Celebration tone', 'Churn prevention language', 'Commercial cross-link honesty')
    ),
    'future_pilot', jsonb_build_object(
      'role', 'Pilot Sales Experts validate renewal awareness before broader partner rollout',
      'note', 'Dogfooding ensures renewal guidance never feels aggressive or blame-oriented'
    )
  );
$$;

create or replace function public._crebp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Long-term partnerships grow through honest preparation — renewals should feel intentional, not accidental.',
    'Customer health is metadata for care — never surveillance or blame.',
    'Expansion when it genuinely helps — consultative conversations, sustainable growth.',
    'Celebrate progress 🌹🔔 — relationships matter as much as subscriptions.'
  );
$$;

create or replace function public._crebp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'revenue_intelligence', 'label', 'Revenue Intelligence Phase 39', 'route', '/app/commercial', 'note', 'MRR/ARR, renewals operational layer — cross-link only'),
    jsonb_build_object('key', 'customer_success', 'label', 'Customer Success A.26', 'route', '/app/customer-success-engine', 'note', 'Relationship health and proactive follow-up'),
    jsonb_build_object('key', 'partner_success', 'label', 'Partner Success A.73', 'route', '/app/partner-success-engine', 'note', 'Partner program renewal and expansion alignment'),
    jsonb_build_object('key', 'performance_recognition', 'label', 'Performance & Recognition Phase 41', 'route', '/app/sales-expert-engine', 'note', 'Milestones and bell moments — reference Performance tab'),
    jsonb_build_object('key', 'coach_enablement', 'label', 'Coach & Enablement Phase 45', 'route', '/app/sales-expert-engine', 'note', 'Renewal playbooks complement Coach tab'),
    jsonb_build_object('key', 'business_packs', 'label', 'Business Packs A.43', 'route', '/app/business-packs-foundation-engine', 'note', 'Expansion pack recommendations'),
    jsonb_build_object('key', 'gratitude_recognition', 'label', 'Gratitude & Recognition A.89', 'route', '/app/gratitude-recognition-engine', 'note', 'Celebration experiences — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Clarity not anxiety during renewal season')
  );
$$;

create or replace function public._crebp_renewal_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_upcoming int := 0;
  v_recently_renewed int := 0;
  v_anniversaries int := 0;
  v_at_risk int := 0;
  v_active int := 0;
  v_avg_onboarding numeric := 0;
  v_commercial_renewals int := 0;
  v_health_score numeric := null;
  v_engagement_score numeric := null;
  v_adoption_score numeric := null;
  v_renewal_likelihood numeric := null;
  v_expansion_opportunity numeric := null;
  v_upcoming_items jsonb := '[]'::jsonb;
  v_recent_items jsonb := '[]'::jsonb;
begin
  select
    count(*) filter (
      where status in ('active', 'onboarding', 'at_risk')
        and (next_follow_up <= now() + interval '30 days' or status = 'at_risk')
    ),
    count(*) filter (where subscription_status = 'active' and updated_at > created_at + interval '30 days'),
    count(*) filter (
      where created_at <= now() - interval '335 days'
        or (created_at >= now() - interval '30 days' and status = 'active')
    ),
    count(*) filter (where status = 'at_risk'),
    count(*) filter (where status = 'active'),
    coalesce(avg(onboarding_progress) filter (where status in ('active', 'onboarding')), 0)
  into v_upcoming, v_recently_renewed, v_anniversaries, v_at_risk, v_active, v_avg_onboarding
  from public.organization_sales_expert_customers
  where organization_id = p_organization_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'customer_id', c.id,
    'org_name', left(c.org_name, 80),
    'status', c.status,
    'subscription_status', c.subscription_status,
    'next_follow_up', c.next_follow_up,
    'readiness_pct', c.onboarding_progress,
    'days_until_follow_up', case
      when c.next_follow_up is not null then greatest(0, extract(day from c.next_follow_up - now())::int)
      else null
    end
  ) order by c.next_follow_up nulls last), '[]'::jsonb)
  into v_upcoming_items
  from public.organization_sales_expert_customers c
  where c.organization_id = p_organization_id
    and c.status in ('active', 'onboarding', 'at_risk')
    and (c.next_follow_up <= now() + interval '30 days' or c.status = 'at_risk')
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'customer_id', c.id,
    'org_name', left(c.org_name, 80),
    'subscription_status', c.subscription_status,
    'renewed_at_metadata', c.updated_at
  ) order by c.updated_at desc), '[]'::jsonb)
  into v_recent_items
  from public.organization_sales_expert_customers c
  where c.organization_id = p_organization_id
    and c.subscription_status = 'active'
    and c.updated_at > c.created_at + interval '30 days'
  limit 10;

  begin
    select count(*) into v_commercial_renewals
    from public.commercial_renewal_events
    where tenant_id = p_organization_id and status = 'scheduled';

    select h.health_score, h.engagement_score, h.adoption_score, h.renewal_likelihood, h.expansion_opportunity
    into v_health_score, v_engagement_score, v_adoption_score, v_renewal_likelihood, v_expansion_opportunity
    from public.commercial_customer_health_scores h
    where h.tenant_id = p_organization_id
    order by h.calculated_at desc
    limit 1;
  exception when others then
    v_commercial_renewals := 0;
  end;

  return jsonb_build_object(
    'status', 'live_metadata',
    'upcoming_renewals_count', v_upcoming + coalesce(v_commercial_renewals, 0),
    'recently_renewed_count', v_recently_renewed,
    'anniversaries_count', v_anniversaries,
    'at_risk_count', v_at_risk,
    'active_customers', v_active,
    'average_readiness_pct', round(v_avg_onboarding, 1),
    'upcoming_renewals', v_upcoming_items,
    'recently_renewed', v_recent_items,
    'commercial_renewal_events_scheduled', coalesce(v_commercial_renewals, 0),
    'aggregate_health_score', v_health_score,
    'aggregate_engagement_score', v_engagement_score,
    'aggregate_adoption_score', v_adoption_score,
    'aggregate_renewal_likelihood', v_renewal_likelihood,
    'aggregate_expansion_opportunity', v_expansion_opportunity,
    'readiness_indicators', jsonb_build_array(
      jsonb_build_object('key', 'onboarding_ready', 'label', 'Onboarding ≥80%', 'met', v_avg_onboarding >= 80),
      jsonb_build_object('key', 'active_base', 'label', 'Active customer relationships', 'count', v_active),
      jsonb_build_object('key', 'follow_up_window', 'label', 'Follow-ups within 30 days', 'count', v_upcoming)
    ),
    'retention_signal', case
      when coalesce(v_renewal_likelihood, 70) >= 70 then 'healthy'
      when coalesce(v_renewal_likelihood, 50) >= 50 then 'watch'
      else 'prepare'
    end,
    'commercial_route', '/app/commercial',
    'privacy_note', 'Customer org names and aggregate scores only — no email, chat, orders, or financial PII.'
  );
exception when others then
  return jsonb_build_object(
    'status', 'metadata_scaffold',
    'upcoming_renewals_count', 0,
    'recently_renewed_count', 0,
    'anniversaries_count', 0,
    'privacy_note', 'Renewal summary derives from sales expert customer metadata when available.'
  );
end; $$;

create or replace function public._crebp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
begin
  v_summary := public._crebp_renewal_summary(p_organization_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'renewal_dashboard',
      'label', 'Renewal dashboard fields documented',
      'met', jsonb_array_length(public._crebp_blueprint_renewal_dashboard_fields()) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'health_insights',
      'label', 'Customer health insight signals scaffolded',
      'met', jsonb_array_length(public._crebp_blueprint_health_insights()->'signals') >= 5,
      'note', 'Aggregate metadata only'
    ),
    jsonb_build_object(
      'key', 'success_review',
      'label', 'Success review question categories defined',
      'met', jsonb_array_length(public._crebp_blueprint_success_review_questions()->'categories') = 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'expansion_consultative',
      'label', 'Expansion opportunities — consultative tone',
      'met', (public._crebp_blueprint_expansion_opportunities()->>'tone') = 'consultative_not_aggressive',
      'note', null
    ),
    jsonb_build_object(
      'key', 'renewal_playbooks',
      'label', 'Renewal playbooks — 30/14/7 day guidance',
      'met', jsonb_array_length(public._crebp_blueprint_renewal_playbooks()->'milestones') = 3,
      'note', 'Cross-links Phase 45 Coach tab'
    ),
    jsonb_build_object(
      'key', 'celebration_experiences',
      'label', 'Customer celebration experiences scaffolded',
      'met', jsonb_array_length(public._crebp_blueprint_celebration_experiences()->'examples') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'churn_prevention',
      'label', 'Churn prevention — support not blame',
      'met', (public._crebp_blueprint_churn_prevention()->>'tone') = 'prevention_not_blame',
      'note', null
    ),
    jsonb_build_object(
      'key', 'aef_distinction',
      'label', 'AEF Phase 44 collision documented',
      'met', public._crebp_distinction_note() like '%Autonomous Execution Framework Phase 44%',
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection for renewal season pacing',
      'met', (public._crebp_blueprint_self_love_connection()->>'route') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'renewal_summary_live',
      'label', 'Renewal summary derives from customer metadata',
      'met', (v_summary->>'status') in ('live_metadata', 'metadata_scaffold'),
      'note', case when coalesce((v_summary->>'active_customers')::int, 0) = 0
        then 'Add customers to populate renewal dashboard.'
        else null end
    )
  );
end; $$;

-- Extend dashboard — preserve ALL prior fields; append Phase 44 + restore marketing ordering
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
      ), '[]'::jsonb),
      'bookings', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', b.id, 'booking_type', b.booking_type, 'scheduled_at', b.scheduled_at,
          'duration_minutes', b.duration_minutes, 'status', b.status,
          'timezone', b.timezone, 'customer_id', b.customer_id
        ) order by b.scheduled_at)
        from public.organization_sales_expert_bookings b
        where b.organization_id = v_org_id
          and b.status in ('scheduled', 'confirmed')
          and b.scheduled_at >= now() - interval '1 day'
        limit 30
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
begin
  v_org_id := public._mta_require_organization();
  perform public._sebbp_ensure_booking_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  perform public._seosmc_ensure_settings(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);
  v_perf := public._sprbp_performance_summary(v_org_id);
  v_coach := public._scebp_coach_summary(v_org_id);
  v_cert := public._sccfebp_certification_summary(v_org_id);
  v_marketing := public._seosmc_performance_tracking(v_org_id);
  v_demo_env := public._sdebp_blueprint_demo_environments();
  v_demo_links := public._sdebp_demo_links_summary(v_org_id);
  v_renewal := public._crebp_renewal_summary(v_org_id);
  v_engagement := public._sebbp_engagement_summary(v_org_id);

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
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;


grant execute on function public._crebp_distinction_note() to authenticated;
grant execute on function public._crebp_blueprint_objectives() to authenticated;
grant execute on function public._crebp_blueprint_renewal_dashboard_fields() to authenticated;
grant execute on function public._crebp_blueprint_companion_examples() to authenticated;
grant execute on function public._crebp_blueprint_health_insights() to authenticated;
grant execute on function public._crebp_blueprint_success_review_questions() to authenticated;
grant execute on function public._crebp_blueprint_expansion_opportunities() to authenticated;
grant execute on function public._crebp_blueprint_renewal_playbooks() to authenticated;
grant execute on function public._crebp_blueprint_celebration_experiences() to authenticated;
grant execute on function public._crebp_blueprint_churn_prevention() to authenticated;
grant execute on function public._crebp_blueprint_sales_expert_insights() to authenticated;
grant execute on function public._crebp_blueprint_self_love_connection() to authenticated;
grant execute on function public._crebp_blueprint_trust_connection() to authenticated;
grant execute on function public._crebp_blueprint_dogfooding() to authenticated;
grant execute on function public._crebp_blueprint_vision_phrases() to authenticated;
grant execute on function public._crebp_blueprint_integration_links() to authenticated;
grant execute on function public._crebp_renewal_summary(uuid) to authenticated;
grant execute on function public._crebp_blueprint_success_criteria(uuid) to authenticated;
