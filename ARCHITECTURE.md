# Aipify Product Architecture

**Prerequisites:** Read **[CORE_FOUNDATION.md](./CORE_FOUNDATION.md)** then **[OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md)** — foundation, behaviour, safety, and packages are decided before architecture and implementation. New skills come last.

**Aipify Business Operating System (ABOS):** See [ABOS_FOUNDATION.md](./ABOS_FOUNDATION.md). **Human Values Charter:** [HUMAN_VALUES_CHARTER.md](./HUMAN_VALUES_CHARTER.md) — cultural foundation for dignity, inclusion, and respectful assistance; ILM `human-values-charter.txt`, `lib/internal-language-model/human-values-charter-vocabulary.ts`; operationalized by [Inclusion & Humanity Engine (A.83)](./INCLUSION_HUMANITY_ENGINE_PHASE_A83.md). **Learning Journey Communication Standard:** [LEARNING_JOURNEY_COMMUNICATION_STANDARD.md](./LEARNING_JOURNEY_COMMUNICATION_STANDARD.md) — honest capability-gap phrasing and Aipify growth narrative; ILM `learning-journey-communication-standard.txt`, `lib/internal-language-model/learning-journey-vocabulary.ts`; integrated with Companion Identity A.84 and assistant pipeline (distinct from Learning Engine `/app/learning`). Terminology: [ABOS_BRAND_TERMINOLOGY_STANDARD.md](./ABOS_BRAND_TERMINOLOGY_STANDARD.md). **Action & Approval Engine:** [ACTION_APPROVAL_ENGINE.md](./ACTION_APPROVAL_ENGINE.md) — five-tier governance (Phase 30 Trust Actions · A.3 · A.40). **Context Intelligence Engine (A.77):** [CONTEXT_INTELLIGENCE_ENGINE.md](./CONTEXT_INTELLIGENCE_ENGINE.md) — organizational ABOS context at `/app/context-intelligence-engine` (distinct from Phase 35 calendars/UCL).

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

**Internal Language Model / ILM:** See [INTERNAL_LANGUAGE_MODEL.md](./INTERNAL_LANGUAGE_MODEL.md) — function vocabulary, command wording, NBLE, business phrases, proactive guidance, reminder follow-up language, and brand identity self-reference. `aipify-core/knowledge/internal-language-model/`, `lib/internal-language-model/`. Brand personhood: [BRAND_IDENTITY_PERSONHOOD_STANDARD.md](./BRAND_IDENTITY_PERSONHOOD_STANDARD.md).

**Brand Identity & Personhood Standard:** See [BRAND_IDENTITY_PERSONHOOD_STANDARD.md](./BRAND_IDENTITY_PERSONHOOD_STANDARD.md) — Aipify-first naming (not generic "AI" self-reference), address intent detection, reply adaptation. Corpus: `brand-identity-personhood.txt`. Code: `lib/internal-language-model/brand-identity.ts`. FAQ: `content/knowledge/aipify/brand-identity/`.

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

**Trust, Transparency & Explainability Engine (Phase 76) / ABOS Trust Engine:** See [TRUST_ENGINE.md](./TRUST_ENGINE.md) · [TRUST_TRANSPARENCY_EXPLAINABILITY_PHASE76.md](./TRUST_TRANSPARENCY_EXPLAINABILITY_PHASE76.md) — decision explanations, Trust Score, human override, feedback, audit, ABOS trust framing. `/app/trust`, `lib/aipify/trust-engine/`, migrations `20260616700000_trust_transparency_explainability_phase76.sql`, `20260926000000_trust_engine_abos_spec_alignment.sql`. Distinct from A.72 reputation at `/app/trust-reputation-engine`.

**Digital Twin & Organizational Model Engine (Phase 77):** See [DIGITAL_TWIN_ORGANIZATIONAL_MODEL_PHASE77.md](./DIGITAL_TWIN_ORGANIZATIONAL_MODEL_PHASE77.md) — responsibility-centric organizational model, process twin, escalation engine, knowledge routing, bottleneck detection, Twin Health. `/app/digital-twin`, `lib/aipify/digital-twin/`, migration `20260616800000_digital_twin_organizational_model_phase77.sql`. Models responsibilities — not people; never employee surveillance.

**Simulation & Decision Lab (Phase 78):** See [SIMULATION_DECISION_LAB_PHASE78.md](./SIMULATION_DECISION_LAB_PHASE78.md) — safe scenario modeling, outcome forecasting, scenario comparison, production isolation. `/app/simulations`, `lib/aipify/simulation-lab/`, migration `20260616900000_simulation_decision_lab_phase78.sql`. Simulation predicts; simulation never acts.

**Autonomous Operations Center (Phase 79):** See [AUTONOMOUS_OPERATIONS_CENTER_PHASE79.md](./AUTONOMOUS_OPERATIONS_CENTER_PHASE79.md) — operational health score, 10 watchers, recommendations, daily/weekly/executive reviews. `/app/operations`, `lib/aipify/aoc/`, migration `20260617000000_autonomous_operations_center_phase79.sql`. AOC observes and recommends; humans decide.

**Continuity, Resilience & Crisis Management (Phase 80):** See [CONTINUITY_RESILIENCE_CRISIS_PHASE80.md](./CONTINUITY_RESILIENCE_CRISIS_PHASE80.md) — continuity plans, backup ownership, incident mode, recovery tracking, readiness score. `/app/continuity`, `lib/aipify/continuity/`, migration `20260617100000_continuity_resilience_crisis_phase80.sql`. Aipify supports resilience; humans lead resilience.

**Strategic Intelligence & Opportunity Engine (Phase 81):** See [STRATEGIC_INTELLIGENCE_OPPORTUNITY_PHASE81.md](./STRATEGIC_INTELLIGENCE_OPPORTUNITY_PHASE81.md) — strategic scorecard, opportunity detection, risk tracking, horizon planning, advisory recommendations. `/app/strategy`, `lib/aipify/strategy/`, migration `20260617200000_strategic_intelligence_opportunity_phase81.sql`. Aipify recommends strategy; humans decide strategy.

**Experience, Adoption & Human Success (Phase 82):** See [EXPERIENCE_ADOPTION_HUMAN_SUCCESS_PHASE82.md](./EXPERIENCE_ADOPTION_HUMAN_SUCCESS_PHASE82.md) — adoption score, Human Success score, smart onboarding, success journeys, friction detection, champions. `/app/human-success`, `lib/aipify/human-success/`, migration `20260617300000_experience_adoption_human_success_phase82.sql`. Technology succeeds when people succeed.

**Humor, Warmth & Human Connection (Core Behavior Layer):** See [HUMOR_WARMTH_HUMAN_CONNECTION.md](./HUMOR_WARMTH_HUMAN_CONNECTION.md) and ABOS spec [HUMOR_PERSONAL_CONNECTION_ENGINE.md](./HUMOR_PERSONAL_CONNECTION_ENGINE.md) — personality modes, context-aware humor, emoji guidelines, warm messaging framework, trust boundaries, personal connection. `/app/personality`, `lib/aipify/personality/`, `lib/aipify/communication/`, `lib/internal-language-model/humor-personal-connection-vocabulary.ts`, migrations `20260617400000_humor_warmth_human_connection.sql`, `20260931000000_humor_personal_connection_engine_abos_spec_alignment.sql`. Competent first. Human second. Funny third.

**Playful Moments & Bell Personality Seed:** See [PLAYFUL_MOMENTS_BELL_PERSONALITY_SEED.md](./PLAYFUL_MOMENTS_BELL_PERSONALITY_SEED.md) — extends `/app/personality` (not a new route): bell signature moments, fox exchange, harmless humor memory prefs, `get_playful_bell_moment()`, `lib/internal-language-model/playful-moments-bell-vocabulary.ts`, migration `20260932000000_playful_moments_bell_personality_seed.sql`, API `GET /api/aipify/personality/bell-moment`.

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

