# Ramtun (Next.js) — Netlify Deployment Guide

This document explains how to deploy the Ramtun educational crossword application (Next.js, App Router) to Netlify.

- Framework: Next.js 15 (App Router)
- Deployment target: Netlify (OpenNext adapter auto-configured)
- Project layout: monorepo; web app in `ramtun-web/`
- Build config: `netlify.toml` at repository root

---

## 1) Prerequisites

### Accounts
- GitHub account (repository hosting)
- Netlify account (deployment platform)
- Supabase project (authentication and data)

### Local development (optional but recommended)
Verify you can build the app locally before deploying:

```bash
# From repository root
cd ramtun-web
npm install
npm run build
```

A successful build generates the `.next` directory and exits with code 0.

### Environment variables
Configure these in Netlify (Site settings → Build & deploy → Environment):

Public (exposed to the client):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Server-side (secret, do NOT prefix with NEXT_PUBLIC_):
- `OPENAI_API_KEY`
- Any other server secrets your app requires

Also configure Supabase Authentication → URL settings `Site URL` to match your Netlify domain (see section 2.4).

---

## 2) Step-by-step deployment

### 2.1 Connect the GitHub repository to Netlify
1. In Netlify, click "Add new site" → "Import from Git".
2. Choose your Git provider and select the `ai-ramtun-app` repository.
3. Select branch `master`.

### 2.2 Build configuration (via netlify.toml)
This repository contains a `netlify.toml` at the root:

```toml
[build]
  base = "ramtun-web"
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
```

Notes:
- Monorepo: `base = "ramtun-web"` ensures the build runs inside the app directory.
- Publish directory is `.next` (Netlify’s Next.js runtime handles SSR/ISR and APIs for you).
- Node 20 is required for Next.js 15 and modern tooling.

### 2.3 Environment variables in Netlify
Set the following in Netlify → Site settings → Build & deploy → Environment:

Public (client-visible):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Private (server-side only):
- `OPENAI_API_KEY`
- Any other secrets required (without `NEXT_PUBLIC_`)

Click "Save" after editing variables.

### 2.4 Supabase Authentication URLs
In your Supabase project:
- Go to Authentication → URL Configuration.
- Set `Site URL` to your Netlify domain (e.g., `https://<your-site>.netlify.app` or your custom domain).
- If you use email verification or other auth flows that rely on redirect links, ensure any callback routes are permitted (e.g., `/auth/verify-email`).

### 2.5 First deploy
1. In Netlify, click "Deploy site" (or trigger an initial build after connecting).
2. Netlify will install dependencies and run `npm run build` in `ramtun-web`.
3. On success, the site goes live on a Netlify-generated domain.

### 2.6 Verify deployment
Test key routes:
- `https://<site>./` (home)
- `/dashboard`
- `/student`
- `/auth/login`
- `/auth/register`
- `/auth/verify-email`

Test API route:
- `/api/generate-crossword`

Confirm authentication flows work (login, signup, email verification) and the app’s pages render correctly.

---

## 3) Post-deployment checklist

- [ ] Home (`/`) loads without errors
- [ ] Teacher dashboard (`/dashboard`) works (for authenticated teacher users)
- [ ] Student dashboard (`/student`) works (for authenticated students)
- [ ] Auth routes: `/auth/login`, `/auth/register`, `/auth/verify-email`
- [ ] API: `/api/generate-crossword` responds correctly
- [ ] Email verification links from Supabase redirect to `/auth/verify-email` and complete verification
- [ ] (Optional) Custom domain configured in Netlify and active (remember to update Supabase `Site URL`)

---

## 4) Troubleshooting

### Missing environment variables
- Symptom: Build fails or runtime errors referencing undefined env vars.
- Fix: Ensure all required env vars are set in Netlify. Public variables require `NEXT_PUBLIC_` prefix; secrets must not have it.

### Email verification link doesn’t work
- Symptom: Clicking verification link leads to wrong domain or error.
- Fix: Update Supabase `Site URL` to your production domain in Authentication → URL Configuration.

### App Router CSR bailout / Suspense warnings
- Symptom: Error like `useSearchParams() should be wrapped in a suspense boundary` during prerender/build.
- Fix: Wrap components using `useSearchParams` or `useRouter` (in App Router) with `<Suspense>` where required.

### Node version mismatch
- Symptom: Build errors related to Node features.
- Fix: Ensure `NODE_VERSION = "20"` in `netlify.toml` (or set Node version in Site settings).

### Monorepo path issues
- Symptom: Netlify builds from repository root instead of app folder.
- Fix: Ensure `base = "ramtun-web"` is present in `netlify.toml`.

### SSR/ISR not behaving as expected
- Symptom: Pages that should be dynamic act static or vice versa.
- Fix: Netlify’s Next.js adapter is auto-configured. Avoid `next export` for SSR apps. Verify route handlers, caching, and `revalidate` settings.

### Supabase SSR cookies / middleware
- Symptom: Auth session not persisting server-side.
- Fix: For Next.js 15, use `@supabase/ssr` with `createServerClient` and pass `response.cookies` in middleware/route handlers. Avoid custom cookie method shims.

### Warnings from `@supabase/realtime-js`
- Symptom: `Critical dependency: the request of a dependency is an expression` warnings in build logs.
- Fix: These are benign and do not block the build.

---

## 5) Maintenance

- Every push to the `master` branch triggers a new Netlify build.
- Update environment variables in Netlify when secrets/URLs change; redeploy if necessary.
- For Next.js and dependency upgrades, verify local builds (`npm run build`) before pushing.
- Monitor Netlify deploy logs for build/runtime issues.
- If switching to a custom domain, update Supabase `Site URL` accordingly.

---

## References
- Netlify + Next.js (OpenNext): https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- Supabase Auth URL settings: https://supabase.com/docs/guides/auth
- Next.js App Router: https://nextjs.org/docs/app

