"use client"

import { ReactNode } from "react"
import { useAuth } from "@clerk/clerk-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function AuthLayout({ children }: { children: ReactNode }) {
  const { userId, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in")
    }
  }, [userId, isLoaded, router])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!userId) {
    return null
  }

  return <>{children}</>
}
