export type WorkflowType = "go-release" | "npm-wrapper";

export interface GeneratedSummary {
  repo_url: string;
  binary_name: string;
  version?: string;
  platforms: string[];
  asset_urls?: Record<string, string[]>;
  [key: string]: unknown;
}

export interface SessionData {
  workflow: WorkflowType;
  summary: GeneratedSummary;
  files: Record<string, string>;
}
