"use client"

import React, { useState, useMemo } from "react"
import { useTasks } from "./task-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Calendar, ChevronDown, ChevronUp } from "lucide-react"
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isToday, isBefore, addDays, startOfDay, parseISO } from "date-fns"
import { useFilter, type FilterType } from "./filter-context"
import { type Task } from "./task-context"

interface GroupedTasks {
  overdue: Array<{ date: Date; tasks: Task[] }>
  today: Array<{ date: Date; tasks: Task[] }>
  upcoming: Array<{ date: Date; tasks: Task[] }>
  later: Array<{ date: Date; tasks: Task[] }>
}

export function MonthlyView() {
  const { tasks } = useTasks()
  const { activeFilter } = useFilter()
  const [showEmptyDays, setShowEmptyDays] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState({
    overdue: true,
    today: true,
    upcoming: true,
    later: false,
  })

  // Filter tasks based on activeFilter
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const now = Date.now()
      switch (activeFilter) {
        case 'today':
          if (!task.dueDate) return false
          const today = new Date()
          return isToday(new Date(task.dueDate))
        case 'overdue':
          return task.dueDate && task.dueDate < now && task.status !== 'completed' && task.status !== 'closed'
        case 'high':
          return task.priority === 'high'
        case 'completed':
          return task.status === 'completed'
        case 'quick':
          return (task.timeAllowed || 0) > 0 && (task.timeAllowed || 0) <= 30 * 60 * 1000 // <= 30 mins
        case 'week':
          const oneWeek = 7 * 24 * 60 * 60 * 1000
          return task.dueDate && task.dueDate > now && task.dueDate <= now + oneWeek
        default:
          return true
      }
    })
  }, [tasks, activeFilter])

  // Group tasks by meaningful categories using filteredTasks
  const groupedTasks = useMemo<GroupedTasks>(() => {
    // ... (rest of the logic, but use filteredTasks instead of tasks)
    const now = startOfDay(new Date())
    const upcoming5Days = addDays(now, 5)

    const groups: GroupedTasks = {
      overdue: [],
      today: [],
      upcoming: [],
      later: [],
    }

    const tasksByDate: Record<string, typeof filteredTasks> = {}
    const uniqueDates = new Set<string>()

    filteredTasks.forEach((task) => {
      // ... (existing logic)
      if (!task.dueDate) return

      const dueDate = startOfDay(
        typeof task.dueDate === 'number'
          ? new Date(task.dueDate)
          : parseISO(String(task.dueDate))
      )
      const dateKey = format(dueDate, "yyyy-MM-dd")

      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = []
      }
      tasksByDate[dateKey].push(task)
      uniqueDates.add(dateKey)
    })

    // ... (rest of categorization logic logic)

    uniqueDates.forEach((dateKey) => {
      const date = parseISO(dateKey)
      const dayTasks = tasksByDate[dateKey]

      if (isBefore(date, now) && !isToday(date)) {
        groups.overdue.push({ date, tasks: dayTasks })
      } else if (isToday(date)) {
        groups.today.push({ date, tasks: dayTasks })
      } else if (date <= upcoming5Days) {
        groups.upcoming.push({ date, tasks: dayTasks })
      } else {
        groups.later.push({ date, tasks: dayTasks })
      }
    })

    // Sort each group by date
    Object.keys(groups).forEach((key) => {
      groups[key as keyof GroupedTasks].sort((a, b) => a.date.getTime() - b.date.getTime())
    })

    return groups
  }, [filteredTasks])

  // ... (rest of the component)

  const toggleGroup = (group: keyof typeof expandedGroups) => {
    // ... (keep implementation)
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  const getStatusColor = (status: any) => {
    // ... (keep implementation)
    const colorMap: Record<string, string> = {
      pending: "bg-warning/20 text-warning",
      in_progress: "bg-primary/20 text-primary",
      completed: "bg-success/20 text-success",
      overdue: "bg-destructive/20 text-destructive",
      open: "bg-warning/20 text-warning",
      closed: "bg-success/20 text-success",
    }
    return colorMap[status] || "bg-secondary text-muted-foreground"
  }

  const renderGroupSection = (
    groupKey: keyof typeof expandedGroups,
    groupLabel: string,
    groupData: Array<{ date: Date; tasks: typeof tasks }>,
    badgeColor: string = "bg-primary"
  ) => {
    // ... (keep implementation)
    if (groupData.length === 0) return null

    const isExpanded = expandedGroups[groupKey]

    return (
      <div key={groupKey} className="border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => toggleGroup(groupKey)}
          className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors bg-secondary/20"
        >
          <div className="flex items-center gap-3">
            <span className="font-semibold text-foreground">{groupLabel}</span>
            <Badge className={`${badgeColor} text - white text - xs`}>
              {groupData.reduce((sum, day) => sum + day.tasks.length, 0)}
            </Badge>
          </div>
          {isExpanded ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </button>

        {isExpanded && (
          <div className="space-y-2 p-4">
            {groupData.map(({ date, tasks: dayTasks }) => (
              <div
                key={format(date, "yyyy-MM-dd")}
                className="border border-border/50 rounded p-3 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">
                      {format(date, "MMM d")}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase">
                      {format(date, "EEE")}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {dayTasks.length}
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  {dayTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-start gap-2 bg-background/50 rounded p-2"
                    >
                      <Badge
                        variant="outline"
                        className={`text - xs flex - shrink - 0 ${getStatusColor(task.status)} `}
                      >
                        {task.status}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const hasAnyTasks =
    groupedTasks.overdue.length > 0 ||
    groupedTasks.today.length > 0 ||
    groupedTasks.upcoming.length > 0 ||
    (showEmptyDays && groupedTasks.later.length > 0)

  return (
    <Card className="bg-card border-border">
      {/* ... keeps header ... */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            <CardTitle className="text-lg">Task Timeline {activeFilter !== 'all' && <span className="text-sm font-normal text-muted-foreground ml-2">(Filtered: {activeFilter})</span>}</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Show empty</span>
              <Switch
                checked={showEmptyDays}
                onCheckedChange={setShowEmptyDays}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {!hasAnyTasks ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="size-8 mx-auto mb-2 opacity-50" />
              <p>No {activeFilter !== 'all' ? activeFilter : ""} tasks found</p>
            </div>
          ) : (
            <>
              {renderGroupSection("overdue", "Overdue", groupedTasks.overdue, "bg-destructive")}
              {renderGroupSection("today", "Today", groupedTasks.today, "bg-blue-500")}
              {renderGroupSection("upcoming", "Upcoming (Next 5 Days)", groupedTasks.upcoming, "bg-amber-500")}
              {showEmptyDays && renderGroupSection("later", "Later", groupedTasks.later, "bg-gray-500")}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
