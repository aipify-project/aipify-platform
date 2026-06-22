# Companion Foundation Coverage Audit — Phase 34

Generated: 2026-06-22T19:13:08.347Z

## Summary

| Metric | Count |
|--------|------:|
| Total modules | 141 |
| Total II capabilities | 347 |
| Business packs (marketing) | 7 |
| Providers | 132 |
| Skills | 58 |
| Panels | 4 |

## Readiness distribution

- **production_ready_candidate**: 1
- **connected**: 7
- **connected_but_partial**: 13
- **adapter_missing**: 85
- **source_missing**: 3
- **manifest_only**: 8
- **specification_only**: 24

## Member verification coverage

- `verification.unonight_adapter_status`: **connected_but_partial** — verification_status.read
- `verification.trust_center`: **connected_but_partial** — verification.read, verification_status.read, verification.request
- `verification.queue_read`: **source_missing** — verification_queue.read
- `verification.case_read`: **source_missing** — verification_case.read
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
- **P1**: 88
- **P2**: 6
- **P3**: 24

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
