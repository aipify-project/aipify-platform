# Companion Foundation Coverage Audit — Phase 34

Generated: 2026-06-23T02:01:50.474Z

## Summary

| Metric | Count |
|--------|------:|
| Total modules | 178 |
| Total II capabilities | 449 |
| Business packs (marketing) | 7 |
| Providers | 141 |
| Skills | 58 |
| Panels | 4 |

## Readiness distribution (modules)

- **production_ready_candidate**: 5
- **connected**: 7
- **connected_but_partial**: 37
- **adapter_missing**: 92
- **source_missing**: 2
- **manifest_only**: 8
- **specification_only**: 27

_Module readiness sums to **178** registry modules._

## Commercial capability status (II matrix)

- **connected_but_partial**: 41
- **manifest_only**: 2
- **adapter_missing**: 351
- **specification_only**: 55

_Commercial capability rows sum to **449** — do not mix with module readiness above._

## Canonical counting model (Phase 43C)

- Model: `companion-canonical-coverage-summary-v1`
- Modules source: `buildCompanionFoundationCoverageRegistry()`
- Capabilities source: `mergeCommunityExternalAdapterIntoCommercial(buildCommercialCapabilityMatrix())`
- Reconciled entries: 178
- Unique capability IDs in modules: 394

### Readiness scope — read (reconciled modules)

- **production_ready_candidate**: 5
- **connected**: 7
- **connected_but_partial**: 37
- **adapter_missing**: 92
- **source_missing**: 2
- **manifest_only**: 8
- **specification_only**: 27

### Source classification (reconciled modules)

- **source_exact**: 3
- **source_compatible**: 6
- **source_partial**: 31
- **source_proxy**: 3
- **source_missing**: 78
- **source_unknown**: 57

### Gap priority

- **P0**: 0
- **P1**: 91
- **P2**: 15
- **P3**: 27

### Reconciliation notes

- module_readiness counts registry modules — sum equals total_modules
- capability_status counts II commercial matrix rows — sum equals total_commercial_capabilities
- readiness_scope.read mirrors module readiness for reconciled entries in Phase 43C
- Do not mix module_readiness and capability_status in one readiness table

## Member verification coverage

- `verification.community_adapter_status`: **connected_but_partial** — verification_status.read
- `verification.trust_center`: **connected_but_partial** — verification.read, verification_status.read, verification.request
- `verification.queue_read`: **connected_but_partial** — verification_queue.read
- `verification.case_read`: **connected_but_partial** — verification_case.read
- `verification.review_create`: **specification_only** — verification_review.create

## Appointment / salon / service coverage

- `service.appointment_booking`: **connected_but_partial** — service.read, service.availability.read, availability.read, appointment.read, booking.read, resource.read, customer.read, location.read
- `service.local_service_beauty`: **connected_but_partial** — service.read, treatment.read, availability.read, appointment.read, appointment.create, appointment.update
- `service.workforce_scheduling`: **connected_but_partial** — resource.read, employee.read, service.availability.read, availability.read, assignment.read, staff.read, schedule.read
- `service.absence_vacation`: **connected_but_partial** — service.availability.read, resource.read, vacation_mode.read, absence.read, post_vacation_availability.read
- `service.booking_write`: **source_missing** — booking.create, booking.update, booking.read, cancellation.read

## Four-panel coverage

- **super_admin** (`panel.super_admin`): readiness `connected_but_partial`, capabilities: 3
- **platform** (`panel.platform`): readiness `connected_but_partial`, capabilities: 5
- **partners** (`panel.partners`): readiness `connected_but_partial`, capabilities: 2
- **app** (`panel.app`): readiness `connected`, capabilities: 5

## Gap priority counts

- **P0**: 0
- **P1**: 91
- **P2**: 15
- **P3**: 27

_(Canonical gap totals also appear under Phase 43C counting model.)_

## Phase 43 reconciliation

- Reconciliation version: `companion-coverage-reconciliation-v1`
- P1 freeze packages: 10
- Deprecated/merge entries: 9
- Duplicate capability IDs tracked: 127
- False production_ready violations: 0

## Top gaps (first 50)

