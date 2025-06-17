//cria as tabelas

const sqlite3 = require('sqlite3').verbose();

db.serialize(() => {
  // Criar tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      matricula TEXT PRIMARY KEY,
      nome TEXT NOT NULL
    )
  `);

  // Criar tabela de livros
  db.run(`
    CREATE TABLE IF NOT EXISTS livros (
      isbn TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      ano INTEGER NOT NULL,
      quantidade INTEGER NOT NULL
    )
  `);

  // Criar tabela de empréstimos
  db.run(`
    CREATE TABLE IF NOT EXISTS emprestimos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      matricula TEXT NOT NULL,
      isbn TEXT NOT NULL,
      data TEXT NOT NULL,
      FOREIGN KEY (matricula) REFERENCES usuarios(matricula),
      FOREIGN KEY (isbn) REFERENCES livros(isbn)
    )
  `);
});

db.close(() => {
  console.log('Banco de dados criado com sucesso!');
});
