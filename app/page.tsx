"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import knowledgeBase from "../data/source-docs/sampleKnowledgeBase.json";
import type {
  AiGuidance,
  AutomaticSafetyReview,
  InstalledEquipment,
  RecallResult,
} from "./types";

type EngagementType =
  | "Inspection"
  | "Customer Training"
  | "Fire Department / Recruit Training"
  | "Municipality / Public Safety Event"
  | "Convention / Trade Show"
  | "Customer Meeting"
  | "Continuing Education Prep";

type Audience =
  | "Facility Manager"
  | "Fire Department"
  | "Municipality"
  | "Building Owner"
  | "Internal Inspector"
  | "Instructor / Trainer";

type BriefAction =
  | "inspection_prep"
  | "training_prep"
  | "event_prep"
  | "customer_talking_points"
  | "follow_up_notes";

type ServiceLens = {
  id: string;
  label: string;
  focus: string[];
};

type SiteProfile = {
  label: string;
  type: string;
  primaryAudience: string;
  systems: string[];
  installedEquipment: InstalledEquipment[];
  reminder: string;
  trainingNeed: string;
  documentationNeed: string;
  relatedServiceLenses: string[];
  relatedService: string;
};

const engagementTypes: EngagementType[] = [
  "Inspection",
  "Customer Training",
  "Fire Department / Recruit Training",
  "Municipality / Public Safety Event",
  "Convention / Trade Show",
  "Customer Meeting",
  "Continuing Education Prep",
];

const audiences: Audience[] = [
  "Facility Manager",
  "Fire Department",
  "Municipality",
  "Building Owner",
  "Internal Inspector",
  "Instructor / Trainer",
];

const serviceLenses = knowledgeBase.serviceLenses as ServiceLens[];

