"use client"

import React, { useMemo } from "react"
import { useTasks } from "./task-context"
import { TrendingUp, Flame, Clock } from "lucide-react"

export function StatsSection() {
  const { tasks, isLoading } = useTasks()

  // Calculate real stats from tasks
  const stats = useMemo(() => {
    if (isLoading || !tasks.length) {
      return {
        completionPercentage: 0,
        completedCount: 0,
        totalCount: 0,
        activeCount: 0,
        nextDueDate: null,
        nextDueTask: null,
        daysUntilDue: 0,
      }
    }

    const totalCount = tasks.length
    const completedCount = tasks.filter((t) => t.status === "completed").length
    const activeCount = tasks.filter((t) => t.status !== "completed").length
    const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    // Find next due task
    const now = Date.now()
    const tasksWithDueDate = tasks
      .filter((t) => t.dueDate && t.status !== "completed")
      .sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0))

    const nextDueTask = tasksWithDueDate[0] || null
    const nextDueDate = nextDueTask?.dueDate || null

    let daysUntilDue = 0
    let dueDateLabel = "No due dates"

    if (nextDueDate) {
      const daysMs = nextDueDate - now
      daysUntilDue = Math.ceil(daysMs / (1000 * 60 * 60 * 24))

      if (daysUntilDue < 0) {
        dueDateLabel = `${Math.abs(daysUntilDue)} days overdue`
      } else if (daysUntilDue === 0) {
        dueDateLabel = "Due today"
      } else if (daysUntilDue === 1) {
        dueDateLabel = "Due tomorrow"
      } else {
        dueDateLabel = `Due in ${daysUntilDue} days`
      }
    }

    return {
      completionPercentage,
      completedCount,
      totalCount,
      activeCount,
      nextDueDate,
      nextDueTask,
      daysUntilDue,
      dueDateLabel,
    }
  }, [tasks, isLoading])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-card border border-border animate-pulse" />
        ))}
      </div>
    )
  }

  const isOverdue = stats.daysUntilDue < 0
  const isUrgent = stats.daysUntilDue <= 1 && stats.daysUntilDue >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Productivity Card */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/30 transition">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TrendingUp className="size-5" />
          <span className="text-sm font-medium">Productivity</span>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-bold text-primary">{stats.completionPercentage}%</div>
          <span className="text-xs text-muted-foreground">
            {stats.completedCount}/{stats.totalCount}
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{ width: `${stats.completionPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {stats.activeCount} active task{stats.activeCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Active Tasks Card */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 space-y-3 hover:border-primary/40 transition">
        <div className="flex items-center gap-2 text-primary">
          <Flame className="size-5" />
          <span className="text-sm font-medium">Active Tasks</span>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-bold text-foreground">{stats.activeCount}</div>
          <span className="text-xs text-muted-foreground">to complete</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {stats.totalCount === 0
            ? "Start by creating your first task!"
            : stats.activeCount === 0
              ? "All caught up! 🎉"
              : `Keep pushing forward!`}
        </p>
      </div>

      {/* Next Due Card */}
      <div
        className={`rounded-xl p-6 space-y-3 transition border ${
          isOverdue
            ? "bg-destructive/5 border-destructive/20 hover:border-destructive/40"
            : isUrgent
              ? "bg-warning/5 border-warning/20 hover:border-warning/40"
              : "bg-card border-border hover:border-primary/30"
        }`}
      >
        <div className={`flex items-center gap-2 ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : "text-muted-foreground"}`}>
          <Clock className="size-5" />
          <span className="text-sm font-medium">Next Due</span>
        </div>
        <div className="space-y-2">
          <div className={`text-2xl font-bold ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : "text-foreground"}`}>
            {stats.dueDateLabel}
          </div>
          {stats.nextDueTask && (
            <div className="text-xs text-muted-foreground truncate">
              📌 {stats.nextDueTask.title}
            </div>
          )}
        </div>
        <p className={`text-xs ${isOverdue ? "text-destructive/70" : isUrgent ? "text-warning/70" : "text-muted-foreground"}`}>
          {stats.nextDueTask
            ? isOverdue
              ? "Review overdue task"
              : isUrgent
                ? "High priority"
                : "Plan ahead"
            : "No pending tasks"}
        </p>
      </div>
    </div>
  )
}
