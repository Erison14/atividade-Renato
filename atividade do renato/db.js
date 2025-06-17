const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./sample_db.sqlite', (err) => {
  if (err) {
    console.error('Erro ao abrir banco de dados:', err.message);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      matricula TEXT PRIMARY KEY,
      nome TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS livros (
      isbn TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      ano INTEGER NOT NULL,
      quantidade INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS emprestimos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT NOT NULL,
      livro TEXT NOT NULL,
      data_emprestimo TEXT NOT NULL,
      data_prevista TEXT NOT NULL,
      data_devolucao TEXT,
      status TEXT NOT NULL,
      FOREIGN KEY (usuario) REFERENCES usuarios(matricula),
      FOREIGN KEY (livro) REFERENCES livros(isbn)
    )
  `);
});

module.exports = db;
