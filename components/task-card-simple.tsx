"use client"

import React from "react"
import { useTasks, type Task } from "./task-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Flag, Calendar, Play, Pause, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Progress } from "@/components/ui/progress"

interface TaskCardProps extends Task {
  id: string
}

const priorityColors = {
  low: "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
  medium: "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30",
  high: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30",
}

const statusColors = {
  pending: "bg-gray-500/20 text-gray-700 dark:text-gray-400",
  in_progress: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  completed: "bg-green-500/20 text-green-700 dark:text-green-400",
  overdue: "bg-red-500/20 text-red-700 dark:text-red-400",
}

export function TaskCardSimple({
  _id,
  title,
  status,
  priority,
  dueDate,
  totalTimeSpent,
  currentTimerStart,
}: TaskCardProps) {
  const { deleteTask, startTimerMutation, stopTimerMutation } = useTasks()
  const isTimerActive = !!currentTimerStart

  const handleDelete = () => {
    if (confirm("Delete this task?")) {
      deleteTask(_id)
    }
  }

  const handleTimer = async () => {
    try {
      if (isTimerActive) {
        await stopTimerMutation({ id: _id })
      } else {
        await startTimerMutation({ id: _id })
      }
    } catch (err) {
      console.error("Timer error:", err)
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const daysLeft = dueDate ? Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null

  // Progress: 0-100 based on time spent (estimate 8 hours = 100%)
  const progressPercent = Math.min((totalTimeSpent || 0) / (8 * 3600) * 100, 100)

  return (
    <Card className="bg-card border-border hover:border-primary/30 transition">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{formatTime(totalTimeSpent || 0)} tracked</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={`text-xs capitalize ${statusColors[status as keyof typeof statusColors]}`}>
            {status}
          </Badge>
          <Badge variant="outline" className={`text-xs capitalize ${priorityColors[priority as keyof typeof priorityColors]}`}>
            <Flag className="size-3 mr-1" />
            {priority}
          </Badge>
          {daysLeft !== null && (
            <Badge variant="outline" className="text-xs bg-secondary text-muted-foreground">
              <Calendar className="size-3 mr-1" />
              {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            variant={isTimerActive ? "default" : "outline"}
            onClick={handleTimer}
            className="flex-1 gap-2"
          >
            {isTimerActive ? (
              <>
                <Pause className="size-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="size-4" />
                Start
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="h-9 w-9 p-0 text-destructive hover:text-destructive">
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
