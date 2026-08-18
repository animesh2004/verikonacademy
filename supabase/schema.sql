-- Verikon Academy — Edge AI workshop registrations
--
-- Run this in the SAME Supabase project the main Verikon site uses:
--   SQL Editor → New query → paste → Run.
-- Idempotent: safe to re-run. It does not touch public.intake_submissions except
-- to read from it in the all_leads view at the bottom.

create table if not exists public.registrations (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- Distinguishes this lead stream from the agency's service enquiries.
  -- Always 'course' for rows written by the Academy site; the column exists so
  -- course and service leads can be filtered uniformly. See all_leads below.
  enquiry_type  text not null default 'course'
                check (enquiry_type in ('course', 'service')),

  name          text not null,
  email         text not null,
  phone         text,
  organisation  text,

  course_slug   text not null,
  course_title  text not null,
  batch_starts_on date,

  attending_as  text,
  -- Engineering branch: CSE / IT / ECE / EE / ME / Other / N/A
  branch        text,
  experience    text,
  goal          text,

  -- lifecycle
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'confirmed', 'enrolled', 'declined')),
  notes         text,

  -- light attribution
  source        text,
  user_agent    text
);

-- Safe to re-run on an install created before these columns existed.
alter table public.registrations add column if not exists attending_as text;
alter table public.registrations add column if not exists branch text;
alter table public.registrations add column if not exists enquiry_type text not null default 'course';

create index if not exists registrations_branch_idx       on public.registrations (branch);
create index if not exists registrations_enquiry_type_idx on public.registrations (enquiry_type);
create index if not exists registrations_course_slug_idx  on public.registrations (course_slug);
create index if not exists registrations_created_at_idx   on public.registrations (created_at desc);
create index if not exists registrations_status_idx       on public.registrations (status);

-- One registration per email per workshop. Re-submitting changes nothing; the API
-- route reports it as a duplicate so you do not chase the same lead twice.
create unique index if not exists registrations_email_course_uniq
  on public.registrations (lower(email), course_slug);

-- RLS on, no public policies: only the secret / service-role key (used server-side by
-- /api/register) can read or write. Note this is deliberately stricter than
-- intake_submissions, which allows anonymous inserts from the browser.
alter table public.registrations enable row level security;


-- ---------------------------------------------------------------------------
-- Unified lead feed: course registrations + service enquiries in one place,
-- filterable with `where lead_type = 'course'` or `'service'`.
--
-- NOTE: created WITHOUT `with (security_invoker = true)` inline — that syntax
-- needs PostgreSQL 15+ and hard-errors on 14, which rolls back this whole
-- script. It is applied afterwards in a DO block that tolerates failure.
-- ---------------------------------------------------------------------------
create or replace view public.all_leads as
  select
    r.id,
    'course'::text        as lead_type,
    r.created_at          as received_at,
    r.name,
    r.email,
    r.phone,
    r.organisation        as organisation,
    r.course_title        as subject,
    r.status              as status,
    r.goal                as detail
  from public.registrations r

  union all

  select
    i.id,
    'service'::text       as lead_type,
    i.received_at         as received_at,
    i.name,
    i.email,
    i.phone,
    i.company             as organisation,
    i.project_type        as subject,
    null::text            as status,
    i.problem             as detail
  from public.intake_submissions i;

-- Make the view respect each table's RLS instead of running as its owner.
-- Postgres 15+ only; on 14 this is skipped with a notice rather than failing.
do $$
begin
  execute 'alter view public.all_leads set (security_invoker = true)';
exception when others then
  raise notice 'security_invoker unsupported on this Postgres version — relying on the revoke below instead';
end $$;

-- Belt and braces, and the actual protection on Postgres 14: the view is for
-- server-side and dashboard use only, so no browser-facing role may read it.
revoke all on public.all_leads from anon, authenticated;

-- Everything, newest first:
--   select * from public.all_leads order by received_at desc;
-- Just the workshop registrations:
--   select * from public.all_leads where lead_type = 'course' order by received_at desc;
-- Just the agency enquiries:
--   select * from public.all_leads where lead_type = 'service' order by received_at desc;
