# Authentication Flow Diagram

## User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                  User Visits Application                    │
│                   http://localhost:3000                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              Middleware Checks Authentication               │
│                   (middleware.ts)                           │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ↓                         ↓
   ✓ Has Token              ✗ No Token
        │                         │
        ↓                         ↓
  AuthLayout OK          Redirect to /sign-in
        │                         │
        ↓                         ↓
   Load Home Page      ┌─────────────────────┐
        │              │  Clerk Sign-In Form │
        ↓              │                     │
   Connect to          │ Email: ___________  │
   Convex             │ Password: ________  │
        │              │                     │
        ↓              │ [Sign In]           │
   Query tasks        │ [Create Account]    │
   Filtered by        └──┬──────────────┬───┘
   userId               │              │
        │               ↓              ↓
        │          ┌─────────────┐  ┌──────────────┐
        │          │ User Exists │  │ New User     │
        │          └──────┬──────┘  └────┬─────────┘
        │                 │              │
        │                 │              ↓
        │                 │      ┌──────────────────┐
        │                 │      │ Sign-Up Form     │
        │                 │      │                  │
        │                 │      │ Email: _______   │
        │                 │      │ Password: ____   │
        │                 │      │ Name: _________  │
        │                 │      │                  │
        │                 │      │ [Create Account] │
        │                 │      └────┬─────────────┘
        │                 │           │
        │                 └────┬──────┘
        │                      │
        │                      ↓
        │         ┌───────────────────────┐
        │         │  Clerk Authenticates  │
        │         │  User & Issues Token  │
        │         └──────────┬────────────┘
        │                    │
        │                    ↓
        │         ┌───────────────────────┐
        │         │ Create/Update User    │
        │         │ Record in Convex      │
        │         │ (convex/auth.ts)      │
        │         └──────────┬────────────┘
        │                    │
        ↓                    ↓
  ┌──────────────────────────────────────┐
  │      User Authenticated              │
  │  Redirect to Home Page               │
  │  http://localhost:3000               │
  └─────────────┬────────────────────────┘
                │
                ↓
  ┌──────────────────────────────────────┐
  │      Load Protected Content          │
  │   (header with UserMenu)             │
  │   (task list scoped to user)         │
  └─────────────┬────────────────────────┘
                │
        ┌───────┴──────────┬──────────┬─────────┐
        ↓                  ↓          ↓         ↓
  Create Task      Edit Task    Delete Task  Sign Out
        │              │           │           │
        └──────────────┴───────────┴───────┬───┘
                                           │
                    ┌──────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │ Mutations verify:        │
        │ - User is authenticated  │
        │ - User owns task         │
        │ - Save task with userId  │
        └──────────────┬───────────┘
                       │
                       ↓
        ┌──────────────────────────┐
        │   Redirect to /sign-in   │
        │   (if signed out)        │
        └──────────────────────────┘
```

---

## Data Flow

```
┌──────────────────┐
│ Browser Storage  │
│ (Clerk Session)  │
└────────┬─────────┘
         │
         ↓
┌────────────────────────────────┐
│  Request with Auth Token       │
│  to Convex Function            │
└────────┬──────────────────────┘
         │
         ↓
┌────────────────────────────────┐
│ Convex Middleware              │
│ - Verify Token                 │
│ - Extract userId               │
│ - Attach to context            │
└────────┬──────────────────────┘
         │
         ↓
┌────────────────────────────────┐
│ Query/Mutation Handler         │
│ (convex/tasks.ts)              │
│ - Get userId from context      │
│ - Filter by userId             │
│ - Return only user's data      │
└────────┬──────────────────────┘
         │
         ↓
┌────────────────────────────────┐
│ Convex Database                │
│ Query: tasks                   │
│   WHERE userId = [userId]      │
└────────┬──────────────────────┘
         │
         ↓
┌────────────────────────────────┐
│ User's Tasks Only!             │
│ [Task 1]                       │
│ [Task 2]                       │
│ [Task 3]                       │
└────────┬──────────────────────┘
         │
         ↓
┌────────────────────────────────┐
│ Send Results to Client         │
└────────┬──────────────────────┘
         │
         ↓
