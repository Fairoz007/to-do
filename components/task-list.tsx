"use client"

import { useTasks } from "./task-context"
import { TaskCard } from "./task-card"
import { ClipboardList } from "lucide-react"

export function TaskList() {
  const { tasks, isLoading } = useTasks()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-card border border-border animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <ClipboardList className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No tasks yet</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          Create your first task or ticket using the input above. All changes sync in real-time.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          id={task._id}
          title={task.title}
          status={task.status}
          createdAt={task.createdAt}
        />
      ))}
    </div>
  )
}
