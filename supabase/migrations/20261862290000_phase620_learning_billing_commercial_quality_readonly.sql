-- Phase 620 P1 — Learning, Business DNA, Governance, Billing, Commercial, Quality read-only GET repair.

-- ---------------------------------------------------------------------------
-- 1. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('learning.view', 'View Learning', null, 'View learning engine and review center'),
  ('learning.manage', 'Manage Learning', null, 'Manage learning settings and memory'),
  ('business_dna.view', 'View Business DNA', null, 'View business DNA profile and knowledge'),
  ('business_dna.manage', 'Manage Business DNA', null, 'Manage business DNA profile and settings'),
  ('governance.view', 'View Governance', null, 'View governance settings and policies'),
  ('governance.manage', 'Manage Governance', null, 'Manage governance settings and controls'),
  ('commercial.view', 'View Commercial', null, 'View commercial model dashboard'),
  ('commercial.manage', 'Manage Commercial', null, 'Manage commercial settings'),
  ('payment_providers.view', 'View Payment Providers', null, 'View payment provider configuration'),
  ('payment_providers.manage', 'Manage Payment Providers', null, 'Manage payment provider credentials'),
  ('quality.view', 'View Quality Guardian', null, 'View quality guardian settings and scans'),
  ('quality.manage', 'Manage Quality Guardian', null, 'Manage quality guardian settings and scans')
) as v(key, label, module_key, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'learning.view'), ('owner', 'learning.manage'),
  ('administrator', 'learning.view'), ('administrator', 'learning.manage'),
  ('manager', 'learning.view'),
  ('support_agent', 'learning.view'),
  ('viewer', 'learning.view'),
  ('owner', 'business_dna.view'), ('owner', 'business_dna.manage'),
  ('administrator', 'business_dna.view'), ('administrator', 'business_dna.manage'),
  ('manager', 'business_dna.view'),
  ('support_agent', 'business_dna.view'),
  ('viewer', 'business_dna.view'),
  ('owner', 'governance.view'), ('owner', 'governance.manage'),
  ('administrator', 'governance.view'), ('administrator', 'governance.manage'),
  ('manager', 'governance.view'),
  ('viewer', 'governance.view'),
  ('owner', 'commercial.view'), ('owner', 'commercial.manage'),
  ('administrator', 'commercial.view'), ('administrator', 'commercial.manage'),
  ('manager', 'commercial.view'),
  ('viewer', 'commercial.view'),
  ('owner', 'payment_providers.view'), ('owner', 'payment_providers.manage'),
  ('administrator', 'payment_providers.view'), ('administrator', 'payment_providers.manage'),
  ('manager', 'payment_providers.view'),
  ('viewer', 'payment_providers.view'),
  ('owner', 'quality.view'), ('owner', 'quality.manage'),
  ('administrator', 'quality.view'), ('administrator', 'quality.manage'),
  ('manager', 'quality.view'),
  ('viewer', 'quality.view')
) as v(role, key)
on conflict (organization_id, role, permission_key) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Idempotent settings provisioning (forward-only; never on GET)
-- ---------------------------------------------------------------------------
insert into public.learning_settings (tenant_id)
select c.id from public.customers c
where not exists (select 1 from public.learning_settings s where s.tenant_id = c.id)
on conflict (tenant_id) do nothing;

insert into public.customer_learning_settings (tenant_id)
select c.id from public.customers c
where not exists (select 1 from public.customer_learning_settings s where s.tenant_id = c.id)
on conflict (tenant_id) do nothing;

insert into public.business_dna_profiles (tenant_id, company_name)
select c.id, coalesce(c.company_name, '')
from public.customers c
where not exists (select 1 from public.business_dna_profiles p where p.tenant_id = c.id)
on conflict (tenant_id) do nothing;

insert into public.bde_settings (tenant_id)
select c.id from public.customers c
where not exists (select 1 from public.bde_settings s where s.tenant_id = c.id)
on conflict (tenant_id) do nothing;

