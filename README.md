# Luxora — Creative Studio

A luxury hospitality creative studio website + admin panel. Two Next.js 15 apps in a pnpm monorepo, sharing a Postgres database, deployed as two separate Vercel projects.

## Stack

- **Next.js 15** (App Router, React Server Components, Server Actions)
- **TypeScript** everywhere
- **Postgres** via Prisma (Neon-compatible — use the pooled connection)
- **Three.js + React Three Fiber + Drei** for animated 3D scenes on the marketing site
- **Tailwind CSS** for styling
- **Cloudinary** for production image uploads (local `/uploads` fallback for dev)
- **Signed-cookie sessions** for admin auth (JWT via `jose`, bcrypt for password hashes)
- **Turbo + pnpm workspaces** for the monorepo

## Layout

```
.
├── apps/
│   ├── web/      # Public marketing site (port 3000)
│   └── admin/    # Admin dashboard (port 3001)
├── packages/
│   ├── db/       # Prisma schema, client, seed script, default content
│   └── shared/   # Auth, Cloudinary, preview token helpers
├── .env.example  # Variables both apps read
└── turbo.json
```

## Quick start (local)

```bash
# 1. Install deps
pnpm install

# 2. Copy env and fill in values (DATABASE_URL is the only one required to start)
cp .env.example .env

# 3. Create schema and seed initial content
pnpm db:push
pnpm db:seed     # uses ADMIN_EMAIL / ADMIN_PASSWORD to create the first admin

# 4. Run both apps in parallel
pnpm dev
# web   → http://localhost:3000
# admin → http://localhost:3001
```

## Deploy to Vercel

You deploy **two separate Vercel projects** from this single repo:

| Project   | Root Directory | Build command                               | Required env                                            |
| --------- | -------------- | ------------------------------------------- | ------------------------------------------------------- |
| Web       | `apps/web`     | `pnpm install && pnpm --filter @luxora/web build`  | `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_SESSION_SECRET` |
| Admin     | `apps/admin`   | `pnpm install && pnpm --filter @luxora/admin build` | All of the above + `CLOUDINARY_*`                       |

For both, set "Install Command" to `pnpm install` and ensure the Vercel project is configured to detect the monorepo (it will when the Root Directory is set).

After deploying, run `pnpm db:push` and `pnpm db:seed` once against the production DATABASE_URL (locally with the prod URL in your env, or via a one-off Vercel deployment hook).

## Admin

- Sign in at `/login` (default: `ADMIN_EMAIL` / `ADMIN_PASSWORD`).
- Manage: brand, theme, hero, services, projects, clients, about, journal, contact, messages.
- Image uploads use Cloudinary in production, local `public/uploads` in dev.
- After every write, the admin pings the web app's `/api/revalidate` endpoint (secured by `ADMIN_SESSION_SECRET`) to bust the cache on relevant paths.

## Brand control

Everything visible on the site is editable from the admin:

- **Brand & Logo** — wordmark, tagline, logo image, footer note.
- **Theme & Fonts** — color tokens (background, surface, accent, text, muted, line) + preset palettes; serif and sans font selection.
- **Hero** — eyebrow, multi-line headline, description, background image, CTAs.
- **Services** — full CRUD with icon, title, description, order, published toggle.
- **Projects** — full CRUD with slug, category, year, client, image, gallery, tags, featured flag, draft/published toggle.
- **Clients** — name + optional logo URL.
- **About** — eyebrow, headline, body, image, stats (key/value), values (title/text).
- **Journal** — full CRUD posts with body, category, read time, image, publish date.
- **Contact** — headline, email, phone, address, offices, social links.
- **Inbox** — messages from the contact form.

## Environment variables

See `.env.example`. The two required ones in production are `DATABASE_URL` and `ADMIN_SESSION_SECRET` (same value in both Vercel projects).
