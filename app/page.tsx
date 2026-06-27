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
  | "Inspection / Testing"
  | "Maintenance Review"
  | "Site Walkthrough"
  | "Documentation Review"
  | "Continuing Education Prep"
  | "Training Session"
  | "Recruit Training"
  | "Customer Education";

type Topic =
  | "Fire Sprinkler System"
  | "Fire Alarm / Detection"
  | "Fire Extinguishers"
  | "Emergency Lighting"
  | "Fire Hydrants"
  | "Special Hazards"
  | "Training Props / Demonstration Equipment";

type BriefAction =
  | "inspection_prep"
  | "training_prep"
  | "event_prep"
  | "customer_talking_points"
  | "follow_up_notes";

type Workflow =
  | "Training / Lesson Plan"
  | "Continuing Education Prep"
  | "Inspection Prep"
  | "Site Walkthrough Prep"
  | "Documentation Review"
  | "Product Safety Review";

type PrepSection =
  | "Lesson Plan"
  | "Teaching Points"
  | "Questions to Ask"
  | "Materials Needed"
  | "Attendance Notes"
  | "Product / Manufacturer Updates"
  | "Follow-Up Actions"
  | "CE Prep Outline"
  | "Learning Objectives"
  | "Attendance / Certification Notes"
  | "Checklist Questions"
  | "Inspection Checklist"
  | "Items to Verify"
  | "Equipment / Assets"
  | "Documentation Follow-Up"
  | "Product Safety Context"
  | "Customer Talking Points"
  | "Resources to Review"
  | "Walkthrough Checklist"
  | "Customer Questions"
  | "Documentation Checklist"
  | "Missing Information"
  | "Records to Review"
  | "Manufacturer / Model Verification"
  | "Official Source Reminder";

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

const workflows: Workflow[] = [
  "Training / Lesson Plan",
  "Continuing Education Prep",
  "Inspection Prep",
  "Site Walkthrough Prep",
  "Documentation Review",
  "Product Safety Review",
];

const workflowConfig: Record<
  Workflow,
  {
    role: UserRole;
    roleEngagement: RoleEngagement;
    engagementType: EngagementType;
    audience: Audience;
    briefAction: BriefAction;
    previewTitle: string;
    packetTitle: string;
    recommended: PrepSection[];
    optional: PrepSection[];
  }
> = {
  "Training / Lesson Plan": {
    role: "Instructor",
    roleEngagement: "Continuing Education Prep",
    engagementType: "Teach / train",
    audience: "Recruit Class",
    briefAction: "training_prep",
    previewTitle: "Training Preview",
    packetTitle: "Training Prep Packet",
    recommended: [
      "Lesson Plan",
      "Teaching Points",
      "Questions to Ask",
      "Materials Needed",
      "Attendance Notes",
      "Product / Manufacturer Updates",
      "Follow-Up Actions",
    ],
    optional: [],
  },
  "Continuing Education Prep": {
    role: "Instructor",
    roleEngagement: "Continuing Education Prep",
    engagementType: "Teach / train",
    audience: "Instructor / Trainer",
    briefAction: "training_prep",
    previewTitle: "CE Prep Preview",
    packetTitle: "CE Prep Packet",
    recommended: [
      "CE Prep Outline",
      "Learning Objectives",
      "Teaching Points",
      "Materials Needed",
      "Attendance / Certification Notes",
      "Product / Manufacturer Updates",
    ],
    optional: [
      "Checklist Questions",
      "Follow-Up Actions",
    ],
  },
  "Inspection Prep": {
    role: "Inspector",
    roleEngagement: "Inspection / Testing",
    engagementType: "Inspect / service",
    audience: "Internal Inspector",
    briefAction: "inspection_prep",
    previewTitle: "Inspection Prep Preview",
    packetTitle: "Inspection Prep Packet",
    recommended: [
      "Inspection Checklist",
      "Items to Verify",
      "Equipment / Assets",
      "Documentation Follow-Up",
    ],
    optional: [
      "Product Safety Context",
      "Customer Talking Points",
      "Resources to Review",
    ],
  },
  "Site Walkthrough Prep": {
    role: "Inspector",
    roleEngagement: "Site Walkthrough",
    engagementType: "Inspect / service",
    audience: "Facility Manager",
    briefAction: "inspection_prep",
    previewTitle: "Site Walkthrough Preview",
    packetTitle: "Site Walkthrough Packet",
    recommended: [
      "Walkthrough Checklist",
      "Items to Verify",
      "Customer Questions",
      "Resources to Review",
    ],
    optional: ["Equipment / Assets", "Product Safety Context", "Follow-Up Actions"],
  },
  "Documentation Review": {
    role: "Inspector",
    roleEngagement: "Documentation Review",
    engagementType: "Follow up / document",
    audience: "Internal Inspector",
    briefAction: "follow_up_notes",
    previewTitle: "Documentation Review Preview",
    packetTitle: "Documentation Review Packet",
    recommended: [
      "Documentation Checklist",
      "Missing Information",
      "Records to Review",
      "Follow-Up Actions",
    ],
    optional: ["Product Safety Context", "Customer Talking Points"],
  },
  "Product Safety Review": {
    role: "Inspector",
    roleEngagement: "Documentation Review",
    engagementType: "Follow up / document",
    audience: "Safety Coordinator",
    briefAction: "inspection_prep",
    previewTitle: "Product Safety Review Preview",
    packetTitle: "Product Safety Review Packet",
    recommended: [
      "Product Safety Context",
      "Manufacturer / Model Verification",
      "Items to Verify",
      "Official Source Reminder",
    ],
    optional: ["Customer Talking Points", "Documentation Follow-Up"],
  },
};

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

const roleEngagementOptions: Record<UserRole, RoleEngagement[]> = {
  Inspector: [
    "Inspection / Testing",
    "Maintenance Review",
    "Site Walkthrough",
    "Documentation Review",
  ],
  Instructor: [
    "Continuing Education Prep",
    "Training Session",
    "Recruit Training",
    "Customer Education",
  ],
};

const inspectorDefaultTopics: Topic[] = [
  "Fire Sprinkler System",
  "Fire Extinguishers",
  "Emergency Lighting",
  "Fire Hydrants",
];

const instructorDefaultTopics: Topic[] = [
  "Fire Sprinkler System",
  "Fire Alarm / Detection",
  "Training Props / Demonstration Equipment",
];

const equipmentAssetsBySite: Record<string, Topic[]> = {
  "Municipal Facilities Account": [
    "Fire Sprinkler System",
    "Fire Extinguishers",
    "Emergency Lighting",
    "Fire Hydrants",
  ],
  "Fire Department Recruit Training Site": [
    "Fire Sprinkler System",
    "Fire Alarm / Detection",
    "Training Props / Demonstration Equipment",
  ],
  "Healthcare Facility ITM Review": [
    "Fire Sprinkler System",
    "Fire Alarm / Detection",
    "Special Hazards",
    "Emergency Lighting",
  ],
  "Education Campus Facilities Training": [
    "Fire Alarm / Detection",
    "Fire Extinguishers",
    "Emergency Lighting",
    "Fire Sprinkler System",
  ],
};

type ClientRecord = {
  equipmentAssets: string[];
  trainingHistory: string[];
  serviceHistory: string[];
  serviceTrainingHistory: string[];
  openItems: string[];
  missingInformation: string[];
  trainingContext: string[];
  audience: string;
  continuingEducationContext: string;
  productSafetyTerms: string[];
  trainingStatus: {
    completionPercent: number;
    currentAttendees: number;
    requiredAttendees: number;
    dueSoonCount: number;
    overdueCount: number;
    certificateRequired: boolean;
    rosterRequired: boolean;
    certificateDueDate: string;
    lastTrainingDate: string;
    nextTrainingWindow: string;
    trainingNotes: string;
  };
  resources: {
    title: string;
    type: string;
    description: string;
    action: string;
    purpose?: string;
    sampleNote?: string;
  }[];
};

