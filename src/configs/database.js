const Database = require('better-sqlite3');
const db = new Database('dados.db', {
  verbose: console.log
});

db.exec(`PRAGMA foreign_keys = ON;`);

db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    cpf       TEXT    UNIQUE NOT NULL,
    name      TEXT    NOT NULL,
    password  TEXT    NOT NULL,
    role      TEXT    NOT NULL
                 CHECK(role IN ('ADMIN','CLIENTE'))
  );

  CREATE TABLE IF NOT EXISTS phone (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    number        TEXT    NOT NULL,
    is_principal  BOOLEAN NOT NULL,
    id_user       INTEGER NOT NULL,
    FOREIGN KEY(id_user) REFERENCES user(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS email (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT    NOT NULL,
    is_principal  BOOLEAN NOT NULL,
    id_user       INTEGER NOT NULL,
    FOREIGN KEY(id_user) REFERENCES user(id) ON DELETE CASCADE
  );
`);

module.exports = { db };
