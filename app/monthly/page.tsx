"use client"

import { TaskProvider } from "@/components/task-context"
import { FilterProvider } from "@/components/filter-context"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { Footer } from "@/components/footer"
import { MonthlyAnalytics } from "@/components/monthly-analytics"
import { RecommendedCategories } from "@/components/recommended-categories"
import { BottomNav } from "@/components/bottom-nav"

function MonthlyContent() {
    return (
        <div className="min-h-screen bg-background md:ml-64 pt-20 pb-32">
            <main className="w-full px-4 md:px-6 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-foreground">Monthly Overview</h2>
                        <p className="text-muted-foreground">
                            Deep dive into your productivity and performance
                        </p>
                    </div>

                    <MonthlyAnalytics />
                </div>
            </main>
        </div>
    )
}

export default function MonthlyPage() {
    return (
        <TaskProvider>
            <FilterProvider>
                <Sidebar />
                <TopNav />
                <MonthlyContent />
                <BottomNav />
                <Footer />
            </FilterProvider>
        </TaskProvider>
    )
}
