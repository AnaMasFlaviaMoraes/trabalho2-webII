const { db } = require("../configs/database.js")

class UserDao {

    constructor(){}
    
    getAll(){
        const stmt = db.prepare('SELECT * FROM user')
        return stmt.all()
    }

    getByCpf(cpf){
        const stmt = db.prepare(`SELECT * FROM user WHERE cpf = ?`)
        return stmt.get(cpf)
    }

    async getLast(){
        const stmt = db.prepare(`SELECT * FROM user LIMIT 1`)
        return stmt.get()
    }

    insert(user){
        const stmt = db.prepare(`INSERT INTO 
        user (cpf, name, password, role) 
        VALUES (?, ?, ?, ?)`)
        return stmt.run(user.cpf, 
            user.name, user.password, user.role)
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