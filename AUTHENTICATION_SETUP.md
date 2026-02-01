# Authentication Setup Guide

This guide will help you set up Clerk authentication for the TaskFlow application.

## Prerequisites

1. A Clerk account (sign up at https://dashboard.clerk.com)
2. A Convex project (already configured in this repo)

## Step 1: Create a Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Click "Create Application"
3. Name it "TaskFlow"
4. Choose your preferred sign-in methods (Email, Google, GitHub, etc.)
5. Click "Create Application"

## Step 2: Get Your Clerk Keys

1. In the Clerk dashboard, go to **Developers → API Keys**
2. Copy your:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```bash
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_your_key_here
CLERK_SECRET_KEY=sk_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Convex Configuration (already set up)
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

## Step 4: Connect Clerk to Convex

To enable Convex to verify Clerk tokens:

1. In Convex dashboard, go to **Settings → Authentication**
2. Add Clerk as an authentication provider
3. Select your Clerk application
4. The integration will be set up automatically

## Step 5: Verify Setup

1. Install dependencies:
```bash
pnpm install
```

2. Generate Convex files:
```bash
pnpm convex dev
```

3. Start the development server:
```bash
pnpm dev
```

4. Visit http://localhost:3000
5. You should be redirected to `/sign-in`
6. Create an account or sign in

## How It Works

### Authentication Flow

1. **User Sign-In**: User visits the app, gets redirected to `/sign-in` if not authenticated
2. **Clerk Verification**: Clerk authenticates the user and stores session
3. **User Creation**: On first login, the app creates a user record in Convex
4. **Task Scoping**: All tasks are now scoped to the authenticated user

### Database Structure

- **Users Table**: Stores user info with Clerk ID mapping
  - `clerkId`: Unique identifier from Clerk
  - `email`: User's email address
  - `displayName`: User's display name
  - `createdAt`: Account creation timestamp

- **Tasks Table**: Updated to include `userId` field
  - All existing fields
  - `userId`: Links task to the authenticated user
  - Data is automatically filtered by user

### Protected Routes

All routes are protected except:
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page

Any other route will redirect unauthenticated users to `/sign-in`.

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Public key from Clerk Dashboard |
| `CLERK_SECRET_KEY` | Yes | Secret key from Clerk Dashboard |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Yes | Redirect to sign-in page |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Yes | Redirect to sign-up page |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Yes | After sign-in redirect |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Yes | After sign-up redirect |
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Your Convex deployment URL |

## Troubleshooting

### "Missing Clerk configuration"
- Ensure `.env.local` has the correct Clerk keys
- Restart the development server

### "Unauthorized" errors in tasks
- Check that Convex has Clerk integration enabled
- Verify the user was created in the Convex users table
- Check browser console for authentication errors

### Tasks not loading
- Verify you're logged in
- Check that userId is being sent correctly
- Look at Convex logs for database errors

## Files Modified/Created

### New Files
- `convex/auth.ts` - User authentication queries and mutations
- `components/auth-layout.tsx` - Protected layout wrapper
- `app/sign-in/page.tsx` - Sign-in page
- `app/sign-up/page.tsx` - Sign-up page
- `middleware.ts` - Route protection middleware

### Modified Files
- `convex/schema.ts` - Added users table and userId to tasks
- `convex/tasks.ts` - All queries/mutations now filter by userId
- `components/convex-provider.tsx` - Added Clerk provider
- `app/layout.tsx` - Added AuthLayout wrapper

## Next Steps

1. Add user profile page (optional)
2. Add sign-out button to header
3. Display user info in the UI
4. Add user preferences/settings

## Support

For Clerk issues: https://docs.clerk.com
For Convex issues: https://docs.convex.dev