**Development Priority Roadmap:** See [DEVELOPMENT_PRIORITY_ROADMAP.md](./DEVELOPMENT_PRIORITY_ROADMAP.md) — recommended build order for Phases A–D (Core Foundation, Business Operations, Advanced Enterprise, Commerce Intelligence), Self Love Engine™ placement, and current alignment with implemented repo phases.

**Platform Install Connectors (Phase 100):** See [PLATFORM_INSTALL_CONNECTORS_PHASE100.md](./PLATFORM_INSTALL_CONNECTORS_PHASE100.md) — WordPress, Shopify, WooCommerce, Other Platforms connectors, 14-day trial billing, install wizard, health checks, Stripe Checkout. `/app/platform-install`, `lib/aipify/platform-install/`, migration `20260629000000_platform_install_connectors_phase100.sql`. Installation should feel simple.

**Commerce Intelligence Engine (Phase 101):** See [COMMERCE_INTELLIGENCE_ENGINE_PHASE101.md](./COMMERCE_INTELLIGENCE_ENGINE_PHASE101.md) — trend products, product discovery, margin analysis, supplier insights, opportunity scores, risk detection, store fit. `/app/commerce-intelligence`, `lib/aipify/commerce-intelligence/`, migration `20260630000000_commerce_intelligence_engine_phase101.sql`. Find better products. Grow smarter.

**Product Automation Engine (Phase 102):** See [PRODUCT_AUTOMATION_ENGINE_PHASE102.md](./PRODUCT_AUTOMATION_ENGINE_PHASE102.md) — product import, translation, rewriting, SEO optimization, category suggestions, approval workflow, bulk automation, quality validation. `/app/product-automation`, `lib/aipify/product-automation/`, migration `20260701000000_product_automation_engine_phase102.sql`. From product discovery to store-ready content in minutes.

**Dropshipping Operations Center (Phase 103):** See [DROPSHIPPING_OPERATIONS_CENTER_PHASE103.md](./DROPSHIPPING_OPERATIONS_CENTER_PHASE103.md) — supplier monitoring, product watchlists, delivery risk, order health, opportunity alerts, escalations. `/app/dropshipping-operations`, `lib/aipify/dropshipping-operations/`, migration `20260702000000_dropshipping_operations_center_phase103.sql`. Run your dropshipping business with confidence.

**Commerce Performance & Profit Engine (Phase 104):** See [COMMERCE_PERFORMANCE_PROFIT_ENGINE_PHASE104.md](./COMMERCE_PERFORMANCE_PROFIT_ENGINE_PHASE104.md) — performance dashboard, profit intelligence, product profitability, customer value, revenue trends, loss prevention, executive reporting. `/app/commerce-performance`, `lib/aipify/commerce-performance/`, migration `20260703000000_commerce_performance_profit_engine_phase104.sql`. Revenue is important. Profit is essential.

**Multi-Store Orchestration Engine (Phase 105):** See [MULTI_STORE_ORCHESTRATION_ENGINE_PHASE105.md](./MULTI_STORE_ORCHESTRATION_ENGINE_PHASE105.md) — unified portfolio dashboard, store management, cross-store insights, sync guidance, governance coordination, regional expansion. `/app/multi-store`, `lib/aipify/multi-store-orchestration/`, migration `20260704000000_multi_store_orchestration_engine_phase105.sql`. Manage many stores as if they were one ecosystem.

**Aipify Core Platform Foundation (Phase A):** See [AIPIFY_CORE_PLATFORM_PHASE_A.md](./AIPIFY_CORE_PLATFORM_PHASE_A.md) — multi-tenant SaaS foundation, authentication & roles, permission engine, audit logging, AI action framework, module framework, API layer, integrations, Knowledge Center foundation, dashboard widgets. `/app/aipify-core`, `lib/aipify/core-platform/`, migration `20260705000000_aipify_core_platform_phase_a.sql`. The foundational operating system powering all Aipify modules.

**Multi-Tenant Architecture Engine (Phase A.1):** See [MULTI_TENANT_ARCHITECTURE_PHASE_A1.md](./MULTI_TENANT_ARCHITECTURE_PHASE_A1.md) — organizations, organization_users, module activation, tenant settings, audit logs, integrations, KC FAQ items, tenant switching, RLS isolation. `/app/multi-tenant`, `lib/aipify/multi-tenant-architecture/`, migration `20260706000000_multi_tenant_architecture_phase_a1.sql`. Secure multi-customer SaaS from one platform.

**Identity, Roles & Permission Engine (Phase A.2):** See [IDENTITY_PERMISSIONS_ENGINE_PHASE_A2.md](./IDENTITY_PERMISSIONS_ENGINE_PHASE_A2.md) — permission catalog, role/user permissions, approval workflows, AI risk classification, session security, MFA readiness, identity audit. `/app/identity-access`, `lib/aipify/identity-permissions/`, migration `20260707000000_identity_permissions_engine_phase_a2.sql`. **Implementation Blueprint Phase 2** spec alignment: [IMPLEMENTATION_BLUEPRINT_PHASE2_USER_ROLE_PERMISSION_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE2_USER_ROLE_PERMISSION_FOUNDATION.md), migration `20260947000000_implementation_blueprint_phase2_user_role_permission.sql`. Extends Organization & Workspace Engine (A.75). Default roles, permission categories, access review settings, companion permission prefs, and Phase 2 success criteria on dashboard.

**Secure AI Action Engine (Phase A.3):** See [SECURE_AI_ACTION_ENGINE_PHASE_A3.md](./SECURE_AI_ACTION_ENGINE_PHASE_A3.md) — action catalog, risk classification, execution requests, approval workflows, rollback readiness, AI recommendation engine. `/app/secure-ai-actions`, `lib/aipify/secure-ai-action/`, migration `20260708000000_secure_ai_action_engine_phase_a3.sql`. Secure operational AI actions within approval boundaries.

**Audit Log & Accountability Engine (Phase A.4):** See [AUDIT_ACCOUNTABILITY_ENGINE_PHASE_A4.md](./AUDIT_ACCOUNTABILITY_ENGINE_PHASE_A4.md) — immutable `audit_logs`, search/filter, compliance exports, retention policies, AI traceability, security event timeline. `/app/audit-accountability`, `lib/aipify/audit-accountability/`, migration `20260709000000_audit_accountability_engine_phase_a4.sql`. Transparency and trust for every critical action.

**Knowledge Center Engine (Phase A.5):** See [KNOWLEDGE_CENTER_ENGINE_PHASE_A5.md](./KNOWLEDGE_CENTER_ENGINE_PHASE_A5.md) — tenant-owned articles, FAQs, versioning, approval workflow, AI retrieval rules, search, and import. `/app/knowledge-center-engine`, `lib/aipify/knowledge-center-engine/`, migration `20260710000000_knowledge_center_engine_phase_a5.sql`. Trusted knowledge powering Support AI and Admin Assistant. **Implementation Blueprint Phase 3** spec alignment: [IMPLEMENTATION_BLUEPRINT_PHASE3_KNOWLEDGE_CENTER_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE3_KNOWLEDGE_CENTER_FOUNDATION.md), migration `20260948000000_implementation_blueprint_phase3_knowledge_center.sql`. Extends Organization & Workspace (A.75) Phase 1. Knowledge evolution scaffold metadata, live success criteria, dogfood categories for `aipify-group` and `unonight`. Distinct from KC Phase 55 self-knowledge at `/app/knowledge-center`.

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

**Aipify Install Engine (Phase A.22) / Install & Adoption Engine (ABOS):** See [AIPIFY_INSTALL_ENGINE_PHASE_A22.md](./AIPIFY_INSTALL_ENGINE_PHASE_A22.md) and [INSTALL_ADOPTION_ENGINE.md](./INSTALL_ADOPTION_ENGINE.md) — guided 8-step installation, environment discovery, permission review, adoption journey, and KC initialization. `/app/aipify-install-engine`, `lib/aipify/aipify-install-engine/`, migration `20260726000000_aipify_install_engine_phase_a22.sql`, ABOS alignment `20260950000000_install_adoption_engine_abos_spec_alignment.sql`. Extends Install Engine (Phase 17) — `lib/install/`, `/api/install/`, `/app/install`. Technology adapts to people — organizations do not rebuild around Aipify.

