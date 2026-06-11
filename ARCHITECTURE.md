# Aipify Product Architecture

**Prerequisites:** Read **[CORE_FOUNDATION.md](./CORE_FOUNDATION.md)** then **[OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md)** — foundation, behaviour, safety, and packages are decided before architecture and implementation. New skills come last.

Aipify is split into **three layers**. Before adding a feature, decide which layer it belongs to.

| Question | Layer | Route prefix |
|----------|--------|--------------|
| Internal Aipify Group AS operations? | **Platform Admin** | `/platform` |
| Product customers buy and log into? | **Customer App** | `/app` |
| Runs inside a customer's website/admin? | **Embedded / Install** | `/api/install`, `/api/embed` |

**Do not mix layers.**

This repo uses Next.js App Router at the project root (`app/`, not `src/app/`). The tables below map spec paths to actual paths.

---

## Layer 1 — Platform Admin

**Purpose:** Internal control center for Aipify Group AS. Platform admins only.

**Routes:** `/platform`, `/platform/*`

**Code locations:**

| Area | Path |
|------|------|
| Routes | `app/platform/` |
| Components | `components/platform/` |
| Business logic | `lib/platform/` |
| Types | `types/platform/` (re-exports `lib/platform/types.ts`) |
| Services | `services/platform/` |

**Examples:** customers, subscriptions, billing, invoices, global intelligence, learning queue, action center (internal), platform metrics, system status, audit logs.

**Rule:** Platform Admin is **not** the customer product. Do not add customer-facing product features here unless they administer all tenants.

---

## Layer 2 — Customer App (Control Center)

**Purpose:** The software product each customer buys (e.g. Unonight, Sportsklær). All data **must** be scoped by `tenant_id` / `customer_id` / `company_id`.

**Routes:** `/app`, `/app/*` (canonical). `/dashboard` is the **legacy** prefix during migration.

**Code locations:**

| Area | Path |
|------|------|
| Routes | `app/app/` |
| Components | `components/app/` |
| Business logic | `lib/app/` |
| Types | `types/app/` |
| Services | `services/app/` |

**Customer sidebar (target):** Overview, Presence, Assistant, Support, Actions, Recommendations, Installations, Domains, Team, Billing, Settings.

**Migration:** `lib/app/route-aliases.ts` maps `/app/*` → `/dashboard/*` until pages move. New customer features go under `app/app/` and `lib/app/`, not under `app/platform/`.

**Roles:** `owner`, `admin`, `support`, `staff`, `read_only`

---

## Layer 3 — Embedded / Install Runtime

**Purpose:** Aipify inside the customer's existing admin (WordPress, Shopify, custom CMS, Unonight admin).

**Routes:** `/api/install/*`, `/api/embed/*`

**Code locations:**

| Area | Path |
|------|------|
| API routes | `app/api/install/`, `app/api/embed/` |
| Components | `components/embed/` |
| Business logic | `lib/install/`, `lib/embed/` |
| Types | `types/install/` |
| Services | `services/install/` |

**Must validate:** `installation_token`, domain, subscription status, license limits, allowed modules.

**Install Engine (Phase 17):** See [INSTALL_ENGINE.md](./INSTALL_ENGINE.md) — workflow, discovery, heartbeat, human validation, learning phase.

**Update Engine (Phase 18):** See [UPDATE_ENGINE.md](./UPDATE_ENGINE.md) — safe version deployment, maintenance windows, migration approval, rollback, audit logging.

**Trust Architecture (Phase 19):** See [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md) — data ownership, access levels, metadata-first storage, immutable audit, Security Dashboard.

**License & Trust Center (Phase 20):** See [LICENSE_CENTER.md](./LICENSE_CENTER.md) — sidebar license panel, `/app/license`, payment grace period, pause/reactivation policy.

**Anonymised Impact Metrics (Phase 21):** See [IMPACT_METRICS.md](./IMPACT_METRICS.md) — `/platform/impact`, marketing proof export, install metric events, Trust Center disclosure.

**Skill Operating System (Phase 22):** See [SKILLOS.md](./SKILLOS.md) — skill registry tables, tenant skills, permissions, health, audit, `/platform/skills`, `/app/skills`.

**Architecture Review (Phase 23):** See [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md) — layer audit, migration priorities, stabilization rules. `/dashboard/*` is legacy; `/app/*` is canonical.

**Modern Install Experience (Phase 24):** See [MODERN_INSTALL_EXPERIENCE.md](./MODERN_INSTALL_EXPERIENCE.md) — `/app/install` assistant, Developer Settings at `/app/settings/developer`, install tokens (not license keys), platform detection, support escalations.

**Desktop Presence Foundation (Phase 25):** See [DESKTOP_PRESENCE_FOUNDATION.md](./DESKTOP_PRESENCE_FOUNDATION.md) — notifications, quiet hours, actionable alerts, `/api/presence/*` for future desktop clients, Unonight pilot at `/platform/presence-pilot`.

**Command Center & Notification Engine (Phase 26):** See [COMMAND_CENTER.md](./COMMAND_CENTER.md) — `/app/command-center`, executive feed, quick actions, plan packaging, `lib/notification/`, single Core event infrastructure for web/desktop/mobile.

**Desktop Command Center (Phase 27):** See [DESKTOP_COMMAND_CENTER.md](./DESKTOP_COMMAND_CENTER.md) — Tauri client at `apps/command-center/`, macOS Phase 1, pairing at `/app/command-center/connect`, desktop APIs at `/api/desktop/*`, `lib/desktop/`, hashed session tokens (Business+ plan).

**Customer App 1.0 (Phase 28):** See [CUSTOMER_APP.md](./CUSTOMER_APP.md) — complete customer product at `/app/*` (home, executive, presence, recommendations, approvals, skills, installations, domains, team, license, security, settings). `lib/app/customer-app/`, Core RPCs for health score and centers. `/dashboard/*` is legacy.

**Learning Engine (Phase 29):** See [LEARNING_ENGINE.md](./LEARNING_ENGINE.md) — controlled learning at `/app/learning`, modes (disabled / assisted / adaptive), learning memory metadata only, platform governance at `/platform/intelligence/learning-queue`, `lib/learning/`, migration `20260611700000_learning_engine_phase29.sql`.

**Trust & Action Engine (Phase 30):** See [TRUST_ACTION_ENGINE.md](./TRUST_ACTION_ENGINE.md) — governed AI actions at `/app/approvals`, action levels 0–4, policies, explainability, audit, emergency stop, APIs at `/api/actions/*`, platform dashboard at `/platform/trust`. `lib/trust-action/`, migration `20260611800000_trust_action_engine_phase30.sql`.

**Personal Assistant Memory Engine / PAME (Phase 31):** See [ASSISTANT_MEMORY_ENGINE.md](./ASSISTANT_MEMORY_ENGINE.md) — natural conversation at `/app/assistant`, PAME memory types (people, events, tasks, habits, goals), clarification + reminder engines, `/app/assistant/memory` dashboard. Separate from Learning Engine. `lib/assistant-memory/`, migrations `20260611900000_assistant_memory_phase31.sql`, `20260611910000_pame_phase31.sql`.

**Life Operating System / LifeOS (Phase 32):** See [LIFE_OPERATING_SYSTEM.md](./LIFE_OPERATING_SYSTEM.md) — daily briefings, evening reviews, priority engine, conflict detection, checklists, `/app/assistant/life` dashboard. Builds on PAME; suggestions only. `lib/life-os/`, migration `20260612000000_life_os_phase32.sql`.

