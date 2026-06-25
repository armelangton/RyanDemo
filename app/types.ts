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
  relatedServiceConsiderations: string[];
  recommendedNextBestActions: string[];
  followUpNoteDraft: string;
  missingInformationToVerify: string[];
  officialSourceReminder: string;
};