**Module Marketplace Foundation Engine (Phase A.23):** See [MODULE_MARKETPLACE_FOUNDATION_ENGINE_PHASE_A23.md](./MODULE_MARKETPLACE_FOUNDATION_ENGINE_PHASE_A23.md) — global module catalog, tenant activation, dependencies, and configuration. `/app/module-marketplace-foundation-engine`, `lib/aipify/module-marketplace-foundation-engine/`, migration `20260727000000_module_marketplace_foundation_engine_phase_a23.sql`. Extends `tenant_modules` and commercial packages.

**Aipify Internal Operations Engine (Phase A.24):** See [AIPIFY_INTERNAL_OPERATIONS_ENGINE_PHASE_A24.md](./AIPIFY_INTERNAL_OPERATIONS_ENGINE_PHASE_A24.md) — dogfooding dashboard for Aipify Group AS internal tenant with feature validation before public release. `/app/aipify-internal-operations-engine`, `lib/aipify/aipify-internal-operations-engine/`, migration `20260728000000_aipify_internal_operations_engine_phase_a24.sql`. Distinct from Platform Admin UI (`/platform/*`).

**Launch Readiness Engine (Phase A.25):** See [LAUNCH_READINESS_ENGINE_PHASE_A25.md](./LAUNCH_READINESS_ENGINE_PHASE_A25.md) — Go/No-Go checklist, launch reviews, and post-launch monitoring. `/app/launch-readiness-engine`, `lib/aipify/launch-readiness-engine/`, migration `20260729000000_launch_readiness_engine_phase_a25.sql`. Integrates Unonight Pilot outcomes (A.15).

**Customer Success Engine (Phase A.26):** See [CUSTOMER_SUCCESS_ENGINE_PHASE_A26.md](./CUSTOMER_SUCCESS_ENGINE_PHASE_A26.md) — health scoring, adoption tracking, interventions, and renewal risk detection. `/app/customer-success-engine`, `lib/aipify/customer-success-engine/`, migration `20260730000000_customer_success_engine_phase_a26.sql`. Integrates Customer Onboarding (A.10) and Subscription Plan Management (A.11).

**Aipify Status & Transparency Engine (Phase A.27):** See [AIPIFY_STATUS_TRANSPARENCY_ENGINE_PHASE_A27.md](./AIPIFY_STATUS_TRANSPARENCY_ENGINE_PHASE_A27.md) — public and internal status communication, incidents, maintenance notices, and uptime transparency. `/app/status-transparency-engine`, `lib/aipify/status-transparency-engine/`, migration `20260731000000_aipify_status_transparency_engine_phase_a27.sql`. Distinct from Observability & Platform Health (A.19).

**Innovation & Impact Engine (Phase A.28):** See [INNOVATION_IMPACT_ENGINE_PHASE_A28.md](./INNOVATION_IMPACT_ENGINE_PHASE_A28.md) — baseline capture, impact metrics, case studies, and exportable reports. `/app/innovation-impact-engine`, `lib/aipify/innovation-impact-engine/`, migration `20260811000000_innovation_impact_engine_phase_a28.sql`. Metadata-only impact proof; integrates with Analytics (A.16) and Unonight Pilot (A.15).

**Compliance & Regulatory Readiness Engine (Phase A.29):** See [COMPLIANCE_REGULATORY_READINESS_ENGINE_PHASE_A29.md](./COMPLIANCE_REGULATORY_READINESS_ENGINE_PHASE_A29.md) — compliance records, retention policies, access reviews, and scheduled reviews. `/app/compliance-regulatory-readiness-engine`, `lib/aipify/compliance-regulatory-readiness-engine/`, migration `20260812000000_compliance_regulatory_readiness_engine_phase_a29.sql`. Operational readiness — not legal advice. Integrates Governance (A.14).

**Strategic Intelligence Foundation Engine (Phase A.31):** See [STRATEGIC_INTELLIGENCE_FOUNDATION_ENGINE_PHASE_A31.md](./STRATEGIC_INTELLIGENCE_FOUNDATION_ENGINE_PHASE_A31.md) — explainable strategic insights, opportunity/risk detection from operational data. `/app/strategic-intelligence-foundation-engine`, `lib/aipify/strategic-intelligence-foundation-engine/`, migration `20260813000000_strategic_intelligence_foundation_engine_phase_a31.sql`. Human-centered decision support; integrates Support AI (A.7), Quality Guardian (A.13), Customer Success (A.26).

**Operations Center Foundation Engine (Phase A.32):** See [OPERATIONS_CENTER_FOUNDATION_ENGINE_PHASE_A32.md](./OPERATIONS_CENTER_FOUNDATION_ENGINE_PHASE_A32.md) — cross-module operational events, assignments, escalations. `/app/operations-center-foundation-engine`, `lib/aipify/operations-center-foundation-engine/`, migration `20260814000000_operations_center_foundation_engine_phase_a32.sql`. Distinct from `/app/command-center` and `/app/operations`. Aggregates Admin Assistant, Support AI, Quality, Integrations, Governance.

**Continuous Improvement Engine (Phase A.33):** See [CONTINUOUS_IMPROVEMENT_ENGINE_PHASE_A33.md](./CONTINUOUS_IMPROVEMENT_ENGINE_PHASE_A33.md) — feedback collection, improvement workflow, outcome validation. `/app/continuous-improvement-engine`, `lib/aipify/continuous-improvement-engine/`, migration `20260815000000_continuous_improvement_engine_phase_a33.sql`. Human-guided — no silent auto-implementation.

**Continuous Improvement Engine enhancement (Phase A.49):** See [CONTINUOUS_IMPROVEMENT_ENGINE_PHASE_A49.md](./CONTINUOUS_IMPROVEMENT_ENGINE_PHASE_A49.md) — extends A.33 with improvement initiatives, review cycles, success measurements, organizational memory hooks, and recommendation RPCs. Same route; migration `20260825000000_continuous_improvement_engine_phase_a49_enhancement.sql`. Adds `improvements.review` permission.
**Workflow Orchestration Engine (Phase A.42):** See [WORKFLOW_ORCHESTRATION_ENGINE_PHASE_A42.md](./WORKFLOW_ORCHESTRATION_ENGINE_PHASE_A42.md) — human-defined org workflows, templates, step approvals, execution audit. `/app/workflow-orchestration-engine`, `lib/aipify/workflow-orchestration-engine/`, migration `20260818000000_workflow_orchestration_engine_phase_a42.sql`. Extends Operations Center (A.32), Human Oversight (A.40), Delegated Trust scaffold (A.41). Distinct from platform orchestration (Phase 68).

**Business Packs Foundation Engine (Phase A.43):** See [BUSINESS_PACKS_FOUNDATION_ENGINE_PHASE_A43.md](./BUSINESS_PACKS_FOUNDATION_ENGINE_PHASE_A43.md) — curated industry/operational packs with select → review → activate → customize flow. `/app/business-packs-foundation-engine`, `lib/aipify/business-packs-foundation-engine/`, migration `20260819000000_business_packs_foundation_engine_phase_a43.sql`. Activates modules (A.23), workflows (A.42 scaffold), and install context (A.22). Distinct from Commercial Packages module licensing.

**Industry Intelligence Foundation Engine (Phase A.44):** See [INDUSTRY_INTELLIGENCE_FOUNDATION_ENGINE_PHASE_A44.md](./INDUSTRY_INTELLIGENCE_FOUNDATION_ENGINE_PHASE_A44.md) — industry-specific patterns, terminology, operational priorities, and explainable recommendations with human override. `/app/industry-intelligence-foundation-engine`, `lib/aipify/industry-intelligence-foundation-engine/`, migration `20260820000000_industry_intelligence_foundation_engine_phase_a44.sql`. Extends Business Packs (A.43), Organizational Memory (A.34), and Strategic Intelligence (A.31). Metadata-only export via `export_organization_industry_insights()`.

