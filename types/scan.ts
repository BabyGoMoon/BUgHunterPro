export type ScanRequest = { url: string };
export type ScanStatus = "queued" | "running" | "done" | "failed";
export type Finding = { id: string; title: string; severity: "low" | "medium" | "high" | "critical"; path?: string; description?: string; remediation?: string; };
export type ScanResult = { id: string; url: string; status: ScanStatus; findings: Finding[]; startedAt: string; finishedAt?: string; };
