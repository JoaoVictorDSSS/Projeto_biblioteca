from conexao import conectar

banco = conectar()

if banco.is_connected():
    print("Conectado ao MySQL com sucesso!")

banco.close()