**Marketplace & Partner Ecosystem Foundation Engine (Phase A.45):** See [MARKETPLACE_PARTNER_ECOSYSTEM_FOUNDATION_ENGINE_PHASE_A45.md](./MARKETPLACE_PARTNER_ECOSYSTEM_FOUNDATION_ENGINE_PHASE_A45.md) — certified partners, marketplace offerings, certification workflow, and quality indicators with human approval. `/app/marketplace-partner-ecosystem-foundation-engine`, `lib/aipify/marketplace-partner-ecosystem-foundation-engine/`, migration `20260821000000_marketplace_partner_ecosystem_foundation_engine_phase_a45.sql`. Extends Module Marketplace (A.23), Business Packs (A.43), and API Platform scaffold (A.21).

**AI Ethics & Responsible Use Engine (Phase A.46):** See [AI_ETHICS_RESPONSIBLE_USE_ENGINE_PHASE_A46.md](./AI_ETHICS_RESPONSIBLE_USE_ENGINE_PHASE_A46.md) — documented AI use cases, explainability requirements, prohibited examples, ethics review, and policy exceptions with audit. `/app/ai-ethics-responsible-use-engine`, `lib/aipify/ai-ethics-responsible-use-engine/`, migration `20260822000000_ai_ethics_responsible_use_engine_phase_a46.sql`. Extends Security & Trust (A.18), Compliance (A.29), Human Oversight (A.40), and Delegated Trust scaffold (A.41).

**Value Realization Engine (Phase A.48):** See [VALUE_REALIZATION_ENGINE_PHASE_A48.md](./VALUE_REALIZATION_ENGINE_PHASE_A48.md) — outcome-focused value measurement with baselines, milestones, executive reports, and improvement suggestions. `/app/value-realization-engine`, `lib/aipify/value-realization-engine/`, migration `20260824000000_value_realization_engine_phase_a48.sql`. Extends Customer Success (A.26), Innovation & Impact (A.28), Executive Insights (A.35), and Change Management (A.47). Metadata only — no PII.

**Organizational Resilience Engine (Phase A.50) / ABOS Resilience Engine:** See [ORGANIZATIONAL_RESILIENCE_ENGINE_PHASE_A50.md](./ORGANIZATIONAL_RESILIENCE_ENGINE_PHASE_A50.md) and [RESILIENCE_ENGINE.md](./RESILIENCE_ENGINE.md) — scenario-based continuity plans, simulations, vulnerability tracking, and structured reviews with human approval. `/app/organizational-resilience-engine`, `lib/aipify/organizational-resilience-engine/`, migrations `20260826000000_organizational_resilience_engine_phase_a50.sql`, `20260930000000_resilience_engine_abos_spec_alignment.sql`. Complements Continuity Phase 80 (`/app/continuity`). Extends Security & Trust (A.18), Operations Center Foundation (A.32), Executive Insights (A.35), Organizational Memory (A.34), and Continuous Improvement (A.33). Metadata only — no PII.

**Incident Response Coordination Engine (Phase A.51):** See [INCIDENT_RESPONSE_COORDINATION_ENGINE_PHASE_A51.md](./INCIDENT_RESPONSE_COORDINATION_ENGINE_PHASE_A51.md) — coordinated incident response with ownership, escalation, communications, timeline events, and lessons learned. `/app/incident-response-coordination-engine`, `lib/aipify/incident-response-coordination-engine/`, migration `20260827000000_incident_response_coordination_engine_phase_a51.sql`. Extends Operations Center Foundation (A.32), Executive Insights (A.35), and Organizational Resilience (A.50). Metadata only — no PII.

**Service Level & Commitment Engine (Phase A.52):** See [SERVICE_LEVEL_COMMITMENT_ENGINE_PHASE_A52.md](./SERVICE_LEVEL_COMMITMENT_ENGINE_PHASE_A52.md) — operational service commitments with compliance tracking, alerts, and executive export. `/app/service-level-commitment-engine`, `lib/aipify/service-level-commitment-engine/`, migration `20260828000000_service_level_commitment_engine_phase_a52.sql`. Extends Customer Success (A.26), Operations Center Foundation (A.32), and Incident Response (A.51). Permissions `commitments.*`. Metadata only — no PII.

**Stakeholder Communication Engine (Phase A.53):** See [STAKEHOLDER_COMMUNICATION_ENGINE_PHASE_A53.md](./STAKEHOLDER_COMMUNICATION_ENGINE_PHASE_A53.md) — coordinated stakeholder communications with multi-channel delivery, engagement tracking, and org memory outcomes. `/app/stakeholder-communication-engine`, `lib/aipify/stakeholder-communication-engine/`, migration `20260829000000_stakeholder_communication_engine_phase_a53.sql`. Extends Customer Success (A.26), Executive Insights (A.35), Change Management (A.47), and Incident Response (A.51). Permissions `communications.*` — distinct from `notifications.*`. Metadata only — no PII.

**Organizational Decision Support Engine (Phase A.54):** See [ORGANIZATIONAL_DECISION_SUPPORT_ENGINE_PHASE_A54.md](./ORGANIZATIONAL_DECISION_SUPPORT_ENGINE_PHASE_A54.md) — structured organizational decision recommendations with human review, approval workflows, and outcome tracking. `/app/organizational-decision-support-engine`, nav id `organizationalDecisionSupportEngine`, `lib/aipify/organizational-decision-support-engine/`, migration `20260830000000_organizational_decision_support_engine_phase_a54.sql`. Distinct from Assistant DSE at `/app/assistant/decisions`. Permissions `decisions.*`. Metadata only — no PII.

**Strategic Alignment Engine (Phase A.55):** See [STRATEGIC_ALIGNMENT_ENGINE_PHASE_A55.md](./STRATEGIC_ALIGNMENT_ENGINE_PHASE_A55.md) — strategic objectives, entity linking, alignment reviews, misalignment detection, and executive strategic summaries. `/app/strategic-alignment-engine`, nav id `strategicAlignmentEngine`, `lib/aipify/strategic-alignment-engine/`, migration `20260831000000_strategic_alignment_engine_phase_a55.sql`. Extends Executive Insights (A.35), Value Realization (A.48), and Organizational Decision Support (A.54). Distinct from legacy Strategy Engine at `/app/strategy`. Permissions `strategy.*`. Metadata only — no PII.

**Organizational Health Engine (Phase A.56):** See [ORGANIZATIONAL_HEALTH_ENGINE_PHASE_A56.md](./ORGANIZATIONAL_HEALTH_ENGINE_PHASE_A56.md) — aggregate metadata-only health indicators across operational domains with human-approved interventions and executive health summaries. `/app/organizational-health-engine`, nav id `organizationalHealthEngine`, `lib/aipify/organizational-health-engine/`, migration `20260901000000_organizational_health_engine_phase_a56.sql`. Distinct from Observability Platform Health (A.21). Permissions `health.*`. Metadata only — no PII.

**Capability Maturity Engine (Phase A.57):** See [CAPABILITY_MATURITY_ENGINE_PHASE_A57.md](./CAPABILITY_MATURITY_ENGINE_PHASE_A57.md) — domain-based capability maturity assessments (levels 1–5), improvement roadmaps with learning requirements, and executive maturity reporting. `/app/capability-maturity-engine`, nav id `capabilityMaturityEngine`, `lib/aipify/capability-maturity-engine/`, migration `20260902000000_capability_maturity_engine_phase_a57.sql`. Extends Learning & Training (A.36), Value Realization (A.48), and Strategic Alignment (A.55). Prefix `_cma_` (distinct from change-management `_cme_`). Permissions `maturity.*`. Metadata only — no PII.