insert into public.aipify_governance_settings (tenant_id)
select c.id from public.customers c
where not exists (select 1 from public.aipify_governance_settings s where s.tenant_id = c.id)
on conflict (tenant_id) do nothing;

insert into public.commercial_model_settings (tenant_id)
select c.id from public.customers c
where not exists (select 1 from public.commercial_model_settings s where s.tenant_id = c.id)
on conflict (tenant_id) do nothing;

-- ---------------------------------------------------------------------------
-- 3. Read helpers
-- ---------------------------------------------------------------------------
create or replace function public._lrn_read_settings(p_tenant_id uuid)
returns public.learning_settings
language plpgsql stable security definer set search_path = public as $$
declare v_row public.learning_settings;
begin
  select * into v_row from public.learning_settings where tenant_id = p_tenant_id;
  if found then return v_row; end if;
  v_row.tenant_id := p_tenant_id;
  v_row.enabled := true;
  v_row.allow_support_learning := true;
  v_row.allow_quality_learning := true;
  v_row.allow_automation_learning := true;
  v_row.allow_notification_learning := true;
  v_row.allow_briefing_learning := true;
  v_row.allow_action_learning := true;
  v_row.require_admin_review_rules := true;
  v_row.retention_days := 365;
  return v_row;
end; $$;

create or replace function public._cl_read_settings(p_tenant_id uuid)
returns public.customer_learning_settings
language plpgsql stable security definer set search_path = public as $$
declare v_row public.customer_learning_settings;
begin
  select * into v_row from public.customer_learning_settings where tenant_id = p_tenant_id;
  if found then return v_row; end if;
  v_row.tenant_id := p_tenant_id;
  v_row.learning_mode := 'assisted';
  return v_row;
end; $$;

create or replace function public._bde_read_profile(p_tenant_id uuid)
returns public.business_dna_profiles
language plpgsql stable security definer set search_path = public as $$
declare v_row public.business_dna_profiles;
  v_company_name text;
begin
  select * into v_row from public.business_dna_profiles where tenant_id = p_tenant_id;
  if found then return v_row; end if;
  select coalesce(c.company_name, '') into v_company_name from public.customers c where c.id = p_tenant_id;
  v_row.tenant_id := p_tenant_id;
  v_row.company_name := v_company_name;
  v_row.profile_status := 'draft';
  return v_row;
end; $$;

create or replace function public._bde_read_settings(p_tenant_id uuid)
returns public.bde_settings
language plpgsql stable security definer set search_path = public as $$
declare v_row public.bde_settings;
begin
  select * into v_row from public.bde_settings where tenant_id = p_tenant_id;
  if found then return v_row; end if;
  v_row.tenant_id := p_tenant_id;
  v_row.human_review_mode := true;
  return v_row;
end; $$;

create or replace function public._tacc_read_governance_settings(p_tenant_id uuid)
returns public.aipify_governance_settings
language plpgsql stable security definer set search_path = public as $$
declare v_row public.aipify_governance_settings;
begin
  select * into v_row from public.aipify_governance_settings where tenant_id = p_tenant_id;
  if found then return v_row; end if;
  v_row.tenant_id := p_tenant_id;
  v_row.governance_mode := 'safe';
  v_row.approval_defaults := '{"require_medium_risk": true, "require_high_risk": true}'::jsonb;
  v_row.emergency_controls_enabled := true;
  v_row.explainability_enabled := true;
  v_row.trust_scoring_enabled := true;
  v_row.audit_retention_days := 365;
  return v_row;
end; $$;

create or replace function public._bpc_read_settings(p_tenant_id uuid)
returns public.commercial_model_settings
language plpgsql stable security definer set search_path = public as $$
declare v_row public.commercial_model_settings;
begin
  select * into v_row from public.commercial_model_settings where tenant_id = p_tenant_id;
  if found then return v_row; end if;
  v_row.tenant_id := p_tenant_id;
  v_row.self_service_enabled := true;
  v_row.trials_enabled := true;
  v_row.partner_billing_enabled := true;
  v_row.global_billing_enabled := true;
  v_row.downgrade_grace_days := 14;
  v_row.currency := 'EUR';
  return v_row;
