"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Calendar, Package, Gift, Lightbulb, Plane } from "lucide-react"

const categories = [
  { icon: Home, label: "Home Help", color: "bg-amber-500/20 text-amber-600 dark:text-amber-400" },
  { icon: Calendar, label: "Plan an event", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
  { icon: Package, label: "Return a package", color: "bg-purple-500/20 text-purple-600 dark:text-purple-400" },
  { icon: Gift, label: "Send a gift", color: "bg-pink-500/20 text-pink-600 dark:text-pink-400" },
  { icon: Lightbulb, label: "Plan a trip", color: "bg-orange-500/20 text-orange-600 dark:text-orange-400" },
  { icon: Plane, label: "Get inspired", color: "bg-green-500/20 text-green-600 dark:text-green-400" },
]

export function RecommendedCategories() {
  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-lg font-semibold text-foreground">Recommended Categories</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((category) => (
          <Card key={category.label} className="bg-card border-border hover:border-primary/30 cursor-pointer transition">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${category.color}`}>
                <category.icon className="size-5" />
              </div>
              <span className="text-sm font-medium text-foreground">{category.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
