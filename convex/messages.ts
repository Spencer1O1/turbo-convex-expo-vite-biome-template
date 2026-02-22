import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("messages")
      .order("desc")
      .collect();
  },
});

export const send = mutation({
  args: { body: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      body: args.body,
      createdAt: Date.now(),
    });
  },
});
