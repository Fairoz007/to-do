"use client"

import React from "react"

import { useTasks, type TaskStatus } from "./task-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Trash2, Clock, CircleDot, CheckCircle2, Play } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TaskCardProps {
  id: string
  title: string
  status: TaskStatus
  createdAt: number
}

const statusConfig: Record<TaskStatus, { label: string; icon: React.ReactNode; className: string }> = {
  open: {
    label: "Open",
    icon: <CircleDot className="size-3" />,
    className: "bg-warning/20 text-warning border-warning/30",
  },
  in_progress: {
    label: "In Progress",
    icon: <Play className="size-3" />,
    className: "bg-primary/20 text-primary border-primary/30",
  },
  closed: {
    label: "Closed",
    icon: <CheckCircle2 className="size-3" />,
    className: "bg-success/20 text-success border-success/30",
  },
}

export function TaskCard({ id, title, status, createdAt }: TaskCardProps) {
  const { updateTaskStatus, deleteTask } = useTasks()

  const config = statusConfig[status]

  const handleStatusChange = () => {
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      open: "in_progress",
      in_progress: "closed",
      closed: "open",
    }
    updateTaskStatus(id, nextStatus[status])
  }

  const handleDelete = () => {
    deleteTask(id)
  }

  return (
    <Card className="py-4 bg-card border-border hover:border-primary/30 transition-colors">
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-card-foreground truncate ${status === "closed" ? "line-through opacity-60" : ""}`}>
            {title}
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className={config.className}>
              {config.icon}
              {config.label}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" />
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStatusChange}
            className="h-8 px-3 text-xs bg-transparent"
          >
            {status === "closed" ? (
              <>Reopen</>
            ) : status === "in_progress" ? (
              <>
                <Check className="size-3 mr-1" />
                Done
              </>
            ) : (
              <>
                <Play className="size-3 mr-1" />
                Start
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Delete task</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
