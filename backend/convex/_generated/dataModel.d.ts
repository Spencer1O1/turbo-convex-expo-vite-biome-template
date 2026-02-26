// Temporary stub. Regenerate with `convex codegen`.
export type Tables = {
  organizations: {
    name: string;
    slug: string;
    createdAt: number;
  };
  users: {
    organizationId: Id<"organizations">;
    name: string;
    email: string;
    role: "student" | "maintainer" | "manager";
    createdAt: number;
  };
  assets: {
    organizationId: Id<"organizations">;
    nfcTag: string;
    name: string;
    location: string;
    category: string;
    status: "healthy" | "monitor" | "action_required";
    riskScore: number;
    assignedMaintainerId?: Id<"users">;
    createdAt: number;
    updatedAt: number;
  };
  reports: {
    organizationId: Id<"organizations">;
    assetId: Id<"assets">;
    reporterId: Id<"users">;
    notes: string;
    photoUrls: string[];
    createdAt: number;
  };
  aiInspections: {
    reportId: Id<"reports">;
    summary: string;
    overallPriority: number;
    findings: { type: string; severity: number; evidence: string }[];
    actions: {
      suggestedKey: string;
      title: string;
      description: string;
      reason: string;
      priority: number;
      riskValue: number;
      recommendedSteps: string[];
      estimatedCost: number;
    }[];
    createdAt: number;
  };
  workOrders: {
    organizationId: Id<"organizations">;
    assetId: Id<"assets">;
    sourceReportId: Id<"reports">;
    title: string;
    description: string;
    assignedTo?: Id<"users">;
    status: "open" | "in_progress" | "resolved";
    priority: number;
    createdAt: number;
    dueAt?: number;
  };
};

export type Doc<Table extends keyof Tables> = Tables[Table] & { _id: Id<Table> };
export type Id<Table extends keyof Tables> = string & { __table: Table };
