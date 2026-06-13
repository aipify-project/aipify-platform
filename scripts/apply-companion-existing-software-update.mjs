#!/usr/bin/env node
/** Cursor Update — Aipify as Companion for Existing Software */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

const MIGRATION = `-- Cursor Update — Aipify as Companion for Existing Software
-- Extends Desktop Companion Phase 236 blueprint (_adccbebp236_*)

create or replace function public._adccbebp236_distinction_note() returns text language sql immutable as $$
  select 'ABOS — Desktop Companion for existing software. Do not reinvent the wheel — Aipify orchestrates, guides and assists Canva, Adobe, Microsoft Office, Figma and similar tools when the user grants permission. Bridge Companion supports — NOT replacing professional tools, silent third-party control, or bypassing session consent.';
$$;

create or replace function public._adccbebp236_mission() returns text language sql immutable as $$
  select 'Aipify is not competing with Canva, Adobe or Microsoft — Aipify helps users succeed with tools they already own. Bridge Companion orchestrates, guides and assists existing software when permission is granted — humans decide.';
$$;

create or replace function public._adccbebp236_vision() returns text language sql immutable as $$
  select 'Aipify makes existing software easier to use — the customer already pays for powerful tools; Aipify helps them actually benefit. Aipify works for you.';
$$;

create or replace function public._adccbebp236_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Companion for existing software. Guide, translator, workflow assistant, creative helper, productivity companion — never a replacement for Canva, Adobe, Microsoft Office or Figma.';
$$;

create or replace function public._adccbebp236_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Desktop Companion programs', 'emoji', '✅', 'description', 'Ten modules — companion for existing software'),
    jsonb_build_object('key', 'existing_software', 'label', 'Companion for existing software', 'emoji', '🔗', 'description', 'Do not reinvent the wheel — orchestrate approved tools'),
    jsonb_build_object('key', 'consent_dialog', 'label', 'Consent dialog — Allow once, Aipify Studio, Decline', 'emoji', '🛡️', 'description', 'Always ask permission — never silent control'),
    jsonb_build_object('key', 'tool_categories', 'label', 'Creative, productivity, marketing tools', 'emoji', '🧰', 'description', 'Canva, Adobe, Office, Figma, Google Workspace, and more'),
    jsonb_build_object('key', 'companion', 'label', 'Bridge Companion', 'emoji', '✨', 'description', 'Guide — does not replace professional tools'),
    jsonb_build_object('key', 'enterprise_admin', 'label', 'Enterprise admin controls', 'emoji', '👔', 'description', 'Super Admin and Tenant Admin application policies'),
    jsonb_build_object('key', 'business_transparency', 'label', 'Partner and BYOL transparency', 'emoji', '📋', 'description', 'Your own subscription — no hidden billing')
  );
$$;

create or replace function public._adccbebp236_desktop_companion_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Desktop Companion — companion for existing software. Do not reinvent the wheel.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'desktop_companion_dashboard', 'label', 'Desktop Companion Dashboard — approved applications requiring attention'),
    jsonb_build_object('key', 'application_detection_hub', 'label', 'Detect Approved Installed & Connected Web Applications'),
    jsonb_build_object('key', 'user_consent', 'label', 'Explicit Consent — Allow Once, Always Allow, Use Aipify Studio, Decline'),
    jsonb_build_object('key', 'prepare_before_open', 'label', 'Prepare Content Before Opening External Tools'),
    jsonb_build_object('key', 'guided_workflows', 'label', 'Guide Users Through Approved Tool Workflows'),
    jsonb_build_object('key', 'approved_actions_only', 'label', 'Perform Only Approved Actions — session-based'),
    jsonb_build_object('key', 'return_assets', 'label', 'Return Final Assets to Aipify When Possible'),
    jsonb_build_object('key', 'creative_bridge', 'label', 'Creative Bridge — Canva, Adobe, Figma, Blender, DaVinci Resolve'),
    jsonb_build_object('key', 'productivity_bridge', 'label', 'Productivity Bridge — Microsoft Office, Google Workspace, Outlook, Teams'),
    jsonb_build_object('key', 'audit_governance', 'label', 'Audit History, Emergency Revoke & Organization Policies')
  ));
$$;

create or replace function public._adccbebp236_application_detection_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Application detection — installed apps and connected web apps with transparency.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'approved_app', 'label', 'Is this an organization-approved application?'),
    jsonb_build_object('key', 'user_consent', 'label', 'Has the user granted explicit consent for this task?'),
    jsonb_build_object('key', 'access_explained', 'label', 'Has Aipify explained what access is needed?'),
    jsonb_build_object('key', 'decline_respected', 'label', 'Can the user decline and continue with Aipify Studio or built-in capabilities?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance prevent silent third-party control?')
  ));
$$;

create or replace function public._adccbebp236_consent_session_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Consent and session — always ask permission.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'allow_once', 'label', 'Allow Once — assist only for the current task'),
    jsonb_build_object('key', 'always_allow', 'label', 'Always Allow — under organization policy with explicit approval'),
    jsonb_build_object('key', 'use_aipify_studio', 'label', 'Use Aipify Studio — built-in capabilities without external tool access'),
    jsonb_build_object('key', 'decline', 'label', 'Decline — Aipify continues with built-in capabilities only'),
    jsonb_build_object('key', 'session_expiration', 'label', 'Session-based access must expire'),
    jsonb_build_object('key', 'emergency_revoke', 'label', 'Emergency revoke must be available'),
    jsonb_build_object('key', 'organization_policy', 'label', 'Organization access controlled through enterprise policies'),
    jsonb_build_object('key', 'no_silent_control', 'label', 'Never silently control third-party tools'),
    jsonb_build_object('key', 'user_final_control', 'label', 'Users retain final control — always allow decline')
  ));
$$;

create or replace function public._adccbebp236_bridge_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Bridge Companion — guide, translator, workflow assistant — never replaces Canva, Adobe or Microsoft.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'guide', 'label', 'Guide — bridge between user and their tools'),
    jsonb_build_object('key', 'translator', 'label', 'Translator — help users understand workflows'),
    jsonb_build_object('key', 'workflow_assistant', 'label', 'Workflow assistant — orchestrate approved steps'),
    jsonb_build_object('key', 'creative_helper', 'label', 'Creative helper — Canva, Adobe, Figma assistance'),
    jsonb_build_object('key', 'productivity_companion', 'label', 'Productivity companion — Office and Google Workspace'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Permission-based app access — Trust Architecture enforced')
  ));
$$;

create or replace function public._adccbebp236_guided_actions_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Guided actions — prepare, open, guide, return — user retains control.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'detect_apps', 'label', 'Detect approved installed and web applications'),
    jsonb_build_object('key', 'ask_consent', 'label', 'Ask for explicit user consent before any access'),
    jsonb_build_object('key', 'prepare_content', 'label', 'Prepare content before opening the selected tool'),
    jsonb_build_object('key', 'open_tool', 'label', 'Open the selected tool after consent'),
    jsonb_build_object('key', 'guide_process', 'label', 'Guide the user through the process in the tool'),
    jsonb_build_object('key', 'approved_actions', 'label', 'Perform only approved actions'),
    jsonb_build_object('key', 'return_assets', 'label', 'Return final assets back to Aipify when possible')
  ));
$$;

create or replace function public._adccbebp236_creative_apps_bridge_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Creative bridge — assist in tools users already own.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'canva', 'label', 'Canva — social posts, brochures, ads, presentations, brand assets'),
    jsonb_build_object('key', 'photoshop', 'label', 'Photoshop — edit photos, remove backgrounds, export assets'),
    jsonb_build_object('key', 'illustrator', 'label', 'Illustrator — professional graphics, print-ready files'),
    jsonb_build_object('key', 'lightroom', 'label', 'Lightroom — photo enhancement and batch processing'),
    jsonb_build_object('key', 'indesign', 'label', 'InDesign — print-ready layouts'),
    jsonb_build_object('key', 'figma_blender', 'label', 'Figma, Blender, DaVinci Resolve — governed assistance'),
    jsonb_build_object('key', 'consent_required', 'label', 'Every session requires explicit approval — never silent control')
  ));
$$;

create or replace function public._adccbebp236_business_apps_bridge_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Productivity bridge — Microsoft Office and Google Workspace.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'word', 'label', 'Word — reports, formatting, proposals, rewrite text'),
    jsonb_build_object('key', 'excel', 'label', 'Excel — governed spreadsheet assistance'),
    jsonb_build_object('key', 'powerpoint', 'label', 'PowerPoint — slide decks, layout, brand styling, executive presentations'),
    jsonb_build_object('key', 'google_docs', 'label', 'Google Docs, Sheets, Slides — governed assistance'),
    jsonb_build_object('key', 'outlook_teams', 'label', 'Outlook and Teams — governed communication assistance'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Session audit visibility respects role permissions')
  ));
$$;

create or replace function public._adccbebp236_desktop_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Enterprise admin controls — organizations govern third-party assistance.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'super_admin_apps', 'label', 'Super Admin — approve allowed applications, disable assistance, provider policies'),
    jsonb_build_object('key', 'tenant_admin_tools', 'label', 'Tenant Admin — organization tool access, department approvals, BYOL settings'),
    jsonb_build_object('key', 'employee_consent', 'label', 'Employees — task-level permission, revoke access, Studio vs external tools'),
    jsonb_build_object('key', 'disable_assistance', 'label', 'Disable third-party tool assistance entirely'),
    jsonb_build_object('key', 'audit_history', 'label', 'Complete audit history — immutable log'),
    jsonb_build_object('key', 'emergency_revoke', 'label', 'Emergency revoke must be available')
  ));
$$;

create or replace function public._adccbebp236_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array(
      'Replacing Canva, Adobe, Microsoft Office, Figma or similar professional tools',
      'Silent third-party tool control',
      'Accessing applications without permission',
      'Unauthorized file access',
      'Bypassing session consent',
      'Skipping session audit logging',
      'Hidden billing or misleading subscriptions',
      'Override human judgment'), 'principle', 'Bridge Companion orchestrates existing software — users retain final control and professional tools remain primary.');
$$;

create or replace function public._adccbebp236_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Desktop Companion internally as companion for existing software — never replacing Canva, Adobe or Microsoft. Growth Partner terminology. Always ask permission; always allow decline or Aipify Studio.';
$$;

create or replace function public._adccbebp236_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Do not reinvent the wheel — orchestrate tools users already own.',
    'Aipify is not competing with Canva, Adobe or Microsoft.',
    'Guide, translator, workflow assistant, creative helper, productivity companion.',
    'Always ask permission — always explain access — always allow decline.',
    'Growth Partner — never Affiliate.');
$$;

create or replace function public._adccbebp236_existing_software_positioning() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Core principle — do not reinvent the wheel.',
    'core_principle', 'Aipify orchestrates, guides and assists existing software when the user grants permission.',
    'positioning', jsonb_build_array(
      jsonb_build_object('key', 'not_competing', 'label', 'Aipify is not competing with Canva, Adobe or Microsoft'),
      jsonb_build_object('key', 'bridge', 'label', 'Aipify acts as the bridge between the user and the tool'),
      jsonb_build_object('key', 'user_problem', 'label', 'Users pay for powerful tools but need help using them effectively'),
      jsonb_build_object('key', 'strategic_value', 'label', 'Make existing software easier to use — Aipify works for you')
    ),
    'companion_roles', jsonb_build_array('Guide', 'Translator', 'Workflow assistant', 'Creative helper', 'Productivity companion')
  );
$$;

create or replace function public._adccbebp236_supported_tool_categories() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Supported tool categories — assist, never replace.', 'categories', jsonb_build_array(
    jsonb_build_object('key', 'creative', 'label', 'Creative — Canva, Photoshop, Illustrator, Lightroom, InDesign, Figma, Blender'),
    jsonb_build_object('key', 'productivity', 'label', 'Productivity — Word, Excel, PowerPoint, Outlook, Teams, Google Docs, Sheets, Slides'),
    jsonb_build_object('key', 'marketing', 'label', 'Marketing — Canva, Meta Business Suite, Mailchimp, Shopify, WordPress'),
    jsonb_build_object('key', 'video', 'label', 'Video — DaVinci Resolve and governed creative tools')
  ));
$$;

create or replace function public._adccbebp236_consent_dialog_example() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Example consent dialog — always ask, always explain, always allow decline.',
    'user_request', 'Aipify, help me create a Facebook campaign in Canva.',
    'companion_response', 'I can help you with that. I see Canva is available. Do you want to give me temporary access to assist you in Canva?',
    'actions', jsonb_build_array(
      jsonb_build_object('key', 'allow_once', 'label', 'Allow once'),
      jsonb_build_object('key', 'use_aipify_studio', 'label', 'Use Aipify Studio'),
      jsonb_build_object('key', 'decline', 'label', 'Decline')
    )
  );
$$;

create or replace function public._adccbebp236_business_model_transparency() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Transparent partner promotion — no hidden billing.', 'disclosures', jsonb_build_array(
    jsonb_build_object('key', 'own_subscription', 'label', 'This uses your own subscription'),
    jsonb_build_object('key', 'connected_account', 'label', 'This requires a connected account'),
    jsonb_build_object('key', 'provider_charges', 'label', 'This provider may charge separately'),
    jsonb_build_object('key', 'partner_links', 'label', 'Official partner links only when partner programs exist'),
    jsonb_build_object('key', 'no_hidden_billing', 'label', 'No hidden billing or misleading subscriptions')
  ), 'partner_examples', jsonb_build_array('Canva Pro', 'Adobe Creative Cloud', 'Figma', 'Microsoft 365'));
$$;

create or replace function public._adccbebp236_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Desktop Companion — ten capabilities', 'met', jsonb_array_length(public._adccbebp236_desktop_companion_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Application detection hub — five reflection questions', 'met', jsonb_array_length(public._adccbebp236_application_detection_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Consent engine domains documented', 'met', jsonb_array_length(public._adccbebp236_consent_session_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Bridge Companion capabilities', 'met', jsonb_array_length(public._adccbebp236_bridge_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'positioning', 'label', 'Existing software positioning documented', 'met', jsonb_array_length(public._adccbebp236_existing_software_positioning()->'positioning') >= 4, 'note', null),
    jsonb_build_object('key', 'tool_categories', 'label', 'Supported tool categories documented', 'met', jsonb_array_length(public._adccbebp236_supported_tool_categories()->'categories') >= 3, 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._adccbebp236_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 234–238 documented', 'met', jsonb_array_length(public._adccbebp236_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'privacy', 'label', 'Privacy note present', 'met', char_length(public._adccbebp236_privacy_note()) > 20, 'note', null)
  );
end; $$;

create or replace function public._adccbebp236_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 236 — Enterprise Desktop Companion Engine', 'title', 'Enterprise Desktop Companion Engine (Desktop Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE236_AIPIFY_DESKTOP_COMPANION_CREATIVE_BRIDGE_ENGINE.md', 'engine_phase', 'Repo Phase 236', 'route', '/app/aipify-desktop-companion-creative-bridge-engine',
    'positioning_doc', 'AIPIFY_COMPANION_FOR_EXISTING_SOFTWARE.md'),
    'distinction_note', public._adccbebp236_distinction_note(), 'mission', public._adccbebp236_mission(), 'philosophy', public._adccbebp236_philosophy(),
    'abos_principle', public._adccbebp236_abos_principle(), 'vision', public._adccbebp236_vision(), 'objectives', public._adccbebp236_objectives(),
    'desktop_companion_dashboard', public._adccbebp236_desktop_companion_dashboard(), 'application_detection_hub', public._adccbebp236_application_detection_hub(),
    'consent_session_engine', public._adccbebp236_consent_session_engine(), 'desktop_governance_dashboard', public._adccbebp236_desktop_governance_dashboard(),
    'bridge_companion', public._adccbebp236_bridge_companion(), 'guided_actions_engine', public._adccbebp236_guided_actions_engine(),
    'creative_apps_bridge_engine', public._adccbebp236_creative_apps_bridge_engine(), 'business_apps_bridge_engine', public._adccbebp236_business_apps_bridge_engine(),
    'session_audit_engine', public._adccbebp236_session_audit_engine(),
    'existing_software_positioning', public._adccbebp236_existing_software_positioning(),
    'supported_tool_categories', public._adccbebp236_supported_tool_categories(),
    'consent_dialog_example', public._adccbebp236_consent_dialog_example(),
    'business_model_transparency', public._adccbebp236_business_model_transparency(),
    'companion_limitations', public._adccbebp236_companion_limitations(), 'self_love_connection', public._adccbebp236_self_love_connection(),
    'security_requirements', public._adccbebp236_security_requirements(), 'era_opener_summary', public._adccbebp236_era_opener_summary(),
    'integration_links', public._adccbebp236_integration_links(), 'dogfooding', public._adccbebp236_dogfooding(),
    'success_criteria', public._adccbebp236_success_criteria(p_org_id), 'engagement_summary', public._adccbebp236_engagement_summary(p_org_id),
    'vision_phrases', public._adccbebp236_vision_phrases(), 'privacy_note', public._adccbebp236_privacy_note()
  );
$$;

create or replace function public.get_aipify_desktop_companion_creative_bridge_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_desktop_companion_creative_bridge_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._adccbe_require_tenant()); v_settings := public._adccbe_ensure_settings(v_tenant_id);
  perform public._adccbe_seed_reflections(v_tenant_id); perform public._adccbe_seed_desktop_companion_creative_bridge_notes(v_tenant_id); v_metrics := public._adccbe_refresh_metrics(v_tenant_id);
  perform public._adccbe_log_audit(v_tenant_id, 'dashboard_view', 'Desktop Companion dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_desktop_companion_creative_bridge_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'desktop_companion_mode', v_settings.desktop_companion_mode, 'desktop_companion_maturity_level', v_settings.desktop_companion_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._adccbebp236_philosophy(),
    'safety_note', 'Desktop Companion — companion for existing software. Bridge Companion supports — never replaces Canva, Adobe, Microsoft Office or Figma.',
    'distinction_note', public._adccbebp236_distinction_note(), 'aipify_desktop_companion_creative_bridge_score', v_metrics->'aipify_desktop_companion_creative_bridge_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'desktop_companion_creative_bridge_notes_count', v_metrics->'desktop_companion_creative_bridge_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_desktop_companion_creative_bridge_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_desktop_companion_creative_bridge_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._adccbebp236_integration_links(), 'era_opener_summary', public._adccbebp236_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 236 — Enterprise Desktop Companion Engine', 'title', 'Enterprise Desktop Companion Engine (Desktop Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE236_AIPIFY_DESKTOP_COMPANION_CREATIVE_BRIDGE_ENGINE.md', 'route', '/app/aipify-desktop-companion-creative-bridge-engine', 'positioning_doc', 'AIPIFY_COMPANION_FOR_EXISTING_SOFTWARE.md'),
    'aipify_desktop_companion_creative_bridge_blueprint', public._adccbebp236_blueprint_block(v_tenant_id), 'aipify_desktop_companion_creative_bridge_mission', public._adccbebp236_mission(), 'aipify_desktop_companion_creative_bridge_philosophy', public._adccbebp236_philosophy(),
    'aipify_desktop_companion_creative_bridge_abos_principle', public._adccbebp236_abos_principle(), 'aipify_desktop_companion_creative_bridge_objectives', public._adccbebp236_objectives(),
    'center_meta', public._adccbebp236_desktop_companion_dashboard(), 'engine_meta', public._adccbebp236_application_detection_hub(), 'framework_meta', public._adccbebp236_consent_session_engine(),
    'executive_reviews_meta', public._adccbebp236_desktop_governance_dashboard(), 'companion_meta', public._adccbebp236_bridge_companion(), 'sub_engine_meta', public._adccbebp236_guided_actions_engine(),
    'creative_apps_bridge_meta', public._adccbebp236_creative_apps_bridge_engine(), 'business_apps_bridge_meta', public._adccbebp236_business_apps_bridge_engine(), 'session_audit_engine_meta', public._adccbebp236_session_audit_engine(),
    'existing_software_positioning_meta', public._adccbebp236_existing_software_positioning(), 'supported_tool_categories_meta', public._adccbebp236_supported_tool_categories(),
    'consent_dialog_example_meta', public._adccbebp236_consent_dialog_example(), 'business_model_transparency_meta', public._adccbebp236_business_model_transparency(),
    'companion_limitations_meta', public._adccbebp236_companion_limitations(), 'self_love_connection_meta', public._adccbebp236_self_love_connection(),
    'security_requirements_meta', public._adccbebp236_security_requirements(), 'adccbebp236_integration_links', public._adccbebp236_integration_links(),
    'adccbebp236_era_opener_summary', public._adccbebp236_era_opener_summary(), 'aipify_desktop_companion_creative_bridge_engagement_summary', public._adccbebp236_engagement_summary(v_tenant_id),
    'aipify_desktop_companion_creative_bridge_success_criteria', public._adccbebp236_success_criteria(v_tenant_id), 'aipify_desktop_companion_creative_bridge_vision', public._adccbebp236_vision(), 'aipify_desktop_companion_creative_bridge_vision_phrases', public._adccbebp236_vision_phrases(),
    'aipify_desktop_companion_creative_bridge_privacy_note', public._adccbebp236_privacy_note(), 'aipify_desktop_companion_creative_bridge_dogfooding', public._adccbebp236_dogfooding(),
    'aipify_desktop_companion_creative_bridge_engine_note', 'Desktop Companion — companion for existing software. Do not reinvent the wheel. RBAC-protected; cross-link only for Aipify Studio Phase 229, Document Intelligence Phase 230, Executive Cockpit Phase 200, Knowledge Center, Enterprise Notification Engine Phase 233, and Trust Center.');
end; $$;
`;

