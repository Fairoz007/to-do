"use client"

import React from "react"

import { useState } from "react"
import { useTasks } from "./task-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function TaskInput() {
  const [title, setTitle] = useState("")
  const { createTask } = useTasks()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    createTask(title.trim())
    setTitle("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="text"
        placeholder="Create a new task or ticket..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 h-11 bg-card border-border placeholder:text-muted-foreground"
      />
      <Button 
        type="submit" 
        disabled={!title.trim()}
        className="h-11 px-5 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="size-4 mr-1" />
        Add Task
      </Button>
    </form>
  )
}
