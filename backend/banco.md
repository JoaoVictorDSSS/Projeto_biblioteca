USE biblioteca;

-- 1. USUARIOS
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_usuario VARCHAR(500) NOT NULL,
    email_usuario VARCHAR(500) NOT NULL UNIQUE,
    senha_usuario VARCHAR(255) NOT NULL,
    carteirinha_ativa BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro_usuario DATE NOT NULL,
    usuario_ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;


-- 2. FUNCIONARIOS
CREATE TABLE IF NOT EXISTS funcionario (
    id_funcionario INT AUTO_INCREMENT PRIMARY KEY,
    nome_funcionario VARCHAR(500) NOT NULL,
    email_funcionario VARCHAR(500) NOT NULL UNIQUE,
    senha_funcionario VARCHAR(255) NOT NULL,
    permissao_funcionario BOOLEAN NOT NULL,
    data_cadastro_funcionario DATE NOT NULL,
    funcionario_ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;


-- 3. LIVROS
CREATE TABLE IF NOT EXISTS livro (
    id_livro INT AUTO_INCREMENT PRIMARY KEY,
    nivel_dano_livro INT,
    sinopse_livro VARCHAR(500) NOT NULL,
    titulo_livro VARCHAR(255) NOT NULL,
    autor_livro VARCHAR(255) NOT NULL,
    data_publicacao DATE NOT NULL,
    localizacao_livro VARCHAR(255) NOT NULL,
    categoria_livro INT,
    livro_ativo BOOLEAN NOT NULL DEFAULT TRUE,
    id_funcionario INT,

    CONSTRAINT chk_dano_livro
        CHECK (nivel_dano_livro IN (1, 2, 3)),

    FOREIGN KEY (id_funcionario)
        REFERENCES funcionario(id_funcionario)
) ENGINE=InnoDB;


-- 4. RETIRADAS
CREATE TABLE IF NOT EXISTS retirada (
    id_retirada INT AUTO_INCREMENT PRIMARY KEY,
    data_retirada DATE NOT NULL,
    nivel_dano_retirada INT NOT NULL,
    data_limite_retirada DATE NOT NULL,
    id_usuario INT NOT NULL,
    id_funcionario INT NOT NULL,
    id_livro INT NOT NULL,

    CONSTRAINT chk_dano_retirada
        CHECK (nivel_dano_retirada IN (1, 2, 3)),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),

    FOREIGN KEY (id_funcionario)
        REFERENCES funcionario(id_funcionario),

    FOREIGN KEY (id_livro)
        REFERENCES livro(id_livro)
) ENGINE=InnoDB;


-- 5. DOACOES
CREATE TABLE IF NOT EXISTS doacao (
    id_doacao INT AUTO_INCREMENT PRIMARY KEY,
    nivel_dano_doacao INT NOT NULL,
    data_doacao DATE NOT NULL,
    id_livro INT,
    id_usuario INT,
    id_funcionario INT,

    CONSTRAINT chk_dano_doacao
        CHECK (nivel_dano_doacao IN (1, 2, 3)),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),

    FOREIGN KEY (id_livro)
        REFERENCES livro(id_livro),

    FOREIGN KEY (id_funcionario)
        REFERENCES funcionario(id_funcionario)
) ENGINE=InnoDB;


-- 6. DEVOLUCOES
CREATE TABLE IF NOT EXISTS devolucao (
    id_devolucao INT AUTO_INCREMENT PRIMARY KEY,
    estado_devolucao INT NOT NULL,
    data_devolucao DATE NOT NULL,
    multa_atraso DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    multa_dano DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    multa_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    id_funcionario INT NOT NULL,
    id_retirada INT NOT NULL UNIQUE,
    
    CONSTRAINT chk_estado_devolucao
    CHECK (estado_devolucao IN (1, 2, 3)),

    FOREIGN KEY (id_funcionario)
        REFERENCES funcionario(id_funcionario),

    FOREIGN KEY (id_retirada)
        REFERENCES retirada(id_retirada)
) ENGINE=InnoDB;
