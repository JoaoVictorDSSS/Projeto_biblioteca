const usuarios = [
    {
        id: 1,
        nome: "João",
        email: "joao@email.com",
        senha: "123456",
        carteirinha: "ATIVA"
    },
    {
        id: 2,
        nome: "Maria",
        email: "maria@email.com",
        senha: "abcdef",
        carteirinha: "BLOQUEADA"
    }
];

const livros = [
    {
        id: 1,
        titulo: "Dom Casmurro",
        autor: "Machado de Assis",
        categoria: "Romance",
        situacao: "DISPONÍVEL"
    },
    {
        id: 2,
        titulo: "O Hobbit",
        autor: "J. R. R. Tolkien",
        categoria: "Fantasia",
        situacao: "EMPRESTADO"
    },
    {
        id: 3,
        titulo: "1984",
        autor: "George Orwell",
        categoria: "Ficção",
        situacao: "DISPONÍVEL"
    }
];

const retiradas = [
    {
        id: 1,
        idUsuario: 2,
        idLivro: 2,
        situacao: "ATIVA",
        diasAtraso: 0
    }
];