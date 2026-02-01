"use client"

import React from "react"
import { useTasks, type TaskStatus, type Task } from "./task-context"
import { TaskTimer } from "./task-timer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Trash2, Clock, CircleDot, CheckCircle2, Play, Flag, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TaskCardEnhancedProps extends Task {
  id: string
}

const statusConfig: Record<TaskStatus, { label: string; icon: React.ReactNode; className: string }> = {
  pending: {
    label: "Pending",
    icon: <CircleDot className="size-3" />,
    className: "bg-warning/20 text-warning border-warning/30",
  },
  in_progress: {
    label: "In Progress",
    icon: <Play className="size-3" />,
    className: "bg-primary/20 text-primary border-primary/30",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 className="size-3" />,
    className: "bg-success/20 text-success border-success/30",
  },
  overdue: {
    label: "Overdue",
    icon: <Clock className="size-3" />,
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
} as const

// Fallback for old status values that might still be in DB
const getStatusConfig = (status: any) => {
  if (status in statusConfig) {
    return statusConfig[status as TaskStatus]
  }
  // Fallback for old status values
  const fallbackMap: Record<string, typeof statusConfig['pending']> = {
    open: statusConfig.pending,
    closed: statusConfig.completed,
  }
  return fallbackMap[status] || statusConfig.pending
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-blue-500/20 text-blue-700 dark:text-blue-400" },
  medium: { label: "Medium", color: "bg-amber-500/20 text-amber-700 dark:text-amber-400" },
  high: { label: "High", color: "bg-red-500/20 text-red-700 dark:text-red-400" },
}

export function TaskCardEnhanced({
  _id,
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  createdAt,
  totalTimeSpent,
  currentTimerStart,
}: TaskCardEnhancedProps) {
  const { updateTaskStatus, deleteTask } = useTasks()

  const config = getStatusConfig(status)
  const priorityInfo = priorityConfig[priority]

  const handleStatusChange = () => {
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      pending: "in_progress",
      in_progress: "completed",
      completed: "pending",
      overdue: "in_progress",
    }
    updateTaskStatus(_id, nextStatus[status])
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(_id)
    }
  }

  const isOverdue =
    dueDate && new Date(dueDate).getTime() < Date.now() && status !== "closed"

  return (
    <Card className="overflow-hidden bg-card border-border hover:border-primary/30 transition-all hover:shadow-md">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          {/* Title & Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-card-foreground truncate ${
                  status === "closed" ? "line-through opacity-60" : ""
                }`}
              >
                {title}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
            <Badge variant="outline" className={config.className}>
              {config.icon}
              {config.label}
            </Badge>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Priority Badge */}
            <div className={`px-2 py-1 rounded-full ${priorityInfo.color}`}>
              <div className="flex items-center gap-1">
                <Flag className="size-3" />
                {priorityInfo.label}
              </div>
            </div>

            {/* Due Date */}
            {dueDate && (
              <div
                className={`px-2 py-1 rounded-full flex items-center gap-1 ${
                  isOverdue
                    ? "bg-destructive/20 text-destructive"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <Calendar className="size-3" />
                {new Date(dueDate).toLocaleDateString()}
                {isOverdue && " (Overdue)"}
              </div>
            )}

            {/* Created Date */}
            <div className="px-2 py-1 rounded-full bg-secondary text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" />
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            {/* Timer Component - Primary Action */}
            <TaskTimer
              taskId={_id}
              totalTimeSpent={totalTimeSpent}
              currentTimerStart={currentTimerStart}
              taskStatus={status}
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Delete task</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
