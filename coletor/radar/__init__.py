import os

ENV_RAIZ = os.path.join(os.path.dirname(__file__), "..", "..", ".env")


def carregar_env(caminho=ENV_RAIZ):
    """Lê CHAVE=valor do .env da raiz sem sobrescrever o que já está no ambiente
    (no GitHub Actions as chaves vêm dos Secrets e não há .env)."""
    try:
        with open(caminho, encoding="utf-8") as f:
            for linha in f:
                chave, sep, valor = linha.strip().partition("=")
                if sep and chave and not chave.startswith("#"):
                    os.environ.setdefault(chave.strip(), valor.strip().strip("\"'"))
    except FileNotFoundError:
        pass
