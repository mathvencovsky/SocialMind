#!/usr/bin/env python3
"""
Carga manual de produtos (infoprodutos) no Supabase a partir de um CSV no
formato de produtos_exemplo.csv. Upsert por (plataforma, id_produto): rodar
de novo atualiza em vez de duplicar.

Colunas opcionais, usadas se existirem no cabeçalho: nicho, url,
url_pagina_vendas, descricao, preco, comissao_pct, comissao_valor.
Uma coluna presente mas vazia grava vazio no banco.

Uso:
  python importar_csv.py produtos_exemplo.csv
"""

import argparse
import sys

from main import carregar_produtos
from radar import carregar_env
from radar.db import Banco

PLATAFORMAS = {"hotmart", "kiwify", "eduzz", "monetizze", "shopee", "amazon"}
TEXTO = ["nicho", "url", "url_pagina_vendas", "descricao"]
NUMERO = ["preco", "comissao_pct", "comissao_valor"]


def numero(valor):
    valor = (valor or "").strip().replace(",", ".")
    return float(valor) if valor else None


def linhas_produtos(produtos):
    colunas = set(produtos[0].keys())
    linhas, vistos = [], set()
    for n, p in enumerate(produtos, 2):  # linha 1 é o cabeçalho
        if (p["plataforma"], p["id_produto"]) in vistos:
            sys.exit(f"Linha {n}: produto {p['plataforma']}/{p['id_produto']} repetido no CSV.")
        vistos.add((p["plataforma"], p["id_produto"]))
        if p["plataforma"] not in PLATAFORMAS:
            sys.exit(f"Linha {n}: plataforma '{p['plataforma']}' inválida. Use: {', '.join(sorted(PLATAFORMAS))}.")
        if not p["id_produto"] or not p["nome"].strip():
            sys.exit(f"Linha {n}: nome e id_produto são obrigatórios.")
        try:
            linha = {"plataforma": p["plataforma"], "id_externo": p["id_produto"], "nome": p["nome"].strip(),
                     "termos_busca": p["termos_busca"].strip() or None, "demanda_bruta": numero(p.get("demanda")),
                     "fonte": "csv"}
            linha.update({c: (p[c] or "").strip() or None for c in TEXTO if c in colunas})
            linha.update({c: numero(p[c]) for c in NUMERO if c in colunas})
        except ValueError as e:
            sys.exit(f"Linha {n}: número inválido ({e}).")
        linhas.append(linha)
    return linhas


def main():
    carregar_env()
    ap = argparse.ArgumentParser(description="Importa produtos de um CSV para o Supabase")
    ap.add_argument("csv", help="CSV com nome, plataforma, id_produto, termos_busca e (opcional) demanda")
    args = ap.parse_args()

    linhas = linhas_produtos(carregar_produtos(args.csv))
    Banco().upsert("produtos", linhas, "plataforma,id_externo")
    print(f"{len(linhas)} produtos importados.")


if __name__ == "__main__":
    main()