**Relationship & Social Intelligence / RSI (Phase 33):** See [RELATIONSHIP_SOCIAL_INTELLIGENCE.md](./RELATIONSHIP_SOCIAL_INTELLIGENCE.md) — important people directory, social reminders, relationship timeline, follow-ups, gift planning, `/app/assistant/relationships`. Never impersonates user. `lib/relationship-intelligence/`, migration `20260612100000_rsi_phase33.sql`.

**Identity Engine / AIE (Phase 34):** See [IDENTITY_ENGINE.md](./IDENTITY_ENGINE.md) — per-user communication identity, observation approval, reply adaptation, `/app/assistant/identity`. Transparent — never manipulative. `lib/identity-engine/`, migration `20260612200000_identity_engine_phase34.sql`.

**Context Engine & Universal Calendar Layer / ACE + UCL (Phase 35):** See [CONTEXT_ENGINE.md](./CONTEXT_ENGINE.md) — orchestrates calendars users already trust; context modes, daily briefings, conflict detection, natural language scheduling. `/app/assistant/context`, `/app/assistant/calendars`. `lib/context-engine/`, migration `20260612300000_context_calendar_phase35.sql`.

**Goals & Dreams Engine / GDE (Phase 36):** See [GOALS_DREAMS_ENGINE.md](./GOALS_DREAMS_ENGINE.md) — long-term aspirations, milestones, accountability, celebrations, setback support. `/app/assistant/goals`. `lib/goals-dreams-engine/`, migration `20260612400000_goals_dreams_phase36.sql`.

**Time & Attention Guardian / TAG (Phase 37):** See [ATTENTION_GUARDIAN.md](./ATTENTION_GUARDIAN.md) — focus protection, attention audit, energy management, goal alignment, meeting protection. `/app/assistant/attention`. `lib/attention-guardian/`, migration `20260612500000_attention_guardian_phase37.sql`.

**Decision Support Engine / DSE (Phase 38):** See [DECISION_SUPPORT_ENGINE.md](./DECISION_SUPPORT_ENGINE.md) — business-first prioritization, escalation guidance, executive insights, explainability, confidence indicators. `/app/assistant/decisions`. `lib/decision-support-engine/`, migration `20260612600000_decision_support_phase38.sql`.

**Business DNA Engine / BDE (Phase 39):** See [BUSINESS_DNA_ENGINE.md](./BUSINESS_DNA_ENGINE.md) — tenant Business DNA profiles, email templates, support knowledge, workflows, escalation rules, health score, email draft pipeline. `/app/settings/business-dna`. `lib/business-dna-engine/`, migration `20260612700000_business_dna_phase39.sql`.

**Autonomous Support Operations / ASO (Phase 40):** See [AUTONOMOUS_SUPPORT_OPERATIONS.md](./AUTONOMOUS_SUPPORT_OPERATIONS.md) — autonomy levels, triage engine, confidence scoring, proactive support, knowledge gaps, case summarization. `/app/settings/support-operations`. `lib/autonomous-support-operations/`, migration `20260612800000_autonomous_support_phase40.sql`.

**Employee Knowledge Engine / EKE (Phase 41):** See [EMPLOYEE_KNOWLEDGE_ENGINE.md](./EMPLOYEE_KNOWLEDGE_ENGINE.md) — approved knowledge ingestion, role permissions, employee assistant Q&A, step-by-step guidance, onboarding paths, gap detection, health score. `/app/settings/employee-knowledge`. `lib/employee-knowledge-engine/`, migration `20260612900000_employee_knowledge_phase41.sql`.

**Commercial Packages & Modular Architecture (Phase 42):** See [COMMERCIAL_PACKAGES.md](./COMMERCIAL_PACKAGES.md) — subscription packages, tenant module licensing, billing dashboard, module management, usage tracking, feature flags, upgrade flows. `/app/settings/billing`, `/app/settings/modules`. `lib/commercial-packages/`, migration `20260613000000_commercial_packages_phase42.sql`.

**Autonomous Execution Framework / AEF (Phase 44):** See [AUTONOMOUS_EXECUTION_FRAMEWORK.md](./AUTONOMOUS_EXECUTION_FRAMEWORK.md) — controlled business action execution, approval flow, safety checker, execution rules (Enterprise), mock adapters. `/app/action-center`. `lib/aipify/execution/`, migration `20260613300000_autonomous_execution_phase44.sql`.

**Internal Language Model / ILM:** See [INTERNAL_LANGUAGE_MODEL.md](./INTERNAL_LANGUAGE_MODEL.md) — function vocabulary, command wording, NBLE, business phrases, proactive guidance, and reminder follow-up language. `aipify-core/knowledge/internal-language-model/`, `lib/internal-language-model/`.

**Adaptive Working Style Engine / AWSE (Phase 46):** See [AWSE.md](./AWSE.md) — transparent working profiles, detail levels, reminder preferences, optional adaptive learning. `/app/settings/working-style`, `lib/adaptive-working-style-engine/`.

**Business Pulse Engine / BPE (Phase 47):** See [BPE.md](./BPE.md) — calm operational awareness, anomaly detection, daily briefings, pulse alerts. `/app/business-pulse`, `lib/aipify/business-pulse/`, migration `20260613500000_business_pulse_phase47.sql`.

**Strategic Goal Engine / SGE (Phase 48):** See [SGE.md](./SGE.md) — strategic goals, progress tracking, goal health, milestones, pulse-aligned briefings. `/app/goals`, `lib/aipify/strategic-goals/`, migration `20260613600000_strategic_goal_engine_phase48.sql`.

**Friction Intelligence Engine / FIE (Phase 49):** See [FIE.md](./FIE.md) — friction detection, improvement recommendations, pulse and goal alignment, Action Center integration. `/app/friction`, `lib/aipify/friction-intelligence/`, migration `20260613700000_friction_intelligence_engine_phase49.sql`.

**Organizational Memory Engine / OME (Phase 50):** See [OME.md](./OME.md) — institutional memory, decision records, lessons learned, searchable timeline, module integrations. `/app/memory`, `lib/aipify/organizational-memory/`, migration `20260613800000_organizational_memory_engine_phase50.sql`.

**Organizational Intelligence Layer / OIL (Phase 51):** See [OIL.md](./OIL.md) — operational insights, workflow understanding, bottleneck and follow-up detection, business health, org structure, tenant-safe audit logging. `/app/insights`, `/app/settings/intelligence`, `lib/aipify/organizational-intelligence/`, migration `20260613900000_organizational_intelligence_phase51.sql`.

**Predictive Intelligence Engine / PIE (Phase 52):** See [PIE.md](./PIE.md) — forward-looking alerts for bottlenecks, SLA risk, follow-ups, churn, workload, and growth opportunities using trend and threshold rules (no ML in V1). `/app/predictions`, `/app/settings/predictions`, `lib/aipify/predictive-intelligence/`, migration `20260614000000_predictive_intelligence_phase52.sql`.

**Adaptive Automation Layer / AAL (Phase 53):** See [AAL.md](./AAL.md) — discover repeated work, suggest safe automations, require approval, execute approved flows, and monitor value. Observe → Suggest → Approve → Generate → Execute → Monitor. `/app/automations`, `/app/automation-library`, `/app/automation-executions`, `/app/settings/automation`, `lib/aipify/adaptive-automation/`, migration `20260614100000_adaptive_automation_phase53.sql`.

**Trust, Approval & Control Center / TACC (Phase 54):** See [TACC.md](./TACC.md) — unified governance for approvals, permission matrix, emergency stop, audit timeline, trust scores, and explainability. Observe → Suggest → Request Approval → Execute → Explain → Audit → Learn. `/app/governance`, `/app/governance/audit`, `/app/governance/trust`, `/app/settings/governance`, `lib/aipify/governance/`, migration `20260614200000_trust_approval_control_center_phase54.sql`.

