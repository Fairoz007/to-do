import { v, ConvexError } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get user ID from auth context
 */
const getUserId = async (ctx: any): Promise<string | null> => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return identity.subject;
};

/**
 * Get all tasks for the authenticated user (latest first)
 */
export const list = query({
  args: {
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    dueDateStart: v.optional(v.number()),
    dueDateEnd: v.optional(v.number()),
    isOverdue: v.optional(v.boolean()),
    isDueToday: v.optional(v.boolean()),
    quickTask: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    let tasks = await ctx.db
      .query("tasks")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    if (args.status) {
      if (args.status === "completed") {
        tasks = tasks.filter(t => t.status === "completed");
      } else {
        tasks = tasks.filter(t => t.status !== "completed");
      }
    }

    if (args.priority) {
      tasks = tasks.filter(t => t.priority === args.priority);
    }

    if (args.dueDateStart && args.dueDateEnd) {
      tasks = tasks.filter(t => t.dueDate && t.dueDate >= args.dueDateStart! && t.dueDate <= args.dueDateEnd!);
    }

    const now = Date.now();

    if (args.isOverdue) {
      tasks = tasks.filter(t => t.dueDate && t.dueDate < now && t.status !== "completed");
    }

    if (args.isDueToday) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      tasks = tasks.filter(t => t.dueDate && t.dueDate >= todayStart.getTime() && t.dueDate <= todayEnd.getTime());
    }

    if (args.quickTask) {
      tasks = tasks.filter(t => (t.timeAllowed || 0) > 0 && (t.timeAllowed || 0) <= 30 * 60 * 1000);
    }

    // Default sort: Descending by creation if not specific logic (frontend sorts too, but good to have base order)
    return tasks.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Create a new task for the authenticated user
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.number(),
    timeAllowed: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    return await ctx.db.insert("tasks", {
      userId,
      title: args.title,
      description: args.description,
      status: "pending",
      priority: args.priority ?? "medium",
      dueDate: args.dueDate,
      timeAllowed: args.timeAllowed,
      totalTimeSpent: 0,
      timerSessions: [],
      createdAt: Date.now(),
    });
  },
});

/**
 * Update task status
 */
export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("overdue")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const task = await ctx.db.get(args.id);
    if (!task || task.userId !== userId) throw new Error("Unauthorized");

    const updates: any = { status: args.status };
    if (args.status === "completed") {
      updates.completedAt = Date.now();
    }
    await ctx.db.patch(args.id, updates);
  },
});

/**
 * Update full task (edit)
 */
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
    timeAllowed: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const task = await ctx.db.get(args.id);
    if (!task || task.userId !== userId) throw new Error("Unauthorized");

    const { id, ...updates } = args;
    await ctx.db.patch(id, Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    ) as any);
  },
});

/**
 * Delete a task
 */
export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const task = await ctx.db.get(args.id);
    if (!task || task.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});

/**
 * Start timer for a task
 */
export const startTimer = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    if (task.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, {
      currentTimerStart: Date.now(),
      status: "in_progress",
    });
  },
});

/**
 * Stop timer and save session
 */
export const stopTimer = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    if (task.userId !== userId) throw new Error("Unauthorized");
    if (!task.currentTimerStart) throw new Error("Timer not running");

    const duration = Date.now() - task.currentTimerStart;
    const newSession = {
      startedAt: task.currentTimerStart,
      endedAt: Date.now(),
      duration,
      isActive: false,
    };

    await ctx.db.patch(args.id, {
      timerSessions: [...(task.timerSessions || []), newSession],
      totalTimeSpent: (task.totalTimeSpent || 0) + duration,
      currentTimerStart: undefined,
    });
  },
});

/**
 * Get tasks by month (for monthly view) - for authenticated user
 */
export const listByMonth = query({
  args: {
    year: v.number(),
    month: v.number(), // 0-11
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];
    const monthStart = new Date(args.year, args.month, 1).getTime();
    const monthEnd = new Date(args.year, args.month + 1, 0).getTime();

    return await ctx.db
      .query("tasks")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
      .filter(
        (q) =>
          q.and(
            q.gte(q.field("createdAt"), monthStart),
            q.lte(q.field("createdAt"), monthEnd)
          )
      )
      .order("desc")
      .collect();
  },
});

/**
 * Get work history (all completed tasks) for authenticated user
 */
export const getCompletedTasks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("tasks")
      .withIndex("by_userId_status", (q) => q.eq("userId", userId).eq("status", "completed"))
      .order("desc")
      .collect();
  },
});