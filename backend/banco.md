-- -- ROOT

-- CREATE DATABASE IF NOT EXISTS biblioteca;
-- use biblioteca;

-- user 

-- CREATE TABLE IF NOT EXISTS user (
--     id_user INT PRIMARY KEY AUTO_INCREMENT,
--     nome_user VARCHAR(500) NOT NULL,
--     email_user VARCHAR(500) NOT NULL,
--     pass_user VARCHAR(255) NOT NULL,
--     card_stats_user BOOLEAN NOT NULL,
--     data_cadastro_user date NOT NULL,
--     status BOOLEAN NOT NULL DEFAULT TRUE,
--     UNIQUE (email_user)
-- );

-- Funcionários

-- CREATE TABLE IF NOT EXISTS Funcionario (
--     id_func INT PRIMARY KEY AUTO_INCREMENT,
--     nome_func VARCHAR(500) NOT NULL,
--     email_func VARCHAR(500) NOT NULL,
--     pass_func VARCHAR(255) NOT NULL,
--     permissao_func BOOLEAN NOT NULL,
--     data_cadastro_func date NOT NULL,
--     status BOOLEAN NOT NULL DEFAULT TRUE,
--     UNIQUE (email_func)
-- );




-- book 

-- CREATE TABLE IF NOT EXISTS book (
--     id_book INT PRIMARY KEY AUTO_INCREMENT,
--     dano_book INT,
--     sinopse_book VARCHAR(500) NOT NULL,
--     titulo_book VARCHAR(255) NOT NULL
--     autor_book VARCHAR(255) NOT NULL,
--     publicacao_book date NOT NULL,
--     localizacao_book VARCHAR(255) NOT NULL,
--     categoria_aluno INT,
--     status_aluno BOOLEAN NOT NULL DEFAULT TRUE,
--     id_func INT,
--     UNIQUE (id_book),
--     FOREIGN KEY (id_func)
--         REFERENCES funcionario(id_func)
-- );

-- Retirada

-- CREATE TABLE IF NOT EXISTS Retirada (
--     id_ret INT PRIMARY KEY AUTO_INCREMENT,
--     data_ret DATE NOT NULL UNIQUE,
--     tipo_dano_ret INT NOT NULL, 
--     data_limite_ret DATE NOT NULL,
--     id_user INT,
--     id_func INT,
--     id_book INT,
--     UNIQUE(id_ret),
--     FOREIGN KEY(id_user)
--         REFERENCES user (id_user),
--     FOREIGN KEY (id_func)
--         REFERENCES Funcionario(id_func),
--     FOREIGN KEY (id_book)
--         REFERENCES Book(id_book)
-- );

-- Doação

-- CREATE TABLE IF NOT EXISTS Donate (
--     id_donate INT PRIMARY KEY AUTO_INCREMENT,
--     tipo_dano_donate INT NOT NULL,
--     data_donate DATE NOT NULL,
--     id_book INT,
--     id_user INT,
--     id_func INT,
--     FOREIGN KEY (id_user)
--         REFERENCES user(id_user),
--     FOREIGN KEY (id_book)
--         REFERENCES Book (id_book),
--     FOREIGN KEY (id_func)
--         REFERENCES Funcionario (id_func)
-- );

-- Devolução

-- CREATE TABLE IF NOT EXISTS Devolucao (
--     id_devo INT PRIMARY KEY AUTO_INCREMENT,
--     estado_devo INT NOT NULL,
--     data_devo DATE NOT NULL,
--     multa_atraso_devo INT NOT NULL,
--     multa_dano_devo INT NOT NULL,
--     multa_total_devo INT NOT NULL,
--     id_func INT,
--     id_book INT,
--     id_ret INT,
--     id_user INT,
--     FOREIGN KEY (id_func)
--         REFERENCES funcionario (id_func),
--     FOREIGN KEY (id_book)
--         REFERENCES Book (id_book),
--     FOREIGN KEY (id_ret)
--         REFERENCES Retirada (id_ret),
--     FOREIGN KEY (id_user)
--         REFERENCES user (id_user)
-- );