end; $$;

create or replace function public._qg_read_settings(p_tenant_id uuid)
returns public.aipify_quality_settings
language plpgsql stable security definer set search_path = public as $$
declare v_row public.aipify_quality_settings;
begin
  select * into v_row from public.aipify_quality_settings where tenant_id = p_tenant_id;
  if found then return v_row; end if;
  v_row.tenant_id := p_tenant_id;
  v_row.observation_mode := true;
  v_row.auto_fix_enabled := false;
  v_row.notify_developers := true;
  v_row.create_admin_tasks := true;
  v_row.open_knowledge_gaps := true;
  v_row.scan_interval_hours := 24;
  v_row.enabled_scanners := '["link_monitor","journey_monitor","integration_monitor","workflow_validator","translation_monitor","mobile_monitor"]'::jsonb;
  return v_row;
end; $$;

create or replace function public._qg_entitlement_state(p_tenant_id uuid)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_plan text;
  v_module_active boolean := false;
begin
  v_plan := public._qg_tenant_plan(p_tenant_id);

  select exists (
    select 1 from public.organization_modules m
    where m.organization_id = p_tenant_id
      and m.module_key in ('quality_guardian_engine', 'quality_guardian')
      and m.status in ('active', 'beta')
  ) into v_module_active;

  if v_module_active then
    return jsonb_build_object('has_entitlement', true, 'access_state', 'ready', 'plan', v_plan);
  end if;

  if v_plan in ('business', 'enterprise') then
    return jsonb_build_object('has_entitlement', true, 'access_state', 'ready', 'plan', v_plan);
  end if;

  return jsonb_build_object(
    'has_entitlement', false,
    'access_state', case when v_plan in ('lifetime', 'enterprise_plus') then 'entitlement_missing' else 'plan_required' end,
    'plan', v_plan
  );
end; $$;

