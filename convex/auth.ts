import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get current user
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    return user || null;
  },
});

/**
 * Create user if doesn't exist
 */
export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    // If there's no identity yet, don't throw — caller can retry later.
    if (!identity) return null;

    const userId = identity.subject;
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) {
      const id = await ctx.db.insert("users", {
        clerkId: userId,
        email: identity.email || "",
        displayName: String(identity.nickname || identity.given_name || "User"),
        createdAt: Date.now(),
      });
      user = await ctx.db.get(id);
    }

    return user;
  },
});

/**
 * Update user profile
 */
export const updateProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const userId = identity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) throw new ConvexError("User not found");

    const updates: any = {};
    if (args.displayName !== undefined) {
      updates.displayName = args.displayName;
    }

    await ctx.db.patch(user._id, updates);
    return await ctx.db.get(user._id);
  },
});