┌────────────────────────────────┐
│ React Component Updates UI     │
└────────────────────────────────┘
```

---

## Component Tree with Auth

```
<RootLayout>
  └─ <ConvexClientProvider>
      └─ <ClerkProvider>
          └─ <ConvexProvider>
              └─ <AuthLayout>
                  ├─ Check Authentication
                  └─ <Header>
                      └─ <UserMenu>
                          ├─ Display: User Name
                          ├─ Display: Email
                          └─ Button: Sign Out
                  ├─ <Sidebar>
                  ├─ <TaskList>
                  │   └─ useQuery(api.tasks.list)
                  │       ↓ Filtered by userId
                  │       Display: User's Tasks Only
                  └─ <TaskInput>
                      └─ useMutation(api.tasks.create)
                          ↓ Creates task with userId

<SignInPage>
  └─ <SignIn> (Clerk Component)
      ├─ Email input
      ├─ Password input
      └─ Sign in button

<SignUpPage>
  └─ <SignUp> (Clerk Component)
      ├─ Email input
      ├─ Password input
      └─ Create account button
```

---

## Database Relationships

```
Clerk Account         Convex Database
┌────────────────┐   ┌──────────────┐
│ user_xxx       │   │ Users Table  │
│ - email        │───→ _id: ...     │
│ - password     │   │ clerkId: user_xxx
│ - name         │───→ email: ...   │
└────────────────┘   │ displayName: ...
                     │ createdAt: ...
                     └──────────────┘
                            │
                            │ Foreign Key
                            │ (clerkId)
                            │
                     ┌──────▼──────┐
                     │ Tasks Table │
                     │ _id: task_1 │
                     │ userId: user_xxx
                     │ title: ...  │
                     │ status: ...│
                     │ _id: task_2│
                     │ userId: user_xxx
                     │ title: ... │
                     │ status: ..│
                     └─────────────┘
```

---

## Authentication State Flow

```
Initial State
    ↓
isLoaded: false
isSignedIn: false
userId: null
    ↓
    ├─→ [Checking session...]
    │
Check Clerk Session
    │
    ├─→ Session Valid?
    │       ↓
    │    YES
    │       ↓
    │   isLoaded: true
    │   isSignedIn: true
    │   userId: "user_123"
    │       ↓
    │   [Show Protected Content]
    │
    └─→ Session Invalid?
            ↓
        NO
            ↓
        isLoaded: true
        isSignedIn: false
        userId: null
            ↓
        [Redirect to /sign-in]
```

---

## Query Execution Timeline

```
┌─────────────────┐
│ Call useQuery() │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Send Query to Convex            │
│ api.tasks.list()                │
│ + Clerk Auth Token              │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Convex Receives Request         │
│ - Verifies Token                │
│ - Extracts userId               │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Execute Query Handler           │
│ const userId = getUserId(ctx)   │
│ ↓ userId = "user_123"           │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Build Database Query            │
│ WHERE userId = "user_123"       │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Query Database                  │
│ Return only user's tasks        │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Send Results to Client          │
│ [Task 1, Task 2, Task 3]        │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Component Re-renders            │
│ Displays: User's Tasks          │
└─────────────────────────────────┘
```

---

## Security Layers

```
Layer 1: Middleware
├─ Check authentication
└─ Redirect if not authenticated

Layer 2: React Component
├─ AuthLayout wrapper
└─ Check session before rendering

Layer 3: Convex Function
├─ Verify auth token
└─ Extract user ID

Layer 4: Database Query
├─ Filter by userId
└─ Return only user's data

Layer 5: Mutation Verification
├─ Verify user owns resource
└─ Verify user is authenticated

Result: Complete Data Isolation! ✅
```

---

## File Interaction Map

```
Start: User visits app
    ↓
middleware.ts
├─ Check auth status
└─ Route to appropriate place
    ↓
app/layout.tsx
├─ Load ConvexClientProvider
├─ Load Clerk integration
└─ Load AuthLayout
    ↓
components/auth-layout.tsx
├─ Check useAuth() status
├─ Show loading state if needed
├─ Redirect to /sign-in if not auth
└─ Render protected content
    ↓
components/header.tsx
├─ Display app header
└─ Include UserMenu
    ↓
components/user-menu.tsx
├─ Show useUser() info
├─ Display sign-out button
└─ Call signOut() from Clerk
    ↓
Protected Page (e.g., /tasks)
├─ useQuery(api.tasks.list)
│  └─ Calls convex/tasks.ts
│     └─ Filters by userId
│        └─ Returns user's tasks
├─ useQuery(api.auth.currentUser)
│  └─ Gets current user from convex/auth.ts
└─ Display user's data only
```

---

This is the complete flow! Every layer ensures your data stays private and secure.
