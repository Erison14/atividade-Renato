const db = require('./db'); // conexão com o SQLite

module.exports = {
  // Busca um usuário pela matrícula
  getUsuario: (matricula, cb) => {
    db.get('SELECT * FROM usuarios WHERE matricula = ?', [matricula], cb);
  },

  // Cadastra um novo usuário
  cadastrarUsuario: (matricula, nome, cb) => {
    db.run(
      'INSERT INTO usuarios (matricula, nome) VALUES (?, ?)',
      [matricula, nome],
      cb
    );
  },

  // Busca um livro pelo ISBN
  getLivro: (isbn, cb) => {
    db.get('SELECT * FROM livros WHERE isbn = ?', [isbn], cb);
  },

  // Cadastra um novo livro
  cadastrarLivro: (isbn, titulo, autor, ano, quantidade, cb) => {
    db.run(
      'INSERT INTO livros (isbn, titulo, autor, ano, quantidade) VALUES (?, ?, ?, ?, ?)',
      [isbn, titulo, autor, ano, quantidade],
      cb
    );
  },

  // Conta quantos livros o usuário tem emprestados e ainda não devolvidos
  countEmprestimos: (matricula, cb) => {
    db.get(
      'SELECT COUNT(*) as total FROM emprestimos WHERE usuario = ? AND status = "ativo"',
      [matricula],
      cb
    );
  },

  // Cria um novo empréstimo
  criarEmprestimo: (matricula, isbn, dataEmprestimo, dataPrevista, cb) => {
    db.run(
      'INSERT INTO emprestimos (usuario, livro, data_emprestimo, data_prevista, status) VALUES (?, ?, ?, ?, ?)',
      [matricula, isbn, dataEmprestimo, dataPrevista, 'ativo'],
      function (err) {
        if (err) return cb(err);
        cb(null, this.lastID); // id do empréstimo criado
      }
    );
  },

  // Atualiza um empréstimo como devolvido
  devolverLivro: (id, dataDevolucao, status, cb) => {
    db.run(
      'UPDATE emprestimos SET data_devolucao = ?, status = ? WHERE id = ?',
      [dataDevolucao, status, id],
      cb
    );
  },

  // Diminui o estoque ao emprestar
  baixarEstoque: (isbn, cb) => {
    db.run(
      'UPDATE livros SET quantidade = quantidade - 1 WHERE isbn = ? AND quantidade > 0',
      [isbn],
      cb
    );
  },

  // Aumenta o estoque ao devolver
  subirEstoque: (isbn, cb) => {
    db.run(
      'UPDATE livros SET quantidade = quantidade + 1 WHERE isbn = ?',
      [isbn],
      cb
    );
  },

  // Busca um empréstimo pelo id
  getEmprestimo: (id, cb) => {
    db.get('SELECT * FROM emprestimos WHERE id = ?', [id], cb);
  },

  // Lista os livros cadastrados
  listarLivros: (callback) => {
    db.all('SELECT * FROM livros', [], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },
};
