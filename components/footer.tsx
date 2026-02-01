"use client"

import React from "react"
import { useTasks } from "./task-context"
import { Heart, Globe } from "lucide-react"

export function Footer() {
  const { tasks } = useTasks()
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === "closed").length

  return (
    <footer className="mt-16 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="w-full px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">TaskFlow Pro</h3>
              <p className="text-sm text-muted-foreground">
                A modern, real-time task management system built with Next.js and Convex for seamless collaboration.
              </p>
            </div>

            {/* Quick Stats */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Your Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tasks</span>
                  <span className="font-medium text-foreground">{totalTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium text-success">{completedTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active</span>
                  <span className="font-medium text-primary">{totalTasks - completedTasks}</span>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-primary hover:text-primary/80 transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:text-primary/80 transition">
                    GitHub Repo
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:text-primary/80 transition">
                    Report Issues
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border mb-6" />

          {/* Bottom Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <span>Built with</span>
              <Heart className="size-4 text-destructive fill-destructive" />
              <span>by the TaskFlow team</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground transition">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition">Terms</a>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Globe className="size-4" />
                <span>© 2026 TaskFlow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
