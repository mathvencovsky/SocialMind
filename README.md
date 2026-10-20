# Radar de saturação: produtos afiliados x conteúdo no YouTube

Protótipo que cruza uma lista de produtos com os vídeos do YouTube Brasil e classifica cada produto numa matriz demanda x oferta de conteúdo.

## Como rodar

1. Crie uma chave da YouTube Data API v3 no Google Cloud Console (APIs e Serviços > Credenciais > Criar chave de API, depois ative a "YouTube Data API v3").
2. Defina a chave e rode de dentro de `coletor/`:

```bash
cd coletor
export YOUTUBE_API_KEY="sua_chave"          # Windows: set YOUTUBE_API_KEY=sua_chave
python main.py produtos.csv
```

Teste sem chave: `python main.py produtos_exemplo.csv --mock`

O coletor só usa a biblioteca padrão do Python 3.9+. Para os testes: `pip install -r requirements-dev.txt` e `pytest`, também de dentro de `coletor/`.

`coletor/radar_youtube.py` é o script original, mantido como referência: `main.py` e o pacote `radar/` geram os mesmos arquivos com `--mock`.

## Banco (Supabase)

1. Crie um projeto no Supabase e rode `supabase/migrations/20261020000000_inicial.sql` no SQL Editor.
2. Copie `.env.example` para `.env` na raiz e preencha `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (Project Settings > API). A service role key ignora o RLS: nunca use no navegador.
3. De dentro de `coletor/`:

```bash
python importar_csv.py produtos_exemplo.csv   # carrega ou atualiza produtos
python main.py --mock                         # coleta simulada gravando no banco
python main.py                                # coleta real (precisa de YOUTUBE_API_KEY)
```

Sem CSV, `main.py` lê os produtos ativos do banco (os de `ultima_coleta` mais antiga primeiro) e grava vídeos, vínculos, métricas do dia, descobertos e uma linha em `execucoes`. Tudo é upsert: rodar duas vezes no mesmo dia atualiza as linhas do dia em vez de duplicar. Com CSV, roda como antes, sem tocar no banco.

`importar_csv.py` também aceita as colunas opcionais `nicho`, `url`, `url_pagina_vendas`, `descricao`, `preco`, `comissao_pct` e `comissao_valor`. Uma coluna presente mas vazia grava vazio no banco.

## Formato do CSV

| coluna | obrigatória | o que colocar |
|---|---|---|
| nome | sim | nome do produto (usado para achar menções sem link) |
| plataforma | sim | hotmart, kiwify, eduzz, monetizze, shopee ou amazon |
| id_produto | sim | ID que aparece no link final (veja abaixo) |
| termos_busca | sim | o que buscar no YouTube |
| demanda | não | sinal de demanda de 0 a 100 (temperatura Hotmart, vendas Shopee etc.). Se preenchida em todas as linhas, é usada; senão o script usa views por dia |

Onde achar o `id_produto`:
- **Hotmart**: código depois de `pay.hotmart.com/` no checkout (ex.: `K12345678X`)
- **Kiwify**: código depois de `pay.kiwify.com.br/`
- **Shopee**: último número da URL `...-i.LOJA.ITEM` (o ITEM)
- **Amazon**: ASIN de 10 caracteres depois de `/dp/`

## Saídas

- `resultados.csv`: uma linha por produto com vídeos encontrados, canais distintos, afiliados distintos, vídeos dos últimos 30 dias, views e o quadrante.
- `resultados_descobertos.csv`: produtos que apareceram nos links dos vídeos mas não estavam na sua lista. Bom ponto de partida para achar ofertas que outros já promovem.

## Quadrantes

| | pouca oferta | muita oferta |
|---|---|---|
| alta demanda | Oportunidade | Saturado comprovado |
| baixa demanda | Inexplorado (não validado) | Evitar |

O corte é a mediana da própria lista, então a classificação é relativa aos produtos que você colocou. Use pelo menos 20 produtos do mesmo nicho para a comparação fazer sentido.

## Cota

A cota padrão é 10.000 unidades por dia. Cada produto custa cerca de 101 unidades por página de 50 vídeos, então dá para analisar uns 90 produtos por dia. Tudo fica em cache (`cache_radar/`): rodar de novo não gasta cota com o que já foi buscado. Apague a pasta para atualizar os dados.

## Limitações conhecidas

- **Links curtos** (go.hotmart.com, s.shopee.com.br, amzn.to) são seguidos para descobrir o produto. Alguns podem bloquear o acesso automatizado; nesse caso o vídeo conta só como menção pelo nome. `--sem-resolver` desliga isso.
- **Padrões de Eduzz e Monetizze** são aproximados. Valide com links reais antes de confiar nesses números.
- **A busca do YouTube não é exaustiva**: retorna os vídeos mais relevantes, não todos. Os números servem para comparar produtos entre si, não como contagem absoluta.
- **Links na bio ou no comentário fixado** não são capturados, só os da descrição.
- **TikTok e Instagram** ficam de fora desta versão.