- **[P1]** `provider.proactive_insights_engine` — Connected manifest without live provider adapter.
- **[P1]** `provider.companion_recommendation_engine` — Connected manifest without live provider adapter.
- **[P1]** `provider.proactive_organization_center` — Connected manifest without live provider adapter.
- **[P1]** `provider.command_brief_operational` — Connected manifest without live provider adapter.
- **[P1]** `provider.domain_signal_bus` — Connected manifest without live provider adapter.
- **[P1]** `provider.analytics_center` — Connected manifest without live provider adapter.
- **[P1]** `provider.executive_insights_center` — Connected manifest without live provider adapter.
- **[P1]** `provider.companion_analytics_context` — Connected manifest without live provider adapter.
- **[P1]** `provider.companion_executive_layer` — Connected manifest without live provider adapter.
- **[P1]** `provider.command_brief_analytics` — Connected manifest without live provider adapter.
- **[P1]** `provider.cross_module_insight_bus` — Connected manifest without live provider adapter.
- **[P1]** `provider.community_network_center` — Connected manifest without live provider adapter.
- **[P1]** `provider.moderation_engine` — Connected manifest without live provider adapter.
- **[P1]** `provider.client_relationship_loyalty` — Connected manifest without live provider adapter.
- **[P1]** `provider.community_collective_intelligence` — Connected manifest without live provider adapter.
- **[P1]** `provider.trust_center_verification` — Connected manifest without live provider adapter.
- **[P1]** `provider.identity_access_management` — Connected manifest without live provider adapter.
- **[P1]** `provider.security_compliance_center` — Connected manifest without live provider adapter.
- **[P1]** `provider.audit_accountability` — Connected manifest without live provider adapter.
- **[P1]** `provider.governance_management` — Connected manifest without live provider adapter.
- **[P1]** `provider.sales_revenue_pipeline` — Connected manifest without live provider adapter.
- **[P1]** `provider.customer_relationship` — Connected manifest without live provider adapter.
- **[P1]** `provider.lead_management` — Connected manifest without live provider adapter.
- **[P1]** `provider.revenue_intelligence` — Connected manifest without live provider adapter.
- **[P1]** `provider.finance_operations_center` — Connected manifest without live provider adapter.
- **[P1]** `provider.revenue_operations` — Connected manifest without live provider adapter.
- **[P1]** `provider.unified_billing` — Connected manifest without live provider adapter.
- **[P1]** `provider.payment_providers` — Connected manifest without live provider adapter.
- **[P1]** `provider.enterprise_invoicing` — Connected manifest without live provider adapter.
- **[P1]** `provider.inventory_stock_center` — Connected manifest without live provider adapter.
- **[P1]** `provider.warehouse_control` — Connected manifest without live provider adapter.
- **[P1]** `provider.warehouse_logistics` — Connected manifest without live provider adapter.
- **[P1]** `provider.workforce_employee_directory` — Connected manifest without live provider adapter.
- **[P1]** `provider.workforce_team` — Connected manifest without live provider adapter.
- **[P1]** `provider.workforce_lifecycle` — Connected manifest without live provider adapter.
- **[P1]** `provider.workforce_people_operations` — Connected manifest without live provider adapter.
- **[P1]** `provider.workforce_scheduling_hr` — Connected manifest without live provider adapter.
- **[P1]** `provider.workforce_absence_hr` — Connected manifest without live provider adapter.
- **[P1]** `provider.workforce_knowledge` — Connected manifest without live provider adapter.
- **[P1]** `provider.short_term_property` — Connected manifest without live provider adapter.
- **[P1]** `provider.short_term_reservation` — Connected manifest without live provider adapter.
- **[P1]** `provider.short_term_guest` — Connected manifest without live provider adapter.
- **[P1]** `provider.short_term_calendar` — Connected manifest without live provider adapter.
- **[P1]** `provider.short_term_operations` — Connected manifest without live provider adapter.
- **[P1]** `provider.short_term_finance` — Connected manifest without live provider adapter.
- **[P1]** `provider.short_term_communications` — Connected manifest without live provider adapter.
- **[P1]** `provider.short_term_reports` — Connected manifest without live provider adapter.
- **[P1]** `provider.short_term_access` — Connected manifest without live provider adapter.
- **[P1]** `provider.local_service_beauty` — Connected manifest without live provider adapter.
- **[P1]** `provider.service_scheduling_staff` — Connected manifest without live provider adapter.

## Canonical registry

- TypeScript: `lib/companion-runtime/companion-foundation-coverage-registry.ts`
- JSON artifact: `lib/companion-runtime/artifacts/companion-foundation-coverage-v1.json`

## Principles verified

- Generic capability contracts in Core — provider adapters in Business Pack / provider layer.
- No false `production_ready` without live source + test.
- Member verification: metadata-only — no document images or ID fields.
- Service booking: generic appointment provider — no salon-specific Core logic.
