/**
 * Seeds businessPackDetailPages + pricing catalog keys into locale marketing.json files.
 * Run: node scripts/seed-business-pack-detail-i18n.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const businessPackDetailPages = {
  shared: {
    breadcrumbs: {
      home: "Home",
      businessPacks: "Business Packs",
    },
    availableFrom: "Available from",
    commercialTypes: {
      addon: "Add-on",
      tailored_addon: "Tailored add-on",
    },
    sections: {
      businessValue: "Business value",
      capabilities: "What Aipify helps with",
      howItWorks: "How it works",
      governance: "Governance and control",
      whoFor: "Who it is for",
      planActivation: "Plan and activation",
      relatedPacks: "Related Business Packs",
      heroPanel: "Pack capabilities",
    },
    ctas: {
      bookDemo: "Book a demo",
      viewDetails: "View details",
      exploreBusinessPacks: "Explore Business Packs",
    },
    planNames: {
      starter: "Starter",
      professional: "Professional",
      business: "Business",
      enterprise: "Enterprise",
    },
    notFound: {
      title: "This Business Pack is not available",
      subtitle:
        "The page you requested is not in our public Business Pack catalog. Explore available packs or speak with Aipify.",
      backToPacks: "View Business Packs",
      bookDemo: "Book a demo",
      contact: "Contact Aipify",
    },
  },
  packs: {
    hosts: {
      name: "Aipify Hosts",
      label: "Hospitality Business Pack",
      audience: "Hospitality and property operators",
      value: "Guest operations, property workflows, and occupancy visibility.",
      metaTitle: "Aipify Hosts | Hospitality Operations Business Pack",
      metaDescription:
        "Guest operations and hospitality intelligence for property and accommodation businesses — with governed workflows and executive visibility.",
      headline: "Hospitality operations with clarity and control",
      introduction:
        "Coordinate guest experience, property workflows, and daily hospitality operations — with governed intelligence your team trusts.",
      heroCapabilities: {
        "1": "Guest request coordination",
        "2": "Property operational briefings",
        "3": "Multi-location visibility",
        "4": "Approval-governed actions",
      },
      outcomes: {
        "1": {
          title: "Clearer guest operations",
          body: "See guest requests, arrivals, and exceptions in one operational view instead of scattered channels.",
        },
        "2": {
          title: "Faster team coordination",
          body: "Housekeeping, maintenance, and front-desk teams share prepared context and handoffs.",
        },
        "3": {
          title: "Executive property visibility",
          body: "Leadership receives explainable briefings across locations without manual status chasing.",
        },
        "4": {
          title: "Less repetitive follow-up",
          body: "Recurring hospitality workflows are prepared for review — not rebuilt from scratch each day.",
        },
      },
      capabilities: {
        "1": "Guest intelligence workflows",
        "2": "Knowledge-backed response preparation",
        "3": "Housekeeping and maintenance handoffs",
        "4": "Property operational briefings",
        "5": "Policy-aware escalation to staff",
        "6": "Multi-property executive summaries",
      },
      steps: {
        "1": {
          title: "Connect hospitality context",
          body: "Link approved property systems, messaging channels, and operational workflows.",
        },
        "2": {
          title: "Aipify learns approved operations",
          body: "Operational context is organized from approved sources — not raw guest transcripts.",
        },
        "3": {
          title: "Teams receive prepared work",
          body: "Briefings, drafts, and coordination steps surface with recommended next actions.",
        },
        "4": {
          title: "Humans approve sensitive work",
          body: "Guest-impacting actions proceed only after your team reviews and approves.",
        },
      },
      governanceTitle: "Governed hospitality operations",
      governanceBody:
        "Sensitive guest and property actions require human approval. Autonomy levels, confidence thresholds, and audit trails keep hospitality operations accountable. Aipify orchestrates intelligence above your PMS — it does not replace front-desk judgment or core property systems.",
      whoForTitle: "Built for hospitality operators",
      whoForBody:
        "Hospitality operators, property managers, guest experience leaders, and multi-location accommodation businesses that need coordinated visibility without replacing core property software.",
      planActivationTitle: "Activate on Business",
      planActivationBody:
        "Add Aipify Hosts on a Business plan. Your organization purchases the pack, completes activation validation, grants team access, and operational menus appear when the pack is fully active.",
      primaryCta: "Get Aipify Hosts",
      finalCtaTitle: "READY TO MOVE FORWARD?",
      finalCtaSubtitle:
        "Start with Aipify Hosts on your Business plan — or book a demo to see hospitality operations in practice.",
    },
    support: {
      name: "Aipify Support",
      label: "Support Business Pack",
      audience: "Customer service and support teams",
      value: "Governed triage, knowledge-backed responses, and escalation.",
      metaTitle: "Aipify Support | Customer Service Operations Business Pack",
      metaDescription:
        "Governed customer support triage, knowledge-backed drafts, and escalation for service teams that keep humans in control.",
      headline: "Customer support with governed speed",
      introduction:
        "Help support teams triage faster, draft with approved knowledge, and escalate with full context — without losing human ownership of important cases.",
      heroCapabilities: {
        "1": "Governed ticket triage",
        "2": "Knowledge-backed drafts",
        "3": "Confidence-based escalation",
        "4": "Support analytics and gap detection",
      },
      outcomes: {
        "1": {
          title: "Faster first responses",
          body: "Prepared drafts and triage recommendations reduce time spent searching for answers.",
        },
        "2": {
          title: "Consistent guidance",
          body: "Approved knowledge and Business DNA keep responses aligned with your policies.",
        },
        "3": {
          title: "Smoother escalation",
          body: "Low-confidence cases route to humans with explainable context — not silent automation.",
        },
        "4": {
          title: "Visible support demand",
          body: "Leaders see queue health, gaps, and patterns without digging through disconnected tools.",
        },
      },
      capabilities: {
        "1": "Business DNA integration",
        "2": "Autonomous support levels 0–3",
        "3": "Knowledge gap tracking",
        "4": "Category and policy controls",
        "5": "Draft response preparation",
        "6": "Full audit trail",
      },
      steps: {
        "1": {
          title: "Requests enter your channels",
          body: "Email, chat, and helpdesk inquiries flow into governed support workflows.",
        },
        "2": {
          title: "Approved knowledge is searched",
          body: "Aipify retrieves metadata from approved knowledge — not raw customer conversations.",
        },
        "3": {
          title: "Drafts and triage are prepared",
          body: "Recommendations include context, confidence, and suggested next steps.",
        },
        "4": {
          title: "Humans review before delivery",
          body: "Your team edits, approves, or escalates before customers receive sensitive responses.",
        },
      },
      governanceTitle: "Support stays under human control",
      governanceBody:
        "Auto-reply is permitted only within approved autonomy settings, confidence thresholds, and category policy. Uncertain or sensitive cases escalate for human decision. Every draft, assignment, and action is auditable.",
      whoForTitle: "Built for support organizations",
      whoForBody:
        "Customer service teams, support leaders, and customer success organizations managing volume while preserving quality, policy compliance, and accountability.",
      planActivationTitle: "Activate on Professional",
      planActivationBody:
        "Add Aipify Support on a Professional plan or above. Purchase the pack, activate for your organization, and grant access to support teams through your admin controls.",
      primaryCta: "Get Aipify Support",
      finalCtaTitle: "READY TO MOVE FORWARD?",
      finalCtaSubtitle:
        "Get Aipify Support on your plan — or book a demo to see governed support workflows in practice.",
    },
    commerce: {
      name: "Aipify Commerce",
      label: "Commerce Business Pack",
      audience: "Retail and e-commerce operations",
      value: "Order visibility, inventory coordination, and customer touchpoints.",
      metaTitle: "Aipify Commerce | Retail & E-commerce Operations Business Pack",
      metaDescription:
        "Order visibility, fulfillment coordination, and customer context for retail and e-commerce operations teams.",
      headline: "Commerce operations with connected visibility",
      introduction:
        "Unify order visibility, fulfillment coordination, and customer context so commerce teams respond with clarity — inside the systems they already use.",
      heroCapabilities: {
        "1": "Order and fulfillment visibility",
        "2": "Customer context in workflows",
        "3": "Operational alerts with actions",
        "4": "Executive commerce summaries",
      },
      outcomes: {
        "1": {
          title: "Faster fulfillment coordination",
          body: "Exceptions and delays surface with context teams can act on immediately.",
        },
        "2": {
          title: "Connected customer context",
          body: "Support and operations see order history without switching between platforms.",
        },
        "3": {
          title: "Actionable operational alerts",
          body: "Signals include recommended next steps — not raw counts alone.",
        },
        "4": {
          title: "Less tool-switching",
          body: "Commerce teams work from prepared briefings instead of manual status assembly.",
        },
      },
      capabilities: {
        "1": "Order and fulfillment visibility",
        "2": "Inventory and exception signals",
        "3": "Customer context in workflows",
        "4": "Operational alerts with next steps",
        "5": "Integration-ready commerce coordination",
        "6": "Executive commerce summaries",
      },
      steps: {
        "1": {
          title: "Connect commerce platforms",
          body: "Link storefronts, fulfillment tools, and customer channels with approved access.",
        },
        "2": {
          title: "Aipify surfaces operational signals",
          body: "Orders, exceptions, and customer touchpoints appear in governed workflows.",
        },
        "3": {
          title: "Teams receive prepared context",
          body: "Briefings and recommendations reduce manual coordination across tools.",
        },
        "4": {
          title: "Approved actions execute",
          body: "Sensitive changes follow trust levels with human approval where required.",
        },
      },
      governanceTitle: "Commerce actions stay governed",
      governanceBody:
        "Commerce workflows follow Aipify trust levels — informational visibility by default, with sensitive operational changes requiring explicit approval and audit logging.",
      whoForTitle: "Built for commerce operators",
      whoForBody:
        "Retail operators, e-commerce teams, fulfillment coordinators, and organizations running commerce alongside support and finance workflows.",
      planActivationTitle: "Activate on Professional",
      planActivationBody:
        "Add Aipify Commerce on a Professional plan or above. Select capacity, complete activation, and grant commerce teams access through your organization settings.",
      primaryCta: "Get Aipify Commerce",
      finalCtaTitle: "READY TO MOVE FORWARD?",
      finalCtaSubtitle:
        "Get Aipify Commerce on your plan — or book a demo to review fulfillment and order workflows.",
    },
    services: {
      name: "Aipify Services",
      label: "Professional Services Business Pack",
      audience: "Professional services organizations",
      value: "Client delivery, knowledge retention, and executive visibility.",
      metaTitle: "Aipify Services | Professional Services Business Pack",
      metaDescription:
        "Client delivery coordination, knowledge reuse, and engagement visibility for professional services organizations.",
      headline: "Client delivery with institutional memory",
      introduction:
        "Support professional services teams with delivery coordination, approved knowledge reuse, and engagement visibility — without burying expertise in disconnected documents.",
      heroCapabilities: {
        "1": "Client engagement visibility",
        "2": "Delivery milestone coordination",
        "3": "Approved knowledge reuse",
        "4": "Executive services briefings",
      },
      outcomes: {
        "1": {
          title: "Clearer delivery tracking",
          body: "Milestones, owners, and risks stay visible across active engagements.",
        },
        "2": {
          title: "Reusable approved knowledge",
          body: "Institutional expertise is accessible through governed knowledge — not ad-hoc files.",
        },
        "3": {
          title: "Executive engagement visibility",
          body: "Leaders see portfolio health without manual status reporting cycles.",
        },
        "4": {
          title: "Fewer status meetings",
          body: "Prepared briefings replace repetitive manual updates across teams.",
        },
      },
      capabilities: {
        "1": "Client engagement visibility",
        "2": "Delivery milestone coordination",
        "3": "Approved knowledge reuse",
        "4": "Executive services briefings",
        "5": "Team handoff coordination",
        "6": "Governance-aware client workflows",
      },
      steps: {
        "1": {
          title: "Map delivery workflows",
          body: "Define how engagements, milestones, and knowledge sources connect in your firm.",
        },
        "2": {
          title: "Aipify prepares delivery context",
          body: "Briefings and coordination steps are prepared from approved operational metadata.",
        },
        "3": {
          title: "Consultants review prepared work",
          body: "Teams edit, approve, and assign before client-impacting updates proceed.",
        },
        "4": {
          title: "Leadership reviews portfolio health",
          body: "Executive summaries explain status, risk, and recommended focus areas.",
        },
      },
      governanceTitle: "Client relationships stay human-owned",
      governanceBody:
        "Client-sensitive information follows metadata-first patterns. External actions and deliverable changes require appropriate human review. Aipify prepares coordination — your consultants retain ownership of client relationships.",
      whoForTitle: "Built for services firms",
      whoForBody:
        "Professional services firms, consulting organizations, agencies, and delivery teams managing multiple client engagements with accountability requirements.",
      planActivationTitle: "Activate on Professional",
      planActivationBody:
        "Add Aipify Services on a Professional plan or above. Activate the pack for your organization and grant delivery teams access through admin controls.",
      primaryCta: "Get Aipify Services",
      finalCtaTitle: "READY TO MOVE FORWARD?",
      finalCtaSubtitle:
        "Get Aipify Services on your plan — or book a demo to see client delivery coordination in practice.",
    },
    projects: {
      name: "Aipify Projects",
      label: "Project Delivery Business Pack",
      audience: "Project-driven teams",
      value: "Delivery coordination, approvals, and operational handoffs.",
      metaTitle: "Aipify Projects | Project Delivery Business Pack",
      metaDescription:
        "Milestone tracking, governed approvals, and delivery coordination for project-driven teams — tailored to your operating model.",
      headline: "Project delivery with operational discipline",
      introduction:
        "Coordinate milestones, approvals, assignments, and handoffs across project-driven teams — with tailored configuration for how your organization delivers work.",
      heroCapabilities: {
        "1": "Milestone and dependency tracking",
        "2": "Approval-governed handoffs",
        "3": "Delivery status reporting",
        "4": "Tailored pack configuration",
      },
      outcomes: {
        "1": {
          title: "Clearer milestone visibility",
          body: "Dependencies, owners, and blockers are visible before they become delivery crises.",
        },
        "2": {
          title: "Governed handoffs",
          body: "Cross-team transitions include approval context and audit trails.",
        },
        "3": {
          title: "Less status overhead",
          body: "Prepared portfolio summaries reduce manual reporting for PMOs and delivery leads.",
        },
        "4": {
          title: "Tailored to your model",
          body: "Projects is configured for how your organization actually delivers — not a generic template.",
        },
      },
      capabilities: {
        "1": "Milestone and dependency tracking",
        "2": "Assignment and ownership coordination",
        "3": "Approval-governed handoffs",
        "4": "Delivery status reporting",
        "5": "Cross-team operational briefings",
        "6": "Tailored pack configuration",
      },
      steps: {
        "1": {
          title: "Define delivery patterns",
          body: "Work with Aipify to align the Projects pack to your PMO and delivery workflows.",
        },
        "2": {
          title: "Configure tailored activation",
          body: "Pack scope, permissions, and menus are set for your organization's model.",
        },
        "3": {
          title: "Teams operate in governed workflows",
          body: "Assignments, approvals, and handoffs follow your established trust policies.",
        },
        "4": {
          title: "Leadership reviews portfolio status",
          body: "Executive views summarize delivery health with explainable recommendations.",
        },
      },
      governanceTitle: "Delivery decisions stay with your leaders",
      governanceBody:
        "Project-impacting changes and client-sensitive actions require human approval. Aipify prepares coordination and visibility — PMOs and delivery leads decide outcomes.",
      whoForTitle: "Built for project organizations",
      whoForBody:
        "Project-driven teams, PMOs, delivery organizations, and businesses coordinating complex work across departments and vendors.",
      planActivationTitle: "Tailored activation on Business",
      planActivationBody:
        "Aipify Projects is a tailored add-on on the Business plan. Speak with Aipify to scope configuration, capacity, and activation for your delivery model.",
      primaryCta: "Talk to Aipify about Projects",
      finalCtaTitle: "READY TO MOVE FORWARD?",
      finalCtaSubtitle:
        "Talk to Aipify about a tailored Projects configuration — or book a demo to review delivery coordination options.",
    },
    finance: {
      name: "Aipify Finance",
      label: "Finance Operations Business Pack",
      audience: "Finance and operations leaders",
      value: "Operational finance visibility with governance controls.",
      metaTitle: "Aipify Finance | Operational Finance Business Pack",
      metaDescription:
        "Operational finance visibility, billing awareness, and governed workflows for finance and business operations leaders.",
      headline: "Operational finance with governance built in",
      introduction:
        "Give finance and operations leaders visibility into billing context, subscription awareness, and operational finance signals — with controls appropriate for sensitive work.",
      heroCapabilities: {
        "1": "Operational finance reporting",
        "2": "Billing and subscription awareness",
        "3": "Approval-governed financial actions",
        "4": "Executive finance briefings",
      },
      outcomes: {
        "1": {
          title: "Clearer finance visibility",
          body: "Operational finance signals surface with context — not disconnected spreadsheet exports.",
        },
        "2": {
          title: "Billing context for teams",
          body: "Support and operations understand subscription and billing status within governed views.",
        },
        "3": {
          title: "Governed sensitive actions",
          body: "High-risk financial changes require explicit approvers and audit trails.",
        },
        "4": {
          title: "Audit-ready documentation",
          body: "Prepared summaries support review cycles without exposing unnecessary raw records.",
        },
      },
      capabilities: {
        "1": "Operational finance reporting",
        "2": "Billing and subscription awareness",
        "3": "Approval-governed financial actions",
        "4": "Executive finance briefings",
        "5": "Policy enforcement",
        "6": "Document preparation with review",
      },
      steps: {
        "1": {
          title: "Connect approved finance context",
          body: "Link accounting, billing, and operational data sources with appropriate access levels.",
        },
        "2": {
          title: "Aipify surfaces finance signals",
          body: "Summaries and alerts focus on patterns and outcomes — not unnecessary raw records.",
        },
        "3": {
          title: "Finance teams review and approve",
          body: "Sensitive actions require human approval with explainable context.",
        },
        "4": {
          title: "Leadership receives briefings",
          body: "Executive finance views highlight risks, trends, and recommended focus areas.",
        },
      },
      governanceTitle: "Financial control stays explicit",
      governanceBody:
        "Critical financial actions require explicit human approval. Aipify does not autonomously process payments, issue refunds, or execute high-risk financial changes.",
      whoForTitle: "Built for finance leaders",
      whoForBody:
        "Finance leaders, business operations teams, and organizations needing operational finance visibility with enterprise-grade governance and audit expectations.",
      planActivationTitle: "Activate on Business",
      planActivationBody:
        "Add Aipify Finance on a Business plan. Purchase the pack, complete activation validation, and grant finance and operations teams governed access.",
      primaryCta: "Get Aipify Finance",
      finalCtaTitle: "READY TO MOVE FORWARD?",
      finalCtaSubtitle:
        "Get Aipify Finance on your Business plan — or book a demo to review operational finance visibility.",
    },
  },
};

const pricingCatalog = {
  hosts: {
    audience: "Hospitality and property operators",
    value: "Guest operations, property workflows, and occupancy visibility.",
  },
  support: {
    audience: "Customer service and support teams",
    value: "Governed triage, knowledge-backed responses, and escalation.",
  },
  commerce: {
    audience: "Retail and e-commerce operations",
    value: "Order visibility, inventory coordination, and customer touchpoints.",
  },
  services: {
    audience: "Professional services organizations",
    value: "Client delivery, knowledge retention, and executive visibility.",
  },
  projects: {
    audience: "Project-driven teams",
    value: "Delivery coordination, approvals, and operational handoffs.",
  },
  finance: {
    audience: "Finance and operations leaders",
    value: "Operational finance visibility with governance controls.",
  },
};

const locales = ["en", "no", "sv", "da"];

for (const locale of locales) {
  const filePath = path.join(root, "locales", locale, "marketing.json");
  const marketing = JSON.parse(fs.readFileSync(filePath, "utf8"));

  marketing.businessPackDetailPages = businessPackDetailPages;

  if (!marketing.pricingPage?.businessPacks) {
    throw new Error(`pricingPage.businessPacks missing in ${locale}`);
  }
  marketing.pricingPage.businessPacks.catalog = pricingCatalog;

  fs.writeFileSync(filePath, `${JSON.stringify(marketing, null, 2)}\n`);
  console.log(`Updated ${filePath}`);
}
