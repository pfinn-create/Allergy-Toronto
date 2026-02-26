# AllergyTO — Setup Guide

## What you need

- [Node.js 18+](https://nodejs.org)
- A [Supabase](https://supabase.com) account (free tier works)
- (Optional) A [Google Maps API key](https://developers.google.com/maps) for map view

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name (e.g. `allergy-toronto`) and a strong database password
3. Select the **Canada (Central)** region
4. Wait ~2 minutes for it to provision

---

## 2. Run the database schema

1. In your Supabase dashboard → **SQL Editor**
2. Paste the contents of `supabase/schema.sql` and click **Run**

This creates all tables, views, RLS policies, and seeds 5 sample Toronto places.

---

## 3. Configure environment variables

Copy `.env.local` and fill in your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...   # optional
```

Find these in: Supabase Dashboard → **Project Settings** → **API**

---

## 4. Configure Supabase Auth

In Supabase Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: `http://localhost:3000` (dev) or your production URL
- **Redirect URLs**: add `http://localhost:3000/auth/callback`

---

## 5. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Set the environment variables in the Vercel dashboard, and update your Supabase redirect URLs to your production domain.

---

## Project structure

```
src/
  app/
    page.tsx              # Home / search page
    places/[id]/          # Place detail + ratings
    add-place/            # Submit a new place
    auth/login/           # Sign in
    auth/register/        # Sign up
    auth/callback/        # OAuth callback
    profile/              # User profile + review history
  components/
    Navbar.tsx
    places/
      PlaceCard.tsx       # Card shown in the listing
      SearchBar.tsx       # Search + filter UI
      AddPlaceForm.tsx    # Form to submit new places
    ratings/
      RatingForm.tsx      # Star rating + review form
      RatingCard.tsx      # Individual review display
      RatingFormSection.tsx
    ui/
      Button, Input, Select, Textarea, StarRating, AllergyBadge
  lib/
    supabase/client.ts    # Browser Supabase client
    supabase/server.ts    # Server Supabase client
    constants.ts          # Allergy types, neighbourhoods, labels
    utils.ts              # Helpers
  types/index.ts          # TypeScript types

supabase/
  schema.sql              # Full DB schema + seed data
```

---

## Key features

| Feature | Description |
|---|---|
| **Browse places** | Grid of allergy-friendly Toronto spots, sorted by rating |
| **Search & filter** | By name, neighbourhood, allergy type, minimum rating |
| **Place detail** | Full info, allergy badges, rating breakdown, all reviews |
| **Rate a place** | 4-dimension star ratings + written review + allergy tags |
| **Add a place** | Crowd-sourced submissions (reviewed before publishing) |
| **Auth** | Email/password via Supabase, with email confirmation |
| **Profile** | See your reviews and submitted places |

## Rating dimensions

Every review scores a place on 4 axes (1–5 stars each):

1. **Overall allergy friendliness**
2. **Staff knowledge** — Do they understand cross-contamination?
3. **Menu options** — How varied are the allergy-safe choices?
4. **Cross-contamination care** — Separate prep areas, dedicated utensils?
