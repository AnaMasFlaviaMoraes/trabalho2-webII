const { db } = require("../configs/database.js")
const { inspect } = require('util')

class UserDao {

    constructor(){}
    
    getAll(){
        const stmt = db.prepare('SELECT cpf, name, role FROM user')
        return stmt.all()
    }

    getByCpf(cpf){
        const stmt = db.prepare(`SELECT * FROM user WHERE cpf = ?`)
        return stmt.get(cpf)
    }

    async getByName(name){
        const stmt = db.prepare(`SELECT * FROM user WHERE name LIKE ?`)
        return stmt.all(`%${name}%`)
    }

    async login(cpf, senha){
        const stmt = db.prepare(`SELECT * FROM user WHERE cpf = ? and password = ?`)
        return stmt.get(cpf, senha) 
    }

    async getLast(){
        const stmt = db.prepare(`SELECT * FROM user LIMIT 1`)
        return stmt.get()
    }

    async insert(user){
        console.log('insert user ' + inspect(user))
        const stmt = db.prepare(`INSERT INTO 
        user (cpf, name, password, role) 
        VALUES (?, ?, ?, ?)`)
        console.log('stmt ' + inspect(stmt))
        let u = stmt.run(user.cpf, 
            user.nome, user.senha, user.role)
        console.log('u ' + inspect(u))
        return u
    }

    update(cpf, name, password, role){
        const stmt = this.db.prepare(`UPDATE user SET name = ?, password = ?, role = ? WHERE cpf = ?`)
        return stmt.run(name, password, role, cpf)
    }

    delete(cpf){
        const stmt = this.db.prepare(`DELETE FROM user WHERE cpf = ?`)
        return stmt.run(cpf)
    }
}

module.exports = {
    UserDao
}