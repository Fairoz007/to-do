"use client"

import React from "react"
import { TaskStatus } from "./task-context"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FilterBarProps {
  selectedStatus: TaskStatus | null
  onStatusChange: (status: TaskStatus | null) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

const statusOptions: { value: TaskStatus | null; label: string; color: string }[] = [
  { value: null, label: "All", color: "bg-secondary" },
  { value: "pending", label: "Pending", color: "bg-warning/20 text-warning" },
  { value: "in_progress", label: "In Progress", color: "bg-primary/20 text-primary" },
  { value: "completed", label: "Completed", color: "bg-success/20 text-success" },
  { value: "overdue", label: "Overdue", color: "bg-destructive/20 text-destructive" },
]

export function FilterBar({
  selectedStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search tasks by title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-background border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <Button
            key={option.value ?? "all"}
            variant={selectedStatus === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusChange(option.value)}
            className={`capitalize ${
              selectedStatus === option.value
                ? "bg-primary text-primary-foreground"
                : "hover:bg-card"
            }`}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
