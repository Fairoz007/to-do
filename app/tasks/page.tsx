"use client"

import { TaskListEnhanced } from "@/components/task-list-enhanced"
import { TaskProvider } from "@/components/task-context"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { Footer } from "@/components/footer"
import { Filter, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"

function TasksPageContent() {
  return (
    <div className="min-h-screen bg-background ml-64 pt-20 pb-32">
      <main className="w-full px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header with Filters */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">My Task</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="size-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                Undo2
                Sort
              </Button>
            </div>
          </div>

          {/* Task List */}
          <section>
            <TaskListEnhanced />
          </section>
        </div>
      </main>
    </div>
  )
}

export default function TasksPage() {
  return (
    <TaskProvider>
      <Sidebar />
      <TopNav />
      <TasksPageContent />
      <Footer />
    </TaskProvider>
  )
}
