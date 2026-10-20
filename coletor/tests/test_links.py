import pytest

from radar.links import URL_RE, AnalisadorLinks
from radar.youtube import Cache


@pytest.fixture
def links(tmp_path):
    return AnalisadorLinks(Cache(str(tmp_path)), resolver=False)


@pytest.mark.parametrize("url, plataforma, produto, afiliado", [
    # exemplos do README
    ("https://pay.hotmart.com/K12345678X?checkoutMode=10", "hotmart", "K12345678X", None),
    ("https://pay.kiwify.com.br/AbC123", "kiwify", "AbC123", None),
    ("https://shopee.com.br/Fone-Bluetooth-Z1-i.123456.22334455667", "shopee", "22334455667", None),
    ("https://www.amazon.com.br/dp/B0ABCDEFGH", "amazon", "B0ABCDEFGH", None),
    # afiliado na query string
    ("https://pay.kiwify.com.br/AbC123?afid=AF7", "kiwify", "AbC123", "AF7"),
    ("https://www.amazon.com.br/Air-Fryer/dp/B0ABCDEFGH/ref=x?tag=canal-20", "amazon", "B0ABCDEFGH", "canal-20"),
    ("https://www.amazon.com.br/gp/product/B0ABCDEFGH", "amazon", "B0ABCDEFGH", None),
    ("https://shopee.com.br/product/123456/22334455667", "shopee", "22334455667", None),
    ("https://sun.eduzz.com/123456?a=789", "eduzz", "123456", "789"),
    ("https://chk.eduzz.com/123456", "eduzz", "123456", None),
    ("https://www.monetizze.com.br/checkout/ABC123", "monetizze", "ABC123", None),
    # pontuação colada no fim do link
    ("https://pay.hotmart.com/K12345678X.", "hotmart", "K12345678X", None),
])
def test_links_finais(links, url, plataforma, produto, afiliado):
    assert links.analisar(url) == {"plataforma": plataforma, "produto": produto, "afiliado": afiliado}


def test_link_desconhecido(links):
    assert links.analisar("https://exemplo.com/produto") is None


def test_link_curto_resolvido(tmp_path):
    finais = {"https://go.hotmart.com/HABC": "https://pay.hotmart.com/K12345678X?off=1"}
    links = AnalisadorLinks(Cache(str(tmp_path)), mock_finais=finais)
    assert links.analisar("https://go.hotmart.com/HABC") == {
        "plataforma": "hotmart", "produto": "K12345678X", "afiliado": "HABC"}


@pytest.mark.parametrize("url, plataforma, token", [
    ("https://go.hotmart.com/HABC", "hotmart", "HABC"),
    ("https://s.shopee.com.br/5abc", "shopee", "5abc"),
    ("https://shope.ee/xyz", "shopee", "xyz"),
    ("https://amzn.to/3Qw9", "amazon", "3Qw9"),
    ("https://www.amzn.to/3Qw9", "amazon", "3Qw9"),
    # app.monetizze.com.br é tratado como link curto, mesmo no checkout
    ("https://app.monetizze.com.br/checkout/ABC123", "monetizze", "ABC123"),
])
def test_link_curto_sem_resolver(links, url, plataforma, token):
    # sem resolver, conta a plataforma e o token, mas não o produto
    assert links.analisar(url) == {"plataforma": plataforma, "produto": None, "afiliado": token}


def test_link_curto_usa_cache(tmp_path):
    cache = Cache(str(tmp_path))
    cache.links["https://amzn.to/abc"] = "https://www.amazon.com.br/dp/B0ABCDEFGH?tag=t-20"
    info = AnalisadorLinks(cache, resolver=False).analisar("https://amzn.to/abc")
    assert info == {"plataforma": "amazon", "produto": "B0ABCDEFGH", "afiliado": "t-20"}


def test_extrai_urls_da_descricao():
    desc = 'Compre aqui: https://pay.kiwify.com.br/AbC123?afid=AF1 (link) e "https://amzn.to/x".'
    assert URL_RE.findall(desc) == ["https://pay.kiwify.com.br/AbC123?afid=AF1", "https://amzn.to/x"]
