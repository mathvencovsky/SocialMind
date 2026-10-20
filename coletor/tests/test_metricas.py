from datetime import datetime, timezone

from radar.metricas import classificar, dias_desde, normalizar


def produto(nome, canais, demanda_csv=None, vpd=0):
    return {"nome": nome, "canais_distintos": canais, "demanda_csv": demanda_csv, "views_por_dia_mediana": vpd}


def test_quadrantes_com_demanda_do_csv():
    r = [produto("evitar", 10, 20), produto("inexplorado", 1, 10),
         produto("saturado", 10, 80), produto("oportunidade", 1, 90)]
    classificar(r)
    # corte de demanda = 50, corte de oferta = 5,5; ordenado por quadrante
    assert [(x["nome"], x["quadrante"]) for x in r] == [
        ("oportunidade", "Oportunidade"),
        ("saturado", "Saturado comprovado"),
        ("inexplorado", "Inexplorado (nao validado)"),
        ("evitar", "Evitar"),
    ]
    assert all(x["fonte_demanda"] == "csv" for x in r)


def test_demanda_incompleta_usa_views_por_dia():
    r = [produto("a", 3, 90, vpd=500), produto("b", 3, None, vpd=10), produto("sem", 0, 50, vpd=0)]
    classificar(r)
    por_nome = {x["nome"]: x for x in r}
    assert all(x["fonte_demanda"] == "views/dia" for x in r)
    assert por_nome["a"]["demanda"] == 500
    assert por_nome["a"]["quadrante"] == "Oportunidade"
    assert por_nome["b"]["quadrante"] == "Oportunidade"  # 10 >= mediana 10, oferta 3 não passa de 3
    assert por_nome["sem"]["quadrante"] == "Sem dados (informe demanda no CSV)"
    assert r[-1]["nome"] == "sem"


def test_demanda_zero_nunca_e_alta():
    r = [produto("a", 1, 0), produto("b", 5, 0)]
    classificar(r)
    assert {x["quadrante"] for x in r} == {"Inexplorado (nao validado)", "Evitar"}


def test_normalizar():
    assert normalizar("  Método   INGLÊS\tRápido ") == "metodo ingles rapido"
    assert normalizar(None) == ""


def test_dias_desde():
    agora = datetime(2026, 1, 31, tzinfo=timezone.utc)
    assert dias_desde("2026-01-01T00:00:00Z", agora) == 30
    assert dias_desde("2026-01-31T00:00:00Z", agora) == 1
    assert dias_desde("data ruim", agora) is None
    assert dias_desde(None, agora) is None