const sampleLessonResources: ClientRecord["resources"] = [
  {
    title: "Sample Lesson Plan: Sprinkler System Basics",
    type: "Sample Lesson Plan",
    purpose: "For fire department recruit training or facility staff education.",
    description:
      "Sample demo lesson plan for sprinkler purpose, components, activation basics, and field awareness.",
    sampleNote:
      "Sample demo content used to show how integrated AI could adapt internal training materials. Final lesson content should be reviewed and completed by the instructor.",
    action: "Reference",
  },
  {
    title: "Sample Lesson Plan: Fire Alarm / Detection Overview",
    type: "Sample Lesson Plan",
    purpose: "For recruit training, customer education, or facility teams.",
    description:
      "Sample demo lesson plan covering detection devices, notification basics, documentation reminders, and escalation questions.",
    sampleNote:
      "Sample demo content used to show how integrated AI could adapt internal training materials. Final lesson content should be reviewed and completed by the instructor.",
    action: "Reference",
  },
  {
    title: "Sample Lesson Plan: Fire Extinguisher Awareness",
    type: "Sample Lesson Plan",
    purpose: "For customer education or campus/facility staff.",
    description:
      "Sample demo lesson plan covering extinguisher types, placement awareness, inspection awareness, and reporting issues.",
    sampleNote:
      "Sample demo content used to show how integrated AI could adapt internal training materials. Final lesson content should be reviewed and completed by the instructor.",
    action: "Reference",
  },
  {
    title: "Sample Lesson Plan: Emergency Lighting Awareness",
    type: "Sample Lesson Plan",
    purpose: "For facility maintenance, campus teams, or inspection-prep conversations.",
    description:
      "Sample demo lesson plan covering emergency lighting purpose, visual checks, and follow-up documentation.",
    sampleNote:
      "Sample demo content used to show how integrated AI could adapt internal training materials. Final lesson content should be reviewed and completed by the instructor.",
    action: "Reference",
  },
  {
    title: "Sample Lesson Plan: Documentation & Inspection Readiness",
    type: "Sample Lesson Plan",
    purpose: "For facility, healthcare, education, or compliance staff.",
    description:
      "Sample demo lesson plan covering records, missing information, service notes, and follow-up ownership.",
    sampleNote:
      "Sample demo content used to show how integrated AI could adapt internal training materials. Final lesson content should be reviewed and completed by the instructor.",
    action: "Reference",
  },
];

const defaultTrainingStatus: ClientRecord["trainingStatus"] = {
  completionPercent: 0,
  currentAttendees: 0,
  requiredAttendees: 0,
  dueSoonCount: 0,
  overdueCount: 0,
  certificateRequired: false,
  rosterRequired: false,
  certificateDueDate: "Not specified",
  lastTrainingDate: "Not specified",
  nextTrainingWindow: "Not specified",
  trainingNotes: "No training status provided in this sample record.",
};