const sampleSiteDetails: Record<string, SiteProfile> = {
  "No sample site selected": {
    label: "No sample site selected",
    type: "No demo profile selected",
    primaryAudience: "Not selected",
    systems: [],
    installedEquipment: [],
    reminder: "No reminder selected",
    trainingNeed: "No training need selected",
    documentationNeed: "No documentation need selected",
    relatedServiceLenses: [],
    relatedService: "Documentation review",
  },
  "Municipal Facilities Account": {
    label: "Municipal Facilities Account",
    type: "Municipality",
    primaryAudience: "Municipality / facilities leadership",
    systems: [
      "Fire extinguishers",
      "Fire alarm and detection",
      "Emergency lighting",
      "Sprinkler system",
      "Hydrants near public buildings",
    ],
    installedEquipment: [
      {
        category: "fire extinguisher",
        productName: "Commercial fire extinguishers",
        manufacturer: "Kidde",
        model: "Model/date range to verify",
        locationContext: "Municipal facilities and public buildings",
        serviceStatus: "Annual inspection cycle due in 28 days",
        documentationNote: "Verify extinguisher tags, model/date codes, and inspection status.",
        trainingRelevance: "Facilities refresher on monthly visual checks and escalation.",
      },
      {
        category: "emergency light",
        productName: "Emergency lighting units",
        manufacturer: "Manufacturer to verify",
        model: "Model to verify",
        locationContext: "Public building egress paths",
        serviceStatus: "Documentation review due with annual inspection cycle",
        documentationNote: "Confirm test records and open deficiency notes.",
        trainingRelevance: "Explain visual checks and documentation expectations.",
      },
      {
        category: "hydrant",
        productName: "Public building hydrants",
        manufacturer: "Manufacturer to verify",
        model: "Model to verify",
        locationContext: "Hydrants near municipal public buildings",
        serviceStatus: "Inspection / flow testing discussion recommended",
        documentationNote: "Confirm hydrant inspection or flow testing history.",
        trainingRelevance: "Useful for public safety and municipal planning conversations.",
      },
    ],
    reminder: "Annual inspection cycle due in 28 days",
    trainingNeed:
      "Facilities team refresher on monthly visual checks, documentation, and when to contact service support",
    documentationNeed:
      "Inspection reports, emergency lighting test documentation, extinguisher inspection status, alarm testing records, open deficiency notes",
    relatedServiceLenses: [
      "Inspection, Testing & Maintenance",
      "Documentation / Deficiency Follow-Up",
      "Fire Extinguishers",
      "Fire Alarm & Detection",
      "Fire Hydrants",
    ],
    relatedService:
      "Emergency lighting inspection and documentation review; extinguisher inspection and training; alarm testing review; hydrant inspection / flow testing conversation; recurring service reminder review",
  },
  "Fire Department Recruit Session": {
    label: "Fire Department Recruit Session",
    type: "Fire Department / recruit training",
    primaryAudience: "Fire Department",
    systems: [
      "Sprinkler system demonstration",
      "Fire pump overview",
      "Hydrant flow discussion",
      "Alarm response awareness",
      "Valve/control assembly examples",
    ],
    installedEquipment: [
      {
        category: "sprinkler",
        productName: "Sprinkler demonstration components",
        manufacturer: "Manufacturer to verify",
        model: "Model to verify",
        locationContext: "Recruit training demonstration materials",
        serviceStatus: "Training session next month",
        documentationNote: "Confirm demo component source and instructor notes.",
        trainingRelevance: "Supports system behavior and response-awareness discussion.",
      },
      {
        category: "fire pump",
        productName: "Fire pump overview equipment",
        manufacturer: "Manufacturer to verify",
        model: "Model to verify",
        locationContext: "Recruit training discussion",
        serviceStatus: "Training prep",
        documentationNote: "Verify manufacturer manuals or approved diagrams before teaching.",
        trainingRelevance: "Helps recruits understand system behavior during response.",
      },
      {
        category: "alarm panel",
        productName: "Fire alarm panel / detection examples",
        manufacturer: "Manufacturer to verify",
        model: "Model to verify",
        locationContext: "Alarm response awareness segment",
        serviceStatus: "Training prep",
        documentationNote: "Use approved photos or diagrams.",
        trainingRelevance: "Supports what crews should recognize, avoid, report, or escalate.",
      },
    ],
    reminder: "Recruit training session next month",
    trainingNeed:
      "Explain how fire protection systems behave during response and what crews should recognize, avoid, report, or escalate",
    documentationNeed:
      "Instructor outline, system diagram, photos of common components, likely recruit questions, official source reminders",
    relatedServiceLenses: [
      "Customer Training",
      "Fire Sprinklers",
      "Fire Hydrants",
      "Fire Alarm & Detection",
    ],
    relatedService:
      "Hydrant inspection / flow testing conversation; sprinkler system education; alarm response awareness; additional customer training opportunities",
  },
  "Healthcare Facility ITM Review": {
    label: "Healthcare Facility ITM Review",
    type: "Healthcare facility",
    primaryAudience: "Facility Manager / Building Owner",
    systems: [
      "Fire alarm and detection",
      "Sprinkler system",
      "Emergency lighting",
      "Fire extinguishers",
      "Special hazard areas where applicable",
    ],
    installedEquipment: [
      {
        category: "fire alarm",
        productName: "Fire alarm and detection system",
        manufacturer: "Manufacturer to verify",
        model: "Panel/model to verify",
        locationContext: "Healthcare facility life-safety system",
        serviceStatus: "Semiannual service review and documentation check",
        documentationNote: "Review alarm test records and service history.",
        trainingRelevance: "Facilities refresher on documentation and escalation.",
      },
      {
        category: "sprinkler",
        productName: "Sprinkler system",
        manufacturer: "Manufacturer to verify",
        model: "Model/components to verify",
        locationContext: "Healthcare facility",
        serviceStatus: "Semiannual ITM review",
        documentationNote: "Review inspection notes and deficiency list.",
        trainingRelevance: "Supports facility manager discussion on readiness and records.",
      },
      {
        category: "emergency light",
        productName: "Emergency lighting",
        manufacturer: "Manufacturer to verify",
        model: "Model to verify",
        locationContext: "Egress paths and patient/public areas",
        serviceStatus: "Documentation check",
        documentationNote: "Confirm emergency lighting test records.",
        trainingRelevance: "Useful for facilities team documentation refresher.",
      },
    ],
    reminder: "Semiannual service review and documentation check",
    trainingNeed:
      "Facilities team refresher on inspection records, deficiencies, and escalation steps",
    documentationNeed:
      "Inspection reports, service history, open deficiency list, emergency lighting and alarm test records, manufacturer documentation for any affected product",
    relatedServiceLenses: [
      "Inspection, Testing & Maintenance",
      "Fire Alarm & Detection",
      "Fire Sprinklers",
      "Documentation / Deficiency Follow-Up",
    ],
    relatedService:
      "Documentation review; emergency lighting inspection; alarm testing review; preventive maintenance; deficiency follow-up",
  },
  "Industrial Special Hazards Review": {
    label: "Industrial Special Hazards Review",
    type: "Industrial / special hazards",
    primaryAudience: "Facility Manager / Internal Inspector",
    systems: [
      "Special hazard suppression system",
      "Fire extinguishers",
      "Fire alarm and detection",
      "Emergency response equipment",
      "Possible foam-related equipment depending on site",
    ],
    installedEquipment: [
      {
        category: "special hazard",
        productName: "Special hazard suppression system",
        manufacturer: "Manufacturer to verify",
        model: "System/model to verify",
        locationContext: "Industrial special hazard area",
        serviceStatus: "System review due this quarter",
        documentationNote: "Verify manufacturer manuals, service records, and qualified review needs.",
        trainingRelevance: "Internal prep for system-specific customer communication.",
      },
      {
        category: "fire extinguisher",
        productName: "Industrial fire extinguishers",
        manufacturer: "Manufacturer to verify",
        model: "Model/date range to verify",
        locationContext: "Industrial production or hazard areas",
        serviceStatus: "Preventive maintenance review",
        documentationNote: "Confirm inspection tags, locations, and service history.",
        trainingRelevance: "Supports customer education around readiness and escalation.",
      },
    ],
    reminder: "Special hazards system review due this quarter",
    trainingNeed:
      "Internal prep around system-specific documentation, qualified review, and customer communication",
    documentationNeed:
      "Manufacturer manuals, inspection/testing records, service history, deficiency photos/notes, exact product/model details",
    relatedServiceLenses: [
      "Special Hazards",
      "Clean Foam Testing",
      "Emergency Service",
      "Documentation / Deficiency Follow-Up",
    ],
    relatedService:
      "Special hazard system review; clean foam testing discussion if applicable; documentation review; emergency service readiness; preventive maintenance",
  },
  "Education Campus Facilities Training": {
    label: "Education Campus Facilities Training",
    type: "Education / campus facilities",
    primaryAudience: "Facility Manager / Instructor or Trainer",
    systems: [
      "Fire extinguishers",
      "Alarm panels",
      "Sprinkler systems",
      "Emergency lighting",
      "Exit signs",
    ],
    installedEquipment: [
      {
        category: "fire extinguisher",
        productName: "Campus fire extinguishers",
        manufacturer: "Kidde",
        model: "Model/date range to verify",
        locationContext: "Campus facilities and common areas",
        serviceStatus: "Facilities refresher before semester start",
        documentationNote: "Verify tags, placement, and service calendar.",
        trainingRelevance: "Supports monthly visual check and extinguisher awareness training.",
      },
      {
        category: "alarm panel",
        productName: "Alarm panels",
        manufacturer: "Manufacturer to verify",
        model: "Panel model to verify",
        locationContext: "Campus buildings",
        serviceStatus: "Service calendar review",
        documentationNote: "Confirm alarm testing records and contacts.",
        trainingRelevance: "Useful for facilities escalation steps.",
      },
      {
        category: "exit sign",
        productName: "Exit signs and emergency lighting",
        manufacturer: "Manufacturer to verify",
        model: "Model to verify",
        locationContext: "Egress routes",
        serviceStatus: "Pre-semester readiness review",
        documentationNote: "Confirm inspection and testing documentation.",
        trainingRelevance: "Supports visual check training.",
      },
    ],
    reminder: "Facilities refresher before semester start",
    trainingNeed:
      "Prepare facilities team for visual checks, documentation, and escalation steps",
    documentationNeed:
      "Training outline, equipment checklist, service calendar, monthly visual check guidance, follow-up note template",
    relatedServiceLenses: [
      "Customer Training",
      "Fire Extinguishers",
      "Fire Alarm & Detection",
      "Fire Sprinklers",
      "Inspection, Testing & Maintenance",
    ],
    relatedService:
      "Extinguisher training; emergency lighting inspection; alarm testing review; sprinkler inspection; recurring reminders",
  },
  "Distribution Warehouse Inspection Prep": {
    label: "Distribution Warehouse Inspection Prep",
    type: "Commercial / distribution warehouse",
    primaryAudience: "Facility Manager / Building Owner",
    systems: [
      "Fire extinguishers",
      "Sprinkler system",
      "Fire alarm and detection",
      "Emergency lighting",
      "Possible special hazard areas",
    ],
    installedEquipment: [
      {
        category: "fire extinguisher",
        productName: "Warehouse fire extinguishers",
        manufacturer: "Kidde",
        model: "Model/date range to verify",
        locationContext: "Warehouse floor and loading areas",
        serviceStatus: "Annual inspection and extinguisher training review",
        documentationNote: "Verify tags, location list, and training records.",
        trainingRelevance: "Warehouse team refresher on extinguisher use and reporting issues.",
      },
      {
        category: "sprinkler",
        productName: "Warehouse sprinkler system",
        manufacturer: "Manufacturer to verify",
        model: "Components to verify",
        locationContext: "Warehouse storage areas",
        serviceStatus: "Annual inspection prep",
        documentationNote: "Review inspection notes and open deficiencies.",
        trainingRelevance: "Supports facility manager discussion on storage and readiness.",
      },
      {
        category: "emergency light",
        productName: "Emergency lighting",
        manufacturer: "Manufacturer to verify",
        model: "Model to verify",
        locationContext: "Warehouse egress paths",
        serviceStatus: "Annual inspection prep",
        documentationNote: "Confirm emergency lighting test documentation.",
        trainingRelevance: "Supports evacuation basics and maintenance awareness.",
      },
    ],
    reminder: "Annual inspection and extinguisher training review",
    trainingNeed:
      "Warehouse team refresher on extinguisher use, evacuation basics, and when to report issues",
    documentationNeed:
      "Extinguisher inspection records, alarm testing records, sprinkler inspection notes, emergency lighting test documentation, open deficiencies",
    relatedServiceLenses: [
      "Inspection, Testing & Maintenance",
      "Customer Training",
      "Fire Extinguishers",
      "Fire Sprinklers",
      "Fire Alarm & Detection",
    ],
    relatedService:
      "Extinguisher training; emergency lighting inspection; alarm testing review; sprinkler inspection; preventive maintenance",
  },
};

