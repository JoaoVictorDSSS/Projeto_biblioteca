// Funções ligadas aos botões das telas: leem os campos, chamam funcoes.js
// e mostram o resultado na página com innerHTML.

function cadastrarUsuario() {
    const nome = document.getElementById("Usuario").value;
    const senha = document.getElementById("senha").value;
    const validacao = validarCadastroUsuario(nome, senha, usuarios);
  
    if (validacao.valido) {
      usuarios.push({
        id: gerarProximoId(usuarios),
        nome: nome.trim(),
        email: "",
        senha: senha,
        carteirinha: "ATIVA",
      });
    }
  
    document.getElementById("resultado").innerHTML = validacao.mensagem;
  }
  
  function cadastrarLivro() {
    const titulo = document.getElementById("titulo").value;
    const autor = document.getElementById("autor").value;
    const categoria = document.getElementById("categoria").value;
    const validacao = validarCadastroLivro(titulo, autor, categoria, livros);
  
    if (validacao.valido) {
      livros.push({
        id: gerarProximoId(livros),
        titulo: titulo.trim(),
        autor: autor.trim(),
        categoria: categoria.trim(),
        situacao: "DISPONÍVEL",
      });
    }
  
    document.getElementById("resultado").innerHTML = validacao.mensagem;
  }
  
  function mostrarLivros(lista) {
    let html = "";
  
    lista.forEach(function (livro) {
      html +=
        "<p><strong>" +
        livro.titulo +
        "</strong> - " +
        livro.autor +
        " (" +
        livro.categoria +
        ") - " +
        livro.situacao +
        "</p>";
    });
  
    if (lista.length === 0) {
      html = "<p>Nenhum livro encontrado.</p>";
    }
  
    document.getElementById("listaLivros").innerHTML = html;
  }
  
  function pesquisarLivros() {
    const termo = document.getElementById("busca").value;
    mostrarLivros(filtrarLivrosPorTermo(livros, termo));
  }
  
  function mostrarLivrosDisponiveis() {
    mostrarLivros(listarLivrosDisponiveis(livros));
  }
  
  function retirarLivro() {
    const usuario = buscarUsuarioPorNome(
      usuarios,
      document.getElementById("nomeUsuario").value,
    );
    const livro = buscarLivroPorNome(
      livros,
      document.getElementById("tituloLivro").value,
    );
    const verificacao = verificarRetirada(usuario, livro, retiradas);
  
    if (verificacao.permitido) {
      retiradas.push({
        id: gerarProximoId(retiradas),
        idUsuario: usuario.id,
        idLivro: livro.id,
        situacao: "ATIVA",
        diasAtraso: 0,
      });
      livro.situacao = "EMPRESTADO";
    }
  
    document.getElementById("resultado").innerHTML = verificacao.mensagem;
  }
  
  function devolverLivro() {
    const usuario = buscarUsuarioPorNome(
      usuarios,
      document.getElementById("nomeUsuario").value,
    );
    const livro = buscarLivroPorNome(
      livros,
      document.getElementById("tituloLivro").value,
    );
    let mensagem = "";
  
    if (usuario === null || livro === null) {
      mensagem = "Usuário ou livro não encontrado.";
    } else {
      const retirada = buscarRetiradaAtiva(usuario.id, livro.id, retiradas);
  
      if (retirada === null) {
        mensagem = "Não há retirada ativa desse livro para esse usuário.";
      } else {
        const multa = calcularMulta(retirada.diasAtraso);
        retirada.situacao = "DEVOLVIDA";
        livro.situacao = "DISPONÍVEL";
        mensagem =
          "Devolução registrada. Multa: R$ " + multa.toFixed(2).replace(".", ",");
      }
    }
  
    document.getElementById("resultado").innerHTML = mensagem;
  }
  
  function mostrarRelatorio() {
    const totais = contarLivrosPorSituacao(livros);
  
    document.getElementById("relatorio").innerHTML =
      "<p>Disponíveis: " +
      totais.disponiveis +
      " | Emprestados: " +
      totais.emprestados +
      "</p>" +
      "<pre>" +
      JSON.stringify(livros, null, 2) +
      "</pre>";
  }
  
  // Na tela de catálogo, já mostra todos os livros ao abrir a página.
  if (document.getElementById("listaLivros") !== null) {
    mostrarLivros(livros);
  }