"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import knowledgeBase from "../data/source-docs/sampleKnowledgeBase.json";
import type {
  AiGuidance,
  AutomaticSafetyReview,
  InstalledEquipment,
  RecallResult,
} from "./types";

type EngagementType =
  | "Inspection Prep"
  | "Training Prep"
  | "Service Prep"
  | "Site Survey Prep"
  | "Documentation Review Prep"
  | "Customer Meeting Prep";

type Audience =
  | "Facility Manager"
  | "Fire Department"
  | "Municipality"
  | "Building Owner"
  | "Internal Inspector"
  | "Instructor"
  | "Recruit Class"
  | "Safety Coordinator"
  | "Convention Attendee"
  | "Internal Sales Team"
  | "Prospective Customer";

type UserRole =
  | "Inspection"
  | "Service"
  | "Training"
  | "Sales"
  | "Design & Engineering"
  | "Construction";

type RoleEngagement =
  | "Inspection"
  | "System Testing"
  | "Service Follow-Up"
  | "Training Session"
  | "Customer Meeting"
  | "Site Survey"
  | "Plan Review"
  | "Project Coordination";

type Topic =
  | "Fire Sprinkler System"
  | "Fire Alarm and Detection"
  | "Fire Extinguishers"
  | "Emergency Lighting"
  | "Fire Hydrants"
  | "Fire Pump"
  | "Special Hazards"
  | "Training Demonstration Equipment";

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

const serviceLenses = knowledgeBase.serviceLenses as ServiceLens[];

const visibleSiteOptions = [
  { label: "Healthcare", value: "Healthcare" },
  { label: "Heavy Industrial", value: "Heavy Industrial" },
  { label: "Light Industrial", value: "Light Industrial" },
  { label: "Education", value: "Education" },
  { label: "Specialty", value: "Specialty" },
  { label: "Mixed-Use", value: "Mixed-Use" },
  { label: "Multi-Family", value: "Multi-Family" },
  { label: "Fire Department and Public Safety", value: "Fire Department and Public Safety" },
];

const locationSampleMap: Record<string, string> = {
  Healthcare: "Healthcare Facility ITM Review",
  "Heavy Industrial": "Industrial Special Hazards Site",
  "Light Industrial": "Industrial Special Hazards Site",
  Education: "Education Campus Facilities Training",
  Specialty: "Municipal Facilities Account",
  "Mixed-Use": "Commercial Office",
  "Multi-Family": "Commercial Office",
  "Fire Department and Public Safety": "Fire Department Recruit Training Site",
};

const roleEngagementOptions: RoleEngagement[] = [
  "Inspection",
  "System Testing",
  "Service Follow-Up",
  "Training Session",
  "Customer Meeting",
  "Site Survey",
  "Plan Review",
  "Project Coordination",
];

const teamFocusMap: Record<UserRole, string[]> = {
  Inspection: [
    "location and inspection context",
    "systems to inspect",
    "prior findings or deficiencies",
    "items to verify onsite",
  ],
  Service: [
    "reported issue or service need",
    "prior service history",
    "troubleshooting approach",
    "safety or verification steps",
  ],
  Training: [
    "audience and learning objectives",
    "teaching points",
    "demonstration ideas",
    "likely questions",
  ],
  Sales: [
    "customer discussion points",
    "recent service activity",
    "open questions",
    "follow-up opportunities",
  ],
  "Design & Engineering": [
    "system requirements",
    "site constraints",
    "drawing and specification questions",
    "field coordination needs",
  ],
  Construction: [
    "scope and schedule readiness",
    "coordination needs",
    "materials or fabrication status",
    "installation risks",
  ],
};

const engagementTypeFocusMap: Record<RoleEngagement, string[]> = {
  Inspection: ["field inspection scope", "records and system condition review"],
  "System Testing": ["test procedure readiness", "acceptance or functional test documentation"],
  "Service Follow-Up": ["open issue status", "repair or closeout documentation"],
  "Training Session": ["session flow", "reference materials and likely questions"],
  "Customer Meeting": ["meeting talking points", "next-step planning"],
  "Site Survey": ["field conditions to capture", "access constraints and assumptions"],
  "Plan Review": ["drawings and specifications", "documentation gaps and design assumptions"],
  "Project Coordination": ["jobsite coordination", "schedule, material, and handoff risks"],
};

const environmentFocusMap: Record<string, string[]> = {
  Healthcare: ["patient and staff safety", "restricted access and documentation sensitivity"],
  "Heavy Industrial": ["production impact and shutdown windows", "EHS coordination and special hazards"],
  "Light Industrial": ["warehouse and loading area access", "storage and operational flow"],
  Education: ["students, staff, and district contacts", "after-hours or summer work coordination"],
  Specialty: ["unusual occupancy or public access", "special systems and stakeholder coordination"],
  "Mixed-Use": ["tenant access and multiple occupancies", "shared systems and documentation complexity"],
  "Multi-Family": ["resident notices and common areas", "property management and phased access"],
  "Fire Department and Public Safety": ["apparatus bays and emergency response readiness", "recruit training and shift activity"],
};

const inspectorDefaultTopics: Topic[] = [
  "Fire Sprinkler System",
  "Fire Extinguishers",
  "Emergency Lighting",
  "Fire Hydrants",
];

const instructorDefaultTopics: Topic[] = [
  "Fire Sprinkler System",
  "Fire Alarm and Detection",
  "Training Demonstration Equipment",
];

const equipmentAssetsBySite: Record<string, Topic[]> = {
  "Municipal Facilities Account": [
    "Fire Sprinkler System",
    "Fire Extinguishers",
    "Emergency Lighting",
    "Fire Hydrants",
    "Fire Pump",
  ],
  "Fire Department Recruit Training Site": [
    "Fire Sprinkler System",
    "Fire Alarm and Detection",
    "Training Demonstration Equipment",
  ],
  "Healthcare Facility ITM Review": [
    "Fire Sprinkler System",
    "Fire Alarm and Detection",
    "Special Hazards",
    "Emergency Lighting",
    "Fire Pump",
  ],
  "Education Campus Facilities Training": [
    "Fire Alarm and Detection",
    "Fire Extinguishers",
    "Emergency Lighting",
    "Fire Sprinkler System",
  ],
  "Industrial Special Hazards Site": [
    "Special Hazards",
    "Fire Extinguishers",
    "Fire Alarm and Detection",
    "Emergency Lighting",
  ],
  "Commercial Office": [
    "Fire Alarm and Detection",
    "Fire Extinguishers",
    "Emergency Lighting",
    "Fire Sprinkler System",
  ],
};

type ClientRecord = {
  equipmentAssets: string[];
  serviceTrainingHistory: string[];
  openItems: string[];
  trainingContext: string[];
  resources: {
    title: string;
    type: string;
    description: string;
    action: string;
  }[];
};

type EquipmentAssetRecord = {
  name: string;
  category: string;
  manufacturer: string;
  model: string;
  sku: string;
  serialNumber: string;
  location: string;
  installDate: string;
  lastInspectionTestDate: string;
  certificationServiceStatus: string;
  recallSafetyStatus: string;
  documentationStatus: string;
  deficiencyStatus: string;
  description: string;
  notes: string;
  verificationNeeded: string;
};

const equipmentRecordLibrary: Record<string, EquipmentAssetRecord> = {
  "Fire Sprinkler System": {
    name: "Wet Pipe Sprinkler System",
    category: "Sprinkler system",
    manufacturer: "Viking",
    model: "Demo model unknown",
    sku: "VIK-WP-DEMO-001",
    serialNumber: "DEMO-SPR-1042",
    location: "Training wing and mechanical room",
    installDate: "Demo date unknown",
    lastInspectionTestDate: "Sample record: annual ITM due this quarter",
    certificationServiceStatus: "Sample record needs verification",
    recallSafetyStatus:
      "Sample record: no confirmed recall match. Verify exact model, date code, and official documentation before relying on this.",
    documentationStatus: "Sample record: inspection documentation needs review",
    deficiencyStatus: "Sample record: no confirmed deficiency listed",
    description:
      "Wet pipe sprinkler system used as the primary example for recruit awareness and facility training.",
    notes:
      "Useful for explaining sprinkler purpose, sprinkler head activation, valve/gauge awareness, and inspection documentation.",
    verificationNeeded:
      "Confirm exact system type, valve locations, manufacturer details, inspection history, and site-specific restrictions.",
  },
  "Fire Alarm and Detection": {
    name: "Fire Alarm and Detection System",
    category: "Alarm and detection",
    manufacturer: "Honeywell",
    model: "Demo panel unknown",
    sku: "HON-ALM-DEMO-002",
    serialNumber: "DEMO-ALM-2088",
    location: "Main facility alarm panel area",
    installDate: "Demo date unknown",
    lastInspectionTestDate: "Sample record: testing documentation needs review",
    certificationServiceStatus: "Sample record needs verification",
    recallSafetyStatus:
      "Sample record: no confirmed recall match. Verify exact model, date code, and official documentation before relying on this.",
    documentationStatus: "Sample record: testing documentation needs review",
    deficiencyStatus: "Sample record: open documentation question",
    description:
      "Alarm and detection system used to discuss detection, notification, monitoring, and response.",
    notes:
      "Useful for explaining the difference between detection, notification, and sprinkler response.",
    verificationNeeded:
      "Confirm installed panel/device details, monitoring setup, testing records, and documentation status.",
  },
  "Fire Extinguishers": {
    name: "Portable Fire Extinguishers",
    category: "Portable fire protection equipment",
    manufacturer: "Amerex",
    model: "Demo extinguisher type unknown",
    sku: "AMX-EXT-DEMO-003",
    serialNumber: "DEMO-EXT-3175",
    location: "Hallway and training area examples",
    installDate: "Demo date unknown",
    lastInspectionTestDate: "Sample record: monthly visual check status unknown",
    certificationServiceStatus: "Sample record needs verification",
    recallSafetyStatus:
      "Sample record: no confirmed recall match. Verify exact model, date code, and official documentation before relying on this.",
    documentationStatus: "Sample record: inspection tag status unknown",
    deficiencyStatus: "Sample record: access and location needs confirmation",
    description:
      "Portable extinguishers used for first-response awareness and customer and facility education.",
    notes:
      "Useful for explaining extinguisher access, hazard suitability, inspection tags, and employee training.",
    verificationNeeded:
      "Confirm extinguisher type and class, location, inspection tag, maintenance status, and training requirements.",
  },
  "Emergency Lighting": {
    name: "Emergency Lighting and Exit Signs",
    category: "Emergency lighting",
    manufacturer: "Lithonia",
    model: "Demo model unknown",
    sku: "LIT-EML-DEMO-004",
    serialNumber: "DEMO-EML-5521",
    location: "Exit corridors",
    installDate: "Demo date unknown",
    lastInspectionTestDate: "Sample record: test documentation needs review",
    certificationServiceStatus: "Sample record needs verification",
    recallSafetyStatus:
      "Sample record: no confirmed recall match. Verify exact model, date code, and official documentation before relying on this.",
    documentationStatus: "Sample record: test documentation needs review",
    deficiencyStatus: "Sample record: no confirmed deficiency listed",
    description:
      "Emergency lighting and exit signs used to discuss egress visibility and periodic testing.",
    notes: "Useful for facility training, walkthroughs, and documentation review.",
    verificationNeeded:
      "Confirm device locations, visibility, battery and test records, and documentation status.",
  },
  "Fire Hydrants": {
    name: "Exterior Fire Hydrant",
    category: "Water supply and hydrant",
    manufacturer: "Mueller",
    model: "Demo hydrant model unknown",
    sku: "MUL-HYD-DEMO-006",
    serialNumber: "DEMO-HYD-8841",
    location: "Public building exterior",
    installDate: "Demo date unknown",
    lastInspectionTestDate: "Sample record: flow test date needs confirmation",
    certificationServiceStatus: "Sample record needs verification",
    recallSafetyStatus:
      "Sample record: no confirmed recall match. Verify exact model, date code, and official documentation before relying on this.",
    documentationStatus: "Sample record: hydrant inspection record needs review",
    deficiencyStatus: "Sample record: access and flow data need verification",
    description:
      "Hydrant context used to discuss water supply, access, inspection, and documentation.",
    notes: "Useful for municipal readiness, inspections, and service planning.",
    verificationNeeded:
      "Confirm hydrant location, access, flow test history, maintenance notes, and ownership.",
  },
  "Fire Pump": {
    name: "Fire Pump",
    category: "Fire pump",
    manufacturer: "Aurora",
    model: "Demo pump model unknown",
    sku: "AUR-PMP-DEMO-005",
    serialNumber: "DEMO-PMP-7604",
    location: "Pump room",
    installDate: "Demo date unknown",
    lastInspectionTestDate: "Sample record: annual test record needs confirmation",
    certificationServiceStatus: "Sample record needs verification",
    recallSafetyStatus:
      "Sample record: no confirmed recall match. Verify exact model, date code, and official documentation before relying on this.",
    documentationStatus: "Sample record: annual test record needs confirmation",
    deficiencyStatus: "Sample record: qualified review required",
    description:
      "Fire pump context used when discussing water supply support for fire protection systems.",
    notes:
      "Useful for explaining that some systems depend on water supply, pressure, testing, and documentation.",
    verificationNeeded:
      "Confirm pump role, test records, maintenance history, alarms and monitoring, and qualified review requirements.",
  },
  "Special Hazards": {
    name: "Special Hazard System",
    category: "Special hazards",
    manufacturer: "Ansul",
    model: "Demo suppression model unknown",
    sku: "ANS-SPH-DEMO-007",
    serialNumber: "DEMO-SPH-6290",
    location: "Special equipment area",
    installDate: "Demo date unknown",
    lastInspectionTestDate: "Sample record: service record needs confirmation",
    certificationServiceStatus: "Sample record needs verification",
    recallSafetyStatus:
      "Sample record: no confirmed recall match. Verify exact model, date code, and official documentation before relying on this.",
    documentationStatus: "Sample record: manufacturer documentation needs review",
    deficiencyStatus: "Sample record: qualified review required",
    description:
      "Special hazard system context used for documentation and qualified service discussions.",
    notes: "Useful for explaining why specialized systems require verified details.",
    verificationNeeded:
      "Confirm hazard type, agent/system details, service history, and qualified review requirements.",
  },
  "Training Demonstration Equipment": {
    name: "Training Demonstration Equipment",
    category: "Training equipment",
    manufacturer: "Demo training kit",
    model: "Demo model unknown",
    sku: "TRN-PROP-DEMO-008",
    serialNumber: "DEMO-TRN-4410",
    location: "Training room",
    installDate: "Demo date unknown",
    lastInspectionTestDate: "Sample record: instructor review needed",
    certificationServiceStatus: "Sample record needs verification",
    recallSafetyStatus:
      "Sample record: no confirmed recall match. Verify exact model, date code, and official documentation before relying on this.",
    documentationStatus: "Sample record: training material status needs review",
    deficiencyStatus: "Sample record: demonstration condition needs confirmation",
    description:
      "Demo equipment used to support recruit training, facility education, and hands-on explanation.",
    notes: "Useful for teaching component recognition and field awareness.",
    verificationNeeded:
      "Confirm training prop condition, approved use, safety boundaries, and instructor notes.",
  },
};

