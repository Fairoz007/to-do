"use client"

import React, { useState } from "react"
import { Bell, Search, Menu, Zap, LayoutDashboard, CheckSquare, Calendar, FileText, Settings, HelpCircle, History } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function TopNav() {
  const [searchQuery, setSearchQuery] = useState("")
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: CheckSquare, label: "My Task", href: "/tasks" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: FileText, label: "Monthly Overview", href: "/monthly" },
    { icon: History, label: "Work History", href: "/work-history" },
  ]

  const bottomItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
  ]

  return (
    <nav className="fixed top-0 left-0 md:left-64 right-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm h-16 flex items-center px-4 md:px-6 gap-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search or type a command..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-secondary border-border"
          />
        </div>
      </div>

      {/* Mobile Title (visible when search is hidden) */}
      <div className="md:hidden font-semibold text-lg">
        {menuItems.find(i => i.href === pathname)?.label || 'TaskFlow'}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" size="sm" className="relative hidden md:flex">
          <Bell className="size-5" />
          <span className="absolute top-1 right-1 size-2 bg-destructive rounded-full" />
        </Button>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "size-9"
            }
          }}
        />

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] p-0">
              <div className="flex flex-col h-full bg-card pt-6 animate-in slide-in-from-right duration-300">
                {/* Logo */}
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 px-6 py-4 hover:opacity-80 transition">
                  <div className="size-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                    <Zap className="size-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">TaskFlow</h2>
                    <p className="text-xs text-muted-foreground">Pro</p>
                  </div>
                </Link>

                {/* Main Menu */}
                <div className="space-y-2 px-4 mt-4">
                  {menuItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
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

                <div className="flex-1" />

                {/* Bottom Menu */}
                <div className="space-y-2 px-4 pb-8">
                  {bottomItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
