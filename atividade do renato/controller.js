const db = require('./db');

function cadastrarUsuario(matricula, nome) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO usuarios (matricula, nome) VALUES (?, ?)';
    db.run(sql, [matricula, nome], function(err) {
      if (err) reject(err);
      else resolve('Usuário cadastrado com sucesso!');
    });
  });
}

function cadastrarLivro(isbn, titulo, autor, ano, quantidade) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO livros (isbn, titulo, autor, ano, quantidade) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [isbn, titulo, autor, ano, quantidade], function(err) {
      if (err) reject(err);
      else resolve('Livro cadastrado com sucesso!');
    });
  });
}

function emprestarLivro(matricula, isbn) {
  return new Promise((resolve, reject) => {
    // Primeiro, verifica se o livro está disponível
    const verificaSql = 'SELECT quantidade FROM livros WHERE isbn = ?';
    db.get(verificaSql, [isbn], (err, livro) => {
      if (err) return reject(err);
      if (!livro) return reject('Livro não encontrado');
      if (livro.quantidade <= 0) return reject('Livro não disponível para empréstimo');

      // Atualiza quantidade do livro
      const atualizaSql = 'UPDATE livros SET quantidade = quantidade - 1 WHERE isbn = ?';
      db.run(atualizaSql, [isbn], function(err) {
        if (err) return reject(err);

        // Insere registro de empréstimo
        const dataEmprestimo = new Date().toISOString();
        const dataPrevista = new Date(Date.now() + 7*24*60*60*1000).toISOString(); // 7 dias depois

        const insertSql = `INSERT INTO emprestimos 
          (usuario, livro, data_emprestimo, data_prevista, status) 
          VALUES (?, ?, ?, ?, 'ativo')`;

        db.run(insertSql, [matricula, isbn, dataEmprestimo, dataPrevista], function(err) {
          if (err) reject(err);
          else resolve('Empréstimo realizado com sucesso!');
        });
      });
    });
  });
}

function devolverLivro(id) {
  return new Promise((resolve, reject) => {
    // Verifica se empréstimo existe e está ativo
    const verificaSql = 'SELECT livro, status FROM emprestimos WHERE id = ?';
    db.get(verificaSql, [id], (err, emprestimo) => {
      if (err) return reject(err);
      if (!emprestimo) return reject('Empréstimo não encontrado');
      if (emprestimo.status !== 'ativo') return reject('Empréstimo já devolvido');

      // Atualiza status e data de devolução
      const dataDevolucao = new Date().toISOString();
      const updateEmprestimoSql = `UPDATE emprestimos 
                                   SET status = 'devolvido', data_devolucao = ? 
                                   WHERE id = ?`;
      db.run(updateEmprestimoSql, [dataDevolucao, id], function(err) {
        if (err) return reject(err);

        // Atualiza quantidade do livro (+1)
        const updateLivroSql = `UPDATE livros SET quantidade = quantidade + 1 WHERE isbn = ?`;
        db.run(updateLivroSql, [emprestimo.livro], function(err) {
          if (err) reject(err);
          else resolve('Livro devolvido com sucesso!');
        });
      });
    });
  });
}

function mostrarLivros() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM livros';
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = {
  cadastrarUsuario,
  cadastrarLivro,
  emprestarLivro,
  devolverLivro,
  mostrarLivros
};


