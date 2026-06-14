# Bold Era Academy

Bite-size AI learning app built with Next.js, shadcn/ui, Tailwind CSS, and Supabase.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. In Supabase, open `SQL Editor`.
3. Run the SQL in `supabase/schema.sql`.
4. In Supabase, open `Project Settings` > `API`.
5. Copy the project URL and anon public key.
6. Create `.env.local` from `.env.local.example`:

```bash
cp .env.local.example .env.local
```

7. Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

8. Restart the dev server.

For fast testing, Supabase email confirmation can be disabled in `Authentication` > `Providers` > `Email`. If email confirmation is enabled, users must confirm their email before they can sign in.

## Current Data Model

- `auth.users`: managed by Supabase Auth.
- `public.profiles`: stores user name and email.
- `public.lesson_progress`: stores completed lessons per user.

Row-level security is enabled so users can only read and write their own profile and lesson progress.

## Production Environment

Add the same variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then redeploy.
