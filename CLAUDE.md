# CLAUDE.md: Radar de Afiliados (MVP)

## Decisões assumidas (revise antes de começar)

- **Escopo do MVP**: lista pública, sem login e sem cobrança. Objetivo é validar se criadores usam e deixam e-mail.
- **Gerador de roteiros com IA (Fase 5)**: liberado por e-mail verificado com código, com limite de roteiros grátis por e-mail. Não é login completo: não há senha nem conta.
- **Stack**: Python 3.11 para o coletor (reaproveita `radar_youtube.py`), Supabase (Postgres) como banco, Next.js no front hospedado na Vercel, GitHub Actions como agendador diário. Roteiros gerados pela API da Anthropic (Claude) chamada só no servidor (route handler do Next.js), com o modelo definido por variável de ambiente.
- **Idioma**: código e nomes de tabela em português, interface em português do Brasil.

## Contexto do produto

Plataforma para criadores de conteúdo que vivem de comissão (YouTube, TikTok, canais dark, merchan). Lista produtos e infoprodutos que pagam comissão e mostra, para cada um, quanto conteúdo já existe promovendo aquele produto.

O diferencial é a matriz demanda x oferta:

| | pouca oferta de conteúdo | muita oferta |
|---|---|---|
| alta demanda | Oportunidade | Saturado comprovado (bom para primeiras comissões) |
| baixa demanda | Inexplorado (não validado) | Evitar |

Oferta = canais distintos e afiliados distintos promovendo o produto no YouTube.
Demanda = sinal externo (comissão/vendas da plataforma, coluna `demanda`) ou, na falta, mediana de views por dia dos vídeos.

Depois de escolher um produto, o criador gera um roteiro de vídeo com IA em dois modos: **canal dark** (narração e prompts de cena) e **criador que grava** (roteiro com falas). O roteiro usa os dados do radar, principalmente os vídeos que já promovem o produto, para propor ângulos diferentes do que já existe. Essa é a funcionalidade com maior potencial de cobrança no futuro.

## Arquivos de partida

- `radar_youtube.py`: implementação de referência já testada com dados simulados. Contém busca no YouTube com cache e controle de cota, extração de links de afiliado (Hotmart, Kiwify, Eduzz, Monetizze, Shopee, Amazon), resolução de links curtos, métricas e classificação. **Não reescreva a lógica do zero: refatore em pacote mantendo o comportamento.**
- `produtos_exemplo.csv`: formato de entrada de produtos.
- `README.md`: uso do script e limitações conhecidas.

## Arquitetura alvo

```
/coletor            Python
  radar/
    youtube.py      cliente da API (cache, cota)
    links.py        extração e resolução de links
    metricas.py     métricas e classificação
    shopee.py       ingestão via Shopee Affiliate Open API
    db.py           leitura/escrita no Supabase
  main.py           ponto de entrada do job diário
  importar_csv.py   carga manual de produtos (infoprodutos)
  tests/
/web                Next.js (App Router, TypeScript)
  lib/roteiro/
    prompts/        prompts versionados (dark.md, criador.md, regras.md)
    contexto.ts     monta o contexto do produto a partir do banco
    gerar.ts        chamada à API e validação da saída
  app/api/roteiro/  route handlers (pedir código, verificar, gerar)
/supabase/migrations  SQL versionado
/.github/workflows/radar.yml   job diário
```

## Modelo de dados

- `produtos`: id, plataforma, id_externo, nome, nicho, termos_busca, url, url_pagina_vendas, descricao, preco, comissao_pct, comissao_valor, demanda_bruta, fonte (`shopee_api` | `csv` | `manual`), ativo, ultima_coleta, criado_em. Único em (plataforma, id_externo).
- `videos`: id (ID do YouTube), canal_id, titulo, publicado_em, views, coletado_em.
- `video_produto`: video_id, produto_id, tipo_match (`link` | `mencao`), afiliado_token.
- `metricas_diarias`: produto_id, data, videos, canais_distintos, afiliados_distintos, videos_30d, views_dia_mediana, demanda, quadrante. Único em (produto_id, data). É a base do histórico.
- `descobertos`: plataforma, id_externo, videos, canais_distintos, afiliados_distintos, views_total, visto_primeiro_em, visto_ultimo_em.
- `lista_espera`: email, nicho_interesse, origem, criado_em.
- `execucoes`: inicio, fim, unidades_gastas, produtos_processados, erros (texto).
- `acessos_roteiro`: email (único), codigo_hash, codigo_expira_em, tentativas_codigo, verificado_em, roteiros_gerados, limite_roteiros (padrão 3), criado_em.
- `roteiros`: id, email, produto_id, modo (`dark` | `criador`), duracao_seg, tom, formato (`longo` | `curto`), contexto_usado (json), saida (json), versao_prompt, modelo, tokens_entrada, tokens_saida, custo_estimado, avaliacao (1 a 5, opcional), criado_em.

