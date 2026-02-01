import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

async function getUserId(ctx: any) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return identity.subject;
}

/**
 * List comments for a task
 */
export const list = query({
    args: { taskId: v.id("tasks") },
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx);
        if (!userId) return []; // Or throw error

        // Verify user has access to this task (optional but good practice)
        const task = await ctx.db.get(args.taskId);
        if (!task) return [];
        if (task.userId && task.userId !== userId) return [];

        const comments = await ctx.db
            .query("comments")
            .withIndex("by_taskId", (q) => q.eq("taskId", args.taskId))
            .order("asc") // Oldest first
            .collect();

        // Enrich with user info if needed, but for now just return content
        return comments;
    },
});

/**
 * Add a comment to a task
 */
export const add = mutation({
    args: {
        taskId: v.id("tasks"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx);
        if (!userId) throw new ConvexError("Unauthenticated");

        const task = await ctx.db.get(args.taskId);
        if (!task) throw new ConvexError("Task not found");
        if (task.userId && task.userId !== userId) throw new ConvexError("Unauthorized");

        const commentId = await ctx.db.insert("comments", {
            taskId: args.taskId,
            userId,
            content: args.content,
            createdAt: Date.now(),
        });

        return commentId;
    },
});
