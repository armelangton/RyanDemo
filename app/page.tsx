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
  | "Inspect / service"
  | "Teach / train"
  | "Meet / discuss"
  | "Present / attend event"
  | "Follow up / document";

type Audience =
  | "Facility Manager"
  | "Fire Department"
  | "Municipality"
  | "Building Owner"
  | "Internal Inspector"
  | "Instructor / Trainer"
  | "Recruit Class"
  | "Safety Coordinator"
  | "Convention Attendee"
  | "Internal Sales / Marketing Team"
  | "Prospective Customer";

type UserRole = "Inspector" | "Instructor";

type RoleEngagement =
  | "Inspection / Service Visit"
  | "Site Walkthrough"
  | "Documentation Review"
  | "Training Session"
  | "Fire Department Recruit Training"
  | "Customer Education Session";

type Topic =
  | "Sprinkler Systems"
  | "Fire Alarm / Detection"
  | "Extinguishers"
  | "Emergency Lighting"
  | "Hydrants"
  | "Special Hazards"
  | "Tool Safety"
  | "NFPA 13 Basics";

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
  id: string;
  name: string;
  profileType: string;
  locationType: string;
  shortSummary: string;
  knownSystems: string[];
  upcomingReminder: string;
  trainingEducationNeed: string;
  documentationDeficiencyContext: string;
  relatedServiceConsiderations: string[];
  serviceHistoryNotes: string;
  recommendedPrepFocus: string;
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
  "Inspect / service",
  "Teach / train",
  "Meet / discuss",
  "Present / attend event",
  "Follow up / document",
];

const audiences: Audience[] = [
  "Facility Manager",
  "Fire Department",
  "Municipality",
  "Building Owner",
  "Internal Inspector",
  "Instructor / Trainer",
  "Recruit Class",
  "Safety Coordinator",
  "Convention Attendee",
  "Internal Sales / Marketing Team",
  "Prospective Customer",
];

const serviceLenses = knowledgeBase.serviceLenses as ServiceLens[];

const visibleSiteOptions = [
  { label: "Municipal Facilities Account", value: "Municipal Facilities Account" },
  {
    label: "Fire Department Recruit Training Site",
    value: "Fire Department Recruit Training Site",
  },
  { label: "Healthcare Facility ITM Review", value: "Healthcare Facility ITM Review" },
  {
    label: "Education Campus Training Profile",
    value: "Education Campus Facilities Training",
  },
];

const roleEngagementOptions: Record<UserRole, RoleEngagement[]> = {
  Inspector: [
    "Inspection / Service Visit",
    "Site Walkthrough",
    "Documentation Review",
  ],
  Instructor: [
    "Training Session",
    "Fire Department Recruit Training",
    "Customer Education Session",
  ],
};

const inspectorDefaultTopics: Topic[] = [
  "Sprinkler Systems",
  "Extinguishers",
  "Emergency Lighting",
];

const instructorDefaultTopics: Topic[] = ["NFPA 13 Basics", "Tool Safety"];

const topicOptions: Topic[] = [
  "Sprinkler Systems",
  "Fire Alarm / Detection",
  "Extinguishers",
  "Emergency Lighting",
  "Hydrants",
  "Special Hazards",
  "Tool Safety",
  "NFPA 13 Basics",
];