**Knowledge Center / KC (Phase 55):** See [KC.md](./KC.md) — self-knowledge layer so Aipify answers questions about itself from published articles, creates knowledge gaps when confidence is low, and never hallucinates product answers. `/app/knowledge-center`, `content/knowledge/aipify/`, `lib/aipify/knowledge/`, migration `20260614300000_knowledge_center_phase55.sql`.

**Unonight Pilot Install (Phase 57):** See [UNONIGHT_PILOT.md](./UNONIGHT_PILOT.md) — first live tenant activation via generic `provision_pilot_tenant`; Unonight config in `lib/aipify/integrations/unonight/`, platform UI at `/platform/install/unonight`, migration `20260614500000_unonight_pilot_installation_phase57.sql`.

**Briefing System (Phase 60):** See [BRIEFING.md](./BRIEFING.md) — Since Last Login and Daily Command Brief across modules. `/app` briefing card, `/app/briefing`, `lib/aipify/briefing/`, migration `20260614900000_briefing_system_phase60.sql`.

**Desktop Companion (Phase 61):** See [DESKTOP_COMPANION.md](./DESKTOP_COMPANION.md) — smart notifications, reminders, mini-chat, and notification modes (Silent, Balanced, Active Assistant, Focus). Integrates with Briefing, Quality Guardian, Governance, and Unonight pilot. `/app/desktop`, `lib/aipify/desktop/`, migration `20260615000000_desktop_companion_phase61.sql`.

**Memory Engine (Phase 62):** See [MEMORY_ENGINE.md](./MEMORY_ENGINE.md) — tenant-isolated pattern learning, preferences, observations, and memory-improved recommendations. Integrates with Briefing, Desktop Companion, Governance, Quality Guardian, and Organizational Memory (OME). `/app/memory`, `lib/aipify/memory/`, migration `20260615100000_memory_engine_phase62.sql`.

**Skill Store (Phase 63):** See [SKILL_STORE.md](./SKILL_STORE.md) — modular capability platform: catalog, install, governance approval, dependency checks, tenant settings, and audit history. Extends Phase 22 SkillOS. Integrates with Governance, Knowledge Center, Audit, Desktop Companion, Executive Briefing, and Memory Engine. `/app/skills`, `lib/aipify/skills/`, migration `20260615200000_skill_store_phase63.sql`.

**Action Center / Decision Hub (Phase 64):** See [ACTION_HUB.md](./ACTION_HUB.md) — operational execution layer: prioritized action queue, assignments, governance approval, audit decisions, and dashboard widgets. Collects from Quality Guardian, Governance, Knowledge Center, and Memory Engine. `/app/actions`, `lib/aipify/action-hub/`, migration `20260615300000_action_hub_phase64.sql`. Phase 44 AEF remains at `/app/action-center`.

**Learning Engine — Feedback Loop (Phase 65):** See [LEARNING_ENGINE_PHASE65.md](./LEARNING_ENGINE_PHASE65.md) — governed feedback loop: learning events, outcomes, scores, rules, and audit. Extends Phase 29. Integrates with Memory Engine, Action Center, Quality Guardian, Governance, and Knowledge Center. `/app/learning`, `lib/aipify/learning-engine/`, migration `20260615400000_learning_engine_phase65.sql`.

**Assistant Identity & Welcome Experience (Foundation):** See [ASSISTANT_IDENTITY.md](./ASSISTANT_IDENTITY.md) — professional assistant identity, six-step welcome flow, phrase library (no/en/sv/da), communication preferences, Memory sync, Desktop/Briefing greetings. `/app/welcome`, `/app/settings/assistant-identity`, `lib/aipify/assistant-identity/`, migration `20260615500000_assistant_identity_foundation.sql`.

**Enterprise Deployment Architecture (Phase 66):** See [ENTERPRISE_DEPLOYMENT_PHASE66.md](./ENTERPRISE_DEPLOYMENT_PHASE66.md) — cloud/hybrid/on-premise modes, Aipify Agent registry, job queue, data residency policies, enterprise admin UI. `/app/enterprise`, `lib/aipify/enterprise/`, migration `20260615600000_enterprise_deployment_phase66.sql`.

**Enterprise Deployment Framework (Phase 92):** See [ENTERPRISE_DEPLOYMENT_FRAMEWORK_PHASE92.md](./ENTERPRISE_DEPLOYMENT_FRAMEWORK_PHASE92.md) — readiness assessment, 5 deployment stages, IAM, governance policies, security controls, change management, success metrics, executive dashboard. `/app/enterprise/framework`, `lib/aipify/enterprise-deployment-framework/`, migration `20260621000000_enterprise_deployment_framework_phase92.sql`. Enterprise-grade AI without enterprise complexity.

**Security, Compliance & Data Governance (Phase 67):** See [SECURITY_COMPLIANCE_PHASE67.md](./SECURITY_COMPLIANCE_PHASE67.md) — Policy Engine, data classification, access policies, privacy requests, retention, security incidents, secrets references. `/app/security`, `/app/compliance`, `lib/aipify/security-compliance/`, migration `20260615700000_security_compliance_phase67.sql`.

**Orchestration Engine (Phase 68):** See [ORCHESTRATION_ENGINE_PHASE68.md](./ORCHESTRATION_ENGINE_PHASE68.md) — cross-module coordination: events, rules, flows, dispatches, Policy Engine integration, duplicate suppression. `/app/orchestration`, `lib/aipify/orchestration/`, migration `20260615800000_orchestration_engine_phase68.sql`.

**Marketplace & Business Pack Ecosystem (Phase 69):** See [MARKETPLACE_BUSINESS_PACK_PHASE69.md](./MARKETPLACE_BUSINESS_PACK_PHASE69.md) — catalog, packs, install precheck, Skill Store integration, entitlements, recommendations. `/app/marketplace`, `lib/aipify/marketplace/`, migration `20260615900000_marketplace_business_pack_phase69.sql`.

**Industry Blueprints & Vertical Operating Models (Phase 70):** See [INDUSTRY_BLUEPRINTS_PHASE70.md](./INDUSTRY_BLUEPRINTS_PHASE70.md) — industry catalog, tenant profile, recommendation engine, governed apply via Marketplace/Skill Store. `/app/industry-blueprints`, `lib/aipify/industry-blueprints/`, migration `20260616000000_industry_blueprints_phase70.sql`.

**Global Learning Network & Core Evolution Engine (Phase 72):** See [GLOBAL_LEARNING_NETWORK_PHASE72.md](./GLOBAL_LEARNING_NETWORK_PHASE72.md) — three intelligence levels, anonymization pipeline, participation modes, evolution proposals. `/app/global-learning`, `/app/evolution`, `lib/aipify/global-learning/`, migration `20260616200000_global_learning_network_phase72.sql`.

**Value Engine & Impact Analytics (Phase 73):** See [VALUE_ENGINE_PHASE73.md](./VALUE_ENGINE_PHASE73.md) — Impact Score, value events, optional ROI, executive reports, marketplace/blueprint impact. `/app/value`, `lib/aipify/value-engine/`, migration `20260616300000_value_engine_phase73.sql`.

**Multi-Agent Collaboration System (Phase 74):** See [MULTI_AGENT_COLLABORATION_PHASE74.md](./MULTI_AGENT_COLLABORATION_PHASE74.md) — specialist agent registry, orchestrated collaboration, policy/governance enforcement, health metrics. `/app/agents`, `lib/aipify/agents/`, migration `20260616400000_multi_agent_collaboration_phase74.sql`.

