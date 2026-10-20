-- Radar de Afiliados: esquema inicial.
-- O coletor e os route handlers usam a service role key (ignora RLS).
-- A chave anon só lê produtos, metricas_diarias e descobertos e insere em lista_espera.

create table produtos (
  id bigint generated always as identity primary key,
  plataforma text not null check (plataforma in ('hotmart', 'kiwify', 'eduzz', 'monetizze', 'shopee', 'amazon')),
  id_externo text not null,
  nome text not null,
  nicho text,
  termos_busca text,
  url text,
  url_pagina_vendas text,
  descricao text,
  preco numeric(12, 2),
  comissao_pct numeric(5, 2),
  comissao_valor numeric(12, 2),
  demanda_bruta numeric,
  fonte text not null default 'manual' check (fonte in ('shopee_api', 'csv', 'manual')),
  ativo boolean not null default true,
  ultima_coleta timestamptz,
  criado_em timestamptz not null default now(),
  unique (plataforma, id_externo)
);

create table videos (
  id text primary key,
  canal_id text,
  titulo text,
  publicado_em timestamptz,
  views bigint,
  coletado_em timestamptz not null default now()
);

create table video_produto (
  video_id text not null references videos (id) on delete cascade,
  produto_id bigint not null references produtos (id) on delete cascade,
  tipo_match text not null check (tipo_match in ('link', 'mencao')),
  afiliado_token text,
  primary key (video_id, produto_id)
);
create index on video_produto (produto_id);

create table metricas_diarias (
  produto_id bigint not null references produtos (id) on delete cascade,
  data date not null,
  videos integer not null,
  canais_distintos integer not null,
  afiliados_distintos integer not null,
  videos_30d integer not null,
  views_dia_mediana numeric not null,
  demanda numeric,
  quadrante text not null,
  primary key (produto_id, data)
);

create table descobertos (
  plataforma text not null,
  id_externo text not null,
  videos integer not null,
  canais_distintos integer not null,
  afiliados_distintos integer not null,
  views_total bigint not null,
  visto_primeiro_em timestamptz not null default now(),
  visto_ultimo_em timestamptz not null default now(),
  primary key (plataforma, id_externo)
);

-- Recebe inserts direto do navegador (chave anon): os checks limitam o que entra.
create table lista_espera (
  id bigint generated always as identity primary key,
  email text not null check (length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  nicho_interesse text check (length(nicho_interesse) <= 100),
  origem text check (length(origem) <= 50),
  criado_em timestamptz not null default now()
);

create table execucoes (
  id bigint generated always as identity primary key,
  inicio timestamptz not null,
  fim timestamptz,
  unidades_gastas integer,
  produtos_processados integer,
  erros text
);

create table acessos_roteiro (
  email text primary key,
  codigo_hash text,
  codigo_expira_em timestamptz,
  tentativas_codigo integer not null default 0,
  verificado_em timestamptz,
  roteiros_gerados integer not null default 0,
  limite_roteiros integer not null default 3,
  criado_em timestamptz not null default now()
);

create table roteiros (
  id bigint generated always as identity primary key,
  email text not null references acessos_roteiro (email),
  produto_id bigint references produtos (id) on delete set null,
  modo text not null check (modo in ('dark', 'criador')),
  duracao_seg integer,
  tom text,
  formato text not null check (formato in ('longo', 'curto')),
  contexto_usado jsonb,
  saida jsonb,
  versao_prompt integer not null,
  modelo text not null,
  tokens_entrada integer,
  tokens_saida integer,
  custo_estimado numeric(10, 6),
  avaliacao smallint check (avaliacao between 1 and 5),
  criado_em timestamptz not null default now()
);

-- RLS em todas as tabelas; sem política = sem acesso para anon e authenticated.
alter table produtos enable row level security;
alter table videos enable row level security;
alter table video_produto enable row level security;
alter table metricas_diarias enable row level security;
alter table descobertos enable row level security;
alter table lista_espera enable row level security;
alter table execucoes enable row level security;
alter table acessos_roteiro enable row level security;
alter table roteiros enable row level security;

-- Privilégios mínimos além do RLS (o Supabase concede tudo a anon por padrão).
revoke all on all tables in schema public from anon, authenticated;
grant select on produtos, metricas_diarias, descobertos to anon, authenticated;
grant insert on lista_espera to anon, authenticated;

create policy "leitura publica" on produtos for select to anon, authenticated using (ativo);
create policy "leitura publica" on metricas_diarias for select to anon, authenticated using (true);
create policy "leitura publica" on descobertos for select to anon, authenticated using (true);
create policy "inscricao publica" on lista_espera for insert to anon, authenticated with check (true);
