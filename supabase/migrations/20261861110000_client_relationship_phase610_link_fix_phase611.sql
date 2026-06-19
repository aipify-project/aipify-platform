-- Phase 611 fix — correct Phase 610 apt610 integration links

create or replace function public._crm611_phase_link(p_phase text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_result jsonb;
begin
  case p_phase
    when '587' then
      begin
        v_result := public.get_organization_customer_success_operations_center('overview');
      exception when others then
        v_result := jsonb_build_object('linked', false, 'phase', '587', 'route', '/app/customer-success');
      end;
    when '588' then
      begin
        v_result := public.get_organization_commercial_intelligence_center('overview');
      exception when others then
        v_result := jsonb_build_object('linked', false, 'phase', '588', 'route', '/app/revenue');
      end;
    when '606' then
      begin
        v_result := public.get_organization_absence_center('overview');
      exception when others then
        v_result := jsonb_build_object('linked', false, 'phase', '606', 'route', '/app/absence');
      end;
    when '610' then
      v_result := jsonb_build_object(
        'linked', to_regclass('public.organization_apt610_waiting_list') is not null,
        'phase', '610', 'route', '/app/appointments',
        'note', 'Waiting list, memberships, and packages reuse Phase 610 — not duplicated in Phase 611.'
      );
    when '591' then
      begin
        v_result := public.get_organization_event_center('overview');
      exception when others then
        v_result := jsonb_build_object('linked', false, 'phase', '591', 'route', '/app/events');
      end;
    else
      v_result := jsonb_build_object('linked', false, 'phase', p_phase);
  end case;
  return coalesce(v_result, '{}'::jsonb) || jsonb_build_object('reuse_not_duplicate', true);
end; $$;

-- SEED and RPCs continue in part 2...

create or replace function public._crm611_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._crm611_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_crm611_clients where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_crm611_terminology (organization_id, label_key, label_value, label_context, summary) values
    (p_org_id, 'entity_singular', 'Client', 'ui', 'Primary entity label — unified customer record.'),
    (p_org_id, 'entity_plural', 'Clients', 'ui', 'Plural entity label.'),
    (p_org_id, 'guest_alias', 'Guest', 'portal', 'Hospitality alias — same unified entity.'),
    (p_org_id, 'member_alias', 'Member', 'portal', 'Membership alias — same unified entity.');

  insert into public.organization_crm611_clients (
    organization_id, client_key, client_label, lifecycle_status, health_score, health_status,
    clv_estimate, visit_count, next_best_action, marketing_consent, summary
  ) values
    (p_org_id, 'cli_001', 'Anna Nordmann', 'active', 82, 'healthy', 12400, 14,
     'Suggest rebooking for preferred service — customer confirmation required.', true,
     'Loyal client — regular visits, positive feedback history.'),
    (p_org_id, 'cli_002', 'Bergen Wellness AS', 'active', 71, 'attention_required', 45000, 8,
     'Review membership renewal — Phase 610 membership lifecycle.', false,
     'Business client — package holder, manager dashboard visibility.'),
    (p_org_id, 'cli_003', 'Erik Hansen', 'lapsed', 48, 'at_risk', 3200, 3,
     'Respectful reactivation outreach — consent required for marketing.', false,
     'Lapsed 90+ days — reactivation candidate, no pressure.');

  insert into public.organization_crm611_duplicate_candidates (
    organization_id, candidate_key, primary_client_key, duplicate_client_key, match_score, summary
  ) values
    (p_org_id, 'dup_1', 'cli_001', 'cli_legacy_anna', 92,
     'Potential duplicate — review before merge. Human approval required.');

  insert into public.organization_crm611_segments (
    organization_id, segment_key, segment_title, segment_type, member_count, rule_summary, summary
  ) values
    (p_org_id, 'seg_loyal', 'Loyal clients', 'dynamic', 24, 'visit_count >= 10 AND health_score >= 75', 'High-engagement clients.'),
    (p_org_id, 'seg_lapsed', 'Lapsed clients', 'dynamic', 6, 'lifecycle_status = lapsed', 'Reactivation candidates — respectful outreach only.'),
    (p_org_id, 'seg_vip', 'VIP manual segment', 'manual', 3, 'Manually curated VIP list', 'Manual segment — no prohibited attributes.');

  insert into public.organization_crm611_rebooking_rules (
    organization_id, rule_key, rule_title, service_label, interval_days, requires_confirmation, summary
  ) values
    (p_org_id, 'rule_haircut', 'Haircut rebooking', 'Haircut', 42, true, 'Suggest rebooking 6 weeks after visit — confirmation required.'),
    (p_org_id, 'rule_treatment', 'Treatment rebooking', 'Treatment', 28, true, 'Monthly treatment interval — Companion may suggest, never auto-book.');

  insert into public.organization_crm611_rebooking_queue (
    organization_id, queue_key, client_key, service_label, queue_status, companion_suggested, summary
  ) values
    (p_org_id, 'rb_1', 'cli_001', 'Haircut', 'pending', true, 'Due for rebooking — reminder scheduled respectfully.'),
    (p_org_id, 'rb_2', 'cli_003', 'Treatment', 'lapsed', false, 'Lapsed rebooking — reactivation path recommended.');

  insert into public.organization_crm611_recurring_agreements (
    organization_id, agreement_key, client_key, service_label, cadence_label, customer_approved, summary
  ) values
    (p_org_id, 'rec_1', 'cli_002', 'Monthly wellness package', 'monthly', true,
     'Customer-approved recurring agreement — slots generated without per-visit confirmation.');

  insert into public.organization_crm611_retention_cases (
    organization_id, case_key, case_title, case_type, client_key, companion_recommendation, summary
  ) values
    (p_org_id, 'ret_1', 'Abandoned booking — Erik', 'abandoned_booking', 'cli_003',
     'Send one respectful recovery message — service consent only.', 'Booking started but not completed.'),
    (p_org_id, 'ret_2', 'No-show follow-up', 'no_show', 'cli_001',
     'Acknowledge no-show gently — offer rebooking link.', 'Single no-show — no guilt language.');

  insert into public.organization_crm611_journey_stages (
    organization_id, stage_key, stage_title, stage_status, sort_order, summary
  ) values
    (p_org_id, 'discover', 'Discover', 'completed', 1, 'Client discovered your services.'),
    (p_org_id, 'first_visit', 'First visit', 'completed', 2, 'First completed service.'),
    (p_org_id, 'repeat', 'Repeat client', 'in_progress', 3, 'Building repeat relationship.'),
    (p_org_id, 'loyal', 'Loyal client', 'pending', 4, 'Loyalty tier eligible.'),
    (p_org_id, 'advocate', 'Advocate', 'pending', 5, 'Referral program candidate.');

  insert into public.organization_crm611_journey_events (
    organization_id, event_key, client_key, event_title, event_type, summary
  ) values
    (p_org_id, 'jev_1', 'cli_001', '10th visit milestone', 'milestone', 'Celebrate milestone — no pressure.'),
    (p_org_id, 'jev_2', 'cli_002', 'Membership started', 'membership', 'Linked to Phase 610 membership lifecycle.');

  insert into public.organization_crm611_loyalty_accounts (
    organization_id, account_key, client_key, tier_key, points_balance, lifetime_spend, visit_count, summary
  ) values
    (p_org_id, 'loy_1', 'cli_001', 'gold', 420, 8400, 14, 'Gold tier — eligible for redemption.'),
    (p_org_id, 'loy_2', 'cli_002', 'silver', 180, 12000, 8, 'Silver tier business account.');

  insert into public.organization_crm611_loyalty_redemptions (
    organization_id, redemption_key, account_key, reward_label, points_used, summary
  ) values
    (p_org_id, 'red_1', 'loy_1', 'Complimentary treatment add-on', 100, 'Redeemed with audit trail.');

  insert into public.organization_crm611_referrals (
    organization_id, referral_key, referrer_client_key, referred_label, qualification_status,
    growth_partner_attribution, reward_label, summary
  ) values
    (p_org_id, 'ref_1', 'cli_001', 'New client — referred by Anna', 'qualified', 'Growth Partner: unassigned',
     'Referral reward — 200 loyalty points', 'Growth Partner attribution preserved — not Affiliate language.');

  insert into public.organization_crm611_campaigns (
    organization_id, campaign_key, campaign_title, campaign_status, eligibility_summary, frequency_cap_days, summary
  ) values
    (p_org_id, 'camp_1', 'Spring rebooking reminder', 'scheduled', 'Lapsed and due-for-rebooking segments', 14,
     'Frequency capped — marketing consent required.'),
    (p_org_id, 'camp_2', 'Loyalty tier celebration', 'draft', 'Gold tier clients', 30, 'Service consent message — no spam.');

  insert into public.organization_crm611_communications (
    organization_id, message_key, client_key, channel, delivery_status, consent_type, human_review_required, summary
  ) values
    (p_org_id, 'msg_1', 'cli_001', 'email', 'pending_review', 'service', true,
     'Rebooking reminder draft — awaiting human review.'),
    (p_org_id, 'msg_2', 'cli_003', 'sms', 'suppressed', 'marketing', true,
     'Suppressed — marketing consent not granted.');

  insert into public.organization_crm611_feedback (
    organization_id, feedback_key, client_key, feedback_type, sentiment, routing_status, escalated, summary
  ) values
    (p_org_id, 'fb_1', 'cli_001', 'public', 'positive', 'published', false, 'Excellent service — publishable review metadata.'),
    (p_org_id, 'fb_2', 'cli_003', 'complaint', 'negative', 'routed', false, 'Wait time concern — routed to service recovery.'),
    (p_org_id, 'fb_3', 'cli_002', 'safety', 'critical', 'escalated', true, 'Safety concern — immediate escalation.');

  insert into public.organization_crm611_recovery_cases (
    organization_id, recovery_key, feedback_key, recovery_title, recovery_status, owner_label, summary
  ) values
    (p_org_id, 'rcv_1', 'fb_2', 'Wait time recovery', 'in_progress', 'Manager — Support',
     'Personal follow-up prepared — human review before send.');

  insert into public.organization_crm611_automations (
    organization_id, automation_key, automation_title, trigger_type, automation_status, guardrails, summary
  ) values
    (p_org_id, 'auto_1', 'Rebooking reminder flow', 'schedule', 'active',
     '["consent_required","frequency_cap","duplicate_prevention"]'::jsonb,
     'Respectful rebooking reminders — never auto-book without confirmation.'),
    (p_org_id, 'auto_2', 'Negative feedback routing', 'event', 'active',
     '["human_review","safety_escalation"]'::jsonb,
     'Route negative feedback to service recovery within 24 hours.');

  insert into public.organization_crm611_integrations (
    organization_id, integration_key, integration_title, phase_ref, integration_status, route_hint, summary
  ) values
    (p_org_id, 'int_587', 'Customer Success Operations', '587', 'linked', '/app/customer-success', 'Phase 587 — not duplicated.'),
    (p_org_id, 'int_588', 'Revenue Operations', '588', 'linked', '/app/revenue', 'Phase 588 commercial intelligence — not duplicated.'),
    (p_org_id, 'int_606', 'Vacation Mode continuity', '606', 'linked', '/app/absence', 'Phase 606 vacation relationship continuity.'),
    (p_org_id, 'int_610_wl', 'Waiting list', '610', 'linked', '/app/appointments', 'Phase 610 waiting list reuse — not duplicated.'),
    (p_org_id, 'int_610_mem', 'Memberships', '610', 'linked', '/app/appointments', 'Phase 610 packages_memberships section — not duplicated.'),
    (p_org_id, 'int_610_pkg', 'Packages', '610', 'linked', '/app/appointments', 'Phase 610 packages_memberships section — not duplicated.'),
    (p_org_id, 'int_591', 'Event bus', '591', 'linked', '/app/events', 'Phase 591 organizational event bus.'),
    (p_org_id, 'int_fiken', 'Fiken accounting prep', 'fiken', 'pending', '/app/integrations', 'Fiken integration metadata — prep only.');

  perform public._crm611_log(p_org_id, 'center_seeded', 'Client Relationship Center baseline seeded.');
end; $$;

create or replace function public.get_organization_client_relationship_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := public._crm611_normalize_section(p_section);
  v_settings public.organization_crm611_settings;
  v_health_score integer;
  v_health_status text;
begin
  v_org_id := public._crm611_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._crm611_seed(v_org_id);
  select * into v_settings from public.organization_crm611_settings where organization_id = v_org_id;

  select coalesce(round(avg(health_score)), 75), public._crm611_health_status(coalesce(round(avg(health_score)), 75)::integer)
  into v_health_score, v_health_status
  from public.organization_crm611_clients where organization_id = v_org_id;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Relationships grow through respect, consent, and timely care — never manipulation.',
      'privacy_note', 'Client relationship metadata only — no raw communications or payment records.',
      'entity_label', coalesce(v_settings.entity_label, 'Client'),
      'health_score', v_health_score,
      'health_status', v_health_status,
      'health_status_label', public._crm611_health_label(v_health_status),
      'section_count', (select count(*) from public.crm611_section_defs),
      'stats', jsonb_build_object(
        'active_clients', (select count(*) from public.organization_crm611_clients where organization_id = v_org_id and lifecycle_status = 'active'),
        'lapsed_clients', (select count(*) from public.organization_crm611_clients where organization_id = v_org_id and lifecycle_status = 'lapsed'),
        'pending_rebooking', (select count(*) from public.organization_crm611_rebooking_queue where organization_id = v_org_id and queue_status = 'pending'),
        'open_retention', (select count(*) from public.organization_crm611_retention_cases where organization_id = v_org_id and case_status = 'open'),
        'loyalty_accounts', (select count(*) from public.organization_crm611_loyalty_accounts where organization_id = v_org_id),
        'open_recovery', (select count(*) from public.organization_crm611_recovery_cases where organization_id = v_org_id and recovery_status in ('open', 'in_progress')),
        'pending_review', (select count(*) from public.organization_crm611_communications where organization_id = v_org_id and delivery_status = 'pending_review')
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'client_label', c.client_label, 'recommendation', c.next_best_action, 'health_status', c.health_status
        )) from public.organization_crm611_clients c
        where c.organization_id = v_org_id and c.health_status != 'healthy' limit 5
      ), '[]'::jsonb),
      'integrations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'integration_key', i.integration_key, 'integration_title', i.integration_title,
          'phase_ref', i.phase_ref, 'integration_status', i.integration_status, 'route_hint', i.route_hint, 'summary', i.summary
        ) order by i.integration_title) from public.organization_crm611_integrations i where i.organization_id = v_org_id
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Relationships grow through respect, consent, and timely care — never manipulation.',
    'privacy_note', 'Client relationship metadata only — no raw communications or payment records.',
    'entity_label', coalesce(v_settings.entity_label, 'Client'),
    'health_score', v_health_score,
    'health_status', v_health_status,
    'health_status_label', public._crm611_health_label(v_health_status),
    'section_registry', coalesce((
      select jsonb_agg(jsonb_build_object(
        'section_key', s.section_key, 'section_title', s.section_title,
        'section_group', s.section_group, 'summary', s.summary
      ) order by s.sort_order) from public.crm611_section_defs s
      where v_section = 'reports' or s.section_group = v_section or s.section_key like v_section || '%'
    ), '[]'::jsonb),
    'terminology', coalesce((
      select jsonb_agg(jsonb_build_object(
        'label_key', t.label_key, 'label_value', t.label_value, 'label_context', t.label_context, 'summary', t.summary
      ) order by t.label_key) from public.organization_crm611_terminology t where t.organization_id = v_org_id
    ), '[]'::jsonb),
    'clients', coalesce((
      select jsonb_agg(jsonb_build_object(
        'client_key', c.client_key, 'client_label', c.client_label, 'lifecycle_status', c.lifecycle_status,
        'health_score', c.health_score, 'health_status', c.health_status,
        'health_status_label', public._crm611_health_label(c.health_status),
        'clv_estimate', c.clv_estimate, 'visit_count', c.visit_count, 'last_visit_at', c.last_visit_at,
        'next_best_action', c.next_best_action, 'marketing_consent', c.marketing_consent,
        'service_consent', c.service_consent, 'sensitive_service', c.sensitive_service, 'summary', c.summary
      ) order by c.client_label) from public.organization_crm611_clients c where c.organization_id = v_org_id
      and v_section in ('overview', 'clients')
    ), '[]'::jsonb),
    'duplicate_candidates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'candidate_key', d.candidate_key, 'primary_client_key', d.primary_client_key,
        'duplicate_client_key', d.duplicate_client_key, 'match_score', d.match_score,
        'review_status', d.review_status, 'summary', d.summary
      )) from public.organization_crm611_duplicate_candidates d where d.organization_id = v_org_id
      and v_section in ('overview', 'clients')
    ), '[]'::jsonb),
    'segments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'segment_key', s.segment_key, 'segment_title', s.segment_title, 'segment_type', s.segment_type,
        'member_count', s.member_count, 'rule_summary', s.rule_summary, 'summary', s.summary
      ) order by s.segment_title) from public.organization_crm611_segments s where s.organization_id = v_org_id
      and v_section in ('overview', 'clients')
    ), '[]'::jsonb),
    'rebooking_rules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'rule_key', r.rule_key, 'rule_title', r.rule_title, 'service_label', r.service_label,
        'interval_days', r.interval_days, 'requires_confirmation', r.requires_confirmation, 'summary', r.summary
      ) order by r.rule_title) from public.organization_crm611_rebooking_rules r where r.organization_id = v_org_id
      and v_section in ('overview', 'rebooking')
    ), '[]'::jsonb),
    'rebooking_queue', coalesce((
      select jsonb_agg(jsonb_build_object(
        'queue_key', q.queue_key, 'client_key', q.client_key, 'service_label', q.service_label,
        'due_at', q.due_at, 'queue_status', q.queue_status, 'companion_suggested', q.companion_suggested,
        'confirmation_required', q.confirmation_required, 'summary', q.summary
      ) order by q.due_at nulls last) from public.organization_crm611_rebooking_queue q where q.organization_id = v_org_id
      and v_section in ('overview', 'rebooking')
    ), '[]'::jsonb),
    'recurring_agreements', coalesce((
      select jsonb_agg(jsonb_build_object(
        'agreement_key', a.agreement_key, 'client_key', a.client_key, 'service_label', a.service_label,
        'cadence_label', a.cadence_label, 'agreement_status', a.agreement_status,
        'customer_approved', a.customer_approved, 'summary', a.summary
      )) from public.organization_crm611_recurring_agreements a where a.organization_id = v_org_id
      and v_section in ('overview', 'rebooking')
    ), '[]'::jsonb),
    'waiting_list', case when v_section in ('overview', 'rebooking') then
      jsonb_build_object(
        'reuse_phase', '610',
        'linked', to_regclass('public.organization_apt610_waiting_list') is not null,
        'note', 'Waiting list data from Phase 610 Appointment Booking — not duplicated in Phase 611.',
        'route', '/app/appointments'
      ) else '[]'::jsonb end,
    'retention_cases', coalesce((
      select jsonb_agg(jsonb_build_object(
        'case_key', r.case_key, 'case_title', r.case_title, 'case_type', r.case_type,
        'client_key', r.client_key, 'case_status', r.case_status,
        'companion_recommendation', r.companion_recommendation, 'summary', r.summary
      ) order by r.case_title) from public.organization_crm611_retention_cases r where r.organization_id = v_org_id
      and v_section in ('overview', 'retention')
    ), '[]'::jsonb),
    'journey_stages', coalesce((
      select jsonb_agg(jsonb_build_object(
        'stage_key', j.stage_key, 'stage_title', j.stage_title, 'stage_status', j.stage_status,
        'sort_order', j.sort_order, 'summary', j.summary
      ) order by j.sort_order) from public.organization_crm611_journey_stages j where j.organization_id = v_org_id
      and v_section in ('overview', 'journeys')
    ), '[]'::jsonb),
    'journey_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_key', e.event_key, 'client_key', e.client_key, 'event_title', e.event_title,
        'event_type', e.event_type, 'occurred_at', e.occurred_at, 'summary', e.summary
      ) order by e.occurred_at desc) from public.organization_crm611_journey_events e where e.organization_id = v_org_id
      and v_section in ('overview', 'journeys')
    ), '[]'::jsonb),
    'loyalty_accounts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'account_key', l.account_key, 'client_key', l.client_key, 'tier_key', l.tier_key,
        'points_balance', l.points_balance, 'lifetime_spend', l.lifetime_spend,
        'visit_count', l.visit_count, 'summary', l.summary
      ) order by l.points_balance desc) from public.organization_crm611_loyalty_accounts l where l.organization_id = v_org_id
      and v_section in ('overview', 'loyalty')
    ), '[]'::jsonb),
    'loyalty_redemptions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'redemption_key', r.redemption_key, 'account_key', r.account_key,
        'reward_label', r.reward_label, 'points_used', r.points_used, 'summary', r.summary
      )) from public.organization_crm611_loyalty_redemptions r where r.organization_id = v_org_id
      and v_section in ('overview', 'loyalty')
    ), '[]'::jsonb),
    'memberships', case when v_section in ('overview', 'memberships') then
      jsonb_build_object(
        'reuse_phase', '610', 'linked', to_regclass('public.organization_apt610_section_items') is not null,
        'note', 'Membership lifecycle from Phase 610 packages_memberships — not duplicated.', 'route', '/app/appointments'
      ) else '[]'::jsonb end,
    'packages', case when v_section in ('overview', 'packages') then
      jsonb_build_object(
        'reuse_phase', '610', 'linked', to_regclass('public.organization_apt610_section_items') is not null,
        'note', 'Service packages from Phase 610 packages_memberships — not duplicated.', 'route', '/app/appointments'
      ) else '[]'::jsonb end,
    'referrals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'referral_key', r.referral_key, 'referrer_client_key', r.referrer_client_key,
        'referred_label', r.referred_label, 'qualification_status', r.qualification_status,
        'growth_partner_attribution', r.growth_partner_attribution, 'reward_label', r.reward_label, 'summary', r.summary
      )) from public.organization_crm611_referrals r where r.organization_id = v_org_id
      and v_section in ('overview', 'referrals')
    ), '[]'::jsonb),
    'campaigns', coalesce((
      select jsonb_agg(jsonb_build_object(
        'campaign_key', c.campaign_key, 'campaign_title', c.campaign_title,
        'campaign_status', c.campaign_status, 'eligibility_summary', c.eligibility_summary,
        'frequency_cap_days', c.frequency_cap_days, 'consent_required', c.consent_required, 'summary', c.summary
      ) order by c.campaign_title) from public.organization_crm611_campaigns c where c.organization_id = v_org_id
      and v_section in ('overview', 'campaigns')
    ), '[]'::jsonb),
    'communications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'message_key', m.message_key, 'client_key', m.client_key, 'channel', m.channel,
        'delivery_status', m.delivery_status, 'consent_type', m.consent_type,
        'human_review_required', m.human_review_required, 'summary', m.summary
      )) from public.organization_crm611_communications m where m.organization_id = v_org_id
      and v_section in ('overview', 'consent')
    ), '[]'::jsonb),
    'feedback', coalesce((
      select jsonb_agg(jsonb_build_object(
        'feedback_key', f.feedback_key, 'client_key', f.client_key, 'feedback_type', f.feedback_type,
        'sentiment', f.sentiment, 'routing_status', f.routing_status, 'escalated', f.escalated, 'summary', f.summary
      ) order by f.escalated desc, f.sentiment desc) from public.organization_crm611_feedback f where f.organization_id = v_org_id
      and v_section in ('overview', 'feedback')
    ), '[]'::jsonb),
    'recovery_cases', coalesce((
      select jsonb_agg(jsonb_build_object(
        'recovery_key', r.recovery_key, 'feedback_key', r.feedback_key, 'recovery_title', r.recovery_title,
        'recovery_status', r.recovery_status, 'owner_label', r.owner_label, 'summary', r.summary
      )) from public.organization_crm611_recovery_cases r where r.organization_id = v_org_id
      and v_section in ('overview', 'service_recovery', 'feedback')
    ), '[]'::jsonb),
    'automations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'automation_key', a.automation_key, 'automation_title', a.automation_title,
        'trigger_type', a.trigger_type, 'automation_status', a.automation_status,
        'guardrails', a.guardrails, 'duplicate_prevention', a.duplicate_prevention, 'summary', a.summary
      ) order by a.automation_title) from public.organization_crm611_automations a where a.organization_id = v_org_id
      and v_section in ('overview', 'automation')
    ), '[]'::jsonb),
    'integrations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'integration_key', i.integration_key, 'integration_title', i.integration_title,
        'phase_ref', i.phase_ref, 'integration_status', i.integration_status, 'route_hint', i.route_hint, 'summary', i.summary
      ) order by i.integration_title) from public.organization_crm611_integrations i where i.organization_id = v_org_id
    ), '[]'::jsonb),
    'vacation_continuity', case when v_section in ('overview', 'automation') then public._crm611_phase_link('606') else null end,
    'phase_links', jsonb_build_object(
      'phase_587', public._crm611_phase_link('587'),
      'phase_588', public._crm611_phase_link('588'),
      'phase_606', public._crm611_phase_link('606'),
      'phase_610', public._crm611_phase_link('610'),
      'phase_591', public._crm611_phase_link('591')
    ),
    'dashboards', jsonb_build_object(
      'employee', jsonb_build_object('open_tasks', (select count(*) from public.organization_crm611_rebooking_queue where organization_id = v_org_id and queue_status = 'pending')),
      'manager', jsonb_build_object('open_recovery', (select count(*) from public.organization_crm611_recovery_cases where organization_id = v_org_id and recovery_status in ('open', 'in_progress'))),
      'executive', jsonb_build_object('health_score', v_health_score, 'health_status', v_health_status)
    ),
    'reports', jsonb_build_object(
      'client_count', (select count(*) from public.organization_crm611_clients where organization_id = v_org_id),
      'loyalty_total_points', coalesce((select sum(points_balance) from public.organization_crm611_loyalty_accounts where organization_id = v_org_id), 0),
      'referral_qualified', (select count(*) from public.organization_crm611_referrals where organization_id = v_org_id and qualification_status = 'qualified'),
      'sections_implemented', (select count(*) from public.crm611_section_defs)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
      ) order by l.created_at desc) from (
        select * from public.organization_crm611_audit_logs where organization_id = v_org_id order by created_at desc limit 20
      ) l
    ), '[]'::jsonb),
    'settings', jsonb_build_object(
      'marketing_consent_required', coalesce(v_settings.marketing_consent_required, true),
      'human_review_required', coalesce(v_settings.human_review_required, true),
      'duplicate_message_prevention', coalesce(v_settings.duplicate_message_prevention, true),
      'mobile_summary_enabled', coalesce(v_settings.mobile_summary_enabled, true)
    )
  );
