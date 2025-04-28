const Database = require('better-sqlite3');

const db = new Database('dados.db', {
   verbose: console.log 
});

db.exec(`
    CREATE TABLE IF NOT EXISTS user (
        cpf TEXT PRIMARY KEY UNIQUE,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        role CHECK(role IN ('ADMIN', 'CLIENTE')) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS phone (
        number TEXT PRIMARY KEY NOT NULL,
        is_principal BOOLEAN NOT NULL,
        cpf_user TEXT NOT NULL REFERENCES user
    );

    CREATE TABLE IF NOT EXISTS email (
        email TEXTO PRIMARY KEY NOT NULL,
        is_principal BOOLEAN NOT NULL,
        cpf_user TEXT NOT NULL REFERENCES user
    );
   
`);

module.exports = { db }

