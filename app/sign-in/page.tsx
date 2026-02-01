"use client"

import { SignIn } from "@clerk/clerk-react"

export default function SignInPage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <div className="size-16 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg mx-auto mb-4">
            <svg className="size-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">TaskFlow</h1>
          <p className="text-gray-400">Sign in to manage your tasks efficiently</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-slate-800 border border-slate-700 rounded-lg shadow-2xl",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 w-full",
              formFieldLabel: "text-gray-300 text-sm font-medium",
              formFieldInput: "bg-slate-700 border-slate-600 text-white placeholder-gray-500",
              dividerLine: "bg-slate-700",
              dividerText: "text-gray-400 text-sm",
              footerActionLink: "text-blue-400 hover:text-blue-300",
            }
          }}
        />
      </div>
    </div>
  )
}
