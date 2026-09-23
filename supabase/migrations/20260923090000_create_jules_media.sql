create table if not exists public.jules_timeline_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 80),
  event_date date not null,
  description text not null default '' check (char_length(description) <= 500),
  media_type text not null check (media_type in ('image', 'video', 'audio')),
  storage_path text not null unique,
  created_at timestamptz not null default now()
);

alter table public.jules_timeline_entries enable row level security;

revoke all on table public.jules_timeline_entries from anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'jules-media',
  'jules-media',
  true,
  52428800,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime',
    'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/webm'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
