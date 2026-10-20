#!/usr/bin/env python3
"""
Radar de saturação de produtos afiliados no YouTube Brasil (protótipo).

Para cada produto da lista:
  1. Busca vídeos recentes no YouTube Brasil (search.list).
  2. Lê título, descrição e estatísticas (videos.list).
  3. Extrai links de afiliado das descrições (Hotmart, Kiwify, Eduzz,
     Monetizze, Shopee, Amazon), resolvendo links curtos quando preciso.
  4. Mede oferta de conteúdo (canais, afiliados distintos, vídeos recentes)
     e demanda (coluna "demanda" do CSV ou visualizações por dia).
  5. Classifica cada produto numa matriz demanda x oferta.

Bônus: lista produtos encontrados nos links que NÃO estavam na sua lista.

Usa só a biblioteca padrão do Python 3.9+.

Uso:
  export YOUTUBE_API_KEY=...
  python radar_youtube.py produtos.csv
  python radar_youtube.py produtos.csv --dias 60 --paginas 2
  python radar_youtube.py produtos_exemplo.csv --mock   # teste sem API
"""

import argparse
import csv
import hashlib
import json
import os
import random
import re
import statistics
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from datetime import datetime, timedelta, timezone

API = "https://www.googleapis.com/youtube/v3"
CUSTO_SEARCH = 100
CUSTO_VIDEOS = 1
URL_RE = re.compile(r"https?://[^\s<>\"'()\[\]]+", re.I)

# Hosts de link curto: o token do link é exclusivo do afiliado, e o
# produto só aparece depois de seguir o redirecionamento.
HOSTS_CURTOS = {
    "go.hotmart.com": "hotmart",
    "s.shopee.com.br": "shopee",
    "shope.ee": "shopee",
    "amzn.to": "amazon",
    "app.monetizze.com.br": "monetizze",
}

# Padrões aplicados à URL final. Grupos nomeados: produto, afiliado.
# Os de Eduzz e Monetizze são aproximados: valide com links reais.
PADROES_FINAIS = [
    ("hotmart", re.compile(r"pay\.hotmart\.com/(?P<produto>[A-Z0-9]+)", re.I)),
    ("kiwify", re.compile(
        r"pay\.kiwify\.com\.br/(?P<produto>[A-Za-z0-9]+)(?:[^\s]*?[?&]afid=(?P<afiliado>[A-Za-z0-9]+))?", re.I)),
    ("eduzz", re.compile(
        r"(?:sun|chk)\.eduzz\.com/(?P<produto>\d+)(?:[^\s]*?[?&]a=(?P<afiliado>\d+))?", re.I)),
    ("monetizze", re.compile(r"monetizze\.com\.br/checkout/(?P<produto>[A-Za-z0-9]+)", re.I)),
    ("shopee", re.compile(r"shopee\.com\.br/(?:[^\s?]*-i\.\d+\.(?P<produto>\d+)|product/\d+/(?P<produto2>\d+))", re.I)),
    ("amazon", re.compile(
        r"amazon\.com\.br/(?:[^\s?]*/)?(?:dp|gp/product)/(?P<produto>[A-Z0-9]{10})(?:[^\s]*?[?&]tag=(?P<afiliado>[\w-]+))?", re.I)),
]


def normalizar(texto):
    texto = unicodedata.normalize("NFKD", texto or "")
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", texto.lower()).strip()


# ---------------------------------------------------------------- cache

class Cache:
    def __init__(self, pasta):
        self.pasta = pasta
        os.makedirs(pasta, exist_ok=True)
        self.links_path = os.path.join(pasta, "links.json")
        try:
            with open(self.links_path, encoding="utf-8") as f:
                self.links = json.load(f)
        except (OSError, ValueError):
            self.links = {}

    def _arquivo(self, chave):
        h = hashlib.sha1(chave.encode()).hexdigest()
        return os.path.join(self.pasta, f"api_{h}.json")

    def ler(self, chave):
        try:
            with open(self._arquivo(chave), encoding="utf-8") as f:
                return json.load(f)
        except (OSError, ValueError):
            return None

    def gravar(self, chave, dados):
        with open(self._arquivo(chave), "w", encoding="utf-8") as f:
            json.dump(dados, f, ensure_ascii=False)

    def salvar_links(self):
        with open(self.links_path, "w", encoding="utf-8") as f:
            json.dump(self.links, f, ensure_ascii=False, indent=1)


# ---------------------------------------------------------------- clientes

