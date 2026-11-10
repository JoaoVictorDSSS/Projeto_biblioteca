-- =====================================================================
-- BIBLIOTECOLANDIA - Dados de exemplo (Fase 1 revisada)
-- Rode DEPOIS do banco.sql, em banco recem-criado (os ids 1, 2, 3...
-- dependem do AUTO_INCREMENT comecar do zero).
-- =====================================================================

USE biblioteca;

-- Categorias
INSERT INTO categoria (nome_categoria) VALUES
    ('Romance'),            -- 1
    ('Ficção Científica'),  -- 2
    ('Fantasia'),           -- 3
    ('Terror'),             -- 4
    ('Técnico'),            -- 5
    ('Infantil');           -- 6 (sem livros: serve para testar filtro vazio)

-- Funcionario de teste
-- ATENCAO: o hash e provisorio, ninguem consegue logar com ele.
-- Na fase 4 geramos hashes reais.
INSERT INTO funcionario
    (nome_funcionario, email_funcionario, senha_funcionario,
     data_cadastro_funcionario)
VALUES
    ('Funcionário Teste', 'func@biblioteca.com', 'HASH_PROVISORIO_FASE_4',
     CURDATE() - INTERVAL 365 DAY);

-- Clientes de teste
INSERT INTO usuario
    (nome_usuario, email_usuario, senha_usuario, data_cadastro_usuario)
VALUES
    ('Ana Souza',  'ana@email.com',   'HASH_PROVISORIO_FASE_4', CURDATE() - INTERVAL 365 DAY),
    ('Bruno Lima', 'bruno@email.com', 'HASH_PROVISORIO_FASE_4', CURDATE() - INTERVAL 365 DAY),
    ('Carla Dias', 'carla@email.com', 'HASH_PROVISORIO_FASE_4', CURDATE() - INTERVAL 365 DAY);

-- Livros (edicoes). quantidade_total deve bater com o numero de doacoes
-- de cada livro, inseridas mais abaixo.
INSERT INTO livro
    (titulo_livro, autor_livro, editora_livro, sinopse_livro,
     ano_publicacao, localizacao_livro, categoria_livro,
     quantidade_total, id_funcionario)
VALUES
    ('Dom Casmurro', 'Machado de Assis', 'Principis',
     'Bentinho narra a própria vida e tenta provar a si mesmo que foi traído por Capitu.',
     1899, 'Estante A1', 1, 2, 1),                                   -- id 1
    ('1984', 'George Orwell', 'Companhia das Letras',
     'Numa sociedade vigiada o tempo todo, um funcionário do governo começa a questionar o regime.',
     1949, 'Estante A2', 2, 2, 1),                                   -- id 2
    ('O Hobbit', 'J.R.R. Tolkien', 'HarperCollins',
     'Bilbo Bolseiro é arrastado para uma viagem perigosa para reconquistar um tesouro guardado por um dragão.',
     1937, 'Estante B1', 3, 1, 1),                                   -- id 3
    ('Drácula', 'Bram Stoker', 'Darkside',
     'Um advogado viaja à Transilvânia e descobre a ameaça do conde que planeja chegar a Londres.',
     1897, 'Estante B2', 4, 1, 1),                                   -- id 4
    ('Clean Code', 'Robert C. Martin', 'Alta Books',
     'Princípios e exemplos práticos para escrever código legível e fácil de manter.',
     2008, 'Estante C1', 5, 0, 1),                                   -- id 5 (sem exemplares)
    ('Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 'Rocco',
     'Um garoto descobre que é bruxo e começa a estudar em uma escola de magia.',
     2000, 'Estante B3', 3, 2, 1),                                   -- id 6
    ('Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 'Bloomsbury',
     'Um garoto descobre que é bruxo e começa a estudar em uma escola de magia.',
     1997, 'Estante B4', 3, 1, 1);                                   -- id 7

-- Doacoes aceitas (cada uma = 1 exemplar). Soma por livro:
-- id1: 2, id2: 2, id3: 1, id4: 1, id5: 0, id6: 2, id7: 1  (= quantidade_total)
INSERT INTO doacao
    (nivel_dano_doacao, data_doacao, id_livro, id_usuario, id_funcionario)
VALUES
    (0, CURDATE() - INTERVAL 200 DAY, 1, 1, 1),
    (1, CURDATE() - INTERVAL 190 DAY, 1, 2, 1),
    (0, CURDATE() - INTERVAL 180 DAY, 2, 3, 1),
    (0, CURDATE() - INTERVAL 170 DAY, 2, 1, 1),
    (1, CURDATE() - INTERVAL 160 DAY, 3, 2, 1),
    (0, CURDATE() - INTERVAL 150 DAY, 4, 3, 1),
    (0, CURDATE() - INTERVAL 140 DAY, 6, 1, 1),
    (2, CURDATE() - INTERVAL 130 DAY, 6, 2, 1),
    (0, CURDATE() - INTERVAL 120 DAY, 7, 3, 1);

-- Retirada 1: Ana,   "1984",     em dia (retirada ha 10 dias)
-- Retirada 2: Bruno, "O Hobbit", ATRASADA (prazo venceu ha 15 dias)
-- Retirada 3: Carla, "Drácula",  ja devolvida (com multa)
INSERT INTO retirada
    (data_retirada, nivel_dano_retirada, data_limite_retirada,
     id_usuario, id_funcionario, id_livro)
VALUES
    (CURDATE() - INTERVAL 10 DAY, 0, CURDATE() + INTERVAL 35 DAY, 1, 1, 2),
    (CURDATE() - INTERVAL 60 DAY, 0, CURDATE() - INTERVAL 15 DAY, 2, 1, 3),
    (CURDATE() - INTERVAL 50 DAY, 0, CURDATE() -  INTERVAL 5 DAY, 3, 1, 4);

-- Devolucao da retirada 3: 3 dias de atraso (3 x 1,50 = 4,50)
-- + avaria leve (30,00) = 34,50, ainda nao paga
INSERT INTO devolucao
    (estado_devolucao, data_devolucao, dias_atraso, multa_atraso,
     multa_dano, multa_total, multa_paga, data_pagamento,
     id_funcionario, id_retirada)
VALUES
    (1, CURDATE() - INTERVAL 2 DAY, 3, 4.50, 30.00, 34.50, FALSE, NULL, 1, 3);