**Organizational Benchmarking Engine (Phase A.58):** See [ORGANIZATIONAL_BENCHMARKING_ENGINE_PHASE_A58.md](./ORGANIZATIONAL_BENCHMARKING_ENGINE_PHASE_A58.md) — metadata benchmark comparisons against internal baselines and anonymized industry signals with position metadata, recommendations, and executive exports. `/app/organizational-benchmarking-engine`, nav id `organizationalBenchmarkingEngine`, `lib/aipify/organizational-benchmarking-engine/`, migration `20260903000000_organizational_benchmarking_engine_phase_a58.sql`. Extends Industry Intelligence (A.44), Value Realization (A.48), Organizational Health (A.56), and Capability Maturity (A.57). Permissions `benchmarks.*`. Metadata only — no PII.

**Document & Output Engine (Phase A.59 — CRITICAL V1):** See [DOCUMENT_OUTPUT_ENGINE_PHASE_A59.md](./DOCUMENT_OUTPUT_ENGINE_PHASE_A59.md) — unified templates, generation, scheduling, delivery, and workflow hooks for operational outputs. `/app/document-output-engine`, nav id `documentOutputEngine`, `lib/aipify/document-output-engine/`, migration `20260904000000_document_output_engine_phase_a59.sql`. Extends API Platform (A.21), Executive Insights (A.35), Certification (A.37), Workflow Orchestration (A.42), Value Realization (A.48), and Incident Response (A.51). Permissions `outputs.*`. Metadata-only file generation via adapter layer — no raw PII in audit.

**Records & Retention Management Engine (Phase A.60):** See [RECORDS_RETENTION_MANAGEMENT_ENGINE_PHASE_A60.md](./RECORDS_RETENTION_MANAGEMENT_ENGINE_PHASE_A60.md) — retention policies, metadata-only archives, disposal approvals, and compliance snapshots. `/app/records-retention-management-engine`, nav id `recordsRetentionManagementEngine`, `lib/aipify/records-retention-management-engine/`, migration `20260905000000_records_retention_management_engine_phase_a60.sql`. Extends Security & Trust (A.18), Compliance (A.29), Organizational Memory (A.34), and Document & Output (A.59). Permissions `records.*`. Metadata only — no raw record content.

**Meeting & Collaboration Intelligence Engine (Phase A.61):** See [MEETING_COLLABORATION_INTELLIGENCE_ENGINE_PHASE_A61.md](./MEETING_COLLABORATION_INTELLIGENCE_ENGINE_PHASE_A61.md) — structured meeting lifecycle with agenda, summaries, decisions, action items, and output hooks. `/app/meeting-collaboration-intelligence-engine`, nav id `meetingCollaborationIntelligenceEngine`, `lib/aipify/meeting-collaboration-intelligence-engine/`, migration `20260906000000_meeting_collaboration_intelligence_engine_phase_a61.sql`. Extends Context Engine calendars, Stakeholder Communication (A.53), Workflow Orchestration (A.42), and Document & Output (A.59). Permissions `meetings.*`. Metadata only — no raw transcripts.

**Unified Task & Follow-Up Engine (Phase A.62):** See [UNIFIED_TASK_FOLLOW_UP_ENGINE_PHASE_A62.md](./UNIFIED_TASK_FOLLOW_UP_ENGINE_PHASE_A62.md) — organizational task capture, assignment, reminders, escalations, and calendar sync scaffold across modules. `/app/unified-task-follow-up-engine`, nav id `unifiedTaskFollowUpEngine`, `lib/aipify/unified-task-follow-up-engine/`, migration `20260907000000_unified_task_follow_up_engine_phase_a62.sql`. Table `organization_tasks` (not PAME personal tasks). Extends Operations Center (A.32), Workflow Orchestration (A.42), Meeting & Collaboration (A.61), Organizational Memory (A.34). Permissions `tasks.*`. Metadata only — no PII in payloads.

**Resource Planning Engine (Phase A.63):** See [RESOURCE_PLANNING_ENGINE_PHASE_A63.md](./RESOURCE_PLANNING_ENGINE_PHASE_A63.md) — resource plans, allocations, utilization tracking, scenario comparison, and capacity recommendations. `/app/resource-planning-engine`, nav id `resourcePlanningEngine`, `lib/aipify/resource-planning-engine/`, migration `20260908000000_resource_planning_engine_phase_a63.sql`. Extends Operations Center (A.32), Decision Support (A.54), Strategic Alignment (A.55), Unified Task & Follow-Up (A.62), Organizational Memory (A.34). Permissions `resources.*`. Metadata only — no raw financial records or PII.

**Capacity & Workload Management Engine (Phase A.64):** See [CAPACITY_WORKLOAD_MANAGEMENT_ENGINE_PHASE_A64.md](./CAPACITY_WORKLOAD_MANAGEMENT_ENGINE_PHASE_A64.md) — capacity profiles, workload items, overload warnings, and rebalancing recommendations. `/app/capacity-workload-management-engine`, nav id `capacityWorkloadManagementEngine`, `lib/aipify/capacity-workload-management-engine/`, migration `20260909000000_capacity_workload_management_engine_phase_a64.sql`. Extends Unified Task & Follow-Up (A.62), Resource Planning (A.63), Operations Center (A.32), Organizational Health (A.56). Permissions `capacity.*` and `workload.*`. Reassignment recommend-only unless org enables auto-reassign.

**Companion Presence Indicator & Online Status Engine (Phase A.67):** See [COMPANION_PRESENCE_INDICATOR_PHASE_A67.md](./COMPANION_PRESENCE_INDICATOR_PHASE_A67.md) — floating Aipify companion orb on Customer App routes with heartbeat, derived states, since-last-login summaries, and quiet mode. Wired via `DashboardShell` on `/app/*`, settings at `/app/settings/companion-presence`, API `GET/PATCH /api/presence/companion/state`, `POST /api/presence/companion/heartbeat`, `lib/presence/companion-presence.ts`, `lib/core/companion-presence.ts`, `lib/aipify/companion-presence-engine/`, migration `20260911500000_companion_presence_indicator_phase_a67.sql`. Extends Command Center (A.26), Desktop Presence (A.25), Admin Assistant (A.6). Permissions `companion.view` · `companion.manage`. System presence only — not employee surveillance.

**Goals & OKR Engine (Phase A.65):** See [GOALS_OKR_ENGINE_PHASE_A65.md](./GOALS_OKR_ENGINE_PHASE_A65.md) — organizational objectives and key results with hierarchy, progress tracking, and task integration. `/app/goals-okr-engine`, nav id `goalsOkrEngine`, `lib/aipify/goals-okr-engine/`, migration `20260910000000_goals_okr_engine_phase_a65.sql`. Extends Executive Insights (A.35), Strategic Alignment (A.55), Unified Task & Follow-Up (A.62), Capacity & Workload (A.64), Organizational Memory (A.34). Permissions `okr.*`. Distinct from personal Goals & Dreams Engine (GDE). Metadata only — humans approve activation and completion.

**Predictive Insights Engine (Phase A.66):** See [PREDICTIVE_INSIGHTS_ENGINE_PHASE_A66.md](./PREDICTIVE_INSIGHTS_ENGINE_PHASE_A66.md) — forward-looking operational predictions with confidence and risk scoring. `/app/predictive-insights-engine`, nav id `predictiveInsightsEngine`, `lib/aipify/predictive-insights-engine/`, migration `20260911000000_predictive_insights_engine_phase_a66.sql`. Integrates Strategic Intelligence (A.31), Executive Insights (A.35), Analytics Insights (A.48), Organizational Health (A.56), Goals & OKR (A.65). Permissions `predictions.*`. Metadata only — predictions inform, humans decide.

**Personal Productivity Engine (Phase A.70):** See [PERSONAL_PRODUCTIVITY_ENGINE_PHASE_A70.md](./PERSONAL_PRODUCTIVITY_ENGINE_PHASE_A70.md) — per-user productivity preferences, daily briefings, reminders, and focus recommendations. `/app/personal-productivity-engine`, nav id `personalProductivityEngine`, `lib/aipify/personal-productivity-engine/`, migration `20260912000000_personal_productivity_engine_phase_a70.sql`. Extends Desktop Companion (A.38), Meeting Intelligence (A.61), Unified Tasks (A.62 read-only), Companion Presence (A.67). Permissions `productivity.*`. Distinct from organizational tasks and PAME — metadata only.

