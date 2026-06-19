-- Phase 611 — Client Relationship, Rebooking, Loyalty & Service Revenue Engine
-- Feature owner: CUSTOMER APP
-- Routes: /app/client-relationships/*
-- Helpers: _crm611_*

-- ---------------------------------------------------------------------------
-- 1. Section registry (106 sections)
-- ---------------------------------------------------------------------------
create table if not exists public.crm611_section_defs (
  section_key text primary key,
  section_title text not null,
  section_group text not null,
  sort_order integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.crm611_section_defs (section_key, section_title, section_group, sort_order, summary) values
  ('terminology_config', 'Terminology configuration', 'config', 1, 'Customer/Client/Guest/Member labels — unified entity'),
  ('terminology_labels', 'Entity labels', 'config', 2, 'Display labels only — no duplicate entities'),
  ('unified_entity', 'Unified customer entity', 'clients', 3, 'Reuse organization_crm_customers — single entity'),
  ('duplicate_review', 'Duplicate review', 'clients', 4, 'Review potential duplicates before merge'),
  ('merge_governance', 'Merge governance', 'clients', 5, 'Human approval required for merges'),
  ('lifecycle_status', 'Lifecycle status', 'clients', 6, 'Active, lapsed, reactivation candidate'),
  ('client_profile', 'Client profile', 'clients', 7, 'Profile metadata — tenant scoped'),
  ('service_history', 'Service history', 'clients', 8, 'Visit and service metadata only'),
  ('client_preferences', 'Client preferences', 'clients', 9, 'Communication and booking preferences'),
  ('sensitive_protection', 'Sensitive protection', 'clients', 10, 'Protected sensitive service flags'),
  ('rebooking_overview', 'Rebooking overview', 'rebooking', 11, 'Rebooking engine summary'),
  ('rebooking_rules', 'Rebooking rules', 'rebooking', 12, 'Interval and service-based rules'),
  ('rebooking_checkout', 'Rebooking checkout', 'rebooking', 13, 'Checkout flow — customer confirmation required'),
  ('companion_rebooking', 'Companion rebooking', 'rebooking', 14, 'Companion Client Advisor rebooking suggestions'),
  ('recurring_agreements', 'Recurring agreements', 'rebooking', 15, 'Approved recurring — no per-booking confirmation'),
  ('future_slot_generation', 'Future slot generation', 'rebooking', 16, 'Generate future booking slots'),
  ('rebooking_reminders', 'Rebooking reminders', 'rebooking', 17, 'Respectful reminder scheduling'),
  ('lapsed_detection', 'Lapsed customer detection', 'retention', 18, 'Detect lapsed clients — no pressure'),
  ('reactivation', 'Reactivation', 'retention', 19, 'Respectful reactivation outreach'),
  ('abandoned_booking', 'Abandoned booking recovery', 'retention', 20, 'Recover abandoned bookings'),
  ('cancellation_recovery', 'Cancellation recovery', 'retention', 21, 'Win-back after cancellation'),
  ('no_show_recovery', 'No-show recovery', 'retention', 22, 'Respectful no-show follow-up'),
  ('recovery_automation', 'Recovery automation', 'retention', 23, 'Governed recovery automations'),
  ('waiting_list_link', 'Waiting list integration', 'rebooking', 24, 'Reuse Phase 610 waiting list — not duplicated'),
  ('waiting_list_status', 'Waiting list status', 'rebooking', 25, 'Waiting list status from Phase 610'),
  ('journey_overview', 'Customer journeys', 'journeys', 26, 'Journey engine overview'),
  ('journey_timeline', 'Journey timeline', 'journeys', 27, 'Client timeline events'),
  ('journey_stages', 'Journey stages', 'journeys', 28, 'Lifecycle journey stages'),
  ('journey_automation', 'Journey automation', 'journeys', 29, 'Automated journey triggers'),
  ('segment_dynamic', 'Dynamic segments', 'clients', 30, 'Dynamic segmentation rules'),
  ('segment_manual', 'Manual segments', 'clients', 31, 'Manual segment membership'),
  ('loyalty_program', 'Loyalty program', 'loyalty', 32, 'Program configuration'),
  ('loyalty_balance', 'Loyalty balance', 'loyalty', 33, 'Points balance per client'),
  ('loyalty_visits', 'Visit tracking', 'loyalty', 34, 'Visit and spend tracking'),
  ('loyalty_tiers', 'Loyalty tiers', 'loyalty', 35, 'Tier progression'),
  ('loyalty_redemption', 'Loyalty redemption', 'loyalty', 36, 'Redemption rules and history'),
  ('membership_link', 'Membership integration', 'memberships', 37, 'Reuse Phase 610 memberships — not duplicated'),
  ('package_link', 'Package integration', 'packages', 38, 'Reuse Phase 610 packages — not duplicated'),
  ('membership_lifecycle', 'Membership lifecycle', 'memberships', 39, 'Lifecycle from Phase 610'),
  ('referral_program', 'Referral program', 'referrals', 40, 'Referral program configuration'),
  ('referral_qualification', 'Referral qualification', 'referrals', 41, 'Qualification rules'),
  ('referral_rewards', 'Referral rewards', 'referrals', 42, 'Reward fulfillment'),
  ('growth_partner_attribution', 'Growth Partner attribution', 'referrals', 43, 'Attribution preserved — not Affiliate'),
  ('campaign_center', 'Campaign center', 'campaigns', 44, 'Customer campaign management'),
  ('campaign_eligibility', 'Campaign eligibility', 'campaigns', 45, 'Eligibility rules'),
  ('campaign_frequency', 'Frequency control', 'campaigns', 46, 'Prevent message fatigue'),
  ('communication_center', 'Communication center', 'consent', 47, 'Outbound communication hub'),
  ('delivery_status', 'Delivery status', 'consent', 48, 'Message delivery tracking'),
  ('marketing_consent', 'Marketing consent', 'consent', 49, 'Separate from service consent'),
  ('suppression_rules', 'Suppression rules', 'consent', 50, 'Do-not-contact governance'),
  ('feedback_engine', 'Feedback engine', 'feedback', 51, 'Collect and route feedback'),
  ('internal_reviews', 'Internal reviews', 'feedback', 52, 'Staff-only review notes'),
  ('public_reviews', 'Public reviews', 'feedback', 53, 'Publishable review metadata'),
  ('negative_routing', 'Negative feedback routing', 'feedback', 54, 'Route negative feedback promptly'),
  ('complaints', 'Complaints', 'feedback', 55, 'Formal complaint tracking'),
  ('safety_escalation', 'Safety escalation', 'feedback', 56, 'Safety issues escalate immediately'),
  ('customer_health_score', 'Customer health score', 'clients', 57, 'Relationship health score'),
  ('clv_estimates', 'CLV estimates', 'clients', 58, 'Lifetime value estimates — illustrative'),
  ('next_best_action', 'Next best action', 'clients', 59, 'Companion recommended next step'),
  ('cross_sell_governance', 'Cross-sell governance', 'clients', 60, 'Governed cross-sell recommendations'),
  ('churn_prediction', 'Churn prediction', 'retention', 61, 'Churn risk metadata'),
  ('product_recommendations', 'Product recommendations', 'clients', 62, 'Service/product suggestions'),
  ('client_milestones', 'Client milestones', 'journeys', 63, 'Celebrate milestones respectfully'),
  ('household_profiles', 'Household profiles', 'clients', 64, 'Linked household members'),
  ('portal_metadata', 'Customer portal metadata', 'clients', 65, 'Portal extension fields'),
  ('data_requests', 'Data requests', 'consent', 66, 'GDPR-style data requests'),
  ('vacation_continuity', 'Vacation relationship continuity', 'automation', 67, 'Reuse Phase 606 — transparent coverage'),
  ('absence_transparent_notice', 'Transparent absence notice', 'automation', 68, 'Never impersonate employee'),
  ('relationship_coverage', 'Relationship coverage', 'automation', 69, 'Coverage during absence'),
  ('vacation_analytics', 'Vacation relationship analytics', 'reports', 70, 'Absence-period relationship metrics'),
  ('employee_dashboard', 'Employee dashboard', 'reports', 71, 'Front-line staff view'),
  ('manager_dashboard', 'Manager dashboard', 'reports', 72, 'Team relationship overview'),
  ('executive_dashboard', 'Executive dashboard', 'reports', 73, 'Executive relationship summary'),
  ('companion_client_advisor', 'Companion Client Advisor', 'automation', 74, 'Single Aipify identity — advisor bundle'),
  ('communication_drafting', 'Communication drafting', 'automation', 75, 'Draft messages — human review required'),
  ('human_review_queue', 'Human review queue', 'automation', 76, 'Pending human-approved communications'),
  ('automation_builder', 'Automation builder', 'automation', 77, 'Relationship automation workflows'),
  ('automation_guardrails', 'Automation guardrails', 'automation', 78, 'Consent and frequency guardrails'),
  ('duplicate_prevention', 'Duplicate message prevention', 'automation', 79, 'Prevent duplicate outreach'),
  ('automation_rules', 'Automation rules', 'automation', 80, 'Active automation rules'),
  ('multilingual_support', 'Multilingual support', 'config', 81, 'en/no/sv/da core locales'),
  ('accessibility_config', 'Accessibility configuration', 'config', 82, 'Accessibility preferences'),
  ('import_export', 'Import and export', 'reports', 83, 'Client data import/export'),
  ('api_metadata', 'API metadata', 'automation', 84, 'API integration metadata'),
  ('event_bus_link', 'Event bus integration', 'automation', 85, 'Phase 591 event bus link'),
  ('phase587_cs_link', 'Customer Success link', 'automation', 86, 'Phase 587 — not duplicated'),
  ('phase588_revenue_link', 'Revenue Operations link', 'automation', 87, 'Phase 588 — not duplicated'),
  ('phase610_booking_link', 'Service Booking link', 'rebooking', 88, 'Phase 610 booking — not duplicated'),
  ('phase606_vacation_link', 'Vacation Mode link', 'automation', 89, 'Phase 606 vacation — not duplicated'),
  ('fiken_prep', 'Fiken integration prep', 'reports', 90, 'Accounting integration metadata'),
  ('notification_preferences', 'Notification preferences', 'consent', 91, 'Channel preferences'),
  ('since_last_login', 'Since Last Login', 'reports', 92, 'Relationship changes since last login'),
  ('mobile_summary', 'Mobile summary', 'reports', 93, 'Mobile relationship summary'),
  ('privacy_controls', 'Privacy controls', 'consent', 94, 'Privacy and data minimization'),
  ('marketing_consent_separation', 'Marketing consent separation', 'consent', 95, 'Marketing vs service consent'),
  ('sensitive_services', 'Sensitive services', 'clients', 96, 'Extra protection for sensitive services'),
  ('retention_policies', 'Retention policies', 'consent', 97, 'Data retention governance'),
  ('fraud_review', 'Fraud review', 'clients', 98, 'Suspicious activity review queue'),
  ('relationship_analytics', 'Relationship analytics', 'reports', 99, 'Engagement and retention analytics'),
  ('revenue_forecasting', 'Revenue forecasting', 'reports', 100, 'Service revenue forecasts'),
  ('service_recovery', 'Service recovery', 'service_recovery', 101, 'Service recovery workflows'),
  ('recovery_cases', 'Recovery cases', 'service_recovery', 102, 'Active recovery case tracking'),
  ('recovery_templates', 'Recovery templates', 'service_recovery', 103, 'Approved recovery response templates'),
  ('reports_center', 'Reports center', 'reports', 104, 'Relationship reports hub'),
  ('audit_logging', 'Audit logging', 'reports', 105, 'Immutable audit trail'),
  ('compliance_reports', 'Compliance reports', 'reports', 106, 'Consent and privacy compliance reports')
on conflict (section_key) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Organization settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm611_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  center_enabled boolean not null default true,
  rebooking_enabled boolean not null default true,
  loyalty_enabled boolean not null default true,
  referral_enabled boolean not null default true,
  campaign_enabled boolean not null default true,
  marketing_consent_required boolean not null default true,
  human_review_required boolean not null default true,
  duplicate_message_prevention boolean not null default true,
  audit_logging_required boolean not null default true,
  mobile_summary_enabled boolean not null default true,
  entity_label text not null default 'Client',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_crm611_settings enable row level security;
revoke all on public.organization_crm611_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Terminology labels (unified entity — labels only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm611_terminology (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  label_key text not null,
  label_value text not null,
  label_context text not null default 'ui' check (label_context in ('ui', 'email', 'portal', 'report')),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, label_key)
);

alter table public.organization_crm611_terminology enable row level security;
revoke all on public.organization_crm611_terminology from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Client profiles (extends unified CRM entity)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm611_clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  client_key text not null,
  client_label text not null,
  crm_customer_id uuid references public.organization_crm_customers (id) on delete set null,
  lifecycle_status text not null default 'active' check (
    lifecycle_status in ('prospect', 'active', 'loyal', 'lapsed', 'reactivation', 'inactive')
  ),
  health_score integer not null default 75 check (health_score between 0 and 100),
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'attention_required', 'at_risk')
  ),
  clv_estimate numeric(14, 2),
  visit_count integer not null default 0,
  last_visit_at timestamptz,
  next_best_action text not null default '',
  sensitive_service boolean not null default false,
  marketing_consent boolean not null default false,
  service_consent boolean not null default true,
  preferred_locale text not null default 'en',
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, client_key)
);

alter table public.organization_crm611_clients enable row level security;
revoke all on public.organization_crm611_clients from authenticated, anon;

create table if not exists public.organization_crm611_duplicate_candidates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  candidate_key text not null,
  primary_client_key text not null,
  duplicate_client_key text not null,
  match_score integer not null default 80 check (match_score between 0 and 100),
  review_status text not null default 'pending' check (review_status in ('pending', 'approved', 'rejected', 'merged')),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, candidate_key)
);

alter table public.organization_crm611_duplicate_candidates enable row level security;
revoke all on public.organization_crm611_duplicate_candidates from authenticated, anon;

create table if not exists public.organization_crm611_segments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  segment_key text not null,
  segment_title text not null,
  segment_type text not null default 'dynamic' check (segment_type in ('dynamic', 'manual')),
  segment_status text not null default 'active',
  rule_summary text not null default '',
  member_count integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, segment_key)
);

alter table public.organization_crm611_segments enable row level security;
revoke all on public.organization_crm611_segments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Rebooking engine
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm611_rebooking_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  rule_key text not null,
  rule_title text not null,
  service_label text not null default '',
  interval_days integer not null default 30,
  requires_confirmation boolean not null default true,
  rule_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, rule_key)
);

alter table public.organization_crm611_rebooking_rules enable row level security;
revoke all on public.organization_crm611_rebooking_rules from authenticated, anon;

create table if not exists public.organization_crm611_rebooking_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  queue_key text not null,
  client_key text not null,
  service_label text not null,
  due_at timestamptz,
  queue_status text not null default 'pending' check (
    queue_status in ('pending', 'reminded', 'confirmed', 'booked', 'declined', 'lapsed')
  ),
  companion_suggested boolean not null default false,
  confirmation_required boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, queue_key)
);

alter table public.organization_crm611_rebooking_queue enable row level security;
revoke all on public.organization_crm611_rebooking_queue from authenticated, anon;

create table if not exists public.organization_crm611_recurring_agreements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  agreement_key text not null,
  client_key text not null,
  service_label text not null,
  cadence_label text not null default 'monthly',
  agreement_status text not null default 'active' check (agreement_status in ('active', 'paused', 'ended')),
  customer_approved boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, agreement_key)
);

alter table public.organization_crm611_recurring_agreements enable row level security;
revoke all on public.organization_crm611_recurring_agreements from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Retention & recovery
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm611_retention_cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_key text not null,
  case_title text not null,
  case_type text not null check (
    case_type in ('lapsed', 'abandoned_booking', 'cancellation', 'no_show', 'churn_risk')
  ),
  client_key text not null default '',
  case_status text not null default 'open' check (case_status in ('open', 'in_progress', 'resolved', 'dismissed')),
  respectful_outreach boolean not null default true,
  companion_recommendation text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, case_key)
);

alter table public.organization_crm611_retention_cases enable row level security;
revoke all on public.organization_crm611_retention_cases from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Client journeys
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm611_journey_stages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  stage_key text not null,
  stage_title text not null,
  stage_status text not null default 'pending' check (stage_status in ('pending', 'in_progress', 'completed')),
  sort_order integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, stage_key)
);

alter table public.organization_crm611_journey_stages enable row level security;
revoke all on public.organization_crm611_journey_stages from authenticated, anon;

create table if not exists public.organization_crm611_journey_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_key text not null,
  client_key text not null default '',
  event_title text not null,
  event_type text not null default 'milestone',
  occurred_at timestamptz not null default now(),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, event_key)
);

alter table public.organization_crm611_journey_events enable row level security;
revoke all on public.organization_crm611_journey_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Loyalty program
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm611_loyalty_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  account_key text not null,
  client_key text not null,
  tier_key text not null default 'bronze',
  points_balance integer not null default 0,
  lifetime_spend numeric(14, 2) not null default 0,
  visit_count integer not null default 0,
  tier_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, account_key)
);

alter table public.organization_crm611_loyalty_accounts enable row level security;
revoke all on public.organization_crm611_loyalty_accounts from authenticated, anon;

create table if not exists public.organization_crm611_loyalty_redemptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  redemption_key text not null,
  account_key text not null,
  reward_label text not null,
  points_used integer not null default 0,
  redemption_status text not null default 'completed',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, redemption_key)
);

alter table public.organization_crm611_loyalty_redemptions enable row level security;
revoke all on public.organization_crm611_loyalty_redemptions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Referrals
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm611_referrals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  referral_key text not null,
  referrer_client_key text not null,
  referred_label text not null,
  qualification_status text not null default 'pending' check (
    qualification_status in ('pending', 'qualified', 'rewarded', 'declined')
  ),
  growth_partner_attribution text not null default '',
  reward_label text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, referral_key)
);

alter table public.organization_crm611_referrals enable row level security;
revoke all on public.organization_crm611_referrals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Campaigns & communication
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm611_campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  campaign_key text not null,
  campaign_title text not null,
  campaign_status text not null default 'draft' check (campaign_status in ('draft', 'scheduled', 'active', 'paused', 'completed')),
  eligibility_summary text not null default '',
  frequency_cap_days integer not null default 14,
  consent_required boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, campaign_key)
);

alter table public.organization_crm611_campaigns enable row level security;
revoke all on public.organization_crm611_campaigns from authenticated, anon;

create table if not exists public.organization_crm611_communications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  message_key text not null,
  client_key text not null default '',
  channel text not null default 'email' check (channel in ('email', 'sms', 'portal', 'push')),
  delivery_status text not null default 'draft' check (
    delivery_status in ('draft', 'pending_review', 'approved', 'sent', 'delivered', 'failed', 'suppressed')
  ),
  consent_type text not null default 'service' check (consent_type in ('service', 'marketing')),
  human_review_required boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, message_key)
);

alter table public.organization_crm611_communications enable row level security;
revoke all on public.organization_crm611_communications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 11. Feedback & service recovery
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm611_feedback (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  feedback_key text not null,
  client_key text not null default '',
  feedback_type text not null default 'general' check (
    feedback_type in ('general', 'internal', 'public', 'complaint', 'safety')
  ),
  sentiment text not null default 'neutral' check (sentiment in ('positive', 'neutral', 'negative', 'critical')),
  routing_status text not null default 'open',
  escalated boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, feedback_key)
);

alter table public.organization_crm611_feedback enable row level security;
revoke all on public.organization_crm611_feedback from authenticated, anon;

create table if not exists public.organization_crm611_recovery_cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recovery_key text not null,
  feedback_key text not null default '',
  recovery_title text not null,
  recovery_status text not null default 'open' check (recovery_status in ('open', 'in_progress', 'resolved', 'escalated')),
  owner_label text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, recovery_key)
);

alter table public.organization_crm611_recovery_cases enable row level security;
revoke all on public.organization_crm611_recovery_cases from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 12. Automation & integrations
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm611_automations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  automation_key text not null,
  automation_title text not null,
  trigger_type text not null default 'event',
  automation_status text not null default 'draft' check (automation_status in ('draft', 'active', 'paused')),
  guardrails jsonb not null default '[]'::jsonb,
  duplicate_prevention boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, automation_key)
);

alter table public.organization_crm611_automations enable row level security;
revoke all on public.organization_crm611_automations from authenticated, anon;

create table if not exists public.organization_crm611_integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_key text not null,
  integration_title text not null,
  phase_ref text not null,
  integration_status text not null default 'linked' check (integration_status in ('linked', 'pending', 'unavailable')),
  route_hint text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, integration_key)
);

alter table public.organization_crm611_integrations enable row level security;
revoke all on public.organization_crm611_integrations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 13. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm611_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'client_relationship',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_crm611_audit_logs enable row level security;
revoke all on public.organization_crm611_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 14. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._crm611_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._crm611_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'client_relationship'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_crm611_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'client_relationship'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._crm611_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_crm611_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._crm611_health_status(p_score integer)
returns text language sql immutable as $$
  select case
    when coalesce(p_score, 0) >= 75 then 'healthy'
    when coalesce(p_score, 0) >= 50 then 'attention_required'
    else 'at_risk'
  end;
$$;

create or replace function public._crm611_health_label(p_status text)
returns text language sql immutable as $$
  select case coalesce(p_status, 'healthy')
    when 'healthy' then 'Healthy'
    when 'attention_required' then 'Attention Required'
    else 'At Risk'
  end;
$$;

create or replace function public._crm611_normalize_section(p_section text)
returns text language plpgsql immutable as $$
declare v text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
begin
  v := replace(v, '-', '_');
  if v in ('clients', 'client') then return 'clients'; end if;
  if v in ('journeys', 'journey', 'customer_journeys') then return 'journeys'; end if;
  if v in ('rebooking', 'rebook') then return 'rebooking'; end if;
  if v in ('retention', 'retain') then return 'retention'; end if;
  if v in ('loyalty') then return 'loyalty'; end if;
  if v in ('memberships', 'membership') then return 'memberships'; end if;
  if v in ('packages', 'package') then return 'packages'; end if;
  if v in ('referrals', 'referral') then return 'referrals'; end if;
  if v in ('campaigns', 'campaign') then return 'campaigns'; end if;
  if v in ('feedback') then return 'feedback'; end if;
  if v in ('service_recovery', 'servicerecovery', 'service-recovery') then return 'service_recovery'; end if;
  if v in ('consent') then return 'consent'; end if;
  if v in ('automation') then return 'automation'; end if;
  if v in ('reports', 'report') then return 'reports'; end if;
  return v;
end; $$;

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

grant execute on function public.get_organization_client_relationship_center(text) to authenticated;
grant execute on function public.get_aipify_companion_client_advisor_bundle() to authenticated;
grant execute on function public.get_organization_client_relationship_center_mobile_summary() to authenticated;
grant execute on function public._crm611_normalize_section(text) to authenticated;
