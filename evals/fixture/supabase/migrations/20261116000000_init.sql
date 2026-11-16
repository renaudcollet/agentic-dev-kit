create table public.projects (
  id bigint generated always as identity primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Projects are readable by everyone"
  on public.projects for select
  using (true);

create policy "Owners can insert their projects"
  on public.projects for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their projects"
  on public.projects for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can delete their projects"
  on public.projects for delete
  using (auth.uid() = owner_id);
