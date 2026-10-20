import csv
import os
import sys

import main

CSV_EXEMPLO = os.path.join(os.path.dirname(__file__), "..", "produtos_exemplo.csv")
QUADRANTES = {"Oportunidade", "Saturado comprovado", "Inexplorado (nao validado)", "Evitar",
              "Sem dados (informe demanda no CSV)"}


def ler(caminho):
    with open(caminho, encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def test_mock_ponta_a_ponta(tmp_path, monkeypatch, capsys):
    saida = tmp_path / "resultados.csv"
    monkeypatch.setattr(sys, "argv", ["main.py", CSV_EXEMPLO, "--mock",
                                      "--saida", str(saida), "--cache", str(tmp_path / "cache")])
    main.main()

    resultados = ler(saida)
    assert [r["id_produto"] for r in resultados if r["quadrante"] not in QUADRANTES] == []
    assert sorted(r["id_produto"] for r in resultados) == sorted(
        p["id_produto"] for p in main.carregar_produtos(CSV_EXEMPLO))
    # o mock sempre coloca links dos próprios produtos nas descrições
    assert all(int(r["videos_com_link"]) > 0 and int(r["afiliados_distintos"]) > 0 for r in resultados)
    assert all(r["fonte_demanda"] == "csv" for r in resultados)

    descobertos = ler(tmp_path / "resultados_descobertos.csv")
    assert {(d["plataforma"], d["id_produto"]) for d in descobertos} == {
        ("kiwify", "NOVO123"), ("amazon", "B0NOVOXXXX")}

    out = capsys.readouterr()
    assert "Unidades de cota gastas: 606" in out.err
    assert "Produtos fora da sua lista encontrados nos links: 2" in out.out
