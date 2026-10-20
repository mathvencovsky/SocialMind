import os
import sys

import pytest

import importar_csv
import main
from radar import carregar_env
from radar.db import Banco

CSV_EXEMPLO = os.path.join(os.path.dirname(__file__), "..", "produtos_exemplo.csv")


class BancoFalso(Banco):
    """Banco real com o HTTP trocado por um gravador de chamadas."""

    def __init__(self, produtos=()):
        self.chamadas = []
        self.produtos = list(produtos)

    def _req(self, metodo, caminho, corpo=None, prefer=None):
        self.chamadas.append((metodo, caminho, corpo, prefer))
        return self.produtos if metodo == "GET" else None

    def lotes(self, tabela):
        return [c for c in self.chamadas if c[0] == "POST" and c[1].split("?")[0] == tabela]


def produtos_db():
    return [{"id": i, "plataforma": p["plataforma"], "id_externo": p["id_produto"], "nome": p["nome"],
             "termos_busca": p["termos_busca"], "demanda_bruta": float(p["demanda"])}
            for i, p in enumerate(main.carregar_produtos(CSV_EXEMPLO), 1)]


def rodar_main(monkeypatch, tmp_path, banco, *extra):
    monkeypatch.setattr(main, "Banco", lambda: banco)
    monkeypatch.setattr(sys, "argv", ["main.py", "--mock", "--saida", str(tmp_path / "r.csv"),
                                      "--cache", str(tmp_path / "cache"), *extra])
    main.main()


def test_main_grava_todas_as_tabelas(monkeypatch, tmp_path):
    banco = BancoFalso(produtos_db())
    rodar_main(monkeypatch, tmp_path, banco)

    for tabela, conflito in [("videos", "id"), ("video_produto", "video_id,produto_id"),
                             ("metricas_diarias", "produto_id,data"), ("descobertos", "plataforma,id_externo")]:
        lotes = banco.lotes(tabela)
        assert lotes, tabela
        for _, caminho, linhas, prefer in lotes:
            assert caminho == f"{tabela}?on_conflict={conflito}"
            assert prefer.startswith("resolution=merge-duplicates")
            assert len({tuple(sorted(l)) for l in linhas}) == 1, "PostgREST exige as mesmas chaves no lote"
            chaves = [tuple(l[c] for c in conflito.split(",")) for l in linhas]
            assert len(chaves) == len(set(chaves)), "upsert não pode tocar a mesma linha duas vezes"

    videos = {v["id"] for v in banco.lotes("videos")[0][2]}
    vinculos = banco.lotes("video_produto")[0][2]
    assert {v["video_id"] for v in vinculos} == videos
    assert {v["tipo_match"] for v in vinculos} == {"link", "mencao"}
    assert {m["produto_id"] for m in banco.lotes("metricas_diarias")[0][2]} == {1, 2, 3, 4, 5, 6}
    assert all("visto_primeiro_em" not in d for d in banco.lotes("descobertos")[0][2])

    patch = [c for c in banco.chamadas if c[0] == "PATCH"]
    assert patch[0][1] == "produtos?id=in.(1,2,3,4,5,6)" and "ultima_coleta" in patch[0][2]

    (execucao,) = banco.lotes("execucoes")
    assert execucao[2]["produtos_processados"] == 6
    assert execucao[2]["unidades_gastas"] == 606
    assert execucao[2]["erros"] is None


def test_falha_registra_execucao_com_erro(monkeypatch, tmp_path):
    banco = BancoFalso(produtos_db())
    monkeypatch.setattr(main, "analisar", lambda *a: sys.exit("Cota diária do YouTube esgotada."))
    with pytest.raises(SystemExit):
        rodar_main(monkeypatch, tmp_path, banco)
    (execucao,) = banco.lotes("execucoes")
    assert execucao[2]["erros"] == "Cota diária do YouTube esgotada."
    assert execucao[2]["produtos_processados"] == 0
    assert not banco.lotes("videos")


def test_banco_vazio_avisa(monkeypatch, tmp_path):
    with pytest.raises(SystemExit, match="importar_csv"):
        rodar_main(monkeypatch, tmp_path, BancoFalso([]))


def test_importar_csv_exemplo():
    linhas = importar_csv.linhas_produtos(main.carregar_produtos(CSV_EXEMPLO))
    assert len(linhas) == 6
    assert linhas[0] == {"plataforma": "hotmart", "id_externo": "K12345678X", "nome": "Curso de Excel Pro",
                         "termos_busca": "curso de excel", "demanda_bruta": 80.0, "fonte": "csv"}


def test_importar_csv_colunas_opcionais(tmp_path):
    csv = tmp_path / "p.csv"
    csv.write_text("nome,plataforma,id_produto,termos_busca,nicho,preco,descricao\n"
                   "Curso X,Hotmart, K1 ,curso x,financas,\"197,90\",\n", encoding="utf-8")
    (linha,) = importar_csv.linhas_produtos(main.carregar_produtos(str(csv)))
    assert linha["plataforma"] == "hotmart" and linha["id_externo"] == "K1"
    assert linha["nicho"] == "financas" and linha["preco"] == 197.9 and linha["descricao"] is None
    assert linha["demanda_bruta"] is None


@pytest.mark.parametrize("linhas, erro", [
    ("Curso,tiktok,K1,curso\n", "plataforma 'tiktok' inválida"),
    ("Curso,hotmart,K1,curso\nOutro,hotmart,K1,outro\n", "Linha 3: produto hotmart/K1 repetido"),
    ("Curso,hotmart,,curso\n", "obrigatórios"),
])
def test_importar_csv_rejeita(tmp_path, linhas, erro):
    csv = tmp_path / "p.csv"
    csv.write_text("nome,plataforma,id_produto,termos_busca\n" + linhas, encoding="utf-8")
    with pytest.raises(SystemExit, match=erro):
        importar_csv.linhas_produtos(main.carregar_produtos(str(csv)))


def test_carregar_env(tmp_path, monkeypatch):
    env = tmp_path / ".env"
    env.write_text("# comentario\nRADAR_A=\"um\"\nRADAR_B=dois=2\nRADAR_C=novo\nsem_igual\n", encoding="utf-8")
    monkeypatch.setenv("RADAR_C", "ja_definido")
    for k in ("RADAR_A", "RADAR_B"):
        monkeypatch.delenv(k, raising=False)
    carregar_env(str(env))
    assert os.environ["RADAR_A"] == "um"
    assert os.environ["RADAR_B"] == "dois=2"
    assert os.environ["RADAR_C"] == "ja_definido"
