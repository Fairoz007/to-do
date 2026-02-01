"use client"

import { TaskProvider } from "@/components/task-context"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { Footer } from "@/components/footer"
import { WorkHistory } from "@/components/work-history"

function WorkHistoryPageContent() {
  return (
    <div className="min-h-screen bg-background ml-64 pt-20 pb-32">
      <main className="w-full px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Work History</h2>
            <p className="text-muted-foreground">
              Track all your completed tasks and time spent
            </p>
          </div>

          {/* Work History Section */}
          <section>
            <WorkHistory />
          </section>
        </div>
      </main>
    </div>
  )
}

export default function WorkHistoryPage() {
  return (
    <TaskProvider>
      <Sidebar />
      <TopNav />
      <WorkHistoryPageContent />
      <Footer />
    </TaskProvider>
  )
}
