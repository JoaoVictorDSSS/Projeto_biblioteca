-- =====================================================================
-- BIBLIOTECOLANDIA - Schema do banco (Fase 1 revisada)
-- ATENCAO: este script APAGA as tabelas e recria tudo. Use so em
-- desenvolvimento, nunca com dados reais.
-- Requer MySQL 8.0.16+ (ou MariaDB 10.2+) para os CHECK funcionarem.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS biblioteca CHARACTER SET utf8mb4;
USE biblioteca;

-- Apaga na ordem inversa das dependencias (quem tem FK vai primeiro)
DROP TABLE IF EXISTS devolucao;
DROP TABLE IF EXISTS doacao;
DROP TABLE IF EXISTS retirada;
DROP TABLE IF EXISTS livro;
DROP TABLE IF EXISTS categoria;
DROP TABLE IF EXISTS funcionario;
DROP TABLE IF EXISTS usuario;


-- ---------------------------------------------------------------------
-- 1. USUARIO (cliente)
-- A situacao da carteirinha (habilitada/bloqueada) NAO e guardada aqui:
-- ela e calculada na hora a partir de retirada e devolucao (RN12, RN13,
-- RN15). Assim nunca fica desatualizada.
-- usuario_ativo = FALSE desativa o cadastro (nao apagamos historico).
-- ---------------------------------------------------------------------
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_usuario VARCHAR(500) NOT NULL,
    email_usuario VARCHAR(500) NOT NULL UNIQUE,
    senha_usuario VARCHAR(255) NOT NULL,      -- guarda o HASH, nunca a senha
    data_cadastro_usuario DATE NOT NULL,
    usuario_ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 2. FUNCIONARIO
