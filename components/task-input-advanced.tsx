"use client"

import React, { useState } from "react"
import { useTasks } from "./task-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, Flag, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Priority = "low" | "medium" | "high"
type TimeUnit = "minutes" | "hours" | "days"

interface TaskInputAdvancedProps {
  onSuccess?: () => void
}

export function TaskInputAdvanced({ onSuccess }: TaskInputAdvancedProps = {}) {
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [timeVal, setTimeVal] = useState("")
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("hours")
  const { createTask } = useTasks()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !dueDate) return

    try {
      let timeAllowed: number = 0
      const val = parseFloat(timeVal)
      if (!isNaN(val) && val > 0) {
        if (timeUnit === "minutes") timeAllowed = val * 60 * 1000
        else if (timeUnit === "hours") timeAllowed = val * 60 * 60 * 1000
        else if (timeUnit === "days") timeAllowed = val * 24 * 60 * 60 * 1000
      }

      if (timeAllowed <= 0) return // Check again just in case

      await createTask({
        title: title.trim(),
        priority,
        dueDate: dueDate.getTime(),
        timeAllowed,
      })
      // Reset form
      setTitle("")
      setPriority("medium")
      setDueDate(undefined)
      setTimeVal("")
      setTimeUnit("hours")

      // Close modal/drawer if applicable
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error("Failed to create task:", err)
    }
  }

  const priorityColors = {
    low: "border-blue-500/30 bg-blue-500/10",
    medium: "border-amber-500/30 bg-amber-500/10",
    high: "border-red-500/30 bg-red-500/10",
  }

  const isFormValid = title.trim() && dueDate && (parseFloat(timeVal) > 0)

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Task Title <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-11 bg-background border-border placeholder:text-muted-foreground text-foreground"
          />
        </div>

        {/* Priority & Due Date */}
        <div className="grid grid-cols-2 gap-4">
          {/* Priority */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Flag className="size-4" />
              Priority <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition border ${priority === p
                    ? priorityColors[p]
                    : "border-transparent bg-secondary hover:bg-secondary/80"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date with Calendar Dropdown */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <CalendarIcon className="size-4" />
              Due Date <span className="text-destructive">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={`w-full h-10 justify-start text-left font-normal ${!dueDate ? "text-muted-foreground" : "text-foreground"
                    }`}
                >
                  {dueDate ? format(dueDate, "MMM d, yyyy") : "Pick a date..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Time Allowed */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Clock className="size-4" />
            Time Allowed <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              min="0"
              step="0.5"
              placeholder="Duration..."
              value={timeVal}
              onChange={(e) => setTimeVal(e.target.value)}
              className="flex-1"
            />
            <Select value={timeUnit} onValueChange={(v) => setTimeUnit(v as TimeUnit)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary */}
        {(dueDate || (timeVal && parseFloat(timeVal) > 0)) && (
          <div className="bg-secondary/50 rounded-lg p-3 text-sm text-muted-foreground space-y-1">
            {dueDate && <div>📅 Due: <span className="font-medium text-foreground">{format(dueDate, "MMMM d, yyyy")}</span></div>}
            {timeVal && parseFloat(timeVal) > 0 && <div>⏱️ Time Allowed: <span className="font-medium text-foreground">{timeVal} {timeUnit}</span></div>}
            <div>🎯 Priority: <span className="capitalize font-medium text-foreground">{priority}</span></div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            disabled={!isFormValid}
            className="px-8 h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Task
          </Button>
        </div>
      </form>
    </div>
  )
}

