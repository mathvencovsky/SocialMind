"""Cliente da YouTube Data API v3 com cache em disco e contagem de cota,
mais um cliente simulado para testar o pipeline sem API."""

import hashlib
import json
import os
import random
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

API = "https://www.googleapis.com/youtube/v3"
CUSTO_SEARCH = 100
CUSTO_VIDEOS = 1


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
