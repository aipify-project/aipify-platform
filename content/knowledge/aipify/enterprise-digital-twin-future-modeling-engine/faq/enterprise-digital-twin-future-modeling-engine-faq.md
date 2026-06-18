# Enterprise Digital Twin & Future Modeling Engine — FAQ

## What is a Digital Twin?

An Enterprise Digital Twin is a digital representation of your organization — structure, operations, workforce, finances, workflows, risks, and growth scenarios. Aipify models approved operational metadata to help you explore future outcomes before acting in the real world. Access the center at `/app/digital-twin`.

## How do simulations work?

Simulations in the Simulation Lab model growth, workforce, revenue, risk, expansion, automation, and industry scenarios. Each simulation uses transparent assumptions and scenario types (best case, expected case, worst case, aggressive growth, conservative growth, market disruption, or custom). Simulations are forecasts — not guaranteed outcomes. Humans review results and decide next steps.

## How are forecasts generated?

The Future Modeling Engine generates forecasts across horizons from 30 days to 36 months (or custom). Forecasts combine organization, operational, financial, and workforce models with approved metadata. Each forecast includes assumptions and a disclaimer that results are exploratory.

## How accurate are simulations?

Simulation accuracy and forecast accuracy scores are tracked in Twin Overview and Simulation Analytics. Accuracy improves as models are validated and outcomes are compared to real results. Aipify never presents simulations as certainties — confidence levels are always visible.

## How are risks modeled?

The Risk Modeling Engine tracks revenue, workforce, customer, compliance, technology, strategic, and operational risks. Risk models include exposure levels and mitigation summaries. Stress tests complement risk models by simulating revenue decline, customer loss, workforce shortages, economic changes, and technology failures.

## How does future modeling work?

Future modeling connects Digital Twin models with scenario planning and decision impact modeling. Before hiring, expansion, pricing, automation, product, partner, or investment decisions, Aipify recommends running relevant simulations. The Companion Digital Twin Advisor surfaces observations such as capacity bottlenecks, growth assumption reviews, and recommended risk scenarios.

## How is this different from the Simulation Lab?

**Simulation Lab** (`/app/simulations`) provides dedicated simulation workspace tools. **Digital Twin Center** (`/app/digital-twin`) is the unified enterprise framework — twin models, forecasts, stress tests, risk models, governance, and executive outlook in one place.

## How is this different from legacy Digital Twin (Phase 77)?

Phase 77 organizational digital twin (`get_digital_twin_dashboard`) models roles, processes, and knowledge routing. Phase 422 extends this with enterprise simulation, future modeling, financial/workforce models, stress testing, and decision impact scenarios. Process detail routes under `/app/digital-twin/processes/*` remain available.

## Governance boundaries

- Simulations are clearly identified as forecasts
- Forecasts are never presented as guaranteed outcomes
- Decision ownership remains with humans
- Forecast assumptions are transparent
- Human override is always available
- Full audit logging of simulation lifecycle events

## Related routes

- `/app/digital-twin` — Enterprise Digital Twin Center (Phase 422)
- `/app/simulations` — Simulation Lab
- `/app/assistant/decisions` — Decision Support Engine
- `/app/digital-twin/processes/*` — Legacy process twin detail
