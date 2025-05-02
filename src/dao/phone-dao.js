const { db } = require("../configs/database.js")

class PhoneDao {

    async getByUser(id_user){
        const stmt = db.prepare('SELECT * FROM phone WHERE id_user = ?')
        return stmt.all(id_user)
    }

    async getById(id){
        const stmt = db.prepare('SELECT * FROM phone WHERE id = ?')
        return stmt.get(id);
    }

    async getPhonePrincipal(id_user){
        const stmt = db.prepare(`SELECT * FROM phone WHERE id_user = ? and is_principal = 'true'`)
        return stmt.get(id_user)
    }

    async getByNumber(number){
        const stmt = db.prepare(`SELECT * FROM phone WHERE number = ?`)
        return stmt.get(number)
    }

    async insert(phone) {
        const stmt = db.prepare(`INSERT INTO phone (number, id_user, is_principal)
        VALUES (?, ?, ?)`)

        return stmt.run(phone.number, phone.id_user, phone.isPrincipal)
    }

    async update(id_user, number, is_principal){
        const stmt = db.prepare(`UPDATE phone SET number = ?, is_principal = ? WHERE id_user = ?`)
        return stmt.run(number, is_principal, id_user)
    }

    async delete(id){
        const stmt = db.prepare(`DELETE FROM phone WHERE id = ?`)
        return stmt.run(id)
    }

    async deleteByUser(id_user){
        const stmt = db.prepare(`DELETE FROM phone WHERE id_user = ?`)
        return stmt.run(id_user)
    }
}

module.exports = {
    PhoneDao
}