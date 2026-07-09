# Astrology Platform — Task 1 (Admin CMS + Public Home Page + Authentication)

This repository implements **only** the Task 1 scope:

1. Admin CMS (Admin Login, Dashboard with sidebar, Homepage CMS, Settings)
2. Public Home Page (fully driven by CMS content — no hardcoded copy)
3. Email + Password Authentication (Register, Login, Logout, Current User)

Everything explicitly listed as out-of-scope in the brief (blogs, astrologers,
booking, wallet, payments, chat, reviews, notifications, AI, voice/video
calling, user dashboard, admin analytics, search, OTP, email verification,
mobile login, forgot password, roles & permissions, etc.) has intentionally
**not** been built.

## Tech stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui-style components
- **Backend:** Hono on Cloudflare Workers
- **Database:** Cloudflare D1 (via Drizzle ORM)
- **Storage:** Cloudflare R2 (bound in `wrangler.toml`, not used in Task 1)
- **Repo tooling:** Turborepo + pnpm workspaces
- **State/data:** Zustand, TanStack Query, Zod, React Hook Form
- **Auth:** JWT stored in an HttpOnly cookie, PBKDF2-SHA256 password hashing (Web Crypto)

## Repository structure

```
apps/
  web/      → Public website (Home, Login, Register) — localhost:3000
  admin/    → Admin CMS (Login, Dashboard, Homepage editor, Settings) — localhost:3001
workers/
  api/      → Hono API on Cloudflare Workers — localhost:8787
packages/
  ui/       → Shared shadcn/ui-style components + Tailwind preset
  db/       → Drizzle ORM schema + D1 client
  shared/   → Shared constants + Zod validation schemas
  types/    → Shared TypeScript domain types
  utils/    → Shared helpers (id generation, CMS defaults)
```

## Prerequisites

- Node.js >= 18.17
- pnpm >= 9 (`npm install -g pnpm`)
- A Cloudflare account (for D1/Workers deployment) and `wrangler` CLI (installed as a dev dependency)

## 1. Install dependencies

```bash
pnpm install
```

## 2. Configure the database (Cloudflare D1)

Create the D1 database:

```bash
cd workers/api
pnpm dlx wrangler d1 create astro-platform-db
```

Copy the returned `database_id` into `workers/api/wrangler.toml` (both the
top-level `[[d1_databases]]` block and the `[[env.production.d1_databases]]`
block if deploying to production).

Apply the migration that creates the 4 required tables
(`admin_users`, `users`, `homepage_sections`, `settings`):

```bash
pnpm db:migrate:local     # local SQLite simulation used by `wrangler dev`
pnpm db:migrate:remote    # real D1 database in Cloudflare
```

## 3. Configure secrets

Local development (`workers/api/.dev.vars`):

```bash
cp workers/api/.dev.vars.example workers/api/.dev.vars
# edit JWT_SECRET to a long random string
```

Production:

```bash
cd workers/api
pnpm dlx wrangler secret put JWT_SECRET --env production
```

## 4. Seed the first admin user

There is intentionally no public "admin register" endpoint. Generate a seed
SQL file and apply it:

```bash
cd workers/api
node scripts/seed-admin.mjs "Admin Name" "admin@example.com" "StrongPass123"
pnpm dlx wrangler d1 execute astro-platform-db --local --file=./seed-admin.sql
pnpm dlx wrangler d1 execute astro-platform-db --remote --file=./seed-admin.sql
```

## 5. Environment variables for the frontends

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
# both default to NEXT_PUBLIC_API_URL=http://localhost:8787
```

## 6. Run everything locally

```bash
# Terminal 1 — API
cd workers/api && pnpm dev        # http://localhost:8787

# Terminal 2 — Public site
cd apps/web && pnpm dev           # http://localhost:3000

# Terminal 3 — Admin CMS
cd apps/admin && pnpm dev         # http://localhost:3001
```

Or from the repo root, run all three in parallel via Turborepo:

```bash
pnpm dev
```

## 7. Deploying

```bash
# API
cd workers/api && pnpm deploy -- --env production

# Web + Admin (Cloudflare Pages, Vercel, or any Next.js host)
cd apps/web && pnpm build
cd apps/admin && pnpm build
```

Set `NEXT_PUBLIC_API_URL` in each frontend's hosting provider to the deployed
Workers API URL, and set `ALLOWED_ORIGINS` in `wrangler.toml` (production env)
to the deployed web/admin origins.

> **Cookie note:** for HttpOnly cookies to be sent cross-origin in production,
> deploy the web app, admin app, and API under subdomains of the same root
> domain (e.g. `app.example.com`, `admin.example.com`, `api.example.com`) so
> the `SameSite=Lax` session cookies are treated as same-site.

## Database tables (only these 4 exist)

- `admin_users` — CMS administrators
- `users` — public platform users
- `homepage_sections` — one row per editable homepage section (hero, features, whyChooseUs, testimonials, faq, footer)
- `settings` — singleton row of site-wide settings

## API endpoints (only these exist)

| Group      | Method & Path                  | Auth        |
|------------|---------------------------------|-------------|
| Auth       | `POST /api/auth/register`       | Public      |
| Auth       | `POST /api/auth/login`          | Public      |
| Auth       | `POST /api/auth/logout`         | User        |
| Auth       | `GET /api/auth/me`              | User        |
| Admin Auth | `POST /api/admin/auth/login`    | Public      |
| Admin Auth | `POST /api/admin/auth/logout`   | Admin       |
| Admin Auth | `GET /api/admin/auth/me`        | Admin       |
| Homepage   | `GET /api/homepage`             | Public      |
| Homepage   | `GET /api/admin/homepage`       | Admin       |
| Homepage   | `PUT /api/admin/homepage`       | Admin       |
| Settings   | `GET /api/settings`             | Public      |
| Settings   | `GET /api/admin/settings`       | Admin       |
| Settings   | `PUT /api/admin/settings`       | Admin       |

Admin auth endpoints exist because "Admin Login / Protected routes / Logout"
are explicitly required under **CMS Requirements**, even though the top-level
API list groups everything under "Authentication".
