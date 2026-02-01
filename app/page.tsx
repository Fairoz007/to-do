"use client"

import { TaskInputAdvanced } from "@/components/task-input-advanced"
import { TaskProvider } from "@/components/task-context"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { Footer } from "@/components/footer"
import { StatsSection } from "@/components/stats-section"
import { WorkStats } from "@/components/work-stats"
import { FilterProvider } from "@/components/filter-context"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

function DashboardContent() {
  return (
    <div className="min-h-screen bg-background md:ml-64 pt-20 pb-32">
      <main className="w-full px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
              <p className="text-muted-foreground">
                Welcome back! Here's an overview of your progress.
              </p>
            </div>
            <Link href="/tasks">
              <Button className="gap-2">
                <Plus className="size-4" />
                Create New Task
              </Button>
            </Link>
          </div>

          {/* Real Stats Section */}
          <StatsSection />

          {/* Work Hours Stats */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Work Hours Tracking</h3>
            <WorkStats />
          </section>

          {/* Monthly Overview Link */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Monthly Overview</h3>
              <Link href="/monthly" className="text-sm text-primary hover:underline">View Full Calendar</Link>
            </div>
          </section>


        </div>
      </main>
    </div>
  )
}

import { BottomNav } from "@/components/bottom-nav"

export default function DashboardPage() {
  return (
    <TaskProvider>
      <FilterProvider>
        <Sidebar />
        <TopNav />
        <DashboardContent />
        <BottomNav />
        <Footer />
      </FilterProvider>
    </TaskProvider>
  )
}
