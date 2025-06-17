const readline = require('readline-sync');
const controller = require('./controller');

async function menu() {
  while (true) {
    console.log('\n=== Sistema Biblioteca ===');
    console.log('1. Cadastrar usuario');
    console.log('2. Cadastrar livro');
    console.log('3. Emprestar livro');
    console.log('4. Devolver livro');
    console.log('5. Mostrar livros');
    console.log('0. Sair');
    const opcao = readline.question('Escolha uma opção: ');

    try {
      if (opcao === '1') {
        const matricula = readline.question('Matricula do usuario: ');
        const nome = readline.question('Nome do usuario: ');
        const resultado = await controller.cadastrarUsuario(matricula, nome);
        console.log(resultado);

      } else if (opcao === '2') {
        const isbn = readline.question('ISBN do livro: ');
        const titulo = readline.question('Título do livro: ');
        const autor = readline.question('Autor do livro: ');
        const ano = parseInt(readline.question('Ano do livro: '), 10);
        const quantidade = parseInt(readline.question('Quantidade: '), 10);
        const resultado = await controller.cadastrarLivro(isbn, titulo, autor, ano, quantidade);
        console.log(resultado);

      } else if (opcao === '3') {
        const matricula = readline.question('Matricula do usuário: ');
        const isbn = readline.question('ISBN do livro: ');
        const resultado = await controller.emprestarLivro(matricula, isbn);
        console.log(resultado);

      } else if (opcao === '4') {
        const id = parseInt(readline.question('ID do empréstimo: '), 10);
        const resultado = await controller.devolverLivro(id);
        console.log(resultado);

      } else if (opcao === '5') {
        const livros = await controller.mostrarLivros();
        console.log('\nLivros cadastrados:');
        livros.forEach(livro => {
          console.log(`ISBN: ${livro.isbn} | Título: ${livro.titulo} | Autor: ${livro.autor} | Ano: ${livro.ano} | Quantidade: ${livro.quantidade}`);
        });

      } else if (opcao === '0') {
        console.log('Saindo...');
        process.exit(0);

      } else {
        console.log('Opção invalida. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  }
}

menu();
