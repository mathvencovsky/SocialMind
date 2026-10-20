"""Leitura e escrita no Supabase pela API REST (PostgREST), com a service role key.

Toda gravação é upsert pela chave única da tabela, então rodar duas vezes
no mesmo dia atualiza as linhas em vez de duplicar (exceto execucoes, que
ganha uma linha por execução)."""

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import timedelta, timezone

BRT = timezone(timedelta(hours=-3))  # o Brasil não tem horário de verão desde 2019
LOTE = 1000


class Banco:
    def __init__(self):
        url = os.environ.get("SUPABASE_URL")
        chave = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not chave:
            sys.exit("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (veja .env.example).")
        self.base = url.rstrip("/") + "/rest/v1/"
        self.headers = {"apikey": chave, "Authorization": f"Bearer {chave}", "Content-Type": "application/json"}

    def _req(self, metodo, caminho, corpo=None, prefer=None):
        headers = dict(self.headers, **({"Prefer": prefer} if prefer else {}))
        dados = json.dumps(corpo, ensure_ascii=False).encode() if corpo is not None else None
        req = urllib.request.Request(self.base + caminho, data=dados, method=metodo, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                texto = r.read()
        except urllib.error.HTTPError as e:
            corpo_erro = e.read().decode(errors="replace")
            raise RuntimeError(f"Supabase {e.code} em {metodo} {caminho.split('?')[0]}: {corpo_erro[:300]}")
        return json.loads(texto) if texto else None

    def upsert(self, tabela, linhas, conflito):
        # PostgREST exige as mesmas chaves em todas as linhas de um lote.
        for i in range(0, len(linhas), LOTE):
            self._req("POST", f"{tabela}?on_conflict={conflito}", linhas[i:i + LOTE],
                      "resolution=merge-duplicates,return=minimal")

    def produtos_ativos(self):
        # shortcut: o PostgREST do Supabase devolve no máximo 1000 linhas; paginar quando o catálogo passar disso.
        return self._req("GET", "produtos?select=id,plataforma,id_externo,nome,termos_busca,demanda_bruta"
                                "&ativo=is.true&order=ultima_coleta.asc.nullsfirst,id.asc")

    def gravar_coleta(self, produtos, resultados, descobertos, coletados, agora):
        """produtos: dicts usados na análise, com o "id" do banco."""
        ids = {(p["plataforma"], p["id_produto"]): p["id"] for p in produtos}
        quando = agora.isoformat()

        # Um vídeo pode aparecer na busca de vários produtos: dedup pela chave
        # para o upsert não tocar a mesma linha duas vezes no mesmo lote.
        videos = {c["video"]["id"]: dict(c["video"], coletado_em=quando) for c in coletados}
        self.upsert("videos", list(videos.values()), "id")
        vinculos = {}
        for c in coletados:
            pid = ids[c["produto"]]
            vinculos[(c["video"]["id"], pid)] = {"video_id": c["video"]["id"], "produto_id": pid,
                                                 "tipo_match": c["tipo_match"], "afiliado_token": c["afiliado_token"]}
        self.upsert("video_produto", list(vinculos.values()), "video_id,produto_id")

        data = agora.astimezone(BRT).date().isoformat()
        self.upsert("metricas_diarias", [{
            "produto_id": ids[(r["plataforma"], r["id_produto"])],
            "data": data,
            "videos": r["videos_com_link"] + r["videos_so_mencao"],
            "canais_distintos": r["canais_distintos"],
            "afiliados_distintos": r["afiliados_distintos"],
            "videos_30d": r["videos_ultimos_30d"],
            "views_dia_mediana": r["views_por_dia_mediana"],
            "demanda": r["demanda"],
            "quadrante": r["quadrante"],
        } for r in resultados], "produto_id,data")

        # visto_primeiro_em fica fora do payload: o default vale no insert e o upsert não o sobrescreve.
        self.upsert("descobertos", [{
            "plataforma": d["plataforma"], "id_externo": d["id_produto"], "videos": d["videos"],
            "canais_distintos": d["canais_distintos"], "afiliados_distintos": d["afiliados_distintos"],
            "views_total": d["views_total"], "visto_ultimo_em": quando,
        } for d in descobertos], "plataforma,id_externo")

        if ids:
            lista = ",".join(str(i) for i in ids.values())
            self._req("PATCH", f"produtos?id=in.({lista})", {"ultima_coleta": quando}, "return=minimal")

    def registrar_execucao(self, inicio, fim, unidades, processados, erros):
        self._req("POST", "execucoes", {"inicio": inicio.isoformat(), "fim": fim.isoformat(), "unidades_gastas": unidades,
                                        "produtos_processados": processados, "erros": erros}, "return=minimal")
