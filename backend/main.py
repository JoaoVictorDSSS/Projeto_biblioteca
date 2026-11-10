from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from conexao import conectar
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Livro(BaseModel):
    sinopse_livro: str
    titulo_livro: str
    autor_livro: str
    editora_livro: str
    ano_publicacao: int
    localizacao_livro: str
    categoria_livro: int

@app.get("/projeto")
def sobre():
    return {
        "linguagem": "Python",
        "banco de dados": "MySQL"
    }


@app.post("/livros")
def cadastrar_livro(livro: Livro):

    banco = None
    cursor = None

    try:
        banco = conectar()
        cursor = banco.cursor()

        sql = """
            INSERT INTO livro (
                sinopse_livro,
                titulo_livro,
                autor_livro,
                editora_livro,
                ano_publicacao,
                localizacao_livro,
                categoria_livro
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        valores = (
            livro.sinopse_livro,
            livro.titulo_livro,
            livro.autor_livro,
            livro.editora_livro,
            livro.ano_publicacao,
            livro.localizacao_livro,
            livro.categoria_livro
        )
        cursor.execute(sql, valores)
        banco.commit()

        return {
            "mensagem": "Livro cadastrado com sucesso!",
            "id_livro": cursor.lastrowid
        }

    except Exception as erro:
        if banco and banco.is_connected():
            banco.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao cadastrar livro: {str(erro)}"
        )

    finally:
        if cursor:
            cursor.close()

        if banco and banco.is_connected():
            banco.close()