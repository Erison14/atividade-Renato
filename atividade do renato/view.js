const readline = require('readline-sync');
const controller = require('./controller');

async function main() {
  while (true) {
    console.log('\n===== Menu Biblioteca =====');
    console.log('1. Emprestar livro');
    console.log('2. Devolver livro');
    console.log('3. Cadastrar usuário');
    console.log('4. Sair');
    console.log('5. Cadastrar livro');
    console.log('6. Listar livros cadastrados');
    const op = readline.question('opcao: ');

    if (op === '4') {
      console.log('Saindo...');
      break;
    }

    try {
      switch (op) {
        case '1': {
          const matricula = readline.question('Matricula: ');
          const isbn = readline.question('ISBN do livro: ');
          const msg = await controller.emprestarLivro(matricula, isbn);
          console.log(msg);
          break;
        }

        case '2': {
          const id = readline.questionInt('ID do emprestimo para devolucao: ');
          const msg = await controller.devolverLivro(id);
          console.log(msg);
          break;
        }

        case '3': {
          const matricula = readline.question('Matricula do novo usuario: ');
          const nome = readline.question('Nome do usuario: ');
          const msg = await controller.cadastrarUsuario(matricula, nome);
          console.log(msg);
          break;
        }

        case '5': {
          const isbn = readline.question('ISBN do livro: ');
          const titulo = readline.question('Titulo do livro: ');
          const autor = readline.question('Autor: ');
          const ano = readline.questionInt('Ano de publicacao: ');
          const quantidade = readline.questionInt('Quantidade em estoque: ');
          const msg = await controller.cadastrarLivro(isbn, titulo, autor, ano, quantidade);
          console.log(msg);
          break;
        }

        case '6': {
          const livros = await controller.mostrarLivros();
          console.log('\n--- Livros cadastrados ---');
          livros.forEach((livro, i) => {
            console.log(`${i + 1}. ISBN: ${livro.isbn} | Titulo: ${livro.titulo} | Autor: ${livro.autor} | Ano: ${livro.ano} | Quantidade: ${livro.quantidade}`);
          });
          break;
        }

        default:
          console.log('Opcao invalida.');
      }
    } catch (error) {
      console.log('Erro:', error);
    }
  }
}

main();