const clientRecords: Record<string, ClientRecord> = {
  "Fire Department Recruit Training Site": {
    equipmentAssets: equipmentAssetsBySite["Fire Department Recruit Training Site"],
    serviceTrainingHistory: [
      "Recruit training requested",
      "Sprinkler overview needed",
      "Continuing education prep needed",
    ],
    openItems: [
      "Confirm training objectives",
      "Verify demonstration materials",
      "Prepare attendance documentation",
    ],
    trainingContext: [
      "Recruit audience",
      "Continuing education prep",
      "Lesson plan needed",
    ],
    resources: [
      {
        title: "Sprinkler System Overview",
        type: "Training Resource",
        description: "Basic component and system explanation.",
        action: "Sample context",
      },
      {
        title: "Instructor Checklist",
        type: "Lesson Planning",
        description: "Prep reminders for CE delivery.",
        action: "Sample context",
      },
      {
        title: "Product Safety Data",
        type: "Safety and Recall Context",
        description: "Verification reminders based on assets.",
        action: "Sample context",
      },
      {
        title: "Attendance Roster Template",
        type: "Documentation",
        description: "Attendance or CE completion reminder.",
        action: "Sample context",
      },
    ],
  },
  "Municipal Facilities Account": {
    equipmentAssets: equipmentAssetsBySite["Municipal Facilities Account"],
    serviceTrainingHistory: [
      "Annual inspection due soon",
      "Prior extinguisher documentation gap",
    ],
    openItems: [
      "Missing extinguisher model numbers",
      "Emergency lighting date needs verification",
      "Photograph sprinkler manufacturer labels",
    ],
    trainingContext: [
      "Facility maintenance staff",
      "Documentation awareness",
      "Basic safety reminders",
    ],
    resources: [
      {
        title: "Site Record",
        type: "Client Context",
        description: "Facility equipment and open items.",
        action: "Sample context",
      },
      {
        title: "Asset List",
        type: "Equipment Record",
        description: "Current demo equipment record.",
        action: "Sample context",
      },
      {
        title: "Service Notes",
        type: "Documentation",
        description: "Recent reminders and open gaps.",
        action: "Sample context",
      },
      {
        title: "Product Safety Data",
        type: "Safety and Recall Context",
        description: "Recall verification reminders.",
        action: "Sample context",
      },
    ],
  },
  "Healthcare Facility ITM Review": {
    equipmentAssets: equipmentAssetsBySite["Healthcare Facility ITM Review"],
    serviceTrainingHistory: [
      "ITM documentation review",
      "Healthcare compliance sensitivity",
    ],
    openItems: [
      "Confirm documentation gaps",
      "Verify special hazards details",
      "Review emergency lighting dates",
    ],
    trainingContext: [
      "Facilities and compliance staff",
      "Inspection readiness",
      "Equipment awareness",
    ],
    resources: [
      {
        title: "ITM Record",
        type: "Client Context",
        description: "Inspection and testing context.",
        action: "Sample context",
      },
      {
        title: "Manufacturer Documentation",
        type: "Resource",
        description: "Equipment guidance to verify.",
        action: "Sample context",
      },
      {
        title: "Healthcare Safety Checklist",
        type: "Documentation",
        description: "Facility-sensitive review reminders.",
        action: "Sample context",
      },
    ],
  },
  "Education Campus Facilities Training": {
    equipmentAssets: equipmentAssetsBySite["Education Campus Facilities Training"],
    serviceTrainingHistory: [
      "Staff education session",
      "Campus safety walkthrough",
    ],
    openItems: [
      "Confirm audience knowledge level",
      "Verify extinguisher training materials",
      "Identify campus follow-up questions",
    ],
    trainingContext: [
      "Campus staff",
      "Safety awareness",
      "Emergency systems overview",
    ],
    resources: [
      {
        title: "Training Outline",
        type: "Training Resource",
        description: "Session structure and reminders.",
        action: "Sample context",
      },
      {
        title: "Campus Notes",
        type: "Client Context",
        description: "Sample campus follow-up context.",
        action: "Sample context",
      },
      {
        title: "Attendance Record Template",
        type: "Documentation",
        description: "Training completion reminder.",
        action: "Sample context",
      },
    ],
  },
  "Commercial Office": {
    equipmentAssets: equipmentAssetsBySite["Commercial Office"],
    serviceTrainingHistory: [
      "Tenant safety walkthrough requested",
      "Emergency lighting and alarm documentation should be reviewed",
    ],
    openItems: [
      "Confirm alarm panel details",
      "Verify emergency lighting test dates",
      "Review sprinkler inspection documentation",
    ],
    trainingContext: [
      "Office facilities team",
      "Tenant safety awareness",
      "Documentation readiness",
    ],
    resources: [
      {
        title: "Office Facility Record",
        type: "Facility Context",
        description: "Sample office equipment and open items.",
        action: "Sample context",
      },
      {
        title: "Asset List",
        type: "Equipment Context",
        description: "Alarm, extinguisher, lighting, and sprinkler records.",
        action: "Sample context",
      },
      {
        title: "Product Safety Data",
        type: "Safety and Recall Context",
        description: "Verification reminders based on office equipment.",
        action: "Sample context",
      },
    ],
  },
};

