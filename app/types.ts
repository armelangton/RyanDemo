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

export type AiGuidance = {
  sourceContextUsed: string[];
  knownSourceFacts: string[];
  providedDemoProfileContext: string[];
  aiInterpretation: string[];
  readinessScore: number;
  readinessScoreReason: string;
  keyAttentionFlags: string[];
  internalFieldBrief: string;
  audienceSpecificTalkingPoints: string[];
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
