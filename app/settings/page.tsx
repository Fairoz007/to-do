"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useUser, useAuth } from "@clerk/clerk-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, User, Calendar, Save } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const { user } = useUser()
  const { isLoaded, isSignedIn } = useAuth()
  const currentUser = useQuery(api.auth.currentUser)
  const ensureUser = useMutation(api.auth.ensureUser)
  const updateProfile = useMutation(api.auth.updateProfile)
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(false)

  // Ensure user exists when component mounts (only after Clerk is loaded & signed in)
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      ensureUser().catch((err) => console.error("Failed to create user:", err))
    }
  }, [isLoaded, isSignedIn, user, ensureUser])

  useEffect(() => {
    if (currentUser?.displayName) {
      setDisplayName(currentUser.displayName)
    }
  }, [currentUser])

  const handleSave = async () => {
    if (!isLoaded || !isSignedIn) {
      toast.error("You must be signed in to update your profile")
      return
    }

    if (!displayName.trim()) {
      toast.error("Display name cannot be empty")
      return
    }

    setLoading(true)
    try {
      await updateProfile({ displayName })
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link href="/tasks">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Tasks
          </Button>
        </Link>

        {/* Settings Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        {/* Profile Card */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

          <div className="grid gap-6">
            {/* Display Name */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                Display Name
              </Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="max-w-md"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This is the name that appears in your profile
              </p>
            </div>

            {/* Email (Read-only) */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                value={user?.emailAddresses[0]?.emailAddress || ""}
                readOnly
                disabled
                className="max-w-md bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your email cannot be changed from here
              </p>
            </div>

            {/* Account Created Date */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Account Created
              </Label>
              <div className="text-sm text-foreground">
                {currentUser?.createdAt
                  ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Loading..."}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                When your account was created
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 pt-6 border-t">
            <Button
              onClick={handleSave}
              disabled={
                loading ||
                displayName === currentUser?.displayName ||
                !isLoaded ||
                !isSignedIn
              }
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>

        {/* Preferences Card */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Preferences</h2>

          <div className="grid gap-6">
            {/* Task Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Task Notifications</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Get notified when tasks are due
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded border-gray-300"
              />
            </div>

            {/* Theme */}
            <div className="flex items-center justify-between border-t pt-6">
              <div>
                <Label className="text-base">Dark Mode</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Always use dark theme
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded border-gray-300"
              />
            </div>
          </div>
        </Card>

        {/* Account Card */}
        <Card className="p-6 border-red-200 dark:border-red-900">
          <h2 className="text-xl font-semibold mb-6 text-red-600 dark:text-red-400">
            Danger Zone
          </h2>

          <div className="flex flex-col gap-4">
            <Button variant="outline" className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
              Delete Account
            </Button>
            <p className="text-xs text-muted-foreground">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
