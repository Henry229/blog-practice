# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 blog application with Supabase authentication system. Built with TypeScript, Tailwind CSS v4, and React 19.

## Development Commands

### Development Server
```bash
npm run dev           # Start development server (localhost:3000)
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
```

### Supabase Local Development
```bash
# Start local Supabase instance
supabase start        # Starts all services on ports 54321-54327

# Database management
supabase db reset     # Reset local database and apply migrations
supabase db diff      # Generate migration from schema changes
supabase migration new <name>  # Create new migration file

# Stop services
supabase stop         # Stop all Supabase services
```

**Important Ports:**
- API: 54321
- Database: 54322
- Studio: 54323 (web UI)
- Inbucket: 54324 (email testing)

## Architecture

### Authentication System

Two-tier Supabase auth implementation:

**Client-side (`lib/supabase/client.ts`)**
- Browser client using `@supabase/ssr`
- Use in Client Components only
- Cookie-based session management

**Server-side (`lib/supabase/server.ts`)**
- Server client with cookie handling
- Use in Server Components, Server Actions, Route Handlers
- Automatically syncs cookies via Next.js `cookies()` API

**Server Actions (`app/actions/auth.ts`)**
All auth operations are server actions:
- `login()` - Email/password authentication
- `signup()` - Registration with auto-profile creation
- `loginWithGoogle()` - OAuth flow
- `resetPasswordRequest()` / `resetPassword()` - Password recovery
- `signOut()` - Session termination
- `getUser()` / `getUserProfile()` - User data retrieval

**Centralized Configuration (`lib/auth.config.ts`)**
Single source of truth for:
- Route redirects (after login/signup/logout)
- Protected routes requiring authentication
- Auth-only routes (login/signup pages)
- OAuth providers and scopes
- Profile defaults

**Middleware (`middleware.ts`)**
Handles:
- Session refresh on every request
- Route protection (redirects unauthenticated users)
- Auth route blocking (redirects authenticated users away from login)

### Environment Configuration

**Required Variables** (`.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
```

Validated at runtime by `lib/env.ts` - startup will warn if missing.

### Database Schema

**profiles table**:
- user_id (uuid, references auth.users)
- email, first_name, last_name, mobile
- role (default: 'user')
- created_at, updated_at

Profile creation happens in two ways:
1. Explicit insert during signup (`app/actions/auth.ts:77-94`)
2. Database trigger (if implemented in migrations)

### Component Structure

```
components/
├── auth/          # Auth-specific components (forms, buttons)
└── ui/            # shadcn/ui components (button, input, label, card)
```

**UI Components**: Built with Radix UI primitives and Tailwind CSS using `class-variance-authority` for variants.

### Path Aliases

`@/*` resolves to project root (configured in `tsconfig.json`):
```typescript
import { createClient } from '@/lib/supabase/server';
```

## Key Technical Details

### Next.js 16 Specifics
- App Router only (no Pages directory)
- Server Components by default
- `async` cookies API (`await cookies()`)

### Supabase Auth Flow
1. User submits form → Server Action
2. Server Action calls Supabase Auth API
3. Auth sets httpOnly cookies
4. Middleware refreshes session on next request
5. Protected routes check session via middleware

### OAuth Callback
- Route: `/auth/callback/route.ts`
- Exchanges OAuth code for session
- Sets cookies and redirects per `authConfig`

### Email Verification
- Configured in `supabase/config.toml` (lines 128-129)
- Currently disabled: `enable_confirmations = false`
- Enable in production via config or Supabase dashboard

## Common Patterns

### Adding a New Protected Route
1. Add route to `lib/auth.config.ts` → `protectedRoutes` array
2. Middleware automatically enforces authentication

### Creating Server Action
```typescript
'use server';
import { createClient } from '@/lib/supabase/server';

export async function myAction() {
  const supabase = await createClient();
  // ... implementation
}
```

### Client Component with Auth
```typescript
'use client';
import { createClient } from '@/lib/supabase/client';

export default function MyComponent() {
  const supabase = createClient();
  // ... implementation
}
```

## Database Migrations

Location: `supabase/migrations/`

Existing migrations:
- `20250111000001_create_profiles_table.sql` - Profiles schema
- `20250111000002_fix_function_search_path.sql` - Function permissions

When modifying schema:
1. Make changes in Supabase Studio (localhost:54323)
2. Generate migration: `supabase db diff -f <migration_name>`
3. Review and commit migration file
4. Apply to remote: Push via Supabase CLI or dashboard