**Cross-Tenant Intelligence Engine (Phase A.71):** See [CROSS_TENANT_INTELLIGENCE_ENGINE_PHASE_A71.md](./CROSS_TENANT_INTELLIGENCE_ENGINE_PHASE_A71.md) — anonymized cross-tenant trends with opt-in participation and explainable recommendations. `/app/cross-tenant-intelligence-engine`, nav id `crossTenantIntelligenceEngine`, `lib/aipify/cross-tenant-intelligence-engine/`, migration `20260913000000_cross_tenant_intelligence_engine_phase_a71.sql`. Extends Industry Intelligence (A.44), Continuous Improvement (A.49), Organizational Benchmarking (A.58), Predictive Insights (A.66). Permissions `intelligence.*`. Global insights have no organization_id — tenant isolation preserved.

**Trust & Reputation Engine (Phase A.72):** See [TRUST_REPUTATION_ENGINE_PHASE_A72.md](./TRUST_REPUTATION_ENGINE_PHASE_A72.md) — organizational trust profiles and metadata-only reputation signals with human-reviewed expansion. `/app/trust-reputation-engine`, nav id `trustReputationEngine`, `lib/aipify/trust-reputation-engine/`, migration `20260914000000_trust_reputation_engine_phase_a72.sql`. Integrates Human Oversight (A.40), Secure AI Actions (A.3), Workflow (A.42), Governance (A.14), enterprise_delegated_admins (A.30/A.41). Permissions `trust.*`. Distinct from legacy Trust Engine at `/app/trust`.

**Partner Success Engine (Phase A.73):** See [PARTNER_SUCCESS_ENGINE_PHASE_A73.md](./PARTNER_SUCCESS_ENGINE_PHASE_A73.md) — partner portfolio health, onboarding, adoption, and renewal readiness. `/app/partner-success-engine`, nav id `partnerSuccessEngine`, `lib/aipify/partner-success-engine/`, migration `20260915000000_partner_success_engine_phase_a73.sql`. Extends Customer Success (A.26), Enterprise Deployment (A.39), Change Management (A.47), Organizational Benchmarking (A.58). Permissions `partners.*`. Distinct from Partner Certification at `/app/partners`.

**Organization & Workspace Engine (Phase A.75):** See [ORGANIZATION_WORKSPACE_ENGINE_PHASE_A75.md](./ORGANIZATION_WORKSPACE_ENGINE_PHASE_A75.md) — Organization → Workspace → Users → Roles → Permissions hierarchy with isolated operational contexts. `/app/organization-workspace-engine`, nav id `organizationWorkspaceEngine`, `lib/aipify/organization-workspace-engine/`, migration `20260918000000_organization_workspace_engine_phase_a75.sql`. **Implementation Blueprint Phase 1** spec alignment: [IMPLEMENTATION_BLUEPRINT_PHASE1_ORGANIZATION_WORKSPACE_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE1_ORGANIZATION_WORKSPACE_FOUNDATION.md), migration `20260946000000_implementation_blueprint_phase1_org_workspace.sql`. Extends Multi-Tenant Architecture (A.1) and Identity & Permissions (A.2). Permissions `workspaces.*`. Workspace switching is distinct from organization switcher. Dogfood workspaces for `aipify-group` and `unonight`. Companion foundation metadata and Phase 1 success criteria on dashboard.

**Proactive Companion Engine (Phase A.79):** See [PROACTIVE_COMPANION_ENGINE_PHASE_A79.md](./PROACTIVE_COMPANION_ENGINE_PHASE_A79.md) — Timely organizational proactive assistance across five categories with user/org preferences and companion communication style. ABOS Assistance pillar. `/app/proactive-companion-engine`, nav id `proactiveCompanionEngine`, `lib/aipify/proactive-companion-engine/`, migration `20260924000000_proactive_companion_engine_phase_a79.sql`. Distinct from Companion Presence (A.67 — floating orb) and ILM proactive guidance (language patterns). Permissions `proactive_companion.*`. Metadata only — no surveillance.

**Priority & Focus Engine (Phase A.80):** See [PRIORITY_FOCUS_ENGINE_PHASE_A80.md](./PRIORITY_FOCUS_ENGINE_PHASE_A80.md) — Organizational priority dimensions and P1–P4 framework with gentle focus support. ABOS Operations/Assistance pillar. `/app/priority-focus-engine`, nav id `priorityFocusEngine`, `lib/aipify/priority-focus-engine/`, migration `20260925000000_priority_focus_engine_phase_a80.sql`. Distinct from TAG Phase 37 (personal focus) and Goals & OKR A.65 (objectives/key results). Permissions `priority_focus.*`. Metadata only — never guilt or pressure language.

**Growth & Evolution Engine (Phase A.81):** See [GROWTH_EVOLUTION_ENGINE_PHASE_A81.md](./GROWTH_EVOLUTION_ENGINE_PHASE_A81.md) — Sustainable organizational growth orchestration via learning cycles, evolution signals, and transparent recommendations across five growth dimensions. ABOS Growth pillar. `/app/growth-evolution-engine`, nav id `growthEvolutionEngine`, `lib/aipify/growth-evolution-engine/`, migration `20260927000000_growth_evolution_engine_phase_a81.sql`. Distinct from Evolution Governance (Phase 84), Capability Maturity (A.57), Organizational Health (A.56), and Learning Engine memory. Permissions `growth_evolution.*`. Integrates Proactive Companion (A.79) and Trust Engine. Metadata only.

**Purpose & Values Engine (Phase A.82):** See [PURPOSE_VALUES_ENGINE_PHASE_A82.md](./PURPOSE_VALUES_ENGINE_PHASE_A82.md) — Tenant organizational purpose, stated values, alignment signals, and values-aware reflection prompts. ABOS Identity/Culture pillar. `/app/purpose-values-engine`, nav id `purposeValuesEngine`, `lib/aipify/purpose-values-engine/`, migration `20260928000000_purpose_values_engine_phase_a82.sql`. Distinct from Brand Identity & Personhood Standard, Business DNA, Strategic Alignment A.55, and AI Ethics governance. Integrates Growth & Evolution (A.81). Permissions `purpose_values.*`. Metadata only.

**Inclusion & Humanity Engine (Phase A.83):** See [INCLUSION_HUMANITY_ENGINE_PHASE_A83.md](./INCLUSION_HUMANITY_ENGINE_PHASE_A83.md) — Communication conduct, inclusion principles, de-escalation patterns, and humanity boundaries for organizational interactions. ABOS Culture pillar. `/app/inclusion-humanity-engine`, nav id `inclusionHumanityEngine`, `lib/aipify/inclusion-humanity-engine/`, `lib/core/inclusion-humanity.ts`, migration `20260929000000_inclusion_humanity_engine_phase_a83.sql`. Distinct from AI Ethics A.46, Purpose & Values A.82, Brand Identity, and Trust Engine Phase 76. Integrates Purpose & Values (A.82) and Trust Engine. Permissions `inclusion_humanity.*`. Metadata only — no raw chat content.

**Companion Identity Engine (Phase A.84):** See [COMPANION_IDENTITY_ENGINE_PHASE_A84.md](./COMPANION_IDENTITY_ENGINE_PHASE_A84.md) — Unified companion identity orchestration across ABOS modules — consistent personality, behavioral standards, and interaction style. `/app/companion-identity-engine`, nav id `companionIdentityEngine`, `lib/aipify/companion-identity-engine/`, `lib/core/companion-identity.ts`, migration `20260933000000_companion_identity_engine_phase_a84.sql` (+ `20260945000000_learning_journey_communication_standard.sql` for Learning Journey Communication Standard fields). Distinct from Identity Engine Phase 34, Brand Identity, Humor & Personal Connection, Companion Presence A.67, Purpose & Values A.82, and Inclusion & Humanity A.83 (complements). Integrates [Learning Journey Communication Standard](./LEARNING_JOURNEY_COMMUNICATION_STANDARD.md). Permissions `companion_identity.*`. ILM `companion-identity-engine-abos.txt`, `learning-journey-communication-standard.txt`.