write(
  path.join(ROOT, "supabase/migrations/20261401000000_aipify_companion_existing_software_positioning.sql"),
  MIGRATION,
);

write(
  path.join(ROOT, "AIPIFY_COMPANION_FOR_EXISTING_SOFTWARE.md"),
  `# Aipify as Companion for Existing Software

## Core principle

**Do not reinvent the wheel.**

Aipify orchestrates, guides and assists existing software when the user grants permission.

## Positioning

Aipify is **not** competing with Canva, Adobe or Microsoft.

Aipify helps users succeed with tools they already own — guide, translator, workflow assistant, creative helper, productivity companion.

## User experience

User: *"Aipify, help me create a Facebook campaign in Canva."*

Aipify asks for explicit consent with **Allow once**, **Use Aipify Studio**, or **Decline**.

## Permission modes

| Mode | Behavior |
|------|----------|
| Allow once | Assist only for the current task |
| Always allow | Assist under organization policy with explicit approval |
| Use Aipify Studio | Built-in capabilities without external tool access |
| Decline | Built-in Aipify capabilities only |

## Supported categories

- **Creative:** Canva, Adobe Photoshop/Illustrator/Lightroom/InDesign, Figma, Blender, DaVinci Resolve
- **Productivity:** Microsoft Word/Excel/PowerPoint, Outlook, Teams, Google Docs/Sheets/Slides
- **Marketing:** Canva, Meta Business Suite, Mailchimp, Shopify, WordPress

## Enterprise controls

Super Admin: approve applications, disable assistance, provider policies, audit logs.

Tenant Admin: organization tool access, department approvals, BYOL settings.

Employees: task-level permission, revoke access, Studio vs external tools.

## Security

Permission-based access · no silent desktop control · no unauthorized file access · session expiration · emergency revoke · audit logging.

## Business model transparency

- This uses your own subscription
- This requires a connected account
- This provider may charge separately
- Official partner links only — no hidden billing

## Implementation

- Desktop Companion: \`/app/aipify-desktop-companion-creative-bridge-engine\`
- Blueprint helpers: \`_adccbebp236_*\`
- ILM: \`companion-for-existing-software.txt\`
- Constants: \`lib/companion/existing-software.ts\`
`,
);

