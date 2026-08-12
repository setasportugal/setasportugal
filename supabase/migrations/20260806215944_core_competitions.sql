create extension if not exists pgcrypto;

create table if not exists public.associations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text,
  region text,
  founded_year integer check (founded_year between 1800 and 2100),
  website text,
  facebook text,
  instagram text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.teams
  add column if not exists association_id uuid references public.associations(id) on delete set null;

create table if not exists public.competitions (
  id uuid primary key default gen_random_uuid(),
  association_id uuid references public.associations(id) on delete set null,
  name text not null,
  type text not null default 'Campeonato',
  competition_mode text not null default 'individual'
    check (competition_mode in ('individual', 'equipas')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seasons (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  name text not null,
  year integer not null check (year between 1900 and 2100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (competition_id, year)
);

create table if not exists public.season_participants (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.seasons(id) on delete cascade,
  player_id uuid references public.players(id) on delete cascade,
  team_id uuid references public.teams(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (
    (player_id is not null and team_id is null)
    or (player_id is null and team_id is not null)
  )
);

create table if not exists public.rounds (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.seasons(id) on delete cascade,
  number integer not null check (number > 0),
  date date,
  created_at timestamptz not null default now(),
  unique (season_id, number)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  player1_id uuid references public.players(id) on delete restrict,
  player2_id uuid references public.players(id) on delete restrict,
  team1_id uuid references public.teams(id) on delete restrict,
  team2_id uuid references public.teams(id) on delete restrict,
  player1_score integer not null default 0 check (player1_score >= 0),
  player2_score integer not null default 0 check (player2_score >= 0),
  status text not null default 'scheduled'
    check (status in ('scheduled', 'completed', 'cancelled')),
  played_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (player1_id is not null and player2_id is not null and team1_id is null and team2_id is null)
    or (player1_id is null and player2_id is null and team1_id is not null and team2_id is not null)
  ),
  check (player1_id is distinct from player2_id),
  check (team1_id is distinct from team2_id)
);

-- Align deployments that already created the initial tables manually.
alter table public.competitions
  add column if not exists notes text,
  add column if not exists updated_at timestamptz not null default now();

update public.competitions
set competition_mode = 'individual'
where competition_mode is null;

alter table public.competitions
  alter column type set default 'Campeonato',
  alter column type set not null,
  alter column competition_mode set default 'individual',
  alter column competition_mode set not null;

alter table public.seasons
  add column if not exists updated_at timestamptz not null default now();

alter table public.seasons
  alter column competition_id set not null,
  alter column year set not null;

alter table public.rounds
  alter column season_id set not null;

alter table public.matches
  add column if not exists team1_id uuid references public.teams(id) on delete restrict,
  add column if not exists team2_id uuid references public.teams(id) on delete restrict,
  add column if not exists status text not null default 'scheduled'
    check (status in ('scheduled', 'completed', 'cancelled')),
  add column if not exists played_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

update public.matches
set player1_score = 0
where player1_score is null;

update public.matches
set player2_score = 0
where player2_score is null;

alter table public.matches
  alter column round_id set not null,
  alter column player1_score set default 0,
  alter column player1_score set not null,
  alter column player2_score set default 0,
  alter column player2_score set not null;

alter table public.season_participants
  add constraint season_participants_exactly_one_participant
  check (
    (player_id is not null and team_id is null)
    or (player_id is null and team_id is not null)
  ) not valid;

alter table public.matches
  add constraint matches_exactly_one_participant_type
  check (
    (player1_id is not null and player2_id is not null and team1_id is null and team2_id is null)
    or (player1_id is null and player2_id is null and team1_id is not null and team2_id is not null)
  ) not valid,
  add constraint matches_player_1_not_2
  check (player1_id is distinct from player2_id) not valid,
  add constraint matches_team_1_not_2
  check (team1_id is distinct from team2_id) not valid;

create unique index if not exists season_participants_player_unique
  on public.season_participants (season_id, player_id)
  where player_id is not null;

create unique index if not exists season_participants_team_unique
  on public.season_participants (season_id, team_id)
  where team_id is not null;

create unique index if not exists team_players_one_active_per_player
  on public.team_players (player_id)
  where is_active;

create index if not exists teams_association_id_idx on public.teams (association_id);
create index if not exists competitions_association_id_idx on public.competitions (association_id);
create index if not exists seasons_competition_id_idx on public.seasons (competition_id);
create index if not exists rounds_season_id_idx on public.rounds (season_id);
create index if not exists matches_round_id_idx on public.matches (round_id);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists associations_updated_at on public.associations;
create trigger associations_updated_at
  before update on public.associations
  for each row execute function public.handle_updated_at();

drop trigger if exists competitions_updated_at on public.competitions;
create trigger competitions_updated_at
  before update on public.competitions
  for each row execute function public.handle_updated_at();

drop trigger if exists seasons_updated_at on public.seasons;
create trigger seasons_updated_at
  before update on public.seasons
  for each row execute function public.handle_updated_at();

drop trigger if exists matches_updated_at on public.matches;
create trigger matches_updated_at
  before update on public.matches
  for each row execute function public.handle_updated_at();

alter table public.players enable row level security;
alter table public.teams enable row level security;
alter table public.team_players enable row level security;
alter table public.associations enable row level security;
alter table public.competitions enable row level security;
alter table public.seasons enable row level security;
alter table public.season_participants enable row level security;
alter table public.rounds enable row level security;
alter table public.matches enable row level security;

drop policy if exists "Acesso total inicial - players" on public.players;
drop policy if exists "Acesso total inicial - teams" on public.teams;
drop policy if exists "Acesso total inicial - team_players" on public.team_players;

create policy "Authenticated users can manage players" on public.players
  for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage teams" on public.teams
  for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage team players" on public.team_players
  for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage associations" on public.associations
  for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage competitions" on public.competitions
  for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage seasons" on public.seasons
  for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage season participants" on public.season_participants
  for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage rounds" on public.rounds
  for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage matches" on public.matches
  for all to authenticated using (true) with check (true);

revoke all on table public.players, public.teams, public.team_players,
  public.associations, public.competitions, public.seasons,
  public.season_participants, public.rounds, public.matches from anon;

grant select, insert, update, delete on table public.players, public.teams,
  public.team_players, public.associations, public.competitions, public.seasons,
  public.season_participants, public.rounds, public.matches to authenticated;