**Impact Engine (Phase A.85):** See [IMPACT_ENGINE_PHASE_A85.md](./IMPACT_ENGINE_PHASE_A85.md) — Outcome-focused impact orchestration across operational, customer, human, knowledge, and strategic dimensions. Activity ≠ progress. `/app/impact-engine`, nav id `abosImpactEngine`, `lib/aipify/impact-engine/`, `lib/core/impact-engine.ts`, migration `20260934000000_impact_engine_phase_a85.sql`. Distinct from Platform Anonymised Impact, Value Engine Phase 73, Value Realization A.48, and Innovation & Impact A.28. Permissions `impact_engine.*`. Metadata only — transparent calculations with limitations and assumptions.

**Legacy Engine (Phase A.86):** See [LEGACY_ENGINE_PHASE_A86.md](./LEGACY_ENGINE_PHASE_A86.md) — Preserve, celebrate, and pass forward organizational wisdom through storytelling and milestone recognition. `/app/legacy-engine`, nav id `legacyEngine`, `lib/aipify/legacy-engine/`, `lib/core/legacy-engine.ts`, migration `20260935000000_legacy_engine_phase_a86.sql`. Distinct from Organizational Memory A.34, OME Phase 50, and Impact Engine A.85 (integrates). Permissions `legacy_engine.*`. Metadata only — truthful, authentic reflection.

**Curiosity & Discovery Engine (Phase A.87):** See [CURIOSITY_DISCOVERY_ENGINE_PHASE_A87.md](./CURIOSITY_DISCOVERY_ENGINE_PHASE_A87.md) — Exploration prompts, discovery categories, and question-led culture. `/app/curiosity-discovery-engine`, nav id `curiosityDiscoveryEngine`, `lib/aipify/curiosity-discovery-engine/`, `lib/core/curiosity-discovery.ts`, migration `20260936000000_curiosity_discovery_engine_phase_a87.sql`. Distinct from Learning Engine, Innovation & Impact A.28, Innovation Experimentation, and Growth & Evolution A.81 (integrates). Permissions `curiosity_discovery.*`. Metadata only — psychological safety, no raw PII.

**Wonder Engine (Phase A.88):** See [WONDER_ENGINE_PHASE_A88.md](./WONDER_ENGINE_PHASE_A88.md) — Preserve amazement and healthy possibility; authentic reflection prompts, wonder moments, and emotional appreciation. Efficiency builds capability; wonder preserves humanity. `/app/wonder-engine`, nav id `wonderEngine`, `lib/aipify/wonder-engine/`, `lib/core/wonder-engine.ts`, migration `20260937000000_wonder_engine_phase_a88.sql`. Distinct from Impact A.85 (outcome measurement), Legacy A.86 (story preservation), Curiosity & Discovery A.87, Humor/Playful bell, and Growth & Evolution A.81. Permissions `wonder_engine.*`. Metadata only — authenticity guardrails; never artificial praise.

**Gratitude & Recognition Engine (Phase A.89):** See [GRATITUDE_RECOGNITION_ENGINE_PHASE_A89.md](./GRATITUDE_RECOGNITION_ENGINE_PHASE_A89.md) — Peer appreciation, digital rose gestures, gratitude moments, and Red Rose Moment boundary-safe warmth. `/app/gratitude-recognition-engine`, nav id `gratitudeRecognitionEngine`, `lib/aipify/gratitude-recognition-engine/`, `lib/core/gratitude-recognition.ts`, migration `20260938000000_gratitude_recognition_engine_phase_a89.sql`. Distinct from Human Success Phase 82, Wonder A.88, Legacy A.86, Humor & Personal Connection, and Relationship Intelligence A.78. Permissions `gratitude_recognition.*`. Metadata only — display labels and approved summaries, no PII.

**Hope Engine (Phase A.92):** See [HOPE_ENGINE_PHASE_A92.md](./HOPE_ENGINE_PHASE_A92.md) — Realistic encouragement and balanced optimism during difficulty; hope inspires action, not passivity. `/app/hope-engine`, nav id `hopeEngine`, `lib/aipify/hope-engine/`, `lib/core/hope-engine.ts`, migration `20260941000000_hope_engine_phase_a92.sql`. Distinct from Wonder A.88 (amazement), Presence & Comfort A.90 (reassurance protocol), Dedication A.91 (follow-through), Resilience A.50 (crisis continuity), and Growth & Evolution A.81. Permissions `hope_engine.*`. Metadata only — no unrealistic promises; balanced encouragement phrases.

**Presence & Comfort Protocol (Phase A.90):** See [PRESENCE_COMFORT_PROTOCOL_PHASE_A90.md](./PRESENCE_COMFORT_PROTOCOL_PHASE_A90.md) — Emotional moment protocol with comfort roses, reassurance boundaries, and gentle human connection encouragement. Presence matters; sometimes kindness, not advice. `/app/presence-comfort-protocol`, nav id `presenceComfortProtocol`, `lib/aipify/presence-comfort-protocol/`, `lib/core/presence-comfort.ts`, migration `20260939000000_presence_comfort_protocol_phase_a90.sql`. Distinct from Gratitude & Recognition A.89 (peer recognition rose), Companion Presence A.67 (orb UI), Inclusion & Humanity A.83, Humor/Personality, and PAME/LifeOS. Cross-links A.89 comfort vs recognition rose intent, Companion Identity A.84, humor trust boundaries. Permissions `presence_comfort.*`. ILM `presence-comfort-protocol-abos.txt`. Metadata only — no raw chat.

**Dedication Engine (Phase A.91):** See [DEDICATION_ENGINE_PHASE_A91.md](./DEDICATION_ENGINE_PHASE_A91.md) — Persistent companion support philosophy; follow-through patterns, balanced perseverance, and dependable help. Dedication = continuing to care enough to try again, not perfection. `/app/dedication-engine`, nav id `dedicationEngine`, `lib/aipify/dedication-engine/`, `lib/core/dedication-engine.ts`, migration `20260940000000_dedication_engine_phase_a91.sql`. Distinct from Proactive Companion A.79 (nudges), Resilience Engine A.50 (crisis recovery), Trust Engine Phase 76 (explainability), and Unified Task Follow-Up A.62 (task tracking). Permissions `dedication_engine.*`. ILM `dedication-engine-abos.txt`. Metadata only — sustainable effort with Self Love boundaries.

**Wisdom Engine (Phase A.93):** See [WISDOM_ENGINE_PHASE_A93.md](./WISDOM_ENGINE_PHASE_A93.md) — Experience-to-guidance synthesis with trade-off framing, humility, and long-term thinking. Intelligence answers questions; wisdom determines which questions matter. `/app/wisdom-engine`, nav id `wisdomEngine`, `lib/aipify/wisdom-engine/`, `lib/core/wisdom-engine.ts`, migration `20260942000000_wisdom_engine_phase_a93.sql`. Distinct from Assistant DSE Phase 38, Organizational Decision Support A.54, Strategic Intelligence A.31, Curiosity & Discovery A.87, Legacy A.86, and Organizational Memory A.34 (source). Integrates A.34/A.54/DSE. Permissions `wisdom_engine.*`. ILM `wisdom-engine-abos.txt`. Metadata only — insight summaries and guidance prompts, no raw content.

**Wisdom Intervention Protocol (Phase A.94):** See [WISDOM_INTERVENTION_PROTOCOL.md](./WISDOM_INTERVENTION_PROTOCOL.md) — Pre-send reflection prompts, sleep-on-it nudges, and emotional charge detection; includes [Pause & Reflection Protocol](./PAUSE_REFLECTION_PROTOCOL.md) on one surface (no duplicate engine). `/app/wisdom-intervention-protocol`, nav id `wisdomInterventionProtocol`, legacy redirect `/app/pause-reflection-protocol`, `lib/aipify/wisdom-intervention-protocol/`, `lib/core/wisdom-intervention.ts`, migrations `20260943000000_wisdom_intervention_protocol_phase_a94.sql` + `20260944000000_pause_reflection_protocol_abos_spec_alignment.sql`. Distinct from Wisdom Engine A.93 (experience synthesis), Human Oversight A.40, Trust & Action, Inclusion A.83, Attention Guardian TAG. Permissions `wisdom_intervention.*`. ILM `wisdom-intervention-vocabulary.ts`. Metadata only — no raw message content.