write(
  path.join(ROOT, "docs/cursor/AIPIFY-COMPANION-FOR-EXISTING-SOFTWARE.txt"),
  `AIPIFY CURSOR UPDATE — Companion for Existing Software

CORE PRINCIPLE: Do not reinvent the wheel.

Aipify orchestrates, guides and assists Canva, Adobe, Microsoft Office, Figma and similar tools when the user grants permission.

POSITIONING: Aipify is NOT competing with professional tools. Aipify helps users succeed with tools they already own.

CONSENT: Always ask permission. Always explain access. Always allow Decline or Use Aipify Studio.

PERMISSION MODES: Allow once · Always allow · Use Aipify Studio · Decline

NEVER: Silent third-party control · Unauthorized file access · Replacing Canva/Adobe/Microsoft

DESKTOP COMPANION: Detect apps · Ask consent · Prepare content · Open tool · Guide process · Return assets

See AIPIFY_COMPANION_FOR_EXISTING_SOFTWARE.md
`,
);

write(
  path.join(ROOT, ".cursor/rules/companion-existing-software.mdc"),
  `---
description: Aipify as companion for existing software — do not reinvent the wheel
alwaysApply: true
---

# Companion for Existing Software

See [AIPIFY_COMPANION_FOR_EXISTING_SOFTWARE.md](../../AIPIFY_COMPANION_FOR_EXISTING_SOFTWARE.md).

## Rules

1. **Do not reinvent the wheel** — Aipify orchestrates existing tools; never replaces Canva, Adobe, Microsoft Office, Figma or similar platforms.
2. Desktop Companion (Phase 236) detects approved apps, asks explicit consent, prepares content, guides workflows, performs approved actions only.
3. Permission modes: **Allow once**, **Always allow**, **Use Aipify Studio**, **Decline** — user may always decline.
4. Never silently control third-party tools; never unauthorized file access; session access must expire; emergency revoke required.
5. Enterprise: Super Admin approves apps and provider policies; Tenant Admin configures org tool access; employees grant task-level permission.
6. Business transparency: user's own subscription, connected account may be required, provider may charge separately — no hidden billing.
7. ILM: \`companion-for-existing-software.txt\` and \`lib/companion/existing-software.ts\`.
8. Aipify roles: guide, translator, workflow assistant, creative helper, productivity companion — not competitor.
`,
);

