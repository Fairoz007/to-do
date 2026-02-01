"use client"

import React from "react"
import Link from "next/link"
import { useTasks } from "./task-context"
import { Zap, CheckSquare, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserMenu } from "./user-menu"

export function Header() {
  const { isLoading } = useTasks()
  const isConnected = !isLoading

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        {/* Logo & Branding */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="size-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
            <Zap className="size-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">TaskFlow Pro</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Smart Task Management</p>
          </div>
        </Link>

        {/* Center: Tasks Button */}
        <Link href="/tasks">
          <Button variant="outline" className="gap-2">
            <CheckSquare className="size-4" />
            Tasks
          </Button>
        </Link>

        {/* Right Side: Status & User Menu */}
        <div className="flex items-center gap-4">
          {/* Real-time Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
            <div className={`size-2 rounded-full ${isConnected ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
            <span className="text-xs font-medium text-muted-foreground">
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>

          {/* Settings Button */}
          <Link href="/settings">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="size-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </Link>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
