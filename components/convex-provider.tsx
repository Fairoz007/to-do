"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react"
import { ClerkProvider, useAuth } from "@clerk/clerk-react"
import { ReactNode, useEffect, useCallback } from "react"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

function ConvexClientProviderInner({ children }: { children: ReactNode }) {
  const { isSignedIn, getToken } = useAuth()

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      try {
        if (!isSignedIn) {
          console.log("[Convex] Not signed in, no token returned.")
          return null
        }
        // Clerk's getToken returns a Convex-compatible identity token when using the "convex" template
        const token = await getToken({ template: "convex", skipCache: forceRefreshToken })
        console.log("[Convex] Clerk getToken (convex template):", token)
        return token
      } catch (err) {
        console.error("[Convex] Error fetching token:", err)
        return null
      }
    },
    [isSignedIn, getToken]
  )

  useEffect(() => {
    // Provide Convex with a function to fetch a fresh auth token when needed
    convex.setAuth(fetchAccessToken)
    return () => {
      try {
        convex.clearAuth()
      } catch {}
    }
  }, [fetchAccessToken])

  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  )
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexClientProviderInner>
        {children}
      </ConvexClientProviderInner>
    </ClerkProvider>
  )
}