**App Ecosystem & Developer Platform (Phase 75):** See [APP_ECOSYSTEM_DEVELOPER_PLATFORM_PHASE75.md](./APP_ECOSYSTEM_DEVELOPER_PLATFORM_PHASE75.md) — app registry, SDK, sandbox runtime, install/review flow, developer portal. `/app/apps`, `/developers`, `lib/aipify/app-ecosystem/`, migration `20260616500000_app_ecosystem_developer_platform_phase75.sql`.

**Trust, Transparency & Explainability Engine (Phase 76):** See [TRUST_TRANSPARENCY_EXPLAINABILITY_PHASE76.md](./TRUST_TRANSPARENCY_EXPLAINABILITY_PHASE76.md) — decision explanations, Trust Score, human override, feedback, audit. `/app/trust`, `lib/aipify/trust-engine/`, migration `20260616700000_trust_transparency_explainability_phase76.sql`.

**Digital Twin & Organizational Model Engine (Phase 77):** See [DIGITAL_TWIN_ORGANIZATIONAL_MODEL_PHASE77.md](./DIGITAL_TWIN_ORGANIZATIONAL_MODEL_PHASE77.md) — responsibility-centric organizational model, process twin, escalation engine, knowledge routing, bottleneck detection, Twin Health. `/app/digital-twin`, `lib/aipify/digital-twin/`, migration `20260616800000_digital_twin_organizational_model_phase77.sql`. Models responsibilities — not people; never employee surveillance.

**Simulation & Decision Lab (Phase 78):** See [SIMULATION_DECISION_LAB_PHASE78.md](./SIMULATION_DECISION_LAB_PHASE78.md) — safe scenario modeling, outcome forecasting, scenario comparison, production isolation. `/app/simulations`, `lib/aipify/simulation-lab/`, migration `20260616900000_simulation_decision_lab_phase78.sql`. Simulation predicts; simulation never acts.

**Autonomous Operations Center (Phase 79):** See [AUTONOMOUS_OPERATIONS_CENTER_PHASE79.md](./AUTONOMOUS_OPERATIONS_CENTER_PHASE79.md) — operational health score, 10 watchers, recommendations, daily/weekly/executive reviews. `/app/operations`, `lib/aipify/aoc/`, migration `20260617000000_autonomous_operations_center_phase79.sql`. AOC observes and recommends; humans decide.

**Continuity, Resilience & Crisis Management (Phase 80):** See [CONTINUITY_RESILIENCE_CRISIS_PHASE80.md](./CONTINUITY_RESILIENCE_CRISIS_PHASE80.md) — continuity plans, backup ownership, incident mode, recovery tracking, readiness score. `/app/continuity`, `lib/aipify/continuity/`, migration `20260617100000_continuity_resilience_crisis_phase80.sql`. Aipify supports resilience; humans lead resilience.

**Strategic Intelligence & Opportunity Engine (Phase 81):** See [STRATEGIC_INTELLIGENCE_OPPORTUNITY_PHASE81.md](./STRATEGIC_INTELLIGENCE_OPPORTUNITY_PHASE81.md) — strategic scorecard, opportunity detection, risk tracking, horizon planning, advisory recommendations. `/app/strategy`, `lib/aipify/strategy/`, migration `20260617200000_strategic_intelligence_opportunity_phase81.sql`. Aipify recommends strategy; humans decide strategy.

**Experience, Adoption & Human Success (Phase 82):** See [EXPERIENCE_ADOPTION_HUMAN_SUCCESS_PHASE82.md](./EXPERIENCE_ADOPTION_HUMAN_SUCCESS_PHASE82.md) — adoption score, Human Success score, smart onboarding, success journeys, friction detection, champions. `/app/human-success`, `lib/aipify/human-success/`, migration `20260617300000_experience_adoption_human_success_phase82.sql`. Technology succeeds when people succeed.

**Humor, Warmth & Human Connection (Core Behavior Layer):** See [HUMOR_WARMTH_HUMAN_CONNECTION.md](./HUMOR_WARMTH_HUMAN_CONNECTION.md) — personality modes, context-aware humor, emoji guidelines, warm messaging framework. `/app/personality`, `lib/aipify/personality/`, `lib/aipify/communication/`, migration `20260617400000_humor_warmth_human_connection.sql`. Competent first. Human second. Funny third.

**Personalization & Workstyle Intelligence (Phase 83):** See [PERSONALIZATION_WORKSTYLE_INTELLIGENCE_PHASE83.md](./PERSONALIZATION_WORKSTYLE_INTELLIGENCE_PHASE83.md) — workstyle profiles, preference suggestions with consent, org policies, desktop-adaptive greetings. `/app/settings/personalization`, `lib/aipify/workstyle/`, migration `20260617500000_personalization_workstyle_intelligence_phase83.sql`. Aipify adapts to people.

**Evolution Governance & Change Management (Phase 84):** See [EVOLUTION_GOVERNANCE_CHANGE_MANAGEMENT_PHASE84.md](./EVOLUTION_GOVERNANCE_CHANGE_MANAGEMENT_PHASE84.md) — tenant evolution proposals, risk classification, approval matrix, rollback guidance, executive briefings. `/app/evolution`, `lib/aipify/evolution-governance/`, migration `20260617600000_evolution_governance_change_management_phase84.sql`. Aipify proposes evolution; humans approve evolution.

**Outcomes, ROI & Success Validation (Phase 85):** See [OUTCOMES_ROI_SUCCESS_VALIDATION_PHASE85.md](./OUTCOMES_ROI_SUCCESS_VALIDATION_PHASE85.md) — hypothesis validation, ROI variance, KPI framework, Validated Success Score, success briefings. `/app/outcomes`, `lib/aipify/outcomes/`, migration `20260617700000_outcomes_roi_success_validation_phase85.sql`. Aipify validates outcomes; humans interpret outcomes.

**Customer Lifecycle & Success Orchestration (Phase 86):** See [CUSTOMER_LIFECYCLE_SUCCESS_ORCHESTRATION_PHASE86.md](./CUSTOMER_LIFECYCLE_SUCCESS_ORCHESTRATION_PHASE86.md) — lifecycle stages, Customer Success Score, quick wins, playbooks, journey dashboard. `/app/customer-lifecycle`, `lib/aipify/customer-lifecycle/`, migration `20260617800000_customer_lifecycle_success_orchestration_phase86.sql`. Customer success comes before expansion.

**Self-Awareness & Platform Integrity (Phase 87):** See [SELF_AWARENESS_PLATFORM_INTEGRITY_PHASE87.md](./SELF_AWARENESS_PLATFORM_INTEGRITY_PHASE87.md) — integrity reviews, findings, deprecated assets, Aipify Integrity Score, governance-gated actions. `/app/integrity`, `lib/aipify/platform-integrity/`, migration `20260617900000_self_awareness_platform_integrity_phase87.sql`. Aipify evaluates itself; humans govern improvements.

**Ecosystem Intelligence & External Relationship (Phase 88):** See [ECOSYSTEM_INTELLIGENCE_EXTERNAL_RELATIONSHIP_PHASE88.md](./ECOSYSTEM_INTELLIGENCE_EXTERNAL_RELATIONSHIP_PHASE88.md) — relationship maps, dependency analysis, external risk detection, partnership opportunities, Ecosystem Health Score. `/app/ecosystem`, `lib/aipify/ecosystem-intelligence/`, migration `20260618000000_ecosystem_intelligence_external_relationship_phase88.sql`. Aipify maps relationships; humans govern relationships.

