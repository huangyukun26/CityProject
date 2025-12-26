export type Role = "Admin" | "Reviewer" | "User";

export type DatasetStatus = "Draft" | "Submitted" | "Approved" | "Rejected";

export interface UserSession {
  username: string;
  role: Role;
}

export interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  content?: string;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: DatasetStatus;
  deleted?: boolean;
  files: UploadFile[];
}

export interface ApprovalEntry {
  id: string;
  datasetId: string;
  action: "Submitted" | "Approved" | "Rejected";
  actor: string;
  role: Role;
  note: string;
  time: string;
}

export interface ModelVersion {
  id: string;
  name: string;
  version: string;
  releasedAt: string;
  metrics: {
    mae: number;
    psnr: number;
  };
  description: string;
  diff: string[];
}

export interface NDVIResult {
  grid: number[][];
  average: number;
  vegetationRatio: number;
  histogram: { bucket: string; value: number }[];
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
}

export interface BackupRecord {
  id: string;
  time: string;
  datasetCount: number;
  size: string;
  status: "Success" | "Failed";
}