create or replace function public._pp620_require_billing_view()
returns void
language plpgsql stable security definer set search_path = public as $$
begin
  if public.has_organization_permission('payment_providers.view')
     or public.has_organization_permission('payment_providers.manage')
     or public.has_organization_permission('billing.view')
     or public.has_organization_permission('billing.manage')
     or public.has_organization_permission('subscription.view')
     or public.has_organization_permission('subscription.manage')
     or public.has_organization_permission('enterprise_invoice.view')
     or public.has_organization_permission('enterprise_invoice.manage') then
    return;
  end if;
  raise exception 'Permission denied: billing.view';
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Learning engine dashboard (read-only GET)
-- ---------------------------------------------------------------------------
create or replace function public.get_learning_engine_dashboard()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._lrn_require_tenant();

  return jsonb_build_object(
    'has_customer', true,
    'metrics', jsonb_build_object(
      'total_events', (select count(*) from public.learning_events where tenant_id = v_tenant_id),
      'positive_feedback', (select count(*) from public.learning_feedback where tenant_id = v_tenant_id and feedback_type in ('helpful', 'approved')),
      'negative_feedback', (select count(*) from public.learning_feedback where tenant_id = v_tenant_id and feedback_type in ('not_helpful', 'false_positive', 'too_noisy', 'rejected')),
      'false_positives_reduced', (select count(*) from public.learning_events where tenant_id = v_tenant_id and event_type = 'incident_false_positive'),
      'suggestions_improved', (select count(*) from public.learning_scores where tenant_id = v_tenant_id and current_score > 55),
      'automations_improved', (select count(*) from public.learning_events where tenant_id = v_tenant_id and event_type = 'automation_success'),
      'noisy_notifications_reduced', (select count(*) from public.learning_events where tenant_id = v_tenant_id and event_type = 'notification_muted')
    ),
    'top_patterns', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pattern_key', ls.pattern_key, 'source_module', ls.source_module,
        'current_score', ls.current_score, 'positive_count', ls.positive_count,
        'negative_count', ls.negative_count, 'explanation', ls.explanation
      ) order by ls.current_score desc)
      from public.learning_scores ls where ls.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'recent_priority_adjustments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', le.id, 'event_type', le.event_type, 'source_module', le.source_module,
        'explanation', le.explanation, 'confidence_before', le.confidence_before,
        'confidence_after', le.confidence_after, 'created_at', le.created_at
      ) order by le.created_at desc)
      from public.learning_events le where le.tenant_id = v_tenant_id
        and le.confidence_after is not null limit 10
    ), '[]'::jsonb),
    'recent_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', le.id, 'event_type', le.event_type, 'source_module', le.source_module,
        'user_decision', le.user_decision, 'outcome', le.outcome, 'explanation', le.explanation,
        'created_at', le.created_at
      ) order by le.created_at desc)
      from public.learning_events le where le.tenant_id = v_tenant_id limit 15
    ), '[]'::jsonb)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Customer learning review center (read-only GET)
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_learning_center()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.customer_learning_settings;
  v_plan text;
  v_env text;
  v_limits jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  if not public.has_organization_permission('learning.view')
     and not public.has_organization_permission('learning.manage') then
    raise exception 'Permission denied: learning.view';
  end if;

  v_settings := public._cl_read_settings(v_tenant_id);
  v_limits := public.get_customer_license_limits(v_tenant_id);
  v_plan := coalesce(v_limits ->> 'plan', 'starter');

  select c.environment_type into v_env
  from public.customers c
  where c.id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'principle', 'Aipify learns WITH the customer — not FROM the customer. You remain in control.',
    'learning_mode', v_settings.learning_mode,
    'adaptive_consent', v_settings.adaptive_consent_at is not null,
    'adaptive_allowed', v_plan in ('business', 'enterprise') and v_env in ('pilot', 'enterprise', 'customer'),
    'recent_learnings', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', m.id, 'pattern_type', m.pattern_type, 'source_type', m.source_type,
        'approval_source', m.approval_source, 'confidence_level', m.confidence_level,
        'confidence_score', m.confidence_score, 'skill_key', m.skill_key,
        'explanation', m.explanation, 'status', m.status,
        'learned_at', m.learned_at, 'reviewed_at', m.reviewed_at
      ) order by m.learned_at desc)
      from public.customer_learning_memory m
      where m.tenant_id = v_tenant_id and m.status = 'active' limit 25),
      '[]'::jsonb
    ),
    'suggested_improvements', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ar.id, 'title', ar.title, 'description', ar.recommendation,
        'confidence_level', public._confidence_level_from_score(ar.confidence_score),
        'confidence_score', ar.confidence_score
      ) order by ar.confidence_score desc)
      from public.ai_recommendations ar
      where ar.tenant_id = v_tenant_id and ar.status = 'active' limit 5),
      '[]'::jsonb
    ),
    'approval_history', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', r.id, 'action_type', r.action_type, 'created_at', r.created_at
      ) order by r.created_at desc)
      from public.customer_learning_reviews r
      where r.tenant_id = v_tenant_id limit 20),
      '[]'::jsonb
    ),
    'governance', jsonb_build_object(
      'rollout_stage', case v_env
        when 'internal' then 'Aipify Internal'
        when 'pilot' then 'Unonight Pilot'
        else 'General Availability'
      end,
      'environment_type', v_env
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Business DNA center (read-only GET)
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_business_dna_center()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_profile public.business_dna_profiles;
  v_settings public.bde_settings;
  v_health jsonb;
  v_has_profile boolean := false;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  if not public.has_organization_permission('business_dna.view')
     and not public.has_organization_permission('business_dna.manage') then
    raise exception 'Permission denied: business_dna.view';
  end if;

  select exists (select 1 from public.business_dna_profiles where tenant_id = v_tenant_id) into v_has_profile;
  v_profile := public._bde_read_profile(v_tenant_id);
  v_settings := public._bde_read_settings(v_tenant_id);
  v_health := public.calculate_business_dna_health(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'onboarding_required', not v_has_profile,
    'profile', jsonb_build_object(
      'id', v_profile.id,
      'company_name', v_profile.company_name,
      'industry', v_profile.industry,
      'business_description', v_profile.business_description,
      'primary_language', v_profile.primary_language,
      'supported_languages', v_profile.supported_languages,
      'tone_of_voice', v_profile.tone_of_voice,
      'support_style', v_profile.support_style,
      'risk_level', v_profile.risk_level,
      'profile_status', coalesce(v_profile.profile_status, 'draft'),
      'approved_at', v_profile.approved_at
    ),
    'settings', jsonb_build_object(
      'human_review_mode', coalesce(v_settings.human_review_mode, true),
      'automation_enabled', coalesce(v_settings.automation_enabled, false),
      'high_confidence_auto_draft', coalesce(v_settings.high_confidence_auto_draft, false),
      'learn_from_approved_replies', coalesce(v_settings.learn_from_approved_replies, true),
      'import_support_history', coalesce(v_settings.import_support_history, false),
      'connected_systems', coalesce(v_settings.connected_systems, '[]'::jsonb),
      'email_channel_provider', v_settings.email_channel_provider,
      'email_channel_status', v_settings.email_channel_status,
      'fallback_language', v_settings.fallback_language,
      'privacy_settings', coalesce(v_settings.privacy_settings, '{}'::jsonb)
    ),
    'health', v_health,
    'products', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', p.id, 'name', p.name, 'description', p.description,
        'category', p.category, 'price', p.price, 'approved', p.approved
      ) order by p.name) from public.business_products p where p.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'workflows', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', w.id, 'name', w.name, 'description', w.description,
        'trigger_event', w.trigger_event, 'approval_required', w.approval_required,
        'risk_level', w.risk_level, 'approved', w.approved
      ) order by w.name) from public.business_workflows w where w.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'knowledge', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', k.id, 'category', k.category, 'question', k.question,
        'answer', k.answer, 'source', k.source, 'language', k.language, 'approved', k.approved
      ) order by k.category) from public.support_knowledge_items k where k.tenant_id = v_tenant_id limit 50),
      '[]'::jsonb
    ),
    'templates', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', t.id, 'template_name', t.template_name, 'category', t.category,
        'subject', t.subject, 'language', t.language, 'approved', t.approved
      ) order by t.category) from public.business_email_templates t where t.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'tone_profiles', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', tp.id, 'tone_name', tp.tone_name, 'description', tp.description,
        'example_phrases', tp.example_phrases, 'avoid_phrases', tp.avoid_phrases, 'approved', tp.approved
      )) from public.business_tone_profiles tp where tp.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'escalation_rules', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', e.id, 'rule_name', e.rule_name, 'condition', e.condition,
        'risk_level', e.risk_level, 'escalate_to', e.escalate_to, 'active', e.active
      ) order by e.risk_level desc) from public.business_escalation_rules e where e.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'knowledge_sources', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', s.id, 'source_type', s.source_type, 'source_label', s.source_label,
        'source_url', s.source_url, 'status', s.status, 'items_imported', s.items_imported
      ) order by s.created_at desc) from public.business_knowledge_sources s where s.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'template_suggestions', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ts.id, 'category', ts.category, 'suggested_name', ts.suggested_name,
        'subject', ts.subject, 'status', ts.status, 'source_note', ts.source_note
      ) order by ts.created_at desc) from public.business_template_suggestions ts
      where ts.tenant_id = v_tenant_id and ts.status = 'pending' limit 10),
      '[]'::jsonb
    ),
    'automation_readiness', jsonb_build_object(
      'profile_exists', v_has_profile,
      'human_review_default', coalesce(v_settings.human_review_mode, true)
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Governance settings (read-only GET)
-- ---------------------------------------------------------------------------
create or replace function public.get_governance_settings()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_governance_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false, 'has_access', false, 'upgrade_required', false);
  end if;

  if not public.has_organization_permission('governance.view')
     and not public.has_organization_permission('governance.manage') then
    raise exception 'Permission denied: governance.view';
  end if;

  v_settings := public._tacc_read_governance_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'has_access', public._tacc_package_allows(v_tenant_id),
    'upgrade_required', not public._tacc_package_allows(v_tenant_id),
    'settings', jsonb_build_object(
      'governance_mode', v_settings.governance_mode,
      'approval_defaults', v_settings.approval_defaults,
      'emergency_controls_enabled', v_settings.emergency_controls_enabled,
      'explainability_enabled', v_settings.explainability_enabled,
      'trust_scoring_enabled', v_settings.trust_scoring_enabled,
      'audit_retention_days', v_settings.audit_retention_days
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Payment providers + enterprise invoice billing (permission repair)
-- ---------------------------------------------------------------------------
create or replace function public.get_payment_providers_center(
  p_scope text default 'tenant',
  p_tenant_id uuid default null
)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_can_edit boolean := false;
  v_providers jsonb := '[]'::jsonb;
  v_provider text;
  v_audit jsonb := '[]'::jsonb;
begin
  if p_scope not in ('platform', 'tenant') then
    raise exception 'Invalid scope';
  end if;

  if p_scope = 'platform' then
    if not public.is_platform_admin() then
      raise exception 'Permission denied: payment_providers.view';
    end if;
    v_can_edit := true;
    v_tenant_id := null;
  else
    perform public._pp620_require_billing_view();
    v_tenant_id := coalesce(p_tenant_id, public._presence_tenant_for_auth());
    if v_tenant_id is null then
      raise exception 'Tenant required';
    end if;
    v_can_edit := public.has_organization_permission('payment_providers.manage')
      or public.has_organization_permission('billing.manage')
      or public.has_organization_permission('subscription.manage');
  end if;

  foreach v_provider in array array['klarna', 'vipps', 'stripe', 'dnb']
  loop
    v_providers := v_providers || jsonb_build_array(
      public._pp262_build_provider_card(p_scope, v_tenant_id, v_provider)
    );
  end loop;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'provider_key', a.provider_key, 'event_type', a.event_type,
    'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.payment_provider_audit_logs
    where scope = p_scope
      and ((p_scope = 'platform' and tenant_id is null) or (p_scope = 'tenant' and tenant_id = v_tenant_id))
    order by created_at desc limit 15
  ) a;

  return jsonb_build_object(
    'scope', p_scope,
    'tenant_id', v_tenant_id,
    'can_edit', v_can_edit,
    'principle', 'Aipify owns the billing experience. Customers choose the payment provider.',
    'paid_access_now', true,
    'providers', v_providers,
    'recent_audit', v_audit,
    'regional_strategy', jsonb_build_object(
      'norway', jsonb_build_array('vipps', 'dnb', 'klarna', 'stripe'),
      'nordics', jsonb_build_array('vipps', 'klarna', 'stripe'),
      'europe', jsonb_build_array('klarna', 'stripe'),
      'global', jsonb_build_array('stripe')
    )
  );
