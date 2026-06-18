# AIPIFY — PHASE 410
## Professional Services, Consulting & Client Delivery Pack Foundation

**Feature owner:** Customer App  
**Route:** `/app/professional-services`  
**Migration:** `20261690000000_professional_services_consulting_client_delivery_pack_foundation_phase410.sql`  
**Helpers:** `_gpsccd410_*`

## Purpose

Professional services operations for consulting firms, agencies, accounting firms, advisory companies, and implementation partners — clients, projects, consultants, service delivery, profitability, utilization, and client success.

## Core principle

Professional services organizations sell expertise, outcomes, and trust. Operational visibility is essential for growth.

## Modules

- Services Overview
- Clients
- Projects
- Consultants
- Service Delivery
- Profitability
- Client Success
- Services Intelligence

## Tables

`professional_services_pack_settings` · `professional_services_clients` · `professional_services_consultants` · `professional_services_projects` · `professional_services_deliverables` · `professional_services_expansion_opportunities` · `professional_services_advisor_signals` · `professional_services_audit_logs`

## RPCs

- `get_professional_services_consulting_client_delivery_center()`
- `professional_services_consulting_client_delivery_action()`

## Actions

`create_client` · `create_project` · `create_consultant` · `assign_consultant` · `update_client_health` · `create_expansion_opportunity`

## Permissions

- `professional_services.view`
- `professional_services.manage`

## i18n

`customerApp.professionalServicesConsultingClientDeliveryPack.*` — core locales: en, no, sv, da, pl, uk

## Knowledge Center

FAQ: `content/knowledge/aipify/professional-services-consulting-client-delivery-pack/faq/`

## END OF PHASE
