const { db } = require("../configs/database.js")

class PhoneDao {

    getByUser(cpf_user){
        const stmt = db.prepare('SELECT * FROM phone WHERE cpf_user = ?')
        return stmt.all(cpf_user)
    }

    async getPhonePrincipal(cpf_user){
        const stmt = db.prepare(`SELECT * FROM phone WHERE cpf_user = ? and is_principal = 'true'`)
        return stmt.get(cpf_user)
    }

    async getByNumber(number){
        const stmt = db.prepare(`SELECT * FROM phone WHERE number = ?`)
        return stmt.get(number)
    }

    insert(phone) {
        const stmt = db.prepare(`INSERT INTO phone (number, cpf_user, is_principal)
        VALUES (?, ?, ?)`)

        return stmt.run(phone.number, phone.cpf, phone.isPrincipal)
    }

    update(cpf_user, number, is_principal){
        const stmt = db.prepare(`UPDATE phone SET number = ?, is_principal = ? WHERE cpf_user = ?`)
        return stmt.run(number, is_principal, cpf_user)
    }

    delete(id){
        const stmt = db.prepare(`DELETE FROM phone WHERE id = ?`)
        return stmt.run(id)
    }

    deleteByUser(cpf_user){
        const stmt = db.prepare(`DELETE FROM phone WHERE cpf_user = ?`)
        return stmt.run(cpf_user)
    }
}

module.exports = {
    PhoneDao
}