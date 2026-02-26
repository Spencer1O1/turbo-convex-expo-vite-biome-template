import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),
  users: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("student"),
      v.literal("maintainer"),
      v.literal("manager"),
    ),
    createdAt: v.number(),
  }).index("by_org", ["organizationId"]),
  assets: defineTable({
    organizationId: v.id("organizations"),
    nfcTag: v.string(),
    name: v.string(),
    location: v.string(),
    category: v.string(),
    status: v.union(
      v.literal("healthy"),
      v.literal("monitor"),
      v.literal("action_required"),
    ),
    riskScore: v.number(),
    assignedMaintainerId: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["organizationId"])
    .index("by_tag", ["nfcTag"]),
  reports: defineTable({
    organizationId: v.id("organizations"),
    assetId: v.id("assets"),
    reporterId: v.id("users"),
    notes: v.string(),
    photoUrls: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_asset", ["assetId"])
    .index("by_org", ["organizationId"]),
  aiInspections: defineTable({
    reportId: v.id("reports"),
    summary: v.string(),
    overallPriority: v.number(),
    findings: v.array(
      v.object({
        type: v.string(),
        severity: v.number(),
        evidence: v.string(),
      }),
    ),
    actions: v.array(
      v.object({
        suggestedKey: v.string(),
        title: v.string(),
        description: v.string(),
        reason: v.string(),
        priority: v.number(),
        riskValue: v.number(),
        recommendedSteps: v.array(v.string()),
        estimatedCost: v.number(),
      }),
    ),
    createdAt: v.number(),
  }).index("by_report", ["reportId"]),
  workOrders: defineTable({
    organizationId: v.id("organizations"),
    assetId: v.id("assets"),
    sourceReportId: v.id("reports"),
    title: v.string(),
    description: v.string(),
    assignedTo: v.optional(v.id("users")),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
    ),
    priority: v.number(),
    createdAt: v.number(),
    dueAt: v.optional(v.number()),
  }).index("by_asset", ["assetId"]),
});
