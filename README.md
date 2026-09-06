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

## Video

Projects accept video as well as images. A gallery entry ending in `.mp4`,
`.webm`, `.mov`, `.m4v` or `.ogv` renders as an inline player on the project
page; everything else renders as an image. Videos load only when the viewer
presses play, and pause when scrolled out of view.

Uploads go **straight from the browser to Cloudinary**, signed by
`/api/upload/signature`. They cannot be proxied through `/api/upload` in
production — Vercel caps a serverless request body at ~4.5MB, which any real
video exceeds. That route remains for images and for local development, where
Cloudinary is usually unconfigured and files land in `public/uploads`.

Encode masters down before uploading — camera exports run 10–30 Mbps, far more
than a web page should serve, and Cloudinary's free plan rejects files over
100MB:

```bash
ffmpeg -i input.mp4 \
  -vf "scale=w=1920:h=1920:force_original_aspect_ratio=decrease:force_divisible_by=2" \
  -c:v libx264 -profile:v high -preset medium -crf 23 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart output.mp4
```

### Bulk import

`packages/db/prisma/import-weddings.ts` uploads a folder of encoded clips and
their poster frames, then upserts the project that points at them. It is
idempotent — assets use deterministic public_ids and the project is upserted by
slug, so a re-run after a failure resumes instead of duplicating.

```bash
WEDDING_MEDIA_DIR="D:/Website/Decoration/web-ready" pnpm db:import-weddings
```

Requires `DATABASE_URL` and the three `CLOUDINARY_*` values in the root `.env`.
Pass `FORCE=1` to re-upload assets that already exist.
