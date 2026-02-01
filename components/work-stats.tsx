"use client"

import React, { useMemo } from "react"
import { useTasks } from "./task-context"
import { Clock, Target, TrendingUp } from "lucide-react"

function formatHours(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

export function WorkStats() {
  const { tasks, isLoading } = useTasks()

  const stats = useMemo(() => {
    if (isLoading || !tasks.length) {
      return {
        totalWorkHours: 0,
        todayWorkHours: 0,
        weekWorkHours: 0,
        averagePerTask: 0,
        overdueTasks: 0,
        completedTasks: 0,
      }
    }

    const now = Date.now()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayMs = today.getTime()

    const weekAgo = todayMs - 7 * 24 * 60 * 60 * 1000

    let totalWorkHours = 0
    let todayWorkHours = 0
    let weekWorkHours = 0
    let overdueTasks = 0
    const completedTasks = tasks.filter((t) => t.status === "completed").length

    tasks.forEach((task) => {
      totalWorkHours += task.totalTimeSpent || 0

      // Today's work
      if (task.completedAt && task.completedAt >= todayMs) {
        todayWorkHours += task.totalTimeSpent || 0
      }

      // This week's work
      if (task.completedAt && task.completedAt >= weekAgo) {
        weekWorkHours += task.totalTimeSpent || 0
      }

      // Overdue tasks
      if (task.dueDate && task.dueDate < now && task.status !== "completed") {
        overdueTasks += 1
      }
    })

    const averagePerTask = tasks.length > 0 ? totalWorkHours / tasks.length : 0

    return {
      totalWorkHours,
      todayWorkHours,
      weekWorkHours,
      averagePerTask,
      overdueTasks,
      completedTasks,
    }
  }, [tasks, isLoading])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-card border border-border animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Work Hours */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-2 hover:border-primary/30 transition">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-4" />
          <span className="text-xs font-medium">Total Work Hours</span>
        </div>
        <div className="text-2xl font-bold text-primary">{formatHours(stats.totalWorkHours)}</div>
        <p className="text-xs text-muted-foreground">Across all tasks</p>
      </div>

      {/* This Week */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-2 hover:border-primary/30 transition">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TrendingUp className="size-4" />
          <span className="text-xs font-medium">This Week</span>
        </div>
        <div className="text-2xl font-bold text-success">{formatHours(stats.weekWorkHours)}</div>
        <p className="text-xs text-muted-foreground">7-day average</p>
      </div>

      {/* Productivity */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-2 hover:border-primary/30 transition">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Target className="size-4" />
          <span className="text-xs font-medium">Avg per Task</span>
        </div>
        <div className="text-2xl font-bold text-warning">{formatHours(stats.averagePerTask)}</div>
        <p className="text-xs text-muted-foreground">
          {stats.overdueTasks} overdue • {stats.completedTasks} completed
        </p>
      </div>
    </div>
  )
}
