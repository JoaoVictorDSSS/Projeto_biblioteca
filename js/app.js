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
  
  async function cadastrarLivro() {
    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const categoria = Number(document.getElementById("categoria").value);
    const sinopse = document.getElementById("sinopse").value.trim();
    const editora = document.getElementById("editora").value.trim();
    const anoPublicacao = Number(document.getElementById("anoPublicacao").value);
    const localizacao = document.getElementById("localizacao").value.trim();

    const resultado = document.getElementById("resultado");

    // Validação dos campos
    if (!titulo || !autor || !categoria || !sinopse || !editora || !anoPublicacao || !localizacao) {
        resultado.innerText = "Preencha todos os campos.";
        return;
    }

    if (!Number.isInteger(categoria) || categoria < 1) {
        resultado.innerText = "A categoria deve ser um número inteiro positivo.";
        return;
    }

    // Monta o objeto que será enviado para a API
    const livro = {
        titulo_livro: titulo,
        autor_livro: autor,
        categoria_livro: categoria,
        sinopse_livro: sinopse,
        editora_livro: editora,
        ano_publicacao: anoPublicacao,
        localizacao_livro: localizacao
    };

    try {
        const resposta = await fetch("http://127.0.0.1:8000/livros", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(livro)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.detail || "Erro ao cadastrar livro.");
        }

        resultado.innerText =
            dados.mensagem + " ID: " + dados.id_livro;

        // Limpa os campos após o cadastro
        document.getElementById("titulo").value = "";
        document.getElementById("autor").value = "";
        document.getElementById("categoria").value = "";
        document.getElementById("sinopse").value = "";
        document.getElementById("editora").value = "";
        document.getElementById("anoPublicacao").value = "";
        document.getElementById("localizacao").value = "";

    } catch (erro) {
        resultado.innerText = "Erro: " + erro.message;
        console.error(erro);
    }
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