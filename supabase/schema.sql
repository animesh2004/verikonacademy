-- ===========================================================================
-- Verikon Academy — Institutional & Workshop Registrations
-- ===========================================================================
--
-- Run this in your Supabase project (https://supabase.com):
--   SQL Editor → New query → paste → Run.
--
-- Idempotent: safe to run multiple times.
-- ===========================================================================

create table if not exists public.registrations (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  -- Lead classification
  enquiry_type    text not null default 'course',

  -- Institution & Contact details
  organisation    text not null,                       -- Institution / College / Company name
  name            text not null,                       -- Contact person name
  email           text not null,                       -- Official / contact email
  phone           text not null,                       -- Phone number
  role            text,                                -- Faculty, HOD, TPO, Student Lead, etc.
  attending_as    text,                                -- Role context

  -- Workshop & Cohort details
  course_slug     text not null default 'edge-ai',
  course_title    text not null default 'Edge AI',
  cohort_size     text,                                -- e.g. "60–120 students"
  format          text,                                -- e.g. "On-campus", "Live Online"
  batch_starts_on date,

  -- Notes & requirements
  branch          text,
  experience      text,
  goal            text,                                -- Submission notes & requirements
  notes           text,                                -- Admin / internal notes

  -- Lifecycle status
  status          text not null default 'new'
                  check (status in ('new', 'contacted', 'confirmed', 'enrolled', 'declined')),

  -- Attribution
  source          text,
  user_agent      text
);

-- Safe migrations in case table already existed
alter table public.registrations add column if not exists role text;
alter table public.registrations add column if not exists cohort_size text;
alter table public.registrations add column if not exists format text;
alter table public.registrations add column if not exists attending_as text;
alter table public.registrations add column if not exists branch text;
alter table public.registrations add column if not exists enquiry_type text not null default 'course';

-- Indexes for dashboard & query speed
create index if not exists registrations_created_at_idx   on public.registrations (created_at desc);
create index if not exists registrations_status_idx       on public.registrations (status);
create index if not exists registrations_organisation_idx on public.registrations (organisation);
create index if not exists registrations_course_slug_idx  on public.registrations (course_slug);

-- Row Level Security (RLS)
-- Server-side service-role key (used by Next.js /api/register) bypasses RLS and can read/write.
alter table public.registrations enable row level security;
