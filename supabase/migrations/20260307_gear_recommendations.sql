-- Gear Advisor: store recommendation sessions for shareable URLs
create table if not exists recommendations (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  inputs      jsonb not null,
  boards      jsonb not null,
  created_at  timestamptz default now()
);

-- Index for fast slug lookup
create index if not exists recommendations_slug_idx on recommendations (slug);
