"use client"

import React, { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react"
import { format, subMonths, addMonths } from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function MonthlyAnalytics() {
    const [currentDate, setCurrentDate] = useState(new Date())

    const stats = useQuery(api.analytics.getMonthlyStats, {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
    })

    const isLoading = stats === undefined

    const formatDuration = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60))
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
        return `${hours}h ${minutes}m`
    }

    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))

    return (
        <div className="space-y-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{format(currentDate, "MMMM yyyy")}</h3>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={prevMonth}>
                        <ChevronLeft className="size-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextMonth} disabled={addMonths(currentDate, 1) > new Date()}>
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-card rounded-xl border border-border" />
                    ))}
                </div>
            ) : (
                <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-card border-border">
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">Total Tasks</p>
                                        <p className="text-2xl font-bold mt-1">{stats?.totalTasks || 0}</p>
                                    </div>
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <FileText className="size-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">Completed</p>
                                        <p className="text-2xl font-bold mt-1 max-w-[100px] truncate">{stats?.completedTasks || 0}</p>
                                    </div>
                                    <div className="p-2 bg-success/10 rounded-lg text-success">
                                        <CheckCircle2 className="size-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">Overdue</p>
                                        <p className="text-2xl font-bold mt-1 text-destructive">{stats?.overdueTasks || 0}</p>
                                    </div>
                                    <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
                                        <AlertCircle className="size-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">Total Time</p>
                                        <p className="text-2xl font-bold mt-1">{formatDuration(stats?.totalTimeLogged || 0)}</p>
                                    </div>
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                        <Clock className="size-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Daily Breakdown */}
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BarChart className="size-5 text-muted-foreground" />
                                Daily Time Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!stats?.dailyTimeBreakdown || Object.keys(stats.dailyTimeBreakdown).length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No time logs for this month yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                                    {/* Generate array of ALL days in month to show empty days too? Or just active days? User asked for active list style examples but a grid is nice */}
                                    {Object.entries(stats.dailyTimeBreakdown).map(([day, duration]) => (
                                        <div key={day} className="p-3 bg-secondary/30 rounded-lg text-center">
                                            <p className="text-xs text-muted-foreground mb-1">
                                                {format(new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(day)), "MMM dd")}
                                            </p>
                                            <p className="font-semibold text-sm">
                                                {formatDuration(duration as number)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
