/**
 * Calcula o valor da multa de acordo com os dias de atraso.
 * @param {number} diasAtraso - Quantidade de dias de atraso.
 * @returns {number} Valor da multa.
 */
function calcularMulta(diasAtraso) {
    return diasAtraso * 1.5;
}

/**
 * Verifica se um livro está disponível para retirada.
 * @param {object} livro - Livro que será verificado.
 * @returns {boolean} True se o livro estiver disponível, false caso contrário.
 */
function verificarDisponibilidade(livro) {
    if (livro.situacao === "DISPONÍVEL") {
        return true;
    } else {
        return false;
    }
}

/**
 * Busca um livro pelo título.
 * @param {object[]} livros - Lista de livros.
 * @param {string} nome - Nome do livro procurado.
 * @returns {object|null} Livro encontrado ou null caso não exista.
 */
function buscarLivroPorNome(livros, nome) {
    let livroEncontrado = null;

    livros.forEach(function (livro) {
        if (livro.titulo.toLowerCase() === nome.toLowerCase()) {
            livroEncontrado = livro;
        }
    });

    return livroEncontrado;
}

/**
 * Verifica se um usuário possui uma retirada ativa.
 * @param {number} idUsuario - ID do usuário.
 * @param {object[]} retiradas - Lista de retiradas.
 * @returns {boolean} True se o usuário possuir retirada ativa, false caso contrário.
 */
function verificarRetiradaAtiva(idUsuario, retiradas) {
    let possuiRetirada = false;

    retiradas.forEach(function (retirada) {
        if (
            retirada.idUsuario === idUsuario &&
            retirada.situacao === "ATIVA"
        ) {
            possuiRetirada = true;
        }
    });

    return possuiRetirada;
}

/**
 * Retorna todos os livros que estão disponíveis.
 * @param {object[]} livros - Lista de livros.
 * @returns {object[]} Lista de livros disponíveis.
 */
function listarLivrosDisponiveis(livros) {
    const livrosDisponiveis = [];

    livros.forEach(function (livro) {
        if (livro.situacao === "DISPONÍVEL") {
            livrosDisponiveis.push(livro);
        }
    });

    return livrosDisponiveis;
}