write(
  path.join(ROOT, "aipify-core/knowledge/internal-language-model/companion-for-existing-software.txt"),
  `Aipify as Companion for Existing Software

Core principle: Do not reinvent the wheel.
Aipify orchestrates, guides and assists existing software when the user grants permission.

Positioning: Aipify is NOT competing with Canva, Adobe or Microsoft.
Aipify helps users succeed with tools they already own.

Companion roles: Guide · Translator · Workflow assistant · Creative helper · Productivity companion

User example:
User: "Aipify, help me create a Facebook campaign in Canva."
Aipify: "I can help you with that. I see Canva is available. Do you want to give me temporary access to assist you in Canva?"
Actions: Allow once · Use Aipify Studio · Decline

Permission modes:
- Allow once: current task only
- Always allow: under organization policy
- Use Aipify Studio: built-in capabilities without external access
- Decline: built-in Aipify capabilities only

Creative tools: Canva, Photoshop, Illustrator, Lightroom, InDesign, Figma, Blender, DaVinci Resolve
Productivity: Word, Excel, PowerPoint, Outlook, Teams, Google Docs, Sheets, Slides
Marketing: Canva, Meta Business Suite, Mailchimp, Shopify, WordPress

Desktop Companion flow: detect apps · ask consent · prepare content · open tool · guide · approved actions only · return assets when possible

Never: silent control · unauthorized file access · replacing professional tools · hidden billing

Business transparency: your own subscription · connected account required · provider may charge separately · official partner links only

Enterprise: Super Admin approves apps; Tenant Admin org tool access; employees task-level consent and revoke.

Aipify works for you. People First. Growth Partner — never Affiliate.
`,
);

