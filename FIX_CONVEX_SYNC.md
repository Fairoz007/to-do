# 🔧 Fix Convex Backend Sync Error

## Problem
The Convex backend functions (`auth:currentUser`, `auth:updateProfile`) aren't synced with the dev server.

## Solution

### Step 1: Stop your current dev server
Press `Ctrl + C` in your terminal running `pnpm dev`

### Step 2: Start Convex Dev Server
Open a **NEW TERMINAL** and run:
```bash
npx convex dev
```

This will:
- ✅ Sync your backend functions
- ✅ Set up the database
- ✅ Generate type definitions
- ✅ Keep running in the background

### Step 3: Start Next.js Dev Server
In your **ORIGINAL TERMINAL** (or another one), run:
```bash
pnpm dev
```

### Step 4: Access Your App
Visit `http://localhost:3000` - everything should work now! ✓

---

## Why This Happened
When you create or modify Convex functions (like `convex/auth.ts`), you need to run `npx convex dev` to:
1. Compile the functions
2. Deploy them to the local backend
3. Generate TypeScript types

---

## Quick Reference

### Two Terminals Needed:

**Terminal 1 (Convex Backend):**
```bash
npx convex dev
```
Keep this running in the background

**Terminal 2 (Next.js Frontend):**
```bash
pnpm dev
```
This is where you see the dev output

---

## Troubleshooting

**If you see "Could not find public function":**
→ Make sure `npx convex dev` is running in a separate terminal

**If you see "CONVEX_URL not found":**
→ Your `.env.local` might be missing `NEXT_PUBLIC_CONVEX_URL`
→ Check that it's set correctly

**If the build fails:**
→ Try deleting `.next` folder and run `pnpm dev` again

---

## You're All Set! 🚀

Once both servers are running, navigate to:
- `/sign-in` - Sign in page (centered)
- `/settings` - Settings page
- `/tasks` - Task management

All functionality will work perfectly!
