# Verikon Academy — Edge AI workshop site

Marketing + lead-capture site for Verikon's Edge AI workshop. Next.js 14 (App Router),
TypeScript, Tailwind, Supabase.

Palette is matched to the deployed parent site (verikon.vercel.app): `#090A0C` background,
white text, `#FF6B35` orange accent, `#2563EB` blue ambient glows, Plus Jakarta Sans.

Runs on **port 3001** so it can sit alongside the main site on 3000.

```bash
npm install
npm run dev      # http://localhost:3001
npm run build
```

## Where to change things

| What | File |
| --- | --- |
| Everything about the workshop — curriculum, outcomes, prerequisites, hardware, dates, price | `lib/workshop.ts` |
| Venues, testimonials, instructors (all in the same file) | `lib/workshop.ts` |
| Venture name, tagline, email, phone, socials, nav | `lib/site.ts` |
| Colours, buttons, form fields, glows | `app/globals.css` |
| Home page section order | `app/page.tsx` |

The homepage is one product page assembled from `lib/workshop.ts`. There is no course
catalog — the site sells a single workshop.

## Routes

- `/` — hero, why Edge AI, outcomes, curriculum, fit, how it works, venues, testimonials, instructors, FAQ, CTA
- `/register` — registration form
- `/about`, `/contact`
- `/api/register` — POST endpoint that validates and stores registrations

## Photos

Drop files into `public/images/` and list them in `lib/workshop.ts`:

```
public/images/venues/         → venues[].photos     (array of paths)
public/images/testimonials/   → testimonials[].photo (single path or null)
public/images/team/           → instructors[].photo  (single path or null)
```

Empty arrays and `null` render a labelled placeholder, so the site is safe to deploy
before the photos arrive. See `public/images/README.md`.

## Supabase setup

1. Run `supabase/schema.sql` in the Supabase SQL editor. It creates `public.registrations`
   with RLS enabled and **no public policies** — only the service-role key can write. The
   file is safe to re-run on an existing install.
2. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only — never prefix with `NEXT_PUBLIC_`)
3. Restart the dev server.

Until those vars exist, `/api/register` logs submissions to the server console in
development and returns a message saying nothing was saved. **In production it returns a
503 instead**, telling the visitor to email you — it will not silently swallow a lead.

Duplicate submissions (same email + same workshop) are caught by a unique index and
reported back as "already on the list" rather than as an error.

## Before launch

Anything marked `REVIEW` in `lib/workshop.ts` is my guess and needs your sign-off:

- [ ] Duration, format, level, session count — currently 2 days / 16 hours / 4 sessions
- [ ] Price — `priceInr: 0` hides pricing entirely; set a number to show it
- [ ] `batches` is empty, so no dates render. Add entries and the dates section and the
      registration dropdown both appear automatically
- [ ] Curriculum — plausible Edge AI content, but written by me, not by you
- [ ] Hardware list — set it to what you actually hand out
- [ ] Instructor names, roles, bios (`instructors`)
- [ ] Second venue's name and city (`venues[1]` is a placeholder)
- [ ] Real testimonial quotes, names, and photos
- [ ] Venue photos for MMMUT Gorakhpur and the second campus
- [ ] Venture name in `lib/site.ts` — currently "Verikon Academy", a placeholder
- [ ] Real email, phone, social URLs, and `site.url`
- [ ] Wire Supabase and submit one test registration end to end

## Notes

- No payment gateway. The form captures intent; you confirm and collect payment by email.
  The `registrations` table already has a `status` column for the lifecycle when you want
  to add one.
- Dates render with an explicit UTC timezone so server and client markup always match.