write(
  path.join(ROOT, "lib/companion/existing-software.ts"),
  `/** Companion for existing software — positioning constants and intent detection */

export const COMPANION_EXISTING_SOFTWARE_CORE_PRINCIPLE =
  "Do not reinvent the wheel — Aipify orchestrates, guides and assists existing software when the user grants permission.";

export const COMPANION_EXISTING_SOFTWARE_POSITIONING =
  "Aipify is not competing with Canva, Adobe or Microsoft — Aipify helps users succeed with tools they already own.";

export const COMPANION_ROLES = [
  "Guide",
  "Translator",
  "Workflow assistant",
  "Creative helper",
  "Productivity companion",
] as const;

export type CompanionPermissionMode = "allow_once" | "always_allow" | "use_aipify_studio" | "decline";

export const COMPANION_PERMISSION_MODES: ReadonlyArray<{
  key: CompanionPermissionMode;
  label: string;
  description: string;
}> = [
  {
    key: "allow_once",
    label: "Allow once",
    description: "Aipify may assist only for the current task.",
  },
  {
    key: "always_allow",
    label: "Always allow",
    description: "Aipify may assist with this approved application under organization policy.",
  },
  {
    key: "use_aipify_studio",
    label: "Use Aipify Studio",
    description: "Continue with built-in Aipify Studio capabilities without external tool access.",
  },
  {
    key: "decline",
    label: "Decline",
    description: "Aipify continues using built-in capabilities only.",
  },
];

export const SUPPORTED_TOOL_CATEGORIES = {
  creative: [
    "Canva",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Adobe Lightroom",
    "Adobe InDesign",
    "Figma",
    "Blender",
    "DaVinci Resolve",
  ],
  productivity: [
    "Microsoft Word",
    "Microsoft Excel",
    "Microsoft PowerPoint",
    "Outlook",
    "Teams",
    "Google Docs",
    "Google Sheets",
    "Google Slides",
  ],
  marketing: ["Canva", "Meta Business Suite", "Mailchimp", "Shopify", "WordPress"],
} as const;

export const BUSINESS_MODEL_DISCLOSURES = [
  "This uses your own subscription.",
  "This requires a connected account.",
  "This provider may charge separately.",
] as const;

export type ExistingSoftwareAssistIntent = {
  matched: boolean;
  tool?: string;
  category?: keyof typeof SUPPORTED_TOOL_CATEGORIES;
  taskHint?: string;
};

const TOOL_PATTERNS: Array<{ pattern: RegExp; tool: string; category: keyof typeof SUPPORTED_TOOL_CATEGORIES }> = [
  { pattern: /\\bcanva\\b/i, tool: "Canva", category: "creative" },
  { pattern: /\\bphotoshop\\b/i, tool: "Adobe Photoshop", category: "creative" },
  { pattern: /\\billustrator\\b/i, tool: "Adobe Illustrator", category: "creative" },
  { pattern: /\\blightroom\\b/i, tool: "Adobe Lightroom", category: "creative" },
  { pattern: /\\bfigma\\b/i, tool: "Figma", category: "creative" },
  { pattern: /\\bpower\\s*point\\b|\\bpowerpoint\\b/i, tool: "Microsoft PowerPoint", category: "productivity" },
  { pattern: /\\bword\\b/i, tool: "Microsoft Word", category: "productivity" },
  { pattern: /\\bexcel\\b/i, tool: "Microsoft Excel", category: "productivity" },
  { pattern: /\\bgoogle\\s+docs\\b/i, tool: "Google Docs", category: "productivity" },
  { pattern: /\\bshopify\\b/i, tool: "Shopify", category: "marketing" },
  { pattern: /\\bwordpress\\b/i, tool: "WordPress", category: "marketing" },
];

const ASSIST_CUE = /\\b(help me|assist|create|make|design|edit|build)\\b/i;

export function detectExistingSoftwareAssistIntent(message: string): ExistingSoftwareAssistIntent {
  const text = message.trim();
  if (!text || !ASSIST_CUE.test(text)) return { matched: false };

  for (const entry of TOOL_PATTERNS) {
    if (entry.pattern.test(text)) {
      return { matched: true, tool: entry.tool, category: entry.category, taskHint: text.slice(0, 200) };
    }
  }
  return { matched: false };
}

export function getExistingSoftwareConsentPrompt(tool: string): {
  intro: string;
  question: string;
  actions: typeof COMPANION_PERMISSION_MODES;
} {
  return {
    intro: \`I can help you with that. I see \${tool} is available.\`,
    question: \`Do you want to give me temporary access to assist you in \${tool}?\`,
    actions: COMPANION_PERMISSION_MODES,
  };
}
`,
);