class ClienteYouTube:
    def __init__(self, chave_api, cache):
        self.chave = chave_api
        self.cache = cache
        self.unidades = 0

    def _get(self, recurso, params, custo):
        params = dict(params, key=self.chave)
        url = f"{API}/{recurso}?{urllib.parse.urlencode(params)}"
        chave_cache = url.replace(self.chave, "KEY")
        guardado = self.cache.ler(chave_cache)
        if guardado is not None:
            return guardado
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                dados = json.load(r)
        except urllib.error.HTTPError as e:
            corpo = e.read().decode(errors="replace")
            if "quotaExceeded" in corpo:
                sys.exit("Cota diária do YouTube esgotada. Rode de novo amanhã: o cache evita repetir o que já foi buscado.")
            raise RuntimeError(f"Erro {e.code} em {recurso}: {corpo[:300]}")
        self.unidades += custo
        self.cache.gravar(chave_cache, dados)
        return dados

    def buscar(self, consulta, publicado_depois, paginas):
        ids, token = [], None
        for _ in range(paginas):
            params = {
                "part": "id", "q": consulta, "type": "video", "maxResults": 50,
                "regionCode": "BR", "relevanceLanguage": "pt",
                "publishedAfter": publicado_depois, "order": "relevance",
            }
            if token:
                params["pageToken"] = token
            dados = self._get("search", params, CUSTO_SEARCH)
            ids += [i["id"]["videoId"] for i in dados.get("items", []) if i["id"].get("videoId")]
            token = dados.get("nextPageToken")
            if not token:
                break
        return ids

    def videos(self, ids):
        saida = []
        for i in range(0, len(ids), 50):
            lote = ids[i:i + 50]
            dados = self._get("videos", {"part": "snippet,statistics", "id": ",".join(lote)}, CUSTO_VIDEOS)
            saida += dados.get("items", [])
        return saida


class ClienteMock:
    """Gera vídeos sintéticos para testar o pipeline sem API."""

    def __init__(self, produtos):
        self.unidades = 0
        self.produtos = produtos
        self.rng = random.Random(42)
        self.finais = {}  # link curto -> URL final

    def _link(self, p, afiliado):
        pid, plat = p["id_produto"], p["plataforma"]
        if plat == "hotmart":
            curto = f"https://go.hotmart.com/H{afiliado}{pid[-3:]}"
            self.finais[curto] = f"https://pay.hotmart.com/{pid}?checkoutMode=10"
            return curto
        if plat == "kiwify":
            return f"https://pay.kiwify.com.br/{pid}?afid=AF{afiliado}"
        if plat == "shopee":
            curto = f"https://s.shopee.com.br/S{afiliado}x{pid[-2:]}"
            self.finais[curto] = f"https://shopee.com.br/produto-i.123456.{pid}"
            return curto
        if plat == "amazon":
            return f"https://www.amazon.com.br/dp/{pid}?tag=afiliado{afiliado}-20"
        return "https://exemplo.com"

    def buscar(self, consulta, publicado_depois, paginas):
        self.unidades += CUSTO_SEARCH * paginas
        prefixo = hashlib.md5(consulta.encode()).hexdigest()[:8]
        return [f"{prefixo}_{i}" for i in range(self.rng.randint(5, 40))]

    def videos(self, ids):
        self.unidades += (len(ids) + 49) // 50
        agora = datetime.now(timezone.utc)
        saida = []
        for vid in ids:
            p = next((x for x in self.produtos
                      if hashlib.md5(x["termos_busca"].encode()).hexdigest()[:8] == vid.split("_")[0]), self.produtos[0])
            peso = int(p.get("_peso_mock", 5))
            desc = "Confira o review completo."
            r = self.rng.random()
            if r < 0.6:
                desc += " Link: " + self._link(p, self.rng.randint(1, peso))
            elif r < 0.8:
                desc += f" Falei do {p['nome']} neste vídeo."
            else:
                outro = self.rng.choice(["https://pay.kiwify.com.br/NOVO123?afid=ZZ1",
                                         "https://www.amazon.com.br/dp/B0NOVOXXXX?tag=zz-20"])
                desc += " Também recomendo: " + outro
            dias = self.rng.randint(1, 90)
            saida.append({
                "id": vid,
                "snippet": {
                    "title": f"Vídeo sobre {p['nome']}",
                    "description": desc,
                    "channelId": f"canal{self.rng.randint(1, peso * 2)}",
                    "publishedAt": (agora - timedelta(days=dias)).strftime("%Y-%m-%dT%H:%M:%SZ"),
                },
                "statistics": {"viewCount": str(self.rng.randint(100, 5000) * peso)},
            })
        return saida


# ---------------------------------------------------------------- links

class AnalisadorLinks:
    def __init__(self, cache, resolver=True, mock_finais=None):
        self.cache = cache
        self.resolver = resolver
        self.mock_finais = mock_finais

    def _resolver(self, url):
        if url in self.cache.links:
            return self.cache.links[url]
        if self.mock_finais is not None:
            final = self.mock_finais.get(url)
        elif not self.resolver:
            return None
        else:
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=15) as r:
                    final = r.geturl()
            except Exception:
                final = None
        self.cache.links[url] = final
        return final

    @staticmethod
    def _casar_final(url):
        for plataforma, padrao in PADROES_FINAIS:
            m = padrao.search(url)
            if m:
                g = m.groupdict()
                produto = g.get("produto") or g.get("produto2")
                return {"plataforma": plataforma, "produto": produto, "afiliado": g.get("afiliado")}
        return None

    def analisar(self, url):
        url = url.rstrip(".,;:!")
        partes = urllib.parse.urlparse(url)
        host = partes.netloc.lower().removeprefix("www.")
        if host in HOSTS_CURTOS:
            token = partes.path.strip("/").split("/")[-1] or None
            final = self._resolver(url)
            info = self._casar_final(final) if final else None
            if info is None:
                info = {"plataforma": HOSTS_CURTOS[host], "produto": None, "afiliado": None}
            info["afiliado"] = info["afiliado"] or token
            return info
        return self._casar_final(url)


# ---------------------------------------------------------------- análise

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
