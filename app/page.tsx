"use client"

import { TaskInputAdvanced } from "@/components/task-input-advanced"
import { TaskProvider } from "@/components/task-context"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { Footer } from "@/components/footer"
import { StatsSection } from "@/components/stats-section"
import { WorkStats } from "@/components/work-stats"
import { MonthlyView } from "@/components/monthly-view"
import { RecommendedCategories } from "@/components/recommended-categories"

function DashboardContent() {
  return (
    <div className="min-h-screen bg-background ml-64 pt-20 pb-32">
      <main className="w-full px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">My Task</h2>
            <p className="text-muted-foreground">
              Manage your tasks and track your progress
            </p>
          </div>

          {/* Recommended Categories */}
          <RecommendedCategories />

          {/* Real Stats Section */}
          <StatsSection />

          {/* Work Hours Stats */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Work Hours Tracking</h3>
            <WorkStats />
          </section>

          {/* Task Input */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Add New Task</h3>
            <TaskInputAdvanced />
          </section>

          {/* Monthly Overview */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Monthly Overview</h3>
            <MonthlyView />
          </section>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <TaskProvider>
      <Sidebar />
      <TopNav />
      <DashboardContent />
      <Footer />
    </TaskProvider>
  )
}
