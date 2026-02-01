"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, AlertCircle, CheckCircle2, Star, Zap } from "lucide-react"
import { useFilter, type FilterType } from "./filter-context"

// Useful filters instead of placeholders
const quickFilters: { icon: any, label: string, color: string, value: FilterType }[] = [
  { icon: Clock, label: "Due Today", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400", value: "today" },
  { icon: AlertCircle, label: "Overdue", color: "bg-red-500/20 text-red-600 dark:text-red-400", value: "overdue" },
  { icon: Star, label: "High Priority", color: "bg-amber-500/20 text-amber-600 dark:text-amber-400", value: "high" },
  { icon: CheckCircle2, label: "Completed", color: "bg-green-500/20 text-green-600 dark:text-green-400", value: "completed" },
  { icon: Zap, label: "Quick Tasks", color: "bg-purple-500/20 text-purple-600 dark:text-purple-400", value: "quick" },
  { icon: Calendar, label: "This Week", color: "bg-orange-500/20 text-orange-600 dark:text-orange-400", value: "week" },
]

export function RecommendedCategories() {
  const { activeFilter, setFilter } = useFilter()

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Quick Filters</h3>
        {activeFilter !== 'all' && (
          <button
            onClick={() => setFilter('all')}
            className="text-sm text-primary hover:underline font-medium"
          >
            Clear Filter
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickFilters.map((filter) => {
          const isActive = activeFilter === filter.value
          return (
            <Card
              key={filter.label}
              className={`bg-card border-border cursor-pointer transition hover:shadow-sm ${isActive ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/30'}`}
              onClick={() => setFilter(isActive ? 'all' : filter.value)}
            >
              <CardContent className="p-3 flex flex-col items-center gap-2 text-center">
                <div className={`p-2 rounded-lg ${filter.color}`}>
                  <filter.icon className="size-5" />
                </div>
                <span className="text-xs font-medium text-foreground line-clamp-1">{filter.label}</span>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
