# Xairod. v8.0

## What's New in v8.0

- ✅ **Privacy Policy & Terms live at clean URLs** — `/privacy` and `/terms` work directly (e.g. `xairod.com/privacy`), served as static pages via `vercel.json` rewrites — zero new dependencies, no React Router needed
- ✅ **Real links wired in app** — Signup screen, Plans/Payment screen, and Profile → Settings all link to the real Privacy Policy and Terms pages (previously just plain text)
- Carries forward everything from v7.0 (rate limiting, onboarding checklist, analytics, cookie banner) and v6.0 (image upload, Google Maps, Telegram)

## How the Routing Works

No React Router was added — `/privacy` and `/terms` are plain static HTML files in `public/`, and `vercel.json` rewrites those specific paths to their `.html` files **before** the catch-all SPA rewrite. This means:

- Visiting `xairod.com/privacy` directly → serves `public/privacy.html`
- Visiting `xairod.com/terms` directly → serves `public/terms.html`
- Every other path → falls through to the React app as normal

If you ever edit the legal content, just replace `public/privacy.html` or `public/terms.html` — no app rebuild logic needed.

## Quick Start

```bash
npm install
cp .env.example .env.local
# add your Supabase + Google Maps keys
npm start
```

## Deploy to Vercel

1. Push to GitHub
2. Vercel → Add New Project → select repo
3. Add env vars: `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`, `REACT_APP_GOOGLE_MAPS_KEY`
4. Deploy — `/privacy` and `/terms` work immediately, no extra config needed

## Admin Access

Sign in with any email containing **"admin"**.

## Telegram

t.me/ckairod

---

Xairod.com · hello@xairod.com · Cairo, Egypt