const clientRecords: Record<string, ClientRecord> = {
  "Fire Department Recruit Training Site": {
    equipmentAssets: equipmentAssetsBySite["Fire Department Recruit Training Site"],
    trainingHistory: [
      "Recruit training session requested",
      "Sprinkler overview needed",
      "Continuing education prep needed",
    ],
    serviceHistory: ["Training support record only"],
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
    missingInformation: [
      "Final training objectives",
      "Demo material availability",
      "Attendance documentation owner",
    ],
    trainingContext: [
      "Recruit audience",
      "Continuing education prep",
      "Lesson plan needed",
    ],
    audience: "Fire department recruits",
    continuingEducationContext:
      "Basic system recognition, safety awareness, and documentation expectations",
    productSafetyTerms: ["sprinkler", "smoke alarm", "fire alarm"],
    trainingStatus: {
      completionPercent: 75,
      currentAttendees: 18,
      requiredAttendees: 24,
      dueSoonCount: 6,
      overdueCount: 0,
      certificateRequired: true,
      rosterRequired: true,
      certificateDueDate: "After session completion",
      lastTrainingDate: "Sample record: prior recruit class",
      nextTrainingWindow: "Within 30 days",
      trainingNotes:
        "Roster and certificate completion notes should be prepared before the session.",
    },
    resources: [
      sampleLessonResources[0],
      {
        title: "Sprinkler System Overview",
        type: "Training Resource",
        description: "Basic component and system explanation.",
        action: "Reference",
      },
      {
        title: "Instructor Checklist",
        type: "Lesson Planning",
        description: "Prep reminders for CE delivery.",
        action: "View",
      },
      {
        title: "Product Safety Data",
        type: "Safety / Recall Context",
        description: "Verification reminders based on assets.",
        action: "Reference",
      },
      {
        title: "Attendance Roster Template",
        type: "Documentation",
        description: "Attendance or CE completion reminder.",
        action: "View",
      },
      {
        title: "Department Training Requirements",
        type: "Training Reference",
        description: "Sample reminder to verify department requirements.",
        action: "Reference",
      },
      sampleLessonResources[1],
    ],
  },
  "Municipal Facilities Account": {
    equipmentAssets: equipmentAssetsBySite["Municipal Facilities Account"],
    trainingHistory: ["Facility staff may need safety awareness support"],
    serviceHistory: [
      "Annual inspection due soon",
      "Prior extinguisher documentation gap",
    ],
    serviceTrainingHistory: [
      "Annual inspection due soon",
      "Prior extinguisher documentation gap",
    ],
    openItems: [
      "Missing extinguisher model numbers",
      "Emergency lighting date needs verification",
      "Photograph sprinkler manufacturer labels",
    ],
    missingInformation: [
      "Extinguisher model numbers",
      "Emergency lighting service date",
      "Sprinkler manufacturer labels",
    ],
    trainingContext: [
      "Facility maintenance staff",
      "Documentation awareness",
      "Basic safety reminders",
    ],
    audience: "Facility maintenance staff",
    continuingEducationContext:
      "Customer education may be needed for documentation and safety awareness",
    productSafetyTerms: ["fire extinguisher", "smoke alarm", "emergency lighting"],
    trainingStatus: {
      ...defaultTrainingStatus,
      completionPercent: 60,
      currentAttendees: 9,
      requiredAttendees: 15,
      dueSoonCount: 4,
      certificateRequired: false,
      rosterRequired: true,
      nextTrainingWindow: "Next inspection cycle",
      trainingNotes:
        "Facility staff may need safety awareness and documentation reminders.",
    },
    resources: [
      sampleLessonResources[2],
      sampleLessonResources[3],
      {
        title: "Site Record",
        type: "Client Context",
        description: "Account, equipment, and open items.",
        action: "View",
      },
      {
        title: "Asset List",
        type: "Equipment Record",
        description: "Current demo equipment record.",
        action: "Reference",
      },
      {
        title: "Service Notes",
        type: "Documentation",
        description: "Recent reminders and open gaps.",
        action: "View",
      },
      {
        title: "Product Safety Data",
        type: "Safety / Recall Context",
        description: "Recall verification reminders.",
        action: "Reference",
      },
    ],
  },
  "Healthcare Facility ITM Review": {
    equipmentAssets: equipmentAssetsBySite["Healthcare Facility ITM Review"],
    trainingHistory: [
      "Facilities and compliance staff may need documentation support",
    ],
    serviceHistory: [
      "ITM documentation review",
      "Healthcare compliance sensitivity",
    ],
    serviceTrainingHistory: [
      "ITM documentation review",
      "Healthcare compliance sensitivity",
    ],
    openItems: [
      "Confirm documentation gaps",
      "Verify special hazards details",
      "Review emergency lighting dates",
    ],
    missingInformation: [
      "Documentation gap details",
      "Special hazards equipment details",
      "Emergency lighting dates",
    ],
    trainingContext: [
      "Facilities and compliance staff",
      "Inspection readiness",
      "Equipment awareness",
    ],
    audience: "Facilities and compliance staff",
    continuingEducationContext:
      "Documentation, inspection readiness, and equipment awareness",
    productSafetyTerms: ["fire alarm", "sprinkler", "emergency lighting"],
    trainingStatus: {
      ...defaultTrainingStatus,
      completionPercent: 70,
      currentAttendees: 14,
      requiredAttendees: 20,
      dueSoonCount: 3,
      certificateRequired: false,
      rosterRequired: true,
      nextTrainingWindow: "During ITM review window",
      trainingNotes:
        "Facilities and compliance staff may need documentation support.",
    },
    resources: [
      sampleLessonResources[4],
      {
        title: "ITM Record",
        type: "Client Context",
        description: "Inspection and testing context.",
        action: "View",
      },
      {
        title: "Manufacturer Documentation",
        type: "Resource",
        description: "Equipment guidance to verify.",
        action: "View",
      },
      {
        title: "Healthcare Safety Checklist",
        type: "Documentation",
        description: "Facility-sensitive review reminders.",
        action: "Reference",
      },
    ],
  },
  "Education Campus Facilities Training": {
    equipmentAssets: equipmentAssetsBySite["Education Campus Facilities Training"],
    trainingHistory: [
      "Staff education session",
      "Campus safety walkthrough",
    ],
    serviceHistory: ["Campus safety walkthrough context"],
    serviceTrainingHistory: [
      "Staff education session",
      "Campus safety walkthrough",
    ],
    openItems: [
      "Confirm audience knowledge level",
      "Verify extinguisher training materials",
      "Identify campus follow-up questions",
    ],
    missingInformation: [
      "Audience knowledge level",
      "Extinguisher training materials",
      "Campus follow-up questions",
    ],
    trainingContext: [
      "Campus staff",
      "Safety awareness",
      "Emergency systems overview",
    ],
    audience: "Campus staff",
    continuingEducationContext:
      "Staff safety awareness, extinguisher basics, and emergency systems overview",
    productSafetyTerms: ["fire extinguisher", "smoke alarm", "emergency lighting"],
    trainingStatus: {
      ...defaultTrainingStatus,
      completionPercent: 50,
      currentAttendees: 12,
      requiredAttendees: 24,
      dueSoonCount: 8,
      certificateRequired: false,
      rosterRequired: true,
      nextTrainingWindow: "Upcoming staff education session",
      trainingNotes:
        "Staff education session needs materials and follow-up questions prepared.",
    },
    resources: [
      sampleLessonResources[2],
      sampleLessonResources[3],
      {
        title: "Training Outline",
        type: "Training Resource",
        description: "Session structure and reminders.",
        action: "Reference",
      },
      {
        title: "Campus Notes",
        type: "Client Context",
        description: "Sample campus follow-up context.",
        action: "View",
      },
      {
        title: "Attendance Record Template",
        type: "Documentation",
        description: "Training completion reminder.",
        action: "View",
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
      "Use this for customer training, recruit training, continuing education, certificates, attendance, selected services, and likely questions.",
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

const compactItems = (items: string[], fallback: string[] = []) =>
  (items.length ? items : fallback)
    .map((item) => item.replace(/^Provided by user\/demo profile:\s*/i, ""))
    .filter(Boolean)
    .slice(0, 5);

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
    <section className="border-t border-brand-gray200 py-4">
      <h3 className={`text-lg font-black leading-tight ${headingClass}`}>
        {title}
      </h3>
      <div className="mt-3 text-sm leading-6 text-brand-gray700 sm:text-base">{children}</div>
    </section>
  );
};

const previewTitleForWorkflow = (workflow: Workflow) =>
  workflowConfig[workflow].previewTitle;

const flagsForRecord = (
  workflow: Workflow,
  record: ClientRecord,
  automaticSafetyReview: AutomaticSafetyReview,
) => {
  if (workflow === "Training / Lesson Plan") {
    return [
      "Prepare attendance roster.",
      "Confirm certificate completion process.",
      "Verify demonstration materials.",
      "Review product safety terms before instruction.",
    ];
  }
  if (workflow === "Continuing Education Prep") {
    return [
      "Confirm who is due soon.",
      "Prepare completion documentation.",
      "Verify whether certificates are required.",
      "Review product update terms.",
    ];
  }
  if (workflow === "Product Safety Review") {
    return [
      "Verify model and date code.",
      "Check manufacturer guidance.",
      "Confirm official source before action.",
    ];
  }
  if (workflow === "Inspection Prep") {
    return [
      "Review open documentation gap.",
      "Verify missing asset details.",
      "Photograph equipment labels.",
    ];
  }
  if (workflow === "Documentation Review") {
    return [
      "Review missing records.",
      "Confirm open documentation items.",
      "Assign follow-up owner.",
    ];
  }
  if (automaticSafetyReview.possibleMatches.length) {
    return [
      "Verify possible product match.",
      "Confirm model and date code.",
      "Check manufacturer guidance.",
    ];
  }
  return compactItems(record.openItems).slice(0, 3);
};

const whatMattersForRecord = (
  workflow: Workflow,
  record: ClientRecord,
  sampleSite: string,
) => {
  if (
    workflow === "Training / Lesson Plan" &&
    sampleSite === "Fire Department Recruit Training Site"
  ) {
    return "Recruit training needs a sprinkler-focused lesson plan using site equipment and attendance documentation.";
  }
  if (workflow === "Training / Lesson Plan") {
    return "Training prep should connect site equipment, audience needs, materials, and follow-up documentation.";
  }
  if (workflow === "Continuing Education Prep") {
    return "CE prep should focus on audience readiness, training objectives, materials, and documentation.";
  }
  if (workflow === "Inspection Prep") {
    return "Inspection prep should focus on assets, open items, documentation gaps, and verification needs.";
  }
  if (workflow === "Documentation Review") {
    return "Documentation review should focus on missing records, open items, and follow-up ownership.";
  }
  if (workflow === "Product Safety Review") {
    return "Product safety review should focus on model details, manufacturer guidance, and official source verification.";
  }
  return `${sampleSite} needs prep around ${record.openItems[0]?.toLowerCase() ?? "open site items"}.`;
};

const trainingStatusSummary = (record: ClientRecord) => {
  const status = record.trainingStatus;
  if (!status.currentAttendees && !status.requiredAttendees) {
    return "No training status provided.";
  }
  return `${status.completionPercent}% current · ${status.dueSoonCount} due soon · ${
    status.certificateRequired ? "certificates required" : "certificates not required"
  } · ${status.rosterRequired ? "roster needed" : "roster not required"}`;
};

const trainingCertificateNotes = (record: ClientRecord) => {
  const status = record.trainingStatus;
  const notes = [];
  if (status.rosterRequired) notes.push("Prepare roster before session.");
  if (status.certificateRequired) notes.push("Confirm certificate process.");
  if (status.dueSoonCount > 0) {
    notes.push(`${status.dueSoonCount} attendees are due soon.`);
  }
  if (status.trainingNotes) notes.push(status.trainingNotes);
  return notes.slice(0, 4);
};

const suggestedLessonFocus = (record: ClientRecord, workflow: Workflow) => {
  const lesson = record.resources.find((resource) => {
    const title = resource.title.toLowerCase();
    if (workflow === "Documentation Review") {
      return title.includes("documentation");
    }
    if (record.equipmentAssets.some((item) => item.toLowerCase().includes("extinguisher"))) {
      return title.includes("extinguisher");
    }
    if (record.equipmentAssets.some((item) => item.toLowerCase().includes("emergency lighting"))) {
      return title.includes("emergency lighting");
    }
    if (record.equipmentAssets.some((item) => item.toLowerCase().includes("alarm"))) {
      return title.includes("alarm");
    }
    return title.includes("sprinkler");
  });

  return lesson?.title.replace("Sample Lesson Plan: ", "") ?? "Lesson plan placeholder";
};

const productSafetyNotes = (
  record: ClientRecord,
  automaticSafetyReview: AutomaticSafetyReview,
) => [
  `Search terms came from the site record: ${record.productSafetyTerms.join(", ")}.`,
  "Verify manufacturer, model, and date code.",
  automaticSafetyReview.possibleMatches.length
    ? "Review possible match before discussion."
    : "Review official source before action.",
].slice(0, 3);

const recommendationReason = (
  section: PrepSection,
  workflow: Workflow,
  record: ClientRecord,
) => {
  if (section === "Lesson Plan") {
    return "Recommended because this is a recruit training workflow.";
  }
  if (section === "Attendance Notes" || section === "Attendance / Certification Notes") {
    return record.trainingStatus.certificateRequired
      ? `Recommended because certificates are required and ${record.trainingStatus.dueSoonCount} are due soon.`
      : "Recommended because roster documentation is part of the record.";
  }
  if (section.includes("Product") || section.includes("Safety")) {
    return "Recommended because product safety terms are available from the site record.";
  }
  if (section.includes("Documentation") || section.includes("Missing")) {
    return "Recommended because open record gaps need follow-up.";
  }
  if (section.includes("Materials")) {
    return "Recommended because sample source materials are available.";
  }
  return `Recommended for ${workflow.toLowerCase()}.`;
};

const recommendedNextStep = (workflow: Workflow, record: ClientRecord) => {
  if (workflow === "Training / Lesson Plan") {
    return "Confirm objectives, materials, and attendance documentation before teaching.";
  }
  if (workflow === "Continuing Education Prep") {
    return "Confirm learning objectives and documentation requirements before delivery.";
  }
  if (workflow === "Product Safety Review") {
    return "Verify model, date code, and official source before discussing applicability.";
  }
  if (workflow === "Documentation Review") {
    return "Review missing records and assign a follow-up owner.";
  }
  if (workflow === "Site Walkthrough Prep") {
    return "Confirm walkthrough priorities and open questions with the site contact.";
  }
  return record.openItems[0] ?? "Confirm open items before the engagement.";
};

const sortResources = (
  record: ClientRecord,
  workflow: Workflow,
  selectedSections: PrepSection[],
) => {
  const score = (resource: ClientRecord["resources"][number]) => {
    const text = `${resource.title} ${resource.type} ${resource.description}`.toLowerCase();
    let value = 0;
    if (workflow.includes("Training") || workflow.includes("Education")) {
      if (text.includes("training") || text.includes("instructor")) value += 4;
      if (text.includes("attendance")) value += 3;
    }
    if (workflow.includes("Inspection") || workflow.includes("Walkthrough")) {
      if (text.includes("site") || text.includes("asset") || text.includes("service")) value += 4;
    }
    if (workflow.includes("Documentation")) {
      if (text.includes("documentation") || text.includes("record") || text.includes("checklist")) value += 4;
    }
    if (
      workflow.includes("Product Safety") ||
      selectedSections.some((section) => section.includes("Product"))
    ) {
      if (text.includes("safety") || text.includes("recall")) value += 5;
    }
    return value;
  };

  return [...record.resources].sort((a, b) => score(b) - score(a));
};

const sourceMaterialStatus = (
  resource: ClientRecord["resources"][number],
  index: number,
  selectedSections: PrepSection[],
) => {
  const text = `${resource.title} ${resource.type} ${resource.description}`.toLowerCase();
  const productSelected = selectedSections.some((section) =>
    section.toLowerCase().includes("product"),
  );
  if (text.includes("safety") && !productSelected) return "Optional";
  if (index < 3) return "Included";
  return "Optional";
};

const sectionContent = ({
  section,
  workflow,
  record,
  guidance,
  automaticSafetyReview,
}: {
  section: PrepSection;
  workflow: Workflow;
  record: ClientRecord;
  guidance: AiGuidance;
  automaticSafetyReview: AutomaticSafetyReview;
}) => {
  const safetyItems = [
    "Review product safety terms.",
    "Verify model and date code.",
    "Check manufacturer guidance.",
    "Confirm before customer discussion.",
  ];
  const checklist = [
    ...record.openItems,
    ...guidance.equipmentProductChecklist,
  ].slice(0, 5);
  const resources = sortResources(record, workflow, [section])
    .slice(0, 5)
    .map((resource) => `${resource.title}: ${resource.description}`);

  const content: Partial<Record<PrepSection, string[]>> = {
    "Lesson Plan": [
      `Session Goal: ${record.continuingEducationContext}.`,
      `Audience: ${record.audience}.`,
      "Opening: Review purpose and safety role.",
      `Demo: Cover ${record.equipmentAssets.slice(0, 3).join(", ")}.`,
      "Wrap-up: Capture questions and follow-up.",
    ],
    "Teaching Points": [
      "Use site equipment in examples.",
      "Explain labels and basic components.",
      "Connect training to field awareness.",
      "Pause for likely attendee questions.",
    ],
    "Questions to Ask": [
      "What should attendees recognize onsite?",
      "Which records need documentation?",
      "What questions should be escalated?",
      "What materials are missing?",
    ],
    "Materials Needed": [...resources.slice(0, 3), "Attendance or completion record."],
    "Attendance Notes": [
      "Prepare attendance documentation.",
      "Confirm completion tracking owner.",
      "Avoid unapproved certification claims.",
    ],
    "Product / Manufacturer Updates": safetyItems,
    "Follow-Up Actions": guidance.recommendedNextBestActions.slice(0, 5),
    "CE Prep Outline": [
      "Confirm learning objective.",
      "Match examples to audience readiness.",
      "Use approved materials only.",
      "Record questions for follow-up.",
    ],
    "Learning Objectives": [
      "Identify basic system purpose.",
      "Recognize common components.",
      "Know what to report.",
      "Understand documentation expectations.",
    ],
    "Attendance / Certification Notes": [
      "Prepare attendance roster.",
      "Verify credit language before use.",
      "Route certification questions for review.",
    ],
    "Checklist Questions": checklist,
    "Inspection Checklist": checklist,
    "Items to Verify": [
      ...record.missingInformation,
      ...guidance.missingInformationToVerify,
    ].slice(0, 5),
    "Equipment / Assets": record.equipmentAssets,
    "Documentation Follow-Up": [
      ...record.openItems,
      "Assign follow-up owner.",
      "Attach notes to official record.",
    ].slice(0, 5),
    "Product Safety Context": [
      ...safetyItems,
      automaticSafetyReview.possibleMatches.length
        ? "Possible match needs verification."
        : "No obvious match from demo review.",
    ].slice(0, 5),
    "Customer Talking Points": guidance.audienceSpecificTalkingPoints.slice(0, 4),
    "Resources to Review": resources,
    "Walkthrough Checklist": checklist,
    "Customer Questions": [
      "Which systems are most important today?",
      "What documentation is missing?",
      "Who owns follow-up?",
      "What should be explained plainly?",
    ],
    "Documentation Checklist": [
      ...record.missingInformation,
      "Review service notes.",
      "Confirm official record owner.",
    ].slice(0, 5),
    "Missing Information": record.missingInformation,
    "Records to Review": resources,
    "Manufacturer / Model Verification": [
      "Verify manufacturer label.",
      "Confirm model and date code.",
      "Check manufacturer guidance.",
      "Compare against official source.",
    ],
    "Official Source Reminder": [
      "Verify CPSC and manufacturer sources.",
      "Check applicable codes and NFPA standards.",
      "Use qualified internal review.",
    ],
  };

  return content[section] ?? [];
};

const AiPrepOutput = ({
  guidance,
  workflow,
  selectedSections,
  record,
  sampleSite,
  automaticSafetyReview,
  onStartNew,
}: {
  guidance: AiGuidance;
  workflow: Workflow;
  selectedSections: PrepSection[];
  record: ClientRecord;
  sampleSite: string;
  automaticSafetyReview: AutomaticSafetyReview;
  onStartNew: () => void;
}) => {
  const [showExpanded, setShowExpanded] = useState(false);

  if (!guidance) return null;

  const sortedResources = sortResources(record, workflow, selectedSections);
  const flags = flagsForRecord(workflow, record, automaticSafetyReview);
  const snapshot = [
    workflow === "Training / Lesson Plan"
      ? "Fire department recruit training focused on sprinkler basics."
      : `${sampleSite}: ${record.continuingEducationContext}.`,
    `Sample training record shows ${trainingStatusSummary(record)}.`,
    record.trainingStatus.certificateRequired
      ? "Certificates are required after completion."
      : `Assets: ${record.equipmentAssets.slice(0, 3).join(", ")}.`,
  ].slice(0, 3);
  const nextStep = recommendedNextStep(workflow, record);
  const packetTitle = workflowConfig[workflow].packetTitle;
  const lessonFocus = suggestedLessonFocus(record, workflow);
  const certificateNotes = trainingCertificateNotes(record);
  const safetyNotes = productSafetyNotes(record, automaticSafetyReview);
  const sampleMaterialsUsed = sortedResources
    .slice(0, 5)
    .map((resource) => resource.title.replace("Sample Lesson Plan: ", "sample lesson plan: "));
  const packetText = [
    packetTitle,
    sampleSite,
    "",
    "Snapshot",
    ...snapshot.map((item) => `- ${item}`),
    "",
    "AI-Flagged Items",
    ...flags.map((item) => `- ${item}`),
    "",
    "Suggested Lesson Focus",
    `- ${lessonFocus}, based on the selected site, equipment, and sample training context.`,
    "",
    "Training / Certificate Notes",
    ...certificateNotes.map((item) => `- ${item}`),
    "",
    "Equipment / Product Safety Notes",
    ...safetyNotes.map((item) => `- ${item}`),
    "",
    ...selectedSections.flatMap((section) => [
      section,
      ...sectionContent({
        section,
        workflow,
        record,
        guidance,
        automaticSafetyReview,
      }).map((item) => `- ${item}`),
      "",
    ]),
    "Recommended Follow-Up",
    `- ${nextStep}`,
    "",
    "Verification Reminder",
    "- Verify official sources, manufacturer instructions, applicable codes, NFPA standards, company procedures, and AHJ requirements before action.",
  ].join("\n");
  const copyText = (text: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(text);
  };
  const shareText = (text: string) => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      void navigator.share({ title: packetTitle, text });
      return;
    }
    copyText(text);
  };

  return (
    <section className="rounded-2xl border border-brand-gray200 bg-white p-4 shadow-sm sm:p-5">
      <div className="border-b border-brand-gray200 pb-3">
        <h2 className="text-2xl font-black leading-tight text-brand-charcoal">
          {previewTitleForWorkflow(workflow)}
        </h2>
        <p className="mt-1 text-sm font-bold leading-6 text-brand-gray700">
          {sampleSite}
        </p>
      </div>

      <div className="space-y-1">
        <PrepBriefSection title="Snapshot" tone="green">
          <PacketList items={snapshot} tone="green" />
        </PrepBriefSection>
        <PrepBriefSection title="Suggested Lesson Focus" tone="green">
          <p>
            {lessonFocus}, based on the selected site, equipment, and sample
            training context.
          </p>
          <p className="mt-2 text-xs font-bold text-brand-gray500">
            Uses sample demo lesson-plan content. Final training materials
            should be reviewed by the instructor.
          </p>
        </PrepBriefSection>
        <PrepBriefSection title="Training / Certificate Notes" tone="neutral">
          <PacketList items={certificateNotes} tone="neutral" />
        </PrepBriefSection>
        <PrepBriefSection title="Equipment / Product Safety Notes" tone="amber">
          <PacketList items={safetyNotes} tone="amber" />
        </PrepBriefSection>
        <PrepBriefSection title="AI-Flagged Items" tone="red">
          <PacketList items={flags} tone="red" />
        </PrepBriefSection>
        <PrepBriefSection title="Sections to Expand" tone="neutral">
          <div className="flex flex-wrap gap-2">
            {selectedSections.map((section) => (
              <span
                key={section}
                className="rounded-lg border border-brand-gray200 bg-brand-gray100 px-2.5 py-1 text-xs font-black text-brand-charcoal"
              >
                {section}
              </span>
            ))}
          </div>
        </PrepBriefSection>
        <PrepBriefSection title="Key Resources" tone="neutral">
          <PacketList
            items={sortedResources
              .slice(0, 3)
              .map((resource) => resource.title)}
            tone="neutral"
          />
        </PrepBriefSection>
        <PrepBriefSection title="Recommended Next Step" tone="green">
          <p>{nextStep}</p>
          <p className="mt-2 text-xs font-bold text-brand-gray500">
            Sample demo materials used: {sampleMaterialsUsed.join(", ")}.
          </p>
        </PrepBriefSection>

        <div className="flex flex-wrap gap-2 border-t border-brand-gray200 pt-4">
          <button
            type="button"
            onClick={() => setShowExpanded((value) => !value)}
            className="rounded-xl border border-brand-green bg-white px-3 py-2 text-sm font-extrabold text-brand-green transition hover:bg-green-50"
          >
            {showExpanded ? "Hide Selected Sections" : "Expand Selected Sections"}
          </button>
          <button
            type="button"
            onClick={() => setShowExpanded(true)}
            className="rounded-xl border border-brand-gray200 bg-white px-2.5 py-1.5 text-sm font-bold text-brand-charcoal transition hover:bg-brand-gray100"
          >
            View Full Packet
          </button>
          <button
            type="button"
            onClick={() => copyText(packetText)}
            className="rounded-xl border border-brand-gray200 bg-white px-2.5 py-1.5 text-sm font-bold text-brand-charcoal transition hover:bg-brand-gray100"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={() => shareText(packetText)}
            className="rounded-xl border border-brand-gray200 bg-white px-2.5 py-1.5 text-sm font-bold text-brand-charcoal transition hover:bg-brand-gray100"
          >
            Share
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl border border-brand-gray200 bg-white px-2.5 py-1.5 text-sm font-bold text-brand-charcoal transition hover:bg-brand-gray100"
          >
            Print
          </button>
          <button
            type="button"
            onClick={onStartNew}
            className="rounded-xl border border-brand-gray200 bg-white px-2.5 py-1.5 text-sm font-bold text-brand-gray700 transition hover:bg-brand-gray100"
          >
            Start New
          </button>
        </div>

        {showExpanded ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <PrepBriefSection title={packetTitle} tone="green">
                <PacketList items={snapshot} tone="green" />
              </PrepBriefSection>
            </div>
            {selectedSections.map((section) => (
              <PrepBriefSection key={section} title={section} tone="neutral">
                <PacketList
                  items={sectionContent({
                    section,
                    workflow,
                    record,
                    guidance,
                    automaticSafetyReview,
                  })}
                  tone={
                    section.includes("Safety") ||
                    section.includes("Verify") ||
                    section.includes("Missing")
                      ? "red"
                      : "green"
                  }
                />
              </PrepBriefSection>
            ))}
            <div className="sm:col-span-2">
              <PrepBriefSection title="Recommended Follow-Up" tone="green">
                <p>{nextStep}</p>
              </PrepBriefSection>
              <PrepBriefSection title="Verification Reminder" tone="amber">
                <p>
                  Verify official sources, manufacturer instructions, applicable
                  codes, NFPA standards, company procedures, and AHJ requirements
                  before action.
                </p>
              </PrepBriefSection>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

const ReadinessPacket = ({
  guidance,
  workflow,
  selectedSections,
  record,
  role,
  roleEngagement,
  selectedTopics,
  audience,
  sampleSite,
  automaticSafetyReview,
  onStartNew,
}: {
  guidance: AiGuidance;
  workflow: Workflow;
  selectedSections: PrepSection[];
  record: ClientRecord;
  role: UserRole;
  roleEngagement: RoleEngagement;
  selectedTopics: Topic[];
  audience: Audience;
  sampleSite: string;
  automaticSafetyReview: AutomaticSafetyReview;
  onStartNew: () => void;
}) => {
  const [showFullPacket, setShowFullPacket] = useState(false);
  const [showLessonPlan, setShowLessonPlan] = useState(false);

  if (!guidance) return null;

  return (
    <AiPrepOutput
      guidance={guidance}
      workflow={workflow}
      selectedSections={selectedSections}
      record={record}
      sampleSite={sampleSite}
      automaticSafetyReview={automaticSafetyReview}
      onStartNew={onStartNew}
    />
  );

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
  const assetText = selectedTopics.join(" · ") || "No equipment/assets selected";
  const simpleLessonPlan: string[] = (
    guidance.simpleLessonPlan?.length
      ? guidance.simpleLessonPlan
      : [
          "0-5 min: Introduction, audience expectations, and safety boundaries.",
          `5-15 min: Core concept review for ${selectedTopics.join(", ") || "selected equipment/assets"}.`,
          "15-25 min: Demonstration or scenario discussion using approved examples.",
          "25-35 min: Guided practice or Q&A.",
          "35-42 min: Knowledge check.",
          "42-45 min: Wrap-up, attendance documentation, and follow-up reminder.",
        ]) ?? [];
  const materialsEquipmentNeeded: string[] = (
    guidance.materialsEquipmentNeeded?.length
      ? guidance.materialsEquipmentNeeded
      : [
          "Training outline or agenda",
          "Attendance/sign-in record",
          "Relevant equipment examples, photos, or approved documentation",
          "Follow-up notes for unresolved technical questions",
        ]) ?? [];
  const certificationAttendanceReminders: string[] = (
    guidance.certificationAttendanceReminders?.length
      ? guidance.certificationAttendanceReminders
      : [
          "Confirm attendance documentation requirements before the session.",
          "Verify whether any certificate or credit language is approved before use.",
          "Route standards, credit, or certification questions to qualified review.",
        ]) ?? [];
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
    `Client/site: ${sampleSite}.`,
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
      ? "Confirm recall match with model/date code."
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
    "Client/site record.",
    "Equipment/asset list.",
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
    `Expand this into a 45-minute lesson plan for ${sampleSite}. Include learning objectives, instructor notes, equipment/products to cover, demo steps, questions to ask, safety reminders, attendance documentation, and follow-up items. Use this client/site record, equipment/assets, continuing education context, product safety context, and relevant resources.`;
  const packetText = [
    "Engagement Packet",
    `${sampleSite} - ${role} - ${roleEngagement}`,
    assetText,
    "",
    role === "Instructor" ? "Client / Training Site Context" : "Client / Site Context",
    ...clientContextItems.map((item) => `- ${item}`),
    "",
    "Equipment / Assets",
    ...assetItems.map((item) => `- ${item}`),
    "",
    "AI-Flagged Items",
    ...aiFlaggedItems.map((item) => `- ${item}`),
    "",
    role === "Instructor" ? "Session Priorities" : "Onsite Priorities",
    ...(role === "Instructor" ? instructorStartHere : inspectorStartHere).map((item) => `- ${item}`),
    "",
    ...(role === "Instructor"
      ? [
          "Lesson Flow",
          ...simpleLessonPlan.map((item) => `- ${item}`),
          "",
          "Checklist / Questions",
          ...checklistItems.map((item) => `- ${item}`),
          "",
          "Materials / Equipment Needed",
          ...materialsEquipmentNeeded.map((item) => `- ${item}`),
          "Attendance / Certification Reminders",
          ...certificationAttendanceReminders.map((item) => `- ${item}`),
          "",
          "GPT Follow-Up Prompt",
          gptFollowUpPrompt,
        ]
      : [
          "Checklist / Questions",
          ...checklistItems.map((item) => `- ${item}`),
          "",
          "Discrepancies / Items to Verify",
          ...missingInformation.slice(0, 5).map((item) => `- ${item}`),
          "",
          "Product Safety / Recall Context",
          ...productSafetyItems.map((item) => `- ${item}`),
          "",
          "Photos / Barcodes / Signatures",
          ...photoBarcodeSignatureItems.map((item) => `- ${item}`),
        ]),
    "",
    "Related Service Considerations",
    ...relatedServiceItems.map((item) => `- ${item}`),
    "",
    "Resources to Review",
    ...resourcesToReview.map((item) => `- ${item}`),
    "",
    "Recommended Follow-Up",
    ...followUpItems.map((item) => `- ${item}`),
  ].join("\n");
  const copyText = (text: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(text);
  };
  const shareText = (text: string) => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      void navigator.share({ title: "Engagement Packet", text });
      return;
    }
    copyText(text);
  };
  const hasFollowUpNote = guidance.followUpNoteDraft.trim().length > 0;
  const previewSnapshot = compactItems(
    role === "Instructor"
      ? [
          `Training site: ${sampleSite}.`,
          `Engagement: ${roleEngagement}.`,
          `Audience: ${audience}.`,
        ]
      : [
          `Client/site: ${sampleSite}.`,
          `Engagement: ${roleEngagement}.`,
          `Assets: ${selectedTopics.slice(0, 3).join(", ")}.`,
        ],
  ).slice(0, 3);
  const keyResources = resourcesToReview.slice(0, 4);
  const nextStep = followUpItems.slice(0, 1);

  return (
    <section className="rounded-2xl border border-brand-gray200 bg-white p-4 shadow-sm sm:p-5">
      <div className="border-b border-brand-gray200 pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-black leading-tight text-brand-charcoal sm:text-3xl">
              Engagement Packet
            </h2>
            <p className="mt-2 text-base leading-7 text-brand-gray700">
              {sampleSite} · {role} · {roleEngagement}
            </p>
            <p className="mt-1 text-sm font-bold leading-6 text-brand-gray700">
              {assetText}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowFullPacket((value) => !value)}
              className="rounded-xl border border-brand-green bg-white px-3 py-2 text-sm font-extrabold text-brand-green transition hover:bg-green-50"
            >
              {showFullPacket ? "Hide Full Packet" : "View Full Packet"}
            </button>
            {role === "Instructor" ? (
              <button
                type="button"
                onClick={() => setShowLessonPlan((value) => !value)}
                className="rounded-xl border border-brand-gray200 bg-white px-3 py-2 text-sm font-extrabold text-brand-charcoal transition hover:bg-brand-gray100"
              >
                {showLessonPlan ? "Hide Lesson Plan" : "View Lesson Plan"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => copyText(packetText)}
              className="rounded-xl border border-brand-gray200 bg-white px-3 py-2 text-sm font-extrabold text-brand-charcoal transition hover:bg-brand-gray100"
            >
              Copy Packet
            </button>
            <button
              type="button"
              onClick={() => shareText(packetText)}
              className="rounded-xl border border-brand-gray200 bg-white px-3 py-2 text-sm font-extrabold text-brand-charcoal transition hover:bg-brand-gray100"
            >
              Share
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
      </div>

      <div className="space-y-1">
        <PrepBriefSection
          title={role === "Instructor" ? "Training Overview" : "Engagement Overview"}
          tone="green"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-black text-brand-charcoal">Snapshot</p>
              <PacketList items={previewSnapshot} tone="green" />
            </div>
            <div>
              <p className="text-sm font-black text-brand-charcoal">AI-Flagged Items</p>
              <PacketList items={aiFlaggedItems.slice(0, 4)} tone="red" />
            </div>
            <div>
              <p className="text-sm font-black text-brand-charcoal">Top Checklist / Questions</p>
              <PacketList items={checklistItems.slice(0, 4)} tone="green" />
            </div>
            <div>
              <p className="text-sm font-black text-brand-charcoal">Key Resources</p>
              <PacketList items={keyResources} tone="neutral" />
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-brand-gray200 bg-brand-gray100 px-3 py-2">
            <p className="text-sm font-black text-brand-charcoal">
              Recommended Next Step
            </p>
            <PacketList items={nextStep} tone="green" />
          </div>
        </PrepBriefSection>

        {showLessonPlan && role === "Instructor" ? (
          <PrepBriefSection title="Lesson Plan" tone="green">
            <PacketList
              items={[
                "Goal: Explain sprinkler basics for recruit awareness.",
                "Opening: Review system purpose and safety role.",
                ...simpleLessonPlan.slice(0, 3),
                "Wrap-up: Review documentation and follow-up questions.",
              ].slice(0, 5)}
              tone="green"
            />
          </PrepBriefSection>
        ) : null}

        {showFullPacket ? (
          <>
        <PrepBriefSection
          title={role === "Instructor" ? "Training Snapshot" : "Engagement Snapshot"}
          tone="neutral"
        >
          <PacketList items={clientContextItems} tone="neutral" />
        </PrepBriefSection>

        <PrepBriefSection title="AI-Flagged Items" tone="red">
          <PacketList items={aiFlaggedItems} tone="red" />
        </PrepBriefSection>

        <PrepBriefSection
          title={role === "Instructor" ? "Equipment / Products to Cover" : "Equipment / Assets"}
          tone="green"
        >
          <PacketList items={assetItems} tone="green" />
        </PrepBriefSection>

        <PrepBriefSection
          title={role === "Instructor" ? "Lesson Plan" : "Onsite Priorities"}
          tone="green"
        >
          <PacketList
            items={role === "Instructor" ? simpleLessonPlan : inspectorStartHere}
            tone="green"
          />
        </PrepBriefSection>

        {role === "Instructor" ? (
          <>
            <PrepBriefSection title="Checklist / Questions" tone="green">
              <PacketList items={checklistItems} tone="green" />
            </PrepBriefSection>
            <PrepBriefSection title="Product Safety / Manufacturer Updates" tone="amber">
              <PacketList items={productSafetyItems} tone="amber" />
            </PrepBriefSection>
            <PrepBriefSection title="Materials / Resources Needed" tone="green">
              <PacketList
                items={[...materialsEquipmentNeeded, ...resourcesToReview].slice(0, 5)}
                tone="green"
              />
            </PrepBriefSection>
            <PrepBriefSection title="Attendance / Certification Reminders" tone="amber">
              <PacketList items={certificationAttendanceReminders} tone="amber" />
            </PrepBriefSection>
          </>
        ) : (
          <>
            <PrepBriefSection title="Checklist / Questions" tone="green">
              <PacketList items={checklistItems} tone="green" />
            </PrepBriefSection>
            <PrepBriefSection title="Discrepancies / Items to Verify" tone="red">
              <PacketList items={missingInformation.slice(0, 5)} tone="red" />
            </PrepBriefSection>
            <PrepBriefSection title="Product Safety / Recall Context" tone="amber">
              <PacketList items={productSafetyItems} tone="amber" />
            </PrepBriefSection>
            <PrepBriefSection title="Photos / Barcodes / Signatures" tone="neutral">
              <PacketList items={photoBarcodeSignatureItems} tone="neutral" />
            </PrepBriefSection>
          </>
        )}

        <PrepBriefSection title="Resources to Review" tone="neutral">
          <PacketList items={resourcesToReview} tone="neutral" />
        </PrepBriefSection>

        <PrepBriefSection title="Recommended Follow-Up" tone="neutral">
          <div className="space-y-3">
            {hasFollowUpNote ? (
              <button
                type="button"
                onClick={() => copyText(guidance.followUpNoteDraft)}
                className="rounded-xl border border-brand-gray200 bg-white px-3 py-2 text-sm font-extrabold text-brand-charcoal transition hover:bg-brand-gray100"
              >
                Copy Follow-Up Note
              </button>
            ) : null}
            <PacketList items={followUpItems} tone="neutral" />
          </div>
        </PrepBriefSection>
        {role === "Instructor" ? (
          <PrepBriefSection title="GPT Follow-Up Prompt" tone="neutral">
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => copyText(gptFollowUpPrompt)}
                className="rounded-xl border border-brand-gray200 bg-white px-3 py-2 text-sm font-extrabold text-brand-charcoal transition hover:bg-brand-gray100"
              >
                Copy Follow-Up Text
              </button>
              <p>{gptFollowUpPrompt}</p>
            </div>
          </PrepBriefSection>
        ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
};

export default function Home() {
  const [selectedWorkflow, setSelectedWorkflow] =
    useState<Workflow>("Training / Lesson Plan");
  const [engagementType, setEngagementType] =
    useState<EngagementType>(workflowConfig["Training / Lesson Plan"].engagementType);
  const [role, setRole] = useState<UserRole>("Instructor");
  const [roleEngagement, setRoleEngagement] = useState<RoleEngagement>(
    workflowConfig["Training / Lesson Plan"].roleEngagement,
  );
  const [selectedTopics, setSelectedTopics] =
    useState<Topic[]>(instructorDefaultTopics);
  const [audience, setAudience] = useState<Audience>(
    workflowConfig["Training / Lesson Plan"].audience,
  );
  const [selectedSampleSite, setSelectedSampleSite] = useState(
    "Fire Department Recruit Training Site",
  );
  const [selectedServiceLensId, setSelectedServiceLensId] = useState(serviceLenses[0].id);
  const [briefAction, setBriefAction] = useState<BriefAction>(
    workflowConfig["Training / Lesson Plan"].briefAction,
  );
  const [selectedSections, setSelectedSections] = useState<PrepSection[]>(
    workflowConfig["Training / Lesson Plan"].recommended,
  );
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
  const applyWorkflow = (nextWorkflow: Workflow) => {
    const config = workflowConfig[nextWorkflow];
    setSelectedWorkflow(nextWorkflow);
    setRole(config.role);
    setRoleEngagement(config.roleEngagement);
    setEngagementType(config.engagementType);
    setAudience(config.audience);
    setBriefAction(config.briefAction);
    setSelectedSections(config.recommended);
    setGuidance(null);

    if (config.role === "Instructor") {
      setSelectedTopics(instructorDefaultTopics);
      return;
    }

    setSelectedTopics(inspectorDefaultTopics);
  };
  const toggleSection = (section: PrepSection) => {
    setSelectedSections((current) =>
      current.includes(section)
        ? current.filter((item) => item !== section)
        : [...current, section],
    );
    setGuidance(null);
  };
  const sourceContextUsed = [
    "Automatic product safety review based on selected site equipment",
    `Workflow: ${selectedWorkflow}`,
    `Selected sections: ${selectedSections.join(", ") || "None selected"}`,
    `Equipment / Assets: ${selectedTopics.join(", ") || "None selected"}`,
    "No manual product safety recall selected. Packet is based on engagement, client/site record, equipment/assets, prep context, and automatic product safety review.",
    `Customer/Site Profile: ${selectedSiteDetails.label}`,
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
          workflow: selectedWorkflow,
          selectedSections,
          clientRecord: selectedClientRecord,
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

  const startNewPacket = () => {
    const config = workflowConfig["Training / Lesson Plan"];
    setSelectedWorkflow("Training / Lesson Plan");
    setEngagementType(config.engagementType);
    setRole(config.role);
    setRoleEngagement(config.roleEngagement);
    setSelectedTopics(instructorDefaultTopics);
    setAudience(config.audience);
    setSelectedSampleSite("Fire Department Recruit Training Site");
    setSelectedServiceLensId(serviceLenses[0].id);
    setBriefAction(config.briefAction);
    setSelectedSections(config.recommended);
    setGuidance(null);
    setSummaryError("");
    setAdditionalNotes("");
  };

  return (
    <main className="min-h-screen bg-brand-gray100 text-brand-charcoal">
      <header className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6 sm:py-4">
          <Image
            src="/ryan-logo.png"
            alt="Ryan Fire Protection, Inc."
            width={1280}
            height={551}
            priority
            className="h-auto w-32 sm:w-48"
          />
          <h1 className="mt-2 text-[23px] font-black leading-tight text-brand-charcoal sm:text-[32px]">
            Engagement Assistant
          </h1>
          <p className="mt-1 text-sm leading-6 text-brand-gray700 sm:text-base">
            Get AI-generated guidance for inspections, training, and service visits.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
        <section className="rounded-2xl border border-brand-gray200 bg-white p-3 shadow-sm sm:p-5">
          <div className="grid gap-4">
            <div>
              <h2 className="text-lg font-black text-brand-charcoal">
                1. Select Workflow
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {workflows.map((item) => {
                  const selected = selectedWorkflow === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => applyWorkflow(item)}
                      className={`rounded-xl border px-3 py-2 text-left text-sm font-extrabold leading-5 transition ${
                        selected
                          ? "border-brand-green bg-brand-green text-white"
                          : "border-brand-gray200 bg-white text-brand-charcoal hover:border-brand-green hover:bg-green-50"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-black text-brand-charcoal">
                2. Select Client / Site
              </h2>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
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
                      className={`min-h-10 rounded-xl border px-3 py-2.5 text-left text-sm font-extrabold leading-5 transition ${
                        selected
                          ? "border-brand-green bg-brand-green text-white"
                          : "border-brand-gray200 bg-white text-brand-charcoal hover:border-brand-green hover:bg-green-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-black text-brand-charcoal">
                3. AI Review of Site Record
              </h2>
              <div className="mt-2 grid gap-2 text-sm text-brand-gray700 sm:grid-cols-2">
                {[
                  [
                    "What matters",
                    [
                      whatMattersForRecord(
                        selectedWorkflow,
                        selectedClientRecord,
                        selectedSampleSite,
                      ),
                    ],
                  ],
                  ["Equipment / Assets", selectedClientRecord.equipmentAssets],
                  [
                    "Training / Certificate Status",
                    [trainingStatusSummary(selectedClientRecord)],
                  ],
                  ["Open Items", selectedClientRecord.openItems],
                  [
                    "Open Items / AI-Flagged Prep",
                    flagsForRecord(
                      selectedWorkflow,
                      selectedClientRecord,
                      automaticSafetyReview,
                    ),
                  ],
                  [
                    "Equipment / Product Safety Context",
                    [
                      `Terms: ${selectedClientRecord.productSafetyTerms.join(", ")}`,
                      "Search Product Safety Context: auto-reviewed from site record",
                    ],
                  ],
                  [
                    "Resources Available",
                    sortResources(selectedClientRecord, selectedWorkflow, selectedSections)
                      .slice(0, 3)
                      .map((resource) => resource.title),
                  ],
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

            <div>
              <h2 className="text-lg font-black text-brand-charcoal">
                4. AI Recommended Prep
              </h2>
              <div className="mt-2 space-y-3">
                <div>
                  <p className="text-xs font-black text-brand-green">Recommended</p>
                  <div className="mt-1 flex max-w-full flex-wrap gap-1.5 overflow-hidden">
                    {workflowConfig[selectedWorkflow].recommended.map((section) => {
                      const selected = selectedSections.includes(section);
                      return (
                        <button
                          key={section}
                          type="button"
                          onClick={() => toggleSection(section)}
                          title={recommendationReason(
                            section,
                            selectedWorkflow,
                            selectedClientRecord,
                          )}
                          className={`max-w-full rounded-lg border px-2.5 py-1.5 text-left text-xs leading-5 transition sm:text-sm ${
                            selected
                              ? "border-brand-green bg-green-50 text-brand-green"
                              : "border-brand-gray200 bg-white text-brand-charcoal hover:border-brand-green hover:bg-green-50"
                          }`}
                        >
                          <span className="block font-extrabold">{section}</span>
                          {selected ? (
                            <span className="block text-[10px] font-bold uppercase tracking-wide text-brand-gray500">
                              AI recommended
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black text-brand-gray500">Optional</p>
                  <div className="mt-1 flex max-w-full flex-wrap gap-1.5 overflow-hidden">
                    {workflowConfig[selectedWorkflow].optional.map((section) => {
                      const selected = selectedSections.includes(section);
                      return (
                        <button
                          key={section}
                          type="button"
                          onClick={() => toggleSection(section)}
                          className={`max-w-full rounded-lg border px-2.5 py-1.5 text-xs font-bold leading-5 transition sm:text-sm ${
                            selected
                              ? "border-brand-green bg-green-50 text-brand-green"
                              : "border-brand-gray200 bg-white text-brand-charcoal hover:border-brand-green hover:bg-green-50"
                          }`}
                        >
                          {section}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-black text-brand-charcoal">
                5. Source Materials
              </h2>
              <p className="mt-1 text-xs font-bold leading-5 text-brand-gray500">
                Used by AI to build the preview and expanded sections.
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {sortResources(selectedClientRecord, selectedWorkflow, selectedSections).map((resource, index) => {
                  const status = sourceMaterialStatus(resource, index, selectedSections);
                  return (
                    <div
                      key={resource.title}
                      className="rounded-xl border border-brand-gray200 bg-white px-3 py-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-black text-brand-charcoal">
                            {resource.title}
                          </p>
                          <p className="mt-0.5 text-xs font-bold text-brand-green">
                            {resource.type}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-lg border px-2 py-1 text-[11px] font-black ${
                            status === "Included"
                              ? "border-green-700/20 bg-green-50 text-brand-green"
                              : "border-brand-gray200 bg-white text-brand-gray700"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-brand-gray700">
                        {resource.description}
                      </p>
                      {resource.purpose ? (
                        <p className="mt-1 text-xs leading-5 text-brand-gray500">
                          Purpose: {resource.purpose}
                        </p>
                      ) : null}
                      {resource.sampleNote ? (
                        <p className="mt-1 text-xs leading-5 text-brand-gray500">
                          {resource.sampleNote}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-center sm:justify-end">
            <button
              type="button"
              onClick={() => void generateSummary(null, briefAction)}
              disabled={Boolean(summarizingId) || selectedSections.length === 0}
              className="w-full rounded-xl bg-brand-green px-5 py-4 text-center text-base font-black text-white transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:bg-brand-gray500 sm:w-auto"
            >
              {summarizingId
                ? "Generating Preview..."
                : "Generate Preview"}
            </button>
          </div>

          {summarizingId === "engagement-packet" ? (
            <div className="mt-5 rounded-xl border border-brand-gray200 bg-white p-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-brand-gray100">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-green" />
              </div>
              <p className="mt-3 text-sm font-extrabold text-brand-charcoal">
                Reviewing site equipment, service context, and product safety information.
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
                workflow={selectedWorkflow}
                selectedSections={selectedSections}
                record={selectedClientRecord}
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
        © 2026 Amy Melangton. All rights reserved. Proof-of-concept demo
        created for portfolio/application review. Ryan Fire Protection names,
        logos, and references are used only for contextual demonstration; no
        ownership or affiliation is claimed. Verify official sources,
        manufacturer instructions, applicable codes, NFPA standards, department
        requirements, company procedures, and AHJ requirements before action.
      </footer>
    </main>
  );
}