Row Level Security: o front usa a chave anon apenas com SELECT nas tabelas públicas (`produtos`, `metricas_diarias`, `descobertos`) e INSERT em `lista_espera`. `acessos_roteiro` e `roteiros` não são acessíveis pela chave anon: só pelos route handlers no servidor, com a service role key. O coletor também usa a service role key, que nunca vai para o navegador.

## Fases e critérios de pronto

Trabalhe uma fase por vez. Ao fim de cada fase, rode os testes, mostre o resultado e pare para eu revisar.

**Fase 0: refatoração do coletor**
- Pacote `radar/` com o comportamento do script original.
- Testes com pytest: padrões de link (incluindo os exemplos do README), classificação de quadrantes e um teste ponta a ponta com o cliente simulado.
- Pronto quando: `pytest` passa e `python main.py --mock` gera o mesmo tipo de resultado do script original.

**Fase 1: banco**
- Migrations SQL em `/supabase/migrations` com as tabelas acima e as políticas RLS.
- `db.py` grava produtos, vídeos, vínculos, métricas do dia, descobertos e a execução.
- `importar_csv.py` carrega produtos no formato do CSV de exemplo.
- Pronto quando: rodar `main.py --mock` contra o Supabase popula todas as tabelas sem duplicar ao rodar duas vezes no mesmo dia.

**Fase 2: ingestão Shopee**
- `shopee.py` usa a Shopee Affiliate Open API Brasil (GraphQL, endpoint `https://open-api.affiliate.shopee.com.br/graphql`, assinatura SHA256 com App ID e Secret) para buscar ofertas com taxa de comissão por categoria/palavra-chave e fazer upsert em `produtos`.
- Se as credenciais ainda não existirem, o módulo deve falhar com mensagem clara e o resto do sistema continua funcionando com produtos via CSV.
- Pronto quando: com credenciais válidas, um comando importa ao menos 100 produtos de um nicho com comissão preenchida.

**Fase 3: agendamento**
- Workflow do GitHub Actions rodando uma vez por dia.
- Priorização dentro da cota: produtos ativos com `ultima_coleta` mais antiga primeiro, parando antes de estourar o limite configurado (padrão 9.000 unidades).
- Cada execução grava uma linha em `execucoes`.
- Pronto quando: o workflow roda manualmente pelo botão "Run workflow" e grava dados.

**Fase 4: front**
- Página inicial: lista de produtos com filtros por nicho, plataforma e quadrante; ordenação por demanda, oferta e comissão.
- Página do produto: métricas atuais, gráfico do histórico de canais/afiliados e demanda, link para a página do produto.
- Página "Descobertos": produtos encontrados nos vídeos que ainda não estão no catálogo.
- Formulário de lista de espera (e-mail + nicho) no topo e no rodapé.
- Layout responsivo, bom no celular.
- Pronto quando: roda localmente com `npm run dev` lendo o Supabase, e o deploy na Vercel funciona.

**Fase 5: gerador de roteiros com IA**

Fluxo:
1. Na página do produto, botão "Gerar roteiro".
2. Usuário informa e-mail e recebe um código de 6 dígitos (validade de 15 minutos, no máximo 5 tentativas). Envio de e-mail por um provedor transacional simples: pergunte qual usar antes de adicionar a dependência.
3. Com o e-mail verificado (lembrado por cookie assinado), escolhe: modo (dark ou criador), formato (longo ou curto), duração aproximada e tom (informativo, entusiasmado, review honesto, comparativo).
4. O servidor monta o contexto, chama a API, valida a saída e grava em `roteiros`.
5. Exibe o roteiro com botão de copiar, de baixar em .txt e de avaliar (1 a 5). O usuário vê quantos roteiros grátis restam.

Contexto enviado à IA (montado em `contexto.ts`):
- Dados do produto: nome, plataforma, preço, comissão, descrição, nicho.
- Quadrante e métricas atuais.
- Títulos e canais dos até 15 vídeos mais vistos vinculados ao produto, como referência do que já existe. Instrução explícita: propor ângulos diferentes desses, nunca copiar títulos.
- Se a descrição do produto estiver vazia ou muito curta, avisar o usuário antes de gerar que o roteiro tende a sair genérico e sugerir preencher a descrição.

