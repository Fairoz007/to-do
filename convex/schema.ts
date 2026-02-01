import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"]),

  tasks: defineTable({
    userId: v.optional(v.string()), // Clerk user ID (optional for existing records)
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("overdue")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    
    // Timer tracking
    totalTimeSpent: v.optional(v.number()), // milliseconds
    timerSessions: v.optional(v.array(
      v.object({
        startedAt: v.number(),
        endedAt: v.optional(v.number()),
        duration: v.number(), // milliseconds
        isActive: v.boolean(),
      })
    )),
    currentTimerStart: v.optional(v.number()), // For active timer
    
  })
    .index("by_userId", ["userId"])
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_userId_status", ["userId", "status"])
    .index("by_createdAt", ["createdAt"])
    .index("by_status", ["status"])
    .index("by_dueDate", ["dueDate"])
    .index("by_completedAt", ["completedAt"]),
});
