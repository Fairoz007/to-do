"use client"

import React, { useState } from "react"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TopNav() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <nav className="fixed top-0 left-64 right-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm h-16 flex items-center px-6 gap-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
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

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="size-5" />
          <span className="absolute top-1 right-1 size-2 bg-destructive rounded-full" />
        </Button>
        <Avatar className="size-9">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  )
}