const sampleSiteDetails: Record<string, SiteProfile> = {
  "Municipal Facilities Account": {
    id: "municipal-facilities",
    name: "Municipal Facilities Account",
    profileType: "Sample profile",
    locationType: "Municipal public buildings",
    shortSummary:
      "Multiple public buildings with extinguishers, smoke alarms/detection devices, emergency lighting, sprinklers, hydrants, and upcoming annual inspection needs.",
    label: "Municipal Facilities Account",
    type: "Municipality",
    primaryAudience: "Municipality / facilities leadership",
    knownSystems: [
      "Fire extinguishers",
      "Fire alarm and detection",
      "Emergency lighting / exit signs",
      "Sprinkler system",
      "Hydrants near public buildings",
    ],
    systems: [
      "Fire extinguishers",
      "Fire alarm and detection",
      "Emergency lighting / exit signs",
      "Sprinkler system",
      "Hydrants near public buildings",
    ],
    installedEquipment: [
      {
        category: "fire extinguisher",
        productName: "ABC dry chemical fire extinguishers",
        manufacturer: "Kidde",
        model: "Demo model unknown",
        locationContext: "Public corridors and mechanical areas",
        serviceStatus: "Annual inspection cycle due in 28 days",
        documentationNote:
          "Verify extinguisher inspection status, tag dates, and prior training records",
        trainingRelevance:
          "Facilities team may need refresher on monthly visual checks and when to contact service support",
      },
      {
        category: "smoke alarm",
        productName: "Smoke alarms / detection devices",
        manufacturer: "First Alert",
        model: "Demo model unknown",
        locationContext: "Administrative areas and public spaces",
        serviceStatus: "Alarm testing records should be reviewed",
        documentationNote:
          "Confirm exact model numbers, test history, and nuisance alarm notes",
        trainingRelevance:
          "Good topic for customer-friendly explanation of detection device maintenance and replacement timing",
      },
      {
        category: "emergency lighting",
        productName: "Emergency lighting and exit signs",
        manufacturer: "Lithonia Lighting",
        model: "Demo model unknown",
        locationContext: "Hallways, exits, and stairwells",
        serviceStatus: "Documentation review needed",
        documentationNote:
          "Confirm test records, battery backup condition, and deficiency status",
        trainingRelevance:
          "Explain monthly/annual testing expectations in plain language",
      },
      {
        category: "sprinkler",
        productName: "Wet sprinkler system",
        manufacturer: "Victaulic",
        model: "Demo model unknown",
        locationContext: "Municipal office and storage areas",
        serviceStatus: "Annual inspection due this quarter",
        documentationNote:
          "Verify inspection report, open deficiencies, and valve access notes",
        trainingRelevance:
          "Explain what the facility team should visually monitor between inspections",
      },
      {
        category: "hydrant",
        productName: "Exterior hydrants near public buildings",
        manufacturer: "Mueller",
        model: "Demo model unknown",
        locationContext: "Exterior public access areas",
        serviceStatus: "Flow/testing history should be reviewed",
        documentationNote: "Confirm last flow test and access/obstruction notes",
        trainingRelevance: "Useful for municipality/public safety discussion",
      },
    ],
    upcomingReminder: "Annual inspection cycle due in 28 days.",
    reminder: "Annual inspection cycle due in 28 days.",
    trainingEducationNeed:
      "Facilities team refresher on monthly visual checks, documentation expectations, and when to contact service support.",
    trainingNeed:
      "Facilities team refresher on monthly visual checks, documentation expectations, and when to contact service support.",
    documentationDeficiencyContext:
      "Inspection reports, emergency lighting test documentation, extinguisher inspection status, alarm testing records, open deficiency notes.",
    documentationNeed:
      "Inspection reports, emergency lighting test documentation, extinguisher inspection status, alarm testing records, open deficiency notes.",
    relatedServiceConsiderations: [
      "Documentation review",
      "Emergency lighting testing",
      "Fire extinguisher training",
      "Alarm testing records",
      "Hydrant testing",
      "Sprinkler inspection follow-up",
    ],
    relatedServiceLenses: [
      "Inspection, Testing & Maintenance",
      "Documentation / Deficiency Follow-Up",
      "Fire Extinguishers",
      "Fire Alarm & Detection",
      "Fire Hydrants",
    ],
    relatedService:
      "Documentation review; emergency lighting testing; fire extinguisher training; alarm testing records; hydrant testing; sprinkler inspection follow-up",
    serviceHistoryNotes:
      "Recent service notes mention recurring questions about extinguisher tag dates, emergency lighting documentation, and alarm testing records.",
    recommendedPrepFocus:
      "Prepare customer-friendly explanations, confirm equipment inventory, review prior deficiencies, and verify model numbers before discussing recall applicability.",
  },
  "Fire Department Recruit Training Site": {
    id: "fire-department-recruit-training",
    name: "Fire Department Recruit Training Site",
    profileType: "Sample profile",
    locationType: "Fire department training facility",
    shortSummary:
      "Recruit training context with sprinkler, fire pump, alarm/detection, hydrant, and extinguisher examples for response-awareness instruction.",
    label: "Fire Department Recruit Training Site",
    type: "Fire Department / recruit training",
    primaryAudience: "Fire Department",
    knownSystems: [
      "Sprinkler system demonstration",
      "Fire pump overview",
      "Hydrant flow discussion",
      "Alarm response awareness",
      "Extinguisher examples",
    ],
    systems: [
      "Sprinkler system demonstration",
      "Fire pump overview",
      "Hydrant flow discussion",
      "Alarm response awareness",
      "Extinguisher examples",
    ],
    installedEquipment: [
      {
        category: "sprinkler",
        productName: "Sprinkler demonstration components",
        manufacturer: "Viking",
        model: "Demo model unknown",
        locationContext: "Recruit training demonstration materials",
        serviceStatus: "Training session next month",
        documentationNote: "Confirm demo component source and instructor notes.",
        trainingRelevance: "Supports system behavior and response-awareness discussion.",
      },
      {
        category: "fire pump",
        productName: "Fire pump overview equipment",
        manufacturer: "Aurora",
        model: "Demo model unknown",
        locationContext: "Recruit training discussion",
        serviceStatus: "Training prep",
        documentationNote: "Verify manufacturer manuals or approved diagrams before teaching.",
        trainingRelevance: "Helps recruits understand system behavior during response.",
      },
      {
        category: "alarm panel",
        productName: "Fire alarm panel / detection examples",
        manufacturer: "Honeywell",
        model: "Demo model unknown",
        locationContext: "Alarm response awareness segment",
        serviceStatus: "Training prep",
        documentationNote: "Use approved photos or diagrams.",
        trainingRelevance: "Supports what crews should recognize, avoid, report, or escalate.",
      },
      {
        category: "hydrant",
        productName: "Training hydrant / flow discussion example",
        manufacturer: "Mueller",
        model: "Demo model unknown",
        locationContext: "Outdoor recruit training discussion",
        serviceStatus: "Instructor prep",
        documentationNote: "Verify flow-testing examples and public safety talking points.",
        trainingRelevance: "Supports firefighter response awareness and reporting expectations.",
      },
      {
        category: "fire extinguisher",
        productName: "Training fire extinguishers",
        manufacturer: "Amerex",
        model: "Demo model unknown",
        locationContext: "Hands-on training examples",
        serviceStatus: "Check training materials before session",
        documentationNote: "Confirm training units are appropriate for demonstration.",
        trainingRelevance: "Supports practical recruit questions and safety reminders.",
      },
    ],
    upcomingReminder: "Recruit training session next month.",
    reminder: "Recruit training session next month",
    trainingEducationNeed:
      "Explain how fire protection systems behave during response and what crews should recognize, avoid, report, or escalate.",
    trainingNeed:
      "Explain how fire protection systems behave during response and what crews should recognize, avoid, report, or escalate",
    documentationDeficiencyContext:
      "Instructor outline, system diagram, photos of common components, likely recruit questions, official source reminders.",
    documentationNeed:
      "Instructor outline, system diagram, photos of common components, likely recruit questions, official source reminders",
    relatedServiceConsiderations: [
      "Hydrant inspection / flow testing conversation",
      "Sprinkler system education",
      "Alarm response awareness",
      "Customer training follow-up",
    ],
    relatedServiceLenses: [
      "Customer Training",
      "Fire Sprinklers",
      "Fire Hydrants",
      "Fire Alarm & Detection",
    ],
    relatedService:
      "Hydrant inspection / flow testing conversation; sprinkler system education; alarm response awareness; additional customer training opportunities",
    serviceHistoryNotes:
      "Instructor notes include recurring recruit questions about alarm panels, sprinkler activation, pump operation, and what responders should report after an incident.",
    recommendedPrepFocus:
      "Prepare response-awareness talking points, approved component photos, recruit questions, and reminders about source verification.",
  },
  "Healthcare Facility ITM Review": {
    id: "healthcare-itm-review",
    name: "Healthcare Facility ITM Review",
    profileType: "Sample profile",
    locationType: "Healthcare facility",
    shortSummary:
      "Healthcare facility review with alarm/detection, sprinklers, emergency lighting, extinguishers, and documentation-heavy inspection needs.",
    label: "Healthcare Facility ITM Review",
    type: "Healthcare facility",
    primaryAudience: "Facility Manager / Building Owner",
    knownSystems: [
      "Fire alarm and detection",
      "Sprinkler system",
      "Emergency lighting",
      "Fire extinguishers",
      "Special hazard areas where applicable",
    ],
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
        manufacturer: "Siemens",
        model: "Demo model unknown",
        locationContext: "Healthcare facility life-safety system",
        serviceStatus: "Semiannual service review and documentation check",
        documentationNote: "Review alarm test records and service history.",
        trainingRelevance: "Facilities refresher on documentation and escalation.",
      },
      {
        category: "sprinkler",
        productName: "Sprinkler system",
        manufacturer: "Victaulic",
        model: "Demo model unknown",
        locationContext: "Healthcare facility",
        serviceStatus: "Semiannual ITM review",
        documentationNote: "Review inspection notes and deficiency list.",
        trainingRelevance: "Supports facility manager discussion on readiness and records.",
      },
      {
        category: "emergency light",
        productName: "Emergency lighting / exit signs",
        manufacturer: "Lithonia Lighting",
        model: "Demo model unknown",
        locationContext: "Egress paths and patient/public areas",
        serviceStatus: "Documentation check",
        documentationNote: "Confirm emergency lighting test records.",
        trainingRelevance: "Useful for facilities team documentation refresher.",
      },
      {
        category: "fire extinguisher",
        productName: "Healthcare facility fire extinguishers",
        manufacturer: "Amerex",
        model: "Demo model unknown",
        locationContext: "Clinical support, mechanical, and public areas",
        serviceStatus: "Inspection records should be reviewed",
        documentationNote: "Confirm tag dates, placement list, and service history.",
        trainingRelevance: "Supports staff awareness around inspection status and escalation.",
      },
    ],
    upcomingReminder: "Semiannual service review and documentation check.",
    reminder: "Semiannual service review and documentation check",
    trainingEducationNeed:
      "Facilities team refresher on inspection records, deficiencies, and escalation steps.",
    trainingNeed:
      "Facilities team refresher on inspection records, deficiencies, and escalation steps",
    documentationDeficiencyContext:
      "Inspection reports, service history, open deficiency list, emergency lighting and alarm test records, manufacturer documentation for any affected product.",
    documentationNeed:
      "Inspection reports, service history, open deficiency list, emergency lighting and alarm test records, manufacturer documentation for any affected product",
    relatedServiceConsiderations: [
      "Documentation review",
      "Emergency lighting inspection",
      "Alarm testing review",
      "Preventive maintenance",
      "Deficiency follow-up",
    ],
    relatedServiceLenses: [
      "Inspection, Testing & Maintenance",
      "Fire Alarm & Detection",
      "Fire Sprinklers",
      "Documentation / Deficiency Follow-Up",
    ],
    relatedService:
      "Documentation review; emergency lighting inspection; alarm testing review; preventive maintenance; deficiency follow-up",
    serviceHistoryNotes:
      "Service history notes emphasize documentation completeness, deficiency follow-up, and clear escalation paths for facility leadership.",
    recommendedPrepFocus:
      "Review inspection/testing records, prepare deficiency follow-up questions, and verify exact equipment before discussing product safety findings.",
  },
  "Industrial Special Hazards Site": {
    id: "industrial-special-hazards",
    name: "Industrial Special Hazards Site",
    profileType: "Sample profile",
    locationType: "Industrial facility",
    shortSummary:
      "Industrial site with special hazard suppression, extinguishers, alarm/detection, emergency lighting, and higher need for manufacturer/manual verification.",
    label: "Industrial Special Hazards Site",
    type: "Industrial / special hazards",
    primaryAudience: "Facility Manager / Internal Inspector",
    knownSystems: [
      "Special hazard suppression system",
      "Fire extinguishers",
      "Fire alarm and detection",
      "Emergency lighting",
      "Emergency response equipment",
    ],
    systems: [
      "Special hazard suppression system",
      "Fire extinguishers",
      "Fire alarm and detection",
      "Emergency lighting",
      "Emergency response equipment",
    ],
    installedEquipment: [
      {
        category: "special hazard",
        productName: "Special hazard suppression system",
        manufacturer: "Ansul",
        model: "Demo model unknown",
        locationContext: "Industrial special hazard area",
        serviceStatus: "System review due this quarter",
        documentationNote: "Verify manufacturer manuals, service records, and qualified review needs.",
        trainingRelevance: "Internal prep for system-specific customer communication.",
      },
      {
        category: "fire extinguisher",
        productName: "Industrial fire extinguishers",
        manufacturer: "Amerex",
        model: "Demo model unknown",
        locationContext: "Industrial production or hazard areas",
        serviceStatus: "Preventive maintenance review",
        documentationNote: "Confirm inspection tags, locations, and service history.",
        trainingRelevance: "Supports customer education around readiness and escalation.",
      },
      {
        category: "fire alarm",
        productName: "Industrial alarm / detection system",
        manufacturer: "Honeywell",
        model: "Demo model unknown",
        locationContext: "Industrial production and special hazard areas",
        serviceStatus: "Testing records should be reviewed",
        documentationNote: "Confirm panel model, detector types, and service history.",
        trainingRelevance: "Supports customer communication about alarm response and reporting.",
      },
      {
        category: "emergency lighting",
        productName: "Emergency lighting and exit signs",
        manufacturer: "Lithonia Lighting",
        model: "Demo model unknown",
        locationContext: "Production exits and egress routes",
        serviceStatus: "Preventive maintenance review",
        documentationNote: "Confirm battery test records and open deficiencies.",
        trainingRelevance: "Supports risk-reduction discussion for egress readiness.",
      },
    ],
    upcomingReminder: "Special hazards system review due this quarter.",
    reminder: "Special hazards system review due this quarter",
    trainingEducationNeed:
      "Internal prep around system-specific documentation, qualified review, and customer communication.",
    trainingNeed:
      "Internal prep around system-specific documentation, qualified review, and customer communication",
    documentationDeficiencyContext:
      "Manufacturer manuals, inspection/testing records, service history, deficiency photos/notes, exact product/model details.",
    documentationNeed:
      "Manufacturer manuals, inspection/testing records, service history, deficiency photos/notes, exact product/model details",
    relatedServiceConsiderations: [
      "Special hazard system review",
      "Clean foam testing discussion if applicable",
      "Documentation review",
      "Emergency service readiness",
      "Preventive maintenance",
    ],
    relatedServiceLenses: [
      "Special Hazards",
      "Clean Foam Testing",
      "Emergency Service",
      "Documentation / Deficiency Follow-Up",
    ],
    relatedService:
      "Special hazard system review; clean foam testing discussion if applicable; documentation review; emergency service readiness; preventive maintenance",
    serviceHistoryNotes:
      "Service notes mention system-specific documentation questions and the need to route technical determinations through qualified internal review.",
    recommendedPrepFocus:
      "Prepare source hierarchy reminders, confirm manuals/service history, and flag exact model verification before any customer-facing discussion.",
  },
  "Education Campus Facilities Training": {
    id: "education-campus-training",
    name: "Education Campus Facilities Training",
    profileType: "Sample profile",
    locationType: "Education campus",
    shortSummary:
      "Campus facilities training context with extinguishers, alarm panels, sprinklers, emergency lighting, and exit signs before a semester readiness cycle.",
    label: "Education Campus Facilities Training",
    type: "Education / campus facilities",
    primaryAudience: "Facility Manager / Instructor or Trainer",
    knownSystems: [
      "Fire extinguishers",
      "Alarm panels",
      "Sprinkler systems",
      "Emergency lighting",
      "Exit signs",
    ],
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
        model: "Demo model unknown",
        locationContext: "Campus facilities and common areas",
        serviceStatus: "Facilities refresher before semester start",
        documentationNote: "Verify tags, placement, and service calendar.",
        trainingRelevance: "Supports monthly visual check and extinguisher awareness training.",
      },
      {
        category: "alarm panel",
        productName: "Alarm panels",
        manufacturer: "Siemens",
        model: "Demo model unknown",
        locationContext: "Campus buildings",
        serviceStatus: "Service calendar review",
        documentationNote: "Confirm alarm testing records and contacts.",
        trainingRelevance: "Useful for facilities escalation steps.",
      },
      {
        category: "exit sign",
        productName: "Exit signs and emergency lighting",
        manufacturer: "Lithonia Lighting",
        model: "Demo model unknown",
        locationContext: "Egress routes",
        serviceStatus: "Pre-semester readiness review",
        documentationNote: "Confirm inspection and testing documentation.",
        trainingRelevance: "Supports visual check training.",
      },
      {
        category: "sprinkler",
        productName: "Campus sprinkler systems",
        manufacturer: "Viking",
        model: "Demo model unknown",
        locationContext: "Classroom and common-area buildings",
        serviceStatus: "Service calendar review",
        documentationNote: "Confirm inspection reports, valve access notes, and deficiencies.",
        trainingRelevance: "Supports facilities discussion about visual checks and escalation.",
      },
    ],
    upcomingReminder: "Facilities refresher before semester start.",
    reminder: "Facilities refresher before semester start",
    trainingEducationNeed:
      "Prepare facilities team for visual checks, documentation, and escalation steps.",
    trainingNeed:
      "Prepare facilities team for visual checks, documentation, and escalation steps",
    documentationDeficiencyContext:
      "Training outline, equipment checklist, service calendar, monthly visual check guidance, follow-up note template.",
    documentationNeed:
      "Training outline, equipment checklist, service calendar, monthly visual check guidance, follow-up note template",
    relatedServiceConsiderations: [
      "Extinguisher training",
      "Emergency lighting inspection",
      "Alarm testing review",
      "Sprinkler inspection",
      "Recurring reminders",
    ],
    relatedServiceLenses: [
      "Customer Training",
      "Fire Extinguishers",
      "Fire Alarm & Detection",
      "Fire Sprinklers",
      "Inspection, Testing & Maintenance",
    ],
    relatedService:
      "Extinguisher training; emergency lighting inspection; alarm testing review; sprinkler inspection; recurring reminders",
    serviceHistoryNotes:
      "Campus team has recurring questions about pre-semester readiness, emergency lighting documentation, and who should receive follow-up reminders.",
    recommendedPrepFocus:
      "Prepare plain-language training points, equipment checklist, service calendar reminders, and model verification notes.",
  },
  "Distribution Warehouse Inspection Prep": {
    id: "distribution-warehouse",
    name: "Distribution Warehouse Inspection Prep",
    profileType: "Sample profile",
    locationType: "Distribution warehouse",
    shortSummary:
      "Warehouse inspection prep with extinguishers, sprinklers, alarm/detection, emergency lighting, and possible special hazard areas.",
    label: "Distribution Warehouse Inspection Prep",
    type: "Commercial / distribution warehouse",
    primaryAudience: "Facility Manager / Building Owner",
    knownSystems: [
      "Fire extinguishers",
      "Sprinkler system",
      "Fire alarm and detection",
      "Emergency lighting",
      "Possible special hazard areas",
    ],
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
        model: "Demo model unknown",
        locationContext: "Warehouse floor and loading areas",
        serviceStatus: "Annual inspection and extinguisher training review",
        documentationNote: "Verify tags, location list, and training records.",
        trainingRelevance: "Warehouse team refresher on extinguisher use and reporting issues.",
      },
      {
        category: "sprinkler",
        productName: "Warehouse sprinkler system",
        manufacturer: "Victaulic",
        model: "Demo model unknown",
        locationContext: "Warehouse storage areas",
        serviceStatus: "Annual inspection prep",
        documentationNote: "Review inspection notes and open deficiencies.",
        trainingRelevance: "Supports facility manager discussion on storage and readiness.",
      },
      {
        category: "emergency light",
        productName: "Emergency lighting",
        manufacturer: "Lithonia Lighting",
        model: "Demo model unknown",
        locationContext: "Warehouse egress paths",
        serviceStatus: "Annual inspection prep",
        documentationNote: "Confirm emergency lighting test documentation.",
        trainingRelevance: "Supports evacuation basics and maintenance awareness.",
      },
      {
        category: "fire alarm",
        productName: "Warehouse fire alarm / detection system",
        manufacturer: "Honeywell",
        model: "Demo model unknown",
        locationContext: "Warehouse, loading dock, and office areas",
        serviceStatus: "Alarm testing records should be reviewed",
        documentationNote: "Confirm panel model, test history, and open issues.",
        trainingRelevance: "Supports customer discussion around reporting issues and evacuation basics.",
      },
    ],
    upcomingReminder: "Annual inspection and extinguisher training review.",
    reminder: "Annual inspection and extinguisher training review",
    trainingEducationNeed:
      "Warehouse team refresher on extinguisher use, evacuation basics, and when to report issues.",
    trainingNeed:
      "Warehouse team refresher on extinguisher use, evacuation basics, and when to report issues",
    documentationDeficiencyContext:
      "Extinguisher inspection records, alarm testing records, sprinkler inspection notes, emergency lighting test documentation, open deficiencies.",
    documentationNeed:
      "Extinguisher inspection records, alarm testing records, sprinkler inspection notes, emergency lighting test documentation, open deficiencies",
    relatedServiceConsiderations: [
      "Extinguisher training",
      "Emergency lighting inspection",
      "Alarm testing review",
      "Sprinkler inspection",
      "Preventive maintenance",
    ],
    relatedServiceLenses: [
      "Inspection, Testing & Maintenance",
      "Customer Training",
      "Fire Extinguishers",
      "Fire Sprinklers",
      "Fire Alarm & Detection",
    ],
    relatedService:
      "Extinguisher training; emergency lighting inspection; alarm testing review; sprinkler inspection; preventive maintenance",
    serviceHistoryNotes:
      "Recent warehouse prep notes mention extinguisher placement questions, emergency lighting documentation, and open sprinkler inspection items.",
    recommendedPrepFocus:
      "Review inspection records, prepare equipment-specific verification list, and identify customer-friendly follow-up points.",
  },
  "Convention / Trade Show Demo Booth": {
    id: "convention-demo-booth",
    name: "Convention / Trade Show Demo Booth",
    profileType: "Sample profile",
    locationType: "Convention or trade show booth",
    shortSummary:
      "Event booth context with demonstration equipment, customer education materials, and common questions about inspections, training, and product safety.",
    label: "Convention / Trade Show Demo Booth",
    type: "Convention / trade show",
    primaryAudience: "Building Owner / Facility Manager",
    knownSystems: [
      "Fire extinguishers",
      "Smoke alarm / detection examples",
      "Emergency lighting examples",
      "Sprinkler component examples",
      "Special hazard discussion materials",
    ],
    systems: [
      "Fire extinguishers",
      "Smoke alarm / detection examples",
      "Emergency lighting examples",
      "Sprinkler component examples",
      "Special hazard discussion materials",
    ],
    installedEquipment: [
      {
        category: "fire extinguisher",
        productName: "Portable extinguisher examples",
        manufacturer: "Amerex",
        model: "Demo model unknown",
        locationContext: "Trade show demonstration materials",
        serviceStatus: "Review booth materials before event",
        documentationNote: "Confirm demonstration materials are approved and current.",
        trainingRelevance: "Supports plain-language extinguisher readiness discussion.",
      },
      {
        category: "smoke alarm",
        productName: "Smoke alarm / detection examples",
        manufacturer: "First Alert",
        model: "Demo model unknown",
        locationContext: "Product safety talking point examples",
        serviceStatus: "Review product safety examples before event",
        documentationNote: "Verify any recall examples against official CPSC notices.",
        trainingRelevance: "Supports customer education and common detection questions.",
      },
      {
        category: "emergency lighting",
        productName: "Emergency lighting / exit sign examples",
        manufacturer: "Lithonia Lighting",
        model: "Demo model unknown",
        locationContext: "Booth discussion examples",
        serviceStatus: "Prepare documentation talking points",
        documentationNote: "Confirm monthly/annual testing talking points.",
        trainingRelevance: "Supports customer-friendly explanation of inspection expectations.",
      },
      {
        category: "special hazard",
        productName: "Special hazard system discussion materials",
        manufacturer: "Ansul",
        model: "Demo model unknown",
        locationContext: "Higher-risk system conversation examples",
        serviceStatus: "Route technical questions to qualified review",
        documentationNote: "Confirm approved literature and source hierarchy reminders.",
        trainingRelevance: "Supports responsible event conversation boundaries.",
      },
    ],
    upcomingReminder: "Event booth prep review this week.",
    reminder: "Event booth prep review this week.",
    trainingEducationNeed:
      "Prepare concise explanations, likely attendee questions, and safe follow-up routing for technical product questions.",
    trainingNeed:
      "Prepare concise explanations, likely attendee questions, and safe follow-up routing for technical product questions.",
    documentationDeficiencyContext:
      "Approved service literature, product safety talking points, attendee follow-up note template, and source verification reminders.",
    documentationNeed:
      "Approved service literature, product safety talking points, attendee follow-up note template, and source verification reminders.",
    relatedServiceConsiderations: [
      "Customer education",
      "Inspection planning",
      "Documentation review",
      "Training follow-up",
      "Modernization discussion when safety-related",
    ],
    relatedServiceLenses: [
      "Customer Training",
      "Fire Extinguishers",
      "Fire Alarm & Detection",
      "Special Hazards",
      "Documentation / Deficiency Follow-Up",
    ],
    relatedService:
      "Customer education; inspection planning; documentation review; training follow-up; modernization discussion when safety-related",
    serviceHistoryNotes:
      "Event notes should capture attendee questions, product safety concerns, and follow-up owners for internal routing.",
    recommendedPrepFocus:
      "Prepare short customer-friendly explanations, source verification reminders, and follow-up routing for technical questions.",
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
  "Inspect / service": {
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
  "Teach / train": {
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
    notes:
      "Use this for customer training, recruit training, continuing education, certificates, attendance, training topics, and likely questions.",
  },
  "Meet / discuss": {
    materials: ["Account notes", "Open service items", "Product safety examples to verify"],
    checklist: [
      "Confirm meeting goal and audience",
      "Review known equipment and recent work",
      "Prepare safety-focused talking points",
    ],
    questions: [
      "What customer concerns or questions should be addressed?",
      "Which follow-up items need an owner?",
    ],
    topics: ["Customer concerns", "Related service considerations", "Follow-up capture"],
    followUp: "Capture customer questions, product safety examples to verify, and related service follow-up.",
    notes:
      "Use this for customer meetings, facility manager conversations, municipality discussions, and customer-facing talking points.",
  },
  "Present / attend event": {
    materials: ["Public safety talking points", "Inspection schedule notes", "Approved service literature"],
    checklist: [
      "Confirm event objective, booth, or presentation plan",
      "Prepare concise customer-friendly explanations",
      "Confirm follow-up capture plan",
    ],
    questions: [
      "What are attendees likely to ask?",
      "Which product safety examples need verification before use?",
    ],
    topics: ["Event talking points", "Demo equipment", "Lead or follow-up capture"],
    followUp: "Capture attendee questions, related service interest, and verification items.",
    notes:
      "Use this for conventions, trade shows, public safety events, presentations, and outreach conversations.",
  },
  "Follow up / document": {
    materials: ["Account notes", "Open service items", "Training records or handouts"],
    checklist: [
      "Review open deficiencies and documentation gaps",
      "Confirm training completion or attendance records",
      "Identify next actions and internal owners",
    ],
    questions: [
      "What needs customer follow-up?",
      "What records, certificates, handouts, or notes are missing?",
    ],
    topics: ["Open deficiencies", "Documentation gaps", "Next steps"],
    followUp: "Send action items to the account or service owner before customer outreach.",
    notes:
      "Use this for post-inspection follow-up, open deficiencies, training records, notes, handouts, certificates, and next steps.",
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
    .filter(
      (part) =>
        part &&
        !part.toLowerCase().includes("to verify") &&
        !part.toLowerCase().includes("demo model unknown"),
    )
    .join(" ") || item.category;

const searchTermsForEquipment = (equipment: InstalledEquipment[]) =>
  Array.from(
    new Set(
      equipment.flatMap((item) => {
        const terms = [
          `${item.manufacturer} ${item.productName}`,
          `${item.manufacturer} ${item.category}`,
          item.model &&
          !item.model.toLowerCase().includes("to verify") &&
          !item.model.toLowerCase().includes("demo model unknown")
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

const SectionBand = ({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon: "building" | "tool" | "shield" | "clipboard" | "file" | "alert" | "check";
}) => {
  const paths = {
    building: "M4 20h16M6 20V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15M9 8h1M9 12h1M12 8h1M12 12h1M17 20v-7h2v7",
    tool: "M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.8 2.8-3-3 2.8-2.8Z",
    shield: "M12 3 5 6v5c0 4.5 3 7.5 7 10 4-2.5 7-5.5 7-10V6l-7-3Z",
    clipboard: "M9 4h6l1 2h2v14H6V6h2l1-2Zm0 6h6M9 14h6",
    file: "M6 3h8l4 4v14H6V3Zm8 0v5h4M9 13h6M9 17h6",
    alert: "M12 4 3 20h18L12 4Zm0 5v5m0 3h.01",
    check: "M20 6 9 17l-5-5",
  }[icon];

  return (
    <div className="mb-4 rounded-2xl border border-brand-gray200 bg-brand-gray100 px-4 py-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-gray200 bg-white text-brand-green">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={paths} />
          </svg>
        </span>
        <div>
          <h2 className="text-base font-black text-brand-charcoal">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-brand-gray700">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

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
    className="group rounded-2xl border border-brand-gray200 bg-white p-4 shadow-sm"
  >
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-extrabold uppercase tracking-[0.08em] text-brand-charcoal">
      <span>{title}</span>
      <span className="rounded-full border border-brand-gray200 bg-brand-gray100 px-2 py-0.5 text-xs text-brand-gray700 group-open:hidden">
        Open
      </span>
      <span className="hidden rounded-full border border-brand-gray200 bg-brand-gray100 px-2 py-0.5 text-xs text-brand-gray700 group-open:inline">
        Close
      </span>
    </summary>
    <div className="mt-4 border-t border-brand-gray200 pt-4 text-[15px] leading-7 text-brand-gray700">
      {children}
    </div>
  </details>
);

const PacketBadge = ({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "green" | "amber" | "red" | "neutral";
}) => {
  const toneClass = {
    green: "border-brand-green bg-green-50 text-brand-green",
    amber: "border-brand-warning bg-[#fff8e8] text-brand-warning",
    red: "border-brand-red bg-red-50 text-brand-red",
    neutral: "border-brand-gray200 bg-brand-gray100 text-brand-gray700",
  }[tone];

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-[0.08em] ${toneClass}`}>
      {children}
    </span>
  );
};

const PacketSummaryTile = ({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "green" | "amber" | "red" | "neutral";
}) => {
  const toneClass = {
    green: "border-brand-green bg-green-50",
    amber: "border-brand-warning bg-[#fff8e8]",
    red: "border-brand-red bg-red-50",
    neutral: "border-brand-gray200 bg-brand-gray100",
  }[tone];

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand-gray700">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black leading-tight text-brand-charcoal">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-brand-gray700">{detail}</p>
    </div>
  );
};

const PrioritySection = ({
  title,
  badges,
  children,
}: {
  title: string;
  badges?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-brand-gray200 bg-white p-5 shadow-sm">
    <div className="flex flex-col gap-3 border-b border-brand-gray200 pb-3 sm:flex-row sm:items-start sm:justify-between">
      <h3 className="text-lg font-black leading-tight text-brand-charcoal">
        {title}
      </h3>
      {badges ? <div className="flex flex-wrap gap-2">{badges}</div> : null}
    </div>
    <div className="mt-4 text-[15px] leading-7 text-brand-gray700">{children}</div>
  </section>
);

const PacketList = ({
  items,
  tone = "green",
}: {
  items: string[];
  tone?: "green" | "amber" | "red" | "neutral";
}) => {
  const dotClass = {
    green: "bg-brand-green",
    amber: "bg-brand-warning",
    red: "bg-brand-red",
    neutral: "bg-brand-gray500",
  }[tone];

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className={`mt-2.5 h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

const ReadinessPacket = ({
  guidance,
  selectedRecall,
  role,
  roleEngagement,
  selectedTopics,
  engagementType,
  audience,
  sampleSite,
  serviceLens,
  summarySource,
  briefAction,
  automaticSafetyReview,
  onRegenerate,
  onStartNew,
}: {
  guidance: AiGuidance | null;
  selectedRecall: RecallResult | null;
  role: UserRole;
  roleEngagement: RoleEngagement;
  selectedTopics: Topic[];
  engagementType: EngagementType;
  audience: Audience;
  sampleSite: string;
  serviceLens: ServiceLens;
  summarySource: string;
  briefAction: BriefAction;
  automaticSafetyReview: AutomaticSafetyReview;
  onRegenerate: () => void;
  onStartNew: () => void;
}) => {
  if (!guidance) return null;

  const equipmentCount =
    automaticSafetyReview.equipmentChecked.length ||
    guidance.installedEquipmentReview.length;
  const hasPossibleMatches = automaticSafetyReview.possibleMatches.length > 0;
  const productSafetyStatus = hasPossibleMatches
    ? "Possible matches"
    : automaticSafetyReview.noObviousMatchTerms.length
      ? "Needs verification"
      : "No obvious matches";
  const verificationNeeded =
    guidance.missingInformationToVerify.slice(0, 3).join(", ") ||
    "Model, date range, site details";
  const missingInformation =
    guidance.missingInformationToVerify.length > 0
      ? guidance.missingInformationToVerify
      : [
          "Exact model numbers",
          "Manufacturer documentation",
          "Install and service dates",
          "Recall applicability",
          "Prior deficiencies",
          "Internal review owner",
        ];
  const standardsObjectiveAlignment =
    guidance.standardsObjectiveAlignment?.length
      ? guidance.standardsObjectiveAlignment
      : [
          `Draft objective: participants can explain ${selectedTopics.join(", ") || "the selected topics"} in practical jobsite language.`,
          "Alignment note: use this as planning support only, not as approved certification language.",
          "Check for understanding: ask attendees to describe one field condition to verify and one question to escalate.",
          "Draft alignment for planning purposes. Verify against current Indiana, Pro Board/IFSAC, NFPA, department, company, and AHJ requirements before using for credit or certification.",
        ];
  const simpleLessonPlan =
    guidance.simpleLessonPlan?.length
      ? guidance.simpleLessonPlan
      : [
          "Open with the training objective and why the topic matters in the field.",
          `Review practical examples for ${selectedTopics.join(", ") || "the selected topics"}.`,
          "Use site equipment or demo materials to connect concepts to real work.",
          "Close with questions, attendance/certification reminders, and follow-up items.",
        ];
  const materialsEquipmentNeeded =
    guidance.materialsEquipmentNeeded?.length
      ? guidance.materialsEquipmentNeeded
      : [
          "Training outline or agenda",
          "Attendance/sign-in record",
          "Relevant equipment examples, photos, or approved documentation",
          "Follow-up notes for unresolved technical questions",
        ];
  const certificationAttendanceReminders =
    guidance.certificationAttendanceReminders?.length
      ? guidance.certificationAttendanceReminders
      : [
          "Confirm attendance documentation requirements before the session.",
          "Verify whether any certificate or credit language is approved before use.",
          "Route standards, credit, or certification questions to qualified review.",
        ];
  const packetText = [
    "AI Engagement Readiness Packet",
    `Role: ${role}`,
    `Engagement: ${roleEngagement}`,
    `Topics: ${selectedTopics.join(", ")}`,
    `Site: ${sampleSite}`,
    `Service Lens: ${serviceLens.label}`,
    "",
    "Key Attention Flags",
    ...guidance.keyAttentionFlags.map((item) => `- ${item}`),
    "",
    "Missing Information to Verify",
    ...missingInformation.map((item) => `- ${item}`),
    "",
    "Recommended Next Best Actions",
    ...guidance.recommendedNextBestActions.map((item) => `- ${item}`),
    "",
    "Product Safety / Recall Review",
    ...guidance.productSafetyRecallReview.map((item) => `- ${item}`),
    "",
    "Installed Equipment Review",
    ...guidance.installedEquipmentReview.map((item) => `- ${item}`),
    "",
    "Follow-Up Note Draft",
    guidance.followUpNoteDraft,
    "",
    "Official Source Reminder",
    guidance.officialSourceReminder,
  ].join("\n");
  const copyText = (text: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(text);
  };
  const hasFollowUpNote = guidance.followUpNoteDraft.trim().length > 0;
  const navItems = [
    ["Summary", "#packet-summary"],
    ["Priority Review", "#packet-priority"],
    ["Equipment", "#packet-equipment"],
    ["Product Safety", "#packet-product-safety"],
    ["Prep Notes", "#packet-prep"],
    ["Follow-Up", "#packet-follow-up"],
    ["Verification", "#packet-verification"],
  ];

  return (
    <section className="rounded-2xl border border-brand-gray200 bg-white p-5 shadow-panel sm:p-6">
      <SectionBand
        icon="file"
        title="Generated Packet"
        description="A scan-ready internal readiness report built from engagement, site, equipment, prep, and product-safety context."
      />
      <div className="border-b border-brand-gray200 pb-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-brand-red px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-brand-red">
            Human Review Required
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-charcoal">
              AI Engagement Readiness Packet
            </h2>
            <p className="mt-2 text-sm leading-6 text-brand-gray700">
              {role} | {roleEngagement} | Topics:{" "}
              {selectedTopics.join(", ") || "none selected"}. Site context:{" "}
              {sampleSite}. Service lens: {serviceLens.label}.
              Product safety context:{" "}
              {selectedRecall
                ? selectedRecall.title
                : "No manual product safety recall selected"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onRegenerate}
              className="rounded-xl border border-brand-green bg-white px-3 py-2 text-sm font-extrabold text-brand-green transition hover:bg-green-50"
            >
              Regenerate Packet
            </button>
            <button
              type="button"
              onClick={() => copyText(packetText)}
              className="rounded-xl border border-brand-gray200 bg-white px-3 py-2 text-sm font-extrabold text-brand-charcoal transition hover:bg-brand-gray100"
            >
              Copy Packet
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl border border-brand-gray200 bg-white px-3 py-2 text-sm font-extrabold text-brand-charcoal transition hover:bg-brand-gray100"
            >
              Print Packet
            </button>
            <button
              type="button"
              onClick={onStartNew}
              className="rounded-xl border border-brand-gray200 bg-white px-3 py-2 text-sm font-extrabold text-brand-gray700 transition hover:bg-brand-gray100"
            >
              Start New Packet
            </button>
          </div>
        </div>
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 text-xs font-extrabold uppercase tracking-[0.08em]">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="shrink-0 rounded-full border border-brand-gray200 bg-brand-gray100 px-3 py-2 text-brand-gray700 transition hover:border-brand-green hover:text-brand-green"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div id="packet-summary" className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <PacketSummaryTile
          label="Readiness Score"
          value={`${Math.round(guidance.readinessScore)}%`}
          detail="Preparation completeness only, not safety approval."
          tone="green"
        />
        <PacketSummaryTile
          label="Equipment Reviewed"
          value={`${equipmentCount} ${equipmentCount === 1 ? "system" : "systems"}`}
          detail="Based on selected site equipment and service context."
          tone="neutral"
        />
        <PacketSummaryTile
          label="Product Safety Status"
          value={productSafetyStatus}
          detail="Auto-checked against public recall data; verify before action."
          tone={hasPossibleMatches ? "amber" : "neutral"}
        />
        <PacketSummaryTile
          label="Verification Needed"
          value="Human review"
          detail={verificationNeeded}
          tone="amber"
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-gray200 bg-brand-gray100 p-5">
          <h3 className="text-sm font-extrabold uppercase tracking-[0.1em] text-brand-charcoal">
            Why this packet is tailored to this engagement
          </h3>
          <p className="mt-2 text-[15px] leading-7 text-brand-gray700">
            This packet uses the selected {role.toLowerCase()} role,{" "}
            {roleEngagement.toLowerCase()} engagement, {sampleSite} customer/site
            profile, {selectedTopics.join(", ") || "selected topics"}, the{" "}
            {serviceLens.label} service lens, {equipmentCount} installed{" "}
            {equipmentCount === 1 ? "system" : "systems"}, prep resources, and{" "}
            {selectedRecall ? "selected recall context" : "automatic product safety context"}.
          </p>
        </div>
        <div className="rounded-2xl border border-brand-gray200 bg-white p-5">
          <h3 className="text-sm font-extrabold uppercase tracking-[0.1em] text-brand-charcoal">
            Sources used
          </h3>
          <ul className="mt-3 space-y-1 text-[15px] leading-7 text-brand-gray700">
            <li>Sample customer/site profile</li>
            <li>Service Lens: {serviceLens.label}</li>
            <li>Prep resources for {role}: {roleEngagement}</li>
            <li>Topics: {selectedTopics.join(", ") || "none selected"}</li>
            <li>Automatic product safety review</li>
            {selectedRecall ? <li>Manual recall context: {selectedRecall.title}</li> : null}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-brand-gray200 bg-brand-gray100 p-5">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.1em] text-brand-charcoal">
          Readiness Score Context
        </h3>
        <p className="mt-2 text-[15px] leading-7 text-brand-gray700">
          Readiness reflects preparation completeness, not code compliance or
          safety approval. {guidance.readinessScoreReason}
        </p>
      </div>

      <div id="packet-priority" className="mt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-green">
              Priority Review
            </p>
            <h3 className="mt-1 text-2xl font-black text-brand-charcoal">
              Review These First
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <PacketBadge tone="red">Human Review Required</PacketBadge>
            <PacketBadge tone="amber">Needs Verification</PacketBadge>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <PrioritySection title="Key Attention Flags">
            <div className="mb-3 flex flex-wrap gap-2">
              <PacketBadge tone="amber">Needs Verification</PacketBadge>
              <PacketBadge tone="red">Human Review Required</PacketBadge>
            </div>
            <PacketList items={guidance.keyAttentionFlags} tone="red" />
          </PrioritySection>

          <PrioritySection
            title="Missing Information to Verify"
            badges={<PacketBadge tone="amber">Needs Verification</PacketBadge>}
          >
            <div className="mb-3 flex flex-wrap gap-2">
              <PacketBadge tone="amber">Needs Verification</PacketBadge>
            </div>
            <PacketList items={missingInformation} tone="amber" />
          </PrioritySection>

          <PrioritySection title="Recommended Next Best Actions">
            <PacketList items={guidance.recommendedNextBestActions} tone="green" />
          </PrioritySection>

          <PrioritySection
            title="Product Safety / Recall Review"
            badges={
              <>
                <PacketBadge tone="neutral">Auto-Checked</PacketBadge>
                {hasPossibleMatches ? (
                  <PacketBadge tone="amber">Possible Match</PacketBadge>
                ) : null}
              </>
            }
          >
            <div id="packet-product-safety" className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <PacketBadge tone="neutral">Auto-checked</PacketBadge>
                <PacketBadge tone="amber">Needs Verification</PacketBadge>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">Equipment checked</p>
                <p className="mt-1">
                  {automaticSafetyReview.equipmentChecked
                    .map((item) => equipmentLabel(item))
                    .join(", ") ||
                  "Select a customer/site profile to load known systems, installed equipment, and automatic product safety review."}
                </p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">Search terms used</p>
                <p className="mt-1">
                  {automaticSafetyReview.searchTermsUsed.join(", ") ||
                    "Select a customer/site profile to load known systems, installed equipment, and automatic product safety review."}
                </p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">Possible matches</p>
                {automaticSafetyReview.possibleMatches.length ? (
                  <ul className="mt-1 space-y-2">
                    {automaticSafetyReview.possibleMatches.map((match) => (
                      <li key={`${match.searchTerm}-${match.recall.id}`}>
                        Possible match for {match.equipmentLabel}:{" "}
                        <span className="font-semibold text-brand-charcoal">
                          {match.recall.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1">No obvious recall match found in this search.</p>
                )}
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">No obvious matches</p>
                <p className="mt-1">
                  {automaticSafetyReview.noObviousMatchTerms.join(", ") ||
                    "Select a customer/site profile to load known systems, installed equipment, and automatic product safety review."}
                </p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">What needs verification</p>
                <PacketList
                  items={[
                    ...guidance.productSafetyRecallReview,
                    "Official source reminder: verify against CPSC notices, manufacturer instructions, applicable codes, NFPA standards, company procedures, and qualified internal review.",
                  ]}
                  tone="amber"
                />
              </div>
            </div>
          </PrioritySection>

          {role === "Inspector" ? (
          <PrioritySection title="Installed Equipment Review">
            <div id="packet-equipment">
            {automaticSafetyReview.equipmentChecked.length ? (
              <div className="grid gap-3">
                <div className="flex flex-wrap gap-2">
                  <PacketBadge tone="amber">Needs Verification</PacketBadge>
                </div>
                {automaticSafetyReview.equipmentChecked.map((item) => (
                  <div
                    key={`${item.category}-${item.productName}-${item.locationContext}`}
                    className="rounded-xl border border-brand-gray200 bg-brand-gray100 p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-gray700">
                          Equipment/System
                        </p>
                        <p className="mt-1 font-extrabold text-brand-charcoal">
                          {item.productName || item.category}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-gray700">
                          Manufacturer
                        </p>
                        <p className="mt-1">{item.manufacturer}</p>
                      </div>
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-gray700">
                          Model
                        </p>
                        <p className="mt-1">{item.model}</p>
                      </div>
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-gray700">
                          Status/Reminder
                        </p>
                        <p className="mt-1">{item.serviceStatus}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6">
                      <span className="font-extrabold text-brand-charcoal">
                        Verification need:
                      </span>{" "}
                      {item.documentationNote}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <PacketList items={guidance.installedEquipmentReview} tone="green" />
            )}
            </div>
          </PrioritySection>
          ) : null}
          <PrioritySection title="Related Service Considerations">
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["Safety / Risk Reduction", guidance.relatedServiceGroups.safetyRiskReduction],
                ["Maintenance / Testing", guidance.relatedServiceGroups.maintenanceTesting],
                ["Customer Education", guidance.relatedServiceGroups.customerEducation],
                ["Documentation / Follow-Up", guidance.relatedServiceGroups.documentationFollowUp],
              ].map(([groupTitle, items]) => (
                <div
                  key={groupTitle as string}
                  className="rounded-xl border border-brand-gray200 bg-brand-gray100 p-3"
                >
                  <p className="font-extrabold text-brand-charcoal">
                    {groupTitle as string}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {(items as string[]).slice(0, 2).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </PrioritySection>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-green">
          Supporting Packet Details
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <PacketSection
            title={role === "Instructor" ? "Training Session Context" : "Jobsite / Site Context"}
          >
            <p className="text-[15px] leading-7">{guidance.internalFieldBrief}</p>
          </PacketSection>
          {role === "Instructor" ? (
            <>
              <PacketSection title="Standards / Objective Alignment">
                <PacketList items={standardsObjectiveAlignment} tone="amber" />
              </PacketSection>
              <PacketSection title="Simple Lesson Plan">
                <PacketList items={simpleLessonPlan} tone="green" />
              </PacketSection>
              <PacketSection title="Materials / Equipment Needed">
                <PacketList items={materialsEquipmentNeeded} tone="green" />
              </PacketSection>
              <PacketSection title="Certification / Attendance Reminders">
                <PacketList items={certificationAttendanceReminders} tone="amber" />
              </PacketSection>
            </>
          ) : (
            <>
              <PacketSection title="Equipment / Product Context">
                <PacketList items={guidance.installedEquipmentReview} tone="green" />
              </PacketSection>
              <PacketSection title="Items to Verify">
                <PacketList items={guidance.equipmentProductChecklist} tone="amber" />
              </PacketSection>
            </>
          )}
          <PacketSection title="Talking Points">
            <PacketList items={guidance.audienceSpecificTalkingPoints} tone="green" />
          </PacketSection>
          {role === "Instructor" ? null : (
          <PacketSection title="Equipment / Product Checklist">
            <PacketList items={guidance.equipmentProductChecklist} tone="amber" />
          </PacketSection>
          )}
          {role === "Instructor" ? null : (
          <PacketSection title="Protect / Prevent / Preserve Lens">
            <PacketList items={guidance.protectPreventPreserveLens} tone="green" />
          </PacketSection>
          )}
          <PacketSection title="Deficiency / Documentation Follow-Up">
            <PacketList items={guidance.deficiencyDocumentationFollowUp} tone="amber" />
          </PacketSection>
          <PacketSection title="Related Service Considerations">
            <div className="grid gap-4">
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
                  <div className="mt-2">
                    <PacketList items={items as string[]} tone="green" />
                  </div>
                </div>
              ))}
            </div>
          </PacketSection>
          <PacketSection title="Follow-Up Note Draft">
            <div id="packet-follow-up" className="space-y-3">
            {hasFollowUpNote ? (
              <button
                type="button"
                onClick={() => copyText(guidance.followUpNoteDraft)}
                className="rounded-xl border border-brand-gray200 bg-white px-3 py-2 text-sm font-extrabold text-brand-charcoal transition hover:bg-brand-gray100"
              >
                Copy Follow-Up Note
              </button>
            ) : null}
            <div className="whitespace-pre-line text-[15px] leading-7">
              {guidance.followUpNoteDraft}
            </div>
            </div>
          </PacketSection>
          <PacketSection title="Known from Source">
            <PacketList items={guidance.knownSourceFacts} tone="neutral" />
          </PacketSection>
          <PacketSection title="Provided by User/Demo Profile">
            <PacketList items={guidance.providedDemoProfileContext} tone="neutral" />
          </PacketSection>
          <PacketSection title="AI Interpretation">
            <PacketList items={guidance.aiInterpretation} tone="amber" />
          </PacketSection>
        </div>
      </div>

      <div
        id="packet-verification"
        className="mt-6 rounded-2xl border border-brand-red border-l-4 border-l-brand-red bg-red-50 p-5 text-[15px] leading-7 text-brand-gray700"
      >
        <strong className="text-brand-charcoal">
          Before using this with a customer:
        </strong>{" "}
        Confirm model numbers, manufacturer documentation, install/service dates,
        recall applicability, prior deficiencies, and the internal review owner.
        AI output supports preparation only and must be reviewed by qualified
        personnel.
      </div>

      <div className="mt-4 rounded-2xl border border-brand-gray200 border-l-4 border-l-brand-warning bg-[#fff8e8] p-5 text-[15px] leading-7 text-brand-gray700">
        <strong className="text-brand-charcoal">Official Source Reminder:</strong>{" "}
        {guidance.officialSourceReminder}
      </div>
    </section>
  );
};

export default function Home() {
  const [engagementType, setEngagementType] =
    useState<EngagementType>("Inspect / service");
  const [role, setRole] = useState<UserRole>("Inspector");
  const [roleEngagement, setRoleEngagement] = useState<RoleEngagement>(
    "Inspection / Service Visit",
  );
  const [selectedTopics, setSelectedTopics] =
    useState<Topic[]>(inspectorDefaultTopics);
  const [audience, setAudience] = useState<Audience>("Facility Manager");
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
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [showRecallCheckPanel, setShowRecallCheckPanel] = useState(false);
  const [automaticSafetyReview, setAutomaticSafetyReview] =
    useState<AutomaticSafetyReview>(() => emptySafetyReview(sampleSiteDetails[sampleSites[0]].installedEquipment));
  const [autoReviewLoading, setAutoReviewLoading] = useState(false);
  const [autoReviewCheckedAt, setAutoReviewCheckedAt] = useState<Date | null>(null);

  const prep = prepByEngagement[engagementType];
  const selectedSiteDetails = sampleSiteDetails[selectedSampleSite];
  const selectedServiceLens =
    serviceLenses.find((lens) => lens.id === selectedServiceLensId) ?? serviceLenses[0];
  const applyRole = (nextRole: UserRole) => {
    setRole(nextRole);
    setGuidance(null);

    if (nextRole === "Instructor") {
      setRoleEngagement("Training Session");
      setEngagementType("Teach / train");
      setAudience("Instructor / Trainer");
      setBriefAction("training_prep");
      setSelectedTopics(instructorDefaultTopics);
      setSelectedSampleSite("Fire Department Recruit Training Site");
      return;
    }

    setRoleEngagement("Inspection / Service Visit");
    setEngagementType("Inspect / service");
    setAudience("Internal Inspector");
    setBriefAction("inspection_prep");
    setSelectedTopics(inspectorDefaultTopics);
    setSelectedSampleSite("Municipal Facilities Account");
  };
  const toggleTopic = (topic: Topic) => {
    setSelectedTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
    setGuidance(null);
  };
  const sourceContextUsed = [
    "Automatic product safety review based on selected site equipment",
    `Role: ${role}`,
    `Engagement: ${roleEngagement}`,
    `Topics: ${selectedTopics.join(", ") || "None selected"}`,
    selectedRecall
      ? `Optional manual CPSC recall result: ${selectedRecall.title}`
      : "No manual product safety recall selected. Packet is based on engagement, site, service, prep context, and automatic product safety review.",
    `Customer/Site Profile: ${selectedSiteDetails.label}`,
    `Ryan Service Lens: ${selectedServiceLens.label}`,
    `Engagement type: ${engagementType}`,
    `Audience: ${audience}`,
    "Demo source notes: service environment brief, source hierarchy, documentation/deficiency follow-up logic, and training/event prep frameworks",
  ];

  const resultCountLabel = useMemo(() => {
    if (!hasSearched || searching) return "";
    return `${results.length} ${results.length === 1 ? "result" : "results"} found`;
  }, [hasSearched, results.length, searching]);
  const currentEquipmentCount = selectedSiteDetails.installedEquipment.length;
  const currentProductSafetyStatus = autoReviewLoading
    ? "Checking"
    : automaticSafetyReview.possibleMatches.length
      ? "Possible matches need verification"
      : automaticSafetyReview.searchTermsUsed.length
        ? "Auto-checked; verify sources"
        : "Not checked";
  const showTrainingReadiness =
    engagementType === "Teach / train" ||
    audience === "Instructor / Trainer" ||
    audience === "Recruit Class" ||
    Boolean(selectedSiteDetails.trainingEducationNeed);
  const showEventReadiness =
    selectedSampleSite === "Convention / Trade Show Demo Booth" ||
    engagementType === "Present / attend event";
  const installedEquipmentSummary = selectedSiteDetails.installedEquipment
    .map((item) => item.category)
    .filter((category, index, list) => list.indexOf(category) === index)
    .join(", ");
  const possibleMatchCount = automaticSafetyReview.possibleMatches.length;
  const formattedAutoReviewCheckedAt = autoReviewCheckedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(autoReviewCheckedAt)
    : "Pending";

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
        setAutoReviewCheckedAt(new Date());
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
        setAutoReviewCheckedAt(new Date());
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
          setAutoReviewCheckedAt(new Date());
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
          role,
          roleEngagement,
          selectedTopics,
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

  const startNewPacket = () => {
    setEngagementType("Inspect / service");
    setRole("Inspector");
    setRoleEngagement("Inspection / Service Visit");
    setSelectedTopics(inspectorDefaultTopics);
    setAudience("Internal Inspector");
    setSelectedSampleSite("Municipal Facilities Account");
    setSelectedServiceLensId(serviceLenses[0].id);
    setBriefAction("inspection_prep");
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setSearchError("");
    setSelectedRecall(null);
    setGuidance(null);
    setSummarySource("");
    setSummaryError("");
    setAdditionalNotes("");
  };

  return (
    <main className="min-h-screen bg-brand-gray100">
      <div className="h-1.5 bg-brand-green" />

      <header className="bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-3 lg:px-6">
          <div className="border-b border-brand-gray200 pb-3">
            <p className="text-lg font-black uppercase tracking-[0.03em] text-brand-green sm:text-2xl">
              RYAN FIRE PROTECTION, INC.
            </p>
          </div>

          <section className="py-3 text-center">
            <div className="mx-auto max-w-4xl">
              <h1 className="text-[24px] font-black leading-tight text-brand-charcoal sm:text-[34px]">
                Fire Protection Field Assistant
              </h1>
              <p className="mt-3 text-sm leading-6 text-brand-gray700 sm:text-base">
                Generate focused prep packets for inspectors and instructors.
              </p>
            </div>
          </section>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-4 py-4 lg:px-6">
        <section className="rounded-2xl border border-brand-gray200 bg-white p-5 shadow-panel sm:p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-black text-brand-charcoal">Site</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {visibleSiteOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setSelectedSampleSite(item.value);
                      setGuidance(null);
                    }}
                    className={`min-h-12 rounded-xl border px-3 py-2 text-left text-sm font-extrabold transition ${
                      selectedSampleSite === item.value
                        ? "border-brand-green bg-brand-green text-white"
                        : "border-brand-gray200 bg-white text-brand-charcoal hover:bg-brand-gray100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-black text-brand-charcoal">Role</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["Inspector", "Instructor"] as UserRole[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => applyRole(item)}
                    className={`min-h-12 rounded-xl border px-4 text-left text-sm font-extrabold transition ${
                      role === item
                        ? "border-brand-green bg-brand-green text-white"
                        : "border-brand-gray200 bg-white text-brand-charcoal hover:bg-brand-gray100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-black text-brand-charcoal">Engagement</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {roleEngagementOptions[role].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setRoleEngagement(item);
                      setGuidance(null);
                    }}
                    className={`min-h-12 rounded-xl border px-3 py-2 text-left text-sm font-extrabold transition ${
                      roleEngagement === item
                        ? "border-brand-green bg-brand-green text-white"
                        : "border-brand-gray200 bg-white text-brand-charcoal hover:bg-brand-gray100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-black text-brand-charcoal">Topics</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {topicOptions.map((topic) => {
                  const selected = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`rounded-full border px-3 py-2 text-sm font-extrabold transition ${
                        selected
                          ? "border-brand-green bg-brand-green text-white"
                          : "border-brand-gray200 bg-white text-brand-charcoal hover:bg-brand-gray100"
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void generateSummary(selectedRecall, briefAction)}
            disabled={Boolean(summarizingId)}
            className="mt-6 w-full rounded-xl bg-brand-green px-5 py-4 text-left text-base font-black text-white shadow-sm transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:bg-brand-gray500 sm:w-auto"
          >
            {summarizingId
              ? "Generating AI Engagement Readiness Packet..."
              : "Generate AI Engagement Readiness Packet"}
          </button>

          {summarizingId === "engagement-packet" ? (
            <div className="mt-5 rounded-xl border border-brand-gray200 bg-white p-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-brand-gray100">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-green" />
              </div>
              <div className="mt-4 grid gap-2 text-sm md:grid-cols-4">
                {[
                  "Reviewing site equipment",
                  "Checking product safety data",
                  "Applying engagement context",
                  "Building readiness packet",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-brand-gray200 bg-brand-gray100 p-3 font-extrabold text-brand-charcoal"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {summaryError && !selectedRecall ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-brand-red">
              {summaryError}
            </div>
          ) : null}

          <div className="mt-6">
            {guidance ? (
              <ReadinessPacket
                guidance={guidance}
                selectedRecall={selectedRecall}
                role={role}
                roleEngagement={roleEngagement}
                selectedTopics={selectedTopics}
                engagementType={engagementType}
                audience={audience}
                sampleSite={selectedSampleSite}
                serviceLens={selectedServiceLens}
                summarySource={summarySource}
                briefAction={briefAction}
                automaticSafetyReview={automaticSafetyReview}
                onRegenerate={() => void generateSummary(selectedRecall, briefAction)}
                onStartNew={startNewPacket}
              />
            ) : (
              <div className="rounded-xl border border-brand-gray200 bg-brand-gray100 p-5 text-sm leading-6 text-brand-gray700">
                <p className="text-lg font-black text-brand-charcoal">
                  Packet Preview
                </p>
                <p className="mt-1">
                  Choose a site, role, engagement, and topics, then generate an
                  AI Engagement Readiness Packet.
                </p>
              </div>
            )}
          </div>
        </section>


      </div>

      <footer className="mt-2 bg-brand-green px-5 py-5 text-center text-xs leading-6 text-white">
        Proof-of-concept demo. Verify official sources, manufacturer
        instructions, applicable codes, NFPA standards, department requirements,
        company procedures, and AHJ requirements before action.
      </footer>
    </main>
  );
}

