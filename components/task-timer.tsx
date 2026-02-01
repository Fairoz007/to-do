"use client"

import React, { useState, useEffect } from "react"
import { useTasks } from "./task-context"
import { Play, Pause, Square } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TaskTimerProps {
  taskId: string
  totalTimeSpent?: number
  currentTimerStart?: number
  taskStatus: string
}

function formatTime(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor(ms / (1000 * 60 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}

export function TaskTimer({
  taskId,
  totalTimeSpent,
  currentTimerStart,
  taskStatus,
}: TaskTimerProps) {
  const { startTimer, stopTimer } = useTasks()
  const [displayTime, setDisplayTime] = useState(totalTimeSpent || 0)
  const [isRunning, setIsRunning] = useState(!!currentTimerStart)

  // Update display time every second if timer is running
  useEffect(() => {
    if (!isRunning || !currentTimerStart) return

    const interval = setInterval(() => {
      setDisplayTime((totalTimeSpent || 0) + (Date.now() - currentTimerStart))
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, currentTimerStart, totalTimeSpent])

  // Update display time when totalTimeSpent changes
  useEffect(() => {
    setDisplayTime(totalTimeSpent || 0)
  }, [totalTimeSpent])

  const handleToggleTimer = async () => {
    try {
      if (isRunning) {
        await stopTimer(taskId)
        setIsRunning(false)
      } else {
        await startTimer(taskId)
        setIsRunning(true)
      }
    } catch (err) {
      console.error("Timer error:", err)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm font-mono font-bold text-foreground min-w-16">
        {formatTime(displayTime)}
      </div>
      {taskStatus !== "completed" && (
        <Button
          variant={isRunning ? "default" : "outline"}
          size="sm"
          onClick={handleToggleTimer}
          className="gap-1"
        >
          {isRunning ? (
            <>
              <Pause className="size-3" />
              <span className="hidden sm:inline">Stop</span>
            </>
          ) : (
            <>
              <Play className="size-3" />
              <span className="hidden sm:inline">Start</span>
            </>
          )}
        </Button>
      )}
    </div>
  )
}