// FAQ append
const faqPath = path.join(
  ROOT,
  "content/knowledge/aipify/aipify-desktop-companion-creative-bridge-engine/faq/companion-existing-software-faq.md",
);
write(
  faqPath,
  `# Companion for Existing Software — FAQ

## Does Aipify replace Canva, Adobe or Microsoft Office?

**No.** Aipify is not competing with professional tools. Aipify orchestrates, guides and assists tools you already own when you grant permission.

## What is the core principle?

**Do not reinvent the wheel.** Aipify acts as the bridge between you and your existing software.

## What happens when I ask for help in Canva?

Aipify explains that Canva is available and asks whether you want temporary access — with **Allow once**, **Use Aipify Studio**, or **Decline**.

## What does Allow once mean?

Aipify may assist only for the current task. Session access expires afterward.

## What does Use Aipify Studio mean?

Aipify continues with built-in Studio capabilities without accessing the external application.

## Can Aipify silently control my applications?

**No.** Aipify must never silently control third-party tools. Always ask permission; always allow decline.

## What tools are supported?

Creative (Canva, Adobe, Figma, Blender), productivity (Microsoft Office, Google Workspace), and marketing tools (Meta Business Suite, Mailchimp, Shopify, WordPress) — when approved by your organization.

## Who controls which applications Aipify may assist?

Super Admins approve allowed applications; Tenant Admins configure organization access; employees grant task-level permission and may revoke access.

## Will Aipify charge me for Canva or Adobe?

**No hidden billing.** Aipify clearly states when you use your own subscription, when a connected account is required, and when the provider may charge separately.

## What roles does Aipify play?

Guide, translator, workflow assistant, creative helper, and productivity companion — not a replacement for your professional tools.
`,
);

