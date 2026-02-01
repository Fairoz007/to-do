# 🚀 GET STARTED IN 5 MINUTES

## Step 1: Create Clerk Account (1 min)

1. Go to https://dashboard.clerk.com
2. Click **Create Application**
3. Enter name: `TaskFlow`
4. Choose sign-in method: **Email** (recommended)
5. Click **Create Application**

## Step 2: Copy Your Keys (30 sec)

In Clerk Dashboard:
1. Go to **Developers → API Keys**
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`)

## Step 3: Create `.env.local` File (1 min)

In your project root, create a file called `.env.local` and paste:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_YOUR_KEY_HERE
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

Replace:
- `pk_YOUR_KEY_HERE` with your Clerk Publishable Key
- `sk_YOUR_KEY_HERE` with your Clerk Secret Key  
- `https://your-project.convex.cloud` with your Convex URL

## Step 4: Connect Clerk to Convex (1 min)

1. Open your Convex Dashboard
2. Go to **Settings → Authentication**
3. Click **Add Provider**
4. Select **Clerk**
5. Choose your **TaskFlow** application
6. Click **Save**

## Step 5: Run Your App (1 min)

Open two terminals:

**Terminal 1** - Start Convex:
```bash
pnpm convex dev
```

**Terminal 2** - Start Next.js:
```bash
pnpm dev
```

## Step 6: Test It! 🎉

1. Open http://localhost:3000
2. You'll see the sign-in page
3. Click **Create account**
4. Enter your email and password
5. Click **Create account**
6. ✅ You're logged in!
7. Try creating a task
8. Click your profile menu (top right) to sign out
9. Sign back in and verify your tasks are still there

---

## 🎯 That's It!

Your app now has complete user authentication! 

### What You Can Do Now:
✅ Sign up with email/password  
✅ Sign in securely  
✅ Create tasks that only you can see  
✅ Edit and delete your tasks  
✅ Sign out  

### What's Protected:
✅ All your tasks are private  
✅ Only you can see your data  
✅ Other users can't access your tasks  

---

## Next Steps

- Read **QUICK_START_AUTH.md** for more details
- Read **AUTHENTICATION_SETUP.md** for troubleshooting
- Customize the sign-in/sign-up pages to match your style
- Deploy to production when ready

---

## Stuck? Check These:

| Problem | Solution |
|---------|----------|
| "Clerk not configured" | Check `.env.local` has your keys, restart server |
| "Tasks not loading" | Verify Clerk connected to Convex in step 4 |
| "Can't sign up" | Check Clerk API keys are correct |
| "Redirected to sign-in" | This is normal! Sign up first or log in |

---

## Important Files

After setup, these are your key files:
- `.env.local` - Your configuration (keep secret!)
- `app/sign-in/page.tsx` - Sign-in page
- `app/sign-up/page.tsx` - Sign-up page
- `components/user-menu.tsx` - User profile menu

---

## Questions?

Check out:
- Clerk Docs: https://docs.clerk.com
- Convex Docs: https://docs.convex.dev
- Full Setup Guide: See **AUTHENTICATION_SETUP.md**

---

**🚀 You're all set! Enjoy your authenticated app!**
