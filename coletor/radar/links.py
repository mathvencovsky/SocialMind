"""Extração de links de afiliado das descrições e resolução de links curtos."""

import re
import urllib.parse
import urllib.request

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
