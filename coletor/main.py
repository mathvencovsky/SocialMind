#!/usr/bin/env python3
"""
Radar de saturação de produtos afiliados no YouTube Brasil.

Uso:
  export YOUTUBE_API_KEY=...
  python main.py produtos.csv
  python main.py produtos.csv --dias 60 --paginas 2
  python main.py produtos_exemplo.csv --mock   # teste sem API
"""

import argparse
import csv
import os
import sys

from radar.links import AnalisadorLinks
from radar.metricas import analisar
from radar.youtube import CUSTO_SEARCH, CUSTO_VIDEOS, Cache, ClienteMock, ClienteYouTube


def carregar_produtos(caminho):
    with open(caminho, encoding="utf-8-sig") as f:
        produtos = list(csv.DictReader(f))
    obrig = {"nome", "plataforma", "id_produto", "termos_busca"}
    faltando = obrig - set(produtos[0].keys() if produtos else [])
    if faltando:
        sys.exit(f"CSV sem as colunas: {', '.join(sorted(faltando))}")
    for p in produtos:
        p["plataforma"] = p["plataforma"].strip().lower()
        p["id_produto"] = p["id_produto"].strip()
    return produtos


def gravar_csv(caminho, linhas):
    if not linhas:
        return
    with open(caminho, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=list(linhas[0].keys()))
        w.writeheader()
        w.writerows(linhas)


def main():
    ap = argparse.ArgumentParser(description="Radar de saturação de produtos afiliados no YouTube Brasil")
    ap.add_argument("produtos", help="CSV com nome, plataforma, id_produto, termos_busca e (opcional) demanda")
    ap.add_argument("--dias", type=int, default=90, help="janela de vídeos publicados (padrão 90)")
    ap.add_argument("--paginas", type=int, default=1, help="páginas de 50 resultados por produto (cada uma custa 100 unidades)")
    ap.add_argument("--cota", type=int, default=9000, help="limite de unidades a gastar nesta execução")
    ap.add_argument("--sem-resolver", action="store_true", help="não seguir links curtos (mais rápido, menos preciso)")
    ap.add_argument("--saida", default="resultados.csv")
    ap.add_argument("--cache", default="cache_radar")
    ap.add_argument("--mock", action="store_true", help="usa dados simulados, sem chamar a API")
    args = ap.parse_args()

    produtos = carregar_produtos(args.produtos)
    estimativa = len(produtos) * args.paginas * (CUSTO_SEARCH + CUSTO_VIDEOS)
    print(f"{len(produtos)} produtos, custo estimado: ~{estimativa} unidades (sem contar o cache).", file=sys.stderr)
    if estimativa > args.cota:
        sys.exit(f"Estimativa acima de --cota {args.cota}. Reduza produtos/páginas ou aumente --cota.")

    cache = Cache(args.cache)
    if args.mock:
        cliente = ClienteMock(produtos)
        links = AnalisadorLinks(cache, mock_finais=cliente.finais)
    else:
        chave = os.environ.get("YOUTUBE_API_KEY")
        if not chave:
            sys.exit("Defina a variável de ambiente YOUTUBE_API_KEY.")
        cliente = ClienteYouTube(chave, cache)
        links = AnalisadorLinks(cache, resolver=not args.sem_resolver)

    try:
        resultados, descobertos = analisar(produtos, cliente, links, args.dias, args.paginas)
    finally:
        if not args.mock:
            cache.salvar_links()

    gravar_csv(args.saida, resultados)
    saida_desc = os.path.splitext(args.saida)[0] + "_descobertos.csv"
    gravar_csv(saida_desc, descobertos)

    print(f"\nUnidades de cota gastas: {cliente.unidades}", file=sys.stderr)
    print(f"\n{'Produto':28} {'Quadrante':28} {'Canais':>6} {'Afil.':>5} {'Demanda':>9}")
    for r in resultados:
        print(f"{r['nome'][:28]:28} {r['quadrante'][:28]:28} {r['canais_distintos']:>6} "
              f"{r['afiliados_distintos']:>5} {r['demanda']:>9}")
    print(f"\nResultados: {args.saida}")
    if descobertos:
        print(f"Produtos fora da sua lista encontrados nos links: {len(descobertos)} ({saida_desc})")


if __name__ == "__main__":
    main()
