"use client"

import React, { useState, useMemo } from "react"
import { useTasks, type TaskStatus } from "./task-context"
import { TaskCardEnhanced } from "./task-card-enhanced"
import { FilterBar } from "./filter-bar"
import { ClipboardList } from "lucide-react"

import { useFilter } from "./filter-context"
import { isToday, startOfDay, addDays } from "date-fns"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function TaskListEnhanced() {
  const { activeFilter } = useFilter()

  // Construct filter args for server-side processing
  const filterArgs: any = {}

  const now = new Date()

  if (activeFilter === 'completed') {
    filterArgs.status = 'completed'
  } else if (activeFilter === 'today') {
    filterArgs.isDueToday = true
  } else if (activeFilter === 'overdue') {
    filterArgs.isOverdue = true
  } else if (activeFilter === 'high') {
    filterArgs.priority = 'high'
  } else if (activeFilter === 'quick') {
    filterArgs.quickTask = true
  } else if (activeFilter === 'week') {
    filterArgs.dueDateStart = now.getTime()
    filterArgs.dueDateEnd = now.getTime() + (7 * 24 * 60 * 60 * 1000)
  }

  // Fetch tasks directly based on filters (Server Side Filter)
  const tasks = useQuery(api.tasks.list, filterArgs) || []
  const isLoading = tasks === undefined
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Client-side search and status filter (can be moved to backend too, but keeping for responsiveness on small lists)
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = !selectedStatus || task.status === selectedStatus
      const matchesSearch =
        !searchQuery ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

      return matchesStatus && matchesSearch
    })
  }, [tasks, selectedStatus, searchQuery])

  // Sort by due date then by created date
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      // Overdue tasks first
      const aOverdue = a.dueDate && new Date(a.dueDate).getTime() < Date.now() && a.status !== "closed"
      const bOverdue = b.dueDate && new Date(b.dueDate).getTime() < Date.now() && b.status !== "closed"
      if (aOverdue && !bOverdue) return -1
      if (!aOverdue && bOverdue) return 1

      // Then by priority (high > medium > low)
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff

      // Finally by due date
      if (a.dueDate && b.dueDate) {
        return a.dueDate - b.dueDate
      }
      if (a.dueDate) return -1
      if (b.dueDate) return 1

      // Fallback: by created date (newest first)
      return b.createdAt - a.createdAt
    })
  }, [filteredTasks])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-card border border-border animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Task Count */}
      <div className="text-sm text-muted-foreground">
        Showing {sortedTasks.length} of {tasks.length} task{tasks.length !== 1 ? "s" : ""}
      </div>

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border-2 border-dashed border-border">
          <div className="size-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <ClipboardList className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {searchQuery || selectedStatus ? "No matching tasks" : "No tasks yet"}
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            {searchQuery
              ? "Try adjusting your search query"
              : selectedStatus
                ? `No tasks with status "${selectedStatus}"`
                : "Create your first task using the input above. Let's get started!"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskCardEnhanced
              key={task._id}
              id={task._id}
              {...task}
            />
          ))}
        </div>
      )}
    </div>
  )
}
