-- Table principale : espaces (Duo ou Solo)
create table spaces (
  id uuid default gen_random_uuid() primary key,
  mode text not null check (mode in ('duo', 'solo')),
  status text not null default 'active' check (status in ('pending', 'active')),
  person_a_name text not null,
  person_a_pin text not null,
  person_b_name text,
  person_b_pin text,
  invite_code text unique,
  created_at timestamptz default now()
);

-- Table des sessions
create table sessions (
  id uuid default gen_random_uuid() primary key,
  space_id uuid references spaces(id) on delete cascade,
  person_side text not null check (person_side in ('A', 'B')),
  title text,
  raw_message text,
  translation text,
  markers jsonb default '[]',
  created_at timestamptz default now()
);

-- RLS
alter table spaces enable row level security;
alter table sessions enable row level security;

create policy "Public read spaces" on spaces for select using (true);
create policy "Public insert spaces" on spaces for insert with check (true);
create policy "Public update spaces" on spaces for update using (true);

create policy "Public read sessions" on sessions for select using (true);
create policy "Public insert sessions" on sessions for insert with check (true);
