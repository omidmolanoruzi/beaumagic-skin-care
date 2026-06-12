# skin-app

Warm-minimal skincare storefront built on [Medusa](https://medusajs.com) and [Next.js](https://nextjs.org). Single product (**Restorative Cream**) with 50ml / 100ml size variants, Canada (CAD) and United States (USD) regions, and a custom cream jar image.

**Repository:** https://github.com/ariyazmola/skin-app

## Stack

- **Backend:** Medusa v2 (`apps/backend`)
- **Storefront:** Next.js App Router (`apps/storefront`)
- **Database:** Supabase Cloud Postgres (shared across machines)

## Quick start

See **[SETUP.md](./SETUP.md)** for full instructions (Supabase Cloud connection, env files, migrations, dev servers).

```powershell
git clone https://github.com/ariyazmola/skin-app.git
cd skin-app
npm install
copy apps\backend\.env.template apps\backend\.env
copy apps\storefront\.env.local.template apps\storefront\.env.local
# Edit .env files with your Supabase DATABASE_URL and publishable key
cd apps\backend && npx medusa db:migrate && cd ..\..
npm run dev
```

- Storefront: http://localhost:8000/ca
- Admin: http://localhost:9000/app

## Features

- Restorative Cream with 50ml ($45) and 100ml ($72) variants
- Homepage shows two variant cards from one Medusa product
- Canada (CAD) + United States (USD) regions
- Warm minimal UI (Typology × Klur inspired)
- Editorial homepage sections (hero, value prop, collection)

## Project structure

```
apps/
  backend/     Medusa API + Admin + migration scripts
  storefront/  Next.js storefront
timeline.md    Change log
SETUP.md       Environment and Supabase Cloud setup
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend + storefront (Turbo) |
| `npm run build` | Production build |
| `cd apps/backend && npx medusa db:migrate` | Run DB migrations against Supabase |

## Resources

- [Medusa Documentation](https://docs.medusajs.com)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