-- funcionario_ativo = FALSE quando a pessoa deixa de trabalhar na
-- biblioteca: o login dela deve ser recusado (fase 4).
-- (a coluna permissao_funcionario foi removida: fazia o mesmo papel)
-- ---------------------------------------------------------------------
CREATE TABLE funcionario (
    id_funcionario INT AUTO_INCREMENT PRIMARY KEY,
    nome_funcionario VARCHAR(500) NOT NULL,
    email_funcionario VARCHAR(500) NOT NULL UNIQUE,
    senha_funcionario VARCHAR(255) NOT NULL,  -- guarda o HASH
    data_cadastro_funcionario DATE NOT NULL,
    funcionario_ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 3. CATEGORIA
-- ---------------------------------------------------------------------
CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome_categoria VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 4. LIVRO
-- Cada linha e uma EDICAO (mesma obra de outra editora = outra linha).
-- quantidade_total = quantos exemplares fisicos existem. Nasce em 0:
-- o livro so passa a ter exemplares quando alguem doa (fase 9).
-- Disponiveis = quantidade_total - retiradas sem devolucao (calculado).
-- ---------------------------------------------------------------------
CREATE TABLE livro (
    id_livro INT AUTO_INCREMENT PRIMARY KEY,
    titulo_livro VARCHAR(200) NOT NULL,
    autor_livro VARCHAR(150) NOT NULL,
    editora_livro VARCHAR(100) NOT NULL,
    sinopse_livro TEXT NOT NULL,
    ano_publicacao SMALLINT NOT NULL,
    localizacao_livro VARCHAR(255) NOT NULL,
    categoria_livro INT,
    quantidade_total INT NOT NULL DEFAULT 0,
    livro_ativo BOOLEAN NOT NULL DEFAULT TRUE,
    id_funcionario INT,                       -- quem cadastrou

    -- Evita cadastrar a mesma edicao duas vezes
    CONSTRAINT uq_edicao_livro
        UNIQUE (titulo_livro, autor_livro, editora_livro),

    CONSTRAINT chk_ano_publicacao
        CHECK (ano_publicacao BETWEEN 1000 AND 2100),

    CONSTRAINT chk_quantidade_total
        CHECK (quantidade_total >= 0),

    FOREIGN KEY (categoria_livro)
        REFERENCES categoria(id_categoria),

    FOREIGN KEY (id_funcionario)
        REFERENCES funcionario(id_funcionario)
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 5. RETIRADA
-- Escala de avaria/condicao: 0 = nenhuma, 1 = leve, 2 = media, 3 = grave
-- "Retirada ativa" = retirada SEM linha correspondente em devolucao.
-- ---------------------------------------------------------------------
CREATE TABLE retirada (
    id_retirada INT AUTO_INCREMENT PRIMARY KEY,
    data_retirada DATE NOT NULL,
    nivel_dano_retirada INT NOT NULL,         -- condicao do livro na saida
    data_limite_retirada DATE NOT NULL,
    id_usuario INT NOT NULL,
    id_funcionario INT NOT NULL,
    id_livro INT NOT NULL,

    CONSTRAINT chk_dano_retirada
        CHECK (nivel_dano_retirada IN (0, 1, 2, 3)),

    -- RN10: prazo maximo de 45 dias
    CONSTRAINT chk_prazo_retirada
        CHECK (DATEDIFF(data_limite_retirada, data_retirada) BETWEEN 0 AND 45),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),

    FOREIGN KEY (id_funcionario)
        REFERENCES funcionario(id_funcionario),

    FOREIGN KEY (id_livro)
        REFERENCES livro(id_livro)
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 6. DOACAO
-- So existe linha aqui se a doacao foi ACEITA (o funcionario decide no
-- balcao). Cada doacao = 1 exemplar de um livro ja cadastrado.
-- ---------------------------------------------------------------------
CREATE TABLE doacao (
    id_doacao INT AUTO_INCREMENT PRIMARY KEY,
    nivel_dano_doacao INT NOT NULL,           -- condicao do exemplar recebido
    data_doacao DATE NOT NULL,
    id_livro INT NOT NULL,
    id_usuario INT NOT NULL,
    id_funcionario INT NOT NULL,

    CONSTRAINT chk_dano_doacao
        CHECK (nivel_dano_doacao IN (0, 1, 2, 3)),

    FOREIGN KEY (id_livro)
        REFERENCES livro(id_livro),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),

    FOREIGN KEY (id_funcionario)
        REFERENCES funcionario(id_funcionario)
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 7. DEVOLUCAO
-- estado_devolucao = classificacao da avaria (0 a 3), RN24.
-- multa_dano: leve = 30, media = 50 (calculado pelo sistema);
-- grave = valor de reposicao digitado pelo funcionario na hora.
-- Multa pendente = multa_total > 0 AND multa_paga = FALSE.
-- ---------------------------------------------------------------------
CREATE TABLE devolucao (
    id_devolucao INT AUTO_INCREMENT PRIMARY KEY,
    estado_devolucao INT NOT NULL,
    data_devolucao DATE NOT NULL,
    dias_atraso INT NOT NULL DEFAULT 0,
    multa_atraso DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    multa_dano DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    multa_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    multa_paga BOOLEAN NOT NULL DEFAULT FALSE,
    data_pagamento DATE NULL,
    id_funcionario INT NOT NULL,
    id_retirada INT NOT NULL UNIQUE,          -- 1 retirada = 1 devolucao

    CONSTRAINT chk_estado_devolucao
        CHECK (estado_devolucao IN (0, 1, 2, 3)),

    CONSTRAINT chk_dias_atraso
        CHECK (dias_atraso >= 0),

    -- RN25: total = atraso + avaria
    CONSTRAINT chk_multas
        CHECK (
            multa_atraso >= 0
            AND multa_dano >= 0
            AND multa_total = multa_atraso + multa_dano
        ),

    FOREIGN KEY (id_funcionario)
        REFERENCES funcionario(id_funcionario),

    FOREIGN KEY (id_retirada)
        REFERENCES retirada(id_retirada)
) ENGINE=InnoDB;