const sampleSites = Object.keys(sampleSiteDetails);

const briefActions: Array<{ label: string; value: BriefAction }> = [
  { label: "Generate Inspection Prep", value: "inspection_prep" },
  { label: "Generate Training Prep", value: "training_prep" },
  { label: "Generate Event Prep", value: "event_prep" },
  { label: "Generate Customer Talking Points", value: "customer_talking_points" },
  { label: "Generate Follow-Up Notes", value: "follow_up_notes" },
];

const quickSearches = [
  "smoke alarm",
  "fire extinguisher",
  "sprinkler",
  "fire alarm",
  "alarm panel",
  "hydrant",
  "fire pump",
  "emergency light",
  "exit sign",
  "special hazard",
  "Kidde",
  "First Alert",
];

const prepByEngagement: Record<
  EngagementType,
  {
    materials: string[];
    checklist: string[];
    questions: string[];
    topics: string[];
    followUp: string;
    notes: string;
  }
> = {
  Inspection: {
    materials: ["Tablet or inspection forms", "Customer asset list", "Recent service notes"],
    checklist: [
      "Confirm site address and contact",
      "Review equipment types expected on-site",
      "Note any relevant public recall results",
    ],
    questions: [
      "Have any devices been replaced recently?",
      "Are there recurring deficiencies or nuisance alarms?",
    ],
    topics: ["Inspection scope", "Deficiency documentation", "Next-step approvals"],
    followUp: "Send findings and any recall-related notes to the service manager for review.",
    notes: "Use company inspection procedures and applicable code requirements as the authority.",
  },
  "Customer Training": {
    materials: ["Training outline", "Sign-in sheet", "Device examples or photos"],
    checklist: [
      "Confirm audience and training objective",
      "Prepare plain-language recall context if relevant",
      "Bring approved customer-facing materials",
    ],
    questions: [
      "Which employees need hands-on instruction?",
      "What equipment do attendees interact with most often?",
    ],
    topics: ["Fire extinguisher use", "Alarm response basics", "Maintenance awareness"],
    followUp: "Document attendance and send unresolved product questions for internal review.",
    notes: "This is instructor prep, not a certification or LMS workflow.",
  },
  "Fire Department / Recruit Training": {
    materials: ["Demo talking points", "Business cards", "Approved service literature"],
    checklist: [
      "Review common public safety questions",
      "Prepare examples of recall-aware service conversations",
      "Confirm booth or presentation logistics",
    ],
    questions: [
      "What systems are local departments asking about?",
      "Are attendees focused on inspections, training, or modernization?",
    ],
    topics: ["Public safety education", "System readiness", "Preventive maintenance"],
    followUp: "Capture questions that need a technical or service-leadership response.",
    notes: "Focus on response awareness, scene safety, and what firefighters should recognize or report.",
  },
  "Municipality / Public Safety Event": {
    materials: ["Public safety talking points", "Inspection schedule notes", "Approved service literature"],
    checklist: [
      "Review public safety priorities",
      "Prepare documentation and inspection timing notes",
      "Identify questions that need qualified technical follow-up",
    ],
    questions: [
      "How should facilities prioritize documentation?",
      "What safety issues should be escalated after an event?",
    ],
    topics: ["Inspection timing", "Risk prioritization", "Community or facility impact"],
    followUp: "Document public safety questions and route them to the right internal owner.",
    notes: "Keep guidance educational and avoid final code or compliance determinations.",
  },
  "Convention / Trade Show": {
    materials: [
      "Approved service literature",
      "Product safety talking points",
      "Lead or follow-up note template",
    ],
    checklist: [
      "Confirm booth/event objective",
      "Prepare concise customer-friendly explanations",
      "Route technical questions to qualified internal review",
    ],
    questions: [
      "What systems are attendees asking about?",
      "Are they preparing for inspections, training, or documentation reviews?",
      "Who should receive follow-up after the event?",
    ],
    topics: [
      "Customer education",
      "Inspection and documentation awareness",
      "Related service considerations",
    ],
    followUp:
      "Capture attendee questions, related service interests, and any items needing technical or service-leadership follow-up.",
    notes:
      "Use this for event preparation only; do not make final product, compliance, or service commitments from AI guidance.",
  },
  "Customer Meeting": {
    materials: ["Account notes", "Open service items", "Relevant recall summaries"],
    checklist: [
      "Confirm meeting goal",
      "Review known equipment and recent work",
      "Prepare safety-focused talking points",
    ],
    questions: [
      "Are there upcoming inspections or capital projects?",
      "Has the customer asked about equipment age or reliability?",
    ],
    topics: ["Risk reduction", "Maintenance planning", "Customer confidence"],
    followUp: "Send action items to the account or service owner before customer outreach.",
    notes: "Use AI output as preparation only; customer messaging still needs approval.",
  },
  "Continuing Education Prep": {
    materials: ["Lesson outline", "Discussion prompts", "Relevant standards/manuals to verify"],
    checklist: [
      "Confirm learning objective",
      "Prepare practical examples",
      "Flag standards, manuals, or manufacturer documents to verify",
    ],
    questions: [
      "What should attendees know how to recognize?",
      "Which details require official documentation?",
    ],
    topics: ["Teaching points", "Practical examples", "Follow-up reminders"],
    followUp: "Capture questions that should become future continuing education topics.",
    notes: "Use this as instructor preparation, not as the final training authority.",
  },
};

const formatDate = (date: string) => {
  if (!date) return "Date not listed";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

const equipmentLabel = (item: InstalledEquipment) =>
  [item.manufacturer, item.productName, item.model]
    .filter((part) => part && !part.toLowerCase().includes("to verify"))
    .join(" ") || item.category;

const searchTermsForEquipment = (equipment: InstalledEquipment[]) =>
  Array.from(
    new Set(
      equipment.flatMap((item) => {
        const terms = [
          `${item.manufacturer} ${item.productName}`,
          `${item.manufacturer} ${item.category}`,
          item.model && !item.model.toLowerCase().includes("to verify")
            ? `${item.manufacturer} ${item.model}`
            : "",
          item.productName,
          item.category,
        ];
        return terms
          .map((term) => term.replace(/\s+/g, " ").trim())
          .filter(
            (term) =>
              term &&
              !term.toLowerCase().startsWith("manufacturer to verify") &&
              !term.toLowerCase().includes("model to verify"),
          );
      }),
    ),
  ).slice(0, 10);

const emptySafetyReview = (equipment: InstalledEquipment[] = []): AutomaticSafetyReview => ({
  equipmentChecked: equipment,
  searchTermsUsed: [],
  possibleMatches: [],
  noObviousMatchTerms: [],
  needsVerification: [
    "Verify exact product model, manufacturer, date range, and installed equipment before action.",
  ],
});

const SectionTitle = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) => (
  <div>
    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-green">
      {eyebrow}
    </p>
    <h2 className="mt-2 text-2xl font-extrabold leading-tight text-brand-charcoal sm:text-[28px]">
      {title}
    </h2>
    {description ? (
      <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-gray700">
        {description}
      </p>
    ) : null}
  </div>
);

