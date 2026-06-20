-- Phase 620 — patch: replace seed_app_showcase_data with corrected version
-- Fixes invalid organization_communication_messages status values from first remote apply.

-- Main seed orchestrator
create or replace function public.seed_app_showcase_data(
  p_organization_id uuid,
  p_dataset_key text default 'phase620_app_showcase_v1',
  p_mode text default 'baseline'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_owner_user_id uuid;
  v_staff_user_id uuid;
  v_dense boolean := lower(coalesce(p_mode, 'baseline')) = 'dense';
  v_suffix text := case when v_dense then ' — extended design-validation narrative for wrapping, badge width, table overflow, and mobile layout stress Æøå Österreich 日本語' else '' end;
  v_id uuid;
  v_counts jsonb := '{}'::jsonb;
  v_total int := 0;
  v_n int;
  rec record;
begin
  if p_organization_id is null then
    raise exception 'organization_id is required';
  end if;

  select c.company_id into v_company_id
  from public.customers c
  where c.id = p_organization_id;

  if v_company_id is null then
    raise exception 'Organization not found: %', p_organization_id;
  end if;

  select u.id into v_owner_user_id
  from public.users u
  where u.company_id = v_company_id and u.role = 'owner'
  order by u.created_at asc
  limit 1;

  if v_owner_user_id is null then
    select u.id into v_owner_user_id
    from public.users u
    where u.company_id = v_company_id
    order by u.created_at asc
    limit 1;
  end if;

  select u.id into v_staff_user_id
  from public.users u
  where u.company_id = v_company_id and u.id is distinct from v_owner_user_id
  order by u.created_at asc
  limit 1;

  perform public._ps620_capture_integrity(p_organization_id, p_dataset_key);

  v_n := public._ps620_seed_employees(p_organization_id, v_company_id, p_dataset_key, v_dense);
  v_counts := v_counts || jsonb_build_object('organization_employee_profiles', v_n);
  v_total := v_total + v_n;

  -- Responsibilities (16–24)
  v_n := 0;
  for rec in
    select *
    from (
      values
        ('ps620:resp:escalation', 'Customer escalation ownership', 'Own executive escalation queue and retention playbooks for strategic accounts.', 'support_requests', 'active', 'security', v_owner_user_id, v_staff_user_id, current_date - 120, 'quarterly'),
        ('ps620:resp:finance', 'Monthly financial reconciliation', 'Reconcile subscription, invoice, and payment metadata each month.', 'billing', 'active', 'operations', v_owner_user_id, null, current_date - 14, 'monthly'),
        ('ps620:resp:gdpr', 'Data protection incident response', 'Coordinate GDPR incident triage, documentation, and customer communication templates.', 'security', 'needs_review', 'security', v_staff_user_id, v_owner_user_id, current_date - 200, 'quarterly'),
        ('ps620:resp:marketplace', 'Marketplace content moderation', 'Review marketplace listings, provider submissions, and policy alignment.', 'operations', 'active', 'operations', v_staff_user_id, null, current_date - 30, 'monthly'),
        ('ps620:resp:renewal', 'Subscription renewal review', 'Track renewal risk accounts and prepare executive summaries.', 'billing', 'needs_review', 'billing', null, null, current_date - 400, 'quarterly'),
        ('ps620:resp:packs', 'Business Pack activation verification', 'Validate pack activation checklists before customer go-live.', 'business_packs', 'active', 'operations', v_owner_user_id, v_staff_user_id, current_date - 7, 'monthly'),
        ('ps620:resp:vendor', 'Vendor contract renewal', 'Maintain vendor renewal calendar and negotiation notes.', 'operations', 'active', 'operations', v_staff_user_id, v_owner_user_id, current_date + 21, 'quarterly'),
        ('ps620:resp:onboarding', 'Customer onboarding quality', 'Audit onboarding milestones and readiness checkpoints.', 'operations', 'active', 'operations', v_owner_user_id, null, current_date - 45, 'monthly'),
        ('ps620:resp:kc', 'Knowledge Center publication review', 'Review Knowledge Center drafts before publication.', 'operations', 'unassigned', 'operations', null, null, null, null),
        ('ps620:resp:access', 'Security access review', 'Quarterly access review for elevated roles and integrations.', 'security', 'needs_review', 'security', v_owner_user_id, null, current_date - 10, 'quarterly'),
        ('ps620:resp:exec', 'Executive reporting preparation', 'Prepare weekly executive reporting pack and briefing inputs.', 'operations', 'active', 'operations', v_owner_user_id, v_staff_user_id, current_date - 3, 'monthly'),
        ('ps620:resp:weekend', 'Weekend support coverage', 'Coordinate weekend support roster and escalation paths.', 'support_requests', 'active', 'support', v_staff_user_id, null, current_date - 1, 'monthly'),
        ('ps620:resp:credentials', 'Integration credential rotation', 'Track integration credential rotation schedule (metadata only).', 'integrations', 'active', 'integrations', v_staff_user_id, v_owner_user_id, current_date + 60, 'semi_annual'),
        ('ps620:resp:continuity', 'Booking continuity during absence', 'Ensure continuity plans when owners are unavailable.', 'operations', 'inactive', 'operations', null, v_owner_user_id, current_date - 500, 'annual'),
        ('ps620:resp:revenue', 'Revenue-risk follow-up', 'Follow up on revenue-risk signals surfaced by Aipify.', 'billing', 'active', 'billing', v_owner_user_id, null, current_date - 2, 'monthly'),
        ('ps620:resp:long', 'Enterprise-wide operational accountability for cross-functional incident coordination, vendor dependency mapping, and executive visibility across Business Packs', 'Long-form responsibility description to validate card height, wrapping, and filter chips when operational scope spans multiple departments and approval chains.', 'operations', 'needs_review', 'operations', v_owner_user_id, v_staff_user_id, current_date - 90, 'quarterly')
    ) as t(showcase_key, title, description, area, status, related_module, primary_owner_id, backup_owner_id, last_reviewed_date, review_frequency)
  loop
    if public._ps620_registered(p_organization_id, p_dataset_key, rec.showcase_key) then continue; end if;
    insert into public.app_portal_responsibilities (
      company_id, title, description, area, status, related_module,
      primary_owner_id, backup_owner_id, last_reviewed_date, review_frequency, notes
    ) values (
      v_company_id,
      rec.title || v_suffix,
      rec.description || v_suffix,
      rec.area,
      rec.status,
      rec.related_module,
      rec.primary_owner_id,
      rec.backup_owner_id,
      rec.last_reviewed_date,
      rec.review_frequency,
      jsonb_build_object('showcase_dataset', p_dataset_key)::text
    ) returning id into v_id;
    perform public._ps620_register(p_dataset_key, p_organization_id, 'app_portal_responsibilities', v_id, 'responsibility', 50, rec.showcase_key);
    v_n := v_n + 1;
  end loop;
  v_counts := v_counts || jsonb_build_object('app_portal_responsibilities', v_n);
  v_total := v_total + v_n;

  -- External relationships (12–18)
  v_n := 0;
  for rec in
    select *
    from (
      values
        ('ps620:ext:accounting', 'Nordic Ledger Partners AS', 'financial_institution', 'active', 'Norway', 'high', v_owner_user_id),
        ('ps620:ext:legal', 'Berg & Halvorsen Advokatfirma', 'legal_advisor', 'active', 'Norway', 'mission_critical', v_owner_user_id),
        ('ps620:ext:hosting', 'CloudNorth Infrastructure GmbH', 'technology_vendor', 'pending_renewal', 'Germany', 'high', v_staff_user_id),
        ('ps620:ext:payments', 'PayFlow Europe Ltd', 'service_provider', 'active', 'Ireland', 'mission_critical', null),
        ('ps620:ext:cleaning', 'Renhold Oslo', 'service_provider', 'active', 'Norway', 'low', v_staff_user_id),
        ('ps620:ext:marketing', 'Bright Fjord Marketing Studio — Full-service B2B content, lifecycle campaigns, and executive narrative support for international expansion programs', 'consultant', 'under_review', 'Norway', 'moderate', v_owner_user_id),
        ('ps620:ext:tech', 'IntegrateX Technology Partner', 'strategic_partner', 'active', 'Sweden', 'high', v_staff_user_id),
        ('ps620:ext:security', 'ShieldPoint Security Consulting', 'consultant', 'active', 'United Kingdom', 'mission_critical', v_owner_user_id),
        ('ps620:ext:insurance', 'SafeOps Insurance Cooperative', 'insurance_provider', 'active', 'Norway', 'moderate', null),
        ('ps620:ext:logistics', 'Arctic Route Logistics', 'supplier', 'suspended', 'Norway', 'moderate', v_staff_user_id),
        ('ps620:ext:expired', 'Legacy Hosting Provider (Ended)', 'technology_vendor', 'ended', 'Netherlands', 'low', null),
        ('ps620:ext:critical', 'Critical Payment Gateway Operator with extended vendor name for UI wrapping validation', 'service_provider', 'active', 'United States', 'mission_critical', v_owner_user_id)
    ) as t(showcase_key, organization_name, relationship_type, status, country, criticality_level, owner_id)
  loop
    if public._ps620_registered(p_organization_id, p_dataset_key, rec.showcase_key) then continue; end if;
    insert into public.app_portal_external_relationships (
      company_id, organization_name, relationship_type, status, country, criticality_level,
      owner_id, service_description, contract_end_date, renewal_reminder_date, email
    ) values (
      v_company_id,
      rec.organization_name || v_suffix,
      rec.relationship_type,
      rec.status,
      rec.country,
      rec.criticality_level,
      rec.owner_id,
      'Synthetic external relationship for APP design validation. No live integration.',
      current_date + (case when rec.status = 'pending_renewal' then 14 when rec.status = 'ended' then -30 else 180 end),
      current_date + 30,
      'vendor@example.aipify-showcase.invalid'
    ) returning id into v_id;
    perform public._ps620_register(p_dataset_key, p_organization_id, 'app_portal_external_relationships', v_id, 'external_relationship', 50, rec.showcase_key);
    v_n := v_n + 1;
  end loop;
  v_counts := v_counts || jsonb_build_object('app_portal_external_relationships', v_n);
  v_total := v_total + v_n;

  -- Organizational assets (15–25)
  v_n := 0;
  for rec in
    select *
    from (
      values
        ('ps620:asset:domain', 'Primary customer portal domain', 'domain_name', 'active', 'moderate', v_owner_user_id),
        ('ps620:asset:slack', 'Team collaboration subscription', 'subscription', 'active', 'moderate', v_staff_user_id),
        ('ps620:asset:laptop', 'Operations laptop fleet registry', 'hardware', 'under_review', 'high', v_staff_user_id),
        ('ps620:asset:cert', 'TLS certificate — public API edge', 'documentation_resource', 'pending_renewal', 'mission_critical', v_owner_user_id),
        ('ps620:asset:insurance', 'Cyber liability policy document', 'documentation_resource', 'active', 'high', v_owner_user_id),
        ('ps620:asset:brand', 'Brand asset library master pack', 'internal_resource', 'active', 'moderate', v_staff_user_id),
        ('ps620:asset:api', 'Masked integration credential reference', 'api_key_reference', 'active', 'mission_critical', null),
        ('ps620:asset:contract', 'Enterprise support contract archive', 'documentation_resource', 'active', 'high', v_owner_user_id),
        ('ps620:asset:license', 'Design tooling license pool', 'software_license', 'retired', 'low', null),
        ('ps620:asset:training', 'Security awareness training bundle', 'training_resource', 'active', 'moderate', v_staff_user_id),
        ('ps620:asset:crm', 'CRM workspace subscription', 'subscription', 'active', 'high', v_owner_user_id),
        ('ps620:asset:wiki', 'Internal wiki and SOP repository', 'internal_resource', 'active', 'moderate', v_staff_user_id),
        ('ps620:asset:monitoring', 'Observability platform subscription', 'subscription', 'pending_renewal', 'high', v_owner_user_id),
        ('ps620:asset:expired', 'Expired domain alias — redirect pending', 'domain_name', 'archived', 'moderate', null),
        ('ps620:asset:long', 'Enterprise-wide shared operational documentation repository with extended naming for card and table overflow testing', 'documentation_resource', 'active', 'moderate', v_owner_user_id)
    ) as t(showcase_key, asset_name, asset_type, status, criticality_level, owner_id)
  loop
    if public._ps620_registered(p_organization_id, p_dataset_key, rec.showcase_key) then continue; end if;
    insert into public.app_portal_organizational_assets (
      company_id, asset_name, asset_type, status, criticality_level, owner_id,
      vendor, renewal_date, internal_notes
    ) values (
      v_company_id,
      rec.asset_name || v_suffix,
      rec.asset_type,
      rec.status,
      rec.criticality_level,
      rec.owner_id,
      'Synthetic Vendor Co.',
      current_date + (case when rec.status = 'pending_renewal' then 10 else 120 end),
      'Showcase asset — no secrets stored.'
    ) returning id into v_id;
    perform public._ps620_register(p_dataset_key, p_organization_id, 'app_portal_organizational_assets', v_id, 'asset', 50, rec.showcase_key);
    v_n := v_n + 1;
  end loop;
  v_counts := v_counts || jsonb_build_object('app_portal_organizational_assets', v_n);
  v_total := v_total + v_n;

  -- Notifications (14) + digests (2) — requires user_id
  if v_owner_user_id is not null then
    v_n := 0;
    for rec in
      select *
      from (
        values
          ('ps620:ntf:1', 'approval_required', 'critical', 'pending', 'Executive approval waiting — trust action bundle'),
          ('ps620:ntf:2', 'approval_required', 'important', 'requires_approval', 'Contract renewal approval requested'),
          ('ps620:ntf:3', 'task_due', 'important', 'attention_required', 'Follow-up due today — customer escalation'),
          ('ps620:ntf:4', 'task_overdue', 'critical', 'attention_required', 'Overdue commitment — vendor renewal review'),
          ('ps620:ntf:5', 'companion_alert', 'critical', 'attention_required', 'Aipify flagged a critical operational signal'),
          ('ps620:ntf:6', 'license_warning', 'important', 'information', 'License capacity approaching threshold (synthetic)'),
          ('ps620:ntf:7', 'document_updated', 'normal', 'information', 'Policy document updated — review recommended'),
          ('ps620:ntf:8', 'announcement', 'normal', 'information', 'Company announcement published'),
          ('ps620:ntf:9', 'business_pack_event', 'important', 'attention_required', 'Business Pack activation milestone reached'),
          ('ps620:ntf:10', 'system', 'normal', 'completed', 'Scheduled maintenance completed successfully'),
          ('ps620:ntf:11', 'task_assigned', 'normal', 'pending', 'Task assigned — onboarding checklist review'),
          ('ps620:ntf:12', 'knowledge_published', 'normal', 'completed', 'Knowledge article published to internal library'),
          ('ps620:ntf:13', 'domain_event', 'important', 'attention_required', 'Domain verification attention required'),
          ('ps620:ntf:14', 'message', 'normal', 'information', 'Internal message — design validation thread')
      ) as t(showcase_key, notification_type, priority, status, summary)
    loop
      if public._ps620_registered(p_organization_id, p_dataset_key, rec.showcase_key) then continue; end if;
      insert into public.organization_communication_notifications (
        organization_id, user_id, notification_type, priority, status, summary
      ) values (
        p_organization_id,
        v_owner_user_id,
        rec.notification_type,
        rec.priority,
        rec.status,
        rec.summary || v_suffix
      ) returning id into v_id;
      perform public._ps620_register(
        p_dataset_key, p_organization_id, 'organization_communication_notifications', v_id, 'notification', 45, rec.showcase_key
      );
      v_n := v_n + 1;
    end loop;
    v_counts := v_counts || jsonb_build_object('organization_communication_notifications', v_n);
    v_total := v_total + v_n;

    if not public._ps620_registered(p_organization_id, p_dataset_key, 'ps620:digest:1') then
      insert into public.organization_notification_digests (
        organization_id, digest_number, digest_type, user_id, summary, items, metadata
      ) values (
        p_organization_id, 'PS620-DIG-001', 'daily', v_owner_user_id,
        'Daily synthetic digest — approvals, tasks, and alerts.',
        jsonb_build_array(jsonb_build_object('title', 'Approval waiting', 'priority', 'critical')),
        jsonb_build_object('showcase_dataset', p_dataset_key)
      ) returning id into v_id;
      perform public._ps620_register(p_dataset_key, p_organization_id, 'organization_notification_digests', v_id, 'digest', 45, 'ps620:digest:1');
      v_total := v_total + 1;
    end if;

    if not public._ps620_registered(p_organization_id, p_dataset_key, 'ps620:digest:2') then
      insert into public.organization_notification_digests (
        organization_id, digest_number, digest_type, user_id, summary, items, metadata
      ) values (
        p_organization_id, 'PS620-DIG-002', 'executive', v_owner_user_id,
        'Executive synthetic digest — strategic signals only.',
        jsonb_build_array(jsonb_build_object('title', 'Revenue-risk follow-up', 'priority', 'important')),
        jsonb_build_object('showcase_dataset', p_dataset_key)
      ) returning id into v_id;
      perform public._ps620_register(p_dataset_key, p_organization_id, 'organization_notification_digests', v_id, 'digest', 45, 'ps620:digest:2');
      v_total := v_total + 1;
    end if;
  end if;

  -- Communications
  v_n := 0;
  for rec in
    select *
    from (
      values
        ('ps620:msg:announce', 'message', 'organization', 'information', 'Company announcement — Q2 operating priorities'),
        ('ps620:msg:security', 'message', 'team', 'attention_required', 'Security reminder — rotate integration credentials metadata'),
        ('ps620:msg:policy', 'message', 'organization', 'information', 'Policy update — data retention and access review cadence'),
        ('ps620:msg:maintenance', 'message', 'system', 'information', 'Upcoming maintenance — notification orchestration dry run'),
        ('ps620:msg:celebrate', 'message', 'team', 'completed', 'Team celebration — onboarding milestone achieved'),
        ('ps620:msg:urgent', 'message', 'organization', 'attention_required', 'Urgent operational notice — escalation path test record'),
        ('ps620:msg:draft', 'message', 'organization', 'pending', 'Draft communication — pending executive review'),
        ('ps620:ann:archived', 'announcement', 'organization', 'archived', 'Archived communication — legacy process reminder')
    ) as t(showcase_key, record_kind, channel_type, status, subject)
  loop
    if rec.record_kind = 'announcement' then
      if public._ps620_registered(p_organization_id, p_dataset_key, rec.showcase_key) then continue; end if;
      insert into public.organization_communication_announcements (
        organization_id, title, body, scope, status, published_by
      ) values (
        p_organization_id,
        rec.subject || v_suffix,
        'Synthetic archived announcement for design validation.',
        rec.channel_type,
        rec.status,
        v_owner_user_id
      ) returning id into v_id;
      perform public._ps620_register(p_dataset_key, p_organization_id, 'organization_communication_announcements', v_id, 'announcement', 48, rec.showcase_key);
    else
      if public._ps620_registered(p_organization_id, p_dataset_key, rec.showcase_key) then continue; end if;
      insert into public.organization_communication_messages (
        organization_id, message_type, status, priority, subject, body, sender_user_id
      ) values (
        p_organization_id,
        rec.channel_type,
        rec.status,
        case when rec.status = 'attention_required' then 'important' else 'normal' end,
        rec.subject || v_suffix,
        'Synthetic internal communication body for layout and hierarchy testing. No external delivery.',
        v_owner_user_id
      ) returning id into v_id;
      perform public._ps620_register(p_dataset_key, p_organization_id, 'organization_communication_messages', v_id, 'message', 48, rec.showcase_key);
    end if;
    v_n := v_n + 1;
  end loop;
  v_counts := v_counts || jsonb_build_object('organization_communications', v_n);
  v_total := v_total + v_n;

  -- Executive Command Center (ECC590) — showcase keys avoid collision with default seed
  perform public._ecc590_ensure_settings(p_organization_id);
  v_n := 0;
  for rec in
    select *
    from (
      values
        ('ps620:sll:01', 'New support escalations', 'operational', 4, 'attention', 'Four escalations since last login.'),
        ('ps620:sll:02', 'Business Pack updates', 'business_pack', 2, 'information', 'Two pack configuration updates.'),
        ('ps620:sll:03', 'Approval completions', 'approval', 3, 'information', 'Three approvals completed.'),
        ('ps620:sll:04', 'Revenue signals', 'revenue', 1, 'urgent', 'One revenue signal needs review.'),
        ('ps620:sll:05', 'Knowledge publications', 'knowledge', 5, 'information', 'Five knowledge updates published.'),
        ('ps620:sll:06', 'Partner activity', 'partner', 2, 'attention', 'Two partner records changed.'),
        ('ps620:sll:07', 'Customer health shifts', 'customer', 3, 'attention', 'Three customer health shifts detected.'),
        ('ps620:sll:08', 'Contract milestones', 'contract', 1, 'critical', 'One contract milestone overdue.'),
        ('ps620:sll:09', 'Risk register updates', 'risk', 2, 'urgent', 'Two risks moved to monitoring.'),
        ('ps620:sll:10', 'Operational incidents closed', 'operational', 6, 'information', 'Six incidents closed since login.')
    ) as t(item_key, item_title, item_category, item_count, priority, summary)
  loop
    if public._ps620_registered(p_organization_id, p_dataset_key, rec.item_key) then continue; end if;
    insert into public.organization_ecc590_since_last_login (
      organization_id, item_key, item_title, item_category, item_count, priority, summary
    ) values (
      p_organization_id, rec.item_key, rec.item_title || v_suffix, rec.item_category, rec.item_count, rec.priority, rec.summary || v_suffix
    )
    on conflict (organization_id, item_key) do update
      set item_title = excluded.item_title, summary = excluded.summary, item_count = excluded.item_count, priority = excluded.priority
    returning id into v_id;
    perform public._ps620_register(p_dataset_key, p_organization_id, 'organization_ecc590_since_last_login', v_id, 'since_last_login', 40, rec.item_key);
    v_n := v_n + 1;
  end loop;

  for rec in
    select *
    from (
      values
        ('ps620:alert:1', 'Critical Approval Delay', 'approval_delay', 'critical', 'Complete pending executive approval today.'),
        ('ps620:alert:2', 'Major Customer Risk', 'customer_risk', 'urgent', 'Schedule executive review and retention plan.'),
        ('ps620:alert:3', 'Large Invoice Overdue', 'invoice_overdue', 'attention', 'Escalate to finance and customer success.'),
        ('ps620:alert:4', 'Security review overdue', 'security', 'attention', 'Complete quarterly security access review.')
    ) as t(alert_key, alert_title, alert_type, priority, companion_recommendation)
  loop
    if public._ps620_registered(p_organization_id, p_dataset_key, rec.alert_key) then continue; end if;
    insert into public.organization_ecc590_alerts (
      organization_id, alert_key, alert_title, alert_type, priority, alert_status, companion_recommendation, summary
    ) values (
      p_organization_id, rec.alert_key, rec.alert_title || v_suffix, rec.alert_type, rec.priority, 'open', rec.companion_recommendation, 'Synthetic executive alert for design validation.'
    )
    on conflict (organization_id, alert_key) do update
      set alert_title = excluded.alert_title, companion_recommendation = excluded.companion_recommendation
    returning id into v_id;
    perform public._ps620_register(p_dataset_key, p_organization_id, 'organization_ecc590_alerts', v_id, 'alert', 40, rec.alert_key);
    v_n := v_n + 1;
  end loop;

  for rec in
    select *
    from (
      values
        ('ps620:action:1', 'Pending Trust Approval', 'approval', 'critical', 'pending'),
        ('ps620:action:2', 'Contract Review', 'contract', 'urgent', 'pending'),
        ('ps620:action:3', 'Market Entry Decision', 'decision', 'attention', 'pending')
    ) as t(action_key, action_title, action_type, priority, action_status)
  loop
    if public._ps620_registered(p_organization_id, p_dataset_key, rec.action_key) then continue; end if;
    insert into public.organization_ecc590_actions (
      organization_id, action_key, action_title, action_type, priority, action_status, record_href, summary
    ) values (
      p_organization_id, rec.action_key, rec.action_title || v_suffix, rec.action_type, rec.priority, rec.action_status,
      '/app/approvals', 'Synthetic executive action item.'
    )
    on conflict (organization_id, action_key) do nothing
    returning id into v_id;
    if v_id is not null then
      perform public._ps620_register(p_dataset_key, p_organization_id, 'organization_ecc590_actions', v_id, 'action', 40, rec.action_key);
      v_n := v_n + 1;
    end if;
  end loop;

  for rec in
    select *
    from (
      values
        ('ps620:risk:1', 'Vendor concentration risk', 68, 'needs_attention'),
        ('ps620:risk:2', 'Support capacity strain', 72, 'healthy'),
        ('ps620:risk:3', 'Renewal pipeline visibility', 61, 'needs_attention'),
        ('ps620:risk:4', 'Compliance documentation gaps', 79, 'healthy'),
        ('ps620:risk:5', 'Integration dependency exposure', 55, 'needs_attention'),
        ('ps620:risk:6', 'Executive reporting timeliness', 83, 'healthy'),
        ('ps620:risk:7', 'Knowledge adoption variance', 77, 'healthy')
    ) as t(health_key, health_title, health_score, health_status)
  loop
    if public._ps620_registered(p_organization_id, p_dataset_key, rec.health_key) then continue; end if;
    insert into public.organization_ecc590_health (
      organization_id, health_key, health_title, health_score, health_status, summary
    ) values (
      p_organization_id, rec.health_key, rec.health_title || v_suffix, rec.health_score, rec.health_status,
      'Synthetic performance-health area for Command Center layout testing.'
    )
    on conflict (organization_id, health_key) do update
      set health_title = excluded.health_title, health_score = excluded.health_score, health_status = excluded.health_status
    returning id into v_id;
    perform public._ps620_register(p_dataset_key, p_organization_id, 'organization_ecc590_health', v_id, 'health', 40, rec.health_key);
    v_n := v_n + 1;
  end loop;

  for rec in
    select *
    from (
      values
        ('ps620:opp:1', 'Expansion — Fjord Retail Group', 'expansion', 'Review Knowledge Pack attach rate.'),
        ('ps620:opp:2', 'Partner — Baltic Integrator', 'partner', 'Schedule partner intro call.'),
        ('ps620:opp:3', 'Operational efficiency — support triage', 'operational_improvement', 'Automate triage metadata review.'),
        ('ps620:opp:4', 'Market — Nordics hospitality bundle', 'market', 'Evaluate Business Pack bundle for segment.')
    ) as t(opportunity_key, opportunity_title, opportunity_type, recommendation)
  loop
    if public._ps620_registered(p_organization_id, p_dataset_key, rec.opportunity_key) then continue; end if;
    insert into public.organization_ecc590_opportunities (
      organization_id, opportunity_key, opportunity_title, opportunity_type, priority, opportunity_status, recommendation, summary
    ) values (
      p_organization_id, rec.opportunity_key, rec.opportunity_title || v_suffix, rec.opportunity_type, 'attention', 'open',
      rec.recommendation, 'Synthetic opportunity record.'
    )
    on conflict (organization_id, opportunity_key) do nothing
    returning id into v_id;
    if v_id is not null then
      perform public._ps620_register(p_dataset_key, p_organization_id, 'organization_ecc590_opportunities', v_id, 'opportunity', 40, rec.opportunity_key);
      v_n := v_n + 1;
    end if;
  end loop;

  if not public._ps620_registered(p_organization_id, p_dataset_key, 'ps620:brief:1') then
    insert into public.organization_ecc590_briefings (
      organization_id, briefing_key, briefing_title, briefing_type,
      revenue_summary, customer_summary, risk_summary, operational_summary, growth_summary,
      companion_recommendations, briefing_status, summary
    ) values (
      p_organization_id, 'ps620_brief_exec', 'Companion Briefing — Executive Overview', 'companion_summary',
      'Synthetic revenue summary for layout testing.',
      'Synthetic customer summary with moderate length for wrapping validation.',
      'Two strategic risks under monitoring.',
      'Operations stable; approvals pending review.',
      'Four expansion opportunities identified.',
      'Review contract milestone and approval delay first.',
      'generated',
      'Synthetic companion briefing for Command Center tab validation.'
    )
    on conflict (organization_id, briefing_key) do update set briefing_title = excluded.briefing_title
    returning id into v_id;
    perform public._ps620_register(p_dataset_key, p_organization_id, 'organization_ecc590_briefings', v_id, 'briefing', 40, 'ps620:brief:1');
    v_n := v_n + 1;
  end if;

  for rec in
    select *
    from (
      values
        ('ps620:board:1', 'Executive Summary', 'executive_summary'),
        ('ps620:board:2', 'Board Summary', 'board_summary'),
        ('ps620:board:3', 'Monthly Business Review', 'monthly_mbr'),
        ('ps620:board:4', 'Quarterly Business Review', 'quarterly_qbr'),
        ('ps620:board:5', 'Annual Summary', 'annual')
    ) as t(report_key, report_title, report_type)
  loop
    if public._ps620_registered(p_organization_id, p_dataset_key, rec.report_key) then continue; end if;
    insert into public.organization_ecc590_board_reports (
      organization_id, report_key, report_title, report_type, report_status, summary
    ) values (
      p_organization_id, rec.report_key, rec.report_title || v_suffix, rec.report_type, 'available',
      'Synthetic board-ready report entry.'
    )
    on conflict (organization_id, report_key) do nothing
    returning id into v_id;
    if v_id is not null then
      perform public._ps620_register(p_dataset_key, p_organization_id, 'organization_ecc590_board_reports', v_id, 'board_report', 40, rec.report_key);
      v_n := v_n + 1;
    end if;
  end loop;

  v_counts := v_counts || jsonb_build_object('organization_ecc590', v_n);
  v_total := v_total + v_n;

  -- Activity operations events (since last login density)
  v_n := 0;
  for rec in
    select *
    from (
      values
        ('ps620:act:1', 'operational_activity', 'information', 'Workspace policy updated', now() - interval '2 hours'),
        ('ps620:act:2', 'approval_activity', 'pending', 'Executive approval queued', now() - interval '4 hours'),
        ('ps620:act:3', 'customer_activity', 'attention_required', 'Customer health shift detected', now() - interval '6 hours'),
        ('ps620:act:4', 'security_activity', 'security', 'Access review reminder generated', now() - interval '8 hours'),
        ('ps620:act:5', 'companion_activity', 'completed', 'Companion summary prepared', now() - interval '10 hours'),
        ('ps620:act:6', 'business_pack_activity', 'information', 'Business Pack milestone recorded', now() - interval '1 day'),
        ('ps620:act:7', 'domain_activity', 'information', 'Domain verification status changed', now() - interval '1 day 2 hours'),
        ('ps620:act:8', 'automation_activity', 'attention_required', 'Automation execution requires review', now() - interval '1 day 4 hours')
    ) as t(showcase_key, category, priority, title, occurred_at)
  loop
    if public._ps620_registered(p_organization_id, p_dataset_key, rec.showcase_key) then continue; end if;
    insert into public.organization_activity_operations_events (
      organization_id, event_number, scope, category, priority, title, summary, record_href, occurred_at
    ) values (
      p_organization_id,
      'PS620-' || substr(md5(rec.showcase_key), 1, 8),
      'organization',
      rec.category,
      rec.priority,
      rec.title || v_suffix,
      'Synthetic activity timeline event for Since Last Login validation.',
      '/app/since-last-login',
      rec.occurred_at
    ) returning id into v_id;
    perform public._ps620_register(p_dataset_key, p_organization_id, 'organization_activity_operations_events', v_id, 'activity_event', 42, rec.showcase_key);
    v_n := v_n + 1;
  end loop;
  v_counts := v_counts || jsonb_build_object('organization_activity_operations_events', v_n);
  v_total := v_total + v_n;

  -- Operations modules: decisions, follow-ups, goals, risks
  v_n := 0;
  for rec in
    select *
    from (
      values
        ('ps620:dec:1', 'Approve Nordic expansion pilot', 'strategic', 'under_review', 'high'),
        ('ps620:dec:2', 'Renew critical vendor contract', 'financial', 'approved', 'critical'),
        ('ps620:dec:3', 'Standardize onboarding checklist', 'operational', 'implemented', 'moderate'),
        ('ps620:dec:4', 'Long-horizon decision record with extended title for card wrapping and filter chip overflow in Decision Center lists', 'technology', 'proposed', 'high')
    ) as t(showcase_key, title, category, status, impact_level)
  loop
    if public._ps620_registered(p_organization_id, p_dataset_key, rec.showcase_key) then continue; end if;
    insert into public.app_portal_decisions (
      company_id, title, description, category, decision_owner_id, status, impact_level, expected_outcome
    ) values (
      v_company_id, rec.title || v_suffix, 'Synthetic decision record for operations module layout testing.', rec.category,
      v_owner_user_id, rec.status, rec.impact_level, 'Expected outcome documented for design validation only.'
    ) returning id into v_id;
    perform public._ps620_register(p_dataset_key, p_organization_id, 'app_portal_decisions', v_id, 'decision', 50, rec.showcase_key);
    v_n := v_n + 1;
  end loop;
  v_counts := v_counts || jsonb_build_object('app_portal_decisions', v_n);
  v_total := v_total + v_n;

  v_n := 0;
  for rec in
    select *
    from (
      values
        ('ps620:fu:1', 'Follow up enterprise renewal conversation', 'customer_follow_up', 'open', 'high', now() + interval '2 days'),
        ('ps620:fu:2', 'Waiting external legal review response', 'waiting_external', 'waiting', 'medium', now() + interval '5 days'),
        ('ps620:fu:3', 'Overdue commitment — vendor SLA attestation', 'overdue_commitment', 'escalated', 'critical', now() - interval '3 days'),
        ('ps620:fu:4', 'Strategic reminder — executive briefing prep', 'strategic_reminder', 'in_progress', 'medium', now() + interval '1 day')
    ) as t(showcase_key, title, category, status, priority, due_at)
  loop
    if public._ps620_registered(p_organization_id, p_dataset_key, rec.showcase_key) then continue; end if;
    insert into public.app_portal_follow_ups (
      company_id, title, category, assigned_owner_id, status, priority, due_at, suggested_next_action, notes
    ) values (
      v_company_id, rec.title || v_suffix, rec.category, v_owner_user_id, rec.status, rec.priority, rec.due_at,
      'Review and confirm next step.', 'Synthetic follow-up item.'
    ) returning id into v_id;
    perform public._ps620_register(p_dataset_key, p_organization_id, 'app_portal_follow_ups', v_id, 'follow_up', 50, rec.showcase_key);
    v_n := v_n + 1;
  end loop;
  v_counts := v_counts || jsonb_build_object('app_portal_follow_ups', v_n);
  v_total := v_total + v_n;

  v_n := 0;
  for rec in
    select *
    from (
      values
        ('ps620:goal:1', 'Improve onboarding time-to-value', 'customer_experience', 'active', 62),
        ('ps620:goal:2', 'Reduce support escalation rate', 'operational', 'at_risk', 38),
        ('ps620:goal:3', 'Launch Nordic partner program', 'growth', 'on_track', 54),
        ('ps620:goal:4', 'Enterprise-wide operational excellence program with extended naming for list density testing', 'strategic', 'draft', 10)
    ) as t(showcase_key, title, goal_type, status, progress_percent)
  loop
    if public._ps620_registered(p_organization_id, p_dataset_key, rec.showcase_key) then continue; end if;
    insert into public.app_portal_goals (
      company_id, title, description, goal_type, owner_id, status, progress_percent, success_criteria
    ) values (
      v_company_id, rec.title || v_suffix, 'Synthetic goal for Goals module layout validation.', rec.goal_type,
      v_owner_user_id, rec.status, rec.progress_percent, 'Success criteria defined for showcase dataset only.'
    ) returning id into v_id;
    perform public._ps620_register(p_dataset_key, p_organization_id, 'app_portal_goals', v_id, 'goal', 50, rec.showcase_key);
    v_n := v_n + 1;
  end loop;
  v_counts := v_counts || jsonb_build_object('app_portal_goals', v_n);
  v_total := v_total + v_n;

  v_n := 0;
  for rec in
    select *
    from (
      values
        ('ps620:riskreg:1', 'Third-party outage dependency', 'vendor', 'monitoring', 'high', 'major'),
        ('ps620:riskreg:2', 'Incomplete access review evidence', 'compliance', 'mitigation_in_progress', 'moderate', 'major'),
        ('ps620:riskreg:3', 'Support queue saturation during peak season', 'operational', 'identified', 'high', 'moderate'),
        ('ps620:riskreg:4', 'Long-tail operational risk with extended title for risk register table overflow and mobile wrapping', 'technology', 'under_review', 'moderate', 'major')
    ) as t(showcase_key, title, category, status, likelihood, impact)
  loop
    if public._ps620_registered(p_organization_id, p_dataset_key, rec.showcase_key) then continue; end if;
    insert into public.app_portal_risks (
      company_id, title, description, category, owner_id, status, likelihood, impact, mitigation_strategy
    ) values (
      v_company_id, rec.title || v_suffix, 'Synthetic risk register entry.', rec.category,
      v_owner_user_id, rec.status, rec.likelihood, rec.impact, 'Mitigation plan documented for design validation.'
    ) returning id into v_id;
    perform public._ps620_register(p_dataset_key, p_organization_id, 'app_portal_risks', v_id, 'risk', 50, rec.showcase_key);
    v_n := v_n + 1;
  end loop;
  v_counts := v_counts || jsonb_build_object('app_portal_risks', v_n);
  v_total := v_total + v_n;

  -- Governance (if module tables exist)
  if to_regclass('public.organization_governance_policies') is not null then
    v_n := 0;
    for rec in
      select *
      from (
        values
          ('PS620-POL-001', 'ps620:gov:pol:1', 'Information security policy', 'security', 'active'),
          ('PS620-POL-002', 'ps620:gov:pol:2', 'Access review standard', 'security', 'review_required'),
          ('PS620-POL-003', 'ps620:gov:pol:3', 'Vendor due diligence policy with extended title for governance list wrapping', 'operational', 'draft')
      ) as t(policy_number, showcase_key, title, category, status)
    loop
      if public._ps620_registered(p_organization_id, p_dataset_key, rec.showcase_key) then continue; end if;
      insert into public.organization_governance_policies (
        organization_id, policy_number, title, description, category, owner_user_id, status, review_date, metadata
      ) values (
        p_organization_id, rec.policy_number, rec.title || v_suffix,
        'Synthetic governance policy for trust/compliance layout testing.',
        rec.category, v_owner_user_id, rec.status, current_date + 90,
        jsonb_build_object('showcase_dataset', p_dataset_key, 'showcase_key', rec.showcase_key)
      ) returning id into v_id;
      perform public._ps620_register(p_dataset_key, p_organization_id, 'organization_governance_policies', v_id, 'policy', 50, rec.showcase_key);
      v_n := v_n + 1;
    end loop;
    v_counts := v_counts || jsonb_build_object('organization_governance_policies', v_n);
    v_total := v_total + v_n;
  end if;

  return jsonb_build_object(
    'ok', true,
    'dataset_key', p_dataset_key,
    'organization_id', p_organization_id,
    'company_id', v_company_id,
    'mode', p_mode,
    'records_created_or_updated', v_total,
    'modules', v_counts,
    'integrity_snapshot_captured', true,
    'external_side_effects_triggered', 0
  );
end;
$$;