const sampleSiteDetails: Record<string, SiteProfile> = {
  "Municipal Facilities Account": {
    id: "municipal-facilities",
    name: "Municipal Facilities Account",
    profileType: "Sample profile",
    locationType: "Municipal public buildings",
    shortSummary:
      "Multiple public buildings with extinguishers, smoke alarms and detection devices, emergency lighting, sprinklers, hydrants, and upcoming annual inspection needs.",
    label: "Municipal Facilities Account",
    type: "Municipality",
    primaryAudience: "Municipality facilities leadership",
    knownSystems: [
      "Fire extinguishers",
      "Fire alarm and detection",
      "Emergency lighting and exit signs",
      "Sprinkler system",
      "Hydrants near public buildings",
    ],
    systems: [
      "Fire extinguishers",
      "Fire alarm and detection",
      "Emergency lighting and exit signs",
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
        productName: "Smoke alarms and detection devices",
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
          "Explain monthly and annual testing expectations in plain language",
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
        serviceStatus: "Flow testing history should be reviewed",
        documentationNote: "Confirm last flow test and access and obstruction notes",
        trainingRelevance: "Useful for municipality and public safety discussion",
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
      "Inspection",
      "Documentation Follow-up",
      "Fire Extinguishers",
      "Fire Alarm and Detection",
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
      "Recruit training context with sprinkler, fire pump, alarm and detection, hydrant, and extinguisher examples for response-awareness instruction.",
    label: "Fire Department Recruit Training Site",
    type: "Fire Department recruit training",
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
        productName: "Fire alarm panel and detection examples",
        manufacturer: "Honeywell",
        model: "Demo model unknown",
        locationContext: "Alarm response awareness segment",
        serviceStatus: "Training prep",
        documentationNote: "Use approved photos or diagrams.",
        trainingRelevance: "Supports what crews should recognize, avoid, report, or escalate.",
      },
      {
        category: "hydrant",
        productName: "Training hydrant and flow discussion example",
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
      "Hydrant flow testing conversation",
      "Sprinkler system education",
      "Alarm response awareness",
      "Customer training follow-up",
    ],
    relatedServiceLenses: [
      "Training Session",
      "Fire Sprinklers",
      "Fire Hydrants",
      "Fire Alarm and Detection",
    ],
    relatedService:
      "Hydrant flow testing conversation; sprinkler system education; alarm response awareness; additional customer training opportunities",
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
      "Healthcare facility review with alarm and detection, sprinklers, emergency lighting, extinguishers, and documentation-heavy inspection needs.",
    label: "Healthcare Facility ITM Review",
    type: "Healthcare facility",
    primaryAudience: "Facility Manager and Building Owner",
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
        productName: "Emergency lighting and exit signs",
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
      "Service Follow-Up",
    ],
    relatedServiceLenses: [
      "Inspection",
      "Fire Alarm and Detection",
      "Fire Sprinklers",
      "Documentation Follow-up",
    ],
    relatedService:
      "Documentation review; emergency lighting inspection; alarm testing review; preventive maintenance; deficiency follow-up",
    serviceHistoryNotes:
      "Service history notes emphasize documentation completeness, deficiency follow-up, and clear escalation paths for facility leadership.",
    recommendedPrepFocus:
      "Review inspection and testing records, prepare deficiency follow-up questions, and verify exact equipment before discussing product safety findings.",
  },
  "Industrial Special Hazards Site": {
    id: "industrial-special-hazards",
    name: "Industrial Special Hazards Site",
    profileType: "Sample profile",
    locationType: "Industrial facility",
    shortSummary:
      "Industrial site with special hazard suppression, extinguishers, alarm and detection, emergency lighting, and higher need for manufacturer and manual verification.",
    label: "Industrial Special Hazards Site",
    type: "Industrial special hazards",
    primaryAudience: "Facility Manager and Internal Inspector",
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
        productName: "Industrial alarm and detection system",
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
      "Manufacturer manuals, inspection and testing records, service history, deficiency photos and notes, exact product and model details.",
    documentationNeed:
      "Manufacturer manuals, inspection and testing records, service history, deficiency photos and notes, exact product and model details",
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
      "Documentation Follow-up",
    ],
    relatedService:
      "Special hazard system review; clean foam testing discussion if applicable; documentation review; emergency service readiness; preventive maintenance",
    serviceHistoryNotes:
      "Service notes mention system-specific documentation questions and the need to route technical determinations through qualified internal review.",
    recommendedPrepFocus:
      "Prepare source hierarchy reminders, confirm manuals and service history, and flag exact model verification before any customer-facing discussion.",
  },
  "Education Campus Facilities Training": {
    id: "education-campus-training",
    name: "Education Campus Facilities Training",
    profileType: "Sample profile",
    locationType: "Education campus",
    shortSummary:
      "Campus facilities training context with extinguishers, alarm panels, sprinklers, emergency lighting, and exit signs before a semester readiness cycle.",
    label: "Education Campus Facilities Training",
    type: "Education campus facilities",
    primaryAudience: "Facility Manager and Instructor",
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
      "Training Session",
      "Fire Extinguishers",
      "Fire Alarm and Detection",
      "Fire Sprinklers",
      "Inspection",
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
      "Warehouse inspection prep with extinguishers, sprinklers, alarm and detection, emergency lighting, and possible special hazard areas.",
    label: "Distribution Warehouse Inspection Prep",
    type: "Commercial distribution warehouse",
    primaryAudience: "Facility Manager and Building Owner",
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
        productName: "Warehouse fire alarm and detection system",
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
      "Inspection",
      "Training Session",
      "Fire Extinguishers",
      "Fire Sprinklers",
      "Fire Alarm and Detection",
    ],
    relatedService:
      "Extinguisher training; emergency lighting inspection; alarm testing review; sprinkler inspection; preventive maintenance",
    serviceHistoryNotes:
      "Recent warehouse prep notes mention extinguisher placement questions, emergency lighting documentation, and open sprinkler inspection items.",
    recommendedPrepFocus:
      "Review inspection records, prepare equipment-specific verification list, and identify customer-friendly follow-up points.",
  },
  "Convention Trade Show Demo Booth": {
    id: "convention-demo-booth",
    name: "Convention Trade Show Demo Booth",
    profileType: "Sample profile",
    locationType: "Convention or trade show booth",
    shortSummary:
      "Event booth context with demonstration equipment, customer education materials, and common questions about inspections, training, and product safety.",
    label: "Convention Trade Show Demo Booth",
    type: "Convention trade show",
    primaryAudience: "Building Owner and Facility Manager",
    knownSystems: [
      "Fire extinguishers",
      "Smoke alarm and detection examples",
      "Emergency lighting examples",
      "Sprinkler component examples",
      "Special hazard discussion materials",
    ],
    systems: [
      "Fire extinguishers",
      "Smoke alarm and detection examples",
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
        productName: "Smoke alarm and detection examples",
        manufacturer: "First Alert",
        model: "Demo model unknown",
        locationContext: "Product safety talking point examples",
        serviceStatus: "Review product safety examples before event",
        documentationNote: "Verify any product safety examples against official sources.",
        trainingRelevance: "Supports customer education and common detection questions.",
      },
      {
        category: "emergency lighting",
        productName: "Emergency lighting and exit sign examples",
        manufacturer: "Lithonia Lighting",
        model: "Demo model unknown",
        locationContext: "Booth discussion examples",
        serviceStatus: "Prepare documentation talking points",
        documentationNote: "Confirm monthly and annual testing talking points.",
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
      "Training Session",
      "Fire Extinguishers",
      "Fire Alarm and Detection",
      "Special Hazards",
      "Documentation Follow-up",
    ],
    relatedService:
      "Customer education; inspection planning; documentation review; training follow-up; modernization discussion when safety-related",
    serviceHistoryNotes:
      "Event notes should capture attendee questions, product safety concerns, and follow-up owners for internal routing.",
    recommendedPrepFocus:
      "Prepare short customer-friendly explanations, source verification reminders, and follow-up routing for technical questions.",
  },
  "Commercial Office": {
    id: "commercial-office",
    name: "Commercial Office",
    profileType: "Example facility",
    locationType: "Commercial office",
    shortSummary:
      "Commercial office context with alarm and detection, extinguishers, emergency lighting, and sprinkler records for field preparation.",
    label: "Commercial Office",
    type: "Commercial office",
    primaryAudience: "Facility Manager and Building Owner",
    knownSystems: [
      "Fire alarm and detection",
      "Fire extinguishers",
      "Emergency lighting",
      "Sprinkler system",
    ],
    systems: [
      "Fire alarm and detection",
      "Fire extinguishers",
      "Emergency lighting",
      "Sprinkler system",
    ],
    installedEquipment: [
      {
        category: "fire alarm",
        productName: "Office fire alarm and detection system",
        manufacturer: "Honeywell",
        model: "Demo model unknown",
        locationContext: "Lobby, tenant areas, and shared corridors",
        serviceStatus: "Alarm testing records should be reviewed",
        documentationNote: "Confirm panel model, test history, and open issues.",
        trainingRelevance: "Supports office safety and tenant communication.",
      },
      {
        category: "fire extinguisher",
        productName: "Office fire extinguishers",
        manufacturer: "Amerex",
        model: "Demo model unknown",
        locationContext: "Tenant areas and corridors",
        serviceStatus: "Annual inspection status needs confirmation",
        documentationNote: "Verify tags, locations, and inspection history.",
        trainingRelevance: "Supports basic tenant and facilities awareness.",
      },
      {
        category: "emergency lighting",
        productName: "Emergency lighting and exit signs",
        manufacturer: "Lithonia Lighting",
        model: "Demo model unknown",
        locationContext: "Stairwells, exits, and common areas",
        serviceStatus: "Test documentation needs review",
        documentationNote: "Confirm emergency lighting test documentation.",
        trainingRelevance: "Supports egress and facility readiness discussion.",
      },
      {
        category: "sprinkler",
        productName: "Office sprinkler system",
        manufacturer: "Victaulic",
        model: "Demo model unknown",
        locationContext: "Office floors and mechanical areas",
        serviceStatus: "Annual inspection due this quarter",
        documentationNote: "Review inspection notes and open deficiencies.",
        trainingRelevance: "Supports plain-language sprinkler discussion.",
      },
    ],
    upcomingReminder: "Annual inspection and documentation review due this quarter.",
    reminder: "Annual inspection and documentation review due this quarter.",
    trainingEducationNeed:
      "Facilities team may need plain-language guidance on documentation, reporting, and safety awareness.",
    trainingNeed:
      "Facilities team may need plain-language guidance on documentation, reporting, and safety awareness",
    documentationDeficiencyContext:
      "Alarm testing records, emergency lighting documentation, extinguisher tags, sprinkler inspection notes, and open deficiencies.",
    documentationNeed:
      "Alarm testing records, emergency lighting documentation, extinguisher tags, sprinkler inspection notes, and open deficiencies.",
    relatedServiceConsiderations: [
      "Alarm testing review",
      "Emergency lighting inspection",
      "Extinguisher inspection",
      "Sprinkler inspection follow-up",
      "Customer education",
    ],
    relatedServiceLenses: [
      "Inspection",
      "Fire Alarm and Detection",
      "Fire Extinguishers",
      "Emergency Lighting",
      "Fire Sprinklers",
    ],
    relatedService:
      "Alarm testing review; emergency lighting inspection; extinguisher inspection; sprinkler inspection follow-up; customer education",
    serviceHistoryNotes:
      "Office facility notes mention emergency lighting documentation questions and follow-up needs for alarm testing records.",
    recommendedPrepFocus:
      "Review equipment documentation, prepare verification questions, and identify clear customer follow-up points.",
  },
};

const sampleSites = Object.keys(sampleSiteDetails);

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
  "Inspection Prep": {
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
  "Training Prep": {
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
      "Use this for customer training, recruit training, continuing education, certificates, attendance, selected services, and likely questions.",
  },
  "Service Prep": {
    materials: ["Service notes", "Open service items", "Equipment records"],
    checklist: [
      "Review open service items",
      "Confirm affected equipment and access needs",
      "Prepare documentation and follow-up questions",
    ],
    questions: [
      "Which equipment needs service attention?",
      "What documentation or deficiency status needs follow-up?",
    ],
    topics: ["Service scope", "Open items", "Documentation status"],
    followUp: "Capture service findings, unresolved questions, and follow-up ownership.",
    notes:
      "Use this for service visits, open deficiencies, service documentation, and customer follow-up.",
  },
  "Site Survey Prep": {
    materials: ["Facility notes", "Equipment records", "Site survey notes"],
    checklist: [
      "Review known systems and site constraints",
      "Prepare asset and location verification questions",
      "Identify documentation and product details to capture",
    ],
    questions: [
      "Which systems or areas need verification?",
      "What manufacturer, model, or location details are missing?",
    ],
    topics: ["Site conditions", "Asset details", "Follow-up capture"],
    followUp: "Document site observations, missing asset details, and next-step ownership.",
    notes:
      "Use this for site surveys, asset capture, customer planning, and field preparation.",
  },
  "Documentation Review Prep": {
    materials: ["Inspection reports", "Service notes", "Deficiency list"],
    checklist: [
      "Review existing records and missing documentation",
      "Identify open deficiencies and follow-up ownership",
      "Prepare questions for unresolved or inconsistent records",
    ],
    questions: [
      "Which records are incomplete or out of date?",
      "Who owns the next documentation follow-up?",
    ],
    topics: ["Documentation gaps", "Open deficiencies", "Record ownership"],
    followUp: "Assign owners for missing records, unresolved deficiencies, and customer follow-up.",
    notes:
      "Use this for documentation reviews, record gaps, deficiency follow-up, and internal readiness.",
  },
  "Customer Meeting Prep": {
    materials: ["Customer summary", "Recent service activity", "Open issue notes"],
    checklist: [
      "Review recent inspection, service, and documentation activity",
      "Prepare customer-friendly explanation of open items",
      "Identify next steps and internal owners before the meeting",
    ],
    questions: [
      "What does the customer need to decide or understand?",
      "Which technical details need internal verification first?",
    ],
    topics: ["Customer priorities", "Open issues", "Next steps"],
    followUp: "Capture meeting notes, customer questions, and internal follow-up ownership.",
    notes:
      "Use this for customer meetings, account readiness, relationship context, and follow-up planning.",
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
    <ul className="space-y-1.5 sm:space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 sm:gap-2.5">
          <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
          <span className="leading-5">{item}</span>
        </li>
      ))}
    </ul>
  );
};

const compactItems = (items: string[], fallback: string[] = []) =>
  (items.length ? items : fallback)
    .map((item) => item.replace(/^Provided by user\/demo profile:\s*/i, ""))
    .filter((item) => {
      const lower = item.toLowerCase();
      return (
        item &&
        !lower.includes("manual product safety") &&
        !lower.includes("automatic product safety") &&
        !lower.includes("additional notes") &&
        !lower.includes("client site profile, installed equipment, prep context") &&
        !lower.includes("official cpsc") &&
        !lower.includes("cpsc recall")
      );
    })
    .slice(0, 5);

const cleanBriefText = (value: string) =>
  value
    .replace(/^Sample record:\s*/i, "")
    .replace(/^Sample profile:\s*/i, "")
    .replace(/\bSample record needs verification\b/gi, "Verify records before the engagement")
    .replace(/\bSample record\b/gi, "Record")
    .replace(/\bDemo date unknown\b/gi, "Date to verify")
    .replace(/\bDemo model unknown\b/gi, "Model to verify")
    .replace(/\bDemo panel unknown\b/gi, "Panel model to verify")
    .replace(/\bDemo extinguisher type unknown\b/gi, "Extinguisher type to verify")
    .replace(/\bDemo hydrant model unknown\b/gi, "Hydrant model to verify")
    .replace(/\bDemo pump model unknown\b/gi, "Pump model to verify")
    .replace(/\bDemo suppression model unknown\b/gi, "Suppression model to verify")
    .replace(/\bDemo training kit\b/gi, "Training kit")
    .replace(/\s+/g, " ")
    .trim();

