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
  plainEnglishSummary: string;
  whyItMatters: string;
  internalFollowUp: string[];
  serviceTeamChecklist: string[];
  customerCommunicationDraft: string;
  riskReviewNote: string;
};