end; $$;

create or replace function public._ei264_require_view(p_tenant_id uuid default null)
returns uuid
language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  if public.is_platform_admin() then
    return coalesce(p_tenant_id, public._presence_tenant_for_auth());
  end if;

  perform public._pp620_require_billing_view();
  v_tenant_id := coalesce(p_tenant_id, public._presence_tenant_for_auth());
  if v_tenant_id is null then
    raise exception 'Tenant required';
  end if;
  return v_tenant_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Commercial model dashboard (read-only GET + canonical billing profile)
-- ---------------------------------------------------------------------------
create or replace function public.get_commercial_model_dashboard()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.commercial_model_settings;
  v_tier text;
  v_health jsonb;
  v_analytics jsonb;
  v_sub record;
  v_payment_method text := 'invoice';
begin
  v_tenant_id := public._bpc_require_tenant();

  if not public.has_organization_permission('commercial.view')
     and not public.has_organization_permission('commercial.manage')
     and not public.has_organization_permission('billing.view')
     and not public.has_organization_permission('billing.manage') then
    raise exception 'Permission denied: commercial.view';
  end if;

  v_settings := public._bpc_read_settings(v_tenant_id);
  v_tier := public._bpc_resolve_tier(v_tenant_id);
  v_health := public._bpc_calculate_health(v_tenant_id);
  v_analytics := public._bpc_commercial_analytics(v_tenant_id);

  select * into v_sub from public.subscriptions where customer_id = v_tenant_id limit 1;

  select coalesce(bp.payment_method, 'invoice') into v_payment_method
  from public.aipify_billing_profiles bp
  where bp.organization_id = v_tenant_id and bp.is_primary = true and bp.is_active = true
  limit 1;

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'philosophy', 'Flexible pricing for every stage of growth.',
    'safety_note', 'Customers should never pay for complexity they do not need. Clear upgrade and downgrade guidance always applies.',
    'self_service_enabled', v_settings.self_service_enabled,
    'trials_enabled', v_settings.trials_enabled,
    'partner_billing_enabled', v_settings.partner_billing_enabled,
    'global_billing_enabled', v_settings.global_billing_enabled,
    'downgrade_grace_days', v_settings.downgrade_grace_days,
    'customer_tier', v_tier,
    'customer_tier_label', public._bpc_tier_label(v_tier),
    'health_score', v_health->'health_score',
    'engagement_score', v_health->'engagement_score',
    'adoption_score', v_health->'adoption_score',
    'renewal_likelihood', v_health->'renewal_likelihood',
    'expansion_opportunity', v_health->'expansion_opportunity',
    'mrr', v_analytics->'mrr',
    'arr', v_analytics->'arr',
    'currency', coalesce(v_analytics->>'currency', v_settings.currency),
    'billing_cycle', v_analytics->'billing_cycle',
    'subscription_status', coalesce(v_sub.status, 'trialing'),
    'payment_method', v_payment_method,
    'packaging_layers', jsonb_build_array(
      jsonb_build_object('layer', 'core_platform', 'label', 'Core Platform'),
      jsonb_build_object('layer', 'business_pack', 'label', 'Business Packs'),
      jsonb_build_object('layer', 'addon_module', 'label', 'Add-On Modules'),
      jsonb_build_object('layer', 'enterprise_service', 'label', 'Enterprise Services')
    ),
    'customer_tiers', jsonb_build_array(
      jsonb_build_object('tier', 'starter', 'label', public._bpc_tier_label('starter')),
      jsonb_build_object('tier', 'professional', 'label', public._bpc_tier_label('professional')),
      jsonb_build_object('tier', 'business', 'label', public._bpc_tier_label('business')),
      jsonb_build_object('tier', 'enterprise', 'label', public._bpc_tier_label('enterprise')),
      jsonb_build_object('tier', 'enterprise_plus', 'label', public._bpc_tier_label('enterprise_plus'))
    ),
    'subscription_models', jsonb_build_array(
      'Monthly Subscription', 'Annual Subscription', 'Multi-Year Agreements',
      'Enterprise Licensing', 'Usage-Based Components', 'Hybrid Billing Models'
    ),
    'business_packs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'pack_key', p.pack_key, 'title', p.title, 'description', p.description,
        'pack_layer', p.pack_layer, 'status', p.status, 'monthly_price', p.monthly_price
      ) order by case p.pack_layer when 'core_platform' then 1 when 'business_pack' then 2 else 3 end)
      from public.commercial_business_packs p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'addon_modules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'addon_key', a.addon_key, 'title', a.title, 'description', a.description,
        'status', a.status, 'monthly_price', a.monthly_price
      ))
      from public.commercial_addon_entitlements a where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'enterprise_services', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'service_key', s.service_key, 'title', s.title, 'description', s.description, 'status', s.status
      ))
      from public.commercial_enterprise_services s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'usage_metrics', coalesce((
      select jsonb_build_object(
        'users', v_sub.max_users,
        'installations', v_sub.max_installations,
        'ai_interactions', um.ai_usage_volume,
        'api_calls', um.api_calls,
        'knowledge_searches', um.knowledge_searches,
        'workflow_executions', um.employee_interactions,
        'storage_mb', um.storage_mb
      )
      from public.tenant_usage_metrics um
      where um.tenant_id = v_tenant_id
      order by um.period_month desc limit 1
    ), jsonb_build_object('users', v_sub.max_users, 'installations', v_sub.max_installations)),
    'invoices', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'invoice_number', i.invoice_number, 'status', i.status,
        'amount', i.amount, 'currency', i.currency, 'due_date', i.due_date, 'issued_at', i.issued_at
      ) order by i.issued_at desc)
      from public.invoices i where i.customer_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'renewal_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'event_type', r.event_type, 'title', r.title,
        'description', r.description, 'due_at', r.due_at, 'status', r.status
      ) order by r.due_at asc)
      from public.commercial_renewal_events r where r.tenant_id = v_tenant_id and r.status = 'scheduled'
    ), '[]'::jsonb),
    'partner_commissions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'partner_name', c.partner_name, 'commission_type', c.commission_type,
        'amount', c.amount, 'currency', c.currency, 'status', c.status
      ))
      from public.commercial_partner_commissions c where c.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'commercial_analytics', v_analytics || jsonb_build_object(
      'churn_trend_pct', 2.1,
      'expansion_revenue_pct', 18.5,
      'customer_lifetime_value', round((v_analytics->>'arr')::numeric * 3, 2)
    ),
    'downgrade_controls', jsonb_build_array(
      'Advance warnings before downgrade',
      'Feature impact explanations',
      jsonb_build_object('grace_period_days', v_settings.downgrade_grace_days),
      'Data retention guidance'
    ),
    'trial_framework', jsonb_build_array(
      'Time-based trials', 'Feature-limited trials',
      'Guided onboarding trials', 'Partner-sponsored trials'
    ),
    'pricing_governance', jsonb_build_array(
      'Transparent communication', '30-day notice periods',
      'Historical pricing tracking', 'Impact assessments'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.commercial_model_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'commercial_packages', 'Phase 42 module licensing',
      'subscriptions', 'Core subscription and billing',
      'partner_certification', 'Partner commissions and co-selling',
      'enterprise_deployment', 'Enterprise procurement support',
      'knowledge_center', 'Billing & Commercial Information'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Quality settings (read-only GET + entitlement gate)
-- ---------------------------------------------------------------------------
create or replace function public.get_quality_settings()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_row public.aipify_quality_settings;
  v_ent jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_ent := public._qg_entitlement_state(v_tenant_id);
  if not coalesce((v_ent->>'has_entitlement')::boolean, false) then
    return jsonb_build_object(
      'has_customer', true,
      'has_access', false,
      'access_state', v_ent->>'access_state',
      'upgrade_required', true,
      'plan', v_ent->>'plan',
      'message', 'Quality Guardian is available on Business and Enterprise plans, or with an active Quality Guardian Business Pack.'
    );
  end if;

  if not public.has_organization_permission('quality.view')
     and not public.has_organization_permission('quality.manage') then
    raise exception 'Permission denied: quality.view';
  end if;

  v_row := public._qg_read_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'has_access', true,
    'access_state', 'ready',
    'upgrade_required', false,
    'observation_mode', v_row.observation_mode,
    'auto_fix_enabled', v_row.auto_fix_enabled,
    'notify_developers', v_row.notify_developers,
    'create_admin_tasks', v_row.create_admin_tasks,
    'open_knowledge_gaps', v_row.open_knowledge_gaps,
    'scan_interval_hours', v_row.scan_interval_hours,
    'enabled_scanners', v_row.enabled_scanners
  );
end; $$;

grant execute on function public._lrn_read_settings(uuid) to authenticated;
grant execute on function public._cl_read_settings(uuid) to authenticated;
grant execute on function public._bde_read_profile(uuid) to authenticated;
grant execute on function public._bde_read_settings(uuid) to authenticated;
grant execute on function public._tacc_read_governance_settings(uuid) to authenticated;
grant execute on function public._bpc_read_settings(uuid) to authenticated;
grant execute on function public._qg_read_settings(uuid) to authenticated;
grant execute on function public._qg_entitlement_state(uuid) to authenticated;
grant execute on function public._pp620_require_billing_view() to authenticated;
