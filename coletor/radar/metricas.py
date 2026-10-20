"""Métricas de oferta e demanda por produto e classificação nos quadrantes."""

import re
import statistics
import sys
import unicodedata
from collections import defaultdict
from datetime import datetime, timedelta, timezone

from .links import URL_RE


def normalizar(texto):
    texto = unicodedata.normalize("NFKD", texto or "")
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", texto.lower()).strip()


def dias_desde(data_iso, agora):
    try:
        d = datetime.strptime(data_iso, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
    except (TypeError, ValueError):
        return None
    return max(1, (agora - d).days)


def analisar(produtos, cliente, links, dias, paginas):
    agora = datetime.now(timezone.utc)
    desde = (agora - timedelta(days=dias)).strftime("%Y-%m-%dT%H:%M:%SZ")
    chaves_lista = {(p["plataforma"], p["id_produto"].lower()) for p in produtos}
    descobertos = defaultdict(lambda: {"id": None, "videos": set(), "afiliados": set(), "canais": set(), "views": 0})
    resultados = []

    for n, p in enumerate(produtos, 1):
        print(f"[{n}/{len(produtos)}] {p['nome']}", file=sys.stderr)
        ids = cliente.buscar(p["termos_busca"], desde, paginas)
        vids = cliente.videos(ids) if ids else []
        nome_norm = normalizar(p["nome"])
        alvo = (p["plataforma"], p["id_produto"].lower())

        forte, fraco = [], []
        afiliados, canais = set(), set()
        for v in vids:
            sn, st = v.get("snippet", {}), v.get("statistics", {})
            desc = sn.get("description", "")
            views = int(st.get("viewCount", 0) or 0)
            casou_forte = False
            for url in URL_RE.findall(desc):
                info = links.analisar(url)
                if not info or not info.get("produto"):
                    continue
                chave = (info["plataforma"], info["produto"].lower())
                if chave == alvo:
                    casou_forte = True
                    if info.get("afiliado"):
                        afiliados.add(info["afiliado"])
                elif chave not in chaves_lista:
                    d = descobertos[chave]
                    d["id"] = d["id"] or info["produto"]
                    if v["id"] not in d["videos"]:
                        d["views"] += views
                    d["videos"].add(v["id"])
                    d["canais"].add(sn.get("channelId"))
                    if info.get("afiliado"):
                        d["afiliados"].add(info["afiliado"])
            registro = {"views": views, "dias": dias_desde(sn.get("publishedAt"), agora), "canal": sn.get("channelId")}
            if casou_forte:
                forte.append(registro)
            elif nome_norm and nome_norm in normalizar(sn.get("title", "") + " " + desc):
                fraco.append(registro)
            else:
                continue
            canais.add(sn.get("channelId"))

        todos = forte + fraco
        vpd = [r["views"] / r["dias"] for r in todos if r["dias"]]
        demanda_csv = (p.get("demanda") or "").strip()
        resultados.append({
            "nome": p["nome"],
            "plataforma": p["plataforma"],
            "id_produto": p["id_produto"],
            "videos_buscados": len(vids),
            "videos_com_link": len(forte),
            "videos_so_mencao": len(fraco),
            "canais_distintos": len(canais),
            "afiliados_distintos": len(afiliados),
            "videos_ultimos_30d": sum(1 for r in todos if r["dias"] and r["dias"] <= 30),
            "views_total": sum(r["views"] for r in todos),
            "views_por_dia_mediana": round(statistics.median(vpd), 1) if vpd else 0,
            "demanda_csv": float(demanda_csv.replace(",", ".")) if demanda_csv else None,
        })

    classificar(resultados)
    lista_desc = sorted(
        ({"plataforma": k[0], "id_produto": d["id"], "videos": len(d["videos"]),
          "canais_distintos": len(d["canais"]), "afiliados_distintos": len(d["afiliados"]),
          "views_total": d["views"]} for k, d in descobertos.items()),
        key=lambda x: (-x["afiliados_distintos"], -x["views_total"]))
    return resultados, lista_desc


def classificar(resultados):
    """Oferta = canais distintos. Demanda = coluna do CSV se preenchida em
    todos os produtos; senão, mediana de views por dia. Corte pela mediana."""
    usar_csv = all(r["demanda_csv"] is not None for r in resultados)
    for r in resultados:
        r["demanda"] = r["demanda_csv"] if usar_csv else r["views_por_dia_mediana"]
        r["fonte_demanda"] = "csv" if usar_csv else "views/dia"
    corte_d = statistics.median(r["demanda"] for r in resultados)
    corte_o = statistics.median(r["canais_distintos"] for r in resultados)
    for r in resultados:
        if not usar_csv and r["canais_distintos"] == 0:
            r["quadrante"] = "Sem dados (informe demanda no CSV)"
            continue
        alta_d = r["demanda"] >= corte_d and r["demanda"] > 0
        alta_o = r["canais_distintos"] > corte_o
        r["quadrante"] = {
            (True, False): "Oportunidade",
            (True, True): "Saturado comprovado",
            (False, False): "Inexplorado (nao validado)",
            (False, True): "Evitar",
        }[(alta_d, alta_o)]
    ordem = ["Oportunidade", "Saturado comprovado", "Inexplorado (nao validado)", "Evitar"]
    resultados.sort(key=lambda r: (ordem.index(r["quadrante"]) if r["quadrante"] in ordem else 9, -r["demanda"]))