**Community & Collective Intelligence (Phase 89):** See [COMMUNITY_COLLECTIVE_INTELLIGENCE_PHASE89.md](./COMMUNITY_COLLECTIVE_INTELLIGENCE_PHASE89.md) — governed contributions, anonymization workflow, Collective Intelligence Score, Community Health Score, community briefings. `/app/community`, `lib/aipify/community-intelligence/`, migrations `20260618100000_community_collective_intelligence_phase89.sql`, `20260618200000_community_collective_intelligence_refinement_phase89.sql`. Organizations own their knowledge; organizations control participation.

**Marketplace Governance & Quality (Phase 90):** See [MARKETPLACE_GOVERNANCE_QUALITY_PHASE90.md](./MARKETPLACE_GOVERNANCE_QUALITY_PHASE90.md) — Governance Score, Quality Guardian pre/post publish, fraud detection, supplier intelligence, policy engine, incident center, root cause analysis. `/app/marketplace-governance`, `lib/aipify/marketplace-governance/`, migration `20260619000000_marketplace_governance_quality_phase90.sql`. Not everything that can be sold should be sold.

**Partner & Certification Ecosystem (Phase 91):** See [PARTNER_CERTIFICATION_ECOSYSTEM_PHASE91.md](./PARTNER_CERTIFICATION_ECOSYSTEM_PHASE91.md) — partner program framework, certification tracks, digital credentials, partner directory, lead referrals, scorecards, compliance. `/app/partners`, `lib/aipify/partner-certification/`, migration `20260620000000_partner_certification_ecosystem_phase91.sql`. Enable others to succeed with Aipify.

**Billing, Packaging & Commercial Model (Phase 93):** See [BILLING_PACKAGING_COMMERCIAL_PHASE93.md](./BILLING_PACKAGING_COMMERCIAL_PHASE93.md) — layered packaging, subscription models, usage tracking, self-service portal, renewals, partner billing, commercial analytics. `/app/commercial`, `lib/aipify/billing-commercial/`, migration `20260622000000_billing_packaging_commercial_phase93.sql`. Flexible pricing for every stage of growth.

**Aipify Academy & Learning Ecosystem (Phase 94):** See [AIPIFY_ACADEMY_LEARNING_ECOSYSTEM_PHASE94.md](./AIPIFY_ACADEMY_LEARNING_ECOSYSTEM_PHASE94.md) — structured learning paths, courses, progress tracking, digital badges, role-based recommendations, organizational learning dashboard, community resources. `/app/academy`, `lib/aipify/academy/`, migration `20260623000000_aipify_academy_learning_ecosystem_phase94.sql`. Distinct from AI adaptive Learning Engine at `/app/learning`. Empowering people to work smarter with AI.

**Global Expansion & Localization Framework (Phase 95):** See [GLOBAL_EXPANSION_LOCALIZATION_PHASE95.md](./GLOBAL_EXPANSION_LOCALIZATION_PHASE95.md) — multi-language architecture, regional configuration, country playbooks, translation projects, terminology governance, international analytics. `/app/global-expansion`, `lib/aipify/global-expansion/`, migration `20260624000000_global_expansion_localization_phase95.sql`. Distinct from Global Learning Network at `/app/global-learning`. One platform. Local experiences. Global impact.

**Innovation Lab & Experimentation Engine (Phase 96):** See [INNOVATION_LAB_EXPERIMENTATION_PHASE96.md](./INNOVATION_LAB_EXPERIMENTATION_PHASE96.md) — idea management, controlled experiments, pilot programs, feature flags, innovation scorecards, failure learning. `/app/innovation-lab`, `lib/aipify/innovation-lab/`, migration `20260625000000_innovation_lab_experimentation_phase96.sql`. Distinct from Decision Lab at `/app/simulations`. Innovation without chaos.

**Future Technologies & Emerging Interfaces (Phase 97):** See [FUTURE_TECHNOLOGIES_EMERGING_INTERFACES_PHASE97.md](./FUTURE_TECHNOLOGIES_EMERGING_INTERFACES_PHASE97.md) — technology observatory, emerging interface strategy, voice/multimodal readiness, scenario planning, future readiness assessments, responsible adoption. `/app/future-tech`, `lib/aipify/future-technologies/`, migration `20260626000000_future_technologies_emerging_interfaces_phase97.sql`. Prepared for tomorrow. Valuable today.

**Aipify Constitution & Core Principles (Phase 98):** See [AIPIFY_CONSTITUTION_CORE_PRINCIPLES_PHASE98.md](./AIPIFY_CONSTITUTION_CORE_PRINCIPLES_PHASE98.md) — 12 core principles, responsible AI commitments, constitutional governance, partner alignment, review process. `/app/constitution`, `lib/aipify/constitution/`, migration `20260627000000_aipify_constitution_core_principles_phase98.sql`. Technology guided by principles.

**Aipify Manifesto & Founding Vision (Phase 99):** See [AIPIFY_MANIFESTO_FOUNDING_VISION_PHASE99.md](./AIPIFY_MANIFESTO_FOUNDING_VISION_PHASE99.md) — founding statements, strategic themes, organizational commitments, vision updates, publications. `/app/manifesto`, `lib/aipify/manifesto/`, migration `20260628000000_aipify_manifesto_founding_vision_phase99.sql`. Purpose beyond functionality.

**Platform Install Connectors (Phase 100):** See [PLATFORM_INSTALL_CONNECTORS_PHASE100.md](./PLATFORM_INSTALL_CONNECTORS_PHASE100.md) — WordPress, Shopify, WooCommerce, Other Platforms connectors, 14-day trial billing, install wizard, health checks, Stripe Checkout. `/app/platform-install`, `lib/aipify/platform-install/`, migration `20260629000000_platform_install_connectors_phase100.sql`. Installation should feel simple.

**Commerce Intelligence Engine (Phase 101):** See [COMMERCE_INTELLIGENCE_ENGINE_PHASE101.md](./COMMERCE_INTELLIGENCE_ENGINE_PHASE101.md) — trend products, product discovery, margin analysis, supplier insights, opportunity scores, risk detection, store fit. `/app/commerce-intelligence`, `lib/aipify/commerce-intelligence/`, migration `20260630000000_commerce_intelligence_engine_phase101.sql`. Find better products. Grow smarter.

**Product Automation Engine (Phase 102):** See [PRODUCT_AUTOMATION_ENGINE_PHASE102.md](./PRODUCT_AUTOMATION_ENGINE_PHASE102.md) — product import, translation, rewriting, SEO optimization, category suggestions, approval workflow, bulk automation, quality validation. `/app/product-automation`, `lib/aipify/product-automation/`, migration `20260701000000_product_automation_engine_phase102.sql`. From product discovery to store-ready content in minutes.

**Dropshipping Operations Center (Phase 103):** See [DROPSHIPPING_OPERATIONS_CENTER_PHASE103.md](./DROPSHIPPING_OPERATIONS_CENTER_PHASE103.md) — supplier monitoring, product watchlists, delivery risk, order health, opportunity alerts, escalations. `/app/dropshipping-operations`, `lib/aipify/dropshipping-operations/`, migration `20260702000000_dropshipping_operations_center_phase103.sql`. Run your dropshipping business with confidence.

**Commerce Performance & Profit Engine (Phase 104):** See [COMMERCE_PERFORMANCE_PROFIT_ENGINE_PHASE104.md](./COMMERCE_PERFORMANCE_PROFIT_ENGINE_PHASE104.md) — performance dashboard, profit intelligence, product profitability, customer value, revenue trends, loss prevention, executive reporting. `/app/commerce-performance`, `lib/aipify/commerce-performance/`, migration `20260703000000_commerce_performance_profit_engine_phase104.sql`. Revenue is important. Profit is essential.

