"use client";

import { useEffect, useState } from "react";
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
  | "Customer Meeting"
  | "Event Prep"
  | "Documentation Follow-up";

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
  | "Inspector"
  | "Instructor"
  | "Service Manager"
  | "Account Manager";

type RoleEngagement =
  | "Inspection Readiness"
  | "Service Follow-up"
  | "Documentation Review"
  | "Asset Survey"
  | "Customer Training"
  | "Construction Coordination";

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
  {
    label: "Fire Department Recruit Training Site",
    value: "Fire Department Recruit Training Site",
  },
  { label: "Municipal Facilities Account", value: "Municipal Facilities Account" },
  { label: "Healthcare Facility ITM Review", value: "Healthcare Facility ITM Review" },
  {
    label: "Education Campus Training Profile",
    value: "Education Campus Facilities Training",
  },
];

const roleEngagementOptions: RoleEngagement[] = [
  "Inspection Readiness",
  "Service Follow-up",
  "Documentation Review",
  "Asset Survey",
  "Customer Training",
  "Construction Coordination",
];

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
        description: "Account, equipment, and open items.",
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
      "Inspection Readiness",
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
      "Customer Training",
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
      "Deficiency follow-up",
    ],
    relatedServiceLenses: [
      "Inspection Readiness",
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
      "Customer Training",
      "Fire Extinguishers",
      "Fire Alarm and Detection",
      "Fire Sprinklers",
      "Inspection Readiness",
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
      "Inspection Readiness",
      "Customer Training",
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
      "Customer Training",
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
  "Customer Meeting": {
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
  "Event Prep": {
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
  "Documentation Follow-up": {
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
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
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
  if (role === "Instructor") {
    return `Use this ${record.category.toLowerCase()} record for teaching points, likely questions, demonstration context, and documentation reminders for ${engagement}.`;
  }
  if (role === "Inspector") {
    return `Use this ${record.category.toLowerCase()} record to focus field checks, documentation gaps, service status questions, and verification items for ${engagement}.`;
  }
  if (role === "Service Manager") {
    return `Use this ${record.category.toLowerCase()} record to coordinate ownership, service readiness, documentation status, and follow-up for ${engagement}.`;
  }
  if (role === "Account Manager") {
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
  children: React.ReactNode;
  tone?: "green" | "amber" | "red" | "neutral";
}) => {
  const headingClass = {
    green: "text-brand-green",
    amber: "text-brand-warning",
    red: "text-brand-red",
    neutral: "text-brand-charcoal",
  }[tone];

  return (
    <section className="border-t border-brand-gray200/80 py-3">
      <h3 className={`text-base font-extrabold leading-tight sm:text-lg ${headingClass}`}>
        {title}
      </h3>
      <div className="mt-2 text-sm leading-5 text-brand-gray700 sm:text-[15px]">{children}</div>
    </section>
  );
};

const ReadinessPacket = ({
  guidance,
  role,
  roleEngagement,
  selectedTopics,
  audience,
  sampleSite,
  automaticSafetyReview,
  onStartNew,
}: {
  guidance: AiGuidance | null;
  role: UserRole;
  roleEngagement: RoleEngagement;
  selectedTopics: Topic[];
  audience: Audience;
  sampleSite: string;
  automaticSafetyReview: AutomaticSafetyReview;
  onStartNew: () => void;
}) => {
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
    `Client site: ${sampleSite}.`,
    `Role: ${role}.`,
    `Engagement: ${roleEngagement}.`,
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
    "Client site record.",
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
    `Expand this into a 45-minute lesson plan for ${sampleSite}. Include learning objectives, instructor notes, equipment and products to cover, demo steps, questions to ask, safety reminders, attendance documentation, and follow-up items. Use this client site record, equipment and assets, continuing education context, product safety context, and relevant resources.`;
  const previewSnapshot = compactItems(
    role === "Instructor"
      ? [
          `Training site: ${sampleSite}.`,
          `Engagement: ${roleEngagement}.`,
          `Audience: ${audience}.`,
        ]
      : [
          `Client site: ${sampleSite}.`,
          `Engagement: ${roleEngagement}.`,
          `Assets: ${selectedTopics.slice(0, 3).join(", ")}.`,
        ],
  ).slice(0, 3);
  const engagementSummaryItems = compactItems([
    `Purpose: ${roleEngagement}.`,
    `Audience: ${audience}.`,
    role === "Instructor"
      ? "Primary objective: prepare clear teaching points and safe discussion boundaries."
      : role === "Inspector"
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
  const engagementFocus = (() => {
    switch (roleEngagement) {
      case "Inspection Readiness":
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
      case "Service Follow-up":
        return {
          guidance: [
            "Start with open deficiencies and affected equipment.",
            "Clarify what can be explained to the customer now.",
            "Identify the owner for each follow-up action.",
          ],
          before: [
            "Review deficiency status for affected equipment.",
            "Check service notes, quote status, and documentation gaps.",
            "Prepare customer-friendly explanation of unresolved items.",
          ],
          during: [
            "Confirm affected equipment and current condition.",
            "Separate verified facts from items still under review.",
            "Capture customer questions and ownership for next steps.",
          ],
          after: [
            "Send follow-up items to the responsible internal owner.",
            "Update documentation with verified deficiency status.",
            "Confirm next customer communication before action.",
          ],
          next: [
            "Confirm which deficiencies remain open.",
            "Assign an owner for service or documentation follow-up.",
            "Prepare a customer-facing explanation after internal review.",
          ],
        };
      case "Documentation Review":
        return {
          guidance: [
            "Focus on missing records and documentation readiness.",
            "Check certification and service status against available records.",
            "Flag records needing correction or qualified review.",
          ],
          before: [
            "Collect inspection, test, service, and deficiency records.",
            "Identify missing documentation before the review.",
            "Prepare questions about certification and service status.",
          ],
          during: [
            "Compare records against equipment and location details.",
            "Mark corrections and missing information clearly.",
            "Confirm who owns each documentation follow-up.",
          ],
          after: [
            "Summarize missing records and required corrections.",
            "Route compliance questions through qualified review.",
            "Share only reviewed customer-facing notes.",
          ],
          next: [
            "List missing records and documentation corrections.",
            "Confirm certification and service status for each record.",
            "Assign follow-up ownership for unresolved documentation gaps.",
          ],
        };
      case "Asset Survey":
        return {
          guidance: [
            "Prioritize complete asset details and field notes.",
            "Capture manufacturer, model, SKU, serial, location, and condition.",
            "Photograph labels or asset tags when details are missing.",
          ],
          before: [
            "Prepare the asset capture list and open questions.",
            "Review which systems need manufacturer and model confirmation.",
            "Plan photos or notes for missing equipment details.",
          ],
          during: [
            "Capture manufacturer, model, SKU, serial, and location.",
            "Note visible condition, access issues, and documentation gaps.",
            "Photograph labels where allowed by site procedures.",
          ],
          after: [
            "Update asset records with verified details.",
            "Flag incomplete records for follow-up.",
            "Route product or manufacturer questions for review.",
          ],
          next: [
            "Capture missing model, SKU, serial, and location details.",
            "Photograph equipment labels where permitted.",
            "Update the sample asset record with verified information.",
          ],
        };
      case "Customer Training":
        return {
          guidance: [
            "Turn equipment records into plain-language teaching points.",
            "Prepare likely questions and demonstration boundaries.",
            "Verify site-specific details before making customer claims.",
          ],
          before: [
            "Confirm audience level and training purpose.",
            "Prepare equipment examples, talking points, and questions.",
            "Review documentation and product safety context before teaching.",
          ],
          during: [
            "Explain what each system does in practical terms.",
            "Use verified examples and avoid unconfirmed site-specific claims.",
            "Capture attendance, questions, and follow-up items.",
          ],
          after: [
            "Document attendance and unresolved questions.",
            "Send verification items to the appropriate internal reviewer.",
            "Prepare any customer follow-up summary.",
          ],
          next: [
            "Confirm training objectives, materials, and attendance needs.",
            "Review product and manufacturer context before instruction.",
            "Prepare customer-friendly talking points and follow-up notes.",
          ],
        };
      case "Construction Coordination":
      default:
        return {
          guidance: [
            "Clarify scope, assumptions, site constraints, and coordination needs.",
            "Verify equipment context before design or construction discussion.",
            "Identify follow-up questions for qualified review.",
          ],
          before: [
            "Review scope assumptions and known equipment records.",
            "Prepare questions about site constraints and coordination needs.",
            "Identify materials or equipment details needing verification.",
          ],
          during: [
            "Separate confirmed scope from open design questions.",
            "Capture coordination needs, constraints, and responsible owners.",
            "Avoid technical determinations without qualified review.",
          ],
          after: [
            "Document open scope and coordination questions.",
            "Route design, engineering, or code questions for review.",
            "Confirm the next coordination step.",
          ],
          next: [
            "Confirm scope assumptions and site constraints.",
            "Verify equipment and material details before coordination.",
            "Assign owners for open design or construction questions.",
          ],
        };
    }
  })();
  const roleGuidanceItems = compactItems([
    role === "Instructor"
      ? "Use lesson-plan-style guidance for the selected training audience."
      : role === "Inspector"
        ? "Use onsite guidance for field verification and documentation."
        : role === "Service Manager"
          ? "Use service coordination guidance for readiness, ownership, documentation, and follow-up."
          : "Use customer-facing guidance for open questions and next steps.",
    ...engagementFocus.guidance,
    ...guidance.audienceSpecificTalkingPoints,
  ]).slice(0, 5);
  const beforeItems = engagementFocus.before;
  const duringItems = engagementFocus.during;
  const afterItems = engagementFocus.after;
  const whatToSayItems = compactItems([
    role === "Instructor"
      ? "Today we are using the available equipment information to review how sprinkler systems, alarm and detection devices, and demonstration equipment fit into a fire protection discussion."
      : role === "Inspector"
        ? "I am reviewing sample equipment and documentation context, and I will verify model, service, and documentation details before making any official conclusion."
        : role === "Account Manager"
          ? "This conversation should focus on what the available information shows, what still needs verification, and the next practical step for a safety-focused follow-up."
          : "This review should clarify readiness, open verification items, documentation status, and who owns the next follow-up step.",
    "The main goal is to understand what each system does, what documentation matters, and what details need to be verified before making site-specific claims.",
  ]).slice(0, 3);
  const recommendedNextSteps = compactItems([
    ...engagementFocus.next,
    ...guidance.recommendedNextBestActions,
    "Confirm exact equipment model, serial number, and service status.",
    "Review missing documentation before the engagement.",
    "Assign follow-up ownership for open verification items.",
  ]).slice(0, 5);
  const packetText = [
    "AI Preparation Brief",
    "Engagement Summary",
    ...engagementSummaryItems.map((item) => `- ${item}`),
    "",
    "Equipment Briefing",
    ...equipmentRecords.flatMap((record) => [
      `- ${record.name}`,
      `  Manufacturer: ${cleanBriefText(record.manufacturer)}`,
      `  Model: ${cleanBriefText(record.model)}`,
      `  Location: ${cleanBriefText(record.location)}`,
      `  Last Inspection or Service: ${cleanBriefText(record.lastInspectionTestDate)}`,
      `  Documentation Status: ${cleanBriefText(record.documentationStatus)}`,
      `  Recall and Safety Status: ${cleanBriefText(record.recallSafetyStatus)}`,
      `  Deficiency Status: ${cleanBriefText(record.deficiencyStatus)}`,
      `  Certification Status: ${cleanBriefText(record.certificationServiceStatus)}`,
      `  Role-Specific Note: ${roleSpecificAssetNote(role, roleEngagement, record)}`,
      `  Description: ${cleanBriefText(record.description)}`,
      `  SKU: ${cleanBriefText(record.sku)}`,
      `  Serial Number: ${cleanBriefText(record.serialNumber)}`,
    ]),
    "",
    "Preparation Notes",
    ...roleGuidanceItems.map((item) => `- ${item}`),
    ...["Before", ...beforeItems, "During", ...duringItems, "After", ...afterItems].map((item) => `- ${item}`),
    "",
    "Discussion Points",
    ...whatToSayItems.map((item) => `- ${item}`),
    "",
    "Items to Verify",
    ...aiFlaggedItems.slice(0, 5).map((item) => `- ${item}`),
    "",
    "Recommended Follow-up",
    ...recommendedNextSteps.map((item, index) => `${index + 1}. ${item}`),
  ].join("\n");
  const copyText = (text: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(text);
  };
  const shareText = (text: string) => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      void navigator.share({ title: "AI Preparation Brief", text });
      return;
    }
    copyText(text);
  };

  return (
    <section className="rounded-[16px] border border-brand-gray200 bg-white p-3 shadow-sm sm:p-4">
      <div className="border-b border-brand-gray200/80 pb-3">
        <h2 className="text-xl font-extrabold leading-tight text-brand-charcoal sm:text-2xl">
          AI Preparation Brief
        </h2>
        <p className="mt-1 text-sm font-semibold leading-5 text-brand-gray600">
          What to review, verify, and discuss before walking into the engagement.
        </p>
      </div>

      <div className="space-y-0.5">
        <PrepBriefSection
          title="Engagement Summary"
          tone="green"
        >
          <PacketList items={engagementSummaryItems} tone="green" />
        </PrepBriefSection>

        <PrepBriefSection title="Equipment Briefing" tone="neutral">
          <div className="grid gap-3">
            {equipmentRecords.map((record) => (
              <article
                key={record.serialNumber}
                className="rounded-xl border border-brand-gray200 bg-white p-3"
              >
                <h4 className="text-base font-extrabold leading-5 text-brand-charcoal">
                  {record.name}
                </h4>
                <dl className="mt-3 grid gap-x-5 gap-y-2 text-sm text-brand-gray700 sm:grid-cols-2">
                  {[
                    ["Status", `${cleanBriefText(record.certificationServiceStatus)}; ${cleanBriefText(record.deficiencyStatus)}`],
                    ["Manufacturer", cleanBriefText(record.manufacturer)],
                    ["Model", cleanBriefText(record.model)],
                    ["Location", cleanBriefText(record.location)],
                    ["Last Inspection or Service", cleanBriefText(record.lastInspectionTestDate)],
                    ["Documentation Status", cleanBriefText(record.documentationStatus)],
                    ["Recall and Safety Status", cleanBriefText(record.recallSafetyStatus)],
                    ["Deficiency Status", cleanBriefText(record.deficiencyStatus)],
                    ["Certification Status", cleanBriefText(record.certificationServiceStatus)],
                    ["Role-Specific Note", roleSpecificAssetNote(role, roleEngagement, record)],
                    ["Description", cleanBriefText(record.description)],
                    ["SKU", cleanBriefText(record.sku)],
                    ["Serial Number", cleanBriefText(record.serialNumber)],
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[8rem_1fr] gap-2 border-t border-brand-gray200/80 pt-1.5 first:border-t-0 first:pt-0 sm:grid-cols-[9.5rem_1fr]">
                      <dt className="text-xs font-extrabold text-brand-gray500">
                        {label}
                      </dt>
                      <dd className="mt-0.5 text-brand-gray700">{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
            {!equipmentRecords.length ? (
              <PacketList items={equipmentRecordSummary} tone="neutral" />
            ) : null}
          </div>
        </PrepBriefSection>

        <PrepBriefSection title="Preparation Notes" tone="green">
          <PacketList items={roleGuidanceItems} tone="green" />
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-brand-gray200 bg-brand-gray100/60 p-3">
              <p className="mb-2 text-sm font-extrabold text-brand-charcoal">Before</p>
              <PacketList items={beforeItems} tone="neutral" />
            </div>
            <div className="rounded-xl border border-brand-gray200 bg-brand-gray100/60 p-3">
              <p className="mb-2 text-sm font-extrabold text-brand-charcoal">During</p>
              <PacketList items={duringItems} tone="neutral" />
            </div>
            <div className="rounded-xl border border-brand-gray200 bg-brand-gray100/60 p-3">
              <p className="mb-2 text-sm font-extrabold text-brand-charcoal">After</p>
              <PacketList items={afterItems} tone="neutral" />
            </div>
          </div>
        </PrepBriefSection>

        <PrepBriefSection title="Discussion Points" tone="neutral">
          <PacketList items={whatToSayItems} tone="neutral" />
        </PrepBriefSection>

        <section className="border-t border-brand-gray200/80 py-3">
          <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/5 p-3">
            <h3 className="text-base font-extrabold leading-tight text-brand-charcoal sm:text-lg">
              Items to Verify
            </h3>
            <div className="mt-2 text-sm leading-5 text-brand-gray700 sm:text-[15px]">
              <PacketList items={aiFlaggedItems.slice(0, 5)} tone="red" />
            </div>
          </div>
        </section>

        <PrepBriefSection title="Recommended Follow-up" tone="green">
          <ol className="list-decimal space-y-2 pl-5 leading-5">
            {recommendedNextSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </PrepBriefSection>

        <p className="border-t border-brand-gray200/80 pt-3 text-xs font-semibold leading-5 text-brand-gray500">
          This demonstration uses representative sample information to illustrate how AI can organize preparation materials from connected business systems.
        </p>

        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 border-t border-brand-gray200/80 pt-3 text-sm font-extrabold text-brand-gray700">
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
  const [role, setRole] = useState<UserRole>("Instructor");
  const [roleEngagement, setRoleEngagement] = useState<RoleEngagement>(
    "Customer Training",
  );
  const [selectedTopics, setSelectedTopics] =
    useState<Topic[]>(instructorDefaultTopics);
  const [audience, setAudience] = useState<Audience>("Instructor");
  const [selectedSampleSite, setSelectedSampleSite] = useState(
    "Fire Department Recruit Training Site",
  );
  const [selectedServiceLensId, setSelectedServiceLensId] = useState(serviceLenses[0].id);
  const [briefAction, setBriefAction] = useState<BriefAction>("training_prep");
  const [guidance, setGuidance] = useState<AiGuidance | null>(null);
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
  const selectedSiteDetails = sampleSiteDetails[selectedSampleSite];
  const selectedClientRecord =
    clientRecords[selectedSampleSite] ??
    clientRecords["Fire Department Recruit Training Site"];
  const selectedServiceLens =
    serviceLenses.find((lens) => lens.id === selectedServiceLensId) ?? serviceLenses[0];
  const applyRole = (nextRole: UserRole) => {
    setRole(nextRole);
    setGuidance(null);

    if (nextRole === "Instructor") {
      setRoleEngagement("Customer Training");
      setEngagementType("Training Prep");
      setAudience("Instructor");
      setBriefAction("training_prep");
      setSelectedTopics(instructorDefaultTopics);
      setSelectedSampleSite("Fire Department Recruit Training Site");
      return;
    }

    if (nextRole === "Account Manager") {
      setRoleEngagement("Customer Training");
      setEngagementType("Customer Meeting");
      setAudience("Prospective Customer");
      setBriefAction("customer_talking_points");
      setSelectedTopics(equipmentAssetsBySite[selectedSampleSite] ?? inspectorDefaultTopics);
      return;
    }

    if (nextRole === "Service Manager") {
      setRoleEngagement("Service Follow-up");
      setEngagementType("Documentation Follow-up");
      setAudience("Facility Manager");
      setBriefAction("follow_up_notes");
      setSelectedTopics(equipmentAssetsBySite[selectedSampleSite] ?? inspectorDefaultTopics);
      return;
    }

    setRoleEngagement("Inspection Readiness");
    setEngagementType("Inspection Prep");
    setAudience("Internal Inspector");
    setBriefAction("inspection_prep");
    setSelectedTopics(inspectorDefaultTopics);
    setSelectedSampleSite("Municipal Facilities Account");
  };
  const sourceContextUsed = [
    "Automatic product safety review based on selected site equipment",
    `Role: ${role}`,
    `Engagement: ${roleEngagement}`,
    `Equipment and Assets: ${selectedTopics.join(", ") || "None selected"}`,
    "Packet is based on selected engagement, sample site context, equipment records, documentation needs, and training context.",
    `Customer Site Profile: ${selectedSiteDetails.label}`,
    `Preparation focus: ${selectedServiceLens.label}`,
    `Engagement type: ${engagementType}`,
    `Audience: ${audience}`,
    "Demo source notes: service environment brief, source hierarchy, documentation/deficiency follow-up logic, and training/event prep frameworks",
  ];

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
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to generate the preparation brief right now.");
      }
      setGuidance(payload.guidance);
    } catch (error) {
      setSummaryError(
        error instanceof Error
          ? error.message
          : "Unable to generate the preparation brief right now.",
      );
    } finally {
      setSummarizingId("");
    }
  };

  const startNewPacket = () => {
    setEngagementType("Training Prep");
    setRole("Instructor");
    setRoleEngagement("Customer Training");
    setSelectedTopics(instructorDefaultTopics);
    setAudience("Instructor");
    setSelectedSampleSite("Fire Department Recruit Training Site");
    setSelectedServiceLensId(serviceLenses[0].id);
    setBriefAction("training_prep");
    setGuidance(null);
    setSummaryError("");
    setAdditionalNotes("");
  };

  return (
    <main className="min-h-screen bg-brand-gray100 text-brand-charcoal">
      <header className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Image
              src="/ryan-logo.png"
              alt="Ryan Fire Protection, Inc."
              width={1280}
              height={551}
              priority
              className="h-auto w-32 shrink-0 sm:w-44"
            />
            <div>
              <h1 className="text-[22px] font-extrabold leading-tight text-brand-green sm:text-[30px]">
                Engagement Assistant
              </h1>
            </div>
          </div>
          <h2 className="mt-3 text-xl font-extrabold leading-tight text-brand-charcoal sm:text-2xl">
            Spend less time searching. More time preparing.
          </h2>
          <p className="mt-2 text-sm leading-6 text-brand-gray700 sm:text-base">
            Generate an AI-powered preparation packet that brings together the most relevant information before an inspection, training session, service visit, or customer meeting.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
        <section className="rounded-[16px] border border-brand-gray200 bg-white p-3 shadow-sm sm:p-5">
          <div className="mb-3 h-1 w-14 rounded-md bg-brand-orange" aria-hidden="true" />
          <div className="grid gap-5">
            <div>
              <h2 className="text-lg font-extrabold text-brand-greenDark">
                1. Choose Sample Scenario
              </h2>
              <p className="mt-1 text-xs font-semibold text-brand-gray500">
                Select the sample engagement context for the readiness packet.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {visibleSiteOptions.map((item) => {
                  const selected = selectedSampleSite === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setSelectedSampleSite(item.value);
                        setSelectedTopics(
                          equipmentAssetsBySite[item.value] ?? instructorDefaultTopics,
                        );
                        setGuidance(null);
                      }}
                      className={`min-h-10 rounded-xl border px-3 py-2.5 text-left text-sm font-extrabold leading-5 transition [font-family:var(--font-display)] ${
                        selected
                          ? "border-brand-green bg-brand-green text-white"
                          : "border-brand-gray200 bg-white text-brand-charcoal hover:border-brand-green hover:bg-brand-greenSoft"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span>{item.label}</span>
                        {selected ? (
                          <span className="text-xs font-extrabold" aria-hidden="true">
                            Selected
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 className="text-lg font-extrabold text-brand-greenDark">2. Choose Role</h2>
                <p className="mt-1 text-xs font-semibold text-brand-gray500">
                  Select the employee role this packet should support.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(["Instructor", "Inspector", "Service Manager", "Account Manager"] as UserRole[]).map((item) => {
                    const selected = role === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => applyRole(item)}
                        className={`min-h-10 rounded-xl border px-3 py-2.5 text-center text-sm font-extrabold transition [font-family:var(--font-display)] ${
                          selected
                            ? "border-brand-green bg-brand-green text-white"
                            : "border-brand-gray200 bg-white text-brand-charcoal hover:border-brand-green hover:bg-brand-greenSoft"
                        }`}
                      >
                        <span className="inline-flex items-center justify-center gap-2">
                          {selected ? (
                            <span className="text-xs font-extrabold" aria-hidden="true">
                              Selected
                            </span>
                          ) : null}
                          <span>{item}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-brand-greenDark">
                  3. Choose Engagement Type
                </h2>
                <p className="mt-1 text-xs font-semibold text-brand-gray500">
                  Select what the employee is preparing to do.
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
                  {roleEngagementOptions.map((item) => {
                    const selected = roleEngagement === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setRoleEngagement(item);
                          setGuidance(null);
                        }}
                        className={`min-h-10 rounded-xl border px-3 py-2.5 text-left text-sm font-extrabold leading-5 transition [font-family:var(--font-display)] ${
                          selected
                            ? "border-brand-green bg-brand-green text-white"
                            : "border-brand-gray200 bg-white text-brand-charcoal hover:border-brand-green hover:bg-brand-greenSoft"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span>{item}</span>
                          {selected ? (
                            <span className="text-xs font-extrabold" aria-hidden="true">
                              Selected
                            </span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-brand-green/30 bg-brand-greenSoft px-3 py-3 text-sm leading-6 text-brand-gray700">
              <p className="font-extrabold text-brand-charcoal">
                Your packet includes:
              </p>
              <ul className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-2">
                {[
                  "Site overview",
                  "Equipment summary",
                  "Preparation checklist",
                  "Product guidance",
                  "Discussion points",
                ].map((item) => (
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

          <div className="mt-5 flex justify-center sm:justify-end">
            <button
              type="button"
              onClick={() => void generateSummary(null, briefAction)}
              disabled={Boolean(summarizingId)}
              className="w-full rounded-xl bg-brand-green px-5 py-4 text-center text-base font-extrabold text-white transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:bg-brand-gray500 sm:w-auto [font-family:var(--font-display)]"
            >
              {summarizingId
                ? "Generating Brief..."
                : "Generate AI Preparation Brief"}
            </button>
          </div>

          {summarizingId === "engagement-packet" ? (
            <div className="mt-5 rounded-xl border border-brand-gray200 bg-white p-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-brand-gray100">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-green" />
              </div>
              <p className="mt-3 text-sm font-extrabold text-brand-charcoal">
                Building a preparation brief from the selected scenario, perspective, and engagement.
              </p>
            </div>
          ) : null}

          {summaryError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-brand-red">
              {summaryError}
            </div>
          ) : null}

          <div className="mt-6">
            {guidance ? (
              <ReadinessPacket
                guidance={guidance}
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

