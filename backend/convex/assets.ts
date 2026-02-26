import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { evaluateInspection, statusFromPriority } from "./lib/inspection";

export const listAssets = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const assets = await ctx.db
      .query("assets")
      .withIndex("by_org", (q: any) => q.eq("organizationId", args.organizationId))
      .collect();

    return assets.sort((a: any, b: any) => b.riskScore - a.riskScore);
  },
});

export const registerAsset = mutation({
  args: {
    organizationId: v.id("organizations"),
    nfcTag: v.string(),
    name: v.string(),
    location: v.string(),
    category: v.string(),
    assignedMaintainerId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("assets", {
      ...args,
      riskScore: 0.2,
      status: "healthy",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const submitReport = mutation({
  args: {
    organizationId: v.id("organizations"),
    assetId: v.id("assets"),
    reporterId: v.id("users"),
    notes: v.string(),
    photoUrls: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const reportId = await ctx.db.insert("reports", {
      ...args,
      createdAt: now,
    });

    const inspection = evaluateInspection(args.notes, args.photoUrls);

    await ctx.db.insert("aiInspections", {
      reportId,
      summary: inspection.summary,
      overallPriority: inspection.overallPriority,
      findings: inspection.findings,
      actions: inspection.actions,
      createdAt: now,
    });

    const asset = await ctx.db.get(args.assetId);
    if (asset) {
      const updatedRisk = Number(
        (asset.riskScore * 0.55 + inspection.overallPriority * 0.45).toFixed(2),
      );
      await ctx.db.patch(args.assetId, {
        riskScore: updatedRisk,
        status: statusFromPriority(updatedRisk),
        updatedAt: now,
      });

      if (inspection.actions.length > 0) {
        const primaryAction = inspection.actions[0];
        await ctx.db.insert("workOrders", {
          organizationId: args.organizationId,
          assetId: args.assetId,
          sourceReportId: reportId,
          title: primaryAction.title,
          description: primaryAction.description,
          assignedTo: asset.assignedMaintainerId,
          status: "open",
          priority: primaryAction.priority,
          createdAt: now,
          dueAt:
            primaryAction.priority >= 0.75
              ? now + 1000 * 60 * 60 * 12
              : now + 1000 * 60 * 60 * 24 * 3,
        });
      }
    }

    return { reportId, inspection };
  },
});

export const dashboard = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const assets = await ctx.db
      .query("assets")
      .withIndex("by_org", (q: any) => q.eq("organizationId", args.organizationId))
      .collect();

    const workOrders = await ctx.db.query("workOrders").collect();

    const openWorkOrders = workOrders.filter((order: any) => order.status !== "resolved").length;
    const highRiskAssets = assets.filter((asset: any) => asset.riskScore >= 0.75).length;
    const monitorAssets = assets.filter(
      (asset: any) => asset.riskScore >= 0.45 && asset.riskScore < 0.75,
    ).length;

    return {
      totals: {
        assets: assets.length,
        openWorkOrders,
        highRiskAssets,
        monitorAssets,
      },
      assets: assets.sort((a: any, b: any) => b.riskScore - a.riskScore),
    };
  },
});