**Multi-Store Orchestration Engine (Phase 105):** See [MULTI_STORE_ORCHESTRATION_ENGINE_PHASE105.md](./MULTI_STORE_ORCHESTRATION_ENGINE_PHASE105.md) — unified portfolio dashboard, store management, cross-store insights, sync guidance, governance coordination, regional expansion. `/app/multi-store`, `lib/aipify/multi-store-orchestration/`, migration `20260704000000_multi_store_orchestration_engine_phase105.sql`. Manage many stores as if they were one ecosystem.

**Aipify Core Platform Foundation (Phase A):** See [AIPIFY_CORE_PLATFORM_PHASE_A.md](./AIPIFY_CORE_PLATFORM_PHASE_A.md) — multi-tenant SaaS foundation, authentication & roles, permission engine, audit logging, AI action framework, module framework, API layer, integrations, Knowledge Center foundation, dashboard widgets. `/app/aipify-core`, `lib/aipify/core-platform/`, migration `20260705000000_aipify_core_platform_phase_a.sql`. The foundational operating system powering all Aipify modules.

**Multi-Tenant Architecture Engine (Phase A.1):** See [MULTI_TENANT_ARCHITECTURE_PHASE_A1.md](./MULTI_TENANT_ARCHITECTURE_PHASE_A1.md) — organizations, organization_users, module activation, tenant settings, audit logs, integrations, KC FAQ items, tenant switching, RLS isolation. `/app/multi-tenant`, `lib/aipify/multi-tenant-architecture/`, migration `20260706000000_multi_tenant_architecture_phase_a1.sql`. Secure multi-customer SaaS from one platform.

**Identity, Roles & Permission Engine (Phase A.2):** See [IDENTITY_PERMISSIONS_ENGINE_PHASE_A2.md](./IDENTITY_PERMISSIONS_ENGINE_PHASE_A2.md) — permission catalog, role/user permissions, approval workflows, AI risk classification, session security, MFA readiness, identity audit. `/app/identity-access`, `lib/aipify/identity-permissions/`, migration `20260707000000_identity_permissions_engine_phase_a2.sql`. Secure boundaries for every user, role, and AI action.

**Secure AI Action Engine (Phase A.3):** See [SECURE_AI_ACTION_ENGINE_PHASE_A3.md](./SECURE_AI_ACTION_ENGINE_PHASE_A3.md) — action catalog, risk classification, execution requests, approval workflows, rollback readiness, AI recommendation engine. `/app/secure-ai-actions`, `lib/aipify/secure-ai-action/`, migration `20260708000000_secure_ai_action_engine_phase_a3.sql`. Secure operational AI actions within approval boundaries.

**Audit Log & Accountability Engine (Phase A.4):** See [AUDIT_ACCOUNTABILITY_ENGINE_PHASE_A4.md](./AUDIT_ACCOUNTABILITY_ENGINE_PHASE_A4.md) — immutable `audit_logs`, search/filter, compliance exports, retention policies, AI traceability, security event timeline. `/app/audit-accountability`, `lib/aipify/audit-accountability/`, migration `20260709000000_audit_accountability_engine_phase_a4.sql`. Transparency and trust for every critical action.

**Knowledge Center Engine (Phase A.5):** See [KNOWLEDGE_CENTER_ENGINE_PHASE_A5.md](./KNOWLEDGE_CENTER_ENGINE_PHASE_A5.md) — tenant-owned articles, FAQs, versioning, approval workflow, AI retrieval rules, search, and import. `/app/knowledge-center-engine`, `lib/aipify/knowledge-center-engine/`, migration `20260710000000_knowledge_center_engine_phase_a5.sql`. Trusted knowledge powering Support AI and Admin Assistant.

**Admin Assistant Engine (Phase A.6):** See [ADMIN_ASSISTANT_ENGINE_PHASE_A6.md](./ADMIN_ASSISTANT_ENGINE_PHASE_A6.md) — since-last-login, task center, recommendations, reminders, daily briefing, notifications, Knowledge Center integration. `/app/admin-assistant-engine`, `lib/aipify/admin-assistant-engine/`, migration `20260711000000_admin_assistant_engine_phase_a6.sql`. First operational AI module for administrators.

**Support AI Engine (Phase A.7):** See [SUPPORT_AI_ENGINE_PHASE_A7.md](./SUPPORT_AI_ENGINE_PHASE_A7.md) — customer-facing AI support, response modes, escalation, KC integration, satisfaction feedback, metrics. `/app/support-ai-engine`, `lib/aipify/support-ai-engine/`, migration `20260712000000_support_ai_engine_phase_a7.sql`. Faster, scalable support with human oversight.

**Aipify Self-Support Engine (Phase A.12):** See [AIPIFY_SELF_SUPPORT_ENGINE_PHASE_A12.md](./AIPIFY_SELF_SUPPORT_ENGINE_PHASE_A12.md) — knowledge-driven self-service for Aipify platform questions, confidence evaluation, escalation queue, feedback, and KC gap detection. `/app/self-support-engine`, `lib/aipify/self-support-engine/`, migration `20260717000000_aipify_self_support_engine_phase_a12.sql`. Distinct from Support AI (A.7) — helps customers with Aipify itself.

**Quality Guardian Engine (Phase A.13):** See [QUALITY_GUARDIAN_ENGINE_PHASE_A13.md](./QUALITY_GUARDIAN_ENGINE_PHASE_A13.md) — operational quality monitoring across support, knowledge, AI, approvals, integrations, and onboarding with explainable recommendations. `/app/quality-guardian-engine`, `lib/aipify/quality-guardian-engine/`, migration `20260718000000_quality_guardian_engine_phase_a13.sql`. Distinct from Phases 58–59 frontend/software QG at `/app/quality`.

**Integration Engine (Phase A.8):** See [INTEGRATION_ENGINE_PHASE_A8.md](./INTEGRATION_ENGINE_PHASE_A8.md) — secure tenant integrations, credential vault, sync engine, webhooks, Unonight pilot. `/app/integration-engine`, `lib/aipify/integration-engine/`, migration `20260713000000_integration_engine_phase_a8.sql`. Connect external systems with full auditability.

**Operations Dashboard Engine (Phase A.9):** See [OPERATIONS_DASHBOARD_ENGINE_PHASE_A9.md](./OPERATIONS_DASHBOARD_ENGINE_PHASE_A9.md) — unified operational widgets, role-based visibility, preferences, alerts, organization health score. `/app/operations-dashboard-engine`, `lib/aipify/operations-dashboard-engine/`, migration `20260714000000_operations_dashboard_engine_phase_a9.sql`. Cross-module operational visibility.

**Customer Onboarding Engine (Phase A.10):** See [CUSTOMER_ONBOARDING_ENGINE_PHASE_A10.md](./CUSTOMER_ONBOARDING_ENGINE_PHASE_A10.md) — 10-step guided flow, checklist, KC recommendations, progress tracking. `/app/customer-onboarding-engine`, `lib/aipify/customer-onboarding-engine/`, migration `20260715000000_customer_onboarding_engine_phase_a10.sql`. Guided setup for new organizations.