const roleSpecificAssetNote = (
  role: UserRole,
  engagement: RoleEngagement,
  record: EquipmentAssetRecord,
) => {
  if (role === "Training") {
    return `Use this ${record.category.toLowerCase()} record for teaching points, likely questions, demonstration context, and documentation reminders for ${engagement}.`;
  }
  if (role === "Inspection") {
    return `Use this ${record.category.toLowerCase()} record to focus field checks, documentation gaps, service status questions, and verification items for ${engagement}.`;
  }
  if (role === "Service") {
    return `Use this ${record.category.toLowerCase()} record to prepare service checks, documentation status, equipment access, and follow-up for ${engagement}.`;
  }
  if (role === "Sales") {
    return `Use this ${record.category.toLowerCase()} record for customer-facing context, open questions, next steps, and safety-focused follow-up for ${engagement}.`;
  }
  return `Use this ${record.category.toLowerCase()} record to summarize readiness, risks, open items, ownership, and follow-up for ${engagement}.`;
};

const PrepBriefSection = ({
  title,
  children,
  tone = "green",
}: {
  title: string;
  children: ReactNode;
  tone?: "green" | "amber" | "red" | "neutral";
}) => {
  const headingClass = {
    green: "text-brand-green",
    amber: "text-brand-warning",
    red: "text-brand-red",
    neutral: "text-brand-charcoal",
  }[tone];

  return (
    <section className="border-t border-brand-gray200/80 py-2 sm:py-3">
      <h3 className={`text-[15px] font-extrabold leading-tight sm:text-lg ${headingClass}`}>
        {title}
      </h3>
      <div className="mt-1.5 text-[13px] leading-5 text-brand-gray700 sm:mt-2 sm:text-[15px]">{children}</div>
    </section>
  );
};

const MarkdownLine = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
};

const MarkdownPacket = ({ markdown }: { markdown: string }) => {
  const elements: ReactNode[] = [];
  let bulletItems: string[] = [];

  const flushBullets = () => {
    if (!bulletItems.length) return;
    const items = bulletItems;
    bulletItems = [];
    elements.push(
      <ul key={`bullets-${elements.length}`} className="list-disc space-y-1.5 pl-5">
        {items.map((item) => (
          <li key={item}>
            <MarkdownLine text={item} />
          </li>
        ))}
      </ul>,
    );
  };

  markdown.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushBullets();
      return;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    const numberedHeadingMatch = line.match(/^\d+\.\s+(.+)$/);
    const bulletMatch = line.match(/^[-*•]\s+(.+)$/);

    if (headingMatch || numberedHeadingMatch) {
      flushBullets();
      const heading = headingMatch?.[2] ?? numberedHeadingMatch?.[1] ?? line;
      elements.push(
        <h3
          key={`heading-${elements.length}`}
          className="pt-3 text-base font-extrabold leading-tight text-brand-charcoal sm:text-lg"
        >
          <MarkdownLine text={heading} />
        </h3>,
      );
      return;
    }

    if (bulletMatch) {
      bulletItems.push(bulletMatch[1]);
      return;
    }

    flushBullets();
    elements.push(
      <p key={`paragraph-${elements.length}`} className="leading-6">
        <MarkdownLine text={line} />
      </p>,
    );
  });

  flushBullets();

  return (
    <div className="space-y-2 text-[13px] leading-5 text-brand-gray700 sm:text-[15px]">
      {elements}
    </div>
  );
};

const selectorHeadingClass =
  "text-lg font-extrabold leading-6 text-brand-greenDark [font-family:var(--font-display)] sm:text-xl";

