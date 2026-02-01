"use client"

import React, { useState, useMemo } from "react"
import { TaskProvider, useTasks } from "@/components/task-context"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, startOfDay, parseISO } from "date-fns"

function CalendarGrid() {
  const { tasks } = useTasks()
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, typeof tasks> = {}

    tasks.forEach((task) => {
      if (!task.dueDate) return

      const dueDate = startOfDay(
        typeof task.dueDate === 'number' 
          ? new Date(task.dueDate)
          : parseISO(String(task.dueDate))
      )
      const dateKey = format(dueDate, "yyyy-MM-dd")
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(task)
    })

    return grouped
  }, [tasks])

  const getStatusColor = (status: any) => {
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

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="min-h-screen bg-background ml-64 pt-20 pb-32">
      <main className="w-full px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Calendar</h2>
              <p className="text-muted-foreground">
                View your tasks by date
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="min-w-40 text-center font-semibold">
                {format(currentDate, "MMMM yyyy")}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {allDays.map((date) => {
                  const dateKey = format(date, "yyyy-MM-dd")
                  const dayTasks = tasksByDate[dateKey] || []
                  const isCurrentMonth = isSameMonth(date, currentDate)

                  return (
                    <div
                      key={dateKey}
                      className={`min-h-24 p-2 rounded-lg border transition-colors ${
                        isCurrentMonth
                          ? "bg-card border-border hover:border-primary/30"
                          : "bg-muted/30 border-border/50 opacity-50"
                      }`}
                    >
                      <div className="text-sm font-semibold text-foreground mb-1">
                        {format(date, "d")}
                      </div>
                      <div className="space-y-1">
                        {dayTasks.slice(0, 2).map((task) => (
                          <div key={task._id} className="text-xs">
                            <Badge variant="outline" className={`text-xs truncate ${getStatusColor(task.status)}`}>
                              {task.title.substring(0, 15)}
                            </Badge>
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function CalendarPage() {
  return (
    <TaskProvider>
      <Sidebar />
      <TopNav />
      <CalendarGrid />
      <Footer />
    </TaskProvider>
  )
}
