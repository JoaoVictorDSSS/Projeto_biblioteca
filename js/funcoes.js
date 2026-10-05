/**
 * Calcula o valor da multa de acordo com os dias de atraso.
 * @param {number} diasAtraso - Quantidade de dias de atraso.
 * @returns {number} Valor da multa (R$ 1,50 por dia; 0 se não houver atraso).
 */
function calcularMulta(diasAtraso) {
    if (diasAtraso > 0) {
      return diasAtraso * 1.5;
    } else {
      return 0;
    }
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
   * Busca um livro pelo título (sem diferenciar maiúsculas de minúsculas).
   * @param {object[]} livros - Lista de livros.
   * @param {string} nome - Título do livro procurado.
   * @returns {object|null} Livro encontrado ou null caso não exista.
   */
  function buscarLivroPorNome(livros, nome) {
    let livroEncontrado = null;
  
    livros.forEach(function (livro) {
      if (livro.titulo.toLowerCase() === nome.trim().toLowerCase()) {
        livroEncontrado = livro;
      }
    });
  
    return livroEncontrado;
  }
  
  /**
   * Busca um usuário pelo nome (sem diferenciar maiúsculas de minúsculas).
   * @param {object[]} usuarios - Lista de usuários.
   * @param {string} nome - Nome do usuário procurado.
   * @returns {object|null} Usuário encontrado ou null caso não exista.
   */
  function buscarUsuarioPorNome(usuarios, nome) {
    let usuarioEncontrado = null;
  
    usuarios.forEach(function (usuario) {
      if (usuario.nome.toLowerCase() === nome.trim().toLowerCase()) {
        usuarioEncontrado = usuario;
      }
    });
  
    return usuarioEncontrado;
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
      if (retirada.idUsuario === idUsuario && retirada.situacao === "ATIVA") {
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
  
  /**
   * Filtra os livros cujo título ou autor contém o termo pesquisado.
   * @param {object[]} livros - Lista de livros.
   * @param {string} termo - Texto pesquisado.
   * @returns {object[]} Lista de livros que combinam com o termo.
   */
  function filtrarLivrosPorTermo(livros, termo) {
    const livrosFiltrados = [];
    const termoMinusculo = termo.trim().toLowerCase();
  
    livros.forEach(function (livro) {
      if (
        livro.titulo.toLowerCase().includes(termoMinusculo) ||
        livro.autor.toLowerCase().includes(termoMinusculo)
      ) {
        livrosFiltrados.push(livro);
      }
    });
  
    return livrosFiltrados;
  }
  
  /**
   * Gera o próximo ID para uma lista de objetos que possuem o campo id.
   * @param {object[]} lista - Lista de objetos (usuários, livros ou retiradas).
   * @returns {number} Maior ID existente somado a 1.
   */
  function gerarProximoId(lista) {
    let maiorId = 0;
  
    lista.forEach(function (item) {
      if (item.id > maiorId) {
        maiorId = item.id;
      }
    });
  
    return maiorId + 1;
  }
  
  /**
   * Valida o cadastro de usuário. Regra de negócio: não aceita usuário repetido.
   * @param {string} nome - Nome de usuário digitado.
   * @param {string} senha - Senha digitada.
   * @param {object[]} usuarios - Lista de usuários já cadastrados.
   * @returns {{valido: boolean, mensagem: string}} Resultado da validação.
   */
  function validarCadastroUsuario(nome, senha, usuarios) {
    if (nome.trim() === "") {
      return { valido: false, mensagem: "Informe o nome de usuário." };
    } else if (senha.length < 6) {
      return {
        valido: false,
        mensagem: "A senha deve ter pelo menos 6 caracteres.",
      };
    } else if (buscarUsuarioPorNome(usuarios, nome) !== null) {
      return { valido: false, mensagem: "Esse usuário já está cadastrado." };
    } else {
      return { valido: true, mensagem: "Usuário cadastrado com sucesso!" };
    }
  }
  
  /**
   * Valida o cadastro de livro. Regra de negócio: não aceita título repetido.
   * @param {string} titulo - Título digitado.
   * @param {string} autor - Autor digitado.
   * @param {string} categoria - Categoria digitada.
   * @param {object[]} livros - Lista de livros já cadastrados.
   * @returns {{valido: boolean, mensagem: string}} Resultado da validação.
   */
  function validarCadastroLivro(titulo, autor, categoria, livros) {
    if (titulo.trim() === "" || autor.trim() === "" || categoria.trim() === "") {
      return { valido: false, mensagem: "Preencha título, autor e categoria." };
    } else if (buscarLivroPorNome(livros, titulo) !== null) {
      return { valido: false, mensagem: "Esse livro já está cadastrado." };
    } else {
      return { valido: true, mensagem: "Livro cadastrado com sucesso!" };
    }
  }
  
  /**
   * Verifica se uma retirada pode ser feita. Regras de negócio: a carteirinha
   * precisa estar ativa, o livro precisa estar disponível e o usuário não pode
   * ter outra retirada ativa.
   * @param {object|null} usuario - Usuário que quer retirar (null se não existir).
   * @param {object|null} livro - Livro desejado (null se não existir).
   * @param {object[]} retiradas - Lista de retiradas.
   * @returns {{permitido: boolean, mensagem: string}} Resultado da verificação.
   */
  function verificarRetirada(usuario, livro, retiradas) {
    if (usuario === null) {
      return { permitido: false, mensagem: "Usuário não encontrado." };
    } else if (livro === null) {
      return { permitido: false, mensagem: "Livro não encontrado." };
    } else if (usuario.carteirinha !== "ATIVA") {
      return {
        permitido: false,
        mensagem: "Carteirinha bloqueada: retirada negada.",
      };
    } else if (!verificarDisponibilidade(livro)) {
      return {
        permitido: false,
        mensagem: "Livro indisponível: já está emprestado.",
      };
    } else if (verificarRetiradaAtiva(usuario.id, retiradas)) {
      return {
        permitido: false,
        mensagem: "O usuário já possui uma retirada ativa.",
      };
    } else {
      return { permitido: true, mensagem: "Retirada realizada com sucesso!" };
    }
  }
  
  /**
   * Procura a retirada ativa de um usuário para um livro.
   * @param {number} idUsuario - ID do usuário.
   * @param {number} idLivro - ID do livro.
   * @param {object[]} retiradas - Lista de retiradas.
   * @returns {object|null} Retirada ativa encontrada ou null.
   */
  function buscarRetiradaAtiva(idUsuario, idLivro, retiradas) {
    let retiradaEncontrada = null;
  
    retiradas.forEach(function (retirada) {
      if (
        retirada.idUsuario === idUsuario &&
        retirada.idLivro === idLivro &&
        retirada.situacao === "ATIVA"
      ) {
        retiradaEncontrada = retirada;
      }
    });
  
    return retiradaEncontrada;
  }
  
  /**
   * Conta quantos livros existem em cada situação.
   * @param {object[]} livros - Lista de livros.
   * @returns {{disponiveis: number, emprestados: number}} Totais por situação.
   */
  function contarLivrosPorSituacao(livros) {
    const totais = { disponiveis: 0, emprestados: 0 };
  
    livros.forEach(function (livro) {
      if (livro.situacao === "DISPONÍVEL") {
        totais.disponiveis++;
      } else {
        totais.emprestados++;
      }
    });
  
    return totais;
  }