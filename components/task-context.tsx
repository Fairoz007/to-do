"use client"

import React, { createContext, useContext, type ReactNode } from "react"
import { useAuth } from "@clerk/clerk-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export type TaskStatus = "pending" | "in_progress" | "completed" | "overdue"
export type TaskPriority = "low" | "medium" | "high"

export interface TimerSession {
  startedAt: number
  endedAt?: number
  duration: number
  isActive: boolean
}

export interface Task {
  _id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: number
  createdAt: number
  completedAt?: number
  totalTimeSpent?: number
  timerSessions?: TimerSession[]
  currentTimerStart?: number
}

interface CreateTaskArgs {
  title: string
  description?: string
  priority?: TaskPriority
  dueDate?: number
}

interface TaskContextType {
  tasks: Task[]
  isLoading: boolean
  createTask: (args: CreateTaskArgs) => Promise<void>
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>
  updateTask: (id: string, updates: Partial<Omit<Task, '_id'>>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  startTimer: (id: string) => Promise<void>
  stopTimer: (id: string) => Promise<void>
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const tasksFromServer = useQuery(api.tasks.list)
  const isLoading = tasksFromServer === undefined

  const createMutation = useMutation(api.tasks.create)
  const updateStatusMutation = useMutation(api.tasks.updateStatus)
  const updateMutation = useMutation(api.tasks.update)
  const removeMutation = useMutation(api.tasks.remove)
  const startTimerMutation = useMutation(api.tasks.startTimer)
  const stopTimerMutation = useMutation(api.tasks.stopTimer)

  const { isLoaded, isSignedIn } = useAuth()
  // Defensive retry: wait for Clerk to be ready and signed in, with exponential backoff
  const createTask = async (args: CreateTaskArgs) => {
    let attempts = 0
    const maxAttempts = 5
    let delay = 200
    while ((!isLoaded || !isSignedIn) && attempts < maxAttempts) {
      await new Promise((res) => setTimeout(res, delay))
      attempts++
      delay *= 2
    }
    if (!isLoaded || !isSignedIn) {
      throw new Error("You must be signed in to create a task.")
    }
    try {
      await createMutation(args)
    } catch (err) {
      console.error("Failed to create task:", err)
      throw err
    }
  }

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      await updateStatusMutation({ id: id as any, status })
    } catch (err) {
      console.error("Failed to update task status:", err)
      throw err
    }
  }

  const updateTask = async (id: string, updates: Partial<Omit<Task, '_id'>>) => {
    try {
      await updateMutation({ id: id as any, ...updates })
    } catch (err) {
      console.error("Failed to update task:", err)
      throw err
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await removeMutation({ id: id as any })
    } catch (err) {
      console.error("Failed to delete task:", err)
      throw err
    }
  }

  const startTimer = async (id: string) => {
    try {
      await startTimerMutation({ id: id as any })
    } catch (err) {
      console.error("Failed to start timer:", err)
      throw err
    }
  }

  const stopTimer = async (id: string) => {
    try {
      await stopTimerMutation({ id: id as any })
    } catch (err) {
      console.error("Failed to stop timer:", err)
      throw err
    }
  }

  const tasks: Task[] = (tasksFromServer ?? []) as Task[]

  return (
    <TaskContext.Provider
      value={{ tasks, isLoading, createTask, updateTaskStatus, updateTask, deleteTask, startTimer, stopTimer }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}