const BriefBlock = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-brand-gray200 bg-brand-gray100 p-4">
    <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-brand-charcoal">
      {title}
    </h3>
    <div className="mt-2 text-sm leading-6 text-brand-gray700">{children}</div>
  </div>
);

const PacketSection = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => (
  <details
    open={defaultOpen}
    className="rounded-xl border border-brand-gray200 bg-brand-gray100 p-4"
  >
    <summary className="cursor-pointer text-sm font-extrabold uppercase tracking-[0.08em] text-brand-charcoal">
      {title}
    </summary>
    <div className="mt-3 text-sm leading-6 text-brand-gray700">{children}</div>
  </details>
);

const StepLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-green">
    {children}
  </p>
);

const ReadinessPacket = ({
  guidance,
  selectedRecall,
  engagementType,
  audience,
  sampleSite,
  serviceLens,
  summarySource,
  briefAction,
  automaticSafetyReview,
}: {
  guidance: AiGuidance | null;
  selectedRecall: RecallResult | null;
  engagementType: EngagementType;
  audience: Audience;
  sampleSite: string;
  serviceLens: ServiceLens;
  summarySource: string;
  briefAction: BriefAction;
  automaticSafetyReview: AutomaticSafetyReview;
}) => {
  if (!guidance) return null;

  return (
    <section className="rounded-2xl border border-brand-gray200 bg-white p-5 shadow-panel sm:p-6">
      <div className="border-b border-brand-gray200 pb-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-green px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-white">
            AI-Generated
          </span>
          <span className="rounded-full border border-brand-red px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-brand-red">
            Human Review Required
          </span>
          <span className="rounded-full border border-brand-warning px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-brand-warning">
            Source Verification Needed
          </span>
          <span className="rounded-full border border-brand-gray200 bg-brand-gray100 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-brand-gray700">
            {summarySource === "openai" ? "Generated with OpenAI" : "Demo Fallback Response"}
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-extrabold text-brand-charcoal">
          AI Engagement Readiness Packet
        </h2>
        <p className="mt-2 text-sm leading-6 text-brand-gray700">
          {engagementType} | {audience} |{" "}
          {briefActions.find((action) => action.value === briefAction)?.label}.
          Site context: {sampleSite}. Service lens: {serviceLens.label}.
          Product safety context:{" "}
          {selectedRecall
            ? selectedRecall.title
            : "No product safety recall selected"}
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <PacketSection title="Source Context Used" defaultOpen>
          <ul className="space-y-2">
            {guidance.sourceContextUsed.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PacketSection>
        <div className="rounded-xl border border-brand-gray200 bg-brand-gray100 p-4 md:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-brand-charcoal">
                Readiness Score
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-gray700">
                Readiness reflects preparation completeness, not code compliance
                or safety approval.
              </p>
            </div>
            <div className="text-4xl font-black text-brand-green">
              {Math.round(guidance.readinessScore)}%
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-brand-gray700">
            {guidance.readinessScoreReason}
          </p>
        </div>

        <PacketSection title="Key Attention Flags" defaultOpen>
          <ul className="space-y-2">
            {guidance.keyAttentionFlags.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PacketSection>
        <PacketSection title="Recommended Next Best Actions" defaultOpen>
          <ul className="space-y-2">
            {guidance.recommendedNextBestActions.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PacketSection>
        <PacketSection title="Missing Information to Verify">
          <ul className="space-y-2">
            {guidance.missingInformationToVerify.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PacketSection>
        <PacketSection title="Internal Field Brief" defaultOpen>
          {guidance.internalFieldBrief}
        </PacketSection>
        <PacketSection title="Customer / Audience Talking Points">
          <ul className="space-y-2">
            {guidance.audienceSpecificTalkingPoints.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PacketSection>
        <PacketSection title="Installed Equipment Review">
          <ul className="space-y-2">
            {guidance.installedEquipmentReview.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PacketSection>
        <PacketSection title="Equipment / Product Checklist">
          <ul className="space-y-2">
            {guidance.equipmentProductChecklist.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PacketSection>
        <PacketSection title="Product Safety / Recall Review">
          <ul className="space-y-2">
            {guidance.productSafetyRecallReview.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-warning" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PacketSection>
        <PacketSection title="Instructor / Event Prep Notes">
          <ul className="space-y-2">
            {guidance.trainingOrEventPrepNotes.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PacketSection>
        <PacketSection title="Optional Manual Product Safety Search Result">
          {selectedRecall ? (
            <div className="space-y-3">
              <p>
                <strong className="text-brand-charcoal">Selected recall:</strong>{" "}
                {selectedRecall.title}
              </p>
              <ul className="space-y-2">
                {guidance.knownSourceFacts.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>
              No manual product safety recall selected. Packet uses the
              automatic product safety review from installed site equipment.
            </p>
          )}
        </PacketSection>
        <PacketSection title="Automatic Review Details">
          <div className="space-y-3">
            <div>
              <p className="font-extrabold text-brand-charcoal">Equipment checked</p>
              <ul className="mt-1 space-y-1">
                {automaticSafetyReview.equipmentChecked.map((item) => (
                  <li key={`${item.category}-${item.productName}`}>
                    {equipmentLabel(item)} - {item.locationContext}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-extrabold text-brand-charcoal">Search terms used</p>
              <p>{automaticSafetyReview.searchTermsUsed.join(", ") || "No automatic search terms available."}</p>
            </div>
            <p>
              Possible matches are not applicability decisions. Verify model,
              date range, manufacturer documentation, site equipment, and the
              official source before action.
            </p>
          </div>
        </PacketSection>
        <PacketSection title="Protect / Prevent / Preserve Lens">
          <ul className="space-y-2">
            {guidance.protectPreventPreserveLens.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PacketSection>
        <PacketSection title="Deficiency / Documentation Follow-Up">
          <ul className="space-y-2">
            {guidance.deficiencyDocumentationFollowUp.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PacketSection>
        <PacketSection title="Related Service Considerations">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Safety / Risk Reduction", guidance.relatedServiceGroups.safetyRiskReduction],
              ["Maintenance / Testing", guidance.relatedServiceGroups.maintenanceTesting],
              ["Customer Education", guidance.relatedServiceGroups.customerEducation],
              ["Documentation / Follow-Up", guidance.relatedServiceGroups.documentationFollowUp],
              [
                "Modernization / Replacement Discussion",
                guidance.relatedServiceGroups.modernizationReplacement,
              ],
            ].map(([groupTitle, items]) => (
              <div key={groupTitle as string}>
                <p className="font-extrabold text-brand-charcoal">
                  {groupTitle as string}
                </p>
                <ul className="mt-1 space-y-1">
                  {(items as string[]).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </PacketSection>
        <PacketSection title="Follow-Up Note Draft">
          <div className="whitespace-pre-line">{guidance.followUpNoteDraft}</div>
        </PacketSection>
        <PacketSection title="Known from Source">
          <ul className="space-y-2">
            {guidance.knownSourceFacts.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PacketSection>
        <PacketSection title="Provided by User/Demo Profile">
          <ul className="space-y-2">
            {guidance.providedDemoProfileContext.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PacketSection>
        <PacketSection title="AI Interpretation">
          <ul className="space-y-2">
            {guidance.aiInterpretation.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-warning" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PacketSection>
      </div>

      <div className="mt-5 rounded-xl border-l-4 border-brand-warning bg-[#fff8e8] p-4 text-sm leading-6 text-brand-gray700">
        <strong className="text-brand-charcoal">Official Source Reminder:</strong>{" "}
        {guidance.officialSourceReminder}
      </div>
    </section>
  );
};

export default function Home() {
  const [engagementType, setEngagementType] =
    useState<EngagementType>("Inspection");
  const [audience, setAudience] = useState<Audience>("Internal Inspector");
  const [selectedSampleSite, setSelectedSampleSite] = useState(sampleSites[0]);
  const [selectedServiceLensId, setSelectedServiceLensId] = useState(serviceLenses[0].id);
  const [briefAction, setBriefAction] = useState<BriefAction>("inspection_prep");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RecallResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedRecall, setSelectedRecall] = useState<RecallResult | null>(null);
  const [guidance, setGuidance] = useState<AiGuidance | null>(null);
  const [summarySource, setSummarySource] = useState("");
  const [summarizingId, setSummarizingId] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [automaticSafetyReview, setAutomaticSafetyReview] =
    useState<AutomaticSafetyReview>(() => emptySafetyReview(sampleSiteDetails[sampleSites[0]].installedEquipment));
  const [autoReviewLoading, setAutoReviewLoading] = useState(false);

  const prep = prepByEngagement[engagementType];
  const selectedSiteDetails = sampleSiteDetails[selectedSampleSite];
  const selectedServiceLens =
    serviceLenses.find((lens) => lens.id === selectedServiceLensId) ?? serviceLenses[0];
  const sourceContextUsed = [
    "Automatic product safety review based on selected site equipment",
    selectedRecall
      ? `Optional manual CPSC recall result: ${selectedRecall.title}`
      : "No manual product safety recall selected. Packet is based on engagement, site, service, prep context, and automatic product safety review.",
    `Sample site profile: ${selectedSiteDetails.label}`,
    `Ryan Service Lens: ${selectedServiceLens.label}`,
    `Engagement type: ${engagementType}`,
    `Audience: ${audience}`,
    "Demo source notes: service environment brief, source hierarchy, documentation/deficiency follow-up logic, and training/event prep frameworks",
  ];

  const resultCountLabel = useMemo(() => {
    if (!hasSearched || searching) return "";
    return `${results.length} ${results.length === 1 ? "result" : "results"} found`;
  }, [hasSearched, results.length, searching]);

  useEffect(() => {
    let ignore = false;

    const runAutomaticReview = async () => {
      const equipment = selectedSiteDetails.installedEquipment;
      const terms = searchTermsForEquipment(equipment);
      setAutoReviewLoading(true);
      setAutomaticSafetyReview({
        ...emptySafetyReview(equipment),
        searchTermsUsed: terms,
        noObviousMatchTerms: terms,
      });

      if (!terms.length) {
        setAutoReviewLoading(false);
        return;
      }

      try {
        const responses = await Promise.allSettled(
          terms.map(async (term) => {
            const response = await fetch(`/api/recalls?q=${encodeURIComponent(term)}`);
            const payload = await response.json();
            if (!response.ok) {
              throw new Error(payload.error || "Unable to retrieve recall data.");
            }
            return {
              term,
              results: (payload.results || []) as RecallResult[],
            };
          }),
        );

        if (ignore) return;

        const possibleMatches = responses.flatMap((result) => {
          if (result.status !== "fulfilled") return [];
          const equipmentForTerm =
            equipment.find((item) => {
              const term = result.value.term.toLowerCase();
              return (
                term.includes(item.category.toLowerCase()) ||
                term.includes(item.productName.toLowerCase()) ||
                term.includes(item.manufacturer.toLowerCase())
              );
            }) ?? equipment[0];
          return result.value.results.slice(0, 2).map((recall) => ({
            searchTerm: result.value.term,
            equipmentLabel: equipmentForTerm ? equipmentLabel(equipmentForTerm) : result.value.term,
            recall,
          }));
        });

        const matchedTerms = new Set(possibleMatches.map((match) => match.searchTerm));
        setAutomaticSafetyReview({
          equipmentChecked: equipment,
          searchTermsUsed: terms,
          possibleMatches: possibleMatches.slice(0, 8),
          noObviousMatchTerms: terms.filter((term) => !matchedTerms.has(term)),
          needsVerification: [
            "Possible matches require model, manufacturer, date range, and installed-equipment verification.",
            "No obvious recall match found in this search is not proof that no recall exists.",
            "Verify official CPSC notices, manufacturer instructions, site records, and company procedures before action.",
          ],
        });
      } catch {
        if (!ignore) {
          setAutomaticSafetyReview({
            ...emptySafetyReview(equipment),
            searchTermsUsed: terms,
            noObviousMatchTerms: terms,
            needsVerification: [
              "Automatic product safety review could not retrieve all CPSC results.",
              "Verify product safety context manually against official CPSC and manufacturer sources.",
            ],
          });
        }
      } finally {
        if (!ignore) setAutoReviewLoading(false);
      }
    };

    void runAutomaticReview();

    return () => {
      ignore = true;
    };
  }, [selectedSiteDetails]);

  const searchRecalls = async (term = query) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;

    setQuery(cleanTerm);
    setSearching(true);
    setHasSearched(true);
    setSearchError("");
    setSummaryError("");
    setGuidance(null);
    setSummarySource("");
    setSelectedRecall(null);

    try {
      const response = await fetch(`/api/recalls?q=${encodeURIComponent(cleanTerm)}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to retrieve recall data right now.");
      }
      setResults(payload.results || []);
    } catch (error) {
      setResults([]);
      setSearchError(
        error instanceof Error
          ? error.message
          : "Unable to retrieve recall data right now.",
      );
    } finally {
      setSearching(false);
    }
  };

  const generateSummary = async (
    recall: RecallResult | null = selectedRecall,
    action = briefAction,
  ) => {
    if (recall) {
      setSelectedRecall(recall);
    }
    setGuidance(null);
    setSummarySource("");
    setSummaryError("");
    setSummarizingId(recall?.id ?? "engagement-packet");
    setBriefAction(action);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recall,
          engagementType,
          audience,
          sampleSite: selectedSampleSite,
          siteProfile: selectedSiteDetails,
          serviceLens: selectedServiceLens,
          equipmentSystems: selectedSiteDetails.systems,
          upcomingReminder: selectedSiteDetails.reminder,
          trainingNeed: selectedSiteDetails.trainingNeed,
          documentationNeed: selectedSiteDetails.documentationNeed,
          relatedServiceConsideration: selectedSiteDetails.relatedService,
          prepResources: prep,
          additionalNotes,
          automaticSafetyReview,
          installedEquipment: selectedSiteDetails.installedEquipment,
          sourceContext: {
            sourceContextUsed,
            responsibleAiLabels: knowledgeBase.responsibleAiLabels,
            sourceHierarchy: [
              "Official CPSC recall notices",
              "Manufacturer instructions and product documentation",
              "Applicable codes and NFPA standards",
              "Company procedures and qualified internal review",
              "Verified user-provided site/customer information",
              "AI interpretation or preparation guidance",
            ],
            demoSourceNotes: [
              "Protect: identify immediate safety or customer impact.",
              "Prevent: identify inspection, maintenance, training, testing, or documentation steps that reduce risk.",
              "Preserve: support system reliability, customer confidence, facility continuity, and follow-up planning.",
              "Related service considerations must be framed as safety, education, maintenance, documentation, prevention, modernization, customer confidence, or risk reduction.",
            ],
          },
          briefAction: action,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to generate field brief right now.");
      }
      setGuidance(payload.guidance);
      setSummarySource(typeof payload.source === "string" ? payload.source : "");
    } catch (error) {
      setSummaryError(
        error instanceof Error
          ? error.message
          : "Unable to generate field brief right now.",
      );
    } finally {
      setSummarizingId("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void searchRecalls();
  };

  return (
    <main className="min-h-screen bg-brand-gray100">
      <div className="h-1.5 bg-brand-green" />

      <header className="bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-3 lg:px-6">
          <div className="flex flex-col gap-2 border-b border-brand-gray200 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-black uppercase tracking-[0.03em] text-brand-green sm:text-2xl">
                RYAN FIRE PROTECTION, INC.
              </p>
              <p className="mt-0.5 text-xs font-semibold text-brand-gray700 sm:text-sm">
                Internal Field Assistant Concept
              </p>
            </div>
            <span className="w-fit rounded-full border border-brand-gray200 bg-brand-gray100 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-gray700 sm:text-xs">
              Internal Field Assistant Concept
            </span>
          </div>

          <section className="py-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-green">
                Fire Protection Field Assistant
              </p>
              <h1 className="mt-2 max-w-3xl text-[22px] font-black leading-tight text-brand-charcoal sm:text-[34px]">
                Fire Protection Field Assistant
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-gray700 sm:text-base">
                Prepare internal readiness packets for inspections, customer
                training, fire department events, conventions, customer
                meetings, and continuing education work using service context,
                sample site details, optional public recall data, and
                AI-assisted reasoning.
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-brand-gray100 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-brand-gray700">
                Live CPSC Data
              </span>
              <span className="rounded-full bg-brand-gray100 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-brand-gray700">
                AI-Generated Packet
              </span>
              <span className="rounded-full border border-brand-warning px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-brand-warning">
                Human Review Required
              </span>
            </div>
          </section>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-4 py-4 lg:px-6">
        <section className="rounded-2xl border border-brand-gray200 bg-white p-4 shadow-panel sm:p-5">
          <SectionTitle
            eyebrow="Primary Workflow"
            title="Build an AI Engagement Readiness Packet"
            description="Start with the engagement context. Add product safety or manual context only if it is relevant."
          />
          <div className="mt-5">
            <StepLabel>Step 1: Engagement</StepLabel>
          </div>
          <SectionTitle
            eyebrow="Engagement"
            title="Choose engagement type"
            description="Pick the type of work you are preparing for."
          />
          <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-3">
            {engagementTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setEngagementType(type);
                  setGuidance(null);
                }}
                className={`min-h-12 rounded-xl border px-3 py-2 text-left text-xs font-extrabold transition sm:text-sm ${
                  engagementType === type
                    ? "border-brand-green bg-brand-green text-white"
                    : "border-brand-gray200 bg-white text-brand-charcoal hover:bg-brand-gray100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-brand-gray200 bg-white p-4 shadow-panel sm:p-5">
          <StepLabel>Step 2: Audience, Site, and Service Context</StepLabel>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="text-sm font-bold text-brand-charcoal">
              Audience
              <select
                value={audience}
                onChange={(event) => {
                  setAudience(event.target.value as Audience);
                  setGuidance(null);
                }}
                className="mt-2 min-h-11 w-full rounded-xl border border-brand-gray200 bg-white px-3 text-brand-charcoal"
              >
                {audiences.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-brand-charcoal">
              Sample Site Profile
              <select
                value={selectedSampleSite}
                onChange={(event) => {
                  setSelectedSampleSite(event.target.value);
                  setGuidance(null);
                }}
                className="mt-2 min-h-11 w-full rounded-xl border border-brand-gray200 bg-white px-3 text-brand-charcoal"
              >
                {sampleSites.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-brand-charcoal">
              Ryan Service Lens
              <select
                value={selectedServiceLensId}
                onChange={(event) => {
                  setSelectedServiceLensId(event.target.value);
                  setGuidance(null);
                }}
                className="mt-2 min-h-11 w-full rounded-xl border border-brand-gray200 bg-white px-3 text-brand-charcoal"
              >
                {serviceLenses.map((lens) => (
                  <option key={lens.id} value={lens.id}>
                    {lens.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 rounded-xl border border-brand-gray200 bg-brand-gray100 p-3 text-sm leading-6 text-brand-gray700">
            <p className="font-extrabold text-brand-charcoal">Context being used</p>
            <p className="mt-1">
              Engagement: {engagementType} | Audience: {audience} | Site:{" "}
              {selectedSampleSite} | Service Lens: {selectedServiceLens.label}
            </p>
            <p className="mt-1">
              Optional Manual Search Result:{" "}
              {selectedRecall ? selectedRecall.title : "None selected"}
            </p>
          </div>
          <div className="mt-3 rounded-xl border border-brand-gray200 bg-white p-3 text-sm leading-6 text-brand-gray700">
            <p className="font-extrabold text-brand-charcoal">
              Installed Equipment / Products
            </p>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {selectedSiteDetails.installedEquipment.length ? (
                selectedSiteDetails.installedEquipment.map((item) => (
                  <div
                    key={`${item.category}-${item.productName}-summary`}
                    className="rounded-lg border border-brand-gray200 bg-brand-gray100 p-3"
                  >
                    <p className="font-extrabold text-brand-charcoal">
                      {equipmentLabel(item)}
                    </p>
                    <p className="mt-1">Category: {item.category}</p>
                    <p>Context: {item.locationContext}</p>
                  </div>
                ))
              ) : (
                <p>No installed equipment selected.</p>
              )}
            </div>
          </div>
          <details className="mt-3 rounded-xl border border-brand-gray200 bg-white p-3">
            <summary className="cursor-pointer text-sm font-extrabold text-brand-charcoal">
              View site/source details
            </summary>
            <div className="mt-3 grid gap-3 text-sm leading-6 text-brand-gray700 md:grid-cols-2">
              <div>
                <p className="font-extrabold text-brand-charcoal">Known Systems</p>
                <p>
                  {selectedSiteDetails.systems.length
                    ? selectedSiteDetails.systems.join(", ")
                    : "No sample site systems selected."}
                </p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">
                  Upcoming Reminder
                </p>
                <p>{selectedSiteDetails.reminder}</p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">
                  Training / Education Need
                </p>
                <p>{selectedSiteDetails.trainingNeed}</p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">
                  Documentation / Deficiency Context
                </p>
                <p>{selectedSiteDetails.documentationNeed}</p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">
                  Ryan Service Lens Focus
                </p>
                <p>{selectedServiceLens.focus.join(", ")}</p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">
                  Related Service Considerations
                </p>
                <p>{selectedSiteDetails.relatedService}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-extrabold text-brand-charcoal">
                  Installed Equipment / Products
                </p>
                <div className="mt-2 grid gap-2">
                  {selectedSiteDetails.installedEquipment.length ? (
                    selectedSiteDetails.installedEquipment.map((item) => (
                      <div
                        key={`${item.category}-${item.productName}`}
                        className="rounded-lg border border-brand-gray200 bg-brand-gray100 p-3"
                      >
                        <p className="font-extrabold text-brand-charcoal">
                          {equipmentLabel(item)}
                        </p>
                        <p>Category: {item.category}</p>
                        <p>Location/context: {item.locationContext}</p>
                        <p>Service status: {item.serviceStatus}</p>
                        <p>Documentation note: {item.documentationNote}</p>
                        <p>Training relevance: {item.trainingRelevance}</p>
                      </div>
                    ))
                  ) : (
                    <p>No installed equipment selected.</p>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="font-extrabold text-brand-charcoal">
                  Source Context Used
                </p>
                <ul className="mt-1 space-y-1">
                  {sourceContextUsed.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </details>
          <div className="mt-4 rounded-xl border border-brand-gray200 bg-white p-3">
            <StepLabel>Step 3: Engagement Prep Resources</StepLabel>
            <div className="grid gap-3 text-sm leading-6 text-brand-gray700 md:grid-cols-3">
              <div>
                <p className="font-extrabold text-brand-charcoal">
                  Materials to bring
                </p>
                <ul className="mt-1 space-y-1">
                  {prep.materials.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">
                  Discussion Topics
                </p>
                <ul className="mt-1 space-y-1">
                  {prep.topics.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">
                  Likely attendee questions
                </p>
                <ul className="mt-1 space-y-1">
                  {prep.questions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <details className="mt-3 rounded-xl border border-brand-gray200 bg-brand-gray100 p-3">
              <summary className="cursor-pointer text-sm font-extrabold text-brand-charcoal">
                View equipment checklist and training notes
              </summary>
              <div className="mt-3 grid gap-3 text-sm leading-6 text-brand-gray700 md:grid-cols-2">
                <div>
                  <p className="font-extrabold text-brand-charcoal">
                    Equipment checklist
                  </p>
                  <ul className="mt-1 space-y-1">
                    {prep.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-extrabold text-brand-charcoal">
                    Follow-up reminder
                  </p>
                  <p>{prep.followUp}</p>
                  <p className="mt-2 font-extrabold text-brand-charcoal">
                    Training notes
                  </p>
                  <p>{prep.notes}</p>
                </div>
              </div>
            </details>
          </div>
          <div className="mt-4 rounded-xl border border-brand-gray200 bg-white p-3">
            <StepLabel>Step 4: Automatic Product Safety Review</StepLabel>
            <div className="rounded-xl border border-brand-gray200 bg-brand-gray100 p-3">
              <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-brand-charcoal">
                Automatic Product Safety Review
              </p>
              <p className="mt-2 text-sm leading-6 text-brand-gray700">
                The app checks public CPSC recall data using installed equipment
                from the selected site profile. Possible matches need
                verification; the app does not decide whether a recall applies.
              </p>
              {autoReviewLoading ? (
                <p className="mt-3 text-sm font-extrabold text-brand-charcoal">
                  Checking installed equipment against public recall data...
                </p>
              ) : (
                <div className="mt-3 grid gap-3 text-sm leading-6 text-brand-gray700 md:grid-cols-2">
                  <div>
                    <p className="font-extrabold text-brand-charcoal">
                      Equipment checked
                    </p>
                    <ul className="mt-1 space-y-1">
                      {automaticSafetyReview.equipmentChecked.map((item) => (
                        <li key={`${item.category}-${item.productName}`}>
                          {equipmentLabel(item)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-extrabold text-brand-charcoal">
                      Search terms used
                    </p>
                    <p>
                      {automaticSafetyReview.searchTermsUsed.join(", ") ||
                        "No automatic search terms available."}
                    </p>
                  </div>
                  <div>
                    <p className="font-extrabold text-brand-charcoal">
                      Possible recall matches
                    </p>
                    {automaticSafetyReview.possibleMatches.length ? (
                      <ul className="mt-1 space-y-2">
                        {automaticSafetyReview.possibleMatches.slice(0, 4).map((match) => (
                          <li key={`${match.searchTerm}-${match.recall.id}`}>
                            Possible match for {match.equipmentLabel}:{" "}
                            <span className="font-semibold text-brand-charcoal">
                              {match.recall.title}
                            </span>
                            {match.recall.url ? (
                              <>
                                {" "}
                                <a
                                  href={match.recall.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="font-extrabold text-brand-green underline-offset-4 hover:underline"
                                >
                                  Official source
                                </a>
                              </>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No obvious recall match found in this search.</p>
                    )}
                  </div>
                  <div>
                    <p className="font-extrabold text-brand-charcoal">
                      Needs verification
                    </p>
                    <ul className="mt-1 space-y-1">
                      {automaticSafetyReview.needsVerification.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <details className="mt-4 rounded-xl border border-brand-gray200 bg-white p-3">
              <summary className="cursor-pointer text-sm font-extrabold text-brand-charcoal">
                Optional Manual Product Safety Search
              </summary>
              <p className="mt-2 text-sm leading-6 text-brand-gray700">
                Use this only to check an additional product, manufacturer,
                model, hazard, or keyword that is not already included in the
                selected site profile.
              </p>
              {resultCountLabel ? (
                <p className="mt-3 w-fit rounded-full bg-brand-gray100 px-3 py-1 text-sm font-bold text-brand-gray700">
                  {resultCountLabel}
                </p>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search product, manufacturer, model, keyword, hazard, remedy..."
                  className="min-h-12 rounded-xl border border-brand-gray200 bg-white px-4 text-base text-brand-charcoal shadow-sm placeholder:text-brand-gray500"
                />
                <button
                  type="submit"
                  disabled={searching || !query.trim()}
                  className="min-h-12 rounded-xl bg-brand-green px-6 font-extrabold text-white shadow-sm transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:bg-brand-gray500"
                >
                  {searching ? "Searching..." : "Search Recalls"}
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2">
                {quickSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => void searchRecalls(term)}
                    className="rounded-full border border-brand-gray200 bg-brand-gray100 px-3 py-2 text-sm font-bold text-brand-charcoal transition hover:border-brand-green hover:text-brand-green"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <div className="mt-5">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-green">
                Recall Results
              </p>
              <div className="space-y-3">
                {searching ? (
                  <div className="rounded-2xl border border-brand-gray200 bg-white p-6 shadow-panel">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-brand-gray100">
                      <div className="h-full w-2/5 animate-pulse rounded-full bg-brand-green" />
                    </div>
                    <p className="mt-4 font-extrabold text-brand-charcoal">
                      Searching public recall data...
                    </p>
                  </div>
                ) : null}

                {!searching && searchError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-brand-red">
                    {searchError}
                  </div>
                ) : null}

                {!searching && !hasSearched ? (
                  <div className="rounded-2xl border border-dashed border-brand-gray200 bg-white p-6 shadow-panel">
                    <p className="text-lg font-extrabold text-brand-charcoal">
                      Search to review optional public product safety information.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-brand-gray700">
                      Results will show recall title, manufacturer, date,
                      product, hazard, remedy, and official source link.
                    </p>
                  </div>
                ) : null}

                {!searching && hasSearched && !searchError && results.length === 0 ? (
                  <div className="rounded-2xl border border-brand-gray200 bg-white p-6 shadow-panel">
                    <p className="text-lg font-extrabold text-brand-charcoal">
                      No matching CPSC results for &quot;{query}&quot;.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-brand-gray700">
                      This means the public CPSC API did not return matches for
                      this exact term. It does not confirm that no recalls exist.
                      Try a broader product type, alternate spelling, parent
                      company, model number, or manufacturer name.
                    </p>
                  </div>
                ) : null}

                {!searching &&
                  results.map((recall) => {
                    const isSelected = selectedRecall?.id === recall.id;

                    return (
                      <article
                        key={recall.id}
                        className={`rounded-2xl border bg-white p-4 shadow-sm ${
                          isSelected ? "border-brand-green" : "border-brand-gray200"
                        }`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full bg-brand-green px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-white">
                                Product Safety
                              </span>
                              {recall.recallNumber ? (
                                <span className="rounded-full bg-brand-gray100 px-3 py-1 text-xs font-bold text-brand-gray700">
                                  Recall {recall.recallNumber}
                                </span>
                              ) : null}
                            </div>
                            <h3 className="mt-3 text-lg font-extrabold leading-7 text-brand-charcoal">
                              {recall.title}
                            </h3>
                            <p className="mt-1 text-sm font-semibold text-brand-gray700">
                              {recall.manufacturer} | {formatDate(recall.recallDate)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 text-sm leading-6 md:grid-cols-2">
                          <div>
                            <p className="font-extrabold text-brand-charcoal">Product</p>
                            <p className="mt-1 text-brand-gray700">
                              {recall.productDescription}
                            </p>
                          </div>
                          <div className="rounded-xl border-l-4 border-brand-red bg-red-50 p-3">
                            <p className="font-extrabold text-brand-charcoal">Hazard</p>
                            <p className="mt-1 text-brand-gray700">{recall.hazard}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="font-extrabold text-brand-charcoal">Remedy</p>
                            <p className="mt-1 text-brand-gray700">{recall.remedy}</p>
                          </div>
                        </div>

                        {recall.url ? (
                          <a
                            href={recall.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex text-sm font-extrabold text-brand-green underline-offset-4 hover:underline"
                          >
                            Official CPSC source
                          </a>
                        ) : null}
                        <div className="mt-4 border-t border-brand-gray200 pt-4">
                          {!isSelected ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRecall(recall);
                                setGuidance(null);
                                setSummaryError("");
                                setSummarySource("");
                              }}
                              className="w-full rounded-xl bg-brand-green px-4 py-3 text-left text-sm font-extrabold text-white transition hover:bg-brand-greenDark sm:w-auto"
                            >
                              Select recall
                            </button>
                          ) : (
                            <div className="rounded-xl border border-brand-green bg-brand-gray100 p-4">
                              <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-brand-green px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-white">
                                  Selected Recall
                                </span>
                                <span className="rounded-full border border-brand-warning px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-brand-warning">
                                  Optional Product Safety Context
                                </span>
                              </div>
                              <p className="mt-3 text-sm leading-6 text-brand-gray700">
                                This recall will be included as Product Safety /
                                Recall Context in the AI Engagement Readiness
                                Packet. Adjust audience, site, service lens, prep
                                resources, or manual notes as needed before
                                generating.
                              </p>
                              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                <button
                                  type="button"
                                  onClick={() => void generateSummary(recall, briefAction)}
                                  disabled={Boolean(summarizingId)}
                                  className="rounded-xl bg-brand-green px-3 py-2 text-sm font-extrabold text-white transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:bg-brand-gray500"
                                >
                                  Generate AI Engagement Readiness Packet
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedRecall(null);
                                    setGuidance(null);
                                    setSummaryError("");
                                    setSummarySource("");
                                  }}
                                  className="rounded-xl border border-brand-gray200 bg-white px-3 py-2 text-sm font-extrabold text-brand-charcoal transition hover:bg-brand-gray100"
                                >
                                  Clear selected recall
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
              </div>
              </div>
            </details>
          </div>
          <label className="mt-4 block text-sm font-bold text-brand-charcoal">
            Step 5: Optional Manual / Site / Training Notes
            <span className="mt-1 block font-extrabold text-brand-charcoal">
              Additional Manual / Site Notes
            </span>
            <textarea
              value={additionalNotes}
              onChange={(event) => {
                setAdditionalNotes(event.target.value);
                setGuidance(null);
              }}
              placeholder="Paste manual excerpts, service notes, site-specific equipment details, customer training history, or internal prep notes here."
              className="mt-2 min-h-28 w-full rounded-xl border border-brand-gray200 bg-white px-3 py-3 text-sm leading-6 text-brand-charcoal shadow-sm placeholder:text-brand-gray500"
            />
          </label>
          <div className="mt-4">
            <StepLabel>Step 6: Generate</StepLabel>
            <button
              type="button"
              onClick={() => void generateSummary(selectedRecall, briefAction)}
              disabled={Boolean(summarizingId)}
              className="w-full rounded-xl bg-brand-green px-4 py-3 text-left text-sm font-extrabold text-white transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:bg-brand-gray500 sm:w-auto"
            >
              {summarizingId
                ? "Generating AI Engagement Readiness Packet..."
                : "Generate AI Engagement Readiness Packet"}
            </button>
          </div>
          {summarizingId === "engagement-packet" ? (
            <div className="mt-4 rounded-xl border border-brand-gray200 bg-white p-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-brand-gray100">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-green" />
              </div>
              <p className="mt-3 text-sm font-extrabold text-brand-charcoal">
                Generating AI Engagement Readiness Packet...
              </p>
            </div>
          ) : null}
          {summaryError && !selectedRecall ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-brand-red">
              {summaryError}
            </div>
          ) : null}
        </section>
        <div className="mt-5">
          <ReadinessPacket
            guidance={guidance}
            selectedRecall={selectedRecall}
            engagementType={engagementType}
            audience={audience}
            sampleSite={selectedSampleSite}
            serviceLens={selectedServiceLens}
            summarySource={summarySource}
            briefAction={briefAction}
            automaticSafetyReview={automaticSafetyReview}
          />
        </div>

        <details className="mt-5 rounded-2xl border border-brand-gray200 bg-white p-4 text-sm leading-6 text-brand-gray700 shadow-panel">
          <summary className="cursor-pointer font-extrabold text-brand-charcoal">
            How it works
          </summary>
          <ol className="mt-3 space-y-1">
            <li>1. Choose the engagement.</li>
            <li>2. Choose audience, site, and service context.</li>
            <li>3. Review the auto-filled prep resources.</li>
            <li>4. Add product safety or recall context only if relevant.</li>
            <li>5. Add manual, site, or training notes if helpful.</li>
            <li>6. Generate an AI Engagement Readiness Packet.</li>
          </ol>
        </details>

        <section className="mt-5 rounded-2xl border-l-4 border-brand-warning bg-[#fff8e8] p-4 text-sm leading-6 text-brand-gray700 shadow-sm sm:p-5">
          <strong className="text-brand-charcoal">Responsible AI:</strong>{" "}
          AI-generated guidance should be reviewed against official CPSC
          notices, manufacturer instructions, applicable codes, NFPA standards,
          and company procedures before action is taken.
        </section>

      </div>

      <footer className="mt-2 bg-brand-green px-5 py-5 text-center text-xs leading-6 text-white">
        Concept prototype for demonstration purposes.
      </footer>
    </main>
  );
}