**Subscription & Plan Management Engine (Phase A.11):** See [SUBSCRIPTION_PLAN_MANAGEMENT_ENGINE_PHASE_A11.md](./SUBSCRIPTION_PLAN_MANAGEMENT_ENGINE_PHASE_A11.md) — tenant subscriptions, plan modules, trials, upgrade/downgrade safeguards, billing scaffold. `/app/subscription-plan-management-engine`, `lib/aipify/subscription-plan-management-engine/`, migration `20260716000000_subscription_plan_management_engine_phase_a11.sql`. Plan-based module access with full auditability; layers on commercial packages without breaking License Center.

**Governance & Policy Engine (Phase A.14):** See [GOVERNANCE_POLICY_ENGINE_PHASE_A14.md](./GOVERNANCE_POLICY_ENGINE_PHASE_A14.md) — tenant governance policies, violations, reviews, approval requirements, retention defaults. Integrates with Trust & Action Engine `action_policies` and Secure AI Actions. `/app/governance-policy-engine`, `lib/aipify/governance-policy-engine/`, migration `20260719000000_governance_policy_engine_phase_a14.sql`. Human oversight for sensitive actions.

**Notification & Communication Engine (Phase A.17):** See [NOTIFICATION_COMMUNICATION_ENGINE_PHASE_A17.md](./NOTIFICATION_COMMUNICATION_ENGINE_PHASE_A17.md) — org-scoped centralized communication with preferences, digests, actionable alerts, and `send_organization_notification()` for cross-phase modules. `/app/notification-communication-engine`, `lib/aipify/notification-communication-engine/`, migration `20260722000000_notification_communication_engine_phase_a17.sql`. Integrates with A.9 `organization_notifications`, Phase 25 Presence quiet hours, and Phase 26 Notification Engine.

**Observability & Platform Health Engine (Phase A.19):** See [OBSERVABILITY_PLATFORM_HEALTH_ENGINE_PHASE_A19.md](./OBSERVABILITY_PLATFORM_HEALTH_ENGINE_PHASE_A19.md) — tenant-scoped platform/service health monitoring with incidents, maintenance windows, and proactive alerting. `/app/observability-platform-health-engine`, `lib/aipify/observability-platform-health-engine/`, migration `20260724000000_observability_platform_health_engine_phase_a19.sql`. Distinct from A.13 Quality Guardian (operational quality). Integrates health signals from A.8 integrations, A.17 notifications, A.16 analytics, and auth audit tables.

**Deployment & Environment Management Engine (Phase A.20):** See [DEPLOYMENT_ENVIRONMENT_MANAGEMENT_ENGINE_PHASE_A20.md](./DEPLOYMENT_ENVIRONMENT_MANAGEMENT_ENGINE_PHASE_A20.md) — safe deployments, environment isolation, controlled releases, tenant-scoped feature flags, and rollback readiness. `/app/deployment-environment-management-engine`, `lib/aipify/deployment-environment-management-engine/`, migration `20260725000000_deployment_environment_management_engine_phase_a20.sql`. Integrates with Update Engine (Phase 18), Unonight Pilot (A.15), and Notification Engine (A.17).

**Aipify Install Engine (Phase A.22):** See [AIPIFY_INSTALL_ENGINE_PHASE_A22.md](./AIPIFY_INSTALL_ENGINE_PHASE_A22.md) — guided 8-step installation, environment discovery, permission review, recommendation engine, and KC initialization. `/app/aipify-install-engine`, `lib/aipify/aipify-install-engine/`, migration `20260726000000_aipify_install_engine_phase_a22.sql`. Extends Install Engine (Phase 17) — `lib/install/`, `/api/install/`, `/app/install`.

**Module Marketplace Foundation Engine (Phase A.23):** See [MODULE_MARKETPLACE_FOUNDATION_ENGINE_PHASE_A23.md](./MODULE_MARKETPLACE_FOUNDATION_ENGINE_PHASE_A23.md) — global module catalog, tenant activation, dependencies, and configuration. `/app/module-marketplace-foundation-engine`, `lib/aipify/module-marketplace-foundation-engine/`, migration `20260727000000_module_marketplace_foundation_engine_phase_a23.sql`. Extends `tenant_modules` and commercial packages.

**Aipify Internal Operations Engine (Phase A.24):** See [AIPIFY_INTERNAL_OPERATIONS_ENGINE_PHASE_A24.md](./AIPIFY_INTERNAL_OPERATIONS_ENGINE_PHASE_A24.md) — dogfooding dashboard for Aipify Group AS internal tenant with feature validation before public release. `/app/aipify-internal-operations-engine`, `lib/aipify/aipify-internal-operations-engine/`, migration `20260728000000_aipify_internal_operations_engine_phase_a24.sql`. Distinct from Platform Admin UI (`/platform/*`).

**Launch Readiness Engine (Phase A.25):** See [LAUNCH_READINESS_ENGINE_PHASE_A25.md](./LAUNCH_READINESS_ENGINE_PHASE_A25.md) — Go/No-Go checklist, launch reviews, and post-launch monitoring. `/app/launch-readiness-engine`, `lib/aipify/launch-readiness-engine/`, migration `20260729000000_launch_readiness_engine_phase_a25.sql`. Integrates Unonight Pilot outcomes (A.15).

**Customer Success Engine (Phase A.26):** See [CUSTOMER_SUCCESS_ENGINE_PHASE_A26.md](./CUSTOMER_SUCCESS_ENGINE_PHASE_A26.md) — health scoring, adoption tracking, interventions, and renewal risk detection. `/app/customer-success-engine`, `lib/aipify/customer-success-engine/`, migration `20260730000000_customer_success_engine_phase_a26.sql`. Integrates Customer Onboarding (A.10) and Subscription Plan Management (A.11).

**Aipify Status & Transparency Engine (Phase A.27):** See [AIPIFY_STATUS_TRANSPARENCY_ENGINE_PHASE_A27.md](./AIPIFY_STATUS_TRANSPARENCY_ENGINE_PHASE_A27.md) — public and internal status communication, incidents, maintenance notices, and uptime transparency. `/app/status-transparency-engine`, `lib/aipify/status-transparency-engine/`, migration `20260731000000_aipify_status_transparency_engine_phase_a27.sql`. Distinct from Observability & Platform Health (A.19).

**Enterprise Readiness Engine (Phase A.30):** See [ENTERPRISE_READINESS_ENGINE_PHASE_A30.md](./ENTERPRISE_READINESS_ENGINE_PHASE_A30.md) — enterprise health, delegated administration, approval chains, onboarding milestones, and deployment readiness hooks. `/app/enterprise-readiness-engine`, `lib/aipify/enterprise-readiness-engine/`, migration `20260801000000_enterprise_readiness_engine_phase_a30.sql`. Integrates Governance (A.14), Deployment (A.20), and Enterprise Deployment Framework (Phase 92).

**Unonight Pilot Operations Engine (Phase A.15):** See [UNONIGHT_PILOT_OPERATIONS_ENGINE_PHASE_A15.md](./UNONIGHT_PILOT_OPERATIONS_ENGINE_PHASE_A15.md) — first pilot customer validation dashboard with metadata-only metrics, milestones, feedback, and A.5–A.13 module aggregation. `/app/unonight-pilot-operations-engine`, `lib/aipify/unonight-pilot-operations-engine/`, migration `20260720000000_unonight_pilot_operations_engine_phase_a15.sql`. Unonight is a customer (`slug: unonight`), not platform owner.

**Quality Guardian / QG (Phases 58–59):** See [QG.md](./QG.md) — software and frontend health monitoring (Image Guardian, Performance Guardian, mobile checks) with observation-mode scans, incident engine, developer reports, and Knowledge Center integration. `/app/quality`, `/app/quality/images`, `lib/aipify/quality/`, migrations `20260614600000_quality_guardian_phase58.sql`, `20260614700000_frontend_experience_guardian_phase59.sql`.

