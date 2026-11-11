# Bibliotecolandia — Decisões do projeto

Este arquivo é a fonte da verdade. Ao começar uma fase em um chat novo,
anexe este arquivo + os arquivos que a fase vai mexer.

## Plano (ordem das fases)

| Fase | O que | Status |
|---|---|---|
| 0 | Preparação (.env, requirements, README, Git) | feita |
| 1 | Banco corrigido + seed | feita |
| 2 | Organizar backend (dividir main.py, CORS, erros) | pendente |
| 3 | Catálogo lendo do banco (GET /livros) | pendente |
| 4 | Login, hash de senha, JWT, permissões | pendente |
| 5 | Cadastro de cliente (só funcionário) | pendente |
| 6 | Retirada | pendente |
| 7 | Devolução e multas | pendente |
| 8 | Bloqueio da carteirinha e pagamento de multa | pendente |
| 9 | Doação (soma exemplar) | pendente |
| 10 | Histórico (só funcionário) | pendente |
| 11 | Acabamento (info, contato, acessibilidade, testes) | pendente |

## Decisões de modelagem

- **Avaria/condição** usa a mesma escala em todo o sistema:
  0 = nenhuma (R$ 0), 1 = leve (R$ 30), 2 = média (R$ 50),
  3 = grave (valor de reposição **digitado pelo funcionário** na devolução).
- **Não existe `valor_livro`.** A multa grave é digitada na hora e gravada
  em `devolucao.multa_dano`.
- **Cada linha de `livro` é uma edição** (título + autor + editora, único).
  `quantidade_total` = exemplares físicos. Livro nasce com 0 e só ganha
  exemplares por doação.
- **Doação:** só é gravada se aceita (decisão do funcionário no balcão).
  Cada doação = 1 exemplar. Gravar a doação e somar 1 em
  `quantidade_total` acontecem **na mesma transação**.
- **Disponíveis** = `quantidade_total` − retiradas sem devolução.
  É **calculado**, nunca guardado.
- **Retirada ativa** = retirada sem linha em `devolucao`.
- **Devolução com avaria grave:** o exemplar sai do acervo
  (`quantidade_total` diminui 1, na mesma transação da devolução).
- **Carteirinha:** a situação é **calculada** (bloqueada se há livro
  atrasado OU multa pendente). Não há coluna `carteirinha_ativa`.
  Multa pendente = `multa_total > 0 AND multa_paga = FALSE`.
- **Funcionário que saiu:** `funcionario_ativo = FALSE` → login recusado.
  (`permissao_funcionario` foi removida.) Idem `usuario_ativo` para clientes.
- **Ano de publicação** (`ano_publicacao SMALLINT`), não data completa.
- **Preço da multa por atraso** (R$ 1,50/dia) e prazo (45 dias) ficam no
  código do backend, não no banco.

## Quem vê o quê

- **Público (sem login):** início e catálogo (RN04).
- **Cliente logado:** catálogo + aviso da situação da carteirinha
  (motivo e, se for multa, o valor). O login do cliente bloqueado **não**
  é recusado: ele precisa conseguir ver por que está bloqueado.
- **Funcionário logado:** tudo (cadastro de livro e cliente, retirada,
  devolução, doação, histórico).
- Retirada é recusada pelo backend se a carteirinha estiver bloqueada.

## Consultas úteis (conferidas no teste da Fase 1)

Disponibilidade por livro:

```sql
SELECT l.id_livro, l.titulo_livro, l.editora_livro, l.quantidade_total,
       l.quantidade_total - COUNT(r.id_retirada) AS disponiveis
FROM livro l
LEFT JOIN retirada r
       ON r.id_livro = l.id_livro
      AND NOT EXISTS (SELECT 1 FROM devolucao d
                      WHERE d.id_retirada = r.id_retirada)
WHERE l.livro_ativo = TRUE
GROUP BY l.id_livro, l.titulo_livro, l.editora_livro, l.quantidade_total;
```

Situação da carteirinha por cliente:

```sql
SELECT u.id_usuario, u.nome_usuario,
       (SELECT COUNT(*)
          FROM retirada r
          LEFT JOIN devolucao d ON d.id_retirada = r.id_retirada
         WHERE r.id_usuario = u.id_usuario
           AND d.id_devolucao IS NULL
           AND r.data_limite_retirada < CURDATE()) AS livros_atrasados,
       (SELECT COALESCE(SUM(d.multa_total), 0)
          FROM devolucao d
          JOIN retirada r ON r.id_retirada = d.id_retirada
         WHERE r.id_usuario = u.id_usuario
           AND d.multa_total > 0
           AND d.multa_paga = FALSE) AS multas_pendentes
FROM usuario u;
```

## Perguntas em aberto

- (nenhuma no momento)
