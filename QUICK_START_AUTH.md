# Quick Start - Authentication Setup

Follow these quick steps to get authentication working:

## 1. Create Clerk App (2 minutes)
- Go to https://dashboard.clerk.com
- Click "Create Application"
- Name it "TaskFlow"
- Copy your keys

## 2. Add Environment Variables
Create `.env.local` in your project root:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_your_key
CLERK_SECRET_KEY=sk_your_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

## 3. Connect Clerk to Convex
In Convex dashboard:
1. Go Settings → Authentication
2. Select Clerk from list
3. Choose your Clerk application
4. Done!

## 4. Start Development
```bash
pnpm install
pnpm convex dev
pnpm dev
```

## 5. Test It
- Visit http://localhost:3000
- You'll be redirected to sign-in
- Create an account
- You'll be redirected back to the app
- All your data is now private to your account!

## ✅ That's it!

Your app now has:
- ✅ User authentication with Clerk
- ✅ Protected routes
- ✅ Per-user data storage
- ✅ Automatic user profile creation

For detailed setup, see `AUTHENTICATION_SETUP.md`
