export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type UploadResult = {
  batchId: string;
  totalRecords: number;
};

export type ThemeStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Theme = {
  id: string;
  title: string;
  problemStatement: string;
  status: ThemeStatus;
  aiConfidence: number | null;
  feedbackCount: number;
};

export type ThemeUpdate = {
  status?: ThemeStatus;
  title?: string;
  problemStatement?: string;
};

export type GeneratedTheme = {
  title: string;
  problemStatement: string;
  confidence: number;
  feedbackIds: string[];
};

export type GenerateThemesResult = {
  batchId: string;
  totalFeedback: number;
  totalThemes: number;
  themes: GeneratedTheme[];
};

export type ReportSentiment = "Positive" | "Neutral" | "Negative";
export type ReportPriority = "High" | "Medium" | "Low";

export type PriorityArea = {
  theme: string;
  priority: ReportPriority;
  reason: string;
};

export type ManagementReport = {
  executiveSummary: string;
  overallSentiment: ReportSentiment;
  keyFindings: string[];
  recommendations: string[];
  priorityAreas: PriorityArea[];
};

export type ReportRecord = {
  id: string;
  batchId: string;
  report: ManagementReport;
  createdAt: string;
};
