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
  onRegenerate,
  onStartNew,
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
  const packetText = [
    "AI Engagement Readiness Packet",
    `Engagement: ${engagementType}`,
    `Audience: ${audience}`,
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
          <span className="rounded-full bg-brand-green px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-white">
            AI-Generated
          </span>
          <span className="rounded-full border border-brand-red px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-brand-red">
            Human Review Required
          </span>
          <span className="rounded-full border border-brand-warning px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-brand-warning">
            Source Verification Needed
          </span>
          {summarySource === "openai" ? (
            <span className="rounded-full border border-brand-gray200 bg-brand-gray100 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-brand-gray700">
              Generated with OpenAI
            </span>
          ) : null}
        </div>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-charcoal">
              AI Engagement Readiness Packet
            </h2>
            <p className="mt-2 text-sm leading-6 text-brand-gray700">
              {engagementType} | {audience} |{" "}
              {briefActions.find((action) => action.value === briefAction)?.label}.
              Site context: {sampleSite}. Service lens: {serviceLens.label}.
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
            This packet uses the selected {engagementType.toLowerCase()} context,
            the {audience.toLowerCase()} audience, the {sampleSite} customer/site profile,
            the {serviceLens.label} service lens, {equipmentCount} installed{" "}
            {equipmentCount === 1 ? "system" : "systems"}, prep resources, and{" "}
            {selectedRecall ? "selected recall context" : "automatic product safety context"}.
          </p>
        </div>
        <div className="rounded-2xl border border-brand-gray200 bg-white p-5">
          <h3 className="text-sm font-extrabold uppercase tracking-[0.1em] text-brand-charcoal">
            Sources used
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <PacketBadge tone="neutral">Sample Customer/Site Profile</PacketBadge>
            <PacketBadge tone="neutral">Ryan Service Lens</PacketBadge>
            <PacketBadge tone="neutral">Prep Resources</PacketBadge>
            <PacketBadge tone="neutral">Automatic Safety Review</PacketBadge>
            {selectedRecall ? (
              <PacketBadge tone="amber">Manual Recall Context</PacketBadge>
            ) : null}
          </div>
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
            <PacketBadge tone="neutral">Source Verification Needed</PacketBadge>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <PrioritySection
            title="Key Attention Flags"
            badges={<PacketBadge tone="red">High Attention</PacketBadge>}
          >
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
              <PacketBadge tone="neutral">Known from site profile</PacketBadge>
            </div>
            <PacketList items={missingInformation} tone="amber" />
          </PrioritySection>

          <PrioritySection
            title="Recommended Next Best Actions"
            badges={<PacketBadge tone="green">Next Actions</PacketBadge>}
          >
            <div className="mb-3 flex flex-wrap gap-2">
              <PacketBadge tone="green">AI interpretation</PacketBadge>
              <PacketBadge tone="neutral">Known from site profile</PacketBadge>
            </div>
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

          <PrioritySection
            title="Installed Equipment Review"
            badges={<PacketBadge tone="neutral">Source Context</PacketBadge>}
          >
            <div id="packet-equipment">
            {automaticSafetyReview.equipmentChecked.length ? (
              <div className="grid gap-3">
                <div className="flex flex-wrap gap-2">
                  <PacketBadge tone="neutral">Known from site profile</PacketBadge>
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
          <PrioritySection
            title="Related Service Considerations"
            badges={<PacketBadge tone="green">Service Context</PacketBadge>}
          >
            <div className="mb-3 flex flex-wrap gap-2">
              <PacketBadge tone="green">AI interpretation</PacketBadge>
              <PacketBadge tone="neutral">Known from site profile</PacketBadge>
            </div>
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
          <PacketSection title="Source Context Used">
            <PacketList items={guidance.sourceContextUsed} tone="neutral" />
          </PacketSection>
          <PacketSection title="Internal Field Brief">
            <p className="text-[15px] leading-7">{guidance.internalFieldBrief}</p>
          </PacketSection>
          <PacketSection title="Customer / Audience Talking Points">
            <PacketList items={guidance.audienceSpecificTalkingPoints} tone="green" />
          </PacketSection>
          <PacketSection title="Equipment / Product Checklist">
            <PacketList items={guidance.equipmentProductChecklist} tone="amber" />
          </PacketSection>
          <PacketSection title="Instructor / Event Prep Notes">
            <div id="packet-prep">
            <PacketList items={guidance.trainingOrEventPrepNotes} tone="green" />
            </div>
          </PacketSection>
          <PacketSection title="Protect / Prevent / Preserve Lens">
            <PacketList items={guidance.protectPreventPreserveLens} tone="green" />
          </PacketSection>
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
    useState<EngagementType>("Inspection");
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
  const [automaticSafetyReview, setAutomaticSafetyReview] =
    useState<AutomaticSafetyReview>(() => emptySafetyReview(sampleSiteDetails[sampleSites[0]].installedEquipment));
  const [autoReviewLoading, setAutoReviewLoading] = useState(false);
  const [autoReviewCheckedAt, setAutoReviewCheckedAt] = useState<Date | null>(null);

  const prep = prepByEngagement[engagementType];
  const selectedSiteDetails = sampleSiteDetails[selectedSampleSite];
  const selectedServiceLens =
    serviceLenses.find((lens) => lens.id === selectedServiceLensId) ?? serviceLenses[0];
  const sourceContextUsed = [
    "Automatic product safety review based on selected site equipment",
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
    setEngagementType("Inspection");
    setAudience("Facility Manager");
    setSelectedSampleSite(sampleSites[0]);
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
                Prepare internal readiness packets for inspections, customer
                training, fire department events, conventions, customer
                meetings, and continuing education work using service context,
                customer/site details, product safety review, and
                AI-assisted reasoning.
              </p>
            </div>
          </section>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-4 py-4 lg:px-6">
        <section className="rounded-2xl border border-brand-gray200 bg-white p-4 shadow-panel sm:p-5">
          <div className="mt-4 rounded-2xl border border-brand-gray200 bg-brand-gray100 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-green">
                  Current Packet
                </p>
                <h3 className="mt-1 text-lg font-black text-brand-charcoal">
                  {engagementType} readiness for {audience}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <PacketBadge tone="green">{currentEquipmentCount} equipment items</PacketBadge>
                <PacketBadge tone={automaticSafetyReview.possibleMatches.length ? "amber" : "neutral"}>
                  {currentProductSafetyStatus}
                </PacketBadge>
              </div>
            </div>
            <div className="mt-3 grid gap-2 text-sm leading-6 text-brand-gray700 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-extrabold text-brand-charcoal">Engagement</p>
                <p>{engagementType}</p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">Audience</p>
                <p>{audience}</p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">
                  Sample Customer/Site Profile
                </p>
                <p>{selectedSampleSite}</p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">Service Lens</p>
                <p>{selectedServiceLens.label}</p>
              </div>
            </div>
          </div>
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
          <SectionBand
            icon="building"
            title="Site Equipment"
            description="Demo site data appears here as the selected sample customer/site profile."
          />
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
              Sample Customer/Site Profile
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
              <span className="rounded-full border border-brand-gray200 bg-white px-2 py-0.5 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-gray700">
                Sample profile
              </span>{" "}
              {selectedSiteDetails.shortSummary}
            </p>
            <p className="mt-1">
              Optional Manual Search Result:{" "}
              {selectedRecall ? selectedRecall.title : "None selected"}
            </p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-brand-gray200 bg-white p-3 text-sm leading-6 text-brand-gray700">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-extrabold text-brand-charcoal">
                  Installed Equipment
                </p>
                <PacketBadge tone="neutral">Sample profile</PacketBadge>
              </div>
              <p className="mt-2">
                {currentEquipmentCount} items:{" "}
                {installedEquipmentSummary ||
                  "Select a customer/site profile to load known systems, installed equipment, and automatic product safety review."}
              </p>
            </div>
            <div className="rounded-xl border border-brand-gray200 bg-white p-3 text-sm leading-6 text-brand-gray700">
              <p className="font-extrabold text-brand-charcoal">
                Automatic Product Safety Review
              </p>
              <p className="mt-2">
                {automaticSafetyReview.equipmentChecked.length} equipment items
                checked · {automaticSafetyReview.searchTermsUsed.length} search
                terms generated · {possibleMatchCount} possible matches · Needs
                verification
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <PacketBadge tone="neutral">Auto-checked</PacketBadge>
                {possibleMatchCount ? (
                  <PacketBadge tone="amber">{possibleMatchCount} possible</PacketBadge>
                ) : null}
                <PacketBadge tone="amber">Needs review</PacketBadge>
              </div>
            </div>
            <div className="rounded-xl border border-brand-gray200 bg-white p-3 text-sm leading-6 text-brand-gray700">
              <p className="font-extrabold text-brand-charcoal">Engagement Prep</p>
              <p className="mt-2">
                Materials, discussion topics, likely questions, and follow-up
                reminders are ready for this engagement type.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <StepLabel>Generate</StepLabel>
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
          <div className="mt-5">
            {guidance ? (
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
                onRegenerate={() => void generateSummary(selectedRecall, briefAction)}
                onStartNew={startNewPacket}
              />
            ) : (
              <div className="rounded-xl border border-brand-gray200 bg-white p-4 text-sm leading-6 text-brand-gray700">
                <p className="text-lg font-black text-brand-charcoal">
                  Packet Preview
                </p>
                <p className="mt-1">
                  Generate a readiness packet to see the summarized output here.
                </p>
                <p className="mt-3 text-xs font-bold text-brand-gray700">
                  Human review required: Verify official sources, manufacturer
                  instructions, applicable codes, NFPA standards, and company
                  procedures before action.
                </p>
              </div>
            )}
          </div>
          <details className="mt-3 rounded-xl border border-brand-gray200 bg-white p-3 text-sm leading-6 text-brand-gray700">
            <summary className="cursor-pointer font-extrabold text-brand-charcoal">
              View equipment details
            </summary>
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
                <p>
                  Select a customer/site profile to load known systems,
                  installed equipment, and automatic product safety review.
                </p>
              )}
            </div>
          </details>
          <details className="mt-3 rounded-xl border border-brand-gray200 bg-white p-3">
            <summary className="cursor-pointer text-sm font-extrabold text-brand-charcoal">
              View site/source details
            </summary>
            <div className="mt-3 grid gap-3 text-sm leading-6 text-brand-gray700 md:grid-cols-2">
              <div>
                <p className="font-extrabold text-brand-charcoal">Known Systems</p>
                <p>
                  {selectedSiteDetails.knownSystems.length
                    ? selectedSiteDetails.knownSystems.join(", ")
                    : "Select a customer/site profile to load known systems, installed equipment, and automatic product safety review."}
                </p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">
                  Upcoming Reminder
                </p>
                <p>{selectedSiteDetails.upcomingReminder}</p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">
                  Training / Education Need
                </p>
                <p>{selectedSiteDetails.trainingEducationNeed}</p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">
                  Documentation / Deficiency Context
                </p>
                <p>{selectedSiteDetails.documentationDeficiencyContext}</p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">
                  Service History Notes
                </p>
                <p>{selectedSiteDetails.serviceHistoryNotes}</p>
              </div>
              <div>
                <p className="font-extrabold text-brand-charcoal">
                  Recommended Prep Focus
                </p>
                <p>{selectedSiteDetails.recommendedPrepFocus}</p>
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
          <details className="mt-4 rounded-xl border border-brand-gray200 bg-white p-3">
            <summary className="cursor-pointer text-sm font-extrabold text-brand-charcoal">
              View prep details
            </summary>
            <div className="mt-3 grid gap-3 text-sm leading-6 text-brand-gray700 md:grid-cols-3">
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
              <div className="mt-3 grid gap-3 rounded-xl border border-brand-gray200 bg-brand-gray100 p-3 text-sm leading-6 text-brand-gray700 md:grid-cols-2">
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
          <details className="mt-4 rounded-xl border border-brand-gray200 bg-white p-3">
            <summary className="cursor-pointer text-sm font-extrabold text-brand-charcoal">
              View safety review details
            </summary>
            <div className="rounded-xl border border-brand-gray200 bg-brand-gray100 p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-brand-charcoal">
                    Automatic Product Safety Review
                  </p>
                  <p className="mt-2 text-sm leading-6 text-brand-gray700">
                    The app checks public CPSC recall data using installed
                    equipment from the selected customer/site profile. Possible matches
                    need verification; the app does not decide whether a recall
                    applies.
                  </p>
                </div>
                <span className="w-fit rounded-full border border-brand-gray200 bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-gray700">
                  Last checked: {formattedAutoReviewCheckedAt}
                </span>
              </div>
              {autoReviewLoading ? (
                <p className="mt-3 text-sm font-extrabold text-brand-charcoal">
                  Checking installed equipment against public recall data...
                </p>
              ) : (
                <div className="mt-4 space-y-4 text-sm leading-6 text-brand-gray700">
                  <div className="grid gap-2 md:grid-cols-5">
                    {[
                      ["Equipment loaded", `${automaticSafetyReview.equipmentChecked.length} items`],
                      ["Search terms generated", `${automaticSafetyReview.searchTermsUsed.length} terms`],
                      ["CPSC checked", "Public data reviewed"],
                      [
                        "Possible matches reviewed",
                        `${automaticSafetyReview.possibleMatches.length} possible`,
                      ],
                      ["Human verification required", "Always required"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-brand-gray200 bg-white p-3"
                      >
                        <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-brand-gray700">
                          {label}
                        </p>
                        <p className="mt-1 font-extrabold text-brand-charcoal">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
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
                        "Select a customer/site profile to load known systems, installed equipment, and automatic product safety review."}
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
                  <div className="hidden overflow-hidden rounded-xl border border-brand-gray200 bg-white md:block">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-brand-gray100 text-xs uppercase tracking-[0.08em] text-brand-gray700">
                        <tr>
                          <th className="px-3 py-2">Equipment</th>
                          <th className="px-3 py-2">Search Terms</th>
                          <th className="px-3 py-2">Result</th>
                          <th className="px-3 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-gray200">
                        {automaticSafetyReview.equipmentChecked.map((item) => {
                          const label = equipmentLabel(item);
                          const terms = automaticSafetyReview.searchTermsUsed.filter(
                            (term) =>
                              term.toLowerCase().includes(item.category.toLowerCase()) ||
                              term.toLowerCase().includes(item.manufacturer.toLowerCase()) ||
                              term.toLowerCase().includes(item.productName.toLowerCase()),
                          );
                          const matches = automaticSafetyReview.possibleMatches.filter(
                            (match) => match.equipmentLabel === label,
                          );
                          return (
                            <tr key={`${item.category}-${item.productName}-review-row`}>
                              <td className="px-3 py-3 font-extrabold text-brand-charcoal">
                                {label}
                              </td>
                              <td className="px-3 py-3">
                                {terms.slice(0, 3).join(", ") || "General equipment terms"}
                              </td>
                              <td className="px-3 py-3">
                                {matches.length
                                  ? `${matches.length} possible match${matches.length === 1 ? "" : "es"}`
                                  : "No obvious match"}
                              </td>
                              <td className="px-3 py-3">
                                <PacketBadge tone="amber">Needs Review</PacketBadge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </details>
            <details className="mt-4 rounded-xl border border-brand-gray200 bg-white p-3">
              <summary className="cursor-pointer text-sm font-extrabold text-brand-charcoal">
                Product Recall Check
              </summary>
              <p className="mt-2 text-sm leading-6 text-brand-gray700">
                Check an additional product by name, model, photo, UPC, barcode,
                hazard, or keyword.
              </p>
              <p className="mt-2 text-xs leading-5 text-brand-gray700">
                Photo and barcode capture are concept inputs for identifying
                product details. Verify extracted details before relying on
                recall results.
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
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <label className="text-sm font-bold text-brand-charcoal">
                  Product photo / take photo concept
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="mt-2 w-full rounded-xl border border-brand-gray200 bg-white px-3 py-2 text-sm text-brand-gray700"
                  />
                </label>
                <label className="text-sm font-bold text-brand-charcoal">
                  UPC / barcode entry concept
                  <input
                    placeholder="Enter or scan UPC/barcode"
                    className="mt-2 min-h-11 w-full rounded-xl border border-brand-gray200 bg-white px-3 text-brand-charcoal"
                  />
                </label>
              </div>

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
          <details className="mt-4 rounded-xl border border-brand-gray200 bg-white p-3">
            <summary className="cursor-pointer text-sm font-extrabold text-brand-charcoal">
              Additional Manual / Site / Training Notes
            </summary>
            <p className="mt-2 text-sm leading-6 text-brand-gray700">
              Add manual, site, training, or product notes if helpful.
            </p>
            <textarea
              value={additionalNotes}
              onChange={(event) => {
                setAdditionalNotes(event.target.value);
                setGuidance(null);
              }}
              placeholder="Paste manual excerpts, service notes, site-specific equipment details, customer training history, or internal prep notes here."
              className="mt-2 min-h-28 w-full rounded-xl border border-brand-gray200 bg-white px-3 py-3 text-sm leading-6 text-brand-charcoal shadow-sm placeholder:text-brand-gray500"
            />
          </details>
        </section>

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

        <section className="mt-5 rounded-2xl border border-brand-gray200 bg-white p-4 shadow-panel sm:p-5">
          <SectionBand
            icon="alert"
            title="Verification Required"
            description="Use the packet as internal preparation support, then verify against official sources and qualified internal review."
          />
          <div className="rounded-2xl border-l-4 border-brand-warning bg-[#fff8e8] p-4 text-sm leading-6 text-brand-gray700">
          <strong className="text-brand-charcoal">Responsible AI:</strong>{" "}
          AI-generated guidance should be reviewed against official CPSC
          notices, manufacturer instructions, applicable codes, NFPA standards,
          and company procedures before action is taken.
          </div>
        </section>

      </div>

      <footer className="mt-2 bg-brand-green px-5 py-5 text-center text-xs leading-6 text-white">
        Concept prototype for demonstration purposes.
      </footer>
    </main>
  );
}

