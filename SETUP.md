# Setup — skin-app

Medusa + Next.js skincare storefront. Postgres runs on **Supabase Cloud** (not local Docker). Any computer can clone this repo and point at the same cloud database.

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [npm](https://www.npmjs.com/) v10+
- A [Supabase Cloud](https://supabase.com/dashboard) project (free tier works)
- Git

## 1. Clone and install

```powershell
git clone https://github.com/ariyazmola/skin-app.git
cd skin-app
npm install
```

## 2. Supabase Cloud database

1. Open [supabase.com/dashboard](https://supabase.com/dashboard) and create or select a project.
2. Save the database password (shown once at project creation).
3. Go to **Project Settings → Database → Connection string**.
4. Choose **URI**, **Direct connection**, port **5432** (not the transaction pooler on 6543).
5. Copy the connection string and ensure it includes SSL, e.g. `?sslmode=require`.

Example (project **Ciel**, ref `txlfrxoreoljsjmcbelt`):

```
postgresql://postgres:[PASSWORD]@db.txlfrxoreoljsjmcbelt.supabase.co:5432/postgres?sslmode=require
```

## 3. Backend environment

```powershell
copy apps\backend\.env.template apps\backend\.env
```

Edit `apps/backend/.env` and set `DATABASE_URL` to your Supabase Cloud URI. Keep the CORS and JWT values from the template unless you have reason to change them.

`REDIS_URL` is optional — Medusa uses an in-memory fallback if Redis is not running.

## 4. Run migrations

```powershell
cd apps\backend
npx medusa db:migrate
cd ..\..
```

Migration scripts are idempotent. They set up North America regions (CAD/USD), the Restorative Cream product (50ml / 100ml), inventory, and seed an admin user on a fresh database.

**Default admin** (after seed on a new DB): `admin@medusa-test.com` / `supersecret123`

## 5. Storefront environment

```powershell
copy apps\storefront\.env.local.template apps\storefront\.env.local
```

Get the publishable API key:

- Medusa Admin → **Settings → Publishable API Keys**, or
- Check terminal output from the first `db:migrate` run

Set in `apps/storefront/.env.local`:

```env
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_DEFAULT_REGION=ca
```

## 6. Start dev servers

From the repo root:

```powershell
npm run dev
```

| Service    | URL                          |
|------------|------------------------------|
| Storefront | http://localhost:8000/ca     |
| Backend    | http://localhost:9000        |
| Admin      | http://localhost:9000/app    |

## Other computers

Use the **same** Supabase `DATABASE_URL` and publishable key (share via a password manager — never commit `.env` files). Each machine only needs Node, npm, and Git. No local Supabase or Docker required.

```powershell
git pull
npm install
cd apps\backend
npx medusa db:migrate
cd ..\..
npm run dev
```

## Secrets

Never commit:

- `apps/backend/.env`
- `apps/storefront/.env.local`

These are listed in `.gitignore`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `connect ECONNREFUSED 127.0.0.1:54322` | `DATABASE_URL` still points at local Supabase — update to Supabase Cloud URI |
| Storefront shows no products | Wrong or missing `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` |
| SSL / connection errors | Add `?sslmode=require` to `DATABASE_URL` |
| `password authentication failed` | Replace `YOUR_DB_PASSWORD` in `apps/backend/.env` with your Supabase database password (Dashboard → Project Settings → Database). Use **Reset database password** if you lost it. |
| Migrate hangs / timeout | Usually wrong password or project paused — verify project **Ciel** is active in Supabase dashboard |
| Stale homepage after data changes | Delete `apps/storefront/.next` and restart `npm run dev` |
