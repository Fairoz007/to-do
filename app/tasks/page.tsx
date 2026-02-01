"use client"

import { TaskListEnhanced } from "@/components/task-list-enhanced"
import { TaskProvider } from "@/components/task-context"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { Footer } from "@/components/footer"
import { Filter, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"

import { RecommendedCategories } from "@/components/recommended-categories"
import { TaskInputAdvanced } from "@/components/task-input-advanced"

import { useFilter } from "@/components/filter-context"

function TasksPageContent() {
  const { activeFilter } = useFilter()

  return (
    <div className="min-h-screen bg-background md:ml-64 pt-20 pb-32">
      <main className="w-full px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">My Task</h2>
            <p className="text-muted-foreground">Manage and organize your daily tasks</p>
          </div>

          {/* Filters */}
          <RecommendedCategories />

          {/* Add Task Section - Hidden when filtering */}
          {activeFilter === 'all' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-lg font-semibold text-foreground">Add New Task</h3>
              <TaskInputAdvanced />
            </div>
          )}

          {/* Task List */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Task List</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="size-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Undo2 className="size-4" />
                  Sort
                </Button>
              </div>
            </div>
            <TaskListEnhanced />
          </section>
        </div>
      </main>
    </div>
  )
}

import { FilterProvider } from "@/components/filter-context"
import { BottomNav } from "@/components/bottom-nav"
import { AddTaskFab } from "@/components/add-task-fab"

export default function TasksPage() {
  return (
    <TaskProvider>
      <FilterProvider>
        <Sidebar />
        <TopNav />
        <TasksPageContent />
        <AddTaskFab />
        <BottomNav />
        <Footer />
      </FilterProvider>
    </TaskProvider>
  )
}
