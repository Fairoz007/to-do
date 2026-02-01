"use client"

import React, { useMemo, useState } from "react"
import { useTasks } from "./task-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Clock, CheckCircle2 } from "lucide-react"
import { format, parseISO } from "date-fns"

interface WorkSession {
  taskId: string
  taskTitle: string
  taskDescription?: string
  completedAt: string
  totalTimeSpent: number
  priority: string
}

export function WorkHistory() {
  const { tasks } = useTasks()
  const [isExpanded, setIsExpanded] = useState(true)

  const workHistory = useMemo<WorkSession[]>(() => {
    const completed = tasks
      .filter((task) => task.status === "completed" && task.completedAt)
      .map((task) => ({
        taskId: task._id,
        taskTitle: task.title,
        taskDescription: task.description,
        completedAt: String(task.completedAt),
        totalTimeSpent: task.totalTimeSpent || 0,
        priority: task.priority || "medium",
      }))
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() -
          new Date(a.completedAt).getTime()
      )
    
    return completed
  }, [tasks])

  const stats = useMemo(() => {
    if (workHistory.length === 0) {
      return {
        totalCompleted: 0,
        totalTime: "0h 0m",
        avgTimePerTask: 0,
      }
    }

    const totalSeconds = workHistory.reduce((sum, item) => sum + item.totalTimeSpent, 0)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)

    const avgSeconds = Math.round(totalSeconds / workHistory.length)
    const avgHours = Math.floor(avgSeconds / 3600)
    const avgMinutes = Math.floor((avgSeconds % 3600) / 60)

    return {
      totalCompleted: workHistory.length,
      totalTime: `${hours}h ${minutes}m`,
      avgTimePerTask: avgSeconds,
      avgTimePerTaskFormatted: avgHours > 0 ? `${avgHours}h ${avgMinutes}m` : `${avgMinutes}m`,
    }
  }, [workHistory])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getPriorityColor = (priority: string) => {
    const colorMap: Record<string, string> = {
      low: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
      medium: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
      high: "bg-red-500/20 text-red-700 dark:text-red-400",
    }
    return colorMap[priority] || "bg-secondary text-muted-foreground"
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-success" />
            <CardTitle className="text-lg">Work History</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">
                  {stats.totalCompleted}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Completed</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-primary">
                  {stats.totalTime}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total Time</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-primary">
                  {stats.avgTimePerTaskFormatted || "0m"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Avg/Task</p>
              </div>
            </div>

            {/* History List */}
            {workHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="size-8 mx-auto mb-2 opacity-50" />
                <p>No completed tasks yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {workHistory.map((item) => (
                  <div
                    key={item.taskId}
                    className="flex items-start gap-3 border border-border rounded-lg p-3 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm text-card-foreground truncate">
                          {item.taskTitle}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs flex-shrink-0 ${getPriorityColor(item.priority)}`}
                        >
                          {item.priority}
                        </Badge>
                      </div>
                      {item.taskDescription && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                          {item.taskDescription}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatTime(item.totalTimeSpent)}
                        </span>
                        <span>
                          {item.completedAt 
                            ? (() => {
                                try {
                                  const date = typeof item.completedAt === 'string' 
                                    ? parseISO(item.completedAt)
                                    : new Date(item.completedAt)
                                  return format(date, "MMM d, yyyy")
                                } catch {
                                  return "N/A"
                                }
                              })()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
