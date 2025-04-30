const { db } = require("../configs/database.js")
const { inspect } = require('util')

class UserDao {

    constructor(){}
    
    async getAll(){
        const stmt = db.prepare('SELECT * FROM user');
        return stmt.all();
    }

    async getByCpf(cpf){
        const stmt = db.prepare(`SELECT * FROM user WHERE cpf = ?`);
        return stmt.get(cpf);
    }

    async getById(id){
        const stmt = db.prepare(`SELECT * FROM user WHERE id = ?`);
        return stmt.get(id);
    }

    async existAnyUser(){
        const stmt = db.prepare(`SELECT 1 FROM user LIMIT 1`);
          const row = stmt.get();
          return Boolean(row);
    }

    async getByName(name){
        const stmt = db.prepare(`SELECT * FROM user WHERE name LIKE ?`);
        return stmt.all(`%${name}%`);
    }

    async login(cpf, senha){
        const stmt = db.prepare(`SELECT * FROM user WHERE cpf = ? and password = ?`);
        return stmt.get(cpf, senha);
    }

    async getLast(){
        const stmt = db.prepare(`SELECT * FROM user LIMIT 1`);
        return stmt.get();
    }

    async insert(user){
        console.log('insert user ' + inspect(user));
        const stmt = db.prepare(`INSERT INTO 
        user (cpf, name, password, role) 
        VALUES (?, ?, ?, ?)`);
        console.log('stmt ' + inspect(stmt));
        let newUser = stmt.run(user.cpf, 
            user.nome, user.senha, user.role);
        console.log('u ' + inspect(newUser));
        return newUser.lastInsertRowid;
    }

    update(cpf, name, password, role){
        const stmt = db.prepare(`UPDATE user SET name = ?, password = ?, role = ? WHERE cpf = ?`);
        return stmt.run(name, password, role, cpf);
    }

    delete(id){
        const stmt = db.prepare(`DELETE FROM user WHERE id = ?`);
        return stmt.run(id);
    }
}

module.exports = {
    UserDao
}