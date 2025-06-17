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
    const verificaSql = 'SELECT quantidade FROM livros WHERE isbn = ?';
    db.get(verificaSql, [isbn], (err, livro) => {
      if (err) return reject(err);
      if (!livro) return reject('Livro não encontrado');
      if (livro.quantidade <= 0) return reject('Livro não disponível para empréstimo');

      const atualizaSql = 'UPDATE livros SET quantidade = quantidade - 1 WHERE isbn = ?';
      db.run(atualizaSql, [isbn], function(err) {
        if (err) return reject(err);

        const dataEmprestimo = new Date().toISOString();
        const dataPrevista = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

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
    const verificaSql = 'SELECT livro, status, data_prevista FROM emprestimos WHERE id = ?';
    db.get(verificaSql, [id], (err, emprestimo) => {
      if (err) return reject(err);
      if (!emprestimo) return reject('Empréstimo não encontrado');
      if (emprestimo.status !== 'ativo') return reject('Empréstimo já devolvido');

      const dataDevolucao = new Date();
      const dataPrevista = new Date(emprestimo.data_prevista);

      let mensagem = 'Livro devolvido com sucesso!';
      if (dataDevolucao > dataPrevista) {
        const atrasoMs = dataDevolucao - dataPrevista;
        const diasAtraso = Math.ceil(atrasoMs / (1000 * 60 * 60 * 24));
        mensagem = `Livro devolvido com atraso de ${diasAtraso} dia(s)!`;
      }

      const updateEmprestimoSql = `
        UPDATE emprestimos 
        SET status = 'devolvido', data_devolucao = ? 
        WHERE id = ?`;

      db.run(updateEmprestimoSql, [dataDevolucao.toISOString(), id], function(err) {
        if (err) return reject(err);

        const updateLivroSql = 'UPDATE livros SET quantidade = quantidade + 1 WHERE isbn = ?';
        db.run(updateLivroSql, [emprestimo.livro], function(err) {
          if (err) reject(err);
          else resolve(mensagem);
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
