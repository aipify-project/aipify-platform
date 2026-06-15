-- Aipify Hosts — Knowledge Center FAQ seed
-- Source: content/knowledge/aipify/aipify-hosts/faq/aipify-hosts-knowledge-center-faq.md

create or replace function public._ahostkc_ensure_category(
  p_slug text,
  p_name text,
  p_description text,
  p_sort int,
  p_parent_slug text default 'aipify-hosts'
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_parent_id uuid;
  v_id uuid;
begin
  select id into v_parent_id
  from public.aipify_knowledge_categories
  where slug = p_parent_slug and tenant_id is null;
  select id into v_id
  from public.aipify_knowledge_categories
  where slug = p_slug and tenant_id is null;
  if v_id is not null then return v_id; end if;
  insert into public.aipify_knowledge_categories (
    tenant_id, parent_category_id, slug, name, description, visibility, sort_order
  ) values (
    null, v_parent_id, p_slug, p_name, p_description, 'authenticated', p_sort
  )
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._ahostkc_seed_article(
  p_category_slug text,
  p_slug text,
  p_title text,
  p_body text,
  p_visibility text default 'authenticated',
  p_tags text[] default array['aipify-hosts']
) returns void language plpgsql security definer set search_path = public as $$
declare v_cat uuid; v_id uuid;
begin
  select id into v_cat from public.aipify_knowledge_categories
  where slug = p_category_slug and tenant_id is null;
  if v_cat is null then return; end if;
  if exists (
    select 1 from public.aipify_knowledge_articles
    where slug = p_slug and language = 'en' and tenant_id is null
  ) then return; end if;
  insert into public.aipify_knowledge_articles (
    tenant_id, category_id, slug, title, body, language, article_type,
    status, visibility, tags, is_global, published_at, source_path
  ) values (
    null, v_cat, p_slug, p_title, p_body, 'en', 'faq',
    'published', p_visibility, p_tags, true, now(),
    'content/knowledge/aipify/aipify-hosts/faq/aipify-hosts-knowledge-center-faq.md'
  ) returning id into v_id;
  perform public._kc_refresh_article_search_vector(v_id);
end;
$$;

create or replace function public.seed_aipify_hosts_knowledge_center_faq()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-general', 'General Host FAQ',
    'Core questions about Aipify Hosts for hospitality operators.', 221
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-guest-communication', 'Guest Communication',
    'Guest messaging, templates, and communication control.', 222
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-arrivals-departures', 'Arrivals & Departures',
    'Arrival visibility, cleaning readiness, and check-out workflows.', 223
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-property-management', 'Property Management',
    'Multi-property oversight, maintenance, tasks, and inspections.', 224
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-cleaning-operations', 'Cleaning Operations',
    'Cleaner access, task tracking, completion, and escalation.', 225
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-incidents', 'Incidents',
    'Damage documentation, photos, and assignment.', 226
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-reporting', 'Reporting',
    'Operational reports, property comparison, and trends.', 227
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-approvals', 'Approvals',
    'Governance workflows, approvers, and audit logging.', 228
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-security', 'Security',
    'Role-based access, accountability, and responsibilities.', 229
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-team-management', 'Team Management',
    'Managers, cleaners, vendors, and scoped access.', 230
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-kc-guide', 'Knowledge Center',
    'Operational guidance and onboarding resources.', 231
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-billing', 'Billing',
    'Subscription, upgrades, and property capacity licensing.', 232
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-guest-faq', 'General Guest FAQ',
    'Guest-facing guidance for check-in, support, and emergencies.', 233
  );

  -- General Host FAQ
  perform public._ahostkc_seed_article('aipify-hosts-general', 'what-is-aipify-hosts', 'What is Aipify Hosts?',
    'Aipify Hosts is an operations platform designed to help hospitality businesses manage guest experiences, daily operations, approvals, maintenance and business performance from one place.');
  perform public._ahostkc_seed_article('aipify-hosts-general', 'is-aipify-hosts-a-booking-platform', 'Is Aipify Hosts a booking platform?',
    'No. Aipify Hosts complements booking platforms and focuses on operational excellence.');
  perform public._ahostkc_seed_article('aipify-hosts-general', 'can-i-use-aipify-hosts-with-one-property', 'Can I use Aipify Hosts if I only have one property?',
    'Yes. Aipify Hosts is designed for both individual hosts and large hospitality organizations.');
  perform public._ahostkc_seed_article('aipify-hosts-general', 'does-aipify-hosts-support-multiple-properties', 'Does Aipify Hosts support multiple properties?',
    'Yes. Multiple properties can be managed from a single workspace.');
  perform public._ahostkc_seed_article('aipify-hosts-general', 'can-my-team-use-aipify-hosts', 'Can my team use Aipify Hosts?',
    'Yes. Role-based access allows owners, managers, cleaners and maintenance personnel to collaborate securely.');

  -- Guest Communication
  perform public._ahostkc_seed_article('aipify-hosts-guest-communication', 'can-guests-contact-me-directly', 'Can guests contact me directly?',
    'Yes. Communication remains under your control.');
  perform public._ahostkc_seed_article('aipify-hosts-guest-communication', 'can-team-members-respond-to-guest-inquiries', 'Can team members respond to guest inquiries?',
    'Yes. Permissions determine who may communicate with guests.');
  perform public._ahostkc_seed_article('aipify-hosts-guest-communication', 'can-i-prepare-response-templates', 'Can I prepare response templates?',
    'Yes. Frequently used responses can be standardized.');
  perform public._ahostkc_seed_article('aipify-hosts-guest-communication', 'will-guests-know-i-use-aipify-hosts', 'Will guests know I use Aipify Hosts?',
    'Aipify Hosts operates as part of your hospitality operations.');

  -- Arrivals & Departures
  perform public._ahostkc_seed_article('aipify-hosts-arrivals-departures', 'can-i-see-todays-arrivals', 'Can I see today''s arrivals?',
    'Yes. The dashboard highlights upcoming arrivals and departures.');
  perform public._ahostkc_seed_article('aipify-hosts-arrivals-departures', 'can-i-track-cleaning-before-arrival', 'Can I track cleaning before arrival?',
    'Yes. Cleaning completion can be monitored before guests arrive.');
  perform public._ahostkc_seed_article('aipify-hosts-arrivals-departures', 'can-late-checkout-requests-be-reviewed', 'Can late check-out requests be reviewed?',
    'Yes. Requests can be approved through controlled workflows.');

  -- Property Management
  perform public._ahostkc_seed_article('aipify-hosts-property-management', 'can-i-manage-multiple-properties-centrally', 'Can I manage multiple properties?',
    'Yes. Properties can be grouped and monitored centrally.');
  perform public._ahostkc_seed_article('aipify-hosts-property-management', 'can-i-track-maintenance-tasks', 'Can I track maintenance tasks?',
    'Yes. Maintenance activities can be assigned and monitored.');
  perform public._ahostkc_seed_article('aipify-hosts-property-management', 'can-recurring-tasks-be-scheduled', 'Can recurring tasks be scheduled?',
    'Yes. Regular operational tasks can be planned and reviewed.');
  perform public._ahostkc_seed_article('aipify-hosts-property-management', 'can-i-document-inspections', 'Can I document inspections?',
    'Yes. Inspection workflows may include notes and image documentation.');

  -- Cleaning Operations
  perform public._ahostkc_seed_article('aipify-hosts-cleaning-operations', 'can-cleaners-have-their-own-access', 'Can cleaners have their own access?',
    'Yes. Limited-access roles can be assigned.');
  perform public._ahostkc_seed_article('aipify-hosts-cleaning-operations', 'can-cleaning-tasks-be-tracked', 'Can cleaning tasks be tracked?',
    'Yes. Cleaning progress can be monitored.');
  perform public._ahostkc_seed_article('aipify-hosts-cleaning-operations', 'can-cleaners-confirm-completion', 'Can cleaners confirm completion?',
    'Yes. Task completion can be recorded.');
  perform public._ahostkc_seed_article('aipify-hosts-cleaning-operations', 'can-cleaning-issues-be-reported', 'Can issues discovered during cleaning be reported?',
    'Yes. Operational concerns may be escalated.');

  -- Incidents
  perform public._ahostkc_seed_article('aipify-hosts-incidents', 'what-happens-if-something-is-damaged', 'What happens if something is damaged?',
    'Incidents can be documented and reviewed.');
  perform public._ahostkc_seed_article('aipify-hosts-incidents', 'can-photos-be-attached-to-incidents', 'Can photos be attached to incidents?',
    'Yes. Supporting documentation may be stored.');
  perform public._ahostkc_seed_article('aipify-hosts-incidents', 'can-incidents-be-assigned-to-team-members', 'Can incidents be assigned to team members?',
    'Yes. Ownership and follow-up actions can be tracked.');

  -- Reporting
  perform public._ahostkc_seed_article('aipify-hosts-reporting', 'can-i-view-operational-reports', 'Can I view operational reports?',
    'Yes. Reports provide insight into hospitality operations.');
  perform public._ahostkc_seed_article('aipify-hosts-reporting', 'can-i-compare-properties', 'Can I compare properties?',
    'Yes. Property performance can be reviewed side by side.');
  perform public._ahostkc_seed_article('aipify-hosts-reporting', 'can-i-identify-operational-trends', 'Can I identify operational trends?',
    'Yes. Historical reporting supports decision-making.');

  -- Approvals
  perform public._ahostkc_seed_article('aipify-hosts-approvals', 'can-important-actions-require-approval', 'Can important actions require approval?',
    'Yes. Approval workflows support operational governance.');
  perform public._ahostkc_seed_article('aipify-hosts-approvals', 'who-can-approve-requests', 'Who can approve requests?',
    'Approval permissions are configurable.');
  perform public._ahostkc_seed_article('aipify-hosts-approvals', 'are-approvals-logged', 'Are approvals logged?',
    'Yes. Significant actions are audit logged.');

  -- Security
  perform public._ahostkc_seed_article('aipify-hosts-security', 'is-aipify-hosts-access-controlled', 'Is access controlled?',
    'Yes. Role-based permissions determine access levels.');
  perform public._ahostkc_seed_article('aipify-hosts-security', 'are-important-actions-tracked', 'Are important actions tracked?',
    'Yes. Operational activity may be recorded for accountability purposes.');
  perform public._ahostkc_seed_article('aipify-hosts-security', 'can-users-have-different-responsibilities', 'Can users have different responsibilities?',
    'Yes. Access is aligned with operational roles.');

  -- Team Management
  perform public._ahostkc_seed_article('aipify-hosts-team-management', 'can-i-add-managers', 'Can I add managers?',
    'Yes. Management roles can be assigned.');
  perform public._ahostkc_seed_article('aipify-hosts-team-management', 'can-cleaners-access-only-relevant-areas', 'Can cleaners access only relevant areas?',
    'Yes. Permissions limit access appropriately.');
  perform public._ahostkc_seed_article('aipify-hosts-team-management', 'can-external-vendors-participate', 'Can external vendors participate?',
    'Yes. Access can be configured when required.');

  -- Knowledge Center
  perform public._ahostkc_seed_article('aipify-hosts-kc-guide', 'what-is-the-aipify-hosts-knowledge-center', 'What is the Knowledge Center?',
    'The Knowledge Center contains operational guidance and frequently asked questions.');
  perform public._ahostkc_seed_article('aipify-hosts-kc-guide', 'can-new-knowledge-articles-be-added', 'Can new articles be added?',
    'Yes. Knowledge resources can expand over time.');
  perform public._ahostkc_seed_article('aipify-hosts-kc-guide', 'is-knowledge-center-useful-for-onboarding', 'Is the Knowledge Center useful for new team members?',
    'Yes. It supports onboarding and operational consistency.');

  -- Billing
  perform public._ahostkc_seed_article('aipify-hosts-billing', 'how-do-i-view-my-aipify-hosts-subscription', 'How do I view my subscription?',
    'Subscription information is available within account settings.');
  perform public._ahostkc_seed_article('aipify-hosts-billing', 'can-i-upgrade-my-aipify-hosts-package', 'Can I upgrade my package?',
    'Yes. Packages can be adjusted as operational needs evolve.');
  perform public._ahostkc_seed_article('aipify-hosts-billing', 'will-access-change-immediately-after-upgrading', 'Will my access change immediately after upgrading?',
    'Yes. Additional property capacity becomes available once the subscription update is confirmed.');

  -- General Guest FAQ (public visibility)
  perform public._ahostkc_seed_article('aipify-hosts-guest-faq', 'how-do-guests-receive-check-in-instructions', 'How do I receive check-in instructions?',
    'Instructions are provided by the host.', 'public', array['aipify-hosts', 'guest-faq']);
  perform public._ahostkc_seed_article('aipify-hosts-guest-faq', 'who-do-guests-contact-for-assistance', 'Who do I contact if I need assistance?',
    'Contact details are available through the booking experience.', 'public', array['aipify-hosts', 'guest-faq']);
  perform public._ahostkc_seed_article('aipify-hosts-guest-faq', 'can-guests-request-late-checkout', 'Can I request a late check-out?',
    'Yes. Requests remain subject to host approval.', 'public', array['aipify-hosts', 'guest-faq']);
  perform public._ahostkc_seed_article('aipify-hosts-guest-faq', 'what-should-guests-do-if-something-not-working', 'What should I do if something is not working?',
    'Notify the host or property contact as soon as possible.', 'public', array['aipify-hosts', 'guest-faq']);
  perform public._ahostkc_seed_article('aipify-hosts-guest-faq', 'what-should-guests-do-during-emergency', 'What should I do during an emergency?',
    'Follow local emergency procedures and contact the appropriate emergency services when necessary.', 'public', array['aipify-hosts', 'guest-faq']);
end;
$$;

select public.seed_aipify_hosts_knowledge_center_faq();

grant execute on function public.seed_aipify_hosts_knowledge_center_faq() to authenticated;