// Patch ILM index
const ilmIndex = path.join(ROOT, "lib/internal-language-model/index.ts");
let ilm = fs.readFileSync(ilmIndex, "utf8");
if (!ilm.includes("companion-existing-software-vocabulary")) {
  ilm = ilm.replace(
    'export * from "./companion-briefing-design-vocabulary";',
    'export * from "./companion-briefing-design-vocabulary";\nexport * from "./companion-existing-software-vocabulary";',
  );
  if (!ilm.includes('export * from "./companion-existing-software-vocabulary"')) {
    ilm += '\nexport * from "./companion-existing-software-vocabulary";\n';
  }
}
if (!ilm.includes("COMPANION_EXISTING_SOFTWARE_CORPUS")) {
  ilm = ilm.replace(
    'export const IMPLEMENTATION_BLUEPRINT_PHASE236_CORPUS =',
    'export const COMPANION_EXISTING_SOFTWARE_CORPUS =\n  "aipify-core/knowledge/internal-language-model/companion-for-existing-software.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE236_CORPUS =',
  );
}
fs.writeFileSync(ilmIndex, ilm);

// Patch phase 236 ILM corpus pointer
const ilm236 = path.join(
  ROOT,
  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase236-aipify-desktop-companion-creative-bridge.txt",
);
let corpus236 = fs.readFileSync(ilm236, "utf8");
if (!corpus236.includes("companion-for-existing-software.txt")) {
  corpus236 += "\nCompanion for existing software positioning: companion-for-existing-software.txt — do not reinvent the wheel.\n";
  fs.writeFileSync(ilm236, corpus236);
}