**Relationship Intelligence Engine (Phase A.78):** See [RELATIONSHIP_INTELLIGENCE_ENGINE_PHASE_A78.md](./RELATIONSHIP_INTELLIGENCE_ENGINE_PHASE_A78.md) — organizational relationship context (internal, customer, partner, community) at tenant level. `/app/relationship-intelligence-engine`, nav id `relationshipIntelligenceEngine`, `lib/aipify/relationship-intelligence-engine/`, `lib/core/relationship-intelligence-engine.ts`, migration `20260923000000_relationship_intelligence_engine_phase_a78.sql`. Integrates Support AI (A.7), Partner Success (A.73), links to personal RSI at `/app/assistant/relationships` (distinct). Permissions `relationship_intelligence.*`. Metadata only — never impersonate or auto-send messages. **Do not use** `lib/relationship-intelligence/` (Phase 33 personal RSI).

**AI Cost Governance Engine (Phase A.74):** See [AI_COST_GOVERNANCE_ENGINE_PHASE_A74.md](./AI_COST_GOVERNANCE_ENGINE_PHASE_A74.md) — budget enforcement, usage tracking, and cost optimization with task-tier routing. `/app/ai-cost-governance-engine`, nav id `aiCostGovernanceEngine`, `lib/aipify/ai-cost-governance-engine/`, migration `20260916000000_ai_cost_governance_engine_phase_a74.sql`. Integrates Secure AI Actions (A.3), Analytics Insights (A.16), Document Output (A.59). Permissions `ai_costs.*`, `ai_budgets.manage`, `ai_overages.approve`, `ai_usage.block`. Customer UI shows cost-efficient/standard/high-accuracy tiers only — provider brands never exposed.

**Change Management Engine (Phase A.47):** See [CHANGE_MANAGEMENT_ENGINE_PHASE_A47.md](./CHANGE_MANAGEMENT_ENGINE_PHASE_A47.md) — human-centered change adoption with transparent communication, structured implementation, and measurable outcomes. `/app/change-management-engine`, `lib/aipify/change-management-engine/`, migration `20260823000000_change_management_engine_phase_a47.sql`. Extends Deployment & Environment (A.20), Customer Success (A.26), Learning & Training (A.36), and Human Oversight (A.40). Training hooks via `assign_change_training()` — metadata only.

**Human Oversight Engine (Phase A.40):** See [HUMAN_OVERSIGHT_ENGINE_PHASE_A40.md](./HUMAN_OVERSIGHT_ENGINE_PHASE_A40.md) — organizational accountability for AI recommendations, approval workflows, override tracking, and high-risk action monitoring. `/app/human-oversight-engine`, `lib/aipify/human-oversight-engine/`, migration `20260816000000_human_oversight_engine_phase_a40.sql`. Extends Secure AI Actions (A.3), Governance (A.14), and Trust & Action Engine — critical actions prohibited for AI.

**Enterprise Readiness Engine (Phase A.30):** See [ENTERPRISE_READINESS_ENGINE_PHASE_A30.md](./ENTERPRISE_READINESS_ENGINE_PHASE_A30.md) — enterprise health, delegated administration, approval chains, onboarding milestones, and deployment readiness hooks. `/app/enterprise-readiness-engine`, `lib/aipify/enterprise-readiness-engine/`, migration `20260801000000_enterprise_readiness_engine_phase_a30.sql`. Integrates Governance (A.14), Deployment (A.20), and Enterprise Deployment Framework (Phase 92).

**Executive Insights Engine (Phase A.35):** See [EXECUTIVE_INSIGHTS_ENGINE_PHASE_A35.md](./EXECUTIVE_INSIGHTS_ENGINE_PHASE_A35.md) — tenant executive reporting, organization health, risks, opportunities, and action-oriented summaries. `/app/executive-insights-engine`, `lib/aipify/executive-insights-engine/`, migration `20260806000000_executive_insights_engine_phase_a35.sql`. Aggregates metadata from Analytics (A.16), Operations (A.9/A.32), Customer Success (A.26), Strategic Intelligence (A.31), Quality Guardian (A.13), Governance (A.14), Security (A.18), and Support AI (A.7). Distinct from Platform Admin `/platform/executive`.

**Organizational Memory Engine (Phase A.34):** See [ORGANIZATIONAL_MEMORY_ENGINE_PHASE_A34.md](./ORGANIZATIONAL_MEMORY_ENGINE_PHASE_A34.md) and [ORGANIZATIONAL_MEMORY_ENGINE.md](./ORGANIZATIONAL_MEMORY_ENGINE.md) — tenant-aware organizational memory with metadata summaries, decision register, scheduled reviews, and capture hooks. `/app/organizational-memory-engine`, `lib/aipify/organizational-memory-engine/`, migration `20260805000000_organizational_memory_engine_phase_a34.sql`, ABOS alignment `20260949000000_organizational_memory_engine_abos_spec_alignment.sql`. Knowledge explains how things should work; memory captures how things unfolded. Extends Phase 50 OME (`/app/memory`); distinct from PAME, Learning Engine, and Knowledge Center (A.5).

**Learning & Training Engine (Phase A.36):** See [LEARNING_TRAINING_ENGINE_PHASE_A36.md](./LEARNING_TRAINING_ENGINE_PHASE_A36.md) — user education paths for Aipify module adoption with role-specific training, knowledge checks, and completion tracking. `/app/learning-training-engine`, `lib/aipify/learning-training-engine/`, migration `20260807000000_learning_training_engine_phase_a36.sql`. Distinct from Phase 29 Learning Engine (`/app/learning`, `customer_learning_memory`). Integrates Customer Onboarding (A.10) for first-login guidance.

**Certification & Achievement Engine (Phase A.37):** See [CERTIFICATION_ACHIEVEMENT_ENGINE_PHASE_A37.md](./CERTIFICATION_ACHIEVEMENT_ENGINE_PHASE_A37.md) — internal certifications, achievement badges, team readiness, and certificate export scaffolds built on A.36 training completion. `/app/certification-achievement-engine`, `lib/aipify/certification-achievement-engine/`, migration `20260808000000_certification_achievement_engine_phase_a37.sql`. European dates via `formatEuropeanDate()` in `lib/core/date.ts`. Distinct from Partner Certification Ecosystem (Phase 91).

**Enterprise Deployment & Device Rollout Engine (Phase A.39):** See [ENTERPRISE_DEPLOYMENT_DEVICE_ROLLOUT_ENGINE_PHASE_A39.md](./ENTERPRISE_DEPLOYMENT_DEVICE_ROLLOUT_ENGINE_PHASE_A39.md) — IT admin deployment for licenses, seats, device enrollment, enrollment tokens, SSO/SCIM readiness, and silent install params. `/app/enterprise-deployment-device-rollout-engine`, `lib/aipify/enterprise-deployment-device-rollout-engine/`, migration `20260810000000_enterprise_deployment_device_rollout_engine_phase_a39.sql`. Integrates Desktop Command Center, Install Engine (A.22), Enterprise Readiness (A.30), and Subscription Plan Management (A.11). No keystroke or screen monitoring.

**Desktop Companion (Phase A.38 scaffold):** See [DESKTOP_COMPANION_PHASE_A38.md](./DESKTOP_COMPANION_PHASE_A38.md) — scaffold referenced by A.39 device enrollment; full A.38 ships separately. `lib/aipify/desktop-companion-phase-a38/`.

**API Platform (Phase A.21 scaffold):** See [API_PLATFORM_PHASE_A21.md](./API_PLATFORM_PHASE_A21.md) — scaffold for deployment/SCIM API prefixes; full A.21 ships separately. `lib/aipify/api-platform-phase-a21/`.

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
