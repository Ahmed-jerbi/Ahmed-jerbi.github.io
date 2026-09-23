create table if not exists public.jules_timeline_media (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.jules_timeline_entries(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video', 'audio')),
  storage_path text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

insert into public.jules_timeline_media (entry_id, media_type, storage_path)
select id, media_type, storage_path
from public.jules_timeline_entries
where storage_path is not null
on conflict (storage_path) do nothing;

alter table public.jules_timeline_entries
  drop column if exists media_type,
  drop column if exists storage_path;

alter table public.jules_timeline_media enable row level security;
revoke all on table public.jules_timeline_media from anon, authenticated;

create index if not exists jules_timeline_media_entry_id_idx
  on public.jules_timeline_media (entry_id, sort_order);