end;
$$;

create or replace function public.get_aipify_companion_client_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
begin
  v_center := public.get_organization_client_relationship_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;

  v_stats := v_center->'stats';

  return jsonb_build_object(
    'found', true,
    'advisor_title', 'Companion Client Advisor',
    'advisor_identity', 'Aipify',
    'privacy_note', 'Companion Client Advisor — single Aipify identity. Drafts require human review.',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'rebooking',
        'observation', format('%s client(s) due for rebooking — confirmation always required.',
          coalesce(v_stats->>'pending_rebooking', '0')),
        'explanation', 'Rebooking suggestions respect client preferences and never auto-book without approval.',
        'recommendation', 'Review rebooking queue and approve respectful reminders.',
        'effort', 'low',
        'value', 'Improved retention without pressure.',
        'href', '/app/client-relationships/rebooking'
      ),
      jsonb_build_object(
        'key', 'lapsed',
        'observation', format('%s lapsed client(s) identified.', coalesce(v_stats->>'lapsed_clients', '0')),
        'explanation', 'Lapsed clients may benefit from respectful reactivation — marketing consent required.',
        'recommendation', 'Review retention cases before outreach.',
        'effort', 'medium',
        'value', 'Recover relationships without spam.',
        'href', '/app/client-relationships/retention'
      ),
      jsonb_build_object(
        'key', 'recovery',
        'observation', format('%s open service recovery case(s).', coalesce(v_stats->>'open_recovery', '0')),
        'explanation', 'Negative feedback routed to service recovery — human follow-up required.',
        'recommendation', 'Assign owners and prepare transparent recovery responses.',
        'effort', 'medium',
        'value', 'Trust restored through accountable follow-up.',
        'href', '/app/client-relationships/service-recovery'
      ),
      jsonb_build_object(
        'key', 'loyalty',
        'observation', format('%s loyalty account(s) active.', coalesce(v_stats->>'loyalty_accounts', '0')),
        'explanation', 'Loyalty balances and tiers track visit and spend metadata only.',
        'recommendation', 'Celebrate milestones respectfully — no guilt-based motivation.',
        'effort', 'low',
        'value', 'Strengthen long-term relationships.',
        'href', '/app/client-relationships/loyalty'
      )
    ),
    'human_review_required', true,
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_client_relationship_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
begin
  v_center := public.get_organization_client_relationship_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';

  return jsonb_build_object(
    'found', true,
    'summary_title', 'Client Relationships',
    'health_score', v_center->>'health_score',
    'health_status', v_center->>'health_status',
    'health_status_label', v_center->>'health_status_label',
    'active_clients', v_stats->>'active_clients',
    'pending_rebooking', v_stats->>'pending_rebooking',
    'open_recovery', v_stats->>'open_recovery',
    'route', '/app/client-relationships',
    'center', v_center
  );
end;
$$;