**Quality Guardian Engine (Phase A.13):** See migration `20260718000000_quality_guardian_engine_phase_a13.sql` — tenant operational quality monitoring with explainable recommendations. `/app/quality-guardian-engine`, `lib/aipify/quality-guardian-engine/`.

**Analytics & Insights Engine (Phase A.16):** See [ANALYTICS_INSIGHTS_ENGINE_PHASE_A16.md](./ANALYTICS_INSIGHTS_ENGINE_PHASE_A16.md) — tenant operational analytics, KPIs, trends, explainable insights, exportable summary reports. `/app/analytics-insights-engine`, `lib/aipify/analytics-insights-engine/`, migration `20260721000000_analytics_insights_engine_phase_a16.sql`. Distinct from `/platform/metrics` (MRR/billing).

**Model-Agnostic Intelligence:** See [MODEL_AGNOSTIC_INTELLIGENCE.md](./MODEL_AGNOSTIC_INTELLIGENCE.md) — Aipify Intelligence is the product; LLMs are swappable infrastructure. Task-based routing via `lib/intelligence/` (`selectModelProfile`). Never brand customer UI with model providers. Enterprise BYOM via `customer_approved` policy.

**UI:** Minimal — Ask Aipify, Recommendations, Activity, Settings.

---

## Shared code

| Concern | Path |
|---------|------|
| UI primitives & brand | `components/ui/`, `components/shared/` |
| Cross-layer logic | `lib/core/`, `lib/intelligence/`, `services/core/`, `types/core/` |

Shared modules include plan limits, tenant utilities, domain validation, risk classification, presence states, and model-agnostic intelligence routing. **Do not duplicate** design components across platform / app / embed — import from `components/shared/`.

---

## Product packages

Defined in `lib/core/plans.ts`:

| Plan | Domains | Installations | Users | Highlights |
|------|---------|---------------|-------|------------|
| **Starter** | 1 | 1 | 1 | Presence, basic briefing, basic Support AI, knowledge base |
| **Growth** | 3 | 3 | 5 | + Action Center, health monitoring, recommendations, basic automations |
| **Business** | 10 | 10 | 25 | + Self-healing, advanced insights, Executive Center, teams |
| **Enterprise** | Custom | Custom | Custom | + Dedicated intelligence, permissions, custom modules, privacy controls |

---

## Feature placement rules

| If the feature… | Place under |
|-----------------|-------------|
| Manages **all** customers (Klarna, global patterns, platform billing) | `/platform` |
| Is used by **one** customer (team, domains, customer presence) | `/app` |
| Runs **inside** the customer's site (widget, heartbeat, embed assistant) | `/api/install`, `/api/embed` |

---

## Skill placement rules (Core Foundation §21)

Skills span all three layers. **Placement must be approved before implementation.**

| Layer | Purpose | Routes | Components |
|-------|---------|--------|------------|
| **Platform Admin** | Global skill governance, rollouts, metrics | `app/platform/skills/` | `components/platform/skills/` |
| **Customer App** | Installed skills, settings, activity, preferences | `app/app/skills/` | `components/app/skills/` |
| **Embedded** | Context, assistance, approved actions, health | `app/api/install/`, `app/api/embed/` | `components/embed/` |

**Workflow:** define skill → determine layer → permissions → approval requirements → implement → validate internally → pilot (Unonight) → public release. See `lib/core/skills.ts`.

**Mandatory:** Never place skills in existing folders out of convenience. Architecture before implementation.

---

## Database & authorization

- **Platform tables** may read across tenants (with admin checks).
- **Customer app tables** must filter by tenant on every query.
- **Install/embed** must validate tenant + installation + license.

**Platform roles:** `super_admin`, `platform_support` (see `platform_admins`)

**Customer roles:** `owner`, `admin`, `support`, `staff`, `read_only`

---

## Current inventory (migration status)

### Platform-only (stay under `/platform`)

Executive Center, Action Center (internal ops), Intelligence brain/learning/self-healing, global patterns, platform metrics, all customers/subscriptions/billing, system status, internal automations.

### Customer product (belongs under `/app`, currently partly under `/dashboard`)

Customer overview, assistant, installs, support, analytics, commerce, team, billing, settings, Presence Center (customer surface), daily briefings.

### Install / embed (partially exists)

`app/api/install/verify`, installation wizard APIs — extend under `app/api/install/` and `app/api/embed/`.

---

## Mandatory development rule

**Before implementing any new feature**, explicitly answer all four questions below. State the answers in the implementation plan or PR description. **If any question cannot be answered, pause implementation** until the architecture decision is made.

Architecture decisions come **before** implementation decisions. Never place new functionality into existing folders simply because they already exist.

### 1. Which layer does this belong to?

- [ ] **Platform Admin** — internal Aipify Group AS operations; manages all tenants
- [ ] **Customer App** — product customers buy and log into; one tenant per session
- [ ] **Embedded Installation** — runs inside the customer's website or admin system

### 2. Who is the user?

- [ ] **Aipify Internal Staff** (`super_admin`, `platform_admin`, `platform_support`)
- [ ] **Customer Owner** (`owner`)
- [ ] **Customer Team Member** (`admin`, `support`, `staff`, `read_only`)
- [ ] **Embedded End User** — operator inside the customer's CMS, store admin, or site (role mapped from host system)

### 3. What isolation level is required?

- [ ] **Global** — cross-tenant; platform tables and admin checks only
- [ ] **Tenant** — scoped by `tenant_id` / `customer_id` / `company_id` on every read and write
- [ ] **Installation** — scoped by installation token, domain, license limits, and allowed modules

### 4. Where should the code live?

Use this repo's paths (`app/`, not `src/app/`):

| Layer | Routes | Components | Logic | Types | Services |
|-------|--------|------------|-------|-------|----------|
| **Platform** | `app/platform/` | `components/platform/` | `lib/platform/` | `types/platform/` | `services/platform/` |
| **Customer** | `app/app/` | `components/app/` | `lib/app/` | `types/app/` | `services/app/` |
| **Embedded** | `app/api/install/`, `app/api/embed/` | `components/embed/` | `lib/install/`, `lib/embed/` | `types/install/` | `services/install/` |

Shared cross-layer code: `lib/core/`, `services/core/`, `types/core/`, `components/shared/`, `components/ui/`.

### After the decision

1. Create files **only** in the chosen layer's folders (see tables above).
2. Reuse `lib/core/` and `components/shared/` for shared behavior — do not duplicate.
3. Enforce tenant or installation isolation for Customer App and Embedded layers.
4. Update this document if you introduce a new top-level area.

---

## References

- [CORE_FOUNDATION.md](./CORE_FOUNDATION.md) — non-negotiable identity, mission, human control, privacy, core package
- [OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md) — agent governance, escalation, learning, presence, skills checklist
- Spec: `docs/cursor/AIPIFY-CORE-FOUNDATION.txt`
- Spec: `docs/cursor/AIPIFY-PRODUCT-ARCHITECTURE-SEPARATION.txt`
- Spec: `docs/cursor/AIPIFY-OPERATING-PRINCIPLES.txt`
- Spec: `docs/cursor/AIPIFY-SKILL-PLACEMENT-RULES.txt`
- [SKILL_ENGINE.md](./SKILL_ENGINE.md) — central skill registry and metadata
- Skill placement: `lib/core/skills/`
- Layer helpers: `lib/core/layers.ts`
- Plan limits: `lib/core/plans.ts`
- Customer nav: `lib/app/nav-config.ts`