Saída estruturada em JSON (validar com schema; se falhar, tentar de novo uma vez e depois mostrar erro amigável):
- Comum aos dois modos: 3 opções de título, 3 opções de gancho para os primeiros segundos, descrição para o YouTube com o aviso de link de afiliado, sugestão de thumbnail em texto, momento e frase do CTA.
- **Modo dark**: lista de cenas, cada uma com tempo de início e fim, texto da narração, prompt da imagem ou vídeo da cena e sugestão de trilha ou efeito; mais sugestão de tipo de voz e ritmo.
- **Modo criador**: blocos do roteiro (abertura, desenvolvimento, demonstração, objeções, fechamento) com falas sugeridas, indicações de enquadramento ou corte, e o momento de mostrar o produto.
- Formato curto: até 60 segundos, um único gancho forte e uma ideia central.

Regras fixas de conteúdo (em `prompts/regras.md`, aplicadas sempre):
- Nunca prometer resultado garantido, ganho financeiro específico ou prazo de resultado.
- Nunca fazer alegação médica, de cura ou de emagrecimento garantido; em produtos de saúde e bem-estar, incluir recomendação de procurar um profissional.
- Nunca inventar depoimentos, números de vendas, avaliações ou falas atribuídas a pessoas reais.
- Nunca afirmar características do produto que não estejam no contexto; quando faltar informação, usar linguagem genérica ou marcar `[confirmar na página do produto]`.
- Sempre incluir aviso de que o vídeo contém link de afiliado, na fala e na descrição.
- Gerar variação real entre pedidos (ângulo, estrutura e gancho), para o conteúdo não ficar padronizado.
- Roteiros em português do Brasil, sem travessão.

Controles de custo e abuso:
- Limite de roteiros por e-mail (`limite_roteiros`) e limite por IP por hora no route handler.
- Teto de tokens de saída por chamada.
- Gravar tokens e custo estimado de cada roteiro; uma consulta SQL simples deve mostrar custo total por dia.
- Chave da API só no servidor, nunca no navegador.

Testes:
- Fixtures de 3 produtos (infoproduto de curso, produto físico da Shopee, produto de saúde/bem-estar).
- Testes do montador de contexto e do validador de schema sem chamar a API.
- Um script de avaliação que gera os 6 roteiros (3 produtos x 2 modos) com a API real e checa automaticamente: JSON válido, presença do aviso de afiliado, ausência de termos proibidos (lista em `regras.md`, como "garantido", "cura", "resultado em X dias"). Rodado manualmente, não no CI.

Pronto quando: gero um roteiro em cada modo para um produto real pelo site, o limite por e-mail bloqueia o quarto roteiro, o script de avaliação passa nos 6 casos e o custo aparece gravado.

## Regras

- **Segredos**: chaves só em `.env` (local) e GitHub Secrets / variáveis da Vercel. Criar `.env.example` sem valores. Nunca commitar `.env`.
- **Cota do YouTube**: sempre usar cache; nunca fazer loop de `search.list` sem checar o limite; preferir `videos.list` e `playlistItems.list` (1 unidade) sempre que possível.
- **Termos de uso**: não fazer scraping de áreas logadas (vitrines da Hotmart, Kiwify etc.) nem de TikTok nesta versão. Infoprodutos entram por CSV ou cadastro manual.
- **Honestidade dos dados**: a interface deve deixar claro que os números vêm de uma amostra dos vídeos mais relevantes do YouTube, não de contagem total.
- **Textos da interface**: português do Brasil, sem travessão (use ponto, vírgula ou dois-pontos).
- **IA**: prompts ficam em arquivos versionados, não espalhados no código. Toda mudança de prompt incrementa `versao_prompt`, para comparar avaliações entre versões.
- **Dados pessoais**: os e-mails coletados servem só para o acesso aos roteiros e para a lista de espera. Mostrar um aviso curto de privacidade no formulário.
- **Simplicidade**: sem microserviços, sem filas, sem ORM pesado. Dependências mínimas.
- Antes de qualquer mudança grande de arquitetura ou de adicionar dependência relevante, pergunte.

## Fora do escopo do MVP

Login com senha, planos pagos e cobrança, TikTok/Instagram, alertas por e-mail, painel do produtor, app mobile, geração de áudio, imagem ou vídeo (o gerador entrega texto e prompts, não mídia).