// Patch ARCHITECTURE
const archPath = path.join(ROOT, "ARCHITECTURE.md");
let arch = fs.readFileSync(archPath, "utf8");
const archEntry =
  "\n**Companion for Existing Software (Cursor Update):** See [AIPIFY_COMPANION_FOR_EXISTING_SOFTWARE.md](./AIPIFY_COMPANION_FOR_EXISTING_SOFTWARE.md) — Do not reinvent the wheel. Aipify orchestrates Canva, Adobe, Microsoft Office, Figma and similar tools with explicit consent (Allow once, Always allow, Use Aipify Studio, Decline). Migration `20261401000000_aipify_companion_existing_software_positioning.sql` extends `_adccbebp236_*`. Constants `lib/companion/existing-software.ts`. ILM `companion-for-existing-software.txt`.";
if (!arch.includes("Companion for Existing Software")) {
  const marker = "**Desktop Companion & Creative Bridge Engine (Phase 236):**";
  const idx = arch.indexOf(marker);
  if (idx !== -1) {
    const end = arch.indexOf("\n", idx);
    arch = `${arch.slice(0, end)}${archEntry}${arch.slice(end)}`;
  } else {
    arch += archEntry;
  }
  fs.writeFileSync(archPath, arch);
}

console.log("Companion for existing software update complete");

// i18n — positioning labels
const i18nKeys = {
  subtitle:
    "Companion for existing software — do not reinvent the wheel. Bridge Companion orchestrates Canva, Adobe, Microsoft Office and Figma with explicit consent. Supports users — does NOT replace professional tools or control apps silently. Growth Partner — never Affiliate.",
  existingSoftwareLabel: "Companion for existing software",
  toolCategoriesLabel: "Supported tool categories",
  creativeBridgeLabel: "Creative apps bridge",
  productivityBridgeLabel: "Productivity apps bridge",
  businessTransparencyLabel: "Business model transparency",
  consentExampleLabel: "Consent dialog example",
  consentUserLabel: "User",
  consentCompanionLabel: "Aipify",
};
for (const locale of ["en", "no", "sv", "da"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const block = data.aipifyDesktopCompanionCreativeBridgeEngine ?? {};
  Object.assign(block, i18nKeys);
  data.aipifyDesktopCompanionCreativeBridgeEngine = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}
