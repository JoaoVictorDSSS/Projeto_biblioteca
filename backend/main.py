from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Aluno(BaseModel):
    nome: str
    idade: int
    email: str



@app.get("/projeto")
def sobre():
    return {
        "linguagem": "Python",
        "banco de dados": "mySQL"
    }


@app.post("/alunos")
def cadastrar_aluno(aluno: Aluno):
    return {
        "mensagem": "Aluno recebido com sucesso!",
        "nome": aluno.nome,
        "idade": aluno.idade
    }