const ReadinessPacket = ({
  guidance,
  packetMarkdown,
  role,
  roleEngagement,
  selectedTopics,
  audience,
  sampleSite,
  automaticSafetyReview,
  onStartNew,
}: {
  guidance: AiGuidance | null;
  packetMarkdown?: string;
  role: UserRole;
  roleEngagement: RoleEngagement;
  selectedTopics: Topic[];
  audience: Audience;
  sampleSite: string;
  automaticSafetyReview: AutomaticSafetyReview;
  onStartNew: () => void;
}) => {
  const copyText = (text: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(text);
  };
  const shareText = (text: string) => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      void navigator.share({ title: "AI Engagement Readiness Packet", text });
      return;
    }
    copyText(text);
  };

  if (packetMarkdown) {
    const packetText = ["AI Engagement Readiness Packet", packetMarkdown].join("\n\n");

    return (
      <section className="rounded-[16px] border border-brand-gray200 bg-white p-2.5 shadow-sm sm:p-4">
        <div className="border-b border-brand-gray200/80 pb-2 sm:pb-3">
          <h2 className="text-lg font-extrabold leading-tight text-brand-charcoal sm:text-2xl">
            AI Engagement Readiness Packet
          </h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-brand-gray600 sm:text-sm">
            Relevant context, verification items, talking points, and next steps bundled into one easy-to-read report.
          </p>
        </div>

        <div className="space-y-2">
          <MarkdownPacket markdown={packetMarkdown} />

          <p className="border-t border-brand-gray200/80 pt-2 text-[11px] font-semibold leading-4 text-brand-gray500 sm:pt-3 sm:text-xs sm:leading-5">
            This AI-generated packet is preparation support only. Verify official documentation, manufacturer guidance, NFPA standards, applicable codes, company procedures, local AHJ requirements, and qualified professional review before action.
          </p>

          <div className="flex flex-wrap items-center justify-end gap-x-2.5 gap-y-1 border-t border-brand-gray200/80 pt-2 text-xs font-extrabold text-brand-gray700 sm:gap-x-3 sm:pt-3 sm:text-sm">
            <button
              type="button"
              onClick={() => shareText(packetText)}
              className="transition hover:text-brand-green"
            >
              Share
            </button>
            <span className="text-brand-gray200" aria-hidden="true">|</span>
            <button
              type="button"
              onClick={() => window.print()}
              className="transition hover:text-brand-green"
            >
              Print
            </button>
            <span className="text-brand-gray200" aria-hidden="true">|</span>
            <button
              type="button"
              onClick={onStartNew}
              className="transition hover:text-brand-green"
            >
              New Packet
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!guidance) return null;

  const hasPossibleMatches = automaticSafetyReview.possibleMatches.length > 0;
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
    const equipmentRecords = selectedTopics
    .map((topic) => equipmentRecordLibrary[topic])
    .filter(Boolean);
  const simpleLessonPlan =
    guidance.simpleLessonPlan?.length
      ? guidance.simpleLessonPlan
      : [
          "0-5 min: Introduction, audience expectations, and safety boundaries.",
          `5-15 min: Core concept review for ${selectedTopics.join(", ") || "selected equipment and assets"}.`,
          "15-25 min: Demonstration or scenario discussion using approved examples.",
          "25-35 min: Guided practice or Questions.",
          "35-42 min: Knowledge check.",
          "42-45 min: Wrap-up, attendance documentation, and follow-up reminder.",
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
  const productSafetyItems = [
    ...automaticSafetyReview.equipmentChecked.slice(0, 4).map((item) => {
      const label = equipmentLabel(item);
      const hasMatch = automaticSafetyReview.possibleMatches.some((match) =>
        match.equipmentLabel.toLowerCase().includes(label.toLowerCase()),
      );
      return hasMatch
        ? `${label}: Possible product safety match found. Verify manufacturer, model, date code, and installed location before discussing relevance.`
        : `${label}: No obvious public recall match from available demo review. Verify manufacturer documentation if concerns arise.`;
    }),
    hasPossibleMatches
      ? "Possible matches are verification prompts only; do not state that a recall applies until model, manufacturer, date range, and site details confirm it."
      : "No obvious match does not prove there are no applicable recalls; verify official product and manufacturer sources before action.",
  ].slice(0, 5);
  const inspectorStartHere = [
    "Verify model numbers and date codes.",
    "Check open documentation gaps.",
    "Confirm service dates with site contact.",
    ...guidance.recommendedNextBestActions,
  ].slice(0, 5);
  const instructorStartHere = [
    "Confirm audience level and session purpose.",
    "Prepare demo equipment and safety boundaries.",
    "Confirm attendance documentation requirements.",
    ...guidance.recommendedNextBestActions,
  ].slice(0, 5);
  const clientContextItems = compactItems([
    `Facility: ${sampleSite}.`,
    `Team: ${role}.`,
    `Task: ${roleEngagement}.`,
    ...guidance.deficiencyDocumentationFollowUp,
  ]);
  const assetItems = compactItems(
    selectedTopics.map((item) => item),
    guidance.installedEquipmentReview,
  );
  const aiFlaggedItems = compactItems([
    ...guidance.keyAttentionFlags,
    ...missingInformation,
    hasPossibleMatches
      ? "Confirm recall match with model and date code."
      : "Verify official product safety sources.",
  ]).slice(0, 5);
  const checklistItems = compactItems([
    ...guidance.equipmentProductChecklist,
    ...guidance.audienceSpecificTalkingPoints,
  ], [
    "Verify model numbers and date codes.",
    "Check open discrepancies before leaving.",
    "Confirm documentation with site contact.",
  ]);
  const resourcesToReview = compactItems([
    ...guidance.knownSourceFacts,
    "Facility record.",
    "Equipment and asset list.",
    "Training or service history.",
    "Manufacturer instructions.",
    "Applicable codes and NFPA standards.",
  ]);
  const photoBarcodeSignatureItems = [
    "Capture label photos if details are missing.",
    "Note barcode or asset tag if available.",
    "Confirm whether customer sign-off is required.",
    "Attach evidence to the official record.",
  ];
  const relatedServiceItems = [
    ...guidance.relatedServiceGroups.safetyRiskReduction,
    ...guidance.relatedServiceGroups.maintenanceTesting,
    ...guidance.relatedServiceGroups.customerEducation,
    ...guidance.relatedServiceGroups.documentationFollowUp,
    ...guidance.relatedServiceConsiderations,
  ].filter((item, index, list) => item && list.indexOf(item) === index).slice(0, 5);
  const followUpItems = guidance.followUpNoteDraft
    ? [guidance.followUpNoteDraft]
    : ["Document unresolved questions, product verification needs, and the internal owner for follow-up."];
  const gptFollowUpPrompt =
    `Expand this into a 45-minute lesson plan for ${sampleSite}. Include learning objectives, instructor notes, equipment and products to cover, demo steps, questions to ask, safety reminders, attendance documentation, and follow-up items. Use this facility record, equipment and assets, continuing education context, product safety context, and relevant resources.`;
  const previewSnapshot = compactItems(
    role === "Training"
      ? [
          `Training site: ${sampleSite}.`,
          `Task: ${roleEngagement}.`,
          `Audience: ${audience}.`,
        ]
      : [
          `Facility: ${sampleSite}.`,
          `Task: ${roleEngagement}.`,
          `Assets: ${selectedTopics.slice(0, 3).join(", ")}.`,
        ],
  ).slice(0, 3);
  const engagementSummaryItems = compactItems([
    `Purpose: ${roleEngagement}.`,
    `Audience: ${audience}.`,
    role === "Training"
      ? "Primary objective: prepare clear teaching points and safe discussion boundaries."
      : role === "Inspection"
        ? "Primary objective: verify field conditions, documentation gaps, and follow-up needs."
        : "Primary objective: clarify readiness, ownership, and customer communication needs.",
    `Key equipment: ${selectedTopics.slice(0, 3).join(", ") || "selected site equipment"}.`,
    aiFlaggedItems[0] ? `Verify: ${aiFlaggedItems[0]}` : "Verify model, documentation, and official source details.",
  ]);
  const keyResources = resourcesToReview.slice(0, 4);
  const nextStep = followUpItems.slice(0, 1);
  const equipmentRecordSummary = compactItems(
    equipmentRecords.map(
      (record) =>
        `${record.name}: ${record.manufacturer}, ${record.model}, ${record.location}. ${record.verificationNeeded}`,
    ),
    [...selectedTopics, ...guidance.installedEquipmentReview, ...productSafetyItems],
  ).slice(0, 5);
  const recallStatusForRecord = (record: EquipmentAssetRecord) => {
    const category = record.category.toLowerCase();
    const name = record.name.toLowerCase();
    const possibleMatch = automaticSafetyReview.possibleMatches.find((match) => {
      const context = `${match.equipmentLabel} ${match.searchTerm}`.toLowerCase();
      return (
        context.includes(category) ||
        name.split(" ").some((word) => word.length > 4 && context.includes(word))
      );
    });

    return possibleMatch
      ? "Possible recall match - verify model and date code"
      : "No matching live recall found";
  };
  const isMeaningfulEquipmentDetail = (value: string) => {
    const normalized = cleanBriefText(value).toLowerCase();
    return Boolean(
      normalized &&
        !["not listed", "none", "n/a", "not provided", "not specified"].includes(normalized) &&
        !normalized.includes("no confirmed deficiency") &&
        !normalized.includes("no matching live recall found"),
    );
  };
  const equipmentStatusForRecord = (record: EquipmentAssetRecord, hasPossibleRecall: boolean) => {
    const deficiency = cleanBriefText(record.deficiencyStatus).toLowerCase();
    const documentation = cleanBriefText(record.documentationStatus).toLowerCase();
    if (hasPossibleRecall) return "Needs verification";
    if (deficiency && !deficiency.includes("no confirmed deficiency")) return "Open item";
    if (documentation.includes("need") || documentation.includes("missing") || documentation.includes("review")) {
      return "Review records";
    }
    return "Ready to review";
  };
  const equipmentAttentionForRecord = (
    record: EquipmentAssetRecord,
    hasPossibleRecall: boolean,
  ) => {
    const roleItems =
      role === "Service"
        ? [
            cleanBriefText(record.notes),
            cleanBriefText(record.verificationNeeded),
            "Check relevant service documentation before arrival.",
          ]
        : role === "Inspection"
          ? [
              cleanBriefText(record.deficiencyStatus),
              cleanBriefText(record.documentationStatus),
              cleanBriefText(record.verificationNeeded),
            ]
          : role === "Training"
            ? [
                cleanBriefText(record.description),
                "Use this system only as verified teaching context.",
              ]
            : [
                cleanBriefText(record.description),
                "Prepare customer-relevant discussion points only after verification.",
              ];

    return compactItems([
      hasPossibleRecall ? "Verify model and date code before using recall context." : "",
      ...roleItems.filter(isMeaningfulEquipmentDetail),
    ]).slice(0, 2);
  };
  const equipmentReasonForRecord = (
    record: EquipmentAssetRecord,
    hasPossibleRecall: boolean,
  ) => {
    if (role === "Training") {
      return `${record.name} gives the session a concrete example, but product-specific claims need source verification.`;
    }
    if (role === "Service") {
      return `${record.name} may shape the service approach, access needs, and documentation to check before work starts.`;
    }
    if (role === "Sales") {
      return `${record.name} is useful customer context only if open questions and technical details are verified first.`;
    }
    if (hasPossibleRecall) {
      return `${record.name} needs model and date-code verification before recall context is discussed.`;
    }
    return `${record.name} matters because inspection notes, documentation status, or field condition may affect follow-up.`;
  };
  const equipmentDetailsForRecord = (
    record: EquipmentAssetRecord,
    recallStatus: string,
    hasPossibleRecall: boolean,
  ) =>
    [
      hasPossibleRecall ? ["Recall Information", recallStatus] : null,
      isMeaningfulEquipmentDetail(record.documentationStatus)
        ? ["Documentation", cleanBriefText(record.documentationStatus)]
        : null,
      isMeaningfulEquipmentDetail(record.lastInspectionTestDate)
        ? ["Inspection History", cleanBriefText(record.lastInspectionTestDate)]
        : null,
      isMeaningfulEquipmentDetail(record.deficiencyStatus)
        ? ["Deficiency Status", cleanBriefText(record.deficiencyStatus)]
        : null,
      isMeaningfulEquipmentDetail(record.verificationNeeded)
        ? ["Verification Guidance", cleanBriefText(record.verificationNeeded)]
        : null,
      isMeaningfulEquipmentDetail(record.notes) ? ["Notes", cleanBriefText(record.notes)] : null,
      ["Model", cleanBriefText(record.model)],
      ["SKU", cleanBriefText(record.sku)],
      ["Serial Number", cleanBriefText(record.serialNumber)],
      isMeaningfulEquipmentDetail(record.certificationServiceStatus)
        ? ["Certification Status", cleanBriefText(record.certificationServiceStatus)]
        : null,
      ["Role-Specific Note", roleSpecificAssetNote(role, roleEngagement, record)],
      isMeaningfulEquipmentDetail(record.description)
        ? ["Description", cleanBriefText(record.description)]
        : null,
      isMeaningfulEquipmentDetail(record.recallSafetyStatus)
        ? ["Record Safety Note", cleanBriefText(record.recallSafetyStatus)]
        : null,
    ].filter((item): item is [string, string] => Boolean(item));
  const engagementFocus = (() => {
    switch (roleEngagement) {
      case "Inspection":
        return {
          guidance: [
            "Use prior deficiencies and records to decide what needs attention first.",
            "Treat documentation gaps as items to verify, not conclusions to state.",
          ],
          before: [
            "Scan prior deficiencies and due inspection records.",
            "Flag systems with missing or unclear documentation.",
            "Bring questions for model, location, and status gaps.",
          ],
          during: [
            "Verify labels, locations, and visible condition.",
            "Separate confirmed findings from unresolved record questions.",
            "Explain next steps without making unsupported compliance claims.",
          ],
          after: [
            "Record unresolved items and assign follow-up owners.",
            "Route manufacturer or safety questions for qualified review.",
            "Send only verified findings into customer follow-up.",
          ],
          next: [
            "Resolve missing inspection or test documentation.",
            "Confirm exact model, serial number, and service status.",
            "Assign ownership for unresolved deficiencies.",
          ],
        };
      case "Service Follow-Up":
        return {
          guidance: [
            "Start with the reported issue and the equipment most likely involved.",
            "Clarify access, safety, and customer communication before work starts.",
          ],
          before: [
            "Check the reported issue against prior service notes.",
            "Identify affected equipment, access needs, and likely documentation.",
            "Prepare a plain-language status update for the customer.",
          ],
          during: [
            "Confirm the issue is still present before troubleshooting.",
            "Document what was checked, repaired, or left unresolved.",
            "Keep customer updates factual and limited to verified work.",
          ],
          after: [
            "Update service notes with verified findings.",
            "Route open parts, documentation, or quote needs.",
            "Confirm the next customer communication owner.",
          ],
          next: [
            "Confirm whether the reported issue remains open.",
            "Check service history before recommending next steps.",
            "Assign owner for parts, documentation, or customer follow-up.",
          ],
        };
      case "System Testing":
        return {
          guidance: [
            "Prepare test sequence, access needs, and documentation before work starts.",
            "Keep test results and official conclusions tied to verified records.",
          ],
          before: [
            "Confirm test scope, system access, and required witnesses.",
            "Review prior test records and known system issues.",
            "Prepare documentation for results and unresolved items.",
          ],
          during: [
            "Follow approved testing procedures and site safety requirements.",
            "Record results, exceptions, and affected equipment clearly.",
            "Separate observed test results from follow-up interpretation.",
          ],
          after: [
            "Document results and unresolved test issues.",
            "Route failures, impairments, or unclear results for review.",
            "Confirm follow-up owner and customer communication timing.",
          ],
          next: [
            "Confirm test scope and required documentation.",
            "Review prior test records before arrival.",
            "Assign owner for failed or incomplete test items.",
          ],
        };
      case "Site Survey":
      case "Project Coordination":
        return {
          guidance: [
            "Use coordination time to clarify scope, schedule, and handoff risks.",
            "Capture enough verified information to support active project work.",
          ],
          before: [
            "Review scope, schedule, materials, and access assumptions.",
            "Prepare coordination questions for trades or site contacts.",
            "Identify punch list or handoff items needing ownership.",
          ],
          during: [
            "Confirm field conditions, schedule blockers, and trade coordination needs.",
            "Document unresolved scope, material, or access issues.",
            "Keep customer updates tied to verified job status.",
          ],
          after: [
            "Update project notes with owners and timing.",
            "Route open coordination issues to the right internal owner.",
            "Confirm handoff or punch list follow-up.",
          ],
          next: [
            "Confirm owner for each schedule, material, or handoff issue.",
            "Review site constraints before next project step.",
            "Document active project risks and next actions.",
          ],
        };
      case "Site Survey":
        return {
          guidance: [
            "Use the visit to close gaps in asset details and field conditions.",
            "Capture enough verified information to support future service or planning.",
          ],
          before: [
            "Identify systems with missing manufacturer or model details.",
            "Prepare location and access questions.",
            "Plan label photos or notes where allowed.",
          ],
          during: [
            "Capture manufacturer, model, location, and condition.",
            "Note access issues and documentation gaps.",
            "Photograph labels where site procedures allow.",
          ],
          after: [
            "Update records with verified field details.",
            "Flag incomplete assets for follow-up.",
            "Route manufacturer questions for review.",
          ],
          next: [
            "Capture missing model, SKU, serial, and location details.",
            "Photograph equipment labels where permitted.",
            "Update asset records with verified information.",
          ],
        };
      case "Training Session":
        return {
          guidance: [
            "Turn facility systems into clear teaching examples.",
            "Set boundaries around product, recall, and site-specific claims.",
          ],
          before: [
            "Confirm audience level and training purpose.",
            "Choose examples that match the systems being discussed.",
            "Check product or manufacturer context before teaching.",
          ],
          during: [
            "Explain system purpose in plain language.",
            "Use verified examples and avoid unconfirmed site claims.",
            "Capture questions that need technical follow-up.",
          ],
          after: [
            "Document attendance or completion needs.",
            "Send unanswered technical questions to the right reviewer.",
            "Share approved follow-up materials only.",
          ],
          next: [
            "Confirm training objectives, materials, and attendance needs.",
            "Review product and manufacturer context before instruction.",
            "Prepare customer-friendly talking points and follow-up notes.",
          ],
        };
      case "Plan Review":
        return {
          guidance: [
            "Use the review to separate verified drawings, specs, and records from open questions.",
            "Tie missing documentation or design assumptions to ownership and next action.",
          ],
          before: [
            "Gather drawings, specs, reports, service notes, and deficiency records.",
            "Mark missing or inconsistent documentation.",
            "List ownership questions before the review.",
          ],
          during: [
            "Compare available records against open items.",
            "Confirm owners for missing documentation.",
            "Avoid compliance implications until records are verified.",
          ],
          after: [
            "Assign owners for missing records.",
            "Update status only after qualified review.",
            "Send a concise follow-up summary.",
          ],
          next: [
            "Review missing records and open documentation gaps.",
            "Confirm the owner for each unresolved item.",
            "Prepare follow-up notes after internal review.",
          ],
        };
      case "Customer Meeting":
        return {
          guidance: [
            "Use recent activity and open items to shape the conversation.",
            "Keep technical or safety claims tied to verified information.",
          ],
          before: [
            "Review recent service, inspection, and documentation activity.",
            "Choose the few open items worth discussing.",
            "Decide which questions need internal verification first.",
          ],
          during: [
            "Discuss priorities, open questions, and practical next steps.",
            "Separate verified facts from follow-up items.",
            "Capture decisions and customer questions.",
          ],
          after: [
            "Send meeting recap and internal handoff notes.",
            "Assign owners for customer questions and open issues.",
            "Confirm timing for the next communication.",
          ],
          next: [
            "Prepare customer-facing talking points before the meeting.",
            "Verify technical details before making claims.",
            "Assign follow-up ownership for customer questions.",
          ],
        };
      default:
        return {
          guidance: [
            "Review inspection and test dates, service status, and documentation gaps.",
            "Verify certification, deficiency, and safety status before conclusions.",
            "Confirm model, serial, and location details while onsite.",
          ],
          before: [
            "Review equipment records and open documentation gaps.",
            "Check last inspection and test dates and service status.",
            "Prepare model, serial, and location verification questions.",
          ],
          during: [
            "Verify labels, locations, service status, and visible condition.",
            "Document deficiencies and unresolved record questions.",
            "Avoid official conclusions until details are confirmed.",
          ],
          after: [
            "Update documentation gaps and follow-up owners.",
            "Route safety and manufacturer questions for qualified review.",
            "Confirm the next service or customer communication step.",
          ],
          next: [
            "Confirm exact model, serial number, and service status.",
            "Review missing inspection or test documentation.",
            "Capture unresolved deficiencies and assign follow-up ownership.",
          ],
        };
    }
  })();
  const roleGuidanceItems = compactItems([
    role === "Training"
      ? "Use lesson-plan-style guidance for the selected training audience."
      : role === "Inspection"
        ? "Use onsite guidance for field verification and documentation."
        : role === "Service"
          ? "Use service visit guidance for equipment access, service checks, documentation, and follow-up."
          : "Use customer-facing guidance for account context, open questions, and next steps.",
    ...engagementFocus.guidance,
    ...guidance.audienceSpecificTalkingPoints,
  ]).slice(0, 5);
  const beforeItems = engagementFocus.before;
  const duringItems = engagementFocus.during;
  const afterItems = engagementFocus.after;
  const actionLabels = (() => {
    switch (roleEngagement) {
      case "Inspection":
        return {
          before: "Before the Inspection",
          during: "During the Inspection",
          after: "After the Inspection",
        };
      case "Service Follow-Up":
        return {
          before: "Before Arrival",
          during: "During the Follow-Up",
          after: "After the Follow-Up",
        };
      case "System Testing":
        return {
          before: "Before Testing",
          during: "During Testing",
          after: "After Testing",
        };
      case "Training Session":
        return {
          before: "Before the Session",
          during: "During the Session",
          after: "After the Session",
        };
      case "Customer Meeting":
        return {
          before: "Before the Meeting",
          during: "During the Meeting",
          after: "After the Meeting",
        };
      case "Plan Review":
        return {
          before: "Before the Review",
          during: "During the Review",
          after: "After the Review",
        };
      case "Site Survey":
        return {
          before: "Before the Survey",
          during: "During the Survey",
          after: "After the Survey",
        };
      case "Project Coordination":
        return {
          before: "Before Coordination",
          during: "During Coordination",
          after: "After Coordination",
        };
      default:
        return {
          before: "Before",
          during: "During",
          after: "After",
        };
    }
  })();
  const recommendedNextSteps = compactItems([
    ...engagementFocus.next,
    ...guidance.recommendedNextBestActions,
    "Confirm exact equipment model, serial number, and service status.",
    "Review missing documentation before the engagement.",
    "Assign follow-up ownership for open verification items.",
  ]).slice(0, 5);
  const packetEnvironmentFocusItems = (environmentFocusMap[sampleSite] ?? []).slice(0, 2);
  const readinessSummaryItems = (() => {
    const roleLead =
      role === "Training"
        ? "This packet should help turn facility systems into teachable examples without overstating unverified details."
        : role === "Inspection"
          ? "The main value is knowing which records, systems, and deficiencies deserve attention first."
          : role === "Service"
            ? "The work hinges on understanding the reported issue, prior service context, and safe troubleshooting boundaries."
            : "The meeting should center on verified customer history, open questions, and clear next steps.";
    return compactItems([
      `The ${role} team is preparing for ${roleEngagement} in the ${sampleSite} site type.`,
      roleLead,
      packetEnvironmentFocusItems[0]
        ? `Environment context: ${packetEnvironmentFocusItems.join("; ")}.`
        : "",
      role === "Training"
        ? "Product, manufacturer, and recall context should be treated as source material to verify before instruction."
        : "Anything involving code, compliance, safety, recall, or manufacturer guidance should stay in verification until confirmed.",
      role === "Sales"
        ? "A useful outcome is a customer-ready conversation with internal follow-up ownership."
        : "A useful outcome is knowing what to check, explain, and route for follow-up.",
    ]).slice(0, 3);
  })();
  const preparationPriorityItems = (() => {
    const rolePriorities =
      role === "Training"
        ? [
            "Match examples to the audience level and equipment being discussed.",
            "Bring approved references, photos, or demo materials.",
            "Plan likely questions and the safest answer boundaries.",
          ]
        : role === "Inspection"
          ? [
              "Check prior deficiencies and documentation gaps before arrival.",
              "Identify systems that need field verification.",
              "Plan how to explain unresolved items in plain language.",
            ]
          : role === "Service"
            ? [
                "Compare the reported issue with prior service history.",
                "Check relevant manuals, parts, and access needs.",
                "Plan the troubleshooting sequence and safety checks.",
              ]
            : [
                "Review customer history and recent activity.",
                "Choose the most useful discussion points.",
                "Identify follow-up opportunities and internal owners.",
              ];

    return compactItems([
      ...rolePriorities,
      ...packetEnvironmentFocusItems.map((item) => `Account for ${item}.`),
      engagementFocus.next[0],
    ]).slice(0, 4);
  })();
  const roleBriefConfig = (() => {
    if (role === "Training") {
      return {
        summaryTitle: "Summary",
        contextTitle: "Audience and Learning Objectives",
        prepTitle: "Training Flow / Topic Outline",
        discussionTitle: "Teaching Points and Likely Questions",
        verifyTitle: "Items to Verify Before Teaching",
        followTitle: "Follow-up Resources",
        showEquipment: false,
        contextItems: compactItems([
          `Audience: ${audience}.`,
          `Facility: ${sampleSite}.`,
          `Training focus: ${roleEngagement}.`,
          "Objective: prepare clear teaching points, examples, and safe discussion boundaries.",
          ...(guidance.standardsObjectiveAlignment ?? []),
        ]).slice(0, 5),
        prepItems: compactItems([
          ...(guidance.simpleLessonPlan ?? []),
          ...guidance.trainingOrEventPrepNotes,
          ...materialsEquipmentNeeded,
          "Use equipment only as supporting teaching context.",
        ]).slice(0, 6),
        discussionItems: compactItems([
          "Explain what the system is intended to do in everyday language.",
          "Use examples that match the audience's actual responsibilities.",
          "When a question becomes site-specific, move it to follow-up instead of guessing.",
          "Point attendees to approved references, not memory or assumptions.",
        ]).slice(0, 5),
        verifyItems: compactItems([
          "Confirm training objective and audience level before setting the lesson depth.",
          "Verify manufacturer or recall context before using it as an example.",
          "Confirm attendance, certificate, or completion documentation requirements.",
          "Check reference materials against approved company or manufacturer sources.",
        ]).slice(0, 5),
        followItems: compactItems([
          "Confirm training objectives, audience level, materials, and any site-specific details that need verification before teaching.",
          "Send unanswered questions to the appropriate internal reviewer.",
          "Provide approved reference materials after the session.",
        ]).slice(0, 5),
      };
    }

    if (role === "Service") {
      return {
        summaryTitle: "Summary",
        contextTitle: "Work Order and Service Context",
        prepTitle: "Troubleshooting Notes",
        discussionTitle: "Customer Communication Notes",
        verifyTitle: "Safety and Verification Steps",
        followTitle: "Service Follow-up",
        showEquipment: true,
        contextItems: compactItems([
          `Facility: ${sampleSite}.`,
          `Reported service context: ${roleEngagement}.`,
          `Prior service history: ${guidance.providedDemoProfileContext?.[0] || "review available service notes"}.`,
          `Relevant equipment: ${selectedTopics.join(", ") || "equipment details need review"}.`,
        ]).slice(0, 5),
        prepItems: compactItems([
          "Review prior service history before arrival.",
          "Check relevant manuals, diagrams, and technical notes.",
          "Prepare likely parts, tools, and documentation questions.",
          ...roleGuidanceItems,
        ]).slice(0, 6),
        discussionItems: compactItems([
          "Explain the reported issue in terms of what has been checked and what is still unknown.",
          "Tell the customer when a finding requires parts, documentation, or internal review.",
          "Avoid committing to a fix until access, condition, and service history are verified.",
        ]).slice(0, 4),
        verifyItems: compactItems([
          "Confirm the reported issue is still active before troubleshooting.",
          "Verify safe access and affected equipment before starting work.",
          "Check prior service history before recommending parts or repair steps.",
          "Confirm documentation status before closing or escalating the service item.",
        ]).slice(0, 5),
        followItems: compactItems([
          "Document repair summary and unresolved issues.",
          ...recommendedNextSteps,
        ]).slice(0, 5),
      };
    }

    if (role === "Sales") {
      return {
        summaryTitle: "Summary",
        contextTitle: "Customer and Account Context",
        prepTitle: "Meeting Preparation",
        discussionTitle: "Meeting Talking Points",
        verifyTitle: "Open Questions to Verify",
        followTitle: "Follow-up Opportunities",
        showEquipment: false,
        contextItems: compactItems([
          `Customer/facility: ${sampleSite}.`,
          `Recent activity: ${guidance.deficiencyDocumentationFollowUp?.[0] || "review recent inspection and service activity"}.`,
          `Open issues: ${aiFlaggedItems.slice(0, 2).join("; ")}.`,
          `Upcoming work: ${recommendedNextSteps[0] || "confirm next step"}.`,
        ]).slice(0, 5),
        prepItems: compactItems([
          "Review recent inspection and service activity.",
          "Prepare customer-friendly summary of open issues.",
          "Identify internal follow-up owners before the meeting.",
          ...roleGuidanceItems,
        ]).slice(0, 5),
        discussionItems: compactItems([
          "Lead with recent activity and what it means for the customer.",
          "Separate confirmed facts from items Ryan still needs to verify.",
          "Ask what outcome the customer needs from the meeting.",
          "Close with ownership and timing for follow-up.",
        ]).slice(0, 5),
        verifyItems: compactItems([
          "Verify technical details before making customer-facing claims.",
          "Confirm which open issues are still active.",
          "Check whether product or manufacturer guidance is relevant before discussing it.",
          "Confirm internal owner before promising follow-up.",
        ]).slice(0, 5),
        followItems: compactItems([
          "Capture customer recap and internal handoff notes.",
          ...recommendedNextSteps,
        ]).slice(0, 5),
      };
    }

    return {
      summaryTitle: "Summary",
      contextTitle: "Site and Inspection Context",
      prepTitle: "Inspection Preparation",
      discussionTitle: "Customer Explanation Points",
      verifyTitle: "Items to Verify Onsite",
      followTitle: "Recommended Follow-up",
      showEquipment: true,
      contextItems: compactItems([
        `Facility: ${sampleSite}.`,
        `Inspection engagement: ${roleEngagement}.`,
        `Systems to inspect: ${selectedTopics.join(", ") || "selected systems"}.`,
        ...guidance.deficiencyDocumentationFollowUp,
      ]).slice(0, 5),
      prepItems: compactItems([
        "Review previous inspection history and open deficiencies.",
        ...roleGuidanceItems,
      ]).slice(0, 5),
      discussionItems: compactItems([
        "Explain what was observed and what still needs verification.",
        "Describe deficiencies in plain language without making unsupported conclusions.",
        "Tell the customer which documentation or site details affect next steps.",
        "Route code, compliance, safety, and manufacturer questions through qualified review.",
      ]).slice(0, 5),
      verifyItems: compactItems([
        "Confirm exact equipment model, serial number, and location before finalizing findings.",
        "Verify documentation status before discussing compliance implications.",
        "Check whether prior deficiencies remain open.",
        "Confirm manufacturer or recall context before customer discussion.",
      ]).slice(0, 5),
      followItems: recommendedNextSteps,
    };
  })();
  const packetText = [
    "AI Engagement Readiness Packet",
    "Summary",
    ...readinessSummaryItems.map((item) => `- ${item}`),
    "",
    "Preparation Priorities",
    ...preparationPriorityItems.map((item) => `- ${item}`),
    "",
    actionLabels.before,
    ...beforeItems.map((item) => `- ${item}`),
    "",
    actionLabels.during,
    ...duringItems.map((item) => `- ${item}`),
    "",
    actionLabels.after,
    ...afterItems.map((item) => `- ${item}`),
    "",
    "Items Requiring Verification",
    ...roleBriefConfig.verifyItems.map((item) => `- ${item}`),
    ...(roleBriefConfig.showEquipment
      ? [
          "",
          "Equipment Briefing",
          ...equipmentRecords.map(
            (record) =>
              `- ${record.name}: ${equipmentReasonForRecord(record, recallStatusForRecord(record).startsWith("Possible"))}`,
          ),
        ]
      : []),
    "",
    roleBriefConfig.discussionTitle,
    ...roleBriefConfig.discussionItems.map((item) => `- ${item}`),
    "",
    roleBriefConfig.followTitle,
    ...roleBriefConfig.followItems.map((item, index) => `${index + 1}. ${item}`),
  ].join("\n");
  return (
    <section className="rounded-[16px] border border-brand-gray200 bg-white p-2.5 shadow-sm sm:p-4">
      <div className="border-b border-brand-gray200/80 pb-2 sm:pb-3">
        <h2 className="text-lg font-extrabold leading-tight text-brand-charcoal sm:text-2xl">
          AI Engagement Readiness Packet
        </h2>
        <p className="mt-1 text-xs font-semibold leading-5 text-brand-gray600 sm:text-sm">
          Relevant context, verification items, talking points, and next steps bundled into one easy-to-read report.
        </p>
      </div>

      <div className="space-y-0.5">
        <PrepBriefSection title="Summary" tone="green">
          <PacketList items={readinessSummaryItems} tone="green" />
        </PrepBriefSection>

        <PrepBriefSection title="Preparation Priorities" tone="green">
          <PacketList items={preparationPriorityItems} tone="green" />
        </PrepBriefSection>

        <section className="border-t border-brand-gray200/80 py-2 sm:py-3">
          <div className="grid gap-2 sm:gap-3 lg:grid-cols-3">
            {[
              [actionLabels.before, beforeItems],
              [actionLabels.during, duringItems],
              [actionLabels.after, afterItems],
            ].map(([label, items]) => (
              <article key={label as string} className="rounded-xl border border-brand-gray200 bg-white p-2.5 sm:p-3">
                <h3 className="text-[15px] font-extrabold leading-tight text-brand-charcoal sm:text-base">
                  {label as string}
                </h3>
                <div className="mt-1.5 text-[13px] leading-5 text-brand-gray700 sm:mt-2 sm:text-sm">
                  <PacketList items={items as string[]} tone="neutral" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-brand-gray200/80 py-2 sm:py-3">
          <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/5 p-2.5 sm:p-3">
            <h3 className="text-[15px] font-extrabold leading-tight text-brand-charcoal sm:text-lg">
              Items Requiring Verification
            </h3>
            <div className="mt-1.5 text-[13px] leading-5 text-brand-gray700 sm:mt-2 sm:text-[15px]">
              <PacketList items={roleBriefConfig.verifyItems} tone="red" />
            </div>
          </div>
        </section>

        {roleBriefConfig.showEquipment ? (
          <PrepBriefSection title="Equipment Briefing" tone="neutral">
            <div className="grid gap-2 sm:gap-3">
              {equipmentRecords.map((record) => {
                const recallStatus = recallStatusForRecord(record);
                const hasPossibleRecall = recallStatus.startsWith("Possible");
                const statusLabel = equipmentStatusForRecord(record, hasPossibleRecall);
                const attentionItems = equipmentAttentionForRecord(record, hasPossibleRecall);
                const detailItems = equipmentDetailsForRecord(record, recallStatus, hasPossibleRecall);
                const engagementReason = equipmentReasonForRecord(record, hasPossibleRecall);
                return (
                  <article
                    key={record.serialNumber}
                    className="rounded-xl border border-brand-gray200 bg-white p-2.5 sm:p-3"
                  >
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                      <div>
                        <h4 className="text-[15px] font-extrabold leading-5 text-brand-charcoal sm:text-base">
                          {record.name}
                        </h4>
                        <p className="mt-0.5 text-xs font-semibold text-brand-gray600 sm:mt-1 sm:text-sm">
                          {cleanBriefText(record.manufacturer)} - {cleanBriefText(record.location)}
                        </p>
                      </div>
                      <p
                        className={`w-fit rounded-full px-2.5 py-1 text-xs font-extrabold ${
                          statusLabel === "Needs verification"
                            ? "bg-brand-orange/10 text-brand-orange"
                            : statusLabel === "Open item" || statusLabel === "Review records"
                              ? "bg-brand-orange/10 text-brand-orange"
                            : "bg-brand-greenSoft text-brand-greenDark"
                        }`}
                      >
                        {statusLabel}
                      </p>
                    </div>

                    <p className="mt-1.5 text-[13px] leading-5 text-brand-gray700 sm:mt-2 sm:text-sm">
                      {engagementReason}
                    </p>

                    {attentionItems.length ? (
                      <ul className="mt-1.5 space-y-1 text-[13px] leading-5 text-brand-gray700 sm:mt-2 sm:text-sm">
                        {attentionItems.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    <details className="mt-2 rounded-lg border border-brand-gray200 bg-brand-gray100/60 px-2.5 py-2 text-[13px] text-brand-gray700 sm:mt-3 sm:px-3 sm:text-sm">
                      <summary className="cursor-pointer font-extrabold text-brand-greenDark">
                        Show details
                      </summary>
                      <dl className="mt-2 grid gap-x-5 gap-y-1.5 sm:mt-3 sm:grid-cols-2 sm:gap-y-2">
                        {detailItems.map(([label, value]) => (
                          <div key={label} className="border-t border-brand-gray200/80 pt-1.5 first:border-t-0 first:pt-0">
                            <dt className="text-xs font-extrabold text-brand-gray500">
                              {label}
                            </dt>
                            <dd className="mt-0.5">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </details>
                  </article>
                );
              })}
              {!equipmentRecords.length ? (
                <PacketList items={equipmentRecordSummary} tone="neutral" />
              ) : null}
            </div>
          </PrepBriefSection>
        ) : null}

        <PrepBriefSection title={roleBriefConfig.discussionTitle} tone="neutral">
          <PacketList items={roleBriefConfig.discussionItems} tone="neutral" />
        </PrepBriefSection>

        <PrepBriefSection title={roleBriefConfig.followTitle} tone="green">
          <ol className="list-decimal space-y-2 pl-5 leading-5">
            {roleBriefConfig.followItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </PrepBriefSection>

        <p className="border-t border-brand-gray200/80 pt-2 text-[11px] font-semibold leading-4 text-brand-gray500 sm:pt-3 sm:text-xs sm:leading-5">
          This demonstration uses representative sample information to illustrate how AI can organize preparation materials from connected business systems.
        </p>

        <div className="flex flex-wrap items-center justify-end gap-x-2.5 gap-y-1 border-t border-brand-gray200/80 pt-2 text-xs font-extrabold text-brand-gray700 sm:gap-x-3 sm:pt-3 sm:text-sm">
          <button
            type="button"
            onClick={() => shareText(packetText)}
            className="transition hover:text-brand-green"
          >
            Share
          </button>
          <span className="text-brand-gray200" aria-hidden="true">|</span>
          <button
            type="button"
            onClick={() => window.print()}
            className="transition hover:text-brand-green"
          >
            Print
          </button>
          <span className="text-brand-gray200" aria-hidden="true">|</span>
          <button
            type="button"
            onClick={onStartNew}
            className="transition hover:text-brand-green"
          >
            New Packet
          </button>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const [engagementType, setEngagementType] =
    useState<EngagementType>("Training Prep");
  const [role, setRole] = useState<UserRole>("Training");
  const [roleEngagement, setRoleEngagement] = useState<RoleEngagement>(
    "Training Session",
  );
  const [selectedTopics, setSelectedTopics] =
    useState<Topic[]>(instructorDefaultTopics);
  const [audience, setAudience] = useState<Audience>("Fire Department");
  const [selectedSampleSite, setSelectedSampleSite] = useState(
    "Fire Department and Public Safety",
  );
  const [selectedServiceLensId, setSelectedServiceLensId] = useState(serviceLenses[0].id);
  const [briefAction, setBriefAction] = useState<BriefAction>("training_prep");
  const [guidance, setGuidance] = useState<AiGuidance | null>(null);
  const [packetMarkdown, setPacketMarkdown] = useState("");
  const [summarizingId, setSummarizingId] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [automaticSafetyReview, setAutomaticSafetyReview] =
    useState<AutomaticSafetyReview>(() =>
      emptySafetyReview(
        sampleSiteDetails["Fire Department Recruit Training Site"].installedEquipment,
      ),
    );
  const [autoReviewLoading, setAutoReviewLoading] = useState(false);
  const [, setAutoReviewCheckedAt] = useState<Date | null>(null);

  const prep = prepByEngagement[engagementType];
  const selectedSampleSiteKey = locationSampleMap[selectedSampleSite] ?? selectedSampleSite;
  const selectedSiteDetails =
    sampleSiteDetails[selectedSampleSiteKey] ??
    sampleSiteDetails["Fire Department Recruit Training Site"];
  const selectedClientRecord =
    clientRecords[selectedSampleSiteKey] ?? {
      equipmentAssets:
        equipmentAssetsBySite[selectedSampleSiteKey] ?? selectedSiteDetails.knownSystems,
      serviceTrainingHistory: [selectedSiteDetails.serviceHistoryNotes],
      openItems: [
        selectedSiteDetails.documentationDeficiencyContext,
        selectedSiteDetails.recommendedPrepFocus,
      ],
      trainingContext: [
        selectedSiteDetails.trainingEducationNeed,
        selectedSiteDetails.primaryAudience,
      ],
      resources: [
        {
          title: "Facility Profile",
          type: "Facility Context",
          description: selectedSiteDetails.shortSummary,
          action: "Sample context",
        },
        {
          title: "Equipment List",
          type: "Equipment Context",
          description: selectedSiteDetails.systems.join(", "),
          action: "Sample context",
        },
      ],
    };
  const selectedServiceLens =
    serviceLenses.find((lens) => lens.id === selectedServiceLensId) ?? serviceLenses[0];
  const applyRoleEngagement = (nextEngagement: RoleEngagement) => {
    setRoleEngagement(nextEngagement);
    setGuidance(null);
    setPacketMarkdown("");

    if (nextEngagement === "Inspection") {
      setEngagementType("Inspection Prep");
      setBriefAction("inspection_prep");
      return;
    }

    if (
      nextEngagement === "Service Follow-Up" ||
      nextEngagement === "System Testing"
    ) {
      setEngagementType("Service Prep");
      setBriefAction("follow_up_notes");
      return;
    }

    if (nextEngagement === "Training Session") {
      setEngagementType("Training Prep");
      setBriefAction("training_prep");
      return;
    }

    if (nextEngagement === "Plan Review") {
      setEngagementType("Documentation Review Prep");
      setBriefAction("follow_up_notes");
      return;
    }

    if (nextEngagement === "Customer Meeting") {
      setEngagementType("Customer Meeting Prep");
      setBriefAction("customer_talking_points");
      return;
    }

    if (nextEngagement === "Project Coordination") {
      setEngagementType("Site Survey Prep");
      setBriefAction("customer_talking_points");
      return;
    }

    setEngagementType("Site Survey Prep");
    setBriefAction(role === "Sales" ? "customer_talking_points" : "inspection_prep");
  };
  const applyRole = (nextRole: UserRole) => {
    setRole(nextRole);
    setGuidance(null);
    setPacketMarkdown("");

    if (nextRole === "Training") {
      setRoleEngagement("Training Session");
      setEngagementType("Training Prep");
      setAudience("Fire Department");
      setBriefAction("training_prep");
      setSelectedTopics(instructorDefaultTopics);
      setSelectedSampleSite("Fire Department and Public Safety");
      return;
    }

    if (nextRole === "Sales") {
      setRoleEngagement("Customer Meeting");
      setEngagementType("Customer Meeting Prep");
      setAudience("Prospective Customer");
      setBriefAction("customer_talking_points");
      setSelectedTopics(equipmentAssetsBySite[selectedSampleSiteKey] ?? inspectorDefaultTopics);
      return;
    }

    if (nextRole === "Service") {
      setRoleEngagement("Service Follow-Up");
      setEngagementType("Service Prep");
      setAudience("Facility Manager");
      setBriefAction("follow_up_notes");
      setSelectedTopics(equipmentAssetsBySite[selectedSampleSiteKey] ?? inspectorDefaultTopics);
      return;
    }

    if (nextRole === "Design & Engineering") {
      setRoleEngagement("Plan Review");
      setEngagementType("Site Survey Prep");
      setAudience("Facility Manager");
      setBriefAction("customer_talking_points");
      setSelectedTopics(equipmentAssetsBySite[selectedSampleSiteKey] ?? inspectorDefaultTopics);
      return;
    }

    if (nextRole === "Construction") {
      setRoleEngagement("Project Coordination");
      setEngagementType("Site Survey Prep");
      setAudience("Facility Manager");
      setBriefAction("follow_up_notes");
      setSelectedTopics(equipmentAssetsBySite[selectedSampleSiteKey] ?? inspectorDefaultTopics);
      return;
    }

    setRoleEngagement("Inspection");
    setEngagementType("Inspection Prep");
    setAudience("Internal Inspector");
    setBriefAction("inspection_prep");
    setSelectedTopics(inspectorDefaultTopics);
    setSelectedSampleSite("Specialty");
  };
  const sourceContextUsed = [
    "Automatic product safety review based on selected facility equipment",
    `Team: ${role}`,
    `Task: ${roleEngagement}`,
    `Equipment and Assets: ${selectedTopics.join(", ") || "None selected"}`,
    "Packet is based on selected task, site type context, equipment records, documentation needs, and training context.",
    `Facility profile: ${selectedSiteDetails.label}`,
    `Preparation focus: ${selectedServiceLens.label}`,
    `Internal prep category: ${engagementType}`,
    `Audience: ${audience}`,
    "Demo source notes: service environment brief, source hierarchy, documentation/deficiency follow-up logic, and training/event prep frameworks",
  ];
  const teamFocusItems = (teamFocusMap[role] ?? teamFocusMap.Training).slice(0, 2);
  const environmentFocusItems = (environmentFocusMap[selectedSampleSite] ?? []).slice(0, 2);
  const engagementFocusItems = (
    engagementTypeFocusMap[roleEngagement] ??
    engagementTypeFocusMap["Training Session"]
  ).slice(0, 2);
  const setupFocusItems = Array.from(
    new Set([
      ...teamFocusItems,
      ...environmentFocusItems,
      ...engagementFocusItems,
      ...selectedClientRecord.openItems.slice(0, 1).map((item) => item.toLowerCase()),
    ]),
  ).slice(0, 6);

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
            "No obvious safety match in sample context is not proof that no issue exists.",
            "Verify official sources, manufacturer instructions, site records, and company procedures before action.",
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
              "Product/manufacturer context could not be fully checked.",
              "Verify product safety context against official sources and manufacturer documentation.",
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

  const generateSummary = async (
    recall: RecallResult | null = null,
    action = briefAction,
  ) => {
    setGuidance(null);
    setPacketMarkdown("");
    setSummaryError("");
    setSummarizingId(recall?.id ?? "engagement-packet");
    setBriefAction(action);

    const generateLocalFallback = async () => {
      const fallbackResponse = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recall,
          role,
          roleEngagement,
          selectedTopics,
          equipmentAssetRecords: selectedTopics
            .map((topic) => equipmentRecordLibrary[topic])
            .filter(Boolean),
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
            clientRecord: selectedClientRecord,
            equipmentAssetRecords: selectedTopics
              .map((topic) => equipmentRecordLibrary[topic])
              .filter(Boolean),
            materialsResourcesIncluded: selectedClientRecord.resources.map(
              (resource) => `${resource.title}: ${resource.description}`,
            ),
            responsibleAiLabels: knowledgeBase.responsibleAiLabels,
            sourceHierarchy: [
              "Official product and manufacturer notices",
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
      const fallbackPayload = await fallbackResponse.json();
      if (!fallbackResponse.ok) {
        throw new Error(
          fallbackPayload.error || "Unable to generate the preparation brief right now.",
        );
      }
      setGuidance(fallbackPayload.guidance);
    };

    try {
      const response = await fetch("/api/generate-packet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team: role,
          environment: selectedSampleSite,
          engagementType: roleEngagement,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to generate the packet right now.");
      }
      setPacketMarkdown(payload.packetMarkdown);
    } catch (error) {
      const aiError =
        error instanceof Error
          ? error.message
          : "Unable to generate the packet right now.";

      try {
        await generateLocalFallback();
        setSummaryError(`${aiError} Showing the local fallback packet for review.`);
      } catch (fallbackError) {
        setSummaryError(
          fallbackError instanceof Error
            ? fallbackError.message
            : "Unable to generate the preparation brief right now.",
        );
      }
    } finally {
      setSummarizingId("");
    }
  };

  const startNewPacket = () => {
    setEngagementType("Training Prep");
    setRole("Training");
    setRoleEngagement("Training Session");
    setSelectedTopics(instructorDefaultTopics);
    setAudience("Fire Department");
    setSelectedSampleSite("Fire Department and Public Safety");
    setSelectedServiceLensId(serviceLenses[0].id);
    setBriefAction("training_prep");
    setGuidance(null);
    setPacketMarkdown("");
    setSummaryError("");
    setAdditionalNotes("");
  };

  return (
    <main className="min-h-screen bg-brand-gray100 text-brand-charcoal">
      <header className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-2 sm:px-6 sm:py-3">
          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
            <Image
              src="/ryan-logo.png"
              alt="Ryan Fire Protection, Inc."
              width={1280}
              height={551}
              priority
              className="h-auto w-24 shrink-0 sm:w-40"
            />
            <div>
              <h1 className="text-[20px] font-extrabold leading-tight text-brand-green sm:text-[28px]">
                Engagement Assistant
              </h1>
            </div>
          </div>
          <h2 className="mx-auto mt-1.5 max-w-2xl text-center text-lg font-extrabold leading-tight text-brand-charcoal sm:mt-2 sm:text-2xl">
            Turn scattered details into a clear AI-generated packet.
          </h2>
          <p className="mx-auto mt-1 max-w-2xl text-center text-[13px] leading-5 text-brand-gray700 sm:text-base sm:leading-6">
            Select the team, site type, and task. The assistant organizes the most relevant preparation details before work starts.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-1.5 sm:px-6 sm:py-2.5">
        <section className="rounded-[16px] border border-brand-gray200 bg-white p-3 shadow-sm sm:p-5">
          <div>
            <div className="grid gap-5 sm:gap-6">
              <div>
                <h3 className={selectorHeadingClass}>
                  Select Team
                </h3>
                <div className="mt-2.5 grid grid-cols-1 gap-1.5 sm:mt-3 sm:grid-cols-2 sm:gap-2 md:grid-cols-3">
                  {([
                    "Inspection",
                    "Service",
                    "Training",
                    "Sales",
                    "Design & Engineering",
                    "Construction",
                  ] as UserRole[]).map((item) => {
                    const selected = role === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => applyRole(item)}
                        className={`min-h-10 rounded-xl border px-2 py-2 text-center text-[13px] font-extrabold transition [font-family:var(--font-display)] sm:min-h-11 sm:px-3 sm:py-2.5 sm:text-sm ${
                          selected
                            ? "border-brand-green bg-brand-green text-white"
                            : "border-brand-gray200 bg-white text-brand-charcoal hover:border-brand-green hover:bg-brand-greenSoft"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className={selectorHeadingClass}>
                  Select Site Type
                </h3>
                <div className="mt-2.5 grid grid-cols-1 gap-1.5 sm:mt-3 sm:grid-cols-2 sm:gap-2 md:grid-cols-4">
                  {visibleSiteOptions.map((item) => {
                    const selected = selectedSampleSite === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setSelectedSampleSite(item.value);
                          setSelectedTopics(
                            equipmentAssetsBySite[locationSampleMap[item.value] ?? item.value] ??
                              instructorDefaultTopics,
                          );
                          setGuidance(null);
                          setPacketMarkdown("");
                        }}
                        className={`min-h-10 rounded-xl border px-2 py-2 text-left text-[13px] font-extrabold leading-4 transition [font-family:var(--font-display)] sm:min-h-14 sm:px-2.5 sm:py-2 sm:text-[13px] sm:leading-4 ${
                          selected
                            ? "border-brand-green bg-brand-green text-white"
                            : "border-brand-gray200 bg-white text-brand-charcoal hover:border-brand-green hover:bg-brand-greenSoft"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className={selectorHeadingClass}>
                  Select Task
                </h3>
                <div className="mt-2.5 grid grid-cols-1 gap-1.5 sm:mt-3 sm:grid-cols-2 sm:gap-2 md:grid-cols-4">
                  {roleEngagementOptions.map((item) => {
                    const selected = roleEngagement === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => applyRoleEngagement(item)}
                        className={`min-h-10 rounded-xl border px-2 py-2 text-left text-[13px] font-extrabold leading-4 transition [font-family:var(--font-display)] sm:min-h-14 sm:px-2.5 sm:py-2 sm:text-[13px] sm:leading-4 ${
                          selected
                            ? "border-brand-green bg-brand-green text-white"
                            : "border-brand-gray200 bg-white text-brand-charcoal hover:border-brand-green hover:bg-brand-greenSoft"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-brand-green/25 bg-brand-greenSoft/70 px-2.5 py-2 text-[13px] leading-5 text-brand-gray700 sm:mt-4 sm:px-3 sm:py-3 sm:text-sm sm:leading-6">
              <p className="font-extrabold text-brand-charcoal">
                This packet will focus on:
              </p>
              <ul className="mt-1.5 grid gap-x-4 gap-y-0.5 sm:mt-2 sm:grid-cols-2 sm:gap-y-1">
                {setupFocusItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden">
              <h2 className="text-lg font-black text-brand-charcoal">
                Hidden Client Context
              </h2>
              <p className="mt-1 text-xs font-bold leading-5 text-brand-gray500">
                Sample record data used for this demo.
              </p>
              <div className="mt-2 grid gap-2 text-sm text-brand-gray700 sm:grid-cols-2">
                {[
                  ["Equipment and Assets", selectedClientRecord.equipmentAssets],
                  ["Service and Training History", selectedClientRecord.serviceTrainingHistory],
                  ["Open Items", selectedClientRecord.openItems],
                  ["Training and CE Context", selectedClientRecord.trainingContext],
                ].map(([label, values]) => (
                  <div
                    key={label as string}
                    className="rounded-xl border border-brand-gray200 bg-white px-3 py-2"
                  >
                    <p className="text-xs font-black text-brand-charcoal">
                      {label as string}
                    </p>
                    <p className="mt-1 leading-5">
                      {(values as string[]).join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden">
              <h2 className="text-lg font-black text-brand-charcoal">
                Hidden Resource Context
              </h2>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {selectedClientRecord.resources.map((resource) => (
                  <div
                    key={resource.title}
                    className="rounded-xl border border-brand-gray200 bg-white px-3 py-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-extrabold text-brand-charcoal">
                          {resource.title}
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-brand-green">
                          {resource.type}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-lg border border-brand-gray200 px-2 py-1 text-[11px] font-black text-brand-gray700">
                        {resource.action}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-brand-gray700">
                      {resource.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center sm:mt-5 sm:justify-end">
            <button
              type="button"
              onClick={() => void generateSummary(null, briefAction)}
              disabled={Boolean(summarizingId)}
              className="w-full rounded-xl bg-brand-green px-5 py-3 text-center text-[15px] font-extrabold text-white transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:bg-brand-gray500 sm:w-auto sm:py-4 sm:text-base [font-family:var(--font-display)]"
            >
              {summarizingId
                ? "Generating Brief..."
                : "Generate Packet"}
            </button>
          </div>

          {summarizingId === "engagement-packet" ? (
            <div className="mt-4 rounded-xl border border-brand-gray200 bg-white p-3 sm:mt-5 sm:p-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-brand-gray100">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-green" />
              </div>
              <p className="mt-2 text-sm font-extrabold text-brand-charcoal sm:mt-3">
                Building a preparation packet from the selected team, site type, and task.
              </p>
            </div>
          ) : null}

          {summaryError ? (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-brand-red sm:mt-4 sm:p-4">
              {summaryError}
            </div>
          ) : null}

          <div className="mt-4 sm:mt-6">
            {guidance || packetMarkdown ? (
              <ReadinessPacket
                guidance={guidance}
                packetMarkdown={packetMarkdown}
                role={role}
                roleEngagement={roleEngagement}
                selectedTopics={selectedTopics}
                audience={audience}
                sampleSite={selectedSampleSite}
                automaticSafetyReview={automaticSafetyReview}
                onStartNew={startNewPacket}
              />
            ) : null}
          </div>
        </section>


      </div>

      <footer className="mx-auto mt-1 max-w-3xl px-5 pb-5 pt-1 text-center text-[11px] leading-4 text-brand-gray500 sm:px-6">
        © 2026 Amy Melangton. Proof of concept for demonstration purposes only.
      </footer>
    </main>
  );
}

