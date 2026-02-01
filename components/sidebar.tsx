"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, LayoutDashboard, CheckSquare, Calendar, FileText, MessageSquare, Settings, HelpCircle, History } from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: CheckSquare, label: "My Task", href: "/tasks" },
  { icon: Calendar, label: "Calendar", href: "/calendar" }, // Keep for now
  { icon: FileText, label: "Monthly Overview", href: "/monthly" },
  { icon: History, label: "Work History", href: "/work-history" },
]

const bottomItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border pt-6 px-4 overflow-y-auto">
      <div className="space-y-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-4 py-2 hover:opacity-80 transition">
          <div className="size-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
            <Zap className="size-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">TaskFlow</h2>
            <p className="text-xs text-muted-foreground">Pro</p>
          </div>
        </Link>

        {/* Main Menu */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                className="w-full justify-start gap-3"
              >
                <item.icon className="size-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Menu */}
        <div className="space-y-2 pb-4">
          {bottomItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                className="w-full justify-start gap-3"
              >
                <item.icon className="size-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
