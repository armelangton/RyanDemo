export type RecallResult = {
  id: string;
  title: string;
  recallDate: string;
  manufacturer: string;
  productDescription: string;
  hazard: string;
  remedy: string;
  recallNumber: string;
  url: string;
  raw: Record<string, unknown>;
};

export type InstalledEquipment = {
  category: string;
  productName: string;
  manufacturer: string;
  model: string;
  locationContext: string;
  serviceStatus: string;
  documentationNote: string;
  trainingRelevance: string;
};

export type AutomaticSafetyReview = {
  equipmentChecked: InstalledEquipment[];
  searchTermsUsed: string[];
  possibleMatches: Array<{
    searchTerm: string;
    equipmentLabel: string;
    recall: RecallResult;
  }>;
  noObviousMatchTerms: string[];
  needsVerification: string[];
};

export type AiGuidance = {
  sourceContextUsed: string[];
  knownSourceFacts: string[];
  providedDemoProfileContext: string[];
  aiInterpretation: string[];
  role?: string;
  selectedTopics?: string[];
  keyAttentionFlags: string[];
  internalFieldBrief: string;
  standardsObjectiveAlignment?: string[];
  simpleLessonPlan?: string[];
  materialsEquipmentNeeded?: string[];
  certificationAttendanceReminders?: string[];
  audienceSpecificTalkingPoints: string[];
  installedEquipmentReview: string[];
  productSafetyRecallReview: string[];
  equipmentProductChecklist: string[];
  trainingOrEventPrepNotes: string[];
  protectPreventPreserveLens: string[];
  deficiencyDocumentationFollowUp: string[];
  relatedServiceConsiderations: string[];
  relatedServiceGroups: {
    safetyRiskReduction: string[];
    maintenanceTesting: string[];
    customerEducation: string[];
    documentationFollowUp: string[];
    modernizationReplacement: string[];
  };
  recommendedNextBestActions: string[];
  followUpNoteDraft: string;
  missingInformationToVerify: string[];
  officialSourceReminder: string;
};
