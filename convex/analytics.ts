import { v } from "convex/values";
import { query } from "./_generated/server";
// Function to get monthly statistics for the dashboard

async function getUserId(ctx: any) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return identity.subject;
}

export const getMonthlyStats = query({
    args: {
        year: v.number(),
        month: v.number(), // 0-11
    },
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx);
        if (!userId) return null;

        const startOfMonth = new Date(args.year, args.month, 1).getTime();
        const endOfMonth = new Date(args.year, args.month + 1, 0, 23, 59, 59, 999).getTime();

        // Fetch all tasks for the user (we filter in memory because of complex date logic across multiple fields)
        const tasks = await ctx.db
            .query("tasks")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .collect();

        let totalTasksResult = 0;
        let completedTasks = 0;
        let overdueTasks = 0;
        let totalTimeLogged = 0;
        let dailyTimeBreakdown: Record<string, number> = {};

        const now = Date.now();

        for (const task of tasks) {
            const createdInMonth = task.createdAt >= startOfMonth && task.createdAt <= endOfMonth;
            const completedInMonth = task.completedAt && task.completedAt >= startOfMonth && task.completedAt <= endOfMonth;

            if (createdInMonth) totalTasksResult++;
            if (completedInMonth) completedTasks++;

            // Overdue check
            if (task.dueDate && task.dueDate >= startOfMonth && task.dueDate <= endOfMonth) {
                if (task.dueDate < now && task.status !== "completed") {
                    overdueTasks++;
                }
            }

            // Calculate time logged in this month from sessions
            if (task.timerSessions) {
                for (const session of task.timerSessions) {
                    const sessionStart = session.startedAt;
                    const sessionEnd = session.endedAt || (session.isActive ? now : session.startedAt + session.duration);

                    // Portion of the session that falls within the requested month
                    const effectiveStart = Math.max(sessionStart, startOfMonth);
                    const effectiveEnd = Math.min(sessionEnd, endOfMonth);

                    if (effectiveStart < effectiveEnd) {
                        const durationInMonth = effectiveEnd - effectiveStart;
                        totalTimeLogged += durationInMonth;

                        // Daily breakdown (using the day of the effective start in the requested month)
                        const dayKey = new Date(effectiveStart).getDate().toString();
                        dailyTimeBreakdown[dayKey] = (dailyTimeBreakdown[dayKey] || 0) + durationInMonth;
                    }
                }
            }

            // Include current active timer if not already in timerSessions (usually it's not)
            if (task.currentTimerStart && (!task.timerSessions || !task.timerSessions.some(s => s.isActive))) {
                const sessionStart = task.currentTimerStart;
                const sessionEnd = now;

                const effectiveStart = Math.max(sessionStart, startOfMonth);
                const effectiveEnd = Math.min(sessionEnd, endOfMonth);

                if (effectiveStart < effectiveEnd) {
                    const durationInMonth = effectiveEnd - effectiveStart;
                    totalTimeLogged += durationInMonth;
                    const dayKey = new Date(effectiveStart).getDate().toString();
                    dailyTimeBreakdown[dayKey] = (dailyTimeBreakdown[dayKey] || 0) + durationInMonth;
                }
            }
        }

        const averageTimePerTask = completedTasks > 0 ? totalTimeLogged / completedTasks : 0;

        return {
            totalTasks: totalTasksResult,
            completedTasks,
            overdueTasks,
            totalTimeLogged, // milliseconds
            averageTimePerTask, // milliseconds
            dailyTimeBreakdown, // { "1": ms, "2": ms }
        };
    },
});
