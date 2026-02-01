"use client"

import { useUser, useClerk } from "@clerk/clerk-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { LogOut, User as UserIcon } from "lucide-react"

export function UserMenu() {
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const currentUser = useQuery(api.auth.currentUser)

  if (!isSignedIn || !user) return null

  return (
    <div className="flex items-center gap-4">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {user.emailAddresses[0]?.emailAddress}
        </p>
      </div>
      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
        <UserIcon className="w-5 h-5" />
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut()}
        className="flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Sign Out</span>
      </Button>
    </div>
  )
}
