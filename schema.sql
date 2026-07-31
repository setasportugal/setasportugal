-- =============================================
-- Estrutura inicial - Base de Dados de Setas
-- Jogadores + Equipas + Relação entre eles
-- =============================================

-- Extensão para UUIDs (já costuma estar ativa no Supabase)
create extension if not exists "uuid-ossp";

-- Tabela de Jogadores
create table public.players (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  nickname text,
  city text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabela de Equipas
create table public.teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  region text,
  location text,          -- pub, clube, etc.
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Relação muitos-para-muitos (um jogador pode ter passado por várias equipas)
create table public.team_players (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  joined_at date,
  left_at date,
  is_active boolean default true,
  created_at timestamptz default now(),
  unique(team_id, player_id, joined_at)
);

-- Índices úteis
create index idx_players_name on public.players (name);
create index idx_teams_name on public.teams (name);
create index idx_team_players_team on public.team_players (team_id);
create index idx_team_players_player on public.team_players (player_id);

-- Atualizar updated_at automaticamente
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger players_updated_at
  before update on public.players
  for each row execute function public.handle_updated_at();

create trigger teams_updated_at
  before update on public.teams
  for each row execute function public.handle_updated_at();

-- Políticas RLS (Row Level Security)
-- Versão inicial PERMISSIVA para uso pessoal (facilita o arranque).
-- Mais tarde podes restringir só a utilizadores autenticados.

alter table public.players enable row level security;
alter table public.teams enable row level security;
alter table public.team_players enable row level security;

-- Permite leitura e escrita a todos (anon + authenticated)
-- Ideal para uso pessoal no início. Muda isto quando fores publicar.

create policy "Acesso total inicial - players"
  on public.players for all
  using (true)
  with check (true);

create policy "Acesso total inicial - teams"
  on public.teams for all
  using (true)
  with check (true);

create policy "Acesso total inicial - team_players"
  on public.team_players for all
  using (true)
  with check (true);

-- Comentários (aparecem no Table Editor)
comment on table public.players is 'Jogadores de setas';
comment on table public.teams is 'Equipas / Clubes';
comment on table public.team_players is 'Histórico de jogadores por equipa';
